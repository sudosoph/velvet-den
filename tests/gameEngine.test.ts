import { describe, expect, it } from 'vitest';
import { analyzePairing, HER_ARCHETYPES, HIS_ARCHETYPES } from '../src/domain/taxonomy';
import { APP_SWIPE_PROFILES } from '../src/data/appProfiles';
import { EPISODES } from '../src/data/episodes';
import { POP_CULTURE_TRIVIA } from '../src/data/popCultureTrivia';
import { JOURNAL_ARTICLES } from '../src/data/journalArticles';
import {
  applyEpisodeChoice,
  computeRunSummary,
  createCharacterDateRun,
  createRun,
  recordAppSwipe,
  rewindLastChoice,
} from '../src/domain/gameEngine';
import {
  checkProfileMemoryHit,
  loadMatchCareer,
  saveMatchCareer,
} from '../src/domain/matchCareer';

describe('3-Date Career Engine, Polarity Episodes, Legal CC-BY Quiz & Complete Guides (v34)', () => {
  it('contains 6-photo app profiles with Age 26 shock zoom, Photo 2 liquor bottle clue, and Snapchat/hey red flags', () => {
    expect(APP_SWIPE_PROFILES.length).toBeGreaterThanOrEqual(4);

    const bottleTrap = APP_SWIPE_PROFILES.find((p) => p.id === 'connor-bottle-trap')!;
    expect(bottleTrap).toBeDefined();
    expect(bottleTrap.age).toBe(26);
    expect(bottleTrap.ageShockZoom).toBe(true);
    expect(bottleTrap.photos.length).toBeGreaterThanOrEqual(6);
    expect(bottleTrap.photos[1].variant).toBe('liquor_bottle_trap');
    expect(bottleTrap.lookingFor).toContain('Short-term, open to long');
    expect(bottleTrap.interests).toContain('Nightlife');

    const snapIck = APP_SWIPE_PROFILES.find((p) =>
      p.openingDm.toLowerCase().includes('snap'),
    )!;
    expect(snapIck).toBeDefined();
  });

  it('persists MatchCareerState (Dadbook, earned matches, date stages) and detects Profile Memory Bonus hits', () => {
    const career = loadMatchCareer();
    expect(career.dadbook.fridayVibe).toBeDefined();
    career.matchedIds = ['marcus-firefighter-cub'];
    career.dateStageByMatchId['marcus-firefighter-cub'] = 1;
    saveMatchCareer(career);

    const reloaded = loadMatchCareer();
    expect(reloaded.matchedIds).toContain('marcus-firefighter-cub');
    expect(reloaded.dateStageByMatchId['marcus-firefighter-cub']).toBe(1);

    const marcus = HIS_ARCHETYPES.find((c) => c.id === 'marcus-firefighter-cub')!;
    const hitRes = checkProfileMemoryHit(marcus, 'Did Otis enjoy his beach run before your shift?');
    expect(hitRes.hit).toBe(true);
    expect(hitRes.bonusLine.length).toBeGreaterThan(10);
  });

  it('queues Any-Age sweeping romance princess-soft-life across 30s, 40s, 50s, and 60s+ and includes standalone Polarity episodes', () => {
    const princessEp = EPISODES.find((ep) => ep.id === 'princess-soft-life')!;
    expect(princessEp).toBeDefined();
    expect(`${princessEp.setupHer} ${princessEp.setupHim}`).not.toMatch(/toddlers|50 hours/i);

    expect(EPISODES.some((ep) => ep.id === 'soft-mommy-domme-good-boy-command')).toBe(true);
    expect(EPISODES.some((ep) => ep.id === 'cub-daddy-zaddy-dinner-takeover')).toBe(true);
    expect(EPISODES.some((ep) => ep.id === 'bucket-list-tourist-instant-block')).toBe(true);

    const cub = HIS_ARCHETYPES.find((c) => c.id === 'leo-golden-cub')!;
    const puma30s = HER_ARCHETYPES.find((h) => h.age >= 30 && h.age < 40 && h.subplotTags.includes('princess_treatment'))!;
    const cougar40s = HER_ARCHETYPES.find((h) => h.age >= 40 && h.age < 50 && h.subplotTags.includes('princess_treatment'))!;
    const jaguar50s = HER_ARCHETYPES.find((h) => h.age >= 50 && h.age < 60 && h.subplotTags.includes('princess_treatment'))!;
    const panther60s = HER_ARCHETYPES.find((h) => h.age >= 60 && h.subplotTags.includes('princess_treatment'))!;

    for (const her of [puma30s, cougar40s, jaguar50s, panther60s]) {
      const q = createRun(analyzePairing(her, cub, 'her')).episodeQueue.map((e) => e.id);
      expect(q).toContain('princess-soft-life');
    }
  });

  it('builds focused 3-scene Date #1/#2/#3 runs via createCharacterDateRun and carries cumulative stats into Houseboy Sunday', () => {
    const claire = HER_ARCHETYPES.find((h) => h.id === 'claire-cougar-exec')!;
    const leo = HIS_ARCHETYPES.find((c) => c.id === 'leo-golden-cub')!;
    const pairing = analyzePairing(claire, leo, 'her');

    const date1 = createCharacterDateRun(pairing, 0);
    expect(date1.episodeQueue).toHaveLength(3);

    const date2 = createCharacterDateRun(pairing, 1, {
      maturity: 72,
      chivalry: 70,
      eq: 74,
      chemistry: 76,
    });
    expect(date2.episodeQueue).toHaveLength(3);
    expect(date2.stats.maturity).toBe(72);
    expect(date2.stats.eq).toBe(74);
  });

  it('keeps POP_CULTURE_TRIVIA 100% free of wellness filler and attaches verified Wikimedia Commons CC-BY / PD credits', () => {
    expect(POP_CULTURE_TRIVIA.length).toBeGreaterThanOrEqual(18);
    const allText = JSON.stringify(POP_CULTURE_TRIVIA);
    expect(allText).not.toMatch(/qigong|bernedoodle|seed[- ]oil/i);
    expect(allText).toContain('How Stella Got Her Groove Back');
    expect(allText).toContain('Tina Turner');

    for (const q of POP_CULTURE_TRIVIA) {
      expect(q.imageUrl).toMatch(/^https:\/\/(upload|thumb)\.wikimedia\.org\//);
      expect(q.imageCredit).toMatch(/(CC BY|Public Domain).*Wikimedia Commons/i);
    }
  });

  it('expands all JOURNAL_ARTICLES with 10 hosting checklist items and zero 1-section stubs', () => {
    const hosting = JOURNAL_ARTICLES.find(
      (a) => a.slug === 'first-time-hosting-older-woman-apartment-checklist',
    )!;
    expect(hosting.checklistItems?.length).toBe(10);

    for (const art of JOURNAL_ARTICLES) {
      expect(art.sections.length).toBeGreaterThanOrEqual(3);
      expect(JSON.stringify(art)).not.toMatch(/qigong|bernedoodle/i);
    }
  });

  it('triggers 3-strike Red Flag bust and recovers cleanly to playing state upon 1-Credit Smooth Rewind', () => {
    const cougar = HER_ARCHETYPES[0];
    const cub = HIS_ARCHETYPES[0];
    let run = createRun(analyzePairing(cougar, cub, 'her'));

    const traps = APP_SWIPE_PROFILES.filter((p) => !p.isGreenFlagMatch);
    run = recordAppSwipe(run, traps[0].id, 'right');
    run = recordAppSwipe(run, traps[1].id, 'right');
    expect(run.redFlags).toBe(2);
    expect(run.status).toBe('playing');

    const currentEp = run.episodeQueue[run.currentEpisodeIndex];
    const redFlagIdx = currentEp.choices.findIndex((c) => c.deltas.redFlags > 0);
    expect(redFlagIdx).toBeGreaterThanOrEqual(0);

    const beforeStats = { ...run.stats };
    const bustedRun = applyEpisodeChoice(run, redFlagIdx);
    expect(bustedRun.redFlags).toBeGreaterThanOrEqual(3);
    expect(bustedRun.status).toBe('busted');

    const rewound = rewindLastChoice(bustedRun);
    expect(rewound.redFlags).toBe(2);
    expect(rewound.status).toBe('playing');
    expect(rewound.stats).toEqual(beforeStats);
    expect(rewound.currentEpisodeIndex).toBe(0);

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
