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

const AFFILIATE_REDIRECT_URLS: Record<string, string> = {
  'trophy-boyfriend-cooking-apron':
    'https://www.amazon.com/s?k=trophy+husband+funny+cooking+apron+for+men',
  'leopard-print-cougar-apron':
    'https://www.amazon.com/s?k=leopard+print+kitchen+apron+with+pockets',
  'good-boy-brass-training-clicker':
    'https://www.amazon.com/s?k=dog+training+clicker+wrist+strap+treat+pouch',
  'funny-cougar-stemless-wine-glass':
    'https://www.amazon.com/s?k=funny+cougar+wine+glass+gift+for+women',
  'golden-retriever-boyfriend-mug':
    'https://www.amazon.com/s?k=golden+retriever+energy+funny+mug+gift',
  'black-cat-girlfriend-leopard-mug':
    'https://www.amazon.com/s?k=black+cat+energy+funny+coffee+mug+gift',
  'cougar-hunter-retro-trucker-hat':
    'https://www.amazon.com/s?k=funny+cougar+trucker+hat+novelty+gift',
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
  'the-rebound-zeta-jones-prime':
    'https://www.amazon.com/s?k=The+Rebound+Catherine+Zeta+Jones+Prime+Video+movie',
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-POSTHOG-DISTINCT-ID, X-POSTHOG-SESSION-ID',
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
      'cooling-bamboo-sheets',
      'zero-proof-botanical-mocktail-set',
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
    return jsonResponse({ ok: false, error: 'Invalid Amazon Associate Tag format (expected e.g. yourname-20)' }, 400);
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
    .replace(/\s*[, , ]\s*/g, ', ')
    .replace(/\s*;\s*/g, '. ')
    // Strip bio-reciting openers like "As a 41-year-old Malibu surfer, ..."
    .replace(/^\s*as\s+a\s+\d{2}(?:-year-old|yo)?\s+[^,.!?]+,\s*/i, '');

  if (options?.role === 'her') {
    const age = options.age ?? 45;
    // Cougars never call matches "babe" or "bestie"
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

  // Enforce punchy one-line pacing when the model tries to ramble across multiple long sentences
  if (options?.singleLine) {
    const words = cleaned.split(/\s+/);
    if (words.length > 20) {
      const sentences = cleaned
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (sentences.length >= 2) {
        const firstWords = sentences[0].split(/\s+/).length;
        cleaned =
          firstWords <= 4
            ? `${sentences[0]} ${sentences[1]}`
            : sentences[0];
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
      return `GENERATIONAL & UK CADENCE (${age}M Hampstead London British Cub): Use authentic British flirt markers naturally ("half seven", "sorted", "proper", "fancy a cheeky drink?", trailing "x" or "xx", and playful "Yes, Mummy xx" when teased). Zero American frat slang.`;
    }
    if (age >= 30) {
      return `GENERATIONAL CADENCE (${age}M Composed Millennial Gentleman): Normal capitalization, 0 to 1 understated emoji (🥂 or none), zero Gen-Z slang ("fr", "ngl", "💀"), playful dry confidence.`;
    }
    if (age >= 25) {
      return `GENERATIONAL CADENCE (${age}M Articulate Late-20s Zillennial): Warm, witty, normal sentence capitalization, 0 to 1 light emoji (☕, 🍷, or ✨), zero teenager slang ("fr", "ngl", "💀").`;
    }
    return `GENERATIONAL CADENCE (${age}M Early-20s Gen-Z Cub): Casual upbeat Golden-Retriever charm, 1 natural emoji, earnest and playful.`;
  }

  const hardBan = `STRICT FEMALE VOICE BAN: NEVER call him "babe", "bestie", or "bro". NEVER use Zoomer slang ("ngl", "fr", "rn", "tbh", "cooked", "💀", "😭"). NEVER sound like polite customer support ("I'm not interested in sharing my...").`;

  if (age >= 60) {
    return `${hardBan} GENERATIONAL RESERVE (${age}F Silver-Screen Panther): Wickedly funny Continental elegance, crisp capitalization, terminal periods or warm "...", Sade/Prince vinyl touchstones, ZERO emojis and ZERO internet acronyms ("lol", "omg").`;
  }
  if (age >= 50) {
    return `${hardBan} GENERATIONAL RESERVE (${age}F Classic Gen-X Jaguar): Bone-dry Gen-X wit, crisp terminal periods, uses "Haha" instead of "lol", occasional literal 👍 confirmation, Nirvana/Depeche Mode cultural fluency, loves a 6 PM phone call.`;
  }
  if (age >= 40) {
    return `${hardBan} GENERATIONAL RESERVE (${age}F Composed Xennial/Millennial Cougar): Self-possessed rom-com wit, proper punctuation, Lauryn Hill/Resy/calendar poise, ZERO "lol", and at most 0 to 1 subtle icon (🍸 or none).`;
  }
  return `${hardBan} GENERATIONAL RESERVE (${age}F Millennial Puma): Quick-witted 30s Fleabag/Frank Ocean banter, normal capitalization, and at most 1 tasteful emoji (🍷, ✨, or 😏).`;
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
  const role = req.personaRole === 'him' ? 'him' : 'her';
  const msg = String(req.playerMessage || '').trim();
  const lower = msg.toLowerCase();

  if (role === 'him') {
    if (msg.length < 10) {
      return {
        herReply:
          age >= 28
            ? `Give me one hint on your mood and I'll lock in Thursday.`
            : `Give me one clue: cozy wine bar or late-night tacos? 😊`,
        maturityDelta: -6,
        chivalryDelta: -4,
        chemistryDelta: -4,
        coachNote: 'Drop one playful cue on your Friday preference to test his follow-through.',
        passedVibeCheck: false,
      };
    }
    return {
      herReply:
        age >= 30
          ? `7:30 sharp works. Corner booth is booked and my phone stays off the table.`
          : age >= 25
            ? `7:30 works great. Quiet corner table booked, zero startup talk all night 🍷`
            : `7:30 works!! 😊 ironed a real shirt and booked us an actual table ✨`,
      maturityDelta: 18,
      chivalryDelta: 18,
      chemistryDelta: 22,
      coachNote: 'Confident age-gap chemistry unlocked!',
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
      coachNote: `Skip asking ${name} (${age}) for Snapchat. Offer your real number and an actual spot!`,
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

  if (/pine\s*pollen|all\s+up\s+in\s+(my|his)\s+feels|up\s+in\s+my\s+feels\s+rn/.test(lower)) {
    const herReply =
      age >= 60
        ? `Kindly set the pine-pollen dropper aside. Adults do not panic after one quiet hour.`
        : age >= 50
          ? `Put the pine-pollen dropper down. My phone goes on silent at nine.`
          : age >= 40
            ? `Step away from the pine-pollen dropper. Reading after 9:30 PM isn't ghosting.`
            : `Put the pine-pollen dropper down. One quiet hour isn't ghosting 🍷`;
    return {
      herReply,
      maturityDelta: -24,
      chivalryDelta: -16,
      chemistryDelta: -24,
      coachNote: 'Skip the pine-pollen jitters and send one calm sentence!',
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
      coachNote: 'Zero Cubsplaining! Curiosity beats podcast lectures every time.',
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
      coachNote: 'Sugar-Mama freeloading gets an instant exit.',
      passedVibeCheck: false,
    };
  }

  if (/\b(mommy-domme|yes,?\s*mommy|yes,?\s*mummy|sorted,?\s*mummy|breathe\s+with\s+mommy|qigong|tai\s*chi|cloud\s*hands|jasmine\s*oolong|seed[- ]oil|gluten[- ]free|ghee|tallow|bernedoodle)\b/.test(lower)) {
    const herReply = /\bmummy\b/.test(lower)
      ? `Haha. Keep that cheeky London 'Sorted, Mummy xx' energy and be on time at 7:30.`
      : age >= 50
        ? `Calm shoulders and zero lecturing. 7:30 sharp tomorrow.`
        : age >= 40
          ? `Good boy. 7:30 sharp tomorrow, and keep that exact poise 🍸`
          : `Grounded energy and zero lecturing? 7:30 sharp tomorrow ✨`;
    return {
      herReply,
      maturityDelta: 22,
      chivalryDelta: 20,
      chemistryDelta: 25,
      coachNote: 'Playful polarity unlocked!',
      passedVibeCheck: true,
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
      coachNote: 'Skip one-word openers and lead with a witty line or a Friday spot.',
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
    coachNote: 'Confident 1-line courtship unlocked!',
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
    id: 'court-sheryl-crow-cold-plunge-laundry',
    aslTag: '43F × 25M • Santa Barbara',
    headline: 'Said Sheryl Crow Was His "Favorite Song When I Was 4," Then Folded My Laundry & Loaded the Dishwasher',
    story:
      'Sheryl Crow’s "Soak Up the Sun" came on in my car and he beamed, "Oh yeah, my favorite song when I was 4!" Nearly drove off PCH. Then Sunday he did a 6 AM cold plunge, briefed me on James Webb space news to impress me, folded all my laundry, and set up my dishwasher.',
    vibeBadge: '☀️ Overachieving Cub',
    crownHer: 94,
    dumpHer: 6,
    crownHim: 89,
    dumpHim: 11,
  },
  {
    id: 'daily-cast-iron-steak-venmo',
    aslTag: '44F × 25M • Austin',
    headline: 'Cooked Me Grass-Fed Ribeye, Then Sent a $19.50 Venmo at 8:15 AM',
    story:
      'He wore a linen apron, seared rosemary steak in ghee, and washed every dish before midnight. Next morning on my drive to work my phone buzzed: "$19.50 for your half of the butcher ribeye 🥩😊." Crown him or dump him?!',
    vibeBadge: '💸 Dutch Math Emergency',
    crownHer: 8,
    dumpHer: 92,
    crownHim: 46,
    dumpHim: 54,
  },
  {
    id: 'court-four-pillows-silk-clip',
    aslTag: '47F × 27M • Chicago',
    headline: 'Bought a 22-Momme Silk Pillowcase & Claw Clip After ONE Sleepover',
    story:
      'After our first sleepover I joked about cotton frizzing my blowout. Friday week two I walk into his apartment: 4 crisp percale pillows, a brand-new mulberry silk pillowcase on "my" side, lidded bathroom trash can, and my favorite zero-proof spritz chilled.',
    vibeBadge: '🐕 Hall-of-Fame Golden Retriever',
    crownHer: 97,
    dumpHer: 3,
    crownHim: 88,
    dumpHim: 12,
  },
  {
    id: 'court-pine-pollen-midnight-spiral',
    aslTag: '42F × 24M • Scottsdale',
    headline: 'Blamed His 11:47 PM 9-Text Meltdown on "Pine Pollen Testosterone"',
    story:
      'Told him upfront I read in bed with tea at 9:30 PM on weeknights. Woke up at 6 AM to 9 unhinged texts ending with "sorry babe the wild pine-pollen tincture has my T surging & got me all up in my feels 🥺🌲."',
    vibeBadge: '🌲 Biohacker Spiral',
    crownHer: 9,
    dumpHer: 91,
    crownHim: 39,
    dumpHim: 61,
  },
  {
    id: 'court-waiter-son-tip-move',
    aslTag: '51F × 28M • Manhattan',
    headline: 'Waiter Asked If I Wanted Separate Checks "For My Son." Watch His Move.',
    story:
      'Buzzy West Village bistro. Waiter sets the check down and asks if I am treating my son for graduation. Without blinking, my date slid his card in, grinned, kissed my hand, and said "Definitely one check, my girlfriend’s just genetically unfair."',
    vibeBadge: '👑 Unshakeable Frame',
    crownHer: 98,
    dumpHer: 2,
    crownHim: 91,
    dumpHim: 9,
  },
  {
    id: 'court-maui-moms-timeshare',
    aslTag: '39F × 23M • San Diego',
    headline: 'Bragged About "His Place in Maui," Then His Parents Were in the Kitchen!',
    story:
      'Invited me for a romantic 4-day getaway to "my condo in Wailea." We open the front door with suitcases and his mom is standing at the blender in a visor asking if we want Costco turkey wraps.',
    vibeBadge: '🌺 Timeshare Mirage',
    crownHer: 14,
    dumpHer: 86,
    crownHim: 52,
    dumpHim: 48,
  },
  {
    id: 'court-perimenopause-bamboo-sheets',
    aslTag: '49F × 30M • Seattle',
    headline: '3 AM Hot Flash: He Wordlessly Flipped the Cooling Pillow & Grabbed Ice Water',
    story:
      'Woke up mortified kicking the duvet off at 3 AM. Zero weirdness. He sleepily kissed my shoulder, cracked the window two inches, handed me ice water, and ordered cooling bamboo sheets to his place the next afternoon.',
    vibeBadge: '💚 Grown-Man EQ',
    crownHer: 99,
    dumpHer: 1,
    crownHim: 93,
    dumpHim: 7,
  },
  {
    id: 'court-whats-ur-snap-1900s',
    aslTag: '45F × 24M • Miami',
    headline: 'Great Chemistry All Dinner, Then He Texted "u look crazy good for ur age 🔥 whats ur snap??"',
    story:
      'Opened every door, laughed at my dry jokes, and walked me to my Uber. Two minutes into the ride my phone pings: "yo tonight was fire ngl 💀 u look crazy good for someone born in the late 1900s!! whats ur snap so we streak??"',
    vibeBadge: '👻 Triple-Combo Ick',
    crownHer: 4,
    dumpHer: 96,
    crownHim: 49,
    dumpHim: 51,
  },
  {
    id: 'court-titos-mattress-cubsplain',
    aslTag: '43F × 25M • Denver',
    headline: 'Tried to "Cubsplain" Mortgages From a Bare Floor Mattress Next to an Empty Tito’s Handle',
    story:
      'I own two properties. We stop by his apartment to grab his jacket: 5-in-1 neon-blue body wash on the sink, unlidded trash can, bare mattress on the floor, and he spends 14 minutes lecturing me on fixed-rate amortization from a podcast.',
    vibeBadge: '🤓 Podcast Cubsplainer',
    crownHer: 3,
    dumpHer: 97,
    crownHim: 34,
    dumpHim: 66,
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

      const platformContext =
        platform === 'imessage'
          ? 'PLATFORM CONTEXT (EARNED OFF-APP iMESSAGE): They ALREADY passed your Tinder vetting and earned your personal phone number! Never act like you just matched on an app. Text warmly like an off-app contact locking in Friday, a quick 6 PM voice call, or Date #2.'
          : platform === 'discord'
            ? 'PLATFORM CONTEXT (ANONYMOUS CLUB DISCORD SERVER): You are bantering under an anonymous handle in the Cougars & Cubs Lounge server or mystery anon subplot DM. Keep it witty, self-aware, and playfully mysterious in one crisp sentence.'
            : 'PLATFORM CONTEXT (TINDER MATCH VETTING): You matched on Tinder. If they demand your phone number on message #1 before proving themselves, playfully tell them to earn two good sentences on the app first. Reward decisive Friday plans and witty charm.';

      const systemPrompt = [
        `You are texting as ${personaName} (${personaAge}, background: ${personaTitle}) on ${platform} in "Cougars & Cubs Club", a playful, witty PG-13 dating sim inspired by Dream Daddy.`,
        `STRICT ONE-LINE RULE: Send ONLY ONE short, punchy line at a time (8 to 16 words MAX, 1 single sentence)! NEVER send a paragraph or multiple long sentences!`,
        `NEVER RECITE YOUR BIO: Real people NEVER say "You swiped right on a 41yo surfer" or list all their hobbies/diet/job in a text! Keep your background subtle and drop at most ONE tiny, funny breadcrumb ONLY when it fits naturally so they stay hooked turn after turn.`,
        `DREAM DADDY COMEDIC SPARK: Be genuinely funny, cheeky, teasing, and quotable, NEVER stiff, corporate, or polite customer-service speak ("I'm not interested in sharing my Snapchat, how about..."). Even when roasting a red flag like Snapchat or 'for your age', do it with one razor-sharp, humorous line!`,
        `STRICT PUNCTUATION RULE: NEVER use em-dashes, en-dashes, or semicolons.`,
        platformContext,
        `DYNAMIC MULTI-TURN PROGRESSION: ${stageContext}`,
        buildGenerationalVoiceDirective(
          personaAge,
          personaRole,
          String(body.personaOrigin || '').slice(0, 64),
        ),
        personaRole === 'her'
          ? `Vibe: Confident ${personaAge}F poise. Reward decisive Friday plans and unbothered warmth; roast Snapchat requests, "for your age", podcast "well actually" Cubsplaining, pine-pollen midnight spirals, and Sugar-Mama freeloaders in ONE dry, hilarious line.`
          : `Vibe: Charming ${personaAge}M Cub who initiates cleanly, books real tables, never sends Venmo math, and banters one playful line at a time.`,
        `Respond ONLY with a valid single-line JSON object matching this exact schema (no markdown fences):`,
        `{"herReply":"ONE short witty sentence (8-16 words max), ZERO bio-reciting, ZERO em-dashes, ZERO 'babe' if female","maturityDelta":number(-20..25),"chivalryDelta":number(-20..25),"chemistryDelta":number(-20..25),"coachNote":"1 short punchy coaching tip without em-dashes","passedVibeCheck":boolean}`,
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
        // Strictly opt-in: stored ONLY when the player explicitly volunteered their handle/email for Founder follow-up
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
  const city = scrubPiiForLog(String(body.city || 'Virtual Lounge').trim()).slice(0, 48);
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

    scheduleEdgePostHogEvent(request, env, ctx, 'checkout_verified_server', {
      grant_type: isVip ? 'vip' : 'credits',
      credits,
      amount_cents: amt,
    });

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
        version: 'v34-dream-daddy-coherence-phone-posthog',
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
      if (request.method === 'GET') {
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
