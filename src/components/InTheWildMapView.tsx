import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
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
}

export const InTheWildMapView: React.FC<InTheWildMapViewProps> = ({
  role,
  activeLeadThreads,
  completedCameoVenues,
  initialVenueId,
  onUnlockWildLead,
  onCompleteCameo,
}) => {
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(initialVenueId ?? null);
  const [outcomeCard, setOutcomeCard] = useState<{
    text: string;
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
    const isAlreadyMatched = Boolean(matchedTargetLeadId);
    const cameoDone = completedCameoVenues.includes(activeSpot.id);
    const cameoSpeaker = getCastProfileById(activeSpot.cameoBeat.speakerId);
    const cameoPortrait = V35_CAST_VISUALS[activeSpot.cameoBeat.speakerId]?.primaryPortrait;
    const primaryProfile = getCastProfileById(primaryLeadId);
    const primaryPortrait = V35_CAST_VISUALS[primaryLeadId]?.primaryPortrait;
    const choices = role === 'her' ? activeSpot.choicesHer : activeSpot.choicesHim;
    const setupText = role === 'her' ? activeSpot.sceneSetupHer : activeSpot.sceneSetupHim;

    return (
      <div className="mx-auto w-full max-w-4xl space-y-5 animate-stage-in">
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

        {/* Full-Bleed Sunset Stage */}
        <section className="relative overflow-hidden rounded-3xl bg-[#18101E] text-white shadow-2xl">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img
              src={activeSpot.backdropUrl}
              alt={activeSpot.name}
              className="h-full w-full object-cover animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#18101E] via-[#18101E]/45 to-transparent" />

            <div className="absolute left-6 bottom-5 right-6 flex items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300/95 px-3 py-1 text-xs font-extrabold text-[#18101E]">
                  <span>{activeSpot.emoji}</span>
                  <span>Hotspot #{activeSpot.number}</span>
                </span>
                <h1 className="mt-2 font-editorial text-2xl sm:text-3xl font-bold text-white">
                  {activeSpot.name}
                </h1>
                <p className="text-xs sm:text-sm text-amber-100/90">{activeSpot.subtitle}</p>
              </div>

              {(isAlreadyMatched ? cameoPortrait : primaryPortrait) && (
                <img
                  src={(isAlreadyMatched ? cameoPortrait : primaryPortrait)!}
                  alt="Scene lead"
                  className="hidden sm:block h-28 w-22 rounded-2xl object-cover ring-2 ring-amber-200/70 shadow-xl v35-portrait-breathe"
                />
              )}
            </div>
          </div>

          {/* Scene Dialogue & Choices Dock */}
          <div className="p-6 sm:p-8 space-y-5">
            {isAlreadyMatched ? (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 px-3 py-1 text-xs font-bold text-emerald-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Bonus Chemistry Cameo • {cameoSpeaker?.name}</span>
                </div>
                <p className="font-editorial text-lg sm:text-xl leading-relaxed text-amber-50">
                  {activeSpot.cameoBeat.line}
                </p>
                {cameoDone ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Cameo Completed ✓ ({activeSpot.cameoBeat.boostText})</span>
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
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <span>In The Wild Encounter</span>
                  {primaryProfile && (
                    <span>• Featuring {primaryProfile.name} ({primaryProfile.age})</span>
                  )}
                </div>

                <p className="text-base sm:text-lg leading-relaxed text-stone-100">
                  {setupText}
                </p>

                {outcomeCard ? (
                  <div
                    className={`rounded-2xl p-5 space-y-3 ${
                      outcomeCard.isMemeFail
                        ? 'bg-rose-950/70 border border-rose-400/40'
                        : 'bg-emerald-950/70 border border-emerald-400/40'
                    }`}
                  >
                    <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
                      {outcomeCard.text}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {outcomeCard.isMemeFail && (
                        <button
                          type="button"
                          onClick={() => setOutcomeCard(null)}
                          className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#18101E] cursor-pointer"
                        >
                          Try the Smooth Approach Instead
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
                  <div className="grid gap-3 pt-1">
                    {choices.map((choice) => (
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
                            unlockedLeadId: choice.unlocksChatWithId,
                            isMemeFail: choice.isMemeFail,
                          });
                        }}
                        className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 text-left text-sm sm:text-base font-medium text-white whitespace-normal hover:bg-white/20 hover:border-amber-300/60 transition cursor-pointer"
                      >
                        {choice.label}
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
    <div className="mx-auto w-full max-w-6xl space-y-6 animate-stage-in">
      <section className="editorial-hinge-card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-white via-amber-50/40 to-rose-50/40">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
          <MapPin className="h-3.5 w-3.5" />
          <span>10 Illustrated Velvet Palms &amp; Downtown Hotspots</span>
        </span>
        <h1 className="mt-2 font-editorial text-2xl sm:text-3xl font-bold text-[#18101E]">
          Meet Exclusives Out &ldquo;In The Wild&rdquo;
        </h1>
        <p className="mt-1 text-sm text-stone-600 max-w-3xl">
          Several of our best romance leads—Miles at Terminal B, Claire at The Velvet Room, Prof.
          Elena at Hawthorne University, Priya at St. Jude, Rafael at Havana &amp; Vine, and Marcus
          at Dawn Lap Pool—never swipe on apps. Step into any hotspot to spark an off-app iMessage!
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
              className="editorial-hinge-card group flex flex-col overflow-hidden rounded-3xl text-left transition hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative h-44 w-full overflow-hidden bg-stone-200">
                <img
                  src={spot.backdropUrl}
                  alt={spot.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <span className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#18101E]">
                  {spot.emoji} #{spot.number}
                </span>
                {alreadyMet && (
                  <span className="absolute right-3.5 top-3.5 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[11px] font-bold text-white">
                    Cameo Ready ✨
                  </span>
                )}
                <div className="absolute inset-x-4 bottom-3">
                  <h2 className="font-editorial text-lg font-bold text-white leading-snug">
                    {spot.name}
                  </h2>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                <p className="text-xs font-medium text-stone-600">{spot.subtitle}</p>
                {lead && (
                  <div className="flex items-center justify-between border-t border-stone-100 pt-2.5 text-xs font-bold text-[#18101E]">
                    <span>
                      {alreadyMet
                        ? `Bonus Cameo Available`
                        : `Meet ${lead.name}, ${lead.age}`}
                    </span>
                    <span className="text-rose-700">Step Inside →</span>
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
