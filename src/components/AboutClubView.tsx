import React from 'react';
import {
  Flame,
  Gamepad2,
  Heart,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { HER_ARCHETYPES, HIS_ARCHETYPES } from '../domain/taxonomy';
import { AFFILIATE_CATALOG } from '../lib/affiliates';

interface AboutClubViewProps {
  onGoToPhoneLanding: () => void;
  onOpenChats: () => void;
  onOpenCubAcademy: () => void;
  onOpenWorldMap: () => void;
  onOpenBoutique: () => void;
  onOpenGuides: () => void;
}

export const AboutClubView: React.FC<AboutClubViewProps> = ({
  onGoToPhoneLanding,
  onOpenChats,
  onOpenCubAcademy,
  onOpenWorldMap,
  onOpenBoutique,
  onOpenGuides,
}) => {
  return (
    <div className="w-full space-y-6 animate-stage-in">
      {/* Hero Anchor */}
      <section className="vice-panel rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#FFFDF9] via-[#FFF4F7] to-[#FFFBEB] space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-[#1E1022]">
          <Sparkles className="h-3.5 w-3.5 text-[#FF2E63]" /> Official Club Manifesto • 21+ Romantic Comedy Sim
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-[#1E1022] leading-tight">
          What Is Cougars &amp; Cubs Club?
        </h1>
        <p className="text-base sm:text-lg font-medium text-[#34223B] max-w-3xl leading-relaxed">
          Inspired by narrative cult classics like <em>Dream Daddy</em> and real age-gap dating communities,{' '}
          <strong>Cougars &amp; Cubs Club</strong> is a playable romantic-comedy dating simulator, multi-app AI chat studio, and etiquette handbook celebrating confident older women (30s Pumas, 40s Cougars, 50s Jaguars, 60s+ Panthers &amp; Glam-mas) and high-EQ younger men (21 to 35 Cubs).
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={onGoToPhoneLanding}
            className="pop-btn inline-flex items-center gap-2 rounded-2xl bg-[#FF2E63] px-5 py-3 text-sm font-extrabold text-white cursor-pointer"
          >
            <Flame className="h-4 w-4 fill-white" />
            <span>Start Swiping on the Phone</span>
          </button>
          <button
            type="button"
            onClick={onOpenChats}
            className="pop-btn inline-flex items-center gap-2 rounded-2xl bg-[#007AFF] px-5 py-3 text-sm font-extrabold text-white cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Open Tinder, iMessage &amp; Discord</span>
          </button>
          <button
            type="button"
            onClick={onOpenGuides}
            className="pop-btn inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-[#1E1022] cursor-pointer"
          >
            <span>Read Complete Club Guides</span>
          </button>
        </div>
      </section>

      {/* How the 4-Stage Coherent Game Loop Works */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-stretch">
        <div className="vice-panel rounded-3xl p-5 bg-white space-y-2.5">
          <span className="inline-block rounded-full bg-[#FFE4E6] px-3 py-0.5 text-xs font-extrabold text-[#BE123C]">
            Act 1 • Phone Discovery
          </span>
          <h2 className="font-display text-xl text-[#18101E]">6-Slide Hinge &amp; Tinder Vetting</h2>
          <p className="text-sm font-medium text-[#475569] leading-relaxed">
            Inspect full uncropped portraits, Vitals, and first-person Hinge prompts. Spot 6:45 PM commuter curfews, age-filter fibs, and Table 9 setups before Friday night.
          </p>
        </div>

        <div className="vice-panel rounded-3xl p-5 bg-white space-y-2.5">
          <span className="inline-block rounded-full bg-[#DBEAFE] px-3 py-0.5 text-xs font-extrabold text-[#1D4ED8]">
            Act 2 • Off-App Progression
          </span>
          <h2 className="font-display text-xl text-[#18101E]">Tinder → iMessage &amp; Discord</h2>
          <p className="text-sm font-medium text-[#475569] leading-relaxed">
            Remember details from their bio for a <strong>Profile Memory Bonus</strong>, earn real off-app iMessage numbers, ask <code>#ask-the-den</code> with 1-tap advice pills, or send a 2-strike Cub to Obedience Rehab.
          </p>
        </div>

        <div className="vice-panel rounded-3xl p-5 bg-white space-y-2.5">
          <span className="inline-block rounded-full bg-[#FEF3C7] px-3 py-0.5 text-xs font-extrabold text-[#92400E]">
            Act 3 • 3-Date Career Arc
          </span>
          <h2 className="font-display text-xl text-[#18101E]">Date #1 Spark → Date #3 Sanctuary</h2>
          <p className="text-sm font-medium text-[#475569] leading-relaxed">
            Play cumulative 3-scene dates with tactile minigames so your Maturity and EQ carry forward to unlock Linen-Apron Houseboy Sunday and S-Rank Polaroids in your {HER_ARCHETYPES.length + HIS_ARCHETYPES.length}-member Dateodex.
          </p>
        </div>

        <div className="vice-panel rounded-3xl p-5 bg-white space-y-2.5">
          <span className="inline-block rounded-full bg-[#ECFDF5] px-3 py-0.5 text-xs font-extrabold text-[#065F46]">
            Act 4 • Neighborhood &amp; Social
          </span>
          <h2 className="font-display text-xl text-[#18101E]">&ldquo;In The Wild&rdquo; Map &amp; Auditions</h2>
          <p className="text-sm font-medium text-[#475569] leading-relaxed">
            Walk 6 real-world date venues in 8-bit pixel art, adopt Barnaby the rescue Golden Retriever, and text 60-second Partner Auditions to your crush or group chat.
          </p>
        </div>
      </section>

      {/* Club House Rules & Cast Diversity */}
      <section className="grid gap-6 lg:grid-cols-2 items-stretch">
        <div className="vice-panel rounded-3xl p-6 bg-[#FFFDF9] space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#D1FAE5] border border-[#059669]/30 px-3 py-1 text-xs font-extrabold text-[#065F46]">
            <ShieldCheck className="h-4 w-4" />
            <span>House Rules of The Den</span>
          </div>
          <h2 className="font-display text-2xl text-[#1E1022]">
            Consenting Grown Adults, Zero Sugar-Mama Mooching &amp; Zero Tourists
          </h2>
          <ul className="space-y-2 text-sm font-semibold text-[#34223B] leading-relaxed">
            <li>• <strong>Adults Only (21+):</strong> Every character is a consenting adult, and our cheeky &ldquo;Cub Grooming&rdquo; joke strictly means upgrading a 25+ man’s beard oil, SPF 50, and linen collars.</li>
            <li>• <strong>Never an ATM:</strong> Accomplished women date younger for chemistry, emotional openness, and joy, never to bankroll a freeloader’s rent.</li>
            <li>• <strong>Every Polarity Celebrated:</strong> Play Any-Age Princess Romance (30s to 60s+), Soft Mommy-Domme &ldquo;Good boy&rdquo; praise, or decisive &ldquo;Cub Daddy&rdquo; dinner takeover.</li>
          </ul>
        </div>

        <div className="vice-panel rounded-3xl p-6 bg-white flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE3EC] px-3 py-1 text-xs font-extrabold text-[#D90452]">
              <Heart className="h-4 w-4 fill-current" />
              <span>{HER_ARCHETYPES.length} Women (30 to 64) × {HIS_ARCHETYPES.length} Cubs (21 to 33)</span>
            </div>
            <h2 className="font-display text-2xl text-[#1E1022]">
              Jump Straight Into Any Club Wing
            </h2>
            <p className="text-sm font-medium text-[#475569] leading-relaxed">
              From petite 5&apos;1&Prime; corner-office executives, ER trauma nurses, 5:30 AM equestrians, and active 62F &ldquo;Glam-ma Gigi&rdquo; icons to firefighters, British structural engineers, sous-chefs, and Montana ranch cowboys.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={onOpenCubAcademy}
              className="pop-btn rounded-2xl bg-[#F5F3FF] px-3.5 py-3 text-xs font-extrabold text-[#5B21B6] cursor-pointer"
            >
              🦮 Cub Obedience Sim
            </button>
            <button
              type="button"
              onClick={onOpenWorldMap}
              className="pop-btn rounded-2xl bg-[#ECFDF5] px-3.5 py-3 text-xs font-extrabold text-[#065F46] inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>8-Bit Club Map</span>
            </button>
            <button
              type="button"
              onClick={onOpenBoutique}
              className="pop-btn rounded-2xl bg-[#18101E] px-3.5 py-3 text-xs font-extrabold text-white inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 text-[#FFBE0B]" />
              <span>Shop ({AFFILIATE_CATALOG.length})</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
