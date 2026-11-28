import type { PortraitExpression } from './v35AssetManifest';

export type CubSchoolLevel = 1 | 2 | 3;

export interface CubSchoolDrill {
  id: string;
  moduleNumber: number;
  level?: CubSchoolLevel;
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
    id: 'drill-03-mapquest-archaeology-foul',
    moduleNumber: 3,
    topicTag: '🗺️ Era Banter',
    sceneImage: './images/scenes/wine-bar-booth.jpg',
    punchyQuestion: 'She laughs about printing directions before smartphones. What do you say?',
    title: 'Surviving Pre-Smartphone Lore Without Sounding Like a Museum Tour',
    redditComplaintQuote:
      '"Mentioned printing highway exits in 2004 and he gasped like I rode a covered wagon across Oregon."',
    scenarioSetup:
      'Over patio wine, your 44-year-old date jokes about navigating road trips with stapled paper pages.',
    rookieCrime:
      'Treating the early 2000s like ancient Mesopotamia and making her feel like a history exhibit.',
    options: [
      {
        label: 'Tease warmly: "Iconic skill, without GPS I would still be circling the parking garage."',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Self-deprecating charm keeps generational banter playful and flirty.',
        expression: 'smirk',
      },
      {
        label: 'Gasp loudly: "Whoa, paper scrolls?! My grandma told me about those in third grade!"',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Comparing your hot date to your grandmother revokes dessert immediately.',
        expression: 'icked',
      },
      {
        label: 'Launch a twelve-minute lecture explaining how GPS satellites orbit the Earth.',
        isGoldStar: false,
        headmistressVerdict:
          'She already knows how satellites work, professor. Check please.',
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
    id: 'drill-06-waiter-son-brunch-save',
    moduleNumber: 6,
    level: 2,
    topicTag: '🥂 Waiter Blunder',
    sceneImage: './images/scenes/cougarmarket-wine.jpg',
    punchyQuestion: 'At brunch the waiter smiles at her and asks: "And coffee for your son?" Your move?',
    title: 'Turning the Classic Waiter "Son" Blunder Into Instant Chemistry',
    redditComplaintQuote:
      '"Waiter asked if I was her son; I squeezed her hand over the table and said Definitely not related, bring us two mimosas. She melted."',
    scenarioSetup:
      'Sunday patio brunch is going great until an oblivious twenty-year-old server assumes you two are mother and son.',
    rookieCrime:
      'Freezing in awkward silence, blushing into your menu, or snapping angrily at minimum-wage staff.',
    options: [
      {
        label: 'Stare silently into your napkin and pretend you really are her nephew until the check.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Shrinking in embarrassment turns a five-second mix-up into an all-day cringe.',
        expression: 'icked',
      },
      {
        label: 'Kiss the back of her hand with an easy grin: "Definitely my date, two mimosas please."',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Zero anger, zero awkwardness, 100% relaxed romantic claim.',
        expression: 'blush',
      },
      {
        label: 'Stand up and demand to speak to the restaurant manager about age assumptions.',
        isGoldStar: false,
        headmistressVerdict:
          'Making a scene ruins brunch ten times faster than the waiter ever could.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'funny-cougar-stemless-wine-glass',
  },
  {
    id: 'drill-07-rave-energy-mismatch',
    moduleNumber: 7,
    level: 2,
    topicTag: '🌙 Date Energy',
    sceneImage: './images/scenes/palm-springs-resort.jpg',
    punchyQuestion: 'You have 25-year-old boundless stamina; it is 10:15 PM Friday after dinner. Next stop?',
    title: 'Respecting the 10 PM Sanctuary Window Over Sticky-Floor Marathons',
    redditComplaintQuote:
      '"Sweet 24M tried to take me from sushi to an 11:30 PM standing-room warehouse DJ set. Baby, I needed ibuprofen just reading the flyer."',
    scenarioSetup:
      'Dinner and drinks sparked effortlessly, and you still have energy to burn after 10 PM.',
    rookieCrime:
      'Dragging an accomplished woman in heels to a deafening standing-room-only midnight club with sticky floors.',
    options: [
      {
        label: 'Surprise her with midnight wristbands to a packed standing-room EDM warehouse.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Nobody over 36 wants mystery tequila spilled on suede heels at 1 AM.',
        expression: 'icked',
      },
      {
        label: 'Offer a quiet vinyl lounge booth or a relaxed walk back for tea, wine, and zero noise.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Save your 25-year-old stamina for behind closed doors, never nightclub lines.',
        expression: 'laugh',
      },
      {
        label: 'Pitch a 5:45 AM steep canyon sprint tomorrow morning right after midnight drinks.',
        isGoldStar: false,
        headmistressVerdict:
          'She wants a weekend lover, not Marine Corps boot camp.',
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
    id: 'drill-11-sanctuary-ps5-colonizer',
    moduleNumber: 11,
    level: 3,
    topicTag: '🏡 Her Sanctuary',
    sceneImage: './images/scenes/canyon-sunrise-trail.jpg',
    punchyQuestion: 'After three dreamy weekends at her serene townhouse, what do you leave behind?',
    title: 'Respecting Her Peaceful Home Without Turning It Into a Frat Annex',
    redditComplaintQuote:
      '"I spent ten years curating a quiet, clutter-free home. Do NOT leave a giant neon whey-protein tub on my marble counter."',
    scenarioSetup:
      'You stay over on Sundays at her immaculate townhouse and she offers you a small drawer.',
    rookieCrime:
      'Colonizing her living room with tangled console wires, gym bags, and unwashed shakers.',
    options: [
      {
        label: 'Hook your console up to her living-room TV and leave controllers on the rug.',
        isGoldStar: false,
        headmistressVerdict:
          'Immediate eviction. Her peaceful living room is not a sophomore rec room.',
        expression: 'icked',
      },
      {
        label: 'Keep a spare shirt in the drawer, strip the sheets, and leave zero clutter.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Leaving her space calmer than you found it earns permanent key privileges.',
        expression: 'laugh',
      },
      {
        label: 'Line five giant plastic supplement tubs across her espresso counter.',
        isGoldStar: false,
        headmistressVerdict:
          'Nothing kills morning romance like neon blue pre-workout dust next to French press coffee.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'chic-candlelit-menu-readers',
  },
  {
    id: 'drill-12-sunday-mom-heads-up',
    moduleNumber: 12,
    topicTag: '🥂 Family Poise',
    sceneImage: './images/scenes/velvet-room-bar.jpg',
    punchyQuestion: 'Things get serious and your 43F partner meets your 49F mom Sunday. Prep?',
    title: 'The One-Week Family Briefing Protocol',
    redditComplaintQuote:
      '"He prepped his mom warmly on Tuesday so Sunday brunch felt effortless from the first hug."',
    scenarioSetup:
      'Four great months in, you invite her to Sunday brunch with your family for the first time.',
    rookieCrime:
      'Springing an unannounced doorway ambush on your parents just to see their reaction.',
    options: [
      {
        label: 'Spring a total surprise at the front door to watch everyone do mental math.',
        isGoldStar: false,
        headmistressVerdict:
          'Ambushing both women you care about is rookie sabotage.',
        expression: 'icked',
      },
      {
        label: 'Brief your mom warmly a week ahead with pride so everyone relaxes at hello.',
        isGoldStar: true,
        headmistressVerdict:
          'Summa Cum Laude. Mature leadership makes every room welcome her.',
        expression: 'blush',
      },
      {
        label: 'Ask your partner to shave six years off her age during appetizers.',
        isGoldStar: false,
        headmistressVerdict:
          'Asking a grown woman to lie about her life ends the relationship on the spot.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'fill-in-love-coupon-cards',
  },
];

export const V35_HEADMISTRESS_DRILLS: CubSchoolDrill[] = [
  {
    id: 'hm-01-first-date-bill-frame',
    moduleNumber: 1,
    topicTag: '🥂 Check Etiquette',
    sceneImage: './images/scenes/candlelit-cocktails.jpg',
    punchyQuestion:
      'Check lands; he asks: "Unless you prefer splitting since you are a VP?" Your move?',
    title: 'Holding Graceful Reciprocity Without Becoming an ATM',
    redditComplaintQuote:
      '"Start grabbing every check out of salary guilt and you accidentally adopt a dependent instead of a lover."',
    scenarioSetup:
      'He asked you out to a cozy cocktail bar and now tests whether your title means he is off the hook.',
    rookieCrime:
      'Over-functioning financially out of guilt or turning dinner into an awkward accounting audit.',
    options: [
      {
        label: 'Pay every tab yourself from Day 1 so he never feels stressed about money.',
        isGoldStar: false,
        headmistressVerdict:
          'Self-inflicted trap. Over-paying out of guilt kills polarity before Date #3.',
        expression: 'icked',
      },
      {
        label: 'Smile warmly: "You invited me tonight, so you have this one, and I have Friday."',
        isGoldStar: true,
        headmistressVerdict:
          'Crown-tier poise. You let him stand tall tonight while setting adult reciprocity.',
        expression: 'blush',
      },
      {
        label: 'Open your phone calculator and itemize every olive down to the exact cent.',
        isGoldStar: false,
        headmistressVerdict:
          'Nothing evaporates romantic tension faster than an expense audit at the table.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'good-boy-brass-training-clicker',
  },
  {
    id: 'hm-02-vintage-band-tee-audit',
    moduleNumber: 2,
    topicTag: '🎸 Band-Tee Audit',
    sceneImage: './images/scenes/cozy-rain-suite.jpg',
    punchyQuestion:
      'Your 25M date wears a 1997 Radiohead tour tee, yet knows zero tracks. How do you train?',
    title: 'Auditing Vintage Shirts Older Than His Driver’s License',
    redditComplaintQuote:
      '"He showed up in a faded 1996 tour shirt I bought at the actual stadium and thought it was a streetwear brand."',
    scenarioSetup:
      'He looks absurdly handsome across the patio, wearing a concert shirt from three years before he was born.',
    rookieCrime:
      'Launching a grumpy gatekeeper lecture or pretending not to notice the fashion prop.',
    options: [
      {
        label: 'Make him queue "OK Computer" on the drive home as homework before kiss #2.',
        isGoldStar: true,
        headmistressVerdict:
          'Playful Headmistress perfection. Turn the gap into flirtatious musical education.',
        expression: 'laugh',
      },
      {
        label: 'Scold him for twenty minutes about ticket stubs from the nineties.',
        isGoldStar: false,
        headmistressVerdict:
          'Gatekeeping like an angry record-store clerk dries up the flirtation fast.',
        expression: 'icked',
      },
      {
        label: 'Pretend Radiohead is a brand-new indie band you have never heard of either.',
        isGoldStar: false,
        headmistressVerdict:
          'Never play dumb about your own cultural canon.',
        expression: 'smirk',
      },
    ],
    fixItAffiliateId: 'after-dark-couples-deck',
  },
  {
    id: 'hm-03-babysitter-warzone-flake',
    moduleNumber: 3,
    topicTag: '🎮 Sitter Clock',
    sceneImage: './images/scenes/wine-bar-booth.jpg',
    punchyQuestion:
      'You booked an $80 sitter; at 6:40 PM he texts "in a Call of Duty match lol." Verdict?',
    title: 'Enforcing Sacred Babysitter & Prime-Time Respect',
    redditComplaintQuote:
      '"Paid a sitter twenty-five an hour and dressed to kill while he finished a video-game lobby with his roommates."',
    scenarioSetup:
      'Your heels are on and your evening window is priceless when he asks to push dinner back ninety minutes.',
    rookieCrime:
      'Sitting home dressed up waiting on a man who prioritizes a headset over a real woman.',
    options: [
      {
        label: 'Wait patiently on your sofa until 9:30 PM hoping his squad wraps up.',
        isGoldStar: false,
        headmistressVerdict:
          'Rewarding video-game tardiness teaches him your calendar is free.',
        expression: 'icked',
      },
      {
        label: 'Take yourself out for solo oysters at the bar and revoke his Friday slot.',
        isGoldStar: true,
        headmistressVerdict:
          'Ruthless grace. Never waste great lipstick or babysitter hours on a boy.',
        expression: 'smirk',
      },
      {
        label: 'Send fourteen furious voice notes yelling at him over speakerphone.',
        isGoldStar: false,
        headmistressVerdict:
          'Silence and an unbothered solo martini hit ten times harder than yelling.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'black-cat-girlfriend-leopard-mug',
  },
  {
    id: 'hm-04-girls-my-age-pickme',
    moduleNumber: 4,
    topicTag: '🚩 Flattery Check',
    sceneImage: './images/scenes/palm-springs-resort.jpg',
    punchyQuestion:
      'Over drinks he grins: "Girls my age are all crazy drama, older women are chill." Grade?',
    title: 'Checking the "No Drama = Zero Standards" Trap',
    redditComplaintQuote:
      '"When a 24-year-old says every woman his age is crazy, translation: they called out his low effort."',
    scenarioSetup:
      'He leans across the table expecting applause for bashing twenty-four-year-old women.',
    rookieCrime:
      'Mistaking "cool chill older woman" projection for genuine emotional maturity.',
    options: [
      {
        label: 'Arch a brow: "I am selective, never chill. Praise me without trashing 24-year-olds."',
        isGoldStar: true,
        headmistressVerdict:
          'Iconic correction. You defend sisterhood AND warn him your standards are sky-high.',
        expression: 'laugh',
      },
      {
        label: 'Beam proudly and promise you will never ask for effort or communication.',
        isGoldStar: false,
        headmistressVerdict:
          'Auditioning as the "zero-needs cool girl" invites terrible behavior by week three.',
        expression: 'icked',
      },
      {
        label: 'Spend the rest of dinner dissecting every detail of his college breakups.',
        isGoldStar: false,
        headmistressVerdict:
          'Keep your therapist pad closed; one calm boundary says everything.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'big-carl-giant-wine-glass',
  },
  {
    id: 'hm-05-accidental-yes-maam-slip',
    moduleNumber: 5,
    topicTag: '🤠 "Yes Ma’am" Slip',
    sceneImage: './images/scenes/hotel-pool-sauna.jpg',
    punchyQuestion:
      'You ask him to pass the wine and a polite Southern "Yes ma’am" slips out. Your move?',
    title: 'Flipping Polite Reflexes Into Flirtatious Tension',
    redditComplaintQuote:
      '"Sweet 26M Texas firefighter accidentally said Yes ma’am on Date 1, turned bright red, and recovered like a king."',
    scenarioSetup:
      'His upbringing kicked in on autopilot and he freezes mid-blush realizing what he just said.',
    rookieCrime:
      'Spiraling into age insecurity over good manners instead of owning the tension playfully.',
    options: [
      {
        label: 'Flip the breadbasket and storm out over manners his mom drilled into him.',
        isGoldStar: false,
        headmistressVerdict:
          'Overreacting to polite nerves ruins an adorable comedy beat.',
        expression: 'icked',
      },
      {
        label: 'Hold eye contact with a slow smirk: "Save that manners voice for after midnight."',
        isGoldStar: true,
        headmistressVerdict:
          'Lethal chemistry pivot. His pulse just jumped to 140 in two seconds flat.',
        expression: 'blush',
      },
      {
        label: 'Sigh loudly about feeling eighty years old for the next twenty minutes.',
        isGoldStar: false,
        headmistressVerdict:
          'Never self-deprecate your own magnetism at the dinner table.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'princess-mulberry-silk-robe',
  },
  {
    id: 'hm-06-helpless-life-coach-trap',
    moduleNumber: 6,
    level: 2,
    topicTag: '🧾 No Mom Duty',
    sceneImage: './images/scenes/cougarmarket-wine.jpg',
    punchyQuestion:
      'Your 25M match texts: "Ugh taxes & dentist calls confuse me, help me adult tonight?" Move?',
    title: 'Shutting Down Weaponized Youth Before Becoming His Unpaid Life Coach',
    redditComplaintQuote:
      '"The second you schedule his dentist or fix his resume before Date #3, the bedroom spark dies forever."',
    scenarioSetup:
      'He is cute and affectionate, yet testing whether you will step into a cozy administrative mom role.',
    rookieCrime:
      'Taking over his basic adult errands and wondering two weeks later why attraction vanished.',
    options: [
      {
        label: 'Spend two hours organizing his spreadsheets in pajamas for zero romance.',
        isGoldStar: false,
        headmistressVerdict:
          'Direct violation of Club Law: you are his hot date, never his guidance counselor.',
        expression: 'icked',
      },
      {
        label: 'Do his errands while sighing passive-aggressively about twenty-somethings.',
        isGoldStar: false,
        headmistressVerdict:
          'Martyrdom kills chemistry for both of you.',
        expression: 'icked',
      },
      {
        label: 'Reply playfully: "Handle your admin like a big boy today and reward awaits at 8 PM."',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star Headmistress move! Keep boundaries clear and reward competence with romance.',
        expression: 'smirk',
      },
    ],
    fixItAffiliateId: 'short-leash-leather-dog-leash',
  },
  {
    id: 'hm-07-kitchen-labrador-hover',
    moduleNumber: 7,
    topicTag: '🐕 Kitchen Hover',
    sceneImage: './images/scenes/sunday-kitchen-sanctuary.jpg',
    punchyQuestion:
      'Sunday morning he trails two inches behind you in the kitchen eager to help. Steer?',
    title: 'Channeling Golden-Retriever Energy Into Sous-Chef Mastery',
    redditComplaintQuote:
      '"My 27M stands right behind my elbow like an excited Labrador waiting for a job assignment."',
    scenarioSetup:
      'He stayed over and genuinely wants to be useful, though he is blocking every cabinet.',
    rookieCrime:
      'Doing all the work yourself while resenting him, or snapping at sweet enthusiasm.',
    options: [
      {
        label: 'Tie an apron on him, assign rosemary potatoes, and grade from the island with coffee.',
        isGoldStar: true,
        headmistressVerdict:
          'Peak Sanctuary leadership. Eager Cubs beam brightest with a clear mission.',
        expression: 'blush',
      },
      {
        label: 'Shoo him onto the couch and scrub every pan yourself like his mom.',
        isGoldStar: false,
        headmistressVerdict:
          'Never train an eager partner into passive couch furniture.',
        expression: 'icked',
      },
      {
        label: 'Bark instructions like a stressed line cook before your first espresso.',
        isGoldStar: false,
        headmistressVerdict:
          'Direct with warmth and a wink, never kitchen-nightmare chaos.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'houseboy-linen-apron',
  },
  {
    id: 'hm-08-usher-karate-van-foul',
    moduleNumber: 8,
    topicTag: '🎶 2004 Throwback',
    sceneImage: './images/scenes/velvet-room-bar.jpg',
    punchyQuestion:
      'Usher’s "Yeah!" drops at the bar and he beams: "Mom drove me to karate to this!" Move?',
    title: 'Turning Childhood Throwback Blunders Into Bar Tab Penalties',
    redditComplaintQuote:
      '"My 2004 club anthem came on and he fondly recalled drinking juice boxes in the backseat to it."',
    scenarioSetup:
      'He has zero idea he just placed your peak going-out era inside an elementary carpool lane.',
    rookieCrime:
      'Letting an accidental timeline blunder kill the vibe instead of taxing him playfully.',
    options: [
      {
        label: 'Fake a sudden headache and Uber home solo before the chorus finishes.',
        isGoldStar: false,
        headmistressVerdict:
          'If you date ten years younger, timeline comedy comes free with admission!',
        expression: 'icked',
      },
      {
        label: 'Tap his chest: "Penalty flag. Next round is on you, and zero minivan stories."',
        isGoldStar: true,
        headmistressVerdict:
          'Flawless Headmistress recovery. Laugh, tax the infraction, and pull him onto the floor.',
        expression: 'laugh',
      },
      {
        label: 'Spend half an hour explaining flip phones and Razr ringtones.',
        isGoldStar: false,
        headmistressVerdict:
          'Dance to the horn section instead of narrating tech history.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'espresso-martini-barware',
  },
  {
    id: 'hm-09-bucket-list-check',
    moduleNumber: 9,
    topicTag: '🎯 Tourist Check',
    sceneImage: './images/scenes/neon-bowling-lounge.jpg',
    punchyQuestion:
      'He grins on Date #2: "Dating an older woman was on my college bucket list." Your test?',
    title: 'Separating Nervous Flattery From Novelty Tourists',
    redditComplaintQuote:
      '"One raised eyebrow tells you in ten seconds whether he sees a fantasy category or sees YOU."',
    scenarioSetup:
      'He thinks he just paid you a bold compliment, unaware he stepped onto thin ice.',
    rookieCrime:
      'Accepting novelty-category status instead of testing whether he actually sees you.',
    options: [
      {
        label: 'Beam proudly at helping a stranger cross off his college bingo card.',
        isGoldStar: false,
        headmistressVerdict:
          'You are a magnetic individual, never a skydiving voucher.',
        expression: 'icked',
      },
      {
        label: 'Arch one brow: "Bucket lists are for tourists. Name two things you like about ME."',
        isGoldStar: true,
        headmistressVerdict:
          'Laser-guided test. Real admirers name your wit and laugh; tourists fumble fast.',
        expression: 'smirk',
      },
      {
        label: 'Toss your drink across the table and storm out in silence.',
        isGoldStar: false,
        headmistressVerdict:
          'Save good gin; one calm eyebrow arch makes him sweat ten times harder.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'no-hard-feelings-jlaw-prime',
  },
  {
    id: 'hm-10-high-school-classmate-run-in',
    moduleNumber: 10,
    level: 3,
    topicTag: '🥂 Classmate Run-In',
    sceneImage: './images/scenes/wedding-gala-cheers.jpg',
    punchyQuestion:
      'Someone from your 1999 graduating class spots you holding your 26M date’s hand and stares. Move?',
    title: 'Owning the Hometown Run-In With Unbothered Main-Character Glow',
    redditComplaintQuote:
      '"Ran into my ex’s nosy sister at the wine bar while my 27M pulled out my chair; watching her jaw drop added five years to my life."',
    scenarioSetup:
      'An old acquaintance walks up fishing for gossip: "Oh! And who is your young friend?"',
    rookieCrime:
      'Fumbling an awkward excuse or acting sheepish when you are two consenting adults having a blast.',
    options: [
      {
        label: 'Mumble that he is your real-estate intern and drop his hand.',
        isGoldStar: false,
        headmistressVerdict:
          'Never hide a great man to appease nosy onlookers.',
        expression: 'icked',
      },
      {
        label: 'Over-explain your entire dating philosophy for ten defensive minutes.',
        isGoldStar: false,
        headmistressVerdict:
          'Confidence never writes a permission slip.',
        expression: 'icked',
      },
      {
        label: 'Introduce him warmly by name with a radiant smile, toast once, and return to your booth.',
        isGoldStar: true,
        headmistressVerdict:
          'Iconic poise. He feels ten feet tall beside you, and your classmate leaves dazzled.',
        expression: 'smirk',
      },
    ],
    fixItAffiliateId: 'date-night-oud-bergamot',
  },
  {
    id: 'hm-11-bedroom-pace-direction',
    moduleNumber: 11,
    topicTag: '🔥 Setting Pace',
    sceneImage: './images/scenes/canyon-sunrise-trail.jpg',
    punchyQuestion:
      'First night at your place: he is wildly eager yet rushing at double speed. Your move?',
    title: 'Directing Eager Stamina Into Slow-Burn Mastery',
    redditComplaintQuote:
      '"Younger men are thrilled to learn what you love when you guide them warmly in the moment."',
    scenarioSetup:
      'Chemistry is electric, though first-night nerves have him moving like a timed sprint.',
    rookieCrime:
      'Faking satisfaction to spare his ego or turning intimacy into a cold post-mortem.',
    options: [
      {
        label: 'Fake a finish in four minutes to protect his ego and stare at the ceiling.',
        isGoldStar: false,
        headmistressVerdict:
          'Counterfeit praise locks in terrible habits forever.',
        expression: 'icked',
      },
      {
        label: 'Catch his wrists with a slow smile, slow his breathing, and whisper what feels best.',
        isGoldStar: true,
        headmistressVerdict:
          'Signature Cougar superpower. Warm direction turns eager energy into unforgettable chemistry.',
        expression: 'blush',
      },
      {
        label: 'Halt everything for a harsh lecture comparing him to your ex-husband.',
        isGoldStar: false,
        headmistressVerdict:
          'Guide with heat in the moment, never a boardroom review.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'cooling-bamboo-sheets',
  },
  {
    id: 'hm-12-praising-graduated-cub',
    moduleNumber: 12,
    topicTag: '👑 Good-Boy Seal',
    sceneImage: './images/scenes/coastal-convertible.jpg',
    punchyQuestion:
      'He upgraded his sheets, booked 7:30 Friday, and held your hand proudly all night. Move?',
    title: 'Reinforcing Real Effort With Unmistakable Warmth',
    redditComplaintQuote:
      '"Tell a devoted younger man Good boy when he nails Friday logistics and he will move mountains."',
    scenarioSetup:
      'He took every note seriously, showed up five minutes early, and made your whole week lighter.',
    rookieCrime:
      'Withholding appreciation to play cool when a genuinely coachable partner steps up.',
    options: [
      {
        label: 'Touch his jaw warmly: "Good boy, you actually pay attention," and reward his effort.',
        isGoldStar: true,
        headmistressVerdict:
          'Highest Headmistress Distinction! Clear standards + generous praise = unstoppable devotion.',
        expression: 'blush',
      },
      {
        label: 'Invent three brand-new complaints so he never gets comfortable.',
        isGoldStar: false,
        headmistressVerdict:
          'Moving goalposts exhausts the exact men worth keeping.',
        expression: 'icked',
      },
      {
        label: 'Act icy and unimpressed so he keeps chasing approval.',
        isGoldStar: false,
        headmistressVerdict:
          'Games are for twenty-two-year-olds; grown queens reward real devotion.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'velvet-travel-weekender-duffel',
  },
];
