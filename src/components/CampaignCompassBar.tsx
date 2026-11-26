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
  onNavigateStep: (step: CampaignNextStep) => void;
  onSelectMatchChat: (leadId: string) => void;
  onOpenCubSchool: () => void;
  onOpenWildMap: () => void;
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
  onNavigateStep,
  onSelectMatchChat,
  onOpenCubSchool,
  onOpenWildMap,
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
      className="w-full border-b border-zinc-200/80 bg-zinc-50/90"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
        {/* Left: Anchored Status Metrics */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-zinc-600">
          <div className="inline-flex items-center gap-1.5 font-semibold text-zinc-900 whitespace-nowrap">
            <Award className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span>
              Lv.{summary.level} • {summary.levelTitle}
            </span>
          </div>

          <span className="text-zinc-300 hidden sm:inline">•</span>

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
                className="ml-1 rounded-md bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white cursor-pointer"
              >
                New Friday
              </button>
            )}
          </div>

          <span className="text-zinc-300 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={onOpenCubSchool}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
              summary.etiquetteBonusActive
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900',
            )}
          >
            <GraduationCap className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span>
              {summary.etiquetteBonusActive
                ? `School ${cubSchoolStars}/12 (+8% Spark)`
                : `School ${cubSchoolStars}/12`}
            </span>
          </button>
        </div>

        {/* Center: Active Match Roster Chips */}
        {activeThreads.length > 0 && activeTab !== 'chats' && (
          <div className="flex flex-wrap items-center gap-1.5">
            {activeThreads.slice(0, 4).map((t) => {
              const person = getCastProfileById(t.leadId);
              const vis = V35_CAST_VISUALS[t.leadId];
              if (!person || !vis) return null;
              return (
                <button
                  key={t.leadId}
                  type="button"
                  onClick={() => onSelectMatchChat(t.leadId)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-900 transition-colors cursor-pointer"
                  title={`${person.name}: ${t.datesCompleted}/3 Dates Complete`}
                >
                  <img
                    src={vis.primaryPortrait}
                    alt={person.name}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  <span>{person.name}</span>
                  <span className="text-rose-600 tracking-tight">
                    {formatThreeDateHearts(t.datesCompleted)}
                  </span>
                  {t.lastDateRank && t.lastDateRank !== 'F' && (
                    <span className="rounded bg-zinc-900 px-1 text-xs font-semibold text-white">
                      {t.lastDateRank}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Right: Clean Next-Action Button */}
        <div className="flex items-center gap-2.5">
          <span className="hidden md:inline text-xs font-medium text-zinc-500">
            {effectiveNextStep.stepTag}
          </span>
          <button
            type="button"
            onClick={() => {
              if (effectiveNextStep.targetTab === 'wild' && !effectiveNextStep.leadId) {
                onOpenWildMap();
              } else {
                onNavigateStep(effectiveNextStep);
              }
            }}
            className="inline-flex h-7 items-center gap-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 px-3 text-xs font-medium text-white transition-colors cursor-pointer"
          >
            <span>{effectiveNextStep.ctaLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
};
