export interface PhoneAFriendIntel {
  channelId:
    | 'red-flag-emergency'
    | 'ask-a-cougar'
    | 'enm-and-plot-twists'
    | 'spotted-in-the-wild';
  verdictTone: 'keeper' | 'trap';
  verdictPill: string;
  speaker1: { name: string; badge: string; text: string };
  speaker2: { name: string; badge: string; text: string };
  conspiracyClueId?: string;
}

export const PHONE_A_FRIEND_INTEL_BY_LEAD: Record<string, PhoneAFriendIntel> = {
  graham: {
    channelId: 'red-flag-emergency',
    verdictTone: 'trap',
    verdictPill: '🚨 GROUP-CHAT VERDICT: MARRIED 6:45 CURFEW TRAP',
    conspiracyClueId: 'clue-graham-curfew',
    speaker1: {
      name: 'Priya_TraumaRN',
      badge: '🏥 Triage Lead',
      text: 'GIRL RUN! "6:45 PM Tokyo portfolio call" is Graham’s exact Montecito soccer-carpool curfew. Jade spotted him loading pull-ups into an SUV at 6:50!',
    },
    speaker2: {
      name: 'Claire_M&A',
      badge: '🍸 Deal Partner',
      text: 'Confirmed 100% married alibi artist. Hit Block / Cut Loose right now for +25 XP and pocket your Table 9 Clue!',
    },
  },
  vanessa: {
    channelId: 'red-flag-emergency',
    verdictTone: 'trap',
    verdictPill: '🚨 GROUP-CHAT VERDICT: "PRACTICALLY DIVORCED" TRAP',
    conspiracyClueId: 'clue-vanessa-cellar',
    speaker1: {
      name: 'Jade_42F',
      badge: '🐆 Sunset Hills Host',
      text: 'Red alert! "Practically divorced for tax logistics" means her husband Lawrence still sleeps in that Bel Air house every single night.',
    },
    speaker2: {
      name: 'Sam_27M',
      badge: '🏡 Neighbor',
      text: 'Yeah they just booked Sunday 9 AM couples golf at Riviera. Block her number for +25 XP before you get dragged into Table 9 drama!',
    },
  },
  brooke: {
    channelId: 'red-flag-emergency',
    verdictTone: 'trap',
    verdictPill: '🚩 GROUP-CHAT VERDICT: EX-HUSBAND REVENGE PROP TRAP',
    conspiracyClueId: 'clue-brooke-table9',
    speaker1: {
      name: 'Sienna_Design',
      badge: '🏡 Sunset Hills',
      text: 'Hold up, did Brooke insist you wear navy and sit right across from Table 9 at 8 PM sharp?! Her ex-husband Richard eats at Table 9 every Friday!',
    },
    speaker2: {
      name: 'Claire_M&A',
      badge: '🍸 Deal Partner',
      text: 'She is staging a petty jealousy photo-op, not a real date. Cut her loose for +25 XP and log the Table 9 clue!',
    },
  },
  connor: {
    channelId: 'red-flag-emergency',
    verdictTone: 'trap',
    verdictPill: '🚩 GROUP-CHAT VERDICT: FAKE-AGE FRAT KID TRAP',
    speaker1: {
      name: 'Prof_Elena',
      badge: '🎓 Faculty Chair',
      text: '"Facebook glitched my age to 27" is the oldest undergrad fib on campus. That kid is 21 with a plastic grocery-bag bathroom bin and 3-in-1 shampoo.',
    },
    speaker2: {
      name: 'Priya_TraumaRN',
      badge: '🏥 Triage Lead',
      text: 'He just texted two promoters trying to borrow a 27-year-old ID for The Marlow bouncer. Block him immediately for +25 XP!',
    },
  },
  devon: {
    channelId: 'red-flag-emergency',
    verdictTone: 'trap',
    verdictPill: '🚩 GROUP-CHAT VERDICT: HOBOSEXUAL COUCH-SURFER TRAP',
    speaker1: {
      name: 'Claire_M&A',
      badge: '🍸 Deal Partner',
      text: 'Classic r/CougarsAndCubs hobosexual alert: poetic 2 AM guitar voice notes, allergic to restaurant reservations, and angling for your guest room because his lease ends Friday!',
    },
    speaker2: {
      name: 'Jade_42F',
      badge: '🐆 Sunset Hills Host',
      text: 'Protect your sanctuary peace and your groceries! Hit Block / Cut Loose for +25 XP.',
    },
  },
  julian: {
    channelId: 'ask-a-cougar',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: CERTIFIED HAMPSTEAD KEEPER',
    speaker1: {
      name: 'Claire_M&A',
      badge: '🍸 Deal Partner',
      text: 'Green flags across the board! Arrives seven minutes early with Barolo, upfront about his fellowship stipend, and keeps his phone face-down all night.',
    },
    speaker2: {
      name: 'Prof_Elena',
      badge: '🎓 Faculty Chair',
      text: 'Julian is top-1% Hampstead manners. Graduate him to personal iMessage and lock Friday dinner in!',
    },
  },
  soren: {
    channelId: 'ask-a-cougar',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: NORDIC ARCHITECT KEEPER',
    speaker1: {
      name: 'Sienna_Design',
      badge: '🏡 Sunset Hills',
      text: 'Søren is 100% legit: spotless birch kitchen, two linen hand towels, and zero American situationship games.',
    },
    speaker2: {
      name: 'Jade_42F',
      badge: '🐆 Sunset Hills Host',
      text: 'Take his mixed-doubles wager and move straight to iMessage!',
    },
  },
  miles: {
    channelId: 'ask-a-cougar',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: 5-STAR SANCTUARY ANCHOR',
    speaker1: {
      name: 'Claire_M&A',
      badge: '🍸 Deal Partner',
      text: 'Miles is the dream 31M Cub-Daddy: confirms valet by Wednesday noon, owns a seasoned 12-inch cast iron, and never asks "idk where do u wanna go."',
    },
    speaker2: {
      name: 'Priya_TraumaRN',
      badge: '🏥 Triage Lead',
      text: 'Four plumped cotton pillows and fresh pour-over in bed. Crown material!',
    },
  },
  rafael: {
    channelId: 'spotted-in-the-wild',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: HIGH-CHEMISTRY KEEPER',
    speaker1: {
      name: 'Sienna_Design',
      badge: '🏡 Sunset Hills',
      text: 'Rafael hand-builds walnut dining tables in Silver Lake and leads courtyard salsa without an ounce of ego. Huge green flag!',
    },
    speaker2: {
      name: 'Jade_42F',
      badge: '🐆 Sunset Hills Host',
      text: 'Warm, attentive, and cooks from scratch. Keep raising Spark toward Date #1!',
    },
  },
  marcus: {
    channelId: 'spotted-in-the-wild',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: ROCK-SOLID FIREFIGHTER KEEPER',
    speaker1: {
      name: 'Priya_TraumaRN',
      badge: '🏥 Triage Lead',
      text: 'Vouching personally from the ER bay: Station 14 firefighter Marcus shows up on time, smokes prime brisket, and has zero roster chaos.',
    },
    speaker2: {
      name: 'Claire_M&A',
      badge: '🍸 Deal Partner',
      text: 'Calm, protective presence and dry humor. Safe to share your real number!',
    },
  },
  rory: {
    channelId: 'spotted-in-the-wild',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: WHOLESOME GOLDEN CUB KEEPER',
    speaker1: {
      name: 'Prof_Elena',
      badge: '🎓 Faculty Chair',
      text: 'Rory is pure Bridget Jones park-ranger magic: blushes slightly, recovers with dry London wit, and bakes homemade berry crumble.',
    },
    speaker2: {
      name: 'Sienna_Design',
      badge: '🏡 Sunset Hills',
      text: 'Zero jaded bone in his body. Total sweetheart keeper!',
    },
  },
  jin: {
    channelId: 'spotted-in-the-wild',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: OLD-SOUL CREATIVE KEEPER',
    speaker1: {
      name: 'Sienna_Design',
      badge: '🏡 Sunset Hills',
      text: 'Jin knows every 12-seat vinyl listening bar in Little Tokyo and never pulls his phone out to photograph dinner plates.',
    },
    speaker2: {
      name: 'Claire_M&A',
      badge: '🍸 Deal Partner',
      text: 'Quiet confidence and sharp eye contact. Definite keeper!',
    },
  },
  liam: {
    channelId: 'ask-a-cougar',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: STEADY CRAFTSMAN KEEPER',
    speaker1: {
      name: 'Jade_42F',
      badge: '🐆 Sunset Hills Host',
      text: 'Liam builds custom alpine timber homes in Ojai and opens every car door without making a speech about it. A+ green flag.',
    },
    speaker2: {
      name: 'Sienna_Design',
      badge: '🏡 Sunset Hills',
      text: 'Wait until he makes cast-iron peach cobbler on Date #3!',
    },
  },
  claire: {
    channelId: 'ask-a-cougar',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: ICONIC BENCHMARK COUGAR',
    speaker1: {
      name: 'Sam_27M',
      badge: '🏡 Vetted Cub',
      text: 'Pro tip on Claire: when she texts "Sounds good." with a period and a 👍, she is 100% happy! Never double-text asking if she is mad, just lock 7:45 dinner.',
    },
    speaker2: {
      name: 'Prof_Elena',
      badge: '🎓 Faculty Chair',
      text: 'Bring decisive restaurant plans and respect her Living-Apart-Together sanctuary, and she will spoil you rotten.',
    },
  },
  elena: {
    channelId: 'ask-a-cougar',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: RAZOR-WIT LITERARY KEEPER',
    speaker1: {
      name: 'Sam_27M',
      badge: '🏡 Vetted Cub',
      text: 'Elena is brilliant and ethical to the letter. Skip generic compliments about how young she looks and match her dry bookshop banter!',
    },
    speaker2: {
      name: 'Jade_42F',
      badge: '🐆 Sunset Hills Host',
      text: 'Chilled Sancerre + complete sentences = instant S-Rank with Elena.',
    },
  },
  sienna: {
    channelId: 'ask-a-cougar',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: WARM COURTYARD KEEPER',
    speaker1: {
      name: 'Jade_42F',
      badge: '🐆 Sunset Hills Host',
      text: 'Sienna’s only test is daylight pride: hold her hand smoothly if you bump into friends or her nephew Sam, and you are golden.',
    },
    speaker2: {
      name: 'Sam_27M',
      badge: '🏡 Nephew & Regular',
      text: 'Can confirm: treat my aunt Sienna like royalty and put Al Green on vinyl!',
    },
  },
  priya: {
    channelId: 'ask-a-cougar',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: ZERO-NONSENSE TRAUMA RN KEEPER',
    speaker1: {
      name: 'Claire_M&A',
      badge: '🍸 Deal Partner',
      text: 'Priya makes life-or-death calls for twelve hours straight, so the fastest way to her heart is zero off-duty decision fatigue: handle tacos and guard her blackout curtains!',
    },
    speaker2: {
      name: 'Jade_42F',
      badge: '🐆 Sunset Hills Host',
      text: '100% genuine catch with elite banter.',
    },
  },
  summer: {
    channelId: 'spotted-in-the-wild',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: MALIBU PUMA KEEPER',
    speaker1: {
      name: 'Jade_42F',
      badge: '🐆 Sunset Hills Host',
      text: 'Summer lowered her age slider because 42-year-old men still stalled on commitment. Show calm emotional certainty and wear mineral SPF 50!',
    },
    speaker2: {
      name: 'Sam_27M',
      badge: '🏡 Vetted Cub',
      text: 'Also never interrupt a woman mid-set with earbuds in, wait for the juice bar!',
    },
  },
  celeste: {
    channelId: 'spotted-in-the-wild',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: PALM SPRINGS JAGUAR ICON',
    speaker1: {
      name: 'Claire_M&A',
      badge: '🍸 Deal Partner',
      text: 'Celeste owns half the Palm Springs gallery strip: order an icy Gibson with a cocktail onion and skip pretentious art-school jargon.',
    },
    speaker2: {
      name: 'Prof_Elena',
      badge: '🎓 Faculty Chair',
      text: 'Authenticity and bold eye contact win every single beat with Celeste.',
    },
  },
  astrid: {
    channelId: 'enm-and-plot-twists',
    verdictTone: 'keeper',
    verdictPill: '🍍 GROUP-CHAT VERDICT: 100% ETHICAL SOLO-POLY KEEPER',
    speaker1: {
      name: 'Prof_Elena',
      badge: '🎓 Faculty Chair',
      text: 'Astrid is the gold standard of real Solo-Poly: disclosed right in Prompt #1, color-coded weekend calendar shared upfront, zero sneaking around!',
    },
    speaker2: {
      name: 'Claire_M&A',
      badge: '🍸 Deal Partner',
      text: 'Night-and-day difference from fake Telegram DADT cheaters. If you love passionate Fridays plus sacred solo Sundays, lock it in!',
    },
  },
  camila: {
    channelId: 'spotted-in-the-wild',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: OSTERIA CHEF KEEPER',
    speaker1: {
      name: 'Sienna_Design',
      badge: '🏡 Sunset Hills',
      text: 'Camila runs sixty covers a night in Venice, so the ultimate power move is cooking HER a simple, zero-stress meal on her Monday off!',
    },
    speaker2: {
      name: 'Jade_42F',
      badge: '🐆 Sunset Hills Host',
      text: 'Fiery, loyal, and 100% real.',
    },
  },
  vivienne: {
    channelId: 'ask-a-cougar',
    verdictTone: 'keeper',
    verdictPill: '💚 GROUP-CHAT VERDICT: CANNES SILVER PANTHER ROYALTY',
    speaker1: {
      name: 'Prof_Elena',
      badge: '🎓 Faculty Chair',
      text: 'Vivienne signs her texts "-V" and splits her year between Cannes and Beverly Hills. Cardinal rule: NEVER utter the words "for your age"!',
    },
    speaker2: {
      name: 'Claire_M&A',
      badge: '🍸 Deal Partner',
      text: 'Match her dry continental poise over vintage Burgundy and you will unlock one of the best routes in the game.',
    },
  },
};

export interface VettingRadarStatus {
  state: 'unvetted' | 'suspect' | 'confirmed_trap' | 'green_leaning' | 'verified_keeper';
  badgeText: string;
  detailText: string;
  cluesCount: number;
}

export function computeVettingRadarStatus(params: {
  isActualTrap: boolean;
  currentBeat: number;
  stage: 'app_dm' | 'imessage';
  datesCompleted: number;
  hasTrapBeatHint: boolean;
  inspectedPhotoClue: boolean;
  recoveredUnsentSlip: boolean;
  phoneAFriendChecked: boolean;
}): VettingRadarStatus {
  const {
    isActualTrap,
    currentBeat,
    stage,
    datesCompleted,
    hasTrapBeatHint,
    inspectedPhotoClue,
    recoveredUnsentSlip,
    phoneAFriendChecked,
  } = params;

  if (isActualTrap) {
    const cluesCount =
      (currentBeat >= 3 || (currentBeat >= 2 && hasTrapBeatHint) ? 1 : 0) +
      (inspectedPhotoClue ? 1 : 0) +
      (recoveredUnsentSlip ? 1 : 0) +
      (phoneAFriendChecked ? 1 : 0);

    if (phoneAFriendChecked || recoveredUnsentSlip || cluesCount >= 2 || currentBeat >= 4) {
      return {
        state: 'confirmed_trap',
        badgeText: `🚩 Red-Flag Trap Exposed (${Math.max(2, cluesCount)} Clues)`,
        detailText:
          'Shady curfew/alibi tells confirmed! Tap Block / Cut Loose now to claim +25 XP & a Table 9 Clue.',
        cluesCount: Math.max(2, cluesCount),
      };
    }

    if (cluesCount === 1) {
      return {
        state: 'suspect',
        badgeText: '⚠️ 1 Suspicious Tell Spotted',
        detailText:
          'Something about their schedule or story feels rehearsed. Tap Phone-a-Friend or inspect photo details!',
        cluesCount: 1,
      };
    }

    return {
      state: 'unvetted',
      badgeText: '🔍 Gut-Check: Vetting In Progress',
      detailText:
        'High Spark only means attraction! Test their evening availability or tap Phone-a-Friend to verify.',
      cluesCount: 0,
    };
  }

  const greenCount =
    (currentBeat >= 3 ? 1 : 0) +
    (stage === 'imessage' ? 1 : 0) +
    (inspectedPhotoClue ? 1 : 0) +
    (phoneAFriendChecked ? 1 : 0) +
    (datesCompleted > 0 ? 1 : 0);

  if (phoneAFriendChecked || stage === 'imessage' || datesCompleted > 0 || currentBeat >= 5) {
    return {
      state: 'verified_keeper',
      badgeText: `💚 Verified Green-Flag Keeper (${Math.max(2, greenCount)} Signals)`,
      detailText:
        datesCompleted >= 3
          ? '3/3 Dates Won! Soulmate status unlocked (or play Weekend Escape Epilogue).'
          : stage === 'imessage'
            ? 'Real number unlocked! Keep Spark high and win Dates #1 to #3 for S-Rank.'
            : 'Group-chat vetted & consistent! Finish Beat 6 (or hit 75% Spark) to move to iMessage.',
      cluesCount: Math.max(2, greenCount),
    };
  }

  if (greenCount >= 1) {
    return {
      state: 'green_leaning',
      badgeText: '🌱 Promising Green Flags (1 Signal)',
      detailText:
        'Specific banter and calm follow-through so far. Keep building Spark toward 75%+ for personal iMessage!',
      cluesCount: 1,
    };
  }

  return {
    state: 'unvetted',
    badgeText: '🔍 Gut-Check: Vetting In Progress',
    detailText:
      'Watch how they handle scheduling, punctuation, and boundaries across 6 beats (or tap Phone-a-Friend).',
    cluesCount: 0,
  };
}

export interface RelationshipStageItem {
  step: 1 | 2 | 3 | 4 | 5;
  shortLabel: string;
  status: 'done' | 'active' | 'upcoming';
}

export function computeRelationshipStepper(params: {
  stage: 'app_dm' | 'imessage';
  currentBeat: number;
  chemistry: number;
  datesCompleted: number;
  lastDateRank?: 'S' | 'A' | 'B' | 'F';
}): RelationshipStageItem[] {
  const { stage, currentBeat, chemistry, datesCompleted, lastDateRank } = params;
  const isImessage = stage === 'imessage';
  const readyForImessage = !isImessage && (currentBeat > 6 || chemistry >= 75);
  const allThreeDatesDone = datesCompleted >= 3;

  return [
    {
      step: 1,
      shortLabel: '1. Match ✓',
      status: 'done',
    },
    {
      step: 2,
      shortLabel: isImessage
        ? '2. Vetted ✓'
        : `2. Vibe Check (${Math.min(6, currentBeat)}/6)`,
      status: isImessage || currentBeat > 6 ? 'done' : 'active',
    },
    {
      step: 3,
      shortLabel: isImessage ? '3. iMessage ✓' : '3. Real Number',
      status: isImessage ? 'done' : readyForImessage ? 'active' : 'upcoming',
    },
    {
      step: 4,
      shortLabel: `4. Dates (${Math.min(3, datesCompleted)}/3 ♥)`,
      status: allThreeDatesDone ? 'done' : isImessage ? 'active' : 'upcoming',
    },
    {
      step: 5,
      shortLabel:
        allThreeDatesDone && lastDateRank === 'S'
          ? '5. Crowned ★'
          : '5. Crown / Expose',
      status: allThreeDatesDone ? 'done' : 'upcoming',
    },
  ];
}

export const SUBREDDIT_FIELD_NOTES: { badge: string; tip: string }[] = [
  {
    badge: 'r/CougarsAndCubs Rule #1',
    tip: 'Opening with "Hey Mama", "bucket list", or "for your age" is an instant block. Comment on a specific prompt and suggest a real Thursday wine bar.',
  },
  {
    badge: 'Gen-X iMessage Decoder',
    tip: '"Sounds good." with a terminal period + 👍 means 100% happy and locked in for Friday. Do not panic-text asking if she is mad!',
  },
  {
    badge: 'Sanctuary & Lighting Law',
    tip: 'Banish the Overhead Big Light (2700K amber lamps only), pre-chill the bedroom to 63°F, and keep a lidded trash bin + 4 real pillows.',
  },
  {
    badge: 'Living-Apart-Together (LAT)',
    tip: 'Two peaceful homes + passionate Friday-through-Sunday stays is the undefeated long-term setup across r/DatingOverForty & r/AgeGap.',
  },
  {
    badge: '🍍 Real ENM vs. Trap Tell',
    tip: 'Ethical Solo-Poly puts it in Bio Line #1 with an open calendar. "Telegram only Don’t Ask Don’t Tell" or a surprise Husband Brad at the booth = RUN.',
  },
];
