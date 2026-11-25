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
    <div className="w-full space-y-5 animate-stage-in">
      {/* Aligned Age-Preference Slider Bar */}
      <div className="vice-panel rounded-3xl px-5 py-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3 py-1 text-xs font-extrabold text-[#1E1022]">
              Act I • Profile {index + 1} of {deck.length}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1E1022] bg-[#FFF4F7] px-3 py-1 text-xs font-extrabold text-[#1E1022]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#FF2E63]" />
              <span>
                {role === 'her' ? `Age Filter: ${agePref}–45` : `Age Filter: 30–${agePref}`}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {role === 'her' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(25)}
                  className="pop-btn rounded-full bg-[#FFBE0B] px-3 py-1 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                >
                  🤠 Drop to 25 (Montana Cowboy)
                </button>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(21)}
                  className="pop-btn rounded-full bg-[#FF2E63] px-3 py-1 text-xs font-extrabold text-white cursor-pointer"
                >
                  🚨 Drop to 21 (Danger Zone)
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(53)}
                  className="pop-btn rounded-full bg-[#FFBE0B] px-3 py-1 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                >
                  🔥 50s Jaguars
                </button>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(64)}
                  className="pop-btn rounded-full bg-[#FF2E63] px-3 py-1 text-xs font-extrabold text-white cursor-pointer"
                >
                  👑 60+ Icons
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onCompleteSwipes}
              className="text-xs font-extrabold text-[#1E1022] hover:text-[#FF2E63] underline ml-1 cursor-pointer"
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
            className="w-full accent-[#FF2E63] cursor-pointer h-2 rounded-lg bg-[#FFF4F7]"
          />
          {sliderBanner && (
            <div className="rounded-xl border-2 border-[#1E1022] bg-[#FFFBEB] px-3.5 py-2 text-xs font-extrabold text-[#1E1022]">
              {sliderBanner}
            </div>
          )}
        </div>
      </div>

      {/* Post-Swipe Consequence Toast */}
      {swipeFeedback && (
        <div
          className={`vice-toast rounded-2xl border-2 border-[#1E1022] px-4 py-3 text-center text-sm font-extrabold shadow-[4px_4px_0px_#1E1022] ${
            swipeFeedback.good ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FFE4E6] text-[#9F1239]'
          }`}
        >
          {swipeFeedback.text}
        </div>
      )}

      {/* Mobile View Switcher */}
      <div className="flex lg:hidden rounded-2xl border-2 border-[#1E1022] bg-white p-1 text-sm font-extrabold shadow-[3px_3px_0px_#1E1022]">
        <button
          type="button"
          onClick={() => setMobileTab('photo')}
          className={`flex-1 rounded-xl py-2 transition cursor-pointer ${
            mobileTab === 'photo' ? 'bg-[#FF2E63] text-white' : 'text-[#1E1022]'
          }`}
        >
          📸 Photos ({safePhotoIdx + 1}/{totalPhotos})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('dossier')}
          className={`flex-1 rounded-xl py-2 transition cursor-pointer ${
            mobileTab === 'dossier' ? 'bg-[#FFBE0B] text-[#1E1022]' : 'text-[#1E1022]'
          }`}
        >
          💬 Bio, Prompts &amp; Voice
        </button>
      </div>

      {/* STRICTLY ALIGNED TWO-COLUMN SPLIT */}
      <div className="grid gap-6 lg:grid-cols-[410px_1fr] items-start">
        {/* LEFT COLUMN: 2-Card Draggable Stack + Swipe Dock */}
        <div className={`${mobileTab === 'dossier' ? 'hidden lg:block' : 'block'} space-y-3.5`}>
          <div className="relative">
            {nextProfile && (
              <div
                aria-hidden="true"
                style={{
                  transform: `scale(${0.95 + dragProgress * 0.04}) translateY(${8 - dragProgress * 8}px)`,
                  opacity: 0.5 + dragProgress * 0.4,
                }}
                className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl border-2 border-[#1E1022] bg-[#FFF4F7]"
              >
                <img
                  src={nextProfile.photos[0].photoUrl}
                  alt=""
                  className="h-full w-full object-cover object-top opacity-65"
                />
              </div>
            )}

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
              className={`vice-panel relative z-10 select-none touch-pan-y overflow-hidden rounded-3xl p-3.5 space-y-3 ${
                flyDir === 'left'
                  ? 'animate-swipe-left'
                  : flyDir === 'right'
                    ? 'animate-swipe-right'
                    : ''
              }`}
            >
              {dragX > 24 && (
                <div
                  style={{ opacity: dragProgress, transform: `scale(${0.85 + dragProgress * 0.2}) rotate(-10deg)` }}
                  className="pointer-events-none absolute top-16 left-5 z-30 rounded-xl border-2 border-[#1E1022] bg-[#D1FAE5] px-4 py-1 font-display text-2xl text-[#065F46] shadow-lg"
                >
                  Date 💚
                </div>
              )}
              {dragX < -24 && (
                <div
                  style={{ opacity: dragProgress, transform: `scale(${0.85 + dragProgress * 0.2}) rotate(10deg)` }}
                  className="pointer-events-none absolute top-16 right-5 z-30 rounded-xl border-2 border-[#1E1022] bg-[#FFE4E6] px-4 py-1 font-display text-2xl text-[#9F1239] shadow-lg"
                >
                  Pass 🚩
                </div>
              )}

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
                      className={`h-2 rounded-full border border-[#1E1022] transition-all cursor-pointer ${
                        safePhotoIdx === idx ? 'bg-[#FF2E63]' : 'bg-[#FFF4F7]'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1 overflow-x-auto no-scrollbar rounded-xl border-2 border-[#1E1022] bg-[#FFF7F0] p-1">
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
                          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-extrabold transition cursor-pointer ${
                            safePhotoIdx === idx
                              ? ph.isRedFlagPhoto
                                ? 'bg-[#FF2E63] text-white'
                                : 'bg-[#FFBE0B] text-[#1E1022]'
                              : 'text-[#1E1022] hover:bg-white'
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
                    className="pop-btn shrink-0 inline-flex items-center gap-1 rounded-xl bg-white px-2.5 py-1 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 text-[#FF2E63]" />
                    <span>Ask Bestie</span>
                  </button>
                </div>
              </div>

              {/* Portrait Frame */}
              <div className="relative h-[360px] sm:h-[390px] w-full overflow-hidden rounded-2xl border-2 border-[#1E1022] bg-[#1E1022]">
                <img
                  src={currentPhoto.photoUrl}
                  alt={`${profile.name} ${currentPhoto.caption}`}
                  draggable={false}
                  className="h-full w-full object-cover object-top transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1022]/95 via-[#1E1022]/15 to-transparent" />

                {totalPhotos > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous photo"
                      onClick={() => selectPhoto(safePhotoIdx - 1)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full border-2 border-[#1E1022] bg-white p-2 text-[#1E1022] hover:bg-[#FFBE0B] cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next photo"
                      onClick={() => selectPhoto(safePhotoIdx + 1)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full border-2 border-[#1E1022] bg-white p-2 text-[#1E1022] hover:bg-[#FFBE0B] cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5">
                  <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1E1022] bg-white px-2.5 py-1 text-xs font-extrabold text-[#065F46]">
                    <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>{profile.activeAgo}</span>
                  </div>
                  <span className="rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-2.5 py-1 text-xs font-extrabold text-[#1E1022]">
                    {profile.lookBadge}
                  </span>
                </div>

                {safePhotoIdx >= 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentPhoto.isRedFlagPhoto) sfx.redFlag();
                      else sfx.greenFlag();
                      setClueMagnified((v) => !v);
                    }}
                    className={`animate-hotspot-ping absolute right-5 top-1/2 -translate-y-1/2 rounded-full border-2 border-[#1E1022] px-3 py-1.5 text-xs font-extrabold shadow-xl cursor-pointer ${
                      currentPhoto.isRedFlagPhoto
                        ? 'bg-[#FF2E63] text-white'
                        : 'bg-[#FFBE0B] text-[#1E1022]'
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
                    <h3 className="font-display text-3xl text-white leading-none">
                      {profile.name}, <span className="text-[#FFBE0B]">{profile.age}</span>
                    </h3>
                    <p className="mt-1 text-xs font-bold text-white/90">
                      {profile.occupation} • {profile.height} • {profile.zodiac}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sfx.shockZoom();
                      setAgeZoomed((v) => !v);
                    }}
                    className="pop-btn inline-flex items-center gap-1 rounded-xl bg-[#FFBE0B] px-3 py-1.5 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Zoom Age: {profile.age}</span>
                  </button>
                </div>
              </div>

              <div
                className={`rounded-xl border-2 border-[#1E1022] px-3.5 py-2 text-xs font-bold ${
                  currentPhoto.isRedFlagPhoto
                    ? 'bg-[#FFE4E6] text-[#9F1239]'
                    : 'bg-[#FFF7F0] text-[#1E1022]'
                }`}
              >
                <span className="font-extrabold">{currentPhoto.caption}: </span>
                <span>{currentPhoto.vibeNote}</span>
              </div>

              {ageZoomed && (
                <div className="animate-shock-zoom rounded-2xl border-2 border-[#1E1022] bg-[#FFBE0B] p-3.5 text-[#1E1022]">
                  <div className="text-xs font-extrabold uppercase tracking-wide">
                    🔍 Age Check: {profile.age}
                  </div>
                  <p className="mt-0.5 text-sm font-bold">
                    {role === 'her' ? profile.ageShockQuipHer : profile.ageShockQuipHim}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Docked Swipe Action Bar */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2.5">
            <button
              type="button"
              onClick={() => commitSwipe('left')}
              className="pop-btn flex h-12 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-extrabold text-[#1E1022] hover:bg-[#FFE4E6] cursor-pointer"
            >
              <X className="h-4 w-4 text-[#FF2E63]" />
              <span>Swipe Left (Pass)</span>
            </button>

            <button
              type="button"
              onClick={handleUnlockXray}
              title="Run 1-Credit Maturity X-Ray"
              className="pop-btn flex h-12 items-center justify-center gap-1.5 rounded-2xl bg-[#FFBE0B] px-3.5 text-xs font-extrabold text-[#1E1022] cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span>{xrayOpen ? 'X-Ray On' : isFounderUnlimited ? 'X-Ray' : 'X-Ray (1 Cr)'}</span>
            </button>

            <button
              type="button"
              onClick={() => commitSwipe('right')}
              className="pop-btn flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#FF2E63] text-sm font-extrabold text-white cursor-pointer"
            >
              <Heart className="h-4 w-4 fill-white" />
              <span>Swipe Right (Date)</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Cohesive Pop-Art Profile Dossier */}
        <div
          className={`${
            mobileTab === 'photo' ? 'hidden lg:block' : 'block'
          } vice-panel rounded-3xl p-6 space-y-4`}
        >
          <div className="rounded-2xl border-2 border-[#1E1022] bg-[#FFF4F7] p-4 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wide text-[#D90452]">
                {role === 'her' ? 'Opening Message & Voice Note' : 'Her Opening Challenge'}
              </span>
              <button
                type="button"
                onClick={handleToggleVoiceNote}
                className={`pop-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-extrabold cursor-pointer ${
                  playingVoiceId === profile.id
                    ? 'bg-[#FF2E63] text-white'
                    : 'bg-[#FFBE0B] text-[#1E1022]'
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>
                  {playingVoiceId === profile.id ? 'Playing Voice Note…' : '🔊 Hear Voice Note'}
                </span>
              </button>
            </div>
            <p className="text-[15px] font-bold leading-relaxed text-[#1E1022]">
              &ldquo;{profile.openingDm}&rdquo;
            </p>
          </div>

          {xrayOpen && (
            <div className="animate-stage-in rounded-2xl border-2 border-[#1E1022] bg-[#D1FAE5] p-4 text-sm font-bold text-[#065F46]">
              <strong>👁️ X-Ray Scan:</strong> {profile.xrayLeak}
            </div>
          )}

          <div className="rounded-2xl border-2 border-[#1E1022]/15 bg-[#FFF7F0] p-4 space-y-2.5">
            <p className="text-[15px] font-medium leading-relaxed text-[#34223B]">
              &ldquo;{profile.tinderBio}&rdquo;
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#1E1022] bg-white px-3 py-1 text-xs font-extrabold text-[#1E1022]">
              <Music2 className="h-3.5 w-3.5 text-[#FF2E63]" />
              <span>Anthem: {profile.spotifyAnthem}</span>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 items-stretch">
            <div className="rounded-2xl border-2 border-[#1E1022]/15 bg-white p-4 space-y-1">
              <div className="text-xs font-extrabold uppercase text-[#D90452]">
                <Sparkles className="inline h-3.5 w-3.5 mr-1 text-[#FFBE0B]" />
                {profile.hingePromptQuestion}
              </div>
              <div className="text-sm font-semibold leading-relaxed text-[#1E1022]">
                {profile.hingePromptAnswer}
              </div>
            </div>

            {profile.secondPromptQuestion && profile.secondPromptAnswer && (
              <div className="rounded-2xl border-2 border-[#1E1022]/15 bg-white p-4 space-y-1">
                <div className="text-xs font-extrabold uppercase text-[#B45309]">
                  <Sparkles className="inline h-3.5 w-3.5 mr-1 text-[#FF2E63]" />
                  {profile.secondPromptQuestion}
                </div>
                <div className="text-sm font-semibold leading-relaxed text-[#1E1022]">
                  {profile.secondPromptAnswer}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border-2 border-[#1E1022]/15 bg-[#FFFBEB] p-4 space-y-2.5">
            <div className="text-sm">
              <span className="font-bold text-[#5A4664]">Looking for: </span>
              <span className="font-extrabold text-[#1E1022]">&ldquo;{profile.lookingFor}&rdquo;</span>
              <span className="block text-xs italic font-semibold text-[#5A4664] mt-0.5">
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
                    className={`rounded-full border border-[#1E1022] px-3 py-1 text-xs font-extrabold ${
                      red ? 'bg-[#FFE4E6] text-[#9F1239]' : 'bg-white text-[#1E1022]'
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
              className="pop-btn w-full rounded-2xl bg-[#FFBE0B] py-3 text-sm font-extrabold text-[#1E1022] cursor-pointer"
            >
              <Eye className="inline h-4 w-4 mr-1" />
              Run Maturity X-Ray Scan ({isFounderUnlimited ? 'FREE • ∞ Founder' : `1 Credit • ${credits} left`})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
