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
  Lock,
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
  type CutLooseVerdict,
  V35_CHAT_CHAPTERS,
  V35_DATE_SCRIPTS,
  V35_DISCORD_CHANNELS,
  V35_TABLE_9_CONSPIRACY,
} from '../data/v35ChatsAndDates';
import {
  getPersonaVibeSpec,
  PERSONA_VIBE_SPECS,
  type WalletState,
} from '../domain/economy';
import { sfx } from '../lib/sound';
import { shareOrCopy } from '../lib/viral';
import { liveAiInboxService } from '../services/adapters';
import { RomanticDateStage } from './RomanticDateStage';

export interface ActiveMatchThread {
  leadId: string;
  originDoor: 'hinge' | 'wild';
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
): ActiveMatchThread {
  const chapter = V35_CHAT_CHAPTERS[leadId];
  const stage: 'app_dm' | 'imessage' = originDoor === 'wild' ? 'imessage' : 'app_dm';
  const firstBeat = stage === 'imessage' ? chapter?.imessage[0] : chapter?.tinder[0];
  const seeded: { sender: 'match' | 'player' | 'system'; text: string }[] = [];

  if (openerText) {
    seeded.push({ sender: 'player', text: openerText });
  }
  if (!isCustomOpener) {
    for (const m of firstBeat?.incomingMessages ?? []) {
      seeded.push({ sender: 'match', text: m });
    }
  }

  return {
    leadId,
    originDoor,
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
  onOpenBoutique: () => void;
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
  onOpenCubSchool,
  onSavePersona,
}) => {
  const visibleThreads = useMemo(
    () => threads.filter((t) => !cutLooseIds.includes(t.leadId)),
    [threads, cutLooseIds],
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
  const [coachBanner, setCoachBanner] = useState<{ leadId: string; text: string } | null>(null);
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

  // Clear transient banners/drawers whenever switching active match
  useEffect(() => {
    setCoachBanner(null);
    setShowArchivedHinge(false);
    setDmTypingLabel(null);
  }, [activeLeadId]);
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

    setCoachBanner(null);
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
    setCoachBanner(null);
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
        { sender: 'system', text: 'iMessage • Today 6:14 PM' },
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
            currentProfile.id === 'julian' ? 'Hampstead London UK' : currentProfile.vitals.neighborhood,
          personaLore: `${currentProfile.tagline} ${currentProfile.trapTellSummary || currentProfile.vulnerabilityNote || ''}`.trim(),
          platform: currentThread.stage === 'imessage' ? 'imessage' : 'tinder',
          playerMessage: trimmed,
          history: historySnapshot,
        }),
        minHumanBeat,
      ]);

      sfx.messagePop();
      setCoachBanner({ leadId: targetLeadId, text: res.coachNote });
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
  const activeBeat =
    currentThread && currentThread.currentBeat <= 6
      ? beatsArray.find((b) => b.beatNumber === currentThread.currentBeat)
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
      badge: '🐆 Velvet Palms Host',
      age: 42,
      title: 'Velvet Palms Host & Biotech Director',
      role: 'her',
      secondName: 'Sienna_Design',
      secondBadge: '🏡 Velvet Palms',
    },
    'red-flag-emergency': {
      id: 'priya',
      name: 'Priya_TraumaRN',
      badge: '🏥 Night Shift',
      age: 36,
      title: 'Charge Trauma RN & Red-Flag Triage Lead',
      role: 'her',
      secondName: 'Jade_42F',
      secondBadge: '🐆 Velvet Palms Host',
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
      title: 'Structural Engineer & Velvet Palms Regular',
      role: 'him',
      secondName: 'Claire_M&A',
      secondBadge: '🍸 Deal Partner',
    },
    'blind-velvet-dm': {
      id: 'anon-cedar',
      name: 'Anon_Cedar_7',
      badge: '🎭 Mystery Regular',
      age: 39,
      title: 'Velvet Room Insider',
      role: 'her',
      secondName: 'Anon_Velvet_9',
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
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-gradient-to-r from-[#18101E] via-[#2B1938] to-[#18101E] px-6 py-4 text-white shadow-lg">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
              🕵️ 3 Conspiracy Clues Assembled!
            </div>
            <div className="font-editorial text-lg font-bold">
              Unlock the Secret Multi-Route Finale: Table 9 / 6:45 Alibi Club Takedown
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSurface('conspiracy')}
            className="rounded-full bg-amber-300 px-5 py-2.5 text-xs font-extrabold text-[#18101E] cursor-pointer"
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

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
          {activeVibeSpec && (
            <span
              data-testid="active-vibe-perk-badge"
              className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-900"
            >
              {activeVibeSpec.emoji} {wallet.playerName ? `${wallet.playerName} • ` : ''}
              {activeVibeSpec.id} ({activeVibeSpec.perkBadge})
            </span>
          )}
          <span>
            Table 9 Clues: {wallet.conspiracyClues.length}/3 • Discernment XP: {wallet.discernmentXp}
          </span>
        </div>
      </div>

      {/* Inline 5-Second Persona & Vibe Perk Onboarding Card Before Your First Chat / Date */}
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
            className="rounded-2xl border border-rose-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-rose-600">
                  ✨ 5-Second Club Check-In (Before Your Date!)
                </div>
                <p className="mt-0.5 text-xs sm:text-sm font-medium text-zinc-700">
                  Set your first name so matches address you personally, and pick a Friday Vibe to unlock an active chat and date bonus:
                </p>
              </div>
              <button
                type="button"
                aria-label="Skip persona card"
                onClick={() => setDismissedPersonaCard(true)}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {PERSONA_VIBE_SPECS.map((spec) => {
                const selected = quickVibe === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => setQuickVibe(spec.id)}
                    className={`rounded-xl border p-2.5 text-left transition cursor-pointer ${
                      selected
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-zinc-200 bg-zinc-50/70 text-zinc-800 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-xs font-bold">
                      <span>
                        {spec.emoji} {spec.id}
                      </span>
                    </div>
                    <div
                      className={`mt-1 text-[10px] font-extrabold ${
                        selected ? 'text-rose-300' : 'text-rose-700'
                      }`}
                    >
                      {spec.perkBadge}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                maxLength={28}
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                aria-label="Quick first name"
                placeholder={
                  role === 'her'
                    ? 'Your first name (e.g. Sophia)...'
                    : 'Your first name (e.g. Alex)...'
                }
                className="flex-1 min-w-[200px] rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs sm:text-sm text-zinc-950 focus:border-zinc-950 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-rose-600 hover:bg-rose-700 px-5 py-2 text-xs font-extrabold text-white transition cursor-pointer"
              >
                Save Name &amp; Activate Perk →
              </button>
            </div>
          </form>
        )}

      {surface === 'conspiracy' ? (
        <section className="overflow-hidden rounded-3xl bg-[#18101E] text-white shadow-2xl">
          <div className="relative h-64 w-full">
            <img
              src={V35_TABLE_9_CONSPIRACY.backdropUrl}
              alt={V35_TABLE_9_CONSPIRACY.title}
              className="h-full w-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#18101E] to-transparent" />
            <div className="absolute left-6 bottom-4">
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold">
                {V35_TABLE_9_CONSPIRACY.title}
              </h2>
            </div>
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <p className="font-editorial text-lg leading-relaxed text-amber-50">
              {V35_TABLE_9_CONSPIRACY.beats[0].dialogue}
            </p>
            {conspiracyOutcome ? (
              <div className="rounded-2xl bg-emerald-950/80 border border-emerald-400/50 p-5 space-y-3">
                <p className="text-base font-semibold text-emerald-100">{conspiracyOutcome}</p>
                <button
                  type="button"
                  onClick={() => setSurface('dm')}
                  className="rounded-full bg-amber-300 px-5 py-2 text-xs font-extrabold text-[#18101E] cursor-pointer"
                >
                  Return to Matches
                </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
          {/* 5 Distinct Discord Channels */}
          <aside className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-1.5 shadow-2xs">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Velvet Palms Server
            </div>
            {V35_DISCORD_CHANNELS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveDiscordId(ch.id)}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition cursor-pointer ${
                  activeDiscord.id === ch.id
                    ? 'bg-[#5865F2] text-white shadow-2xs'
                    : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                }`}
              >
                <div>{ch.handleLabel}</div>
              </button>
            ))}
          </aside>

          <section className="editorial-hinge-card rounded-3xl p-5 sm:p-6 space-y-4">
            <header className="border-b border-stone-200 pb-3">
              <h2 className="font-editorial text-xl font-bold text-[#18101E]">
                {activeDiscord.handleLabel}
              </h2>
              <p className="text-xs text-stone-500">{activeDiscord.topicSubtitle}</p>
            </header>

            <div
              ref={discordFeedRef}
              data-testid="discord-message-feed"
              className="max-h-[420px] overflow-y-auto scroll-smooth space-y-3 pr-1"
            >
              {[
                ...activeDiscord.seededMessages.map((m) => ({ ...m, isPlayer: false })),
                ...(discordExtraMsgs[activeDiscord.id] || []),
              ].map((msg, idx) => {
                const reactionKey = `${activeDiscord.id}-${idx}`;
                const pickedEmojis = discordReactions[reactionKey] || [];
                const isPlayerPost = Boolean(msg.isPlayer);
                return (
                  <div
                    key={`${msg.sender}-${idx}`}
                    data-testid={idx === 0 ? 'discord-first-message' : undefined}
                    className={`rounded-2xl p-3.5 space-y-1.5 transition ${
                      isPlayerPost
                        ? 'ml-6 bg-indigo-50 border border-indigo-200'
                        : idx >= activeDiscord.seededMessages.length
                          ? 'bg-white border border-indigo-200 border-l-4 border-l-[#5865F2] shadow-2xs'
                          : 'bg-zinc-50 border border-zinc-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-zinc-950">
                      <div className="flex items-center gap-2">
                        <span>{msg.sender}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            isPlayerPost
                              ? 'bg-[#5865F2] text-white'
                              : 'bg-indigo-50 text-indigo-800'
                          }`}
                        >
                          {msg.badge}
                        </span>
                      </div>
                      {!isPlayerPost && (
                        <div className="flex items-center gap-1">
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
                                className={`rounded-full px-1.5 py-0.5 text-[11px] transition cursor-pointer ${
                                  active
                                    ? 'bg-indigo-100 ring-1 ring-[#5865F2] font-bold'
                                    : 'opacity-55 hover:opacity-100 hover:bg-zinc-200/60'
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
                    <p className="text-sm text-zinc-800 leading-relaxed">{msg.text}</p>
                  </div>
                );
              })}

              {discordTypingLabel && (
                <div
                  data-testid="discord-typing-indicator"
                  className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs font-semibold text-indigo-950"
                >
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5865F2] animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5865F2] animate-bounce [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5865F2] animate-bounce [animation-delay:240ms]" />
                  </span>
                  <span>{discordTypingLabel}…</span>
                </div>
              )}
            </div>

            {/* Full-Sentence Wrapped Channel Suggestions + Live Open-Ended Discord Input */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                <span>Ask Anything or Tap an Icebreaker in {activeDiscord.handleLabel}</span>
              </div>

              <form
                onSubmit={handleDiscordFreeSubmit}
                className="flex items-center gap-2"
                data-testid="discord-open-form"
              >
                <input
                  type="text"
                  value={discordFreeInput}
                  onChange={(e) => setDiscordFreeInput(e.target.value)}
                  disabled={sendingDiscordAi}
                  aria-label={`Message ${activeDiscord.handleLabel}`}
                  placeholder={`Write your own question or tea in ${activeDiscord.handleLabel}...`}
                  className="flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-xs sm:text-sm text-zinc-950 focus:border-[#5865F2] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!discordFreeInput.trim() || sendingDiscordAi || Boolean(discordTypingLabel)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 px-5 py-2.5 text-xs font-bold text-white transition cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{sendingDiscordAi || discordTypingLabel ? 'Replying…' : 'Post'}</span>
                </button>
              </form>

              <div className="grid gap-2">
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
                      className={`w-full rounded-2xl border p-3 text-left text-xs sm:text-sm font-medium whitespace-normal transition cursor-pointer ${
                        alreadyAsked
                          ? 'border-zinc-200 bg-zinc-50 text-zinc-400'
                          : 'border-zinc-200 bg-white text-zinc-800 hover:border-[#5865F2] hover:bg-indigo-50/30'
                      }`}
                    >
                      {alreadyAsked ? `✓ Asked: ${sug}` : sug}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      ) : visibleThreads.length === 0 ? (
        <section className="editorial-hinge-card rounded-3xl p-8 text-center space-y-4">
          <h2 className="font-editorial text-2xl font-bold text-[#18101E]">
            Your Inbox Is Wide Open
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Send a thoughtful prompt reply on Hinge or meet someone out at Terminal B, The Velvet
            Room, or Hawthorne University to start your first thread!
          </p>
          <button
            type="button"
            onClick={onOpenHinge}
            className="rounded-full bg-[#18101E] px-6 py-2.5 text-xs font-bold text-white cursor-pointer"
          >
            Back to Hinge Discovery →
          </button>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-5 items-start">
          {/* Multi-Match Roster Sidebar (Shows ALL Active Matches Simultaneously!) */}
          <aside className="editorial-hinge-card rounded-3xl p-4 space-y-2">
            <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-stone-400">
              Active Connections ({visibleThreads.length})
            </div>
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
                    setActiveLeadId(thread.leadId);
                    onSelectLead?.(thread.leadId);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#18101E] text-white shadow-sm'
                      : 'bg-stone-50/80 text-[#18101E] hover:bg-stone-100'
                  }`}
                >
                  <img
                    src={vis.primaryPortrait}
                    alt={p.name}
                    className="h-12 w-12 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
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
                        {thread.stage === 'imessage' ? 'iMessage' : 'App DM'}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-1 text-[11px]">
                      <span
                        data-testid={`lead-date-hearts-${thread.leadId}`}
                        className={`font-bold tracking-tight ${
                          isSelected ? 'text-rose-300' : 'text-rose-600'
                        }`}
                      >
                        {'♥'.repeat(Math.min(3, thread.datesCompleted)) +
                          '♡'.repeat(Math.max(0, 3 - Math.min(3, thread.datesCompleted)))}
                        {thread.lastDateRank && thread.lastDateRank !== 'F'
                          ? ` • ${thread.lastDateRank}-Rank`
                          : ''}
                      </span>
                      <span className={isSelected ? 'text-amber-200' : 'text-stone-400'}>
                        {thread.chemistry}% Spark
                      </span>
                    </div>
                    <p
                      className={`mt-0.5 text-xs line-clamp-1 ${
                        isSelected ? 'text-stone-300' : 'text-stone-500'
                      }`}
                    >
                      {thread.messages[thread.messages.length - 1]?.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Single Evolving Thread Stage (Distinct Hinge App DM vs Fresh Apple iMessage Interface) */}
          {currentThread && currentProfile && currentChapter && (
            <section
              data-testid={`chat-stage-${currentThread.stage}`}
              className={`rounded-3xl overflow-hidden border shadow-xs transition-all ${
                currentThread.stage === 'imessage'
                  ? 'border-sky-200 bg-[#F8FAFC]'
                  : 'editorial-hinge-card border-zinc-200 bg-white'
              }`}
            >
              {/* Distinct Header: Authentic Apple iOS Contact Bar in iMessage vs Hinge App DM Header */}
              {currentThread.stage === 'imessage' ? (
                <header className="border-b border-slate-200/90 bg-gradient-to-b from-[#F1F5F9] to-[#F8FAFC] px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={V35_CAST_VISUALS[currentProfile.id].primaryPortrait}
                          alt={currentProfile.name}
                          className="h-13 w-13 rounded-full object-cover ring-2 ring-[#007AFF] shadow-xs"
                        />
                        <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#007AFF] text-[9px] font-bold text-white">
                          ✓
                        </span>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold tracking-tight text-slate-950">
                            {currentProfile.name}, {currentProfile.age}
                          </h2>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#007AFF] px-2.5 py-0.5 text-[11px] font-bold text-white">
                            <Smartphone className="h-3 w-3" />
                            <span>Earned iMessage</span>
                          </span>
                          <span className="rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                            {currentThread.chemistry}% Spark
                          </span>
                          {sparkToast && (
                            <span
                              key={sparkToast.nonce}
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold animate-bounce ${
                                sparkToast.delta >= 0
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : 'bg-rose-100 text-rose-900'
                              }`}
                            >
                              {sparkToast.delta >= 0
                                ? `+${sparkToast.delta}% Spark ✨`
                                : `${sparkToast.delta}% Vibe`}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-[#007AFF]">
                          Personal Cell Unlocked • Off-App Blue Bubbles Active
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {etiquetteBonusActive ? (
                        <span
                          data-testid="etiquette-perk-pill"
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-900"
                        >
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>+8% Spark Perk</span>
                        </span>
                      ) : onOpenCubSchool ? (
                        <button
                          type="button"
                          onClick={onOpenCubSchool}
                          className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-950 hover:bg-amber-100 cursor-pointer"
                        >
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>Cub School (+8% Spark)</span>
                        </button>
                      ) : null}

                      <span
                        aria-hidden="true"
                        className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-2.5 py-1.5 text-[#007AFF]"
                        title="iOS Audio & FaceTime Connected"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <Video className="h-3.5 w-3.5" />
                      </span>

                      <button
                        type="button"
                        onClick={() => setSpicyMode((s) => !s)}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                          spicyMode
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-300'
                        }`}
                      >
                        <Flame className="h-3.5 w-3.5 text-rose-500" />
                        <span>After-Dark Mode</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTriggerCutLoose}
                        className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-300 px-3.5 py-1.5 text-xs font-bold text-rose-900 hover:bg-rose-100 cursor-pointer"
                      >
                        <Ban className="h-3.5 w-3.5 text-rose-700" />
                        <span>Block / Cut Loose</span>
                      </button>
                    </div>
                  </div>
                </header>
              ) : (
                <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b bg-stone-50/80 border-stone-200/70">
                  <div className="flex items-center gap-3">
                    <img
                      src={V35_CAST_VISUALS[currentProfile.id].primaryPortrait}
                      alt={currentProfile.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-editorial text-xl font-bold text-[#18101E]">
                          {currentProfile.name}, {currentProfile.age}
                        </h2>
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-900">
                          <Smartphone className="h-3 w-3" />
                          <span>Hinge App DM</span>
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-bold text-zinc-700">
                          {currentThread.chemistry}% Spark
                        </span>
                        {sparkToast && (
                          <span
                            key={sparkToast.nonce}
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold animate-bounce ${
                              sparkToast.delta >= 0
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-rose-100 text-rose-900'
                            }`}
                          >
                            {sparkToast.delta >= 0
                              ? `+${sparkToast.delta}% Spark ✨`
                              : `${sparkToast.delta}% Vibe`}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">
                        {role === 'her'
                          ? 'He is courting your interest, vet his consistency or block him anytime.'
                          : 'Build genuine spark across 6 beats to earn her personal iMessage.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {etiquetteBonusActive ? (
                      <span
                        data-testid="etiquette-perk-pill"
                        className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-900"
                      >
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>+8% Spark Perk</span>
                      </span>
                    ) : onOpenCubSchool ? (
                      <button
                        type="button"
                        onClick={onOpenCubSchool}
                        className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-950 hover:bg-amber-100 cursor-pointer"
                      >
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>Cub School (+8% Spark)</span>
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={handleTriggerCutLoose}
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-300 px-3.5 py-1.5 text-xs font-bold text-rose-900 hover:bg-rose-100 cursor-pointer"
                    >
                      <Flag className="h-3.5 w-3.5 text-rose-700" />
                      <span>Block / Cut Loose</span>
                    </button>

                    {(isReadyToGraduate || currentThread.chemistry >= 75) && (
                      <button
                        type="button"
                        onClick={handleGraduateToImessage}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#007AFF] hover:bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition cursor-pointer"
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
                      ? `Velvet Cut Weekend Epilogue (${
                          wallet.isVip ||
                          wallet.isFounderUnlimited ||
                          wallet.unlockedEpilogueIds.includes(`${currentProfile.id}-epilogue-4`)
                            ? 'Unlocked'
                            : '3 Cr'
                        })`
                      : `Date #${nextDateScript.dateNumber}`}{' '}
                    with {currentProfile.name}! (Or keep chatting freely below)
                  </div>
                  <button
                    type="button"
                    onClick={() => launchDateWithGate(currentProfile.id, nextDateScript)}
                    className="rounded-full bg-[#18101E] px-4 py-2 text-xs font-bold text-white cursor-pointer"
                  >
                    {nextDateScript.dateNumber === 4
                      ? '🌙 Launch Velvet Cut Epilogue →'
                      : `🍸 Go on Date #${nextDateScript.dateNumber} →`}
                  </button>
                </div>
              )}

              {/* Message Stream (Clean Fresh iMessage Slate w/ Optional Archived Hinge Toggle + 1-Cr Camera-Roll Drops) */}
              <div
                ref={dmFeedRef}
                data-testid="dm-message-feed"
                className={`max-h-[450px] overflow-y-auto scroll-smooth p-6 space-y-3.5 ${
                  currentThread.stage === 'imessage' ? 'bg-white' : 'bg-white'
                }`}
              >
                {currentThread.stage === 'imessage' &&
                  currentThread.archivedAppMessages &&
                  currentThread.archivedAppMessages.length > 0 && (
                    <div className="space-y-2 pb-2 border-b border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowArchivedHinge((v) => !v)}
                        className="mx-auto flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 px-3.5 py-1 text-[11px] font-semibold text-slate-600 transition cursor-pointer"
                      >
                        <span>
                          {showArchivedHinge
                            ? 'Hide Earlier Hinge App Messages'
                            : `View ${currentThread.archivedAppMessages.filter((m) => m.sender !== 'system').length} Earlier Hinge App Messages`}
                        </span>
                        <ChevronDown
                          className={`h-3 w-3 transition-transform ${
                            showArchivedHinge ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {showArchivedHinge && (
                        <div className="rounded-2xl bg-stone-50 border border-stone-200/70 p-3.5 space-y-2 opacity-80">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Archived Hinge App Thread
                          </div>
                          {currentThread.archivedAppMessages
                            .filter((m) => m.sender !== 'system')
                            .map((am, aIdx) => (
                              <div
                                key={`arch-${aIdx}`}
                                className="text-xs text-stone-600 leading-snug"
                              >
                                <span className="font-bold text-stone-800">
                                  {am.sender === 'player' ? 'You: ' : `${currentProfile.name}: `}
                                </span>
                                {am.text}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                {currentThread.messages.map((m, idx) => {
                  if (m.sender === 'system') {
                    return (
                      <div
                        key={`sys-${idx}`}
                        className="mx-auto max-w-md py-1 text-center text-[11px] font-semibold tracking-wide text-slate-400"
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
                      <div className="relative max-w-[82%]">
                        <div
                          className={`px-4 py-2.5 text-sm leading-relaxed ${
                            isPlayer
                              ? currentThread.stage === 'imessage'
                                ? 'rounded-2xl rounded-br-xs bg-[#007AFF] text-white shadow-2xs'
                                : 'rounded-2xl bg-[#18101E] text-white'
                              : currentThread.stage === 'imessage'
                                ? 'rounded-2xl rounded-bl-xs bg-[#E9E9EB] text-slate-950'
                                : 'rounded-2xl bg-zinc-100 text-zinc-900 border border-zinc-200/60'
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

                      {isLastPlayerBubble && (
                        <span className="mt-0.5 pr-1 text-[10px] font-semibold text-slate-400">
                          Delivered
                        </span>
                      )}

                      {!isPlayer && (
                        <div className="mt-1 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
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
                              className={`rounded-full px-1.5 py-0.5 text-[11px] transition cursor-pointer ${
                                activeTapback === emo
                                  ? 'bg-rose-50 ring-1 ring-rose-300'
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
                    className="flex justify-start"
                  >
                    <div
                      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold ${
                        currentThread.stage === 'imessage'
                          ? 'bg-[#E9E9EB] text-slate-600'
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

                {/* Beat 4 Private Camera-Roll Portrait Drop (Free 1st Club Sample + Free Metadata Clue + Rich Payoff) */}
                {activeBeat?.photoDrop && (
                  <div
                    data-testid="chat-photo-drop-card"
                    className="rounded-2xl border border-zinc-200 bg-zinc-50/90 p-4 space-y-3 max-w-md shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold text-zinc-900">
                        📸 {activeBeat.photoDrop.previewCaption}
                      </div>
                      <span
                        data-testid="photo-drop-cost-badge"
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${
                          wallet.isVip ||
                          wallet.isFounderUnlimited ||
                          wallet.unlockedPhotoIds.includes(activeBeat.photoDrop.id)
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : wallet.unlockedPhotoIds.length === 0
                              ? 'bg-amber-100 border-amber-300 text-amber-950'
                              : 'bg-white border-zinc-200 text-zinc-700'
                        }`}
                      >
                        {wallet.isVip || wallet.isFounderUnlimited
                          ? 'VIP Included'
                          : wallet.unlockedPhotoIds.includes(activeBeat.photoDrop.id)
                            ? '✨ Unlocked'
                            : wallet.unlockedPhotoIds.length === 0
                              ? `🎁 1st Sample Free (${activeBeat.photoDrop.unlockCost} Cr Value)`
                              : `${activeBeat.photoDrop.unlockCost} Cr`}
                      </span>
                    </div>

                    {wallet.isVip ||
                    wallet.isFounderUnlimited ||
                    wallet.unlockedPhotoIds.includes(activeBeat.photoDrop.id) ? (
                      <div className="space-y-2.5">
                        <img
                          src={activeBeat.photoDrop.imageUrl}
                          alt={activeBeat.photoDrop.previewCaption}
                          className="h-64 w-full rounded-xl object-cover object-top"
                        />
                        <div className="rounded-xl bg-white border border-zinc-200 p-3 text-xs font-medium text-zinc-800 leading-relaxed">
                          {activeBeat.photoDrop.secretNote}
                        </div>
                        {currentChapter.cutLooseVerdict.isActualTrap ? (
                          <div className="space-y-2">
                            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-900">
                              🚨 Smoking-Gun Receipt Exposed! Cut loose now to claim your Discernment XP.
                            </div>
                            <button
                              type="button"
                              onClick={handleTriggerCutLoose}
                              className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-xs font-extrabold text-white transition cursor-pointer"
                            >
                              🚫 Block Number &amp; Claim XP Receipt →
                            </button>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900">
                            💖 +10% Chemistry Spark Unlocked • Evening Portrait Saved!
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="relative overflow-hidden rounded-xl">
                          <img
                            src={activeBeat.photoDrop.imageUrl}
                            alt="Private camera roll preview"
                            className="h-52 w-full object-cover object-top blur-md scale-105 brightness-95"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-950/35 p-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const effectiveCost =
                                  wallet.unlockedPhotoIds.length === 0
                                    ? 0
                                    : activeBeat.photoDrop!.unlockCost;
                                const unlocked = onUnlockBucketItem(
                                  'unlockedPhotoIds',
                                  activeBeat.photoDrop!.id,
                                  effectiveCost,
                                );
                                if (unlocked) {
                                  sfx.greenFlag();
                                  if (!currentChapter.cutLooseVerdict.isActualTrap) {
                                    setSparkToast({ delta: 10, nonce: Date.now() });
                                    onUpdateThread({
                                      ...currentThread,
                                      chemistry: Math.min(100, currentThread.chemistry + 10),
                                    });
                                  }
                                }
                              }}
                              className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-zinc-100 px-4 py-2 text-xs font-extrabold text-zinc-950 shadow-md transition cursor-pointer"
                            >
                              {wallet.unlockedPhotoIds.length === 0 ? (
                                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                              ) : (
                                <Lock className="h-3.5 w-3.5 text-rose-600" />
                              )}
                              <span>Unblur Portrait &amp; Secret Note</span>
                            </button>

                            {!inspectedExifIds.includes(activeBeat.photoDrop.id) && (
                              <button
                                type="button"
                                onClick={() => {
                                  sfx.messagePop();
                                  setInspectedExifIds((prev) => [
                                    ...prev,
                                    activeBeat.photoDrop!.id,
                                  ]);
                                }}
                                className="inline-flex items-center gap-1 rounded-full bg-zinc-950/80 hover:bg-zinc-950 px-3 py-1 text-[11px] font-semibold text-white transition cursor-pointer"
                              >
                                <Search className="h-3 w-3" />
                                <span>Inspect Photo Metadata</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {inspectedExifIds.includes(activeBeat.photoDrop.id) && (
                          <div
                            data-testid="photo-exif-clue"
                            className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950 leading-snug"
                          >
                            {activeBeat.photoDrop.exifClue}
                          </div>
                        )}
                      </div>
                    )}
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
              </div>

              {coachBanner && coachBanner.leadId === currentThread.leadId && (
                <div className="flex items-center justify-between gap-2 bg-amber-50/90 border-t border-amber-200 px-6 py-2 text-xs font-semibold text-amber-950">
                  <span>💡 Bestie Read: {coachBanner.text}</span>
                  <button
                    type="button"
                    aria-label="Dismiss Bestie tip"
                    onClick={() => setCoachBanner(null)}
                    className="rounded-full p-0.5 text-amber-800 hover:bg-amber-200/60 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Spontaneous Adaptive Replies + Optional Non-Blocking iMessage Swap (Never Forces You Off Hinge!) */}
              <div className="border-t border-stone-200/80 bg-stone-50/60 p-5 space-y-3.5">
                {isReadyToGraduate && !snoozedImessageIds.includes(currentThread.leadId) && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 px-4 py-3">
                    <div className="text-xs font-bold text-blue-950">
                      {role === 'her'
                        ? `📱 Chemistry is buzzing, share your number to move to iMessage, or stay on Hinge as long as you like!`
                        : `📱 Chemistry is buzzing, move to personal iMessage now, or keep bantering right here on Hinge!`}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleGraduateToImessage}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#007AFF] hover:bg-blue-600 px-4 py-2 text-xs font-bold text-white cursor-pointer"
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
                        className="rounded-full border border-blue-200 bg-white hover:bg-blue-100/40 px-3.5 py-2 text-xs font-semibold text-blue-950 cursor-pointer"
                      >
                        Not Yet, Keep Bantering on Hinge ✨
                      </button>
                    </div>
                  </div>
                )}

                {spicyMode && currentThread.stage === 'imessage' ? (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-rose-800">
                      🔥 After-Dark Spicy Suggestions (Tap to send)
                    </div>
                    <div className="grid gap-2">
                      {currentChapter.spicySuggestions.map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          disabled={Boolean(dmTypingLabel) || sendingAi}
                          data-testid="chat-suggestion-btn"
                          onClick={() => void sendSpontaneousTurn(sp, 0)}
                          className="w-full rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 text-left text-xs sm:text-sm font-semibold text-rose-950 whitespace-normal hover:bg-rose-100 transition cursor-pointer disabled:opacity-55"
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : currentThread.adaptiveSuggestions ? (
                  <div className="space-y-2.5" data-testid="adaptive-suggestions-panel">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-zinc-600">
                      <span className="inline-flex items-center gap-1.5 text-rose-700 font-bold">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Live Replies Adapted to {currentProfile.name}’s Message</span>
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
                          className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 underline cursor-pointer"
                        >
                          Show Chapter Beat {currentThread.currentBeat}/6 Options
                        </button>
                      )}
                    </div>
                    <div className="grid gap-2">
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
                            className={`w-full rounded-2xl p-3.5 text-left text-xs sm:text-sm whitespace-normal transition cursor-pointer disabled:opacity-55 ${
                              isVipMove
                                ? 'border border-amber-300 bg-gradient-to-r from-amber-50 to-rose-50 font-bold text-[#18101E]'
                                : 'border border-stone-200 bg-white font-medium text-stone-800 hover:border-stone-400'
                            }`}
                          >
                            <span>{displayClean}</span>
                            {isVipMove && (
                              <span className="ml-2 inline-block rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-extrabold text-amber-950">
                                Bold Spark • {wallet.isVip ? 'VIP Free' : '1 Cr'}
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
                      className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-stone-600"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1">
                          {[1, 2, 3, 4, 5, 6].map((dot) => (
                            <span
                              key={dot}
                              className={`h-2 w-2 rounded-full ${
                                dot <= currentThread.currentBeat ? 'bg-rose-600' : 'bg-stone-300'
                              }`}
                            />
                          ))}
                        </span>
                        <span>
                          Beat {currentThread.currentBeat} of 6 •{' '}
                          {currentThread.stage === 'app_dm'
                            ? 'Playful Hinge Banter'
                            : 'Off-App Chemistry'}
                        </span>
                      </div>
                      {activeBeat.trapClueHint && (
                        <span className="text-rose-700 font-bold">🕵️ Intuition Alert</span>
                      )}
                    </div>
                    <div className="grid gap-2">
                      {activeBeat.choices.map((c) => {
                        const cost = 'cost' in c ? c.cost : 0;
                        return (
                          <button
                            key={c.text}
                            type="button"
                            disabled={Boolean(dmTypingLabel) || sendingAi}
                            data-testid="chat-suggestion-btn"
                            onClick={() => handlePickChoice(c.text, c.reply, c.delta, cost)}
                            className={`w-full rounded-2xl p-3.5 text-left text-xs sm:text-sm whitespace-normal transition cursor-pointer disabled:opacity-55 ${
                              cost > 0
                                ? 'border border-amber-300 bg-gradient-to-r from-amber-50 to-rose-50 font-bold text-[#18101E]'
                                : 'border border-stone-200 bg-white font-medium text-stone-800 hover:border-stone-400'
                            }`}
                          >
                            <span>{c.text}</span>
                            {'badge' in c && (
                              <span className="ml-2 inline-block rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-extrabold text-amber-950">
                                {c.badge} • {wallet.isVip ? 'VIP Free' : `${cost} Cr`}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-zinc-600">
                      <span className="font-bold text-rose-700">
                        ✨ Spontaneous Banter Mode. Keep riffing freely or pick a playful prompt:
                      </span>
                      {nextDateScript && currentThread.stage === 'imessage' && (
                        <button
                          type="button"
                          onClick={() => launchDateWithGate(currentProfile.id, nextDateScript)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#B83253] px-4 py-1.5 text-xs font-bold text-white cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>
                            {nextDateScript.dateNumber === 4
                              ? `Launch Velvet Cut Epilogue (${
                                  wallet.isVip ||
                                  wallet.isFounderUnlimited ||
                                  wallet.unlockedEpilogueIds.includes(`${currentProfile.id}-epilogue-4`)
                                    ? 'Unlocked'
                                    : '3 Cr'
                                }) →`
                              : `Launch Date #${nextDateScript.dateNumber} →`}
                          </span>
                        </button>
                      )}
                    </div>
                    <div className="grid gap-2">
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
                            className={`w-full rounded-2xl p-3.5 text-left text-xs sm:text-sm whitespace-normal transition cursor-pointer disabled:opacity-55 ${
                              isVipMove
                                ? 'border border-amber-300 bg-gradient-to-r from-amber-50 to-rose-50 font-bold text-[#18101E]'
                                : 'border border-stone-200 bg-white font-medium text-stone-800 hover:border-stone-400'
                            }`}
                          >
                            <span>{sugText}</span>
                            {isVipMove && (
                              <span className="ml-2 inline-block rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-extrabold text-amber-950">
                                Bold Spark • {wallet.isVip ? 'VIP Free' : '1 Cr'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Free-Typing Live AI Bar (0 Credits. Never Cuts Player Off!) */}
                <form onSubmit={handleFreeTextSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={freeInput}
                    onChange={(e) => setFreeInput(e.target.value)}
                    disabled={sendingAi || Boolean(dmTypingLabel)}
                    placeholder={`Type anything freely to ${currentProfile.name} (open-ended AI, 0 Cr)...`}
                    className="flex-1 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm text-[#18101E] focus:border-zinc-950 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!freeInput.trim() || sendingAi || Boolean(dmTypingLabel)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#18101E] disabled:opacity-50 px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{sendingAi || dmTypingLabel ? 'Typing…' : 'Send'}</span>
                  </button>
                </form>
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
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-stage-in"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-rose-900">
                  🍸 Host Stand Check-In
                </span>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-zinc-950">
                  Who Should We Hold the Booth For?
                </h3>
                <p className="mt-1 text-xs text-zinc-600">
                  Your date will greet you by name, and your Signature Vibe applies an active S-Rank chemistry bonus tonight.
                </p>
              </div>

              <input
                type="text"
                maxLength={28}
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                placeholder={role === 'her' ? 'Your first name (e.g. Sophia)' : 'Your first name (e.g. Alex)'}
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
                  className="rounded-full bg-rose-600 hover:bg-rose-700 px-5 py-2.5 text-xs font-extrabold text-white cursor-pointer"
                >
                  Activate Perk &amp; Start Date →
                </button>
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
              className="w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 text-center text-white shadow-2xl space-y-4 animate-stage-in"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#007AFF] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm">
                <Smartphone className="h-3.5 w-3.5" />
                <span>Moved Off Hinge • Personal Cell Unlocked</span>
              </span>

              <div className="mx-auto h-28 w-28 overflow-hidden rounded-full ring-4 ring-[#007AFF] shadow-xl">
                <img
                  src={imessageGradSplash.portrait}
                  alt={imessageGradSplash.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-sky-300">
                  New iOS Contact Poster Saved
                </div>
                <h3 className="mt-0.5 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {imessageGradSplash.name}, {imessageGradSplash.age}
                </h3>
                <p className="text-xs text-slate-300">{imessageGradSplash.job}</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 text-left space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-sky-300">
                  <span>💬 First Off-App iMessage Just Landed</span>
                  <span>Now</span>
                </div>
                <p className="text-xs sm:text-sm text-white leading-snug">
                  “{imessageGradSplash.openingLine}”
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-emerald-300">
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
          </div>,
          document.body,
        )}

      {/* Comedy Dating-Sim Block Receipt / Bestie Self-Sabotage Check Modal (Crisp Scrim, Zero Blur Glitch) */}
      {cutLooseModal &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/65 p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setCutLooseModal(null)}
          >
            <div
              className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4 animate-stage-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${
                    cutLooseModal.verdict.isActualTrap
                      ? 'bg-rose-100 text-rose-900'
                      : 'bg-amber-100 text-amber-950'
                  }`}
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>
                    {cutLooseModal.verdict.isActualTrap
                      ? 'Number Blocked • Receipt Saved'
                      : 'Bestie Gut-Check Before Blocking'}
                  </span>
                </span>
                <button
                  type="button"
                  aria-label="Close block modal"
                  onClick={() => setCutLooseModal(null)}
                  className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h3 className="font-editorial text-2xl font-bold text-[#18101E]">
                {cutLooseModal.verdict.headline}
              </h3>

              {cutLooseModal.verdict.isActualTrap && (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3.5 space-y-1.5">
                  <div className="inline-block rounded-2xl rounded-bl-xs bg-[#E9E9EB] px-3.5 py-2 text-xs font-medium text-zinc-700">
                    Wait hold on, let me explain that last part!!
                  </div>
                  <div className="text-[11px] font-bold text-rose-600">
                    ❗ Not Delivered. Number Blocked by You
                  </div>
                </div>
              )}

              <p className="text-sm text-stone-700 leading-relaxed">
                {cutLooseModal.verdict.bestieNote}
              </p>

              {cutLooseModal.verdict.isActualTrap ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-900">
                    +25 Discernment XP Awarded • ❤️ Friday Night Heart Preserved!
                    {cutLooseModal.verdict.conspiracyClueId
                      ? ' • 🕵️ Table 9 Conspiracy Clue Logged!'
                      : ''}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          shareOrCopy({
                            title: 'Bullet Dodged Receipt',
                            text: cutLooseModal.verdict.receiptShareLine,
                            url: 'https://cougarsandcubs.club',
                          })
                        }
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#18101E] px-4 py-2 text-xs font-bold text-white cursor-pointer"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Share Receipt</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCutLooseModal(null)}
                        className="rounded-full border border-stone-300 px-4 py-2 text-xs font-bold text-stone-800 cursor-pointer"
                      >
                        Back to Connections
                      </button>
                    </div>
                    <a
                      href={MONETIZATION_CONFIG.tipJarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:underline"
                    >
                      <Heart className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>Support This Project</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCutLooseModal(null)}
                    className="rounded-full bg-[#18101E] px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
                  >
                    Keep Chatting (Listen to Bestie!)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onConfirmCutGenuine(cutLooseModal.leadId);
                      setCutLooseModal(null);
                    }}
                    className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-900 hover:bg-rose-100 cursor-pointer"
                  >
                    🚫 Block &amp; Unmatch Anyway
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
