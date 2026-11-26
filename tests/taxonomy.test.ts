import { describe, expect, it } from 'vitest';
import {
  analyzePairing,
  classifyFelineTier,
  classifyGeneration,
  FIELD_GUIDE_ENTRIES,
  getHingeExtendedProfile,
  HER_ARCHETYPES,
  HIS_ARCHETYPES,
} from '../src/domain/taxonomy';
import { APP_SWIPE_PROFILES, HER_SWIPE_PROFILES } from '../src/data/appProfiles';
import { evaluateDmLocally } from '../src/services/adapters';

describe('Age-gap taxonomy, 6-photo Hinge profiles, cast diversity & Hall of Fame (v34)', () => {
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
  });

  it('detects 🐈‍⬛ Black Cat Cougar × 🐕 Golden Retriever Cub polarity when paired', () => {
    const claireBlackCat = HER_ARCHETYPES.find((h) => h.id === 'claire-cougar-exec')!;
    const leoGolden = HIS_ARCHETYPES.find((c) => c.id === 'leo-golden-cub')!;
    const polarityPairing = analyzePairing(claireBlackCat, leoGolden, 'him');
    expect(polarityPairing.energyPolarity).toContain('Black Cat');
    expect(polarityPairing.energyPolarity).toContain('Golden Retriever');
  });

  it('guarantees 100% unique photoUrls across all 57 cast members and zero cross-person portrait contamination', () => {
    expect(HER_ARCHETYPES.length).toBe(39);
    expect(HIS_ARCHETYPES.length).toBe(18);

    const allCast = [...HER_ARCHETYPES, ...HIS_ARCHETYPES];
    const primaryPhotos = allCast.map((p) => p.photoUrl);
    expect(new Set(primaryPhotos).size).toBe(allCast.length);

    // Build owner map for every cast portrait (excluding face-free dog-park-picnic.jpg)
    const normOwner = (raw: string) =>
      raw.replace(/^dr\.\s+/i, '').split(' ')[0].replace(/[^a-zé]/gi, '').toLowerCase();
    const portraitOwnerByUrl = new Map<string, string>();
    for (const p of allCast) {
      portraitOwnerByUrl.set(p.photoUrl, normOwner(p.name));
    }

    for (const p of allCast) {
      const ext = getHingeExtendedProfile(p);
      expect(ext.slides.length).toBeGreaterThanOrEqual(6);
      expect(ext.slides[0].url).toBe(p.photoUrl);
      expect(ext.schoolAndMajor.length).toBeGreaterThan(5);
      expect(ext.fieldOfWork.length).toBeGreaterThan(3);
      expect(ext.jobTitle.length).toBeGreaterThan(3);
      expect(ext.bio.length).toBeGreaterThan(20);
      expect(ext.lifeStance.length).toBeGreaterThan(4);
      expect(ext.funFacts).toHaveLength(2);
      expect(ext.prompts).toHaveLength(3);
      expect(ext.memoryKeyword.length).toBeGreaterThan(2);
      expect(ext.memoryRewardLine.length).toBeGreaterThan(10);

      // No early flag spoiler emojis in titles or lookBadges
      expect(p.title).not.toContain('🚩');
      expect(p.lookBadge || '').not.toContain('🚩');

      const galleryUrls = [
        ...(p.galleryPhotos?.map((g) => g.url) ?? []),
        ...ext.slides.map((s) => s.url),
      ];
      for (const url of galleryUrls) {
        expect(url).not.toContain('wine-bar-booth.jpg');
        if (url === './images/cast/dog-park-picnic.jpg') continue;
        const owner = portraitOwnerByUrl.get(url);
        if (owner) {
          expect(owner).toBe(normOwner(p.name));
        } else {
          expect(url.startsWith('./images/scenes/')).toBe(true);
        }
      }
    }

    // Also verify appProfiles.ts has >= 6 photos per profile, zero cross-person portraits, and zero early spoiler badges
    const appPortraitOwners = new Map<string, string>(portraitOwnerByUrl);
    for (const sp of [...APP_SWIPE_PROFILES, ...HER_SWIPE_PROFILES]) {
      expect(sp.photos.length).toBeGreaterThanOrEqual(6);
      expect(sp.lookBadge).not.toContain('🚩');
      expect(sp.lookBadge).not.toContain('💚');
      const normalizedName = normOwner(sp.name);
      for (const ph of sp.photos) {
        expect(ph.photoUrl).not.toContain('wine-bar-booth.jpg');
        if (ph.photoUrl === './images/cast/dog-park-picnic.jpg') continue;
        const existingOwner = appPortraitOwners.get(ph.photoUrl);
        if (existingOwner) {
          expect(existingOwner).toBe(normalizedName);
        } else if (ph.photoUrl.startsWith('./images/cast/')) {
          appPortraitOwners.set(ph.photoUrl, normalizedName);
        }
      }
    }
  });

  it('covers every integer age 30..64 (Her) and 21..33 (His), with >= 10 petite women (5\'1"–5\'4") and strict quirk quarantine', () => {
    const herAges = new Set(HER_ARCHETYPES.map((h) => h.age));
    for (let yr = 30; yr <= 64; yr++) {
      expect(herAges.has(yr)).toBe(true);
    }
    const hisAges = new Set(HIS_ARCHETYPES.map((c) => c.age));
    for (let yr = 21; yr <= 33; yr++) {
      expect(hisAges.has(yr)).toBe(true);
    }

    const petiteHeights = new Set(['5\'1"', '5\'2"', '5\'3"', '5\'4"']);
    const petiteWomen = HER_ARCHETYPES.filter((h) => petiteHeights.has(h.height || ''));
    expect(petiteWomen.length).toBeGreaterThanOrEqual(10);

    const serialize = (p: unknown) => JSON.stringify(p);

    const qigongMatches = [...HER_ARCHETYPES, ...HIS_ARCHETYPES].filter((p) =>
      /qigong|tai\s*chi/i.test(serialize(p)),
    );
    expect(qigongMatches.map((p) => p.id)).toEqual(['sedona-qigong-mommy']);
    expect(qigongMatches[0].subplotTags).not.toContain('soft_mommy_domme');

    const seedOilBernedoodleMatches = [...HER_ARCHETYPES, ...HIS_ARCHETYPES].filter((p) =>
      /bernedoodle|seed[- ]oil|canola/i.test(serialize(p)),
    );
    expect(seedOilBernedoodleMatches.map((p) => p.id)).toEqual(['sloane-seedoil-bernedoodle-mommy']);
    expect(seedOilBernedoodleMatches[0].photoUrl).toBe('./images/cast/sloane-42f.jpg');
    expect(seedOilBernedoodleMatches[0].subplotTags).not.toContain('soft_mommy_domme');

    const pushPresentMatches = [...HER_ARCHETYPES, ...HIS_ARCHETYPES].filter((p) =>
      /mommy\s*makeover|push\s*present/i.test(serialize(p)),
    );
    expect(pushPresentMatches.map((p) => p.id)).toEqual(['summer-beach-puma']);
    expect(
      FIELD_GUIDE_ENTRIES.some((e) => /mommy\s*makeover|push\s*present|qigong|bernedoodle|seed[- ]oil/i.test(serialize(e))),
    ).toBe(false);

    // Verify new real-world archetypes exist
    const allTags = new Set(HER_ARCHETYPES.flatMap((h) => h.subplotTags));
    expect(allTags.has('soft_mommy_domme')).toBe(true);
    expect(allTags.has('glamma_grandmother')).toBe(true);
    expect(allTags.has('trophy_wife_reborn')).toBe(true);
    expect(allTags.has('tradwife_homemaker')).toBe(true);
    expect(allTags.has('eat_pray_love_nomad')).toBe(true);
    expect(allTags.has('csa_ranch_dreamer')).toBe(true);

    const forbiddenEthnicPattern =
      /\b(black(?!\s+cat)|latina|latino|asian|korean|irish|scandinavian)\b/i;
    for (const p of [...HER_ARCHETYPES, ...HIS_ARCHETYPES]) {
      expect(p.height).toMatch(/^\d'\d{1,2}"$/);
      expect(p.zodiac?.length).toBeGreaterThan(3);
      expect(forbiddenEthnicPattern.test(p.lookBadge || '')).toBe(false);
      expect(forbiddenEthnicPattern.test(p.shortHook)).toBe(false);
    }
  });

  it('expands Field Guide with Any-Age Princess Cougar, Soft Mommy-Domme, Cub Daddy/Zaddy, Bucket-List Tourist & 20+ Hall of Fame icons', () => {
    const princess = FIELD_GUIDE_ENTRIES.find((e) => e.id === 'princess_cougar')!;
    expect(princess).toBeDefined();
    expect(princess.category).toBe('crossover_lore');
    expect(princess.ageRange).toMatch(/Any Age/i);

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
      'Kris Jenner',
      'Macron',
      'Gabrielle Union',
      'Julianne Moore',
      'Cameron Diaz',
      'Eva Mendes',
      'Goldie Hawn',
      'Meghan Markle',
      'Madonna',
      'Mariah Carey',
      'Susan Sarandon',
      'Olivia Wilde',
      'How Stella Got Her Groove Back',
    ]) {
      expect(popText).toContain(icon);
    }
  });

  it('supports British Cub ("sorted", "half seven", "Yes, Mummy xx") and generational touchstones in DM vetting', () => {
    const julian = HIS_ARCHETYPES.find((c) => c.id === 'julian-oldsoul-cub')!;
    expect(julian.originOrAccent?.toLowerCase()).toMatch(/london|british/);

    const ukReply = evaluateDmLocally({
      personaName: 'Julian',
      personaAge: 27,
      personaRole: 'him',
      personaOrigin: julian.originOrAccent,
      playerMessage: 'Wine bar at 7:30 works, behave yourself tonight.',
    });
    expect(ukReply.passedVibeCheck).toBe(true);
    expect(ukReply.herReply.toLowerCase()).toMatch(/half seven|sorted|proper|cheeky|mummy|\bxx?\b/);

    const mummyReply = evaluateDmLocally({
      personaName: 'Simone',
      personaAge: 44,
      personaRole: 'her',
      playerMessage: 'Table for half seven is sorted, Yes, Mummy xx',
    });
    expect(mummyReply.passedVibeCheck).toBe(true);
    expect(mummyReply.herReply.toLowerCase()).not.toContain('babe');
  });
});
