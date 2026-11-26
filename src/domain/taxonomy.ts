export type PlayerRole = 'her' | 'him';
export type FelineTier = 'lynx' | 'puma' | 'cougar' | 'jaguar' | 'panther';
export type GenerationCohort = 'gen_z' | 'millennial' | 'gen_x' | 'icon_60_plus';

export type SubplotTag =
  | 'junior_cougar_gap'
  | 'single_mom_sitter'
  | 'dog_mom_divorced'
  | 'jaded_peer_men'
  | 'done_with_kids'
  | 'wants_kids_someday'
  | 'princess_treatment'
  | 'trail_leash_boss'
  | 'adult_children'
  | 'solo_sanctuary'
  | 'houseboy_eager'
  | 'income_gap'
  | 'fiery_foreign'
  | 'booktok_cat_mom'
  | 'phd_campus_cub'
  | 'loves_foreign_women'
  | 'modest_accent_gentleman'
  | 'spontaneous_getaway'
  | 'broke_dutch_obstacle'
  | 'montana_cowboy_slider'
  | 'black_cat_energy'
  | 'golden_retriever_energy'
  | 'zero_proof_wellness'
  | 'calm_sanctuary_domme'
  | 'coastal_dog_mommy'
  | 'frontier_ai_cub'
  | 'soft_mommy_domme'
  | 'cub_daddy_zaddy'
  | 'glamma_grandmother'
  | 'trophy_wife_reborn'
  | 'tradwife_homemaker'
  | 'eat_pray_love_nomad'
  | 'csa_ranch_dreamer';

export interface HingePhotoSlide {
  url: string;
  caption: string;
  tag: string;
}

export interface HingeExtendedProfile {
  schoolAndMajor: string;
  fieldOfWork: string;
  jobTitle: string;
  bio: string;
  lifeStance: string;
  funFacts: [string, string];
  prompts: { question: string; answer: string }[];
  slides: HingePhotoSlide[];
  memoryKeyword: string;
  memoryRewardLine: string;
  matchSelectivity: 'warm' | 'selective' | 'chaos_twist';
}

export interface HerArchetype {
  id: string;
  name: string;
  age: number;
  title: string;
  shortHook: string;
  tagline: string;
  vibeSummary: string;
  secretInsecurity: string;
  subplotTags: SubplotTag[];
  portraitVariant: 'puma' | 'princess' | 'cougar' | 'jaguar' | 'panther';
  photoUrl: string;
  lookBadge?: string;
  statusPill?: string;
  zodiac?: string;
  height?: string;
  loveLanguage?: string;
  originOrAccent?: string;
  signatureDrink?: string;
  petName?: string;
  galleryPhotos?: { label: string; url: string }[];
  interests?: string[];
}

export interface HisArchetype {
  id: string;
  name: string;
  age: number;
  title: string;
  shortHook: string;
  tagline: string;
  vibeSummary: string;
  secretInsecurity: string;
  subplotTags: SubplotTag[];
  portraitVariant: 'golden' | 'oldsoul' | 'trail' | 'architect';
  photoUrl: string;
  lookBadge?: string;
  statusPill?: string;
  zodiac?: string;
  height?: string;
  loveLanguage?: string;
  originOrAccent?: string;
  signatureDrink?: string;
  galleryPhotos?: { label: string; url: string }[];
  interests?: string[];
}

export interface FieldGuideEntry {
  id: string;
  label: string;
  ageRange: string;
  category: 'feline_scale' | 'cub_taxonomy' | 'crossover_lore' | 'pop_culture';
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
  zodiacSpark: string;
  energyPolarity?: string;
  codeSwitchTip: string;
  trackTitle: string;
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

/**
 * 37 Distinct Women Profiles, Covering EVERY SINGLE YEAR from 30 to 64!
 * Top row is curated for instant visual contrast (Malibu blonde surfer, copper redhead poolside,
 * emerald cabana braids, honey-blonde tennis coat, platinum desert icon, curly redhead art dealer,
 * sunlit California blonde, rooftop martini VP) with zero ethnic/quota labels, heights, star signs,
 * and real dating vitals lead every card.
 */
export const HER_ARCHETYPES: HerArchetype[] = [
  // === TOP SHOWCASE ROW (Instant Visual Contrast: Blonde Surf, Copper Redhead, Emerald Cabana, Honey Tennis, Platinum Icon) ===
  {
    id: 'astrid-blonde-cougar',
    name: 'Astrid',
    age: 41,
    title: 'Malibu Surfer & Biotech Cougar',
    shortHook: 'Golden blonde, ice-blue eyes, 6:30 AM dawn-patrol surf & cedar sauna.',
    tagline:
      'Biotech founder five minutes from First Point: salt-air waves, sporty bikinis, and cold-plunge grit.',
    vibeSummary:
      'Sold her diagnostics startup at 39 and moved to the Malibu point break. Lives in ocean bikinis and linen button-downs, and loves watching a fit Cub try to pop up on a longboard.',
    secretInsecurity:
      'Spent a decade out-working everyone in lab coats; still learning how to let a devoted younger partner take care of *her* on Sunday.',
    subplotTags: ['zero_proof_wellness', 'trail_leash_boss', 'done_with_kids', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/astrid-41f.jpg',
    lookBadge: 'Golden Blonde • Ice-Blue Eyes • Surfer',
    statusPill: 'Zero-Proof • Surf & Sauna',
    zodiac: '♒ Aquarius Sun • ♐ Sagittarius Rising',
    height: '5\'10"',
    loveLanguage: 'Dawn Surf Sessions & Sauna Steam',
    originOrAccent: 'Malibu Coastal Cool',
    signatureDrink: 'Zero-Proof Yuzu Spritz & Green Smoothie',
    galleryPhotos: [
      { label: '🏄‍♀️ Surf Bikini', url: './images/cast/astrid-41f.jpg' },
      { label: '🧖‍♀️ Cedar Sauna', url: './images/scenes/hotel-pool-sauna.jpg' },
      { label: '🐾 Dog Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Dawn Surfing', 'Cold Plunge & Sauna', 'Ocean Bikinis', 'Clean Wine', 'Coastal Runs'],
  },
  {
    id: 'sedona-breathwork-mommy',
    name: 'Sedona',
    age: 46,
    title: 'Breathwork & Nervous-System Studio Founder • Cougar',
    shortHook: '6:30 AM bamboo-courtyard Breathwork, morning stretch Cloud Hands & warm jasmine oolong.',
    tagline:
      '46F Breathwork & morning stretch studio founder in Sedona: unhurried nervous-system calm, cedar sauna evenings, and zero tolerance for podcast Cubsplaining.',
    vibeSummary:
      'Guides dawn Breathwork and slow morning stretch Cloud Hands in a sunlit courtyard, steep-brews single-estate jasmine oolong, and spots performative wellness bros in two seconds flat. Appreciates a grounded younger man who drops his shoulders, listens without lecturing, and enjoys quiet canyon stargazing.',
    secretInsecurity:
      'Everyone comes to her studio to be grounded and regulated; privately melts when an attentive Cub brews her evening tea and lets her rest.',
    subplotTags: [
      'calm_sanctuary_domme',
      'zero_proof_wellness',
      'black_cat_energy',
      'solo_sanctuary',
      'done_with_kids',
    ],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/celeste-2.jpg',
    lookBadge: 'Auburn Silver Waves • Serene Studio Founder',
    statusPill: 'Zero-Proof Tea • Sanctuary Studio',
    zodiac: '♍ Virgo Sun • ♏ Scorpio Rising',
    height: '5\'8"',
    loveLanguage: 'Unhurried Presence, Jasmine Oolong & Quiet Evenings',
    originOrAccent: 'Serene Red-Rock Cadence',
    signatureDrink: 'Warm Jasmine Oolong & Yuzu Botanical Elixir',
    galleryPhotos: [
      { label: '🧘‍♀️ Dawn Courtyard', url: './images/cast/celeste-2.jpg' },
      { label: '🧖‍♀️ Cedar Sauna', url: './images/scenes/hotel-pool-sauna.jpg' },
      { label: '🐾 Meadow Tea', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: [
      'Breathwork & morning stretch',
      'Jasmine Oolong Tea',
      'Cedar Sauna & Cold Plunge',
      'Canyon Stargazing',
      'Acoustic Vinyl',
    ],
  },
  {
    id: 'sloane-coastal-golden-mommy',
    name: 'Sloane',
    age: 42,
    title: 'Clean-Living Holistic Interior Designer • Cougar',
    shortHook: '5\'4" Santa Monica designer, 100% gluten-free & chef-crafted, with apricot Mini golden retriever Miso.',
    tagline:
      '42F coastal interior designer: bans canola oil at 50 paces, bakes cassava sourdough, and brings her fluffy apricot Mini golden retriever Miso to every farmers market.',
    vibeSummary:
      'Reads every restaurant oil label in 1.4 seconds, cooks exclusively in grass-fed ghee, beef tallow & cold-pressed olive oil, and designs sunlit linen homes with her Mini golden retriever Miso curled beside her.',
    secretInsecurity:
      'Tired of grumpy 44-year-old dates rolling their eyes when she asks the waiter about canola oil; adores an enthusiastic Cub who calls the restaurant ahead so she never has to ask.',
    subplotTags: [
      'coastal_dog_mommy',
      'zero_proof_wellness',
      'princess_treatment',
      'solo_sanctuary',
    ],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/sloane-42f.jpg',
    lookBadge: 'Sunlit Brunette Waves • 5\'4" • Mini golden retriever Miso',
    statusPill: '100% GF & chef-crafted • Dog Mom',
    zodiac: '♉ Taurus Sun • ♍ Virgo Rising',
    height: '5\'4"',
    loveLanguage: 'chef-crafted Home Cooking & Farmers-Market Walks w/ Miso',
    originOrAccent: 'Santa Monica Farmers-Market Warmth',
    signatureDrink: 'Iced Ceremonial Matcha & Tart-Cherry Spritz',
    petName: 'Miso (Apricot Mini golden retriever)',
    galleryPhotos: [
      { label: '🐶 Matcha & Miso', url: './images/cast/sloane-42f.jpg' },
      { label: '🥑 Sunday Kitchen', url: './images/scenes/sunday-kitchen-sanctuary.jpg' },
      { label: '🐾 Puppy Lawn', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: [
      'Zero cheap frying oil',
      '100% Gluten-Free',
      'Mini golden retriever Miso',
      'Grass-Fed Tallow & Ghee',
      'Coastal Interior Design',
    ],
  },
  {
    id: 'scarlett-redhead-jaguar',
    name: 'Scarlett',
    age: 51,
    title: 'Master Sommelier & Chef • Jaguar',
    shortHook: 'Fiery copper curls, emerald-green eyes, lush curves & midnight Barolo.',
    tagline:
      '51, copper curls, vivid emerald eyes, hourglass curves, and keys to a 900-bottle cellar.',
    vibeSummary:
      'Chef-owner of a candlelit coastal osteria who laughs with her whole chest, lounges poolside on stone terraces, and feeds her Cub handmade truffle tagliatelle at midnight after service.',
    secretInsecurity:
      'In a town full of green-juice clones, she watches for the split second a younger man proves he genuinely worships lush, real-woman curves.',
    subplotTags: ['princess_treatment', 'done_with_kids', 'adult_children', 'solo_sanctuary'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/scarlett-51f.jpg',
    lookBadge: 'Copper Redhead • Emerald Eyes • Sommelier',
    statusPill: 'Empty Nester • Osteria Owner',
    zodiac: '♉ Taurus Sun • ♏ Scorpio Venus',
    height: '5\'6"',
    loveLanguage: 'Midnight Handmade Pasta & Curve Worship',
    originOrAccent: 'Candlelit Osteria Warmth',
    signatureDrink: 'Aged Barolo in a "Big Carl" Glass',
    galleryPhotos: [
      { label: '🍷 Sunset Swim', url: './images/cast/scarlett-51f.jpg' },
      { label: '🍝 Osteria Kitchen', url: './images/scenes/sunday-kitchen-sanctuary.jpg' },
      { label: '🐾 Rosé Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Barolo & Truffles', 'Infinity Pools', 'Late-Night Cooking', 'Vinyl Soul', 'Coastal Escapes'],
  },
  {
    id: 'simone-auntie-cougar',
    name: 'Simone',
    age: 44,
    title: 'Music Attorney & Soft-Command Cougar',
    shortHook: 'Honey goddess braids, emerald Palm Springs bikinis, silk-pillowcase law & "Good boy" praise.',
    tagline:
      'Entertainment partner in peak Rich Auntie Era: cabana bikinis, 90s R&B vinyl, poised romantic command, and strict silk-pillowcase respect.',
    vibeSummary:
      'Negotiates festival headliner deals by day and floats in Palm Springs pools by Friday afternoon. Rewards attentive manners with warm "Good boy" praise, while her cousins at Sunday cookout vet your soul in ninety seconds flat.',
    secretInsecurity:
      'Used to being the powerhouse fixer in every room, melts completely when a tall, emotionally fluent Cub rubs her shoulders and handles dinner without ego.',
    subplotTags: ['soft_mommy_domme', 'princess_treatment', 'done_with_kids', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'princess',
    photoUrl: './images/cast/simone-44f.jpg',
    lookBadge: 'Honey Braids • Cabana Bikini • Music Law',
    statusPill: 'Child-Free • Homeowner',
    zodiac: '♏ Scorpio Sun • ♉ Taurus Moon',
    height: '5\'8"',
    loveLanguage: 'Shoulder Massages, "Good Boy" Praise & Zero Ego',
    originOrAccent: 'Music-Row Smooth Cadence',
    signatureDrink: 'French 75 Cabana-Side',
    galleryPhotos: [
      { label: '👙 Cabana Bikini', url: './images/cast/simone-44f.jpg' },
      { label: '🌴 Palm Springs', url: './images/scenes/palm-springs-resort.jpg' },
      { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Palm Springs Cabanas', '90s R&B Vinyl', 'Silk Loungewear', 'Espresso Tonics', 'Art Collecting'],
  },
  {
    id: 'brooke-tennis-cougar',
    name: 'Brooke',
    age: 42,
    title: 'Country-Club Tennis & Matcha Cougar',
    shortHook: 'Sleek honey blonde, camel cashmere, mixed-doubles fire & age-slider dare.',
    tagline:
      'Lowered her dating-app slider from 40 to 25 on a dare after Kristin Cavallari & Montana Boyz, and hasn’t stopped smiling since.',
    vibeSummary:
      '42F luxury hospitality consultant with sunlit honey-blonde hair, killer backhand slice, and zero patience for grumpy 46-year-old divorcés complaining about their sciatica.',
    secretInsecurity:
      'Her tennis-club doubles partners gossip non-stop, she needs a Cub who walks onto the club patio beside her like he owns the zip code.',
    subplotTags: ['zero_proof_wellness', 'montana_cowboy_slider', 'princess_treatment', 'done_with_kids', 'solo_sanctuary'],
    portraitVariant: 'princess',
    photoUrl: './images/cast/brooke-42f.jpg',
    lookBadge: 'Honey Blonde • Tennis Fit • Cashmere',
    statusPill: 'Matcha & Zero-Proof • Slider 25+',
    zodiac: '♎ Libra Sun • ♌ Leo Rising',
    height: '5\'7"',
    loveLanguage: 'Court-Side Iced Matcha & Bold Pursuit',
    originOrAccent: 'Sunlit Montecito Polish',
    signatureDrink: 'Iced Ceremonial Matcha & Tart-Cherry Mocktail',
    galleryPhotos: [
      { label: '🧥 Camel Trench', url: './images/cast/brooke-42f.jpg' },
      { label: '🏖️ Cabo Resort', url: './images/scenes/palm-springs-resort.jpg' },
      { label: '🥂 Terrace', url: './images/scenes/candlelit-cocktails.jpg' },
    ],
    interests: ['Club Tennis', 'Reformer Pilates', 'Iced Matcha', 'Cabo Weekends', 'Country Music'],
  },
  {
    id: 'celeste-panther-icon',
    name: 'Celeste',
    age: 62,
    title: 'Palm Springs "Glam-ma" Icon • Panther',
    shortHook: 'Platinum-silver "Gigi", 10 AM toddler grandkid soccer in Celine shades & 8 PM desert martinis.',
    tagline: 'Active 62F Palm Springs Glam-ma ("Gigi" to two): cheers at Saturday morning grandkid soccer, then owns every candlelit booth by eight.',
    vibeSummary:
      'Owns a mid-century desert home, refuses to be called Grandma ("It is Gigi, darling"), brings orange slices to 10 AM toddler soccer in silk linen, and delights in an emotionally literate younger man who holds her hand in public with pride.',
    secretInsecurity:
      'Wonders in quiet moments if silver strands or her Saturday Gigi duties scare him, right while he thinks her full life is magnetic.',
    subplotTags: ['glamma_grandmother', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'panther',
    photoUrl: './images/cast/celeste-62f.jpg',
    lookBadge: 'Platinum Silver • Active Glam-ma "Gigi"',
    statusPill: 'Proud Gigi of 2 • Desert Sanctuary',
    zodiac: '♒ Aquarius Sun • ♌ Leo Rising',
    height: '5\'6"',
    loveLanguage: 'Public Hand-Holding & Vinyl Jazz Nights',
    originOrAccent: 'Silver-Screen Mid-Atlantic Poise',
    signatureDrink: 'Gibson Martini Up',
    galleryPhotos: [
      { label: '🏖️ Desert Pool', url: './images/cast/celeste-62f.jpg' },
      { label: '🌴 Mid-Century Patio', url: './images/scenes/palm-springs-resort.jpg' },
      { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Palm Springs Pools', 'Vinyl Jazz', 'Dry Martinis', 'Saturday Gigi Soccer', 'Modern Art'],
  },
  {
    id: 'georgia-gallery-cougar',
    name: 'Georgia',
    age: 46,
    title: 'Curly Redhead Art Dealer • Cougar',
    shortHook: 'Wild copper ringlets, freckles, vivid green eyes & midnight gallery openings.',
    tagline:
      'Contemporary art dealer who spots fake bravado in three seconds and rewards real wit with private-terrace mezcal.',
    vibeSummary:
      '46F natural copper-redhead with sun-kissed freckles, emerald eyes, and a sunlit loft packed with large-scale canvases. Loves spontaneous road trips and men who aren’t afraid of bold color.',
    secretInsecurity:
      'Spent years dating pretentious art-world men who competed with her success, melts for an earnest younger man who cheers loudest at her openings.',
    subplotTags: ['spontaneous_getaway', 'done_with_kids', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/georgia-46f.jpg',
    lookBadge: 'Curly Redhead • Green Eyes & Freckles',
    statusPill: 'Child-Free • Loft Owner',
    zodiac: '♐ Sagittarius Sun • ♈ Aries Moon',
    height: '5\'9"',
    loveLanguage: 'Spontaneous Road Trips & Deep Talks',
    originOrAccent: 'SoHo / Santa Fe Creative Spark',
    signatureDrink: 'Smoky Mezcal Negroni',
    interests: ['Art Openings', 'Desert Road Trips', 'Vinyl Records', 'Roof Terraces', 'Natural Wine'],
  },
  {
    id: 'summer-beach-puma',
    name: 'Summer',
    age: 32,
    title: 'Reformer Pilates Studio Owner • Puma',
    shortHook: 'Sun-bleached blonde Reformer Pilates boss seeking a fit younger Cub for baby #1, a push present & Mommy Makeover.',
    tagline:
      '32F Manhattan Beach Reformer Pilates founder: ready for one gorgeous baby with an energetic younger Cub, a diamond push present, and her post-baby Mommy Makeover.',
    vibeSummary:
      'Sun-kissed blonde studio founder who watched 36-year-old men stall on family timelines. Openly shares over fish tacos that she wants an enthusiastic, fit younger Cub to have her first child with, complete with a sparkling push present and a Beverly Hills Mommy Makeover already researched.',
    secretInsecurity:
      'Playfully upfront about her baby-and-push-present vision so flakes self-select out early; falls hard when a devoted Cub leans right in without blinking.',
    subplotTags: ['wants_kids_someday', 'princess_treatment', 'junior_cougar_gap', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/summer-32f.jpg',
    lookBadge: 'Sunlit Blonde • Ocean-Blue Eyes • Pilates Boss',
    statusPill: 'Wants 1st Baby • Pilates Founder',
    zodiac: '♌ Leo Sun • ♊ Gemini Mars',
    height: '5\'6"',
    loveLanguage: 'Grand Gestures, Push-Present Promises & Post-Pilates Smoothies',
    originOrAccent: 'Manhattan Beach Studio Glow',
    signatureDrink: 'Mango-Collagen Smoothie & Crisp Rosé',
    interests: ['Reformer Pilates', 'Future Family Planning', 'Beach Walks', 'Jewelry Shopping', 'Fish Tacos'],
  },
  {
    id: 'claire-cougar-exec',
    name: 'Claire',
    age: 45,
    title: 'VP of Product • Rooftop Cougar',
    shortHook: 'Mortgage paid, kids grown, espresso waves & zero sugar-mama tolerance.',
    tagline: 'Mortgage paid, tubes tied, peaceful sanctuary, zero need for a sugar baby.',
    vibeSummary:
      'Raised two kids, divorced amicably, runs a 40-person team. Loves youthful energy, crisp 62°F bamboo sheets, and a Cub who handles the check without bruised pride.',
    secretInsecurity:
      'Catches harsh bathroom vanity lighting and wonders if softer skin or fine lines will bother him next to 24-year-olds.',
    subplotTags: ['black_cat_energy', 'done_with_kids', 'solo_sanctuary', 'adult_children', 'income_gap'],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/claire-45f.jpg',
    lookBadge: 'Espresso Waves • Hazel Eyes • VP Poise',
    statusPill: '🐈‍⬛ Black Cat • Paid-Off Home',
    zodiac: '♑ Capricorn Sun • ♏ Scorpio Rising',
    height: '5\'8"',
    loveLanguage: 'Acts of Competence & Clean Sheets',
    originOrAccent: 'Manhattan / West-Coast Polish',
    signatureDrink: 'Dirty Hendricks Martini (3 Olives)',
    interests: ['Espresso Martinis', 'Coastal Drives', 'Architecture', 'Pilates', 'Palm Springs'],
  },

  // === COMPLETE EVERY-YEAR ROSTER: 30s PUMAS & JUNIOR COUGARS (30-39) ===
  {
    id: 'tessa-somm-puma',
    name: 'Tessa',
    age: 30,
    title: 'Natural-Wine Bar Owner • Newly-30 Puma',
    shortHook: 'Platinum-blonde satin camisole, candlelight wit & newly-minted 30s standards.',
    tagline:
      'Turned 30, opened her own candlelit wine bar, and immediately banned bare-mattress situationships.',
    vibeSummary:
      '30F blonde hospitality founder who pairs orange wines by candlelight and loves confident 24-27 Cubs who actually make reservations.',
    secretInsecurity:
      'Freshly 30 and pouring everything into her first business, hopes he brings calm support instead of 2 AM bar-crawl drama.',
    subplotTags: ['junior_cougar_gap', 'princess_treatment', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/tessa-30f.jpg',
    lookBadge: 'Champagne Blonde • Silk Camisole • 5\'3"',
    statusPill: 'Child-Free • Bar Founder',
    zodiac: '♊ Gemini Sun • ♎ Libra Rising',
    height: '5\'3"',
    loveLanguage: 'Late-Night Tasting Flights & Real Plans',
    originOrAccent: 'Downtown Candlelight Chic',
    signatureDrink: 'Chilled Skin-Contact Pinot Gris',
    interests: ['Natural Wine', 'Vinyl Booths', 'Midnight Pasta', 'Boutique Hotels'],
  },
  {
    id: 'isla-jazz-puma',
    name: 'Isla',
    age: 31,
    title: 'Film Composer & Chic-Bob Puma',
    shortHook: 'Sharp blonde bob, grand piano loft, dry wit & 18-hour coastal escapes.',
    tagline:
      'Scores indie thrillers in a sunlit loft, allergic to small talk, weak for rolled shirt sleeves.',
    vibeSummary:
      '31F composer with a French-girl blonde bob and emerald eyes who loves spontaneous overnight train/coastal trips after one great FaceTime.',
    secretInsecurity:
      'Lives in her head writing music for days, needs a grounded younger man who pulls her outside into the sun.',
    subplotTags: ['black_cat_energy', 'spontaneous_getaway', 'junior_cougar_gap', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/isla-31f.jpg',
    lookBadge: 'Blonde French Bob • Studio Loft',
    statusPill: '🐈‍⬛ Black Cat • Night Owl',
    zodiac: '♓ Pisces Sun • ♏ Scorpio Moon',
    height: '5\'7"',
    loveLanguage: '18h Getaways & Playing Songs at 1 AM',
    originOrAccent: 'Crisp Studio Cadence',
    signatureDrink: 'Boulevardier on a Big Cube',
    interests: ['Film Scoring', 'Jazz Speakeasies', 'Hotel Saunas', 'Espresso'],
  },
  {
    id: 'hannah-vineyard-puma',
    name: 'Hannah',
    age: 33,
    title: 'Tradwife-Curious Sourdough Homemaker • Puma',
    shortHook: '5\'3" sunlit waves, warm dimples, 5 AM sourdough starter, peach canning & ironed linen.',
    tagline:
      '33F Sonoma cottage homemaker & pastry baker: cans summer peaches, irons linen aprons, and melts for old-school chivalry and meadow picnics.',
    vibeSummary:
      'Left corporate burnout to bake wild-fermented sourdough, tend heirloom roses, and build a warm, slow-paced home. Adores a tall, chivalrous younger man with steady hands who appreciates homemade pie and carries the heavy crates.',
    secretInsecurity:
      'Spends all week nurturing everyone else’s table, secretly craves a partner who plans sweeping Friday romance purely for her.',
    subplotTags: ['tradwife_homemaker', 'junior_cougar_gap', 'princess_treatment', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/hannah-33f.jpg',
    lookBadge: 'Sunlit Honey Waves • 5\'3" • Cottage Baker',
    statusPill: 'Homemaker Era • Sonoma Cottage',
    zodiac: '♉ Taurus Sun • ♋ Cancer Moon',
    height: '5\'3"',
    loveLanguage: 'Warm Sourdough, Peach Jam & Meadow Picnics',
    originOrAccent: 'Sonoma Vineyard Warmth',
    signatureDrink: 'Sonoma Brut Rosé & Chamomile',
    interests: ['Sourdough Baking', 'Peach Canning', 'Meadow Picnics', 'Retro Bowling', 'Heirloom Roses'],
  },
  {
    id: 'zoe-equestrian-puma',
    name: 'Zoe',
    age: 34,
    title: '5:30 AM Horse Girl & Equine Vet • Puma',
    shortHook: '5\'4" golden-hour blonde, 5:30 AM dressage barn boots, manual truck & sundress Fridays.',
    tagline:
      '34F dressage rider & equine vet: mucking stalls by 5:30 AM, sundresses by 7 PM, and unapologetically weak for a 6-foot cowboy or firefighter Cub.',
    vibeSummary:
      'Certified Horse Girl who backs up a two-horse trailer in one try and lowered her age slider after watching city peers panic over a flat tire. Hay in her braid at dawn, candlelit bourbon by dusk.',
    secretInsecurity:
      'Self-reliant all day at the barn, melts instantly when he pulls out her chair and tells her she is off duty tonight.',
    subplotTags: ['montana_cowboy_slider', 'trail_leash_boss', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/zoe-34f.jpg',
    lookBadge: 'Golden-Hour Blonde • 5\'4" • Horse Girl',
    statusPill: '5:30 AM Barn Boss • Acreage',
    zodiac: '♐ Sagittarius Sun • ♌ Leo Mars',
    height: '5\'4"',
    loveLanguage: 'Bonfire Nights & Competent Hands',
    originOrAccent: 'Bozeman / Central Coast Breeze',
    signatureDrink: 'Bourbon & Ginger Twist',
    interests: ['5:30 AM Dressage', 'Trail Riding', 'Country Concerts', 'Campfire Steaks', 'Golden Retrievers'],
  },
  {
    id: 'priya-surgeon-puma',
    name: 'Priya',
    age: 35,
    title: 'Night-Shift Trauma RN & Canyon Hiker • Puma',
    shortHook: '5\'3" night-shift trauma nurse, golden retriever Rani & 7:30 AM post-shift street tacos.',
    tagline:
      'Runs Level-1 trauma bays from 7 PM to 7 AM; craves sunlit canyon hikes with her golden retriever Rani and zero-baggage playfulness off-shift.',
    vibeSummary:
      '35F night-shift trauma RN with bright hazel eyes and zero patience for sleepy "wyd" texts. Win over Rani on the coastal ridge trail, bring breakfast tacos at 7:30 AM after her shift, and never complain about a paper cut.',
    secretInsecurity:
      'Hospital night shifts scare off rigid 9-to-5 men her age; loves a flexible, affectionate younger partner who guards her daytime sleep.',
    subplotTags: ['dog_mom_divorced', 'trail_leash_boss', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/priya-35f.jpg',
    lookBadge: '5\'3" • Hazel Eyes • Trauma RN & Dog Mom',
    statusPill: 'Child-Free • Golden Retriever Rani',
    zodiac: '♏ Scorpio Sun • ♑ Capricorn Moon',
    height: '5\'3"',
    loveLanguage: '7:30 AM Post-Shift Breakfast & Trail Walks',
    originOrAccent: 'Bay Area Trauma-Bay Calm',
    signatureDrink: 'Cardamom Old Fashioned',
    petName: 'Rani',
    galleryPhotos: [
      { label: '🏔️ Trail & Dog', url: './images/cast/priya-35f.jpg' },
      { label: '🐾 Rosé Picnic', url: './images/cast/dog-park-picnic.jpg' },
      { label: '🍳 Post-Shift Kitchen', url: './images/scenes/sunday-kitchen-sanctuary.jpg' },
    ],
    interests: ['Coastal Hiking', 'Golden Retrievers', '7 AM Street Tacos', 'Reformer Pilates', 'Travel'],
  },
  {
    id: 'maya-puma-mom',
    name: 'Maya',
    age: 36,
    title: 'Cool-Aunt Divorced Puma',
    shortHook: '$20/hr sitter on the clock, never flake or ask for Snap.',
    tagline: 'One free Friday night a month ($20/hr babysitter on the clock), do NOT send "might rain, raincheck?"',
    vibeSummary:
      'Under 40 so officially a Puma per community law. Uses 😂 unironically, loves a Google Calendar invite, and guards her kid’s world fiercely.',
    secretInsecurity:
      'Worries one flaky cub wastes the only kid-free evening she gets all month, and whether her post-kids belly still turns heads.',
    subplotTags: ['single_mom_sitter', 'princess_treatment'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/maya-36f.jpg',
    lookBadge: '5\'4" • Warm Waves • Sidewalk Café Glow',
    statusPill: '1 Kid • Sitter Ready Friday',
    zodiac: '♊ Gemini Sun • ♐ Sagittarius Moon',
    height: '5\'4"',
    loveLanguage: 'Punctuality & Calendar Invites',
    originOrAccent: 'Quick-Wit Urban Energy',
    signatureDrink: 'Spicy Margarita (Salt Rim)',
    interests: ['Patio Margaritas', 'Calendar Precision', 'Live Comedy', 'Sunday Coffees'],
  },
  {
    id: 'chloe-puma-dogmom',
    name: 'Chloé',
    age: 37,
    title: 'Child-Free-by-Choice Jet-Setter & Dog Mom',
    shortHook: '5\'2", proudly child-free by choice, carry-on passport stamps & rescue pup Barnaby.',
    tagline:
      'Happily divorced, 100% child-free by choice, four continents a year in a carry-on, and rescue mutt Barnaby holds final veto power.',
    vibeSummary:
      '37, petite 5\'2" spitfire, zero kids ever, and spoiled scruffy rescue dog Barnaby. Swiped past bitter 42-year-old men complaining about their exes over IPAs and discovered younger men actually pack fast and bring real enthusiasm.',
    secretInsecurity:
      'After divorcing a man-child, part of her watches closely to make sure no partner ever treats her like an unpaid travel agent or life manager.',
    subplotTags: ['dog_mom_divorced', 'jaded_peer_men', 'done_with_kids', 'spontaneous_getaway', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/chloe-37f.jpg',
    lookBadge: '5\'2" • Patio Rosé • Child-Free Jet-Setter',
    statusPill: 'Child-Free by Choice • Pup Barnaby',
    zodiac: '♉ Taurus Sun • ♒ Aquarius Rising',
    height: '5\'2"',
    loveLanguage: 'Winning Over Barnaby & Spontaneous Flights',
    originOrAccent: 'Outdoorsy Dry Snark',
    signatureDrink: 'Crisp Sauvignon Blanc',
    petName: 'Barnaby',
    interests: ['Child-Free Travel', 'Rescue Dogs', 'Patio Rosé', 'Farmers Markets', 'Weekend Hikes'],
  },
  {
    id: 'sienna-junior-cougar',
    name: 'Sienna',
    age: 38,
    title: '6-Yr Gap "Junior Cougar"',
    shortHook: '6 years older: 2008 high-school math teases & sweet-spot chemistry.',
    tagline:
      'Under the strict 10-year Cougar cutoff, rocking a 6-year "Junior Cougar" gap with shared playlists and homeowner poise.',
    vibeSummary:
      '38F boutique designer paired with a 32M match: zero "Is that your son?" stares from waiters, yet she still lovingly roasts him for taking 10th-grade geometry while she was ordering martinis in 2009.',
    secretInsecurity:
      'Wonders if a 6-year clock offset still stings when she’s ready for intentional milestones now and his peer group is still in chaotic groomsmen summers.',
    subplotTags: ['junior_cougar_gap', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/sienna-38f.jpg',
    lookBadge: 'Honey Highlights • Vinyl Lounge Chic',
    statusPill: 'Homeowner • 6-Yr Sweet Spot',
    zodiac: '♎ Libra Sun • ♌ Leo Moon',
    height: '5\'6"',
    loveLanguage: 'Playful Banter & Shared Playlists',
    originOrAccent: 'Boutique Design Studio Chic',
    signatureDrink: 'Espresso Martini',
    interests: ['Vinyl & Wine Bars', 'Boutique Hotels', 'Le Creuset Dinners', 'Palm Springs'],
  },
  {
    id: 'camila-lagoon-puma',
    name: 'Camila',
    age: 39,
    title: 'Mezcal Lounge & Lagoon Puma',
    shortHook: '5\'3" honey curls, waterfall bikinis & midnight kitchen salsa tests.',
    tagline:
      '39 and thriving, owns the sexiest mezcal & vinyl room downtown and swims every waterfall lagoon from Oahu to Tulum.',
    vibeSummary:
      'On the cusp of 40 with sun-lit honey curls, infectious laugh, and unapologetic curves. Expect spontaneous beach weekends, spicy banter, and an immediate rhythm check when music comes on in the kitchen.',
    secretInsecurity:
      'Turns 40 next birthday and jokes about graduating from Puma to full Cougar, secretly melts when he plans a surprise getaway without being asked.',
    subplotTags: ['spontaneous_getaway', 'princess_treatment', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/camila-39f.jpg',
    lookBadge: '5\'3" • Honey Curls • Mezcal Lounge',
    statusPill: 'Child-Free • Lounge Owner',
    zodiac: '♌ Leo Sun • ♓ Pisces Venus',
    height: '5\'3"',
    loveLanguage: 'Kitchen Salsa Spins & Island Flights',
    originOrAccent: 'Warm Coastal Honey Lilt',
    signatureDrink: 'Artisanal Tobalá Mezcal',
    galleryPhotos: [
      { label: '🏖️ Lagoon Bikini', url: './images/cast/camila-39f.jpg' },
      { label: '🥂 Cocktail Hour', url: './images/scenes/candlelit-cocktails.jpg' },
      { label: '🐾 Park Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Waterfall Swims', 'Kitchen Dancing', 'Artisanal Mezcal', 'Beach Bikinis', 'Live Vinyl'],
  },

  // === COMPLETE EVERY-YEAR ROSTER: 40s COUGARS (40, 49) ===
  {
    id: 'amber-milestone-cougar',
    name: 'Amber',
    age: 40,
    title: 'Fine Art & Estate Jewelry Collector • Cougar',
    shortHook: '5\'1" pocket glamour, 18k estate gold auctions, honey-blonde waves & Cabo sunsets.',
    tagline:
      'Turned 40 in Cabo, collects 1970s estate gold & contemporary canvases, and discovered 6-foot Cubs adore a 5\'1" powerhouse in heels.',
    vibeSummary:
      '40F fine-art advisor and estate-jewelry collector with voluminous blonde waves and razor-sharp auction instincts. Needs a tall, attentive Cub to reach her top gallery shelf and zip her gown before Sotheby’s previews.',
    secretInsecurity:
      'Newly inducted into the 40+ club, thrilled when a younger man looks at her like she’s the most dazzling woman in the auction room.',
    subplotTags: ['montana_cowboy_slider', 'princess_treatment', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'princess',
    photoUrl: './images/cast/amber-40f.jpg',
    lookBadge: '5\'1" Petite Glam • Estate Gold & Art',
    statusPill: 'Divorced • Art & Gold Collector',
    zodiac: '♈ Aries Sun • ♌ Leo Rising',
    height: '5\'1"',
    loveLanguage: 'Auction Previews, Cabo Sunsets & Bold Compliments',
    originOrAccent: 'Laguna Beach Gallery Glamour',
    signatureDrink: 'Reposado Paloma',
    interests: ['Estate Gold Auctions', 'Contemporary Art', 'Cabo Getaways', 'Rooftop Dinners'],
  },
  {
    id: 'nadia-booktok-cat-cougar',
    name: 'Nadia',
    age: 41,
    title: 'Cozy BookTok & Stare-Down Cat Cougar',
    shortHook: '5\'2" cashmere introvert, spicy romantasy shelf & orange tabby Mochi.',
    tagline:
      'Publishing director who gleefully cancels club plans for Pinot Noir, 600-page spicy fantasy novels, and her judgmental orange cat Mochi.',
    vibeSummary:
      '41F petite witty homebody in off-shoulder knitwear with reading glasses. To enter her inner sanctum, you must pass Mochi’s unblinking headboard stare-down, and never mock her *ACOTAR* shelf.',
    secretInsecurity:
      'Wonders if a lively 26-year-old Cub will get bored of cozy rainy-Friday nights in, until he asks which chapter of her spicy book he should study.',
    subplotTags: ['black_cat_energy', 'booktok_cat_mom', 'dog_mom_divorced', 'jaded_peer_men', 'done_with_kids', 'solo_sanctuary'],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/claire-2.jpg',
    lookBadge: '5\'2" • Reading Glasses • Cat Mom',
    statusPill: '🐈‍⬛ Black Cat • Orange Cat Mochi',
    zodiac: '♋ Cancer Sun • ♍ Virgo Moon',
    height: '5\'2"',
    loveLanguage: 'Quality Time & Reading Chapters Aloud',
    originOrAccent: 'Pacific Northwest Cozy Wit',
    signatureDrink: 'Willamette Pinot Noir',
    petName: 'Mochi',
    galleryPhotos: [
      { label: '📚 Cozy Glow', url: './images/cast/claire-2.jpg' },
      { label: '🌧️ Rainy Suite', url: './images/scenes/cozy-rain-suite.jpg' },
      { label: '🐾 Park Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Spicy BookTok', 'Orange Cat Mochi', 'Rainy Wine Nights', 'Co-Op Couch Games', 'Cashmere'],
  },
  {
    id: 'serena-princess-cougar',
    name: 'Serena',
    age: 43,
    title: 'Adored Second-Act Trophy Wife Era • Cougar',
    shortHook: '5\'2", burned by a hyper-critical older ex, now thriving in peonies, convertibles & pure adoration.',
    tagline: 'Spent ten years with a grumpy older ex-husband who nitpicked everything; now wants fresh peonies, car doors, and shameless worship from an ambitious younger man.',
    vibeSummary:
      '43F creative consultant who swore off cynical 52-year-old men forever. At 5\'2" in silk wrap dresses, she openly embraces her pampered Trophy-Wife rebirth with a chivalrous Cub who treats her smile like the prize of the century.',
    secretInsecurity:
      'Her critical ex made her shrink; melts completely when a devoted younger partner beams just walking into a restaurant beside her.',
    subplotTags: ['trophy_wife_reborn', 'princess_treatment', 'done_with_kids', 'solo_sanctuary'],
    portraitVariant: 'princess',
    photoUrl: './images/cast/serena-43f.jpg',
    lookBadge: '5\'2" • Chestnut Waves • Peonies & Convertible',
    statusPill: 'Trophy-Wife Rebirth • Homeowner',
    zodiac: '♌ Leo Sun • ♎ Libra Rising',
    height: '5\'2"',
    loveLanguage: 'Planned Reservations, Car Doors & Fresh Peonies',
    originOrAccent: 'Beverly Hills Warm Drawl',
    signatureDrink: 'Chilled Rosé Champagne',
    interests: ['Fresh Peonies', 'Coastal Convertibles', 'Silk Robes', 'Candlelit Bistros'],
  },
  {
    id: 'valentina-fiery-cougar',
    name: 'Valentina',
    age: 44,
    title: 'Fiery International Wine Importer • Cougar',
    shortHook: 'Crimson silk gown, hypnotic Madrid accent, Scorpio rising fire & zero lukewarm men.',
    tagline:
      'European-born wine importer in scarlet silk: rapid-fire passion, midnight Rioja, and volcanic side-eye for timid effort.',
    vibeSummary:
      '44F international powerhouse whose accent drops an octave over red wine. Switches into breathless native-tongue endearments when you step up boldly, and roasts lukewarm effort in two languages.',
    secretInsecurity:
      'Men her own age kept calling her "intimidating" or "too passionate", she melts for a devoted younger Cub who worships her fire without flinching.',
    subplotTags: ['fiery_foreign', 'spontaneous_getaway', 'princess_treatment', 'done_with_kids', 'solo_sanctuary'],
    portraitVariant: 'princess',
    photoUrl: './images/cast/valentina-44f.jpg',
    lookBadge: 'Blonde Waves • Crimson Gown • Fiery Accent',
    statusPill: 'Child-Free • Bilingual Jet-Set',
    zodiac: '♈ Aries Sun • ♏ Scorpio Rising',
    height: '5\'7"',
    loveLanguage: 'Physical Touch & Bold Pursuit',
    originOrAccent: 'Smoky Madrid / Bogotá Accent',
    signatureDrink: 'Reserva Rioja & Spicy Mezcal',
    galleryPhotos: [
      { label: '🍷 Crimson Silk', url: './images/cast/valentina-44f.jpg' },
      { label: '🥂 Rooftop Spark', url: './images/scenes/candlelit-cocktails.jpg' },
      { label: '🧖‍♀️ Pool & Sauna', url: './images/scenes/hotel-pool-sauna.jpg' },
    ],
    interests: ['International Wine', 'Spontaneous 18h Trips', 'Kitchen Dancing', 'Hotel Saunas', 'Bold Romance'],
  },
  {
    id: 'helena-riviera-cougar',
    name: 'Helena',
    age: 47,
    title: 'Boutique Hotelier • Rose-Blonde Cougar',
    shortHook: 'Platinum-rose bob, round tortoiseshell frames & rooftop pool keys.',
    tagline:
      'Designs coastal boutique hotels, literally owns the rooftop pool and cedar sauna you’ll visit at midnight.',
    vibeSummary:
      '47F design hotelier with a chic rose-platinum cut, round sunglasses, and dry humor. Rewards spontaneous Cubs who pack a weekender bag in ten minutes.',
    secretInsecurity:
      'Spends her life curating romance for hotel guests; quietly craves someone who checks in just to spoil her.',
    subplotTags: ['spontaneous_getaway', 'done_with_kids', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/helena-47f.jpg',
    lookBadge: 'Rose-Platinum Blonde • Round Frames',
    statusPill: 'Empty Nester • Hotelier',
    zodiac: '♒ Aquarius Sun • ♉ Taurus Venus',
    height: '5\'8"',
    loveLanguage: 'Suite Upgrades & Midnight Swims',
    originOrAccent: 'Riviera Design Cool',
    signatureDrink: 'Aperol & Franciacorta',
    interests: ['Boutique Hotels', 'Cedar Saunas', 'Design Books', 'Coastal Drives'],
  },
  {
    id: 'meiling-architect-cougar',
    name: 'Mei-Ling',
    age: 48,
    title: 'Coastal Principal Architect • Cougar',
    shortHook: 'Infinity-pool lap swimmer, sleek dark waves & razor-sharp Big Sur wit.',
    tagline:
      'Designs cliffside glass homes from Big Sur to Kyoto, minimalist black swimwear, bone-dry humor, and immaculate taste.',
    vibeSummary:
      '48F architectural principal with classic "Black Cat" slow-burn poise: takes her time, pushes back playfully when an eager Cub rushes, and makes every earned smile feel electric.',
    secretInsecurity:
      'Navigating late-40s perimenopause shifts behind calm perfectionism, deeply touched when his Golden-Retriever warmth stays steady without crowding her.',
    subplotTags: ['black_cat_energy', 'done_with_kids', 'solo_sanctuary', 'adult_children', 'income_gap'],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/meiling-48f.jpg',
    lookBadge: 'Sleek Dark Waves • Ocean Infinity Pool',
    statusPill: '🐈‍⬛ Black Cat • Cliffside Home',
    zodiac: '♍ Virgo Sun • ♎ Libra Rising',
    height: '5\'7"',
    loveLanguage: 'Quiet Observation & Omakase',
    originOrAccent: 'Big Sur Minimalist Grace',
    signatureDrink: 'Ceremonial Matcha & Sancerre',
    galleryPhotos: [
      { label: '🏖️ Infinity Pool', url: './images/cast/meiling-48f.jpg' },
      { label: '🥂 Sunset Lounge', url: './images/scenes/candlelit-cocktails.jpg' },
      { label: '🐾 Park Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Ocean Lap Swims', 'Modern Architecture', 'Omakase', 'Matcha & Sancerre', 'Kyoto Travel'],
  },
  {
    id: 'monica-cello-cougar',
    name: 'Monica',
    age: 49,
    title: 'Symphony Cellist & Soft-Command Cougar',
    shortHook: '5\'4" principal cellist on the cusp of Jaguar status: espresso silk, backstage poise & "Good boy" praise.',
    tagline:
      'Principal cellist with expressive wrists, backstage passes, soft romantic command, and a weakness for bookish PhD & musician Cubs.',
    vibeSummary:
      '49F musician who performs in black silk at 8 PM, whispers "Good boy" when you hold her coat at stage door, and happily slips into white sneakers for midnight ramen or campus sushi afterward.',
    secretInsecurity:
      'Turning 50 in six months, delighted to discover younger men treat 49 going on 50 like an upgrade, not an expiration date.',
    subplotTags: ['soft_mommy_domme', 'done_with_kids', 'adult_children', 'solo_sanctuary'],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/monica-49f.jpg',
    lookBadge: '5\'4" • Dark Waves • Concert-Hall Chic',
    statusPill: 'Empty Nester • Symphony Chair',
    zodiac: '♏ Scorpio Sun • ♓ Pisces Moon',
    height: '5\'4"',
    loveLanguage: 'Post-Concert Midnight Ramen & Soft Praise',
    originOrAccent: 'Conservatory Warmth',
    signatureDrink: 'Warm Junmai Sake & Pinot',
    interests: ['Live Symphony', 'Omakase Sushi', 'Late-Night Walks', 'Silk Blouses'],
  },

  // === COMPLETE EVERY-YEAR ROSTER: 50s JAGUARS (50, 59) ===
  {
    id: 'diana-coastal-jaguar',
    name: 'Diana',
    age: 50,
    title: '300hr RYT Global "Eat Pray Love" Nomad • Jaguar',
    shortHook: '5\'2" sunlit blonde living out of one carry-on across Bali, Lisbon & Oaxaca.',
    tagline:
      'Sold her suburban house at 49, upgraded from 200hr to 300hr RYT in Bali, and now chases endless summer with one Rimowa carry-on.',
    vibeSummary:
      '50F sunlit global nomad splitting the year between Lisbon tiles, Oaxaca mezcal courtyards, and coastal California housesits. Loves an adventurous late-20s Cub with an up-to-date passport and zero fear of one-way flights.',
    secretInsecurity:
      'Friends warned her dating apps vanish at 50; instead her passport and inbox both caught fire the week she turned 50.',
    subplotTags: ['eat_pray_love_nomad', 'spontaneous_getaway', 'zero_proof_wellness', 'done_with_kids', 'adult_children'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/diana-50f.jpg',
    lookBadge: '5\'2" • Sunlit Blonde • 300hr RYT Nomad',
    statusPill: '1 Carry-On • Bali / Lisbon / Coast',
    zodiac: '♌ Leo Sun • ♐ Sagittarius Rising',
    height: '5\'2"',
    loveLanguage: 'Passport Stamps & Barefoot Beach Dinners',
    originOrAccent: 'Sunlit Lisbon-to-Santa-Barbara Calm',
    signatureDrink: 'Fresh Coconut Water & Botanical Spritz',
    interests: ['300hr RYT Retreats', 'Carry-On Travel', 'Ocean Swims', 'Oaxaca Markets', 'Linen Sets'],
  },
  {
    id: 'renee-creative-jaguar',
    name: 'Renée',
    age: 52,
    title: 'Small-Town Fishbowl Principal • Jaguar',
    shortHook: '5\'4" high-school principal in a saffron blazer sneaking two towns over for 6 PM jazz dates.',
    tagline:
      'Every parent at the local grocery store knows her name, so Friday night starts thirty miles up the coast where nobody grades her wine order.',
    vibeSummary:
      '52F charismatic high-school principal in tailored blazers who runs an entire campus by day and craves secret-agent date nights two towns over with a confident younger man who calls at 6 PM sharp.',
    secretInsecurity:
      'Has to be the composed authority figure in her zip code 24/7; melts privately when he books a tucked-away booth out of town so she can laugh off-duty.',
    subplotTags: ['princess_treatment', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/renee-52f.jpg',
    lookBadge: '5\'4" • Saffron Blazer • Off-Duty Principal',
    statusPill: 'Divorced • Two-Towns-Over Dates',
    zodiac: '♈ Aries Sun • ♌ Leo Mars',
    height: '5\'4"',
    loveLanguage: '6 PM Phone Calls & Out-of-Town Booths',
    originOrAccent: 'Warm Decisive Educator Spark',
    signatureDrink: 'Sidecar in a Chilled Coupe',
    interests: ['Out-of-Town Jazz', 'Tailored Blazers', 'Contemporary Art', 'Weekend Drives'],
  },
  {
    id: 'valerie-jaguar-trail',
    name: 'Valerie',
    age: 53,
    title: '6 AM Ridge-Runner Jaguar',
    shortHook: 'Out-climbs 25-year-olds on canyon switchbacks & keeps him on a playful short leash.',
    tagline: 'Empty-nester Pilates & trail boss. Will out-climb a 25-year-old and keep him on a playful short leash.',
    vibeSummary:
      'Peak Gen-X confidence: sends literal 👍 replies with crisp periods, roasts guys wearing Nirvana tees who cannot name three tracks off *In Utero*, loves a 6 PM phone call, and redirects 11 PM club stamina into steep Saturday switchbacks.',
    secretInsecurity:
      'Pretends meddling brunch friends don’t get under her skin when they whisper, "What happens when you’re 65 and he’s 40?"',
    subplotTags: ['zero_proof_wellness', 'trail_leash_boss', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/valerie-53f.jpg',
    lookBadge: 'Silver-Streaked • Blue-Grey Eyes • Trail Boss',
    statusPill: 'Empty Nester • Sub-8 Mile Pace',
    zodiac: '♐ Sagittarius Sun • ♈ Aries Mars',
    height: '5\'8"',
    loveLanguage: '6 AM Trail Pace & 6 PM Phone Calls',
    originOrAccent: 'Marin County Gen-X Direct',
    signatureDrink: 'Tart-Cherry Electrolyte Mocktail & Berry Smoothie',
    interests: ['6 AM Canyon Runs', '90s Alt Vinyl', 'Red Wine', 'National Parks'],
  },
  {
    id: 'lauren-dean-jaguar',
    name: 'Lauren',
    age: 54,
    title: 'Champagne-Pixie Literary Agent • Jaguar',
    shortHook: 'Short champagne-blonde cut, designer frames, razor wit & campus sushi banter.',
    tagline:
      'Represents bestselling novelists, loves sharp banter, wire-rim glasses, and 28-year-old PhDs.',
    vibeSummary:
      '54F literary powerhouse in black blazer and statement frames. Turns dinner conversation into foreplay and adores smart younger men.',
    secretInsecurity:
      'Used to editing everyone else’s stories, loves being swept into an unscripted weekend adventure.',
    subplotTags: ['black_cat_energy', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/lauren-54f.jpg',
    lookBadge: 'Champagne Pixie • Statement Frames',
    statusPill: '🐈‍⬛ Black Cat • LAT Townhouse',
    zodiac: '♍ Virgo Sun • ♊ Gemini Rising',
    height: '5\'7"',
    loveLanguage: 'Sharp Banter & Bookstore Strolls',
    originOrAccent: 'Upper West Side Crisp Wit',
    signatureDrink: 'Dry Champagne & Espresso',
    interests: ['Book Launches', 'Omakase', 'Theater', 'Living Apart Together'],
  },
  {
    id: 'margot-botanical-jaguar',
    name: 'Margot',
    age: 55,
    title: 'Weekly CSA Box & Future Ranch Dreamer • Jaguar',
    shortHook: '5\'3" sunlit golden curls, weekly CSA farm box, backyard hens & 15-acre ranch dream.',
    tagline:
      'Picks up her heirloom CSA crate every Thursday, gathers warm eggs from four heritage hens, and is scouting 15 coastal acres for her next chapter.',
    vibeSummary:
      '55F landscape designer with sunlit curls, dirt-under-nails joy by afternoon, and silk slip dresses by 7 PM. Dreams of trading city noise for a 15-acre hobby ranch with an energetic younger partner who loves outdoor showers and Sunday pasta.',
    secretInsecurity:
      'Gave twenty years to a lukewarm marriage, now refuses anything less than electric mutual adoration.',
    subplotTags: ['csa_ranch_dreamer', 'dog_mom_divorced', 'done_with_kids', 'adult_children', 'solo_sanctuary'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/margot-55f.jpg',
    lookBadge: '5\'3" • Golden Curls • CSA & Ranch Dreamer',
    statusPill: 'Divorced • Scouting 15 Acres',
    zodiac: '♋ Cancer Sun • ♉ Taurus Rising',
    height: '5\'3"',
    loveLanguage: 'CSA Farm Cooking & Slow Porch Mornings',
    originOrAccent: 'Carmel Valley Sunlit Warmth',
    signatureDrink: 'Chilled Sancerre in the Garden',
    interests: ['Weekly CSA Boxes', 'Heritage Hens', 'Handmade Pasta', 'Rescue Dogs', 'Ranch Property Hunting'],
  },
  {
    id: 'evelyn-mogul-jaguar',
    name: 'Evelyn',
    age: 56,
    title: 'Warm Second-Act Widow & Producer • Jaguar',
    shortHook: '5\'5" platinum blowout, hotel-bar Vesper martinis & joyful second-act romance.',
    tagline:
      'Independent film producer four years widowed after a great marriage; ready for electric hotel-bar banter and unjaded laughter again.',
    vibeSummary:
      '56F platinum-blonde producer who had a wonderful marriage and zero bitter divorce baggage. Loves a younger man with steady eye contact who meets her at the hotel bar without tiptoeing around grief or age.',
    secretInsecurity:
      'Taking off her late husband’s ring took brave patience; melts for a partner who honors her past while making Friday night feel brand new.',
    subplotTags: ['black_cat_energy', 'princess_treatment', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/evelyn-56f.jpg',
    lookBadge: '5\'5" • Platinum Blonde • Second-Act Glow',
    statusPill: '🐈‍⬛ Widowed & Ready • Beverly Hills',
    zodiac: '♏ Scorpio Sun • ♌ Leo Rising',
    height: '5\'5"',
    loveLanguage: 'Hotel-Bar Nerve & Unhurried Nights',
    originOrAccent: 'Cannes / Sunset Tower Polish',
    signatureDrink: 'Vesper Martini',
    interests: ['Hotel Lobby Bars', 'Film Festivals', 'Silk Trench Coats', 'Late-Night Jazz'],
  },
  {
    id: 'colette-bistro-jaguar',
    name: 'Colette',
    age: 57,
    title: 'Trench-Coat Wine Critic • Jaguar',
    shortHook: 'Classic blonde waves, trench-coat elegance, Paris-to-Napa palate & dry humor.',
    tagline:
      'Writes the column chefs fear, melts instantly for a humble Cub who packs a meadow picnic.',
    vibeSummary:
      '57F wine & travel writer who has dined at every three-star table on earth, so flashy money bores her; earnest effort and fresh baguette win her heart.',
    secretInsecurity:
      'Travels twenty weeks a year, loves having a devoted Cub waiting at arrivals with coffee.',
    subplotTags: ['spontaneous_getaway', 'done_with_kids', 'adult_children', 'solo_sanctuary'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/colette-57f.jpg',
    lookBadge: 'Blonde Waves • Classic Trench Chic',
    statusPill: 'LAT Lifestyle • Napa & Coast',
    zodiac: '♎ Libra Sun • ♐ Sagittarius Moon',
    height: '5\'7"',
    loveLanguage: 'Thoughtful Picnics & Airport Pickups',
    originOrAccent: 'Transatlantic Bistro Lilt',
    signatureDrink: 'Cru Beaujolais',
    interests: ['Vineyard Walks', 'Meadow Picnics', 'Boutique Trains', 'Cheese Boards'],
  },
  {
    id: 'julianne-sailing-jaguar',
    name: 'Julianne',
    age: 58,
    title: 'Coastal Sailor & Surgeon • Jaguar',
    shortHook: 'Sun-kissed blonde, sea-breeze grin, 36-foot sloop & zero-BS stamina.',
    tagline:
      '58F orthopedic surgeon who sails solo on Saturdays and dances till midnight on Fridays.',
    vibeSummary:
      'Radiant coastal blonde who stays active year-round, laughs past every age-gap cliché, and loves an athletic younger first mate.',
    secretInsecurity:
      'Out-energizes men her own age by 8 PM, thrilled when a 30-year-old actually keeps up all weekend.',
    subplotTags: ['trail_leash_boss', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/julianne-58f.jpg',
    lookBadge: 'Sunlit Blonde • Coastal Sailor Fit',
    statusPill: 'Kids Grown • Harbor Slip',
    zodiac: '♒ Aquarius Sun • ♈ Aries Mars',
    height: '5\'8"',
    loveLanguage: 'Sunset Tack & Harbour Oysters',
    originOrAccent: 'Newport Coastal Breeze',
    signatureDrink: 'Crisp Chablis & Oysters',
    interests: ['Ocean Sailing', 'Harbor Oysters', 'Tennis', 'Coastal Hikes'],
  },
  {
    id: 'sylvie-atelier-jaguar',
    name: 'Sylvie',
    age: 59,
    title: 'Silver-Bob Architecture Critic • Jaguar',
    shortHook: '59 in tailored grey wool & chic frames, one birthday shy of full Panther royalty.',
    tagline:
      ' razor-sharp, effortlessly chic in silver hair and tailored coats, and magnetic across any gallery room.',
    vibeSummary:
      '59F design museum curator with a luminous silver bob and sculptural eyeglasses. Commands quiet awe and adores warm, tactile affection behind closed doors.',
    secretInsecurity:
      'People find her poise intimidating until they hear her laugh over midnight kitchen toast.',
    subplotTags: ['black_cat_energy', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/sylvie-59f.jpg',
    lookBadge: 'Luminous Silver Bob • Sculptural Frames',
    statusPill: '🐈‍⬛ Black Cat • Museum Curator',
    zodiac: '♑ Capricorn Sun • ♎ Libra Venus',
    height: '5\'8"',
    loveLanguage: 'Gallery Strolls & Hand-Holding',
    originOrAccent: 'Left-Bank Gallery Poise',
    signatureDrink: 'Dry Vermouth on Ice with Twist',
    interests: ['Design Museums', 'Tailored Coats', 'Jazz Vinyl', 'Espresso'],
  },

  // === COMPLETE EVERY-YEAR ROSTER: 60s+ PANTHERS (60-64) ===
  {
    id: 'blythe-cabaret-panther',
    name: 'Blythe',
    age: 60,
    title: 'Platinum-Pixie Theater Director • Panther',
    shortHook: 'Just turned 60: striking platinum pixie, tuxedo blazer & electric late-night wit.',
    tagline:
      'Entered her 60s directing sold-out shows and breaking necks in sharp black suiting.',
    vibeSummary:
      '60F stage director with a bold platinum pixie cut and mischievous eyes. Treats society’s double standards like comedy material and rewards confident 28-35 Cubs.',
    secretInsecurity:
      'Zero shame about 60, only checks that her Cub walks into opening-night parties proud beside her.',
    subplotTags: ['done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'panther',
    photoUrl: './images/cast/blythe-60f.jpg',
    lookBadge: 'Platinum Pixie • Tuxedo Blazer Chic',
    statusPill: 'Newly-60 Panther • Theater Loft',
    zodiac: '♏ Scorpio Sun • ♒ Aquarius Rising',
    height: '5\'9"',
    loveLanguage: 'Opening-Night Arm-in-Arm Pride',
    originOrAccent: 'Theater-District Crispness',
    signatureDrink: 'Gin Rickey',
    interests: ['Opening Nights', 'Speakeasy Piano', 'Tuxedo Blazers', 'Late Suppers'],
  },
  {
    id: 'vivienne-silver-panther',
    name: 'Vivienne',
    age: 61,
    title: 'Fashion Director & Soft-Command Panther',
    shortHook: 'Waist-length silver braids, Mediterranean swimwear, Prince vinyl & warm "Good boy" poise.',
    tagline:
      'Former NYC fashion director wintering on the coast: silver braids, bronze swimwear, and magnetic romantic command.',
    vibeSummary:
      '61F style icon who spent thirty years shooting covers in Paris and Milan. Spins Sade and Prince liner notes at dusk, swims in the sea till November, and rewards a tall, attentive younger man with quiet "Good boy" praise across crowded piazzas.',
    secretInsecurity:
      'Fiercely protective of her joy and peace, tests early whether he has the spine to smile past public double-takes without flinching.',
    subplotTags: ['soft_mommy_domme', 'black_cat_energy', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'panther',
    photoUrl: './images/cast/vivienne-61f.jpg',
    lookBadge: 'Silver Braids • Resort Swimwear • Style Icon',
    statusPill: '🐈‍⬛ Black Cat • Coastal Villa',
    zodiac: '♌ Leo Sun • ♑ Capricorn Rising',
    height: '5\'9"',
    loveLanguage: 'Unapologetic Piazza Devotion & Soft Command',
    originOrAccent: 'NYC / Paris Runway Cadence',
    signatureDrink: 'Negroni Sbagliato',
    galleryPhotos: [
      { label: '🏖️ Coastal Swim', url: './images/cast/vivienne-61f.jpg' },
      { label: '🌴 Villa Pool', url: './images/scenes/palm-springs-resort.jpg' },
      { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Mediterranean Summers', 'Runway Archives', 'Sea Swimming', 'Negronis', 'Prince & Sade Vinyl'],
  },
  {
    id: 'helen-couture-panther',
    name: 'Helen',
    age: 63,
    title: 'Fine Art & Couture Collector • Panther',
    shortHook: '5\'2" silver bob, fedora & round frames, vintage convertibles & museum-grade estate jewels.',
    tagline:
      '63, petite 5\'2" dynamo who bids on post-war paintings and estate emeralds by day and hosts candlelit coastal salons by night.',
    vibeSummary:
      '63F retired magazine publisher whose terrace dinner parties mix sculptors, chefs, and one thoroughly smitten younger gentleman.',
    secretInsecurity:
      'Fiercely independent, melts when he brings her morning Earl Grey in bed without trying to rearrange her life.',
    subplotTags: ['princess_treatment', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'panther',
    photoUrl: './images/cast/helen-63f.jpg',
    lookBadge: '5\'2" • Silver Bob • Art & Couture Collector',
    statusPill: 'Widowed & Thriving • Art Collector',
    zodiac: '♊ Gemini Sun • ♎ Libra Rising',
    height: '5\'2"',
    loveLanguage: 'Morning Tea & Unhurried Salon Banter',
    originOrAccent: 'Editorial Wit & Warmth',
    signatureDrink: 'French 75',
    interests: ['Vintage Convertibles', 'Terrace Salons', 'Art Auctions', 'Estate Jewels'],
  },
  {
    id: 'beatrice-vineyard-panther',
    name: 'Beatrice',
    age: 64,
    title: 'Vineyard Founder & Active "Glam-ma" • Panther',
    shortHook: '64, 5\'3" radiant blonde vintner, proud "Gigi" at Saturday soccer & harvest string-light dinners.',
    tagline:
      'Built an organic Pinot estate from scratch, cheers at grandkid soccer at 9 AM, and hosts string-light harvest dinners till midnight.',
    vibeSummary:
      '64F petite sunlit blonde vintner who radiates Cher-level financial independence ("Mom, I AM a rich man") and proud Glam-ma vitality. Loves an active, affectionate Cub who enjoys vineyard walks and laughs past every cliché.',
    secretInsecurity:
      'Grown kids are protective of her vineyard, so she respects a Cub who insists on picking up Date #1 himself.',
    subplotTags: ['glamma_grandmother', 'trail_leash_boss', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'panther',
    photoUrl: './images/cast/beatrice-64f.jpg',
    lookBadge: '5\'3" • Sunlit Blonde • Vineyard Glam-ma',
    statusPill: 'Proud Gigi • Vineyard Estate',
    zodiac: '♉ Taurus Sun • ♌ Leo Moon',
    height: '5\'3"',
    loveLanguage: 'Harvest Dinners & Vineyard Walks',
    originOrAccent: 'Napa Hillside Warmth',
    signatureDrink: 'Estate Reserve Pinot Noir',
    interests: ['Vineyard Hikes', 'Harvest Tables', 'Saturday Gigi Sidelines', 'Acoustic Guitar'],
  },
];

/**
 * 17 Distinct Cub Profiles, Covering EVERY SINGLE YEAR from 21 to 33!
 * Includes Green-Flag Gentlemen, the 25M Montana Ranch Cowboy (Kristin Cavallari × Montana Boyz
 * age-slider inspiration), and the 21M Broke College Dutch-Splitter red-flag obstacle!
 */
export const HIS_ARCHETYPES: HisArchetype[] = [
  {
    id: 'leo-golden-cub',
    name: 'Leo',
    age: 25,
    title: 'Golden-Retriever Houseboy Cub',
    shortHook: 'Pure Golden-Retriever energy, 10x more obsessed when a cool Black Cat woman pushes back!',
    tagline:
      'Beaming Golden-Retriever devotion: the more she takes her time and pushes back at first, the wider he grins.',
    vibeSummary:
      'Gen-Z emotional fluency meets sunny Golden-Retriever warmth. Bored by instant-gratification chaos, he goes weak in the knees for a selective "Black Cat" older woman who paces him, teases his eagerness, and makes every smile feel earned.',
    secretInsecurity:
      'Driving home wondering: "Did she push back tonight because she’s testing my patience, or am I moving too fast?" (Spoiler: she loved every second.)',
    subplotTags: ['golden_retriever_energy', 'houseboy_eager', 'trail_leash_boss'],
    portraitVariant: 'golden',
    photoUrl: './images/cast/leo-25m.jpg',
    lookBadge: 'Sunlit Curls • Linen Apron • Chef',
    statusPill: '🐕 Golden Retriever • Craves Black Cats',
    zodiac: '♋ Cancer Sun • ♉ Taurus Moon',
    height: '6\'1"',
    loveLanguage: 'Cooking in a Linen Apron & Acts of Service',
    originOrAccent: 'Warm Golden-Retriever Charm',
    signatureDrink: 'Negroni & Sparkling Pellegrino',
    interests: ['Handmade Pasta', 'Farmers Markets', 'Fixing Hinges', 'Clean Counters'],
  },
  {
    id: 'colton-montana-cowboy-cub',
    name: 'Colton',
    age: 25,
    title: '6\'3" Montana Ranch & Ex-Football Cowboy Cub',
    shortHook: 'Inspired by Kristin Cavallari & Montana Boyz, accidentally DMed "I love you" from the group TikTok!',
    tagline:
      '6\'3" former small-college wide receiver raised on a Montana cattle ranch: Stetson hat, country-boy manners, and zero fear of public headlines.',
    vibeSummary:
      'The exact reason thousands of 37-48 women lowered their age slider! Accidentally commented "I love you" from his buddies’ shared ranch account before sliding in properly, flies out on 12 hours’ notice, and carries both suitcases in one hand.',
    secretInsecurity:
      'Every comment section yells "He’s 25 from Montana!!", so he proves with steady actions, yes-ma’am chivalry, and ranch-hand grit that he isn’t chasing clout.',
    subplotTags: ['golden_retriever_energy', 'montana_cowboy_slider', 'spontaneous_getaway', 'princess_treatment', 'trail_leash_boss'],
    portraitVariant: 'golden',
    photoUrl: './images/cast/colton-25m.jpg',
    lookBadge: 'Sunlit Blonde • 6\'3" Ranch Cowboy',
    statusPill: '🐕 Golden Cowboy • 6\'3"',
    zodiac: '♐ Sagittarius Sun • ♌ Leo Mars',
    height: '6\'3"',
    loveLanguage: 'Flying Out Friday & Two-Stepping',
    originOrAccent: 'Bozeman Ranch Drawl',
    signatureDrink: 'Ranch Water & Cold Beer',
    galleryPhotos: [
      { label: '🤠 Ranch Glow', url: './images/cast/colton-25m.jpg' },
      { label: '🏖️ Cabo Sun', url: './images/scenes/palm-springs-resort.jpg' },
      { label: '🐾 Dog Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Montana Ranches', 'Country Two-Step', 'Cabo Weekends', 'Pickup Trucks', 'Bonfires'],
  },
  {
    id: 'kieran-anthropic-ai-cub',
    name: 'Kieran',
    age: 28,
    title: 'Early-Anthropic AI Researcher • Vested SF/NYC Cub',
    shortHook:
      'Joined Anthropic early, quietly vested at 28, zero tech-bro flash, exclusively courts accomplished women 38-60.',
    tagline:
      'Early frontier-AI safety researcher with vested equity, tailored knitwear, and zero patience for 23-year-old clout chasers.',
    vibeSummary:
      'Joined Anthropic in the early pre-hype days and quietly hit financial independence before 28. Allergic to crypto/Lambo flexing and exhausted by 23-year-olds asking about his cap table on Date #1, he melts for a self-made Cougar with her own career, sharp wit, and calm presence who lets him power down his brain at 8 PM and cook her brown-butter halibut.',
    secretInsecurity:
      'Never mentions his early equity until Date #4 so he knows you actually like HIM, and privately hopes you won’t lump him in with awkward podcast tech bros.',
    subplotTags: [
      'frontier_ai_cub',
      'cub_daddy_zaddy',
      'golden_retriever_energy',
      'princess_treatment',
      'spontaneous_getaway',
      'houseboy_eager',
    ],
    portraitVariant: 'architect',
    photoUrl: './images/cast/kieran-28m.jpg',
    lookBadge: 'tailored knitwear • Vintage Watch • Early AI',
    statusPill: '🧠 Early Anthropic • Quietly Vested',
    zodiac: '♍ Virgo Sun • ♉ Taurus Rising',
    height: '6\'1"',
    loveLanguage: 'Quiet Generosity, Zero Tech Talk & Home Cooking',
    originOrAccent: 'Calm West-Village / Pac-Heights Warmth',
    signatureDrink: 'Oat Cortado & Burgundy Pinot',
    galleryPhotos: [
      { label: '☕ Morning Cortado', url: './images/cast/kieran-28m.jpg' },
      { label: '🍝 Kitchen Prep', url: './images/scenes/sunday-kitchen-sanctuary.jpg' },
      { label: '🐾 Park Stroll', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: [
      'Frontier AI Safety',
      'Quiet Luxury',
      'Brown-Butter Halibut',
      'Coastal Drives',
      'Art Bookstores',
    ],
  },
  {
    id: 'kayden-broke-dutch-cub',
    name: 'Kayden',
    age: 21,
    title: '5th-Year Finance Senior & Happy-Hour Strategist',
    shortHook: 'Campus hoodie, 4:30 PM sushi happy-hour enthusiast & obsessive spreadsheet optimizer.',
    tagline:
      '21M business undergrad who tracks macros, happy-hour windows, and exact tax-and-tip percentages in Google Sheets.',
    vibeSummary:
      '21M undergrad in a campus hoodie who enthusiastically invites you out for 4:45 PM happy-hour sushi, brings contagious college-quad energy, and quietly keeps a shared household expense spreadsheet with his three roommates.',
    secretInsecurity:
      'Has three roommates eating cereal out of mixing bowls at home and genuinely thinks itemizing shared appetizers down to $0.38 tax is modern financial literacy.',
    subplotTags: ['broke_dutch_obstacle', 'income_gap'],
    portraitVariant: 'trail',
    photoUrl: './images/cast/kayden-21m.jpg',
    lookBadge: 'Campus Hoodie • Finance Spreadsheets • 5\'9"',
    statusPill: 'Undergrad Senior • 3 Roommates',
    zodiac: '♊ Gemini Sun • ♓ Pisces Moon',
    height: '5\'9"',
    loveLanguage: '4:30 PM Happy-Hour Finds & Spreadsheet Precision',
    originOrAccent: 'Dorm-Hall Energy-Drink Cadence',
    signatureDrink: 'Happy-Hour Sake Special',
    interests: ['Spreadsheet Modeling', '4:30 PM Sushi Deals', 'Late-Night Co-Op', 'Campus Coffee'],
  },
  {
    id: 'miles-millennial-cub',
    name: 'Miles',
    age: 32,
    title: 'Rooftop Architect • "Cub Daddy" Lead',
    shortHook: '32yo architect who takes 100% of the Friday planning lead for Cougars & Jaguars 45+.',
    tagline: '30s "Cub Daddy" architect who solely dates Jaguars & Cougars 45+, books every table, and lets her turn her brain off.',
    vibeSummary:
      'Proof that 30+ men are top-tier Cubs when paired with a 45-64 Cougar/Jaguar/Panther. Zero roommate drama, calm baritone authority, and maximum princess-treatment game.',
    secretInsecurity:
      'Wonders if her adult kids (nearly his age) will treat Sunday brunch like a hostile deposition.',
    subplotTags: ['cub_daddy_zaddy', 'princess_treatment', 'adult_children'],
    portraitVariant: 'architect',
    photoUrl: './images/cast/miles-32m.jpg',
    lookBadge: 'Tailored Navy Blazer • Brown Eyes',
    statusPill: 'Loft Owner • Decisive Lead',
    zodiac: '♑ Capricorn Sun • ♎ Libra Rising',
    height: '6\'2"',
    loveLanguage: 'Curated Weekend Itineraries',
    originOrAccent: 'Architectural Lounge Smooth',
    signatureDrink: 'Pinot Noir & Cortado',
    galleryPhotos: [
      { label: '🍸 Rooftop Blazer', url: './images/cast/miles-32m.jpg' },
      { label: '🍝 Linen Apron', url: './images/scenes/sunday-kitchen-sanctuary.jpg' },
      { label: '🐾 Dog Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Architecture', 'Rooftop Wine', 'Boutique Hotels', 'Cooking'],
  },
  {
    id: 'marcus-firefighter-cub',
    name: 'Marcus',
    age: 26,
    title: '6\'2" Firefighter & Rescue-Dog Cub',
    shortHook: 'Firefighter/paramedic, sunset beach runs with his dog Otis & Cajun pasta.',
    tagline:
      '6\'2" station house chef & paramedic: carries groceries in one trip, runs the beach with rescue mutt Otis, and bench-presses houses.',
    vibeSummary:
      'Calm under pressure, megawatt smile, deep baritone, and immaculate manners. Cooks Cajun shrimp pasta for the whole firehouse and pre-heats your passenger seat warmer before opening your door.',
    secretInsecurity:
      'Works 24-hour fire shifts and hopes an accomplished executive woman sees how fiercely reliable a firefighter schedule makes him.',
    subplotTags: ['cub_daddy_zaddy', 'golden_retriever_energy', 'houseboy_eager', 'princess_treatment', 'trail_leash_boss'],
    portraitVariant: 'golden',
    photoUrl: './images/cast/marcus-26m.jpg',
    lookBadge: 'Clean Fade • Athletic 6\'2" • Dog Dad',
    statusPill: '🐕 Golden Energy • Rescue Dog Otis',
    zodiac: '♌ Leo Sun • ♉ Taurus Mars',
    height: '6\'2"',
    loveLanguage: 'Protective Presence & Firehouse Pasta',
    originOrAccent: 'Deep Warm Gentleman Baritone',
    signatureDrink: 'Bourbon Smash',
    galleryPhotos: [
      { label: '🏖️ Beach & Dog', url: './images/cast/marcus-26m.jpg' },
      { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
      { label: '🍝 Kitchen Prep', url: './images/scenes/sunday-kitchen-sanctuary.jpg' },
    ],
    interests: ['Beach Runs', 'Rescue Dogs', 'Firehouse Cooking', '225-Lb Bench', '90s R&B'],
  },
  {
    id: 'liam-redhead-carpenter-cub',
    name: 'Liam',
    age: 28,
    title: 'Copper-Redhead Carpenter & Hiker Cub',
    shortHook: 'Copper curls, emerald-green eyes, custom walnut furniture & mountain trails.',
    tagline:
      'Custom woodworker: copper-red hair, emerald eyes, flannel sleeves, and fixes every cabinet hinge on Houseboy Sunday.',
    vibeSummary:
      'Builds custom walnut dining tables with his hands, hikes pine ridges at dawn, smells like cedarwood and bergamot, and brings rugged-sweetheart devotion.',
    secretInsecurity:
      'Doesn’t wear corporate suits or talk tech jargon, hopes real craftsmanship and steady hands beat finance-bro flash.',
    subplotTags: ['houseboy_eager', 'trail_leash_boss', 'princess_treatment'],
    portraitVariant: 'golden',
    photoUrl: './images/cast/liam-28m.jpg',
    lookBadge: 'Copper Redhead • Emerald-Green Eyes',
    statusPill: 'Woodshop Owner • Trail Runner',
    zodiac: '♉ Taurus Sun • ♓ Pisces Moon',
    height: '6\'1"',
    loveLanguage: 'Fixing Everything & Cabin Fires',
    originOrAccent: 'Warm Coastal Lilt',
    signatureDrink: 'Single-Malt Neat',
    galleryPhotos: [
      { label: '🏔️ Pine Trail', url: './images/cast/liam-28m.jpg' },
      { label: '🐾 Dog Picnic', url: './images/cast/dog-park-picnic.jpg' },
      { label: '🍸 Evening Out', url: './images/scenes/candlelit-cocktails.jpg' },
    ],
    interests: ['Custom Woodworking', 'Mountain Hiking', 'Folk Vinyl', 'Cast-Iron Steaks', 'Rescue Dogs'],
  },
  {
    id: 'lucas-blonde-swimmer-cub',
    name: 'Lucas',
    age: 30,
    title: 'Blonde Blue-Eyed Swimmer & Sports MD Cub',
    shortHook: 'Sunlit blonde, ocean-blue eyes, poolside stamina & shoulder massages.',
    tagline:
      'Former D1 swimmer turned sports-medicine fellow: sun-bleached blonde hair, bright blue eyes, and effortless Palm Springs weekend energy.',
    vibeSummary:
      '30M golden-boy charm without an ounce of frat-boy arrogance. Rubs SPF 50 onto your shoulders poolside, orders crisp Sancerre properly, and fixes sore Pilates shoulders.',
    secretInsecurity:
      'People assume a blonde swimmer in California is a casual beach boy, so he goes all-in proving his long-term loyalty.',
    subplotTags: ['golden_retriever_energy', 'princess_treatment', 'wants_kids_someday'],
    portraitVariant: 'oldsoul',
    photoUrl: './images/cast/lucas-30m.jpg',
    lookBadge: 'Sunlit Blonde • Ocean-Blue Eyes • 6\'3"',
    statusPill: 'MD Fellow • Swimmer Build',
    zodiac: '♊ Gemini Sun • ♌ Leo Venus',
    height: '6\'3"',
    loveLanguage: 'Poolside SPF Rubs & Full Loyalty',
    originOrAccent: 'Sunlit California Coast',
    signatureDrink: 'Chilled Sancerre',
    galleryPhotos: [
      { label: '🏊‍♂️ Poolside', url: './images/cast/lucas-30m.jpg' },
      { label: '🌴 Desert Resort', url: './images/scenes/palm-springs-resort.jpg' },
      { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Ocean Swimming', 'Palm Springs Pools', 'Sports Medicine', 'Tennis', 'Crisp Sancerre'],
  },
  {
    id: 'theo-phd-campus-cub',
    name: 'Dr. Theo',
    age: 27,
    title: 'Freshly Minted PhD & Foreign-Muse Cub',
    shortHook: 'Just defended his PhD, wire-rim glasses, sleeper gym build & campus sushi.',
    tagline:
      'Spent 5 years in a neuroscience lab while his peers partied, just got his PhD hooded, packed on a sleeper gym build, and is ready to court an extraordinary woman.',
    vibeSummary:
      '27M newly minted PhD with glasses, broad swimmer/lifter shoulders under tweed jackets, and a huge soft spot for worldly, accented older women. Plans autumn campus strolls + omakase sushi with cheeky "Professor & Grad Student" banter.',
    secretInsecurity:
      'Spent his whole 20s buried in research papers, secretly thrilled when a radiant Cougar dresses down in sneakers to meet him on the quad.',
    subplotTags: ['phd_campus_cub', 'loves_foreign_women', 'spontaneous_getaway', 'houseboy_eager'],
    portraitVariant: 'architect',
    photoUrl: './images/cast/theo-27m.jpg',
    lookBadge: 'Wire-Rim Glasses • Sleeper Gym Build',
    statusPill: 'Neuroscience PhD • Bilingual',
    zodiac: '♍ Virgo Sun • ♏ Scorpio Mars',
    height: '6\'1"',
    loveLanguage: 'Deep Conversation & Attentive Study',
    originOrAccent: 'Bilingual Café French',
    signatureDrink: 'Warm Junmai Sake & Cortado',
    galleryPhotos: [
      { label: '🎓 Campus Quad', url: './images/cast/theo-27m.jpg' },
      { label: '🍣 Autumn Sushi', url: './images/scenes/campus-autumn-sushi.jpg' },
      { label: '🍝 Chef Mode', url: './images/scenes/sunday-kitchen-sanctuary.jpg' },
    ],
    interests: ['Omakase Sushi', 'World Cinema', 'Campus Strolls', '5x225 Gym Sessions', '18h Getaways'],
  },

  // === COMPLETE EVERY-YEAR CUB COVERAGE (22, 23, 24, 26, 27, 29, 31, 33) ===
  {
    id: 'noah-surf-cub',
    name: 'Noah',
    age: 22,
    title: 'Sunrise Surf Shaper & Espresso Cub',
    shortHook: '22M ocean grin, hand-shaped surfboards, eager golden-retriever devotion.',
    tagline:
      'Youngest non-broke green flag in the Den: works with his hands since 6 AM, pays his own rent, and worships older women.',
    vibeSummary:
      '22M surfboard shaper and specialty-coffee roaster with bright eyes and zero cynicism. Still gets ID-grilled for 45 seconds by every speakeasy bouncer!',
    secretInsecurity:
      'Knows 22 makes her raise an eyebrow at first, so he shows up ten minutes early with flowers every single time.',
    subplotTags: ['zero_proof_wellness', 'golden_retriever_energy', 'houseboy_eager', 'trail_leash_boss'],
    portraitVariant: 'golden',
    photoUrl: './images/cast/noah-22m.jpg',
    lookBadge: 'Twilight Grin • Surf Shaper • 6\'0"',
    statusPill: '🐕 Golden • Zero-Proof & Smoothies',
    zodiac: '♓ Pisces Sun • ♋ Cancer Rising',
    height: '6\'0"',
    loveLanguage: 'Morning Pour-Overs & Carrying Everything',
    originOrAccent: 'Encinitas Surf Warmth',
    signatureDrink: 'Iced Espresso Tonic & Acai Protein Smoothie',
    interests: ['Board Shaping', 'Latte Art', 'Dawn Surf', 'Acoustic Vinyl'],
  },
  {
    id: 'devon-indie-cub',
    name: 'Devon',
    age: 23,
    title: '35mm Film Photographer & Vinyl Cub',
    shortHook: '23M curls & frames, shoots medium-format film, old-soul gallery date.',
    tagline:
      'Brings museum memberships, 70s soul records, and zero frat-house energy at 23.',
    vibeSummary:
      '23M editorial portrait photographer who prefers quiet jazz bars and art bookstores over loud clubs, and makes her feel like cinema.',
    secretInsecurity:
      'Building his freelance studio from the ground up, wins hearts with unforgettable 35mm film walks and gallery nights.',
    subplotTags: ['modest_accent_gentleman', 'spontaneous_getaway'],
    portraitVariant: 'oldsoul',
    photoUrl: './images/cast/sam-25m.jpg',
    lookBadge: 'Dark Curls & Glasses • 35mm Film',
    statusPill: 'Darkroom Loft • Old Soul',
    zodiac: '♒ Aquarius Sun • ♎ Libra Moon',
    height: '5\'11"',
    loveLanguage: 'Candid Film Portraits & Museum Walks',
    originOrAccent: 'Art-School Gentle Wit',
    signatureDrink: 'Amaro Spritz',
    interests: ['35mm Film', 'Art Museums', 'Soul Vinyl', 'Meadow Picnics'],
  },
  {
    id: 'jin-souschef-cub',
    name: 'Jin',
    age: 24,
    title: 'Michelin Sous-Chef & Boulderer Cub',
    shortHook: 'Forearm tattoo, 10-step skincare, climber grip & midnight handmade dumplings.',
    tagline:
      'Sous-chef by night, granite boulderer by morning, elite knife skills, SPF 50 glow, and spotless counters.',
    vibeSummary:
      '24M fine-dining sous-chef with a minimalist geometric forearm tattoo, toned climber shoulders, and better skincare habits than most dermatologists. Cooks midnight brown-butter scallops from scratch.',
    secretInsecurity:
      'Quietly wonders if working restaurant hours clashes with her 9-to-5, so he guards every Sunday off exclusively for her.',
    subplotTags: ['houseboy_eager', 'trail_leash_boss'],
    portraitVariant: 'trail',
    photoUrl: './images/cast/jin-25m.jpg',
    lookBadge: 'Forearm Tattoo • Climber Build • Chef',
    statusPill: 'Michelin Line • Skincare Pro',
    zodiac: '♏ Scorpio Sun • ♍ Virgo Rising',
    height: '6\'0"',
    loveLanguage: 'Midnight Handmade Pasta & Skincare',
    originOrAccent: 'Culinary Bouldering Cool',
    signatureDrink: 'Yuzu Highball',
    galleryPhotos: [
      { label: '🧗‍♂️ Bouldering', url: './images/cast/jin-25m.jpg' },
      { label: '🍝 Chef Apron', url: './images/scenes/sunday-kitchen-sanctuary.jpg' },
      { label: '🐾 Dog Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Outdoor Climbing', 'Handmade Pasta', '10-Step Skincare', 'Natural Wine', 'Espresso'],
  },
  {
    id: 'dante-trail-cub',
    name: 'Mateo',
    age: 26,
    title: 'Ridge-Trail Physical Therapist Cub',
    shortHook: '6 AM summit runner with an oak bedframe, 600TC percale & lidded bin.',
    tagline: 'Bragged about his sub-7 mile pace, ready to test it on her 6 AM ridge loop.',
    vibeSummary:
      'Doctor of Physical Therapy, magnetic smile, active mornings. Suppresses group-chat slang effortlessly when meeting her 45-year-old friends.',
    secretInsecurity:
      'Worries his early-career salary looks small next to her corner office, hoping effort and devotion count more than Four Seasons money.',
    subplotTags: ['zero_proof_wellness', 'trail_leash_boss', 'houseboy_eager', 'income_gap'],
    portraitVariant: 'trail',
    photoUrl: './images/cast/mateo-26m.jpg',
    lookBadge: 'Dark Waves • Trail Runner • DPT',
    statusPill: 'DPT Clinician • Zero-Proof Athlete',
    zodiac: '♈ Aries Sun • ♐ Sagittarius Mars',
    height: '5\'11"',
    loveLanguage: 'Physical Touch & Post-Hike Calf Recovery',
    originOrAccent: 'Bilingual Coastal Warmth',
    signatureDrink: 'Zero-Proof Ginger-Lime Mocktail & Berry Smoothie',
    interests: ['Trail Running', 'Physical Therapy', 'Home Cooking', 'Live Jazz'],
  },
  {
    id: 'rafael-accented-gentleman-cub',
    name: 'Rafael',
    age: 26,
    title: 'Self-Made Craftsman & Old-World Gentleman',
    shortHook: 'Warm melodic accent, ironed linen shirts, meadow picnics & retro bowling.',
    tagline:
      'Self-made master electrician with old-world manners and a warm accent, zero trust-fund flash, 100% pride in sweeping a woman off her feet.',
    vibeSummary:
      '26M master electrician & weekend sourdough baker. Owns immaculately ironed white linen shirts, opens every door automatically, and proves a hand-packed meadow picnic + neon bowling night beats lazy luxury flash.',
    secretInsecurity:
      'Knows her handbag costs more than his first car, so he pours unmatched chivalry and handmade cooking into every date.',
    subplotTags: ['modest_accent_gentleman', 'loves_foreign_women', 'princess_treatment', 'houseboy_eager', 'income_gap'],
    portraitVariant: 'golden',
    photoUrl: './images/cast/rafael-26m.jpg',
    lookBadge: 'Warm Accent • Ironed Linen • Chivalry',
    statusPill: 'Master Tradesman • Old-World Manners',
    zodiac: '♉ Taurus Sun • ♌ Leo Moon',
    height: '6\'0"',
    loveLanguage: 'Acts of Devotion & Handmade Dates',
    originOrAccent: 'Warm Coastal Romance Accent',
    signatureDrink: 'Espresso & Chilled Picnic Rosé',
    galleryPhotos: [
      { label: '🧺 Park Picnic', url: './images/cast/rafael-26m.jpg' },
      { label: '🎳 Neon Bowling', url: './images/scenes/neon-bowling-lounge.jpg' },
      { label: '🍝 Family Recipe', url: './images/scenes/sunday-kitchen-sanctuary.jpg' },
    ],
    interests: ['Meadow Picnics', 'Retro Neon Bowling', 'Family Pasta Recipes', 'Fixing Anything', 'Slow Dancing'],
  },
  {
    id: 'julian-oldsoul-cub',
    name: 'Julian',
    age: 27,
    title: 'British Structural Engineer & Peonies Gentleman',
    shortHook: 'Hampstead London transplant: "Table for half seven is sorted xx" & fresh pink peonies.',
    tagline: 'Proper British Cub who opens every car door, books half-seven wine booths by Wednesday, and shamelessly replies "Yes, Mummy xx" when teased.',
    vibeSummary:
      'Moved from North London with a vinyl crate of Sade, a solid oak bedframe, and proper British manners. Asks if you fancy a cheeky drink at half seven, signs texts with "x" or "xx," and melts into a grin whenever a poised older woman puts him in his place.',
    secretInsecurity:
      'Pictures having a family someday and hopes she sees how seriously a 27-year-old Londoner commits when he falls.',
    subplotTags: ['wants_kids_someday', 'princess_treatment', 'houseboy_eager'],
    portraitVariant: 'oldsoul',
    photoUrl: './images/cast/julian-27m.jpg',
    lookBadge: 'Deep Hazel Eyes • British Linen • 6\'0"',
    statusPill: 'London Engineer • Proper Manners xx',
    zodiac: '♎ Libra Sun • ♋ Cancer Venus',
    height: '6\'0"',
    loveLanguage: 'Car Doors, Peonies & "Table Sorted xx"',
    originOrAccent: 'British Hampstead London Accent',
    signatureDrink: 'Claret & Proper Gin Martini',
    interests: ['Architecture', 'Sade & Vinyl', 'Half-Seven Wine Bars', 'Coastal Drives'],
  },
  {
    id: 'gavin-pilot-cub',
    name: 'Gavin',
    age: 29,
    title: 'Charter Pilot & Weekend Getaway Cub',
    shortHook: '29M aviator calm, golden-hour stubble, spontaneous 18-hour island hops.',
    tagline:
      'Last year of his 20s, flies coastal charters by day and whisks Cougars away for rooftop-and-sauna weekends.',
    vibeSummary:
      '29M commercial charter captain with calm cockpit voice, pressed henleys, and zero 20s flakiness.',
    secretInsecurity:
      'Away two nights a week flying, makes sure she feels like the center of his universe every hour he’s home.',
    subplotTags: ['spontaneous_getaway', 'princess_treatment', 'houseboy_eager'],
    portraitVariant: 'golden',
    photoUrl: './images/cast/gavin-29m.jpg',
    lookBadge: 'Golden-Hour Stubble • Charter Captain',
    statusPill: 'Homeowner • Spontaneous Flights',
    zodiac: '♈ Aries Sun • ♑ Capricorn Rising',
    height: '6\'2"',
    loveLanguage: 'Surprise Weekend Flights & Steady Calm',
    originOrAccent: 'Calm Aviator Baritone',
    signatureDrink: 'Old Fashioned (Orange Peel)',
    interests: ['Coastal Aviation', '18h Getaways', 'Hotel Pools', 'Sailing'],
  },
  {
    id: 'owen-sommelier-cub',
    name: 'Owen',
    age: 31,
    title: 'Wine-Bar Partner & Junior-Cougar Cub',
    shortHook: '31M warm beard, blind-tasting champ, ideal 6-to-20 year match.',
    tagline:
      'Old enough to remember CD binders, young enough to carry every case of Barolo up two flights.',
    vibeSummary:
      '31M wine director who exclusively dates women 37-62 because conversation, confidence, and palate actually match.',
    secretInsecurity:
      'Hopes she sees him as long-term partner material, not just the fun wine guy.',
    subplotTags: ['princess_treatment', 'houseboy_eager'],
    portraitVariant: 'oldsoul',
    photoUrl: './images/cast/owen-31m.jpg',
    lookBadge: 'Sculpted Beard • Wine Director • 6\'0"',
    statusPill: 'Child-Free • Wine Partner',
    zodiac: '♑ Capricorn Sun • ♉ Taurus Moon',
    height: '6\'0"',
    loveLanguage: 'Pouring "Big Carl" Glasses & Late Cooking',
    originOrAccent: 'Warm Bistro Charm',
    signatureDrink: 'Barbaresco & Amaro',
    interests: ['Blind Wine Tasting', 'Cast-Iron Risotto', 'Vinyl Jazz', 'Travel'],
  },
  {
    id: 'grant-surgeon-cub',
    name: 'Grant',
    age: 33,
    title: '33M Cardiothoracic Fellow • Jaguar Specialist',
    shortHook: '33M silver-fox-in-training who exclusively courts 45-64 Cougars, Jaguars & Panthers.',
    tagline:
      'Zero roommates, zero games, 6\'2" in tailored wool, built specifically for powerhouse women in their 40s, 50s, and 60s.',
    vibeSummary:
      '33M surgical fellow who finds women under 40 exhausting and lights up across candlelit tables with accomplished Cougars and Jaguars.',
    secretInsecurity:
      'Long surgical fellowship hours, treats every Sunday together like a sacred phone-off retreat.',
    subplotTags: ['cub_daddy_zaddy', 'princess_treatment', 'adult_children', 'spontaneous_getaway'],
    portraitVariant: 'architect',
    photoUrl: './images/cast/grant-33m.jpg',
    lookBadge: 'Tailored Collar • Dark Eyes • 6\'2"',
    statusPill: 'MD Fellow • Dates 43-64 Only',
    zodiac: '♏ Scorpio Sun • ♑ Capricorn Mars',
    height: '6\'2"',
    loveLanguage: 'Phone-Off Weekends & Total Devotion',
    originOrAccent: 'Composed Surgical Baritone',
    signatureDrink: 'Negroni Up',
    interests: ['Boutique Hotels', 'Opera & Jazz', 'Tennis', 'Coastal Drives'],
  },
];

export const FIELD_GUIDE_ENTRIES: FieldGuideEntry[] = [
  {
    id: 'lynx',
    label: 'Lynx',
    ageRange: 'Ages 22-29',
    category: 'feline_scale',
    headline: 'Pre-Puma Apprentice',
    insiderLore:
      'Too young for official community Cougar status, though occasionally dates slightly younger guys while studying the ways of the Den.',
    signatureTell: 'Still figuring out her own lease renewal.',
  },
  {
    id: 'junior_cougar',
    label: 'Junior Cougar',
    ageRange: '5-9 Year Age Gap (e.g. 6 Yrs)',
    category: 'feline_scale',
    headline: 'The Sub-10-Year Sweet-Spot Contender',
    insiderLore:
      'Under strict 10-year Cougar law, a 5-to-9 year gap earns the cheeky "Junior Cougar" badge! Close enough to share pop-culture overlap, far enough apart that she was ordering martinis while he was in high-school geometry.',
    signatureTell: 'Calculates where you both were in 2008 within twenty minutes of Date #1.',
  },
  {
    id: 'puma',
    label: 'Puma',
    ageRange: 'Ages 30-39',
    category: 'feline_scale',
    headline: 'Official Under-40 Age-Gap Contender',
    insiderLore:
      'Per Cougars & Cubs Club law: a woman under 40 dating a younger man is a Puma, not yet a Cougar! Often an Elder Millennial allergic to Snapchat streaks.',
    signatureTell: 'Uses 😂 unironically and panics if you call without texting first.',
  },
  {
    id: 'cougar',
    label: 'Cougar',
    ageRange: 'Ages 40-49 (10+ Yr Gap)',
    category: 'feline_scale',
    headline: 'The Benchmark Standard of The Cougar Den',
    insiderLore:
      'At least 40 years young and 10+ years older than her Cub or Kitten. Financially self-sufficient, allergically opposed to "hey" DMs, and NOT a sugar mama.',
    signatureTell: 'Has a peaceful home sanctuary and clocks a liquor-bottle mirror photo in 0.4 seconds.',
  },
  {
    id: 'princess_cougar',
    label: 'Princess Cougar',
    ageRange: 'Any Age • Pure Sweeping Romance (30s to 60s+)',
    category: 'crossover_lore',
    headline: 'Pure Old-School Courtship, Flowers & Hand-Kissing at Any Age',
    insiderLore:
      'Debunks the myth that dating younger means playing boss or mother. Across every decade from 30s Pumas to 60s Panthers, a Princess Cougar dates for pure sweeping romance: fresh peonies, passenger doors opened, and candlelit tables booked before Wednesday.',
    signatureTell: 'Smiles across the booth when you say, "Turn your brain off tonight, everything is handled."',
  },
  {
    id: 'jaguar',
    label: 'Jaguar',
    ageRange: 'Ages 50-59',
    category: 'feline_scale',
    headline: 'Sleek Gen-X Apex',
    insiderLore:
      'Fitness dialed in, zero patience left for societal side-eyes. Expect crisp terminal periods, literal 👍 replies that make Gen-Z Cubs panic, 6 AM trail runs, and razor-sharp Gen-X banter.',
    signatureTell: 'Prefers one confident 6 PM phone call over 47 text bubbles and quizzes you on Nirvana tracks.',
  },
  {
    id: 'panther',
    label: 'Panther / Sabertooth',
    ageRange: 'Ages 60+',
    category: 'feline_scale',
    headline: 'Legendary Silver-Screen & "Glam-ma" Icon',
    insiderLore:
      'Unapologetic, radiant, and magnetically selective, from gallery hostesses to active "Glam-ma" grandmothers ("Call me Gigi") who cheer at 10 AM toddler soccer before 8 PM desert martinis.',
    signatureTell: 'Waiters stutter; she orders two martinis without blinking and spins Sade on vinyl.',
  },
  {
    id: 'golden_cub',
    label: 'Golden Retriever Houseboy Cub',
    ageRange: '10+ Years Junior',
    category: 'cub_taxonomy',
    headline: 'Sunny, Unbothered & Magnetically Drawn to "Black Cat" Cougars',
    insiderLore:
      'High-EQ, tail-wagging warmth paired with grown-up chivalry. Secret tell: he is 10x MORE attracted when an older woman has cool "Black Cat" energy, taking her time, teasing him, and pushing back a little at first instead of fawning.',
    signatureTell: 'When she says "Slow down, eager puppy," he grins ear-to-ear instead of sulking.',
  },
  {
    id: 'cub_daddy_zaddy_lore',
    label: '🥂 "Cub Daddy" / Junior Zaddy',
    ageRange: 'Ages 25-35 • Decisive Lead',
    category: 'cub_taxonomy',
    headline: 'Younger in Birth Year, Full Grown-Man Authority at the Table',
    insiderLore:
      'The flip-side polarity secret of the Club: a decisive younger man with calm baritone confidence who books the 7:30 corner booth, intercepts the check without theatrics, and lets an accomplished woman completely relax.',
    signatureTell: 'Texts the reservation link on Tuesday and pre-heats her passenger seat.',
  },
  {
    id: 'soft_mommy_domme_lore',
    label: '👑 Soft Mommy-Domme & "Good Boy" Praise',
    ageRange: 'Consensual Polarity • Ages 35-64+',
    category: 'crossover_lore',
    headline: 'Warm Romantic Command & Praise (Never an ATM!)',
    insiderLore:
      'Poised romantic authority where one raised eyebrow, two fingers under his chin, and a quiet "Good boy" (or a British Cub’s shameless "Yes, Mummy xx") turns an overthinking twenty-something into putty. Rule #1 holds: romantic command never means paying a freeloader’s rent!',
    signatureTell: 'Makes him forget every podcast he was about to Cubsplain in three seconds flat.',
  },
  {
    id: 'cubsplaining_lore',
    label: '🤓 "Cubsplaining"',
    ageRange: 'Rookie Cub Fumble #1',
    category: 'cub_taxonomy',
    headline: 'Explaining Mortgages or Vinyl to a Woman Who Mastered Them in 2004',
    insiderLore:
      'The hilarious moment an eager 24-to-29-year-old launches into a 10-minute podcast lecture on fixed-rate mortgages, Roth IRAs, or Fleetwood Mac pressings to an accomplished homeowner Cougar.',
    signatureTell: 'Starts a sentence with "Well actually, I heard on a podcast..."',
  },
  {
    id: 'bucket_list_tourist_lore',
    label: '🪣 The "Bucket-List Tourist" Goblin',
    ageRange: 'Instant Unmatch',
    category: 'cub_taxonomy',
    headline: 'Treats Older Women Like an Xbox Achievement Badge',
    insiderLore:
      'Opens with "ngl never been with a cougar before, bucket list 👀" or begs for "discrete late-night links after 10 PM" (always misspelling discreet). Vetted Cubs date women, never novelty checkboxes.',
    signatureTell: 'Writes "discrete" in his bio and hides from daylight brunch.',
  },
  {
    id: 'black_cat_golden_retriever',
    label: '🐈‍⬛ Black Cat Cougar × 🐕 Golden Retriever Cub',
    ageRange: 'The #1 Polarity in The Cougar Den',
    category: 'crossover_lore',
    headline: 'She Takes Her Time & Pushes Back; He Lives to Earn Every Smile',
    insiderLore:
      'Peer men often get defensive when a self-possessed older woman won’t rush or stroke their ego on Date #1. A true Golden Retriever Cub finds her cool, selective Black Cat pushback intoxicating, matching her unhurried boundaries with steady sunshine until she finally chooses his lap.',
    signatureTell: 'Publicly she gives him cool side-eye; privately she curls up in his hoodie on Sunday.',
  },
  {
    id: 'dm_goblin',
    label: 'The "hey" / split-tab-Math Goblin',
    ageRange: 'Rehab or Block',
    category: 'cub_taxonomy',
    headline: 'Cautionary Club Specimen',
    insiderLore:
      'Either opens with "hey" + purple LED dorm selfies OR invites you out on a campus meal plan and pulls out a spreadsheet to split-tab-request $3.19 for four edamame pods.',
    signatureTell: 'Asks for your Snapchat or itemizes half the appetizer.',
  },
  {
    id: 'kitten',
    label: 'Kitten',
    ageRange: '10+ Years Junior (Female)',
    category: 'crossover_lore',
    headline: 'Younger Woman in an Age-Gap Match',
    insiderLore:
      'Official Cougars & Cubs Club banner term for a younger woman dating a Cougar (10+ years older) or older partner.',
    signatureTell: 'Brings immaculate playlist range and zero flakiness.',
  },
  {
    id: 'mountain_lion',
    label: 'Mountain Lion / Silver Fox',
    ageRange: 'Ages 40+ (Male Counterpart)',
    category: 'crossover_lore',
    headline: 'The Male Equivalent Across the Aisle',
    insiderLore:
      'Slang cousins in the broader age-gap ecosystem (Mountain Lion / Silver Fox = 40+ male counterpart).',
    signatureTell: 'Gets zero side-eyes from society, highlighting the double standard Cougars laugh past.',
  },
  {
    id: 'pop_priyanka_nick',
    label: 'Priyanka Chopra & Nick Jonas',
    ageRange: '10-Yr Gap • Global Power Marriage',
    category: 'pop_culture',
    headline: 'Slid Into Her DMs at 24, Shut Down Madison Square Garden & Married Her in Jodhpur',
    insiderLore:
      'Nick Jonas (24) famously dropped to one knee the first time he met Priyanka Chopra (34) at the Vanity Fair Oscars party, slid into her DMs with zero hesitation, and built one of entertainment’s most devoted 10-year-gap marriages.',
    signatureTell: 'Three-day palace weddings, Met Gala royalty, and zero ego around her global stardom.',
  },
  {
    id: 'pop_heidi_tom',
    label: 'Heidi Klum & Tom Kaulitz',
    ageRange: '16-Yr Gap • Capri Yacht Joy',
    category: 'pop_culture',
    headline: 'Supermodel Mogul × Tokio Hotel Guitarist Unbothered Bliss',
    insiderLore:
      'Sixteen years apart and married aboard the Christina O yacht in Capri, Heidi Klum and Tom Kaulitz answer every tabloid age question with matching grins and legendary Halloween commitment.',
    signatureTell: 'Laughs off every interviewer who brings up birth years.',
  },
  {
    id: 'pop_tina_erwin',
    label: 'Tina Turner & Erwin Bach',
    ageRange: '16-Yr Gap • 38-Year Love Story',
    category: 'pop_culture',
    headline: 'The Gold Standard of Lifetime Devotion on Lake Zurich',
    insiderLore:
      'Tina Turner met German music executive Erwin Bach (16 years her junior) at 46, fell in love at first sight, shared nearly four decades in Switzerland, and Erwin literally donated his own kidney to save her life in 2017.',
    signatureTell: 'Thirty-eight years of quiet, unshakeable devotion.',
  },
  {
    id: 'pop_cher_icons',
    label: 'Cher ("Mom, I AM a Rich Man")',
    ageRange: '18-to-40-Yr Gaps • Eternal Icon',
    category: 'pop_culture',
    headline: 'From Val Kilmer & Tom Cruise to Alexander "AE" Edwards',
    insiderLore:
      'Patron Goddess of the Panther tier: Cher has dated extraordinary younger men across five straight decades because, as she famously explained, men her own age were either terrified or dull.',
    signatureTell: 'Diamonds, leather jackets, and hand-holding past every flashbulb on earth.',
  },
  {
    id: 'pop_demi_ashton',
    label: 'Demi Moore & Ashton Kutcher',
    ageRange: '15-Yr Gap • 2003-2013 Cultural Watershed',
    category: 'pop_culture',
    headline: 'The Iconic 2000s Marriage That Shattered Hollywood’s Double Standard',
    insiderLore:
      'Even though they parted ways in 2013 after an eight-year marriage, Demi Moore (then 40) and Ashton Kutcher (then 25) arriving at the 2003 *Charlie’s Angels: Full Throttle* premiere, alongside Bruce Willis and their daughters, permanently rewrote pop-culture rules for women over 40.',
    signatureTell: 'Changed mainstream red-carpet vocabulary overnight and proved 40s leading ladies own every room.',
  },
  {
    id: 'pop_caroline_sergio',
    label: 'Caroline Stanbury & Sergio Carrallo',
    ageRange: '18-Yr Gap • Bravo Dubai Royalty',
    category: 'pop_culture',
    headline: 'Posh British "Black Cat" Icon × Devoted Spanish Ex-Real Madrid Cub',
    insiderLore:
      '*Ladies of London* and *The Real Housewives of Dubai* star Caroline Stanbury married 18-years-younger former Real Madrid C footballer Sergio Carrallo in Dubai & Mauritius in 2021, giving Bravo viewers television’s purest real-life Black Cat wife × tail-wagging Golden Retriever husband.',
    signatureTell: 'Dry British wit paired with a beaming Spanish husband who calls her "honey" in every room.',
  },
  {
    id: 'pop_kris_corey',
    label: 'Kris Jenner & Corey Gamble',
    ageRange: '25-Yr Gap • Decade-Plus Power Duo',
    category: 'pop_culture',
    headline: 'Ten+ Years of Silk Pajamas, Amalfi Yachts & Zero Drama',
    insiderLore:
      'A 25-year gap going strong for over a decade: Corey Gamble brings calm Cub-Daddy steadiness, silk-shirt tailoring, and fiercely protective loyalty to Hollywood’s busiest matriarch.',
    signatureTell: 'Unflappable poise beside an empire-building woman.',
  },
  {
    id: 'pop_macrons',
    label: 'Brigitte & Emmanuel Macron',
    ageRange: '24-Yr Gap • Élysée Palace Partnership',
    category: 'pop_culture',
    headline: 'Presidential State Dinners & Hand-in-Hand Parisian Tailoring',
    insiderLore:
      'Married since 2007 with a 24-year gap, France’s First Couple normalized seeing an older wife and younger husband on the world’s highest diplomatic stages.',
    signatureTell: 'Sharp French suiting and unapologetic public affection.',
  },
  {
    id: 'pop_gabrielle_dwyane',
    label: 'Gabrielle Union & Dwyane Wade',
    ageRange: '9-Yr Gap • Met Gala & Family Royalty',
    category: 'pop_culture',
    headline: 'Peak 9-Year Junior-to-Official Cougar Radiance',
    insiderLore:
      'Gabrielle Union hesitated at first over their 9-year gap after her first marriage; Dwyane Wade proved his maturity, married her in a literal castle, and still hypes her like Day 1.',
    signatureTell: 'Coordinated couture and front-row cheerleading.',
  },
  {
    id: 'pop_julianne_bart',
    label: 'Julianne Moore & Bart Freundlich',
    ageRange: '9-Yr Gap • 25+ Years Married',
    category: 'pop_culture',
    headline: 'Oscar Winner × Director Long-Game Romance',
    insiderLore:
      'Together since 1996 with two grown kids and an Academy Award on the shelf, Julianne Moore and Bart Freundlich are living proof that 9-to-10-year woman-older marriages go the distance.',
    signatureTell: 'Quiet West Village walks and three decades of partnership.',
  },
  {
    id: 'pop_cameron_benji',
    label: 'Cameron Diaz & Benji Madden',
    ageRange: '6.5-Yr Gap • Private Sanctuary Marriage',
    category: 'pop_culture',
    headline: 'Rockstar Devotion & Two Kids in Their 40s/50s',
    insiderLore:
      'Cameron Diaz waited until 42 to marry 35-year-old rocker Benji Madden, welcoming two kids and building the ultimate peaceful Beverly Hills home sanctuary.',
    signatureTell: 'Publicly writes love letters about his wife every anniversary.',
  },
  {
    id: 'pop_eva_ryan',
    label: 'Eva Mendes & Ryan Gosling',
    ageRange: '6.5-Yr Gap • Cinema’s Dreamiest Junior Cougar Pair',
    category: 'pop_culture',
    headline: '6.5-Year Sweet Spot & Fierce Family Privacy',
    insiderLore:
      'Met filming *The Place Beyond the Pines* (Eva 37, Ryan 30), raised two daughters fiercely offline, and Ryan thanked "my sweetheart" from the Golden Globes podium.',
    signatureTell: 'Cuban coffee, zero red-carpet clout-chasing, total devotion.',
  },
  {
    id: 'pop_goldie_kurt',
    label: 'Goldie Hawn & Kurt Russell',
    ageRange: '5.5-Yr Gap • 40+ Years Together',
    category: 'pop_culture',
    headline: 'Hollywood’s Happiest Unmarried Couple Since Valentine’s Day 1983',
    insiderLore:
      'Goldie Hawn (5.5 years older than Kurt Russell) proved you don’t even need a marriage license when mutual laughter, blended-family warmth, and Aspen ranch joy last over forty years.',
    signatureTell: 'Four decades of sunshine laughs without ever needing paperwork.',
  },
  {
    id: 'pop_meghan_harry',
    label: 'Meghan Markle & Prince Harry',
    ageRange: '3-Yr Royal Micro-Gap • 36F × 33M',
    category: 'pop_culture',
    headline: 'Divorced 30s American Actress × Younger British Prince',
    insiderLore:
      'Even a 3-year woman-older micro-gap broke centuries of Windsor protocol: a self-made, divorced 36-year-old actress charmed a 33-year-old British prince right out of Kensington Palace to Montecito.',
    signatureTell: 'British "sorted, love" devotion meets California garden jam.',
  },
  {
    id: 'pop_madonna_mariahc_sarandon',
    label: 'Madonna, Mariah Carey & Susan Sarandon',
    ageRange: '12-to-35-Yr Gaps • Trailblazing Icons',
    category: 'pop_culture',
    headline: 'Pop Divas & Oscar Legends Who Refused the Invisible Shelf',
    insiderLore:
      'From Susan Sarandon & Tim Robbins’ iconic 23-year run (12-yr gap) to Mariah Carey & Bryan Tanaka’s 7-year romance and Madonna’s fearless dating roster, these legends rewrote the rules for every woman over 40.',
    signatureTell: 'Zero apologies, stadium tours, and timeless magnetism.',
  },
  {
    id: 'pop_olivia_harry',
    label: 'Olivia Wilde & Harry Styles',
    ageRange: '10-Yr Gap • Salad-Dressing Internet Meltdown',
    category: 'pop_culture',
    headline: 'Director × Pop Superstar Whiplash',
    insiderLore:
      'Ten years apart on the *Don’t Worry Darling* set, sparking two years of yacht photos, front-row Wembley dancing, and the most famous vinaigrette recipe in cinema history.',
    signatureTell: 'Wembley sidelines and vintage convertibles.',
  },
  {
    id: 'pop_stella_cinema',
    label: 'How Stella Got Her Groove Back & The Cinema Canon',
    ageRange: '1967-2026 Age-Gap Film Hall of Fame',
    category: 'pop_culture',
    headline: 'Stella, The Graduate, Babygirl, The Idea of You, Bridget Jones, The Rebound & Good Sex',
    insiderLore:
      'Angela Bassett & Taye Diggs in *How Stella Got Her Groove Back* (inspired by Terry McMillan’s real Jamaica romance!) set the modern blueprint alongside *The Graduate*, *The Rebound* (Catherine Zeta-Jones & Justin Bartha), *The Idea of You* (Anne Hathaway & Nicholas Galitzine), *Babygirl* (Nicole Kidman & Harris Dickinson), *Bridget Jones: Mad About the Boy* (Renée Zellweger & Leo Woodall), and Lena Dunham’s *Good Sex* (Natalie Portman).',
    signatureTell: 'Hotel-bar martinis, Jamaican ocean swims, and post-divorce glow-ups.',
  },
  {
    id: 'pop_kristin_montana',
    label: 'Kristin Cavallari & Mark Estes (Montana Boyz)',
    ageRange: '13-Yr Gap • Age-Slider Catalyst',
    category: 'pop_culture',
    headline: 'The Viral Cowboy Story That Made Everyone Lower Their Age Filter',
    insiderLore:
      '24-year-old Montana cowboy Mark Estes accidentally DMed Kristin Cavallari (37) "I love you" from the shared Montana Boyz TikTok before sliding in from his own account, inspiring thousands of women to move their app age slider down and give Cubs a real shot!',
    signatureTell: 'Cabo TikTok dances, Nashville concerts, and zero fear of comment-section pearl-clutchers.',
  },
  {
    id: 'pop_jessica_danny',
    label: 'Jessica Alba & Danny Ramirez',
    ageRange: '~12-Yr Cougar × Cub Glow',
    category: 'pop_culture',
    headline: 'Iconic 40s Mogul × Top Gun Cub Energy',
    insiderLore:
      'Post-divorce Cougar renaissance personified: effortless Cabo & red-carpet radiance with a devoted early-30s Captain America / Top Gun star and zero apologies.',
    signatureTell: 'He looks thrilled just holding the car door while paparazzi flashbulbs melt.',
  },
  {
    id: 'pop_sienna_oli',
    label: 'Sienna Miller & Oli Green',
    ageRange: '15-Yr Gap • 40s Babies & Red Carpets',
    category: 'pop_culture',
    headline: 'Shattered Every Tabloid Timeline Rule',
    insiderLore:
      'While pearl-clutchers debated a 15-year gap (44F × 29M), Sienna and Oli casually welcomed two children together and owned every London & Met Gala carpet.',
    signatureTell: 'Boho couture maternity glow with a 6-foot-plus Cub beaming beside her.',
  },
  {
    id: 'pop_ellie_beau',
    label: 'Ellie Goulding & Beau Minniear',
    ageRange: '11-Yr Gap • 2026 Baby Joy',
    category: 'pop_culture',
    headline: 'Pop Royalty × Actor Cub Family Chapter',
    insiderLore:
      'Welcomed their baby girl together in 2026, living proof alongside Sienna Miller that late-30s/40s women and devoted late-20s Cubs write their own family rules.',
    signatureTell: 'Cozy London strolls, quiet devotion, and zero tabloid noise.',
  },
  {
    id: 'pop_miley_maxx',
    label: 'Miley Cyrus & Maxx Morando',
    ageRange: '6-Yr "Junior Cougar" Newlyweds',
    category: 'pop_culture',
    headline: 'Patron Saints of the 6-Year Junior Cougar Track',
    insiderLore:
      'Six years apart (33F × 27M drummer/producer) and officially married in an intimate Palm Springs wedding, proving the sub-10-year Junior Cougar sweet spot is pure rockstar gold.',
    signatureTell: 'Shared studio sessions, zero ego competition, and Palm Springs vows.',
  },
  {
    id: 'pop_cub_grooming_joke',
    label: '"Cub Grooming" vs. The ATJ Discourse',
    ageRange: '25+ Prefrontal Rule Only!',
    category: 'pop_culture',
    headline: 'Beard Oil & Tailoring, Never Creepy Power Gaps',
    insiderLore:
      'Whenever an adult Cub dates a Cougar, TikTok brings up Sam & Aaron Taylor-Johnson. Cougar Den Law: prefrontal cortexes must be 25+ baked, the ONLY "grooming" here is upgrading his beard oil, SPF 50, and linen shirts!',
    signatureTell: 'His 5-in-1 neon-blue shower gel mysteriously vanishes after Weekend #2.',
  },
  {
    id: 'pop_cougar_town',
    label: '"Cougar Town" & Jules Cobb’s Big Carl',
    ageRange: '2009-2015 Sitcom Royalty',
    category: 'pop_culture',
    headline: 'Giant Wine Glasses, Florida Sunshine & Post-Divorce Joy',
    insiderLore:
      'Courteney Cox’s beloved sitcom started as a 40s post-divorce dating comedy before evolving into the ultimate Cul-de-Sac hangout, immortalizing "Big Carl" (her bathtub-sized red wine glass), Penny Can, and shameless 40s fun.',
    signatureTell: 'Pours half a bottle of Cabernet into one glass and calls it "just one glass."',
  },
];

const DELIGHT_DETAILS: Record<string, { idealSunday: string; softSpot: string; extraInterests?: string[] }> = {
  'astrid-blonde-cougar': {
    idealSunday: 'Dawn surf at First Point, then breakfast burritos on the tailgate',
    softSpot: 'Warm shoulder rubs after cold ocean water',
    extraInterests: ['Dawn Surfing', 'Cedar Sauna', 'Cold Plunge', 'Coastal Runs', 'Ocean Swims'],
  },
  'sedona-breathwork-mommy': {
    idealSunday: 'Sunrise courtyard Breathwork, steep-brewed jasmine oolong, and canyon stargazing',
    softSpot: 'Dropping your shoulders, skipping podcast lectures, and enjoying quiet cedar steam',
    extraInterests: ['Breathwork & morning stretch', 'Jasmine Oolong', 'Cedar Sauna', 'Canyon Stargazing', 'Acoustic Vinyl'],
  },
  'sloane-coastal-golden-mommy': {
    idealSunday: 'Baking warm cassava sourdough and walking the Montecito farmers market',
    softSpot: 'Showing up with a chew toy for her incoming puppy Miso',
    extraInterests: ['Farmers Markets', 'Cassava Baking', 'Mini golden retrievers', 'Infrared Sauna', 'Morning Walks'],
  },
  'scarlett-redhead-jaguar': {
    idealSunday: 'Sleeping in late, vinyl soul records, and handmade truffle pasta at home',
    softSpot: 'Steady eye contact and unhurried appreciation for real curves',
    extraInterests: ['Handmade Pasta', 'Vinyl Soul', 'Infinity Pools', 'Italian Markets', 'Coastal Escapes'],
  },
  'simone-auntie-cougar': {
    idealSunday: 'Floating in a Palm Springs pool with 90s R&B playing on vinyl',
    softSpot: 'Holding your own at the family cookout and respecting silk pillowcases',
    extraInterests: ['90s R&B Vinyl', 'Palm Springs Pools', 'Art Collecting', 'Live Music', 'Sunday Cookouts'],
  },
  'brooke-tennis-cougar': {
    idealSunday: 'Morning mixed doubles on clay, reformer Pilates, and poolside reading',
    softSpot: 'Walking onto the club patio beside her with total confidence',
    extraInterests: ['Club Tennis', 'Reformer Pilates', 'Cabo Weekends', 'Live Country', 'Beach Walks'],
  },
  'celeste-panther-icon': {
    idealSunday: 'Desert pool swim at noon and old jazz records after sunset',
    softSpot: 'Holding her hand across a crowded room with unmistakable pride',
    extraInterests: ['Vinyl Jazz', 'Modern Art', 'Desert Architecture', 'Poolside Reading', 'Classic Cinema'],
  },
  'georgia-gallery-cougar': {
    idealSunday: 'Spontaneous desert road trip with the windows down and zero itinerary',
    softSpot: 'Cheering loudest at her gallery openings without an ounce of ego',
    extraInterests: ['Art Openings', 'Desert Road Trips', 'Vinyl Records', 'Roof Terraces', 'Flea Markets'],
  },
  'summer-beach-puma': {
    idealSunday: '2v2 Manhattan Beach volleyball, ocean plunge, and street fish tacos',
    softSpot: 'Remembering a tiny personal detail she only mentioned once',
    extraInterests: ['Beach Volleyball', 'Ocean Plunge', 'Fish Tacos', 'Sunset Bike Rides', 'Sauna'],
  },
  'claire-cougar-exec': {
    idealSunday: 'Architectural home tour, coastal drive, and reading in crisp 62°F sheets',
    softSpot: 'Handling the dinner check smoothly without making a production of it',
    extraInterests: ['Coastal Drives', 'Modern Architecture', 'Pilates', 'Palm Springs', 'Design Books'],
  },
  'tessa-somm-puma': {
    idealSunday: 'Vinyl records in a corner booth and late-night cacio e pepe',
    softSpot: 'Making a real 7:30 reservation without twenty texts first',
    extraInterests: ['Vinyl Booths', 'Midnight Pasta', 'Boutique Hotels', 'Indie Cinema', 'Candlelit Dinners'],
  },
  'isla-jazz-puma': {
    idealSunday: 'Overnight train up the coast and playing rough piano demos at 1 AM',
    softSpot: 'Rolled shirt sleeves and pulling her out of the studio into the sun',
    extraInterests: ['Film Scoring', 'Jazz Speakeasies', 'Coastal Trains', 'Grand Piano', 'Hotel Saunas'],
  },
  'hannah-vineyard-puma': {
    idealSunday: 'Warm brioche out of the oven, meadow picnic, and retro neon bowling',
    softSpot: 'Planning a date purely for her after she bakes for everyone else all week',
    extraInterests: ['Pastry Baking', 'Meadow Picnics', 'Retro Bowling', 'Farmers Markets', 'Acoustic Shows'],
  },
  'zoe-equestrian-puma': {
    idealSunday: 'Morning trail ride, dusty boots off, and steaks over an open bonfire',
    softSpot: 'Pulling out her chair and telling her she does not have to fix a thing tonight',
    extraInterests: ['Trail Riding', 'Bonfire Nights', 'Golden Retrievers', 'Manual Trucks', 'Live Country'],
  },
  'priya-surgeon-puma': {
    idealSunday: 'Sunrise coastal switchbacks with her golden retriever Rani, then a long nap',
    softSpot: 'Winning over Rani on mile one and cooking iron-rich steak after her shift',
    extraInterests: ['Canyon Hiking', 'Golden Retrievers', 'Reformer Pilates', 'Home Cooking', 'Boutique Travel'],
  },
  'maya-puma-mom': {
    idealSunday: 'Slow sidewalk coffee, live stand-up comedy, and laughing till her ribs hurt',
    softSpot: 'Showing up five minutes early when her babysitter is on the clock',
    extraInterests: ['Live Comedy', 'Sidewalk Cafes', 'Calendar Precision', '90s Throwbacks', 'Patio Dinners'],
  },
  'chloe-puma-dogmom': {
    idealSunday: 'Off-leash dog beach morning with rescue pup Barnaby and farmers market peaches',
    softSpot: 'Bringing a pocket dog treat for Barnaby and knowing where dishwasher pods go',
    extraInterests: ['Rescue Dogs', 'Farmers Markets', 'Weekend Hikes', 'Zero Kids', ' Indie Bookstores'],
  },
  'sienna-junior-cougar': {
    idealSunday: 'Flea-market vintage hunting and cooking together in Le Creuset Dutch ovens',
    softSpot: 'Laughing along when she teases where you were in 2008',
    extraInterests: ['Boutique Design', 'Vinyl Lounges', 'Vintage Hunting', 'Home Cooking', 'Palm Springs'],
  },
  'camila-lagoon-puma': {
    idealSunday: 'Hidden waterfall swim by afternoon and barefoot kitchen salsa at midnight',
    softSpot: 'Spinning her in the kitchen the second a good song comes on',
    extraInterests: ['Waterfall Swims', 'Kitchen Dancing', 'Live Vinyl', 'Beach Weekends', 'Street Tacos'],
  },
  'amber-milestone-cougar': {
    idealSunday: 'Sketching gold jewelry on a sunlit deck before sunset dinner by the water',
    softSpot: 'Looking at her like she is the only woman in the room',
    extraInterests: ['Jewelry Design', 'Cabo Getaways', 'Beach Walks', 'Rooftop Dinners', 'Live Acoustic'],
  },
  'nadia-booktok-cat-cougar': {
    idealSunday: 'Rainy afternoon reading fantasy novels while her orange cat Mochi naps nearby',
    softSpot: 'Passing Mochi’s stare-down test and asking which chapter she is on',
    extraInterests: ['Spicy BookTok', 'Orange Cat Mochi', 'Co-Op Couch Games', 'Rainy Nights In', 'Bookstores'],
  },
  'serena-princess-cougar': {
    idealSunday: 'Top-down PCH drive with fresh pink peonies on the passenger seat',
    softSpot: 'Opening her car door and saying "Turn your brain off, I planned tonight"',
    extraInterests: ['Coastal Convertibles', 'Fresh Peonies', 'Art Galleries', 'Silk Loungewear', 'Candlelit Bistros'],
  },
  'valentina-fiery-cougar': {
    idealSunday: 'Late tapas, dancing in the kitchen past midnight, and 18-hour island flights',
    softSpot: 'Matching her fire without flinching or playing it safe',
    extraInterests: ['Kitchen Dancing', 'Spontaneous Trips', 'Spanish Cinema', 'Hotel Saunas', 'Late Tapas'],
  },
  'helena-riviera-cougar': {
    idealSunday: 'Flipping through Italian design books poolside before a midnight sauna',
    softSpot: 'Packing a weekender bag in ten minutes flat when she says let’s go',
    extraInterests: ['Boutique Hotels', 'Cedar Saunas', 'Architecture Books', 'Coastal Drives', 'Night Swims'],
  },
  'meiling-architect-cougar': {
    idealSunday: 'Quiet ocean infinity-pool laps at dawn, then hand-pulled noodles or omakase',
    softSpot: 'Calm patience that never crowds her slow-burn pace',
    extraInterests: ['Ocean Lap Swims', 'Modern Architecture', 'Omakase', 'Kyoto Travel', 'Art Books'],
  },
  'monica-cello-cougar': {
    idealSunday: 'Afternoon cello rehearsal, then slipping into sneakers for midnight ramen',
    softSpot: 'Waiting at stage door with warm hands and zero pretentiousness',
    extraInterests: ['Live Symphony', 'Midnight Ramen', 'Omakase Sushi', 'Night Walks', 'Classical Vinyl'],
  },
  'diana-coastal-jaguar': {
    idealSunday: 'Barefoot morning ocean swim, breathwork on the deck, and grilled local fish',
    softSpot: 'Steady eye contact and following her lead on morning movement',
    extraInterests: ['Ocean Swims', 'Reformer Pilates', 'Breathwork', 'Farmers Markets', 'Beach Bonfires'],
  },
  'renee-creative-jaguar': {
    idealSunday: 'Contemporary art museum stroll followed by a tucked-away jazz quartet',
    softSpot: 'Calling her phone at 6 PM sharp instead of sending forty tiny texts',
    extraInterests: ['Live Jazz', 'Contemporary Art', 'Tailored Style', 'Weekend Flights', 'Theater'],
  },
  'valerie-jaguar-trail': {
    idealSunday: '6 AM canyon ridge summit before the heat, then stretching on the sun deck',
    softSpot: 'Keeping pace on steep switchbacks and cooking Sunday pasta after',
    extraInterests: ['6 AM Canyon Runs', 'Reformer Pilates', 'National Parks', 'Ocean Swims', 'Trail Maps'],
  },
  'lauren-dean-jaguar': {
    idealSunday: 'Used-bookstore browsing on the Upper West Side and trading sharp banter over sushi',
    softSpot: 'Quick literary wit and sweeping her into an unscripted afternoon',
    extraInterests: ['Indie Bookstores', 'Omakase', 'Off-Broadway Theater', 'Crosswords', ' Sharp Banter'],
  },
  'margot-botanical-jaguar': {
    idealSunday: 'Clipping fresh herbs in her coastal garden and rolling pasta dough barefoot',
    softSpot: 'Cooking beside her in the kitchen with music on and nowhere to rush',
    extraInterests: ['Coastal Gardens', 'Handmade Pasta', 'Rescue Dogs', 'Greenhouses', 'Outdoor Showers'],
  },
  'evelyn-mogul-jaguar': {
    idealSunday: 'Phones off in a Beverly Hills bungalow with classic French New Wave films',
    softSpot: 'Wanting nothing from her except her company and holding steady eye contact',
    extraInterests: ['Film Festivals', 'Classic Cinema', 'Late-Night Jazz', 'Modern Art', 'Hotel Lounges'],
  },
  'colette-bistro-jaguar': {
    idealSunday: 'Warm baguette, triple-cream brie, and a blanket under vineyard oaks',
    softSpot: 'Meeting her at airport arrivals with coffee and a simple thoughtful picnic',
    extraInterests: ['Meadow Picnics', 'Scenic Trains', 'Vineyard Walks', 'Cheese Boards', 'Travel Writing'],
  },
  'julianne-sailing-jaguar': {
    idealSunday: 'Tacking her 36-foot sloop across the bay and shucking harbor oysters at sunset',
    softSpot: 'Athletic stamina that actually keeps up with her all weekend',
    extraInterests: ['Ocean Sailing', 'Harbor Oysters', 'Club Tennis', 'Coastal Hikes', 'Live Music'],
  },
  'sylvie-atelier-jaguar': {
    idealSunday: 'Quiet design museum morning and laughing over midnight sourdough toast',
    softSpot: 'Warm tactile affection behind closed doors that melts her cool exterior',
    extraInterests: ['Design Museums', 'Sculpture Gardens', 'Jazz Vinyl', 'Architecture', 'Gallery Walks'],
  },
  'blythe-cabaret-panther': {
    idealSunday: 'Late supper after curtain call beside a speakeasy piano',
    softSpot: 'Walking into opening-night parties arm-in-arm with total pride',
    extraInterests: ['Opening Nights', 'Speakeasy Piano', 'Stage Directing', 'Late Suppers', 'Dry Comedy'],
  },
  'vivienne-silver-panther': {
    idealSunday: 'Morning swim in the sea, linen kaftan, and old Italian records on the terrace',
    softSpot: 'Smiling past public double-takes while holding her hand across the piazza',
    extraInterests: ['Sea Swimming', 'Runway Archives', 'Vinyl Jazz', 'Mediterranean Travel', 'Photography'],
  },
  'helen-couture-panther': {
    idealSunday: 'Top-down drive in her vintage convertible before hosting a candlelit terrace salon',
    softSpot: 'Bringing her morning tea in bed without trying to rearrange her life',
    extraInterests: ['Vintage Convertibles', 'Terrace Salons', 'Art Auctions', 'Biography Books', 'Coastal Drives'],
  },
  'beatrice-vineyard-panther': {
    idealSunday: 'Sunrise walk through her hillside vines with the dogs and dinner under string lights',
    softSpot: 'Insisting on picking up the tab on Date #1 despite her vineyard estate',
    extraInterests: ['Vineyard Hikes', 'Harvest Dinners', 'Golden Retrievers', 'Acoustic Guitar', 'Gardening'],
  },
  'leo-golden-cub': {
    idealSunday: 'Tying on a washed linen apron, simmering Sunday sauce, and fixing squeaky hinges',
    softSpot: 'When a cool Black Cat woman teases him and makes him earn her smile',
    extraInterests: ['Handmade Pasta', 'Farmers Markets', 'Home Repairs', 'Clean Kitchens', 'Golden Retrievers'],
  },
  'colton-montana-cowboy-cub': {
    idealSunday: 'Bonfire under big sky, acoustic guitar, and two-stepping across the kitchen floor',
    softSpot: 'When she laughs at his Bozeman drawl and lets him carry both suitcases',
    extraInterests: ['Montana Ranches', 'Country Two-Step', 'Bonfires', 'Pickup Trucks', 'Cabo Weekends'],
  },
  'kieran-anthropic-ai-cub': {
    idealSunday: 'Morning cortados by the window, art bookstores, and searing brown-butter halibut',
    softSpot: 'Powering his brain completely off at 8 PM with a sharp, self-made woman',
    extraInterests: ['Brown-Butter Halibut', 'Art Bookstores', 'Coastal Drives', 'Vinyl Records', 'Quiet Luxury'],
  },
  'kayden-broke-dutch-cub': {
    idealSunday: '3 AM Valorant with his three roommates and hunting 4:30 PM happy-hour coupons',
    softSpot: 'Splitting seven edamame pods down to the exact $0.38 cent on split-tab',
    extraInterests: ['Going Dutch', '3 AM Valorant', 'Happy Hour Deals', 'Campus Coupons', 'Roommate Chaos'],
  },
  'miles-millennial-cub': {
    idealSunday: 'Sketching coastal houses, architectural bookshops, and a slow dinner for two',
    softSpot: 'Accomplished women 45+ who know exactly what they like',
    extraInterests: ['Architecture', 'Boutique Hotels', 'Home Cooking', 'Design Museums', 'Coastal Drives'],
  },
  'marcus-firefighter-cub': {
    idealSunday: '8 AM beach run with his rescue mutt Otis, farmers market, and Cajun shrimp pasta',
    softSpot: 'Pre-heating her passenger seat warmer before opening her car door',
    extraInterests: ['Beach Runs', 'Rescue Dog Otis', 'Cajun Cooking', '90s R&B Vinyl', 'Strength Training'],
  },
  'liam-redhead-carpenter-cub': {
    idealSunday: 'Dawn pine-ridge hike, woodshop sanding, and searing ribeye in cast iron',
    softSpot: 'Building custom walnut shelves and fixing every cabinet door in her house',
    extraInterests: ['Custom Woodworking', 'Mountain Hiking', 'Folk Vinyl', 'Cast-Iron Steaks', 'Rescue Dogs'],
  },
  'lucas-blonde-swimmer-cub': {
    idealSunday: 'Morning ocean swim laps, poolside reading, and 90-second shoulder massages',
    softSpot: 'Releasing tight Pilates shoulders and keeping the bedroom at 62°F',
    extraInterests: ['Ocean Swimming', 'Sports Medicine', 'Club Tennis', 'Palm Springs', 'Coastal Runs'],
  },
  'theo-phd-campus-cub': {
    idealSunday: 'Autumn campus walk, matinee world cinema, and tucked-away omakase sushi',
    softSpot: 'Worldly women with accents who debate books and films past midnight',
    extraInterests: ['Omakase Sushi', 'World Cinema', 'Neuroscience', '5x225 Lifting', 'Bookstores'],
  },
  'noah-surf-cub': {
    idealSunday: 'Shaping surfboards at dawn, dialing in pour-over coffee, and acoustic vinyl',
    softSpot: 'Showing up ten minutes early with flowers so she forgets he is 22',
    extraInterests: ['Board Shaping', 'Latte Art', 'Dawn Surf', 'Acoustic Vinyl', 'Beach Bonfires'],
  },
  'devon-indie-cub': {
    idealSunday: 'Shooting 35mm film portraits in golden light and digging through 70s soul crates',
    softSpot: 'Making her laugh mid-photograph and skipping loud clubs for jazz bars',
    extraInterests: ['35mm Film', 'Art Museums', '70s Soul Vinyl', 'Meadow Picnics', 'Darkroom Prints'],
  },
  'jin-souschef-cub': {
    idealSunday: 'Morning granite bouldering, sheet-mask skincare, and midnight handmade dumplings',
    softSpot: 'When she steals bites straight off his cutting board at 11 PM',
    extraInterests: ['Rock Climbing', 'Handmade Dumplings', '10-Step Skincare', 'Vinyl Bars', 'Pour-Over Coffee'],
  },
  'dante-trail-cub': {
    idealSunday: '6 AM coastal summit run, calf recovery stretch, and homemade Sunday pasta',
    softSpot: 'Testing his sub-7 mile pace beside a woman who refuses to go easy on him',
    extraInterests: ['Trail Running', 'Physical Therapy', 'Home Cooking', 'Live Jazz', 'Farmers Markets'],
  },
  'rafael-accented-gentleman-cub': {
    idealSunday: 'Packing fresh figs and warm baguette for a meadow picnic before retro bowling',
    softSpot: 'Old-world manners, ironed linen shirts, and slow dancing in the living room',
    extraInterests: ['Meadow Picnics', 'Retro Neon Bowling', 'Family Pasta Recipes', 'Slow Dancing', 'Craftsmanship'],
  },
  'julian-oldsoul-cub': {
    idealSunday: 'Spinning Sade on vinyl, coastal afternoon drive, and booking Friday before Wednesday',
    softSpot: 'Fresh pink peonies and keeping his phone face-down all through dinner',
    extraInterests: ['Sade & Vinyl', 'Architecture', 'Coastal Drives', 'Fresh Peonies', 'Home Cooking'],
  },
  'gavin-pilot-cub': {
    idealSunday: 'Spontaneous coastal hop in a two-seater or lazy hotel pool afternoon',
    softSpot: 'Making her the center of his universe every hour he is back on the ground',
    extraInterests: ['Coastal Aviation', 'Island Getaways', 'Ocean Sailing', 'Hotel Pools', ' Grill Nights'],
  },
  'owen-sommelier-cub': {
    idealSunday: 'Stirring cast-iron mushroom risotto while blind-tasting bottles in the kitchen',
    softSpot: 'Carrying every heavy box up the stairs and cooking late after service',
    extraInterests: ['Cast-Iron Risotto', 'Vinyl Jazz', 'Blind Tastings', 'Bistro Cooking', 'Weekend Travel'],
  },
  'grant-surgeon-cub': {
    idealSunday: 'Phones completely off, morning tennis, and an unhurried coastal dinner',
    softSpot: 'Accomplished women over 43 who never play twenty-something texting games',
    extraInterests: ['Club Tennis', 'Opera & Jazz', 'Boutique Hotels', 'Coastal Drives', ' Sunday Cooking'],
  },
};

export function getProfileDetails(profile: HerArchetype | HisArchetype) {
  const delight = DELIGHT_DETAILS[profile.id];
  const rawInterests = delight?.extraInterests ?? profile.interests ?? [
    'Coastal Drives',
    'Home Cooking',
    'Live Music',
    'Weekend Escapes',
  ];
  return {
    zodiac: (profile.zodiac ?? '♏ Scorpio Sun • ♌ Leo Rising').replace(/\s*[\u2014\u2013]+\s*/g, ' • '),
    height: profile.height ?? '5\'8"',
    loveLanguage: (profile.loveLanguage ?? 'Intentional Effort & Touch').replace(/\s*[\u2014\u2013]+\s*/g, ', '),
    originOrAccent: profile.originOrAccent ?? 'Cosmopolitan Charm',
    signatureDrink: (profile.signatureDrink ?? 'Espresso Martini').replace(/\s*[\u2014\u2013]+\s*/g, ', '),
    statusPill: (profile.statusPill ?? 'Solo Sanctuary').replace(/\s*[\u2014\u2013]+\s*/g, ' • '),
    interests: rawInterests.map((s) => s.trim()),
    idealSunday:
      delight?.idealSunday ?? 'Slow morning coffee, farmers market stroll, and unhurried dinner',
    softSpot:
      delight?.softSpot ?? 'Thoughtful plans, real curiosity, and keeping phones off the table',
    petName: 'petName' in profile && profile.petName ? profile.petName.replace(/\s*[\u2014\u2013]+\s*/g, ' • ') : undefined,
  };
}

const FACE_FREE_POV_SCENES: { url: string; tag: string; defaultCaption: string }[] = [
  {
    url: './images/scenes/sunday-kitchen-sanctuary.jpg',
    tag: 'Sunday Kitchen',
    defaultCaption: 'Marble-counter prep with music on and phones face-down',
  },
  {
    url: './images/scenes/candlelit-cocktails.jpg',
    tag: '7:30 Booth',
    defaultCaption: 'Tucked-away corner booth where conversation actually lands',
  },
  {
    url: './images/scenes/palm-springs-resort.jpg',
    tag: 'Weekend Escape',
    defaultCaption: 'Golden-hour pool deck when the out-of-office hits',
  },
  {
    url: './images/scenes/coastal-convertible.jpg',
    tag: 'Coastal Drive',
    defaultCaption: 'Windows down up the coast with a real playlist queued',
  },
  {
    url: './images/scenes/hotel-pool-sauna.jpg',
    tag: 'Pool & Sauna',
    defaultCaption: 'Cedar sauna steam and midnight swim unwind',
  },
  {
    url: './images/scenes/luxury-bedroom-sanctuary.jpg',
    tag: 'Home Sanctuary',
    defaultCaption: 'Crisp percale sheets, four pillows, and 62°F calm',
  },
  {
    url: './images/scenes/campus-autumn-sushi.jpg',
    tag: 'Twilight Stroll',
    defaultCaption: 'Neighborhood walk en route to tucked-away omakase',
  },
  {
    url: './images/scenes/cozy-rain-suite.jpg',
    tag: 'Rainy Night In',
    defaultCaption: 'Rain on the glass, good wine, and zero rush anywhere',
  },
  {
    url: './images/scenes/neon-bowling-lounge.jpg',
    tag: 'Playful Date',
    defaultCaption: 'Competitive retro lanes when stuffy dinners get old',
  },
  {
    url: './images/scenes/wedding-gala-cheers.jpg',
    tag: 'Plus-One Ready',
    defaultCaption: 'Cleans up sharp whenever black-tie season calls',
  },
  {
    url: './images/cast/dog-park-picnic.jpg',
    tag: 'Park Picnic',
    defaultCaption: 'Saturday meadow blanket, fresh berries, and pup cameos',
  },
];

const CURATED_HINGE_META: Record<
  string,
  {
    schoolAndMajor: string;
    fieldOfWork: string;
    funFacts: [string, string];
    memoryKeyword: string;
    memoryRewardLine: string;
  }
> = {
  'astrid-blonde-cougar': {
    schoolAndMajor: 'Stanford • Bioengineering PhD',
    fieldOfWork: 'Biotech & Ocean Sports',
    funFacts: [
      'Sold my diagnostics company so I never miss a 6:15 AM Malibu swell.',
      'My cedar barrel sauna hits 190°F every Sunday evening.',
    ],
    memoryKeyword: 'sauna',
    memoryRewardLine: 'Wait, you remembered my Sunday 190°F cedar sauna ritual? Top of the stack.',
  },
  'sedona-breathwork-mommy': {
    schoolAndMajor: 'UC Berkeley • Integrative Physiology',
    fieldOfWork: 'Somatic Studio & Breathwork',
    funFacts: [
      'Practiced dawn Cloud Hands in three time zones for twenty years.',
      'Import single-estate jasmine oolong in hand-thrown clay canisters.',
    ],
    memoryKeyword: 'oolong',
    memoryRewardLine: 'You remembered the jasmine oolong clay canisters. Shoulders dropped already.',
  },
  'sloane-coastal-golden-mommy': {
    schoolAndMajor: 'RISD • Interior Architecture',
    fieldOfWork: 'Holistic Coastal Design',
    funFacts: [
      'Can spot hidden soybean oil on a restaurant menu from across the patio.',
      'My apricot Mini golden retriever Miso judges every throw pillow sample first.',
    ],
    memoryKeyword: 'miso',
    memoryRewardLine: 'Mentioning Miso on message one? Both of us are officially wagging.',
  },
  'summer-beach-puma': {
    schoolAndMajor: 'USC • Kinesiology & Sports Business',
    fieldOfWork: 'Boutique Fitness & Wellness',
    funFacts: [
      'Already picked the carat cut for my future push present.',
      'Looking for an energetic Cub ready to build a gorgeous family chapter.',
    ],
    memoryKeyword: 'pilates',
    memoryRewardLine: 'Surviving my Reformer springs AND backing my family timeline? Bold move.',
  },
  'claire-cougar-exec': {
    schoolAndMajor: 'Wharton • Economics & Product Strategy',
    fieldOfWork: 'Enterprise Tech Leadership',
    funFacts: [
      'Thermostat locks automatically to 62°F at 9:30 PM sharp.',
      'Still own my 1998 Lauryn Hill vinyl pressing with zero scratches.',
    ],
    memoryKeyword: 'lauryn',
    memoryRewardLine: 'Bringing up Lauryn Hill and respecting 62°F AC? Somebody studied.',
  },
  'simone-auntie-cougar': {
    schoolAndMajor: 'NYU Law • Entertainment & IP',
    fieldOfWork: 'Music & Festival Law',
    funFacts: [
      'Keep two spare 22-momme silk pillowcases in my weekend carry-on.',
      'My cousins run a 90-second vibe tribunal at every Sunday cookout.',
    ],
    memoryKeyword: 'silk',
    memoryRewardLine: 'Good boy. Remembering silk-pillowcase law just put you ahead of 99% of men.',
  },
  'celeste-panther-icon': {
    schoolAndMajor: 'Vassar • Art History',
    fieldOfWork: 'Architectural Estates & Patronage',
    funFacts: [
      'Strictly "Gigi" on the 10 AM Saturday toddler soccer sidelines.',
      'Still navigate coastal highways faster with memory than your GPS.',
    ],
    memoryKeyword: 'gigi',
    memoryRewardLine: 'Respecting Saturday 10 AM Gigi soccer duty? Come pour us two Gibsons.',
  },
  'serena-princess-cougar': {
    schoolAndMajor: 'UCLA • Design & Visual Culture',
    fieldOfWork: 'Luxury Brand Direction',
    funFacts: [
      'Retired forever from splitting checks or planning my own Friday dinner.',
      'Pink Sarah Bernhardt peonies are non-negotiable in May.',
    ],
    memoryKeyword: 'peonies',
    memoryRewardLine: 'Pink Sarah Bernhardt peonies without me hinting twice? Passenger door is yours.',
  },
  'hannah-vineyard-puma': {
    schoolAndMajor: 'Culinary Institute of America • Baking & Pastry',
    fieldOfWork: 'Artisanal Homestead & Bakery',
    funFacts: [
      'My sourdough starter is nine years old and has its own jar wardrobe.',
      'Put up 48 jars of spiced Sonoma peaches every August.',
    ],
    memoryKeyword: 'sourdough',
    memoryRewardLine: 'Asking about my nine-year sourdough starter just earned you warm brioche.',
  },
  'zoe-equestrian-puma': {
    schoolAndMajor: 'UC Davis • Doctor of Veterinary Medicine',
    fieldOfWork: 'Equine Sports Medicine',
    funFacts: [
      'Parallel-park a two-horse gooseneck trailer in one clean reverse.',
      'Up at 5:30 AM in barn boots, barefoot in silk by 7:30 PM.',
    ],
    memoryKeyword: 'trailer',
    memoryRewardLine: 'Not intimidated by a 5:30 AM horse trailer? Now we are talking.',
  },
  'priya-surgeon-puma': {
    schoolAndMajor: 'UCSF • BSN Trauma & Critical Care',
    fieldOfWork: 'Level-1 Trauma Nursing',
    funFacts: [
      '7:30 AM al-pastor breakfast tacos after night shift feel like Michelin dining.',
      'My golden retriever Rani carries her own leash up canyon switchbacks.',
    ],
    memoryKeyword: 'rani',
    memoryRewardLine: 'Winning over Rani AND bringing 7:30 AM post-shift tacos? Unfair combo.',
  },
  'chloe-puma-dogmom': {
    schoolAndMajor: 'Northwestern • Journalism & Brand Strategy',
    fieldOfWork: 'Global Brand Consulting',
    funFacts: [
      'Packed three weeks in Tokyo into one 21-inch carry-on.',
      'Rescue mutt Barnaby gets final veto over everyone who enters.',
    ],
    memoryKeyword: 'barnaby',
    memoryRewardLine: 'Pocket treat for Barnaby noted! You just passed Gatekeeper #1.',
  },
  'amber-milestone-cougar': {
    schoolAndMajor: 'Gemological Institute & Parsons • Fine Arts',
    fieldOfWork: 'Fine Art & Estate Jewelry',
    funFacts: [
      '5\'1" in bare feet, 5\'6" in heels at an estate gold auction.',
      'Hunt 1970s Italian 18k gold cuffs across three continents.',
    ],
    memoryKeyword: 'auction',
    memoryRewardLine: 'Offering to reach the top shelf after my estate auction? Dangerous charm.',
  },
  'nadia-booktok-cat-cougar': {
    schoolAndMajor: 'Reed College • Comparative Literature',
    fieldOfWork: 'Fiction Publishing',
    funFacts: [
      'Read 110 novels last year and annotated the spicy chapters.',
      'My orange tabby Mochi stares unblinking from the headboard as a test.',
    ],
    memoryKeyword: 'mochi',
    memoryRewardLine: 'Respecting Mochi’s headboard stare-down? Pull up a blanket and Pinot.',
  },
  'diana-coastal-jaguar': {
    schoolAndMajor: 'UCSB • Cultural Anthropology & 300hr RYT',
    fieldOfWork: 'Global Retreats & Writing',
    funFacts: [
      'Sold 90% of my furniture at 49 to live out of one carry-on.',
      'Know the best corner espresso bar in Lisbon, Oaxaca, and Uluwatu.',
    ],
    memoryKeyword: 'lisbon',
    memoryRewardLine: 'Passport ready for Lisbon with carry-on only? You speak my language.',
  },
  'renee-creative-jaguar': {
    schoolAndMajor: 'Columbia Teachers College • Ed Leadership',
    fieldOfWork: 'Secondary School Administration',
    funFacts: [
      'Cannot buy Pinot in my own zip code without bumping into three PTA parents.',
      'Keep a secret playlist for driving two towns over on Friday night.',
    ],
    memoryKeyword: 'principal',
    memoryRewardLine: 'Booking a quiet jazz booth two towns over? Best detention skip ever.',
  },
  'valerie-jaguar-trail': {
    schoolAndMajor: 'University of Colorado • Exercise Science',
    fieldOfWork: 'Athletic Studio & Trail Coaching',
    funFacts: [
      'Saw Nirvana live in 1993, so choose your vintage band tee wisely.',
      'If I reply "Sounds good." with a period and 👍, relax, I like you.',
    ],
    memoryKeyword: 'nirvana',
    memoryRewardLine: 'Haha. Naming three tracks off In Utero without googling? Respect.',
  },
  'margot-botanical-jaguar': {
    schoolAndMajor: 'Cal Poly • Landscape Architecture',
    fieldOfWork: 'Coastal Gardens & Homestead',
    funFacts: [
      'Thursday CSA farm box dictates 100% of my Sunday pasta menu.',
      'Have Zillow alerts set for 15-acre coastal ranch parcels.',
    ],
    memoryKeyword: 'ranch',
    memoryRewardLine: 'Ready to taste-test CSA heirloom sauce and tour 15 acres? Come on over.',
  },
  'evelyn-mogul-jaguar': {
    schoolAndMajor: 'USC School of Cinematic Arts • Producing',
    fieldOfWork: 'Independent Film Production',
    funFacts: [
      'Judge every luxury hotel by the temperature of its Vesper martini.',
      'Four years into my second act and laughing louder than ever.',
    ],
    memoryKeyword: 'vesper',
    memoryRewardLine: 'Ordering a proper Vesper at the lobby bar with steady eye contact? Bravo.',
  },
  'helen-couture-panther': {
    schoolAndMajor: 'Smith College • European History & Art',
    fieldOfWork: 'Publishing & Art Patronage',
    funFacts: [
      'Drive a manual 1968 Mercedes Pagoda convertible on Sundays.',
      '5\'2" with an auction paddle that terrifies grown gallery dealers.',
    ],
    memoryKeyword: 'convertible',
    memoryRewardLine: 'Appreciating a manual 1968 convertible? Toss your weekender in the trunk.',
  },
  'beatrice-vineyard-panther': {
    schoolAndMajor: 'UC Davis • Viticulture & Enology',
    fieldOfWork: 'Organic Estate Winemaking',
    funFacts: [
      'Walk four hillside Pinot miles before grandkid soccer kickoff Saturday.',
      'Pour unlabeled barrel samples at midnight for people I adore.',
    ],
    memoryKeyword: 'pinot',
    memoryRewardLine: 'Remembering my hillside Pinot rows AND Saturday Gigi morning? Pure class.',
  },
  'julian-oldsoul-cub': {
    schoolAndMajor: 'Imperial College London • MEng Structural Engineering',
    fieldOfWork: ' Bridge & Seismic Architecture',
    funFacts: [
      'Still say "half seven" and sign proper messages with an x.',
      'Brought 60 Sade & Massive Attack records across the Atlantic in hand luggage.',
    ],
    memoryKeyword: 'half seven',
    memoryRewardLine: 'Half seven is sorted, love. Pink peonies already riding shotgun xx',
  },
  'kieran-anthropic-ai-cub': {
    schoolAndMajor: 'MIT • Computer Science & Math',
    fieldOfWork: 'Frontier AI Safety Research',
    funFacts: [
      'Power every screen completely off at 8 PM to sear brown-butter halibut.',
      'Strict zero-startup-talk policy once the wine cork pops.',
    ],
    memoryKeyword: 'halibut',
    memoryRewardLine: 'Remembered the 8 PM brown-butter halibut rule? Phones off, apron on.',
  },
  'marcus-firefighter-cub': {
    schoolAndMajor: 'UCLA Paramedic Academy • Fire Science',
    fieldOfWork: 'Municipal Fire & Rescue',
    funFacts: [
      'Undefeated Station 14 blackened Cajun shrimp pasta champion.',
      'My rescue dog Otis rides shotgun to every Saturday farmers market.',
    ],
    memoryKeyword: 'otis',
    memoryRewardLine: 'Asking about Otis AND my station Cajun pasta? Seat warmer is on Level 3.',
  },
  'colton-montana-cowboy-cub': {
    schoolAndMajor: 'Montana State • Agribusiness (Varsity WR)',
    fieldOfWork: 'Cattle Ranching & Land Management',
    funFacts: [
      'Yes, I once accidentally commented from the boys’ shared ranch account.',
      'Can two-step in a 4-foot kitchen aisle without spilling your wine.',
    ],
    memoryKeyword: 'montana',
    memoryRewardLine: 'Laughing at my Bozeman ranch story? Pack a carry-on, ma’am.',
  },
  'kayden-broke-dutch-cub': {
    schoolAndMajor: 'State University • 5th-Yr Corporate Finance',
    fieldOfWork: 'Campus Consulting & Budget Optimization',
    funFacts: [
      'Built an automated split-tab macro that splits tax down to half an edamame pod.',
      'Waiting on my bedframe delivery, gaming chair works great as a nightstand!',
    ],
    memoryKeyword: 'spreadsheet',
    memoryRewardLine: 'Wait you noticed my tax-split spreadsheet?! Okay promise dinner is on me 😅',
  },
  'rafael-accented-gentleman-cub': {
    schoolAndMajor: 'IBEW Master Apprenticeship • Electrical Systems',
    fieldOfWork: 'Master Craftsmanship & Custom Lighting',
    funFacts: [
      'Steam-iron my white linen shirts every Friday before sunset.',
      'Bake crusty rosemary sourdough from scratch for Sunday park picnics.',
    ],
    memoryKeyword: 'picnic',
    memoryRewardLine: 'You remembered my rosemary sourdough picnic basket! Friday is all yours.',
  },
};

function hashProfileSeed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const FALLBACK_SCHOOLS_HER = [
  'UC Berkeley • Rhetoric & Media',
  'Northwestern • Art History & Economics',
  'UCLA • Architecture & Urban Design',
  'NYU Tisch • Dramatic Writing',
  'University of Michigan • Comparative Lit',
  'Georgetown • International Affairs',
];

const FALLBACK_SCHOOLS_HIM = [
  'Cal Poly • Mechanical Engineering',
  'UW Seattle • Kinesiology & Rehab',
  'UT Austin • Architecture & Craft',
  'UC San Diego • Marine & Sports Medicine',
  'Boston University • Film & Photography',
  'UNC Chapel Hill • Neuroscience',
];

export function getHingeExtendedProfile(
  person: HerArchetype | HisArchetype,
): HingeExtendedProfile {
  const details = getProfileDetails(person);
  const curated = CURATED_HINGE_META[person.id];
  const seed = hashProfileSeed(person.id);
  const isHer = HER_ARCHETYPES.some((h) => h.id === person.id);

  const cleanJobTitle = person.title
    .replace(/\s*•\s*(Lynx|Puma|Cougar|Jaguar|Panther|Cub).*$/i, '')
    .trim();

  const schoolAndMajor =
    curated?.schoolAndMajor ??
    (isHer
      ? FALLBACK_SCHOOLS_HER[seed % FALLBACK_SCHOOLS_HER.length]
      : FALLBACK_SCHOOLS_HIM[seed % FALLBACK_SCHOOLS_HIM.length]);

  const fieldOfWork =
    curated?.fieldOfWork ??
    (cleanJobTitle.includes('Wine') || cleanJobTitle.includes('Chef') || cleanJobTitle.includes('Sommelier')
      ? 'Culinary & Hospitality'
      : cleanJobTitle.includes('MD') || cleanJobTitle.includes('Surgeon') || cleanJobTitle.includes('Therapist')
        ? 'Medicine & Performance'
        : cleanJobTitle.includes('Architect') || cleanJobTitle.includes('Design') || cleanJobTitle.includes('Carpenter')
          ? 'Architecture & Design'
          : 'Creative & Executive Leadership');

  const lifeStance = details.statusPill;

  const funFacts: [string, string] = curated?.funFacts ?? [
    `Signature order is always ${details.signatureDrink.toLowerCase()}.`,
    `My non-negotiable Sunday reset: ${details.idealSunday.charAt(0).toLowerCase()}${details.idealSunday.slice(1)}.`,
  ];

  const firstInterestWord =
    (details.interests[0] || 'friday').split(/\s+/)[0].replace(/[^a-z0-9]/gi, '').toLowerCase() ||
    'friday';
  const memoryKeyword = curated?.memoryKeyword ?? (details.petName ? details.petName.split(' ')[0].toLowerCase() : firstInterestWord);
  const memoryRewardLine =
    curated?.memoryRewardLine ??
    `Clocking that detail about ${memoryKeyword} tells me you actually read past Photo 1.`;

  const prompts = [
    {
      question: 'Green flags I look for right away',
      answer: `${details.softSpot}. Bonus points if ${details.loveLanguage.toLowerCase()} comes naturally.`,
    },
    {
      question: 'My ideal Sunday together',
      answer: `${details.idealSunday}, followed by ${details.signatureDrink.toLowerCase()} with phones face-down.`,
    },
    {
      question: isHer ? 'Quickest way to earn my real number' : 'If you pick Friday night, I will handle',
      answer: isHer
        ? `Skip "hey" and Snap requests. Propose a real 7:30 spot and match ${details.originOrAccent.toLowerCase()}.`
        : person.id === 'julian-oldsoul-cub'
          ? `A proper corner booth for half seven, car doors, and zero faffing about xx`
          : person.subplotTags.includes('broke_dutch_obstacle')
            ? `Finding the best 4:30 PM happy-hour roll deal on the block and keeping the receipt organized.`
            : `Every reservation detail so you can turn your brain off at 7:30 sharp.`,
    },
  ];

  const pickedScenes: typeof FACE_FREE_POV_SCENES = [];
  for (let offset = 0; pickedScenes.length < 5 && offset < FACE_FREE_POV_SCENES.length * 2; offset++) {
    const candidate = FACE_FREE_POV_SCENES[(seed + offset * 3) % FACE_FREE_POV_SCENES.length];
    if (!pickedScenes.some((s) => s.url === candidate.url)) {
      pickedScenes.push(candidate);
    }
  }

  const slideCaptions = [
    `${cleanJobTitle} • ${details.height} • ${details.originOrAccent}`,
    `Sunday ritual: ${details.idealSunday}`,
    `Table for two • ${details.signatureDrink} waiting`,
    `Off-duty recharge • ${details.interests.slice(0, 2).join(' & ')}`,
    person.subplotTags.includes('broke_dutch_obstacle')
      ? `Temporary setup while waiting on bedframe delivery (roommates cropped out)`
      : `Peaceful sanctuary rule: ${details.loveLanguage}`,
    `Favorite pace: ${details.softSpot}`,
  ];

  const slides: HingePhotoSlide[] = [
    {
      url: person.photoUrl,
      caption: slideCaptions[0],
      tag: 'Portrait',
    },
    ...pickedScenes.map((sc, idx) => ({
      url: sc.url,
      caption: slideCaptions[idx + 1] || sc.defaultCaption,
      tag: sc.tag,
    })),
  ];

  const matchSelectivity: HingeExtendedProfile['matchSelectivity'] = person.subplotTags.includes(
    'broke_dutch_obstacle',
  )
    ? 'chaos_twist'
    : person.subplotTags.includes('black_cat_energy') ||
        person.subplotTags.includes('trophy_wife_reborn') ||
        person.age >= 60
      ? 'selective'
      : 'warm';

  return {
    schoolAndMajor,
    fieldOfWork,
    jobTitle: cleanJobTitle,
    bio: person.tagline,
    lifeStance,
    funFacts,
    prompts,
    slides,
    memoryKeyword,
    memoryRewardLine,
    matchSelectivity,
  };
}

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
    badgeLabel = `${ageGap}-Year Junior Cougar Matchup`;
  } else if (felineTier === 'puma' || felineTier === 'lynx') {
    badgeLabel = `${ageGap}-Year Official ${TIER_LABELS[felineTier]} × Cub Matchup`;
  } else {
    badgeLabel = `${ageGap}-Year Official ${TIER_LABELS[felineTier]} × Cub Dynamic`;
  }

  const generationalHeadline = `${GEN_LABELS[herGeneration]} (${her.age}F) × ${GEN_LABELS[hisGeneration]} (${his.age}M)`;
  const herDetails = getProfileDetails(her);
  const hisDetails = getProfileDetails(his);
  const herSign = herDetails.zodiac.split('•')[0].trim();
  const hisSign = hisDetails.zodiac.split('•')[0].trim();
  const zodiacSpark = `${herSign} × ${hisSign} • High-voltage astrological magnetism (${herDetails.loveLanguage.split('&')[0].trim()} meets ${hisDetails.loveLanguage.split('&')[0].trim()})`;

  const hasBlackCat = her.subplotTags.includes('black_cat_energy');
  const hasGolden = his.subplotTags.includes('golden_retriever_energy');
  const energyPolarity =
    hasBlackCat && hasGolden
      ? `🐈‍⬛ Black Cat ${TIER_LABELS[felineTier]} × 🐕 Golden Retriever Cub • She takes her time & pushes back at first; he beams brighter earning every inch of her warmth!`
      : hasBlackCat
        ? `🐈‍⬛ Black Cat Energy Active • Unhurried, selective & pushes back on rushed effort`
        : hasGolden
          ? `🐕 Golden Retriever Cub Active • Sunny, unbothered devotion & zero ego games`
          : undefined;

  let codeSwitchTip: string;
  if (herGeneration === 'gen_z') {
    codeSwitchTip =
      'Lynx Peer Alert: Same generational slang fluency, so skip the excuses and stand out with real reservation effort and emotional follow-through.';
  } else if (ageGap > 0 && ageGap < 10) {
    codeSwitchTip =
      'Junior Cougar Alert: You share 80% of the same cultural references, lean into playful 2008 age-math banter and match her homeowner-era intentionality!';
  } else if (herGeneration === 'millennial') {
    codeSwitchTip =
      'Elder Millennial Alert: Drop skull emojis (💀) & lowercase "u tryna link", text before you call her phone, send a 7:30 calendar link, and ditch the crew socks.';
  } else if (herGeneration === 'gen_x') {
    codeSwitchTip =
      'Gen-X Alert: Skip all-day work micro-texting and Snapchat, make a confident 6 PM phone call, show up five minutes early, and never flake.';
  } else {
    codeSwitchTip =
      'Icon Alert: Put your phone face-down all dinner, order with poise, call instead of DMing, and own every public glance with pride.';
  }

  let trackTitle: string;
  if (his.subplotTags.includes('broke_dutch_obstacle')) {
    trackTitle = `${ageGap}-Year Sub-23 Danger-Zone Run: Broke College Dutch-Splitter, 3-Roommate Kitchen & split-tab Horror`;
  } else if (ageGap > 0 && (her.subplotTags.includes('junior_cougar_gap') || ageGap <= 8)) {
    trackTitle = `${ageGap}-Year Junior Cougar Storyline: 2008 High-School Math, Micro-Gen Teasing, Pace-Sync Doubt & Sweet-Spot Love`;
  } else if (felineTier === 'puma' || felineTier === 'lynx') {
    trackTitle = her.subplotTags.includes('dog_mom_divorced')
      ? '30s Child-Free Dog-Mom Puma Arc: Rescue-Dog Vetting, Peer Cynicism & Zero Man-Child Tolerance'
      : '30s Single-Mom Puma Storyline: Babysitter Clocks, Co-Parenting & Millennial/Gen-Z Rhythm';
  } else if (felineTier === 'cougar') {
    trackTitle = her.subplotTags.includes('princess_treatment')
      ? '40s Princess Cougar Storyline: Soft-Life Royalty, Age-Slider Boldness & Baby Crossroads'
      : '40s Executive Cougar Storyline: Check-Drops, 62°F Thermostats & Sanctuary Rules';
  } else if (felineTier === 'jaguar') {
    trackTitle = '50s Jaguar Storyline: 6 AM Short-Leash Trails, Adult Kids & LAT Commitment';
  } else {
    trackTitle = '60+ Panther Icon Storyline: Palm Springs Glamour, Public Pride & Real Timelines';
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
    zodiacSpark,
    energyPolarity,
    codeSwitchTip,
    trackTitle,
    activeSubplotTags: Array.from(tagSet),
  };
}
