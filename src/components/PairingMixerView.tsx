import React, { useState } from 'react';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Crown,
  Dices,
  Flame,
  Lock,
  MessageCircle,
  Minus,
  Plus,
  Send,
  Sliders,
  Sparkles,
  X,
} from 'lucide-react';
import { EPISODES } from '../data/episodes';
import type { WalletState } from '../domain/economy';
import type { RunPacingMode } from '../domain/gameEngine';
import {
  getProfileDetails,
  HER_ARCHETYPES,
  HIS_ARCHETYPES,
  type HerArchetype,
  type HisArchetype,
  type PairingAnalysis,
  type PlayerRole,
  type SubplotTag,
} from '../domain/taxonomy';
import { sfx } from '../lib/sound';

interface PairingMixerViewProps {
  role: PlayerRole;
  her: HerArchetype;
  his: HisArchetype;
  pairing: PairingAnalysis;
  wallet: WalletState;
  selectedVipIds: string[];
  pacingMode?: RunPacingMode;
  customEditCount?: number;
  noticeBanner: string | null;
  onChangeRole: (role: PlayerRole) => void;
  onChangePacingMode?: (mode: RunPacingMode) => void;
  onSelectHer: (her: HerArchetype) => void;
  onSelectHis: (his: HisArchetype) => void;
  onUpdateHerCustom?: (her: HerArchetype) => void;
  onUpdateHisCustom?: (his: HisArchetype) => void;
  onAdjustHerAge: (delta: number) => void;
  onAdjustHisAge: (delta: number) => void;
  onToggleVipEpisode: (episodeId: string, creditCost: number) => void;
  onStartGame: () => void;
  onOpenBoutique?: () => void;
  onOpenLiveInbox: () => void;
  onOpenPopTrivia: () => void;
  onOpenChecklist?: () => void;
  onQuickCreateAudition: () => void;
  onOpenFieldGuide: () => void;
}

type HerDecadeFilter = 'all' | '30s' | '40s' | '50s' | '60s';

export const PairingMixerView: React.FC<PairingMixerViewProps> = ({
  role,
  her,
  his,
  pairing,
  wallet,
  selectedVipIds,
  pacingMode = 'curated',
  customEditCount = 0,
  noticeBanner,
  onChangeRole,
  onChangePacingMode,
  onSelectHer,
  onSelectHis,
  onUpdateHerCustom,
  onUpdateHisCustom,
  onAdjustHerAge,
  onAdjustHisAge,
  onToggleVipEpisode,
  onStartGame,
  onOpenBoutique,
  onOpenLiveInbox,
  onOpenPopTrivia,
  onOpenChecklist,
  onQuickCreateAudition,
  onOpenFieldGuide,
}) => {
  const [castTab, setCastTab] = useState<'her' | 'him'>('her');
  const [herFilter, setHerFilter] = useState<HerDecadeFilter>('all');
  const [expandedGrid, setExpandedGrid] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<'custom' | 'vip' | null>(null);
  const [shuffling, setShuffling] = useState(false);
  const [mobilePairSlot, setMobilePairSlot] = useState<'her' | 'him'>('her');

  const vipEpisodes = EPISODES.filter((e) => e.isVip);
  const herDetails = getProfileDetails(her);
  const hisDetails = getProfileDetails(his);

  const filteredHerList = HER_ARCHETYPES.filter((item) => {
    if (herFilter === '30s') return item.age >= 30 && item.age <= 39;
    if (herFilter === '40s') return item.age >= 40 && item.age <= 49;
    if (herFilter === '50s') return item.age >= 50 && item.age <= 59;
    if (herFilter === '60s') return item.age >= 60;
    return true;
  });

  const herIdx = HER_ARCHETYPES.findIndex((h) => h.id === her.id);
  const hisIdx = HIS_ARCHETYPES.findIndex((c) => c.id === his.id);

  const cycleHer = (dir: 1 | -1) => {
    sfx.messagePop();
    const next = HER_ARCHETYPES[(herIdx + dir + HER_ARCHETYPES.length) % HER_ARCHETYPES.length];
    onSelectHer(next);
  };

  const cycleHis = (dir: 1 | -1) => {
    sfx.messagePop();
    const next = HIS_ARCHETYPES[(hisIdx + dir + HIS_ARCHETYPES.length) % HIS_ARCHETYPES.length];
    onSelectHis(next);
  };

  const handleSlotMachineShuffle = () => {
    if (shuffling) return;
    setShuffling(true);
    let ticks = 0;
    const interval = window.setInterval(() => {
      ticks += 1;
      sfx.sliderTick(25 + ticks * 4);
      const randHer = HER_ARCHETYPES[Math.floor(Math.random() * HER_ARCHETYPES.length)];
      const validCubs = HIS_ARCHETYPES.filter((c) => c.age < randHer.age - 3);
      const randHis =
        validCubs[Math.floor(Math.random() * validCubs.length)] ?? HIS_ARCHETYPES[0];
      onSelectHer(randHer);
      onSelectHis(randHis);
      if (ticks >= 6) {
        window.clearInterval(interval);
        sfx.greenFlag();
        setShuffling(false);
      }
    }, 65);
  };

  const toggleHerTag = (tag: SubplotTag) => {
    if (!onUpdateHerCustom) return;
    const next = her.subplotTags.includes(tag)
      ? her.subplotTags.filter((t) => t !== tag)
      : [...her.subplotTags, tag];
    onUpdateHerCustom({ ...her, subplotTags: next });
  };

  const toggleHisTag = (tag: SubplotTag) => {
    if (!onUpdateHisCustom) return;
    const next = his.subplotTags.includes(tag)
      ? his.subplotTags.filter((t) => t !== tag)
      : [...his.subplotTags, tag];
    onUpdateHisCustom({ ...his, subplotTags: next });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-stage-in">
      {noticeBanner && (
        <div className="vice-panel rounded-2xl border-[#E5C17B]/40 bg-[#1E1729] px-5 py-3 text-sm font-medium text-[#FDE68A]">
          {noticeBanner}
        </div>
      )}

      {/* Editorial Header + Segmented Role Switch */}
      <section className="text-center space-y-4 pt-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E5C17B]/30 bg-[#15101C] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <Flame className="h-3.5 w-3.5 text-rose-500" />
          <span>Cougars &amp; Cubs Club • Interactive Romance Game</span>
        </div>

        <h1 className="font-display text-[2rem] sm:text-[2.75rem] text-[#FAF7F5] max-w-3xl mx-auto">
          Lower Your Age Slider. Vet the Red Flags.{' '}
          <span className="italic text-[#FDE68A]">Win Real Love.</span>
        </h1>

        {/* Clean 2-Segment Role Pill */}
        <div className="mx-auto inline-grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-2xl border border-white/[0.08] bg-[#15101C] p-1.5 max-w-xl w-full">
          <button
            type="button"
            onClick={() => {
              sfx.messagePop();
              onChangeRole('her');
            }}
            className={`rounded-xl px-4 py-2.5 text-left transition cursor-pointer ${
              role === 'her'
                ? 'bg-rose-600 text-[#FAF7F5] shadow-md'
                : 'text-stone-300 hover:bg-white/[0.05]'
            }`}
          >
            <div className="text-sm font-semibold">🐆 Play as Her</div>
            <div className="text-xs opacity-85">Vet &amp; Train • Catch Red Flags</div>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.messagePop();
              onChangeRole('him');
            }}
            className={`rounded-xl px-4 py-2.5 text-left transition cursor-pointer ${
              role === 'him'
                ? 'bg-[#E5C17B] text-[#0C0910] shadow-md'
                : 'text-stone-300 hover:bg-white/[0.05]'
            }`}
          >
            <div className="text-sm font-semibold">🥂 Play as Him</div>
            <div className="text-xs opacity-85">Impress &amp; Commit • Code-Switch</div>
          </button>
        </div>
      </section>

      {/* Mobile Pair Switcher */}
      <div className="flex lg:hidden rounded-2xl border border-white/[0.08] bg-[#15101C] p-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setMobilePairSlot('her')}
          className={`flex-1 rounded-xl py-2 transition cursor-pointer ${
            mobilePairSlot === 'her' ? 'bg-rose-600 text-[#FAF7F5]' : 'text-stone-300'
          }`}
        >
          Her: {her.name}, {her.age}F
        </button>
        <button
          type="button"
          onClick={() => setMobilePairSlot('him')}
          className={`flex-1 rounded-xl py-2 transition cursor-pointer ${
            mobilePairSlot === 'him' ? 'bg-[#E5C17B] text-[#0C0910]' : 'text-stone-300'
          }`}
        >
          Cub: {his.name}, {his.age}M
        </button>
      </div>

      {/* UNIFIED 3-COLUMN "MATCHMAKER'S STAGE" (Fits Above the Fold!) */}
      <section className="grid gap-5 lg:grid-cols-[1fr_300px_1fr] items-stretch">
        {/* LEFT SPOTLIGHT: HER */}
        <div
          className={`${
            mobilePairSlot === 'him' ? 'hidden lg:flex' : 'flex'
          } vice-panel rounded-3xl p-4 sm:p-5 flex-col justify-between gap-3.5`}
        >
          <div className="space-y-3">
            <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-2xl bg-[#0C0910]">
              <img
                key={her.photoUrl}
                src={her.photoUrl}
                alt={`${her.name}, ${her.age}`}
                className="h-full w-full object-cover object-top animate-stage-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15101C] via-transparent to-transparent" />

              <button
                type="button"
                aria-label="Previous Her character"
                onClick={() => cycleHer(-1)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[#0C0910]/70 p-2 text-white hover:bg-[#0C0910] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next Her character"
                onClick={() => cycleHer(1)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[#0C0910]/70 p-2 text-white hover:bg-[#0C0910] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <span className="absolute top-3 left-3 rounded-full bg-[#0C0910]/80 border border-white/15 px-3 py-1 text-xs font-medium text-[#FDE68A]">
                📏 {herDetails.height} • {herDetails.zodiac.split('•')[0].replace(' Sun', '').trim()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-2xl text-[#FAF7F5]">
                  {her.name}, <span className="text-rose-400">{her.age}F</span>
                </h2>
                <div className="text-xs font-semibold text-rose-300">{her.title}</div>
              </div>

              {/* Age Fine-Tune Stepper */}
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E1729] border border-white/[0.08] px-2.5 py-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => onAdjustHerAge(-1)}
                  aria-label="Decrease Her Age"
                  className="rounded-lg bg-white/10 p-1 hover:bg-white/20 cursor-pointer"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="font-semibold text-[#FAF7F5] w-6 text-center">{her.age}</span>
                <button
                  type="button"
                  onClick={() => onAdjustHerAge(1)}
                  aria-label="Increase Her Age"
                  className="rounded-lg bg-white/10 p-1 hover:bg-white/20 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed line-clamp-2">
              {her.vibeSummary}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#1E1729] px-3 py-2 text-xs text-stone-300">
            <span className="truncate">🍸 {herDetails.signatureDrink}</span>
            <span className="text-[#FDE68A] font-medium">{herDetails.loveLanguage}</span>
          </div>
        </div>

        {/* CENTER PEDESTAL: CHEMISTRY MEDALLION + PLAY CTA + DICE SHUFFLER */}
        <div className="vice-panel rounded-3xl p-5 flex flex-col justify-between gap-4 text-center border-[#E5C17B]/25">
          <div className="space-y-2.5">
            <span className="inline-block rounded-full bg-[#E5C17B]/15 border border-[#E5C17B]/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
              {pairing.badgeLabel}
            </span>

            <div className="font-display text-2xl text-[#FAF7F5]">
              {her.name} × {his.name}
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">{pairing.zodiacSpark}</p>

            {pairing.energyPolarity && (
              <div className="rounded-xl bg-[#1E1729] border border-rose-500/25 px-3 py-1.5 text-xs font-medium text-rose-200">
                {pairing.energyPolarity}
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            {onChangePacingMode && (
              <div className="grid grid-cols-2 rounded-xl bg-[#1E1729] p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onChangePacingMode('curated')}
                  className={`rounded-lg py-1.5 transition cursor-pointer ${
                    pacingMode === 'curated'
                      ? 'bg-[#E5C17B] text-[#0C0910]'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  ⚡ 8-Scene Arc
                </button>
                <button
                  type="button"
                  onClick={() => onChangePacingMode('marathon')}
                  className={`rounded-lg py-1.5 transition cursor-pointer ${
                    pacingMode === 'marathon'
                      ? 'bg-[#E5C17B] text-[#0C0910]'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  🎬 Full Season
                </button>
              </div>
            )}

            {/* Primary Velvet Crimson Play CTA */}
            <button
              type="button"
              onClick={() => {
                sfx.swipeRight();
                onStartGame();
              }}
              className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 text-[15px] font-semibold text-[#FAF7F5] shadow-lg active:scale-[0.98] transition cursor-pointer"
            >
              Start Vetting →
            </button>

            <button
              type="button"
              onClick={handleSlotMachineShuffle}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5C17B]/35 bg-[#1E1729] py-2.5 text-sm font-semibold text-[#FDE68A] hover:bg-[#E5C17B]/15 transition cursor-pointer"
            >
              <Dices className={`h-4 w-4 ${shuffling ? 'animate-spin' : ''}`} />
              <span>{shuffling ? 'Spinning Chemistry…' : 'Shuffle Spicy Matchup'}</span>
            </button>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/[0.08] text-xs">
            <button
              type="button"
              onClick={() => setActiveDrawer('custom')}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-stone-300 hover:bg-white/[0.05] hover:text-[#FAF7F5] transition cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Sliders className="h-3.5 w-3.5 text-[#E5C17B]" />
                Customize Names, Drinks &amp; Twists
              </span>
              <span className="text-[#FDE68A]">→</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDrawer('vip')}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-stone-300 hover:bg-white/[0.05] hover:text-[#FAF7F5] transition cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Crown className="h-3.5 w-3.5 text-[#E5C17B]" />
                VIP Bonus Scenes ({selectedVipIds.length}/4)
              </span>
              <span className="text-[#FDE68A]">→</span>
            </button>
          </div>
        </div>

        {/* RIGHT SPOTLIGHT: HIM (CUB) */}
        <div
          className={`${
            mobilePairSlot === 'her' ? 'hidden lg:flex' : 'flex'
          } vice-panel rounded-3xl p-4 sm:p-5 flex-col justify-between gap-3.5`}
        >
          <div className="space-y-3">
            <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-2xl bg-[#0C0910]">
              <img
                key={his.photoUrl}
                src={his.photoUrl}
                alt={`${his.name}, ${his.age}`}
                className="h-full w-full object-cover object-top animate-stage-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15101C] via-transparent to-transparent" />

              <button
                type="button"
                aria-label="Previous Cub character"
                onClick={() => cycleHis(-1)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[#0C0910]/70 p-2 text-white hover:bg-[#0C0910] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next Cub character"
                onClick={() => cycleHis(1)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[#0C0910]/70 p-2 text-white hover:bg-[#0C0910] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <span className="absolute top-3 left-3 rounded-full bg-[#0C0910]/80 border border-white/15 px-3 py-1 text-xs font-medium text-[#FDE68A]">
                📏 {hisDetails.height} • {hisDetails.zodiac.split('•')[0].replace(' Sun', '').trim()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-2xl text-[#FAF7F5]">
                  {his.name}, <span className="text-[#FDE68A]">{his.age}M</span>
                </h2>
                <div className="text-xs font-semibold text-[#E5C17B]">{his.title}</div>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E1729] border border-white/[0.08] px-2.5 py-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => onAdjustHisAge(-1)}
                  aria-label="Decrease His Age"
                  className="rounded-lg bg-white/10 p-1 hover:bg-white/20 cursor-pointer"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="font-semibold text-[#FAF7F5] w-6 text-center">{his.age}</span>
                <button
                  type="button"
                  onClick={() => onAdjustHisAge(1)}
                  aria-label="Increase His Age"
                  className="rounded-lg bg-white/10 p-1 hover:bg-white/20 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed line-clamp-2">
              {his.vibeSummary}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#1E1729] px-3 py-2 text-xs text-stone-300">
            <span className="truncate">🥂 {hisDetails.signatureDrink}</span>
            <span className="text-[#FDE68A] font-medium">{hisDetails.loveLanguage}</span>
          </div>
        </div>
      </section>

      {/* COMPACT TABBED CAST SELECTOR STRIP (Replaces Two Giant 1,000px Stacked Grids!) */}
      <section className="vice-panel rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl bg-[#1E1729] p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setCastTab('her')}
              className={`rounded-lg px-4 py-1.5 transition cursor-pointer ${
                castTab === 'her'
                  ? 'bg-rose-600 text-[#FAF7F5]'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              🐆 Her Roster ({HER_ARCHETYPES.length} • Ages 30–64)
            </button>
            <button
              type="button"
              onClick={() => setCastTab('him')}
              className={`rounded-lg px-4 py-1.5 transition cursor-pointer ${
                castTab === 'him'
                  ? 'bg-[#E5C17B] text-[#0C0910]'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              🥂 Cub Roster ({HIS_ARCHETYPES.length} • Ages 21–33)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {castTab === 'her' &&
              (['all', '30s', '40s', '50s', '60s'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setHerFilter(f)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    herFilter === f
                      ? 'bg-[#E5C17B] text-[#0C0910]'
                      : 'bg-[#1E1729] text-stone-300 hover:text-white'
                  }`}
                >
                  {f === 'all' ? 'All Decades' : f === '60s' ? '60+' : f}
                </button>
              ))}

            <button
              type="button"
              onClick={() => setExpandedGrid((v) => !v)}
              className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-[#FDE68A] hover:bg-white/10 cursor-pointer"
            >
              {expandedGrid ? 'Compact Strip' : 'Expand All Cards'}
            </button>
          </div>
        </div>

        <div
          className={
            expandedGrid
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'
              : 'flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x'
          }
        >
          {(castTab === 'her' ? filteredHerList : HIS_ARCHETYPES).map((item) => {
            const isSelected = castTab === 'her' ? item.id === her.id : item.id === his.id;
            const d = getProfileDetails(item);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  if (castTab === 'her') {
                    onSelectHer(item as HerArchetype);
                    setMobilePairSlot('her');
                  } else {
                    onSelectHis(item as HisArchetype);
                    setMobilePairSlot('him');
                  }
                }}
                className={`${
                  expandedGrid ? 'w-full' : 'w-36 sm:w-40 shrink-0 snap-start'
                } group overflow-hidden rounded-2xl border text-left transition bg-[#1E1729] cursor-pointer ${
                  isSelected
                    ? castTab === 'her'
                      ? 'border-rose-500 ring-2 ring-rose-500/60 -translate-y-0.5'
                      : 'border-[#E5C17B] ring-2 ring-[#E5C17B]/60 -translate-y-0.5'
                    : 'border-white/[0.08] hover:border-white/25 hover:-translate-y-0.5'
                }`}
              >
                <div className="relative aspect-[3/3.4] w-full overflow-hidden bg-[#0C0910]">
                  <img
                    src={item.photoUrl}
                    alt={`${item.name}, ${item.age}`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 rounded-full bg-[#0C0910]/80 px-2 py-0.5 text-[11px] font-medium text-[#FDE68A]">
                    {d.height}
                  </span>
                </div>
                <div className="p-2.5">
                  <div className="font-display text-base text-[#FAF7F5] truncate">
                    {item.name}, <span className="text-[#FDE68A]">{item.age}</span>
                  </div>
                  <div className="text-xs text-stone-400 truncate">{item.title}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CLEAN 4-TILE CLUB MODES DOCK */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => {
            sfx.messagePop();
            onOpenLiveInbox();
          }}
          className="vice-panel rounded-2xl p-4 text-left hover:border-[#E5C17B]/40 transition cursor-pointer flex items-center gap-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600/15 text-rose-400">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-semibold text-[#FAF7F5]">Live AI Texting Mode</div>
            <div className="text-xs text-stone-400">Survive Their Inbox live</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            sfx.messagePop();
            onOpenPopTrivia();
          }}
          className="vice-panel rounded-2xl p-4 text-left hover:border-[#E5C17B]/40 transition cursor-pointer flex items-center gap-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5C17B]/15 text-[#E5C17B]">
            <Award className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-semibold text-[#FAF7F5]">Pop-Culture Quiz (+3 Cr)</div>
            <div className="text-xs text-stone-400">Celebrity Cougar &amp; Cub blitz</div>
          </div>
        </button>

        {onOpenChecklist && (
          <button
            type="button"
            onClick={() => {
              sfx.messagePop();
              onOpenChecklist();
            }}
            className="vice-panel rounded-2xl p-4 text-left hover:border-[#E5C17B]/40 transition cursor-pointer flex items-center gap-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600/15 text-rose-300">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold text-[#FAF7F5]">25-Pt Viral Score Test</div>
              <div className="text-xs text-stone-400">Check your lived score (+2 Cr)</div>
            </div>
          </button>
        )}

        <button
          type="button"
          onClick={onQuickCreateAudition}
          className="vice-panel rounded-2xl p-4 text-left hover:border-[#E5C17B]/40 transition cursor-pointer flex items-center gap-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5C17B]/15 text-[#E5C17B]">
            <Send className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-semibold text-[#FAF7F5]">2-Player Audition Link</div>
            <div className="text-xs text-stone-400">Text your match (+3 Cr)</div>
          </div>
        </button>
      </section>

      <div className="text-center">
        <button
          type="button"
          onClick={onOpenFieldGuide}
          className="text-xs font-semibold text-stone-400 hover:text-[#FDE68A] underline cursor-pointer"
        >
          What is a Junior Cougar (6-Yr Gap) vs. Puma vs. Cougar vs. Jaguar? Explore Tier Glossary →
        </button>
      </div>

      {/* MODAL DRAWER: CUSTOMIZE NAMES, DRINKS & TWISTS / VIP SCENES */}
      {activeDrawer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0910]/85 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="vice-panel max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E5C17B]">
                  {activeDrawer === 'custom' ? 'Custom Fantasy Studio' : 'Deep-Cut Episodes'}
                </span>
                <h3 className="font-display text-2xl text-[#FAF7F5]">
                  {activeDrawer === 'custom'
                    ? 'Customize Names, Zero-Proof Orders & Plot Twists'
                    : 'Select Bonus VIP Scenes'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrawer(null)}
                className="rounded-xl border border-white/12 bg-white/[0.05] p-2 text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {activeDrawer === 'custom' && onUpdateHerCustom && onUpdateHisCustom && (
              <div className="space-y-4">
                <div className="rounded-xl bg-[#1E1729] px-3.5 py-2 text-xs text-[#FDE68A]">
                  {wallet.isVip || wallet.isFounderUnlimited
                    ? '👑 VIP Active: Unlimited Custom Builds'
                    : customEditCount >= 2
                      ? '✨ Multi-Twist Build Active (1 Credit on Launch • Unlimited w/ VIP)'
                      : '🎁 1st Custom Twist & All Zero-Proof Drink Presets are FREE'}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-xs text-stone-300">
                    <span className="font-semibold text-[#FAF7F5]">Her Custom Name</span>
                    <input
                      type="text"
                      maxLength={24}
                      value={her.name}
                      onChange={(e) => onUpdateHerCustom({ ...her, name: e.target.value || 'Claire' })}
                      className="w-full rounded-xl border border-white/12 bg-[#1E1729] px-3 py-2 text-sm text-[#FAF7F5]"
                    />
                  </label>
                  <label className="space-y-1 text-xs text-stone-300">
                    <span className="font-semibold text-[#FAF7F5]">Cub Custom Name</span>
                    <input
                      type="text"
                      maxLength={24}
                      value={his.name}
                      onChange={(e) => onUpdateHisCustom({ ...his, name: e.target.value || 'Leo' })}
                      className="w-full rounded-xl border border-white/12 bg-[#1E1729] px-3 py-2 text-sm text-[#FAF7F5]"
                    />
                  </label>
                  <label className="space-y-1 text-xs text-stone-300">
                    <span className="font-semibold text-[#FAF7F5]">Her Star Sign</span>
                    <input
                      type="text"
                      maxLength={36}
                      value={herDetails.zodiac}
                      onChange={(e) => onUpdateHerCustom({ ...her, zodiac: e.target.value })}
                      className="w-full rounded-xl border border-white/12 bg-[#1E1729] px-3 py-2 text-sm text-[#FAF7F5]"
                    />
                  </label>
                  <label className="space-y-1 text-xs text-stone-300">
                    <span className="font-semibold text-[#FAF7F5]">Signature Order</span>
                    <input
                      type="text"
                      maxLength={44}
                      value={herDetails.signatureDrink}
                      onChange={(e) => onUpdateHerCustom({ ...her, signatureDrink: e.target.value })}
                      className="w-full rounded-xl border border-white/12 bg-[#1E1729] px-3 py-2 text-sm text-[#FAF7F5]"
                    />
                  </label>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-[#FDE68A]">
                    1-Tap Zero-Proof, Smoothie &amp; Lounge Presets (Free):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ['🥤 Berry-Collagen Smoothie', true],
                      ['🍵 Iced Ceremonial Matcha', true],
                      ['🍊 Zero-Proof Yuzu Ginger Spritz', true],
                      ['🍒 Tart-Cherry Sleep Mocktail', true],
                      ['☕ Iced Espresso Tonic (Zero-Proof)', true],
                      ['🍸 Dirty Olive Martini', false],
                    ].map(([drinkLabel, zeroProof]) => {
                      const active = herDetails.signatureDrink === drinkLabel;
                      return (
                        <button
                          key={String(drinkLabel)}
                          type="button"
                          onClick={() => {
                            const nextTags: SubplotTag[] = zeroProof
                              ? Array.from(new Set([...her.subplotTags, 'zero_proof_wellness']))
                              : her.subplotTags;
                            onUpdateHerCustom({
                              ...her,
                              signatureDrink: String(drinkLabel),
                              subplotTags: nextTags,
                            });
                          }}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition cursor-pointer ${
                            active
                              ? 'border-[#E5C17B] bg-[#E5C17B] text-[#0C0910] font-semibold'
                              : 'border-white/12 bg-[#1E1729] text-stone-200 hover:bg-white/10'
                          }`}
                        >
                          {String(drinkLabel)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-[#FDE68A]">Plot-Twist Stickers:</div>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ['zero_proof_wellness', 'her', '🥤 Zero-Proof Mocktail & Smoothie Date'],
                        ['black_cat_energy', 'her', '🐈‍⬛ Black Cat Energy (Pushes Back First)'],
                        ['golden_retriever_energy', 'his', '🐕 Golden Retriever Cub'],
                        ['montana_cowboy_slider', 'her', '🤠 Montana Cowboy Age-Slider Dare'],
                        ['broke_dutch_obstacle', 'his', '🚩 Broke College Go-Dutch Horror'],
                        ['spontaneous_getaway', 'her', '✈️ 18h Pool & Cedar Sauna Getaway'],
                        ['phd_campus_cub', 'his', '🎓 Campus Stroll & Omakase Sushi'],
                        ['fiery_foreign', 'her', '🌶️ Fiery International Passion'],
                        ['modest_accent_gentleman', 'his', '🧺 Meadow Picnic & Neon Bowling'],
                      ] as const
                    ).map(([tag, target, label]) => {
                      const active =
                        target === 'her'
                          ? her.subplotTags.includes(tag)
                          : his.subplotTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => (target === 'her' ? toggleHerTag(tag) : toggleHisTag(tag))}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                            active
                              ? 'border-rose-500 bg-rose-600 text-[#FAF7F5]'
                              : 'border-white/12 bg-[#1E1729] text-stone-300 hover:text-white'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {onOpenBoutique && (
                  <div className="flex items-center justify-between gap-2 rounded-2xl bg-[#1E1729] border border-[#E5C17B]/25 p-3.5 text-xs">
                    <span className="text-stone-300">
                      Unlock Unlimited Custom Builds ($6.99 VIP) or sponsor a custom public character ($29)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDrawer(null);
                        onOpenBoutique();
                      }}
                      className="shrink-0 rounded-xl bg-[#E5C17B] px-3 py-1.5 font-semibold text-[#0C0910] cursor-pointer"
                    >
                      VIP Lounge →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeDrawer === 'vip' && (
              <div className="grid gap-3">
                {vipEpisodes.map((ep) => {
                  const unlocked =
                    wallet.isVip ||
                    Boolean(wallet.isFounderUnlimited) ||
                    wallet.unlockedEpisodeIds.includes(ep.id);
                  const active = selectedVipIds.includes(ep.id);
                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => onToggleVipEpisode(ep.id, ep.creditCost)}
                      className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition cursor-pointer ${
                        active
                          ? 'border-[#E5C17B] bg-[#E5C17B]/12'
                          : 'border-white/10 bg-[#1E1729] hover:border-white/25'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-[#FAF7F5]">{ep.title}</div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          {ep.subredditThreadInspiration.replace(/^r\/CougarsAndCubs[^:]*:\s*/i, '')}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold ${
                          unlocked
                            ? active
                              ? 'bg-emerald-500/20 text-emerald-200'
                              : 'bg-white/10 text-[#FDE68A]'
                            : 'bg-[#E5C17B] text-[#0C0910]'
                        }`}
                      >
                        {unlocked ? (
                          <span>{active ? '✓ Added' : 'Include'}</span>
                        ) : (
                          <>
                            <Lock className="h-3.5 w-3.5" />
                            <span>{ep.creditCost} Cr</span>
                          </>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveDrawer(null)}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-sm font-semibold text-[#FAF7F5] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Launch Bar */}
      <div className="sm:hidden sticky bottom-2 z-20 rounded-2xl border border-white/12 bg-[#15101C]/95 p-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-display text-base text-[#FAF7F5]">
            {her.name} ({her.age}F) × {his.name} ({his.age}M)
          </div>
          <div className="truncate text-xs text-[#FDE68A]">
            {pacingMode === 'curated' ? '⚡ 8-Scene Arc' : '🎬 Full Season'} • {pairing.ageGap}yr Gap
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            sfx.swipeRight();
            onStartGame();
          }}
          className="shrink-0 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-[#FAF7F5]"
        >
          Play Run →
        </button>
      </div>
    </div>
  );
};
