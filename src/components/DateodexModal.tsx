import React, { useState } from 'react';
import { Award, Camera, Flag, Search, X } from 'lucide-react';
import { V35_CAST_VISUALS } from '../data/v35AssetManifest';
import { V35_CAST_PROFILES } from '../data/v35Cast';
import { CLUB_POLAROIDS, type DateodexState } from '../domain/dateodex';
import type { WalletState } from '../domain/economy';

interface DateodexModalProps {
  open: boolean;
  dateodex: DateodexState;
  wallet: WalletState;
  cutLooseIds: string[];
  onClose: () => void;
}

export const DateodexModal: React.FC<DateodexModalProps> = ({
  open,
  dateodex,
  wallet,
  cutLooseIds,
  onClose,
}) => {
  const [subTab, setSubTab] = useState<'cast' | 'polaroids'>('cast');

  if (!open) return null;

  const stampedCount = Object.keys(dateodex.stamps).length + cutLooseIds.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18101E]/65 p-3 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Velvet Palms Dateodex & Polaroid Album"
    >
      <div className="editorial-hinge-card relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-[#FFFDF9] p-5 sm:p-7 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-950">
              <Camera className="h-3.5 w-3.5" /> Velvet Palms Dateodex • {stampedCount}/
              {V35_CAST_PROFILES.length} Logged
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#18101E]">
              Cast Ranks, Dodged Traps &amp; Polaroid Memories
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Table 9 Conspiracy Clues Collected:{' '}
              <strong>{wallet.conspiracyClues.length}/3</strong> • Discernment XP:{' '}
              <strong>{wallet.discernmentXp} XP</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Dateodex"
            className="rounded-full border border-stone-200 bg-white p-2.5 text-stone-700 hover:bg-rose-50 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="inline-flex rounded-full bg-stone-100 p-1">
          <button
            type="button"
            onClick={() => setSubTab('cast')}
            className={`rounded-full px-4 py-2 text-xs font-extrabold cursor-pointer ${
              subTab === 'cast' ? 'bg-[#18101E] text-white' : 'text-stone-600'
            }`}
          >
            🗂️ Cast Roster ({V35_CAST_PROFILES.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('polaroids')}
            className={`rounded-full px-4 py-2 text-xs font-extrabold cursor-pointer ${
              subTab === 'polaroids' ? 'bg-[#18101E] text-white' : 'text-stone-600'
            }`}
          >
            📸 Polaroid Memories ({dateodex.unlockedPolaroidIds.length}/{CLUB_POLAROIDS.length})
          </button>
        </div>

        {subTab === 'cast' ? (
          <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3">
            {V35_CAST_PROFILES.map((person) => {
              const visual = V35_CAST_VISUALS[person.id];
              const stamp = dateodex.stamps[person.id];
              const wasCutLoose = cutLooseIds.includes(person.id);
              return (
                <div
                  key={person.id}
                  className="rounded-2xl border border-stone-200 bg-white p-3.5 flex items-center gap-3.5 shadow-2xs"
                >
                  <img
                    src={visual?.primaryPortrait}
                    alt={person.name}
                    className="h-18 w-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="font-editorial text-base font-bold text-[#18101E] truncate">
                        {person.name}, {person.age}
                      </div>
                      {stamp ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-extrabold text-amber-950">
                          Rank {stamp.rank}
                        </span>
                      ) : wasCutLoose ? (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-900">
                          <Flag className="h-2.5 w-2.5" /> Dodged
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-500">
                          <Search className="h-2.5 w-2.5" /> Unmet
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-600 leading-snug">{person.vitals.job}</div>
                    {stamp?.note && (
                      <div className="text-[11px] font-semibold text-rose-700">{stamp.note}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {CLUB_POLAROIDS.map((pol) => {
              const unlocked =
                dateodex.unlockedPolaroidIds.includes(pol.id) || wallet.isVip || Boolean(wallet.isFounderUnlimited);
              return (
                <div
                  key={pol.id}
                  className={`rounded-2xl border border-stone-200 bg-white p-3.5 space-y-2.5 shadow-sm ${pol.rotationClass}`}
                >
                  <div className="overflow-hidden rounded-xl bg-stone-100 aspect-[4/3]">
                    <img
                      src={pol.imageUrl}
                      alt={pol.title}
                      className={`h-full w-full object-cover ${unlocked ? '' : 'blur-md grayscale opacity-60'}`}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-editorial text-sm font-bold text-[#18101E]">
                      {pol.title}
                    </div>
                    {unlocked && <Award className="h-4 w-4 text-amber-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {unlocked ? pol.caption : `🔒 ${pol.unlockHint}`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
