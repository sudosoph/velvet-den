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
  if (env.VELVET_KV) {
    for (const id of ['houseboy-linen-apron', 'princess-mulberry-silk-robe', 'cooling-bamboo-sheets', 'zero-proof-botanical-mocktail-set']) {
      try {
        const val = await env.VELVET_KV.get(`aff_clicks:${id}`);
        clicks[id] = Number(val) || 0;
      } catch {
        clicks[id] = 0;
      }
    }
  }

  return jsonResponse({
    authorized: true,
    amazonAssociateTag,
    affiliateProtected: Boolean(amazonAssociateTag),
    sampleClicks: clicks,
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
      herReply: `I run a department and own a wine fridge, sweetie—I haven’t opened Snapchat since Obama’s second term. Try again with a real plan. 👋`,
      maturityDelta: -18,
      chivalryDelta: -15,
      chemistryDelta: -15,
      coachNote: `Never ask ${name} (${age}) for Snapchat—offer your real number and a concrete reservation.`,
      passedVibeCheck: false,
    };
  }

  if (/for\s+(your|ur)\s+age/.test(lower)) {
    return {
      herReply: `"For my age"?! You were doing so well until those three words left your thumbs.`,
      maturityDelta: -15,
      chivalryDelta: -10,
      chemistryDelta: -15,
      coachNote: '"For your age" is an automatic red flag—compliment her directly without age qualifiers!',
      passedVibeCheck: false,
    };
  }

  if (/\b(well\s+actually|let\s+me\s+explain|cubsplain|you\s+probably\s+don.?t\s+know|heard\s+a\s+podcast\s+on)\b/.test(lower)) {
    return {
      herReply: `🤓 Hold right there, sweet boy—did you just start a sentence with "well actually" to Cubsplain something I mastered 15 years ago? Drop your shoulders and try again without the lecture.`,
      maturityDelta: -22,
      chivalryDelta: -15,
      chemistryDelta: -20,
      coachNote: 'Zero Cubsplaining! Curiosity and confidence beat podcast lectures every time.',
      passedVibeCheck: false,
    };
  }

  if (/\b(sugar\s*mama|amex|allowance|spoil\s*me|pay\s*my)\b/.test(lower) || /^(hey+|yo+|sup)\s+mommy[!?.🔥😍👀]*$/i.test(msg)) {
    return {
      herReply: `Rule #1 of Cougars & Cubs Club: Mommy-Domme is playful romantic polarity—Cougar NEVER means Sugar Mama. Better luck out there.`,
      maturityDelta: -20,
      chivalryDelta: -20,
      chemistryDelta: -18,
      coachNote: 'Sugar-Mama freeloading or lazy 2-word openers get instant blocks.',
      passedVibeCheck: false,
    };
  }

  if (/\b(mommy-domme|yes,?\s*mommy|breathe\s+with\s+mommy|qigong|tai\s*chi|cloud\s*hands|jasmine\s*oolong|seed[- ]oil|gluten[- ]free|ghee|tallow|bernedoodle)\b/.test(lower)) {
    return {
      herReply: `🧘‍♀️🥑 Good boy—100% gluten & seed-oil free, zero Cubsplaining, and excited for my tricolor Mini Bernedoodle? Meet Mommy in the courtyard at 6:30 AM. 🍵`,
      maturityDelta: 22,
      chivalryDelta: 20,
      chemistryDelta: 25,
      coachNote: 'Playful Wellness Mommy-Domme polarity + seed-oil-free care unlocked!',
      passedVibeCheck: true,
    };
  }

  if (msg.length < 10) {
    return {
      herReply: `One-word openers get lost in my inbox before noon. Give me two full sentences and an actual Friday plan.`,
      maturityDelta: -10,
      chivalryDelta: -10,
      chemistryDelta: -8,
      coachNote: 'Skip "hey / wyd"—lead with full sentences and an intentional plan.',
      passedVibeCheck: false,
    };
  }

  return {
    herReply: `Now that’s how you get my attention—clear energy, real punctuation, zero games. Text me the spot and I’ll meet you there at 7:30. 🍸`,
    maturityDelta: 18,
    chivalryDelta: 18,
    chemistryDelta: 22,
    coachNote: 'Confident, grown-up courtship unlocked!',
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
  const personaTitle = String(body.personaTitle || 'VP of Product • Cougar').slice(0, 64);
  const personaRole = body.personaRole === 'him' ? 'him' : 'her';

  if (env.AI) {
    try {
      const systemPrompt = [
        `You are roleplaying as ${personaName} (${personaAge}, ${personaTitle}) in "Cougars & Cubs Club", a cheeky, witty, PG-13 romantic comedy game inspired by real adult age-gap dating etiquette.`,
        `STRICT SAFETY RULE: Keep all banter strictly PG-13 cheeky romance (flirty, witty, sharp—NEVER explicit/NSFW).`,
        personaRole === 'her'
          ? `Community etiquette: You radiate cool, unhurried "Black Cat" or serene Qigong "Wellness Mommy-Domme" confidence—you enjoy playful, consensual "Yes, Mommy / good boy" banter when paired with genuine adult respect and concrete plans, and you melt when a sunny "Golden Retriever" Cub responds with unbothered patience and chivalry. You roast "Cubsplaining" ("well actually..."), lazy "hey/wyd" texts, Snapchat requests, whining about "playing hard to get", "for your age" backhanded compliments, and Sugar-Mama/allowance freeloaders.`
          : `Community etiquette: You are a confident, sunny "Golden Retriever" younger man who plans real dates, respects her unhurried Black Cat or playful Mommy-Domme pace without sulking, never Cubsplains, and never plays games.`,
        `Respond ONLY with a valid single-line JSON object matching this exact schema (no markdown fences):`,
        `{"herReply":"1-2 witty in-character sentences","maturityDelta":number(-20..25),"chivalryDelta":number(-20..25),"chemistryDelta":number(-20..25),"coachNote":"1 crisp coaching tip","passedVibeCheck":boolean}`,
      ].join(' ');

      const recentTurns = Array.isArray(body.history)
        ? body.history.slice(-4).map((t) => ({
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
        return jsonResponse({
          herReply: parsed.herReply.slice(0, 360),
          maturityDelta: Math.max(-25, Math.min(25, Number(parsed.maturityDelta ?? 10))),
          chivalryDelta: Math.max(-25, Math.min(25, Number(parsed.chivalryDelta ?? 10))),
          chemistryDelta: Math.max(-25, Math.min(25, Number(parsed.chemistryDelta ?? 12))),
          coachNote: String(parsed.coachNote || 'Live AI Vibe Check complete.').slice(0, 200),
          passedVibeCheck: Boolean(parsed.passedVibeCheck),
          source: 'workers-ai',
        });
      }
    } catch {
      // Fall back cleanly to local deterministic response
    }
  }

  return jsonResponse({
    ...fallbackEvaluateDm(body),
    source: 'local-heuristic',
  });
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
        version: 'v19-organic-affiliates',
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
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
