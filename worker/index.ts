/**
 * Cougars & Cubs Club — Unified Cloudflare Worker (Phases B + C + Static SPA Assets)
 * Served directly on https://cougarsandcubs.club (with *.sophiaraji.workers.dev disabled).
 *
 * Routes:
 * - GET  /api/health          -> Health + feature readiness status
 * - GET  /api/stats           -> Live Telltale-style global choice percentages from VELVET_KV
 * - POST /api/stats           -> Atomic-ish increment of episode choice counter in VELVET_KV
 * - POST /api/inbox-vet       -> Live in-character AI DM / Texting Vetting via Workers AI (@cf/meta/llama-3.3-70b-instruct-fp8-fast)
 * - GET  /api/verify-checkout -> Verifies Stripe Checkout session on Cougars & Cubs Club sub-account
 * - *                         -> Static SPA + pre-rendered /guides/* served via env.ASSETS
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
  ): Promise<{ response?: string } | unknown>;
}

export interface AssetsBinding {
  fetch(request: Request): Promise<Response>;
}

export interface WorkerEnv {
  VELVET_KV?: KvNamespaceBinding;
  AI?: WorkersAiBinding;
  ASSETS?: AssetsBinding;
  STRIPE_SECRET_KEY?: string;
}

const JSON_HEADERS: Record<string, string> = {
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

interface InboxVetRequest {
  personaId?: string;
  personaName?: string;
  personaAge?: number;
  personaTitle?: string;
  personaRole?: 'her' | 'him';
  playerMessage?: string;
  history?: { sender: 'player' | 'match'; text: string }[];
}

function fallbackEvaluateDm(req: InboxVetRequest) {
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

  if (/\b(mommy|sugar\s*mama|amex|allowance|cabo)\b/.test(lower)) {
    return {
      herReply: `Rule #1 of Cougars & Cubs Club: Cougar never means Sugar Mama. Better luck on TikTok.`,
      maturityDelta: -20,
      chivalryDelta: -20,
      chemistryDelta: -18,
      coachNote: 'Fetishizing clichés or Sugar-Mama assumptions get instant blocks.',
      passedVibeCheck: false,
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
        const parsed = JSON.parse(stored) as number[];
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
      // Fallback cleanly to baseline
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
        const parsed = JSON.parse(existing) as number[];
        if (Array.isArray(parsed) && parsed.length === choiceCount) {
          liveCounts = parsed.map((n) => Number(n) || 0);
        }
      }
      liveCounts[idx] += 1;
      await env.VELVET_KV.put(key, JSON.stringify(liveCounts));
    } catch {
      // Ignore KV write errors
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
  let body: InboxVetRequest = {};
  try {
    body = (await request.json()) as InboxVetRequest;
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
          ? `Community etiquette: You despise lazy "hey/wyd" texts, Snapchat requests, "for your age" backhanded compliments, and Sugar-Mama/Mommy stereotypes. You love emotional maturity, concrete date plans, punctuation, chivalry, and genuine confidence.`
          : `Community etiquette: You are a confident, emotionally mature younger man who plans real dates, respects her schedule, and never plays games.`,
        `Respond ONLY with a valid single-line JSON object matching this exact schema (no markdown fences):`,
        `{"herReply":"1-2 witty in-character sentences","maturityDelta":number(-20..25),"chivalryDelta":number(-20..25),"chemistryDelta":number(-20..25),"coachNote":"1 crisp coaching tip","passedVibeCheck":boolean}`,
      ].join(' ');

      const recentTurns = Array.isArray(body.history)
        ? body.history
            .slice(-4)
            .map((t) => ({
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

      let rawResult: { response?: unknown } | undefined;
      try {
        rawResult = (await env.AI.run(
          '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
          chatPayload,
        )) as { response?: unknown };
      } catch {
        rawResult = (await env.AI.run('@cf/meta/llama-3.1-8b-instruct', chatPayload)) as {
          response?: unknown;
        };
      }

      interface ParsedAiReply {
        herReply?: string;
        maturityDelta?: number;
        chivalryDelta?: number;
        chemistryDelta?: number;
        coachNote?: string;
        passedVibeCheck?: boolean;
      }

      let parsed: ParsedAiReply | null = null;

      if (rawResult?.response && typeof rawResult.response === 'object') {
        parsed = rawResult.response as ParsedAiReply;
      } else if (typeof rawResult?.response === 'string') {
        const jsonMatch = rawResult.response.trim().match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]) as ParsedAiReply;
        }
      }

      if (parsed?.herReply) {
        return jsonResponse({
          herReply: String(parsed.herReply).slice(0, 360),
          maturityDelta: Math.max(-25, Math.min(25, Number(parsed.maturityDelta ?? 10))),
          chivalryDelta: Math.max(-25, Math.min(25, Number(parsed.chivalryDelta ?? 10))),
          chemistryDelta: Math.max(-25, Math.min(25, Number(parsed.chemistryDelta ?? 12))),
          coachNote: String(parsed.coachNote || 'Live AI Vibe Check complete.').slice(0, 200),
          passedVibeCheck: Boolean(parsed.passedVibeCheck),
          source: 'workers-ai',
        });
      }
    } catch {
      // Fall through cleanly to deterministic local heuristic
    }
  }

  return jsonResponse({
    ...fallbackEvaluateDm(body),
    source: 'local-heuristic',
  });
}

async function handleVerifyCheckout(url: URL, env: WorkerEnv): Promise<Response> {
  const sessionId = sanitizeId(url.searchParams.get('session_id'), 120);
  if (!sessionId || !sessionId.startsWith('cs_')) {
    return jsonResponse({ verified: false, reason: 'Invalid session_id' }, 400);
  }

  if (!env.STRIPE_SECRET_KEY) {
    return jsonResponse({ verified: false, reason: 'Stripe secret not yet configured' });
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
      metadata?: Record<string, string>;
    };
    if (session.payment_status !== 'paid') {
      return jsonResponse({ verified: false });
    }
    const isVip =
      session.metadata?.tier === 'vip' || (typeof session.amount_total === 'number' && session.amount_total >= 600);
    return jsonResponse({
      verified: true,
      grantType: isVip ? 'vip' : 'credits',
      credits: isVip ? 10 : 15,
    });
  } catch {
    return jsonResponse({ verified: false }, 500);
  }
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return jsonResponse({
        ok: true,
        service: 'cougars-and-cubs-club',
        kvBound: Boolean(env.VELVET_KV),
        aiBound: Boolean(env.AI),
        stripeConfigured: Boolean(env.STRIPE_SECRET_KEY),
      });
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

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
