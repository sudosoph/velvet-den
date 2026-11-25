import React, { useState } from 'react';
import { Eye, Heart, Search, Share2, X } from 'lucide-react';
import { APP_SWIPE_PROFILES } from '../data/appProfiles';
import type { PlayerRole } from '../domain/taxonomy';
import { AppPhotoIllustration } from './ArtPanels';

interface AppSwipeStageProps {
  role: PlayerRole;
  credits: number;
  onSpendXrayCredit: () => boolean;
  onSwipeProfile: (profileId: string, direction: 'left' | 'right') => void;
  onShareDilemma: (id: string, title: string) => void;
  onCompleteSwipes: () => void;
}

export const AppSwipeStage: React.FC<AppSwipeStageProps> = ({
  role,
  credits,
  onSpendXrayCredit,
  onSwipeProfile,
  onShareDilemma,
  onCompleteSwipes,
}) => {
  const [index, setIndex] = useState(0);
  const [photoIdx, setPhotoIdx] = useState<0 | 1>(0);
  const [ageZoomed, setAgeZoomed] = useState(false);
  const [xrayUnlockedIds, setXrayUnlockedIds] = useState<string[]>([]);

  const profile = APP_SWIPE_PROFILES[index];

  if (!profile) {
    return null;
  }

  const xrayOpen = xrayUnlockedIds.includes(profile.id);

  const handleSwipe = (direction: 'left' | 'right') => {
    onSwipeProfile(profile.id, direction);
    setPhotoIdx(0);
    setAgeZoomed(false);
    if (index + 1 >= APP_SWIPE_PROFILES.length) {
      onCompleteSwipes();
    } else {
      setIndex(index + 1);
    }
  };

  const handleUnlockXray = () => {
    if (xrayOpen) return;
    if (onSpendXrayCredit()) {
      setXrayUnlockedIds((prev) => [...prev, profile.id]);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="rounded bg-rose-500/25 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-rose-300">
            Act I • The Dating App Prowl ({index + 1} / {APP_SWIPE_PROFILES.length})
          </span>
          <h2 className="mt-1 font-display text-3xl text-white">
            {role === 'her'
              ? 'Inspect Photo #2 & Vet the Red Flags Before You Swipe'
              : 'Spot Why 90% of Cubs Get Left-Swiped in 3 Seconds'}
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

      <div className="vice-panel rounded-3xl bg-[#180d28] p-4 sm:p-6 space-y-4">
        {/* Photo Carousel Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex rounded-xl border-2 border-black bg-black/50 p-1">
            <button
              type="button"
              onClick={() => setPhotoIdx(0)}
              className={`rounded-lg px-3 py-1 text-xs font-extrabold cursor-pointer ${
                photoIdx === 0 ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
              }`}
            >
              Photo 1 (The Bait)
            </button>
            <button
              type="button"
              onClick={() => setPhotoIdx(1)}
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
                'check-drop',
                `Would you swipe right on ${profile.name} (${profile.age}) after Photo #2?!`,
              )
            }
            className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-teal-300 hover:bg-slate-700 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Ask Bestie</span>
          </button>
        </div>

        <AppPhotoIllustration variant={profile.photos[photoIdx].variant} />

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

        {/* Name + Shock Value Age Zoom */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-4xl text-white">
              {profile.name},{' '}
              <span className="text-amber-300 underline decoration-wavy">{profile.age}</span>
            </h3>
            <p className="text-xs text-slate-300">
              {profile.occupation} • {profile.distance}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAgeZoomed((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-amber-400 px-3 py-2 text-xs font-extrabold text-slate-950 shadow-[3px_3px_0px_#09050f] hover:bg-amber-300 cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Zoom Age: {profile.age}</span>
          </button>
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
              const red = ['Nightlife', 'Tequila', 'Clubs', 'Bottle Service', 'Crypto'].includes(
                interest,
              );
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
            Opening Message Sent to Her Inbox:
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
            onClick={() => handleSwipe('left')}
            className="vice-panel flex items-center justify-center gap-2 rounded-2xl bg-slate-800 py-3.5 font-display text-2xl text-rose-400 hover:bg-slate-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
            <span>Swipe Left (Pass)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwipe('right')}
            className="vice-panel flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 py-3.5 font-display text-2xl text-slate-950 hover:brightness-110 cursor-pointer"
          >
            <Heart className="h-5 w-5" />
            <span>Swipe Right (Date)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
