import React from 'react';
import {
  Compass,
  MessageCircle,
  ShoppingBag,
  Smartphone,
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
      <section className="editorial-hinge-card rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">
          Sunset Hills House Rules • 21+ Age-Gap Rom-Com
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 leading-tight">
          What Is Cougars &amp; Cubs Club?
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 max-w-3xl leading-relaxed">
          Built from real stories and unwritten rules across modern age-gap dating communities,{' '}
          <strong className="font-semibold text-zinc-900">Cougars &amp; Cubs Club</strong> is an interactive older-woman × younger-man rom-com, red-flag courtroom, and insider courtship handbook celebrating confident women (30s Pumas, 40s Cougars, 50s Jaguars, 60s+ Panthers &amp; Glam-mas) and high-EQ younger men (21 to 35 Cubs).
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
        <div className="editorial-hinge-card rounded-2xl p-5 bg-white space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Door 1 • Selective Hinge
          </div>
          <h2 className="text-base font-semibold text-zinc-950">
            6 Bespoke Photos &amp; Real Prompts
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Every profile features 6 unique activity photos and casual first-person prompts. Low-effort openers sit in Pending Likes; thoughtful notes or a Standout Rose spark the match.
          </p>
        </div>

        <div className="editorial-hinge-card rounded-2xl p-5 bg-white space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Door 2 • In The Wild
          </div>
          <h2 className="text-base font-semibold text-zinc-950">
            {V35_WILD_VENUES.length} Illustrated Sunset Hills Venues
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Meet offline at Terminal B Arrivals, Hawthorne University, The Marlow Lounge Hotel Bar, Havana Social Salsa, and Palisades Racquet, going straight to real phone numbers.
          </p>
        </div>

        <div className="editorial-hinge-card rounded-2xl p-5 bg-white space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            The Vetting Filter
          </div>
          <h2 className="text-base font-semibold text-zinc-950">
            App DM → Earned iMessage &amp; Cut Loose
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Banter freely off-the-cuff or tap sharp comebacks, consult 5 Sunset Hills lounge channels, block disguised Traps before Friday with Cut Loose, and graduate real catches to iMessage.
          </p>
        </div>

        <div className="editorial-hinge-card rounded-2xl p-5 bg-white space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">
            Three-Date S-Rank Run
          </div>
          <h2 className="text-base font-semibold text-zinc-950">
            Animated Multi-Date S-Rank Stage
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Experience full-bleed sunset dates with animated character expressions, free S-Rank replays, Secret Group-Chat Leaks, Weekend Escape Epilogues, and the hidden Table 9 Takedown.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 items-stretch">
        <div className="editorial-hinge-card rounded-2xl p-6 bg-white space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            House Rules of The Club
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
            Consenting Grown Adults (21+), Zero Mooching &amp; Zero Tourists
          </h2>
          <ul className="space-y-2 text-sm font-medium text-zinc-600 leading-relaxed">
            <li>• <strong>Adults Only (21+):</strong> Every character is a consenting adult (including strict Post-Grades university boundaries).</li>
            <li>• <strong>Never an ATM:</strong> Accomplished women date younger for chemistry, presence, and joy, never to bankroll a dependent.</li>
            <li>• <strong>Every Polarity Celebrated:</strong> Play Princess Romance, Soft Mommy-Domme poise, or decisive Cub-Daddy dinner takeovers.</li>
          </ul>
        </div>

        <div className="editorial-hinge-card rounded-2xl p-6 bg-white flex flex-col justify-between gap-4">
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">
              {herCount} Women × {himCount} Men • 132 Bespoke Photos
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              Explore Every Corner of Sunset Hills
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Grade 12 real-world courtship scenarios in Cub Obedience School or browse all {AFFILIATE_CATALOG.length} studio-photographed date-night &amp; hosting picks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onOpenCubSchool}
              className="rounded-full bg-stone-100 hover:bg-stone-200 px-4 py-3 text-xs font-extrabold text-[#18101E] cursor-pointer"
            >
              🎓 Enter Cub Obedience School
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
