import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, ExternalLink, GraduationCap, Heart, Share2 } from 'lucide-react';
import { MONETIZATION_CONFIG } from '../config/monetization';
import {
  EXPRESSION_MOTION_PRESETS,
  type PortraitExpression,
  V35_CAST_VISUALS,
} from '../data/v35AssetManifest';
import { V35_CUB_SCHOOL_DRILLS } from '../data/v35CubSchool';
import { buildAffiliateUrl, getAffiliateById } from '../lib/affiliates';
import { sfx } from '../lib/sound';
import { shareOrCopy } from '../lib/viral';

export interface CubSchoolViewProps {
  role: 'her' | 'him';
  onEarnDiploma?: () => void;
}

export const CubSchoolView: React.FC<CubSchoolViewProps> = ({ role, onEarnDiploma }) => {
  const [mode, setMode] = useState<'headmistress' | 'candidate'>(
    role === 'her' ? 'headmistress' : 'candidate',
  );
  const [drillIdx, setDrillIdx] = useState(0);
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const [goldStars, setGoldStars] = useState(0);
  const [graduated, setGraduated] = useState(false);
  const [copiedDiploma, setCopiedDiploma] = useState(false);

  useEffect(() => {
    setMode(role === 'her' ? 'headmistress' : 'candidate');
    setDrillIdx(0);
    setPickedIdx(null);
    setGoldStars(0);
    setGraduated(false);
  }, [role]);

  const drill = V35_CUB_SCHOOL_DRILLS[drillIdx];
  const pickedOption = pickedIdx !== null ? drill.options[pickedIdx] : null;
  const activeExpression: PortraitExpression = pickedOption ? pickedOption.expression : 'smirk';
  const preset = EXPRESSION_MOTION_PRESETS[activeExpression];
  const headmistressPortrait = V35_CAST_VISUALS.elena.primaryPortrait;
  const candidatePortrait = V35_CAST_VISUALS.soren.primaryPortrait;

  const fixProduct = getAffiliateById(drill.fixItAffiliateId);

  if (graduated) {
    return (
      <div className="mx-auto w-full max-w-3xl animate-stage-in">
        <section className="editorial-hinge-card rounded-3xl p-8 sm:p-10 text-center bg-gradient-to-b from-[#FFFDF9] to-amber-50/50 border-2 border-amber-300/70 space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-900">
            <Award className="h-8 w-8" />
          </div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-amber-900">
            Velvet Palms Academy • Honors Conferral
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#18101E]">
            📜 Certified Housebroken Cub Diploma
          </h1>
          <p className="text-sm sm:text-base text-stone-700 max-w-xl mx-auto leading-relaxed">
            Completed all 12 real-world courtship drills with{' '}
            <strong>{goldStars}/12 Gold Stars</strong> — Bathroom Lid Certified, Four-Pillow
            Approved, Zero Mental-Load Dumping, and Sidewalk Hand-Hold Verified.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={async () => {
                await shareOrCopy({
                  title: 'Certified Housebroken Cub Diploma',
                  text: `🎓 Scored ${goldStars}/12 Gold Stars in Cougars & Cubs Club Obedience School — Certified Housebroken! Test your etiquette:`,
                  url: 'https://cougarsandcubs.club',
                });
                setCopiedDiploma(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#18101E] px-6 py-3 text-xs sm:text-sm font-bold text-white cursor-pointer"
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
                setGraduated(false);
              }}
              className="rounded-full border border-stone-300 bg-white px-5 py-3 text-xs font-bold text-stone-800 cursor-pointer"
            >
              Run All 12 Drills Again
            </button>

            <a
              href={MONETIZATION_CONFIG.tipJarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300 px-5 py-3 text-xs font-extrabold text-amber-950"
            >
              <Heart className="h-3.5 w-3.5 fill-amber-600 text-amber-600" />
              <span>💛 Support This Project</span>
            </a>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 animate-stage-in">
      {/* Role-Aware Header */}
      <section className="editorial-hinge-card rounded-3xl p-6 bg-gradient-to-r from-white via-amber-50/40 to-rose-50/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-950">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>
              {mode === 'headmistress'
                ? '🐆 Headmistress Grading Mode'
                : '🎓 Cub Candidate Exam'}
            </span>
          </span>
          <h1 className="mt-2 font-editorial text-2xl sm:text-3xl font-bold text-[#18101E]">
            Cub Obedience School • Module {drill.moduleNumber} of {V35_CUB_SCHOOL_DRILLS.length}
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-stone-600">
            {mode === 'headmistress'
              ? 'Grade real complaints straight from older women & send rookie offenders the exact fix.'
              : 'Pass all 12 real-world courtship drills to earn your shareable Certified Housebroken Diploma.'}
          </p>
        </div>

        <div className="inline-flex rounded-full bg-stone-100 p-1">
          <button
            type="button"
            onClick={() => setMode('headmistress')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold cursor-pointer ${
              mode === 'headmistress' ? 'bg-[#18101E] text-white' : 'text-stone-600'
            }`}
          >
            🐆 Headmistress
          </button>
          <button
            type="button"
            onClick={() => setMode('candidate')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold cursor-pointer ${
              mode === 'candidate' ? 'bg-[#18101E] text-white' : 'text-stone-600'
            }`}
          >
            🎓 Candidate
          </button>
        </div>
      </section>

      {/* Main Animated Drill Card */}
      <section className="editorial-hinge-card rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-rose-800">
              Module #{drill.moduleNumber} • Gold Stars: {goldStars}/{V35_CUB_SCHOOL_DRILLS.length}
            </div>
            <h2 className="font-editorial text-2xl font-bold text-[#18101E]">{drill.title}</h2>
            <blockquote className="rounded-2xl bg-stone-50 border-l-4 border-rose-500 px-4 py-2.5 text-xs sm:text-sm italic text-stone-700">
              {drill.redditComplaintQuote}
            </blockquote>
          </div>

          <div className="relative shrink-0 self-center">
            <img
              src={mode === 'headmistress' ? headmistressPortrait : candidatePortrait}
              alt="Academy reactions"
              className={`h-32 w-24 rounded-2xl object-cover ring-2 shadow-md ${preset.tintClass} ${preset.motionClass}`}
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#18101E] px-2.5 py-0.5 text-[10px] font-bold text-amber-200">
              {preset.particle} {preset.badge}
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base font-medium text-stone-800 leading-relaxed">
          {drill.scenarioSetup}
        </p>

        <div className="grid gap-3">
          {drill.options.map((opt, idx) => {
            const isPicked = pickedIdx === idx;
            return (
              <button
                key={opt.label}
                type="button"
                data-testid={opt.isGoldStar ? 'gold-star-option' : `rookie-option-${idx}`}
                disabled={pickedIdx !== null}
                onClick={() => {
                  setPickedIdx(idx);
                  if (opt.isGoldStar) {
                    sfx.greenFlag();
                    setGoldStars((g) => g + 1);
                  } else {
                    sfx.redFlag();
                  }
                }}
                className={`w-full rounded-2xl p-4 text-left text-sm sm:text-base font-medium whitespace-normal transition cursor-pointer ${
                  pickedIdx === null
                    ? 'border border-stone-200 bg-stone-50/70 text-stone-900 hover:border-stone-400 hover:bg-white'
                    : opt.isGoldStar
                      ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                      : isPicked
                        ? 'border-2 border-rose-500 bg-rose-50 text-rose-950'
                        : 'border border-stone-200 bg-white/50 text-stone-400'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {pickedOption && (
          <div
            className={`rounded-2xl p-5 space-y-3 ${
              pickedOption.isGoldStar
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {pickedOption.isGoldStar ? '⭐ Gold Star Ruling' : '🚩 Headmistress Detention'}
              </span>
            </div>
            <p className="text-sm font-semibold leading-relaxed">
              {pickedOption.headmistressVerdict}
            </p>

            <button
              type="button"
              onClick={() => {
                if (drillIdx + 1 < V35_CUB_SCHOOL_DRILLS.length) {
                  setDrillIdx(drillIdx + 1);
                  setPickedIdx(null);
                } else {
                  sfx.victoryFanfare();
                  setGraduated(true);
                  onEarnDiploma?.();
                }
              }}
              className="rounded-full bg-[#18101E] px-6 py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              {drillIdx + 1 < V35_CUB_SCHOOL_DRILLS.length
                ? `Next Module (#${drillIdx + 2}) →`
                : 'Claim Official Diploma →'}
            </button>
          </div>
        )}

        {/* Contextual Amazon "Send Him the Fix" Card */}
        {fixProduct && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
            <div className="flex items-center gap-3.5">
              <img
                src={fixProduct.photoUrl}
                alt={fixProduct.name}
                className="h-14 w-14 rounded-xl object-cover shrink-0"
              />
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
                  {fixProduct.badge}
                </div>
                <div className="text-sm font-bold text-[#18101E]">{fixProduct.name}</div>
                <div className="text-xs text-stone-600">{fixProduct.priceDisplay}</div>
              </div>
            </div>

            <a
              href={buildAffiliateUrl(fixProduct, `cub_school_m${drill.moduleNumber}`)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#18101E] px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition"
            >
              <span>Shop the Fix</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </section>
    </div>
  );
};
