import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Music2,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { getSwipeDeckForRole, type SwipeProfile } from '../data/appProfiles';
import type { PlayerRole } from '../domain/taxonomy';
import { playVoiceNotePreview, sfx } from '../lib/sound';

interface AppSwipeStageProps {
  role: PlayerRole;
  credits: number;
  isFounderUnlimited?: boolean;
  initialProfileIndex?: number;
  onSwipeProfile: (profileId: string, direction: 'left' | 'right') => void;
  onSpendXrayCredit: () => boolean;
  onShareDilemma: (profileId: string, headline: string) => void;
  onCompleteSwipes: () => void;
}

export const AppSwipeStage: React.FC<AppSwipeStageProps> = ({
  role,
  credits,
  isFounderUnlimited = false,
  initialProfileIndex = 0,
  onSwipeProfile,
  onSpendXrayCredit,
  onShareDilemma,
  onCompleteSwipes,
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
  const [isDragging, setIsDragging] = useState(false);
  const [flyDir, setFlyDir] = useState<'left' | 'right' | null>(null);
  const [mobileTab, setMobileTab] = useState<'photo' | 'dossier'>('photo');
  const [ageSliderOpen, setAgeSliderOpen] = useState(false);
  const [swipeFeedback, setSwipeFeedback] = useState<{ text: string; good: boolean } | null>(null);

  const [agePref, setAgePref] = useState<number>(() => (role === 'her' ? 28 : 48));
  const [sliderBanner, setSliderBanner] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const startXRef = useRef<number | null>(null);
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

  const commitSwipe = (dir: 'left' | 'right') => {
    if (flyDir) return;
    stopVoiceRef.current?.();
    setPlayingVoiceId(null);

    const isGreen = profile.isGreenFlagMatch;
    if (dir === 'right' && isGreen) {
      sfx.swipeRight();
      setSwipeFeedback({ text: `🔥 Spark Matched with ${profile.name}! +Chemistry`, good: true });
    } else if (dir === 'left' && !isGreen) {
      sfx.greenFlag();
      setSwipeFeedback({ text: `🛡️ Red Flag Dodged (${profile.name})! +Maturity`, good: true });
    } else if (dir === 'right' && !isGreen) {
      sfx.redFlag();
      setSwipeFeedback({ text: `🚩 Trap Missed! ${profile.name} had hidden red flags`, good: false });
    } else {
      sfx.swipeLeft();
      setSwipeFeedback({ text: `Passed on ${profile.name}`, good: true });
    }

    setFlyDir(dir);
    onSwipeProfile(profile.id, dir);

    window.setTimeout(() => {
      setSwipeFeedback(null);
      if (index + 1 >= deck.length) {
        onCompleteSwipes();
      } else {
        setIndex((i) => i + 1);
      }
    }, 340);
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
    lastMoveTimeRef.current = performance.now();
    velocityXRef.current = 0;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startXRef.current === null) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastMoveTimeRef.current);
    const nextDrag = e.clientX - startXRef.current;
    velocityXRef.current = (nextDrag - dragX) / dt;
    lastMoveTimeRef.current = now;
    setDragX(Math.max(-220, Math.min(220, nextDrag)));
  };

  const handlePointerUp = () => {
    if (startXRef.current === null) return;
    const finalX = dragX;
    const vx = velocityXRef.current;
    startXRef.current = null;
    setIsDragging(false);

    if (finalX > 85 || vx > 0.6) {
      commitSwipe('right');
    } else if (finalX < -85 || vx < -0.6) {
      commitSwipe('left');
    } else {
      setDragX(0);
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
          '🤠 KRISTIN CAVALLARI × MONTANA BOYZ ZONE (25+)! Unlocked Colton, 25M — 6\'3" Ranch Cowboy!',
        );
        const cowboyIdx = deck.findIndex((d) => d.id === 'colton-montana-ranch-cub');
        if (cowboyIdx >= 0) {
          setIndex(cowboyIdx);
          setPhotoIdx(0);
        }
      } else {
        setSliderBanner(`Minimum Cub Age set to ${nextVal}+ — Prime Cougars & Cubs Club pool active.`);
      }
    } else {
      if (nextVal >= 60) {
        setSliderBanner('👑 60+ ICON TIER UNLOCKED! Panthers & Silver-Braids Gallery Icons active!');
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
        setSliderBanner(`Max Discovery Age set up to ${nextVal} — Cougars & Pumas active.`);
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

  const rotationDeg = (dragX / 15).toFixed(1);
  const dragProgress = Math.min(1, Math.abs(dragX) / 90);

  return (
    <div className="mx-auto max-w-5xl space-y-3.5 animate-stage-in">
      {/* Slim Top Bar + Inline Age-Preference Control */}
      <div className="vice-panel rounded-2xl px-4 py-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E5C17B]">
              Act I • Profile {index + 1} of {deck.length}
            </span>
            <button
              type="button"
              onClick={() => setAgeSliderOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E5C17B]/35 bg-[#1E1729] px-3 py-1 text-xs font-semibold text-[#FDE68A] hover:bg-white/10 transition cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-rose-400" />
              <span>
                {role === 'her' ? `Age Filter: ${agePref}–45` : `Age Filter: 30–${agePref}`}
              </span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {role === 'her' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(25)}
                  className="rounded-full border border-[#E5C17B]/35 bg-[#E5C17B]/12 px-2.5 py-1 text-xs font-semibold text-[#FDE68A] hover:bg-[#E5C17B]/20 cursor-pointer"
                >
                  🤠 Drop to 25
                </button>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(21)}
                  className="rounded-full border border-rose-500/45 bg-rose-950/70 px-2.5 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-900/75 cursor-pointer"
                >
                  🚨 Dare: 21
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(53)}
                  className="rounded-full border border-[#E5C17B]/35 bg-[#E5C17B]/12 px-2.5 py-1 text-xs font-semibold text-[#FDE68A] cursor-pointer"
                >
                  🔥 50s Jaguars
                </button>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(64)}
                  className="rounded-full border border-[#E5C17B]/35 bg-[#E5C17B]/12 px-2.5 py-1 text-xs font-semibold text-[#FDE68A] cursor-pointer"
                >
                  👑 60+ Icons
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onCompleteSwipes}
              className="text-xs font-semibold text-stone-400 hover:text-[#FAF7F5] underline ml-1 cursor-pointer"
            >
              Skip to Date #1 →
            </button>
          </div>
        </div>

        {/* Always keep range slider accessible in DOM for instant drag & test access */}
        <div className={ageSliderOpen || sliderBanner ? 'block space-y-2' : 'block'}>
          <input
            type="range"
            aria-label="Dating app age preference slider"
            min={role === 'her' ? 21 : 38}
            max={role === 'her' ? 34 : 65}
            value={agePref}
            onChange={(e) => handleAgeSliderChange(Number(e.target.value))}
            className="w-full accent-[#E5C17B] cursor-pointer h-1.5 rounded-lg bg-[#1E1729]"
          />
          {sliderBanner && (
            <div className="rounded-xl bg-[#1E1729] border border-[#E5C17B]/30 px-3 py-1.5 text-xs font-medium text-[#FDE68A]">
              {sliderBanner}
            </div>
          )}
        </div>
      </div>

      {/* Post-Swipe Consequence Toast */}
      {swipeFeedback && (
        <div
          className={`vice-toast rounded-2xl px-4 py-2.5 text-center text-sm font-semibold shadow-xl ${
            swipeFeedback.good
              ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-200'
              : 'bg-rose-950/90 border border-rose-500/50 text-rose-200'
          }`}
        >
          {swipeFeedback.text}
        </div>
      )}

      {/* Mobile View Switcher (Keeps Phone Card Zero-Scroll!) */}
      <div className="flex lg:hidden rounded-2xl bg-[#15101C] border border-white/[0.08] p-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setMobileTab('photo')}
          className={`flex-1 rounded-xl py-2 transition cursor-pointer ${
            mobileTab === 'photo' ? 'bg-rose-600 text-[#FAF7F5]' : 'text-stone-300'
          }`}
        >
          📸 Photos ({safePhotoIdx + 1}/{totalPhotos})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('dossier')}
          className={`flex-1 rounded-xl py-2 transition cursor-pointer ${
            mobileTab === 'dossier' ? 'bg-[#E5C17B] text-[#0C0910]' : 'text-stone-300'
          }`}
        >
          💬 Bio, Prompts &amp; Voice
        </button>
      </div>

      {/* ZERO-SCROLL TWO-COLUMN SPLIT: Left = 2-Card Draggable Stack + Swipe Dock | Right = Dossier */}
      <div className="grid gap-5 lg:grid-cols-[390px_1fr] items-start">
        {/* LEFT COLUMN: 2-Card Depth Stack + Docked Pass/Date Bar */}
        <div className={`${mobileTab === 'dossier' ? 'hidden lg:block' : 'block'} space-y-3`}>
          <div className="relative">
            {/* Next Card Peeking Underneath */}
            {nextProfile && (
              <div
                aria-hidden="true"
                style={{
                  transform: `scale(${0.94 + dragProgress * 0.05}) translateY(${10 - dragProgress * 10}px)`,
                  opacity: 0.45 + dragProgress * 0.45,
                }}
                className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl border border-white/10 bg-[#15101C]"
              >
                <img
                  src={nextProfile.photos[0].photoUrl}
                  alt=""
                  className="h-full w-full object-cover object-top opacity-60"
                />
              </div>
            )}

            {/* Active Draggable Front Card */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => {
                startXRef.current = null;
                setIsDragging(false);
                setDragX(0);
              }}
              style={{
                transform:
                  flyDir === null ? `translate3d(${dragX}px, 0, 0) rotate(${rotationDeg}deg)` : undefined,
                transition: isDragging
                  ? 'none'
                  : 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className={`vice-panel relative z-10 select-none touch-pan-y overflow-hidden rounded-3xl p-3 space-y-2.5 ${
                flyDir === 'left'
                  ? 'animate-swipe-left'
                  : flyDir === 'right'
                    ? 'animate-swipe-right'
                    : ''
              }`}
            >
              {/* Proportional Drag Stamps */}
              {dragX > 24 && (
                <div
                  style={{ opacity: dragProgress, transform: `scale(${0.85 + dragProgress * 0.2}) rotate(-10deg)` }}
                  className="pointer-events-none absolute top-16 left-5 z-30 rounded-xl border-2 border-emerald-400 bg-[#0C0910]/85 px-4 py-1 font-display text-2xl text-emerald-300"
                >
                  Date 💚
                </div>
              )}
              {dragX < -24 && (
                <div
                  style={{ opacity: dragProgress, transform: `scale(${0.85 + dragProgress * 0.2}) rotate(10deg)` }}
                  className="pointer-events-none absolute top-16 right-5 z-30 rounded-xl border-2 border-rose-500 bg-[#0C0910]/85 px-4 py-1 font-display text-2xl text-rose-300"
                >
                  Pass 🚩
                </div>
              )}

              {/* Story Progress Bars + Photo Selector Pills */}
              <div className="space-y-2">
                <div
                  className="grid gap-1.5"
                  style={{ gridTemplateColumns: `repeat(${totalPhotos}, minmax(0, 1fr))` }}
                >
                  {profile.photos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Slide ${idx + 1}`}
                      onClick={() => selectPhoto(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        safePhotoIdx === idx ? 'bg-[#E5C17B]' : 'bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1 overflow-x-auto no-scrollbar rounded-xl bg-[#1E1729] p-1">
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
                          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                            safePhotoIdx === idx
                              ? ph.isRedFlagPhoto
                                ? 'bg-rose-600 text-[#FAF7F5]'
                                : 'bg-[#E5C17B] text-[#0C0910]'
                              : 'text-stone-300 hover:text-[#FAF7F5]'
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
                    className="shrink-0 inline-flex items-center gap-1 rounded-xl border border-white/12 bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-stone-200 hover:bg-white/10 cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 text-[#E5C17B]" />
                    <span>Ask Bestie</span>
                  </button>
                </div>
              </div>

              {/* Portrait Frame (Compact Height So Buttons Always Stay Visible!) */}
              <div className="relative h-[360px] sm:h-[390px] w-full overflow-hidden rounded-2xl bg-[#0C0910]">
                <img
                  src={currentPhoto.photoUrl}
                  alt={`${profile.name} ${currentPhoto.caption}`}
                  draggable={false}
                  className="h-full w-full object-cover object-top transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0910]/95 via-[#0C0910]/15 to-transparent" />

                {totalPhotos > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous photo"
                      onClick={() => selectPhoto(safePhotoIdx - 1)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[#0C0910]/65 p-2 text-white hover:bg-[#0C0910] cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next photo"
                      onClick={() => selectPhoto(safePhotoIdx + 1)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[#0C0910]/65 p-2 text-white hover:bg-[#0C0910] cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0C0910]/80 px-2.5 py-1 text-xs font-medium text-emerald-300 border border-emerald-400/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{profile.activeAgo}</span>
                  </div>
                  <span className="rounded-full bg-[#0C0910]/80 border border-[#E5C17B]/35 px-2.5 py-1 text-xs font-medium text-[#FDE68A]">
                    {profile.lookBadge}
                  </span>
                </div>

                {/* Interactive Photo #2 Tap-Directly-on-Clue Magnifier Hotspot! */}
                {safePhotoIdx >= 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentPhoto.isRedFlagPhoto) sfx.redFlag();
                      else sfx.greenFlag();
                      setClueMagnified((v) => !v);
                    }}
                    className={`animate-hotspot-ping absolute right-5 top-1/2 -translate-y-1/2 rounded-full border-2 px-3 py-1.5 text-xs font-bold shadow-xl backdrop-blur-md cursor-pointer ${
                      currentPhoto.isRedFlagPhoto
                        ? 'border-rose-400 bg-rose-600/90 text-white'
                        : 'border-emerald-300 bg-emerald-600/90 text-white'
                    }`}
                  >
                    {clueMagnified
                      ? currentPhoto.isRedFlagPhoto
                        ? '🚩 Red Flag Spotted!'
                        : '💚 Green Flag Verified!'
                      : '🔍 Tap Photo Clue'}
                  </button>
                )}

                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="font-display text-3xl text-[#FAF7F5] leading-none">
                      {profile.name}, <span className="text-[#FDE68A]">{profile.age}</span>
                    </h3>
                    <p className="mt-1 text-xs text-stone-300">
                      {profile.occupation} • {profile.height} • {profile.zodiac}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sfx.shockZoom();
                      setAgeZoomed((v) => !v);
                    }}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#E5C17B] hover:bg-[#F0CFA0] px-3 py-1.5 text-xs font-semibold text-[#0C0910] shadow cursor-pointer"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Zoom Age: {profile.age}</span>
                  </button>
                </div>
              </div>

              {/* Compact Photo Caption */}
              <div
                className={`rounded-xl px-3.5 py-2 text-xs ${
                  currentPhoto.isRedFlagPhoto
                    ? 'bg-rose-950/85 border border-rose-500/45 text-rose-200'
                    : 'bg-[#1E1729] text-stone-200'
                }`}
              >
                <span className="font-semibold text-[#FAF7F5]">{currentPhoto.caption}: </span>
                <span>{currentPhoto.vibeNote}</span>
              </div>

              {ageZoomed && (
                <div className="animate-shock-zoom rounded-2xl bg-[#E5C17B] p-3.5 text-[#0C0910]">
                  <div className="text-xs font-semibold uppercase tracking-wider">
                    🔍 Age Check: {profile.age}
                  </div>
                  <p className="mt-0.5 text-sm font-semibold">
                    {role === 'her' ? profile.ageShockQuipHer : profile.ageShockQuipHim}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Docked Swipe Action Bar (ALWAYS Visible Without Scrolling!) */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2.5">
            <button
              type="button"
              onClick={() => commitSwipe('left')}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.06] text-[15px] font-semibold text-stone-200 hover:border-rose-500/45 hover:text-rose-300 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span>Swipe Left (Pass)</span>
            </button>

            <button
              type="button"
              onClick={handleUnlockXray}
              title="Run 1-Credit Maturity X-Ray"
              className="flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-[#E5C17B]/40 bg-[#1E1729] px-3.5 text-xs font-semibold text-[#FDE68A] hover:bg-[#E5C17B]/15 transition cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span>{xrayOpen ? 'X-Ray On' : isFounderUnlimited ? 'X-Ray' : `X-Ray (1 Cr)`}</span>
            </button>

            <button
              type="button"
              onClick={() => commitSwipe('right')}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-[15px] font-semibold text-[#FAF7F5] shadow-lg transition cursor-pointer"
            >
              <Heart className="h-4 w-4" />
              <span>Swipe Right (Date)</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Cohesive Profile Dossier (Voice Note, Bio, Prompts & Red/Green Vitals) */}
        <div
          className={`${
            mobileTab === 'photo' ? 'hidden lg:block' : 'block'
          } vice-panel rounded-3xl p-5 space-y-4`}
        >
          {/* Voice Note & Opening DM */}
          <div className="rounded-2xl bg-[#1E1729] border border-[#E5C17B]/25 p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E5C17B]">
                {role === 'her' ? 'Opening Message & Voice Note' : 'Her Opening Challenge'}
              </span>
              <button
                type="button"
                onClick={handleToggleVoiceNote}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                  playingVoiceId === profile.id
                    ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-200 animate-pulse'
                    : 'bg-[#0C0910]/70 border border-[#E5C17B]/35 text-[#FDE68A] hover:bg-[#0C0910]'
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>
                  {playingVoiceId === profile.id ? 'Playing Voice Note…' : 'Hear Voice Note'}
                </span>
              </button>
            </div>
            <p className="text-[15px] leading-relaxed text-[#FAF7F5]">
              &ldquo;{profile.openingDm}&rdquo;
            </p>
          </div>

          {xrayOpen && (
            <div className="animate-stage-in rounded-2xl border border-emerald-400/45 bg-emerald-500/12 p-3.5 text-sm font-medium text-emerald-200">
              <strong className="text-emerald-300">👁️ X-Ray Scan:</strong> {profile.xrayLeak}
            </div>
          )}

          {/* Bio & Spotify */}
          <div className="rounded-2xl bg-[#1E1729] border border-white/[0.07] p-4 space-y-2.5">
            <p className="text-[15px] leading-relaxed text-stone-200">
              &ldquo;{profile.tinderBio}&rdquo;
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-[#FDE68A]">
              <Music2 className="h-3.5 w-3.5 text-rose-400" />
              <span>Anthem: {profile.spotifyAnthem}</span>
            </div>
          </div>

          {/* Unified Hinge Prompts (Matching Velvet Wells!) */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#1E1729] border border-white/[0.07] p-4 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-rose-300">
                <Sparkles className="inline h-3 w-3 mr-1 text-[#E5C17B]" />
                {profile.hingePromptQuestion}
              </div>
              <div className="text-sm leading-relaxed text-[#FAF7F5]">
                {profile.hingePromptAnswer}
              </div>
            </div>

            {profile.secondPromptQuestion && profile.secondPromptAnswer && (
              <div className="rounded-2xl bg-[#1E1729] border border-white/[0.07] p-4 space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
                  <Sparkles className="inline h-3 w-3 mr-1" />
                  {profile.secondPromptQuestion}
                </div>
                <div className="text-sm leading-relaxed text-[#FAF7F5]">
                  {profile.secondPromptAnswer}
                </div>
              </div>
            )}
          </div>

          {/* Looking For & Lifestyle Tags */}
          <div className="rounded-2xl bg-[#1E1729] border border-white/[0.07] p-4 space-y-2.5">
            <div className="text-sm">
              <span className="text-stone-400">Looking for: </span>
              <span className="font-semibold text-[#FAF7F5]">&ldquo;{profile.lookingFor}&rdquo;</span>
              <span className="block text-xs italic text-stone-400 mt-0.5">
                {profile.lookingForSubtext}
              </span>
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
                ].includes(interest);
                return (
                  <span
                    key={interest}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      red
                        ? 'bg-rose-950/75 text-rose-300 border border-rose-500/40'
                        : 'bg-white/[0.06] text-stone-200 border border-white/10'
                    }`}
                  >
                    {red ? '🚩 ' : '✨ '}
                    {interest}
                  </span>
                );
              })}
            </div>
          </div>

          {!xrayOpen && (
            <button
              type="button"
              onClick={handleUnlockXray}
              className="w-full rounded-2xl border border-dashed border-[#E5C17B]/40 bg-white/[0.02] py-2.5 text-xs font-semibold text-[#FDE68A] hover:bg-white/[0.05] transition cursor-pointer"
            >
              <Eye className="inline h-3.5 w-3.5 mr-1" />
              Run Maturity X-Ray Scan ({isFounderUnlimited ? 'FREE • ∞ Founder' : `1 Credit • ${credits} left`})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
