import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MONETIZATION_CONFIG } from '../src/config/monetization';
import {
  createDefaultWallet,
  loadWallet,
  loseFridayHeart,
  recordBulletDodged,
  VERIFIED_REFERRAL_REWARD_CREDITS,
  WAITLIST_REWARD_CREDITS,
  WALLET_STORAGE_KEY,
} from '../src/domain/economy';
import { AFFILIATE_CATALOG, buildAffiliateUrl } from '../src/lib/affiliates';
import worker from '../worker/index';

function createMemoryStorage(initial: Record<string, string> = {}) {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    dump: () => Object.fromEntries(map.entries()),
  };
}

describe('v35 strict 3-credit campaign wallet, Patron badge, verified ASIN catalog & Worker edge fixes', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts new players at 3 one-time credits, 3 Friday hearts, 0 daily/free credit handouts, and cougarsandcub-20 tag', () => {
    expect(MONETIZATION_CONFIG.amazonAssociateTag).toBe('cougarsandcub-20');
    expect(MONETIZATION_CONFIG.starterCredits).toBe(3);
    expect(MONETIZATION_CONFIG.dailyFreeCredits).toBe(0);
    expect(MONETIZATION_CONFIG.shareRewardCredits).toBe(0);
    expect(MONETIZATION_CONFIG.newsletterRewardCredits).toBe(0);
    expect(VERIFIED_REFERRAL_REWARD_CREDITS).toBe(0);
    expect(WAITLIST_REWARD_CREDITS).toBe(0);
    expect(WALLET_STORAGE_KEY).toBe('velvet_wallet_v35');

    const wallet = createDefaultWallet(new Date('2026-11-26T12:00:00Z'));
    expect(wallet.credits).toBe(3);
    expect(wallet.fridayHearts).toBe(3);
    expect(wallet.discernmentXp).toBe(0);
    expect(wallet.isVip).toBe(false);
    expect(wallet.hasPatronBadge).toBe(false);
    expect(wallet.conspiracyClues).toEqual([]);
  });

  it('does NOT refill credits on next-day UTC load, migrates verified stripe_* VIP from velvet_den_wallet_v1 once, and updates hearts/discernment', () => {
    const store = createMemoryStorage({
      velvet_den_wallet_v1: JSON.stringify({
        credits: 42,
        lastRefillDate: '2026-11-20',
        isVip: true,
        claimedRewards: ['stripe_session_cs_live_123'],
        unlockedEpisodeIds: ['ep1'],
        unlockedStamps: ['puma', 'cougar'],
      }),
    });

    const migrated = loadWallet(store, new Date('2026-11-26T10:00:00Z'));
    expect(migrated.isVip).toBe(true);
    expect(migrated.credits).toBe(3);

    // Spend down to 1 credit, then advance to next UTC day — must remain 1 (zero daily refill)
    store.setItem(
      WALLET_STORAGE_KEY,
      JSON.stringify({
        ...migrated,
        credits: 1,
        lastRefillDate: '2026-11-26',
      }),
    );
    const nextDay = loadWallet(store, new Date('2026-11-27T15:00:00Z'));
    expect(nextDay.credits).toBe(1);

    // Unverified legacy wallet resets to 3 credits and isVip: false
    const unverifiedStore = createMemoryStorage({
      velvet_den_wallet_v1: JSON.stringify({
        credits: 99,
        isVip: true,
        claimedRewards: [],
      }),
    });
    const clean = loadWallet(unverifiedStore, new Date('2026-11-26T10:00:00Z'));
    expect(clean.isVip).toBe(false);
    expect(clean.credits).toBe(3);

    // Friday heart loss & Bullet-Dodged discernment tracking
    const hurt = loseFridayHeart(clean);
    expect(hurt.fridayHearts).toBe(2);
    const dodged = recordBulletDodged(hurt, 'graham', 'clue-velvet-ring');
    expect(dodged.discernmentXp).toBe(25);
    expect(dodged.conspiracyClues).toContain('clue-velvet-ring');
  });

  it('enforces specific /dp/<10-char-ASIN> Amazon product URLs, real studio product photos, and zero seed-oil/search-link clutter', () => {
    expect(AFFILIATE_CATALOG.length).toBeGreaterThanOrEqual(32);
    const ids = AFFILIATE_CATALOG.map((p) => p.id);
    expect(ids).toContain('no-hard-feelings-jlaw-prime');
    expect(ids).toContain('part-of-your-world-book');
    expect(ids).not.toContain('seed-oil-free-ghee-evoo-set');

    for (const item of AFFILIATE_CATALOG) {
      expect(
        item.merchantUrl,
        `${item.id} must point to a specific /dp/<ASIN> page, not /s?k=`,
      ).toMatch(/^https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}$/);
      expect(item.photoUrl).toBe(`./images/products/${item.id}.jpg`);
      const diskPath = path.resolve(process.cwd(), 'public', item.photoUrl.replace(/^\.\//, ''));
      expect(fs.existsSync(diskPath), `Missing specific product photo ${diskPath}`).toBe(true);
      expect(fs.statSync(diskPath).size, `Empty/tiny photo ${diskPath}`).toBeGreaterThan(8_000);

      const tagged = buildAffiliateUrl(item, 'test_card', {
        amazonAssociateTag: 'cougarsandcub-20',
      });
      expect(tagged).toContain('tag=cougarsandcub-20');
      expect(tagged).toContain('linkCode=ll2');
      expect(`${item.name} ${item.badge} ${item.cheekyPitch}`).not.toMatch(
        /seed[- ]oil|timeshare|pine\s*pollen|qigong|tai\s*chi|bernedoodle|venmo/i,
      );
    }

    // Every product in AFFILIATE_CATALOG must have its own unique image path (zero shared category placeholders)
    const uniquePhotos = new Set(AFFILIATE_CATALOG.map((item) => item.photoUrl));
    expect(uniquePhotos.size).toBe(AFFILIATE_CATALOG.length);

    // Verified live 200 OK replacements for the 4 previously broken/mismatched ASINs
    expect(
      AFFILIATE_CATALOG.find((i) => i.id === 'princess-mulberry-silk-robe')?.merchantUrl,
    ).toBe('https://www.amazon.com/dp/B0FD3H89H5');
    expect(
      AFFILIATE_CATALOG.find((i) => i.id === 'no-hard-feelings-jlaw-prime')?.merchantUrl,
    ).toBe('https://www.amazon.com/dp/B0C8BTYH4M');
    expect(
      AFFILIATE_CATALOG.find((i) => i.id === 'bridget-jones-cougar-town-watch')?.merchantUrl,
    ).toBe('https://www.amazon.com/dp/0099584433');
    expect(
      AFFILIATE_CATALOG.find((i) => i.id === 'the-rebound-zeta-jones-prime')?.merchantUrl,
    ).toBe('https://www.amazon.com/dp/B006JIL0AG');
  });

  it('supports HEAD and GET on /api/go/:id with specific /dp/<ASIN> redirect and grants patron badge (0 credits) on $5 tip checkout', async () => {
    const headRes = await worker.fetch(
      new Request('https://cougarsandcubs.club/api/go/no-hard-feelings-jlaw-prime?src=quiz', {
        method: 'HEAD',
      }),
      { AMAZON_ASSOCIATE_TAG: 'sophia-20' },
    );
    expect(headRes.status).toBe(302);
    const loc = headRes.headers.get('Location') ?? '';
    expect(loc).toContain('https://www.amazon.com/dp/B0C8BTYH4M');
    expect(loc).toContain('tag=sophia-20');
    expect(loc).toContain('linkCode=ll2');

    // Mock Stripe checkout session verification for $5 tip
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          payment_status: 'paid',
          amount_total: 500,
          metadata: { tier: 'tip' },
          customer_details: { email: 'patron@example.com' },
        }),
        { status: 200 },
      ),
    );

    const tipRes = await worker.fetch(
      new Request('https://cougarsandcubs.club/api/verify-checkout?session_id=cs_live_tip123'),
      { STRIPE_SECRET_KEY: 'sk_test_mock' },
    );
    expect(tipRes.status).toBe(200);
    const tipJson = (await tipRes.json()) as {
      verified: boolean;
      grantType: string;
      credits: number;
    };
    expect(tipJson).toEqual({
      verified: true,
      grantType: 'patron',
      credits: 0,
    });
  });

  it('purges banned wellness tropes from worker/index.ts and honors Cougar perspective in /api/inbox-vet when personaRole is him', async () => {
    const workerSrc = fs.readFileSync(path.resolve(process.cwd(), 'worker/index.ts'), 'utf8');
    expect(workerSrc).not.toMatch(/pine\s*pollen|qigong|tai\s*chi|seed[- ]oil|bernedoodle/i);

    const vetRes = await worker.fetch(
      new Request('https://cougarsandcubs.club/api/inbox-vet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaName: 'Julian',
          personaAge: 27,
          personaTitle: 'Hampstead Post-Grad',
          personaRole: 'him',
          platform: 'tinder',
          playerMessage: 'Thursday works if you pick a proper cocktail bar near Velvet Palms.',
        }),
      }),
      {},
    );
    expect(vetRes.status).toBe(200);
    const vetJson = (await vetRes.json()) as {
      herReply: string;
      coachNote: string;
      passedVibeCheck: boolean;
    };
    expect(vetJson.passedVibeCheck).toBe(true);
    expect(vetJson.coachNote).not.toMatch(/cub obedience|enroll|earn his number/i);
  });

  it('routes localhost/127.0.0.1 preview environments directly to tagged Amazon /dp/ URLs while routing live cougarsandcubs.club through /api/go/:id', () => {
    const sample = AFFILIATE_CATALOG.find((i) => i.id === 'hosting-lidded-bin-soap')!;
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
    );

    const origLocation = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: new URL('http://127.0.0.1:4173/'),
    });
    try {
      const localUrl = buildAffiliateUrl(sample, 'cub_school_m1');
      expect(localUrl).toContain('https://www.amazon.com/dp/B0FHH85CXQ');
      expect(localUrl).toContain('tag=cougarsandcub-20');
      expect(localUrl).not.toContain('/api/go/');

      Object.defineProperty(window, 'location', {
        configurable: true,
        value: new URL('https://cougarsandcubs.club/'),
      });
      const prodUrl = buildAffiliateUrl(sample, 'cub_school_m1');
      expect(prodUrl).toBe('/api/go/hosting-lidded-bin-soap?src=cub_school_m1');
    } finally {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: origLocation,
      });
    }
  });
});
