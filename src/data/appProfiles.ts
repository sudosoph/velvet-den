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
  occupation: string;
  distance: string;
  activeAgo: string;
  spotifyAnthem: string;
  tinderBio: string;
  hingePromptQuestion: string;
  hingePromptAnswer: string;
  ageShockZoom: boolean;
  ageShockQuipHer: string;
  ageShockQuipHim: string;
  lookingFor: string;
  lookingForSubtext: string;
  interests: string[];
  openingDm: string;
  xrayLeak: string;
  isGreenFlagMatch: boolean;
  photos: [SwipePhoto, SwipePhoto];
}

export const APP_SWIPE_PROFILES: SwipeProfile[] = [
  {
    id: 'connor-bottle-trap',
    name: 'Connor',
    age: 26,
    height: '6\'1"',
    zodiac: 'Leo',
    occupation: 'SaaS SDR • "Work hard play harder"',
    distance: '3 miles away',
    activeAgo: 'Active 2m ago',
    spotifyAnthem: 'FE!N — Travis Scott',
    tinderBio:
      '6\'1" because apparently that matters 🙄 Boat days, bottle service & Sunday scaries. Never been with an older woman before 👀 bucket list?',
    hingePromptQuestion: 'Two truths and a lie',
    hingePromptAnswer: 'I own a boat (my dad’s), I cook (ramen), and I’m ready to settle down.',
    ageShockZoom: true,
    ageShockQuipHer:
      'WAIT—ZOOM IN ON 26?! I had a 401(k) and a mortgage while this boy was trading Pokémon cards at recess.',
    ageShockQuipHim:
      'Study the competition: Connor’s Photo #1 pulls her in, then Photo #2 detonates his entire credibility.',
    lookingFor: 'Short-term, open to long',
    lookingForSubtext: 'Translation: literally every indecisive man on this app.',
    interests: ['Nightlife', 'Tequila', 'Boat Days', 'EDM'],
    openingDm: 'hey 😍 ngl never been w a cougar before bucket list fr',
    xrayLeak:
      'X-RAY SCAN: Owns zero hand towels, sleeps on a bare memory-foam mattress, and treats older women like an Xbox achievement.',
    isGreenFlagMatch: false,
    photos: [
      {
        caption: 'Photo 1 of 2 • Golden-Hour Coastal Cliff',
        vibeNote: 'Sunlit jawline, fitted henley, killer smile—tap Photo 2 before you dare swipe right!',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/connor-bait.jpg',
      },
      {
        caption: 'Photo 2 of 2 • 2 AM Purple LED Bathroom Mirror',
        vibeNote:
          '🚨 TRAP TRIGGERED: Flexing in board shorts under purple LEDs clutching a handle of Tito’s! Maturity doubt at 100%.',
        variant: 'liquor_bottle_trap',
        photoUrl: './images/cast/connor-bottle-trap.jpg',
        isRedFlagPhoto: true,
      },
    ],
  },
  {
    id: 'tyler-snapchat-ick',
    name: 'Tyler "Ty"',
    age: 24,
    height: '5\'11"',
    zodiac: 'Gemini',
    occupation: '"Founder @ Stealth Crypto"',
    distance: '6 miles away',
    activeAgo: 'Active now',
    spotifyAnthem: ' Nokia — Drake',
    tinderBio:
      'Just moved out of my parents’ pool house 💪 Barely check this app—drop ur Snap so we can streak 🔥',
    hingePromptQuestion: 'My simple pleasures',
    hingePromptAnswer: '2 AM FIFA with the boys, pre-workout dry scoops, and sleeping till noon.',
    ageShockZoom: true,
    ageShockQuipHer:
      '24?! My favorite leather boots are older than his driver’s license.',
    ageShockQuipHim:
      'Classic Cub blunder #2: backhanded age compliment + asking a grown executive for Snapchat.',
    lookingFor: 'Figuring out my dating goals',
    lookingForSubtext: 'Will text "u up?" at 1:14 AM after she has been asleep in silk pajamas since 10.',
    interests: ['Nightlife', 'Clubs', 'Crypto', 'Sneakers'],
    openingDm: 'damn u look crazy good for ur age 🔥 whats ur snap??',
    xrayLeak:
      'X-RAY SCAN: Bare floor mattress, zero bedframe, 3-in-1 shampoo/dish soap, and white crew socks + slides indoors.',
    isGreenFlagMatch: false,
    photos: [
      {
        caption: 'Photo 1 of 2 • Rooftop Blazer Borrowed From His Brother',
        vibeNote: 'Sharp lapel at twilight... wait until you see his bedroom in Photo 2.',
        variant: 'gym_suit_enticing',
        photoUrl: './images/cast/miles-32m.jpg',
      },
      {
        caption: 'Photo 2 of 2 • Floor Mattress & White Crew Socks Selfie',
        vibeNote:
          '🚨 RED FLAG: Bare memory-foam mattress on the floor, gaming headset on a folding chair, crew socks + slides.',
        variant: 'crew_socks_mirror',
        photoUrl: './images/cast/tyler-mattress-trap.jpg',
        isRedFlagPhoto: true,
      },
    ],
  },
  {
    id: 'mateo-trail-gentleman',
    name: 'Mateo',
    age: 26,
    height: '6\'0"',
    zodiac: 'Virgo',
    occupation: 'Doctor of Physical Therapy',
    distance: '2 miles away',
    activeAgo: 'Active 9m ago',
    spotifyAnthem: 'Leon Bridges — Beyond',
    tinderBio:
      'Own an oak bedframe, 600TC cotton sheets, AND a bathroom trash can with a lid. Seeking my 6 AM ridge-trail pace partner & Sunday pasta co-chef.',
    hingePromptQuestion: 'Green flags I look for',
    hingePromptAnswer: 'A woman who knows exactly what she wants and laughs when I tie on the kitchen apron.',
    ageShockZoom: true,
    ageShockQuipHer:
      'Okay, 26 STILL triggers a double-take... wait—read that bio and tap Photo #2.',
    ageShockQuipHim:
      'Textbook green-flag profile: active mornings, domestic competence in Photo #2, and a real reservation plan.',
    lookingFor: 'Intentional relationship',
    lookingForSubtext: 'Pays his own bills, stretches your calves after trail runs, shows up 5 minutes early.',
    interests: ['Trail Running', 'Home Cooking', 'Live Jazz', 'Farmers Markets'],
    openingDm:
      'Your canyon trail photo caught my eye—though I’m pretty sure you’d drop me on mile four. Let me take you for tapas Thursday at 7:30? Real number attached.',
    xrayLeak:
      'X-RAY SCAN: 600-thread-count percale sheets, eucalyptus hand soap, lidded bathroom bin, and fluent post-Title IX EQ.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 2 • 6:15 AM Coastal Ridge Summit',
        vibeNote: 'Hydration vest, genuine sunlit smile, zero frat-bathroom flexing.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/mateo-26m.jpg',
      },
      {
        caption: 'Photo 2 of 2 • Washed Linen-Apron Pasta Prep',
        vibeNote:
          '💚 GREEN FLAG: Spotless marble counters, fresh basil, Japanese cross-back linen apron. Houseboy rating: 11/10.',
        variant: 'home_chef_linen',
        photoUrl: './images/cast/leo-25m.jpg',
      },
    ],
  },
  {
    id: 'julian-peonies-gentleman',
    name: 'Julian',
    age: 27,
    height: '6\'2"',
    zodiac: 'Taurus',
    occupation: 'Structural Engineer',
    distance: '4 miles away',
    activeAgo: 'Active 14m ago',
    spotifyAnthem: 'Sade — Kiss of Life',
    tinderBio:
      'Old soul who opens passenger doors, books 7:30 wine-bar tables before Wednesday, and keeps my phone face-down all through dinner.',
    hingePromptQuestion: 'Together, we could',
    hingePromptAnswer: 'Turn your brain completely off on Friday night—I’ll handle every detail.',
    ageShockZoom: false,
    ageShockQuipHer:
      '27, 6\'2", listens to Sade, AND brings pink peonies? Hold on, let me find my reading glasses.',
    ageShockQuipHim:
      'High-chivalry Princess-Cougar catnip: takes 100% of the date-planning mental load off her plate.',
    lookingFor: 'Long-term partner',
    lookingForSubtext: 'Knows the difference between Pinot Noir and Vodka Red Bull.',
    interests: ['Architecture', 'Sade & Vinyl', 'Cooking', 'Coastal Drives'],
    openingDm:
      'You’ve probably made 400 decisions for everyone else this week—let me handle Friday at 8 at The Velvet Lounge? Peonies included.',
    xrayLeak:
      'X-RAY SCAN: Opens car doors automatically, never films entrées for TikTok, and smells like warm cedar & bergamot.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 2 • Golden-Hour Terrace With Fresh Peonies',
        vibeNote: 'Pressed olive linen button-down, warm dark eyes, genuine romance.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/julian-27m.jpg',
      },
      {
        caption: 'Photo 2 of 2 • Twilight Rooftop Lounge',
        vibeNote: '💚 GREEN FLAG: Tailored navy linen blazer, calm poise, zero ego.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/miles-32m.jpg',
      },
    ],
  },
  {
    id: 'chadwick-cabo-goblin',
    name: 'Chadwick "Chad"',
    age: 23,
    height: '6\'3"',
    zodiac: 'Aries',
    occupation: '"Part-Time DJ / Model"',
    distance: '8 miles away',
    activeAgo: 'Active 1m ago',
    spotifyAnthem: 'Shots — LMFAO',
    tinderBio:
      'Here for a good time not a long time 🔥 Looking for a rich cougar to fly me to Cabo on her Amex lol jk... unless?? 😏',
    hingePromptQuestion: 'First round is on me if',
    hingePromptAnswer: 'Jk first round is on you Mommy 😜',
    ageShockZoom: true,
    ageShockQuipHer:
      '23 AND begging for Cabo flights?! I am a Cougar, sweetie, not Delta SkyMiles.',
    ageShockQuipHim:
      'Never be Chad: confusing an independent older woman with a Sugar Mama gets you blocked in 0.2 seconds.',
    lookingFor: 'Short-term fun',
    lookingForSubtext: 'Card declined on a $14 smoothie yesterday.',
    interests: ['Nightlife', 'VIP Tables', 'Yachts', 'Tequila'],
    openingDm: 'hey mommy when are u taking me shopping 👀💳',
    xrayLeak:
      'X-RAY SCAN: Negative $42 Venmo balance, sleeps until 1:30 PM, thinks "Cougar" means free rent.',
    isGreenFlagMatch: false,
    photos: [
      {
        caption: 'Photo 1 of 2 • Sunset Beach Flex',
        vibeNote: 'Tall, tan... and about to ask for your Wi-Fi password and Hulu login.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/connor-bait.jpg',
      },
      {
        caption: 'Photo 2 of 2 • 1.75L Bottle Flex',
        vibeNote: '🚨 SUGAR-BABY HUNTER DETECTED: Swipe left with extreme prejudice!',
        variant: 'liquor_bottle_trap',
        photoUrl: './images/cast/connor-bottle-trap.jpg',
        isRedFlagPhoto: true,
      },
    ],
  },
];

export const HER_SWIPE_PROFILES: SwipeProfile[] = [
  {
    id: 'her-claire-45',
    name: 'Claire',
    age: 45,
    height: '5\'7"',
    zodiac: 'Scorpio',
    occupation: 'VP of Product',
    distance: '3 miles away',
    activeAgo: 'Active 5m ago',
    spotifyAnthem: 'Fleetwood Mac — Dreams',
    tinderBio:
      'Mortgage paid, kids grown, passport stamped, zero interest in raising another teenager. Impress me with emotional maturity and a spot you booked yourself.',
    hingePromptQuestion: 'Don’t message me if',
    hingePromptAnswer: 'Your opener is "hey" or you ask a 45-year-old woman for her Snapchat.',
    ageShockZoom: true,
    ageShockQuipHer: 'Claire sets the gold standard.',
    ageShockQuipHim:
      '45F VP of Product—radiant, sharp, and smells incompetence from three zip codes away. Bring your A-game!',
    lookingFor: 'Intentional chemistry',
    lookingForSubtext: 'Vets your manners first; unlocks unforgettable weekends second.',
    interests: ['Espresso Martinis', 'Coastal Drives', 'Architecture', 'Pilates'],
    openingDm: 'So—you swiped right on a 45-year-old VP. Tell me your actual Friday plan in two sentences.',
    xrayLeak:
      'INSIDER TIP: Cover tapas within your budget without making it weird, and never say "for your age."',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 2 • Sunset Rooftop Espresso Martini',
        vibeNote: '💚 Champagne silk, effortless confidence, zero games.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/claire-45f.jpg',
      },
      {
        caption: 'Photo 2 of 2 • Golden-Hour Wine Terrace',
        vibeNote: '💚 Appreciates chivalry + post-Title IX emotional intelligence.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/hero-couple.jpg',
      },
    ],
  },
  {
    id: 'her-serena-43',
    name: 'Serena',
    age: 43,
    height: '5\'6"',
    zodiac: 'Libra',
    occupation: 'Creative Director',
    distance: '4 miles away',
    activeAgo: 'Active 11m ago',
    spotifyAnthem: 'Sabrina Carpenter — Espresso',
    tinderBio:
      'I make 400 executive decisions before Thursday. On Friday night I want fresh peonies, passenger-princess treatment, and zero mental load.',
    hingePromptQuestion: 'The way to win me over is',
    hingePromptAnswer: 'Open my car door, hand me flowers, and say "Turn your brain off—I planned tonight."',
    ageShockZoom: false,
    ageShockQuipHer: 'Soft-life royalty.',
    ageShockQuipHim:
      'Secret unlocked: she does NOT want to boss you around—she wants chivalrous soft-life pampering!',
    lookingFor: 'Chivalrous romance',
    lookingForSubtext: 'Do NOT text her "idk what do u wanna eat?"',
    interests: ['Peonies', 'Wine Bars', 'Silk Robes', 'Art Galleries'],
    openingDm: 'I’ve been running meetings since 7 AM. Impress me—how are you spoiling me this Friday?',
    xrayLeak:
      'INSIDER TIP: Plan every detail from parking to reservations so she never has to play project manager.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 2 • Sunset Convertible & Fresh Peonies',
        vibeNote: '💚 Soft-life Cougar energy at its peak.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/serena-43f.jpg',
      },
      {
        caption: 'Photo 2 of 2 • Sidewalk Espresso Glow',
        vibeNote: '💚 Melts for thoughtful old-school courtship.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/maya-36f.jpg',
      },
    ],
  },
  {
    id: 'her-valerie-53',
    name: 'Valerie',
    age: 53,
    height: '5\'8"',
    zodiac: 'Sagittarius',
    occupation: 'Pilates Studio Founder',
    distance: '5 miles away',
    activeAgo: 'Active 18m ago',
    spotifyAnthem: 'Lenny Kravitz — Fly Away',
    tinderBio:
      'Swipe right only if your 25-year-old cardio can survive my 6 AM canyon switchbacks on a short leash. Call me at 6; don’t text me 40 memes at noon.',
    hingePromptQuestion: 'I’ll brag about you to my friends if',
    hingePromptAnswer: 'You match my trail pace Saturday AND cook pasta in a linen apron Sunday.',
    ageShockZoom: true,
    ageShockQuipHer: 'Apex Jaguar.',
    ageShockQuipHim:
      '53F Jaguar in peak athletic form—get ready for a 6 PM phone call and a 6 AM canyon climb!',
    lookingFor: 'Active chemistry & real grit',
    lookingForSubtext: 'Gen-X rule: zero flakiness, zero Snapchat.',
    interests: ['6 AM Trail Runs', 'Reformer Pilates', 'Red Wine', 'Travel'],
    openingDm: 'You claim you have stamina? Meet me at the canyon trailhead at 6:00 AM sharp—don’t be late.',
    xrayLeak:
      'INSIDER TIP: Hydrate Friday night, match her stride Saturday morning, and own public stares with pride.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 2 • Sunrise Canyon Ridge Overlook',
        vibeNote: '💚 Fitter at 53 than your entire frat group chat.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/valerie-53f.jpg',
      },
      {
        caption: 'Photo 2 of 2 • Palm Springs Sunset',
        vibeNote: '💚 Unapologetic Gen-X confidence.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/celeste-62f.jpg',
      },
    ],
  },
];

export function getSwipeDeckForRole(role: PlayerRole): SwipeProfile[] {
  return role === 'her' ? APP_SWIPE_PROFILES : HER_SWIPE_PROFILES;
}
