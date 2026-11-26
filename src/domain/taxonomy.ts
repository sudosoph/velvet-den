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
  | 'qigong_mommy_domme'
  | 'seed_oil_bernedoodle_mommy'
  | 'frontier_ai_cub';

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
 * 37 Distinct Women Profiles — Covering EVERY SINGLE YEAR from 30 to 64!
 * Top row is curated for instant visual contrast (Malibu blonde surfer, copper redhead poolside,
 * emerald cabana braids, honey-blonde tennis coat, platinum desert icon, curly redhead art dealer,
 * sunlit California blonde, rooftop martini VP) with zero ethnic/quota labels—heights, star signs,
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
      'Sold her diagnostics startup at 39 and moved to the Malibu point break. Lives in ocean bikinis and linen button-downs—and loves watching a fit Cub try to pop up on a longboard.',
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
      { label: '🏔️ Ridge Trail', url: './images/cast/valerie-53f.jpg' },
      { label: '🐾 Dog Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Dawn Surfing', 'Cold Plunge & Sauna', 'Ocean Bikinis', 'Clean Wine', 'Coastal Runs'],
  },
  {
    id: 'sedona-qigong-mommy',
    name: 'Sedona',
    age: 46,
    title: 'Qigong, Seed-Oil-Free & Bernedoodle Mommy-Domme',
    shortHook: '6:30 AM Qigong, 100% gluten & seed-oil free, soft Mommy-Domme praise & Mini Bernedoodle waitlist.',
    tagline:
      '46F Tai Chi & wellness founder: gluten & seed-oil free, #3 on the Tricolor Mini Bernedoodle waitlist, and "Breathe with Mommy, good boy."',
    vibeSummary:
      'Guides dawn Qigong and slow Tai Chi Cloud Hands, cooks strictly gluten-free & seed-oil-free (grass-fed tallow, ghee & cold-pressed olive oil ONLY), and is on the breeder waitlist to adopt a tricolor Mini Bernedoodle named Miso. Fixes a Cub’s posture with two fingers under his chin and shuts down Cubsplaining with one smirk.',
    secretInsecurity:
      'Everyone comes to her to be grounded and regulated—privately melts when an attentive Cub calls the restaurant chef ahead to check for canola oil & gluten and brings puppy toys for incoming Miso.',
    subplotTags: [
      'qigong_mommy_domme',
      'seed_oil_bernedoodle_mommy',
      'zero_proof_wellness',
      'black_cat_energy',
      'solo_sanctuary',
      'done_with_kids',
    ],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/sedona-qigong-46f.jpg',
    lookBadge: 'Auburn Silver Waves • Seed-Oil-Free Mommy-Domme',
    statusPill: 'GF & Seed-Oil Free • Bernedoodle Waitlist',
    zodiac: '♍ Virgo Sun • ♏ Scorpio Rising',
    height: '5\'9"',
    loveLanguage: 'Guided Qigong, Grass-Fed Ghee Cooking & "Good Boy" Praise',
    originOrAccent: 'Serene Sedona Velvet Cadence',
    signatureDrink: 'Warm Jasmine Oolong & Collagen Matcha (Zero Seed Oils)',
    petName: 'Miso (Tricolor Mini Bernedoodle — Waitlist #3)',
    galleryPhotos: [
      { label: '🧘‍♀️ Dawn Qigong', url: './images/cast/sedona-qigong-46f.jpg' },
      { label: '🏔️ Canyon Trail', url: './images/cast/valerie-53f.jpg' },
      { label: '🐶 Puppy Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: [
      'Qigong & Tai Chi',
      '100% Gluten & Seed-Oil Free',
      'Tricolor Mini Bernedoodle Waitlist',
      'Mommy-Domme Praise',
      'Cold Plunge & Sauna',
    ],
  },
  {
    id: 'sloane-seedoil-bernedoodle-mommy',
    name: 'Sloane',
    age: 42,
    title: 'Holistic Health-Nut Mommy-Domme • Cougar',
    shortHook: 'Strictly gluten & seed-oil free, grass-fed ghee chef & #2 on the tricolor Mini Bernedoodle waitlist.',
    tagline:
      '42F holistic nutrition founder: bans canola oil at 50 paces, bakes cassava sourdough, and rewards attentive Cubs with soft Mommy praise.',
    vibeSummary:
      'Reads every ingredient label in 1.4 seconds, cooks exclusively in grass-fed ghee, beef tallow & cold-pressed olive oil, and has a puppy nursery ready for her incoming tricolor Mini Bernedoodle puppy Miso.',
    secretInsecurity:
      'Tired of grumpy 44-year-old dates rolling their eyes when she asks the waiter about cooking oils—adores an enthusiastic Cub who calls the chef ahead so she never has to ask.',
    subplotTags: [
      'seed_oil_bernedoodle_mommy',
      'qigong_mommy_domme',
      'zero_proof_wellness',
      'princess_treatment',
      'solo_sanctuary',
    ],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/brooke-42f.jpg',
    lookBadge: 'Sunlit Honey Waves • Health-Nut Wellness Mommy',
    statusPill: '100% GF & Seed-Oil Free • Puppy Waitlist #2',
    zodiac: '♉ Taurus Sun • ♍ Virgo Rising',
    height: '5\'7"',
    loveLanguage: 'Seed-Oil-Free Home Cooking & Puppy-Nursery Prep',
    originOrAccent: 'Montecito Farmers-Market Warmth',
    signatureDrink: 'Organic Tart-Cherry & Magnesium Mocktail',
    petName: 'Miso (Tricolor Mini Bernedoodle — Waitlist #2)',
    galleryPhotos: [
      { label: '🥑 Clean Glow', url: './images/cast/brooke-42f.jpg' },
      { label: '🐶 Puppy Lawn', url: './images/cast/dog-park-picnic.jpg' },
      { label: '🏔️ Morning Walk', url: './images/cast/astrid-41f.jpg' },
    ],
    interests: [
      'Zero Seed Oils',
      '100% Gluten-Free',
      'Tricolor Mini Bernedoodle',
      'Grass-Fed Tallow & Ghee',
      'Red-Light & Infrared Sauna',
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
      { label: '🥂 Terrace Glow', url: './images/cast/hero-couple.jpg' },
      { label: '🐾 Rosé Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Barolo & Truffles', 'Infinity Pools', 'Late-Night Cooking', 'Vinyl Soul', 'Coastal Escapes'],
  },
  {
    id: 'simone-auntie-cougar',
    name: 'Simone',
    age: 44,
    title: 'Music Attorney • Cabana Cougar',
    shortHook: 'Honey goddess braids, emerald Palm Springs bikinis & silk-pillowcase law.',
    tagline:
      'Entertainment partner in peak Rich Auntie Era: cabana bikinis, 90s R&B vinyl, and strict silk-pillowcase respect.',
    vibeSummary:
      'Negotiates festival headliner deals by day and floats in Palm Springs pools by Friday afternoon. Waiters card her like she’s 31; her cousins at Sunday cookout will vet your soul in ninety seconds flat.',
    secretInsecurity:
      'Used to being the powerhouse fixer in every room—melts completely when a tall, emotionally fluent Cub rubs her shoulders and handles dinner without ego.',
    subplotTags: ['princess_treatment', 'done_with_kids', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'princess',
    photoUrl: './images/cast/simone-44f.jpg',
    lookBadge: 'Honey Braids • Cabana Bikini • Music Law',
    statusPill: 'Child-Free • Homeowner',
    zodiac: '♏ Scorpio Sun • ♉ Taurus Moon',
    height: '5\'8"',
    loveLanguage: 'Shoulder Massages & Zero Ego',
    originOrAccent: 'Music-Row Smooth Cadence',
    signatureDrink: 'French 75 Cabana-Side',
    galleryPhotos: [
      { label: '👙 Cabana Bikini', url: './images/cast/simone-44f.jpg' },
      { label: '🥂 Rooftop Martini', url: './images/cast/hero-couple.jpg' },
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
      'Lowered her dating-app slider from 40 to 25 on a dare after Kristin Cavallari & Montana Boyz—and hasn’t stopped smiling since.',
    vibeSummary:
      '42F luxury hospitality consultant with sunlit honey-blonde hair, killer backhand slice, and zero patience for grumpy 46-year-old divorcés complaining about their sciatica.',
    secretInsecurity:
      'Her tennis-club doubles partners gossip non-stop—she needs a Cub who walks onto the club patio beside her like he owns the zip code.',
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
      { label: '🏖️ Poolside', url: './images/cast/astrid-41f.jpg' },
      { label: '🥂 Terrace', url: './images/cast/hero-couple.jpg' },
    ],
    interests: ['Club Tennis', 'Reformer Pilates', 'Iced Matcha', 'Cabo Weekends', 'Country Music'],
  },
  {
    id: 'celeste-panther-icon',
    name: 'Celeste',
    age: 62,
    title: 'Palm Springs Panther Icon',
    shortHook: 'Platinum-silver glamour, sea-green eyes, desert pool & unapologetic romance.',
    tagline: 'Unapologetic silver-screen magnet. Zero tolerance for Snapchat, 100% appreciation for eager devotion.',
    vibeSummary:
      'Owns an architectural desert home, collects vinyl jazz, and delights in mentoring an emotionally literate younger man who holds her hand in public with pride.',
    secretInsecurity:
      'Wonders in quiet moments if silver strands or aging timelines scare him—right while he can barely breathe looking at her.',
    subplotTags: ['done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'panther',
    photoUrl: './images/cast/celeste-62f.jpg',
    lookBadge: 'Platinum Silver • Sea-Green Eyes • Desert Pool',
    statusPill: 'Kids Grown • Desert Sanctuary',
    zodiac: '♒ Aquarius Sun • ♌ Leo Rising',
    height: '5\'8"',
    loveLanguage: 'Public Hand-Holding & Vinyl Nights',
    originOrAccent: 'Silver-Screen Mid-Atlantic Poise',
    signatureDrink: 'Gibson Martini Up',
    galleryPhotos: [
      { label: '🏖️ Desert Pool', url: './images/cast/celeste-62f.jpg' },
      { label: '🥂 Sunset Terrace', url: './images/cast/hero-couple.jpg' },
      { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Palm Springs Pools', 'Vinyl Jazz', 'Dry Martinis', 'Modern Art', 'Silk Kaftans'],
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
      'Spent years dating pretentious art-world men who competed with her success—melts for an earnest younger man who cheers loudest at her openings.',
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
    title: 'Beach Volleyball & Cold-Plunge Puma',
    shortHook: 'Sun-bleached blonde, ocean-blue eyes, 5\'9" blocker & sunset tacos.',
    tagline:
      '32F sports physical therapist who spikes on 24-year-olds at Manhattan Beach, then treats the winner to fish tacos.',
    vibeSummary:
      'Tall, sun-kissed blonde with bright blue eyes and competitive athleticism. Switched her app filter down to 25 after realizing guys her age never leave the couch.',
    secretInsecurity:
      'Everyone sees the sunny beach athlete first—she falls hard for a younger guy who remembers the small emotional details she mentions once.',
    subplotTags: ['zero_proof_wellness', 'trail_leash_boss', 'junior_cougar_gap', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/summer-32f.jpg',
    lookBadge: 'Sunlit Blonde • Ocean-Blue Eyes • 5\'9"',
    statusPill: 'Sober-Curious • Beach Condo',
    zodiac: '♌ Leo Sun • ♊ Gemini Mars',
    height: '5\'9"',
    loveLanguage: 'Playful Competition & Post-Beach Massages',
    originOrAccent: 'South Bay Beach Glow',
    signatureDrink: 'Mango-Collagen Smoothie & Lime Topo Chico',
    interests: ['2v2 Beach Volleyball', 'Ocean Cold Plunge', 'Fish Tacos', 'Sunset Bike Rides', 'Sauna'],
  },
  {
    id: 'claire-cougar-exec',
    name: 'Claire',
    age: 45,
    title: 'VP of Product • Rooftop Cougar',
    shortHook: 'Mortgage paid, kids grown, espresso waves & zero sugar-mama tolerance.',
    tagline: 'Mortgage paid, tubes tied, peaceful sanctuary—zero need for a sugar baby.',
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

  // === COMPLETE EVERY-YEAR ROSTER: 30s PUMAS & JUNIOR COUGARS (30–39) ===
  {
    id: 'tessa-somm-puma',
    name: 'Tessa',
    age: 30,
    title: 'Natural-Wine Bar Owner • Newly-30 Puma',
    shortHook: 'Platinum-blonde satin camisole, candlelight wit & newly-minted 30s standards.',
    tagline:
      'Turned 30, opened her own candlelit wine bar, and immediately banned bare-mattress situationships.',
    vibeSummary:
      '30F blonde hospitality founder who pairs orange wines by candlelight and loves confident 24–27 Cubs who actually make reservations.',
    secretInsecurity:
      'Freshly 30 and pouring everything into her first business—hopes he brings calm support instead of 2 AM bar-crawl drama.',
    subplotTags: ['junior_cougar_gap', 'princess_treatment', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/tessa-30f.jpg',
    lookBadge: 'Champagne Blonde • Silk Camisole • Wine Bar',
    statusPill: 'Child-Free • Bar Founder',
    zodiac: '♊ Gemini Sun • ♎ Libra Rising',
    height: '5\'6"',
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
      'Scores indie thrillers in a sunlit loft—allergic to small talk, weak for rolled shirt sleeves.',
    vibeSummary:
      '31F composer with a French-girl blonde bob and emerald eyes who loves spontaneous overnight train/coastal trips after one great FaceTime.',
    secretInsecurity:
      'Lives in her head writing music for days—needs a grounded younger man who pulls her outside into the sun.',
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
    title: 'Farm-to-Table Pastry Chef • Puma',
    shortHook: 'Sunlit golden waves, warm dimples, sourdough mornings & meadow picnics.',
    tagline:
      'Runs a Sonoma bakery kitchen at 5 AM—melts for old-school chivalry, picnics, and retro bowling dates.',
    vibeSummary:
      '33F sunlit chef with golden-brown waves and an instant laugh. Miley-and-Maxx 6-year Junior Cougar believer who adores earnest, affectionate younger men.',
    secretInsecurity:
      'Spends all week baking wedding cakes for everyone else—secretly wants someone who plans romance purely for her.',
    subplotTags: ['junior_cougar_gap', 'princess_treatment', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/hannah-33f.jpg',
    lookBadge: 'Sunlit Honey Waves • Warm Dimples',
    statusPill: 'Wants Romance • Bakery Owner',
    zodiac: '♉ Taurus Sun • ♋ Cancer Moon',
    height: '5\'6"',
    loveLanguage: 'Sunday Picnics & Warm Brioche',
    originOrAccent: 'Sonoma Vineyard Warmth',
    signatureDrink: 'Sonoma Brut Rosé',
    interests: ['Farmers Markets', 'Meadow Picnics', 'Retro Bowling', 'Wine Country'],
  },
  {
    id: 'zoe-equestrian-puma',
    name: 'Zoe',
    age: 34,
    title: 'Equine Vet & Ranch-Glow Puma',
    shortHook: 'Golden-hour blonde, ranch boots, zero princess-fragility & cowboy weakness.',
    tagline:
      '34F large-animal vet who drives a manual truck, wears sundresses on Friday, and loves a 6-foot ranch or firefighter Cub.',
    vibeSummary:
      'Sun-kissed blonde outdoorswoman who lowered her age slider after watching city guys panic changing a flat tire.',
    secretInsecurity:
      'Tough and self-reliant all day in the field—melts when he pulls out her chair and tells her to rest.',
    subplotTags: ['montana_cowboy_slider', 'trail_leash_boss', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/zoe-34f.jpg',
    lookBadge: 'Golden-Hour Blonde • Outdoorsy Fit',
    statusPill: 'Dog & Horse Mom • Acreage',
    zodiac: '♐ Sagittarius Sun • ♌ Leo Mars',
    height: '5\'8"',
    loveLanguage: 'Bonfire Nights & Competent Hands',
    originOrAccent: 'Bozeman / Central Coast Breeze',
    signatureDrink: 'Bourbon & Ginger Twist',
    interests: ['Trail Riding', 'Country Concerts', 'Campfire Steaks', 'Golden Retrievers'],
  },
  {
    id: 'priya-surgeon-puma',
    name: 'Priya',
    age: 35,
    title: 'ER Trauma Doc • Hiking Puma',
    shortHook: 'ER physician, golden retriever Rani & sunrise canyon switchbacks.',
    tagline:
      'Runs trauma bays all week—craves a grounding trail hike with her golden retriever Rani and a Cub who cooks real food.',
    vibeSummary:
      '35F ER physician with bright hazel eyes, glossy dark hair, and zero patience for flaky "wyd" texts after a 12-hour shift. Win over Rani on the coastal ridge trail and sear cast-iron steak when her iron dips.',
    secretInsecurity:
      'Relatives ask weekly why she isn’t married to a 40-year-old cardiologist—so she needs a younger man who carries himself with unmistakable pride.',
    subplotTags: ['dog_mom_divorced', 'trail_leash_boss', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/priya-35f.jpg',
    lookBadge: 'Hazel Eyes • Canyon Hiker • Dog Mom',
    statusPill: 'Child-Free • Golden Retriever Rani',
    zodiac: '♏ Scorpio Sun • ♑ Capricorn Moon',
    height: '5\'6"',
    loveLanguage: 'Home-Cooked Steak After Shift',
    originOrAccent: 'Bay Area Med-School Polish',
    signatureDrink: 'Cardamom Old Fashioned',
    petName: 'Rani',
    galleryPhotos: [
      { label: '🏔️ Trail & Dog', url: './images/cast/priya-35f.jpg' },
      { label: '🐾 Rosé Picnic', url: './images/cast/dog-park-picnic.jpg' },
      { label: '☕ Bistro Glow', url: './images/cast/sienna-38f.jpg' },
    ],
    interests: ['Coastal Hiking', 'Golden Retrievers', 'Spiced Chai', 'Reformer Pilates', 'Travel'],
  },
  {
    id: 'maya-puma-mom',
    name: 'Maya',
    age: 36,
    title: 'Cool-Aunt Divorced Puma',
    shortHook: '$20/hr sitter on the clock—never flake or ask for Snap.',
    tagline: 'One free Friday night a month ($20/hr babysitter on the clock)—do NOT send "might rain, raincheck?"',
    vibeSummary:
      'Under 40 so officially a Puma per community law. Uses 😂 unironically, loves a Google Calendar invite, and guards her kid’s world fiercely.',
    secretInsecurity:
      'Worries one flaky cub wastes the only kid-free evening she gets all month—and whether her post-kids belly still turns heads.',
    subplotTags: ['single_mom_sitter', 'princess_treatment'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/maya-36f.jpg',
    lookBadge: 'Warm Waves • Sidewalk Café Glow',
    statusPill: '1 Kid • Sitter Ready Friday',
    zodiac: '♊ Gemini Sun • ♐ Sagittarius Moon',
    height: '5\'5"',
    loveLanguage: 'Punctuality & Calendar Invites',
    originOrAccent: 'Quick-Wit Urban Energy',
    signatureDrink: 'Spicy Margarita (Salt Rim)',
    interests: ['Patio Margaritas', 'Calendar Precision', 'Live Comedy', 'Sunday Coffees'],
  },
  {
    id: 'chloe-puma-dogmom',
    name: 'Chloé',
    age: 37,
    title: 'Child-Free Dog-Mom Puma',
    shortHook: 'Divorced, zero kids, rescue pup Barnaby—done with 42yo Peter Pans.',
    tagline:
      'Happily divorced, child-free, and done with bitter 40-something men—lowered her age slider for real effort + Barnaby’s approval.',
    vibeSummary:
      '37, sharp, zero kids, one spoiled scruffy rescue dog named Barnaby. Tried dating men her own age (38–45) and got trauma-dumped on over IPAs by guys who weaponize incompetence—now thrilled by how eager a vetted Cub can be.',
    secretInsecurity:
      'After divorcing a man-child, part of her waits for the mask to slip and expects every man to eventually treat her like his unpaid life manager.',
    subplotTags: ['dog_mom_divorced', 'jaded_peer_men', 'done_with_kids', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/chloe-37f.jpg',
    lookBadge: 'Sunlit Waves • Patio Rosé • Dog Mom',
    statusPill: 'Child-Free • Rescue Pup Barnaby',
    zodiac: '♉ Taurus Sun • ♒ Aquarius Rising',
    height: '5\'7"',
    loveLanguage: 'Winning Over Rescue Dog Barnaby',
    originOrAccent: 'Outdoorsy Dry Snark',
    signatureDrink: 'Crisp Sauvignon Blanc',
    petName: 'Barnaby',
    interests: ['Rescue Dogs', 'Patio Rosé', 'Farmers Markets', 'Zero Kids', 'Weekend Hikes'],
  },
  {
    id: 'sienna-junior-cougar',
    name: 'Sienna',
    age: 38,
    title: '6-Yr Gap "Junior Cougar"',
    shortHook: '6 years older: 2008 high-school math teases & sweet-spot chemistry.',
    tagline:
      'Under the strict 10-year Cougar cutoff—rocking a 6-year "Junior Cougar" gap with shared playlists and homeowner poise.',
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
    height: '5\'7"',
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
    shortHook: 'Honey curls, waterfall bikinis & midnight kitchen salsa tests.',
    tagline:
      '39 and thriving—owns the sexiest mezcal & vinyl room downtown and swims every waterfall lagoon from Oahu to Tulum.',
    vibeSummary:
      'On the cusp of 40 with sun-lit honey curls, infectious laugh, and unapologetic curves. Expect spontaneous beach weekends, spicy banter, and an immediate rhythm check when music comes on in the kitchen.',
    secretInsecurity:
      'Turns 40 next birthday and jokes about graduating from Puma to full Cougar—secretly melts when he plans a surprise getaway without being asked.',
    subplotTags: ['spontaneous_getaway', 'princess_treatment', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/camila-39f.jpg',
    lookBadge: 'Honey Curls • Waterfall Bikini • Mezcal',
    statusPill: 'Child-Free • Lounge Owner',
    zodiac: '♌ Leo Sun • ♓ Pisces Venus',
    height: '5\'5"',
    loveLanguage: 'Kitchen Salsa Spins & Island Flights',
    originOrAccent: 'Warm Coastal Honey Lilt',
    signatureDrink: 'Artisanal Tobalá Mezcal',
    galleryPhotos: [
      { label: '🏖️ Lagoon Bikini', url: './images/cast/camila-39f.jpg' },
      { label: '🥂 Cocktail Hour', url: './images/cast/hero-couple.jpg' },
      { label: '🐾 Park Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Waterfall Swims', 'Kitchen Dancing', 'Artisanal Mezcal', 'Beach Bikinis', 'Live Vinyl'],
  },

  // === COMPLETE EVERY-YEAR ROSTER: 40s COUGARS (40–49) ===
  {
    id: 'amber-milestone-cougar',
    name: 'Amber',
    age: 40,
    title: 'Newly-40 Jewelry Founder • Cougar',
    shortHook: 'Glamorous honey-blonde waves, 40th-birthday glow & freshly unlocked Cougar badge.',
    tagline:
      'Just celebrated her 40th in Cabo, dropped her app age filter to 26, and discovered peak second-act freedom.',
    vibeSummary:
      '40F independent jewelry founder with voluminous blonde waves, sunlit collarbones, and infectious Laguna-to-Nashville energy.',
    secretInsecurity:
      'Newly inducted into the 40+ club—thrilled when a younger man looks at her like she’s the hottest woman in the zip code.',
    subplotTags: ['montana_cowboy_slider', 'princess_treatment', 'solo_sanctuary'],
    portraitVariant: 'princess',
    photoUrl: './images/cast/amber-40f.jpg',
    lookBadge: 'Glam Blonde Waves • Newly-40 Glow',
    statusPill: 'Divorced • Cabo Ready',
    zodiac: '♈ Aries Sun • ♌ Leo Rising',
    height: '5\'8"',
    loveLanguage: 'Cabo Sunsets & Bold Compliments',
    originOrAccent: 'Laguna Beach Coastal Glamour',
    signatureDrink: 'Reposado Paloma',
    interests: ['Cabo Getaways', 'Gold Jewelry', 'Rooftop Dinners', 'Beach Walks'],
  },
  {
    id: 'nadia-booktok-cat-cougar',
    name: 'Nadia',
    age: 41,
    title: 'Cozy BookTok & Stare-Down Cat Cougar',
    shortHook: 'Cashmere introvert, spicy romantasy shelf & orange tabby Mochi.',
    tagline:
      'Publishing director who gleefully cancels club plans for Pinot Noir, 600-page spicy fantasy novels, and her judgmental orange cat Mochi.',
    vibeSummary:
      '41F witty homebody in off-shoulder knitwear with reading glasses. To enter her inner sanctum, you must pass Mochi’s unblinking headboard stare-down—and never mock her *ACOTAR* shelf.',
    secretInsecurity:
      'Wonders if a lively 26-year-old Cub will get bored of cozy rainy-Friday nights in—until he asks which chapter of her spicy book he should study.',
    subplotTags: ['black_cat_energy', 'booktok_cat_mom', 'dog_mom_divorced', 'jaded_peer_men', 'done_with_kids', 'solo_sanctuary'],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/nadia-41f.jpg',
    lookBadge: 'Reading Glasses • Cashmere • Cat Mom',
    statusPill: '🐈‍⬛ Black Cat • Orange Cat Mochi',
    zodiac: '♋ Cancer Sun • ♍ Virgo Moon',
    height: '5\'6"',
    loveLanguage: 'Quality Time & Reading Chapters Aloud',
    originOrAccent: 'Pacific Northwest Cozy Wit',
    signatureDrink: 'Willamette Pinot Noir',
    petName: 'Mochi',
    galleryPhotos: [
      { label: '📚 Cozy Glow', url: './images/cast/nadia-41f.jpg' },
      { label: '☕ Sanctuary Night', url: './images/cast/claire-45f.jpg' },
      { label: '🐾 Park Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Spicy BookTok', 'Orange Cat Mochi', 'Rainy Wine Nights', 'Co-Op Couch Games', 'Cashmere'],
  },
  {
    id: 'serena-princess-cougar',
    name: 'Serena',
    age: 43,
    title: '"Spoil-Me Princess" Cougar',
    shortHook: 'Runs teams all week—wants peonies, convertible drives & car doors on Friday.',
    tagline: 'Spent 18 years carrying everyone else’s mental load—now wants doors opened, flowers, and zero planning.',
    vibeSummary:
      'Everyone assumes an older woman wants to boss a guy around. Not Serena: she craves a chivalrous younger man who plans the reservation, pulls out her chair, and treats her like royalty.',
    secretInsecurity:
      'Wonders if asking to be pampered makes her "too high-maintenance" or if he only swiped right expecting a dominant stereotype.',
    subplotTags: ['princess_treatment', 'done_with_kids', 'solo_sanctuary'],
    portraitVariant: 'princess',
    photoUrl: './images/cast/serena-43f.jpg',
    lookBadge: 'Chestnut Waves • Convertible & Peonies',
    statusPill: 'Soft-Life Era • Homeowner',
    zodiac: '♌ Leo Sun • ♎ Libra Rising',
    height: '5\'6"',
    loveLanguage: 'Planned Reservations & Fresh Peonies',
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
      '44F international powerhouse whose accent drops an octave over red wine. Switches into breathless native-tongue endearments when you step up boldly—and roasts lukewarm effort in two languages.',
    secretInsecurity:
      'Men her own age kept calling her "intimidating" or "too passionate"—she melts for a devoted younger Cub who worships her fire without flinching.',
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
      { label: '🥂 Rooftop Spark', url: './images/cast/hero-couple.jpg' },
      { label: '🏖️ Pool & Sauna', url: './images/cast/scarlett-51f.jpg' },
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
      'Designs coastal boutique hotels—literally owns the rooftop pool and cedar sauna you’ll visit at midnight.',
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
      'Designs cliffside glass homes from Big Sur to Kyoto—minimalist black swimwear, bone-dry humor, and immaculate taste.',
    vibeSummary:
      '48F architectural principal with classic "Black Cat" slow-burn poise: takes her time, pushes back playfully when an eager Cub rushes, and makes every earned smile feel electric.',
    secretInsecurity:
      'Navigating late-40s perimenopause shifts behind calm perfectionism—deeply touched when his Golden-Retriever warmth stays steady without crowding her.',
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
      { label: '🥂 Sunset Lounge', url: './images/cast/claire-45f.jpg' },
      { label: '🐾 Park Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Ocean Lap Swims', 'Modern Architecture', 'Omakase', 'Matcha & Sancerre', 'Kyoto Travel'],
  },
  {
    id: 'monica-cello-cougar',
    name: 'Monica',
    age: 49,
    title: 'Symphony Cellist & Late-40s Siren Cougar',
    shortHook: '49 on the cusp of Jaguar status: espresso silk, concert halls & campus sushi.',
    tagline:
      'Principal cellist with velvet wrists, backstage passes, and a soft spot for bookish PhD & musician Cubs.',
    vibeSummary:
      '49F musician who performs in black silk at 8 PM and happily slips into white sneakers for midnight ramen or campus sushi afterward.',
    secretInsecurity:
      'Turning 50 in six months—delighted to discover younger men treat 49 going on 50 like an upgrade, not an expiration date.',
    subplotTags: ['done_with_kids', 'adult_children', 'solo_sanctuary'],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/monica-49f.jpg',
    lookBadge: 'Dark Waves • Concert-Hall Chic',
    statusPill: 'Empty Nester • Symphony Chair',
    zodiac: '♏ Scorpio Sun • ♓ Pisces Moon',
    height: '5\'7"',
    loveLanguage: 'Post-Concert Midnight Ramen & Touch',
    originOrAccent: 'Conservatory Warmth',
    signatureDrink: 'Warm Junmai Sake & Pinot',
    interests: ['Live Symphony', 'Omakase Sushi', 'Late-Night Walks', 'Silk Blouses'],
  },

  // === COMPLETE EVERY-YEAR ROSTER: 50s JAGUARS (50–59) ===
  {
    id: 'diana-coastal-jaguar',
    name: 'Diana',
    age: 50,
    title: 'Newly-50 Breathwork & Pilates Wellness Mommy • Jaguar',
    shortHook: 'Sunlit blonde Wellness Mommy, 50th-year Tai Chi glow, ocean swims & zero apologies.',
    tagline:
      'Hit 50 with better abs, calmer chi, better credit, and sweeter "Good boy" energy than she had at 28.',
    vibeSummary:
      '50F sunlit blonde Pilates, Qigong, and breathwork Wellness Mommy who celebrates entering her Jaguar decade with barefoot beach dinners and devoted late-20s Cubs who follow her lead.',
    secretInsecurity:
      'Friends warned her dating apps vanish at 50—instead her inbox exploded the day her 50 badge went live.',
    subplotTags: ['zero_proof_wellness', 'trail_leash_boss', 'done_with_kids', 'adult_children', 'solo_sanctuary'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/diana-50f.jpg',
    lookBadge: 'Sunlit Blonde • Newly-50 Jaguar',
    statusPill: 'Zero-Proof Wellness • Bungalow',
    zodiac: '♌ Leo Sun • ♐ Sagittarius Rising',
    height: '5\'8"',
    loveLanguage: 'Morning Ocean Swims & Eye Contact',
    originOrAccent: 'Santa Barbara Sunlit Calm',
    signatureDrink: 'Zero-Proof Botanical Spritz & Green Smoothie',
    interests: ['Ocean Swims', 'Reformer Pilates', 'Farmers Markets', 'linen Sets'],
  },
  {
    id: 'renee-creative-jaguar',
    name: 'Renée',
    age: 52,
    title: 'Saffron-Blazer Ad Agency Boss • Jaguar',
    shortHook: 'Power-blazer charisma, magnetic smile, 6 PM phone calls & rooftop jazz.',
    tagline:
      'Runs an independent creative agency—allergically opposed to passive men and endless "wyd" text chains.',
    vibeSummary:
      '52F creative founder in tailored linen blazers who loves a younger man brave enough to call her phone at 6 PM with a real reservation.',
    secretInsecurity:
      'Direct and fearless in pitch rooms—melts privately when someone takes care of her without waiting for instructions.',
    subplotTags: ['princess_treatment', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/renee-52f.jpg',
    lookBadge: 'Saffron Blazer • Radiant Smile • Founder',
    statusPill: 'Divorced • Penthouse Terrace',
    zodiac: '♈ Aries Sun • ♌ Leo Mars',
    height: '5\'9"',
    loveLanguage: '6 PM Phone Calls & Bold Courting',
    originOrAccent: 'Chicago / NYC Executive Spark',
    signatureDrink: 'Sidecar in a Chilled Coupe',
    interests: ['Jazz Lounges', 'Tailored Blazers', 'Contemporary Art', 'Weekend Flights'],
  },
  {
    id: 'valerie-jaguar-trail',
    name: 'Valerie',
    age: 53,
    title: '6 AM Ridge-Runner Jaguar',
    shortHook: 'Out-climbs 25-year-olds on canyon switchbacks & keeps him on a playful short leash.',
    tagline: 'Empty-nester Pilates & trail boss. Will out-climb a 25-year-old and keep him on a playful short leash.',
    vibeSummary:
      'Peak Gen-X confidence: hates all-day work-hour micro-texting, loves a bold 6 PM phone call, and redirects his 11 PM club stamina into steep Saturday switchbacks.',
    secretInsecurity:
      'Pretends meddling brunch friends don’t get under her skin when they whisper, "What happens when you’re 65 and he’s 40?"',
    subplotTags: ['zero_proof_wellness', 'trail_leash_boss', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/valerie-53f.jpg',
    lookBadge: 'Silver-Streaked • Blue-Grey Eyes • Trail Boss',
    statusPill: 'Empty Nester • Sub-8 Mile Pace',
    zodiac: '♐ Sagittarius Sun • ♈ Aries Mars',
    height: '5\'9"',
    loveLanguage: '6 AM Trail Pace & 6 PM Phone Calls',
    originOrAccent: 'Marin County Gen-X Direct',
    signatureDrink: 'Tart-Cherry Electrolyte Mocktail & Berry Smoothie',
    interests: ['6 AM Canyon Runs', 'Reformer Pilates', 'Red Wine', 'National Parks'],
  },
  {
    id: 'lauren-dean-jaguar',
    name: 'Lauren',
    age: 54,
    title: 'Champagne-Pixie Literary Agent • Jaguar',
    shortHook: 'Short champagne-blonde cut, designer frames, razor wit & campus sushi banter.',
    tagline:
      'Represents bestselling novelists—loves sharp banter, wire-rim glasses, and 28-year-old PhDs.',
    vibeSummary:
      '54F literary powerhouse in black blazer and statement frames. Turns dinner conversation into foreplay and adores smart younger men.',
    secretInsecurity:
      'Used to editing everyone else’s stories—loves being swept into an unscripted weekend adventure.',
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
    title: 'Golden-Curls Landscape Designer • Jaguar',
    shortHook: 'Sunlit golden curls, greenhouse sanctuary, barefoot warmth & Sunday pasta.',
    tagline:
      'Designs private coastal gardens—warmest laugh in the room, zero drama, and legendary Sunday dinners.',
    vibeSummary:
      '55F landscape architect with sunlit blonde curls, dirt-under-nails authenticity by day, and silk slip dresses by 7 PM.',
    secretInsecurity:
      'Gave twenty years to a lukewarm marriage—now refuses anything less than electric mutual adoration.',
    subplotTags: ['dog_mom_divorced', 'done_with_kids', 'adult_children', 'solo_sanctuary'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/margot-55f.jpg',
    lookBadge: 'Golden Blonde Curls • Sunlit Warmth',
    statusPill: 'Divorced • Garden Sanctuary',
    zodiac: '♋ Cancer Sun • ♉ Taurus Rising',
    height: '5\'6"',
    loveLanguage: 'Cooking Together & Slow Mornings',
    originOrAccent: 'Carmel Valley Sunlit Warmth',
    signatureDrink: 'Chilled Sancerre in the Garden',
    interests: ['Coastal Gardens', 'Handmade Pasta', 'Rescue Dogs', 'Outdoor Showers'],
  },
  {
    id: 'evelyn-mogul-jaguar',
    name: 'Evelyn',
    age: 56,
    title: 'Platinum-Blonde Film Producer • Jaguar',
    shortHook: 'Platinum blowout, gold chains, tailored suiting & hotel-bar milk-or-martini nerve.',
    tagline:
      'Greenlights feature films—pure *Babygirl* / Cannes energy for a Cub with steady eye contact.',
    vibeSummary:
      '56F platinum-blonde producer who lives in tailored black suiting and heels. Respects boldness, discretion, and a younger man who never flinches.',
    secretInsecurity:
      'Everyone pitches her all day long—she craves the one person who wants nothing from her except her company.',
    subplotTags: ['black_cat_energy', 'princess_treatment', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/evelyn-56f.jpg',
    lookBadge: 'Platinum Blonde • Tailored Blazer & Gold',
    statusPill: '🐈‍⬛ Black Cat • Beverly Hills',
    zodiac: '♏ Scorpio Sun • ♌ Leo Rising',
    height: '5\'8"',
    loveLanguage: 'Hotel-Bar Nerve & Unhurried Nights',
    originOrAccent: 'Cannes / Sunset Tower Polish',
    signatureDrink: 'Vesper Martini',
    interests: ['Hotel Bars', 'Film Festivals', 'Silk Trench Coats', 'Late-Night Jazz'],
  },
  {
    id: 'colette-bistro-jaguar',
    name: 'Colette',
    age: 57,
    title: 'Trench-Coat Wine Critic • Jaguar',
    shortHook: 'Classic blonde waves, trench-coat elegance, Paris-to-Napa palate & dry humor.',
    tagline:
      'Writes the column chefs fear—melts instantly for a humble Cub who packs a meadow picnic.',
    vibeSummary:
      '57F wine & travel writer who has dined at every three-star table on earth, so flashy money bores her; earnest effort and fresh baguette win her heart.',
    secretInsecurity:
      'Travels twenty weeks a year—loves having a devoted Cub waiting at arrivals with coffee.',
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
      'Out-energizes men her own age by 8 PM—thrilled when a 30-year-old actually keeps up all weekend.',
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
    shortHook: '59 in tailored grey wool & chic frames—one birthday shy of full Panther royalty.',
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

  // === COMPLETE EVERY-YEAR ROSTER: 60s+ PANTHERS (60–64) ===
  {
    id: 'blythe-cabaret-panther',
    name: 'Blythe',
    age: 60,
    title: 'Platinum-Pixie Theater Director • Panther',
    shortHook: 'Just turned 60: striking platinum pixie, tuxedo blazer & electric late-night wit.',
    tagline:
      'Entered her 60s directing sold-out shows and breaking necks in sharp black suiting.',
    vibeSummary:
      '60F stage director with a bold platinum pixie cut and mischievous eyes. Treats society’s double standards like comedy material and rewards confident 28–35 Cubs.',
    secretInsecurity:
      'Zero shame about 60—only checks that her Cub walks into opening-night parties proud beside her.',
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
    title: 'Fashion Director • Silver-Braids Panther',
    shortHook: 'Waist-length silver braids, Mediterranean resort swimwear & zero apologies.',
    tagline:
      'Former NYC fashion director wintering on the coast: silver braids, bronze swimwear, and magnetic presence.',
    vibeSummary:
      '61F style icon who spent thirty years shooting covers in Paris and Milan. Commands every room she enters, swims in the sea till November, and adores an attentive younger man who holds her hand across crowded piazzas.',
    secretInsecurity:
      'Fiercely protective of her joy and peace—tests early whether he has the spine to smile past public double-takes without flinching.',
    subplotTags: ['black_cat_energy', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'panther',
    photoUrl: './images/cast/vivienne-61f.jpg',
    lookBadge: 'Silver Braids • Resort Swimwear • Style Icon',
    statusPill: '🐈‍⬛ Black Cat • Coastal Villa',
    zodiac: '♌ Leo Sun • ♑ Capricorn Rising',
    height: '5\'9"',
    loveLanguage: 'Unapologetic Piazza Devotion',
    originOrAccent: 'NYC / Paris Runway Cadence',
    signatureDrink: 'Negroni Sbagliato',
    galleryPhotos: [
      { label: '🏖️ Coastal Swim', url: './images/cast/vivienne-61f.jpg' },
      { label: '🌴 Desert Pool', url: './images/cast/celeste-62f.jpg' },
      { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Mediterranean Summers', 'Runway Archives', 'Sea Swimming', 'Negronis', 'Jazz Vinyl'],
  },
  {
    id: 'helen-couture-panther',
    name: 'Helen',
    age: 63,
    title: 'Couture Collector & Salon Hostess • Panther',
    shortHook: 'Silver bob, fedora & round frames—throws the best dinner parties on the coast.',
    tagline:
      '63, wickedly funny, collects vintage convertibles and modern art, and dates purely for delight.',
    vibeSummary:
      '63F retired magazine publisher whose candlelit terrace salons mix artists, chefs, and one thoroughly smitten younger gentleman.',
    secretInsecurity:
      'Fiercely independent—melts when he brings her morning tea in bed without trying to rearrange her life.',
    subplotTags: ['princess_treatment', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'panther',
    photoUrl: './images/cast/helen-63f.jpg',
    lookBadge: 'Silver Bob • Round Frames & Fedora',
    statusPill: 'Widowed & Thriving • Art Collector',
    zodiac: '♊ Gemini Sun • ♎ Libra Rising',
    height: '5\'6"',
    loveLanguage: 'Morning Tea & Unhurried Conversation',
    originOrAccent: 'Editorial Wit & Warmth',
    signatureDrink: 'French 75',
    interests: ['Vintage Convertibles', 'Terrace Salons', 'Art Auctions', ' Silk Scarves'],
  },
  {
    id: 'beatrice-vineyard-panther',
    name: 'Beatrice',
    age: 64,
    title: 'Sunlit Vineyard Founder • Golden Panther',
    shortHook: '64, radiant blonde smile, organic hillside vineyard & pure second-act joy.',
    tagline:
      'Built an organic Pinot estate from scratch—hikes her own vineyard rows at sunrise and laughs till midnight.',
    vibeSummary:
      '64F sunlit blonde vintner who radiates warmth, vitality, and Cher-level financial independence ("Mom, I AM a rich man"). Loves an active, affectionate Cub who enjoys harvest dinners under string lights.',
    secretInsecurity:
      'Grown kids are protective of her estate—so she respects a Cub who insists on paying his own way from Day 1.',
    subplotTags: ['trail_leash_boss', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'panther',
    photoUrl: './images/cast/beatrice-64f.jpg',
    lookBadge: 'Sunlit Blonde • Vineyard Founder • 64F Glow',
    statusPill: 'Kids Grown • Vineyard Estate',
    zodiac: '♉ Taurus Sun • ♌ Leo Moon',
    height: '5\'7"',
    loveLanguage: 'Harvest Dinners & Vineyard Walks',
    originOrAccent: 'Napa Hillside Warmth',
    signatureDrink: 'Estate Reserve Pinot Noir',
    interests: ['Vineyard Hikes', 'Harvest Tables', 'Golden Retrievers', 'Acoustic Guitar'],
  },
];

/**
 * 17 Distinct Cub Profiles — Covering EVERY SINGLE YEAR from 21 to 33!
 * Includes Green-Flag Gentlemen, the 25M Montana Ranch Cowboy (Kristin Cavallari × Montana Boyz
 * age-slider inspiration), and the 21M Broke College Dutch-Splitter red-flag obstacle!
 */
export const HIS_ARCHETYPES: HisArchetype[] = [
  {
    id: 'leo-golden-cub',
    name: 'Leo',
    age: 25,
    title: 'Golden-Retriever Houseboy Cub',
    shortHook: 'Pure Golden-Retriever energy—10x more obsessed when a cool Black Cat woman pushes back!',
    tagline:
      'Beaming Golden-Retriever devotion: the more she takes her time and pushes back at first, the wider he grins.',
    vibeSummary:
      'Gen-Z emotional fluency meets sunny Golden-Retriever warmth. Bored by instant-gratification chaos—he goes weak in the knees for a selective "Black Cat" older woman who paces him, teases his eagerness, and makes every smile feel earned.',
    secretInsecurity:
      'Driving home wondering: "Did she push back tonight because she’s testing my patience—or am I moving too fast?" (Spoiler: she loved every second.)',
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
    shortHook: 'Inspired by Kristin Cavallari & Montana Boyz—accidentally DMed "I love you" from the group TikTok!',
    tagline:
      '6\'3" former small-college wide receiver raised on a Montana cattle ranch: Stetson hat, country-boy manners, and zero fear of public headlines.',
    vibeSummary:
      'The exact reason thousands of 37–48 women lowered their age slider! Accidentally commented "I love you" from his buddies’ shared ranch account before sliding in properly, flies out on 12 hours’ notice, and carries both suitcases in one hand.',
    secretInsecurity:
      'Every comment section yells "He’s 25 from Montana!!"—so he proves with steady actions, yes-ma’am chivalry, and ranch-hand grit that he isn’t chasing clout.',
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
      { label: '🏖️ Cabo Sun', url: './images/cast/lucas-30m.jpg' },
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
      'Joined Anthropic early, quietly vested at 28, zero tech-bro flash—exclusively courts accomplished women 38–60.',
    tagline:
      'Early frontier-AI safety researcher with vested equity, oatmeal cashmere, and zero patience for 23-year-old clout chasers.',
    vibeSummary:
      'Joined Anthropic in the early pre-hype days and quietly hit financial independence before 28. Allergic to crypto/Lambo flexing and exhausted by 23-year-olds asking about his cap table on Date #1—he melts for a self-made Cougar with her own career, sharp wit, and calm presence who lets him power down his brain at 8 PM and cook her brown-butter halibut.',
    secretInsecurity:
      'Never mentions his early equity until Date #4 so he knows you actually like HIM—and privately hopes you won’t lump him in with awkward podcast tech bros.',
    subplotTags: [
      'frontier_ai_cub',
      'golden_retriever_energy',
      'princess_treatment',
      'spontaneous_getaway',
      'houseboy_eager',
    ],
    portraitVariant: 'architect',
    photoUrl: './images/cast/kieran-28m.jpg',
    lookBadge: 'Oatmeal Cashmere • Vintage Watch • Early AI',
    statusPill: '🧠 Early Anthropic • Quietly Vested',
    zodiac: '♍ Virgo Sun • ♉ Taurus Rising',
    height: '6\'1"',
    loveLanguage: 'Quiet Generosity, Zero Tech Talk & Home Cooking',
    originOrAccent: 'Calm West-Village / Pac-Heights Warmth',
    signatureDrink: 'Oat Cortado & Burgundy Pinot',
    galleryPhotos: [
      { label: '☕ Morning Cortado', url: './images/cast/kieran-28m.jpg' },
      { label: '🍝 Kitchen Prep', url: './images/cast/leo-25m.jpg' },
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
    title: '🚩 Broke College "Go-Dutch" Red-Flag Cub',
    shortHook: 'Campus hoodie, $14 checking balance & pulls out iPhone calculator to Venmo-request $41.63!',
    tagline:
      '🚨 DANGER-ZONE OBSTACLE MODE: What happens when you drag your age slider all the way down to 21!',
    vibeSummary:
      '21M undergrad in a faded campus hoodie who begs to take you out for sushi, orders two dragon rolls + sake for himself, tries to swipe his university Dining-Dollars card off-campus, and then itemizes half the edamame to the penny on Venmo!',
    secretInsecurity:
      'Has three roommates eating cereal out of mixing bowls at home and genuinely thinks "going 50/50 down to $0.38 tax" is peak modern equality.',
    subplotTags: ['broke_dutch_obstacle', 'income_gap'],
    portraitVariant: 'trail',
    photoUrl: './images/cast/kayden-21m.jpg',
    lookBadge: '🚩 Campus Hoodie • Venmo Calculator Trap',
    statusPill: '3 Roommates • Goes Dutch to $0.38',
    zodiac: '♊ Gemini Sun • ♓ Pisces Moon',
    height: '5\'9"',
    loveLanguage: 'Sending Itemized Venmo Requests',
    originOrAccent: 'Dorm-Hall Energy-Drink Cadence',
    signatureDrink: 'Happy-Hour Well Shot (Split)',
    interests: ['Going Dutch', 'Campus Dining Dollars', '3 AM Valorant', 'Splitting Appetizers'],
  },
  {
    id: 'miles-millennial-cub',
    name: 'Miles',
    age: 32,
    title: 'Rooftop Architect Cub',
    shortHook: '32yo architect who exclusively dates Cougars & Jaguars 45+.',
    tagline: '30s architect who solely dates Jaguars & Cougars 45+—fluent in wine lists and emotional availability.',
    vibeSummary:
      'Proof that 30+ men are top-tier Cubs when paired with a 45–64 Cougar/Jaguar/Panther. Zero roommate drama, maximum princess-treatment game.',
    secretInsecurity:
      'Wonders if her adult kids (nearly his age) will treat Sunday brunch like a hostile deposition.',
    subplotTags: ['princess_treatment', 'adult_children'],
    portraitVariant: 'architect',
    photoUrl: './images/cast/miles-32m.jpg',
    lookBadge: 'Tailored Navy Blazer • Brown Eyes',
    statusPill: 'Loft Owner • Zero Roommates',
    zodiac: '♑ Capricorn Sun • ♎ Libra Rising',
    height: '6\'2"',
    loveLanguage: 'Curated Weekend Itineraries',
    originOrAccent: 'Architectural Lounge Smooth',
    signatureDrink: 'Pinot Noir & Cortado',
    galleryPhotos: [
      { label: '🍸 Rooftop Blazer', url: './images/cast/miles-32m.jpg' },
      { label: '🍝 Linen Apron', url: './images/cast/leo-25m.jpg' },
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
    subplotTags: ['golden_retriever_energy', 'houseboy_eager', 'princess_treatment', 'trail_leash_boss'],
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
      { label: '🍝 Kitchen Prep', url: './images/cast/leo-25m.jpg' },
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
      'Doesn’t wear corporate suits or talk tech jargon—hopes real craftsmanship and steady hands beat finance-bro flash.',
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
      { label: '🍸 Evening Out', url: './images/cast/miles-32m.jpg' },
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
      'People assume a blonde swimmer in California is a casual beach boy—so he goes all-in proving his long-term loyalty.',
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
      { label: '🏔️ Ridge Run', url: './images/cast/mateo-26m.jpg' },
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
      'Spent 5 years in a neuroscience lab while his peers partied—just got his PhD hooded, packed on a sleeper gym build, and is ready to court an extraordinary woman.',
    vibeSummary:
      '27M newly minted PhD with glasses, broad swimmer/lifter shoulders under tweed jackets, and a huge soft spot for worldly, accented older women. Plans autumn campus strolls + omakase sushi with cheeky "Professor & Grad Student" banter.',
    secretInsecurity:
      'Spent his whole 20s buried in research papers—secretly thrilled when a radiant Cougar dresses down in sneakers to meet him on the quad.',
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
      { label: '🧗‍♂️ Sleeper Build', url: './images/cast/jin-25m.jpg' },
      { label: '🍝 Chef Mode', url: './images/cast/leo-25m.jpg' },
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
      'Knows 22 makes her raise an eyebrow at first—so he shows up ten minutes early with flowers every single time.',
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
      '23M editorial portrait photographer who prefers quiet jazz bars and art bookstores over loud clubs—and makes her feel like cinema.',
    secretInsecurity:
      'Building his freelance studio from the ground up—wins hearts with unforgettable 35mm film walks and gallery nights.',
    subplotTags: ['modest_accent_gentleman', 'spontaneous_getaway'],
    portraitVariant: 'oldsoul',
    photoUrl: './images/cast/devon-23m.jpg',
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
      'Sous-chef by night, granite boulderer by morning—elite knife skills, SPF 50 glow, and spotless counters.',
    vibeSummary:
      '24M fine-dining sous-chef with a minimalist geometric forearm tattoo, toned climber shoulders, and better skincare habits than most dermatologists. Cooks midnight brown-butter scallops from scratch.',
    secretInsecurity:
      'Quietly wonders if working restaurant hours clashes with her 9-to-5—so he guards every Sunday off exclusively for her.',
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
      { label: '🍝 Chef Apron', url: './images/cast/leo-25m.jpg' },
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
    tagline: 'Bragged about his sub-7 mile pace—ready to test it on her 6 AM ridge loop.',
    vibeSummary:
      'Doctor of Physical Therapy, magnetic smile, active mornings. Suppresses group-chat slang effortlessly when meeting her 45-year-old friends.',
    secretInsecurity:
      'Worries his early-career salary looks small next to her corner office—hoping effort and devotion count more than Four Seasons money.',
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
      'Self-made master electrician with old-world manners and a warm accent—zero trust-fund flash, 100% pride in sweeping a woman off her feet.',
    vibeSummary:
      '26M master electrician & craftsman. Owns immaculately ironed white linen shirts, opens every door automatically, and proves a hand-packed meadow picnic + neon bowling night beats lazy luxury flash.',
    secretInsecurity:
      'Knows her handbag costs more than his first car—so he pours unmatched chivalry and handmade cooking into every date.',
    subplotTags: ['modest_accent_gentleman', 'loves_foreign_women', 'princess_treatment', 'houseboy_eager', 'income_gap'],
    portraitVariant: 'golden',
    photoUrl: './images/cast/mateo-26m.jpg',
    lookBadge: 'Warm Accent • Ironed Linen • Chivalry',
    statusPill: 'Master Tradesman • Old-World Manners',
    zodiac: '♉ Taurus Sun • ♌ Leo Moon',
    height: '6\'0"',
    loveLanguage: 'Acts of Devotion & Handmade Dates',
    originOrAccent: 'Warm Coastal Romance Accent',
    signatureDrink: 'Espresso & Chilled Picnic Rosé',
    galleryPhotos: [
      { label: '🧺 Park Picnic', url: './images/cast/dog-park-picnic.jpg' },
      { label: '☀️ Golden Hour', url: './images/cast/mateo-26m.jpg' },
      { label: '🍝 Family Recipe', url: './images/cast/leo-25m.jpg' },
    ],
    interests: ['Meadow Picnics', 'Retro Neon Bowling', 'Family Pasta Recipes', 'Fixing Anything', 'Slow Dancing'],
  },
  {
    id: 'julian-oldsoul-cub',
    name: 'Julian',
    age: 27,
    title: 'Old-Soul Gentleman Engineer Cub',
    shortHook: 'Brings peonies, opens car doors & books 7:30 reservations before Wednesday.',
    tagline: 'Opens every car door and refuses to split tapas—but still pictures being a dad someday.',
    vibeSummary:
      'Listens to 90s R&B and Sade, owns a solid oak bedframe and lidded bathroom trash can, and falls hard and fast—setting up the classic timeline conversation.',
    secretInsecurity:
      'Terrified she’ll dismiss him as "too young to know what he wants" before he proves he’s serious about committing.',
    subplotTags: ['wants_kids_someday', 'princess_treatment'],
    portraitVariant: 'oldsoul',
    photoUrl: './images/cast/julian-27m.jpg',
    lookBadge: 'Deep Hazel Eyes • Pressed Linen • 6\'0"',
    statusPill: 'Structural Engineer • Wants Family',
    zodiac: '♎ Libra Sun • ♋ Cancer Venus',
    height: '6\'0"',
    loveLanguage: 'Car Doors, Peonies & Old-School Romance',
    originOrAccent: 'Rich Baritone Old-Soul',
    signatureDrink: 'Manhattan on a Big Rock',
    interests: ['Architecture', 'Sade & Vinyl', 'Wine Bars', 'Coastal Drives'],
  },
  {
    id: 'gavin-pilot-cub',
    name: 'Gavin',
    age: 29,
    title: 'Charter Pilot & Weekend Getaway Cub',
    shortHook: '29M aviator calm, golden-hour stubble, spontaneous 18-hour island hops.',
    tagline:
      'Last year of his 20s—flies coastal charters by day and whisks Cougars away for rooftop-and-sauna weekends.',
    vibeSummary:
      '29M commercial charter captain with calm cockpit voice, pressed henleys, and zero 20s flakiness.',
    secretInsecurity:
      'Away two nights a week flying—makes sure she feels like the center of his universe every hour he’s home.',
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
      '31M wine director who exclusively dates women 37–62 because conversation, confidence, and palate actually match.',
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
    shortHook: '33M silver-fox-in-training who exclusively courts 45–64 Cougars, Jaguars & Panthers.',
    tagline:
      'Zero roommates, zero games, 6\'2" in tailored wool—built specifically for powerhouse women in their 40s, 50s, and 60s.',
    vibeSummary:
      '33M surgical fellow who finds women under 40 exhausting and lights up across candlelit tables with accomplished Cougars and Jaguars.',
    secretInsecurity:
      'Long surgical fellowship hours—treats every Sunday together like a sacred phone-off retreat.',
    subplotTags: ['princess_treatment', 'adult_children', 'spontaneous_getaway'],
    portraitVariant: 'architect',
    photoUrl: './images/cast/grant-33m.jpg',
    lookBadge: 'Tailored Collar • Dark Eyes • 6\'2"',
    statusPill: 'MD Fellow • Dates 43–64 Only',
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
    ageRange: 'Ages 22–29',
    category: 'feline_scale',
    headline: 'Pre-Puma Apprentice',
    insiderLore:
      'Too young for official community Cougar status, though occasionally dates slightly younger guys while studying the ways of the Den.',
    signatureTell: 'Still figuring out her own lease renewal.',
  },
  {
    id: 'junior_cougar',
    label: 'Junior Cougar',
    ageRange: '5–9 Year Age Gap (e.g. 6 Yrs)',
    category: 'feline_scale',
    headline: 'The Sub-10-Year Sweet-Spot Contender',
    insiderLore:
      'Under strict 10-year Cougar law, a 5-to-9 year gap earns the cheeky "Junior Cougar" badge! Close enough to share pop-culture overlap, far enough apart that she was ordering martinis while he was in high-school geometry.',
    signatureTell: 'Calculates where you both were in 2008 within twenty minutes of Date #1.',
  },
  {
    id: 'puma',
    label: 'Puma',
    ageRange: 'Ages 30–39',
    category: 'feline_scale',
    headline: 'Official Under-40 Age-Gap Contender',
    insiderLore:
      'Per Cougars & Cubs Club law: a woman under 40 dating a younger man is a Puma, not yet a Cougar! Often an Elder Millennial allergic to Snapchat streaks.',
    signatureTell: 'Uses 😂 unironically and panics if you call without texting first.',
  },
  {
    id: 'cougar',
    label: 'Cougar',
    ageRange: 'Ages 40–49 (10+ Yr Gap)',
    category: 'feline_scale',
    headline: 'The Benchmark Standard of The Cougar Den',
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
      'Kids are grown, fitness is dialed in, zero patience left for societal side-eyes. Expect 6 AM trail runs and razor-sharp Gen-X banter.',
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
    headline: 'Sunny, Unbothered & Magnetically Drawn to "Black Cat" Cougars',
    insiderLore:
      'High-EQ, tail-wagging warmth paired with grown-up chivalry. Secret tell: he is 10x MORE attracted when an older woman has cool "Black Cat" energy—taking her time, teasing him, and pushing back a little at first instead of fawning.',
    signatureTell: 'When she says "Slow down, eager puppy," he grins ear-to-ear instead of sulking.',
  },
  {
    id: 'qigong_mommy_domme_lore',
    label: '🧘‍♀️ Wellness Mommy & Soft Mommy-Domme',
    ageRange: 'Serene Command • Ages 38–60+',
    category: 'crossover_lore',
    headline: 'Qigong, Tai Chi Grounding & Consensual "Good Boy" Praise (Never an ATM!)',
    insiderLore:
      'The ultimate nervous-system magnet: a radiant Qigong, Tai Chi, or Pilates Wellness Mommy who slows an anxious 26-year-old’s racing heart with two fingers under his chin and calm Mommy-Domme command ("Drop your shoulders and breathe with Mommy"). Rule #1 still holds: Mommy-Domme means romantic authority & praise—NEVER paying a freeloader’s rent!',
    signatureTell: 'Fixes his posture in 3 seconds flat and makes him forget every podcast he was about to Cubsplain.',
  },
  {
    id: 'health_nut_bernedoodle_mommy',
    label: '🥑🐶 Health-Nut Mommy (GF, Seed-Oil-Free & Mini Bernedoodle)',
    ageRange: 'Clean-Living Royalty • Ages 35–55+',
    category: 'crossover_lore',
    headline: 'Grass-Fed Ghee, Zero Canola/Gluten & Moving Up the Tricolor Mini Bernedoodle Waitlist',
    insiderLore:
      'Cooks strictly in grass-fed tallow, ghee & cold-pressed extra-virgin olive oil, spots hidden soybean oil or gluten from across the dining room, and checks breeder updates twice a day as she climbs to #1 on the waitlist for a tricolor Mini Bernedoodle puppy. Top-1% Cubs call the chef at 4 PM to confirm butter/olive-oil prep and puppy-proof their apartment baseboards in advance.',
    signatureTell: 'Whispers "Good boy" the second he swaps canola oil for grass-fed ghee and buys a puppy chew toy.',
  },
  {
    id: 'cubsplaining_lore',
    label: '🤓 "Cubsplaining"',
    ageRange: 'Rookie Cub Fumble #1',
    category: 'cub_taxonomy',
    headline: 'Explaining Mortgages, Vinyl, or Qigong to a Woman Who Mastered Them in 2006',
    insiderLore:
      'The hilarious moment an eager 24-to-29-year-old launches into a 10-minute lecture on Fleetwood Mac pressings, Roth IRAs, or breathwork to an accomplished homeowner Cougar. Smart Cubs catch themselves mid-sentence, laugh, and let Mommy school them instead.',
    signatureTell: 'Starts a sentence with "Well actually, the way Nervous System Regulation works is..."',
  },
  {
    id: 'black_cat_golden_retriever',
    label: '🐈‍⬛ Black Cat Cougar × 🐕 Golden Retriever Cub',
    ageRange: 'The #1 Polarity in The Cougar Den',
    category: 'crossover_lore',
    headline: 'She Takes Her Time & Pushes Back; He Lives to Earn Every Smile',
    insiderLore:
      'Peer men often get defensive when a self-possessed older woman won’t rush or stroke their ego on Date #1. A true Golden Retriever Cub finds her cool, selective Black Cat pushback intoxicating—matching her unhurried boundaries with steady sunshine until she finally chooses his lap.',
    signatureTell: 'Publicly she gives him cool side-eye; privately she curls up in his hoodie on Sunday.',
  },
  {
    id: 'dm_goblin',
    label: 'The "hey" / Broke Dutch Goblin',
    ageRange: 'Blocked Immediately',
    category: 'cub_taxonomy',
    headline: 'Cautionary Club Specimen',
    insiderLore:
      'Either opens with "hey mommy" + purple LED Tito’s selfies OR invites you out on a campus meal plan and pulls out a calculator to Venmo-request $41.63.',
    signatureTell: 'Asks for your Snapchat or itemizes half the edamame.',
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
      'Slang cousins in the broader age-gap ecosystem (Panther = under-40 male counterpart; Mountain Lion / Silver Fox = 40+ male counterpart).',
    signatureTell: 'Gets zero side-eyes from society—highlighting the double standard Cougars laugh past.',
  },
  {
    id: 'pop_kristin_montana',
    label: 'Kristin Cavallari & Mark Estes (Montana Boyz)',
    ageRange: '13-Yr Gap • Age-Slider Catalyst',
    category: 'pop_culture',
    headline: 'The Viral Cowboy Story That Made Everyone Lower Their Age Filter',
    insiderLore:
      '24-year-old Montana cowboy Mark Estes accidentally DMed Kristin Cavallari (37) "I love you" from the shared Montana Boyz TikTok before sliding in from his own account—inspiring thousands of women to move their app age slider down and give Cubs a real shot!',
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
      'Welcomed their baby girl together in 2026—living proof alongside Sienna Miller that late-30s/40s women and devoted late-20s Cubs write their own family rules.',
    signatureTell: 'Cozy London strolls, quiet devotion, and zero tabloid noise.',
  },
  {
    id: 'pop_miley_maxx',
    label: 'Miley Cyrus & Maxx Morando',
    ageRange: '6-Yr "Junior Cougar" Newlyweds',
    category: 'pop_culture',
    headline: 'Patron Saints of the 6-Year Junior Cougar Track',
    insiderLore:
      'Six years apart (33F × 27M drummer/producer) and officially married in an intimate Palm Springs wedding—proving the sub-10-year Junior Cougar sweet spot is pure rockstar gold.',
    signatureTell: 'Shared studio sessions, zero ego competition, and Palm Springs vows.',
  },
  {
    id: 'pop_cub_grooming_joke',
    label: '"Cub Grooming" vs. The ATJ Discourse',
    ageRange: '25+ Prefrontal Rule Only!',
    category: 'pop_culture',
    headline: 'Beard Oil & Tailoring—Never Creepy Power Gaps',
    insiderLore:
      'Whenever an adult Cub dates a Cougar, TikTok brings up Sam & Aaron Taylor-Johnson. Cougar Den Law: prefrontal cortexes must be 25+ baked—the ONLY "grooming" here is upgrading his beard oil, SPF 50, and linen shirts!',
    signatureTell: 'His 5-in-1 neon-blue shower gel mysteriously vanishes after Weekend #2.',
  },
  {
    id: 'pop_cougar_town',
    label: '"Cougar Town" & Jules Cobb’s Big Carl',
    ageRange: '2009–2015 Sitcom Royalty',
    category: 'pop_culture',
    headline: 'Giant Wine Glasses, Florida Sunshine & Post-Divorce Joy',
    insiderLore:
      'Courteney Cox’s beloved sitcom started as a 40s post-divorce dating comedy before evolving into the ultimate Cul-de-Sac hangout—immortalizing "Big Carl" (her bathtub-sized red wine glass), Penny Can, and shameless 40s fun.',
    signatureTell: 'Pours half a bottle of Cabernet into one glass and calls it "just one glass."',
  },
];

export function getProfileDetails(profile: HerArchetype | HisArchetype) {
  return {
    zodiac: profile.zodiac ?? '♏ Scorpio Sun • ♌ Leo Rising',
    height: profile.height ?? '5\'8"',
    loveLanguage: profile.loveLanguage ?? 'Intentional Effort & Touch',
    originOrAccent: profile.originOrAccent ?? 'Cosmopolitan Charm',
    signatureDrink: profile.signatureDrink ?? 'Espresso Martini',
    statusPill: profile.statusPill ?? 'Solo Sanctuary',
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
  const zodiacSpark = `${herSign} × ${hisSign} — High-voltage astrological magnetism (${herDetails.loveLanguage.split('&')[0].trim()} meets ${hisDetails.loveLanguage.split('&')[0].trim()})`;

  const hasBlackCat = her.subplotTags.includes('black_cat_energy');
  const hasGolden = his.subplotTags.includes('golden_retriever_energy');
  const energyPolarity =
    hasBlackCat && hasGolden
      ? `🐈‍⬛ Black Cat ${TIER_LABELS[felineTier]} × 🐕 Golden Retriever Cub — She takes her time & pushes back at first; he beams brighter earning every inch of her warmth!`
      : hasBlackCat
        ? `🐈‍⬛ Black Cat Energy Active — Unhurried, selective & pushes back on rushed effort`
        : hasGolden
          ? `🐕 Golden Retriever Cub Active — Sunny, unbothered devotion & zero ego games`
          : undefined;

  let codeSwitchTip: string;
  if (herGeneration === 'gen_z') {
    codeSwitchTip =
      'Lynx Peer Alert: Same generational slang fluency, so skip the excuses and stand out with real reservation effort and emotional follow-through.';
  } else if (ageGap > 0 && ageGap < 10) {
    codeSwitchTip =
      'Junior Cougar Alert: You share 80% of the same cultural references—lean into playful 2008 age-math banter and match her homeowner-era intentionality!';
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

  let trackTitle: string;
  if (his.subplotTags.includes('broke_dutch_obstacle')) {
    trackTitle = `${ageGap}-Year Sub-23 Danger-Zone Run: Broke College Dutch-Splitter, 3-Roommate Kitchen & Venmo Horror`;
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
