import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Briefcase,
  Check,
  Clapperboard,
  GraduationCap,
  Heart,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  Ruler,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { V35_CAST_VISUALS } from '../data/v35AssetManifest';
import {
  getCastProfileById,
  V35_CAST_PROFILES,
  type HingePromptItem,
  type V35CastProfile,
} from '../data/v35Cast';
import type { WalletState } from '../domain/economy';
import { sfx } from '../lib/sound';
import { liveAiInboxService } from '../services/adapters';

export interface HingeFeedViewProps {
  role: 'her' | 'him';
  wallet: WalletState;
  matchedLeadIds: string[];
  cutLooseIds: string[];
  etiquetteBonusActive?: boolean;
  onSendHingeOpener: (
    leadId: string,
    promptOrSlideLabel: string,
    openerText: string,
    cost: number,
    delta: number,
    outcome?: 'instant_match' | 'pending_like' | 'delayed_match',
    isCustomOpener?: boolean,
  ) => boolean | void;
  onDeliverCustomOpenerReply?: (leadId: string, replyText: string, chemistryDelta: number) => void;
  onSwitchRole: (role: 'her' | 'him') => void;
  onOpenWildMap: () => void;
  onOpenChats?: (leadId?: string) => void;
}

interface ActiveReplyTarget {
  kind: 'prompt' | 'photo' | 'voice';
  label: string;
  previewText: string;
  prompt?: HingePromptItem;
}

const VOICE_WAVEFORM_BARS = [38, 68, 52, 88, 64, 95, 46, 78, 92, 58, 82, 44, 74, 60, 85, 48];

export const HingeFeedView: React.FC<HingeFeedViewProps> = ({
  role,
  wallet,
  matchedLeadIds,
  cutLooseIds,
  etiquetteBonusActive = false,
  onSendHingeOpener,
  onDeliverCustomOpenerReply,
  onSwitchRole,
  onOpenWildMap,
  onOpenChats,
}) => {
  const targetRole = role === 'her' ? 'him' : 'her';

  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [focusedLeadId, setFocusedLeadId] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [heardVoiceIds, setHeardVoiceIds] = useState<string[]>([]);
  const [pendingLikes, setPendingLikes] = useState<{ leadId: string; name: string; swipesSince: number }[]>([]);
  const [replyTarget, setReplyTarget] = useState<ActiveReplyTarget | null>(null);
  const [customNote, setCustomNote] = useState('');
  const [statusBanner, setStatusBanner] = useState<{
    tone: 'match' | 'pending' | 'delayed';
    text: string;
    leadId?: string;
  } | null>(null);
  const [matchCelebration, setMatchCelebration] = useState<{
    leadId: string;
    name: string;
    age: number;
    job: string;
    portrait: string;
    isDelayed?: boolean;
    customPlayerNote?: string;
    liveCustomReply?: string;
    loadingCustomReply?: boolean;
  } | null>(null);

  const allHingeCast = useMemo(
    () =>
      V35_CAST_PROFILES.filter(
        (p) =>
          p.role === targetRole &&
          p.discoveryDoor !== 'wild' &&
          !cutLooseIds.includes(p.id),
      ),
    [targetRole, cutLooseIds],
  );

  const deck = useMemo(() => {
    const pendingSet = new Set(pendingLikes.map((p) => p.leadId));
    return allHingeCast.filter(
      (p) =>
        !matchedLeadIds.includes(p.id) &&
        !passedIds.includes(p.id) &&
        !pendingSet.has(p.id),
    );
  }, [allHingeCast, matchedLeadIds, passedIds, pendingLikes]);

  const currentProfile: V35CastProfile | undefined = useMemo(() => {
    if (focusedLeadId) {
      const found = deck.find((p) => p.id === focusedLeadId);
      if (found) return found;
    }
    return deck[0];
  }, [deck, focusedLeadId]);

  useEffect(() => {
    setFocusedLeadId(null);
    setPlayingVoiceId(null);
  }, [role]);

  useEffect(() => {
    if (!playingVoiceId) return;
    const timer = window.setTimeout(() => {
      setPlayingVoiceId(null);
    }, 3600);
    return () => window.clearTimeout(timer);
  }, [playingVoiceId]);

  const advancePendingCounter = (extraPending?: { leadId: string; name: string }) => {
    const updated = pendingLikes.map((item) => ({
      ...item,
      swipesSince: item.swipesSince + 1,
    }));
    const readyPopIn = updated.find((item) => item.swipesSince >= 2);
    const remaining = readyPopIn
      ? updated.filter((item) => item.leadId !== readyPopIn.leadId)
      : updated;
    const nextList = extraPending
      ? [...remaining, { ...extraPending, swipesSince: 0 }]
      : remaining;

    setPendingLikes(nextList);

    if (readyPopIn) {
      const delayedPerson = getCastProfileById(readyPopIn.leadId);
      const delayedVis = V35_CAST_VISUALS[readyPopIn.leadId];
      onSendHingeOpener(
        readyPopIn.leadId,
        'Delayed Match Pop-In',
        'Matched back after reading your note!',
        0,
        16 + (etiquetteBonusActive ? 4 : 0),
        'delayed_match',
      );
      setStatusBanner({
        tone: 'delayed',
        text: `✨ Surprise Match Pop-In! ${readyPopIn.name} just matched with your earlier Like — open Chats & Dates!`,
        leadId: readyPopIn.leadId,
      });
      if (delayedPerson && delayedVis) {
        setMatchCelebration({
          leadId: delayedPerson.id,
          name: delayedPerson.name,
          age: delayedPerson.age,
          job: delayedPerson.vitals.job,
          portrait: delayedVis.primaryPortrait,
          isDelayed: true,
        });
      }
      return true;
    }
    return false;
  };

  const handlePass = () => {
    if (!currentProfile) return;
    sfx.swipeLeft();
    setReplyTarget(null);
    setPlayingVoiceId(null);
    setFocusedLeadId(null);
    setPassedIds((prev) => [...prev, currentProfile.id]);
    advancePendingCounter();
    if (!import.meta.env.VITEST && typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        // Ignore scroll error
      }
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (replyTarget) {
          e.preventDefault();
          setReplyTarget(null);
          return;
        }
        if (matchCelebration) {
          e.preventDefault();
          setMatchCelebration(null);
          return;
        }
      }
      if (!currentProfile || replyTarget || matchCelebration) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePass();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const submitLike = (
    openerText: string,
    cost: number,
    delta: number,
    isCustomOpener = false,
  ) => {
    if (!currentProfile || !replyTarget) return;

    const targetPerson = currentProfile;
    const targetPreview = replyTarget.previewText;
    const boostedDelta = delta > 0 && etiquetteBonusActive ? delta + 4 : delta;
    const isFirstWelcomeSpark =
      matchedLeadIds.length === 0 &&
      pendingLikes.length === 0 &&
      delta > 0 &&
      targetPerson.matchSelectivity !== 'standout';

    const isRoseOrAttuned =
      cost > 0 ||
      isCustomOpener ||
      boostedDelta >= 14 ||
      isFirstWelcomeSpark ||
      targetPerson.matchSelectivity === 'warm' ||
      targetPerson.tier === 'trap';

    if (isRoseOrAttuned) {
      const accepted = onSendHingeOpener(
        targetPerson.id,
        replyTarget.label,
        openerText,
        cost,
        boostedDelta,
        'instant_match',
        isCustomOpener,
      );
      if (accepted === false) {
        setReplyTarget(null);
        return;
      }
      sfx.swipeRight();
      setPlayingVoiceId(null);
      setFocusedLeadId(null);
      const matchedVis = V35_CAST_VISUALS[targetPerson.id];
      const poppedDelayed = advancePendingCounter();
      if (!poppedDelayed) {
        setStatusBanner({
          tone: 'match',
          text: `🥂 It’s a Match with ${targetPerson.name}! Thread added to Chats & Dates.`,
          leadId: targetPerson.id,
        });
        if (matchedVis) {
          setMatchCelebration({
            leadId: targetPerson.id,
            name: targetPerson.name,
            age: targetPerson.age,
            job: targetPerson.vitals.job,
            portrait: matchedVis.primaryPortrait,
            customPlayerNote: isCustomOpener ? openerText : undefined,
            loadingCustomReply: isCustomOpener,
          });
        }
      }

      if (isCustomOpener) {
        void liveAiInboxService
          .evaluateOpeningDm({
            personaId: targetPerson.id,
            personaName: targetPerson.name,
            personaAge: targetPerson.age,
            personaTitle: targetPerson.vitals.job,
            personaRole: targetPerson.role,
            playerRole: role,
            personaLore: `${targetPerson.tagline} ${targetPerson.trapTellSummary || targetPerson.vulnerabilityNote || ''}`.trim(),
            platform: 'tinder',
            playerMessage: openerText,
            history: [{ sender: 'match', text: targetPreview }],
          })
          .then((res) => {
            onDeliverCustomOpenerReply?.(targetPerson.id, res.herReply, res.chemistryDelta);
            setMatchCelebration((prev) =>
              prev && prev.leadId === targetPerson.id
                ? {
                    ...prev,
                    liveCustomReply: res.herReply,
                    loadingCustomReply: false,
                  }
                : prev,
            );
          })
          .catch(() => {
            setMatchCelebration((prev) =>
              prev && prev.leadId === targetPerson.id
                ? { ...prev, loadingCustomReply: false }
                : prev,
            );
          });
      }
    } else {
      sfx.messagePop();
      setPlayingVoiceId(null);
      setFocusedLeadId(null);
      onSendHingeOpener(
        targetPerson.id,
        replyTarget.label,
        openerText,
        0,
        delta,
        'pending_like',
        false,
      );
      const poppedDelayed = advancePendingCounter({
        leadId: targetPerson.id,
        name: targetPerson.name,
      });
      if (!poppedDelayed) {
        setStatusBanner({
          tone: 'pending',
          text: `Sent Like • Pending — ${targetPerson.name} is selective! Read prompts closely (or send a 🌹 Standout Rose) to match right away.`,
        });
      }
    }

    setReplyTarget(null);
    setCustomNote('');
    if (!import.meta.env.VITEST && typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        // Ignore scroll error
      }
    }
  };

  const showCompactRoleBar = matchedLeadIds.length > 0 || wallet.discernmentXp > 0;

  return (
    <div id="hinge-stage" className="mx-auto w-full max-w-xl space-y-4 animate-stage-in scroll-mt-20">
      {/* Compact Role Switcher (Shown Only After Leaving Fresh Hero, Or Pending Likes Counter) */}
      {(showCompactRoleBar || pendingLikes.length > 0) && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {showCompactRoleBar && (
            <div className="inline-flex rounded-lg bg-zinc-200/70 p-0.5">
              <button
                type="button"
                onClick={() => {
                  setPassedIds([]);
                  setPendingLikes([]);
                  setStatusBanner(null);
                  setMatchCelebration(null);
                  onSwitchRole('her');
                }}
                className={`rounded-md px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  role === 'her'
                    ? 'bg-white text-zinc-950 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Playing as Her
              </button>
              <button
                type="button"
                onClick={() => {
                  setPassedIds([]);
                  setPendingLikes([]);
                  setStatusBanner(null);
                  setMatchCelebration(null);
                  onSwitchRole('him');
                }}
                className={`rounded-md px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  role === 'him'
                    ? 'bg-white text-zinc-950 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Playing as Him
              </button>
            </div>
          )}

          {pendingLikes.length > 0 && (
            <span className="font-semibold text-rose-600">
              ⏳ {pendingLikes.length} Sent Like • Pending (matches pop in within 2 swipes)
            </span>
          )}
        </div>
      )}

      {/* Live Match / Pending Status Banner */}
      {statusBanner && (
        <div
          className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-xs ${
            statusBanner.tone === 'pending'
              ? 'bg-amber-50 border border-amber-200 text-amber-950'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-950'
          }`}
        >
          <span>{statusBanner.text}</span>
          {statusBanner.leadId && onOpenChats && (
            <button
              type="button"
              onClick={() => onOpenChats(statusBanner.leadId)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#18101E] px-3.5 py-1.5 text-xs font-bold text-white cursor-pointer"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Open Chat</span>
            </button>
          )}
        </div>
      )}

      {/* Tonight's Cast Strip — Jump Straight to Any Intriguing Character or Track Matches */}
      {allHingeCast.length > 0 && (
        <section
          data-testid="hinge-cast-strip"
          aria-label="Tonight's Hinge Lineup"
          className="rounded-2xl border border-zinc-200/90 bg-white px-4 py-3 shadow-2xs"
        >
          <div className="mb-2.5 flex items-center justify-between gap-2 text-xs">
            <span className="font-bold text-zinc-900">
              Tonight’s {allHingeCast.length} Singles
            </span>
            <span className="text-[11px] font-medium text-zinc-500">
              Tap any portrait to jump or open chat
            </span>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {allHingeCast.map((person) => {
              const vis = V35_CAST_VISUALS[person.id];
              const isMatched = matchedLeadIds.includes(person.id);
              const isPending = pendingLikes.some((p) => p.leadId === person.id);
              const isPassed = passedIds.includes(person.id);
              const isCurrent = currentProfile?.id === person.id;

              return (
                <button
                  key={person.id}
                  type="button"
                  data-testid={`cast-jump-${person.id}`}
                  onClick={() => {
                    if (isMatched) {
                      onOpenChats?.(person.id);
                      return;
                    }
                    if (isPending) return;
                    sfx.messagePop();
                    setPlayingVoiceId(null);
                    if (isPassed) {
                      setPassedIds((prev) => prev.filter((id) => id !== person.id));
                    }
                    setFocusedLeadId(person.id);
                  }}
                  className={`group flex shrink-0 flex-col items-center gap-1 text-center transition cursor-pointer ${
                    isPassed && !isCurrent ? 'opacity-55 hover:opacity-100' : ''
                  }`}
                >
                  <div
                    className={`relative h-12 w-12 rounded-full p-0.5 transition ${
                      isCurrent
                        ? 'ring-2 ring-[#B83253] ring-offset-1'
                        : isMatched
                          ? 'ring-2 ring-emerald-500'
                          : isPending
                            ? 'ring-2 ring-amber-400'
                            : 'ring-1 ring-zinc-200 group-hover:ring-zinc-400'
                    }`}
                  >
                    <img
                      src={vis?.primaryPortrait || person.slides[0]?.url}
                      alt={`${person.name} avatar`}
                      className="h-full w-full rounded-full object-cover"
                    />
                    {isMatched && (
                      <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </span>
                    )}
                    {isPending && !isMatched && (
                      <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-zinc-950 shadow-xs">
                        ⏳
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] leading-tight whitespace-nowrap ${
                      isCurrent ? 'font-bold text-[#B83253]' : 'font-medium text-zinc-700'
                    }`}
                  >
                    {person.name}, {person.age}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty Deck State */}
      {!currentProfile ? (
        <div className="editorial-hinge-card rounded-3xl p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-700">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#18101E]">
            You’ve Seen Today’s Hinge Standouts
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Half of Velvet Palms’ best catches never touch dating apps—step out to The Velvet Room,
            Terminal B, or Hawthorne University, or revisit passed profiles.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenWildMap}
              className="rounded-full bg-[#18101E] px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              🗺️ Explore 10 In The Wild Hotspots
            </button>
            <button
              type="button"
              onClick={() => setPassedIds([])}
              className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-xs font-bold text-stone-800 cursor-pointer"
            >
              Shuffle Passed Profiles
            </button>
          </div>
        </div>
      ) : (
        <article className="editorial-hinge-card relative rounded-3xl">
          {/* Authentic Minimal Hinge Header: Just Name, Age & Subtle Status Dot */}
          <header className="flex items-baseline justify-between px-6 pt-6 pb-3">
            <div className="flex items-baseline gap-2.5">
              <h1 className="font-editorial text-3xl font-bold tracking-tight text-[#18101E]">
                {currentProfile.name}
              </h1>
              <span className="text-xl font-medium text-stone-500">{currentProfile.age}</span>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
              <span
                className={`h-2 w-2 rounded-full ${
                  currentProfile.matchSelectivity === 'standout'
                    ? 'bg-amber-400'
                    : 'bg-emerald-500'
                }`}
              />
              {currentProfile.activeStatusLabel}
            </span>
          </header>

          <div className="space-y-4 px-4 pb-6 sm:px-6">
            {/* Photo 1 — Unobstructed Full-Bleed Lead Portrait */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
              <div className="relative overflow-hidden bg-zinc-100 aspect-[3/4]">
                <img
                  src={currentProfile.slides[0].url}
                  alt={currentProfile.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`Like photo 1 of ${currentProfile.name}`}
                  onClick={() =>
                    setReplyTarget({
                      kind: 'photo',
                      label: `${currentProfile.name}'s first photo`,
                      previewText: currentProfile.slides[0].caption || `${currentProfile.name}'s photo`,
                      prompt: currentProfile.prompts[0],
                    })
                  }
                  className="hinge-heart-fab absolute right-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-full cursor-pointer"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              {currentProfile.slides[0].caption && (
                <div className="border-t border-zinc-100 bg-white px-4 py-3 text-sm font-medium text-zinc-800 leading-snug">
                  {currentProfile.slides[0].caption}
                </div>
              )}
            </div>

            {/* Prompt 1 */}
            <div className="editorial-prompt-card relative rounded-2xl p-6 pr-16">
              <div className="text-xs font-medium text-zinc-500">
                {currentProfile.prompts[0].question}
              </div>
              <p className="mt-1.5 font-hinge-quote text-2xl leading-snug text-zinc-950">
                {currentProfile.prompts[0].answer}
              </p>
              <button
                type="button"
                aria-label={`Like prompt 1: ${currentProfile.prompts[0].question}`}
                onClick={() =>
                  setReplyTarget({
                    kind: 'prompt',
                    label: currentProfile.prompts[0].question,
                    previewText: currentProfile.prompts[0].answer,
                    prompt: currentProfile.prompts[0],
                  })
                }
                className="hinge-heart-fab absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-full cursor-pointer"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Interactive Real-Hinge Voice Prompt Card */}
            {currentProfile.voicePrompt && (
              <div
                data-testid="hinge-voice-prompt"
                className="relative rounded-2xl border border-zinc-200/90 bg-zinc-50/70 p-5 pr-16 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600">
                    <Volume2 className="h-3.5 w-3.5 text-[#B83253]" />
                    <span>{currentProfile.voicePrompt.question}</span>
                  </span>
                  <span className="text-[11px] font-semibold tabular-nums text-zinc-400">
                    {currentProfile.voicePrompt.duration}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    data-testid="hinge-voice-play-btn"
                    aria-label={
                      playingVoiceId === currentProfile.id
                        ? `Pause ${currentProfile.name}'s voice prompt`
                        : `Play ${currentProfile.name}'s voice prompt`
                    }
                    onClick={() => {
                      sfx.messagePop();
                      if (playingVoiceId === currentProfile.id) {
                        setPlayingVoiceId(null);
                      } else {
                        setPlayingVoiceId(currentProfile.id);
                        setHeardVoiceIds((prev) =>
                          prev.includes(currentProfile.id) ? prev : [...prev, currentProfile.id],
                        );
                      }
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white hover:bg-[#B83253] transition cursor-pointer"
                  >
                    {playingVoiceId === currentProfile.id ? (
                      <Pause className="h-4 w-4 fill-white" />
                    ) : (
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                    )}
                  </button>

                  <div className="flex flex-1 items-center gap-1 h-8" aria-hidden="true">
                    {VOICE_WAVEFORM_BARS.map((pct, barIdx) => {
                      const isPlaying = playingVoiceId === currentProfile.id;
                      return (
                        <span
                          key={barIdx}
                          style={{ height: `${isPlaying ? Math.min(100, pct + ((barIdx % 3) * 8)) : pct}%` }}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            isPlaying
                              ? 'bg-[#B83253] animate-pulse'
                              : heardVoiceIds.includes(currentProfile.id)
                                ? 'bg-zinc-500'
                                : 'bg-zinc-300'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                <p className="text-sm italic text-zinc-800 leading-relaxed">
                  {currentProfile.voicePrompt.transcript}
                </p>

                {heardVoiceIds.includes(currentProfile.id) && (
                  <div
                    data-testid="hinge-voice-subtext"
                    className="rounded-xl bg-white border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700"
                  >
                    <span className="font-bold text-zinc-950">Bestie Read: </span>
                    {currentProfile.voicePrompt.subtextTell}
                  </div>
                )}

                <button
                  type="button"
                  aria-label={`Like voice prompt of ${currentProfile.name}`}
                  onClick={() =>
                    setReplyTarget({
                      kind: 'voice',
                      label: `${currentProfile.name}'s voice prompt`,
                      previewText:
                        currentProfile.voicePrompt?.transcript || currentProfile.prompts[0].answer,
                      prompt: currentProfile.prompts[0],
                    })
                  }
                  className="hinge-heart-fab absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-full cursor-pointer"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Authentic Hinge Vitals Strip */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-zinc-800">
                <span className="inline-flex items-center gap-1.5">
                  <Ruler className="h-3.5 w-3.5 text-zinc-400" />
                  {currentProfile.vitals.height}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
                  {currentProfile.vitals.job}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-zinc-400" />
                  {currentProfile.vitals.school}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  {currentProfile.vitals.neighborhood}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-2.5 text-xs font-medium text-zinc-600">
                <span className="rounded-md bg-zinc-100 px-2.5 py-1">
                  {currentProfile.vitals.lookingFor}
                </span>
                <span className="rounded-md bg-zinc-100 px-2.5 py-1">
                  {currentProfile.vitals.kidsStance}
                </span>
              </div>
            </div>

            {/* Photo 2 — Unobstructed Photo + Authentic Below-Photo 1st-Person Caption */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
              <div className="relative overflow-hidden bg-zinc-100 aspect-[3/4]">
                <img
                  src={currentProfile.slides[1].url}
                  alt={`${currentProfile.name} lifestyle`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`Like photo 2 of ${currentProfile.name}`}
                  onClick={() =>
                    setReplyTarget({
                      kind: 'photo',
                      label: `${currentProfile.name}'s photo`,
                      previewText: currentProfile.slides[1].caption || `${currentProfile.name}'s photo`,
                      prompt: currentProfile.prompts[1],
                    })
                  }
                  className="hinge-heart-fab absolute right-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-full cursor-pointer"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              {currentProfile.slides[1].caption && (
                <div className="border-t border-zinc-100 bg-white px-4 py-3 text-sm font-medium text-zinc-800 leading-snug">
                  {currentProfile.slides[1].caption}
                </div>
              )}
            </div>

            {/* Prompt 2 */}
            <div className="editorial-prompt-card relative rounded-2xl p-6 pr-16">
              <div className="text-xs font-medium text-zinc-500">
                {currentProfile.prompts[1].question}
              </div>
              <p className="mt-1.5 font-hinge-quote text-2xl leading-snug text-zinc-950">
                {currentProfile.prompts[1].answer}
              </p>
              <button
                type="button"
                aria-label={`Like prompt 2: ${currentProfile.prompts[1].question}`}
                onClick={() =>
                  setReplyTarget({
                    kind: 'prompt',
                    label: currentProfile.prompts[1].question,
                    previewText: currentProfile.prompts[1].answer,
                    prompt: currentProfile.prompts[1],
                  })
                }
                className="hinge-heart-fab absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-full cursor-pointer"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Narrative Cliffhanger Hook: What Happens on Friday Night If You Match */}
            {currentProfile.fridayStoryHook && (
              <div
                data-testid="hinge-story-hook"
                className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#B83253]">
                    <Clapperboard className="h-3.5 w-3.5" />
                    <span>Friday Story Preview • What Happens Next</span>
                  </span>
                </div>
                <p className="text-sm font-medium text-zinc-900 leading-relaxed">
                  {currentProfile.fridayStoryHook}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setReplyTarget({
                      kind: 'prompt',
                      label: currentProfile.prompts[0].question,
                      previewText: currentProfile.prompts[0].answer,
                      prompt: currentProfile.prompts[0],
                    })
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B83253] hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <span>Match with {currentProfile.name} to play this storyline →</span>
                </button>
              </div>
            )}

            {/* Photo 3 — Unobstructed Photo + Authentic Below-Photo 1st-Person Caption */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
              <div className="relative overflow-hidden bg-zinc-100 aspect-[3/4]">
                <img
                  src={currentProfile.slides[2].url}
                  alt={`${currentProfile.name} candid`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`Like photo 3 of ${currentProfile.name}`}
                  onClick={() =>
                    setReplyTarget({
                      kind: 'photo',
                      label: `${currentProfile.name}'s photo`,
                      previewText: currentProfile.slides[2].caption || `${currentProfile.name}'s photo`,
                      prompt: currentProfile.prompts[2],
                    })
                  }
                  className="hinge-heart-fab absolute right-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-full cursor-pointer"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              {currentProfile.slides[2].caption && (
                <div className="border-t border-zinc-100 bg-white px-4 py-3 text-sm font-medium text-zinc-800 leading-snug">
                  {currentProfile.slides[2].caption}
                </div>
              )}
            </div>

            {/* Prompt 3 */}
            <div className="editorial-prompt-card relative rounded-2xl p-6 pr-16">
              <div className="text-xs font-medium text-zinc-500">
                {currentProfile.prompts[2].question}
              </div>
              <p className="mt-1.5 font-hinge-quote text-2xl leading-snug text-zinc-950">
                {currentProfile.prompts[2].answer}
              </p>
              <button
                type="button"
                aria-label={`Like prompt 3: ${currentProfile.prompts[2].question}`}
                onClick={() =>
                  setReplyTarget({
                    kind: 'prompt',
                    label: currentProfile.prompts[2].question,
                    previewText: currentProfile.prompts[2].answer,
                    prompt: currentProfile.prompts[2],
                  })
                }
                className="hinge-heart-fab absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-full cursor-pointer"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Photos 4, 5, 6 — Unobstructed Photos + Authentic Below-Photo 1st-Person Captions */}
            {currentProfile.slides.slice(3).map((slide, extraIdx) => (
              <div
                key={slide.url}
                className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white"
              >
                <div className="relative overflow-hidden bg-zinc-100 aspect-[3/4]">
                  <img
                    src={slide.url}
                    alt={`${currentProfile.name} moment`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    aria-label={`Like photo ${extraIdx + 4} of ${currentProfile.name}`}
                    onClick={() =>
                      setReplyTarget({
                        kind: 'photo',
                        label: `${currentProfile.name}'s photo`,
                        previewText: slide.caption || `${currentProfile.name}'s photo`,
                        prompt: currentProfile.prompts[extraIdx % 3],
                      })
                    }
                    className="hinge-heart-fab absolute right-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-full cursor-pointer"
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
                {slide.caption && (
                  <div className="border-t border-zinc-100 bg-white px-4 py-3 text-sm font-medium text-zinc-800 leading-snug">
                    {slide.caption}
                  </div>
                )}
              </div>
            ))}

            {/* Bottom End-of-Profile Action Row */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setReplyTarget({
                    kind: 'prompt',
                    label: currentProfile.prompts[0].question,
                    previewText: currentProfile.prompts[0].answer,
                    prompt: currentProfile.prompts[0],
                  })
                }
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#B83253] px-7 text-sm font-bold text-white shadow-sm hover:bg-[#9E2846] transition cursor-pointer"
              >
                <Heart className="h-4 w-4 fill-white" />
                <span>Send a Note or Rose</span>
              </button>
            </div>
          </div>

          {/* Authentic Hinge Sticky Bottom-Left Floating Pass (✕) Button — Always Visible Without Scrolling */}
          <div className="sticky bottom-6 z-30 pointer-events-none flex items-center justify-start px-7 sm:px-9 pb-5 -mt-20">
            <button
              type="button"
              data-testid="hinge-sticky-pass-btn"
              aria-label={`Pass on ${currentProfile.name}`}
              title={`Pass on ${currentProfile.name} (←)`}
              onClick={handlePass}
              className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-stone-200/90 bg-white text-[#18101E] shadow-[0_10px_28px_rgba(24,16,30,0.22)] hover:scale-108 hover:bg-stone-900 hover:text-white active:scale-95 transition cursor-pointer"
            >
              <X className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>
        </article>
      )}

      {/* Hinge Opener & Standout Rose Modal Sheet (Portaled to document.body, Crisp Dim Scrim, Zero Blur Glitch) */}
      {replyTarget &&
        currentProfile &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#18101E]/50 p-3 sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-label={`Reply to ${currentProfile.name}`}
            onClick={() => setReplyTarget(null)}
          >
            <div
              className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Replying to {currentProfile.name}
                  </div>
                  <p className="mt-1 font-editorial text-lg text-[#18101E]">
                    &ldquo;{replyTarget.previewText}&rdquo;
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close reply sheet"
                  onClick={() => setReplyTarget(null)}
                  className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {replyTarget.prompt && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-stone-500">
                    Tap an opener to send right away, or just hit Send Like below:
                  </div>
                  {replyTarget.prompt.openers.map((opt) => {
                    const isVip = 'isVipSmooth' in opt && Boolean(opt.isVipSmooth);
                    const cost = isVip ? 1 : 0;
                    return (
                      <button
                        key={opt.text}
                        type="button"
                        data-testid="hinge-opener-option"
                        onClick={() => submitLike(opt.text, cost, opt.delta)}
                        className={`group w-full rounded-2xl p-4 text-left text-sm whitespace-normal transition cursor-pointer ${
                          isVip
                            ? 'border border-amber-300 bg-gradient-to-r from-amber-50 to-rose-50 font-bold text-[#18101E] hover:border-rose-400 hover:shadow-sm'
                            : 'border border-stone-200 bg-stone-50/80 font-medium text-stone-800 hover:border-[#18101E] hover:bg-white hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="leading-relaxed">{opt.text}</div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                              isVip
                                ? 'bg-rose-600 text-white group-hover:bg-rose-700'
                                : 'bg-stone-200/80 text-[#18101E] group-hover:bg-[#18101E] group-hover:text-white'
                            }`}
                          >
                            {isVip ? '🌹 Rose →' : 'Send →'}
                          </span>
                        </div>
                        {isVip && (
                          <div className="mt-1.5 text-xs font-bold text-rose-800">
                            🌹 Send a Standout Rose ({wallet.isVip ? 'Included w/ VIP' : '1 Cr'}) • Instant Top-of-Queue Match
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Free Custom Opener OR 1-Tap Plain Hinge Like (Works Even When Input Is Empty!) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const trimmed = customNote.trim();
                  if (!trimmed) {
                    const fallbackLikeText =
                      replyTarget.kind === 'photo'
                        ? 'Liked your photo ❤️'
                        : replyTarget.kind === 'voice'
                          ? 'Liked your voice prompt ❤️'
                          : 'Liked your answer ❤️';
                    submitLike(fallbackLikeText, 0, 8, false);
                    return;
                  }
                  const isThoughtfulCustom = trimmed.length >= 12;
                  const earnedDelta = isThoughtfulCustom ? 16 : -4;
                  submitLike(trimmed, 0, earnedDelta, isThoughtfulCustom);
                }}
                className="flex gap-2 pt-1"
              >
                <input
                  type="text"
                  name="hinge_custom_note"
                  aria-label={`Optional comment for ${currentProfile.name}`}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder={`Optional: write your own note to ${currentProfile.name}...`}
                  className="flex-1 rounded-full border border-stone-300 px-4 py-2.5 text-sm text-[#18101E]"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-[#B83253] hover:bg-[#9E2846] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition cursor-pointer"
                >
                  {customNote.trim() ? 'Send Like + Note' : 'Send Like'}
                </button>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* Celebratory Match Splash Overlay */}
      {matchCelebration &&
        createPortal(
          <div
            data-testid="hinge-match-celebration"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#18101E]/65 p-4"
            role="dialog"
            aria-label={`Matched with ${matchCelebration.name}`}
            onClick={() => setMatchCelebration(null)}
          >
            <div
              className="editorial-hinge-card w-full max-w-md rounded-3xl bg-[#FFFDF9] p-6 text-center shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-rose-900">
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  {matchCelebration.isDelayed ? 'Earlier Like Matched Back!' : 'It’s a Match!'}
                </span>
              </span>

              <div className="mx-auto h-28 w-28 overflow-hidden rounded-full ring-4 ring-amber-300 shadow-lg">
                <img
                  src={matchCelebration.portrait}
                  alt={matchCelebration.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#18101E]">
                  {matchCelebration.name}, {matchCelebration.age}
                </h2>
                <p className="mt-0.5 text-xs font-semibold text-stone-500">
                  {matchCelebration.job}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Act 2 Unlocked: Vet {matchCelebration.name} across 6 punchy Hinge DM beats to
                  graduate to personal iMessage &amp; unlock Date #1 (or hit 🚩 Cut Loose if red
                  flags drop!).
                </p>
                {matchCelebration.customPlayerNote && (
                  <div
                    data-testid="hinge-custom-live-reply"
                    className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3.5 text-left space-y-1.5"
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Your Open-Ended Note: “{matchCelebration.customPlayerNote}”
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-zinc-900 leading-snug">
                      {matchCelebration.loadingCustomReply ? (
                        <span className="text-zinc-500 italic">
                          {matchCelebration.name} is typing a reply…
                        </span>
                      ) : (
                        <>
                          <span className="font-bold text-[#B83253]">
                            {matchCelebration.name}:{' '}
                          </span>
                          {matchCelebration.liveCustomReply}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                {onOpenChats && (
                  <button
                    type="button"
                    onClick={() => {
                      const targetId = matchCelebration.leadId;
                      setMatchCelebration(null);
                      onOpenChats(targetId);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#18101E] hover:bg-stone-800 px-6 py-3 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4 text-amber-300" />
                    <span>Text {matchCelebration.name} Now →</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setMatchCelebration(null)}
                  className="w-full sm:w-auto rounded-full border border-stone-300 bg-white px-5 py-3 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Keep Browsing Hinge
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
