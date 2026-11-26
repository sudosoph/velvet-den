import React, { useState } from 'react';
import { Award, CheckCircle2, ExternalLink, Share2, Sparkles, X } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { POP_CULTURE_TRIVIA } from '../data/popCultureTrivia';
import { buildAffiliateUrl, getAffiliateById } from '../lib/affiliates';
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
  const matchedAffiliate = current.affiliateId ? getAffiliateById(current.affiliateId) : undefined;

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
      .slice(0, 12)
      .map((ok) => (ok ? '🟩' : '⬛'))
      .join('');
    const refQuery = referralCode ? `&ref=${encodeURIComponent(referralCode)}` : '';
    const quizUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?quiz=1${refQuery}`;
    const rankLabel =
      score >= 42
        ? 'Red-Carpet Cougar Historian'
        : score >= 26
          ? 'Front-Row Club Insider'
          : 'Rising Den Contender';
    const message = `🐆🎬 Cougars & Cubs Trailer & Pop-Culture Quiz: ${score}/${POP_CULTURE_TRIVIA.length} (${rankLabel})\n${grid}\nCan you beat my score?`;
    setSharePayload({
      title: `Share Quiz Score (${score}/${POP_CULTURE_TRIVIA.length})`,
      message,
      url: quizUrl,
      shareSurface: 'pop_quiz',
      discordMarkdown: `**🐆🎬 Cougars & Cubs Trailer & Pop-Culture Quiz: ${score}/${POP_CULTURE_TRIVIA.length}** (${rankLabel})\n${grid}\nPlay free: ${quizUrl}`,
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#18101E]/65 p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Pop-Culture Cougar & Cub Trivia"
        onClick={onClose}
      >
        <div
          className="editorial-hinge-card relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#FFFDF9] p-5 sm:p-7 space-y-5 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-rose-700">
                <Sparkles className="h-3.5 w-3.5" /> {POP_CULTURE_TRIVIA.length}-Question Cinema &amp; Celebrity Blitz
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#18101E]">
                Trailer &amp; Pop-Culture Cougar Quiz
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-stone-200 bg-white p-2.5 text-stone-700 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
              aria-label="Close Trivia"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {finished ? (
            <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 sm:p-7 text-center space-y-4">
              <Award className="mx-auto h-12 w-12 text-rose-600" />
              <div className="font-editorial text-4xl sm:text-5xl font-bold text-[#18101E]">
                {score} / {POP_CULTURE_TRIVIA.length} Correct!
              </div>
              <div className="text-lg tracking-widest select-all">
                {history.slice(0, 20).map((ok, i) => (
                  <span key={i}>{ok ? '🟩' : '⬛'}</span>
                ))}
              </div>
              <p className="text-base font-medium text-stone-700 leading-relaxed">
                {score >= Math.round(POP_CULTURE_TRIVIA.length * 0.7)
                  ? 'Certified Red-Carpet Cougar Historian! Angela Bassett, Tina Turner, Cher, Priyanka, Jennifer Lawrence, and Sienna would wave you straight to Table 1.'
                  : 'Solid run! Queue up No Hard Feelings, Babygirl, and The Rebound on Friday night and run it back.'}
              </p>
              {stampUnlocked && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-extrabold text-emerald-900">
                  🏆 Unlocked the Pop-Culture Historian Stamp in your Field Guide!
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={openQuizShareSheet}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-[#18101E] cursor-pointer"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share Score Card (🐆🎬 {score}/{POP_CULTURE_TRIVIA.length})</span>
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-extrabold text-[#18101E] cursor-pointer"
                >
                  Play Quiz Again
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-[#18101E] px-6 py-3 text-sm font-extrabold text-white cursor-pointer"
                >
                  Back to Club
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-extrabold">
                <span className="rounded-full bg-amber-100 border border-amber-300/70 px-3.5 py-1 text-amber-950">
                  {current.badge}
                </span>
                <span className="text-stone-500">
                  Question {qIdx + 1} of {POP_CULTURE_TRIVIA.length} • Score: {score}
                </span>
              </div>

              <p className="text-lg font-bold text-[#18101E] leading-relaxed">
                {current.question}
              </p>

              <div className="grid gap-2.5">
                {current.options.map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  const isCorrect = idx === current.correctIndex;
                  let style =
                    'border-stone-200 bg-white text-[#18101E] hover:border-stone-400 hover:bg-stone-50';
                  if (selectedOpt !== null) {
                    if (isCorrect) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                    } else if (isSelected) {
                      style = 'border-rose-400 bg-rose-50 text-rose-950';
                    } else {
                      style = 'border-stone-200/60 bg-stone-50/60 text-stone-400';
                    }
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handlePick(idx)}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm sm:text-base font-semibold whitespace-normal transition cursor-pointer ${style}`}
                    >
                      <span>{opt}</span>
                      {selectedOpt !== null && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Post-Answer Reveal Only (Zero Pre-Answer Spoilers & Zero Figcaption Clutter) */}
              {selectedOpt !== null && (
                <div className="animate-stage-in rounded-3xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5 space-y-3.5">
                  {current.youtubeEmbedUrl ? (
                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-black shadow-sm">
                      <iframe
                        src={current.youtubeEmbedUrl}
                        title={`${current.badge} Official Trailer`}
                        className="aspect-video w-full"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    current.imageUrl &&
                    !imgHidden[current.id] && (
                      <div className="flex justify-center">
                        <img
                          src={current.imageUrl}
                          alt={current.badge}
                          loading="lazy"
                          onError={() =>
                            setImgHidden((prev) => ({ ...prev, [current.id]: true }))
                          }
                          className="h-48 w-40 rounded-2xl border border-stone-200 object-cover object-top shadow-sm"
                        />
                      </div>
                    )
                  )}

                  <p className="text-sm font-medium text-stone-800 leading-relaxed">
                    {current.funFact}
                  </p>

                  {matchedAffiliate && (
                    <a
                      href={buildAffiliateUrl(matchedAffiliate, `trivia_${current.id}`)}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      onClick={() =>
                        trackEvent('affiliate_clicked', {
                          item_id: matchedAffiliate.id,
                          surface: 'pop_quiz_reveal',
                        })
                      }
                      className="flex items-center justify-between gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-[#18101E] hover:bg-stone-50 transition"
                    >
                      <span>🎬 Watch / Read Pick: {matchedAffiliate.name}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full rounded-full bg-[#18101E] py-3 text-sm sm:text-base font-bold text-white hover:bg-stone-800 transition cursor-pointer"
                  >
                    {qIdx + 1 >= POP_CULTURE_TRIVIA.length
                      ? 'See Final Score & Share Card →'
                      : 'Next Question →'}
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
