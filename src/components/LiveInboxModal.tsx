import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  BadgeCheck,
  Flame,
  Gamepad2,
  Hash,
  Headphones,
  Heart,
  MessageCircle,
  Mic,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Star,
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
  tagline: string;
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
  ...HER_ARCHETYPES.map((h) => {
    const details = getProfileDetails(h);
    return {
      id: h.id,
      name: h.name,
      age: h.age,
      height: details.height,
      zodiac: details.zodiac,
      drink: details.signatureDrink,
      loveLanguage: details.loveLanguage,
      tagline: h.tagline,
      title: h.title,
      bio: h.vibeSummary,
      role: 'her' as const,
      photoUrl: h.photoUrl,
      openingPrompt:
        h.id === 'sedona-qigong-mommy'
          ? `morning sweet boy 🧘‍♀️✨ i guide 6:30am qigong, skip all seed oils, and love a calm nervous system. what's our friday tea or dinner plan? (zero cubsplaining lol)`
          : h.subplotTags.includes('seed_oil_bernedoodle_mommy')
            ? `fair warning cutie 🥑🐶 strictly gluten + seed oil free and #2 on the waitlist for a tricolor mini bernedoodle! where are you taking me friday? ✨`
            : h.subplotTags.includes('black_cat_energy')
              ? `easy there puppy 🐈‍⬛ every guy in my dms promises the moon on day 1 lol. i take my time... convince me why i shouldn't make you wait till next week 👀`
              : h.subplotTags.includes('junior_cougar_gap')
                ? `quick math check 😅 i'm ${h.age}, so our gap officially makes me a junior cougar lol. tell me where you were in 2008 + your friday ${(h.signatureDrink || 'espresso martini').toLowerCase()} spot 🍸`
                : h.subplotTags.includes('dog_mom_divorced')
                  ? `${h.age}, happily divorced, and lowered my age slider bc every 43yo guy on here just rants about his ex 😭💀 tell me our friday plan + how you're winning over my pup 🐾`
                  : h.age < 40
                    ? `hiii! my sitter is officially booked for friday at 7 🙌 i get ONE free night for a ${(h.signatureDrink || 'cocktail').toLowerCase()} this month so don't fumble... where are we going? 🥂`
                    : h.age >= 60
                      ? `caught you looking over at the gallery opening 🥂 most younger men get nervous around a ${h.age}yo ${(h.zodiac || 'Scorpio').split(' ')[0]}... how would you court me this weekend? ✨`
                      : h.subplotTags.includes('princess_treatment')
                        ? `${h.name} here 💅 long week as a ${h.title.split('•')[0].trim().toLowerCase()} and i'm craving a ${(h.signatureDrink || 'martini').toLowerCase()}. zero planning on my end... where are you taking me friday? ✨`
                        : `okay you swiped right on a ${h.age}yo ${h.title.split('•')[0].trim().toLowerCase()} 😏 skip the "hey / whats ur snap" lol... where are we grabbing ${(h.signatureDrink || 'espresso martini').toLowerCase()}s friday? 🍸`,
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
      tagline: c.tagline,
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
    };
  }),
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
  const [tinderSubMode, setTinderSubMode] = useState<'messages' | 'swipe'>('messages');
  const [swipeFly, setSwipeFly] = useState<'left' | 'right' | 'super' | null>(null);
  const [swipeDragX, setSwipeDragX] = useState(0);
  const [isSwipeDragging, setIsSwipeDragging] = useState(false);
  const swipeStartXRef = useRef<number | null>(null);

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
  const [openTapbackMenuKey, setOpenTapbackMenuKey] = useState<string | null>(null);
  const [discordReacts, setDiscordReacts] = useState<Record<string, boolean>>({});
  const [callBanner, setCallBanner] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [freeMessagesSent, setFreeMessagesSent] = useState(0);
  const [speakingTurnIdx, setSpeakingTurnIdx] = useState<number | null>(null);
  const [teaStory, setTeaStory] = useState('');
  const [teaSubmitted, setTeaSubmitted] = useState(false);
  const stopVoiceRef = useRef<(() => void) | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPlatform(initialPlatform);
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

  const threadKey = `${selected.id}:${steamyMode ? 'steamy' : 'vet'}`;
  const turns = turnsByThread[threadKey] ?? [];
  const lastCoach = coachByThread[threadKey];
  const activePrompt = steamyMode ? selected.steamyPrompt : selected.openingPrompt;
  const activeChips = steamyMode ? selected.steamyChips : selected.quickChips;

  const playerTurnCount = turns.filter((t) => t.sender === 'player').length;
  const stageLabel =
    playerTurnCount < 2
      ? 'Stage 1/4 • First Spark'
      : playerTurnCount < 5
        ? 'Stage 2/4 • Pre-Date Banter'
        : playerTurnCount < 8
          ? 'Stage 3/4 • After Date #1'
          : 'Stage 4/4 • Going Steady (Ongoing)';

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [turns.length, typing, selected.id, platform, tinderSubMode]);

  if (!open) return null;

  const greenTurnCount = turns.filter((t) => t.sender === 'match' && t.passed).length;
  const vibePercent = Math.min(
    100,
    Math.max(
      15,
      38 +
        greenTurnCount * 32 -
        turns.filter((t) => t.sender === 'match' && t.passed === false).length * 20,
    ),
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
    setInput((prev) => `${prev}${prev && !prev.endsWith(' ') ? ' ' : ''}${emoji}`);
  };

  const pool = filteredContacts.length > 0 ? filteredContacts : INBOX_CONTACTS;
  const currentIdx = Math.max(0, pool.findIndex((c) => c.id === selected.id));
  const nextContact = pool[(currentIdx + 1) % pool.length] ?? pool[0];

  const handleNextMatch = () => {
    sfx.swipeLeft();
    setSelected(nextContact);
    setCallBanner(null);
  };

  const handlePrevMatch = () => {
    sfx.messagePop();
    const prev = pool[(currentIdx - 1 + pool.length) % pool.length] ?? pool[0];
    setSelected(prev);
    setCallBanner(null);
  };

  // Interactive Tinder Swipe Motion right inside Tinder Web!
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
          ? `⭐ IT'S A SUPER MATCH! ${selected.name} saw your blue star — send your opener below!`
          : `🔥 IT'S A MATCH with ${selected.name}! Send your first message below!`,
      );
    }, 340);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || typing) return;

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
    const nextTurns = [...turns, { sender: 'player' as const, text: trimmed }];
    setTurnsByThread((prev) => ({ ...prev, [threadKey]: nextTurns }));
    setInput('');
    setTyping(true);

    const verdict = await liveAiInboxService.evaluateOpeningDm({
      personaId: selected.id,
      personaName: selected.name,
      personaAge: selected.age,
      personaTitle: steamyMode ? `${selected.title} (Flirty Slow-Burn Mode)` : selected.title,
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

  const isDarkDiscord = platform === 'discord';
  const isAppleMessages = platform === 'imessage';

  return (
    <section
      role="dialog"
      aria-label="Survive Their Inbox — Live AI Texting Mode"
      className="w-full space-y-4 animate-stage-in"
    >
      {/* =====================================================================
       * TOP COMMAND & PLATFORM SWITCHER BAR
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

          {onJumpToWorld && (
            <button
              type="button"
              onClick={onJumpToWorld}
              className="pop-btn hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full bg-[#ECFDF5] hover:bg-[#D1FAE5] px-3 text-xs font-bold text-[#065F46] cursor-pointer"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>8-Bit World</span>
            </button>
          )}

          <div className="hidden xl:block pl-1">
            <div className="font-display text-sm sm:text-base text-[#18101E] leading-tight">
              Dynamic Multi-Turn AI Chat • {stageLabel}
            </div>
            <div className="text-[11px] font-semibold text-[#64748B]">
              {freeMessagesSent < 3
                ? `🎁 ${3 - freeMessagesSent} free replies left • Evolves across 4 relationship stages`
                : wallet.isVip || wallet.isFounderUnlimited
                  ? '👑 VIP Unlimited Ongoing Chat Active'
                  : `Ongoing Chat Active • Wallet: ${wallet.credits} Credits`}
            </div>
          </div>
        </div>

        {/* 3 Authentic Native App Switchers: Tinder + iMessage + Discord */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full border border-[#18101E]/12 bg-[#F8FAFC] p-1 text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                setPlatform('tinder');
              }}
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
              onClick={() => {
                sfx.messagePop();
                setPlatform('imessage');
              }}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 transition cursor-pointer ${
                platform === 'imessage'
                  ? 'bg-[#007AFF] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#18101E]'
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5 fill-current" />
              <span>iMessage</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                setPlatform('discord');
              }}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 transition cursor-pointer ${
                platform === 'discord'
                  ? 'bg-[#5865F2] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#18101E]'
              }`}
            >
              <Hash className="h-3.5 w-3.5" />
              <span>Discord</span>
            </button>
          </div>

          <div className="inline-flex rounded-full border border-[#18101E]/12 bg-[#F8FAFC] p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setSteamyMode(false);
                if (discordChannel === 'after-dark-flirt') setDiscordChannel('first-dm-vetting');
              }}
              className={`h-8 rounded-full px-3 transition cursor-pointer ${
                !steamyMode ? 'bg-[#18101E] text-white' : 'text-[#475569]'
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
              className={`inline-flex h-8 items-center gap-1 rounded-full px-3 transition cursor-pointer ${
                steamyMode
                  ? 'bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-white'
                  : 'text-[#E11D48]'
              }`}
            >
              <Flame className="h-3 w-3" />
              <span>Flirt Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * FULL NATIVE 3-COLUMN APP SHELL (TINDER WEB vs APPLE MESSAGES vs DISCORD)
       * ===================================================================== */}
      <div
        className={`overflow-hidden rounded-3xl border shadow-[0_20px_50px_-14px_rgba(15,23,42,0.22)] grid grid-cols-1 lg:grid-cols-[300px_1fr_340px] items-start ${
          isDarkDiscord
            ? 'border-[#1F2023] bg-[#313338] text-[#DBDEE1]'
            : isAppleMessages
              ? 'border-[#D1D1D6] bg-[#F5F5F7] text-[#1C1C1E]'
              : 'border-black/10 bg-white text-[#18101E]'
        }`}
      >
        {/* -------------------------------------------------------------------
         * COLUMN 1: PLATFORM-AUTHENTIC SIDEBAR (Tinder / Apple Messages / Discord)
         * ------------------------------------------------------------------- */}
        {isDarkDiscord ? (
          /* DISCORD AUTHENTIC SERVER RAIL + CHANNELS/DMS SIDEBAR */
          <aside className="flex h-[360px] lg:h-[680px] border-b lg:border-b-0 lg:border-r border-[#1F2023] bg-[#2B2D31]">
            {/* Far-Left 56px Discord Server Rail */}
            <div className="hidden sm:flex w-14 shrink-0 flex-col items-center gap-2.5 bg-[#1E1F22] py-3">
              <button
                type="button"
                onClick={() => setDiscordChannel('first-dm-vetting')}
                title="Direct Messages"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5865F2] text-white shadow-md cursor-pointer"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
              </button>
              <div className="h-0.5 w-7 rounded-full bg-[#35363C]" />
              <button
                type="button"
                onClick={() => setDiscordChannel('first-dm-vetting')}
                title="Cougars & Cubs Club Server"
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#E11D48] to-[#F59E0B] text-lg shadow-sm cursor-pointer"
              >
                <span className="absolute -left-1.5 h-7 w-1 rounded-r-full bg-white" />
                🐆
              </button>
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

            {/* Inner Channels + Direct Messages List */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-[#1F2023] px-3.5 py-3">
                <span className="truncate text-sm font-extrabold text-white">
                  Cougars &amp; Cubs Club
                </span>
                <div className="inline-flex rounded bg-[#1E1F22] p-0.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setRoleFilter('her');
                      const firstHer = INBOX_CONTACTS.find((c) => c.role === 'her');
                      if (firstHer) setSelected(firstHer);
                    }}
                    className={`rounded px-2 py-0.5 cursor-pointer ${
                      roleFilter === 'her' ? 'bg-[#5865F2] text-white' : 'text-[#949BA4]'
                    }`}
                  >
                    Her
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRoleFilter('him');
                      const firstHim = INBOX_CONTACTS.find((c) => c.role === 'him');
                      if (firstHim) setSelected(firstHim);
                    }}
                    className={`rounded px-2 py-0.5 cursor-pointer ${
                      roleFilter === 'him' ? 'bg-[#5865F2] text-white' : 'text-[#949BA4]'
                    }`}
                  >
                    Cubs
                  </button>
                </div>
              </div>

              <div className="px-2.5 pt-2.5 pb-1.5 space-y-1">
                <div className="px-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#949BA4]">
                  Text Channels
                </div>
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
                      className={`w-full flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        active
                          ? 'bg-[#404249] text-white'
                          : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                      }`}
                    >
                      <Hash className="h-4 w-4 shrink-0 text-[#80848E]" />
                      <span className="truncate">{id}</span>
                    </button>
                  );
                })}
              </div>

              <div className="px-2.5 py-1.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find or start a conversation"
                  className="w-full rounded bg-[#1E1F22] px-2.5 py-1.5 text-xs text-[#DBDEE1] placeholder:text-[#80848E] focus:outline-none"
                />
              </div>

              <div className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#949BA4]">
                Direct Messages — {filteredContacts.length} Online
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-2 space-y-0.5">
                {filteredContacts.map((c) => {
                  const active = c.id === selected.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        sfx.messagePop();
                        setSelected(c);
                        setCallBanner(null);
                      }}
                      className={`w-full flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition cursor-pointer ${
                        active
                          ? 'bg-[#404249] text-white'
                          : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={c.photoUrl}
                          alt={c.name}
                          className="h-8 w-8 rounded-full object-cover object-top"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#2B2D31] bg-[#23A55A]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-bold text-[#F2F3F5]">
                          {c.name}, {c.age}
                        </div>
                        <div className="truncate text-[10px] text-[#949BA4]">
                          {c.role === 'him' ? '🎮 Playing Roblox DTI' : `🍸 ${c.drink.slice(0, 22)}`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Authentic Bottom Discord User Voice Status Bar */}
              <div className="flex items-center justify-between bg-[#232428] px-2.5 py-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-[10px] font-extrabold text-white">
                    YOU
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#232428] bg-[#23A55A]" />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <div className="truncate text-xs font-bold text-white">ClubMember</div>
                    <div className="text-[10px] text-[#23A55A]">Online</div>
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
          /* APPLE macOS / iPadOS MESSAGES SIDEBAR */
          <aside className="flex flex-col border-b lg:border-b-0 lg:border-r border-[#D1D1D6] bg-[#F2F2F7]/95 h-[340px] lg:h-[680px]">
            <div className="px-4 pt-3 pb-2.5 space-y-2.5 border-b border-[#D1D1D6]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                  <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                  <span className="ml-2 text-sm font-bold text-[#1C1C1E]">Messages</span>
                </div>

                <div className="inline-flex rounded-lg bg-[#E5E5EA] p-0.5 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setRoleFilter('her');
                      const firstHer = INBOX_CONTACTS.find((c) => c.role === 'her');
                      if (firstHer) setSelected(firstHer);
                    }}
                    className={`rounded-md px-2.5 py-0.5 transition cursor-pointer ${
                      roleFilter === 'her'
                        ? 'bg-white text-[#1C1C1E] shadow-2xs'
                        : 'text-[#636366]'
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
                    className={`rounded-md px-2.5 py-0.5 transition cursor-pointer ${
                      roleFilter === 'him'
                        ? 'bg-white text-[#1C1C1E] shadow-2xs'
                        : 'text-[#636366]'
                    }`}
                  >
                    Cubs (17)
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8E8E93]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full rounded-xl bg-[#E5E5EA] pl-8 pr-3 py-1.5 text-xs font-medium text-[#1C1C1E] placeholder:text-[#8E8E93] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Pinned Apple Messages Contacts */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {filteredContacts.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sfx.messagePop();
                      setSelected(c);
                      setCallBanner(null);
                    }}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      className={`h-11 w-11 rounded-full object-cover object-top shadow-xs transition ${
                        c.id === selected.id ? 'ring-2 ring-[#007AFF]' : 'group-hover:scale-105'
                      }`}
                    />
                    <span className="mt-1 truncate max-w-full text-[10px] font-semibold text-[#636366]">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain p-2 space-y-0.5">
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
                    className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition cursor-pointer ${
                      active ? 'bg-[#007AFF] text-white' : 'hover:bg-black/5 text-[#1C1C1E]'
                    }`}
                  >
                    {!active && threadTurns.length === 0 ? (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#007AFF]" />
                    ) : (
                      <span className="h-2 w-2 shrink-0" />
                    )}
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
                            active ? 'text-white/85' : 'text-[#8E8E93]'
                          }`}
                        >
                          9:41 PM
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
            </div>
          </aside>
        ) : (
          /* TINDER WEB SIDEBAR */
          <aside className="flex flex-col border-b lg:border-b-0 lg:border-r border-[#E5E7EB] bg-[#FAFAFC] h-[340px] lg:h-[680px]">
            <div className="bg-gradient-to-r from-[#FD267A] to-[#FF6036] px-4 py-3 text-white space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-display text-base tracking-tight">
                  <Flame className="h-4 w-4 fill-white" />
                  <span>tinder ({filteredContacts.length})</span>
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
                  placeholder="Search matches..."
                  className="w-full rounded-full bg-white/20 pl-8 pr-3 py-1.5 text-xs font-semibold text-white placeholder:text-white/80 focus:bg-white/30 focus:outline-none"
                />
              </div>
            </div>

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
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#21D07C]" />
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
                        <span className="truncate text-sm font-extrabold text-[#18101E]">
                          {c.name}, {c.age}
                        </span>
                        <span className="shrink-0 text-[10px] font-semibold text-[#94A3B8]">
                          {c.zodiac.split(' ')[0]}
                        </span>
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
         * COLUMN 2: CENTER LIVE CANVAS (TINDER MESSAGES + SWIPE DECK / iMESSAGE / DISCORD)
         * ------------------------------------------------------------------- */}
        {platform === 'tinder' ? (
          <div className="flex flex-col overflow-hidden bg-white font-sans text-[#18101E] h-[640px] lg:h-[680px]">
            {/* Tinder Header with Live Mode Toggle: 💬 Messages vs 🔥 Swipe Cards */}
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
                    {superLikedIds.includes(selected.id) && (
                      <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-extrabold text-[#0284C7]">
                        ★ SUPER LIKED
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-[#64748B] truncate">
                    🔥 Matched today • {stageLabel}
                  </div>
                </div>
              </div>

              {/* Fun Mode Toggle: Messages vs Swipe Cards + Super Like */}
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
                      `⭐ You Super-Liked ${selected.name}! "${selected.name} noticed your blue star 👀 send your best Friday plan!"`,
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
              /* INTERACTIVE TINDER WEB SWIPE CARD STACK + BIG CIRCULAR ACTION BUTTONS */
              <div className="flex-1 flex flex-col items-center justify-between bg-[#F8FAFC] p-4 sm:p-5 overflow-hidden">
                <div className="relative w-full max-w-[360px] flex-1 max-h-[470px]">
                  {/* Next Card Underneath */}
                  <div className="pointer-events-none absolute inset-0 scale-95 translate-y-2 overflow-hidden rounded-[26px] bg-[#111827] opacity-65 shadow-md">
                    <img
                      src={nextContact.photoUrl}
                      alt=""
                      className="h-full w-full object-cover object-top"
                    />
                  </div>

                  {/* Active Draggable Tinder Card */}
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
                      <p className="text-xs text-white/85 leading-snug">
                        {selected.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Big Circular Tinder Buttons */}
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
              /* TINDER MESSAGE THREAD */
              <>
                <div
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto overscroll-contain bg-[#FCFCFD] p-4 sm:p-6 space-y-4"
                >
                  <div className="text-center">
                    <span className="inline-block rounded-full bg-[#FFF0F5] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#FD267A]">
                      🔥 {stageLabel} • {selected.height} • {selected.zodiac.split('•')[0].trim()}
                    </span>
                  </div>

                  {callBanner && (
                    <div className="mx-auto max-w-md rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] px-4 py-2.5 text-center text-xs font-bold text-[#0369A1]">
                      {callBanner}
                    </div>
                  )}

                  <div className="flex items-end gap-2.5 max-w-[86%]">
                    <img
                      src={selected.photoUrl}
                      alt={selected.name}
                      className="h-8 w-8 rounded-full object-cover object-top shrink-0"
                    />
                    <div className="flex items-center gap-1.5">
                      <div className="rounded-3xl rounded-bl-md bg-[#F0F2F4] px-4 py-3 text-[15px] leading-snug text-[#18101E] shadow-2xs">
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

                {/* Quick Tinder Swipe Action Strip + Icebreakers + Composer */}
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
           * SKIN B: AUTHENTIC APPLE iOS 18 / macOS MESSAGES THREAD
           * ------------------------------------------------------------------- */
          <div className="flex flex-col overflow-hidden bg-white font-sans text-[#1C1C1E] h-[640px] lg:h-[680px]">
            {/* Frosted Apple Messages Centered Contact Header */}
            <div className="border-b border-[#D1D1D6] bg-[#F9F9FB]/95 px-4 py-2 backdrop-blur-md flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-0.5 text-sm font-medium text-[#007AFF] cursor-pointer"
              >
                <span>‹ Messages</span>
              </button>

              <div className="flex flex-col items-center">
                <img
                  src={selected.photoUrl}
                  alt={selected.name}
                  className="h-9 w-9 rounded-full object-cover object-top shadow-2xs"
                />
                <div className="mt-0.5 text-[11px] font-semibold text-[#1C1C1E]">
                  {selected.name}, {selected.age} <span className="text-[#8E8E93]">›</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#007AFF]">
                <button
                  type="button"
                  onClick={() => {
                    sfx.crystalClink();
                    setCallBanner(
                      `📹 FaceTime Video: ${selected.name} smiled over her wine glass 😍 "Bold move calling! Text me our 7:30 spot."`,
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
                      `📞 FaceTime Audio: ${selected.name} loves a caller who skips endless "wyd" texts! 🥂`,
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
                <div className="text-[11px] font-medium text-[#8E8E93]">iMessage</div>
                <div className="text-[11px] font-semibold text-[#8E8E93]">
                  Today 9:41 PM • {stageLabel}
                </div>
              </div>

              {callBanner && (
                <div className="mx-auto max-w-md rounded-2xl border border-[#D1D1D6] bg-[#F2F2F7] px-3.5 py-2 text-center text-xs font-semibold text-[#1C1C1E]">
                  {callBanner}
                </div>
              )}

              {/* Opening Incoming Grey iMessage Bubble + Tapback Picker */}
              <div className="flex items-end gap-2 max-w-[86%]">
                <img
                  src={selected.photoUrl}
                  alt={selected.name}
                  className="h-7 w-7 rounded-full object-cover object-top shrink-0"
                />
                <div className="relative">
                  {openTapbackMenuKey === `${threadKey}:open` && (
                    <div className="absolute -top-10 left-0 z-20 inline-flex items-center gap-1.5 rounded-full border border-[#D1D1D6] bg-white px-3 py-1 shadow-lg">
                      {TAPBACK_OPTIONS.map((tb) => (
                        <button
                          key={tb}
                          type="button"
                          onClick={() =>
                            handleSelectTapback(`${threadKey}:open`, tb, activePrompt)
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
                    {activePrompt}
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
                          ? `Read 9:42 PM`
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

                      {/* Authentic iOS Audio Voice-Memo Pill */}
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
                    {lastCoach.passed ? '💚 VIBE CHECK PASSED: ' : '🚩 VIBE CHECK ROASTED: '}
                    {lastCoach.deltas}
                  </div>
                  <p className="mt-1 font-medium">{lastCoach.note}</p>
                </div>
              )}
            </div>

            {/* Authentic iOS 18 Message Composer */}
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

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {QUICK_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => handleAppendEmoji(em)}
                    className="h-6 w-6 shrink-0 rounded-full hover:bg-[#E5E5EA] text-sm cursor-pointer"
                  >
                    {em}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInput(activeChips[0] ?? '')}
                  title="Insert Suggested Opener"
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
        ) : (
          /* -------------------------------------------------------------------
           * SKIN C: AUTHENTIC DISCORD CHANNEL & #BOYS-ROBLOX-VC
           * ------------------------------------------------------------------- */
          <div className="flex flex-col overflow-hidden bg-[#313338] font-sans text-[#DBDEE1] h-[640px] lg:h-[680px]">
            {/* Discord Top Channel Bar with Topic Divider */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1F2023] bg-[#313338] px-4 py-2.5 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <Hash className="h-5 w-5 shrink-0 text-[#80848E]" />
                <span className="font-bold text-sm text-white">{discordChannel}</span>
                <span className="hidden sm:inline text-[#3F4147]">|</span>
                <span className="hidden sm:inline truncate text-xs text-[#949BA4]">
                  {discordChannel === 'boys-roblox-vc'
                    ? 'Live Roblox Dress to Impress VC • Boys react to your DMs in real time'
                    : `${stageLabel} with @${selected.name.toLowerCase()}`}
                </span>
              </div>

              <div className="flex lg:hidden items-center gap-1">
                {(['first-dm-vetting', 'after-dark-flirt', 'boys-roblox-vc'] as const).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDiscordChannel(id)}
                    className={`rounded px-2 py-0.5 text-[11px] font-bold cursor-pointer ${
                      discordChannel === id ? 'bg-[#5865F2] text-white' : 'bg-[#2B2D31] text-[#949BA4]'
                    }`}
                  >
                    #{id.split('-')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3"
            >
              {/* Discord Channel Welcome Header */}
              <div className="border-b border-[#3F4147] pb-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#41434A] text-white mb-2">
                  <Hash className="h-7 w-7" />
                </div>
                <div className="text-lg font-extrabold text-white">
                  Welcome to #{discordChannel}!
                </div>
                <p className="text-xs text-[#949BA4]">
                  This is the start of your ongoing conversation with{' '}
                  <strong className="text-white">@{selected.name}</strong> ({stageLabel}).
                </p>
              </div>

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
                    <span className="text-[11px] text-[#949BA4]">Today at 9:41 PM</span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#DBDEE1]">{activePrompt}</p>
                </div>
              </div>

              {turns.map((turn, i) =>
                turn.sender === 'player' ? (
                  <div key={i} className="flex items-start gap-3 rounded-lg px-2 py-1 hover:bg-[#2E3035]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-xs font-bold text-white">
                      YOU
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#57F287]">You</span>
                        <span className="text-[11px] text-[#949BA4]">Today at 9:42 PM</span>
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
                          <span className="text-[11px] text-[#949BA4]">Today at 9:42 PM</span>
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

            {/* Authentic Discord Message Bar + Typing Status */}
            <div className="bg-[#313338] px-4 pb-3 pt-1 space-y-2">
              {typing && (
                <div className="text-[11px] font-semibold text-[#DBDEE1] flex items-center gap-1.5">
                  <span className="inline-flex gap-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" />
                  </span>
                  <span>
                    <strong>{selected.name}</strong> is typing...
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
                  placeholder={`Message ${selected.name} in #${discordChannel}...`}
                  maxLength={280}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-[#80848E] focus:outline-none"
                />
                <div className="hidden sm:flex items-center gap-1">
                  {QUICK_EMOJIS.slice(0, 4).map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => handleAppendEmoji(em)}
                      className="text-sm hover:scale-125 transition cursor-pointer"
                    >
                      {em}
                    </button>
                  ))}
                </div>
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
         * COLUMN 3: SKIN-ADAPTIVE FULL PROFILE DOSSIER (Zero Truncation!)
         * ------------------------------------------------------------------- */}
        <aside
          className={`flex flex-col justify-between border-t lg:border-t-0 lg:border-l p-4 sm:p-5 space-y-4 lg:min-h-[680px] ${
            isDarkDiscord
              ? 'border-[#1F2023] bg-[#232428] text-[#DBDEE1]'
              : isAppleMessages
                ? 'border-[#D1D1D6] bg-[#F2F2F7] text-[#1C1C1E]'
                : 'border-[#E5E7EB] bg-[#FAF8F9] text-[#18101E]'
          }`}
        >
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl border border-black/10 shadow-xs">
              <img
                src={selected.photoUrl}
                alt={selected.name}
                className="h-52 w-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3.5 text-white">
                <div className="flex items-center gap-1.5 font-display text-xl">
                  <span>
                    {selected.name}, {selected.age}
                  </span>
                  <BadgeCheck className="h-4 w-4 fill-[#38BDF8] text-white" />
                </div>
                <div className="text-xs font-semibold text-white/95 leading-snug">
                  {selected.title}
                </div>
              </div>
            </div>

            {/* Complete Vitals Pills */}
            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
              <span
                className={`rounded-full px-2.5 py-0.5 ${
                  isDarkDiscord
                    ? 'bg-[#313338] text-[#DBDEE1]'
                    : 'border border-black/10 bg-white text-[#18101E]'
                }`}
              >
                📏 {selected.height}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 ${
                  isDarkDiscord
                    ? 'bg-[#313338] text-[#DBDEE1]'
                    : 'border border-black/10 bg-white text-[#18101E]'
                }`}
              >
                ✨ {selected.zodiac}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 ${
                  isDarkDiscord
                    ? 'bg-[#5865F2]/25 text-[#DEE0FC]'
                    : 'border border-[#E11D48]/20 bg-[#FFF1F2] text-[#BE123C]'
                }`}
              >
                🍸 {selected.drink}
              </span>
            </div>

            {/* Full Untruncated Bio Card */}
            <div
              className={`rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed ${
                isDarkDiscord
                  ? 'bg-[#111214] text-[#DBDEE1]'
                  : 'border border-black/10 bg-white text-[#18101E]'
              }`}
            >
              <p className="font-bold">{selected.tagline}</p>
              <p className={isDarkDiscord ? 'text-[#B5BAC1]' : 'text-[#475569]'}>{selected.bio}</p>
              <div
                className={`pt-1 text-[11px] font-bold ${
                  isDarkDiscord ? 'text-[#F47FFF]' : 'text-[#BE123C]'
                }`}
              >
                💞 Love Language: {selected.loveLanguage}
              </div>
            </div>

            {/* Live Chemistry & Dynamic Stage Meter */}
            <div
              className={`rounded-2xl p-3.5 space-y-2 ${
                isDarkDiscord
                  ? 'bg-[#111214] text-[#DBDEE1]'
                  : 'border border-black/10 bg-white text-[#18101E]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span>🔥 Chemistry ({stageLabel.split('•')[0].trim()})</span>
                <span className="text-[#FD267A]">{vibePercent}%</span>
              </div>
              <div
                className={`h-2 w-full overflow-hidden rounded-full ${
                  isDarkDiscord ? 'bg-[#2B2D31]' : 'bg-[#F1F5F9]'
                }`}
              >
                <div
                  style={{ width: `${vibePercent}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#FD267A] to-[#F59E0B] transition-all duration-300"
                />
              </div>
              <p className={`text-[11px] font-medium ${isDarkDiscord ? 'text-[#949BA4]' : 'text-[#64748B]'}`}>
                Keep texting dynamically to advance from First DM → Pre-Date → After Date #1 → Going Steady!
              </p>
              {onStartDateWithContact && (
                <button
                  type="button"
                  onClick={() => onStartDateWithContact(selected.id, selected.role)}
                  className="pop-btn mt-1 w-full h-10 rounded-xl bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-xs font-extrabold text-white border-transparent cursor-pointer"
                >
                  💘 Play Full Date Run w/ {selected.name} →
                </button>
              )}
            </div>
          </div>

          {/* Real-Life Red/Green Flag Crowdsourcing Box */}
          <form
            onSubmit={handleSubmitTeaStory}
            className={`rounded-2xl border border-dashed p-3 space-y-2 ${
              isDarkDiscord
                ? 'border-[#3F4147] bg-[#2B2D31]'
                : 'border-[#F59E0B]/45 bg-[#FFFBEB]'
            }`}
          >
            <div
              className={`text-[11px] font-extrabold uppercase tracking-wide ${
                isDarkDiscord ? 'text-[#FEE75C]' : 'text-[#B45309]'
              }`}
            >
              🫖 Spill a Real-Life Texting Red Flag (+3 Cr)
            </div>
            {teaSubmitted ? (
              <p className="text-xs font-bold text-[#10B981]">
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
                  className={`min-w-0 flex-1 rounded-xl border px-2.5 py-1.5 text-xs focus:outline-none ${
                    isDarkDiscord
                      ? 'border-[#1E1F22] bg-[#1E1F22] text-white placeholder:text-[#80848E]'
                      : 'border-black/15 bg-white text-[#18101E] placeholder:text-[#94A3B8]'
                  }`}
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
      </div>
    </section>
  );
};
