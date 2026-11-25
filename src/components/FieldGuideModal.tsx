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
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'pop_culture' | 'feline_scale' | 'cub_taxonomy'>('all');

  if (!open) return null;

  const visibleEntries =
    activeFilter === 'all'
      ? FIELD_GUIDE_ENTRIES
      : FIELD_GUIDE_ENTRIES.filter((entry) => entry.category === activeFilter);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Age-Gap Dating Field Guide"
    >
      <div className="vice-panel relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#160c24] p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="inline-block rounded bg-teal-400/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-teal-300">
              Insider Community Glossary &amp; Pop-Culture Hall of Fame
            </span>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl text-white">
              The Age-Gap Field Guide: Lore &amp; Celebrity Icons
            </h2>
            <p className="text-sm text-slate-300">
              From Puma/Cougar/Jaguar law to Jessica Alba, Sienna Miller, Ellie Goulding, Miley Cyrus &amp; the &ldquo;Cub Grooming&rdquo; glow-up.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border-2 border-black bg-slate-800 p-2 text-slate-200 hover:bg-rose-600 cursor-pointer"
            aria-label="Close Field Guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Lore' },
            { id: 'pop_culture', label: '✨ Pop-Culture Cougars & Cubs' },
            { id: 'feline_scale', label: '🐆 Feline Scale' },
            { id: 'cub_taxonomy', label: '🥂 Cub Taxonomy' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`rounded-full border-2 border-black px-3 py-1 text-xs font-extrabold transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950'
                  : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
          {visibleEntries.map((entry) => {
            const stamped = unlockedStamps.includes(entry.id);
            const isPop = entry.category === 'pop_culture';
            return (
              <div
                key={entry.id}
                className={`rounded-xl border-2 p-4 shadow-[4px_4px_0px_#09050f] ${
                  isPop
                    ? 'border-pink-400/70 bg-gradient-to-br from-[#2b1138] to-[#1a1333]'
                    : 'border-black bg-[#211234]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-2xl text-amber-300">{entry.label}</span>
                  <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-bold text-pink-300">
                    {entry.ageRange}
                  </span>
                </div>
                <div className="mt-0.5 text-xs font-bold uppercase tracking-wide text-teal-300">
                  {entry.headline} {stamped ? '• ✓ STAMPED' : ''}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-200">{entry.insiderLore}</p>
                <p className="mt-2 rounded-lg bg-black/40 px-2.5 py-1.5 text-[11px] italic text-amber-200/90">
                  Tell: {entry.signatureTell}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
