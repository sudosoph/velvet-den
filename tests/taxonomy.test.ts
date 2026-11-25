import { describe, expect, it } from 'vitest';
import {
  analyzePairing,
  classifyFelineTier,
  classifyGeneration,
  FIELD_GUIDE_ENTRIES,
  HER_ARCHETYPES,
  HIS_ARCHETYPES,
} from '../src/domain/taxonomy';

describe('Age-gap taxonomy & generational pairing analyzer', () => {
  it('classifies exact age-tier boundaries across Lynx, Puma, Cougar, Jaguar, and Panther', () => {
    expect(classifyFelineTier(27)).toBe('lynx');
    expect(classifyFelineTier(30)).toBe('puma');
    expect(classifyFelineTier(39)).toBe('puma');
    expect(classifyFelineTier(40)).toBe('cougar');
    expect(classifyFelineTier(49)).toBe('cougar');
    expect(classifyFelineTier(52)).toBe('jaguar');
    expect(classifyFelineTier(61)).toBe('panther');
  });

  it('classifies generational cohorts and emits tailored Millennial vs Gen-X code-switching tips', () => {
    expect(classifyGeneration(25)).toBe('gen_z');
    expect(classifyGeneration(41)).toBe('millennial');
    expect(classifyGeneration(48)).toBe('gen_x');
    expect(classifyGeneration(63)).toBe('icon_60_plus');

    const puma = HER_ARCHETYPES.find((h) => h.age < 40)!;
    const princessCougar = HER_ARCHETYPES.find((h) => h.subplotTags.includes('princess_treatment'))!;
    const genXJaguar = HER_ARCHETYPES.find((h) => h.age >= 50)!;
    const genZCub = HIS_ARCHETYPES.find((c) => c.age <= 26)!;

    expect(princessCougar).toBeDefined();

    const millennialMatch = analyzePairing(puma, genZCub, 'him');
    expect(millennialMatch.herGeneration).toBe('millennial');
    expect(millennialMatch.codeSwitchTip.toLowerCase()).toContain('call');

    const genXMatch = analyzePairing(genXJaguar, genZCub, 'her');
    expect(genXMatch.herGeneration).toBe('gen_x');
    expect(genXMatch.isOfficialTenYearGap).toBe(true);
    expect(genXMatch.ageGap).toBe(genXJaguar.age - genZCub.age);
  });

  it('handles sub-10-year age gaps gracefully without throwing or mislabeling as 10+ Cougar (Review Focus #2)', () => {
    const puma36 = { ...HER_ARCHETYPES[0], age: 36 };
    const cub29 = { ...HIS_ARCHETYPES[0], age: 29 };

    const result = analyzePairing(puma36, cub29, 'her');
    expect(result.ageGap).toBe(7);
    expect(result.isOfficialTenYearGap).toBe(false);
    expect(result.badgeLabel).toBe('7-Year Puma-Lite Matchup');
  });

  it('includes insider Field Guide entries for Puma, Cougar, Princess Cougar, Jaguar, Panther, Cub subtypes, Kitten, and Mountain Lion', () => {
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
        'dm_goblin',
        'kitten',
        'mountain_lion',
      ]),
    );
  });
});
