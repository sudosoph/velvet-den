import type { PairingAnalysis } from './taxonomy';
import { APP_SWIPE_PROFILES, HER_SWIPE_PROFILES } from '../data/appProfiles';
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
export type RunPacingMode = 'curated' | 'marathon';

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
  completedMinigameEpisodeIds: string[];
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

export function personalizeText(text: string, pairing: PairingAnalysis): string {
  return text
    .replace(/\{herName\}/g, pairing.her.name)
    .replace(/\{hisName\}/g, pairing.his.name)
    .replace(/\{herAge\}/g, String(pairing.her.age))
    .replace(/\{hisAge\}/g, String(pairing.his.age))
    .replace(/\{petName\}/g, pairing.her.petName || 'Barnaby')
    .replace(/\{signatureDrink\}/g, pairing.her.signatureDrink || 'Espresso Martini');
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
  const tier = pairing.felineTier;
  const ageGap = pairing.ageGap;
  const queue: Episode[] = [];

  const pushById = (id: string) => {
    const found = EPISODES.find((e) => e.id === id);
    if (!found || queue.some((q) => q.id === found.id)) return;
    if (typeof found.minAgeGap === 'number' && ageGap < found.minAgeGap) return;
    if (typeof found.maxAgeGap === 'number' && ageGap > found.maxAgeGap) return;
    queue.push(found);
  };

  const pushCustomDateSpecials = () => {
    if (tags.has('black_cat_energy') || tags.has('golden_retriever_energy')) {
      pushById('black-cat-pushback-golden-retriever-test');
    }
    if (tags.has('zero_proof_wellness')) {
      pushById('zero-proof-mocktail-smoothie-date');
    }
    if (tags.has('broke_dutch_obstacle') || pairing.his.age <= 23) {
      pushById('broke-college-dutch-calculator-horror');
      pushById('parents-hawaii-timeshare-flex-trap');
    }
    if (tags.has('montana_cowboy_slider')) {
      pushById('montana-cowboy-age-slider-dare');
    }
    if (tags.has('spontaneous_getaway')) {
      pushById('spontaneous-18h-pool-sauna-getaway');
    }
    if (tags.has('phd_campus_cub')) {
      pushById('campus-stroll-sushi-professor-student');
    }
    if (tags.has('fiery_foreign') || tags.has('loves_foreign_women')) {
      pushById('fiery-foreign-cougar-passion-test');
    }
    if (tags.has('modest_accent_gentleman')) {
      pushById('retro-bowling-and-meadow-picnic');
    }
  };

  // Inject Stage 1 VIP if selected (e.g. Trader Joe's Wild Approach)
  for (const vipId of includeVipEpisodeIds) {
    const ep = EPISODES.find((e) => e.id === vipId && e.stage === 1);
    if (ep) pushById(ep.id);
  }

  // Cohesive 6-Stage Relationship Arc tailored to exact age bracket, gap size & profile!
  const isJuniorCougarTrack =
    ageGap > 0 &&
    ageGap < 10 &&
    (tags.has('junior_cougar_gap') ||
      (!tags.has('single_mom_sitter') && !tags.has('dog_mom_divorced')));

  if (isJuniorCougarTrack) {
    // Sub-10-Year "Junior Cougar" (e.g. 6-Year Gap) 6-Stage Arc!
    pushById('junior-cougar-gatekeeper-tease');
    pushById('check-drop');
    pushCustomDateSpecials();
    pushById('candlelit-menu-font-seatwarmer');
    pushById('junior-cougar-micro-gen-overlap');
    pushById('cub-bench-press-cougar-training');
    pushById('junior-cougar-condo-vs-lease');
    pushById('silk-pillowcase-clawclip-drawer');
    pushById('cub-grooming-red-carpet-glowup');
    pushById('puma-low-iron-ferritin-care');
    pushById('steamy-texts-sister-age-shock');

    for (const vipId of includeVipEpisodeIds) {
      const ep = EPISODES.find((e) => e.id === vipId && e.act === 2 && e.stage !== 1);
      if (ep) pushById(ep.id);
    }

    pushById('houseboy-sunday-sanctuary');
    pushById('pop-culture-cougar-renaissance');
    pushById('younger-sibling-same-birth-year');
    pushById('junior-cougar-wedding-season-marathon');
    pushById('doubt-junior-cougar-timeline-sync');

    for (const vipId of includeVipEpisodeIds) {
      const ep = EPISODES.find((e) => e.id === vipId && e.act === 3);
      if (ep) pushById(ep.id);
    }

    pushById('junior-cougar-sweet-spot-future');
  } else if (tier === 'lynx' || tier === 'puma') {
    if (ageGap > 0 && ageGap < 10) {
      pushById('junior-cougar-gatekeeper-tease');
    }
    if (tags.has('dog_mom_divorced')) {
      // 30s Child-Free Divorced Dog-Mom Puma Arc (Jaded about 40yo peer men, ZERO kid/babysitter scenes!)
      pushById('puma-dog-park-vetting');
      pushById('check-drop');
      pushCustomDateSpecials();
      pushById('code-switch-texting');
      pushById('cub-bench-press-cougar-training');
      pushById('puma-weaponized-incompetence-test');
      pushById('silk-pillowcase-clawclip-drawer');
      pushById('midnight-pizza-vs-sodium-rings');
      pushById('cub-grooming-red-carpet-glowup');
      pushById('puma-low-iron-ferritin-care');
      pushById('steamy-texts-sister-age-shock');

      for (const vipId of includeVipEpisodeIds) {
        const ep = EPISODES.find((e) => e.id === vipId && e.act === 2 && e.stage !== 1);
        if (ep) pushById(ep.id);
      }

      pushById('houseboy-sunday-sanctuary');
      pushById('pop-culture-cougar-renaissance');
      pushById('cub-friends-memes-roblox-shock');
      pushById('younger-sibling-same-birth-year');
      pushById('puma-brunch-cynical-peers');
      pushById('doubt-puma-peer-cynicism');

      for (const vipId of includeVipEpisodeIds) {
        const ep = EPISODES.find((e) => e.id === vipId && e.act === 3);
        if (ep) pushById(ep.id);
      }

      pushById('puma-dogmom-dink-future');
    } else {
      // 30s Single-Mom Puma Arc: Babysitter Clocks, Co-Parenting Boundaries, Low-Iron Care, Sister-Shock, Doubt & 30s Intentionality
      pushById('check-drop');
      pushCustomDateSpecials();
      if (tags.has('single_mom_sitter')) {
        pushById('babysitter-flake-test');
      }
      pushById('code-switch-texting');
      pushById('cub-bench-press-cougar-training');
      pushById('puma-kid-intro-boundary');
      pushById('cub-grooming-red-carpet-glowup');
      pushById('puma-low-iron-ferritin-care');
      pushById('steamy-texts-sister-age-shock');

      for (const vipId of includeVipEpisodeIds) {
        const ep = EPISODES.find((e) => e.id === vipId && e.act === 2 && e.stage !== 1);
        if (ep) pushById(ep.id);
      }

      pushById('houseboy-sunday-sanctuary');
      pushById('pop-culture-cougar-renaissance');
      pushById('cub-friends-memes-roblox-shock');
      pushById('first-wedding-plus-one-debut');
      pushById('puma-boys-groupchat-kid');
      pushById('doubt-puma-divorce-scar');

      for (const vipId of includeVipEpisodeIds) {
        const ep = EPISODES.find((e) => e.id === vipId && e.act === 3);
        if (ep) pushById(ep.id);
      }

      if (tags.has('done_with_kids')) {
        pushById('fertility-kids-crossroads');
      } else {
        pushById('puma-one-and-done-clock');
      }
    }
  } else if (tier === 'cougar') {
    // 40s Cougar / Princess Cougar Arc (with Bench Press, Cub Grooming, Perimenopause, Pop-Culture & Sister-Shock!)
    pushById('babygirl-hotel-bar-milk-or-martini');
    pushById('gym-headphones-vs-three-week-nod');
    pushById('check-drop');
    pushCustomDateSpecials();
    pushById('forum-redflag-pocket-secret-test');
    pushById('cubsplaining-and-bouncer-id-check');
    pushById('code-switch-texting');
    pushById('generational-1900s-venmo-whiplash');
    if (tags.has('princess_treatment')) {
      pushById('princess-soft-life');
    } else {
      pushById('cougar-thermostat-retinol');
    }
    pushById('cub-bench-press-cougar-training');
    pushById('candlelit-menu-font-seatwarmer');
    pushById('cougar-salary-negotiation');
    pushById('silk-pillowcase-clawclip-drawer');
    if (tags.has('black_cat_energy') || tags.has('golden_retriever_energy')) {
      pushById('black-cat-thaw-behind-closed-doors');
    }
    if (tags.has('broke_dutch_obstacle') || pairing.his.age <= 24) {
      pushById('four-roommates-cereal-kitchen-horror');
    }
    pushById('hobosexual-ps5-suitcase-creep');
    pushById('retinol-stubble-eye-cream-heist');
    pushById('midnight-pizza-vs-sodium-rings');
    pushById('cub-grooming-red-carpet-glowup');
    pushById('cougar-perimenopause-surge-nightsweats');
    pushById('steamy-texts-sister-age-shock');
    pushById('mirror-game-insecurities');

    for (const vipId of includeVipEpisodeIds) {
      const ep = EPISODES.find((e) => e.id === vipId && e.act === 2 && e.stage !== 1);
      if (ep) pushById(ep.id);
    }

    pushById('houseboy-sunday-sanctuary');
    pushById('pop-culture-cougar-renaissance');
    pushById('cub-friends-memes-roblox-shock');
    pushById('younger-sibling-same-birth-year');
    pushById('first-wedding-plus-one-debut');
    pushById('meeting-his-parents-same-age-mom');
    pushById('hotel-checkin-two-queen-beds-mixup');
    if (ageGap >= 18) {
      pushById('waiter-son-incident');
      if (tags.has('adult_children')) {
        pushById('grown-son-same-age-collision');
      }
    }
    pushById('cougar-boys-groupchat-ceo');
    pushById('doubt-cougar-honeymoon-cliff');

    for (const vipId of includeVipEpisodeIds) {
      const ep = EPISODES.find((e) => e.id === vipId && e.act === 3);
      if (ep) pushById(ep.id);
    }

    if (tags.has('done_with_kids') || tags.has('wants_kids_someday')) {
      pushById('fertility-kids-crossroads');
    } else {
      pushById('adult-kid-brunch');
    }
  } else if (tier === 'jaguar') {
    // 50s Gen-X Jaguar Arc (with Bench Press, Cub Grooming, Menopause Intimacy, Pop-Culture & Sister-Shock!)
    pushById('jaguar-genx-phone-call');
    pushById('check-drop');
    pushCustomDateSpecials();
    pushById('trail-run-short-leash');
    pushById('jaguar-pilates-core-shake');
    pushById('candlelit-menu-font-seatwarmer');
    pushById('cub-bench-press-cougar-training');
    pushById('retinol-stubble-eye-cream-heist');
    pushById('cub-grooming-red-carpet-glowup');
    if (tags.has('black_cat_energy') || tags.has('golden_retriever_energy')) {
      pushById('black-cat-thaw-behind-closed-doors');
    }
    pushById('menopause-intimacy-masterclass');
    pushById('steamy-texts-sister-age-shock');

    for (const vipId of includeVipEpisodeIds) {
      const ep = EPISODES.find((e) => e.id === vipId && e.act === 2 && e.stage !== 1);
      if (ep) pushById(ep.id);
    }

    pushById('houseboy-sunday-sanctuary');
    pushById('pop-culture-cougar-renaissance');
    pushById('cub-friends-memes-roblox-shock');
    pushById('first-wedding-plus-one-debut');
    pushById('meeting-his-parents-same-age-mom');
    pushById('waiter-son-incident');
    pushById('grown-son-same-age-collision');
    pushById('adult-kid-brunch');
    pushById('doubt-jaguar-worlds-collide');

    for (const vipId of includeVipEpisodeIds) {
      const ep = EPISODES.find((e) => e.id === vipId && e.act === 3);
      if (ep) pushById(ep.id);
    }

    if (tags.has('wants_kids_someday')) {
      pushById('fertility-kids-crossroads');
    }
    pushById('jaguar-lat-living-apart');
  } else {
    // 60+ Panther Icon Arc (with Bench Press, Cub Grooming, Menopause Intimacy, Pop-Culture & Sister-Shock!)
    pushById('panther-black-tie-gala');
    pushById('check-drop');
    pushCustomDateSpecials();
    pushById('code-switch-texting');
    pushById('cub-bench-press-cougar-training');
    pushById('cub-grooming-red-carpet-glowup');
    if (tags.has('black_cat_energy') || tags.has('golden_retriever_energy')) {
      pushById('black-cat-thaw-behind-closed-doors');
    }
    pushById('menopause-intimacy-masterclass');
    pushById('steamy-texts-sister-age-shock');
    pushById('mirror-game-insecurities');

    for (const vipId of includeVipEpisodeIds) {
      const ep = EPISODES.find((e) => e.id === vipId && e.act === 2 && e.stage !== 1);
      if (ep) pushById(ep.id);
    }

    pushById('houseboy-sunday-sanctuary');
    pushById('pop-culture-cougar-renaissance');
    pushById('first-wedding-plus-one-debut');
    pushById('meeting-his-parents-same-age-mom');
    pushById('waiter-son-incident');
    pushById('grown-son-same-age-collision');
    pushById('panther-protective-friends');
    pushById('doubt-panther-real-world-gravity');

    for (const vipId of includeVipEpisodeIds) {
      const ep = EPISODES.find((e) => e.id === vipId && e.act === 3);
      if (ep) pushById(ep.id);
    }

    pushById('panther-timeline-75-45');
  }

  // Grand Milestone Finale: 6-Month Brass Key & 1-Year Anniversary!
  pushById('milestone-six-month-anniversary');
  pushById('milestone-one-year-anniversary');

  return queue;
}

/**
 * Approach A Curated Game Routing:
 * Selects a tight, high-impact 8-scene arc across all 6 Relationship Stages so mobile & first-time
 * players experience their custom subplots, minigames, and trivia interludes and reach the viral
 * Vibe Receipt in ~3.5 minutes—without 28-scene fatigue!
 */
const PRIORITY_CUSTOM_EPISODE_IDS = new Set([
  'black-cat-pushback-golden-retriever-test',
  'black-cat-thaw-behind-closed-doors',
  'zero-proof-mocktail-smoothie-date',
  'broke-college-dutch-calculator-horror',
  'four-roommates-cereal-kitchen-horror',
  'montana-cowboy-age-slider-dare',
  'spontaneous-18h-pool-sauna-getaway',
  'campus-stroll-sushi-professor-student',
  'fiery-foreign-cougar-passion-test',
  'retro-bowling-and-meadow-picnic',
  'houseboy-sunday-sanctuary',
]);

export function curateEpisodeQueue(
  fullQueue: Episode[],
  includeVipEpisodeIds: string[] = [],
): Episode[] {
  if (fullQueue.length <= 8) return fullQueue;

  const vipSet = new Set(includeVipEpisodeIds);
  const picked: Episode[] = [];
  const addEp = (ep?: Episode) => {
    if (ep && !picked.some((p) => p.id === ep.id)) {
      picked.push(ep);
    }
  };

  const byStage = (st: number) => fullQueue.filter((e) => e.stage === st);
  const pickStageBest = (st: number, count: number) => {
    const candidates = byStage(st);
    const prioritized = [
      ...candidates.filter((e) => vipSet.has(e.id)),
      ...candidates.filter((e) => PRIORITY_CUSTOM_EPISODE_IDS.has(e.id)),
      ...candidates.filter((e) => Boolean(e.minigame)),
      ...candidates,
    ];
    let added = 0;
    for (const c of prioritized) {
      if (added >= count) break;
      if (!picked.some((p) => p.id === c.id)) {
        picked.push(c);
        added += 1;
      }
    }
  };

  pickStageBest(1, 2);
  pickStageBest(2, 1);
  pickStageBest(3, 2);
  pickStageBest(4, 1);
  pickStageBest(5, 1);
  // Always end with 6-month Big Carl or 1-year Anniversary finale!
  const stage6 = byStage(6);
  addEp(stage6.find((e) => !e.id.startsWith('milestone-')) ?? stage6[0]);
  addEp(fullQueue.find((e) => e.id === 'milestone-six-month-anniversary'));

  // Ensure any paid/unlocked VIP scene is always honored
  for (const vipEp of fullQueue.filter((e) => vipSet.has(e.id))) {
    addEp(vipEp);
  }

  return picked.sort((a, b) => a.stage - b.stage);
}

export function createRun(
  pairing: PairingAnalysis,
  includeVipEpisodeIds: string[] = [],
  singleDilemmaId?: string,
  pacingMode: RunPacingMode = 'marathon',
): GameRunState {
  const fullQueue = buildEpisodeQueue(pairing, includeVipEpisodeIds, singleDilemmaId);
  const episodeQueue =
    singleDilemmaId || pacingMode === 'marathon'
      ? fullQueue
      : curateEpisodeQueue(fullQueue, includeVipEpisodeIds);

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
    episodeQueue,
    currentEpisodeIndex: 0,
    history: [],
    badges: [],
    completedMinigameEpisodeIds: [],
  };
}

export function recordAppSwipe(
  run: GameRunState,
  profileId: string,
  direction: 'left' | 'right',
): GameRunState {
  const allProfiles = [...APP_SWIPE_PROFILES, ...HER_SWIPE_PROFILES];
  const profile = allProfiles.find((p) => p.id === profileId);
  if (!profile || run.status !== 'playing') return run;

  const stats = { ...run.stats };
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
    if (
      profile.id === 'kayden-dutch-venmo-trap' &&
      !badges.includes('Dodged the Broke Venmo Calculator')
    ) {
      badges.push('Dodged the Broke Venmo Calculator');
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

export function applyMinigameBonus(
  run: GameRunState,
  episodeId: string,
  bonus: Partial<Stats>,
  badgeUnlocked?: string,
): GameRunState {
  if (run.completedMinigameEpisodeIds.includes(episodeId)) return run;

  const nextStats: Stats = {
    maturity: clampStat(run.stats.maturity + (bonus.maturity ?? 0)),
    chivalry: clampStat(run.stats.chivalry + (bonus.chivalry ?? 0)),
    eq: clampStat(run.stats.eq + (bonus.eq ?? 0)),
    chemistry: clampStat(run.stats.chemistry + (bonus.chemistry ?? 0)),
  };

  const nextBadges =
    badgeUnlocked && !run.badges.includes(badgeUnlocked)
      ? [...run.badges, badgeUnlocked]
      : run.badges;

  return {
    ...run,
    stats: nextStats,
    badges: nextBadges,
    completedMinigameEpisodeIds: [...run.completedMinigameEpisodeIds, episodeId],
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

  // Houseboy Sunday fade-to-black payoff requires Maturity >= 60 && EQ >= 60
  const failsHouseboyGate =
    episode.id === 'houseboy-sunday-sanctuary' &&
    choiceIndex === 0 &&
    (run.stats.maturity < 60 || run.stats.eq < 60);

  const effectiveDeltas: StatDeltas = failsHouseboyGate
    ? { maturity: 5, chivalry: 5, eq: 5, chemistry: 0, redFlags: 0 }
    : choice.deltas;

  const nextStats = addDeltas(run.stats, effectiveDeltas);
  const nextRedFlags = Math.max(0, run.redFlags + effectiveDeltas.redFlags);
  const rawOutcomeText = failsHouseboyGate
    ? 'Hold up—her peaceful solo sanctuary has standards! Because Maturity & EQ haven’t both cleared 60 yet, she keeps Sunday to patio coffee and friendly boundaries instead of unlocking Linen-Apron Houseboy privileges.'
    : run.pairing.role === 'her'
      ? choice.outcomeHer
      : choice.outcomeHim;

  const outcomeText = personalizeText(rawOutcomeText, run.pairing);

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
        ? 'APEX COUGAR DEN VETTER & LIFEMATE'
        : 'CERTIFIED LINEN-APRON HOUSEBOY & LIFEMATE';
    verdictLine =
      'Five stages cleared! Elite emotional maturity, effortless chivalry, seamless generational code-switching, and real eyes-wide-open commitment.';
  } else if (overallScore >= 68) {
    rankTitle =
      run.pairing.role === 'her'
        ? 'OFF-LEASH TRAIL BOSS COUGAR'
        : 'SHORT-LEASH APPROVED GOLDEN CUB';
    verdictLine =
      'Passed the check-drop, handled her inner circle, and proved real relationship potential beyond the age gap.';
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
