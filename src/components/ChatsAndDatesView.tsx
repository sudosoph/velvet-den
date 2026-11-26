import React, { useEffect, useState } from 'react';
import {
  Flame,
  Flag,
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
  V35_DISCORD_CHANNELS,
  V35_TABLE_9_CONSPIRACY,
} from '../data/v35ChatsAndDates';
import type { WalletState } from '../domain/economy';
import { sfx } from '../lib/sound';
import { shareOrCopy } from '../lib/viral';
import { liveAiInboxService } from '../services/adapters';
import { DreamDaddyDateStage } from './DreamDaddyDateStage';

export interface ActiveMatchThread {
  leadId: string;
  originDoor: 'hinge' | 'wild';
  stage: 'app_dm' | 'imessage';
  currentBeat: number;
  chemistry: number;
  datesCompleted: number;
  sRankLockedOut?: boolean;
  messages: { sender: 'match' | 'player' | 'system'; text: string }[];
}

export function createInitialThread(
  leadId: string,
  originDoor: 'hinge' | 'wild',
  openerText?: string,
): ActiveMatchThread {
  const chapter = V35_CHAT_CHAPTERS[leadId];
  const stage: 'app_dm' | 'imessage' = originDoor === 'wild' ? 'imessage' : 'app_dm';
  const firstBeat = stage === 'imessage' ? chapter?.imessage[0] : chapter?.tinder[0];
  const seeded: { sender: 'match' | 'player' | 'system'; text: string }[] = [];

  if (openerText) {
    seeded.push({ sender: 'player', text: openerText });
  }
  for (const m of firstBeat?.incomingMessages ?? []) {
    seeded.push({ sender: 'match', text: m });
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
}

export const ChatsAndDatesView: React.FC<ChatsAndDatesViewProps> = ({
  role,
  wallet,
  threads,
  selectedLeadId,
  cutLooseIds,
  onSelectLead,
  onUpdateThread,
  onSpendCredits,
  onUnlockBucketItem,
  onCutLooseTrap,
  onConfirmCutGenuine,
  onLoseHeart,
  onRecordConspiracyClue,
  onOpenHinge,
}) => {
  const visibleThreads = threads.filter((t) => !cutLooseIds.includes(t.leadId));

  const [surface, setSurface] = useState<'dm' | 'discord' | 'conspiracy'>('dm');
  const [activeLeadId, setActiveLeadId] = useState<string>(
    selectedLeadId || visibleThreads[0]?.leadId || '',
  );
  const [activeDiscordId, setActiveDiscordId] = useState<string>(V35_DISCORD_CHANNELS[0].id);
  const [discordExtraMsgs, setDiscordExtraMsgs] = useState<
    Record<string, { sender: string; badge: string; text: string }[]>
  >({});
  const [spicyMode, setSpicyMode] = useState(false);
  const [freeInput, setFreeInput] = useState('');
  const [sendingAi, setSendingAi] = useState(false);
  const [coachBanner, setCoachBanner] = useState<string | null>(null);
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
    if (selectedLeadId && visibleThreads.some((t) => t.leadId === selectedLeadId)) {
      setActiveLeadId(selectedLeadId);
      setSurface('dm');
    } else if (!visibleThreads.some((t) => t.leadId === activeLeadId)) {
      setActiveLeadId(visibleThreads[0]?.leadId || '');
    }
  }, [selectedLeadId, visibleThreads, activeLeadId]);

  const currentThread = visibleThreads.find((t) => t.leadId === activeLeadId) ?? visibleThreads[0];
  const currentProfile = currentThread ? getCastProfileById(currentThread.leadId) : undefined;
  const currentChapter = currentThread ? V35_CHAT_CHAPTERS[currentThread.leadId] : undefined;

  if (activeDateModal) {
    const dateThread = threads.find((t) => t.leadId === activeDateModal.leadId);
    return (
      <DreamDaddyDateStage
        leadId={activeDateModal.leadId}
        dateNumber={activeDateModal.dateNumber}
        role={role}
        wallet={wallet}
        initialSRankLockedOut={dateThread?.sRankLockedOut}
        onCompleteDate={(leadId, dNum, _rank, lockedOut) => {
          const existing = threads.find((t) => t.leadId === leadId);
          if (existing) {
            onUpdateThread({
              ...existing,
              datesCompleted: Math.max(existing.datesCompleted, dNum),
              sRankLockedOut: lockedOut,
            });
          }
        }}
        onLoseHeart={onLoseHeart}
        onSpendCredits={onSpendCredits}
        onUnlockPov={(povId, cost) => onUnlockBucketItem('unlockedPovIds', povId, cost)}
        onUnlockEpilogue={(epId, cost) => onUnlockBucketItem('unlockedEpilogueIds', epId, cost)}
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
    if (!currentThread || !currentChapter) return;
    if (cost > 0 && !onSpendCredits(cost)) return;

    sfx.messagePop();
    const beatsArray =
      currentThread.stage === 'imessage' ? currentChapter.imessage : currentChapter.tinder;
    const nextBeatNum = currentThread.currentBeat + 1;
    const nextBeatObj = beatsArray.find((b) => b.beatNumber === nextBeatNum);

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
      chemistry: Math.max(0, Math.min(100, currentThread.chemistry + delta)),
      messages: appended,
    });
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
    if (!trimmed || !currentThread || !currentProfile || sendingAi) return;

    setSendingAi(true);
    setFreeInput('');
    try {
      const res = await liveAiInboxService.evaluateOpeningDm({
        personaId: currentProfile.id,
        personaName: currentProfile.name,
        personaAge: currentProfile.age,
        personaTitle: currentProfile.vitals.job,
        personaRole: currentProfile.role,
        platform: currentThread.stage === 'imessage' ? 'imessage' : 'tinder',
        playerMessage: trimmed,
        history: currentThread.messages
          .filter((m) => m.sender !== 'system')
          .map((m) => ({
            sender: m.sender === 'player' ? 'player' : 'match',
            text: m.text,
          })),
      });

      setCoachBanner(res.coachNote);
      onUpdateThread({
        ...currentThread,
        currentBeat: Math.min(7, currentThread.currentBeat + 1),
        chemistry: Math.max(0, Math.min(100, currentThread.chemistry + res.chemistryDelta)),
        messages: [
          ...currentThread.messages,
          { sender: 'player', text: trimmed },
          { sender: 'match', text: res.herReply },
        ],
      });
    } finally {
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

  const isDateReady =
    Boolean(currentThread) &&
    currentThread!.stage === 'imessage' &&
    (currentThread!.currentBeat >= 4 || currentThread!.originDoor === 'wild');

  const nextDateNumber = currentThread
    ? (Math.min(4, currentThread.datesCompleted + 1) as 1 | 2 | 3 | 4)
    : 1;

  const activeDiscord =
    V35_DISCORD_CHANNELS.find((c) => c.id === activeDiscordId) ?? V35_DISCORD_CHANNELS[0];

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

      {/* Top Mode Switcher: Active Matches vs Club Discord Lounge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-white border border-stone-200 p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setSurface('dm')}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
              surface === 'dm' ? 'bg-[#18101E] text-white' : 'text-stone-600'
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Matches &amp; Dates ({visibleThreads.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSurface('discord')}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
              surface === 'discord' ? 'bg-[#5865F2] text-white' : 'text-stone-600'
            }`}
          >
            <Hash className="h-3.5 w-3.5" />
            <span>🎭 Club Discord Lounge (5 Channels)</span>
          </button>
        </div>

        <div className="text-xs font-semibold text-stone-500">
          🕵️ Table 9 Clues: {wallet.conspiracyClues.length}/3 • Discernment XP: {wallet.discernmentXp}
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
          <aside className="editorial-hinge-card rounded-3xl p-4 space-y-1.5 bg-[#1E1F22] text-stone-200">
            <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
              Velvet Palms Server
            </div>
            {V35_DISCORD_CHANNELS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveDiscordId(ch.id)}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-xs font-bold transition cursor-pointer ${
                  activeDiscord.id === ch.id
                    ? 'bg-[#5865F2] text-white'
                    : 'text-stone-300 hover:bg-white/10'
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

            <div className="space-y-3">
              {[
                ...activeDiscord.seededMessages,
                ...(discordExtraMsgs[activeDiscord.id] || []),
              ].map((msg, idx) => (
                <div
                  key={`${msg.sender}-${idx}`}
                  data-testid={idx === 0 ? 'discord-first-message' : undefined}
                  className="rounded-2xl bg-stone-50 border border-stone-200/70 p-3.5 space-y-1"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#18101E]">
                    <span>{msg.sender}</span>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-800">
                      {msg.badge}
                    </span>
                  </div>
                  <p className="text-sm text-stone-800 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Full-Sentence Wrapped Channel Suggestions (Zero Truncation!) */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Drop into {activeDiscord.handleLabel}
              </div>
              <div className="grid gap-2">
                {(role === 'her'
                  ? activeDiscord.suggestionsHer
                  : activeDiscord.suggestionsHim
                ).map((sug, sIdx) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      sfx.messagePop();
                      if (activeDiscord.conspiracyClueId) {
                        onRecordConspiracyClue?.(activeDiscord.conspiracyClueId);
                      }
                      const reply =
                        activeDiscord.botReplies[sIdx % activeDiscord.botReplies.length];
                      setDiscordExtraMsgs((prev) => ({
                        ...prev,
                        [activeDiscord.id]: [
                          ...(prev[activeDiscord.id] || []),
                          {
                            sender: wallet.playerName || (role === 'her' ? 'You (Queen)' : 'You'),
                            badge: '✨ Member',
                            text: sug,
                          },
                          {
                            sender: reply.split(':')[0],
                            badge: '💬 Reply',
                            text: reply.split(':').slice(1).join(':').trim(),
                          },
                        ],
                      }));
                    }}
                    className="w-full rounded-2xl border border-stone-200 bg-white p-3.5 text-left text-xs sm:text-sm font-medium text-stone-800 whitespace-normal hover:border-indigo-400 hover:bg-indigo-50/30 transition cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
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
                    <div className="flex items-center gap-2">
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
                    </div>
                    <p className="text-xs text-stone-500">
                      {role === 'her'
                        ? 'He is courting your interest — vet his consistency or cut him loose.'
                        : 'Build genuine spark to earn her personal number & Friday date.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
              {isDateReady && (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50 border-b border-emerald-200 px-6 py-3">
                  <div className="text-xs sm:text-sm font-bold text-emerald-950">
                    🍸 Chemistry is high ({currentThread.chemistry}%) — Ready for Date #{nextDateNumber} with{' '}
                    {currentProfile.name}! (Or keep chatting freely below)
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveDateModal({
                        leadId: currentProfile.id,
                        dateNumber: nextDateNumber,
                      })
                    }
                    className="rounded-full bg-[#18101E] px-4 py-2 text-xs font-bold text-white cursor-pointer"
                  >
                    🍸 Go on Date #{nextDateNumber} →
                  </button>
                </div>
              )}

              {/* Message Stream */}
              <div className="max-h-[420px] overflow-y-auto p-6 space-y-3 bg-white">
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
                  return (
                    <div
                      key={`msg-${idx}`}
                      className={`flex ${isPlayer ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          isPlayer
                            ? currentThread.stage === 'imessage'
                              ? 'bg-[#007AFF] text-white'
                              : 'bg-[#18101E] text-white'
                            : 'bg-stone-100 text-stone-900'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}

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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                      <span>
                        Beat {currentThread.currentBeat} of 6 • Tap a reply or type anything freely
                        below
                      </span>
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
                            data-testid="chat-suggestion-btn"
                            onClick={() => handlePickChoice(c.text, c.reply, c.delta, cost)}
                            className={`w-full rounded-2xl p-3.5 text-left text-xs sm:text-sm whitespace-normal transition cursor-pointer ${
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
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white border border-stone-200 p-4">
                    <span className="text-xs sm:text-sm font-semibold text-stone-700">
                      All 6 vetting beats complete — keep free-chatting below or launch Date #{nextDateNumber}!
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDateModal({
                          leadId: currentProfile.id,
                          dateNumber: nextDateNumber,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#B83253] px-5 py-2 text-xs font-bold text-white cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Launch Date #{nextDateNumber} →</span>
                    </button>
                  </div>
                )}

                {/* Free-Typing Live AI Bar (0 Credits — Never Cuts Player Off!) */}
                <form onSubmit={handleFreeTextSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={freeInput}
                    onChange={(e) => setFreeInput(e.target.value)}
                    placeholder={`Type anything freely to ${currentProfile.name} (0 Cr)...`}
                    className="flex-1 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm text-[#18101E]"
                  />
                  <button
                    type="submit"
                    disabled={sendingAi}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#18101E] px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{sendingAi ? '...' : 'Send'}</span>
                  </button>
                </form>
              </div>
            </section>
          )}
        </div>
      )}

      {/* Cut-Loose Bullet-Dodged Receipt OR Bestie Self-Sabotage Check Modal */}
      {cutLooseModal && (
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
        </div>
      )}
    </div>
  );
};
