import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Search,
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
import { awardPassportBonusXp } from '../lib/gamification';
import {
  emitOrganicBingoUnlock,
  IN_FEED_INTERMISSION_CARDS,
} from '../lib/organicInterspersion';
import { playVoiceNotePreview, sfx } from '../lib/sound';
import { liveAiInboxService } from '../services/adapters';
import { CelebrationBurstCanvas } from './CelebrationBurstCanvas';

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
  onDeliverCustomOpenerReply?: (
    leadId: string,
    replyText: string,
    chemistryDelta: number,
    suggestedReplies?: [string, string, string],
  ) => void;
  onSwitchRole: (role: 'her' | 'him') => void;
  onOpenWildMap: () => void;
  onOpenChats?: (leadId?: string) => void;
  onOpenAstroMatcher?: () => void;
  onLaunchIntermissionTarget?: (
    target: 'courtroom' | 'trivia' | 'roast_enm' | 'guides_dilemmas',
  ) => void;
}

interface ActiveReplyTarget {
  kind: 'prompt' | 'photo' | 'voice';
  label: string;
  previewText: string;
  prompt?: HingePromptItem;
}

const VOICE_WAVEFORM_BARS = [38, 68, 52, 88, 64, 95, 46, 78, 92, 58, 82, 44, 74, 60, 85, 48];

const PROFILE_MICRO_DETAILS: Record<
  string,
  {
    pills: [string, string, string];
    pollQuestion: string;
    pollOptions: [string, string, string];
    pollReaction: string;
  }
> = {
  julian: {
    pills: ['♎ Libra', '🍷 Burgundy & Tea', '⏱️ Replies <5m'],
    pollQuestion: 'Pick our ideal Thursday first round:',
    pollOptions: [
      'Corner wine bar + architectural gossip',
      'Secondhand bookshop + espresso',
      'Rainy walk + pub booth',
    ],
    pollReaction: 'Julian: "Proper answer. Consider half seven officially penciled in x"',
  },
  soren: {
    pills: ['♍ Virgo', '🎾 Clay-Court Leftie', '❄️ Cold Plunge'],
    pollQuestion: 'Mixed-doubles wager: if we win Set 1, loser buys…',
    pollOptions: ['Oysters & crisp Chablis', 'Post-match sauna smoothies', 'Friday dinner'],
    pollReaction: 'Søren: "Deal. Hope your backhand handles pressure."',
  },
  miles: {
    pills: ['♑ Capricorn', '☕ Roastery Early Bird', '🛠️ Fixes Everything'],
    pollQuestion: 'Sunday morning non-negotiable:',
    pollOptions: ['Fresh pour-over in bed', '8 AM farmers-market run', 'Zero alarms until ten'],
    pollReaction: 'Miles: "Beans are already ground. You don’t lift a finger."',
  },
  graham: {
    pills: ['♊ Gemini', '🥃 5:15 PM Martinis', '🔕 DND After 6:30 PM'],
    pollQuestion: 'Spontaneous weekday drink window:',
    pollOptions: [
      '5:15 PM quick Gibson',
      '8:30 PM unhurried dinner',
      'All-weekend coastal drive',
    ],
    pollReaction: 'Graham: "Haha 5:15 sharp works best before my Tokyo market call!"',
  },
  connor: {
    pills: ['♈ Aries', '🍕 Shares Costco Card', '🎉 VIP Promoter'],
    pollQuestion: 'Ideal Friday warm-up:',
    pollOptions: ['Rooftop bottle table', 'Quiet neighborhood bistro', 'Cook pasta at home'],
    pollReaction: 'Connor: "Wait quiet bistro? As long as they don’t card too hard lol."',
  },
  devon: {
    pills: ['♓ Pisces', '🎸 2 AM Acoustic', '🛋️ Loves Cozy Sofas'],
    pollQuestion: 'Best second-date energy:',
    pollOptions: [
      'You cook while I play guitar',
      'Reservation at The Marlow',
      'Gallery walk downtown',
    ],
    pollReaction: 'Devon: "Your sofa + your groceries sounds way more authentic than restaurants."',
  },
  claire: {
    pills: ['♏ Scorpio', '🍸 Dirty Gibson', '🏡 Two Sets of Keys'],
    pollQuestion: 'Fastest way to earn a second drink with me:',
    pollOptions: [
      'Lock 7:45 dinner with zero 20-questions',
      'Keep your phone face-down all night',
      'Make me laugh inside 60 seconds',
    ],
    pollReaction: 'Claire: "Smart choice. Decisive men skip straight to the front of the line."',
  },
  sienna: {
    pills: ['♉ Taurus', '🎶 Al Green on Vinyl', '🌿 Courtyard Hostess'],
    pollQuestion: 'Pick the Sunday afternoon soundtrack:',
    pollOptions: ['Al Green & Fleetwood Mac', '90s R&B classics', 'Spanish guitar on the patio'],
    pollReaction: 'Sienna: "Pouring two glasses of Sancerre already."',
  },
  vanessa: {
    pills: ['♌ Leo', '🍷 Bel Air Cellar', '📵 Weekday Daytime Only'],
    pollQuestion: 'Favorite spontaneous escape:',
    pollOptions: ['4 PM hotel wine bar', 'Saturday night dinner party', 'Sunday brunch at yours'],
    pollReaction: 'Vanessa: "4 PM hotel bar is perfection, weekends are chaotic with contractors!"',
  },
  astrid: {
    pills: ['♒ Aquarius', '🍍 Solo-Poly (Calendar Open)', '❄️ Nordic Cold Plunge'],
    pollQuestion: 'Ideal non-escalator weekend rhythm:',
    pollOptions: [
      'Friday Malibu sauna + separate Sunday mornings',
      '24/7 texting all week',
      'Surprise unannounced drop-ins',
    ],
    pollReaction: 'Astrid: "Upfront honesty and sacred solo Sundays? You already get my rhythm."',
  },
  brooke: {
    pills: ['♎ Libra', '🎾 Court 1 Regular', '👀 Insists on Table 9'],
    pollQuestion: 'Dress code for Friday patio steak night:',
    pollOptions: [
      'Navy blazer facing Table 9',
      'Quiet booth in the back room',
      'Cook dinner at home away from crowds',
    ],
    pollReaction: 'Brooke: "Definitely the front patio by Table 9 so everyone sees us toast!"',
  },
  vivienne: {
    pills: ['♐ Sagittarius', '🎬 Signs Texts "-V"', '🥂 Cannes to Pacific'],
    pollQuestion: 'How do you handle a 6-point dim bistro menu?',
    pollOptions: [
      'Order Barolo & let the chef send courses',
      'Pull out a blinding phone flashlight',
      'Ask if they have chicken tenders',
    ],
    pollReaction: 'Vivienne: "Chef’s courses and Barolo. Splendid instinct. -V"',
  },
};

const PHOTO_MAGNIFIER_CLUES: Record<
  string,
  { tone: 'green' | 'red'; clueText: string }
> = {
  julian: {
    tone: 'green',
    clueText:
      '🔍 Background Zoom: Dog-eared Colette paperback, pressed linen cuff, and zero ring tan on his espresso hand.',
  },
  soren: {
    tone: 'green',
    clueText:
      '🔍 Background Zoom: Spotless birch countertop, two linen hand towels, and fresh coffee beans beside his racquet bag.',
  },
  miles: {
    tone: 'green',
    clueText:
      '🔍 Background Zoom: Seasoned 12-inch cast-iron skillet, botanical hand soap, and four plumped cotton pillows down the hall.',
  },
  graham: {
    tone: 'red',
    clueText:
      '🔍 Background Zoom: Watch dial reads 6:41 PM while a suburban carpool decal glints in the SUV side mirror!',
  },
  connor: {
    tone: 'red',
    clueText:
      '🔍 Background Zoom: Unlined plastic grocery-bag bathroom wastebasket + 3-in-1 body wash on the tub ledge ("App glitched my age lol").',
  },
  devon: {
    tone: 'red',
    clueText:
      '🔍 Background Zoom: Three ring lights and an air mattress tucked behind his acoustic guitar stand.',
  },
  claire: {
    tone: 'green',
    clueText:
      '🔍 Background Zoom: Statement emerald on her RIGHT hand only; phone face-down beside a three-olive Gibson.',
  },
  sienna: {
    tone: 'green',
    clueText:
      '🔍 Background Zoom: Al Green spinning on walnut vinyl, olive-tree courtyard keys, and zero clutter.',
  },
  vanessa: {
    tone: 'red',
    clueText:
      '🔍 Background Zoom: Framed 20th-anniversary couple portrait reflected upside-down in her Bordeaux glass!',
  },
  brooke: {
    tone: 'red',
    clueText:
      '🔍 Background Zoom: Camera angled directly past her spritz toward Court 4 where her silver-haired ex is serving!',
  },
  astrid: {
    tone: 'green',
    clueText:
      '🔍 Background Zoom: Shared color-coded Solo-Poly calendar on her tablet, 100% upfront with zero sneaking.',
  },
  vivienne: {
    tone: 'green',
    clueText:
      '🔍 Background Zoom: Cannes Festival laminate tucked beside tortoiseshell bistro readers and vintage Burgundy.',
  },
};

function resolvePhotoMagnifierClue(profile: V35CastProfile) {
  if (PHOTO_MAGNIFIER_CLUES[profile.id]) return PHOTO_MAGNIFIER_CLUES[profile.id];
  return profile.tier === 'trap'
    ? {
        tone: 'red' as const,
        clueText:
          '🔍 Background Zoom: Suspiciously cropped dinner reflection + muted weekend notifications.',
      }
    : {
        tone: 'green' as const,
        clueText:
          '🔍 Background Zoom: Real bedframe, warm table lamps (zero overhead glare), and bare left ring finger.',
      };
}

function resolveProfileMicroDetails(profile: V35CastProfile) {
  if (PROFILE_MICRO_DETAILS[profile.id]) return PROFILE_MICRO_DETAILS[profile.id];
  const isHer = profile.role === 'her';
  return {
    pills: isHer
      ? (['✨ Zero App Games', '🍷 Proper Glassware', '✈️ Passport Ready'] as [
          string,
          string,
          string,
        ])
      : (['🥂 Books the Table', '📵 Phone Off Table', '🍳 Cooks From Scratch'] as [
          string,
          string,
          string,
        ]),
    pollQuestion: isHer
      ? 'What wins your vote for Date #1?'
      : 'Pick our Friday night pace:',
    pollOptions: [
      'Candlelit wine booth at 7:30',
      'Vinyl bar + late-night bites',
      'Golden-hour walk + espresso',
    ] as [string, string, string],
    pollReaction: `${profile.name}: "Good taste. Now send a note so we actually lock it in."`,
  };
}

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
  onOpenAstroMatcher,
  onLaunchIntermissionTarget,
}) => {
  const targetRole = role === 'her' ? 'him' : 'her';

  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [focusedLeadId, setFocusedLeadId] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [heardVoiceIds, setHeardVoiceIds] = useState<string[]>([]);
  const [profilePollPicks, setProfilePollPicks] = useState<Record<string, number>>({});
  const [zoomedClueLeadIds, setZoomedClueLeadIds] = useState<string[]>([]);
  const [intermissionVotes, setIntermissionVotes] = useState<Record<string, number>>({});
  const [dismissedIntermissionIds, setDismissedIntermissionIds] = useState<string[]>([]);
  const voiceCleanupRef = useRef<(() => void) | null>(null);

  const stopVoicePlayback = () => {
    if (voiceCleanupRef.current) {
      voiceCleanupRef.current();
      voiceCleanupRef.current = null;
    }
    setPlayingVoiceId(null);
  };

  useEffect(() => {
    return () => {
      if (voiceCleanupRef.current) {
        voiceCleanupRef.current();
        voiceCleanupRef.current = null;
      }
    };
  }, []);
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
        (p) => p.role === targetRole && !cutLooseIds.includes(p.id),
      ).sort(
        (a, b) =>
          (a.discoveryDoor === 'wild' ? 1 : 0) - (b.discoveryDoor === 'wild' ? 1 : 0),
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
    stopVoicePlayback();
  }, [role]);

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
        text: `✨ Surprise Match Pop-In! ${readyPopIn.name} just matched with your earlier Like, open Chats & Dates!`,
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
    stopVoicePlayback();
    sfx.swipeLeft();
    setReplyTarget(null);
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
            playerName: wallet.playerName || undefined,
            playerPersonaVibe: wallet.personaTag || undefined,
            personaLore: `${targetPerson.tagline} ${targetPerson.trapTellSummary || targetPerson.vulnerabilityNote || ''}`.trim(),
            platform: 'tinder',
            playerMessage: openerText,
            history: [{ sender: 'match', text: targetPreview }],
          })
          .then((res) => {
            onDeliverCustomOpenerReply?.(
              targetPerson.id,
              res.herReply,
              res.chemistryDelta,
              res.suggestedReplies,
            );
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
          text: `Sent Like • Pending, ${targetPerson.name} is selective! Read prompts closely (or send a 🌹 Standout Rose) to match right away.`,
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
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 text-xs font-semibold text-white hover:bg-zinc-800 cursor-pointer"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Open Chat</span>
            </button>
          )}
        </div>
      )}

      {/* Tonight's Cast Strip */}
      {allHingeCast.length > 0 && (
        <section
          data-testid="hinge-cast-strip"
          aria-label="Tonight's Prowl Lineup"
          className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-2xs"
        >
          <div className="mb-2 flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-zinc-900">
              Tonight’s {allHingeCast.length} Singles
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
                    stopVoicePlayback();
                    sfx.messagePop();
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
                        ? 'ring-2 ring-rose-600 ring-offset-1'
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
                      <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-zinc-950 shadow-xs">
                        ⏳
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs leading-tight whitespace-nowrap ${
                      isCurrent ? 'font-semibold text-rose-600' : 'font-medium text-zinc-700'
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

      {/* Organic Every-2nd-Swipe In-Feed Lounge Intermission Card (Courtroom / ENM / Trivia Bluff) */}
      {(() => {
        const swipeTotal = passedIds.length + matchedLeadIds.length;
        if (swipeTotal < 2) return null;
        const card =
          IN_FEED_INTERMISSION_CARDS[
            Math.floor((swipeTotal - 2) / 2) % IN_FEED_INTERMISSION_CARDS.length
          ];
        if (!card || dismissedIntermissionIds.includes(card.id)) return null;
        const picked = intermissionVotes[card.id];

        return (
          <section
            data-testid="hinge-intermission-card"
            className="rounded-2xl border border-rose-200 bg-white p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-md bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                {card.badge}
              </span>
              <button
                type="button"
                aria-label="Dismiss intermission card"
                onClick={() =>
                  setDismissedIntermissionIds((prev) => [...prev, card.id])
                }
                className="text-xs font-medium text-zinc-400 hover:text-zinc-900 cursor-pointer"
              >
                Skip ✕
              </button>
            </div>
            <p className="text-sm sm:text-base font-bold text-zinc-950 leading-snug">
              {card.question}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[card.optionA, card.optionB].map((optLabel, idx) => {
                const isPicked = picked === idx;
                return (
                  <button
                    key={optLabel}
                    type="button"
                    onClick={() => {
                      sfx.greenFlag();
                      if (picked === undefined) {
                        awardPassportBonusXp(
                          `intermission_${card.id}`,
                          5,
                          'Quick Check Answered!',
                          '⚡ +5 XP',
                        );
                      }
                      setIntermissionVotes((prev) => ({ ...prev, [card.id]: idx }));
                    }}
                    className={`rounded-xl border px-3.5 py-2.5 text-left text-xs sm:text-sm font-semibold transition cursor-pointer ${
                      isPicked
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-zinc-200 bg-zinc-50 hover:border-rose-300 text-zinc-900'
                    }`}
                  >
                    {optLabel}
                  </button>
                );
              })}
            </div>
            {picked !== undefined && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-emerald-950">
                <span>{card.verdictText}</span>
                {onLaunchIntermissionTarget && (
                  <button
                    type="button"
                    onClick={() => onLaunchIntermissionTarget(card.targetAction)}
                    className="font-bold text-rose-600 hover:text-zinc-950 cursor-pointer"
                  >
                    {card.linkedSurfaceLabel}
                  </button>
                )}
              </div>
            )}
          </section>
        );
      })()}

      {/* Empty Deck State */}
      {!currentProfile ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-4 shadow-2xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-950">
            You’ve Seen Today’s Prowl Standouts
          </h2>
          <p className="text-sm text-zinc-600 max-w-md mx-auto">
            Step out to The Marlow Lounge, Terminal B, or Hawthorne University, or shuffle passed profiles.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onOpenWildMap}
              className="inline-flex h-10 items-center rounded-lg bg-zinc-900 hover:bg-zinc-800 px-5 text-sm font-semibold text-white cursor-pointer"
            >
              Explore 10 In The Wild Hotspots
            </button>
            <button
              type="button"
              onClick={() => setPassedIds([])}
              className="inline-flex h-10 items-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-5 text-sm font-semibold text-zinc-800 cursor-pointer"
            >
              Shuffle Passed Profiles
            </button>
          </div>
        </div>
      ) : (
        <article className="relative rounded-2xl border border-zinc-200 bg-white shadow-2xs">
          {/* Authentic Minimal Profile Header */}
          <header className="flex flex-wrap items-baseline justify-between gap-2 px-6 pt-6 pb-3">
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                {currentProfile.name}
              </h1>
              <span className="text-xl font-medium text-zinc-500">{currentProfile.age}</span>
              {currentProfile.discoveryDoor === 'wild' && (
                <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                  🍸 Also Spotted In The Wild
                </span>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">
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
            {/* Photo 1. Unobstructed Full-Bleed Lead Portrait */}
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
                <div className="border-t border-zinc-100 bg-white px-4 py-3 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-medium text-zinc-800 leading-snug">
                      {currentProfile.slides[0].caption}
                    </span>
                    <button
                      type="button"
                      data-testid="hinge-photo-magnifier-btn"
                      onClick={() => {
                        sfx.cardHoverTick();
                        if (!zoomedClueLeadIds.includes(currentProfile.id)) {
                          setZoomedClueLeadIds((prev) => [...prev, currentProfile.id]);
                          awardPassportBonusXp(
                            `photo_zoom_${currentProfile.id}`,
                            5,
                            'Photo Detail Spotted!',
                            '🔍 +5 XP',
                          );
                          emitOrganicBingoUnlock(
                            'liddedbin',
                            'Zoomed a dating profile photo to inspect background red/green flags',
                            3,
                          );
                        }
                      }}
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:border-rose-300 hover:text-rose-600 px-2.5 py-1 text-xs font-semibold text-zinc-700 transition cursor-pointer"
                    >
                      <Search className="h-3 w-3" />
                      <span>
                        {zoomedClueLeadIds.includes(currentProfile.id)
                          ? 'Clue Spotted'
                          : 'Inspect Background'}
                      </span>
                    </button>
                  </div>
                  {zoomedClueLeadIds.includes(currentProfile.id) && (
                    <div
                      data-testid="hinge-photo-magnifier-clue"
                      className={`rounded-xl border px-3 py-2 text-xs font-medium leading-relaxed ${
                        resolvePhotoMagnifierClue(currentProfile).tone === 'red'
                          ? 'border-rose-200 bg-rose-50 text-rose-950'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-950'
                      }`}
                    >
                      {resolvePhotoMagnifierClue(currentProfile).clueText}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Prompt 1 */}
            <div className="editorial-prompt-card relative rounded-2xl p-6 pr-16">
              <div className="text-xs font-medium text-zinc-500">
                {currentProfile.prompts[0].question}
              </div>
              <p className="mt-1.5 font-hinge-quote text-lg sm:text-xl leading-snug text-zinc-950">
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
                    <Volume2 className="h-3.5 w-3.5 text-rose-600" />
                    <span>{currentProfile.voicePrompt.question}</span>
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-zinc-400">
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
                      if (playingVoiceId === currentProfile.id) {
                        stopVoicePlayback();
                      } else {
                        stopVoicePlayback();
                        const profileId = currentProfile.id;
                        const voiceStyle =
                          currentProfile.role === 'her'
                            ? 'her'
                            : currentProfile.tier === 'trap'
                              ? 'trap_cub'
                              : 'green_cub';
                        setPlayingVoiceId(profileId);
                        setHeardVoiceIds((prev) =>
                          prev.includes(profileId) ? prev : [...prev, profileId],
                        );
                        voiceCleanupRef.current = playVoiceNotePreview(
                          currentProfile.voicePrompt!.audioUrl,
                          voiceStyle,
                          () => {
                            voiceCleanupRef.current = null;
                            setPlayingVoiceId((cur) => (cur === profileId ? null : cur));
                          },
                        );
                      }
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-rose-600 transition cursor-pointer"
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
                              ? 'bg-rose-600 animate-pulse'
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
                {resolveProfileMicroDetails(currentProfile).pills.map((pill, pillIdx) =>
                  pillIdx === 0 && onOpenAstroMatcher ? (
                    <button
                      key={pill}
                      type="button"
                      onClick={onOpenAstroMatcher}
                      title="Open 12×12 Cougar × Cub Zodiac Matcher"
                      className="rounded-md bg-rose-50 border border-rose-200 hover:border-rose-500 px-2.5 py-1 text-zinc-900 font-semibold cursor-pointer transition"
                    >
                      {pill} · Match Signs ↗
                    </button>
                  ) : (
                    <span
                      key={pill}
                      className="rounded-md bg-rose-50/70 border border-rose-200/70 px-2.5 py-1 text-zinc-800"
                    >
                      {pill}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Interactive 1-Tap Profile Vibe Poll (Cute Micro-Detail + +3 XP) */}
            {(() => {
              const micro = resolveProfileMicroDetails(currentProfile);
              const pickedIdx = profilePollPicks[currentProfile.id];
              return (
                <div
                  data-testid="hinge-profile-micro-poll"
                  className="rounded-2xl border border-zinc-200/90 bg-zinc-50/70 p-5 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-rose-600">📊 Interactive Prompt Poll</span>
                    {pickedIdx !== undefined && (
                      <span className="font-semibold text-emerald-700">+3 XP</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-zinc-950">{micro.pollQuestion}</p>
                  <div className="grid gap-1.5">
                    {micro.pollOptions.map((opt, idx) => {
                      const active = pickedIdx === idx;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            sfx.messagePop();
                            if (pickedIdx === undefined) {
                              awardPassportBonusXp(
                                `profile_poll_${currentProfile.id}`,
                                3,
                                'Profile Poll Spark!',
                                '📊 +3 XP',
                              );
                            }
                            setProfilePollPicks((prev) => ({
                              ...prev,
                              [currentProfile.id]: idx,
                            }));
                          }}
                          className={`flex items-center justify-between rounded-xl border px-3.5 py-2 text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                            active
                              ? 'border-zinc-950 bg-zinc-950 text-white'
                              : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400'
                          }`}
                        >
                          <span>{opt}</span>
                          {active && <Check className="h-3.5 w-3.5 shrink-0 text-rose-400" />}
                        </button>
                      );
                    })}
                  </div>
                  {pickedIdx !== undefined && (
                    <p className="pt-0.5 text-xs font-medium text-rose-700 animate-stage-in">
                      {micro.pollReaction}
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Photo 2. Unobstructed Photo + Authentic Below-Photo 1st-Person Caption */}
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
              <p className="mt-1.5 font-hinge-quote text-lg sm:text-xl leading-snug text-zinc-950">
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
                className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                    <Clapperboard className="h-3.5 w-3.5" />
                    <span>Friday Night Storyline</span>
                  </span>
                </div>
                <p className="text-sm text-zinc-800 leading-relaxed">
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
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <span>Match with {currentProfile.name} to play →</span>
                </button>
              </div>
            )}

            {/* Photo 3. Unobstructed Photo + Authentic Below-Photo 1st-Person Caption */}
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
              <p className="mt-1.5 font-hinge-quote text-lg sm:text-xl leading-snug text-zinc-950">
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

            {/* Photos 4, 5, 6. Unobstructed Photos + Authentic Below-Photo 1st-Person Captions */}
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
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-rose-600 px-6 text-sm font-semibold text-white shadow-2xs hover:bg-rose-700 transition cursor-pointer"
              >
                <Heart className="h-4 w-4 fill-white" />
                <span>Send a Note or Rose</span>
              </button>
            </div>
          </div>

          {/* Authentic Hinge Sticky Bottom-Left Floating Pass (✕) Button */}
          <div className="sticky bottom-6 z-30 pointer-events-none flex items-center justify-start px-7 sm:px-9 pb-5 -mt-20">
            <button
              type="button"
              data-testid="hinge-sticky-pass-btn"
              aria-label={`Pass on ${currentProfile.name}`}
              title={`Pass on ${currentProfile.name} (←)`}
              onClick={handlePass}
              className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-950 shadow-lg hover:scale-105 hover:bg-zinc-900 hover:text-white active:scale-95 transition cursor-pointer"
            >
              <X className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>
        </article>
      )}

      {/* Hinge Opener & Standout Rose Modal Sheet */}
      {replyTarget &&
        currentProfile &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-zinc-950/55 p-3 sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-label={`Reply to ${currentProfile.name}`}
            onClick={() => setReplyTarget(null)}
          >
            <div
              className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="shrink-0 flex items-start justify-between gap-3 border-b border-zinc-200 bg-white px-5 py-4 sm:px-6">
                <p className="text-base font-semibold text-zinc-950 leading-snug">
                  &ldquo;{replyTarget.previewText}&rdquo;
                </p>
                <button
                  type="button"
                  aria-label="Close reply sheet"
                  onClick={() => setReplyTarget(null)}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4">

              {replyTarget.prompt && (
                <div className="space-y-2">
                  {replyTarget.prompt.openers.map((opt) => {
                    const isVip = 'isVipSmooth' in opt && Boolean(opt.isVipSmooth);
                    const cost = isVip ? 1 : 0;
                    return (
                      <button
                        key={opt.text}
                        type="button"
                        data-testid="hinge-opener-option"
                        onClick={() => submitLike(opt.text, cost, opt.delta)}
                        className={`group w-full rounded-xl p-3.5 text-left text-sm whitespace-normal transition cursor-pointer ${
                          isVip
                            ? 'border border-rose-200 bg-rose-50/60 font-semibold text-zinc-950 hover:border-rose-400'
                            : 'border border-zinc-200 bg-white font-medium text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="leading-relaxed">{opt.text}</div>
                          <span
                            className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                              isVip
                                ? 'bg-rose-600 text-white group-hover:bg-rose-700'
                                : 'bg-zinc-100 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white'
                            }`}
                          >
                            {isVip
                              ? wallet.isVip || wallet.isFounderUnlimited
                                ? '🌹 Send a Standout Rose'
                                : '🌹 Send a Standout Rose (1 Cr)'
                              : 'Send'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Free Custom Opener OR 1-Tap Plain Hinge Like */}
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
                  placeholder={`Write your own note to ${currentProfile.name} (optional)...`}
                  className="min-w-0 flex-1 h-10 rounded-lg border border-zinc-300 px-3.5 text-sm text-zinc-950 focus:border-zinc-950 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 h-10 rounded-lg bg-rose-600 hover:bg-rose-700 px-4 text-sm font-semibold text-white transition cursor-pointer"
                >
                  {customNote.trim() ? 'Send Like + Note' : 'Send Like'}
                </button>
              </form>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Celebratory Match Splash Overlay with Confetti & Overlapping Polaroid Slam */}
      {matchCelebration &&
        createPortal(
          <div
            data-testid="hinge-match-celebration"
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/65 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Matched with ${matchCelebration.name}`}
            onClick={() => setMatchCelebration(null)}
          >
            <CelebrationBurstCanvas active={true} palette="match" />
            <div
              className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl animate-stage-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="shrink-0 flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-950 px-6 py-4 text-white">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-300">
                  <Sparkles className="h-4 w-4 text-rose-400" />
                  <span>
                    {matchCelebration.isDelayed ? 'Earlier Like Matched Back!' : '🥂 It’s a Match!'}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setMatchCelebration(null)}
                  aria-label="Close match splash"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-zinc-200 hover:bg-white/20 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-6 text-center space-y-4">
                <div className="flex items-center justify-center -space-x-4 pt-1">
                  <div className="flex h-22 w-20 -rotate-6 flex-col items-center justify-center rounded-xl border-2 border-zinc-200 bg-zinc-950 text-white shadow-lg">
                    <span className="text-xl">{role === 'her' ? '🐆' : '🥂'}</span>
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-rose-300">
                      {wallet.playerName || 'You'}
                    </span>
                  </div>
                  <div className="z-10 h-26 w-22 rotate-3 overflow-hidden rounded-xl border-2 border-white bg-white p-1 shadow-xl ring-2 ring-rose-500">
                    <img
                      src={matchCelebration.portrait}
                      alt={matchCelebration.name}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                    {matchCelebration.name}, {matchCelebration.age}
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-zinc-500">
                    {matchCelebration.job}
                  </p>
                  {matchCelebration.customPlayerNote && (
                    <div
                      data-testid="hinge-custom-live-reply"
                      className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-left space-y-1.5"
                    >
                      <div className="text-xs font-medium text-zinc-500">
                        Your note: “{matchCelebration.customPlayerNote}”
                      </div>
                      <div className="text-sm font-medium text-zinc-900 leading-snug">
                        {matchCelebration.loadingCustomReply ? (
                          <span className="text-zinc-500 italic">
                            {matchCelebration.name} is typing a reply…
                          </span>
                        ) : (
                          <>
                            <span className="font-semibold text-rose-600">
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
                      className="w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-5 text-sm font-semibold text-white cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4 text-rose-400" />
                      <span>Text {matchCelebration.name} Now →</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setMatchCelebration(null)}
                    className="w-full sm:w-auto h-10 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                  >
                    Keep Browsing Prowl
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
