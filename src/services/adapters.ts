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
  secondReply?: string;
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
    playerRole?: 'her' | 'him';
    channelId?: string;
    secondSpeakerName?: string;
    personaLore?: string;
    personaOrigin?: string;
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
  personaId?: string;
  personaName: string;
  personaAge: number;
  personaRole: 'her' | 'him';
  playerRole?: 'her' | 'him';
  channelId?: string;
  secondSpeakerName?: string;
  personaLore?: string;
  personaOrigin?: string;
  platform?: string;
  playerMessage: string;
  history?: LiveInboxTurn[];
}): AiDmVettingResponse {
  const msg = params.playerMessage.trim();
  const lower = msg.toLowerCase();
  const age = params.personaAge;
  const isBritish =
    params.personaId === 'julian-oldsoul-cub' ||
    /\bjulian\b/i.test(params.personaName) ||
    /\b(london|british|hampstead|uk)\b/i.test(params.personaOrigin || '');
  const turnIdx = Array.isArray(params.history)
    ? Math.max(0, params.history.filter((t) => t.sender === 'player').length - 1)
    : 0;

  const hasSnap = /\bsnap(chat)?\b/.test(lower);
  const hasPushyWhine = /hard\s+to\s+get|stuck\s+up|why\s+so\s+cold|hurry\s+up/.test(lower);
  const hasGoldenPatience = /take\s+(all\s+)?(the\s+|your\s+)?time|no\s+rush|worth\s+the\s+wait|whenever\s+you.?re\s+ready/.test(
    lower,
  );
  const hasSisterFumble = /little\s+sister\s+cute|sister\s+single/.test(lower);
  const hasMidnightPanicSpiral =
    /pine\s*pollen|all\s+up\s+in\s+(my|his)\s+feels|up\s+in\s+my\s+feels\s+rn/.test(lower);
  const hasCubsplaining =
    /\b(well\s+actually|let\s+me\s+explain|cubsplain|you\s+probably\s+don.?t\s+know|heard\s+a\s+podcast\s+on)\b/.test(
      lower,
    );
  const hasSugarFreeloader =
    /\b(sugar\s*mama|allowance|spoil\s*me|amex|pay\s*my|cougar\s*bucket|bucket\s*list)\b/.test(lower) ||
    /^(hey+|yo+|sup)\s+(mommy|mummy)[!?.🔥😍👀]*$/i.test(msg);
  const hasPlayfulMommyCadence =
    !hasSugarFreeloader &&
    !hasCubsplaining &&
    /\b(mommy-domme|yes,?\s*mommy|yes,?\s*mummy|whatever\s+you\s+say,?\s*mummy|sorted,?\s*mummy|breathe\s+with\s+mommy|breathwork|tai\s*chi|cloud\s*hands|jasmine\s*oolong|seed[- ]oil|gluten[- ]free|ghee|tallow|golden retriever)\b/.test(
      lower,
    );
  const hasNirvanaOrGenXTouchstone =
    /\b(nirvana|in\s+utero|unplugged|sade|lauryn\s+hill|thumbs[- ]up|period\s+at\s+the\s+end)\b/.test(
      lower,
    );
  const hasForYourAge = /for\s+(your|ur)\s+age/.test(lower) || /\blook\s+good\s+for\b/.test(lower);
  const platform = params.platform || 'tinder';
  const asksForNumberTooEarly =
    platform === 'tinder' &&
    turnIdx === 0 &&
    /\b(whats?\s+(your|ur)\s+number|give\s+me\s+(your|ur)\s+number|can\s+i\s+get\s+(your|ur)\s+number|drop\s+(your|ur)\s+digits)\b/.test(
      lower,
    );
  const isLazyHey =
    msg.length < 10 || /^(hey+|yo+|sup|wyd|u\s*up\??|hi+)$/i.test(msg.replace(/[!?.🔥😍👀]/g, '').trim());
  const hasLivingTogetherTopic =
    /\b(mov(?:e|ing)\s+in|live\s+together|living[- ]apart|separate\s+(?:houses?|places?|apartments?|keys)|own\s+(?:houses?|places?|apartments?|homes?)|two\s+(?:houses?|places?|apartments?|leases?)|merge\s+houses|cohabit)\b/.test(
      lower,
    );
  const hasSplitBillTopic =
    /\b(split\s+(?:the\s+)?(?:bill|check|tab)|went?\s+dutch|go\s+dutch|pay\s+half|50\s*\/\s*50)\b/.test(
      lower,
    );
  const hasSeriousOrCuriousTopic =
    /\b(serious\s+about\s+me|just\s+curious|bucket\s+list|novelty|fetish|actually\s+serious|long[- ]term\s+or)\b/.test(
      lower,
    );
  const hasMoneyGapTopic =
    /\b(money|income|salary|stipend|budget|afford|earn(?:s|ing)?\s+(?:more|less))\b/.test(lower);
  const hasFamilyTopic =
    /\b(mom|mother|parents|family|kids|children|son|daughter|friends\s+think)\b/.test(lower);
  const hasPlan =
    /\b(friday|thursday|saturday|sunday|dinner|tapas|wine|coffee|espresso|7:?30|half\s+seven|sorted|cheeky\s+drink|8:?00|6:?00|6:?30|reservation|table|trail|peonies|call|bench|ribeye|bamboo|silk|upstairs|pillow|oolong|sauna|courtyard|cook|martini)\b/.test(
      lower,
    );

  if (hasSplitBillTopic) {
    const isDiscord = platform === 'discord';
    return {
      maturityDelta: 18,
      chivalryDelta: 18,
      chemistryDelta: 18,
      herReply: isDiscord
        ? `If he invited you out on Date #1 and asked to split the check, pay your half with a warm smile so you owe him nothing—and cross him off your Friday roster.`
        : params.personaRole === 'him'
          ? `Zero 50/50 check math when I invite you out. The tab is handled before your coat is on.`
          : `Whoever extends the invitation handles the check cleanly—splitting pennies on Date #1 kills the spark fast.`,
      secondReply: isDiscord
        ? `Hard co-sign. A man on a tight stipend who treats you to a great $28 wine bar beats a rich guy doing calculator math.`
        : undefined,
      coachNote: 'Whoever invites hosts the check cleanly—alternating turns beats splitting pennies.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (hasSeriousOrCuriousTopic) {
    const isDiscord = platform === 'discord';
    return {
      maturityDelta: 18,
      chivalryDelta: 16,
      chemistryDelta: 20,
      herReply: isDiscord
        ? `Ignore Tuesday compliments and watch three actions: does he lock in Friday plans by Wednesday, hold your hand in front of his friends, and remember small details from your week?`
        : params.personaRole === 'him'
          ? `I don’t do novelty flings—if I ask you out, I want real Friday reservations and introducing you proudly to my inner circle.`
          : `Consistency tells on everyone by Week 3: real contenders plan ahead and never hide you in dimly lit corners.`,
      secondReply: isDiscord
        ? `Amen—curious tourists vanish after 9 PM texts; serious men show up five minutes early on Thursday.`
        : undefined,
      coachNote: 'Weekday consistency and proud public presence separate real contenders from tourists.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (hasLivingTogetherTopic) {
    const isDiscord = platform === 'discord';
    return {
      maturityDelta: 18,
      chivalryDelta: 16,
      chemistryDelta: 20,
      herReply:
        params.personaRole === 'him'
          ? `Zero rush to merge leases—keeping two peaceful sanctuaries makes every weekend together feel electric.`
          : `Living-Apart-Together is my favorite arrangement: deep commitment, shared weekends, and two separate sets of house keys.`,
      secondReply: isDiscord
        ? `Keep both leases for at least year one—missing each other between Tuesday and Friday keeps the chemistry undefeated.`
        : undefined,
      coachNote: 'Direct alignment on living space & autonomy builds instant long-term trust.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (hasMoneyGapTopic) {
    const isDiscord = platform === 'discord';
    return {
      maturityDelta: 18,
      chivalryDelta: 18,
      chemistryDelta: 18,
      herReply:
        params.personaRole === 'him'
          ? `When I invite you out, I plan inside my real budget and get the check cleanly—zero ego about your success.`
          : `Alternating turns works best: plan dates you genuinely enjoy hosting, and let me spoil us when it’s my turn.`,
      secondReply: isDiscord
        ? `Effort and thoughtfulness always outrank flashy receipts in Velvet Palms.`
        : undefined,
      coachNote: 'Healthy, ego-free financial candor passes every Club test.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (hasFamilyTopic) {
    const isDiscord = platform === 'discord';
    return {
      maturityDelta: 18,
      chivalryDelta: 16,
      chemistryDelta: 18,
      herReply:
        params.personaRole === 'him'
          ? `I prep my family warmly ahead of time and introduce the woman I’m dating with total pride.`
          : `Warm advance prep and zero apologies win every room—confident couples set the tone for everyone else.`,
      secondReply: isDiscord
        ? `Never spring a surprise ambush at Sunday brunch—one warm heads-up text makes everything effortless.`
        : undefined,
      coachNote: 'Proud public partnership and thoughtful family boundaries shine.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (asksForNumberTooEarly && params.personaRole !== 'him') {
    return {
      maturityDelta: -8,
      chivalryDelta: -6,
      chemistryDelta: -6,
      herReply:
        age >= 50
          ? `Slow down. Earn two real sentences on the app before asking for my cell.`
          : age >= 40
            ? `Ambitious, darling. Earn a real conversation here before you get my number.`
            : `Whoa, speedrunner. Impress me with two good lines before asking for my digits ✨`,
      coachNote:
        'Earn her number first! Land 2 green-flag replies in the app to unlock off-app iMessage.',
      passedVibeCheck: false,
      source: 'local-heuristic',
    };
  }

  if (params.personaRole === 'him') {
    if (hasSnap || hasSugarFreeloader || hasForYourAge || hasPushyWhine || hasSisterFumble) {
      return {
        maturityDelta: -18,
        chivalryDelta: -15,
        chemistryDelta: -18,
        herReply: hasSnap
          ? `I deleted Snapchat in sophomore year. Text me when you want an actual dinner reservation.`
          : `Yeah, hard pass on the weird energy. Looking for real chemistry, not a gimmick 👋`,
        coachNote: 'Even a Golden Retriever Cub has standards! Drop the red-flag gimmicks.',
        passedVibeCheck: false,
        source: 'local-heuristic',
      };
    }
    if (/\bsplit-tab\b/.test(lower) || /\blinda\b/.test(lower)) {
      return {
        maturityDelta: 16,
        chivalryDelta: 18,
        chemistryDelta: 20,
        herReply:
          age < 24
            ? `okay fair roast 😅 zero split-tab requests ever, dinner's 100% on me!`
            : `Zero split-tab math on my watch. Check is handled before you blink 🍷`,
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
    if (isBritish) {
      const ukLines = [
        `Half seven is sorted. Corner booth booked, peonies riding shotgun, Yes, Mummy xx`,
        `Fancy a cheeky drink first? Proper Cabernet is breathing and my mobile stays off the table x`,
        `Whatever you say, Mummy xx, I'll ring you at six sharp before heading round.`,
      ];
      return {
        maturityDelta: 20,
        chivalryDelta: 22,
        chemistryDelta: 24,
        herReply: ukLines[turnIdx % ukLines.length],
        coachNote: 'Proper British Cub banter unlocked ("half seven", "sorted", and shameless "xx")!',
        passedVibeCheck: true,
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

  if (hasMidnightPanicSpiral) {
    return {
      maturityDelta: -24,
      chivalryDelta: -16,
      chemistryDelta: -24,
      herReply:
        age >= 60
          ? `Kindly set the midnight caffeine dropper aside. Adults do not panic after one quiet hour.`
          : age >= 50
            ? `Put the midnight caffeine dropper down. My phone goes on silent at nine.`
            : age >= 40
              ? `Step away from the midnight caffeine dropper. Reading after 9:30 PM isn't ghosting.`
              : `Put the midnight caffeine dropper down. One quiet hour isn't ghosting 🍷`,
      coachNote:
        'Skip the midnight caffeine jitters and 24/7 texting panic. One calm sentence wins.',
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

  if (hasNirvanaOrGenXTouchstone && !hasSnap && !hasForYourAge) {
    return {
      maturityDelta: 20,
      chivalryDelta: 18,
      chemistryDelta: 24,
      herReply:
        age >= 60
          ? `Sade on vinyl and actual liner notes... you were raised properly. Friday at 7:30.`
          : age >= 50
            ? `Haha. Knowing Nirvana isn't just a Target t-shirt brand wins you Friday. 👍`
            : `Actual album taste and zero panic over punctuation? Hold that 7:30 booth 🍸`,
      coachNote: 'Generational touchstone bullseye! Knowing the music & syntax skips the rookie line.',
      passedVibeCheck: true,
      source: 'local-heuristic',
    };
  }

  if (hasPlayfulMommyCadence && !hasSnap && !hasForYourAge) {
    const isUkMummy = /\bmummy\b/i.test(lower);
    return {
      maturityDelta: 22,
      chivalryDelta: 20,
      chemistryDelta: 26,
      herReply: isUkMummy
        ? age >= 50
          ? `Haha. 'Sorted, Mummy' in a British accent might actually work on me. 7:30 sharp.`
          : `Good boy. Keep that cheeky London 'Mummy xx' energy and don't be late 🍸`
        : age >= 50
          ? `Calm shoulders and zero lecturing. 7:30 sharp tomorrow.`
          : age >= 40
            ? `Good boy. 7:30 sharp tomorrow, and keep that exact poise 🍸`
            : `Grounded energy and zero lecturing? 7:30 sharp tomorrow ✨`,
      coachNote: 'Playful polarity bullseye! Confident poise + real effort melts her fast.',
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
              secondReply:
                typeof data.secondReply === 'string' && data.secondReply.trim()
                  ? data.secondReply.trim()
                  : undefined,
              maturityDelta: Number(data.maturityDelta ?? 10),
              chivalryDelta: Number(data.chivalryDelta ?? 10),
              chemistryDelta: Number(data.chemistryDelta ?? 12),
              coachNote:
                data.coachNote ?? 'Live AI Vibe Check complete, keep matching their energy!',
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
): Promise<{
  verified: boolean;
  grantType?: 'vip' | 'credits' | 'patron';
  credits?: number;
  cameoSessionId?: string;
}> {
  if (!sessionId || !isLiveBrowserRuntime()) return { verified: false };
  try {
    const q = new URLSearchParams({ session_id: sessionId });
    if (tierHint) q.set('tier', tierHint);
    const res = await fetch(`/api/verify-checkout?${q.toString()}`);
    if (!res.ok) return { verified: false };
    return (await res.json()) as {
      verified: boolean;
      grantType?: 'vip' | 'credits' | 'patron';
      credits?: number;
      cameoSessionId?: string;
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
