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
  createDefaultAdventureProgress,
  type AdventureProgressState,
} from '../domain/progression';
import { EightBitAdventureWorld } from './EightBitAdventureWorld';
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
  onJumpToMapScene?: (episodeId: string) => void;
  adventureProgress?: AdventureProgressState;
  onGainAdventureXp?: (
    deltaXp: number,
    patch?: Partial<AdventureProgressState>,
    rewardKey?: string,
  ) => void;
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
  onJumpToMapScene,
  adventureProgress,
  onGainAdventureXp,
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
    <div className="w-full space-y-6 animate-stage-in">
      {noticeBanner && (
        <div className="vice-panel rounded-2xl bg-[#FFBE0B] px-5 py-3 text-sm font-extrabold text-[#1E1022]">
          {noticeBanner}
        </div>
      )}

      {/* ALIGNED HERO BAR: Left = Bold Headline, Right = 2-Button Role Toggle */}
      <section className="vice-panel rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#FFFDF9] via-[#FFF4F7] to-[#FFFBEB] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-[#1E1022]">
            <Flame className="h-3.5 w-3.5 text-[#FF2E63]" />
            <span>Interactive Age-Gap Romance &amp; Arcade Sim</span>
          </div>

          <h1 className="font-display text-2xl sm:text-[32px] text-[#1E1022]">
            Lower Your Age Slider. Vet the Red Flags.{' '}
            <span className="text-[#FF2E63]">Win Real Love.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 shrink-0 lg:w-[430px]">
          <button
            type="button"
            onClick={() => {
              sfx.messagePop();
              onChangeRole('her');
            }}
            className={`pop-btn rounded-2xl px-4 py-3 text-left cursor-pointer ${
              role === 'her'
                ? 'bg-[#FF2E63] text-white'
                : 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]'
            }`}
          >
            <div className="text-sm font-extrabold">🐆 Play as Her</div>
            <div className={`text-xs font-semibold ${role === 'her' ? 'text-white/90' : 'text-[#5A4664]'}`}>
              Vet &amp; Train • Catch Red Flags
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.messagePop();
              onChangeRole('him');
            }}
            className={`pop-btn rounded-2xl px-4 py-3 text-left cursor-pointer ${
              role === 'him'
                ? 'bg-[#FFBE0B] text-[#1E1022]'
                : 'bg-white text-[#1E1022] hover:bg-[#FFFBEB]'
            }`}
          >
            <div className="text-sm font-extrabold">🥂 Play as Him</div>
            <div className="text-xs font-semibold text-[#5A4664]">
              Impress &amp; Commit • Code-Switch
            </div>
          </button>
        </div>
      </section>

      {/* Mobile Pair Switcher */}
      <div className="flex lg:hidden rounded-2xl border-2 border-[#1E1022] bg-white p-1 text-sm font-bold shadow-[3px_3px_0px_#1E1022]">
        <button
          type="button"
          onClick={() => setMobilePairSlot('her')}
          className={`flex-1 rounded-xl py-2 transition cursor-pointer ${
            mobilePairSlot === 'her' ? 'bg-[#FF2E63] text-white' : 'text-[#1E1022]'
          }`}
        >
          Her: {her.name}, {her.age}F
        </button>
        <button
          type="button"
          onClick={() => setMobilePairSlot('him')}
          className={`flex-1 rounded-xl py-2 transition cursor-pointer ${
            mobilePairSlot === 'him' ? 'bg-[#FFBE0B] text-[#1E1022]' : 'text-[#1E1022]'
          }`}
        >
          Cub: {his.name}, {his.age}M
        </button>
      </div>

      {/* STRICTLY ALIGNED 3-COLUMN MATCHMAKER STAGE (Equal-Height Cards!) */}
      <section className="grid gap-5 lg:grid-cols-[1fr_320px_1fr] items-stretch">
        {/* LEFT SPOTLIGHT: HER */}
        <div
          className={`${
            mobilePairSlot === 'him' ? 'hidden lg:flex' : 'flex'
          } vice-panel rounded-3xl p-5 flex-col justify-between gap-4 h-full`}
        >
          <div className="space-y-3.5">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl border-2 border-[#1E1022] bg-[#1E1022]">
              <img
                key={her.photoUrl}
                src={her.photoUrl}
                alt={`${her.name}, ${her.age}`}
                className="h-full w-full object-cover object-top animate-stage-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1022]/75 via-transparent to-transparent" />

              <button
                type="button"
                aria-label="Previous Her character"
                onClick={() => cycleHer(-1)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full border-2 border-[#1E1022] bg-white p-2 text-[#1E1022] shadow hover:bg-[#FFBE0B] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next Her character"
                onClick={() => cycleHer(1)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full border-2 border-[#1E1022] bg-white p-2 text-[#1E1022] shadow hover:bg-[#FFBE0B] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <span className="absolute top-3 left-3 rounded-full border-2 border-[#1E1022] bg-white px-3 py-1 text-xs font-extrabold text-[#1E1022] shadow">
                📏 {herDetails.height} • {herDetails.zodiac.split('•')[0].replace(' Sun', '').trim()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-2xl sm:text-[26px] text-[#1E1022]">
                  {her.name}, <span className="text-[#FF2E63]">{her.age}F</span>
                </h2>
                <div className="text-[15px] sm:text-base font-bold text-[#D90452]">{her.title}</div>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1E1022] bg-[#FFF4F7] px-2.5 py-1.5 text-sm font-extrabold text-[#1E1022]">
                <button
                  type="button"
                  onClick={() => onAdjustHerAge(-1)}
                  aria-label="Decrease Her Age"
                  className="rounded-lg border border-[#1E1022] bg-white p-1 hover:bg-[#FFBE0B] cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center">{her.age}</span>
                <button
                  type="button"
                  onClick={() => onAdjustHerAge(1)}
                  aria-label="Increase Her Age"
                  className="rounded-lg border border-[#1E1022] bg-white p-1 hover:bg-[#FFBE0B] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-base sm:text-[17px] font-medium text-[#1E1022] leading-relaxed">
              {her.vibeSummary}
            </p>
          </div>

          <div className="rounded-xl border-2 border-[#1E1022] bg-[#FFF4F7] px-3.5 py-3 space-y-1 text-sm font-bold text-[#1E1022]">
            <div>🍸 {herDetails.signatureDrink}</div>
            <div className="text-[#D90452]">💞 {herDetails.loveLanguage}</div>
          </div>
        </div>

        {/* CENTER ARCADE POD: CHEMISTRY + START CTA + SHUFFLE DICE */}
        <div className="vice-panel rounded-3xl p-5 flex flex-col justify-between gap-4 text-center bg-gradient-to-b from-[#FFFDF9] to-[#FFF4F7] h-full">
          <div className="space-y-3">
            <span className="inline-block rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-[#1E1022]">
              {pairing.badgeLabel}
            </span>

            <div className="font-display text-2xl text-[#1E1022]">
              {her.name} × {his.name}
            </div>

            <p className="text-sm font-medium text-[#5A4664] leading-relaxed">
              {pairing.zodiacSpark}
            </p>

            {pairing.energyPolarity && (
              <div className="rounded-xl border-2 border-[#1E1022] bg-white px-3 py-2 text-xs font-extrabold text-[#D90452]">
                {pairing.energyPolarity}
              </div>
            )}
          </div>

          <div className="space-y-3">
            {onChangePacingMode && (
              <div className="grid grid-cols-2 rounded-xl border-2 border-[#1E1022] bg-white p-1 text-xs font-extrabold">
                <button
                  type="button"
                  onClick={() => onChangePacingMode('curated')}
                  className={`rounded-lg py-2 transition cursor-pointer ${
                    pacingMode === 'curated'
                      ? 'bg-[#1E1022] text-white'
                      : 'text-[#1E1022] hover:bg-[#FFF4F7]'
                  }`}
                >
                  ⚡ 8-Scene Arc
                </button>
                <button
                  type="button"
                  onClick={() => onChangePacingMode('marathon')}
                  className={`rounded-lg py-2 transition cursor-pointer ${
                    pacingMode === 'marathon'
                      ? 'bg-[#1E1022] text-white'
                      : 'text-[#1E1022] hover:bg-[#FFF4F7]'
                  }`}
                >
                  🎬 Full Season
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                sfx.swipeRight();
                onStartGame();
              }}
              className="pop-btn w-full h-13 rounded-2xl bg-[#FF2E63] hover:bg-[#E01E50] text-base font-extrabold text-white cursor-pointer"
            >
              Start Vetting →
            </button>

            <button
              type="button"
              onClick={handleSlotMachineShuffle}
              className="pop-btn w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFBE0B] hover:bg-[#FFD166] py-3 text-sm font-extrabold text-[#1E1022] cursor-pointer"
            >
              <Dices className={`h-4 w-4 ${shuffling ? 'animate-spin' : ''}`} />
              <span>{shuffling ? 'Spinning Chemistry…' : 'Shuffle Spicy Matchup'}</span>
            </button>
          </div>

          <div className="space-y-2 pt-3 border-t-2 border-[#1E1022]/12 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveDrawer('custom')}
              className="w-full flex items-center justify-between rounded-xl border-2 border-[#1E1022]/20 bg-white px-3.5 py-2.5 text-[#1E1022] hover:border-[#1E1022] transition cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-[#FF2E63]" />
                Customize Names &amp; Twists
              </span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDrawer('vip')}
              className="w-full flex items-center justify-between rounded-xl border-2 border-[#1E1022]/20 bg-white px-3.5 py-2.5 text-[#1E1022] hover:border-[#1E1022] transition cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 text-[#FFBE0B]" />
                VIP Bonus Scenes ({selectedVipIds.length}/4)
              </span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* RIGHT SPOTLIGHT: HIM (CUB) */}
        <div
          className={`${
            mobilePairSlot === 'her' ? 'hidden lg:flex' : 'flex'
          } vice-panel rounded-3xl p-5 flex-col justify-between gap-4 h-full`}
        >
          <div className="space-y-3.5">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl border-2 border-[#1E1022] bg-[#1E1022]">
              <img
                key={his.photoUrl}
                src={his.photoUrl}
                alt={`${his.name}, ${his.age}`}
                className="h-full w-full object-cover object-top animate-stage-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1022]/75 via-transparent to-transparent" />

              <button
                type="button"
                aria-label="Previous Cub character"
                onClick={() => cycleHis(-1)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full border-2 border-[#1E1022] bg-white p-2 text-[#1E1022] shadow hover:bg-[#FFBE0B] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next Cub character"
                onClick={() => cycleHis(1)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full border-2 border-[#1E1022] bg-white p-2 text-[#1E1022] shadow hover:bg-[#FFBE0B] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <span className="absolute top-3 left-3 rounded-full border-2 border-[#1E1022] bg-white px-3 py-1 text-xs font-extrabold text-[#1E1022] shadow">
                📏 {hisDetails.height} • {hisDetails.zodiac.split('•')[0].replace(' Sun', '').trim()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-2xl sm:text-[26px] text-[#1E1022]">
                  {his.name}, <span className="text-[#D97706]">{his.age}M</span>
                </h2>
                <div className="text-[15px] sm:text-base font-bold text-[#B45309]">{his.title}</div>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1E1022] bg-[#FFFBEB] px-2.5 py-1.5 text-sm font-extrabold text-[#1E1022]">
                <button
                  type="button"
                  onClick={() => onAdjustHisAge(-1)}
                  aria-label="Decrease His Age"
                  className="rounded-lg border border-[#1E1022] bg-white p-1 hover:bg-[#FFBE0B] cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center">{his.age}</span>
                <button
                  type="button"
                  onClick={() => onAdjustHisAge(1)}
                  aria-label="Increase His Age"
                  className="rounded-lg border border-[#1E1022] bg-white p-1 hover:bg-[#FFBE0B] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-base sm:text-[17px] font-medium text-[#1E1022] leading-relaxed">
              {his.vibeSummary}
            </p>
          </div>

          <div className="rounded-xl border-2 border-[#1E1022] bg-[#FFFBEB] px-3.5 py-3 space-y-1 text-sm font-bold text-[#1E1022]">
            <div>🥂 {hisDetails.signatureDrink}</div>
            <div className="text-[#B45309]">💞 {hisDetails.loveLanguage}</div>
          </div>
        </div>
      </section>

      {/* ALIGNED CAST ROSTER CARD */}
      <section className="vice-panel rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-2xl border-2 border-[#1E1022] bg-[#FFF7F0] p-1 text-sm font-extrabold">
            <button
              type="button"
              onClick={() => setCastTab('her')}
              className={`rounded-xl px-4 py-2 transition cursor-pointer ${
                castTab === 'her'
                  ? 'bg-[#FF2E63] text-white'
                  : 'text-[#1E1022] hover:bg-white'
              }`}
            >
              🐆 Her Roster ({HER_ARCHETYPES.length} • Ages 30–64)
            </button>
            <button
              type="button"
              onClick={() => setCastTab('him')}
              className={`rounded-xl px-4 py-2 transition cursor-pointer ${
                castTab === 'him'
                  ? 'bg-[#FFBE0B] text-[#1E1022]'
                  : 'text-[#1E1022] hover:bg-white'
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
                  className={`rounded-full border-2 px-3.5 py-1 text-xs font-extrabold transition cursor-pointer ${
                    herFilter === f
                      ? 'border-[#1E1022] bg-[#FFBE0B] text-[#1E1022]'
                      : 'border-[#1E1022]/20 bg-white text-[#1E1022] hover:border-[#1E1022]'
                  }`}
                >
                  {f === 'all' ? 'All Decades' : f === '60s' ? '60+' : f}
                </button>
              ))}

            <button
              type="button"
              onClick={() => setExpandedGrid((v) => !v)}
              className="pop-btn rounded-full bg-white px-3.5 py-1 text-xs font-extrabold text-[#1E1022] cursor-pointer"
            >
              {expandedGrid ? 'Compact Strip' : 'Expand All Cards'}
            </button>
          </div>
        </div>

        <div
          className={
            expandedGrid
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch'
              : 'flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x'
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
                  expandedGrid ? 'w-full' : 'w-56 shrink-0 snap-start'
                } group overflow-hidden rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#1E1022] bg-[#FFBE0B] shadow-[4px_4px_0px_#1E1022] -translate-y-0.5'
                    : 'border-[#1E1022] bg-white hover:bg-[#FFF4F7] hover:-translate-y-0.5 shadow-[2px_2px_0px_#1E1022]'
                }`}
              >
                <div className="relative aspect-[4/3.6] w-full overflow-hidden border-b-2 border-[#1E1022] bg-[#1E1022]">
                  <img
                    src={item.photoUrl}
                    alt={`${item.name}, ${item.age}`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-full border-2 border-[#1E1022] bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#1E1022]">
                    {d.height}
                  </span>
                </div>
                <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="font-display text-lg text-[#1E1022]">
                      {item.name}, <span className="text-[#D90452]">{item.age}</span>
                    </div>
                    <div className="text-sm font-bold text-[#1E1022]/85 leading-snug">
                      {item.title}
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-[#3D2A45] leading-snug pt-1">
                    {item.shortHook}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* LIVE MOVING 8-BIT ADVENTURE OVERWORLD (WALK, ADOPT BERNEDOODLE, SOLVE JUKEBOXES & ENTER SCENES!) */}
      {onJumpToMapScene && (
        <EightBitAdventureWorld
          role={role}
          herName={her.name}
          hisName={his.name}
          progress={adventureProgress ?? createDefaultAdventureProgress()}
          onGainXp={(deltaXp, patch, rewardKey) => {
            onGainAdventureXp?.(deltaXp, patch, rewardKey);
          }}
          onEnterEpisode={(epId) => onJumpToMapScene(epId)}
          onOpenFullTrivia={onOpenPopTrivia}
          onOpenFullChecklist={onOpenChecklist}
        />
      )}

      {/* EQUAL-HEIGHT 4-TILE CLUB MODES DOCK */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        <button
          type="button"
          onClick={() => {
            sfx.messagePop();
            onOpenLiveInbox();
          }}
          className="vice-panel rounded-2xl p-4 text-left hover:bg-[#FFF4F7] transition cursor-pointer flex items-center gap-3.5 h-full"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#1E1022] bg-[#FF2E63] text-white">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-extrabold text-[#1E1022]">Live AI Texting Mode</div>
            <div className="text-xs font-semibold text-[#5A4664]">Survive Their Inbox live</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            sfx.messagePop();
            onOpenPopTrivia();
          }}
          className="vice-panel rounded-2xl p-4 text-left hover:bg-[#FFFBEB] transition cursor-pointer flex items-center gap-3.5 h-full"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#1E1022] bg-[#FFBE0B] text-[#1E1022]">
            <Award className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-extrabold text-[#1E1022]">Pop-Culture Quiz (+3 Cr)</div>
            <div className="text-xs font-semibold text-[#5A4664]">Celebrity Cougar &amp; Cub blitz</div>
          </div>
        </button>

        {onOpenChecklist && (
          <button
            type="button"
            onClick={() => {
              sfx.messagePop();
              onOpenChecklist();
            }}
            className="vice-panel rounded-2xl p-4 text-left hover:bg-[#FFF4F7] transition cursor-pointer flex items-center gap-3.5 h-full"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#1E1022] bg-[#FFE3EC] text-[#FF2E63]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-extrabold text-[#1E1022]">25-Pt Viral Score Test</div>
              <div className="text-xs font-semibold text-[#5A4664]">Check your lived score (+2 Cr)</div>
            </div>
          </button>
        )}

        <button
          type="button"
          onClick={onQuickCreateAudition}
          className="vice-panel rounded-2xl p-4 text-left hover:bg-[#FFFBEB] transition cursor-pointer flex items-center gap-3.5 h-full"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#1E1022] bg-[#D1FAE5] text-[#065F46]">
            <Send className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-extrabold text-[#1E1022]">2-Player Audition Link</div>
            <div className="text-xs font-semibold text-[#5A4664]">Text your match (+3 Cr)</div>
          </div>
        </button>
      </section>

      <div className="text-center">
        <button
          type="button"
          onClick={onOpenFieldGuide}
          className="text-sm font-bold text-[#5A4664] hover:text-[#FF2E63] underline cursor-pointer"
        >
          What is a Junior Cougar (6-Yr Gap) vs. Puma vs. Cougar vs. Jaguar? Explore Tier Glossary →
        </button>
      </div>

      {/* MODAL DRAWER: CUSTOMIZE NAMES, DRINKS & TWISTS / VIP SCENES */}
      {activeDrawer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1022]/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="vice-panel max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b-2 border-[#1E1022]/12 pb-4">
              <div>
                <span className="inline-block rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3 py-0.5 text-xs font-extrabold uppercase text-[#1E1022]">
                  {activeDrawer === 'custom' ? 'Custom Fantasy Studio' : 'Deep-Cut Episodes'}
                </span>
                <h3 className="mt-1.5 font-display text-2xl text-[#1E1022]">
                  {activeDrawer === 'custom'
                    ? 'Customize Names, Zero-Proof Orders & Plot Twists'
                    : 'Select Bonus VIP Scenes'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrawer(null)}
                className="pop-btn rounded-xl bg-[#FFF4F7] p-2 text-[#1E1022] hover:bg-[#FF2E63] hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {activeDrawer === 'custom' && onUpdateHerCustom && onUpdateHisCustom && (
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-[#1E1022] bg-[#FFFBEB] px-3.5 py-2 text-xs font-extrabold text-[#1E1022]">
                  {wallet.isVip || wallet.isFounderUnlimited
                    ? '👑 VIP Active: Unlimited Custom Builds'
                    : customEditCount >= 2
                      ? '✨ Multi-Twist Build Active (1 Credit on Launch • Unlimited w/ VIP)'
                      : '🎁 1st Custom Twist & All Zero-Proof Drink Presets are FREE'}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-xs font-bold text-[#1E1022]">
                    <span>Her Custom Name</span>
                    <input
                      type="text"
                      maxLength={24}
                      value={her.name}
                      onChange={(e) => onUpdateHerCustom({ ...her, name: e.target.value || 'Claire' })}
                      className="w-full rounded-xl border-2 border-[#1E1022] bg-[#FFF7F0] px-3 py-2 text-sm font-bold text-[#1E1022]"
                    />
                  </label>
                  <label className="space-y-1 text-xs font-bold text-[#1E1022]">
                    <span>Cub Custom Name</span>
                    <input
                      type="text"
                      maxLength={24}
                      value={his.name}
                      onChange={(e) => onUpdateHisCustom({ ...his, name: e.target.value || 'Leo' })}
                      className="w-full rounded-xl border-2 border-[#1E1022] bg-[#FFF7F0] px-3 py-2 text-sm font-bold text-[#1E1022]"
                    />
                  </label>
                  <label className="space-y-1 text-xs font-bold text-[#1E1022]">
                    <span>Her Star Sign</span>
                    <input
                      type="text"
                      maxLength={36}
                      value={herDetails.zodiac}
                      onChange={(e) => onUpdateHerCustom({ ...her, zodiac: e.target.value })}
                      className="w-full rounded-xl border-2 border-[#1E1022] bg-[#FFF7F0] px-3 py-2 text-sm font-bold text-[#1E1022]"
                    />
                  </label>
                  <label className="space-y-1 text-xs font-bold text-[#1E1022]">
                    <span>Signature Order</span>
                    <input
                      type="text"
                      maxLength={44}
                      value={herDetails.signatureDrink}
                      onChange={(e) => onUpdateHerCustom({ ...her, signatureDrink: e.target.value })}
                      className="w-full rounded-xl border-2 border-[#1E1022] bg-[#FFF7F0] px-3 py-2 text-sm font-bold text-[#1E1022]"
                    />
                  </label>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-extrabold text-[#1E1022]">
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
                          className={`rounded-full border-2 px-3 py-1 text-xs font-bold transition cursor-pointer ${
                            active
                              ? 'border-[#1E1022] bg-[#FFBE0B] text-[#1E1022]'
                              : 'border-[#1E1022]/20 bg-white text-[#1E1022] hover:border-[#1E1022]'
                          }`}
                        >
                          {String(drinkLabel)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-extrabold text-[#1E1022]">Plot-Twist Stickers:</div>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ['seed_oil_bernedoodle_mommy', 'her', '🥑🐶 Gluten/Seed-Oil-Free + Mini Bernedoodle'],
                        ['qigong_mommy_domme', 'her', '🧘‍♀️ Qigong & Tai Chi Mommy-Domme'],
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
                          className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                            active
                              ? 'border-[#1E1022] bg-[#FF2E63] text-white'
                              : 'border-[#1E1022]/20 bg-white text-[#1E1022] hover:border-[#1E1022]'
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
                  <div className="flex items-center justify-between gap-2 rounded-2xl border-2 border-[#1E1022] bg-[#FFF4F7] p-3.5 text-xs font-bold text-[#1E1022]">
                    <span>
                      Unlock Unlimited Custom Builds ($6.99 VIP) or sponsor a custom character ($29)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDrawer(null);
                        onOpenBoutique();
                      }}
                      className="pop-btn shrink-0 rounded-xl bg-[#FFBE0B] px-3 py-1.5 font-extrabold text-[#1E1022] cursor-pointer"
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
                      className={`flex items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left transition cursor-pointer ${
                        active
                          ? 'border-[#1E1022] bg-[#FFFBEB]'
                          : 'border-[#1E1022]/20 bg-white hover:border-[#1E1022]'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-extrabold text-[#1E1022]">{ep.title}</div>
                        <div className="text-xs font-medium text-[#5A4664] mt-0.5">
                          {ep.loreQuote}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 rounded-xl border-2 border-[#1E1022] px-3 py-1.5 text-xs font-extrabold ${
                          unlocked
                            ? active
                              ? 'bg-[#D1FAE5] text-[#065F46]'
                              : 'bg-white text-[#1E1022]'
                            : 'bg-[#FFBE0B] text-[#1E1022]'
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
                className="pop-btn rounded-xl bg-[#FF2E63] px-6 py-2.5 text-sm font-extrabold text-white cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Launch Bar */}
      <div className="sm:hidden sticky bottom-2 z-20 rounded-2xl border-2 border-[#1E1022] bg-white p-3 shadow-[4px_4px_0px_#1E1022] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-display text-base text-[#1E1022]">
            {her.name} ({her.age}F) × {his.name} ({his.age}M)
          </div>
          <div className="truncate text-xs font-bold text-[#D90452]">
            {pacingMode === 'curated' ? '⚡ 8-Scene Arc' : '🎬 Full Season'} • {pairing.ageGap}yr Gap
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            sfx.swipeRight();
            onStartGame();
          }}
          className="pop-btn shrink-0 rounded-xl bg-[#FF2E63] px-4 py-2.5 text-sm font-extrabold text-white"
        >
          Play Run →
        </button>
      </div>
    </div>
  );
};
