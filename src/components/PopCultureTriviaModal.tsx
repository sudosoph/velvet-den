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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1022]/60 p-3 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Pop-Culture Cougar & Cub Trivia"
    >
      <div className="vice-panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex items-start justify-between gap-3 border-b-2 border-[#1E1022]/12 pb-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1E1022] bg-[#FFE3EC] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#D90452]">
              <Sparkles className="h-3.5 w-3.5" /> Celebrity Lore &amp; Pop-Culture Blitz
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#1E1022]">
              Cougars &amp; Cubs in Pop Culture Quiz
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pop-btn rounded-xl bg-[#FFF4F7] p-2.5 text-[#1E1022] hover:bg-[#FF2E63] hover:text-white cursor-pointer"
            aria-label="Close Trivia"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {finished ? (
          <div className="rounded-3xl border-2 border-[#1E1022] bg-[#FFFBEB] p-7 text-center space-y-4">
            <Award className="mx-auto h-12 w-12 text-[#FF2E63]" />
            <div className="font-display text-4xl sm:text-5xl text-[#1E1022]">
              {score} / {POP_CULTURE_TRIVIA.length} Correct!
            </div>
            <p className="text-base font-medium text-[#34223B] leading-relaxed">
              {score >= 6
                ? 'Certified Red-Carpet Cougar Historian! Jessica Alba, Sienna Miller, Cher, and Miley would let you sit at Table 1.'
                : 'Solid run, brush up on your Alba, Sienna, Ellie & Miley lore and run it back!'}
            </p>
            {bonusClaimed && (
              <div className="rounded-2xl bg-[#D1FAE5] border-2 border-[#1E1022] px-4 py-3 text-sm font-extrabold text-[#065F46]">
                🎉 +3 Bonus Club Credits added to your wallet for completing the Pop-Culture Quiz!
              </div>
            )}
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="pop-btn rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-[#1E1022] cursor-pointer"
              >
                Play Quiz Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="pop-btn rounded-2xl bg-[#FF2E63] px-6 py-3 text-sm font-extrabold text-white cursor-pointer"
              >
                Back to Game
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold">
              <span className="rounded-full bg-[#FFBE0B] border-2 border-[#1E1022] px-3.5 py-1 text-[#1E1022]">
                {current.badge}
              </span>
              <span className="text-[#5A4664]">
                Question {qIdx + 1} of {POP_CULTURE_TRIVIA.length} • Score: {score}
              </span>
            </div>

            <p className="text-lg font-extrabold text-[#1E1022] leading-relaxed">{current.question}</p>

            <div className="grid gap-3">
              {current.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === current.correctIndex;
                let style = 'border-[#1E1022] bg-white text-[#1E1022] hover:bg-[#FFF4F7]';
                if (selectedOpt !== null) {
                  if (isCorrect) {
                    style = 'border-[#1E1022] bg-[#D1FAE5] text-[#065F46]';
                  } else if (isSelected) {
                    style = 'border-[#1E1022] bg-[#FFE4E6] text-[#9F1239]';
                  } else {
                    style = 'border-[#1E1022]/20 bg-[#FFF7F0] text-[#5A4664]';
                  }
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handlePick(idx)}
                    className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left text-base font-bold transition cursor-pointer ${style}`}
                  >
                    <span>{opt}</span>
                    {selectedOpt !== null && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#065F46]" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOpt !== null && (
              <div className="animate-stage-in rounded-2xl border-2 border-[#1E1022] bg-[#FFFBEB] p-4 space-y-3">
                <p className="text-sm font-semibold text-[#1E1022] leading-relaxed">{current.funFact}</p>
                <button
                  type="button"
                  onClick={handleNext}
                  className="pop-btn w-full rounded-2xl bg-[#FF2E63] py-3 font-display text-lg text-white cursor-pointer"
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
