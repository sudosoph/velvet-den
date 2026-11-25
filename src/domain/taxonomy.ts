export type PlayerRole = 'her' | 'him';
export type FelineTier = 'lynx' | 'puma' | 'cougar' | 'jaguar' | 'panther';
export type GenerationCohort = 'gen_z' | 'millennial' | 'gen_x' | 'icon_60_plus';

export type SubplotTag =
  | 'single_mom_sitter'
  | 'done_with_kids'
  | 'wants_kids_someday'
  | 'princess_treatment'
  | 'trail_leash_boss'
  | 'adult_children'
  | 'solo_sanctuary'
  | 'houseboy_eager'
  | 'income_gap';

export interface HerArchetype {
  id: string;
  name: string;
  age: number;
  title: string;
  tagline: string;
  vibeSummary: string;
  secretInsecurity: string;
  subplotTags: SubplotTag[];
  portraitVariant: 'puma' | 'princess' | 'cougar' | 'jaguar' | 'panther';
}

export interface HisArchetype {
  id: string;
  name: string;
  age: number;
  title: string;
  tagline: string;
  vibeSummary: string;
  secretInsecurity: string;
  subplotTags: SubplotTag[];
  portraitVariant: 'golden' | 'oldsoul' | 'trail' | 'architect';
}

export interface FieldGuideEntry {
  id: string;
  label: string;
  ageRange: string;
  category: 'feline_scale' | 'cub_taxonomy' | 'crossover_lore';
  headline: string;
  insiderLore: string;
  signatureTell: string;
}

export interface PairingAnalysis {
  role: PlayerRole;
  her: HerArchetype;
  his: HisArchetype;
  ageGap: number;
  felineTier: FelineTier;
  herGeneration: GenerationCohort;
  hisGeneration: GenerationCohort;
  isOfficialTenYearGap: boolean;
  badgeLabel: string;
  generationalHeadline: string;
  codeSwitchTip: string;
  activeSubplotTags: SubplotTag[];
}

export function classifyFelineTier(age: number): FelineTier {
  if (age < 30) return 'lynx';
  if (age < 40) return 'puma';
  if (age < 50) return 'cougar';
  if (age < 60) return 'jaguar';
  return 'panther';
}

export function classifyGeneration(age: number): GenerationCohort {
  if (age <= 29) return 'gen_z';
  if (age <= 45) return 'millennial';
  if (age <= 61) return 'gen_x';
  return 'icon_60_plus';
}

const TIER_LABELS: Record<FelineTier, string> = {
  lynx: 'Lynx',
  puma: 'Puma',
  cougar: 'Cougar',
  jaguar: 'Jaguar',
  panther: 'Panther / Sabertooth',
};

const GEN_LABELS: Record<GenerationCohort, string> = {
  gen_z: 'Gen-Z',
  millennial: 'Elder Millennial',
  gen_x: 'Gen-X',
  icon_60_plus: 'Silver Icon',
};

export const HER_ARCHETYPES: HerArchetype[] = [
  {
    id: 'claire-cougar-exec',
    name: 'Claire',
    age: 45,
    title: 'Done-With-Kids C-Suite Cougar',
    tagline: 'Mortgage paid, tubes tied, peaceful West Elm sanctuary—zero need for a sugar baby.',
    vibeSummary:
      'Raised two kids, divorced amicably, runs a 40-person team. Loves youthful energy, clean sheets, and a cub who handles the check without bruised pride.',
    secretInsecurity:
      'Catches harsh bathroom vanity lighting and wonders if softer skin or fine lines will bother him next to 24-year-olds.',
    subplotTags: ['done_with_kids', 'solo_sanctuary', 'adult_children', 'income_gap'],
    portraitVariant: 'cougar',
  },
  {
    id: 'serena-princess-cougar',
    name: 'Serena',
    age: 43,
    title: '"Spoil-Me Princess" Soft-Life Cougar',
    tagline: 'Spent 18 years carrying everyone else’s mental load—now wants doors opened, flowers, and zero planning.',
    vibeSummary:
      'Everyone assumes an older woman wants to boss a guy around. Not Serena: she craves a chivalrous younger man who plans the reservation, pulls out her chair, and treats her like royalty.',
    secretInsecurity:
      'Wonders if asking to be pampered makes her "too high-maintenance" or if he only swiped right expecting a dominant mommy stereotype.',
    subplotTags: ['princess_treatment', 'done_with_kids', 'solo_sanctuary'],
    portraitVariant: 'princess',
  },
  {
    id: 'maya-puma-mom',
    name: 'Maya',
    age: 36,
    title: 'Cool-Aunt Divorced Puma',
    tagline: 'One free Friday night a month ($20/hr babysitter on the clock)—do NOT send "might rain, raincheck?"',
    vibeSummary:
      'Under 40 so officially a Puma per subreddit law. Uses 😂 unironically, loves a Google Calendar invite, and spots a liquor-bottle mirror selfie from space.',
    secretInsecurity:
      'Worries one flaky cub wastes the only kid-free evening she gets all month—and whether her post-kids belly still turns heads.',
    subplotTags: ['single_mom_sitter', 'princess_treatment'],
    portraitVariant: 'puma',
  },
  {
    id: 'valerie-jaguar-trail',
    name: 'Valerie',
    age: 53,
    title: '6 AM Ridge-Runner Jaguar',
    tagline: 'Empty-nester Pilates & trail boss. Will out-climb a 25-year-old and keep him on a playful short leash.',
    vibeSummary:
      'Peak Gen-X confidence: hates all-day work-hour micro-texting, loves a bold 6 PM phone call, and redirects his 11 PM club stamina into steep Saturday switchbacks and Sunday houseboy chores.',
    secretInsecurity:
      'Pretends meddling brunch friends don’t get under her skin when they whisper, "What happens when you’re 65 and he’s 40?"',
    subplotTags: ['trail_leash_boss', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'jaguar',
  },
  {
    id: 'celeste-panther-icon',
    name: 'Celeste',
    age: 62,
    title: 'Palm Springs Panther / Sabertooth',
    tagline: 'Unapologetic silver-screen magnet. Zero tolerance for Snapchat, 100% appreciation for eager devotion.',
    vibeSummary:
      'Owns an architectural desert home, collects vinyl, and delights in mentoring an emotionally literate younger man who holds her hand in public with pride.',
    secretInsecurity:
      'Wonders in quiet moments if neck lines or silver strands break the illusion—right while he can barely breathe looking at her.',
    subplotTags: ['done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'panther',
  },
];

export const HIS_ARCHETYPES: HisArchetype[] = [
  {
    id: 'leo-golden-cub',
    name: 'Leo',
    age: 25,
    title: 'Golden Retriever Houseboy Cub',
    tagline: 'Clean loafers, post-Title IX EQ, eager to tie on a linen apron and scrub her kitchen spotless.',
    vibeSummary:
      'Gen-Z emotional fluency meets earnest effort. Happy to carry groceries, fix leaky faucets, and master the art of code-switching out of group-chat slang.',
    secretInsecurity:
      'Driving home wondering: "Do I actually have enough game for a woman like her—or was I just a fun Friday novelty she won’t text again?"',
    subplotTags: ['houseboy_eager', 'trail_leash_boss'],
    portraitVariant: 'golden',
  },
  {
    id: 'julian-oldsoul-cub',
    name: 'Julian',
    age: 26,
    title: 'Wants-Kids Old-Soul Gentleman',
    tagline: 'Opens every car door and refuses to split tapas—but still pictures being a dad someday.',
    vibeSummary:
      'Listens to 90s R&B, owns a real oak bedframe and lidded bathroom trash can, and falls hard and fast—setting up the classic fertility/timeline crossroads.',
    secretInsecurity:
      'Terrified she’ll dismiss him as "too young to know what he wants" before he proves he’s serious about committing.',
    subplotTags: ['wants_kids_someday', 'princess_treatment'],
    portraitVariant: 'oldsoul',
  },
  {
    id: 'dante-trail-cub',
    name: 'Dante',
    age: 24,
    title: 'High-Cardio Trail-Runner Cub',
    tagline: 'Bragged about his sub-7 mile pace—about to get humbled on her 6 AM ridge loop.',
    vibeSummary:
      'Fit, cheeky, magnetic smile. Has to suppress crew-sock TikTok brainrot ("lowkey cooked 💀") when meeting her 44-year-old architect friends.',
    secretInsecurity:
      'Worries his entry-level salary looks tiny next to her career—and hopes effort and devotion count more than Four Seasons money.',
    subplotTags: ['trail_leash_boss', 'houseboy_eager', 'income_gap'],
    portraitVariant: 'trail',
  },
  {
    id: 'miles-millennial-cub',
    name: 'Miles',
    age: 32,
    title: 'Established Millennial Cub',
    tagline: '30s architect who solely dates Jaguars & Cougars 45+—fluent in wine lists and emotional availability.',
    vibeSummary:
      'Proof that 30+ men are still top-tier Cubs when paired with a 45–62 Cougar/Jaguar/Panther. Zero roommate drama, maximum princess-treatment game.',
    secretInsecurity:
      'Wonders if her adult kids (who are nearly his age) will treat brunch like a hostile deposition.',
    subplotTags: ['princess_treatment', 'adult_children'],
    portraitVariant: 'architect',
  },
];

export const FIELD_GUIDE_ENTRIES: FieldGuideEntry[] = [
  {
    id: 'lynx',
    label: 'Lynx',
    ageRange: 'Ages 22–29',
    category: 'feline_scale',
    headline: 'Pre-Puma Apprentice',
    insiderLore:
      'Too young for official subreddit Cougar status, though occasionally dates slightly younger guys while studying the ways of the den.',
    signatureTell: 'Still figuring out her own lease renewal.',
  },
  {
    id: 'puma',
    label: 'Puma',
    ageRange: 'Ages 30–39',
    category: 'feline_scale',
    headline: 'Official Under-40 Age-Gap Contender',
    insiderLore:
      'Per r/CougarsAndCubs law: a woman under 40 dating a younger man is a Puma, not yet a Cougar! Often an Elder Millennial allergic to Snapchat streaks.',
    signatureTell: 'Uses 😂 unironically and panics if you call without texting first.',
  },
  {
    id: 'cougar',
    label: 'Cougar',
    ageRange: 'Ages 40–49 (10+ Yr Gap)',
    category: 'feline_scale',
    headline: 'The Benchmark Standard',
    insiderLore:
      'At least 40 years young and 10+ years older than her Cub or Kitten. Financially self-sufficient, allergically opposed to "hey" DMs, and NOT a sugar mama.',
    signatureTell: 'Has a peaceful home sanctuary and clocks a liquor-bottle mirror photo in 0.4 seconds.',
  },
  {
    id: 'princess_cougar',
    label: 'Princess Cougar',
    ageRange: 'Ages 40+ (Soft-Life Subtype)',
    category: 'feline_scale',
    headline: 'CEO at Work, Pampered Royalty on Dates',
    insiderLore:
      'Debunks the internet myth that every Cougar wants to dominate. After 20 years of carrying everyone else’s mental load, she melts for planned dates, flowers, and car doors.',
    signatureTell: 'Hands you the menu and says, "Surprise me—I made decisions all week."',
  },
  {
    id: 'jaguar',
    label: 'Jaguar',
    ageRange: 'Ages 50–59',
    category: 'feline_scale',
    headline: 'Sleek Empty-Nester Apex',
    insiderLore:
      'Kids are grown, fitness is dialed in, zero f*cks left for societal side-eyes. Expect 6 AM trail runs and razor-sharp Gen-X banter.',
    signatureTell: 'Prefers one confident 6 PM phone call over 47 text bubbles.',
  },
  {
    id: 'panther',
    label: 'Panther / Sabertooth',
    ageRange: 'Ages 60+',
    category: 'feline_scale',
    headline: 'Legendary Silver-Screen Icon',
    insiderLore:
      'Unapologetic, radiant, and magnetically selective. Dates Cubs in their late 20s to 40s who know how to hold conversation and hold her hand in public.',
    signatureTell: 'Waiters stutter; she orders two martinis without blinking.',
  },
  {
    id: 'golden_cub',
    label: 'Golden Retriever Houseboy Cub',
    ageRange: '10+ Years Junior',
    category: 'cub_taxonomy',
    headline: 'High-EQ, Chivalrous & Choreplay Certified',
    insiderLore:
      'Fluent in post-MeToo/Title IX boundaries yet still opens car doors, pays his own bills, and happily wears a linen apron on Sunday after passing the maturity test.',
    signatureTell: 'Owns clean sheets, hand soap, AND a bathroom trash can with a lid.',
  },
  {
    id: 'dm_goblin',
    label: 'The "hey" / Fetish DM Goblin',
    ageRange: 'Blocked Immediately',
    category: 'cub_taxonomy',
    headline: 'Cautionary Subreddit Specimen',
    insiderLore:
      'Treats older women like a bucket-list porn category, opens with "hey mommy" or asks for Snapchat, and has "Short-term, open to long + Nightlife" plastered on his bio.',
    signatureTell: 'Photo #2 is shirtless holding a handle of Tito’s under purple LED strips.',
  },
  {
    id: 'kitten',
    label: 'Kitten',
    ageRange: '10+ Years Junior (Female)',
    category: 'crossover_lore',
    headline: 'Younger Woman in an Age-Gap Match',
    insiderLore:
      'Official r/CougarsAndCubs banner term for a younger woman dating a Cougar (10+ years older) or older partner.',
    signatureTell: 'Brings immaculate playlist range and zero flakiness.',
  },
  {
    id: 'mountain_lion',
    label: 'Mountain Lion / Silver Fox',
    ageRange: 'Ages 40+ (Male Counterpart)',
    category: 'crossover_lore',
    headline: 'The Male Equivalent Across the Aisle',
    insiderLore:
      'Slang cousins in the broader age-gap ecosystem (Panther = under-40 male counterpart; Mountain Lion / Silver Fox = 40+ male counterpart).',
    signatureTell: 'Gets zero side-eyes from society—highlighting the double standard Cougars laugh past.',
  },
];

export function analyzePairing(
  her: HerArchetype,
  his: HisArchetype,
  role: PlayerRole,
): PairingAnalysis {
  const ageGap = her.age - his.age;
  const felineTier = classifyFelineTier(her.age);
  const herGeneration = classifyGeneration(her.age);
  const hisGeneration = classifyGeneration(his.age);
  const isOfficialTenYearGap = ageGap >= 10 && her.age >= 40;

  let badgeLabel: string;
  if (ageGap <= 0) {
    badgeLabel = 'Same-Age / Reverse-Gap Matchup';
  } else if (ageGap < 10) {
    badgeLabel = `${ageGap}-Year ${TIER_LABELS[felineTier]}-Lite Matchup`;
  } else if (felineTier === 'puma' || felineTier === 'lynx') {
    badgeLabel = `${ageGap}-Year Official ${TIER_LABELS[felineTier]} × Cub Matchup`;
  } else {
    badgeLabel = `${ageGap}-Year Official ${TIER_LABELS[felineTier]} × Cub Dynamic`;
  }

  const generationalHeadline = `${GEN_LABELS[herGeneration]} (${her.age}F) × ${GEN_LABELS[hisGeneration]} (${his.age}M)`;

  let codeSwitchTip: string;
  if (herGeneration === 'gen_z') {
    codeSwitchTip =
      'Lynx Peer Alert: Same generational slang fluency, so skip the excuses and stand out with real reservation effort and emotional follow-through.';
  } else if (herGeneration === 'millennial') {
    codeSwitchTip =
      'Elder Millennial Alert: Drop skull emojis (💀) & lowercase "u tryna link"—text before you call her phone, send a 7:30 calendar link, and ditch the crew socks.';
  } else if (herGeneration === 'gen_x') {
    codeSwitchTip =
      'Gen-X Alert: Skip all-day work micro-texting and Snapchat—make a confident 6 PM phone call, show up five minutes early, and never flake.';
  } else {
    codeSwitchTip =
      'Icon Alert: Put your phone face-down all dinner, order with poise, call instead of DMing, and own every public glance with pride.';
  }

  const tagSet = new Set<SubplotTag>([...her.subplotTags, ...his.subplotTags]);

  return {
    role,
    her,
    his,
    ageGap,
    felineTier,
    herGeneration,
    hisGeneration,
    isOfficialTenYearGap,
    badgeLabel,
    generationalHeadline,
    codeSwitchTip,
    activeSubplotTags: Array.from(tagSet),
  };
}
