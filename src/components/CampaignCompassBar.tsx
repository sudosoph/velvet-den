import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckSquare,
  Compass,
  Film,
  Flame,
  GraduationCap,
  Heart,
  Scale,
  Send,
  Sparkles,
  Users,
} from 'lucide-react';
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
        ctaLabel: `Launch Date #${nextNum} with ${p?.name ?? readyDateThread.leadId}`,
      };
    } else if (readyGraduateThread) {
      const p = getCastProfileById(readyGraduateThread.leadId);
      nextStep = {
        targetTab: 'chats',
        leadId: readyGraduateThread.leadId,
        stepTag: 'Beat 6 Complete • Real Digits',
        ctaLabel: `Graduate ${p?.name ?? readyGraduateThread.leadId} to iMessage`,
      };
    } else if (activeVettingThread) {
      const p = getCastProfileById(activeVettingThread.leadId);
      const beatLabel = Math.min(6, activeVettingThread.currentBeat);
      nextStep = {
        targetTab: 'chats',
        leadId: activeVettingThread.leadId,
        stepTag: `Vetting Filter • Beat ${beatLabel}/6`,
        ctaLabel: `Text ${p?.name ?? activeVettingThread.leadId} (Beat ${beatLabel}/6)`,
      };
    } else if (threads.length === 0) {
      nextStep = {
        targetTab: 'hinge',
        stepTag: 'Spark Your First Match',
        ctaLabel: 'Send a Prompt Reply on Prowl',
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
  streakDays = 1,
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
  onOpenCourtroom,
  onSendPartnerAudition,
  onOpenPassportModal,
  onOpenMatchmaking,
  onOpenBlindSync,
  onOpenRoastLab,
  onOpenClubLounge,
  onResetHearts,
}) => {
  const [showModeGrid, setShowModeGrid] = useState(false);
  const [collapsedHomeLobby, setCollapsedHomeLobby] = useState(false);
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

  const shouldShowModeLauncher =
    (activeTab === 'hinge' && !collapsedHomeLobby) || showModeGrid;

  if (shouldShowModeLauncher) {
    return (
      <section
        data-testid="campaign-compass-bar"
        aria-label="Campaign Progress and Next Step"
        className="w-full border-b border-zinc-200 bg-white"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 space-y-2.5">
          {/* Row 1: Story-First Dating Sim HUD (Prowl vs. Out In The Wild + Live Inbox + Role Switcher) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {onSwitchRole && (
                <div className="inline-flex rounded-xl bg-zinc-100 p-1">
                  <button
                    type="button"
                    onClick={() => onSwitchRole('her')}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
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
                      'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                      role === 'him'
                        ? 'bg-zinc-950 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-950',
                    )}
                  >
                    Play as Him (Cub)
                  </button>
                </div>
              )}

              <a
                href="#hinge-stage"
                onClick={() => setShowModeGrid(false)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-3 text-xs font-semibold text-white transition-colors"
              >
                <Heart className="h-3.5 w-3.5" />
                <span>Prowl App</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowModeGrid(false);
                  onOpenWildMap();
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white hover:border-zinc-900 hover:bg-zinc-50 px-3 text-xs font-semibold text-zinc-900 transition-colors cursor-pointer"
              >
                <Compass className="h-3.5 w-3.5 text-rose-600" />
                <span>In The Wild · Read IRL Signals</span>
              </button>

              {activeThreads.length > 0 && (
                <button
                  type="button"
                  onClick={() => onNavigateStep(summary.nextStep)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 px-2.5 text-xs font-semibold text-rose-700 transition-colors cursor-pointer"
                >
                  <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                  <span>{summary.nextStep.ctaLabel}</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                data-testid="hud-season-goal-pill"
                onClick={onOpenPassportModal}
                title="Season Goals: Crown a 3-Date Match & Expose 3 Disguised Traps"
                className="hidden md:inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-2.5 text-xs font-semibold text-zinc-800 cursor-pointer"
              >
                <span>
                  🏆 Dates {Math.min(3, summary.totalDatesCompleted)}/3 · Traps{' '}
                  {Math.min(3, cutLooseIds.length)}/3
                </span>
              </span>
              <span
                data-testid="hud-friday-hearts"
                className="inline-flex h-8 items-center rounded-lg bg-zinc-100 px-2.5 text-xs font-semibold text-zinc-700"
                title="Friday Date Energy (3 Hearts)"
              >
                {heartsDisplay}
              </span>
              <button
                type="button"
                onClick={onOpenPassportModal}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 px-2.5 text-xs font-semibold text-zinc-900 transition-colors cursor-pointer"
              >
                <Award className="h-3.5 w-3.5 text-rose-600" />
                <span>
                  Rank {summary.level}/5 · {summary.levelTitle}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModeGrid(false);
                  setCollapsedHomeLobby(true);
                }}
                className="inline-flex h-8 items-center rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer"
              >
                Compact
              </button>
            </div>
          </div>

          {/* Row 2: Slim Secondary Club Lounge & Side-Activities Strip (Keeps Story Profiles Above the Fold!) */}
          <div
            data-testid="club-onboarding-mode-grid"
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50/90 px-3 py-2"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-white border border-rose-200 px-2.5 text-xs font-semibold text-rose-700">
                <Heart className="h-3.5 w-3.5" />
                <span>Prowl &amp; Offline Dates</span>
              </span>

              {onOpenClubLounge && (
                <button
                  type="button"
                  data-testid="open-archetype-prom-pill"
                  onClick={() => {
                    setShowModeGrid(false);
                    onOpenClubLounge('quiz');
                  }}
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 px-2.5 text-xs font-semibold text-rose-800 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-rose-600" />
                  <span>60s Archetype Run</span>
                </button>
              )}

              {onOpenChecklist && (
                <button
                  type="button"
                  onClick={() => {
                    setShowModeGrid(false);
                    onOpenChecklist();
                  }}
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-900 px-2.5 text-xs font-medium text-zinc-800 transition-colors cursor-pointer"
                >
                  <CheckSquare className="h-3.5 w-3.5 text-amber-600" />
                  <span>&ldquo;Have You Ever?&rdquo; Checklist</span>
                </button>
              )}

              {onOpenPopTrivia && (
                <button
                  type="button"
                  onClick={() => {
                    setShowModeGrid(false);
                    onOpenPopTrivia();
                  }}
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-900 px-2.5 text-xs font-medium text-zinc-800 transition-colors cursor-pointer"
                >
                  <Film className="h-3.5 w-3.5 text-sky-600" />
                  <span>Pop-Culture Trivia</span>
                </button>
              )}

              {onOpenBlindSync && (
                <button
                  type="button"
                  onClick={() => {
                    setShowModeGrid(false);
                    onOpenBlindSync();
                  }}
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-rose-200 bg-white hover:border-rose-500 px-2.5 text-xs font-semibold text-rose-700 transition-colors cursor-pointer"
                >
                  <Users className="h-3.5 w-3.5 text-rose-600" />
                  <span>2P Blind Sync</span>
                </button>
              )}

              {onOpenRoastLab && (
                <button
                  type="button"
                  data-testid="open-roast-lab-pill"
                  onClick={() => {
                    setShowModeGrid(false);
                    onOpenRoastLab();
                  }}
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-zinc-950 hover:bg-rose-600 px-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <Flame className="h-3.5 w-3.5 text-amber-300" />
                  <span>Roast My Opener</span>
                </button>
              )}

              <div className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-0.5 text-xs">
                <GraduationCap className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                <span className="sr-only">Cub School &amp; Courtroom</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowModeGrid(false);
                    onOpenCubSchool();
                  }}
                  className="rounded px-1.5 py-0.5 font-medium text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
                >
                  Cub School
                </button>
                {onOpenCourtroom && (
                  <>
                    <span className="text-zinc-300">/</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModeGrid(false);
                        onOpenCourtroom();
                      }}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Scale className="h-3 w-3" />
                      <span>Courtroom</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-zinc-600">
              {streakDays > 0 && (
                <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-amber-900 font-semibold">
                  🔥 Day {streakDays}
                </span>
              )}
              {onOpenMatchmaking && (
                <button
                  type="button"
                  onClick={onOpenMatchmaking}
                  className="font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  🥂 Matchmaking &amp; Discord →
                </button>
              )}
              {onSendPartnerAudition && (
                <button
                  type="button"
                  onClick={onSendPartnerAudition}
                  className="inline-flex items-center gap-1 text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <Send className="h-3 w-3 text-rose-600" />
                  <span>60s Audition</span>
                </button>
              )}
              {onOpenGuides && (
                <button
                  type="button"
                  onClick={onOpenGuides}
                  className="inline-flex items-center gap-1 text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  <span>Astro &amp; Guides</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const effectiveNextStep: CampaignNextStep =
    activeThreads.length === 0 && activeTab === 'hinge'
      ? {
          targetTab: 'wild',
          stepTag: 'Meet Offline',
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
        {/* Left: Clean Progress Summary + Visible XP Progress Bar (Zero Dot-Soup) */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-zinc-600">
          <button
            type="button"
            onClick={onOpenPassportModal}
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 font-semibold text-zinc-950 whitespace-nowrap hover:border-rose-300 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Award className="h-3.5 w-3.5 text-rose-600 shrink-0" />
            <span>
              Rank {summary.level}/5 · {summary.levelTitle}
            </span>
            <span className="hidden sm:inline-block h-2 w-14 overflow-hidden rounded-full bg-zinc-200">
              <span
                className="block h-full rounded-full bg-rose-600 transition-all duration-300"
                style={{ width: `${summary.progressPercent}%` }}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCollapsedHomeLobby(false);
              setShowModeGrid(true);
            }}
            className="inline-flex h-8 items-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 text-xs font-semibold text-zinc-700 cursor-pointer"
          >
            All 4 Game Modes
          </button>

          <div
            data-testid="hud-friday-hearts"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-zinc-100 px-2.5 whitespace-nowrap"
            title="Friday Date Energy (3 Hearts)"
          >
            <span>{heartsDisplay}</span>
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
              'inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
              summary.etiquetteBonusActive
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold'
                : 'text-zinc-600 hover:text-zinc-950',
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

        {/* Right: Single Bold Poppy Next-Action Button (Hidden on In The Wild so exploring venues never nudges into Chat) */}
        {activeTab !== 'wild' && (
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
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-4 text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer"
            >
              <span>{effectiveNextStep.ctaLabel}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
