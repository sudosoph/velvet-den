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
  openingDm: string;
  xrayLeak: string;
  isGreenFlagMatch: boolean;
  photos: SwipePhoto[];
}

export const APP_SWIPE_PROFILES: SwipeProfile[] = [
  {
    id: 'connor-bottle-trap',
    name: 'Connor',
    age: 26,
    height: '6\'1"',
    zodiac: 'Leo',
    lookBadge: 'Sunlit Brunette • Classic Trap',
    occupation: 'SaaS SDR • "Work hard play harder"',
    distance: '3 miles away',
    activeAgo: 'Active 2m ago',
    spotifyAnthem: 'FE!N — Travis Scott',
    tinderBio:
      '6\'1" because apparently that matters 🙄 Boat days, bottle service & Sunday scaries. Never been with an older woman before 👀 bucket list?',
    hingePromptQuestion: 'Two truths and a lie',
    hingePromptAnswer: 'I own a boat (my dad’s), I cook (ramen), and I’m ready to settle down.',
    secondPromptQuestion: 'Typical Sunday',
    secondPromptAnswer: 'Recovering from Saturday table service until 4 PM.',
    ageShockZoom: true,
    ageShockQuipHer:
      'WAIT—ZOOM IN ON 26?! I had a 401(k) and a mortgage while this boy was trading Pokémon cards at recess.',
    ageShockQuipHim:
      'Study the competition: Connor’s Photo #1 pulls her in, then Photo #2 detonates his entire credibility.',
    lookingFor: 'Short-term, open to long',
    lookingForSubtext: 'Translation: literally every indecisive man on this app.',
    interests: ['Nightlife', 'Tequila', 'Boat Days', 'EDM', 'Bottle Service'],
    openingDm: 'hey 😍 ngl never been w a cougar before bucket list fr',
    xrayLeak:
      'X-RAY SCAN: Owns zero hand towels, sleeps on a bare memory-foam mattress, and treats older women like an Xbox achievement.',
    isGreenFlagMatch: false,
    photos: [
      {
        caption: 'Photo 1 of 2 • Golden-Hour Coastal Cliff',
        shortTab: 'Photo 1 (The Bait)',
        vibeNote: 'Sunlit jawline, fitted henley, killer smile—tap Photo 2 before you dare swipe right!',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/connor-bait.jpg',
      },
      {
        caption: 'Photo 2 of 2 • 2 AM Purple LED Bathroom Mirror',
        shortTab: 'Photo 2 (The Truth 👀)',
        vibeNote:
          '🚨 TRAP TRIGGERED: Flexing in board shorts under purple LEDs clutching a handle of Tito’s! Maturity doubt at 100%.',
        variant: 'liquor_bottle_trap',
        photoUrl: './images/cast/connor-bottle-trap.jpg',
        isRedFlagPhoto: true,
      },
    ],
  },
  {
    id: 'marcus-firefighter-gentleman',
    name: 'Marcus',
    age: 26,
    height: '6\'2"',
    zodiac: 'Scorpio',
    lookBadge: '6\'2" • Clean Fade • Rescue-Dog Dad',
    occupation: 'Firefighter / Paramedic & Station Chef',
    distance: '2 miles away',
    activeAgo: 'Active 4m ago',
    spotifyAnthem: 'Maxwell — Ascension (Don’t Ever Wonder)',
    tinderBio:
      '6\'2" firefighter, rescue-dog dad to Otis 🐾, and undefeated firehouse Cajun pasta champion. Raised by three aunties—so yes, your passenger seat warmer is already on Level 3 and I carry every Trader Joe’s bag in one trip.',
    hingePromptQuestion: 'Green flags I bring to the table',
    hingePromptAnswer:
      'Silk-pillowcase respect, spare claw clip in my glovebox, 225-lb bench stamina, and a lidded bathroom bin.',
    secondPromptQuestion: 'Ideal Sunday together',
    secondPromptAnswer: 'Beach run with Otis at 8, farmers market at 10, cooking you lemon-garlic shrimp by 6.',
    ageShockZoom: true,
    ageShockQuipHer:
      '26, 6\'2", firefighter paramedic who runs the beach with his rescue dog AND cooks?! Hold my reading glasses.',
    ageShockQuipHim:
      'Elite Cub blueprint: athletic beach + dog shot, domestic mastery, and zero douchey mirror flexing.',
    lookingFor: 'Intentional long-term romance',
    lookingForSubtext: 'Calm in emergencies, shows up 5 minutes early, never plays texting games.',
    interests: [
      'Beach Runs',
      'Rescue Dogs',
      'Cajun Cooking',
      '90s R&B Vinyl',
      'Strength Training',
      'Farmers Markets',
      'Coastal Drives',
    ],
    openingDm:
      'Otis and I just finished our sunset beach mile—let me book us a quiet corner booth Friday at 7:30 so you don’t have to make a single decision all night?',
    xrayLeak:
      'X-RAY SCAN: Crisp white percale sheets, sandalwood beard oil, extra phone charger on the nightstand, 12/10 emotional availability.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Sunset Beach Jog With Rescue Pup Otis',
        shortTab: '🏖️ Beach & Dog',
        vibeNote: '💚 GREEN FLAG: Shirtless ocean mile with his scruffy rescue dog—pure effortless warmth.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/marcus-26m.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Sunday Park Rosé & Charcuterie',
        shortTab: '🐾 Dog Picnic',
        vibeNote: '💚 Packed strawberries, baguette, and a water bowl without being asked.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Washed Linen-Apron Pasta Prep',
        shortTab: '🍝 Chef Mode',
        vibeNote: '💚 Spotless marble counters and homemade sauce—Certified Houseboy material.',
        variant: 'home_chef_linen',
        photoUrl: './images/cast/leo-25m.jpg',
      },
    ],
  },
  {
    id: 'tyler-snapchat-ick',
    name: 'Tyler "Ty"',
    age: 24,
    height: '5\'11"',
    zodiac: 'Gemini',
    lookBadge: 'Borrowed Blazer • Floor-Mattress Energy',
    occupation: '"Founder @ Stealth Crypto"',
    distance: '6 miles away',
    activeAgo: 'Active now',
    spotifyAnthem: 'Nokia — Drake',
    tinderBio:
      'Just moved out of my parents’ pool house 💪 Barely check this app—drop ur Snap so we can streak 🔥',
    hingePromptQuestion: 'My simple pleasures',
    hingePromptAnswer: '2 AM FIFA with the boys, pre-workout dry scoops, and sleeping till noon.',
    secondPromptQuestion: 'Controversial opinion',
    secondPromptAnswer: 'Top sheets and bedframes are a scam invented by Big Mattress.',
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
        shortTab: 'Photo 1 (The Bait)',
        vibeNote: 'Sharp lapel at twilight... wait until you see his bedroom in Photo 2.',
        variant: 'gym_suit_enticing',
        photoUrl: './images/cast/miles-32m.jpg',
      },
      {
        caption: 'Photo 2 of 2 • Floor Mattress & White Crew Socks Selfie',
        shortTab: 'Photo 2 (The Truth 👀)',
        vibeNote:
          '🚨 RED FLAG: Bare memory-foam mattress on the floor, gaming headset on a folding chair, crew socks + slides.',
        variant: 'crew_socks_mirror',
        photoUrl: './images/cast/tyler-mattress-trap.jpg',
        isRedFlagPhoto: true,
      },
    ],
  },
  {
    id: 'liam-redhead-hiker',
    name: 'Liam',
    age: 28,
    height: '6\'1"',
    zodiac: 'Taurus',
    lookBadge: 'Copper Redhead • Emerald-Green Eyes',
    occupation: 'Custom Furniture Maker & Trail Runner',
    distance: '3 miles away',
    activeAgo: 'Active 6m ago',
    spotifyAnthem: 'Hozier — Too Sweet',
    tinderBio:
      'Custom woodworker with copper hair, green eyes, and an actual toolbelt 🛠️ I build walnut dining tables by day, hike pine ridges at sunrise, and delight in fixing every squeaky cabinet hinge in your house.',
    hingePromptQuestion: 'Weirdest gift I’ll bring you',
    hingePromptAnswer: 'A hand-carved olivewood charcuterie board and a ribeye seared in cast iron.',
    secondPromptQuestion: 'Dating me looks like',
    secondPromptAnswer: 'Zero tech-bro jargon, warm flannel hugs after cold hikes, and reading dim Italian menus aloud.',
    ageShockZoom: false,
    ageShockQuipHer:
      'Copper curls, emerald eyes, AND builds custom furniture with his hands? Somebody fan me.',
    ageShockQuipHim:
      'Rugged competence + warmth: proves you don’t need a Wall Street bonus when you bring real craft and devotion.',
    lookingFor: 'Long-term partnership',
    lookingForSubtext: 'Smells like cedarwood and bergamot; reaches every top shelf effortlessly.',
    interests: [
      'Mountain Hiking',
      'Woodworking',
      'Cast-Iron Cooking',
      'Rescue Dogs',
      'Live Folk & Blues',
      'National Parks',
      'Espresso',
    ],
    openingDm:
      'I just finished sanding a walnut table and spotted your profile—can I take you for wood-fired pizza and good red wine Friday at 7:30?',
    xrayLeak:
      'X-RAY SCAN: Handbuilt solid walnut bedframe, botanical soap, cast-iron skillet seasoned to perfection.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Sunrise Pine Ridge Trail',
        shortTab: '🏔️ Trail Hike',
        vibeNote: '💚 GREEN FLAG: Copper curls, emerald eyes, rolled flannel sleeves & trail coffee.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/liam-28m.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Golden-Hour Dog Park Picnic',
        shortTab: '🐾 Dog Picnic',
        vibeNote: '💚 Brought his handmade charcuterie board and chilled rosé to the park.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Sunday Kitchen Pasta Prep',
        shortTab: '🍝 Kitchen',
        vibeNote: '💚 Leaves your kitchen cleaner than he found it.',
        variant: 'home_chef_linen',
        photoUrl: './images/cast/leo-25m.jpg',
      },
    ],
  },
  {
    id: 'lucas-blonde-swimmer',
    name: 'Lucas',
    age: 30,
    height: '6\'3"',
    zodiac: 'Libra',
    lookBadge: 'Sunlit Blonde • Ocean-Blue Eyes • Swimmer',
    occupation: 'Sports Medicine MD Fellow',
    distance: '4 miles away',
    activeAgo: 'Active 8m ago',
    spotifyAnthem: ' Rüfüs Du Sol — Innerbloom',
    tinderBio:
      'Former D1 swimmer turned sports-medicine doc 🏊‍♂️ Sun-bleached hair, ocean-blue eyes, and fluent in wine lists, SPF 50 shoulder rubs, and post-Pilates neck massages. Exclusively attracted to women who have their life dialed in.',
    hingePromptQuestion: 'Together, we could',
    hingePromptAnswer: 'Escape to Palm Springs Friday afternoon—poolside cabanas, Sancerre, and zero stress.',
    secondPromptQuestion: 'My secret superpower',
    secondPromptAnswer: 'Releasing tight rotator cuffs in 90 seconds and keeping bedrooms at a crisp 62°F.',
    ageShockZoom: false,
    ageShockQuipHer:
      '30yo blonde ocean-eyed sports doctor in sky-blue swim trunks?! Yes, my shoulder suddenly hurts.',
    ageShockQuipHim:
      '30s Cub perfection: poolside fitness without gym-mirror vanity, paired with real career grounding.',
    lookingFor: 'Committed relationship',
    lookingForSubtext: 'Zero roommate chaos, loves strong accomplished women, elite travel partner.',
    interests: [
      'Ocean Swimming',
      'Palm Springs Cabanas',
      'Sports Medicine',
      'Tennis',
      'Crisp Sancerre',
      'Coastal Runs',
    ],
    openingDm:
      'Between hospital rounds and morning laps I rarely swipe—until your smile stopped me cold. Drinks on the terrace Thursday at 7:30?',
    xrayLeak:
      'X-RAY SCAN: Bamboo cooling sheets, stocked sparkling water fridge, medical-grade shoulder massages.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Palm Springs Poolside Laps',
        shortTab: '🏊‍♂️ Poolside',
        vibeNote: '💚 GREEN FLAG: Sunlit blonde, ocean-blue eyes, natural poolside grin—zero bathroom mirror cringe.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/lucas-30m.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Twilight Rooftop Wine Bar',
        shortTab: '🍸 Blazer Night',
        vibeNote: '💚 Cleans up effortlessly in tailored navy linen.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/miles-32m.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Park Rosé & Pups',
        shortTab: '🐾 Dog Picnic',
        vibeNote: '💚 Weekend golden-hour picnic energy.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
    ],
  },
  {
    id: 'jin-climber-chef',
    name: 'Jin',
    age: 25,
    height: '6\'0"',
    zodiac: 'Virgo',
    lookBadge: '6\'0" • Forearm Tattoo • Sous-Chef & Climber',
    occupation: 'Fine-Dining Sous Chef & Boulderer',
    distance: '2 miles away',
    activeAgo: 'Active 11m ago',
    spotifyAnthem: 'Daniel Caesar — Best Part',
    tinderBio:
      'Sous-chef at a Michelin bistro by night, outdoor rock climber by morning 🧗‍♂️ Better Korean skincare routine than your dermatologist, elite knife skills, and I never leave a single pan unwashed.',
    hingePromptQuestion: 'I’ll know it’s real when',
    hingePromptAnswer: 'You steal bites from my cutting board at 11 PM while I cook you brown-butter scallops.',
    secondPromptQuestion: 'Non-negotiable habit',
    secondPromptAnswer: 'Daily SPF 50, eucalyptus hand soap, and fresh flowers on your counter every Sunday.',
    ageShockZoom: true,
    ageShockQuipHer:
      '25, forearm tattoo, boulderer grip strength, AND Michelin sous-chef?! Goodbye takeout forever.',
    ageShockQuipHim:
      'Sensory & culinary green flag: athletic activity shot + gourmet caretaking beats flashy flexing every time.',
    lookingFor: 'Intentional chemistry & partnership',
    lookingForSubtext: 'Guards every Sunday off sacredly for date night.',
    interests: [
      'Rock Climbing',
      'Michelin Cooking',
      'Korean Skincare',
      'Natural Wine',
      'Pour-Over Coffee',
      'Vinyl Bars',
    ],
    openingDm:
      'Sunday is my night off the line—let me take you to my favorite tucked-away wine bar at 7:30, or cook handmade pasta at yours?',
    xrayLeak:
      'X-RAY SCAN: Japanese chef knives, snail-mucin & peptide shelf, spotless studio with lidded bin.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Morning Granite Bouldering Session',
        shortTab: '🧗‍♂️ Climbing',
        vibeNote: '💚 GREEN FLAG: Sunlit granite boulder, subtle forearm tattoo, relaxed athletic confidence.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/jin-25m.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Linen-Apron Handmade Pasta',
        shortTab: '🍝 Sous-Chef',
        vibeNote: '💚 Michelin-trained prep and spotless counters.',
        variant: 'home_chef_linen',
        photoUrl: './images/cast/leo-25m.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Golden-Hour Terrace Peonies',
        shortTab: '💐 Date Prep',
        vibeNote: '💚 Always arrives with fresh blooms.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/julian-27m.jpg',
      },
    ],
  },
  {
    id: 'mateo-trail-gentleman',
    name: 'Mateo',
    age: 26,
    height: '6\'0"',
    zodiac: 'Virgo',
    lookBadge: '6\'0" • Dark Waves • Ridge Runner DPT',
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
      'Okay, 26 STILL triggers a double-take... wait—read that bio and tap through his photos.',
    ageShockQuipHim:
      'Textbook green-flag profile: active mornings, domestic competence, and a real reservation plan.',
    lookingFor: 'Intentional relationship',
    lookingForSubtext: 'Pays his own bills, stretches your calves after trail runs, shows up 5 minutes early.',
    interests: ['Trail Running', 'Home Cooking', 'Live Jazz', 'Farmers Markets', 'Physical Therapy'],
    openingDm:
      'Your canyon trail photo caught my eye—though I’m pretty sure you’d drop me on mile four. Let me take you for tapas Thursday at 7:30? Real number attached.',
    xrayLeak:
      'X-RAY SCAN: 600-thread-count percale sheets, eucalyptus hand soap, lidded bathroom bin, and fluent post-Title IX EQ.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • 6:15 AM Coastal Ridge Summit',
        shortTab: '🏔️ Trail Summit',
        vibeNote: 'Hydration vest, genuine sunlit smile, zero frat-bathroom flexing.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/mateo-26m.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Washed Linen-Apron Pasta Prep',
        shortTab: '🍝 Chef Apron',
        vibeNote:
          '💚 GREEN FLAG: Spotless marble counters, fresh basil, Japanese cross-back linen apron. Houseboy rating: 11/10.',
        variant: 'home_chef_linen',
        photoUrl: './images/cast/leo-25m.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Park Rosé & Rescue Dogs',
        shortTab: '🐾 Dog Park',
        vibeNote: '💚 Loves Saturday afternoon dog-park picnics.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
    ],
  },
  {
    id: 'julian-peonies-gentleman',
    name: 'Julian',
    age: 27,
    height: '6\'2"',
    zodiac: 'Taurus',
    lookBadge: '6\'2" • Deep Hazel Eyes • Structural Engineer',
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
    interests: ['Architecture', 'Sade & Vinyl', 'Cooking', 'Coastal Drives', 'Wine Bars'],
    openingDm:
      'You’ve probably made 400 decisions for everyone else this week—let me handle Friday at 8 at The Cougar Lounge? Peonies included.',
    xrayLeak:
      'X-RAY SCAN: Opens car doors automatically, never films entrées for TikTok, and smells like warm cedar & bergamot.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Golden-Hour Terrace With Fresh Peonies',
        shortTab: '💐 Peonies',
        vibeNote: 'Pressed olive linen button-down, warm dark eyes, genuine romance.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/julian-27m.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Twilight Rooftop Lounge',
        shortTab: '🍸 Rooftop',
        vibeNote: '💚 GREEN FLAG: Tailored navy linen blazer, calm poise, zero ego.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/miles-32m.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Park Picnic & Dogs',
        shortTab: '🐾 Picnic',
        vibeNote: '💚 Thoughtful Sunday afternoon picnic planner.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
    ],
  },
  {
    id: 'chadwick-cabo-goblin',
    name: 'Chadwick "Chad"',
    age: 23,
    height: '6\'3"',
    zodiac: 'Aries',
    lookBadge: 'Tan Beach Flex • Sugar-Hunter Trap',
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
        shortTab: 'Photo 1 (The Bait)',
        vibeNote: 'Tall, tan... and about to ask for your Wi-Fi password and Hulu login.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/connor-bait.jpg',
      },
      {
        caption: 'Photo 2 of 2 • 1.75L Bottle Flex',
        shortTab: 'Photo 2 (The Truth 👀)',
        vibeNote: '🚨 SUGAR-BABY HUNTER DETECTED: Swipe left with extreme prejudice!',
        variant: 'liquor_bottle_trap',
        photoUrl: './images/cast/connor-bottle-trap.jpg',
        isRedFlagPhoto: true,
      },
    ],
  },
  {
    id: 'brandon-roblox-dl-trap',
    name: 'Brandon "Brando"',
    age: 24,
    height: '5\'10"',
    zodiac: 'Pisces',
    lookBadge: '"Discrete Only" • 3 AM Roblox Trap',
    occupation: '"Streamer / Between Gigs"',
    distance: '5 miles away',
    activeAgo: 'Active 1m ago',
    spotifyAnthem: '100 gecs — money machine',
    tinderBio:
      'Looking for something discrete / lowkey after 10 PM 👀 Never dated someone born in the late 1900s before lol kinda wild!! Catch me on Roblox Dress to Impress w the boys till 4 AM 🎮',
    hingePromptQuestion: 'Ideal first linkup',
    hingePromptAnswer: 'Come thru after 10:30 PM once my roommates hop on Roblox—no labels, keep it private 🤫',
    secondPromptQuestion: 'Green flag about me',
    secondPromptAnswer: 'My mom still does my laundry on Sundays so my hoodies smell fresh.',
    ageShockZoom: true,
    ageShockQuipHer:
      '"BORN IN THE LATE 1900s"?! "DISCRETE AFTER 10 PM"?! AND ROBLOX TILL 4 AM?! Every single Cougars & Cubs Club alarm bell just exploded!',
    ageShockQuipHim:
      'Study Forum Red Flag #1: writing "discrete/lowkey" + calling 1984 "the late 1900s" gets you launched into orbit.',
    lookingFor: 'Something casual & discrete',
    lookingForSubtext: 'Forum Warning #1: "Discrete" means he either has a girlfriend or hides you from daylight.',
    interests: ['Nightlife', 'Roblox', 'Discord Memes', 'Clubs', 'Energy Drinks'],
    openingDm: 'yo 👀 crazy ur from the 1900s lol u down for a discrete late night link tn??',
    xrayLeak:
      'X-RAY SCAN: Hides older women from his friends, plays Roblox till 4 AM on a floor mattress, and spells discreet wrong.',
    isGreenFlagMatch: false,
    photos: [
      {
        caption: 'Photo 1 of 2 • Daylight Kitchen Smile (Borrowed Apartment)',
        shortTab: 'Photo 1 (The Bait)',
        vibeNote: 'Looks harmless enough in Photo 1... read that bio and check Photo 2!',
        variant: 'home_chef_linen',
        photoUrl: './images/cast/leo-25m.jpg',
      },
      {
        caption: 'Photo 2 of 2 • 3:40 AM Roblox Headset & Floor Mattress',
        shortTab: 'Photo 2 (Roblox 🚩)',
        vibeNote:
          '🚨 FORUM RED FLAG COMBO: "Discrete after 10 PM" + "born in the 1900s" + 3 AM Roblox nest!',
        variant: 'crew_socks_mirror',
        photoUrl: './images/cast/tyler-mattress-trap.jpg',
        isRedFlagPhoto: true,
      },
    ],
  },
  {
    id: 'colton-montana-ranch-cub',
    name: 'Colton',
    age: 25,
    height: '6\'3"',
    zodiac: 'Sagittarius',
    lookBadge: '6\'3" • Sunlit Blonde • Montana Ranch Cowboy',
    occupation: 'Cattle Rancher & Former College WR',
    distance: '4 miles away (Just landed from Bozeman)',
    activeAgo: 'Active 1m ago',
    spotifyAnthem: 'Zach Bryan — Something in the Orange',
    tinderBio:
      '6\'3" Montana ranch kid & ex-college wide receiver 🤠 Yes, I’m the guy who accidentally commented "I love you" from my boys’ shared ranch TikTok before sliding in properly. Glad you lowered your age slider—pack a carry-on for Cabo.',
    hingePromptQuestion: 'Most impulsive green-flag move',
    hingePromptAnswer:
      'Booking a Friday flight from Bozeman just to open your car door, two-step in your kitchen, and carry your luggage.',
    secondPromptQuestion: 'What happens if we get pulled over',
    secondPromptAnswer: 'I smile politely and promise not to ask the cop "Are you gonna give me a ticket?!" 😂',
    ageShockZoom: true,
    ageShockQuipHer:
      '25 AND 6\'3" FROM MONTANA?! Kristin Cavallari tried to warn us what happens when you drag that age slider down!',
    ageShockQuipHim:
      'The Kristin Cavallari × Mark Estes blueprint: fearless charm, country manners, and zero fear of public attention.',
    lookingFor: 'Real whirlwind romance (zero hiding)',
    lookingForSubtext: 'Holds your hand through airports and beams like he won the Super Bowl.',
    interests: ['Montana Ranches', 'Country Two-Step', 'Cabo Sunsets', 'Pickup Trucks', 'Bonfires', 'Golden Retrievers'],
    openingDm:
      'Okay full confession—I almost DMed you from my buddies’ shared ranch account first 😅 Let me take you to steak and live guitar Friday at 7:30?',
    xrayLeak:
      'X-RAY SCAN: Genuine yes-ma’am ranch manners, 6\'3" stairway-carry strength, and proudly posts you on main.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Golden-Hour Ranch Portrait',
        shortTab: '🤠 Ranch Glow',
        vibeNote: '💚 GREEN FLAG: 6\'3", sunlit grin, zero frat-bathroom flexing—pure Montana Boyz energy.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/colton-25m.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Cabo Poolside Weekend',
        shortTab: '🏖️ Cabo Sun',
        vibeNote: '💚 Ready to hop a flight whenever your calendar clears.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/lucas-30m.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Sunday Park Picnic',
        shortTab: '🐾 Picnic',
        vibeNote: '💚 Brings his guitar, strawberries, and zero ego.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
    ],
  },
  {
    id: 'kayden-dutch-venmo-trap',
    name: 'Kayden',
    age: 21,
    height: '5\'9"',
    zodiac: 'Gemini',
    lookBadge: '5\'9" • Campus Hoodie • "Go-Dutch" Trap 🚩',
    occupation: '5th-Year Undergrad • "Strict 50/50 King"',
    distance: '1 mile away (Near Campus)',
    activeAgo: 'Active now',
    spotifyAnthem: 'Lil Dicky — $ave Dat Money',
    tinderBio:
      '21 & thrifty 💸 Big believer in going 50/50 Dutch on first dates down to the exact cent so nobody feels used!! Let’s hit sushi (only during 4:30 PM happy hour tho, my campus Dining Dollars don’t work off-campus lol).',
    hingePromptQuestion: 'First date non-negotiable',
    hingePromptAnswer:
      'Separate checks + I’ll Venmo-request you $3.19 if you eat 4 of the 7 edamame pods 🧮',
    secondPromptQuestion: 'My living situation',
    secondPromptAnswer: '4 guys in a 2-bedroom—don’t mind Kyle eating Cheerios out of a mixing bowl!',
    ageShockZoom: true,
    ageShockQuipHer:
      '21?! AND ITEMIZING EDAMAME PODS ON VENMO?! Drag that age slider right back up to 25 immediately!!',
    ageShockQuipHim:
      'HORRIFYING OBSTACLE #1: Never invite a grown woman out and pull out an iPhone calculator to Venmo-split $0.38 tax. Pick an affordable date you can proudly host!',
    lookingFor: '50/50 Dutch casual vibes',
    lookingForSubtext: 'Will order two dragon rolls + sake Bomb, then divide the total in half onto your Venmo.',
    interests: ['Nightlife', 'Going Dutch', 'Coupons', 'Clubs', 'Campus Dining'],
    openingDm:
      'yo!! down to grab sushi at 4:45 PM happy hour tn if we go dutch?? bring ur Venmo ready lol 🍣🧮',
    xrayLeak:
      'X-RAY SCAN: 🚨 EXTREME RED FLAG! $11.40 checking balance, 3 roommates sharing one towel, and sends itemized Venmo requests before leaving the booth.',
    isGreenFlagMatch: false,
    photos: [
      {
        caption: 'Photo 1 of 2 • Campus Quad Hoodie Selfie',
        shortTab: 'Photo 1 (21yo Bait)',
        vibeNote: 'Harmless-looking college senior in glasses... until the dinner check touches the table!',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/kayden-21m.jpg',
      },
      {
        caption: 'Photo 2 of 2 • 4-Roommate Floor Mattress & Venmo Calculator',
        shortTab: 'Photo 2 (Dutch 🚩)',
        vibeNote:
          '🚨 HORRIFYING RED FLAG: Invites you out, orders double, and Venmo-requests $41.63 from a bare floor mattress!',
        variant: 'crew_socks_mirror',
        photoUrl: './images/cast/tyler-mattress-trap.jpg',
        isRedFlagPhoto: true,
      },
    ],
  },
  {
    id: 'trevor-hawaii-timeshare-trap',
    name: 'Trevor',
    age: 21,
    height: '6\'0"',
    zodiac: 'Leo',
    lookBadge: '6\'0" • College Junior • "My Maui Place" Trap 🚩',
    occupation: 'Undergrad Business Junior • "Bi-Coastal Jetsetter"',
    distance: '2 miles away (Frat Row)',
    activeAgo: 'Active now',
    spotifyAnthem: 'Jack Johnson — Banana Pancakes',
    tinderBio:
      '21 in undergrad 📚 Whenever older women get skeptical about my age I just invite them to my place in Maui for the week 🌺✈️ Oceanfront lanai, Mai Tais, zero stress—pack a bikini!',
    hingePromptQuestion: 'Wait… is "your place in Hawaii" actually your parents’?',
    hingePromptAnswer:
      'Haha okay yeah my mom & stepdad Greg have a biennial Marriott timeshare week!! They’ll just be in the master bedroom down the hall & we get pool-towel wristbands!',
    secondPromptQuestion: 'Only catch on our Maui getaway',
    secondPromptAnswer:
      'My mom says we have to sit through a 90-minute 8 AM lobby timeshare pitch on Tuesday for the free luau buffet vouchers 🌺',
    ageShockZoom: true,
    ageShockQuipHer:
      '"COME TO MY PLACE IN HAWAII" — AND IT’S HIS MOM LINDA’S MARRIOTT TIMESHARE?! Trying to pimp himself out with his parents’ timeshare points while Linda sleeps down the hall!!',
    ageShockQuipHim:
      'COLLEGE RED FLAG HALL OF FAME: Never brag about "my place in Hawaii" when it’s your mom’s Week-14 timeshare binder.',
    lookingFor: 'Someone to split Uber to the airport (Mom booked the room)',
    lookingForSubtext: 'Will introduce you to his mom at the continental waffle iron at 7:45 AM.',
    interests: ['Nightlife', 'Maui Timeshares', 'Spring Break', 'Clubs', 'Mom’s Airline Miles'],
    openingDm:
      'i know ur skeptical bc im 21 & in college lol… let me take u to my place in Hawaii next month! (ok yeah technically my parents have a timeshare there haha u down??) 🌺✈️',
    xrayLeak:
      'X-RAY SCAN: 🚨 MOM’S TIMESHARE FLEXER! Zero deed, zero flight money—his mom Linda & stepdad Greg own Week 14 at the Kāʻanapali Marriott and sleep on the other side of the kitchenette wall.',
    isGreenFlagMatch: false,
    photos: [
      {
        caption: 'Photo 1 of 2 • "My Place in Maui" Resort Pool Flex',
        shortTab: '🏝️ "My Hawaii Place"',
        vibeNote: 'Sunlit resort cabana photo cropped right where his mom’s beach tote was sitting… check Photo 2!',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/noah-22m.jpg',
      },
      {
        caption: 'Photo 2 of 2 • Deeded to Linda & Greg (Week 14 Timeshare Binder)',
        shortTab: '🧾 Mom’s Timeshare 🚩',
        vibeNote:
          '🚨 CAUGHT IN 4K: Trying to pimp himself out with his parents’ biennial Maui timeshare + mandatory 8 AM condo sales pitch!',
        variant: 'crew_socks_mirror',
        photoUrl: './images/cast/kayden-21m.jpg',
        isRedFlagPhoto: true,
      },
    ],
  },
  {
    id: 'sam-golden-retriever-cub',
    name: 'Sam',
    age: 26,
    height: '6\'1"',
    zodiac: 'Cancer',
    lookBadge: '6\'1" • 🐕 Golden-Retriever Energy • Craves Black Cats',
    occupation: 'Pediatric Nurse & Coastal Marathoner',
    distance: '2 miles away',
    activeAgo: 'Active 3m ago',
    spotifyAnthem: 'Hozier — Work Song',
    tinderBio:
      'Unapologetic Golden Retriever energy 🐕 Zero interest in instant-gratification chaos—I go weak in the knees for a cool, unhurried "Black Cat" older woman who takes her time, raises one eyebrow at my jokes, and pushes back a little at first. Don’t rush for me; earning your real smile by Date #3 is my favorite sport.',
    hingePromptQuestion: 'My ultimate romantic kryptonite',
    hingePromptAnswer:
      'When she says "Slow down, eager puppy—convince me" instead of folding on Day 1. Tail wagging immediately.',
    secondPromptQuestion: 'How I handle slow-burn boundaries',
    secondPromptAnswer:
      'Zero sulking, zero double-text panic—just steady 7:30 reservations, warm patience, and fresh flowers when you’re ready.',
    ageShockZoom: false,
    ageShockQuipHer:
      'Wait—a 26yo Golden Retriever who *likes* when I take my time and push back instead of whining that I’m "intimidating"?!',
    ageShockQuipHim:
      'Study the #1 polarity secret: Golden-Retriever warmth + unbothered patience melts a Black Cat Cougar every single time.',
    lookingFor: 'Slow-burn Black Cat × Golden Retriever magic',
    lookingForSubtext: 'Never rushes your pace; beams like sunshine every time you let him closer.',
    interests: [
      'Coastal Marathons',
      'Zero-Proof Mocktails',
      'Post-Run Smoothies',
      'Rescue Dogs',
      'Slow-Burn Romance',
    ],
    openingDm:
      'Something tells me you don’t hand out Friday nights easily—and honestly that’s my favorite green flag on here. Zero rush: iced matcha, post-run smoothie, or a cozy mocktail bar next week?',
    xrayLeak:
      'X-RAY SCAN: 100% pure Golden-Retriever devotion—zero bruised ego when you push back, spotless apartment, and endless patience.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Linen-Apron Sunday Sauce Smile',
        shortTab: '🐕 Golden Smile',
        vibeNote: '💚 GREEN FLAG: Pure sunny Golden-Retriever warmth + spotless marble kitchen.',
        variant: 'home_chef_linen',
        photoUrl: './images/cast/leo-25m.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Sunrise Park Picnic & Pups',
        shortTab: '🐾 Dog Park',
        vibeNote: '💚 Patient, affectionate, and never crowds a shy cat or a selective Cougar.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Coastal Trail Run',
        shortTab: '🏔️ Marathoner',
        vibeNote: '💚 Built for the long run—literally and romantically.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/mateo-26m.jpg',
      },
    ],
  },
  {
    id: 'jaxon-pine-pollen-feels-trap',
    name: 'Jaxon',
    age: 24,
    height: '6\'0"',
    zodiac: 'Aries',
    lookBadge: '6\'0" • Pine-Pollen Biohacker • "All Up in His Feels" 🚩',
    occupation: '"Ancestral Wellness Podcaster & Gym Bro"',
    distance: '3 miles away',
    activeAgo: 'Active now (Typing…)',
    spotifyAnthem: 'Drake — Marvin’s Room',
    tinderBio:
      '24M optimizing my ancestral testosterone naturally w/ raw wildcrafted Pine Pollen tincture, cold plunges & sunning 🌲💪 Big communicator (if you take more than 45 mins to text back at night I WILL get all up in my feels and send 6 paragraphs asking what we are lol).',
    hingePromptQuestion: 'Communication style & expectations',
    hingePromptAnswer:
      'Need 24/7 texting reassurance—if you put Do Not Disturb on at 9:30 PM my pine-pollen T-spike turns into midnight poetry 😭🌲',
    secondPromptQuestion: 'Currently in my gym bag',
    secondPromptAnswer:
      '3 amber droppers of raw pine pollen, mouth tape, and a 9-screen Notes-app text draft.',
    ageShockZoom: true,
    ageShockQuipHer:
      'TAKES PINE POLLEN FOR TESTOSTERONE AND SENDS INCOHERENT MIDNIGHT TEXTS THAT HE’S "ALL UP IN HIS FEELS"?! Communication mishap Category 5!',
    ageShockQuipHim:
      'BIOHACKER RED FLAG: Mega-dosing pine pollen + panicking when an accomplished woman unplugs at 9:30 PM = instant green-bubble exile.',
    lookingFor: 'Constant 24/7 text reassurance + someone to decode my 11:47 PM spirals',
    lookingForSubtext:
      'Expects nonstop group-chat reply speed from a woman with a career, then blames tree pollen.',
    interests: ['Pine Pollen', 'Cold Plunge', 'Biohacking', 'Voice Notes', 'Late-Night Feels'],
    openingDm:
      'brooo took 2 droppers of raw pine pollen for testosterone before legs and ngl im already all up in my feels rn bc u matched 20 mins ago and didnt say hi yet what are we doing here 😭🌲',
    xrayLeak:
      'X-RAY SCAN: 🚨 COMMUNICATION MISHAP HAZARD! Takes pine pollen for "alpha T," ignores her stated unplugged evening boundary, and fires incoherent run-on emotional texts at 11:47 PM.',
    isGreenFlagMatch: false,
    photos: [
      {
        caption: 'Photo 1 of 2 • Post-Cold-Plunge Biohacker Smirk',
        shortTab: '🌲 Biohacker Bait',
        vibeNote: 'Looks fit in Photo 1… until 9:30 PM hits and the pine-pollen dropper comes out!',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/gavin-29m.jpg',
      },
      {
        caption: 'Photo 2 of 2 • 11:47 PM Pine-Pollen Bottle & 6-Bubble "In My Feels" Wall',
        shortTab: '😭 In My Feels 🚩',
        vibeNote:
          '🚨 MISMATCHED EXPECTATIONS: Blasts incoherent unpunctuated midnight texts blaming pine pollen whenever you put your phone down for two hours!',
        variant: 'crew_socks_mirror',
        photoUrl: './images/cast/tyler-mattress-trap.jpg',
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
    lookBadge: 'Espresso Waves • Hazel Eyes • VP Poise',
    occupation: 'VP of Product',
    distance: '3 miles away',
    activeAgo: 'Active 5m ago',
    spotifyAnthem: 'Fleetwood Mac — Dreams',
    tinderBio:
      'Mortgage paid, kids grown, passport stamped, zero interest in raising another teenager. Impress me with emotional maturity, reading dim candlelit menus for me without a joke, and a spot you booked yourself.',
    hingePromptQuestion: 'Don’t message me if',
    hingePromptAnswer: 'Your opener is "hey" or you ask a 45-year-old woman for her Snapchat.',
    secondPromptQuestion: 'Bedroom sanctuary rule',
    secondPromptAnswer: '62°F AC, 100% bamboo cooling sheets, and respect the retinol routine.',
    ageShockZoom: true,
    ageShockQuipHer: 'Claire sets the gold standard.',
    ageShockQuipHim:
      '45F VP of Product—radiant, sharp, and smells incompetence from three zip codes away. Bring your A-game!',
    lookingFor: 'Intentional chemistry',
    lookingForSubtext: 'Vets your manners first; unlocks unforgettable weekends second.',
    interests: [
      'Espresso Martinis',
      'Coastal Drives',
      'Architecture',
      'Pilates',
      'Palm Springs',
      'Sancerre',
    ],
    openingDm: 'So—you swiped right on a 45-year-old VP. Tell me your actual Friday plan in two sentences.',
    xrayLeak:
      'INSIDER TIP: Cover tapas within your budget without making it weird, and never say "for your age."',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 4 • Sunset Rooftop Espresso Martini',
        shortTab: '🍸 Martini',
        vibeNote: '💚 Champagne silk, effortless confidence, zero games.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/claire-45f.jpg',
      },
      {
        caption: 'Photo 2 of 4 • Tropical Waterfall Lagoon Swim',
        shortTab: '👙 Lagoon Swim',
        vibeNote: '💚 Vacation bikini glow—proof PTO is for tropical canyons.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/camila-39f.jpg',
      },
      {
        caption: 'Photo 3 of 4 • Golden-Hour Wine Terrace',
        shortTab: '🥂 Terrace',
        vibeNote: '💚 Appreciates chivalry + post-Title IX emotional intelligence.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/hero-couple.jpg',
      },
      {
        caption: 'Photo 4 of 4 • Sunday Park Rosé Picnic',
        shortTab: '🐾 Picnic',
        vibeNote: '💚 Loves unhurried sunlit afternoons.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
    ],
  },
  {
    id: 'her-simone-44',
    name: 'Simone',
    age: 44,
    height: '5\'8"',
    zodiac: 'Leo',
    lookBadge: '5\'8" • Honey Goddess Braids • Cabana Bikini',
    occupation: 'Entertainment Attorney • "Rich Auntie Era"',
    distance: '3 miles away',
    activeAgo: 'Active 2m ago',
    spotifyAnthem: 'Sade — Cherish the Day',
    tinderBio:
      'Negotiates festival headliners all week; floats in Palm Springs pools in emerald bikinis all weekend 🌴 Waiters still card me like I’m 31. Bring real conversation, silk-pillowcase respect, and don’t embarrass me at the family cookout.',
    hingePromptQuestion: 'Non-negotiable sleepover law',
    hingePromptAnswer: 'Never tug the honey braids accidentally and keep spare silk pillowcases on your bed.',
    secondPromptQuestion: 'Quickest way to impress me',
    secondPromptAnswer: 'Have dinner booked at 8, open my car door, and hold your own with my cousins.',
    ageShockZoom: true,
    ageShockQuipHer: 'Rich Auntie perfection.',
    ageShockQuipHim:
      '44F entertainment attorney in her emerald cabana bikini—stunning, razor-sharp, and allergic to low effort!',
    lookingFor: 'Grown-man chivalry & slow-burn spark',
    lookingForSubtext: 'Financially set for three lifetimes; dates purely for chemistry and devotion.',
    interests: [
      'Palm Springs Bikinis',
      '90s R&B Vinyl',
      'Espresso Tonics',
      'Silk Loungewear',
      'Art Galleries',
      'Cookout Sundays',
    ],
    openingDm:
      'My calendar opens Friday at 7:30 PM sharp—tell me where you’re taking me and prove you don’t use 5-in-1 shower gel.',
    xrayLeak:
      'INSIDER TIP: Compliment her mind and warmth directly, bring fresh flowers, and never touch the thermostat without asking.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Palm Springs Cabana Bikini & Iced Espresso',
        shortTab: '👙 Pool Bikini',
        vibeNote: '💚 Emerald resort bikini, honey goddess braids, effortless Cougar royalty.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/simone-44f.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Sunset Cocktail Terrace',
        shortTab: '🥂 Rooftop',
        vibeNote: '💚 Post-deal celebration glow.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/hero-couple.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Park Rosé & Charcuterie',
        shortTab: '🐾 Picnic',
        vibeNote: '💚 Sunday soft-life standard.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
    ],
  },
  {
    id: 'her-astrid-41',
    name: 'Astrid',
    age: 41,
    height: '5\'9"',
    zodiac: 'Aquarius',
    lookBadge: 'Golden Blonde • Ice-Blue Eyes • Surfer Fit',
    occupation: 'Biotech Founder & Malibu Surfer',
    distance: '4 miles away',
    activeAgo: 'Active 6m ago',
    spotifyAnthem: ' Maggie Rogers — Alaska',
    tinderBio:
      'Malibu-salted biotech founder 🏄‍♀️ Sold my lab company at 39 so I could surf dawn patrol before 7 AM. Blonde, blue-eyed, competitive in a bikini, and looking for a Cub whose stamina survives ocean swells AND cedar saunas.',
    hingePromptQuestion: 'First date challenge',
    hingePromptAnswer: 'Dawn surf at First Point followed by burritos on the tailgate—loser buys coffee.',
    secondPromptQuestion: 'Secret soft spot',
    secondPromptAnswer: 'A younger man with strong shoulders who rubs warm oil into my back after cold water.',
    ageShockZoom: false,
    ageShockQuipHer: 'Nordic Malibu Cougar.',
    ageShockQuipHim:
      '41F golden-blonde surfer founder with ice-blue eyes—better cardio and abs than half of Venice Beach!',
    lookingFor: 'Athletic adventure & real warmth',
    lookingForSubtext: 'Zero makeup, salt-water hair, 100% authentic confidence.',
    interests: [
      'Malibu Surfing',
      'Beach Bikinis',
      'Cedar Sauna',
      'Cold Plunge',
      'Trail Running',
      'Natural Wine',
    ],
    openingDm:
      'Swelled to 4 feet at Malibu this morning—think you can keep up in the lineup Saturday, or are you cooking me dinner Friday first?',
    xrayLeak:
      'INSIDER TIP: Match her active outdoor lifestyle by day, then pamper her thoroughly by night.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Golden-Hour Malibu Surf Bikini',
        shortTab: '🏄‍♀️ Surf Bikini',
        vibeNote: '💚 Sunlit blonde waves, piercing blue eyes, barefoot with her board.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/astrid-41f.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Sunrise Coastal Ridge Climb',
        shortTab: '🏔️ Trail Hike',
        vibeNote: '💚 Cross-trains on canyon switchbacks when the surf is flat.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/valerie-53f.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Dog-Friendly Park Picnic',
        shortTab: '🐾 Dog Picnic',
        vibeNote: '💚 Post-surf strawberries & rosé in the grass.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
    ],
  },
  {
    id: 'her-scarlett-51',
    name: 'Scarlett',
    age: 51,
    height: '5\'6"',
    zodiac: 'Taurus',
    lookBadge: 'Copper Redhead • Emerald-Green Eyes • Curvy',
    occupation: 'Osteria Chef-Owner & Master Sommelier',
    distance: '5 miles away',
    activeAgo: 'Active 9m ago',
    spotifyAnthem: 'Florence + The Machine — Cosmic Love',
    tinderBio:
      '51, fiery copper curls, emerald-green eyes, unapologetic hourglass curves, and keys to a 900-bottle Italian wine cellar 🍷 Done with bland men who order light beer—bring an appetite, steady hands, and appreciation for a real woman.',
    hingePromptQuestion: 'Best perk of dating a 51yo Chef Jaguar',
    hingePromptAnswer: 'Midnight truffle pasta in a silk kimono after my restaurant closes—and zero pregnancy scares ever.',
    secondPromptQuestion: 'Instant turn-on',
    secondPromptAnswer: 'A younger man who holds eye contact across a candlelit table and worships soft curves.',
    ageShockZoom: true,
    ageShockQuipHer: 'Curvy Copper Jaguar.',
    ageShockQuipHim:
      '51F copper-redhead sommelier with emerald eyes beside an infinity pool—pure sensual Italian-cinema magnetism!',
    lookingFor: 'Sensual, devoted partnership',
    lookingForSubtext: 'Will ruin all restaurant food for you forever.',
    interests: [
      'Barolo & Brunello',
      'Infinity Pools',
      'Handmade Pasta',
      'Amalfi Coast',
      'Late-Night Jazz',
      'Farmers Markets',
    ],
    openingDm:
      'I spend every night feeding everyone else—tell me how you’d take care of *me* on my Monday night off.',
    xrayLeak:
      'INSIDER TIP: Never count calories at her table, kiss her neck while she stirs risotto, and bring unhurried devotion.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Sunset Stone-Terrace Swimsuit & Barolo',
        shortTab: '🍷 Poolside Swim',
        vibeNote: '💚 Copper-red waves, emerald eyes, plum plunge swimsuit & golden sunset.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/scarlett-51f.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Candlelit Wine Terrace',
        shortTab: '🥂 Wine Night',
        vibeNote: '💚 Sommelier magic at twilight.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/hero-couple.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Park Charcuterie & Pups',
        shortTab: '🐾 Charcuterie',
        vibeNote: '💚 Even her park picnic board belongs in Bon Appétit.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
    ],
  },
  {
    id: 'her-priya-35',
    name: 'Priya',
    age: 35,
    height: '5\'5"',
    zodiac: 'Virgo',
    lookBadge: '5\'5" • Hazel Eyes • Canyon Hiker & Dog Mom',
    occupation: 'ER Physician • Golden-Retriever Mom',
    distance: '2 miles away',
    activeAgo: 'Active 7m ago',
    spotifyAnthem: ' Norah Jones — Come Away With Me',
    tinderBio:
      '35F ER doc + golden retriever Rani 🐕 After 12 hours saving lives under fluorescent hospital lights, I want sunlit canyon hikes, cast-iron ribeye when my iron tanks, and a younger man with zero mansplaining.',
    hingePromptQuestion: 'Veto power belongs to',
    hingePromptAnswer: 'Rani (my 65-lb golden retriever). Bring trail treats and you’re already top 1%.',
    ageShockZoom: false,
    ageShockQuipHer: 'Trail-boss Puma MD.',
    ageShockQuipHim:
      '35F ER doctor hiking with her golden retriever—brilliant, radiant, and zero patience for flakes!',
    lookingFor: 'Intentional Puma × Cub spark',
    lookingForSubtext: 'Respect her hospital shift sleep and spoil her on days off.',
    interests: [
      'Canyon Hiking',
      'Golden Retrievers',
      'Masala Chai',
      'Reformer Pilates',
      'Boutique Travel',
      'Cooking',
    ],
    openingDm:
      'Rani and I are hitting the coastal ridge trail Saturday morning—can your legs keep up, or are you making me Friday dinner first?',
    xrayLeak:
      'INSIDER TIP: Sear iron-rich steak + lemony spinach after her long shift and win Rani over immediately.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Coastal Canyon Hike With Golden Retriever Rani',
        shortTab: '🏔️ Hike & Dog',
        vibeNote: '💚 Coral crop top, sunlit trail grin, and Rani smiling beside her.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/priya-35f.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Park Rosé With Rani’s Bestie',
        shortTab: '🐾 Dog Picnic',
        vibeNote: '💚 Off-shift golden-hour park bliss.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Waterfall Lagoon Vacation',
        shortTab: '👙 Lagoon Swim',
        vibeNote: '💚 Post-residency tropical recharge.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/camila-39f.jpg',
      },
    ],
  },
  {
    id: 'her-meiling-48',
    name: 'Mei-Ling',
    age: 48,
    height: '5\'7"',
    zodiac: 'Capricorn',
    lookBadge: '5\'7" • 🐈‍⬛ Black Cat Poise • Infinity Pool Architect',
    occupation: 'Principal Coastal Architect',
    distance: '4 miles away',
    activeAgo: 'Active 12m ago',
    spotifyAnthem: 'Khruangbin — Texas Sun',
    tinderBio:
      '48F architect designing cliffside ocean homes 🐈‍⬛ Certified Black Cat energy: I take my time, push back on smooth-talking rushers, and guard my peace fiercely—which somehow makes sunny Golden-Retriever Cubs try ten times harder.',
    hingePromptQuestion: 'Ideal weekend rhythm',
    hingePromptAnswer: 'Ocean infinity-pool swim, hand-pulled noodles or omakase, and zero loud small talk.',
    ageShockZoom: true,
    ageShockQuipHer: 'Quiet-luxury Cougar.',
    ageShockQuipHim:
      '48F coastal architect lounging beside an ocean infinity pool—timeless poise and razor-sharp wit!',
    lookingFor: 'Refined chemistry & companionship',
    lookingForSubtext: 'Notices every detail from your fingernails to your manners with waitstaff.',
    interests: [
      'Infinity Pools',
      'Modern Architecture',
      'Omakase',
      'Kyoto & Big Sur',
      'Lap Swimming',
      'Art Books',
    ],
    openingDm:
      'Most men talk about themselves for twenty minutes straight—ask me one genuinely good question and tell me your Friday plan.',
    xrayLeak:
      'INSIDER TIP: Keep clean nails, wear Santal or cedar, and bring thoughtful calm presence.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Sunset Ocean-View Infinity Pool',
        shortTab: '👙 Infinity Pool',
        vibeNote: '💚 Black bikini top, crisp white linen shorts, effortless Big Sur glamour.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/meiling-48f.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Rooftop Espresso Martini',
        shortTab: '🍸 Cocktails',
        vibeNote: '💚 Post-studio gallery reception.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/claire-45f.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Sunlit Park Picnic',
        shortTab: '🐾 Picnic',
        vibeNote: '💚 Quiet Sunday afternoon recharge.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
    ],
  },
  {
    id: 'her-vivienne-61',
    name: 'Vivienne',
    age: 61,
    height: '5\'9"',
    zodiac: 'Sagittarius',
    lookBadge: '5\'9" • Silver-and-Ebony Braids • 61F Fashion Icon',
    occupation: 'Former NYC Fashion Director',
    distance: '5 miles away',
    activeAgo: 'Active 15m ago',
    spotifyAnthem: 'Grace Jones — La Vie En Rose',
    tinderBio:
      '61, waist-length silver braids, bronze swimwear on Mediterranean balconies, and thirty years of Paris runway stories. Only swipe right if you walk tall holding my hand in public and know how to pour a proper Negroni.',
    hingePromptQuestion: 'Age-gap rule #1',
    hingePromptAnswer: 'Never whisper, never flinch at a waiter’s double-take, and never rush foreplay.',
    ageShockZoom: true,
    ageShockQuipHer: 'Legendary Silver-Braids Panther.',
    ageShockQuipHim:
      '61F former NYC fashion director in bronze resort swimwear—commands the entire coastline effortlessly!',
    lookingFor: 'Bold, attentive younger gentleman',
    lookingForSubtext: 'Unapologetic romance, travel, and deep conversation.',
    interests: [
      'Mediterranean Sea Swims',
      'Fashion Archives',
      'Negronis',
      'Vinyl Jazz',
      'Contemporary Art',
      'Resort Kaftans',
    ],
    openingDm:
      'Men half my age stare across gallery rooms every week; very few have the nerve to walk over cleanly. Impress me.',
    xrayLeak:
      'INSIDER TIP: Call instead of texting slang, keep your phone face-down all night, and match her elegance.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Mediterranean Stone Balcony Swimsuit & Ivory Kaftan',
        shortTab: '🏖️ Coastal Swim',
        vibeNote: '💚 Silver braids, bronze swimsuit, gold hoops—pure Panther royalty.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/vivienne-61f.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Palm Springs Poolside',
        shortTab: '🌴 Desert Pool',
        vibeNote: '💚 Wintering in the desert sun.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/celeste-62f.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Park Rosé Afternoon',
        shortTab: '🐾 Picnic',
        vibeNote: '💚 Sunlit afternoon leisure.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
    ],
  },
  {
    id: 'her-serena-43',
    name: 'Serena',
    age: 43,
    height: '5\'6"',
    zodiac: 'Libra',
    lookBadge: 'Chestnut Waves • Warm Brown Eyes • Soft-Life',
    occupation: 'Creative Director',
    distance: '4 miles away',
    activeAgo: 'Active 11m ago',
    spotifyAnthem: 'Sabrina Carpenter — Espresso',
    tinderBio:
      'I make 400 executive decisions before Thursday. On Friday night I want fresh peonies, passenger-princess treatment, heated car seats, and zero mental load.',
    hingePromptQuestion: 'The way to win me over is',
    hingePromptAnswer: 'Open my car door, hand me flowers, and say "Turn your brain off—I planned tonight."',
    ageShockZoom: false,
    ageShockQuipHer: 'Soft-life royalty.',
    ageShockQuipHim:
      'Secret unlocked: she does NOT want to boss you around—she wants chivalrous soft-life pampering!',
    lookingFor: 'Chivalrous romance',
    lookingForSubtext: 'Do NOT text her "idk what do u wanna eat?"',
    interests: ['Peonies', 'Wine Bars', 'Silk Robes', 'Art Galleries', 'Coastal Drives'],
    openingDm: 'I’ve been running meetings since 7 AM. Impress me—how are you spoiling me this Friday?',
    xrayLeak:
      'INSIDER TIP: Plan every detail from parking to reservations so she never has to play project manager.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Sunset Convertible & Fresh Peonies',
        shortTab: '💐 Convertible',
        vibeNote: '💚 Soft-life Cougar energy at its peak.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/serena-43f.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Sidewalk Espresso Glow',
        shortTab: '☕ Café',
        vibeNote: '💚 Melts for thoughtful old-school courtship.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/maya-36f.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Waterfall Lagoon Bikini',
        shortTab: '👙 Lagoon',
        vibeNote: '💚 Resort vacation bliss.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/camila-39f.jpg',
      },
    ],
  },
  {
    id: 'her-valerie-53',
    name: 'Valerie',
    age: 53,
    height: '5\'8"',
    zodiac: 'Sagittarius',
    lookBadge: 'Silver-Streaked Brunette • Blue-Grey Eyes • Athletic',
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
    interests: ['6 AM Trail Runs', 'Reformer Pilates', 'Red Wine', 'Travel', 'Ocean Swims'],
    openingDm: 'You claim you have stamina? Meet me at the canyon trailhead at 6:00 AM sharp—don’t be late.',
    xrayLeak:
      'INSIDER TIP: Hydrate Friday night, match her stride Saturday morning, and own public stares with pride.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Sunrise Canyon Ridge Overlook',
        shortTab: '🏔️ Canyon Trail',
        vibeNote: '💚 Fitter at 53 than your entire frat group chat.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/valerie-53f.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Malibu Beach Surf & Swim',
        shortTab: '🏄‍♀️ Beach Bikini',
        vibeNote: '💚 Year-round coastal athlete.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/astrid-41f.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Palm Springs Sunset',
        shortTab: '🌴 Poolside',
        vibeNote: '💚 Unapologetic Gen-X confidence.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/celeste-62f.jpg',
      },
    ],
  },
  {
    id: 'her-chloe-37',
    name: 'Chloé',
    age: 37,
    height: '5\'5"',
    zodiac: 'Capricorn',
    lookBadge: 'Sunlit Brunette • Hazel Eyes • Dog Mom',
    occupation: 'Brand Strategist • Dog Mom',
    distance: '2 miles away',
    activeAgo: 'Active 4m ago',
    spotifyAnthem: 'Kacey Musgraves — Justified',
    tinderBio:
      'Happily divorced, child-free, and my rescue mutt Barnaby has veto power 🐾 Swiped past every bitter 42yo "still figuring out my goals" man in town—lowered my age filter to see if younger men actually bring enthusiasm.',
    hingePromptQuestion: 'Quickest way to my heart',
    hingePromptAnswer:
      'Win over Barnaby first, know where the dishwasher pods go without a tutorial, and never trauma-dump about your ex over IPAs.',
    ageShockZoom: false,
    ageShockQuipHer: 'Child-free Puma perfection.',
    ageShockQuipHim:
      '37F child-free dog-mom Puma—jaded by lazy 40yo Hinge guys and ready to melt for real effort + dog-guy charm!',
    lookingFor: 'Real effort & dog-walk banter',
    lookingForSubtext: 'Allergic to weaponized incompetence and 41-year-old Peter Pans.',
    interests: ['Rescue Dogs', 'Patio Rosé', 'Travel', 'Zero Kids', 'Farmers Markets'],
    openingDm:
      'Fair warning: I lowered my age slider after three dreadful dates with men my own age. Convince me (and Barnaby) it was a smart move.',
    xrayLeak:
      'INSIDER TIP: Bring a pocket dog treat for Barnaby, never act helpless around her house, and match her wit without cynicism.',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Patio Rosé With Rescue Pup Barnaby',
        shortTab: '🐾 Barnaby',
        vibeNote: '💚 Child-free, divorced, sharp wit—and Barnaby is watching closely.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/chloe-37f.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Park Picnic With Barnaby & Friends',
        shortTab: '🍓 Park Picnic',
        vibeNote: '💚 Ideal Saturday afternoon in the grass.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Golden-Hour Sidewalk Café',
        shortTab: '☕ Café',
        vibeNote: '💚 Done babysitting 42-year-old Peter Pans; rewards genuine enthusiasm.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/maya-36f.jpg',
      },
    ],
  },
  {
    id: 'her-sienna-38',
    name: 'Sienna',
    age: 38,
    height: '5\'6"',
    zodiac: 'Leo',
    lookBadge: 'Honey Highlights • Warm Brown Eyes • 6-Yr Gap',
    occupation: 'Boutique Hotel Designer • Junior Cougar',
    distance: '2 miles away',
    activeAgo: 'Active 3m ago',
    spotifyAnthem: 'LCD Soundsystem — All My Friends',
    tinderBio:
      'Seeking my 6-year-gap match (31–33M): old enough to remember burning CDs, young enough that I still get to tease you about studying for 10th-grade geometry while I was legally ordering martinis.',
    hingePromptQuestion: 'The sweet spot of a 6-year Junior Cougar gap',
    hingePromptAnswer:
      'Zero "Is that your son?" stares from waiters, 100% playful older-woman chemistry + Le Creuset dinner parties.',
    ageShockZoom: false,
    ageShockQuipHer: 'Junior Cougar sweet spot!',
    ageShockQuipHim:
      '6-year Junior Cougar sweet spot: shared references, zero 20s roommate chaos, and electric banter!',
    lookingFor: 'Junior Cougar sweet-spot chemistry',
    lookingForSubtext: 'Age-gap purists call under-10-years a Junior Cougar—she wears the badge proudly.',
    interests: ['Vinyl & Wine Bars', 'Boutique Design', 'Weekend Getaways', 'Cooking', 'Palm Springs'],
    openingDm:
      'Quick math check: you’re 6 years younger, which officially makes me a Junior Cougar. Where were you in 2008—and where are you taking me Friday?',
    xrayLeak:
      'INSIDER TIP: Lean into the playful 6-year high-school math banter and match her homeowner-era intentionality!',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Golden-Hour Wine & Vinyl Lounge',
        shortTab: '🍸 Vinyl Bar',
        vibeNote: '💚 Peak 6-year Junior Cougar charm.',
        variant: 'tailored_linen',
        photoUrl: './images/cast/sienna-38f.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Tropical Lagoon Bikini Getaway',
        shortTab: '👙 Lagoon',
        vibeNote: '💚 Boutique hotel research perks.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/camila-39f.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Sunset Terrace Cocktails',
        shortTab: '🥂 Terrace',
        vibeNote: '💚 All the older-woman confidence, synced on the same wavelength.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/hero-couple.jpg',
      },
    ],
  },
  {
    id: 'her-sedona-qigong-mommy',
    name: 'Sedona',
    age: 46,
    height: '5\'9"',
    zodiac: 'Virgo',
    lookBadge: 'Auburn Silver Waves • Qigong & Tai Chi Mommy-Domme',
    occupation: 'Qigong & Nervous-System Studio Founder • Wellness Mommy-Domme',
    distance: '3 miles away',
    activeAgo: 'Active 2m ago',
    spotifyAnthem: 'Khruangbin — Texas Sun',
    tinderBio:
      '6:30 AM bamboo-courtyard Qigong, 100% gluten-free & seed-oil-free (grass-fed ghee & olive oil ONLY), and #3 on the waitlist to adopt a tricolor Mini Bernedoodle 🧘‍♀️🐶 Soft Mommy-Domme praise for an attentive Cub who drops his shoulders when I say "breathe with Mommy"—and never tries to Cubsplain a podcast to me.',
    hingePromptQuestion: 'Two quickest ways to get my full Mommy-Domme praise',
    hingePromptAnswer:
      'Call the chef ahead to confirm zero canola/soybean oil & gluten-free prep, match my slow Tai Chi breathwork, and help me pick puppy names for my incoming tricolor Mini Bernedoodle.',
    ageShockZoom: false,
    ageShockQuipHer: 'Serene Wellness Mommy-Domme mastery.',
    ageShockQuipHim:
      '46F Qigong & Tai Chi Mommy-Domme: two fingers under your chin and you’ll forget every podcast you ever listened to!',
    lookingFor: 'Grounded devotion, breathwork & playful "Yes, Mommy" polarity',
    lookingForSubtext: 'Zero tolerance for Cubsplaining, rushed jittery texting, or Sugar-Mama freeloaders.',
    interests: ['Qigong & Tai Chi', 'Mommy-Domme Praise', 'Jasmine Oolong', 'Cedar Sauna', 'Zero-Proof Elixirs'],
    openingDm:
      'Unclench your jaw and take one slow breath before typing, sweet boy. Tell me your Friday plan—and promise you won’t try to Cubsplain breathwork to me.',
    xrayLeak:
      'INSIDER TIP: Lean playfully into her calm Mommy-Domme cadence, skip the know-it-all lectures, and suggest an unhurried tea lounge or sauna date!',
    isGreenFlagMatch: true,
    photos: [
      {
        caption: 'Photo 1 of 3 • Dawn Bamboo-Courtyard Qigong & Cloud Hands',
        shortTab: '🧘‍♀️ Qigong',
        vibeNote: '💚 20 years of Tai Chi mastery + calm Mommy-Domme poise.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/sedona-qigong-46f.jpg',
      },
      {
        caption: 'Photo 2 of 3 • Sunrise Canyon Ridge Breathwork',
        shortTab: '🏔️ Canyon',
        vibeNote: '💚 Out-grounds and out-paces men 20 years younger without breaking a sweat.',
        variant: 'golden_trail_stud',
        photoUrl: './images/cast/valerie-53f.jpg',
      },
      {
        caption: 'Photo 3 of 3 • Post-Practice Jasmine Oolong & Meadow Tea',
        shortTab: '🍵 Oolong',
        vibeNote: '💚 Rewards curiosity, posture, and attentive caretaking.',
        variant: 'dog_park_coffee',
        photoUrl: './images/cast/dog-park-picnic.jpg',
      },
    ],
  },
];

export function getSwipeDeckForRole(role: PlayerRole): SwipeProfile[] {
  return role === 'her' ? APP_SWIPE_PROFILES : HER_SWIPE_PROFILES;
}
