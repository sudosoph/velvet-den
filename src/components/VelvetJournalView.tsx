import React, { useState } from 'react';
import { CheckSquare, ExternalLink, Play, Share2, Sparkles, Square } from 'lucide-react';
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
  let polarity = ' Complementary Cross-Generational Pull';
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

  return (
    <>
      <div className="w-full space-y-6 animate-stage-in">
        {/* Aligned Top Magazine Banner */}
        <div className="vice-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#FFFDF9] via-[#FFF4F7] to-[#FFFBEB]">
          <div className="space-y-2 max-w-3xl">
            <span className="inline-block rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-[#1E1022]">
              Cougars &amp; Cubs Club • Interactive Field Manual &amp; Gift Guides
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-[#1E1022]">
              Real Etiquette, 10-Point Hosting Audit, 12-Sign Matcher &amp; Date Guides
            </h1>
            <p className="text-sm font-medium text-[#5A4664]">
              Reader Disclosure: When you shop curated picks below, we may earn a small affiliate commission at no extra cost to you.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleShareGuide}
              className="pop-btn inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFBE0B] px-4 py-3 text-sm font-extrabold text-[#1E1022] cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Guide</span>
            </button>
            <button
              type="button"
              onClick={() => onPlayScenario(active.featuredEpisodeId)}
              className="pop-btn inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF2E63] px-5 py-3 text-sm font-extrabold text-white cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Play Scenario Free</span>
            </button>
          </div>
        </div>

        {/* 2-Column Layout: Left = Uniform Directory, Right = Complete Interactive Article */}
        <div className="grid gap-6 lg:grid-cols-[340px_1fr] items-start">
          <aside className="vice-panel rounded-3xl p-4 space-y-2 lg:sticky lg:top-24">
            <div className="px-2 pb-1 text-xs font-extrabold uppercase tracking-wide text-[#5A4664]">
              All {JOURNAL_ARTICLES.length} Complete Club Guides
            </div>
            <div className="space-y-2">
              {JOURNAL_ARTICLES.map((art, idx) => {
                const isSelected = art.slug === active.slug;
                return (
                  <button
                    key={art.slug}
                    type="button"
                    onClick={() => handleSelectArticle(art.slug)}
                    className={`w-full flex items-start gap-2.5 rounded-2xl border-2 p-3 text-left text-sm font-bold transition cursor-pointer ${
                      isSelected
                        ? 'border-[#1E1022] bg-[#FFBE0B] text-[#1E1022] shadow-[3px_3px_0px_#1E1022]'
                        : 'border-[#1E1022]/15 bg-[#FFF7F0] text-[#1E1022] hover:border-[#1E1022] hover:bg-white'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#1E1022] text-xs font-extrabold ${
                        isSelected ? 'bg-white text-[#1E1022]' : 'bg-[#FF2E63] text-white'
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

          <article className="vice-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-[#1E1022]/10 pb-5">
              <div className="space-y-2">
                <span className="inline-block rounded-full bg-[#FFE3EC] px-3 py-1 text-xs font-extrabold text-[#D90452]">
                  ⏱️ {active.readTime}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-[#1E1022]">
                  {active.headline}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleShareGuide}
                className="pop-btn inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-extrabold text-[#1E1022] cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5 text-[#FF2E63]" />
                <span>Send to Date or Group Chat</span>
              </button>
            </div>

            <p className="text-base font-medium leading-relaxed text-[#34223B]">{active.intro}</p>

            {/* Interactive 10-Point Apartment Hosting Checklist */}
            {active.checklistItems && active.checklistItems.length > 0 && (
              <div className="rounded-3xl border-2 border-[#1E1022] bg-[#FFFBEB] p-5 sm:p-6 space-y-4 shadow-[3px_3px_0px_#1E1022]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-xs font-extrabold uppercase text-[#1E1022]">
                      <Sparkles className="h-3.5 w-3.5" /> Interactive Pre-Date Audit
                    </span>
                    <h3 className="mt-1 font-display text-xl text-[#1E1022]">
                      Check Off All {active.checklistItems.length} Hosting Essentials
                    </h3>
                  </div>
                  <div className="rounded-2xl border-2 border-[#1E1022] bg-white px-3.5 py-1.5 text-sm font-extrabold text-[#1E1022]">
                    {hostingChecks.length}/{active.checklistItems.length} Ready
                  </div>
                </div>
                <div className="grid gap-2">
                  {active.checklistItems.map((itemText, idx) => {
                    const checked = hostingChecks.includes(idx);
                    return (
                      <button
                        key={itemText}
                        type="button"
                        onClick={() => toggleHostingCheck(idx)}
                        className={`flex items-start gap-2.5 rounded-xl border-2 px-3.5 py-2.5 text-left text-sm transition cursor-pointer ${
                          checked
                            ? 'border-[#1E1022] bg-[#D1FAE5] text-[#065F46] font-extrabold'
                            : 'border-[#1E1022]/20 bg-white text-[#1E1022] font-semibold hover:border-[#1E1022]'
                        }`}
                      >
                        {checked ? (
                          <CheckSquare className="h-4 w-4 shrink-0 text-[#065F46] mt-0.5" />
                        ) : (
                          <Square className="h-4 w-4 shrink-0 text-[#5A4664] mt-0.5" />
                        )}
                        <span>
                          <strong className="mr-1.5">#{idx + 1}.</strong>
                          {itemText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interactive 12-Sign Her x Him Zodiac Chemistry Matcher */}
            {active.slug === 'astrology-zodiac-compatibility-older-woman-younger-man' && (
              <div
                className="rounded-3xl border-2 border-[#1E1022] bg-gradient-to-br from-[#FFF4F7] via-[#FFFDF9] to-[#FFFBEB] p-5 sm:p-6 space-y-4 shadow-[3px_3px_0px_#1E1022]"
                data-testid="zodiac-12x12-matcher"
              >
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-xs font-extrabold uppercase text-[#1E1022]">
                    <Sparkles className="h-3.5 w-3.5" /> All 12 Signs × All 12 Signs
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl text-[#1E1022]">
                    Interactive Her × Him Star-Sign Chemistry Matcher
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-[#D90452]">
                      Her Star Sign (12 Signs)
                    </span>
                    <select
                      aria-label="Her Star Sign"
                      value={herSignId}
                      onChange={(e) => setHerSignId(e.target.value)}
                      className="w-full rounded-2xl border-2 border-[#1E1022] bg-white px-3.5 py-2.5 text-sm font-extrabold text-[#1E1022]"
                    >
                      {ZODIAC_SIGNS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.symbol} {s.label} ({s.element})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-[#1E1022]">
                      His Star Sign (12 Signs)
                    </span>
                    <select
                      aria-label="His Star Sign"
                      value={himSignId}
                      onChange={(e) => setHimSignId(e.target.value)}
                      className="w-full rounded-2xl border-2 border-[#1E1022] bg-white px-3.5 py-2.5 text-sm font-extrabold text-[#1E1022]"
                    >
                      {ZODIAC_SIGNS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.symbol} {s.label} ({s.element})
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="rounded-2xl border-2 border-[#1E1022] bg-white p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display text-xl text-[#1E1022]">
                      {herSign.symbol} {herSign.label} Her × {himSign.symbol} {himSign.label} Cub
                    </span>
                    <span className="rounded-full border border-[#1E1022] bg-[#FFE3EC] px-3 py-1 text-xs font-extrabold text-[#D90452]">
                      {zodiacMatch.rating}
                    </span>
                  </div>
                  <div className="text-xs font-extrabold uppercase tracking-wide text-[#5A4664]">
                    {zodiacMatch.polarity}
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-[#34223B]">
                    {zodiacMatch.summary}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2 pt-1 text-xs font-semibold text-[#1E1022]">
                    <div className="rounded-xl border border-[#1E1022]/15 bg-[#FFFBEB] p-3">
                      <strong className="text-[#D90452]">🍸 Signature Date:</strong>{' '}
                      {zodiacMatch.dateIdea}
                    </div>
                    <div className="rounded-xl border border-[#1E1022]/15 bg-[#FFF7F0] p-3">
                      <strong className="text-[#065F46]">🛡️ Club Playbook Tip:</strong>{' '}
                      {zodiacMatch.vettingTip}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {active.sections.map((sec) => (
                <section
                  key={sec.heading}
                  className="rounded-2xl border-2 border-[#1E1022]/12 bg-[#FFF7F0] p-5 space-y-2"
                >
                  <h3 className="font-display text-lg sm:text-xl text-[#1E1022]">{sec.heading}</h3>
                  <p className="whitespace-pre-line text-[15px] font-medium leading-relaxed text-[#3D2A45]">
                    {sec.body}
                  </p>
                </section>
              ))}
            </div>

            {active.faqs.length > 0 && (
              <div className="space-y-3 border-t-2 border-[#1E1022]/10 pt-5">
                <h3 className="font-display text-lg sm:text-xl text-[#1E1022]">
                  Quick Club FAQ
                </h3>
                <div className="grid gap-3">
                  {active.faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="rounded-2xl border-2 border-[#1E1022]/15 bg-white p-4 space-y-1"
                    >
                      <div className="text-sm font-extrabold text-[#1E1022]">{faq.question}</div>
                      <p className="text-sm font-medium text-[#5A4664] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pop-well rounded-3xl p-6 space-y-4">
              <h3 className="font-display text-xl sm:text-2xl text-[#1E1022]">
                🛍️ Curated Date-Night &amp; Hosting Essentials
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 items-stretch">
                {active.featuredAffiliateIds.map((id) => {
                  const item = getAffiliateById(id);
                  if (!item) return null;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border-2 border-[#1E1022] bg-white p-4 shadow-[3px_3px_0px_#1E1022] flex flex-col justify-between gap-3 h-full"
                    >
                      <div className="space-y-2.5">
                        <ProductVisualThumbnail item={item} />
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-xs font-extrabold text-[#1E1022]">
                            {item.badge}
                          </span>
                          <span className="text-sm font-extrabold text-[#D90452]">
                            {item.priceDisplay}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-[#1E1022]">{item.name}</h4>
                        <p className="text-sm font-medium text-[#5A4664] leading-relaxed">
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
                        className="pop-btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FF2E63] py-2.5 text-sm font-extrabold text-white hover:bg-[#E01E50]"
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
