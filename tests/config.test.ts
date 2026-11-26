import { describe, expect, it } from 'vitest';
import { BRAND_CONFIG } from '../src/config/brand';
import { MONETIZATION_CONFIG } from '../src/config/monetization';

describe('Project configuration defaults (v34 exit-ready economy)', () => {
  it('exposes spec-pinned 5-credit daily starter, 3-credit dispatch, and 0 free share credits', () => {
    expect(MONETIZATION_CONFIG.dailyFreeCredits).toBe(5);
    expect(MONETIZATION_CONFIG.shareRewardCredits).toBe(0);
    expect(MONETIZATION_CONFIG.newsletterRewardCredits).toBe(3);
    expect(BRAND_CONFIG.name).toBe('Cougars & Cubs Club');
    expect(MONETIZATION_CONFIG.vipUnlockCodes.length).toBeGreaterThan(0);
  });
});
