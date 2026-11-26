import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X } from 'lucide-react';
import { FIELD_GUIDE_ENTRIES } from '../domain/taxonomy';

interface FieldGuideModalProps {
  open: boolean;
  unlockedStamps: string[];
  onClose: () => void;
}

const POP_CULTURE_PORTRAITS: Record<string, { url: string; credit: string }> = {
  pop_priyanka_nick: {
    url: './images/icons/pop_priyanka_nick.jpg',
    credit: 'Photo: Bollywood Hungama • CC BY 3.0 via Wikimedia Commons',
  },
  pop_heidi_tom: {
    url: './images/icons/pop_heidi_tom.jpg',
    credit: 'Photo: Colleen Sturtevant • CC BY-SA 4.0 via Wikimedia Commons',
  },
  pop_tina_erwin: {
    url: './images/icons/pop_tina_erwin.jpg',
    credit: 'Photo: HBO • Public Domain via Wikimedia Commons',
  },
  pop_cher_icons: {
    url: './images/icons/pop_cher_icons.jpg',
    credit: 'Photo: Raph_PH • CC BY-SA 4.0 via Wikimedia Commons',
  },
  pop_demi_ashton: {
    url: './images/icons/pop_demi_ashton.jpg',
    credit: 'Photo: Gabriel Hutchinson • CC BY-SA 4.0 via Wikimedia Commons',
  },
  pop_macrons: {
    url: './images/icons/pop_macrons.jpg',
    credit: 'Photo: European Commission • CC BY 4.0 via Wikimedia Commons',
  },
  pop_gabrielle_dwyane: {
    url: './images/icons/pop_gabrielle_dwyane.jpg',
    credit: 'Photo: Adam Chitayat • CC BY-SA 4.0 via Wikimedia Commons',
  },
  pop_goldie_kurt: {
    url: './images/icons/pop_goldie_kurt.jpg',
    credit: 'Photo: Peabody Awards • CC BY-SA 3.0 via Wikimedia Commons',
  },
  pop_meghan_harry: {
    url: './images/icons/pop_meghan_harry.jpg',
    credit: 'Photo: Fuzheado • CC BY 4.0 via Wikimedia Commons',
  },
  pop_stella_cinema: {
    url: './images/icons/pop_stella_cinema.jpg',
    credit: 'Photo: Gabriel Hutchinson • CC BY-SA 4.0 via Wikimedia Commons',
  },
  pop_kristin_montana: {
    url: './images/icons/pop_kristin_montana.jpg',
    credit: 'Photo: Nick Stepowyj • CC BY 2.0 via Wikimedia Commons',
  },
  pop_jessica_danny: {
    url: './images/icons/pop_jessica_danny.jpg',
    credit: 'Photo: Kevin Paul • CC BY 4.0 via Wikimedia Commons',
  },
  pop_sienna_oli: {
    url: './images/icons/pop_sienna_oli.jpg',
    credit: 'Photo: Martin Kraft • CC BY-SA 3.0 via Wikimedia Commons',
  },
  pop_ellie_beau: {
    url: './images/icons/pop_ellie_beau.jpg',
    credit: 'Photo: Office of the President of Ukraine • CC BY 4.0 via Wikimedia Commons',
  },
  pop_miley_maxx: {
    url: './images/icons/pop_miley_maxx.jpg',
    credit: 'Photo: TNT Brasil • CC BY 3.0 via Wikimedia Commons',
  },
  pop_cub_grooming_joke: {
    url: './images/icons/pop_cub_grooming_joke.jpg',
    credit: 'Photo: Raph_PH • CC BY 2.0 via Wikimedia Commons',
  },
  pop_cougar_town: {
    url: './images/icons/pop_cougar_town.jpg',
    credit: 'Photo: Albert Domasin • CC BY-SA 2.0 via Wikimedia Commons',
  },
};

export const FieldGuideModal: React.FC<FieldGuideModalProps> = ({
  open,
  unlockedStamps,
  onClose,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'crossover_lore' | 'pop_culture' | 'feline_scale' | 'cub_taxonomy'
  >('all');
  const [hiddenPortraits, setHiddenPortraits] = useState<Record<string, boolean>>({});

  if (!open) return null;

  const visibleEntries =
    activeFilter === 'all'
      ? FIELD_GUIDE_ENTRIES
      : FIELD_GUIDE_ENTRIES.filter((entry) => entry.category === activeFilter);

  const modalNode = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18101E]/65 p-3 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Age-Gap Dating Field Guide"
    >
      <div className="editorial-hinge-card relative max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-[#FFFDF9] p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300/70 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-amber-950">
              <Sparkles className="h-3.5 w-3.5 text-rose-600" /> Insider Community Glossary &amp; Pop-Culture Hall of Fame
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#18101E]">
              The Age-Gap Field Guide: Lore &amp; Celebrity Icons
            </h2>
            <p className="text-sm font-medium text-stone-600">
              From Puma, Cougar, Jaguar, and Panther tiers to Tina Turner, Priyanka Chopra, Cher, Meghan Markle, Sienna Miller &amp; the &ldquo;Cub Grooming&rdquo; glow-up.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-200 bg-white p-2.5 text-stone-700 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
            aria-label="Close Field Guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Lore' },
            { id: 'crossover_lore', label: '👑 Romance & Polarity' },
            { id: 'pop_culture', label: '✨ Pop-Culture Icons' },
            { id: 'feline_scale', label: '🐆 Feline Scale' },
            { id: 'cub_taxonomy', label: '🥂 Cub & Cubsplaining' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#18101E] text-white shadow-xs'
                  : 'border border-stone-200 bg-white text-[#18101E] hover:bg-stone-50'
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
            const portrait = POP_CULTURE_PORTRAITS[entry.id];
            return (
              <div
                key={entry.id}
                className={`rounded-3xl border p-5 space-y-3 h-full shadow-2xs ${
                  isPop
                    ? 'border-rose-200/80 bg-rose-50/35'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {portrait && !hiddenPortraits[entry.id] && (
                    <img
                      src={portrait.url}
                      alt={entry.label}
                      loading="lazy"
                      onError={() =>
                        setHiddenPortraits((prev) => ({ ...prev, [entry.id]: true }))
                      }
                      className="h-20 w-16 shrink-0 rounded-2xl border border-stone-200 object-cover object-top shadow-2xs"
                    />
                  )}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-editorial text-xl font-bold text-[#18101E]">
                        {entry.label}
                      </span>
                      <span className="rounded-full border border-rose-200 bg-white px-3 py-0.5 text-xs font-extrabold text-rose-700">
                        {entry.ageRange}
                      </span>
                    </div>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-rose-700">
                      {entry.headline} {stamped ? '• ✓ Unlocked' : ''}
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium leading-relaxed text-stone-700">
                  {entry.insiderLore}
                </p>
                <p className="rounded-2xl border border-amber-200/80 bg-amber-50/60 px-3.5 py-2.5 text-xs sm:text-sm italic font-semibold text-[#18101E]">
                  Signature Tell: {entry.signatureTell}
                </p>
                {portrait && !hiddenPortraits[entry.id] && (
                  <p className="text-[10px] font-medium text-stone-500">{portrait.credit}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
