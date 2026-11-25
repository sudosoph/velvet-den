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
    <div className="mx-auto max-w-5xl space-y-6 animate-stage-in">
      <div className="vice-panel rounded-3xl bg-[#150f24]/95 p-6 sm:p-8 space-y-4">
        <span className="inline-block rounded-full border border-amber-300/30 bg-amber-400/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-200">
          Cougars &amp; Cubs Club • Age-Gap Dating &amp; Gift Guides
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-white">
          Real Etiquette, Hosting Checklists &amp; Date-Night Guides for Cougars &amp; Cubs
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Reader Disclosure: When you shop curated picks below, we may earn a small affiliate commission at no extra cost to you.
        </p>

        <div className="pt-2 flex flex-wrap gap-2">
          {JOURNAL_ARTICLES.map((art) => (
            <button
              key={art.slug}
              type="button"
              onClick={() => setSelectedSlug(art.slug)}
              className={`rounded-2xl border px-3.5 py-2 text-left text-xs sm:text-sm font-semibold transition cursor-pointer ${
                art.slug === active.slug
                  ? 'border-amber-300/60 bg-amber-300 text-slate-950 font-bold'
                  : 'border-white/12 bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              {art.seoTitle}
            </button>
          ))}
        </div>
      </div>

      <article className="vice-panel rounded-3xl bg-[#150f24]/95 p-6 sm:p-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-amber-300">{active.readTime}</span>
            <h2 className="mt-1 font-display text-2xl sm:text-4xl text-white">
              {active.seoTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onPlayScenario(active.featuredEpisodeId)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 px-5 py-3 text-sm font-bold text-slate-950 shadow hover:brightness-105 transition cursor-pointer"
          >
            <Play className="h-4 w-4" />
            <span>Play Interactive Scenario Free</span>
          </button>
        </div>

        <p className="text-base sm:text-lg leading-relaxed text-slate-200">{active.intro}</p>

        {active.sections.map((sec) => (
          <section key={sec.heading} className="space-y-2.5">
            <h3 className="font-display text-xl sm:text-2xl text-amber-200">{sec.heading}</h3>
            <p className="text-base leading-relaxed text-slate-200">{sec.body}</p>
          </section>
        ))}

        <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-6 space-y-4">
          <h3 className="font-display text-xl sm:text-2xl text-white">
            🛍️ Curated Date-Night &amp; Hosting Essentials
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {active.featuredAffiliateIds.map((id) => {
              const item = getAffiliateById(id);
              if (!item) return null;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/12 bg-black/35 p-4 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-amber-300/20 px-2.5 py-0.5 text-xs font-bold text-amber-200">
                        {item.badge}
                      </span>
                      <span className="text-sm font-bold text-amber-300">{item.priceDisplay}</span>
                    </div>
                    <h4 className="mt-2 text-base font-bold text-white">{item.name}</h4>
                    <p className="mt-1 text-sm text-slate-300 leading-relaxed">{item.cheekyPitch}</p>
                  </div>
                  <a
                    href={buildAffiliateUrl(item, `journal_${active.slug}`)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-300 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-200 transition"
                  >
                    <span>Shop Pick</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </article>
    </div>
  );
};
