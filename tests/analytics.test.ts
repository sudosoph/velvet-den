import { describe, expect, it, vi } from 'vitest';
import {
  buildAnalyticsPayload,
  getOrCreateStablePlayerUuid,
  getPostHogTracingHeaders,
  identifyPlayerWithContact,
  trackEvent,
} from '../src/lib/analytics';
import worker from '../worker/index';

describe('PostHog analytics contract & safe no-op guard', () => {
  it('attaches app="cougars_and_cubs_club" and never throws when token is unset in Vitest', () => {
    const payload = buildAnalyticsPayload({
      product_id: 'leopard-print-cougar-apron',
      placement: 'boutique',
    });
    expect(payload.app).toBe('cougars_and_cubs_club');
    expect(payload.product_id).toBe('leopard-print-cougar-apron');
    expect(() =>
      trackEvent('affiliate_clicked', {
        product_id: 'leopard-print-cougar-apron',
        placement: 'boutique',
      }),
    ).not.toThrow();
  });

  it('generates a stable non-PII UUID for distinct_id and never uses raw email as distinct_id', () => {
    const id1 = getOrCreateStablePlayerUuid();
    const id2 = getOrCreateStablePlayerUuid();
    expect(id1).toBe(id2);
    expect(id1).toMatch(/^cc_[a-z0-9-]+$/i);
    const headers = getPostHogTracingHeaders();
    expect(headers['X-POSTHOG-DISTINCT-ID']).toBe(id1);
    expect(() =>
      identifyPlayerWithContact('vivian@example.com', { role: 'her' }),
    ).not.toThrow();
  });

  it('proxies /ingest/static/* to us-assets.i.posthog.com and /ingest/e/ to us.i.posthog.com', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      return new Response(JSON.stringify({ proxiedTo: String(input) }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Set-Cookie': 'ph_leak=1' },
      });
    });

    try {
      const staticRes = await worker.fetch(
        new Request('https://cougarsandcubs.club/ingest/static/array.js?v=1'),
        {},
      );
      const staticJson = (await staticRes.json()) as { proxiedTo: string };
      expect(staticJson.proxiedTo).toBe('https://us-assets.i.posthog.com/static/array.js?v=1');
      expect(staticRes.headers.get('set-cookie')).toBeNull();

      const eventRes = await worker.fetch(
        new Request('https://cougarsandcubs.club/ingest/e/?ip=0', {
          method: 'POST',
          body: JSON.stringify({ event: 'swipe_decision' }),
        }),
        {},
      );
      const eventJson = (await eventRes.json()) as { proxiedTo: string };
      expect(eventJson.proxiedTo).toBe('https://us.i.posthog.com/e/?ip=0');
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it('exposes posthogProxyActive and v35 health version on /api/health', async () => {
    const res = await worker.fetch(new Request('https://cougarsandcubs.club/api/health'), {});
    const data = (await res.json()) as Record<string, unknown>;
    expect(data.ok).toBe(true);
    expect(data.version).toBe('v35-club-romance-sim');
    expect(data.posthogProxyActive).toBe(true);
  });
});
