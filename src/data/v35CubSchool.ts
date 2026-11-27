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
    id: 'drill-06-overhead-big-light-crime',
    moduleNumber: 6,
    topicTag: '💡 Mood Lighting',
    sceneImage: './images/scenes/cougarmarket-wine.jpg',
    punchyQuestion: 'She steps into your living room at 9:30 PM for wine. How is the room lit?',
    title: 'Banishing Surgical Ceiling Bulbs After Sunset',
    redditComplaintQuote:
      '"Walked into his apartment feeling glamorous and he flipped on an overhead bulb brighter than CVS."',
    scenarioSetup:
      'Dinner sparked effortlessly and she comes up to your place for one glass of red and vinyl.',
    rookieCrime:
      'Blasting harsh 5000K overhead ceiling glare instead of warm corner lamps.',
    options: [
      {
        label: 'Flip on the overhead ceiling fixture so the room glows like a dental clinic.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Overhead fluorescent glare after 8 PM is an instant romance felony.',
        expression: 'icked',
      },
      {
        label: 'Warm table lamps dimmed low, candle lit on the counter, overhead switch off.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Twenty-dollar warm bulbs make any apartment feel like a boutique lounge.',
        expression: 'blush',
      },
      {
        label: 'Pitch-black room lit solely by a paused video-game menu flashing on your TV.',
        isGoldStar: false,
        headmistressVerdict:
          'Dorm-cave lighting belongs in freshman year, not date night.',
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
    id: 'drill-11-dim-bistro-menu-tact',
    moduleNumber: 11,
    topicTag: '🕯️ Bistro Tact',
    sceneImage: './images/scenes/canyon-sunrise-trail.jpg',
    punchyQuestion: 'In a dark candlelit bistro, she squints at tiny italic print. Your move?',
    title: 'Handling Moody Restaurant Menus With Zero Weirdness',
    redditComplaintQuote:
      '"Trendy bars print menus in six-point grey ink; he quietly slid the candle closer and won my heart."',
    scenarioSetup:
      'The cocktail lounge is romantic and dim, and the wine card was printed in microscopic font.',
    rookieCrime:
      'Cracking a loud joke about reading glasses or blinding the whole room with your phone strobe.',
    options: [
      {
        label: 'Joke loudly about needing bifocals and wave the waiter for a large-print menu.',
        isGoldStar: false,
        headmistressVerdict:
          'Immediate expulsion. Roasting your date across the booth guarantees solo dessert.',
        expression: 'icked',
      },
      {
        label: 'Slide the table candle closer smoothly and suggest the two best dishes aloud.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Subtle, observant chivalry without making a production of it.',
        expression: 'laugh',
      },
      {
        label: 'Turn your phone flashlight to 100% brightness and shine it straight at her face.',
        isGoldStar: false,
        headmistressVerdict:
          'Interrogation-lamp tactics ruin candlelight in half a second.',
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
          'Keep your therapist pad closed; one sharp sentence sets the frame.',
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
    id: 'hm-06-sugar-mama-fishing',
    moduleNumber: 6,
    topicTag: '🚩 Moocher Vetting',
    sceneImage: './images/scenes/cougarmarket-wine.jpg',
    punchyQuestion:
      'On Date #2, a 24M date jokes: "Maybe an exec like you can sponsor my Cabo trip." Verdict?',
    title: 'Spotting the Disguised Purse-Moocher Early',
    redditComplaintQuote:
      '"Every hobosexual floats a joke on Date #2 to test if your wallet is open."',
    scenarioSetup:
      'He flashes a dimpled grin across the wine bar right after mentioning his rent went up.',
    rookieCrime:
      'Laughing past financial fishing hooks until you find yourself subsidizing a grown adult.',
    options: [
      {
        label: 'Offer to put his ticket on your airline miles so you seem generous.',
        isGoldStar: false,
        headmistressVerdict:
          'Direct violation of Club Rule #1: accomplished women are partners, never ATMs.',
        expression: 'icked',
      },
      {
        label: 'Pretend you missed the comment and hope the mooching jokes stop later.',
        isGoldStar: false,
        headmistressVerdict:
          'Trial balloons always turn into real requests if you smile past them.',
        expression: 'icked',
      },
      {
        label: 'Hold his gaze dryly: "Cute try. I spoil partners with company, never allowances."',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star vetting. A real peer laughs with respect; a moocher sours in five minutes.',
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
    id: 'hm-10-neon-body-wash-upgrade',
    moduleNumber: 10,
    topicTag: '🧴 Scent Upgrade',
    sceneImage: './images/scenes/wedding-gala-cheers.jpg',
    punchyQuestion:
      'His shower holds a giant jug of neon "Sport Blast" wash before weekend #2. Upgrade move?',
    title: 'The Art of Ethical Scent & Grooming Upgrades',
    redditComplaintQuote:
      '"Gifted him cedar-bergamot wash once with a compliment; he smelled like a boutique hotel by Friday."',
    scenarioSetup:
      'Everything else about him is dreamy, except soap engineered to smell like blue Gatorade.',
    rookieCrime:
      'Roasting him mercilessly or enduring chemical body spray against silk sheets.',
    options: [
      {
        label: 'Roast his shower shelf to your group chat while saying nothing to him.',
        isGoldStar: false,
        headmistressVerdict:
          'Good Cubs cannot fix blind spots nobody mentions.',
        expression: 'icked',
      },
      {
        label: 'Deliver a stern thirty-minute lecture on parabens before coffee.',
        isGoldStar: false,
        headmistressVerdict:
          'Positive reinforcement beats nagging one hundred times out of one hundred.',
        expression: 'icked',
      },
      {
        label: 'Drop cedarwood wash by his sink with a wink: "Wear this Friday and don’t make plans."',
        isGoldStar: true,
        headmistressVerdict:
          'Unstoppable positive reinforcement. That neon bottle hits the trash inside sixty seconds.',
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
          'Signature Cougar superpower. Warm direction turns eager energy into S-Rank magic.',
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
    title: 'Reinforcing S-Rank Effort With Unmistakable Warmth',
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
