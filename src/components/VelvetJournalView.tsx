import React, { useState } from 'react';
import {
  CheckCircle2,
  CheckSquare,
  ExternalLink,
  Flag,
  MessageCircle,
  Play,
  Share2,
  Sparkles,
  Square,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { JOURNAL_ARTICLES } from '../data/journalArticles';
import { buildAffiliateUrl, getAffiliateById } from '../lib/affiliates';
import { trackEvent } from '../lib/analytics';
import { sfx } from '../lib/sound';
import { ProductVisualThumbnail } from './ProductVisualThumbnail';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

interface VelvetJournalViewProps {
  initialSlug?: string | null;
  onPlayScenario: (episodeId: string) => void;
}

interface ZodiacSignInfo {
  id: string;
  label: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  herVibe: string;
  himVibe: string;
}

const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    id: 'aries',
    label: 'Aries',
    symbol: '♈',
    element: 'Fire',
    herVibe: 'Bold trailblazer who loves directness and spontaneous weekend escapes',
    himVibe: 'Fearless, protective initiator who books Friday dinner in 90 seconds flat',
  },
  {
    id: 'taurus',
    label: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    herVibe: 'Sensory-luxury queen who notices thread counts, Sancerre, and slow touch',
    himVibe: 'Steady linen-apron chef who cooks from scratch and never rushes her pace',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    symbol: '♊',
    element: 'Air',
    herVibe: 'Quick-witted conversationalist who needs playful banter before appetizers',
    himVibe: 'Curious, charming storyteller who keeps every museum walk unpredictable',
  },
  {
    id: 'cancer',
    label: 'Cancer',
    symbol: '♋',
    element: 'Water',
    herVibe: 'Warm sanctuary builder with soft Mommy-Domme intuition and fierce loyalty',
    himVibe: 'Devoted Golden-Retriever caretaker who remembers her exact morning coffee',
  },
  {
    id: 'leo',
    label: 'Leo',
    symbol: '♌',
    element: 'Fire',
    herVibe: 'Radiant main-character Cougar who thrives on grand chivalry and devotion',
    himVibe: 'Sunny, proud +1 who pulls out her chair and beams past every stare',
  },
  {
    id: 'virgo',
    label: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    herVibe: 'Selective Black-Cat perfectionist who clocks a lidded bathroom bin instantly',
    himVibe: 'Observant Acts-of-Service pro with spotless counters and 10-step skincare',
  },
  {
    id: 'libra',
    label: 'Libra',
    symbol: '♎',
    element: 'Air',
    herVibe: 'Effortless Princess-Cougar aesthete drawn to candlelit booths and peonies',
    himVibe: 'Tailored old-soul gentleman with car-door manners and gallery memberships',
  },
  {
    id: 'scorpio',
    label: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    herVibe: 'Magnetic slow-burn powerhouse who sees straight through fake flexing',
    himVibe: 'Intense, locked-in Cub who worships privacy, eye contact, and deep trust',
  },
  {
    id: 'sagittarius',
    label: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    herVibe: 'Passport-ready adventurer with zero patience for clinginess or boredom',
    himVibe: 'Upbeat weekend co-pilot ready for 18-hour coastal drives on two hours’ notice',
  },
  {
    id: 'capricorn',
    label: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    herVibe: 'Corner-office executive who craves turning her brain off at 7:30 PM',
    himVibe: 'Composed "Cub Daddy" planner with grown-man follow-through well beyond his years',
  },
  {
    id: 'aquarius',
    label: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    herVibe: 'Unbothered rule-breaker who laughs at societal age-gap conventions',
    himVibe: 'Indie creative thinker who loves her mind first and never crowds her autonomy',
  },
  {
    id: 'pisces',
    label: 'Pisces',
    symbol: '♓',
    element: 'Water',
    herVibe: 'Dreamy, affectionate romantic who melts for handwritten notes and vinyl',
    himVibe: 'Poetic, emotionally fluent sweetheart with 100% presence after dark',
  },
];

function computeZodiacPairing(her: ZodiacSignInfo, him: ZodiacSignInfo) {
  const pairKey = `${her.element}-${him.element}`;
  let rating = '91% Slow-Burn Spark';
  let polarity = 'Complementary Cross-Generational Pull';
  let dateIdea = 'Candlelit corner wine booth + unhurried vinyl nightcap';
  let vettingTip = 'Match her texting cadence and never rush intimacy before trust lands.';

  if (her.id === him.id) {
    rating = '94% Twin-Mirror Voltage';
    polarity = `Double ${her.label} Recognition`;
    dateIdea = 'Late-night omakase counter + trading war stories until midnight';
    vettingTip = 'You share the exact same blind spots, so take turns leading Friday logistics!';
  } else if (
    (her.element === 'Fire' && him.element === 'Air') ||
    (her.element === 'Air' && him.element === 'Fire')
  ) {
    rating = '97% High-Octane Banter & Passport Chemistry';
    polarity = `${her.element} × ${him.element} Combustible Spark`;
    dateIdea = '18-hour boutique hotel rooftop + heated midnight pool escape';
    vettingTip = 'Keep the banter playful and confirm Thursday reservations by Tuesday noon.';
  } else if (
    (her.element === 'Earth' && him.element === 'Water') ||
    (her.element === 'Water' && him.element === 'Earth')
  ) {
    rating = '98% Sanctuary & Linen-Apron Soulmate Tier';
    polarity = `${her.element} × ${him.element} Grounded Devotion`;
    dateIdea = 'Farmers-market haul + handmade Sunday pasta in a 64°F lamp-lit apartment';
    vettingTip = 'Consistency is oxygen here: follow through on every small promise.';
  } else if (
    (her.element === 'Fire' && him.element === 'Earth') ||
    (her.element === 'Earth' && him.element === 'Fire')
  ) {
    rating = '95% Powerhouse × Steady Anchor Polarity';
    polarity = 'Glamour Meets Grounded Follow-Through';
    dateIdea = '6 PM lobby dirty martinis + pre-booked corner steakhouse booth';
    vettingTip = 'Earth handles the calendar and parking; Fire brings the fearless spark.';
  } else if (pairKey === 'Fire-Fire' || pairKey === 'Water-Water') {
    rating = '96% All-In Magnetic Heat';
    polarity = `Pure ${her.element}-Sign Immersion`;
    dateIdea = 'Hotel lobby bar eye-contact game + coastal sunset drive';
    vettingTip = 'Zero ego battles allowed; keep communication candid and generous.';
  } else {
    rating = '92% Intriguing Black-Cat × Golden-Cub Contrast';
    polarity = `${her.label} Poise × ${him.label} Curiosity`;
    dateIdea = 'Thursday art gallery opening + retro neon bowling nightcap';
    vettingTip = 'Bridge your styles by asking great questions instead of Cubsplaining.';
  }

  return {
    rating,
    polarity,
    summary: `Her (${her.symbol} ${her.label}): ${her.herVibe}. Him (${him.symbol} ${him.label}): ${him.himVibe}.`,
    dateIdea,
    vettingTip,
  };
}

interface GuideVisualMeta {
  heroPhoto: string;
  dontText: string;
  doText: string;
  greenFlag: string;
  redFlag: string;
}

const GUIDE_VISUAL_BY_SLUG: Record<string, GuideVisualMeta> = {
  'cougar-vs-puma-vs-jaguar-dating-age-chart': {
    heroPhoto: './images/scenes/velvet-room-bar.jpg',
    dontText: 'ngl never been with a cougar before, bucket list check tonight??',
    doText: 'Booked us the quiet corner booth at 7:30 Friday—Sancerre is already on deck.',
    greenFlag: 'Knows Cougar never means Sugar Mama and takes Friday planning off her plate.',
    redFlag: 'Treats accomplished women like a novelty badge or expects her to fund his rent.',
  },
  'first-time-hosting-older-woman-apartment-checklist': {
    heroPhoto: './images/scenes/sunday-kitchen-sanctuary.jpg',
    dontText: 'come thru whenever lol my roommate left dishes in the sink',
    doText: 'Dinner is simmering, lamps are dimmed, and chilled Pellegrino is waiting whenever you arrive.',
    greenFlag: 'Lidded bathroom bin, botanical hand soap, four real pillows, and crisp cotton sheets.',
    redFlag: 'Bare floor mattress, neon 5-in-1 body wash, and harsh overhead fluorescent lighting.',
  },
  'best-gifts-for-older-woman-girlfriend-dating-guide': {
    heroPhoto: './images/scenes/palm-springs-resort.jpg',
    dontText: 'i didnt know what to get u since u already buy everything lol',
    doText: 'Remembered the Sicilian olive oil you loved three weeks ago—plus Sunday dinner is on me.',
    greenFlag: 'Gifts specific personal observation, sensory silk comfort, and cooked-from-scratch rituals.',
    redFlag: 'Competes insecurely with her salary or panic-buys impersonal mall clutter.',
  },
  'millennial-vs-gen-z-age-gap-dating-code-switching': {
    heroPhoto: './images/scenes/wine-bar-booth.jpg',
    dontText: 'yo u look crazy good for ur age whats ur snap??',
    doText: 'Here is my cell—free for a quick 6 PM call Thursday before our Friday 7:30 reservation?',
    greenFlag: 'Exchanges real phone numbers, reads Gen-X punctuation calmly, and confirms dates.',
    redFlag: 'Asks a 44-year-old executive for Snapchat or spirals over a sincere thumbs-up emoji.',
  },
};

function getGuideVisualMeta(slug: string): GuideVisualMeta {
  return (
    GUIDE_VISUAL_BY_SLUG[slug] ?? {
      heroPhoto: './images/scenes/hotel-pool-sauna.jpg',
      dontText: 'idk what do u wanna do tonight?? u pick',
      doText: 'Reserved two seats at 7:30—wear whatever feels effortless and I will handle the rest.',
      greenFlag: 'Brings emotional fluency, calm public confidence, and unhurried follow-through.',
      redFlag: 'Dumps decision fatigue onto her calendar or hides behind vague midnight texts.',
    }
  );
}

const CHECKLIST_INLINE_PRODUCT_IDS: string[] = [
  'hosting-lidded-bin-soap',
  'hosting-lidded-bin-soap',
  'cub-grooming-beard-skincare-kit',
  'percale-hosting-sheets',
  'percale-hosting-sheets',
  'cooling-bamboo-sheets',
  'espresso-martini-barware',
  'zero-proof-botanical-mocktail-set',
  'silk-pillowcase-sleepover-duo',
  'golden-retriever-boyfriend-mug',
];

const MOVIE_WATCHLIST_IDS = [
  'no-hard-feelings-jlaw-prime',
  'babygirl-movie-prime',
  'idea-of-you-movie-book',
  'bridget-jones-cougar-town-watch',
  'the-rebound-zeta-jones-prime',
];

const HOSTING_STORAGE_KEY = 'cc_hosting_10pt_v1';

function loadHostingChecks(): number[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(HOSTING_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

export const VelvetJournalView: React.FC<VelvetJournalViewProps> = ({
  initialSlug,
  onPlayScenario,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialSlug && JOURNAL_ARTICLES.some((a) => a.slug === initialSlug)
      ? initialSlug
      : JOURNAL_ARTICLES[0].slug,
  );
  const [hostingChecks, setHostingChecks] = useState<number[]>(() => loadHostingChecks());
  const [herSignId, setHerSignId] = useState<string>('scorpio');
  const [himSignId, setHimSignId] = useState<string>('taurus');
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  const active =
    JOURNAL_ARTICLES.find((a) => a.slug === selectedSlug) ?? JOURNAL_ARTICLES[0];
  const visualMeta = getGuideVisualMeta(active.slug);

  const handleSelectArticle = (slug: string) => {
    setSelectedSlug(slug);
    trackEvent('guide_opened', { slug });
  };

  const toggleHostingCheck = (idx: number) => {
    sfx.messagePop();
    const next = hostingChecks.includes(idx)
      ? hostingChecks.filter((i) => i !== idx)
      : [...hostingChecks, idx];
    setHostingChecks(next);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(HOSTING_STORAGE_KEY, JSON.stringify(next));
      }
    } catch {
      // Ignore storage block
    }
  };

  const herSign = ZODIAC_SIGNS.find((s) => s.id === herSignId) ?? ZODIAC_SIGNS[7];
  const himSign = ZODIAC_SIGNS.find((s) => s.id === himSignId) ?? ZODIAC_SIGNS[1];
  const zodiacMatch = computeZodiacPairing(herSign, himSign);

  const handleShareGuide = () => {
    const guideUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}guides/${active.slug}/`;
    setSharePayload({
      title: active.headline,
      message: `📖 Cougars & Cubs Club Field Guide: "${active.headline}" (${active.readTime})`,
      url: guideUrl,
      shareSurface: 'guide',
      discordMarkdown: `**📖 ${active.headline}** (${active.readTime})\n${active.metaDescription}\nRead & play scenario: ${guideUrl}`,
    });
  };

  const isMovieGuide =
    active.slug === 'master-list-cougar-cub-movies-older-woman-younger-man' ||
    active.slug === 'movies-like-babygirl-idea-of-you-bridget-jones-older-woman-younger-man';

  return (
    <>
      <div className="w-full space-y-6 animate-stage-in">
        {/* Editorial Magazine Header */}
        <div className="editorial-hinge-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#FFFDF9] via-rose-50/40 to-amber-50/40">
          <div className="space-y-2 max-w-3xl">
            <span className="inline-block rounded-full bg-amber-100 border border-amber-300/70 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-amber-950">
              Cougars &amp; Cubs Club • Visual Field Manual &amp; Shoppable Date Guides
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#18101E]">
              Real Etiquette, 10-Point Hosting Audit, 12-Sign Matcher &amp; Curated Picks
            </h1>
            <p className="text-xs sm:text-sm font-medium text-stone-600">
              Reader Disclosure: When you shop curated picks below, we may earn a small affiliate commission at no extra cost to you.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleShareGuide}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#18101E] cursor-pointer"
            >
              <Share2 className="h-4 w-4 text-rose-600" />
              <span>Share Guide</span>
            </button>
            <button
              type="button"
              onClick={() => onPlayScenario(active.featuredEpisodeId)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-rose-700 cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Play Scenario Free</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr] items-start">
          <aside className="editorial-hinge-card rounded-3xl bg-white p-4 space-y-2 lg:sticky lg:top-24">
            <div className="px-2 pb-1 text-xs font-extrabold uppercase tracking-wide text-stone-500">
              All {JOURNAL_ARTICLES.length} Complete Club Guides
            </div>
            <div className="space-y-1.5">
              {JOURNAL_ARTICLES.map((art, idx) => {
                const isSelected = art.slug === active.slug;
                return (
                  <button
                    key={art.slug}
                    type="button"
                    onClick={() => handleSelectArticle(art.slug)}
                    className={`w-full flex items-start gap-2.5 rounded-2xl border p-3 text-left text-xs sm:text-sm font-semibold whitespace-normal transition cursor-pointer ${
                      isSelected
                        ? 'border-[#18101E] bg-[#18101E] text-white shadow-sm'
                        : 'border-stone-200/80 bg-stone-50/70 text-[#18101E] hover:border-stone-400 hover:bg-white'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-extrabold ${
                        isSelected ? 'bg-amber-300 text-[#18101E]' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-snug">{art.seoTitle}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <article className="editorial-hinge-card rounded-3xl bg-white p-6 sm:p-8 space-y-6">
            {/* Hero Editorial Photo */}
            <div className="relative overflow-hidden rounded-3xl border border-stone-200 aspect-[21/9] bg-stone-900">
              <img
                src={visualMeta.heroPhoto}
                alt={active.headline}
                data-testid="guide-hero-photo"
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18101E]/85 via-[#18101E]/25 to-transparent flex flex-col justify-end p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-rose-700">
                    ⏱️ {active.readTime}
                  </span>
                  <button
                    type="button"
                    onClick={handleShareGuide}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#18101E] cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 text-rose-600" />
                    <span>Send to Date or Group Chat</span>
                  </button>
                </div>
                <h2 className="mt-2 font-editorial text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {active.headline}
                </h2>
              </div>
            </div>

            <p className="text-base font-medium leading-relaxed text-stone-700">{active.intro}</p>

            {/* ABOVE-THE-FOLD Shoppable Product Strip (Real Product Photography) */}
            <section
              data-testid="guide-above-fold-shop"
              className="rounded-3xl border border-amber-200 bg-amber-50/50 p-5 space-y-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-950">
                  🛍️ Editor’s Date-Night &amp; Hosting Picks for This Guide
                </span>
                <span className="text-[11px] font-semibold text-stone-500">
                  Verified Amazon Picks • Opens in New Tab
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {active.featuredAffiliateIds.slice(0, 2).map((id) => {
                  const item = getAffiliateById(id);
                  if (!item) return null;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-stone-200 bg-white p-3.5 flex flex-col justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-2">
                        <ProductVisualThumbnail item={item} />
                        <h3 className="text-sm font-bold text-[#18101E] leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed">{item.cheekyPitch}</p>
                      </div>
                      <a
                        href={buildAffiliateUrl(item, `journal_top_${active.slug}`)}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={() =>
                          trackEvent('affiliate_clicked', {
                            item_id: item.id,
                            surface: 'journal_above_fold',
                            slug: active.slug,
                          })
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#18101E] py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition"
                      >
                        <span>Shop on Amazon ({item.priceDisplay})</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* "Text This, Not That" iMessage Visual Callout + Green/Red Flag Split */}
            <div className="grid gap-4 md:grid-cols-2">
              <div
                data-testid="guide-text-this-not-that"
                className="rounded-3xl border border-stone-200 bg-stone-50/70 p-5 space-y-3"
              >
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-stone-700">
                  <MessageCircle className="h-3.5 w-3.5 text-[#007AFF]" />
                  <span>Text This, Not That</span>
                </div>
                <div className="rounded-2xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-medium text-rose-950">
                  <div className="font-extrabold uppercase text-[10px] text-rose-700 mb-0.5">
                    ❌ Instant Left-on-Read
                  </div>
                  &ldquo;{visualMeta.dontText}&rdquo;
                </div>
                <div className="rounded-2xl bg-[#007AFF] px-3.5 py-2.5 text-xs font-medium text-white shadow-xs">
                  <div className="font-extrabold uppercase text-[10px] text-sky-100 mb-0.5">
                    ✅ S-Rank Blue Bubble
                  </div>
                  &ldquo;{visualMeta.doText}&rdquo;
                </div>
              </div>

              <div
                data-testid="guide-green-red-flags"
                className="rounded-3xl border border-stone-200 bg-stone-50/70 p-5 space-y-3"
              >
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-stone-700">
                  <Flag className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Green Flag vs. Red Flag</span>
                </div>
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs text-emerald-950">
                  <div className="inline-flex items-center gap-1 font-extrabold text-[11px] text-emerald-800 mb-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Green Flag Standard
                  </div>
                  <p className="leading-relaxed">{visualMeta.greenFlag}</p>
                </div>
                <div className="rounded-2xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-950">
                  <div className="inline-flex items-center gap-1 font-extrabold text-[11px] text-rose-800 mb-0.5">
                    <Flag className="h-3.5 w-3.5" /> Dealbreaker Tell
                  </div>
                  <p className="leading-relaxed">{visualMeta.redFlag}</p>
                </div>
              </div>
            </div>

            {/* Interactive 10-Point Apartment Hosting Checklist (100% Shoppable Inline Links) */}
            {active.checklistItems && active.checklistItems.length > 0 && (
              <div
                data-testid="guide-hosting-checklist"
                className="rounded-3xl border border-amber-300 bg-amber-50/60 p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-200/80 px-2.5 py-0.5 text-xs font-extrabold uppercase text-amber-950">
                      <Sparkles className="h-3.5 w-3.5" /> Interactive Pre-Date Audit
                    </span>
                    <h3 className="mt-1 font-editorial text-xl font-bold text-[#18101E]">
                      Check Off All {active.checklistItems.length} Hosting Essentials
                    </h3>
                  </div>
                  <div className="rounded-full border border-stone-300 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-[#18101E]">
                    {hostingChecks.length}/{active.checklistItems.length} Ready
                  </div>
                </div>
                <div className="grid gap-2">
                  {active.checklistItems.map((itemText, idx) => {
                    const checked = hostingChecks.includes(idx);
                    const linkedProduct = getAffiliateById(
                      CHECKLIST_INLINE_PRODUCT_IDS[idx] ?? 'hosting-lidded-bin-soap',
                    );
                    return (
                      <div
                        key={itemText}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border px-3.5 py-2.5 text-sm transition ${
                          checked
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-950 font-bold'
                            : 'border-stone-200 bg-white text-[#18101E] font-medium'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleHostingCheck(idx)}
                          className="flex items-start gap-2.5 text-left whitespace-normal cursor-pointer flex-1"
                        >
                          {checked ? (
                            <CheckSquare className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                          ) : (
                            <Square className="h-4 w-4 shrink-0 text-stone-400 mt-0.5" />
                          )}
                          <span>
                            <strong className="mr-1.5">#{idx + 1}.</strong>
                            {itemText}
                          </span>
                        </button>
                        {linkedProduct && (
                          <a
                            href={buildAffiliateUrl(linkedProduct, `checklist_row_${idx + 1}`)}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="shrink-0 inline-flex items-center gap-1 rounded-full bg-stone-100 hover:bg-[#18101E] hover:text-white px-3 py-1 text-[11px] font-extrabold text-[#18101E] transition"
                          >
                            <span>🛍️ Get Pick</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shoppable Cinema Watchlist Strip on Movie Guides */}
            {isMovieGuide && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-5 space-y-3">
                <div className="text-xs font-extrabold uppercase tracking-wider text-rose-800">
                  🎬 Stream or Read the Essential Watchlist on Amazon
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {MOVIE_WATCHLIST_IDS.map((id) => {
                    const movieItem = getAffiliateById(id);
                    if (!movieItem) return null;
                    return (
                      <a
                        key={id}
                        href={buildAffiliateUrl(movieItem, `watchlist_${active.slug}`)}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="flex items-center justify-between gap-2.5 rounded-2xl border border-stone-200 bg-white p-3 text-xs font-bold text-[#18101E] hover:border-rose-400 transition"
                      >
                        <span className="leading-snug">{movieItem.name}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interactive 12-Sign Her x Him Zodiac Chemistry Matcher */}
            {active.slug === 'astrology-zodiac-compatibility-older-woman-younger-man' && (
              <div
                className="rounded-3xl border border-stone-200 bg-gradient-to-br from-rose-50/50 via-white to-amber-50/50 p-5 sm:p-6 space-y-4"
                data-testid="zodiac-12x12-matcher"
              >
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold uppercase text-amber-950">
                    <Sparkles className="h-3.5 w-3.5" /> All 12 Signs × All 12 Signs
                  </span>
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#18101E]">
                    Interactive Her × Him Star-Sign Chemistry Matcher
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-rose-700">
                      Her Star Sign (12 Signs)
                    </span>
                    <select
                      aria-label="Her Star Sign"
                      value={herSignId}
                      onChange={(e) => setHerSignId(e.target.value)}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-bold text-[#18101E]"
                    >
                      {ZODIAC_SIGNS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.symbol} {s.label} ({s.element})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-[#18101E]">
                      His Star Sign (12 Signs)
                    </span>
                    <select
                      aria-label="His Star Sign"
                      value={himSignId}
                      onChange={(e) => setHimSignId(e.target.value)}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-bold text-[#18101E]"
                    >
                      {ZODIAC_SIGNS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.symbol} {s.label} ({s.element})
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-editorial text-xl font-bold text-[#18101E]">
                      {herSign.symbol} {herSign.label} Her × {himSign.symbol} {himSign.label} Cub
                    </span>
                    <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-extrabold text-rose-700">
                      {zodiacMatch.rating}
                    </span>
                  </div>
                  <div className="text-xs font-extrabold uppercase tracking-wide text-stone-500">
                    {zodiacMatch.polarity}
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-stone-700">
                    {zodiacMatch.summary}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2 pt-1 text-xs font-semibold text-[#18101E]">
                    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                      <strong className="text-rose-700">🍸 Signature Date:</strong>{' '}
                      {zodiacMatch.dateIdea}
                    </div>
                    <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                      <strong className="text-emerald-800">🛡️ Club Playbook Tip:</strong>{' '}
                      {zodiacMatch.vettingTip}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {active.sections.map((sec) => (
                <section
                  key={sec.heading}
                  className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-5 space-y-2"
                >
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#18101E]">
                    {sec.heading}
                  </h3>
                  <p className="whitespace-pre-line text-[15px] font-medium leading-relaxed text-stone-700">
                    {sec.body}
                  </p>
                </section>
              ))}
            </div>

            {active.faqs.length > 0 && (
              <div className="space-y-3 border-t border-stone-200 pt-5">
                <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#18101E]">
                  Quick Club FAQ
                </h3>
                <div className="grid gap-3">
                  {active.faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="rounded-2xl border border-stone-200 bg-white p-4 space-y-1"
                    >
                      <div className="text-sm font-bold text-[#18101E]">{faq.question}</div>
                      <p className="text-sm font-medium text-stone-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-stone-200 bg-stone-50/80 p-6 space-y-4">
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#18101E]">
                🛍️ Complete Curated Picks for This Guide
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 items-stretch">
                {active.featuredAffiliateIds.map((id) => {
                  const item = getAffiliateById(id);
                  if (!item) return null;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-stone-200 bg-white p-4 flex flex-col justify-between gap-3 h-full shadow-2xs"
                    >
                      <div className="space-y-2.5">
                        <ProductVisualThumbnail item={item} />
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-950">
                            {item.badge}
                          </span>
                          <span className="text-xs font-extrabold text-rose-700">
                            {item.priceDisplay}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-[#18101E]">{item.name}</h4>
                        <p className="text-xs sm:text-sm font-medium text-stone-600 leading-relaxed">
                          {item.cheekyPitch}
                        </p>
                      </div>
                      <a
                        href={buildAffiliateUrl(item, `journal_${active.slug}`)}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={() =>
                          trackEvent('affiliate_clicked', {
                            item_id: item.id,
                            surface: 'journal',
                            slug: active.slug,
                          })
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-rose-600 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-rose-700 transition"
                      >
                        <span>Shop Protected Pick</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        </div>
      </div>

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </>
  );
};
