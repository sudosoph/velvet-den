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
import { POP_CULTURE_TRIVIA } from '../data/popCultureTrivia';
import type { WalletState } from '../domain/economy';
import type { RunPacingMode } from '../domain/gameEngine';
import {
  createDefaultAdventureProgress,
  type AdventureProgressState,
} from '../domain/progression';
import {
  COUGAR_CUB_CHECKLIST_ITEMS,
  loadChecklistCheckedIds,
  toggleChecklistItemInStorage,
} from './CougarCubChecklistModal';
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

  // Above-the-Fold Live Pop-Culture Blitz & 25-Point Viral IRL Check (Starts on index 1 — zero modal collision)
  const [blitzIdx, setBlitzIdx] = useState(1);
  const [blitzPicked, setBlitzPicked] = useState<number | null>(null);
  const [viralIdx, setViralIdx] = useState(11);
  const [viralChecked, setViralChecked] = useState<string[]>(() => loadChecklistCheckedIds());

  const currentBlitz = POP_CULTURE_TRIVIA[blitzIdx % POP_CULTURE_TRIVIA.length];
  const currentViral = COUGAR_CUB_CHECKLIST_ITEMS[viralIdx % COUGAR_CUB_CHECKLIST_ITEMS.length];
  const isCurrentViralStamped = viralChecked.includes(currentViral.id);

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
    <div className="w-full space-y-5 animate-stage-in">
      {noticeBanner && (
        <div className="vice-panel rounded-2xl bg-[#FFBE0B] px-5 py-3 text-sm font-bold text-[#1E1022]">
          {noticeBanner}
        </div>
      )}

      {/* BAND 1: ZYNGA COMMAND HERO + UNIFORM 4-BUTTON ARCADE MODE LAUNCHER */}
      <section className="vice-panel rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#FFFDF9] via-[#FFF4F7] to-[#FFFBEB] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex h-7 items-center gap-1.5 rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3 text-xs font-bold uppercase tracking-wide text-[#1E1022]">
              <Flame className="h-3.5 w-3.5 text-[#FF2E63]" />
              <span>Interactive Age-Gap Romance &amp; 8-Bit Arcade</span>
            </div>

            <h1 className="font-display text-2xl sm:text-[32px] text-[#1E1022]">
              Lower Your Age Slider. Vet the Red Flags.{' '}
              <span className="text-[#FF2E63]">Win Real Love.</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 lg:w-[440px]">
            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                onChangeRole('her');
              }}
              className={`pop-btn h-14 rounded-2xl px-4 flex flex-col justify-center text-left cursor-pointer ${
                role === 'her'
                  ? 'bg-[#FF2E63] text-white'
                  : 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]'
              }`}
            >
              <div className="text-sm leading-tight">🐆 Play as Her</div>
              <div
                className={`font-sans text-xs font-semibold leading-tight mt-0.5 ${
                  role === 'her' ? 'text-white/90' : 'text-[#5A4664]'
                }`}
              >
                Vet &amp; Train • Catch Red Flags
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                onChangeRole('him');
              }}
              className={`pop-btn h-14 rounded-2xl px-4 flex flex-col justify-center text-left cursor-pointer ${
                role === 'him'
                  ? 'bg-[#FFBE0B] text-[#1E1022]'
                  : 'bg-white text-[#1E1022] hover:bg-[#FFFBEB]'
              }`}
            >
              <div className="text-sm leading-tight">🥂 Play as Him</div>
              <div className="font-sans text-xs font-semibold leading-tight mt-0.5 text-[#5A4664]">
                Impress &amp; Commit • Code-Switch
              </div>
            </button>
          </div>
        </div>

        {/* Strictly Symmetrical 4-Column Equal-Height (48px) Arcade Launcher Bar */}
        <div className="pt-3.5 border-t-2 border-[#1E1022]/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => {
              sfx.messagePop();
              onOpenPopTrivia();
            }}
            className="pop-btn h-12 w-full rounded-2xl bg-[#FFBE0B] hover:bg-[#FFD166] px-3.5 inline-flex items-center justify-center gap-2 text-sm text-[#1E1022] cursor-pointer"
          >
            <Award className="h-4 w-4 shrink-0" />
            <span>Pop-Culture Quiz (+3 Cr)</span>
          </button>

          {onOpenChecklist && (
            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                onOpenChecklist();
              }}
              className="pop-btn h-12 w-full rounded-2xl bg-[#FFF4F7] hover:bg-[#FFE4EC] px-3.5 inline-flex items-center justify-center gap-2 text-sm text-[#D90452] cursor-pointer"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-[#FF2E63]" />
              <span>25-Pt Viral Score Test</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              sfx.messagePop();
              onOpenLiveInbox();
            }}
            className="pop-btn h-12 w-full rounded-2xl bg-white hover:bg-[#FFF4F7] px-3.5 inline-flex items-center justify-center gap-2 text-sm text-[#1E1022] cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 shrink-0 text-[#FF2E63]" />
            <span>Live AI Texting Mode</span>
          </button>

          <button
            type="button"
            onClick={onQuickCreateAudition}
            className="pop-btn h-12 w-full rounded-2xl bg-[#ECFDF5] hover:bg-[#D1FAE5] px-3.5 inline-flex items-center justify-center gap-2 text-sm text-[#065F46] cursor-pointer"
          >
            <Send className="h-4 w-4 shrink-0" />
            <span>2-Player Audition (+3 Cr)</span>
          </button>
        </div>
      </section>

      {/* BAND 2: ABOVE-THE-FOLD PLAYABLE POP-CULTURE BLITZ & VIRAL IRL CHECK */}
      <section className="grid gap-4 lg:grid-cols-12 items-stretch">
        {/* Left (7 cols): Live Playable Pop-Culture Card */}
        <div className="lg:col-span-7 vice-panel rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#FFFDF9] to-[#FFFBEB] flex flex-col justify-between gap-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex h-8 items-center gap-1.5 rounded-xl border-2 border-[#1E1022] bg-[#FFBE0B] px-3 text-xs font-bold text-[#1E1022]">
                🎬 Live Pop-Culture Blitz • {currentBlitz.badge}
              </span>
              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  setBlitzPicked(null);
                  setBlitzIdx((idx) => (idx + 1) % POP_CULTURE_TRIVIA.length);
                }}
                className="pop-btn h-8 shrink-0 rounded-xl bg-white px-3 text-xs text-[#1E1022] cursor-pointer"
              >
                Next Card →
              </button>
            </div>

            <p className="font-display text-base sm:text-lg text-[#1E1022] leading-snug">
              {currentBlitz.question}
            </p>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentBlitz.options.map((opt, idx) => {
                const isCorrect = idx === currentBlitz.correctIndex;
                let btnColor = 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]';
                if (blitzPicked !== null) {
                  if (isCorrect) btnColor = 'bg-[#D1FAE5] text-[#065F46]';
                  else if (blitzPicked === idx) btnColor = 'bg-[#FFE4E6] text-[#9F1239]';
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      if (blitzPicked !== null) return;
                      setBlitzPicked(idx);
                      if (idx === currentBlitz.correctIndex) {
                        sfx.levelUp8Bit();
                        onGainAdventureXp?.(15);
                      } else {
                        sfx.redFlag();
                        onGainAdventureXp?.(5);
                      }
                    }}
                    className={`pop-btn min-h-[44px] w-full rounded-xl px-3 py-2 text-left text-xs sm:text-sm leading-snug flex items-center justify-between gap-2 cursor-pointer ${btnColor}`}
                  >
                    <span className="line-clamp-2">{opt}</span>
                    {blitzPicked !== null && isCorrect && (
                      <span className="shrink-0 font-pixel text-[10px]">+15XP</span>
                    )}
                  </button>
                );
              })}
            </div>

            {blitzPicked !== null && (
              <div className="rounded-xl border-2 border-[#1E1022] bg-white px-3 py-2 text-xs font-semibold text-[#1E1022]">
                ✨ {currentBlitz.funFact}
              </div>
            )}
          </div>
        </div>

        {/* Right (5 cols): Live 25-Point Viral IRL Check */}
        <div className="lg:col-span-5 vice-panel rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#FFFDF9] to-[#FFF4F7] flex flex-col justify-between gap-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex h-8 items-center gap-1.5 rounded-xl border-2 border-[#1E1022] bg-[#FF2E63] px-3 text-xs font-bold text-white">
                🔥 Viral IRL Check ({viralChecked.length}/25)
              </span>
              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  setViralIdx((idx) => (idx + 1) % COUGAR_CUB_CHECKLIST_ITEMS.length);
                }}
                className="pop-btn h-8 shrink-0 rounded-xl bg-white px-3 text-xs text-[#1E1022] cursor-pointer"
              >
                Next Dare →
              </button>
            </div>

            <p className="font-display text-base sm:text-lg text-[#1E1022] leading-snug">
              &ldquo;{currentViral.text}&rdquo;
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#5A4664]">
                <span>Club Viral Score: {viralChecked.length * 4} pts</span>
                <button
                  type="button"
                  onClick={() => onJumpToMapScene?.(currentViral.episodeId)}
                  className="text-[#D90452] hover:underline font-bold cursor-pointer"
                >
                  Play Scene →
                </button>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full border-2 border-[#1E1022] bg-white">
                <div
                  className="h-full bg-gradient-to-r from-[#FF2E63] to-[#FFBE0B] transition-all duration-300"
                  style={{ width: `${Math.max(8, viralChecked.length * 4)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  sfx.pixelCoin();
                  if (!isCurrentViralStamped) {
                    const updated = toggleChecklistItemInStorage(currentViral.id);
                    setViralChecked(updated);
                    onGainAdventureXp?.(15);
                  }
                  setViralIdx((idx) => (idx + 1) % COUGAR_CUB_CHECKLIST_ITEMS.length);
                }}
                className="pop-btn h-11 w-full rounded-xl bg-[#FF2E63] hover:bg-[#E01E50] px-3 text-xs sm:text-sm text-white inline-flex items-center justify-center cursor-pointer"
              >
                🙋‍♀️ Lived This! (+15 XP)
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  onGainAdventureXp?.(10);
                  setViralIdx((idx) => (idx + 1) % COUGAR_CUB_CHECKLIST_ITEMS.length);
                }}
                className="pop-btn h-11 w-full rounded-xl bg-white hover:bg-[#FFFBEB] px-3 text-xs sm:text-sm text-[#1E1022] inline-flex items-center justify-center cursor-pointer"
              >
                🛡️ Dodged! → Next
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Pair Switcher */}
      <div className="grid grid-cols-2 gap-1.5 lg:hidden rounded-2xl border-2 border-[#1E1022] bg-white p-1 text-sm font-bold shadow-[3px_3px_0px_#1E1022]">
        <button
          type="button"
          onClick={() => setMobilePairSlot('her')}
          className={`h-10 rounded-xl transition cursor-pointer ${
            mobilePairSlot === 'her' ? 'bg-[#FF2E63] text-white' : 'text-[#1E1022]'
          }`}
        >
          Her: {her.name}, {her.age}F
        </button>
        <button
          type="button"
          onClick={() => setMobilePairSlot('him')}
          className={`h-10 rounded-xl transition cursor-pointer ${
            mobilePairSlot === 'him' ? 'bg-[#FFBE0B] text-[#1E1022]' : 'text-[#1E1022]'
          }`}
        >
          Cub: {his.name}, {his.age}M
        </button>
      </div>

      {/* BAND 3: TIGHT, SYMMETRICAL 3-COLUMN MATCHMAKER STAGE */}
      <section className="grid gap-4 lg:grid-cols-[1fr_310px_1fr] items-stretch">
        {/* LEFT SPOTLIGHT: HER */}
        <div
          className={`${
            mobilePairSlot === 'him' ? 'hidden lg:flex' : 'flex'
          } vice-panel rounded-3xl p-4 sm:p-5 flex-col justify-between gap-3.5 h-full`}
        >
          <div className="space-y-3">
            <div className="relative h-56 sm:h-60 w-full overflow-hidden rounded-2xl border-2 border-[#1E1022] bg-[#1E1022]">
              <img
                key={her.photoUrl}
                src={her.photoUrl}
                alt={`${her.name}, ${her.age}`}
                className="h-full w-full object-cover object-top animate-stage-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1022]/70 via-transparent to-transparent" />

              <button
                type="button"
                aria-label="Previous Her character"
                onClick={() => cycleHer(-1)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center rounded-full border-2 border-[#1E1022] bg-white text-[#1E1022] shadow hover:bg-[#FFBE0B] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next Her character"
                onClick={() => cycleHer(1)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center rounded-full border-2 border-[#1E1022] bg-white text-[#1E1022] shadow hover:bg-[#FFBE0B] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <span className="absolute top-2.5 left-2.5 rounded-full border-2 border-[#1E1022] bg-white px-3 py-0.5 text-xs font-bold text-[#1E1022] shadow">
                📏 {herDetails.height} • {herDetails.zodiac.split('•')[0].replace(' Sun', '').trim()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="font-display text-xl sm:text-2xl text-[#1E1022] truncate">
                  {her.name}, <span className="text-[#FF2E63]">{her.age}F</span>
                </h2>
                <div className="text-sm font-bold text-[#D90452] truncate">{her.title}</div>
              </div>

              <div className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#1E1022] bg-[#FFF4F7] px-2 text-sm font-bold text-[#1E1022]">
                <button
                  type="button"
                  onClick={() => onAdjustHerAge(-1)}
                  aria-label="Decrease Her Age"
                  className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-[#1E1022] bg-white hover:bg-[#FFBE0B] cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center">{her.age}</span>
                <button
                  type="button"
                  onClick={() => onAdjustHerAge(1)}
                  aria-label="Increase Her Age"
                  className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-[#1E1022] bg-white hover:bg-[#FFBE0B] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-sm sm:text-[15px] font-medium text-[#3D2A45] leading-snug line-clamp-3">
              {her.tagline}
            </p>
          </div>

          <div className="rounded-xl border-2 border-[#1E1022] bg-[#FFF4F7] px-3.5 py-2.5 space-y-0.5 text-xs sm:text-sm font-bold text-[#1E1022]">
            <div className="truncate">🍸 {herDetails.signatureDrink}</div>
            <div className="text-[#D90452] truncate">💞 {herDetails.loveLanguage}</div>
          </div>
        </div>

        {/* CENTER ARCADE POD: CHEMISTRY + SYMMETRICAL CONTROLS */}
        <div className="vice-panel rounded-3xl p-4 sm:p-5 flex flex-col justify-between gap-3.5 text-center bg-gradient-to-b from-[#FFFDF9] to-[#FFF4F7] h-full">
          <div className="space-y-2">
            <span className="inline-flex h-7 items-center rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3 text-xs font-bold uppercase tracking-wide text-[#1E1022]">
              {pairing.badgeLabel}
            </span>

            <div className="font-display text-2xl text-[#1E1022]">
              {her.name} × {his.name}
            </div>

            <p className="text-xs sm:text-sm font-medium text-[#5A4664] leading-snug line-clamp-2">
              {pairing.zodiacSpark}
            </p>

            {pairing.energyPolarity && (
              <div className="rounded-xl border-2 border-[#1E1022] bg-white px-3 py-1.5 text-xs font-bold text-[#D90452]">
                {pairing.energyPolarity}
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            {onChangePacingMode && (
              <div className="grid grid-cols-2 gap-1 rounded-xl border-2 border-[#1E1022] bg-white p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => onChangePacingMode('curated')}
                  className={`h-9 rounded-lg transition cursor-pointer ${
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
                  className={`h-9 rounded-lg transition cursor-pointer ${
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
              className="pop-btn w-full h-12 rounded-2xl bg-[#FF2E63] hover:bg-[#E01E50] text-lg text-white inline-flex items-center justify-center cursor-pointer"
            >
              Start Vetting →
            </button>

            <button
              type="button"
              onClick={handleSlotMachineShuffle}
              className="pop-btn w-full h-11 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFBE0B] hover:bg-[#FFD166] text-sm text-[#1E1022] cursor-pointer"
            >
              <Dices className={`h-4 w-4 ${shuffling ? 'animate-spin' : ''}`} />
              <span>{shuffling ? 'Spinning Chemistry…' : 'Shuffle Spicy Matchup'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t-2 border-[#1E1022]/10">
            <button
              type="button"
              onClick={() => setActiveDrawer('custom')}
              className="pop-btn h-10 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-2.5 text-xs text-[#1E1022] hover:bg-[#FFF4F7] cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5 text-[#FF2E63]" />
              <span>Twists</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDrawer('vip')}
              className="pop-btn h-10 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-2.5 text-xs text-[#1E1022] hover:bg-[#FFFBEB] cursor-pointer"
            >
              <Crown className="h-3.5 w-3.5 text-[#FFBE0B]" />
              <span>VIP ({selectedVipIds.length}/4)</span>
            </button>
          </div>
        </div>

        {/* RIGHT SPOTLIGHT: HIM (CUB) */}
        <div
          className={`${
            mobilePairSlot === 'her' ? 'hidden lg:flex' : 'flex'
          } vice-panel rounded-3xl p-4 sm:p-5 flex-col justify-between gap-3.5 h-full`}
        >
          <div className="space-y-3">
            <div className="relative h-56 sm:h-60 w-full overflow-hidden rounded-2xl border-2 border-[#1E1022] bg-[#1E1022]">
              <img
                key={his.photoUrl}
                src={his.photoUrl}
                alt={`${his.name}, ${his.age}`}
                className="h-full w-full object-cover object-top animate-stage-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1022]/70 via-transparent to-transparent" />

              <button
                type="button"
                aria-label="Previous Cub character"
                onClick={() => cycleHis(-1)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center rounded-full border-2 border-[#1E1022] bg-white text-[#1E1022] shadow hover:bg-[#FFBE0B] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next Cub character"
                onClick={() => cycleHis(1)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center rounded-full border-2 border-[#1E1022] bg-white text-[#1E1022] shadow hover:bg-[#FFBE0B] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <span className="absolute top-2.5 left-2.5 rounded-full border-2 border-[#1E1022] bg-white px-3 py-0.5 text-xs font-bold text-[#1E1022] shadow">
                📏 {hisDetails.height} • {hisDetails.zodiac.split('•')[0].replace(' Sun', '').trim()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="font-display text-xl sm:text-2xl text-[#1E1022] truncate">
                  {his.name}, <span className="text-[#D97706]">{his.age}M</span>
                </h2>
                <div className="text-sm font-bold text-[#B45309] truncate">{his.title}</div>
              </div>

              <div className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#1E1022] bg-[#FFFBEB] px-2 text-sm font-bold text-[#1E1022]">
                <button
                  type="button"
                  onClick={() => onAdjustHisAge(-1)}
                  aria-label="Decrease His Age"
                  className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-[#1E1022] bg-white hover:bg-[#FFBE0B] cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center">{his.age}</span>
                <button
                  type="button"
                  onClick={() => onAdjustHisAge(1)}
                  aria-label="Increase His Age"
                  className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-[#1E1022] bg-white hover:bg-[#FFBE0B] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-sm sm:text-[15px] font-medium text-[#3D2A45] leading-snug line-clamp-3">
              {his.tagline}
            </p>
          </div>

          <div className="rounded-xl border-2 border-[#1E1022] bg-[#FFFBEB] px-3.5 py-2.5 space-y-0.5 text-xs sm:text-sm font-bold text-[#1E1022]">
            <div className="truncate">🥂 {hisDetails.signatureDrink}</div>
            <div className="text-[#B45309] truncate">💞 {hisDetails.loveLanguage}</div>
          </div>
        </div>
      </section>

      {/* BAND 4: PROMOTED LIVE 60FPS 8-BIT ADVENTURE OVERWORLD */}
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

      {/* BAND 5: ALIGNED CAST ROSTER CARD (Uniform 40px Button Toolbar!) */}
      <section className="vice-panel rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCastTab('her')}
              className={`pop-btn h-10 rounded-xl px-4 text-xs sm:text-sm inline-flex items-center justify-center cursor-pointer ${
                castTab === 'her'
                  ? 'bg-[#FF2E63] text-white'
                  : 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]'
              }`}
            >
              🐆 Her Roster ({HER_ARCHETYPES.length} • Ages 30–64)
            </button>
            <button
              type="button"
              onClick={() => setCastTab('him')}
              className={`pop-btn h-10 rounded-xl px-4 text-xs sm:text-sm inline-flex items-center justify-center cursor-pointer ${
                castTab === 'him'
                  ? 'bg-[#FFBE0B] text-[#1E1022]'
                  : 'bg-white text-[#1E1022] hover:bg-[#FFFBEB]'
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
                  className={`pop-btn h-10 rounded-xl px-3.5 text-xs inline-flex items-center justify-center cursor-pointer ${
                    herFilter === f
                      ? 'bg-[#FFBE0B] text-[#1E1022]'
                      : 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]'
                  }`}
                >
                  {f === 'all' ? 'All Decades' : f === '60s' ? '60+' : f}
                </button>
              ))}

            <button
              type="button"
              onClick={() => setExpandedGrid((v) => !v)}
              className="pop-btn h-10 rounded-xl bg-[#FFF7F0] px-3.5 text-xs text-[#1E1022] inline-flex items-center justify-center cursor-pointer"
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
                  <span className="absolute top-2.5 left-2.5 rounded-full border-2 border-[#1E1022] bg-white px-2.5 py-0.5 text-xs font-bold text-[#1E1022]">
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
