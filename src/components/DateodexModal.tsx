import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, Flag, Search, Share2, X } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { V35_CAST_VISUALS } from '../data/v35AssetManifest';
import { V35_CAST_PROFILES } from '../data/v35Cast';
import { CLUB_POLAROIDS, type DateodexState } from '../domain/dateodex';
import type { WalletState } from '../domain/economy';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

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
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  if (!open) return null;

  const stampedCount = Object.keys(dateodex.stamps).length + cutLooseIds.length;
  const sRanks = Object.values(dateodex.stamps).filter((s) => s.rank === 'S').length;

  const modalNode = (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Cougars & Cubs Dateodex & Polaroid Album"
        onClick={onClose}
      >
        <div
          className="editorial-hinge-card relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 border-b border-zinc-200 bg-white px-5 pt-5 pb-4 sm:px-7 space-y-3.5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                  Cougars &amp; Cubs Dateodex • {stampedCount}/{V35_CAST_PROFILES.length} Logged
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
                  Cast Ranks, Dodged Traps &amp; Polaroid Memories
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600">
                  Table 9 Conspiracy Clues Collected:{' '}
                  <strong>{wallet.conspiracyClues.length}/3</strong> • Discernment XP:{' '}
                  <strong>{wallet.discernmentXp} XP</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Dateodex"
                className="shrink-0 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex rounded-xl bg-zinc-100 p-1">
                <button
                  type="button"
                  onClick={() => setSubTab('cast')}
                  className={`rounded-lg px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    subTab === 'cast' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  Cast Roster ({V35_CAST_PROFILES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSubTab('polaroids')}
                  className={`rounded-lg px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    subTab === 'polaroids' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  Polaroid Memories ({dateodex.unlockedPolaroidIds.length}/{CLUB_POLAROIDS.length})
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSharePayload({
                    title: `Share Dateodex (${stampedCount}/${V35_CAST_PROFILES.length})`,
                    message: `🐆📸 Cougars & Cubs Club Dateodex: ${stampedCount}/${V35_CAST_PROFILES.length} Cast Logged • ${sRanks} S-Ranks • ${cutLooseIds.length} Traps Dodged (${wallet.discernmentXp} Discernment XP)!`,
                    url: `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}${wallet.referralCode ? `?ref=${encodeURIComponent(wallet.referralCode)}` : ''}`,
                    shareSurface: 'verdict_receipt',
                  })
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 text-xs sm:text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5 text-rose-600" />
                <span>Share Dateodex</span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto bg-zinc-50/70 p-5 sm:p-7">
            {subTab === 'cast' ? (
              <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3">
                {V35_CAST_PROFILES.map((person) => {
                  const visual = V35_CAST_VISUALS[person.id];
                  const stamp = dateodex.stamps[person.id];
                  const wasCutLoose = cutLooseIds.includes(person.id);
                  return (
                    <div
                      key={person.id}
                      className="rounded-2xl border border-zinc-200 bg-white p-3.5 flex items-center gap-3.5 shadow-2xs"
                    >
                      <img
                        src={visual?.primaryPortrait}
                        alt={person.name}
                        className="h-18 w-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="font-editorial text-base font-bold text-zinc-950">
                            {person.name}, {person.age}
                          </div>
                          {stamp ? (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-extrabold text-amber-950">
                              Rank {stamp.rank}
                            </span>
                          ) : wasCutLoose ? (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-900">
                              <Flag className="h-2.5 w-2.5" /> Dodged
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-500">
                              <Search className="h-2.5 w-2.5" /> Unmet
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-600 leading-snug">{person.vitals.job}</div>
                        {stamp?.note && (
                          <div className="text-xs font-semibold text-rose-700">{stamp.note}</div>
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
                    dateodex.unlockedPolaroidIds.includes(pol.id) ||
                    wallet.isVip ||
                    Boolean(wallet.isFounderUnlimited);
                  return (
                    <div
                      key={pol.id}
                      className={`rounded-2xl border border-zinc-200 bg-white p-3.5 space-y-2.5 shadow-sm ${pol.rotationClass}`}
                    >
                      <div className="overflow-hidden rounded-xl bg-zinc-100 aspect-[4/3]">
                        <img
                          src={pol.imageUrl}
                          alt={pol.title}
                          className={`h-full w-full object-cover ${unlocked ? '' : 'blur-md grayscale opacity-60'}`}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-editorial text-sm font-bold text-zinc-950">
                          {pol.title}
                        </div>
                        {unlocked && <Award className="h-4 w-4 text-amber-600 shrink-0" />}
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {unlocked ? pol.caption : `🔒 ${pol.unlockHint}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
