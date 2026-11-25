import type { PairingAnalysis } from './taxonomy';
import { APP_SWIPE_PROFILES } from '../data/appProfiles';
import { EPISODES, type Episode, type StatDeltas } from '../data/episodes';

export interface Stats {
  maturity: number;
  chivalry: number;
  eq: number;
  chemistry: number;
}

export interface ChoiceHistoryEntry {
  episodeId: string;
  choiceIndex: number;
  previousStats: Stats;
  previousRedFlags: number;
  outcomeText: string;
  toastBanner: string;
  badgeUnlocked?: string;
}

export interface AppSwipeRecord {
  profileId: string;
  direction: 'left' | 'right';
  caughtTrap: boolean;
}

export type RunStatus = 'playing' | 'busted' | 'completed';

export interface GameRunState {
  pairing: PairingAnalysis;
  stats: Stats;
  redFlags: number;
  status: RunStatus;
  swipes: AppSwipeRecord[];
  episodeQueue: Episode[];
  currentEpisodeIndex: number;
  history: ChoiceHistoryEntry[];
  badges: string[];
}

export interface RunSummary {
  pairing: PairingAnalysis;
  stats: Stats;
  redFlags: number;
  overallScore: number;
  rankTitle: string;
  verdictLine: string;
  badges: string[];
  caughtBottleTrap: boolean;
  episodeHighlights: { title: string; emoji: string }[];
}

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function buildEpisodeQueue(
  pairing: PairingAnalysis,
  includeVipEpisodeIds: string[] = [],
  singleDilemmaId?: string,
): Episode[] {
  if (singleDilemmaId) {
    const target = EPISODES.find((e) => e.id === singleDilemmaId);
    if (target) return [target];
  }

  const tags = new Set(pairing.activeSubplotTags);
  const queue: Episode[] = [];

  const pushById = (id: string) => {
    const found = EPISODES.find((e) => e.id === id);
    if (found && !queue.some((q) => q.id === found.id)) {
      queue.push(found);
    }
  };

  // Core Act II arc tailored to pairing tags
  pushById('check-drop');
  pushById('waiter-son-incident');
  pushById('code-switch-texting');

  if (tags.has('single_mom_sitter')) {
    pushById('babysitter-flake-test');
  }
  if (tags.has('princess_treatment')) {
    pushById('princess-soft-life');
  }

  pushById('trail-run-short-leash');
  pushById('mirror-game-insecurities');

  // Inject unlocked VIP Act II episodes before Act II payoff
  for (const vipId of includeVipEpisodeIds) {
    const ep = EPISODES.find((e) => e.id === vipId && e.act === 2);
    if (ep) pushById(ep.id);
  }

  pushById('houseboy-sunday-sanctuary');

  // Inject unlocked VIP Act III episodes
  for (const vipId of includeVipEpisodeIds) {
    const ep = EPISODES.find((e) => e.id === vipId && e.act === 3);
    if (ep) pushById(ep.id);
  }

  // Core Act III Boss Fight routed from life-situation tags
  if (tags.has('done_with_kids') || tags.has('wants_kids_someday')) {
    pushById('fertility-kids-crossroads');
  } else {
    pushById('adult-kid-brunch');
  }

  return queue;
}

export function createRun(
  pairing: PairingAnalysis,
  includeVipEpisodeIds: string[] = [],
  singleDilemmaId?: string,
): GameRunState {
  return {
    pairing,
    stats: {
      maturity: 50,
      chivalry: 50,
      eq: 50,
      chemistry: 50,
    },
    redFlags: 0,
    status: 'playing',
    swipes: [],
    episodeQueue: buildEpisodeQueue(pairing, includeVipEpisodeIds, singleDilemmaId),
    currentEpisodeIndex: 0,
    history: [],
    badges: [],
  };
}

export function recordAppSwipe(
  run: GameRunState,
  profileId: string,
  direction: 'left' | 'right',
): GameRunState {
  const profile = APP_SWIPE_PROFILES.find((p) => p.id === profileId);
  if (!profile || run.status !== 'playing') return run;

  let stats = { ...run.stats };
  let redFlags = run.redFlags;
  let caughtTrap = false;
  const badges = [...run.badges];

  if (!profile.isGreenFlagMatch && direction === 'left') {
    caughtTrap = true;
    stats.maturity = clampStat(stats.maturity + 6);
    stats.eq = clampStat(stats.eq + 5);
    if (profile.id === 'connor-bottle-trap' && !badges.includes('Caught the Tito’s Bottle')) {
      badges.push('Caught the Tito’s Bottle');
    }
  } else if (!profile.isGreenFlagMatch && direction === 'right') {
    redFlags += 1;
    stats.maturity = clampStat(stats.maturity - 10);
  } else if (profile.isGreenFlagMatch && direction === 'right') {
    stats.chemistry = clampStat(stats.chemistry + 6);
    stats.chivalry = clampStat(stats.chivalry + 5);
  }

  const nextStatus: RunStatus = redFlags >= 3 ? 'busted' : run.status;

  return {
    ...run,
    stats,
    redFlags,
    status: nextStatus,
    badges,
    swipes: [...run.swipes, { profileId, direction, caughtTrap }],
  };
}

function addDeltas(stats: Stats, deltas: StatDeltas): Stats {
  return {
    maturity: clampStat(stats.maturity + deltas.maturity),
    chivalry: clampStat(stats.chivalry + deltas.chivalry),
    eq: clampStat(stats.eq + deltas.eq),
    chemistry: clampStat(stats.chemistry + deltas.chemistry),
  };
}

export function applyEpisodeChoice(run: GameRunState, choiceIndex: number): GameRunState {
  if (run.status !== 'playing') return run;
  const episode = run.episodeQueue[run.currentEpisodeIndex];
  if (!episode) return { ...run, status: 'completed' };

  const choice = episode.choices[choiceIndex] ?? episode.choices[0];

  // Spec §2.5.4 & Task 4: Houseboy Sunday fade-to-black payoff requires Maturity >= 60 && EQ >= 60
  const failsHouseboyGate =
    episode.id === 'houseboy-sunday-sanctuary' &&
    choiceIndex === 0 &&
    (run.stats.maturity < 60 || run.stats.eq < 60);

  const effectiveDeltas: StatDeltas = failsHouseboyGate
    ? { maturity: 5, chivalry: 5, eq: 5, chemistry: 0, redFlags: 0 }
    : choice.deltas;

  const nextStats = addDeltas(run.stats, effectiveDeltas);
  const nextRedFlags = Math.max(0, run.redFlags + effectiveDeltas.redFlags);
  const outcomeText = failsHouseboyGate
    ? 'Hold up—her peaceful solo sanctuary has standards! Because Maturity & EQ haven’t both cleared 60 yet, she keeps Sunday to patio coffee and friendly boundaries instead of unlocking Linen-Apron Houseboy privileges.'
    : run.pairing.role === 'her'
      ? choice.outcomeHer
      : choice.outcomeHim;

  const toastBanner = failsHouseboyGate
    ? 'SOLO-SANCTUARY VETTING GATE (NEEDS 60+ MATURITY & EQ)'
    : choice.toastBanner;

  const badgeUnlocked = failsHouseboyGate ? undefined : choice.badgeUnlocked;

  const nextBadges =
    badgeUnlocked && !run.badges.includes(badgeUnlocked)
      ? [...run.badges, badgeUnlocked]
      : run.badges;

  const entry: ChoiceHistoryEntry = {
    episodeId: episode.id,
    choiceIndex,
    previousStats: { ...run.stats },
    previousRedFlags: run.redFlags,
    outcomeText,
    toastBanner,
    badgeUnlocked,
  };

  const nextHistory = [...run.history, entry];

  if (nextRedFlags >= 3) {
    return {
      ...run,
      stats: nextStats,
      redFlags: nextRedFlags,
      status: 'busted',
      history: nextHistory,
      badges: nextBadges,
    };
  }

  const nextIndex = run.currentEpisodeIndex + 1;
  const nextStatus: RunStatus = nextIndex >= run.episodeQueue.length ? 'completed' : 'playing';

  return {
    ...run,
    stats: nextStats,
    redFlags: nextRedFlags,
    currentEpisodeIndex: nextIndex,
    status: nextStatus,
    history: nextHistory,
    badges: nextBadges,
  };
}

export function rewindLastChoice(run: GameRunState): GameRunState {
  if (run.history.length === 0) return run;

  const last = run.history[run.history.length - 1];
  const wasBustedOnCurrentIndex = run.status === 'busted';
  const targetIndex = wasBustedOnCurrentIndex
    ? run.currentEpisodeIndex
    : Math.max(0, run.currentEpisodeIndex - 1);

  const restoredBadges = last.badgeUnlocked
    ? run.badges.filter((b) => b !== last.badgeUnlocked)
    : run.badges;

  return {
    ...run,
    stats: { ...last.previousStats },
    redFlags: last.previousRedFlags,
    status: 'playing',
    currentEpisodeIndex: targetIndex,
    history: run.history.slice(0, -1),
    badges: restoredBadges,
  };
}

export function computeRunSummary(run: GameRunState): RunSummary {
  const { maturity, chivalry, eq, chemistry } = run.stats;
  const rawAvg = Math.round((maturity + chivalry + eq + chemistry) / 4);
  const overallScore =
    run.status === 'busted' ? Math.min(42, Math.max(12, rawAvg - 25)) : rawAvg;

  let rankTitle: string;
  let verdictLine: string;

  if (run.status === 'busted') {
    rankTitle = 'RETURNED TO NIGHTLIFE TIKTOK';
    verdictLine =
      'Three Red Flags! Between Snapchat streaks, liquor-bottle selfies, and fumbled manners, the Den doors have closed.';
  } else if (overallScore >= 85) {
    rankTitle =
      run.pairing.role === 'her'
        ? 'APEX VELVET DEN VETTER & TRAINER'
        : 'CERTIFIED LINEN-APRON HOUSEBOY & LIFEMATE';
    verdictLine =
      'Elite emotional maturity, effortless chivalry, seamless generational code-switching, and sunrise-to-sunset chemistry.';
  } else if (overallScore >= 68) {
    rankTitle =
      run.pairing.role === 'her'
        ? 'OFF-LEASH TRAIL BOSS COUGAR'
        : 'SHORT-LEASH APPROVED GOLDEN CUB';
    verdictLine =
      'Passed the check-drop, laughed off the waiter, and proved real relationship potential beyond the age gap.';
  } else {
    rankTitle = 'CUB IN TRAINING (PROBATIONARY LEASH)';
    verdictLine =
      'Promising spark with a few generational potholes—one more lesson in bathroom soap and calendar etiquette required.';
  }

  const caughtBottleTrap = run.swipes.some(
    (s) => s.profileId === 'connor-bottle-trap' && s.caughtTrap,
  );

  const episodeHighlights = run.history.slice(0, 5).map((h) => {
    const ep = EPISODES.find((e) => e.id === h.episodeId);
    const passed = h.previousRedFlags === run.redFlags || !h.toastBanner.includes('RED FLAG');
    return {
      title: ep ? ep.title.split('(')[0].trim() : h.episodeId,
      emoji: h.toastBanner.includes('RED FLAG') ? '🚩' : passed ? '💚' : '🔥',
    };
  });

  return {
    pairing: run.pairing,
    stats: run.stats,
    redFlags: run.redFlags,
    overallScore,
    rankTitle,
    verdictLine,
    badges: run.badges,
    caughtBottleTrap,
    episodeHighlights,
  };
}
