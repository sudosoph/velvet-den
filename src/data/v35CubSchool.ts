import type { PortraitExpression } from './v35AssetManifest';

export interface CubSchoolDrill {
  id: string;
  moduleNumber: number;
  topicTag: string;
  sceneImage: string;
  punchyQuestion: string;
  title: string;
  redditComplaintQuote: string;
  scenarioSetup: string;
  rookieCrime: string;
  options: [
    {
      label: string;
      isGoldStar: boolean;
      headmistressVerdict: string;
      expression: PortraitExpression;
    },
    {
      label: string;
      isGoldStar: boolean;
      headmistressVerdict: string;
      expression: PortraitExpression;
    },
    {
      label: string;
      isGoldStar: boolean;
      headmistressVerdict: string;
      expression: PortraitExpression;
    },
  ];
  fixItAffiliateId?: string;
}

export const V35_CUB_SCHOOL_DRILLS: CubSchoolDrill[] = [
  {
    id: 'drill-01-bathroom-lid-towel',
    moduleNumber: 1,
    topicTag: '🧴 Bathroom Check',
    sceneImage: './images/scenes/cozy-rain-suite.jpg',
    punchyQuestion: 'She comes up for a nightcap and heads to your bathroom. What does she find?',
    title: 'The Bathroom Lid & Fresh Hand-Towel Inspection',
    redditComplaintQuote:
      '"Why invite a grown woman over when your bathroom has an open wire bin, zero hand towel, and one 3-in-1 bottle?"',
    scenarioSetup:
      'Date #3 went brilliantly and she agrees to come up to your apartment for a nightcap. In ten minutes she will excuse herself to use your bathroom.',
    rookieCrime:
      'Leaving an unlined plastic wastebasket next to the sink, a damp bath towel from Tuesday on the hook, and zero hand soap.',
    options: [
      {
        label: 'Lined step bin with a lid, liquid hand soap, and fresh white hand towels.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Thirty seconds of adult prep makes every woman over 35 exhale with relief.',
        expression: 'laugh',
      },
      {
        label: 'Panic-spray body mist in the hallway and pray she skips washing her hands.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Aerosol panic smells like a sophomore dorm hallway and fools nobody.',
        expression: 'icked',
      },
      {
        label: 'Hand her a roll of kitchen paper towels and call it "minimalist living."',
        isGoldStar: false,
        headmistressVerdict:
          'Immediate expulsion. Paper towels are for bacon grease, not your date.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'hosting-lidded-bin-soap',
  },
  {
    id: 'drill-02-flat-pillow-mattress',
    moduleNumber: 2,
    topicTag: '🛏️ Sleepover Setup',
    sceneImage: './images/scenes/luxury-bedroom-sanctuary.jpg',
    punchyQuestion: 'She decides to stay the night after cocktails. What is your bed setup?',
    title: 'The Single Flat Pillow & Escaping Sheet Crime',
    redditComplaintQuote:
      '"I have crisp linen at home. I cannot wake up on one pancake pillow with a microfiber sheet popping off."',
    scenarioSetup:
      'She decides to stay the night after midnight cocktails. You pull back the duvet in your bedroom.',
    rookieCrime:
      'Offering a grown woman half of one flat college pillow on heat-trapping synthetic sheets with no headboard.',
    options: [
      {
        label: 'Toss a suede couch cushion onto her side and say body heat builds character.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Couch suede against evening skincare is a felony in forty-eight states.',
        expression: 'icked',
      },
      {
        label: 'Four real pillows in breathable cotton cases, headboard, and a spare charger.',
        isGoldStar: true,
        headmistressVerdict:
          'Top of the class. You do not need a penthouse, just clean cotton and hospitality.',
        expression: 'blush',
      },
      {
        label: 'Bare mattress on the floor because you are "still curating the aesthetic."',
        isGoldStar: false,
        headmistressVerdict:
          'She already ordered a ride home before your sentence finished.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'percale-hosting-sheets',
  },
  {
    id: 'drill-03-midnight-snap-wyd',
    moduleNumber: 3,
    topicTag: '📱 First Message',
    sceneImage: './images/scenes/wine-bar-booth.jpg',
    punchyQuestion: 'You match with a witty 43-year-old creative director at 11:45 PM. Your opener?',
    title: '"U Have Snap? WYLL?" at 11:48 PM',
    redditComplaintQuote:
      '"Nothing dries up interest faster than matching and immediately reading: u have snap?? wyd rn"',
    scenarioSetup:
      'You match on Thursday night with an effortlessly witty 43-year-old creative director. Your thumbs hover over the keyboard.',
    rookieCrime:
      'Asking an accomplished woman in her forties for disappearing-photo streaks or sending three-letter low-effort pings.',
    options: [
      {
        label: 'Write a witty full sentence on her prompt and suggest Thursday 7:30 cocktails.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Punctuation and a real plan put you ahead of 90% of her queue.',
        expression: 'smirk',
      },
      {
        label: 'Ask "u have snap?? easier to talk there 👀" and send a ceiling selfie.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Past thirty-two, vanishing-photo apps scream teenager or secret girlfriend.',
        expression: 'icked',
      },
      {
        label: 'Send "wyd" at 11:48 PM followed by "??" twelve minutes later while she sleeps.',
        isGoldStar: false,
        headmistressVerdict:
          'She has an 8:30 AM briefing and unmatched you over morning espresso.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'after-dark-couples-deck',
  },
  {
    id: 'drill-04-zero-date-planning',
    moduleNumber: 4,
    topicTag: '🍸 Friday Logistics',
    sceneImage: './images/scenes/candlelit-cocktails.jpg',
    punchyQuestion: 'She says she is free Friday after 7 PM. How do you lock in Date #1?',
    title: '"Idk, What Do U Wanna Do?" (Mental-Load Dumping)',
    redditComplaintQuote:
      '"I make two hundred decisions at work, please do not make me pick the neighborhood, cuisine, and time."',
    scenarioSetup:
      'She says she is free Friday evening after 7 PM. It is your turn to lock in Date #1.',
    rookieCrime:
      'Handing her an unscheduled homework assignment disguised as being "easygoing."',
    options: [
      {
        label: '"Down for whatever tbh! What side of town and what food are you craving?"',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Making her play unpaid concierge kills the spark before Friday.',
        expression: 'icked',
      },
      {
        label: 'Offer two great spots near her side of town with a 7:30 table held, pick A or B.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Taking Friday logistics off her plate is pure romantic oxygen.',
        expression: 'laugh',
      },
      {
        label: 'Meet outside a loud walk-in bar with a 90-minute line and "just wing it."',
        isGoldStar: false,
        headmistressVerdict:
          'Standing on cold pavement in heels next to college jerseys is an automatic last date.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'espresso-martini-barware',
  },
  {
    id: 'drill-05-mute-video-sprint',
    moduleNumber: 5,
    topicTag: '🔥 Chemistry Pace',
    sceneImage: './images/scenes/hotel-pool-sauna.jpg',
    punchyQuestion: 'Things heat up back at her place for the first time. What is your pace?',
    title: '2x-Speed Clip Choreography vs. Real Presence',
    redditComplaintQuote:
      '"Why skip ten minutes of actual kissing to attempt frantic acrobatics they clearly watched on mute?"',
    scenarioSetup:
      'Things heat up for the first time back at her place. You want the night to be unforgettable.',
    rookieCrime:
      'Treating intimacy like a timed obstacle course instead of tuning in to the actual woman in your arms.',
    options: [
      {
        label: 'Slow way down, stay locked in on her cues, and ask warmly what she loves.',
        isGoldStar: true,
        headmistressVerdict:
          'Honors Distinction. Unhurried presence and curiosity beat performative bravado every night.',
        expression: 'blush',
      },
      {
        label: 'Sprint straight past foreplay and ask every minute if you broke a record.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Nobody wants an Olympic scoreboard in the bedroom.',
        expression: 'icked',
      },
      {
        label: 'Brag for twenty minutes beforehand about your "twenty-four-year-old stamina."',
        isGoldStar: false,
        headmistressVerdict:
          'Men who actually deliver never need a movie trailer beforehand.',
        expression: 'smirk',
      },
    ],
    fixItAffiliateId: 'cooling-bamboo-sheets',
  },
  {
    id: 'drill-06-teach-me-professor',
    moduleNumber: 6,
    topicTag: '🥂 Peer Energy',
    sceneImage: './images/scenes/cougarmarket-wine.jpg',
    punchyQuestion: 'Over first-date wine, she asks what made you swipe right. What do you say?',
    title: 'The "Teach Me Everything" Unpaid Instructor Pitch',
    redditComplaintQuote:
      '"I want a playful lover and equal, not an audition to be somebody\'s unpaid life coach."',
    scenarioSetup:
      'Over first-date wine, she asks what drew you to swipe right on her.',
    rookieCrime:
      'Casting her as a mystical mentor obligated to train you instead of showing up as an engaged adult peer.',
    options: [
      {
        label: 'Give puppy eyes: "Older women know so much, hoping you can teach me everything."',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. She clocked out of managing interns at 5:30 PM.',
        expression: 'icked',
      },
      {
        label: 'Say her dry humor and travel stories hooked you, and you love matching wits.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Seeing her as a magnetic woman, not a curriculum, sparks real chemistry.',
        expression: 'blush',
      },
      {
        label: 'Bash women your own age for ten minutes straight so she feels "chosen."',
        isGoldStar: false,
        headmistressVerdict:
          'Putting down twenty-four-year-old women is never the compliment men think it is.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'part-of-your-world-book',
  },
  {
    id: 'drill-07-youth-charitable-donation',
    moduleNumber: 7,
    topicTag: '💈 Zero Ego',
    sceneImage: './images/scenes/palm-springs-resort.jpg',
    punchyQuestion: 'You’re fit, 25, and across from a stunning 46-year-old architect. Your vibe?',
    title: 'Treating Your Birth Year Like a Charitable Donation',
    redditComplaintQuote:
      '"Some 23-year-old with abs acts like showing up is community service, youth is a timestamp, not a personality."',
    scenarioSetup:
      'You are fit, twenty-five, and getting plenty of attention. You sit down across from a stunning 46-year-old architect.',
    rookieCrime:
      'Assuming being younger gives you leverage to coast on charm, show up late, or fish for praise.',
    options: [
      {
        label: 'Smirk: "Bet guys your age at the club don\'t still have a six-pack like this."',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Arrogance ages faster than milk in August.',
        expression: 'icked',
      },
      {
        label: 'Arrive five minutes early in pressed linen, ask sharp questions, zero ego.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Fitness gets you noticed; manners and substance get you invited back.',
        expression: 'laugh',
      },
      {
        label: 'Check your reflection in the wine glass and brag about your Hinge queue.',
        isGoldStar: false,
        headmistressVerdict:
          'She flags the bartender for the check while you admire your jawline.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'cub-grooming-beard-skincare-kit',
  },
  {
    id: 'drill-08-sugar-mama-myth',
    moduleNumber: 8,
    topicTag: '🍳 Pride & Effort',
    sceneImage: './images/scenes/sunday-kitchen-sanctuary.jpg',
    punchyQuestion: 'She owns a coastal townhouse; you’re on a starter salary. How do you plan Date #2?',
    title: 'The Algorithm "Sugar-Mama" Rent-Sigh Delusion',
    redditComplaintQuote:
      '"TikTok convinced broke guys that every 44-year-old woman is waiting to buy them a console and cover rent."',
    scenarioSetup:
      'You earn an entry-level salary while she owns a coastal townhouse. You are planning Date #2.',
    rookieCrime:
      'Dropping hints about tight bills or joking that she should "put you on payroll."',
    options: [
      {
        label: 'Plan a great neighborhood bistro or sunset picnic in your budget and host proudly.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Self-made women never ask you to match their net worth, only their effort.',
        expression: 'blush',
      },
      {
        label: 'Sigh at the bill and joke: "Thought successful women loved spoiling cubs!"',
        isGoldStar: false,
        headmistressVerdict:
          'Immediate block before your car leaves the valet lane.',
        expression: 'icked',
      },
      {
        label: 'Text her an expensive headphones link before your birthday "just in case."',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Auditioning to be an adult dependent ends the romance instantly.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'trophy-boyfriend-cooking-apron',
  },
  {
    id: 'drill-09-board-meeting-pout',
    moduleNumber: 9,
    topicTag: '💼 Workday Chill',
    sceneImage: './images/scenes/campus-autumn-sushi.jpg',
    punchyQuestion: 'You texted at 11:30 AM Tuesday and she hasn’t replied by 2:15 PM. Your move?',
    title: 'The Tuesday 2:15 PM Board-Meeting Double-Text Pout',
    redditComplaintQuote:
      '"Came out of a three-hour client mediation to: guess ur too busy for me now 😔. Instant ick."',
    scenarioSetup:
      'You texted her a funny photo at 11:30 AM Tuesday. At 2:15 PM she still has not replied.',
    rookieCrime:
      'Spiral-texting passive-aggressive guilt trips during standard business hours.',
    options: [
      {
        label: 'Text "guess I\'ll stop bothering u then 😔" so she rushes to reassure you.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Middle-school guilt trips during her workday guarantee no Friday date.',
        expression: 'icked',
      },
      {
        label: 'Put your phone down, crush your own afternoon, and reply warmly at 6 PM.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Emotional self-regulation is the sexiest flex a younger man owns.',
        expression: 'smirk',
      },
      {
        label: 'Send "???" and rewatch every one of her Instagram stories twice.',
        isGoldStar: false,
        headmistressVerdict:
          'Surveillance energy gets muted before happy hour.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'good-boy-brass-training-clicker',
  },
  {
    id: 'drill-10-sidewalk-hand-drop',
    moduleNumber: 10,
    topicTag: '🤝 Public Pride',
    sceneImage: './images/scenes/coastal-convertible.jpg',
    punchyQuestion: 'Walking hand-in-hand after dinner, loud guys your age pass by. What do you do?',
    title: 'The Public Sidewalk Hand-Drop Test',
    redditComplaintQuote:
      '"All over me in private, then walks three feet ahead like my nephew when guys his age walk past."',
    scenarioSetup:
      'Walking out of dinner hand-in-hand, a loud group of twenty-four-year-old guys steps onto the sidewalk toward you both.',
    rookieCrime:
      'Flinching or letting go of her hand in public the moment peers look over.',
    options: [
      {
        label: 'Keep holding her hand warmly, take the street side, and finish your story.',
        isGoldStar: true,
        headmistressVerdict:
          'Honors Distinction. Unshakeable public pride makes a woman ten times more smitten.',
        expression: 'blush',
      },
      {
        label: 'Drop her hand into your pocket until they pass, then reach back at the corner.',
        isGoldStar: false,
        headmistressVerdict:
          'Trust us: she noticed in 0.2 seconds, and she will never forget it.',
        expression: 'icked',
      },
      {
        label: 'Glare aggressively at the strangers and announce both your ages out loud.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. True confidence whispers; insecurity heckles.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'short-leash-leather-dog-leash',
  },
  {
    id: 'drill-11-sti-panel-ego',
    moduleNumber: 11,
    topicTag: '🩺 Grown-Up Trust',
    sceneImage: './images/scenes/canyon-sunrise-trail.jpg',
    punchyQuestion: 'Before going exclusive, she suggests swapping fresh STI results. How do you react?',
    title: 'The Calm Health-Check & STI-Panel Ego Test',
    redditComplaintQuote:
      '"Asked calmly to swap recent lab results before going exclusive and he acted like I insulted his honor."',
    scenarioSetup:
      'Chemistry is electric on Date #3, and she warmly suggests swapping fresh MyChart screening results before next weekend.',
    rookieCrime:
      'Taking grown-up sexual health hygiene personally or trying to talk her out of boundaries.',
    options: [
      {
        label: 'Get defensive: "Wait, do I look sketchy or do you not trust me?"',
        isGoldStar: false,
        headmistressVerdict:
          'Immediate expulsion. Getting offended by routine health care proves you are not ready.',
        expression: 'icked',
      },
      {
        label: 'Thank her warmly, book a next-day lab draw, and share clean results Thursday.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Zero ego plus fast follow-through unlocks complete trust.',
        expression: 'laugh',
      },
      {
        label: 'Mumble "yeah I got checked like two years ago I think" and change the subject.',
        isGoldStar: false,
        headmistressVerdict:
          'Vague guesswork from two years ago does not pass inspection.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'date-night-oud-bergamot',
  },
  {
    id: 'drill-12-search-bar-labels',
    moduleNumber: 12,
    topicTag: '🖼️ Gallery Opener',
    sceneImage: './images/scenes/velvet-room-bar.jpg',
    punchyQuestion: 'You spot an intriguing woman at a gallery cocktail bar. How do you say hello?',
    title: 'Opening With Browser-Tab Fetish Labels',
    redditComplaintQuote:
      '"If your first sentence has hey cougar, hey milf, or bucket list, you are talking to a search tab."',
    scenarioSetup:
      'You spot an intriguing woman at a gallery bar or on your Hinge Standouts feed and walk up to say hello.',
    rookieCrime:
      'Leading with pornographic or novelty age-category labels instead of treating her like an attractive woman.',
    options: [
      {
        label: 'Wink and say: "Always wanted to cross a gorgeous cougar off my bucket list."',
        isGoldStar: false,
        headmistressVerdict:
          'Permanent ban from the lounge. Nobody wants to be your novelty merit badge.',
        expression: 'icked',
      },
      {
        label: 'Comment naturally on the piece in front of you both, make her laugh, ask her name.',
        isGoldStar: true,
        headmistressVerdict:
          'Summa Cum Laude. Treat her like a fascinating woman first and let chemistry speak.',
        expression: 'blush',
      },
      {
        label: 'Open by guessing her exact age out loud to prove how perceptive you are.',
        isGoldStar: false,
        headmistressVerdict:
          'Carnival weight-guesser energy never earned a second drink.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'fill-in-love-coupon-cards',
  },
];
