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
    <div className="w-full space-y-6 animate-stage-in">
      {/* Aligned Top Magazine Banner */}
      <div className="vice-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#FFFDF9] via-[#FFF4F7] to-[#FFFBEB]">
        <div className="space-y-2 max-w-3xl">
          <span className="inline-block rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-[#1E1022]">
            Cougars &amp; Cubs Club • Field Manual &amp; Gift Guides
          </span>
          <h1 className="font-display text-2xl sm:text-3xl text-[#1E1022]">
            Real Etiquette, Hosting Checklists &amp; Date-Night Guides
          </h1>
          <p className="text-sm font-medium text-[#5A4664]">
            Reader Disclosure: When you shop curated picks below, we may earn a small affiliate commission at no extra cost to you.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onPlayScenario(active.featuredEpisodeId)}
          className="pop-btn shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF2E63] px-5 py-3.5 text-sm font-extrabold text-white cursor-pointer"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>Play Interactive Scenario Free</span>
        </button>
      </div>

      {/* Razor-Sharp 2-Column Aligned Layout: Left = Uniform Directory, Right = Article */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr] items-start">
        <aside className="vice-panel rounded-3xl p-4 space-y-2 lg:sticky lg:top-24">
          <div className="px-2 pb-1 text-xs font-extrabold uppercase tracking-wide text-[#5A4664]">
            All {JOURNAL_ARTICLES.length} Club Guides
          </div>
          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {JOURNAL_ARTICLES.map((art, idx) => {
              const isSelected = art.slug === active.slug;
              return (
                <button
                  key={art.slug}
                  type="button"
                  onClick={() => setSelectedSlug(art.slug)}
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
          <div className="space-y-2 border-b-2 border-[#1E1022]/10 pb-5">
            <span className="inline-block rounded-full bg-[#FFE3EC] px-3 py-1 text-xs font-extrabold text-[#D90452]">
              ⏱️ {active.readTime}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#1E1022]">
              {active.seoTitle}
            </h2>
          </div>

          <p className="text-base font-medium leading-relaxed text-[#34223B]">{active.intro}</p>

          <div className="space-y-5">
            {active.sections.map((sec) => (
              <section
                key={sec.heading}
                className="rounded-2xl border-2 border-[#1E1022]/12 bg-[#FFF7F0] p-5 space-y-2"
              >
                <h3 className="font-display text-lg sm:text-xl text-[#1E1022]">{sec.heading}</h3>
                <p className="text-[15px] font-medium leading-relaxed text-[#3D2A45]">
                  {sec.body}
                </p>
              </section>
            ))}
          </div>

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
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-xs font-extrabold text-[#1E1022]">
                          {item.badge}
                        </span>
                        <span className="text-sm font-extrabold text-[#D90452]">
                          {item.priceDisplay}
                        </span>
                      </div>
                      <h4 className="mt-2 text-base font-extrabold text-[#1E1022]">{item.name}</h4>
                      <p className="mt-1 text-sm font-medium text-[#5A4664] leading-relaxed">
                        {item.cheekyPitch}
                      </p>
                    </div>
                    <a
                      href={buildAffiliateUrl(item, `journal_${active.slug}`)}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
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
  );
};
