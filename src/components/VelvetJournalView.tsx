import React, { useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { JOURNAL_ARTICLES } from '../data/journalArticles';
import { buildAffiliateUrl, getAffiliateById } from '../lib/affiliates';

interface VelvetJournalViewProps {
  initialSlug?: string | null;
  onPlayScenario: (episodeId: string) => void;
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

  const active =
    JOURNAL_ARTICLES.find((a) => a.slug === selectedSlug) ?? JOURNAL_ARTICLES[0];

  return (
    <div className="space-y-6">
      <div className="vice-panel rounded-3xl bg-[#180d28] p-5 sm:p-7">
        <span className="rounded bg-teal-400/20 px-2.5 py-0.5 text-xs font-extrabold uppercase text-teal-300">
          Cougars &amp; Cubs Club • Age-Gap Dating &amp; Gift Guides
        </span>
        <h1 className="mt-2 font-display text-3xl sm:text-5xl text-white">
          Real Etiquette, Hosting Checklists &amp; Date-Night Guides for Cougars &amp; Cubs
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Reader Disclosure: When you shop curated picks below, we may earn a small affiliate commission at no extra cost to you.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {JOURNAL_ARTICLES.map((art) => (
            <button
              key={art.slug}
              type="button"
              onClick={() => setSelectedSlug(art.slug)}
              className={`rounded-xl border-2 border-black px-3 py-2 text-left text-xs font-bold cursor-pointer ${
                art.slug === active.slug
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-black/40 text-slate-200 hover:bg-black/60'
              }`}
            >
              {art.seoTitle}
            </button>
          ))}
        </div>
      </div>

      <article className="vice-panel rounded-3xl bg-[#130b20] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-300">{active.readTime}</span>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl text-white">
              {active.seoTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onPlayScenario(active.featuredEpisodeId)}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-rose-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-[3px_3px_0px_#09050f] hover:bg-rose-400 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Play Interactive Scenario Free</span>
          </button>
        </div>

        <p className="text-sm sm:text-base leading-relaxed text-slate-200">{active.intro}</p>

        {active.sections.map((sec) => (
          <section key={sec.heading} className="space-y-2">
            <h3 className="font-display text-2xl text-teal-300">{sec.heading}</h3>
            <p className="text-sm leading-relaxed text-slate-200">{sec.body}</p>
          </section>
        ))}

        {/* Curated Affiliate Picks Inside Article */}
        <section className="rounded-2xl border-2 border-black bg-[#101c28] p-5 space-y-3">
          <h3 className="font-display text-2xl text-amber-300">
            🛍️ Editor-Vetted Essentials From This Guide
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {active.featuredAffiliateIds
              .map((id) => getAffiliateById(id))
              .filter((p): p is NonNullable<typeof p> => Boolean(p))
              .map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl border border-white/10 bg-black/40 p-3.5 flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-extrabold text-teal-300">{product.badge}</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {product.name} ({product.priceDisplay})
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{product.cheekyPitch}</p>
                  </div>
                  <a
                    href={buildAffiliateUrl(product, `journal_${active.slug}`)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-amber-400 py-2 text-xs font-extrabold text-slate-950"
                  >
                    <span>Check Price</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
          </div>
        </section>

        {/* Structured FAQ */}
        <section className="space-y-3 border-t border-white/10 pt-4">
          <h3 className="font-display text-2xl text-pink-300">Frequently Asked Questions</h3>
          {active.faqs.map((faq) => (
            <div key={faq.question} className="rounded-xl bg-black/40 p-4">
              <h4 className="text-sm font-bold text-white">{faq.question}</h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </section>
      </article>
    </div>
  );
};
