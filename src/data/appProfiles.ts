import type { PlayerRole } from '../domain/taxonomy';

export type AppPhotoVariant =
  | 'golden_trail_stud'
  | 'liquor_bottle_trap'
  | 'gym_suit_enticing'
  | 'crew_socks_mirror'
  | 'home_chef_linen'
  | 'tailored_linen'
  | 'dog_park_coffee';

export interface SwipePhoto {
  caption: string;
  shortTab?: string;
  vibeNote: string;
  variant: AppPhotoVariant;
  photoUrl: string;
  isRedFlagPhoto?: boolean;
}

export interface SwipeProfile {
  id: string;
  name: string;
  age: number;
  height: string;
  zodiac: string;
  lookBadge: string;
  occupation: string;
  schoolAndMajor?: string;
  fieldOfWork?: string;
  distance: string;
  activeAgo: string;
  spotifyAnthem: string;
  tinderBio: string;
  hingePromptQuestion: string;
  hingePromptAnswer: string;
  secondPromptQuestion?: string;
  secondPromptAnswer?: string;
  ageShockZoom: boolean;
  ageShockQuipHer: string;
  ageShockQuipHim: string;
  lookingFor: string;
  lookingForSubtext: string;
  interests: string[];
  initiatesFirst?: boolean;
  openingDm: string;
  xrayLeak: string;
  isGreenFlagMatch: boolean;
  photos: SwipePhoto[];
}

function buildSixSlideGallery(
  leadSlides: SwipePhoto[],
  extraCaptions: { url: string; tab: string; caption: string; note: string; variant?: AppPhotoVariant }[],
): SwipePhoto[] {
  const combined = [
    ...leadSlides,
    ...extraCaptions.map((c) => ({
      caption: c.caption,
      shortTab: c.tab,
      vibeNote: c.note,
      variant: c.variant ?? ('tailored_linen' as AppPhotoVariant),
      photoUrl: c.url,
    })),
  ];
  return combined.slice(0, 6).map((s, idx) => ({
    ...s,
    caption: s.caption.replace(/Photo \d+ of \d+/, `Photo ${idx + 1} of 6`),
  }));
}

const DEFAULT_EXTRA_SCENES = [
  {
    url: './images/scenes/sunday-kitchen-sanctuary.jpg',
    tab: '🍝 Kitchen',
    caption: 'Photo 3 of 6 • Sunday Marble Kitchen Prep',
    note: 'Warm kitchen lighting, music queued, and zero rush.',
    variant: 'home_chef_linen' as AppPhotoVariant,
  },
  {
    url: './images/scenes/candlelit-cocktails.jpg',
    tab: '🍸 7:30 Booth',
    caption: 'Photo 4 of 6 • Tucked-Away Corner Cocktail Booth',
    note: 'Prefers dim booths where conversation actually lands.',
    variant: 'tailored_linen' as AppPhotoVariant,
  },
  {
    url: './images/scenes/palm-springs-resort.jpg',
    tab: '🌴 Escape',
    caption: 'Photo 5 of 6 • Weekend Poolside Recharge',
    note: 'Carry-on packed whenever a sunny weekend opens up.',
    variant: 'golden_trail_stud' as AppPhotoVariant,
  },
  {
    url: './images/scenes/coastal-convertible.jpg',
    tab: '🚗 Coast',
    caption: 'Photo 6 of 6 • Golden-Hour Coastal Drive',
    note: 'Windows down up the coast before dinner.',
    variant: 'tailored_linen' as AppPhotoVariant,
  },
  {
    url: './images/cast/dog-park-picnic.jpg',
    tab: '🐾 Picnic',
    caption: 'Photo 6 of 6 • Saturday Park Meadow Blanket',
    note: 'Fresh berries, crusty bread, and dog-friendly grass.',
    variant: 'dog_park_coffee' as AppPhotoVariant,
  },
];

export const APP_SWIPE_PROFILES: SwipeProfile[] = [
  {
    id: 'connor-bottle-trap',
    name: 'Connor',
    age: 26,
    height: '6\'1"',
    zodiac: 'Leo',
    lookBadge: '6\'1" • Sunlit Henley • SaaS Sales',
    occupation: 'SaaS SDR • "Work hard play harder"',
    schoolAndMajor: 'Arizona State • Communications',
    fieldOfWork: 'Tech Outbound Sales',
    distance: '3 miles away',
    activeAgo: 'Active 2m ago',
    spotifyAnthem: 'FE!N • Travis Scott',
    tinderBio:
      '6\'1" because apparently that matters 🙄 Boat days, bottle service & Sunday scaries. Never been with an older woman before 👀 bucket list?',
    hingePromptQuestion: 'Two truths and a lie',
    hingePromptAnswer: 'I own a boat (my dad’s), I cook (ramen), and I’m ready to settle down.',
    secondPromptQuestion: 'Typical Sunday',
    secondPromptAnswer: 'Recovering from Saturday table service until 4 PM.',
    ageShockZoom: true,
    ageShockQuipHer:
      'WAIT: ZOOM IN ON 26?! Flip through all six photos and read that last line carefully.',
    ageShockQuipHim:
      'Study the contrast: Connor’s Photo #1 pulls her in, then Photo #2 changes the whole story.',
    lookingFor: 'Short-term, open to long',
    lookingForSubtext: 'Translation: check Slide 2 before handing out Friday night.',
    interests: ['Nightlife', 'Tequila', 'Boat Days', 'EDM', 'Bottle Service'],
    openingDm: 'hey 😍 ngl never been w a cougar before bucket list fr',
    xrayLeak:
      'CLUE CHECK: Owns zero hand towels, sleeps on a bare memory-foam mattress, and treats older women like a bucket-list badge.',
    isGreenFlagMatch: false,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Golden-Hour Coastal Cliff',
          shortTab: '☀️ Cliffside',
          vibeNote: 'Sunlit jawline, fitted henley, killer smile. Keep scrolling through his camera roll.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/connor-bait.jpg',
        },
        {
          caption: 'Photo 2 of 6 • 2 AM Purple LED Bathroom Mirror',
          shortTab: '🍾 2 AM Mirror',
          vibeNote:
            'Board shorts under purple LEDs clutching a 1.75L handle of Tito’s at 2 AM.',
          variant: 'liquor_bottle_trap',
          photoUrl: './images/cast/connor-bottle-trap.jpg',
          isRedFlagPhoto: true,
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'kieran-anthropic-ai-cub',
    name: 'Kieran',
    age: 28,
    height: '6\'1"',
    zodiac: 'Virgo',
    lookBadge: '6\'1" • Oatmeal Cashmere • Frontier AI',
    occupation: 'Early Frontier-AI Researcher',
    schoolAndMajor: 'MIT • Computer Science & Math',
    fieldOfWork: 'AI Safety Infrastructure',
    distance: '2 miles away',
    activeAgo: 'Active 6m ago',
    spotifyAnthem: 'Khruangbin • Texas Sun',
    tinderBio:
      'Joined Anthropic early, built safety infra, and realized my favorite evenings have zero startup talk ☕🍷 Age filter set 38+ because self-made women with full lives, dry wit, and real standards beat 23yo clout-chasing every single time.',
    hingePromptQuestion: 'What I bring to the table',
    hingePromptAnswer:
      'Zero Venmo math ever, phone stays face-down all through dinner, and I will never "Cubsplain" AI or mortgages to you.',
    secondPromptQuestion: 'Ideal Sunday with you',
    secondPromptAnswer:
      'Farmers-market figs, morning cortados by the window, cooking brown-butter halibut in your kitchen, and 9:30 PM reading.',
    ageShockZoom: false,
    ageShockQuipHer:
      '28, oatmeal cashmere, vintage watch, and allergic to startup talk after 8 PM? Intriguing.',
    ageShockQuipHim:
      'Quiet confidence blueprint: zero net-worth bragging, real manners, and genuine admiration.',
    lookingFor: 'Long-term partnership with an accomplished woman (38, 60)',
    lookingForSubtext: 'Financially independent at 28; dates for intellectual and emotional warmth.',
    interests: ['Cortados', 'Burgundy Pinot', 'Brown-Butter Halibut', 'Art Bookstores', 'Big Sur Drives'],
    openingDm:
      'Quick poll before I book Thursday: cozy wine bar or corner sushi counter?',
    xrayLeak:
      'CLUE CHECK: Immaculate Pac Heights loft with four percale pillows, zero ego, and cooks halibut from scratch.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Sunlit Window Cortado & Cashmere',
          shortTab: '☕ Cortado',
          vibeNote: 'Warm eye contact, vintage leather watch, zero mirror flexing.',
          variant: 'tailored_linen',
          photoUrl: './images/cast/kieran-28m.jpg',
        },
      ],
      [
        ...DEFAULT_EXTRA_SCENES.slice(0, 4),
        {
          url: './images/scenes/luxury-bedroom-sanctuary.jpg',
          tab: '🛏️ Loft',
          caption: 'Photo 6 of 6 • Four-Pillow Percale Sanctuary',
          note: 'Screens power off at 8 PM sharp.',
          variant: 'tailored_linen',
        },
      ],
    ),
  },
  {
    id: 'marcus-firefighter-gentleman',
    name: 'Marcus',
    age: 26,
    height: '6\'2"',
    zodiac: 'Scorpio',
    lookBadge: '6\'2" • Clean Fade • Rescue-Dog Dad',
    occupation: 'Firefighter / Paramedic & Station Chef',
    schoolAndMajor: 'UCLA Paramedic Academy • Fire Science',
    fieldOfWork: 'Fire & Rescue',
    distance: '2 miles away',
    activeAgo: 'Active 4m ago',
    spotifyAnthem: 'Maxwell • Ascension (Don’t Ever Wonder)',
    tinderBio:
      '6\'2" firefighter, rescue-dog dad to Otis 🐾, and undefeated firehouse Cajun pasta champion. Raised by three aunties, so your passenger seat warmer is already on Level 3 and I carry every grocery bag in one trip.',
    hingePromptQuestion: 'House rules I live by',
    hingePromptAnswer:
      'Silk-pillowcase respect, spare claw clip in my glovebox, 225-lb bench stamina, and a lidded bathroom bin.',
    secondPromptQuestion: 'Ideal Sunday together',
    secondPromptAnswer: 'Beach run with Otis at 8, farmers market at 10, cooking you lemon-garlic shrimp by 6.',
    ageShockZoom: true,
    ageShockQuipHer:
      '26, 6\'2", firefighter paramedic running the beach with his rescue dog Otis AND cooks Cajun pasta?!',
    ageShockQuipHim:
      'Athletic beach + rescue dog + station chef competence without a single bathroom selfie.',
    lookingFor: 'Intentional long-term romance',
    lookingForSubtext: 'Calm in emergencies, shows up five minutes early, never plays texting games.',
    interests: [
      'Beach Runs',
      'Rescue Dogs',
      'Cajun Cooking',
      '90s R&B Vinyl',
      'Strength Training',
      'Farmers Markets',
    ],
    openingDm:
      'Just got off shift with one urgent question: corner wine booth Friday at 7:30?',
    xrayLeak:
      'CLUE CHECK: Crisp white percale sheets, sandalwood beard oil, extra phone charger on the nightstand.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Sunset Beach Jog With Rescue Pup Otis',
          shortTab: '🏖️ Otis Run',
          vibeNote: 'Ocean mile with his scruffy rescue dog Otis at golden hour.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/marcus-26m.jpg',
        },
      ],
      [
        DEFAULT_EXTRA_SCENES[4],
        DEFAULT_EXTRA_SCENES[0],
        DEFAULT_EXTRA_SCENES[1],
        DEFAULT_EXTRA_SCENES[2],
        DEFAULT_EXTRA_SCENES[3],
      ],
    ),
  },
  {
    id: 'tyler-snapchat-ick',
    name: 'Tyler "Ty"',
    age: 24,
    height: '5\'11"',
    zodiac: 'Gemini',
    lookBadge: '5\'11" • Stealth Crypto • Minimalist Room',
    occupation: '"Founder @ Stealth Web3"',
    schoolAndMajor: '1 Semester Econ • "Dropped Out to Build"',
    fieldOfWork: 'Crypto & Day Trading',
    distance: '6 miles away',
    activeAgo: 'Active now',
    spotifyAnthem: 'Nokia • Drake',
    tinderBio:
      'Just moved out of my parents’ pool house 💪 Minimalist bedroom aesthetic, barely check this app so drop ur Snap so we can streak 🔥',
    hingePromptQuestion: 'My simple pleasures',
    hingePromptAnswer: '2 AM FIFA with the boys, pre-workout dry scoops, and sleeping till noon.',
    secondPromptQuestion: 'Controversial opinion',
    secondPromptAnswer: 'Top sheets and bedframes are a scam invented by Big Mattress.',
    ageShockZoom: true,
    ageShockQuipHer:
      '24?! Zoom in behind him in Photo 1, is that a folding chair nightstand?!',
    ageShockQuipHim:
      'Spot the bedroom clues: crew socks in slides, gaming headset on a folding chair, and asking for Snapchat.',
    lookingFor: 'Figuring out my dating goals',
    lookingForSubtext: 'Texts "u up?" at 1:14 AM after she has been asleep in silk pajamas since 10.',
    interests: ['Nightlife', 'Clubs', 'Crypto', 'Sneakers', 'FIFA'],
    openingDm: 'damn u look crazy good for ur age 🔥 whats ur snap??',
    xrayLeak:
      'CLUE CHECK: Bare floor mattress, zero bedframe, 3-in-1 body wash, and white crew socks + slides indoors.',
    isGreenFlagMatch: false,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • New Place Mirror Check ("Minimalist Setup")',
          shortTab: '🪞 New Spot',
          vibeNote: 'Wait... inspect the background: bare floor mattress, power strip, and folding chair nightstand.',
          variant: 'crew_socks_mirror',
          photoUrl: './images/cast/tyler-mattress-trap.jpg',
          isRedFlagPhoto: true,
        },
      ],
      [
        {
          url: './images/scenes/neon-bowling-lounge.jpg',
          tab: '🎳 1 AM Lanes',
          caption: 'Photo 2 of 6 • Midnight Pre-Game With the Boys',
          note: 'Usually starts texting around 12:45 AM.',
          variant: 'liquor_bottle_trap',
        },
        ...DEFAULT_EXTRA_SCENES.slice(0, 4),
      ],
    ),
  },
  {
    id: 'liam-redhead-hiker',
    name: 'Liam',
    age: 28,
    height: '6\'1"',
    zodiac: 'Taurus',
    lookBadge: 'Copper Redhead • Emerald-Green Eyes • Woodworker',
    occupation: 'Custom Furniture Maker & Trail Runner',
    schoolAndMajor: 'North Bennet Street School • Fine Cabinetmaking',
    fieldOfWork: 'Custom Woodworking',
    distance: '3 miles away',
    activeAgo: 'Active 6m ago',
    spotifyAnthem: 'Hozier • Too Sweet',
    tinderBio:
      'Custom woodworker with copper hair, green eyes, and an actual toolbelt 🛠️ I build walnut dining tables by day, hike pine ridges at sunrise, and fix squeaky cabinet hinges on Sundays.',
    hingePromptQuestion: 'Weirdest gift I’ll bring you',
    hingePromptAnswer: 'A hand-carved olivewood charcuterie board and a ribeye seared in cast iron.',
    secondPromptQuestion: 'Dating me looks like',
    secondPromptAnswer: 'Zero tech-bro jargon, warm flannel hugs after cold hikes, and reading dim Italian menus aloud.',
    ageShockZoom: false,
    ageShockQuipHer:
      'Copper curls, emerald eyes, AND builds solid walnut furniture with his own hands?',
    ageShockQuipHim:
      'Craftsmanship + warmth: proves real skill and steady hands beat flashy flexing.',
    lookingFor: 'Long-term partnership',
    lookingForSubtext: 'Smells like cedarwood and bergamot; reaches every top shelf effortlessly.',
    interests: ['Mountain Hiking', 'Woodworking', 'Cast-Iron Cooking', 'Rescue Dogs', 'Live Folk & Blues'],
    openingDm:
      'Just finished sanding a walnut table and spotted your profile, can I take you for wood-fired pizza and good red wine Friday at 7:30?',
    xrayLeak:
      'CLUE CHECK: Handbuilt solid walnut bedframe, botanical soap, cast-iron skillet seasoned to perfection.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Sunrise Pine Ridge Trail',
          shortTab: '🏔️ Trail Hike',
          vibeNote: 'Copper curls, emerald eyes, rolled flannel sleeves & trail coffee.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/liam-28m.jpg',
        },
      ],
      [
        DEFAULT_EXTRA_SCENES[4],
        DEFAULT_EXTRA_SCENES[0],
        DEFAULT_EXTRA_SCENES[1],
        {
          url: './images/scenes/cozy-rain-suite.jpg',
          tab: '🪵 Cabin',
          caption: 'Photo 5 of 6 • Rainy Cabin Fireplace & Vinyl',
          note: 'Hand-mortised walnut bookshelves.',
          variant: 'tailored_linen',
        },
        DEFAULT_EXTRA_SCENES[3],
      ],
    ),
  },
  {
    id: 'lucas-blonde-swimmer',
    name: 'Lucas',
    age: 30,
    height: '6\'3"',
    zodiac: 'Libra',
    lookBadge: 'Sunlit Blonde • Ocean-Blue Eyes • Sports MD',
    occupation: 'Sports Medicine MD Fellow',
    schoolAndMajor: 'UCLA David Geffen • Sports Medicine MD',
    fieldOfWork: 'Orthopedics & Athletics',
    distance: '4 miles away',
    activeAgo: 'Active 8m ago',
    spotifyAnthem: 'Rüfüs Du Sol • Innerbloom',
    tinderBio:
      'Former D1 swimmer turned sports-medicine doc 🏊‍♂️ Fluent in wine lists, SPF 50 shoulder rubs, and post-Pilates neck massages. Exclusively attracted to women who have their life dialed in.',
    hingePromptQuestion: 'Together, we could',
    hingePromptAnswer: 'Escape to Palm Springs Friday afternoon, poolside cabanas, Sancerre, and zero stress.',
    secondPromptQuestion: 'My secret superpower',
    secondPromptAnswer: 'Releasing tight rotator cuffs in 90 seconds and keeping bedrooms at a crisp 62°F.',
    ageShockZoom: false,
    ageShockQuipHer:
      '30yo ocean-eyed sports doctor in sky-blue swim trunks?! Suddenly my shoulder feels tight.',
    ageShockQuipHim:
      'Poolside fitness without gym-mirror vanity, paired with real career grounding.',
    lookingFor: 'Committed relationship',
    lookingForSubtext: 'Zero roommate chaos, loves accomplished women, elite travel partner.',
    interests: ['Ocean Swimming', 'Palm Springs Cabanas', 'Sports Medicine', 'Tennis', 'Crisp Sancerre'],
    openingDm:
      'Between hospital rounds and morning laps I rarely swipe, until your smile stopped me cold. Drinks on the terrace Thursday at 7:30?',
    xrayLeak:
      'CLUE CHECK: Bamboo cooling sheets, stocked sparkling water fridge, medical-grade shoulder massages.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Palm Springs Poolside Laps',
          shortTab: '🏊‍♂️ Poolside',
          vibeNote: 'Sunlit blonde, ocean-blue eyes, natural poolside grin.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/lucas-30m.jpg',
        },
      ],
      [
        {
          url: './images/scenes/hotel-pool-sauna.jpg',
          tab: '🧖‍♂️ Sauna',
          caption: 'Photo 2 of 6 • Post-Swim Cedar Sauna Recovery',
          note: 'Swears by cold plunge + sauna contrast.',
          variant: 'golden_trail_stud',
        },
        ...DEFAULT_EXTRA_SCENES.slice(0, 4),
      ],
    ),
  },
  {
    id: 'jin-climber-chef',
    name: 'Jin',
    age: 25,
    height: '6\'0"',
    zodiac: 'Virgo',
    lookBadge: '6\'0" • Forearm Tattoo • Sous-Chef & Climber',
    occupation: 'Fine-Dining Sous Chef & Boulderer',
    schoolAndMajor: 'Culinary Institute • Classical & Modern Cuisine',
    fieldOfWork: 'Michelin Hospitality',
    distance: '2 miles away',
    activeAgo: 'Active 11m ago',
    spotifyAnthem: 'Daniel Caesar • Best Part',
    tinderBio:
      'Sous-chef at a Michelin bistro by night, outdoor rock climber by morning 🧗‍♂️ Ten-step peptide skincare shelf, elite knife skills, and I never leave a single pan unwashed.',
    hingePromptQuestion: 'I’ll know it’s real when',
    hingePromptAnswer: 'You steal bites from my cutting board at 11 PM while I cook you brown-butter scallops.',
    secondPromptQuestion: 'Non-negotiable habit',
    secondPromptAnswer: 'Daily SPF 50, eucalyptus hand soap, and fresh flowers on your counter every Sunday.',
    ageShockZoom: true,
    ageShockQuipHer:
      '25, boulderer grip strength, AND Michelin sous-chef?! Goodbye takeout forever.',
    ageShockQuipHim:
      'Athletic activity shot + gourmet caretaking beats flashy flexing every time.',
    lookingFor: 'Intentional chemistry & partnership',
    lookingForSubtext: 'Guards every Sunday off sacredly for date night.',
    interests: ['Rock Climbing', 'Michelin Cooking', '10-Step Skincare', 'Natural Wine', 'Pour-Over Coffee'],
    openingDm:
      'Sunday is my night off the line, let me take you to my favorite tucked-away wine bar at 7:30, or cook handmade pasta at yours?',
    xrayLeak:
      'CLUE CHECK: Japanese chef knives, peptide skincare shelf, spotless studio with lidded bin.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Morning Granite Bouldering Session',
          shortTab: '🧗‍♂️ Climbing',
          vibeNote: 'Sunlit granite boulder, subtle forearm tattoo, relaxed athletic focus.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/jin-25m.jpg',
        },
      ],
      [
        DEFAULT_EXTRA_SCENES[0],
        {
          url: './images/scenes/campus-autumn-sushi.jpg',
          tab: '🍣 Late Bite',
          caption: 'Photo 3 of 6 • Post-Service Midnight Omakase Walk',
          note: 'Knows every chef counter open past 11 PM.',
          variant: 'tailored_linen',
        },
        DEFAULT_EXTRA_SCENES[1],
        DEFAULT_EXTRA_SCENES[2],
        DEFAULT_EXTRA_SCENES[4],
      ],
    ),
  },
  {
    id: 'mateo-trail-gentleman',
    name: 'Mateo',
    age: 26,
    height: '6\'0"',
    zodiac: 'Virgo',
    lookBadge: '6\'0" • Dark Waves • Ridge Runner DPT',
    occupation: 'Doctor of Physical Therapy',
    schoolAndMajor: 'USC • Doctor of Physical Therapy',
    fieldOfWork: 'Sports Rehabilitation',
    distance: '2 miles away',
    activeAgo: 'Active 9m ago',
    spotifyAnthem: 'Leon Bridges • Beyond',
    tinderBio:
      'Own an oak bedframe, 600TC cotton sheets, AND a bathroom trash can with a lid. Seeking my 6 AM ridge-trail pace partner & Sunday pasta co-chef.',
    hingePromptQuestion: 'Green flags I look for',
    hingePromptAnswer: 'A woman who knows exactly what she wants and laughs when I tie on the kitchen apron.',
    ageShockZoom: true,
    ageShockQuipHer:
      'Okay, 26 triggers a double-take... then read that bio and scroll his six photos.',
    ageShockQuipHim:
      'Active mornings, domestic competence, and a concrete reservation plan.',
    lookingFor: 'Intentional relationship',
    lookingForSubtext: 'Pays his own bills, stretches your calves after trail runs, shows up early.',
    interests: ['Trail Running', 'Home Cooking', 'Live Jazz', 'Farmers Markets', 'Physical Therapy'],
    openingDm:
      'Your canyon trail photo caught my eye, though I’m pretty sure you’d drop me on mile four. Tapas Thursday at 7:30?',
    xrayLeak:
      'CLUE CHECK: 600-thread-count percale sheets, eucalyptus hand soap, lidded bathroom bin.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • 6:15 AM Coastal Ridge Summit',
          shortTab: '🏔️ Summit',
          vibeNote: 'Hydration vest, genuine sunlit smile, zero frat-bathroom flexing.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/mateo-26m.jpg',
        },
      ],
      [
        DEFAULT_EXTRA_SCENES[0],
        DEFAULT_EXTRA_SCENES[4],
        DEFAULT_EXTRA_SCENES[1],
        DEFAULT_EXTRA_SCENES[2],
        DEFAULT_EXTRA_SCENES[3],
      ],
    ),
  },
  {
    id: 'julian-peonies-gentleman',
    name: 'Julian',
    age: 27,
    height: '6\'0"',
    zodiac: 'Taurus',
    lookBadge: '6\'0" • Hampstead London • Structural Engineer',
    occupation: 'British Structural Engineer',
    schoolAndMajor: 'Imperial College London • MEng Structural Eng',
    fieldOfWork: 'Bridge & Seismic Design',
    distance: '4 miles away',
    activeAgo: 'Active 14m ago',
    spotifyAnthem: 'Sade • Kiss of Life',
    tinderBio:
      'North London transplant who opens passenger doors, books half-seven wine booths before Wednesday, and keeps my mobile face-down all through dinner xx',
    hingePromptQuestion: 'Together, we could',
    hingePromptAnswer: 'Turn your brain completely off on Friday night, table for half seven is sorted xx',
    secondPromptQuestion: 'Quickest way to make me blush',
    secondPromptAnswer: 'Raise one eyebrow across the wine bar until I say "Yes, Mummy xx."',
    ageShockZoom: false,
    ageShockQuipHer:
      '27, Hampstead London accent, listens to Sade, AND brings pink peonies at half seven?!',
    ageShockQuipHim:
      'British chivalry blueprint: takes 100% of the Friday planning load off her plate.',
    lookingFor: 'Proper long-term partner',
    lookingForSubtext: 'Knows the difference between Bordeaux and Vodka Red Bull.',
    interests: ['Architecture', 'Sade & Vinyl', 'Half-Seven Wine Bars', 'Coastal Drives', 'Peonies'],
    openingDm:
      'Fancy a cheeky drink Friday at half seven? Corner booth and pink peonies are already sorted xx',
    xrayLeak:
      'CLUE CHECK: Opens car doors automatically, signs texts "xx", and smells like cedar & bergamot.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Golden-Hour Terrace With Fresh Peonies',
          shortTab: '💐 Peonies',
          vibeNote: 'Pressed olive linen button-down, Hampstead charm, genuine romance.',
          variant: 'tailored_linen',
          photoUrl: './images/cast/julian-27m.jpg',
        },
      ],
      [
        DEFAULT_EXTRA_SCENES[1],
        DEFAULT_EXTRA_SCENES[3],
        {
          url: './images/scenes/wedding-gala-cheers.jpg',
          tab: '🥂 Black Tie',
          caption: 'Photo 4 of 6 • London Architecture Gala',
          note: 'Owns a proper tailored dinner jacket.',
          variant: 'tailored_linen',
        },
        DEFAULT_EXTRA_SCENES[0],
        DEFAULT_EXTRA_SCENES[4],
      ],
    ),
  },
  {
    id: 'chadwick-cabo-goblin',
    name: 'Chadwick "Chad"',
    age: 24,
    height: '6\'3"',
    zodiac: 'Aries',
    lookBadge: '6\'3" • Marina Linen • Lifestyle Creator',
    occupation: '"Yacht Charter Host / DJ"',
    schoolAndMajor: '2 Semesters Hospitality • "School of Cabo"',
    fieldOfWork: 'Nightlife & VIP Hosting',
    distance: '8 miles away',
    activeAgo: 'Active 1m ago',
    spotifyAnthem: 'Shots • LMFAO',
    tinderBio:
      'Here for a good time not a long time 🔥 Looking for an iconic woman to fly us to Cabo on points lol jk... unless?? 😏',
    hingePromptQuestion: 'First round is on me if',
    hingePromptAnswer: 'Jk first round is on you Mommy 😜',
    secondPromptQuestion: 'Dream weekend',
    secondPromptAnswer: 'You book the Four Seasons suite and I handle the poolside playlist.',
    ageShockZoom: true,
    ageShockQuipHer:
      'Read Prompt #1 closely before that marina smile fools you, he wants Delta SkyMiles!',
    ageShockQuipHim:
      'Confusing an independent older woman with a travel sponsor gets exposed fast.',
    lookingFor: 'Short-term luxury fun',
    lookingForSubtext: 'Card declined on a $14 smoothie yesterday.',
    interests: ['Nightlife', 'VIP Tables', 'Marina Days', 'Tequila', 'Cabo'],
    openingDm: 'hey mommy when are u taking me shopping 👀💳',
    xrayLeak:
      'CLUE CHECK: Negative $42 Venmo balance, sleeps until 1:30 PM, fishing for a free Cabo flight.',
    isGreenFlagMatch: false,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Afternoon Marina Dock (Friend’s Uncle’s Boat)',
          shortTab: '⛵ Marina',
          vibeNote: 'Pastel pink linen on the dock... read his first-round prompt carefully.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/chadwick-24m.jpg',
          isRedFlagPhoto: true,
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'brandon-roblox-dl-trap',
    name: 'Brandon "Brando"',
    age: 24,
    height: '5\'10"',
    zodiac: 'Pisces',
    lookBadge: '5\'10" • Night-Owl Streamer • Lowkey Vibes',
    occupation: 'Twitch Streamer & Content Creator',
    schoolAndMajor: 'Community Media • Gap Year #4',
    fieldOfWork: 'Late-Night Streaming',
    distance: '5 miles away',
    activeAgo: 'Active 1m ago',
    spotifyAnthem: '100 gecs • money machine',
    tinderBio:
      'Looking for something discrete / lowkey after 10 PM 👀 Never dated someone born in the late 1900s before lol kinda wild!! Catch me on Roblox w the boys till 4 AM 🎮',
    hingePromptQuestion: 'Ideal first linkup',
    hingePromptAnswer: 'Come thru after 10:30 PM once my roommates hop on Discord, keep it private 🤫',
    secondPromptQuestion: 'Underrated perk about me',
    secondPromptAnswer: 'My mom still drops off folded laundry on Sundays so my hoodies smell fresh.',
    ageShockZoom: true,
    ageShockQuipHer:
      '"BORN IN THE LATE 1900s" AND "DISCRETE AFTER 10 PM"?! Read every word of that bio!',
    ageShockQuipHim:
      'Writing "discrete/lowkey" + calling 1984 "the late 1900s" is a legendary self-own.',
    lookingFor: 'Something casual & discrete',
    lookingForSubtext: '"Discrete" (spelled wrong) means he hides dates from daylight.',
    interests: ['Streaming', 'Roblox', 'Discord VC', 'Late Nights', 'Energy Drinks'],
    openingDm: 'yo 👀 crazy ur from the 1900s lol u down for a discrete late night link tn??',
    xrayLeak:
      'CLUE CHECK: Spells discreet wrong, only meets after 10:30 PM, and games till 4 AM.',
    isGreenFlagMatch: false,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • 2:30 AM Dual-Monitor Stream Setup',
          shortTab: '🎮 Desk Glow',
          vibeNote: 'Oversized hoodie and RGB glow, check his bio for "late 1900s" and "discrete".',
          variant: 'crew_socks_mirror',
          photoUrl: './images/cast/brandon-24m.jpg',
          isRedFlagPhoto: true,
        },
      ],
      [
        {
          url: './images/scenes/neon-bowling-lounge.jpg',
          tab: '🕹️ Arcade',
          caption: 'Photo 2 of 6 • Midnight Arcade Run',
          note: 'Allergic to daylight brunch before 2 PM.',
          variant: 'liquor_bottle_trap',
        },
        ...DEFAULT_EXTRA_SCENES.slice(0, 4),
      ],
    ),
  },
  {
    id: 'colton-montana-ranch-cub',
    name: 'Colton',
    age: 25,
    height: '6\'3"',
    zodiac: 'Sagittarius',
    lookBadge: '6\'3" • Sunlit Blonde • Montana Ranch Cowboy',
    occupation: 'Cattle Rancher & Former College WR',
    schoolAndMajor: 'Montana State • Agribusiness',
    fieldOfWork: 'Ranching & Land Stewardship',
    distance: '4 miles away (In from Bozeman)',
    activeAgo: 'Active 1m ago',
    spotifyAnthem: 'Zach Bryan • Something in the Orange',
    tinderBio:
      '6\'3" Montana ranch kid & ex-college wide receiver 🤠 Yes, I accidentally commented "I love you" from my boys’ shared ranch account before sliding in properly. Glad you lowered your age slider.',
    hingePromptQuestion: 'Most impulsive move',
    hingePromptAnswer:
      'Booking a Friday flight from Bozeman just to open your car door, two-step in your kitchen, and carry your luggage.',
    secondPromptQuestion: 'Sunday ritual',
    secondPromptAnswer: 'Fence line check at sunrise, steaks on the grill at 7, zero hiding on social media.',
    ageShockZoom: true,
    ageShockQuipHer:
      '25 AND 6\'3" FROM MONTANA?! Kristin Cavallari tried to warn everyone about lowering that age slider!',
    ageShockQuipHim:
      'Fearless ranch manners, two-stepping charm, and proud daylight energy.',
    lookingFor: 'Real whirlwind romance (zero hiding)',
    lookingForSubtext: 'Holds your hand through airports and beams like he won the Super Bowl.',
    interests: ['Montana Ranches', 'Country Two-Step', 'Cabo Sunsets', 'Pickup Trucks', 'Bonfires'],
    openingDm:
      'Okay full confession. I almost DMed you from my buddies’ shared ranch account first 😅 Steak and live guitar Friday at 7:30?',
    xrayLeak:
      'CLUE CHECK: Genuine yes-ma’am ranch manners, 6\'3" carry-on strength, proudly posts you on main.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Golden-Hour Ranch Portrait',
          shortTab: '🤠 Ranch',
          vibeNote: '6\'3", sunlit grin, pure Bozeman ranch energy.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/colton-25m.jpg',
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'kayden-dutch-venmo-trap',
    name: 'Kayden',
    age: 21,
    height: '5\'9"',
    zodiac: 'Gemini',
    lookBadge: '5\'9" • Campus Hoodie • Finance Senior',
    occupation: '5th-Year Finance Undergrad',
    schoolAndMajor: 'State University • Corporate Finance',
    fieldOfWork: 'Student Budgeting & Analytics',
    distance: '1 mile away (Near Campus)',
    activeAgo: 'Active now',
    spotifyAnthem: 'Lil Dicky • $ave Dat Money',
    tinderBio:
      '21 & fiscally disciplined 📊 Big believer in exact 50/50 split checks down to the cent so everything stays fair! Let’s hit sushi during the 4:30 PM early-bird window.',
    hingePromptQuestion: 'First date non-negotiable',
    hingePromptAnswer:
      'Separate checks + my Venmo macro splits appetizers by exact edamame pod ratio 🧮',
    secondPromptQuestion: 'My living situation',
    secondPromptAnswer: 'Four guys in a 2-bedroom, Kyle’s cereal mixing bowls stay in the sink mostly.',
    ageShockZoom: true,
    ageShockQuipHer:
      '21 AND AN EDAMAME-POD VENMO SPREADSHEET?! Look closely at Prompt #1!',
    ageShockQuipHim:
      'Never invite a woman out and pull out an iPhone spreadsheet to Venmo-split $0.38 tax.',
    lookingFor: '50/50 Dutch casual vibes',
    lookingForSubtext: 'Orders two dragon rolls, then divides the total onto your Venmo.',
    interests: ['Spreadsheet Macros', '4:30 PM Early Bird', 'Coupons', 'Campus Coffee', 'Valorant'],
    openingDm:
      'yo!! down to grab sushi at 4:45 PM happy hour tn if we go dutch?? bring ur Venmo ready lol 🍣🧮',
    xrayLeak:
      'CLUE CHECK: $11.40 checking balance, three roommates sharing one towel, itemizes Venmo before leaving the booth.',
    isGreenFlagMatch: false,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Campus Quad Hoodie Walk',
          shortTab: '🎓 Quad',
          vibeNote: 'Harmless-looking finance senior... until you read his edamame Venmo prompt.',
          variant: 'dog_park_coffee',
          photoUrl: './images/cast/kayden-21m.jpg',
          isRedFlagPhoto: true,
        },
      ],
      [
        {
          url: './images/scenes/campus-autumn-sushi.jpg',
          tab: '🍣 4:30 Deal',
          caption: 'Photo 2 of 6 • 4:30 PM Early-Bird Sushi Counter',
          note: 'Tries swiping campus Dining Dollars first.',
          variant: 'tailored_linen',
        },
        ...DEFAULT_EXTRA_SCENES.slice(0, 4),
      ],
    ),
  },
  {
    id: 'trevor-hawaii-timeshare-trap',
    name: 'Trevor',
    age: 21,
    height: '6\'0"',
    zodiac: 'Leo',
    lookBadge: '6\'0" • Resort Linen • Business Junior',
    occupation: 'Undergrad Business Junior • "Maui Regular"',
    schoolAndMajor: 'Pepperdine • Business Administration',
    fieldOfWork: 'Family Hospitality Points',
    distance: '2 miles away',
    activeAgo: 'Active now',
    spotifyAnthem: 'Jack Johnson • Banana Pancakes',
    tinderBio:
      '21 in undergrad 📚 Whenever women hesitate about my age I invite them to "my place in Maui" for Week 14 🌺✈️ Oceanfront lanai, pineapple drinks, zero stress!',
    hingePromptQuestion: 'Wait… whose name is on the Maui deed?',
    hingePromptAnswer:
      'Haha okay technically my mom Linda & stepdad Greg own the biennial Marriott timeshare week, they’re right down the hall!',
    secondPromptQuestion: 'Only catch on Tuesday morning',
    secondPromptAnswer:
      'Mom says we have to attend a 90-minute 8 AM timeshare presentation for the free luau buffet wristbands 🌺',
    ageShockZoom: true,
    ageShockQuipHer:
      '"MY PLACE IN MAUI" IS MOM LINDA’S WEEK-14 TIMESHARE DOWN THE HALL?!',
    ageShockQuipHim:
      'Never flex "my place in Hawaii" when your mom Linda is making waffles in the kitchenette.',
    lookingFor: 'Maui Week-14 plus-one',
    lookingForSubtext: 'Introduces you to his mom at the continental waffle iron at 7:45 AM.',
    interests: ['Resort Pools', 'Maui Week 14', 'Puka Shells', 'Spring Break', 'Airline Miles'],
    openingDm:
      'i know ur skeptical bc im 21 lol… let me take u to my place in Maui next month! (ok yeah technically my parents have a timeshare there haha) 🌺✈️',
    xrayLeak:
      'CLUE CHECK: Zero deed, Linda & Greg own Week 14 and sleep on the other side of the kitchenette wall.',
    isGreenFlagMatch: false,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • "My Place in Maui" Poolside Pineapple',
          shortTab: '🍍 Resort Pool',
          vibeNote: 'Puka shells and umbrella drink, check Prompt #1 to see who booked the room.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/trevor-21m.jpg',
          isRedFlagPhoto: true,
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'sam-golden-retriever-cub',
    name: 'Sam',
    age: 25,
    height: '6\'1"',
    zodiac: 'Cancer',
    lookBadge: '6\'1" • Austin Patio • Pediatric RN',
    occupation: 'Pediatric Nurse & Coastal Marathoner',
    schoolAndMajor: 'UT Austin • BSN Pediatric Nursing',
    fieldOfWork: 'Pediatric Care & Endurance Running',
    distance: '2 miles away',
    activeAgo: 'Active 3m ago',
    spotifyAnthem: 'Hozier • Work Song',
    tinderBio:
      'Unapologetic Golden Retriever energy 🐕 Zero interest in rushed chaos. I go weak in the knees for a cool, selective "Black Cat" woman who takes her time, raises one eyebrow at my jokes, and makes me earn her real smile by Date #3.',
    hingePromptQuestion: 'My romantic kryptonite',
    hingePromptAnswer:
      'When she says "Slow down, eager puppy, convince me" instead of folding on Day 1.',
    secondPromptQuestion: 'How I handle slow-burn boundaries',
    secondPromptAnswer:
      'Zero sulking, zero double-text panic, just steady 7:30 reservations and warm patience.',
    ageShockZoom: false,
    ageShockQuipHer:
      'A 25yo pediatric nurse who actually likes when a Black Cat woman takes her time?!',
    ageShockQuipHim:
      'Golden-Retriever warmth + unbothered patience melts selective Black Cat poise.',
    lookingFor: 'Slow-burn Black Cat × Golden Retriever magic',
    lookingForSubtext: 'Never rushes your pace; beams brighter every time you let him closer.',
    interests: ['Marathons', 'Pour-Over Coffee', 'Succulent Patios', 'Rescue Dogs', 'Home Cooking'],
    openingDm:
      'Something tells me you don’t hand out Friday nights easily, which is my favorite sign. Iced matcha or a quiet wine booth next week?',
    xrayLeak:
      'CLUE CHECK: Pure Golden-Retriever patience, spotless apartment, zero bruised ego.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Morning Pour-Over on the Cedar Patio',
          shortTab: '☕ Patio',
          vibeNote: 'Waffle-knit henley, ceramic mug, potted succulents, calm warmth.',
          variant: 'dog_park_coffee',
          photoUrl: './images/cast/sam-25m.jpg',
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'jaxon-pine-pollen-feels-trap',
    name: 'Jaxon',
    age: 24,
    height: '6\'0"',
    zodiac: 'Aries',
    lookBadge: '6\'0" • Cedar Ice Bath • Ancestral Podcaster',
    occupation: 'Wellness Podcaster & Biohacker',
    schoolAndMajor: 'YouTube Academy • "Self-Taught Endocrinology"',
    fieldOfWork: 'Podcasting & Supplements',
    distance: '3 miles away',
    activeAgo: 'Active now (Typing…)',
    spotifyAnthem: 'Drake • Marvin’s Room',
    tinderBio:
      '24M optimizing ancestral protocols w/ raw wildcrafted Pine Pollen tincture & 37°F ice baths 🌲💪 Big communicator (if you go quiet for 45 mins after 9 PM I WILL get all up in my feels and send 6 paragraphs).',
    hingePromptQuestion: 'Communication style & expectations',
    hingePromptAnswer:
      'Need 24/7 texting reassurance, Do Not Disturb at 9:30 PM turns my pine-pollen spike into midnight poetry 😭🌲',
    secondPromptQuestion: 'Currently in my gym bag',
    secondPromptAnswer:
      'Three amber droppers of raw pine pollen, mouth tape, and a 9-screen Notes-app text draft.',
    ageShockZoom: true,
    ageShockQuipHer:
      'PINE POLLEN TINCTURES AND 6-PARAGRAPH MIDNIGHT TEXT SPIRALS?! Read Prompt #1!',
    ageShockQuipHim:
      'Panicking when an accomplished woman unplugs at 9:30 PM = instant exile.',
    lookingFor: '24/7 text reassurance + podcast co-listener',
    lookingForSubtext: 'Blames tree pollen after sending nine texts at 11:47 PM.',
    interests: ['Pine Pollen', '37°F Ice Baths', 'Podcast Clips', 'Voice Notes', 'Late-Night Feels'],
    openingDm:
      'took 2 droppers of raw pine pollen before my ice bath and ngl im already all up in my feels bc u matched 20 mins ago and didnt say hi yet 😭🌲',
    xrayLeak:
      'CLUE CHECK: Ignores unplugged evening boundaries and lectures from 10-minute podcast clips.',
    isGreenFlagMatch: false,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • 6:05 AM Cedar Ice-Bath & Green Elixir',
          shortTab: '🧊 Ice Bath',
          vibeNote: 'Intense eye contact beside the plunge tub, read his 9:30 PM texting prompt.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/jaxon-24m.jpg',
          isRedFlagPhoto: true,
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
];

export const HER_SWIPE_PROFILES: SwipeProfile[] = [
  {
    id: 'her-claire-45',
    name: 'Claire',
    age: 45,
    height: '5\'8"',
    zodiac: 'Capricorn',
    lookBadge: 'Espresso Waves • Hazel Eyes • VP Poise',
    occupation: 'VP of Product',
    schoolAndMajor: 'Wharton • Economics & Strategy',
    fieldOfWork: 'Enterprise Tech',
    distance: '3 miles away',
    activeAgo: 'Active 5m ago',
    spotifyAnthem: 'Lauryn Hill • Ex-Factor',
    tinderBio:
      'Mortgage paid, kids grown, passport stamped, zero interest in raising another teenager. Impress me with emotional maturity, reading dim candlelit menus aloud, and a spot you booked yourself.',
    hingePromptQuestion: 'Don’t message me if',
    hingePromptAnswer: 'Your opener is "hey" or you ask a 45-year-old woman for her Snapchat.',
    secondPromptQuestion: 'Bedroom sanctuary rule',
    secondPromptAnswer: '62°F AC, 100% bamboo cooling sheets, and respect the retinol routine.',
    ageShockZoom: true,
    ageShockQuipHer: 'Claire sets the gold standard.',
    ageShockQuipHim:
      '45F VP of Product, radiant, sharp, and clocks low effort from three zip codes away.',
    lookingFor: 'Intentional chemistry',
    lookingForSubtext: 'Vets your manners first; unlocks unforgettable weekends second.',
    interests: ['Espresso Martinis', 'Coastal Drives', 'Architecture', 'Pilates', 'Palm Springs'],
    initiatesFirst: false,
    openingDm: 'Matched with Claire • She waits for you to lead with a real Friday plan.',
    xrayLeak:
      'CLUE CHECK: Cover tapas smoothly within your budget and never add "for your age."',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Sunset Rooftop Espresso Martini',
          shortTab: '🍸 Rooftop',
          vibeNote: 'Champagne silk, effortless confidence, zero games.',
          variant: 'tailored_linen',
          photoUrl: './images/cast/claire-45f.jpg',
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'her-simone-44',
    name: 'Simone',
    age: 44,
    height: '5\'8"',
    zodiac: 'Scorpio',
    lookBadge: '5\'8" • Honey Goddess Braids • Music Law',
    occupation: 'Entertainment Attorney',
    schoolAndMajor: 'NYU Law • Entertainment & IP',
    fieldOfWork: 'Music & Festival Law',
    distance: '3 miles away',
    activeAgo: 'Active 2m ago',
    spotifyAnthem: 'Sade • Cherish the Day',
    tinderBio:
      'Negotiates festival headliners all week; floats in Palm Springs pools all weekend 🌴 Bring real conversation, silk-pillowcase respect, and earn my "Good boy" praise.',
    hingePromptQuestion: 'Non-negotiable sleepover law',
    hingePromptAnswer: 'Never tug the honey braids accidentally and keep spare silk pillowcases on your bed.',
    secondPromptQuestion: 'Quickest way to impress me',
    secondPromptAnswer: 'Have dinner booked at 8, open my car door, and hold your own with my cousins.',
    ageShockZoom: true,
    ageShockQuipHer: 'Rich Auntie perfection.',
    ageShockQuipHim:
      '44F entertainment attorney in Palm Springs, razor-sharp and allergic to low effort.',
    lookingFor: 'Grown-man chivalry & poised polarity',
    lookingForSubtext: 'Financially set; dates purely for chemistry, manners, and devotion.',
    interests: ['Palm Springs Cabanas', '90s R&B Vinyl', 'Espresso Tonics', 'Silk Loungewear', 'Art Galleries'],
    initiatesFirst: false,
    openingDm: 'Matched with Simone • Waiting to see if your opener beats "hey."',
    xrayLeak:
      'CLUE CHECK: Respect silk pillowcases, bring fresh flowers, and never touch the thermostat.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Palm Springs Cabana & Iced Espresso',
          shortTab: '👙 Cabana',
          vibeNote: 'Emerald resort bikini, honey braids, effortless poise.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/simone-44f.jpg',
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'her-astrid-41',
    name: 'Astrid',
    age: 41,
    height: '5\'10"',
    zodiac: 'Aquarius',
    lookBadge: 'Golden Blonde • Ice-Blue Eyes • Surfer',
    occupation: 'Biotech Founder & Malibu Surfer',
    schoolAndMajor: 'Stanford • Bioengineering PhD',
    fieldOfWork: 'Biotech & Ocean Sports',
    distance: '4 miles away',
    activeAgo: 'Active 6m ago',
    spotifyAnthem: 'Maggie Rogers • Alaska',
    tinderBio:
      'Malibu biotech founder 🏄‍♀️ Sold my lab startup at 39 so I could surf dawn patrol before 7 AM. Looking for a Cub whose stamina survives ocean swells AND 190°F cedar saunas.',
    hingePromptQuestion: 'First date challenge',
    hingePromptAnswer: 'Dawn surf at First Point followed by burritos on the tailgate.',
    secondPromptQuestion: 'Secret soft spot',
    secondPromptAnswer: 'Warm shoulder rubs after cold ocean water.',
    ageShockZoom: false,
    ageShockQuipHer: 'Malibu dawn-patrol founder.',
    ageShockQuipHim:
      '41F surfer founder with better cardio than half of Venice Beach.',
    lookingFor: 'Athletic adventure & real warmth',
    lookingForSubtext: 'Salt-water waves by morning, cedar sauna by dusk.',
    interests: ['Malibu Surfing', 'Cedar Sauna', 'Cold Plunge', 'Trail Running', 'Clean Wine'],
    initiatesFirst: false,
    openingDm: 'Matched with Astrid • Back from First Point surf. Make the first move.',
    xrayLeak:
      'CLUE CHECK: Match her active mornings, then pamper her in the evening.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Golden-Hour Malibu Surf',
          shortTab: '🏄‍♀️ Surf',
          vibeNote: 'Sunlit blonde waves, barefoot with her board at First Point.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/astrid-41f.jpg',
        },
      ],
      [
        {
          url: './images/scenes/hotel-pool-sauna.jpg',
          tab: '🧖‍♀️ Sauna',
          caption: 'Photo 2 of 6 • 190°F Cedar Sauna Steam',
          note: 'Post-surf recovery ritual.',
          variant: 'golden_trail_stud',
        },
        ...DEFAULT_EXTRA_SCENES.slice(0, 4),
      ],
    ),
  },
  {
    id: 'her-scarlett-51',
    name: 'Scarlett',
    age: 51,
    height: '5\'6"',
    zodiac: 'Taurus',
    lookBadge: 'Copper Redhead • Emerald Eyes • Sommelier',
    occupation: 'Osteria Chef-Owner & Master Sommelier',
    schoolAndMajor: 'Court of Master Sommeliers • Culinary Arts',
    fieldOfWork: 'Fine Dining & Wine',
    distance: '5 miles away',
    activeAgo: 'Active 9m ago',
    spotifyAnthem: 'Florence + The Machine • Cosmic Love',
    tinderBio:
      '51, fiery copper curls, emerald eyes, hourglass curves, and keys to a 900-bottle Italian cellar 🍷 Bring an appetite, steady hands, and appreciation for a real woman.',
    hingePromptQuestion: 'Best perk of dating a 51yo Chef Jaguar',
    hingePromptAnswer: 'Midnight truffle pasta in a silk kimono after service closes.',
    secondPromptQuestion: 'Instant turn-on',
    secondPromptAnswer: 'Steady eye contact across a candlelit booth.',
    ageShockZoom: true,
    ageShockQuipHer: 'Copper Osteria Jaguar.',
    ageShockQuipHim:
      '51F copper-redhead sommelier, pure Italian-cinema magnetism.',
    lookingFor: 'Sensual, devoted partnership',
    lookingForSubtext: 'Ruins chain-restaurant pasta for you forever.',
    interests: ['Barolo & Brunello', 'Infinity Pools', 'Handmade Pasta', 'Amalfi Coast', 'Vinyl Soul'],
    initiatesFirst: false,
    openingDm: 'Matched with Scarlett • Never suggest a chain restaurant.',
    xrayLeak:
      'CLUE CHECK: Bring unhurried devotion and appreciate handmade midnight cooking.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Sunset Stone-Terrace Barolo',
          shortTab: '🍷 Terrace',
          vibeNote: 'Copper-red waves, emerald eyes, golden coastal sunset.',
          variant: 'tailored_linen',
          photoUrl: './images/cast/scarlett-51f.jpg',
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'her-priya-35',
    name: 'Priya',
    age: 35,
    height: '5\'3"',
    zodiac: 'Scorpio',
    lookBadge: '5\'3" • Hazel Eyes • Trauma RN & Dog Mom',
    occupation: 'Night-Shift Trauma RN',
    schoolAndMajor: 'UCSF • BSN Trauma & Critical Care',
    fieldOfWork: 'Level-1 Hospital Trauma',
    distance: '2 miles away',
    activeAgo: 'Active 7m ago',
    spotifyAnthem: 'Frank Ocean • Pink + White',
    tinderBio:
      '5\'3" night-shift trauma RN + golden retriever Rani 🐕 After 7 PM, 7 AM saving lives, I want sunlit canyon hikes, 7:30 AM street tacos, and zero mansplaining.',
    hingePromptQuestion: 'Veto power belongs to',
    hingePromptAnswer: 'Rani (my 65-lb golden retriever). Bring trail treats and you’re top 1%.',
    ageShockZoom: false,
    ageShockQuipHer: 'Night-shift Trauma RN Puma.',
    ageShockQuipHim:
      '35F trauma nurse hiking with Rani, brilliant, petite, and allergic to flakes.',
    lookingFor: 'Playful zero-baggage spark',
    lookingForSubtext: 'Guard her daytime sleep and bring breakfast tacos at 7:30 AM.',
    interests: ['Canyon Hiking', 'Golden Retrievers', '7 AM Tacos', 'Reformer Pilates', 'Travel'],
    initiatesFirst: false,
    openingDm: 'Matched with Priya • Off trauma shift at seven. Send one sharp line.',
    xrayLeak:
      'CLUE CHECK: Win Rani over first and respect 12-hour night-shift schedules.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Coastal Canyon Hike With Golden Retriever Rani',
          shortTab: '🏔️ Rani Hike',
          vibeNote: 'Sunlit trail grin with golden retriever Rani.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/priya-35f.jpg',
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'her-meiling-48',
    name: 'Mei-Ling',
    age: 48,
    height: '5\'7"',
    zodiac: 'Virgo',
    lookBadge: '5\'7" • Black Cat Poise • Principal Architect',
    occupation: 'Principal Coastal Architect',
    schoolAndMajor: 'Harvard GSD • Master of Architecture',
    fieldOfWork: 'Cliffside Residential Architecture',
    distance: '4 miles away',
    activeAgo: 'Active 12m ago',
    spotifyAnthem: 'Khruangbin • Texas Sun',
    tinderBio:
      '48F architect designing cliffside ocean homes 🐈‍⬛ Certified Black Cat energy: I take my time, push back on smooth-talking rushers, and guard my peace fiercely.',
    hingePromptQuestion: 'Ideal weekend rhythm',
    hingePromptAnswer: 'Ocean infinity-pool swim, hand-pulled noodles or omakase, and zero loud small talk.',
    ageShockZoom: true,
    ageShockQuipHer: 'Quiet-luxury Black Cat Cougar.',
    ageShockQuipHim:
      '48F coastal architect, timeless poise and bone-dry wit.',
    lookingFor: 'Refined slow-burn chemistry',
    lookingForSubtext: 'Notices every detail from your fingernails to how you treat waitstaff.',
    interests: ['Infinity Pools', 'Modern Architecture', 'Omakase', 'Kyoto & Big Sur', 'Art Books'],
    initiatesFirst: false,
    openingDm: 'Matched with Mei-Ling • Certified Black Cat: she waits for your move.',
    xrayLeak:
      'CLUE CHECK: Never rush her pace, steady, unbothered warmth wins.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Sunset Ocean-View Infinity Pool',
          shortTab: '🏖️ Big Sur',
          vibeNote: 'Crisp white linen shorts, minimalist Big Sur glamour.',
          variant: 'tailored_linen',
          photoUrl: './images/cast/meiling-48f.jpg',
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'her-vivienne-61',
    name: 'Vivienne',
    age: 61,
    height: '5\'9"',
    zodiac: 'Leo',
    lookBadge: '5\'9" • Silver Braids • 61F Fashion Icon',
    occupation: 'Former NYC Fashion Director',
    schoolAndMajor: 'Parsons • Fashion Direction',
    fieldOfWork: 'Editorial Runway & Archives',
    distance: '5 miles away',
    activeAgo: 'Active 15m ago',
    spotifyAnthem: 'Prince • Diamonds and Pearls',
    tinderBio:
      '61, waist-length silver braids, Mediterranean balconies, and thirty years of Paris runway stories. Only match if you walk tall holding my hand in public and pour a proper Negroni.',
    hingePromptQuestion: 'Age-gap rule #1',
    hingePromptAnswer: 'Never whisper, never flinch at a waiter’s double-take, and earn "Good boy" properly.',
    ageShockZoom: true,
    ageShockQuipHer: 'Silver-Braids Panther.',
    ageShockQuipHim:
      '61F former NYC fashion director, commands the entire coastline.',
    lookingFor: 'Bold, attentive younger gentleman',
    lookingForSubtext: 'Unapologetic piazza devotion and Prince on vinyl.',
    interests: ['Mediterranean Sea Swims', 'Fashion Archives', 'Negronis', 'Prince & Sade Vinyl', 'Art'],
    initiatesFirst: true,
    openingDm: 'Most younger men just stare across the gallery. Walk over properly.',
    xrayLeak:
      'CLUE CHECK: Call instead of texting slang, keep your phone face-down all night.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Mediterranean Balcony Swimsuit & Ivory Kaftan',
          shortTab: '🏖️ Coast',
          vibeNote: 'Silver braids, bronze swimwear, gold hoops.',
          variant: 'tailored_linen',
          photoUrl: './images/cast/vivienne-61f.jpg',
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'her-serena-43',
    name: 'Serena',
    age: 43,
    height: '5\'2"',
    zodiac: 'Leo',
    lookBadge: '5\'2" • Chestnut Waves • Trophy-Wife Rebirth',
    occupation: 'Luxury Creative Consultant',
    schoolAndMajor: 'UCLA • Design & Visual Culture',
    fieldOfWork: 'Luxury Creative Direction',
    distance: '4 miles away',
    activeAgo: 'Active 11m ago',
    spotifyAnthem: 'Sabrina Carpenter • Espresso',
    tinderBio:
      '5\'2", happily divorced from a hyper-critical 52yo ex. In my unapologetic Trophy-Wife rebirth: bring fresh peonies, open every passenger door, and treat me like the prize.',
    hingePromptQuestion: 'The way to win me over is',
    hingePromptAnswer: 'Open my car door, hand me pink peonies, and say "Turn your brain off, I planned tonight."',
    ageShockZoom: false,
    ageShockQuipHer: '5\'2" Trophy-Wife Rebirth.',
    ageShockQuipHim:
      'Burned by a grumpy older ex, now melts for ambitious younger chivalry.',
    lookingFor: 'Sweeping chivalrous romance',
    lookingForSubtext: 'Never text "idk what do u wanna eat?"',
    interests: ['Fresh Peonies', 'Coastal Convertibles', 'Silk Robes', 'Art Galleries', 'Bistros'],
    initiatesFirst: false,
    openingDm: 'Matched with Serena • Take 100% of the Friday planning lead.',
    xrayLeak:
      'CLUE CHECK: Plan every detail from reservations to peonies.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Sunset Convertible & Fresh Peonies',
          shortTab: '💐 Peonies',
          vibeNote: '5\'2" soft-life Cougar glow.',
          variant: 'tailored_linen',
          photoUrl: './images/cast/serena-43f.jpg',
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'her-valerie-53',
    name: 'Valerie',
    age: 53,
    height: '5\'8"',
    zodiac: 'Sagittarius',
    lookBadge: 'Silver-Streaked • Blue-Grey Eyes • Trail Boss',
    occupation: 'Trail & Athletic Coach',
    schoolAndMajor: 'CU Boulder • Exercise Science',
    fieldOfWork: 'Endurance Coaching',
    distance: '5 miles away',
    activeAgo: 'Active 18m ago',
    spotifyAnthem: 'Nirvana • Heart-Shaped Box',
    tinderBio:
      'Swipe right only if your 25yo cardio survives 6 AM canyon switchbacks on a short leash. Call me at 6 PM. And if I text "Sounds good." with a period and 👍, don’t panic, I’m Gen-X.',
    hingePromptQuestion: 'I’ll brag about you if',
    hingePromptAnswer: 'You match my Saturday trail pace AND can name three tracks off In Utero.',
    ageShockZoom: true,
    ageShockQuipHer: 'Gen-X Trail Jaguar.',
    ageShockQuipHim:
      '53F Jaguar, 6 PM phone calls, crisp periods, and 6 AM switchbacks.',
    lookingFor: 'Active chemistry & real grit',
    lookingForSubtext: 'Zero flakiness, zero Snapchat.',
    interests: ['6 AM Trail Runs', '90s Alt Vinyl', 'Red Wine', 'National Parks', 'Ocean Swims'],
    initiatesFirst: false,
    openingDm: 'Matched with Valerie • She prefers a decisive 1-liner or 6 PM call.',
    xrayLeak:
      'CLUE CHECK: Never panic at her Gen-X period + 👍, and know real Nirvana tracks.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Sunrise Canyon Ridge Overlook',
          shortTab: '🏔️ Ridge',
          vibeNote: 'Out-climbs men half her age before 7 AM.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/valerie-53f.jpg',
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'her-chloe-37',
    name: 'Chloé',
    age: 37,
    height: '5\'2"',
    zodiac: 'Taurus',
    lookBadge: '5\'2" • Child-Free Jet-Setter • Dog Mom',
    occupation: 'Global Brand Strategist',
    schoolAndMajor: 'Northwestern • Journalism',
    fieldOfWork: 'Global Brand Consulting',
    distance: '2 miles away',
    activeAgo: 'Active 4m ago',
    spotifyAnthem: 'Kacey Musgraves • Justified',
    tinderBio:
      '5\'2", happily divorced, 100% child-free by choice, carry-on jet-setter, and my rescue mutt Barnaby has veto power 🐾 Done babysitting bitter 42yo Peter Pans.',
    hingePromptQuestion: 'Quickest way to my heart',
    hingePromptAnswer:
      'Win over Barnaby first, pack in a carry-on, and know where dishwasher pods go without a tutorial.',
    ageShockZoom: false,
    ageShockQuipHer: '5\'2" Child-Free Jet-Setter.',
    ageShockQuipHim:
      '37F child-free dog-mom Puma, bring enthusiasm and pocket treats for Barnaby.',
    lookingFor: ' Spontaneous flights & dog-walk banter',
    lookingForSubtext: 'Allergic to weaponized incompetence.',
    interests: ['Child-Free Travel', 'Rescue Dogs', 'Patio Rosé', 'Farmers Markets', 'Hikes'],
    initiatesFirst: false,
    openingDm: 'Matched with Chloé • Bonus points if you win over Barnaby.',
    xrayLeak:
      'CLUE CHECK: Bring a dog treat for Barnaby and pack fast for weekend trips.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Patio Rosé With Rescue Pup Barnaby',
          shortTab: '🐾 Barnaby',
          vibeNote: '5\'2" child-free jet-setter with Barnaby on watch.',
          variant: 'dog_park_coffee',
          photoUrl: './images/cast/chloe-37f.jpg',
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'her-sienna-38',
    name: 'Sienna',
    age: 38,
    height: '5\'6"',
    zodiac: 'Libra',
    lookBadge: 'Honey Highlights • Vinyl Lounge • 6-Yr Gap',
    occupation: 'Boutique Hotel Designer',
    schoolAndMajor: 'SCAD • Interior Design',
    fieldOfWork: 'Hospitality Design',
    distance: '2 miles away',
    activeAgo: 'Active 3m ago',
    spotifyAnthem: 'LCD Soundsystem • All My Friends',
    tinderBio:
      'Seeking my 6-year-gap match (31, 33M): old enough to remember burning CDs, young enough that I still tease you about 10th-grade geometry while I was ordering martinis.',
    hingePromptQuestion: 'Sweet spot of a 6-year Junior Cougar gap',
    hingePromptAnswer:
      'Zero waiter side-eyes, 100% playful older-woman spark + Le Creuset dinner parties.',
    ageShockZoom: false,
    ageShockQuipHer: 'Junior Cougar sweet spot.',
    ageShockQuipHim:
      '6-year Junior Cougar sweet spot: shared references and homeowner poise.',
    lookingFor: 'Junior Cougar sweet-spot chemistry',
    lookingForSubtext: 'Wears the 6-year Junior Cougar badge proudly.',
    interests: ['Vinyl & Wine Bars', 'Boutique Design', 'Weekend Getaways', 'Cooking', 'Palm Springs'],
    initiatesFirst: false,
    openingDm: 'Matched with Sienna • Break the ice with one sharp line.',
    xrayLeak:
      'CLUE CHECK: Lean into playful 2008 age-math banter.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Golden-Hour Wine & Vinyl Lounge',
          shortTab: '🍸 Vinyl Bar',
          vibeNote: '6-year Junior Cougar charm.',
          variant: 'tailored_linen',
          photoUrl: './images/cast/sienna-38f.jpg',
        },
      ],
      DEFAULT_EXTRA_SCENES,
    ),
  },
  {
    id: 'her-sedona-qigong-mommy',
    name: 'Sedona',
    age: 46,
    height: '5\'8"',
    zodiac: 'Virgo',
    lookBadge: 'Auburn Silver Waves • Qigong Studio Founder',
    occupation: 'Qigong & Nervous-System Studio Founder',
    schoolAndMajor: 'UC Berkeley • Integrative Physiology',
    fieldOfWork: 'Somatic Movement & Breathwork',
    distance: '3 miles away',
    activeAgo: 'Active 2m ago',
    spotifyAnthem: 'Khruangbin •White Gloves',
    tinderBio:
      '6:30 AM bamboo-courtyard Qigong, slow Tai Chi Cloud Hands, and single-estate jasmine oolong 🧘‍♀️🍵 Appreciates a grounded Cub who drops his shoulders and skips podcast Cubsplaining.',
    hingePromptQuestion: 'Quickest way to win my courtyard invite',
    hingePromptAnswer:
      'Match my unhurried breathwork pace, leave the podcast lectures at the door, and enjoy cedar sauna steam.',
    ageShockZoom: false,
    ageShockQuipHer: 'Serene Qigong Studio Founder.',
    ageShockQuipHim:
      '46F Qigong & Tai Chi founder, unhurried calm that melts overthinking.',
    lookingFor: 'Grounded presence & quiet canyon evenings',
    lookingForSubtext: 'Zero tolerance for Cubsplaining or jittery double-texting.',
    interests: ['Qigong & Tai Chi', 'Jasmine Oolong', 'Cedar Sauna', 'Canyon Stargazing', 'Vinyl'],
    initiatesFirst: true,
    openingDm: 'Drop your shoulders. You get one calm line to earn Friday.',
    xrayLeak:
      'CLUE CHECK: Skip the know-it-all podcast clips and suggest a quiet tea lounge or sauna evening.',
    isGreenFlagMatch: true,
    photos: buildSixSlideGallery(
      [
        {
          caption: 'Photo 1 of 6 • Dawn Bamboo-Courtyard Qigong & Cloud Hands',
          shortTab: '🧘‍♀️ Courtyard',
          vibeNote: 'Twenty years of Tai Chi mastery and red-rock calm.',
          variant: 'golden_trail_stud',
          photoUrl: './images/cast/sedona-qigong-46f.jpg',
        },
      ],
      [
        {
          url: './images/scenes/hotel-pool-sauna.jpg',
          tab: '🧖‍♀️ Sauna',
          caption: 'Photo 2 of 6 • Evening Cedar Sauna & Cold Plunge',
          note: 'Phones stay in the locker.',
          variant: 'golden_trail_stud',
        },
        ...DEFAULT_EXTRA_SCENES.slice(0, 4),
      ],
    ),
  },
];

export function getSwipeDeckForRole(role: PlayerRole): SwipeProfile[] {
  return role === 'her' ? APP_SWIPE_PROFILES : HER_SWIPE_PROFILES;
}
