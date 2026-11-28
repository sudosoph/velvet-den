import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Radio,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import { V35_CAST_VISUALS } from '../data/v35AssetManifest';
import { getCastProfileById } from '../data/v35Cast';
import {
  getWildApproachabilityRead,
  getWildFollowUpSequence,
  getWildRoomClues,
  V35_WILD_VENUES,
  type WildChoiceOption,
  type WildVenueSpot,
} from '../data/v35WildVenues';
import { awardPassportBonusXp, emitXpBurst } from '../lib/gamification';
import { emitOrganicBingoUnlock } from '../lib/organicInterspersion';
import { sfx } from '../lib/sound';
import { CelebrationBurstCanvas } from './CelebrationBurstCanvas';
import { CrowdsourceSubmissionBar } from './CrowdsourceSubmissionBar';
import { Badge } from './ui/primitives';

function getDeterministicWildOrder(seed: string): [number, number, number] {
  const perms: [number, number, number][] = [
    [2, 0, 1],
    [0, 2, 1],
    [1, 2, 0],
    [2, 1, 0],
    [1, 0, 2],
    [0, 1, 2],
  ];
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return perms[(h >>> 0) % perms.length];
}

export interface InTheWildMapViewProps {
  role: 'her' | 'him';
  activeLeadThreads: string[];
  completedCameoVenues: string[];
  completedWildVenues?: string[];
  initialVenueId?: string;
  onUnlockWildLead: (
    leadId: string,
    venueId: string,
    bonus: number,
    clueId?: string,
  ) => void;
  onCompleteCameo: (venueId: string, leadId: string, bonus: number) => void;
  onLoseHeart?: () => void;
  onOpenChatWithLead?: (leadId: string) => void;
  onOpenGuideSlug?: (slug: string) => void;
  onClearInitialVenue?: () => void;
}

interface TurnPopBannerState {
  tone: 'win' | 'jackpot' | 'brushoff' | 'crash';
  badge: string;
  headline: string;
  detail: string;
}

const CHOICE_KEYS = ['A', 'B', 'C'] as const;

export const InTheWildMapView: React.FC<InTheWildMapViewProps> = ({
  role,
  activeLeadThreads,
  completedCameoVenues,
  completedWildVenues = [],
  initialVenueId,
  onUnlockWildLead,
  onCompleteCameo,
  onLoseHeart,
  onOpenChatWithLead,
  onOpenGuideSlug,
  onClearInitialVenue,
}) => {
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(initialVenueId ?? null);
  const [localClearedSpotIds, setLocalClearedSpotIds] = useState<string[]>([]);
  const [beatStage, setBeatStage] = useState<1 | 2 | 3>(1);
  const [revealedClueIndices, setRevealedClueIndices] = useState<number[]>([]);
  const [sparkPenalty, setSparkPenalty] = useState(0);
  const [celebrationBurstKey, setCelebrationBurstKey] = useState(0);
  const [turnPopBanner, setTurnPopBanner] = useState<TurnPopBannerState | null>(null);
  const [pendingApproach, setPendingApproach] = useState<{
    leadId: string;
    accumulatedBonus: number;
    clueId?: string;
    lastReplyCue?: string;
  } | null>(null);
  const [outcomeCard, setOutcomeCard] = useState<{
    text: string;
    delta: number;
    unlockedLeadId?: string;
    wasReplay?: boolean;
    isMemeFail?: boolean;
    isPoliteBrushOff?: boolean;
  } | null>(null);

  useEffect(() => {
    setSelectedSpotId(initialVenueId ?? null);
    setBeatStage(1);
    setRevealedClueIndices([]);
    setSparkPenalty(0);
    setTurnPopBanner(null);
    setPendingApproach(null);
    setOutcomeCard(null);
  }, [initialVenueId]);

  const clearedSet = new Set([...completedWildVenues, ...localClearedSpotIds]);
  const clearedCount = V35_WILD_VENUES.filter((v) => clearedSet.has(v.id)).length;

  const openSpot = (spotId: string) => {
    setSelectedSpotId(spotId);
    setBeatStage(1);
    setRevealedClueIndices([]);
    setSparkPenalty(0);
    setTurnPopBanner(null);
    setPendingApproach(null);
    setOutcomeCard(null);
  };

  const resetSpot = () => {
    setSelectedSpotId(null);
    setBeatStage(1);
    setRevealedClueIndices([]);
    setSparkPenalty(0);
    setTurnPopBanner(null);
    setPendingApproach(null);
    setOutcomeCard(null);
    onClearInitialVenue?.();
  };

  const activeSpot: WildVenueSpot | undefined = V35_WILD_VENUES.find(
    (s) => s.id === selectedSpotId,
  );

  if (activeSpot) {
    const primaryLeadId =
      role === 'her' ? activeSpot.primaryHerLeadId : activeSpot.primaryHimLeadId;
    const secondaryProfile = activeSpot.secondaryCameoLeadId
      ? getCastProfileById(activeSpot.secondaryCameoLeadId)
      : undefined;
    const matchedSecondaryId =
      secondaryProfile &&
      secondaryProfile.role !== role &&
      activeSpot.secondaryCameoLeadId &&
      activeLeadThreads.includes(activeSpot.secondaryCameoLeadId)
        ? activeSpot.secondaryCameoLeadId
        : undefined;
    const matchedTargetLeadId = activeLeadThreads.includes(primaryLeadId)
      ? primaryLeadId
      : matchedSecondaryId;
    const isPrimaryAlreadyMatched = activeLeadThreads.includes(primaryLeadId);
    const cameoDone = completedCameoVenues.includes(activeSpot.id);
    const cameoSpeaker = getCastProfileById(activeSpot.cameoBeat.speakerId);
    const primaryProfile = getCastProfileById(primaryLeadId);
    const primaryPortrait = V35_CAST_VISUALS[primaryLeadId]?.primaryPortrait;
    const choices = role === 'her' ? activeSpot.choicesHer : activeSpot.choicesHim;
    const roomClues = getWildRoomClues(activeSpot.id, role);
    const approachRead = getWildApproachabilityRead(activeSpot.id, role);
    const allSignalsDecoded = revealedClueIndices.length >= 3;
    const setupText = role === 'her' ? activeSpot.sceneSetupHer : activeSpot.sceneSetupHim;
    const spokenCue = role === 'her' ? activeSpot.spokenCueHer : activeSpot.spokenCueHim;
    const followUpSeq = getWildFollowUpSequence(
      activeSpot.id,
      role,
      primaryProfile?.name ?? 'Your Match',
      primaryProfile?.tier === 'trap',
    );
    const activeFollowStep =
      beatStage === 2 ? followUpSeq.beat2 : beatStage === 3 ? followUpSeq.beat3 : null;
    const beat1Order =
      choices.length === 3 ? getDeterministicWildOrder(`${activeSpot.id}:${role}:b1`) : [0, 1, 2];
    const followOrder =
      activeFollowStep && activeFollowStep.choices.length === 3
        ? getDeterministicWildOrder(`${activeSpot.id}:${role}:b${beatStage}`)
        : [0, 1, 2];
    const firstPassOrigIdx = activeFollowStep
      ? activeFollowStep.choices.findIndex(
          (c) => !c.isMemeFail && !c.isPoliteBrushOff,
        )
      : 0;
    const baseStagePct = beatStage === 1 ? 15 : beatStage === 2 ? 52 : 84;
    const signalPct = outcomeCard?.unlockedLeadId
      ? 100
      : outcomeCard?.isMemeFail
        ? 8
        : outcomeCard?.isPoliteBrushOff
          ? Math.max(12, baseStagePct - 14)
          : Math.max(15, baseStagePct - sparkPenalty);

    const nextSpot =
      V35_WILD_VENUES.find((v) => v.id !== activeSpot.id && !clearedSet.has(v.id)) ??
      V35_WILD_VENUES[
        (V35_WILD_VENUES.findIndex((v) => v.id === activeSpot.id) + 1) % V35_WILD_VENUES.length
      ];

    const handleBeat1Pick = (choice: WildChoiceOption, origIdx: number) => {
      if (choice.isMemeFail) {
        sfx.redFlag();
        onLoseHeart?.();
        setTurnPopBanner({
          tone: 'crash',
          badge: '💥 SHOT DOWN • -1 HEART',
          headline: 'Major IRL Ick! You Lost 1 Friday Heart',
          detail: 'Read the 3 Room Signals first so you spot headphone, timing, and age-cliché traps.',
        });
        setOutcomeCard({
          text: choice.outcomeText,
          delta: choice.chemistryBonus,
          isMemeFail: true,
        });
        return;
      }

      // Secondary Beat-1 approach (origIdx === 1 with unlocksChatWithId) requires 3/3 Room Signals scanned!
      if (origIdx === 1 && choice.unlocksChatWithId && !allSignalsDecoded) {
        sfx.redFlag();
        setSparkPenalty((p) => Math.min(10, p + 4));
        setTurnPopBanner({
          tone: 'brushoff',
          badge: '⚠️ BLIND APPROACH • -6% SPARK',
          headline: 'Too Risky Without Reading Her Signals First!',
          detail:
            'Tap all 3 Micro-Signals in the Room Scanner above (+5 XP) to verify availability before trying a cheeky side-door opener, or pick the sharpest calibrated move.',
        });
        setOutcomeCard({
          text: 'You walked in cold before checking left-hand, watch-curfew, and body-language signals, earning a polite two-second smile before they turned away.',
          delta: -6,
          isPoliteBrushOff: true,
        });
        return;
      }

      sfx.greenFlag();
      if (!choice.unlocksChatWithId) {
        emitXpBurst(20, 'Discernment Clue Logged!', '🕵️ +20 XP');
        setLocalClearedSpotIds((prev) =>
          prev.includes(activeSpot.id) ? prev : [...prev, activeSpot.id],
        );
        setTurnPopBanner({
          tone: 'win',
          badge: '🕵️ TRAP SPOTTED • +20 XP',
          headline: 'Sharp Discernment! Conspiracy Receipt Pocketed',
          detail: 'You clocked the Table 9 / curfew red flag without wasting an evening.',
        });
        setOutcomeCard({
          text: choice.outcomeText,
          delta: choice.chemistryBonus,
        });
        return;
      }

      emitXpBurst(15, 'Signal Locked! +15 XP', '🎯 52% SPARK');
      setTurnPopBanner({
        tone: 'win',
        badge: '🎯 GREEN LIGHT • +15 XP',
        headline: 'Clean Opener! Spark Jumped 15% → 52%',
        detail: 'Now Beat 2 gets harder: only 1 of 3 choices reads their real age-gap intent accurately!',
      });
      setPendingApproach({
        leadId: choice.unlocksChatWithId,
        accumulatedBonus: Math.max(8, choice.chemistryBonus - sparkPenalty),
        clueId: choice.conspiracyClueId,
        lastReplyCue: choice.outcomeText,
      });
      setBeatStage(2);
    };

    const handleFollowStepPick = (idx: number) => {
      if (!activeFollowStep || !pendingApproach) return;
      const picked = activeFollowStep.choices[idx];
      if (!picked) return;

      if (picked.isMemeFail) {
        sfx.redFlag();
        onLoseHeart?.();
        setTurnPopBanner({
          tone: 'crash',
          badge: '💥 SHOT DOWN • -1 HEART',
          headline: 'Crashed Out at the Finish Line! (-1 Friday Heart)',
          detail: picked.failText,
        });
        setOutcomeCard({
          text: picked.failText,
          delta: -12,
          isMemeFail: true,
        });
        return;
      }

      if (picked.isPoliteBrushOff) {
        sfx.redFlag();
        setSparkPenalty((p) => Math.min(12, p + 6));
        setTurnPopBanner({
          tone: 'brushoff',
          badge: '⚠️ POLITE BRUSH-OFF • -6% SPARK',
          headline: 'Subtle Misread! They Politely Stepped Back',
          detail: picked.brushOffText,
        });
        setOutcomeCard({
          text: picked.brushOffText,
          delta: -6,
          isPoliteBrushOff: true,
        });
        return;
      }

      if (beatStage === 2) {
        sfx.greenFlag();
        emitXpBurst(15, 'Intent Decoded! +15 XP', '🔥 84% SPARK');
        setTurnPopBanner({
          tone: 'win',
          badge: '🔥 INTENT CONFIRMED • +15 XP',
          headline: 'Mutual Age-Gap Chemistry Verified! Spark 52% → 84%',
          detail:
            'Final test (Beat 3): close the real phone number in 30 seconds without hovering or asking for Instagram!',
        });
        setPendingApproach({
          ...pendingApproach,
          accumulatedBonus: pendingApproach.accumulatedBonus,
          lastReplyCue: picked.replyCue,
        });
        setBeatStage(3);
        return;
      }

      // Beat 3 cleared -> Number Pulled + Confetti Burst!
      sfx.victoryFanfare();
      setCelebrationBurstKey((k) => k + 1);
      const wasAlreadyInThreads = activeLeadThreads.includes(pendingApproach.leadId);
      const finalBonus = Math.max(8, pendingApproach.accumulatedBonus - sparkPenalty);
      setLocalClearedSpotIds((prev) =>
        prev.includes(activeSpot.id) ? prev : [...prev, activeSpot.id],
      );
      onUnlockWildLead(
        pendingApproach.leadId,
        activeSpot.id,
        finalBonus,
        pendingApproach.clueId,
      );
      awardPassportBonusXp(
        `wild_pull_${activeSpot.id}_${role}`,
        35,
        `${getCastProfileById(pendingApproach.leadId)?.name ?? 'Match'}’s Number Earned!`,
        '🏆 +35 XP',
      );
      emitOrganicBingoUnlock(
        'gymheadphones',
        `Pulled ${getCastProfileById(pendingApproach.leadId)?.name ?? 'a match'}’s number offline in the wild`,
        3,
      );
      setTurnPopBanner({
        tone: 'jackpot',
        badge: '🏆 NUMBER EARNED! • +35 XP',
        headline: `100% Spark! You Pulled ${
          getCastProfileById(pendingApproach.leadId)?.name ?? 'Their'
        }’s Personal Cell`,
        detail: `Earned +${finalBonus}% starting iMessage chemistry${
          allSignalsDecoded ? ' + 3/3 Signal Detective Mastery' : ''
        }!`,
      });
      setOutcomeCard({
        text: picked.replyCue,
        delta: finalBonus,
        unlockedLeadId: pendingApproach.leadId,
        wasReplay: wasAlreadyInThreads,
      });
    };

    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 animate-stage-in">
        <CelebrationBurstCanvas
          key={celebrationBurstKey}
          active={Boolean(outcomeCard?.unlockedLeadId)}
          palette="gold"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={resetSpot}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All 10 City Hotspots</span>
          </button>

          <div className="flex items-center gap-2">
            <Badge variant="accent">High-Stakes Signal Detection</Badge>
            <span className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700">
              {clearedCount} / {V35_WILD_VENUES.length} Cleared
            </span>
          </div>
        </div>

        {/* Visual-Novel Offline Encounter Stage */}
        <section className="relative overflow-hidden rounded-2xl bg-zinc-950 text-white shadow-xl border border-zinc-800">
          <div className="relative h-56 sm:h-72 w-full overflow-hidden">
            <img
              src={activeSpot.backdropUrl}
              alt={activeSpot.name}
              className="h-full w-full object-cover animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-transparent" />

            <div className="absolute left-5 bottom-4 right-5 sm:left-6 sm:right-6 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-zinc-950">
                  <span>{activeSpot.emoji}</span>
                  <span>Hotspot #{activeSpot.number} • 1-in-3 Signal Precision</span>
                </span>
                <h1 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                  {activeSpot.name}
                </h1>
              </div>

              {primaryPortrait && (
                <img
                  src={primaryPortrait}
                  alt={primaryProfile?.name ?? 'Scene lead'}
                  className="shrink-0 h-22 w-18 sm:h-28 sm:w-22 rounded-xl object-cover ring-2 ring-white/80 shadow-xl v35-portrait-breathe"
                />
              )}
            </div>
          </div>

          {/* Scene Dialogue & Structured 3-Step High-Risk Signal Dock */}
          <div className="p-5 sm:p-7 space-y-4">
            {/* Optional Non-Blocking Chemistry Cameo Strip */}
            {matchedTargetLeadId && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      Bonus Cameo ({cameoSpeaker?.name ?? 'Club Regular'}) for{' '}
                      {getCastProfileById(matchedTargetLeadId)?.name ?? 'Your Match'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-100 leading-snug">
                    {activeSpot.cameoBeat.line}
                  </p>
                </div>
                {cameoDone ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-emerald-400/20 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>+15% Cameo Claimed</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sfx.greenFlag();
                      onCompleteCameo(activeSpot.id, matchedTargetLeadId, 15);
                    }}
                    className="shrink-0 inline-flex h-9 items-center rounded-lg bg-white px-3.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 transition cursor-pointer"
                  >
                    Claim +15% Chemistry Cameo
                  </button>
                )}
              </div>
            )}

            {/* Big Unmistakable Poppy Win / Brush-Off / Crash-Out Turn Banner */}
            {turnPopBanner && (
              <div
                key={`${beatStage}-${turnPopBanner.tone}-${turnPopBanner.headline}`}
                data-testid="wild-turn-pop-banner"
                className={`animate-stamp-slam rounded-2xl border-2 px-4 py-3.5 shadow-lg ${
                  turnPopBanner.tone === 'jackpot'
                    ? 'border-amber-300 bg-gradient-to-r from-emerald-900/95 via-emerald-800/95 to-amber-900/90 text-white'
                    : turnPopBanner.tone === 'win'
                      ? 'border-emerald-400 bg-emerald-950/90 text-white'
                      : turnPopBanner.tone === 'brushoff'
                        ? 'border-amber-400 bg-amber-950/90 text-amber-50'
                        : 'border-rose-400 bg-rose-950/95 text-rose-50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-extrabold uppercase tracking-wider ${
                      turnPopBanner.tone === 'jackpot'
                        ? 'bg-amber-300 text-zinc-950'
                        : turnPopBanner.tone === 'win'
                          ? 'bg-emerald-400 text-zinc-950'
                          : turnPopBanner.tone === 'brushoff'
                            ? 'bg-amber-300 text-zinc-950'
                            : 'bg-rose-500 text-white'
                    }`}
                  >
                    {turnPopBanner.tone === 'jackpot' ? (
                      <Trophy className="h-3.5 w-3.5" />
                    ) : turnPopBanner.tone === 'win' ? (
                      <Zap className="h-3.5 w-3.5" />
                    ) : turnPopBanner.tone === 'brushoff' ? (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    ) : (
                      <ShieldAlert className="h-3.5 w-3.5" />
                    )}
                    <span>{turnPopBanner.badge}</span>
                  </span>
                  <span className="text-xs font-semibold text-white/80">
                    {turnPopBanner.tone === 'crash'
                      ? 'Stakes: -1 Heart Penalty Applied'
                      : turnPopBanner.tone === 'brushoff'
                        ? 'Stakes: Polite Brush-Off • Study the Cue!'
                        : 'Streak Active!'}
                  </span>
                </div>
                <div className="mt-1.5 text-base sm:text-lg font-bold leading-snug">
                  {turnPopBanner.headline}
                </div>
                <p className="mt-0.5 text-xs sm:text-sm text-white/90 leading-relaxed">
                  {turnPopBanner.detail}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold text-zinc-200">
                  {primaryProfile
                    ? `${primaryProfile.name}, ${primaryProfile.age} · ${primaryProfile.vitals.job}`
                    : 'In-Person Meet-Cute'}
                </div>
                {isPrimaryAlreadyMatched && !outcomeCard && (
                  <span className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-medium text-zinc-200">
                    In Roster · Replayable
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-amber-200">
                {outcomeCard?.unlockedLeadId
                  ? '🏆 Number Pulled!'
                  : activeFollowStep
                    ? activeFollowStep.stageLabel
                    : 'Beat 1 of 3 • Read & Open'}
              </span>
            </div>

            {/* Clean 3-Step Chemistry & Stakes Meter */}
            <div
              data-testid="wild-signal-meter"
              className="rounded-xl border border-white/14 bg-white/[0.05] px-4 py-3.5 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-semibold">
                <span className="inline-flex items-center gap-1.5 text-zinc-100">
                  <Radio className="h-4 w-4 text-rose-400" />
                  <span>Read the Room • Win: +15/+35 XP · Crash-Out: -1 Heart</span>
                </span>
                <span className="font-bold text-white">{signalPct}% Spark</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  style={{ width: `${signalPct}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    outcomeCard?.isMemeFail
                      ? 'bg-rose-500'
                      : outcomeCard?.isPoliteBrushOff
                        ? 'bg-amber-400'
                        : signalPct >= 100
                          ? 'bg-emerald-400'
                          : 'bg-rose-500'
                  }`}
                />
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                <span
                  className={
                    beatStage >= 1 || outcomeCard?.unlockedLeadId
                      ? 'text-zinc-100'
                      : 'text-zinc-500'
                  }
                >
                  1. Availability Scan
                </span>
                <span
                  className={
                    beatStage >= 2 || outcomeCard?.unlockedLeadId
                      ? 'text-amber-200 text-center'
                      : 'text-zinc-500 text-center'
                  }
                >
                  2. Age-Gap Openness
                </span>
                <span
                  className={
                    beatStage >= 3 || outcomeCard?.unlockedLeadId
                      ? 'text-emerald-300 text-right'
                      : 'text-zinc-500 text-right'
                  }
                >
                  3. Zero-Hover Close
                </span>
              </div>
            </div>

            {/* Interactive 3-Signal Room Scanner + Unlocked Approachability Verdict */}
            {!outcomeCard && (
              <div
                data-testid="wild-room-scanner"
                className="rounded-xl border border-white/16 bg-white/[0.05] p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-100">
                    <Eye className="h-4 w-4 text-amber-300" />
                    <span>Decipher Intentions: Tap All 3 Signals to Detect If Approachable</span>
                  </span>
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${
                      allSignalsDecoded
                        ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/40'
                        : 'bg-amber-400/20 text-amber-200 border border-amber-300/30'
                    }`}
                  >
                    {revealedClueIndices.length}/3 Signals Read
                    {!allSignalsDecoded ? ' • Blind Risk!' : ' • +5 XP Decoded'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {roomClues.map((clue, cIdx) => {
                    const isRead = revealedClueIndices.includes(cIdx);
                    return (
                      <button
                        key={clue.label}
                        type="button"
                        onClick={() => {
                          sfx.cardHoverTick();
                          if (!isRead) {
                            const next = [...revealedClueIndices, cIdx];
                            setRevealedClueIndices(next);
                            if (next.length === 3) {
                              awardPassportBonusXp(
                                `wild_scan_${activeSpot.id}_${role}`,
                                5,
                                'All 3 Room Signals Decoded!',
                                '👁️ +5 XP',
                              );
                            }
                          }
                        }}
                        className={`rounded-xl border p-3 text-left text-xs sm:text-sm transition cursor-pointer ${
                          isRead
                            ? 'border-amber-300/50 bg-amber-300/12 text-zinc-100'
                            : 'border-white/18 bg-white/[0.06] text-zinc-200 hover:border-amber-300/50 hover:bg-white/[0.12]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5 font-semibold">
                          <span>
                            {clue.icon} {clue.label}
                          </span>
                          {!isRead && (
                            <span className="rounded bg-amber-300/20 px-1.5 py-0.5 text-[11px] font-bold text-amber-200">
                              Scan
                            </span>
                          )}
                        </div>
                        {isRead && (
                          <p className="mt-1.5 text-xs sm:text-sm leading-snug text-zinc-200">
                            {clue.detail.trim()}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {allSignalsDecoded && (
                  <div
                    data-testid="wild-approachability-verdict"
                    className={`rounded-xl border px-3.5 py-3 text-xs sm:text-sm leading-relaxed ${
                      approachRead.status === 'caution'
                        ? 'border-rose-400/50 bg-rose-500/15 text-rose-100'
                        : 'border-emerald-400/45 bg-emerald-500/15 text-emerald-100'
                    }`}
                  >
                    <div className="font-bold">
                      {approachRead.status === 'caution' ? '🚨 ' : '🟢 '}
                      {approachRead.headline}
                    </div>
                    <p className="mt-0.5 text-white/90">{approachRead.rule}</p>
                  </div>
                )}
              </div>
            )}

            {/* Split Stage Direction vs Spoken/Visual Cue */}
            <div className="space-y-3 rounded-xl border border-white/12 bg-white/[0.06] p-4 sm:p-5">
              {pendingApproach?.lastReplyCue && !outcomeCard && (
                <div className="rounded-lg border border-emerald-400/35 bg-emerald-500/15 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-emerald-100">
                  ✓ {pendingApproach.lastReplyCue}
                </div>
              )}
              <p className="text-sm sm:text-base leading-relaxed text-zinc-100">
                {activeFollowStep ? activeFollowStep.prompt : setupText}
              </p>
              {(activeFollowStep ? activeFollowStep.spokenCue : spokenCue) && (
                <div className="border-l-2 border-rose-400 pl-3.5 pt-0.5">
                  <p className="text-base sm:text-lg italic leading-snug text-white">
                    {activeFollowStep ? activeFollowStep.spokenCue : spokenCue}
                  </p>
                </div>
              )}
            </div>

            {outcomeCard ? (
              <div
                data-testid="wild-outcome-card"
                className={`rounded-xl p-5 space-y-3.5 ${
                  outcomeCard.isMemeFail
                    ? 'bg-rose-950/80 border border-rose-400/50'
                    : outcomeCard.isPoliteBrushOff
                      ? 'bg-amber-950/80 border border-amber-400/50'
                      : 'bg-emerald-950/80 border border-emerald-400/50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ${
                      outcomeCard.isMemeFail
                        ? 'bg-rose-500/30 text-rose-100'
                        : outcomeCard.isPoliteBrushOff
                          ? 'bg-amber-400/25 text-amber-100'
                          : 'bg-emerald-400/25 text-emerald-100'
                    }`}
                  >
                    <Heart className="h-3.5 w-3.5" />
                    <span>
                      {outcomeCard.isMemeFail
                        ? `${outcomeCard.delta}% Spark · -1 Friday Heart`
                        : outcomeCard.isPoliteBrushOff
                          ? `${outcomeCard.delta}% Spark · Polite Brush-Off`
                          : `+${outcomeCard.delta}% Spark`}
                    </span>
                  </span>
                  {outcomeCard.unlockedLeadId && (
                    <span
                      data-testid="wild-number-pulled-stamp"
                      className="animate-stamp-slam inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-300/25 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-100"
                    >
                      {outcomeCard.wasReplay ? '✓ Scene Cleared!' : '📱 Number Pulled! · +35 XP'}
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
                  {outcomeCard.text}
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {outcomeCard.isMemeFail || outcomeCard.isPoliteBrushOff ? (
                    <button
                      type="button"
                      onClick={() => setOutcomeCard(null)}
                      className="inline-flex min-h-10 items-center rounded-lg bg-white hover:bg-zinc-100 px-4 text-xs sm:text-sm font-bold text-zinc-950 cursor-pointer"
                    >
                      {outcomeCard.isPoliteBrushOff
                        ? 'Read the 3 Room Signals & Try This Beat Again →'
                        : 'Rewind & Try a Smoother Move'}
                    </button>
                  ) : (
                    nextSpot && (
                      <button
                        type="button"
                        onClick={() => openSpot(nextSpot.id)}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 px-4 text-xs sm:text-sm font-semibold text-white cursor-pointer"
                      >
                        <span>Next Hotspot: {nextSpot.name}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )
                  )}

                  {(outcomeCard.isMemeFail || outcomeCard.isPoliteBrushOff) && onOpenGuideSlug && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenGuideSlug(
                          'how-to-meet-older-women-in-the-wild-hotel-bar-gym-etiquette',
                        )
                      }
                      className="inline-flex min-h-10 items-center rounded-lg border border-amber-300/50 bg-amber-300/15 hover:bg-amber-300/25 px-3.5 text-xs sm:text-sm font-semibold text-amber-100 cursor-pointer"
                    >
                      📖 Read 60s Offline Field Guide →
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={resetSpot}
                    className="inline-flex min-h-10 items-center rounded-lg border border-white/25 bg-white/10 hover:bg-white/20 px-3.5 text-xs sm:text-sm font-medium text-white cursor-pointer"
                  >
                    Back to City Map
                  </button>

                  {!outcomeCard.isMemeFail && !outcomeCard.isPoliteBrushOff && (
                    <button
                      type="button"
                      onClick={() => openSpot(activeSpot.id)}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-white/25 px-3.5 text-xs sm:text-sm font-medium text-zinc-200 hover:bg-white/10 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Replay Scene</span>
                    </button>
                  )}

                  {outcomeCard.unlockedLeadId && onOpenChatWithLead && (
                    <button
                      type="button"
                      onClick={() => onOpenChatWithLead(outcomeCard.unlockedLeadId!)}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 px-3.5 text-xs sm:text-sm font-semibold text-white cursor-pointer"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>
                        Open iMessage with{' '}
                        {getCastProfileById(outcomeCard.unlockedLeadId)?.name ?? 'Match'} Now →
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ) : activeFollowStep ? (
              <div className="grid gap-2.5 pt-1">
                {followOrder.map((origIdx, displayIdx) => {
                  const choice = activeFollowStep.choices[origIdx];
                  if (!choice) return null;
                  return (
                    <button
                      key={choice.label}
                      type="button"
                      data-testid={
                        origIdx === firstPassOrigIdx ? 'wild-followup-pass-option' : undefined
                      }
                      onClick={() => handleFollowStepPick(origIdx)}
                      className="group flex items-start gap-3.5 w-full rounded-xl border border-white/20 bg-white/[0.08] p-4 text-left text-sm sm:text-base font-medium text-white whitespace-normal hover:bg-white/[0.15] hover:border-white/45 transition cursor-pointer"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-xs font-bold text-white group-hover:bg-white group-hover:text-zinc-950 transition">
                        {CHOICE_KEYS[displayIdx] ?? displayIdx + 1}
                      </span>
                      <span className="flex-1 leading-snug">{choice.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid gap-2.5 pt-1">
                {beat1Order.map((origIdx, displayIdx) => {
                  const choice = choices[origIdx];
                  if (!choice) return null;
                  return (
                    <button
                      key={choice.label}
                      type="button"
                      onClick={() => handleBeat1Pick(choice, origIdx)}
                      className="group flex items-start gap-3.5 w-full rounded-xl border border-white/20 bg-white/[0.08] p-4 text-left text-sm sm:text-base font-medium text-white whitespace-normal hover:bg-white/[0.15] hover:border-white/45 transition cursor-pointer"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-xs font-bold text-white group-hover:bg-white group-hover:text-zinc-950 transition">
                        {CHOICE_KEYS[displayIdx] ?? displayIdx + 1}
                      </span>
                      <span className="flex-1 leading-snug">{choice.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 animate-stage-in">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-rose-600" />
              <span>In The Wild • Offline Signal Detection</span>
            </h1>
            <Badge variant="accent">Harder Than Apps • 1-in-3 Precision</Badge>
          </div>
          <p className="text-sm sm:text-base text-zinc-600">
            Nobody wears an age-slider in real life. Scan all 3 micro-signals (+5 XP) to detect if they are single and open before making your move.
          </p>
        </div>
        <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-zinc-800">
          {clearedCount} / {V35_WILD_VENUES.length} Hotspots Cleared
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {V35_WILD_VENUES.map((spot) => {
          const leadId = role === 'her' ? spot.primaryHerLeadId : spot.primaryHimLeadId;
          const lead = getCastProfileById(leadId);
          const readMeta = getWildApproachabilityRead(spot.id, role);
          const isVenueCleared = clearedSet.has(spot.id);
          const hasUnclaimedCameo =
            (activeLeadThreads.includes(leadId) ||
              Boolean(
                spot.secondaryCameoLeadId &&
                  activeLeadThreads.includes(spot.secondaryCameoLeadId),
              )) &&
            !completedCameoVenues.includes(spot.id);

          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => {
                sfx.cardHoverTick();
                openSpot(spot.id);
              }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-2xs transition hover:border-rose-300 hover:shadow-sm cursor-pointer"
            >
              <div className="relative h-44 w-full overflow-hidden bg-zinc-200">
                <img
                  src={spot.backdropUrl}
                  alt={spot.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-zinc-900">
                  {spot.emoji} #{spot.number}
                </span>
                {isVenueCleared ? (
                  <span className="absolute right-3 top-3 rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                    ✓ Cleared
                  </span>
                ) : hasUnclaimedCameo ? (
                  <span className="absolute right-3 top-3 rounded-md bg-amber-300 px-2.5 py-0.5 text-xs font-bold text-zinc-950">
                    +15% Cameo
                  </span>
                ) : (
                  <span className="absolute right-3 top-3 rounded-md bg-zinc-950/80 px-2.5 py-0.5 text-[11px] font-semibold text-amber-200">
                    {readMeta.status === 'caution' ? '🕵️ High Trap Risk' : '📡 3 Signals'}
                  </span>
                )}
                <div className="absolute inset-x-3.5 bottom-3">
                  <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {spot.name}
                  </h2>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                  {spot.subtitle}
                </p>
                {lead && (
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5 text-xs sm:text-sm font-medium text-zinc-900">
                    <span>
                      {isVenueCleared
                        ? `${lead.name}, ${lead.age} · Replayable`
                        : `Spot ${lead.name}, ${lead.age}`}
                    </span>
                    <span className="font-semibold text-rose-600 group-hover:text-zinc-950 transition-colors">
                      {isVenueCleared ? 'Replay Scene →' : 'Scan Room →'}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <CrowdsourceSubmissionBar surface="wild" compact />
    </div>
  );
};
