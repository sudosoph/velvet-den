import React, { useState } from 'react';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
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
  quickChips: string[];
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
      h.age < 40
        ? `Hey! My $20/hr sitter is booked for Friday at 7 and I get ONE free night this month. Impress me in two sentences—what’s our plan?`
        : h.age >= 60
          ? `We matched at the Palm Springs gallery opening. Most men half my age get nervous—tell me how you’d court me this weekend.`
          : h.subplotTags.includes('princess_treatment')
            ? `I’ve made 400 executive decisions this week and refuse to plan Friday night. How are you spoiling me?`
            : `90% of cubs in my DMs open with "hey" or ask for Snapchat. You get one shot—what’s your actual Friday move?`,
    quickChips: [
      'Booked a corner table at The Velvet Wine Bar Friday at 7:30—peonies & zero planning on your end.',
      'Quick 5-minute call at 6 PM today so I can lock in Friday tapas around your schedule?',
      'hey 😍 ngl u look crazy good for ur age whats ur snap??',
    ],
  })),
  ...HIS_ARCHETYPES.slice(0, 2).map((c) => ({
    id: c.id,
    name: c.name,
    age: c.age,
    title: c.title,
    role: 'him' as const,
    photoUrl: c.photoUrl,
    openingPrompt: `Hey ${c.name} here—saw your profile and couldn’t resist saying hi! Would love to take you for espresso martinis Thursday at 7:30 if you’re free?`,
    quickChips: [
      'Thursday at 7:30 sounds lovely—bonus points if you survive my 6 AM Saturday ridge hike after.',
      'Only if you confirm you own a real bedframe and never ask me for Snapchat.',
      'Aren’t cubs supposed to let me boss them around? Show up on time.',
    ],
  })),
];

export const LiveInboxModal: React.FC<LiveInboxModalProps> = ({
  open,
  wallet,
  onClose,
  onSpendCreditOrOpenBoutique,
}) => {
  const [selected, setSelected] = useState<InboxContact>(INBOX_CONTACTS[0]);
  const [turnsByContact, setTurnsByContact] = useState<Record<string, LiveInboxTurn[]>>({});
  const [coachByContact, setCoachByContact] = useState<
    Record<string, { note: string; deltas: string; passed: boolean; source: string }>
  >({});
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [freeTrialUsed, setFreeTrialUsed] = useState(false);

  if (!open) return null;

  const turns = turnsByContact[selected.id] ?? [];
  const lastCoach = coachByContact[selected.id];

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
    setTurnsByContact((prev) => ({ ...prev, [selected.id]: nextTurns }));
    setInput('');
    setTyping(true);

    const verdict = await liveAiInboxService.evaluateOpeningDm({
      personaId: selected.id,
      personaName: selected.name,
      personaAge: selected.age,
      personaTitle: selected.title,
      personaRole: selected.role,
      playerMessage: trimmed,
      history: nextTurns,
    });

    setTyping(false);
    if (verdict.passedVibeCheck) {
      sfx.greenFlag();
    } else {
      sfx.redFlag();
    }

    setTurnsByContact((prev) => ({
      ...prev,
      [selected.id]: [...nextTurns, { sender: 'match', text: verdict.herReply }],
    }));

    const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
    setCoachByContact((prev) => ({
      ...prev,
      [selected.id]: {
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
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#1c0f2e] px-4 py-3 sm:px-6">
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
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border-2 border-black bg-slate-800 p-2 text-slate-200 hover:bg-rose-600 cursor-pointer"
            aria-label="Close Live Inbox"
          >
            <X className="h-4 w-4" />
          </button>
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
                Type your real response—or test a red-flag line to watch her roast it!
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
              {selected.openingPrompt}
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
            {selected.quickChips.map((chip, idx) => (
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
