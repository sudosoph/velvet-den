import { describe, expect, it } from 'vitest';
import { analyzePairing, HER_ARCHETYPES, HIS_ARCHETYPES } from '../src/domain/taxonomy';
import { APP_SWIPE_PROFILES } from '../src/data/appProfiles';
import { EPISODES } from '../src/data/episodes';
import {
  applyEpisodeChoice,
  computeRunSummary,
  createRun,
  recordAppSwipe,
  rewindLastChoice,
} from '../src/domain/gameEngine';

describe('Subreddit-mined plotlines, app swipe deck & Dual-POV game engine', () => {
  it('contains multi-photo app profiles with Age 26 shock zoom, Photo 2 liquor bottle trap, and Snapchat/hey red flags', () => {
    expect(APP_SWIPE_PROFILES.length).toBeGreaterThanOrEqual(4);

    const bottleTrap = APP_SWIPE_PROFILES.find((p) => p.id === 'connor-bottle-trap')!;
    expect(bottleTrap).toBeDefined();
    expect(bottleTrap.age).toBe(26);
    expect(bottleTrap.ageShockZoom).toBe(true);
    expect(bottleTrap.photos).toHaveLength(2);
    expect(bottleTrap.photos[1].variant).toBe('liquor_bottle_trap');
    expect(bottleTrap.lookingFor).toContain('Short-term, open to long');
    expect(bottleTrap.interests).toContain('Nightlife');

    const snapIck = APP_SWIPE_PROFILES.find((p) =>
      p.openingDm.toLowerCase().includes('snap'),
    )!;
    expect(snapIck).toBeDefined();
  });

  it('includes free core and VIP deep-cut episodes covering Princess Treatment, Mirror/Game Insecurities, Code-Switching, Trail Leash, and Waiter Incident', () => {
    expect(EPISODES.length).toBeGreaterThanOrEqual(13);

    const hasInsecurityBubble = EPISODES.some((ep) => Boolean(ep.innerInsecurityBubble));
    const hasCodeSwitch = EPISODES.some((ep) => Boolean(ep.codeSwitchRawImpulse));
    const hasPrincess = EPISODES.some((ep) => ep.id === 'princess-soft-life');
    const vipCount = EPISODES.filter((ep) => ep.isVip).length;

    expect(hasInsecurityBubble).toBe(true);
    expect(hasCodeSwitch).toBe(true);
    expect(hasPrincess).toBe(true);
    expect(vipCount).toBe(4);
  });

  it('routes Single-Mom Babysitter vs Kids Crossroads episodes dynamically from pairing tags', () => {
    const singleMomPuma = HER_ARCHETYPES.find((h) => h.id === 'maya-puma-mom')!;
    const doneCougar = HER_ARCHETYPES.find((h) => h.id === 'claire-cougar-exec')!;
    const wantsKidsCub = HIS_ARCHETYPES.find((c) => c.id === 'julian-oldsoul-cub')!;

    const momRun = createRun(analyzePairing(singleMomPuma, wantsKidsCub, 'her'));
    expect(momRun.episodeQueue.map((e) => e.id)).toContain('babysitter-flake-test');

    const kidsRun = createRun(analyzePairing(doneCougar, wantsKidsCub, 'him'));
    expect(kidsRun.episodeQueue.map((e) => e.id)).toContain('fertility-kids-crossroads');
  });

  it('triggers 3-strike Red Flag bust and recovers cleanly to playing state upon 1-Credit Smooth Rewind (Review Focus #5)', () => {
    const cougar = HER_ARCHETYPES[0];
    const cub = HIS_ARCHETYPES[0];
    let run = createRun(analyzePairing(cougar, cub, 'her'));

    // Swipe right on 2 trap profiles to accumulate 2 red flags
    const traps = APP_SWIPE_PROFILES.filter((p) => !p.isGreenFlagMatch);
    run = recordAppSwipe(run, traps[0].id, 'right');
    run = recordAppSwipe(run, traps[1].id, 'right');
    expect(run.redFlags).toBe(2);
    expect(run.status).toBe('playing');

    // Pick the red-flag choice on Episode 0 -> hits 3 red flags -> busted!
    const currentEp = run.episodeQueue[run.currentEpisodeIndex];
    const redFlagIdx = currentEp.choices.findIndex((c) => c.deltas.redFlags > 0);
    expect(redFlagIdx).toBeGreaterThanOrEqual(0);

    const beforeStats = { ...run.stats };
    const bustedRun = applyEpisodeChoice(run, redFlagIdx);
    expect(bustedRun.redFlags).toBeGreaterThanOrEqual(3);
    expect(bustedRun.status).toBe('busted');

    // Rewind restores stats, drops redFlags back to 2, and flips status back to playing!
    const rewound = rewindLastChoice(bustedRun);
    expect(rewound.redFlags).toBe(2);
    expect(rewound.status).toBe('playing');
    expect(rewound.stats).toEqual(beforeStats);
    expect(rewound.currentEpisodeIndex).toBe(0);

    // Completing cleanly yields a RunSummary rank
    let cleanRun = rewound;
    while (cleanRun.status === 'playing' && cleanRun.currentEpisodeIndex < cleanRun.episodeQueue.length) {
      const ep = cleanRun.episodeQueue[cleanRun.currentEpisodeIndex];
      const bestIdx = ep.choices.findIndex((c) => c.deltas.redFlags === 0 && c.deltas.maturity >= 10);
      cleanRun = applyEpisodeChoice(cleanRun, bestIdx >= 0 ? bestIdx : 0);
    }
    expect(cleanRun.status).toBe('completed');
    const summary = computeRunSummary(cleanRun);
    expect(summary.overallScore).toBeGreaterThan(60);
    expect(summary.rankTitle.length).toBeGreaterThan(5);
  });
});
