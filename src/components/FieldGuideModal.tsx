import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FIELD_GUIDE_ENTRIES } from '../domain/taxonomy';

interface FieldGuideModalProps {
  open: boolean;
  unlockedStamps: string[];
  onClose: () => void;
}

const POP_CULTURE_PORTRAITS: Record<string, { url: string; credit: string }> = {
  pop_priyanka_nick: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Priyanka_Chopra_at_Bulgary_launch%2C_2024_%28cropped%29.jpg',
    credit: 'Photo: Bollywood Hungama • CC BY 3.0 via Wikimedia Commons',
  },
  pop_heidi_tom: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Heidi_Klum_Colleen_Sturtevant_Photography-3.jpg/500px-Heidi_Klum_Colleen_Sturtevant_Photography-3.jpg',
    credit: 'Photo: Colleen Sturtevant • CC BY-SA 4.0 via Wikimedia Commons',
  },
  pop_tina_erwin: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Tina_Turner_Breaks_All_the_Rules.png/500px-Tina_Turner_Breaks_All_the_Rules.png',
    credit: 'Photo: HBO • Public Domain via Wikimedia Commons',
  },
  pop_cher_icons: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Cher_in_2019_cropped.jpg/500px-Cher_in_2019_cropped.jpg',
    credit: 'Photo: Raph_PH • CC BY-SA 4.0 via Wikimedia Commons',
  },
  pop_demi_ashton: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Demi_Moore_at_the_2026_Cannes_Film_Festival_%28cropped%29.jpg/500px-Demi_Moore_at_the_2026_Cannes_Film_Festival_%28cropped%29.jpg',
    credit: 'Photo: Gabriel Hutchinson • CC BY-SA 4.0 via Wikimedia Commons',
  },
  pop_macrons: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Brigitte_Macron_-_June_2025_%28cropped%29.png/500px-Brigitte_Macron_-_June_2025_%28cropped%29.png',
    credit: 'Photo: European Commission • CC BY 4.0 via Wikimedia Commons',
  },
  pop_gabrielle_dwyane: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Gabrielle_Union_at_the_2024_Toronto_International_Film_Festival_3_%28cropped%29.jpg/500px-Gabrielle_Union_at_the_2024_Toronto_International_Film_Festival_3_%28cropped%29.jpg',
    credit: 'Photo: Adam Chitayat • CC BY-SA 4.0 via Wikimedia Commons',
  },
  pop_goldie_kurt: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Goldie_Hawn_in_2021.jpg/500px-Goldie_Hawn_in_2021.jpg',
    credit: 'Photo: Peabody Awards • CC BY-SA 3.0 via Wikimedia Commons',
  },
  pop_meghan_harry: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/SXSW-2024-OB7A9986-alih-Meghan%2C_Duchess_of_Sussex_%28cropped%29.jpg/500px-SXSW-2024-OB7A9986-alih-Meghan%2C_Duchess_of_Sussex_%28cropped%29.jpg',
    credit: 'Photo: Fuzheado • CC BY 4.0 via Wikimedia Commons',
  },
  pop_stella_cinema: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Angela_Basset_at_the_2025_Cannes_Film_Festival_04_%28cropped%29.jpg/500px-Angela_Basset_at_the_2025_Cannes_Film_Festival_04_%28cropped%29.jpg',
    credit: 'Photo: Gabriel Hutchinson • CC BY-SA 4.0 via Wikimedia Commons',
  },
  pop_kristin_montana: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/KristinCavallariSept10.jpg',
    credit: 'Photo: Nick Stepowyj • CC BY 2.0 via Wikimedia Commons',
  },
  pop_jessica_danny: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Jessica_Alba_-_Los_Angeles_Comic_Con_2025.jpg/500px-Jessica_Alba_-_Los_Angeles_Comic_Con_2025.jpg',
    credit: 'Photo: Kevin Paul • CC BY 4.0 via Wikimedia Commons',
  },
  pop_sienna_oli: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Sienna_Miller_Berlinale_2017.jpg/500px-Sienna_Miller_Berlinale_2017.jpg',
    credit: 'Photo: Martin Kraft • CC BY-SA 3.0 via Wikimedia Commons',
  },
  pop_ellie_beau: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/%D0%A3%D1%87%D0%B0%D1%81%D1%82%D1%8C_%D0%9F%D1%80%D0%B5%D0%B7%D0%B8%D0%B4%D0%B5%D0%BD%D1%82%D0%B0_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B8_%D1%83_%D0%B4%D1%80%D1%83%D0%B3%D0%BE%D0%BC%D1%83_%D0%A1%D0%B0%D0%BC%D1%96%D1%82%D1%96_%D0%BF%D0%B5%D1%80%D1%88%D0%B8%D1%85_%D0%BB%D0%B5%D0%B4%D1%96_%D1%82%D0%B0_%D0%B4%D0%B6%D0%B5%D0%BD%D1%82%D0%BB%D1%8C%D0%BC%D0%B5%D0%BD%D1%96%D0%B2_95_%28cropped%29_%28cropped%29.jpg',
    credit: 'Photo: Office of the President of Ukraine • CC BY 4.0 via Wikimedia Commons',
  },
  pop_miley_maxx: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Miley_Cyrus_Grammy_Awards_2024_%28cropped%29.png',
    credit: 'Photo: TNT Brasil • CC BY 3.0 via Wikimedia Commons',
  },
  pop_cub_grooming_joke: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Sam_Taylor-Johnson_2023.jpg',
    credit: 'Photo: Raph_PH • CC BY 2.0 via Wikimedia Commons',
  },
  pop_cougar_town: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Courteney_Cox_%2710_PaleyFest.jpg/500px-Courteney_Cox_%2710_PaleyFest.jpg',
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
              From Puma, Cougar, Jaguar, and Panther tiers to Tina Turner, Priyanka Chopra, Cher, Meghan Markle, Sienna Miller &amp; the &ldquo;Cub Grooming&rdquo; glow-up.
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
            { id: 'crossover_lore', label: '👑 Romance & Polarity' },
            { id: 'pop_culture', label: '✨ Pop-Culture Icons' },
            { id: 'feline_scale', label: '🐆 Feline Scale' },
            { id: 'cub_taxonomy', label: '🥂 Cub & Cubsplaining' },
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
            const portrait = POP_CULTURE_PORTRAITS[entry.id];
            return (
              <div
                key={entry.id}
                className={`rounded-2xl border-2 border-[#1E1022] p-5 space-y-2.5 h-full ${
                  isPop ? 'bg-[#FFF4F7]' : 'bg-[#FFFBEB]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {portrait && !hiddenPortraits[entry.id] && (
                    <img
                      src={portrait.url}
                      alt={entry.label}
                      loading="lazy"
                      onError={() =>
                        setHiddenPortraits((prev) => ({ ...prev, [entry.id]: true }))
                      }
                      className="h-20 w-16 shrink-0 rounded-xl border-2 border-[#1E1022] object-cover object-top"
                    />
                  )}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-display text-xl text-[#1E1022]">{entry.label}</span>
                      <span className="rounded-full border border-[#1E1022] bg-white px-3 py-0.5 text-xs font-extrabold text-[#D90452]">
                        {entry.ageRange}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#D90452]">
                      {entry.headline} {stamped ? '• ✓ Unlocked' : ''}
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium leading-relaxed text-[#34223B]">
                  {entry.insiderLore}
                </p>
                <p className="rounded-xl border border-[#1E1022]/20 bg-white px-3.5 py-2 text-xs sm:text-sm italic font-semibold text-[#1E1022]">
                  Signature Tell: {entry.signatureTell}
                </p>
                {portrait && !hiddenPortraits[entry.id] && (
                  <p className="text-[10px] font-semibold text-[#5A4664]">{portrait.credit}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
