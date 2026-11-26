import React from 'react';
import { Award, Compass, GraduationCap, Sparkles } from 'lucide-react';
import { V35_CAST_VISUALS } from '../data/v35AssetManifest';
import { getCastProfileById } from '../data/v35Cast';
import { V35_DATE_SCRIPTS, V35_TABLE_9_CONSPIRACY } from '../data/v35ChatsAndDates';
import type { WalletState } from '../domain/economy';
import type { PlayerRole } from '../domain/taxonomy';
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

  // Determine the clearest 1-tap Next Action so the player never wonders what to do next
  let nextStep: CampaignNextStep;

  if (wallet.conspiracyClues.length >= V35_TABLE_9_CONSPIRACY.requiredClueCount) {
    nextStep = {
      targetTab: 'chats',
      openConspiracy: true,
      stepTag: '🕵️ 3/3 Clues Unlocked',
      ctaLabel: 'Crash Table 9 Alibi Club →',
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
        ctaLabel: `🍸 Launch Date #${nextNum} with ${p?.name ?? readyDateThread.leadId} →`,
      };
    } else if (readyGraduateThread) {
      const p = getCastProfileById(readyGraduateThread.leadId);
      nextStep = {
        targetTab: 'chats',
        leadId: readyGraduateThread.leadId,
        stepTag: 'Act 2 • Beat 6 Complete',
        ctaLabel: `📱 Graduate ${p?.name ?? readyGraduateThread.leadId} to iMessage →`,
      };
    } else if (activeVettingThread) {
      const p = getCastProfileById(activeVettingThread.leadId);
      const beatLabel = Math.min(6, activeVettingThread.currentBeat);
      nextStep = {
        targetTab: 'chats',
        leadId: activeVettingThread.leadId,
        stepTag: `Act 2 • Beat ${beatLabel}/6 Vetting`,
        ctaLabel: `💬 Text ${p?.name ?? activeVettingThread.leadId} (Beat ${beatLabel}/6) →`,
      };
    } else if (threads.length === 0) {
      nextStep = {
        targetTab: 'hinge',
        stepTag: 'Act 1 • Spark Your First Match',
        ctaLabel: '📱 Send a Prompt Reply on Hinge →',
      };
    } else {
      nextStep = {
        targetTab: 'wild',
        stepTag: 'Explore Off-App Exclusives',
        ctaLabel: '🗺️ Meet Leads In The Wild →',
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
}) => {
  const activeThreads = threads.filter((t) => !cutLooseIds.includes(t.leadId));
  const summary = computeCampaignProgress({
    wallet,
    threads: activeThreads,
    cubSchoolStars,
    completedCameoCount,
    role,
  });

  // When already on Hinge with 0 matches, offer 1-tap jump to In The Wild so button always advances flow
  const effectiveNextStep: CampaignNextStep =
    activeThreads.length === 0 && activeTab === 'hinge'
      ? {
          targetTab: 'wild',
          stepTag: 'Act 1 • Two Ways to Meet',
          ctaLabel: '🗺️ Or Meet Offline In The Wild (10 Spots) →',
        }
      : summary.nextStep;

  return (
    <section
      data-testid="campaign-compass-bar"
      aria-label="Campaign Progress and Next Step"
      className="editorial-hinge-card rounded-2xl border border-stone-200/90 bg-white/95 px-4 py-3 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Dream Daddy Campaign Level + Progress Bar + Cub School Perk */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#18101E] px-3 py-1 text-xs font-extrabold text-white">
            <Award className="h-3.5 w-3.5 text-amber-300 shrink-0" />
            <span>
              Lv.{summary.level} • {summary.levelTitle}
            </span>
          </div>

          <div
            className="hidden sm:flex items-center gap-2"
            title={`${summary.totalPoints} Campaign Points`}
          >
            <div className="h-2 w-20 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-300"
                style={{ width: `${summary.progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-stone-500">
              {summary.totalDatesCompleted > 0
                ? `${summary.totalDatesCompleted} Date${summary.totalDatesCompleted === 1 ? '' : 's'} ♥`
                : `${summary.totalPoints} pts`}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenCubSchool}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
              summary.etiquetteBonusActive
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-amber-200 bg-amber-50/70 text-amber-950 hover:bg-amber-100'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
            <span>
              {summary.etiquetteBonusActive
                ? `🎓 ${cubSchoolStars}/12 ⭐ (+8% Spark)`
                : `🎓 School ${cubSchoolStars}/12 ⭐ (+8% Perk)`}
            </span>
          </button>
        </div>

        {/* Center: Velvet Book 3-Date Heart Roster Pills (shown outside Chats tab where full roster lives) */}
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 hover:bg-rose-50 hover:border-rose-200 px-2.5 py-1 text-xs font-bold text-[#18101E] transition cursor-pointer"
                  title={`${person.name}: ${t.datesCompleted}/3 Dates Complete`}
                >
                  <img
                    src={vis.primaryPortrait}
                    alt={person.name}
                    className="h-4.5 w-4.5 rounded-full object-cover"
                  />
                  <span>{person.name}</span>
                  <span className="text-rose-600 tracking-tight">
                    {formatThreeDateHearts(t.datesCompleted)}
                  </span>
                  {t.lastDateRank && t.lastDateRank !== 'F' && (
                    <span className="rounded bg-amber-200 px-1 text-[10px] font-black text-[#18101E]">
                      {t.lastDateRank}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Right: Guided 1-Tap Next Action */}
        <div className="flex items-center gap-2">
          <span className="hidden lg:inline text-[11px] font-bold uppercase tracking-wider text-stone-400">
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
            className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-2xs transition cursor-pointer"
          >
            {effectiveNextStep.targetTab === 'wild' ? (
              <Compass className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
            )}
            <span>{effectiveNextStep.ctaLabel}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
