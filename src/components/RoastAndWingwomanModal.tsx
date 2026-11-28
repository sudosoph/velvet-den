import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  Copy,
  Crown,
  Download,
  Flame,
  Lock,
  MessageSquareWarning,
  Share2,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';
import type { WalletState } from '../domain/economy';
import type { PlayerRole } from '../domain/taxonomy';
import { getPostHogTracingHeaders, trackEvent } from '../lib/analytics';
import { awardPassportBonusXp } from '../lib/gamification';
import { downloadReceiptPng } from '../lib/receiptCanvas';
import { sfx } from '../lib/sound';
import { shareOrCopy } from '../lib/viral';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

export type WingwomanToolMode =
  | 'roast_opener'
  | 'decode_text'
  | 'fix_bio'
  | 'friday_plan';

export interface RoastUtilityResult {
  score: number;
  verdictBadge: string;
  panelSpeaker: string;
  roastRead: string;
  upgradedRewrite: string;
  whyItWorks: string;
}

const FREE_ROAST_STORAGE_KEY = 'cc_free_roast_runs_v1';
export const MAX_FREE_ROAST_RUNS = 2;

export function getFreeRoastRunsUsed(): number {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return 0;
    const n = Number(window.localStorage.getItem(FREE_ROAST_STORAGE_KEY) || '0');
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

function incrementFreeRoastRunsUsed(): number {
  const next = getFreeRoastRunsUsed() + 1;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(FREE_ROAST_STORAGE_KEY, String(next));
    }
  } catch {
    // Ignore storage block
  }
  return next;
}

export function evaluateRoastLocally(
  tool: WingwomanToolMode,
  input: string,
  role: PlayerRole,
): RoastUtilityResult {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  if (tool === 'roast_opener') {
    if (/for your age|for ur age|bucket list|never been with a cougar|milf|mommy/i.test(lower)) {
      return {
        score: 8,
        verdictBadge: '🚫 INSTANT UNMATCH',
        panelSpeaker: 'Claire, 46 (M&A Partner) & Prof. Elena, 44',
        roastRead:
          'You managed to pack a backhanded age reminder AND a bucket-list fetish cliché into a single sentence. She blocked you before finishing her espresso.',
        upgradedRewrite:
          role === 'him'
            ? 'Your Sancerre hot take made me laugh out loud. Free for a proper 7:30 Thursday glass at a quiet spot?'
            : 'Bold claim on your second prompt, prove you can back that banter up over a Thursday drink.',
        whyItWorks:
          'Drops the age-fetish cliché completely, hooks onto a specific profile detail, and proposes an unhurried adult plan.',
      };
    }

    if (/\b(snap|snapchat|wyd|u up|hey beautiful|hey gorgeous|^hey$|^hi$)\b/i.test(lower) || trimmed.length < 16) {
      return {
        score: 19,
        verdictBadge: '😬 ZERO-EFFORT FUMBLE',
        panelSpeaker: 'Sienna, 39 & Julian, 27',
        roastRead:
          'Asking for Snapchat or dropping a two-word "hey beautiful" reads like 200 copy-pasted dorm DMs. Grown adults trade real conversation and real numbers.',
        upgradedRewrite:
          role === 'him'
            ? 'Okay that travel story deserves its own cocktail. What is your go-to neighborhood wine bar this week?'
            : 'You look dangerously capable of surviving a dinner party without checking sports scores. True or false?',
        whyItWorks:
          'Playful challenge + specific curiosity gives them an easy, fun hook to bat right back.',
      };
    }

    if (trimmed.length > 210) {
      return {
        score: 46,
        verdictBadge: '📜 DAY-ONE ESSAY OVERLOAD',
        panelSpeaker: 'Priya, 36 (Charge Trauma RN)',
        roastRead:
          'Sweet heart, way too many words before Message #1! Sending a three-paragraph monologue before she even says hello triggers instant intensity alarm bells.',
        upgradedRewrite:
          'Love that detail on your third photo. Tell me the two-sentence story behind it over a drink Thursday?',
        whyItWorks:
          'Cuts the nervous over-explaining by 75% so your confidence breathes.',
      };
    }

    return {
      score: 86,
      verdictBadge: '🥂 TABLE 1 CONTENDER',
      panelSpeaker: 'Claire, 46 & Julian, 27',
      roastRead:
        'Warm, specific, and zero cringe buzzwords! Just tighten the ending hook by ten percent so replying feels effortless.',
      upgradedRewrite: `${trimmed.replace(/[.!?]+$/, '')}. Want to test that chemistry over a 7:30 Thursday drink?`,
      whyItWorks:
        'Pairs your natural voice with calm, decisive forward momentum.',
    };
  }

  if (tool === 'decode_text') {
    if (/6:?30|6:?45|5:?15|call running late|travel phone|notifications off|practically divorced/i.test(lower)) {
      return {
        score: 14,
        verdictBadge: '🚨 MARRIED ALIBI ALERT',
        panelSpeaker: 'Priya, 36 & Jade, 42',
        roastRead:
          'Strict early-evening curfews, muted notifications after 6:30 PM, and "practically divorced" disclaimers mean someone is making dinner in their kitchen right now.',
        upgradedRewrite:
          'Give me a shout once you are free for a normal 8 PM Friday dinner with phones on the table.',
        whyItWorks:
          'Tests evening/weekend availability in one calm sentence without wasting your Friday night.',
      };
    }

    if (/sounds good\.|ok\.|great\.|👍|k\b/i.test(trimmed) && trimmed.length < 36) {
      return {
        score: 91,
        verdictBadge: '💚 GEN-X GREEN LIGHT (DO NOT SPIRAL)',
        panelSpeaker: 'Prof. Elena, 44',
        roastRead:
          'Put your phone down and stop overthinking! To an accomplished 40+ adult between meetings, "Sounds good." with a period or a thumbs-up literally means "Great, locked in, excited for Friday."',
        upgradedRewrite:
          'Perfect, locked in for 7:30 Friday! I will text you the table confirmation around noon.',
        whyItWorks:
          'Matches her calm certainty instead of asking "wait are you mad at me??"',
      };
    }

    if (/play it by ear|crazy week|maybe next|let you know/i.test(lower)) {
      return {
        score: 38,
        verdictBadge: '🟡 LOW-PRIORITY BREADCRUMB',
        panelSpeaker: 'Claire, 46',
        roastRead:
          '"Let’s play Friday by ear" means you are currently Backup Option B if their other plan falls through. Never hold your Friday hostage.',
        upgradedRewrite:
          'Totally get busy weeks! My Friday is filling up, so reach out next week when your schedule clears and we will lock a real night.',
        whyItWorks:
          'Warmly withdraws your Friday availability and signals high self-respect.',
      };
    }

    return {
      score: 79,
      verdictBadge: '✨ WARM OPEN DOOR',
      panelSpeaker: 'Sienna, 39 & Miles, 31',
      roastRead:
        'Genuine interest with room for you to lead the pace. Don’t stay stuck in pen-pal mode for ten days.',
      upgradedRewrite:
        'Love hearing that. Let’s continue this in person Thursday at 7:30, wine or espresso martinis?',
      whyItWorks:
        'Pivots warm banter cleanly into a concrete date.',
    };
  }

  if (tool === 'fix_bio') {
    const hasCringe = /fluent in sarcasm|partner in crime|just ask|idk what to write|pineapple on pizza|looking for a cougar|sugar/i.test(
      lower,
    );
    return {
      score: hasCringe ? 31 : 78,
      verdictBadge: hasCringe ? '🛠️ NEEDS EMERGENCY POLISH' : '💎 SHARP BIO UPGRADE',
      panelSpeaker: 'Sienna, 39 & Julian, 27',
      roastRead: hasCringe
        ? 'Generic app clichés ("fluent in sarcasm" / "just ask") blend into a thousand forgettable profiles. Specific sensory details do ten times the work.'
        : 'Good bones! Adding one specific Friday visual and one playful filter makes high-EQ matches reply first.',
      upgradedRewrite:
        role === 'him'
          ? 'Cook a mean Sunday ragu, show up five minutes early with a real reservation, and keep my phone off the table. Bonus points if you have strong opinions on vinyl or Sancerre.'
          : 'Built a life I genuinely love: peaceful home, passport ready, allergic to "idk what do you want to do" texts. Pitch your favorite neighborhood corner booth.',
      whyItWorks:
        'Shows competence, lifestyle texture, and an effortless reply hook in two sentences.',
    };
  }

  // friday_plan
  return {
    score: 96,
    verdictBadge: '🍸 ZERO-DECISION FRIDAY BLUEPRINT',
    panelSpeaker: 'Miles, 31 & Claire, 46',
    roastRead:
      'Decision fatigue kills Friday romance faster than anything else. Handing over a locked 2-stop plan with parking/table sorted puts you in the top 2%.',
    upgradedRewrite: `Hey! Grabbed us a quiet 7:30 corner table tonight (${trimmed || 'neighborhood wine bar'}), with a 12-seat vinyl lounge two doors down if we feel like a nightcap. Just bring yourself.`,
    whyItWorks:
      'Covers time, vibe, and optional Act Two with zero mental homework for your date.',
  };
}

export interface RoastAndWingwomanModalProps {
  open: boolean;
  role: PlayerRole;
  wallet: WalletState;
  onClose: () => void;
  onSpendCredit: (cost: number) => boolean;
  onOpenVip: () => void;
}

const PRESET_EXAMPLES: Record<WingwomanToolMode, string[]> = {
  roast_opener: [
    'ngl u look crazy good for ur age 👀 whats ur snap??',
    'Hey beautiful how is your week going so far?',
    'Saw your Sancerre note, bold take! What is your undefeated Friday spot?',
  ],
  decode_text: [
    'Sounds good. 👍',
    'Can only do 5:15 PM drinks before my 6:45 Tokyo call, phone stays on DND after!',
    'Work is super crazy rn let’s play Friday by ear!',
  ],
  fix_bio: [
    '26M fluent in sarcasm, looking for a partner in crime. Just ask!',
    '42F divorced, tired of games and guys who cannot plan a simple dinner.',
  ],
  friday_plan: [
    'West Hollywood / $90 budget / cozy wine + vinyl vibe',
    'Manhattan / $50 casual / rainy Thursday bookstore + tapas',
  ],
};

export const RoastAndWingwomanModal: React.FC<RoastAndWingwomanModalProps> = ({
  open,
  role,
  wallet,
  onClose,
  onSpendCredit,
  onOpenVip,
}) => {
  const [tool, setTool] = useState<WingwomanToolMode>('roast_opener');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [freeUsed, setFreeUsed] = useState(() => getFreeRoastRunsUsed());
  const [result, setResult] = useState<RoastUtilityResult | null>(null);
  const [copiedRewrite, setCopiedRewrite] = useState(false);
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  if (!open) return null;

  const isUnlimited = Boolean(wallet.isVip || wallet.isFounderUnlimited);
  const freeRemaining = Math.max(0, MAX_FREE_ROAST_RUNS - freeUsed);
  const requiresCreditNow = !isUnlimited && freeRemaining === 0;

  const handleRunLab = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputText.trim();
    if (!clean || loading) return;

    if (requiresCreditNow) {
      const ok = onSpendCredit(1);
      if (!ok) return;
    } else if (!isUnlimited) {
      setFreeUsed(incrementFreeRoastRunsUsed());
    }

    setLoading(true);
    setCopiedRewrite(false);
    sfx.messagePop();

    let resolved: RoastUtilityResult | null = null;
    if (!import.meta.env.VITEST && typeof fetch === 'function') {
      try {
        const res = await fetch('/api/roast-utility', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getPostHogTracingHeaders(),
          },
          body: JSON.stringify({
            tool,
            role,
            input: clean,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as Partial<RoastUtilityResult>;
          if (
            typeof data.score === 'number' &&
            typeof data.roastRead === 'string' &&
            typeof data.upgradedRewrite === 'string'
          ) {
            resolved = {
              score: data.score,
              verdictBadge: data.verdictBadge || '🔥 CLUB VERDICT',
              panelSpeaker: data.panelSpeaker || 'Claire, 46 & Julian, 27',
              roastRead: data.roastRead,
              upgradedRewrite: data.upgradedRewrite,
              whyItWorks: data.whyItWorks || 'Sharp specificity + calm adult follow-through.',
            };
          }
        }
      } catch {
        // Fall through to deterministic local lab
      }
    }

    const finalResult = resolved ?? evaluateRoastLocally(tool, clean, role);
    setResult(finalResult);
    setLoading(false);
    if (finalResult.score >= 70) sfx.greenFlag();
    else sfx.redFlag();

    awardPassportBonusXp('wingwoman_roast_lab', 10, 'IRL Roast Lab Run!', '🔥 +10 XP');
    trackEvent('roast_lab_executed', {
      tool,
      score: finalResult.score,
      paid_credit: requiresCreditNow,
    });
  };

  const handleDownloadPng = () => {
    if (!result) return;
    downloadReceiptPng({
      badge: 'Cougars & Cubs Roast Lab',
      bigStat: `${result.score}/100`,
      verdictLabel: result.verdictBadge,
      title: `“${inputText.trim().slice(0, 96)}”`,
      bullets: [
        `Panel Read: ${result.roastRead}`,
        `10/10 Upgrade: "${result.upgradedRewrite}"`,
        `Why It Wins: ${result.whyItWorks}`,
      ],
      filename: `roast-score-${result.score}.png`,
    });
  };

  const modalNode = (
    <>
      <div
        className="fixed inset-0 z-[65] flex items-center justify-center bg-zinc-950/65 p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Roast My Opener & IRL Wingwoman Lab"
        onClick={onClose}
      >
        <div
          data-testid="roast-wingwoman-modal"
          className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="shrink-0 border-b border-zinc-200 bg-white px-5 py-4 sm:px-6 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white">
                  <Flame className="h-4 w-4" />
                </span>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950">
                  Roast My Opener &amp; IRL Wingwoman Lab
                </h2>
                <span className="rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700">
                  {isUnlimited
                    ? '✓ VIP Unlimited'
                    : freeRemaining > 0
                      ? `${freeRemaining}/${MAX_FREE_ROAST_RUNS} Free Runs Left`
                      : `1 Cr / Run (${wallet.credits} Cr)`}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Roast Lab"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 4 Real-World Utility Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-xl bg-zinc-100 p-1">
              {(
                [
                  ['roast_opener', '🔥 Roast Opener'],
                  ['decode_text', '🕵️ Decode Text'],
                  ['fix_bio', '✨ Fix My Bio'],
                  ['friday_plan', '🍸 60s Date Plan'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTool(id);
                    setResult(null);
                    setInputText('');
                  }}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                    tool === id
                      ? 'bg-white font-semibold text-zinc-950 shadow-2xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-y-auto bg-zinc-50/70 p-5 sm:p-6 space-y-4">
            <form onSubmit={handleRunLab} className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 space-y-3 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-zinc-800">
                  {tool === 'roast_opener'
                    ? 'Paste the real DM / Hinge opener you are about to send:'
                    : tool === 'decode_text'
                      ? 'Paste the confusing text you just received in real life:'
                      : tool === 'fix_bio'
                        ? 'Paste your current Hinge / Bumble / Tinder bio or prompt:'
                        : 'Enter your neighborhood, budget & Friday mood:'}
                </span>
                <span className="text-zinc-400">Try a 1-tap sample below</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {PRESET_EXAMPLES[tool].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setInputText(sample);
                      setResult(null);
                    }}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1 text-left text-xs text-zinc-700 transition cursor-pointer"
                  >
                    “{sample.slice(0, 48)}{sample.length > 48 ? '…' : ''}”
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                maxLength={320}
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your real opener, received text, or bio prompt here..."
                className="w-full rounded-xl border border-zinc-300 bg-white p-3.5 text-sm text-zinc-950 focus:border-zinc-950 focus:outline-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                {requiresCreditNow && wallet.credits < 1 ? (
                  <button
                    type="button"
                    onClick={onOpenVip}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 px-4 text-xs sm:text-sm font-semibold text-white cursor-pointer"
                  >
                    <Crown className="h-4 w-4 text-amber-300" />
                    <span>Unlock Unlimited Lab Runs (Club VIP / Credits) →</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputText.trim() || loading}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 px-5 text-xs sm:text-sm font-semibold text-white transition cursor-pointer"
                  >
                    {requiresCreditNow ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      <Wand2 className="h-3.5 w-3.5" />
                    )}
                    <span>
                      {loading
                        ? 'Panel Roasting…'
                        : requiresCreditNow
                          ? 'Run Club Panel (1 Cr)'
                          : 'Run Free Club Panel →'}
                    </span>
                  </button>
                )}

                {!isUnlimited && (
                  <button
                    type="button"
                    onClick={onOpenVip}
                    className="text-xs font-medium text-zinc-500 hover:text-rose-600 cursor-pointer"
                  >
                    VIP Black Card = Unlimited Roasts &amp; After-Dark →
                  </button>
                )}
              </div>
            </form>

            {result && (
              <div
                data-testid="roast-utility-result"
                className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-4 shadow-2xs animate-stage-in"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3.5">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                      {result.verdictBadge}
                    </span>
                    <div className="text-xs font-medium text-zinc-500">
                      Reviewed by {result.panelSpeaker}
                    </div>
                  </div>

                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-zinc-950 text-white">
                    <span className="text-xl font-extrabold">{result.score}</span>
                    <span className="text-[10px] font-semibold text-amber-300">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-900">
                    <MessageSquareWarning className="h-3.5 w-3.5 text-rose-600" />
                    <span>Honest Club Read</span>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed">{result.roastRead}</p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-900">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>10/10 Ready-to-Send Upgrade</span>
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard?.writeText(result.upgradedRewrite);
                        } catch {
                          // Ignore clipboard restriction
                        }
                        setCopiedRewrite(true);
                      }}
                      className="inline-flex items-center gap-1 rounded-md bg-white border border-emerald-300 px-2.5 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                    >
                      {copiedRewrite ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Line</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-zinc-950 leading-snug">
                    “{result.upgradedRewrite}”
                  </p>
                  <p className="text-xs text-emerald-800">{result.whyItWorks}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadPng}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3.5 text-xs font-semibold text-zinc-800 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-rose-600" />
                    <span>Download PNG Scorecard</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      const shareText = `🔥 My opener scored ${result.score}/100 (${result.verdictBadge}) in the Cougars & Cubs Roast Lab!\n10/10 Upgrade: "${result.upgradedRewrite}"`;
                      const url = 'https://cougarsandcubs.club';
                      await shareOrCopy({
                        title: `Roast My Opener: ${result.score}/100`,
                        text: shareText,
                        url,
                      });
                      setSharePayload({
                        title: `Roast Lab Scorecard (${result.score}/100)`,
                        message: shareText,
                        url,
                        shareSurface: 'verdict_receipt',
                        onDownloadStoryPng: handleDownloadPng,
                      });
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 px-4 text-xs font-semibold text-white cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 text-rose-400" />
                    <span>Share Roast Receipt</span>
                  </button>
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
