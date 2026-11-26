import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X } from 'lucide-react';
import { FIELD_GUIDE_ENTRIES } from '../domain/taxonomy';

interface FieldGuideModalProps {
  open: boolean;
  unlockedStamps: string[];
  onClose: () => void;
}

const ENTRY_PORTRAITS: Record<string, { url: string; credit?: string; emojiBadge: string }> = {
  // === 16 Illustrated Feline, Cub & Polarity Lore Cards ===
  lynx: {
    url: './images/cast/chloe-37f.jpg',
    emojiBadge: '🐾 Pre-Puma Tier',
  },
  junior_cougar: {
    url: './images/cast/sienna-38f.jpg',
    emojiBadge: '🥂 6-Yr Sweet Spot',
  },
  puma: {
    url: './images/cast/camila-39f.jpg',
    emojiBadge: '🐆 30s Puma',
  },
  cougar: {
    url: './images/cast/claire-45f.jpg',
    emojiBadge: '👑 40s Benchmark',
  },
  princess_cougar: {
    url: './images/cast/elena-prof-44f.jpg',
    emojiBadge: '💐 Sweeping Romance',
  },
  jaguar: {
    url: './images/cast/diana-50f.jpg',
    emojiBadge: '🔥 50s Gen-X Apex',
  },
  panther: {
    url: './images/cast/celeste-62f.jpg',
    emojiBadge: '💎 60+ Silver Icon',
  },
  golden_cub: {
    url: './images/cast/rory-24m.jpg',
    emojiBadge: '🐕 Golden Cub',
  },
  cub_daddy_zaddy_lore: {
    url: './images/cast/miles-zaddy-31m.jpg',
    emojiBadge: '🥃 Decisive Lead',
  },
  soft_mommy_domme_lore: {
    url: './images/cast/brooke-glam-42f.jpg',
    emojiBadge: '✨ Velvet Command',
  },
  cubsplaining_lore: {
    url: './images/cast/julian-27m.jpg',
    emojiBadge: '🤓 Rookie Fumble',
  },
  bucket_list_tourist_lore: {
    url: './images/cast/chadwick-24m.jpg',
    emojiBadge: '🚩 Instant Unmatch',
  },
  black_cat_golden_retriever: {
    url: './images/cast/hero-couple.jpg',
    emojiBadge: '🐈‍⬛ × 🐕 #1 Polarity',
  },
  dm_goblin: {
    url: './images/cast/connor-bottle-trap.jpg',
    emojiBadge: '🚨 Block On Sight',
  },
  kitten: {
    url: './images/cast/isla-31f.jpg',
    emojiBadge: '🌸 Younger Her',
  },
  mountain_lion: {
    url: './images/cast/miles-32m.jpg',
    emojiBadge: '🍸 Silver Counterpart',
  },

  // === 23 Illustrated Celebrity & Cinema Icons ===
  pop_priyanka_nick: {
    url: './images/icons/pop_priyanka_nick.jpg',
    credit: 'Photo: Bollywood Hungama • CC BY 3.0 via Wikimedia Commons',
    emojiBadge: '💍 10-Yr Power Pair',
  },
  pop_heidi_tom: {
    url: './images/icons/pop_heidi_tom.jpg',
    credit: 'Photo: Colleen Sturtevant • CC BY-SA 4.0 via Wikimedia Commons',
    emojiBadge: '⛵ 16-Yr Capri Joy',
  },
  pop_tina_erwin: {
    url: './images/icons/pop_tina_erwin.jpg',
    credit: 'Photo: HBO • Public Domain via Wikimedia Commons',
    emojiBadge: '🏆 38-Yr Devotion',
  },
  pop_cher_icons: {
    url: './images/icons/pop_cher_icons.jpg',
    credit: 'Photo: Raph_PH • CC BY-SA 4.0 via Wikimedia Commons',
    emojiBadge: '👑 Eternal Goddess',
  },
  pop_demi_ashton: {
    url: './images/icons/pop_demi_ashton.jpg',
    credit: 'Photo: Gabriel Hutchinson • CC BY-SA 4.0 via Wikimedia Commons',
    emojiBadge: '📸 2003 Watershed',
  },
  pop_kris_corey: {
    url: './images/icons/pop_kris_corey.jpg',
    credit: 'Photo: Gage Skidmore • CC BY-SA 3.0 via Wikimedia Commons',
    emojiBadge: '🥂 25-Yr Power Duo',
  },
  pop_macrons: {
    url: './images/icons/pop_macrons.jpg',
    credit: 'Photo: European Commission • CC BY 4.0 via Wikimedia Commons',
    emojiBadge: '🇫🇷 24-Yr Élysée Pair',
  },
  pop_gabrielle_dwyane: {
    url: './images/icons/pop_gabrielle_dwyane.jpg',
    credit: 'Photo: Adam Chitayat • CC BY-SA 4.0 via Wikimedia Commons',
    emojiBadge: '✨ 9-Yr Met Royalty',
  },
  pop_julianne_bart: {
    url: './images/icons/pop_julianne_bart.jpg',
    credit: 'Photo: Wikimedia Commons • CC BY-SA 4.0',
    emojiBadge: '🎬 25+ Yrs Married',
  },
  pop_cameron_benji: {
    url: './images/icons/pop_cameron_benji.jpg',
    credit: 'Photo: Wikimedia Commons • CC BY 4.0',
    emojiBadge: '🎸 Sanctuary Couple',
  },
  pop_eva_ryan: {
    url: './images/icons/pop_eva_ryan.jpg',
    credit: 'Photo: Wikimedia Commons • CC BY 2.0',
    emojiBadge: '🌴 6.5-Yr Dream Pair',
  },
  pop_goldie_kurt: {
    url: './images/icons/pop_goldie_kurt.jpg',
    credit: 'Photo: Peabody Awards • CC BY-SA 3.0 via Wikimedia Commons',
    emojiBadge: '💛 40+ Yrs Laughing',
  },
  pop_meghan_harry: {
    url: './images/icons/pop_meghan_harry.jpg',
    credit: 'Photo: Fuzheado • CC BY 4.0 via Wikimedia Commons',
    emojiBadge: '🇬🇧 Royal Micro-Gap',
  },
  pop_madonna_mariahc_sarandon: {
    url: './images/icons/pop_madonna_mariahc_sarandon.jpg',
    credit: 'Photo: Wikimedia Commons • CC BY-SA 4.0',
    emojiBadge: '🌟 Trailblazers',
  },
  pop_olivia_harry: {
    url: './images/icons/pop_olivia_harry.jpg',
    credit: 'Photo: Wikimedia Commons • CC BY-SA 4.0',
    emojiBadge: '🎤 Pop Whiplash',
  },
  pop_stella_cinema: {
    url: './images/icons/pop_stella_cinema.jpg',
    credit: 'Photo: Gabriel Hutchinson • CC BY-SA 4.0 via Wikimedia Commons',
    emojiBadge: '🍿 Film Hall of Fame',
  },
  pop_kristin_montana: {
    url: './images/icons/pop_kristin_montana.jpg',
    credit: 'Photo: Nick Stepowyj • CC BY 2.0 via Wikimedia Commons',
    emojiBadge: '🤠 Age-Slider Viral',
  },
  pop_jessica_danny: {
    url: './images/icons/pop_jessica_danny.jpg',
    credit: 'Photo: Kevin Paul • CC BY 4.0 via Wikimedia Commons',
    emojiBadge: '🔥 Cabo Glow-Up',
  },
  pop_sienna_oli: {
    url: './images/icons/pop_sienna_oli.jpg',
    credit: 'Photo: Martin Kraft • CC BY-SA 3.0 via Wikimedia Commons',
    emojiBadge: '👶 15-Yr London Glow',
  },
  pop_ellie_beau: {
    url: './images/icons/pop_ellie_beau.jpg',
    credit: 'Photo: Office of the President of Ukraine • CC BY 4.0 via Wikimedia Commons',
    emojiBadge: '🎶 11-Yr Chapter',
  },
  pop_miley_maxx: {
    url: './images/icons/pop_miley_maxx.jpg',
    credit: 'Photo: TNT Brasil • CC BY 3.0 via Wikimedia Commons',
    emojiBadge: '🥁 6-Yr Newlyweds',
  },
  pop_cub_grooming_joke: {
    url: './images/icons/pop_cub_grooming_joke.jpg',
    credit: 'Photo: Raph_PH • CC BY 2.0 via Wikimedia Commons',
    emojiBadge: '🧴 Beard-Oil Glow-Up',
  },
  pop_cougar_town: {
    url: './images/icons/pop_cougar_town.jpg',
    credit: 'Photo: Albert Domasin • CC BY-SA 2.0 via Wikimedia Commons',
    emojiBadge: '🍷 Big Carl Legend',
  },
};

export const FieldGuideModal: React.FC<FieldGuideModalProps> = ({
  open,
  unlockedStamps,
  onClose,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'feline_scale' | 'cub_taxonomy' | 'crossover_lore' | 'pop_culture'
  >('all');

  if (!open) return null;

  const visibleEntries =
    activeFilter === 'all'
      ? FIELD_GUIDE_ENTRIES
      : FIELD_GUIDE_ENTRIES.filter((entry) => entry.category === activeFilter);

  const modalNode = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18101E]/65 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Age-Gap Dating Field Guide"
      onClick={onClose}
    >
      <div
        className="editorial-hinge-card relative max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-[#FFFDF9] p-5 sm:p-8 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300/70 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-amber-950">
              <Sparkles className="h-3.5 w-3.5 text-rose-600" /> Illustrated BuzzFeed-Style Spotter’s Deck • {FIELD_GUIDE_ENTRIES.length} Cards
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#18101E]">
              🐆 The Illustrated Age-Gap Field Guide
            </h2>
            <p className="text-xs sm:text-sm font-medium text-stone-600">
              Spot every archetype in 5 seconds: Puma → Cougar → Jaguar → Panther tiers, Golden Cubs vs. Tourists &amp; 23 Celebrity Icons.
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
            { id: 'all', label: `🔥 All ${FIELD_GUIDE_ENTRIES.length} Cards` },
            { id: 'feline_scale', label: '🐆 Feline Age Scale' },
            { id: 'cub_taxonomy', label: '🥂 Cubs vs. Goblins' },
            { id: 'crossover_lore', label: '👑 Romance Polarity' },
            { id: 'pop_culture', label: '✨ Celebrity Hall of Fame' },
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
          {visibleEntries.map((entry, idx) => {
            const stamped = unlockedStamps.includes(entry.id);
            const isPop = entry.category === 'pop_culture';
            const portrait = ENTRY_PORTRAITS[entry.id] ?? {
              url: './images/cast/hero-couple.jpg',
              emojiBadge: '✨ Club Lore',
            };
            return (
              <div
                key={entry.id}
                className={`rounded-3xl border p-4 sm:p-5 space-y-3 h-full flex flex-col justify-between shadow-2xs ${
                  isPop
                    ? 'border-rose-200/80 bg-gradient-to-br from-rose-50/45 via-white to-amber-50/30'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={portrait.url}
                        alt={entry.label}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = './images/cast/hero-couple.jpg';
                        }}
                        className="h-24 w-20 sm:h-28 sm:w-22 rounded-2xl border border-stone-200 bg-stone-100 object-cover object-top shadow-2xs"
                      />
                      <span className="absolute -top-2 -left-2 rounded-full bg-[#18101E] px-2 py-0.5 text-[10px] font-extrabold text-amber-300">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-950">
                          {portrait.emojiBadge}
                        </span>
                        <span className="rounded-full border border-rose-200 bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-rose-700">
                          {entry.ageRange}
                        </span>
                      </div>
                      <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#18101E] leading-snug">
                        {entry.label}
                      </h3>
                      <div className="text-xs font-extrabold text-rose-700 leading-snug">
                        {entry.headline} {stamped ? '• ✓ Unlocked' : ''}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-stone-700">
                    {entry.insiderLore}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="rounded-2xl border border-amber-200/80 bg-amber-50/70 px-3.5 py-2 text-xs font-bold text-[#18101E]">
                    👀 <span className="text-rose-700">Instant Tell:</span> {entry.signatureTell}
                  </p>
                  {portrait.credit && (
                    <p className="text-[10px] font-medium text-stone-400">{portrait.credit}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
