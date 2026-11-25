import type { SubplotTag } from '../domain/taxonomy';

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
  title: string;
  subredditThreadInspiration: string;
  isVip: boolean;
  creditCost: number;
  requiredAnyTags?: SubplotTag[];
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
    title: 'The Tapas Check-Drop ("Cougar ≠ Sugar Mama")',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Who pays on dates? Reminder: Cougar ≠ Sugar Mama!"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'tapas_check',
    setupHer:
      'Two espresso martinis and blistered shishito peppers later, the leather checkbook lands between you. You make triple his salary—but you’re vetting his pride, effort, and reciprocity.',
    setupHim:
      'The leather check presenter hits the marble table. You know she runs an entire department, and your budget isn’t infinite—how do you play the check drop?',
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
    title: '"Table for You and Your Son?"',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Waitress thought I was my cub’s mom—how he handled it sealed the deal"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'waiter_shock',
    setupHer:
      'At the wine bar host stand, a 19-year-old host beams brightly: "Right this way! Just a table for you and your son tonight?" You feel your soul briefly leave your body.',
    setupHim:
      'The teenage host just asked if you’re her SON. You catch a flicker of mortification cross her face—all eyes on your next 2 seconds.',
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
    title: 'Generational Code-Switch & The "Retro 2000s" Slip',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Millennial vs Gen-Z texting, crew socks, and calling my college playlist retro"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'code_switch_phone',
    setupHer:
      'On the drive back, OutKast comes on your speakers—right after he called 2003 "classic retro childhood throwbacks." Now it’s next afternoon and your phone buzzes.',
    setupHim:
      'You nearly called her 2003 college OutKast playlist "vintage childhood music" last night. Now you want to lock in Date #2—translate your raw impulse for her generation!',
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
          'Seamless code-switch! You kept your playful Gen-Z warmth while matching her exact communication wavelength.',
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
    title: 'The $80 Babysitter & Precious Free-Time Test',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Paid $20/hr for my first night off in months and the cub canceled because of rain"',
    isVip: false,
    creditCost: 0,
    requiredAnyTags: ['single_mom_sitter'],
    sceneArt: 'babysitter_clock',
    setupHer:
      'It’s your ONE kid-free Friday this month, and your $20/hr sitter arrives in 90 minutes ($80 on the clock). Rain clouds roll in and your phone lights up.',
    setupHim:
      'It starts pouring outside two hours before your Friday date, and your buddies just texted about watching the game. You know she hired a $20/hr babysitter for tonight.',
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
    title: 'Princess Treatment: Dropping the 20-Year Mental Load',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Just because I’m 43 doesn’t mean I want to boss him around—treat me like a princess!"',
    isVip: false,
    creditCost: 0,
    requiredAnyTags: ['princess_treatment'],
    sceneArt: 'princess_bouquet',
    setupHer:
      'You spent 50 hours this week directing adults who act like toddlers. You do NOT want to plan tonight, pick the restaurant, or play dominant boss—you want soft-life princess treatment.',
    setupHim:
      'Internet memes claim every Cougar wants to dominate—but you can tell she’s exhausted from running everything at work all week. How do you set the tone tonight?',
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
    title: '6 AM Ridge Trail Run ("Short Leash & Cardio Check")',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Trail runs with cubs—testing if his 25yo stamina matches his talk"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'ridge_trail_leash',
    setupHer:
      'Saturday, 6:10 AM. He bragged all week about his "youthful stamina," so you brought him to your steep 5-mile canyon switchbacks. Mile 3 hits and she hasn’t even broken breath.',
    setupHim:
      'You talked a big game about 20-something cardio—and now she’s floating up a 14% canyon incline in sculpted leggings, glancing back with a wicked grin: "Keep up, Cub. Short leash."',
    recommendedAffiliateId: 'trail-hydration-vest',
    choices: [
      {
        labelHer: 'He digs deep, matches your stride to the overlook, hands you cold electrolytes, and grins: "Short leash looks good on me—coffee’s on me down the hill."',
        labelHim: 'Push through the burn without whining, hand her electrolytes at the summit, and grin: "Eyes forward, keeping pace—where are we refueling?"',
        outcomeHer:
          ' flushed cheeks, endorphins sky-high, playful tease met with playful grit. Redirecting club energy into sunrise trail stamina is peak Cougar/Cub magic.',
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
    title: 'Morning Sunlight: Harsh Mirrors vs. "Do I Have Enough Game?"',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Worried about softer skin/aging next to girls his age" × "Cubs wondering if we have enough game for her to see us again"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'mirror_vanity',
    setupHer:
      'Morning espresso in bright kitchen light—no dim cocktail lounge filter now. Both of you pause for half a heartbeat, each hiding the exact vulnerability this subreddit knows by heart.',
    setupHim:
      'Morning sunlight pours across the kitchen counter. Behind the playful banter, both of your inner monologues are louder than the espresso machine.',
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
    title: 'Houseboy Sunday & Her Peaceful Solo Sanctuary',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Happy living alone in my sanctuary—plus the joy of an energetic vetted cub doing chores"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'houseboy_apron',
    setupHer:
      'Sunday afternoon at your immaculate solo home. You love living alone (no premature move-in squatters!)—yet seeing a vetted Cub put his 20-something vigor into your chore list is undeniably thrilling.',
    setupHim:
      'Sunday at her serene home sanctuary. You passed her emotional vetting—now how do you channel that youthful stamina without overstepping her solo space?',
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
        toastBanner: 'RED FLAG! • PREMATURE SANCTUARY INVASION',
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
    title: 'Act III Boss Fight: The Kids & Timeline Crossroads',
    subredditThreadInspiration: 'r/CougarsAndCubs: "She’s done having kids / can’t have more, and we fell deeply in love"',
    isVip: false,
    creditCost: 0,
    requiredAnyTags: ['done_with_kids', 'wants_kids_someday'],
    sceneArt: 'fertility_talk',
    setupHer:
      'Three months in, the chemistry is electric—and real feelings have arrived. Over late-night wine, the biggest real-world subplot on the subreddit surfaces: you’re 100% done having kids, and he once pictured being a dad.',
    setupHim:
      'You’re falling for her for real. She’s honest and gentle: her kid-raising chapter is closed forever, and she refuses to rob you of fatherhood if that’s truly non-negotiable for you.',
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
    title: 'Act III Finale: Brunch With Her 22yo Daughter & Brunch Crew',
    subredditThreadInspiration: 'r/CougarsAndCubs: "How did her adult children & meddling friends react to you?"',
    isVip: false,
    creditCost: 0,
    sceneArt: 'brunch_daughter',
    setupHer:
      'Sunday mimosas: your 22-year-old college-senior daughter (three years younger than him!) AND your most skeptical friend ("What when you’re 60?!") are across the table.',
    setupHim:
      'Boss level: her 22-year-old daughter is eyeing you over avocado toast while her protective best friend tests whether you’re a passing phase.',
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
  {
    id: 'vip-apartment-soap-audit',
    act: 2,
    title: 'VIP Deep-Cut: First Time Hosting at His Place (The Soap & Bedframe Audit)',
    subredditThreadInspiration: 'r/CougarsAndCubs: "How to prepare for first time hosting? Clean linens, soap, and a lidded bin!"',
    isVip: true,
    creditCost: 2,
    sceneArt: 'bathroom_audit',
    setupHer:
      'For the first time, you come over to *his* apartment. Every woman on r/CougarsAndCubs knows the silent 10-second checklist the moment she steps into a 25-year-old’s place.',
    setupHim:
      'She’s coming to YOUR place tonight for the first time. Time for the ultimate r/CougarsAndCubs apartment inspection!',
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
    title: 'VIP Deep-Cut: 5-Star Palm Springs Weekend & The 3x Income Gap',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Navigating luxury vacations when she earns 3x more without bruising pride"',
    isVip: true,
    creditCost: 3,
    sceneArt: 'palm_springs_pool',
    setupHer:
      'You booked a sunlit boutique resort in Palm Springs with credit-card points because you refuse to downgrade your vacations—how does he handle the luxury gap poolside?',
    setupHim:
      'She booked a gorgeous boutique Palm Springs suite way above your entry-level bracket. How do you show up as an equal partner all weekend?',
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
    title: 'VIP Deep-Cut: Thanksgiving With Her 23yo Son & His Class-of-’97 Mom',
    subredditThreadInspiration: 'r/CougarsAndCubs: "Met my cub’s parents—his mom and I graduated high school the same year"',
    isVip: true,
    creditCost: 3,
    sceneArt: 'thanksgiving_table',
    setupHer:
      'Holiday crossover episode: you’re meeting his mother—who is literally 14 months older than you and loved the exact same 1997 Alanis Morissette tour.',
    setupHim:
      'Your mom is 48. Your girlfriend is 45. Both are standing in the kitchen reaching for the wine opener while your dad blinks rapidly.',
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
    title: 'VIP Deep-Cut: "In the Wild" Trader Joe’s Olive-Oil Aisle Approach',
    subredditThreadInspiration: 'r/CougarsAndCubs: "How did you meet in the wild without dating apps—and without breaking Not Dating 101?"',
    isVip: true,
    creditCost: 2,
    sceneArt: 'trader_joes_aisle',
    setupHer:
      'Dating app age sliders filter out half the Cubs in town—so here he is in real life beside the imported Tuscan olive oil and peonies at Trader Joe’s.',
    setupHim:
      'Forget app age filters—she’s right beside you choosing olive oil in sunlit athleisure. Shoot your shot cleanly without sounding like a pickup TikTok!',
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
