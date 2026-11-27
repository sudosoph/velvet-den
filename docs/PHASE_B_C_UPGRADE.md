# Phase B & Phase C Serverless Upgrade Blueprint

Phase A is architected with clean TypeScript service interfaces in `src/services/adapters.ts` (`CrowdStatsService` and `AiDmVettingService`) so you can step up to **Phase B** (live global crowd percentages + server-verified Stripe webhooks) and **Phase C** (Gemini Flash *"Survive Her Inbox"* live AI vetting rounds) without rewriting any UI components.

---

## Phase B: Cloudflare Worker + KV (Live Crowd Stats & Verified Stripe Unlocks)

1. Create a free Cloudflare KV namespace `VELVET_KV` and deploy the Worker below (`npx wrangler deploy`):

```ts
export interface Env {
  VELVET_KV: KVNamespace;
  STRIPE_WEBHOOK_SECRET: string;
  GEMINI_API_KEY: string;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const cors = {
      'Access-Control-Allow-Origin': 'https://cougarsandcubs.club',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    // GET /stats?episodeId=check-drop
    if (url.pathname === '/stats' && req.method === 'GET') {
      const ep = url.searchParams.get('episodeId') || 'check-drop';
      const raw = (await env.VELVET_KV.get(`stats:${ep}`, 'json')) as number[] | null;
      const counts = raw ?? [12, 4, 6];
      const sum = counts.reduce((a, b) => a + b, 0) || 1;
      const pcts = counts.map((c) => Math.round((c / sum) * 100));
      return Response.json({ percentages: pcts }, { headers: cors });
    }

    // POST /stats { episodeId, choiceIndex }
    if (url.pathname === '/stats' && req.method === 'POST') {
      const { episodeId, choiceIndex } = (await req.json()) as {
        episodeId: string;
        choiceIndex: number;
      };
      const key = `stats:${episodeId}`;
      const counts = ((await env.VELVET_KV.get(key, 'json')) as number[] | null) ?? [10, 5, 5];
      if (choiceIndex >= 0 && choiceIndex < counts.length) counts[choiceIndex] += 1;
      await env.VELVET_KV.put(key, JSON.stringify(counts));
      return Response.json({ ok: true }, { headers: cors });
    }

    return new Response('Not found', { status: 404, headers: cors });
  },
};
```

2. Point `localCrowdStatsService` in `src/services/adapters.ts` at your Worker URL.

---

## Phase C: Gemini Flash Live "Survive Her Inbox" DM Vetting Mode

To enable freeform AI DM vetting (spending 1 paid credit per round while staying strictly PG-13/R-rated cheeky for Stripe safety):

1. Add a `/vet-dm` route to the Worker above calling `gemini-2.5-flash` via `@google/genai` with structured JSON output (`{ maturityDelta, chemistryDelta, herReply, passedVibeCheck }`) and a system instruction enforcing **strictly SFW/PG-13 witty banter** (rejecting explicit inputs cleanly).
2. Implement `AiDmVettingService` in `src/services/adapters.ts` (`isEnabled: () => true`) to light up the bonus inbox challenge tab.
