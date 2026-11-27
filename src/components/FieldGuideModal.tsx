import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, X } from 'lucide-react';
import { FIELD_GUIDE_ENTRIES } from '../domain/taxonomy';
import {
  AFFILIATE_SUPPORT_COPY,
  buildAffiliateUrl,
  getAffiliateById,
} from '../lib/affiliates';
import { trackEvent } from '../lib/analytics';

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
    emojiBadge: '✨ Confident Command',
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
  pop_caroline_sergio: {
    url: './images/icons/pop_caroline_sergio.jpg',
    credit: 'Photo: Gilzetbase • CC BY-SA 4.0 via Wikimedia Commons',
    emojiBadge: '🥂 18-Yr Dubai Royalty',
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
  pop_nicole_kim_hamilton: {
    url: './images/icons/pop_olivia_harry.jpg',
    credit: 'Photo: Wikimedia Commons • CC BY-SA 4.0',
    emojiBadge: '🏎️ F1 & Tony Royalty',
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Age-Gap Dating Field Guide"
      onClick={onClose}
    >
      <div
        className="editorial-hinge-card relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-zinc-200 bg-white px-5 pt-5 pb-4 sm:px-8 space-y-3.5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
                The Age-Gap Field Guide
              </h2>
              <p className="text-xs text-zinc-500">
                Browse archetypes, dating etiquette, and real-life celebrity couples.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
              aria-label="Close Field Guide"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-zinc-100 p-1">
            {[
              { id: 'all', label: `All ${FIELD_GUIDE_ENTRIES.length} Cards` },
              { id: 'feline_scale', label: 'Feline Age Scale' },
              { id: 'cub_taxonomy', label: 'Cubs vs. Goblins' },
              { id: 'crossover_lore', label: 'Romance Polarity' },
              { id: 'pop_culture', label: 'Celebrity Icons' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-white text-zinc-950 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-8 space-y-5">
          {activeFilter === 'pop_culture' && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-800">
                🎬 Watch Specific Titles Directly on Prime Video
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    'idea-of-you-movie-book',
                    'no-hard-feelings-jlaw-prime',
                    'babygirl-movie-prime',
                    'the-rebound-zeta-jones-prime',
                  ] as const
                ).map((affId) => {
                  const item = getAffiliateById(affId);
                  if (!item) return null;
                  return (
                    <a
                      key={affId}
                      href={buildAffiliateUrl(item, `field_guide_${affId}`)}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      onClick={() =>
                        trackEvent('affiliate_clicked', {
                          item_id: item.id,
                          surface: 'field_guide',
                        })
                      }
                      className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:border-rose-400 transition"
                    >
                      <span>{item.name.split(' (')[0]}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                    </a>
                  );
                })}
              </div>
              <div className="text-[11px] text-zinc-600">{AFFILIATE_SUPPORT_COPY.compactInline}</div>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 items-stretch">
          {visibleEntries.map((entry, idx) => {
            const stamped = unlockedStamps.includes(entry.id);
            const portrait = ENTRY_PORTRAITS[entry.id] ?? {
              url: './images/cast/hero-couple.jpg',
              emojiBadge: '✨ Club Lore',
            };
            return (
              <div
                key={entry.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 space-y-3 h-full flex flex-col justify-between shadow-2xs"
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
                        className="h-24 w-20 sm:h-28 sm:w-22 rounded-xl border border-zinc-200 bg-zinc-100 object-cover object-top"
                      />
                      <span className="absolute -top-2 -left-2 rounded-md bg-zinc-900 px-1.5 py-0.5 text-xs font-semibold text-white">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                          {portrait.emojiBadge}
                        </span>
                        <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-600">
                          {entry.ageRange}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-zinc-950 leading-snug">
                        {entry.label}
                      </h3>
                      <div className="text-xs font-medium text-zinc-500 leading-snug">
                        {entry.headline} {stamped ? '• ✓ Unlocked' : ''}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-zinc-600">
                    {entry.insiderLore}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-800">
                    <span className="font-semibold text-zinc-950">Instant Tell:</span> {entry.signatureTell}
                  </p>
                  {portrait.credit && (
                    <p className="text-xs text-zinc-400">{portrait.credit}</p>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
