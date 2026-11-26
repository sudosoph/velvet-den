import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Flame,
  Flag,
  GraduationCap,
  Hash,
  Heart,
  Lock,
  MessageCircle,
  Send,
  Share2,
  Smartphone,
  Sparkles,
  Unlock,
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
import type { WalletState } from '../domain/economy';
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
  messages: { sender: 'match' | 'player' | 'system'; text: string }[];
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
}) => {
  const visibleThreads = useMemo(
    () => threads.filter((t) => !cutLooseIds.includes(t.leadId)),
    [threads, cutLooseIds],
  );
  const etiquetteBonusActive = cubSchoolStars >= 4;

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
  const [coachBanner, setCoachBanner] = useState<string | null>(null);

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

  // Always auto-scroll 1-on-1 DM feed to the newest message / typing bubble so replies are never hidden off-screen
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
    const boostedDelta = delta > 0 && etiquetteBonusActive ? delta + 4 : delta;
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
    if (!currentThread || !currentChapter) return;
    sfx.victoryFanfare();
    const firstImessage = currentChapter.imessage[0];
    const gradMsg =
      role === 'her'
        ? '📱 You shared your personal number — thread upgraded to iMessage.'
        : '📱 Number earned — thread upgraded to off-app iMessage.';
    onUpdateThread({
      ...currentThread,
      stage: 'imessage',
      currentBeat: 1,
      chemistry: Math.min(100, currentThread.chemistry + 10),
      messages: [
        ...currentThread.messages,
        { sender: 'system', text: gradMsg },
        ...(firstImessage?.incomingMessages.map((m) => ({ sender: 'match' as const, text: m })) ?? []),
      ],
    });
  };

  const handleFreeTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = freeInput.trim();
    if (!trimmed || !currentThread || !currentProfile || sendingAi || dmTypingLabel) return;

    const targetLeadId = currentThread.leadId;
    const historySnapshot = currentThread.messages
      .filter((m) => m.sender !== 'system')
      .map((m) => ({
        sender: (m.sender === 'player' ? 'player' : 'match') as 'player' | 'match',
        text: m.text,
      }));

    sfx.messagePop();
    setSendingAi(true);
    setFreeInput('');

    // Show the player's own message immediately + typing indicator right away!
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
          personaLore: `${currentProfile.tagline} ${currentProfile.trapTellSummary || currentProfile.vulnerabilityNote || ''}`.trim(),
          platform: currentThread.stage === 'imessage' ? 'imessage' : 'tinder',
          playerMessage: trimmed,
          history: historySnapshot,
        }),
        minHumanBeat,
      ]);

      sfx.messagePop();
      setCoachBanner(res.coachNote);
      setSparkToast({ delta: res.chemistryDelta, nonce: Date.now() });

      const latest =
        latestThreadRef.current?.leadId === targetLeadId ? latestThreadRef.current : withPlayerMsg;
      onUpdateThread({
        ...latest,
        currentBeat: latest.currentBeat,
        chemistry: Math.max(0, Math.min(100, latest.chemistry + res.chemistryDelta)),
        messages: [...latest.messages, { sender: 'match', text: res.herReply }],
      });
    } finally {
      setDmTypingLabel(null);
      setSendingAi(false);
    }
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

        <div className="text-xs font-medium text-zinc-500">
          Table 9 Clues: {wallet.conspiracyClues.length}/3 • Discernment XP: {wallet.discernmentXp}
        </div>
      </div>

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

          {/* Single Evolving Thread Stage */}
          {currentThread && currentProfile && currentChapter && (
            <section className="editorial-hinge-card rounded-3xl overflow-hidden">
              {/* Thread Header with Stage Badge & Persistent Cut-Loose Button */}
              <header
                className={`flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b ${
                  currentThread.stage === 'imessage'
                    ? 'bg-gradient-to-r from-blue-50/90 to-sky-50/60 border-blue-100'
                    : 'bg-stone-50/80 border-stone-200/70'
                }`}
              >
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
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          currentThread.stage === 'imessage'
                            ? 'bg-[#007AFF] text-white'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        <Smartphone className="h-3 w-3" />
                        <span>
                          {currentThread.stage === 'imessage'
                            ? 'Earned iMessage'
                            : 'Hinge App DM'}
                        </span>
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
                        ? 'He is courting your interest — vet his consistency or cut him loose.'
                        : 'Build genuine spark to earn her personal number & Friday date.'}
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

                  {currentThread.stage === 'imessage' && (
                    <button
                      type="button"
                      onClick={() => setSpicyMode((s) => !s)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                        spicyMode
                          ? 'bg-rose-600 text-white'
                          : 'bg-white border border-stone-200 text-stone-700'
                      }`}
                    >
                      <Flame className="h-3.5 w-3.5" />
                      <span>After-Dark Mode</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleTriggerCutLoose}
                    className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-300 px-3.5 py-1.5 text-xs font-bold text-rose-900 hover:bg-rose-100 cursor-pointer"
                  >
                    <Flag className="h-3.5 w-3.5 text-rose-700" />
                    <span>🚩 Cut Loose</span>
                  </button>
                </div>
              </header>

              {/* Non-Blocking Go On Date Banner */}
              {isDateReady && nextDateScript && (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50 border-b border-emerald-200 px-6 py-3">
                  <div className="text-xs sm:text-sm font-bold text-emerald-950">
                    🍸 Chemistry is high ({currentThread.chemistry}%) — Ready for{' '}
                    {nextDateScript.dateNumber === 4
                      ? 'Velvet Cut Weekend Epilogue (Date #4)'
                      : `Date #${nextDateScript.dateNumber}`}{' '}
                    with {currentProfile.name}! (Or keep chatting freely below)
                  </div>
                  <button
                    type="button"
                    onClick={() => launchDateWithGate(currentProfile.id, nextDateScript)}
                    className="rounded-full bg-[#18101E] px-4 py-2 text-xs font-bold text-white cursor-pointer"
                  >
                    {nextDateScript.dateNumber === 4
                      ? `🌙 Velvet Cut Epilogue (${
                          wallet.isVip ||
                          wallet.isFounderUnlimited ||
                          wallet.unlockedEpilogueIds.includes(`${currentProfile.id}-epilogue-4`)
                            ? 'Ready'
                            : '3 Cr'
                        }) →`
                      : `🍸 Go on Date #${nextDateScript.dateNumber} →`}
                  </button>
                </div>
              )}

              {/* Message Stream (Auto-Scrolls to Latest Message + Live Typing Indicator + iMessage Tapbacks) */}
              <div
                ref={dmFeedRef}
                data-testid="dm-message-feed"
                className="max-h-[440px] overflow-y-auto scroll-smooth p-6 space-y-3.5 bg-white"
              >
                {currentThread.messages.map((m, idx) => {
                  if (m.sender === 'system') {
                    return (
                      <div
                        key={`sys-${idx}`}
                        className="mx-auto max-w-md rounded-full bg-stone-100 px-4 py-1.5 text-center text-xs font-semibold text-stone-600"
                      >
                        {m.text}
                      </div>
                    );
                  }
                  const isPlayer = m.sender === 'player';
                  const msgKey = `${currentThread.leadId}-${idx}`;
                  const activeTapback = dmReactions[msgKey];
                  return (
                    <div
                      key={`msg-${idx}`}
                      className={`group flex flex-col ${isPlayer ? 'items-end' : 'items-start'}`}
                    >
                      <div className="relative max-w-[82%]">
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            isPlayer
                              ? currentThread.stage === 'imessage'
                                ? 'bg-[#007AFF] text-white'
                                : 'bg-[#18101E] text-white'
                              : 'bg-zinc-100 text-zinc-900 border border-zinc-200/60'
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
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-zinc-100 border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-600">
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" />
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:240ms]" />
                      </span>
                      <span>{dmTypingLabel}…</span>
                    </div>
                  </div>
                )}

                {/* Blurred Off-App / Candid Photo Drop on Beat 4 */}
                {activeBeat?.photoDrop && (
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 space-y-2.5 max-w-sm">
                    <div className="text-xs font-bold text-stone-700">
                      📸 {activeBeat.photoDrop.previewCaption}
                    </div>
                    {wallet.isVip ||
                    wallet.unlockedPhotoIds.includes(activeBeat.photoDrop.id) ? (
                      <img
                        src={activeBeat.photoDrop.imageUrl}
                        alt={activeBeat.photoDrop.previewCaption}
                        className="h-56 w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={activeBeat.photoDrop.imageUrl}
                          alt="Blurred candid"
                          className="h-48 w-full object-cover blur-lg scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                          <button
                            type="button"
                            onClick={() => {
                              onUnlockBucketItem(
                                'unlockedPhotoIds',
                                activeBeat.photoDrop!.id,
                                activeBeat.photoDrop!.unlockCost,
                              );
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#18101E] shadow-md cursor-pointer"
                          >
                            <Lock className="h-3.5 w-3.5 text-rose-700" />
                            <span>Unblur Candid Photo (2 Cr)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {coachBanner && (
                <div className="bg-amber-50/90 border-t border-amber-200 px-6 py-2 text-xs font-semibold text-amber-950">
                  💡 {coachBanner}
                </div>
              )}

              {/* Beat 6 Asymmetric Graduation Gate OR Wrapped Full-Sentence Suggestions */}
              <div className="border-t border-stone-200/80 bg-stone-50/60 p-5 space-y-4">
                {isReadyToGraduate ? (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 space-y-3">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                      {role === 'her'
                        ? `Beat 6 Decision • Does ${currentProfile.name} Get Your Personal Number?`
                        : `Beat 6 Graduation • Move Off Hinge to Blue-Bubble iMessage!`}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleGraduateToImessage}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#007AFF] px-5 py-2.5 text-xs sm:text-sm font-bold text-white cursor-pointer"
                      >
                        <Unlock className="h-4 w-4" />
                        <span>
                          {role === 'her'
                            ? '📱 Give Him My Number (Move to iMessage)'
                            : '📱 Save Her Number (Move to iMessage)'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={handleTriggerCutLoose}
                        className="rounded-full border border-rose-300 bg-white px-4 py-2.5 text-xs font-bold text-rose-900 cursor-pointer"
                      >
                        🚩 Cut Loose Instead
                      </button>
                    </div>
                  </div>
                ) : spicyMode && currentThread.stage === 'imessage' ? (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-rose-800">
                      🔥 After-Dark Spicy Suggestions (Tap to send)
                    </div>
                    <div className="grid gap-2">
                      {currentChapter.spicySuggestions.map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          data-testid="chat-suggestion-btn"
                          onClick={() =>
                            handlePickChoice(
                              sp,
                              'Careful—keep talking like that and Friday starts an hour early ✨',
                              18,
                              0,
                            )
                          }
                          className="w-full rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 text-left text-xs sm:text-sm font-semibold text-rose-950 whitespace-normal hover:bg-rose-100 transition cursor-pointer"
                        >
                          {sp}
                        </button>
                      ))}
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
                          Beat {currentThread.currentBeat} of 6 →{' '}
                          {currentThread.stage === 'app_dm'
                            ? 'Graduate to iMessage'
                            : 'Unlock Friday Date'}
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
                            disabled={Boolean(dmTypingLabel)}
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
                ) : nextDateScript ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white border border-stone-200 p-4">
                    <span className="text-xs sm:text-sm font-semibold text-stone-700">
                      All 6 vetting beats complete — keep free-chatting below or launch{' '}
                      {nextDateScript.dateNumber === 4
                        ? 'Velvet Cut Epilogue (Date #4)'
                        : `Date #${nextDateScript.dateNumber}`}
                      !
                    </span>
                    <button
                      type="button"
                      onClick={() => launchDateWithGate(currentProfile.id, nextDateScript)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#B83253] px-5 py-2 text-xs font-bold text-white cursor-pointer"
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
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white border border-stone-200 p-4 text-xs sm:text-sm font-semibold text-stone-700">
                    All scripted chapters with {currentProfile.name} complete — keep chatting freely anytime below!
                  </div>
                )}

                {/* Free-Typing Live AI Bar (0 Credits — Never Cuts Player Off!) */}
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

      {/* Cut-Loose Bullet-Dodged Receipt OR Bestie Self-Sabotage Check Modal */}
      {cutLooseModal &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4">
              <h3 className="font-editorial text-2xl font-bold text-[#18101E]">
                {cutLooseModal.verdict.headline}
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed">
                {cutLooseModal.verdict.bestieNote}
              </p>

              {cutLooseModal.verdict.isActualTrap ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-900">
                    +25 Discernment XP Awarded • ❤️ Friday Night Heart Preserved!
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
                      <span>💛 Support This Project</span>
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
                    className="rounded-full border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-600 cursor-pointer"
                  >
                    Unmatch Anyway
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
