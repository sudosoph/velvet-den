import type { PortraitExpression } from './v35AssetManifest';

export interface CubSchoolDrill {
  id: string;
  moduleNumber: number;
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
    title: 'The Bathroom Lid & Fresh Hand-Towel Inspection',
    redditComplaintQuote:
      '"Why do 25-year-old men invite a grown woman over when their bathroom has an open wire bin, zero hand towel, and one lonely 3-in-1 bottle on the tub ledge?"',
    scenarioSetup:
      'Date #3 went brilliantly and she agrees to come up to your apartment for a nightcap. In ten minutes she will excuse herself to use your bathroom.',
    rookieCrime:
      'Leaving an unlined plastic wastebasket next to the sink, a damp bath towel from Tuesday on the hook, and zero hand soap.',
    options: [
      {
        label:
          'Put out a lined step trash can with a closed lid, botanical liquid hand soap, and two folded white hand towels before leaving for dinner.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Thirty seconds of adult foresight makes every woman over 35 exhale with immediate relief.',
        expression: 'laugh',
      },
      {
        label:
          'Spray half a can of body mist into the air while she is hanging up her coat and hope she skips washing her hands.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Aerosol panic smells like a sophomore dorm hallway and fools nobody.',
        expression: 'icked',
      },
      {
        label:
          'Hand her a roll of kitchen paper towels on her way down the hall and joke about living "minimalist."',
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
    title: 'The Single Flat Pillow & Escaping Sheet Crime',
    redditComplaintQuote:
      '"I have crisp linen bedding at home. I cannot wake up at 7 AM on one yellowed pancake pillow with a navy microfiber sheet popping off the corner."',
    scenarioSetup:
      'She decides to stay the night after midnight cocktails. You pull back the duvet in your bedroom.',
    rookieCrime:
      'Offering a grown woman half of one flat college pillow on heat-trapping synthetic sheets with no headboard.',
    options: [
      {
        label:
          'Toss your couch throw cushion onto her side of the bed and tell her body heat builds character.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Couch suede against evening skincare is a felony in forty-eight states.',
        expression: 'icked',
      },
      {
        label:
          'Keep four lofty pillows in breathable cotton cases, a real headboard, and a spare phone charger ready on her nightstand.',
        isGoldStar: true,
        headmistressVerdict:
          'Top of the class. You do not need a penthouse; you need clean cotton, real pillows, and hospitality.',
        expression: 'blush',
      },
      {
        label:
          'Apologize for the bare mattress on the floor and explain you are waiting for "the right aesthetic."',
        isGoldStar: false,
        headmistressVerdict:
          'She already ordered an Uber before your sentence finished.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'percale-hosting-sheets',
  },
  {
    id: 'drill-03-midnight-snap-wyd',
    moduleNumber: 3,
    title: '"U Have Snap? WYLL?" at 11:48 PM',
    redditComplaintQuote:
      '"Nothing dries up interest faster than a cute 24-year-old matching with me and immediately typing: u have snap?? wyd rn"',
    scenarioSetup:
      'You match on Thursday night with an effortlessly witty 43-year-old creative director. Your thumbs hover over the keyboard.',
    rookieCrime:
      'Asking an accomplished woman in her forties for disappearing-photo streaks or sending three-letter low-effort pings.',
    options: [
      {
        label:
          'Send a complete sentence referencing her profile and offer a concrete Thursday 7:30 cocktail spot.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Full punctuation and an actual venue put you ahead of ninety percent of her queue.',
        expression: 'smirk',
      },
      {
        label:
          'Type "u have snap?? easier to talk there 👀" so you can send a ceiling selfie.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Past age thirty-two, asking for vanishing messages screams either teenager or secret girlfriend.',
        expression: 'icked',
      },
      {
        label:
          'Send "wyd" at 11:48 PM followed by "??" twelve minutes later when she is asleep.',
        isGoldStar: false,
        headmistressVerdict:
          'She has an 8:30 AM executive briefing and just unmatched you over morning espresso.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'after-dark-couples-deck',
  },
  {
    id: 'drill-04-zero-date-planning',
    moduleNumber: 4,
    title: '"Idk, What Do U Wanna Do?" (Mental-Load Dumping)',
    redditComplaintQuote:
      '"I make two hundred decisions a day at work. Please do not say let\'s hang out and then make me pick the neighborhood, cuisine, and time."',
    scenarioSetup:
      'She says she is free Friday evening after 7 PM. It is your turn to lock in Date #1.',
    rookieCrime:
      'Handing her an unscheduled homework assignment disguised as being "easygoing."',
    options: [
      {
        label:
          'Text: "I\'m down for whatever tbh! What side of town do you like and what food are you craving?"',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Calling yourself "chill" while making her play unpaid concierge kills the spark before Friday.',
        expression: 'icked',
      },
      {
        label:
          'Propose two specific options near her side of town with a 7:30 reservation held so all she has to do is pick A or B.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Taking Friday logistics off her plate is pure romantic oxygen.',
        expression: 'laugh',
      },
      {
        label:
          'Tell her to meet you outside a crowded walk-in bar with a ninety-minute line and "wing it."',
        isGoldStar: false,
        headmistressVerdict:
          'Standing on cold pavement in heels next to twenty-two-year-olds in jerseys is an automatic last date.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'espresso-martini-barware',
  },
  {
    id: 'drill-05-mute-video-sprint',
    moduleNumber: 5,
    title: '2x-Speed Clip Choreography vs. Real Presence',
    redditComplaintQuote:
      '"Why do some younger guys skip ten minutes of actual kissing to attempt frantic acrobatics they clearly saw on mute?"',
    scenarioSetup:
      'Things heat up for the first time back at her place. You want the night to be unforgettable.',
    rookieCrime:
      'Treating intimacy like a timed obstacle course instead of tuning in to the actual woman in your arms.',
    options: [
      {
        label:
          'Slow way down, stay attentive to her cues, and ask warmly what she loves most.',
        isGoldStar: true,
        headmistressVerdict:
          'Honors Distinction. Enthusiastic curiosity plus unhurried presence beats performative bravado every single night.',
        expression: 'blush',
      },
      {
        label:
          'Rush straight past foreplay and ask every ninety seconds if you broke a personal record.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Nobody wants an Olympic scoreboard in the bedroom.',
        expression: 'icked',
      },
      {
        label:
          'Brag beforehand for twenty minutes that you have "unmatched twenty-four-year-old stamina."',
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
    title: 'The "Teach Me Everything" Unpaid Instructor Pitch',
    redditComplaintQuote:
      '"I want a playful lover and equal, not an audition to be somebody\'s unpaid life coach or remedial professor."',
    scenarioSetup:
      'Over first-date wine, she asks what drew you to swipe right on her.',
    rookieCrime:
      'Casting her as a mystical mentor obligated to train you instead of showing up as an engaged adult peer.',
    options: [
      {
        label:
          'Say with puppy eyes: "Older women know so much—I\'m hoping you can teach me everything."',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. She clocked out of managing interns at 5:30 PM.',
        expression: 'icked',
      },
      {
        label:
          'Tell her directly that her sharp humor and travel stories caught your eye—and you love matching wits with someone who knows what she wants.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Seeing her as a magnetic individual—not a curriculum—creates instant peer chemistry.',
        expression: 'blush',
      },
      {
        label:
          'List six things women your own age do that annoy you so she feels "chosen."',
        isGoldStar: false,
        headmistressVerdict:
          'Bashing twenty-four-year-old women is never the compliment men think it is.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'part-of-your-world-book',
  },
  {
    id: 'drill-07-youth-charitable-donation',
    moduleNumber: 7,
    title: 'Treating Your Birth Year Like a Charitable Donation',
    redditComplaintQuote:
      '"Some 23-year-old with abs acts like showing up is community service—babe, youth is a timestamp, not a personality trait."',
    scenarioSetup:
      'You are fit, twenty-five, and getting plenty of attention. You sit down across from a stunning 46-year-old architect.',
    rookieCrime:
      'Assuming being younger gives you leverage to coast on charm, show up late, or fish for praise.',
    options: [
      {
        label:
          'Smirk and joke: "Bet the guys your age at the country club don\'t still have a six-pack like this."',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Arrogance ages faster than milk in August.',
        expression: 'icked',
      },
      {
        label:
          'Show up five minutes early in pressed linen, ask sharp questions about her latest build, and bring genuine warmth without ego.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Fitness gets you noticed across the room; manners and substance get you invited back.',
        expression: 'laugh',
      },
      {
        label:
          'Check your reflection in the wine glass twice and mention how many matches you get.',
        isGoldStar: false,
        headmistressVerdict:
          'She kindly flags the bartender for the check while you admire your jawline.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'cub-grooming-beard-skincare-kit',
  },
  {
    id: 'drill-08-sugar-mama-myth',
    moduleNumber: 8,
    title: 'The Algorithm "Sugar-Mama" Rent-Sigh Delusion',
    redditComplaintQuote:
      '"TikTok convinced a whole generation of broke guys that every divorced 44-year-old woman is waiting to buy them a console and cover rent."',
    scenarioSetup:
      'You earn an entry-level salary while she owns a coastal townhouse. You are planning Date #2.',
    rookieCrime:
      'Dropping hints about tight bills or joking that she should "put you on payroll."',
    options: [
      {
        label:
          'Plan a thoughtful sunset picnic or neighborhood bistro squarely within your budget and pick up the tab with pride.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Self-made women never expect you to match their net worth—only their effort and self-respect.',
        expression: 'blush',
      },
      {
        label:
          'Sigh loudly when the check lands and joke: "Thought successful women loved spoiling younger guys!"',
        isGoldStar: false,
        headmistressVerdict:
          'Immediate block before your car leaves the valet lane.',
        expression: 'icked',
      },
      {
        label:
          'Send her a link to noise-canceling headphones three days before your birthday "just in case."',
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
    title: 'The Tuesday 2:15 PM Board-Meeting Double-Text Pout',
    redditComplaintQuote:
      '"I was in a three-hour client mediation and came out to: guess ur too busy for me now 😔. Instant ick."',
    scenarioSetup:
      'You texted her a funny photo at 11:30 AM Tuesday. At 2:15 PM she still has not replied.',
    rookieCrime:
      'Spiral-texting passive-aggressive guilt trips during standard business hours.',
    options: [
      {
        label:
          'Send "guess I\'ll stop bothering u then 😔" at 2:15 PM so she reassures you.',
        isGoldStar: false,
        headmistressVerdict:
          'Detention. Manufacturing middle-school drama during her workday guarantees there is no Friday.',
        expression: 'icked',
      },
      {
        label:
          'Put your phone down, crush your own afternoon work, and greet her warmly when she texts at 6 PM.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Emotional self-regulation is the sexiest flex a twenty-something man owns.',
        expression: 'smirk',
      },
      {
        label:
          'Send three question marks and view every one of her Instagram stories twice.',
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
    title: 'The Public Sidewalk Hand-Drop Test',
    redditComplaintQuote:
      '"All over me in private, then suddenly walks three feet ahead like my nephew when guys his age walk past outside the bar."',
    scenarioSetup:
      'Walking out of dinner hand-in-hand, a loud group of twenty-four-year-old guys steps onto the sidewalk toward you both.',
    rookieCrime:
      'Flinching or letting go of her hand in public the moment peers look over.',
    options: [
      {
        label:
          'Keep holding her hand warmly, guide her to the inside of the sidewalk away from street traffic, and finish your story without missing a beat.',
        isGoldStar: true,
        headmistressVerdict:
          'Honors Distinction. Unshakeable public pride makes a woman ten times more smitten.',
        expression: 'blush',
      },
      {
        label:
          'Slip your hand into your pocket until the group passes, then reach for her again at the corner.',
        isGoldStar: false,
        headmistressVerdict:
          'Trust us: she noticed in 0.2 seconds, and she will never forget it.',
        expression: 'icked',
      },
      {
        label:
          'Overcompensate by glaring at the strangers and announcing your ages out loud.',
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
    title: 'The Calm Health-Check & STI-Panel Ego Test',
    redditComplaintQuote:
      '"Asked a 26-year-old calmly to swap recent lab results before going exclusive and he got offended like I insulted his honor."',
    scenarioSetup:
      'Chemistry is electric on Date #3, and she warmly suggests swapping fresh MyChart screening results before next weekend.',
    rookieCrime:
      'Taking grown-up sexual health hygiene personally or trying to talk her out of boundaries.',
    options: [
      {
        label:
          'Get defensive and ask: "Wait, do I look sketchy to you or don\'t you trust me?"',
        isGoldStar: false,
        headmistressVerdict:
          'Immediate expulsion. Getting offended by routine health care proves you are not ready for grown-up intimacy.',
        expression: 'icked',
      },
      {
        label:
          'Smile, thank her for being direct, book a next-day clinic draw, and screenshot your clean results by Thursday.',
        isGoldStar: true,
        headmistressVerdict:
          'Gold Star. Zero ego + fast follow-through unlocks complete trust.',
        expression: 'laugh',
      },
      {
        label:
          'Mumble "yeah totally I got checked like two years ago I think" and change the subject.',
        isGoldStar: false,
        headmistressVerdict:
          'Vague guesswork from 2024 does not pass inspection.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'date-night-oud-bergamot',
  },
  {
    id: 'drill-12-search-bar-labels',
    moduleNumber: 12,
    title: 'Opening With Browser-Tab Fetish Labels',
    redditComplaintQuote:
      '"If your first sentence contains hey cougar, hey milf, or bucket list, you are talking to a search category, not a person."',
    scenarioSetup:
      'You spot an intriguing woman at a gallery bar or on your Hinge Standouts feed and walk up to say hello.',
    rookieCrime:
      'Leading with pornographic or novelty age-category labels instead of treating her like an attractive woman.',
    options: [
      {
        label:
          'Wink and open with: "Always wanted to cross a gorgeous cougar off my list."',
        isGoldStar: false,
        headmistressVerdict:
          'Permanent ban from the lounge. Nobody wants to be your novelty merit badge.',
        expression: 'icked',
      },
      {
        label:
          'Open naturally on the sculpture in front of you both, make her laugh, and ask her name.',
        isGoldStar: true,
        headmistressVerdict:
          'Summa Cum Laude. Treat her like a fascinating woman first and let chemistry do the talking.',
        expression: 'blush',
      },
      {
        label:
          'Open by guessing her exact age out loud to prove how perceptive you are.',
        isGoldStar: false,
        headmistressVerdict:
          'Carnival weight-guesser energy never earned a second drink.',
        expression: 'icked',
      },
    ],
    fixItAffiliateId: 'fill-in-love-coupon-cards',
  },
];
