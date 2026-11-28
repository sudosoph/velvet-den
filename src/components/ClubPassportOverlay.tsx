import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Flame, Sparkles, X } from 'lucide-react';
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
            className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 flex items-center justify-between gap-3 border-b border-zinc-200 bg-white px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-base text-white">
                  {levelInfo.spec.badgeEmoji}
                </span>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-950">
                  Club Passport · Lv.{levelInfo.spec.level} {levelInfo.spec.title}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close Club Passport"
                onClick={onClosePassportModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
              {/* Big Animated XP Progress Bar + Stats */}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-bold text-zinc-950 tabular-nums">
                    {totalXp} Club XP
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                    <Flame className="h-3.5 w-3.5 text-rose-600" />
                    <span>{streakDays}-Day Streak</span>
                  </span>
                </div>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className="h-full rounded-full bg-rose-600 transition-all duration-500"
                    style={{ width: `${levelInfo.progressPct}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-zinc-600">
                  <span>
                    {levelInfo.xpNeededForNext > 0
                      ? `${levelInfo.xpNeededForNext} XP to Lv.${levelInfo.spec.level + 1}`
                      : 'Max Crown Icon Tier Reached'}
                  </span>
                  <span>
                    {etiquetteBonusActive ? '✓ +8% School Spark Active' : '4 School Stars unlocks +8% Spark'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="rounded-xl border border-zinc-200 bg-white p-2.5">
                    <div className="text-lg font-bold text-zinc-950">{trapsDodged}</div>
                    <div className="text-xs text-zinc-500">Traps Blocked</div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-2.5">
                    <div className="text-lg font-bold text-zinc-950">{datesCompleted}</div>
                    <div className="text-xs text-zinc-500">Dates Won</div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-2.5">
                    <div className="text-lg font-bold text-zinc-950">Lv.{levelInfo.spec.level}</div>
                    <div className="text-xs text-zinc-500">Club Rank</div>
                  </div>
                </div>
              </div>

              {/* Quick Ways to Earn XP */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-zinc-950">Earn XP</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    {
                      mode: 'checklist' as const,
                      label: '✅ 3-Way Checklist',
                      reward: '+20 XP',
                    },
                    {
                      mode: 'trivia' as const,
                      label: '🎬 8-Q Trivia Sprint',
                      reward: '+20 XP',
                    },
                    {
                      mode: 'wild' as const,
                      label: '🍸 Wild Approach',
                      reward: '+35 XP',
                    },
                    {
                      mode: 'school' as const,
                      label: '🎓 Cub School',
                      reward: '+10 XP/Star',
                    },
                  ].map((act) => (
                    <button
                      key={act.mode}
                      type="button"
                      onClick={() => {
                        onClosePassportModal();
                        onJumpToMode(act.mode);
                      }}
                      className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 p-3 text-left transition cursor-pointer"
                    >
                      <span className="text-sm font-medium text-zinc-950">{act.label}</span>
                      <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
                        {act.reward}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5-Level Ladder */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-zinc-950">Club Levels</h3>
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
                          <div className="font-semibold">
                            {tier.badgeEmoji} Lv.{tier.level} · {tier.title} ({tier.minXp}+ XP)
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
