import React, { useState } from 'react';
import { Flame, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import type { WalletState } from '../domain/economy';
import { HER_ARCHETYPES, HIS_ARCHETYPES } from '../domain/taxonomy';
import { sfx } from '../lib/sound';
import { liveAiInboxService, type LiveInboxTurn } from '../services/adapters';

interface LiveInboxModalProps {
  open: boolean;
  wallet: WalletState;
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

const INBOX_CONTACTS: InboxContact[] = [
  ...HER_ARCHETYPES.map((h) => ({
    id: h.id,
    name: h.name,
    age: h.age,
    title: h.title,
    role: 'her' as const,
    photoUrl: h.photoUrl,
    openingPrompt:
      h.subplotTags.includes('junior_cougar_gap')
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
      h.age >= 50
        ? `Stuck in a meeting still smiling about how unhurried and attentive you were last night... keep the slow-burn tension going before tonight 🔥`
        : h.age >= 40
          ? `Can’t focus on this VP deck after last night—hope you hit bench press today because you’re carrying me straight upstairs at 8 🔥 What’s the plan?`
          : `Still blushing at my desk thinking about last night (right until I panicked realizing you’re my baby sister’s age 😱😂). Keep the spark going—what are you doing to me Friday?`,
    quickChips: [
      'Booked a corner table at The Cougar Lounge Friday at 7:30—peonies & zero planning on your end.',
      'Quick 5-minute call at 6 PM today so I can lock in Friday tapas around your schedule?',
      'hey 😍 ngl u look crazy good for ur age whats ur snap??',
    ],
    steamyChips: [
      'Just crushed 5 sets of 225 on bench specifically so I can carry you straight upstairs at 8—silk robe & dinner handled 🔥',
      'Bringing cast-iron ribeye, cooling bamboo sheets, and my full unhurried attention all night—unlock the door at 7:30.',
      'Wait is your little sister cute too?? 😂🔥',
    ],
  })),
  ...HIS_ARCHETYPES.slice(0, 6).map((c) => ({
    id: c.id,
    name: c.name,
    age: c.age,
    title: c.title,
    role: 'him' as const,
    photoUrl: c.photoUrl,
    openingPrompt:
      c.id === 'kayden-broke-dutch-cub'
        ? `yo ${c.name} here!! down to grab sushi tn if we go dutch lol my campus dining dollars dont work off campus 😅`
        : c.id === 'colton-montana-cowboy-cub'
          ? `Okay busted—I accidentally commented "I love you" from my boys’ shared @MontanaRanchBoyz TikTok before sliding in here 🤠 Let me fly out and take you to dinner Friday?`
          : `Hey ${c.name} here—saw your profile and couldn’t resist saying hi! Would love to take you for espresso martinis Thursday at 7:30 if you’re free?`,
    steamyPrompt: `Just finished bench press & split squats at the gym thinking about last night... tell me what time I’m sweeping you off your feet tonight 🔥`,
    quickChips: [
      'Thursday at 7:30 sounds lovely—bonus points if you survive my 6 AM Saturday ridge hike after.',
      'Only if you confirm you own a real bedframe, never split appetizers to $0.38, and never ask for Snapchat.',
      'Aren’t cubs supposed to let me boss them around? Show up on time.',
    ],
    steamyChips: [
      'Door’s unlocked at 8, silk robe is on, and wallets stay hidden so I don’t shriek at your birth year again 🔥',
      'Save enough strength to flip my pillow to the cold side at 3 AM after round two tonight.',
      'Bring cast-iron ribeye for my low iron first, then carry me upstairs.',
    ],
  })),
];

export const LiveInboxModal: React.FC<LiveInboxModalProps> = ({
  open,
  wallet,
  onClose,
  onSpendCreditOrOpenBoutique,
}) => {
  const [selected, setSelected] = useState<InboxContact>(
    () => INBOX_CONTACTS.find((c) => c.id === 'claire-cougar-exec') ?? INBOX_CONTACTS[0],
  );
  const [steamyMode, setSteamyMode] = useState(false);
  const [turnsByThread, setTurnsByThread] = useState<Record<string, LiveInboxTurn[]>>({});
  const [coachByThread, setCoachByThread] = useState<
    Record<string, { note: string; deltas: string; passed: boolean; source: string }>
  >({});
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [freeTrialUsed, setFreeTrialUsed] = useState(false);

  if (!open) return null;

  const threadKey = `${selected.id}:${steamyMode ? 'steamy' : 'vet'}`;
  const turns = turnsByThread[threadKey] ?? [];
  const lastCoach = coachByThread[threadKey];
  const activePrompt = steamyMode ? selected.steamyPrompt : selected.openingPrompt;
  const activeChips = steamyMode ? selected.steamyChips : selected.quickChips;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || typing) return;

    // First message each session is free; subsequent messages use VIP or 1 Credit
    if (freeTrialUsed && !wallet.isVip) {
      const ok = onSpendCreditOrOpenBoutique();
      if (!ok) return;
    } else {
      setFreeTrialUsed(true);
    }

    sfx.messagePop();
    const nextTurns: LiveInboxTurn[] = [...turns, { sender: 'player', text: trimmed }];
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

    setTurnsByThread((prev) => ({
      ...prev,
      [threadKey]: [...nextTurns, { sender: 'match', text: verdict.herReply }],
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Survive Their Inbox — Live AI Texting Mode"
    >
      <div className="vice-panel flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-[#130a20]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#1c0f2e] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <MessageCircle className="h-5 w-5 text-teal-300" />
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-white leading-none">
                Survive Their Inbox • Live AI Texting
              </h2>
              <p className="text-[11px] text-slate-300">
                {!freeTrialUsed
                  ? '🎁 1st live text round FREE • Then 1 Credit/reply (Unlimited for VIP)'
                  : wallet.isVip
                    ? '👑 VIP Black Card: Unlimited Live AI Replies'
                    : `1 Credit per reply • Wallet: ${wallet.credits} Credits`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* First-Date Vetting vs. Midday Steamy Slow-Burn Toggle */}
            <div className="inline-flex rounded-xl border-2 border-black bg-black/60 p-0.5 text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setSteamyMode(false)}
                className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                  !steamyMode ? 'bg-teal-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                🍸 Date #1 Vet
              </button>
              <button
                type="button"
                onClick={() => setSteamyMode(true)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition cursor-pointer ${
                  steamyMode
                    ? 'bg-gradient-to-r from-rose-500 to-amber-400 text-slate-950'
                    : 'text-pink-300'
                }`}
              >
                <Flame className="h-3 w-3" />
                <span>Steamy Texts</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border-2 border-black bg-slate-800 p-2 text-slate-200 hover:bg-rose-600 cursor-pointer"
              aria-label="Close Live Inbox"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contact Avatar Strip */}
        <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-black/40 px-4 py-2.5">
          {INBOX_CONTACTS.map((c) => {
            const active = c.id === selected.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c)}
                className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-2.5 py-1 text-left transition cursor-pointer ${
                  active
                    ? 'border-amber-400 bg-rose-950/80 text-white'
                    : 'border-black bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <img
                  src={c.photoUrl}
                  alt={c.name}
                  className="h-8 w-8 rounded-full object-cover object-top border border-white/30"
                />
                <div className="pr-1">
                  <div className="text-xs font-extrabold leading-tight">
                    {c.name}, {c.age}
                  </div>
                  <div className="text-[10px] text-amber-300 leading-tight">
                    {c.role === 'her' ? 'Her Inbox' : 'His DM'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-gradient-to-b from-[#130a20] to-[#0d1622]">
          {/* Selected Persona Card */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-3">
            <img
              src={selected.photoUrl}
              alt={selected.name}
              className="h-14 w-14 rounded-2xl object-cover object-top border-2 border-amber-400"
            />
            <div>
              <div className="text-sm font-extrabold text-white">
                {selected.name}, {selected.age} •{' '}
                <span className="text-amber-300">{selected.title}</span>
              </div>
              <div className="text-xs text-slate-300">
                {steamyMode
                  ? '🔥 Midday Slow-Burn Flirt Mode: keep the romance boiling without tripping over birth-year math!'
                  : '🍸 First-DM Vetting Mode: send a real plan—or test a red-flag line to watch her roast it!'}
              </div>
            </div>
          </div>

          {/* Opening Bubble */}
          <div className="flex items-end gap-2.5 max-w-[88%]">
            <img
              src={selected.photoUrl}
              alt={selected.name}
              className="h-8 w-8 rounded-full object-cover object-top border border-white/20 shrink-0"
            />
            <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-[#25153b] px-4 py-2.5 text-sm text-slate-100 shadow">
              {activePrompt}
            </div>
          </div>

          {turns.map((turn, i) =>
            turn.sender === 'player' ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-r from-teal-400 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow">
                  {turn.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-end gap-2.5 max-w-[88%] animate-stage-in">
                <img
                  src={selected.photoUrl}
                  alt={selected.name}
                  className="h-8 w-8 rounded-full object-cover object-top border border-white/20 shrink-0"
                />
                <div className="rounded-2xl rounded-bl-sm border border-pink-400/30 bg-[#2a143d] px-4 py-2.5 text-sm text-white shadow">
                  {turn.text}
                </div>
              </div>
            ),
          )}

          {typing && (
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 animate-pulse">
              <span>{selected.name} is typing</span>
              <span>•••</span>
            </div>
          )}

          {lastCoach && (
            <div
              className={`rounded-2xl border-2 p-3 text-xs ${
                lastCoach.passed
                  ? 'border-emerald-400/60 bg-emerald-950/40 text-emerald-100'
                  : 'border-rose-500/60 bg-rose-950/50 text-rose-100'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-extrabold">
                <span>
                  {lastCoach.passed ? '💚 VIBE CHECK PASSED: ' : '🚩 VIBE CHECK ROASTED: '}
                  {lastCoach.deltas}
                </span>
                <span className="rounded bg-black/40 px-2 py-0.5 text-[10px] text-amber-300">
                  <Sparkles className="inline h-3 w-3 mr-0.5" />
                  {lastCoach.source}
                </span>
              </div>
              <p className="mt-1 opacity-95">{lastCoach.note}</p>
            </div>
          )}
        </div>

        {/* Quick Inspiration Chips + Composer */}
        <div className="border-t border-white/10 bg-[#190d29] p-3 sm:p-4 space-y-2.5">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {activeChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInput(chip)}
                className="shrink-0 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] text-amber-200 hover:bg-black/70 cursor-pointer"
              >
                💡 {chip.length > 52 ? `${chip.slice(0, 52)}…` : chip}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${selected.name}...`}
              maxLength={280}
              className="flex-1 rounded-2xl border-2 border-black bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-black bg-gradient-to-r from-rose-500 to-amber-400 px-5 py-2.5 text-xs font-extrabold uppercase text-slate-950 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
