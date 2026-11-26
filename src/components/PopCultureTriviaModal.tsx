import React, { useState } from 'react';
import { Award, CheckCircle2, Share2, Sparkles, X } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { POP_CULTURE_TRIVIA } from '../data/popCultureTrivia';
import { trackEvent } from '../lib/analytics';
import { sfx } from '../lib/sound';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

interface PopCultureTriviaModalProps {
  open: boolean;
  referralCode?: string;
  onClose: () => void;
  onEarnTriviaReward: (rewardKey: string, credits: number) => boolean;
}

export const PopCultureTriviaModal: React.FC<PopCultureTriviaModalProps> = ({
  open,
  referralCode,
  onClose,
  onEarnTriviaReward,
}) => {
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [stampUnlocked, setStampUnlocked] = useState(false);
  const [imgHidden, setImgHidden] = useState<Record<string, boolean>>({});
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  if (!open) return null;

  const current = POP_CULTURE_TRIVIA[qIdx];

  const handlePick = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    const correct = idx === current.correctIndex;
    setHistory((prev) => [...prev, correct]);
    if (correct) {
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
      const granted = onEarnTriviaReward('pop_culture_trivia_ace', 0);
      if (granted) setStampUnlocked(true);
      trackEvent('trivia_completed', {
        score,
        total: POP_CULTURE_TRIVIA.length,
      });
      return;
    }
    setSelectedOpt(null);
    setQIdx((i) => i + 1);
  };

  const handleRestart = () => {
    setQIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setHistory([]);
    setFinished(false);
  };

  const openQuizShareSheet = () => {
    const grid = history
      .slice(0, 10)
      .map((ok) => (ok ? '🟩' : '⬛'))
      .join('');
    const refQuery = referralCode ? `&ref=${encodeURIComponent(referralCode)}` : '';
    const quizUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?quiz=1${refQuery}`;
    const rankLabel =
      score >= 16
        ? 'Red-Carpet Cougar Historian'
        : score >= 11
          ? 'Front-Row Club Insider'
          : 'Rising Den Contender';
    const message = `🐆🎬 Cougars & Cubs Pop-Culture Quiz: ${score}/${POP_CULTURE_TRIVIA.length} (${rankLabel})\n${grid}\nCan you beat my score?`;
    setSharePayload({
      title: `Share Quiz Score (${score}/${POP_CULTURE_TRIVIA.length})`,
      message,
      url: quizUrl,
      shareSurface: 'pop_quiz',
      discordMarkdown: `**🐆🎬 Cougars & Cubs Pop-Culture Quiz: ${score}/${POP_CULTURE_TRIVIA.length}** (${rankLabel})\n${grid}\nPlay free: ${quizUrl}`,
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1022]/60 p-3 sm:p-6 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Pop-Culture Cougar & Cub Trivia"
      >
        <div className="vice-panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-5 sm:p-7 space-y-5">
          <div className="flex items-start justify-between gap-3 border-b-2 border-[#1E1022]/12 pb-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1E1022] bg-[#FFE3EC] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#D90452]">
                <Sparkles className="h-3.5 w-3.5" /> Celebrity Lore &amp; Cinema Blitz
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
            <div className="rounded-3xl border-2 border-[#1E1022] bg-[#FFFBEB] p-6 sm:p-7 text-center space-y-4">
              <Award className="mx-auto h-12 w-12 text-[#FF2E63]" />
              <div className="font-display text-4xl sm:text-5xl text-[#1E1022]">
                {score} / {POP_CULTURE_TRIVIA.length} Correct!
              </div>
              <div className="text-lg tracking-widest select-all">
                {history.map((ok, i) => (
                  <span key={i}>{ok ? '🟩' : '⬛'}</span>
                ))}
              </div>
              <p className="text-base font-medium text-[#34223B] leading-relaxed">
                {score >= 14
                  ? 'Certified Red-Carpet Cougar Historian! Angela Bassett, Tina Turner, Cher, Priyanka, and Sienna would wave you right to Table 1.'
                  : 'Solid run! Brush up on your Stella, Tina Turner, Alba, Sienna & Miley lore and run it back.'}
              </p>
              {stampUnlocked && (
                <div className="rounded-2xl bg-[#D1FAE5] border-2 border-[#1E1022] px-4 py-3 text-sm font-extrabold text-[#065F46]">
                  🏆 Unlocked the Pop-Culture Historian Stamp in your Field Guide!
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={openQuizShareSheet}
                  className="pop-btn inline-flex items-center gap-2 rounded-2xl bg-[#FFBE0B] px-5 py-3 text-sm font-extrabold text-[#1E1022] cursor-pointer"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share Score Card (🐆🎬 {score}/{POP_CULTURE_TRIVIA.length})</span>
                </button>
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
                  Back to Club
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-extrabold">
                <span className="rounded-full bg-[#FFBE0B] border-2 border-[#1E1022] px-3.5 py-1 text-[#1E1022]">
                  {current.badge}
                </span>
                <span className="text-[#5A4664]">
                  Question {qIdx + 1} of {POP_CULTURE_TRIVIA.length} • Score: {score}
                </span>
              </div>

              {!imgHidden[current.id] && (
                <figure className="overflow-hidden rounded-2xl border-2 border-[#1E1022] bg-[#FFF7F0]">
                  <div className="flex items-center justify-center bg-[#1E1022]/5 p-2">
                    <img
                      src={current.imageUrl}
                      alt={current.badge}
                      loading="lazy"
                      onError={() =>
                        setImgHidden((prev) => ({ ...prev, [current.id]: true }))
                      }
                      className="h-44 w-36 rounded-xl border border-[#1E1022]/20 object-cover object-top"
                    />
                  </div>
                  <figcaption className="border-t border-[#1E1022]/10 bg-white px-3 py-1.5 text-center text-[11px] font-semibold text-[#5A4664]">
                    {current.imageCredit}
                  </figcaption>
                </figure>
              )}

              <p className="text-lg font-extrabold text-[#1E1022] leading-relaxed">
                {current.question}
              </p>

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
                  <p className="text-sm font-semibold text-[#1E1022] leading-relaxed">
                    {current.funFact}
                  </p>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="pop-btn w-full rounded-2xl bg-[#FF2E63] py-3 font-display text-lg text-white cursor-pointer"
                  >
                    {qIdx + 1 >= POP_CULTURE_TRIVIA.length
                      ? 'See Final Score & Share Card →'
                      : 'Next Celebrity Question →'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </>
  );
};
