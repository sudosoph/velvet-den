import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Award,
  CheckCircle2,
  Download,
  ExternalLink,
  Flame,
  LayoutGrid,
  Search,
  Share2,
  Shuffle,
  X,
} from 'lucide-react';
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
export type TriviaRoundSize = 5 | 8 | 15 | 999;

export interface CuratedTriviaPack {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  questionIds: readonly string[];
}

export const TRIVIA_CURATED_PACKS: readonly CuratedTriviaPack[] = [
  {
    id: 'hollywood_toyboys',
    emoji: '🥂',
    title: 'Hollywood Toyboys & Red Carpets',
    subtitle: 'Katie Holmes, Cher, Madonna, Joan Collins, J.Lo, Britney & Sienna Miller',
    questionIds: [
      'katie-holmes-bobby-wooten-emilio-vitolo',
      'joan-collins-percy-gibson-quote',
      'madonna-1984-boy-toy-belt-buckle',
      'cher-rich-man-icon',
      'cher-tom-cruise-top-5-lovers',
      'jennifer-lopez-casper-smart-dance',
      'britney-spears-sam-asghari-slumber-party',
      'sienna-miller-oli-green',
      'priyanka-nick-cutoff',
      'heidi-klum-tom-kaulitz',
      'tina-turner-erwin-bach',
      'courteney-cox-johnny-mcdaid-ed-sheeran',
      'lisa-bonet-jason-momoa-jazz-club-guinness',
      'jessica-alba-danny-ramirez-cabo',
      'miley-cyrus-maxx-morando-grammy',
    ],
  },
  {
    id: 'scandal_twists',
    emoji: '🕵️',
    title: 'Scandal, Tabloids & Plot Twists',
    subtitle: 'Elizabeth Holmes & Billy Evans, Strawberry Jam, MSG Hockey Meme & SNL',
    questionIds: [
      'elizabeth-holmes-billy-evans-mit-ring',
      'the-dropout-hulu-sunny-to-billy-pivot',
      'shakira-strawberry-jam-clue',
      'shakira-bzrp-rolex-casio',
      'kate-beckinsale-msg-pete-davidson',
      'kim-kardashian-pete-davidson-aladdin-snl',
      'kim-kardashian-lewis-hamilton-2026',
      'olivia-wilde-harry-styles-booksmart',
      'tlc-milf-manor-plot-twist',
      'yung-gravy-betty-vmas',
      'kristin-cavallari-montana-boyz',
      'larsa-pippen-marcus-jordan-reality',
      'wanda-nara-mauro-icardi-agent',
      'demi-moore-ashton-kutcher-watershed',
    ],
  },
  {
    id: 'essential_cinema',
    emoji: '🎬',
    title: 'Essential Cougar Cinema',
    subtitle: 'Babygirl, The Idea of You, No Hard Feelings, Stella & Ryan Gosling',
    questionIds: [
      'babygirl-glass-of-milk-meme',
      'idea-of-you-coachella',
      'no-hard-feelings-jlaw-buick',
      'bridget-jones-roxster',
      'sandra-bullock-ryan-gosling-murder-by-numbers',
      'stella-groove-jamaica',
      'the-graduate-real-age-gap',
      'american-pie-stiflers-mom',
      'somethings-gotta-give-keanu',
      'zeta-jones-the-rebound',
      'leo-grande-emma-thompson',
      'harold-and-maude-cat-stevens',
      'sunset-boulevard-norma-desmond',
      'robin-wright-clement-giraudet-cannes',
    ],
  },
  {
    id: 'tv_binge',
    emoji: '📺',
    title: 'Iconic TV & Sitcom Sparks',
    subtitle: 'Cougar Town, Sex and the City, Ted Lasso, White Lotus & Correlli',
    questionIds: [
      'cougar-town-big-carl',
      'satc-samantha-smith-jerrod',
      'ted-lasso-rebecca-sam-bantr',
      'deborra-lee-furness-hugh-jackman-correlli',
      'succession-gerri-roman',
      'emily-in-paris-sylvie-erik',
      'younger-liza-josh-tattoo',
      'hacks-deborah-vance',
      'white-lotus-resort-canon',
      'the-office-jan-hunter-cd',
      'desperate-housewives-gaby-gardener',
      'fleabag-belinda-hotel-bar-speech',
    ],
  },
  {
    id: 'books_royals',
    emoji: '📚',
    title: 'BookTok, Couture & History',
    subtitle: 'All Fours, Part of Your World, Colette, Vivienne Westwood & Macrons',
    questionIds: [
      'abby-jimenez-part-of-your-world',
      'miranda-july-all-fours',
      'colette-cheri-1920',
      'vivienne-westwood-andreas-kronthaler-vienna',
      'brigitte-emmanuel-macron-workshop',
      'agatha-christie-max-mallowan-memoir',
      'vladimir-julia-may-jonas',
      'robinne-lee-idea-of-you-ending',
      'eleanor-of-aquitaine-henry-ii',
      'catherine-the-great-potemkin-facade',
      'georgia-okeeffe-juan-hamilton-gap',
      'edith-piaf-theo-sarapo-stage-name',
    ],
  },
  {
    id: 'nostalgia_eras',
    emoji: '📼',
    title: 'Boomer & Gen-X Era Checks',
    subtitle: 'Cassette Pencils, Blockbuster Rewind, Period Texting & Fleetwood Mac',
    questionIds: [
      'genx-texting-period-tone',
      'genx-cassette-pencil-rewind-ritual',
      'blockbuster-vhs-rewind-rule',
      'fleetwood-mac-dreams-cranberry-2020',
      'nirvana-in-utero-tour-shirt',
      'motorola-razr-t9-keypad',
      'aim-away-message-lyrics',
      'boomer-cher-battleship-turn-back-time',
      'boomer-studio-54-halston-glamour',
      'boomer-helen-mirren-taylor-hackford',
      'feline-chart-puma-cougar-jaguar',
      'half-your-age-plus-seven-1901',
    ],
  },
];

const MASTERED_STORAGE_KEY = 'cc_trivia_mastered_v1';

function loadMasteredTriviaIds(): string[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(MASTERED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function saveMasteredTriviaIds(ids: string[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(MASTERED_STORAGE_KEY, JSON.stringify(ids));
    }
  } catch {
    // Ignore storage block
  }
}

export function buildTriviaSprintDeck(
  category: TriviaCategoryFilter,
  difficulty: TriviaDifficultyFilter,
  shouldShuffle: boolean,
  options?: {
    roundSize?: TriviaRoundSize;
    packId?: string | null;
    searchQuery?: string;
    unseenOnly?: boolean;
    masteredIds?: readonly string[];
  },
): PopCultureTriviaQuestion[] {
  const roundSize = options?.roundSize ?? TRIVIA_SPRINT_SIZE;
  const pack = options?.packId
    ? TRIVIA_CURATED_PACKS.find((p) => p.id === options.packId)
    : undefined;
  const packSet = pack ? new Set(pack.questionIds) : null;
  const qLower = (options?.searchQuery || '').trim().toLowerCase();
  const masteredSet =
    options?.unseenOnly && options.masteredIds?.length
      ? new Set(options.masteredIds)
      : null;

  let pool = POP_CULTURE_TRIVIA.filter((q) => {
    if (packSet) {
      if (!packSet.has(q.id)) return false;
    } else {
      const catMatch = category === 'all' || resolveTriviaCategory(q) === category;
      const diffMatch = difficulty === 'all' || resolveTriviaDifficulty(q) === difficulty;
      if (!catMatch || !diffMatch) return false;
    }
    if (qLower) {
      const hay = `${q.badge} ${q.question} ${q.options.join(' ')} ${q.funFact}`.toLowerCase();
      if (!hay.includes(qLower)) return false;
    }
    if (masteredSet && masteredSet.has(q.id)) return false;
    return true;
  });

  // If unseenOnly exhausted the current filter, gracefully fall back to full matching pool
  if (pool.length === 0 && masteredSet) {
    return buildTriviaSprintDeck(category, difficulty, shouldShuffle, {
      ...options,
      unseenOnly: false,
    });
  }
  if (pool.length === 0) {
    pool = [...POP_CULTURE_TRIVIA];
  }

  // Preserve curated pack order when unshuffled so headline questions open first!
  if (pack && !shouldShuffle && !qLower) {
    const byId = new Map(pool.map((item) => [item.id, item]));
    pool = pack.questionIds
      .map((id) => byId.get(id))
      .filter((x): x is PopCultureTriviaQuestion => Boolean(x));
  }

  const ordered = shouldShuffle ? shuffleTriviaDeck(pool) : [...pool];
  return roundSize >= 999 ? ordered : ordered.slice(0, roundSize);
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

const ROUND_SIZE_OPTIONS: { size: TriviaRoundSize; label: string }[] = [
  { size: 5, label: '5 Qs' },
  { size: 8, label: '8 Qs' },
  { size: 15, label: '15 Qs' },
  { size: 999, label: 'All' },
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
  const [roundSize, setRoundSize] = useState<TriviaRoundSize>(TRIVIA_SPRINT_SIZE);
  const [activePackId, setActivePackId] = useState<string | null>(null);
  const [showPacksDrawer, setShowPacksDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unseenOnly, setUnseenOnly] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>(() => loadMasteredTriviaIds());
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
    const savedMastered = loadMasteredTriviaIds();
    setMasteredIds(savedMastered);
    setCategoryFilter('all');
    setDifficultyFilter('easy');
    setRoundSize(TRIVIA_SPRINT_SIZE);
    setActivePackId(null);
    setShowPacksDrawer(false);
    setSearchQuery('');
    setUnseenOnly(false);
    setDeck(buildTriviaSprintDeck('all', 'easy', shouldAutoShuffle));
    setQIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setHistory([]);
    setFinished(false);
  }, [open, shouldAutoShuffle]);

  const rebuildDeck = ({
    nextCat = categoryFilter,
    nextDiff = difficultyFilter,
    nextSize = roundSize,
    nextPackId = activePackId,
    nextSearch = searchQuery,
    nextUnseen = unseenOnly,
    forceShuffle = shouldAutoShuffle,
  }: {
    nextCat?: TriviaCategoryFilter;
    nextDiff?: TriviaDifficultyFilter;
    nextSize?: TriviaRoundSize;
    nextPackId?: string | null;
    nextSearch?: string;
    nextUnseen?: boolean;
    forceShuffle?: boolean;
  }) => {
    setCategoryFilter(nextCat);
    setDifficultyFilter(nextDiff);
    setRoundSize(nextSize);
    setActivePackId(nextPackId);
    setSearchQuery(nextSearch);
    setUnseenOnly(nextUnseen);
    setDeck(
      buildTriviaSprintDeck(nextCat, nextDiff, forceShuffle, {
        roundSize: nextSize,
        packId: nextPackId,
        searchQuery: nextSearch,
        unseenOnly: nextUnseen,
        masteredIds,
      }),
    );
    setQIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setHistory([]);
    setFinished(false);
  };

  if (!open) return null;

  const current = deck[qIdx] ?? POP_CULTURE_TRIVIA[0];
  const activePack = activePackId
    ? TRIVIA_CURATED_PACKS.find((p) => p.id === activePackId)
    : undefined;
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
      if (!masteredIds.includes(current.id)) {
        const updated = [...masteredIds, current.id];
        setMasteredIds(updated);
        saveMasteredTriviaIds(updated);
      }
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
        `trivia_sprint_${activePackId ?? categoryFilter}_${difficultyFilter}`,
        20,
        'Pop-Culture Round Cleared!',
        '🎬 +20 XP',
      );
      if (!freshBonus) {
        emitXpBurst(5, 'Round Replay Complete!', '🎬 DONE');
      }
      trackEvent('trivia_completed', {
        score,
        total: deck.length,
        category: activePackId ?? categoryFilter,
        difficulty: difficultyFilter,
      });
      return;
    }
    setSelectedOpt(null);
    setQIdx((i) => i + 1);
  };

  const handleRestartWithShuffle = () => {
    sfx.messagePop();
    rebuildDeck({ forceShuffle: true });
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

  const progressPct = Math.round(
    ((qIdx + (selectedOpt !== null ? 1 : 0)) / Math.max(1, deck.length)) * 100,
  );

  const modalNode = (
    <>
      <CelebrationBurstCanvas active={finished && score >= Math.min(5, deck.length)} palette="gold" />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Pop-Culture Cougar & Cub Trivia"
        onClick={onClose}
      >
        <div
          className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Organized Multi-Mode Header: Packs + Categories + Round Length + Vault Search */}
          <div className="shrink-0 border-b border-zinc-200 bg-white px-5 py-4 sm:px-6 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-950">
                  Pop-Culture Trivia
                </h2>
                <span className="text-xs text-zinc-500 tabular-nums">
                  {masteredIds.length}/{POP_CULTURE_TRIVIA.length} mastered
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  data-testid="trivia-packs-toggle-btn"
                  onClick={() => setShowPacksDrawer((v) => !v)}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                    showPacksDrawer || activePackId
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>{activePack ? activePack.emoji + ' Pack' : '6 Packs'}</span>
                </button>

                <Tabs
                  value={difficultyFilter}
                  onValueChange={(v) =>
                    rebuildDeck({
                      nextDiff: v as TriviaDifficultyFilter,
                      nextPackId: null,
                    })
                  }
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
                    title="Shuffle round"
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
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

            {/* Row 2: Category Segmented Bar */}
            <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
              <div
                data-testid="trivia-category-bar"
                className="inline-flex w-max min-w-full items-center justify-start gap-0.5 rounded-xl bg-zinc-100/90 p-0.5 h-8 text-zinc-600"
              >
                {TRIVIA_CATEGORIES.map((cat) => {
                  const active = !activePackId && categoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setShowPacksDrawer(false);
                        rebuildDeck({ nextCat: cat.id, nextPackId: null });
                      }}
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

            {/* Row 3: Manageable Round Size + Unseen Filter + Instant Celebrity/Movie Search */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-1.5">
                <div
                  data-testid="trivia-length-bar"
                  className="inline-flex items-center rounded-lg bg-zinc-100 p-0.5 h-7"
                >
                  {ROUND_SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.size}
                      type="button"
                      onClick={() => rebuildDeck({ nextSize: opt.size })}
                      className={`h-6 rounded-md px-2 text-[11px] transition cursor-pointer ${
                        roundSize === opt.size
                          ? 'bg-white font-semibold text-zinc-950 shadow-2xs'
                          : 'font-medium text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  data-testid="trivia-unseen-toggle"
                  onClick={() => rebuildDeck({ nextUnseen: !unseenOnly })}
                  className={`h-7 rounded-lg border px-2 text-[11px] font-medium transition cursor-pointer ${
                    unseenOnly
                      ? 'border-rose-300 bg-rose-50 text-rose-800 font-semibold'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {unseenOnly ? '✓ Unseen Only' : 'Unseen Only'}
                </button>
              </div>

              <div className="relative flex-1 min-w-[160px] max-w-[230px]">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="search"
                  data-testid="trivia-vault-search"
                  value={searchQuery}
                  onChange={(e) =>
                    rebuildDeck({
                      nextSearch: e.target.value,
                      nextPackId: null,
                      nextDiff: 'all',
                      nextCat: 'all',
                      forceShuffle: false,
                    })
                  }
                  placeholder="Search Holmes, Cher, Joan..."
                  className="h-7 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-7 pr-2.5 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
                />
              </div>
            </div>

            {/* Expandable 6 Curated Theme Packs Grid */}
            {showPacksDrawer && (
              <div
                data-testid="trivia-curated-packs-grid"
                className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5 max-h-60 overflow-y-auto"
              >
                {TRIVIA_CURATED_PACKS.map((pack) => {
                  const isSelected = activePackId === pack.id;
                  return (
                    <button
                      key={pack.id}
                      type="button"
                      data-testid={`trivia-pack-${pack.id}`}
                      onClick={() => {
                        sfx.messagePop();
                        setShowPacksDrawer(false);
                        rebuildDeck({
                          nextPackId: pack.id,
                          nextSearch: '',
                          nextSize: roundSize === TRIVIA_SPRINT_SIZE ? 15 : roundSize,
                          forceShuffle: false,
                        });
                      }}
                      className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-zinc-950 bg-zinc-950 text-white'
                          : 'border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100 text-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                        <span>
                          {pack.emoji} {pack.title}
                        </span>
                        <span
                          className={`shrink-0 text-[11px] ${
                            isSelected ? 'text-rose-300' : 'text-zinc-500'
                          }`}
                        >
                          {pack.questionIds.length} Qs
                        </span>
                      </div>
                      <p
                        className={`mt-0.5 text-[11px] leading-snug ${
                          isSelected ? 'text-zinc-300' : 'text-zinc-500'
                        }`}
                      >
                        {pack.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
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
                    ? 'Red-Carpet Cougar Historian! Dame Joan Collins, Cher, Katie Holmes, Madonna, and Sienna Miller would wave you straight to Table 1.'
                    : 'Solid run! Pick another Curated Theme Pack above or queue up Babygirl and No Hard Feelings on Friday night.'}
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
                  {!activePackId && difficultyFilter === 'easy' && (
                    <button
                      type="button"
                      onClick={() => rebuildDeck({ nextDiff: 'medium', forceShuffle: true })}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      <span>Advance to Lv.2 →</span>
                    </button>
                  )}
                  {!activePackId && difficultyFilter === 'medium' && (
                    <button
                      type="button"
                      onClick={() => rebuildDeck({ nextDiff: 'hard', forceShuffle: true })}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      <span>Advance to Lv.3 →</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPacksDrawer(true)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Pick Theme Pack</span>
                  </button>
                  <button
                    type="button"
                    data-testid="trivia-download-certificate-btn"
                    onClick={() => {
                      downloadReceiptPng({
                        style: 'certificate',
                        badge: 'ALL-ERA POP-CULTURE HISTORIAN CERTIFICATE',
                        bigStat: `${score}/${deck.length} SCORE`,
                        verdictLabel:
                          score >= Math.ceil(deck.length * 0.7)
                            ? 'Red-Carpet Cougar & Cub Historian'
                            : 'Certified All-Era Club Insider',
                        title: 'Verified Across Boomer, Gen-X, Millennial & Gen-Z Icons',
                        bullets: [
                          `Vault Progress: ${masteredIds.length}/${POP_CULTURE_TRIVIA.length} Mastered`,
                          activePack
                            ? `Completed Pack: ${activePack.title}`
                            : `Level Completed: ${difficultyFilter.toUpperCase()}`,
                        ],
                        filename: `pop-trivia-certificate-${score}-${deck.length}.png`,
                      });
                    }}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Certificate PNG</span>
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
                {activePack && (
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs">
                    <span className="font-semibold text-zinc-900">
                      {activePack.emoji} {activePack.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => rebuildDeck({ nextPackId: null, nextSize: TRIVIA_SPRINT_SIZE })}
                      className="font-medium text-zinc-600 hover:text-zinc-950 cursor-pointer"
                    >
                      Clear Pack ✕
                    </button>
                  </div>
                )}

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

                    <p className="text-sm text-zinc-700 leading-relaxed">{current.funFact}</p>

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

      <SocialShareSheetModal payload={sharePayload} onClose={() => setSharePayload(null)} />
    </>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
