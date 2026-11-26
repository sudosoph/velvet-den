import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Crown,
  Dices,
  Flame,
  Gamepad2,
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
import { createRun, type RunPacingMode } from '../domain/gameEngine';
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
  onOpenWorldTab?: () => void;
  onOpenCubAcademy?: (subTab?: 'obedience' | 'scanner' | 'dateodex') => void;
  onOpenCourtroom?: () => void;
  dateodexStampedCount?: number;
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
  onOpenWorldTab,
  onOpenCubAcademy,
  onOpenCourtroom,
  dateodexStampedCount = 0,
  onJumpToMapScene,
  adventureProgress,
  onGainAdventureXp,
}) => {
  const [castTab, setCastTab] = useState<'her' | 'him'>('her');
  const [herFilter, setHerFilter] = useState<HerDecadeFilter>('all');
  const [expandedGrid, setExpandedGrid] = useState(true);
  const [inspectedProfile, setInspectedProfile] = useState<HerArchetype | HisArchetype | null>(null);
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

  const queuedEpisodes = useMemo(
    () => createRun(pairing, selectedVipIds, undefined, pacingMode).episodeQueue,
    [pairing, selectedVipIds, pacingMode],
  );

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

      {/* =====================================================================
       * BAND 1: CLEAN CLUB HUB — 2-LINE ROLE TOGGLES + CLEAR 4-PATH DIRECTORY
       * ===================================================================== */}
      <section className="vice-panel rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-white via-[#FFF7F9] to-[#FFFDF5] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#FD267A]/25 bg-[#FFF0F5] px-3 text-xs font-extrabold uppercase tracking-wider text-[#E11D48]">
              <Flame className="h-3.5 w-3.5 fill-[#FD267A] text-[#FD267A]" />
              <span>
                {HER_ARCHETYPES.length + HIS_ARCHETYPES.length} Roster Profiles • 8-Scene Dates • 6 Map Hotspots
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-[32px] text-[#18101E] leading-tight">
              Draft Your Roster. Swipe, Text &amp;{' '}
              <span className="text-[#E11D48]">Spark Real Chemistry.</span>
            </h1>

            <p className="text-xs sm:text-sm font-medium text-[#475569] leading-relaxed">
              Choose your perspective on the right, then pick any of the 4 ways to play below—or draft your pair right underneath.
            </p>
          </div>

          {/* Symmetrical Role Buttons with Clean 2-Line Aligned Subtitles (Zero Cutoff!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 lg:w-[500px] items-stretch">
            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                onChangeRole('her');
              }}
              className={`pop-btn min-h-[84px] rounded-2xl px-4 py-3 flex flex-col justify-between text-left cursor-pointer ${
                role === 'her'
                  ? 'bg-gradient-to-r from-[#E11D48] to-[#FF2E63] text-white border-transparent shadow-sm'
                  : 'bg-white text-[#18101E] hover:bg-[#FFF5F7]'
              }`}
            >
              <div className="text-sm sm:text-[15px] font-extrabold leading-snug">
                🐆 Play as Her
              </div>
              <div
                className={`font-sans text-xs font-semibold leading-snug mt-1 space-y-0.5 ${
                  role === 'her' ? 'text-white/95' : 'text-[#475569]'
                }`}
              >
                <div>Vet &amp; Train Your Cub</div>
                <div className={role === 'her' ? 'text-white/80' : 'text-[#64748B]'}>
                  Catch Red Flags &amp; Set the Pace
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                onChangeRole('him');
              }}
              className={`pop-btn min-h-[84px] rounded-2xl px-4 py-3 flex flex-col justify-between text-left cursor-pointer ${
                role === 'him'
                  ? 'bg-[#F59E0B] text-[#18101E] border-transparent shadow-sm'
                  : 'bg-white text-[#18101E] hover:bg-[#FFFBEB]'
              }`}
            >
              <div className="text-sm sm:text-[15px] font-extrabold leading-snug">
                🥂 Play as Him
              </div>
              <div
                className={`font-sans text-xs font-semibold leading-snug mt-1 space-y-0.5 ${
                  role === 'him' ? 'text-[#18101E]/95' : 'text-[#475569]'
                }`}
              >
                <div>Impress &amp; Commit</div>
                <div className={role === 'him' ? 'text-[#18101E]/80' : 'text-[#64748B]'}>
                  Code-Switch &amp; Plan Real Dates
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Clear 6-Path Mode Directory — Every Path Has Clean 2-Line Copy & Non-Wrapping Badges */}
        <div className="pt-4 border-t border-[#18101E]/8 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
            <span>Choose a Game Mode (or Draft Your Pair Below to Start Your 8-Scene Date)</span>
            <div className="flex flex-wrap items-center gap-4">
              {onOpenCubAcademy && (
                <button
                  type="button"
                  onClick={() => onOpenCubAcademy('dateodex')}
                  className="inline-flex items-center gap-1.5 text-[#7C3AED] hover:underline cursor-pointer normal-case font-bold text-xs"
                >
                  <span>
                    📸 Club Dateodex &amp; Polaroids ({dateodexStampedCount}/
                    {HER_ARCHETYPES.length + HIS_ARCHETYPES.length})
                  </span>
                </button>
              )}
              {onOpenBoutique && (
                <button
                  type="button"
                  onClick={onOpenBoutique}
                  className="inline-flex items-center gap-1.5 text-[#E11D48] hover:underline cursor-pointer normal-case font-bold text-xs"
                >
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                  <span>🗝️ Raya-Style Virtual Club Waitlist (+3 Cr)</span>
                </button>
              )}
              <button
                type="button"
                onClick={onQuickCreateAudition}
                className="inline-flex items-center gap-1.5 text-[#059669] hover:underline cursor-pointer normal-case font-bold text-xs"
              >
                <Send className="h-3.5 w-3.5 shrink-0" />
                <span>Text 2-Player Audition via iMessage / DM (+3 Cr)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
            <button
              type="button"
              aria-label="Live AI Texting Mode — Chat in Tinder, iMessage or Discord"
              onClick={() => {
                sfx.messagePop();
                onOpenLiveInbox();
              }}
              className="pop-btn min-h-[76px] w-full rounded-2xl bg-gradient-to-r from-[#FD267A] to-[#FF6036] hover:opacity-95 p-3.5 flex flex-col justify-between text-left text-white border-transparent cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold">
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>Live AI Texting</span>
                </span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold whitespace-nowrap">
                  3 Free DMs
                </span>
              </div>
              <div className="text-[11.5px] font-medium text-white/90 leading-snug mt-1">
                Ongoing 4-stage chat in real Tinder, Apple iMessage &amp; Discord
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                if (onOpenCubAcademy) onOpenCubAcademy('obedience');
              }}
              className="pop-btn min-h-[76px] w-full rounded-2xl bg-[#F5F3FF] hover:bg-[#EDE9FE] p-3.5 flex flex-col justify-between text-left text-[#5B21B6] cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold">
                  <Sparkles className="h-4 w-4 shrink-0 text-[#7C3AED]" />
                  <span>2D Cub Training Sim</span>
                </span>
                <span className="rounded-full bg-[#DDD6FE] px-2 py-0.5 text-[10px] font-extrabold text-[#5B21B6] whitespace-nowrap">
                  PixiJS • +3 Cr
                </span>
              </div>
              <div className="text-[11.5px] font-medium text-[#6D28D9] leading-snug mt-1">
                Clicker-train your Cub, tug the short leash &amp; scan his apartment
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                if (onOpenCourtroom) onOpenCourtroom();
              }}
              className="pop-btn min-h-[76px] w-full rounded-2xl bg-[#18101E] hover:bg-[#2A1B35] p-3.5 flex flex-col justify-between text-left text-white border-transparent cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold">
                  <Crown className="h-4 w-4 shrink-0 text-[#FBBF24]" />
                  <span>Crown Him or Dump Him</span>
                </span>
                <span className="rounded-full bg-[#FBBF24] px-2 py-0.5 text-[10px] font-extrabold text-[#18101E] whitespace-nowrap">
                  Daily +2 Cr
                </span>
              </div>
              <div className="text-[11.5px] font-medium text-white/85 leading-snug mt-1">
                Vote on real date stories, Cougar vs. Cub splits &amp; pitch episodes
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.messagePop();
                if (onOpenWorldTab) onOpenWorldTab();
              }}
              className="pop-btn min-h-[76px] w-full rounded-2xl bg-[#ECFDF5] hover:bg-[#D1FAE5] p-3.5 flex flex-col justify-between text-left text-[#065F46] cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold">
                  <Gamepad2 className="h-4 w-4 shrink-0 text-[#059669]" />
                  <span>8-Bit Club Map</span>
                </span>
                <span className="rounded-full bg-[#A7F3D0] px-2 py-0.5 text-[10px] font-extrabold text-[#065F46] whitespace-nowrap">
                  6 Hotspots
                </span>
              </div>
              <div className="text-[11.5px] font-medium text-[#047857] leading-snug mt-1">
                Walk the pixel lounge, adopt Miso &amp; enter 6 arcade venues
              </div>
            </button>

            <button
              type="button"
              aria-label="Pop-Culture Quiz (+3 Cr)"
              onClick={() => {
                sfx.messagePop();
                onOpenPopTrivia();
              }}
              className="pop-btn min-h-[76px] w-full rounded-2xl bg-[#FFFBEB] hover:bg-[#FEF3C7] p-3.5 flex flex-col justify-between text-left text-[#92400E] cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold">
                  <Award className="h-4 w-4 shrink-0 text-[#D97706]" />
                  <span>Pop-Culture Quiz</span>
                </span>
                <span className="rounded-full bg-[#FDE68A] px-2 py-0.5 text-[10px] font-extrabold text-[#78350F] whitespace-nowrap">
                  +3 Cr
                </span>
              </div>
              <div className="text-[11.5px] font-medium text-[#B45309] leading-snug mt-1">
                Babygirl, Cougar Town &amp; iconic celebrity Cougar × Cub trivia
              </div>
            </button>

            {onOpenChecklist && (
              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  onOpenChecklist();
                }}
                className="pop-btn min-h-[76px] w-full rounded-2xl bg-[#FFF1F2] hover:bg-[#FFE4E6] p-3.5 flex flex-col justify-between text-left text-[#BE123C] cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold">
                    <Sparkles className="h-4 w-4 shrink-0 text-[#E11D48]" />
                    <span>25-Pt Viral Test</span>
                  </span>
                  <span className="rounded-full bg-[#FECDD3] px-2 py-0.5 text-[10px] font-extrabold text-[#9F1239] whitespace-nowrap">
                    +2 Cr
                  </span>
                </div>
                <div className="text-[11.5px] font-medium text-[#9F1239] leading-snug mt-1">
                  Stamp lived age-gap moments &amp; share your viral score card
                </div>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Pair Switcher */}
      <div className="grid grid-cols-2 gap-1.5 lg:hidden rounded-2xl border border-[#18101E]/12 bg-white p-1 text-sm font-bold shadow-xs">
        <button
          type="button"
          onClick={() => setMobilePairSlot('her')}
          className={`h-10 rounded-xl transition cursor-pointer ${
            mobilePairSlot === 'her' ? 'bg-[#E11D48] text-white' : 'text-[#18101E]'
          }`}
        >
          Her: {her.name}, {her.age}F
        </button>
        <button
          type="button"
          onClick={() => setMobilePairSlot('him')}
          className={`h-10 rounded-xl transition cursor-pointer ${
            mobilePairSlot === 'him' ? 'bg-[#F59E0B] text-[#18101E]' : 'text-[#18101E]'
          }`}
        >
          Cub: {his.name}, {his.age}M
        </button>
      </div>

      {/* =====================================================================
       * BAND 2: SYMMETRICAL 3-COLUMN MATCHMAKER STAGE
       * Full Untruncated Profiles + Live Dynamic Age-Gap & Scene Queue Center Box
       * ===================================================================== */}
      <section className="grid gap-4 lg:grid-cols-[1fr_340px_1fr] items-stretch">
        {/* LEFT SPOTLIGHT: HER */}
        <div
          className={`${
            mobilePairSlot === 'him' ? 'hidden lg:flex' : 'flex'
          } vice-panel rounded-3xl p-4 sm:p-5 flex-col justify-between gap-3.5 h-full`}
        >
          <div className="space-y-3">
            <div className="relative h-56 sm:h-60 w-full overflow-hidden rounded-2xl border border-black/10 bg-[#18101E]">
              <img
                key={her.photoUrl}
                src={her.photoUrl}
                alt={`${her.name}, ${her.age}`}
                className="h-full w-full object-cover object-top animate-stage-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

              <button
                type="button"
                aria-label="Previous Her character"
                onClick={() => cycleHer(-1)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/95 text-[#18101E] shadow-md hover:bg-[#FEF3C7] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next Her character"
                onClick={() => cycleHer(1)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/95 text-[#18101E] shadow-md hover:bg-[#FEF3C7] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 backdrop-blur-xs px-3 py-0.5 text-xs font-bold text-[#18101E] shadow-xs">
                📏 {herDetails.height} • {herDetails.zodiac.split('•')[0].replace(' Sun', '').trim()}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="font-display text-xl sm:text-2xl text-[#18101E]">
                  {her.name}, <span className="text-[#E11D48]">{her.age}F</span>
                </h2>
                <div className="text-sm font-bold text-[#BE123C] leading-snug">{her.title}</div>
              </div>

              <div className="inline-flex h-9 shrink-0 items-center gap-1 rounded-xl border border-[#18101E]/15 bg-[#FFF1F2] px-2 text-sm font-bold text-[#18101E]">
                <button
                  type="button"
                  onClick={() => onAdjustHerAge(-1)}
                  aria-label="Decrease Her Age"
                  className="h-6 w-6 inline-flex items-center justify-center rounded-lg border border-[#18101E]/15 bg-white hover:bg-[#FEF3C7] cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center">{her.age}</span>
                <button
                  type="button"
                  onClick={() => onAdjustHerAge(1)}
                  aria-label="Increase Her Age"
                  className="h-6 w-6 inline-flex items-center justify-center rounded-lg border border-[#18101E]/15 bg-white hover:bg-[#FEF3C7] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-sm font-semibold text-[#18101E] leading-relaxed">
              {her.tagline}
            </p>
            <p className="text-xs sm:text-[13.5px] font-medium text-[#475569] leading-relaxed bg-[#FAF8F9] rounded-xl p-3 border border-[#18101E]/8">
              {her.vibeSummary}
            </p>
          </div>

          <div className="rounded-xl border border-[#E11D48]/20 bg-[#FFF5F7] px-3.5 py-2.5 space-y-1 text-xs sm:text-sm font-semibold text-[#18101E]">
            <div>🍸 {herDetails.signatureDrink}</div>
            <div className="text-[#BE123C]">💞 {herDetails.loveLanguage}</div>
          </div>
        </div>

        {/* CENTER MATCHUP & VETTING POD (Live Dynamic Age Gap + Both Sides + Queued Scenes!) */}
        <div className="vice-panel rounded-3xl p-4 sm:p-5 flex flex-col justify-between gap-3.5 bg-gradient-to-b from-white to-[#FFF5F7] h-full">
          <div className="space-y-3">
            <div className="text-center space-y-1.5">
              <span className="inline-flex min-h-[28px] items-center justify-center rounded-full border border-[#F59E0B]/40 bg-[#FEF3C7] px-3 py-1 text-[11px] font-extrabold uppercase leading-tight tracking-wide text-[#92400E]">
                {pairing.badgeLabel}
              </span>

              <div className="font-display text-2xl text-[#18101E]">
                {her.name} ({her.age}F) × {his.name} ({his.age}M)
              </div>

              <div className="text-xs font-bold text-[#E11D48]">
                {pairing.ageGap > 0
                  ? `Live ${pairing.ageGap}-Year Age Gap • ${pairing.generationalHeadline}`
                  : pairing.generationalHeadline}
              </div>
            </div>

            {/* Balanced Two-Sided Matchup Brief (Replaces redundant Zodiac & 1-sided Golden Retriever text) */}
            <div className="rounded-2xl border border-[#18101E]/10 bg-white p-3 space-y-2 text-left text-xs leading-snug">
              <div>
                <span className="font-extrabold text-[#E11D48]">🐆 {her.name}: </span>
                <span className="font-medium text-[#334155]">{her.shortHook}</span>
              </div>
              <div className="border-t border-slate-100 pt-1.5">
                <span className="font-extrabold text-[#B45309]">🥂 {his.name}: </span>
                <span className="font-medium text-[#334155]">{his.shortHook}</span>
              </div>
            </div>

            {/* Live Tailored Story Preview — Updates Dynamically When Ages or Characters Change */}
            <div className="rounded-2xl border border-[#E11D48]/15 bg-[#FFF9FA] p-3 text-left space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[#BE123C]">
                <span>🎬 {queuedEpisodes.length} Tailored Dates Queued</span>
                <span className="text-[#64748B]">{pairing.ageGap}yr Gap</span>
              </div>
              <ul className="space-y-1 text-xs font-semibold text-[#18101E]">
                {queuedEpisodes.slice(0, 3).map((ep, idx) => (
                  <li key={ep.id} className="leading-snug">
                    {idx + 1}. {ep.title}
                  </li>
                ))}
              </ul>
              {queuedEpisodes.length > 3 && (
                <div className="text-[11px] font-medium text-[#64748B]">
                  + {queuedEpisodes.length - 3} more tailored scenes &amp; tactile minigames
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2.5">
            {onChangePacingMode && (
              <div className="grid grid-cols-2 gap-1 rounded-xl border border-[#18101E]/15 bg-white p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => onChangePacingMode('curated')}
                  className={`h-8.5 rounded-lg transition cursor-pointer ${
                    pacingMode === 'curated'
                      ? 'bg-[#18101E] text-white'
                      : 'text-[#18101E] hover:bg-[#FFF4F7]'
                  }`}
                >
                  ⚡ 8-Scene Arc
                </button>
                <button
                  type="button"
                  onClick={() => onChangePacingMode('marathon')}
                  className={`h-8.5 rounded-lg transition cursor-pointer ${
                    pacingMode === 'marathon'
                      ? 'bg-[#18101E] text-white'
                      : 'text-[#18101E] hover:bg-[#FFF4F7]'
                  }`}
                >
                  🎬 Full Season ({createRun(pairing, selectedVipIds, undefined, 'marathon').episodeQueue.length})
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                sfx.swipeRight();
                onStartGame();
              }}
              className="pop-btn w-full h-12 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#FF2E63] hover:opacity-95 text-base sm:text-lg font-extrabold text-white border-transparent inline-flex items-center justify-center cursor-pointer"
            >
              Start Vetting →
            </button>

            <button
              type="button"
              onClick={handleSlotMachineShuffle}
              className="pop-btn w-full h-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-xs sm:text-sm font-bold text-[#92400E] cursor-pointer"
            >
              <Dices className={`h-4 w-4 ${shuffling ? 'animate-spin' : ''}`} />
              <span>{shuffling ? 'Spinning Chemistry…' : 'Shuffle Random Pairing'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#18101E]/10">
              <button
                type="button"
                onClick={() => setActiveDrawer('custom')}
                className="pop-btn h-9 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-2.5 text-xs font-bold text-[#18101E] hover:bg-[#FFF4F7] cursor-pointer"
              >
                <Sliders className="h-3.5 w-3.5 text-[#E11D48]" />
                <span>Custom Twists</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawer('vip')}
                className="pop-btn h-9 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-2.5 text-xs font-bold text-[#18101E] hover:bg-[#FFFBEB] cursor-pointer"
              >
                <Crown className="h-3.5 w-3.5 text-[#F59E0B]" />
                <span>VIP ({selectedVipIds.length}/4)</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SPOTLIGHT: HIM (CUB) */}
        <div
          className={`${
            mobilePairSlot === 'her' ? 'hidden lg:flex' : 'flex'
          } vice-panel rounded-3xl p-4 sm:p-5 flex-col justify-between gap-3.5 h-full`}
        >
          <div className="space-y-3">
            <div className="relative h-56 sm:h-60 w-full overflow-hidden rounded-2xl border border-black/10 bg-[#18101E]">
              <img
                key={his.photoUrl}
                src={his.photoUrl}
                alt={`${his.name}, ${his.age}`}
                className="h-full w-full object-cover object-top animate-stage-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

              <button
                type="button"
                aria-label="Previous Cub character"
                onClick={() => cycleHis(-1)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/95 text-[#18101E] shadow-md hover:bg-[#FEF3C7] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next Cub character"
                onClick={() => cycleHis(1)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/95 text-[#18101E] shadow-md hover:bg-[#FEF3C7] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 backdrop-blur-xs px-3 py-0.5 text-xs font-bold text-[#18101E] shadow-xs">
                📏 {hisDetails.height} • {hisDetails.zodiac.split('•')[0].replace(' Sun', '').trim()}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="font-display text-xl sm:text-2xl text-[#18101E]">
                  {his.name}, <span className="text-[#D97706]">{his.age}M</span>
                </h2>
                <div className="text-sm font-bold text-[#B45309] leading-snug">{his.title}</div>
              </div>

              <div className="inline-flex h-9 shrink-0 items-center gap-1 rounded-xl border border-[#18101E]/15 bg-[#FFFBEB] px-2 text-sm font-bold text-[#18101E]">
                <button
                  type="button"
                  onClick={() => onAdjustHisAge(-1)}
                  aria-label="Decrease His Age"
                  className="h-6 w-6 inline-flex items-center justify-center rounded-lg border border-[#18101E]/15 bg-white hover:bg-[#FEF3C7] cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center">{his.age}</span>
                <button
                  type="button"
                  onClick={() => onAdjustHisAge(1)}
                  aria-label="Increase His Age"
                  className="h-6 w-6 inline-flex items-center justify-center rounded-lg border border-[#18101E]/15 bg-white hover:bg-[#FEF3C7] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-sm font-semibold text-[#18101E] leading-relaxed">
              {his.tagline}
            </p>
            <p className="text-xs sm:text-[13.5px] font-medium text-[#475569] leading-relaxed bg-[#FAF8F9] rounded-xl p-3 border border-[#18101E]/8">
              {his.vibeSummary}
            </p>
          </div>

          <div className="rounded-xl border border-[#F59E0B]/25 bg-[#FFFBEB] px-3.5 py-2.5 space-y-1 text-xs sm:text-sm font-semibold text-[#18101E]">
            <div>🥂 {hisDetails.signatureDrink}</div>
            <div className="text-[#B45309]">💞 {hisDetails.loveLanguage}</div>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * BAND 3: ORGANIZED CLUB ARCADE — 8-BIT OVERWORLD (6 HOTSPOTS) + MINI BLITZES
       * ===================================================================== */}
      <div className="space-y-4">
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

        {/* Quick Playable Pop-Culture Blitz & 25-Pt Viral IRL Check */}
        <section className="grid gap-4 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 vice-panel rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-white to-[#FFFDF5] flex flex-col justify-between gap-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#F59E0B]/35 bg-[#FEF3C7] px-3 text-xs font-extrabold text-[#92400E]">
                  🎬 Live Pop-Culture Blitz • {currentBlitz.badge}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sfx.messagePop();
                    setBlitzPicked(null);
                    setBlitzIdx((idx) => (idx + 1) % POP_CULTURE_TRIVIA.length);
                  }}
                  className="pop-btn h-8 shrink-0 rounded-full bg-white px-3 text-xs font-bold text-[#18101E] cursor-pointer"
                >
                  Next Card →
                </button>
              </div>

              <p className="font-display text-base sm:text-lg text-[#18101E] leading-snug">
                {currentBlitz.question}
              </p>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentBlitz.options.map((opt, idx) => {
                  const isCorrect = idx === currentBlitz.correctIndex;
                  let btnColor = 'bg-white text-[#18101E] hover:bg-[#FFF5F7]';
                  if (blitzPicked !== null) {
                    if (isCorrect) btnColor = 'bg-[#D1FAE5] text-[#065F46] border-[#10B981]';
                    else if (blitzPicked === idx)
                      btnColor = 'bg-[#FFE4E6] text-[#9F1239] border-[#F43F5E]';
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
                      className={`pop-btn min-h-[44px] w-full rounded-xl px-3 py-2 text-left text-xs sm:text-sm font-semibold leading-snug flex items-center justify-between gap-2 cursor-pointer ${btnColor}`}
                    >
                      <span>{opt}</span>
                      {blitzPicked !== null && isCorrect && (
                        <span className="shrink-0 whitespace-nowrap font-pixel text-[10px]">
                          +15XP
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {blitzPicked !== null && (
                <div className="rounded-xl border border-[#F59E0B]/35 bg-[#FFFBEB] px-3 py-2 text-xs font-semibold text-[#18101E]">
                  ✨ {currentBlitz.funFact}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 vice-panel rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-white to-[#FFF5F7] flex flex-col justify-between gap-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#FFE4E6] px-3 text-xs font-extrabold text-[#BE123C]">
                  🔥 Viral IRL Check ({viralChecked.length}/25)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sfx.messagePop();
                    setViralIdx((idx) => (idx + 1) % COUGAR_CUB_CHECKLIST_ITEMS.length);
                  }}
                  className="pop-btn h-8 shrink-0 rounded-full bg-white px-3 text-xs font-bold text-[#18101E] cursor-pointer"
                >
                  Next Dare →
                </button>
              </div>

              <p className="font-display text-base sm:text-lg text-[#18101E] leading-snug">
                &ldquo;{currentViral.text}&rdquo;
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
                  <span>Club Viral Score: {viralChecked.length * 4} pts</span>
                  <button
                    type="button"
                    onClick={() => onJumpToMapScene?.(currentViral.episodeId)}
                    className="text-[#E11D48] hover:underline font-bold cursor-pointer"
                  >
                    Play Scene →
                  </button>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FD267A] to-[#F59E0B] transition-all duration-300"
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
                  className="pop-btn h-11 w-full rounded-xl bg-[#E11D48] hover:bg-[#BE123C] px-2.5 text-xs font-bold text-white inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span>🙋‍♀️ Lived This! (+15 XP)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sfx.messagePop();
                    onGainAdventureXp?.(10);
                    setViralIdx((idx) => (idx + 1) % COUGAR_CUB_CHECKLIST_ITEMS.length);
                  }}
                  className="pop-btn h-11 w-full rounded-xl bg-white hover:bg-[#FFFBEB] px-2.5 text-xs font-bold text-[#18101E] inline-flex items-center justify-center whitespace-nowrap cursor-pointer"
                >
                  <span>🛡️ Dodged! → Next</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* BAND 5: FULL READABLE CLUB ROSTER (Zero Truncation, Clean Vertical Flow!) */}
      <section className="vice-panel rounded-3xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCastTab('her')}
              className={`pop-btn h-10 rounded-full px-4 text-xs sm:text-sm font-bold inline-flex items-center justify-center whitespace-nowrap cursor-pointer ${
                castTab === 'her'
                  ? 'bg-[#E11D48] text-white border-transparent'
                  : 'bg-white text-[#18101E] hover:bg-[#FFF1F2]'
              }`}
            >
              🐆 Her Roster ({HER_ARCHETYPES.length} • Ages 30–64)
            </button>
            <button
              type="button"
              onClick={() => setCastTab('him')}
              className={`pop-btn h-10 rounded-full px-4 text-xs sm:text-sm font-bold inline-flex items-center justify-center whitespace-nowrap cursor-pointer ${
                castTab === 'him'
                  ? 'bg-[#F59E0B] text-[#18101E] border-transparent'
                  : 'bg-white text-[#18101E] hover:bg-[#FFFBEB]'
              }`}
            >
              🥂 Cub Roster ({HIS_ARCHETYPES.length} • Ages 21–33)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {castTab === 'her' &&
              (['all', '30s', '40s', '50s', '60s'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setHerFilter(f)}
                  className={`pop-btn h-9 rounded-full px-3.5 text-xs font-bold inline-flex items-center justify-center whitespace-nowrap cursor-pointer ${
                    herFilter === f
                      ? 'bg-[#18101E] text-white'
                      : 'bg-white text-[#18101E] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {f === 'all' ? 'All Decades' : f === '60s' ? '60+' : f}
                </button>
              ))}

            <button
              type="button"
              onClick={() => setExpandedGrid((v) => !v)}
              className="pop-btn h-9 rounded-full bg-[#F8FAFC] px-3.5 text-xs font-bold text-[#475569] inline-flex items-center justify-center whitespace-nowrap cursor-pointer"
            >
              {expandedGrid ? 'Carousel View' : 'Full Roster Grid'}
            </button>
          </div>
        </div>

        <div
          className={
            expandedGrid
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch'
              : 'flex gap-4 overflow-x-auto pb-3 snap-x'
          }
        >
          {(castTab === 'her' ? filteredHerList : HIS_ARCHETYPES).map((item) => {
            const isSelected = castTab === 'her' ? item.id === her.id : item.id === his.id;
            const d = getProfileDetails(item);
            return (
              <div
                key={item.id}
                className={`${
                  expandedGrid ? 'w-full' : 'w-72 shrink-0 snap-start'
                } group overflow-hidden rounded-2xl border transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#E11D48] ring-2 ring-[#E11D48]/25 bg-[#FFF5F7]'
                    : 'border-[#18101E]/12 bg-white hover:border-[#E11D48]/50 shadow-xs'
                }`}
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-[#18101E]">
                    <img
                      src={item.photoUrl}
                      alt={`${item.name}, ${item.age}`}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                      <span className="rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-xs font-bold text-[#18101E] shadow-xs whitespace-nowrap">
                        📏 {d.height} • {d.zodiac.split('•')[0].replace(' Sun', '').trim()}
                      </span>
                      {isSelected && (
                        <span className="rounded-full bg-[#E11D48] px-2.5 py-0.5 text-[11px] font-extrabold text-white whitespace-nowrap">
                          ✓ Active Roster
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div>
                      <div className="font-display text-lg text-[#18101E]">
                        {item.name}, <span className="text-[#E11D48]">{item.age}</span>
                      </div>
                      <div className="text-xs font-bold text-[#BE123C] leading-snug">
                        {item.title}
                      </div>
                    </div>

                    <p className="text-xs sm:text-[13px] font-semibold text-[#18101E] leading-relaxed">
                      {item.tagline}
                    </p>
                    <p className="text-xs font-medium text-[#475569] leading-relaxed">
                      {item.vibeSummary}
                    </p>
                    <div className="pt-1 flex flex-wrap gap-1.5 text-[11px] font-semibold text-[#475569]">
                      <span className="rounded-full bg-[#F8FAFC] border border-[#18101E]/10 px-2.5 py-0.5">
                        🍸 {d.signatureDrink}
                      </span>
                      <span className="rounded-full bg-[#F8FAFC] border border-[#18101E]/10 px-2.5 py-0.5">
                        💞 {d.loveLanguage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 flex items-center gap-2">
                  <button
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
                    className={`pop-btn flex-1 h-9 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#18101E] text-white'
                        : 'bg-[#E11D48] hover:bg-[#BE123C] text-white border-transparent'
                    }`}
                  >
                    {isSelected ? '✓ On Your Roster' : `Draft ${item.name}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectedProfile(item)}
                    className="pop-btn h-9 rounded-xl bg-white hover:bg-[#F8FAFC] px-3 text-xs font-bold text-[#18101E] whitespace-nowrap cursor-pointer"
                  >
                    Full Bio
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FULL PROFILE DOSSIER MODAL (Read 100% of any Roster Member anywhere!) */}
      {inspectedProfile &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#18101E]/60 p-4 backdrop-blur-xs"
            onClick={() => setInspectedProfile(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="vice-panel max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 space-y-4 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block rounded-full bg-[#FFF1F2] px-3 py-0.5 text-xs font-bold text-[#E11D48]">
                    Official Club Roster Dossier
                  </span>
                  <h3 className="mt-1 font-display text-2xl text-[#18101E]">
                    {inspectedProfile.name}, {inspectedProfile.age}
                  </h3>
                  <div className="text-sm font-bold text-[#BE123C]">{inspectedProfile.title}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedProfile(null)}
                  className="pop-btn h-9 w-9 inline-flex items-center justify-center rounded-full bg-[#F8FAFC] text-[#18101E] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <img
                src={inspectedProfile.photoUrl}
                alt={inspectedProfile.name}
                className="h-64 w-full rounded-2xl object-cover object-top"
              />

              {(() => {
                const details = getProfileDetails(inspectedProfile);
                return (
                  <div className="space-y-3 text-sm text-[#18101E]">
                    <div className="flex flex-wrap gap-2 text-xs font-bold">
                      <span className="rounded-full bg-[#F8FAFC] border border-[#18101E]/12 px-3 py-1">
                        📏 {details.height}
                      </span>
                      <span className="rounded-full bg-[#F8FAFC] border border-[#18101E]/12 px-3 py-1">
                        ✨ {details.zodiac}
                      </span>
                      <span className="rounded-full bg-[#FFF1F2] px-3 py-1 text-[#BE123C]">
                        🍸 {details.signatureDrink}
                      </span>
                    </div>
                    <p className="font-semibold leading-relaxed">{inspectedProfile.tagline}</p>
                    <p className="text-[#475569] leading-relaxed">{inspectedProfile.vibeSummary}</p>
                    <div className="rounded-xl bg-[#FFFBEB] border border-[#F59E0B]/30 p-3 text-xs font-semibold text-[#92400E]">
                      💞 Love Language: {details.loveLanguage}
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if ('felineTierHint' in inspectedProfile || HER_ARCHETYPES.some((h) => h.id === inspectedProfile.id)) {
                      onSelectHer(inspectedProfile as HerArchetype);
                    } else {
                      onSelectHis(inspectedProfile as HisArchetype);
                    }
                    setInspectedProfile(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="pop-btn flex-1 h-11 rounded-xl bg-[#E11D48] text-sm font-bold text-white border-transparent cursor-pointer"
                >
                  Draft {inspectedProfile.name} &amp; View Matchup ↑
                </button>
                <button
                  type="button"
                  onClick={() => setInspectedProfile(null)}
                  className="pop-btn h-11 rounded-xl bg-white px-4 text-sm font-bold text-[#18101E] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

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
      {activeDrawer &&
        createPortal(
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
        </div>,
          document.body,
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
