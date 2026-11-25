/**
 * Cloudflare Worker API + Static SPA Asset Router for Cougars & Cubs Club.
 * Endpoints:
 *   GET  /api/health
 *   GET  /api/stats?episodeId=<id>&choices=3
 *   POST /api/stats  { episodeId, choiceIndex, choiceCount? }
 *   POST /api/inbox-vet { personaName, personaAge, personaTitle, personaRole, playerMessage, history? }
 *   GET  /api/verify-checkout?session_id=<cs_...>
 *   GET  /api/go/:affiliateId?src=<placement>  (Protected Amazon Affiliate Gateway + Click Counter)
 *   POST /api/founder-auth   { passphrase }    (Salted SHA-256 Founder Password Verification)
 *   POST /api/founder-config { passphrase, amazonAssociateTag } (Live KV Affiliate Tag Vault)
 */

export interface KvNamespaceBinding {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface WorkersAiBinding {
  run(
    model: string,
    inputs: {
      messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
      max_tokens?: number;
      temperature?: number;
    },
  ): Promise<{ response?: string | Record<string, unknown> }>;
}

export interface AssetsBinding {
  fetch(request: Request): Promise<Response>;
}

export interface WorkerEnv {
  VELVET_KV?: KvNamespaceBinding;
  AI?: WorkersAiBinding;
  ASSETS?: AssetsBinding;
  STRIPE_SECRET_KEY?: string;
  AMAZON_ASSOCIATE_TAG?: string;
  FOUNDER_PASSWORD_HASH?: string;
}

const FOUNDER_SALT = 'cc_founder_v1:';
const DEFAULT_FOUNDER_SHA256 =
  '6db6ba6ecc5e83f90d1678b2dc636713c7583ac9cdf51b92c10b26c0c9d36dac';

const AFFILIATE_REDIRECT_URLS: Record<string, string> = {
  'houseboy-linen-apron':
    'https://www.amazon.com/s?k=japanese+cross+back+washed+linen+apron+men',
  'trail-hydration-vest':
    'https://www.amazon.com/s?k=ultralight+trail+running+hydration+vest+pack',
  'princess-mulberry-silk-robe':
    'https://www.amazon.com/s?k=100+percent+mulberry+silk+robe+women+22+momme',
  'hosting-lidded-bin-soap':
    'https://www.amazon.com/s?k=matte+black+bathroom+trash+can+with+lid+and+hand+soap+set',
  'percale-hosting-sheets':
    'https://www.amazon.com/s?k=long+staple+cotton+percale+sheet+set+queen+white',
  'date-night-oud-bergamot':
    'https://www.amazon.com/s?k=bergamot+cedar+amber+eau+de+parfum+men',
  'espresso-martini-barware':
    'https://www.amazon.com/s?k=espresso+martini+cocktail+shaker+coupe+glasses+set',
  'after-dark-couples-deck':
    'https://www.amazon.com/s?k=couples+conversation+cards+date+night+game',
  'cooling-bamboo-sheets':
    'https://www.amazon.com/s?k=100+percent+bamboo+viscose+cooling+sheets+queen',
  'cast-iron-steak-skillet':
    'https://www.amazon.com/s?k=12+inch+pre+seasoned+cast+iron+skillet',
  'adjustable-dumbbell-bench':
    'https://www.amazon.com/s?k=foldable+adjustable+weight+bench+home+gym',
  'cub-grooming-beard-skincare-kit':
    'https://www.amazon.com/s?k=sandalwood+beard+oil+mens+skincare+grooming+gift+set',
  'silk-pillowcase-sleepover-duo':
    'https://www.amazon.com/s?k=22+momme+mulberry+silk+pillowcase+queen+claw+clip',
  'zero-proof-botanical-mocktail-set':
    'https://www.amazon.com/s?k=non+alcoholic+botanical+aperitif+mocktail+coupe+glasses',
  'fill-in-love-coupon-cards':
    'https://www.amazon.com/s?k=fill+in+the+blank+love+coupons+cards+for+couples',
  'short-leash-leather-dog-leash':
    'https://www.amazon.com/s?k=braided+leather+short+traffic+dog+leash+brass+clasp',
  'big-carl-giant-wine-glass':
    'https://www.amazon.com/s?k=oversized+giant+full+bottle+wine+glass+funny+gift',
  'chic-candlelit-menu-readers':
    'https://www.amazon.com/s?k=oversized+tortoiseshell+reading+glasses+women+chic',
  'babygirl-movie-prime':
    'https://www.amazon.com/s?k=Babygirl+Nicole+Kidman+Prime+Video+movie',
  'idea-of-you-movie-book':
    'https://www.amazon.com/s?k=The+Idea+of+You+Robinne+Lee+book+and+movie',
  'bridget-jones-cougar-town-watch':
    'https://www.amazon.com/s?k=Bridget+Jones+Mad+About+the+Boy+Prime+Video',
  'seed-oil-free-ghee-evoo-set':
    'https://www.amazon.com/s?k=grass+fed+ghee+and+cold+pressed+extra+virgin+olive+oil',
  'linen-picnic-insulated-tote':
    'https://www.amazon.com/s?k=wicker+picnic+basket+for+2+with+waterproof+blanket',
  'velvet-travel-weekender-duffel':
    'https://www.amazon.com/s?k=mens+canvas+leather+overnight+weekender+duffel+bag',
};

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function verifyFounderPassOnWorker(passphrase: string, env: WorkerEnv): Promise<boolean> {
  const trimmed = passphrase.trim();
  if (trimmed.length < 12) return false;
  const expected = (env.FOUNDER_PASSWORD_HASH || DEFAULT_FOUNDER_SHA256).trim().toLowerCase();
  const actual = await sha256Hex(`${FOUNDER_SALT}${trimmed}`);
  return constantTimeEquals(actual, expected);
}

async function resolveActiveAmazonTag(env: WorkerEnv): Promise<string> {
  const fromEnv = (env.AMAZON_ASSOCIATE_TAG || '').trim();
  if (fromEnv) return fromEnv;
  if (env.VELVET_KV) {
    try {
      const fromKv = await env.VELVET_KV.get('config:amazon_associate_tag');
      if (fromKv && fromKv.trim()) return fromKv.trim();
    } catch {
      // Ignore KV read error
    }
  }
  return '';
}

async function handleAffiliateRedirect(url: URL, productId: string, env: WorkerEnv): Promise<Response> {
  const safeId = sanitizeId(productId, 64).toLowerCase();
  const baseMerchantUrl = AFFILIATE_REDIRECT_URLS[safeId];
  if (!baseMerchantUrl) {
    return jsonResponse({ error: 'Unknown affiliate item' }, 404);
  }

  const dest = new URL(baseMerchantUrl);
  const activeTag = await resolveActiveAmazonTag(env);
  if (activeTag && dest.hostname.toLowerCase().includes('amazon.')) {
    dest.searchParams.set('tag', activeTag);
    dest.searchParams.set('linkCode', 'll2');
    dest.searchParams.set('language', 'en_US');
    dest.searchParams.set('ref_', 'as_li_ss_tl');
  }

  const src = sanitizeId(url.searchParams.get('src'), 48) || 'boutique';
  dest.searchParams.set('utm_source', 'cougarsandcubs');
  dest.searchParams.set('utm_medium', 'affiliate');
  dest.searchParams.set('utm_campaign', src);

  if (env.VELVET_KV) {
    try {
      const key = `aff_clicks:${safeId}`;
      const raw = await env.VELVET_KV.get(key);
      const count = (Number(raw) || 0) + 1;
      await env.VELVET_KV.put(key, String(count));
    } catch {
      // Non-blocking click counter
    }
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: dest.toString(),
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer-when-downgrade',
    },
  });
}

async function handleFounderAuth(request: Request, env: WorkerEnv): Promise<Response> {
  let body: { passphrase?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ authorized: false }, 400);
  }

  const ok = await verifyFounderPassOnWorker(String(body.passphrase || ''), env);
  if (!ok) {
    return jsonResponse({ authorized: false, error: 'Invalid Founder passphrase' }, 401);
  }

  const amazonAssociateTag = await resolveActiveAmazonTag(env);
  const clicks: Record<string, number> = {};
  let recentAiLogs: unknown[] = [];
  if (env.VELVET_KV) {
    for (const id of ['houseboy-linen-apron', 'princess-mulberry-silk-robe', 'cooling-bamboo-sheets', 'zero-proof-botanical-mocktail-set']) {
      try {
        const val = await env.VELVET_KV.get(`aff_clicks:${id}`);
        clicks[id] = Number(val) || 0;
      } catch {
        clicks[id] = 0;
      }
    }
    try {
      const rawLogs = await env.VELVET_KV.get('ai_logs:recent');
      if (rawLogs) {
        const parsedLogs = JSON.parse(rawLogs);
        if (Array.isArray(parsedLogs)) {
          recentAiLogs = parsedLogs.slice(-15).reverse();
        }
      }
    } catch {
      recentAiLogs = [];
    }
  }

  return jsonResponse({
    authorized: true,
    amazonAssociateTag,
    affiliateProtected: Boolean(amazonAssociateTag),
    sampleClicks: clicks,
    recentAiLogs,
  });
}

async function handleFounderConfig(request: Request, env: WorkerEnv): Promise<Response> {
  let body: { passphrase?: string; amazonAssociateTag?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
  }

  const ok = await verifyFounderPassOnWorker(String(body.passphrase || ''), env);
  if (!ok) {
    return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
  }

  const cleanTag = String(body.amazonAssociateTag || '').trim();
  if (cleanTag && !/^[a-zA-Z0-9_-]{3,36}$/.test(cleanTag)) {
    return jsonResponse({ ok: false, error: 'Invalid Amazon Associate Tag format (expected e.g. yourname-20)' }, 400);
  }

  if (env.VELVET_KV) {
    await env.VELVET_KV.put('config:amazon_associate_tag', cleanTag);
  }

  return jsonResponse({
    ok: true,
    amazonAssociateTag: cleanTag,
    affiliateProtected: Boolean(cleanTag),
  });
}

function baselineCounts(episodeId: string, choiceCount: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < choiceCount; i++) {
    arr.push(18 + (hashSeed(`${episodeId}:${i}`) % 39));
  }
  return arr;
}

function countsToPercentages(counts: number[]): number[] {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total <= 0) return counts.map((_, idx) => (idx === 0 ? 100 : 0));
  const rounded = counts.map((c) => Math.round((c / total) * 100));
  const drift = 100 - rounded.reduce((a, b) => a + b, 0);
  rounded[0] += drift;
  return rounded;
}

function sanitizeId(raw: string | null, maxLen = 64): string {
  if (!raw) return '';
  return raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, maxLen);
}

function humanizeChatText(raw: string): string {
  return raw
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s*;\s*/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function scrubPiiForLog(raw: string): string {
  return raw
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]')
    .replace(/\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[phone]')
    .slice(0, 220);
}

async function appendAnonymizedAiLog(
  env: WorkerEnv,
  entry: {
    persona: string;
    platform: string;
    playerMsg: string;
    aiReply: string;
    passed: boolean;
    source: string;
  },
): Promise<void> {
  if (!env.VELVET_KV) return;
  try {
    const raw = await env.VELVET_KV.get('ai_logs:recent');
    const list: unknown[] = raw ? JSON.parse(raw) : [];
    const safeList = Array.isArray(list) ? list : [];
    safeList.push({
      ts: new Date().toISOString(),
      persona: entry.persona.slice(0, 32),
      platform: entry.platform.slice(0, 16),
      playerMsg: scrubPiiForLog(entry.playerMsg),
      aiReply: scrubPiiForLog(entry.aiReply),
      passed: entry.passed,
      source: entry.source,
    });
    await env.VELVET_KV.put('ai_logs:recent', JSON.stringify(safeList.slice(-250)), {
      expirationTtl: 60 * 60 * 24 * 60,
    });
  } catch {
    // Non-blocking telemetry log
  }
}

function fallbackEvaluateDm(req: {
  personaName?: string;
  personaAge?: number;
  playerMessage?: string;
}) {
  const name = (req.personaName || 'Claire').slice(0, 32);
  const age = Number(req.personaAge || 45);
  const msg = String(req.playerMessage || '').trim();
  const lower = msg.toLowerCase();

  if (/\bsnap(chat)?\b/.test(lower)) {
    return {
      herReply: `i run a department and own a wine fridge babe 😭💀 i haven’t opened snapchat since 2016 lol. try again with a real friday plan 👋`,
      maturityDelta: -18,
      chivalryDelta: -15,
      chemistryDelta: -15,
      coachNote: `Skip asking ${name} (${age}) for Snapchat. Offer your real number and an actual spot!`,
      passedVibeCheck: false,
    };
  }

  if (/for\s+(your|ur)\s+age/.test(lower)) {
    return {
      herReply: `"for my age"?! 😭 you were doing so well until those three words left your thumbs lol 🚩`,
      maturityDelta: -15,
      chivalryDelta: -10,
      chemistryDelta: -15,
      coachNote: '"For your age" is an instant unmatch. Compliment her directly!',
      passedVibeCheck: false,
    };
  }

  if (/pine\s*pollen|all\s+up\s+in\s+(my|his)\s+feels|up\s+in\s+my\s+feels\s+rn/.test(lower)) {
    return {
      herReply: `babe put the pine-pollen dropper down 💀🌲 quiet weeknight evenings aren’t ghosting, sending 6 "all up in my feels" texts gets your bubble turned green 🚩`,
      maturityDelta: -24,
      chivalryDelta: -16,
      chemistryDelta: -24,
      coachNote:
        'Align texting expectations calmly and never blame pine pollen for an 11:47 PM meltdown!',
      passedVibeCheck: false,
    };
  }

  if (/\b(well\s+actually|let\s+me\s+explain|cubsplain|you\s+probably\s+don.?t\s+know|heard\s+a\s+podcast\s+on)\b/.test(lower)) {
    return {
      herReply: `hold up sweet boy 🤓💀 did you really just start a text with "well actually" to cubsplain something i mastered 15 years ago?? mute the podcast brain 😂`,
      maturityDelta: -22,
      chivalryDelta: -15,
      chemistryDelta: -20,
      coachNote: 'Zero Cubsplaining! Curiosity and confidence beat podcast lectures every time.',
      passedVibeCheck: false,
    };
  }

  if (/\b(sugar\s*mama|amex|allowance|spoil\s*me|pay\s*my)\b/.test(lower) || /^(hey+|yo+|sup)\s+mommy[!?.🔥😍👀]*$/i.test(msg)) {
    return {
      herReply: `wrong inbox babe 💅 playful mommy banter is for grown partners, cougar never means sugar mama lol 👋`,
      maturityDelta: -20,
      chivalryDelta: -20,
      chemistryDelta: -18,
      coachNote: 'Sugar-Mama freeloading or lazy 2-word openers get instant blocks.',
      passedVibeCheck: false,
    };
  }

  if (/\b(mommy-domme|yes,?\s*mommy|breathe\s+with\s+mommy|qigong|tai\s*chi|cloud\s*hands|jasmine\s*oolong|seed[- ]oil|gluten[- ]free|ghee|tallow|bernedoodle)\b/.test(lower)) {
    return {
      herReply: `good boy 😌🧘‍♀️ 100% gluten + seed oil free, zero cubsplaining, AND excited for my tricolor mini bernedoodle?? meet mommy in the courtyard at 6:30am 🍵✨`,
      maturityDelta: 22,
      chivalryDelta: 20,
      chemistryDelta: 25,
      coachNote: 'Playful Wellness Mommy-Domme polarity + seed-oil-free care unlocked!',
      passedVibeCheck: true,
    };
  }

  if (msg.length < 10) {
    return {
      herReply: `"hey / wyd" gets lost under 99 other guys in my dms lol 😴 give me an actual friday spot or a real question 👀`,
      maturityDelta: -10,
      chivalryDelta: -10,
      chemistryDelta: -8,
      coachNote: 'Skip "hey / wyd" and lead with a fun observation + a real Friday plan.',
      passedVibeCheck: false,
    };
  }

  return {
    herReply: `okay wait 😍 clear energy, actual effort, zero games?? send me the pin and i’ll meet you there at 7:30 🍸✨`,
    maturityDelta: 18,
    chivalryDelta: 18,
    chemistryDelta: 22,
    coachNote: 'Confident, natural courtship unlocked!',
    passedVibeCheck: true,
  };
}

async function handleStatsGet(url: URL, env: WorkerEnv): Promise<Response> {
  const episodeId = sanitizeId(url.searchParams.get('episodeId')) || 'check-drop';
  const choiceCount = Math.min(6, Math.max(2, Number(url.searchParams.get('choices') || 3)));
  const base = baselineCounts(episodeId, choiceCount);

  if (env.VELVET_KV) {
    try {
      const stored = await env.VELVET_KV.get(`stats:${episodeId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (Array.isArray(parsed) && parsed.length === choiceCount) {
          const combined = base.map((b, idx) => b + (Number(parsed[idx]) || 0));
          return jsonResponse({
            episodeId,
            percentages: countsToPercentages(combined),
            source: 'kv',
          });
        }
      }
    } catch {
      // Fall back to baseline
    }
  }

  return jsonResponse({
    episodeId,
    percentages: countsToPercentages(base),
    source: 'baseline',
  });
}

async function handleStatsPost(request: Request, env: WorkerEnv): Promise<Response> {
  let body: { episodeId?: string; choiceIndex?: number; choiceCount?: number } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const episodeId = sanitizeId(body.episodeId ?? null);
  const idx = Number(body.choiceIndex);
  const choiceCount = Math.min(6, Math.max(2, Number(body.choiceCount || 3)));

  if (!episodeId || !Number.isInteger(idx) || idx < 0 || idx >= choiceCount) {
    return jsonResponse({ error: 'Invalid episodeId or choiceIndex' }, 400);
  }

  let liveCounts = new Array<number>(choiceCount).fill(0);
  if (env.VELVET_KV) {
    try {
      const key = `stats:${episodeId}`;
      const existing = await env.VELVET_KV.get(key);
      if (existing) {
        const parsed = JSON.parse(existing) as unknown;
        if (Array.isArray(parsed) && parsed.length === choiceCount) {
          liveCounts = parsed.map((n) => Number(n) || 0);
        }
      }
      liveCounts[idx] += 1;
      await env.VELVET_KV.put(key, JSON.stringify(liveCounts));
    } catch {
      // Non-blocking KV error
    }
  }

  const combined = baselineCounts(episodeId, choiceCount).map((b, i) => b + liveCounts[i]);
  return jsonResponse({
    ok: true,
    episodeId,
    percentages: countsToPercentages(combined),
  });
}

async function handleInboxVet(request: Request, env: WorkerEnv): Promise<Response> {
  let body: {
    personaName?: string;
    personaAge?: number;
    personaTitle?: string;
    personaRole?: 'her' | 'him';
    platform?: string;
    playerMessage?: string;
    history?: { sender: 'player' | 'match'; text: string }[];
  } = {};

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const playerMessage = String(body.playerMessage || '').trim().slice(0, 320);
  if (!playerMessage) {
    return jsonResponse({ error: 'Missing playerMessage' }, 400);
  }

  const personaName = String(body.personaName || 'Claire').slice(0, 32);
  const personaAge = Math.min(75, Math.max(21, Number(body.personaAge || 45)));
  const personaTitle = String(body.personaTitle || 'VP of Product').slice(0, 64);
  const personaRole = body.personaRole === 'him' ? 'him' : 'her';
  const platform = String(body.platform || 'tinder').slice(0, 16);

  if (env.AI) {
    try {
      const priorPlayerTurns = Array.isArray(body.history)
        ? body.history.filter((t) => t.sender === 'player').length
        : 0;
      const stageContext =
        priorPlayerTurns <= 1
          ? 'STAGE 1 (First Spark): React to their opener/plan, tease playfully, and ask a fun follow-up question to keep the conversation rolling!'
          : priorPlayerTurns <= 4
            ? 'STAGE 2 (Pre-Date Chemistry): The first date plan is taking shape! Flirt deeper, ask about their vibe/music/cooking/fitness, or test how they handle your age-gap dynamic.'
            : priorPlayerTurns <= 7
              ? 'STAGE 3 (After Date #1): Pretend Date #1 went great and you are texting the next day! Bring up a fun moment from last night and suggest what to do together this weekend.'
              : 'STAGE 4 (Ongoing Relationship): You two have real momentum now! Banter like an ongoing couple/situationship with inside jokes, weekend plans, and playful affection.';

      const systemPrompt = [
        `You are texting as ${personaName} (${personaAge}, ${personaTitle}) on ${platform} in "Cougars & Cubs Club", a witty PG-13 romantic comedy dating game.`,
        `STRICT SAFETY RULE: Keep banter PG-13 cheeky & flirty, NEVER explicit/NSFW.`,
        `DYNAMIC MULTI-TURN PROGRESSION: ${stageContext} NEVER end the conversation abruptly; always give them something fun, flirty, or intriguing to reply to so the chat keeps flowing naturally!`,
        `CRITICAL HUMAN TEXTING STYLE: Text like a REAL attractive human on Tinder / iMessage, NEVER like an AI chatbot or novelist! NEVER use em-dashes (—), en-dashes (–), or semicolons (;). NEVER use stiff phrases like "how quaint", "meanwhile", or "ah,". Write 1-2 short, natural, punchy text sentences with casual rhythm (contractions, occasional "lol", "wait", "tbh", "babe", or "...") and 1 to 3 natural emojis (😏, 🍸, 😭, 💀, 👀, ✨, 😍, 🚩).`,
        personaRole === 'her'
          ? `Vibe: You have cool "Black Cat" or warm "Wellness Mommy-Domme" confidence. You love playful "Yes, Mommy / good boy" banter when paired with real effort and concrete date plans, and you melt for unbothered "Golden Retriever" warmth. Roast "Cubsplaining" ("well actually..."), pine-pollen biohackers sending "all up in my feels" midnight walls of text, lazy "hey/wyd" texts, Snapchat requests, "for your age", and Sugar-Mama freeloaders.`
          : `Vibe: You are a charming, sunny "Golden Retriever" younger man who plans real dates, uses natural emojis, respects her pace without sulking, and never Cubsplains.`,
        `Respond ONLY with a valid single-line JSON object matching this exact schema (no markdown fences):`,
        `{"herReply":"1-2 natural text-message sentences with emojis, ZERO em-dashes, and a hook to keep chatting","maturityDelta":number(-20..25),"chivalryDelta":number(-20..25),"chemistryDelta":number(-20..25),"coachNote":"1 short punchy tip without em-dashes","passedVibeCheck":boolean}`,
      ].join(' ');

      const recentTurns = Array.isArray(body.history)
        ? body.history.slice(-16).map((t) => ({
            role: (t.sender === 'player' ? 'user' : 'assistant') as 'user' | 'assistant',
            content: String(t.text || '').slice(0, 280),
          }))
        : [];

      const chatPayload = {
        messages: [
          { role: 'system' as const, content: systemPrompt },
          ...recentTurns,
          { role: 'user' as const, content: playerMessage },
        ],
        max_tokens: 240,
        temperature: 0.7,
      };

      let rawResult: { response?: string | Record<string, unknown> };
      try {
        rawResult = await env.AI.run(
          '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
          chatPayload,
        );
      } catch {
        rawResult = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', chatPayload);
      }

      let parsed: Record<string, unknown> | null = null;
      if (rawResult?.response && typeof rawResult.response === 'object') {
        parsed = rawResult.response;
      } else if (typeof rawResult?.response === 'string') {
        const jsonMatch = rawResult.response.trim().match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
        }
      }

      if (parsed && typeof parsed.herReply === 'string' && parsed.herReply.trim()) {
        const cleanReply = humanizeChatText(parsed.herReply).slice(0, 360);
        const cleanCoach = humanizeChatText(
          String(parsed.coachNote || 'Live Vibe Check complete!'),
        ).slice(0, 200);
        const passed = Boolean(parsed.passedVibeCheck);
        await appendAnonymizedAiLog(env, {
          persona: `${personaName} (${personaAge})`,
          platform,
          playerMsg: playerMessage,
          aiReply: cleanReply,
          passed,
          source: 'workers-ai',
        });
        return jsonResponse({
          herReply: cleanReply,
          maturityDelta: Math.max(-25, Math.min(25, Number(parsed.maturityDelta ?? 10))),
          chivalryDelta: Math.max(-25, Math.min(25, Number(parsed.chivalryDelta ?? 10))),
          chemistryDelta: Math.max(-25, Math.min(25, Number(parsed.chemistryDelta ?? 12))),
          coachNote: cleanCoach,
          passedVibeCheck: passed,
          source: 'workers-ai',
        });
      }
    } catch {
      // Fall back cleanly to local deterministic response
    }
  }

  const fb = fallbackEvaluateDm(body);
  await appendAnonymizedAiLog(env, {
    persona: `${personaName} (${personaAge})`,
    platform,
    playerMsg: playerMessage,
    aiReply: fb.herReply,
    passed: fb.passedVibeCheck,
    source: 'local-heuristic',
  });
  return jsonResponse({
    ...fb,
    source: 'local-heuristic',
  });
}

async function handleAiFeedback(request: Request, env: WorkerEnv): Promise<Response> {
  let body: { persona?: string; reaction?: string; aiReply?: string; note?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ ok: false }, 400);
  }
  if (env.VELVET_KV) {
    try {
      const raw = await env.VELVET_KV.get('ai_feedback:recent');
      const list: unknown[] = raw ? JSON.parse(raw) : [];
      const safe = Array.isArray(list) ? list : [];
      safe.push({
        ts: new Date().toISOString(),
        persona: String(body.persona || '').slice(0, 32),
        reaction: String(body.reaction || '').slice(0, 12),
        aiReply: scrubPiiForLog(String(body.aiReply || '')),
        note: scrubPiiForLog(String(body.note || '')),
      });
      await env.VELVET_KV.put('ai_feedback:recent', JSON.stringify(safe.slice(-200)), {
        expirationTtl: 60 * 60 * 24 * 60,
      });
    } catch {
      // Ignore KV write error
    }
  }
  return jsonResponse({ ok: true });
}

async function handleSubscribe(request: Request, env: WorkerEnv): Promise<Response> {
  let body: { email?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }
  const email = String(body.email || '').trim().toLowerCase();
  if (!email || !email.includes('@') || email.length > 160) {
    return jsonResponse({ error: 'Invalid email' }, 400);
  }
  if (env.VELVET_KV) {
    try {
      const raw = await env.VELVET_KV.get('subscribers:emails');
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(email)) {
        list.push(email);
        await env.VELVET_KV.put('subscribers:emails', JSON.stringify(list));
      }
    } catch {
      // Ignore KV write error
    }
  }
  return jsonResponse({ ok: true });
}

async function handleRestoreVip(request: Request, env: WorkerEnv): Promise<Response> {
  let body: { email?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ restored: false }, 400);
  }
  const email = String(body.email || '').trim().toLowerCase();
  if (!email || !email.includes('@') || !env.VELVET_KV) {
    return jsonResponse({ restored: false });
  }
  try {
    const found = await env.VELVET_KV.get(`vip_email:${email}`);
    return jsonResponse({ restored: Boolean(found) });
  } catch {
    return jsonResponse({ restored: false });
  }
}

async function handleReferralHit(request: Request, env: WorkerEnv): Promise<Response> {
  let body: { refCode?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ ok: false }, 400);
  }
  const refCode = sanitizeId(body.refCode ?? null, 16).toLowerCase();
  if (!refCode || !refCode.startsWith('vd') || !env.VELVET_KV) {
    return jsonResponse({ ok: false });
  }
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'anon';
    const ua = (request.headers.get('User-Agent') || '').slice(0, 64);
    const visitorHash = String(hashSeed(`${refCode}:${ip}:${ua}`));
    const listKey = `ref_visitors:${refCode}`;
    const raw = await env.VELVET_KV.get(listKey);
    const visitors: string[] = raw ? JSON.parse(raw) : [];
    if (!visitors.includes(visitorHash) && visitors.length < 25) {
      visitors.push(visitorHash);
      await env.VELVET_KV.put(listKey, JSON.stringify(visitors));
    }
    return jsonResponse({ ok: true, uniqueReferrals: visitors.length });
  } catch {
    return jsonResponse({ ok: false });
  }
}

async function handleReferralStatus(url: URL, env: WorkerEnv): Promise<Response> {
  const refCode = sanitizeId(url.searchParams.get('code'), 16).toLowerCase();
  if (!refCode || !refCode.startsWith('vd') || !env.VELVET_KV) {
    return jsonResponse({ uniqueReferrals: 0, claimableSlots: 0 });
  }
  try {
    const raw = await env.VELVET_KV.get(`ref_visitors:${refCode}`);
    const visitors: string[] = raw ? JSON.parse(raw) : [];
    return jsonResponse({
      uniqueReferrals: visitors.length,
      claimableSlots: Math.min(3, visitors.length),
    });
  } catch {
    return jsonResponse({ uniqueReferrals: 0, claimableSlots: 0 });
  }
}

async function handleCameoBrief(request: Request, env: WorkerEnv): Promise<Response> {
  let body: { email?: string; brief?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
  }
  const email = String(body.email || '').trim().toLowerCase().slice(0, 160);
  const brief = String(body.brief || '').trim().slice(0, 500);
  if (!email.includes('@') || brief.length < 10) {
    return jsonResponse({ ok: false, error: 'Valid email and 10+ char brief required' }, 400);
  }
  if (env.VELVET_KV) {
    try {
      const raw = await env.VELVET_KV.get('cameo_briefs:list');
      const list: { email: string; brief: string; createdAt: string }[] = raw ? JSON.parse(raw) : [];
      list.push({ email, brief, createdAt: new Date().toISOString() });
      await env.VELVET_KV.put('cameo_briefs:list', JSON.stringify(list.slice(-200)));
    } catch {
      // Non-blocking KV error
    }
  }
  return jsonResponse({ ok: true });
}

async function handleVerifyCheckout(url: URL, env: WorkerEnv): Promise<Response> {
  const sessionId = sanitizeId(url.searchParams.get('session_id'), 120);
  if (!sessionId || !sessionId.startsWith('cs_')) {
    return jsonResponse({ verified: false, reason: 'Invalid session_id' }, 400);
  }

  if (env.VELVET_KV) {
    const alreadyRedeemed = await env.VELVET_KV.get(`redeemed_session:${sessionId}`);
    if (alreadyRedeemed) {
      return jsonResponse({ verified: false, reason: 'Session already redeemed' });
    }
  }

  if (!env.STRIPE_SECRET_KEY) {
    return jsonResponse({ verified: false, reason: 'Stripe secret not yet configured' }, 503);
  }

  try {
    const stripeRes = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        },
      },
    );
    if (!stripeRes.ok) {
      return jsonResponse({ verified: false }, 400);
    }
    const session = (await stripeRes.json()) as {
      payment_status?: string;
      amount_total?: number;
      metadata?: { tier?: string };
      customer_details?: { email?: string };
    };
    if (session.payment_status !== 'paid') {
      return jsonResponse({ verified: false });
    }

    const amt = typeof session.amount_total === 'number' ? session.amount_total : 0;
    const isCameo = amt >= 2500 || session.metadata?.tier === 'cameo';
    const isVip = isCameo || session.metadata?.tier === 'vip' || amt >= 600;
    const isTip = !isVip && amt >= 450 && amt < 600;
    const credits = isCameo ? 50 : isTip ? 10 : 15;

    if (env.VELVET_KV) {
      await env.VELVET_KV.put(`redeemed_session:${sessionId}`, new Date().toISOString());
      const buyerEmail = session.customer_details?.email?.trim().toLowerCase();
      if (isVip && buyerEmail) {
        await env.VELVET_KV.put(`vip_email:${buyerEmail}`, sessionId);
      }
    }

    return jsonResponse({
      verified: true,
      grantType: isVip ? 'vip' : 'credits',
      credits,
    });
  } catch {
    return jsonResponse({ verified: false }, 500);
  }
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      const activeTag = await resolveActiveAmazonTag(env);
      return jsonResponse({
        ok: true,
        service: 'cougars-and-cubs-club',
        version: 'v24-aligned-hub-polish',
        kvBound: Boolean(env.VELVET_KV),
        aiBound: Boolean(env.AI),
        stripeConfigured: Boolean(env.STRIPE_SECRET_KEY),
        affiliateGatewayActive: true,
        affiliateTagConfigured: Boolean(activeTag),
      });
    }

    if (url.pathname.startsWith('/api/go/')) {
      if (request.method === 'GET') {
        const productId = decodeURIComponent(url.pathname.slice('/api/go/'.length));
        return handleAffiliateRedirect(url, productId, env);
      }
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/founder-auth') {
      if (request.method === 'POST') return handleFounderAuth(request, env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/founder-config') {
      if (request.method === 'POST') return handleFounderConfig(request, env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/stats') {
      if (request.method === 'GET') return handleStatsGet(url, env);
      if (request.method === 'POST') return handleStatsPost(request, env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/inbox-vet') {
      if (request.method === 'POST') return handleInboxVet(request, env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/ai-feedback') {
      if (request.method === 'POST') return handleAiFeedback(request, env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/verify-checkout') {
      if (request.method === 'GET') return handleVerifyCheckout(url, env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/subscribe') {
      if (request.method === 'POST') return handleSubscribe(request, env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/cameo-brief') {
      if (request.method === 'POST') return handleCameoBrief(request, env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/restore-vip') {
      if (request.method === 'POST') return handleRestoreVip(request, env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/referral-hit') {
      if (request.method === 'POST') return handleReferralHit(request, env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/referral-status') {
      if (request.method === 'GET') return handleReferralStatus(url, env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (env.ASSETS) {
      const assetRes = await env.ASSETS.fetch(request);
      const ct = assetRes.headers.get('content-type') || '';
      if (ct.includes('text/html')) {
        const headers = new Headers(assetRes.headers);
        headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        headers.set('CDN-Cache-Control', 'no-store');
        return new Response(assetRes.body, {
          status: assetRes.status,
          headers,
        });
      }
      return assetRes;
    }

    return new Response('Not Found', { status: 404 });
  },
};
