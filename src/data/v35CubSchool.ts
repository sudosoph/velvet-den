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

export const V35_HEADMISTRESS_DRILLS: CubSchoolDrill[] = [
  {
    id: 'hm-01-first-date-bill-frame',
    moduleNumber: 1,
    topicTag: '🥂 Check Etiquette',
    sceneImage: './images/scenes/candlelit-cocktails.jpg',
    punchyQuestion:
      'Date #1 check lands. Your 26-year-old date pauses: "Unless you prefer splitting since you are a VP?" Your move?',
    title: 'Holding Graceful Reciprocity Without Becoming an ATM',
    redditComplaintQuote:
      '"Start grabbing every check out of salary guilt and you accidentally adopt a dependent instead of a lover."',
    scenarioSetup:
      'He asked you out to a cozy cocktail bar and now tests whether your title means he is off the hook.',
    rookieCrime:
      'Over-functioning financially out of guilt or turning dinner into an awkward accounting audit.',
    options: [
      {
        label: 'Insist on paying every tab yourself from Day 1 so he never feels stressed about money.',
        isGoldStar: false,
        headmistressVerdict:
          'Self-inflicted trap. Over-paying out of guilt kills polarity before Date #3.',
        expression: 'icked',
      },
      {
        label: 'Smile warmly: "You invited me out tonight, so I will let you get this one, and I have next Friday."',
        isGoldStar: true,
        headmistressVerdict:
          'Crown-tier poise. You let him stand tall tonight while setting effortless adult reciprocity.',
        expression: 'blush',
      },
      {
        label: 'Open your phone calculator and itemize every olive and appetizer down to the cent.',
        isGoldStar: false,
        headmistressVerdict:
          'Nothing evaporates romantic tension faster than an expense-report audit at the table.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'good-boy-brass-training-clicker',
  },
  {
    id: 'hm-02-coachable-apartment-audit',
    moduleNumber: 2,
    topicTag: '🏠 His Place Audit',
    sceneImage: './images/scenes/cozy-rain-suite.jpg',
    punchyQuestion:
      'His apartment has a clean kitchen and great vinyl, yet only two flat pillows and an open bathroom bin. Verdict?',
    title: 'Coachable Golden Cub vs. Hopeless Slob',
    redditComplaintQuote:
      '"Clean kitchen plus one blind spot means coachable in 48 hours; filthy floor means run."',
    scenarioSetup:
      'After a great third date you visit his place and spot genuine effort alongside classic twenty-something blind spots.',
    rookieCrime:
      'Either suffering in silence on a flat pillow or buying all his household upgrades for him.',
    options: [
      {
        label: 'Tease him warmly once: four real pillows and a lidded bin are required before your next sleepover.',
        isGoldStar: true,
        headmistressVerdict:
          'Exact Headmistress calibration. State the standard once with a wink and watch how fast he upgrades.',
        expression: 'laugh',
      },
      {
        label: 'Suffer silently on a folded throw blanket all night and resent him over morning coffee.',
        isGoldStar: false,
        headmistressVerdict:
          'Never martyr your neck for a man who would gladly fix it tomorrow if told plainly.',
        expression: 'icked',
      },
      {
        label: 'Secretly ship two hundred dollars of luxury bedding to his apartment yourself.',
        isGoldStar: false,
        headmistressVerdict:
          'Put the card away. Let him invest the effort into hosting you properly.',
        expression: 'smirk',
      },
    ],
    fixItAffiliateId: 'percale-hosting-sheets',
  },
  {
    id: 'hm-03-midnight-u-up-ping',
    moduleNumber: 3,
    topicTag: '📱 Midnight Crumbs',
    sceneImage: './images/scenes/wine-bar-booth.jpg',
    punchyQuestion:
      'A handsome 25-year-old goes quiet for three days, then texts "u up? wyd" at 11:54 PM Thursday. Your move?',
    title: 'Training Out Midnight Low-Effort Pings',
    redditComplaintQuote:
      '"Answer a midnight wyd once and you will never see a 7:30 PM reservation from him."',
    scenarioSetup:
      'Your phone lights up on the nightstand minutes before midnight after radio silence since Monday.',
    rookieCrime:
      'Rewarding zero-effort late-night pings with immediate access or three-paragraph lectures.',
    options: [
      {
        label: 'Reply right away and drive across town at midnight to prove how spontaneous you are.',
        isGoldStar: false,
        headmistressVerdict:
          'Accepting midnight crumbs guarantees you never get prime-time effort.',
        expression: 'icked',
      },
      {
        label: 'Type a four-paragraph midnight essay explaining why women in their forties deserve better.',
        isGoldStar: false,
        headmistressVerdict:
          'Never write free dissertations for a man lying sideways on a sofa.',
        expression: 'icked',
      },
      {
        label: 'Sleep soundly, then reply at 10 AM: "Asleep like a grown adult. Text me when you plan real 7:30 drinks."',
        isGoldStar: true,
        headmistressVerdict:
          'Masterclass. Zero anger, unmistakable boundary, ball squarely in his court.',
        expression: 'smirk',
      },
    ],
    fixItAffiliateId: 'black-cat-girlfriend-leopard-mug',
  },
  {
    id: 'hm-04-nosy-brunch-friend',
    moduleNumber: 4,
    topicTag: '👯‍♀️ Brunch Shade',
    sceneImage: './images/scenes/palm-springs-resort.jpg',
    punchyQuestion:
      'At Sunday brunch, a skeptical friend smirks: "He is 27? What could you two possibly talk about?" Your reply?',
    title: 'Shutting Down Projection With Unbothered Joy',
    redditComplaintQuote:
      '"Half the snark at brunch comes from people stuck in joyless marriages projecting onto your glow."',
    scenarioSetup:
      'Over mimosas, your table waits to see if you flinch when someone pokes at your twelve-year age gap.',
    rookieCrime:
      'Over-explaining, apologizing for your happiness, or handing over private messages for group inspection.',
    options: [
      {
        label: 'Sip unbothered: "Books, travel, and great Sunday breakfast. Zero bitter ex-spouse monologues so far."',
        isGoldStar: true,
        headmistressVerdict:
          'Pure silk. Amused confidence ends nosy commentary in one sentence flat.',
        expression: 'laugh',
      },
      {
        label: 'Apologize defensively for ten minutes and promise it is "probably ending next week anyway."',
        isGoldStar: false,
        headmistressVerdict:
          'Never shrink a good thing to make a cynical spectator comfortable.',
        expression: 'icked',
      },
      {
        label: 'Pass your unlocked phone around the table reading his private messages aloud.',
        isGoldStar: false,
        headmistressVerdict:
          'Protect your private intimacy; your calm smile is all the proof anyone needs.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'big-carl-giant-wine-glass',
  },
  {
    id: 'hm-05-bedroom-pace-direction',
    moduleNumber: 5,
    topicTag: '🔥 Setting the Pace',
    sceneImage: './images/scenes/hotel-pool-sauna.jpg',
    punchyQuestion:
      'First night back at your place: he is wildly enthusiastic yet rushing like a timed sprint. How do you steer?',
    title: 'Directing Eager Energy Into Slow-Burn Mastery',
    redditComplaintQuote:
      '"Younger men are thrilled to learn what you love when you guide them warmly in the moment."',
    scenarioSetup:
      'Chemistry is electric, though his nerves have him moving at double speed.',
    rookieCrime:
      'Faking satisfaction to spare his ego or turning intimacy into a cold critique.',
    options: [
      {
        label: 'Fake a finish in four minutes to protect his ego and stare at the ceiling.',
        isGoldStar: false,
        headmistressVerdict:
          'Counterfeit praise locks in terrible habits forever.',
        expression: 'icked',
      },
      {
        label: 'Catch his wrists with a slow smile, slow his breathing down, and whisper exactly what feels best.',
        isGoldStar: true,
        headmistressVerdict:
          'Signature Cougar superpower. Warm, specific guidance turns eager energy into unforgettable chemistry.',
        expression: 'blush',
      },
      {
        label: 'Halt everything to deliver a stern lecture comparing him to your ex-husband.',
        isGoldStar: false,
        headmistressVerdict:
          'Guide with heat in the moment, never a boardroom post-mortem.',
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
      'On Date #2, a charming 24-year-old jokes: "Since you are an exec, maybe you can sponsor my Cabo trip." Verdict?',
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
        label: 'Pretend you missed the comment and hope the mooching jokes stop on their own.',
        isGoldStar: false,
        headmistressVerdict:
          'Trial balloons always turn into real requests if you smile past them.',
        expression: 'icked',
      },
      {
        label: 'Hold eye contact with a dry grin: "Cute try, I spoil partners with company, never allowances." Watch his face.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star vetting. A real peer laughs with respect; a moocher sours within five minutes.',
        expression: 'smirk',
      },
    ],
    fixItAffiliateId: 'short-leash-leather-dog-leash',
  },
  {
    id: 'hm-07-sanctuary-lease-boundary',
    moduleNumber: 7,
    topicTag: '🏡 Sanctuary Keys',
    sceneImage: './images/scenes/sunday-kitchen-sanctuary.jpg',
    punchyQuestion:
      'Four months in, his roommate lease ends and he hints about moving his desk into your sunlit den. Your boundary?',
    title: 'Protecting Your Sanctuary From Convenience Leases',
    redditComplaintQuote:
      '"Never let an expiring roommate lease rush a man into the peaceful home you spent years building."',
    scenarioSetup:
      'Weekend sleepovers are wonderful, and suddenly his moving boxes need a home next month.',
    rookieCrime:
      'Surrendering your personal sanctuary out of guilt before a relationship has earned it.',
    options: [
      {
        label: 'Affirm the spark warmly: "I love our weekends here, and keeping two separate homes for year one keeps us thriving."',
        isGoldStar: true,
        headmistressVerdict:
          'Living-Apart-Together wisdom. Boundaries stated warmly protect both your peace and the romance.',
        expression: 'blush',
      },
      {
        label: 'Hand over a spare key and clear out your study even though your stomach knots up.',
        isGoldStar: false,
        headmistressVerdict:
          'Resentment moves in faster than his monitor stand ever could.',
        expression: 'icked',
      },
      {
        label: 'Ghost him out of panic instead of speaking one honest sentence.',
        isGoldStar: false,
        headmistressVerdict:
          'Grown women hold clear boundaries without blowing up good connections.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'houseboy-linen-apron',
  },
  {
    id: 'hm-08-planning-handoff',
    moduleNumber: 8,
    topicTag: '🍸 Friday Planning',
    sceneImage: './images/scenes/velvet-room-bar.jpg',
    punchyQuestion:
      'He asks to see you Friday, then texts: "Down for whatever! Pick the neighborhood, spot, and time?" Your reply?',
    title: 'Refusing Unpaid Concierge Duty',
    redditComplaintQuote:
      '"Give a smart younger man a playful prompt to lead once, and watch how quickly he steps up."',
    scenarioSetup:
      'You just wrapped nine hours of executive decisions and receive an unscheduled planning assignment.',
    rookieCrime:
      'Silently taking over 100% of date logistics and then wondering why he stops initiating.',
    options: [
      {
        label: 'Spend forty minutes researching OpenTable, booking the table, and sending him parking pins.',
        isGoldStar: false,
        headmistressVerdict:
          'You just hired yourself as his unpaid social secretary before Date #2.',
        expression: 'icked',
      },
      {
        label: 'Reply playfully: "I clock out of decisions at 6 PM Friday. Send two great cocktail spots and I will pick A or B."',
        isGoldStar: true,
        headmistressVerdict:
          'Effortless feminine frame. High-EQ Cubs love rising to a clear, playful standard.',
        expression: 'laugh',
      },
      {
        label: 'Cancel Friday abruptly without telling him what went wrong.',
        isGoldStar: false,
        headmistressVerdict:
          'Give a promising match one clear cue before tossing the whole ticket.',
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
      'Over second-date drinks, he grins: "Dating an older woman has been on my bucket list since college." How do you grade it?',
    title: 'Separating Nervous Flattery From Novelty Tourists',
    redditComplaintQuote:
      '"One raised eyebrow tells you in ten seconds whether he sees a fantasy category or sees YOU."',
    scenarioSetup:
      'He thinks he just paid you a bold compliment, unaware he stepped onto thin ice.',
    rookieCrime:
      'Accepting novelty-category status instead of testing whether he actually knows who sits across from him.',
    options: [
      {
        label: 'Beam proudly at helping a stranger cross off his college bingo card.',
        isGoldStar: false,
        headmistressVerdict:
          'You are a magnetic individual, never a tandem-skydiving voucher.',
        expression: 'icked',
      },
      {
        label: 'Arch one brow: "Bucket lists are for tourists. Tell me two things you like about me besides my birth year."',
        isGoldStar: true,
        headmistressVerdict:
          'Laser-guided test. Genuine admirers pivot to your wit and warmth; tourists fumble on the spot.',
        expression: 'smirk',
      },
      {
        label: 'Toss your drink across the booth and storm out.',
        isGoldStar: false,
        headmistressVerdict:
          'Save the glassware; one calm eyebrow arch makes him sweat ten times harder.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'no-hard-feelings-jlaw-prime',
  },
  {
    id: 'hm-10-coworker-run-in',
    moduleNumber: 10,
    topicTag: '🤝 Public Pride',
    sceneImage: './images/scenes/wedding-gala-cheers.jpg',
    punchyQuestion:
      'Two of his coworkers walk into the wine bar, and he drops your hand to introduce you as "my friend." Your verdict?',
    title: 'Zero Tolerance for Back-Booth Secrecy',
    redditComplaintQuote:
      '"If he cannot hold your hand in daylight, he forfeits midnight privileges immediately."',
    scenarioSetup:
      'After weeks of chemistry, a surprise run-in reveals how he handles public eyes.',
    rookieCrime:
      'Shrinking into a secret "mentor" cover story to protect an insecure man from harmless teasing.',
    options: [
      {
        label: 'Play along as his career mentor all evening so his coworkers do not tease him.',
        isGoldStar: false,
        headmistressVerdict:
          'Never audition for a man’s closet. Secrecy is an automatic expulsion.',
        expression: 'icked',
      },
      {
        label: 'Start a loud argument right in front of his coworkers at the bar.',
        isGoldStar: false,
        headmistressVerdict:
          'Keep your composure immaculate; quiet exits carry ten times the weight.',
        expression: 'icked',
      },
      {
        label: 'Stay poised for two minutes, then tell him outside: "I only date men proud to stand beside me in every room."',
        isGoldStar: true,
        headmistressVerdict:
          'Unforgettable dignity. You never raise your voice, and your standard stays undefeated.',
        expression: 'smirk',
      },
    ],
    fixItAffiliateId: 'golden-retriever-boyfriend-mug',
  },
  {
    id: 'hm-11-kids-timeline-truth',
    moduleNumber: 11,
    topicTag: '🕰️ Chapter Alignment',
    sceneImage: './images/scenes/canyon-sunrise-trail.jpg',
    punchyQuestion:
      'Six months in, chemistry is S-Rank when he mentions wanting two biological kids by 32, and your baby chapter is closed. Call?',
    title: 'Radical Kindness on Future Timelines',
    redditComplaintQuote:
      '"Real grown-up love puts all cards face-up on the table so nobody’s decade gets quietly spent."',
    scenarioSetup:
      'On a sunlit Sunday trail walk, future family hopes surface for the first time.',
    rookieCrime:
      'Dodging the conversation for years out of fear of losing great present-day chemistry.',
    options: [
      {
        label: 'Change the subject for two years hoping he quietly forgets about wanting kids.',
        isGoldStar: false,
        headmistressVerdict:
          'Postponing fundamental truth steals precious chapters from both of you.',
        expression: 'icked',
      },
      {
        label: 'Have the honest, loving Sunday talk now so you both choose your path with wide-open eyes.',
        isGoldStar: true,
        headmistressVerdict:
          'Highest emotional maturity. Truth spoken with warmth honors both hearts.',
        expression: 'blush',
      },
      {
        label: 'Pick a random fight over dinner plates so he ends things without knowing why.',
        isGoldStar: false,
        headmistressVerdict:
          'Manufactured drama is beneath a woman who knows her own heart.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'part-of-your-world-book',
  },
  {
    id: 'hm-12-retiring-self-sabotage',
    moduleNumber: 12,
    topicTag: '👑 Receiving Devotion',
    sceneImage: './images/scenes/coastal-convertible.jpg',
    punchyQuestion:
      'He shows up consistently, brings morning croissants, holds your hand proudly, and plans a coastal weekend. Fear whispers about the 14-year gap. Move?',
    title: 'Letting a Vetted Golden Cub Actually Adore You',
    redditComplaintQuote:
      '"Vetting out clowns is half the art; retiring the imaginary audience when you find a gem is the rest."',
    scenarioSetup:
      'He has passed every green-flag test with flying colors, and only your own protective armor stands in the way.',
    rookieCrime:
      'Blowing up rare, healthy devotion with pre-emptive breakup speeches "for his own good."',
    options: [
      {
        label: 'Retire the imaginary audience, pack the weekender bag, and let yourself savor a partner who shows up 100%.',
        isGoldStar: true,
        headmistressVerdict:
          'Highest Headmistress Distinction! You know how to vet ruthlessly and love generously.',
        expression: 'blush',
      },
      {
        label: 'Deliver a dramatic breakup monologue "for his own good" before anyone can judge.',
        isGoldStar: false,
        headmistressVerdict:
          'Pre-emptive self-sabotage is just fear dressed up as nobility.',
        expression: 'icked',
      },
      {
        label: 'Interrogate him every Friday night asking when he plans to trade you in for someone 26.',
        isGoldStar: false,
        headmistressVerdict:
          'Cross-examining a devoted partner pushes away the exact joy you earned.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'velvet-travel-weekender-duffel',
  },
];
