import type { FelineTier, SubplotTag } from '../domain/taxonomy';

export type RelationshipStage = 1 | 2 | 3 | 4 | 5 | 6;
export type MinigameType = 'check_reflex' | 'trail_pace' | 'room_audit' | 'doubt_spiral';

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
      'At {herAge}, dating a {hisAge}-year-old brings a uniquely 30s Puma crossroads: unlike 50+, biology isn’t closed yet—so people assume you’re hunting a baby daddy, when you actually love your life as-is and refuse vague 8-year "maybe" timelines.',
    setupHim:
      '{herName} is {herAge}—radiant, thriving, and crystal clear: she isn’t auditioning you to rush into a baby tomorrow, AND she won’t spend ages 36–41 in "let’s see where things go" situationship limbo.',
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
      'Six stages cleared: you laughed through 2008 geometry math, survived his friends’ wedding marathon, and synced watches through the Doubt stage. Time to claim what couples with a 5-to-9 year **Junior Cougar** gap call the secret cheat code of modern dating.',
    setupHim:
      'Standing on the terrace with {herName} ({herAge}F): six years older, wiser, magnetic, and completely in lockstep with you ({hisAge}M). How do you seal Stage 6?',
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
];
