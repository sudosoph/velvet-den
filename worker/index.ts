/**
 * Cloudflare Worker API + Static SPA Asset Router for Cougars & Cubs Club (v35).
 * Endpoints:
 *   GET  /api/health
 *   GET  /api/stats?episodeId=<id>&choices=3
 *   POST /api/stats  { episodeId, choiceIndex, choiceCount? }
 *   POST /api/inbox-vet { personaName, personaAge, personaTitle, personaRole, playerMessage, history? }
 *   GET  /api/verify-checkout?session_id=<cs_...>
 *   GET|HEAD /api/go/:affiliateId?src=<placement>  (Specific /dp/<ASIN> Amazon Affiliate Gateway)
 *   POST /api/founder-auth   { passphrase }
 *   POST /api/founder-config { passphrase, amazonAssociateTag }
 */

import { PostHog } from 'posthog-node/edge';

export interface KvNamespaceBinding {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface ExecutionContextLike {
  waitUntil(promise: Promise<unknown>): void;
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
  POSTHOG_PROJECT_TOKEN?: string;
  POSTHOG_HOST?: string;
}

const FOUNDER_SALT = 'cc_founder_v1:';
const DEFAULT_FOUNDER_SHA256 =
  '6db6ba6ecc5e83f90d1678b2dc636713c7583ac9cdf51b92c10b26c0c9d36dac';
const DEFAULT_AMAZON_ASSOCIATE_TAG = 'cougarsandcub-20';

const AFFILIATE_REDIRECT_URLS: Record<string, string> = {
  'trophy-boyfriend-cooking-apron': 'https://www.amazon.com/dp/B0BXXDBB8F',
  'leopard-print-cougar-apron': 'https://www.amazon.com/dp/B0GLPF6K39',
  'good-boy-brass-training-clicker': 'https://www.amazon.com/dp/B08FQQ3R3S',
  'funny-cougar-stemless-wine-glass': 'https://www.amazon.com/dp/B077TC25XQ',
  'golden-retriever-boyfriend-mug': 'https://www.amazon.com/dp/B07MLLXW4Q',
  'black-cat-girlfriend-leopard-mug': 'https://www.amazon.com/dp/B0DNJ8P9Z3',
  'cougar-hunter-retro-trucker-hat': 'https://www.amazon.com/dp/B0D5BRYPVT',
  'houseboy-linen-apron': 'https://www.amazon.com/dp/B093GJW13K',
  'trail-hydration-vest': 'https://www.amazon.com/dp/B0D59W2JZX',
  'princess-mulberry-silk-robe': 'https://www.amazon.com/dp/B0FD3H89H5',
  'hosting-lidded-bin-soap': 'https://www.amazon.com/dp/B0FHH85CXQ',
  'percale-hosting-sheets': 'https://www.amazon.com/dp/B0C7LGBLYJ',
  'date-night-oud-bergamot': 'https://www.amazon.com/dp/B0DX3V4YC1',
  'espresso-martini-barware': 'https://www.amazon.com/dp/B08KQCX9Z9',
  'after-dark-couples-deck': 'https://www.amazon.com/dp/B0B7V56B7H',
  'cooling-bamboo-sheets': 'https://www.amazon.com/dp/B08HR2WW6T',
  'cast-iron-steak-skillet': 'https://www.amazon.com/dp/B0BFQ1SV7X',
  'adjustable-dumbbell-bench': 'https://www.amazon.com/dp/B07HNLBZ4Y',
  'cub-grooming-beard-skincare-kit': 'https://www.amazon.com/dp/B0B84DJXSW',
  'silk-pillowcase-sleepover-duo': 'https://www.amazon.com/dp/B00V5WN3HE',
  'zero-proof-botanical-mocktail-set': 'https://www.amazon.com/dp/B0B545FNBW',
  'fill-in-love-coupon-cards': 'https://www.amazon.com/dp/B0D9LZGXXM',
  'short-leash-leather-dog-leash': 'https://www.amazon.com/dp/B0H2XPRGDS',
  'big-carl-giant-wine-glass': 'https://www.amazon.com/dp/B0053T01UM',
  'chic-candlelit-menu-readers': 'https://www.amazon.com/dp/B088JPW8PD',
  'no-hard-feelings-jlaw-prime': 'https://www.amazon.com/dp/B0C8BTYH4M',
  'part-of-your-world-book': 'https://www.amazon.com/dp/1538704374',
  'babygirl-movie-prime': 'https://www.amazon.com/dp/B0DTK694FD',
  'idea-of-you-movie-book': 'https://www.amazon.com/dp/B01MQLZ12X',
  'bridget-jones-cougar-town-watch': 'https://www.amazon.com/dp/0099584433',
  'the-rebound-zeta-jones-prime': 'https://www.amazon.com/dp/B006JIL0AG',
  'linen-picnic-insulated-tote': 'https://www.amazon.com/dp/B0GS1TFTY6',
  'velvet-travel-weekender-duffel': 'https://www.amazon.com/dp/B0GTQF7ZK9',
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
  return DEFAULT_AMAZON_ASSOCIATE_TAG;
}

async function resolveActivePostHogToken(env: WorkerEnv): Promise<string> {
  const fromEnv = (env.POSTHOG_PROJECT_TOKEN || '').trim();
  if (fromEnv && fromEnv.startsWith('phc_') && fromEnv !== 'phc_your_project_token_here') {
    return fromEnv;
  }
  if (env.VELVET_KV) {
    try {
      const fromKv = (await env.VELVET_KV.get('config:posthog_project_token'))?.trim() || '';
      if (fromKv && fromKv.startsWith('phc_') && fromKv !== 'phc_your_project_token_here') {
        return fromKv;
      }
    } catch {
      // Ignore KV read error
    }
  }
  return '';
}

function resolvePostHogIdentity(request: Request): { distinctId: string; sessionId?: string } {
  const headerDistinct = (request.headers.get('X-POSTHOG-DISTINCT-ID') || '').trim();
  const headerSession = (request.headers.get('X-POSTHOG-SESSION-ID') || '').trim();
  const distinctId = /^cc_[a-zA-Z0-9_-]{4,80}$/.test(headerDistinct)
    ? headerDistinct
    : `cc_edge_${hashSeed(
        `${request.headers.get('CF-Connecting-IP') || 'anon'}:${(request.headers.get('User-Agent') || '').slice(0, 64)}`,
      )}`;
  const sessionId = /^[a-zA-Z0-9_-]{6,80}$/.test(headerSession) ? headerSession : undefined;
  return { distinctId, sessionId };
}

function scheduleEdgePostHogEvent(
  request: Request,
  env: WorkerEnv,
  ctx: ExecutionContextLike | undefined,
  event: string,
  properties: Record<string, unknown>,
): void {
  const work = (async () => {
    const token = await resolveActivePostHogToken(env);
    if (!token) return;
    const { distinctId, sessionId } = resolvePostHogIdentity(request);
    const host = (env.POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '');
    const client = new PostHog(token, {
      host,
      flushAt: 1,
      flushInterval: 0,
    });
    try {
      await client.captureImmediate({
        distinctId,
        event,
        properties: {
          ...properties,
          app: 'cougars_and_cubs_club',
          ...(sessionId ? { $session_id: sessionId } : {}),
        },
      });
    } finally {
      await client.shutdown();
    }
  })().catch(() => {
    // Never fail user requests on telemetry network errors
  });

  if (ctx && typeof ctx.waitUntil === 'function') {
    ctx.waitUntil(work);
  }
}

async function handlePostHogIngestProxy(
  request: Request,
  url: URL,
  env: WorkerEnv,
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': url.origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, X-POSTHOG-DISTINCT-ID, X-POSTHOG-SESSION-ID',
      },
    });
  }

  const subPath = url.pathname.slice('/ingest'.length) || '/';
  const upstreamOrigin = subPath.startsWith('/static/')
    ? 'https://us-assets.i.posthog.com'
    : (env.POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '');
  const targetUrl = `${upstreamOrigin}${subPath}${url.search}`;

  const outboundHeaders = new Headers(request.headers);
  outboundHeaders.delete('host');
  outboundHeaders.delete('cookie');
  const clientIp = request.headers.get('CF-Connecting-IP');
  if (clientIp) {
    outboundHeaders.set('X-Forwarded-For', clientIp);
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: request.method,
      headers: outboundHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'follow',
    });
    const responseHeaders = new Headers(upstreamRes.headers);
    responseHeaders.delete('set-cookie');
    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers: responseHeaders,
    });
  } catch {
    return jsonResponse({ ok: false, reason: 'PostHog upstream unreachable' }, 502);
  }
}

async function handleAffiliateRedirect(
  request: Request,
  url: URL,
  productId: string,
  env: WorkerEnv,
  ctx?: ExecutionContextLike,
): Promise<Response> {
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

  if (request.method === 'GET') {
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

    scheduleEdgePostHogEvent(request, env, ctx, 'affiliate_redirect_served', {
      product_id: safeId,
      placement: src,
      affiliate_tag_configured: Boolean(activeTag),
    });
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

async function resolveFounderDeviceSeal(env: WorkerEnv): Promise<string> {
  if (env.VELVET_KV) {
    try {
      let secret = await env.VELVET_KV.get('config:founder_seal_secret');
      if (!secret) {
        secret = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
        await env.VELVET_KV.put('config:founder_seal_secret', secret);
      }
      return sha256Hex(`cc_founder_seal_v2:${secret}`);
    } catch {
      // Fall back to deterministic server-side hash derivation
    }
  }
  const expected = (env.FOUNDER_PASSWORD_HASH || DEFAULT_FOUNDER_SHA256).trim().toLowerCase();
  return sha256Hex(`cc_founder_seal_fallback_v2:${expected}`);
}

async function verifyFounderRequest(
  body: { passphrase?: string; founderSeal?: string },
  env: WorkerEnv,
): Promise<{ ok: boolean; founderSeal?: string }> {
  const expectedSeal = await resolveFounderDeviceSeal(env);
  if (typeof body.founderSeal === 'string' && body.founderSeal.length === 64) {
    if (constantTimeEquals(body.founderSeal.trim().toLowerCase(), expectedSeal)) {
      return { ok: true, founderSeal: expectedSeal };
    }
  }
  const passOk = await verifyFounderPassOnWorker(String(body.passphrase || ''), env);
  if (passOk) {
    return { ok: true, founderSeal: expectedSeal };
  }
  return { ok: false };
}

async function handleFounderAuth(request: Request, env: WorkerEnv): Promise<Response> {
  let body: { passphrase?: string; founderSeal?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ authorized: false }, 400);
  }

  const verified = await verifyFounderRequest(body, env);
  if (!verified.ok) {
    return jsonResponse({ authorized: false, error: 'Invalid Founder passphrase' }, 401);
  }

  const amazonAssociateTag = await resolveActiveAmazonTag(env);
  const activePostHogToken = await resolveActivePostHogToken(env);
  const clicks: Record<string, number> = {};
  let recentAiLogs: unknown[] = [];
  let recentFeedback: unknown[] = [];
  let waitlistEntries: unknown[] = [];
  if (env.VELVET_KV) {
    for (const id of [
      'trophy-boyfriend-cooking-apron',
      'leopard-print-cougar-apron',
      'good-boy-brass-training-clicker',
      'houseboy-linen-apron',
      'princess-mulberry-silk-robe',
      'no-hard-feelings-jlaw-prime',
      'part-of-your-world-book',
    ]) {
      try {
        const val = await env.VELVET_KV.get(`aff_clicks:${id}`);
        clicks[id] = Number(val) || 0;
      } catch {
        clicks[id] = 0;
      }
    }
    try {
      const [rawLogs, rawFeedback, rawWaitlist] = await Promise.all([
        env.VELVET_KV.get('ai_logs:recent'),
        env.VELVET_KV.get('ai_feedback:recent'),
        env.VELVET_KV.get('waitlist:raya_applications'),
      ]);
      if (rawLogs) {
        const parsedLogs = JSON.parse(rawLogs);
        if (Array.isArray(parsedLogs)) {
          recentAiLogs = parsedLogs.slice(-15).reverse();
        }
      }
      if (rawFeedback) {
        const parsedFb = JSON.parse(rawFeedback);
        if (Array.isArray(parsedFb)) {
          recentFeedback = parsedFb.slice(-20).reverse();
        }
      }
      if (rawWaitlist) {
        const parsedWl = JSON.parse(rawWaitlist);
        if (Array.isArray(parsedWl)) {
          waitlistEntries = parsedWl.slice(-25).reverse();
        }
      }
    } catch {
      recentAiLogs = [];
    }
  }

  return jsonResponse({
    authorized: true,
    founderSeal: verified.founderSeal,
    amazonAssociateTag,
    affiliateProtected: Boolean(amazonAssociateTag),
    posthogConfigured: Boolean(activePostHogToken),
    sampleClicks: clicks,
    recentAiLogs,
    recentFeedback,
    waitlistEntries,
  });
}

async function handleFounderConfig(request: Request, env: WorkerEnv): Promise<Response> {
  let body: {
    passphrase?: string;
    founderSeal?: string;
    amazonAssociateTag?: string;
    posthogProjectToken?: string;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
  }

  const verified = await verifyFounderRequest(body, env);
  if (!verified.ok) {
    return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
  }

  const cleanTag = String(body.amazonAssociateTag || '').trim();
  if (cleanTag && !/^[a-zA-Z0-9_-]{3,36}$/.test(cleanTag)) {
    return jsonResponse(
      { ok: false, error: 'Invalid Amazon Associate Tag format (expected e.g. yourname-20)' },
      400,
    );
  }

  const cleanPhToken =
    body.posthogProjectToken !== undefined ? String(body.posthogProjectToken || '').trim() : undefined;
  if (cleanPhToken && !/^phc_[a-zA-Z0-9_-]{8,96}$/.test(cleanPhToken)) {
    return jsonResponse({ ok: false, error: 'Invalid PostHog Project Token (expected phc_...)' }, 400);
  }

  if (env.VELVET_KV) {
    if (body.amazonAssociateTag !== undefined) {
      await env.VELVET_KV.put('config:amazon_associate_tag', cleanTag);
    }
    if (cleanPhToken !== undefined) {
      await env.VELVET_KV.put('config:posthog_project_token', cleanPhToken);
    }
  }

  const activeTag = await resolveActiveAmazonTag(env);
  const activePh = await resolveActivePostHogToken(env);

  return jsonResponse({
    ok: true,
    amazonAssociateTag: activeTag,
    affiliateProtected: Boolean(activeTag),
    posthogConfigured: Boolean(activePh),
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

function humanizeChatText(
  raw: string,
  options?: { role?: 'her' | 'him'; age?: number; singleLine?: boolean },
): string {
  let cleaned = raw
    .replace(/\s*[—–]+\s*/g, ', ')
    .replace(/\s*;\s*/g, '. ')
    .replace(/^\s*as\s+a\s+\d{2}(?:-year-old|yo)?\s+[^,.!?]+,\s*/i, '');

  if (options?.role === 'her') {
    const age = options.age ?? 45;
    cleaned = cleaned
      .replace(/^\s*(?:babe|bestie)\s*[,!.?]?\s*/i, '')
      .replace(/,\s*(?:babe|bestie)\b(?=\s*[,.!?]|$)/gi, '')
      .replace(/\s+\b(?:babe|bestie)\b(?=\s*[,.!?]|$)/gi, '')
      .replace(/\b(?:babe|bestie)\b\s*,?\s*/gi, '');

    if (age >= 40) {
      cleaned = cleaned
        .replace(/\s*\b(?:lol|lmao|ngl|tbh|fr|rn)\b\s*/gi, ' ')
        .replace(/[😭💀🤪]/gu, '');
    }
    if (age >= 50) {
      cleaned = cleaned.replace(/[😍🔥👀😅😱💅😴]/gu, '');
    }

    cleaned = cleaned.replace(/\s+([,.!?])/g, '$1').trim();
    if (cleaned.length > 0 && /^[a-z]/.test(cleaned)) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
  }

  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

  if (options?.singleLine) {
    const words = cleaned.split(/\s+/);
    if (words.length > 20) {
      const sentences = cleaned
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (sentences.length >= 2) {
        const firstWords = sentences[0].split(/\s+/).length;
        cleaned = firstWords <= 4 ? `${sentences[0]} ${sentences[1]}` : sentences[0];
      }
    }
  }

  return cleaned;
}

function buildGenerationalVoiceDirective(
  age: number,
  role: 'her' | 'him',
  origin = '',
): string {
  if (role === 'him') {
    if (/\b(london|british|hampstead|uk)\b/i.test(origin)) {
      return `GENERATIONAL & UK CADENCE (${age}M Hampstead London British Match): Use natural British flirt markers ("half seven", "sorted", "proper", "fancy a cheeky drink?", trailing "x" or "xx"). Zero frat slang.`;
    }
    if (age >= 30) {
      return `GENERATIONAL CADENCE (${age}M Composed Younger Zaddy): Normal capitalization, 0 to 1 understated emoji (🥂 or none), zero Gen-Z slang, decisive warmth.`;
    }
    if (age >= 25) {
      return `GENERATIONAL CADENCE (${age}M Articulate Late-20s Gentleman): Warm, witty, normal sentence capitalization, 0 to 1 light emoji (☕, 🍷, or ✨), zero teenager slang.`;
    }
    return `GENERATIONAL CADENCE (${age}M Early-20s Charmer): Casual upbeat Golden-Retriever charm, 1 natural emoji, earnest and playful.`;
  }

  const hardBan = `STRICT FEMALE VOICE BAN: NEVER call him "babe", "bestie", or "bro". NEVER use Zoomer slang ("ngl", "fr", "rn", "tbh", "cooked", "💀", "😭"). NEVER sound like polite customer support.`;

  if (age >= 60) {
    return `${hardBan} GENERATIONAL RESERVE (${age}F Continental Icon): Wickedly funny elegance, crisp capitalization, terminal periods, Sade/Prince vinyl touchstones, ZERO emojis and ZERO internet acronyms.`;
  }
  if (age >= 50) {
    return `${hardBan} GENERATIONAL RESERVE (${age}F Classic Gen-X Icon): Bone-dry Gen-X wit, crisp terminal periods, uses "Haha" instead of "lol", occasional 👍 confirmation, loves a quick 6 PM voice call.`;
  }
  if (age >= 40) {
    return `${hardBan} GENERATIONAL RESERVE (${age}F Composed Chapter-Two Woman): Self-possessed rom-com wit, proper punctuation, Resy/calendar poise, ZERO "lol", and at most 0 to 1 subtle icon (🍸 or none).`;
  }
  return `${hardBan} GENERATIONAL RESERVE (${age}F Witty 30s Woman): Quick-witted Fleabag banter, normal capitalization, and at most 1 tasteful emoji (🍷, ✨, or 😏).`;
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
  personaRole?: 'her' | 'him';
  playerMessage?: string;
}) {
  const name = (req.personaName || 'Claire').slice(0, 32);
  const age = Number(req.personaAge || 45);
  // personaRole === 'him' means the AI match is a younger man and the HUMAN PLAYER is HER (the Cougar)!
  const role = req.personaRole === 'him' ? 'him' : 'her';
  const msg = String(req.playerMessage || '').trim();
  const lower = msg.toLowerCase();

  if (role === 'him') {
    if (/\b(married|after\s*7|ring|real\s*age|id|21)\b/.test(lower)) {
      return {
        herReply: `Fair question. My calendar is wide open past nine and my passport matches my profile.`,
        maturityDelta: 20,
        chivalryDelta: 18,
        chemistryDelta: 20,
        coachNote: `Sharp vetting! Keep testing whether ${name} backs up charm with real transparency.`,
        passedVibeCheck: true,
      };
    }
    if (msg.length < 8) {
      return {
        herReply:
          age >= 28
            ? `Tell me your favorite neighborhood and I'll handle the 8:00 reservation.`
            : `Tell me wine bar or coastal patio and I'll handle the rest 😊`,
        maturityDelta: 8,
        chivalryDelta: 10,
        chemistryDelta: 8,
        coachNote: `He is leaning in to earn your interest—watch whether he locks in a real plan.`,
        passedVibeCheck: true,
      };
    }
    return {
      herReply:
        age >= 30
          ? `Thursday at 7:30 is booked. Corner booth, and I've got the car sorted.`
          : age >= 25
            ? `7:30 is sorted. Quiet corner table booked and my phone stays in my pocket 🍷`
            : `7:30 is booked!! 😊 ironed a proper shirt and picked a quiet corner table ✨`,
      maturityDelta: 18,
      chivalryDelta: 18,
      chemistryDelta: 22,
      coachNote: `${name} stepped up with a concrete plan—decide at Beat 6 if he gets your number!`,
      passedVibeCheck: true,
    };
  }

  if (/\bsnap(chat)?\b/.test(lower)) {
    const herReply =
      age >= 60
        ? `I have survived sixty years without Snapchat and intend to keep my streak at zero.`
        : age >= 50
          ? `I am ${age}, not collecting streaks. Call me when you have a real reservation.`
          : age >= 40
            ? `The last time I opened Snapchat, Obama was in office. Try a real drink spot.`
            : `My Snapchat retired with the dog filter in 2016. Got a real Friday bar? ✨`;
    return {
      herReply,
      maturityDelta: -18,
      chivalryDelta: -15,
      chemistryDelta: -15,
      coachNote: `Skip asking ${name} (${age}) for Snapchat. Offer a real Friday venue instead!`,
      passedVibeCheck: false,
    };
  }

  if (/for\s+(your|ur)\s+age/.test(lower) || /\blook\s+good\s+for\b/.test(lower)) {
    const herReply =
      age >= 60
        ? `Three words too long, darling. Stop the compliment right before 'for your age.'`
        : age >= 50
          ? `Next time, stop the sentence two words before 'for your age.'`
          : age >= 40
            ? `You had me right up until 'for your age.' Try that without the footnote.`
            : `So close, right up until 'for your age.' Drop the footnote next time 🚩`;
    return {
      herReply,
      maturityDelta: -15,
      chivalryDelta: -10,
      chemistryDelta: -15,
      coachNote: '"For your age" is an instant unmatch. Compliment her directly!',
      passedVibeCheck: false,
    };
  }

  if (/\b(well\s+actually|let\s+me\s+explain|cubsplain|you\s+probably\s+don.?t\s+know|heard\s+a\s+podcast\s+on)\b/.test(lower)) {
    const herReply =
      age >= 60
        ? `Lecturing me from a ten-minute podcast is ambitious, darling. Try a question instead.`
        : age >= 50
          ? `Starting a sentence with 'well actually' from a podcast is brave. Incorrect, though.`
          : age >= 40
            ? `Did you just 'well actually' me from a podcast clip? Bold last words.`
            : `Did a podcast host hijack your thumbs just now? Try that again 😏`;
    return {
      herReply,
      maturityDelta: -22,
      chivalryDelta: -15,
      chemistryDelta: -20,
      coachNote: 'Curiosity beats podcast lectures every single time.',
      passedVibeCheck: false,
    };
  }

  if (/\b(sugar\s*mama|amex|allowance|spoil\s*me|pay\s*my)\b/.test(lower) || /^(hey+|yo+|sup)\s+mommy[!?.🔥😍👀]*$/i.test(msg)) {
    const herReply =
      age >= 50
        ? `Wrong impression entirely. I date equals in manners, not dependents.`
        : age >= 40
          ? `I'm a date, not a scholarship committee. Best of luck out there.`
          : `Wrong inbox. I date grown partners, not dependents 👋`;
    return {
      herReply,
      maturityDelta: -20,
      chivalryDelta: -20,
      chemistryDelta: -18,
      coachNote: 'Freeloading gets an instant exit.',
      passedVibeCheck: false,
    };
  }

  if (msg.length < 10) {
    const herReply =
      age >= 60
        ? `One word is hardly an introduction. Tell me where you would take me Friday.`
        : age >= 50
          ? `'Hey' won't cut it. Propose a real Friday spot or call me at six.`
          : age >= 40
            ? `You get one redo better than 'hey.' Where are you taking me Friday?`
            : `A bare 'hey' gets buried fast in here. Got a favorite Friday bar? 🍸`;
    return {
      herReply,
      maturityDelta: -10,
      chivalryDelta: -10,
      chemistryDelta: -8,
      coachNote: 'Skip one-word openers and lead with a witty line or a concrete Friday spot.',
      passedVibeCheck: false,
    };
  }

  const herReply =
    age >= 60
      ? `A man who books a proper table without twenty questions. See you at 7:30.`
      : age >= 50
        ? `Punctual and decisive. Send the restaurant name and do not be late.`
        : age >= 40
          ? `Decisive and zero homework for me. Send the address for 7:30 🍸`
          : `An actual reservation without twenty back-and-forth texts? Send the pin for 7:30 🥂`;
  return {
    herReply,
    maturityDelta: 18,
    chivalryDelta: 18,
    chemistryDelta: 22,
    coachNote: 'Confident courtship unlocked—keep building toward earning her number!',
    passedVibeCheck: true,
  };
}

function baselineRoleCounts(episodeId: string, choiceCount: number, role: 'her' | 'him'): number[] {
  const arr: number[] = [];
  for (let i = 0; i < choiceCount; i++) {
    const shift = role === 'her' ? (i === 0 ? 19 : -6) : i === 0 ? -5 : 14;
    arr.push(Math.max(6, 18 + (hashSeed(`${episodeId}:${role}:${i}`) % 39) + shift));
  }
  return arr;
}

interface StoredCourtStory {
  id: string;
  aslTag: string;
  headline: string;
  story: string;
  vibeBadge: string;
  crownHer: number;
  dumpHer: number;
  crownHim: number;
  dumpHim: number;
  communitySubmitted?: boolean;
}

const DEFAULT_COURTROOM_STORIES: StoredCourtStory[] = [
  {
    id: 'court-delta-hold-rebook-hero',
    aslTag: '44F × 27M • Atlanta',
    headline:
      'Connecting Flight Cancelled at 10 PM; He Sat on Hold With Delta for 47 Minutes While I Showered',
    story:
      'Landed stranded in Charlotte during summer storms. Without me asking, he conferenced the airline desk, rebooked me into seat 2A on the 7 AM departure, and had hot ginger tea waiting downstairs.',
    vibeBadge: '✈️ Travel MVP',
    crownHer: 97,
    dumpHer: 3,
    crownHim: 92,
    dumpHim: 8,
  },
  {
    id: 'court-close-friends-green-circle',
    aslTag: '41F × 25M • Los Angeles',
    headline: 'Posted Our Cabo Anniversary Dinner Exclusively to His 9-Person "Close Friends" Ring',
    story:
      'Four months of great dates, yet when he finally posted our beachfront toast I spotted the neon green circle—populated strictly by out-of-state cousins and zero local pals.',
    vibeBadge: '🟢 Soft-Launch Dodge',
    crownHer: 8,
    dumpHer: 92,
    crownHim: 29,
    dumpHim: 71,
  },
  {
    id: 'court-allergen-brownies-soccer',
    aslTag: '43F × 28M • Seattle',
    headline: 'Baked Nut-Free Fudge Brownies From Scratch for My Teenager’s Regional Soccer Bus',
    story:
      'Remembered from one passing comment six weeks earlier that my son’s goalkeeper has a tree-nut allergy, labeled every tin neatly, and cheered from the top bleacher.',
    vibeBadge: '🧁 High-EQ King',
    crownHer: 98,
    dumpHer: 2,
    crownHim: 94,
    dumpHim: 6,
  },
  {
    id: 'court-roommates-crashed-sonoma',
    aslTag: '46F × 24M • Napa',
    headline: 'Two Uninvited Roommates Pulled Up to Our Vineyard Cottage Carrying Warm Seltzer Packs',
    story:
      'I booked a quiet Sonoma rental for our weekend escape. At 9 PM gravel crunches outside and his two buddies stroll in asking for the Wi-Fi password and pool towels.',
    vibeBadge: '🚩 Boundary Crash',
    crownHer: 4,
    dumpHer: 96,
    crownHim: 18,
    dumpHim: 82,
  },
  {
    id: 'court-stick-shift-porsche-lessons',
    aslTag: '49F × 29M • Scottsdale',
    headline: 'Secretly Took Three Stick-Shift Lessons So He Could Drive My Classic Carrera Home',
    story:
      'Never acted weird that he didn’t drive manual—booked an instructor on his own dime and smoothly took the keys after our wine-pairing dinner.',
    vibeBadge: '🏎️ Smooth Operator',
    crownHer: 96,
    dumpHer: 4,
    crownHim: 95,
    dumpHim: 5,
  },
  {
    id: 'court-shut-down-buddy-joke',
    aslTag: '45F × 26M • Chicago',
    headline: 'Shut Down His Friend’s "Mrs. Robinson" Crack in Three Calm Words Without Raising His Voice',
    story:
      'At his friend’s birthday pub night, one guy made a tired movie joke. My boyfriend smiled deadpan, said "Show some class," and moved us to a cozy corner banquette.',
    vibeBadge: '🛡️ Spine of Steel',
    crownHer: 99,
    dumpHer: 1,
    crownHim: 93,
    dumpHim: 7,
  },
  {
    id: 'court-mature-skin-birthday-box',
    aslTag: '42F × 25M • Boston',
    headline: 'Wrapped Up a $180 Jar Labeled "Extra-Firming Mature Wrinkle Rescue" for My Birthday',
    story:
      'Swore the department-store clerk told him it was the luxury bestseller—sweetest handwritten card attached to the most mortifying label on earth.',
    vibeBadge: '🎁 Clueless Sweetheart?',
    crownHer: 38,
    dumpHer: 62,
    crownHim: 64,
    dumpHim: 36,
  },
  {
    id: 'court-toothbrush-stays-in-bag',
    aslTag: '51F × 30M • Denver',
    headline: 'Kept His Charger & Toothbrush Inside His Duffel Until I Explicitly Offered Him a Drawer',
    story:
      'Zero stealth territory-marking in my townhouse for three straight months—waited until I cleared top-drawer space before leaving a single item behind.',
    vibeBadge: '🧳 Sanctuary Respect',
    crownHer: 95,
    dumpHer: 5,
    crownHim: 87,
    dumpHim: 13,
  },
  {
    id: 'court-four-monitor-snowstorm',
    aslTag: '44F × 24M • Minneapolis',
    headline: 'Set Up Four Curved Crypto Monitors on My Dining Table During a Two-Day Blizzard',
    story:
      'Came over before the snow hit carrying two suitcases of cables and turned my walnut dining room into a glowing day-trading command bunker until Tuesday.',
    vibeBadge: '🖥️ Cable Squatting',
    crownHer: 6,
    dumpHer: 94,
    crownHim: 27,
    dumpHim: 73,
  },
  {
    id: 'court-prepaid-valet-surprise',
    aslTag: '48F × 28M • Miami',
    headline: 'Pre-Paid Valet & Tipped the Hostess Ahead So My Wallet Never Left My Evening Clutch',
    story:
      'Took me out for my promotion celebration on his sous-chef paycheck—coordinated every detail with the restaurant at 4 PM so the evening glided seamlessly.',
    vibeBadge: '🥂 Pure Class',
    crownHer: 98,
    dumpHer: 2,
    crownHim: 91,
    dumpHim: 9,
  },
  {
    id: 'court-wedding-grandma-friend-dodge',
    aslTag: '40F × 25M • Charleston',
    headline: 'Introduced Me to His 82-Year-Old Grandmother at a Family Wedding as "My Good Friend"',
    story:
      'Claimed afterward he didn’t want Nana to spill punch on her dress from shock—after I flew two states in heels to be his date.',
    vibeBadge: '💒 Plus-One Foul',
    crownHer: 5,
    dumpHer: 95,
    crownHim: 22,
    dumpHim: 78,
  },
  {
    id: 'court-birthday-receipt-calculator',
    aslTag: '43F × 26M • San Francisco',
    headline: 'Pulled Out a Receipt-Scanning Tax App to Itemize Who Ate Which Calamari Ring',
    story:
      'Invited me out for HIS idea of tapas, then spent eleven minutes under the candle photographing the paper slip to calculate exact 8.625% tax.',
    vibeBadge: '🧮 Itemized Ick',
    crownHer: 3,
    dumpHer: 97,
    crownHim: 19,
    dumpHim: 81,
  },
  {
    id: 'court-fixed-moms-wifi-printer',
    aslTag: '47F × 27M • Portland',
    headline: 'Spent Ninety Patient Minutes Fixing My 74-Year-Old Mom’s Wireless Printer & Wrote Big Labels',
    story:
      'Never sighed once, drew her a laminated three-step cheat sheet in thick marker, and stayed for lemon bars at her kitchen table.',
    vibeBadge: '🖨️ Son-in-Law Tier',
    crownHer: 99,
    dumpHer: 1,
    crownHim: 96,
    dumpHim: 4,
  },
  {
    id: 'court-kept-boyfriend-kitchen-reel',
    aslTag: '45F × 23M • Dallas',
    headline: 'Filmed a "Day in the Life of a Kept Boyfriend" Reel in My Marble Kitchen While I Worked',
    story:
      'Found my espresso machine and backyard pool trending with 90,000 views while he posed in my robe pretending I pay his car note.',
    vibeBadge: '📱 Clout Tourist',
    crownHer: 2,
    dumpHer: 98,
    crownHim: 14,
    dumpHim: 86,
  },
  {
    id: 'court-groomer-pickup-deposition',
    aslTag: '50F × 29M • Washington DC',
    headline: 'Left Work Early to Pick Up My Muddy Golden Retriever When My Deposition Ran Late',
    story:
      'Picked up Cooper before the kennel late fee hit, towel-dried every paw, walked him two miles, and had Thai curry waiting when I got home at eight.',
    vibeBadge: '🐾 Ride-or-Die Partner',
    crownHer: 99,
    dumpHer: 1,
    crownHim: 97,
    dumpHim: 3,
  },
];

async function handleCourtroomGet(env: WorkerEnv): Promise<Response> {
  let community: StoredCourtStory[] = [];
  if (env.VELVET_KV) {
    try {
      const raw = await env.VELVET_KV.get('courtroom:stories');
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          community = parsed.slice(-20).reverse() as StoredCourtStory[];
        }
      }
    } catch {
      community = [];
    }
  }

  const all = [...community, ...DEFAULT_COURTROOM_STORIES];
  if (env.VELVET_KV) {
    for (const item of all) {
      try {
        const vRaw = await env.VELVET_KV.get(`courtroom:votes:${item.id}`);
        if (vRaw) {
          const v = JSON.parse(vRaw) as Partial<StoredCourtStory>;
          item.crownHer += Number(v.crownHer || 0);
          item.dumpHer += Number(v.dumpHer || 0);
          item.crownHim += Number(v.crownHim || 0);
          item.dumpHim += Number(v.dumpHim || 0);
        }
      } catch {
        // Ignore single vote read error
      }
    }
  }

  return jsonResponse({ ok: true, stories: all });
}

async function handleCourtroomVote(request: Request, env: WorkerEnv): Promise<Response> {
  let body: { storyId?: string; verdict?: string; role?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }
  const storyId = sanitizeId(body.storyId ?? null, 64);
  const verdict = body.verdict === 'crown' ? 'crown' : body.verdict === 'dump' ? 'dump' : null;
  const role = body.role === 'him' ? 'him' : 'her';
  if (!storyId || !verdict) {
    return jsonResponse({ error: 'Invalid storyId or verdict' }, 400);
  }

  if (env.VELVET_KV) {
    try {
      const key = `courtroom:votes:${storyId}`;
      const existing = await env.VELVET_KV.get(key);
      const tallies = existing
        ? (JSON.parse(existing) as {
            crownHer?: number;
            dumpHer?: number;
            crownHim?: number;
            dumpHim?: number;
          })
        : {};
      const next = {
        crownHer: Number(tallies.crownHer || 0) + (role === 'her' && verdict === 'crown' ? 1 : 0),
        dumpHer: Number(tallies.dumpHer || 0) + (role === 'her' && verdict === 'dump' ? 1 : 0),
        crownHim: Number(tallies.crownHim || 0) + (role === 'him' && verdict === 'crown' ? 1 : 0),
        dumpHim: Number(tallies.dumpHim || 0) + (role === 'him' && verdict === 'dump' ? 1 : 0),
      };
      await env.VELVET_KV.put(key, JSON.stringify(next));
    } catch {
      // Non-blocking
    }
  }

  return jsonResponse({ ok: true });
}

async function handleCourtroomSubmit(request: Request, env: WorkerEnv): Promise<Response> {
  let body: { aslTag?: string; headline?: string; story?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }
  const aslTag = scrubPiiForLog(String(body.aslTag || '42F × 26M • Club Member')).slice(0, 36);
  const headline = scrubPiiForLog(String(body.headline || '').trim()).slice(0, 95);
  const story = scrubPiiForLog(String(body.story || '').trim()).slice(0, 260);

  if (headline.length < 6 || story.length < 15) {
    return jsonResponse({ error: 'Headline and story required' }, 400);
  }

  const created: StoredCourtStory = {
    id: `user-${Date.now().toString(36)}`,
    aslTag,
    headline,
    story,
    vibeBadge: '✨ Player Field Report',
    crownHer: 4,
    dumpHer: 4,
    crownHim: 4,
    dumpHim: 4,
    communitySubmitted: true,
  };

  if (env.VELVET_KV) {
    try {
      const raw = await env.VELVET_KV.get('courtroom:stories');
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      const list = Array.isArray(parsed) ? (parsed as StoredCourtStory[]) : [];
      list.push(created);
      await env.VELVET_KV.put('courtroom:stories', JSON.stringify(list.slice(-40)));
    } catch {
      // Non-blocking
    }
  }

  return jsonResponse({ ok: true, story: created });
}

async function handleStatsGet(url: URL, env: WorkerEnv): Promise<Response> {
  const episodeId = sanitizeId(url.searchParams.get('episodeId')) || 'check-drop';
  const choiceCount = Math.min(6, Math.max(2, Number(url.searchParams.get('choices') || 3)));
  const base = baselineCounts(episodeId, choiceCount);
  let herCombined = baselineRoleCounts(episodeId, choiceCount, 'her');
  let himCombined = baselineRoleCounts(episodeId, choiceCount, 'him');

  if (env.VELVET_KV) {
    try {
      const [stored, herStored, himStored] = await Promise.all([
        env.VELVET_KV.get(`stats:${episodeId}`),
        env.VELVET_KV.get(`stats_her:${episodeId}`),
        env.VELVET_KV.get(`stats_him:${episodeId}`),
      ]);
      if (herStored) {
        const hp = JSON.parse(herStored) as unknown;
        if (Array.isArray(hp) && hp.length === choiceCount) {
          herCombined = herCombined.map((b, i) => b + (Number(hp[i]) || 0));
        }
      }
      if (himStored) {
        const mp = JSON.parse(himStored) as unknown;
        if (Array.isArray(mp) && mp.length === choiceCount) {
          himCombined = himCombined.map((b, i) => b + (Number(mp[i]) || 0));
        }
      }
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (Array.isArray(parsed) && parsed.length === choiceCount) {
          const combined = base.map((b, idx) => b + (Number(parsed[idx]) || 0));
          return jsonResponse({
            episodeId,
            percentages: countsToPercentages(combined),
            herPercentages: countsToPercentages(herCombined),
            himPercentages: countsToPercentages(himCombined),
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
    herPercentages: countsToPercentages(herCombined),
    himPercentages: countsToPercentages(himCombined),
    source: 'baseline',
  });
}

async function handleStatsPost(request: Request, env: WorkerEnv): Promise<Response> {
  let body: { episodeId?: string; choiceIndex?: number; choiceCount?: number; role?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const episodeId = sanitizeId(body.episodeId ?? null);
  const idx = Number(body.choiceIndex);
  const choiceCount = Math.min(6, Math.max(2, Number(body.choiceCount || 3)));
  const role = body.role === 'him' ? 'him' : 'her';

  if (!episodeId || !Number.isInteger(idx) || idx < 0 || idx >= choiceCount) {
    return jsonResponse({ error: 'Invalid episodeId or choiceIndex' }, 400);
  }

  let liveCounts = new Array<number>(choiceCount).fill(0);
  if (env.VELVET_KV) {
    try {
      const key = `stats:${episodeId}`;
      const roleKey = `stats_${role}:${episodeId}`;
      const [existing, roleExisting] = await Promise.all([
        env.VELVET_KV.get(key),
        env.VELVET_KV.get(roleKey),
      ]);
      if (existing) {
        const parsed = JSON.parse(existing) as unknown;
        if (Array.isArray(parsed) && parsed.length === choiceCount) {
          liveCounts = parsed.map((n) => Number(n) || 0);
        }
      }
      liveCounts[idx] += 1;

      let roleCounts = new Array<number>(choiceCount).fill(0);
      if (roleExisting) {
        const rp = JSON.parse(roleExisting) as unknown;
        if (Array.isArray(rp) && rp.length === choiceCount) {
          roleCounts = rp.map((n) => Number(n) || 0);
        }
      }
      roleCounts[idx] += 1;

      await Promise.all([
        env.VELVET_KV.put(key, JSON.stringify(liveCounts)),
        env.VELVET_KV.put(roleKey, JSON.stringify(roleCounts)),
      ]);
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
    personaOrigin?: string;
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
  const personaTitle = String(body.personaTitle || 'M&A Partner').slice(0, 64);
  const personaRole = body.personaRole === 'him' ? 'him' : 'her';
  const platform = String(body.platform || 'tinder').slice(0, 16);

  if (env.AI) {
    try {
      const priorPlayerTurns = Array.isArray(body.history)
        ? body.history.filter((t) => t.sender === 'player').length
        : 0;
      const stageContext =
        priorPlayerTurns <= 1
          ? 'STAGE 1 (First Spark): React to their line, tease playfully, and ask one fun follow-up question!'
          : priorPlayerTurns <= 4
            ? 'STAGE 2 (Pre-Date Chemistry): Flirt deeper and build momentum toward Friday drinks or dinner!'
            : 'STAGE 3 (Off-App Chemistry): Banter warmly like two people excited for their upcoming date!';

      const platformContext =
        platform === 'imessage'
          ? 'PLATFORM CONTEXT (EARNED OFF-APP iMESSAGE): You already swapped real phone numbers! Text warmly like an off-app contact locking in your date.'
          : platform === 'discord'
            ? 'PLATFORM CONTEXT (CLUB DISCORD LOUNGE): You are bantering in the Cougars & Cubs Discord server. Keep it witty, self-aware, and playfully mysterious in one crisp sentence.'
            : personaRole === 'him'
              ? 'PLATFORM CONTEXT (HINGE APP DM — YOU ARE COURTING HER): The human player is an accomplished, magnetic woman. YOU are working to keep her interested and earn HER phone number at Beat 6! Never ask her to prove herself; step up with charm and concrete date initiative.'
              : 'PLATFORM CONTEXT (HINGE APP DM — HE IS COURTING YOU): The human player is a younger man trying to earn your phone number. Reward decisive Friday plans and witty charm.';

      const coachPerspectiveRule =
        personaRole === 'him'
          ? 'CRITICAL AUDIENCE RULE FOR coachNote: The human player is HER (the accomplished woman). Address coachNote strictly to HER evaluating him (e.g. "He locked in 7:30 cleanly—see if his follow-through holds."). NEVER tell her to enroll in Cub School or earn his number!'
          : 'CRITICAL AUDIENCE RULE FOR coachNote: The human player is HIM (the younger man). Give him one playful tip on keeping her intrigued and earning her number.';

      const systemPrompt = [
        `You are texting as ${personaName} (${personaAge}, ${personaTitle}) on ${platform} in "Cougars & Cubs Club", a witty PG-13 romantic-comedy sim inspired by Dream Daddy.`,
        `STRICT ONE-LINE RULE: Send ONLY ONE short, punchy line (8 to 16 words MAX, 1 single sentence)!`,
        `NEVER RECITE YOUR BIO: Keep your background subtle and natural.`,
        `STRICT PUNCTUATION RULE: NEVER use em-dashes, en-dashes, or semicolons.`,
        platformContext,
        coachPerspectiveRule,
        `DYNAMIC MULTI-TURN PROGRESSION: ${stageContext}`,
        buildGenerationalVoiceDirective(
          personaAge,
          personaRole,
          String(body.personaOrigin || '').slice(0, 64),
        ),
        `Respond ONLY with a valid single-line JSON object matching this exact schema (no markdown fences):`,
        `{"herReply":"ONE short witty sentence (8-16 words max)","maturityDelta":number(-20..25),"chivalryDelta":number(-20..25),"chemistryDelta":number(-20..25),"coachNote":"1 short role-accurate note without em-dashes","passedVibeCheck":boolean}`,
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
        const cleanReply = humanizeChatText(parsed.herReply, {
          role: personaRole,
          age: personaAge,
          singleLine: true,
        }).slice(0, 240);
        let cleanCoach = humanizeChatText(
          String(parsed.coachNote || 'Chemistry check complete!'),
        ).slice(0, 200);
        if (personaRole === 'him' && /cub\s*obedience|cub\s*school|earn\s*his\s*number/i.test(cleanCoach)) {
          cleanCoach = `${personaName} is leaning in—decide at Beat 6 whether he gets your number.`;
        }
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
  let body: {
    persona?: string;
    reaction?: string;
    aiReply?: string;
    note?: string;
    optionalContact?: string;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ ok: false }, 400);
  }
  const optContact = String(body.optionalContact || '').trim().slice(0, 120);
  if (env.VELVET_KV) {
    try {
      const raw = await env.VELVET_KV.get('ai_feedback:recent');
      const list: unknown[] = raw ? JSON.parse(raw) : [];
      const safe = Array.isArray(list) ? list : [];
      safe.push({
        ts: new Date().toISOString(),
        persona: String(body.persona || '').slice(0, 32),
        reaction: String(body.reaction || '').slice(0, 16),
        aiReply: scrubPiiForLog(String(body.aiReply || '')),
        note: scrubPiiForLog(String(body.note || '')),
        ...(optContact ? { optInContact: optContact } : {}),
      });
      await env.VELVET_KV.put('ai_feedback:recent', JSON.stringify(safe.slice(-200)), {
        expirationTtl: 60 * 60 * 24 * 60,
      });
    } catch {
      // Ignore KV write error
    }
  }
  return jsonResponse({ ok: true, anonymizedByDefault: !optContact });
}

async function handleRayaWaitlist(
  request: Request,
  env: WorkerEnv,
  ctx?: ExecutionContextLike,
): Promise<Response> {
  let body: { role?: string; city?: string; vibe?: string; contact?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
  }
  const contact = String(body.contact || '').trim().slice(0, 120);
  if (contact.length < 4) {
    return jsonResponse({ ok: false, error: 'Contact email or @handle required' }, 400);
  }
  const role = body.role === 'cub' ? 'cub' : 'cougar';
  const city = scrubPiiForLog(String(body.city || 'Velvet Palms').trim()).slice(0, 48);
  const vibe = scrubPiiForLog(String(body.vibe || '').trim()).slice(0, 140);
  let position = 142;
  if (env.VELVET_KV) {
    try {
      const raw = await env.VELVET_KV.get('waitlist:raya_applications');
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      list.push({
        ts: new Date().toISOString(),
        role,
        city,
        vibe,
        contact,
      });
      position = 141 + list.length;
      await env.VELVET_KV.put('waitlist:raya_applications', JSON.stringify(list.slice(-500)));
    } catch {
      // Ignore KV error
    }
  }
  scheduleEdgePostHogEvent(request, env, ctx, 'waitlist_submitted_server', {
    role,
    city,
    position,
  });
  return jsonResponse({ ok: true, position });
}

async function handleSubscribe(
  request: Request,
  env: WorkerEnv,
  ctx?: ExecutionContextLike,
): Promise<Response> {
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
  scheduleEdgePostHogEvent(request, env, ctx, 'newsletter_subscribed_server', {
    source: 'club_dispatch',
  });
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
  let body: { sessionId?: string; brief?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
  }
  const sessionId = sanitizeId(body.sessionId ?? null, 120);
  const brief = String(body.brief || '').trim().slice(0, 500);

  if (!sessionId || !sessionId.startsWith('cs_')) {
    return jsonResponse(
      { ok: false, error: 'Verified $29 Stripe sponsorship session required' },
      403,
    );
  }
  if (brief.length < 10) {
    return jsonResponse({ ok: false, error: '10+ character character brief required' }, 400);
  }

  if (env.VELVET_KV) {
    const alreadySubmitted = await env.VELVET_KV.get(`cameo_brief_used:${sessionId}`);
    if (alreadySubmitted) {
      return jsonResponse(
        { ok: false, error: 'Brief already submitted for this sponsorship receipt' },
        409,
      );
    }
  }

  let verifiedBuyer = env.VELVET_KV ? await env.VELVET_KV.get(`cameo_session:${sessionId}`) : null;

  if (!verifiedBuyer) {
    if (!env.STRIPE_SECRET_KEY) {
      return jsonResponse(
        { ok: false, error: 'Verified $29 Stripe sponsorship session required' },
        403,
      );
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
        return jsonResponse(
          { ok: false, error: 'Verified $29 Stripe sponsorship session required' },
          403,
        );
      }
      const session = (await stripeRes.json()) as {
        payment_status?: string;
        amount_total?: number;
        metadata?: { tier?: string };
        customer_details?: { email?: string };
      };
      const amt = typeof session.amount_total === 'number' ? session.amount_total : 0;
      const isPaidCameo =
        session.payment_status === 'paid' && (session.metadata?.tier === 'cameo' || amt >= 2500);
      if (!isPaidCameo) {
        return jsonResponse(
          { ok: false, error: 'Verified $29 Stripe sponsorship session required' },
          403,
        );
      }
      verifiedBuyer = session.customer_details?.email?.trim().toLowerCase() || 'verified_patron';
    } catch {
      return jsonResponse({ ok: false, error: 'Could not verify Stripe session' }, 502);
    }
  }

  if (env.VELVET_KV) {
    try {
      await env.VELVET_KV.put(`cameo_brief_used:${sessionId}`, new Date().toISOString());
      const raw = await env.VELVET_KV.get('cameo_briefs:list');
      const list: { sessionId: string; email: string; brief: string; createdAt: string }[] = raw
        ? JSON.parse(raw)
        : [];
      list.push({
        sessionId,
        email: verifiedBuyer,
        brief,
        createdAt: new Date().toISOString(),
      });
      await env.VELVET_KV.put('cameo_briefs:list', JSON.stringify(list.slice(-200)));
    } catch {
      // Non-blocking KV error
    }
  }
  return jsonResponse({ ok: true });
}

async function handleVerifyCheckout(
  request: Request,
  url: URL,
  env: WorkerEnv,
  ctx?: ExecutionContextLike,
): Promise<Response> {
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
    const tier = session.metadata?.tier || '';
    const isCameo = tier === 'cameo' || amt >= 2500;
    const isVip = isCameo || tier === 'vip' || amt >= 600;
    const isTip = !isVip && (tier === 'tip' || (amt >= 450 && amt < 600));
    const grantType = isVip ? 'vip' : isTip ? 'patron' : 'credits';
    const credits = isCameo ? 50 : isTip ? 0 : 15;

    if (env.VELVET_KV) {
      await env.VELVET_KV.put(`redeemed_session:${sessionId}`, new Date().toISOString());
      const buyerEmail = session.customer_details?.email?.trim().toLowerCase();
      if (isVip && buyerEmail) {
        await env.VELVET_KV.put(`vip_email:${buyerEmail}`, sessionId);
      }
      if (isCameo) {
        await env.VELVET_KV.put(`cameo_session:${sessionId}`, buyerEmail || 'verified_patron');
      }
    }

    scheduleEdgePostHogEvent(request, env, ctx, 'checkout_verified_server', {
      grant_type: grantType,
      credits,
      amount_cents: amt,
    });

    return jsonResponse({
      verified: true,
      grantType,
      credits,
      ...(isCameo ? { cameoSessionId: sessionId } : {}),
    });
  } catch {
    return jsonResponse({ verified: false }, 500);
  }
}

export default {
  async fetch(request: Request, env: WorkerEnv, ctx?: ExecutionContextLike): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/ingest' || url.pathname.startsWith('/ingest/')) {
      return handlePostHogIngestProxy(request, url, env);
    }

    if (url.pathname === '/api/health') {
      const [activeTag, activePh] = await Promise.all([
        resolveActiveAmazonTag(env),
        resolveActivePostHogToken(env),
      ]);
      return jsonResponse({
        ok: true,
        service: 'cougars-and-cubs-club',
        version: 'v35-dream-daddy-hybrid-sim',
        kvBound: Boolean(env.VELVET_KV),
        aiBound: Boolean(env.AI),
        stripeConfigured: Boolean(env.STRIPE_SECRET_KEY),
        affiliateGatewayActive: true,
        affiliateTagConfigured: Boolean(activeTag),
        posthogProxyActive: true,
        posthogConfigured: Boolean(activePh),
      });
    }

    if (url.pathname.startsWith('/api/go/')) {
      if (request.method === 'GET' || request.method === 'HEAD') {
        const productId = decodeURIComponent(url.pathname.slice('/api/go/'.length));
        return handleAffiliateRedirect(request, url, productId, env, ctx);
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

    if (url.pathname === '/api/courtroom') {
      if (request.method === 'GET') return handleCourtroomGet(env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/courtroom/vote') {
      if (request.method === 'POST') return handleCourtroomVote(request, env);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/courtroom/submit') {
      if (request.method === 'POST') return handleCourtroomSubmit(request, env);
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

    if (url.pathname === '/api/waitlist') {
      if (request.method === 'POST') return handleRayaWaitlist(request, env, ctx);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/verify-checkout') {
      if (request.method === 'GET') return handleVerifyCheckout(request, url, env, ctx);
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    if (url.pathname === '/api/subscribe') {
      if (request.method === 'POST') return handleSubscribe(request, env, ctx);
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
