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
  isRedFlagPhoto?: boolean;
}

export interface SwipeProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  distance: string;
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
    occupation: ' SaaS SDR • "Work hard play harder"',
    distance: '4 miles away',
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
        caption: 'Photo 1 of 2 • Golden-Hour Coastal Trail',
        vibeNote: 'Okay wait... sunlit jawline, athletic tee, strong start—check Photo 2 before swiping!',
        variant: 'golden_trail_stud',
      },
      {
        caption: 'Photo 2 of 2 • 2 AM LED Apartment Mirror',
        vibeNote:
          '🚨 TRAP TRIGGERED: Shirtless under purple LED strips clutching a handle of Tito’s! Maturity doubt at 100%.',
        variant: 'liquor_bottle_trap',
        isRedFlagPhoto: true,
      },
    ],
  },
  {
    id: 'tyler-snapchat-ick',
    name: 'Tyler',
    age: 24,
    occupation: '"Entrepreneur" • Day Trader',
    distance: '7 miles away',
    ageShockZoom: true,
    ageShockQuipHer:
      '24?! My favorite leather boots are almost as old as his voter registration.',
    ageShockQuipHim:
      'Classic Cub blunder #2: backhanded age compliment followed immediately by asking a grown woman for Snapchat.',
    lookingFor: 'Figuring out my dating goals',
    lookingForSubtext: 'Will text "u up?" at 1:14 AM after she has been asleep in silk pajamas since 10.',
    interests: ['Nightlife', 'Clubs', 'Crypto', 'Sneakers'],
    openingDm: 'damn u look crazy good for ur age 🔥 whats ur snap??',
    xrayLeak:
      'X-RAY SCAN: Communicates exclusively in disappearing ceiling selfies and has 3 roommates playing FIFA at max volume.',
    isGreenFlagMatch: false,
    photos: [
      {
        caption: 'Photo 1 of 2 • Cousin’s Wedding Blazer',
        vibeNote: 'Clean taper, tailored lapel... promising!',
        variant: 'gym_suit_enticing',
      },
      {
        caption: 'Photo 2 of 2 • Unmade Bed & Crew Socks',
        vibeNote:
          '🚨 RED FLAG: Toothpaste flecks on the mirror, pile of laundry, white crew socks + slides indoors.',
        variant: 'crew_socks_mirror',
        isRedFlagPhoto: true,
      },
    ],
  },
  {
    id: 'mateo-trail-gentleman',
    name: 'Mateo',
    age: 26,
    occupation: 'Physical Therapist & Trail Runner',
    distance: '3 miles away',
    ageShockZoom: true,
    ageShockQuipHer:
      'Okay, 26 STILL triggers a double-take... wait—read that bio and check Photo #2.',
    ageShockQuipHim:
      'Textbook green-flag profile: active lifestyle, domestic competence in Photo #2, and a direct reservation plan.',
    lookingFor: 'Intentional relationship',
    lookingForSubtext: 'Pays his own bills, owns an oak bedframe, and shows up 5 minutes early.',
    interests: ['Trail Running', 'Home Cooking', 'Live Jazz', 'Farmers Markets'],
    openingDm:
      'Your ridge trail photo caught my eye—though I’m pretty sure you’d drop me on mile four. Let me take you for tapas Thursday at 7:30? Real number attached if you prefer a quick call.',
    xrayLeak:
      'X-RAY SCAN: 600-thread-count percale sheets, eucalyptus hand soap, bathroom bin WITH A LID, and genuine post-Title IX emotional literacy.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 2 • 6:30 AM Ridge Summit',
        vibeNote: 'Hydration vest, genuine smile, zero flexing in a frat bathroom.',
        variant: 'golden_trail_stud',
      },
      {
        caption: 'Photo 2 of 2 • Sunday Pasta Prep in Linen Apron',
        vibeNote:
          '💚 GREEN FLAG: Spotless kitchen counters, fresh basil, washed cross-back linen apron. Houseboy potential off the charts.',
        variant: 'home_chef_linen',
      },
    ],
  },
  {
    id: 'devon-architect-cub',
    name: 'Devon',
    age: 28,
    occupation: 'Junior Architect • Vinyl Collector',
    distance: '5 miles away',
    ageShockZoom: false,
    ageShockQuipHer:
      '28—frontal lobe fully developed, tailored linen shirt, zero liquor bottles in sight.',
    ageShockQuipHim:
      'High-chivalry Princess-Cougar catnip: takes 100% of the date-planning mental load off her plate.',
    lookingFor: 'Long-term partner',
    lookingForSubtext: 'Knows the difference between Pinot Noir and Vodka Red Bull.',
    interests: ['Architecture', 'Vinyl Records', 'Espresso', 'Art Museums'],
    openingDm:
      'You have magnetic energy. You’ve probably made decisions for everyone else all week—let me handle Friday at 8 at The Velvet Lounge? Just show up.',
    xrayLeak:
      'X-RAY SCAN: Opens passenger doors automatically, never films his entrée for TikTok, and keeps his phone face-down all night.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 2 • Architectural Bookshop',
        vibeNote: 'Pressed olive linen button-down, calm eye contact.',
        variant: 'tailored_linen',
      },
      {
        caption: 'Photo 2 of 2 • Sunday Morning Cortado',
        vibeNote: '💚 GREEN FLAG: Ironed trousers, warm smile, radiating emotional stability.',
        variant: 'dog_park_coffee',
      },
    ],
  },
];
