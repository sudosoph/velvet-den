import { V35_CAST_VISUALS } from './v35AssetManifest';

export interface HingePromptItem {
  id: string;
  question: string;
  answer: string;
  openers: [
    { text: string; delta: number },
    { text: string; delta: number },
    { text: string; delta: number; isVipSmooth: true },
  ];
}

export interface HingeVoicePrompt {
  question: string;
  duration: string;
  transcript: string;
  audioUrl: string;
}

export interface V35CastProfile {
  id: string;
  name: string;
  age: number;
  role: 'him' | 'her';
  tier: 'main_lead' | 'trap' | 'cameo';
  discoveryDoor: 'hinge' | 'wild' | 'both';
  primaryWildVenueId?: string;
  secondaryWildVenueId?: string;
  matchSelectivity: 'warm' | 'selective' | 'standout';
  activeStatusLabel: string;
  tagline: string;
  vitals: {
    height: string;
    job: string;
    school: string;
    neighborhood: string;
    lookingFor: string;
    kidsStance: string;
  };
  slides: { url: string; caption: string; tag: string }[];
  prompts: [HingePromptItem, HingePromptItem, HingePromptItem];
  voicePrompt?: HingeVoicePrompt;
  fridayStoryHook?: string;
  trapTellSummary?: string;
  vulnerabilityNote?: string;
}

function makeSlides(id: string, captions: [string, string, string, string, string, string]) {
  const urls = V35_CAST_VISUALS[id].sixUniquePhotos;
  return urls.map((url, idx) => ({
    url,
    caption: captions[idx],
    tag: '',
  }));
}

export const V35_CAST_PROFILES: V35CastProfile[] = [
  // ================= 5 MAIN ROMANCE LEADS (HIM. FOR HER) =================
  {
    id: 'julian',
    name: 'Julian',
    age: 27,
    role: 'him',
    tier: 'main_lead',
    discoveryDoor: 'hinge',
    secondaryWildVenueId: 'left-bank-books',
    matchSelectivity: 'selective',
    activeStatusLabel: 'Active today',
    tagline: 'Hampstead architectural historian on a one-year coastal fellowship.',
    vitals: {
      height: '6\'1"',
      job: 'Visiting Architecture Fellow',
      school: 'UCL Bartlett',
      neighborhood: 'Westwood / Sunset Hills',
      lookingFor: 'Long-term relationship',
      kidsStance: 'Open to yours, content without',
    },
    slides: makeSlides('julian', [
      'Caught mid-rant about London rain vs. Westwood sunshine',
      'Happiest buried in archive notebooks (glasses come off by dinner)',
      '6 AM river miles, promise I’m much calmer by half seven',
      'Thursday uniform once the archive stacks close',
      'Yes I climb library ladders for work, yes I carry allergy pills',
      'Still mourning proper Hampstead cask ale',
    ]),
    prompts: [
      {
        id: 'julian-p1',
        question: "A friend's review of me",
        answer:
          'Shows up five minutes early with peonies, uses "half seven" unironically in California, and refuses to check his phone once dinner lands.',
        openers: [
          { text: 'Hey cute accent where are you from', delta: -6 },
          {
            text: 'Translating "half seven" accurately on the first try, does that win me the risotto recipe?',
            delta: 18,
          },
          {
            text: '🌹 Five minutes early AND phone off the table? Book us a quiet wine bar for half seven Thursday xx',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'julian-p2',
        question: 'Together, we could',
        answer:
          'Sneak out of a pretentious gallery talk twenty minutes early, split a bottle of Barolo, and debate which courtyard in town has the best evening light.',
        openers: [
          { text: 'Sounds fun lol', delta: -8 },
          {
            text: 'Only if I get veto power on pretentious plaques, pick the Barolo spot.',
            delta: 16,
          },
          {
            text: '🌹 Deal. Meet me at Left Bank’s courtyard Friday and prove your taste in Barolo matches your architecture eye.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'julian-p3',
        question: 'Green flags I look for',
        answer:
          'Dry humor, a woman who genuinely loves the life she built, and zero patience for dating-app games.',
        openers: [
          { text: 'Hi how is your week going', delta: -4 },
          {
            text: 'Life is very happily built over here, let’s see if your dry humor survives two glasses of red.',
            delta: 18,
          },
          {
            text: '🌹 Zero games, sharp banter, and Thursday at 7:30 is open if you move fast.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
    vulnerabilityNote:
      'Proud of his craft yet privately sensitive about fellowship stipend math beside an executive partner, melts when respected for his mind and initiative.',
  },
  {
    id: 'soren',
    name: 'Søren',
    age: 26,
    role: 'him',
    tier: 'main_lead',
    discoveryDoor: 'both',
    primaryWildVenueId: 'palisades-racquet',
    matchSelectivity: 'standout',
    activeStatusLabel: 'Standout • Barely checks apps',
    tagline: 'Copenhagen-trained timber architect & clay-court regular.',
    vitals: {
      height: '6\'3"',
      job: 'Architectural Designer',
      school: 'Royal Danish Academy',
      neighborhood: 'Santa Monica Canyon',
      lookingFor: 'Intentional partnership',
      kidsStance: 'Doesn’t want kids',
    },
    slides: makeSlides('soren', [
      'Resting Danish face, actually very happy to be here',
      'Weekend hit before grabbing coffee',
      'Up way too late finishing a studio model',
      'Cold ocean swim, hot coffee right after',
      'Saturday sourdough run on two wheels',
      'Cleaned up for a friend’s museum benefit',
    ]),
    prompts: [
      {
        id: 'soren-p1',
        question: 'My simple pleasures',
        answer:
          'Morning ocean swims, comfortable silence that doesn’t need filling, and cooking dinner with the patio doors wide open.',
        openers: [
          { text: 'Wow ur super tall!!', delta: -8 },
          {
            text: 'Comfortable silence plus home-cooked dinner with the doors open might be the best pitch on here.',
            delta: 18,
          },
          {
            text: '🌹 Standout Rose: Skip the small talk, let’s grab Thursday martinis at eight.',
            delta: 26,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'soren-p2',
        question: 'First round is on me if',
        answer:
          'You agree that bright overhead lighting in restaurants should be illegal, or you can beat me at backgammon.',
        openers: [
          { text: 'I dont play games haha', delta: -6 },
          {
            text: 'Overhead fluorescent bulbs in restaurants should be illegal, first round is officially on you.',
            delta: 17,
          },
          {
            text: '🌹 Bring a travel backgammon board to a dim wine bar Friday, winner picks the bottle.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'soren-p3',
        question: 'I know the best spot in town for',
        answer:
          'Watching the fog roll off the coastal bluffs with two espressos and zero phones in sight.',
        openers: [
          { text: 'Where is it??', delta: -4 },
          {
            text: 'Bold claim, you’re going to have to back that map pin up this weekend.',
            delta: 16,
          },
          {
            text: '🌹 Phones on airplane mode, two cortados, Sunday morning, show me.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
    vulnerabilityNote:
      'Direct Nordic honesty can read cool at first; rushes nothing on Night 1 because when he commits, he stays for years.',
  },
  {
    id: 'miles',
    name: 'Miles',
    age: 31,
    role: 'him',
    tier: 'main_lead',
    discoveryDoor: 'wild',
    primaryWildVenueId: 'terminal-b-airport',
    secondaryWildVenueId: 'velvet-room',
    matchSelectivity: 'selective',
    activeStatusLabel: 'Met In The Wild • Terminal B',
    tagline: 'Boutique hospitality builder who handles every Friday detail before you land.',
    vitals: {
      height: '6\'2"',
      job: 'Hospitality Architect & Partner',
      school: 'Cal Poly Architecture',
      neighborhood: 'Marina / Sunset Hills',
      lookingFor: 'Life partner',
      kidsStance: 'Flexible & family-warm',
    },
    slides: makeSlides('miles', [
      'Curbside with two espressos beats airport chaos every time',
      'Site walkthrough before the weekend starts',
      'Checking the patio build before opening night',
      'Out on the water whenever the wind picks up',
      '8:15 dinner reservation, already handled',
      'Morning miles before client calls',
    ]),
    prompts: [
      {
        id: 'miles-p1',
        question: 'The hallmark of a good relationship is',
        answer:
          'When a woman who carries everyone else’s decisions all week gets into the passenger seat Friday night and doesn’t have to plan a single thing.',
        openers: [
          { text: 'Nice coat!', delta: -4 },
          {
            text: 'Turning my decision brain off at 7 PM Friday sounds dangerously addictive.',
            delta: 18,
          },
          {
            text: '🌹 Consider Friday officially delegated to you, just tell me dress code and pickup time.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'miles-p2',
        question: 'Unusual skills',
        answer:
          'Tracking delayed flights down to the gate change, carrying two overpacked weekender bags in one hand, and parallel parking in one fluid motion.',
        openers: [
          { text: 'Haha cool skill', delta: -6 },
          {
            text: 'Gate-accurate airport pickups might actually beat flowers as a love language.',
            delta: 18,
          },
          {
            text: '🌹 Next delayed flight from Terminal B, I’m holding you to that curbside cortado.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'miles-p3',
        question: 'I geek out on',
        answer:
          'Restaurants where you can actually hear each other talk, good bourbon, and getting out on the water on Sundays.',
        openers: [
          { text: 'Boats are fun', delta: -6 },
          {
            text: 'Tell me which restaurant in town actually lets two people talk without shouting.',
            delta: 17,
          },
          {
            text: '🌹 Good bourbon and zero shouting over music, show me your favorite spot in town.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
    vulnerabilityNote:
      'Always plays the unflappable rock; quietly melts when someone asks how *his* week actually went.',
  },
  {
    id: 'rafael',
    name: 'Rafael',
    age: 26,
    role: 'him',
    tier: 'main_lead',
    discoveryDoor: 'wild',
    primaryWildVenueId: 'havana-salsa',
    secondaryWildVenueId: 'velvet-palms-bbq',
    matchSelectivity: 'warm',
    activeStatusLabel: 'Met In The Wild • Havana & Vine',
    tagline: 'Bespoke walnut furniture maker by day, effortless salsa lead after nine.',
    vitals: {
      height: '6\'0"',
      job: 'Master Woodworker & Studio Owner',
      school: ' São Paulo Guild / RISD',
      neighborhood: 'Silver Lake',
      lookingFor: 'Deep romance',
      kidsStance: 'Open to the future',
    },
    slides: makeSlides('rafael', [
      'Waiting on the live band to start',
      'Long afternoon in the woodshop',
      'Thursday nights at Havana & Vine',
      'Morning espresso before heading to the shop',
      'Brought my guitar out to the beach at sunset',
      'Cleaned up for rooftop drinks',
    ]),
    prompts: [
      {
        id: 'rafael-p1',
        question: 'Together, we could',
        answer:
          'Cook dinner together on a Friday night with old salsa records playing and nowhere else we need to be.',
        openers: [
          { text: 'I cant dance lol', delta: -5 },
          {
            text: 'Fair warning: you’re going to have to talk me through the dance steps.',
            delta: 18,
          },
          {
            text: '🌹 Bring the playlist. I’ll pour the red wine while you cook.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'rafael-p2',
        question: 'What I order for the table',
        answer:
          'Grilled octopus, charred padron peppers, and whatever red bottle the sommelier hides off-menu.',
        openers: [
          { text: 'Yum!', delta: -6 },
          {
            text: 'Zero menu hesitation, already giving you high marks.',
            delta: 17,
          },
          {
            text: '🌹 Order exactly that this Friday and save me a dance afterward.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'rafael-p3',
        question: "A friend's review of me",
        answer:
          'Will notice a wobbly chair leg in thirty seconds, fix your sticky patio latch unasked, and remember how you take your morning coffee.',
        openers: [
          { text: 'Handy!!', delta: -4 },
          {
            text: 'Careful, my backyard gate latch has been waiting six months for a hero.',
            delta: 18,
          },
          {
            text: '🌹 Oat cortado at 8 AM, and save me a song on Friday night.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
    vulnerabilityNote:
      'Fiercely proud of earning everything with his own hands; watches at corporate black-tie galas to see if you introduce him with full pride.',
  },
  {
    id: 'marcus',
    name: 'Marcus',
    age: 27,
    role: 'him',
    tier: 'main_lead',
    discoveryDoor: 'wild',
    primaryWildVenueId: 'dawn-lap-pool',
    secondaryWildVenueId: 'st-jude-coffee',
    matchSelectivity: 'selective',
    activeStatusLabel: 'Met In The Wild • Dawn Lap Pool',
    tagline: 'Ocean-rescue paramedic, dawn swimmer & calmest pulse in any room.',
    vitals: {
      height: '6\'1"',
      job: 'Firefighter-Paramedic',
      school: 'UCLA / LAFD Academy',
      neighborhood: 'Playa Vista',
      lookingFor: 'Real partnership',
      kidsStance: 'Great with teens & dogs',
    },
    slides: makeSlides('marcus', [
      'Golden hour after beach patrol',
      '1,500 meters before the city wakes up',
      'Post-shift iced coffee outside Station 14',
      'Sunday mahi-mahi and charred lemon duty',
      'Two-man beach volleyball, still undefeated this summer',
      'Proving I own clothes besides navy turnout gear',
    ]),
    prompts: [
      {
        id: 'marcus-p1',
        question: 'My greatest strength',
        answer:
          'Resting heart rate of 48 in an emergency, cooking firehouse-level Sunday breakfast, and never canceling plans once they’re on the calendar.',
        openers: [
          { text: 'Thanks for your service!!', delta: -4 },
          {
            text: 'A man who keeps Friday plans AND cooks Sunday breakfast? Almost suspicious.',
            delta: 18,
          },
          {
            text: '🌹 Let’s see if that 48-bpm calm survives sitting across from me at dinner Friday.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'marcus-p2',
        question: 'My simple pleasures',
        answer:
          'Saltwater swims before 7 AM, old Marvin Gaye records while grilling, and women who say exactly what they mean.',
        openers: [
          { text: 'Nice smile', delta: -6 },
          {
            text: 'Marvin Gaye on vinyl and direct communication, we’re going to get along dangerously well.',
            delta: 17,
          },
          {
            text: '🌹 Put "What’s Going On" on the turntable and tell me what I’m bringing to the grill.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'marcus-p3',
        question: 'Best travel story',
        answer:
          'Lifeguarding a summer exchange on the Amalfi cliffs and accidentally winning the village nonna’s lemon pasta competition.',
        openers: [
          { text: 'Cool!', delta: -8 },
          {
            text: 'Beating an Italian nonna on home turf requires immediate proof.',
            delta: 18,
          },
          {
            text: '🌹 I’ll bring the crisp white wine, cook me the winning lemon pasta on Date #2.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
    vulnerabilityNote:
      'Close with his 49-year-old mom Denise, wants a partner who lets him prep his family warmly a week before Sunday dinner.',
  },

  // ================= 3 DISGUISED RED-FLAG TRAPS (HIM. FOR HER) =================
  {
    id: 'graham',
    name: 'Graham',
    age: 29,
    role: 'him',
    tier: 'trap',
    discoveryDoor: 'both',
    primaryWildVenueId: 'velvet-room',
    matchSelectivity: 'warm',
    activeStatusLabel: 'Active 5 PM – 6:40 PM weekdays only',
    tagline: 'Private equity VP who loves early 5:15 PM martinis before "Tokyo calls."',
    vitals: {
      height: '6\'1"',
      job: 'Vice President, Private Equity',
      school: 'Wharton',
      neighborhood: 'Montecito / Downtown',
      lookingFor: 'Discreet connection',
      kidsStance: 'Prefer not to say',
    },
    slides: makeSlides('graham', [
      'Quick lobby espresso between back-to-back deal meetings',
      'Quick harbor spin before my Sunday phone blackout kicks in',
      'Nine holes before markets open, please don’t tag me lol',
      'Hard stop at 6:42 PM sharp for my nightly Tokyo portfolio call',
      'Strictly offline after 6:45 PM for deep-focus portfolio hours',
      'Strictly cash at hotel bars, keeps corporate expense reports clean',
    ]),
    prompts: [
      {
        id: 'graham-p1',
        question: 'My ideal first date',
        answer:
          'A spontaneous 5:15 PM weekday martini at a quiet hotel bar, my evenings after 6:45 PM and Sundays are completely locked with Tokyo portfolio calls.',
        openers: [
          { text: 'You have a great smile!', delta: 14 },
          {
            text: 'Tokyo markets every single night at 6:45 PM AND Sundays? Interesting timezone math.',
            delta: 18,
          },
          {
            text: '🌹 5:15 PM at The Marlow Lounge, let’s see what happens when the clock hits 6:45.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'graham-p2',
        question: 'Green flags I look for',
        answer:
          'Total discretion, zero social-media tagging, and appreciating quality ninety-minute weekday escapes.',
        openers: [
          { text: 'I hate social media too!', delta: 14 },
          {
            text: 'Why does "total discretion" sound like there’s a suburban driveway involved?',
            delta: 18,
          },
          {
            text: '🌹 Zero tagging here, though I ask very direct questions over martinis.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'graham-p3',
        question: 'Unusual skills',
        answer:
          'Knowing every dimly lit back table downtown, paying exclusively in crisp twenties "for compliance," and guarding my weekend calendar like state secrets.',
        openers: [
          { text: 'Love a quiet spot!', delta: 14 },
          {
            text: 'Hiding from SEC compliance or hiding from a shared joint checking account?',
            delta: 18,
          },
          {
            text: '🌹 Book Table 9 and bring your best alibi. I’m curious.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
    ],
    trapTellSummary:
      'Secretly married commuter: pale ring-tan line, strict 6:45 PM vanish, zero weekends, and member of the Table 9 Alibi Club.',
  },
  {
    id: 'connor',
    name: 'Connor',
    age: 27,
    role: 'him',
    tier: 'trap',
    discoveryDoor: 'hinge',
    matchSelectivity: 'warm',
    activeStatusLabel: 'Active now',
    tagline: 'Campus "founder" & model who swears Prowl glitched his birth year.',
    vitals: {
      height: '6\'0"',
      job: 'Stealth Founder / Campus Rep',
      school: 'USC',
      neighborhood: 'West Hollywood / University Park',
      lookingFor: 'Figuring out my dating goals',
      kidsStance: 'Not sure yet',
    },
    slides: makeSlides('connor', [
      'Swear Facebook glitched my birth year when I signed up lol',
      '2 AM bathroom mirror check, ignore the bottle of Tito’s on the sink lol',
      'DJing my four roommates’ rooftop day party, pull up',
      'Club lacrosse cardio so I survive frat formal',
      'Post-surf burrito run with the roommates',
      'Who wants to come to "my place in Maui" (it’s my parents’ Week-14 timeshare)',
    ]),
    prompts: [
      {
        id: 'connor-p1',
        question: 'Two truths and a lie',
        answer:
          'I played club lacrosse, I casually flex "my place in Maui" before admitting it’s my parents’ Week-14 timeshare, and this app totally locked my age wrong when I linked Facebook lol.',
        openers: [
          { text: 'Haha wait how old are you really?', delta: 16 },
          {
            text: 'Whenever a guy blames Facebook for his age on Prowl, the real number starts with a 2 and ends with a 1.',
            delta: 18,
          },
          {
            text: '🌹 Let’s hear the real birth year on your ID before you say another word.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'connor-p2',
        question: 'Together, we could',
        answer:
          'Skip crowded restaurants completely, just let me come straight over to your house tonight and order takeout.',
        openers: [
          { text: 'Takeout sounds cozy!', delta: 14 },
          {
            text: 'Inviting yourself straight to a woman’s house before Date #1 is bold in all the wrong ways.',
            delta: 18,
          },
          {
            text: '🌹 Nice try, speedrunner, nobody gets my home address before passing public cocktail vetting.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'connor-p3',
        question: 'Typical Sunday',
        answer:
          'Recovering on the sectional with my four roommates until kickoff.',
        openers: [
          { text: 'Fun!', delta: 12 },
          {
            text: 'Four roommates and microwave quesadillas, tell me the truth about that birth year.',
            delta: 18,
          },
          {
            text: '🌹 Step into my inbox and confess how many roommates share that sectional.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
    ],
    trapTellSummary:
      'Lied about his age (`21` posing as `27` to bypass age filters) and tries to skip public dates to come straight to your house.',
  },
  {
    id: 'devon',
    name: 'Devon',
    age: 24,
    role: 'him',
    tier: 'trap',
    discoveryDoor: 'hinge',
    matchSelectivity: 'warm',
    activeStatusLabel: 'Active now',
    tagline: 'Indie songwriter who writes soulmate poetry Tuesday and panics by Friday.',
    vitals: {
      height: '5\'11"',
      job: 'Session Guitarist & Barista',
      school: 'Berklee',
      neighborhood: 'Echo Park',
      lookingFor: 'Cinematic connection',
      kidsStance: 'Someday maybe',
    },
    slides: makeSlides('devon', [
      'Golden hour between studio guitar takes',
      'Already writing verse two about our future Big Sur cabin',
      'Rainy Echo Park lyric notebook, feel everything at volume eleven',
      'Digging through dusty Blue Note vinyl I definitely couldn’t afford',
      'Late-night voice memo session on the porch',
      'Clearing my head on the pier before Friday overthinking kicks in',
    ]),
    prompts: [
      {
        id: 'devon-p1',
        question: 'I fall for you if',
        answer:
          'We talk until 2 AM on Tuesday and already plan our autumn cabin in Big Sur before we’ve even met in person.',
        openers: [
          { text: 'Aww I love deep late-night talks!', delta: 15 },
          {
            text: 'Planning Big Sur on Tuesday usually means flaking by Friday at 4 PM, prove me wrong.',
            delta: 18,
          },
          {
            text: '🌹 Skip the Tuesday poetry marathon and prove you can actually show up Friday at 8.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'devon-p2',
        question: 'My biggest date fail',
        answer:
          'Getting so in my head about how amazing she was that I overthought the whole evening an hour beforehand.',
        openers: [
          { text: 'Aw don’t be nervous!', delta: 14 },
          {
            text: 'At least you put the Friday cold-feet warning label right on Slide 2.',
            delta: 18,
          },
          {
            text: '🌹 Deep breath, poet, one calm drink doesn’t require a screenplay.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'devon-p3',
        question: "A friend's review of me",
        answer:
          'Writes three songs about a woman after one voice note and feels everything at volume eleven.',
        openers: [
          { text: 'Write a song about me!', delta: 14 },
          {
            text: 'Volume eleven on Tuesday better still be standing at the host stand on Friday.',
            delta: 18,
          },
          {
            text: '🌹 Save the third verse until after you pass Date #1.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
    ],
    trapTellSummary:
      '48-hour love-bomber who future-fakes Big Sur on Tuesday, then chickens out at 4:15 PM Friday when reality hits.',
  },

  // ================= 3 HIGH-HOTNESS CAMEOS (HIM. FOR HER) =================
  {
    id: 'rory',
    name: 'Rory',
    age: 24,
    role: 'him',
    tier: 'cameo',
    discoveryDoor: 'hinge',
    primaryWildVenueId: 'cougarmarket',
    matchSelectivity: 'warm',
    activeStatusLabel: 'Active today',
    tagline: 'Hampstead park ranger on a six-month California arboretum exchange.',
    vitals: {
      height: '6\'0"',
      job: 'Arborist & Park Ranger',
      school: 'Royal Agricultural Univ.',
      neighborhood: 'Pasadena / Botanical District',
      lookingFor: 'Joyful connection',
      kidsStance: 'Great with kids & dogs',
    },
    slides: makeSlides('rory', [
      'Fresh off the plane from London and squinting at January sun',
      'Inspecting the heritage oaks, still pinch myself this is my day job',
      'Not my dog, just my favorite muddy Tuesday trail regular',
      'Bought two hot chocolates at the Sunday market (one has your name on it)',
      'Sunset overlook check before locking the park gates',
      'Proof I clean up out of ranger boots when you book dinner',
    ]),
    prompts: [
      {
        id: 'rory-p1',
        question: 'Unusual skills',
        answer:
          'Rescuing stranded kites (and occasionally embarrassed adults) out of heritage oak trees, plus naming every wildflower within fifty paces.',
        openers: [
          { text: 'Cute dog!!', delta: 8 },
          {
            text: 'Straight out of Hampstead Heath, if I get stuck up an oak tree, how fast is your response time?',
            delta: 18,
          },
          {
            text: '🌹 Bring those dimples and the tailored dinner jacket, twilight botanical walk is a yes.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'rory-p2',
        question: 'My simple pleasures',
        answer:
          'Muddy boots by the back door, warm berry crumble, and making a brilliant woman laugh until she forgets her inbox.',
        openers: [
          { text: 'Love berry crumble', delta: 6 },
          {
            text: 'Making me forget my inbox for two hours is a tall order, accepting your application.',
            delta: 18,
          },
          {
            text: '🌹 Leave the muddy boots on the porch and bring the warm crumble. Friday is yours.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'rory-p3',
        question: 'First round is on me if',
        answer:
          'You forgive my terrible American accent impression and let me take you to the night-blooming jasmine terrace.',
        openers: [
          { text: 'Haha deal', delta: 6 },
          {
            text: 'Keep your real London accent and the jasmine terrace is a deal.',
            delta: 18,
          },
          {
            text: '🌹 Zero fake American accents allowed, pick me up at eight, ranger.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
  },
  {
    id: 'jin',
    name: 'Jin',
    age: 25,
    role: 'him',
    tier: 'cameo',
    discoveryDoor: 'hinge',
    matchSelectivity: 'selective',
    activeStatusLabel: 'Active 2h ago',
    tagline: 'Art director shooting 35mm portraits by day, bouldering overhangs at night.',
    vitals: {
      height: '6\'0"',
      job: 'Creative Director',
      school: 'ArtCenter Pasadena',
      neighborhood: 'Arts District',
      lookingFor: 'Slow-burn spark',
      kidsStance: 'Doesn’t want kids',
    },
    slides: makeSlides('jin', [
      'Rare proof I occasionally step onto the other side of the camera',
      'Editing rolls from last weekend (promise I never photograph dinner)',
      'Favorite listening bar in Little Tokyo',
      'Morning coffee before heading into the studio',
      'Bouldering route that humbled me twice this week',
      'Gallery opening night, phone stayed on silent in my coat',
    ]),
    prompts: [
      {
        id: 'jin-p1',
        question: 'Together, we could',
        answer:
          'Slip into a twelve-seat vinyl listening bar in Little Tokyo, share smoked uni toast, and trade favorite Wong Kar-wai frames.',
        openers: [
          { text: 'Cool camera!', delta: -4 },
          {
            text: 'In the Mood for Love lighting plus a twelve-seat vinyl bar, name the night.',
            delta: 18,
          },
          {
            text: '🌹 Hold two seats at the vinyl bar Friday and bring the medium-format camera.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'jin-p2',
        question: 'Green flags I look for',
        answer:
          'Decisive taste, unhurried eye contact, and someone who never narrates dinner for followers.',
        openers: [
          { text: 'Same here', delta: -6 },
          {
            text: 'My phone stays in my clutch from appetizer to check, your move, art director.',
            delta: 18,
          },
          {
            text: '🌹 Zero cameras on the food, undivided eye contact, book Little Tokyo for 8:30.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'jin-p3',
        question: 'I geek out on',
        answer:
          'Good pour-over coffee, late-night ramen spots, and shooting film on weekends.',
        openers: [
          { text: 'Love matcha!', delta: -2 },
          {
            text: 'Show me the best pour-over spot downtown and I’ll buy the late-night ramen.',
            delta: 17,
          },
          {
            text: '🌹 Sunday kissaten coffee followed by MOCA, let’s go.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
  },
  {
    id: 'liam',
    name: 'Liam',
    age: 28,
    role: 'him',
    tier: 'cameo',
    discoveryDoor: 'hinge',
    matchSelectivity: 'selective',
    activeStatusLabel: 'Active today',
    tagline: 'Custom alpine timber framer splitting weeks between mountain builds & the coast.',
    vitals: {
      height: '6\'2"',
      job: 'Custom Home Builder',
      school: 'Colorado State',
      neighborhood: 'Topanga / Ojai',
      lookingFor: 'Long-term partner',
      kidsStance: 'Open to kids',
    },
    slides: makeSlides('liam', [
      'Heading down from Ojai for the weekend',
      'Framing day up in the hills before the rain hit',
      'Firewood stacked, peach cobbler goes in next',
      'Early morning paddle out on the lake',
      'Coffee break on the job site',
      'Traded work boots and flannel for a real jacket',
    ]),
    prompts: [
      {
        id: 'liam-p1',
        question: "A friend's review of me",
        answer:
          'Builds houses that survive blizzards, bakes cast-iron peach cobbler from scratch, and still opens every truck and restaurant door.',
        openers: [
          { text: 'Nice beard!', delta: -4 },
          {
            text: 'Hand-built cedar canoes AND homemade peach cobbler? Save me a seat by the fire.',
            delta: 18,
          },
          {
            text: '🌹 Bring that wool coat down from Topanga Friday, first bourbon is waiting.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'liam-p2',
        question: 'Together, we could',
        answer:
          'Get out of LA traffic on Friday, grill fresh trout up in Ojai, and sit out on the deck watching the stars.',
        openers: [
          { text: 'Love Ojai!', delta: -2 },
          {
            text: 'Oak-grilled trout and zero freeway noise sounds like heaven. I’ll bring the Syrah.',
            delta: 18,
          },
          {
            text: '🌹 Pack two mugs for the sunrise canoe paddle. Saturday in Ojai is a yes.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'liam-p3',
        question: 'My simple pleasures',
        answer:
          'Fresh cedar shavings, acoustic Willie Nelson on Sunday morning, and steady, drama-free affection.',
        openers: [
          { text: 'So sweet', delta: -6 },
          {
            text: 'Stardust-era Willie Nelson on a Sunday deck wins instant bonus points.',
            delta: 17,
          },
          {
            text: '🌹 Put Stardust on vinyl and pour two coffees, let’s start with Friday drinks.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
  },

  // ================= 5 MAIN ROMANCE LEADS (HER. FOR HIM) =================
  {
    id: 'elena',
    name: 'Elena',
    age: 44,
    role: 'her',
    tier: 'main_lead',
    discoveryDoor: 'wild',
    primaryWildVenueId: 'hawthorne-campus',
    secondaryWildVenueId: 'left-bank-books',
    matchSelectivity: 'standout',
    activeStatusLabel: 'Met In The Wild • Hawthorne Univ.',
    tagline: 'Comparative literature chair with razor-sharp wit and strict post-grades rules.',
    vitals: {
      height: '5\'2"',
      job: 'Department Chair & Author',
      school: 'Columbia PhD',
      neighborhood: 'Westwood Hills',
      lookingFor: 'Electric intellectual & romantic equal',
      kidsStance: 'Child-free by choice',
    },
    slides: makeSlides('elena', [
      'Grading essays is survivable only with late-afternoon sun',
      'Autumn walk across the north quad',
      'Left Bank sidewalk espresso, sunglasses stay on before ten',
      'Faculty contemporary opening',
      'Rainy Sunday reading corner, do not disturb without tea',
      'Coastal Highway 1 drive with Sheryl Crow turned all the way up',
    ]),
    prompts: [
      {
        id: 'elena-p1',
        question: 'Green flags I look for',
        answer:
          'Curiosity without pretension, knowing how to hold your own in an argument without sulking, and booking a real 8 PM table without asking me twenty logistics questions.',
        openers: [
          { text: 'Hey professor 😉', delta: -12 },
          {
            text: 'Table for two at 8 PM Friday is already held, bring your sharpest critique.',
            delta: 18,
          },
          {
            text: '🌹 Zero logistics homework for you: 8 PM corner table at Osteria Mozza, and I actually finished Chéri.',
            delta: 26,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'elena-p2',
        question: 'My simple pleasures',
        answer:
          'First-edition margins, dry Sancerre, a man who actually reads past the headline, and slow mornings after deadlines close.',
        openers: [
          { text: 'What books do you write?', delta: 4 },
          {
            text: 'Chilled Sancerre and zero deadline talk all evening, let me take you out Thursday.',
            delta: 18,
          },
          {
            text: '🌹 Chilled Sancerre waiting at 7:45, tell me the one novel you think everyone misreads.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'elena-p3',
        question: 'First round is on me if',
        answer:
          'You can make me laugh inside sixty seconds without mentioning seminars, footnotes, or my height.',
        openers: [
          { text: 'Haha deal!', delta: -6 },
          {
            text: 'Deal, all three topics are officially embargoed, though I’m still getting the first round.',
            delta: 18,
          },
          {
            text: '🌹 Embargo accepted. Meet me by the gallery bar at eight and time me.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
    vulnerabilityNote:
      'Used to men her age competing with her intellect; falls deeply when a younger partner delights in her brilliance while taking warm romantic initiative.',
  },
  {
    id: 'claire',
    name: 'Claire',
    age: 46,
    role: 'her',
    tier: 'main_lead',
    discoveryDoor: 'wild',
    primaryWildVenueId: 'velvet-room',
    secondaryWildVenueId: 'terminal-b-airport',
    matchSelectivity: 'standout',
    activeStatusLabel: 'Met In The Wild • The Marlow Lounge',
    tagline: 'Coastal M&A partner: peaceful oceanfront home, grown kids, happily never remarrying.',
    vitals: {
      height: '5\'8"',
      job: 'Senior M&A Partner',
      school: 'Stanford Law',
      neighborhood: 'Manhattan Beach',
      lookingFor: 'Committed Living-Apart-Together romance',
      kidsStance: 'Two grown kids in college',
    },
    slides: makeSlides('claire', [
      'Post-closing exhale',
      'Dusk from the 34th floor before turning my phone off',
      'Bluff walk barefoot, best reset after deal week',
      'One Gibson martini, three olives',
      'Highway 1 with the top down',
      'Sunday Pinot on my own deck',
    ]),
    prompts: [
      {
        id: 'claire-p1',
        question: 'The hallmark of a good relationship is',
        answer:
          'Deep devotion, great weekends, and keeping two separate sets of house keys so we always choose each other on purpose.',
        openers: [
          { text: 'Hey gorgeous', delta: -10 },
          {
            text: 'Choosing each other every Friday while respecting your sanctuary sounds ideal, drinks Thursday?',
            delta: 18,
          },
          {
            text: '🌹 Keep your own keys and your Sunday peace, let me plan Friday at 8 from start to finish.',
            delta: 26,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'claire-p2',
        question: 'I won’t shut up about',
        answer:
          'Why crisp white sheets, punctual men, and restaurant booths you can actually hear across are civilization’s peak achievements.',
        openers: [
          { text: 'Totally agree lol', delta: -8 },
          {
            text: 'Quiet corner booth is booked for 7:30 sharp, and I arrive five minutes early.',
            delta: 18,
          },
          {
            text: '🌹 7:25 arrival, quiet leather booth, Gibson martini waiting when you sit down.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'claire-p3',
        question: "A friend's review of me",
        answer:
          'Intimidating for approximately ninety seconds until you realize she laughs loudest at dry, fearless banter.',
        openers: [
          { text: 'Im not intimidated!', delta: -4 },
          {
            text: 'Good to know I only have to survive the first ninety seconds, where can I take you Friday?',
            delta: 18,
          },
          {
            text: '🌹 Give me ninety seconds over martinis tomorrow night and judge for yourself.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
    vulnerabilityNote:
      'Swears off marriage after an exhausting divorce, yet melts for steady Living-Apart-Together loyalty with zero hidden agenda.',
  },
  {
    id: 'sienna',
    name: 'Sienna',
    age: 39,
    role: 'her',
    tier: 'main_lead',
    discoveryDoor: 'both',
    primaryWildVenueId: 'velvet-palms-bbq',
    secondaryWildVenueId: 'havana-salsa',
    matchSelectivity: 'selective',
    activeStatusLabel: 'Active today',
    tagline: 'Spanish-revival interior designer with an olive-tree courtyard & zero chill for secrecy.',
    vitals: {
      height: '5\'5"',
      job: 'Principal Interior Designer',
      school: 'UCLA Architecture & Design',
      neighborhood: 'Sunset Hills / Pasadena',
      lookingFor: 'Proud, public partnership',
      kidsStance: 'Done / Happy auntie',
    },
    slides: makeSlides('sienna', [
      'Happiest when the courtyard doors stay open past ten',
      'Styling hundred-year-old olive branches for our newest courtyard install',
      'Arguing with myself over travertine samples before nine',
      'String lights, chilled rosé, and zero tolerance for secret dating',
      '7 AM Rose Bowl vintage brass haul, bring strong arms',
      'Dressed up for Friday wine, zero interest in being anyone’s secret',
    ]),
    prompts: [
      {
        id: 'sienna-p1',
        question: 'Together, we could',
        answer:
          'Hit the 7 AM Pasadena antique market for vintage brass, argue playfully over espresso, and host twenty friends under string lights by dusk.',
        openers: [
          { text: 'Hi Sienna!', delta: -8 },
          {
            text: 'I volunteer for heavy brass-carrying duty at 7 AM if I get the seat beside you under the string lights.',
            delta: 18,
          },
          {
            text: '🌹 7 AM cortados in hand, trunk cleared for vintage finds, pick you up Sunday?',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'sienna-p2',
        question: 'Green flags I look for',
        answer:
          'Emotional directness, effortless warmth with my friends and family, and never acting weird in public.',
        openers: [
          { text: 'I have green flags!', delta: -6 },
          {
            text: 'If I’m lucky enough to take you out, everybody in the room is going to know I’m with you.',
            delta: 18,
          },
          {
            text: '🌹 Zero hiding, hand in mine walking into dinner, let me book us Friday night.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'sienna-p3',
        question: 'My simple pleasures',
        answer:
          'Warm terracotta tile underfoot, Al Green on vinyl while cooking, and fresh figs.',
        openers: [
          { text: 'Love Al Green', delta: 4 },
          {
            text: 'Al Green on the turntable and fresh figs, let me cook dinner while you critique the lighting.',
            delta: 17,
          },
          {
            text: '🌹 Put "Let’s Stay Together" on first, where am I taking you Thursday at eight?',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
    vulnerabilityNote:
      'Because you know her younger nephew’s circle, she tests whether you claim her proudly in front of your friends instead of keeping things quiet.',
  },
  {
    id: 'priya',
    name: 'Priya',
    age: 36,
    role: 'her',
    tier: 'main_lead',
    discoveryDoor: 'wild',
    primaryWildVenueId: 'st-jude-coffee',
    matchSelectivity: 'selective',
    activeStatusLabel: 'Met In The Wild • St. Jude Courtyard',
    tagline: 'Level-1 trauma RN: calm in chaos, ruthless teaser, off-duty soft life.',
    vitals: {
      height: '5\'3"',
      job: 'Charge Trauma Nurse (RN)',
      school: 'UCSF Nursing',
      neighborhood: 'Culver / Coastal',
      lookingFor: 'Serious romance',
      kidsStance: 'Child-free & thriving',
    },
    slides: makeSlides('priya', [
      'Off-shift coastal ridge reset',
      '6:45 AM liberation coffee',
      'Post-shift croissants beat dinner dates sometimes',
      'Reformer stretch after three twelve-hour nights',
      'Indie art-book rabbit hole',
      'Proof I own silk dresses outside navy scrubs',
    ]),
    prompts: [
      {
        id: 'priya-p1',
        question: 'I fall for you if',
        answer:
          'You tease me right back without folding, respect daytime sleep after night shifts, and just send the restaurant address instead of polling me.',
        openers: [
          { text: 'Nurses are awesome!', delta: -6 },
          {
            text: 'Blackout-curtain sleep respected, and Friday at 7:45 is already booked when you wake up.',
            delta: 18,
          },
          {
            text: '🌹 Zero decision polls: Friday 7:45 corner booth is held, and breakfast tacos are on standby after shift.',
            delta: 26,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'priya-p2',
        question: "A friend's review of me",
        answer:
          'Unflappable in a trauma bay, shockingly competitive at board games, and hopelessly weak for a man who cooks real food.',
        openers: [
          { text: 'What games do you play?', delta: 4 },
          {
            text: 'Homemade garlic naan and lamb chops at my place if you promise mercy in Scrabble.',
            delta: 18,
          },
          {
            text: '🌹 Dinner cooked from scratch AND a rematch clause, name your free evening off-shift.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'priya-p3',
        question: 'My simple pleasures',
        answer:
          'Cardamom cold brew, ocean bluffs at golden hour, and silence for the first twenty minutes after a twelve-hour shift.',
        openers: [
          { text: 'Cardamom coffee sounds good', delta: -4 },
          {
            text: 'Cardamom cold brew waiting in the cupholder and twenty peaceful minutes of coastal views, deal.',
            delta: 18,
          },
          {
            text: '🌹 Deal, I’ll bring the cardamom cold brew and let the ocean view do the talking.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
    vulnerabilityNote:
      'Divorced an ex who resented her hospital hours and made her manage their whole household; blossoms when cared for off-duty.',
  },
  {
    id: 'summer',
    name: 'Summer',
    age: 33,
    role: 'her',
    tier: 'main_lead',
    discoveryDoor: 'hinge',
    secondaryWildVenueId: 'dawn-lap-pool',
    matchSelectivity: 'standout',
    activeStatusLabel: 'Standout • Active today',
    tagline: 'Malibu cosmetic dermatologist lowering the age slider for real energy & commitment.',
    vitals: {
      height: '5\'4"',
      job: 'Board-Certified Dermatologist',
      school: 'UCSD Med',
      neighborhood: 'Malibu / Brentwood',
      lookingFor: 'Marriage & future family',
      kidsStance: 'Wants kids in the next few years',
    },
    slides: makeSlides('summer', [
      'Post-surf hair, pre-clinic espresso',
      'Between Beverly Hills consults, mineral SPF 50 remains undefeated',
      'Dawn longboard before clinic rounds (yes I reapplied on my neck)',
      'Sunday farmers-market peonies and iced matcha',
      'Malibu sunset walk after wrapping my last patient chart',
      'Practicing my oceanfront anniversary toast, now taking applications',
    ]),
    prompts: [
      {
        id: 'summer-p1',
        question: 'What I’m actually looking for',
        answer:
          'Watched too many 38-year-old men stall on commitment, looking for an energetic, emotionally ready younger guy excited to build a real life (and family) together.',
        openers: [
          { text: 'Hey Summer ur gorgeous 🔥', delta: -10 },
          {
            text: 'Zero stalling here, know exactly what I want to build, and I wear SPF 50 daily. Drinks Friday?',
            delta: 18,
          },
          {
            text: '🌹 Standout Rose: Clear eyes on commitment, dawn surf stamina, and Friday 7:30 in Malibu, say when.',
            delta: 26,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'summer-p2',
        question: 'First round is on me if',
        answer:
          'You applied sunscreen to your neck today and can paddle out past the Malibu break without whining about cold water.',
        openers: [
          { text: 'Oops forgot sunscreen haha', delta: -8 },
          {
            text: 'Mineral SPF 50 applied at 7 AM and wetsuit stays in the trunk, where are we celebrating after?',
            delta: 18,
          },
          {
            text: '🌹 Dawn paddle at First Point Saturday, followed by breakfast burritos on me.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'summer-p3',
        question: 'My simple pleasures',
        answer:
          'Peonies on the kitchen island, fish tacos in wet hair after surfing, and men who plan real dates.',
        openers: [
          { text: 'Love fish tacos!', delta: -2 },
          {
            text: 'Pink peonies and an 8 PM oceanfront table this Thursday, let me take care of the rest.',
            delta: 18,
          },
          {
            text: '🌹 Table overlooking the pier is held for 8 PM Thursday, peonies included.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
    vulnerabilityNote:
      'Upfront about wanting real marriage & kids so commitment-phobes filter themselves out early; rewards genuine steadiness.',
  },

  // ================= 2 DISGUISED RED-FLAG TRAPS (HER. FOR HIM) =================
  {
    id: 'vanessa',
    name: 'Vanessa',
    age: 43,
    role: 'her',
    tier: 'trap',
    discoveryDoor: 'hinge',
    matchSelectivity: 'warm',
    activeStatusLabel: 'Active late nights',
    tagline: 'Luxury resort wine importer who is "practically separated" in the same estate.',
    vitals: {
      height: '5\'7"',
      job: 'Import Portfolio Director',
      school: 'Georgetown',
      neighborhood: 'Bel Air Crest',
      lookingFor: 'Spontaneous thrills',
      kidsStance: 'Prefer not to say',
    },
    slides: makeSlides('vanessa', [
      'Slipping away to the Westside for a quiet afternoon glass',
      'Sneaking out between Bel Air property-tax meetings',
      'Wednesday 2 PM hotel pool, my favorite quiet window',
      'Resort tasting notes, strictly allergic to rigid schedules',
      'Phones go on airplane mode after 6:30 PM, darling',
      'Spontaneous afternoon escapes > complicated labels',
    ]),
    prompts: [
      {
        id: 'vanessa-p1',
        question: 'My current chapter',
        answer:
          'Practically divorced, we just still share the Bel Air property for tax logistics, so we’ll stick to boutique hotels on your side of town!',
        openers: [
          { text: 'Works for me! Let’s grab a drink.', delta: 15 },
          {
            text: '"Practically divorced for tax logistics" sounds like your husband still eats breakfast in that kitchen.',
            delta: 18,
          },
          {
            text: '🌹 Define "practically divorced" over one hotel martini. I have questions.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'vanessa-p2',
        question: 'Together, we could',
        answer:
          'Disappear to a boutique hotel lounge on a random Wednesday afternoon when my house calendar gets noisy.',
        openers: [
          { text: 'Love spontaneous Wednesdays!', delta: 14 },
          {
            text: 'Wednesday afternoon hotel escapes, is that the Table 9 alibi schedule?',
            delta: 18,
          },
          {
            text: '🌹 One drink in daylight first, let’s see how finalized that separation really is.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'vanessa-p3',
        question: 'Green flags I look for',
        answer:
          'Never calling unannounced after 6:30 PM and knowing how to enjoy the moment without labels.',
        openers: [
          { text: 'Easygoing here!', delta: 14 },
          {
            text: 'Another 6:30 PM phone blackout, half of Bel Air has the exact same curfew.',
            delta: 18,
          },
          {
            text: '🌹 Tell me the real story behind the 6:30 curfew.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
    ],
    trapTellSummary:
      '"Practically divorced" mirage: still married in the same Bel Air house, using hotel-bar afternoons as cover.',
  },
  {
    id: 'brooke',
    name: 'Brooke',
    age: 42,
    role: 'her',
    tier: 'trap',
    discoveryDoor: 'both',
    primaryWildVenueId: 'palisades-racquet',
    matchSelectivity: 'warm',
    activeStatusLabel: 'Active now',
    tagline: 'Palisades tennis regular who insists on sitting right beside Table 9 on Friday.',
    vitals: {
      height: '5\'7"',
      job: 'Philanthropy Gala Chair',
      school: 'SMU',
      neighborhood: 'Pacific Palisades',
      lookingFor: 'Tall, photogenic Friday date',
      kidsStance: 'Done',
    },
    slides: makeSlides('brooke', [
      'Court 1 warmups before Friday steakhouse plans',
      'Cabana spritzes, bonus points if you look sharp in a navy blazer',
      'Golden-hour terrace check, posture matters',
      'Sunday racquet-club brunch debrief with the girls',
      'Museum gala arrival (yes the photographers were right on cue)',
      '8 PM Friday reservation right across from Table 9 is already locked',
    ]),
    prompts: [
      {
        id: 'brooke-p1',
        question: 'My non-negotiable Friday spot',
        answer:
          'One very specific steakhouse patio at 8:00 PM sharp, sit facing the center banquette and laugh loud when my ex-husband Richard walks past Table 9.',
        openers: [
          { text: 'Haha happy to help!', delta: 15 },
          {
            text: 'Wait, am I an actual date or a hired stunt double for Richard at Table 9?',
            delta: 18,
          },
          {
            text: '🌹 Only if we skip Richard’s steakhouse completely and go somewhere for us.',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'brooke-p2',
        question: 'Green flags I look for',
        answer:
          'Great posture in a blazer, photogenic profile for club-patio candids, and laughing at all my jokes on cue.',
        openers: [
          { text: 'I clean up great in a blazer!', delta: 14 },
          {
            text: 'Sounds like a casting call for Revenge on Court 4.',
            delta: 18,
          },
          {
            text: '🌹 Tell me honestly, how many times has Richard come up this week?',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'brooke-p3',
        question: 'Typical Sunday',
        answer:
          'Comparing notes at racquet-club brunch on who looked happier Friday night.',
        openers: [
          { text: 'Love brunch!', delta: 14 },
          {
            text: 'Scoreboard brunch sounds exhausting, ever go on a date with zero audience?',
            delta: 18,
          },
          {
            text: '🌹 Spill the real Table 9 gossip, why is Richard there every Friday?',
            delta: 22,
            isVipSmooth: true,
          },
        ],
      },
    ],
    trapTellSummary:
      'Ex-husband revenge pawn: uses younger dates strictly to parade past her ex Richard’s Table 9 booth.',
  },

  // ================= 4 HIGH-HOTNESS CAMEOS (HER. FOR HIM) =================
  {
    id: 'celeste',
    name: 'Celeste',
    age: 58,
    role: 'her',
    tier: 'cameo',
    discoveryDoor: 'both',
    primaryWildVenueId: 'left-bank-books',
    secondaryWildVenueId: 'terminal-b-airport',
    matchSelectivity: 'selective',
    activeStatusLabel: 'Active today',
    tagline: 'Palm Springs contemporary art gallerist, vintage convertible driver & jazz devotee.',
    vitals: {
      height: '5\'7"',
      job: 'Contemporary Gallery Owner',
      school: 'RISD',
      neighborhood: 'Palm Springs / Westside',
      lookingFor: 'Cultured, joyful companionship',
      kidsStance: 'Grown kids • Proud Gigi',
    },
    slides: makeSlides('celeste', [
      'Desert afternoon light before opening the gallery doors',
      'Gallery opening toast, icy Gibson up, cocktail onion required',
      'Top down past the San Jacinto palms with Chet Baker on',
      'Quiet sculpture-garden coffee before collectors arrive',
      'Candlelight under the bougainvillea beats loud nightclubs every time',
      'Palm Springs twilight, top goes down at five sharp',
    ]),
    prompts: [
      {
        id: 'celeste-p1',
        question: 'Together, we could',
        answer:
          'Drive my powder-blue convertible out to Joshua Tree at dusk, put Chet Baker on vinyl, and open a remarkable Châteauneuf-du-Pape.',
        openers: [
          { text: 'Cool car!', delta: -4 },
          {
            text: 'Chet Baker on vinyl and desert twilight. I’ll pack the figs and let you pick the bottle.',
            delta: 18,
          },
          {
            text: '🌹 Save the passenger seat Friday. I’d love to take you to dinner before the desert drive.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'celeste-p2',
        question: 'Green flags I look for',
        answer:
          'Old-school manners, unhurried conversation, and holding my hand across the plaza like we own the evening.',
        openers: [
          { text: 'Im super polite!', delta: -4 },
          {
            text: 'Walking across any plaza beside you would be the easiest flex in California.',
            delta: 18,
          },
          {
            text: '🌹 Car door opened, phone silenced, hand held across the plaza. Thursday at eight?',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'celeste-p3',
        question: 'My simple pleasures',
        answer:
          'Crisp white linen, dry Gibsons up, and men who never apologize for having good taste.',
        openers: [
          { text: 'What is a Gibson?', delta: -6 },
          {
            text: 'Cocktail onion over olives, impeccable call. Let me order two for us Friday.',
            delta: 18,
          },
          {
            text: '🌹 Two icy Gibsons up at 7:30, tell me about the new desert installation.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
  },
  {
    id: 'astrid',
    name: 'Astrid',
    age: 41,
    role: 'her',
    tier: 'cameo',
    discoveryDoor: 'hinge',
    matchSelectivity: 'selective',
    activeStatusLabel: 'Active 3h ago',
    tagline: 'Stockholm-born sculptural furniture founder splitting time between Malibu & fjords.',
    vitals: {
      height: '5\'10"',
      job: 'Design Studio Founder',
      school: 'Konstfack Stockholm',
      neighborhood: 'Malibu Point',
      lookingFor: 'Active, sunlit partnership',
      kidsStance: 'Child-free by choice',
    },
    slides: makeSlides('astrid', [
      'Salt air and linen, happiest ten steps from the Pacific',
      'Inspecting solid-oak joinery, zero nails, zero shortcuts',
      'Back home in Sweden where nobody complains about cold water',
      'Post-ocean-plunge cedar sauna, three minutes minimum, no speeches',
      'Studio terrace light before evening wine',
      'Natural wine with zero small talk',
    ]),
    prompts: [
      {
        id: 'astrid-p1',
        question: 'First round is on me if',
        answer:
          'You survive three minutes in the cold ocean plunge before our cedar sauna session without making a dramatic speech about it.',
        openers: [
          { text: 'Brrr too cold!!', delta: -6 },
          {
            text: 'Three calm minutes in the Pacific, zero speeches, then I’m buying the post-sauna wine.',
            delta: 18,
          },
          {
            text: '🌹 Stopwatch ready for Saturday morning, and dinner Friday night is on me first.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'astrid-p2',
        question: 'My simple pleasures',
        answer:
          'Early ocean walks in Malibu, warm cardamom buns, and yes I check labels for seed oils lol.',
        openers: [
          { text: 'Hey how are you!', delta: -8 },
          {
            text: 'Skipping small talk completely: favorite cardamom bun in LA, and can I take you Thursday?',
            delta: 18,
          },
          {
            text: '🌹 Fresh cardamom buns for our Malibu bluff walk Sunday, or natural wine Friday at 8.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'astrid-p3',
        question: 'I geek out on',
        answer:
          'Joinery without nails, Nordic cinema, and men who pack light for spontaneous weekends.',
        openers: [
          { text: 'I pack light!', delta: 4 },
          {
            text: 'One carry-on duffel and five minutes’ notice, test me anytime.',
            delta: 17,
          },
          {
            text: '🌹 Carry-on stays packed, let’s start with natural wine in Santa Monica Friday.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
  },
  {
    id: 'camila',
    name: 'Camila',
    age: 39,
    role: 'her',
    tier: 'cameo',
    discoveryDoor: 'hinge',
    primaryWildVenueId: 'cougarmarket',
    matchSelectivity: 'warm',
    activeStatusLabel: 'Active today',
    tagline: 'Chef-owner of a wood-fired coastal osteria who feeds the people she adores.',
    vitals: {
      height: '5\'4"',
      job: 'Executive Chef & Restaurateur',
      school: 'Culinary Institute',
      neighborhood: 'Venice Canals',
      lookingFor: 'Passionate partner-in-crime',
      kidsStance: 'Open',
    },
    slides: makeSlides('camila', [
      'Five quiet minutes with an espresso before dinner service starts',
      'Cellar barrel check before sixty covers walk through the door',
      'Tweezers out on the wood-fired pass, don’t ask me to cook on Mondays',
      'Monday night off, officially banned from touching a skillet',
      '8 AM Wednesday fig & heirloom tomato raid',
      'Rare slow Sunday when someone else finally orders the pastries',
    ]),
    prompts: [
      {
        id: 'camila-p1',
        question: 'The way to win me over is',
        answer:
          'Cook me one simple, honest meal on my Monday night off so I finally get to sit on the other side of the counter with a glass of wine.',
        openers: [
          { text: 'Im intimidated to cook for a chef lol', delta: -4 },
          {
            text: 'Monday night off: sit at the island with Rioja while I make roasted garlic pasta and handle every dish.',
            delta: 18,
          },
          {
            text: '🌹 Chef is officially off duty Monday, chilled Albariño, simple grilled sea bass, and zero pans for you.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'camila-p2',
        question: 'My simple pleasures',
        answer:
          'Flaky sea salt, late-night kitchen cumbia after close, and men with warm eyes who eat bread without counting macros.',
        openers: [
          { text: 'Bread is the best!', delta: 6 },
          {
            text: 'Warm sourdough, olive oil, and spinning you around the kitchen to cumbia, count me in.',
            delta: 18,
          },
          {
            text: '🌹 Zero macro-counting allowed, let me take you for late-night oysters after your Saturday close.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'camila-p3',
        question: 'Together, we could',
        answer:
          'Raid the Santa Monica farmers market at 8 AM and argue passionately over heirloom tomatoes.',
        openers: [
          { text: 'Sounds fun', delta: -6 },
          {
            text: 'I’ll carry the market crates while you pick the winning heirloom tomatoes.',
            delta: 17,
          },
          {
            text: '🌹 8 AM Wednesday market date, cortados in hand, crates on my shoulder.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
  },
  {
    id: 'vivienne',
    name: 'Vivienne',
    age: 61,
    role: 'her',
    tier: 'cameo',
    discoveryDoor: 'hinge',
    matchSelectivity: 'selective',
    activeStatusLabel: 'Active today',
    tagline: 'Independent European film producer splitting seasons between Cannes & the Pacific.',
    vitals: {
      height: '5\'7"',
      job: 'Film Producer',
      school: 'Sorbonne Paris',
      neighborhood: 'Beverly Hills Flats',
      lookingFor: 'Witty, fearless romance',
      kidsStance: 'Grown daughter in Paris',
    },
    slides: makeSlides('vivienne', [
      'Left Bank habits in Beverly Hills sunlight',
      'Screening-room notes, third row center is non-negotiable',
      'Morning espresso along the Croisette before festival madness',
      'Late-August table in Provence that ran until midnight',
      'Festival balcony between afternoon screenings',
      'Premiere night, first man to say "for your age" walks home',
    ]),
    prompts: [
      {
        id: 'vivienne-p1',
        question: "A friend's review of me",
        answer:
          'Allergic to boredom, speaks fluent French when charmed, and has zero interest in men who narrate their retirement portfolios.',
        openers: [
          { text: 'Bonjour!!', delta: -6 },
          {
            text: 'Zero portfolio talk promised, just third-row cinema debates and a proper bottle of Burgundy.',
            delta: 18,
          },
          {
            text: '🌹 Let me earn one French compliment over candlelit Burgundy this Friday at eight.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'vivienne-p2',
        question: 'First round is on me if',
        answer:
          'You pick an atmospheric bistro, arrive on the dot, and never utter the phrase "for your age."',
        openers: [
          { text: 'You look amazing!', delta: 6 },
          {
            text: 'Those three words don’t exist in my vocabulary, 8 PM corner banquette at Petit Trois?',
            delta: 18,
          },
          {
            text: '🌹 Petit Trois at 8 PM sharp, and the first Champagne coupe is already handled.',
            delta: 25,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'vivienne-p3',
        question: 'Together, we could',
        answer:
          'Catch a 35mm midnight revival screening and debate the third act over steak frites.',
        openers: [
          { text: 'Love movies!', delta: -6 },
          {
            text: '35mm revival at the New Beverly followed by late-night steak frites, name the Friday.',
            delta: 18,
          },
          {
            text: '🌹 Two third-row center tickets held for Friday, steak frites right after.',
            delta: 24,
            isVipSmooth: true,
          },
        ],
      },
    ],
  },
];

const CAST_STORY_HOOKS_AND_VOICES: Record<
  string,
  { voicePrompt: HingeVoicePrompt; fridayStoryHook: string }
> = {
  julian: {
    voicePrompt: {
      question: 'Fair warning before we match',
      duration: '0:09',
      transcript:
        '“Fair warning before you match me... I still say half seven instead of seven-thirty, and yeah, I actually show up five minutes early.”',
      audioUrl: './audio/voices/julian.mp3',
    },
    fridayStoryHook:
      'If you match: Shows up five minutes early with flowers, right before a snooty acquaintance mistakes him for your intern.',
  },
  soren: {
    voicePrompt: {
      question: 'My honest restaurant rule',
      duration: '0:10',
      transcript:
        '“Okay be honest... if we walk into a restaurant and they have bright white overhead lights on, are you cool walking right back out with me and grabbing wine somewhere normal?”',
      audioUrl: './audio/voices/soren.mp3',
    },
    fridayStoryHook:
      'If you match: Pulls you out of an overrated bright restaurant into the coziest neighborhood wine bar in Santa Monica.',
  },
  miles: {
    voicePrompt: {
      question: 'How I handle Friday plans',
      duration: '0:08',
      transcript:
        '“Honestly, best part of Friday is telling you I already booked dinner at seven-thirty, so all you have to do is get in the car and unwind.”',
      audioUrl: './audio/voices/miles.mp3',
    },
    fridayStoryHook:
      'If you match: Turns a chaotic Terminal B flight delay into the easiest Friday dinner of your month.',
  },
  rafael: {
    voicePrompt: {
      question: 'If you swear you have two left feet',
      duration: '0:08',
      transcript:
        '“Look, if you say you can’t dance, don’t stress at all... give me one song in the kitchen while pasta water’s boiling and I’ll prove you wrong.”',
      audioUrl: './audio/voices/rafael.mp3',
    },
    fridayStoryHook:
      'If you match: Gets you laughing on the Havana & Vine patio inside three minutes flat.',
  },
  marcus: {
    voicePrompt: {
      question: 'Checking in after shift',
      duration: '0:09',
      transcript:
        '“Just got off a twenty-four hour shift, got iced coffee in hand... honestly just looking for someone funny who doesn’t play weird texting games.”',
      audioUrl: './audio/voices/marcus.mp3',
    },
    fridayStoryHook:
      'If you match: Shows up off-duty well-rested, easygoing, and completely unbothered by public stares.',
  },
  graham: {
    voicePrompt: {
      question: 'Let’s grab an early drink',
      duration: '0:08',
      transcript:
        '“Hey, crazy week at the office as usual... let’s grab a quick 5:15 drink Thursday before my 6:45 Tokyo call. Super easy.”',
      audioUrl: './audio/voices/graham.mp3',
    },
    fridayStoryHook:
      'If you match: Effortless 5:15 PM hotel-bar charm, so why do three men near Table 9 check their watches at 6:42 sharp?',
  },
  connor: {
    voicePrompt: {
      question: 'Quick note about my age on here',
      duration: '0:09',
      transcript:
        '“Yo swear this app messed up my age when I connected Facebook, ignore the 27... anyway my roommates are throwing a little rooftop thing Friday, pull up!”',
      audioUrl: './audio/voices/connor.mp3',
    },
    fridayStoryHook:
      'If you match: Blames Facebook for his birth year while four roommates argue over Xbox cables in the background.',
  },
  devon: {
    voicePrompt: {
      question: 'My ideal first hangout',
      duration: '0:07',
      transcript:
        '“Honestly I’m way over overpriced restaurants lately... why not just order Thai food to your couch tonight and keep it super chill?”',
      audioUrl: './audio/voices/devon.mp3',
    },
    fridayStoryHook:
      'If you match: Writes romantic texts all Tuesday, then tries to invite himself over on a zero-dollar budget Friday.',
  },
  rory: {
    voicePrompt: {
      question: 'Four months into California life',
      duration: '0:10',
      transcript:
        '“Alright, full confession... I’ve been in California four months and I still get sunburned in January, so if you know a shady patio spot, first round’s on me.”',
      audioUrl: './audio/voices/rory.mp3',
    },
    fridayStoryHook:
      'If you match: Saves you a shady garden bench after hours with warm berry crumble and zero pretense.',
  },
  jin: {
    voicePrompt: {
      question: 'Biggest first-date green flag',
      duration: '0:10',
      transcript:
        '“Big green flag for me? Actually putting phones away at dinner. Like, if the food shows up and nobody takes a photo of it, I’m already half in love.”',
      audioUrl: './audio/voices/jin.mp3',
    },
    fridayStoryHook:
      'If you match: Books two seats at a quiet Little Tokyo vinyl bar where both phones stay in coat pockets.',
  },
  liam: {
    voicePrompt: {
      question: 'Friday plans down from Ojai',
      duration: '0:08',
      transcript:
        '“Heading down from Ojai on Friday, truck’s finally washed... tell me your favorite neighborhood bar and let’s grab a real drink.”',
      audioUrl: './audio/voices/liam.mp3',
    },
    fridayStoryHook:
      'If you match: Drives down from his Ojai build in a clean jacket and opens every door without making a big deal of it.',
  },
  summer: {
    voicePrompt: {
      question: 'Before you confess your skincare routine',
      duration: '0:08',
      transcript:
        '“Yes I’m a dermatologist, no I won’t judge if you forgot sunscreen today... okay I might tease you a little bit, but drinks are still on.”',
      audioUrl: './audio/voices/summer.mp3',
    },
    fridayStoryHook:
      'If you match: Trades Beverly Hills clinic hours for Malibu fish tacos and honest talk about what you both want.',
  },
  sienna: {
    voicePrompt: {
      question: 'One question about your apartment',
      duration: '0:08',
      transcript:
        '“Quick question... why does every guy’s apartment either have zero lamps or one blinding ceiling bulb? Please tell me you own a lamp.”',
      audioUrl: './audio/voices/sienna.mp3',
    },
    fridayStoryHook:
      'If you match: Invites you to a backyard Pasadena wine night to see how well you hold your own around her friends.',
  },
  elena: {
    voicePrompt: {
      question: 'One ground rule before messaging me',
      duration: '0:08',
      transcript:
        '“Okay, ground rule... please don’t open with hey professor. Just pick a great sushi spot for Friday night and talk to me like a normal person.”',
      audioUrl: './audio/voices/elena.mp3',
    },
    fridayStoryHook:
      'If you match: Leaves campus talk at the door for late-night sushi and dry humor.',
  },
  claire: {
    voicePrompt: {
      question: 'Easiest way to win Friday night',
      duration: '0:09',
      transcript:
        '“Look, I make decisions at work from seven AM to six... if you just text me I booked a table for eight, you’re already ahead of ninety percent of men.”',
      audioUrl: './audio/voices/claire.mp3',
    },
    fridayStoryHook:
      'If you match: Steps out of deal week for martinis where corporate small talk is strictly banned.',
  },
  priya: {
    voicePrompt: {
      question: 'Finally off three night shifts',
      duration: '0:08',
      transcript:
        '“Just finished three night shifts in a row, finally human again... take me somewhere with good tacos and zero hospital talk, and I’m yours.”',
      audioUrl: './audio/voices/priya.mp3',
    },
    fridayStoryHook:
      'If you match: Meets you off-shift ready to laugh, tease back, and ignore every work alert.',
  },
  vanessa: {
    voicePrompt: {
      question: 'Why I prefer weekday afternoons',
      duration: '0:08',
      transcript:
        '“Weekends are always so chaotic at the house... honestly nothing beats sneaking off to a quiet hotel bar on a Wednesday afternoon.”',
      audioUrl: './audio/voices/vanessa.mp3',
    },
    fridayStoryHook:
      'If you match: Orders afternoon Champagne in a shadowy hotel booth until her home security app starts buzzing.',
  },
  brooke: {
    voicePrompt: {
      question: 'Friday at eight sharp',
      duration: '0:08',
      transcript:
        '“So there’s this great steakhouse in the Palisades... Friday at eight sharp, sit facing the middle booth with me and just laugh at all my jokes, deal?”',
      audioUrl: './audio/voices/brooke.mp3',
    },
    fridayStoryHook:
      'If you match: Insists on one exact Palisades patio table right across from her ex-husband Richard at Table 9.',
  },
  celeste: {
    voicePrompt: {
      question: 'What I actually want on a Friday',
      duration: '0:08',
      transcript:
        '“I’m way past loud nightclubs and shouting over a DJ... give me a cold martini, a quiet booth, and a man who actually listens.”',
      audioUrl: './audio/voices/celeste.mp3',
    },
    fridayStoryHook:
      'If you match: Hands you the keys to her vintage convertible after a Palm Springs gallery opening.',
  },
  astrid: {
    voicePrompt: {
      question: 'Swedish honesty vs. LA flaking',
      duration: '0:10',
      transcript:
        '“People in LA always say let’s grab drinks soon and never mean it. I’m Swedish... if I say Friday at eight, I actually mean Friday at eight.”',
      audioUrl: './audio/voices/astrid.mp3',
    },
    fridayStoryHook:
      'If you match: Invites you for Malibu sunset wine where small talk and flaking don’t exist.',
  },
  camila: {
    voicePrompt: {
      question: 'Why Mondays are sacred',
      duration: '0:08',
      transcript:
        '“Since I cook for sixty people every night, I’m banned from my own stove on Mondays... make me grilled cheese and pour some red wine, that’s literally it.”',
      audioUrl: './audio/voices/camila.mp3',
    },
    fridayStoryHook:
      'If you match: Saves you two seats at her wood-fired counter, then lets you cook on her Monday off.',
  },
  vivienne: {
    voicePrompt: {
      question: 'One rule before dinner',
      duration: '0:07',
      transcript:
        '“Simple rule before we go to dinner... show up on time, skip the small talk, and never add the words for your age to a compliment.”',
      audioUrl: './audio/voices/vivienne.mp3',
    },
    fridayStoryHook:
      'If you match: Takes you to a midnight 35mm French film screening followed by late steak frites.',
  },
};

for (const profile of V35_CAST_PROFILES) {
  const extras = CAST_STORY_HOOKS_AND_VOICES[profile.id];
  if (extras) {
    profile.voicePrompt = extras.voicePrompt;
    profile.fridayStoryHook = extras.fridayStoryHook;
  }
}

export function getCastProfileById(id: string): V35CastProfile | undefined {
  return V35_CAST_PROFILES.find((p) => p.id === id);
}
