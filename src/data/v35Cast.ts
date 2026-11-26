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
  subtextTell: string;
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
      '',
      'Happiest buried in archive notebooks (glasses come off by dinner)',
      '6 AM river miles, promise I’m much calmer by half seven',
      '',
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
      '',
      'Clay courts beat hard courts, willing to defend this over drinks',
      'Late-night balsa pavilion model before client review',
      'Post-cold-plunge dock coffee back home',
      'Saturday sourdough run on two wheels',
      'Cleaned up for the museum benefit',
    ]),
    prompts: [
      {
        id: 'soren-p1',
        question: 'My simple pleasures',
        answer:
          'Morning ocean swims, honest Scandinavian silence that doesn’t need filling, and cooking lemon sole with the terrace doors wide open.',
        openers: [
          { text: 'Wow ur super tall!!', delta: -8 },
          {
            text: 'Comfortable silence plus lemon sole with the doors open might be the best pitch on this app.',
            delta: 18,
          },
          {
            text: '🌹 Standout Rose: Save the small talk, bring that clay-court focus to Thursday martinis at 8.',
            delta: 26,
            isVipSmooth: true,
          },
        ],
      },
      {
        id: 'soren-p2',
        question: 'First round is on me if',
        answer:
          'You can return my left-handed slice on clay, or ruthlessly roast bad restaurant lighting with me.',
        openers: [
          { text: 'I dont play tennis haha', delta: -6 },
          {
            text: 'Overhead fluorescent bulbs in restaurants should be illegal, first round is officially on you.',
            delta: 17,
          },
          {
            text: '🌹 One set of mixed doubles at Palisades followed by dim candlelight, winner picks the wine.',
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
      'Checking cedar pergola sightlines before opening night',
      'Timber terrace walkthrough',
      'Happiest under canvas when the wind picks up',
      '8:15 corner table, already handled',
      'Sunrise bluff miles before site calls',
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
          'Acoustic room warmth, aged bourbon, and classic wooden sailboats that require real rope work.',
        openers: [
          { text: 'Boats are fun', delta: -6 },
          {
            text: 'Tell me which restaurant in town actually nailed its room acoustics so we don’t have to shout.',
            delta: 17,
          },
          {
            text: '🌹 Quiet booth acoustics and a proper bourbon pour, show me your favorite room you built.',
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
      'Waiting on the courtyard band to kick in',
      'Hand-planing a twelve-foot black walnut dining slab',
      'Thursday nights at Havana & Vine',
      'Stovetop espresso before sawdust hours',
      'Seven-string acoustic by the rocks at dusk',
      'Cleaned the wood shavings off for rooftop drinks',
    ]),
    prompts: [
      {
        id: 'rafael-p1',
        question: 'Together, we could',
        answer:
          'Turn your kitchen into a midnight dance floor while fresh garlic oil sizzles on the stove.',
        openers: [
          { text: 'I cant dance lol', delta: -5 },
          {
            text: 'Fair warning: my kitchen spin requires steady hands and a good playlist.',
            delta: 18,
          },
          {
            text: '🌹 Bring the seven-string playlist. I’ll pour the Rioja while you lead.',
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
            text: '🌹 Oat cortado at 8 AM, and let’s test that salsa frame first.',
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
      '',
      'Quick harbor spin before my Sunday phone blackout kicks in',
      'Nine holes before markets open, please don’t tag me lol',
      'Hard stop at 6:42 PM sharp for my nightly Tokyo portfolio call',
      '',
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
    tagline: 'Campus "founder" & model who swears Hinge glitched his birth year.',
    vitals: {
      height: '6\'0"',
      job: 'Stealth Founder / Campus Rep',
      school: 'USC',
      neighborhood: 'West Hollywood / University Park',
      lookingFor: 'Figuring out my dating goals',
      kidsStance: 'Not sure yet',
    },
    slides: makeSlides('connor', [
      '',
      '2 AM bathroom mirror check, ignore the bottle of Tito’s on the sink lol',
      'DJing my four roommates’ rooftop day party, pull up',
      'Club lacrosse cardio so I survive frat formal',
      '',
      'Who wants to come to "my place in Maui" (it’s my parents’ Week-14 timeshare)',
    ]),
    prompts: [
      {
        id: 'connor-p1',
        question: 'Two truths and a lie',
        answer:
          'I played club lacrosse, I casually flex "my place in Maui" before admitting it’s my parents’ Week-14 timeshare, and Hinge totally locked my age wrong when I linked Facebook lol.',
        openers: [
          { text: 'Haha wait how old are you really?', delta: 16 },
          {
            text: 'Whenever a guy blames Facebook for his age on Hinge, the real number starts with a 2 and ends with a 1.',
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
      '',
      'Already writing verse two about our future Big Sur cabin',
      'Rainy Echo Park lyric notebook, feel everything at volume eleven',
      'Digging through dusty Blue Note vinyl I definitely couldn’t afford',
      '',
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
      '',
      'Inspecting the heritage oaks, still pinch myself this is my day job',
      'Not my dog, just my favorite muddy Tuesday trail regular',
      'Bought two hot chocolates at the Sunday market (one has your name on it)',
      '',
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
      '',
      'Contact-sheet edits. I promise I never photograph dinner plates',
      'Twelve-seat vinyl bar in Little Tokyo (saving the stool beside me)',
      'Testing 120mm film in morning window light',
      'Chalking up for the overhang project that humbled me twice',
      '',
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
          'Japanese kissaten pour-overs, architectural shadow lines, and handmade ceramics.',
        openers: [
          { text: 'Love matcha!', delta: -2 },
          {
            text: 'Show me the best kissaten pour-over downtown and I’ll critique your favorite gallery.',
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
      '',
      'Raising the main cedar ridge beam before mountain weather rolls in',
      'Winter firewood stacked, cast-iron peach cobbler goes in next',
      'Sunrise paddle in the cedar canoe I built last autumn',
      '',
      'Traded sawdust and flannel for wool at the lodge bar',
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
          'Escape city traffic for Ojai olive groves, grill trout over oak embers, and watch Perseid meteors from the wrap-around deck.',
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
      '',
      'Styling hundred-year-old olive branches for our newest courtyard install',
      'Arguing with myself over travertine samples before nine',
      'String lights, chilled rosé, and zero tolerance for secret dating',
      '7 AM Rose Bowl vintage brass haul, bring strong arms',
      '',
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
      '',
      'Between Beverly Hills consults, mineral SPF 50 remains undefeated',
      'Dawn longboard before clinic rounds (yes I reapplied on my neck)',
      'Sunday farmers-market peonies and iced matcha',
      '',
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
      '',
      'Sneaking out between Bel Air property-tax meetings',
      'Wednesday 2 PM hotel pool, my favorite quiet window',
      '',
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
      '',
      'Cabana spritzes, bonus points if you look sharp in a navy blazer',
      '',
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
      '',
      'Gallery opening toast, icy Gibson up, cocktail onion required',
      'Top down past the San Jacinto palms with Chet Baker on',
      'Quiet sculpture-garden coffee before collectors arrive',
      'Candlelight under the bougainvillea beats loud nightclubs every time',
      '',
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
      '',
      'Inspecting solid-oak joinery, zero nails, zero shortcuts',
      'Back home in Sweden where nobody complains about cold water',
      'Post-ocean-plunge cedar sauna, three minutes minimum, no speeches',
      '',
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
          'Dawn qigong and tai chi on the bluff, a strictly seed-oil-free kitchen, and honest conversation without small-talk filler.',
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
      '',
      'Cellar barrel check before sixty covers walk through the door',
      'Tweezers out on the wood-fired pass, don’t ask me to cook on Mondays',
      '',
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
      '',
      'Screening-room notes, third row center is non-negotiable',
      'Morning espresso along the Croisette before festival madness',
      'Late-August table in Provence that ran until midnight',
      '',
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
      question: 'My ideal Thursday night in 12 seconds',
      duration: '0:12',
      transcript:
        '“Quiet corner wine bar at half seven, phones face-down in my coat pocket, and you telling me the unfiltered truth about the exhibition we just walked out of.”',
      subtextTell: 'Warm Hampstead cadence, zero rehearsed pickup script, genuinely locks in on 1-on-1 conversation.',
    },
    fridayStoryHook:
      'If you match: Shows up five minutes early with peonies, until your snooty gallery acquaintance mistakes him for “the new intern” in front of the room.',
  },
  soren: {
    voicePrompt: {
      question: 'A wager I will gladly make you',
      duration: '0:14',
      transcript:
        '“One tiebreak set on clay before dinner. If you pass me down the line, cocktails are on me, and either way, I am not rushing our first night.”',
      subtextTell: 'Unhurried Nordic confidence, treats chemistry like a slow-burn rally rather than a sprint.',
    },
    fridayStoryHook:
      'If you match: Challenges you to twilight mixed doubles at Palisades Racquet, then drops a disarmingly honest confession over post-match spritzes.',
  },
  miles: {
    voicePrompt: {
      question: 'Proof I actually plan ahead',
      duration: '0:13',
      transcript:
        '“Tell me your flight landed twenty minutes early and I am already waiting by baggage claim with two proper espressos and dinner booked.”',
      subtextTell: 'Calm structural-engineer steadiness, zero flaking, zero chaos.',
    },
    fridayStoryHook:
      'If you match: Turns a chaotic Terminal B delay into the smoothest impromptu bistro table in town.',
  },
  rafael: {
    voicePrompt: {
      question: 'How you know I like you',
      duration: '0:11',
      transcript:
        '“I pull you onto the salsa floor during the brass break, spin you clean on the one, and save you the last plate of maduros.”',
      subtextTell: 'Playful rhythm and direct eye contact, zero hesitation about leading.',
    },
    fridayStoryHook:
      'If you match: Leads you onto the Havana Lounge brass floor before half the room realizes you only met ten minutes ago.',
  },
  marcus: {
    voicePrompt: {
      question: 'Sunday afternoon at my place sounds like',
      duration: '0:15',
      transcript:
        '“Vinyl spinning low, oak smoke drifting off the patio, and me defending why slow-smoked brisket refuses to be rushed for anybody.”',
      subtextTell: 'Grounded pitmaster patience, shows care through feeding people well.',
    },
    fridayStoryHook:
      'If you match: Pulls two VIP plates off the smoker and tests whether you can handle friendly banter with his regular crew.',
  },
  graham: {
    voicePrompt: {
      question: 'Why my calendar looks ruthless',
      duration: '0:13',
      transcript:
        '“Deal weeks get intense, so let’s grab an early 5:15 corner martini near Century City before my 6:45 client dinner, efficiency is romantic, right?”',
      subtextTell: 'Polished Wharton baritone, yet listen closely to that suspiciously hard 6:45 PM cutoff.',
    },
    fridayStoryHook:
      'If you match: Effortless 5:15 PM steakhouse charm, so why do three different men near Table 9 check their watches at 6:42 sharp?',
  },
  connor: {
    voicePrompt: {
      question: 'Quick disclaimer about my profile',
      duration: '0:14',
      transcript:
        '“Okay swear Facebook glitched my birth year when I made this account, ignore the 27, anyway pull up to our rooftop pregame Friday, my boys are DJing!”',
      subtextTell: 'Background bass thumping + three roommates yelling from a frat balcony mid-recording.',
    },
    fridayStoryHook:
      'If you match: Swears an app glitch changed his age, while four undergrad roommates argue over speaker cables in his living room.',
  },
  devon: {
    voicePrompt: {
      question: 'My love language in one take',
      duration: '0:12',
      transcript:
        '“Honestly I’m a cozy homebody king, why drop crazy money at loud restaurants when you could host me on your sectional and order takeout?”',
      subtextTell: 'Calls himself a “low-key homebody,” yet every suggestion conveniently relies on your sofa and your tab.',
    },
    fridayStoryHook:
      'If you match: Talks up a romantic Friday night, then tries to audit the appetizer math down to the penny.',
  },
  rory: {
    voicePrompt: {
      question: 'A hill I will happily die on',
      duration: '0:13',
      transcript:
        '“Thirty-five millimeter grain beats digital perfection every single time, meet me ten minutes before trailers so we get third-row center.”',
      subtextTell: 'Earnest film-school enthusiasm, wears his heart right on his sleeve.',
    },
    fridayStoryHook:
      'If you match: Holds two prime revival-house seats and nervously asks your ruthless verdict on his rough cut afterward.',
  },
  jin: {
    voicePrompt: {
      question: 'After the curtain drops at ten',
      duration: '0:11',
      transcript:
        '“Cello goes in the backseat, black tie comes undone, and we go straight to the one midnight noodle counter that still simmers broth twelve hours.”',
      subtextTell: 'Quiet conservatory poise with a surprisingly dry late-night wit.',
    },
    fridayStoryHook:
      'If you match: Sneaks you past the stage door after final bow for midnight broth and zero small talk.',
  },
  liam: {
    voicePrompt: {
      question: 'Best perk of my 48-hour shift schedule',
      duration: '0:13',
      transcript:
        '“When I’m off duty Tuesday morning, the whole coast is empty, hop in the truck and I’ll cook breakfast burritos after dawn surf.”',
      subtextTell: 'Steady station-house calm, shows up when he says he will.',
    },
    fridayStoryHook:
      'If you match: Trades turnout gear for a coastal sunset overlook nobody else in Sunset Hills knows about.',
  },
  summer: {
    voicePrompt: {
      question: 'How to win me over before drinks arrive',
      duration: '0:12',
      transcript:
        '“Pick the spot without making me project-manage Tuesday, laugh when things go slightly off-script, and never flinch at a woman with a bigger studio calendar.”',
      subtextTell: 'Bright creative-director warmth, allergic to passive “idk wherever u want” texts.',
    },
    fridayStoryHook:
      'If you match: Invites you to a rooftop wrap toast where her art-world friends immediately test your composure.',
  },
  sienna: {
    voicePrompt: {
      question: 'Fair warning before you match me',
      duration: '0:13',
      transcript:
        '“I run negotiations all day, so when a man shows up on time with an actual reservation and zero ego games, my guard drops fast.”',
      subtextTell: 'Direct courtroom-grade clarity paired with genuine warmth once you lead cleanly.',
    },
    fridayStoryHook:
      'If you match: Gives you forty-five minutes between wine tastings to prove your banter holds up offline.',
  },
  elena: {
    voicePrompt: {
      question: 'Office hours are officially closed when',
      duration: '0:14',
      transcript:
        '“Friday hits five o’clock, the red grading pen stays in my satchel, and someone brave enough to skip academic flattery asks me to sushi.”',
      subtextTell: 'Warm seminar-leader voice, spots hollow flattery in three seconds flat.',
    },
    fridayStoryHook:
      'If you match: Leaves faculty politics behind at Hawthorne Gate, if you can hold your own across a candlelit omakase counter.',
  },
  claire: {
    voicePrompt: {
      question: 'What twenty-four hours of freedom looks like',
      duration: '0:13',
      transcript:
        '“Board deck signed, out-of-office on, and one bold dinner invitation from someone who doesn’t treat my title like an interview panel.”',
      subtextTell: 'Crisp M&A precision, craves playfulness, not a LinkedIn pitch.',
    },
    fridayStoryHook:
      'If you match: Trades the executive lounge for a tucked-away jazz banquette where status games stay at the door.',
  },
  priya: {
    voicePrompt: {
      question: 'Post-night-shift decompression rule',
      duration: '0:12',
      transcript:
        '“Feed me real street tacos, tell me one funny story from outside the hospital, and don’t ask me to diagnose your roommate’s sprained ankle.”',
      subtextTell: 'Quick, grounded ER humor, values emotional steadiness over flash.',
    },
    fridayStoryHook:
      'If you match: Meets you after a twelve-hour trauma shift where sincerity beats smooth lines every time.',
  },
  vanessa: {
    voicePrompt: {
      question: 'Why spontaneity is everything to me',
      duration: '0:14',
      transcript:
        '“Montecito charity galas get exhausting. I just want discreet Thursday afternoon champagne at a hotel bar where nobody knows our last names.”',
      subtextTell: 'Purring luxury cadence, notice how weekends and her own neighborhood are mysteriously off-limits.',
    },
    fridayStoryHook:
      'If you match: Orders vintage Bollinger in a shadowy corner banquette, until her phone lights up with an estate security alert.',
  },
  brooke: {
    voicePrompt: {
      question: 'Energy check before we grab matcha',
      duration: '0:13',
      transcript:
        '“Hold that grin right there, wait, turn ten degrees toward the ring light! Sorry babe, my followers eat up spontaneous older-woman younger-guy content.”',
      subtextTell: 'You can literally hear a tripod clicking into place mid-sentence.',
    },
    fridayStoryHook:
      'If you match: Turns a simple coffee date into an unannounced three-camera livestream audition.',
  },
  celeste: {
    voicePrompt: {
      question: 'What thirty years in cinema taught me',
      duration: '0:14',
      transcript:
        '“Chemistry shows up in the first ninety seconds over martinis, either you know how to hold a woman’s gaze across a table, or the credits roll early.”',
      subtextTell: 'Silver-screen poise and zero patience for rehearsal.',
    },
    fridayStoryHook:
      'If you match: Sweeps into The Marlow Lounge twenty minutes before a private screening and dares you to keep pace.',
  },
  astrid: {
    voicePrompt: {
      question: 'Morning ritual I won’t compromise on',
      duration: '0:12',
      transcript:
        '“Cold plunge at sunrise, cedar sauna breathwork right after, and a man whose nervous system isn’t permanently wired to push notifications.”',
      subtextTell: 'Serene, hypnotic cadence, will 100% read your posture within five seconds.',
    },
    fridayStoryHook:
      'If you match: Invites you to her coastal studio terrace to test whether your calm matches your opener.',
  },
  camila: {
    voicePrompt: {
      question: 'Fastest way into my good graces',
      duration: '0:12',
      transcript:
        '“Walk into the gallery without pretending you read the press release, tell me which canvas actually moves you, and pour the mezcal neat.”',
      subtextTell: 'Warm, incisive curator energy, loves bold honesty over art-school jargon.',
    },
    fridayStoryHook:
      'If you match: Locks the gallery doors after closing toast and pours smoky mezcal in the back office.',
  },
  vivienne: {
    voicePrompt: {
      question: 'Three words you must never say at dinner',
      duration: '0:13',
      transcript:
        '“Book the corner banquette at eight, order the Burgundy without flinching, and never utter the words ‘for your age’ unless you enjoy dining solo.”',
      subtextTell: 'Effortless Left Bank wit, equal parts intimidating and magnetic.',
    },
    fridayStoryHook:
      'If you match: Takes you to a midnight 35mm French New Wave screening and grades your third-act take over steak frites.',
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
