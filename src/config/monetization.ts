export interface MonetizationConfig {
  starterCredits: 5;
  dailyFreeCredits: 0;
  shareRewardCredits: 0;
  newsletterRewardCredits: 0;
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
 * Single source of truth for Cougars & Cubs Club monetization.
 * Strictly isolated from natalwealth.app: only populate URLs belonging to
 * the dedicated Cougars & Cubs Club Stripe sub-account & Amazon Associates StoreID.
 */
export const MONETIZATION_CONFIG: MonetizationConfig = {
  starterCredits: 5,
  dailyFreeCredits: 0,
  shareRewardCredits: 0,
  newsletterRewardCredits: 0,
  tipJarUrl: 'https://buy.stripe.com/bJe8wPbgZb9c8VR9i0fjG02',
  kofiUrl: '',
  stripeCreditPackUrl: 'https://buy.stripe.com/9B6eVdetb4KO5JF2TCfjG00',
  stripeVipPassUrl: 'https://buy.stripe.com/7sYfZhfxfgtw0pldygfjG01',
  cameoCommissionUrl: 'https://buy.stripe.com/aFaaEX0Clcdg0plgKsfjG03',
  newsletterActionUrl: '',
  amazonAssociateTag: 'cougarsandcub-20',
  partnerSubId: '',
  vipUnlockCodes: ['VELVETVIP', 'BLACKCARD', 'SHORTLEASH'],
  sandboxPreviewMode: false,
};
