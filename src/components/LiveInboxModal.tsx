import React, { useState } from 'react';
import {
  ArrowUp,
  Flame,
  Gift,
  Hash,
  MessageCircle,
  Phone,
  Plus,
  Send,
  Smile,
  Sparkles,
  Video,
  Volume2,
  VolumeX,
  Wifi,
  X,
} from 'lucide-react';
import type { WalletState } from '../domain/economy';
import { HER_ARCHETYPES, HIS_ARCHETYPES } from '../domain/taxonomy';
import { playVoiceNotePreview, sfx } from '../lib/sound';
import { liveAiInboxService, type LiveInboxTurn } from '../services/adapters';

export type InboxAppPlatform = 'imessage' | 'discord';

interface LiveInboxModalProps {
  open: boolean;
  wallet: WalletState;
  initialPlatform?: InboxAppPlatform;
  onClose: () => void;
  onSpendCreditOrOpenBoutique: () => boolean;
}

interface InboxContact {
  id: string;
  name: string;
  age: number;
  title: string;
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

const INBOX_CONTACTS: InboxContact[] = [
  ...HER_ARCHETYPES.map((h) => ({
    id: h.id,
    name: h.name,
    age: h.age,
    title: h.title,
    role: 'her' as const,
    photoUrl: h.photoUrl,
    openingPrompt:
      h.subplotTags.includes('seed_oil_bernedoodle_mommy') ||
      h.subplotTags.includes('qigong_mommy_domme')
        ? `🧘‍♀️🥑 Unclench your jaw, sweet boy: I’m strictly gluten-free & seed-oil-free, guide 6:30 AM Qigong, and just moved up to #2 on the tricolor Mini Bernedoodle waitlist. Tell me your Friday dinner plan—and zero Cubsplaining.`
        : h.subplotTags.includes('black_cat_energy')
          ? `🐈‍⬛ Slow down, eager puppy—every guy in my inbox promises the moon on Day 1. I take my time and I’m not easy to impress. Why shouldn’t I make you wait till next week?`
          : h.subplotTags.includes('junior_cougar_gap')
            ? `Quick math check: I’m 38, so a 6-year gap officially makes me a "Junior Cougar." Tell me where you were in 2008—and your actual Friday dinner plan.`
            : h.subplotTags.includes('dog_mom_divorced')
              ? `Fair warning: I’m 37, happily divorced, child-free, and only lowered my age slider because every 42yo man on Hinge rants about his ex. Tell me your Friday plan—and how you’re winning over my rescue pup Barnaby.`
              : h.age < 40
                ? `Hey! My $20/hr sitter is booked for Friday at 7 and I get ONE free night this month. Impress me in two sentences—what’s our plan?`
                : h.age >= 60
                  ? `We matched at the Palm Springs gallery opening. Most men half my age get nervous—tell me how you’d court me this weekend.`
                  : h.subplotTags.includes('princess_treatment')
                    ? `I’ve made 400 executive decisions this week and refuse to plan Friday night. How are you spoiling me?`
                    : `90% of cubs in my DMs open with "hey" or ask for Snapchat. You get one shot—what’s your actual Friday move?`,
    steamyPrompt:
      h.subplotTags.includes('qigong_mommy_domme')
        ? `🧘‍♀️ Still smiling from how fast you melted into Tai Chi Cloud Hands when Mommy fixed your posture this morning... keep that grounded devotion going before cedar sauna tonight 🔥`
        : h.age >= 50
          ? `Stuck in a meeting still smiling about how unhurried and attentive you were last night... keep the slow-burn tension going before tonight 🔥`
          : h.age >= 40
            ? `Can’t focus on this VP deck after last night—hope you hit bench press today because you’re carrying me straight upstairs at 8 🔥 What’s the plan?`
            : `Still blushing at my desk thinking about last night (right until I panicked realizing you’re my baby sister’s age 😱😂). Keep the spark going—what are you doing to me Friday?`,
    quickChips:
      h.subplotTags.includes('seed_oil_bernedoodle_mommy') ||
      h.subplotTags.includes('qigong_mommy_domme')
        ? [
            'Yes, Mommy—already called the chef to confirm 100% grass-fed ghee/olive-oil & gluten-free prep, plus bought a puppy toy for your tricolor Mini Bernedoodle!',
            'Meet you at 6:30 AM in the bamboo courtyard for Qigong & Tai Chi Cloud Hands—podcast brain muted.',
            'Well actually let me explain why canola oil and wheat are fine from a podcast I heard!!',
          ]
        : [
            'Take all the time you want—honestly a woman who doesn’t rush makes me 10x more excited. I’ll hold Friday at 7:30 at The Cougar Lounge whenever you’re ready.',
            'Booked a corner table at The Cougar Lounge Friday at 7:30—peonies & zero planning on your end.',
            'brooo took 2 droppers of pine pollen for testosterone and im all up in my feels rn bc u took an hour to reply what are we doing 😭🌲',
          ],
    steamyChips: h.subplotTags.includes('qigong_mommy_domme')
      ? [
          'Yes, Mommy—drawing your herbal bath, steeping jasmine oolong, and keeping my shoulders relaxed until you say otherwise 🔥',
          'Just finished bench press & Tai Chi stance work so I can carry you straight from the cedar sauna to cooling bamboo sheets at 8.',
          'Wait can Mommy put my gym membership on her AmEx?? 😂',
        ]
      : [
          'Just crushed 5 sets of 225 on bench specifically so I can carry you straight upstairs at 8—silk robe & dinner handled 🔥',
          'Bringing cast-iron ribeye, cooling bamboo sheets, and my full unhurried attention all night—unlock the door at 7:30.',
          'Wait is your little sister cute too?? 😂🔥',
        ],
  })),
  ...HIS_ARCHETYPES.map((c) => ({
    id: c.id,
    name: c.name,
    age: c.age,
    title: c.title,
    role: 'him' as const,
    photoUrl: c.photoUrl,
    openingPrompt:
      c.id === 'kayden-broke-dutch-cub'
        ? `yo ${c.name} here!! down to grab sushi tn if we go dutch lol—or come to my place in Maui next month (technically my parents’ timeshare w/ my mom Linda 😅)`
        : c.id === 'colton-montana-cowboy-cub'
          ? `Okay busted—I accidentally commented "I love you" from my boys’ shared @MontanaRanchBoyz account before sliding in here 🤠 Let me fly out and take you to dinner Friday?`
          : c.id === 'rafael-accented-gentleman-cub'
            ? `Hola—${c.name} here. Packed fresh figs, crusty baguette & espresso for a sunset meadow picnic Friday before retro neon bowling, if you’ll let me court you properly?`
            : `Hey ${c.name} here—saw your profile and couldn’t resist saying hi! Would love to take you for espresso martinis Thursday at 7:30 if you’re free?`,
    steamyPrompt: `Just finished bench press & split squats at the gym thinking about last night... tell me what time Mommy wants me at the door tonight 🔥`,
    quickChips: [
      'Thursday at 7:30 sounds lovely—drop your shoulders, zero Cubsplaining, and bonus points if you survive my 6:30 AM Qigong & ridge hike.',
      'Only if Hawaii isn’t your mom Linda’s timeshare and you never split edamame to $0.38 on Venmo.',
      'Breathe with Mommy, show up at 7:30 sharp in pressed linen, and let me see if you listen.',
    ],
    steamyChips: [
      'Door’s unlocked at 8, silk robe is on, and wallets stay hidden so I don’t shriek at your birth year again 🔥',
      'Save enough strength to flip my pillow to the cold side at 3 AM after round two tonight.',
      'Bring cast-iron ribeye for my low iron first, then carry me upstairs.',
    ],
  })),
];

type DiscordChannelId = 'first-dm-vetting' | 'after-dark-flirt' | 'boys-roblox-vc';

export const LiveInboxModal: React.FC<LiveInboxModalProps> = ({
  open,
  wallet,
  initialPlatform = 'imessage',
  onClose,
  onSpendCreditOrOpenBoutique,
}) => {
  const [platform, setPlatform] = useState<InboxAppPlatform>(initialPlatform);
  const [discordChannel, setDiscordChannel] = useState<DiscordChannelId>('first-dm-vetting');
  const [selected, setSelected] = useState<InboxContact>(
    () => INBOX_CONTACTS.find((c) => c.id === 'claire-cougar-exec') ?? INBOX_CONTACTS[0],
  );
  const [steamyMode, setSteamyMode] = useState(false);
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
  const stopVoiceRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    setPlatform(initialPlatform);
  }, [initialPlatform, open]);

  if (!open) return null;

  const threadKey = `${selected.id}:${steamyMode ? 'steamy' : 'vet'}`;
  const turns = turnsByThread[threadKey] ?? [];
  const lastCoach = coachByThread[threadKey];
  const activePrompt = steamyMode ? selected.steamyPrompt : selected.openingPrompt;
  const activeChips = steamyMode ? selected.steamyChips : selected.quickChips;

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

  const handleCycleTapback = (key: string) => {
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
      return { ...prev, [key]: TAPBACK_OPTIONS[nextIdx] };
    });
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
        ? `${selected.title} (Midday Slow-Burn Romance Flirt Mode)`
        : selected.title,
      personaRole: selected.role,
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
        source: verdict.source === 'workers-ai' ? 'Live AI Engine' : 'Instant Vibe Engine',
      },
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1022]/70 p-2.5 sm:p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Survive Their Inbox — Live AI Texting Mode"
    >
      <div className="vice-panel flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl">
        {/* Top Arcade Control Strip: Switch Between Authentic iMessage & Discord */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b-2 border-[#1E1022] bg-[#FFF4F7] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex rounded-2xl border-2 border-[#1E1022] bg-white p-1 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_#1E1022]">
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

            <div className="hidden md:block">
              <div className="font-display text-base text-[#1E1022] leading-tight">
                Survive Their Inbox
              </div>
              <div className="text-[11px] font-semibold text-[#5A4664]">
                {!freeTrialUsed
                  ? '🎁 1st reply FREE • Tap bubbles for reactions'
                  : wallet.isVip || wallet.isFounderUnlimited
                    ? '👑 VIP Unlimited Replies'
                    : `Wallet: ${wallet.credits} Credits`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
                🍸 Date #1 Vet
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
                <span>Steamy</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="pop-btn h-9 w-9 inline-flex items-center justify-center rounded-xl bg-white text-[#1E1022] hover:bg-[#FF2E63] hover:text-white cursor-pointer"
              aria-label="Close Live Inbox"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contact Picker Strip */}
        <div
          className={`flex gap-2 overflow-x-auto no-scrollbar border-b px-4 py-2 ${
            platform === 'discord'
              ? 'border-[#1F2023] bg-[#1E1F22]'
              : 'border-[#C6C6C8] bg-[#F2F2F7]'
          }`}
        >
          {INBOX_CONTACTS.map((c) => {
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
                className={`flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1 text-left transition cursor-pointer ${
                  platform === 'discord'
                    ? active
                      ? 'border-[#5865F2] bg-[#5865F2] text-white'
                      : 'border-[#3F4147] bg-[#2B2D31] text-[#DBDEE1] hover:bg-[#383A40]'
                    : active
                      ? 'border-[#007AFF] bg-[#007AFF] text-white shadow-sm'
                      : 'border-[#C6C6C8] bg-white text-[#1C1C1E] hover:bg-[#E5E5EA]'
                }`}
              >
                <img
                  src={c.photoUrl}
                  alt={c.name}
                  className="h-7 w-7 rounded-full object-cover object-top"
                />
                <span className="pr-1 text-xs font-bold whitespace-nowrap">
                  {c.name}, {c.age}
                </span>
              </button>
            );
          })}
        </div>

        {/* =====================================================================
         * SKIN A: AUTHENTIC iOS 18 iMESSAGE INTERFACE
         * ===================================================================== */}
        {platform === 'imessage' ? (
          <div className="flex flex-1 flex-col overflow-hidden bg-white font-sans text-[#1C1C1E]">
            {/* iOS Status Bar + Frosted Contact Header */}
            <div className="border-b border-[#C6C6C8] bg-[#F2F2F7]/95 px-4 py-2 backdrop-blur-md">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#1C1C1E]/80 pb-1">
                <span>9:41</span>
                <span className="h-3.5 w-20 rounded-full bg-black" />
                <span className="inline-flex items-center gap-1.5">
                  <Wifi className="h-3 w-3" />
                  <span>5G</span>
                  <span className="inline-block h-2.5 w-5 rounded-xs border border-[#1C1C1E] p-0.5">
                    <span className="block h-full w-full bg-[#34C759]" />
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-0.5 text-sm font-medium text-[#007AFF] cursor-pointer"
                >
                  <span>‹</span>
                  <span className="rounded-full bg-[#007AFF] px-1.5 py-0.2 text-[11px] font-bold text-white">
                    12
                  </span>
                </button>

                <div className="flex flex-col items-center">
                  <img
                    src={selected.photoUrl}
                    alt={selected.name}
                    className="h-10 w-10 rounded-full object-cover object-top shadow-xs"
                  />
                  <div className="mt-0.5 text-xs font-bold text-[#1C1C1E]">
                    {selected.name}, {selected.age} <span className="text-[#8E8E93]">›</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#007AFF]">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.crystalClink();
                      setCallBanner(
                        `📹 FaceTime Video: ${selected.name} smiled over her wine glass—"Bold move calling! Text me our 7:30 spot below."`,
                      );
                    }}
                    title="Test FaceTime Vibe Check"
                    className="rounded-full p-1 hover:bg-black/5 cursor-pointer"
                  >
                    <Video className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.crystalClink();
                      setCallBanner(
                        `📞 6:00 PM Phone Call: ${selected.name} respects a caller who skips endless "wyd" texts!`,
                      );
                    }}
                    title="Test 6 PM Phone Call"
                    className="rounded-full p-1 hover:bg-black/5 cursor-pointer"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* iMessage Scrollable Bubble Thread */}
            <div className="flex-1 overflow-y-auto bg-white p-4 sm:px-6 space-y-3">
              <div className="text-center space-y-0.5">
                <div className="text-[11px] font-medium text-[#8E8E93]">iMessage</div>
                <div className="text-[11px] font-semibold text-[#8E8E93]">
                  Today 7:42 PM • {selected.title}
                </div>
              </div>

              {callBanner && (
                <div className="mx-auto max-w-md rounded-2xl border border-[#C6C6C8] bg-[#F2F2F7] px-3.5 py-2 text-center text-xs font-semibold text-[#1C1C1E]">
                  {callBanner}
                </div>
              )}

              {/* Opening Incoming Gray iMessage Bubble */}
              <div className="flex items-end gap-2 max-w-[86%]">
                <img
                  src={selected.photoUrl}
                  alt={selected.name}
                  className="h-7 w-7 rounded-full object-cover object-top shrink-0"
                />
                <button
                  type="button"
                  onClick={() => handleCycleTapback(`${threadKey}:open`)}
                  title="Tap bubble to add iOS Tapback"
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

              {/* Conversation Turns */}
              {turns.map((turn, i) =>
                turn.sender === 'player' ? (
                  <div key={i} className="flex flex-col items-end">
                    <button
                      type="button"
                      onClick={() => handleCycleTapback(`${threadKey}:${i}`)}
                      className={`relative max-w-[82%] rounded-[20px] rounded-br-[4px] px-4 py-2.5 text-left text-[15px] leading-snug text-white shadow-xs cursor-pointer ${
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
                        onClick={() => handleCycleTapback(`${threadKey}:${i}`)}
                        className="relative block rounded-[20px] rounded-bl-[4px] bg-[#E9E9EB] px-4 py-2.5 text-left text-[15px] leading-snug text-[#1C1C1E] cursor-pointer"
                      >
                        {tapbacks[`${threadKey}:${i}`] && (
                          <span className="absolute -top-2.5 -right-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#007AFF] px-1.5 text-xs text-white shadow">
                            {tapbacks[`${threadKey}:${i}`]}
                          </span>
                        )}
                        {turn.text}
                      </button>

                      {/* Authentic iOS Audio Voice-Note Pill */}
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
                        className={`inline-flex h-8 items-center gap-2 rounded-full px-3 text-xs font-semibold transition cursor-pointer ${
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
                        <span className="inline-flex items-center gap-0.5 h-3">
                          {[4, 9, 6, 11, 7, 12, 5, 8].map((barH, b) => (
                            <span
                              key={b}
                              style={{ height: `${barH}px` }}
                              className={`w-0.5 rounded-full ${
                                speakingTurnIdx === i ? 'bg-white animate-pulse' : 'bg-[#007AFF]'
                              }`}
                            />
                          ))}
                        </span>
                        <span>{speakingTurnIdx === i ? 'Stop Audio' : 'Play Voice Note (0:07)'}</span>
                      </button>
                    </div>
                  </div>
                ),
              )}

              {/* Authentic iOS 3-Dot Typing Bubble */}
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

              {/* iOS Notification Style Vibe-Check Banner */}
              {lastCoach && (
                <div
                  className={`rounded-2xl border p-3.5 text-xs shadow-sm ${
                    lastCoach.passed
                      ? 'border-[#34C759] bg-[#EAFBF0] text-[#065F46]'
                      : 'border-[#FF3B30] bg-[#FFF0EF] text-[#9F1239]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
                    <span>
                      {lastCoach.passed ? '💚 VIBE CHECK PASSED: ' : '🚩 VIBE CHECK ROASTED: '}
                      {lastCoach.deltas}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#1C1C1E] shadow-2xs">
                      <Sparkles className="inline h-3 w-3 mr-0.5 text-[#FFBE0B]" />
                      {lastCoach.source}
                    </span>
                  </div>
                  <p className="mt-1 font-medium">{lastCoach.note}</p>
                </div>
              )}
            </div>

            {/* iOS QuickType Suggestion Chips + Authentic iMessage Input Bar */}
            <div className="border-t border-[#C6C6C8] bg-[#F2F2F7] px-3.5 py-2.5 space-y-2">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {activeChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInput(chip)}
                    className="shrink-0 max-w-xs truncate rounded-full border border-[#C6C6C8] bg-white px-3 py-1 text-xs font-medium text-[#1C1C1E] hover:border-[#007AFF] hover:text-[#007AFF] cursor-pointer"
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
                  title="Autofill top green-flag opener"
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
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-white disabled:bg-[#C7C7CC] cursor-pointer transition"
                  >
                    <ArrowUp className="h-4 w-4 stroke-[2.75]" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* =====================================================================
           * SKIN B: AUTHENTIC DISCORD SERVER & GROUP-CHAT INTERFACE
           * ===================================================================== */
          <div className="grid flex-1 overflow-hidden bg-[#313338] font-sans text-[#DBDEE1] sm:grid-cols-[210px_1fr]">
            {/* Left Discord Channel Sidebar */}
            <aside className="hidden sm:flex flex-col justify-between border-r border-[#1F2023] bg-[#2B2D31]">
              <div>
                <div className="border-b border-[#1F2023] px-3.5 py-3 text-sm font-bold text-white flex items-center justify-between">
                  <span>🐆 Cougars &amp; Cubs</span>
                  <span className="rounded bg-[#5865F2] px-1.5 py-0.5 text-[10px]">LVL 3</span>
                </div>

                <div className="p-2 space-y-1">
                  <div className="px-2 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#949BA4]">
                    Text Channels
                  </div>
                  {(
                    [
                      ['first-dm-vetting', 'first-dm-vetting', false],
                      ['after-dark-flirt', 'after-dark-flirt', true],
                      ['boys-roblox-vc', 'boys-roblox-vc', false],
                    ] as const
                  ).map(([id, label, isSteamy]) => {
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
                        className={`w-full flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-semibold transition cursor-pointer ${
                          active
                            ? 'bg-[#404249] text-white'
                            : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                        }`}
                      >
                        <Hash className="h-4 w-4 shrink-0 text-[#80848E]" />
                        <span className="truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Discord User Status Bar */}
              <div className="bg-[#232428] px-3 py-2.5 flex items-center gap-2">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#5865F2] text-xs font-bold text-white">
                  YOU
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#232428] bg-[#23A55A]" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-white">You</div>
                  <div className="truncate text-[10px] text-[#949BA4]">🟢 Online • #0001</div>
                </div>
              </div>
            </aside>

            {/* Right Main Discord Chat Pane */}
            <div className="flex flex-col overflow-hidden bg-[#313338]">
              {/* Channel Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1F2023] bg-[#313338] px-4 py-2.5">
                <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                  <Hash className="h-4 w-4 text-[#80848E]" />
                  <span>{discordChannel}</span>
                  <span className="hidden md:inline text-xs font-normal text-[#949BA4] ml-2">
                    {discordChannel === 'boys-roblox-vc'
                      ? '🎮 Boys’ Roblox DTI Voice Lobby • Live Group Reactions ON'
                      : `Chatting with @${selected.name} (${selected.age})`}
                  </span>
                </div>

                {/* Mobile channel pill switcher */}
                <button
                  type="button"
                  onClick={() =>
                    setDiscordChannel((c) =>
                      c === 'boys-roblox-vc' ? 'first-dm-vetting' : 'boys-roblox-vc',
                    )
                  }
                  className="sm:hidden rounded bg-[#5865F2]/25 px-2 py-0.5 text-[11px] font-bold text-[#DEE0FC] cursor-pointer"
                >
                  {discordChannel === 'boys-roblox-vc' ? '1-on-1 DM' : '+ Boys’ VC'}
                </button>
              </div>

              {/* Discord Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Match Opening Message */}
                <div className="flex items-start gap-3 rounded-lg px-2 py-1 hover:bg-[#2E3035]">
                  <div className="relative shrink-0">
                    <img
                      src={selected.photoUrl}
                      alt={selected.name}
                      className="h-10 w-10 rounded-full object-cover object-top"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#313338] bg-[#23A55A]" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
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

                {/* Dynamic Turns */}
                {turns.map((turn, i) =>
                  turn.sender === 'player' ? (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg px-2 py-1 hover:bg-[#2E3035]"
                    >
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
                          <div className="flex flex-wrap items-center gap-1.5">
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

                          {/* Discord Voice Note + Emoji Reaction Bar */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
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
                              className="inline-flex h-7 items-center gap-1.5 rounded border border-[#4E5058] bg-[#2B2D31] px-2.5 text-xs font-semibold text-[#DBDEE1] hover:bg-[#383A40] cursor-pointer"
                            >
                              <Volume2 className="h-3.5 w-3.5 text-[#5865F2]" />
                              <span>{speakingTurnIdx === i ? 'Stop Audio' : 'Voice Note'}</span>
                            </button>

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

                      {/* Boys' Roblox Group-Chat Side Commentary */}
                      {discordChannel === 'boys-roblox-vc' && turn.buddy && (
                        <div className="flex items-start gap-3 rounded-lg bg-[#2B2D31]/60 px-2.5 py-1.5 animate-stage-in">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E1F22] text-sm">
                            🎮
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="text-xs font-bold"
                                style={{ color: turn.buddy.color }}
                              >
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

                {typing && (
                  <div className="px-2 text-xs font-semibold text-[#B5BAC1] animate-pulse">
                    💬 <strong>{selected.name}</strong> is typing…
                  </div>
                )}

                {/* Authentic Discord Bot Embed for Vibe Referee */}
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

              {/* Quick Chips + Authentic Discord Input Bar */}
              <div className="bg-[#313338] px-4 pb-3.5 pt-1 space-y-2">
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {activeChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInput(chip)}
                      className="shrink-0 max-w-xs truncate rounded-md border border-[#3F4147] bg-[#2B2D31] px-2.5 py-1 text-xs font-medium text-[#DBDEE1] hover:border-[#5865F2] hover:text-white cursor-pointer"
                      title={chip}
                    >
                      💡 {chip}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-2 rounded-xl bg-[#383A40] px-3 py-2"
                >
                  <button
                    type="button"
                    onClick={() => setInput(activeChips[0] ?? '')}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B5BAC1] text-[#313338] hover:bg-white cursor-pointer"
                    title="Autofill opener"
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                  </button>

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Message ${selected.name} in #${discordChannel}...`}
                    maxLength={280}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-[#80848E] focus:outline-none"
                  />

                  <Gift className="hidden sm:block h-4 w-4 text-[#B5BAC1]" />
                  <Smile className="hidden sm:block h-4 w-4 text-[#B5BAC1]" />

                  <button
                    type="submit"
                    aria-label="Send"
                    disabled={!input.trim() || typing}
                    className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] px-3 text-xs font-bold text-white disabled:opacity-40 cursor-pointer transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
