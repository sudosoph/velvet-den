import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Award,
  ExternalLink,
  Heart,
  Lock,
  RotateCcw,
  Share2,
  Sparkles,
  Unlock,
  X,
} from 'lucide-react';
import { MONETIZATION_CONFIG } from '../config/monetization';
import {
  EXPRESSION_MOTION_PRESETS,
  type PortraitExpression,
  V35_CAST_VISUALS,
} from '../data/v35AssetManifest';
import { getCastProfileById } from '../data/v35Cast';
import { V35_CHAT_CHAPTERS, V35_DATE_SCRIPTS } from '../data/v35ChatsAndDates';
import { getPersonaVibeSpec, type WalletState } from '../domain/economy';
import {
  AFFILIATE_SUPPORT_COPY,
  buildAffiliateUrl,
  getAffiliateById,
} from '../lib/affiliates';
import { sfx } from '../lib/sound';
import { shareOrCopy } from '../lib/viral';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

export interface RomanticDateStageProps {
  leadId: string;
  dateNumber: 1 | 2 | 3 | 4;
  role: 'her' | 'him';
  wallet: WalletState;
  initialSRankLockedOut?: boolean;
  onCompleteDate: (
    leadId: string,
    dateNumber: number,
    rank: 'S' | 'A' | 'B' | 'F',
    sRankLockedOut: boolean,
  ) => void;
  onLoseHeart: () => void;
  onSpendCredits: (cost: number) => boolean;
  onUnlockPov: (povId: string, cost: number) => boolean;
  onUnlockEpilogue: (epilogueId: string, cost: number) => boolean;
  onRecordConspiracyClue?: (clueId: string) => void;
  onLaunchNextDate?: (nextDateNumber: 1 | 2 | 3 | 4) => void;
  onBackToChats: () => void;
}

export const RomanticDateStage: React.FC<RomanticDateStageProps> = ({
  leadId,
  dateNumber,
  role,
  wallet,
  initialSRankLockedOut = false,
  onCompleteDate,
  onLoseHeart,
  onSpendCredits,
  onUnlockPov,
  onUnlockEpilogue,
  onRecordConspiracyClue,
  onLaunchNextDate,
  onBackToChats,
}) => {
  const profile = getCastProfileById(leadId);
  const scripts = V35_DATE_SCRIPTS[leadId] || [];
  const script = scripts.find((s) => s.dateNumber === dateNumber) ?? scripts[0];
  const visual = V35_CAST_VISUALS[leadId];

  const activeVibeSpec = getPersonaVibeSpec(wallet.personaTag);
  const startingVibeScore = activeVibeSpec?.dateScoreBonus ?? 0;

  const [beatIdx, setBeatIdx] = useState(0);
  const [expression, setExpression] = useState<PortraitExpression>(
    script?.beats[0]?.speakerExpression ?? 'neutral',
  );
  const [score, setScore] = useState(startingVibeScore);
  const [sRankLockedOut, setSRankLockedOut] = useState(initialSRankLockedOut);
  const [disasterHit, setDisasterHit] = useState(false);
  const [sparringToast, setSparringToast] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [povUnlocked, setPovUnlocked] = useState(false);
  const [copiedPolaroid, setCopiedPolaroid] = useState(false);
  const [ritualPicked, setRitualPicked] = useState<{
    id: string;
    note: string;
    delta: number;
  } | null>(null);
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  useEffect(() => {
    const firstExp = script?.beats[0]?.speakerExpression ?? 'neutral';
    setBeatIdx(0);
    setExpression(firstExp);
    setScore(getPersonaVibeSpec(wallet.personaTag)?.dateScoreBonus ?? 0);
    setSRankLockedOut(initialSRankLockedOut);
    setDisasterHit(false);
    setSparringToast(false);
    setLastFeedback(null);
    setLastDelta(null);
    setFinished(false);
    setPovUnlocked(wallet.unlockedPovIds.includes(`${leadId}-date-${dateNumber}`));
    setCopiedPolaroid(false);
    setRitualPicked(null);
    // Intentionally keyed strictly on [leadId, dateNumber] so mid-session wallet/lockout updates never reset finished state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId, dateNumber]);

  if (!profile || !script || !visual) {
    return null;
  }

  const preset = EXPRESSION_MOTION_PRESETS[expression];
  const portraitIdx = Math.min(5, (dateNumber - 1 + beatIdx) % 6);
  const portraitSrc = visual.sixUniquePhotos[portraitIdx] || visual.primaryPortrait;
  const currentBeat = script.beats[beatIdx];

  const prepProducts = (script.prepAffiliateIds || [])
    .map((id) => getAffiliateById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const computeRank = (): 'S' | 'A' | 'B' | 'F' => {
    if (disasterHit) return 'F';
    if (score >= 48 && !sRankLockedOut) return 'S';
    if (score >= 24) return 'A';
    return 'B';
  };

  const handleChoice = (choice: (typeof currentBeat.choices)[number]) => {
    if (choice.cost && choice.cost > 0) {
      const ok = onSpendCredits(choice.cost);
      if (!ok) return;
    }

    setExpression(choice.nextExpression);
    const nextScore = score + choice.chemistryDelta;
    const nextLocked = sRankLockedOut || Boolean(choice.locksOutSRank);
    const nextDisaster = disasterHit || Boolean(choice.triggersDisasterHeartLoss);

    setScore(nextScore);
    setSRankLockedOut(nextLocked);
    setLastFeedback(choice.response);
    setLastDelta(choice.chemistryDelta);

    if (choice.triggersCubSparring) {
      setSparringToast(true);
    }

    if (choice.triggersTurnTablesRevenge) {
      const clueId =
        V35_CHAT_CHAPTERS[leadId]?.cutLooseVerdict.conspiracyClueId || `clue-${leadId}-revenge`;
      onRecordConspiracyClue?.(clueId);
    }

    if (choice.triggersDisasterHeartLoss) {
      sfx.redFlag();
      setDisasterHit(true);
      onLoseHeart();
    } else if (choice.chemistryDelta >= 0) {
      sfx.greenFlag();
    } else {
      sfx.redFlag();
    }

    if (beatIdx + 1 < script.beats.length) {
      setBeatIdx(beatIdx + 1);
    } else {
      const finalRank: 'S' | 'A' | 'B' | 'F' = nextDisaster
        ? 'F'
        : nextScore >= 48 && !nextLocked
          ? 'S'
          : nextScore >= 24
            ? 'A'
            : 'B';
      setFinished(true);
      onCompleteDate(leadId, script.dateNumber, finalRank, nextLocked);
    }
  };

  const handleFreeReplay = () => {
    sfx.messagePop();
    setBeatIdx(0);
    setExpression(script.beats[0]?.speakerExpression ?? 'neutral');
    setScore(startingVibeScore);
    setDisasterHit(false);
    setLastFeedback(null);
    setLastDelta(null);
    setFinished(false);
    setRitualPicked(null);
  };

  const splitDialogueParts = (raw: string): { stageLine: string | null; spokenLine: string } => {
    const cleaned = raw.replace(/\s+xx([.!?"]*$)/gi, '$1').trim();
    const quoteMatch = cleaned.match(/^(.*?[:.,])\s*[“"]([^”"]{10,})[”"]\s*([.!?]?)$/);
    if (quoteMatch) {
      const stagePart = quoteMatch[1].replace(/:\s*$/, '.').trim();
      const spokenPart = quoteMatch[2].trim();
      return {
        stageLine: stagePart.length > 4 ? stagePart : null,
        spokenLine: `“${spokenPart}”`,
      };
    }
    return { stageLine: null, spokenLine: cleaned };
  };

  const parsedBeat = currentBeat ? splitDialogueParts(currentBeat.dialogue) : { stageLine: null, spokenLine: '' };
  const sRankMeterPct = Math.max(8, Math.min(100, Math.round((Math.max(0, score) / 48) * 100)));
  const CHOICE_KEYS = ['A', 'B', 'C'] as const;

  const rank = computeRank();
  const povId = `${leadId}-date-${script.dateNumber}`;
  const isPovUnlocked =
    povUnlocked ||
    Boolean(wallet.isVip || wallet.isFounderUnlimited || wallet.unlockedPovIds.includes(povId));
  const hasDate4Epilogue = scripts.some((s) => s.dateNumber === 4);
  const epilogueId = `${leadId}-epilogue-4`;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 animate-stage-in">
      <div className="sticky top-24 lg:top-16 z-20 -mx-2 px-2 py-2 bg-[#F7F7F8]/95 border-b border-zinc-200/70 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToChats}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Chats</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-600">
          {(wallet.playerName || activeVibeSpec) && (
            <span
              data-testid="date-persona-perk-pill"
              className="rounded-md bg-rose-50 border border-rose-200 px-2.5 py-1 font-bold text-rose-700"
            >
              {activeVibeSpec ? `${activeVibeSpec.emoji} ` : '✨ '}
              {wallet.playerName ? `${wallet.playerName}` : activeVibeSpec?.id ?? 'Guest'}
            </span>
          )}
          <span className="rounded-md bg-white border border-zinc-200 px-2.5 py-1 text-zinc-950">
            Date #{script.dateNumber} with {profile.name}
          </span>
          <span className="rounded-md bg-white border border-zinc-200 px-2.5 py-1">
            {'❤️'.repeat(Math.max(0, wallet.fridayHearts)) || '💔 0 Hearts'}
          </span>
          <button
            type="button"
            aria-label="Close date stage"
            onClick={onBackToChats}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Optional Pre-Date #2 Boutique Touch Strip */}
      {!finished && prepProducts.length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Pre-Date Signature Touch (Optional Partner Picks)
              </span>
              <span className="text-xs font-medium text-zinc-400">Opens on Amazon</span>
            </div>
            <p className="text-[11px] text-zinc-500">{AFFILIATE_SUPPORT_COPY.compactInline}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {prepProducts.map((prod) => (
              <a
                key={prod.id}
                href={buildAffiliateUrl(prod, `date2_prep_${leadId}`)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-2.5 hover:bg-zinc-100 transition-colors"
              >
                <img
                  src={prod.photoUrl}
                  alt={prod.name}
                  className="h-12 w-12 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-950 line-clamp-1">{prod.name}</div>
                  <div className="text-xs font-medium text-rose-600 inline-flex items-center gap-1">
                    <span>{prod.priceDisplay}</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Graphic Visual-Novel Stage + Breathable Split Dialogue Box */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-950 text-white shadow-2xl border border-zinc-800">
        <div className="relative h-80 sm:h-[410px] w-full overflow-hidden">
          <img
            src={script.venueBackdrop}
            alt={script.title}
            className="h-full w-full object-cover animate-ken-burns opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-zinc-950/30" />

          {/* Top Stage HUD: Floating Bestie iOS Notification (Left) + Live S-Rank Chemistry Meter (Right) */}
          {!finished && (
            <div className="absolute inset-x-4 sm:inset-x-6 top-4 flex flex-wrap items-start justify-between gap-2.5 z-10">
              {currentBeat?.bestiePopIn ? (
                <div className="max-w-xs sm:max-w-sm rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-white/15 px-3.5 py-2 text-xs text-zinc-100 shadow-lg animate-vn-dialogue">
                  <span className="font-bold text-rose-400">📱 Bestie Ping • </span>
                  <span>{currentBeat.bestiePopIn}</span>
                </div>
              ) : (
                <span />
              )}

              <div className="ml-auto flex items-center gap-2.5 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-white/15 px-3.5 py-2 shadow-lg">
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Chemistry Meter
                  </div>
                  <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-300 transition-all duration-500"
                      style={{ width: `${sRankMeterPct}%` }}
                    />
                  </div>
                </div>
                {lastDelta !== null && (
                  <span
                    key={`delta-${beatIdx}-${score}`}
                    className={`rounded-lg px-2 py-1 text-xs font-extrabold animate-vn-delta-pop ${
                      lastDelta >= 0
                        ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40'
                        : 'bg-rose-500/25 text-rose-200 border border-rose-400/40'
                    }`}
                  >
                    {lastDelta >= 0 ? `+${lastDelta} ♥` : `${lastDelta}`}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Expressive Animated Character Cutout & Scene Header */}
          <div className="absolute inset-x-5 sm:inset-x-7 bottom-4 flex items-end justify-between gap-4">
            <div className="max-w-md space-y-2 pb-1">
              <div className="text-xs font-bold uppercase tracking-widest text-amber-300/90">
                Date #{script.dateNumber} {!finished ? `Scene ${beatIdx + 1} of ${script.beats.length}` : 'Finale'}
              </div>
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
                {script.title}
              </h1>

              {!finished && beatIdx === 0 && (wallet.playerName || activeVibeSpec) && (
                <div className="inline-block rounded-xl bg-rose-500/20 backdrop-blur-xs border border-rose-300/30 px-3 py-1.5 text-xs font-medium text-rose-100">
                  {wallet.playerName
                    ? `“So glad it’s finally you across the table, ${wallet.playerName},” ${profile.name} smiles warmly.`
                    : `${profile.name} clocks your ${activeVibeSpec?.id} energy right away.`}
                  {activeVibeSpec
                    ? ` (${activeVibeSpec.emoji} +${activeVibeSpec.dateScoreBonus} Signature Vibe Bonus Active!)`
                    : ''}
                </div>
              )}
            </div>

            <div className="relative shrink-0">
              <span
                key={`${expression}-${beatIdx}`}
                className="pointer-events-none absolute -top-5 -right-2 z-20 text-3xl animate-float-particle drop-shadow-md"
              >
                {preset.particle}
              </span>
              <img
                key={`portrait-${portraitIdx}-${expression}`}
                src={portraitSrc}
                alt={profile.name}
                className={`h-44 w-32 sm:h-56 sm:w-42 rounded-2xl object-cover object-top ring-2 shadow-2xl transition-all duration-300 ${preset.tintClass} ${preset.motionClass}`}
              />
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white px-2.5 py-0.5 text-[11px] font-bold text-zinc-950 shadow-md">
                {profile.name} • {preset.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Spacious Visual-Novel Dialogue Box OR Date Rank Summary */}
        <div className="border-t border-white/10 bg-zinc-950 px-5 py-6 sm:px-8 sm:py-7 space-y-5">
          {!finished ? (
            <div key={`beat-box-${beatIdx}`} className="space-y-5 animate-vn-dialogue">
              {/* Step Dots + Optional Previous Turn Reaction Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5">
                  {script.beats.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === beatIdx
                          ? 'w-8 bg-rose-500'
                          : i < beatIdx
                            ? 'w-4 bg-emerald-400'
                            : 'w-4 bg-white/15'
                      }`}
                    />
                  ))}
                </div>
                {sparringToast && (
                  <span className="text-xs font-semibold text-emerald-300">
                    🔔 Handled With Total Poise!
                  </span>
                )}
              </div>

              {lastFeedback && (
                <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/25 px-4 py-3 text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  <Sparkles className="h-4 w-4 shrink-0 text-emerald-300 mt-0.5" />
                  <span>{lastFeedback}</span>
                </div>
              )}

              {/* Split Stage Action + Crisp Character Speech Card */}
              <div className="space-y-3">
                {parsedBeat.stageLine && (
                  <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed pl-3.5 border-l-2 border-amber-300/50">
                    {parsedBeat.stageLine}
                  </p>
                )}

                <div className="relative rounded-2xl border border-white/15 bg-white/[0.06] px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
                  <span className="absolute -top-3 left-4 inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                    {parsedBeat.stageLine ? `${profile.name} Speaks` : `Scene ${beatIdx + 1}`}
                  </span>
                  <p className="text-lg sm:text-xl font-medium leading-relaxed text-white">
                    {parsedBeat.spokenLine}
                  </p>
                </div>
              </div>

              {/* Tactile Table / Hosting / Thermostat Micro-Moment (Florence & Coffee Talk Inspired) */}
              {beatIdx === 0 && (
                <div
                  data-testid="date-table-ritual"
                  className="rounded-2xl border border-white/15 bg-white/[0.04] p-3.5 sm:p-4 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold uppercase tracking-wider text-amber-300">
                      {script.dateNumber === 3
                        ? '❄️ Sleepover Sanctuary Dial (Optional Bonus)'
                        : script.dateNumber === 2
                          ? '🥂 Pour Tonight’s Signature Glass (Optional Bonus)'
                          : '🍸 First-Minute Table Move (Optional Bonus)'}
                    </span>
                    {ritualPicked && (
                      <span className="font-bold text-emerald-300">
                        {ritualPicked.delta >= 0
                          ? `+${ritualPicked.delta} ♥ Applied`
                          : `${ritualPicked.delta} Vibe`}
                      </span>
                    )}
                  </div>

                  {!ritualPicked ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {(script.dateNumber === 3
                        ? [
                            {
                              id: '63f-percale',
                              label: '❄️ Set 63°F + Ice Water',
                              delta: 8,
                              note: `${profile.name} exhales happily: crisp 63°F airflow and ice water on the nightstand is elite sleep care.`,
                            },
                            {
                              id: '67f-duvet',
                              label: '🛏️ 67°F Two-Duvet Truce',
                              delta: 6,
                              note: `Scandinavian two-blanket diplomacy unlocked, zero 3 AM tug-of-war.`,
                            },
                            {
                              id: '75f-sauna',
                              label: '🔥 Leave Heater at 75°F',
                              delta: -4,
                              note: `${profile.name} laughs and cracks a window immediately: "75 degrees?! Are we raising iguanas?"`,
                            },
                          ]
                        : script.dateNumber === 2
                          ? [
                              {
                                id: 'sancerre',
                                label: '🍷 Chilled Sancerre',
                                delta: 6,
                                note: `Two proper stems of crisp Sancerre land smoothly before the first course.`,
                              },
                              {
                                id: 'espresso-martini',
                                label: '🍸 Frothy Espresso Martini',
                                delta: 8,
                                note: `Seven-second hard shake with three coffee beans on top, ${profile.name} grins in approval.`,
                              },
                              {
                                id: 'yuzu-spritz',
                                label: '🌿 Zero-Proof Yuzu Spritz',
                                delta: 6,
                                note: `Bright botanical yuzu over crystal ice, zero 7 AM hangover.`,
                              },
                            ]
                          : [
                              {
                                id: 'phone-pocket',
                                label: '📵 Silence Phone in Jacket',
                                delta: 6,
                                note: `${profile.name} clocks your phone vanishing on silent before water even arrives.`,
                              },
                              {
                                id: 'corner-banquette',
                                label: '🛋️ Take Corner Side-by-Side',
                                delta: 8,
                                note: `Skipping opposite-side interview seating turns the booth electric right away.`,
                              },
                              {
                                id: 'order-decisive',
                                label: '🕯️ Order Without Menu Flashlight',
                                delta: 6,
                                note: `Calm, decisive ordering in dim candlelight sets an effortless pace.`,
                              },
                            ]
                      ).map((ritual) => (
                        <button
                          key={ritual.id}
                          type="button"
                          onClick={() => {
                            if (ritual.delta >= 0) sfx.greenFlag();
                            else sfx.redFlag();
                            setRitualPicked(ritual);
                            setScore((prev) => prev + ritual.delta);
                            setLastDelta(ritual.delta);
                            setExpression(ritual.delta >= 0 ? 'blush' : 'laugh');
                          }}
                          className="rounded-xl border border-white/15 bg-white/[0.05] hover:border-amber-300/60 hover:bg-white/[0.12] px-3 py-2 text-left text-xs font-semibold text-zinc-100 transition cursor-pointer"
                        >
                          {ritual.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-100 leading-snug">{ritualPicked.note}</p>
                  )}
                </div>
              )}

              {/* Spacious Keycap Choice Cards */}
              <div className="grid gap-3 pt-1">
                {currentBeat.choices.map((choice, cIdx) => {
                  const keyBadge = choice.cost ? '💎' : CHOICE_KEYS[cIdx] || String(cIdx + 1);
                  const cleanChoiceLabel = choice.label.replace(/^💎\s*/, '');
                  return (
                    <button
                      key={choice.label}
                      type="button"
                      onClick={() => handleChoice(choice)}
                      className={`group flex w-full items-center justify-between gap-3 rounded-2xl p-4 text-left text-sm sm:text-base font-medium whitespace-normal transition-all duration-150 hover:translate-x-1 cursor-pointer ${
                        choice.cost
                          ? 'border border-amber-300/60 bg-gradient-to-r from-rose-600/20 to-amber-500/15 text-white hover:border-amber-300'
                          : 'border border-white/15 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.1] hover:border-white/35'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold transition-colors ${
                            choice.cost
                              ? 'bg-amber-300 text-zinc-950'
                              : 'bg-white/12 text-white group-hover:bg-rose-600'
                          }`}
                        >
                          {keyBadge}
                        </span>
                        <span className="leading-snug">{cleanChoiceLabel}</span>
                      </div>

                      {choice.cost && !cleanChoiceLabel.includes('Cr)') && (
                        <span className="shrink-0 rounded-md bg-amber-300/20 border border-amber-300/40 px-2 py-0.5 text-[11px] font-bold text-amber-200">
                          Bold Move
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-stage-in">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-rose-400">
                    Date #{script.dateNumber} Complete
                  </div>
                  <h2 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    {rank === 'F'
                      ? '🚩 DATE DISASTER'
                      : rank === 'S'
                        ? '★★★★★ 5-STAR CHEMISTRY'
                        : rank === 'A'
                          ? '★★★★☆ STRONG CHEMISTRY'
                          : '★★★☆☆ WARM FIRST SPARK'}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-300">
                    {rank === 'S'
                      ? `Unblemished slow-burn chemistry with ${profile.name}! Polaroid unlocked in your Dateodex.`
                      : rank === 'F'
                        ? `You ignored the chat red flags and lost 1 Friday Night Heart! Next time hit 🚩 Cut Loose in text.`
                        : sRankLockedOut
                          ? `Rushing Night 1 capped your chemistry below 5-Star, replay free anytime to try the slow-burn route!`
                          : `Warm connection unlocked, replay free anytime if you want 5-Star Chemistry!`}
                  </p>
                </div>

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-600 text-2xl font-extrabold text-white shadow-xl">
                  {rank === 'F' ? '🚩' : rank === 'S' ? '5★' : rank === 'A' ? '4★' : '3★'}
                </div>
              </div>

              {lastFeedback && (
                <p className="text-sm text-zinc-200 leading-relaxed">{lastFeedback}</p>
              )}

              {/* Secret Group-Chat Leak */}
              <div className="rounded-xl border border-white/15 bg-white/5 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                        🔓 Post-Date Group-Chat Leak ({script.secretBestiePovLeak.friendName})
                      </span>
                      <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-200">
                        {isPovUnlocked
                          ? 'Unlocked'
                          : wallet.isVip || wallet.isFounderUnlimited
                            ? 'VIP Included'
                            : 'Bonus Peek'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-300">
                      Read what {profile.name} texted right after leaving the restaurant.
                    </p>
                  </div>

                  {!isPovUnlocked && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onUnlockPov(povId, script.secretBestiePovLeak.cost)) {
                          sfx.greenFlag();
                          setPovUnlocked(true);
                        }
                      }}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 cursor-pointer"
                    >
                      {wallet.isVip ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      <span>Unlock Secret Group-Chat Leak</span>
                    </button>
                  )}
                </div>

                {isPovUnlocked && (
                  <div className="space-y-2 rounded-lg bg-black/40 p-3.5 text-xs sm:text-sm text-emerald-200">
                    {script.secretBestiePovLeak.messages.map((line) => (
                      <div key={line}>💬 {line}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* 6-Month Weekend Epilogue Card */}
              {rank !== 'F' && script.dateNumber === 3 && hasDate4Epilogue && onLaunchNextDate && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        🌙 6-Month Weekend Escape Epilogue
                      </span>
                      <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-200">
                        {wallet.isVip ||
                        wallet.isFounderUnlimited ||
                        wallet.unlockedEpilogueIds.includes(epilogueId)
                          ? 'VIP / Unlocked'
                          : 'Club VIP Bonus'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-200">
                      Fast-forward six months into your private weekend getaway with {profile.name}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onUnlockEpilogue(epilogueId, 3)) {
                        onLaunchNextDate(4);
                      }
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-amber-300 px-4 text-xs font-extrabold text-zinc-950 hover:bg-amber-200 cursor-pointer"
                  >
                    <Award className="h-3.5 w-3.5" />
                    <span>Unlock Weekend Escape Epilogue</span>
                  </button>
                </div>
              )}

              {/* Action Bar: Free Replay, Next Date / Return, Share Polaroid, Support */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleFreeReplay}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Replay Date Free</span>
                  </button>

                  {rank !== 'F' && script.dateNumber < 3 && onLaunchNextDate ? (
                    <button
                      type="button"
                      onClick={() =>
                        onLaunchNextDate((script.dateNumber + 1) as 1 | 2 | 3 | 4)
                      }
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Continue to Date #{script.dateNumber + 1} →</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onBackToChats}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Return to Inbox →</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      const shareTitle =
                        rank === 'F'
                          ? `Date Disaster Receipt with ${profile.name}`
                          : `${rank}-Rank Date with ${profile.name}`;
                      const shareText =
                        rank === 'F'
                          ? `🚩 Survived an F-RANK Date #${script.dateNumber} disaster with ${profile.name} on Cougars & Cubs Club!`
                          : `🐆 Scored ${rank}-RANK on Date #${script.dateNumber} with ${profile.name} (${role === 'her' ? 'Cougar' : 'Cub'} Campaign) on Cougars & Cubs Club!`;
                      const url = 'https://cougarsandcubs.club';
                      await shareOrCopy({
                        title: shareTitle,
                        text: shareText,
                        url,
                      });
                      setCopiedPolaroid(true);
                      setSharePayload({
                        title: shareTitle,
                        message: shareText,
                        url,
                        shareSurface: 'verdict_receipt',
                      });
                    }}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>
                      {copiedPolaroid
                        ? 'Receipt Copied!'
                        : rank === 'F'
                          ? 'Share Disaster Receipt'
                          : 'Share Polaroid'}
                    </span>
                  </button>
                </div>

                <a
                  href={MONETIZATION_CONFIG.tipJarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  <Heart className="h-3.5 w-3.5 text-rose-500" />
                  <span>Support This Project</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </div>
  );
};
