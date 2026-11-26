import { describe, expect, it } from 'vitest';
import { BRAND_CONFIG } from '../src/config/brand';
import { MONETIZATION_CONFIG } from '../src/config/monetization';

describe('Project configuration defaults (v35 Dream Daddy hybrid economy)', () => {
  it('exposes spec-pinned 3-credit one-time starter, 0 daily refill, 0 free share/newsletter credits, and verified Amazon Associate tag', () => {
    expect(MONETIZATION_CONFIG.starterCredits).toBe(3);
    expect(MONETIZATION_CONFIG.dailyFreeCredits).toBe(0);
    expect(MONETIZATION_CONFIG.shareRewardCredits).toBe(0);
    expect(MONETIZATION_CONFIG.newsletterRewardCredits).toBe(0);
    expect(MONETIZATION_CONFIG.amazonAssociateTag).toBe('cougarsandcub-20');
    expect(BRAND_CONFIG.name).toBe('Cougars & Cubs Club');
    expect(MONETIZATION_CONFIG.vipUnlockCodes.length).toBeGreaterThan(0);
  });
});
