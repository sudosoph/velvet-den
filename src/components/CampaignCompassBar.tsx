import React from 'react';
import {
  ArrowRight,
  Flame,
  Sparkles,
  Users,
} from 'lucide-react';
import { V35_CAST_VISUALS } from '../data/v35AssetManifest';
import { getCastProfileById } from '../data/v35Cast';
import { V35_DATE_SCRIPTS, V35_TABLE_9_CONSPIRACY } from '../data/v35ChatsAndDates';
import type { WalletState } from '../domain/economy';
import type { PlayerRole } from '../domain/taxonomy';
import type { ActiveMatchThread } from './ChatsAndDatesView';
import type { ClubTopTab } from './TopHudBar';
import { Tabs, TabsList, TabsTrigger } from './ui/primitives';

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
  { level: 1, min: 0, nextMin: 40, title: 'Club Newcomer' },
  { level: 2, min: 40, nextMin: 100, title: 'Sharp Flirt & Vetter' },
  { level: 3, min: 100, nextMin: 180, title: 'Inner-Circle Regular' },
  { level: 4, min: 180, nextMin: 280, title: '5-Star Heartthrob' },
  { level: 5, min: 280, nextMin: 380, title: 'Crown Icon of the Club' },
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
  bonusXp = 0,
}: {
  wallet: WalletState;
  threads: ActiveMatchThread[];
  cubSchoolStars: number;
  completedCameoCount: number;
  role: PlayerRole;
  bonusXp?: number;
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
    completedCameoCount * 15 +
    bonusXp;

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
        stepTag: `Friday Night • Date #${nextNum} Ready`,
        ctaLabel: `Date #${nextNum} with ${p?.name ?? readyDateThread.leadId}`,
      };
    } else if (readyGraduateThread) {
      const p = getCastProfileById(readyGraduateThread.leadId);
      nextStep = {
        targetTab: 'chats',
        leadId: readyGraduateThread.leadId,
        stepTag: 'Beat 6 Complete • Real Digits',
        ctaLabel: `Move ${p?.name ?? readyGraduateThread.leadId} to iMessage`,
      };
    } else if (activeVettingThread) {
      const p = getCastProfileById(activeVettingThread.leadId);
      const beatLabel = Math.min(6, activeVettingThread.currentBeat);
      nextStep = {
        targetTab: 'chats',
        leadId: activeVettingThread.leadId,
        stepTag: `Beat ${beatLabel}/6`,
        ctaLabel: `Reply to ${p?.name ?? activeVettingThread.leadId} (${beatLabel}/6)`,
      };
    } else if (threads.length === 0) {
      nextStep = {
        targetTab: 'hinge',
        stepTag: 'Start',
        ctaLabel: 'Send a Prompt Reply',
      };
    } else {
      nextStep = {
        targetTab: 'wild',
        stepTag: 'Offline',
        ctaLabel: 'Explore In The Wild',
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
  bonusXp?: number;
  streakDays?: number;
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
  onOpenCourtroom?: () => void;
  onSendPartnerAudition?: () => void;
  onOpenPassportModal?: () => void;
  onOpenMatchmaking?: () => void;
  onOpenBlindSync?: () => void;
  onOpenRoastLab?: () => void;
  onOpenClubLounge?: (initialMode?: 'hub' | 'quiz') => void;
  onResetHearts?: () => void;
}

export const CampaignCompassBar: React.FC<CampaignCompassBarProps> = ({
  wallet,
  threads,
  cutLooseIds,
  cubSchoolStars,
  completedCameoCount,
  bonusXp = 0,
  role,
  activeTab,
  onSwitchRole,
  onNavigateStep,
  onSelectMatchChat,
  onOpenPassportModal,
  onOpenBlindSync,
  onOpenRoastLab,
  onOpenClubLounge,
  onResetHearts,
}) => {
  const activeThreads = threads.filter((t) => {
    if (cutLooseIds.includes(t.leadId)) return false;
    const profile = getCastProfileById(t.leadId);
    return Boolean(profile && profile.role !== role);
  });

  const summary = computeCampaignProgress({
    wallet,
    threads: activeThreads,
    cubSchoolStars,
    completedCameoCount,
    role,
    bonusXp,
  });

  const heartsDisplay =
    wallet.fridayHearts > 0
      ? '❤️'.repeat(wallet.fridayHearts) + '🤍'.repeat(Math.max(0, 3 - wallet.fridayHearts))
      : '🤍🤍🤍';

  return (
    <section
      data-testid="campaign-compass-bar"
      aria-label="Campaign Progress and Next Step"
      className="w-full border-b border-zinc-200/80 bg-zinc-50/70"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2.5 px-3.5 py-2 sm:px-6">
        {/* LEFT: Sleek Radix Segmented Perspective Toggle + Active Match Avatars (Zero Duplicate Tab Links) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onSwitchRole && (
            <Tabs value={role} onValueChange={(v) => onSwitchRole(v as PlayerRole)}>
              <TabsList className="h-8 bg-zinc-200/70 p-0.5">
                <TabsTrigger value="her" className="h-7 px-2.5 py-1 text-xs">
                  Play as Her
                </TabsTrigger>
                <TabsTrigger value="him" className="h-7 px-2.5 py-1 text-xs">
                  Play as Him
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {activeThreads.length > 0 && activeTab !== 'chats' && (
            <div className="hidden sm:flex items-center gap-2 pl-1">
              {activeThreads.slice(0, 3).map((t) => {
                const person = getCastProfileById(t.leadId);
                const vis = V35_CAST_VISUALS[t.leadId];
                if (!person || !vis) return null;
                return (
                  <button
                    key={t.leadId}
                    type="button"
                    onClick={() => onSelectMatchChat(t.leadId)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-800 hover:border-zinc-300 hover:text-zinc-950 transition-colors cursor-pointer"
                    title={`${person.name}: ${t.datesCompleted}/3 Dates`}
                  >
                    <img
                      src={vis.primaryPortrait}
                      alt={person.name}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                    <span>{person.name}</span>
                    <span className="text-rose-600 text-[11px]">
                      {formatThreeDateHearts(t.datesCompleted)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {(activeThreads.length > 0 || summary.nextStep.openConspiracy) && activeTab !== 'chats' && (
            <button
              type="button"
              onClick={() => onNavigateStep(summary.nextStep)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-3 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <span>{summary.nextStep.ctaLabel}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </button>
          )}
        </div>

        {/* RIGHT: Quiet Utility Actions + Season Tracker + Friday Hearts */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {onOpenRoastLab && (
            <button
              type="button"
              data-testid="open-roast-lab-pill"
              onClick={onOpenRoastLab}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 px-2.5 sm:px-3 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <Flame className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              <span>Profile &amp; Opener Roast</span>
            </button>
          )}

          {onOpenClubLounge && (
            <button
              type="button"
              data-testid="open-archetype-prom-pill"
              onClick={() => onOpenClubLounge('quiz')}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 px-2.5 text-xs font-medium text-zinc-800 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-rose-600 shrink-0" />
              <span>60s Archetype</span>
            </button>
          )}

          {onOpenBlindSync && (
            <button
              type="button"
              onClick={onOpenBlindSync}
              className="hidden md:inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 px-2.5 text-xs font-medium text-zinc-700 transition-colors cursor-pointer"
            >
              <Users className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <span>2P Sync</span>
            </button>
          )}

          <button
            type="button"
            data-testid="hud-season-goal-pill"
            onClick={onOpenPassportModal}
            title="Season Goals: Crown a 3-Date Match & Expose 3 Disguised Traps"
            className="hidden lg:inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 px-2.5 text-xs font-medium text-zinc-700 cursor-pointer"
          >
            <span>
              Dates {Math.min(3, summary.totalDatesCompleted)}/3 · Traps{' '}
              {Math.min(3, cutLooseIds.length)}/3
            </span>
          </button>

          <div
            data-testid="hud-friday-hearts"
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 whitespace-nowrap"
            title="Friday Date Energy (3 Hearts)"
          >
            <span>{heartsDisplay}</span>
            {wallet.fridayHearts === 0 && onResetHearts && (
              <button
                type="button"
                onClick={onResetHearts}
                className="ml-1 rounded bg-zinc-950 px-2 py-0.5 text-[11px] font-semibold text-white cursor-pointer"
              >
                Refill
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
