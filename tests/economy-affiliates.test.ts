import { describe, expect, it } from 'vitest';
import { MONETIZATION_CONFIG } from '../src/config/monetization';
import {
  applyUnlockCodeOrQuery,
  grantFounderAccess,
  grantRewardCredits,
  loadWallet,
  revokeFounderAccess,
  saveWallet,
  spendCredits,
  verifyFounderPassphrase,
  WALLET_STORAGE_KEY,
} from '../src/domain/economy';
import { AFFILIATE_CATALOG, buildAffiliateUrl, getAffiliateById } from '../src/lib/affiliates';
import { JOURNAL_ARTICLES } from '../src/data/journalArticles';
import { localCrowdStatsService } from '../src/services/adapters';
import workerApp, { type WorkerEnv } from '../worker/index';

function makeMemoryStorage(initial?: Record<string, string>) {
  const store = new Map<string, string>(Object.entries(initial ?? {}));
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  };
}

describe('Wallet economy, affiliate router & Worker security seams (v35)', () => {
  it('grants 5 one-time starter credits, never auto-refills on next-day rollover, and recovers cleanly from corrupted storage', () => {
    const corrupted = makeMemoryStorage({ [WALLET_STORAGE_KEY]: '{not-valid-json' });
    const recovered = loadWallet(corrupted, new Date('2026-11-24T12:00:00Z'));
    expect(recovered.credits).toBe(5);
    expect(recovered.fridayHearts).toBe(3);
    expect(recovered.isVip).toBe(false);

    const spent = spendCredits(recovered, 4);
    expect(spent.ok).toBe(true);
    expect(spent.wallet.credits).toBe(1);
    saveWallet(spent.wallet, corrupted);

    const nextDay = loadWallet(corrupted, new Date('2026-11-25T09:00:00Z'));
    expect(nextDay.credits).toBe(1);
  });

  it('grants one-time reward credits idempotently when positive amount is specified', () => {
    const storage = makeMemoryStorage();
    const initial = loadWallet(storage, new Date('2026-11-24T12:00:00Z'));

    const first = grantRewardCredits(initial, 'promo_once', 3);
    expect(first.granted).toBe(true);
    expect(first.wallet.credits).toBe(8);

    const duplicate = grantRewardCredits(first.wallet, 'promo_once', 3);
    expect(duplicate.granted).toBe(false);
    expect(duplicate.wallet.credits).toBe(8);
  });

  it('blocks ?founder=1 and plaintext founder codes while verifying salted SHA-256 Founder passphrase', async () => {
    const storage = makeMemoryStorage();
    const initial = loadWallet(storage, new Date('2026-11-24T12:00:00Z'));

    expect(MONETIZATION_CONFIG.stripeCreditPackUrl).toContain('https://buy.stripe.com/');
    expect(MONETIZATION_CONFIG.stripeVipPassUrl).toContain('https://buy.stripe.com/');
    expect(MONETIZATION_CONFIG.tipJarUrl).toContain('https://buy.stripe.com/');
    expect(MONETIZATION_CONFIG.cameoCommissionUrl).toContain('https://buy.stripe.com/');
    expect(MONETIZATION_CONFIG.sandboxPreviewMode).toBe(false);
    expect(initial.referralCode).toMatch(/^vd[a-z0-9]{4,8}$/);

    expect(applyUnlockCodeOrQuery(initial, 'velvetvip').unlocked).toBeNull();
    expect(applyUnlockCodeOrQuery(initial, 'foundermode').unlocked).toBeNull();
    expect(applyUnlockCodeOrQuery(initial, '?founder=1').unlocked).toBeNull();

    const legacyFounderStorage = makeMemoryStorage({
      [WALLET_STORAGE_KEY]: JSON.stringify({
        ...initial,
        credits: 999,
        isVip: true,
        isFounderUnlimited: true,
        founderSessionToken: '6db6ba6ecc5e83f90d1678b2',
      }),
    });
    const scrubbed = loadWallet(legacyFounderStorage, new Date('2026-11-24T12:00:00Z'));
    expect(scrubbed.isFounderUnlimited).toBe(false);
    expect(scrubbed.isVip).toBe(false);
    expect(scrubbed.credits).toBe(5);

    expect(await verifyFounderPassphrase('foundermode')).toBe(false);
    expect(await verifyFounderPassphrase('wrong-passphrase-2026')).toBe(false);
    expect(await verifyFounderPassphrase('SunsetHills!2026#VaultKey')).toBe(true);

    const granted = grantFounderAccess(initial);
    expect(granted.isFounderUnlimited).toBe(true);
    saveWallet(granted, storage);
    expect(loadWallet(storage, new Date('2026-11-24T12:00:00Z')).isFounderUnlimited).toBe(false);
    expect(revokeFounderAccess(granted).isFounderUnlimited).toBe(false);

    const orig = MONETIZATION_CONFIG.sandboxPreviewMode;
    MONETIZATION_CONFIG.sandboxPreviewMode = true;
    try {
      const codeResult = applyUnlockCodeOrQuery(initial, 'velvetvip');
      expect(codeResult.unlocked).toBe('vip');
      expect(codeResult.wallet.isVip).toBe(true);

      const queryCredits = applyUnlockCodeOrQuery(initial, '?unlock=credits15');
      expect(queryCredits.unlocked).toBe('credits');
      expect(queryCredits.wallet.credits).toBe(20);
    } finally {
      MONETIZATION_CONFIG.sandboxPreviewMode = orig;
    }
  });

  it('builds valid affiliate URLs with existing query strings, unset/set tags, and blocks explicit adult domains', () => {
    const productWithQuery = {
      ...AFFILIATE_CATALOG[0],
      merchantUrl: 'https://www.amazon.com/dp/B0BXXDBB8F?th=1',
    };

    const untagged = buildAffiliateUrl(productWithQuery, 'episode_houseboy', {
      amazonAssociateTag: '',
      partnerSubId: '',
    });
    expect(untagged).toContain('th=1');
    expect(untagged).not.toContain('??');
    expect(untagged.split('?').length).toBe(2);
    expect(untagged).toContain('utm_campaign=episode_houseboy');
    expect(untagged).not.toContain('tag=');

    const tagged = buildAffiliateUrl(productWithQuery, 'episode_houseboy', {
      amazonAssociateTag: 'cougarsandcub-20',
      partnerSubId: 'vd_sub1',
    });
    expect(tagged).toContain('tag=cougarsandcub-20');
    expect(tagged).toContain('th=1');

    expect(() =>
      buildAffiliateUrl(
        {
          ...AFFILIATE_CATALOG[0],
          merchantUrl: 'https://www.lovehoney.com/sex-toys/item',
        },
        'shop',
      ),
    ).toThrow(/prohibited adult domain/i);
  });

  it('provides deterministic crowd percentages and verifies all 33 /dp/ catalog items, all 16 guides, and Worker /api/go/:id redirects', async () => {
    const percentages = await localCrowdStatsService.getChoicePercentages('check-drop', 3);
    expect(percentages).toHaveLength(3);
    expect(percentages.reduce((sum, n) => sum + n, 0)).toBe(100);

    expect(AFFILIATE_CATALOG.length).toBe(33);
    for (const guide of JOURNAL_ARTICLES) {
      expect(guide.featuredAffiliateIds.length).toBeGreaterThanOrEqual(2);
      for (const affId of guide.featuredAffiliateIds) {
        expect(getAffiliateById(affId)).toBeDefined();
      }
    }

    const mockEnv: WorkerEnv = { AMAZON_ASSOCIATE_TAG: 'cougarsandcub-20' };
    for (const item of AFFILIATE_CATALOG) {
      expect(item.merchantUrl).toMatch(/^https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}$/);
      expect(item.photoUrl).toContain('./images/products/');
      const res = await workerApp.fetch(
        new Request(`https://cougarsandcubs.club/api/go/${item.id}?src=test_suite`),
        mockEnv,
      );
      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toContain('tag=cougarsandcub-20');
    }

    const badSealRes = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/founder-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ founderSeal: 'a'.repeat(64) }),
      }),
      mockEnv,
    );
    expect(badSealRes.status).toBe(401);

    const goodLoginRes = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/founder-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase: 'SunsetHills!2026#VaultKey' }),
      }),
      mockEnv,
    );
    expect(goodLoginRes.status).toBe(200);
    const loginJson = (await goodLoginRes.json()) as {
      authorized: boolean;
      founderSeal: string;
    };
    expect(loginJson.authorized).toBe(true);
    expect(loginJson.founderSeal).toMatch(/^[0-9a-f]{64}$/);
  });
});
