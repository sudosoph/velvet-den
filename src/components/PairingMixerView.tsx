import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BadgeCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Crown,
  Dices,
  Flame,
  Gamepad2,
  GraduationCap,
  Heart,
  Info,
  Lock,
  MessageCircle,
  Minus,
  Plus,
  Send,
  Share2,
  Sliders,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { EPISODES } from '../data/episodes';
import type { WalletState } from '../domain/economy';
import { createRun, type RunPacingMode } from '../domain/gameEngine';
import {
  loadMatchCareer,
  saveMatchCareer,
  type MatchCareerState,
  type VelvetDadbookProfile,
} from '../domain/matchCareer';
import type { AdventureProgressState } from '../domain/progression';
import {
  getHingeExtendedProfile,
  getProfileDetails,
  HER_ARCHETYPES,
  HIS_ARCHETYPES,
  type HerArchetype,
  type HisArchetype,
  type PairingAnalysis,
  type PlayerRole,
  type SubplotTag,
} from '../domain/taxonomy';
import { trackEvent } from '../lib/analytics';
import { sfx } from '../lib/sound';
import { buildDilemmaShareLink, encodeChallengeLink } from '../lib/viral';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

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
  onStartCharacterDate?: (targetId: string, targetRole: 'her' | 'him') => void;
  onOpenBoutique?: () => void;
  onOpenLiveInbox: (preferredMatchId?: string) => void;
  onOpenPopTrivia: () => void;
  onOpenChecklist?: () => void;
  onQuickCreateAudition?: () => void;
  onOpenFieldGuide: () => void;
  onOpenWorldTab?: () => void;
  onOpenCubAcademy?: (subTab?: 'obedience' | 'scanner' | 'dateodex') => void;
  onOpenCourtroom?: () => void;
  onOpenAbout?: () => void;
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
  onStartCharacterDate,
  onOpenBoutique,
  onOpenLiveInbox,
  onOpenFieldGuide,
  onOpenWorldTab,
  onOpenCubAcademy,
  onOpenCourtroom,
  onOpenAbout,
  dateodexStampedCount = 0,
}) => {
  const [career, setCareer] = useState<MatchCareerState>(() => loadMatchCareer());
  const [slideIdx, setSlideIdx] = useState(0);
  const [matchSplashTarget, setMatchSplashTarget] = useState<(HerArchetype | HisArchetype) | null>(
    null,
  );
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);
  const [castTab, setCastTab] = useState<'her' | 'him'>(() => (role === 'her' ? 'him' : 'her'));
  const [herFilter, setHerFilter] = useState<HerDecadeFilter>('all');
  const [inspectedProfile, setInspectedProfile] = useState<HerArchetype | HisArchetype | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<'custom' | 'vip' | null>(null);
  const [shuffling, setShuffling] = useState(false);

  const phoneTarget: HerArchetype | HisArchetype = role === 'her' ? his : her;
  const playerAvatar: HerArchetype | HisArchetype = role === 'her' ? her : his;
  const targetRole: 'her' | 'him' = role === 'her' ? 'him' : 'her';

  const hinge = useMemo(() => getHingeExtendedProfile(phoneTarget), [phoneTarget]);
  const targetDetails = useMemo(() => getProfileDetails(phoneTarget), [phoneTarget]);
  const vipEpisodes = useMemo(() => EPISODES.filter((e) => e.isVip), []);

  const totalSlides = hinge.slides.length;
  const safeSlideIdx = Math.min(slideIdx, Math.max(0, totalSlides - 1));
  const currentSlide = hinge.slides[safeSlideIdx] ?? hinge.slides[0];

  const updateCareer = (updater: (prev: MatchCareerState) => MatchCareerState) => {
    setCareer((prev) => {
      const next = updater(prev);
      saveMatchCareer(next);
      return next;
    });
  };

  const updateDadbook = <K extends keyof VelvetDadbookProfile>(
    key: K,
    val: VelvetDadbookProfile[K],
  ) => {
    sfx.messagePop();
    updateCareer((prev) => ({
      ...prev,
      dadbook: { ...prev.dadbook, [key]: val },
    }));
  };

  const cycleCandidate = (dir: 1 | -1) => {
    sfx.messagePop();
    setSlideIdx(0);
    setMatchSplashTarget(null);
    if (role === 'her') {
      const idx = HIS_ARCHETYPES.findIndex((c) => c.id === his.id);
      const next = HIS_ARCHETYPES[(idx + dir + HIS_ARCHETYPES.length) % HIS_ARCHETYPES.length];
      onSelectHis(next);
    } else {
      const idx = HER_ARCHETYPES.findIndex((h) => h.id === her.id);
      const next = HER_ARCHETYPES[(idx + dir + HER_ARCHETYPES.length) % HER_ARCHETYPES.length];
      onSelectHer(next);
    }
  };

  const handlePhoneMatch = (isSuper: boolean) => {
    if (isSuper) sfx.victoryFanfare();
    else sfx.swipeRight();

    updateCareer((prev) => ({
      ...prev,
      swipedIds: prev.swipedIds.includes(phoneTarget.id)
        ? prev.swipedIds
        : [...prev.swipedIds, phoneTarget.id],
      matchedIds: prev.matchedIds.includes(phoneTarget.id)
        ? prev.matchedIds
        : [phoneTarget.id, ...prev.matchedIds],
      superLikedIds:
        isSuper && !prev.superLikedIds.includes(phoneTarget.id)
          ? [...prev.superLikedIds, phoneTarget.id]
          : prev.superLikedIds,
    }));

    trackEvent('match_earned', {
      target_id: phoneTarget.id,
      target_name: phoneTarget.name,
      target_age: phoneTarget.age,
      super_like: isSuper,
      role,
    });

    setMatchSplashTarget(phoneTarget);
  };

  const handlePhonePass = () => {
    sfx.swipeLeft();
    updateCareer((prev) => ({
      ...prev,
      swipedIds: prev.swipedIds.includes(phoneTarget.id)
        ? prev.swipedIds
        : [...prev.swipedIds, phoneTarget.id],
    }));
    trackEvent('profile_swiped', {
      target_id: phoneTarget.id,
      direction: 'left',
      surface: 'desktop_phone_landing',
    });
    cycleCandidate(1);
  };

  const handleSendToBestie = (person: HerArchetype | HisArchetype) => {
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin.startsWith('http')
        ? `${window.location.origin}${window.location.pathname}`
        : BRAND_CONFIG.publicBaseUrl;
    const link = buildDilemmaShareLink(person.id, baseUrl);
    setSharePayload({
      title: `Send ${person.name} (${person.age}) to Bestie`,
      message: `👀 Group-chat check on ${person.name}, ${person.age} (${person.title}): "${person.shortHook}", Match or Pass?!`,
      url: link,
      shareSurface: 'bestie_profile',
      discordMarkdown: `**👀 Bestie Profile Check: ${person.name}, ${person.age}** (${person.title})\n> ${person.tagline}\nInspect full 6-slide profile: ${link}`,
    });
  };

  const handleOpenAuditionShare = () => {
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin.startsWith('http')
        ? `${window.location.origin}${window.location.pathname}`
        : BRAND_CONFIG.publicBaseUrl;
    const episodeIds = createRun(pairing, selectedVipIds)
      .episodeQueue.slice(0, 5)
      .map((e) => e.id);
    const link = encodeChallengeLink(
      {
        v: 1,
        senderName: playerAvatar.name,
        senderRole: role,
        herId: her.id,
        hisId: his.id,
        episodeIds:
          episodeIds.length > 0
            ? episodeIds
            : ['check-drop', 'code-switch-texting', 'houseboy-sunday-sanctuary'],
        preferredChoiceIndices: (episodeIds.length > 0 ? episodeIds : [0, 0, 0]).map(() => 0),
      },
      baseUrl,
    );
    setSharePayload({
      title: 'Send 60-Second Vetting Audition',
      message: `🐆 Think you’d survive dating me? Pass my 60-second Cougars & Cubs Vetting Audition 👀`,
      url: link,
      shareSurface: 'audition',
      discordMarkdown: `**🐆 Pass My 60-Second Cougars & Cubs Vetting Audition**\nPlay in 60 seconds and send back your score: ${link}`,
    });
  };

  const handleSlotMachineShuffle = () => {
    if (shuffling) return;
    setShuffling(true);
    setSlideIdx(0);
    setMatchSplashTarget(null);
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
      if (ticks >= 5) {
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

  const earnedPool = useMemo(() => {
    const all = role === 'her' ? HIS_ARCHETYPES : HER_ARCHETYPES;
    return career.matchedIds
      .map((id) => all.find((p) => p.id === id))
      .filter((p): p is HerArchetype | HisArchetype => Boolean(p));
  }, [career.matchedIds, role]);

  const filteredHerList = HER_ARCHETYPES.filter((item) => {
    if (herFilter === '30s') return item.age >= 30 && item.age <= 39;
    if (herFilter === '40s') return item.age >= 40 && item.age <= 49;
    if (herFilter === '50s') return item.age >= 50 && item.age <= 59;
    if (herFilter === '60s') return item.age >= 60;
    return true;
  });

  return (
    <div className="w-full space-y-6 animate-stage-in">
      {noticeBanner && (
        <div className="vice-panel rounded-2xl bg-[#FFBE0B] px-5 py-3 text-sm font-bold text-[#1E1022]">
          {noticeBanner}
        </div>
      )}

      {/* =====================================================================
       * OPTION A TWO-COLUMN DESKTOP PHONE SIMULATOR LANDING
       * Left: Restored Hero Slogan, Role/Age Slider, 3-Tap Velvet Profile & Earned Matches
       * Right: Realistic iPhone Frame w/ Scrollable 6-Slide Hinge Profile & IT'S A MATCH!
       * ===================================================================== */}
      <section className="grid gap-6 lg:grid-cols-[1.08fr_420px] items-start">
        {/* LEFT STUDIO COLUMN */}
        <div className="space-y-4">
          <div className="vice-panel rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-white via-[#FFF7F9] to-[#FFFDF5] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#FD267A]/25 bg-[#FFF0F5] px-3 text-xs font-extrabold uppercase tracking-wider text-[#E11D48]">
                <Flame className="h-3.5 w-3.5 fill-[#FD267A] text-[#FD267A]" />
                <span>
                  {HER_ARCHETYPES.length + HIS_ARCHETYPES.length} Cast Profiles • 3-Date Romances • Live AI Chats
                </span>
              </span>

              {onOpenAbout && (
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold text-[#475569] hover:text-[#E11D48] cursor-pointer"
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>How It Works</span>
                </button>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl text-[#18101E] leading-tight">
              Lower Your Age Slider. Vet the Red Flags.{' '}
              <span className="text-[#E11D48]">Win Real Love.</span>
            </h1>

            <p className="text-xs sm:text-sm font-medium text-[#475569] leading-relaxed">
              Swipe full 6-photo Hinge profiles on the phone simulator, remember details to win off-app iMessage numbers, train feral Cubs in 2D Clicker School, and unlock 3-date endings.
            </p>

            {/* Role Toggle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  setSlideIdx(0);
                  setMatchSplashTarget(null);
                  setCastTab('him');
                  onChangeRole('her');
                }}
                className={`pop-btn min-h-[82px] rounded-2xl px-4 py-3 flex flex-col justify-between text-left cursor-pointer ${
                  role === 'her'
                    ? 'bg-gradient-to-r from-[#E11D48] to-[#FF2E63] text-white border-transparent shadow-sm'
                    : 'bg-white text-[#18101E] hover:bg-[#FFF5F7]'
                }`}
              >
                <div className="text-sm sm:text-[15px] font-extrabold leading-snug">
                  🐆 Play as Her
                </div>
                <div
                  className={`font-sans text-xs font-semibold leading-snug mt-1 ${
                    role === 'her' ? 'text-white/95' : 'text-[#475569]'
                  }`}
                >
                  Vet &amp; Train Your Cub • Catch Red Flags &amp; Set the Pace
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  setSlideIdx(0);
                  setMatchSplashTarget(null);
                  setCastTab('her');
                  onChangeRole('him');
                }}
                className={`pop-btn min-h-[82px] rounded-2xl px-4 py-3 flex flex-col justify-between text-left cursor-pointer ${
                  role === 'him'
                    ? 'bg-[#F59E0B] text-[#18101E] border-transparent shadow-sm'
                    : 'bg-white text-[#18101E] hover:bg-[#FFFBEB]'
                }`}
              >
                <div className="text-sm sm:text-[15px] font-extrabold leading-snug">
                  🥂 Play as Him
                </div>
                <div
                  className={`font-sans text-xs font-semibold leading-snug mt-1 ${
                    role === 'him' ? 'text-[#18101E]/95' : 'text-[#475569]'
                  }`}
                >
                  Impress &amp; Commit • Code-Switch &amp; Plan Real Dates
                </div>
              </button>
            </div>

            {/* Live Matchup & Dynamic Age Adjuster */}
            <div className="rounded-2xl border border-[#18101E]/12 bg-white p-3.5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-block rounded-full bg-[#FEF3C7] border border-[#F59E0B]/40 px-2.5 py-0.5 text-[11px] font-extrabold text-[#92400E]">
                    {pairing.badgeLabel}
                  </span>
                  <div className="mt-1 font-display text-lg sm:text-xl text-[#18101E]">
                    {her.name} ({her.age}F) × {his.name} ({his.age}M) •{' '}
                    <span className="text-[#E11D48]">Live {pairing.ageGap}-Year Age Gap</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex h-8.5 items-center gap-1 rounded-xl border border-[#18101E]/15 bg-[#FFF1F2] px-2 text-xs font-bold text-[#18101E]">
                    <span className="text-[#BE123C]">Her</span>
                    <button
                      type="button"
                      onClick={() => onAdjustHerAge(-1)}
                      aria-label="Decrease Her Age"
                      className="h-6 w-6 inline-flex items-center justify-center rounded-lg border border-[#18101E]/15 bg-white cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center">{her.age}</span>
                    <button
                      type="button"
                      onClick={() => onAdjustHerAge(1)}
                      aria-label="Increase Her Age"
                      className="h-6 w-6 inline-flex items-center justify-center rounded-lg border border-[#18101E]/15 bg-white cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="inline-flex h-8.5 items-center gap-1 rounded-xl border border-[#18101E]/15 bg-[#FFFBEB] px-2 text-xs font-bold text-[#18101E]">
                    <span className="text-[#B45309]">Him</span>
                    <button
                      type="button"
                      onClick={() => onAdjustHisAge(-1)}
                      aria-label="Decrease His Age"
                      className="h-6 w-6 inline-flex items-center justify-center rounded-lg border border-[#18101E]/15 bg-white cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center">{his.age}</span>
                    <button
                      type="button"
                      onClick={() => onAdjustHisAge(1)}
                      aria-label="Increase His Age"
                      className="h-6 w-6 inline-flex items-center justify-center rounded-lg border border-[#18101E]/15 bg-white cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Tap "Velvet Profile" (Dream Daddy Dadbook) */}
            <div className="rounded-2xl border border-[#18101E]/10 bg-[#FAF8F9] p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E11D48]">
                  ✨ Your 3-Tap Velvet Dating Card
                </span>
                <span className="text-[11px] font-semibold text-[#64748B]">
                  Shapes match banter &amp; date picks
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-[#475569]">1. Friday Vibe</div>
                  <select
                    aria-label="Your Friday Vibe"
                    value={career.dadbook.fridayVibe}
                    onChange={(e) =>
                      updateDadbook(
                        'fridayVibe',
                        e.target.value as VelvetDadbookProfile['fridayVibe'],
                      )
                    }
                    className="w-full rounded-xl border border-[#18101E]/15 bg-white px-2.5 py-1.5 font-bold text-[#18101E]"
                  >
                    <option value="candlelit_bistro">🕯️ Candlelit Bistro</option>
                    <option value="home_cooking">🍝 Linen-Apron Cooking</option>
                    <option value="spontaneous_escape">✈️ 18h Pool &amp; Sauna</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-[#475569]">2. Polarity Style</div>
                  <select
                    aria-label="Your Polarity Style"
                    value={career.dadbook.polarityStyle}
                    onChange={(e) =>
                      updateDadbook(
                        'polarityStyle',
                        e.target.value as VelvetDadbookProfile['polarityStyle'],
                      )
                    }
                    className="w-full rounded-xl border border-[#18101E]/15 bg-white px-2.5 py-1.5 font-bold text-[#18101E]"
                  >
                    <option value="princess_romance">👑 Princess Romance</option>
                    <option value="soft_good_boy">🦮 Soft &ldquo;Good Boy&rdquo;</option>
                    <option value="witty_equal">🥂 Witty Equal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-[#475569]">3. #1 Dealbreaker</div>
                  <select
                    aria-label="Your Top Dealbreaker"
                    value={career.dadbook.dealbreaker}
                    onChange={(e) =>
                      updateDadbook(
                        'dealbreaker',
                        e.target.value as VelvetDadbookProfile['dealbreaker'],
                      )
                    }
                    className="w-full rounded-xl border border-[#18101E]/15 bg-white px-2.5 py-1.5 font-bold text-[#18101E]"
                  >
                    <option value="snapchat_streaks">📵 Snapchat Streaks</option>
                    <option value="venmo_math">💸 $3.19 Venmo Math</option>
                    <option value="bucket_list_tourists">🪣 Bucket-List Tourists</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Launch Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  sfx.swipeRight();
                  onStartGame();
                }}
                className="pop-btn h-11 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#FF2E63] px-4 text-sm font-extrabold text-white border-transparent inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Flame className="h-4 w-4 fill-white" />
                <span>Start Vetting (Trap-Spotter Deck) →</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  onOpenLiveInbox(phoneTarget.id);
                }}
                className="pop-btn h-11 rounded-2xl bg-[#007AFF] px-4 text-sm font-extrabold text-white border-transparent inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Open Chats &amp; Discord ({Math.max(1, earnedPool.length)})</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#18101E]/10 text-xs font-bold">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAuditionShare}
                  className="pop-btn h-8.5 rounded-xl bg-[#ECFDF5] px-3 text-xs font-extrabold text-[#065F46] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send 60s Audition</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendToBestie(phoneTarget)}
                  className="pop-btn h-8.5 rounded-xl bg-[#FFF1F2] px-3 text-xs font-extrabold text-[#BE123C] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Invite Bestie</span>
                </button>

                <button
                  type="button"
                  onClick={handleSlotMachineShuffle}
                  className="pop-btn h-8.5 rounded-xl bg-[#FEF3C7] px-3 text-xs font-extrabold text-[#92400E] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Dices className={`h-3.5 w-3.5 ${shuffling ? 'animate-spin' : ''}`} />
                  <span>Shuffle Pair</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {onChangePacingMode && (
                  <button
                    type="button"
                    onClick={() =>
                      onChangePacingMode(pacingMode === 'curated' ? 'marathon' : 'curated')
                    }
                    className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-[#18101E] cursor-pointer"
                  >
                    {pacingMode === 'curated' ? '⚡ 8-Scene Arc' : '🎬 Full Season'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveDrawer('custom')}
                  className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-[#18101E] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="h-3 w-3 text-[#E11D48]" />
                  <span>Twists</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDrawer('vip')}
                  className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-[#18101E] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Crown className="h-3 w-3 text-[#F59E0B]" />
                  <span>VIP ({selectedVipIds.length}/4)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Earned Matches Tray + Club Shortcuts */}
          <div className="vice-panel rounded-3xl p-4 sm:p-5 bg-white space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#18101E]">
                💘 Your Earned Phone Matches ({earnedPool.length})
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                {onOpenCubAcademy && (
                  <button
                    type="button"
                    onClick={() => onOpenCubAcademy('dateodex')}
                    className="text-[#7C3AED] hover:underline cursor-pointer"
                  >
                    📸 Dateodex ({dateodexStampedCount}/{HER_ARCHETYPES.length + HIS_ARCHETYPES.length})
                  </button>
                )}
                {onOpenWorldTab && (
                  <button
                    type="button"
                    onClick={onOpenWorldTab}
                    className="text-[#059669] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Gamepad2 className="h-3.5 w-3.5" />
                    <span>In-The-Wild Map</span>
                  </button>
                )}
                {onOpenCourtroom && (
                  <button
                    type="button"
                    onClick={onOpenCourtroom}
                    className="text-[#B45309] hover:underline cursor-pointer"
                  >
                    👑 Courtroom
                  </button>
                )}
              </div>
            </div>

            {earnedPool.length === 0 ? (
              <p className="text-xs font-medium text-[#64748B]">
                Tap <strong>❤️ Match</strong> on the phone simulator on the right to start collecting matches for Tinder, off-app iMessage, and 3-Date romance runs!
              </p>
            ) : (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {earnedPool.map((m) => {
                  const stage = career.dateStageByMatchId[m.id] ?? 0;
                  return (
                    <div
                      key={m.id}
                      className="shrink-0 w-52 rounded-2xl border border-[#18101E]/12 bg-[#FFFDF9] p-2.5 flex items-center gap-2.5"
                    >
                      <img
                        src={m.photoUrl}
                        alt={m.name}
                        className="h-12 w-10 rounded-xl object-cover object-top shrink-0 border border-black/10"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="truncate text-xs font-extrabold text-[#18101E]">
                          {m.name}, {m.age}
                        </div>
                        <div className="text-[10px] font-bold text-[#E11D48]">
                          Date {Math.min(3, stage + 1)} of 3 Ready
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenLiveInbox(m.id)}
                            className="rounded-lg bg-[#007AFF] px-2 py-0.5 text-[10px] font-extrabold text-white cursor-pointer"
                          >
                            DM
                          </button>
                          {onStartCharacterDate && (
                            <button
                              type="button"
                              onClick={() => onStartCharacterDate(m.id, targetRole)}
                              className="rounded-lg bg-[#FF2E63] px-2 py-0.5 text-[10px] font-extrabold text-white cursor-pointer"
                            >
                              Date #{Math.min(3, stage + 1)}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REALISTIC DESKTOP iPHONE SIMULATOR FRAME */}
        <div
          data-testid="desktop-phone-simulator"
          className="mx-auto w-full max-w-[410px] rounded-[42px] border-[7px] border-[#18101E] bg-[#18101E] p-2 shadow-[0_24px_60px_-15px_rgba(24,16,30,0.45)]"
        >
          <div className="relative flex flex-col overflow-hidden rounded-[34px] bg-white text-[#18101E]">
            {/* iOS Status Bar + Dynamic Island */}
            <div className="flex items-center justify-between px-5 pt-2.5 pb-1.5 text-[11px] font-extrabold text-[#18101E] bg-white">
              <span>9:41</span>
              <span className="h-4 w-24 rounded-full bg-[#18101E]" />
              <span>5G • 100%</span>
            </div>

            {/* Phone App Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 bg-white">
              <button
                type="button"
                aria-label="Previous phone profile"
                onClick={() => cycleCandidate(-1)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="text-center">
                <div className="text-xs font-extrabold text-[#E11D48]">
                  🔥 Slide {safeSlideIdx + 1} of {totalSlides} • 6/6 Verified Slides
                </div>
                <div className="text-[10px] font-semibold text-[#64748B]">
                  {role === 'her' ? 'Cub Discovery Feed' : 'Cougar / Puma / Jaguar Feed'}
                </div>
              </div>

              <button
                type="button"
                aria-label="Next phone profile"
                onClick={() => cycleCandidate(1)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Animated IT'S A MATCH! Splash Overlay */}
            {matchSplashTarget && matchSplashTarget.id === phoneTarget.id && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#18101E]/92 p-6 text-center text-white space-y-4 animate-stage-in">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFBE0B] px-3 py-1 text-xs font-extrabold uppercase text-[#18101E]">
                  <Sparkles className="h-3.5 w-3.5" /> Mutual Right Swipe
                </span>
                <div className="font-display text-4xl text-white tracking-tight">
                  IT&apos;S A MATCH! 🔥
                </div>
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={playerAvatar.photoUrl}
                    alt={playerAvatar.name}
                    className="h-24 w-18 rounded-2xl border-2 border-white object-cover object-top"
                  />
                  <Heart className="h-7 w-7 fill-[#FF2E63] text-[#FF2E63]" />
                  <img
                    src={matchSplashTarget.photoUrl}
                    alt={matchSplashTarget.name}
                    className="h-24 w-18 rounded-2xl border-2 border-[#FFBE0B] object-cover object-top"
                  />
                </div>
                <p className="text-xs font-semibold text-white/90 max-w-xs leading-relaxed">
                  You matched with <strong>{matchSplashTarget.name}, {matchSplashTarget.age}</strong>! Tip: mention a detail from {HER_ARCHETYPES.some((h) => h.id === matchSplashTarget.id) ? 'her' : 'his'} profile in Tinder DMs for a <strong>Profile Memory Bonus</strong>.
                </p>
                <div className="w-full space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenLiveInbox(matchSplashTarget.id)}
                    className="pop-btn w-full rounded-2xl bg-[#007AFF] py-3 text-sm font-extrabold text-white border-transparent cursor-pointer"
                  >
                    💬 Send First DM to {matchSplashTarget.name} →
                  </button>
                  {onStartCharacterDate && (
                    <button
                      type="button"
                      onClick={() => onStartCharacterDate(matchSplashTarget.id, targetRole)}
                      className="pop-btn w-full rounded-2xl bg-[#FF2E63] py-2.5 text-xs font-extrabold text-white border-transparent cursor-pointer"
                    >
                      💘 Jump Straight to Date #1 (3 Scenes) →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMatchSplashTarget(null);
                      cycleCandidate(1);
                    }}
                    className="w-full rounded-xl bg-white/10 py-2 text-xs font-bold text-white/90 hover:bg-white/20 cursor-pointer"
                  >
                    Keep Swiping Next Profile →
                  </button>
                </div>
              </div>
            )}

            {/* Scrollable 6-Photo Hinge Profile Feed */}
            <div className="max-h-[540px] overflow-y-auto overscroll-contain p-3.5 space-y-3 bg-[#FAF8F9]">
              {/* Uncropped 3:4 Portrait Container */}
              <div className="relative mx-auto w-full aspect-[3/4] overflow-hidden rounded-3xl border border-black/10 bg-[#18101E]">
                <img
                  key={`${phoneTarget.id}-${safeSlideIdx}`}
                  src={currentSlide.url}
                  alt={`${phoneTarget.name} ${currentSlide.tag}`}
                  className="h-full w-full object-cover object-top animate-stage-in"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />

                {/* 6 Story Progress Bars */}
                <div className="absolute top-2.5 inset-x-3 grid grid-cols-6 gap-1 z-10">
                  {hinge.slides.map((sl, idx) => (
                    <button
                      key={`${sl.tag}-${idx}`}
                      type="button"
                      aria-label={`Phone slide ${idx + 1}`}
                      onClick={() => setSlideIdx(idx)}
                      className={`h-1.5 rounded-full transition cursor-pointer ${
                        idx === safeSlideIdx ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>

                {/* Slide Switcher Arrows */}
                <button
                  type="button"
                  aria-label="Previous photo slide"
                  onClick={() => setSlideIdx((safeSlideIdx - 1 + totalSlides) % totalSlides)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo slide"
                  onClick={() => setSlideIdx((safeSlideIdx + 1) % totalSlides)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Bottom Portrait Identity */}
                <div className="absolute inset-x-3.5 bottom-3 text-white space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-display text-2xl leading-none">
                      {phoneTarget.name}, {phoneTarget.age}
                    </h2>
                    <BadgeCheck className="h-5 w-5 fill-[#38BDF8] text-white shrink-0" />
                  </div>
                  <div className="text-xs font-bold text-[#FDE68A]">{currentSlide.tag}</div>
                  <p className="text-[11px] font-medium text-white/90 leading-snug">
                    {currentSlide.caption}
                  </p>
                </div>
              </div>

              {/* 6-Slide Quick Selector Pills */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {hinge.slides.map((sl, idx) => (
                  <button
                    key={`${sl.tag}-${idx}`}
                    type="button"
                    onClick={() => setSlideIdx(idx)}
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold transition cursor-pointer ${
                      idx === safeSlideIdx
                        ? 'bg-[#18101E] text-white'
                        : 'bg-white border border-slate-200 text-[#475569]'
                    }`}
                  >
                    {idx + 1}. {sl.tag}
                  </button>
                ))}
              </div>

              {/* Hinge Vitals Card (Work, School/Major, Height, Life Stance) */}
              <div className="rounded-2xl border border-black/8 bg-white p-3 space-y-2 text-xs">
                <div className="flex flex-wrap gap-1.5 font-bold">
                  <span className="rounded-full bg-[#FFF1F2] px-2.5 py-0.5 text-[#BE123C]">
                    📏 {targetDetails.height}
                  </span>
                  <span className="rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[#92400E]">
                    ✨ {targetDetails.zodiac.split('•')[0].trim()}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[#18101E]">
                    🍸 {targetDetails.signatureDrink}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-[#E11D48] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[#18101E]">Work &amp; Field: </span>
                      <span className="font-medium text-[#334155]">
                        {hinge.jobTitle} • {hinge.fieldOfWork}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-3.5 w-3.5 text-[#7C3AED] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[#18101E]">School &amp; Major: </span>
                      <span className="font-medium text-[#334155]">{hinge.schoolAndMajor}</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-[#065F46] bg-[#ECFDF5] rounded-xl px-2.5 py-1.5">
                    🏡 {hinge.lifeStance}
                  </div>
                </div>
              </div>

              {/* Bio + 2 Fun Facts */}
              <div className="rounded-2xl border border-black/8 bg-white p-3 space-y-2 text-xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#E11D48]">
                  About {phoneTarget.name}
                </div>
                <p className="font-semibold text-[#18101E] leading-relaxed">{hinge.bio}</p>
                <div className="space-y-1 pt-1 border-t border-slate-100">
                  {hinge.funFacts.map((fact) => (
                    <div key={fact} className="text-[11px] font-medium text-[#475569]">
                      ⚡ {fact}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Hinge Prompts */}
              {hinge.prompts.map((pr) => (
                <div
                  key={pr.question}
                  className="rounded-2xl border border-black/8 bg-white p-3 space-y-1 text-xs"
                >
                  <div className="text-[10px] font-extrabold uppercase tracking-wide text-[#92400E]">
                    {pr.question}
                  </div>
                  <div className="font-bold text-[#18101E] leading-snug">{pr.answer}</div>
                </div>
              ))}
            </div>

            {/* Sticky Phone Bottom Action Dock */}
            <div className="border-t border-slate-200 bg-white px-3 py-2.5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePhonePass}
                aria-label="Pass on Phone"
                className="tinder-fab flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#FD267A]/35 bg-white text-[#FD267A] cursor-pointer"
                title="Pass"
              >
                <X className="h-5 w-5 stroke-[2.75]" />
              </button>

              <button
                type="button"
                onClick={() => handlePhoneMatch(true)}
                aria-label="Super Like on Phone"
                className="tinder-fab flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00A8FF]/40 bg-[#F0F9FF] text-[#00A8FF] cursor-pointer"
                title="Super Like"
              >
                <Star className="h-4.5 w-4.5 fill-[#00A8FF]" />
              </button>

              <button
                type="button"
                onClick={() => handlePhoneMatch(false)}
                aria-label="Match on Phone"
                className="pop-btn flex-1 h-11 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] px-3 text-xs font-extrabold text-white border-transparent inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="h-4 w-4 fill-white" />
                <span>Match {phoneTarget.name}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendToBestie(phoneTarget)}
                aria-label="Send to Bestie"
                className="pop-btn h-10 rounded-full bg-[#FFF1F2] px-3 text-[11px] font-extrabold text-[#BE123C] inline-flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Send to Bestie</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * CAST DIRECTORY: ALL 57 UNCROPPED 3:4 PROFILES (39 WOMEN & 18 CUBS)
       * ===================================================================== */}
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
              🐆 Women ({HER_ARCHETYPES.length} • Ages 30 to 64)
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
              🥂 Cubs ({HIS_ARCHETYPES.length} • Ages 21 to 33)
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
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {(castTab === 'her' ? filteredHerList : HIS_ARCHETYPES).map((item) => {
            const isSelected = castTab === 'her' ? item.id === her.id : item.id === his.id;
            const d = getProfileDetails(item);
            return (
              <div
                key={item.id}
                className={`group overflow-hidden rounded-2xl border transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#E11D48] ring-2 ring-[#E11D48]/25 bg-[#FFF5F7]'
                    : 'border-[#18101E]/12 bg-white hover:border-[#E11D48]/50 shadow-xs'
                }`}
              >
                <div>
                  <div className="relative mx-auto w-full aspect-[3/4] overflow-hidden bg-[#18101E]">
                    <img
                      src={item.photoUrl}
                      alt={`${item.name}, ${item.age}`}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                      <span className="rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-bold text-[#18101E] shadow-xs whitespace-nowrap">
                        📏 {d.height} • {d.zodiac.split('•')[0].replace(' Sun', '').trim()}
                      </span>
                      {isSelected && (
                        <span className="rounded-full bg-[#E11D48] px-2 py-0.5 text-[10px] font-extrabold text-white whitespace-nowrap">
                          ✓ Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <div className="font-display text-lg text-[#18101E]">
                      {item.name}, <span className="text-[#E11D48]">{item.age}</span>
                    </div>
                    <div className="text-xs font-bold text-[#BE123C] leading-snug">
                      {item.title}
                    </div>
                    <p className="text-xs font-medium text-[#475569] line-clamp-3 leading-relaxed">
                      {item.tagline}
                    </p>
                  </div>
                </div>

                <div className="px-3.5 pb-3.5 pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.messagePop();
                      setSlideIdx(0);
                      setMatchSplashTarget(null);
                      if (castTab === 'her') {
                        if (role === 'her') onChangeRole('him');
                        onSelectHer(item as HerArchetype);
                      } else {
                        if (role === 'him') onChangeRole('her');
                        onSelectHis(item as HisArchetype);
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`pop-btn flex-1 h-9 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#18101E] text-white'
                        : 'bg-[#E11D48] hover:bg-[#BE123C] text-white border-transparent'
                    }`}
                  >
                    {isSelected ? '✓ Loaded on Phone' : `View ${item.name} ↑`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectedProfile(item)}
                    className="pop-btn h-9 rounded-xl bg-white hover:bg-[#F8FAFC] px-2.5 text-xs font-bold text-[#18101E] whitespace-nowrap cursor-pointer"
                  >
                    6 Slides
                  </button>
                </div>
              </div>
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
          What is a Junior Cougar vs. Puma vs. Cougar vs. Jaguar? Explore the Hall-of-Fame Field Guide →
        </button>
      </div>

      {/* FULL 6-SLIDE PROFILE MODAL */}
      {inspectedProfile &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#18101E]/60 p-4 backdrop-blur-xs"
            onClick={() => setInspectedProfile(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="vice-panel max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl p-5 space-y-4 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block rounded-full bg-[#FFF1F2] px-3 py-0.5 text-xs font-bold text-[#E11D48]">
                    Verified 6-Slide Profile
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

              <div className="mx-auto w-full max-w-[280px] aspect-[3/4] overflow-hidden rounded-2xl bg-[#18101E]">
                <img
                  src={inspectedProfile.photoUrl}
                  alt={inspectedProfile.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {(() => {
                const ext = getHingeExtendedProfile(inspectedProfile);
                return (
                  <div className="space-y-2.5 text-xs text-[#18101E]">
                    <div className="rounded-xl bg-[#FAF8F9] p-3 space-y-1">
                      <div>
                        <strong>Work:</strong> {ext.jobTitle} • {ext.fieldOfWork}
                      </div>
                      <div>
                        <strong>School:</strong> {ext.schoolAndMajor}
                      </div>
                      <div>
                        <strong>Life:</strong> {ext.lifeStance}
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-[#334155]">{ext.bio}</p>
                  </div>
                );
              })()}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (HER_ARCHETYPES.some((h) => h.id === inspectedProfile.id)) {
                      if (role === 'her') onChangeRole('him');
                      onSelectHer(inspectedProfile as HerArchetype);
                    } else {
                      if (role === 'him') onChangeRole('her');
                      onSelectHis(inspectedProfile as HisArchetype);
                    }
                    setInspectedProfile(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="pop-btn flex-1 h-10 rounded-xl bg-[#E11D48] text-xs font-extrabold text-white border-transparent cursor-pointer"
                >
                  Load {inspectedProfile.name} on Phone ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleSendToBestie(inspectedProfile)}
                  className="pop-btn h-10 rounded-xl bg-[#FFF1F2] px-3 text-xs font-extrabold text-[#BE123C] cursor-pointer"
                >
                  Send to Bestie
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* CUSTOM TWISTS & VIP SCENES DRAWER */}
      {activeDrawer &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1022]/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <div className="vice-panel max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b-2 border-[#1E1022]/12 pb-4">
                <h3 className="font-display text-2xl text-[#1E1022]">
                  {activeDrawer === 'custom'
                    ? 'Customize Names, Drinks & Plot Twists'
                    : 'Select Bonus VIP Scenes'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveDrawer(null)}
                  className="pop-btn rounded-xl bg-[#FFF4F7] p-2 text-[#1E1022] cursor-pointer"
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
                        onChange={(e) =>
                          onUpdateHerCustom({ ...her, name: e.target.value || 'Claire' })
                        }
                        className="w-full rounded-xl border-2 border-[#1E1022] bg-[#FFF7F0] px-3 py-2 text-sm font-bold text-[#1E1022]"
                      />
                    </label>
                    <label className="space-y-1 text-xs font-bold text-[#1E1022]">
                      <span>Cub Custom Name</span>
                      <input
                        type="text"
                        maxLength={24}
                        value={his.name}
                        onChange={(e) =>
                          onUpdateHisCustom({ ...his, name: e.target.value || 'Leo' })
                        }
                        className="w-full rounded-xl border-2 border-[#1E1022] bg-[#FFF7F0] px-3 py-2 text-sm font-bold text-[#1E1022]"
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ['princess_treatment', 'her', '👑 Any-Age Princess Romance'],
                        ['soft_mommy_domme', 'her', '🦮 Soft Mommy-Domme "Good Boy"'],
                        ['cub_daddy_zaddy', 'his', '🥂 "Cub Daddy" Dinner Lead'],
                        ['black_cat_energy', 'her', '🐈‍⬛ Black Cat Energy'],
                        ['golden_retriever_energy', 'his', '🐕 Golden Retriever Cub'],
                        ['zero_proof_wellness', 'her', '🥤 Zero-Proof Mocktail Date'],
                        ['spontaneous_getaway', 'her', '✈️ 18h Pool & Cedar Sauna'],
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
                          onClick={() =>
                            target === 'her' ? toggleHerTag(tag) : toggleHisTag(tag)
                          }
                          className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                            active
                              ? 'border-[#1E1022] bg-[#FF2E63] text-white'
                              : 'border-[#1E1022]/20 bg-white text-[#1E1022]'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {onOpenBoutique && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDrawer(null);
                        onOpenBoutique();
                      }}
                      className="pop-btn rounded-xl bg-[#FFBE0B] px-4 py-2 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                    >
                      Open VIP Lounge ($6.99) →
                    </button>
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
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-xl border-2 border-[#1E1022] bg-[#FFBE0B] px-3 py-1.5 text-xs font-extrabold text-[#1E1022]">
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
            </div>
          </div>,
          document.body,
        )}

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </div>
  );
};
