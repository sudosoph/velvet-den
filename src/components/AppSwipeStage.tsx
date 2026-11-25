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
import { getSwipeDeckForRole } from '../data/appProfiles';
import type { PlayerRole } from '../domain/taxonomy';
import { playVoiceNotePreview, sfx } from '../lib/sound';

interface AppSwipeStageProps {
  role: PlayerRole;
  credits: number;
  isFounderUnlimited?: boolean;
  initialProfileIndex?: number;
  onSpendXrayCredit: () => boolean;
  onSwipeProfile: (profileId: string, direction: 'left' | 'right') => void;
  onShareDilemma: (id: string, title: string) => void;
  onCompleteSwipes: () => void;
}

export const AppSwipeStage: React.FC<AppSwipeStageProps> = ({
  role,
  credits,
  isFounderUnlimited = false,
  initialProfileIndex = 0,
  onSpendXrayCredit,
  onSwipeProfile,
  onShareDilemma,
  onCompleteSwipes,
}) => {
  const deck = getSwipeDeckForRole(role);
  const [index, setIndex] = useState(
    initialProfileIndex >= 0 && initialProfileIndex < deck.length ? initialProfileIndex : 0,
  );
  const [photoIdx, setPhotoIdx] = useState<number>(0);
  const [ageZoomed, setAgeZoomed] = useState(false);
  const [xrayUnlockedIds, setXrayUnlockedIds] = useState<string[]>([]);
  const [dragX, setDragX] = useState(0);
  const [flyDir, setFlyDir] = useState<'left' | 'right' | null>(null);
  const [agePref, setAgePref] = useState<number>(role === 'her' ? 26 : 52);
  const [sliderBanner, setSliderBanner] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const stopVoiceRef = useRef<(() => void) | null>(null);
  const startXRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopVoiceRef.current?.();
    };
  }, []);

  const profile = deck[index];

  if (!profile) {
    return null;
  }

  const totalPhotos = profile.photos.length;
  const safePhotoIdx = photoIdx < totalPhotos ? photoIdx : 0;
  const currentPhoto = profile.photos[safePhotoIdx];
  const xrayOpen = xrayUnlockedIds.includes(profile.id);

  const selectPhoto = (nextIdx: number) => {
    const wrapped = (nextIdx + totalPhotos) % totalPhotos;
    const target = profile.photos[wrapped];
    if (target?.isRedFlagPhoto) sfx.redFlag();
    else sfx.messagePop();
    setPhotoIdx(wrapped);
  };

  const commitSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      sfx.swipeRight();
    } else {
      sfx.swipeLeft();
    }
    onSwipeProfile(profile.id, direction);
    setDragX(0);
    setFlyDir(null);
    setPhotoIdx(0);
    setAgeZoomed(false);
    if (index + 1 >= deck.length) {
      onCompleteSwipes();
    } else {
      setIndex(index + 1);
    }
  };

  const handleUnlockXray = () => {
    if (xrayOpen) return;
    if (onSpendXrayCredit()) {
      sfx.hotspotFix();
      setXrayUnlockedIds((prev) => [...prev, profile.id]);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    startXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startXRef.current === null) return;
    const dx = e.clientX - startXRef.current;
    setDragX(Math.max(-160, Math.min(160, dx)));
  };

  const handlePointerUp = () => {
    if (startXRef.current === null) return;
    startXRef.current = null;
    if (dragX > 95) {
      setFlyDir('right');
      window.setTimeout(() => commitSwipe('right'), 180);
    } else if (dragX < -95) {
      setFlyDir('left');
      window.setTimeout(() => commitSwipe('left'), 180);
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
          '🚨 SUB-23 DANGER ZONE UNLOCKED! Broke college "Go-Dutch" Venmo-calculator students (Kayden, 21) have entered your feed!',
        );
        const kaydenIdx = deck.findIndex((d) => d.id === 'kayden-dutch-venmo-trap');
        if (kaydenIdx >= 0) {
          setIndex(kaydenIdx);
          setPhotoIdx(0);
        }
      } else if (nextVal <= 25) {
        setSliderBanner(
          '🤠 KRISTIN CAVALLARI × MONTANA BOYZ ZONE (25+)! Unlocked Colton, 25M—6\'3" Montana ranch cowboy!',
        );
        const coltonIdx = deck.findIndex((d) => d.id === 'colton-montana-ranch-cub');
        if (coltonIdx >= 0) {
          setIndex(coltonIdx);
          setPhotoIdx(0);
        }
      } else if (nextVal >= 30) {
        setSliderBanner(
          '🥂 SAFE 30+ CUB FILTER: Showing sports-medicine fellows & established 30s Cubs first!',
        );
        const lucasIdx = deck.findIndex((d) => d.age >= 30);
        if (lucasIdx >= 0) {
          setIndex(lucasIdx);
          setPhotoIdx(0);
        }
      } else {
        setSliderBanner(`🎚️ Minimum Cub Age set to ${nextVal}+ — Prime Cougars & Cubs Club pool active.`);
      }
    } else {
      if (nextVal >= 60) {
        setSliderBanner(
          '👑 60+ PANTHER ICON TIER UNLOCKED! Silver-braided & desert-modernist legends active!',
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
        setSliderBanner(`🎚️ Max Discovery Age set up to ${nextVal} — Cougars & Pumas active.`);
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

  const rotationDeg = (dragX / 18).toFixed(1);

  return (
    <div className="mx-auto max-w-xl space-y-4 animate-stage-in">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="rounded bg-rose-500/25 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-rose-300">
            Act I • Cougars &amp; Cubs Club Swipe Deck ({index + 1} / {deck.length})
          </span>
          <h2 className="mt-1 font-display text-3xl text-white">
            {role === 'her'
              ? 'Slide Your Age Filter & Vet Every Photo Before Swiping!'
              : 'Raise Your Max Age Filter & Browse Cougars, Jaguars & Pumas!'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCompleteSwipes}
          className="text-xs font-bold underline text-slate-400 hover:text-white cursor-pointer"
        >
          Skip to Date #1 →
        </button>
      </div>

      {/* Playable Dating-App Age-Preference Slider (Kristin Cavallari × Montana Boyz + Sub-23 Danger Zone!) */}
      <div className="vice-panel rounded-2xl bg-gradient-to-r from-[#241038] via-[#17112b] to-[#161026] p-3.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 font-extrabold uppercase tracking-wider text-amber-300">
            <SlidersHorizontal className="h-3.5 w-3.5 text-pink-300" />
            {role === 'her'
              ? `App Age Settings: Men ${agePref} – 45`
              : `App Age Settings: Women 30 – ${agePref}`}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {role === 'her' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(25)}
                  className="rounded-full border border-amber-300/50 bg-amber-400/20 px-2.5 py-0.5 text-xs font-extrabold text-amber-200 hover:bg-amber-400/35 cursor-pointer"
                >
                  🤠 Drop to 25 (Montana Cowboy!)
                </button>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(21)}
                  className="rounded-full border border-rose-400/60 bg-rose-500/25 px-2.5 py-0.5 text-xs font-extrabold text-rose-200 hover:bg-rose-500/40 cursor-pointer"
                >
                  🚨 Dare: 21 (Broke Dutch Trap!)
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(53)}
                  className="rounded-full border border-amber-300/50 bg-amber-400/20 px-2.5 py-0.5 text-xs font-extrabold text-amber-200 hover:bg-amber-400/35 cursor-pointer"
                >
                  🔥 Unlock 50s Jaguars
                </button>
                <button
                  type="button"
                  onClick={() => handleAgeSliderChange(64)}
                  className="rounded-full border border-teal-300/60 bg-teal-400/20 px-2.5 py-0.5 text-xs font-extrabold text-teal-200 hover:bg-teal-400/35 cursor-pointer"
                >
                  👑 Unlock 60+ Panthers
                </button>
              </>
            )}
          </div>
        </div>

        <input
          type="range"
          aria-label="Dating app age preference slider"
          min={role === 'her' ? 21 : 38}
          max={role === 'her' ? 34 : 65}
          value={agePref}
          onChange={(e) => handleAgeSliderChange(Number(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer h-2 rounded-lg bg-black/60"
        />

        {sliderBanner && (
          <div className="rounded-xl bg-black/50 px-3 py-1.5 text-xs font-bold text-teal-200 border border-white/10">
            {sliderBanner}
          </div>
        )}
      </div>

      {/* Quick Profile Jumper Strip so users can browse the whole diverse deck freely */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {deck.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              sfx.messagePop();
              setIndex(i);
              setPhotoIdx(0);
              setAgeZoomed(false);
            }}
            className={`shrink-0 flex items-center gap-1.5 rounded-full border border-white/14 px-2.5 py-1 text-xs font-extrabold transition cursor-pointer ${
              i === index
                ? 'bg-amber-400 text-slate-950'
                : 'bg-[#1a0f2b] text-slate-300 hover:bg-slate-800'
            }`}
          >
            <img
              src={item.photos[0].photoUrl}
              alt={item.name}
              className="h-5 w-5 rounded-full object-cover object-top"
            />
            <span>
              {i === index ? `Now Viewing • ${item.age}` : `${item.name.split(' ')[0]}, ${item.age}`}
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Tinder / Hinge Card */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          startXRef.current = null;
          setDragX(0);
        }}
        style={{
          transform:
            flyDir === null ? `translateX(${dragX}px) rotate(${rotationDeg}deg)` : undefined,
        }}
        className={`vice-panel relative select-none touch-pan-y overflow-hidden rounded-3xl bg-[#150f24] transition-transform duration-150 ${
          flyDir === 'left'
            ? 'animate-swipe-left'
            : flyDir === 'right'
              ? 'animate-swipe-right'
              : ''
        }`}
      >
        {/* Drag Stamps */}
        {dragX > 35 && (
          <div className="pointer-events-none absolute top-14 left-5 z-20 -rotate-12 rounded-xl border-4 border-emerald-400 bg-black/70 px-4 py-1 font-display text-4xl text-emerald-300">
            DATE 💚
          </div>
        )}
        {dragX < -35 && (
          <div className="pointer-events-none absolute top-14 right-5 z-20 rotate-12 rounded-xl border-4 border-rose-500 bg-black/70 px-4 py-1 font-display text-4xl text-rose-400">
            PASS 🚩
          </div>
        )}

        {/* Top Tinder Story Bars + Easy Photo Tab Scroller */}
        <div className="p-3 sm:p-4 pb-0 space-y-2.5">
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
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  safePhotoIdx === idx ? 'bg-amber-300' : 'bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/14 bg-black/60 p-1">
              {profile.photos.map((ph, idx) => {
                const defaultLabel =
                  idx === 0
                    ? 'Photo 1 (The Bait)'
                    : idx === 1 && ph.isRedFlagPhoto
                      ? 'Photo 2 (The Truth 👀)'
                      : `Photo ${idx + 1}`;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectPhoto(idx)}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-extrabold cursor-pointer ${
                      safePhotoIdx === idx
                        ? ph.isRedFlagPhoto
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-400 text-slate-950'
                        : 'text-slate-300 hover:text-white'
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
              className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-white/14 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-teal-300 hover:bg-slate-700 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Ask Bestie</span>
            </button>
          </div>
        </div>

        {/* Photorealistic Profile Image + Left/Right Tap Arrows + Gradient Overlay */}
        <div className="p-3 sm:p-4 space-y-3.5">
          <div className="relative aspect-[4/5] sm:aspect-[4/4.5] w-full overflow-hidden rounded-2xl border border-white/14 bg-slate-950">
            <img
              src={currentPhoto.photoUrl}
              alt={`${profile.name} ${currentPhoto.caption}`}
              draggable={false}
              className="h-full w-full object-cover object-top transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />

            {/* Left / Right Easy Photo Carousel Chevrons */}
            {totalPhotos > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() => selectPhoto(safePhotoIdx - 1)}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-black/65 p-2 text-white hover:bg-black/90 cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => selectPhoto(safePhotoIdx + 1)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-black/65 p-2 text-white hover:bg-black/90 cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Active Pill + Look / Feature Diversity Badge */}
            <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/40">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{profile.activeAgo}</span>
              </div>
              <span className="rounded-full bg-black/75 border border-amber-300/40 px-2.5 py-1 text-xs font-extrabold text-amber-200">
                {profile.lookBadge}
              </span>
            </div>

            {/* Name, Age, Height, Zodiac & Shock Zoom */}
            <div className="absolute bottom-3 left-3.5 right-3.5 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h3 className="font-display text-4xl sm:text-5xl text-white leading-none drop-shadow">
                  {profile.name},{' '}
                  <span className="text-amber-300 underline decoration-wavy">{profile.age}</span>
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-200">
                  {profile.occupation} • {profile.height} • {profile.zodiac} • {profile.distance}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  sfx.shockZoom();
                  setAgeZoomed((v) => !v);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/14 bg-amber-400 px-3 py-2 text-xs font-extrabold text-slate-950 shadow-lg hover:bg-amber-300 cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Zoom Age: {profile.age}</span>
              </button>
            </div>
          </div>

          {/* Photo Caption Callout */}
          <div
            className={`rounded-xl border border-white/14 px-3.5 py-2.5 text-xs font-semibold ${
              currentPhoto.isRedFlagPhoto
                ? 'bg-rose-950/90 text-rose-200'
                : 'bg-black/50 text-amber-200'
            }`}
          >
            <div className="font-bold text-white">{currentPhoto.caption}</div>
            <div className="mt-0.5">{currentPhoto.vibeNote}</div>
          </div>

          {ageZoomed && (
            <div className="animate-shock-zoom vice-panel rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 p-4 text-slate-950">
              <div className="font-display text-3xl leading-none">
                🔍 SHOCK ZOOM: AGE {profile.age}!!
              </div>
              <p className="mt-1 text-xs sm:text-sm font-extrabold">
                {role === 'her' ? profile.ageShockQuipHer : profile.ageShockQuipHim}
              </p>
            </div>
          )}

          {/* Tinder Bio + Spotify Anthem */}
          <div className="rounded-2xl border border-white/14 bg-black/50 p-3.5 space-y-2.5">
            <p className="text-sm font-medium text-white leading-relaxed">
              &ldquo;{profile.tinderBio}&rdquo;
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
              <Music2 className="h-3.5 w-3.5" />
              <span>Anthem: {profile.spotifyAnthem}</span>
            </div>
          </div>

          {/* Hinge-Style Prompt Cards (1 or 2 fleshed-out prompts!) */}
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/14 bg-[#211234] p-3.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-pink-300">
                <Sparkles className="inline h-3 w-3 mr-1" />
                {profile.hingePromptQuestion}
              </div>
              <div className="mt-1 font-semibold text-xs sm:text-sm text-amber-100">
                {profile.hingePromptAnswer}
              </div>
            </div>

            {profile.secondPromptQuestion && profile.secondPromptAnswer && (
              <div className="rounded-2xl border border-white/14 bg-[#191b34] p-3.5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-teal-300">
                  <Sparkles className="inline h-3 w-3 mr-1" />
                  {profile.secondPromptQuestion}
                </div>
                <div className="mt-1 font-semibold text-xs sm:text-sm text-slate-100">
                  {profile.secondPromptAnswer}
                </div>
              </div>
            )}
          </div>

          {/* Looking For & Expanded Lifestyle Interests */}
          <div className="rounded-xl border border-white/14 bg-black/40 p-3.5 space-y-2">
            <div className="text-xs">
              <span className="font-bold text-slate-400">Looking for: </span>
              <span className="font-extrabold text-pink-300">&ldquo;{profile.lookingFor}&rdquo;</span>
              <span className="block text-xs italic text-slate-400 mt-0.5">
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
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      red
                        ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                        : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    }`}
                  >
                    {red ? '🚩 ' : '✨ '}
                    {interest}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Opening DM Preview + Interactive Voice-Note Waveform */}
          <div className="rounded-xl border border-white/14 bg-[#231438] p-3.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {role === 'her' ? 'Opening Message & Voice Note:' : 'Her Opening Challenge:'}
              </div>
              <button
                type="button"
                onClick={handleToggleVoiceNote}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold transition cursor-pointer ${
                  playingVoiceId === profile.id
                    ? 'border-emerald-300 bg-emerald-400 text-slate-950 animate-pulse'
                    : 'border-amber-300/40 bg-black/50 text-amber-200 hover:bg-black/80'
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>
                  {playingVoiceId === profile.id ? '🔊 Playing Voice Note…' : '▶️ Hear Voice Note'}
                </span>
                <span className="inline-flex items-end gap-0.5 h-3 ml-0.5" aria-hidden="true">
                  <span className="w-0.5 h-1.5 bg-current rounded-full" />
                  <span className="w-0.5 h-3 bg-current rounded-full" />
                  <span className="w-0.5 h-2 bg-current rounded-full" />
                  <span className="w-0.5 h-2.5 bg-current rounded-full" />
                </span>
              </button>
            </div>
            <p className="text-sm font-medium text-white">&ldquo;{profile.openingDm}&rdquo;</p>
          </div>

          {/* Optional 1-Credit Red-Flag X-Ray */}
          {xrayOpen ? (
            <div className="rounded-xl border-2 border-teal-400 bg-teal-950/70 p-3 text-xs font-bold text-teal-200">
              {profile.xrayLeak}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleUnlockXray}
              className="w-full rounded-xl border-2 border-dashed border-amber-400/60 bg-black/30 py-2 text-xs font-bold text-amber-300 hover:bg-black/50 cursor-pointer"
            >
              <Eye className="inline h-3.5 w-3.5 mr-1" />
              Run Maturity X-Ray Scan ({isFounderUnlimited ? 'FREE • ∞ Founder' : `1 Credit • You have ${credits}`})
            </button>
          )}

          {/* Swipe Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => commitSwipe('left')}
              className="vice-panel flex items-center justify-center gap-2 rounded-2xl bg-slate-800 py-3.5 font-display text-2xl text-rose-400 hover:bg-slate-700 cursor-pointer"
            >
              <X className="h-5 w-5" />
              <span>Swipe Left (Pass)</span>
            </button>
            <button
              type="button"
              onClick={() => commitSwipe('right')}
              className="vice-panel flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 py-3.5 font-display text-2xl text-slate-950 hover:brightness-110 cursor-pointer"
            >
              <Heart className="h-5 w-5" />
              <span>Swipe Right (Date)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
