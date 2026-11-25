/**
 * Unified Phase A + Phase B (Cloudflare KV) + Phase C (Cloudflare Workers AI) Service Layer.
 * Automatically uses live `/api/stats`, `/api/inbox-vet`, and `/api/verify-checkout` on
 * cougarsandcubs.club, while falling back cleanly to deterministic local logic offline or in Vitest.
 */

export interface CrowdStatsService {
  getChoicePercentages(episodeId: string, choiceCount: number): Promise<number[]>;
  recordChoice(episodeId: string, choiceIndex: number): Promise<void>;
}

export interface LiveInboxTurn {
  sender: 'player' | 'match';
  text: string;
}

export interface AiDmVettingResponse {
  maturityDelta: number;
  chivalryDelta: number;
  chemistryDelta: number;
  herReply: string;
  coachNote: string;
  passedVibeCheck: boolean;
  source: 'workers-ai' | 'local-heuristic';
}

export interface AiDmVettingService {
  isEnabled(): boolean;
  evaluateOpeningDm(params: {
    personaId: string;
    personaName: string;
    personaAge: number;
    personaTitle: string;
    personaRole: 'her' | 'him';
    playerMessage: string;
    history?: LiveInboxTurn[];
  }): Promise<AiDmVettingResponse>;
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function getLocalChoicePercentagesSync(
  episodeId: string,
  choiceCount: number,
): number[] {
  if (choiceCount <= 0) return [];
  if (choiceCount === 1) return [100];

  const weights: number[] = [];
  let total = 0;
  for (let i = 0; i < choiceCount; i++) {
    const w = 18 + (hashSeed(`${episodeId}:${i}`) % 39);
    weights.push(w);
    total += w;
  }

  const rounded = weights.map((w) => Math.round((w / total) * 100));
  const drift = 100 - rounded.reduce((a, b) => a + b, 0);
  rounded[0] += drift;
  return rounded;
}

function isLiveBrowserRuntime(): boolean {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return false;
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  if (ua.toLowerCase().includes('jsdom')) return false;
  return window.location.protocol === 'https:' || window.location.protocol === 'http:';
}

export const localCrowdStatsService: CrowdStatsService = {
  async getChoicePercentages(episodeId: string, choiceCount: number): Promise<number[]> {
    if (isLiveBrowserRuntime()) {
      try {
        const res = await fetch(
          `/api/stats?episodeId=${encodeURIComponent(episodeId)}&choices=${choiceCount}`,
        );
        if (res.ok) {
          const data = (await res.json()) as { percentages?: number[] };
          if (Array.isArray(data.percentages) && data.percentages.length === choiceCount) {
            return data.percentages;
          }
        }
      } catch {
        // Fall through to deterministic baseline
      }
    }
    return getLocalChoicePercentagesSync(episodeId, choiceCount);
  },

  async recordChoice(episodeId: string, choiceIndex: number): Promise<void> {
    if (!isLiveBrowserRuntime()) return;
    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId, choiceIndex }),
      });
    } catch {
      // Non-blocking telemetry
    }
  },
};

export function evaluateDmLocally(params: {
  personaName: string;
  personaAge: number;
  personaRole: 'her' | 'him';
  playerMessage: string;
}): AiDmVettingResponse {
  const msg = params.playerMessage.trim();
  const lower = msg.toLowerCase();

  const hasSnap = /\bsnap(chat)?\b/.test(lower);
  const hasPushyWhine = /hard\s+to\s+get|stuck\s+up|why\s+so\s+cold|hurry\s+up/.test(lower);
  const hasGoldenPatience = /take\s+(all\s+)?(the\s+|your\s+)?time|no\s+rush|worth\s+the\s+wait|whenever\s+you.?re\s+ready/.test(
    lower,
  );
  const hasSisterFumble = /little\s+sister\s+cute|sister\s+single/.test(lower);
  const hasCubsplaining =
    /\b(well\s+actually|let\s+me\s+explain|cubsplain|you\s+probably\s+don.?t\s+know|heard\s+a\s+podcast\s+on)\b/.test(
      lower,
    );
  const hasSugarFreeloader =
    /\b(sugar\s*mama|allowance|spoil\s*me|amex|pay\s*my|cougar\s*bucket)\b/.test(lower) ||
    /^(hey+|yo+|sup)\s+mommy[!?.🔥😍👀]*$/i.test(msg);
  const hasPlayfulMommyOrQigong =
    !hasSugarFreeloader &&
    !hasCubsplaining &&
    /\b(mommy-domme|yes,?\s*mommy|breathe\s+with\s+mommy|qigong|tai\s*chi|cloud\s*hands|jasmine\s*oolong)\b/.test(
      lower,
    );
  const hasForYourAge = /for\s+(your|ur)\s+age/.test(lower) || /\blook\s+good\s+for\b/.test(lower);
  const isLazyHey =
    msg.length < 12 || /^(hey+|yo+|sup|wyd|u\s*up\??|hi+)$/i.test(msg.replace(/[!?.🔥😍👀]/g, '').trim());
  const hasPlan =
    /\b(friday|thursday|saturday|sunday|dinner|tapas|wine|coffee|espresso|7:?30|8:?00|6:?00|6:?30|reservation|table|trail|peonies|call|bench|ribeye|bamboo|silk|upstairs|pillow|oolong|sauna|courtyard)\b/.test(
      lower,
    );

  if (hasSisterFumble) {
    return {
      maturityDelta: -25,
      chivalryDelta: -25,
      chemistryDelta: -25,
      herReply: `Excuse me?! Ask about my little sister ONE more time and your gym duffel is going out the second-story window. 🚩`,
      coachNote: 'Rule #0: When she has a post-hookup "OMG you’re my baby sister’s age!!" shock moment, make her laugh—NEVER ask if her sister is cute!',
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (hasCubsplaining) {
    return {
      maturityDelta: -22,
      chivalryDelta: -15,
      chemistryDelta: -22,
      herReply: `🤓 Hold right there, sweet boy—did you just start a sentence with "well actually" to Cubsplain something I mastered in 2006? Unclench your jaw, mute the podcast brain, and try again.`,
      coachNote: 'Zero Cubsplaining! Accomplished Cougars & Wellness Mommies love curiosity and confidence—never a 10-minute Wikipedia lecture.',
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (hasPushyWhine) {
    return {
      maturityDelta: -20,
      chivalryDelta: -18,
      chemistryDelta: -20,
      herReply: `🐈‍⬛ Calling a woman "hard to get" because she takes her time? And just like that, the Black Cat walked right off the balcony. Bye!`,
      coachNote: 'When a Black Cat Cougar pushes back at first, NEVER whine or get defensive—steady, unbothered Golden-Retriever patience is what melts her!',
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (hasPlayfulMommyOrQigong && !hasSnap && !hasForYourAge) {
    return {
      maturityDelta: 22,
      chivalryDelta: 20,
      chemistryDelta: 26,
      herReply: `🧘‍♀️ Good boy—shoulders dropped, zero Cubsplaining, and actual follow-through. Meet Mommy in the bamboo courtyard at 6:30 AM for Tai Chi Cloud Hands and warm jasmine oolong. 🍵`,
      coachNote: '🧘‍♀️ Wellness Mommy-Domme bullseye! Playful, consensual "Yes, Mommy" polarity + real effort (zero freeloading) melts her instantly.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (hasGoldenPatience) {
    return {
      maturityDelta: 22,
      chivalryDelta: 20,
      chemistryDelta: 25,
      herReply: `😼 Okay, Golden Retriever—not even a tiny flinch when I pushed back? Keep that exact steady energy and Friday at 7:30 might actually be yours. 🍸`,
      coachNote: '🐈‍⬛×🐕 Bullseye! Unbothered Golden-Retriever warmth + respecting her slow-burn pace is pure Black Cat kryptonite.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (hasSnap || hasSugarFreeloader || hasForYourAge) {
    const reason = hasSnap
      ? `Did you seriously just ask ${params.personaName} (${params.personaAge}) for Snapchat? Instant block.`
      : hasForYourAge
        ? '"For your age" is banned in all 50 states. Try complimenting her without a birth-certificate footnote!'
        : 'Rule #1 of the Club: Mommy-Domme is playful romantic polarity—Cougar NEVER means Sugar Mama or allowance ATM!';
    return {
      maturityDelta: -18,
      chivalryDelta: -15,
      chemistryDelta: -15,
      herReply: hasSnap
        ? `I have a mortgage and a wine cellar, sweetie—I haven’t opened Snapchat since 2016. Good luck out there. 👋`
        : hasForYourAge
          ? `"For my age"?! I was about to say yes to drinks until that sentence happened.`
          : `Wrong inbox—playful Mommy-Domme banter is earned by grown partners, never freeloaders looking for an allowance.`,
      coachNote: reason,
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (isLazyHey) {
    return {
      maturityDelta: -10,
      chivalryDelta: -10,
      chemistryDelta: -8,
      herReply: `One-word openers get buried under 99 other guys in my inbox. Give me a real plan or a real sentence.`,
      coachNote: 'Low-effort "hey / wyd" openers fail 95% of the time—lead with a concrete plan and full punctuation!',
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (hasPlan && msg.length >= 28) {
    return {
      maturityDelta: 18,
      chivalryDelta: 20,
      chemistryDelta: 22,
      herReply: `Now *that* is how you send a message—clear plan, zero games, actual punctuation. Send me the address and I’ll see you there at 7:30. 🍸`,
      coachNote: 'Elite move: specific date plan + confident grown-up tone + zero slang clutter.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  return {
    maturityDelta: 8,
    chivalryDelta: 6,
    chemistryDelta: 10,
    herReply: `Cute energy—you’ve got my attention. Now tell me where you’re actually taking me this Friday so I know you don’t flake.`,
    coachNote: 'Warm start! Lock in a concrete time & neighborhood spot next to seal the date.',
    passedVibeCheck: true,
    source: 'local-heuristic',
  };
}

export const liveAiInboxService: AiDmVettingService = {
  isEnabled() {
    return true;
  },

  async evaluateOpeningDm(params): Promise<AiDmVettingResponse> {
    if (isLiveBrowserRuntime()) {
      try {
        const res = await fetch('/api/inbox-vet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        if (res.ok) {
          const data = (await res.json()) as Partial<AiDmVettingResponse> & { reply?: string };
          if (typeof (data.herReply ?? data.reply) === 'string') {
            return {
              herReply: (data.herReply ?? data.reply) as string,
              maturityDelta: Number(data.maturityDelta ?? 10),
              chivalryDelta: Number(data.chivalryDelta ?? 10),
              chemistryDelta: Number(data.chemistryDelta ?? 12),
              coachNote:
                data.coachNote ?? 'Live AI Vibe Check complete—keep matching their energy!',
              passedVibeCheck: Boolean(data.passedVibeCheck ?? true),
              source: 'workers-ai',
            };
          }
        }
      } catch {
        // Fallback cleanly to local heuristic
      }
    }
    return evaluateDmLocally(params);
  },
};

export async function verifyStripeCheckoutSession(
  sessionId: string,
  tierHint = '',
): Promise<{ verified: boolean; grantType?: 'vip' | 'credits'; credits?: number }> {
  if (!sessionId || !isLiveBrowserRuntime()) return { verified: false };
  try {
    const q = new URLSearchParams({ session_id: sessionId });
    if (tierHint) q.set('tier', tierHint);
    const res = await fetch(`/api/verify-checkout?${q.toString()}`);
    if (!res.ok) return { verified: false };
    return (await res.json()) as {
      verified: boolean;
      grantType?: 'vip' | 'credits';
      credits?: number;
    };
  } catch {
    return { verified: false };
  }
}

export async function recordIncomingReferralHit(refCode: string): Promise<void> {
  if (!refCode || !isLiveBrowserRuntime()) return;
  try {
    await fetch('/api/referral-hit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refCode }),
    });
  } catch {
    // Non-blocking referral ping
  }
}

export async function fetchVerifiedReferralSlots(
  refCode: string,
): Promise<{ uniqueReferrals: number; claimableSlots: number }> {
  if (!refCode || !isLiveBrowserRuntime()) {
    return { uniqueReferrals: 0, claimableSlots: 0 };
  }
  try {
    const res = await fetch(`/api/referral-status?code=${encodeURIComponent(refCode)}`);
    if (!res.ok) return { uniqueReferrals: 0, claimableSlots: 0 };
    return (await res.json()) as { uniqueReferrals: number; claimableSlots: number };
  } catch {
    return { uniqueReferrals: 0, claimableSlots: 0 };
  }
}
