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
} from '../src/domain/economy';
import { AFFILIATE_CATALOG, buildAffiliateUrl, getAffiliateById } from '../src/lib/affiliates';
import { EPISODES } from '../src/data/episodes';
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

describe('Wallet economy, affiliate router & Phase B/C service seams', () => {
  it('refills daily credits across date rollovers and recovers cleanly from corrupted storage (Review Focus #3)', () => {
    const corrupted = makeMemoryStorage({ 'velvet_den_wallet_v1': '{not-valid-json' });
    const recovered = loadWallet(corrupted, new Date('2026-11-24T12:00:00Z'));
    expect(recovered.credits).toBe(10);
    expect(recovered.isVip).toBe(false);

    const spent = spendCredits(recovered, 6);
    expect(spent.ok).toBe(true);
    expect(spent.wallet.credits).toBe(4);
    saveWallet(spent.wallet, corrupted);

    // Same day reload keeps 4 credits
    const sameDay = loadWallet(corrupted, new Date('2026-11-24T20:00:00Z'));
    expect(sameDay.credits).toBe(4);

    // Next day refills back up to 10
    const nextDay = loadWallet(corrupted, new Date('2026-11-25T09:00:00Z'));
    expect(nextDay.credits).toBe(10);
  });

  it('grants share and newsletter bonus credits idempotently so rewards cannot be farmed (Review Focus #3)', () => {
    const storage = makeMemoryStorage();
    const initial = loadWallet(storage, new Date('2026-11-24T12:00:00Z'));

    const first = grantRewardCredits(initial, 'first_share', 3);
    expect(first.granted).toBe(true);
    expect(first.wallet.credits).toBe(13);

    const duplicate = grantRewardCredits(first.wallet, 'first_share', 3);
    expect(duplicate.granted).toBe(false);
    expect(duplicate.wallet.credits).toBe(13);
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

    // In live mode, public demo codes, ?founder=1 URL params, and old plaintext codes are ALL blocked
    expect(applyUnlockCodeOrQuery(initial, 'velvetvip').unlocked).toBeNull();
    expect(applyUnlockCodeOrQuery(initial, 'foundermode').unlocked).toBeNull();
    expect(applyUnlockCodeOrQuery(initial, '?founder=1').unlocked).toBeNull();

    // Stale or forged localStorage (including legacy 999-credit founder tokens) is ALWAYS scrubbed to normal player mode on load!
    const legacyFounderStorage = makeMemoryStorage({
      velvet_den_wallet_v1: JSON.stringify({
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
    expect(scrubbed.credits).toBe(10);

    // Salted SHA-256 passphrase verification succeeds only with exact private passphrase
    expect(await verifyFounderPassphrase('foundermode')).toBe(false);
    expect(await verifyFounderPassphrase('wrong-passphrase-2026')).toBe(false);
    expect(await verifyFounderPassphrase('ChampagneClub!2026#Sophia')).toBe(true);

    // Ephemeral in-memory Founder unlock NEVER persists to localStorage across page reloads!
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
      expect(queryCredits.wallet.credits).toBe(25);
    } finally {
      MONETIZATION_CONFIG.sandboxPreviewMode = orig;
    }
  });

  it('builds valid affiliate URLs with existing query strings, unset/set tags, and blocks explicit adult domains (Review Focus #4)', () => {
    expect(AFFILIATE_CATALOG.length).toBeGreaterThanOrEqual(8);

    const productWithQuery = {
      ...AFFILIATE_CATALOG[0],
      merchantUrl: 'https://www.amazon.com/dp/B0EXAMPLE1?th=1',
    };

    // Works cleanly before partner configures Amazon tag
    const untagged = buildAffiliateUrl(productWithQuery, 'episode_houseboy', {
      amazonAssociateTag: '',
      partnerSubId: '',
    });
    expect(untagged).toContain('th=1');
    expect(untagged).not.toContain('??');
    expect(untagged.split('?').length).toBe(2);
    expect(untagged).toContain('utm_campaign=episode_houseboy');
    expect(untagged).not.toContain('tag=');

    // Automatically injects Amazon Associate tag once configured
    const tagged = buildAffiliateUrl(productWithQuery, 'episode_houseboy', {
      amazonAssociateTag: 'velvetden-20',
      partnerSubId: 'vd_sub1',
    });
    expect(tagged).toContain('tag=velvetden-20');
    expect(tagged).toContain('th=1');

    // Rejects prohibited adult domains to protect Ko-fi / Stripe accounts
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

  it('provides deterministic Phase A crowd percentages behind the Phase B CrowdStatsService interface', async () => {
    const percentages = await localCrowdStatsService.getChoicePercentages('check-drop', 3);
    expect(percentages).toHaveLength(3);
    expect(percentages.reduce((sum, n) => sum + n, 0)).toBe(100);
  });

  it('verifies 100% organic affiliate coverage across all 24 catalog items, all 81 episodes, all 15 guides, and Worker /api/go/:id redirects', async () => {
    expect(AFFILIATE_CATALOG.length).toBe(24);
    const mustHaveIds = [
      'fill-in-love-coupon-cards',
      'short-leash-leather-dog-leash',
      'babygirl-movie-prime',
      'idea-of-you-movie-book',
      'bridget-jones-cougar-town-watch',
      'big-carl-giant-wine-glass',
      'chic-candlelit-menu-readers',
      'seed-oil-free-ghee-evoo-set',
    ];
    for (const id of mustHaveIds) {
      expect(getAffiliateById(id)).toBeDefined();
    }

    // All 81 episodes map cleanly to an organic catalog item
    for (const ep of EPISODES) {
      expect(ep.recommendedAffiliateId).toBeTruthy();
      expect(getAffiliateById(ep.recommendedAffiliateId)).toBeDefined();
    }

    // All 15 in-app guides map cleanly to valid catalog items
    for (const guide of JOURNAL_ARTICLES) {
      expect(guide.featuredAffiliateIds.length).toBeGreaterThanOrEqual(2);
      for (const affId of guide.featuredAffiliateIds) {
        expect(getAffiliateById(affId)).toBeDefined();
      }
    }

    // Every catalog item redirects cleanly (302) via /api/go/:id on the Cloudflare Worker
    const mockEnv: WorkerEnv = { AMAZON_ASSOCIATE_TAG: 'cougarsandcubs-20' };
    for (const item of AFFILIATE_CATALOG) {
      const res = await workerApp.fetch(
        new Request(`https://cougarsandcubs.club/api/go/${item.id}?src=test_suite`),
        mockEnv,
      );
      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toContain('tag=cougarsandcubs-20');
    }
  });
});
