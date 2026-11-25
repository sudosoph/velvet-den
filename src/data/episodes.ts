import type { FelineTier, SubplotTag } from '../domain/taxonomy';

export type RelationshipStage = 1 | 2 | 3 | 4 | 5 | 6;
export type MinigameType =
  | 'check_reflex'
  | 'trail_pace'
  | 'room_audit'
  | 'doubt_spiral'
  | 'bench_press'
  | 'cub_grooming'
  | 'thermostat_dial'
  | 'big_carl_pour'
  | 'black_cat_pace'
  | 'venmo_calculator_block'
  | 'roommate_kitchen_escape'
  | 'hobosexual_bag_intercept';

export const RELATIONSHIP_STAGE_LABELS: Record<RelationshipStage, string> = {
  1: 'Stage 1 • First Spark',
  2: 'Stage 2 • Courting Rhythm',
  3: 'Stage 3 • Behind Closed Doors',
  4: 'Stage 4 • Friends, Family & Public',
  5: 'Stage 5 • The Doubt ("Can This Actually Work?")',
  6: 'Stage 6 • The Real Future',
};

export interface StatDeltas {
  maturity: number;
  chivalry: number;
  eq: number;
  chemistry: number;
  redFlags: number;
}

export interface EpisodeChoice {
  labelHer: string;
  labelHim: string;
  outcomeHer: string;
  outcomeHim: string;
  toastBanner: string;
  deltas: StatDeltas;
  badgeUnlocked?: string;
  triggerTipPrompt?: boolean;
}

export interface Episode {
  id: string;
  act: 2 | 3;
  stage: RelationshipStage;
  title: string;
  subredditThreadInspiration: string;
  isVip: boolean;
  creditCost: number;
  requiredAnyTags?: SubplotTag[];
  allowedTiers?: FelineTier[];
  minAgeGap?: number;
  maxAgeGap?: number;
  minigame?: MinigameType;
  sceneArt:
    | 'tapas_check'
    | 'waiter_shock'
    | 'code_switch_phone'
    | 'babysitter_clock'
    | 'princess_bouquet'
    | 'ridge_trail_leash'
    | 'mirror_vanity'
    | 'houseboy_apron'
    | 'fertility_talk'
    | 'brunch_daughter'
    | 'bathroom_audit'
    | 'palm_springs_pool'
    | 'thanksgiving_table'
    | 'trader_joes_aisle';
  setupHer: string;
  setupHim: string;
  codeSwitchRawImpulse?: {
    rawThought: string;
    warningNote: string;
  };
  innerInsecurityBubble?: {
    herDoubt: string;
    hisDoubt: string;
  };
  recommendedAffiliateId?: string;
  choices: [EpisodeChoice, EpisodeChoice, EpisodeChoice];
}

export const EPISODES: Episode[] = [
  {
    id: 'check-drop',
    act: 2,
    stage: 1,
    minigame: 'check_reflex',
    title: 'The Tapas Check-Drop ("Cougar ≠ Sugar Mama")',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Who pays on dates? Reminder: Cougar ≠ Sugar Mama!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    setupHer:
      'Two espresso martinis and blistered shishito peppers later, the leather checkbook lands between you and {hisName}. You make triple his salary—but you’re vetting his pride, effort, and reciprocity.',
    setupHim:
      'The leather check presenter hits the marble table in front of {herName}. You know she runs an entire department, and your budget isn’t infinite—how do you play the check drop?',
    recommendedAffiliateId: 'espresso-martini-barware',
    choices: [
      {
        labelHer: 'Watch him smoothly slide his card in before you even reach—then offer dessert next door.',
        labelHim: 'Pick up the check cleanly ("I invited you out—you’ve got gelato next door if you want Round 2").',
        outcomeHer:
          'Zero awkward Venmo math, zero performative flexing. He handled dinner within the spot he chose, and grinned when you claimed the gelato tab.',
        outcomeHim:
          'Her eyebrows lift with genuine delight. You picked a spot in your budget, covered it smoothly, and left room for playful reciprocity.',
        toastBanner: 'CHIVALRY +20 • SUGAR-BABY MYTH CRUSHED',
        deltas: { maturity: 15, chivalry: 20, eq: 10, chemistry: 15, redFlags: 0 },
        badgeUnlocked: 'Cougar ≠ Sugar Mama Certified',
      },
      {
        labelHer: 'He jokes, "Aren’t cougars supposed to spoil me? 😜" while staring at the bill.',
        labelHim: 'Joke "Put it on the executive corporate card, Mommy?" and leave your wallet in your pocket.',
        outcomeHer:
          'Immediate Sahara desert. You came for a grown partner with youthful spark, not an adult dependent looking for an allowance.',
        outcomeHim:
          'She smiles politely, taps her metal card, and mentally archives your number before the receipt prints.',
        toastBanner: 'RED FLAG! • SUGAR-MAMA ASSUMPTION (-20)',
        deltas: { maturity: -20, chivalry: -20, eq: -10, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'He pulls out a phone calculator to split tax and tip down to $0.37.',
        labelHim: 'Open Venmo at the table to itemize who ate four croquetas versus three.',
        outcomeHer:
          'Fairness is fine, spreadsheet energy on Date #1 kills the romance—though at least he pays his own way.',
        outcomeHim:
          'Respectful of equality, slightly accountant-coded. She laughs and tells you to put the calculator away—she’s got tip.',
        toastBanner: 'MATURITY +5 • ROMANCE -5',
        deltas: { maturity: 5, chivalry: -5, eq: 5, chemistry: -5, redFlags: 0 },
      },
    ],
  },
  {
    id: 'waiter-son-incident',
    act: 2,
    stage: 4,
    minAgeGap: 18,
    title: '"Table for You and Your Son?"',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Waitress thought I was my cub’s mom—how he handled it sealed the deal"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'waiter_shock',
    setupHer:
      'At the wine bar host stand, a 19-year-old host beams brightly at you ({herAge}F) and {hisName} ({hisAge}M): "Right this way! Just a table for you and your son tonight?" You feel your soul briefly leave your body.',
    setupHim:
      'The teenage host just asked if you ({hisAge}M) are {herName}’s SON. You catch a flicker of mortification cross her face—all eyes on your next 2 seconds.',
    recommendedAffiliateId: 'espresso-martini-barware',
    choices: [
      {
        labelHer: 'He slips a warm hand onto your waist, winks at the host: "Definitely not my mom—your best corner booth for my date."',
        labelHim: 'Slide your hand to the small of her back with a grin: "Definitely not my mom—corner booth and two glasses of Pinot, please."',
        outcomeHer:
          'The host turns crimson and sprints off while the two of you burst out laughing in the booth. Unshakeable public confidence is pure catnip.',
        outcomeHim:
          'The host practically evaporates, and she laughs so hard she squeezes your hand across the candlelit table.',
        toastBanner: 'CHEMISTRY +25 • PUBLIC STIGMA VAPORIZED',
        deltas: { maturity: 20, chivalry: 15, eq: 15, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Survived "Is That Your Son?"',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He steps two feet away from you, stares at his shoes, and mumbles "Uh... yeah, two menus."',
        labelHim: 'Freeze awkwardly, drop her hand, and stare at the floor until the host walks away.',
        outcomeHer:
          'Remember Rule #1 of the subreddit: if a Cub is embarrassed to stand beside an older woman in public, he isn’t ready to date one.',
        outcomeHim:
          'Your silence hurt worse than the host’s mistake. She goes quiet over the bread basket.',
        toastBanner: 'RED FLAG! • PUBLIC SHRINKING (-20)',
        deltas: { maturity: -15, chivalry: -15, eq: -15, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'He snaps loudly at the teenage host and makes a tense scene in the lobby.',
        labelHim: 'Lecture the terrified 19-year-old host for three minutes about assumptions.',
        outcomeHer:
          'Points for defending you, minus ten for picking a fight with hospitality staff instead of laughing it off with grace.',
        outcomeHim:
          'She appreciates the loyalty, then gently touches your arm: "Babe, breathe—let’s just laugh about it over wine."',
        toastBanner: 'CHIVALRY +5 • EQ -10 (OVERCORRECTED)',
        deltas: { maturity: -5, chivalry: 5, eq: -10, chemistry: 0, redFlags: 0 },
      },
    ],
  },
  {
    id: 'code-switch-texting',
    act: 2,
    stage: 2,
    title: 'Generational Code-Switch & The "Retro 2000s" Slip',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Millennial vs Gen-Z texting, crew socks, and calling my college playlist retro"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'code_switch_phone',
    setupHer:
      'On the drive back, OutKast comes on your speakers—right after {hisName} called 2003 "classic retro childhood throwbacks." Now it’s next afternoon and your phone buzzes.',
    setupHim:
      'You nearly called {herName}’s 2003 college OutKast playlist "vintage childhood music" last night. Now you want to lock in Date #2—translate your raw impulse for her generation!',
    codeSwitchRawImpulse: {
      rawThought: 'yo ngl last night was fire fr 💀 u tryna link Friday or nah?? whats ur snap',
      warningNote:
        'TRANSLATOR ALERT: Skull emoji (💀), "tryna link", and Snapchat trigger instant Elder Millennial / Gen-X ick! Code-switch carefully.',
    },
    recommendedAffiliateId: 'date-night-oud-bergamot',
    choices: [
      {
        labelHer: 'He sends a crisp text with full punctuation + a 7:30 calendar link (and checks before calling if you’re Millennial, or calls boldly at 6 PM if Gen-X).',
        labelHim: 'Code-Switch Masterclass: Full sentences, zero 💀 emojis, a 7:30 wine-bar reservation link, and tailored call etiquette.',
        outcomeHer:
          'He left the TikTok group-chat slang with his boys and courted you in fluent grown-up. Even better: ankle socks and loafers, zero filming the food.',
        outcomeHim:
          'Seamless code-switch! You kept your playful warmth while matching her exact communication wavelength.',
        toastBanner: 'CODE-SWITCH MASTERED! • MATURITY +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 15, redFlags: 0 },
        badgeUnlocked: 'Bilingual Generational Code-Switcher',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He texts: "yo ngl last night was fire 💀 u tryna link? add my snap"',
        labelHim: 'Send the raw unedited text: "yo ngl last night was fire 💀 u tryna link? whats ur snap"',
        outcomeHer:
          'You stare at "whats ur snap" for five full seconds. You are a grown woman with a CPA, not a sophomore trading streaks.',
        outcomeHim:
          'Left on Read. Asking a Cougar for Snapchat is practically begging to be posted as a cautionary screenshot.',
        toastBanner: 'RED FLAG! • SNAPCHAT & BRAINROT DETECTED',
        deltas: { maturity: -20, chivalry: -15, eq: -15, chemistry: -15, redFlags: 1 },
        badgeUnlocked: 'Blocked on Snapchat',
      },
      {
        labelHer: 'He swings way too far into Victorian cosplay: "Dearest Madam, might I humbly beseech your company..."',
        labelHim: 'Overcorrect into stiff 1890s cosplay: "Good evening Madam, I humbly request your esteemed presence..."',
        outcomeHer:
          'You burst out laughing—"Stop talking to me like the Dowager Countess and just ask me to dinner!" Cute effort, slightly try-hard.',
        outcomeHim:
          'She teases you mercilessly for sounding like a Jane Austen telegram, though she still says yes to Friday.',
        toastBanner: 'TRY-HARD COSPLAY • CHEMISTRY +5',
        deltas: { maturity: 5, chivalry: 10, eq: 0, chemistry: 5, redFlags: 0 },
      },
    ],
  },
  {
    id: 'babysitter-flake-test',
    act: 2,
    stage: 1,
    allowedTiers: ['lynx', 'puma'],
    title: 'The $80 Babysitter & Precious Free-Time Test',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Paid $20/hr for my first night off in months and the cub canceled because of rain"',
    isVip: false,
    creditCost: 0,
    requiredAnyTags: ['single_mom_sitter'],
    sceneArt: 'babysitter_clock',
    setupHer:
      'It’s your ONE kid-free Friday this month, and your $20/hr sitter arrives in 90 minutes ($80 on the clock). Rain clouds roll in and your phone lights up from {hisName}.',
    setupHim:
      'It starts pouring outside two hours before your Friday date, and your buddies just texted about watching the game. You know {herName} hired a $20/hr babysitter for tonight.',
    choices: [
      {
        labelHer: 'He texts: "Brought a big golf umbrella and moved my car right near the awning so your hair stays dry—picking you up at 7 sharp."',
        labelHim: 'Confirm early: "Grabbed an oversized umbrella so your blowout survives the rain—pulling up at 7 sharp. Can’t wait."',
        outcomeHer:
          'A younger man who respects a busy woman’s calendar AND protects the blowout? Instant top 1% Cub status.',
        outcomeHim:
          'She replies with three heart-eyes—respecting how rare and expensive her free evening is puts you miles ahead.',
        toastBanner: 'RESPECT FOR HER TIME +25 • CHIVALRY +20',
        deltas: { maturity: 25, chivalry: 20, eq: 20, chemistry: 15, redFlags: 0 },
        badgeUnlocked: 'Sitter-Clock Respecter',
      },
      {
        labelHer: 'He texts at 6:15 PM: "hey bro came to town + its raining lol raincheck for next wk??"',
        labelHim: 'Send a casual 6:15 PM text: "kinda pouring out lol down to raincheck?"',
        outcomeHer:
          'Dorm-room flakiness meets an $80 babysitter invoice. You block his number, pour yourself champagne, and take yourself to sushi solo.',
        outcomeHim:
          'Instant block. Treating a busy mom’s booked Friday like a flexible college hang is fatal.',
        toastBanner: 'RED FLAG! • $80 BABYSITTER WASTED (-25)',
        deltas: { maturity: -25, chivalry: -20, eq: -20, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'He runs 20 minutes late fighting traffic, apologizes sincerely, and covers dessert + sitter overtime.',
        labelHim: 'Own a 15-minute rain delay upfront with live ETA and insist on covering the extra sitter hour.',
        outcomeHer:
          'Real accountability instead of excuses—offering to cover the extra sitter hour shows grown-up awareness.',
        outcomeHim:
          'Accountability saves the night; acknowledging the sitter clock proves you actually listen.',
        toastBanner: 'ACCOUNTABILITY +10',
        deltas: { maturity: 10, chivalry: 10, eq: 10, chemistry: 5, redFlags: 0 },
      },
    ],
  },
  {
    id: 'princess-soft-life',
    act: 2,
    stage: 2,
    title: 'Princess Treatment: Dropping the 20-Year Mental Load',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Just because I’m 43 doesn’t mean I want to boss him around—treat me like a princess!"',
    isVip: false,
    creditCost: 0,
    requiredAnyTags: ['princess_treatment'],
    sceneArt: 'princess_bouquet',
    setupHer:
      'You spent 50 hours this week directing adults who act like toddlers. You do NOT want to plan tonight, pick the restaurant, or play dominant boss—you want soft-life princess treatment from {hisName}.',
    setupHim:
      'Internet memes claim every Cougar wants to dominate—but you can tell {herName} is exhausted from running everything at work all week. How do you set the tone tonight?',
    recommendedAffiliateId: 'princess-mulberry-silk-robe',
    choices: [
      {
        labelHer: 'He arrives with peonies, opens your passenger door, drapes his jacket over your shoulders, and whispers: "Zero decisions tonight—I planned every detail."',
        labelHim: 'Bring fresh peonies, open her car door, handle the whole itinerary, and tell her: "Turn your brain off tonight—I’ve got you."',
        outcomeHer:
          'You practically melt into the leather seat. Being adored and cared for—instead of managing everything—is the ultimate luxury.',
        outcomeHim:
          'Her shoulders visibly drop two inches as she exhales. Giving a strong woman space to feel cherished and soft wins her completely.',
        toastBanner: 'PRINCESS TREATMENT UNLOCKED! • CHIVALRY +25',
        deltas: { maturity: 15, chivalry: 25, eq: 20, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Soft-Life Princess Certifier',
      },
      {
        labelHer: 'He texts at 7:45 PM: "idk whatever u wanna eat Mommy, u pick and drive?"',
        labelHim: 'Text "idk wherever u wanna go boss lady, u choose!"',
        outcomeHer:
          'Great—another unpaid project-management ticket disguised as a date. Hard pass.',
        outcomeHim:
          'Handing her MORE mental load on Friday night while calling her boss lady? Brutal miss.',
        toastBanner: 'RED FLAG! • ZERO EFFORT / MENTAL LOAD DUMP',
        deltas: { maturity: -15, chivalry: -25, eq: -15, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'He sends three thoughtful restaurant links with parking notes so you only have to tap A, B, or C.',
        labelHim: 'Curate three vetted spots with reservations ready so she just picks her craving.',
        outcomeHer:
          'Executive-assistant level prep! Easy, low-stress, and considerate.',
        outcomeHim:
          'Smart compromise—she picks B in five seconds and appreciates the prep work.',
        toastBanner: 'EFFORT +15 • EQ +10',
        deltas: { maturity: 10, chivalry: 15, eq: 10, chemistry: 10, redFlags: 0 },
      },
    ],
  },
  {
    id: 'trail-run-short-leash',
    act: 2,
    stage: 2,
    minigame: 'trail_pace',
    title: '6 AM Ridge Trail Run ("Short Leash & Cardio Check")',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Trail runs with cubs—testing if his 25yo stamina matches his talk"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'ridge_trail_leash',
    setupHer:
      'Saturday, 6:10 AM. {hisName} bragged all week about his "youthful stamina," so you brought him to your steep 5-mile canyon switchbacks. Mile 3 hits and you haven’t even broken breath.',
    setupHim:
      'You talked a big game about 20-something cardio—and now {herName} ({herAge}F) is floating up a 14% canyon incline in sculpted leggings, glancing back with a wicked grin: "Keep up, Cub. Short leash."',
    recommendedAffiliateId: 'trail-hydration-vest',
    choices: [
      {
        labelHer: 'He digs deep, matches your stride to the overlook, hands you cold electrolytes, and grins: "Short leash looks good on me—coffee’s on me down the hill."',
        labelHim: 'Push through the burn without whining, hand her electrolytes at the summit, and grin: "Eyes forward, keeping pace—where are we refueling?"',
        outcomeHer:
          'Flushed cheeks, endorphins sky-high, playful tease met with playful grit. Redirecting club energy into sunrise trail stamina is peak Cougar/Cub magic.',
        outcomeHim:
          'She laughs breathlessly at the summit view, tugs the collar of your running zip playfully, and says you passed phase one.',
        toastBanner: 'SHORT LEASH EARNED! • CHEMISTRY +25',
        deltas: { maturity: 15, chivalry: 15, eq: 10, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Off-Leash Ridge Runner',
      },
      {
        labelHer: 'He shows up hungover at 6:25 AM reeking of tequila from Friday night clubbing and quits at mile one.',
        labelHim: 'Stay out until 2 AM Friday, stumble up late smelling like tequila, and beg to turn back after half a mile.',
        outcomeHer:
          'Remember that `Interests: Nightlife` red flag? Nothing ages a young man faster than a 2 AM hangover on a 6 AM trail.',
        outcomeHim:
          'She finishes the remaining 4.5 miles solo at tempo pace while you sit on a boulder contemplating life choices.',
        toastBanner: 'RED FLAG! • NIGHTLIFE HANGOVER FAIL (-20)',
        deltas: { maturity: -20, chivalry: -10, eq: -10, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'He sprints ahead trying to turn a partner run into an ego race, then waits awkwardly.',
        labelHim: 'Sprint half a mile ahead to prove your VO2 max instead of running together.',
        outcomeHer:
          'Impressive lungs, zero partner awareness—she wanted tension and pace together, not a Strava time trial.',
        outcomeHim:
          'Fast split, missed flirtation—running *with* her beats showing off.',
        toastBanner: 'CARDIO +10 • EQ -5',
        deltas: { maturity: 0, chivalry: -5, eq: -5, chemistry: 5, redFlags: 0 },
      },
    ],
  },
  {
    id: 'mirror-game-insecurities',
    act: 2,
    stage: 3,
    title: 'Morning Sunlight: Harsh Mirrors vs. "Do I Have Enough Game?"',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Worried about softer skin/aging next to girls his age" × "Cubs wondering if we have enough game for her to see us again"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'Morning espresso in bright kitchen light—no dim cocktail lounge filter now. Both you and {hisName} pause for half a heartbeat, each hiding the exact vulnerability this community knows by heart.',
    setupHim:
      'Morning sunlight pours across {herName}’s kitchen counter. Behind the playful banter, both of your inner monologues are louder than the espresso machine.',
    innerInsecurityBubble: {
      herDoubt:
        'Her secret thought: "Harsh morning light... is he noticing softer skin or laugh lines compared to 23-year-old girls? Am I just a bucket-list novelty?"',
      hisDoubt:
        'His exact thought at the same second: "She is unreal without makeup—oh god, did I actually have enough game, or was I just a fun Friday distraction she won’t invite back?"',
    },
    recommendedAffiliateId: 'after-dark-couples-deck',
    choices: [
      {
        labelHer: 'Let him pull you close in the kitchen light as he admits he was nervous you wouldn’t want to see him again—and meet his honesty with yours.',
        labelHim: 'Kiss her shoulder warmly in the sunlight and admit with a smile: "Honestly? My only worry this morning is making sure I’m lucky enough to see you again next week."',
        outcomeHer:
          'Every ounce of mirror doubt melts instantly—he isn’t comparing you to 23-year-olds; he’s pinching himself that you chose him, while fluent post-Title IX warmth makes vulnerability effortless.',
        outcomeHim:
          'Her whole face softens as she laughs: "See you again? Keep looking at me like that and clear your Wednesday." Both insecurities dissolve at once.',
        toastBanner: 'DEEP EQ +25 • MUTUAL INSECURITY MELTED',
        deltas: { maturity: 20, chivalry: 15, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Sunlight & Real Game Certified',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He blurts a clumsy backhanded line: "Honestly you barely even look old in the light!"',
        labelHim: 'Try to reassure her with: "Don’t worry, you totally don’t even look old for your age!"',
        outcomeHer:
          'Bless his heart—or banish him. "For your age" is banned in 49 states and every thread on this sub.',
        outcomeHim:
          'Abort! Abort! Saying "for your age" turns a tender moment into a verbal pothole.',
        toastBanner: 'RED FLAG! • "FOR YOUR AGE" UTTERED (-20)',
        deltas: { maturity: -15, chivalry: -10, eq: -20, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Play it cool with witty armor on both sides and talk logistics for next Thursday.',
        labelHim: 'Play it cool, brew her coffee just right, and lock in Thursday dinner before heading out.',
        outcomeHer:
          'Smooth and pleasant—nobody fumbled, even if the deeper reassurance waits for Date #4.',
        outcomeHim:
          'Solid recovery; locking in Thursday proves you’re not a ghoster.',
        toastBanner: 'STEADY FOLLOW-THROUGH +10',
        deltas: { maturity: 10, chivalry: 10, eq: 5, chemistry: 10, redFlags: 0 },
      },
    ],
  },
  {
    id: 'houseboy-sunday-sanctuary',
    act: 2,
    stage: 3,
    minigame: 'room_audit',
    title: 'Houseboy Sunday & Her Peaceful Solo Sanctuary',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Happy living alone in my sanctuary—plus the joy of an energetic vetted cub doing chores"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'houseboy_apron',
    setupHer:
      'Sunday afternoon at your immaculate solo home. You love living alone (no premature move-in squatters!)—yet seeing {hisName} put his {hisAge}-year-old vigor into your chore list is undeniably thrilling.',
    setupHim:
      'Sunday at {herName}’s serene home sanctuary. You passed her emotional vetting—now how do you channel that youthful stamina without overstepping her solo space?',
    recommendedAffiliateId: 'houseboy-linen-apron',
    choices: [
      {
        labelHer: 'Toss him the washed linen apron—watch him hang the patio lights, scrub the counters spotless, and earn a very thorough fade-to-black reward upstairs.',
        labelHim: 'Tie on the linen apron, hang the patio lights, prep dinner, leave her space spotless—and playfully ask how your performance review looks.',
        outcomeHer:
          'Competence + youthful vigor + playful devotion—and he packs his overnight bag cleanly afterward without colonizing your bathroom counter. Perfection.',
        outcomeHim:
          'She inspects the gleaming kitchen, tugs your apron strings with a slow smile, and announces your Sunday houseboy review is moving upstairs... [Fade to Sunset].',
        toastBanner: 'CERTIFIED HOUSEBOY XP +30 • FADE-TO-BLACK PAYOFF',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Certified Linen-Apron Houseboy',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He tries leaving a 5-lb tub of whey protein, Xbox controller, and three hoodies in your closet after one weekend.',
        labelHim: 'Unpack half your gym duffel into her minimalist bathroom cabinet and ask for a spare house key.',
        outcomeHer:
          'WHOA, Hobo-sexual Alert! She worked 20 years for her peaceful sanctuary—never colonize a Cougar’s closet uninvited.',
        outcomeHim:
          'She hands your whey protein tub right back to you at the front door. Respect the solo sanctuary!',
        toastBanner: 'RED FLAG! • PREMATUARY SANCTUARY INVASION',
        deltas: { maturity: -20, chivalry: -10, eq: -20, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Skip the chores and lounge on the patio splitting takeout and crosswords.',
        labelHim: 'Bring Thai takeout, rub her feet on the sofa, and head home by 9:30 PM so she gets full beauty sleep.',
        outcomeHer:
          'Sweet, cozy, and respectful of her 9:30 PM wind-down routine.',
        outcomeHim:
          'Respecting a Cougar’s Sunday 9:30 PM skincare-and-sleep boundary earns guaranteed repeat invites.',
        toastBanner: 'COZY RESPECT +15',
        deltas: { maturity: 15, chivalry: 10, eq: 15, chemistry: 10, redFlags: 0 },
      },
    ],
  },
  {
    id: 'fertility-kids-crossroads',
    act: 3,
    stage: 6,
    title: 'Stage 6 Finale: The Kids & Timeline Crossroads',
    subredditThreadInspiration: 'r/CougarsAndCubs: "She’s done having kids / can’t have more, and we fell deeply in love"',
    isVip: false,
    creditCost: 0,
    requiredAnyTags: ['done_with_kids', 'wants_kids_someday'],
    sceneArt: 'fertility_talk',
    setupHer:
      'Six months in, the chemistry with {hisName} ({hisAge}M) is electric—and real love has arrived. Over late-night wine, the #1 real-world subplot surfaces: at {herAge}, you’re 100% done having kids, and he once pictured being a dad.',
    setupHim:
      'You’re falling for {herName} ({herAge}F) for real. She’s honest and gentle: her kid-raising chapter is closed forever, and she refuses to rob you of fatherhood if that’s truly non-negotiable for you.',
    choices: [
      {
        labelHer: 'Have the brave, transparent conversation—he reflects deeply and chooses a full, travel-filled partnership with *you* over a hypothetical script.',
        labelHim: 'Speak from grown clarity, not impulse: "I realized I wanted a life partner I adore, not a checklist—and the life I want is with you."',
        outcomeHer:
          'No denial, no kicking the can—just two adults choosing each other with eyes wide open. Real commitment unlocked.',
        outcomeHim:
          'You didn’t dodge the hard talk; you met her honesty with clarity, sealing a genuine long-term partnership.',
        toastBanner: 'TRUE COMMITMENT UNLOCKED • MATURITY +30',
        deltas: { maturity: 30, chivalry: 15, eq: 25, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Eyes-Wide-Open Lifemate',
      },
      {
        labelHer: 'Honor the truth gently if biological kids are his non-negotiable—parting with deep love and zero bitterness.',
        labelHim: 'Admit tenderly that becoming a dad someday truly matters to you, honoring each other before resentment ever starts.',
        outcomeHer:
          'The bittersweet classic *French Cougar / Idea of You* ending—deep love, total honesty, and lifelong gratitude for how much you grew together.',
        outcomeHim:
          'Bittersweet, mature, and deeply respectful—proof that loving honestly without stringing each other along is peak emotional maturity.',
        toastBanner: 'BITTERSWEET MATURITY +25 • ZERO REGRETS',
        deltas: { maturity: 25, chivalry: 15, eq: 25, chemistry: 10, redFlags: 0 },
        badgeUnlocked: 'Bittersweet Grace',
      },
      {
        labelHer: 'He waves it off vaguely: "Idk let’s just not think about it for five years lol."',
        labelHim: 'Kick the can down the road: "Let’s just vibe and figure that out in a few years!"',
        outcomeHer:
          'Avoidance isn’t commitment—dodging the #1 age-gap life-stage talk sets up future heartbreak.',
        outcomeHim:
          'She sees right through wishful avoidance; grown relationships require grown answers.',
        toastBanner: 'RED FLAG! • WISHFUL AVOIDANCE (-20)',
        deltas: { maturity: -20, chivalry: -5, eq: -20, chemistry: -10, redFlags: 1 },
      },
    ],
  },
  {
    id: 'adult-kid-brunch',
    act: 3,
    stage: 4,
    minAgeGap: 15,
    title: 'Stage 4 Boss: Brunch With Her 22yo Daughter & Brunch Crew',
    subredditThreadInspiration: 'r/CougarsAndCubs: "How did her adult children & meddling friends react to you?"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'brunch_daughter',
    setupHer:
      'Sunday mimosas: your 22-year-old college-senior daughter (nearly {hisName}’s age!) AND your most skeptical friend ("What when you’re 65?!") are across the table.',
    setupHim:
      'Boss level: {herName}’s 22-year-old daughter is eyeing you over avocado toast while her protective best friend tests whether you’re a passing phase.',
    choices: [
      {
        labelHer: 'He treats your daughter with warm zero-try-hard respect (never playing stepdad!), charms your friend, and lets his devotion to you speak for itself.',
        labelHim: 'Zero fake-stepdad weirdness, zero Gen-Z slang flexing—warm respect to her daughter and calm, unmistakable devotion to her.',
        outcomeHer:
          'In the parking lot afterward, your daughter texts you: "Okay wait... he actually adores you, Mom. Approved." Victory!',
        outcomeHim:
          'Her best friend whispers "Keep him" by the second mimosa, and her daughter gives the official nod.',
        toastBanner: 'INNER CIRCLE APPROVED! • EQ +25',
        deltas: { maturity: 25, chivalry: 20, eq: 25, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Brunch Inner-Circle Approved',
      },
      {
        labelHer: 'He tries acting like her daughter’s "cool peer" trading TikTok campus gossip while ignoring the adults.',
        labelHim: 'Slip into college-peer mode debating campus bars with her 22-year-old daughter for twenty minutes.',
        outcomeHer:
          'Highlighting that you two could share a college dining hall is the LAST visual anyone at this table needed.',
        outcomeHim:
          'Awkward reminder of the exact age proximity you wanted everyone to forget!',
        toastBanner: 'RED FLAG! • CAMPUS PEER AWKWARDNESS',
        deltas: { maturity: -20, chivalry: -10, eq: -15, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Keep the first intro to a breezy 30-minute coffee drop-in rather than a 2-hour brunch.',
        labelHim: 'Suggest a low-pressure 30-minute coffee hello first so nobody feels ambushed.',
        outcomeHer:
          'Smart pacing—everyone leaves smiling and comfortable.',
        outcomeHim:
          'Thoughtful emotional pacing wins quiet points all around.',
        toastBanner: 'SMART PACING +15',
        deltas: { maturity: 15, chivalry: 10, eq: 15, chemistry: 10, redFlags: 0 },
      },
    ],
  },

  // --- 12 NEW AGE-BRACKET & PROFILE-SPECIFIC SUBPLOTS ---
  {
    id: 'puma-kid-intro-boundary',
    act: 2,
    stage: 3,
    allowedTiers: ['lynx', 'puma'],
    title: 'The 6-Month Kid Boundary & Co-Parenting Ex Driveway Run-In',
    subredditThreadInspiration: 'r/CougarsAndCubs: "36F single mom dating 25M—strict 6-month rule before meeting my kid + handling the ex"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'babysitter_clock',
    setupHer:
      'You’re 36 with an ironclad rule: nobody meets your 7-year-old before six months of consistency. Sunday morning while {hisName} is grabbing his jacket at your porch, your co-parenting ex pulls into the driveway 25 minutes early for custody drop-off.',
    setupHim:
      '{herName} guards her child’s world fiercely with a 6-month intro boundary. Suddenly her ex-husband’s SUV pulls into the driveway 25 minutes early while you’re still on the porch.',
    choices: [
      {
        labelHer: 'He stays totally composed, gives a polite low-drama wave from his car without intruding on your child’s handoff, and texts later checking how you feel.',
        labelHim: 'Stay calm and drama-free—head smoothly to your car so her child’s handoff stays peaceful, then send a supportive check-in text.',
        outcomeHer:
          'Zero territorial chest-puffing, zero awkwardness in front of your kid. Seeing a younger man prioritize your child’s peace makes you fall ten times harder.',
        outcomeHim:
          'She texts twenty minutes later: "Thank you for handling that like an absolute pro. You have no idea how rare that is."',
        toastBanner: 'CO-PARENTING EQ +25 • MATURITY +25',
        deltas: { maturity: 25, chivalry: 15, eq: 25, chemistry: 15, redFlags: 0 },
        badgeUnlocked: 'Sacred Kid-Boundary Protector',
      },
      {
        labelHer: 'He pouts that you won’t introduce him as "the new stepdad" after three weeks and sizes up your ex.',
        labelHim: 'Complain "Why am I a secret?" and puff your chest out at her ex-husband on the lawn.',
        outcomeHer:
          'Pushing a mom’s kid-introduction boundary AND sparking driveway drama? Instant disqualification.',
        outcomeHim:
          'Making custody handoff about your ego violates every single-mom rule in the book.',
        toastBanner: 'RED FLAG! • DRIVEWAY EGO DRAMA (-25)',
        deltas: { maturity: -25, chivalry: -15, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Coordinate custody buffer windows together on shared calendar blocks going forward.',
        labelHim: 'Suggest building a clean 1-hour buffer before custody drop-offs so mornings stay stress-free.',
        outcomeHer:
          'Proactive logistics without drama—Elder Millennial heaven.',
        outcomeHim:
          'Practical calendar awareness earns serious partner points.',
        toastBanner: 'CALENDAR HARMONY +15',
        deltas: { maturity: 15, chivalry: 10, eq: 15, chemistry: 10, redFlags: 0 },
      },
    ],
  },
  {
    id: 'puma-boys-groupchat-kid',
    act: 3,
    stage: 4,
    allowedTiers: ['lynx', 'puma'],
    title: 'His Boys’ Group Chat: "Wait Bro, She’s 36 With a Kid?!"',
    subredditThreadInspiration: 'r/CougarsAndCubs: "How did your mid-20s guy friends react when you started seriously dating a 30s mom?"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'code_switch_phone',
    setupHer:
      'Friday happy hour: {hisName} brings you to meet his 25-year-old friend group for the first time. Two beers in, his loudest roommate jokes: "Bro skipped Vegas Dayclub for PTA snacks?!"',
    setupHim:
      'You bring {herName} ({herAge}F) to meet your mid-20s crew. Your loud roommate grins across the booth: "Wait, my guy traded bottle service for minivan duty?!" Everyone looks at you.',
    choices: [
      {
        labelHer: 'He laughs easily with an arm around your chair: "Have you looked at her? Easiest upgrade of my life, boys—next round’s on you."',
        labelHim: 'Smile smoothly without getting rattled: "Look across the table, man—easiest upgrade of my life. Grab us two Palomas."',
        outcomeHer:
          'Confident, warm, zero defensiveness—even his loudest roommate raises his glass in respect within five minutes.',
        outcomeHim:
          'Your buddies immediately respect the poise, and {herName} slips her hand onto your knee under the table.',
        toastBanner: 'GROUP-CHAT ROAST DEFLECTED • CHEMISTRY +20',
        deltas: { maturity: 20, chivalry: 20, eq: 15, chemistry: 20, redFlags: 0 },
      },
      {
        labelHer: 'He laughs nervously along with his boys: "Haha chill bro, we’re just keeping it casual anyway!"',
        labelHim: 'Downplay her to look cool in front of the boys: "Haha relax, it’s nothing serious."',
        outcomeHer:
          'Calling you "nothing serious" to impress guys who share a Costco membership? Uber ordered.',
        outcomeHim:
          'Throwing her under the bus for roommate clout ends the relationship on the spot.',
        toastBanner: 'RED FLAG! • LOCKER-ROOM BETRAYAL (-25)',
        deltas: { maturity: -25, chivalry: -25, eq: -20, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Introduce him to your two closest girlfriends first in a double-date wine lounge setting.',
        labelHim: 'Start with a smaller double date with your most mature couple friends instead of the rowdy bar crew.',
        outcomeHer:
          'Curating the right crowd beats surviving frat energy every time.',
        outcomeHim:
          'Smart social curation makes the night effortless.',
        toastBanner: 'SOCIAL CURATION +15',
        deltas: { maturity: 15, chivalry: 10, eq: 15, chemistry: 10, redFlags: 0 },
      },
    ],
  },
  {
    id: 'puma-one-and-done-clock',
    act: 3,
    stage: 6,
    allowedTiers: ['lynx', 'puma'],
    title: 'Stage 6 Finale: The 36F "One-and-Done" vs. Baby #2 Timeline',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Pumas in late 30s—everyone assumes we’re rushing for another baby, or he assumes we have 10 years to decide"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'fertility_talk',
    setupHer:
      'At {herAge}, dating a {hisAge}-year-old brings a uniquely 30s Puma crossroads: with **Sienna Miller & Oli Green** and **Ellie Goulding & Beau Minniear** welcoming babies with their 20s Cubs all over the headlines, everyone assumes you’re either rushing a baby clock or playing casual—when you actually want real intentionality.',
    setupHim:
      '{herName} is {herAge}—radiant, thriving, and crystal clear: whether a couple goes the **Sienna Miller / Ellie Goulding** Cougar-Cub baby route or stays one-and-done, she refuses to spend ages 36–41 in vague "let’s see where things go" situationship limbo.',
    choices: [
      {
        labelHer: 'Align on an intentional 1-to-2 year partnership roadmap—exclusive, proud, and crystal clear on family goals.',
        labelHim: 'Lay out real intentionality: exclusive commitment now, honest alignment on whether kids are a shared yes or happy one-and-done.',
        outcomeHer:
          'Zero situationship fog, zero biological assumptions—just real Millennial × Gen-Z partnership clarity.',
        outcomeHim:
          'Meeting her 30s clarity with real intentionality unlocks a powerhouse relationship.',
        toastBanner: 'PUMA STAGE 5 COMMITMENT • MATURITY +30',
        deltas: { maturity: 30, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Intentional Puma Lifemate',
      },
      {
        labelHer: 'He assumes because he’s {hisAge} you two can "stay casual and revisit labels in 6 years."',
        labelHim: 'Say "I’m only {hisAge}, let’s avoid labels for four or five years and see what happens."',
        outcomeHer:
          'He has 20s time blindness; you value your prime 30s way too much for a multi-year situationship.',
        outcomeHim:
          'Asking an intentional 36-year-old woman for a 5-year situationship is an instant goodbye.',
        toastBanner: 'RED FLAG! • SITUATIONSHIP TIME-WASTER (-20)',
        deltas: { maturity: -20, chivalry: -15, eq: -20, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Plan your first long weekend trip together and check in cleanly at the six-month mark.',
        labelHim: 'Make it official boyfriend/girlfriend tonight and book a coastal getaway together.',
        outcomeHer:
          'Clear title, clear excitement, zero games.',
        outcomeHim:
          'Claiming the relationship proudly wins her smile.',
        toastBanner: 'OFFICIAL LABEL LOCKED +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'cougar-thermostat-retinol',
    act: 2,
    stage: 2,
    allowedTiers: ['cougar', 'jaguar'],
    title: '62°F Bedroom Thermostat, Retinol & His Midnight Taco Energy',
    subredditThreadInspiration: 'r/CougarsAndCubs: "9:45 PM retinol, silk pillowcase, and freezing 62°F bedroom vs his midnight taco run"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'It’s 9:45 PM on a Tuesday sleepover. Your ideal night: tretinoin serum, mulberry silk pillowcase, reading glasses, and the bedroom AC arctic at 62°F—right as {hisName} ({hisAge}M) perks up asking to DoorDash birria tacos and start a 3-hour Christopher Nolan movie.',
    setupHim:
      'It’s 9:45 PM. Your {hisAge}-year-old stomach wants birria tacos and *Interstellar*, while {herName} ({herAge}F) just finished her 6-step skincare routine and set the bedroom thermostat to polar-bear 62°F.',
    recommendedAffiliateId: 'princess-mulberry-silk-robe',
    choices: [
      {
        labelHer: 'He refills your bedside ice water, respects the 62°F arctic sleep sanctuary, saves taco runs for Friday, and brings extra morning heat instead.',
        labelHim: 'Refill her bedside water carafe, embrace the 62°F arctic duvet cuddle, let her sleep by 10:15, and channel all that extra energy at 6:30 AM.',
        outcomeHer:
          '8 hours of uninterrupted REM sleep at 62°F PLUS morning chemistry before work? You almost offer him a drawer on the spot.',
        outcomeHim:
          'Respecting her sleep hygiene AND bringing sunrise energy makes you practically irreplaceable.',
        toastBanner: '62°F SANCTUARY MASTERED • CHEMISTRY +25',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: '62°F Sleep-Sanctuary Guardian',
      },
      {
        labelHer: 'He cranks the heat to 76°F, crunches tortilla chips in your white percale sheets at midnight, and scrolls TikTok on full volume.',
        labelHim: 'Turn her thermostat up to 75°F, eat crunchy tacos in bed, and play reels out loud at 12:30 AM.',
        outcomeHer:
          'Salsa near 600-thread-count white percale AND touching the thermostat?! War crime.',
        outcomeHim:
          'Touching a Cougar’s thermostat AND getting taco crumbs in her percale sheets is banishment-level treason.',
        toastBanner: 'RED FLAG! • TACO CRUMBS & 75°F HEAT (-20)',
        deltas: { maturity: -20, chivalry: -15, eq: -20, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Eat midnight snacks quietly in the kitchen with headphones while you sleep peacefully.',
        labelHim: 'Sneak tacos quietly at the kitchen island with AirPods in, brush your teeth, and slip into bed silently.',
        outcomeHer:
          'Self-sufficient, considerate night-owl compromise!',
        outcomeHim:
          'Zero sleep disruption, spotless kitchen counter—everyone wins.',
        toastBanner: 'CONSIDERATE NIGHT OWL +15',
        deltas: { maturity: 15, chivalry: 15, eq: 15, chemistry: 10, redFlags: 0 },
      },
    ],
  },
  {
    id: 'cougar-salary-negotiation',
    act: 2,
    stage: 3,
    allowedTiers: ['cougar'],
    title: 'Executive Roleplay (The Career Kind): Coaching His +25% Promotion',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Helped my 26yo cub negotiate a $22k raise using my VP hiring playbook—hottest night ever"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    setupHer:
      '{hisName} just got offered a promotion at work—with a lowball 6% bump. You negotiate seven-figure departmental budgets in your sleep, yet you never want to act like his boss or mom.',
    setupHim:
      'Your company offered you a promotion with a tiny 6% raise. {herName} literally approves VP compensation bands for a living—how do you handle career advice across the experience gap?',
    choices: [
      {
        labelHer: 'Ask first if he wants your VP lens—then run a sharp 15-minute mock negotiation together before celebrating his +24% win over steak.',
        labelHim: 'Ask for her executive perspective openly, take notes with zero ego, crush the counteroffer Monday, and take her to steak dinner to celebrate!',
        outcomeHer:
          'He had zero fragile male ego about learning from your experience—then used his new raise to book your favorite steakhouse. Unbeatable power-couple dynamic.',
        outcomeHim:
          'You landed a +24% raise, thanked your secret weapon properly, and watched her beam with pride across the candlelit booth.',
        toastBanner: 'POWER-COUPLE MENTORSHIP • MATURITY +25',
        deltas: { maturity: 25, chivalry: 20, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: '+24% Raise Power Couple',
      },
      {
        labelHer: 'He snaps defensively: "Stop trying to manage my career just because you’re older!"',
        labelHim: 'Get prickly and defensive: "I don’t need corporate lectures from my girlfriend."',
        outcomeHer:
          'Insecurity disguised as pride—turning down gold-tier executive wisdom out of ego is exhausting.',
        outcomeHim:
          'Snapping at someone rooting for your success kills the spark fast.',
        toastBanner: 'RED FLAG! • FRAGILE CAREER EGO (-20)',
        deltas: { maturity: -20, chivalry: -10, eq: -20, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Keep work and romance mostly separate—cheer him on warmly without reading his spreadsheets.',
        labelHim: 'Handle the negotiation solo first, then share the good news over cocktails Friday.',
        outcomeHer:
          'Clean boundary between office brain and date night.',
        outcomeHim:
          'Independent execution with celebratory Friday energy.',
        toastBanner: 'INDEPENDENT DRIVE +15',
        deltas: { maturity: 15, chivalry: 10, eq: 10, chemistry: 10, redFlags: 0 },
      },
    ],
  },
  {
    id: 'cougar-boys-groupchat-ceo',
    act: 3,
    stage: 4,
    allowedTiers: ['cougar'],
    title: 'Drinks With His Friends ("Bro Is Dating a Whole VP")',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Introducing my 45F girlfriend to my 26M friends—setting the tone immediately"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    setupHer:
      'Cocktail lounge night meeting {hisName}’s mid-20s friend circle. Everyone is charming until one tipsy college buddy grins: "Yo {hisName}, blink twice if she’s buying you a PS5 Pro!"',
    setupHim:
      'You’re proud as hell introducing {herName} ({herAge}F) at a rooftop bar—until your dumbest college buddy blurts out a "Stifler’s Mom / PS5 Sugar Mama" joke.',
    choices: [
      {
        labelHer: 'He doesn’t flinch—locks eyes with his buddy calmly: "Try a grown-up joke, man. She’s brilliant, and I buy my own gear"—then pivots smoothly.',
        labelHim: 'Check your buddy cleanly with a calm smile—"Retire the 2004 movie jokes, bro; she’s out of all our leagues"—and pivot the table conversation effortlessly.',
        outcomeHer:
          'Zero shouting, total backbone. His friend apologizes immediately, and the rest of the table treats you like royalty all night.',
        outcomeHim:
          'Clean boundary, zero awkward explosion. {herName} whispers in the elevator: "The way you handled that? Ten out of ten."',
        toastBanner: 'BACKBONE & POISE +25 • CHIVALRY +20',
        deltas: { maturity: 25, chivalry: 20, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Group-Chat Backbone Certified',
      },
      {
        labelHer: 'He chuckles awkwardly and winks at his buddy: "Hey, hoping for a Porsche by Christmas!"',
        labelHim: 'Play into the sugar-mama joke for laughs: "Manifesting that Porsche lease, boys!"',
        outcomeHer:
          'Reducing you to a wallet punchline in front of 25-year-olds? Check, please.',
        outcomeHim:
          'Trading her dignity for a cheap laugh from the boys costs you the relationship.',
        toastBanner: 'RED FLAG! • SUGAR-MAMA JOKE FAIL (-25)',
        deltas: { maturity: -25, chivalry: -25, eq: -20, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'You roast his buddy effortlessly yourself in one razor-sharp sentence while {hisName} grins proudly.',
        labelHim: 'Back her play with a proud grin as she effortlessly roasts your buddy in five words.',
        outcomeHer:
          'His whole friend group howls laughing and instantly worships you.',
        outcomeHim:
          'Your buddies spend the next three weeks asking if she has single friends.',
        toastBanner: 'WITTY TAG-TEAM +20',
        deltas: { maturity: 15, chivalry: 15, eq: 15, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'jaguar-genx-phone-call',
    act: 2,
    stage: 1,
    allowedTiers: ['jaguar'],
    title: 'The Bold 6 PM Gen-X Phone Call Test',
    subredditThreadInspiration: 'r/CougarsAndCubs: "53F Gen-X Jaguar—please stop texting \'wyd\' at 11 AM and call me like an adult at 6 PM"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'code_switch_phone',
    setupHer:
      'At {herAge}, you are peak Gen-X: allergic to 47 work-hour meme texts, voice-note monologues, and "wyd" bubbles. It’s 6:05 PM Wednesday—how does {hisName} ({hisAge}M) bridge the communication gap?',
    setupHim:
      '{herName} ({herAge}F) told you straight up she hates all-day texting during work hours. Most guys your age panic at live phone calls—it’s 6:05 PM Wednesday.',
    choices: [
      {
        labelHer: 'He sends zero midday clutter, then rings you at 6:05 PM with a warm voice and locks in Friday dinner in four effortless minutes.',
        labelHim: 'Leave her workday undisturbed, dial her directly at 6:05 PM with a warm confident voice, hear about her day, and lock in Friday at 8.',
        outcomeHer:
          'A {hisAge}-year-old man whose phone actually makes voice calls?! Gen-X swoon unlocked in four minutes flat.',
        outcomeHim:
          'You hear the smile in her voice immediately: "You actually called—and without forty warmup texts. Friday at 8 is yours."',
        toastBanner: 'GEN-X VOICE CALL MASTERED • CHEMISTRY +25',
        deltas: { maturity: 25, chivalry: 20, eq: 15, chemistry: 25, redFlags: 0 },
        badgeUnlocked: '6 PM Voice-Call Natural',
      },
      {
        labelHer: 'He sends 14 TikTok links and three "u busy?? 👀" texts between 10 AM and 2 PM.',
        labelHim: 'Double-text memes at 10:30 AM, 12:15 PM, and 2:40 PM asking "wyd today??"',
        outcomeHer:
          'Nothing screams "unemployed nephew" louder than spamming a founder’s phone at 11:15 AM.',
        outcomeHim:
          'She puts your thread on Do Not Disturb until 2028.',
        toastBanner: 'RED FLAG! • WORK-HOUR MEME SPAM (-20)',
        deltas: { maturity: -20, chivalry: -10, eq: -15, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'He sends one crisp 5:30 PM text: "Free for a quick 5-minute call at 6 to plan Friday?"',
        labelHim: 'Send one clean 5:30 PM heads-up text, then call right at 6:00 PM.',
        outcomeHer:
          'Polite Gen-Z/Gen-X bridge—courteous and punctual.',
        outcomeHim:
          'Clean etiquette across generations; she picks up on the second ring.',
        toastBanner: 'CLEAN CALL ETIQUETTE +15',
        deltas: { maturity: 15, chivalry: 15, eq: 15, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'jaguar-pilates-core-shake',
    act: 2,
    stage: 2,
    allowedTiers: ['jaguar'],
    title: 'Reformer Pilates Humbling (His Abs Shake at Minute 4)',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Brought my 26yo gym-bro cub to Reformer Pilates and watched his soul leave his abs"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'ridge_trail_leash',
    setupHer:
      '{hisName} bench-presses plenty, so he grinned when you invited him to your 53F Jaguar Reformer Pilates session. Four minutes into slow-count hundredths on light springs, his entire core is vibrating like a tuning fork while you float effortlessly.',
    setupHim:
      'You thought Pilates was "active recovery stretching." Four minutes next to {herName} ({herAge}F), your hip flexors and abs are trembling uncontrollably while she holds a flawless plank without blinking.',
    recommendedAffiliateId: 'trail-hydration-vest',
    choices: [
      {
        labelHer: 'He laughs at himself mid-shake, stays in every slow count without quitting, and bows to your core supremacy over green smoothies after.',
        labelHim: 'Laugh through the core shake with zero gym-bro ego, finish every rep honestly, and buy post-class smoothies admitting she smoked you.',
        outcomeHer:
          'Playful humility + genuine effort + watching him admire your strength up close = electric chemistry.',
        outcomeHim:
          'Laughing at your trembling abs while admiring her form earns a very rewarding post-Pilates stretch invite.',
        toastBanner: 'PILATES HUMILITY +20 • CHEMISTRY +25',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Reformer Core Survivor',
      },
      {
        labelHer: 'He yanks heavy springs wildly with terrible form to show off, sulks when the instructor corrects him, and blames "weird girl machines."',
        labelHim: 'Sulkingly blame "weird stretching machines" and brag about your bench press in the lobby.',
        outcomeHer:
          'Fragile gym-bro ego defeated by two yellow springs? Tragic.',
        outcomeHim:
          'Insulting the machine that just humbled you in 240 seconds fools nobody.',
        toastBanner: 'RED FLAG! • FRAGILE GYM-BRO EGO (-20)',
        deltas: { maturity: -20, chivalry: -10, eq: -20, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Trade domains fairly: Pilates on Saturday, he spots your deadlift PR on Tuesday.',
        labelHim: 'Embrace being her student in Pilates Saturday, then trade spots in the weight room Tuesday.',
        outcomeHer:
          'Athletic reciprocity keeps both of you at peak game.',
        outcomeHim:
          'Mutual coaching creates unstoppable active chemistry.',
        toastBanner: 'ATHLETIC PARTNER PLAY +15',
        deltas: { maturity: 15, chivalry: 10, eq: 15, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'jaguar-lat-living-apart',
    act: 3,
    stage: 6,
    allowedTiers: ['jaguar'],
    title: 'Stage 6 Finale: "Living Apart Together" (LAT) Commitment',
    subredditThreadInspiration: 'r/CougarsAndCubs: "50s Jaguars in multi-year relationships—why Living Apart Together (LAT) is the ultimate cheat code"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'houseboy_apron',
    setupHer:
      'One year together: {hisName} has passed every test, your daughter likes him, and the love is real. Traditional scripts say "move in together"—yet at {herAge}, you spent decades earning your peaceful solo home and love keeping romance intentional.',
    setupHim:
      'A year in with {herName} ({herAge}F), you’re deeply committed. Instead of merging leases and cluttering her sanctuary, she proposes the gold-standard 50s Jaguar model: committed *Living Apart Together (LAT)*—keys exchanged, weekends & trips shared, two thriving homes 10 minutes apart.',
    choices: [
      {
        labelHer: 'Exchange keys and commit fully as exclusive LAT partners—forever date-night spark, shared adventures, and zero roommate resentment.',
        labelHim: 'Embrace committed Living Apart Together wholeheartedly—keep building your own career & apartment nearby while sharing keys, travel, and deep devotion.',
        outcomeHer:
          'All the intimacy and loyalty of a life partner, plus your pristine closets and Sunday quiet intact. Peak Jaguar bliss!',
        outcomeHim:
          'Perpetual courtship chemistry, total commitment, and both of you thriving independently and together.',
        toastBanner: 'LAT LIFEMATE UNLOCKED! • MATURITY +30',
        deltas: { maturity: 30, chivalry: 20, eq: 30, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Living Apart Together (LAT) Icon',
      },
      {
        labelHer: 'He takes LAT as a rejection and demands to break his lease and move his gaming desk into your dining room next month.',
        labelHim: 'Insist that "real couples HAVE to share one lease immediately" and push to move in next month.',
        outcomeHer:
          'Forcing a traditional escalator onto a woman who cherishes her sanctuary misses why you two worked so well.',
        outcomeHim:
          'Confusing personal space with lack of love creates unnecessary friction.',
        toastBanner: 'RED FLAG! • SANCTUARY ESCALATOR PUSH (-15)',
        deltas: { maturity: -15, chivalry: -10, eq: -20, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Do LAT for two years while planning a shared vacation cottage down the road.',
        labelHim: 'Celebrate LAT for the next two years with dedicated drawers at each place and revisit co-living only if both want it.',
        outcomeHer:
          'Flexible, pressure-free long-term horizon.',
        outcomeHim:
          'Grounded commitment with room to grow organically.',
        toastBanner: 'HARMONIOUS HORIZON +25',
        deltas: { maturity: 25, chivalry: 15, eq: 25, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'panther-black-tie-gala',
    act: 2,
    stage: 1,
    allowedTiers: ['panther'],
    title: 'Black-Tie Museum Gala & Owning Every Whisper',
    subredditThreadInspiration: 'r/CougarsAndCubs: "62F Panther walking into a formal event with my 30yo cub—watching every head turn"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'palm_springs_pool',
    setupHer:
      'You’re 62 in custom emerald velvet walking into the Palm Springs Art Museum gala with {hisName} ({hisAge}M) in a sharp tuxedo. Half the room pauses mid-champagne sip to stare.',
    setupHim:
      'Black-tie gala night beside {herName} ({herAge}F), who looks like cinema royalty. Society donors twice your age are craning their necks to figure out who the young man on her arm is.',
    recommendedAffiliateId: 'date-night-oud-bergamot',
    choices: [
      {
        labelHer: 'He keeps his phone in his tux pocket all night, holds your hand proudly through introductions, and charms the museum board with effortless poise.',
        labelHim: 'Phone stays invisible all night—offer your arm with unmistakable pride, hold eye contact with board members, and fetch her champagne before she asks.',
        outcomeHer:
          'Within twenty minutes, three women on the board pull you aside in the powder room: "Where on earth did you find him—and does he have an older brother?!"',
        outcomeHim:
          'By the auction paddle raise, every skeptic in the ballroom is charmed—and {herName} looks at you like you hung the desert moon.',
        toastBanner: 'GALA ROYALTY • CHIVALRY +25 • CHEMISTRY +25',
        deltas: { maturity: 25, chivalry: 25, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Black-Tie Panther Escort',
      },
      {
        labelHer: 'He hovers three steps behind you looking like your hired valet and scrolls sports scores under the tablecloth.',
        labelHim: 'Walk two paces behind her nervously and check your phone under the gala table.',
        outcomeHer:
          'If you look apologetic to be in the room, the room treats it like a scandal. Own it or stay home!',
        outcomeHim:
          'Shrinking at a gala turns glamour into awkwardness instantly.',
        toastBanner: 'RED FLAG! • BALLROOM SHRINKING (-20)',
        deltas: { maturity: -20, chivalry: -20, eq: -15, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Prep two key names on the car ride over so he can spark easy conversation at the table.',
        labelHim: 'Ask for a quick 2-minute briefing in the car so you remember her colleagues’ names effortlessly.',
        outcomeHer:
          'Diplomatic teamwork makes the evening seamless.',
        outcomeHim:
          'Remembering names makes a killer impression.',
        toastBanner: 'GALA DIPLOMACY +15',
        deltas: { maturity: 15, chivalry: 15, eq: 15, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'panther-protective-friends',
    act: 3,
    stage: 4,
    allowedTiers: ['panther'],
    title: 'Stage 4 Boss: Martini Interrogation With Her Fierce Lifelong Friends',
    subredditThreadInspiration: 'r/CougarsAndCubs: "60+ women—winning over protective friends who worry a younger man wants her estate"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'brunch_daughter',
    setupHer:
      'Your three fiercest lifelong girlfriends invite you and {hisName} ({hisAge}M) for martinis. Their unspoken mission: verify he isn’t chasing your desert house or breaking your heart.',
    setupHim:
      'Dinner with {herName}’s three ride-or-die friends of 30 years. Between dry martinis, her lawyer best friend asks pointedly: "So {hisName}—what exactly draws a {hisAge}-year-old man to a woman in her sixties?"',
    choices: [
      {
        labelHer: 'He answers without flinching—speaking specifically about *your* wit, warmth, and shared rhythm (never generic fetish clichés), and quietly picks up the first round of martinis.',
        labelHim: 'Answer with calm, specific sincerity about *her*—her mind, humor, and how grounded you feel together—pay your own tab cleanly, and ask thoughtful questions about their 30-year friendship.',
        outcomeHer:
          'Your lawyer best friend texts under the table before entrées arrive: "Case dismissed. He’s genuinely crazy about you."',
        outcomeHim:
          'Speaking about *her as an individual*—not "older women" as a category—wins the toughest jury in Palm Springs.',
        toastBanner: 'FIERCE FRIENDS WON OVER! • EQ +30',
        deltas: { maturity: 25, chivalry: 20, eq: 30, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Panther Inner-Circle Certified',
      },
      {
        labelHer: 'He makes a sleazy wink about "loving rich experienced cougars" while eyeing the architectural patio.',
        labelHim: 'Wink and say "Once you go silver fox/cougar you never go back, ladies!"',
        outcomeHer:
          'Your lawyer friend nearly drafts a restraining order on a cocktail napkin.',
        outcomeHim:
          'Fetishizing clichés in front of her protective best friends is instant social incineration.',
        toastBanner: 'RED FLAG! • CLICHÉ CRINGE AT THE TABLE (-25)',
        deltas: { maturity: -25, chivalry: -20, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Host cocktails on your own terrace where everyone relaxes over vinyl records.',
        labelHim: 'Help prep hors d’oeuvres and pour drinks graciously so actions speak louder than speeches.',
        outcomeHer:
          'Seeing how naturally you two move in the kitchen convinces everyone.',
        outcomeHim:
          'Quiet competence and warmth win steady trust.',
        toastBanner: 'GRACIOUS HOSTING +20',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'panther-timeline-75-45',
    act: 3,
    stage: 6,
    allowedTiers: ['panther'],
    title: 'Stage 6 Finale: "When I’m 75 and You’re 45..."',
    subredditThreadInspiration: 'r/CougarsAndCubs: "25–35 year gaps—talking honestly about aging timelines and choosing real love today"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'fertility_talk',
    setupHer:
      'Desert stars over Palm Springs. At {herAge}, with {hisName} at {hisAge}, you voice the quietest fear in your heart: "What happens in fifteen years when I’m slowing down and you’re in your prime forties?"',
    setupHim:
      'Under the desert stars, {herName} ({herAge}F) lets down every guard and asks softly what happens twelve or fifteen years from now when the age gap meets real time.',
    recommendedAffiliateId: 'after-dark-couples-deck',
    choices: [
      {
        labelHer: 'Meet the truth without fairy-tale denial—cherishing every vibrant year together with independent finances, total devotion, and zero fear.',
        labelHim: 'Hold both her hands honestly: "Nobody gets a 50-year guarantee at any age—and I wouldn’t trade ten extraordinary years loving you for fifty ordinary ones with anyone else."',
        outcomeHer:
          'Tears, laughter, and fearless clarity. Neither of you pretends time doesn’t exist—you choose an extraordinary love story right now with open hearts.',
        outcomeHim:
          'Honest, grounded, and deeply romantic—she pulls you close under the desert sky, every shadow gone.',
        toastBanner: 'LEGENDARY PANTHER DEVOTION • EQ +30 • MATURITY +30',
        deltas: { maturity: 30, chivalry: 25, eq: 30, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Timeless Desert Devotion',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He panics, changes the subject to sports, and ghosts for three days.',
        labelHim: 'Freeze up, change the subject awkwardly, and pull away out of fear.',
        outcomeHer:
          'Real Panther romance takes courage—shrinking from honest talk proves he wasn’t ready for the deep end.',
        outcomeHim:
          'Running from vulnerability breaks trust right at the summit.',
        toastBanner: 'RED FLAG! • EMOTIONAL FLIGHT (-25)',
        deltas: { maturity: -25, chivalry: -15, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Keep finances cleanly independent so everyone knows the bond is 100% heart and choice.',
        labelHim: 'Pair emotional devotion with clean financial independence so her family & friends know your heart is pure.',
        outcomeHer:
          'Total clarity + total romance = zero family static.',
        outcomeHim:
          'Integrity and transparency build unshakeable trust.',
        toastBanner: 'PURE-HEART INTEGRITY +25',
        deltas: { maturity: 25, chivalry: 20, eq: 25, chemistry: 20, redFlags: 0 },
      },
    ],
  },

  // --- 4 STAGE 5 DOUBT EPISODES ("CAN THIS ACTUALLY WORK?") ---
  {
    id: 'doubt-puma-divorce-scar',
    act: 3,
    stage: 5,
    minigame: 'doubt_spiral',
    allowedTiers: ['lynx', 'puma'],
    title: 'Stage 5 • The Doubt: Post-Divorce Cold Feet ("Can This Actually Work?")',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Everything is amazing—why am I suddenly terrified of getting hurt by a 25-year-old and pulling away?"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'Four months in, the honeymoon rush turns into real love—and panic hits at 2 AM. You already rebuilt your life once after divorce. Watching {hisName} ({hisAge}M) sleep peacefully, a cold wave asks: *Can this actually work in real life, or will he wake up at 29 wanting a carefree girl with zero history?*',
    setupHim:
      'Everything was electric—then suddenly {herName} ({herAge}F) went quiet all Sunday. Over rain-streaked tea, she admits the doubt keeping her awake: *Can a divorced woman in her 30s and a {hisAge}-year-old man actually go the distance without breaking each other’s hearts?*',
    innerInsecurityBubble: {
      herDoubt:
        'Her 2 AM spiral: "I survived one heartbreak already. Am I crazy betting my real heart on a man who hasn’t lived through mortgages or custody storms yet?"',
      hisDoubt:
        'His 2 AM spiral: "Why is she pulling back right when it got real? Does she think I’m just her fun post-divorce chapter until a 39-year-old executive shows up?"',
    },
    recommendedAffiliateId: 'after-dark-couples-deck',
    choices: [
      {
        labelHer: 'Voice the fear instead of self-sabotaging—and let him prove through steady Tuesday reliability (not big speeches) that he’s anchored.',
        labelHim: 'Don’t get defensive—hold space for her scar, name your own fear of being seen as a rebound, and prove steadiness on unglamorous weekdays.',
        outcomeHer:
          'Naming the fear broke its spell. Instead of love-bombing promises, he showed up Tuesday with groceries, zero drama, and rock-solid calm—proving this actually works.',
        outcomeHim:
          'You didn’t argue her feelings away—you met her vulnerability with calm consistency, turning the scariest doubt wobble into deeper trust.',
        toastBanner: 'DOUBT STAGE WEATHERED! • EQ +25 • MATURITY +25',
        deltas: { maturity: 25, chivalry: 15, eq: 25, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Weathered The Doubt Together',
      },
      {
        labelHer: 'Preemptively blow it up via text ("Let’s end this before someone gets hurt") without giving him a voice.',
        labelHim: 'Snap angrily ("Fine, go date some boring 42-year-old then!") and storm out.',
        outcomeHer:
          'Self-sabotaging out of fear protects your pride for five minutes and leaves an ache for months.',
        outcomeHim:
          'Exploding when she shares her deepest fear confirms every worry she had about emotional maturity.',
        toastBanner: 'RED FLAG! • FEAR-DRIVEN SELF-SABOTAGE (-20)',
        deltas: { maturity: -20, chivalry: -15, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Slow the pace slightly for two weeks while talking openly instead of ghosting.',
        labelHim: 'Give her breathing room without pulling away—stay warm, punctual, and pressure-free.',
        outcomeHer:
          'Steady nervous-system regulation beats panic moves every time.',
        outcomeHim:
          'Calm patience proves you aren’t going anywhere when real emotions surface.',
        toastBanner: 'STEADY NERVOUS SYSTEM +15',
        deltas: { maturity: 15, chivalry: 15, eq: 20, chemistry: 10, redFlags: 0 },
      },
    ],
  },
  {
    id: 'doubt-cougar-honeymoon-cliff',
    act: 3,
    stage: 5,
    minigame: 'doubt_spiral',
    allowedTiers: ['cougar'],
    title: 'Stage 5 • The Doubt: The Wedding "+1" Reality Check ("Can This Actually Work?")',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Inside our bubble it’s magic, then a corporate gala/wedding invite arrives and the doubt hits hard"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'A heavy cream envelope lands on your island: your industry colleague’s formal wedding (`+1` RSVP due Friday). Suddenly the bedroom bubble collides with real life—career gaps, colleagues whispering, ten-year horizons—and you stare at the card wondering: *Can {herAge}F and {hisAge}M actually work out in the daylight world?*',
    setupHim:
      'You spot the unmailed wedding RSVP on {herName}’s counter with the `+1` box still blank. When you ask gently, her voice catches: *"Inside this house we’re effortless—but out there in our two completely different worlds, can this actually work?"*',
    innerInsecurityBubble: {
      herDoubt:
        'Her 2 AM spiral: "Am I fooling myself thinking hot weekend chemistry survives corporate tables, career stages, and a 15-to-20 year gap?"',
      hisDoubt:
        'His 2 AM spiral: "That blank +1 box stings—is she secretly waiting for the clock to run out on us before letting me into her real life?"',
    },
    recommendedAffiliateId: 'after-dark-couples-deck',
    choices: [
      {
        labelHer: 'Put down the armor, admit why the blank RSVP scared you, and check the "+1" box with {hisName}’s name in ink right there together.',
        labelHim: 'Meet her eyes calmly: "We don’t owe a ballroom of strangers an explanation—let’s test us in real daylight, starting with that +1 box."',
        outcomeHer:
          'Writing his name in ink felt like jumping off a cliff—and watching him beam with quiet pride proved your bubble belongs in the whole world.',
        outcomeHim:
          'She picks up the pen, writes your full name on the RSVP card, and exhales like a ten-pound weight just left her chest.',
        toastBanner: 'REAL-WORLD DOUBT CONQUERED! • MATURITY +25 • EQ +25',
        deltas: { maturity: 25, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Checked the "+1" Box in Ink',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'RSVP "Attending Solo" in secret and pretend the relationship only exists Friday after 8 PM.',
        labelHim: 'Ultimatum-spiral at midnight ("Put me on Instagram right now or we’re done!").',
        outcomeHer:
          'Keeping a devoted partner in a secret Friday-night compartment slowly poisons the real thing.',
        outcomeHim:
          'Turning vulnerable doubt into an angry midnight ultimatum blows up the bridge instead of crossing it.',
        toastBanner: 'RED FLAG! • SECRET-COMPARTMENT SPIRAL (-20)',
        deltas: { maturity: -20, chivalry: -15, eq: -20, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Bridge the worlds first with a relaxed dinner alongside your two closest work peers.',
        labelHim: 'Suggest grabbing casual drinks with two of her work friends first so the wedding feels effortless.',
        outcomeHer:
          'Smart bridge-building dissolves the scary unknown in one evening.',
        outcomeHim:
          'Low-stakes integration turns anxiety into confidence.',
        toastBanner: 'SMART WORLD-BRIDGING +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'doubt-jaguar-worlds-collide',
    act: 3,
    stage: 5,
    minigame: 'doubt_spiral',
    allowedTiers: ['jaguar'],
    title: 'Stage 5 • The Doubt: The "Am I Stealing His 20s?" Spiral',
    subredditThreadInspiration: 'r/CougarsAndCubs: "53F Jaguar—almost broke up with my amazing cub out of fear I was holding him back from someone his own age"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'Sunday sunset after seeing {hisName}’s friends post engagement parties and backpacking trips. A fierce wave of protective doubt hits your chest: you’ve already lived your 20s, raised kids, built your empire. *Can this actually work without quietly stealing milestones from him—or risking your hard-won peace?*',
    setupHim:
      'Out on the canyon overlook, {herName} ({herAge}F) goes uncharacteristically quiet—about to pull the classic noble martyr move: *"Maybe I’m being selfish keeping you when you could build a normal life with someone {hisAge}..."*',
    innerInsecurityBubble: {
      herDoubt:
        'Her 2 AM spiral: "I love him enough to let him go if loving me shrinks his life. Can two people twenty-five years apart truly want the same road?"',
      hisDoubt:
        'His 2 AM spiral: "Please don’t make decisions *for* me like I’m a kid! How do I make her see I’m choosing her with wide-open adult agency?"',
    },
    choices: [
      {
        labelHer: 'Drop the noble-martyr shield—respect {hisName}’s adult agency to choose his own life instead of deciding for him out of fear.',
        labelHim: 'Stop the martyr speech gently but firmly: "I’m a grown man, {herName}—respect me enough to let *me* decide what makes my life full. It’s you."',
        outcomeHer:
          'Hearing him claim his adult agency snapped you right out of the fear spiral. Treating him as an equal means trusting his yes.',
        outcomeHim:
          'Firm, loving clarity cuts straight through her protective armor—she pulls you close, done trying to talk you out of loving her.',
        toastBanner: 'MARTYR SPIRAL BROKEN! • MATURITY +30 • EQ +25',
        deltas: { maturity: 30, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Equal Adult Agency Certified',
      },
      {
        labelHer: 'Send a unilateral "I’m setting you free for your own good" breakup text and block replies.',
        labelHim: 'Beg desperately ("I’ll give up my friends and hobbies just don’t leave!").',
        outcomeHer:
          'Deciding what’s "best for him" unilaterally treats your partner like a child instead of an equal.',
        outcomeHim:
          'Offering to shrink your whole life validates her exact fear that the relationship costs too much!',
        toastBanner: 'RED FLAG! • AGENCY BREAKDOWN (-20)',
        deltas: { maturity: -20, chivalry: -10, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Check in explicitly every six months so both of your lives keep expanding rather than shrinking.',
        labelHim: 'Keep thriving in your own career and friendships while showing steady devotion—proving neither of you shrinks.',
        outcomeHer:
          'Seeing his life expand *because* of your love silences every doubt.',
        outcomeHim:
          'Thriving alongside her proves the partnership adds to both lives.',
        toastBanner: 'EXPANSIVE PARTNERSHIP +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'doubt-panther-real-world-gravity',
    act: 3,
    stage: 5,
    minigame: 'doubt_spiral',
    allowedTiers: ['panther'],
    title: 'Stage 5 • The Doubt: When Glamour Meets Real-World Gravity',
    subredditThreadInspiration: 'r/CougarsAndCubs: "60+ Panther—catching the flu / minor surgery made me wonder if a younger man stays when the glamour is off"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'No emerald velvet tonight: a sprained ankle and fever leave you in flannel pajamas with zero makeup and an ice pack. When {hisName} ({hisAge}M) texts that he’s heading over, a sharp doubt hits: *Anyone loves a Panther over Palm Springs martinis—can this actually work when real-life vulnerability walks in?*',
    setupHim:
      '{herName} ({herAge}F) twisted her ankle and caught a nasty chill—and suddenly tells you *"Don’t come over this week, wait till I’m presentable."* You can hear the real fear underneath: *Does a younger man stay when the silver-screen glamour turns off?*',
    innerInsecurityBubble: {
      herDoubt:
        'Her 2 AM spiral: "If he sees me tired, mortal, and unglamorous, does the spell break right here?"',
      hisDoubt:
        'His 2 AM spiral: "She thinks I’m only in love with an untouchable icon—how do I show her I love the real human woman underneath?"',
    },
    choices: [
      {
        labelHer: 'Unlock the front door in your flannel pajamas—let him bring homemade soup, swap the ice pack, and see the real woman behind the icon.',
        labelHim: 'Show up softly with homemade lemon-ginger soup, fresh tea, and zero fuss—making her laugh in flannel pajamas with unmistakable tenderness.',
        outcomeHer:
          'Watching a {hisAge}-year-old man tuck a blanket over your ankle and look at you with even deeper adoration in zero makeup answered "Can this work?" forever.',
        outcomeHim:
          'Letting her rest without needing to perform "glamorous Panther" sealed a deeper intimacy than ten black-tie galas ever could.',
        toastBanner: 'UNCONDITIONAL REALNESS +30 • EQ +30',
        deltas: { maturity: 30, chivalry: 25, eq: 30, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Beyond-Glamour Devotion',
      },
      {
        labelHer: 'Lock him out coldly for two weeks pretending nothing is ever hard.',
        labelHim: 'Ghost until next weekend ("Text me when you’re back up for drinks!").',
        outcomeHer:
          'If you never let him show up on a hard Tuesday, the relationship stays trapped as theater.',
        outcomeHim:
          'Vanishing the second date night isn’t glamorous proves her worst fear right.',
        toastBanner: 'RED FLAG! • FAIR-WEATHER FANTASY ONLY (-25)',
        deltas: { maturity: -25, chivalry: -25, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Start by letting him drop off soup on the patio and stay for twenty quiet minutes.',
        labelHim: 'Respect her space gently—drop warm soup and flowers inside the foyer with a sweet note and zero pressure.',
        outcomeHer:
          'Gentle care without crowding melts the armor naturally.',
        outcomeHim:
          'Thoughtful care without intruding builds deep safety.',
        toastBanner: 'TENDER PATIENCE +20',
        deltas: { maturity: 20, chivalry: 25, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },

  // --- 5 CHILD-FREE DIVORCED DOG-MOM PUMA EPISODES (JADED BY 40YO PEER MEN) ---
  {
    id: 'puma-dog-park-vetting',
    act: 2,
    stage: 1,
    allowedTiers: ['lynx', 'puma'],
    requiredAnyTags: ['dog_mom_divorced'],
    title: 'The Rescue-Dog Patio Vetting & Why She Quit Dating Men Her Own Age',
    subredditThreadInspiration: 'r/CougarsAndCubs: "37F divorced & child-free—men my age just ranted about their ex-wives, then a 26yo won over my rescue dog in 30 seconds"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'trader_joes_aisle',
    setupHer:
      'After divorcing your ex and enduring three bleak Hinge dates with 41-year-old men who ranted about crypto and their ex-wives, you lowered your age slider to {hisAge}. Test #1 at the sunlit wine patio: your scruffy rescue dog **Barnaby**, who barks at 80% of men in finance vests.',
    setupHim:
      '{herName} ({herAge}F) admits with a dry smile she only lowered her age filter because men her age kept trauma-dumping over IPAs. Under the table, her rescue mutt **Barnaby** is sniffing your shoes with full veto power.',
    choices: [
      {
        labelHer: 'He crouches calmly to let Barnaby sniff his hand first, asks the waiter for a water bowl before ordering wine, and brings refreshing zero-bitterness curiosity about you.',
        labelHim: 'Crouch to let Barnaby come to you on his terms, ask the server for a fresh dog bowl first, and bring warm, zero-baggage curiosity all evening.',
        outcomeHer:
          'Barnaby flops onto {hisName}’s loafers within four minutes—and hearing a man ask thoughtful questions instead of complaining about his 2019 divorce feels like pure oxygen.',
        outcomeHim:
          'Barnaby rests his chin on your shoe while {herName} blinks in disbelief: "Okay, you just beat every 42-year-old man in this zip code in six minutes."',
        toastBanner: 'BARNABY APPROVED! • CHIVALRY +20 • CHEMISTRY +25',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Barnaby Veto-Proof Certified',
      },
      {
        labelHer: 'He ignores Barnaby, complains about his ex-situationship for 35 minutes, and calls you "low-baggage since you don’t have kids."',
        labelHim: 'Ignore the dog and spend forty minutes ranting about your toxic ex-girlfriend.',
        outcomeHer:
          'Great—the exact bitter monologue you fled 42-year-old Hinge men to escape, just in younger sneakers.',
        outcomeHim:
          'Barnaby growls softly, and she finishes her rosé in record time.',
        toastBanner: 'RED FLAG! • BARNABY VETO & EX-RANT (-20)',
        deltas: { maturity: -20, chivalry: -15, eq: -20, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Take Barnaby on a sunset neighborhood walk together before grabbing patio tapas.',
        labelHim: 'Suggest a 20-minute sunset dog walk together first so Barnaby warms up naturally.',
        outcomeHer:
          'Side-by-side dog-walk banter melts first-date skepticism effortlessly.',
        outcomeHim:
          'Smart move—walking with Barnaby makes conversation flow naturally.',
        toastBanner: 'PACK WALK CHEMISTRY +15',
        deltas: { maturity: 15, chivalry: 15, eq: 15, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'puma-weaponized-incompetence-test',
    act: 2,
    stage: 3,
    allowedTiers: ['lynx', 'puma'],
    requiredAnyTags: ['dog_mom_divorced', 'jaded_peer_men'],
    title: 'Zero Weaponized Incompetence: The 7:30 AM Drizzle Dog-Walk Test',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Divorced my 39yo ex over weaponized incompetence—nearly cried when my 25yo cub walked my dog in the rain without waking me"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'houseboy_apron',
    setupHer:
      'Your marriage ended because a 39-year-old man couldn’t locate trash bags or walk the dog without a 12-step tutorial. It’s 7:30 AM Sunday, pouring rain outside, and you wake up braced to haul Barnaby out—only to notice {hisName}’s side of the bed is already empty.',
    setupHim:
      '7:15 AM Sunday drizzle at {herName}’s townhouse. Barnaby taps his leash by the bedroom door. You know her 40-year-old ex-husband traumatized her with helpless man-child excuses—what’s your move?',
    recommendedAffiliateId: 'houseboy-linen-apron',
    choices: [
      {
        labelHer: 'Come downstairs to find Barnaby already walked, paws towel-dried, food bowl filled, and fresh espresso waiting—zero questions asked, zero gold-star begging.',
        labelHim: 'Slip out quietly with Barnaby in the rain, towel-dry all four muddy paws at the mat, refill his kibble, and have hot coffee waiting when she wakes up.',
        outcomeHer:
          'You stand on the bottom stair genuinely misty-eyed. A {hisAge}-year-old man just demonstrated more domestic competence before 8 AM than your ex-husband managed in five years.',
        outcomeHim:
          'She stares at Barnaby’s clean paws and the steaming mug like she’s witnessing a miracle—and pulls you straight back upstairs.',
        toastBanner: 'WEAPONIZED INCOMPETENCE CURED! • CHIVALRY +25 • EQ +25',
        deltas: { maturity: 25, chivalry: 25, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Muddy-Paws & Morning Coffee Hero',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He pokes your shoulder at 7:15 AM: "Babe your dog is whining—also where do you keep mugs, spoons, and water?"',
        labelHim: 'Wake her up asking where the leash, towel, coffee mugs, and spoons live.',
        outcomeHer:
          'Instant ex-husband PTSD flashback. You have cabinets with doors, not a CIA vault!',
        outcomeHim:
          'Asking four helpless questions before coffee triggers instant ex-husband flashbacks.',
        toastBanner: 'RED FLAG! • MAN-CHILD FLASHBACK (-20)',
        deltas: { maturity: -25, chivalry: -20, eq: -15, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Walk Barnaby together under a shared umbrella and grab warm croissants down the block.',
        labelHim: 'Brew coffee first, then invite her on a cozy shared-umbrella walk to the corner bakery with Barnaby.',
        outcomeHer:
          'Teamwork + warm croissants = elite Sunday morning.',
        outcomeHim:
          'Thoughtful initiative with cozy couple energy.',
        toastBanner: 'RAINY BAKERY RUN +15',
        deltas: { maturity: 15, chivalry: 15, eq: 15, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'puma-brunch-cynical-peers',
    act: 3,
    stage: 4,
    allowedTiers: ['lynx', 'puma'],
    requiredAnyTags: ['dog_mom_divorced', 'jaded_peer_men'],
    title: 'Stage 4 Boss: Patio Brunch With Her Jaded 38F Divorcee Besties',
    subredditThreadInspiration: 'r/CougarsAndCubs: "My late-30s divorced friends hate 42yo Hinge men—yet roasted me for dating a 26yo until brunch"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'brunch_daughter',
    setupHer:
      'Dog-friendly patio brunch with Barnaby under the table and your two blunt 38-year-old divorced girlfriends across from {hisName} ({hisAge}M). Both just survived terrible dates with 44-year-old finance bros—and arch their eyebrows: *"Girl, you swore off man-children and went younger?!"*',
    setupHim:
      'Patio mimosas with {herName}’s two razor-sharp divorced best friends (38F). They’re deeply cynical about men *their* age—and doubly skeptical about what a {hisAge}-year-old brings to the table.',
    choices: [
      {
        labelHer: 'He laughs warmly without trying too hard, sneaks Barnaby an approved ice cube, listens to their Hinge horror stories with sharp wit, and quietly covers the table’s mimosa pitcher.',
        labelHim: 'Bring easy warmth, zero defensive posturing, keep Barnaby happy beside your chair, match their dry humor, and pick up the mimosa pitcher smoothly.',
        outcomeHer:
          'Before the check lands, both girlfriends text your side-chat: *"WAIT. Should WE be lowering our Hinge age filters to 26?!"*',
        outcomeHim:
          'By noon, both of her cynical best friends are asking if you have single friends from physical therapy school.',
        toastBanner: 'CYNICAL BESTIES CONVERTED! • EQ +25 • CHIVALRY +20',
        deltas: { maturity: 25, chivalry: 20, eq: 25, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Converted Her Hinge-Jaded Besties',
      },
      {
        labelHer: 'He lectures two 38-year-old women about why "men in their 40s are actually peak high-value alphas" from a podcast he heard.',
        labelHim: 'Quote a red-pill dating podcast at two divorced 38-year-old women.',
        outcomeHer:
          'Even Barnaby puts his paws over his ears under the table. Immediate exile.',
        outcomeHim:
          'Quoting podcast bro science at brunch gets you roasted into another dimension.',
        toastBanner: 'RED FLAG! • PODCAST BRO CRINGE (-25)',
        deltas: { maturity: -25, chivalry: -20, eq: -25, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Meet at the off-leash dog beach first so everyone bonds casually before sitting down.',
        labelHim: 'Start with a breezy dog-beach coffee walk so her friends see you two in action naturally.',
        outcomeHer:
          'Action beats interrogation—watching how good he is with Barnaby wins them over fast.',
        outcomeHim:
          'Relaxed dog-beach setting lets genuine chemistry shine.',
        toastBanner: 'DOG-BEACH CHARM +15',
        deltas: { maturity: 15, chivalry: 15, eq: 15, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'doubt-puma-peer-cynicism',
    act: 3,
    stage: 5,
    minigame: 'doubt_spiral',
    allowedTiers: ['lynx', 'puma'],
    requiredAnyTags: ['dog_mom_divorced', 'jaded_peer_men'],
    title: 'Stage 5 • The Doubt: Waiting for the Mask to Drop ("Can He Really Be Different?")',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Divorced & jaded by men my age—my 26yo cub treats me so well my brain keeps waiting for the catch"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'Five months in, {hisName} ({hisAge}M) remembers your coffee order, adores Barnaby, and never plays games—and paradoxically, *that’s* what triggers your 2 AM doubt spiral. Your ex-husband was charming in month five too, and every 41-year-old peer you dated disappointed you. *Can this actually work, or are you about to get blindsided again?*',
    setupHim:
      'Nothing went wrong—yet {herName} ({herAge}F) suddenly gets guarded after an amazing weekend. Over late-night wine with Barnaby curled between you, she confesses: *"Men my own age burned me so badly I keep waiting for the catch with us. Can this actually last?"*',
    innerInsecurityBubble: {
      herDoubt:
        'Her 2 AM spiral: "When a 40-year-old man couldn’t show up as an equal partner, am I naive believing a {hisAge}-year-old won’t eventually get restless or lazy?"',
      hisDoubt:
        'His 2 AM spiral: "She’s bracing for me to turn into her ex-husband—how do I earn real trust without paying for sins committed by bitter 42-year-old dudes?"',
    },
    recommendedAffiliateId: 'after-dark-couples-deck',
    choices: [
      {
        labelHer: 'Own your jaded armor honestly instead of testing him with traps—judging {hisName} by his own six months of steady actions rather than your ex’s ghosts.',
        labelHim: 'Respond with grounded warmth and clear boundaries: "You don’t have to trust promises—just look at who I’ve been every week, and let me be *me*, not your ex."',
        outcomeHer:
          'Separating old divorce scar tissue from the devoted man right in front of you lifted the fog completely. Good partnership isn’t an age—it’s character.',
        outcomeHim:
          'Gentle empathy paired with self-respect melted her cynicism—she stops waiting for the other shoe to drop and leans all the way in.',
        toastBanner: 'CYNICISM MELTED! • EQ +30 • MATURITY +25',
        deltas: { maturity: 25, chivalry: 20, eq: 30, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Unlearned Peer Cynicism',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'Pick a random fight to test whether he leaves like everyone else.',
        labelHim: 'Get bitter back ("All divorced women just project their ex onto new guys!").',
        outcomeHer:
          'Manufacturing tests punishes the one guy who actually showed up cleanly.',
        outcomeHim:
          'Throwing her divorce in her face confirms every cynical instinct she had.',
        toastBanner: 'RED FLAG! • CYNICISM SPIRAL (-20)',
        deltas: { maturity: -20, chivalry: -15, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Create a simple Sunday check-in ritual so minor worries get voiced before becoming spirals.',
        labelHim: 'Propose a 10-minute Sunday dog-walk check-in where anything unspoken gets aired safely.',
        outcomeHer:
          'Transparent communication habits replace hypervigilance with peace.',
        outcomeHim:
          'Walking Barnaby while checking in keeps communication effortless.',
        toastBanner: 'HEALTHY CHECK-IN RITUAL +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'puma-dogmom-dink-future',
    act: 3,
    stage: 6,
    allowedTiers: ['lynx', 'puma'],
    requiredAnyTags: ['dog_mom_divorced'],
    title: 'Stage 6 Finale: The Child-Free Dog-Pack & Passport Future',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Child-free 37F + 26M cub—choosing a rescue-dogs, travel & zero-kids life with eyes wide open"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'palm_springs_pool',
    setupHer:
      'One year together: Barnaby adores him, your jaded friends are converts, and you survived the Doubt stage. At {herAge}, you love your child-free freedom—traveling on a whim, sleeping in after dog walks, zero diaper plans. Time for the ultimate Stage 6 alignment with {hisName} ({hisAge}M).',
    setupHim:
      'One year with {herName} ({herAge}F) and Barnaby: deeply in love and looking ahead. She’s happily child-free for life—passports, weekend road trips, maybe rescue dog #2—and wants 100% certainty you want that exact future too.',
    choices: [
      {
        labelHer: 'Lock in the Child-Free DINK + Rescue-Dog Pact—booking Lisbon in October and agreeing Barnaby gets a little rescue sister next spring!',
        labelHim: 'Choose the child-free passport + dog-pack life enthusiastically: "Two careers, full freedom, Lisbon in the fall, and rescue dog #2—that’s my dream life with you."',
        outcomeHer:
          'Zero suburban pressure, zero peer bitterness—just an extraordinary, sunlit, dog-hair-and-boarding-passes partnership.',
        outcomeHim:
          'Barnaby barks right on cue as she kisses you—officially sealing the happiest child-free power couple in the Club.',
        toastBanner: 'DINK + DOG-PACK LIFEMATES! • MATURITY +30 • CHEMISTRY +30',
        deltas: { maturity: 30, chivalry: 20, eq: 25, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Child-Free Dog-Pack Lifemate',
      },
      {
        labelHer: 'He secretly hopes you’ll "change your mind about babies at 39" despite everything you said.',
        labelHim: 'Say yes now while secretly assuming she’ll change her mind and want kids in two years.',
        outcomeHer:
          'Never date someone hoping to rewrite their core life design.',
        outcomeHim:
          'Hidden agendas break child-free trust—honesty today beats resentment tomorrow.',
        toastBanner: 'RED FLAG! • HIDDEN KID AGENDA (-25)',
        deltas: { maturity: -25, chivalry: -15, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'If fatherhood is truly non-negotiable for him, part with deep gratitude before anyone compromises their truth.',
        labelHim: 'If you realize you truly want biological kids someday, tell her with total love and honesty now.',
        outcomeHer:
          'Honoring both truths cleanly proves real emotional maturity—zero bitterness, lifelong respect.',
        outcomeHim:
          'Total integrity and tenderness, even when life paths diverge.',
        toastBanner: 'HONEST INTEGRITY +25',
        deltas: { maturity: 25, chivalry: 15, eq: 25, chemistry: 10, redFlags: 0 },
      },
    ],
  },

  // --- 6 SUB-10-YEAR "JUNIOR COUGAR" (e.g. 6-YEAR GAP) EPISODES ---
  {
    id: 'junior-cougar-gatekeeper-tease',
    act: 2,
    stage: 1,
    maxAgeGap: 9,
    title: 'The 6-Year "Junior Cougar" Permit & 2008 High-School Math',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Does a 6-year gap count?! Subreddit purists call me a Junior Cougar, yet I was in college while he was in 9th grade!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    setupHer:
      'At {herAge}F and {hisAge}M, strict subreddit gatekeepers say you’re shy of the 10-year cutoff—officially dubbing you a **Junior Cougar**. Halfway through Date #1 cocktails, you do the inevitable calendar math and gasp: *"Wait... when I graduated college, you were taking sophomore geometry?!"*',
    setupHim:
      '{herName} ({herAge}F) is {hisAge}-year-old you’s dream match—only a 6-to-8 year gap, so nobody stares in public, yet she suddenly squints across her cocktail doing 2008 age math: *"Hold on, did you have a bedtime while I was at rooftop bars?!"*',
    choices: [
      {
        labelHer: 'He grins without missing a beat: "Hey, I studied extra hard just to catch up to your Junior Cougar standards—and tonight’s round is on the kid."',
        labelHim: 'Lean right into the playful Junior Cougar banter: "Hey, I grew up fast just to make this reservation—let me earn your Junior Cougar learner’s permit properly."',
        outcomeHer:
          'Playful, confident, zero weirdness! All the flirty older-woman/younger-man spark without needing a 20-year gap.',
        outcomeHim:
          'She bursts out laughing, clinks your glass, and officially embraces her Junior Cougar era.',
        toastBanner: 'JUNIOR COUGAR SPARK! • CHEMISTRY +25 • CHIVALRY +15',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Official Junior Cougar Certified',
      },
      {
        labelHer: 'He gets weird and defensive: "Six years is basically the exact same age, except women age faster according to podcasts."',
        labelHim: 'Say "Six years barely counts—though podcasts say women peak earlier anyway."',
        outcomeHer:
          'You nearly throw your orange peel twist at his forehead. Date over before appetizers!',
        outcomeHim:
          'Congratulations on speed-running getting blocked over a 6-year gap.',
        toastBanner: 'RED FLAG! • NEGGING INSTANT FAIL (-25)',
        deltas: { maturity: -25, chivalry: -25, eq: -25, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Compare your exact 2009 playlists and laugh over how close—yet hilariously different—six years feels.',
        labelHim: 'Swap stories of where you both were in 2009 over appetizers.',
        outcomeHer:
          'Peak micro-generational comedy and effortless first-date warmth.',
        outcomeHim:
          'Easy laughter builds instant comfort.',
        toastBanner: '2009 MATH BANTER +15',
        deltas: { maturity: 15, chivalry: 10, eq: 15, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'junior-cougar-micro-gen-overlap',
    act: 2,
    stage: 2,
    maxAgeGap: 9,
    title: 'AIM Away Messages vs. Vine: The 6-Year Micro-Gen Sweet Spot',
    subredditThreadInspiration: 'r/CougarsAndCubs: "6-year Junior Cougar perk: his friends call me a Cougar while my 48F friends say he’s practically my twin"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'code_switch_phone',
    setupHer:
      'Road-trip playlist battle: with a sub-10-year Junior Cougar gap, you share 80% of references—until you mention crafting passive-aggressive AIM Away Messages on dial-up while {hisName} ({hisAge}M) quotes 2014 Vines and admits his buddies still call you "his hot Cougar."',
    setupHim:
      'Driving up the coast with {herName} ({herAge}F): your buddies tease you for "bagging a Cougar," while her older friends laugh that a 6-year gap is "training wheels." Then she puts on LCD Soundsystem and tests your cultural literacy.',
    choices: [
      {
        labelHer: 'Blend the best of both micro-generations—he queues a killer shared indie/R&B mix, owns calling you his dream woman (not a gimmick), and nails parallel parking.',
        labelHim: 'Build a seamless shared road-trip queue, laugh at both friend groups’ teasing, and treat her like a total catch rather than an age-gap punchline.',
        outcomeHer:
          'Close enough to sing every chorus together, just enough gap to keep the banter razor-sharp.',
        outcomeHim:
          'Best road trip all year—shared nostalgia plus undeniable Junior Cougar electricity.',
        toastBanner: 'MICRO-GEN HARMONY +20 • CHEMISTRY +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 20, redFlags: 0 },
      },
      {
        labelHer: 'He calls your 30s cultural references "ancient grandma lore" every ten minutes till the joke dies.',
        labelHim: 'Run the "okay grandma" joke into the ground forty times before exit 12.',
        outcomeHer:
          'One playful tease is cute; forty "grandma" jokes when I’m literally six years older than you is obnoxious.',
        outcomeHim:
          'Beating one age joke to death kills the road-trip vibe.',
        toastBanner: 'RED FLAG! • OVERCOOKED GRANDMA JOKE (-15)',
        deltas: { maturity: -15, chivalry: -15, eq: -15, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Trade one formative album each so you unlock each other’s college years.',
        labelHim: 'Swap your #1 college albums back-to-back on the highway.',
        outcomeHer:
          'Sweet, curious, and surprisingly romantic.',
        outcomeHim:
          'Great conversation and zero dead air.',
        toastBanner: 'SHARED SOUNDTRACK +15',
        deltas: { maturity: 15, chivalry: 10, eq: 15, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'junior-cougar-condo-vs-lease',
    act: 2,
    stage: 3,
    maxAgeGap: 9,
    title: 'Her Le Creuset Condo Era vs. His "Six Years Behind" Career Sprint',
    subredditThreadInspiration: 'r/CougarsAndCubs: "In a 6-year gap he isn’t in a frat dorm, just 6 years earlier on the homeowner/career curve"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'bathroom_audit',
    setupHer:
      'In a 6-year Junior Cougar matchup, {hisName} ({hisAge}M) isn’t sleeping on a bare dorm mattress—he has a real job and decent apartment, yet your 6-year head start shows: custom linen drapes, Dutch ovens, maxing retirement, and hosting dinner parties instead of pre-games.',
    setupHim:
      'You’re doing solid for {hisAge}—until you step into {herName}’s ({herAge}F) sunlit place with framed art, French cookware, and real equity. That subtle 6-year life-stage lead hits right in the pride.',
    recommendedAffiliateId: 'hosting-lidded-bin-soap',
    choices: [
      {
        labelHer: 'He admires what you built with zero insecurity, upgrades his own hosting game, and brings killer ingredients + knife skills to your Le Creuset.',
        labelHim: 'Celebrate her taste with zero bruised pride, level up your own apartment touches, and show up Friday with farmer’s-market halibut to cook together.',
        outcomeHer:
          'A man six years younger who treats your success as inspiration—not competition—is Junior Cougar perfection.',
        outcomeHim:
          'Confidence + domestic teamwork turns a 6-year lifestyle head start into shared luxury.',
        toastBanner: 'HOMEOWNER-ERA SYNERGY • MATURITY +25',
        deltas: { maturity: 25, chivalry: 20, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Le Creuset Co-Chef Approved',
      },
      {
        labelHer: 'He nitpicks your decor out of subtle financial insecurity ("Must be nice having 6 extra years of compounding").',
        labelHim: 'Make passive-aggressive digs about her having a 6-year career head start.',
        outcomeHer:
          'Resenting six calendar years of hard work drains all the warmth out of the room.',
        outcomeHim:
          'Passive-aggressive money math poisons a great night.',
        toastBanner: 'RED FLAG! • 6-YEAR HEAD-START ENVY (-20)',
        deltas: { maturity: -20, chivalry: -15, eq: -20, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Alternate weekends between your cozy condo and exploring new spots in his neighborhood.',
        labelHim: 'Alternate hosting: cozy dinner at hers Friday, neighborhood jazz spot near yours Tuesday.',
        outcomeHer:
          'Balanced rhythm that honors both spaces.',
        outcomeHim:
          'Equal initiative keeps the dynamic fresh.',
        toastBanner: 'BALANCED RHYTHM +15',
        deltas: { maturity: 15, chivalry: 15, eq: 15, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'junior-cougar-wedding-season-marathon',
    act: 3,
    stage: 4,
    maxAgeGap: 9,
    title: 'Stage 4 Boss: Surviving His Cohort’s 7-Wedding Open-Bar Summer',
    subredditThreadInspiration: 'r/CougarsAndCubs: "6-year gap reality: I survived my friends’ wedding wave at 31—now at 38 I’m back in his friends’ chaotic groomsmen summer!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'thanksgiving_table',
    setupHer:
      'Nobody talks about this 6-year Junior Cougar hazard: you retired from 8-wedding summers five years ago, and suddenly {hisName} ({hisAge}M) is a groomsman in FOUR chaotic open-bar weddings this summer where his buddies are doing tequila shots at 11:30 PM.',
    setupHim:
      'Your entire {hisAge}M friend group is getting married this summer. {herName} ({herAge}F) looks stunning as your `+1`, though she already graduated from sloppy groomsmen open-bar marathons years ago—how do you navigate Wedding #3?',
    choices: [
      {
        labelHer: 'He crushes groomsman duties early, skips sloppy shot-roulette, keeps water + espresso martinis in your hand, twirls you on the dance floor, and calls the car at 10:45 PM before chaos peaks.',
        labelHim: 'Handle groomsman photos early, skip the messy tequila shots, tear up the dance floor with her for three great songs, and whisk her back to the hotel suite at 10:45 PM.',
        outcomeHer:
          'All the romance of wedding season, zero 1 AM shuttle-bus sloppiness—every bride’s older sister asks where you found him!',
        outcomeHim:
          'Leaving right at peak vibe makes the hotel suite afterparty ten times better than messy 1 AM sliders.',
        toastBanner: 'WEDDING-SEASON MVP! • CHIVALRY +25 • EQ +20',
        deltas: { maturity: 25, chivalry: 25, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Groomsmen-Summer Gentleman',
      },
      {
        labelHer: 'He abandons you at Table 9 for three hours to chug Jaegerbombs with the groomsmen.',
        labelHim: 'Disappear with the groomsmen for three hours and stumble back slurring at midnight.',
        outcomeHer:
          'Watching a grown man revert to 22-year-old frat-formal chaos makes six years feel like twenty-six.',
        outcomeHim:
          'Stranding your date at Table 9 while doing shots is an instant relationship crisis.',
        toastBanner: 'RED FLAG! • TABLE-9 ABANDONMENT (-25)',
        deltas: { maturity: -25, chivalry: -25, eq: -20, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Attend the two closest weddings together and let him fly solo to the rowdy out-of-state bachelor weekend.',
        labelHim: 'Curate the calendar together: bring her to the two gorgeous weddings, spare her the rowdy college-roommate one.',
        outcomeHer:
          'Selective attendance saves your PTO and your heels!',
        outcomeHim:
          'Protecting her weekends earns huge gratitude.',
        toastBanner: 'SELECTIVE RSVP GENIUS +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'doubt-junior-cougar-timeline-sync',
    act: 3,
    stage: 5,
    minigame: 'doubt_spiral',
    maxAgeGap: 9,
    title: 'Stage 5 • The Doubt: The 6-Year Clock Offset ("Are We Six Years Out of Sync?")',
    subredditThreadInspiration: 'r/CougarsAndCubs: "In a 6-year Junior Cougar gap, timelines are close enough to collide—what if I’m ready now and he wants 4 more years?"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'Here is the uniquely sharp **Junior Cougar Doubt**: in a 25-year gap, timelines are completely decoupled—in a 6-year gap ({herAge}F × {hisAge}M), you’re close enough to want the *same* big milestones, just offset by six crucial years. At 2 AM you wonder: *Can this actually work if I’m ready for real life-building now and his internal clock thinks he has till 37?*',
    setupHim:
      'Late-night kitchen talk with {herName} ({herAge}F): because you’re only six years apart, the future feels vivid and real—and suddenly terrifying. She admits her fear: *"Six years isn’t huge on paper, until my right-now collides with your someday. Can we actually sync up without resentment?"*',
    innerInsecurityBubble: {
      herDoubt:
        'Her 2 AM spiral: "I don’t want to pressure him six years ahead of his pace—and I can’t afford to drift for four years waiting for him to feel ready."',
      hisDoubt:
        'His 2 AM spiral: "Does she think being six years younger means I’m dragging my feet? What if I step up now and still feel like I’m playing catch-up?"',
    },
    recommendedAffiliateId: 'after-dark-couples-deck',
    choices: [
      {
        labelHer: 'Put concrete numbers on the table together—discovering that meeting in the middle (12–18 months, zero vague drifting) excites both of you.',
        labelHim: 'Replace vague "someday" talk with a real shared timeline: "I don’t need six extra years—when you find the right person, you sync watches together."',
        outcomeHer:
          'All the 2 AM math anxiety vanished the moment he put real dates on the calendar willingly. Synced watches beat identical birth years every time.',
        outcomeHim:
          'Stepping forward with concrete timeline clarity turned the 6-year offset into a shared countdown.',
        toastBanner: 'WATCHES SYNCED! • MATURITY +30 • EQ +25',
        deltas: { maturity: 30, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Synced-Watches Junior Cougar',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'Silently resent the 6-year offset while dropping passive-aggressive hints at every wedding.',
        labelHim: 'Stall vaguely ("Ask me again in three or four years, there’s no rush!").',
        outcomeHer:
          'Unspoken timeline resentment turns a sweet 6-year gap into a ticking clock.',
        outcomeHim:
          'Telling a woman in her late 30s "ask me in four years" shatters trust overnight.',
        toastBanner: 'RED FLAG! • TIMELINE DRIFT SPIRAL (-20)',
        deltas: { maturity: -20, chivalry: -15, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Map out your next 12 months together—shared trip, meeting parents, and clear milestone check-ins.',
        labelHim: 'Lay out three concrete next steps over the next 12 months so momentum is unmistakable.',
        outcomeHer:
          'Visible momentum quiets midnight doubts fast.',
        outcomeHim:
          'Clear action steps prove real commitment.',
        toastBanner: '12-MONTH MOMENTUM +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'junior-cougar-sweet-spot-future',
    act: 3,
    stage: 6,
    maxAgeGap: 9,
    title: 'Stage 6 Finale: The "Junior Cougar Sweet Spot" Lifemate Pact',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Why my 6-year Junior Cougar marriage ended up being the ultimate relationship cheat code"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'palm_springs_pool',
    setupHer:
      'Six stages cleared: you laughed through 2008 geometry math, survived his friends’ wedding marathon, and synced watches through the Doubt stage. Just like **Miley Cyrus marrying her 6-year Junior Cougar Cub Maxx Morando** in Palm Springs, you’ve unlocked modern dating’s secret sweet-spot cheat code.',
    setupHim:
      'Standing on the terrace with {herName} ({herAge}F): six years older, wiser, magnetic, and completely in lockstep with you ({hisAge}M)—channeling peak **Miley & Maxx Morando** 6-year newlywed harmony. How do you seal Stage 6?',
    choices: [
      {
        labelHer: 'Go all-in on the Junior Cougar Sweet Spot—combining her hard-won wisdom & standards with his fresh energy for decades of side-by-side adventures!',
        labelHim: 'Seal the commitment proudly: "Purists can call it Junior Cougar all they want—six years with you is the best cheat code on earth."',
        outcomeHer:
          'Shared references, zero public static, electric teasing for the next forty years, and aligned longevity. Junior Cougar Hall of Fame!',
        outcomeHim:
          'She kisses you grinning: "Learner’s permit upgraded to lifetime pass."',
        toastBanner: 'JUNIOR COUGAR LIFEMATES! • CHEMISTRY +30 • MATURITY +30',
        deltas: { maturity: 30, chivalry: 25, eq: 25, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Junior Cougar Sweet-Spot Lifemate',
      },
      {
        labelHer: 'Keep score over who hit which milestone at what age during every minor disagreement.',
        labelHim: 'Pull rank or blame every disagreement on the 6-year difference.',
        outcomeHer:
          'Scorekeeping turns a 6-year spark into petty competition.',
        outcomeHim:
          'Blaming normal couple moments on age misses the point.',
        toastBanner: 'RED FLAG! • PETTY SCOREKEEPING (-20)',
        deltas: { maturity: -20, chivalry: -15, eq: -20, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Move forward into shared home/future planning while keeping Friday date nights sacred.',
        labelHim: 'Start planning your next chapter together while keeping playful Date #1 banter alive.',
        outcomeHer:
          'Intentional growth + lasting flirtation = winning formula.',
        outcomeHim:
          'Grounded future with nonstop spark.',
        toastBanner: 'FOREVER COURTSHIP +25',
        deltas: { maturity: 25, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
      },
    ],
  },

  // --- 5 HORMONAL REAL-TALK, BENCH-PRESS TRAINING, STEAMY TEXTS & "SISTER'S AGE!!" SHOCK EPISODES ---
  {
    id: 'cub-bench-press-cougar-training',
    act: 2,
    stage: 2,
    minigame: 'bench_press',
    title: 'Cubs at the Bench Press: Pumping 225 Just to Keep His Cougar',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Started hitting bench press, hip thrusts & core 5x/week solely because my Cougar is in her prime and deserves to be picked up"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'ridge_trail_leash',
    setupHer:
      'Thursday, 5:45 PM. You sent {hisName} ({hisAge}M) one dangerously steamy text during your afternoon coffee break (*"Wear that fitted henley tomorrow... and bring your A-game 🔥"*). Ten minutes later he sends a gym rack photo: he’s literally training chest, core, and legs like an Olympian just to keep up with you.',
    setupHim:
      'Your phone buzzes mid-workout with a wickedly flirty text from {herName} ({herAge}F) about tomorrow night. Your gym bro asks why you’re suddenly repping 225 on bench AND doing Bulgarian split squats on a Thursday. Simple: a woman in her prime requires peak upper-body & core strength!',
    recommendedAffiliateId: 'adjustable-dumbbell-bench',
    choices: [
      {
        labelHer: 'He crushes clean strength reps (zero ego injury), texts back slow-burn heat that makes you blush in traffic, and effortlessly scoops you off your feet Friday night.',
        labelHim: 'Lock in clean bench + core reps, send back one devastatingly smooth slow-burn text ("Already training for tomorrow—keep 8 PM wide open"), and sweep her up at the door Friday.',
        outcomeHer:
          'When he picks you up effortlessly in the hallway Friday night without even breathing hard, every gym rep pays off with interest... [Fade to Fireworks].',
        outcomeHim:
          'Her gasp-laugh when you lift her effortlessly off her heels at the door makes every single split squat worth it.',
        toastBanner: '225-LB COUGAR CARRY UNLOCKED! • CHEMISTRY +30',
        deltas: { maturity: 15, chivalry: 20, eq: 15, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Bench-Pressed for His Cougar',
      },
      {
        labelHer: 'He ego-loads 335 lbs filming a shirtless TikTok thirst trap, tweaks his lower back, and spends Friday groaning flat on your floor.',
        labelHim: 'Ego-lift way too heavy for a gym mirror video and pull your lower back right before Friday date night.',
        outcomeHer:
          'Instead of sweeping you upstairs, he’s lying on a frozen bag of peas asking for Ibuprofen. Tragic!',
        outcomeHim:
          'Nothing kills steamy Thursday text buildup faster than hobbling in at 90 degrees clutching an ice pack.',
        toastBanner: 'RED FLAG! • EGO-LIFT BACK SPASM (-20)',
        deltas: { maturity: -20, chivalry: -10, eq: -10, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Pair gym days together—trading flirty glances across the weight room before protein smoothies.',
        labelHim: 'Invite her for a joint lift + stretch session followed by post-workout dinner.',
        outcomeHer:
          'Shared endorphins + flirty gym tension = instant spark.',
        outcomeHim:
          'Training side by side keeps the chemistry sky-high.',
        toastBanner: 'ENDORPHIN SPARK +20',
        deltas: { maturity: 15, chivalry: 15, eq: 15, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'puma-low-iron-ferritin-care',
    act: 2,
    stage: 3,
    allowedTiers: ['lynx', 'puma'],
    title: '30s Real Talk: Ferritin at 11, Freezing Toes & Luteal Ribeye Care',
    subredditThreadInspiration: 'r/CougarsAndCubs: "30s low-iron/luteal crash hit hard—my 26yo cub showed up with cast-iron ribeye, spinach, vitamin C & a heated throw"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'houseboy_apron',
    setupHer:
      'Real 30s biology check: your bloodwork just clocked your ferritin at 11 right as luteal-phase hormone fatigue hits. Your hands and toes are literal ice cubes under two blankets and your brain fog is thick—just as energetic {hisName} ({hisAge}M) texts about Friday plans.',
    setupHim:
      '{herName} ({herAge}F) admits her iron/ferritin levels tanked and luteal-week exhaustion hit—she’s freezing on the couch with zero social battery. Most clueless guys whine that plans changed; how do you show up?',
    recommendedAffiliateId: 'cast-iron-steak-skillet',
    choices: [
      {
        labelHer: 'He looks up ferritin absorption on the drive over, sears grass-fed ribeye + lemony spinach in cast iron, tucks a heated throw around your freezing toes, and expects zero hosting.',
        labelHim: 'Bring grass-fed ribeye, spinach, citrus (for iron absorption!), and dark chocolate—cook in her cast iron, warm her ice-cold feet, and clean the whole kitchen.',
        outcomeHer:
          'Wait—a {hisAge}-year-old man who understands ferritin + vitamin C pairing AND warms your freezing feet without complaining? You almost propose on the sofa.',
        outcomeHim:
          'She looks at the seared ribeye and warm blanket like you hung the moon: "Where did you learn biology AND chivalry?!"',
        toastBanner: 'FERRITIN & HORMONE IQ +30! • CHIVALRY +25',
        deltas: { maturity: 25, chivalry: 25, eq: 30, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Cast-Iron Ferritin Caretaker',
      },
      {
        labelHer: 'He pouts: "Ugh why are girls always tired or cold? Just drink an energy drink and come to the bar!"',
        labelHim: 'Tell her to chug a Red Bull and rally for a loud bar anyway.',
        outcomeHer:
          'Suggesting Red Bull for ferritin-11 exhaustion earns an immediate front-door lock.',
        outcomeHim:
          'Zero empathy + Red Bull medical advice = sleeping alone tonight.',
        toastBanner: 'RED FLAG! • ZERO BIOLOGICAL EMPATHY (-25)',
        deltas: { maturity: -25, chivalry: -20, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Cozy iron-rich pho delivery, fuzzy socks, and a zero-pressure movie night in.',
        labelHim: 'Drop off piping-hot beef pho, dark chocolate, and rub her shoulders through a quiet movie.',
        outcomeHer:
          'Warm broth, warm hands, zero pressure—exactly what your body needed.',
        outcomeHim:
          'Gentle care turns a low-energy night into deep closeness.',
        toastBanner: 'COZY CARETAKING +20',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'cougar-perimenopause-surge-nightsweats',
    act: 2,
    stage: 3,
    allowedTiers: ['cougar'],
    minigame: 'thermostat_dial',
    title: 'Perimenopause Real Talk: The 10 PM Libido Surge vs. 3 AM Flash-Furnace Sheets',
    subredditThreadInspiration: 'r/CougarsAndCubs: "40s perimenopause truth: unstoppable bedroom drive at 10 PM, then radiating 1,000 degrees kicking off the duvet at 3 AM"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'Welcome to the real 40s Cougar perimenopause rollercoaster nobody puts in rom-coms: at 10 PM, a hormone-charged desire surge leaves {hisName} ({hisAge}M) seeing stars—then at 3:14 AM, a sudden flash-furnace night sweat hits, you kick every sheet off the bed, and guard your estradiol patch.',
    setupHim:
      'At 10 PM, {herName} ({herAge}F) nearly melted your soul out of your body. At 3:14 AM, she wakes up radiating volcanic perimenopause heat, flinging the comforter across the room and sighing in frustration.',
    innerInsecurityBubble: {
      herDoubt:
        'Her 3 AM thought: "Perimenopause is wild—one hour I’m a siren, the next I’m sweating through percale at 3 AM. Is a {hisAge}-year-old guy going to be weirded out?"',
      hisDoubt:
        'His 3 AM thought: "First, 10 PM was legendary; second, time to be an elite 3 AM cooling pit-crew pro—grab ice water and hit the ceiling fan!"',
    },
    recommendedAffiliateId: 'cooling-bamboo-sheets',
    choices: [
      {
        labelHer: 'He matches your 10 PM fire joyfully, then at 3 AM wordlessly clicks the fan on high, hands you ice water, flips your pillow to the cold side, and kisses your forehead with zero awkwardness.',
        labelHim: 'Match her 10 PM passion wholeheartedly—and at 3 AM click on the fan, hand her ice water, flip her pillow to the cool side, and hold space with zero weirdness.',
        outcomeHer:
          'Zero shame, cold pillow, ice water, and a partner who adores *every* part of real 40s womanhood—both the 10 PM wildfire and the 3 AM heat wave.',
        outcomeHim:
          'She exhales against the cool pillow, squeezes your hand, and whispers: "How are you this good at 3 AM?"',
        toastBanner: 'PERIMENOPAUSE PIT-CREW KING! • EQ +30 • CHEMISTRY +30',
        deltas: { maturity: 25, chivalry: 25, eq: 30, chemistry: 30, redFlags: 0 },
        badgeUnlocked: '3 AM Cold-Pillow Pit Crew',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He blurts out at 3 AM: "Whoa are you having old-lady hot flashes?! Gross, why is it wet?!"',
        labelHim: 'Make a juvenile "old-lady hot flash" crack at 3:15 AM.',
        outcomeHer:
          'You point silently to his shoes and the front door before 3:16 AM arrives.',
        outcomeHim:
          'Fastest Uber ride home in human history—deservedly so.',
        toastBanner: 'RED FLAG! • JUVENILE 3 AM CRACK (-30)',
        deltas: { maturity: -30, chivalry: -25, eq: -30, chemistry: -30, redFlags: 1 },
      },
      {
        labelHer: 'Order cooling bamboo sheets and adopt the separate two-duvet sleep method together.',
        labelHim: 'Gift her cooling bamboo sheets so you can stay under a warm duvet while she stays arctic-cool.',
        outcomeHer:
          'Separate duvets + bamboo cooling sheets = perimenopause sleep nirvana!',
        outcomeHim:
          'Practical, thoughtful problem-solving wins huge romance points.',
        toastBanner: 'COOLING SHEET UPGRADE +20',
        deltas: { maturity: 20, chivalry: 20, eq: 25, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'menopause-intimacy-masterclass',
    act: 2,
    stage: 3,
    allowedTiers: ['jaguar', 'panther'],
    title: 'Menopause & Intimacy Real Talk: Zero Pregnancy Scares & Unhurried Mastery',
    subredditThreadInspiration: 'r/CougarsAndCubs: "50s/60s menopause intimacy—zero pregnancy anxiety, why rushing is outlawed, and how an attentive cub became my best lover"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'Real talk for Jaguars & Panthers ({herAge}F): post-menopause intimacy comes with one unbeatable superpower (*zero pregnancy scares ever!*) alongside real estrogen shifts—meaning impatient 22-year-old rushing is strictly banned, luxury bedside moisture is an unapologetic staple, and unhurried attentiveness rules all.',
    setupHim:
      'Behind closed doors with {herName} ({herAge}F), menopause brings two truths every great Cub learns fast: zero pregnancy stress, AND her body rewards slow, vocal, ego-free warmup + keeping luxury bedside essentials within reach without a shred of awkwardness.',
    innerInsecurityBubble: {
      herDoubt:
        'Her silent thought: "Menopause changes timing and moisture—will a {hisAge}-year-old man take that personally or treat my body with grown-up reverence?"',
      hisDoubt:
        'His silent thought: "Don’t rush like an amateur—listen to her cues, take all night if she wants, and treat bedside essentials like champagne."',
    },
    recommendedAffiliateId: 'cooling-bamboo-sheets',
    choices: [
      {
        labelHer: 'Total body honesty and zero rushing—he treats bedside essentials as seamlessly natural, asks "Show me your favorite pace," and turns patience into electric fireworks.',
        labelHim: 'Zero ego, zero rushing—embrace unhurried warmup, keep luxury bedside essentials handy seamlessly, and let her vocal cues guide an unforgettable night.',
        outcomeHer:
          'Unhurried, attentive, ego-free, and enthusiastically devoted—proving why women in their 50s and 60s rave that their best intimacy ever started *after* menopause.',
        outcomeHim:
          'Listening instead of rushing unlocks a level of chemistry neither of you will ever forget... [Fade to Sunrise].',
        toastBanner: 'MENOPAUSE INTIMACY MASTERCLASS! • EQ +30 • CHEMISTRY +30',
        deltas: { maturity: 25, chivalry: 20, eq: 30, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Unhurried Intimacy Virtuoso',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He rushes impatiently like a frat hookup and gets defensive/sulky when you ask to slow down.',
        labelHim: 'Rush straight ahead with zero warmup and take feedback personally.',
        outcomeHer:
          'At {herAge}, you have zero patience left for bad, rushed, ego-driven lovers.',
        outcomeHim:
          'Fragile bedroom ego and rushing are fatal mistakes.',
        toastBanner: 'RED FLAG! • RUSHED AMATEUR HOUR (-25)',
        deltas: { maturity: -25, chivalry: -20, eq: -30, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Talk openly over wine first about what feels best now so expectations are crystal clear.',
        labelHim: 'Ask warmly before things heat up what makes her feel most comfortable and desired.',
        outcomeHer:
          'Grown communication before clothes come off builds effortless trust.',
        outcomeHim:
          'Open curiosity makes everything ten times hotter.',
        toastBanner: 'COMMUNICATION SPARK +20',
        deltas: { maturity: 20, chivalry: 20, eq: 25, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'steamy-texts-sister-age-shock',
    act: 2,
    stage: 3,
    minAgeGap: 6,
    title: 'Steamy Texts... Then Pure Post-Banging Shock ("YOU’RE MY LITTLE SISTER’S AGE?!")',
    subredditThreadInspiration: 'r/CougarsAndCubs: "After all-day steamy texts and mind-blowing intimacy, I saw his birth year and screamed OMG YOU ARE THE SAME AGE AS MY LITTLE SISTER"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'code_switch_phone',
    setupHer:
      'All afternoon your phones practically caught fire trading steamy slow-burn texts (*"Still thinking about your hands... clear your whole night 🔥"*). Two hours later, post-[Fade-to-Fireworks] in tangled sheets, you spot {hisName}’s birth year on his wallet ID, bolt upright clutching the percale sheet to your chin, and shriek in pure comedic horror: **"WAIT A SECOND. YOU ARE LITERALLY THE EXACT SAME AGE AS MY BABY SISTER—AND WE JUST BANGED?!"**',
    setupHim:
      'After trading scorching flirty texts all day and an Olympic-medal night together, {herName} ({herAge}F) glances at your birth year, freezes like she saw a ghost, grabs the bedsheet, and yells half-mortified, half-laughing: **"OH MY GOD. YOU WERE IN DIAPERS/GRADE SCHOOL WITH MY LITTLE SISTER AND WE JUST—?!"**',
    recommendedAffiliateId: 'espresso-martini-barware',
    choices: [
      {
        labelHer: 'Dissolve into hysterical laughter as he grins shamelessly, tugs the sheet gently, and says: "Way too late for refunds now—and I promise I’m a lot more fun than your little sister’s group chat."',
        labelHim: 'Grin shamelessly without a second of awkwardness, pull her back into the pillows, and tease: "No refunds after five-star reviews—let’s ban birth-year math until brunch."',
        outcomeHer:
          'You laugh until tears roll down your cheeks. Owning the absurd comedy of the age-math jump-scare makes the chemistry even hotter!',
        outcomeHim:
          'Turning her existential age-math shriek into belly laughter seals legendary bedroom banter—and she immediately texts you a 🔥 emoji from two feet away.',
        toastBanner: 'SISTER-AGE SHOCK SURVIVED! • CHEMISTRY +30 • EQ +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Survived "Same Age as My Baby Sister!"',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He winks cluelessly: "Wait really? Is your little sister cute too? 😂"',
        labelHim: 'Joke "Oh word, is your little sister single?" while still in her bed.',
        outcomeHer:
          'His clothes hit the driveway before his socks even touch the floor.',
        outcomeHim:
          'You have been launched into low Earth orbit from her bedroom window.',
        toastBanner: 'RED FLAG! • LAUNCHED INTO ORBIT (-30)',
        deltas: { maturity: -30, chivalry: -30, eq: -30, chemistry: -30, redFlags: 1 },
      },
      {
        labelHer: 'Institute an official "IDs stay in wallets, no graduation-year math in bed" house rule.',
        labelHim: 'Flip your wallet face-down on the nightstand and kiss her until she forgets calendar years exist.',
        outcomeHer:
          'Official house rule adopted unanimously!',
        outcomeHim:
          'Smartest house rule in age-gap history.',
        toastBanner: 'NO BEDROOM MATH RULE +20',
        deltas: { maturity: 15, chivalry: 15, eq: 20, chemistry: 25, redFlags: 0 },
      },
    ],
  },

  // --- 2 POP-CULTURE COUGAR RENAISSANCE & "CUB GROOMING" GLOW-UP EPISODES ---
  {
    id: 'cub-grooming-red-carpet-glowup',
    act: 2,
    stage: 3,
    minigame: 'cub_grooming',
    title: '"Grooming" Your Cub: The ATJ TikTok Discourse vs. Literal Beard-Oil Glow-Up',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Internet trolls yell \'grooming\' at consenting 27yo men—meanwhile the only grooming I did was throwing out his 5-in-1 body wash!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'bathroom_audit',
    setupHer:
      'The moment a chronically online acquaintance hears your {herAge}F × {hisAge}M gap, they bring up **Aaron Taylor-Johnson** and smirk: *"Careful, TikTok’s gonna say you’re \'grooming\' him!"* Please—{hisName} is a grown {hisAge}-year-old adult with a W-2 and a fully baked prefrontal cortex. Though if **"grooming"** means confiscating his 5-in-1 neon-blue shower gel, lining up his jawline with sandalwood beard oil, and putting him in tailored linen until he looks like **Danny Ramirez** on **Jessica Alba’s** arm? Guilty as charged.',
    setupHim:
      'Your buddy sends a TikTok meme comparing every older-woman/younger-man couple to **Aaron Taylor-Johnson** with air-quotes *"grooming."* You laugh—you’re {hisAge}, fully grown, and pursuing {herName} ({herAge}F) on purpose. Meanwhile, she’s eyeing your 5-in-1 body wash and scruffy collar ready to give you the full **"Cougar-Groomed" Red-Carpet Glow-Up**!',
    recommendedAffiliateId: 'cub-grooming-beard-skincare-kit',
    choices: [
      {
        labelHer: 'Shut down creepy teen-gap comparisons (grown 25+ adults only!) and lean hilariously into literal "Cub Grooming"—upgrading his beard oil, SPF 50, cologne, and linen shirt.',
        labelHim: 'Roast the TikTok trolls ("My prefrontal cortex and 401(k) are doing great") and happily let her upgrade your skincare, beard line-up, and tailored collar.',
        outcomeHer:
          'Two weeks later he walks into cocktails smelling like Santal & bergamot with glowing skin and rolled linen cuffs—your friends gasp: "Okay, THAT kind of \'Cub grooming\' deserves a Nobel Prize."',
        outcomeHim:
          'Even your barber asks who upgraded your skincare and collar game—you step out beside {herName} looking straight off a **Jessica Alba & Danny Ramirez** vacation pap walk.',
        toastBanner: '"COUGAR-GROOMED" GLOW-UP! • CHEMISTRY +25 • CHIVALRY +20',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Cougar-Groomed Glow-Up Icon',
      },
      {
        labelHer: 'He clings to his neon-blue 5-in-1 shampoo/car-wash gel, refuses moisturizer, and wears wrinkled cargo shorts to wine night.',
        labelHim: 'Defend your 5-in-1 body wash to the death and show up in wrinkled gym shorts.',
        outcomeHer:
          'Refusing SPF and sandalwood beard oil when a radiant woman offers you a red-carpet upgrade is a felony against your own jawline.',
        outcomeHim:
          'Clinging to dorm-room 5-in-1 gel costs you a 10/10 glow-up.',
        toastBanner: 'RED FLAG! • 5-IN-1 SHOWER GEL CRIME (-20)',
        deltas: { maturity: -20, chivalry: -15, eq: -15, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Make it a playful Saturday spa + shopping date—espresso, barber trim, and picking a signature cologne together.',
        labelHim: 'Turn it into a fun Saturday afternoon date: fresh barber fade, espresso, and letting her pick your new date-night cologne.',
        outcomeHer:
          'Picking out the exact scent on his neck that drives you wild? Elite Saturday investment.',
        outcomeHim:
          'Letting her choose the cologne she wants to smell up close tonight is 200-IQ romance.',
        toastBanner: 'SIGNATURE SCENT UNLOCKED +20',
        deltas: { maturity: 15, chivalry: 15, eq: 20, chemistry: 25, redFlags: 0 },
      },
    ],
  },
  {
    id: 'pop-culture-cougar-renaissance',
    act: 3,
    stage: 4,
    title: 'Pop-Culture Cougar Renaissance: Alba, Sienna Miller, Ellie Goulding & Miley!',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Between Jessica Alba, Sienna Miller, Ellie Goulding having babies with cubs & Miley marrying Maxx—it’s officially Cougar Season!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'palm_springs_pool',
    setupHer:
      'At cocktail hour, the table starts talking celebrity couples—and pop culture is officially in its Golden Cougar Era: **Jessica Alba** thriving with her Cub **Danny Ramirez**, **Sienna Miller & Oli Green** plus **Ellie Goulding & Beau Minniear** welcoming babies with devoted younger partners, and **Miley Cyrus** marrying her 6-year Cub **Maxx Morando**! Someone turns to you ({herAge}F) and {hisName} ({hisAge}M): *"So are Cougars & Cubs just trendy now because of Hollywood?"*',
    setupHim:
      'Drinks with friends turns into celebrity age-gap trivia—**Jessica Alba & Danny Ramirez**, **Sienna Miller & Oli Green**, **Ellie Goulding & Beau Minniear**, and newlyweds **Miley Cyrus & Maxx Morando**. Someone teases you ({hisAge}M) and {herName} ({herAge}F): *"Did you two copy celebrity Cougar summer?"*',
    choices: [
      {
        labelHer: 'Toast the double standard finally dying: men dated younger in Hollywood for 80 years—watching Alba, Sienna, Ellie & Miley thrive publicly just proves women stopped asking permission.',
        labelHim: 'Raise your glass grinning: "Danny Ramirez, Oli Green, Beau Minniear, and Maxx Morando just figured out what smart Cubs already knew—confident women are the ultimate prize."',
        outcomeHer:
          'Mic drop at the cocktail table! Half the women raise their martinis cheering while {hisName} slips his arm around your waist beaming.',
        outcomeHim:
          'Smooth, celebratory, zero awkwardness—{herName} clinks your glass laughing while everyone at the table nods in respect.',
        toastBanner: 'HOLLYWOOD COUGAR ERA! • CHEMISTRY +25 • EQ +25',
        deltas: { maturity: 20, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Red-Carpet Cougar Era Certified',
      },
      {
        labelHer: 'He gets weird and insecure comparing himself to celebrity actors or calls successful older women "a passing fad."',
        labelHim: 'Mumble awkwardly that celebrity Cougar marriages "probably won’t last anyway."',
        outcomeHer:
          'Rooting against Sienna, Jessica, Ellie, and Miley right beside your own girlfriend?! Read the room!',
        outcomeHim:
          'Trash-talking iconic Cougar/Cub couples while sitting next to yours tanks the whole night.',
        toastBanner: 'RED FLAG! • DOUBLE-STANDARD FUMBLE (-20)',
        deltas: { maturity: -20, chivalry: -15, eq: -20, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Playfully vote on which celebrity Cougar-Cub duo matches your exact vibe on the drive home.',
        labelHim: 'Debate playfully whether you two give more Alba & Danny vacation glow, Sienna & Oli London chic, or Miley & Maxx rockstar energy.',
        outcomeHer:
          'Flirty, fun pop-culture banter all the way home.',
        outcomeHim:
          'Playful celebrity-couple casting keeps the date-night energy electric.',
        toastBanner: 'POP-CULTURE SPARK +20',
        deltas: { maturity: 15, chivalry: 15, eq: 15, chemistry: 20, redFlags: 0 },
      },
    ],
  },

  // --- 4 "DEVIL IS IN THE DETAILS" COUGAR & CUB LIFESTYLE MICRO-DETAIL EPISODES ---
  {
    id: 'candlelit-menu-font-seatwarmer',
    act: 2,
    stage: 2,
    title: '8-Point Candlelit Menu Font, Level-3 Seat Warmers & The Top Shelf',
    subredditThreadInspiration: 'r/CougarsAndCubs: "It’s the tiny details: he pre-heated my seat warmer, reached the top pantry shelf & read the tiny dim menu font without a single joke"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    setupHer:
      'Friday night, 8:15 PM. {hisName} ({hisAge}M) already scored silent points by pre-heating your passenger seat warmer to Level 3 before opening your car door. Now you’re in a trendy, pitch-dark Italian bistro where the pasta menu is printed in microscopic 7-point grey italic font—a hate crime against anyone over 38 who left her reading glasses in her other clutch.',
    setupHim:
      'You pre-warmed {herName}’s ({herAge}F) passenger seat on the drive over and got her into a gorgeous candlelit trattoria. Only problem: the lighting is moody dark and the menu font is microscopic. You notice her holding the cardstock slightly farther back—what’s the move?',
    choices: [
      {
        labelHer: 'Before you even squint, he leans in warmly ("It’s pitch dark in here—listen to this wild boar ragu & truffle cacio e pepe") and reads the best four dishes aloud with zero age jokes.',
        labelHim: 'Blame the restaurant’s dark mood lighting casually and read the top pasta & wine highlights aloud like a sommelier—zero "need my phone flashlight, grandma?" jokes.',
        outcomeHer:
          'Pre-heated seat warmer + reading tiny menu print smoothly without making it weird + reaching your top wine-glass shelf afterward? Husband-tier micro-chivalry.',
        outcomeHim:
          'She relaxes instantly, squeezes your knee under the tablecloth, and whispers that your attention to detail is lethal.',
        toastBanner: 'MICRO-CHIVALRY PERFECTION! • CHIVALRY +25 • EQ +25',
        deltas: { maturity: 20, chivalry: 25, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Candlelit Menu & Seat-Warmer Pro',
      },
      {
        labelHer: 'He turns his iPhone strobe flashlight onto 1,000 lumens aimed at your face and yells "NEED BIFOCALS?!" across the restaurant.',
        labelHim: 'Blast your iPhone flashlight across the table and joke loudly about senior-citizen menus.',
        outcomeHer:
          'Every table turns to stare while you contemplate ordering a solo Uber from the ladies’ room.',
        outcomeHim:
          'Blinding your date with a strobe light while yelling bifocal jokes is an instant fumble.',
        toastBanner: 'RED FLAG! • STROBE-LIGHT MENU CRIME (-20)',
        deltas: { maturity: -20, chivalry: -25, eq: -20, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Pull out your chic tortoiseshell readers with zero shame—and watch him lose his mind over the hot-professor look.',
        labelHim: 'When she slips on her tortoiseshell reading glasses, tell her honestly that look is dangerously attractive.',
        outcomeHer:
          'Wait—he thinks the tortoiseshell readers are hot?! Crisis upgraded into foreplay.',
        outcomeHim:
          'Complimenting her reading glasses genuinely makes her blush over her Barolo.',
        toastBanner: 'HOT-PROFESSOR READERS SPARK +20',
        deltas: { maturity: 15, chivalry: 15, eq: 20, chemistry: 25, redFlags: 0 },
      },
    ],
  },
  {
    id: 'silk-pillowcase-clawclip-drawer',
    act: 2,
    stage: 3,
    title: 'Silk Pillowcase Law, Braids/Blowout Protection & His Secret "Her Drawer"',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Opened my 26yo cub’s nightstand expecting video games—found a mulberry silk pillowcase, claw clip, makeup wipes & my charger"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'bathroom_audit',
    setupHer:
      'Second sleepover at {hisName}’s ({hisAge}M) place. Usually sleeping at a younger man’s apartment means rough cotton pillowcases wrecking your blowout, silk press, or braids, zero makeup remover, and hunting for a hair tie at midnight. Then he opens the top drawer of his bathroom vanity...',
    setupHim:
      '{herName} ({herAge}F) is staying the night at your place after wine bar Friday. You noticed on Sleepover #1 how protective she is of her hair, skincare barrier, and sleep setup. How did you prep?',
    recommendedAffiliateId: 'silk-pillowcase-sleepover-duo',
    choices: [
      {
        labelHer: 'Inside his "Her Drawer": a fresh 22-momme mulberry silk pillowcase already on your pillow, micellar wipes, a spare tortoiseshell claw clip, Ibuprofen, and an extra USB-C cord on your side!',
        labelHim: 'Put a 22-momme silk pillowcase on her side of the bed and stock a dedicated drawer with a spare claw clip, gentle makeup wipes, Advil, and her own phone charger.',
        outcomeHer:
          'You stare at the silk pillowcase and spare claw clip in stunned silence. Men at 44 never thought of this—meanwhile {hisName} studied the assignment like a scholar.',
        outcomeHim:
          'When she spots the silk pillowcase and dedicated claw clip, she kisses you like you just won an Oscar.',
        toastBanner: '"HER DRAWER" LEGEND! • CHIVALRY +30 • CHEMISTRY +25',
        deltas: { maturity: 25, chivalry: 30, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Silk-Pillowcase & Claw-Clip MVP',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'Scratchy unwashed flannel pillowcase, zero hand towel, and he accidentally lies directly on your hair mid-kiss.',
        labelHim: 'Offer a scratchy college pillowcase and accidentally yank her hair leaning on your elbow.',
        outcomeHer:
          'Trapping a woman’s hair under your elbow on a sandpaper pillowcase is a two-count misdemeanor.',
        outcomeHim:
          'Watch the elbow on the hair—and invest $39 in silk!',
        toastBanner: 'RED FLAG! • BLOWOUT / BRAID HAZARD (-15)',
        deltas: { maturity: -15, chivalry: -20, eq: -15, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Ask what exact skincare & hair essentials she likes so you stock them before next weekend.',
        labelHim: 'Take a quick mental note tonight and order her exact favorite pillowcase & cleanser for Friday.',
        outcomeHer:
          'Thoughtful, attentive, and zero guesswork.',
        outcomeHim:
          'Asking directly and following through by next Friday wins huge points.',
        toastBanner: 'ATTENTIVE HOSTING +20',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'midnight-pizza-vs-sodium-rings',
    act: 2,
    stage: 3,
    title: 'His 25yo Midnight Pizza Abs vs. Her Post-8 PM Soy-Sauce Ring Swell',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Unfair biology: my cub eats 4 slices of pepperoni pizza at midnight and wakes up with 8-pack abs; I look at soy sauce after 8 PM and my rings don’t fit"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'houseboy_apron',
    setupHer:
      '11:30 PM Saturday after a very active evening. {hisName} ({hisAge}M) casually inhales half a pepperoni pizza straight from the box and will wake up tomorrow with visible lower abs—whereas if you touch late-night sodium or cheap tequila at {herAge}, you wake up puffy with rings stuck on your fingers and acid reflux.',
    setupHim:
      'Post-date midnight hunger hits your {hisAge}-year-old furnace metabolism hard, while {herName} ({herAge}F) laughs that eating salty takeout at 11:45 PM means puffy eyes and tight rings tomorrow morning.',
    choices: [
      {
        labelHer: 'He eats his midnight slice in the kitchen (zero crumbs in bed!), brings you chilled electrolyte lemon water + peppermint tea + fresh berries, and gives you a lymphatic shoulder rub.',
        labelHim: 'Keep midnight pizza out of her crisp sheets, bring her ice-cold lemon electrolyte water + herbal tea + berries, and never peer-pressure late-night junk food.',
        outcomeHer:
          'You wake up hydrated, glowing, rings sliding cleanly, and still marveling at his unfair 20s metabolism over Sunday espresso.',
        outcomeHim:
          'Respecting her body’s rhythm while keeping crumbs 50 feet away from her bed earns lifetime sleepover privileges.',
        toastBanner: 'METABOLISM & HYDRATION IQ +25',
        deltas: { maturity: 20, chivalry: 25, eq: 25, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Midnight Hydration Concierge',
      },
      {
        labelHer: 'He drips garlic-butter crust oil onto your white duvet and says "Why are you so strict, live a little!"',
        labelHim: 'Eat greasy garlic knots over her white percale duvet and tease her for skipping midnight pizza.',
        outcomeHer:
          'Garlic oil on 600-thread-count percale PLUS food commentary?! Banished to the couch.',
        outcomeHim:
          'Greasy fingers on luxury bedding is an automatic ejection.',
        toastBanner: 'RED FLAG! • GARLIC OIL ON PERCALE (-20)',
        deltas: { maturity: -20, chivalry: -20, eq: -20, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Cook a clean 6:30 PM protein-and-greens dinner together so nobody needs 1 AM grease.',
        labelHim: 'Make an early seared-salmon & avocado dinner at 7 PM and save big brunch pancakes for 10 AM.',
        outcomeHer:
          '7 PM dinner + 10 AM brunch is peak Cougar-Cub scheduling harmony.',
        outcomeHim:
          'Smart timing leaves both of you feeling 10/10 in the morning.',
        toastBanner: 'DINNER TIMING GENIUS +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'retinol-stubble-eye-cream-heist',
    act: 2,
    stage: 3,
    title: 'Tretinoin vs. Stubble Burn (And Catching Him Stealing Your $180 Eye Cream)',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Told my cub his 5 o’clock shadow irritated my retinol barrier—caught him moisturizing his beard AND patting on my $180 peptide eye cream"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'Two classic age-gap bathroom details collide: first, scratchy two-day stubble against your prescription tretinoin/retinol skin barrier equals instant chin redness. Second, you walk into your bathroom at 10:15 PM and catch {hisName} ({hisAge}M) carefully dabbing your $180 luxury peptide eye cream under his eyes with his ring finger.',
    setupHim:
      'First {herName} ({herAge}F) taught you that dry scruff burns her night-retinol skin unless you soften your beard. Next thing you know, she walks into the bathroom right as you’re sampling a tiny dab of her ultra-luxury peptide cream in the mirror.',
    recommendedAffiliateId: 'cub-grooming-beard-skincare-kit',
    choices: [
      {
        labelHer: 'Laugh warmly, teach him proper ring-finger patting technique, gift him his own peptide moisturizer + sandalwood beard softener, and enjoy butter-soft kisses all night.',
        labelHim: 'Grin red-handed ("Hey, I’m trying to age as well as you!"), keep your stubble conditioned soft for her retinol barrier, and buy your own jar tomorrow.',
        outcomeHer:
          'Zero retinol chin burn AND a boyfriend with glowing cheekbones who smells like sandalwood? Absolute win.',
        outcomeHim:
          'Softened stubble + playful honesty turns a hilarious bathroom catch into ten minutes of making out against the vanity.',
        toastBanner: 'RETINOL-SAFE KISSES! • CHEMISTRY +25 • EQ +20',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Retinol-Safe Beard Certified',
      },
      {
        labelHer: 'He scoops a golf-ball glob of your $180 serum onto his elbows and rubs sandpaper stubble across your freshly retinized cheeks.',
        labelHim: 'Use half her $180 jar as hand lotion and rub scratchy dry stubble across her face.',
        outcomeHer:
          'Using $180 eye serum as elbow lotion is a war crime in every zip code.',
        outcomeHim:
          'RIP her moisture barrier and your weekend invite.',
        toastBanner: 'RED FLAG! • $180 SERUM FELONY (-20)',
        deltas: { maturity: -20, chivalry: -20, eq: -15, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Do Friday sheet-masks together with chilled wine before bed.',
        labelHim: 'Embrace a hilarious couples sheet-mask + beard-oil wind-down ritual together.',
        outcomeHer:
          'Playful, domestic, and keeps both faces glowing.',
        outcomeHim:
          'Zero toxic masculinity + glowing skin = top-tier Cub behavior.',
        toastBanner: 'SHEET-MASK BONDING +20',
        deltas: { maturity: 15, chivalry: 15, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },

  // --- 7 FORUM RED-FLAG, GROWN-SON / SIBLING SAME-AGE, PARENTS, WEDDING +1 & ROBLOX EPISODES ---
  {
    id: 'forum-redflag-pocket-secret-test',
    act: 2,
    stage: 2,
    title: 'Forum Red Flag #1: "After-9-PM Secret Link" vs. Daylight Sidewalk Pride',
    subredditThreadInspiration: 'r/CougarsAndCubs: "PSA to new Cougars: if he says \'discreet\', never takes you to 11 AM daylight brunch, or drops your hand in public—RUN"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    setupHer:
      'Every veteran on r/CougarsAndCubs warns newcomers about the **"Pocket Girlfriend" Red Flag**: younger guys who melt over you behind closed doors at 10 PM, yet mysteriously avoid busy Saturday farmers markets, daylight patios, or walking hand-in-hand past people their age. Time to see how {hisName} ({hisAge}M) handles bright Saturday noon sunlight.',
    setupHim:
      'Rule #1 from older women on the forums: nothing dries up attraction faster than feeling like a younger man’s "secret after-hours experiment." It’s Saturday at 11:30 AM—how do you court {herName} ({herAge}F) in broad daylight?',
    choices: [
      {
        labelHer: 'He books a sunlit 11:30 AM street-side brunch patio in the busiest neighborhood in town, holds your hand walking past his own gym crowd, and beams introducing you.',
        labelHim: 'Book the sunniest front-row sidewalk brunch table at 11:30 AM, reach for her hand effortlessly on the crosswalk, and radiate unmistakable pride.',
        outcomeHer:
          'Zero shadows, zero "keep it lowkey" nonsense—walking down the avenue in noon sunlight with a man who looks proud to be beside you passes the #1 forum test!',
        outcomeHim:
          'She squeezes your fingers at the crosswalk smiling: "Okay, you officially passed the Saturday Daylight Test."',
        toastBanner: 'DAYLIGHT PRIDE CERTIFIED! • CHIVALRY +25 • EQ +25',
        deltas: { maturity: 25, chivalry: 25, eq: 25, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Saturday Daylight Pride Certified',
      },
      {
        labelHer: 'He only texts after 9:30 PM ("come over lowkey 👀") and drops your hand the second two 24-year-old girls walk past.',
        labelHim: 'Suggest only late-night indoor hangouts and pull your hand back when people your age walk by.',
        outcomeHer:
          'We don’t do secret pocket girlfriends in this club—blocked before you reach the corner!',
        outcomeHim:
          'Flinching in public is the fastest one-way ticket out of Cougars & Cubs Club.',
        toastBanner: 'RED FLAG! • "SECRET POCKET" VIOLATION (-25)',
        deltas: { maturity: -25, chivalry: -25, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Hit the Saturday farmers market together for coffee, peaches, and flowers in full daylight.',
        labelHim: 'Invite her on a Saturday morning farmers-market coffee & flower stroll.',
        outcomeHer:
          'Easy, public, romantic daylight energy.',
        outcomeHim:
          'Daytime dates prove genuine relationship intent immediately.',
        toastBanner: 'DAYLIGHT MARKET CHARM +20',
        deltas: { maturity: 20, chivalry: 20, eq: 15, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'generational-1900s-venmo-whiplash',
    act: 2,
    stage: 2,
    title: '"Back in the Late 1900s?!", Voicemail Panic & Public Venmo Emojis',
    subredditThreadInspiration: 'r/CougarsAndCubs: "My 25yo cub innocently asked what concerts were like \'in the late 1900s\'—right after panicking because I left him a voicemail"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'code_switch_phone',
    setupHer:
      'Three generational micro-collisions happen in ten minutes: first, you left {hisName} ({hisAge}M) a normal 20-second voicemail and he called back breathless thinking someone was in the ER (*"Nobody under 30 leaves voicemails unless a meteor hit!!"*). Second, you see his friends’ unhinged public Venmo feed. Third, while talking 1999 music, he earnestly says: *"Wait, tickets were $30 back in the **late 1900s**?!"*',
    setupHim:
      'Generational culture clash alert with {herName} ({herAge}F): her voicemail notification nearly gave you a heart attack, she prints hotel confirmations as PDFs just in case, and you accidentally referred to 1998 as **"the late 1900s"** out loud.',
    codeSwitchRawImpulse: {
      rawThought: 'Whoa wait so did u have color TV back in the 1900s or nah 💀💀',
      warningNote:
        'ABORT!! Calling the 1990s "the 1900s" twice in one night carries a mandatory 48-hour couch sentence!',
    },
    choices: [
      {
        labelHer: 'He catches himself mid-"1900s" horrified, flips his Venmo privacy to Private immediately, queues 1998 Lauryn Hill on vinyl to atone, and kisses you laughing.',
        labelHim: 'Apologize laughing for the "late 1900s" slip, switch your Venmo default to Private like an adult, and put on *The Miseducation of Lauryn Hill* as peace offering.',
        outcomeHer:
          'You throw one velvet sofa pillow at his head, burst out laughing, and forgive the 21st-century baby immediately.',
        outcomeHim:
          'She hits you with a throw pillow laughing—and spends the next hour teaching you peak 1999 album lore.',
        toastBanner: '"LATE 1900s" SURVIVED! • CHEMISTRY +25 • EQ +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Survived Calling 1998 "The 1900s"',
      },
      {
        labelHer: 'He doubles down calling you a "20th-century historical artifact" AND posts a public Venmo memo with 🐆🍼 emojis.',
        labelHim: 'Make five more "20th-century relic" jokes and send a public Venmo request with cougar emojis.',
        outcomeHer:
          'Public Venmo cougar emojis?! Enjoy singlehood in the 2020s!',
        outcomeHim:
          'Broadcasting private relationship jokes on public Venmo is peak immaturity.',
        toastBanner: 'RED FLAG! • PUBLIC VENMO CRINGE (-20)',
        deltas: { maturity: -25, chivalry: -15, eq: -20, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Trade generational tech lessons: he sets up your Apple Wallet shortcuts; you teach him voicemail calm & collar ironing.',
        labelHim: 'Swap skills fairly: organize her travel passes while she upgrades your wine & wardrobe game.',
        outcomeHer:
          'Best cross-generational skill swap ever.',
        outcomeHim:
          'Playful teamwork turns every micro-gap into an inside joke.',
        toastBanner: 'CROSS-GEN TEAMWORK +20',
        deltas: { maturity: 15, chivalry: 15, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'cub-friends-memes-roblox-shock',
    act: 3,
    stage: 4,
    title: 'Meeting His Younger Friends: Brainrot Memes & Playing Roblox at 10 PM?!',
    subredditThreadInspiration: 'r/CougarsAndCubs: "My 25yo cub is a gentleman alone—then I met his friends and realized they just AirDrop unhinged memes and play Roblox Dress to Impress!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'code_switch_phone',
    setupHer:
      'One-on-one, {hisName} ({hisAge}M) cooks ribeye and reads hardcovers. Tonight you stop by his college buddies’ apartment for a quick pre-game drink—and experience pure anthropological shock: four 24-year-old men communicating entirely in deep-fried Discord memes, arguing passionately over **Roblox *Dress to Impress*** runway scores on a 75-inch TV, and asking if you want a lukewarm White Claw or "wanna hop in our Roblox server?!"',
    setupHim:
      'Worlds collide: you brought sophisticated {herName} ({herAge}F) to say hi to your boys for 40 minutes before dinner—right as Bro #1 AirDrops cursed memes and Bro #2 boots up **Roblox** on the living-room TV yelling about obby checkpoints.',
    choices: [
      {
        labelHer: 'He pours your wine into a real glass he brought, playfully roasts his Roblox-obsessed roommates, wins a 2-minute round *for* you laughing, and whisks you out at minute 40 to your candlelit reservation!',
        labelHim: 'Pour her chilled wine in real glassware, keep her right at the center of warm conversation, laugh off your boys’ Roblox chaos without regressing into it, and head out right on schedule at 8 PM.',
        outcomeHer:
          'Seeing the hilarious contrast between his Roblox-playing buddies and how grown, attentive, and protective {hisName} is with you actually makes him look *ten times* hotter!',
        outcomeHim:
          'In the Uber to dinner she’s crying laughing: "Your friends are literally 12-year-olds on Roblox—how on earth did YOU turn out so smooth?!"',
        toastBanner: 'ROBLOX PRE-GAME SURVIVED! • MATURITY +25 • CHEMISTRY +25',
        deltas: { maturity: 25, chivalry: 25, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Escaped the Boys’ Roblox Lobby',
      },
      {
        labelHer: 'He flops onto a beanbag chair screaming into a headset on Roblox for three hours while you sit stranded beside an empty White Claw box.',
        labelHim: 'Grab a controller, ignore her on the futon for two hours, and scream at a Roblox obby with the boys.',
        outcomeHer:
          'Watching a man scream over virtual Roblox shoes at 10:30 PM cures attraction permanently.',
        outcomeHim:
          'By the time you look up from Roblox, she’s already home in silk pajamas blocking your number.',
        toastBanner: 'RED FLAG! • 3-HOUR ROBLOX REGRESSION (-25)',
        deltas: { maturity: -30, chivalry: -25, eq: -20, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Judge one 3-minute round of Dress to Impress like Anna Wintour, make all his friends howl laughing, then head to dinner.',
        labelHim: 'Hand her the mic as celebrity fashion judge for one 3-minute round before heading to your wine-bar reservation.',
        outcomeHer:
          'His friends worship you as an absolute legend, and you still make your 8 PM pasta table!',
        outcomeHim:
          'Your buddies crown her the coolest girlfriend on earth within five minutes.',
        toastBanner: 'ICONIC GOOD SPORT +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'younger-sibling-same-birth-year',
    act: 3,
    stage: 4,
    minAgeGap: 6,
    title: 'Her Baby Brother / Sister Was Born the EXACT Same Year as Her Cub!',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Introduced my cub to my family—my baby brother squinted and yelled \'BRO WE WERE BORN THE EXACT SAME MONTH!!\'"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'brunch_daughter',
    setupHer:
      'Drinks with your younger sibling—who you literally used to babysit and drive to middle school in your first Honda Civic. Five minutes into small talk, your baby sibling and {hisName} ({hisAge}M) realize they were **born the exact same year**, took the SAT the same Saturday, and watched the exact same childhood cartoons. Your sibling stares at you across their margarita: *"Did you seriously raid my birth year?!"*',
    setupHim:
      'You’re meeting {herName}’s ({herAge}F) younger sibling—and realize within three sentences that you two were born the **exact same calendar year**. Her sibling grins wickedly: *"Wait, she used to wipe pudding off my face while you were in 1st grade too!!"*',
    choices: [
      {
        labelHer: 'He handles your sibling’s teasing with effortless charm, never teams up against you or gets weird, covers the appetizer round cleanly, and keeps all romantic focus clearly on you.',
        labelHim: 'Laugh along warmly without ever crossing boundaries or ganging up on {herName}, treat her sibling with friendly respect, and keep your eyes unmistakably on your partner.',
        outcomeHer:
          'By drink two, your younger sibling texts you under the table: *"Okay fine, it was weird for 4 minutes—he’s actually awesome for you."*',
        outcomeHim:
          'Her younger sibling gives you a fist-bump at the curb and officially signs off on the birth-year crossover.',
        toastBanner: 'SAME-YEAR SIBLING APPROVED! • EQ +25 • MATURITY +25',
        deltas: { maturity: 25, chivalry: 20, eq: 25, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Baby-Sibling Birth-Year Survivor',
      },
      {
        labelHer: 'He gets way too flirty with your younger sister OR gangs up with your baby brother making "old big sister" jokes all night.',
        labelHim: 'Flirt awkwardly with her younger sister or roast {herName} nonstop with her baby brother.',
        outcomeHer:
          'Either one is an immediate, unforgivable ejection from the bloodline.',
        outcomeHim:
          'Worst family-intro fumble imaginable—instant exile.',
        toastBanner: 'RED FLAG! • SIBLING BOUNDARY DISASTER (-30)',
        deltas: { maturity: -30, chivalry: -25, eq: -30, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Own the comedy upfront ("Yes, 1999/2000 was clearly a great vintage") and steer conversation to shared travel & careers.',
        labelHim: 'Acknowledge the funny birth-year coincidence once with a grin, then pivot smoothly to real adult topics.',
        outcomeHer:
          'Naming the joke once kills 100% of the awkwardness.',
        outcomeHim:
          'Pivoting cleanly shows grown composure.',
        toastBanner: 'SMOOTH PIVOT +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'grown-son-same-age-collision',
    act: 3,
    stage: 4,
    minAgeGap: 18,
    requiredAnyTags: ['adult_children'],
    title: 'Ultimate Forum Boss: Her Grown Son Is the EXACT Same Age as Her Cub!',
    subredditThreadInspiration: 'r/CougarsAndCubs: "My 25yo son walked into my kitchen holding laundry right beside my 25yo boyfriend—same age, same height, same Nike Dunks"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'brunch_daughter',
    setupHer:
      'The #1 high-wire scenario on r/CougarsAndCubs: Sunday morning in your kitchen, your **grown son** (practically the exact same age as {hisName}, {hisAge}M!) drops by unannounced using his family key—and freezes nose-to-nose with {hisName}, who is standing by the espresso machine wearing the **exact same sneakers**.',
    setupHim:
      'The back door opens Sunday morning and in walks {herName}’s ({herAge}F) **grown adult son**—who is literally your exact age, wearing your exact sneakers, staring straight at you beside his mom’s coffee maker. Every forum rule ever written hangs on your next ten seconds!',
    choices: [
      {
        labelHer: 'Zero creepy "hey champ / stepdad" posturing! He shakes your son’s hand man-to-man with calm respect, lets you anchor the conversation, and graciously heads out after ten warm minutes so you and your son get solo time.',
        labelHim: 'NEVER act like a fake stepdad or try too hard to be his best bro—offer a calm, respectful man-to-man handshake, let {herName} lead, and head out smoothly after coffee to respect their mother-son time.',
        outcomeHer:
          'You exhale a breath you were holding since 2024. Later your son shrugs: *"Look, same-age math is wild, Mom—at least the guy wasn’t weird and clearly respects you."*',
        outcomeHim:
          'Zero ego, zero weirdness, 100% emotional intelligence—she texts you twenty minutes later: "You handled that better than any man alive."',
        toastBanner: 'GROWN-SON COLLISION MASTERED! • MATURITY +30 • EQ +30',
        deltas: { maturity: 30, chivalry: 20, eq: 30, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Zero-Weirdness Peer-Son Respect',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He claps your 25-year-old son on the shoulder and says: "Good to meet you, sport—proud of the man you’re becoming!"',
        labelHim: 'Pat a guy your exact age on the shoulder and call him "kiddo / champ" like a sitcom stepdad.',
        outcomeHer:
          'Your soul physically leaves your body from secondhand embarrassment. Calling a man born the same month as you "sport" is illegal!',
        outcomeHim:
          'Calling someone your own age "champ" creates enough cringe to power a small city.',
        toastBanner: 'RED FLAG! • FAKE-STEPDAD "CHAMP" CRINGE (-30)',
        deltas: { maturity: -30, chivalry: -15, eq: -30, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Keep adult-kid introductions planned at a neutral lunch spot rather than surprise Sunday mornings.',
        labelHim: 'Set a clear house rule together afterwards: heads-up texts before family drop-ins so everyone feels comfortable.',
        outcomeHer:
          'Healthy boundaries keep both worlds harmonious.',
        outcomeHim:
          'Calm boundary-setting prevents repeat kitchen ambushes.',
        toastBanner: 'SMART FAMILY BOUNDARIES +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'first-wedding-plus-one-debut',
    act: 3,
    stage: 4,
    minAgeGap: 10,
    title: 'First Time as Wedding +1: Table 9 Whispers, Tipsy Aunties & Slow Dances',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Survived our first big wedding together as official +1s—from tipsy Aunt Linda’s math to owning the dance floor!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'thanksgiving_table',
    setupHer:
      'Your very first black-tie/cocktail wedding together as official `+1`s! Walking into cocktail hour with {hisName} ({hisAge}M) looking devastating in a tailored suit, 150 guests turn: two coworkers whisper behind champagne flutes, and tipsy Aunt Linda squints at the place cards asking *"Wait—nephew, personal trainer, or... OH GOOD FOR YOU HONEY!!"*',
    setupHim:
      'Your first big formal wedding as {herName}’s ({herAge}F) official `+1`! She looks breathtaking, Table 9 is buzzing with curious glances, and the band just started playing *September* into a classic slow ballad.',
    choices: [
      {
        labelHer: 'He introduces himself to Table 9 with warm poise, charms Tipsy Aunt Linda onto your fan club, keeps a fresh drink in your hand, and pulls you onto the dance floor like you’re the only woman in the ballroom.',
        labelHim: 'Work Table 9 with warm gentleman charm, laugh graciously with Tipsy Aunt Linda, and lead {herName} onto the dance floor with total pride.',
        outcomeHer:
          'By cake-cutting, four married women at Table 9 tell you privately you look happier than anyone in the room—and Aunt Linda tries to adopt him!',
        outcomeHim:
          'Owning the room with grace and pride turns curious whispers into open admiration before dessert.',
        toastBanner: 'WEDDING +1 DEBUT CRUSHED! • CHIVALRY +30 • CHEMISTRY +25',
        deltas: { maturity: 25, chivalry: 30, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Wedding +1 Ballroom MVP',
      },
      {
        labelHer: 'He hides by the shrimp tower alone on his phone all night because he feels awkward around people in their 40s.',
        labelHim: 'Hide awkwardly near the bathroom hallway scrolling your phone because her friends are older.',
        outcomeHer:
          'Bringing a `+1` you have to babysit by the shrimp tower defeats the whole point of a handsome date!',
        outcomeHim:
          'Shrinking into the wallpaper leaves your partner fending off Table 9 solo.',
        toastBanner: 'RED FLAG! • SHRIMP-TOWER WALLFLOWER (-20)',
        deltas: { maturity: -20, chivalry: -20, eq: -20, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Arrive right on time, crush two hours of dancing & toasts, and slip away together to the hotel suite before midnight.',
        labelHim: 'Give two high-energy, gracious hours at the reception, then whisk her away for a private suite nightcap.',
        outcomeHer:
          'Peak entrance, peak dancing, peak exit.',
        outcomeHim:
          'Leaving while the night is electric is veteran wedding strategy.',
        toastBanner: 'PERFECT WEDDING EXIT +20',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'meeting-his-parents-same-age-mom',
    act: 3,
    stage: 4,
    minAgeGap: 10,
    title: 'Meeting His Parents (When His Mom Is Your Exact Age—Or Two Years Younger!)',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Met my 26yo cub’s parents—his mom is 48, I’m 49, and Rule #1 saved us: he briefed them respectfully a week beforehand!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'thanksgiving_table',
    setupHer:
      'Another legendary forum milestone: meeting {hisName}’s ({hisAge}M) parents for dinner—knowing full well his mom is right in your generational bracket (and listened to the exact same high-school graduation songs!). Halfway through appetizers, his mom pulls {hisName} toward the kitchen asking quietly: *"Sweetheart, are you sure she’s serious about someone your age?"*',
    setupHim:
      'You’re introducing {herName} ({herAge}F) to your parents over dinner. Your dad blinks doing silent birth-year math while your mom—who is right around {herName}’s age—pulls you aside in the hallway whispering: *"Honey, what about timelines and grandkids? Are you in over your head?"*',
    choices: [
      {
        labelHer: 'Because he briefed them respectfully a week ahead (no ambush!), he answers his mom in the kitchen with calm, grown-man conviction, clears every plate, and lets his mom see how radiant and grounded you two are.',
        labelHim: 'Prep your parents a week ahead (never blindside!), tell your mom calmly in the hallway "She makes me happier and better than anyone I’ve ever dated, and I’d love for you to really know her," and handle dish duty.',
        outcomeHer:
          'By coffee, you and his mom are laughing over 90s travel stories while his dad pours {hisName} the good bourbon. Forum Masterclass!',
        outcomeHim:
          'Standing calmly as a grown man—without getting defensive—melts your mom’s protective fear into genuine respect by dessert.',
        toastBanner: 'PARENTS WON OVER! • MATURITY +30 • EQ +25',
        deltas: { maturity: 30, chivalry: 20, eq: 25, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Same-Age Mom Dinner Diplomat',
      },
      {
        labelHer: 'He never warned them about your age—springing a shock ambush at the front door—then whines "MOM YOU NEVER LET ME LIVE!!" at the table.',
        labelHim: 'Ambush your parents unannounced with the age gap at the door, then argue like a 15-year-old over salad.',
        outcomeHer:
          'Forum Cardinal Sin #1 (the unwarned parent ambush) PLUS teenage whining? Get me out of this dining room!',
        outcomeHim:
          'Ambushing your parents sets your partner up to fail—always prep family with respect first.',
        toastBanner: 'RED FLAG! • UNWARNED PARENT AMBUSH (-25)',
        deltas: { maturity: -30, chivalry: -15, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Meet at a warm, neutral restaurant for a crisp 90-minute dinner rather than a 6-hour house stay.',
        labelHim: 'Host the first intro at a relaxed neighborhood bistro (your treat!) so everyone is on neutral ground.',
        outcomeHer:
          'Neutral restaurant + picking up the tab = textbook forum wisdom.',
        outcomeHim:
          'Covering dinner on neutral turf establishes your adulthood instantly.',
        toastBanner: 'NEUTRAL-TURF GENIUS +20',
        deltas: { maturity: 25, chivalry: 20, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },

  // --- 4 EXISTING VIP SUBREDDIT DEEP-CUT EPISODES (isVip: true preserved!) ---
  {
    id: 'vip-apartment-soap-audit',
    act: 2,
    stage: 3,
    minigame: 'room_audit',
    title: 'VIP Deep-Cut: First Time Hosting at His Place (The Soap & Bedframe Audit)',
    subredditThreadInspiration: 'r/CougarsAndCubs: "How to prepare for first time hosting? Clean linens, soap, and a lidded bin!"',
    isVip: true,
    creditCost: 2,
    sceneArt: 'bathroom_audit',
    setupHer:
      'For the first time, you come over to *{hisName}’s* apartment. Every woman on r/CougarsAndCubs knows the silent 10-second checklist the moment she steps into a {hisAge}-year-old’s place.',
    setupHim:
      '{herName} is coming to YOUR place tonight for the first time. Time for the ultimate r/CougarsAndCubs apartment inspection!',
    recommendedAffiliateId: 'hosting-lidded-bin-soap',
    choices: [
      {
        labelHer: 'Oak bedframe, crisp white percale sheets, eucalyptus hand soap, plush guest towels, AND a matte-black lidded bathroom trash can.',
        labelHim: 'Prep like a king: real bedframe, fresh 600TC cotton sheets, botanical hand soap, sparkling mirror, and a lidded bathroom bin.',
        outcomeHer:
          'You step out of his bathroom genuinely stunned—he read the sacred texts. Instant green light to stay till morning.',
        outcomeHim:
          'She emerges from your bathroom smiling ear to ear: "A lidded trash can AND real linen towels? Who raised you—and can I thank her?"',
        toastBanner: 'LIDDED BIN CERTIFIED! • CHEMISTRY +30',
        deltas: { maturity: 25, chivalry: 20, eq: 20, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Trash Can With a Lid Certified',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'Bare mattress on the floor, one flat grey pillow, 5-in-1 shampoo/dish-soap bottle, and an open wire wastebasket.',
        labelHim: 'Wing it with navy polyester sheets, 3-in-1 body wash, and one damp gym towel.',
        outcomeHer:
          'You suddenly remember an "early 7 AM Peloton class" and call an Uber back to your palace.',
        outcomeHim:
          'She takes one glance at the 3-in-1 body wash and magically remembers an early morning meeting.',
        toastBanner: 'RED FLAG! • DORM BATHROOM VIOLATION',
        deltas: { maturity: -25, chivalry: -15, eq: -15, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Modest studio budget, spotless surfaces, fresh flowers on the table, and her favorite sparkling water stocked in the fridge.',
        labelHim: 'Small entry-level studio, scrubbed spotless, stocked with her exact LaCroix flavor and clean cotton sheets.',
        outcomeHer:
          'Proof of what Cougars repeat daily: square footage doesn’t matter—cleanliness and thoughtfulness do.',
        outcomeHim:
          'She couldn’t care less that it’s a small studio; stocking her favorite drink in a spotless space melts her.',
        toastBanner: 'THOUGHTFUL HOST +20',
        deltas: { maturity: 20, chivalry: 20, eq: 15, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'vip-palm-springs-income-gap',
    act: 2,
    stage: 3,
    title: 'VIP Deep-Cut: 5-Star Palm Springs Weekend & The 3x Income Gap',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Navigating luxury vacations when she earns 3x more without bruising pride"',
    isVip: true,
    creditCost: 3,
    sceneArt: 'palm_springs_pool',
    setupHer:
      'You booked a sunlit boutique resort in Palm Springs with credit-card points because you refuse to downgrade your vacations—how does {hisName} handle the luxury gap poolside?',
    setupHim:
      '{herName} booked a gorgeous boutique Palm Springs suite way above your entry-level bracket. How do you show up as an equal partner all weekend?',
    recommendedAffiliateId: 'princess-mulberry-silk-robe',
    choices: [
      {
        labelHer: 'He drives the whole road trip, handles every bag, books + pays for a surprise sunset dinner within his budget, and rubs SPF onto your shoulders.',
        labelHim: 'Drive the whole route, carry every bag, book and cover a romantic bistro dinner you researched, and handle poolside SPF duty.',
        outcomeHer:
          'Zero weirdness about money, 100% effort, chivalry, and sun-soaked desert chemistry. Best weekend all year.',
        outcomeHim:
          'Effort and initiative bridge any income gap effortlessly—she lounges in silk robes grinning all weekend.',
        toastBanner: 'DESERT ESCAPE PERFECTION • CHIVALRY +25',
        deltas: { maturity: 20, chivalry: 25, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Palm Springs Poolside MVP',
      },
      {
        labelHer: 'He sulks quietly whenever the resort concierge hands you the room folio.',
        labelHim: 'Get defensive and moody about the hotel price tag all Saturday.',
        outcomeHer:
          'Fragile financial ego turns paradise tense—maturity means celebrating her success, not competing with it.',
        outcomeHim:
          'Sulking ruins the desert sun; confidence means bringing full value in effort and presence.',
        toastBanner: 'RED FLAG! • BRUISED INCOME EGO (-15)',
        deltas: { maturity: -15, chivalry: -10, eq: -15, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Agree upfront: she covers the hotel points, you cover gas, cocktails, and Sunday brunch.',
        labelHim: 'Set a clear, cheerful split before leaving: she’s got the suite, you’ve got road-trip playlist, gas, drinks, and brunch.',
        outcomeHer:
          'Clear communication upfront = zero awkwardness all weekend.',
        outcomeHim:
          'Healthy, transparent team play straight out of top subreddit advice.',
        toastBanner: 'PROPORTIONAL TEAMWORK +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'vip-thanksgiving-double-boss',
    act: 3,
    stage: 4,
    title: 'VIP Deep-Cut: Thanksgiving With Her 23yo Son & His Class-of-’97 Mom',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Met my cub’s parents—his mom and I graduated high school the same year"',
    isVip: true,
    creditCost: 3,
    sceneArt: 'thanksgiving_table',
    setupHer:
      'Holiday crossover episode: you’re meeting {hisName}’s mother—who is right around your age and loved the exact same 1997 Alanis Morissette tour.',
    setupHim:
      'Your mom and {herName} ({herAge}F) are standing side by side in the kitchen reaching for the wine opener while your dad blinks rapidly.',
    choices: [
      {
        labelHer: 'Anchor the room with calm warmth—he introduces you proudly as his partner, helps clear every dish, and lets his mom see how happy and grounded he is.',
        labelHim: 'Introduce her proudly without apologizing, jump on dish duty, and let your mom see how grounded, happy, and respectful you two are.',
        outcomeHer:
          'By pie o’clock, you and his mom are bonding over 90s concerts while he beams from the sink. Legendary holiday survival.',
        outcomeHim:
          'Seeing how calm and maturely you carry yourself wins your mom over completely by dessert.',
        toastBanner: 'HOLIDAY BOSS CLEARED! • MATURITY +30',
        deltas: { maturity: 30, chivalry: 20, eq: 25, chemistry: 15, redFlags: 0 },
        badgeUnlocked: 'Class-of-’97 Holiday Survivor',
      },
      {
        labelHer: 'He reverts into a moody teenager snapping "MOM STOP" at the dinner table.',
        labelHim: 'Revert to 16-year-old son mode arguing with your mom over turkey.',
        outcomeHer:
          'Nothing shatters attraction faster than watching a Cub regress into high-school rebellion in front of his parents.',
        outcomeHim:
          'Regressing into teenage dynamics at the table makes everyone acutely feel the age gap.',
        toastBanner: 'RED FLAG! • TEENAGE REGRESSION (-25)',
        deltas: { maturity: -25, chivalry: -10, eq: -20, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Bring a standout local bakery pie and keep the first holiday visit to 90 warm, gracious minutes.',
        labelHim: 'Prep your parents a week ahead, bring her favorite wine + bakery pie, and keep the first visit crisp and warm.',
        outcomeHer:
          'Preparation + bounded visit length = peaceful Thanksgiving miracle.',
        outcomeHim:
          'Never springing an age-gap surprise unannounced at the door is rule #1 of family intros.',
        toastBanner: 'DIPLOMATIC MASTERCLASS +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 10, redFlags: 0 },
      },
    ],
  },
  {
    id: 'vip-trader-joes-wild-approach',
    act: 2,
    stage: 1,
    title: 'VIP Deep-Cut: "In the Wild" Trader Joe’s Olive-Oil Aisle Approach',
    subredditThreadInspiration: 'r/CougarsAndCubs: "How did you meet in the wild without dating apps—and without breaking Not Dating 101?"',
    isVip: true,
    creditCost: 2,
    sceneArt: 'trader_joes_aisle',
    setupHer:
      'Dating app age sliders filter out half the Cubs in town—so here {hisName} is in real life beside the imported Tuscan olive oil and peonies at Trader Joe’s.',
    setupHim:
      'Forget app age filters—{herName} is right beside you choosing olive oil in sunlit athleisure. Shoot your shot cleanly without sounding like a pickup TikTok!',
    recommendedAffiliateId: 'date-night-oud-bergamot',
    choices: [
      {
        labelHer: 'He makes an easy, genuine comment about the Sicilian olive oil, reads your warm body language, and hands you his card/number with zero pressure.',
        labelHim: 'Spark an easy 30-second exchange about the Sicilian olive oil, read her smile, and offer *your* number on a slip so she has zero pressure.',
        outcomeHer:
          'Natural, respectful, confident, and gave *you* the power to text—you message him before leaving the parking lot.',
        outcomeHim:
          'Zero creepy hovering, zero age mention—giving her your number puts her completely at ease. Your phone buzzes ten minutes later!',
        toastBanner: 'IN-THE-WILD NATURALS +25',
        deltas: { maturity: 20, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Trader Joe’s Wild-Catch Pro',
      },
      {
        labelHer: 'He blocks your cart and opens with: "Excuse me miss, I love older women!"',
        labelHim: 'Open with "Excuse me ma’am, I’m really into older women!" next to the frozen dumplings.',
        outcomeHer:
          '"MA’AM"?! Straight to jail. Do not pass Go, do not collect peonies.',
        outcomeHim:
          'Calling her "ma’am" AND announcing an age fetish in aisle 4? Instant cart U-turn.',
        toastBanner: 'RED FLAG! • "MA’AM" IN AISLE 4 (-25)',
        deltas: { maturity: -20, chivalry: -15, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Trade smiles over the flowers and grab coffee at the café next door for fifteen minutes.',
        labelHim: 'Point out the fresh peonies, share a laugh, and invite her for a quick 15-minute espresso next door.',
        outcomeHer:
          'Daylight, low-stakes, charming spontaneity.',
        outcomeHim:
          'Daytime espresso right next door is breezy, safe, and effortlessly confident.',
        toastBanner: 'SPONTANEOUS CHARM +20',
        deltas: { maturity: 15, chivalry: 15, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },

  // --- 6 ROMANTIC GETAWAY, CAMPUS PHD SUSHI, FIERY FOREIGN, BOWLING/PICNIC & ANNIVERSARY MILESTONE EPISODES ---
  {
    id: 'spontaneous-18h-pool-sauna-getaway',
    act: 2,
    stage: 2,
    title: 'The Spontaneous 18-Hour Getaway: App Video Chat → Rooftop → Hotel Pool & Sauna',
    subredditThreadInspiration: 'Cougars & Cubs Club Original • "2-hour FaceTime vibe check → 18-hour coastal rooftop, heated midnight pool & cedar sauna escape"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'palm_springs_pool',
    setupHer:
      'Instead of three weeks of pen-pal texting, your FaceTime vibe check with {hisName} ({hisAge}M) goes two electric hours past midnight. Next thing you know, you both carve out an **18-hour spontaneous escape** in a boutique hotel town an hour away—starting with golden-hour rooftop cocktails where nobody knows either of you, followed by the heated outdoor hotel pool and cedar sauna after dark.',
    setupHim:
      'Your video call with {herName} ({herAge}F) had off-the-charts chemistry—so you boldly proposed meeting halfway in a boutique getaway town for **18 unforgettable hours**: sunset rooftop drinks, late-night heated hotel pool laps, and cedar sauna steam before checking out at 11 AM.',
    recommendedAffiliateId: 'princess-mulberry-silk-robe',
    choices: [
      {
        labelHer: 'He arrives 15 minutes early with carry-on polish, claims a sunset rooftop corner booth, transitions seamlessly to midnight pool & cedar-sauna conversation, and orders room-service espresso before checkout.',
        labelHim: 'Arrive early in crisp linen, own the rooftop sunset toast, keep the midnight hotel pool & cedar sauna effortlessly sensual and attentive, and have hot coffee waiting at 9 AM.',
        outcomeHer:
          'Eighteen hours in another zip code feels like a three-week European romance—riding the elevator down at checkout, neither of you wants to get into separate cars!',
        outcomeHim:
          'Steam rising off the midnight hotel pool + cedar sauna glow + zero awkwardness = the legendary 18-hour first-date story you’ll tell for years.',
        toastBanner: '18-HOUR GETAWAY MAGIC! • CHEMISTRY +30 • CHIVALRY +25',
        deltas: { maturity: 20, chivalry: 25, eq: 20, chemistry: 30, redFlags: 0 },
        badgeUnlocked: '18-Hour Pool & Sauna Getaway Legend',
      },
      {
        labelHer: 'He shows up two hours late with a trash bag for luggage, gets sloppy on rooftop shots, and cannonballs next to strangers in the hotel pool.',
        labelHim: 'Show up late, overdo the rooftop tequila, and cannonball into the quiet boutique pool.',
        outcomeHer:
          'Thankfully an 18-hour trip has an 11 AM checkout—and a locked connecting door!',
        outcomeHim:
          'Spring-break frat behavior in a boutique sauna ends the getaway before midnight.',
        toastBanner: 'RED FLAG! • SPRING-BREAK CANNONBALL (-25)',
        deltas: { maturity: -25, chivalry: -20, eq: -20, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Do a quick video-call safety check first, share live location with your bestie, and savor every rooftop + sauna minute stress-free.',
        labelHim: 'Send her the boutique hotel itinerary & reservation confirmation upfront so she feels 100% safe and pampered.',
        outcomeHer:
          'Smart safety habits + spontaneous chemistry = peak adult adventure.',
        outcomeHim:
          'Proactive transparency lets her relax completely into the rooftop & sauna romance.',
        toastBanner: 'SAFE SPONTANEITY PRO +20',
        deltas: { maturity: 25, chivalry: 20, eq: 25, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'campus-stroll-sushi-professor-student',
    act: 2,
    stage: 2,
    title: 'Campus Stroll & Omakase Sushi: Dressing Younger & Playing "Professor & Student"',
    subredditThreadInspiration: 'Cougars & Cubs Club Original • "Fresh PhD grad + sneakers on the autumn quad + omakase sushi & playful Professor/Student banter"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    setupHer:
      '{hisName} ({hisAge}M) just defended his PhD and finally has free evenings to date! For tonight’s date on his leafy university quad, you swap your corner-office heels for crisp white sneakers, fitted denim, and a sleek bomber jacket—blending right in on the brick walkway before slipping into a candlelit campus sushi bar and leaning into cheeky **"Visiting Professor & Star Grad Student After Office Hours"** banter.',
    setupHim:
      'Now that your dissertation is finally signed, you invite {herName} ({herAge}F) for a golden-hour walk across your old campus quad followed by omakase sushi. She shows up looking effortlessly radiant in sneakers and a fitted jacket—and raises one eyebrow across the warm sake: *"Careful, Mr. Doctoral Candidate… your oral exam isn’t over yet."*',
    choices: [
      {
        labelHer: 'Own the playful "strict Visiting Professor" bit over spicy tuna & warm sake while he plays the eager top-of-the-class scholar—holding hands back across the lantern-lit quad!',
        labelHim: 'Match her wit ("Yes, Professor—happy to stay late for extra credit"), pour her warm sake properly, and kiss her under the quad archways after sushi.',
        outcomeHer:
          'Dressing down in sneakers + intellectual sparks + cheeky office-hours roleplay makes you both laugh so hard you almost miss last call on nigiri!',
        outcomeHim:
          'Brains + playful banter + sleeper-build forearms = an A+ oral defense with immediate "extra credit" back at her place.',
        toastBanner: 'EXTRA CREDIT UNLOCKED! • CHEMISTRY +30 • EQ +20',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Summa Cum Laude Sushi Roleplay',
      },
      {
        labelHer: 'He spends 90 minutes lecturing you about p-values and forgets to ask a single question about your life.',
        labelHim: 'Monologue nonstop about footnote citations and mansplain sushi etiquette.',
        outcomeHer:
          'You survived a real career—you didn’t dress cute on a Friday for an unpaid statistics seminar!',
        outcomeHim:
          'Turning a hot sushi date into a dry dissertation defense fails the vibe check instantly.',
        toastBanner: 'RED FLAG! • 90-MINUTE LECTURE SNOOZE (-20)',
        deltas: { maturity: -15, chivalry: -15, eq: -20, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Toast his PhD milestone with celebratory toro nigiri and ask what non-academic adventure he’s been dying to try first.',
        labelHim: 'Thank her for celebrating your graduation milestone and plan a zero-screens weekend adventure next.',
        outcomeHer:
          'Catching a brilliant, newly freed PhD right as he re-enters the dating world is pure insider alpha.',
        outcomeHim:
          'Celebrating milestones together builds genuine emotional momentum.',
        toastBanner: 'POST-PHD SPARK +20',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'fiery-foreign-cougar-passion-test',
    act: 2,
    stage: 2,
    title: 'Spicy Foreign Cougar × Devoted Cub: Accents, Passion & Zero Lukewarm Energy',
    subredditThreadInspiration: 'Cougars & Cubs Club Original • "Worldly accented fire meets steady devotion—when she switches into her native language, hold your frame!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'princess_bouquet',
    setupHer:
      'Lukewarm American small-talk bores you to tears: when you love, cook, dance, or call out nonsense, your accent sharpens and the temperature in the room jumps ten degrees. Tonight at a bustling wine bar, {hisName} ({hisAge}M)—who openly adores worldly, fiery international women—gets his first taste of your rapid-fire native-tongue passion.',
    setupHim:
      'You’ve always been magnetic toward worldly, accented, fiery women over bland dating-app small talk. Tonight {herName} ({herAge}F) switches into rapid-fire native phrases—half teasing your boldness, half testing whether a {hisAge}-year-old man can handle real fire without shrinking!',
    choices: [
      {
        labelHer: 'He holds steady eye contact smiling, replies smoothly with two genuinely well-pronounced romantic phrases in your language, pulls out your chair, and matches your fire beat for beat.',
        labelHim: 'Hold calm, confident eye contact with a warm grin, drop one effortlessly practiced compliment in her native language, and step right into her salsa/wine-bar rhythm.',
        outcomeHer:
          'Finally—a younger man who isn’t intimidated by passion, volume, or culture! Within ten minutes you’re whispering *"mi cielo"* against his collar.',
        outcomeHim:
          'Her eyes flash with pure delight: when a fiery woman realizes she doesn’t have to dim her spark around you, the passion is unmatched.',
        toastBanner: 'INTERNATIONAL FIRE MATCHED! • CHEMISTRY +30 • CHIVALRY +20',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Fluent in Fiery Romance',
      },
      {
        labelHer: 'He tells you to "calm down, spicy fiery woman!!" and butchers a cringey TikTok meme phrase.',
        labelHim: 'Tell her to "relax" and repeat a stereotyping movie accent joke.',
        outcomeHer:
          'Telling a passionate woman to "calm down" is how you end up wearing your sangria!',
        outcomeHim:
          'Fetishizing clichés or telling her to tone down her personality ends the night on the spot.',
        toastBanner: 'RED FLAG! • "CALM DOWN" FATALITY (-25)',
        deltas: { maturity: -25, chivalry: -20, eq: -25, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Cook a late-night dish from your hometown together while trading music from where you each grew up.',
        labelHim: 'Ask her to teach you her favorite dish and song from home over a bottle of bold red.',
        outcomeHer:
          'Sharing real heritage and kitchen music hits straight to the heart.',
        outcomeHim:
          'Genuine curiosity about her culture and story beats surface flattery every time.',
        toastBanner: 'WORLDLY CONNECTION +20',
        deltas: { maturity: 20, chivalry: 20, eq: 25, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'retro-bowling-and-meadow-picnic',
    act: 2,
    stage: 3,
    title: 'Old-World Pride on a Modest Budget: Meadow Picnic & Retro Neon Bowling',
    subredditThreadInspiration: 'Cougars & Cubs Club Original • "Modest roots, gentleman pride: hand-packed golden-hour meadow picnic + retro neon bowling"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'princess_bouquet',
    setupHer:
      '{hisName} ({hisAge}M) comes from a modest, hardworking background—warm accent, immaculate ironed shirt, zero trust-fund flash, and fierce gentleman pride about impressing you with *effort* rather than credit-card flexing. For Saturday, he packs a handmade meadow picnic (fresh baguette, strawberries, cheeses from home, wildflowers) followed by trash-talking **retro neon bowling**!',
    setupHim:
      'You didn’t grow up with country-club money, and {herName} ({herAge}F) can afford any five-star restaurant in town on her own. Instead of faking wealth or splitting chains, you lean into old-school romance: a hand-packed golden-hour **park picnic** followed by playful **retro neon bowling**.',
    choices: [
      {
        labelHer: 'Melt over his homemade picnic spread, lace up the retro bowling shoes laughing, let him spin you around after a spare, and kiss him by the jukebox.',
        labelHim: 'Lay out the linen picnic blanket with pride, open every door, hype up every bowling frame she throws, and spin her into a kiss when she hits a strike.',
        outcomeHer:
          'Watching an earnest, accented younger man pour 100% heart and creativity into a $35 Saturday makes every lazy $300 finance-bro dinner you’ve ever had look pathetic!',
        outcomeHim:
          'She links her arm through yours walking out of the bowling alley: "That was the most fun Saturday date I’ve had in ten years—and wait till you taste my *Big Carl* Cougar Town wine pour at home."',
        toastBanner: 'OLD-WORLD CHARM VICTORY! • CHIVALRY +30 • CHEMISTRY +25',
        deltas: { maturity: 25, chivalry: 30, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Picnic & Neon-Bowling Heartthrob',
      },
      {
        labelHer: 'He apologizes forty times for not being rich, sulks about the bowling shoes, and makes his budget awkward.',
        labelHim: 'Spend all afternoon apologizing insecurely about money instead of owning the date.',
        outcomeHer:
          'Self-pity kills romance—effort and confidence were already winning!',
        outcomeHim:
          'Never apologize for an honest budget when your planning and effort are 10/10.',
        toastBanner: 'RED FLAG! • SELF-PITY SPIRAL (-15)',
        deltas: { maturity: -15, chivalry: -10, eq: -15, chemistry: -15, redFlags: 1 },
      },
      {
        labelHer: 'Turn bowling into a cheeky wager: winner picks tonight’s movie (loser pours the "Cougar Town" Big Carl wine glasses!).',
        labelHim: 'Make a playful bowling bet—winner chooses midnight dessert, loser gives a 20-minute shoulder massage.',
        outcomeHer:
          'Flirty competition + zero pretentiousness = pure rom-com gold.',
        outcomeHim:
          'Playful stakes turn a simple bowling lane into electric foreplay.',
        toastBanner: 'NEON LANE SPARKS +20',
        deltas: { maturity: 15, chivalry: 20, eq: 20, chemistry: 25, redFlags: 0 },
      },
    ],
  },
  {
    id: 'milestone-six-month-anniversary',
    act: 3,
    stage: 6,
    minigame: 'big_carl_pour',
    title: '🥂 6-Month Anniversary Milestone: Spare Keys, "Big Carl" Wine & Beating the Odds',
    subredditThreadInspiration: '6-Month Milestone • "Six months strong: spare brass house key, peonies & giant Cougar Town Big Carl wine pours"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'houseboy_apron',
    setupHer:
      '**Six-Month Milestone Unlocked!** Half a year ago it was one electric check-drop and an age-slider experiment. Tonight, {hisName} ({hisAge}M) has his own skincare spot on your vanity, knows your exact coffee & star-sign quirks, and shows up for your **6-Month Anniversary** with peonies, a handwritten card, and two comically giant *Cougar Town* **"Big Carl"** wine pours.',
    setupHim:
      '**Six-Month Milestone Unlocked!** Every skeptic gave you and {herName} ({herAge}F) three weekends max. Six months later, you’ve survived generational slang, family age math, and 2 AM doubts—how do you mark half a year together tonight?',
    choices: [
      {
        labelHer: 'Slide a brass spare house key across the table beside your "Big Carl" wine glass, read his handwritten letter aloud, and plan your autumn trip together.',
        labelHim: 'Give her a deeply personal handwritten 6-month letter (referencing the tiny detail you noticed on Date #1), toast "Big Carl"-style, and map out your next trip.',
        outcomeHer:
          'Seeing his eyes light up over the brass spare key—six months of consistency, laughter, and electric chemistry officially sealed!',
        outcomeHim:
          'She presses the spare key into your palm grinning: "Six months down—and you still open every car door like it’s Friday #1."',
        toastBanner: '6-MONTH MILESTONE SEALED! • ALL STATS +20',
        deltas: { maturity: 20, chivalry: 25, eq: 20, chemistry: 25, redFlags: 0 },
        badgeUnlocked: '6-Month Brass Key & "Big Carl" Certified',
      },
      {
        labelHer: 'He hits month six and suddenly panics asking "Wait… what are we?" like a situationship bro.',
        labelHim: 'Hit six months and pull a vague "let’s not put labels on it" situationship dodge.',
        outcomeHer:
          'Six months in and allergic to labels?! Hand back the drawer space immediately!',
        outcomeHim:
          'Pulling situationship games at six months vaporizes half a year of goodwill.',
        toastBanner: 'RED FLAG! • 6-MONTH SITUATIONSHIP DODGE (-25)',
        deltas: { maturity: -25, chivalry: -20, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Recreate your exact first date—same booth, same order, zero first-night nerves.',
        labelHim: 'Book the exact corner booth from Date #1 and surprise her with her signature drink waiting.',
        outcomeHer:
          'Nostalgic, romantic, and effortless.',
        outcomeHim:
          'Remembering the exact booth and drink from six months ago is elite boyfriend craft.',
        toastBanner: 'DATE #1 CALLBACK +20',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'milestone-one-year-anniversary',
    act: 3,
    stage: 6,
    title: '💍 1-Year Anniversary Finale: Four Seasons Strong & Defying Every Stereotype',
    subredditThreadInspiration: '1-Year Finale • "365 days strong: champagne under the stars by the heated midnight pool"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'palm_springs_pool',
    setupHer:
      '**One-Year Anniversary Finale!** Four full seasons with {hisName} ({hisAge}M): his friends adore you, your inner circle stopped asking "Is it just a phase?" months ago, and you’ve checked into a candlelit coastal suite with a heated midnight pool to toast **365 days** of choosing each other out loud.',
    setupHim:
      '**One-Year Anniversary Finale!** One full year with {herName} ({herAge}F)—from catching dating-app red flags to holidays, inside jokes, and building a real partnership that outshines every same-age couple you know. Time for the 365-day toast!',
    recommendedAffiliateId: 'couples-intimacy-deck',
    choices: [
      {
        labelHer: 'Raise champagne under the stars poolside, thank him for loving every chapter of who you are, and step into Year Two hand-in-hand without a single apology.',
        labelHim: 'Toast 365 days poolside ("Best decision I ever made was ignoring the age slider"), slip a timeless keepsake onto her wrist, and claim Year Two with full devotion.',
        outcomeHer:
          'One year in, zero masks, total peace, and butterflies that still hit like Night #1—you officially beat Cougars & Cubs Club at highest romance rank!',
        outcomeHim:
          'She pulls you into the warm pool water laughing under the lights—365 days strong and just getting started.',
        toastBanner: '🏆 1-YEAR ANNIVERSARY CHAMPIONS! • +30 ROMANCE PAYOFF',
        deltas: { maturity: 25, chivalry: 25, eq: 25, chemistry: 30, redFlags: 0 },
        badgeUnlocked: '365-Day Cougar & Cub Anniversary Crown',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He forgets your 1-year anniversary completely and schedules a boys’ gaming tournament.',
        labelHim: 'Forget your one-year anniversary date completely.',
        outcomeHer:
          'Forgetting the 1-year anniversary at the 1-yard line?! Tragic fumble!',
        outcomeHim:
          'Never fumble the 365-day finish line—set three calendar reminders!',
        toastBanner: 'RED FLAG! • FORGOT THE 1-YEAR ANNIVERSARY (-30)',
        deltas: { maturity: -30, chivalry: -30, eq: -25, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Post an anonymous 1-Year Success Story together to inspire the next Cougar & Cub couple.',
        labelHim: 'Celebrate quietly with a weekend phone-off retreat and write down your Year-Two bucket list together.',
        outcomeHer:
          'Grounded, joyful, and inspiring.',
        outcomeHim:
          'Intentional Year-Two planning keeps the spark compounding.',
        toastBanner: 'YEAR-TWO BUCKET LIST +25',
        deltas: { maturity: 25, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
      },
    ],
  },

  // --- 4 REDDIT "IN THE WILD" & POP-CULTURE BLOCKBUSTER SCENES (BABYGIRL MILK, GYM HEADPHONES, CUBSPLAINING/ID, HOTEL 2-QUEENS) ---
  {
    id: 'babygirl-hotel-bar-milk-or-martini',
    act: 2,
    stage: 1,
    title: 'Solo Business-Trip Hotel Bar: The Viral "Babygirl" Glass-of-Milk Dare!',
    subredditThreadInspiration: 'Pop-Culture Cinema Dare • "Solo work-trip hotel bar: dirty martini + cheeky Babygirl oat-milk wink"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    setupHer:
      'An upscale **hotel lobby bar** on a solo work trip is the #1 "in-the-wild" spot for lightning to strike. You’re unwinding in silk after a keynote when the bartender sets down TWO glasses from {hisName} ({hisAge}M) at the end of the bar: your exact dirty martini—AND, with a cheeky wink referencing Nicole Kidman’s viral ***Babygirl*** scene, a tiny shot glass of cold oat milk with a cocktail napkin reading: *"Pick your poison—zero pressure."* ',
    setupHim:
      '{herName} ({herAge}F) is unwinding solo at the boutique hotel bar—radiating pure CEO poise. Everyone knows the infamous ***Babygirl*** "send her a glass of milk across the bar" movie moment, and rule #1 of hotel-bar etiquette is never interrupting a solo traveler rudely. How do you make your opening move?',
    choices: [
      {
        labelHer: 'Burst out laughing at the cheeky *Babygirl* visual gag, raise the dirty martini in a toast, wave him over for a 20-minute nightcap, and watch sparks fly.',
        labelHim: 'Send her exact martini alongside a miniature comedy *Babygirl* milk-shot wink on a napkin—giving her a laugh AND total control over whether to wave you over.',
        outcomeHer:
          'Self-aware pop-culture wit + actual martini class + respecting solo hotel-bar boundaries = the smoothest "in-the-wild" opener of the year!',
        outcomeHim:
          'She laughs into her hand, holds up the martini glass, and motions to the leather barstool beside her: "Okay, points for cinema literacy AND ordering gin properly."',
        toastBanner: 'HOTEL BAR CINEMA! • CHEMISTRY +30 • EQ +25',
        deltas: { maturity: 20, chivalry: 25, eq: 25, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Survived the "Babygirl" Hotel-Bar Test',
      },
      {
        labelHer: 'He sends an unironic pint of warm whole milk to your lactose-intolerant self and whispers "good girl" like a TikTok cringe reel.',
        labelHim: 'Send a literal pint of warm whole milk with zero context and try to growl a movie line to a stranger.',
        outcomeHer:
          'Warm dairy at 9:30 PM?! Security—and Lactaid—to the lobby bar immediately!',
        outcomeHim:
          'Life is not an A24 screenplay—unsolicited dairy + zero rapport gets an immediate tab close.',
        toastBanner: 'RED FLAG! • UNIRONIC WARM DAIRY CRIME (-25)',
        deltas: { maturity: -25, chivalry: -15, eq: -25, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Chat effortlessly for 30 minutes at the bar, exchange numbers, and keep your solo beauty sleep intact for Round 2 Friday.',
        labelHim: 'Keep the hotel-bar conversation brisk, witty, and bounded to one drink so she gets great sleep before her morning flight.',
        outcomeHer:
          'Leaving on a high note after one electric hotel-bar drink guarantees Date #2.',
        outcomeHim:
          'Knowing when to end a hotel-bar meet-cute after 30 electric minutes is peak confidence.',
        toastBanner: 'HOTEL LOUNGE CLASS +20',
        deltas: { maturity: 25, chivalry: 20, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'gym-headphones-vs-three-week-nod',
    act: 2,
    stage: 1,
    title: '"In the Wild" Gym Law: The AirPods Max Crime vs. The 3-Week Slow Burn',
    subredditThreadInspiration: 'r/CougarsAndCubs #1 FAQ: "PSA to Cubs: NEVER tap a woman’s shoulder mid-squat when her headphones are on—play the 3-week polite nod game!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'ridge_trail_leash',
    setupHer:
      'Every single week on `r/CougarsAndCubs`, younger guys ask how to approach a fit Cougar at the gym—and every woman replies with the Sacred Headphone Law. You’re in the zone with noise-canceling headphones on; {hisName} ({hisAge}M) has been training in the next rack at 7 AM for three weeks.',
    setupHim:
      'You’ve spotted {herName} ({herAge}F) crushing RDLs at your 7 AM gym for three weeks straight. Right now her over-ear noise-canceling headphones are ON. Every veteran on `r/CougarsAndCubs` is watching—what’s your play?',
    choices: [
      {
        labelHer: 'He NEVER interrupts a single set while your headphones are on—just trades warm smiles for three weeks, reracks his 45-lb plates cleanly, and strikes up an easy 60-second chat at the smoothie bar *after* your headphones come off!',
        labelHim: 'Respect the headphones 100% during sets, rerack your weights like an adult, build three weeks of friendly eye-contact rapport, and say hi naturally at the smoothie counter once her headphones are off.',
        outcomeHer:
          'Patience, gym etiquette, AND reracking 45-lb plates without slamming them? You suggest post-workout coffee before he even finishes his sentence!',
        outcomeHim:
          'Respecting her workout zone puts you ahead of 99% of gym bros—she smiles wide at the smoothie bar and locks in Saturday coffee.',
        toastBanner: 'SACRED HEADPHONE LAW PASSED! • EQ +25 • MATURITY +25',
        deltas: { maturity: 25, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Gym Headphone Etiquette MVP',
      },
      {
        labelHer: 'He waves his hand two inches from your face mid-squat to make you take off your headphones and critiques your form.',
        labelHim: 'Interrupt her mid-rep with headphones on and offer unsolicited form advice.',
        outcomeHer:
          'Interrupting a woman mid-set TO MANSPLAIN HER SQUAT FORM?! Banned from this zip code!',
        outcomeHim:
          'Breaking the headphone rule + unsolicited form coaching = permanent gym pariah status.',
        toastBanner: 'RED FLAG! • MID-SET HEADPHONE VIOLATION (-25)',
        deltas: { maturity: -25, chivalry: -20, eq: -30, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Ask him to spot one heavy bench set—letting you initiate the conversation on your own terms.',
        labelHim: 'Wait until she asks if you’re using the cable attachment, keep it breezy and respectful, and let the rapport build.',
        outcomeHer:
          'Zero pressure, total comfort, natural gym spark.',
        outcomeHim:
          'Letting her set the pace at the gym wins trust effortlessly.',
        toastBanner: 'SLOW-BURN GYM RAPPORT +20',
        deltas: { maturity: 20, chivalry: 15, eq: 25, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'cubsplaining-and-bouncer-id-check',
    act: 2,
    stage: 2,
    title: '"Cubsplaining" 2008 Mortgages & The Bouncer UV-Flashlight ID Check',
    subredditThreadInspiration: 'r/CougarsAndCubs Pet Peeve Hall of Fame: "When he tries to explain Fleetwood Mac to you—right before the bouncer inspects HIS ID for 45 seconds"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'waiter_shock',
    setupHer:
      'Two classic `r/CougarsAndCubs` comedy moments hit back-to-back outside a speakeasy jazz bar: in line, {hisName} ({hisAge}M) catches himself mid-sentence starting to explain how vinyl pressings and fixed-rate mortgages work (*"Cubsplaining"*!). Five seconds later, the 23-year-old bouncer shines a UV flashlight on **{hisName}’s** license for 40 seconds while waving you straight through the velvet rope.',
    setupHim:
      'Outside the jazz lounge with {herName} ({herAge}F), you realize two seconds into a sentence about *Rumours*-era Fleetwood Mac that she literally owned the original vinyl before you were born—and then the bouncer quizzes YOUR birthday under a blacklight while waving her right inside!',
    choices: [
      {
        labelHer: 'He catches his own "Cubsplain" laughing ("Wait—I am literally explaining mortgages to a homeowner, shut me up!"), tips the bouncer grinning when you ask to get carded too, and buys the first round.',
        labelHim: 'Roast yourself mid-"Cubsplain" before finishing the sentence, playfully insist the bouncer check her ID too ("Look at her, clearly 29!"), and grab the corner velvet booth.',
        outcomeHer:
          'Self-awareness cures "Cubsplaining" in 0.2 seconds—and watching him get grilled on his zip code by the bouncer gives you bestie-brunch material for a month!',
        outcomeHim:
          'Catching yourself instead of lecturing her—plus turning the ID check into pure flattery—has her laughing against your shoulder all set long.',
        toastBanner: 'ZERO CUBSPLAINING! • EQ +25 • CHEMISTRY +25',
        deltas: { maturity: 20, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Survived the Speakeasy UV Bouncer',
      },
      {
        labelHer: 'He lectures you for 15 minutes on "how credit scores work" and pouts when the bouncer double-checks his ID.',
        labelHim: 'Double down lecturing her about basic adult life skills and snap defensively at the bouncer.',
        outcomeHer:
          'Being lectured on credit scores by someone whose car insurance just dropped last birthday?! Hard pass!',
        outcomeHim:
          'Patronizing an accomplished woman ("Cubsplaining") is the #1 fastest turnoff on the entire subreddit.',
        toastBanner: 'RED FLAG! • TERMINAL CUBSPLAINING (-25)',
        deltas: { maturity: -25, chivalry: -15, eq: -25, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Ask him to teach you something he genuinely mastered while you school him on 90s concert history.',
        labelHim: 'Ask for her real lived take instead of guessing—turning experience differences into mutual curiosity.',
        outcomeHer:
          'Mutual respect and genuine curiosity make the conversation electric.',
        outcomeHim:
          'Listening beats lecturing 100 times out of 100.',
        toastBanner: 'MUTUAL SPARK +20',
        deltas: { maturity: 20, chivalry: 15, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'hotel-checkin-two-queen-beds-mixup',
    act: 3,
    stage: 4,
    title: 'Boutique Hotel Check-In: "Did You Want Two Queen Beds for You and Your Son?!"',
    subredditThreadInspiration: 'r/CougarsAndCubs Top Funny Thread: "Front desk clerk tried to \'helpfully\' switch our King oceanfront suite to Two Queens—our reaction got us upgraded to Champagne!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'waiter_shock',
    minAgeGap: 14,
    setupHer:
      'You and {hisName} ({hisAge}M) step up to the marble reception desk for your weekend coastal trip. The well-meaning 21-year-old clerk glances between your reservation and {hisName}, taps furiously on his keyboard, and whispers helpfully: *"Oh! The system booked ONE King bed by mistake—let me switch you and your son into Two Queens at no charge!"*',
    setupHim:
      'Classic `r/CougarsAndCubs` rite of passage at the boutique hotel front desk: the young check-in clerk thinks he’s saving the day by offering to split your oceanfront King suite with {herName} ({herAge}F) into **Two Queen Beds**!',
    choices: [
      {
        labelHer: 'He wraps one arm smoothly around your waist, kisses your temple smiling, and tells the clerk warmly: "Trust me, one King bed is *definitely* right"—turning the clerk bright red AND scoring complimentary lobby champagne!',
        labelHim: 'Slip your arm warmly around her waist with a relaxed grin ("Oh, one King bed is definitely what we booked—we’re celebrating all weekend!"), making her laugh and watching the embarrassed clerk send up free champagne.',
        outcomeHer:
          'Not a flicker of embarrassment—just effortless affection, humor, AND a free bottle of Veuve Clicquot sent up by a mortified front-desk manager!',
        outcomeHim:
          'The clerk turns crimson, upgrades you to the corner ocean-view suite in apology, and {herName} pulls you in by your collar the second the suite door clicks shut!',
        toastBanner: 'FREE CHAMPAGNE UPGRADE! • CHEMISTRY +30 • CHIVALRY +25',
        deltas: { maturity: 25, chivalry: 25, eq: 25, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'One-King-Bed Suite Upgrade Pro',
      },
      {
        labelHer: 'He steps three feet away from you at the desk looking mortified and mutters, "Yeah uh whatever is fine."',
        labelHim: 'Drop her hand in embarrassment and stare at your shoes while she handles the awkward clerk alone.',
        outcomeHer:
          'Actually, Mr. Clerk—DO make it two separate rooms, and put his on a separate credit card!',
        outcomeHim:
          'Shrinking away during a public mix-up turns a funny 5-second moment into a real wound.',
        toastBanner: 'RED FLAG! • FRONT-DESK SHRINKING (-25)',
        deltas: { maturity: -25, chivalry: -25, eq: -20, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Wink at the clerk together ("Definitely one King—and send up two robe sizes, please!") and laugh all the way up in the elevator.',
        labelHim: 'Share an unbothered laugh with her in the elevator—treating public mix-ups as your favorite recurring comedy bit.',
        outcomeHer:
          'Couples who laugh off front-desk mix-ups in five seconds are invincible.',
        outcomeHim:
          'Humor + zero ego turns every awkward stranger into an inside joke.',
        toastBanner: 'UNBOTHERED SUITE GOALS +20',
        deltas: { maturity: 20, chivalry: 20, eq: 25, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'broke-college-dutch-calculator-horror',
    act: 2,
    stage: 1,
    minigame: 'venmo_calculator_block',
    title: '🚨 Broke College "Go-Dutch" Horror: Declined Campus Card & The $41.63 Venmo Calculator',
    subredditThreadInspiration: 'Sub-23 Danger Zone • "Declined campus Dining Dollars + itemizing 4 edamame pods for $41.63 on Venmo!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    setupHer:
      'You dared to drag your app age slider into the **Sub-23 Danger Zone**! {hisName} ({hisAge}M) begged to take you out for sushi, ordered two dragon rolls + hot sake for himself while you had one salmon roll, watched his university Meal-Plan card decline off-campus, and now has his iPhone calculator open at the table muttering: *"Okay if we go Dutch plus 8.75% tax and you ate four of the seven edamame pods… can you Venmo me $41.63 right now?"*',
    setupHim:
      'Budget Reality Test! You’re {hisAge} on a tight student/early-career budget taking {herName} ({herAge}F) out. Your roommate swore you should *"make her go 50/50 Dutch down to the penny with your phone calculator so you don’t get used"*—while every Cougar on earth is watching how you handle a modest wallet with class.',
    choices: [
      {
        labelHer: 'Pay the whole check once with icy grace so the waiter isn’t stiffed, politely tell him why inviting someone out and itemizing edamame on Venmo is a crime, and raise your age slider back to 25+ before reaching your car!',
        labelHim: 'NEVER invite her to a spot you can’t host or pull out a penny-splitting calculator—plan a charming date squarely inside your real budget (hand-packed park picnic, taco stand, or coffee + sunset walk) and cover it proudly with zero Venmo math!',
        outcomeHer:
          'Lesson immortalized! You escape with your dignity, block the Venmo request mid-notification, and set your Cougars & Cubs Club age slider firmly above campus meal-plan territory!',
        outcomeHim:
          'Planning an imaginative $28 date you can genuinely treat her to beats a $90 sushi bill with a petty Venmo calculator 1,000 times out of 1,000!',
        toastBanner: 'DODGED THE VENMO CALCULATOR! • MATURITY +25 • CHIVALRY +25',
        deltas: { maturity: 25, chivalry: 25, eq: 20, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Survived the Broke College Dutch-Splitter',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He sends you a public Venmo request for "$41.63 🍣 + 4 edamames" BEFORE the waiter even brings mints—and asks if you validate his parking.',
        labelHim: 'Order double her food, whip out your iPhone calculator at the table, and send her a public Venmo request for $41.63 including 4/7ths of the edamame.',
        outcomeHer:
          'FOUR-SEVENTHS OF THE EDAMAME?! Every woman in the group chat is screenshotting this Venmo notification for the Smithsonian!',
        outcomeHim:
          'Nothing evaporates attraction across all five continents faster than inviting someone out and itemizing three dollars of soybeans on Venmo.',
        toastBanner: 'RED FLAG! • ITEMIZED EDAMAME VENMO HORROR (-30)',
        deltas: { maturity: -30, chivalry: -30, eq: -25, chemistry: -30, redFlags: 1 },
      },
      {
        labelHer: 'If a sweet younger Cub is upfront *before* ordering ("Let me treat you to coffee & gelato on my student budget!"), warmly accept—honest effort beats fake baller math.',
        labelHim: 'Be charmingly transparent upfront ("I’m on a grad-school budget, so let me treat you to the best espresso and cannoli in town!"), keeping generosity 100% intact.',
        outcomeHer:
          'Upfront honesty + a $16 treat he proudly covers is genuinely endearing.',
        outcomeHim:
          'Cougars never demand Michelin money—they demand effort, honesty, and zero nickel-and-diming.',
        toastBanner: 'HONEST BUDGET CHARM +20',
        deltas: { maturity: 25, chivalry: 20, eq: 25, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'montana-cowboy-age-slider-dare',
    act: 2,
    stage: 1,
    title: '🤠 The Kristin Cavallari × Montana Boyz Dare: Dropping Your Age Slider to 25!',
    subredditThreadInspiration: 'Pop-Culture Inspiration: "Kristin Cavallari & 24yo Montana cowboy Mark Estes—when he accidentally DMs \'I love you\' from the boys’ shared TikTok and inspires everyone to lower their age settings!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'palm_springs_pool',
    setupHer:
      'After three bleak dates with grumpy 45-year-old divorcés who complained about property taxes for two hours, your bestie grabs your phone over martinis, yells *"Remember Kristin Cavallari and Mark from Montana Boyz?!"*, and drags your minimum age setting down to **25**. Ten minutes later, {hisName} ({hisAge}M)—a 6\'3" former college wide receiver raised on a ranch—accidentally replies *"I love you"* from his buddies’ shared account before DMing you from his real profile asking to fly in Friday!',
    setupHim:
      'Your buddies dared you on your shared ranch account, you accidentally hit send on *"I love you"* to {herName} ({herAge}F), and miracle of miracles—she lowered her age settings and matched you anyway! Now the whole internet (and her skeptical friends) think a {hisAge}-year-old cowboy is just a two-week Cabo phase. What’s your move?',
    choices: [
      {
        labelHer: 'Own the plot twist with Kristin-level unbothered joy—say yes to Friday dinner, laugh over his accidental group-account confession, and judge him by how thoughtfully he treats you in real life rather than Instagram comments!',
        labelHim: 'Own the accidental confession with a fearless grin, show up Friday in a crisp button-down with yes-ma’am ranch manners, hold her hand proudly in daylight, and never chase clout off her name.',
        outcomeHer:
          'Best slider adjustment of the decade! Zero bitterness, 6\'3" doorway-frame energy, and more enthusiasm in one weekend than your last four peer dates combined!',
        outcomeHim:
          'Old-school country chivalry + zero fear of public headlines turns a bold age-slider dare into undeniable chemistry!',
        toastBanner: 'MONTANA COWBOY SPARK! • CHEMISTRY +30 • CHIVALRY +25',
        deltas: { maturity: 20, chivalry: 25, eq: 25, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Lowered the Age Slider (Montana Cowboy Certified)',
      },
      {
        labelHer: 'He shows up filming three staged TikTok dances in your kitchen before even asking how your week was.',
        labelHim: 'Prop your phone against her fruit bowl five minutes into Date #1 to farm TikTok views.',
        outcomeHer:
          'You lowered your age slider for romance, NOT to co-star in a ring-light thirst trap! Out!',
        outcomeHim:
          'Turning private chemistry into clout content gets your return flight moved up to tonight.',
        toastBanner: 'RED FLAG! • RING-LIGHT CLOUT FARMING (-25)',
        deltas: { maturity: -25, chivalry: -20, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Keep the first weekend phone-free at a tucked-away steakhouse to test real conversation first.',
        labelHim: 'Leave your phone in your jacket pocket all weekend so she knows you’re there 100% for her.',
        outcomeHer:
          'Phone-free chemistry proves the spark is 100% real.',
        outcomeHim:
          'Keeping private moments private earns deep trust fast.',
        toastBanner: 'PHONE-FREE RANCH CHARM +20',
        deltas: { maturity: 25, chivalry: 20, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'four-roommates-cereal-kitchen-horror',
    act: 2,
    stage: 3,
    minigame: 'roommate_kitchen_escape',
    title: '🥣 Obstacle Alert: The 7 AM Four-Roommate Mixing-Bowl Cheerios Ambush',
    subredditThreadInspiration: '7 AM Sleepover Obstacle • "Walking out in silk to three 23yo roommates eating Cheerios out of a plastic mixing bowl"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'houseboy_apron',
    setupHer:
      'Every veteran Cougar warns newcomers about **The Roommate Obstacle**. You stayed over at {hisName}’s ({hisAge}M) apartment once, step toward the kitchen at 7:10 AM for espresso, and freeze: three roommates named Kyle, Brody, and Zak are in plaid boxers playing *Call of Duty* at 80 decibels while eating dry Cheerios out of a stained plastic mixing bowl with a wooden ladle.',
    setupHim:
      'Code Red! {herName} ({herAge}F) stayed over, and your three roommates picked 7:10 AM to camp in the living room in boxers eating cereal out of a mixing bowl while the sink looks like a science experiment. How do you rescue the morning?',
    choices: [
      {
        labelHer: 'Laugh at the sheer anthropology of the wooden-ladle Cheerios, accept the iced latte {hisName} already ran out at 6:45 AM to bring straight to your bedside, and decree **Rule #1: All future sleepovers happen at YOUR peaceful sanctuary!**',
        labelHim: 'Slip out at 6:45 AM before she wakes to bring real espresso + warm croissants straight to your spotless bedroom, walk her cleanly past the roommate zoo, and happily host future Sundays at her peaceful sanctuary (bringing groceries + cleaning!).',
        outcomeHer:
          'Crisis averted! Having coffee delivered before witnessing Kyle’s mixing bowl—plus moving all future sleepovers to your quiet AC sanctuary—saves the romance!',
        outcomeHim:
          'Anticipating the roommate hazard with 6:45 AM coffee delivery + doing 100% of Sunday cooking at her place turns a disaster into a hilarious war story!',
        toastBanner: 'SANCTUARY RULE ENFORCED! • EQ +25 • MATURITY +25',
        deltas: { maturity: 25, chivalry: 25, eq: 25, chemistry: 20, redFlags: 0 },
        badgeUnlocked: 'Survived the Mixing-Bowl Roommates',
      },
      {
        labelHer: 'He hands you a chipped mug of instant coffee and asks if you want to watch him and Kyle play four hours of split-screen Call of Duty on a beanbag.',
        labelHim: 'Ask an accomplished woman to hang out on a sticky futon watching you and your roommates game till noon.',
        outcomeHer:
          'You call an Uber Black before your heels even finish clicking down his stairwell!',
        outcomeHim:
          'Subjecting her to a sticky frat futon guarantees you’ll never see her overnight bag again.',
        toastBanner: 'RED FLAG! • FRAT FUTON HOSTAGE CRISIS (-25)',
        deltas: { maturity: -25, chivalry: -25, eq: -25, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Whisk him straight out to your favorite quiet neighborhood café for real eggs Benedict and linen napkins.',
        labelHim: 'Have a sunny patio brunch table booked five minutes away so you leave the roommates in the dust immediately.',
        outcomeHer:
          'Linen napkins and hot espresso restore civilization in ten minutes flat.',
        outcomeHim:
          'Pivoting straight out the door to a great café saves the morning smoothly.',
        toastBanner: 'SMOOTH CAFÉ EXTRACTION +20',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'hobosexual-ps5-suitcase-creep',
    act: 2,
    stage: 3,
    minigame: 'hobosexual_bag_intercept',
    title: '🎮 Red-Flag Obstacle: The "Hobosexual" PS5, Whey-Tub & Laundry-Bag Soft Move-In',
    subredditThreadInspiration: 'Sanctuary Red-Flag Test • "Spotting a smooth-talking Hobosexual sneaking a PS5 & laundry bag into your AC sanctuary"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'Your peaceful, mortgage-paid home has 62°F central air, stocked Pellegrino, and a lush backyard—which makes it prime territory for the dreaded **"Hobosexual" Soft Move-In**. On Week 3, {hisName} ({hisAge}M) arrives for Friday night carrying not just an overnight dopp kit, but a **duffel of unwashed laundry, a 5-lb tub of vanilla whey protein, and an HDMI cable peeking out of his backpack**!',
    setupHim:
      '{herName}’s ({herAge}F) house feels like a five-star resort compared to 20-something apartments—which is why smart women ruthlessly vet against "Hobosexuals" who try to colonize a woman’s sanctuary, laundry machine, and Wi-Fi by Week 3. How do you prove you’re a partner, NEVER a freeloader?',
    choices: [
      {
        labelHer: 'Draw a loving, titanium-clear boundary on the spot—keep one small guest drawer for his toothbrush, send the laundry bag & console right back to his trunk, and confirm he loves his own independent lease!',
        labelHim: 'Keep ONLY a clean dopp kit at her place, maintain your own spotless apartment & bills with pride, bring fresh groceries/wine whenever she hosts, and leave Monday morning before she even has to hint!',
        outcomeHer:
          'Zero freeloading, total respect for your sanctuary, and a Cub who brings wine *into* your house instead of sneaking laundry bags in!',
        outcomeHim:
          'Respecting her solo space—and showing up as a self-sufficient giver—makes her actually *miss* you the second you leave Monday morning!',
        toastBanner: 'ZERO HOBOSEXUAL DETECTED! • MATURITY +30 • EQ +25',
        deltas: { maturity: 30, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Certified Non-Hobosexual Sanctuary Guest',
      },
      {
        labelHer: 'He plugs a PS5 into your living-room Frame TV uninvited, dumps two loads of gym socks into your washer, and hints his lease "conveniently ends Friday."',
        labelHim: 'Try to plug your gaming console into her living room TV and soft-launch moving in after three dates.',
        outcomeHer:
          '🚨 HOBOSEXUAL ALERT! His console, his whey tub, and his gym socks are on the front porch before the spin cycle even starts!',
        outcomeHim:
          'Trying to colonize an independent woman’s home sanctuary for free AC and laundry is the fastest lifetime ban in Cougars & Cubs Club.',
        toastBanner: 'RED FLAG! • PS5 HOBOSEXUAL INVASION (-30)',
        deltas: { maturity: -30, chivalry: -25, eq: -30, chemistry: -30, redFlags: 1 },
      },
      {
        labelHer: 'Alternate weekends between boutique getaways and dinner out so your home stays sacred.',
        labelHim: 'Host date nights out on the town regularly so she never feels like the default unpaid hotel.',
        outcomeHer:
          'Balanced hosting keeps romance electric and resentment at zero.',
        outcomeHim:
          'Taking her out instead of camping on her sofa shows real adult pride.',
        toastBanner: 'SANCTUARY RESPECT +20',
        deltas: { maturity: 25, chivalry: 20, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'black-cat-pushback-golden-retriever-test',
    act: 2,
    stage: 1,
    minigame: 'black_cat_pace',
    title: '🐈‍⬛ Black Cat Cougar × 🐕 Golden Retriever Cub: The Slow-Burn Pushback Test',
    subredditThreadInspiration: '🐈‍⬛×🐕 Polarity Chemistry • "Sunny Golden-Retriever Cub meets cool, unhurried Black Cat Cougar who takes her time at first"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    setupHer:
      'You radiate pure **🐈‍⬛ Black Cat** poise: self-contained, unhurried, and allergic to instant over-familiarity. When {hisName} ({hisAge}M) comes in beaming with tail-wagging **🐕 Golden-Retriever** enthusiasm trying to lock in both Thursday *and* Sunday on Date #1, you lean back over your glass and push back playfully: *"Easy there, sunshine—I take my time, and you haven’t even earned Date #2 yet."* Men your own age usually sulk or call you "guarded." Watch what {hisName} does instead.',
    setupHim:
      'Here’s your open secret: overly eager dates bore you, whereas {herName}’s ({herAge}F) cool, selective **🐈‍⬛ Black Cat** energy has your **🐕 Golden-Retriever** heart doing backflips. Halfway through drinks, she catches you getting ahead of yourself, raises one slow eyebrow, and pushes back: *"Slow down, eager puppy—I like taking my time, and I don’t hand out weekends that fast."* Every insecure guy folds right here. What’s your move?',
    innerInsecurityBubble: {
      herDoubt:
        'Her silent Black Cat test: "Every 45-year-old man gets prickly ego the second I set a boundary or slow the pace. Let’s see if this sunny {hisAge}-year-old pouts—or proves he’s built for the slow burn."',
      hisDoubt:
        'His Golden-Retriever brain: "Oh man, the way she just told me to slow my roll with that tiny half-smirk?! Keep tail wagging calmly, zero neediness—earning her trust is the best part!"',
    },
    choices: [
      {
        labelHer: 'Instead of sulking or pushing harder, he grins ear-to-ear completely unbothered ("Fair enough—a woman who takes her time makes me 10x more excited to earn Date #2"), walks you to your car with zero pressure, and follows up right on schedule!',
        labelHim: 'Flash a warm, completely unbothered Golden-Retriever grin ("Honestly? Knowing you take your time just makes me like you ten times more"), respect her pace 100% at the car door, and show up with steady, sunny consistency!',
        outcomeHer:
          'Not an ounce of bruised male ego—just radiant, unshakeable warmth that respects your boundary AND clearly adores your pushback! You catch yourself smiling in the rearview mirror all the way home.',
        outcomeHim:
          'Her cool Black Cat composure cracks into a genuine, lingering smile at the car door: *"Okay… maybe you can text me about next Friday, Golden Boy."*',
        toastBanner: '🐈‍⬛×🐕 PEAK POLARITY SPARK! • CHEMISTRY +30 • EQ +30',
        deltas: { maturity: 25, chivalry: 25, eq: 30, chemistry: 30, redFlags: 0 },
        badgeUnlocked: '🐈‍⬛×🐕 Black Cat & Golden Retriever Certified',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He gets defensive when you slow the pace ("Wow why are older women so cold / playing hard to get?!") or spam-texts 11 needy question marks before midnight.',
        labelHim: 'Whine that she’s "playing hard to get" or bombard her phone trying to force instant closeness.',
        outcomeHer:
          'Nothing validates Black Cat boundaries faster than watching a guy throw a tantrum the first time you say "not so fast." Blocked with extreme peace!',
        outcomeHim:
          'Confusing a self-possessed woman’s natural pacing with "games"—or trying to crowd a Black Cat—guarantees she vanishes into the night.',
        toastBanner: 'RED FLAG! • BRUISED EGO / RUSHED THE BLACK CAT (-30)',
        deltas: { maturity: -30, chivalry: -20, eq: -30, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Give him one playful breadcrumb ("Pass a 6 PM phone call Wednesday first, then we’ll talk about Friday") to watch his eyes light up.',
        labelHim: 'Ask what pace feels best for her ("One date a week while we get to know each other works great for me—I’m not going anywhere").',
        outcomeHer:
          'Setting a clear, unhurried cadence lets desire build deliciously.',
        outcomeHim:
          'Calm reassurance without pressure is pure catnip to an independent woman.',
        toastBanner: 'EARNED SLOW-BURN CADENCE +20',
        deltas: { maturity: 25, chivalry: 20, eq: 25, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'black-cat-thaw-behind-closed-doors',
    act: 2,
    stage: 3,
    title: '😻 When the Black Cat Finally Chooses Your Lap: The Rainy-Friday Thaw',
    subredditThreadInspiration: '🐈‍⬛×🐕 Slow-Burn Payoff • "Four weeks of patient Golden-Retriever courtship—the rainy Friday night the Black Cat finally curls into your lap"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    recommendedAffiliateId: 'silk-pillowcase-sleepover-duo',
    setupHer:
      'For four weeks you paced {hisName} ({hisAge}M) deliberately—teasing his Golden-Retriever eagerness, keeping public PDA subtle, and making sure he wasn’t just high on novelty. Tonight rain is drumming against your windows, he cooked risotto without asking where a single pan lived, and every guarded wall you normally carry after a 50-hour week suddenly melts.',
    setupHim:
      'Four weeks of patient **🐕 Golden-Retriever** courtship: you never rushed {herName} ({herAge}F), laughed warmly every time she pushed back, and showed up like clockwork. Tonight, after dinner at her quiet sanctuary, the cool **🐈‍⬛ Black Cat** who barely let you hold her waist on Date #1 kicks off her heels, steps straight into your arms, and curls up against your chest on the sofa.',
    choices: [
      {
        labelHer: 'Curl right into his warm chest on the sofa, run your fingers through his hair, and whisper: "Thank you for not rushing me—and for not going anywhere when I pushed back."',
        labelHim: 'Wrap both arms around her quietly without saying "I told you so"—just kiss her temple, hold her close in the rain-lit quiet, and savor the magic of a Black Cat choosing *you*.',
        outcomeHer:
          'Being held by a younger man whose warmth stayed steady until *you* were ready to melt? Pure, spine-tingling sanctuary bliss.',
        outcomeHim:
          'Anyone can get fast attention—earning the private, unguarded softness of a selective Black Cat Cougar feels like winning the entire universe!',
        toastBanner: 'EARNED BLACK-CAT DEVOTION! • CHEMISTRY +30 • CHIVALRY +25',
        deltas: { maturity: 25, chivalry: 25, eq: 25, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'She Finally Chose Your Lap',
      },
      {
        labelHer: 'The second you soften, he gets cocky and brags: "See?! Knew your ice-queen act would crack lol!"',
        labelHim: 'Gloat loudly ("Haha knew you couldn’t resist me forever, ice queen!") and ruin the vulnerable moment.',
        outcomeHer:
          'And in 0.4 seconds the Black Cat teleports to the opposite end of the couch and orders your Uber!',
        outcomeHim:
          'Mocking a woman the moment she lets her guard down snaps her walls shut permanently.',
        toastBanner: 'RED FLAG! • GLOATED DURING THE THAW (-25)',
        deltas: { maturity: -25, chivalry: -25, eq: -30, chemistry: -25, redFlags: 1 },
      },
      {
        labelHer: 'Pour two small glasses of aged Barolo, put vinyl on low, and enjoy an unhurried, phone-off Friday night in.',
        labelHim: 'Keep your phone on silent in your coat pocket and match her calm, affectionate wavelength all weekend.',
        outcomeHer:
          'Unhurried intimacy after weeks of slow-burn tension hits ten times deeper.',
        outcomeHim:
          'Quiet attentiveness seals the bond effortlessly.',
        toastBanner: 'SLOW-BURN INTIMACY +20',
        deltas: { maturity: 20, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
      },
    ],
  },
  {
    id: 'zero-proof-mocktail-smoothie-date',
    act: 2,
    stage: 1,
    title: '🥤 Zero-Proof Green Flag: Botanical Mocktails, Smoothies & Zero-Hangover Mornings',
    subredditThreadInspiration: 'Modern Wellness Reality: "Half of Gen-Z Cubs barely drink AND perimenopause makes 2 glasses of wine wreck your sleep—zero-proof mocktail & smoothie dates are elite!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    recommendedAffiliateId: 'zero-proof-botanical-mocktail-set',
    setupHer:
      'Real talk: between 6:30 AM Pilates, skin glow, and how ruthlessly alcohol wrecks sleep past 38, you ordered **{signatureDrink}** instead of booze tonight. Better yet, {hisName} ({hisAge}M) is part of the health-conscious Gen-Z wave who prefers adaptogen spritzes, ceremonial matcha, and post-gym smoothies over sloppy bar tabs!',
    setupHim:
      'You’re out with {herName} ({herAge}F), and neither of you cares about getting buzzed—you care about real chemistry, waking up clear-headed at 6:30 AM, and feeling amazing. When the bartender pushes a heavy cocktail list, she smiles and orders **{signatureDrink}**.',
    choices: [
      {
        labelHer: 'Toast your zero-proof yuzu mocktails (or lock in a Saturday morning cold-pressed smoothie walk after), love that he never pressures a drink, and wake up glowing with 100% energy for each other!',
        labelHim: 'Match her vibe effortlessly—order a crisp zero-proof botanical spritz or espresso tonic with zero awkwardness, and plan a sunny post-hike smoothie date for Saturday morning!',
        outcomeHer:
          'Zero peer pressure, crystal-clear eye contact, deep sleep, AND waking up fresh at 6:30 AM for morning rounds + smoothies?! Peak modern Cougar-Cub compatibility!',
        outcomeHim:
          'Skipping sloppy hangover culture for sharp conversation and sunrise smoothies puts your chemistry on rocket fuel!',
        toastBanner: '🥤 ZERO-PROOF WELLNESS SPARK! • EQ +25 • CHEMISTRY +25',
        deltas: { maturity: 25, chivalry: 20, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Zero-Proof & Sunrise Smoothie Certified',
      },
      {
        labelHer: 'He whines "Wait you’re not drinking?! C’mon take one tequila shot with me, don’t be boring!!"',
        labelHim: 'Try to peer-pressure a health-conscious woman into taking shots after she ordered non-alcoholic.',
        outcomeHer:
          'Pressuring a grown woman who protects her sleep and wellness to do tequila shots?! Enjoy your Uber solo!',
        outcomeHim:
          'Pushing alcohol on someone who chose a mocktail or smoothie is an instant maturity fail.',
        toastBanner: 'RED FLAG! • SHOT PEER-PRESSURE ICK (-25)',
        deltas: { maturity: -25, chivalry: -20, eq: -25, chemistry: -20, redFlags: 1 },
      },
      {
        labelHer: 'Stock tart-cherry spritz, iced matcha, and fresh berries at home so both cocktail and mocktail nights feel special.',
        labelHim: 'Remember her exact non-alcoholic order ({signatureDrink}) and have it chilled in your fridge before Date #3.',
        outcomeHer:
          'Thoughtful attention to her wellness routine melts hearts fast.',
        outcomeHim:
          'Stocking her exact mocktail or smoothie ingredients proves top-1% attentiveness.',
        toastBanner: 'THOUGHTFUL WELLNESS CARE +20',
        deltas: { maturity: 20, chivalry: 25, eq: 20, chemistry: 20, redFlags: 0 },
      },
    ],
  },
  {
    id: 'twin-xl-single-pillow-horror',
    act: 2,
    stage: 3,
    minigame: 'room_audit',
    title: '🛏️ Real-World Obstacle: The Unsheeted Twin-XL & Flat Yellow 2017 Dorm Pillow',
    subredditThreadInspiration: 'Sleepover Horror Lore • "Walking into his bedroom and seeing ONE pancake-flat pillow, zero top sheet, and LED gamer strips"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'bathroom_audit',
    recommendedAffiliateId: 'percale-hosting-sheets',
    setupHer:
      'Chemistry at dinner was a 10/10, so you step into {hisName}’s ({hisAge}M) apartment for a nightcap—and gasp internally: **one flat, case-less yellow pillow from sophomore year**, zero top sheet, and neon purple LED strips taped straight onto drywall! Can this Cub be domesticated before midnight, or are you calling an Uber Black?',
    setupHim:
      'Emergency Sanctuary Check! {herName} ({herAge}F) is walking down your hallway in heels right now. Every Cougar horror story starts with a bare mattress, one sad pancake pillow, and zero hand towels. How did you prep before Date #3?',
    choices: [
      {
        labelHer: 'False alarm—he surprises you with crisp white 400-thread-count percale sheets, FOUR fluffed pillows, warm bedside lamps, and an unopened spare toothbrush on the vanity!',
        labelHim: 'Upgrade to crisp white percale Queen sheets, four real pillows, warm table lamps (LED strips ripped down forever!), and a lidded bathroom bin + luxury hand soap before she ever steps inside!',
        outcomeHer:
          'FOUR FLUFFY PILLOWS AND A TOP SHEET?! You practically purr—he actually did his homework!',
        outcomeHim:
          'She takes one look at four crisp white pillows and warm lamplight and whispers: *"Wait… how are you {hisAge} and already better at hosting than men twice your age?!"*',
        toastBanner: '4-PILLOW GROWN-MAN SANCTUARY! • MATURITY +30 • CHIVALRY +25',
        deltas: { maturity: 30, chivalry: 25, eq: 25, chemistry: 25, redFlags: 0 },
        badgeUnlocked: 'Four-Pillow Percale Certified',
      },
      {
        labelHer: 'He pats a bare mattress with one pancake-flat pillow and offers you his clean gym hoodie as a blanket.',
        labelHim: 'Offer an accomplished woman a bare mattress and one flat dorm pillow from 2018.',
        outcomeHer:
          'Your cervical spine files a restraining order on the spot—Uber Black arrives in 3 minutes flat!',
        outcomeHim:
          'Nothing ends a hot night faster than expecting a woman with her own thread-count standards to sleep under a gym hoodie.',
        toastBanner: 'RED FLAG! • SINGLE FLAT PILLOW CRIME SCENE (-30)',
        deltas: { maturity: -30, chivalry: -25, eq: -25, chemistry: -30, redFlags: 1 },
      },
      {
        labelHer: 'Laugh warmly, send him a link to crisp cotton percale sheets for next week, and bring him back to your five-star sanctuary tonight.',
        labelHim: 'Host at her sanctuary first while your new Queen bedframe & crisp white linen set arrive Tuesday.',
        outcomeHer:
          'Coachable Cubs who upgrade their bedding by Friday are keepers.',
        outcomeHim:
          'Fixing the gap within 48 hours proves eager, coachable effort.',
        toastBanner: 'COACHABLE UPGRADE +20',
        deltas: { maturity: 20, chivalry: 20, eq: 20, chemistry: 15, redFlags: 0 },
      },
    ],
  },
  {
    id: 'birthday-dinner-group-venmo-ambush',
    act: 2,
    stage: 4,
    minigame: 'venmo_calculator_block',
    title: '🧾 Group-Dinner Obstacle: His 23yo Friends Order 14 Tequila Shots & Demand an "Even Split"',
    subredditThreadInspiration: 'Public Group Horror • "You ordered one $19 salad + sparkling water, his bros ordered wagyu + 14 Don Julio shots, and someone yells LET’S SPLIT IT EVENLY 8 WAYS!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    setupHer:
      'You graciously attend {hisName}’s ({hisAge}M) friend’s birthday dinner. You sip one glass of Sancerre and order branzino, while two of his 23-year-old buddies order **three rounds of Don Julio 1942 shots and twin tomahawk steaks**—then loudly announce as the **$1,120 check** lands: *"Yo let’s just split it evenly 8 ways—everybody Venmo Brody $140 right now, especially since {herName}’s an executive lol!"*',
    setupHim:
      'Code-Red Chivalry Test! Your loudmouth buddy Brody ordered four rounds of top-shelf tequila shots nobody asked for, then tries to stick {herName} ({herAge}F) with an "even 8-way split" while making a tacky joke about her career!',
    choices: [
      {
        labelHer: 'Before you even touch your purse, {hisName} shuts Brody down mid-sentence ("{herName} is my guest—her dinner and mine are on my card, and y’all are covering your own 14 shots"), settling both your shares seamlessly!',
        labelHim: 'Shut Brody down immediately with calm authority ("{herName} is my date—I’ve got both of us covered on a separate check, and the tequila crew covers the shots"), zero awkwardness reaches her!',
        outcomeHer:
          'Watching your younger man shut down freeloading bros in 3 seconds flat without flinching?! Attraction skyrockets through the roof!',
        outcomeHim:
          'Protecting your date from tacky group-tab freeloading earns instant legend status at the table—and in the car ride home!',
        toastBanner: 'IRONCLAD GROUP-TAB SHIELD! • CHIVALRY +30 • MATURITY +30',
        deltas: { maturity: 30, chivalry: 30, eq: 25, chemistry: 30, redFlags: 0 },
        badgeUnlocked: 'Group-Tab Ambush Bodyguard',
        triggerTipPrompt: true,
      },
      {
        labelHer: 'He sheepishly whispers "Babe can you just Venmo Brody $280 for both of us since you make more than all of us?"',
        labelHim: 'Nudge your date under the table to subsidize your friends’ tequila binge because she has a great job.',
        outcomeHer:
          'Treating your Cougar like Brody’s personal ATM?! You pay exact cash for your one branzino to the server and vanish into the night forever!',
        outcomeHim:
          'Letting your friends treat your date like a Sugar-Mama sponsor is an unforgivable instant breakup.',
        toastBanner: 'RED FLAG! • SUGAR-MAMA GROUP-TAB AMBUSH (-30)',
        deltas: { maturity: -30, chivalry: -30, eq: -30, chemistry: -30, redFlags: 1 },
      },
      {
        labelHer: 'Ask the server upfront when sitting down at big group dinners to keep you and your date on a separate two-top tab.',
        labelHim: 'Quietly tell the server right as you sit down: "Please put me and my date on our own separate check."',
        outcomeHer:
          'Veteran group-dinner move—zero bill drama at the end of the night!',
        outcomeHim:
          'Pre-splitting your two-top check before drinks arrive is elite grown-up foresight.',
        toastBanner: 'PROACTIVE TWO-TOP TAB +25',
        deltas: { maturity: 25, chivalry: 25, eq: 25, chemistry: 20, redFlags: 0 },
      },
    ],
  },
];
