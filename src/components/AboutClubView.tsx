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
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-3 shadow-2xs">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 leading-tight">
          About Cougars &amp; Cubs Club
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 max-w-3xl leading-relaxed">
          <strong className="font-semibold text-zinc-900">Cougars &amp; Cubs Club</strong> is an interactive older-woman × younger-man rom-com, red-flag courtroom, and courtship handbook celebrating confident women (30s Pumas, 40s Cougars, 50s Jaguars, 60s+ Panthers) and high-EQ younger men (21 to 35 Cubs).
        </p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            type="button"
            onClick={onGoToHinge}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 text-sm font-medium text-white cursor-pointer"
          >
            <Smartphone className="h-4 w-4" />
            <span>Explore Prowl Profiles</span>
          </button>
          <button
            type="button"
            onClick={onOpenWildMap}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 text-sm font-medium text-zinc-900 cursor-pointer"
          >
            <Compass className="h-4 w-4 text-zinc-500" />
            <span>In The Wild ({V35_WILD_VENUES.length} Venues)</span>
          </button>
          <button
            type="button"
            onClick={onOpenChats}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 text-sm font-medium text-zinc-900 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 text-zinc-500" />
            <span>Chats, Discord &amp; Dates</span>
          </button>
          <button
            type="button"
            onClick={onOpenGuides}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 text-sm font-medium text-zinc-900 cursor-pointer"
          >
            <span>Club Guides</span>
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-stretch">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-1.5 shadow-2xs">
          <h2 className="text-base font-semibold text-zinc-950">
            Prowl Profiles
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            6 candid photos, voice notes, and first-person prompts. Thoughtful openers or a Standout Rose spark the match.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-1.5 shadow-2xs">
          <h2 className="text-base font-semibold text-zinc-950">
            {V35_WILD_VENUES.length} Offline Venues
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Read body language across 3 beats at Terminal B, Hawthorne Campus, The Marlow Lounge, and Palisades Racquet.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-1.5 shadow-2xs">
          <h2 className="text-base font-semibold text-zinc-950">
            App DM to iMessage
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Banter freely, check clues in 5 Discord channels, block disguised Traps, and graduate real catches to iMessage.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-1.5 shadow-2xs">
          <h2 className="text-base font-semibold text-zinc-950">
            3-Date Romance Stage
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Play 3 dates per regular with free replays, Group-Chat Leaks, Weekend Epilogues, and the Table 9 Takedown.
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2 items-stretch">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-2.5 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-950">
            Club House Rules (21+)
          </h2>
          <ul className="space-y-2 text-sm text-zinc-600 leading-relaxed">
            <li>• <strong className="text-zinc-900">Adults Only (21+):</strong> Every character is a consenting adult (including strict post-grades university rules).</li>
            <li>• <strong className="text-zinc-900">Never an ATM:</strong> Accomplished women date younger for chemistry, presence, and joy, never to fund a dependent.</li>
            <li>• <strong className="text-zinc-900">Every Polarity Celebrated:</strong> Play Princess Romance, Soft Mommy-Domme poise, or decisive Cub-Daddy dinner takeovers.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 flex flex-col justify-between gap-4 shadow-2xs">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-950">
              {herCount} Women &amp; {himCount} Men in Sunset Hills
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Grade 12 courtship scenarios in Cub School or browse {AFFILIATE_CATALOG.length} curated date-night &amp; hosting picks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onOpenCubSchool}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 cursor-pointer"
            >
              🎓 Cub Obedience School
            </button>
            <button
              type="button"
              onClick={onOpenBoutique}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 text-sm font-semibold text-white cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 text-rose-400" />
              <span>Date-Night Shop ({AFFILIATE_CATALOG.length})</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
