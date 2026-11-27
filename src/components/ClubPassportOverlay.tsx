import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, CheckCircle2, Flame, Sparkles, X } from 'lucide-react';
import {
  CLUB_PASSPORT_LEVELS,
  resolvePassportLevel,
  XP_BURST_EVENT,
  type XpBurstEventDetail,
} from '../lib/gamification';

interface ClubPassportOverlayProps {
  totalXp: number;
  streakDays: number;
  etiquetteBonusActive: boolean;
  datesCompleted: number;
  trapsDodged: number;
  passportModalOpen: boolean;
  onClosePassportModal: () => void;
  onJumpToMode: (mode: 'hinge' | 'wild' | 'checklist' | 'trivia' | 'school' | 'courtroom') => void;
}

export const ClubPassportOverlay: React.FC<ClubPassportOverlayProps> = ({
  totalXp,
  streakDays,
  etiquetteBonusActive,
  datesCompleted,
  trapsDodged,
  passportModalOpen,
  onClosePassportModal,
  onJumpToMode,
}) => {
  const [bursts, setBursts] = useState<XpBurstEventDetail[]>([]);
  const levelInfo = resolvePassportLevel(totalXp);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onBurst = (e: Event) => {
      const custom = e as CustomEvent<XpBurstEventDetail>;
      if (!custom.detail) return;
      setBursts((prev) => [...prev.slice(-3), custom.detail]);
      window.setTimeout(() => {
        setBursts((prev) => prev.filter((item) => item.id !== custom.detail.id));
      }, 2200);
    };
    window.addEventListener(XP_BURST_EVENT, onBurst);
    return () => window.removeEventListener(XP_BURST_EVENT, onBurst);
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Floating Web-Native +XP & Stamp Slam Celebrations */}
      {bursts.length > 0 && (
        <div
          aria-live="polite"
          className="pointer-events-none fixed right-4 bottom-6 sm:right-8 sm:top-20 sm:bottom-auto z-[80] flex flex-col items-end gap-2"
        >
          {bursts.map((b) => (
            <div
              key={b.id}
              className="animate-xp-float flex items-center gap-2 rounded-2xl border-2 border-amber-300 bg-zinc-950 px-4 py-2.5 text-sm font-extrabold text-white shadow-2xl"
            >
              <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
              {b.amount > 0 && <span className="text-amber-300">+{b.amount} XP</span>}
              <span>{b.label}</span>
              {b.stampText && (
                <span className="animate-stamp-slam rounded-md bg-rose-600 px-2 py-0.5 text-xs uppercase tracking-wider text-white">
                  {b.stampText}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Coherent Game Progression & Level Ladder Modal */}
      {passportModalOpen && (
        <div
          data-testid="club-passport-modal"
          className="fixed inset-0 z-[75] flex items-center justify-center bg-zinc-950/65 p-3 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Sunset Hills Club Passport & Levels"
          onClick={onClosePassportModal}
        >
          <div
            className="editorial-hinge-card flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 flex items-center justify-between gap-3 border-b border-zinc-200 bg-white px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-lg text-white">
                  {levelInfo.spec.badgeEmoji}
                </span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-600">
                    Club Passport • Lv.{levelInfo.spec.level} of 5
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950">
                    {levelInfo.spec.title}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close Club Passport"
                onClick={onClosePassportModal}
                className="rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
              {/* Big Animated XP Progress Bar + Stats */}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-extrabold text-zinc-950 tabular-nums">
                    {totalXp} Club XP
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-xs font-bold text-amber-950">
                    <Flame className="h-3.5 w-3.5 text-rose-600" />
                    <span>{streakDays}-Day Club Streak</span>
                  </span>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-500"
                    style={{ width: `${levelInfo.progressPct}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-zinc-600">
                  <span>
                    {levelInfo.xpNeededForNext > 0
                      ? `${levelInfo.xpNeededForNext} XP to unlock Lv.${levelInfo.spec.level + 1}`
                      : 'Max Crown Icon Tier Reached!'}
                  </span>
                  <span>
                    {etiquetteBonusActive ? '✓ +8% School Spark Active' : 'Pass 4 School Drills for +8% Spark'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="rounded-xl border border-zinc-200 bg-white p-2.5">
                    <div className="text-lg font-extrabold text-zinc-950">{trapsDodged}</div>
                    <div className="text-xs text-zinc-500">Traps Blocked</div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-2.5">
                    <div className="text-lg font-extrabold text-zinc-950">{datesCompleted}</div>
                    <div className="text-xs text-zinc-500">Dates Won</div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-2.5">
                    <div className="text-lg font-extrabold text-zinc-950">Lv.{levelInfo.spec.level}</div>
                    <div className="text-xs text-zinc-500">Club Rank</div>
                  </div>
                </div>
              </div>

              {/* Quick Ways to Earn XP Right Now */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  How Every Mode Levels Up Your Passport
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    {
                      mode: 'checklist' as const,
                      label: '✅ 3-Way Checklist',
                      reward: '+20 XP + Diagnostic Rank',
                    },
                    {
                      mode: 'trivia' as const,
                      label: '🎬 8-Q Trivia Sprint',
                      reward: '+20 XP per Round',
                    },
                    {
                      mode: 'wild' as const,
                      label: '🍸 3-Beat Wild Approach',
                      reward: '+35 XP + Direct Cell',
                    },
                    {
                      mode: 'school' as const,
                      label: '🎓 Cub Obedience School',
                      reward: '+10 XP/Star + 8% Spark',
                    },
                  ].map((act) => (
                    <button
                      key={act.mode}
                      type="button"
                      onClick={() => {
                        onClosePassportModal();
                        onJumpToMode(act.mode);
                      }}
                      className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white hover:border-rose-400 hover:bg-rose-50/30 p-3 text-left transition cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-bold text-zinc-950">{act.label}</div>
                        <div className="text-xs font-semibold text-rose-600">{act.reward}</div>
                      </div>
                      <Award className="h-4 w-4 text-zinc-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* 5-Level Ladder */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  5-Tier Sunset Hills Rank Ladder
                </div>
                <div className="space-y-1.5">
                  {CLUB_PASSPORT_LEVELS.map((tier) => {
                    const unlocked = totalXp >= tier.minXp;
                    return (
                      <div
                        key={tier.level}
                        className={`flex items-start justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-xs ${
                          unlocked
                            ? 'border-emerald-200 bg-emerald-50/50 text-zinc-950'
                            : 'border-zinc-200 bg-white text-zinc-500'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold">
                            {tier.badgeEmoji} Lv.{tier.level}: {tier.title} ({tier.minXp}+ XP)
                          </div>
                          <div className="text-zinc-600">{tier.perkSummary}</div>
                        </div>
                        {unlocked && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body,
  );
};
