import React, { useEffect, useState } from 'react';
import { Coffee, ExternalLink, RotateCcw, Share2 } from 'lucide-react';
import { MONETIZATION_CONFIG } from '../config/monetization';
import type { Episode } from '../data/episodes';
import type { GameRunState } from '../domain/gameEngine';
import { buildAffiliateUrl, getAffiliateById } from '../lib/affiliates';
import { localCrowdStatsService } from '../services/adapters';
import { SceneMosaicBanner } from './ArtPanels';

interface EpisodeStageProps {
  run: GameRunState;
  credits: number;
  onSelectChoice: (choiceIndex: number) => void;
  onRewindLast: () => void;
  onShareDilemma: (episodeId: string, title: string) => void;
  onFinishBustedRun: () => void;
}

export const EpisodeStage: React.FC<EpisodeStageProps> = ({
  run,
  credits,
  onSelectChoice,
  onRewindLast,
  onShareDilemma,
  onFinishBustedRun,
}) => {
  const [pendingResult, setPendingResult] = useState<{
    choiceIndex: number;
    outcomeText: string;
    toastBanner: string;
    triggerTip?: boolean;
    affiliateId?: string;
    episodeTitle: string;
    episodeId: string;
  } | null>(null);
  const [crowdPcts, setCrowdPcts] = useState<number[]>([52, 24, 24]);

  const currentEpisode: Episode | undefined = run.episodeQueue[run.currentEpisodeIndex];
  const role = run.pairing.role;

  useEffect(() => {
    const epId = pendingResult?.episodeId ?? currentEpisode?.id;
    if (!epId) return;
    localCrowdStatsService.getChoicePercentages(epId, 3).then(setCrowdPcts);
  }, [currentEpisode?.id, pendingResult?.episodeId]);

  const handlePick = (idx: number) => {
    if (!currentEpisode) return;
    const choice = currentEpisode.choices[idx];
    setPendingResult({
      choiceIndex: idx,
      outcomeText: role === 'her' ? choice.outcomeHer : choice.outcomeHim,
      toastBanner: choice.toastBanner,
      triggerTip: choice.triggerTipPrompt,
      affiliateId: currentEpisode.recommendedAffiliateId,
      episodeTitle: currentEpisode.title,
      episodeId: currentEpisode.id,
    });
    onSelectChoice(idx);
    localCrowdStatsService.recordChoice(currentEpisode.id, idx);
  };

  const handleRewindClick = () => {
    setPendingResult(null);
    onRewindLast();
  };

  const statItems: [string, number, string][] = [
    ['Maturity', run.stats.maturity, 'bg-rose-500'],
    ['Chivalry', run.stats.chivalry, 'bg-amber-400'],
    ['EQ / Consent', run.stats.eq, 'bg-teal-400'],
    ['Chemistry', run.stats.chemistry, 'bg-pink-500'],
  ];

  const affiliate = getAffiliateById(pendingResult?.affiliateId);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Live 4-Stat Vice HUD + Red Flag Strikes */}
      <div className="vice-panel rounded-2xl bg-[#160c24] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            {run.pairing.badgeLabel} • Episode{' '}
            {Math.min(run.currentEpisodeIndex + 1, run.episodeQueue.length)} of{' '}
            {run.episodeQueue.length}
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

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
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

      {/* Outcome / Toast Transition Card */}
      {pendingResult ? (
        <div className="vice-panel rounded-3xl bg-[#1b0f2e] p-5 sm:p-7 space-y-4">
          <div
            className={`vice-toast inline-block rounded-xl border-2 border-black px-4 py-2 font-display text-2xl ${
              pendingResult.toastBanner.includes('RED FLAG')
                ? 'bg-rose-600 text-white'
                : 'bg-amber-400 text-slate-950'
            }`}
          >
            ⚡ {pendingResult.toastBanner}
          </div>

          <h3 className="font-display text-3xl text-white">{pendingResult.episodeTitle}</h3>
          <p className="text-sm sm:text-base leading-relaxed text-slate-100">
            {pendingResult.outcomeText}
          </p>

          <div className="rounded-xl bg-black/40 px-3.5 py-2 text-xs text-teal-300 font-semibold">
            📊 Community Pulse: {crowdPcts[pendingResult.choiceIndex] ?? 48}% of players chose this exact move.
          </div>

          {/* Peak-Laugh Tip Prompt */}
          {pendingResult.triggerTip && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-pink-400/50 bg-pink-950/50 p-3.5">
              <div className="text-xs text-pink-100">
                <strong>🍸 Lived this exact subreddit thread in real life?</strong> Toss an Espresso Martini in the creator tip jar (0% platform fee).
              </div>
              <a
                href={MONETIZATION_CONFIG.kofiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-pink-500 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-[2px_2px_0px_#09050f] hover:bg-pink-400"
              >
                <Coffee className="h-3.5 w-3.5" />
                <span>Send a Martini Tip</span>
              </a>
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
                href={buildAffiliateUrl(affiliate, `scene_${pendingResult.episodeId}`)}
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
                onClick={onFinishBustedRun}
                className="vice-panel rounded-2xl bg-rose-600 px-6 py-3 font-display text-2xl text-white hover:bg-rose-500 cursor-pointer"
              >
                3 Strikes! See Verdict Receipt →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPendingResult(null)}
                className="vice-panel rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-3 font-display text-2xl text-slate-950 hover:brightness-110 cursor-pointer"
              >
                {run.status === 'completed' ? 'See Official Vibe Receipt →' : 'Next Episode →'}
              </button>
            )}
          </div>
        </div>
      ) : currentEpisode ? (
        <div className="space-y-4">
          <SceneMosaicBanner
            sceneArt={currentEpisode.sceneArt}
            act={currentEpisode.act}
            isVip={currentEpisode.isVip}
          />

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
              {role === 'her' ? currentEpisode.setupHer : currentEpisode.setupHim}
            </p>

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
                    💭 Her Silent Mirror Doubt
                  </div>
                  <p className="mt-1 text-xs italic text-slate-100 leading-relaxed">
                    {currentEpisode.innerInsecurityBubble.herDoubt}
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-teal-400/50 bg-teal-950/40 p-3.5">
                  <div className="text-[11px] font-extrabold uppercase text-teal-300">
                    💭 His Simultaneous Game Doubt
                  </div>
                  <p className="mt-1 text-xs italic text-slate-100 leading-relaxed">
                    {currentEpisode.innerInsecurityBubble.hisDoubt}
                  </p>
                </div>
              </div>
            )}

            {/* Choices */}
            <div className="space-y-3 pt-2">
              {currentEpisode.choices.map((choice, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePick(idx)}
                  className="w-full rounded-2xl border-2 border-black bg-[#24143c] p-4 text-left text-sm font-semibold text-white shadow-[4px_4px_0px_#09050f] hover:bg-[#2f1a4e] hover:border-amber-400 transition cursor-pointer"
                >
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-400 text-xs font-extrabold text-slate-950">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {role === 'her' ? choice.labelHer : choice.labelHim}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
