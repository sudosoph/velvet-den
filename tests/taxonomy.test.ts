import { describe, expect, it } from 'vitest';
import {
  analyzePairing,
  classifyFelineTier,
  classifyGeneration,
  FIELD_GUIDE_ENTRIES,
  HER_ARCHETYPES,
  HIS_ARCHETYPES,
} from '../src/domain/taxonomy';
import { evaluateDmLocally } from '../src/services/adapters';

describe('Age-gap taxonomy, generational cohorts, Field Guide & British DM dialect', () => {
  it('classifies exact age-tier boundaries across Lynx, Puma, Cougar, Jaguar, and Panther', () => {
    expect(classifyFelineTier(27)).toBe('lynx');
    expect(classifyFelineTier(30)).toBe('puma');
    expect(classifyFelineTier(39)).toBe('puma');
    expect(classifyFelineTier(40)).toBe('cougar');
    expect(classifyFelineTier(49)).toBe('cougar');
    expect(classifyFelineTier(52)).toBe('jaguar');
    expect(classifyFelineTier(61)).toBe('panther');
  });

  it('classifies generational cohorts and labels sub-10-year gaps as Junior Cougar', () => {
    expect(classifyGeneration(25)).toBe('gen_z');
    expect(classifyGeneration(41)).toBe('millennial');
    expect(classifyGeneration(48)).toBe('gen_x');
    expect(classifyGeneration(63)).toBe('icon_60_plus');

    const puma36 = { ...HER_ARCHETYPES[0], age: 36 };
    const cub29 = { ...HIS_ARCHETYPES[0], age: 29 };

    const result = analyzePairing(puma36, cub29, 'her');
    expect(result.ageGap).toBe(7);
    expect(result.isOfficialTenYearGap).toBe(false);
    expect(result.badgeLabel).toBe('7-Year Junior Cougar Matchup');
  });

  it('includes Any-Age Princess Cougar, Soft Mommy-Domme, Cub Daddy/Zaddy, Bucket-List Tourist & 18+ Hall of Fame icons in Field Guide', () => {
    const ids = FIELD_GUIDE_ENTRIES.map((e) => e.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'lynx',
        'puma',
        'cougar',
        'princess_cougar',
        'jaguar',
        'panther',
        'golden_cub',
        'soft_mommy_domme_lore',
        'cub_daddy_zaddy_lore',
        'bucket_list_tourist_lore',
        'black_cat_golden_retriever',
      ]),
    );

    const popText = FIELD_GUIDE_ENTRIES.filter((e) => e.category === 'pop_culture')
      .map((e) => `${e.label} ${e.headline} ${e.insiderLore}`)
      .join(' | ');
    for (const icon of [
      'Priyanka Chopra',
      'Heidi Klum',
      'Tina Turner',
      'Cher',
      'Demi Moore',
      'Macron',
      'Gabrielle Union',
      'Julianne Moore',
      'Goldie Hawn',
      'Meghan Markle',
      'How Stella Got Her Groove Back',
    ]) {
      expect(popText).toContain(icon);
    }
  });

  it('supports British Cub ("sorted", "half seven", "Yes, Mummy xx") and role-aware coachNote in local DM evaluator', () => {
    const ukReply = evaluateDmLocally({
      personaName: 'Julian',
      personaAge: 27,
      personaRole: 'him',
      personaOrigin: 'London, UK (British)',
      playerMessage: 'Wine bar at 7:30 works, behave yourself tonight.',
    });
    expect(ukReply.passedVibeCheck).toBe(true);
    expect(ukReply.herReply.toLowerCase()).toMatch(/half seven|sorted|proper|cheeky|mummy|\bxx?\b/);

    // Playing as Her (personaRole === 'him'): coachNote must never lecture her to enroll in Cub Obedience
    const rudeToCub = evaluateDmLocally({
      personaName: 'Soren',
      personaAge: 26,
      personaRole: 'him',
      playerMessage: 'whats ur snap??',
    });
    expect(rudeToCub.coachNote.toLowerCase()).not.toContain('cub obedience');
  });
});
