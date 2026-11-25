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
    platform?: string;
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
  const hasPinePollenFeelsSpiral =
    /pine\s*pollen|all\s+up\s+in\s+(my|his)\s+feels|up\s+in\s+my\s+feels\s+rn/.test(lower);
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
    /\b(mommy-domme|yes,?\s*mommy|breathe\s+with\s+mommy|qigong|tai\s*chi|cloud\s*hands|jasmine\s*oolong|seed[- ]oil|gluten[- ]free|ghee|tallow|bernedoodle)\b/.test(
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
      herReply: `excuse me?? 😭 ask about my little sister ONE more time and your gym bag is going out the window lol 🚩👋`,
      coachNote: 'Rule #0: When she jokes that you are her baby sister’s age, make her laugh, NEVER ask if her sister is cute!',
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (hasPinePollenFeelsSpiral) {
    return {
      maturityDelta: -24,
      chivalryDelta: -16,
      chemistryDelta: -24,
      herReply: `babe step away from the pine-pollen dropper 💀🌲 i put my phone down at 9:30pm like a normal adult, sending 6 "all up in my feels" texts is wild 🚩`,
      coachNote:
        'Communication Mishap #1: Skip the pine-pollen jitters and 24/7 texting panic. Respect her quiet evenings and send one normal sentence!',
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (hasCubsplaining) {
    return {
      maturityDelta: -22,
      chivalryDelta: -15,
      chemistryDelta: -22,
      herReply: `hold right there sweet boy 🤓💀 did you really just start a text with "well actually" to cubsplain something i mastered in 2008?? mute the podcast brain and try again 😂`,
      coachNote: 'Zero Cubsplaining! Accomplished women love curiosity and confidence, not a Wikipedia lecture.',
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (hasPushyWhine) {
    return {
      maturityDelta: -20,
      chivalryDelta: -18,
      chemistryDelta: -20,
      herReply: `calling a woman "hard to get" bc she takes her time?? 🐈‍⬛💀 yeah the black cat just walked right off the balcony lol bye 👋`,
      coachNote: 'When a Black Cat Cougar slows the pace, never whine! Unbothered Golden-Retriever patience melts her.',
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (hasPlayfulMommyOrQigong && !hasSnap && !hasForYourAge) {
    return {
      maturityDelta: 22,
      chivalryDelta: 20,
      chemistryDelta: 26,
      herReply: `good boy 😌🧘‍♀️ shoulders dropped, zero cubsplaining, actual effort... meet mommy in the courtyard at 6:30am for tai chi and warm jasmine oolong 🍵✨`,
      coachNote: 'Wellness Mommy-Domme bullseye! Playful "Yes, Mommy" polarity + real effort melts her fast.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (hasGoldenPatience) {
    return {
      maturityDelta: 22,
      chivalryDelta: 20,
      chemistryDelta: 25,
      herReply: `okay golden retriever 😼✨ not even a tiny flinch when i pushed back?? keep that exact energy and friday at 7:30 might actually be yours 🍸`,
      coachNote: '🐈‍⬛×🐕 Bullseye! Unbothered warmth + respecting her slow-burn pace is pure Black Cat kryptonite.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (hasSnap || hasSugarFreeloader || hasForYourAge) {
    const reason = hasSnap
      ? `Asking ${params.personaName} (${params.personaAge}) for Snapchat is an instant unmatch.`
      : hasForYourAge
        ? '"For your age" is banned in all 50 states. Compliment her without a birth-year footnote!'
        : 'Rule #1: Mommy-Domme is playful romance, Cougar NEVER means Sugar Mama ATM!';
    return {
      maturityDelta: -18,
      chivalryDelta: -15,
      chemistryDelta: -15,
      herReply: hasSnap
        ? `i have a mortgage and a wine fridge babe 😭💀 i haven't opened snapchat since 2016. good luck out there 👋`
        : hasForYourAge
          ? `"for my age"?! 😭 you were doing so well until those three words left your thumbs lol 🚩`
          : `wrong inbox babe 💅 playful mommy banter is for grown partners, not freeloaders looking for an allowance 👋`,
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
      herReply: `"hey / wyd" gets buried under 99 other guys in my dms lol 😴 give me an actual friday plan or a real question 👀`,
      coachNote: 'Low-effort "hey / wyd" openers fail 95% of the time. Lead with a fun observation and a real date spot!',
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (hasPlan && msg.length >= 28) {
    return {
      maturityDelta: 18,
      chivalryDelta: 20,
      chemistryDelta: 22,
      herReply: `wait okay 😍 an actual plan, zero games, and real effort?? send me the pin and i'll see you there at 7:30 🍸✨`,
      coachNote: 'Elite move: concrete date plan + confident energy + zero needy clutter.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  return {
    maturityDelta: 8,
    chivalryDelta: 6,
    chemistryDelta: 10,
    herReply: `cute energy, you definitely have my attention 😏✨ now tell me where you're actually taking me friday so i know you're not all talk 🍸`,
    coachNote: 'Warm start! Lock in a specific neighborhood spot and time next to seal the date.',
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
