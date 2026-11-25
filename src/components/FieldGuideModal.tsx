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
  if (!open) return null;

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
              Insider Community Glossary
            </span>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl text-white">
              The Age-Gap Field Guide: Puma, Cougar, Jaguar &amp; Cub Lore
            </h2>
            <p className="text-sm text-slate-300">
              Learn the real r/CougarsAndCubs terminology so you never mislabel a 36-year-old Puma or fall for a &ldquo;hey&rdquo; DM Goblin.
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

        <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
          {FIELD_GUIDE_ENTRIES.map((entry) => {
            const stamped = unlockedStamps.includes(entry.id);
            return (
              <div
                key={entry.id}
                className="rounded-xl border-2 border-black bg-[#211234] p-4 shadow-[4px_4px_0px_#09050f]"
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
