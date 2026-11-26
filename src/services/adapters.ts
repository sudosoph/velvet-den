/**
 * Unified Phase A + Phase B (Cloudflare KV) + Phase C (Cloudflare Workers AI) Service Layer.
 * Automatically uses live `/api/stats`, `/api/inbox-vet`, and `/api/verify-checkout` on
 * cougarsandcubs.club, while falling back cleanly to deterministic local logic offline or in Vitest.
 */

export interface SplitCrowdStats {
  overall: number[];
  her: number[];
  him: number[];
}

export interface CrowdStatsService {
  getChoicePercentages(episodeId: string, choiceCount: number): Promise<number[]>;
  getSplitChoicePercentages(episodeId: string, choiceCount: number): Promise<SplitCrowdStats>;
  recordChoice(episodeId: string, choiceIndex: number, role?: 'her' | 'him'): Promise<void>;
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

export function getSplitChoicePercentagesSync(
  episodeId: string,
  choiceCount: number,
): SplitCrowdStats {
  const overall = getLocalChoicePercentagesSync(episodeId, choiceCount);
  const buildRole = (role: 'her' | 'him') => {
    if (choiceCount <= 0) return [];
    if (choiceCount === 1) return [100];
    const weights: number[] = [];
    let total = 0;
    for (let i = 0; i < choiceCount; i++) {
      const shift = role === 'her' ? (i === 0 ? 19 : -6) : i === 0 ? -5 : 14;
      const w = Math.max(6, 18 + (hashSeed(`${episodeId}:${role}:${i}`) % 39) + shift);
      weights.push(w);
      total += w;
    }
    const rounded = weights.map((w) => Math.round((w / total) * 100));
    const drift = 100 - rounded.reduce((a, b) => a + b, 0);
    rounded[0] += drift;
    return rounded;
  };
  return {
    overall,
    her: buildRole('her'),
    him: buildRole('him'),
  };
}

function isLiveBrowserRuntime(): boolean {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return false;
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  if (ua.toLowerCase().includes('jsdom')) return false;
  return window.location.protocol === 'https:' || window.location.protocol === 'http:';
}

export const localCrowdStatsService: CrowdStatsService = {
  async getChoicePercentages(episodeId: string, choiceCount: number): Promise<number[]> {
    const split = await this.getSplitChoicePercentages(episodeId, choiceCount);
    return split.overall;
  },

  async getSplitChoicePercentages(
    episodeId: string,
    choiceCount: number,
  ): Promise<SplitCrowdStats> {
    const fallback = getSplitChoicePercentagesSync(episodeId, choiceCount);
    if (isLiveBrowserRuntime()) {
      try {
        const res = await fetch(
          `/api/stats?episodeId=${encodeURIComponent(episodeId)}&choices=${choiceCount}`,
        );
        if (res.ok) {
          const data = (await res.json()) as {
            percentages?: number[];
            herPercentages?: number[];
            himPercentages?: number[];
          };
          if (Array.isArray(data.percentages) && data.percentages.length === choiceCount) {
            return {
              overall: data.percentages,
              her:
                Array.isArray(data.herPercentages) && data.herPercentages.length === choiceCount
                  ? data.herPercentages
                  : fallback.her,
              him:
                Array.isArray(data.himPercentages) && data.himPercentages.length === choiceCount
                  ? data.himPercentages
                  : fallback.him,
            };
          }
        }
      } catch {
        // Fall through to deterministic baseline
      }
    }
    return fallback;
  },

  async recordChoice(
    episodeId: string,
    choiceIndex: number,
    role: 'her' | 'him' = 'her',
  ): Promise<void> {
    if (!isLiveBrowserRuntime()) return;
    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId, choiceIndex, role }),
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
  const age = params.personaAge;

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

  if (params.personaRole === 'him') {
    if (isLazyHey) {
      return {
        maturityDelta: -6,
        chivalryDelta: -4,
        chemistryDelta: -4,
        herReply:
          age >= 30
            ? `Give me one clue on what you are in the mood for Thursday and I will handle the reservation.`
            : age >= 25
              ? `Give me a tiny hint on your Friday vibe and I'll lock in the table ☕`
              : `wait give me one hint on what food u like so i plan friday right 😊`,
        coachNote: 'Give him a clear standard or preference so you can vet how well he plans!',
        passedVibeCheck: false,
        source: 'local-heuristic',
      };
    }
    return {
      maturityDelta: 18,
      chivalryDelta: 20,
      chemistryDelta: 22,
      herReply:
        age >= 30
          ? `7:30 sharp works well. Corner booth reserved, phone stays off the table, and I will pick up the check cleanly.`
          : age >= 25
            ? `7:30 works great. I booked a quiet corner table, zero tech lectures and zero Venmo math ever 🍷`
            : `7:30 sounds amazing!! 😊 ironed a real shirt, booked a real table, and zero Venmo requests i promise ✨`,
      coachNote: 'Green-flag Cub response! Clear standards draw out his best effort.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (hasSisterFumble) {
    return {
      maturityDelta: -25,
      chivalryDelta: -25,
      chemistryDelta: -25,
      herReply:
        age >= 50
          ? `Asking about a relative is the fastest way to end an evening before it starts. Enjoy the rest of your week.`
          : age >= 40
            ? `Asking about my younger sister is bold in all the wrong ways. Have a lovely evening elsewhere.`
            : `Asking if my little sister is single is an immediate exit. Bold fumble, though 👋`,
      coachNote: 'Rule #0: When she jokes about the age gap, make her laugh with poise, NEVER ask if her sister is cute!',
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (hasPinePollenFeelsSpiral) {
    return {
      maturityDelta: -24,
      chivalryDelta: -16,
      chemistryDelta: -24,
      herReply:
        age >= 60
          ? `Please set the pine-pollen dropper aside. I turn my phone off after nine to read, and six anxious midnight messages are not how grown adults court.`
          : age >= 50
            ? `Set the pine-pollen tincture down and take a breath. Quiet weeknights are normal at ${age}, not ghosting, and midnight text spirals do not work for me.`
            : age >= 40
              ? `Please set the pine-pollen dropper down. I put my phone away at 9:30 PM on weeknights, and six anxious texts in a row are a non-starter.`
              : `Step away from the pine-pollen dropper for a second. Quiet weeknights aren't ghosting, and six midnight panic texts in a row are way too much 🍷`,
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
      herReply:
        age >= 60
          ? `Opening with 'well actually' to lecture me on a subject I have lived for decades is bold, I will give you that. Try curiosity next time.`
          : age >= 50
            ? `Did you just open with 'well actually' from a podcast clip? I have been in my field longer than you have had a driver's license. Ask a real question instead.`
            : age >= 40
              ? `Opening with 'well actually' from a podcast to lecture me on my own craft is quite a choice. Drop the monologue and lead with curiosity next time.`
              : `Starting a text with 'well actually' from a podcast is bold when I do this professionally. Retire the lecture and try a real question 😏`,
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
      herReply:
        age >= 50
          ? `Calling a woman 'hard to get' because she keeps standards and a full schedule tells me everything I need to know. Take care.`
          : age >= 40
            ? `Mistaking standards and a full calendar for 'playing hard to get' is an easy pass for me. Best of luck out there.`
            : `Calling a woman 'hard to get' because she doesn't rush for a stranger? That just made my decision very easy 👋`,
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
      herReply:
        age >= 50
          ? `Shoulders relaxed, zero lecturing, and genuine attentiveness. Meet me in the courtyard at 6:30 AM sharp for Qigong and warm jasmine oolong.`
          : age >= 40
            ? `Calm presence, zero lecturing, and real follow-through. Good boy. Meet me in the courtyard at 6:30 AM sharp for Tai Chi and warm jasmine oolong 🍵`
            : `Grounded energy, zero lecturing, and actual effort? Meet me in the courtyard at 6:30 AM for Qigong and warm jasmine oolong ✨`,
      coachNote: 'Wellness Mommy-Domme bullseye! Playful polarity + real effort melts her fast.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (hasGoldenPatience) {
    return {
      maturityDelta: 22,
      chivalryDelta: 20,
      chemistryDelta: 25,
      herReply:
        age >= 60
          ? `Unhurried confidence is rarer than you think. Keep that composure and I will gladly save Friday at 7:30 for you.`
          : age >= 50
            ? `No rushing, no sulking, and an actual sense of timing. Keep that composure and Friday at 7:30 is yours.`
            : age >= 40
              ? `Unhurried confidence without a hint of impatience. You have my attention. Hold that 7:30 table for Friday 🍸`
              : `Zero rushing and actual patience? That already puts you ahead of 95% of my inbox. Keep Friday at 7:30 warm for us 🍷`,
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
    const herReply = hasSnap
      ? age >= 60
        ? `I have not used Snapchat at any point in my life, and I am certainly not starting at ${age}. When you are ready to converse like an adult, let me know.`
        : age >= 50
          ? `I am ${age}. I do not do Snapchat streaks. Exchange real numbers and propose a proper time if you want to take me out.`
          : age >= 40
            ? `I run a team and own a wine cellar. I haven't opened Snapchat in a decade, so try again with a real plan if you'd like my number.`
            : `I haven't opened Snapchat since the dog-filter era. Bring a real Friday plan if you want my actual number ✨`
      : hasForYourAge
        ? age >= 60
          ? `Adding 'for your age' at the end of a compliment undoes all of your charm in three words. A gentleman simply says a woman looks stunning.`
          : age >= 50
            ? `'For your age' is where the conversation ends. Next time, stop the sentence two words earlier.`
            : age >= 40
              ? `You were doing fine right up until 'for your age.' Next time, deliver the compliment without the qualifier.`
              : `You almost had it right up until 'for your age.' Drop the footnote next time 🚩`
        : age >= 50
          ? `You have the wrong impression entirely. I date equals in effort and manners, not dependents.`
          : age >= 40
            ? `Wrong inbox entirely. I enjoy generous, confident company, not someone auditioning for an allowance.`
            : `Wrong inbox. Dating an established woman means matching her effort, not asking for an allowance 👋`;
    return {
      maturityDelta: -18,
      chivalryDelta: -15,
      chemistryDelta: -15,
      herReply,
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
      herReply:
        age >= 60
          ? `A one-word greeting leaves very little to work with. Tell me what caught your eye and where you would take me on Friday.`
          : age >= 50
            ? `'Hey' is not much of an opener. Propose a real Friday plan or call me properly at six.`
            : age >= 40
              ? `One-word openers disappear fast in my inbox. Lead with a real thought and where you'd like to take me Friday.`
              : `A bare 'hey' gets buried pretty quickly in here. Give me a real question or your favorite Friday cocktail spot 🍸`,
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
      herReply:
        age >= 60
          ? `A thoughtful reservation and clear timing without being asked twice. Send the address and I will see you Friday at 7:30.`
          : age >= 50
            ? `Decisive, punctual, and zero back-and-forth. Send me the restaurant details and I will meet you there at 7:30 sharp.`
            : age >= 40
              ? `Decisive, thoughtful, and zero guesswork on my end. I appreciate a man with a real plan. Send the details for 7:30 🍸`
              : `An actual reservation, clear timing, and zero back-and-forth? You have my attention. Send the details and I'll see you at 7:30 🥂`,
      coachNote: 'Elite move: concrete date plan + confident energy + zero needy clutter.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  return {
    maturityDelta: 8,
    chivalryDelta: 6,
    chemistryDelta: 10,
    herReply:
      age >= 60
        ? `Charming start, and I appreciate good manners. Tell me what kind of evening you have in mind for Friday.`
        : age >= 50
          ? `Good start. Now tell me what you actually have in mind for Friday evening so I know you follow through.`
          : age >= 40
            ? `Good composure so far. Tell me what spot you have in mind for Friday evening and we'll see if your taste matches your confidence 🍸`
            : `Good energy so far. Tell me where you'd actually take me Friday so I know you're more than good banter ✨`,
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
