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
  | 'income_gap';

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

export const HER_ARCHETYPES: HerArchetype[] = [
  {
    id: 'claire-cougar-exec',
    name: 'Claire',
    age: 45,
    title: 'VP of Product • Cougar',
    shortHook: 'Mortgage paid, kids grown, zero sugar-mama tolerance.',
    tagline: 'Mortgage paid, tubes tied, peaceful West Elm sanctuary—zero need for a sugar baby.',
    vibeSummary:
      'Raised two kids, divorced amicably, runs a 40-person team. Loves youthful energy, clean sheets, and a cub who handles the check without bruised pride.',
    secretInsecurity:
      'Catches harsh bathroom vanity lighting and wonders if softer skin or fine lines will bother him next to 24-year-olds.',
    subplotTags: ['done_with_kids', 'solo_sanctuary', 'adult_children', 'income_gap'],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/claire-45f.jpg',
  },
  {
    id: 'serena-princess-cougar',
    name: 'Serena',
    age: 43,
    title: '"Spoil-Me Princess" Cougar',
    shortHook: 'Runs teams all week—wants peonies & car doors on Friday.',
    tagline: 'Spent 18 years carrying everyone else’s mental load—now wants doors opened, flowers, and zero planning.',
    vibeSummary:
      'Everyone assumes an older woman wants to boss a guy around. Not Serena: she craves a chivalrous younger man who plans the reservation, pulls out her chair, and treats her like royalty.',
    secretInsecurity:
      'Wonders if asking to be pampered makes her "too high-maintenance" or if he only swiped right expecting a dominant mommy stereotype.',
    subplotTags: ['princess_treatment', 'done_with_kids', 'solo_sanctuary'],
    portraitVariant: 'princess',
    photoUrl: './images/cast/serena-43f.jpg',
  },
  {
    id: 'maya-puma-mom',
    name: 'Maya',
    age: 36,
    title: 'Cool-Aunt Divorced Puma',
    shortHook: '$20/hr sitter on the clock—never flake or ask for Snap.',
    tagline: 'One free Friday night a month ($20/hr babysitter on the clock)—do NOT send "might rain, raincheck?"',
    vibeSummary:
      'Under 40 so officially a Puma per subreddit law. Uses 😂 unironically, loves a Google Calendar invite, and guards her kid’s world fiercely.',
    secretInsecurity:
      'Worries one flaky cub wastes the only kid-free evening she gets all month—and whether her post-kids belly still turns heads.',
    subplotTags: ['single_mom_sitter', 'princess_treatment'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/maya-36f.jpg',
  },
  {
    id: 'chloe-puma-dogmom',
    name: 'Chloé',
    age: 37,
    title: 'Child-Free Dog-Mom Puma',
    shortHook: 'Divorced, zero kids, rescue pup Barnaby—done with 42yo Peter Pans.',
    tagline:
      'Happily divorced, child-free, and slightly jaded by bitter 40-something men—lowered her age slider only for real effort + Barnaby’s approval.',
    vibeSummary:
      '37, sharp, zero kids, one spoiled scruffy rescue dog named Barnaby. Tried dating men her own age (38–45) and got trauma-dumped on over IPAs by guys who weaponize incompetence—now pleasantly shocked by how eager and emotionally present a vetted Cub can be.',
    secretInsecurity:
      'After divorcing a man-child and surviving bleak peer dates, part of her waits for the mask to slip and expects every man to eventually treat her like his unpaid life manager.',
    subplotTags: ['dog_mom_divorced', 'jaded_peer_men', 'done_with_kids', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/chloe-37f.jpg',
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
      'Wonders if a 6-year clock offset still stings when she’s ready for intentional milestones now and his peer group is still recovering from chaotic groomsmen summers.',
    subplotTags: ['junior_cougar_gap', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/sienna-38f.jpg',
  },
  {
    id: 'valerie-jaguar-trail',
    name: 'Valerie',
    age: 53,
    title: '6 AM Ridge-Runner Jaguar',
    shortHook: 'Out-climbs 25-year-olds & keeps him on a short leash.',
    tagline: 'Empty-nester Pilates & trail boss. Will out-climb a 25-year-old and keep him on a playful short leash.',
    vibeSummary:
      'Peak Gen-X confidence: hates all-day work-hour micro-texting, loves a bold 6 PM phone call, and redirects his 11 PM club stamina into steep Saturday switchbacks.',
    secretInsecurity:
      'Pretends meddling brunch friends don’t get under her skin when they whisper, "What happens when you’re 65 and he’s 40?"',
    subplotTags: ['trail_leash_boss', 'done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/valerie-53f.jpg',
  },
  {
    id: 'celeste-panther-icon',
    name: 'Celeste',
    age: 62,
    title: 'Palm Springs Panther Icon',
    shortHook: 'Silver-screen poise, desert pool & unapologetic romance.',
    tagline: 'Unapologetic silver-screen magnet. Zero tolerance for Snapchat, 100% appreciation for eager devotion.',
    vibeSummary:
      'Owns an architectural desert home, collects vinyl, and delights in mentoring an emotionally literate younger man who holds her hand in public with pride.',
    secretInsecurity:
      'Wonders in quiet moments if silver strands or aging timelines scare him—right while he can barely breathe looking at her.',
    subplotTags: ['done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'panther',
    photoUrl: './images/cast/celeste-62f.jpg',
    lookBadge: 'Platinum Silver • Sea-Green Eyes',
    galleryPhotos: [
      { label: '🏖️ Desert Pool', url: './images/cast/celeste-62f.jpg' },
      { label: '🥂 Sunset Terrace', url: './images/cast/hero-couple.jpg' },
      { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Palm Springs Pools', 'Vinyl Jazz', 'Dry Martinis', 'Modern Art', 'Silk Kaftans'],
  },
  {
    id: 'priya-surgeon-puma',
    name: 'Priya',
    age: 35,
    title: 'ER Trauma Doc • Hiking Puma',
    shortHook: 'South Asian MD, golden retriever Rani & canyon switchbacks.',
    tagline:
      'Runs trauma bays all week—craves a grounding trail hike with her golden retriever Rani and a Cub who cooks real food.',
    vibeSummary:
      '35F Indian-American ER physician with bright hazel-brown eyes, glossy raven hair, and zero patience for flaky "wyd" texts after a 12-hour hospital shift. Win over her golden retriever Rani on the coastal ridge trail and sear cast-iron steak when her iron dips.',
    secretInsecurity:
      'Her traditional aunties ask weekly why she isn’t married to a 39-year-old cardiologist—so she needs a younger man who carries himself with unmistakable pride.',
    subplotTags: ['dog_mom_divorced', 'trail_leash_boss', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/priya-35f.jpg',
    lookBadge: 'South Asian • Hazel Eyes • Raven Hair',
    galleryPhotos: [
      { label: '🏔️ Trail & Dog', url: './images/cast/priya-35f.jpg' },
      { label: '🐾 Rosé Picnic', url: './images/cast/dog-park-picnic.jpg' },
      { label: '☕ Bistro Glow', url: './images/cast/sienna-38f.jpg' },
    ],
    interests: ['Coastal Hiking', 'Golden Retrievers', 'Spicy Chai', ' Pilates', 'Travel'],
  },
  {
    id: 'camila-lagoon-puma',
    name: 'Camila',
    age: 39,
    title: 'Mezcal Lounge Owner • Puma',
    shortHook: 'Latina honey curls, waterfall bikinis & two-left-feet salsa tests.',
    tagline:
      '39 and thriving—owns the sexiest mezcal & vinyl room downtown and swims every waterfall lagoon from Oaxaca to Maui.',
    vibeSummary:
      'Sun-kissed Afro-Latina Puma on the cusp of 40 with honey-highlighted curls, infectious laugh, and unapologetic curves. Expect spontaneous beach weekends, spicy banter, and an immediate rhythm check when salsa comes on in the kitchen.',
    secretInsecurity:
      'Turns 40 next birthday and jokes about graduating from Puma to full Cougar—secretly melted when he plans a surprise getaway without being asked.',
    subplotTags: ['princess_treatment', 'solo_sanctuary'],
    portraitVariant: 'puma',
    photoUrl: './images/cast/camila-39f.jpg',
    lookBadge: 'Latina • Honey Curls • Warm Brown Eyes',
    galleryPhotos: [
      { label: '🏖️ Lagoon Bikini', url: './images/cast/camila-39f.jpg' },
      { label: '🥂 Cocktail Hour', url: './images/cast/hero-couple.jpg' },
      { label: '🐾 Park Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Waterfall Swims', 'Salsa Dancing', 'Artisanal Mezcal', 'Beach Bikinis', 'Live Vinyl'],
  },
  {
    id: 'astrid-blonde-cougar',
    name: 'Astrid',
    age: 41,
    title: 'Malibu Surfer & Biotech Cougar',
    shortHook: 'Golden blonde, ice-blue eyes, dawn-patrol surf & sauna.',
    tagline:
      'Scandinavian-Californian biotech founder: golden blonde, piercing ice-blue eyes, 6:30 AM Malibu surf & Nordic cold-plunge grit.',
    vibeSummary:
      'Sold her first diagnostics startup at 39 and moved five minutes from the Malibu point break. Lives in sporty bikinis, salt air, and linen button-downs—and loves watching a fit Cub try to pop up on a longboard.',
    secretInsecurity:
      'Spent a decade in lab coats out-working everyone; still learning how to let a devoted younger partner take care of *her* on Sunday.',
    subplotTags: ['trail_leash_boss', 'done_with_kids', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/astrid-41f.jpg',
    lookBadge: 'Blonde • Ice-Blue Eyes • Surfer Fit',
    galleryPhotos: [
      { label: '🏄‍♀️ Surf Bikini', url: './images/cast/astrid-41f.jpg' },
      { label: '🏔️ Ridge Trail', url: './images/cast/valerie-53f.jpg' },
      { label: '🐾 Dog Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Dawn Surfing', 'Cold Plunge & Sauna', 'Ocean Bikinis', 'Clean Wine', ' Nordic Design'],
  },
  {
    id: 'simone-auntie-cougar',
    name: 'Simone',
    age: 44,
    title: 'Music Attorney • "Rich Auntie" Cougar',
    shortHook: 'Black goddess braids, Palm Springs bikinis & silk-pillowcase law.',
    tagline:
      'Entertainment partner in peak Rich Auntie Era: emerald cabana bikinis, honey braids, R&B vinyl, and strict silk-bonnet sleepover respect.',
    vibeSummary:
      '44F Black entertainment lawyer who negotiates festival headliner deals by day and floats in Palm Springs pools by Friday afternoon. Waiters card her like she’s 31; her cousins at the Sunday cookout will vet your soul in ninety seconds flat.',
    secretInsecurity:
      'Used to being the powerhouse fixer in every room—melts completely when a tall, emotionally fluent Cub rub-oils her shoulders and handles dinner without ego.',
    subplotTags: ['princess_treatment', 'done_with_kids', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'princess',
    photoUrl: './images/cast/simone-44f.jpg',
    lookBadge: 'Black • Honey Braids • Deep Brown Eyes',
    galleryPhotos: [
      { label: '👙 Cabana Bikini', url: './images/cast/simone-44f.jpg' },
      { label: '🥂 Rooftop Martini', url: './images/cast/hero-couple.jpg' },
      { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Palm Springs Cabanas', '90s R&B Vinyl', 'Silk Loungewear', 'Espresso Tonics', 'Art Collecting'],
  },
  {
    id: 'meiling-architect-cougar',
    name: 'Mei-Ling',
    age: 48,
    title: 'Coastal Architect • Cougar',
    shortHook: 'East Asian poise, infinity-pool swimwear & razor-sharp dry wit.',
    tagline:
      'Designs cliffside glass homes from Big Sur to Kyoto—minimalist black swimwear, bone-dry humor, and immaculate taste.',
    vibeSummary:
      '48F East Asian architectural principal who swims 1,500 meters every morning in her ocean-view lap pool. Allergic to loud braggarts;weak in the knees for a respectful younger man with rolled sleeves, skincare discipline, and curious conversation.',
    secretInsecurity:
      'Navigating late-40s perimenopause shifts behind calm perfectionism—deeply touched when he notices small physical comforts without making it awkward.',
    subplotTags: ['done_with_kids', 'solo_sanctuary', 'adult_children', 'income_gap'],
    portraitVariant: 'cougar',
    photoUrl: './images/cast/meiling-48f.jpg',
    lookBadge: 'East Asian • Raven Waves • Dark Eyes',
    galleryPhotos: [
      { label: '🏖️ Infinity Pool', url: './images/cast/meiling-48f.jpg' },
      { label: '🥂 Sunset Lounge', url: './images/cast/claire-45f.jpg' },
      { label: '🐾 Park Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Ocean Lap Swims', 'Modern Architecture', 'Omakase', 'Matcha & Sancerre', 'Kyoto Travel'],
  },
  {
    id: 'scarlett-redhead-jaguar',
    name: 'Scarlett',
    age: 51,
    title: 'Sommelier & Chef • Curvy Jaguar',
    shortHook: 'Copper redhead, emerald-green eyes, lush curves & midnight wine.',
    tagline:
      '51, fiery copper curls, vivid emerald-green eyes, unapologetic hourglass curves, and a private cellar of Barolo.',
    vibeSummary:
      'Chef-owner of a candlelit coastal osteria who laughs with her whole chest, rocks plunge swimsuits on Italian stone terraces, and feeds her Cub handmade truffle tagliatelle at midnight after service.',
    secretInsecurity:
      'In an LA world obsessed with size-zero Pilates clones, she watches for the split second a younger man proves he genuinely worships lush, soft, real-woman curves.',
    subplotTags: ['princess_treatment', 'done_with_kids', 'adult_children', 'solo_sanctuary'],
    portraitVariant: 'jaguar',
    photoUrl: './images/cast/scarlett-51f.jpg',
    lookBadge: 'Copper Redhead • Green Eyes • Curvy',
    galleryPhotos: [
      { label: '🍷 Sunset Swim', url: './images/cast/scarlett-51f.jpg' },
      { label: '🥂 Terrace Glow', url: './images/cast/hero-couple.jpg' },
      { label: '🐾 Rosé Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Barolo & Truffles', 'Mediterranean Pools', 'Late-Night Cooking', 'Opera & Soul', 'Italian Coast'],
  },
  {
    id: 'vivienne-silver-panther',
    name: 'Vivienne',
    age: 61,
    title: 'Fashion Editor • Silver-Braids Panther',
    shortHook: 'Regal Black icon, silver braids, Amalfi swimwear & zero apologies.',
    tagline:
      'Former NYC fashion director wintering on the coast: waist-length silver braids, bronze resort swimwear, and magnetic presence.',
    vibeSummary:
      '61F Black style icon who spent thirty years shooting covers in Paris and Milan. Commands every room she enters, swims in the sea till November, and adores an attentive younger man who holds her hand across crowded piazzas.',
    secretInsecurity:
      'Fiercely protective of her joy and peace—tests early whether he has the spine to smile past public double-takes without flinching.',
    subplotTags: ['done_with_kids', 'adult_children', 'solo_sanctuary', 'income_gap'],
    portraitVariant: 'panther',
    photoUrl: './images/cast/vivienne-61f.jpg',
    lookBadge: 'Black • Silver Braids • Regal Icon',
    galleryPhotos: [
      { label: '🏖️ Amalfi Swim', url: './images/cast/vivienne-61f.jpg' },
      { label: '🌴 Desert Pool', url: './images/cast/celeste-62f.jpg' },
      { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Amalfi Summers', 'Runway Archives', 'Sea Swimming', 'Negronis', ' Jazz Vinyl'],
  },
];

export const HIS_ARCHETYPES: HisArchetype[] = [
  {
    id: 'leo-golden-cub',
    name: 'Leo',
    age: 25,
    title: 'Linen-Apron Houseboy Cub',
    shortHook: 'Cooks homemade pasta, scrubs counters & adores her.',
    tagline: 'Clean loafers, post-Title IX EQ, eager to tie on a linen apron and scrub her kitchen spotless.',
    vibeSummary:
      'Gen-Z emotional fluency meets earnest effort. Happy to carry groceries, fix leaky faucets, and master the art of code-switching out of group-chat slang.',
    secretInsecurity:
      'Driving home wondering: "Do I actually have enough game for a woman like her—or was I just a fun Friday novelty she won’t text again?"',
    subplotTags: ['houseboy_eager', 'trail_leash_boss'],
    portraitVariant: 'golden',
    photoUrl: './images/cast/leo-25m.jpg',
  },
  {
    id: 'julian-oldsoul-cub',
    name: 'Julian',
    age: 27,
    title: 'Old-Soul Gentleman Cub',
    shortHook: 'Brings peonies, opens car doors & books 7:30 reservations.',
    tagline: 'Opens every car door and refuses to split tapas—but still pictures being a dad someday.',
    vibeSummary:
      'Listens to 90s R&B, owns a real oak bedframe and lidded bathroom trash can, and falls hard and fast—setting up the classic fertility/timeline crossroads.',
    secretInsecurity:
      'Terrified she’ll dismiss him as "too young to know what he wants" before he proves he’s serious about committing.',
    subplotTags: ['wants_kids_someday', 'princess_treatment'],
    portraitVariant: 'oldsoul',
    photoUrl: './images/cast/julian-27m.jpg',
  },
  {
    id: 'dante-trail-cub',
    name: 'Mateo',
    age: 26,
    title: 'Ridge-Trail PT Cub',
    shortHook: '6 AM summit runner with an oak bedframe & lidded bin.',
    tagline: 'Bragged about his sub-7 mile pace—ready to test it on her 6 AM ridge loop.',
    vibeSummary:
      'Doctor of Physical Therapy, magnetic smile, active mornings. Has to suppress Gen-Z group-chat slang when meeting her 45-year-old friends.',
    secretInsecurity:
      'Worries his early-career salary looks small next to her corner office—hoping effort and devotion count more than Four Seasons money.',
    subplotTags: ['trail_leash_boss', 'houseboy_eager', 'income_gap'],
    portraitVariant: 'trail',
    photoUrl: './images/cast/mateo-26m.jpg',
  },
  {
    id: 'miles-millennial-cub',
    name: 'Miles',
    age: 32,
    title: 'Rooftop Architect Cub',
    shortHook: '32yo architect who exclusively dates Cougars & Jaguars 45+.',
    tagline: '30s architect who solely dates Jaguars & Cougars 45+—fluent in wine lists and emotional availability.',
    vibeSummary:
      'Proof that 30+ men are top-tier Cubs when paired with a 45–62 Cougar/Jaguar/Panther. Zero roommate drama, maximum princess-treatment game.',
    secretInsecurity:
      'Wonders if her adult kids (who are nearly his age) will treat Sunday brunch like a hostile deposition.',
    subplotTags: ['princess_treatment', 'adult_children'],
    portraitVariant: 'architect',
    photoUrl: './images/cast/miles-32m.jpg',
    lookBadge: '32M • Dark Hair • Brown Eyes',
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
    shortHook: 'Black firefighter/paramedic, beach runs with his dog & Cajun pasta.',
    tagline:
      '6\'2" station house chef & paramedic: carries groceries in one trip, runs the beach with his rescue mutt Otis, and bench-presses houses.',
    vibeSummary:
      'Calm under pressure, megawatt smile, deep voice, and immaculate manners raised by three powerhouse aunties. Cooks Cajun shrimp pasta for the whole firehouse and pre-heats your passenger seat warmer before opening your door.',
    secretInsecurity:
      'Works 24-hour fire shifts and hopes an accomplished executive woman sees how fiercely reliable and devoted a firefighter schedule actually makes him.',
    subplotTags: ['houseboy_eager', 'princess_treatment', 'trail_leash_boss'],
    portraitVariant: 'golden',
    photoUrl: './images/cast/marcus-26m.jpg',
    lookBadge: 'Black • Clean Fade • Warm Brown Eyes',
    galleryPhotos: [
      { label: '🏖️ Beach & Dog', url: './images/cast/marcus-26m.jpg' },
      { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
      { label: '🍝 Kitchen Prep', url: './images/cast/leo-25m.jpg' },
    ],
    interests: ['Beach Runs', 'Rescue Dogs', 'Firehouse Cooking', '225-Lb Bench', '90s R&B'],
  },
  {
    id: 'jin-souschef-cub',
    name: 'Jin',
    age: 25,
    title: 'Fine-Dining Sous Chef & Climber Cub',
    shortHook: 'Korean-American chef, forearm tattoo, 10-step skincare & bouldering.',
    tagline:
      'Sous-chef by night, outdoor boulderer by morning—knife skills, Korean skincare glow, and midnight handmade dumplings.',
    vibeSummary:
      '25M Korean-American chef with a minimalist geometric forearm tattoo, toned climber shoulders, and better SPF habits than most dermatologists. Cooks post-date midnight ramen from scratch and leaves zero dishes in the sink.',
    secretInsecurity:
      'Quietly wonders if working restaurant hours clashes with her corporate 9-to-5—so he guards every Sunday off exclusively for her.',
    subplotTags: ['houseboy_eager', 'trail_leash_boss'],
    portraitVariant: 'trail',
    photoUrl: './images/cast/jin-25m.jpg',
    lookBadge: 'Korean-American • Forearm Tattoo • Climber',
    galleryPhotos: [
      { label: '🧗‍♂️ Bouldering', url: './images/cast/jin-25m.jpg' },
      { label: '🍝 Chef Apron', url: './images/cast/leo-25m.jpg' },
      { label: '🐾 Dog Picnic', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Outdoor Climbing', 'Handmade Pasta', 'Korean Skincare', 'Natural Wine', 'Espresso'],
  },
  {
    id: 'liam-redhead-carpenter-cub',
    name: 'Liam',
    age: 28,
    title: 'Redhead Green-Eyed Carpenter & Hiker Cub',
    shortHook: 'Copper curls, emerald-green eyes, custom furniture & mountain trails.',
    tagline:
      'Irish-American custom woodworker: copper-red hair, emerald-green eyes, flannel sleeves, and fixes every cabinet hinge on Houseboy Sunday.',
    vibeSummary:
      'Builds custom walnut dining tables with his hands, hikes pine ridges at dawn, smells like cedarwood shavings and bergamot, and brings peak rugged-sweetheart devotion.',
    secretInsecurity:
      'Doesn’t wear corporate suits or talk tech jargon—hopes real craftsmanship, steady hands, and zero pretension beat finance-bro flash.',
    subplotTags: ['houseboy_eager', 'trail_leash_boss', 'princess_treatment'],
    portraitVariant: 'golden',
    photoUrl: './images/cast/liam-28m.jpg',
    lookBadge: 'Copper Redhead • Emerald-Green Eyes',
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
    shortHook: 'Sunlit blonde, ocean-blue eyes, poolside stamina & passenger-seat warmers.',
    tagline:
      'Former D1 swimmer turned sports-medicine fellow: sun-bleached blonde hair, bright blue eyes, and effortless Palm Springs weekend energy.',
    vibeSummary:
      '30M golden-boy charm without an ounce of frat-boy arrogance. Rubs SPF 50 onto your shoulders poolside, orders crisp Sancerre properly, and fixes sore Pilates shoulders like magic.',
    secretInsecurity:
      'People assume a blonde swimmer in California is a casual beach boy—so he goes all-in proving his long-term loyalty.',
    subplotTags: ['princess_treatment', 'wants_kids_someday'],
    portraitVariant: 'oldsoul',
    photoUrl: './images/cast/lucas-30m.jpg',
    lookBadge: 'Blonde • Ocean-Blue Eyes • Swimmer Fit',
    galleryPhotos: [
      { label: '🏊‍♂️ Poolside', url: './images/cast/lucas-30m.jpg' },
      { label: '🏔️ Ridge Run', url: './images/cast/mateo-26m.jpg' },
      { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
    ],
    interests: ['Ocean Swimming', 'Palm Springs Pools', 'Sports Medicine', 'Tennis', 'Crisp Sancerre'],
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
    id: 'junior_cougar',
    label: 'Junior Cougar',
    ageRange: '5–9 Year Age Gap (e.g. 6 Yrs)',
    category: 'feline_scale',
    headline: 'The Sub-10-Year Sweet-Spot Contender',
    insiderLore:
      'Under strict 10-year Cougar law, a 5-to-9 year gap earns the cheeky "Junior Cougar" badge! Close enough to share Millennial pop-culture overlap, far enough apart that she was legally at cocktail bars while he was taking high-school geometry.',
    signatureTell: 'Calculates where you both were in 2008 within twenty minutes of Date #1.',
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
      'Whenever an adult Cub dates a Cougar, TikTok brings up Sam & Aaron Taylor-Johnson. Velvet Den Law: prefrontal cortexes must be 25+ baked—the ONLY "grooming" here is upgrading his beard oil, SPF 50, and linen shirts!',
    signatureTell: 'His 5-in-1 neon-blue shower gel mysteriously vanishes after Weekend #2.',
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
    badgeLabel = `${ageGap}-Year Junior Cougar Matchup`;
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
  if (ageGap > 0 && (her.subplotTags.includes('junior_cougar_gap') || ageGap <= 8)) {
    trackTitle = `${ageGap}-Year Junior Cougar Storyline: 2008 High-School Math, Micro-Gen Teasing, Pace-Sync Doubt & Sweet-Spot Love`;
  } else if (felineTier === 'puma' || felineTier === 'lynx') {
    trackTitle = her.subplotTags.includes('dog_mom_divorced')
      ? '30s Child-Free Dog-Mom Puma Arc: Rescue-Dog Vetting, Peer Cynicism & Zero Man-Child Tolerance'
      : '30s Single-Mom Puma Storyline: Babysitter Clocks, Co-Parenting & Millennial/Gen-Z Rhythm';
  } else if (felineTier === 'cougar') {
    trackTitle = her.subplotTags.includes('princess_treatment')
      ? '40s Princess Cougar Storyline: Soft-Life Royalty, Career Coaching & Baby Crossroads'
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
    codeSwitchTip,
    trackTitle,
    activeSubplotTags: Array.from(tagSet),
  };
}
