import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BoutiqueAndVipModal } from '../src/components/BoutiqueAndVipModal';
import { MONETIZATION_CONFIG } from '../src/config/monetization';
import { createDefaultWallet } from '../src/domain/economy';
import worker, { type KvNamespaceBinding } from '../worker/index';

function createMockKv(): KvNamespaceBinding {
  const store = new Map<string, string>();
  return {
    async get(key: string) {
      return store.get(key) ?? null;
    },
    async put(key: string, value: string) {
      store.set(key, value);
    },
  };
}

describe('v35 Boutique Security (Paid-Session-Only Cameo Briefs) & Consumer Romance-Sim VIP UX', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('removes the hackable Stripe checkout email brief form from Waitlist & Invite and hides cameo brief composer unless a verified $29 sessionId is active', () => {
    const { unmount } = render(
      <BoutiqueAndVipModal
        open={true}
        wallet={createDefaultWallet()}
        initialSection="rewards"
        onClose={vi.fn()}
        onRedeemCode={() => false}
        onSandboxGrantCredits={vi.fn()}
        onSandboxUnlockVip={vi.fn()}
        onClaimNewsletterBonus={() => false}
      />,
    );

    const dialog = screen.getByRole('dialog', {
      name: /Cougars & Cubs Club VIP & Creator Lounge/i,
    });
    expect(dialog.textContent).not.toMatch(/Stripe checkout email/i);
    expect(screen.queryByPlaceholderText(/Stripe checkout email/i)).toBeNull();
    expect(dialog.textContent).not.toMatch(/Submit Your Brief/i);
    unmount();

    // Open on VIP tab without a verified $29 session -> shows clear $2.99 / $6.99 / $29 pricing cards, zero AI jargon "Desire Unlocks", and zero open brief form
    const u2 = render(
      <BoutiqueAndVipModal
        open={true}
        wallet={createDefaultWallet()}
        initialSection="vip"
        onClose={vi.fn()}
        onRedeemCode={() => false}
        onSandboxGrantCredits={vi.fn()}
        onSandboxUnlockVip={vi.fn()}
        onClaimNewsletterBonus={() => false}
      />,
    );
    const vipDialog = screen.getByRole('dialog', {
      name: /Cougars & Cubs Club VIP & Creator Lounge/i,
    });
    expect(vipDialog.textContent).not.toMatch(/Desire Unlocks/i);
    expect(vipDialog.textContent).toMatch(/Cast a Cougar or Cub/i);
    expect(vipDialog.textContent).toMatch(/Lifetime VIP Black Card/i);
    expect(screen.queryByPlaceholderText(/Stripe checkout email/i)).toBeNull();
    expect(screen.queryByTestId('verified-cameo-composer')).toBeNull();

    // Direct $29 Stripe Checkout link is prominently wired on the Producer card
    const cameoLink = screen.getByRole('link', { name: /Sponsor a Character — \$29/i });
    expect(cameoLink.getAttribute('href')).toBe(MONETIZATION_CONFIG.cameoCommissionUrl);

    // Secondary restore / gift code forms stay cleanly tucked until toggled
    expect(screen.queryByPlaceholderText(/Checkout email/i)).toBeNull();
    fireEvent.click(
      screen.getByRole('button', { name: /Already purchased VIP or have a gift code/i }),
    );
    expect(screen.getByPlaceholderText(/Email used on Stripe/i)).toBeInTheDocument();
    u2.unmount();

    // When a verified paid $29 Stripe session IS passed, the Verified Producer Brief Composer unlocks with ZERO email spoofing input!
    render(
      <BoutiqueAndVipModal
        open={true}
        wallet={createDefaultWallet()}
        initialSection="vip"
        verifiedCameoSessionId="cs_live_paid_cameo_777"
        onClose={vi.fn()}
        onRedeemCode={() => false}
        onSandboxGrantCredits={vi.fn()}
        onSandboxUnlockVip={vi.fn()}
        onClaimNewsletterBonus={() => false}
      />,
    );
    expect(screen.getByTestId('verified-cameo-composer')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Stripe checkout email/i)).toBeNull();
  });

  it('rejects unauthenticated or unpaid POST /api/cameo-brief requests (403) and accepts strictly 1 brief per verified $29 Stripe sessionId', async () => {
    const kv = createMockKv();

    // 1. Spoofed email without sessionId -> 403 Forbidden
    const spoofRes = await worker.fetch(
      new Request('https://cougarsandcubs.club/api/cameo-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'spoofed@buyer.com',
          brief: 'Put my fake character in the game for free!',
        }),
      }),
      { VELVET_KV: kv, STRIPE_SECRET_KEY: 'sk_test_mock' },
    );
    expect(spoofRes.status).toBe(403);

    // 2. Unverified sessionId when Stripe rejects -> 403 Forbidden
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('{}', { status: 404 }));
    const fakeSessionRes = await worker.fetch(
      new Request('https://cougarsandcubs.club/api/cameo-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'cs_live_fake_000',
          brief: 'Trying to guess a session ID without paying!',
        }),
      }),
      { VELVET_KV: kv, STRIPE_SECRET_KEY: 'sk_test_mock' },
    );
    expect(fakeSessionRes.status).toBe(403);

    // 3. Verify real $29 Cameo checkout session -> issues cameo_session receipt in KV
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          payment_status: 'paid',
          amount_total: 2900,
          metadata: { tier: 'cameo' },
          customer_details: { email: 'realpatron@example.com' },
        }),
        { status: 200 },
      ),
    );
    const verifyRes = await worker.fetch(
      new Request(
        'https://cougarsandcubs.club/api/verify-checkout?session_id=cs_live_cameo_real99',
      ),
      { VELVET_KV: kv, STRIPE_SECRET_KEY: 'sk_test_mock' },
    );
    expect(verifyRes.status).toBe(200);
    const verifyJson = (await verifyRes.json()) as {
      verified: boolean;
      grantType: string;
      credits: number;
      cameoSessionId?: string;
    };
    expect(verifyJson.verified).toBe(true);
    expect(verifyJson.credits).toBe(50);
    expect(verifyJson.cameoSessionId).toBe('cs_live_cameo_real99');

    // 4. Submit brief using verified cameoSessionId -> 200 OK once, then 409 on replay!
    const validBriefRes = await worker.fetch(
      new Request('https://cougarsandcubs.club/api/cameo-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'cs_live_cameo_real99',
          brief: '44F Santa Barbara vineyard architect who roasts crypto bros over Pinot Noir.',
        }),
      }),
      { VELVET_KV: kv, STRIPE_SECRET_KEY: 'sk_test_mock' },
    );
    expect(validBriefRes.status).toBe(200);

    const replayRes = await worker.fetch(
      new Request('https://cougarsandcubs.club/api/cameo-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'cs_live_cameo_real99',
          brief: 'Trying to submit a second spam brief on the same session!',
        }),
      }),
      { VELVET_KV: kv, STRIPE_SECRET_KEY: 'sk_test_mock' },
    );
    expect(replayRes.status).toBe(409);
  });
});
