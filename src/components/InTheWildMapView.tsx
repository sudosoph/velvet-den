import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Heart, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { V35_CAST_VISUALS } from '../data/v35AssetManifest';
import { getCastProfileById } from '../data/v35Cast';
import { V35_WILD_VENUES, type WildVenueSpot } from '../data/v35WildVenues';
import { sfx } from '../lib/sound';

export interface InTheWildMapViewProps {
  role: 'her' | 'him';
  activeLeadThreads: string[];
  completedCameoVenues: string[];
  initialVenueId?: string;
  onUnlockWildLead: (
    leadId: string,
    venueId: string,
    bonus: number,
    clueId?: string,
  ) => void;
  onCompleteCameo: (venueId: string, leadId: string, bonus: number) => void;
  onOpenChatWithLead?: (leadId: string) => void;
}

const CHOICE_KEYS = ['A', 'B', 'C'] as const;

export const InTheWildMapView: React.FC<InTheWildMapViewProps> = ({
  role,
  activeLeadThreads,
  completedCameoVenues,
  initialVenueId,
  onUnlockWildLead,
  onCompleteCameo,
  onOpenChatWithLead,
}) => {
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(initialVenueId ?? null);
  const [outcomeCard, setOutcomeCard] = useState<{
    text: string;
    delta: number;
    unlockedLeadId?: string;
    isMemeFail?: boolean;
  } | null>(null);

  useEffect(() => {
    if (initialVenueId) {
      setSelectedSpotId(initialVenueId);
      setOutcomeCard(null);
    }
  }, [initialVenueId]);

  const activeSpot: WildVenueSpot | undefined = V35_WILD_VENUES.find(
    (s) => s.id === selectedSpotId,
  );

  if (activeSpot) {
    const primaryLeadId =
      role === 'her' ? activeSpot.primaryHerLeadId : activeSpot.primaryHimLeadId;
    const secondaryProfile = activeSpot.secondaryCameoLeadId
      ? getCastProfileById(activeSpot.secondaryCameoLeadId)
      : undefined;
    const matchedSecondaryId =
      secondaryProfile &&
      secondaryProfile.role !== role &&
      activeSpot.secondaryCameoLeadId &&
      activeLeadThreads.includes(activeSpot.secondaryCameoLeadId)
        ? activeSpot.secondaryCameoLeadId
        : undefined;
    const matchedTargetLeadId = activeLeadThreads.includes(primaryLeadId)
      ? primaryLeadId
      : matchedSecondaryId;
    const isAlreadyMatched = Boolean(matchedTargetLeadId) && !outcomeCard;
    const cameoDone = completedCameoVenues.includes(activeSpot.id);
    const cameoSpeaker = getCastProfileById(activeSpot.cameoBeat.speakerId);
    const cameoPortrait = V35_CAST_VISUALS[activeSpot.cameoBeat.speakerId]?.primaryPortrait;
    const primaryProfile = getCastProfileById(primaryLeadId);
    const primaryPortrait = V35_CAST_VISUALS[primaryLeadId]?.primaryPortrait;
    const choices = role === 'her' ? activeSpot.choicesHer : activeSpot.choicesHim;
    const setupText = role === 'her' ? activeSpot.sceneSetupHer : activeSpot.sceneSetupHim;
    const spokenCue = role === 'her' ? activeSpot.spokenCueHer : activeSpot.spokenCueHim;
    const activePortrait = isAlreadyMatched ? cameoPortrait : primaryPortrait;

    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 animate-stage-in">
        <button
          type="button"
          onClick={() => {
            setSelectedSpotId(null);
            setOutcomeCard(null);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All 10 City Hotspots</span>
        </button>

        {/* Visual-Novel Offline Encounter Stage */}
        <section className="relative overflow-hidden rounded-3xl bg-zinc-950 text-white shadow-2xl border border-white/10">
          <div className="relative h-60 sm:h-76 w-full overflow-hidden">
            <img
              src={activeSpot.backdropUrl}
              alt={activeSpot.name}
              className="h-full w-full object-cover animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-transparent" />

            <div className="absolute left-5 bottom-4 right-5 sm:left-6 sm:right-6 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300/95 px-3 py-1 text-xs font-extrabold text-zinc-950">
                  <span>{activeSpot.emoji}</span>
                  <span>Hotspot #{activeSpot.number}</span>
                </span>
                <h1 className="mt-2 font-editorial text-xl sm:text-3xl font-bold text-white leading-tight">
                  {activeSpot.name}
                </h1>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-snug">
                  {activeSpot.subtitle}
                </p>
              </div>

              {activePortrait && (
                <img
                  src={activePortrait}
                  alt={primaryProfile?.name ?? 'Scene lead'}
                  className="shrink-0 h-22 w-18 sm:h-28 sm:w-22 rounded-2xl object-cover ring-2 ring-amber-200/80 shadow-2xl v35-portrait-breathe"
                />
              )}
            </div>
          </div>

          {/* Scene Dialogue & Structured VN Choices Dock */}
          <div className="p-5 sm:p-7 space-y-4">
            {isAlreadyMatched ? (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 px-3 py-1 text-xs font-bold text-emerald-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Bonus Chemistry Cameo • {cameoSpeaker?.name}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:p-5">
                  <p className="font-editorial text-base sm:text-xl leading-relaxed text-amber-50">
                    {activeSpot.cameoBeat.line}
                  </p>
                </div>
                {cameoDone ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-emerald-200">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Cameo Completed ✓ ({activeSpot.cameoBeat.boostText})</span>
                    </div>
                    {matchedTargetLeadId && onOpenChatWithLead && (
                      <button
                        type="button"
                        onClick={() => onOpenChatWithLead(matchedTargetLeadId)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-5 py-2 text-xs font-extrabold text-[#18101E] cursor-pointer"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>
                          Return to {getCastProfileById(matchedTargetLeadId)?.name ?? 'Match'}’s
                          Chat →
                        </span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sfx.greenFlag();
                      onCompleteCameo(activeSpot.id, matchedTargetLeadId!, 15);
                    }}
                    className="rounded-full bg-amber-300 px-6 py-3 text-xs sm:text-sm font-extrabold text-[#18101E] hover:bg-amber-200 transition cursor-pointer"
                  >
                    Claim +15% Chemistry Cameo
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                    <span>Offline Meet-Cute</span>
                    {primaryProfile && (
                      <span>
                        • {primaryProfile.name}, {primaryProfile.age} ({primaryProfile.vitals.job})
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-400">
                    Read the room • Pick your approach
                  </span>
                </div>

                {/* Split Stage Direction vs Spoken/Visual Cue */}
                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:p-5">
                  <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
                    {setupText}
                  </p>
                  {spokenCue && (
                    <div className="border-l-2 border-amber-300 pl-3.5 pt-0.5">
                      <p className="font-editorial text-base sm:text-lg italic leading-snug text-amber-100">
                        {spokenCue}
                      </p>
                    </div>
                  )}
                </div>

                {outcomeCard ? (
                  <div
                    data-testid="wild-outcome-card"
                    className={`rounded-2xl p-5 space-y-3.5 ${
                      outcomeCard.isMemeFail
                        ? 'bg-rose-950/75 border border-rose-400/45'
                        : 'bg-emerald-950/75 border border-emerald-400/45'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
                          outcomeCard.isMemeFail
                            ? 'bg-rose-500/25 text-rose-200'
                            : 'bg-emerald-400/20 text-emerald-200'
                        }`}
                      >
                        <Heart className="h-3.5 w-3.5" />
                        <span>
                          {outcomeCard.delta >= 0
                            ? `+${outcomeCard.delta}% Spark`
                            : `${outcomeCard.delta}% Spark • Rookie Fumble`}
                        </span>
                      </span>
                      {outcomeCard.unlockedLeadId && (
                        <span className="text-xs font-bold text-amber-200">
                          📱 Personal Number Unlocked
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
                      {outcomeCard.text}
                    </p>

                    <div className="flex flex-wrap gap-3 pt-1">
                      {outcomeCard.unlockedLeadId && onOpenChatWithLead && (
                        <button
                          type="button"
                          onClick={() => onOpenChatWithLead(outcomeCard.unlockedLeadId!)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 hover:bg-amber-200 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-[#18101E] shadow-md cursor-pointer"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>
                            Open iMessage with{' '}
                            {getCastProfileById(outcomeCard.unlockedLeadId)?.name ?? 'Match'} Now →
                          </span>
                        </button>
                      )}
                      {outcomeCard.isMemeFail && (
                        <button
                          type="button"
                          onClick={() => setOutcomeCard(null)}
                          className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#18101E] cursor-pointer"
                        >
                          Rewind &amp; Try a Smoother Move
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSpotId(null);
                          setOutcomeCard(null);
                        }}
                        className="rounded-full border border-white/30 px-4 py-2 text-xs font-bold text-white cursor-pointer"
                      >
                        Back to City Map
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-2.5 pt-1">
                    {choices.map((choice, idx) => (
                      <button
                        key={choice.label}
                        type="button"
                        onClick={() => {
                          if (choice.isMemeFail) sfx.redFlag();
                          else sfx.greenFlag();

                          if (choice.unlocksChatWithId) {
                            onUnlockWildLead(
                              choice.unlocksChatWithId,
                              activeSpot.id,
                              choice.chemistryBonus,
                              choice.conspiracyClueId,
                            );
                          }
                          setOutcomeCard({
                            text: choice.outcomeText,
                            delta: choice.chemistryBonus,
                            unlockedLeadId: choice.unlocksChatWithId,
                            isMemeFail: choice.isMemeFail,
                          });
                        }}
                        className="group flex items-start gap-3.5 w-full rounded-2xl border border-white/18 bg-white/[0.08] p-3.5 sm:p-4 text-left text-sm sm:text-base font-medium text-white whitespace-normal hover:bg-white/[0.15] hover:border-amber-300/70 transition cursor-pointer"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-300/20 border border-amber-300/40 text-xs font-extrabold text-amber-200 group-hover:bg-amber-300 group-hover:text-[#18101E] transition">
                          {CHOICE_KEYS[idx] ?? idx + 1}
                        </span>
                        <span className="flex-1 leading-snug">{choice.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 animate-stage-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200 pb-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <MapPin className="h-3.5 w-3.5 text-rose-600" />
            <span>10 Illustrated Sunset Hills &amp; Downtown Venues</span>
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Meet Exclusives Out In The Wild
          </h1>
        </div>
        <p className="text-sm text-zinc-600 max-w-md">
          Read the room at real-world hotspots to meet leads who never swipe on apps and unlock personal text threads.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {V35_WILD_VENUES.map((spot) => {
          const leadId = role === 'her' ? spot.primaryHerLeadId : spot.primaryHimLeadId;
          const lead = getCastProfileById(leadId);
          const alreadyMet = activeLeadThreads.includes(leadId);

          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => {
                sfx.cardHoverTick();
                setSelectedSpotId(spot.id);
                setOutcomeCard(null);
              }}
              className="editorial-hinge-card group flex flex-col overflow-hidden rounded-2xl text-left transition hover:border-zinc-300 hover:shadow-sm cursor-pointer"
            >
              <div className="relative h-44 w-full overflow-hidden bg-zinc-200">
                <img
                  src={spot.backdropUrl}
                  alt={spot.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-0.5 text-xs font-medium text-zinc-900">
                  {spot.emoji} #{spot.number}
                </span>
                {alreadyMet && (
                  <span className="absolute right-3 top-3 rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
                    Cameo Ready
                  </span>
                )}
                <div className="absolute inset-x-3.5 bottom-3">
                  <h2 className="text-base font-semibold text-white leading-snug">
                    {spot.name}
                  </h2>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                <p className="text-sm text-zinc-600 line-clamp-2">{spot.subtitle}</p>
                {lead && (
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5 text-xs font-medium text-zinc-900">
                    <span>
                      {alreadyMet
                        ? 'Bonus Cameo Available'
                        : `Meet ${lead.name}, ${lead.age}`}
                    </span>
                    <span className="text-zinc-600 group-hover:text-zinc-950 transition-colors">
                      Enter →
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
