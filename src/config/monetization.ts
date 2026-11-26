export interface MonetizationConfig {
  dailyFreeCredits: 5;
  shareRewardCredits: 0;
  newsletterRewardCredits: 3;
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
 * Single source of truth for Cougars & Cubs Club monetization (v34 Exit-Ready Economy).
 * Strictly isolated from natalwealth.app: only populate URLs belonging to
 * the dedicated Cougars & Cubs Club Stripe sub-account / Ko-fi / Amazon tag.
 */
export const MONETIZATION_CONFIG: MonetizationConfig = {
  dailyFreeCredits: 5,
  shareRewardCredits: 0,
  newsletterRewardCredits: 3,
  tipJarUrl: 'https://buy.stripe.com/bJe8wPbgZb9c8VR9i0fjG02',
  kofiUrl: '',
  stripeCreditPackUrl: 'https://buy.stripe.com/9B6eVdetb4KO5JF2TCfjG00',
  stripeVipPassUrl: 'https://buy.stripe.com/7sYfZhfxfgtw0pldygfjG01',
  cameoCommissionUrl: 'https://buy.stripe.com/aFaaEX0Clcdg0plgKsfjG03',
  newsletterActionUrl: '',
  amazonAssociateTag: '',
  partnerSubId: '',
  vipUnlockCodes: ['VELVETVIP', 'BLACKCARD', 'SHORTLEASH'],
  sandboxPreviewMode: false,
};
