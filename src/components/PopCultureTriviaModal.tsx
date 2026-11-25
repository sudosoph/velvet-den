import React, { useState } from 'react';
import { Award, CheckCircle2, Sparkles, X } from 'lucide-react';
import { POP_CULTURE_TRIVIA } from '../data/popCultureTrivia';
import { sfx } from '../lib/sound';

interface PopCultureTriviaModalProps {
  open: boolean;
  onClose: () => void;
  onEarnTriviaReward: (rewardKey: string, credits: number) => boolean;
}

export const PopCultureTriviaModal: React.FC<PopCultureTriviaModalProps> = ({
  open,
  onClose,
  onEarnTriviaReward,
}) => {
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);

  if (!open) return null;

  const current = POP_CULTURE_TRIVIA[qIdx];

  const handlePick = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === current.correctIndex) {
      sfx.greenFlag();
      setScore((s) => s + 1);
    } else {
      sfx.redFlag();
    }
  };

  const handleNext = () => {
    if (qIdx + 1 >= POP_CULTURE_TRIVIA.length) {
      sfx.victoryFanfare();
      setFinished(true);
      const granted = onEarnTriviaReward('pop_culture_trivia_ace', 3);
      if (granted) setBonusClaimed(true);
      return;
    }
    setSelectedOpt(null);
    setQIdx((i) => i + 1);
  };

  const handleRestart = () => {
    setQIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Pop-Culture Cougar & Cub Trivia"
    >
      <div className="vice-panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#150f24]/95 p-6 sm:p-8 space-y-5">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Celebrity Lore &amp; Pop-Culture Blitz
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-white">
              Cougars &amp; Cubs in Pop Culture Quiz
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-slate-200 hover:bg-rose-500 hover:text-white transition cursor-pointer"
            aria-label="Close Trivia"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {finished ? (
          <div className="rounded-3xl border border-amber-300/35 bg-white/5 p-7 text-center space-y-4">
            <Award className="mx-auto h-12 w-12 text-amber-300" />
            <div className="font-display text-4xl sm:text-5xl text-white">
              {score} / {POP_CULTURE_TRIVIA.length} Correct!
            </div>
            <p className="text-base text-slate-200 leading-relaxed">
              {score >= 6
                ? 'Certified Red-Carpet Cougar Historian! Jessica Alba, Sienna Miller, Cher, and Miley would let you sit at Table 1.'
                : 'Solid run—brush up on your Alba, Sienna, Ellie & Miley lore and run it back!'}
            </p>
            {bonusClaimed && (
              <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/40 px-4 py-3 text-sm font-semibold text-emerald-200">
                🎉 +3 Bonus Club Credits added to your wallet for completing the Pop-Culture Quiz!
              </div>
            )}
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition cursor-pointer"
              >
                Play Quiz Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl bg-amber-300 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-amber-200 transition cursor-pointer"
              >
                Back to Game
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
              <span className="rounded-full bg-amber-400/15 border border-amber-300/30 px-3.5 py-1 text-amber-200">
                {current.badge}
              </span>
              <span className="text-slate-300">
                Question {qIdx + 1} of {POP_CULTURE_TRIVIA.length} • Score: {score}
              </span>
            </div>

            <p className="text-lg font-bold text-white leading-relaxed">{current.question}</p>

            <div className="grid gap-3">
              {current.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === current.correctIndex;
                let style = 'border-white/14 bg-white/[0.05] text-white hover:bg-white/[0.09]';
                if (selectedOpt !== null) {
                  if (isCorrect) {
                    style = 'border-emerald-400/70 bg-emerald-950/70 text-emerald-200';
                  } else if (isSelected) {
                    style = 'border-rose-500/70 bg-rose-950/70 text-rose-200';
                  } else {
                    style = 'border-white/5 bg-black/25 text-slate-500';
                  }
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handlePick(idx)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-base font-medium transition cursor-pointer ${style}`}
                  >
                    <span>{opt}</span>
                    {selectedOpt !== null && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOpt !== null && (
              <div className="animate-stage-in rounded-2xl border border-amber-300/35 bg-amber-400/10 p-4 space-y-3">
                <p className="text-sm text-amber-100 leading-relaxed">{current.funFact}</p>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 py-3 font-display text-lg text-slate-950 shadow hover:brightness-105 transition cursor-pointer"
                >
                  {qIdx + 1 >= POP_CULTURE_TRIVIA.length
                    ? 'See Final Trivia Rank (+3 Free Credits) →'
                    : 'Next Celebrity Question →'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
