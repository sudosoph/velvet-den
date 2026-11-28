import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, CheckCircle2, Download, ExternalLink, Flame, Share2, Shuffle, X } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import {
  POP_CULTURE_TRIVIA,
  resolveTriviaCategory,
  resolveTriviaDifficulty,
  type PopCultureTriviaQuestion,
  type TriviaCategory,
  type TriviaDifficulty,
} from '../data/popCultureTrivia';
import {
  AFFILIATE_SUPPORT_COPY,
  buildAffiliateUrl,
  buildPrimeVideoRouteUrl,
  EXTRA_TRIVIA_PRIME_VIDEO_STREAMS,
  getAffiliateById,
  isPrimeVideoDigitalPick,
} from '../lib/affiliates';
import { trackEvent } from '../lib/analytics';
import { awardPassportBonusXp, emitXpBurst } from '../lib/gamification';
import { downloadReceiptPng } from '../lib/receiptCanvas';
import { sfx } from '../lib/sound';
import { CelebrationBurstCanvas } from './CelebrationBurstCanvas';
import { CrowdsourceSubmissionBar } from './CrowdsourceSubmissionBar';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';
import { Progress, Tabs, TabsList, TabsTrigger } from './ui/primitives';

export const TRIVIA_SPRINT_SIZE = 8;

export type TriviaCategoryFilter = 'all' | TriviaCategory;
export type TriviaDifficultyFilter = 'all' | TriviaDifficulty;

export function buildTriviaSprintDeck(
  category: TriviaCategoryFilter,
  difficulty: TriviaDifficultyFilter,
  shouldShuffle: boolean,
): PopCultureTriviaQuestion[] {
  let pool = POP_CULTURE_TRIVIA.filter((q) => {
    const catMatch = category === 'all' || resolveTriviaCategory(q) === category;
    const diffMatch = difficulty === 'all' || resolveTriviaDifficulty(q) === difficulty;
    return catMatch && diffMatch;
  });
  if (pool.length === 0) {
    pool = [...POP_CULTURE_TRIVIA];
  }
  const ordered = shouldShuffle ? shuffleTriviaDeck(pool) : [...pool];
  return ordered.slice(0, TRIVIA_SPRINT_SIZE);
}

export function shuffleTriviaDeck(
  items: readonly PopCultureTriviaQuestion[],
  rng: () => number = Math.random,
): PopCultureTriviaQuestion[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface PopCultureTriviaModalProps {
  open: boolean;
  referralCode?: string;
  forceRandomizeInTests?: boolean;
  onClose: () => void;
  onEarnTriviaReward: (rewardKey: string, credits: number) => boolean;
}

const TRIVIA_CATEGORIES: { id: TriviaCategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'movies', label: 'Movies' },
  { id: 'tv', label: 'TV' },
  { id: 'books', label: 'Books' },
  { id: 'music_celebs', label: 'Icons & Music' },
  { id: 'sports', label: 'Sports' },
  { id: 'royals_history', label: 'History' },
  { id: 'era_culture', label: 'Boomers & Gen-X to Gen-Z' },
];

export const PopCultureTriviaModal: React.FC<PopCultureTriviaModalProps> = ({
  open,
  referralCode,
  forceRandomizeInTests = false,
  onClose,
  onEarnTriviaReward,
}) => {
  const shouldAutoShuffle = !import.meta.env.VITEST || forceRandomizeInTests;

  const [categoryFilter, setCategoryFilter] = useState<TriviaCategoryFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<TriviaDifficultyFilter>('easy');
  const [clearedLevels, setClearedLevels] = useState<TriviaDifficultyFilter[]>([]);
  const [deck, setDeck] = useState<PopCultureTriviaQuestion[]>(() =>
    buildTriviaSprintDeck('all', 'easy', shouldAutoShuffle),
  );
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [stampUnlocked, setStampUnlocked] = useState(false);
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  useEffect(() => {
    if (!open) return;
    setCategoryFilter('all');
    setDifficultyFilter('easy');
    setDeck(buildTriviaSprintDeck('all', 'easy', shouldAutoShuffle));
    setQIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setHistory([]);
    setFinished(false);
  }, [open, shouldAutoShuffle]);

  const applyFilterChange = (
    nextCat: TriviaCategoryFilter,
    nextDiff: TriviaDifficultyFilter,
    forceShuffle = shouldAutoShuffle,
  ) => {
    setCategoryFilter(nextCat);
    setDifficultyFilter(nextDiff);
    setDeck(buildTriviaSprintDeck(nextCat, nextDiff, forceShuffle));
    setQIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setHistory([]);
    setFinished(false);
  };

  if (!open) return null;

  const current = deck[qIdx] ?? POP_CULTURE_TRIVIA[0];
  const matchedAffiliate = current.affiliateId ? getAffiliateById(current.affiliateId) : undefined;
  const extraPrimeStream = EXTRA_TRIVIA_PRIME_VIDEO_STREAMS[current.id];
  let liveStreak = 0;
  for (let i = history.length - 1; i >= 0; i -= 1) {
    if (history[i]) liveStreak += 1;
    else break;
  }

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
    if (qIdx + 1 >= deck.length) {
      sfx.victoryFanfare();
      setFinished(true);
      setClearedLevels((prev) =>
        prev.includes(difficultyFilter) ? prev : [...prev, difficultyFilter],
      );
      const granted = onEarnTriviaReward('pop_culture_trivia_ace', 0);
      if (granted) setStampUnlocked(true);
      const freshBonus = awardPassportBonusXp(
        `trivia_sprint_${categoryFilter}_${difficultyFilter}`,
        20,
        'Pop-Culture Level Cleared!',
        '🎬 +20 XP',
      );
      if (!freshBonus) {
        emitXpBurst(5, 'Level Replay Complete!', '🎬 DONE');
      }
      trackEvent('trivia_completed', {
        score,
        total: deck.length,
        category: categoryFilter,
        difficulty: difficultyFilter,
      });
      return;
    }
    setSelectedOpt(null);
    setQIdx((i) => i + 1);
  };

  const handleRestartWithShuffle = () => {
    sfx.messagePop();
    applyFilterChange(categoryFilter, difficultyFilter, true);
  };

  const openQuizShareSheet = () => {
    const grid = history
      .slice(0, 12)
      .map((ok) => (ok ? '🟩' : '⬛'))
      .join('');
    const refQuery = referralCode ? `&ref=${encodeURIComponent(referralCode)}` : '';
    const quizUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?quiz=1${refQuery}`;
    const rankLabel =
      score >= Math.ceil(deck.length * 0.75)
        ? 'Red-Carpet Cougar Historian'
        : score >= Math.ceil(deck.length * 0.5)
          ? 'Front-Row Club Insider'
          : 'Rising Den Contender';
    const message = `🐆🎬 Cougars & Cubs Pop-Culture Trivia: ${score}/${deck.length} (${rankLabel})\n${grid}\nCan you beat my score?`;
    setSharePayload({
      title: `Share Quiz Score (${score}/${deck.length})`,
      message,
      url: quizUrl,
      shareSurface: 'pop_quiz',
      discordMarkdown: `**🐆🎬 Cougars & Cubs Pop-Culture Trivia: ${score}/${deck.length}** (${rankLabel})\n${grid}\nPlay free: ${quizUrl}`,
    });
  };

  const progressPct = Math.round(((qIdx + (selectedOpt !== null ? 1 : 0)) / Math.max(1, deck.length)) * 100);

  const modalNode = (
    <>
      <CelebrationBurstCanvas active={finished && score >= 6} palette="gold" />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Pop-Culture Cougar & Cub Trivia"
        onClick={onClose}
      >
        <div
          className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sleek Minimal Header: Radix Tabs Without Multi-Row Emoji Pill Bloat */}
          <div className="shrink-0 border-b border-zinc-200 bg-white px-5 py-4 sm:px-6 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-950">
                  Pop-Culture Trivia
                </h2>
                <span className="text-xs text-zinc-400">
                  {POP_CULTURE_TRIVIA.length} questions
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Tabs
                  value={difficultyFilter}
                  onValueChange={(v) => applyFilterChange(categoryFilter, v as TriviaDifficultyFilter)}
                >
                  <TabsList data-testid="trivia-difficulty-bar" className="h-8 p-0.5">
                    {(
                      [
                        { id: 'easy', label: 'Lv.1' },
                        { id: 'medium', label: 'Lv.2' },
                        { id: 'hard', label: 'Lv.3' },
                        { id: 'all', label: 'All' },
                      ] as const
                    ).map((diff) => {
                      const isCleared = clearedLevels.includes(diff.id);
                      return (
                        <TabsTrigger
                          key={diff.id}
                          value={diff.id}
                          className="h-7 px-2 py-0.5 text-xs"
                        >
                          {isCleared ? `✓ ${diff.label}` : diff.label}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </Tabs>

                {!finished && (
                  <button
                    type="button"
                    onClick={handleRestartWithShuffle}
                    title="Shuffle 8-question round"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
                  >
                    <Shuffle className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Shuffle</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
                  aria-label="Close Trivia"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Single Scrollable / Clean Category Segmented Strip (Zero Emoji Soup) */}
            <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
              <div
                data-testid="trivia-category-bar"
                className="inline-flex w-max min-w-full items-center justify-start gap-0.5 rounded-xl bg-zinc-100/90 p-0.5 h-8 text-zinc-600"
              >
                {TRIVIA_CATEGORIES.map((cat) => {
                  const active = categoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => applyFilterChange(cat.id, difficultyFilter)}
                      className={`inline-flex h-7 items-center justify-center whitespace-nowrap rounded-lg px-2.5 py-0.5 text-xs transition-all cursor-pointer ${
                        active
                          ? 'bg-white font-semibold text-zinc-950 shadow-2xs'
                          : 'font-medium text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 space-y-5">
            {finished ? (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-6 sm:p-7 text-center space-y-4">
                <Award className="mx-auto h-9 w-9 text-zinc-900" />
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
                  {score} / {deck.length} Correct
                </div>
                <div className="text-lg tracking-widest select-all">
                  {history.slice(0, 20).map((ok, i) => (
                    <span key={i}>{ok ? '🟩' : '⬛'}</span>
                  ))}
                </div>
                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-lg mx-auto">
                  {score >= Math.round(deck.length * 0.7)
                    ? 'Red-Carpet Cougar Historian! Angela Bassett, Tina Turner, Cher, Madonna, and Sienna Miller would wave you straight to Table 1.'
                    : 'Solid run! Queue up No Hard Feelings, Babygirl, and The Rebound on Friday night and run a fresh shuffled deck.'}
                </p>

                {stampUnlocked && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-medium text-emerald-900">
                    Unlocked the Pop-Culture Historian Stamp in your Field Guide.
                  </div>
                )}

                <div className="rounded-xl border border-zinc-200 bg-white p-4 text-left space-y-2.5">
                  <div className="text-xs font-semibold text-zinc-900">
                    Stream Featured Titles on Prime Video
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      'idea-of-you-movie-book',
                      'no-hard-feelings-jlaw-prime',
                      'babygirl-movie-prime',
                      'the-rebound-zeta-jones-prime',
                    ].map((affId) => {
                      const pick = getAffiliateById(affId);
                      if (!pick) return null;
                      return (
                        <a
                          key={affId}
                          href={buildAffiliateUrl(pick, `quiz_finish_${affId}`)}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          onClick={() =>
                            trackEvent('affiliate_clicked', {
                              item_id: pick.id,
                              surface: 'pop_quiz_finish',
                            })
                          }
                          className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-100 transition-colors"
                        >
                          <span className="leading-snug">{pick.name.split(' (')[0]}</span>
                          <ExternalLink className="h-3 w-3 shrink-0 text-zinc-500" />
                        </a>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    {AFFILIATE_SUPPORT_COPY.compactInline}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2.5 pt-1">
                  {difficultyFilter === 'easy' && (
                    <button
                      type="button"
                      onClick={() => applyFilterChange(categoryFilter, 'medium', true)}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      <span>Advance to Lv.2 →</span>
                    </button>
                  )}
                  {difficultyFilter === 'medium' && (
                    <button
                      type="button"
                      onClick={() => applyFilterChange(categoryFilter, 'hard', true)}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      <span>Advance to Lv.3 →</span>
                    </button>
                  )}
                  <button
                    type="button"
                    data-testid="trivia-download-certificate-btn"
                    onClick={() => {
                      downloadReceiptPng({
                        style: 'certificate',
                        badge: 'ALL-ERA POP-CULTURE HISTORIAN CERTIFICATE',
                        bigStat: `${score}/${deck.length} SCORE`,
                        verdictLabel:
                          score >= 6
                            ? 'Red-Carpet Cougar & Cub Historian'
                            : 'Certified All-Era Club Insider',
                        title: 'Verified Across Boomer, Gen-X, Millennial & Gen-Z Icons',
                        bullets: [
                          'Fluent in Fleetwood Mac, Cher, Madonna & Modern Cinema',
                          `Level Completed: ${difficultyFilter.toUpperCase()}`,
                        ],
                        filename: `pop-trivia-certificate-${score}-${deck.length}.png`,
                      });
                    }}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Certificate PNG</span>
                  </button>
                  <button
                    type="button"
                    onClick={openQuizShareSheet}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share Score ({score}/{deck.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRestartWithShuffle}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    <Shuffle className="h-4 w-4" />
                    <span>New Round</span>
                  </button>
                </div>

                <div className="text-left pt-2">
                  <CrowdsourceSubmissionBar surface="trivia" compact />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Clean Progress + Quiet Metadata Line (Zero Colored Pill Stack!) */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-zinc-500">
                    <span>{current.badge}</span>
                    <div className="flex items-center gap-2.5">
                      {liveStreak >= 2 && (
                        <span
                          data-testid="trivia-hot-streak-pill"
                          className="inline-flex items-center gap-1 font-semibold text-rose-600"
                        >
                          <Flame className="h-3.5 w-3.5" />
                          <span>{liveStreak}x Streak!</span>
                        </span>
                      )}
                      <span className="tabular-nums">
                        Question {qIdx + 1} of {deck.length} · Score {score}
                      </span>
                    </div>
                  </div>
                  <Progress value={progressPct} />
                </div>

                <p className="text-base sm:text-lg font-semibold text-zinc-950 leading-snug pt-1">
                  {current.question}
                </p>

                <div className="grid gap-2">
                  {current.options.map((opt, idx) => {
                    const isSelected = selectedOpt === idx;
                    const isCorrect = idx === current.correctIndex;
                    let style =
                      'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50/70';
                    if (selectedOpt !== null) {
                      if (isCorrect) {
                        style = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                      } else if (isSelected) {
                        style = 'border-rose-400 bg-rose-50 text-rose-950';
                      } else {
                        style = 'border-zinc-200/60 bg-zinc-50 text-zinc-400';
                      }
                    }
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handlePick(idx)}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm sm:text-base font-medium whitespace-normal transition-colors cursor-pointer ${style}`}
                      >
                        <span>{opt}</span>
                        {selectedOpt !== null && isCorrect && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOpt !== null && (
                  <div className="animate-stage-in rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5 space-y-3.5">
                    {current.youtubeEmbedUrl ? (
                      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-black shadow-2xs">
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
                      current.imageUrl && (
                        <div className="flex justify-center">
                          <img
                            src={current.imageUrl}
                            alt={current.badge}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = './images/cast/hero-couple.jpg';
                            }}
                            className="h-48 w-40 rounded-xl border border-zinc-200 object-cover object-top shadow-2xs"
                          />
                        </div>
                      )
                    )}

                    <p className="text-sm text-zinc-700 leading-relaxed">
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
                        className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
                      >
                        <span>
                          {isPrimeVideoDigitalPick(matchedAffiliate)
                            ? `🎬 Stream / Rent Digitally: ${matchedAffiliate.name}`
                            : `📚 Club Pick: ${matchedAffiliate.name}`}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                      </a>
                    )}

                    {extraPrimeStream && (
                      <a
                        href={buildPrimeVideoRouteUrl(
                          extraPrimeStream.goSlug,
                          extraPrimeStream.merchantUrl,
                          `trivia_${current.id}`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={() =>
                          trackEvent('affiliate_clicked', {
                            item_id: extraPrimeStream.goSlug,
                            surface: 'pop_quiz_reveal',
                          })
                        }
                        className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
                      >
                        <span>
                          {extraPrimeStream.ctaPrefix ?? '🎬 Watch on Prime Video'}:{' '}
                          {extraPrimeStream.label}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                      </a>
                    )}

                    {(matchedAffiliate || extraPrimeStream) && (
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        {AFFILIATE_SUPPORT_COPY.compactInline}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full h-10 rounded-lg bg-zinc-950 text-sm font-medium text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      {qIdx + 1 >= deck.length
                        ? 'See Final Score & Share Card →'
                        : 'Next Question →'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
