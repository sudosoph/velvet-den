import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, ExternalLink, Search, X } from 'lucide-react';
import { FIELD_GUIDE_ENTRIES } from '../domain/taxonomy';
import {
  AFFILIATE_SUPPORT_COPY,
  buildAffiliateUrl,
  getAffiliateById,
} from '../lib/affiliates';
import { trackEvent } from '../lib/analytics';
import { Tabs, TabsList, TabsTrigger } from './ui/primitives';

interface FieldGuideModalProps {
  open: boolean;
  unlockedStamps: string[];
  onClose: () => void;
}

const ENTRY_PORTRAITS: Record<string, { url: string; credit?: string; subtitleTag: string }> = {
  lynx: {
    url: './images/cast/chloe-37f.jpg',
    subtitleTag: 'Pre-Puma Tier',
  },
  junior_cougar: {
    url: './images/cast/sienna-38f.jpg',
    subtitleTag: '6-Yr Sweet Spot',
  },
  puma: {
    url: './images/cast/camila-39f.jpg',
    subtitleTag: '30s Puma',
  },
  cougar: {
    url: './images/cast/claire-45f.jpg',
    subtitleTag: '40s Benchmark',
  },
  princess_cougar: {
    url: './images/cast/elena-prof-44f.jpg',
    subtitleTag: 'Sweeping Romance',
  },
  jaguar: {
    url: './images/cast/diana-50f.jpg',
    subtitleTag: '50s Gen-X Apex',
  },
  panther: {
    url: './images/cast/celeste-62f.jpg',
    subtitleTag: '60+ Silver Icon',
  },
  golden_cub: {
    url: './images/cast/rory-24m.jpg',
    subtitleTag: 'Golden Cub',
  },
  trophy_boy_toy_lore: {
    url: './images/cast/miles-32m.jpg',
    subtitleTag: 'Earned Boy Toy',
  },
  cub_daddy_zaddy_lore: {
    url: './images/cast/miles-zaddy-31m.jpg',
    subtitleTag: 'Decisive Lead',
  },
  soft_mommy_domme_lore: {
    url: './images/cast/brooke-glam-42f.jpg',
    subtitleTag: 'Confident Command',
  },
  cubsplaining_lore: {
    url: './images/cast/julian-27m.jpg',
    subtitleTag: 'Rookie Fumble',
  },
  bucket_list_tourist_lore: {
    url: './images/cast/chadwick-24m.jpg',
    subtitleTag: 'Instant Unmatch',
  },
  black_cat_golden_retriever: {
    url: './images/cast/hero-couple.jpg',
    subtitleTag: '#1 Polarity',
  },
  dm_goblin: {
    url: './images/cast/connor-bottle-trap.jpg',
    subtitleTag: 'Block On Sight',
  },
  kitten: {
    url: './images/cast/isla-31f.jpg',
    subtitleTag: 'Younger Her',
  },
  mountain_lion: {
    url: './images/cast/miles-32m.jpg',
    subtitleTag: 'Silver Counterpart',
  },
  pop_priyanka_nick: {
    url: './images/icons/pop_priyanka_nick.jpg',
    credit: 'Photo: Bollywood Hungama • CC BY 3.0 via Wikimedia Commons',
    subtitleTag: '10-Yr Power Pair',
  },
  pop_heidi_tom: {
    url: './images/icons/pop_heidi_tom.jpg',
    credit: 'Photo: Colleen Sturtevant • CC BY-SA 4.0 via Wikimedia Commons',
    subtitleTag: '16-Yr Capri Joy',
  },
  pop_tina_erwin: {
    url: './images/icons/pop_tina_erwin.jpg',
    credit: 'Photo: HBO • Public Domain via Wikimedia Commons',
    subtitleTag: '38-Yr Devotion',
  },
  pop_cher_icons: {
    url: './images/icons/pop_cher_icons.jpg',
    credit: 'Photo: Raph_PH • CC BY-SA 4.0 via Wikimedia Commons',
    subtitleTag: 'Eternal Icon',
  },
  pop_demi_ashton: {
    url: './images/icons/pop_demi_ashton.jpg',
    credit: 'Photo: Gabriel Hutchinson • CC BY-SA 4.0 via Wikimedia Commons',
    subtitleTag: '2003 Watershed',
  },
  pop_caroline_sergio: {
    url: './images/icons/pop_caroline_sergio.jpg',
    credit: 'Photo: Gilzetbase • CC BY-SA 4.0 via Wikimedia Commons',
    subtitleTag: '18-Yr Pair',
  },
  pop_kris_corey: {
    url: './images/icons/pop_kris_corey.jpg',
    credit: 'Photo: Gage Skidmore • CC BY-SA 3.0 via Wikimedia Commons',
    subtitleTag: '25-Yr Power Duo',
  },
  pop_macrons: {
    url: './images/icons/pop_macrons.jpg',
    credit: 'Photo: European Commission • CC BY 4.0 via Wikimedia Commons',
    subtitleTag: '24-Yr Élysée Pair',
  },
  pop_gabrielle_dwyane: {
    url: './images/icons/pop_gabrielle_dwyane.jpg',
    credit: 'Photo: Adam Chitayat • CC BY-SA 4.0 via Wikimedia Commons',
    subtitleTag: '9-Yr Met Royalty',
  },
  pop_julianne_bart: {
    url: './images/icons/pop_julianne_bart.jpg',
    credit: 'Photo: Wikimedia Commons • CC BY-SA 4.0',
    subtitleTag: '25+ Yrs Married',
  },
  pop_cameron_benji: {
    url: './images/icons/pop_cameron_benji.jpg',
    credit: 'Photo: Wikimedia Commons • CC BY 4.0',
    subtitleTag: 'Sanctuary Couple',
  },
  pop_eva_ryan: {
    url: './images/icons/pop_eva_ryan.jpg',
    credit: 'Photo: Wikimedia Commons • CC BY 2.0',
    subtitleTag: '6.5-Yr Dream Pair',
  },
  pop_goldie_kurt: {
    url: './images/icons/pop_goldie_kurt.jpg',
    credit: 'Photo: Peabody Awards • CC BY-SA 3.0 via Wikimedia Commons',
    subtitleTag: '40+ Yrs Laughing',
  },
  pop_meghan_harry: {
    url: './images/icons/pop_meghan_harry.jpg',
    credit: 'Photo: Fuzheado • CC BY 4.0 via Wikimedia Commons',
    subtitleTag: 'Royal Micro-Gap',
  },
  pop_madonna_mariahc_sarandon: {
    url: './images/icons/pop_madonna_mariahc_sarandon.jpg',
    credit: 'Photo: Wikimedia Commons • CC BY-SA 4.0',
    subtitleTag: 'Trailblazers',
  },
  pop_olivia_harry: {
    url: './images/icons/pop_olivia_harry.jpg',
    credit: 'Photo: Wikimedia Commons • CC BY-SA 4.0',
    subtitleTag: 'Pop Crossover',
  },
  pop_stella_cinema: {
    url: './images/icons/pop_stella_cinema.jpg',
    credit: 'Photo: Gabriel Hutchinson • CC BY-SA 4.0 via Wikimedia Commons',
    subtitleTag: 'Film Canon',
  },
  pop_kristin_montana: {
    url: './images/icons/pop_kristin_montana.jpg',
    credit: 'Photo: Nick Stepowyj • CC BY 2.0 via Wikimedia Commons',
    subtitleTag: 'Age-Slider Dare',
  },
  pop_jessica_danny: {
    url: './images/icons/pop_jessica_danny.jpg',
    credit: 'Photo: Kevin Paul • CC BY 4.0 via Wikimedia Commons',
    subtitleTag: 'Cabo Glow-Up',
  },
  pop_sienna_oli: {
    url: './images/icons/pop_sienna_oli.jpg',
    credit: 'Photo: Martin Kraft • CC BY-SA 3.0 via Wikimedia Commons',
    subtitleTag: '15-Yr London Glow',
  },
  pop_ellie_beau: {
    url: './images/icons/pop_ellie_beau.jpg',
    credit: 'Photo: Office of the President of Ukraine • CC BY 4.0 via Wikimedia Commons',
    subtitleTag: '11-Yr Chapter',
  },
  pop_miley_maxx: {
    url: './images/icons/pop_miley_maxx.jpg',
    credit: 'Photo: TNT Brasil • CC BY 3.0 via Wikimedia Commons',
    subtitleTag: '6-Yr Pair',
  },
  pop_cub_grooming_joke: {
    url: './images/icons/pop_cub_grooming_joke.jpg',
    credit: 'Photo: Raph_PH • CC BY 2.0 via Wikimedia Commons',
    subtitleTag: 'Beard-Oil Glow-Up',
  },
  pop_cougar_town: {
    url: './images/icons/pop_cougar_town.jpg',
    credit: 'Photo: Albert Domasin • CC BY-SA 2.0 via Wikimedia Commons',
    subtitleTag: 'Big Carl Legend',
  },
  pop_nicole_kim_hamilton: {
    url: './images/icons/pop_olivia_harry.jpg',
    credit: 'Photo: Wikimedia Commons • CC BY-SA 4.0',
    subtitleTag: 'F1 & West End',
  },
  pop_elizabeth_holmes_billy: {
    url: './images/icons/pop_kristin_montana.jpg',
    subtitleTag: '8-Yr Plot Twist',
  },
  pop_katie_holmes_manhattan: {
    url: './images/icons/pop_sienna_oli.jpg',
    subtitleTag: 'NYC Creative Era',
  },
  pop_joan_collins_percy: {
    url: './images/icons/pop_cher_icons.jpg',
    subtitleTag: '32-Yr Mic Drop',
  },
};

type GuideFilterTab = 'all' | 'feline_scale' | 'cub_taxonomy' | 'crossover_lore' | 'pop_culture';

export const FieldGuideModal: React.FC<FieldGuideModalProps> = ({
  open,
  unlockedStamps,
  onClose,
}) => {
  const [activeFilter, setActiveFilter] = useState<GuideFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!open) return null;

  const qLower = searchQuery.trim().toLowerCase();
  const visibleEntries = FIELD_GUIDE_ENTRIES.filter((entry) => {
    const catOk = activeFilter === 'all' || entry.category === activeFilter;
    if (!catOk) return false;
    if (!qLower) return true;
    return `${entry.label} ${entry.ageRange} ${entry.insiderLore} ${entry.signatureTell}`
      .toLowerCase()
      .includes(qLower);
  });

  const modalNode = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Age-Gap Dating Field Guide"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Header: Title + Radix Tabs + Instant Search (Zero Pill Stack) */}
        <div className="shrink-0 border-b border-zinc-200 bg-white px-5 py-4 sm:px-7 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-950">
                Field Guide
              </h2>
              <span className="text-xs text-zinc-400">
                {FIELD_GUIDE_ENTRIES.length} entries
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
              aria-label="Close Field Guide"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <Tabs
              value={activeFilter}
              onValueChange={(v) => setActiveFilter(v as GuideFilterTab)}
            >
              <TabsList className="flex-wrap h-auto gap-0.5">
                <TabsTrigger value="all" className="text-xs px-2.5 py-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="feline_scale" className="text-xs px-2.5 py-1">
                  Feline Scale
                </TabsTrigger>
                <TabsTrigger value="cub_taxonomy" className="text-xs px-2.5 py-1">
                  Cubs &amp; Boy Toys
                </TabsTrigger>
                <TabsTrigger value="crossover_lore" className="text-xs px-2.5 py-1">
                  Polarity
                </TabsTrigger>
                <TabsTrigger value="pop_culture" className="text-xs px-2.5 py-1">
                  Icons
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="search"
                data-testid="field-guide-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Boy Toy, Puma, Cher..."
                className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-xs text-zinc-900 focus:bg-white focus:border-zinc-950 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 space-y-5 bg-zinc-50/40">
          {activeFilter === 'pop_culture' && (
            <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-2.5">
              <div className="text-xs font-semibold text-zinc-900">
                Stream Essential Titles on Prime Video
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
                      className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50/70 px-3 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-100 transition"
                    >
                      <span>{item.name.split(' (')[0]}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                    </a>
                  );
                })}
              </div>
              <div className="text-[11px] text-zinc-500">{AFFILIATE_SUPPORT_COPY.compactInline}</div>
            </div>
          )}

          {/* Clean Architectural Lexicon Cards (Typographic Metadata, Zero 3-Pill Header Stacks!) */}
          <div className="grid gap-4 sm:grid-cols-2 items-stretch">
            {visibleEntries.map((entry) => {
              const stamped = unlockedStamps.includes(entry.id);
              const portrait = ENTRY_PORTRAITS[entry.id] ?? {
                url: './images/cast/hero-couple.jpg',
                subtitleTag: 'Club Lore',
              };
              return (
                <article
                  key={entry.id}
                  className="editorial-hinge-card rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 space-y-3 h-full flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={portrait.url}
                        alt={entry.label}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = './images/cast/hero-couple.jpg';
                        }}
                        className="h-20 w-16 shrink-0 rounded-lg border border-zinc-200 bg-zinc-100 object-cover object-top"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="text-xs font-medium text-zinc-500">
                          {portrait.subtitleTag} · {entry.ageRange}
                          {stamped ? ' · ✓ Stamped' : ''}
                        </div>
                        <h3 className="text-base font-semibold text-zinc-950 leading-snug">
                          {entry.label}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-zinc-600">
                      {entry.insiderLore}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-600">
                      <span>
                        <strong className="font-semibold text-zinc-900">Tell:</strong>{' '}
                        {entry.signatureTell}
                      </span>
                      <button
                        type="button"
                        aria-label={`Copy ${entry.label} definition`}
                        onClick={async () => {
                          const snippet = `${entry.label} (${entry.ageRange}): ${entry.insiderLore} Signature tell: ${entry.signatureTell}`;
                          try {
                            await navigator.clipboard?.writeText(snippet);
                          } catch {
                            // Ignore clipboard restriction
                          }
                          setCopiedId(entry.id);
                          window.setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="shrink-0 inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 hover:text-zinc-950 cursor-pointer"
                      >
                        {copiedId === entry.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    {portrait.credit && (
                      <p className="text-[11px] text-zinc-400">{portrait.credit}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
