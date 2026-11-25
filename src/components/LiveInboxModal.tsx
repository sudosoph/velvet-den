import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  BadgeCheck,
  Flame,
  Gamepad2,
  Hash,
  Heart,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  Video,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { WalletState } from '../domain/economy';
import { HER_ARCHETYPES, HIS_ARCHETYPES } from '../domain/taxonomy';
import { playVoiceNotePreview, sfx } from '../lib/sound';
import { liveAiInboxService, type LiveInboxTurn } from '../services/adapters';

export type InboxAppPlatform = 'tinder' | 'imessage' | 'discord';

interface LiveInboxModalProps {
  open: boolean;
  wallet: WalletState;
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
  title: string;
  bio: string;
  role: 'her' | 'him';
  photoUrl: string;
  openingPrompt: string;
  steamyPrompt: string;
  quickChips: string[];
  steamyChips: string[];
}

interface DiscordBuddyRemark {
  author: string;
  color: string;
  badge: string;
  text: string;
}

const TAPBACK_OPTIONS = ['❤️', '😂', '‼️', '👍', '👎', '❓'] as const;
const QUICK_EMOJIS = ['😏', '🍸', '😍', '😭', '💀', '🔥', '👀', '✨', '🥂', '🚩'] as const;

const INBOX_CONTACTS: InboxContact[] = [
  ...HER_ARCHETYPES.map((h) => ({
    id: h.id,
    name: h.name,
    age: h.age,
    height: h.height || '5\'7"',
    zodiac: h.zodiac || 'Scorpio',
    drink: h.signatureDrink || 'Espresso Martini',
    title: h.title,
    bio: h.vibeSummary,
    role: 'her' as const,
    photoUrl: h.photoUrl,
    openingPrompt:
      h.subplotTags.includes('seed_oil_bernedoodle_mommy') ||
      h.subplotTags.includes('qigong_mommy_domme')
        ? `fair warning sweet boy 🧘‍♀️✨ i'm 100% gluten + seed oil free, teach 6:30am qigong, and just hit #2 on the tricolor mini bernedoodle waitlist 🐶 what's our friday dinner plan? (zero cubsplaining pls lol)`
        : h.subplotTags.includes('black_cat_energy')
          ? `easy there puppy 🐈‍⬛ every guy in my dms promises the moon on day 1 lol. i take my time... convince me why i shouldn't make you wait till next week 👀`
          : h.subplotTags.includes('junior_cougar_gap')
            ? `quick math check 😅 i'm ${h.age}, so our gap officially makes me a junior cougar lol. tell me where you were in 2008 + your actual friday drink plan 🍸`
            : h.subplotTags.includes('dog_mom_divorced')
              ? `${h.age}, happily divorced, and lowered my age slider bc every 43yo guy on here just rants about his ex 😭💀 tell me our friday plan + how you're winning over my rescue pup 🐾`
              : h.age < 40
                ? `hiii! my $25/hr sitter is officially booked for friday at 7 🙌 i get ONE free night out this month so don't fumble... where are you taking me? 🥂`
                : h.age >= 60
                  ? `caught you looking over at the palm springs gallery opening 🥂 most younger men get nervous around me... how would you actually court me this weekend? ✨`
                  : h.subplotTags.includes('princess_treatment')
                    ? `i've made 400 executive decisions this week and refuse to plan friday night 💅 how are you spoiling me? 🍸`
                    : `okay you swiped right on a ${h.age}yo ${h.title.split('•')[0].trim().toLowerCase()} 😏 90% of guys open with "hey" or ask for my snapchat lol. you get one shot, what's our friday move? 🍸`,
    steamyPrompt:
      h.subplotTags.includes('qigong_mommy_domme')
        ? `still smiling from how fast you melted into tai chi cloud hands when mommy fixed your posture this morning 😌🔥 keep that grounded energy going before sauna tonight...`
        : h.age >= 50
          ? `stuck in a meeting still thinking about how unhurried and attentive you were last night 😏✨ keep the slow burn going before tonight...`
          : h.age >= 40
            ? `zero focus on my deck today after last night 😭🔥 hope you hit bench press bc you're carrying me straight upstairs at 8... what's the plan?`
            : `still blushing at my desk thinking about last night (right until i panicked realizing you're my baby sister's age 😱💀) what are you doing with me friday? 🔥`,
    quickChips:
      h.subplotTags.includes('seed_oil_bernedoodle_mommy') ||
      h.subplotTags.includes('qigong_mommy_domme')
        ? [
            'Yes, Mommy 😌 already called the chef to confirm 100% grass-fed ghee + gluten-free prep, plus picked up a chew toy for your mini bernedoodle 🐶✨',
            'See you at 6:30am in the courtyard for Qigong & Tai Chi Cloud Hands, podcast brain officially muted 🧘‍♀️🍵',
            'Well actually let me explain why canola oil is fine from a podcast I heard lol',
          ]
        : [
            'Take all the time you want 😌 a woman who doesn’t rush makes me 10x more excited. Holding a 7:30 corner booth Friday whenever you’re ready 🍸',
            'Booked us a candlelit corner booth at The Cougar Lounge Friday at 7:30, peonies handled & zero planning on your end 🥂✨',
            'brooo took 2 droppers of pine pollen for testosterone and im all up in my feels rn bc u took an hour to reply 😭🌲',
          ],
    steamyChips: h.subplotTags.includes('qigong_mommy_domme')
      ? [
          'Yes, Mommy 🔥 drawing your bath, steeping jasmine oolong, and keeping my shoulders relaxed till 8pm 🍵✨',
          'Crushed bench press + Tai Chi stance work today specifically to carry you from the cedar sauna to cooling bamboo sheets 😍',
          'Wait can Mommy put my gym membership on her AmEx?? 😂',
        ]
      : [
          'Crushed 5 sets of 225 on bench today specifically to carry you straight upstairs at 8 🔥 dinner & silk robe ready 🥂',
          'Bringing cast-iron ribeye, cooling bamboo sheets, and my full attention all night 😏 unlock the door at 7:30 ✨',
          'Wait is your little sister cute too?? 😂🔥',
        ],
  })),
  ...HIS_ARCHETYPES.map((c) => ({
    id: c.id,
    name: c.name,
    age: c.age,
    height: c.height || '6\'1"',
    zodiac: c.zodiac || 'Leo',
    drink: 'Espresso Tonic',
    title: c.title,
    bio: c.vibeSummary,
    role: 'him' as const,
    photoUrl: c.photoUrl,
    openingPrompt:
      c.id === 'kayden-broke-dutch-cub'
        ? `yo ${c.name} here!! 😅 down to grab happy hour sushi tn if we split it 50/50 on venmo?? or come to my place in maui next month (ok yeah it's my mom linda's timeshare lol) 🌺`
        : c.id === 'colton-montana-cowboy-cub'
          ? `okay busted 🤠😅 i accidentally commented "i love you" from my boys' shared ranch account before sliding in here lol. let me fly out and take you to dinner friday? 🥩✨`
          : c.id === 'rafael-accented-gentleman-cub'
            ? `hola ✨ ${c.name} here. packed fresh figs, warm baguette & espresso for a sunset picnic friday before retro bowling, if you'll let me take you out properly? 🥂`
            : `hey! ${c.name} here 😊 saw your profile and had to shoot my shot. would love to take you for espresso martinis thursday at 7:30 if you're free? 🍸`,
    steamyPrompt: `just finished bench press + split squats thinking about last night 🔥😅 tell me what time you want me at your door tonight...`,
    quickChips: [
      'Thursday at 7:30 sounds fun 😏 drop your shoulders, zero cubsplaining, and bonus points if you survive my 6:30am ridge hike ✨',
      'Only if Hawaii isn’t your mom Linda’s timeshare and you never Venmo me $0.38 for edamame 😭💀',
      'Show up at 7:30 sharp in pressed linen, breathe with Mommy, and let’s see if you actually listen 🍸',
    ],
    steamyChips: [
      'Door’s unlocked at 8, silk robe is on, and keep your ID hidden so I don’t shriek at your birth year again 😭🔥',
      'Save enough strength to flip my pillow to the cold side at 3am tonight 😌✨',
      'Bring cast-iron ribeye first, then you can carry me upstairs 🍷🔥',
    ],
  })),
];

type DiscordChannelId = 'first-dm-vetting' | 'after-dark-flirt' | 'boys-roblox-vc';

async function sendAiFeedbackPing(payload: {
  persona: string;
  reaction: string;
  aiReply?: string;
  note?: string;
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

export const LiveInboxModal: React.FC<LiveInboxModalProps> = ({
  open,
  wallet,
  initialPlatform = 'tinder',
  onClose,
  onJumpToWorld,
  onStartDateWithContact,
  onGrantBonusCredits,
  onSpendCreditOrOpenBoutique,
}) => {
  const [platform, setPlatform] = useState<InboxAppPlatform>(initialPlatform);
  const [discordChannel, setDiscordChannel] = useState<DiscordChannelId>('first-dm-vetting');
  const [roleFilter, setRoleFilter] = useState<'her' | 'him'>('her');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<InboxContact>(
    () => INBOX_CONTACTS.find((c) => c.id === 'claire-cougar-exec') ?? INBOX_CONTACTS[0],
  );
  const [steamyMode, setSteamyMode] = useState(false);
  const [superLikedIds, setSuperLikedIds] = useState<string[]>([]);
  const [turnsByThread, setTurnsByThread] = useState<
    Record<string, (LiveInboxTurn & { passed?: boolean; buddy?: DiscordBuddyRemark })[]>
  >({});
  const [coachByThread, setCoachByThread] = useState<
    Record<string, { note: string; deltas: string; passed: boolean; source: string }>
  >({});
  const [tapbacks, setTapbacks] = useState<Record<string, string>>({});
  const [discordReacts, setDiscordReacts] = useState<Record<string, boolean>>({});
  const [callBanner, setCallBanner] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [freeTrialUsed, setFreeTrialUsed] = useState(false);
  const [speakingTurnIdx, setSpeakingTurnIdx] = useState<number | null>(null);
  const [teaStory, setTeaStory] = useState('');
  const [teaSubmitted, setTeaSubmitted] = useState(false);
  const stopVoiceRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setPlatform(initialPlatform);
  }, [initialPlatform, open]);

  // Allow Escape key to exit back to the main game lobby immediately
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

  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return INBOX_CONTACTS.filter((c) => {
      if (c.role !== roleFilter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        String(c.age).includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.zodiac.toLowerCase().includes(q)
      );
    });
  }, [roleFilter, searchQuery]);

  if (!open) return null;

  const threadKey = `${selected.id}:${steamyMode ? 'steamy' : 'vet'}`;
  const turns = turnsByThread[threadKey] ?? [];
  const lastCoach = coachByThread[threadKey];
  const activePrompt = steamyMode ? selected.steamyPrompt : selected.openingPrompt;
  const activeChips = steamyMode ? selected.steamyChips : selected.quickChips;

  const greenTurnCount = turns.filter((t) => t.sender === 'match' && t.passed).length;
  const vibePercent = Math.min(
    100,
    Math.max(15, 38 + greenTurnCount * 32 - turns.filter((t) => t.sender === 'match' && t.passed === false).length * 20),
  );

  const buildBuddyRemark = (passed: boolean, name: string): DiscordBuddyRemark => {
    if (passed) {
      return {
        author: 'Kyle_DTI_RunwayKing',
        color: '#57F287',
        badge: 'ROBLOX DTI',
        text: `🫡 W RIZZ IN #${discordChannel.toUpperCase()}!! write that down boys, ${name} actually smiled!!`,
      };
    }
    return {
      author: 'BrodyLifts225',
      color: '#FEE75C',
      badge: 'COOKED',
      text: `💀 BRO GOT COOKED IN 4K BY ${name.toUpperCase()}!! pack it up and hop back on Dress to Impress`,
    };
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
    setInput((prev) => `${prev}${prev && !prev.endsWith(' ') ? ' ' : ''}${emoji}`);
  };

  const handleNextMatch = () => {
    sfx.swipeLeft();
    const pool = filteredContacts.length > 0 ? filteredContacts : INBOX_CONTACTS;
    const idx = pool.findIndex((c) => c.id === selected.id);
    const next = pool[(idx + 1) % pool.length] ?? pool[0];
    setSelected(next);
    setCallBanner(null);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || typing) return;

    if (freeTrialUsed && !wallet.isVip && !wallet.isFounderUnlimited) {
      const ok = onSpendCreditOrOpenBoutique();
      if (!ok) return;
    } else {
      setFreeTrialUsed(true);
    }

    sfx.messagePop();
    const nextTurns = [...turns, { sender: 'player' as const, text: trimmed }];
    setTurnsByThread((prev) => ({ ...prev, [threadKey]: nextTurns }));
    setInput('');
    setTyping(true);

    const verdict = await liveAiInboxService.evaluateOpeningDm({
      personaId: selected.id,
      personaName: selected.name,
      personaAge: selected.age,
      personaTitle: steamyMode
        ? `${selected.title} (Flirty Slow-Burn Mode)`
        : selected.title,
      personaRole: selected.role,
      platform,
      playerMessage: trimmed,
      history: [{ sender: 'match', text: activePrompt }, ...nextTurns],
    });

    setTyping(false);
    if (verdict.passedVibeCheck) {
      sfx.greenFlag();
    } else {
      sfx.redFlag();
    }

    const updatedPlayerTurns = nextTurns.map((t, idx) =>
      idx === nextTurns.length - 1 ? { ...t, passed: verdict.passedVibeCheck } : t,
    );

    setTurnsByThread((prev) => ({
      ...prev,
      [threadKey]: [
        ...updatedPlayerTurns,
        {
          sender: 'match',
          text: verdict.herReply,
          passed: verdict.passedVibeCheck,
          buddy: buildBuddyRemark(verdict.passedVibeCheck, selected.name),
        },
      ],
    }));

    const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
    setCoachByThread((prev) => ({
      ...prev,
      [threadKey]: {
        note: verdict.coachNote,
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
    });
    onGrantBonusCredits?.('tea_story_submitted', 3);
    setTeaStory('');
    setTeaSubmitted(true);
  };

  return (
    <section
      role="dialog"
      aria-label="Survive Their Inbox — Live AI Texting Mode"
      className="w-full space-y-4 animate-stage-in"
    >
      {/* =====================================================================
       * TOP COMMAND & EXIT BAR: Unmistakable Back-to-Lobby + App Switcher
       * ===================================================================== */}
      <div className="vice-panel rounded-3xl bg-gradient-to-r from-[#FFFDF9] via-[#FFF4F7] to-[#FFFBEB] px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Live Inbox and return to Matchmaker Lobby"
            className="pop-btn h-10 inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-[#FFE4EC] px-3.5 text-sm font-extrabold text-[#1E1022] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-[#FF2E63]" />
            <span>Back to Lobby</span>
          </button>

          {onJumpToWorld && (
            <button
              type="button"
              onClick={onJumpToWorld}
              className="pop-btn hidden sm:inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] px-3 text-xs font-extrabold text-[#065F46] cursor-pointer"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>8-Bit World</span>
            </button>
          )}

          <div className="hidden xl:block pl-1">
            <div className="font-display text-base text-[#1E1022] leading-tight">
              Live Dating &amp; Chat Simulator
            </div>
            <div className="text-[11px] font-semibold text-[#5A4664]">
              {!freeTrialUsed
                ? '🎁 First text FREE • Real human-style replies + emojis'
                : wallet.isVip || wallet.isFounderUnlimited
                  ? '👑 VIP Unlimited Chat Active'
                  : `Wallet: ${wallet.credits} Credits`}
            </div>
          </div>
        </div>

        {/* 3 Authentic Platform Skins: Tinder Web + iMessage + Discord */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-2xl border-2 border-[#1E1022] bg-white p-1 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_#1E1022]">
            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                setPlatform('tinder');
              }}
              className={`inline-flex h-8 items-center gap-1.5 rounded-xl px-3 transition cursor-pointer ${
                platform === 'tinder'
                  ? 'bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-white'
                  : 'text-[#1E1022] hover:bg-[#FFF4F7]'
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Tinder</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                setPlatform('imessage');
              }}
              className={`inline-flex h-8 items-center gap-1.5 rounded-xl px-3 transition cursor-pointer ${
                platform === 'imessage'
                  ? 'bg-[#007AFF] text-white'
                  : 'text-[#1E1022] hover:bg-[#F2F2F7]'
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>iMessage</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                setPlatform('discord');
              }}
              className={`inline-flex h-8 items-center gap-1.5 rounded-xl px-3 transition cursor-pointer ${
                platform === 'discord'
                  ? 'bg-[#5865F2] text-white'
                  : 'text-[#1E1022] hover:bg-[#EEF0FF]'
              }`}
            >
              <Hash className="h-3.5 w-3.5" />
              <span>Discord</span>
            </button>
          </div>

          <div className="inline-flex rounded-xl border-2 border-[#1E1022] bg-white p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setSteamyMode(false);
                if (discordChannel === 'after-dark-flirt') setDiscordChannel('first-dm-vetting');
              }}
              className={`h-8 rounded-lg px-2.5 transition cursor-pointer ${
                !steamyMode ? 'bg-[#FFBE0B] text-[#1E1022]' : 'text-[#1E1022]'
              }`}
            >
              🍸 First DM
            </button>
            <button
              type="button"
              onClick={() => {
                setSteamyMode(true);
                if (platform === 'discord') setDiscordChannel('after-dark-flirt');
              }}
              className={`inline-flex h-8 items-center gap-1 rounded-lg px-2.5 transition cursor-pointer ${
                steamyMode ? 'bg-[#FF2E63] text-white' : 'text-[#D90452]'
              }`}
            >
              <Flame className="h-3 w-3" />
              <span>Flirt Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * MAIN 3-COLUMN TINDER-WEB DESKTOP WORKSPACE (76vh+)
       * Col 1: Matches & Messages Sidebar | Col 2: Live App Chat | Col 3: Profile Card
       * ===================================================================== */}
      <div className="vice-panel overflow-hidden rounded-3xl grid grid-cols-1 lg:grid-cols-[290px_1fr_300px] min-h-[75vh] bg-white">
        {/* -------------------------------------------------------------------
         * COLUMN 1: TINDER WEB MATCHES & THREADS SIDEBAR
         * ------------------------------------------------------------------- */}
        <aside className="flex flex-col border-b-2 lg:border-b-0 lg:border-r-2 border-[#1E1022]/15 bg-[#FAFAFC] max-h-[300px] lg:max-h-[78vh]">
          {/* Coral-Pink Tinder Sidebar Header */}
          <div className="bg-gradient-to-r from-[#FD267A] to-[#FF6036] px-4 py-3 text-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-base">
                <Flame className="h-4 w-4 fill-white" />
                <span>Matches ({filteredContacts.length})</span>
              </div>
              <div className="inline-flex rounded-full bg-black/20 p-0.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setRoleFilter('her');
                    const firstHer = INBOX_CONTACTS.find((c) => c.role === 'her');
                    if (firstHer) setSelected(firstHer);
                  }}
                  className={`rounded-full px-2.5 py-0.5 transition cursor-pointer ${
                    roleFilter === 'her' ? 'bg-white text-[#FD267A]' : 'text-white/90'
                  }`}
                >
                  Her (39)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRoleFilter('him');
                    const firstHim = INBOX_CONTACTS.find((c) => c.role === 'him');
                    if (firstHim) setSelected(firstHim);
                  }}
                  className={`rounded-full px-2.5 py-0.5 transition cursor-pointer ${
                    roleFilter === 'him' ? 'bg-white text-[#FD267A]' : 'text-white/90'
                  }`}
                >
                  Cubs (17)
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/80" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, age, zodiac..."
                className="w-full rounded-full bg-white/20 pl-8 pr-3 py-1.5 text-xs font-semibold text-white placeholder:text-white/80 focus:bg-white/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Tinder Gold-Ring "New Matches" Strip */}
          <div className="border-b border-[#E5E7EB] px-3.5 py-2.5 bg-white">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#FD267A] mb-2">
              New Matches • Online Now
            </div>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-0.5">
              {filteredContacts.slice(0, 8).map((c) => {
                const isSel = c.id === selected.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sfx.messagePop();
                      setSelected(c);
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
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#22C55E]" />
                    </div>
                    <span className="mt-1 text-[11px] font-bold text-[#1E1022] group-hover:text-[#FD267A]">
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Tinder Messages Thread List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9]">
            {filteredContacts.map((c) => {
              const active = c.id === selected.id;
              const tKey = `${c.id}:${steamyMode ? 'steamy' : 'vet'}`;
              const threadTurns = turnsByThread[tKey] ?? [];
              const preview =
                threadTurns.length > 0
                  ? threadTurns[threadTurns.length - 1].text
                  : steamyMode
                    ? c.steamyPrompt
                    : c.openingPrompt;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    sfx.messagePop();
                    setSelected(c);
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
                      <span className="truncate text-sm font-extrabold text-[#1E1022]">
                        {c.name}, {c.age}
                      </span>
                      <span className="shrink-0 text-[10px] font-semibold text-[#94A3B8]">
                        {c.zodiac.split(' ')[0]}
                      </span>
                    </div>
                    <p className="truncate text-xs font-medium text-[#64748B] mt-0.5">
                      {preview}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* -------------------------------------------------------------------
         * COLUMN 2: CENTER LIVE CHAT CANVAS (TINDER / iMESSAGE / DISCORD)
         * ------------------------------------------------------------------- */}
        {platform === 'tinder' ? (
          <div className="flex flex-col overflow-hidden bg-white font-sans text-[#1E1022] max-h-[78vh]">
            {/* Authentic Tinder Web Match Header */}
            <div className="flex items-center justify-between gap-2 border-b border-[#E5E7EB] bg-white px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0 rounded-full bg-gradient-to-tr from-[#FD267A] to-[#FF6036] p-0.5">
                  <img
                    src={selected.photoUrl}
                    alt={selected.name}
                    className="h-11 w-11 rounded-full object-cover object-top border-2 border-white"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-base font-extrabold text-[#1E1022]">
                      {selected.name}, {selected.age}
                    </span>
                    <BadgeCheck className="h-4 w-4 shrink-0 text-[#1786FF]" />
                    {superLikedIds.includes(selected.id) && (
                      <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-extrabold text-[#0284C7]">
                        ⭐ SUPER LIKED
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-[#64748B] truncate">
                    🔥 You matched with {selected.name} today • Active now
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    sfx.victoryFanfare();
                    setSuperLikedIds((prev) =>
                      prev.includes(selected.id) ? prev : [...prev, selected.id],
                    );
                    setCallBanner(
                      `⭐ You Super-Liked ${selected.name}! "${selected.name} noticed your blue star 👀 send your best Friday plan!"`,
                    );
                  }}
                  title="Send Super Like"
                  className="inline-flex h-9 items-center gap-1 rounded-full border border-[#BAE6FD] bg-[#F0F9FF] px-3 text-xs font-extrabold text-[#0284C7] hover:bg-[#E0F2FE] cursor-pointer"
                >
                  <Star className="h-3.5 w-3.5 fill-[#0284C7]" />
                  <span className="hidden sm:inline">Super Like</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextMatch}
                  title="Skip to next match"
                  className="inline-flex h-9 items-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-xs font-bold text-[#475569] hover:bg-[#FEE2E2] hover:text-[#BE123C] cursor-pointer"
                >
                  Next Match →
                </button>
              </div>
            </div>

            {/* Tinder Message Thread */}
            <div className="flex-1 overflow-y-auto bg-[#FCFCFD] p-4 sm:p-6 space-y-4">
              <div className="text-center">
                <span className="inline-block rounded-full bg-[#FFF0F5] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#FD267A]">
                  🔥 IT’S A MATCH • {selected.height} • {selected.zodiac}
                </span>
              </div>

              {callBanner && (
                <div className="mx-auto max-w-md rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] px-4 py-2.5 text-center text-xs font-bold text-[#0369A1]">
                  {callBanner}
                </div>
              )}

              {/* Match Opening Tinder Bubble */}
              <div className="flex items-end gap-2.5 max-w-[86%]">
                <img
                  src={selected.photoUrl}
                  alt={selected.name}
                  className="h-8 w-8 rounded-full object-cover object-top shrink-0"
                />
                <div className="flex items-center gap-1.5">
                  <div className="rounded-3xl rounded-bl-md bg-[#F0F2F4] px-4 py-3 text-[15px] leading-snug text-[#1E1022] shadow-2xs">
                    {activePrompt}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCycleTapback(`${threadKey}:open`, activePrompt)}
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

              {/* Dynamic Tinder Conversation Bubbles */}
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
                  <div key={i} className="flex items-end gap-2.5 max-w-[88%] animate-stage-in">
                    <img
                      src={selected.photoUrl}
                      alt={selected.name}
                      className="h-8 w-8 rounded-full object-cover object-top shrink-0"
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="rounded-3xl rounded-bl-md bg-[#F0F2F4] px-4 py-3 text-[15px] leading-snug text-[#1E1022]">
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
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#1E1022]">
                      <Sparkles className="inline h-3 w-3 mr-0.5 text-[#FD267A]" />
                      {lastCoach.source}
                    </span>
                  </div>
                  <p className="mt-1 font-medium">{lastCoach.note}</p>
                </div>
              )}
            </div>

            {/* Tinder Quick Icebreakers + Emoji Strip + Composer */}
            <div className="border-t border-[#E5E7EB] bg-white px-4 py-3 space-y-2">
              {/* Natural Icebreaker Chips */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
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

              {/* 1-Click Emoji Bar */}
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
                  className="flex-1 rounded-full border-2 border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-[#1E1022] placeholder:text-[#94A3B8] focus:border-[#FD267A] focus:bg-white focus:outline-none"
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
          </div>
        ) : platform === 'imessage' ? (
          /* -------------------------------------------------------------------
           * SKIN B: AUTHENTIC iOS 18 / MAC iMESSAGE INTERFACE
           * ------------------------------------------------------------------- */
          <div className="flex flex-col overflow-hidden bg-white font-sans text-[#1C1C1E] max-h-[78vh]">
            <div className="border-b border-[#C6C6C8] bg-[#F2F2F7]/95 px-4 py-2.5 backdrop-blur-md flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#007AFF] cursor-pointer"
              >
                <span>‹ Lobby</span>
              </button>

              <div className="flex items-center gap-2.5">
                <img
                  src={selected.photoUrl}
                  alt={selected.name}
                  className="h-9 w-9 rounded-full object-cover object-top shadow-2xs"
                />
                <div className="leading-tight">
                  <div className="text-xs font-bold text-[#1C1C1E]">
                    {selected.name}, {selected.age} <span className="text-[#8E8E93]">›</span>
                  </div>
                  <div className="text-[10px] font-medium text-[#8E8E93]">iMessage • Active now</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-[#007AFF]">
                <button
                  type="button"
                  onClick={() => {
                    sfx.crystalClink();
                    setCallBanner(
                      `📹 FaceTime Video: ${selected.name} smiled over her wine glass 😍 "Bold move calling! Text me our 7:30 spot."`,
                    );
                  }}
                  title="FaceTime Vibe Check"
                  className="rounded-full p-1 hover:bg-black/5 cursor-pointer"
                >
                  <Video className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.crystalClink();
                    setCallBanner(
                      `📞 6:00 PM Phone Call: ${selected.name} loves a caller who skips endless "wyd" texts! 🥂`,
                    );
                  }}
                  title="6 PM Phone Call"
                  className="rounded-full p-1 hover:bg-black/5 cursor-pointer"
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-4 sm:px-6 space-y-3">
              <div className="text-center text-[11px] font-medium text-[#8E8E93]">
                iMessage • Today 7:42 PM
              </div>

              {callBanner && (
                <div className="mx-auto max-w-md rounded-2xl border border-[#C6C6C8] bg-[#F2F2F7] px-3.5 py-2 text-center text-xs font-semibold text-[#1C1C1E]">
                  {callBanner}
                </div>
              )}

              <div className="flex items-end gap-2 max-w-[86%]">
                <img
                  src={selected.photoUrl}
                  alt={selected.name}
                  className="h-7 w-7 rounded-full object-cover object-top shrink-0"
                />
                <button
                  type="button"
                  onClick={() => handleCycleTapback(`${threadKey}:open`, activePrompt)}
                  className="relative rounded-[20px] rounded-bl-[4px] bg-[#E9E9EB] px-4 py-2.5 text-left text-[15px] leading-snug text-[#1C1C1E] cursor-pointer"
                >
                  {tapbacks[`${threadKey}:open`] && (
                    <span className="absolute -top-2.5 -right-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#007AFF] px-1.5 text-xs text-white shadow">
                      {tapbacks[`${threadKey}:open`]}
                    </span>
                  )}
                  {activePrompt}
                </button>
              </div>

              {turns.map((turn, i) =>
                turn.sender === 'player' ? (
                  <div key={i} className="flex flex-col items-end">
                    <button
                      type="button"
                      onClick={() => handleCycleTapback(`${threadKey}:${i}`)}
                      className={`relative max-w-[82%] rounded-[20px] rounded-br-[4px] px-4 py-2.5 text-left text-[15px] leading-snug text-white shadow-2xs cursor-pointer ${
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
                        ? 'Sent as Text Message • Green-Bubble Ick 💀'
                        : turn.passed === true
                          ? `Read 7:43 PM • ${selected.name} loved your message`
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
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => handleCycleTapback(`${threadKey}:${i}`, turn.text)}
                        className="relative block rounded-[20px] rounded-bl-[4px] bg-[#E9E9EB] px-4 py-2.5 text-left text-[15px] leading-snug text-[#1C1C1E] cursor-pointer"
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
                        className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition cursor-pointer ${
                          speakingTurnIdx === i
                            ? 'bg-[#007AFF] text-white'
                            : 'bg-[#F2F2F7] text-[#007AFF] border border-[#C6C6C8]'
                        }`}
                      >
                        {speakingTurnIdx === i ? (
                          <VolumeX className="h-3.5 w-3.5" />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5" />
                        )}
                        <span>{speakingTurnIdx === i ? 'Stop Audio' : 'Play Voice Note'}</span>
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
                  <div className="inline-flex items-center gap-1 rounded-[20px] rounded-bl-[4px] bg-[#E9E9EB] px-4 py-3">
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
                    {lastCoach.passed ? '💚 VIBE CHECK PASSED: ' : '🚩 VIBE CHECK ROASTED: '}
                    {lastCoach.deltas}
                  </div>
                  <p className="mt-1 font-medium">{lastCoach.note}</p>
                </div>
              )}
            </div>

            <div className="border-t border-[#C6C6C8] bg-[#F2F2F7] px-3.5 py-2.5 space-y-2">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                {activeChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInput(chip)}
                    className="shrink-0 max-w-xs truncate rounded-full border border-[#C6C6C8] bg-white px-3 py-1 text-xs font-medium text-[#1C1C1E] hover:border-[#007AFF] cursor-pointer"
                    title={chip}
                  >
                    💬 {chip}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {QUICK_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => handleAppendEmoji(em)}
                    className="h-6 w-6 shrink-0 rounded-full hover:bg-white text-sm cursor-pointer"
                  >
                    {em}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInput(activeChips[0] ?? '')}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E5E5EA] text-[#8E8E93] hover:text-[#007AFF] cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
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
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-white disabled:bg-[#C7C7CC] cursor-pointer"
                  >
                    <ArrowUp className="h-4 w-4 stroke-[2.75]" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* -------------------------------------------------------------------
           * SKIN C: AUTHENTIC DISCORD SERVER & #BOYS-ROBLOX-VC
           * ------------------------------------------------------------------- */
          <div className="flex flex-col overflow-hidden bg-[#313338] font-sans text-[#DBDEE1] max-h-[78vh]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1F2023] bg-[#2B2D31] px-4 py-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    ['first-dm-vetting', false],
                    ['after-dark-flirt', true],
                    ['boys-roblox-vc', false],
                  ] as const
                ).map(([id, isSteamy]) => {
                  const active = discordChannel === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        sfx.messagePop();
                        setDiscordChannel(id);
                        setSteamyMode(isSteamy);
                      }}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                        active
                          ? 'bg-[#5865F2] text-white'
                          : 'bg-[#1E1F22] text-[#949BA4] hover:text-white'
                      }`}
                    >
                      <Hash className="h-3.5 w-3.5" />
                      <span>{id}</span>
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] font-semibold text-[#949BA4]">
                🟢 @{selected.name} online
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex items-start gap-3 rounded-lg px-2 py-1 hover:bg-[#2E3035]">
                <img
                  src={selected.photoUrl}
                  alt={selected.name}
                  className="h-10 w-10 rounded-full object-cover object-top shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm font-bold ${
                        selected.role === 'her' ? 'text-[#F47FFF]' : 'text-[#F0B232]'
                      }`}
                    >
                      {selected.name}
                    </span>
                    <span className="rounded bg-[#5865F2]/25 px-1.5 py-0.2 text-[10px] font-bold text-[#949CF7]">
                      {selected.role === 'her' ? 'COUGAR VIP' : 'CUB'}
                    </span>
                    <span className="text-[11px] text-[#949BA4]">Today at 7:42 PM</span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#DBDEE1]">{activePrompt}</p>
                </div>
              </div>

              {turns.map((turn, i) =>
                turn.sender === 'player' ? (
                  <div key={i} className="flex items-start gap-3 rounded-lg px-2 py-1">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-xs font-bold text-white">
                      YOU
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#57F287]">You</span>
                        <span className="text-[11px] text-[#949BA4]">Today at 7:43 PM</span>
                      </div>
                      <p className="text-[15px] leading-relaxed text-white">{turn.text}</p>
                    </div>
                  </div>
                ) : (
                  <React.Fragment key={i}>
                    <div className="flex items-start gap-3 rounded-lg px-2 py-1 hover:bg-[#2E3035] animate-stage-in">
                      <img
                        src={selected.photoUrl}
                        alt={selected.name}
                        className="h-10 w-10 rounded-full object-cover object-top shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-sm font-bold ${
                              selected.role === 'her' ? 'text-[#F47FFF]' : 'text-[#F0B232]'
                            }`}
                          >
                            {selected.name}
                          </span>
                          <span className="text-[11px] text-[#949BA4]">Today at 7:43 PM</span>
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
                                    persona: `${selected.name} (${selected.age})`,
                                    reaction: emoji,
                                    aiReply: turn.text,
                                  });
                                }}
                                className={`inline-flex h-7 items-center gap-1 rounded border px-2 text-xs font-semibold cursor-pointer ${
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

                    {discordChannel === 'boys-roblox-vc' && turn.buddy && (
                      <div className="flex items-start gap-3 rounded-lg bg-[#2B2D31]/70 px-2.5 py-1.5 animate-stage-in">
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
                        {lastCoach.passed ? '💚 VIBE CHECK PASSED: ' : '🚩 VIBE CHECK ROASTED: '}
                        {lastCoach.deltas}
                      </div>
                      <p className="text-[#DBDEE1]">{lastCoach.note}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#313338] px-4 pb-3.5 pt-1 space-y-2">
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
                className="flex items-center gap-2 rounded-xl bg-[#383A40] px-3 py-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Message ${selected.name} in #${discordChannel}...`}
                  maxLength={280}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-[#80848E] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!input.trim() || typing}
                  className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] px-3 text-xs font-bold text-white disabled:opacity-40 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
         * COLUMN 3: RIGHT TINDER PROFILE CARD & LIVE CHEMISTRY METER
         * ------------------------------------------------------------------- */}
        <aside className="flex flex-col justify-between border-t-2 lg:border-t-0 lg:border-l-2 border-[#1E1022]/15 bg-[#FFFDF9] p-4 space-y-4 overflow-y-auto max-h-[78vh]">
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#1E1022] shadow-[3px_3px_0px_#1E1022]">
              <img
                src={selected.photoUrl}
                alt={selected.name}
                className="h-56 w-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 text-white">
                <div className="flex items-center gap-1.5 font-display text-xl">
                  <span>
                    {selected.name}, {selected.age}
                  </span>
                  <BadgeCheck className="h-4 w-4 text-[#38BDF8]" />
                </div>
                <div className="text-xs font-semibold text-white/90">{selected.title}</div>
              </div>
            </div>

            {/* Vitals Pills */}
            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold text-[#1E1022]">
              <span className="rounded-full border border-[#1E1022]/20 bg-white px-2.5 py-0.5">
                📏 {selected.height}
              </span>
              <span className="rounded-full border border-[#1E1022]/20 bg-white px-2.5 py-0.5">
                ✨ {selected.zodiac}
              </span>
              <span className="rounded-full border border-[#1E1022]/20 bg-[#FFF4F7] px-2.5 py-0.5 text-[#D90452]">
                🍸 {selected.drink}
              </span>
            </div>

            <p className="text-xs font-medium leading-relaxed text-[#4A3852] bg-white rounded-2xl border border-[#1E1022]/12 p-3">
              {selected.bio}
            </p>

            {/* Live Chemistry Thermometer */}
            <div className="rounded-2xl border-2 border-[#1E1022] bg-white p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#1E1022]">
                <span>🔥 Date Chemistry Meter</span>
                <span className="text-[#FD267A]">{vibePercent}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                <div
                  style={{ width: `${vibePercent}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#FD267A] to-[#FFBE0B] transition-all duration-300"
                />
              </div>
              {onStartDateWithContact && (
                <button
                  type="button"
                  onClick={() => onStartDateWithContact(selected.id, selected.role)}
                  className="pop-btn mt-2 w-full h-10 rounded-xl bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-xs font-extrabold text-white cursor-pointer"
                >
                  💘 Take {selected.name} on Full Date Run →
                </button>
              )}
            </div>
          </div>

          {/* Real-Life Red/Green Flag Crowdsourcing Box */}
          <form
            onSubmit={handleSubmitTeaStory}
            className="rounded-2xl border-2 border-dashed border-[#1E1022]/25 bg-[#FFFBEB] p-3 space-y-2"
          >
            <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#B45309]">
              🫖 Spill a Real-Life Texting Red Flag (+3 Cr)
            </div>
            {teaSubmitted ? (
              <p className="text-xs font-bold text-[#065F46]">
                ✓ Sent to the Club Writers’ Vault (+3 Credits)! Thank you for the tea 🥂
              </p>
            ) : (
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={teaStory}
                  onChange={(e) => setTeaStory(e.target.value)}
                  placeholder="e.g. Sent 8 voice notes on pine pollen..."
                  maxLength={180}
                  className="min-w-0 flex-1 rounded-xl border border-[#1E1022]/25 bg-white px-2.5 py-1.5 text-xs text-[#1E1022] placeholder:text-[#94A3B8] focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl border-2 border-[#1E1022] bg-[#FFBE0B] px-2.5 py-1 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                >
                  Send
                </button>
              </div>
            )}
          </form>
        </aside>
      </div>
    </section>
  );
};
