import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  Copy,
  Download,
  Heart,
  Link2,
  RotateCcw,
  Share2,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { V35_CAST_VISUALS } from '../data/v35AssetManifest';
import { awardPassportBonusXp } from '../lib/gamification';
import { downloadReceiptPng } from '../lib/receiptCanvas';
import { sfx } from '../lib/sound';
import { shareOrCopy } from '../lib/viral';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

export interface SyncDilemmaItem {
  id: string;
  badge: string;
  question: string;
  options: [string, string, string];
}

export const BLIND_SYNC_DILEMMAS: SyncDilemmaItem[] = [
  {
    id: 'sunday-morning-protocol',
    badge: '☕ Sunday 7:15 AM Rule',
    question: 'After an electric Saturday dinner and sleepover, what does ideal Sunday morning look like?',
    options: [
      'Stay tangled up until 11 AM and cook sourdough pancakes together',
      'Forehead kiss & iced espresso at 7:30 AM so Sunday stays solo robe & crossword time',
      '8 AM coastal walk or lap swim together, then separate afternoon errands',
    ],
  },
  {
    id: 'thermostat-sleep-truce',
    badge: '❄️ Sleep & Thermostat Truce',
    question: 'When it comes to bedroom temperature, blankets, and sleep quality, where do you land?',
    options: [
      '63°F crisp cotton percale sanctuary under one shared duvet',
      '67°F Scandinavian two-blanket setup so nobody plays tug-of-war at 3 AM',
      'Living Apart Together: keep two great apartments for sacred starfish-sleep nights',
    ],
  },
  {
    id: 'check-drop-choreography',
    badge: '🍸 Check-Drop Choreography',
    question: 'How should two adults with different career stages handle Friday dinner tabs?',
    options: [
      'Whoever invited covers dinner cleanly, and the other grabs cocktails next door',
      'Alternate full date nights back-and-forth with zero itemized receipt math',
      'Higher earner covers splurge spots while the other plans & hosts thoughtful home nights',
    ],
  },
  {
    id: 'public-launch-pace',
    badge: '🥂 Inner-Circle Launch',
    question: 'Chemistry is undeniable at Month 1. How fast do you merge friend groups?',
    options: [
      'Bring them to the next dinner party proudly with zero caveats or coaching',
      'Keep the first 60 days as our private two-person bubble before group hangs',
      'Meet the two closest best friends over casual drinks first, zero social-media pressure',
    ],
  },
  {
    id: 'roadtrip-era-queue',
    badge: '🎵 Weekend Aux Rule',
    question: 'Three-hour coastal drive to Santa Barbara or Napa: who controls the speakers?',
    options: [
      'Rumours vinyl classics and 90s R&B first, modern indie second',
      'Strictly alternating three-song blocks with zero skipping each other’s era',
      'Half music, half trading life stories with phones tucked in the glovebox',
    ],
  },
];

interface CastPartnerPreset {
  id: string;
  name: string;
  age: number;
  vibe: string;
  answers: [number, number, number, number, number];
}

const SOLO_CAST_PARTNERS: CastPartnerPreset[] = [
  {
    id: 'julian',
    name: 'Julian',
    age: 27,
    vibe: 'London Archivist',
    answers: [0, 0, 2, 2, 0],
  },
  {
    id: 'claire',
    name: 'Claire',
    age: 41,
    vibe: 'M&A Partner',
    answers: [1, 0, 0, 0, 2],
  },
  {
    id: 'sienna',
    name: 'Sienna',
    age: 39,
    vibe: 'Architectural Designer',
    answers: [2, 2, 0, 2, 0],
  },
  {
    id: 'miles',
    name: 'Miles',
    age: 25,
    vibe: 'Roastery Founder',
    answers: [2, 1, 1, 0, 1],
  },
  {
    id: 'marcus',
    name: 'Marcus',
    age: 29,
    vibe: 'Firefighter Paramedic',
    answers: [0, 0, 0, 0, 2],
  },
  {
    id: 'elena',
    name: 'Elena',
    age: 44,
    vibe: 'Literature Chair',
    answers: [1, 2, 0, 1, 0],
  },
];

export function computeBlindSyncResult(
  answersA: number[],
  answersB: number[],
): {
  syncPercent: number;
  verdictTitle: string;
  verdictSummary: string;
  matchedTopics: string[];
  frictionTopics: string[];
} {
  let points = 0;
  const matchedTopics: string[] = [];
  const frictionTopics: string[] = [];

  BLIND_SYNC_DILEMMAS.forEach((item, idx) => {
    const a = answersA[idx] ?? 0;
    const b = answersB[idx] ?? 0;
    if (a === b) {
      points += 20;
      matchedTopics.push(item.badge);
    } else if (Math.abs(a - b) === 1) {
      points += 10;
      frictionTopics.push(item.badge);
    } else {
      points += 4;
      frictionTopics.push(item.badge);
    }
  });

  const syncPercent = Math.min(100, Math.max(20, points));
  if (syncPercent >= 80) {
    return {
      syncPercent,
      verdictTitle: 'Table 1 Natural Rhythm',
      verdictSummary:
        'Effortless alignment on boundaries, check-drops, and sleep sanctuaries. Book the weekend bag now.',
      matchedTopics,
      frictionTopics,
    };
  }
  if (syncPercent >= 55) {
    return {
      syncPercent,
      verdictTitle: 'Magnetic Slow-Burn Pair',
      verdictSummary:
        'Strong core chemistry with just enough contrast to keep Friday banter lively. Negotiate the thermostat early!',
      matchedTopics,
      frictionTopics,
    };
  }
  return {
    syncPercent,
    verdictTitle: 'Spicy Opposites Alert',
    verdictSummary:
      'High-voltage attraction, opposite Sunday habits. Establish clear ground rules over martinis before a weekend trip.',
    matchedTopics,
    frictionTopics,
  };
}

export function encodeBlindSyncChallenge(answers: number[], senderName = 'Your Match'): string {
  const digits = answers
    .slice(0, 5)
    .map((n) => (n === 0 || n === 1 || n === 2 ? String(n) : '0'))
    .join('');
  const cleanName = senderName.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 20) || 'Match';
  return `${digits}-${encodeURIComponent(cleanName)}`;
}

export function decodeBlindSyncChallenge(
  raw: string | null | undefined,
): { answers: [number, number, number, number, number]; senderName: string } | null {
  if (!raw) return null;
  const match = raw.trim().match(/^([012]{5})(?:-(.+))?$/);
  if (!match) return null;
  const digits = match[1].split('').map((d) => Number(d)) as [
    number,
    number,
    number,
    number,
    number,
  ];
  let senderName = 'Your Match';
  if (match[2]) {
    try {
      senderName = decodeURIComponent(match[2]).slice(0, 24) || 'Your Match';
    } catch {
      senderName = 'Your Match';
    }
  }
  return { answers: digits, senderName };
}

export interface CouplesBlindSyncModalProps {
  open: boolean;
  initialSyncChallenge?: string | null;
  playerName?: string;
  onClose: () => void;
}

export const CouplesBlindSyncModal: React.FC<CouplesBlindSyncModalProps> = ({
  open,
  initialSyncChallenge = null,
  playerName = '',
  onClose,
}) => {
  const decodedIncoming = decodeBlindSyncChallenge(initialSyncChallenge);
  const [mode, setMode] = useState<'pass_phone' | 'solo_cast'>('pass_phone');
  const [selectedCastId, setSelectedCastId] = useState<string>('julian');
  const [phase, setPhase] = useState<'p1' | 'handoff' | 'p2' | 'result'>(() =>
    decodedIncoming ? 'p2' : 'p1',
  );
  const [qIdx, setQIdx] = useState(0);
  const [p1Answers, setP1Answers] = useState<number[]>(() =>
    decodedIncoming ? [...decodedIncoming.answers] : [],
  );
  const [p2Answers, setP2Answers] = useState<number[]>([]);
  const [copiedAsyncLink, setCopiedAsyncLink] = useState(false);
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  if (!open) return null;

  const activeCast =
    SOLO_CAST_PARTNERS.find((c) => c.id === selectedCastId) ?? SOLO_CAST_PARTNERS[0];
  const currentQ = BLIND_SYNC_DILEMMAS[qIdx];

  const resetAll = (nextMode: 'pass_phone' | 'solo_cast' = mode) => {
    setMode(nextMode);
    setPhase('p1');
    setQIdx(0);
    setP1Answers([]);
    setP2Answers([]);
  };

  const handleSelectOption = (optIdx: number) => {
    sfx.messagePop();
    if (phase === 'p1') {
      const nextA = [...p1Answers, optIdx];
      setP1Answers(nextA);
      if (qIdx + 1 < BLIND_SYNC_DILEMMAS.length) {
        setQIdx(qIdx + 1);
      } else if (mode === 'solo_cast') {
        setP2Answers([...activeCast.answers]);
        setPhase('result');
        sfx.victoryFanfare();
        awardPassportBonusXp('blind_sync_complete', 15, 'Blind Sync Decoded!', '💘 +15 XP');
      } else {
        setPhase('handoff');
      }
      return;
    }

    if (phase === 'p2') {
      const nextB = [...p2Answers, optIdx];
      setP2Answers(nextB);
      if (qIdx + 1 < BLIND_SYNC_DILEMMAS.length) {
        setQIdx(qIdx + 1);
      } else {
        setPhase('result');
        sfx.victoryFanfare();
        awardPassportBonusXp('blind_sync_complete', 15, '2-Player Sync Complete!', '💘 +15 XP');
      }
    }
  };

  const result =
    phase === 'result' ? computeBlindSyncResult(p1Answers, p2Answers) : null;

  const partnerLabel =
    mode === 'solo_cast'
      ? `${activeCast.name}, ${activeCast.age}`
      : decodedIncoming
        ? decodedIncoming.senderName
        : 'Partner B';

  const modalNode = (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/60 p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Couples & Cast Blind Sync Check"
        onClick={onClose}
      >
        <div
          data-testid="couples-blind-sync-modal"
          className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="shrink-0 border-b border-zinc-200 bg-white px-5 py-4 sm:px-6 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white">
                  <Users className="h-4 w-4" />
                </span>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-950">
                  5-Round Blind Sync Check
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Blind Sync"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1">
              <button
                type="button"
                onClick={() => resetAll('pass_phone')}
                className={`rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  mode === 'pass_phone'
                    ? 'bg-white font-semibold text-zinc-950 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                👫 2-Player Pass Phone
              </button>
              <button
                type="button"
                onClick={() => resetAll('solo_cast')}
                className={`rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  mode === 'solo_cast'
                    ? 'bg-white font-semibold text-zinc-950 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                💘 Solo vs. Sunset Hills Lead
              </button>
            </div>

            {mode === 'solo_cast' && phase === 'p1' && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {SOLO_CAST_PARTNERS.map((cast) => {
                  const vis = V35_CAST_VISUALS[cast.id];
                  const active = cast.id === selectedCastId;
                  return (
                    <button
                      key={cast.id}
                      type="button"
                      onClick={() => {
                        setSelectedCastId(cast.id);
                        setQIdx(0);
                        setP1Answers([]);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                        active
                          ? 'border-zinc-950 bg-zinc-950 text-white'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      {vis && (
                        <img
                          src={vis.primaryPortrait}
                          alt={cast.name}
                          className="h-4 w-4 rounded-full object-cover"
                        />
                      )}
                      <span>
                        {cast.name}, {cast.age}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-5 bg-zinc-50/70">
            {phase === 'handoff' ? (
              <div
                data-testid="blind-sync-handoff"
                className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 text-center space-y-4 shadow-2xs"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <Heart className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    ✓ Partner A Answers Locked &amp; Hidden
                  </span>
                  <h3 className="pt-2 text-xl font-bold text-zinc-950">
                    Hand the Phone to Partner B
                  </h3>
                  <p className="text-sm text-zinc-600 max-w-md mx-auto">
                    Partner A’s choices are sealed. Partner B answers the same 5 dilemmas next to reveal your real compatibility receipt.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.messagePop();
                      setQIdx(0);
                      setPhase('p2');
                    }}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-5 text-xs sm:text-sm font-semibold text-white transition cursor-pointer"
                  >
                    <span>Start Partner B’s Turn Here</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    data-testid="copy-async-sync-link-btn"
                    onClick={async () => {
                      const code = encodeBlindSyncChallenge(
                        p1Answers,
                        playerName || 'Your Crush',
                      );
                      const origin =
                        typeof window !== 'undefined' && window.location.origin.startsWith('http')
                          ? window.location.origin
                          : 'https://cougarsandcubs.club';
                      const asyncUrl = `${origin}/?sync=${code}`;
                      await shareOrCopy({
                        title: '5-Round Cougars & Cubs Blind Sync Challenge',
                        text: 'I locked my 5 relationship answers. Tap yours to see our Compatibility % 👀',
                        url: asyncUrl,
                      });
                      setCopiedAsyncLink(true);
                    }}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 px-4 text-xs sm:text-sm font-semibold text-zinc-900 transition cursor-pointer"
                  >
                    {copiedAsyncLink ? (
                      <>
                        <Copy className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Challenge Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="h-3.5 w-3.5 text-rose-600" />
                        <span>Text Link to Their Phone</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : phase === 'result' && result ? (
              <div
                data-testid="blind-sync-result-card"
                className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-5 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div className="space-y-1">
                    <span className="rounded-md bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                      You × {partnerLabel}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-950">
                      {result.verdictTitle}
                    </h3>
                    <p className="text-sm text-zinc-600">{result.verdictSummary}</p>
                  </div>
                  <div className="flex h-18 w-18 shrink-0 flex-col items-center justify-center rounded-2xl bg-zinc-950 text-white">
                    <span className="text-xl font-extrabold">{result.syncPercent}%</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-300">
                      Sync
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {BLIND_SYNC_DILEMMAS.map((item, idx) => {
                    const aIdx = p1Answers[idx] ?? 0;
                    const bIdx = p2Answers[idx] ?? 0;
                    const matched = aIdx === bIdx;
                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border p-3.5 text-xs space-y-1.5 ${
                          matched
                            ? 'border-emerald-200 bg-emerald-50/50'
                            : 'border-zinc-200 bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 font-semibold text-zinc-900">
                          <span>{item.badge}</span>
                          <span
                            className={
                              matched ? 'text-emerald-700 font-bold' : 'text-amber-700 font-semibold'
                            }
                          >
                            {matched ? '✓ Exact Match' : '⚡ Negotiate Over Drinks'}
                          </span>
                        </div>
                        {matched ? (
                          <p className="text-zinc-700">Both picked: “{item.options[aIdx]}”</p>
                        ) : (
                          <div className="space-y-0.5 text-zinc-600">
                            <div>
                              <strong className="text-zinc-900">You:</strong> {item.options[aIdx]}
                            </div>
                            <div>
                              <strong className="text-zinc-900">{partnerLabel}:</strong>{' '}
                              {item.options[bIdx]}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => resetAll(mode)}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-4 text-xs sm:text-sm font-semibold text-zinc-800 cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Play Again</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        downloadReceiptPng({
                          badge: '5-Round Blind Sync Receipt',
                          bigStat: `${result.syncPercent}%`,
                          verdictLabel: `You × ${partnerLabel} · ${result.verdictTitle}`,
                          title: result.verdictSummary,
                          bullets: [
                            result.matchedTopics.length > 0
                              ? `Aligned On: ${result.matchedTopics.join(', ')}`
                              : 'Zero Identical Picks: Pure Opposites Voltage',
                            result.frictionTopics.length > 0
                              ? `Negotiate Over Drinks: ${result.frictionTopics.join(', ')}`
                              : '100% Clean Sweep Across All 5 Dilemmas',
                          ],
                          filename: `blind-sync-${result.syncPercent}.png`,
                        })
                      }
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3.5 text-xs sm:text-sm font-semibold text-zinc-800 cursor-pointer"
                    >
                      <Download className="h-4 w-4 text-rose-600" />
                      <span>PNG Card</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      const shareText = `💘 Scored ${result.syncPercent}% (${result.verdictTitle}) with ${partnerLabel} on the Cougars & Cubs 5-Round Blind Sync Check!`;
                      const url = 'https://cougarsandcubs.club';
                      await shareOrCopy({
                        title: 'Cougars & Cubs Blind Sync Receipt',
                        text: shareText,
                        url,
                      });
                      setSharePayload({
                        title: `${result.syncPercent}% Blind Sync Receipt`,
                        message: shareText,
                        url,
                        shareSurface: 'verdict_receipt',
                      });
                    }}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-4 text-xs sm:text-sm font-semibold text-white cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share Sync Receipt</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                  <span className="rounded-md bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-rose-700">
                    {mode === 'pass_phone'
                      ? phase === 'p1'
                        ? 'Partner A’s Turn'
                        : 'Partner B’s Turn'
                      : `Comparing Against ${activeCast.name}, ${activeCast.age}`}
                  </span>
                  <span className="text-zinc-500">
                    Round {qIdx + 1} of {BLIND_SYNC_DILEMMAS.length} · {currentQ.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-zinc-950 leading-snug">
                  {currentQ.question}
                </h3>

                <div className="grid gap-2.5">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={opt}
                      type="button"
                      data-testid={`blind-sync-opt-${idx}`}
                      onClick={() => handleSelectOption(idx)}
                      className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white hover:border-zinc-900 hover:bg-zinc-50 p-3.5 text-left text-sm font-medium text-zinc-900 transition cursor-pointer"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-xs font-bold text-zinc-800">
                        {['A', 'B', 'C'][idx]}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-zinc-500">
                  <Sparkles className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span>
                    {mode === 'pass_phone'
                      ? 'Answers stay hidden until both partners finish Round 5.'
                      : `${activeCast.name}’s real preferences reveal right after Round 5.`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
