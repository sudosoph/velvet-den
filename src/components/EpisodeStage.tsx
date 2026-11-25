import React, { useEffect, useState } from 'react';
import { Coffee, ExternalLink, RotateCcw, Share2 } from 'lucide-react';
import { MONETIZATION_CONFIG } from '../config/monetization';
import {
  EPISODES,
  RELATIONSHIP_STAGE_LABELS,
  type Episode,
  type RelationshipStage,
} from '../data/episodes';
import { personalizeText, type GameRunState, type Stats } from '../domain/gameEngine';
import { buildAffiliateUrl, getAffiliateById } from '../lib/affiliates';
import { sfx } from '../lib/sound';
import { getLocalChoicePercentagesSync, localCrowdStatsService } from '../services/adapters';
import { MinigameWidget } from './MinigameWidgets';

interface EpisodeStageProps {
  run: GameRunState;
  credits: number;
  onSelectChoice: (choiceIndex: number) => void;
  onCompleteMinigame: (episodeId: string, bonus: Partial<Stats>, badge: string) => void;
  onRewindLast: () => boolean;
  onShareDilemma: (episodeId: string, title: string) => void;
  onOpenBoutique: () => void;
  onFinishRun: () => void;
}

const STAGE_PILLS: { stage: RelationshipStage; short: string }[] = [
  { stage: 1, short: '1·Spark' },
  { stage: 2, short: '2·Rhythm' },
  { stage: 3, short: '3·Doors' },
  { stage: 4, short: '4·Public' },
  { stage: 5, short: '5·Doubt' },
  { stage: 6, short: '6·Future' },
];

export const EpisodeStage: React.FC<EpisodeStageProps> = ({
  run,
  credits,
  onSelectChoice,
  onCompleteMinigame,
  onRewindLast,
  onShareDilemma,
  onOpenBoutique,
  onFinishRun,
}) => {
  const [showingOutcomeForEpId, setShowingOutcomeForEpId] = useState<string | null>(null);
  const [crowdPcts, setCrowdPcts] = useState<number[]>(() =>
    getLocalChoicePercentagesSync('check-drop', 3),
  );
  const [particleBurst, setParticleBurst] = useState<string | null>(null);

  const currentEpisode: Episode | undefined = run.episodeQueue[run.currentEpisodeIndex];
  const role = run.pairing.role;

  const lastEntry =
    showingOutcomeForEpId && run.history.length > 0
      ? run.history[run.history.length - 1]
      : null;
  const resolvedEpisode = lastEntry
    ? EPISODES.find((e) => e.id === lastEntry.episodeId)
    : undefined;
  const resolvedChoice =
    resolvedEpisode && lastEntry ? resolvedEpisode.choices[lastEntry.choiceIndex] : undefined;

  const activeEpIdForStats = resolvedEpisode?.id ?? currentEpisode?.id ?? 'check-drop';
  const activeStage: RelationshipStage = resolvedEpisode?.stage ?? currentEpisode?.stage ?? 1;

  useEffect(() => {
    let cancelled = false;
    const syncBase = getLocalChoicePercentagesSync(activeEpIdForStats, 3);
    setCrowdPcts(syncBase);
    localCrowdStatsService.getChoicePercentages(activeEpIdForStats, 3).then((live) => {
      if (!cancelled && live.join(',') !== syncBase.join(',')) {
        setCrowdPcts(live);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeEpIdForStats]);

  const handlePick = (idx: number) => {
    if (!currentEpisode) return;
    const picked = currentEpisode.choices[idx];
    if (picked && picked.deltas.redFlags > 0) {
      sfx.redFlag();
      setParticleBurst('🚩😬');
    } else {
      sfx.greenFlag();
      setParticleBurst('💖🔥🥂');
    }
    window.setTimeout(() => setParticleBurst(null), 1100);
    setShowingOutcomeForEpId(currentEpisode.id);
    onSelectChoice(idx);
    localCrowdStatsService.recordChoice(currentEpisode.id, idx);
  };

  const handleRewindClick = () => {
    if (onRewindLast()) {
      sfx.messagePop();
      setShowingOutcomeForEpId(null);
    }
  };

  const statItems: [string, number, string][] = [
    ['Maturity', run.stats.maturity, 'bg-rose-500'],
    ['Chivalry', run.stats.chivalry, 'bg-amber-400'],
    ['EQ / Consent', run.stats.eq, 'bg-teal-400'],
    ['Chemistry', run.stats.chemistry, 'bg-pink-500'],
  ];

  const affiliate = getAffiliateById(resolvedEpisode?.recommendedAffiliateId);
  const liveTipUrl = MONETIZATION_CONFIG.tipJarUrl || MONETIZATION_CONFIG.kofiUrl;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* 5-Stage Relationship Arc Tracker + 4-Stat HUD */}
      <div className="vice-panel rounded-2xl bg-[#160c24] p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
              {run.pairing.badgeLabel} • Episode{' '}
              {Math.min(run.currentEpisodeIndex + 1, run.episodeQueue.length)} of{' '}
              {run.episodeQueue.length}
            </div>
            <div className="text-[11px] font-semibold text-pink-300">
              {RELATIONSHIP_STAGE_LABELS[activeStage]}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-extrabold">
            <span className="text-slate-300">Red Flags:</span>
            {[0, 1, 2].map((strike) => (
              <span key={strike} className="text-base">
                {strike < run.redFlags ? '🚩' : '⬜'}
              </span>
            ))}
          </div>
        </div>

        {/* 6-Stage Relationship Stepper (including Stage 5: The Doubt!) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {STAGE_PILLS.map(({ stage: st, short }) => {
            const reached = st <= activeStage;
            const current = st === activeStage;
            return (
              <div
                key={st}
                className={`rounded-lg px-2 py-1 text-center text-[10px] font-extrabold transition ${
                  current
                    ? st === 5
                      ? 'bg-gradient-to-r from-fuchsia-500 to-rose-400 text-white shadow ring-1 ring-amber-300'
                      : 'bg-gradient-to-r from-rose-500 to-amber-400 text-slate-950 shadow'
                    : reached
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/30'
                      : 'bg-black/40 text-slate-500'
                }`}
              >
                {short}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {statItems.map(([label, val, barColor]) => (
            <div key={label}>
              <div className="flex justify-between text-xs font-bold text-slate-200">
                <span>{label}</span>
                <span>{val}</span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-800 border border-black">
                <div
                  className={`h-full ${barColor} transition-all duration-300`}
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animated Split-Stage Photorealistic Character Theater */}
      <div className="vice-panel relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#280f36] via-[#150c25] to-[#0d242c] p-3.5 sm:p-4">
        {particleBurst && (
          <div className="pointer-events-none absolute inset-x-0 top-6 z-20 text-center text-4xl animate-float-particle">
            {particleBurst}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={run.pairing.her.photoUrl}
              alt={run.pairing.her.name}
              className={`h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover object-top border-2 ${
                role === 'her' ? 'border-amber-400 ring-2 ring-rose-400' : 'border-rose-400/60'
              }`}
            />
            <div>
              <div className="font-display text-2xl text-white leading-none">
                {run.pairing.her.name}, {run.pairing.her.age}F
              </div>
              <div className="text-[11px] font-bold text-rose-300">{run.pairing.her.title}</div>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center text-center px-2">
            <span className="rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
              {RELATIONSHIP_STAGE_LABELS[activeStage]}
            </span>
            <span className="mt-1 text-lg">⚡🥂⚡</span>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="font-display text-2xl text-white leading-none">
                {run.pairing.his.name}, {run.pairing.his.age}M
              </div>
              <div className="text-[11px] font-bold text-teal-300">{run.pairing.his.title}</div>
            </div>
            <img
              src={run.pairing.his.photoUrl}
              alt={run.pairing.his.name}
              className={`h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover object-top border-2 ${
                role === 'him' ? 'border-amber-400 ring-2 ring-teal-400' : 'border-teal-400/60'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Outcome / Toast Transition Card */}
      {lastEntry && resolvedEpisode ? (
        <div className="vice-panel animate-stage-in rounded-3xl bg-[#1b0f2e] p-5 sm:p-7 space-y-4">
          <div
            className={`vice-toast inline-block rounded-xl border-2 border-black px-4 py-2 font-display text-2xl ${
              lastEntry.toastBanner.includes('RED FLAG') ||
              lastEntry.toastBanner.includes('VETTING GATE')
                ? 'bg-rose-600 text-white'
                : 'bg-amber-400 text-slate-950'
            }`}
          >
            ⚡ {lastEntry.toastBanner}
          </div>

          <h3 className="font-display text-3xl text-white">{resolvedEpisode.title}</h3>
          <p className="text-sm sm:text-base leading-relaxed text-slate-100">
            {lastEntry.outcomeText}
          </p>

          <div className="rounded-xl bg-black/40 px-3.5 py-2 text-xs text-teal-300 font-semibold">
            📊 Global Club Pulse: {crowdPcts[lastEntry.choiceIndex] ?? 48}% of players chose this exact move.
          </div>

          {/* Peak-Laugh Tip Prompt (Cleanly routes to live tipJarUrl or opens Creator Lounge—zero 404s!) */}
          {resolvedChoice?.triggerTipPrompt && Boolean(lastEntry.badgeUnlocked) && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-pink-400/50 bg-pink-950/50 p-3.5">
              <div className="text-xs text-pink-100">
                <strong>🍸 Lived this exact moment in real life?</strong> Toss an Espresso Martini in the Creator Lounge!
              </div>
              {liveTipUrl ? (
                <a
                  href={liveTipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-pink-500 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-[2px_2px_0px_#09050f] hover:bg-pink-400"
                >
                  <Coffee className="h-3.5 w-3.5" />
                  <span>Send a Martini Tip</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onOpenBoutique}
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-pink-500 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-[2px_2px_0px_#09050f] hover:bg-pink-400 cursor-pointer"
                >
                  <Coffee className="h-3.5 w-3.5" />
                  <span>Open Creator Lounge</span>
                </button>
              )}
            </div>
          )}

          {/* Contextual Velvet Concierge Affiliate Drop */}
          {affiliate && (
            <div className="rounded-2xl border-2 border-black bg-[#101e2b] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-300">
                  🛍️ Velvet Concierge Match • {affiliate.badge}
                </span>
                <div className="mt-1 text-sm font-bold text-white">
                  {affiliate.name} ({affiliate.priceDisplay})
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{affiliate.cheekyPitch}</p>
              </div>
              <a
                href={buildAffiliateUrl(affiliate, `scene_${resolvedEpisode.id}`)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-teal-400 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-[3px_3px_0px_#09050f] hover:bg-teal-300"
              >
                <span>Shop Pick</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleRewindClick}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-800 px-4 py-2.5 text-xs font-extrabold text-amber-300 hover:bg-slate-700 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Smooth Rewind (1 Credit • {credits} left)</span>
            </button>

            {run.status === 'busted' ? (
              <button
                type="button"
                onClick={() => {
                  sfx.redFlag();
                  onFinishRun();
                }}
                className="vice-panel rounded-2xl bg-rose-600 px-6 py-3 font-display text-2xl text-white hover:bg-rose-500 cursor-pointer"
              >
                3 Strikes! See Vibe Receipt →
              </button>
            ) : run.status === 'completed' ? (
              <button
                type="button"
                onClick={() => {
                  sfx.victoryFanfare();
                  onFinishRun();
                }}
                className="vice-panel rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 px-6 py-3 font-display text-2xl text-slate-950 hover:brightness-110 cursor-pointer"
              >
                See Official Vibe Receipt →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  setShowingOutcomeForEpId(null);
                }}
                className="vice-panel rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-3 font-display text-2xl text-slate-950 hover:brightness-110 cursor-pointer"
              >
                Next Stage Scene →
              </button>
            )}
          </div>
        </div>
      ) : currentEpisode ? (
        <div key={currentEpisode.id} className="space-y-4 animate-stage-in">
          <div className="vice-panel rounded-3xl bg-[#180d28] p-5 sm:p-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold italic text-pink-300">
                🧵 {currentEpisode.subredditThreadInspiration}
              </span>
              <button
                type="button"
                onClick={() => onShareDilemma(currentEpisode.id, currentEpisode.title)}
                className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-slate-800 px-2.5 py-1 text-xs font-bold text-teal-300 hover:bg-slate-700 cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Ask Bestie: Ghost or Train?</span>
              </button>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl text-white">
              {currentEpisode.title}
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-slate-200">
              {personalizeText(
                role === 'her' ? currentEpisode.setupHer : currentEpisode.setupHim,
                run.pairing,
              )}
            </p>

            {/* Interactive Playable Arcade Minigame Widget! */}
            {currentEpisode.minigame && (
              <MinigameWidget
                type={currentEpisode.minigame}
                alreadyCompleted={run.completedMinigameEpisodeIds.includes(currentEpisode.id)}
                herName={run.pairing.her.name}
                hisName={run.pairing.his.name}
                onWinBonus={(bonus, badge) => onCompleteMinigame(currentEpisode.id, bonus, badge)}
              />
            )}

            {/* Brain-to-Mouth Generational Code-Switch Box */}
            {currentEpisode.codeSwitchRawImpulse && (
              <div className="rounded-2xl border-2 border-amber-400 bg-amber-950/40 p-4 space-y-1.5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  🧠 Cub Brain-to-Mouth Code-Switch Filter
                </div>
                <p className="font-mono text-xs sm:text-sm text-white bg-black/50 rounded-lg px-3 py-2">
                  Raw Unfiltered Impulse: &ldquo;{currentEpisode.codeSwitchRawImpulse.rawThought}&rdquo;
                </p>
                <p className="text-xs text-amber-200">
                  ⚠️ {currentEpisode.codeSwitchRawImpulse.warningNote}
                </p>
              </div>
            )}

            {/* Symmetric Inner-Insecurity Split Thought Bubbles */}
            {currentEpisode.innerInsecurityBubble && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-pink-400/50 bg-pink-950/40 p-3.5">
                  <div className="text-[11px] font-extrabold uppercase text-pink-300">
                    💭 {run.pairing.her.name}’s Silent Mirror Doubt
                  </div>
                  <p className="mt-1 text-xs italic text-slate-100 leading-relaxed">
                    {currentEpisode.innerInsecurityBubble.herDoubt}
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-teal-400/50 bg-teal-950/40 p-3.5">
                  <div className="text-[11px] font-extrabold uppercase text-teal-300">
                    💭 {run.pairing.his.name}’s Simultaneous Game Doubt
                  </div>
                  <p className="mt-1 text-xs italic text-slate-100 leading-relaxed">
                    {currentEpisode.innerInsecurityBubble.hisDoubt}
                  </p>
                </div>
              </div>
            )}

            {/* Choices */}
            <div className="space-y-3 pt-2">
              {currentEpisode.choices.map((choice, idx) => {
                const houseboyGateWarning =
                  currentEpisode.id === 'houseboy-sunday-sanctuary' &&
                  idx === 0 &&
                  (run.stats.maturity < 60 || run.stats.eq < 60);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePick(idx)}
                    className="w-full rounded-2xl border-2 border-black bg-[#24143c] p-4 text-left text-sm font-semibold text-white shadow-[4px_4px_0px_#09050f] hover:bg-[#2f1a4e] hover:border-amber-400 transition cursor-pointer"
                  >
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-400 text-xs font-extrabold text-slate-950">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {personalizeText(
                      role === 'her' ? choice.labelHer : choice.labelHim,
                      run.pairing,
                    )}
                    {houseboyGateWarning && (
                      <span className="ml-2 inline-block rounded bg-rose-500/30 px-2 py-0.5 text-[11px] font-bold text-rose-200">
                        🔒 Tip: Fix all 4 Sanctuary Upgrades above to clear 60+ Maturity &amp; EQ!
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
