import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckSquare,
  Compass,
  Film,
  GraduationCap,
  Heart,
  Scale,
  Send,
  Sparkles,
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
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-5 space-y-4">
          {/* Top Row: Clean Stacked Headline + Badges (Zero Dot-Soup) + Role Switcher */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                  Older Women × Younger Men
                </span>
                <span
                  data-testid="hud-friday-hearts"
                  className="rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700"
                  title="Friday Date Energy (3 Hearts)"
                >
                  {heartsDisplay} 3 Hearts
                </span>
                <button
                  type="button"
                  onClick={onOpenPassportModal}
                  className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 px-2.5 py-0.5 text-xs font-bold text-zinc-900 transition-colors cursor-pointer"
                >
                  <Award className="h-3.5 w-3.5 text-rose-600" />
                  <span>
                    Lv.{summary.level} {summary.levelTitle}
                  </span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 leading-snug">
                How do you want to play tonight?
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onSwitchRole && (
                <div className="inline-flex rounded-xl bg-zinc-100 p-1">
                  <button
                    type="button"
                    onClick={() => onSwitchRole('her')}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer',
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
                      'rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer',
                      role === 'him'
                        ? 'bg-zinc-950 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-950',
                    )}
                  >
                    Play as Him (Cub)
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowModeGrid(false);
                  setCollapsedHomeLobby(true);
                }}
                className="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
              >
                Hide Modes
              </button>
            </div>
          </div>

          {/* 4 First-Class Game Modes (Clean shadcn Cards, Zero Spec Clutter) */}
          <div
            data-testid="club-onboarding-mode-grid"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="group flex flex-col justify-between rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-4 transition hover:border-rose-400">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white">
                    <Heart className="h-4 w-4" />
                  </span>
                  <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                    Dating Sim
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-950">Prowl &amp; Offline Dates</h3>
                <p className="text-xs text-zinc-600 leading-snug">
                  Match on Prowl or meet offline out in town, spot disguised red flags, and go on 3 dates.
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <a
                  href="#hinge-stage"
                  onClick={() => setShowModeGrid(false)}
                  className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-700 px-3 text-xs font-bold text-white transition-colors"
                >
                  <span>Browse Prowl ↓</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setShowModeGrid(false);
                    onOpenWildMap();
                  }}
                  className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 px-2.5 text-xs font-bold text-zinc-900 cursor-pointer"
                >
                  <Compass className="h-3.5 w-3.5 text-rose-600" />
                  <span>In The Wild</span>
                </button>
              </div>
            </div>

            {onOpenChecklist && (
              <button
                type="button"
                onClick={() => {
                  setShowModeGrid(false);
                  onOpenChecklist();
                }}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white hover:border-zinc-900 p-4 text-left transition cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
                      <CheckSquare className="h-4 w-4" />
                    </span>
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-bold text-zinc-800">
                      Score 0 to 100
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-950">
                    &ldquo;Have You Ever?&rdquo; Checklist
                  </h3>
                  <p className="text-xs text-zinc-600 leading-snug">
                    Cougars Only, Cubs Only, and Couples Date-Night editions with full score meaning.
                  </p>
                </div>
                <span className="mt-3 inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg bg-zinc-950 group-hover:bg-rose-600 px-3 text-xs font-bold text-white transition-colors">
                  <span>Take Checklist</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            )}

            {onOpenPopTrivia && (
              <button
                type="button"
                onClick={() => {
                  setShowModeGrid(false);
                  onOpenPopTrivia();
                }}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white hover:border-zinc-900 p-4 text-left transition cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-900">
                      <Film className="h-4 w-4" />
                    </span>
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-bold text-zinc-800">
                      Easy or Hard
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-950">Pop-Culture Trivia</h3>
                  <p className="text-xs text-zinc-600 leading-snug">
                    8-question rounds across Movies, TV, Books, Celebs, Sports, Royals &amp; 90s vs. Gen-Z.
                  </p>
                </div>
                <span className="mt-3 inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg bg-zinc-950 group-hover:bg-rose-600 px-3 text-xs font-bold text-white transition-colors">
                  <span>Play Trivia</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            )}

            <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white hover:border-zinc-400 p-4 transition">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                    Etiquette &amp; Tea
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-950">Cub School &amp; Courtroom</h3>
                <p className="text-xs text-zinc-600 leading-snug">
                  Train rookie Cubs in Obedience School or vote on real Crown-or-Dump cases.
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowModeGrid(false);
                    onOpenCubSchool();
                  }}
                  className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 px-2.5 text-xs font-bold text-white cursor-pointer"
                >
                  <span>Cub School</span>
                </button>
                {onOpenCourtroom && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowModeGrid(false);
                      onOpenCourtroom();
                    }}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 px-2.5 text-xs font-bold text-rose-600 cursor-pointer"
                  >
                    <Scale className="h-3.5 w-3.5" />
                    <span>Daily Court</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Matchmaking / Astro / Partner Audition Strip (Clean Separate Links, Zero Dots) */}
          {(onOpenMatchmaking || onSendPartnerAudition || onOpenGuides) && (
            <div className="pt-1 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 text-xs font-semibold text-zinc-600">
              <div className="flex flex-wrap items-center gap-2">
                {streakDays > 0 && (
                  <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-amber-900">
                    🔥 Day {streakDays} Streak
                  </span>
                )}
                {onOpenMatchmaking && (
                  <button
                    type="button"
                    onClick={onOpenMatchmaking}
                    className="inline-flex items-center gap-1 font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    <span>🥂 Join Real-Life Matchmaking &amp; Discord Waitlist →</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {onSendPartnerAudition && (
                  <button
                    type="button"
                    onClick={onSendPartnerAudition}
                    className="inline-flex items-center gap-1 text-zinc-800 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5 text-rose-600" />
                    <span>Send 60s Partner Audition →</span>
                  </button>
                )}
                {onOpenGuides && (
                  <button
                    type="button"
                    onClick={onOpenGuides}
                    className="inline-flex items-center gap-1 text-zinc-700 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <span>Astro Pairing &amp; Photo Listicles →</span>
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
              Lv.{summary.level} {summary.levelTitle}
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
