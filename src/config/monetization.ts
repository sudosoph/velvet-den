export interface MonetizationConfig {
  dailyFreeCredits: 10;
  shareRewardCredits: 3;
  newsletterRewardCredits: 5;
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
 * Single source of truth for zero-backend monetization.
 * Paste live Ko-fi, Stripe Payment Links, Beehiiv/Substack action URL,
 * and Amazon Associates / Levanta / Impact IDs here whenever approved.
 * While `amazonAssociateTag` / `partnerSubId` are empty, outbound product cards
 * route cleanly to merchant pages with UTM attribution and zero broken params.
 */
export const MONETIZATION_CONFIG: MonetizationConfig = {
  dailyFreeCredits: 10,
  shareRewardCredits: 3,
  newsletterRewardCredits: 5,
  kofiUrl: 'https://ko-fi.com/sudosoph',
  stripeCreditPackUrl: '',
  stripeVipPassUrl: '',
  cameoCommissionUrl: 'https://ko-fi.com/sudosoph/commissions',
  newsletterActionUrl: '',
  amazonAssociateTag: '',
  partnerSubId: '',
  vipUnlockCodes: ['VELVETVIP', 'BLACKCARD', 'SHORTLEASH'],
  sandboxPreviewMode: true,
};
