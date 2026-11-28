import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Ban,
  Check,
  ChevronDown,
  Flame,
  Flag,
  GraduationCap,
  Hash,
  Heart,
  MessageCircle,
  Phone,
  Search,
  Send,
  Share2,
  Smartphone,
  Sparkles,
  Unlock,
  Video,
  X,
} from 'lucide-react';
import { MONETIZATION_CONFIG } from '../config/monetization';
import { V35_CAST_VISUALS } from '../data/v35AssetManifest';
import { getCastProfileById } from '../data/v35Cast';
import {
  type ChatBeat,
  type CutLooseVerdict,
  V35_CHAT_CHAPTERS,
  V35_DATE_SCRIPTS,
  V35_DISCORD_CHANNELS,
  V35_TABLE_9_CONSPIRACY,
} from '../data/v35ChatsAndDates';
import { getWildMeetCuteSeed } from '../data/v35WildVenues';
import {
  getPersonaVibeSpec,
  PERSONA_VIBE_SPECS,
  type WalletState,
} from '../domain/economy';
import { sfx } from '../lib/sound';
import { shareOrCopy } from '../lib/viral';
import { liveAiInboxService } from '../services/adapters';
import { RomanticDateStage } from './RomanticDateStage';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

export interface ActiveMatchThread {
  leadId: string;
  originDoor: 'hinge' | 'wild';
  originVenueId?: string;
  stage: 'app_dm' | 'imessage';
  currentBeat: number;
  chemistry: number;
  datesCompleted: number;
  lastDateRank?: 'S' | 'A' | 'B' | 'F';
  sRankLockedOut?: boolean;
  adaptiveSuggestions?: [string, string, string];
  messages: { sender: 'match' | 'player' | 'system'; text: string }[];
  archivedAppMessages?: { sender: 'match' | 'player' | 'system'; text: string }[];
}

export function createInitialThread(
  leadId: string,
  originDoor: 'hinge' | 'wild',
  openerText?: string,
  isCustomOpener = false,
  originVenueId?: string,
): ActiveMatchThread {
  const chapter = V35_CHAT_CHAPTERS[leadId];
  const stage: 'app_dm' | 'imessage' = originDoor === 'wild' ? 'imessage' : 'app_dm';
  const wildSeed = originDoor === 'wild' ? getWildMeetCuteSeed(leadId, originVenueId) : undefined;
  const firstBeat = stage === 'imessage' ? chapter?.imessage[0] : chapter?.tinder[0];
  const seeded: { sender: 'match' | 'player' | 'system'; text: string }[] = [];

  if (originDoor === 'wild' && wildSeed) {
    seeded.push({ sender: 'system', text: `iMessage · ${wildSeed.venueLabel}` });
  }
  if (openerText) {
    seeded.push({ sender: 'player', text: openerText });
  }
  if (!isCustomOpener) {
    const openingIncoming =
      originDoor === 'wild' && wildSeed
        ? wildSeed.incomingMessages
        : (firstBeat?.incomingMessages ?? []);
    for (const m of openingIncoming) {
      seeded.push({ sender: 'match', text: m });
    }
  }

  return {
    leadId,
    originDoor,
    originVenueId,
    stage,
    currentBeat: 1,
    chemistry: originDoor === 'wild' ? 62 : 50,
    datesCompleted: 0,
    sRankLockedOut: false,
    messages: seeded,
  };
}

export interface ChatsAndDatesViewProps {
  role: 'her' | 'him';
  wallet: WalletState;
  threads: ActiveMatchThread[];
  selectedLeadId?: string | null;
  cutLooseIds: string[];
  cubSchoolStars?: number;
  initialOpenConspiracy?: boolean;
  autoLaunchDateRequest?: { leadId: string; dateNumber: 1 | 2 | 3; nonce: number } | null;
  onSelectLead?: (leadId: string) => void;
  onUpdateThread: (updated: ActiveMatchThread) => void;
  onSpendCredits: (cost: number) => boolean;
  onUnlockBucketItem: (
    bucket: 'unlockedPovIds' | 'unlockedPhotoIds' | 'unlockedEpilogueIds',
    itemId: string,
    cost: number,
  ) => boolean;
  onCutLooseTrap: (leadId: string, clueId?: string) => void;
  onConfirmCutGenuine: (leadId: string) => void;
  onLoseHeart: () => void;
  onRecordConspiracyClue?: (clueId: string) => void;
  onOpenHinge: () => void;
  onOpenBoutique: (initialTab?: 'shop' | 'vip' | 'rewards') => void;
  onOpenCubSchool?: () => void;
  onSavePersona?: (playerName: string, personaTag: string) => void;
}

export const ChatsAndDatesView: React.FC<ChatsAndDatesViewProps> = ({
  role,
  wallet,
  threads,
  selectedLeadId,
  cutLooseIds,
  cubSchoolStars = 0,
  initialOpenConspiracy = false,
  autoLaunchDateRequest = null,
  onSelectLead,
  onUpdateThread,
  onSpendCredits,
  onUnlockBucketItem,
  onCutLooseTrap,
  onConfirmCutGenuine,
  onLoseHeart,
  onRecordConspiracyClue,
  onOpenHinge,
  onOpenBoutique,
  onOpenCubSchool,
  onSavePersona,
}) => {
  const visibleThreads = useMemo(
    () =>
      threads.filter((t) => {
        if (cutLooseIds.includes(t.leadId)) return false;
        const profile = getCastProfileById(t.leadId);
        return Boolean(profile && profile.role !== role);
      }),
    [threads, cutLooseIds, role],
  );
  const etiquetteBonusActive = cubSchoolStars >= 4;
  const activeVibeSpec = getPersonaVibeSpec(wallet.personaTag);

  const [surface, setSurface] = useState<'dm' | 'discord' | 'conspiracy'>(
    initialOpenConspiracy ? 'conspiracy' : 'dm',
  );
  const [activeLeadId, setActiveLeadId] = useState<string>(
    selectedLeadId || visibleThreads[0]?.leadId || '',
  );
  const [activeDiscordId, setActiveDiscordId] = useState<string>(V35_DISCORD_CHANNELS[0].id);
  const [discordExtraMsgs, setDiscordExtraMsgs] = useState<
    Record<string, { sender: string; badge: string; text: string; isPlayer?: boolean }[]>
  >({});
  const [discordAskedPrompts, setDiscordAskedPrompts] = useState<Record<string, string[]>>({});
  const [discordReactions, setDiscordReactions] = useState<Record<string, string[]>>({});
  const [discordTypingLabel, setDiscordTypingLabel] = useState<string | null>(null);
  const [discordFreeInput, setDiscordFreeInput] = useState('');
  const [sendingDiscordAi, setSendingDiscordAi] = useState(false);
  const [spicyMode, setSpicyMode] = useState(false);
  const [freeInput, setFreeInput] = useState('');
  const [sendingAi, setSendingAi] = useState(false);
  const [dmTypingLabel, setDmTypingLabel] = useState<string | null>(null);
  const [dmReactions, setDmReactions] = useState<Record<string, string>>({});
  const [sparkToast, setSparkToast] = useState<{ delta: number; nonce: number } | null>(null);
  const [inspectedExifIds, setInspectedExifIds] = useState<string[]>([]);
  const [calloutPromptLeadId, setCalloutPromptLeadId] = useState<string | null>(null);
  const [snoozedImessageIds, setSnoozedImessageIds] = useState<string[]>([]);
  const [showArchivedHinge, setShowArchivedHinge] = useState(false);
  const [dismissedPersonaCard, setDismissedPersonaCard] = useState(false);
  const [quickName, setQuickName] = useState(wallet.playerName || '');
  const [quickVibe, setQuickVibe] = useState(
    wallet.personaTag || PERSONA_VIBE_SPECS[0].id,
  );
  const [pendingDateAfterPersona, setPendingDateAfterPersona] = useState<{
    leadId: string;
    dateNumber: 1 | 2 | 3 | 4;
  } | null>(null);
  const [imessageGradSplash, setImessageGradSplash] = useState<{
    leadId: string;
    name: string;
    age: number;
    job: string;
    portrait: string;
    openingLine: string;
  } | null>(null);

  const dmFeedRef = useRef<HTMLDivElement | null>(null);
  const discordFeedRef = useRef<HTMLDivElement | null>(null);
  const pendingTimersRef = useRef<number[]>([]);
  const isTestEnv = Boolean(import.meta.env.VITEST);

  useEffect(() => {
    return () => {
      for (const id of pendingTimersRef.current) {
        window.clearTimeout(id);
      }
      pendingTimersRef.current = [];
    };
  }, []);
  const [cutLooseModal, setCutLooseModal] = useState<{
    leadId: string;
    verdict: CutLooseVerdict;
  } | null>(null);
  const [activeDateModal, setActiveDateModal] = useState<{
    leadId: string;
    dateNumber: 1 | 2 | 3 | 4;
  } | null>(null);
  const [conspiracyOutcome, setConspiracyOutcome] = useState<string | null>(null);
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  useEffect(() => {
    if (!imessageGradSplash && !pendingDateAfterPersona && !cutLooseModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (imessageGradSplash) {
        setImessageGradSplash(null);
      } else if (cutLooseModal) {
        setCutLooseModal(null);
      } else if (pendingDateAfterPersona) {
        const target = pendingDateAfterPersona;
        setPendingDateAfterPersona(null);
        setActiveDateModal(target);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [imessageGradSplash, pendingDateAfterPersona, cutLooseModal]);

  useEffect(() => {
    if (initialOpenConspiracy) {
      setSurface('conspiracy');
    }
  }, [initialOpenConspiracy]);

  useEffect(() => {
    if (autoLaunchDateRequest) {
      setActiveLeadId(autoLaunchDateRequest.leadId);
      setActiveDateModal({
        leadId: autoLaunchDateRequest.leadId,
        dateNumber: autoLaunchDateRequest.dateNumber,
      });
    }
  }, [autoLaunchDateRequest]);

  useEffect(() => {
    if (selectedLeadId) {
      setActiveLeadId(selectedLeadId);
      if (!initialOpenConspiracy) setSurface('dm');
    }
  }, [selectedLeadId, initialOpenConspiracy]);

  useEffect(() => {
    if (!visibleThreads.some((t) => t.leadId === activeLeadId)) {
      setActiveLeadId(visibleThreads[0]?.leadId || '');
    }
  }, [visibleThreads, activeLeadId]);

  const currentThread = visibleThreads.find((t) => t.leadId === activeLeadId) ?? visibleThreads[0];
  const currentProfile = currentThread ? getCastProfileById(currentThread.leadId) : undefined;
  const currentChapter = currentThread ? V35_CHAT_CHAPTERS[currentThread.leadId] : undefined;

  const latestThreadRef = useRef<ActiveMatchThread | undefined>(currentThread);
  latestThreadRef.current = currentThread;

  // Clear transient banners/drawers whenever switching active match or stage
  useEffect(() => {
    setShowArchivedHinge(false);
    setDmTypingLabel(null);
  }, [activeLeadId, currentThread?.stage]);
  useEffect(() => {
    const el = dmFeedRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [currentThread?.leadId, currentThread?.messages.length, dmTypingLabel, surface]);

  // Always auto-scroll Discord Lounge feed to the newest message / typing bubble
  useEffect(() => {
    const el = discordFeedRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [
    activeDiscordId,
    discordExtraMsgs[activeDiscordId]?.length,
    discordTypingLabel,
    surface,
  ]);

  if (activeDateModal) {
    const dateThread = threads.find((t) => t.leadId === activeDateModal.leadId);
    return (
      <RomanticDateStage
        leadId={activeDateModal.leadId}
        dateNumber={activeDateModal.dateNumber}
        role={role}
        wallet={wallet}
        initialSRankLockedOut={dateThread?.sRankLockedOut}
        onCompleteDate={(leadId, dNum, rank, lockedOut) => {
          const existing = threads.find((t) => t.leadId === leadId);
          if (existing) {
            onUpdateThread({
              ...existing,
              datesCompleted:
                rank === 'F' ? existing.datesCompleted : Math.max(existing.datesCompleted, dNum),
              lastDateRank: rank,
              sRankLockedOut: lockedOut,
            });
          }
        }}
        onLoseHeart={onLoseHeart}
        onSpendCredits={onSpendCredits}
        onUnlockPov={(povId, cost) => onUnlockBucketItem('unlockedPovIds', povId, cost)}
        onUnlockEpilogue={(epId, cost) => onUnlockBucketItem('unlockedEpilogueIds', epId, cost)}
        onRecordConspiracyClue={onRecordConspiracyClue}
        onLaunchNextDate={(nextNum) => setActiveDateModal({ leadId: activeDateModal.leadId, dateNumber: nextNum })}
        onBackToChats={() => setActiveDateModal(null)}
      />
    );
  }

  const handlePickChoice = (
    choiceText: string,
    replyText: string,
    delta: number,
    cost = 0,
  ) => {
    if (!currentThread || !currentChapter || !currentProfile || dmTypingLabel) return;
    if (cost > 0 && !onSpendCredits(cost)) return;

    sfx.messagePop();
    const beatsArray =
      currentThread.stage === 'imessage' ? currentChapter.imessage : currentChapter.tinder;
    const nextBeatNum = currentThread.currentBeat + 1;
    const nextBeatObj = beatsArray.find((b) => b.beatNumber === nextBeatNum);
    const vibeChatBonus = activeVibeSpec?.chatSparkBonus ?? 0;
    const boostedDelta =
      delta > 0
        ? delta + (etiquetteBonusActive ? 4 : 0) + vibeChatBonus
        : delta;
    const newChemistry = Math.max(0, Math.min(100, currentThread.chemistry + boostedDelta));

    setSparkToast({ delta: boostedDelta, nonce: Date.now() });

    if (isTestEnv) {
      const appended: ActiveMatchThread['messages'] = [
        ...currentThread.messages,
        { sender: 'player', text: choiceText },
        { sender: 'match', text: replyText },
      ];
      if (nextBeatObj) {
        for (const m of nextBeatObj.incomingMessages) {
          appended.push({ sender: 'match', text: m });
        }
      }
      onUpdateThread({
        ...currentThread,
        currentBeat: nextBeatNum,
        chemistry: newChemistry,
        messages: appended,
      });
      return;
    }

    // Live human-paced 3-step texting flow:
    // 1. Player message lands right away + typing indicator starts
    const targetLeadId = currentThread.leadId;
    const matchName = currentProfile.name;
    const afterPlayer: ActiveMatchThread = {
      ...currentThread,
      chemistry: newChemistry,
      messages: [...currentThread.messages, { sender: 'player', text: choiceText }],
    };
    onUpdateThread(afterPlayer);
    setDmTypingLabel(`${matchName} is typing`);

    // 2. Match's direct reaction arrives after 620ms
    const t1 = window.setTimeout(() => {
      const latest =
        latestThreadRef.current?.leadId === targetLeadId ? latestThreadRef.current : afterPlayer;
      sfx.messagePop();
      const withReply: ActiveMatchThread = {
        ...latest,
        currentBeat: nextBeatObj ? latest.currentBeat : nextBeatNum,
        messages: [...latest.messages, { sender: 'match', text: replyText }],
      };
      onUpdateThread(withReply);

      if (!nextBeatObj || nextBeatObj.incomingMessages.length === 0) {
        setDmTypingLabel(null);
        return;
      }

      // 3. Brief pause to read their reaction, then next beat's incoming prompt arrives!
      const t2 = window.setTimeout(() => {
        const latestStep2 =
          latestThreadRef.current?.leadId === targetLeadId ? latestThreadRef.current : withReply;
        sfx.messagePop();
        onUpdateThread({
          ...latestStep2,
          currentBeat: nextBeatNum,
          messages: [
            ...latestStep2.messages,
            ...nextBeatObj.incomingMessages.map((m) => ({ sender: 'match' as const, text: m })),
          ],
        });
        setDmTypingLabel(null);
      }, 780);
      pendingTimersRef.current.push(t2);
    }, 620);
    pendingTimersRef.current.push(t1);
  };

  const handleGraduateToImessage = () => {
    if (!currentThread || !currentChapter || !currentProfile) return;
    sfx.victoryFanfare();
    setCalloutPromptLeadId(null);
    setShowArchivedHinge(false);

    const firstImessage = currentChapter.imessage[0];
    const openingLine =
      firstImessage?.incomingMessages[0] ?? 'Made it off the app, so much easier texting you here.';
    const vis = V35_CAST_VISUALS[currentProfile.id];

    // Archive old Hinge App DM messages cleanly so personal iMessage opens as a fresh, authentic iOS thread!
    onUpdateThread({
      ...currentThread,
      stage: 'imessage',
      currentBeat: 1,
      adaptiveSuggestions: undefined,
      chemistry: Math.min(100, currentThread.chemistry + 10),
      archivedAppMessages: [
        ...(currentThread.archivedAppMessages ?? []),
        ...currentThread.messages,
      ],
      messages: [
        { sender: 'system', text: 'iMessage · Today 6:14 PM' },
        ...(firstImessage?.incomingMessages.map((m) => ({ sender: 'match' as const, text: m })) ?? []),
      ],
    });

    if (vis && !isTestEnv) {
      setImessageGradSplash({
        leadId: currentProfile.id,
        name: currentProfile.name,
        age: currentProfile.age,
        job: currentProfile.vitals.job,
        portrait: vis.primaryPortrait,
        openingLine,
      });
    }
  };

  const sendSpontaneousTurn = async (rawText: string, cost = 0) => {
    const trimmed = rawText.replace(/^💎\s*/, '').trim();
    if (!trimmed || !currentThread || !currentProfile || sendingAi || dmTypingLabel) return;
    if (cost > 0 && !onSpendCredits(cost)) return;

    const targetLeadId = currentThread.leadId;
    const shouldAdvanceBeat = currentThread.currentBeat <= 6;
    const nextBeatNum = shouldAdvanceBeat
      ? currentThread.currentBeat + 1
      : currentThread.currentBeat;

    const isCalloutOrBreakupIntent =
      /\b(block|unmatch|cut\s+loose|bye|we.?re\s+done|lose\s+my\s+number|married|liar|sus|shady|red\s+flag|6:?45|table\s*9)\b/i.test(
        trimmed,
      );

    const historySnapshot = currentThread.messages
      .filter((m) => m.sender !== 'system')
      .map((m) => ({
        sender: (m.sender === 'player' ? 'player' : 'match') as 'player' | 'match',
        text: m.text,
      }));

    sfx.messagePop();
    setSendingAi(true);
    setFreeInput('');

    // Show the player's message right away + typing indicator!
    const withPlayerMsg: ActiveMatchThread = {
      ...currentThread,
      messages: [...currentThread.messages, { sender: 'player', text: trimmed }],
    };
    onUpdateThread(withPlayerMsg);
    if (!isTestEnv) {
      setDmTypingLabel(`${currentProfile.name} is typing`);
    }

    try {
      const minHumanBeat = isTestEnv
        ? Promise.resolve()
        : new Promise((resolve) => window.setTimeout(resolve, 560));

      const wildMeetContext =
        currentThread.originDoor === 'wild'
          ? getWildMeetCuteSeed(currentProfile.id, currentThread.originVenueId)?.aiMeetContext
          : undefined;

      const [res] = await Promise.all([
        liveAiInboxService.evaluateOpeningDm({
          personaId: currentProfile.id,
          personaName: currentProfile.name,
          personaAge: currentProfile.age,
          personaTitle: currentProfile.vitals.job,
          personaRole: currentProfile.role,
          playerRole: role,
          playerName: wallet.playerName || undefined,
          playerPersonaVibe: wallet.personaTag || undefined,
          personaOrigin:
            currentProfile.id === 'julian' || currentProfile.id === 'rory'
              ? 'Hampstead London UK'
              : currentProfile.vitals.neighborhood,
          personaLore: [
            currentProfile.tagline,
            currentProfile.trapTellSummary || currentProfile.vulnerabilityNote || '',
            wildMeetContext || '',
          ]
            .filter(Boolean)
            .join(' ')
            .trim(),
          platform: currentThread.stage === 'imessage' ? 'imessage' : 'tinder',
          playerMessage: trimmed,
          history: historySnapshot,
        }),
        minHumanBeat,
      ]);

      sfx.messagePop();
      const vibeChatBonus = activeVibeSpec?.chatSparkBonus ?? 0;
      const boostedDelta =
        res.chemistryDelta > 0
          ? res.chemistryDelta + (etiquetteBonusActive ? 4 : 0) + vibeChatBonus
          : res.chemistryDelta;
      setSparkToast({ delta: boostedDelta + (cost > 0 ? 6 : 0), nonce: Date.now() });

      if (isCalloutOrBreakupIntent || !res.passedVibeCheck) {
        setCalloutPromptLeadId(targetLeadId);
      }

      const refCandidate = latestThreadRef.current;
      const latest =
        refCandidate?.leadId === targetLeadId &&
        refCandidate.messages.length >= withPlayerMsg.messages.length
          ? refCandidate
          : withPlayerMsg;

      const fallbackAdapted: [string, string, string] = [
        `Haha fair point, now tell me one thing nobody guesses about you on first impression.`,
        `Wait, back up, explain that last part without dodging.`,
        `💎 Keep making me laugh like that and you might actually survive my vibe check.`,
      ];

      // Spontaneous AI reply + 3 freshly adapted suggestion buttons matching what they JUST said!
      onUpdateThread({
        ...latest,
        currentBeat: nextBeatNum,
        adaptiveSuggestions: res.suggestedReplies ?? fallbackAdapted,
        chemistry: Math.max(
          0,
          Math.min(100, latest.chemistry + boostedDelta + (cost > 0 ? 6 : 0)),
        ),
        messages: [...latest.messages, { sender: 'match', text: res.herReply }],
      });
    } finally {
      setDmTypingLabel(null);
      setSendingAi(false);
    }
  };

  const handleFreeTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendSpontaneousTurn(freeInput, 0);
  };

  const handleTriggerCutLoose = () => {
    if (!currentThread || !currentChapter) return;
    const verdict = currentChapter.cutLooseVerdict;
    if (verdict.isActualTrap) {
      sfx.victoryFanfare();
      onCutLooseTrap(currentThread.leadId, verdict.conspiracyClueId);
    } else {
      sfx.redFlag();
    }
    setCutLooseModal({ leadId: currentThread.leadId, verdict });
  };

  const canPlayConspiracy =
    wallet.conspiracyClues.length >= V35_TABLE_9_CONSPIRACY.requiredClueCount ||
    wallet.unlockedEpilogueIds.includes(V35_TABLE_9_CONSPIRACY.id);

  const beatsArray =
    currentThread && currentChapter
      ? currentThread.stage === 'imessage'
        ? currentChapter.imessage
        : currentChapter.tinder
      : [];
  const wildBeat1Seed =
    currentThread &&
    currentThread.originDoor === 'wild' &&
    currentThread.stage === 'imessage' &&
    currentThread.currentBeat === 1
      ? getWildMeetCuteSeed(currentThread.leadId, currentThread.originVenueId)
      : undefined;
  const activeBeat: ChatBeat | undefined =
    currentThread && currentThread.currentBeat <= 6
      ? wildBeat1Seed
        ? {
            beatNumber: 1,
            incomingMessages: wildBeat1Seed.incomingMessages,
            choices: wildBeat1Seed.choices,
          }
        : beatsArray.find((b) => b.beatNumber === currentThread.currentBeat)
      : undefined;

  const isReadyToGraduate =
    Boolean(currentThread) &&
    currentThread!.stage === 'app_dm' &&
    currentThread!.currentBeat > 6;

  const availableDates = currentThread ? (V35_DATE_SCRIPTS[currentThread.leadId] ?? []) : [];
  const nextDateScript = currentThread
    ? availableDates.find((d) => d.dateNumber === currentThread.datesCompleted + 1)
    : undefined;

  const isDateReady =
    Boolean(currentThread) &&
    Boolean(nextDateScript) &&
    currentThread!.stage === 'imessage' &&
    (currentThread!.currentBeat >= 4 || currentThread!.originDoor === 'wild');

  const launchDateWithGate = (leadId: string, scriptToLaunch: NonNullable<typeof nextDateScript>) => {
    if (scriptToLaunch.dateNumber === 4) {
      const epId = `${leadId}-epilogue-4`;
      const unlocked =
        wallet.isVip ||
        Boolean(wallet.isFounderUnlimited) ||
        wallet.unlockedEpilogueIds.includes(epId);
      if (!unlocked) {
        const ok = onUnlockBucketItem('unlockedEpilogueIds', epId, 3);
        if (!ok) return;
      }
    }
    if (!wallet.playerName && !wallet.personaTag && onSavePersona && !isTestEnv) {
      setQuickName('');
      setQuickVibe(PERSONA_VIBE_SPECS[0].id);
      setPendingDateAfterPersona({
        leadId,
        dateNumber: scriptToLaunch.dateNumber,
      });
      return;
    }
    setActiveDateModal({
      leadId,
      dateNumber: scriptToLaunch.dateNumber,
    });
  };

  const activeDiscord =
    V35_DISCORD_CHANNELS.find((c) => c.id === activeDiscordId) ?? V35_DISCORD_CHANNELS[0];

  const DISCORD_CHANNEL_RESPONDERS: Record<
    string,
    {
      id: string;
      name: string;
      badge: string;
      age: number;
      title: string;
      role: 'her' | 'him';
      secondName: string;
      secondBadge: string;
    }
  > = {
    'velvet-lounge': {
      id: 'jade-discord',
      name: 'Jade_42F',
      badge: '🐆 Sunset Hills Host',
      age: 42,
      title: 'Sunset Hills Host & Biotech Director',
      role: 'her',
      secondName: 'Sienna_Design',
      secondBadge: '🏡 Sunset Hills',
    },
    'red-flag-emergency': {
      id: 'priya',
      name: 'Priya_TraumaRN',
      badge: '🏥 Night Shift',
      age: 36,
      title: 'Charge Trauma RN & Red-Flag Triage Lead',
      role: 'her',
      secondName: 'Jade_42F',
      secondBadge: '🐆 Sunset Hills Host',
    },
    'ask-a-cougar': {
      id: 'elena',
      name: 'Prof_Elena',
      badge: '🎓 Literature Chair',
      age: 44,
      title: 'Department Chair & Author',
      role: 'her',
      secondName: 'Claire_M&A',
      secondBadge: '🍸 Deal Partner',
    },
    'spotted-in-the-wild': {
      id: 'sam-discord',
      name: 'Sam_27M',
      badge: '🏡 Cul-de-Sac Neighbor',
      age: 27,
      title: 'Structural Engineer & Sunset Hills Regular',
      role: 'him',
      secondName: 'Claire_M&A',
      secondBadge: '🍸 Deal Partner',
    },
    'blind-velvet-dm': {
      id: 'anon-cedar',
      name: 'Anon_Cedar_7',
      badge: '🎭 Mystery Regular',
      age: 39,
      title: 'Marlow Lounge Insider',
      role: 'her',
      secondName: 'Anon_Marlow_9',
      secondBadge: '🕵️ Insider',
    },
  };

  const handleDiscordPresetClick = (sug: string, sIdx: number) => {
    if (discordTypingLabel) return;
    const channelId = activeDiscord.id;
    const senderLabel = wallet.playerName || (role === 'her' ? 'You (Queen)' : 'You');
    const roleReplies = role === 'her' ? activeDiscord.repliesHer : activeDiscord.repliesHim;
    const reply =
      roleReplies?.[sIdx] ?? activeDiscord.botReplies[sIdx % activeDiscord.botReplies.length];
    const replySender = reply.split(':')[0].trim();
    const replyBody = reply.split(':').slice(1).join(':').trim();

    sfx.messagePop();
    if (activeDiscord.conspiracyClueId) {
      onRecordConspiracyClue?.(activeDiscord.conspiracyClueId);
    }

    setDiscordAskedPrompts((prev) => ({
      ...prev,
      [channelId]: [...new Set([...(prev[channelId] || []), sug])],
    }));

    if (isTestEnv) {
      setDiscordExtraMsgs((prev) => ({
        ...prev,
        [channelId]: [
          ...(prev[channelId] || []),
          { sender: senderLabel, badge: '✨ You', text: sug, isPlayer: true },
          { sender: replySender, badge: '💬 Lounge Regular', text: replyBody },
        ],
      }));
      return;
    }

    setDiscordExtraMsgs((prev) => ({
      ...prev,
      [channelId]: [
        ...(prev[channelId] || []),
        { sender: senderLabel, badge: '✨ You', text: sug, isPlayer: true },
      ],
    }));
    setDiscordTypingLabel(`${replySender} is typing`);

    const tid = window.setTimeout(() => {
      sfx.messagePop();
      setDiscordExtraMsgs((prev) => ({
        ...prev,
        [channelId]: [
          ...(prev[channelId] || []),
          { sender: replySender, badge: '💬 Lounge Regular', text: replyBody },
        ],
      }));
      setDiscordTypingLabel(null);
    }, 640);
    pendingTimersRef.current.push(tid);
  };

  const handleDiscordFreeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = discordFreeInput.trim();
    if (!trimmed || sendingDiscordAi || discordTypingLabel) return;

    const channelId = activeDiscord.id;
    const responder =
      DISCORD_CHANNEL_RESPONDERS[channelId] ?? DISCORD_CHANNEL_RESPONDERS['ask-a-cougar'];
    const senderLabel = wallet.playerName || (role === 'her' ? 'You (Queen)' : 'You');

    sfx.messagePop();
    if (activeDiscord.conspiracyClueId) {
      onRecordConspiracyClue?.(activeDiscord.conspiracyClueId);
    }

    const recentMsgs = [
      ...activeDiscord.seededMessages,
      ...(discordExtraMsgs[channelId] || []),
    ].slice(-6);

    setSendingDiscordAi(true);
    setDiscordFreeInput('');
    setDiscordExtraMsgs((prev) => ({
      ...prev,
      [channelId]: [
        ...(prev[channelId] || []),
        {
          sender: senderLabel,
          badge: '✨ You',
          text: trimmed,
          isPlayer: true,
        },
      ],
    }));
    if (!isTestEnv) {
      setDiscordTypingLabel(`${responder.name} is typing`);
    }

    try {
      const minBeat = isTestEnv
        ? Promise.resolve()
        : new Promise((resolve) => window.setTimeout(resolve, 580));

      const [res] = await Promise.all([
        liveAiInboxService.evaluateOpeningDm({
          personaId: responder.id,
          personaName: responder.name,
          personaAge: responder.age,
          personaTitle: `${responder.title} in ${activeDiscord.handleLabel}`,
          personaRole: responder.role,
          playerRole: role,
          channelId,
          secondSpeakerName: responder.secondName,
          platform: 'discord',
          playerMessage: trimmed,
          history: recentMsgs.map((m) => ({
            sender: m.sender === senderLabel ? ('player' as const) : ('match' as const),
            text: `${m.sender}: ${m.text}`,
          })),
        }),
        minBeat,
      ]);

      const cleanReply = res.herReply.replace(/^[A-Za-z0-9_&]+:\s*/, '').trim();
      const cleanSecond = res.secondReply?.replace(/^[A-Za-z0-9_&]+:\s*/, '').trim();

      sfx.messagePop();
      setDiscordExtraMsgs((prev) => ({
        ...prev,
        [channelId]: [
          ...(prev[channelId] || []),
          {
            sender: responder.name,
            badge: responder.badge,
            text: cleanReply || res.herReply,
          },
          ...(isTestEnv && cleanSecond
            ? [
                {
                  sender: responder.secondName,
                  badge: responder.secondBadge,
                  text: cleanSecond,
                },
              ]
            : []),
        ],
      }));

      if (!isTestEnv && cleanSecond) {
        setDiscordTypingLabel(`${responder.secondName} is typing`);
        const tSecond = window.setTimeout(() => {
          sfx.messagePop();
          setDiscordExtraMsgs((prev) => ({
            ...prev,
            [channelId]: [
              ...(prev[channelId] || []),
              {
                sender: responder.secondName,
                badge: responder.secondBadge,
                text: cleanSecond,
              },
            ],
          }));
          setDiscordTypingLabel(null);
        }, 780);
        pendingTimersRef.current.push(tSecond);
      } else {
        setDiscordTypingLabel(null);
      }
    } catch {
      setDiscordTypingLabel(null);
    } finally {
      setSendingDiscordAi(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 animate-stage-in">
      {/* Secret Table 9 Conspiracy Banner when Clues Collected */}
      {canPlayConspiracy && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-950 px-5 py-4 text-white shadow-md">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-amber-300">
              🕵️ 3 Conspiracy Clues Assembled
            </div>
            <div className="text-base sm:text-lg font-semibold">
              Secret Finale Ready: Table 9 / 6:45 Alibi Club Takedown
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSurface('conspiracy')}
            className="inline-flex h-9 items-center rounded-lg bg-rose-600 hover:bg-rose-500 px-4 text-xs sm:text-sm font-semibold text-white cursor-pointer"
          >
            🕵️ Launch Table 9 / 6:45 Alibi Club Takedown
          </button>
        </div>
      )}

      {/* Top Mode Switcher: shadcn Segmented Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
        <div className="inline-flex rounded-lg bg-zinc-100 p-1">
          <button
            type="button"
            onClick={() => setSurface('dm')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              surface === 'dm' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <MessageCircle className="h-4 w-4 text-zinc-500" />
            <span>Matches &amp; Dates ({visibleThreads.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSurface('discord')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              surface === 'discord' ? 'bg-white text-zinc-950 shadow-2xs' : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Hash className="h-4 w-4 text-zinc-500" />
            <span>Club Discord Lounge (5 Channels)</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-600">
          {activeVibeSpec && (
            <span
              data-testid="active-vibe-perk-badge"
              className="rounded-md bg-rose-50 border border-rose-200 px-2.5 py-1 font-semibold text-rose-800"
            >
              {activeVibeSpec.emoji}{' '}
              {wallet.playerName ? `${wallet.playerName} (${activeVibeSpec.id})` : activeVibeSpec.id}
            </span>
          )}
          <span className="rounded-md bg-zinc-100 px-2.5 py-1">
            Table 9 Clues: <strong>{wallet.conspiracyClues.length}/3</strong>
          </span>
          <span className="rounded-md bg-zinc-100 px-2.5 py-1">
            XP: <strong>{wallet.discernmentXp}</strong>
          </span>
        </div>
      </div>

      {/* Optional First Name & Vibe Card (Clean Two-Row Layout, Zero Cut-Off Inputs or Math Soup) */}
      {surface === 'dm' &&
        visibleThreads.length > 0 &&
        !wallet.playerName &&
        !wallet.personaTag &&
        !dismissedPersonaCard &&
        onSavePersona && (
          <form
            data-testid="inline-persona-onboarding"
            onSubmit={(e) => {
              e.preventDefault();
              sfx.greenFlag();
              onSavePersona(
                quickName.trim() || (role === 'her' ? 'Vivian' : 'Alex'),
                quickVibe,
              );
            }}
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 sm:px-5 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs sm:text-sm font-medium text-zinc-700">
                <strong className="font-semibold text-zinc-950">Optional check-in:</strong>{' '}
                Add a first name and pick your Friday vibe so dates greet you naturally.
              </div>
              <button
                type="button"
                aria-label="Skip persona card"
                onClick={() => setDismissedPersonaCard(true)}
                className="shrink-0 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <input
                type="text"
                maxLength={28}
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                aria-label="Quick first name"
                placeholder="Your first name (optional)"
                className="h-10 w-full sm:w-72 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-950 focus:border-zinc-950 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-zinc-950 hover:bg-rose-600 px-4 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Save Name &amp; Vibe
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {PERSONA_VIBE_SPECS.map((spec) => {
                const selected = quickVibe === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => setQuickVibe(spec.id)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                      selected
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {spec.emoji} {spec.id}
                  </button>
                );
              })}
            </div>
          </form>
        )}

      {surface === 'conspiracy' ? (
        <section className="overflow-hidden rounded-2xl bg-zinc-950 text-white shadow-xl border border-zinc-800">
          <div className="relative h-64 w-full">
            <img
              src={V35_TABLE_9_CONSPIRACY.backdropUrl}
              alt={V35_TABLE_9_CONSPIRACY.title}
              className="h-full w-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
            <div className="absolute left-6 bottom-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {V35_TABLE_9_CONSPIRACY.title}
              </h2>
            </div>
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <p className="text-base sm:text-lg leading-relaxed text-zinc-100">
              {V35_TABLE_9_CONSPIRACY.beats[0].dialogue}
            </p>
            {conspiracyOutcome ? (
              <div className="rounded-2xl bg-emerald-950/80 border border-emerald-400/50 p-5 space-y-4">
                <p className="text-base font-semibold text-emerald-100 leading-relaxed">{conspiracyOutcome}</p>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSurface('dm')}
                    className="rounded-full bg-amber-300 hover:bg-amber-200 px-5 py-2.5 text-sm font-bold text-zinc-950 cursor-pointer"
                  >
                    Return to Matches
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const text =
                        '🕵️‍♀️ Cracked the Secret Table 9 / 6:45 Alibi Club Takedown in Sunset Hills on Cougars & Cubs Club!';
                      const url = 'https://cougarsandcubs.club';
                      shareOrCopy({
                        title: 'Table 9 Takedown Unlocked',
                        text,
                        url,
                      });
                      setSharePayload({
                        title: 'Secret Table 9 Takedown Unlocked',
                        message: text,
                        url,
                        shareSurface: 'verdict_receipt',
                      });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 px-4 py-2.5 text-sm font-semibold text-white cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share Takedown Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConspiracyOutcome(null)}
                    className="rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium text-emerald-100 hover:bg-white/10 cursor-pointer"
                  >
                    Try Another Takedown Move
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                {V35_TABLE_9_CONSPIRACY.beats[0].choices.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => {
                      sfx.victoryFanfare();
                      setConspiracyOutcome(c.response);
                    }}
                    className="w-full rounded-2xl border border-amber-300/40 bg-white/10 p-4 text-left text-sm font-semibold text-white whitespace-normal hover:bg-white/20 cursor-pointer"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : surface === 'discord' ? (
        <div className="overflow-hidden rounded-2xl border border-[#1E1F22] bg-[#313338] text-[#DBDEE1] shadow-xl grid grid-cols-1 lg:grid-cols-[248px_1fr]">
          {/* Authentic Dark Discord Channel Sidebar */}
          <aside className="bg-[#2B2D31] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1F2023]">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-[#1F2023] px-4 py-3.5">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <span>🐆</span>
                  <span>Cougars &amp; Cubs Server</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>48 Online</span>
                </span>
              </div>

              <div className="p-2.5 space-y-1">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#949BA4]">
                  Text Channels
                </div>
                {V35_DISCORD_CHANNELS.map((ch) => {
                  const isActive = activeDiscord.id === ch.id;
                  const bareName = ch.handleLabel.replace(/^#/, '');
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      aria-label={ch.handleLabel}
                      onClick={() => setActiveDiscordId(ch.id)}
                      className={`w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium transition cursor-pointer ${
                        isActive
                          ? 'bg-[#404249] text-white font-semibold'
                          : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                      }`}
                    >
                      <Hash className="h-4 w-4 shrink-0 text-[#80848E]" />
                      <span className="sr-only">#</span>
                      <span>{bareName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 border-t border-[#1F2023] bg-[#232428] space-y-2">
              <div className="text-[11px] font-medium text-[#B5BAC1] leading-snug">
                Want to join our vetted real-life community Discord &amp; city mixers?
              </div>
              <button
                type="button"
                onClick={() => onOpenBoutique('rewards')}
                className="w-full rounded-lg bg-[#5865F2] hover:bg-[#4752C4] px-3 py-2 text-xs font-bold text-white transition cursor-pointer"
              >
                🥂 Real Matchmaking &amp; Discord →
              </button>
            </div>
          </aside>

          {/* Authentic Dark Discord Main Channel View */}
          <section className="flex flex-col bg-[#313338]">
            <header className="flex flex-wrap items-center gap-2.5 border-b border-[#26272D] bg-[#313338] px-5 py-3 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-base text-white">
                <Hash className="h-5 w-5 text-[#80848E]" />
                <span>{activeDiscord.handleLabel.replace(/^#/, '')}</span>
              </div>
              <span className="hidden sm:inline text-[#4E5058]">|</span>
              <p className="text-xs text-[#B5BAC1]">{activeDiscord.topicSubtitle}</p>
            </header>

            <div
              ref={discordFeedRef}
              data-testid="discord-message-feed"
              className="min-h-[380px] sm:min-h-[430px] max-h-[540px] overflow-y-auto scroll-smooth bg-[#313338] px-4 sm:px-6 py-4 space-y-3"
            >
              {[
                ...activeDiscord.seededMessages.map((m) => ({ ...m, isPlayer: false })),
                ...(discordExtraMsgs[activeDiscord.id] || []),
              ].map((msg, idx) => {
                const reactionKey = `${activeDiscord.id}-${idx}`;
                const pickedEmojis = discordReactions[reactionKey] || [];
                const isPlayerPost = Boolean(msg.isPlayer);
                const avatarColors = [
                  'bg-[#EB459E]',
                  'bg-[#5865F2]',
                  'bg-[#3BA55C]',
                  'bg-[#FAA61A] text-zinc-950',
                  'bg-[#ED4245]',
                ];
                const nameColors = [
                  'text-[#F47FFF]',
                  'text-[#57F287]',
                  'text-[#FEE75C]',
                  'text-[#70A5FD]',
                  'text-[#FF7A90]',
                ];
                const colorIdx = Math.abs(msg.sender.charCodeAt(0) + idx) % avatarColors.length;
                const initial = msg.sender.replace(/[^A-Za-z]/g, '').slice(0, 1).toUpperCase() || 'C';
                const timeMinute = String((12 + idx * 4) % 60).padStart(2, '0');

                return (
                  <div
                    key={`${msg.sender}-${idx}`}
                    data-testid={idx === 0 ? 'discord-first-message' : undefined}
                    className={`group flex items-start gap-3.5 rounded-lg px-2.5 py-2 transition ${
                      isPlayerPost ? 'bg-[#5865F2]/12' : 'hover:bg-[#2E3035]'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white select-none ${
                        isPlayerPost ? 'bg-[#5865F2]' : avatarColors[colorIdx]
                      }`}
                    >
                      {initial}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isPlayerPost ? 'text-[#949CF7]' : nameColors[colorIdx]
                          }`}
                        >
                          {msg.sender}
                        </span>
                        <span className="rounded bg-[#2B2D31] border border-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#DBDEE1]">
                          {msg.badge}
                        </span>
                        <span className="text-[11px] text-[#949BA4]">
                          Today at 8:{timeMinute} PM
                        </span>
                      </div>

                      <p className="text-[15px] text-[#DBDEE1] leading-relaxed">{msg.text}</p>

                      {!isPlayerPost && (
                        <div className="pt-1 flex items-center gap-1.5">
                          {(['🥂', '🔥', '👑'] as const).map((emo) => {
                            const active = pickedEmojis.includes(emo);
                            return (
                              <button
                                key={emo}
                                type="button"
                                aria-label={`React ${emo} to ${msg.sender}`}
                                onClick={() => {
                                  sfx.messagePop();
                                  setDiscordReactions((prev) => {
                                    const cur = prev[reactionKey] || [];
                                    return {
                                      ...prev,
                                      [reactionKey]: active
                                        ? cur.filter((x) => x !== emo)
                                        : [...cur, emo],
                                    };
                                  });
                                }}
                                className={`rounded-md border px-2 py-0.5 text-xs transition cursor-pointer ${
                                  active
                                    ? 'border-[#5865F2] bg-[#3C4270] font-bold text-white'
                                    : 'border-white/10 bg-[#2B2D31] text-[#B5BAC1] hover:bg-[#383A40] hover:text-white'
                                }`}
                              >
                                {emo}
                                {active ? ' 1' : ''}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {discordTypingLabel && (
                <div
                  data-testid="discord-typing-indicator"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#B5BAC1]"
                >
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#DBDEE1] animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#DBDEE1] animate-bounce [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#DBDEE1] animate-bounce [animation-delay:240ms]" />
                  </span>
                  <span>{discordTypingLabel}…</span>
                </div>
              )}
            </div>

            {/* Authentic Discord Dark Composer + Quick Prompt Starters */}
            <div className="bg-[#313338] px-4 sm:px-5 pb-5 pt-2 space-y-3 border-t border-[#26272D]">
              <form
                onSubmit={handleDiscordFreeSubmit}
                className="flex items-center gap-2 rounded-lg bg-[#383A40] px-3 py-1.5"
                data-testid="discord-open-form"
              >
                <input
                  type="text"
                  value={discordFreeInput}
                  onChange={(e) => setDiscordFreeInput(e.target.value)}
                  disabled={sendingDiscordAi}
                  aria-label={`Message ${activeDiscord.handleLabel}`}
                  placeholder={`Message ${activeDiscord.handleLabel}...`}
                  className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-[#80848E] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!discordFreeInput.trim() || sendingDiscordAi || Boolean(discordTypingLabel)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-45 px-3.5 py-1.5 text-xs font-bold text-white transition cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{sendingDiscordAi || discordTypingLabel ? 'Replying…' : 'Post'}</span>
                </button>
              </form>

              <div className="grid gap-1.5">
                {(role === 'her'
                  ? activeDiscord.suggestionsHer
                  : activeDiscord.suggestionsHim
                ).map((sug, sIdx) => {
                  const alreadyAsked = (discordAskedPrompts[activeDiscord.id] || []).includes(sug);
                  return (
                    <button
                      key={sug}
                      type="button"
                      disabled={Boolean(discordTypingLabel)}
                      onClick={() => handleDiscordPresetClick(sug, sIdx)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-xs sm:text-sm font-medium whitespace-normal transition cursor-pointer ${
                        alreadyAsked
                          ? 'border-white/5 bg-[#2B2D31]/50 text-[#80848E]'
                          : 'border-white/10 bg-[#2B2D31] text-[#DBDEE1] hover:border-[#5865F2] hover:bg-[#35373C]'
                      }`}
                    >
                      {alreadyAsked ? `✓ ${sug}` : `💬 ${sug}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      ) : visibleThreads.length === 0 ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-4 shadow-2xs">
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-950">
            Your Inbox Is Open
          </h2>
          <p className="text-sm text-zinc-600 max-w-md mx-auto">
            Match on Prowl or pull a number out In The Wild to start chatting.
          </p>
          <button
            type="button"
            onClick={onOpenHinge}
            className="inline-flex h-10 items-center rounded-lg bg-zinc-900 hover:bg-zinc-800 px-5 text-sm font-semibold text-white cursor-pointer"
          >
            Browse Prowl Profiles →
          </button>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[265px_1fr] gap-5 items-start">
          {/* Responsive Match Roster: Compact Horizontal Strip on Mobile, Sidebar on Desktop */}
          <aside className="rounded-2xl border border-zinc-200 bg-white p-3 lg:p-4 space-y-2 shadow-2xs">
            <div className="px-2 py-0.5 text-xs font-semibold text-zinc-500">
              Connections ({visibleThreads.length})
            </div>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
              {visibleThreads.map((thread) => {
                const p = getCastProfileById(thread.leadId);
                const vis = V35_CAST_VISUALS[thread.leadId];
                if (!p || !vis) return null;
                const isSelected = currentThread?.leadId === thread.leadId;

                return (
                  <button
                    key={thread.leadId}
                    type="button"
                    data-testid={`thread-select-${thread.leadId}`}
                    onClick={() => {
                      setShowArchivedHinge(false);
                      setActiveLeadId(thread.leadId);
                      onSelectLead?.(thread.leadId);
                    }}
                    className={`flex shrink-0 w-56 lg:w-full items-center gap-3 rounded-2xl p-2.5 lg:p-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-950 text-white shadow-sm'
                        : 'bg-zinc-50/90 text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    <img
                      src={vis.primaryPortrait}
                      alt={p.name}
                      className="h-11 w-11 lg:h-12 lg:w-12 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-sm">
                          {p.name}, {p.age}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            thread.stage === 'imessage'
                              ? 'bg-blue-500 text-white'
                              : isSelected
                                ? 'bg-white/15 text-rose-200'
                                : 'bg-rose-100 text-rose-900'
                          }`}
                        >
                          {thread.stage === 'imessage' ? 'iMessage' : 'Prowl DM'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <span
                          data-testid={`lead-date-hearts-${thread.leadId}`}
                          className={`font-bold tracking-tight ${
                            isSelected ? 'text-rose-300' : 'text-rose-600'
                          }`}
                        >
                          {'♥'.repeat(Math.min(3, thread.datesCompleted)) +
                            '♡'.repeat(Math.max(0, 3 - Math.min(3, thread.datesCompleted)))}
                          {thread.lastDateRank === 'S'
                            ? ' ★'
                            : ''}
                        </span>
                        <span className={isSelected ? 'text-amber-200' : 'text-zinc-400'}>
                          {thread.chemistry}% Spark
                        </span>
                      </div>
                      <p
                        className={`hidden lg:block text-xs line-clamp-1 ${
                          isSelected ? 'text-zinc-300' : 'text-zinc-500'
                        }`}
                      >
                        {thread.messages[thread.messages.length - 1]?.text}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Keyed Single Thread Stage (Zero Mobile Superimposition Between Prowl DM & iMessage) */}
          {currentThread && currentProfile && currentChapter && (
            <section
              key={`${currentThread.leadId}-${currentThread.stage}`}
              data-testid={`chat-stage-${currentThread.stage}`}
              className={`rounded-3xl overflow-hidden border shadow-xs ${
                currentThread.stage === 'imessage'
                  ? 'border-sky-200 bg-[#F8FAFC]'
                  : 'editorial-hinge-card border-zinc-200 bg-white'
              }`}
            >
              {/* Distinct Header: Apple iOS Contact Bar in iMessage vs Prowl App DM Header */}
              {currentThread.stage === 'imessage' ? (
                <header className="border-b border-slate-200/90 bg-gradient-to-b from-[#F1F5F9] to-[#F8FAFC] px-5 sm:px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={V35_CAST_VISUALS[currentProfile.id].primaryPortrait}
                          alt={currentProfile.name}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-[#007AFF] shadow-xs"
                        />
                        <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#007AFF] text-[10px] font-bold text-white">
                          ✓
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold tracking-tight text-slate-950">
                            {currentProfile.name}, {currentProfile.age}
                          </h2>
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#007AFF]">
                            <Smartphone className="h-3.5 w-3.5" />
                            <span>Earned iMessage</span>
                          </span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                            {currentThread.chemistry}% Spark
                          </span>
                          {sparkToast && (
                            <span
                              key={sparkToast.nonce}
                              className={`text-xs font-bold ${
                                sparkToast.delta >= 0 ? 'text-emerald-700' : 'text-rose-600'
                              }`}
                            >
                              {sparkToast.delta >= 0
                                ? `+${sparkToast.delta}% Spark ✨`
                                : `${sparkToast.delta}% Vibe`}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                          {currentThread.originDoor === 'wild'
                            ? getWildMeetCuteSeed(
                                currentThread.leadId,
                                currentThread.originVenueId,
                              )?.venueLabel ?? 'Met Out In The Wild'
                            : 'Personal Number Unlocked'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {etiquetteBonusActive ? (
                        <span
                          data-testid="etiquette-perk-pill"
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700"
                        >
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>+8% Spark Perk</span>
                        </span>
                      ) : onOpenCubSchool ? (
                        <button
                          type="button"
                          onClick={onOpenCubSchool}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                        >
                          <GraduationCap className="h-3.5 w-3.5 text-zinc-500" />
                          <span>Cub School (+8% Spark)</span>
                        </button>
                      ) : null}

                      <span
                        aria-hidden="true"
                        className="hidden sm:inline-flex items-center gap-1.5 text-[#007AFF] px-1"
                        title="iOS Audio & FaceTime Connected"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <Video className="h-3.5 w-3.5" />
                      </span>

                      <button
                        type="button"
                        onClick={() => setSpicyMode((s) => !s)}
                        className={`inline-flex h-8 items-center gap-1 rounded-lg px-3 text-xs font-semibold transition cursor-pointer ${
                          spicyMode
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                        }`}
                      >
                        <Flame className="h-3.5 w-3.5 text-rose-500" />
                        <span>After-Dark Mode</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTriggerCutLoose}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 hover:border-rose-200 hover:text-rose-700 cursor-pointer"
                      >
                        <Ban className="h-3.5 w-3.5 text-rose-600" />
                        <span>Block / Cut Loose</span>
                      </button>
                    </div>
                  </div>
                </header>
              ) : (
                <header className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-zinc-200 bg-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={V35_CAST_VISUALS[currentProfile.id].primaryPortrait}
                      alt={currentProfile.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold tracking-tight text-zinc-950">
                          {currentProfile.name}, {currentProfile.age}
                        </h2>
                        <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-800">
                          Prowl App DM
                        </span>
                        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                          {currentThread.chemistry}% Spark
                        </span>
                        {sparkToast && (
                          <span
                            key={sparkToast.nonce}
                            className={`text-xs font-bold ${
                              sparkToast.delta >= 0 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {sparkToast.delta >= 0
                              ? `+${sparkToast.delta}% Spark ✨`
                              : `${sparkToast.delta}% Vibe`}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">
                        {role === 'her'
                          ? 'Vet his vibe here on Prowl, or block him anytime if red flags show up.'
                          : 'Build genuine spark across 6 beats to earn her personal iMessage.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {etiquetteBonusActive ? (
                      <span
                        data-testid="etiquette-perk-pill"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700"
                      >
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>+8% Spark Perk</span>
                      </span>
                    ) : onOpenCubSchool ? (
                      <button
                        type="button"
                        onClick={onOpenCubSchool}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                      >
                        <GraduationCap className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Cub School (+8% Spark)</span>
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={handleTriggerCutLoose}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 hover:border-rose-200 hover:text-rose-700 cursor-pointer"
                    >
                      <Flag className="h-3.5 w-3.5 text-rose-600" />
                      <span>Block / Cut Loose</span>
                    </button>

                    {(isReadyToGraduate || currentThread.chemistry >= 75) && (
                      <button
                        type="button"
                        onClick={handleGraduateToImessage}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#007AFF] hover:bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-2xs transition cursor-pointer"
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>Move to iMessage</span>
                      </button>
                    )}
                  </div>
                </header>
              )}

              {/* Non-Blocking Go On Date Banner */}
              {isDateReady && nextDateScript && (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50 border-b border-emerald-200 px-6 py-3">
                  <div className="text-xs sm:text-sm font-bold text-emerald-950">
                    🍸 Chemistry is high ({currentThread.chemistry}%). Ready for{' '}
                    {nextDateScript.dateNumber === 4
                      ? 'Weekend Escape Epilogue'
                      : `Date #${nextDateScript.dateNumber}`}{' '}
                    with {currentProfile.name}!
                  </div>
                  <button
                    type="button"
                    onClick={() => launchDateWithGate(currentProfile.id, nextDateScript)}
                    className="inline-flex h-9 items-center rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 text-xs font-semibold text-white cursor-pointer"
                  >
                    {nextDateScript.dateNumber === 4
                      ? '🌙 Launch Weekend Escape Epilogue →'
                      : `🍸 Go on Date #${nextDateScript.dateNumber} →`}
                  </button>
                </div>
              )}

              {/* Message Stream (Single Exclusive Thread View: Zero Mobile Superimposition) */}
              <div
                ref={dmFeedRef}
                data-testid="dm-message-feed"
                className="min-h-[380px] sm:min-h-[460px] max-h-[600px] overflow-y-auto scroll-smooth bg-white px-5 py-7 sm:px-10 sm:py-9"
              >
                <div className="mx-auto w-full max-w-2xl space-y-6">
                {currentThread.stage === 'imessage' &&
                  currentThread.archivedAppMessages &&
                  currentThread.archivedAppMessages.length > 0 && (
                    <div className="flex items-center justify-center pb-2 border-b border-slate-100">
                      <div className="inline-flex rounded-xl bg-slate-100 p-1">
                        <button
                          type="button"
                          onClick={() => setShowArchivedHinge(false)}
                          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                            !showArchivedHinge
                              ? 'bg-white text-slate-950 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-950'
                          }`}
                        >
                          📱 Current iMessage
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowArchivedHinge((v) => !v)}
                          className={`inline-flex items-center gap-1 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                            showArchivedHinge
                              ? 'bg-white text-slate-950 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-950'
                          }`}
                        >
                          <span>
                            Earlier Prowl App Messages (
                            {
                              currentThread.archivedAppMessages.filter((m) => m.sender !== 'system')
                                .length
                            }
                            )
                          </span>
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform ${
                              showArchivedHinge ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                {showArchivedHinge &&
                currentThread.stage === 'imessage' &&
                currentThread.archivedAppMessages ? (
                  <div className="space-y-4">
                    <div className="text-center text-xs font-semibold text-zinc-400">
                      Archived Prowl App Conversation
                    </div>
                    {currentThread.archivedAppMessages
                      .filter((m) => m.sender !== 'system')
                      .map((am, aIdx) => {
                        const isPlayerArch = am.sender === 'player';
                        return (
                          <div
                            key={`arch-${aIdx}`}
                            className={`flex ${isPlayerArch ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                                isPlayerArch
                                  ? 'rounded-br-sm bg-zinc-900 text-white'
                                  : 'rounded-bl-sm bg-zinc-100 text-zinc-900 border border-zinc-200/70'
                              }`}
                            >
                              {am.text}
                            </div>
                          </div>
                        );
                      })}
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => setShowArchivedHinge(false)}
                        className="rounded-full bg-[#007AFF] px-4 py-2 text-xs font-bold text-white cursor-pointer"
                      >
                        Back to Current iMessage →
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                {currentThread.messages.map((m, idx) => {
                  if (m.sender === 'system') {
                    return (
                      <div
                        key={`sys-${idx}`}
                        className="mx-auto max-w-md py-1.5 text-center text-xs font-medium tracking-wide text-slate-400"
                      >
                        {m.text}
                      </div>
                    );
                  }
                  const isPlayer = m.sender === 'player';
                  const msgKey = `${currentThread.leadId}-${currentThread.stage}-${idx}`;
                  const activeTapback = dmReactions[msgKey];
                  const isLastPlayerBubble =
                    isPlayer &&
                    currentThread.stage === 'imessage' &&
                    idx ===
                      currentThread.messages.reduce(
                        (last, item, i) => (item.sender === 'player' ? i : last),
                        -1,
                      );

                  return (
                    <div
                      key={`msg-${idx}`}
                      className={`group flex flex-col ${isPlayer ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`flex items-end gap-3 max-w-[88%] sm:max-w-[74%] ${
                          isPlayer ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {!isPlayer && (
                          <img
                            src={V35_CAST_VISUALS[currentProfile.id].primaryPortrait}
                            alt={currentProfile.name}
                            className="h-8 w-8 rounded-full object-cover shrink-0 shadow-2xs border border-zinc-200/80 mb-0.5"
                          />
                        )}
                        <div className="relative">
                          <div
                            className={`px-5 py-3.5 text-[15px] sm:text-base leading-relaxed ${
                              isPlayer
                                ? currentThread.stage === 'imessage'
                                  ? 'rounded-3xl rounded-br-sm bg-[#007AFF] text-white shadow-2xs'
                                  : 'rounded-3xl rounded-br-sm bg-zinc-900 text-white shadow-2xs'
                                : currentThread.stage === 'imessage'
                                  ? 'rounded-3xl rounded-bl-sm bg-[#F1F3F5] text-slate-950'
                                  : 'rounded-3xl rounded-bl-sm bg-zinc-100/90 text-zinc-900 border border-zinc-200/70'
                            }`}
                          >
                            {m.text}
                          </div>
                          {activeTapback && (
                            <span className="absolute -top-2.5 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-zinc-200 text-xs shadow-xs">
                              {activeTapback}
                            </span>
                          )}
                        </div>
                      </div>

                      {isLastPlayerBubble && (
                        <span className="mt-1 pr-2 text-[11px] font-medium text-slate-400">
                          Delivered
                        </span>
                      )}

                      {!isPlayer && (
                        <div className="mt-1.5 pl-11 flex items-center gap-1 opacity-45 group-hover:opacity-100 transition">
                          {(['❤️', '🔥', '😂', '🚩'] as const).map((emo) => (
                            <button
                              key={emo}
                              type="button"
                              aria-label={`Tapback ${emo}`}
                              onClick={() => {
                                sfx.messagePop();
                                setDmReactions((prev) => ({
                                  ...prev,
                                  [msgKey]: prev[msgKey] === emo ? '' : emo,
                                }));
                                if (emo === '🚩') {
                                  setCalloutPromptLeadId(currentThread.leadId);
                                }
                              }}
                              className={`rounded-full px-1.5 py-0.5 text-xs transition cursor-pointer ${
                                activeTapback === emo
                                  ? 'bg-rose-50 ring-1 ring-rose-300 opacity-100'
                                  : 'hover:bg-zinc-100'
                              }`}
                            >
                              {emo}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {dmTypingLabel && (
                  <div
                    data-testid="dm-typing-indicator"
                    className="flex items-end gap-3 justify-start"
                  >
                    <img
                      src={V35_CAST_VISUALS[currentProfile.id].primaryPortrait}
                      alt={currentProfile.name}
                      className="h-8 w-8 rounded-full object-cover shrink-0 shadow-2xs border border-zinc-200/80"
                    />
                    <div
                      className={`inline-flex items-center gap-2 rounded-3xl px-5 py-3 text-sm font-medium ${
                        currentThread.stage === 'imessage'
                          ? 'bg-[#F1F3F5] text-slate-600'
                          : 'bg-zinc-100 border border-zinc-200 text-zinc-600'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" />
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:240ms]" />
                      </span>
                      <span>{dmTypingLabel}…</span>
                    </div>
                  </div>
                )}

                {/* Clean Native Photo Bubble From Match (Zero Ugly Wrapper Box or "Included Free" Pill) */}
                {activeBeat?.photoDrop && (
                  <div
                    data-testid="chat-photo-drop-card"
                    className="flex items-end gap-3 max-w-[90%] sm:max-w-[74%]"
                  >
                    <img
                      src={V35_CAST_VISUALS[currentProfile.id].primaryPortrait}
                      alt={currentProfile.name}
                      className="h-8 w-8 rounded-full object-cover shrink-0 shadow-2xs border border-zinc-200/80 mb-1"
                    />
                    <div className="space-y-2">
                      <img
                        src={activeBeat.photoDrop.imageUrl}
                        alt={`Photo from ${currentProfile.name}`}
                        className="h-72 w-64 sm:w-72 rounded-2xl object-cover object-top shadow-xs border border-zinc-200/80"
                      />
                      <div
                        className={`px-4 py-3 text-[15px] leading-relaxed max-w-sm ${
                          currentThread.stage === 'imessage'
                            ? 'rounded-2xl rounded-bl-sm bg-[#F1F3F5] text-slate-950'
                            : 'rounded-2xl rounded-bl-sm bg-zinc-100/90 text-zinc-900 border border-zinc-200/70'
                        }`}
                      >
                        {activeBeat.photoDrop.secretNote.replace(/^[“"]|[”"]$/g, '')}
                      </div>

                      <div className="pt-0.5">
                        {!inspectedExifIds.includes(activeBeat.photoDrop.id) ? (
                          <button
                            type="button"
                            aria-label="Inspect Photo Metadata"
                            onClick={() => {
                              sfx.messagePop();
                              setInspectedExifIds((prev) => [
                                ...prev,
                                activeBeat.photoDrop!.id,
                              ]);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition cursor-pointer"
                          >
                            <Search className="h-3 w-3" />
                            <span>Check photo details</span>
                          </button>
                        ) : (
                          <div
                            data-testid="photo-exif-clue"
                            className="max-w-sm rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-950 leading-snug"
                          >
                            {activeBeat.photoDrop.exifClue}
                          </div>
                        )}
                      </div>

                      {currentChapter.cutLooseVerdict.isActualTrap && (
                        <button
                          type="button"
                          onClick={handleTriggerCutLoose}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 px-3.5 py-2 text-xs font-bold text-white transition cursor-pointer"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          <span>Block Number &amp; Claim +25 XP</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Inline Comedy Dating-Sim Block / Red-Flag Decision Card */}
                {(calloutPromptLeadId === currentThread.leadId || Boolean(activeBeat?.trapClueHint)) && (
                  <div
                    data-testid="inline-block-action-card"
                    className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3"
                  >
                    <div className="text-xs font-semibold text-rose-950">
                      {activeBeat?.trapClueHint
                        ? `🕵️ ${activeBeat.trapClueHint}`
                        : `🚨 Feeling shady vibes from ${currentProfile.name}? You can block their number right now or keep grilling them.`}
                    </div>
                    <button
                      type="button"
                      onClick={handleTriggerCutLoose}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition cursor-pointer"
                    >
                      <Ban className="h-3.5 w-3.5" />
                      <span>Block Number Now</span>
                    </button>
                  </div>
                )}
                  </>
                )}
                </div>
              </div>

              {/* Spontaneous Adaptive Replies + Optional Non-Blocking iMessage Swap */}
              <div className="border-t border-zinc-200 bg-zinc-50/80 px-5 py-6 sm:px-10 sm:py-7">
                <div className="mx-auto w-full max-w-2xl space-y-4">
                {isReadyToGraduate && !snoozedImessageIds.includes(currentThread.leadId) && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 px-4 py-3.5">
                    <div className="text-xs sm:text-sm font-semibold text-blue-950">
                      {role === 'her'
                        ? `📱 Chemistry is high: share your number for iMessage, or stay on Prowl.`
                        : `📱 Chemistry is high: move to personal iMessage, or keep chatting here.`}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleGraduateToImessage}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#007AFF] hover:bg-blue-600 px-3.5 text-xs sm:text-sm font-semibold text-white cursor-pointer"
                      >
                        <Unlock className="h-3.5 w-3.5" />
                        <span>
                          {role === 'her'
                            ? '📱 Give Him My Number (Move to iMessage)'
                            : '📱 Save Her Number (Move to iMessage)'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSnoozedImessageIds((prev) => [...prev, currentThread.leadId])
                        }
                        className="inline-flex h-9 items-center rounded-lg border border-blue-200 bg-white hover:bg-blue-100/40 px-3 text-xs sm:text-sm font-medium text-blue-950 cursor-pointer"
                      >
                        Not Yet, Keep Bantering on Prowl
                      </button>
                    </div>
                  </div>
                )}

                {spicyMode && currentThread.stage === 'imessage' ? (
                  <div className="space-y-2.5">
                    <div className="text-xs sm:text-sm font-semibold text-rose-800">
                      🔥 After-Dark Suggestions
                    </div>
                    <div className="grid gap-2.5">
                      {currentChapter.spicySuggestions.map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          disabled={Boolean(dmTypingLabel) || sendingAi}
                          data-testid="chat-suggestion-btn"
                          onClick={() => void sendSpontaneousTurn(sp, 0)}
                          className="w-full rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3.5 text-left text-sm sm:text-[15px] leading-relaxed font-medium text-rose-950 whitespace-normal hover:bg-rose-100 transition cursor-pointer disabled:opacity-55"
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : currentThread.adaptiveSuggestions ? (
                  <div className="space-y-2.5" data-testid="adaptive-suggestions-panel">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-medium text-zinc-600">
                      <span className="inline-flex items-center gap-1.5 text-rose-700 font-semibold">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Replies for {currentProfile.name}</span>
                      </span>
                      {activeBeat && (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateThread({
                              ...currentThread,
                              adaptiveSuggestions: undefined,
                            })
                          }
                          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 underline cursor-pointer"
                        >
                          Show Beat {currentThread.currentBeat}/6 Options
                        </button>
                      )}
                    </div>
                    <div className="grid gap-2.5">
                      {currentThread.adaptiveSuggestions.map((sugText, idx) => {
                        const isVipMove = idx === 2 || sugText.startsWith('💎');
                        const cost = isVipMove ? 1 : 0;
                        const displayClean = sugText.startsWith('💎')
                          ? sugText
                          : isVipMove
                            ? `💎 ${sugText}`
                            : sugText;
                        return (
                          <button
                            key={`${idx}-${sugText}`}
                            type="button"
                            disabled={Boolean(dmTypingLabel) || sendingAi}
                            data-testid="chat-suggestion-btn"
                            onClick={() => void sendSpontaneousTurn(displayClean, cost)}
                            className={`w-full rounded-xl px-4 py-3.5 text-left text-sm sm:text-[15px] leading-relaxed whitespace-normal transition cursor-pointer disabled:opacity-55 ${
                              isVipMove
                                ? 'border border-rose-200 bg-rose-50/60 font-semibold text-zinc-950 hover:border-rose-400'
                                : 'border border-zinc-200 bg-white font-medium text-zinc-800 hover:border-zinc-400 shadow-2xs'
                            }`}
                          >
                            <span>{displayClean}</span>
                            {isVipMove && (
                              <span className="ml-2 inline-block rounded-md bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
                                Bold Spark
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : activeBeat ? (
                  <div className="space-y-2.5">
                    <div
                      data-testid="chat-beat-progress"
                      className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-semibold text-zinc-600"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5, 6].map((dot) => (
                            <span
                              key={dot}
                              className={`h-2 w-2 rounded-full ${
                                dot <= currentThread.currentBeat ? 'bg-rose-600' : 'bg-zinc-300'
                              }`}
                            />
                          ))}
                        </span>
                        <span>
                          Beat {currentThread.currentBeat} of 6
                        </span>
                      </div>
                      {activeBeat.trapClueHint && (
                        <span className="text-rose-700 font-semibold">🕵️ Intuition Alert</span>
                      )}
                    </div>
                    <div className="grid gap-2.5">
                      {activeBeat.choices.map((c) => {
                        const cost = 'cost' in c ? c.cost : 0;
                        return (
                          <button
                            key={c.text}
                            type="button"
                            disabled={Boolean(dmTypingLabel) || sendingAi}
                            data-testid="chat-suggestion-btn"
                            onClick={() => handlePickChoice(c.text, c.reply, c.delta, cost)}
                            className={`w-full rounded-xl px-4 py-3.5 text-left text-sm sm:text-[15px] leading-relaxed whitespace-normal transition cursor-pointer disabled:opacity-55 ${
                              cost > 0
                                ? 'border border-rose-200 bg-rose-50/60 font-semibold text-zinc-950 hover:border-rose-400'
                                : 'border border-zinc-200 bg-white font-medium text-zinc-800 hover:border-zinc-400 shadow-2xs'
                            }`}
                          >
                            <span>{c.text}</span>
                            {'badge' in c && (
                              <span className="ml-2 inline-block rounded-md bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
                                {c.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-medium text-zinc-600">
                      <span className="font-semibold text-rose-700">
                        ✨ Spontaneous Banter
                      </span>
                      {nextDateScript && currentThread.stage === 'imessage' && (
                        <button
                          type="button"
                          onClick={() => launchDateWithGate(currentProfile.id, nextDateScript)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-3.5 text-xs font-semibold text-white cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>
                            {nextDateScript.dateNumber === 4
                              ? 'Launch Weekend Escape Epilogue →'
                              : `Launch Date #${nextDateScript.dateNumber} →`}
                          </span>
                        </button>
                      )}
                    </div>
                    <div className="grid gap-2.5">
                      {[
                        `Okay my turn: tell me one harmless guilty pleasure you'd never admit on a first date.`,
                        `Quick test: what's the most overrated advice people give about age-gap dating?`,
                        `💎 Be honest, what was the very first thing on my profile that made you stop scrolling?`,
                      ].map((sugText, idx) => {
                        const isVipMove = idx === 2;
                        return (
                          <button
                            key={sugText}
                            type="button"
                            disabled={Boolean(dmTypingLabel) || sendingAi}
                            data-testid="chat-suggestion-btn"
                            onClick={() => void sendSpontaneousTurn(sugText, isVipMove ? 1 : 0)}
                            className={`w-full rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 text-left text-sm sm:text-[15px] leading-relaxed whitespace-normal transition cursor-pointer disabled:opacity-55 ${
                              isVipMove
                                ? 'border border-amber-300 bg-gradient-to-r from-amber-50 to-rose-50 font-bold text-zinc-950'
                                : 'border border-zinc-200 bg-white font-medium text-zinc-800 hover:border-zinc-400 shadow-2xs'
                            }`}
                          >
                            <span>{sugText}</span>
                            {isVipMove && (
                              <span className="ml-2 inline-block rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-950">
                                Bold Spark
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Free-Typing Live AI Bar (Always Free, Comfortable 48px Height & Readable Font) */}
                <form onSubmit={handleFreeTextSubmit} className="flex gap-2.5 pt-1">
                  <input
                    type="text"
                    value={freeInput}
                    onChange={(e) => setFreeInput(e.target.value)}
                    disabled={sendingAi || Boolean(dmTypingLabel)}
                    placeholder={`Type anything freely to ${currentProfile.name} (always free)...`}
                    className="min-w-0 h-12 flex-1 rounded-full border border-zinc-300 bg-white px-5 text-base text-zinc-950 shadow-2xs focus:border-zinc-950 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!freeInput.trim() || sendingAi || Boolean(dmTypingLabel)}
                    className="shrink-0 inline-flex h-12 items-center gap-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 px-6 text-sm font-bold text-white transition cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>{sendingAi || dmTypingLabel ? 'Typing…' : 'Send'}</span>
                  </button>
                </form>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* Pre-Date Host Stand Check-In Modal (Prompts Name & Vibe Perk Before Date #1 If Unset) */}
      {pendingDateAfterPersona &&
        onSavePersona &&
        createPortal(
          <div
            data-testid="predate-persona-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/65 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Host Stand Reservation Check-In"
            onClick={() => {
              const target = pendingDateAfterPersona;
              setPendingDateAfterPersona(null);
              setActiveDateModal(target);
            }}
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => {
                e.preventDefault();
                sfx.greenFlag();
                onSavePersona(
                  quickName.trim() || (role === 'her' ? 'Vivian' : 'Alex'),
                  quickVibe,
                );
                const target = pendingDateAfterPersona;
                setPendingDateAfterPersona(null);
                setActiveDateModal(target);
              }}
              className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl animate-stage-in"
            >
              <div className="shrink-0 flex items-start justify-between gap-3 border-b border-zinc-200 bg-white px-6 py-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-600">
                    🍸 Host Stand Check-In
                  </div>
                  <h3 className="mt-0.5 text-lg font-bold tracking-tight text-zinc-950">
                    Who Should We Hold the Booth For?
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label="Close Host Stand Check-In"
                  onClick={() => {
                    const target = pendingDateAfterPersona;
                    setPendingDateAfterPersona(null);
                    setActiveDateModal(target);
                  }}
                  className="shrink-0 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
                <p className="text-xs text-zinc-600">
                  Your date will greet you by name, and your Friday vibe adds extra chemistry tonight.
                </p>

              <input
                type="text"
                maxLength={28}
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                placeholder="Your first name (optional)"
                className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-950"
              />

              <div className="grid gap-2">
                {PERSONA_VIBE_SPECS.map((spec) => {
                  const selected = quickVibe === spec.id;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setQuickVibe(spec.id)}
                      className={`rounded-xl border px-3.5 py-2.5 text-left transition cursor-pointer ${
                        selected
                          ? 'border-zinc-950 bg-zinc-950 text-white'
                          : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>
                          {spec.emoji} {spec.id}
                        </span>
                        <span className={selected ? 'text-rose-300' : 'text-rose-700'}>
                          {spec.perkBadge}
                        </span>
                      </div>
                      <div className={`mt-0.5 text-[11px] ${selected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {spec.perkSummary}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const target = pendingDateAfterPersona;
                    setPendingDateAfterPersona(null);
                    setActiveDateModal(target);
                  }}
                  className="rounded-full border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 hover:bg-rose-700 px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
                >
                  Activate Perk &amp; Start Date →
                </button>
              </div>
              </div>
            </form>
          </div>,
          document.body,
        )}

      {/* Dramatic iOS Contact Poster Celebration Splash on Graduating to Personal iMessage */}
      {imessageGradSplash &&
        createPortal(
          <div
            data-testid="imessage-graduation-splash"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Unlocked iMessage with ${imessageGradSplash.name}`}
            onClick={() => setImessageGradSplash(null)}
          >
            <div
              className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-center text-white shadow-2xl animate-stage-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="shrink-0 flex items-center justify-between gap-2 border-b border-white/10 px-6 py-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#007AFF] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Moved Off Prowl · Personal Number Unlocked</span>
                </span>
                <button
                  type="button"
                  aria-label="Close iMessage splash"
                  onClick={() => setImessageGradSplash(null)}
                  className="shrink-0 rounded-lg border border-white/15 bg-white/10 p-1.5 text-slate-200 hover:bg-white/20 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full ring-4 ring-[#007AFF] shadow-xl">
                  <img
                    src={imessageGradSplash.portrait}
                    alt={imessageGradSplash.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-sky-300">
                    New iOS Contact Poster Saved
                  </div>
                  <h3 className="mt-0.5 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {imessageGradSplash.name}, {imessageGradSplash.age}
                  </h3>
                  <p className="text-xs text-slate-300">{imessageGradSplash.job}</p>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 text-left space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-sky-300">
                    <span>💬 First Off-App iMessage Just Landed</span>
                    <span>Now</span>
                  </div>
                  <p className="text-sm text-white leading-snug">
                    “{imessageGradSplash.openingLine}”
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-emerald-300">
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1">
                    <Check className="inline h-3 w-3 mr-1" />
                    +10% Spark Boost
                  </span>
                  <span className="rounded-full bg-rose-500/15 border border-rose-400/30 px-3 py-1 text-rose-200">
                    🔥 After-Dark Mode Ready
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setImessageGradSplash(null)}
                  className="w-full rounded-full bg-[#007AFF] hover:bg-blue-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition cursor-pointer"
                >
                  Open Clean iMessage Thread →
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Comedy Block Receipt / Bestie Self-Sabotage Check Modal (Crisp Scrim, Zero Blur Glitch) */}
      {cutLooseModal &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/65 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Block or Cut Loose Verdict"
            onClick={() => setCutLooseModal(null)}
          >
            <div
              data-testid="bullet-dodged-modal"
              className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl animate-stage-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pinned Top Header */}
              <div className="shrink-0 flex items-center justify-between gap-3 border-b border-zinc-200 bg-white px-6 py-4">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
                  <Ban
                    className={`h-4 w-4 ${
                      cutLooseModal.verdict.isActualTrap ? 'text-rose-600' : 'text-amber-600'
                    }`}
                  />
                  <span
                    className={
                      cutLooseModal.verdict.isActualTrap ? 'text-rose-600' : 'text-amber-700'
                    }
                  >
                    {cutLooseModal.verdict.isActualTrap
                      ? '🏆 BULLET DODGED • NUMBER BLOCKED'
                      : '💬 BESTIE GUT-CHECK BEFORE BLOCKING'}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Close block modal"
                  onClick={() => setCutLooseModal(null)}
                  className="shrink-0 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Spacious Scrollable Receipt Body */}
              <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={
                        V35_CAST_VISUALS[cutLooseModal.leadId]?.primaryPortrait ||
                        './images/cast/hero-couple.jpg'
                      }
                      alt="Profile"
                      className={`h-16 w-16 rounded-2xl object-cover border border-zinc-200 ${
                        cutLooseModal.verdict.isActualTrap ? 'grayscale opacity-80' : ''
                      }`}
                    />
                    {cutLooseModal.verdict.isActualTrap && (
                      <span className="absolute -bottom-1.5 -right-1.5 rounded-md bg-rose-600 px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
                        BLOCKED
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 leading-snug">
                      {cutLooseModal.verdict.headline.replace(/^🏆\s*BULLET DODGED:\s*/i, '')}
                    </h3>
                  </div>
                </div>

                {cutLooseModal.verdict.isActualTrap && (
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                    <div className="inline-block rounded-2xl rounded-bl-xs bg-zinc-200/90 px-4 py-2 text-sm font-medium text-zinc-800">
                      “Wait hold on, let me explain that last part!!”
                    </div>
                    <div className="text-xs font-bold text-rose-600">
                      ❗ Not Delivered • Blocked by You
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Bestie Verdict
                  </div>
                  <p className="text-sm sm:text-base text-zinc-800 leading-relaxed">
                    {cutLooseModal.verdict.bestieNote}
                  </p>
                </div>

                {cutLooseModal.verdict.isActualTrap ? (
                  <div className="space-y-5">
                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
                        <div className="text-base sm:text-lg font-extrabold text-emerald-800">
                          +{25 + (activeVibeSpec?.trapXpBonus ?? 0)} XP
                        </div>
                        <div className="text-xs font-medium text-emerald-700">
                          Discernment
                        </div>
                      </div>
                      <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3">
                        <div className="text-base sm:text-lg font-extrabold text-rose-700">
                          ❤️ Saved
                        </div>
                        <div className="text-xs font-medium text-rose-700">
                          Friday Heart
                        </div>
                      </div>
                      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3">
                        <div className="text-base sm:text-lg font-extrabold text-amber-900">
                          {cutLooseModal.verdict.conspiracyClueId ? '🕵️ +1 Clue' : '✓ Clean'}
                        </div>
                        <div className="text-xs font-medium text-amber-800">
                          {cutLooseModal.verdict.conspiracyClueId ? 'Table 9 File' : 'Inbox'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          type="button"
                          onClick={() => setCutLooseModal(null)}
                          className="min-h-10 rounded-xl bg-zinc-950 hover:bg-zinc-800 px-5 py-2 text-sm font-bold text-white cursor-pointer"
                        >
                          Back to Connections
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = 'https://cougarsandcubs.club';
                            shareOrCopy({
                              title: 'Bullet Dodged Receipt',
                              text: cutLooseModal.verdict.receiptShareLine,
                              url,
                            });
                            setSharePayload({
                              title: 'Bullet Dodged Receipt',
                              message: cutLooseModal.verdict.receiptShareLine,
                              url,
                              shareSurface: 'verdict_receipt',
                            });
                          }}
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-800 cursor-pointer"
                        >
                          <Share2 className="h-4 w-4" />
                          <span>Share Receipt</span>
                        </button>
                      </div>
                      <a
                        href={MONETIZATION_CONFIG.tipJarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-rose-600"
                      >
                        <Heart className="h-3.5 w-3.5 text-rose-500" />
                        <span>Support Project</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setCutLooseModal(null)}
                      className="min-h-10 rounded-xl bg-zinc-950 hover:bg-zinc-800 px-5 py-2 text-sm font-bold text-white cursor-pointer"
                    >
                      Keep Chatting (Listen to Bestie)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onConfirmCutGenuine(cutLooseModal.leadId);
                        setCutLooseModal(null);
                      }}
                      className="min-h-10 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100 cursor-pointer"
                    >
                      🚫 Block &amp; Unmatch Anyway
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </div>
  );
};
