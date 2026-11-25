import { describe, expect, it } from 'vitest';
import { BRAND_CONFIG } from '../src/config/brand';
import { MONETIZATION_CONFIG } from '../src/config/monetization';

describe('Project configuration defaults', () => {
  it('exposes spec-pinned credit constants and safe non-empty fallback URLs', () => {
    expect(MONETIZATION_CONFIG.dailyFreeCredits).toBe(10);
    expect(MONETIZATION_CONFIG.shareRewardCredits).toBe(3);
    expect(MONETIZATION_CONFIG.newsletterRewardCredits).toBe(5);
    expect(BRAND_CONFIG.name).toContain('Velvet Den');
    expect(MONETIZATION_CONFIG.vipUnlockCodes.length).toBeGreaterThan(0);
  });
});
