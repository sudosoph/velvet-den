import React from 'react';
import { ArrowRight, Award, GraduationCap } from 'lucide-react';
import { V35_CAST_VISUALS } from '../data/v35AssetManifest';
import { getCastProfileById } from '../data/v35Cast';
import { V35_DATE_SCRIPTS, V35_TABLE_9_CONSPIRACY } from '../data/v35ChatsAndDates';
import type { WalletState } from '../domain/economy';
import type { PlayerRole } from '../domain/taxonomy';
import { cn } from '../lib/utils';
import type { ActiveMatchThread } from './ChatsAndDatesView';
import type { ClubTopTab } from './TopHudBar';

export interface CampaignNextStep {
  targetTab: ClubTopTab;
  stepTag: string;
  ctaLabel: string;
  leadId?: string;
  launchDateNumber?: 1 | 2 | 3;
  openConspiracy?: boolean;
}

export interface CampaignProgressSummary {
  level: 1 | 2 | 3 | 4 | 5;
  levelTitle: string;
  totalPoints: number;
  progressPercent: number;
  totalDatesCompleted: number;
  sRankCount: number;
  etiquetteBonusActive: boolean;
  nextStep: CampaignNextStep;
}

const LEVEL_THRESHOLDS: {
  level: 1 | 2 | 3 | 4 | 5;
  min: number;
  nextMin: number;
  title: string;
}[] = [
  { level: 1, min: 0, nextMin: 40, title: 'Velvet Newcomer' },
  { level: 2, min: 40, nextMin: 100, title: 'Sharp Flirt & Vetter' },
  { level: 3, min: 100, nextMin: 180, title: 'Inner-Circle Regular' },
  { level: 4, min: 180, nextMin: 280, title: 'S-Rank Heartthrob' },
  { level: 5, min: 280, nextMin: 380, title: 'Icon of Velvet Palms' },
];

export function formatThreeDateHearts(datesCompleted: number): string {
  const filled = Math.max(0, Math.min(3, datesCompleted));
  return '♥'.repeat(filled) + '♡'.repeat(3 - filled);
}

export function computeCampaignProgress({
  wallet,
  threads,
  cubSchoolStars,
  completedCameoCount,
}: {
  wallet: WalletState;
  threads: ActiveMatchThread[];
  cubSchoolStars: number;
  completedCameoCount: number;
  role: PlayerRole;
}): CampaignProgressSummary {
  const graduatedCount = threads.filter((t) => t.stage === 'imessage').length;
  const totalDatesCompleted = threads.reduce((acc, t) => acc + Math.min(3, t.datesCompleted), 0);
  const sRankCount = threads.filter((t) => t.lastDateRank === 'S').length;

  const totalPoints =
    threads.length * 15 +
    graduatedCount * 20 +
    totalDatesCompleted * 35 +
    sRankCount * 25 +
    wallet.discernmentXp +
    cubSchoolStars * 10 +
    completedCameoCount * 15;

  let currentTier = LEVEL_THRESHOLDS[0];
  for (const tier of LEVEL_THRESHOLDS) {
    if (totalPoints >= tier.min) {
      currentTier = tier;
    }
  }

  const span = Math.max(1, currentTier.nextMin - currentTier.min);
  const progressPercent =
    currentTier.level === 5
      ? 100
      : Math.max(6, Math.min(100, Math.round(((totalPoints - currentTier.min) / span) * 100)));

  const etiquetteBonusActive = cubSchoolStars >= 4;

  let nextStep: CampaignNextStep;

  if (wallet.conspiracyClues.length >= V35_TABLE_9_CONSPIRACY.requiredClueCount) {
    nextStep = {
      targetTab: 'chats',
      openConspiracy: true,
      stepTag: '3/3 Clues Unlocked',
      ctaLabel: 'Crash Table 9 Alibi Club',
    };
  } else {
    const readyDateThread = threads.find((t) => {
      if (t.lastDateRank === 'F') return false;
      const scripts = V35_DATE_SCRIPTS[t.leadId] || [];
      const nextScript = scripts.find((s) => s.dateNumber === t.datesCompleted + 1);
      if (!nextScript || nextScript.dateNumber > 3) return false;
      return t.stage === 'imessage' && (t.currentBeat >= 4 || t.originDoor === 'wild');
    });

    const readyGraduateThread = threads.find(
      (t) => t.stage === 'app_dm' && t.currentBeat > 6,
    );

    const activeVettingThread = threads.find(
      (t) => t.currentBeat <= 6 || t.datesCompleted === 0,
    );

    if (readyDateThread) {
      const p = getCastProfileById(readyDateThread.leadId);
      const nextNum = (readyDateThread.datesCompleted + 1) as 1 | 2 | 3;
      nextStep = {
        targetTab: 'chats',
        leadId: readyDateThread.leadId,
        launchDateNumber: nextNum,
        stepTag: `Act 3 • Date #${nextNum} Ready`,
        ctaLabel: `Launch Date #${nextNum} with ${p?.name ?? readyDateThread.leadId}`,
      };
    } else if (readyGraduateThread) {
      const p = getCastProfileById(readyGraduateThread.leadId);
      nextStep = {
        targetTab: 'chats',
        leadId: readyGraduateThread.leadId,
        stepTag: 'Act 2 • Beat 6 Complete',
        ctaLabel: `Graduate ${p?.name ?? readyGraduateThread.leadId} to iMessage`,
      };
    } else if (activeVettingThread) {
      const p = getCastProfileById(activeVettingThread.leadId);
      const beatLabel = Math.min(6, activeVettingThread.currentBeat);
      nextStep = {
        targetTab: 'chats',
        leadId: activeVettingThread.leadId,
        stepTag: `Act 2 • Beat ${beatLabel}/6 Vetting`,
        ctaLabel: `Text ${p?.name ?? activeVettingThread.leadId} (Beat ${beatLabel}/6)`,
      };
    } else if (threads.length === 0) {
      nextStep = {
        targetTab: 'hinge',
        stepTag: 'Act 1 • Spark Your First Match',
        ctaLabel: 'Send a Prompt Reply on Hinge',
      };
    } else {
      nextStep = {
        targetTab: 'wild',
        stepTag: 'Off-App Exclusives',
        ctaLabel: 'Meet Leads In The Wild',
      };
    }
  }

  return {
    level: currentTier.level,
    levelTitle: currentTier.title,
    totalPoints,
    progressPercent,
    totalDatesCompleted,
    sRankCount,
    etiquetteBonusActive,
    nextStep,
  };
}

interface CampaignCompassBarProps {
  wallet: WalletState;
  threads: ActiveMatchThread[];
  cutLooseIds: string[];
  cubSchoolStars: number;
  completedCameoCount: number;
  role: PlayerRole;
  activeTab: ClubTopTab;
  onSwitchRole?: (nextRole: PlayerRole) => void;
  onNavigateStep: (step: CampaignNextStep) => void;
  onSelectMatchChat: (leadId: string) => void;
  onOpenCubSchool: () => void;
  onOpenWildMap: () => void;
  onOpenPopTrivia?: () => void;
  onOpenChecklist?: () => void;
  onOpenGuides?: () => void;
  onResetHearts?: () => void;
}

export const CampaignCompassBar: React.FC<CampaignCompassBarProps> = ({
  wallet,
  threads,
  cutLooseIds,
  cubSchoolStars,
  completedCameoCount,
  role,
  activeTab,
  onSwitchRole,
  onNavigateStep,
  onSelectMatchChat,
  onOpenCubSchool,
  onOpenWildMap,
  onOpenPopTrivia,
  onOpenChecklist,
  onOpenGuides,
  onResetHearts,
}) => {
  const activeThreads = threads.filter((t) => !cutLooseIds.includes(t.leadId));
  const summary = computeCampaignProgress({
    wallet,
    threads: activeThreads,
    cubSchoolStars,
    completedCameoCount,
    role,
  });

  const heartsDisplay =
    wallet.fridayHearts > 0
      ? '❤️'.repeat(wallet.fridayHearts) + '🤍'.repeat(Math.max(0, 3 - wallet.fridayHearts))
      : '🤍🤍🤍';

  const isFreshHingeLanding =
    activeThreads.length === 0 && activeTab === 'hinge' && wallet.discernmentXp === 0;

  if (isFreshHingeLanding) {
    return (
      <section
        data-testid="campaign-compass-bar"
        aria-label="Campaign Progress and Next Step"
        className="w-full border-b border-zinc-200 bg-white"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-7">
          {/* Top Zone: The Main Story Game */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-1.5 sm:space-y-2">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-rose-600">
                <span>The Dating Sim</span>
                <span className="text-zinc-300">•</span>
                <span
                  data-testid="hud-friday-hearts"
                  className="text-zinc-600 font-semibold normal-case tracking-normal"
                  title="Friday Date Energy (3 Hearts)"
                >
                  {heartsDisplay} 3 Hearts
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 leading-[1.1]">
                Lower your age slider.{' '}
                <span className="text-rose-600">Dodge the red flags.</span>
              </h2>
              <p className="text-xs sm:text-base text-zinc-600 leading-relaxed max-w-xl">
                Swipe below or step out In The Wild, spot the traps, graduate real catches to iMessage, and survive three Friday dates.
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-2.5 shrink-0">
              {onSwitchRole && (
                <div className="inline-flex rounded-lg bg-zinc-100 p-1">
                  <button
                    type="button"
                    onClick={() => onSwitchRole('her')}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer',
                      role === 'her'
                        ? 'bg-zinc-950 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-950',
                    )}
                  >
                    Play as Her (Cougar)
                  </button>
                  <button
                    type="button"
                    onClick={() => onSwitchRole('him')}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer',
                      role === 'him'
                        ? 'bg-zinc-950 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-950',
                    )}
                  >
                    Play as Him (Cub)
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="#hinge-stage"
                  className="inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors"
                >
                  <span>Start Swiping ↓</span>
                </a>
                <button
                  type="button"
                  onClick={onOpenWildMap}
                  className="inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-zinc-900 transition-colors cursor-pointer"
                >
                  <span>10 Wild Spots</span>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Zone: Distinct Quick Party Quizzes & Club Lore */}
          {(onOpenPopTrivia || onOpenChecklist || onOpenGuides) && (
            <div className="mt-3.5 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-zinc-400">
                60-Sec Party Quizzes &amp; Lore
              </span>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-semibold">
                {onOpenPopTrivia && (
                  <button
                    type="button"
                    onClick={onOpenPopTrivia}
                    className="text-zinc-800 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    🎬 Pop-Culture &amp; Movie Quiz →
                  </button>
                )}
                {onOpenChecklist && (
                  <button
                    type="button"
                    onClick={onOpenChecklist}
                    className="text-zinc-800 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    ✅ 25-Pt &ldquo;Have You Ever?&rdquo; Score →
                  </button>
                )}
                {onOpenGuides && (
                  <button
                    type="button"
                    onClick={onOpenGuides}
                    className="text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
                  >
                    🔮 Zodiac &amp; 16 Club Guides →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  const effectiveNextStep: CampaignNextStep =
    activeThreads.length === 0 && activeTab === 'hinge'
      ? {
          targetTab: 'wild',
          stepTag: 'Act 1 • Two Ways to Meet',
          ctaLabel: 'Explore 10 In The Wild Spots',
        }
      : summary.nextStep;

  return (
    <section
      data-testid="campaign-compass-bar"
      aria-label="Campaign Progress and Next Step"
      className="w-full border-b border-zinc-200 bg-white"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Left: Clean Progress Summary */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-600">
          <div className="inline-flex items-center gap-1.5 font-semibold text-zinc-950 whitespace-nowrap">
            <Award className="h-3.5 w-3.5 text-rose-600 shrink-0" />
            <span>
              Lv.{summary.level} • {summary.levelTitle}
            </span>
          </div>

          <div
            data-testid="hud-friday-hearts"
            className="inline-flex items-center gap-1.5 whitespace-nowrap"
            title="Friday Date Energy (3 Hearts)"
          >
            <span>{heartsDisplay}</span>
            {wallet.discernmentXp > 0 && (
              <span className="text-zinc-500">• {wallet.discernmentXp} XP</span>
            )}
            {wallet.fridayHearts === 0 && onResetHearts && (
              <button
                type="button"
                onClick={onResetHearts}
                className="ml-1 rounded-md bg-zinc-950 px-2 py-0.5 text-xs font-semibold text-white cursor-pointer"
              >
                New Friday
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenCubSchool}
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
              summary.etiquetteBonusActive
                ? 'text-emerald-700 font-semibold'
                : 'text-zinc-500 hover:text-zinc-950',
            )}
          >
            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
            <span>
              {summary.etiquetteBonusActive
                ? `School ${cubSchoolStars}/12 (+8% Spark)`
                : `School ${cubSchoolStars}/12`}
            </span>
          </button>
        </div>

        {/* Center: Active Match Roster Links */}
        {activeThreads.length > 0 && activeTab !== 'chats' && (
          <div className="flex flex-wrap items-center gap-3">
            {activeThreads.slice(0, 4).map((t) => {
              const person = getCastProfileById(t.leadId);
              const vis = V35_CAST_VISUALS[t.leadId];
              if (!person || !vis) return null;
              return (
                <button
                  key={t.leadId}
                  type="button"
                  onClick={() => onSelectMatchChat(t.leadId)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-800 hover:text-rose-600 transition-colors cursor-pointer"
                  title={`${person.name}: ${t.datesCompleted}/3 Dates Complete`}
                >
                  <img
                    src={vis.primaryPortrait}
                    alt={person.name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span>{person.name}</span>
                  <span className="text-rose-600 tracking-tight">
                    {formatThreeDateHearts(t.datesCompleted)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Right: Single Bold Poppy Next-Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (effectiveNextStep.targetTab === 'wild' && !effectiveNextStep.leadId) {
                onOpenWildMap();
              } else {
                onNavigateStep(effectiveNextStep);
              }
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-3.5 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <span>{effectiveNextStep.ctaLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
};
