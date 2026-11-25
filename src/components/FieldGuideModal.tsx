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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1022]/60 p-3 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Age-Gap Dating Field Guide"
    >
      <div className="vice-panel relative max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#1E1022]/12 pb-4">
          <div className="space-y-1">
            <span className="inline-block rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#1E1022]">
              Insider Community Glossary &amp; Pop-Culture Hall of Fame
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#1E1022]">
              The Age-Gap Field Guide: Lore &amp; Celebrity Icons
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#5A4664]">
              From Puma, Cougar, and Jaguar tiers to Jessica Alba, Sienna Miller, Ellie Goulding, Miley Cyrus &amp; the &ldquo;Cub Grooming&rdquo; glow-up.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pop-btn rounded-xl bg-[#FFF4F7] p-2.5 text-[#1E1022] hover:bg-[#FF2E63] hover:text-white cursor-pointer"
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
              className={`pop-btn rounded-full px-4 py-2 text-sm font-extrabold cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#FF2E63] text-white'
                  : 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 items-stretch">
          {visibleEntries.map((entry) => {
            const stamped = unlockedStamps.includes(entry.id);
            const isPop = entry.category === 'pop_culture';
            return (
              <div
                key={entry.id}
                className={`rounded-2xl border-2 border-[#1E1022] p-5 space-y-2.5 h-full ${
                  isPop ? 'bg-[#FFF4F7]' : 'bg-[#FFFBEB]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-xl text-[#1E1022]">{entry.label}</span>
                  <span className="rounded-full border border-[#1E1022] bg-white px-3 py-0.5 text-xs font-extrabold text-[#D90452]">
                    {entry.ageRange}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#D90452]">
                  {entry.headline} {stamped ? '• ✓ Unlocked' : ''}
                </div>
                <p className="text-sm font-medium leading-relaxed text-[#34223B]">{entry.insiderLore}</p>
                <p className="rounded-xl border border-[#1E1022]/20 bg-white px-3.5 py-2 text-xs sm:text-sm italic font-semibold text-[#1E1022]">
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
