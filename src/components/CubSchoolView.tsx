import React, { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
} from 'lucide-react';
import { MONETIZATION_CONFIG } from '../config/monetization';
import {
  EXPRESSION_MOTION_PRESETS,
  type PortraitExpression,
  V35_CAST_VISUALS,
} from '../data/v35AssetManifest';
import {
  V35_CUB_SCHOOL_DRILLS,
  V35_HEADMISTRESS_DRILLS,
} from '../data/v35CubSchool';
import { buildAffiliateUrl, getAffiliateById } from '../lib/affiliates';
import { trackEvent } from '../lib/analytics';
import { awardPassportBonusXp, emitXpBurst } from '../lib/gamification';
import { sfx } from '../lib/sound';
import { shareOrCopy } from '../lib/viral';
import { CrowdsourceSubmissionBar } from './CrowdsourceSubmissionBar';

export interface CubSchoolViewProps {
  role: 'her' | 'him';
  initialGoldStars?: number;
  activeMatchName?: string | null;
  onUpdateGoldStars?: (stars: number) => void;
  onEarnDiploma?: () => void;
  onReturnToActiveMatch?: () => void;
  onGoToHinge?: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C'] as const;

const SCHOOL_LEVEL_SPECS = [
  { level: 1, startIdx: 0, endIdx: 3, badge: 'Lv.1 • 101 Housebreaking', shortLabel: '🐾 Lv.1 Basics' },
  { level: 2, startIdx: 4, endIdx: 7, badge: 'Lv.2 • 201 Social & Era Poise', shortLabel: '🍸 Lv.2 Social' },
  { level: 3, startIdx: 8, endIdx: 11, badge: 'Lv.3 • 301 Sanctuary Honours', shortLabel: '👑 Lv.3 Honours' },
] as const;

export const CubSchoolView: React.FC<CubSchoolViewProps> = ({
  role,
  initialGoldStars = 0,
  activeMatchName,
  onUpdateGoldStars,
  onEarnDiploma,
  onReturnToActiveMatch,
  onGoToHinge,
}) => {
  const [mode, setMode] = useState<'headmistress' | 'candidate'>(
    role === 'her' ? 'headmistress' : 'candidate',
  );
  const [drillIdx, setDrillIdx] = useState(0);
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const [goldStars, setGoldStars] = useState(0);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [graduated, setGraduated] = useState(false);
  const [copiedDiploma, setCopiedDiploma] = useState(false);

  useEffect(() => {
    setMode(role === 'her' ? 'headmistress' : 'candidate');
    setDrillIdx(0);
    setPickedIdx(null);
    setGoldStars(0);
    setResults({});
    setGraduated(false);
  }, [role]);

  const bestStars = Math.max(goldStars, initialGoldStars);
  const perkUnlocked = bestStars >= 4;

  const activeDeck =
    mode === 'headmistress' ? V35_HEADMISTRESS_DRILLS : V35_CUB_SCHOOL_DRILLS;
  const drill = activeDeck[drillIdx] ?? activeDeck[0];
  const currentLevelSpec =
    SCHOOL_LEVEL_SPECS.find((s) => drillIdx >= s.startIdx && drillIdx <= s.endIdx) ??
    SCHOOL_LEVEL_SPECS[0];
  const stepInLevel = drillIdx - currentLevelSpec.startIdx + 1;
  const pickedOption = pickedIdx !== null ? drill.options[pickedIdx] : null;
  const activeExpression: PortraitExpression = pickedOption ? pickedOption.expression : 'smirk';
  const preset = EXPRESSION_MOTION_PRESETS[activeExpression];

  const cubReactionPortraits = [
    V35_CAST_VISUALS.soren.primaryPortrait,
    V35_CAST_VISUALS.julian.primaryPortrait,
    V35_CAST_VISUALS.rory.primaryPortrait,
    V35_CAST_VISUALS.miles.primaryPortrait,
    V35_CAST_VISUALS.rafael.primaryPortrait,
    V35_CAST_VISUALS.marcus.primaryPortrait,
  ];
  const headmistressReactionPortraits = [
    V35_CAST_VISUALS.elena.primaryPortrait,
    V35_CAST_VISUALS.claire.primaryPortrait,
    V35_CAST_VISUALS.sienna.primaryPortrait,
    V35_CAST_VISUALS.vivienne.primaryPortrait,
    V35_CAST_VISUALS.priya.primaryPortrait,
    V35_CAST_VISUALS.celeste.primaryPortrait,
  ];
  const reactionPortrait =
    mode === 'headmistress'
      ? cubReactionPortraits[drillIdx % cubReactionPortraits.length]
      : headmistressReactionPortraits[drillIdx % headmistressReactionPortraits.length];

  const handleSwitchMode = (nextMode: 'headmistress' | 'candidate') => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setDrillIdx(0);
    setPickedIdx(null);
    setGoldStars(0);
    setResults({});
    setGraduated(false);
  };

  const fixProduct = getAffiliateById(drill.fixItAffiliateId);

  if (graduated) {
    return (
      <div className="mx-auto w-full max-w-2xl animate-stage-in">
        <section className="rounded-2xl border border-zinc-200 bg-white p-7 sm:p-9 text-center space-y-5 shadow-2xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
            <Award className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Certified Housebroken Cub Diploma
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 max-w-lg mx-auto leading-relaxed">
              {mode === 'headmistress' ? (
                <>
                  Conferred with <strong className="text-zinc-950">{goldStars}/12 Headmistress Gold Stars</strong>.
                </>
              ) : (
                <>
                  Passed with <strong className="text-zinc-950">{goldStars}/12 Gold Stars</strong>.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={async () => {
                await shareOrCopy({
                  title: 'Certified Housebroken Cub Diploma',
                  text: `🎓 Scored ${goldStars}/12 Gold Stars in Cougars & Cubs Club Obedience School. Certified Housebroken! Test your etiquette:`,
                  url: 'https://cougarsandcubs.club',
                });
                setCopiedDiploma(true);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-5 text-xs sm:text-sm font-semibold text-white cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>{copiedDiploma ? 'Diploma Link Copied!' : 'Share Official Diploma'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDrillIdx(0);
                setPickedIdx(null);
                setGoldStars(0);
                setResults({});
                setGraduated(false);
              }}
              className="inline-flex h-10 items-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 text-xs sm:text-sm font-semibold text-zinc-800 cursor-pointer"
            >
              Play Again
            </button>

            {onReturnToActiveMatch && activeMatchName ? (
              <button
                type="button"
                onClick={onReturnToActiveMatch}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-4 text-xs sm:text-sm font-semibold text-white cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Return to Active Match ({activeMatchName}) →</span>
              </button>
            ) : onGoToHinge ? (
              <button
                type="button"
                onClick={onGoToHinge}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-4 text-xs sm:text-sm font-semibold text-white cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Use +8% Spark on Prowl →</span>
              </button>
            ) : null}

            <a
              href={MONETIZATION_CONFIG.tipJarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-4 text-xs sm:text-sm font-semibold text-zinc-900"
            >
              <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
              <span>Support This Project</span>
            </a>
          </div>

          <div className="text-left pt-2">
            <CrowdsourceSubmissionBar
              surface={mode === 'headmistress' ? 'cub_school_her' : 'cub_school_him'}
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-3.5 animate-stage-in">
      {/* Compact Single-Row HUD: Clean Inline Text + shadcn Segmented Tabs */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div
            data-testid="cub-school-perk-banner"
            className={`text-xs font-semibold ${
              perkUnlocked ? 'text-emerald-700' : 'text-zinc-600'
            }`}
          >
            <span>
              {perkUnlocked
                ? `✨ +8% Etiquette Spark Active (${bestStars}/12 Stars)`
                : `${bestStars}/4 Gold Stars for +8% Chat Spark`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onReturnToActiveMatch && activeMatchName && (
              <button
                type="button"
                onClick={onReturnToActiveMatch}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs font-medium text-white cursor-pointer"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Return to Active Match ({activeMatchName}) →</span>
              </button>
            )}

            <div className="inline-flex rounded-lg bg-zinc-100 p-1">
              <button
                type="button"
                onClick={() => handleSwitchMode('headmistress')}
                className={`rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors ${
                  mode === 'headmistress' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {mode === 'headmistress' ? 'Headmistress Grading Mode' : 'Headmistress'}
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('candidate')}
                className={`rounded-md px-3 py-1 text-xs font-medium cursor-pointer transition-colors ${
                  mode === 'candidate' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {mode === 'candidate' ? 'Cub Candidate Exam' : 'Candidate'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Level Curriculum Switcher + Bite-Sized 4-Scenario Module Progress */}
      <div className="space-y-2">
        <div
          data-testid="cub-school-level-bar"
          className="grid grid-cols-3 gap-1.5 rounded-xl bg-zinc-100 p-1"
        >
          {SCHOOL_LEVEL_SPECS.map((spec) => {
            const isCurrentLevel = currentLevelSpec.level === spec.level;
            const levelCleared = [0, 1, 2, 3].every(
              (offset) => results[spec.startIdx + offset] !== undefined,
            );
            return (
              <button
                key={spec.level}
                type="button"
                onClick={() => {
                  setDrillIdx(spec.startIdx);
                  setPickedIdx(null);
                }}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  isCurrentLevel
                    ? 'bg-white text-zinc-950 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {levelCleared ? `✓ ${spec.shortLabel}` : spec.shortLabel}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5" aria-label="Drill progress">
          {[0, 1, 2, 3].map((offset) => {
            const absIdx = currentLevelSpec.startIdx + offset;
            const passed = results[absIdx];
            const isCurrent = absIdx === drillIdx;
            return (
              <div
                key={absIdx}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-zinc-900'
                    : passed === true
                      ? 'bg-emerald-500'
                      : passed === false
                        ? 'bg-rose-500'
                        : 'bg-zinc-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Visual Scene Quiz Card. Question First, Clean shadcn Surface */}
      <section className="editorial-hinge-card overflow-hidden rounded-2xl bg-white">
        {/* Illustrated Scene Banner + Live Reaction Avatar */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-zinc-950">
          <img
            data-testid="cub-school-scene-img"
            src={drill.sceneImage}
            alt={drill.topicTag}
            className="h-full w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Top-Left Level & Step Pill */}
          <div className="absolute top-3.5 left-4 flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-zinc-950/85 px-2.5 py-1 text-xs font-semibold text-amber-300 shadow-2xs">
              {currentLevelSpec.badge}
            </span>
            <span className="rounded-md bg-white/95 px-2.5 py-1 text-xs font-medium text-zinc-900 shadow-2xs">
              Step {stepInLevel} of 4 · {drill.topicTag}
            </span>
          </div>

          {/* Right Reaction Portrait */}
          <div className="absolute right-4 bottom-3.5 shrink-0">
            <div className="relative">
              <img
                src={reactionPortrait}
                alt="Academy reaction"
                className={`h-24 w-20 sm:h-28 sm:w-22 rounded-xl object-cover border-2 border-white/90 shadow-lg ${preset.motionClass}`}
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white shadow-xs">
                {preset.particle} {preset.badge}
              </span>
            </div>
          </div>

          {/* Bold 1-Line Question Directly Over Bottom Gradient */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pr-28 sm:pr-32">
            <h1
              data-testid="cub-school-question"
              className="text-lg sm:text-xl font-semibold tracking-tight leading-snug text-white"
            >
              {drill.punchyQuestion}
            </h1>
          </div>
        </div>

        {/* Crisp A / B / C 1-Tap Choices */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid gap-2.5">
            {drill.options.map((opt, idx) => {
              const isPicked = pickedIdx === idx;
              const letter = OPTION_LETTERS[idx] ?? String(idx + 1);
              return (
                <button
                  key={opt.label}
                  type="button"
                  data-testid={opt.isGoldStar ? 'gold-star-option' : `rookie-option-${idx}`}
                  disabled={pickedIdx !== null}
                  onClick={() => {
                    setPickedIdx(idx);
                    setResults((prev) => ({ ...prev, [drillIdx]: opt.isGoldStar }));
                    if (opt.isGoldStar) {
                      sfx.greenFlag();
                      const nextStars = goldStars + 1;
                      setGoldStars(nextStars);
                      onUpdateGoldStars?.(Math.max(initialGoldStars, nextStars));
                      emitXpBurst(10, 'Gold Star Ruling!', '⭐ +10 XP');
                    } else {
                      sfx.redFlag();
                    }
                  }}
                  className={`group flex w-full items-center gap-3 rounded-xl p-3.5 text-left text-sm transition-colors cursor-pointer ${
                    pickedIdx === null
                      ? 'border border-zinc-200 bg-white font-medium text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50'
                      : opt.isGoldStar
                        ? 'border-2 border-emerald-500 bg-emerald-50 font-semibold text-emerald-950'
                        : isPicked
                          ? 'border-2 border-rose-500 bg-rose-50 font-medium text-rose-950'
                          : 'border border-zinc-200/70 bg-zinc-50/50 text-zinc-400'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                      pickedIdx === null
                        ? 'bg-zinc-100 text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white'
                        : opt.isGoldStar
                          ? 'bg-emerald-600 text-white'
                          : isPicked
                            ? 'bg-rose-600 text-white'
                            : 'bg-zinc-100 text-zinc-400'
                    }`}
                  >
                    {pickedIdx !== null && opt.isGoldStar
                      ? '✓'
                      : pickedIdx !== null && isPicked
                        ? '✕'
                        : letter}
                  </span>
                  <span className="leading-snug">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Instant Verdict + Post-Answer Real Receipt + Next Button */}
          {pickedOption && (
            <div
              className={`rounded-xl p-4 space-y-2 animate-stage-in ${
                pickedOption.isGoldStar
                  ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-950'
                  : 'bg-zinc-100 border border-zinc-200 text-zinc-900'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-[220px]">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>
                      {pickedOption.isGoldStar ? 'Gold Star Ruling' : 'Headmistress Detention'}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-snug">
                    {pickedOption.headmistressVerdict}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (drillIdx + 1 < activeDeck.length) {
                      setDrillIdx(drillIdx + 1);
                      setPickedIdx(null);
                    } else {
                      sfx.victoryFanfare();
                      setGraduated(true);
                      onEarnDiploma?.();
                      awardPassportBonusXp(
                        `cub_school_diploma_${mode}`,
                        30,
                        'Academy Diploma Conferred!',
                        '🎓 +30 XP',
                      );
                    }
                  }}
                  className="shrink-0 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 text-sm font-medium text-white transition-colors cursor-pointer"
                >
                  {drillIdx + 1 < activeDeck.length
                    ? stepInLevel === 4
                      ? `Unlock Lv.${currentLevelSpec.level + 1} (Next Scenario) →`
                      : `Next Scenario (Step ${stepInLevel + 1} of 4) →`
                    : 'Claim Official Diploma →'}
                </button>
              </div>
            </div>
          )}

          {/* Clean Neutral shadcn Product Footer Row */}
          {fixProduct && (
            <a
              href={buildAffiliateUrl(fixProduct, `cub_school_m${drill.moduleNumber}`)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() =>
                trackEvent('affiliate_clicked', {
                  item_id: fixProduct.id,
                  surface: 'cub_school',
                  module: drill.moduleNumber,
                })
              }
              className="group flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-2.5 hover:border-zinc-300 hover:bg-zinc-100/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                  src={fixProduct.photoUrl}
                  alt={fixProduct.name}
                  className="h-10 w-10 rounded-lg object-cover shrink-0 border border-zinc-200 bg-white"
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-zinc-900 leading-snug group-hover:underline">
                    {fixProduct.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {fixProduct.priceDisplay} · Amazon Associate pick
                  </div>
                </div>
              </div>

              <span className="shrink-0 inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 text-xs sm:text-sm font-medium text-white group-hover:bg-zinc-800 transition-colors">
                <span>Shop the Fix on Amazon</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          )}
        </div>
      </section>

      {/* Front-and-Center Role-Specific Scenario Submission */}
      <CrowdsourceSubmissionBar
        surface={mode === 'headmistress' ? 'cub_school_her' : 'cub_school_him'}
        compact
      />
    </div>
  );
};
