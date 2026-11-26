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
  history?: LiveInboxTurn[];
}): AiDmVettingResponse {
  const msg = params.playerMessage.trim();
  const lower = msg.toLowerCase();
  const age = params.personaAge;
  const turnIdx = Array.isArray(params.history)
    ? Math.max(0, params.history.filter((t) => t.sender === 'player').length - 1)
    : 0;

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
    msg.length < 10 || /^(hey+|yo+|sup|wyd|u\s*up\??|hi+)$/i.test(msg.replace(/[!?.🔥😍👀]/g, '').trim());
  const hasPlan =
    /\b(friday|thursday|saturday|sunday|dinner|tapas|wine|coffee|espresso|7:?30|8:?00|6:?00|6:?30|reservation|table|trail|peonies|call|bench|ribeye|bamboo|silk|upstairs|pillow|oolong|sauna|courtyard|cook|martini)\b/.test(
      lower,
    );

  if (params.personaRole === 'him') {
    if (/\bvenmo\b/.test(lower) || /\blinda\b/.test(lower)) {
      return {
        maturityDelta: 16,
        chivalryDelta: 18,
        chemistryDelta: 20,
        herReply:
          age < 24
            ? `okay fair roast 😅 zero Venmo requests ever, dinner's 100% on me!`
            : `Zero Venmo math on my watch. Check is handled before you blink 🍷`,
        coachNote: 'Smart test! Vetting his check etiquette early saves a Friday night.',
        passedVibeCheck: true,
        source: 'local-heuristic',
      };
    }
    if (isLazyHey) {
      return {
        maturityDelta: -6,
        chivalryDelta: -4,
        chemistryDelta: -4,
        herReply:
          age >= 30
            ? `Give me one hint on your mood and I'll lock in Thursday.`
            : age >= 25
              ? `Give me one clue: wine bar or late-night sushi? ☕`
              : `give me one hint so i plan friday right 😊 wine or tacos?`,
        coachNote: 'Drop one playful cue so you can test how fast he plans!',
        passedVibeCheck: false,
        source: 'local-heuristic',
      };
    }
    const cubLines =
      age >= 30
        ? [
            `7:30 sharp works. Corner booth is booked and my phone stays off the table.`,
            `Deal. I'll call you at six tomorrow instead of blowing up your phone.`,
            `Four crisp pillows on my bed, for the record. Pick you up at 7:30?`,
          ]
        : age >= 25
          ? [
              `7:30 works great. Quiet corner table booked, zero startup talk all night 🍷`,
              `Deal. Fair warning, I'm cooking you pasta on Date #2.`,
              `Six o'clock phone call tomorrow it is. Looking forward to hearing your voice ✨`,
            ]
          : [
              `7:30 works!! 😊 ironed a real shirt and booked us an actual table ✨`,
              `deal!! fair warning im showing up 10 mins early with flowers`,
              `phone stays face-down all dinner, promise 😊`,
            ];
    return {
      maturityDelta: 18,
      chivalryDelta: 20,
      chemistryDelta: 22,
      herReply: cubLines[turnIdx % cubLines.length],
      coachNote: 'Green-flag Cub banter! Keep testing his follow-through one line at a time.',
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
          ? `Asking about a relative is a world-record exit. Enjoy your evening alone.`
          : age >= 40
            ? `Asking about my younger sister is bold in all the wrong ways. Goodbye.`
            : `Asking if my sister is single is an Olympic-level fumble 👋`,
      coachNote: 'Rule #0: Never ask if her sister is cute!',
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
          ? `Kindly set the pine-pollen dropper aside. Adults do not panic after one quiet hour.`
          : age >= 50
            ? `Put the pine-pollen dropper down. My phone goes on silent at nine.`
            : age >= 40
              ? `Step away from the pine-pollen dropper. Reading after 9:30 PM isn't ghosting.`
              : `Put the pine-pollen dropper down. One quiet hour isn't ghosting 🍷`,
      coachNote:
        'Skip the pine-pollen jitters and 24/7 texting panic. One calm sentence wins.',
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
          ? `Lecturing me from a ten-minute podcast is ambitious, darling. Try a question instead.`
          : age >= 50
            ? `Starting a sentence with 'well actually' from a podcast is brave. Incorrect, though.`
            : age >= 40
              ? `Did you just 'well actually' me from a podcast clip? Bold last words.`
              : `Did a podcast host hijack your thumbs just now? Try that again 😏`,
      coachNote: 'Zero Cubsplaining! Curiosity beats a podcast lecture every time.',
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
          ? `Mistaking a full calendar for 'playing hard to get' makes my evening very easy.`
          : age >= 40
            ? `Calling standards 'hard to get' just freed up my Friday night. Take care.`
            : `Calling me 'hard to get' on message two? That solved my Friday dilemma 👋`,
      coachNote: 'When a Black Cat Cougar paces things, never whine. Unbothered patience melts her.',
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
          ? `Calm shoulders and zero lecturing. Courtyard at 6:30 sharp tomorrow.`
          : age >= 40
            ? `Good boy. Courtyard at 6:30 sharp, and don't make me fix your posture twice 🍵`
            : `Grounded energy and zero lecturing? Courtyard at 6:30 sharp tomorrow ✨`,
      coachNote: 'Wellness Mommy-Domme bullseye! Playful poise + real effort melts her fast.',
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
          ? `Unhurried confidence is rarer than you think. Save Friday at 7:30 for me.`
          : age >= 50
            ? `No rushing and zero sulking. Keep that poise and Friday at 7:30 is yours.`
            : age >= 40
              ? `Unhurried confidence without flinching. Hold that 7:30 table for Friday 🍸`
              : `Zero rushing and actual patience? Keep Friday at 7:30 warm for us 🍷`,
      coachNote: '🐈‍⬛×🐕 Bullseye! Unbothered warmth + respecting her pace is pure kryptonite.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (hasSnap || hasSugarFreeloader || hasForYourAge) {
    const reason = hasSnap
      ? `Asking ${params.personaName} (${params.personaAge}) for Snapchat is an instant unmatch.`
      : hasForYourAge
        ? '"For your age" is banned in all 50 states. Drop the birth-year footnote!'
        : 'Rule #1: Cougar NEVER means Sugar Mama ATM!';
    const herReply = hasSnap
      ? age >= 60
        ? `I have survived sixty years without Snapchat and intend to keep my streak at zero.`
        : age >= 50
          ? `I am ${age}, not collecting streaks. Call me when you have a real reservation.`
          : age >= 40
            ? `The last time I opened Snapchat, Obama was in office. Try a real drink spot.`
            : `My Snapchat retired with the dog filter in 2016. Got a real Friday bar? ✨`
      : hasForYourAge
        ? age >= 60
          ? `Three words too long, darling. Stop the compliment right before 'for your age.'`
          : age >= 50
            ? `Next time, stop the sentence two words before 'for your age.'`
            : age >= 40
              ? `You had me right up until 'for your age.' Try that compliment without the footnote.`
              : `So close, right up until 'for your age.' Drop the footnote next time 🚩`
        : age >= 50
          ? `Wrong impression entirely. I date equals in manners, not dependents.`
          : age >= 40
            ? `I'm a date, not a scholarship committee. Best of luck out there.`
            : `Wrong inbox. I date grown partners, not dependents 👋`;
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
          ? `One word is hardly an introduction. Tell me where you would take me Friday.`
          : age >= 50
            ? `'Hey' won't cut it. Propose a real Friday spot or call me at six.`
            : age >= 40
              ? `You get one redo better than 'hey.' Where are you taking me Friday?`
              : `A bare 'hey' gets buried fast in here. Got a favorite Friday bar? 🍸`,
      coachNote: 'Skip one-word openers and lead with one witty line or a real spot!',
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (hasPlan && msg.length >= 22) {
    const planLines =
      age >= 60
        ? [
            `A man who books a proper table without twenty questions. See you at 7:30.`,
            `Thoughtful timing and good manners. Tell me, red wine or a dry martini?`,
          ]
        : age >= 50
          ? [
              `Punctual and decisive. Send the restaurant name and do not be late.`,
              `Good instinct. Call me at six Thursday so I know your voice matches your text.`,
            ]
          : age >= 40
            ? [
                `Decisive and zero homework for me. Send the address for 7:30 🍸`,
                `Smooth move. Fair warning, I judge a man by how he treats the bartender.`,
              ]
            : [
                `An actual reservation without twenty back-and-forth texts? Send the pin for 7:30 🥂`,
                `Okay, points for decisiveness. Can you actually hold conversation without checking your phone?`,
              ];
    return {
      maturityDelta: 18,
      chivalryDelta: 20,
      chemistryDelta: 22,
      herReply: planLines[turnIdx % planLines.length],
      coachNote: 'Elite 1-liner: decisive plan + confident charm keeps her hooked!',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  const banterLines =
    age >= 60
      ? [
          `Charming start. Now tell me what kind of evening you have in mind for Friday.`,
          `Witty, I will give you that. Do you cook, or do you know a good bistro?`,
        ]
      : age >= 50
        ? [
            `Good start. Now tell me where you are actually taking me Friday.`,
            `Not bad at all. Are you all banter, or do you book reservations too?`,
          ]
        : age >= 40
          ? [
              `Bold start. Tell me what Friday spot you have up your sleeve 🍸`,
              `Careful, dry wit works fast on me. Can you actually cook, or just flirt?`,
            ]
          : [
              `Good energy so far. Where are you taking me Friday to back it up? ✨`,
              `Cute line. Quick test: quiet corner wine bar or loud club?`,
            ];
  return {
    maturityDelta: 8,
    chivalryDelta: 6,
    chemistryDelta: 10,
    herReply: banterLines[turnIdx % banterLines.length],
    coachNote: 'Fun 1-line volley! Lock in a Friday spot next to turn banter into a date.',
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
