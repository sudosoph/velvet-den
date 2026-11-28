import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Camera,
  Check,
  Copy,
  Crown,
  Download,
  Flame,
  ImagePlus,
  Lock,
  MessageSquareWarning,
  Share2,
  Sparkles,
  Trash2,
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
import { Tabs, TabsList, TabsTrigger } from './ui/primitives';

export type WingwomanToolMode =
  | 'profile_teardown'
  | 'roast_opener'
  | 'fix_bio'
  | 'decode_text'
  | 'enm_check'
  | 'friday_plan';

export interface RoastUtilityResult {
  score: number;
  verdictBadge: string;
  panelSpeaker: string;
  roastRead: string;
  upgradedRewrite: string;
  whyItWorks: string;
}

export interface ProfileTeardownResult {
  score: number;
  verdictBadge: string;
  panelSpeaker: string;
  visionSummary: string;
  photoAuditBullets: [string, string, string];
  clicheScan: string;
  promptRewrites: [string, string, string];
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

export function evaluateProfileTeardownLocally(
  promptsText: string,
  role: PlayerRole,
  imageCount = 0,
  avgBrightness = 135,
): ProfileTeardownResult {
  const trimmed = promptsText.trim();
  const lower = trimmed.toLowerCase();

  const hasBoyToyOrFetish =
    /boy\s*toy|cougar|milf|bucket\s*list|for your age|for ur age|sugar\s*mama|mommy/i.test(lower);
  const hasAppCliche =
    /fluent in sarcasm|partner in crime|just ask|idk what to write|snapchat|\bsnap\b|gym selfie|fish/i.test(
      lower,
    );
  const hasNegativity = /tired of games|no drama|swipe left if|sick of|waste my time/i.test(lower);

  const score = hasBoyToyOrFetish
    ? 16
    : hasAppCliche
      ? 42
      : hasNegativity
        ? 51
        : imageCount >= 2 && trimmed.length > 40
          ? 91
          : 85;

  const visionSummary =
    imageCount > 0
      ? avgBrightness < 85
        ? `AI Vision Photo Scan (${imageCount} screenshot${imageCount > 1 ? 's' : ''}): Slide 1 reads slightly dim; swap in a sunlit or warm 2700K bistro portrait so your eyes connect immediately.`
        : `AI Vision Photo Scan (${imageCount} screenshot${imageCount > 1 ? 's' : ''}): Clean exposure detected; anchor Slide 1 with a solo waist-up candid (zero sunglasses) and put lifestyle action in Slides 2–3.`
      : 'Prompt & Bio Teardown Complete: Drop 1–3 Hinge/Bumble/Feeld screenshots above anytime to add AI Vision photo & lighting grading.';

  return {
    score,
    verdictBadge: hasBoyToyOrFetish
      ? '🚨 SLIDE-1 BOY-TOY / FETISH CLICHÉ'
      : hasAppCliche
        ? '🛠️ DORM CLICHÉ CLEANUP NEEDED'
        : hasNegativity
          ? '⚡ SWAP DEFENSIVE BIO FOR MAGNETISM'
          : '💎 TABLE-1 PROFILE CONTENDER',
    panelSpeaker:
      role === 'him' ? 'Claire, 46 (M&A Partner) & Prof. Elena, 44' : 'Julian, 27 & Astrid, 41',
    visionSummary,
    photoAuditBullets:
      role === 'him'
        ? [
            'Slide 1: Solo daylight or warm cocktail-bar portrait in a crisp collar or knit (retire bathroom/gym mirrors).',
            'Slides 2–3: Competent lifestyle proof: searing dinner in a clean kitchen, trail/racquet candid, zero group guesswork.',
            'Background Check: Zero unmade beds, harsh ceiling glare, or college liquor-bottle shelves behind your head.',
          ]
        : [
            'Slide 1: Warm, unhurried solo portrait with direct eye contact that invites specific, respectful openers.',
            'Slides 2–3: Full-length evening or travel candid + one Sunday hobby frame so high-EQ men have an easy hook.',
            'Goblin Filter: Specific taste cues naturally filter out low-effort "hey" tourists before they even message.',
          ],
    clicheScan: hasBoyToyOrFetish
      ? 'Rule #1: Never call yourself a "boy toy" or mention "cougars / bucket list" in Slide 1. She confers the Boy Toy badge AFTER you earn Date #2.'
      : hasAppCliche
        ? 'Generic app filler ("fluent in sarcasm" / "just ask" / Snap handle) blends into 500 forgettable profiles. Specific Friday details win.'
        : hasNegativity
          ? 'Defensive disclaimers ("tired of games") repel confident matches; describe the exact Friday energy you reward instead.'
          : 'Clean, confident adult framing with zero fetish or dorm clichés.',
    promptRewrites:
      role === 'him'
        ? [
            'Together, we could: Split a bottle of Sancerre at a quiet corner booth while I handle the 7:30 reservation and parking.',
            'Green flags I look for: Calm confidence, dry humor, and strong opinions on Sunday brunch or Fleetwood Mac.',
            'A life goal of mine: Perfecting five-hour short-rib ragu from scratch and leaving your kitchen cleaner than I found it.',
          ]
        : [
            'I geek out on: Peaceful Sunday mornings, great Pinot Noir, and a man who locks a 7:30 table without twenty texts.',
            'First round is on me if: You show up five minutes early, keep your phone face-down, and hold real banter.',
            'Together, we could: Trade favorite vinyl records on Friday night and pack one carry-on for a coastal escape.',
          ],
  };
}

export function evaluateRoastLocally(
  tool: WingwomanToolMode,
  input: string,
  role: PlayerRole,
): RoastUtilityResult {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  if (tool === 'roast_opener' || tool === 'profile_teardown') {
    if (
      /for your age|for ur age|bucket list|never been with a cougar|milf|mommy|boy\s*toy/i.test(
        lower,
      )
    ) {
      return {
        score: 8,
        verdictBadge: '🚫 INSTANT UNMATCH',
        panelSpeaker: 'Claire, 46 (M&A Partner) & Prof. Elena, 44',
        roastRead:
          'Self-proclaiming "your new boy toy" or dropping a "for your age / bucket list" cliché on Message #1 guarantees an instant block. You earn Boy Toy status AFTER you book Friday dinner.',
        upgradedRewrite:
          role === 'him'
            ? 'Your Sancerre hot take made me laugh out loud. Free for a proper 7:30 Thursday glass at a quiet spot?'
            : 'Bold claim on your second prompt, prove you can back that banter up over a Thursday drink.',
        whyItWorks:
          'Drops the premature cliché completely, hooks onto a specific profile detail, and proposes an unhurried adult plan.',
      };
    }

    if (
      /\b(snap|snapchat|wyd|u up|hey beautiful|hey gorgeous|^hey$|^hi$)\b/i.test(lower) ||
      trimmed.length < 16
    ) {
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
          'Way too many words before Message #1! Sending a three-paragraph monologue before she even says hello triggers instant intensity alarm bells.',
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
    if (
      /6:?30|6:?45|5:?15|call running late|travel phone|notifications off|practically divorced/i.test(
        lower,
      )
    ) {
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

  if (tool === 'enm_check') {
    if (
      /telegram|whatsapp only|don'?t ask don'?t tell|dadt|wife doesn'?t want to know|husband doesn'?t need to know|cash only|practically separated/i.test(
        lower,
      )
    ) {
      return {
        score: 7,
        verdictBadge: '🚨 FAKE-DADT CHEATER TRAP',
        panelSpeaker: 'Astrid, 41 (Solo-Poly Founder) & Priya, 36',
        roastRead:
          '99% red-alert siren: real ethical non-monogamy never relies on vanishing chat apps, cash-only tabs, or "my spouse doesn’t want to know" secrecy.',
        upgradedRewrite:
          'I only date single partners or transparently verified kitchen-table ENM with zero secrecy. Wishing you well!',
        whyItWorks:
          'Draws an unshakeable ethical boundary in one calm sentence and saves you months of suburban drama.',
      };
    }

    if (/brad|package deal|third for us|spoil a third|unicorn|join my husband|surprise we/i.test(lower)) {
      return {
        score: 16,
        verdictBadge: '🍍 UNDISCLOSED UNICORN AMBUSH',
        panelSpeaker: 'Jade, 42 & Astrid, 41',
        roastRead:
          'Hiding a spouse behind four solo photos and springing a "package deal" mid-conversation violates Rule #1 of ethical non-monogamy and couples privilege.',
        upgradedRewrite:
          'Looking strictly for one-on-one connection rather than joining an established couple, good luck out there!',
        whyItWorks:
          'Clean, zero-judgment exit before you become an unpaid marriage experiment.',
      };
    }

    return {
      score: 93,
      verdictBadge: '🍍 ETHICAL SOLO-POLY / ENM GREEN LIGHT',
      panelSpeaker: 'Astrid, 41 & Claire, 46',
      roastRead:
        'Upfront disclosure, clear calendar boundaries, and zero sneaking around! As long as your own relationship goals align with non-escalator dating, this is textbook adult honesty.',
      upgradedRewrite:
        'Appreciate the upfront clarity! Let’s grab a Thursday drink and align on pace and weekend rhythm.',
      whyItWorks:
        'Rewards radical transparency and checks practical compatibility early.',
    };
  }

  if (tool === 'fix_bio') {
    const hasCringe =
      /fluent in sarcasm|partner in crime|just ask|idk what to write|pineapple on pizza|looking for a cougar|sugar|boy\s*toy/i.test(
        lower,
      );
    return {
      score: hasCringe ? 31 : 78,
      verdictBadge: hasCringe ? '🛠️ NEEDS EMERGENCY POLISH' : '💎 SHARP BIO UPGRADE',
      panelSpeaker: 'Sienna, 39 & Julian, 27',
      roastRead: hasCringe
        ? 'Generic clichés ("fluent in sarcasm" / self-proclaimed "boy toy" / "just ask") blend into a thousand forgettable profiles. Specific sensory details do ten times the work.'
        : 'Good bones! Adding one specific Friday visual and one playful filter makes high-EQ matches reply first.',
      upgradedRewrite:
        role === 'him'
          ? 'Cook a mean Sunday ragu, show up five minutes early with a real reservation, and keep my phone off the table. Bonus points if you have strong opinions on vinyl or Sancerre.'
          : 'Built a life I genuinely love: peaceful home, passport ready, allergic to "idk what do you want to do" texts. Pitch your favorite neighborhood corner booth.',
      whyItWorks:
        'Shows competence, lifestyle texture, and an effortless reply hook in two sentences.',
    };
  }

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

interface UploadedSlidePreview {
  name: string;
  previewUrl: string;
  bytes: number[];
  avgBrightness: number;
}

async function compressScreenshotForVision(file: File): Promise<UploadedSlidePreview> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.readAsDataURL(file);
  });

  if (typeof document === 'undefined' || import.meta.env.VITEST) {
    return {
      name: file.name,
      previewUrl: dataUrl,
      bytes: [255, 216, 255, 224],
      avgBrightness: 142,
    };
  }

  return new Promise<UploadedSlidePreview>((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const maxDim = 540;
        const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
        const w = Math.max(1, Math.round((img.width || 320) * scale));
        const h = Math.max(1, Math.round((img.height || 420) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ name: file.name, previewUrl: dataUrl, bytes: [], avgBrightness: 135 });
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const pixels = ctx.getImageData(0, 0, w, h).data;
        let lumSum = 0;
        const step = Math.max(4, Math.floor(pixels.length / 4000) * 4);
        let count = 0;
        for (let i = 0; i < pixels.length; i += step) {
          lumSum += 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
          count += 1;
        }
        const avgBrightness = count > 0 ? Math.round(lumSum / count) : 135;
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.72);
        const base64 = jpegDataUrl.split(',')[1] || '';
        const bin = atob(base64);
        const bytes = new Array<number>(bin.length);
        for (let i = 0; i < bin.length; i += 1) {
          bytes[i] = bin.charCodeAt(i);
        }
        resolve({
          name: file.name,
          previewUrl: jpegDataUrl,
          bytes,
          avgBrightness,
        });
      } catch {
        resolve({ name: file.name, previewUrl: dataUrl, bytes: [], avgBrightness: 135 });
      }
    };
    img.onerror = () =>
      resolve({ name: file.name, previewUrl: dataUrl, bytes: [], avgBrightness: 135 });
    img.src = dataUrl;
  });
}

export interface RoastAndWingwomanModalProps {
  open: boolean;
  role: PlayerRole;
  wallet: WalletState;
  initialTool?: WingwomanToolMode;
  initialPrefillText?: string;
  onClose: () => void;
  onSpendCredit: (cost: number) => boolean;
  onOpenVip: () => void;
}

const OUTBOUND_SAMPLES: Record<'profile_teardown' | 'roast_opener' | 'fix_bio', string[]> = {
  profile_teardown: [
    '25M • Gym mirror selfie + "Looking to be someone’s favorite boy toy 😉 just ask!"',
    '28M • "Architect, cook Sunday pasta from scratch, strong opinions on Fleetwood Mac."',
    '43F • "Divorced, tired of games and guys who cannot plan a simple Friday dinner."',
  ],
  roast_opener: [
    'ngl u look crazy good for ur age 👀 need a new boy toy??',
    'Hey beautiful how is your week going so far?',
    'Saw your Sancerre note, bold take! What is your undefeated Friday spot?',
  ],
  fix_bio: [
    '26M fluent in sarcasm, looking for a partner in crime. Just ask!',
    '42F homeowner, peaceful Sundays, allergic to endless pen-pal texting.',
  ],
};

export const RoastAndWingwomanModal: React.FC<RoastAndWingwomanModalProps> = ({
  open,
  role,
  wallet,
  initialTool = 'roast_opener',
  initialPrefillText = '',
  onClose,
  onSpendCredit,
  onOpenVip,
}) => {
  const [tool, setTool] = useState<WingwomanToolMode>(initialTool);
  const [inputText, setInputText] = useState(initialPrefillText);
  const [slides, setSlides] = useState<UploadedSlidePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [freeUsed, setFreeUsed] = useState(() => getFreeRoastRunsUsed());
  const [result, setResult] = useState<RoastUtilityResult | null>(null);
  const [teardownResult, setTeardownResult] = useState<ProfileTeardownResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  React.useEffect(() => {
    if (open) {
      setTool(initialTool);
      setResult(null);
      setTeardownResult(null);
      if (initialPrefillText) {
        setInputText(initialPrefillText);
      }
    }
  }, [open, initialTool, initialPrefillText]);

  if (!open) return null;

  const isUnlimited = Boolean(wallet.isVip || wallet.isFounderUnlimited);
  const freeRemaining = Math.max(0, MAX_FREE_ROAST_RUNS - freeUsed);
  const requiresCreditNow = !isUnlimited && freeRemaining === 0;
  const isInboundOverride =
    tool === 'decode_text' || tool === 'enm_check' || tool === 'friday_plan';

  const copySnippet = async (text: string, key: string) => {
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      // Ignore clipboard restriction
    }
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2200);
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files || []).slice(0, 3);
    if (fileList.length === 0) return;
    const processed = await Promise.all(fileList.map(compressScreenshotForVision));
    setSlides((prev) => [...prev, ...processed].slice(0, 3));
    setTeardownResult(null);
  };

  const handleRunStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputText.trim();
    if (loading) return;
    if (tool === 'profile_teardown' && !clean && slides.length === 0) return;
    if (tool !== 'profile_teardown' && !clean) return;

    if (requiresCreditNow) {
      const ok = onSpendCredit(1);
      if (!ok) return;
    } else if (!isUnlimited) {
      setFreeUsed(incrementFreeRoastRunsUsed());
    }

    setLoading(true);
    sfx.messagePop();

    if (tool === 'profile_teardown') {
      const primarySlide = slides[0];
      let resolved: ProfileTeardownResult | null = null;
      if (!import.meta.env.VITEST && typeof fetch === 'function') {
        try {
          const res = await fetch('/api/profile-teardown', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getPostHogTracingHeaders(),
            },
            body: JSON.stringify({
              role,
              promptsText: clean,
              imageBytes: primarySlide?.bytes,
              imageCount: slides.length,
              imageStats: primarySlide ? { avgBrightness: primarySlide.avgBrightness } : undefined,
            }),
          });
          if (res.ok) {
            const data = (await res.json()) as Partial<ProfileTeardownResult>;
            if (
              typeof data.score === 'number' &&
              Array.isArray(data.photoAuditBullets) &&
              Array.isArray(data.promptRewrites)
            ) {
              resolved = data as ProfileTeardownResult;
            }
          }
        } catch {
          // Fall back to deterministic local teardown
        }
      }

      const finalTeardown =
        resolved ??
        evaluateProfileTeardownLocally(
          clean,
          role,
          slides.length,
          primarySlide?.avgBrightness ?? 135,
        );
      setTeardownResult(finalTeardown);
      setResult(null);
      setLoading(false);
      if (finalTeardown.score >= 70) sfx.greenFlag();
      else sfx.redFlag();
      awardPassportBonusXp('ai_profile_teardown', 15, 'Profile Teardown Complete!', '📸 +15 XP');
      trackEvent('roast_lab_executed', {
        tool: 'profile_teardown',
        score: finalTeardown.score,
        images_uploaded: slides.length,
        paid_credit: requiresCreditNow,
      });
      return;
    }

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
    setTeardownResult(null);
    setLoading(false);
    if (finalResult.score >= 70) sfx.greenFlag();
    else sfx.redFlag();

    awardPassportBonusXp('wingwoman_roast_lab', 10, 'Roast Studio Run!', '🔥 +10 XP');
    trackEvent('roast_lab_executed', {
      tool,
      score: finalResult.score,
      paid_credit: requiresCreditNow,
    });
  };

  const handleDownloadPng = () => {
    if (teardownResult) {
      downloadReceiptPng({
        style: 'thermal',
        badge: 'ZERO-DOX AI PROFILE TEARDOWN',
        bigStat: `${teardownResult.score}/100`,
        verdictLabel: teardownResult.verdictBadge,
        title: teardownResult.clicheScan.slice(0, 96),
        bullets: [
          teardownResult.photoAuditBullets[0],
          `PROMPT #1: "${teardownResult.promptRewrites[0]}"`,
          `PROMPT #2: "${teardownResult.promptRewrites[1]}"`,
        ],
        filename: `profile-teardown-${teardownResult.score}.png`,
      });
      return;
    }
    if (!result) return;
    downloadReceiptPng({
      style: 'thermal',
      badge: 'MARLOW LOUNGE ROAST RECEIPT',
      bigStat: `${result.score}/100`,
      verdictLabel: result.verdictBadge,
      title: `“${inputText.trim().slice(0, 96)}”`,
      bullets: [
        `PANEL: ${result.roastRead}`,
        `10/10 REWRITE: "${result.upgradedRewrite}"`,
        `WHY IT WINS: ${result.whyItWorks}`,
      ],
      filename: `roast-score-${result.score}.png`,
    });
  };

  const activeOutboundTab = isInboundOverride ? 'roast_opener' : tool;

  const modalNode = (
    <>
      <div
        className="fixed inset-0 z-[65] flex items-center justify-center bg-zinc-950/60 p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Profile & Opener Roast Studio"
        onClick={onClose}
      >
        <div
          data-testid="roast-wingwoman-modal"
          className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Clean Architectural Header + 3 Natural Outbound Tabs (Zero ENM/60s-Plan Stuffing!) */}
          <div className="shrink-0 border-b border-zinc-200 bg-white px-5 py-4 sm:px-6 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-white">
                  {tool === 'profile_teardown' ? (
                    <Camera className="h-4 w-4" />
                  ) : (
                    <Flame className="h-4 w-4 text-rose-400" />
                  )}
                </span>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950 truncate">
                    {isInboundOverride
                      ? 'Incoming Subtext Decoder'
                      : 'Private Profile & Opener Roast'}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    {isUnlimited
                      ? 'VIP Unlimited Active · Private zero-dox AI studio'
                      : freeRemaining > 0
                        ? `${freeRemaining}/${MAX_FREE_ROAST_RUNS} Free Runs Left · Never posted publicly`
                        : `1 Credit per run (${wallet.credits} Cr available)`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Roast Lab"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!isInboundOverride ? (
              <Tabs
                value={activeOutboundTab}
                onValueChange={(v) => {
                  setTool(v as WingwomanToolMode);
                  setResult(null);
                  setTeardownResult(null);
                  setInputText('');
                }}
              >
                <TabsList className="grid w-full grid-cols-3 h-9">
                  <TabsTrigger value="profile_teardown" className="text-xs">
                    📸 AI Profile Teardown
                  </TabsTrigger>
                  <TabsTrigger value="roast_opener" className="text-xs">
                    🔥 Roast Opener
                  </TabsTrigger>
                  <TabsTrigger value="fix_bio" className="text-xs">
                    ✍️ Rewrite Bio
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
              <div className="flex items-center justify-between rounded-lg bg-zinc-100 px-3 py-1.5 text-xs text-zinc-700">
                <span>Decoding incoming message subtext</span>
                <button
                  type="button"
                  onClick={() => {
                    setTool('profile_teardown');
                    setResult(null);
                  }}
                  className="font-semibold text-zinc-950 hover:underline cursor-pointer"
                >
                  Switch to Profile Roast →
                </button>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-y-auto bg-zinc-50/50 p-5 sm:p-6 space-y-4">
            <form
              onSubmit={handleRunStudio}
              className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 space-y-3.5 shadow-2xs"
            >
              {tool === 'profile_teardown' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-zinc-900">
                      1. Upload 1–3 Hinge, Bumble, or Feeld Screenshots (Private AI Vision):
                    </span>
                    <span className="text-zinc-400">Processed privately · Zero Reddit dox</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <label className="inline-flex h-10 items-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 px-3.5 text-xs font-semibold text-zinc-800 cursor-pointer transition">
                      <ImagePlus className="h-4 w-4 text-rose-600" />
                      <span>
                        {slides.length > 0
                          ? `Add Screenshot (${slides.length}/3)`
                          : 'Choose Profile Screenshots'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        data-testid="profile-teardown-file-input"
                        onChange={handleFilesSelected}
                        className="sr-only"
                      />
                    </label>

                    {slides.map((sl, idx) => (
                      <div
                        key={`${sl.name}-${idx}`}
                        className="relative h-12 w-10 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100"
                      >
                        <img
                          src={sl.previewUrl}
                          alt={`Slide ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          aria-label={`Remove screenshot ${idx + 1}`}
                          onClick={() =>
                            setSlides((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="absolute right-0.5 top-0.5 rounded bg-zinc-950/80 p-0.5 text-white cursor-pointer"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-zinc-900">
                    {tool === 'profile_teardown'
                      ? '2. Paste your current prompts / bio (or test a sample below):'
                      : tool === 'roast_opener'
                        ? 'Paste the first message you are about to send:'
                        : tool === 'fix_bio'
                          ? 'Paste your current dating bio or prompt:'
                          : 'Paste the message you want decoded:'}
                  </span>
                </div>

                {!isInboundOverride && (
                  <div className="flex flex-wrap gap-1.5">
                    {OUTBOUND_SAMPLES[
                      tool as 'profile_teardown' | 'roast_opener' | 'fix_bio'
                    ].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => {
                          setInputText(sample);
                          setResult(null);
                          setTeardownResult(null);
                        }}
                        className="rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1 text-left text-xs text-zinc-600 hover:text-zinc-950 transition cursor-pointer"
                      >
                        “{sample.slice(0, 52)}
                        {sample.length > 52 ? '…' : ''}”
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  rows={3}
                  maxLength={500}
                  data-testid="roast-studio-textarea"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    tool === 'profile_teardown'
                      ? 'Paste your 3 Hinge prompts, bio, or photo notes here (or upload screenshots above)...'
                      : 'Paste your real opener or bio text here...'
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-white p-3.5 text-sm text-zinc-950 focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                {requiresCreditNow && wallet.credits < 1 ? (
                  <button
                    type="button"
                    onClick={onOpenVip}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 px-4 text-xs sm:text-sm font-semibold text-white cursor-pointer"
                  >
                    <Crown className="h-4 w-4 text-amber-300" />
                    <span>Unlock Unlimited Teardowns &amp; Roasts (Club VIP) →</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      (tool === 'profile_teardown'
                        ? !inputText.trim() && slides.length === 0
                        : !inputText.trim())
                    }
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-zinc-950 hover:bg-rose-600 disabled:opacity-45 px-5 text-xs sm:text-sm font-semibold text-white transition cursor-pointer"
                  >
                    {requiresCreditNow ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      <Wand2 className="h-3.5 w-3.5" />
                    )}
                    <span>
                      {loading
                        ? 'Analyzing…'
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
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-950 cursor-pointer"
                  >
                    VIP = Unlimited AI Vision Teardowns →
                  </button>
                )}
              </div>
            </form>

            {/* AI Vision Full Profile Teardown Result */}
            {teardownResult && (
              <div
                data-testid="profile-teardown-result"
                className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4 shadow-2xs animate-stage-in"
              >
                <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-3.5">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-rose-600">
                      {teardownResult.verdictBadge}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Audited by {teardownResult.panelSpeaker}
                    </div>
                  </div>
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-zinc-950 text-white">
                    <span className="text-lg font-extrabold">{teardownResult.score}</span>
                    <span className="text-[10px] text-zinc-400">/ 100</span>
                  </div>
                </div>

                <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-700 leading-relaxed">
                  {teardownResult.visionSummary}
                </p>

                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-zinc-900">
                    Cliché &amp; Boy-Toy Bio Check
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    {teardownResult.clicheScan}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-zinc-900">
                    Slide-by-Slide Photo Blueprint
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-700">
                    {teardownResult.photoAuditBullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-950" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="text-xs font-semibold text-emerald-800">
                    3 Ready-to-Paste Prompt Upgrades
                  </div>
                  <div className="grid gap-2">
                    {teardownResult.promptRewrites.map((pr, idx) => (
                      <div
                        key={pr}
                        className="flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 text-xs sm:text-sm text-zinc-900"
                      >
                        <span className="font-medium leading-snug">{pr}</span>
                        <button
                          type="button"
                          onClick={() => copySnippet(pr, `pr-${idx}`)}
                          className="shrink-0 inline-flex items-center gap-1 rounded border border-emerald-300 bg-white px-2 py-1 text-[11px] font-semibold text-emerald-900 cursor-pointer"
                        >
                          {copiedKey === `pr-${idx}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadPng}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3 text-xs font-semibold text-zinc-800 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Thermal Receipt</span>
                    </button>
                    <button
                      type="button"
                      data-testid="copy-reddit-roast-btn"
                      onClick={() =>
                        copySnippet(
                          `**AI Profile Teardown:** ${teardownResult.score}/100 (${teardownResult.verdictBadge})\n- Audit: ${teardownResult.clicheScan}\n- Upgraded Prompt: "${teardownResult.promptRewrites[0]}"`,
                          'reddit-teardown',
                        )
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3 text-xs font-semibold text-zinc-800 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>
                        {copiedKey === 'reddit-teardown' ? '✓ Copied!' : 'Copy for Reddit'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Single-Snippet Opener / Bio / Subtext Result */}
            {result && (
              <div
                data-testid="roast-utility-result"
                className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4 shadow-2xs animate-stage-in"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3.5">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-rose-600">
                      {result.verdictBadge}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Reviewed by {result.panelSpeaker}
                    </div>
                  </div>

                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-zinc-950 text-white">
                    <span className="text-lg font-extrabold">{result.score}</span>
                    <span className="text-[10px] text-zinc-400">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                    <MessageSquareWarning className="h-3.5 w-3.5 text-rose-600" />
                    <span>Honest Club Read</span>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed">{result.roastRead}</p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-900">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>10/10 Ready-to-Send Upgrade</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => copySnippet(result.upgradedRewrite, 'rewrite')}
                      className="inline-flex items-center gap-1 rounded-md bg-white border border-emerald-300 px-2.5 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                    >
                      {copiedKey === 'rewrite' ? (
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
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadPng}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3 text-xs font-semibold text-zinc-800 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Thermal Receipt</span>
                    </button>

                    <button
                      type="button"
                      data-testid="copy-reddit-roast-btn"
                      onClick={() =>
                        copySnippet(
                          `**Roast Score:** ${result.score}/100 (${result.verdictBadge})\n- Panel Read: ${result.roastRead}\n- 10/10 Upgrade: "${result.upgradedRewrite}"`,
                          'reddit-roast',
                        )
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3 text-xs font-semibold text-zinc-800 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>
                        {copiedKey === 'reddit-roast' ? '✓ Copied for Reddit!' : 'Copy for Reddit'}
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      const shareText = `🔥 My opener scored ${result.score}/100 (${result.verdictBadge}) in the Cougars & Cubs Roast Studio!\n10/10 Upgrade: "${result.upgradedRewrite}"`;
                      const url = 'https://cougarsandcubs.club';
                      await shareOrCopy({
                        title: `Roast My Opener: ${result.score}/100`,
                        text: shareText,
                        url,
                      });
                      setSharePayload({
                        title: `Roast Scorecard (${result.score}/100)`,
                        message: shareText,
                        url,
                        shareSurface: 'verdict_receipt',
                        onDownloadStoryPng: handleDownloadPng,
                      });
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 px-4 text-xs font-semibold text-white cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 text-rose-400" />
                    <span>Share Receipt</span>
                  </button>
                </div>
              </div>
            )}

            <p className="text-center text-xs text-zinc-500">
              Need to vet a confusing text or check an ENM / married red flag? Ask the regulars inside{' '}
              <strong className="text-zinc-800">Chats &amp; Dates → Club Discord</strong>.
            </p>
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
