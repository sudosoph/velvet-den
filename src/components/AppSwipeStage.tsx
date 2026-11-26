import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flame,
  Heart,
  MessageCircle,
  Music2,
  RotateCcw,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
  Zap,
} from 'lucide-react';
import { getSwipeDeckForRole, type SwipeProfile } from '../data/appProfiles';
import type { PlayerRole } from '../domain/taxonomy';
import { playVoiceNotePreview, sfx } from '../lib/sound';
import { InGameClubAside } from './InGameClubAside';
import { SwipeOpeningChatCard } from './SceneChatInterface';

interface AppSwipeStageProps {
  role: PlayerRole;
  credits: number;
  isFounderUnlimited?: boolean;
  initialProfileIndex?: number;
  onBackToRoster?: () => void;
  onOpenLiveChat?: () => void;
  onSwipeProfile: (profileId: string, direction: 'left' | 'right') => void;
  onSpendXrayCredit: () => boolean;
  onShareDilemma: (profileId: string, headline: string) => void;
  onCompleteSwipes: () => void;
  onOpenPopTrivia?: () => void;
  onOpenChecklist?: () => void;
}

export const AppSwipeStage: React.FC<AppSwipeStageProps> = ({
  role,
  credits,
  isFounderUnlimited = false,
  initialProfileIndex = 0,
  onBackToRoster,
  onOpenLiveChat,
  onSwipeProfile,
  onSpendXrayCredit,
  onShareDilemma,
  onCompleteSwipes,
  onOpenPopTrivia,
  onOpenChecklist,
}) => {
  const deck = getSwipeDeckForRole(role);
  const [index, setIndex] = useState(() =>
    initialProfileIndex >= 0 && initialProfileIndex < deck.length ? initialProfileIndex : 0,
  );
  const [photoIdx, setPhotoIdx] = useState(0);
  const [ageZoomed, setAgeZoomed] = useState(false);
  const [clueMagnified, setClueMagnified] = useState(false);
  const [xrayOpen, setXrayOpen] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [flyDir, setFlyDir] = useState<'left' | 'right' | 'super' | null>(null);
  const [mobileTab, setMobileTab] = useState<'photo' | 'dossier'>('photo');
  const [swipeFeedback, setSwipeFeedback] = useState<{
    text: string;
    good: boolean;
    matchedName?: string;
  } | null>(null);

  const [agePref, setAgePref] = useState<number>(() => (role === 'her' ? 28 : 48));
  const [sliderBanner, setSliderBanner] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef<number>(0);
  const velocityXRef = useRef<number>(0);
  const stopVoiceRef = useRef<(() => void) | null>(null);

  const profile: SwipeProfile | undefined = deck[index];
  const nextProfile: SwipeProfile | undefined = deck[index + 1];

  useEffect(() => {
    setPhotoIdx(0);
    setAgeZoomed(false);
    setClueMagnified(false);
    setXrayOpen(false);
    setDragX(0);
    setDragY(0);
    setFlyDir(null);
    setMobileTab('photo');
    stopVoiceRef.current?.();
    setPlayingVoiceId(null);
  }, [index, role]);

  useEffect(() => {
    return () => {
      stopVoiceRef.current?.();
    };
  }, []);

  const commitSwipe = useCallback(
    (dir: 'left' | 'right' | 'super') => {
      if (!profile || flyDir) return;
      stopVoiceRef.current?.();
      setPlayingVoiceId(null);

      const logicalDir: 'left' | 'right' = dir === 'left' ? 'left' : 'right';
      const isGreen = profile.isGreenFlagMatch;

      if (dir === 'super' && isGreen) {
        sfx.victoryFanfare();
        setSwipeFeedback({
          text: `⭐ IT'S A SUPER MATCH with ${profile.name}! +Chemistry & Chivalry`,
          good: true,
          matchedName: profile.name,
        });
      } else if (logicalDir === 'right' && isGreen) {
        sfx.swipeRight();
        setSwipeFeedback({
          text: `🔥 IT'S A MATCH with ${profile.name}! +Chemistry`,
          good: true,
          matchedName: profile.name,
        });
      } else if (logicalDir === 'left' && !isGreen) {
        sfx.greenFlag();
        setSwipeFeedback({
          text: `🛡️ NOPE! Red Flag Dodged (${profile.name})! +Maturity`,
          good: true,
        });
      } else if (logicalDir === 'right' && !isGreen) {
        sfx.redFlag();
        setSwipeFeedback({
          text: `🚩 Trap Missed! ${profile.name} had hidden red flags`,
          good: false,
        });
      } else {
        sfx.swipeLeft();
        setSwipeFeedback({ text: `Passed on ${profile.name}`, good: true });
      }

      setFlyDir(dir);
      onSwipeProfile(profile.id, logicalDir);

      window.setTimeout(() => {
        if (index + 1 >= deck.length) {
          onCompleteSwipes();
        } else {
          setIndex((i) => i + 1);
        }
      }, 360);
    },
    [profile, flyDir, onSwipeProfile, index, deck.length, onCompleteSwipes],
  );

  // Desktop keyboard arrow controls (← Nope, → Like, ↑ Super Like)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        commitSwipe('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        commitSwipe('right');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        commitSwipe('super');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [commitSwipe]);

  if (!profile) {
    return null;
  }

  const totalPhotos = profile.photos.length;
  const safePhotoIdx = Math.min(photoIdx, totalPhotos - 1);
  const currentPhoto = profile.photos[safePhotoIdx];

  const selectPhoto = (nextIdx: number) => {
    const wrapped = (nextIdx + totalPhotos) % totalPhotos;
    sfx.messagePop();
    setPhotoIdx(wrapped);
  };

  const handleRewindCard = () => {
    if (index <= 0 || flyDir) return;
    sfx.messagePop();
    setSwipeFeedback({ text: '↺ Rewound previous Tinder card', good: true });
    setIndex((i) => Math.max(0, i - 1));
  };

  const handleUnlockXray = () => {
    if (xrayOpen) return;
    if (onSpendXrayCredit()) {
      sfx.greenFlag();
      setXrayOpen(true);
      setMobileTab('dossier');
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, a')) return;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    lastMoveTimeRef.current = performance.now();
    velocityXRef.current = 0;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startXRef.current === null || startYRef.current === null) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastMoveTimeRef.current);
    const nextDragX = e.clientX - startXRef.current;
    const nextDragY = e.clientY - startYRef.current;
    velocityXRef.current = (nextDragX - dragX) / dt;
    lastMoveTimeRef.current = now;
    setDragX(Math.max(-280, Math.min(280, nextDragX)));
    setDragY(Math.max(-180, Math.min(90, nextDragY)));
  };

  const handlePointerUp = () => {
    if (startXRef.current === null) return;
    const finalX = dragX;
    const finalY = dragY;
    const vx = velocityXRef.current;
    startXRef.current = null;
    startYRef.current = null;
    setIsDragging(false);

    if (finalY < -95 && Math.abs(finalX) < 90) {
      commitSwipe('super');
    } else if (finalX > 80 || vx > 0.55) {
      commitSwipe('right');
    } else if (finalX < -80 || vx < -0.55) {
      commitSwipe('left');
    } else {
      setDragX(0);
      setDragY(0);
    }
  };

  const handleAgeSliderChange = (nextVal: number) => {
    setAgePref(nextVal);
    sfx.sliderTick(nextVal);

    if (role === 'her') {
      if (nextVal <= 22) {
        setSliderBanner(
          '🚨 SUB-23 DANGER ZONE UNLOCKED! Brace for declined campus Dining Dollars & $41.63 Venmo calculators!',
        );
        const brokeIdx = deck.findIndex((d) => d.id === 'kayden-dutch-venmo-trap');
        if (brokeIdx >= 0) {
          setIndex(brokeIdx);
          setPhotoIdx(0);
        }
      } else if (nextVal <= 25) {
        setSliderBanner(
          '🤠 KRISTIN CAVALLARI × MONTANA BOYZ ZONE (25+)! Unlocked Colton, 25M • 6\'3" Ranch Cowboy!',
        );
        const cowboyIdx = deck.findIndex((d) => d.id === 'colton-montana-ranch-cub');
        if (cowboyIdx >= 0) {
          setIndex(cowboyIdx);
          setPhotoIdx(0);
        }
      } else {
        setSliderBanner(
          `Minimum Cub Age set to ${nextVal}+ • Prime Cougars & Cubs Club pool active.`,
        );
      }
    } else {
      if (nextVal >= 60) {
        setSliderBanner(
          '👑 60+ ICON TIER UNLOCKED! Panthers & Silver-Braids Gallery Icons active!',
        );
        const vivIdx = deck.findIndex((d) => d.age >= 60);
        if (vivIdx >= 0) {
          setIndex(vivIdx);
          setPhotoIdx(0);
        }
      } else if (nextVal >= 50) {
        setSliderBanner('🔥 50+ JAGUAR TIER UNLOCKED! Sommeliers & 6 AM canyon bosses active!');
        const jagIdx = deck.findIndex((d) => d.age >= 50 && d.age < 60);
        if (jagIdx >= 0) {
          setIndex(jagIdx);
          setPhotoIdx(0);
        }
      } else {
        setSliderBanner(`Max Discovery Age set up to ${nextVal} • Cougars & Pumas active.`);
      }
    }
  };

  const handleToggleVoiceNote = () => {
    if (playingVoiceId === profile.id) {
      stopVoiceRef.current?.();
      setPlayingVoiceId(null);
      return;
    }
    stopVoiceRef.current?.();
    setPlayingVoiceId(profile.id);
    const voiceStyle =
      role === 'him' ? 'her' : profile.isGreenFlagMatch ? 'green_cub' : 'trap_cub';
    stopVoiceRef.current = playVoiceNotePreview(profile.openingDm, voiceStyle, () => {
      setPlayingVoiceId((curr) => (curr === profile.id ? null : curr));
    });
  };

  const rotationDeg = (dragX / 13).toFixed(1);
  const dragProgress = Math.min(1, Math.max(Math.abs(dragX) / 85, Math.abs(dragY) / 95));
  const showLikeStamp = flyDir === 'right' || dragX > 22;
  const showNopeStamp = flyDir === 'left' || dragX < -22;
  const showSuperStamp = flyDir === 'super' || (dragY < -35 && Math.abs(dragX) < 70);

  return (
    <div className="w-full space-y-5 animate-stage-in">
      {/* =====================================================================
       * AUTHENTIC TINDER DISCOVERY BAR + PLAYABLE AGE-PREFERENCE SLIDER
       * ===================================================================== */}
      <div className="vice-panel rounded-3xl px-4 py-4 sm:px-6 space-y-3 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {onBackToRoster && (
              <button
                type="button"
                onClick={onBackToRoster}
                className="pop-btn inline-flex h-9 items-center gap-1.5 rounded-full bg-white hover:bg-[#FFF5F7] px-3 text-xs font-bold text-[#18101E] cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-[#FD267A]" />
                <span>The Roster</span>
              </button>
            )}

            <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FD267A] to-[#FF6036] px-3.5 text-xs font-extrabold tracking-tight text-white shadow-xs">
              <Flame className="h-3.5 w-3.5 fill-white" />
              <span>tinder • Card {index + 1}/{deck.length}</span>
            </span>

            <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#FD267A]/25 bg-[#FFF0F5] px-3 text-xs font-bold text-[#BE123C]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#FD267A]" />
              <span>
                {role === 'her' ? `Discovery Age: ${agePref}–45` : `Discovery Age: 30–${agePref}`}
              </span>
            </span>

            {onOpenLiveChat && (
              <button
                type="button"
                onClick={onOpenLiveChat}
                className="pop-btn inline-flex h-9 items-center gap-1.5 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] px-3 text-xs font-bold text-[#007AFF] cursor-pointer"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Open DMs</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {role === 'her' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(25)}
                  className="pop-btn h-8.5 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] px-3 text-xs font-bold text-[#92400E] cursor-pointer"
                >
                  🤠 Drop to 25 (Montana Cowboy)
                </button>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(21)}
                  className="pop-btn h-8.5 rounded-full bg-[#FFE4E6] hover:bg-[#FECDD3] px-3 text-xs font-bold text-[#BE123C] cursor-pointer"
                >
                  🚨 Drop to 21 (Danger Zone)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAgePref(21);
                    sfx.shockZoom();
                    setSliderBanner(
                      '🌺 MOM’S HAWAII TIMESHARE ALERT! Trevor (21M) just invited you to "his place in Maui"!',
                    );
                    const idx = deck.findIndex((d) => d.id === 'trevor-hawaii-timeshare-trap');
                    if (idx >= 0) {
                      setIndex(idx);
                      setPhotoIdx(0);
                    }
                  }}
                  className="pop-btn h-8.5 rounded-full bg-white hover:bg-[#F8FAFC] px-3 text-xs font-bold text-[#18101E] cursor-pointer"
                >
                  🌺 21yo Hawaii Timeshare
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(53)}
                  className="pop-btn h-8.5 rounded-full bg-[#FEF3C7] px-3 text-xs font-bold text-[#92400E] cursor-pointer"
                >
                  🔥 50s Jaguars
                </button>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(64)}
                  className="pop-btn h-8.5 rounded-full bg-[#FFE4E6] px-3 text-xs font-bold text-[#BE123C] cursor-pointer"
                >
                  👑 60+ Icons
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onCompleteSwipes}
              className="pop-btn h-8.5 rounded-full bg-[#18101E] px-3.5 text-xs font-bold text-white cursor-pointer"
            >
              Skip to Date #1 →
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            aria-label="Dating app age preference slider"
            min={role === 'her' ? 21 : 38}
            max={role === 'her' ? 34 : 65}
            value={agePref}
            onChange={(e) => handleAgeSliderChange(Number(e.target.value))}
            className="w-full accent-[#FD267A] cursor-pointer h-2 rounded-lg bg-[#FCE7F3]"
          />
          {sliderBanner && (
            <div className="rounded-2xl border border-[#FD267A]/25 bg-[#FFF5F7] px-3.5 py-2 text-xs font-bold text-[#9F1239]">
              {sliderBanner}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
       * CELEBRATORY "IT'S A MATCH!" / CONSEQUENCE BANNER
       * ===================================================================== */}
      {swipeFeedback && (
        <div
          className={`vice-toast rounded-2xl border px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm font-bold shadow-md ${
            swipeFeedback.matchedName
              ? 'border-[#21D07C] bg-gradient-to-r from-[#059669] via-[#10B981] to-[#FD267A] text-white'
              : swipeFeedback.good
                ? 'border-[#10B981]/40 bg-[#ECFDF5] text-[#065F46]'
                : 'border-[#F43F5E]/40 bg-[#FFF1F2] text-[#9F1239]'
          }`}
        >
          <span>{swipeFeedback.text}</span>
          {swipeFeedback.matchedName && onOpenLiveChat && (
            <button
              type="button"
              onClick={onOpenLiveChat}
              className="rounded-full bg-white px-3.5 py-1 text-xs font-extrabold text-[#18101E] shadow-xs hover:scale-105 transition cursor-pointer"
            >
              💬 Text {swipeFeedback.matchedName} Now →
            </button>
          )}
        </div>
      )}

      {/* Mobile View Switcher */}
      <div className="flex lg:hidden rounded-full border border-[#18101E]/12 bg-white p-1 text-sm font-bold shadow-xs">
        <button
          type="button"
          onClick={() => setMobileTab('photo')}
          className={`flex-1 rounded-full py-2 transition cursor-pointer ${
            mobileTab === 'photo'
              ? 'bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-white'
              : 'text-[#18101E]'
          }`}
        >
          🔥 Swipe Card ({safePhotoIdx + 1}/{totalPhotos})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('dossier')}
          className={`flex-1 rounded-full py-2 transition cursor-pointer ${
            mobileTab === 'dossier' ? 'bg-[#18101E] text-white' : 'text-[#18101E]'
          }`}
        >
          💬 DMs, Bio &amp; Voice
        </button>
      </div>

      {/* =====================================================================
       * TWO-COLUMN AUTHENTIC TINDER STAGE:
       * Left: Real Draggable Tinder Stack + 5 Circular Floating Action Buttons
       * Right: Opening iMessage/Discord DM + Full Profile Prompts & Clues
       * ===================================================================== */}
      <div className="grid gap-6 lg:grid-cols-[430px_1fr] items-start">
        {/* LEFT COLUMN: AUTHENTIC TINDER SWIPE STACK + 5 CIRCULAR BUTTONS */}
        <div className={`${mobileTab === 'dossier' ? 'hidden lg:block' : 'block'} space-y-4`}>
          {/* Photo Switcher Pills + Ask Bestie Bar */}
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex gap-1 overflow-x-auto no-scrollbar rounded-full border border-[#18101E]/12 bg-white p-1 shadow-2xs">
              {profile.photos.map((ph, idx) => {
                const defaultLabel =
                  idx === 0
                    ? 'Photo 1'
                    : idx === 1 && ph.isRedFlagPhoto
                      ? 'Photo 2 👀'
                      : `Photo ${idx + 1}`;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectPhoto(idx)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                      safePhotoIdx === idx
                        ? ph.isRedFlagPhoto
                          ? 'bg-[#FD267A] text-white'
                          : 'bg-[#18101E] text-white'
                        : 'text-[#475569] hover:text-[#18101E]'
                    }`}
                  >
                    {ph.shortTab || defaultLabel}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                onShareDilemma(
                  profile.id,
                  `Would you swipe right on ${profile.name} (${profile.age})?!`,
                )
              }
              className="pop-btn shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#18101E] cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-[#FD267A]" />
              <span>Ask Bestie</span>
            </button>
          </div>

          {/* 2-Card Layered Tinder Stack */}
          <div className="relative">
            {nextProfile && (
              <div
                aria-hidden="true"
                style={{
                  transform: `scale(${0.94 + dragProgress * 0.05}) translateY(${12 - dragProgress * 12}px)`,
                  opacity: 0.55 + dragProgress * 0.45,
                }}
                className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[28px] border border-black/10 bg-[#18101E] shadow-lg"
              >
                <img
                  src={nextProfile.photos[0].photoUrl}
                  alt=""
                  className="h-full w-full object-cover object-top opacity-75"
                />
              </div>
            )}

            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => {
                startXRef.current = null;
                startYRef.current = null;
                setIsDragging(false);
                setDragX(0);
                setDragY(0);
              }}
              style={{
                transform:
                  flyDir === null
                    ? `translate3d(${dragX}px, ${dragY * 0.35}px, 0) rotate(${rotationDeg}deg)`
                    : undefined,
                transition: isDragging
                  ? 'none'
                  : 'transform 0.36s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className={`relative z-10 select-none touch-pan-y overflow-hidden rounded-[28px] border border-black/15 bg-[#111827] shadow-[0_22px_48px_-14px_rgba(15,23,42,0.38)] cursor-grab active:cursor-grabbing ${
                flyDir === 'left'
                  ? 'animate-swipe-left'
                  : flyDir === 'right'
                    ? 'animate-swipe-right'
                    : flyDir === 'super'
                      ? 'animate-swipe-up'
                      : ''
              }`}
            >
              {/* BIG TILTED NEON TINDER STAMPS (LIKE / NOPE / SUPER LIKE) */}
              {showLikeStamp && (
                <div
                  style={{
                    opacity: flyDir === 'right' ? 1 : Math.max(0.35, dragProgress),
                    transform: 'rotate(-14deg)',
                  }}
                  className="pointer-events-none absolute top-14 left-6 z-30 rounded-xl border-4 border-[#21D07C] bg-black/25 backdrop-blur-[2px] px-4 py-1 text-3xl sm:text-4xl font-black tracking-widest text-[#21D07C] uppercase shadow-xl"
                >
                  LIKE
                </div>
              )}

              {showNopeStamp && (
                <div
                  style={{
                    opacity: flyDir === 'left' ? 1 : Math.max(0.35, dragProgress),
                    transform: 'rotate(14deg)',
                  }}
                  className="pointer-events-none absolute top-14 right-6 z-30 rounded-xl border-4 border-[#FD267A] bg-black/25 backdrop-blur-[2px] px-4 py-1 text-3xl sm:text-4xl font-black tracking-widest text-[#FD267A] uppercase shadow-xl"
                >
                  NOPE
                </div>
              )}

              {showSuperStamp && (
                <div
                  style={{
                    opacity: flyDir === 'super' ? 1 : Math.max(0.45, dragProgress),
                    transform: 'rotate(-6deg)',
                  }}
                  className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-xl border-4 border-[#00A8FF] bg-black/35 backdrop-blur-[2px] px-4 py-1 text-2xl sm:text-3xl font-black tracking-widest text-[#38BDF8] uppercase shadow-xl"
                >
                  SUPER LIKE ★
                </div>
              )}

              {/* Full-Bleed Tinder Portrait Frame */}
              <div className="relative h-[450px] sm:h-[490px] w-full overflow-hidden">
                <img
                  src={currentPhoto.photoUrl}
                  alt={`${profile.name} ${currentPhoto.caption}`}
                  draggable={false}
                  className="h-full w-full object-cover object-top transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/30" />

                {/* Top Tinder Story Progress Bars Inside Card */}
                <div
                  className="absolute top-3 left-3.5 right-3.5 z-20 grid gap-1.5"
                  style={{ gridTemplateColumns: `repeat(${totalPhotos}, minmax(0, 1fr))` }}
                >
                  {profile.photos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Slide ${idx + 1}`}
                      onClick={() => selectPhoto(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        safePhotoIdx === idx ? 'bg-white shadow-xs' : 'bg-white/35 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                {/* Top Status Badges Below Story Bars */}
                <div className="absolute top-7 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-1.5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-[#21D07C] animate-pulse" />
                    <span>{profile.activeAgo}</span>
                  </div>
                  <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-extrabold text-[#18101E] shadow-xs">
                    {profile.lookBadge}
                  </span>
                </div>

                {/* Left/Right Photo Navigation Arrows */}
                {totalPhotos > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous photo"
                      onClick={() => selectPhoto(safePhotoIdx - 1)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/45 hover:bg-black/70 p-2 text-white backdrop-blur-xs transition cursor-pointer"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next photo"
                      onClick={() => selectPhoto(safePhotoIdx + 1)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/45 hover:bg-black/70 p-2 text-white backdrop-blur-xs transition cursor-pointer"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Magnify Red/Green Photo Clue Hotspot */}
                {safePhotoIdx >= 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentPhoto.isRedFlagPhoto) sfx.redFlag();
                      else sfx.greenFlag();
                      setClueMagnified((v) => !v);
                    }}
                    className={`animate-hotspot-ping absolute right-4 top-16 z-20 rounded-full px-3.5 py-1.5 text-xs font-extrabold shadow-xl cursor-pointer ${
                      currentPhoto.isRedFlagPhoto
                        ? 'bg-[#FD267A] text-white'
                        : 'bg-[#21D07C] text-[#052E16]'
                    }`}
                  >
                    {clueMagnified
                      ? currentPhoto.isRedFlagPhoto
                        ? '🚩 Red Flag Spotted!'
                        : '💚 Green Flag Verified!'
                      : '🔍 Tap Photo Clue'}
                  </button>
                )}

                {/* Authentic Tinder Bottom Identity Overlay + Caption */}
                <div className="absolute inset-x-4 bottom-3.5 z-20 space-y-2.5 text-white">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-3xl sm:text-[34px] text-white leading-none tracking-tight">
                          {profile.name}{' '}
                          <span className="font-semibold text-white/90">{profile.age}</span>
                        </h3>
                        <BadgeCheck className="h-6 w-6 fill-[#1786FF] text-white shrink-0" />
                      </div>
                      <p className="mt-1 text-xs sm:text-sm font-semibold text-white/90">
                        {profile.occupation} • {profile.height} • {profile.zodiac}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sfx.shockZoom();
                        setAgeZoomed((v) => !v);
                      }}
                      className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white/95 hover:bg-[#FEF3C7] px-3 py-1.5 text-xs font-extrabold text-[#18101E] shadow-md cursor-pointer transition"
                    >
                      <Search className="h-3.5 w-3.5 text-[#FD267A]" />
                      <span>Zoom Age: {profile.age}</span>
                    </button>
                  </div>

                  {/* Photo Caption Pill Right on the Card */}
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-medium leading-snug backdrop-blur-md ${
                      currentPhoto.isRedFlagPhoto
                        ? 'bg-[#FD267A]/90 text-white'
                        : 'bg-white/15 text-white/95 border border-white/15'
                    }`}
                  >
                    <span className="font-extrabold">{currentPhoto.caption}: </span>
                    <span>{currentPhoto.vibeNote}</span>
                  </div>
                </div>
              </div>

              {ageZoomed && (
                <div className="animate-shock-zoom border-t border-white/15 bg-[#FEF3C7] p-4 text-[#18101E]">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#B45309]">
                    🔍 Birth-Year Reality Check • Age {profile.age}
                  </div>
                  <p className="mt-1 text-sm sm:text-base font-bold leading-snug">
                    {role === 'her' ? profile.ageShockQuipHer : profile.ageShockQuipHim}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* =================================================================
           * ICONIC 5-BUTTON CIRCULAR TINDER FLOATING ACTION BAR
           * Rewind (↺) • NOPE (✕) • SUPER LIKE (★) • LIKE (♥) • X-RAY (⚡)
           * ================================================================= */}
          <div className="pt-1 flex items-center justify-center gap-3 sm:gap-4">
            {/* 1. Rewind */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={handleRewindCard}
                disabled={index === 0}
                aria-label="Rewind previous profile"
                title="Rewind previous card"
                className="tinder-fab flex h-12 w-12 items-center justify-center rounded-full border border-[#F59E0B]/35 bg-white text-[#F59E0B] shadow-[0_8px_20px_-4px_rgba(245,158,11,0.28)] disabled:opacity-40 cursor-pointer"
              >
                <RotateCcw className="h-5 w-5 stroke-[2.5]" />
              </button>
              <span className="text-[10px] font-bold text-[#64748B]">Rewind</span>
            </div>

            {/* 2. NOPE (Big Red X) */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => commitSwipe('left')}
                aria-label="Swipe Left (Pass)"
                title="NOPE (Left Arrow)"
                className="tinder-fab flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#FD267A]/30 bg-white text-[#FD267A] shadow-[0_12px_26px_-6px_rgba(253,38,122,0.35)] hover:bg-[#FFF0F5] cursor-pointer"
              >
                <X className="h-8 w-8 stroke-[3]" />
              </button>
              <span className="text-[11px] font-extrabold text-[#FD267A]">Nope</span>
            </div>

            {/* 3. SUPER LIKE (Blue Star) */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => commitSwipe('super')}
                aria-label="Super Like"
                title="SUPER LIKE (Up Arrow)"
                className="tinder-fab flex h-13.5 w-13.5 items-center justify-center rounded-full border border-[#00A8FF]/35 bg-white text-[#00A8FF] shadow-[0_10px_22px_-5px_rgba(0,168,255,0.34)] hover:bg-[#F0F9FF] cursor-pointer"
              >
                <Star className="h-6 w-6 fill-[#00A8FF] stroke-[#00A8FF]" />
              </button>
              <span className="text-[10px] font-extrabold text-[#0284C7]">Super Like</span>
            </div>

            {/* 4. LIKE (Big Emerald Heart) */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => commitSwipe('right')}
                aria-label="Swipe Right (Date)"
                title="LIKE (Right Arrow)"
                className="tinder-fab flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#10B981] to-[#21D07C] text-white shadow-[0_12px_26px_-6px_rgba(33,208,124,0.45)] cursor-pointer"
              >
                <Heart className="h-8 w-8 fill-white stroke-white" />
              </button>
              <span className="text-[11px] font-extrabold text-[#059669]">Like</span>
            </div>

            {/* 5. BOOST / X-RAY SCAN */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={handleUnlockXray}
                aria-label="Maturity X-Ray Scan"
                title="Run 1-Credit Maturity X-Ray"
                className={`tinder-fab flex h-12 w-12 items-center justify-center rounded-full border shadow-[0_8px_20px_-4px_rgba(168,85,247,0.32)] cursor-pointer ${
                  xrayOpen
                    ? 'border-[#A855F7] bg-[#A855F7] text-white'
                    : 'border-[#A855F7]/35 bg-white text-[#9333EA] hover:bg-[#FAF5FF]'
                }`}
              >
                <Zap className="h-5 w-5 fill-current" />
              </button>
              <span className="text-[10px] font-bold text-[#7E22CE]">
                {xrayOpen ? 'X-Ray On' : isFounderUnlimited ? 'X-Ray' : 'X-Ray 1Cr'}
              </span>
            </div>
          </div>

          <p className="text-center text-[11px] font-semibold text-[#64748B]">
            Drag card or press <kbd className="rounded bg-white px-1.5 py-0.5 border border-black/10">←</kbd> Nope •{' '}
            <kbd className="rounded bg-white px-1.5 py-0.5 border border-black/10">↑</kbd> Super Like •{' '}
            <kbd className="rounded bg-white px-1.5 py-0.5 border border-black/10">→</kbd> Like
          </p>
        </div>

        {/* RIGHT COLUMN: Native iMessage/Discord Opening DM + Clean Tinder Profile Prompts */}
        <div
          className={`${
            mobileTab === 'photo' ? 'hidden lg:block' : 'block'
          } vice-panel rounded-3xl p-5 sm:p-6 space-y-4 bg-white`}
        >
          <SwipeOpeningChatCard
            profile={profile}
            role={role}
            isPlayingVoice={playingVoiceId === profile.id}
            onToggleVoice={handleToggleVoiceNote}
          />

          {xrayOpen && (
            <div className="animate-stage-in rounded-2xl border border-[#10B981]/40 bg-[#ECFDF5] p-4 text-sm sm:text-base font-semibold text-[#065F46]">
              <strong>⚡ Maturity X-Ray Scan:</strong> {profile.xrayLeak}
            </div>
          )}

          <div className="rounded-2xl border border-[#18101E]/10 bg-[#FAF8F9] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FD267A]">
                Profile Bio
              </span>
              <span className="rounded-full bg-white border border-[#18101E]/10 px-3 py-0.5 text-xs font-bold text-[#18101E]">
                🎯 {profile.lookingFor}
              </span>
            </div>

            <p className="text-sm sm:text-base font-medium leading-relaxed text-[#18101E]">
              &ldquo;{profile.tinderBio}&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1DB954]/30 bg-[#F0FDF4] px-3 py-1 text-xs font-bold text-[#15803D]">
                <Music2 className="h-3.5 w-3.5 text-[#1DB954]" />
                <span>Spotify Anthem: {profile.spotifyAnthem}</span>
              </span>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 items-stretch">
            <div className="rounded-2xl border border-[#18101E]/10 bg-white p-4 space-y-1.5 shadow-2xs">
              <div className="text-xs font-extrabold uppercase tracking-wide text-[#E11D48]">
                <Sparkles className="inline h-3.5 w-3.5 mr-1 text-[#F59E0B]" />
                {profile.hingePromptQuestion}
              </div>
              <div className="text-sm sm:text-[15px] font-semibold leading-relaxed text-[#18101E]">
                {profile.hingePromptAnswer}
              </div>
            </div>

            {profile.secondPromptQuestion && profile.secondPromptAnswer && (
              <div className="rounded-2xl border border-[#18101E]/10 bg-white p-4 space-y-1.5 shadow-2xs">
                <div className="text-xs font-extrabold uppercase tracking-wide text-[#B45309]">
                  <Sparkles className="inline h-3.5 w-3.5 mr-1 text-[#FD267A]" />
                  {profile.secondPromptQuestion}
                </div>
                <div className="text-sm sm:text-[15px] font-semibold leading-relaxed text-[#18101E]">
                  {profile.secondPromptAnswer}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((interest) => {
              const red = [
                'Nightlife',
                'Tequila',
                'Clubs',
                'Bottle Service',
                'Crypto',
                'VIP Tables',
                'Yachts',
                'Maui Timeshares',
                'Mom’s Airline Miles',
                'Going Dutch',
                'Pine Pollen',
                '2 AM Voice Notes',
              ].includes(interest);
              return (
                <span
                  key={interest}
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${
                    red
                      ? 'border-[#F43F5E]/35 bg-[#FFF1F2] text-[#BE123C]'
                      : 'border-[#18101E]/12 bg-white text-[#18101E]'
                  }`}
                >
                  {red ? '🚩 ' : '✨ '}
                  {interest}
                </span>
              );
            })}
          </div>

          {!xrayOpen && (
            <button
              type="button"
              onClick={handleUnlockXray}
              className="pop-btn w-full rounded-2xl bg-gradient-to-r from-[#9333EA] to-[#EC4899] py-3 text-xs sm:text-sm font-extrabold text-white border-transparent cursor-pointer"
            >
              <Eye className="inline h-4 w-4 mr-1.5" />
              Run Maturity X-Ray Scan (
              {isFounderUnlimited ? 'FREE • ∞ Founder' : `1 Credit • ${credits} left`})
            </button>
          )}

          {/* Embedded In-Game Viral & Pop-Culture Aside */}
          <InGameClubAside
            key={profile.id}
            seedKey={profile.id}
            matchedEpisodeId={
              profile.id === 'trevor-hawaii-timeshare-trap'
                ? 'parents-hawaii-timeshare-flex-trap'
                : undefined
            }
            onOpenFullTrivia={onOpenPopTrivia}
            onOpenFullChecklist={onOpenChecklist}
          />
        </div>
      </div>
    </div>
  );
};
