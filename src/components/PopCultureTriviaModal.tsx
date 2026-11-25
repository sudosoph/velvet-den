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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Pop-Culture Cougar & Cub Trivia"
    >
      <div className="vice-panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#180c27] p-5 sm:p-7 space-y-5">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded bg-pink-500/25 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-pink-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Celebrity Lore &amp; Pop-Culture Blitz
            </span>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl text-white">
              Cougars &amp; Cubs in Pop Culture Quiz
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border-2 border-black bg-slate-800 p-2 text-slate-200 hover:bg-rose-600 cursor-pointer"
            aria-label="Close Trivia"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {finished ? (
          <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-[#2d123d] to-[#0f262c] p-6 text-center space-y-4">
            <Award className="mx-auto h-12 w-12 text-amber-300" />
            <div className="font-display text-5xl text-white">
              {score} / {POP_CULTURE_TRIVIA.length} CORRECT!
            </div>
            <p className="text-sm text-slate-200">
              {score >= 6
                ? 'Certified Red-Carpet Cougar Historian! Jessica Alba, Sienna Miller, Cher, and Miley would let you sit at Table 1.'
                : 'Solid run—brush up on your Alba, Sienna, Ellie & Miley lore and run it back!'}
            </p>
            {bonusClaimed && (
              <div className="rounded-xl bg-emerald-400/20 border border-emerald-400/50 px-4 py-2 text-xs font-extrabold text-emerald-300">
                🎉 +3 Bonus Den Credits added to your wallet for completing the Pop-Culture Quiz!
              </div>
            )}
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-xl border-2 border-black bg-slate-800 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-slate-700 cursor-pointer"
              >
                Play Quiz Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border-2 border-black bg-amber-400 px-5 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-amber-300 cursor-pointer"
              >
                Back to The Prowl
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="rounded-full bg-amber-400/20 px-3 py-1 text-amber-300">
                {current.badge}
              </span>
              <span className="text-teal-300">
                Question {qIdx + 1} of {POP_CULTURE_TRIVIA.length} • Score: {score}
              </span>
            </div>

            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {current.question}
            </p>

            <div className="grid gap-2.5">
              {current.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === current.correctIndex;
                let style = 'border-black bg-[#231438] text-white hover:bg-[#2d1a47]';
                if (selectedOpt !== null) {
                  if (isCorrect) {
                    style = 'border-emerald-400 bg-emerald-950/80 text-emerald-200';
                  } else if (isSelected) {
                    style = 'border-rose-500 bg-rose-950/80 text-rose-200';
                  } else {
                    style = 'border-black/50 bg-black/30 text-slate-400';
                  }
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handlePick(idx)}
                    className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm font-bold transition cursor-pointer ${style}`}
                  >
                    <span>{opt}</span>
                    {selectedOpt !== null && isCorrect && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOpt !== null && (
              <div className="rounded-2xl border-2 border-teal-400/50 bg-[#10232d] p-4 space-y-3">
                <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                  <strong className="text-amber-300">
                    {selectedOpt === current.correctIndex ? '✨ Nailed it! ' : '👀 Plot twist: '}
                  </strong>
                  {current.funFact}
                </p>
                <button
                  type="button"
                  onClick={handleNext}
                  className="vice-panel rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 px-5 py-2 text-xs font-extrabold uppercase text-slate-950 cursor-pointer"
                >
                  {qIdx + 1 >= POP_CULTURE_TRIVIA.length ? 'See Quiz Verdict →' : 'Next Question →'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
