import React, { useState } from 'react';
import { Flame, MessageCircle, Send, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import type { WalletState } from '../domain/economy';
import { HER_ARCHETYPES, HIS_ARCHETYPES } from '../domain/taxonomy';
import { playVoiceNotePreview, sfx } from '../lib/sound';
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
      h.subplotTags.includes('seed_oil_bernedoodle_mommy') || h.subplotTags.includes('qigong_mommy_domme')
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
    quickChips: h.subplotTags.includes('seed_oil_bernedoodle_mommy') || h.subplotTags.includes('qigong_mommy_domme')
      ? [
          'Yes, Mommy—already called the chef to confirm 100% grass-fed ghee/olive-oil & gluten-free prep, plus bought a puppy toy for your tricolor Mini Bernedoodle!',
          'Meet you at 6:30 AM in the bamboo courtyard for Qigong & Tai Chi Cloud Hands—podcast brain muted.',
          'Well actually let me explain why canola oil and wheat are fine from a podcast I heard!!',
        ]
      : [
          'Take all the time you want—honestly a woman who doesn’t rush makes me 10x more excited. I’ll hold Friday at 7:30 at The Cougar Lounge whenever you’re ready.',
          'Booked a corner table at The Cougar Lounge Friday at 7:30—peonies & zero planning on your end.',
          'Well actually let me explain mortgages to you—also whats ur snap??',
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
  const [speakingTurnIdx, setSpeakingTurnIdx] = useState<number | null>(null);
  const stopVoiceRef = React.useRef<(() => void) | null>(null);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1022]/60 p-3 sm:p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Survive Their Inbox — Live AI Texting Mode"
    >
      <div className="vice-panel flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1E1022] bg-[#FFF4F7] px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <MessageCircle className="h-5 w-5 text-[#FF2E63]" />
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-[#1E1022] leading-none">
                Survive Their Inbox • Live AI Texting
              </h2>
              <p className="text-xs font-semibold text-[#5A4664] mt-0.5">
                {!freeTrialUsed
                  ? '🎁 1st live text round FREE • Then 1 Credit/reply (Unlimited for VIP)'
                  : wallet.isVip
                    ? '👑 VIP Black Card: Unlimited Live AI Replies'
                    : `1 Credit per reply • Wallet: ${wallet.credits} Credits`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl border-2 border-[#1E1022] bg-white p-0.5 text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setSteamyMode(false)}
                className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                  !steamyMode ? 'bg-[#FFBE0B] text-[#1E1022]' : 'text-[#1E1022]'
                }`}
              >
                🍸 Date #1 Vet
              </button>
              <button
                type="button"
                onClick={() => setSteamyMode(true)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition cursor-pointer ${
                  steamyMode ? 'bg-[#FF2E63] text-white' : 'text-[#D90452]'
                }`}
              >
                <Flame className="h-3 w-3" />
                <span>Steamy Texts</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="pop-btn rounded-xl bg-white p-2 text-[#1E1022] hover:bg-[#FF2E63] hover:text-white cursor-pointer"
              aria-label="Close Live Inbox"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contact Avatar Strip */}
        <div className="flex gap-2 overflow-x-auto border-b-2 border-[#1E1022]/12 bg-[#FFFDF9] px-4 py-2.5">
          {INBOX_CONTACTS.map((c) => {
            const active = c.id === selected.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c)}
                className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-3 py-1 text-left transition cursor-pointer ${
                  active
                    ? 'border-[#1E1022] bg-[#FFBE0B] text-[#1E1022] shadow-[2px_2px_0px_#1E1022]'
                    : 'border-[#1E1022]/20 bg-white text-[#1E1022] hover:border-[#1E1022]'
                }`}
              >
                <img
                  src={c.photoUrl}
                  alt={c.name}
                  className="h-8 w-8 rounded-full object-cover object-top border border-[#1E1022]"
                />
                <div className="pr-1">
                  <div className="text-xs font-extrabold leading-tight">
                    {c.name}, {c.age}
                  </div>
                  <div className="text-[11px] font-bold text-[#D90452] leading-tight">
                    {c.role === 'her' ? 'Her Inbox' : 'His DM'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#FFF7F0]">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-[#1E1022] bg-white p-3">
            <img
              src={selected.photoUrl}
              alt={selected.name}
              className="h-14 w-14 rounded-2xl object-cover object-top border-2 border-[#1E1022]"
            />
            <div>
              <div className="text-sm font-extrabold text-[#1E1022]">
                {selected.name}, {selected.age} •{' '}
                <span className="text-[#D90452]">{selected.title}</span>
              </div>
              <div className="text-xs font-medium text-[#5A4664]">
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
              className="h-8 w-8 rounded-full object-cover object-top border border-[#1E1022] shrink-0"
            />
            <div className="rounded-2xl rounded-bl-sm border-2 border-[#1E1022] bg-white px-4 py-2.5 text-sm font-semibold text-[#1E1022] shadow-[2px_2px_0px_#1E1022]">
              {activePrompt}
            </div>
          </div>

          {turns.map((turn, i) =>
            turn.sender === 'player' ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm border-2 border-[#1E1022] bg-[#FF2E63] px-4 py-2.5 text-sm font-bold text-white shadow-[2px_2px_0px_#1E1022]">
                  {turn.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-end gap-2.5 max-w-[88%] animate-stage-in">
                <img
                  src={selected.photoUrl}
                  alt={selected.name}
                  className="h-8 w-8 rounded-full object-cover object-top border border-[#1E1022] shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="rounded-2xl rounded-bl-sm border-2 border-[#1E1022] bg-white px-4 py-2.5 text-sm font-semibold text-[#1E1022] shadow-[2px_2px_0px_#1E1022]">
                    {turn.text}
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
                    className="pop-btn inline-flex items-center gap-1.5 rounded-full bg-[#FFBE0B] px-3 py-1 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                  >
                    {speakingTurnIdx === i ? (
                      <>
                        <VolumeX className="h-3.5 w-3.5 text-[#FF2E63]" />
                        <span className="inline-flex items-end gap-0.5 h-3">
                          {[0, 1, 2, 3, 4].map((b) => (
                            <span
                              key={b}
                              style={{ animationDelay: `${b * 85}ms` }}
                              className="animate-waveform-bar w-0.5 h-3 rounded-full bg-[#1E1022]"
                            />
                          ))}
                        </span>
                        <span>Stop Voice Note</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>▶️ Play AI Voice Note</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ),
          )}

          {typing && (
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#D90452] animate-pulse">
              <span>{selected.name} is typing</span>
              <span>•••</span>
            </div>
          )}

          {lastCoach && (
            <div
              className={`rounded-2xl border-2 border-[#1E1022] p-3.5 text-xs font-bold ${
                lastCoach.passed
                  ? 'bg-[#D1FAE5] text-[#065F46]'
                  : 'bg-[#FFE4E6] text-[#9F1239]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-extrabold">
                <span>
                  {lastCoach.passed ? '💚 VIBE CHECK PASSED: ' : '🚩 VIBE CHECK ROASTED: '}
                  {lastCoach.deltas}
                </span>
                <span className="rounded-full border border-[#1E1022] bg-white px-2.5 py-0.5 text-xs text-[#1E1022]">
                  <Sparkles className="inline h-3 w-3 mr-0.5 text-[#FFBE0B]" />
                  {lastCoach.source}
                </span>
              </div>
              <p className="mt-1">{lastCoach.note}</p>
            </div>
          )}
        </div>

        {/* Quick Inspiration Chips + Composer */}
        <div className="border-t-2 border-[#1E1022] bg-white p-3.5 sm:p-4 space-y-2.5">
          <div className="flex flex-wrap gap-1.5 pb-1">
            {activeChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInput(chip)}
                className="rounded-2xl border-2 border-[#1E1022] bg-[#FFFBEB] px-3 py-1.5 text-left text-xs font-bold text-[#1E1022] hover:bg-[#FFBE0B] cursor-pointer"
              >
                💡 {chip}
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
              className="flex-1 rounded-2xl border-2 border-[#1E1022] bg-[#FFF7F0] px-4 py-2.5 text-sm font-bold text-[#1E1022] focus:border-[#FF2E63] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="pop-btn inline-flex items-center gap-1.5 rounded-2xl bg-[#FF2E63] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-50 cursor-pointer"
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
