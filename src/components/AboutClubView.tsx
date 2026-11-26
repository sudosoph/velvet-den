import React from 'react';
import {
  Compass,
  Heart,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { V35_CAST_PROFILES } from '../data/v35Cast';
import { V35_WILD_VENUES } from '../data/v35WildVenues';
import { AFFILIATE_CATALOG } from '../lib/affiliates';

interface AboutClubViewProps {
  onGoToHinge: () => void;
  onOpenChats: () => void;
  onOpenCubSchool: () => void;
  onOpenWildMap: () => void;
  onOpenBoutique: () => void;
  onOpenGuides: () => void;
}

export const AboutClubView: React.FC<AboutClubViewProps> = ({
  onGoToHinge,
  onOpenChats,
  onOpenCubSchool,
  onOpenWildMap,
  onOpenBoutique,
  onOpenGuides,
}) => {
  const herCount = V35_CAST_PROFILES.filter((p) => p.role === 'her').length;
  const himCount = V35_CAST_PROFILES.filter((p) => p.role === 'him').length;

  return (
    <div className="w-full space-y-6 animate-stage-in">
      <section className="editorial-hinge-card rounded-2xl p-6 sm:p-8 space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700">
          <Sparkles className="h-3.5 w-3.5 text-rose-600" /> Official Club Overview • 21+ Romantic-Comedy Simulation
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 leading-tight">
          What Is Cougars &amp; Cubs Club?
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 max-w-3xl leading-relaxed">
          Inspired by narrative cult classics like <em>Dream Daddy</em> and real age-gap dating communities,{' '}
          <strong className="font-semibold text-zinc-900">Cougars &amp; Cubs Club</strong> is a hybrid romantic-comedy dating simulation, evolving chat studio, and visual etiquette handbook celebrating confident older women (30s Pumas, 40s Cougars, 50s Jaguars, 60s+ Panthers &amp; Glam-mas) and high-EQ younger men (21 to 35 Cubs).
        </p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            type="button"
            onClick={onGoToHinge}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 text-sm font-medium text-white cursor-pointer"
          >
            <Smartphone className="h-4 w-4" />
            <span>Explore Hinge Profiles</span>
          </button>
          <button
            type="button"
            onClick={onOpenWildMap}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 text-sm font-medium text-zinc-900 cursor-pointer"
          >
            <Compass className="h-4 w-4 text-zinc-500" />
            <span>Meet Offline In The Wild ({V35_WILD_VENUES.length} Venues)</span>
          </button>
          <button
            type="button"
            onClick={onOpenChats}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 text-sm font-medium text-zinc-900 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 text-zinc-500" />
            <span>Open Chats, Discord &amp; Dates</span>
          </button>
          <button
            type="button"
            onClick={onOpenGuides}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 text-sm font-medium text-zinc-900 cursor-pointer"
          >
            <span>Read 16 Shoppable Guides</span>
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-stretch">
        <div className="editorial-hinge-card rounded-2xl p-5 bg-white space-y-2">
          <span className="inline-block rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
            Door 1 • Selective Hinge
          </span>
          <h2 className="text-base font-semibold text-zinc-950">
            6 Bespoke Photos &amp; Real Prompts
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Every profile features 6 unique activity photos and casual first-person prompts. Low-effort openers sit in Pending Likes; thoughtful notes or a Standout Rose spark the match.
          </p>
        </div>

        <div className="editorial-hinge-card rounded-2xl p-5 bg-white space-y-2">
          <span className="inline-block rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
            Door 2 • In The Wild
          </span>
          <h2 className="text-base font-semibold text-zinc-950">
            {V35_WILD_VENUES.length} Illustrated Velvet Palms Venues
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Meet offline at Terminal B Arrivals, Hawthorne University, The Velvet Room Hotel Bar, Havana Social Salsa, and Palisades Racquet—going straight to real phone numbers.
          </p>
        </div>

        <div className="editorial-hinge-card rounded-2xl p-5 bg-white space-y-2">
          <span className="inline-block rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
            Act 2 • Evolving Vetting
          </span>
          <h2 className="text-base font-semibold text-zinc-950">
            App DM → Earned iMessage &amp; Cut Loose
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Chat freely with live AI or curated replies, consult 5 distinct Club Discord channels, spot disguised Traps before Date #1 with Cut Loose, and graduate worthy matches to iMessage.
          </p>
        </div>

        <div className="editorial-hinge-card rounded-3xl p-5 bg-white space-y-2.5">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-extrabold text-emerald-900">
            Act 3 • Sunset Dates
          </span>
          <h2 className="font-editorial text-xl font-bold text-[#18101E]">
            Animated Multi-Date S-Rank Stage
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Experience full-bleed sunset dates with animated character expressions, free S-Rank replays, Secret Group-Chat Leaks, Velvet Cut Weekend Epilogues, and the hidden Table 9 Takedown.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 items-stretch">
        <div className="editorial-hinge-card rounded-3xl p-6 bg-[#FFFDF9] space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-900">
            <ShieldCheck className="h-4 w-4" />
            <span>House Rules of The Club</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#18101E]">
            Consenting Grown Adults (21+), Zero Mooching &amp; Zero Tourists
          </h2>
          <ul className="space-y-2 text-sm font-medium text-stone-700 leading-relaxed">
            <li>• <strong>Adults Only (21+):</strong> Every character is a consenting adult (including strict Post-Grades university boundaries).</li>
            <li>• <strong>Never an ATM:</strong> Accomplished women date younger for chemistry, presence, and joy—never to bankroll a dependent.</li>
            <li>• <strong>Every Polarity Celebrated:</strong> Play Princess Romance, Soft Mommy-Domme poise, or decisive Cub-Daddy dinner takeovers.</li>
          </ul>
        </div>

        <div className="editorial-hinge-card rounded-3xl p-6 bg-white flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-extrabold text-rose-700">
              <Heart className="h-4 w-4 fill-current" />
              <span>{herCount} Women × {himCount} Men • 132 Bespoke Photos</span>
            </div>
            <h2 className="font-editorial text-2xl font-bold text-[#18101E]">
              Explore Every Corner of Velvet Palms
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Grade 12 real-world courtship scenarios in Cub Obedience School or browse all {AFFILIATE_CATALOG.length} studio-photographed date-night &amp; hosting picks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onOpenCubSchool}
              className="rounded-full bg-stone-100 hover:bg-stone-200 px-4 py-3 text-xs font-extrabold text-[#18101E] cursor-pointer"
            >
              🎓 Open 12-Module Cub School
            </button>
            <button
              type="button"
              onClick={onOpenBoutique}
              className="rounded-full bg-[#18101E] px-4 py-3 text-xs font-extrabold text-white inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 text-amber-300" />
              <span>Date-Night Shop ({AFFILIATE_CATALOG.length})</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
