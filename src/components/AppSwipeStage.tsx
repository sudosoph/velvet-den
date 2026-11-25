import React, { useRef, useState } from 'react';
import { Eye, Heart, Music2, Search, Share2, Sparkles, X } from 'lucide-react';
import { getSwipeDeckForRole } from '../data/appProfiles';
import type { PlayerRole } from '../domain/taxonomy';
import { sfx } from '../lib/sound';

interface AppSwipeStageProps {
  role: PlayerRole;
  credits: number;
  initialProfileIndex?: number;
  onSpendXrayCredit: () => boolean;
  onSwipeProfile: (profileId: string, direction: 'left' | 'right') => void;
  onShareDilemma: (id: string, title: string) => void;
  onCompleteSwipes: () => void;
}

export const AppSwipeStage: React.FC<AppSwipeStageProps> = ({
  role,
  credits,
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
  const [photoIdx, setPhotoIdx] = useState<0 | 1>(0);
  const [ageZoomed, setAgeZoomed] = useState(false);
  const [xrayUnlockedIds, setXrayUnlockedIds] = useState<string[]>([]);
  const [dragX, setDragX] = useState(0);
  const [flyDir, setFlyDir] = useState<'left' | 'right' | null>(null);
  const startXRef = useRef<number | null>(null);

  const profile = deck[index];

  if (!profile) {
    return null;
  }

  const xrayOpen = xrayUnlockedIds.includes(profile.id);

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

  const rotationDeg = (dragX / 18).toFixed(1);

  return (
    <div className="mx-auto max-w-xl space-y-4 animate-stage-in">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="rounded bg-rose-500/25 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-rose-300">
            Act I • The Dating App Prowl ({index + 1} / {deck.length})
          </span>
          <h2 className="mt-1 font-display text-3xl text-white">
            {role === 'her'
              ? 'Drag to Swipe — Always Tap Photo #2 First!'
              : 'Swipe Her Deck & Read What She Actually Wants'}
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
        className={`vice-panel relative select-none overflow-hidden rounded-3xl bg-[#180d28] transition-transform duration-150 ${
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

        {/* Top Tinder Story Bars + Controls */}
        <div className="p-3 sm:p-4 pb-0 space-y-2.5">
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1].map((idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  photoIdx === idx ? 'bg-amber-300' : 'bg-white/25'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex rounded-xl border-2 border-black bg-black/60 p-1">
              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  setPhotoIdx(0);
                }}
                className={`rounded-lg px-3 py-1 text-xs font-extrabold cursor-pointer ${
                  photoIdx === 0 ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                Photo 1 (The Bait)
              </button>
              <button
                type="button"
                onClick={() => {
                  if (profile.photos[1].isRedFlagPhoto) sfx.redFlag();
                  else sfx.greenFlag();
                  setPhotoIdx(1);
                }}
                className={`rounded-lg px-3 py-1 text-xs font-extrabold cursor-pointer ${
                  photoIdx === 1 ? 'bg-rose-500 text-white' : 'text-slate-300'
                }`}
              >
                Photo 2 (The Truth 👀)
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                onShareDilemma(
                  profile.id,
                  `Would you swipe right on ${profile.name} (${profile.age}) after Photo #2?!`,
                )
              }
              className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-teal-300 hover:bg-slate-700 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Ask Bestie</span>
            </button>
          </div>
        </div>

        {/* Photorealistic Profile Image + Gradient Name Overlay */}
        <div className="p-3 sm:p-4 space-y-3.5">
          <div className="relative aspect-[4/5] sm:aspect-[4/4.4] w-full overflow-hidden rounded-2xl border-2 border-black bg-slate-950">
            <img
              src={profile.photos[photoIdx].photoUrl}
              alt={`${profile.name} ${profile.photos[photoIdx].caption}`}
              draggable={false}
              className="h-full w-full object-cover object-top transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Active Pill */}
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-400/40">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{profile.activeAgo}</span>
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
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-amber-400 px-3 py-2 text-xs font-extrabold text-slate-950 shadow-[3px_3px_0px_#09050f] hover:bg-amber-300 cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Zoom Age: {profile.age}</span>
              </button>
            </div>
          </div>

          {/* Photo Caption Callout */}
          <div
            className={`rounded-xl border-2 border-black px-3.5 py-2.5 text-xs font-semibold ${
              profile.photos[photoIdx].isRedFlagPhoto
                ? 'bg-rose-950/90 text-rose-200'
                : 'bg-black/50 text-amber-200'
            }`}
          >
            <div className="font-bold text-white">{profile.photos[photoIdx].caption}</div>
            <div className="mt-0.5">{profile.photos[photoIdx].vibeNote}</div>
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
          <div className="rounded-2xl border-2 border-black bg-black/50 p-3.5 space-y-2.5">
            <p className="text-sm font-medium text-white leading-relaxed">
              &ldquo;{profile.tinderBio}&rdquo;
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-[11px] font-bold text-emerald-300">
              <Music2 className="h-3.5 w-3.5" />
              <span>Anthem: {profile.spotifyAnthem}</span>
            </div>
          </div>

          {/* Hinge-Style Prompt Card */}
          <div className="rounded-2xl border-2 border-black bg-[#211234] p-3.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-pink-300">
              <Sparkles className="inline h-3 w-3 mr-1" />
              {profile.hingePromptQuestion}
            </div>
            <div className="mt-1 font-semibold text-sm text-amber-100">
              {profile.hingePromptAnswer}
            </div>
          </div>

          {/* Looking For & Interests Badges */}
          <div className="rounded-xl border-2 border-black bg-black/40 p-3.5 space-y-2">
            <div className="text-xs">
              <span className="font-bold text-slate-400">Looking for: </span>
              <span className="font-extrabold text-pink-300">&ldquo;{profile.lookingFor}&rdquo;</span>
              <span className="block text-[11px] italic text-slate-400 mt-0.5">
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
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
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

          {/* Opening DM Preview */}
          <div className="rounded-xl border-2 border-black bg-[#231438] p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              {role === 'her' ? 'Opening Message Sent to Your Inbox:' : 'Her Opening Challenge:'}
            </div>
            <p className="mt-1 text-sm font-medium text-white">&ldquo;{profile.openingDm}&rdquo;</p>
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
              Run Maturity X-Ray Scan (1 Credit • You have {credits})
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
