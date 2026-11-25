import React from 'react';
import { X } from 'lucide-react';
import { FIELD_GUIDE_ENTRIES } from '../domain/taxonomy';

interface FieldGuideModalProps {
  open: boolean;
  unlockedStamps: string[];
  onClose: () => void;
}

export const FieldGuideModal: React.FC<FieldGuideModalProps> = ({
  open,
  unlockedStamps,
  onClose,
}) => {
  const [activeFilter, setActiveFilter] = React.useState<
    'all' | 'pop_culture' | 'feline_scale' | 'cub_taxonomy'
  >('all');

  if (!open) return null;

  const visibleEntries =
    activeFilter === 'all'
      ? FIELD_GUIDE_ENTRIES
      : FIELD_GUIDE_ENTRIES.filter((entry) => entry.category === activeFilter);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Age-Gap Dating Field Guide"
    >
      <div className="vice-panel relative max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-[#140e22]/95 p-6 sm:p-8 space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="inline-block rounded-full border border-amber-300/30 bg-amber-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-200">
              Insider Community Glossary &amp; Pop-Culture Hall of Fame
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-white">
              The Age-Gap Field Guide: Lore &amp; Celebrity Icons
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              From Puma, Cougar, and Jaguar tiers to Jessica Alba, Sienna Miller, Ellie Goulding, Miley Cyrus &amp; the &ldquo;Cub Grooming&rdquo; glow-up.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-slate-200 hover:bg-rose-500 hover:text-white transition cursor-pointer"
            aria-label="Close Field Guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Lore' },
            { id: 'pop_culture', label: '✨ Pop-Culture Icons' },
            { id: 'feline_scale', label: '🐆 Feline Scale' },
            { id: 'cub_taxonomy', label: '🥂 Cub Taxonomy' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'border-transparent bg-gradient-to-r from-rose-500 to-amber-400 text-slate-950 font-bold'
                  : 'border-white/12 bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {visibleEntries.map((entry) => {
            const stamped = unlockedStamps.includes(entry.id);
            const isPop = entry.category === 'pop_culture';
            return (
              <div
                key={entry.id}
                className={`rounded-2xl border p-5 space-y-2.5 ${
                  isPop
                    ? 'border-rose-400/35 bg-rose-500/[0.07]'
                    : 'border-white/12 bg-white/[0.04]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-xl text-amber-200">{entry.label}</span>
                  <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-semibold text-rose-200">
                    {entry.ageRange}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wide text-amber-300">
                  {entry.headline} {stamped ? '• ✓ Unlocked' : ''}
                </div>
                <p className="text-sm leading-relaxed text-slate-200">{entry.insiderLore}</p>
                <p className="rounded-xl bg-black/35 px-3.5 py-2 text-xs sm:text-sm italic text-amber-100/90">
                  Signature Tell: {entry.signatureTell}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
