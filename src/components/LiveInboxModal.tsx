import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  BadgeCheck,
  CheckCircle2,
  Flame,
  Gamepad2,
  Hash,
  Headphones,
  Heart,
  Lock,
  MessageCircle,
  Mic,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Star,
  Unlock,
  Video,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import type { WalletState } from '../domain/economy';
import {
  getProfileDetails,
  HER_ARCHETYPES,
  HIS_ARCHETYPES,
} from '../domain/taxonomy';
import { playVoiceNotePreview, sfx } from '../lib/sound';
import { liveAiInboxService, type LiveInboxTurn } from '../services/adapters';

export type InboxAppPlatform = 'tinder' | 'imessage' | 'discord';

interface LiveInboxModalProps {
  open: boolean;
  wallet: WalletState;
  playerRole?: 'her' | 'him';
  onChangePlayerRole?: (role: 'her' | 'him') => void;
  preferredHerId?: string;
  preferredHisId?: string;
  initialPlatform?: InboxAppPlatform;
  onClose: () => void;
  onJumpToWorld?: () => void;
  onStartDateWithContact?: (contactId: string, role: 'her' | 'him') => void;
  onGrantBonusCredits?: (rewardKey: string, amount: number) => boolean;
  onSpendCreditOrOpenBoutique: () => boolean;
}

interface InboxContact {
  id: string;
  name: string;
  age: number;
  height: string;
  zodiac: string;
  drink: string;
  loveLanguage: string;
  interests: string[];
  idealSunday: string;
  softSpot: string;
  petName?: string;
  tagline: string;
  title: string;
  bio: string;
  role: 'her' | 'him';
  photoUrl: string;
  initiatesFirst: boolean;
  matchTeaser: string;
  openingPrompt: string;
  steamyPrompt: string;
}

interface DiscordBuddyRemark {
  author: string;
  color: string;
  badge: string;
  text: string;
}

interface DiscordSeedPost {
  id: string;
  handle: string;
  badge: string;
  color: string;
  time: string;
  text: string;
  isMysteryClue?: boolean;
}

type DiscordChannelId =
  | 'general-lounge'
  | 'vetting-hotline'
  | 'boys-roblox-vc'
  | 'mystery-subplot';

const PROGRESSION_STORAGE_KEY = 'velvet_inbox_progression_v32';

interface PersistedInboxProgression {
  unlockedImessageIds: string[];
  flirtUnlockedIds: string[];
  subplotStageByRole: { her: number; him: number };
}

function loadInboxProgression(): PersistedInboxProgression {
  if (!import.meta.env.VITEST && typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(PROGRESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedInboxProgression>;
        return {
          unlockedImessageIds: Array.isArray(parsed.unlockedImessageIds)
            ? parsed.unlockedImessageIds
            : [],
          flirtUnlockedIds: Array.isArray(parsed.flirtUnlockedIds) ? parsed.flirtUnlockedIds : [],
          subplotStageByRole: {
            her: Number(parsed.subplotStageByRole?.her || 0),
            him: Number(parsed.subplotStageByRole?.him || 0),
          },
        };
      }
    } catch {
      // Ignore storage read issues
    }
  }
  return {
    unlockedImessageIds: [],
    flirtUnlockedIds: [],
    subplotStageByRole: { her: 0, him: 0 },
  };
}

function saveInboxProgression(next: PersistedInboxProgression) {
  if (!import.meta.env.VITEST && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage write issues
    }
  }
}

const TAPBACK_OPTIONS = ['❤️', '😂', '‼️', '👍', '👎', '❓'] as const;
const QUICK_EMOJIS = ['😏', '🍸', '😍', '😭', '💀', '🔥', '👀', '✨', '🥂', '🚩'] as const;

const BOLD_FIRST_MOVE_WOMEN: Record<string, { opening: string; steamy: string }> = {
  'sedona-qigong-mommy': {
    opening: 'Drop your shoulders. You get one line to earn Friday.',
    steamy: 'Shoulders still relaxed from this morning, good boy?',
  },
  'valentina-fiery-cougar': {
    opening: 'Don’t just stare at the match screen. Impress me.',
    steamy: 'Tell me you cleared your calendar after eight tonight.',
  },
  'evelyn-mogul-jaguar': {
    opening: 'I rarely message first. Don’t make me regret the exception.',
    steamy: 'Hotel bar at eight. Don’t keep me waiting.',
  },
};

const CUB_ONE_LINE_OPENERS: Record<string, string> = {
  'kayden-broke-dutch-cub': 'yo down for happy hour sushi tn if we split 50/50 on venmo?? 😅',
  'kieran-anthropic-ai-cub': 'Quick poll before I book Thursday: cozy wine bar or corner sushi?',
  'colton-montana-cowboy-cub': 'Okay busted, that accidental like from the ranch account was me 🤠 Friday?',
  'leo-golden-cub': 'Be honest: if I cook Friday, how tough of a critic are you?',
  'miles-millennial-cub': 'Holding a quiet 7:30 corner booth Friday if I can tempt you out.',
  'marcus-firefighter-cub': 'Just got off shift with one urgent question: spicy margarita or bourbon?',
  'liam-redhead-carpenter-cub': 'Important question: sunset trail walk first, or straight to wood-fired pizza?',
  'lucas-blonde-swimmer-cub': 'Fair warning, I take Friday reservations very seriously. Free around 7:30?',
  'theo-phd-campus-cub': 'Finally escaped the lab before dark. Talk me into staying out past nine?',
  'noah-surf-cub': 'Don’t judge my birth year before you try my pour-over 😊 Thursday?',
  'devon-indie-cub': 'Bet I can guess your exact drink order on the first try.',
  'jin-souschef-cub': 'Midnight handmade dumplings or an actual 7:30 table? Choose wisely.',
  'dante-trail-cub': 'Morning trail run is optional, Friday drinks with me are strongly encouraged.',
  'rafael-accented-gentleman-cub': 'Buenas ✨ May I steal your Friday evening for a proper dinner?',
  'julian-oldsoul-cub': 'Old-school question before I plan Friday: pink peonies or white roses?',
  'gavin-pilot-cub': 'Back on solid ground till Sunday. Let me take you somewhere good tomorrow?',
  'owen-sommelier-cub': 'Pick a side, red or white, and I’ll handle the rest of Friday.',
  'grant-surgeon-cub': 'Long hospital day immediately fixed by matching with you. Free Thursday?',
};

function stripDashes(text: string): string {
  return text.replace(/\s*[—–]\s*/g, ', ').replace(/,\s*,/g, ',').trim();
}

function formatCellNumber(contact: InboxContact): string {
  let hash = 0;
  for (let i = 0; i < contact.id.length; i++) {
    hash = (hash * 31 + contact.id.charCodeAt(i)) % 9000;
  }
  const suffix = String(1000 + (hash % 8999)).padStart(4, '0');
  const area = contact.role === 'her' ? (contact.age >= 50 ? '212' : '310') : '415';
  return `(${area}) 555-${suffix}`;
}

function buildOffAppOpeningText(contact: InboxContact, steamyMode: boolean): string {
  if (steamyMode) {
    if (contact.role === 'him') {
      return contact.age >= 27
        ? `Still thinking about last night. Tell me what time I can cook for you tonight.`
        : `haven't stopped smiling since last night ✨ free around 8?`;
    }
    if (contact.age >= 50) {
      return `Last night passed every test. Pouring a glass at eight if you are free.`;
    }
    return `You officially earned a repeat invite. What time are you coming over tonight?`;
  }

  if (contact.role === 'him') {
    if (contact.id === 'kieran-anthropic-ai-cub') {
      return `Glad we escaped the app. Saved your number and locked in our 7:30 corner booth.`;
    }
    if (contact.age >= 28) {
      return `Officially off the app. Saved your contact, should I call you at six Thursday?`;
    }
    return `Officially off Tinder 🙌 Saved your number, any food allergies before I plan Friday?`;
  }

  if (contact.id === 'sedona-qigong-mommy') {
    return `Good boy, you earned my real cell. Tea is steeping for Friday, don't be late.`;
  }
  if (contact.age >= 60) {
    return `Consider yourself promoted off that noisy app. Call this number at six Thursday.`;
  }
  if (contact.age >= 50) {
    return `You survived the app gauntlet. Save this number and call me at six tomorrow.`;
  }
  if (contact.age >= 40) {
    return `Officially out of Tinder purgatory. Save my number and send the 7:30 pin for Friday.`;
  }
  return `Okay, you earned my real number ✨ Save my contact and send our Friday spot!`;
}

function getTinderQuickChips(
  contact: InboxContact,
  steamyMode: boolean,
  turnCount: number,
  sparksCount: number,
  isNumberEarned: boolean,
): string[] {
  if (contact.role === 'him') {
    if (steamyMode) {
      return turnCount === 0
        ? [
            'Door’s unlocked at eight. Keep your ID tucked away 🍷',
            'Only if you flip my pillow to the cool side at midnight.',
            'Cook first, then we’ll talk about the rest of tonight ✨',
          ]
        : [
            'Careful, you’re dangerously close to becoming my favorite.',
            'Bring good wine and leave your phone on silent.',
            'Wait, how many pillows do you actually own right now?',
          ];
    }
    if (sparksCount >= 1 && !isNumberEarned) {
      return [
        '📱 Ready to get off this app? Text my real cell to lock in Friday.',
        'Phone stays face-down at dinner, deal?',
        'Only if Maui isn’t your mother Linda’s timeshare.',
      ];
    }
    if (turnCount === 0) {
      return [
        '7:30 works, assuming you actually make a reservation 🍸',
        'Bold opener. Impress me with the spot and I’m in.',
        'Quick test first: what happens when the check hits the table?',
      ];
    }
    return [
      'Call me at six tomorrow instead of texting all afternoon.',
      'You’re handling this remarkably well so far 🥂',
      'Bonus points if you survive my morning walk Saturday.',
    ];
  }

  const isQigongMommy =
    contact.id === 'sedona-qigong-mommy' || contact.id === 'sloane-seedoil-bernedoodle-mommy';

  if (steamyMode) {
    return turnCount === 0
      ? isQigongMommy
        ? [
            'Yes, Mommy. Tea steeped and shoulders relaxed for eight sharp 🍵',
            'Still thinking about this morning. When can I see you tonight?',
            'Wait can Mommy put my gym membership on her AmEx?? 😂',
          ]
        : [
            'Still thinking about last night. Let me cook for you at eight 🍷',
            'Cleared my whole evening for you. Name the time ✨',
            'Wait is your little sister cute too?? 😂',
          ]
      : [
          'Picking up ribeye and flowers on my way over.',
          'Phone’s going on Do Not Disturb the second I walk in 🥂',
          'Fair warning, I’m trying very hard to play it cool right now.',
        ];
  }

  if (sparksCount >= 1 && !isNumberEarned) {
    return [
      '📱 Let’s escape Tinder. Can I get your real number for Friday at 7:30?',
      'Take all the time you want. Worth the wait, table is held for 7:30 🥂',
      'well actually let me explain wine regions from a podcast i heard',
    ];
  }

  if (turnCount === 0) {
    if (isQigongMommy) {
      return [
        'Yes, Mommy. Courtyard at 6:30 AM sharp, zero podcast lectures 🍵',
        'Booked a seed-oil-free corner table Friday at 7:30 for us ✨',
        'Well actually let me explain breathwork from a podcast I heard',
      ];
    }
    return [
      'Booked a quiet corner booth Friday at 7:30 if you’re free 🍸',
      'Be honest: how intimidating is your go-to drink order?',
      'hey u look crazy good for ur age whats ur snap??',
    ];
  }

  return [
    'Deal. Friday at 7:30 is officially my favorite plan all week ✨',
    'I’ll call you at six sharp Thursday to confirm, zero texting spam.',
    'brooo took 2 droppers of pine pollen and im all up in my feels rn 😭🌲',
  ];
}

function getOffAppImessageChips(
  contact: InboxContact,
  steamyMode: boolean,
  turnCount: number,
): string[] {
  if (contact.role === 'him') {
    if (steamyMode) {
      return [
        'Come over at eight and bring that bottle you promised 🍷',
        'Phone stays in the kitchen once you walk in ✨',
        'Still smiling about last night. Cook for me Sunday?',
      ];
    }
    return turnCount === 0
      ? [
          'Saved your number ✨ Call me at six Thursday so we lock in Friday.',
          'Much better off that app. Surprise me with the 7:30 spot 🍸',
          'Fair warning, my phone goes on silent at 9:30 PM on weeknights.',
        ]
      : [
          'Pick me up at 7:15 sharp, and zero Venmo math after dinner.',
          'What are you cooking if you earn a Sunday invite?',
          'Good answer. Looking forward to Friday night 🥂',
        ];
  }

  if (steamyMode) {
    return [
      'Picking up wine and cooking dinner at my place at eight 🍷',
      'Four crisp percale pillows ready and phone on silent all night ✨',
      'Still thinking about last night. Free after eight tonight?',
    ];
  }

  return turnCount === 0
    ? [
        'Saved your number ✨ Sending our 7:30 Friday corner-table pin now.',
        'Glad we escaped the app. Quick 6 PM call Thursday to confirm?',
        'Saved! Want me to pick you up at 7:15 or meet you at the wine bar?',
      ]
    : [
        'Reservation confirmed under my name for 7:30 Friday 🥂',
        'If Friday goes as well as I think, I’m cooking you Sunday pasta.',
        'Zero texting spam till Thursday at six. Have a great week ✨',
      ];
}

function getDiscordChips(
  channel: DiscordChannelId,
  playerRole: 'her' | 'him',
  subplotStage: number,
): string[] {
  if (channel === 'mystery-subplot') {
    if (playerRole === 'him') {
      return subplotStage <= 1
        ? [
            'Wait, mid-century courtyards and dirty martinis? Are you in San Francisco?',
            'Promise I book 7:30 tables without twenty questions. Give me one more hint.',
            'Careful, you sound suspiciously like my favorite match in this club.',
          ]
        : [
            'Wait... sketching courtyards on Sundays? You’re Claire, aren’t you?!',
            'Blue-cheese olive martini gave you away. Drop the anon mask!',
            'If I guess your real name right now, do I earn your real number?',
          ];
    }
    return subplotStage <= 1
      ? [
          'Frontier AI lab alum who bakes Sunday sourdough? Tell me you live in SF.',
          'Lead with the sourdough AND book the 7:30 wine bar. Give me another clue.',
          'Hold on, did you leave an AI safety lab at 28? You sound very familiar.',
        ]
      : [
          'Sourdough focaccia in Noe Valley... wait, Kieran is that you?!',
          'Busted! Drop the anon handle and text me for Thursday.',
          'I know exactly which 28yo AI researcher this is 🥂',
        ];
  }

  if (channel === 'vetting-hotline') {
    return playerRole === 'him'
      ? [
          'Anon 26M check: booked a 7:30 wine bar Friday. Flowers too much on Date #1?',
          'Asking a 44yo woman for Snapchat in the Uber deserves immediate exile 💀',
          'Pro tip for fellow Cubs: call at 6 PM instead of texting "wyd" all week.',
        ]
      : [
          'Immediate jail for "whats ur snap." Real reservation or nothing 🍸',
          'Tell her the 7:30 spot and save the peonies for Date #2!',
          'Anon Cougar rule: four pillows and a lidded bathroom bin or we Uber home.',
        ];
  }

  if (channel === 'boys-roblox-vc') {
    return [
      'Booked a quiet corner table Friday at 7:30, peonies included 🍸',
      'Four percale pillows on the bed and cast-iron ribeye ready for Friday.',
      'yo u look crazy good for ur age whats ur snap??',
    ];
  }

  return playerRole === 'him'
    ? [
        'Anon Cub checking in: confirmed a 7:30 Friday corner booth, wish me luck 🥂',
        'Wait @midnight_martini_45 I fold for decisive Friday plans too, hi 👀',
        'Honest poll for the Cougars here: wine bar or handmade pasta on Date #2?',
      ]
    : [
        'Anon Cougar co-signing the 6 PM phone call rule. Texting marathons are exhausting.',
        'Wait @sourdough_alignment_28 lead with the wine bar and save sourdough for Sunday ✨',
        'Poll for the room: best green flag a younger guy pulled on Date #1?',
      ];
}

function buildInterestIcebreaker(contact: InboxContact, interest: string): string {
  const clean = interest.trim();
  const lower = clean.toLowerCase();
  if (/booktok|book|novel|reading/.test(lower)) {
    return `Important question: what book are you reading right now?`;
  }
  if (/surf|ocean|swim|sailing/.test(lower)) {
    return `Think I could keep up with you in the water this weekend?`;
  }
  if (/dog|bernedoodle|mochi|cat|puppy|otis/.test(lower)) {
    const pet = contact.petName ? contact.petName.split(/[•(]/)[0].trim() : 'your pet';
    return `Fair warning, winning over ${pet} is my top priority this week.`;
  }
  if (/pasta|cook|ramen|sushi|omakase|taco|oyster|risotto|halibut|dumpling/.test(lower)) {
    return `Saw ${clean.toLowerCase()} on your profile. Friday at 7:30 on me?`;
  }
  if (/hike|canyon|trail|climb|tennis|volleyball|pilates|run/.test(lower)) {
    return `Up for ${clean.toLowerCase()} Saturday morning, or drinks Friday first?`;
  }
  if (/vinyl|jazz|piano|symphony|music|country/.test(lower)) {
    return `What album is on repeat for you this week?`;
  }
  return `Saw ${clean.toLowerCase()} on your profile. Tell me your favorite spot for it?`;
}

const INBOX_CONTACTS: InboxContact[] = [
  ...HER_ARCHETYPES.map((h) => {
    const details = getProfileDetails(h);
    const boldMove = BOLD_FIRST_MOVE_WOMEN[h.id];
    const matchTeaser =
      h.age >= 50
        ? `Matched today • She won’t text first. Lead with poise, not 'hey'.`
        : h.age >= 40
          ? `Matched today • She waits for you to make the first move.`
          : `Matched today • Your turn to break the ice with one good line.`;

    return {
      id: h.id,
      name: h.name,
      age: h.age,
      height: details.height,
      zodiac: details.zodiac,
      drink: details.signatureDrink,
      loveLanguage: details.loveLanguage,
      interests: details.interests,
      idealSunday: details.idealSunday,
      softSpot: details.softSpot,
      petName: details.petName,
      tagline: stripDashes(h.tagline),
      title: stripDashes(h.title),
      bio: stripDashes(h.vibeSummary),
      role: 'her' as const,
      photoUrl: h.photoUrl,
      initiatesFirst: Boolean(boldMove),
      matchTeaser,
      openingPrompt: boldMove?.opening ?? '',
      steamyPrompt: boldMove?.steamy ?? '',
    };
  }),
  ...HIS_ARCHETYPES.map((c) => {
    const details = getProfileDetails(c);
    return {
      id: c.id,
      name: c.name,
      age: c.age,
      height: details.height,
      zodiac: details.zodiac,
      drink: details.signatureDrink,
      loveLanguage: details.loveLanguage,
      interests: details.interests,
      idealSunday: details.idealSunday,
      softSpot: details.softSpot,
      petName: details.petName,
      tagline: stripDashes(c.tagline),
      title: stripDashes(c.title),
      bio: stripDashes(c.vibeSummary),
      role: 'him' as const,
      photoUrl: c.photoUrl,
      initiatesFirst: true,
      matchTeaser: `New Match • ${c.name} messaged you first!`,
      openingPrompt:
        CUB_ONE_LINE_OPENERS[c.id] ??
        `Free Thursday around 7:30 if I find us a great corner booth? 🍸`,
      steamyPrompt:
        c.age >= 27
          ? `Still thinking about last night. What time can I come over?`
          : `haven't stopped smiling since last night 🔥 free around 8?`,
    };
  }),
];

function getDiscordSeeds(
  channel: DiscordChannelId,
  playerRole: 'her' | 'him',
): DiscordSeedPost[] {
  const mysteryHandle =
    playerRole === 'him' ? '@midnight_martini_45' : '@sourdough_alignment_28';
  const mysteryText =
    playerRole === 'him'
      ? 'Unpopular opinion: if a younger guy books a 7:30 corner booth without twenty questions and orders me a dirty martini, I fold.'
      : 'Left a frontier AI lab early and still get nervous asking out a woman in her 40s. Do I lead with a 7:30 wine bar or homemade sourdough?';

  if (channel === 'general-lounge') {
    return [
      {
        id: 'seed-1',
        handle: '@sancerre_panther_51',
        badge: '🐆 ANON JAGUAR',
        color: '#F47FFF',
        time: 'Today at 9:12 PM',
        text: 'PSA for the younger men lurking in here: one 6 PM phone call beats forty "how is your Tuesday" texts.',
      },
      {
        id: 'seed-2',
        handle: '@cast_iron_cub_26',
        badge: '🥂 ANON CUB',
        color: '#57F287',
        time: 'Today at 9:18 PM',
        text: 'Took lounge advice, bought four percale pillows + lidded bathroom bin, and got invited back for Sunday.',
      },
      {
        id: 'seed-3',
        handle: mysteryHandle,
        badge: '🕵️ MYSTERY REGULAR',
        color: '#FEE75C',
        time: 'Today at 9:26 PM',
        text: mysteryText,
        isMysteryClue: true,
      },
    ];
  }

  if (channel === 'vetting-hotline') {
    return [
      {
        id: 'vet-1',
        handle: '@malibu_biotech_anon',
        badge: '🐆 ANON COUGAR',
        color: '#F47FFF',
        time: 'Today at 8:54 PM',
        text: 'Vetting check: 27M opened every door and paid smoothly, then texted "u look crazy good for ur age whats ur snap." Salvageable or exile?',
      },
      {
        id: 'vet-2',
        handle: '@golden_barista_24',
        badge: '🥂 ANON CUB',
        color: '#57F287',
        time: 'Today at 9:05 PM',
        text: 'Quick check before Friday: taking a 43F creative director to a jazz lounge. Too eager if I confirm Thursday at 6 PM?',
      },
    ];
  }

  if (channel === 'mystery-subplot') {
    return [
      {
        id: 'mys-1',
        handle: mysteryHandle,
        badge: '🕵️ ENCRYPTED ANON DM',
        color: '#FEE75C',
        time: 'Just now',
        text:
          playerRole === 'him'
            ? 'Okay, your take in the lounge actually made me laugh. Promise not to blow my cover if I drop one hint? My Sundays are strictly espresso and sketching mid-century courtyards.'
            : 'Your advice in the lounge saved my Friday. Promise not to expose me? I spend Sundays baking sourdough focaccia with vintage sci-fi paperbacks in Noe Valley.',
        isMysteryClue: true,
      },
    ];
  }

  return [
    {
      id: 'rblx-1',
      handle: 'Kyle_DTI_RunwayKing',
      badge: 'ROBLOX DTI',
      color: '#57F287',
      time: 'Today at 9:34 PM',
      text: 'Drop your best Friday opener in here and the Dress to Impress lobby will score your rizz live 🫡',
    },
  ];
}

const ANON_ONLINE_ROSTER = [
  { handle: '@midnight_martini_45', role: '🐆 Anon Cougar', status: 'Sketching & sipping martinis' },
  { handle: '@sancerre_panther_51', role: '🐆 Anon Jaguar', status: 'Phone on DND after 9:30 PM' },
  { handle: '@malibu_biotech_anon', role: '🐆 Anon Cougar', status: 'Dawn surf, zero Snapchat' },
  { handle: '@pilates_noir_43', role: '🐆 Anon Cougar', status: 'Judging restaurant acoustics' },
  { handle: '@sourdough_alignment_28', role: '🥂 Anon Cub', status: 'Baking focaccia in SF' },
  { handle: '@cast_iron_cub_26', role: '🥂 Anon Cub', status: 'Seasoning ribeye skillet' },
  { handle: 'Kyle_DTI_RunwayKing', role: '🎮 Roblox VC', status: 'Playing Dress to Impress' },
  { handle: 'BrodyLifts225', role: '🎮 Roblox VC', status: 'Bulgarian split squats' },
] as const;

async function sendAiFeedbackPing(payload: {
  persona: string;
  reaction: string;
  aiReply?: string;
  note?: string;
  optionalContact?: string;
}) {
  if (typeof fetch !== 'function') return;
  try {
    await fetch('/api/ai-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Non-blocking feedback ping
  }
}

function pickDefaultContactForPlayerRole(
  pRole: 'her' | 'him',
  preferredHerId?: string,
  preferredHisId?: string,
): InboxContact {
  if (pRole === 'her') {
    return (
      (preferredHisId ? INBOX_CONTACTS.find((c) => c.id === preferredHisId) : undefined) ??
      INBOX_CONTACTS.find((c) => c.role === 'him') ??
      INBOX_CONTACTS[0]
    );
  }
  const targetHerId =
    preferredHerId && preferredHerId !== 'astrid-blonde-cougar'
      ? preferredHerId
      : 'claire-cougar-exec';
  return (
    INBOX_CONTACTS.find((c) => c.id === targetHerId) ??
    INBOX_CONTACTS.find((c) => c.role === 'her') ??
    INBOX_CONTACTS[0]
  );
}

export const LiveInboxModal: React.FC<LiveInboxModalProps> = ({
  open,
  wallet,
  playerRole,
  onChangePlayerRole,
  preferredHerId,
  preferredHisId,
  initialPlatform = 'tinder',
  onClose,
  onJumpToWorld,
  onStartDateWithContact,
  onGrantBonusCredits,
  onSpendCreditOrOpenBoutique,
}) => {
  const [platform, setPlatform] = useState<InboxAppPlatform>(initialPlatform);
  const [tinderSubMode, setTinderSubMode] = useState<'messages' | 'swipe'>('messages');
  const [swipeFly, setSwipeFly] = useState<'left' | 'right' | 'super' | null>(null);
  const [swipeDragX, setSwipeDragX] = useState(0);
  const [isSwipeDragging, setIsSwipeDragging] = useState(false);
  const swipeStartXRef = useRef<number | null>(null);

  const [discordChannel, setDiscordChannel] = useState<DiscordChannelId>('general-lounge');
  const [localPlayerRole, setLocalPlayerRole] = useState<'her' | 'him'>(playerRole ?? 'him');
  const activePlayerRole: 'her' | 'him' = playerRole ?? localPlayerRole;
  const matchRole: 'her' | 'him' = activePlayerRole === 'her' ? 'him' : 'her';

  const [progression, setProgression] = useState<PersistedInboxProgression>(() =>
    loadInboxProgression(),
  );
  const [subplotGuessFeedback, setSubplotGuessFeedback] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<InboxContact>(() =>
    pickDefaultContactForPlayerRole(activePlayerRole, preferredHerId, preferredHisId),
  );
  const [steamyMode, setSteamyMode] = useState(false);
  const [superLikedIds, setSuperLikedIds] = useState<string[]>([]);
  const [turnsByThread, setTurnsByThread] = useState<
    Record<
      string,
      (LiveInboxTurn & {
        passed?: boolean;
        buddy?: DiscordBuddyRemark;
        authorHandle?: string;
        authorBadge?: string;
        unlockedOffAppNow?: boolean;
      })[]
    >
  >({});
  const [coachByThread, setCoachByThread] = useState<
    Record<string, { note: string; deltas: string; passed: boolean; source: string }>
  >({});
  const [tapbacks, setTapbacks] = useState<Record<string, string>>({});
  const [openTapbackMenuKey, setOpenTapbackMenuKey] = useState<string | null>(null);
  const [discordReacts, setDiscordReacts] = useState<Record<string, boolean>>({});
  const [callBanner, setCallBanner] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [freeMessagesSent, setFreeMessagesSent] = useState(0);
  const [speakingTurnIdx, setSpeakingTurnIdx] = useState<number | null>(null);
  const [teaStory, setTeaStory] = useState('');
  const [teaContact, setTeaContact] = useState('');
  const [teaSubmitted, setTeaSubmitted] = useState(false);
  const stopVoiceRef = useRef<(() => void) | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const updateProgression = (
    updater: (prev: PersistedInboxProgression) => PersistedInboxProgression,
  ) => {
    setProgression((prev) => {
      const next = updater(prev);
      saveInboxProgression(next);
      return next;
    });
  };

  useEffect(() => {
    setPlatform(initialPlatform);
    setCallBanner(null);
    setOpenTapbackMenuKey(null);
  }, [initialPlatform, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    setSelected((curr) => {
      if (curr.role === matchRole) return curr;
      return pickDefaultContactForPlayerRole(activePlayerRole, preferredHerId, preferredHisId);
    });
  }, [matchRole, activePlayerRole, preferredHerId, preferredHisId]);

  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return INBOX_CONTACTS.filter((c) => {
      if (c.role !== matchRole) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        String(c.age).includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.zodiac.toLowerCase().includes(q) ||
        c.interests.some((i) => i.toLowerCase().includes(q))
      );
    });
  }, [matchRole, searchQuery]);

  const getSparksForContact = (contactId: string): number => {
    const vetTurns = turnsByThread[`tinder:${contactId}:vet`] ?? [];
    const flirtTurns = turnsByThread[`tinder:${contactId}:flirt`] ?? [];
    return (
      vetTurns.filter((t) => t.sender === 'match' && t.passed).length +
      flirtTurns.filter((t) => t.sender === 'match' && t.passed).length
    );
  };

  const sparksForSelected = getSparksForContact(selected.id);
  const isNumberEarnedForSelected = progression.unlockedImessageIds.includes(selected.id);
  const isFlirtEarnedForSelected =
    progression.flirtUnlockedIds.includes(selected.id) ||
    isNumberEarnedForSelected ||
    sparksForSelected >= 2;

  const earnedImessageContacts = useMemo(
    () => filteredContacts.filter((c) => progression.unlockedImessageIds.includes(c.id)),
    [filteredContacts, progression.unlockedImessageIds],
  );
  const lockedTinderContacts = useMemo(
    () => filteredContacts.filter((c) => !progression.unlockedImessageIds.includes(c.id)),
    [filteredContacts, progression.unlockedImessageIds],
  );

  const subplotStage = progression.subplotStageByRole[activePlayerRole] ?? 0;
  const mysteryHandle =
    activePlayerRole === 'him' ? '@midnight_martini_45' : '@sourdough_alignment_28';
  const mysteryTargetContact = useMemo(() => {
    const targetId =
      activePlayerRole === 'him' ? 'claire-cougar-exec' : 'kieran-anthropic-ai-cub';
    return INBOX_CONTACTS.find((c) => c.id === targetId) ?? selected;
  }, [activePlayerRole, selected]);

  const mysterySuspects = useMemo(() => {
    const ids =
      activePlayerRole === 'him'
        ? ['sienna-junior-cougar', 'claire-cougar-exec', 'evelyn-mogul-jaguar']
        : ['leo-golden-cub', 'kieran-anthropic-ai-cub', 'miles-millennial-cub'];
    return ids
      .map((id) => INBOX_CONTACTS.find((c) => c.id === id))
      .filter((c): c is InboxContact => Boolean(c));
  }, [activePlayerRole]);

  // Separate thread keys per platform so Tinder, earned iMessage, and Anon Discord NEVER share messages!
  const threadKey =
    platform === 'discord'
      ? `discord:${activePlayerRole}:${discordChannel}`
      : platform === 'imessage'
        ? `imessage:${selected.id}:${steamyMode ? 'flirt' : 'offapp'}`
        : `tinder:${selected.id}:${steamyMode ? 'flirt' : 'vet'}`;

  const turns = turnsByThread[threadKey] ?? [];
  const lastCoach = coachByThread[threadKey];
  const playerTurnCount = turns.filter((t) => t.sender === 'player').length;

  const activeTinderPrompt = steamyMode ? selected.steamyPrompt : selected.openingPrompt;
  const activeImessagePrompt = buildOffAppOpeningText(selected, steamyMode);

  const activeChips =
    platform === 'discord'
      ? getDiscordChips(discordChannel, activePlayerRole, subplotStage)
      : platform === 'imessage'
        ? getOffAppImessageChips(selected, steamyMode, playerTurnCount)
        : getTinderQuickChips(
            selected,
            steamyMode,
            playerTurnCount,
            sparksForSelected,
            isNumberEarnedForSelected,
          );

  const stageLabel =
    platform === 'imessage'
      ? steamyMode
        ? 'Off-App VIP • After Hours'
        : playerTurnCount < 2
          ? 'Off-App Win • Real Cell'
          : 'Off-App Steady • Date Locked'
      : playerTurnCount < 2
        ? 'Stage 1/4 • App Vetting'
        : playerTurnCount < 5
          ? 'Stage 2/4 • Pre-Date Spark'
          : playerTurnCount < 8
            ? 'Stage 3/4 • After Date #1'
            : 'Stage 4/4 • Going Steady';

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [turns.length, typing, selected.id, platform, tinderSubMode, discordChannel]);

  if (!open) return null;

  const switchPlatform = (nextPlatform: InboxAppPlatform) => {
    sfx.messagePop();
    setPlatform(nextPlatform);
    setCallBanner(null);
    setOpenTapbackMenuKey(null);
    setSubplotGuessFeedback(null);
    setInput('');
    if (nextPlatform === 'imessage') {
      if (
        earnedImessageContacts.length > 0 &&
        !progression.unlockedImessageIds.includes(selected.id)
      ) {
        setSelected(earnedImessageContacts[0]);
      }
    } else if (nextPlatform === 'tinder') {
      if (!isFlirtEarnedForSelected && steamyMode) {
        setSteamyMode(false);
      }
    }
  };

  const handleSwitchPlayerRole = (nextRole: 'her' | 'him') => {
    sfx.messagePop();
    setLocalPlayerRole(nextRole);
    onChangePlayerRole?.(nextRole);
    const nextDefault = pickDefaultContactForPlayerRole(nextRole, preferredHerId, preferredHisId);
    setSelected(nextDefault);
    setSteamyMode(false);
    setCallBanner(null);
    setSubplotGuessFeedback(null);
  };

  const unlockContactOffApp = (contactId: string, grantRewardKey?: string) => {
    updateProgression((prev) => ({
      ...prev,
      unlockedImessageIds: prev.unlockedImessageIds.includes(contactId)
        ? prev.unlockedImessageIds
        : [...prev.unlockedImessageIds, contactId],
      flirtUnlockedIds: prev.flirtUnlockedIds.includes(contactId)
        ? prev.flirtUnlockedIds
        : [...prev.flirtUnlockedIds, contactId],
    }));
    if (grantRewardKey) {
      onGrantBonusCredits?.(grantRewardKey, 2);
    }
  };

  const handleGuessMysterySuspect = (suspect: InboxContact) => {
    if (suspect.id === mysteryTargetContact.id) {
      sfx.victoryFanfare();
      updateProgression((prev) => ({
        unlockedImessageIds: prev.unlockedImessageIds.includes(mysteryTargetContact.id)
          ? prev.unlockedImessageIds
          : [...prev.unlockedImessageIds, mysteryTargetContact.id],
        flirtUnlockedIds: prev.flirtUnlockedIds.includes(mysteryTargetContact.id)
          ? prev.flirtUnlockedIds
          : [...prev.flirtUnlockedIds, mysteryTargetContact.id],
        subplotStageByRole: {
          ...prev.subplotStageByRole,
          [activePlayerRole]: 3,
        },
      }));
      onGrantBonusCredits?.(`discord_subplot_${activePlayerRole}`, 3);
      setSubplotGuessFeedback(
        `🎭 BUSTED! ${mysteryHandle} is ${mysteryTargetContact.name}, ${mysteryTargetContact.age}! +3 Bonus Credits & real iMessage number unlocked!`,
      );
    } else {
      sfx.redFlag();
      setSubplotGuessFeedback(
        `Not ${suspect.name}! Re-read the Sunday ritual clue in ${mysteryHandle}'s messages and guess again.`,
      );
    }
  };

  const greenTurnCount = turns.filter((t) => t.sender === 'match' && t.passed).length;
  const vibePercent = Math.min(
    100,
    Math.max(
      15,
      (isNumberEarnedForSelected ? 68 : 38) +
        greenTurnCount * 22 -
        turns.filter((t) => t.sender === 'match' && t.passed === false).length * 20,
    ),
  );

  const buildBuddyRemark = (passed: boolean, label: string): DiscordBuddyRemark => {
    if (passed) {
      return {
        author: 'Kyle_DTI_RunwayKing',
        color: '#57F287',
        badge: 'ROBLOX DTI',
        text: `🫡 W RIZZ IN #${discordChannel.toUpperCase()}!! write that down boys, ${label} approved that line!!`,
      };
    }
    return {
      author: 'BrodyLifts225',
      color: '#FEE75C',
      badge: 'COOKED',
      text: `💀 BRO GOT COOKED IN 4K IN #${discordChannel.toUpperCase()}!! pack it up and hop back on Dress to Impress`,
    };
  };

  const handleSelectTapback = (key: string, picked: string, aiReplyText?: string) => {
    sfx.messagePop();
    setTapbacks((prev) => {
      if (prev[key] === picked) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      if (aiReplyText) {
        sendAiFeedbackPing({
          persona: `${selected.name} (${selected.age})`,
          reaction: picked,
          aiReply: aiReplyText,
        });
      }
      return { ...prev, [key]: picked };
    });
    setOpenTapbackMenuKey(null);
  };

  const handleCycleTapback = (key: string, aiReplyText?: string) => {
    sfx.messagePop();
    setTapbacks((prev) => {
      const curr = prev[key];
      const nextIdx = curr
        ? (TAPBACK_OPTIONS.indexOf(curr as (typeof TAPBACK_OPTIONS)[number]) + 1) %
          (TAPBACK_OPTIONS.length + 1)
        : 0;
      if (nextIdx >= TAPBACK_OPTIONS.length) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      const picked = TAPBACK_OPTIONS[nextIdx];
      if (aiReplyText) {
        sendAiFeedbackPing({
          persona: `${selected.name} (${selected.age})`,
          reaction: picked,
          aiReply: aiReplyText,
        });
      }
      return { ...prev, [key]: picked };
    });
  };

  const handleAppendEmoji = (emoji: string) => {
    sfx.messagePop();
    setInput((prev) => `${prev && !prev.endsWith(' ') ? ' ' : ''}${emoji}`);
  };

  const pool = filteredContacts.length > 0 ? filteredContacts : INBOX_CONTACTS;
  const currentIdx = Math.max(0, pool.findIndex((c) => c.id === selected.id));
  const nextContact = pool[(currentIdx + 1) % pool.length] ?? pool[0];

  const handleNextMatch = () => {
    sfx.swipeLeft();
    setSelected(nextContact);
    setSteamyMode(false);
    setCallBanner(null);
  };

  const handlePrevMatch = () => {
    sfx.messagePop();
    const prev = pool[(currentIdx - 1 + pool.length) % pool.length] ?? pool[0];
    setSelected(prev);
    setSteamyMode(false);
    setCallBanner(null);
  };

  const handleTinderDeckAction = (dir: 'left' | 'right' | 'super') => {
    if (swipeFly) return;
    setSwipeFly(dir);
    setSwipeDragX(0);

    if (dir === 'left') {
      sfx.swipeLeft();
      window.setTimeout(() => {
        setSwipeFly(null);
        setSelected(nextContact);
      }, 340);
      return;
    }

    if (dir === 'super') {
      sfx.victoryFanfare();
      setSuperLikedIds((prev) => (prev.includes(selected.id) ? prev : [...prev, selected.id]));
    } else {
      sfx.swipeRight();
    }

    window.setTimeout(() => {
      setSwipeFly(null);
      setTinderSubMode('messages');
      setCallBanner(
        dir === 'super'
          ? `⭐ IT'S A SUPER MATCH! ${selected.name} saw your blue star. Land 2 smooth lines to earn ${selected.role === 'her' ? 'her' : 'his'} real number!`
          : `🔥 IT'S A MATCH with ${selected.name}! Earn 2 sparks to unlock Flirt Mode & ${selected.role === 'her' ? 'her' : 'his'} real iMessage number!`,
      );
    }, 340);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || typing) return;

    if (platform === 'imessage' && !isNumberEarnedForSelected) {
      return;
    }

    if (
      freeMessagesSent >= 3 &&
      (freeMessagesSent - 3) % 3 === 0 &&
      !wallet.isVip &&
      !wallet.isFounderUnlimited
    ) {
      const ok = onSpendCreditOrOpenBoutique();
      if (!ok) return;
    }
    setFreeMessagesSent((n) => n + 1);

    sfx.messagePop();
    const activeThreadKey = threadKey;
    const nextTurns = [...turns, { sender: 'player' as const, text: trimmed }];
    setTurnsByThread((prev) => ({ ...prev, [activeThreadKey]: nextTurns }));
    setInput('');
    setTyping(true);

    // Anonymous Discord Server Mode uses mystery/community personas rather than exposing Tinder match bios
    const targetContact =
      platform === 'discord' ? mysteryTargetContact : selected;
    const seedPrompt =
      platform === 'tinder'
        ? activeTinderPrompt
        : platform === 'imessage'
          ? activeImessagePrompt
          : '';

    const priorHistory: LiveInboxTurn[] = [
      ...(seedPrompt ? [{ sender: 'match' as const, text: seedPrompt }] : []),
      ...nextTurns,
    ];

    const verdict = await liveAiInboxService.evaluateOpeningDm({
      personaId: targetContact.id,
      personaName:
        platform === 'discord' && subplotStage < 3
          ? mysteryHandle
          : targetContact.name,
      personaAge: targetContact.age,
      personaTitle:
        platform === 'discord'
          ? 'Anonymous Velvet Lounge Regular'
          : steamyMode
            ? `${targetContact.title} (Earned Flirt Mode)`
            : platform === 'imessage'
              ? `${targetContact.title} (Earned Off-App iMessage)`
              : targetContact.title,
      personaRole: targetContact.role,
      platform,
      playerMessage: trimmed,
      history: priorHistory,
    });

    setTyping(false);

    // Check if this Tinder reply just earned Flirt Mode & Off-App iMessage Number!
    let justEarnedOffApp = false;
    if (platform === 'tinder' && verdict.passedVibeCheck) {
      const newSparkTotal = sparksForSelected + 1;
      const askedOffApp =
        /\b(number|digits|imessage|off[- ]?app|real\s+cell|text\s+my\s+real)\b/i.test(trimmed);
      if (
        !isNumberEarnedForSelected &&
        (newSparkTotal >= 2 || (askedOffApp && sparksForSelected >= 1))
      ) {
        justEarnedOffApp = true;
        sfx.victoryFanfare();
        unlockContactOffApp(selected.id, 'first_off_app_win');
      } else {
        sfx.greenFlag();
      }
    } else if (platform === 'discord') {
      if (verdict.passedVibeCheck) {
        sfx.greenFlag();
        if (discordChannel === 'mystery-subplot') {
          const nextStage = Math.min(3, Math.max(2, subplotStage + 1));
          updateProgression((prev) => ({
            ...prev,
            unlockedImessageIds:
              nextStage >= 3 && !prev.unlockedImessageIds.includes(mysteryTargetContact.id)
                ? [...prev.unlockedImessageIds, mysteryTargetContact.id]
                : prev.unlockedImessageIds,
            flirtUnlockedIds:
              nextStage >= 3 && !prev.flirtUnlockedIds.includes(mysteryTargetContact.id)
                ? [...prev.flirtUnlockedIds, mysteryTargetContact.id]
                : prev.flirtUnlockedIds,
            subplotStageByRole: {
              ...prev.subplotStageByRole,
              [activePlayerRole]: nextStage,
            },
          }));
          if (nextStage >= 3 && subplotStage < 3) {
            sfx.victoryFanfare();
            onGrantBonusCredits?.(`discord_subplot_${activePlayerRole}`, 3);
          }
        } else if (subplotStage === 0) {
          updateProgression((prev) => ({
            ...prev,
            subplotStageByRole: {
              ...prev.subplotStageByRole,
              [activePlayerRole]: 1,
            },
          }));
        }
      } else {
        sfx.redFlag();
      }
    } else {
      if (verdict.passedVibeCheck) sfx.greenFlag();
      else sfx.redFlag();
    }

    const updatedPlayerTurns = nextTurns.map((t, idx) =>
      idx === nextTurns.length - 1 ? { ...t, passed: verdict.passedVibeCheck } : t,
    );

    const replyText =
      platform === 'discord' &&
      discordChannel === 'mystery-subplot' &&
      verdict.passedVibeCheck &&
      subplotStage === 1
        ? activePlayerRole === 'him'
          ? `${verdict.herReply} Clue two: my dog is none, my weakness is a pulled-out chair and a dirty martini.`
          : `${verdict.herReply} Clue two: I left an AI safety lab at 28 and never split checks.`
        : platform === 'discord' &&
            discordChannel === 'mystery-subplot' &&
            verdict.passedVibeCheck &&
            subplotStage >= 2
          ? activePlayerRole === 'him'
            ? `Okay busted, it's Claire. Keep my anon handle secret and text my real cell on iMessage.`
            : `Okay busted, it's Kieran. Don't expose my anon handle, text my real iMessage instead!`
          : verdict.herReply;

    const replyHandle =
      platform === 'discord'
        ? discordChannel === 'mystery-subplot'
          ? subplotStage >= 2 && verdict.passedVibeCheck
            ? `${mysteryTargetContact.name} (${mysteryHandle})`
            : mysteryHandle
          : discordChannel === 'vetting-hotline'
            ? activePlayerRole === 'him'
              ? '@malibu_biotech_anon'
              : '@cast_iron_cub_26'
            : mysteryHandle
        : undefined;

    const replyBadge =
      platform === 'discord'
        ? discordChannel === 'mystery-subplot'
          ? '🕵️ MYSTERY SUBPLOT'
          : activePlayerRole === 'him'
            ? '🐆 ANON COUGAR'
            : '🥂 ANON CUB'
        : undefined;

    setTurnsByThread((prev) => ({
      ...prev,
      [activeThreadKey]: [
        ...updatedPlayerTurns,
        {
          sender: 'match',
          text: replyText,
          passed: verdict.passedVibeCheck,
          authorHandle: replyHandle,
          authorBadge: replyBadge,
          unlockedOffAppNow: justEarnedOffApp,
          buddy: buildBuddyRemark(
            verdict.passedVibeCheck,
            platform === 'discord' ? 'the lounge' : selected.name,
          ),
        },
      ],
    }));

    const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
    setCoachByThread((prev) => ({
      ...prev,
      [activeThreadKey]: {
        note: justEarnedOffApp
          ? `🎉 Off-App Win! You earned ${selected.name}'s real number AND unlocked Flirt Mode!`
          : verdict.coachNote,
        deltas: `Maturity ${sign(verdict.maturityDelta)} • Chivalry ${sign(verdict.chivalryDelta)} • Chemistry ${sign(verdict.chemistryDelta)}`,
        passed: verdict.passedVibeCheck,
        source: verdict.source === 'workers-ai' ? 'Live AI' : 'Instant Vibe',
      },
    }));
  };

  const handleSubmitTeaStory = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = teaStory.trim();
    if (clean.length < 8) return;
    sfx.victoryFanfare();
    sendAiFeedbackPing({
      persona: `${selected.name} (${selected.age})`,
      reaction: 'TEA_STORY',
      note: clean,
      optionalContact: teaContact.trim().slice(0, 120) || undefined,
    });
    onGrantBonusCredits?.('tea_story_submitted', 3);
    setTeaStory('');
    setTeaContact('');
    setTeaSubmitted(true);
  };

  const isDarkDiscord = platform === 'discord';
  const isAppleMessages = platform === 'imessage';
  const playerAnonHandle =
    activePlayerRole === 'her' ? '@anon_cougar_vip' : '@anon_younger_man';

  return (
    <section
      role="dialog"
      aria-label="Survive Their Inbox: Live AI Texting Mode"
      className="w-full space-y-4 animate-stage-in"
    >
      {/* =====================================================================
       * TOP COMMAND, IDENTITY & PROGRESSION LEVEL SWITCHER BAR
       * ===================================================================== */}
      <div className="vice-panel rounded-3xl bg-white px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Live Inbox and return to Matchmaker Lobby"
            className="pop-btn h-9 inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-[#FFF0F5] px-3.5 text-xs sm:text-sm font-bold text-[#18101E] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-[#FD267A]" />
            <span>Back to Lobby</span>
          </button>

          {/* Single-Gender Match Identity Switcher */}
          <div
            role="group"
            aria-label="Your dating identity"
            className="inline-flex items-center rounded-full border border-[#18101E]/12 bg-[#F8FAFC] p-0.5 text-xs font-bold"
          >
            <span className="hidden sm:inline pl-2.5 pr-1.5 text-[11px] font-semibold text-[#64748B]">
              You are:
            </span>
            <button
              type="button"
              onClick={() => handleSwitchPlayerRole('her')}
              className={`h-8 rounded-full px-3 transition cursor-pointer ${
                activePlayerRole === 'her'
                  ? 'bg-[#E11D48] text-white shadow-2xs'
                  : 'text-[#475569] hover:text-[#18101E]'
              }`}
            >
              🐆 Woman
            </button>
            <button
              type="button"
              onClick={() => handleSwitchPlayerRole('him')}
              className={`h-8 rounded-full px-3 transition cursor-pointer ${
                activePlayerRole === 'him'
                  ? 'bg-[#F59E0B] text-[#18101E] shadow-2xs'
                  : 'text-[#475569] hover:text-[#18101E]'
              }`}
            >
              🥂 Younger Man
            </button>
          </div>

          {onJumpToWorld && (
            <button
              type="button"
              onClick={onJumpToWorld}
              className="pop-btn hidden md:inline-flex h-9 items-center gap-1.5 rounded-full bg-[#ECFDF5] hover:bg-[#D1FAE5] px-3 text-xs font-bold text-[#065F46] cursor-pointer"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>8-Bit World</span>
            </button>
          )}

          <div className="hidden xl:block pl-1">
            <div className="font-display text-sm text-[#18101E] leading-tight">
              {platform === 'tinder'
                ? `Level 1: Tinder Match Vetting (${sparksForSelected}/2 Sparks)`
                : platform === 'imessage'
                  ? `Level 2: Earned Off-App iMessage (${earnedImessageContacts.length} Unlocked)`
                  : `Anon Lounge: Club Discord & Mystery Subplot`}
            </div>
            <div className="text-[11px] font-semibold text-[#64748B]">
              {platform === 'tinder'
                ? 'Land 2 green-flag lines to earn Flirt Mode & move off-app to iMessage'
                : platform === 'imessage'
                  ? 'Personal numbers you earned off Tinder with separate off-app threads'
                  : 'Anonymous community chat + unmask the Mystery Regular (+3 Cr)'}
            </div>
          </div>
        </div>

        {/* 3 Distinct Levels/Modes: Tinder (Vetting) -> iMessage (Earned #) -> Discord (Anon Lounge) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full border border-[#18101E]/12 bg-[#F8FAFC] p-1 text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => switchPlatform('tinder')}
              aria-label="Tinder"
              className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 transition cursor-pointer ${
                platform === 'tinder'
                  ? 'bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#18101E]'
              }`}
            >
              <Flame className="h-3.5 w-3.5 fill-current" />
              <span>Tinder</span>
            </button>

            <button
              type="button"
              onClick={() => switchPlatform('imessage')}
              aria-label="iMessage"
              className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 transition cursor-pointer ${
                platform === 'imessage'
                  ? 'bg-[#007AFF] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#18101E]'
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5 fill-current" />
              <span>iMessage</span>
              {earnedImessageContacts.length > 0 ? (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    platform === 'imessage'
                      ? 'bg-white text-[#007AFF]'
                      : 'bg-[#007AFF] text-white'
                  }`}
                >
                  {earnedImessageContacts.length}
                </span>
              ) : (
                <Lock className="h-3 w-3 opacity-70" />
              )}
            </button>

            <button
              type="button"
              onClick={() => switchPlatform('discord')}
              aria-label="Discord"
              className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 transition cursor-pointer ${
                platform === 'discord'
                  ? 'bg-[#5865F2] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#18101E]'
              }`}
            >
              <Hash className="h-3.5 w-3.5" />
              <span>Discord</span>
              {subplotStage >= 1 && subplotStage < 3 && (
                <span className="rounded-full bg-[#FEE75C] px-1.5 text-[9px] font-extrabold text-[#18101E]">
                  DM!
                </span>
              )}
            </button>
          </div>

          {/* Earned Flirt Mode Switcher (Only for 1-on-1 Tinder & Earned iMessage; locked until 2 sparks!) */}
          {platform !== 'discord' && (
            <div className="inline-flex rounded-full border border-[#18101E]/12 bg-[#F8FAFC] p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  setSteamyMode(false);
                }}
                className={`h-8 rounded-full px-3 transition cursor-pointer ${
                  !steamyMode ? 'bg-[#18101E] text-white' : 'text-[#475569]'
                }`}
              >
                {platform === 'imessage' ? '📱 Off-App' : '🍸 First DM'}
              </button>
              <button
                type="button"
                aria-label="Flirt Mode"
                onClick={() => {
                  if (!isFlirtEarnedForSelected) {
                    sfx.redFlag();
                    setCallBanner(
                      `🔒 Flirt Mode is earned! Land 2 green-flag replies with ${selected.name} (${sparksForSelected}/2 sparks) before turning up the heat.`,
                    );
                    return;
                  }
                  sfx.messagePop();
                  setSteamyMode(true);
                  setCallBanner(null);
                }}
                className={`inline-flex h-8 items-center gap-1 rounded-full px-3 transition cursor-pointer ${
                  steamyMode
                    ? 'bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-white'
                    : isFlirtEarnedForSelected
                      ? 'text-[#E11D48] hover:bg-[#FFF0F5]'
                      : 'text-[#64748B] opacity-85'
                }`}
              >
                {isFlirtEarnedForSelected ? (
                  <Flame className="h-3 w-3" />
                ) : (
                  <Lock className="h-3 w-3" />
                )}
                <span>
                  {isFlirtEarnedForSelected
                    ? 'Flirt Mode'
                    : `Flirt Mode (${sparksForSelected}/2)`}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
       * ISOLATED PLATFORM SHELL (key={platform} guarantees ZERO superimposed DOM!)
       * ===================================================================== */}
      <div
        key={platform}
        className={`animate-stage-in overflow-hidden rounded-3xl border shadow-[0_20px_50px_-14px_rgba(15,23,42,0.22)] grid grid-cols-1 lg:grid-cols-[300px_1fr_340px] items-start ${
          isDarkDiscord
            ? 'border-[#1F2023] bg-[#313338] text-[#DBDEE1]'
            : isAppleMessages
              ? 'border-[#D1D1D6] bg-[#F5F5F7] text-[#1C1C1E]'
              : 'border-black/10 bg-white text-[#18101E]'
        }`}
      >
        {/* -------------------------------------------------------------------
         * COLUMN 1: PLATFORM-SPECIFIC SIDEBAR
         * ------------------------------------------------------------------- */}
        {isDarkDiscord ? (
          /* DISCORD ANONYMOUS COMMUNITY SERVER + MYSTERY SUBPLOT SIDEBAR */
          <aside className="flex h-[360px] lg:h-[680px] border-b lg:border-b-0 lg:border-r border-[#1F2023] bg-[#2B2D31]">
            <div className="hidden sm:flex w-14 shrink-0 flex-col items-center gap-2.5 bg-[#1E1F22] py-3">
              <button
                type="button"
                onClick={() => setDiscordChannel('general-lounge')}
                title="Velvet Lounge Anon Server"
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5865F2] to-[#E11D48] text-lg text-white shadow-md cursor-pointer"
              >
                <span className="absolute -left-1.5 h-7 w-1 rounded-r-full bg-white" />
                🎭
              </button>
              <div className="h-0.5 w-7 rounded-full bg-[#35363C]" />
              <button
                type="button"
                onClick={() => setDiscordChannel('boys-roblox-vc')}
                title="#boys-roblox-vc"
                className="flex h-11 w-11 items-center justify-center rounded-3xl hover:rounded-2xl bg-[#313338] hover:bg-[#23A55A] text-base transition-all cursor-pointer"
              >
                🎮
              </button>
              <button
                type="button"
                onClick={onJumpToWorld}
                title="8-Bit Lounge Arcade"
                className="flex h-11 w-11 items-center justify-center rounded-3xl hover:rounded-2xl bg-[#313338] text-[#23A55A] hover:bg-[#23A55A] hover:text-white transition-all cursor-pointer"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1F2023] px-3.5 py-3">
                  <span className="truncate text-sm font-extrabold text-white">
                    Velvet Lounge (Anon)
                  </span>
                  <span className="rounded bg-[#1E1F22] px-2 py-0.5 text-[10px] font-bold text-[#57F287]">
                    8 Online
                  </span>
                </div>

                <div className="px-2.5 space-y-1">
                  <div className="px-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#949BA4]">
                    Anon Community Channels
                  </div>
                  {(
                    [
                      ['general-lounge', 'Cougar & Cub Lounge'],
                      ['vetting-hotline', 'Anon Advice & Roasts'],
                      ['boys-roblox-vc', 'Roblox DTI Locker Room'],
                    ] as const
                  ).map(([id, subtitle]) => {
                    const active = discordChannel === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          sfx.messagePop();
                          setDiscordChannel(id);
                        }}
                        className={`w-full flex items-center justify-between gap-1.5 rounded-md px-2 py-2 text-left text-xs font-semibold transition cursor-pointer ${
                          active
                            ? 'bg-[#404249] text-white'
                            : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Hash className="h-4 w-4 shrink-0 text-[#80848E]" />
                            <span className="truncate font-bold">{id}</span>
                          </div>
                          <div className="pl-5.5 truncate text-[10px] text-[#949BA4]">
                            {subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Anonymous Mystery Subplot DM Section */}
                <div className="px-2.5 pt-2 space-y-1.5 border-t border-[#1F2023]">
                  <div className="px-1.5 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#FEE75C]">
                    <span>🕵️ Mystery Subplot DM</span>
                    <span>{subplotStage}/3</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (subplotStage === 0) {
                        sfx.redFlag();
                        setDiscordChannel('general-lounge');
                        setSubplotGuessFeedback(
                          `🔒 Post 1 message in #general-lounge first so ${mysteryHandle} notices you and opens DMs!`,
                        );
                        return;
                      }
                      sfx.messagePop();
                      setDiscordChannel('mystery-subplot');
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-lg border px-2.5 py-2.5 text-left transition cursor-pointer ${
                      discordChannel === 'mystery-subplot'
                        ? 'border-[#FEE75C] bg-[#404249] text-white'
                        : subplotStage >= 1
                          ? 'border-[#FEE75C]/40 bg-[#232428] text-[#F2F3F5] hover:bg-[#35373C]'
                          : 'border-[#3F4147] bg-[#1E1F22]/70 text-[#949BA4]'
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-sm">
                      {subplotStage === 0 ? '🔒' : subplotStage >= 3 ? '🎭' : '🕵️'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-extrabold text-white">
                        {subplotStage >= 3
                          ? `${mysteryTargetContact.name} (Unmasked!)`
                          : mysteryHandle}
                      </div>
                      <div className="truncate text-[10px] text-[#B5BAC1]">
                        {subplotStage === 0
                          ? 'Post in #general-lounge to unlock'
                          : subplotStage >= 3
                            ? 'Real iMessage # unlocked!'
                            : 'Anon crush • Spot the clues!'}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Bottom Anon Handle Status Bar */}
              <div className="flex items-center justify-between bg-[#232428] px-2.5 py-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-xs font-extrabold text-white">
                    🎭
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#232428] bg-[#23A55A]" />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <div className="truncate text-xs font-bold text-white">{playerAnonHandle}</div>
                    <div className="text-[10px] text-[#23A55A]">Identity Masked</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[#B5BAC1]">
                  <Mic className="h-4 w-4" />
                  <Headphones className="h-4 w-4" />
                </div>
              </div>
            </div>
          </aside>
        ) : isAppleMessages ? (
          /* APPLE MESSAGES SIDEBAR: EARNED OFF-APP NUMBERS ONLY AT TOP */
          <aside className="flex flex-col border-b lg:border-b-0 lg:border-r border-[#D1D1D6] bg-[#F2F2F7]/95 h-[340px] lg:h-[680px]">
            <div className="px-4 pt-3 pb-2.5 space-y-2.5 border-b border-[#D1D1D6]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                  <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                  <span className="ml-2 text-sm font-bold text-[#1C1C1E]">Messages</span>
                </div>

                <span className="rounded-lg bg-[#007AFF]/12 px-2.5 py-0.5 text-[11px] font-bold text-[#007AFF]">
                  {earnedImessageContacts.length} Earned #
                </span>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8E8E93]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search off-app contacts"
                  className="w-full rounded-xl bg-[#E5E5EA] pl-8 pr-3 py-1.5 text-xs font-medium text-[#1C1C1E] placeholder:text-[#8E8E93] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain p-2 space-y-1">
              {earnedImessageContacts.length > 0 && (
                <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#007AFF]">
                  📱 Earned Off-App Numbers ({earnedImessageContacts.length})
                </div>
              )}

              {earnedImessageContacts.map((c) => {
                const active = c.id === selected.id;
                const tKey = `imessage:${c.id}:${steamyMode ? 'flirt' : 'offapp'}`;
                const threadTurns = turnsByThread[tKey] ?? [];
                const preview =
                  threadTurns.length > 0
                    ? threadTurns[threadTurns.length - 1].text
                    : buildOffAppOpeningText(c, steamyMode);

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sfx.messagePop();
                      setSelected(c);
                      setCallBanner(null);
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition cursor-pointer ${
                      active ? 'bg-[#007AFF] text-white' : 'hover:bg-black/5 text-[#1C1C1E]'
                    }`}
                  >
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      className="h-10 w-10 rounded-full object-cover object-top shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-xs font-bold">
                          {c.name}, {c.age}
                        </span>
                        <span
                          className={`shrink-0 text-[10px] ${
                            active ? 'text-white/85' : 'text-[#34C759] font-bold'
                          }`}
                        >
                          Off-App ✓
                        </span>
                      </div>
                      <p
                        className={`line-clamp-2 text-[11px] leading-snug mt-0.5 ${
                          active ? 'text-white/90' : 'text-[#8E8E93]'
                        }`}
                      >
                        {preview}
                      </p>
                    </div>
                  </button>
                );
              })}

              <div className="px-2 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-[#8E8E93]">
                🔒 Still on Tinder (Win Their Number)
              </div>

              {lockedTinderContacts.slice(0, 8).map((c) => {
                const sparks = getSparksForContact(c.id);
                const active = c.id === selected.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sfx.messagePop();
                      setSelected(c);
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition cursor-pointer ${
                      active
                        ? 'bg-[#E5E5EA] text-[#1C1C1E]'
                        : 'opacity-75 hover:opacity-100 hover:bg-black/5 text-[#636366]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={c.photoUrl}
                        alt={c.name}
                        className="h-9 w-9 rounded-full object-cover object-top grayscale-[35%]"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1C1C1E] text-white">
                        <Lock className="h-2.5 w-2.5" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-xs font-semibold">
                          {c.name}, {c.age}
                        </span>
                        <span className="shrink-0 text-[10px] font-bold text-[#007AFF]">
                          {sparks}/2 Sparks
                        </span>
                      </div>
                      <p className="truncate text-[10.5px] text-[#8E8E93]">
                        Locked • Win {c.role === 'her' ? 'her' : 'his'} # on Tinder
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        ) : (
          /* TINDER WEB SIDEBAR (App Matches & Spark Progress) */
          <aside className="flex flex-col border-b lg:border-b-0 lg:border-r border-[#E5E7EB] bg-[#FAFAFC] h-[340px] lg:h-[680px]">
            <div className="bg-gradient-to-r from-[#FD267A] to-[#FF6036] px-4 py-3 text-white space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-display text-base tracking-tight">
                  <Flame className="h-4 w-4 fill-white" />
                  <span>tinder</span>
                </div>
                <span className="rounded-full bg-black/20 px-2.5 py-0.5 text-[11px] font-bold text-white/95">
                  {filteredContacts.length} {matchRole === 'him' ? 'Cubs' : 'Matches'}
                </span>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/80" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search matches..."
                  className="w-full rounded-full bg-white/20 pl-8 pr-3 py-1.5 text-xs font-semibold text-white placeholder:text-white/80 focus:bg-white/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="border-b border-[#E5E7EB] px-3.5 py-2.5 bg-white">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#FD267A] mb-2">
                New Matches • Earn 2 Sparks for Real #
              </div>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-0.5">
                {filteredContacts.slice(0, 8).map((c) => {
                  const isSel = c.id === selected.id;
                  const won = progression.unlockedImessageIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        sfx.messagePop();
                        setSelected(c);
                        if (!progression.flirtUnlockedIds.includes(c.id) && !won) {
                          setSteamyMode(false);
                        }
                        setCallBanner(null);
                      }}
                      className="group flex flex-col items-center shrink-0 cursor-pointer"
                    >
                      <div
                        className={`relative rounded-full p-0.5 ${
                          isSel
                            ? 'bg-gradient-to-tr from-[#FD267A] to-[#FFBE0B]'
                            : 'bg-gradient-to-tr from-[#FD267A]/60 to-[#FF6036]/60'
                        }`}
                      >
                        <img
                          src={c.photoUrl}
                          alt={c.name}
                          className="h-11 w-11 rounded-full object-cover object-top border-2 border-white"
                        />
                        <span
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                            won ? 'bg-[#007AFF]' : 'bg-[#21D07C]'
                          }`}
                        />
                      </div>
                      <span className="mt-1 text-[11px] font-bold text-[#18101E] group-hover:text-[#FD267A]">
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-[#F1F5F9]">
              {filteredContacts.map((c) => {
                const active = c.id === selected.id;
                const won = progression.unlockedImessageIds.includes(c.id);
                const sparks = getSparksForContact(c.id);
                const tKey = `tinder:${c.id}:vet`;
                const threadTurns = turnsByThread[tKey] ?? [];
                const preview =
                  threadTurns.length > 0
                    ? threadTurns[threadTurns.length - 1].text
                    : c.openingPrompt || '✨ New Match • Your move first';

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sfx.messagePop();
                      setSelected(c);
                      if (!progression.flirtUnlockedIds.includes(c.id) && !won) {
                        setSteamyMode(false);
                      }
                      setCallBanner(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition cursor-pointer ${
                      active
                        ? 'bg-[#FFF0F5] border-l-4 border-l-[#FD267A]'
                        : 'bg-white hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={c.photoUrl}
                        alt={c.name}
                        className="h-12 w-12 rounded-full object-cover object-top"
                      />
                      {threadTurns.length === 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#FD267A]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-sm font-extrabold text-[#18101E]">
                          {c.name}, {c.age}
                        </span>
                        {won ? (
                          <span className="shrink-0 rounded-full bg-[#EFF6FF] px-2 py-0.2 text-[10px] font-extrabold text-[#007AFF]">
                            📱 Off-App ✓
                          </span>
                        ) : (
                          <span className="shrink-0 text-[10px] font-bold text-[#94A3B8]">
                            {sparks}/2 ✨
                          </span>
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs font-medium text-[#64748B] mt-0.5 leading-snug">
                        {preview}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* -------------------------------------------------------------------
         * COLUMN 2: CENTER LIVE CANVAS
         * ------------------------------------------------------------------- */}
        {platform === 'tinder' ? (
          <div className="flex flex-col overflow-hidden bg-white font-sans text-[#18101E] h-[640px] lg:h-[680px]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] bg-white px-4 py-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0 rounded-full bg-gradient-to-tr from-[#FD267A] to-[#FF6036] p-0.5">
                  <img
                    src={selected.photoUrl}
                    alt={selected.name}
                    className="h-10 w-10 rounded-full object-cover object-top border-2 border-white"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm sm:text-base font-extrabold text-[#18101E]">
                      {selected.name}, {selected.age}
                    </span>
                    <BadgeCheck className="h-4 w-4 shrink-0 fill-[#1786FF] text-white" />
                    {isNumberEarnedForSelected ? (
                      <button
                        type="button"
                        onClick={() => switchPlatform('imessage')}
                        className="rounded-full bg-[#007AFF] px-2.5 py-0.5 text-[10px] font-extrabold text-white cursor-pointer"
                      >
                        📱 iMessage Unlocked →
                      </button>
                    ) : (
                      <span className="rounded-full bg-[#FFF0F5] px-2 py-0.5 text-[10px] font-extrabold text-[#FD267A]">
                        📱 Number: {Math.min(2, sparksForSelected)}/2 Sparks
                      </span>
                    )}
                    {superLikedIds.includes(selected.id) && (
                      <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-extrabold text-[#0284C7]">
                        ★ SUPER LIKED
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-[#64748B] truncate">
                    🔥 {stageLabel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <div className="inline-flex rounded-full bg-[#F1F5F9] p-0.5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setTinderSubMode('messages')}
                    className={`rounded-full px-3 py-1 transition cursor-pointer ${
                      tinderSubMode === 'messages'
                        ? 'bg-white text-[#FD267A] shadow-2xs'
                        : 'text-[#64748B]'
                    }`}
                  >
                    💬 Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => setTinderSubMode('swipe')}
                    className={`rounded-full px-3 py-1 transition cursor-pointer ${
                      tinderSubMode === 'swipe'
                        ? 'bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-white shadow-2xs'
                        : 'text-[#64748B]'
                    }`}
                  >
                    🔥 Swipe Cards
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sfx.victoryFanfare();
                    setSuperLikedIds((prev) =>
                      prev.includes(selected.id) ? prev : [...prev, selected.id],
                    );
                    setCallBanner(
                      `⭐ You Super-Liked ${selected.name}! Send two smooth lines to earn ${selected.role === 'her' ? 'her' : 'his'} real cell number.`,
                    );
                  }}
                  title="Send Super Like"
                  className="tinder-fab inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[#BAE6FD] bg-[#F0F9FF] text-[#00A8FF] cursor-pointer"
                >
                  <Star className="h-4 w-4 fill-[#00A8FF]" />
                </button>
              </div>
            </div>

            {tinderSubMode === 'swipe' ? (
              <div className="flex-1 flex flex-col items-center justify-between bg-[#F8FAFC] p-4 sm:p-5 overflow-hidden">
                <div className="relative w-full max-w-[360px] flex-1 max-h-[470px]">
                  <div className="pointer-events-none absolute inset-0 scale-95 translate-y-2 overflow-hidden rounded-[26px] bg-[#111827] opacity-65 shadow-md">
                    <img
                      src={nextContact.photoUrl}
                      alt=""
                      className="h-full w-full object-cover object-top"
                    />
                  </div>

                  <div
                    onPointerDown={(e) => {
                      if ((e.target as HTMLElement).closest('button')) return;
                      swipeStartXRef.current = e.clientX;
                      setIsSwipeDragging(true);
                    }}
                    onPointerMove={(e) => {
                      if (swipeStartXRef.current === null) return;
                      setSwipeDragX(
                        Math.max(-220, Math.min(220, e.clientX - swipeStartXRef.current)),
                      );
                    }}
                    onPointerUp={() => {
                      if (swipeStartXRef.current === null) return;
                      const dx = swipeDragX;
                      swipeStartXRef.current = null;
                      setIsSwipeDragging(false);
                      if (dx > 75) handleTinderDeckAction('right');
                      else if (dx < -75) handleTinderDeckAction('left');
                      else setSwipeDragX(0);
                    }}
                    style={{
                      transform:
                        swipeFly === null
                          ? `translate3d(${swipeDragX}px, 0, 0) rotate(${(swipeDragX / 14).toFixed(1)}deg)`
                          : undefined,
                      transition: isSwipeDragging
                        ? 'none'
                        : 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                    className={`relative z-10 h-full w-full select-none overflow-hidden rounded-[26px] bg-[#111827] shadow-2xl cursor-grab active:cursor-grabbing ${
                      swipeFly === 'left'
                        ? 'animate-swipe-left'
                        : swipeFly === 'right'
                          ? 'animate-swipe-right'
                          : swipeFly === 'super'
                            ? 'animate-swipe-up'
                            : ''
                    }`}
                  >
                    <img
                      src={selected.photoUrl}
                      alt={selected.name}
                      draggable={false}
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {(swipeFly === 'right' || swipeDragX > 24) && (
                      <div className="pointer-events-none absolute top-10 left-5 -rotate-12 rounded-xl border-4 border-[#21D07C] px-4 py-1 text-3xl font-black tracking-widest text-[#21D07C]">
                        LIKE
                      </div>
                    )}
                    {(swipeFly === 'left' || swipeDragX < -24) && (
                      <div className="pointer-events-none absolute top-10 right-5 rotate-12 rounded-xl border-4 border-[#FD267A] px-4 py-1 text-3xl font-black tracking-widest text-[#FD267A]">
                        NOPE
                      </div>
                    )}
                    {swipeFly === 'super' && (
                      <div className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 -rotate-6 whitespace-nowrap rounded-xl border-4 border-[#00A8FF] px-4 py-1 text-2xl font-black tracking-widest text-[#38BDF8]">
                        SUPER LIKE ★
                      </div>
                    )}

                    <div className="absolute inset-x-4 bottom-4 text-white space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-3xl">
                          {selected.name} <span className="font-semibold">{selected.age}</span>
                        </span>
                        <BadgeCheck className="h-5 w-5 fill-[#1786FF] text-white" />
                      </div>
                      <p className="text-xs font-semibold text-white/90">{selected.title}</p>
                      <p className="text-xs text-white/85 leading-snug">{selected.tagline}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handlePrevMatch}
                    title="Rewind"
                    className="tinder-fab flex h-11 w-11 items-center justify-center rounded-full border border-[#F59E0B]/35 bg-white text-[#F59E0B] shadow-md cursor-pointer"
                  >
                    <RotateCcw className="h-4.5 w-4.5 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTinderDeckAction('left')}
                    title="Nope"
                    className="tinder-fab flex h-15 w-15 items-center justify-center rounded-full border-2 border-[#FD267A]/30 bg-white text-[#FD267A] shadow-lg cursor-pointer"
                  >
                    <X className="h-7 w-7 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTinderDeckAction('super')}
                    title="Super Like & Chat"
                    className="tinder-fab flex h-12.5 w-12.5 items-center justify-center rounded-full border border-[#00A8FF]/35 bg-white text-[#00A8FF] shadow-md cursor-pointer"
                  >
                    <Star className="h-5.5 w-5.5 fill-[#00A8FF]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTinderDeckAction('right')}
                    title="Like & Open DM"
                    className="tinder-fab flex h-15 w-15 items-center justify-center rounded-full bg-gradient-to-tr from-[#10B981] to-[#21D07C] text-white shadow-lg cursor-pointer"
                  >
                    <Heart className="h-7 w-7 fill-white" />
                  </button>
                </div>
              </div>
            ) : (
              /* TINDER VETTING MESSAGE THREAD */
              <>
                <div
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto overscroll-contain bg-[#FCFCFD] p-4 sm:p-6 space-y-4"
                >
                  <div className="text-center">
                    <span className="inline-block rounded-full bg-[#FFF0F5] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#FD267A]">
                      🔥 {steamyMode ? 'Earned Flirt Mode' : 'Tinder App Vetting'} •{' '}
                      {selected.height} • {selected.zodiac.split('•')[0].trim()}
                    </span>
                  </div>

                  {callBanner && (
                    <div className="mx-auto max-w-md rounded-2xl border border-[#FBCFE8] bg-[#FFF5F8] px-4 py-2.5 text-center text-xs font-bold text-[#9D174D]">
                      {callBanner}
                    </div>
                  )}

                  {activeTinderPrompt ? (
                    <div className="flex items-end gap-2.5 max-w-[86%]">
                      <img
                        src={selected.photoUrl}
                        alt={selected.name}
                        className="h-8 w-8 rounded-full object-cover object-top shrink-0"
                      />
                      <div className="flex items-center gap-1.5">
                        <div className="rounded-3xl rounded-bl-md bg-[#F0F2F4] px-4 py-3 text-[15px] leading-snug text-[#18101E] shadow-2xs">
                          {activeTinderPrompt}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCycleTapback(`${threadKey}:open`, activeTinderPrompt)
                          }
                          title="Heart message"
                          className={`p-1.5 rounded-full transition cursor-pointer ${
                            tapbacks[`${threadKey}:open`]
                              ? 'text-[#FD267A] scale-110'
                              : 'text-[#CBD5E1] hover:text-[#FD267A]'
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              tapbacks[`${threadKey}:open`] ? 'fill-[#FD267A]' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ) : turns.length === 0 ? (
                    <div className="mx-auto max-w-sm rounded-3xl border border-[#FBCFE8] bg-gradient-to-b from-[#FFF5F8] to-white px-5 py-4 text-center shadow-2xs space-y-2">
                      <img
                        src={selected.photoUrl}
                        alt={selected.name}
                        className="mx-auto h-16 w-16 rounded-full object-cover object-top ring-2 ring-[#FD267A] ring-offset-2"
                      />
                      <div className="text-sm font-extrabold text-[#18101E]">
                        You matched with {selected.name}, {selected.age}
                      </div>
                      <p className="text-xs font-medium text-[#64748B]">
                        {steamyMode
                          ? `Chemistry unlocked! Send one playful line to set up tonight.`
                          : selected.matchTeaser}
                      </p>
                    </div>
                  ) : null}

                  {turns.map((turn, i) =>
                    turn.sender === 'player' ? (
                      <div key={i} className="flex flex-col items-end">
                        <div
                          className={`max-w-[82%] rounded-3xl rounded-br-md px-4 py-3 text-[15px] leading-snug text-white shadow-xs ${
                            turn.passed === false
                              ? 'bg-[#64748B]'
                              : 'bg-gradient-to-r from-[#FD267A] to-[#FF6036]'
                          }`}
                        >
                          {turn.text}
                        </div>
                        <span className="mr-1 mt-1 text-[11px] font-semibold text-[#94A3B8]">
                          {turn.passed === false
                            ? 'Seen • Left on read risk 💀'
                            : turn.passed === true
                              ? `❤️ Liked by ${selected.name}`
                              : 'Sent'}
                        </span>
                      </div>
                    ) : (
                      <React.Fragment key={i}>
                        <div className="flex items-end gap-2.5 max-w-[88%] animate-stage-in">
                          <img
                            src={selected.photoUrl}
                            alt={selected.name}
                            className="h-8 w-8 rounded-full object-cover object-top shrink-0"
                          />
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <div className="rounded-3xl rounded-bl-md bg-[#F0F2F4] px-4 py-3 text-[15px] leading-snug text-[#18101E]">
                                {turn.text}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCycleTapback(`${threadKey}:${i}`, turn.text)}
                                title="React & rate reply"
                                className="rounded-full border border-[#E2E8F0] bg-white px-2 py-1 text-xs shadow-2xs hover:scale-110 transition cursor-pointer"
                              >
                                {tapbacks[`${threadKey}:${i}`] ?? '❤️'}
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (speakingTurnIdx === i) {
                                  stopVoiceRef.current?.();
                                  setSpeakingTurnIdx(null);
                                  return;
                                }
                                stopVoiceRef.current?.();
                                setSpeakingTurnIdx(i);
                                stopVoiceRef.current = playVoiceNotePreview(
                                  turn.text,
                                  selected.role === 'her' ? 'her' : 'green_cub',
                                  () => setSpeakingTurnIdx((curr) => (curr === i ? null : curr)),
                                );
                              }}
                              className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#FBCFE8] bg-[#FFF0F5] px-3 text-xs font-bold text-[#FD267A] cursor-pointer"
                            >
                              <Volume2 className="h-3.5 w-3.5" />
                              <span>{speakingTurnIdx === i ? 'Stop Voice' : 'Hear Voice Note'}</span>
                            </button>
                          </div>
                        </div>

                        {turn.unlockedOffAppNow && (
                          <div className="animate-stage-in mx-auto max-w-md rounded-2xl border-2 border-[#007AFF] bg-gradient-to-r from-[#EFF6FF] to-[#FFFBEB] p-4 space-y-2.5 shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#007AFF]">
                              <CheckCircle2 className="h-4 w-4 text-[#007AFF]" />
                              <span>NUMBER EARNED! Off-App iMessage &amp; Flirt Mode Unlocked</span>
                            </div>
                            <p className="text-xs font-semibold text-[#18101E]">
                              {selected.name} agreed to get off Tinder and shared{' '}
                              {selected.role === 'her' ? 'her' : 'his'} personal cell:{' '}
                              <strong>{formatCellNumber(selected)}</strong>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => switchPlatform('imessage')}
                                className="rounded-full bg-[#007AFF] hover:bg-[#0062CC] px-3.5 py-1.5 text-xs font-extrabold text-white cursor-pointer"
                              >
                                💬 Text {selected.name} on iMessage →
                              </button>
                              <button
                                type="button"
                                onClick={() => setSteamyMode(true)}
                                className="rounded-full border border-[#FD267A] bg-white hover:bg-[#FFF0F5] px-3.5 py-1.5 text-xs font-extrabold text-[#E11D48] cursor-pointer"
                              >
                                🔥 Turn On Flirt Mode
                              </button>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ),
                  )}

                  {typing && (
                    <div className="flex items-end gap-2.5">
                      <img
                        src={selected.photoUrl}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover object-top"
                      />
                      <div className="inline-flex items-center gap-1 rounded-3xl rounded-bl-md bg-[#F0F2F4] px-4 py-3">
                        <span className="h-2 w-2 rounded-full bg-[#FD267A] animate-bounce" />
                        <span
                          style={{ animationDelay: '150ms' }}
                          className="h-2 w-2 rounded-full bg-[#FD267A] animate-bounce"
                        />
                        <span
                          style={{ animationDelay: '300ms' }}
                          className="h-2 w-2 rounded-full bg-[#FD267A] animate-bounce"
                        />
                      </div>
                    </div>
                  )}

                  {lastCoach && (
                    <div
                      className={`rounded-2xl border p-3.5 text-xs shadow-2xs ${
                        lastCoach.passed
                          ? 'border-[#34C759] bg-[#EAFBF0] text-[#065F46]'
                          : 'border-[#FF3B30] bg-[#FFF0EF] text-[#9F1239]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 font-extrabold">
                        <span>
                          {lastCoach.passed ? '💚 VIBE CHECK PASSED: ' : '🚩 VIBE CHECK ROASTED: '}
                          {lastCoach.deltas}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#18101E]">
                          <Sparkles className="inline h-3 w-3 mr-0.5 text-[#FD267A]" />
                          {lastCoach.source}
                        </span>
                      </div>
                      <p className="mt-1 font-medium">{lastCoach.note}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#E5E7EB] bg-white px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1">
                      {activeChips.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setInput(chip)}
                          className="shrink-0 max-w-xs truncate rounded-full border border-[#FBCFE8] bg-[#FFF5F8] px-3 py-1 text-xs font-semibold text-[#BE185D] hover:bg-[#FCE7F3] cursor-pointer"
                          title={chip}
                        >
                          ✨ {chip}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMatch}
                      title="Pass & jump to next match"
                      className="shrink-0 inline-flex h-7 items-center gap-1 rounded-full border border-[#FECDD3] bg-[#FFF1F2] px-2.5 text-[11px] font-bold text-[#E11D48] hover:bg-[#FFE4E6] cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                      <span>Next</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    <span className="text-[11px] font-bold text-[#94A3B8] mr-1">Emojis:</span>
                    {QUICK_EMOJIS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => handleAppendEmoji(em)}
                        className="h-7 w-7 shrink-0 rounded-full hover:bg-[#F1F5F9] text-sm cursor-pointer transition active:scale-110"
                      >
                        {em}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Message ${selected.name} on Tinder...`}
                      maxLength={280}
                      className="flex-1 rounded-full border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-[#18101E] placeholder:text-[#94A3B8] focus:border-[#FD267A] focus:bg-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Send"
                      disabled={!input.trim() || typing}
                      className="h-10 shrink-0 rounded-full bg-gradient-to-r from-[#FD267A] to-[#FF6036] px-5 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm disabled:opacity-40 cursor-pointer transition"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        ) : platform === 'imessage' ? (
          /* -------------------------------------------------------------------
           * LEVEL 2: EARNED APPLE iMESSAGE (Locked until you earn their real #!)
           * ------------------------------------------------------------------- */
          !isNumberEarnedForSelected ? (
            <div className="flex flex-col items-center justify-center bg-white font-sans text-[#1C1C1E] h-[640px] lg:h-[680px] p-6 text-center space-y-5">
              <div className="relative">
                <img
                  src={selected.photoUrl}
                  alt={selected.name}
                  className="h-24 w-24 rounded-full object-cover object-top border-4 border-[#F2F2F7] shadow-md grayscale-[30%]"
                />
                <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#007AFF] text-white shadow">
                  <Lock className="h-4 w-4" />
                </span>
              </div>

              <div className="max-w-md space-y-2">
                <span className="inline-block rounded-full bg-[#EFF6FF] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#007AFF]">
                  📱 Personal Numbers Are Earned Off-App
                </span>
                <h3 className="font-display text-2xl text-[#1C1C1E]">
                  You Haven’t Earned {selected.name}’s Number Yet
                </h3>
                <p className="text-sm text-[#636366] leading-relaxed">
                  iMessage is reserved for matches who agreed to get off the app with you. Land{' '}
                  <strong>2 green-flag replies</strong> with {selected.name} on Tinder (or unmask
                  the Mystery Regular in Discord) to win {selected.role === 'her' ? 'her' : 'his'}{' '}
                  real cell!
                </p>
              </div>

              <div className="w-full max-w-xs rounded-2xl border border-[#E5E5EA] bg-[#F2F2F7] p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#1C1C1E]">
                  <span>Off-App Progress with {selected.name}</span>
                  <span className="text-[#007AFF]">{Math.min(2, sparksForSelected)}/2 Sparks</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#D1D1D6]">
                  <div
                    style={{ width: `${Math.min(100, sparksForSelected * 50)}%` }}
                    className="h-full rounded-full bg-[#007AFF] transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => switchPlatform('tinder')}
                  className="rounded-full bg-[#007AFF] hover:bg-[#0062CC] px-6 py-3 text-sm font-extrabold text-white shadow-sm cursor-pointer transition"
                >
                  🔥 Go Win {selected.name}’s Number on Tinder →
                </button>
                {earnedImessageContacts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelected(earnedImessageContacts[0])}
                    className="rounded-full border border-[#D1D1D6] bg-white hover:bg-[#F2F2F7] px-4 py-3 text-xs font-bold text-[#1C1C1E] cursor-pointer"
                  >
                    Open {earnedImessageContacts[0].name}’s iMessage
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col overflow-hidden bg-white font-sans text-[#1C1C1E] h-[640px] lg:h-[680px]">
              <div className="border-b border-[#D1D1D6] bg-[#F9F9FB]/95 px-4 py-2 backdrop-blur-md flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => switchPlatform('tinder')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#007AFF] cursor-pointer"
                >
                  <Unlock className="h-3.5 w-3.5" />
                  <span>Off-App VIP</span>
                </button>

                <div className="flex flex-col items-center">
                  <img
                    src={selected.photoUrl}
                    alt={selected.name}
                    className="h-9 w-9 rounded-full object-cover object-top shadow-2xs"
                  />
                  <div className="mt-0.5 text-[11px] font-semibold text-[#1C1C1E]">
                    {selected.name} • {formatCellNumber(selected)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#007AFF]">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.crystalClink();
                      setCallBanner(
                        `📹 FaceTime Video: ${selected.name} smiled and picked up on the second ring. "Save that charm for Friday at 7:30."`,
                      );
                    }}
                    title="FaceTime Video"
                    className="rounded-full p-1.5 hover:bg-black/5 cursor-pointer"
                  >
                    <Video className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.crystalClink();
                      setCallBanner(
                        `📞 6 PM Phone Call: ${selected.name} loved hearing a real voice instead of endless app texts!`,
                      );
                    }}
                    title="Audio Call"
                    className="rounded-full p-1.5 hover:bg-black/5 cursor-pointer"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto overscroll-contain bg-white p-4 sm:px-6 space-y-3"
              >
                <div className="text-center space-y-0.5">
                  <div className="text-[11px] font-semibold text-[#007AFF]">
                    iMessage • Personal Number Earned Off-App
                  </div>
                  <div className="text-[11px] font-medium text-[#8E8E93]">
                    Today 9:41 PM • {stageLabel}
                  </div>
                </div>

                {callBanner && (
                  <div className="mx-auto max-w-md rounded-2xl border border-[#D1D1D6] bg-[#F2F2F7] px-3.5 py-2 text-center text-xs font-semibold text-[#1C1C1E]">
                    {callBanner}
                  </div>
                )}

                {/* Fresh Off-App First Text (Never copies Tinder's match thread!) */}
                <div className="flex items-end gap-2 max-w-[86%]">
                  <img
                    src={selected.photoUrl}
                    alt={selected.name}
                    className="h-7 w-7 rounded-full object-cover object-top shrink-0"
                  />
                  <div className="relative">
                    {openTapbackMenuKey === `${threadKey}:open` && (
                      <div className="absolute -bottom-10 left-0 z-20 inline-flex items-center gap-1.5 rounded-full border border-[#D1D1D6] bg-white px-3 py-1 shadow-lg">
                        {TAPBACK_OPTIONS.map((tb) => (
                          <button
                            key={tb}
                            type="button"
                            onClick={() =>
                              handleSelectTapback(`${threadKey}:open`, tb, activeImessagePrompt)
                            }
                            className="hover:scale-125 transition text-base cursor-pointer"
                          >
                            {tb}
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setOpenTapbackMenuKey((k) =>
                          k === `${threadKey}:open` ? null : `${threadKey}:open`,
                        )
                      }
                      title="Tap for iMessage Tapback"
                      className="relative rounded-[20px] rounded-bl-[5px] bg-[#E9E9EB] px-4 py-2.5 text-left text-[15px] leading-snug text-[#1C1C1E] cursor-pointer"
                    >
                      {tapbacks[`${threadKey}:open`] && (
                        <span className="absolute -top-2.5 -right-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#007AFF] px-1.5 text-xs text-white shadow">
                          {tapbacks[`${threadKey}:open`]}
                        </span>
                      )}
                      {activeImessagePrompt}
                    </button>
                  </div>
                </div>

                {turns.map((turn, i) =>
                  turn.sender === 'player' ? (
                    <div key={i} className="flex flex-col items-end">
                      <button
                        type="button"
                        onClick={() => handleCycleTapback(`${threadKey}:${i}`)}
                        className={`relative max-w-[82%] rounded-[20px] rounded-br-[5px] px-4 py-2.5 text-left text-[15px] leading-snug text-white shadow-2xs cursor-pointer ${
                          turn.passed === false ? 'bg-[#34C759]' : 'bg-[#007AFF]'
                        }`}
                      >
                        {(tapbacks[`${threadKey}:${i}`] || turn.passed === true) && (
                          <span className="absolute -top-2.5 -left-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#FF2D55] px-1.5 text-xs text-white shadow">
                            {tapbacks[`${threadKey}:${i}`] ?? '❤️'}
                          </span>
                        )}
                        {turn.text}
                      </button>
                      <span className="mr-1 mt-0.5 text-[10px] font-medium text-[#8E8E93]">
                        {turn.passed === false
                          ? 'Sent as Text Message • Green-Bubble Ick'
                          : turn.passed === true
                            ? 'Read 9:42 PM'
                            : 'Delivered'}
                      </span>
                    </div>
                  ) : (
                    <div key={i} className="flex items-end gap-2 max-w-[88%] animate-stage-in">
                      <img
                        src={selected.photoUrl}
                        alt={selected.name}
                        className="h-7 w-7 rounded-full object-cover object-top shrink-0"
                      />
                      <div className="space-y-1.5 relative">
                        {openTapbackMenuKey === `${threadKey}:${i}` && (
                          <div className="absolute -top-10 left-0 z-20 inline-flex items-center gap-1.5 rounded-full border border-[#D1D1D6] bg-white px-3 py-1 shadow-lg">
                            {TAPBACK_OPTIONS.map((tb) => (
                              <button
                                key={tb}
                                type="button"
                                onClick={() =>
                                  handleSelectTapback(`${threadKey}:${i}`, tb, turn.text)
                                }
                                className="hover:scale-125 transition text-base cursor-pointer"
                              >
                                {tb}
                              </button>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setOpenTapbackMenuKey((k) =>
                              k === `${threadKey}:${i}` ? null : `${threadKey}:${i}`,
                            )
                          }
                          className="relative block rounded-[20px] rounded-bl-[5px] bg-[#E9E9EB] px-4 py-2.5 text-left text-[15px] leading-snug text-[#1C1C1E] cursor-pointer"
                        >
                          {tapbacks[`${threadKey}:${i}`] && (
                            <span className="absolute -top-2.5 -right-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#007AFF] px-1.5 text-xs text-white shadow">
                              {tapbacks[`${threadKey}:${i}`]}
                            </span>
                          )}
                          {turn.text}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (speakingTurnIdx === i) {
                              stopVoiceRef.current?.();
                              setSpeakingTurnIdx(null);
                              return;
                            }
                            stopVoiceRef.current?.();
                            setSpeakingTurnIdx(i);
                            stopVoiceRef.current = playVoiceNotePreview(
                              turn.text,
                              selected.role === 'her' ? 'her' : 'green_cub',
                              () => setSpeakingTurnIdx((curr) => (curr === i ? null : curr)),
                            );
                          }}
                          className={`inline-flex h-7 items-center gap-2 rounded-full px-3 text-xs font-semibold transition cursor-pointer ${
                            speakingTurnIdx === i
                              ? 'bg-[#007AFF] text-white'
                              : 'bg-[#F2F2F7] text-[#007AFF] border border-[#D1D1D6]'
                          }`}
                        >
                          {speakingTurnIdx === i ? (
                            <VolumeX className="h-3.5 w-3.5" />
                          ) : (
                            <Volume2 className="h-3.5 w-3.5" />
                          )}
                          <span className="inline-flex items-center gap-0.5 h-3">
                            {[4, 8, 5, 10, 7, 11, 6, 4].map((h, idx) => (
                              <span
                                key={idx}
                                style={{ height: `${h}px` }}
                                className={`w-0.5 rounded-full ${
                                  speakingTurnIdx === i ? 'bg-white animate-pulse' : 'bg-[#007AFF]'
                                }`}
                              />
                            ))}
                          </span>
                          <span>{speakingTurnIdx === i ? '0:04' : 'Voice Note'}</span>
                        </button>
                      </div>
                    </div>
                  ),
                )}

                {typing && (
                  <div className="flex items-end gap-2">
                    <img
                      src={selected.photoUrl}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover object-top"
                    />
                    <div className="inline-flex items-center gap-1 rounded-[20px] rounded-bl-[5px] bg-[#E9E9EB] px-4 py-3">
                      <span className="h-2 w-2 rounded-full bg-[#8E8E93] animate-bounce" />
                      <span
                        style={{ animationDelay: '150ms' }}
                        className="h-2 w-2 rounded-full bg-[#8E8E93] animate-bounce"
                      />
                      <span
                        style={{ animationDelay: '300ms' }}
                        className="h-2 w-2 rounded-full bg-[#8E8E93] animate-bounce"
                      />
                    </div>
                  </div>
                )}

                {lastCoach && (
                  <div
                    className={`rounded-2xl border p-3.5 text-xs ${
                      lastCoach.passed
                        ? 'border-[#34C759] bg-[#EAFBF0] text-[#065F46]'
                        : 'border-[#FF3B30] bg-[#FFF0EF] text-[#9F1239]'
                    }`}
                  >
                    <div className="font-bold">
                      {lastCoach.passed ? '💚 OFF-APP CHEMISTRY: ' : '🚩 OFF-APP ROAST: '}
                      {lastCoach.deltas}
                    </div>
                    <p className="mt-1 font-medium">{lastCoach.note}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-[#D1D1D6] bg-[#F9F9FB] px-3.5 py-2.5 space-y-2">
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {activeChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInput(chip)}
                      className="shrink-0 max-w-xs truncate rounded-full border border-[#D1D1D6] bg-white px-3 py-1 text-xs font-medium text-[#1C1C1E] hover:border-[#007AFF] cursor-pointer"
                      title={chip}
                    >
                      💬 {chip}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInput(activeChips[0] ?? '')}
                    title="Insert Suggested Reply"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E5E5EA] text-[#636366] hover:text-[#007AFF] cursor-pointer"
                  >
                    <Plus className="h-4.5 w-4.5" />
                  </button>
                  <div className="flex flex-1 items-center rounded-full border border-[#C6C6C8] bg-white pl-4 pr-1.5 py-1">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Message ${selected.name} on iMessage...`}
                      maxLength={280}
                      className="flex-1 bg-transparent text-sm text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Send"
                      disabled={!input.trim() || typing}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-white disabled:bg-[#C7C7CC] cursor-pointer transition"
                    >
                      <ArrowUp className="h-4 w-4 stroke-[2.75]" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        ) : (
          /* -------------------------------------------------------------------
           * DISCORD ANONYMOUS COMMUNITY LOUNGE & MYSTERY SUBPLOT
           * ------------------------------------------------------------------- */
          <div className="flex flex-col overflow-hidden bg-[#313338] font-sans text-[#DBDEE1] h-[640px] lg:h-[680px]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1F2023] bg-[#313338] px-4 py-2.5 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <Hash className="h-5 w-5 shrink-0 text-[#80848E]" />
                <span className="font-bold text-sm text-white">
                  {discordChannel === 'mystery-subplot' ? mysteryHandle : discordChannel}
                </span>
                <span className="hidden sm:inline text-[#3F4147]">|</span>
                <span className="hidden sm:inline truncate text-xs text-[#949BA4]">
                  {discordChannel === 'boys-roblox-vc'
                    ? 'Live Roblox Dress to Impress VC • Boys react to your lines in real time'
                    : discordChannel === 'mystery-subplot'
                      ? 'Encrypted Anon DM • Spot the clues to unmask their real identity'
                      : discordChannel === 'vetting-hotline'
                        ? 'Anonymous Cougar & Cub vetting advice & red-flag tribunal'
                        : '100% Anonymous Cougar & Cub community chat'}
                </span>
              </div>
            </div>

            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3"
            >
              <div className="border-b border-[#3F4147] pb-3 mb-2">
                <div className="text-lg font-extrabold text-white">
                  {discordChannel === 'mystery-subplot'
                    ? `🕵️ Encrypted Anon DM with ${mysteryHandle}`
                    : `Welcome to #${discordChannel}!`}
                </div>
                <p className="text-xs text-[#949BA4]">
                  {discordChannel === 'mystery-subplot'
                    ? 'You caught their eye in #general-lounge. Trade lines or guess which cast member is behind the mask!'
                    : `Posting anonymously as ${playerAnonHandle}. Real names stay hidden unless you solve the Mystery Subplot.`}
                </p>
              </div>

              {subplotGuessFeedback && (
                <div className="rounded-xl border border-[#FEE75C]/50 bg-[#2B2D31] px-3.5 py-2.5 text-xs font-bold text-[#FEE75C]">
                  {subplotGuessFeedback}
                </div>
              )}

              {/* Pre-seeded Anonymous Community Lounge Messages */}
              {getDiscordSeeds(discordChannel, activePlayerRole).map((seed) => (
                <div
                  key={seed.id}
                  className="flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-[#2E3035]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E1F22] text-base">
                    {seed.isMysteryClue ? '🕵️' : seed.badge.startsWith('🐆') ? '🐆' : '🥂'}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-bold" style={{ color: seed.color }}>
                        {seed.handle}
                      </span>
                      <span className="rounded bg-[#5865F2]/25 px-1.5 py-0.2 text-[10px] font-bold text-[#DEE0FC]">
                        {seed.badge}
                      </span>
                      <span className="text-[11px] text-[#949BA4]">{seed.time}</span>
                    </div>
                    <p className="text-[14.5px] leading-relaxed text-[#DBDEE1]">{seed.text}</p>
                  </div>
                </div>
              ))}

              {turns.map((turn, i) =>
                turn.sender === 'player' ? (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg px-2 py-1 hover:bg-[#2E3035]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-sm font-bold text-white">
                      🎭
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#57F287]">{playerAnonHandle}</span>
                        <span className="rounded bg-[#23A55A]/20 px-1.5 text-[9px] font-bold text-[#86EFAC]">
                          ANON YOU
                        </span>
                        <span className="text-[11px] text-[#949BA4]">Just now</span>
                      </div>
                      <p className="text-[15px] leading-relaxed text-white">{turn.text}</p>
                    </div>
                  </div>
                ) : (
                  <React.Fragment key={i}>
                    <div className="flex items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-[#2E3035] animate-stage-in">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E1F22] text-base">
                        🕵️
                      </div>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-sm font-bold text-[#FEE75C]">
                            {turn.authorHandle || mysteryHandle}
                          </span>
                          <span className="rounded bg-[#5865F2]/25 px-1.5 py-0.2 text-[10px] font-bold text-[#DEE0FC]">
                            {turn.authorBadge || '🕵️ ANON REGULAR'}
                          </span>
                          <span className="text-[11px] text-[#949BA4]">Just now</span>
                        </div>
                        <p className="text-[15px] leading-relaxed text-[#DBDEE1]">{turn.text}</p>
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {(['🔥', '💀', '🫡', '❤️'] as const).map((emoji, rIdx) => {
                            const rk = `${threadKey}:${i}:${emoji}`;
                            const on = Boolean(discordReacts[rk]);
                            return (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  sfx.messagePop();
                                  setDiscordReacts((prev) => ({ ...prev, [rk]: !prev[rk] }));
                                  sendAiFeedbackPing({
                                    persona: `Discord:${discordChannel}`,
                                    reaction: emoji,
                                    aiReply: turn.text,
                                  });
                                }}
                                className={`inline-flex h-7 items-center gap-1 rounded-md border px-2 text-xs font-semibold cursor-pointer ${
                                  on
                                    ? 'border-[#5865F2] bg-[#5865F2]/25 text-[#DEE0FC]'
                                    : 'border-[#3F4147] bg-[#2B2D31] text-[#B5BAC1]'
                                }`}
                              >
                                <span>{emoji}</span>
                                <span>{rIdx + 1 + (on ? 1 : 0)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {discordChannel !== 'mystery-subplot' && subplotStage === 1 && i === turns.length - 1 && (
                      <div className="rounded-xl border border-[#FEE75C]/50 bg-[#232428] p-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#FEE75C]">
                          🕵️ SUBPLOT SPARKED! {mysteryHandle} just sent you a private Anon DM request!
                        </span>
                        <button
                          type="button"
                          onClick={() => setDiscordChannel('mystery-subplot')}
                          className="rounded-lg bg-[#5865F2] hover:bg-[#4752C4] px-3 py-1.5 text-xs font-extrabold text-white cursor-pointer"
                        >
                          Open Mystery DM →
                        </button>
                      </div>
                    )}

                    {discordChannel === 'boys-roblox-vc' && turn.buddy && (
                      <div className="flex items-start gap-3 rounded-lg bg-[#2B2D31]/80 px-2.5 py-1.5 animate-stage-in">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E1F22] text-sm">
                          🎮
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold" style={{ color: turn.buddy.color }}>
                              {turn.buddy.author}
                            </span>
                            <span className="rounded bg-[#5865F2]/25 px-1.5 text-[9px] font-bold text-[#949CF7]">
                              {turn.buddy.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#DBDEE1]">{turn.buddy.text}</p>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ),
              )}

              {subplotStage >= 3 && (
                <div className="rounded-xl border-2 border-[#23A55A] bg-[#232428] p-4 space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-[#57F287]">
                    🎭 Mystery Subplot Solved! Real Off-App Number Unlocked
                  </div>
                  <p className="text-xs text-[#DBDEE1]">
                    You unmasked <strong>{mysteryTargetContact.name}, {mysteryTargetContact.age}</strong>{' '}
                    behind {mysteryHandle} and earned {mysteryTargetContact.role === 'her' ? 'her' : 'his'}{' '}
                    personal iMessage number!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(mysteryTargetContact);
                      switchPlatform('imessage');
                    }}
                    className="rounded-lg bg-[#007AFF] hover:bg-[#0062CC] px-3.5 py-1.5 text-xs font-extrabold text-white cursor-pointer"
                  >
                    💬 Open {mysteryTargetContact.name}’s iMessage →
                  </button>
                </div>
              )}

              {lastCoach && (
                <div className="flex items-start gap-3 px-2 pt-1">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-xs font-bold text-white">
                    BOT
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Club Vibe Referee</span>
                      <span className="rounded bg-[#5865F2] px-1.5 py-0.2 text-[9px] font-bold text-white">
                        APP ✓
                      </span>
                    </div>
                    <div
                      className={`rounded-md border-l-4 bg-[#2B2D31] p-3 text-xs space-y-1 ${
                        lastCoach.passed ? 'border-[#23A55A]' : 'border-[#F23F43]'
                      }`}
                    >
                      <div className="font-bold text-white">
                        {lastCoach.passed ? '💚 LOUNGE VIBE PASSED: ' : '🚩 LOUNGE ROASTED: '}
                        {lastCoach.deltas}
                      </div>
                      <p className="text-[#DBDEE1]">{lastCoach.note}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#313338] px-4 pb-3 pt-1 space-y-2">
              {typing && (
                <div className="text-[11px] font-semibold text-[#DBDEE1] flex items-center gap-1.5">
                  <span className="inline-flex gap-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" />
                  </span>
                  <span>
                    <strong>{mysteryHandle}</strong> is typing...
                  </span>
                </div>
              )}

              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {activeChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInput(chip)}
                    className="shrink-0 max-w-xs truncate rounded-md border border-[#3F4147] bg-[#2B2D31] px-2.5 py-1 text-xs font-medium text-[#DBDEE1] hover:border-[#5865F2] cursor-pointer"
                  >
                    💡 {chip}
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleSend}
                className="flex items-center gap-2.5 rounded-lg bg-[#383A40] px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() => setInput(activeChips[0] ?? '')}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B5BAC1] text-[#313338] hover:bg-white cursor-pointer"
                >
                  <Plus className="h-4 w-4 stroke-[2.75]" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    discordChannel === 'mystery-subplot'
                      ? `Reply anonymously to ${mysteryHandle}...`
                      : `Post anonymously in #${discordChannel}...`
                  }
                  maxLength={280}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-[#80848E] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!input.trim() || typing}
                  className="inline-flex h-8 items-center gap-1 rounded-md bg-[#5865F2] hover:bg-[#4752C4] px-3 text-xs font-bold text-white disabled:opacity-40 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
         * COLUMN 3: PLATFORM-SPECIFIC RIGHT PANEL
         * (Discord = Anon Subplot & Online Regulars; Tinder/iMessage = Full-Face Dossier)
         * ------------------------------------------------------------------- */}
        {isDarkDiscord ? (
          <aside className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#1F2023] bg-[#232428] p-4 sm:p-5 space-y-4 lg:min-h-[680px] text-[#DBDEE1]">
            <div className="space-y-4">
              {/* Mystery Subplot Clue Board */}
              <div className="rounded-2xl border border-[#FEE75C]/35 bg-[#111214] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#FEE75C]">
                    🕵️ Anon Lounge Subplot
                  </span>
                  <span className="rounded-full bg-[#5865F2]/30 px-2 py-0.5 text-[10px] font-bold text-[#DEE0FC]">
                    Stage {subplotStage}/3
                  </span>
                </div>
                <p className="text-xs text-[#B5BAC1] leading-relaxed">
                  One cast member from the Roster is posting undercover as{' '}
                  <strong className="text-white">{mysteryHandle}</strong>. Unmask them to win{' '}
                  <strong className="text-[#57F287]">+3 Credits</strong> and unlock their real
                  iMessage number!
                </p>

                {subplotStage === 0 ? (
                  <div className="rounded-xl bg-[#2B2D31] p-2.5 text-[11px] text-[#DBDEE1]">
                    <strong>Step 1:</strong> Post a comment in <code>#general-lounge</code> to catch{' '}
                    {mysteryHandle}’s eye.
                  </div>
                ) : subplotStage < 3 ? (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold text-[#FEE75C]">
                      🎭 Ready to guess who {mysteryHandle} really is?
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {mysterySuspects.map((sus) => (
                        <button
                          key={sus.id}
                          type="button"
                          onClick={() => handleGuessMysterySuspect(sus)}
                          className="flex items-center justify-between rounded-xl border border-[#3F4147] bg-[#2B2D31] hover:border-[#FEE75C] px-3 py-2 text-left text-xs font-bold text-white cursor-pointer transition"
                        >
                          <span>
                            Guess: {sus.name}, {sus.age}
                          </span>
                          <span className="text-[10px] text-[#949BA4]">{sus.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#23A55A] bg-[#23A55A]/15 p-2.5 text-xs font-bold text-[#86EFAC]">
                    ✓ Solved! {mysteryHandle} is {mysteryTargetContact.name}. Real number added to
                    iMessage!
                  </div>
                )}
              </div>

              {/* Online Anonymous Members */}
              <div className="rounded-2xl bg-[#111214] p-3.5 space-y-2.5">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#949BA4]">
                  Online Anonymous Regulars — 8
                </div>
                <div className="space-y-2">
                  {ANON_ONLINE_ROSTER.map((member) => (
                    <div key={member.handle} className="flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <div className="truncate font-bold text-[#F2F3F5]">{member.handle}</div>
                        <div className="truncate text-[10.5px] text-[#949BA4]">{member.status}</div>
                      </div>
                      <span className="shrink-0 rounded bg-[#2B2D31] px-1.5 py-0.5 text-[10px] font-semibold text-[#B5BAC1]">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmitTeaStory}
              className="rounded-2xl border border-dashed border-[#3F4147] bg-[#2B2D31] p-3 space-y-2"
            >
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#FEE75C]">
                🫖 Spill Anon Dating Tea (+3 Cr)
              </div>
              {teaSubmitted ? (
                <p className="text-xs font-bold text-[#10B981]">
                  ✓ Sent to the Club Writers’ Vault (+3 Credits)!
                </p>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={teaStory}
                    onChange={(e) => setTeaStory(e.target.value)}
                    placeholder="Drop an anon red flag or story..."
                    maxLength={180}
                    className="min-w-0 flex-1 rounded-xl border border-[#1E1F22] bg-[#1E1F22] px-2.5 py-1.5 text-xs text-white placeholder:text-[#80848E] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl bg-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#18101E] cursor-pointer"
                  >
                    Send
                  </button>
                </div>
              )}
            </form>
          </aside>
        ) : (
          /* TINDER DOSSIER vs APPLE CONTACT CARD (100% Full-Face Portrait Framing!) */
          <aside
            className={`flex flex-col justify-between border-t lg:border-t-0 lg:border-l p-4 sm:p-5 space-y-4 lg:min-h-[680px] ${
              isAppleMessages
                ? 'border-[#D1D1D6] bg-[#F2F2F7] text-[#1C1C1E]'
                : 'border-[#E5E7EB] bg-[#FAF8F9] text-[#18101E]'
            }`}
          >
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 items-center sm:items-start lg:items-stretch">
                <div className="relative w-full max-w-[260px] sm:w-56 lg:w-full lg:max-w-none shrink-0 aspect-[4/5] lg:aspect-[4/4.3] overflow-hidden rounded-2xl border border-black/10 bg-[#18101E] shadow-xs">
                  <img
                    src={selected.photoUrl}
                    alt={selected.name}
                    className="h-full w-full object-cover object-[50%_15%]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-3.5 text-white">
                    <div className="flex items-center gap-1.5 font-display text-xl">
                      <span>
                        {selected.name}, {selected.age}
                      </span>
                      <BadgeCheck className="h-4 w-4 fill-[#38BDF8] text-white" />
                    </div>
                    <div className="text-xs font-semibold text-white/95 leading-snug">
                      {isAppleMessages && isNumberEarnedForSelected
                        ? `📱 ${formatCellNumber(selected)} • Off-App VIP`
                        : selected.title}
                    </div>
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-3 w-full">
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                    <span className="rounded-full border border-black/10 bg-white px-2.5 py-0.5 text-[#18101E]">
                      📏 {selected.height}
                    </span>
                    <span className="rounded-full border border-black/10 bg-white px-2.5 py-0.5 text-[#18101E]">
                      ✨ {selected.zodiac.split('•')[0].trim()}
                    </span>
                    {selected.petName && (
                      <span className="rounded-full border border-[#10B981]/25 bg-[#ECFDF5] px-2.5 py-0.5 text-[#065F46]">
                        🐾 {selected.petName.split('•')[0].trim()}
                      </span>
                    )}
                  </div>

                  {/* Clickable Interests Beyond Drinks */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                      Interests &amp; Passions (tap to mention)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.interests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => {
                            sfx.messagePop();
                            setInput(buildInterestIcebreaker(selected, interest));
                          }}
                          title={`Mention ${interest} in chat`}
                          className={`rounded-full border bg-white px-2.5 py-1 text-[11px] font-bold text-[#18101E] transition cursor-pointer ${
                            isAppleMessages
                              ? 'border-[#007AFF]/25 hover:border-[#007AFF] hover:bg-[#EFF6FF]'
                              : 'border-[#FD267A]/20 hover:border-[#FD267A] hover:bg-[#FFF0F5]'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bio + Delight Details */}
                  <div className="rounded-2xl border border-black/10 bg-white p-3.5 space-y-2 text-xs leading-relaxed text-[#18101E]">
                    <p className="font-bold">{selected.tagline}</p>
                    <p className="text-[#475569]">{selected.bio}</p>
                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[11.5px]">
                      <div>
                        <span className="font-bold">☀️ Ideal Sunday: </span>
                        <span className="text-[#334155]">{selected.idealSunday}</span>
                      </div>
                      <div>
                        <span className="font-bold">💚 Secret Soft Spot: </span>
                        <span className="text-[#334155]">{selected.softSpot}</span>
                      </div>
                      <div>
                        <span className="font-bold">💞 Love Style: </span>
                        <span className={isAppleMessages ? 'text-[#007AFF]' : 'text-[#BE123C]'}>
                          {selected.loveLanguage}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold">🥂 Go-To Order: </span>
                        <span className="text-[#475569]">{selected.drink}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progression Meter */}
              <div className="rounded-2xl border border-black/10 bg-white p-3.5 space-y-2 text-[#18101E]">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span>
                    {isNumberEarnedForSelected
                      ? '📱 Off-App Chemistry'
                      : `🔒 Earn Real # (${Math.min(2, sparksForSelected)}/2 Sparks)`}
                  </span>
                  <span className={isAppleMessages ? 'text-[#007AFF]' : 'text-[#FD267A]'}>
                    {vibePercent}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                  <div
                    style={{ width: `${vibePercent}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      isAppleMessages
                        ? 'bg-[#007AFF]'
                        : 'bg-gradient-to-r from-[#FD267A] to-[#F59E0B]'
                    }`}
                  />
                </div>
                {onStartDateWithContact && (
                  <button
                    type="button"
                    onClick={() => onStartDateWithContact(selected.id, selected.role)}
                    className={`pop-btn mt-1 w-full h-10 rounded-xl text-xs font-extrabold text-white border-transparent cursor-pointer ${
                      isAppleMessages
                        ? 'bg-[#007AFF] hover:bg-[#0062CC]'
                        : 'bg-gradient-to-r from-[#FD267A] to-[#FF6036]'
                    }`}
                  >
                    💘 Play Full Date Run w/ {selected.name} →
                  </button>
                )}
              </div>
            </div>

            <form
              onSubmit={handleSubmitTeaStory}
              className="rounded-2xl border border-dashed border-[#F59E0B]/45 bg-[#FFFBEB] p-3 space-y-2"
            >
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#B45309]">
                🫖 Spill a Real-Life Texting Red Flag (+3 Cr)
              </div>
              {teaSubmitted ? (
                <p className="text-xs font-bold text-[#10B981]">
                  ✓ Sent to the Club Writers’ Vault (+3 Credits)! Thank you for the tea 🥂
                </p>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={teaStory}
                      onChange={(e) => setTeaStory(e.target.value)}
                      placeholder="Spill a real red flag or archetype idea..."
                      maxLength={180}
                      className="min-w-0 flex-1 rounded-xl border border-black/15 bg-white px-2.5 py-1.5 text-xs text-[#18101E] placeholder:text-[#94A3B8] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-xl bg-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#18101E] cursor-pointer"
                    >
                      Send
                    </button>
                  </div>
                  <input
                    type="text"
                    value={teaContact}
                    onChange={(e) => setTeaContact(e.target.value)}
                    placeholder="Optional @handle / email for follow-up (blank = 100% anonymous)"
                    maxLength={120}
                    className="w-full rounded-xl border border-black/10 bg-white/90 px-2.5 py-1 text-[11px] text-[#18101E] placeholder:text-[#94A3B8] focus:outline-none"
                  />
                </div>
              )}
            </form>
          </aside>
        )}
      </div>
    </section>
  );
};
