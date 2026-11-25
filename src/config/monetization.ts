export interface MonetizationConfig {
  dailyFreeCredits: 10;
  shareRewardCredits: 3;
  newsletterRewardCredits: 5;
  tipJarUrl: string;
  kofiUrl: string;
  stripeCreditPackUrl: string;
  stripeVipPassUrl: string;
  cameoCommissionUrl: string;
  newsletterActionUrl: string;
  amazonAssociateTag: string;
  partnerSubId: string;
  vipUnlockCodes: string[];
  sandboxPreviewMode: boolean;
}

/**
 * Single source of truth for Cougar & Cub Club monetization.
 * Strictly isolated from natalwealth.app—only populate URLs belonging to
 * the dedicated Cougars & Cubs Club Stripe sub-account / Ko-fi / Amazon tag.
 * Notice `tipJarUrl` and `cameoCommissionUrl` default to '' (no dead 404 external links!)
 * so clicking Tip Martini opens the in-app Creator Lounge cleanly until live Stripe links are set.
 */
export const MONETIZATION_CONFIG: MonetizationConfig = {
  dailyFreeCredits: 10,
  shareRewardCredits: 3,
  newsletterRewardCredits: 5,
  tipJarUrl: '',
  kofiUrl: '',
  stripeCreditPackUrl: '',
  stripeVipPassUrl: '',
  cameoCommissionUrl: '',
  newsletterActionUrl: '',
  amazonAssociateTag: '',
  partnerSubId: '',
  vipUnlockCodes: ['VELVETVIP', 'BLACKCARD', 'SHORTLEASH'],
  sandboxPreviewMode: true,
};
