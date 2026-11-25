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

    const puma = HER_ARCHETYPES.find((h) => h.age >= 36 && h.age < 40)!;
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

  it('labels sub-10-year age gaps (e.g., 6–7 years) as Junior Cougar without mislabeling as 10+ official Cougar', () => {
    const puma36 = { ...HER_ARCHETYPES[0], age: 36 };
    const cub29 = { ...HIS_ARCHETYPES[0], age: 29 };

    const result = analyzePairing(puma36, cub29, 'her');
    expect(result.ageGap).toBe(7);
    expect(result.isOfficialTenYearGap).toBe(false);
    expect(result.badgeLabel).toBe('7-Year Junior Cougar Matchup');

    const sienna38 = { ...HER_ARCHETYPES[0], age: 38 };
    const miles32 = { ...HIS_ARCHETYPES[3], age: 32 };
    const sixYear = analyzePairing(sienna38, miles32, 'her');
    expect(sixYear.ageGap).toBe(6);
    expect(sixYear.badgeLabel).toBe('6-Year Junior Cougar Matchup');
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
        'pop_jessica_danny',
        'pop_sienna_oli',
        'pop_ellie_beau',
        'pop_miley_maxx',
        'pop_kristin_montana',
        'pop_cub_grooming_joke',
        'black_cat_golden_retriever',
      ]),
    );
  });

  it('detects 🐈‍⬛ Black Cat Cougar × 🐕 Golden Retriever Cub polarity when paired', () => {
    const claireBlackCat = HER_ARCHETYPES.find((h) => h.id === 'claire-cougar-exec')!;
    const leoGolden = HIS_ARCHETYPES.find((c) => c.id === 'leo-golden-cub')!;
    const polarityPairing = analyzePairing(claireBlackCat, leoGolden, 'him');
    expect(polarityPairing.energyPolarity).toContain('Black Cat');
    expect(polarityPairing.energyPolarity).toContain('Golden Retriever');
  });

  it('covers every single year of each decade (30–64 for Her, 21–33 for Cubs) with heights, star signs, and zero ethnic quota labels', () => {
    const herAges = new Set(HER_ARCHETYPES.map((h) => h.age));
    for (let yr = 30; yr <= 64; yr++) {
      expect(herAges.has(yr)).toBe(true);
    }

    const hisAges = new Set(HIS_ARCHETYPES.map((c) => c.age));
    for (let yr = 21; yr <= 33; yr++) {
      expect(hisAges.has(yr)).toBe(true);
    }

    const forbiddenEthnicPattern =
      /\b(black(?!\s+cat)|latina|latino|asian|korean|irish|scandinavian)\b/i;
    for (const p of [...HER_ARCHETYPES, ...HIS_ARCHETYPES]) {
      expect(p.height).toMatch(/^\d'\d{1,2}"$/);
      expect(p.zodiac?.length).toBeGreaterThan(3);
      expect(forbiddenEthnicPattern.test(p.lookBadge || '')).toBe(false);
      expect(forbiddenEthnicPattern.test(p.shortHook)).toBe(false);
    }
  });
});
