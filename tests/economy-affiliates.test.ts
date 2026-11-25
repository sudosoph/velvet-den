import { describe, expect, it } from 'vitest';
import {
  applyUnlockCodeOrQuery,
  grantRewardCredits,
  loadWallet,
  saveWallet,
  spendCredits,
} from '../src/domain/economy';
import { AFFILIATE_CATALOG, buildAffiliateUrl } from '../src/lib/affiliates';
import { localCrowdStatsService } from '../src/services/adapters';

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

  it('redeems VIP unlock codes and Stripe redirect query params', () => {
    const storage = makeMemoryStorage();
    const initial = loadWallet(storage, new Date('2026-11-24T12:00:00Z'));

    const codeResult = applyUnlockCodeOrQuery(initial, 'velvetvip');
    expect(codeResult.unlocked).toBe('vip');
    expect(codeResult.wallet.isVip).toBe(true);

    const queryCredits = applyUnlockCodeOrQuery(initial, '?unlock=credits15');
    expect(queryCredits.unlocked).toBe('credits');
    expect(queryCredits.wallet.credits).toBe(25);
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
});
