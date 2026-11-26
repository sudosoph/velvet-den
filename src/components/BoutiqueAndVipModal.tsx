import React, { useEffect, useState } from 'react';
import {
  Coffee,
  Copy,
  Crown,
  ExternalLink,
  Gift,
  Mail,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { MONETIZATION_CONFIG } from '../config/monetization';
import {
  MAX_VERIFIED_REFERRAL_CLAIMS,
  VERIFIED_REFERRAL_REWARD_CREDITS,
  WAITLIST_REWARD_CREDITS,
  type WalletState,
} from '../domain/economy';
import {
  AFFILIATE_CATALOG,
  buildAffiliateUrl,
  type AffiliateCategory,
} from '../lib/affiliates';
import {
  getPostHogTracingHeaders,
  identifyPlayerWithContact,
  trackEvent,
} from '../lib/analytics';
import { shareOrCopy } from '../lib/viral';
import { fetchVerifiedReferralSlots } from '../services/adapters';
import { ProductVisualThumbnail } from './ProductVisualThumbnail';

export type BoutiqueSectionTab = 'shop' | 'vip' | 'rewards';

interface BoutiqueAndVipModalProps {
  open: boolean;
  wallet: WalletState;
  initialSection?: BoutiqueSectionTab;
  onClose: () => void;
  onRedeemCode: (code: string) => boolean;
  onRestoreVipSuccess?: () => void;
  onClaimQuestReward?: (rewardId: string, amount: number) => boolean;
  onSandboxGrantCredits: () => void;
  onSandboxUnlockVip: () => void;
  onClaimNewsletterBonus: (email: string) => boolean;
}

function rememberPendingStripeTier(tier: 'credits' | 'vip' | 'tip' | 'cameo') {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('velvet_pending_stripe_tier', tier);
    }
  } catch {
    // Ignore storage block
  }
}

export const BoutiqueAndVipModal: React.FC<BoutiqueAndVipModalProps> = ({
  open,
  wallet,
  initialSection = 'vip',
  onClose,
  onRedeemCode,
  onRestoreVipSuccess,
  onClaimQuestReward,
  onSandboxGrantCredits,
  onSandboxUnlockVip,
  onClaimNewsletterBonus,
}) => {
  const [activeTab, setActiveTab] = useState<BoutiqueSectionTab>(initialSection);
  const [promoCode, setPromoCode] = useState('');
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);
  const [restoreEmail, setRestoreEmail] = useState('');
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);
  const [tipStatusMsg, setTipStatusMsg] = useState<string | null>(null);
  const [questMsg, setQuestMsg] = useState<string | null>(null);
  const [verifyingRef, setVerifyingRef] = useState(false);
  const [cameoEmail, setCameoEmail] = useState('');
  const [cameoBrief, setCameoBrief] = useState('');
  const [cameoMsg, setCameoMsg] = useState<string | null>(null);
  const [waitlistRole, setWaitlistRole] = useState<'cougar' | 'cub'>('cougar');
  const [waitlistCity, setWaitlistCity] = useState('');
  const [waitlistVibe, setWaitlistVibe] = useState('');
  const [waitlistContact, setWaitlistContact] = useState('');
  const [waitlistMsg, setWaitlistMsg] = useState<string | null>(null);
  const [shopFilter, setShopFilter] = useState<'all' | AffiliateCategory>('all');

  useEffect(() => {
    if (open) {
      setActiveTab(initialSection);
      trackEvent('paywall_opened', {
        initial_section: initialSection,
        credits_balance: wallet.credits,
        is_vip: wallet.isVip,
      });
    }
  }, [open, initialSection, wallet.credits, wallet.isVip]);

  if (!open) return null;

  const isSandbox = MONETIZATION_CONFIG.sandboxPreviewMode;
  const liveTipUrl = MONETIZATION_CONFIG.tipJarUrl || MONETIZATION_CONFIG.kofiUrl;
  const liveCameoUrl = MONETIZATION_CONFIG.cameoCommissionUrl;

  const refCode = wallet.referralCode || 'vdclub1';
  const refUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?ref=${encodeURIComponent(refCode)}`;
  const refClaimedCount = [1, 2, 3].filter((n) =>
    wallet.claimedRewards.includes(`ref_verified_${n}`),
  ).length;

  const handleStripeCheckoutClick = (
    tier: 'credits_299' | 'vip_699' | 'tip_5' | 'cameo_29',
    storageTier: 'credits' | 'vip' | 'tip' | 'cameo',
  ) => {
    rememberPendingStripeTier(storageTier);
    trackEvent('stripe_checkout_clicked', {
      tier,
      credits_balance: wallet.credits,
    });
  };

  const handleVerifyReferrals = async () => {
    setVerifyingRef(true);
    try {
      const status = await fetchVerifiedReferralSlots(refCode);
      let newlyGranted = 0;
      for (
        let slot = 1;
        slot <= Math.min(MAX_VERIFIED_REFERRAL_CLAIMS, status.claimableSlots);
        slot++
      ) {
        const key = `ref_verified_${slot}`;
        if (!wallet.claimedRewards.includes(key) && onClaimQuestReward) {
          if (onClaimQuestReward(key, VERIFIED_REFERRAL_REWARD_CREDITS)) {
            newlyGranted += VERIFIED_REFERRAL_REWARD_CREDITS;
          }
        }
      }
      if (newlyGranted > 0) {
        setQuestMsg(
          `🔥 Verified ${status.uniqueReferrals} real friend click(s)! +${newlyGranted} Den Credits added!`,
        );
      } else if (refClaimedCount >= MAX_VERIFIED_REFERRAL_CLAIMS) {
        setQuestMsg(
          '🔒 Maximum 3/3 friend referral bonuses claimed, grab +15 Credits ($2.99) or Lifetime VIP ($6.99)!',
        );
      } else {
        setQuestMsg(
          `Verified clicks so far: ${status.uniqueReferrals}/3. Drop your referral link in a group chat and tap Verify!`,
        );
      }
    } finally {
      setVerifyingRef(false);
    }
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onRedeemCode(promoCode);
    setCodeMessage(
      ok
        ? '✨ Unlocked! VIP / Founder Unlimited access applied to your wallet.'
        : isSandbox
          ? 'Code not recognized (try VELVETVIP in preview mode).'
          : 'Code not recognized. Check your confirmation email and try again.',
    );
    if (ok) setPromoCode('');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    if (MONETIZATION_CONFIG.newsletterActionUrl) {
      window.open(MONETIZATION_CONFIG.newsletterActionUrl, '_blank', 'noopener,noreferrer');
    }
    identifyPlayerWithContact(email, { signup_source: 'club_dispatch' });
    trackEvent('newsletter_subscribed', { source: 'boutique_modal' });
    const granted = onClaimNewsletterBonus(email);
    setNewsletterMsg(
      granted
        ? `🎉 Welcome to The Cougar Dispatch! +${MONETIZATION_CONFIG.newsletterRewardCredits} Bonus Credits added.`
        : 'You’re on the list! (Newsletter bonus already claimed.)',
    );
    setEmail('');
  };

  const handleRestoreVip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreEmail.includes('@')) return;
    identifyPlayerWithContact(restoreEmail, { signup_source: 'vip_restore' });
    try {
      const res = await fetch('/api/restore-vip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getPostHogTracingHeaders(),
        },
        body: JSON.stringify({ email: restoreEmail }),
      });
      const json = (await res.json()) as { restored?: boolean };
      if (json.restored) {
        onRestoreVipSuccess?.();
        setRestoreMsg('✓ Paid VIP Black Card restored to this browser!');
      } else {
        setRestoreMsg('No completed VIP purchase found under that email yet.');
      }
    } catch {
      setRestoreMsg('Could not reach VIP restore service right now, try again in a moment.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1022]/60 p-3 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Cougars & Cubs Club VIP & Creator Lounge"
    >
      <div className="vice-panel relative max-h-[90vh] w-full max-w-4xl overflow-x-hidden overflow-y-auto rounded-3xl p-4 sm:p-7 space-y-5">
        <div className="flex items-start justify-between gap-3 border-b-2 border-[#1E1022]/12 pb-4">
          <div className="min-w-0">
            <span className="inline-block rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3 py-0.5 text-xs font-extrabold uppercase tracking-wide text-[#1E1022]">
              Visual Boutique • 5-Credit Economy • VIP Black Card
            </span>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl text-[#1E1022]">
              Cougars &amp; Cubs Club Boutique &amp; VIP
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#5A4664]">
              Balance:{' '}
              <strong className="text-[#D90452]">
                {wallet.isFounderUnlimited
                  ? '∞ Unlimited Founder Credits'
                  : `${wallet.credits} Credits (${MONETIZATION_CONFIG.dailyFreeCredits}/day starter)`}
              </strong>{' '}
              {(wallet.isVip || wallet.isFounderUnlimited) && (
                <strong className="text-[#065F46]">• VIP BLACK CARD ACTIVE</strong>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pop-btn shrink-0 rounded-xl bg-[#FFF4F7] p-2 text-[#1E1022] hover:bg-[#FF2E63] hover:text-white cursor-pointer"
            aria-label="Close Boutique"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 3 Clean Section Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(
            [
              ['shop', `🛍️ Visual Shop (${AFFILIATE_CATALOG.length})`],
              ['vip', '💎 Credits & VIP'],
              ['rewards', '🗝️ Waitlist & Referrals'],
            ] as const
          ).map(([tabId, label]) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setActiveTab(tabId)}
              className={`pop-btn rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-extrabold cursor-pointer ${
                activeTab === tabId
                  ? 'bg-[#FFBE0B] text-[#1E1022]'
                  : 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'vip' && (
          <div className="space-y-5">
            {/* Equal-Height Tier Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-stretch">
              <div className="rounded-2xl border-2 border-[#1E1022] bg-[#FFF7F0] p-4 flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wide text-[#D90452]">
                    Action Pack
                  </span>
                  <div className="font-display text-2xl text-[#1E1022] mt-1">
                    +15 Den Credits • $2.99
                  </div>
                  <p className="text-xs font-medium text-[#5A4664] mt-1.5 leading-relaxed">
                    Unlock 2nd+ Off-App iMessage numbers (2 Cr), Chat Unmatch Rewinds (2 Cr), Early Flirt Boosts, and VIP episodes.
                  </p>
                </div>
                {MONETIZATION_CONFIG.stripeCreditPackUrl ? (
                  <a
                    href={MONETIZATION_CONFIG.stripeCreditPackUrl}
                    onClick={() => handleStripeCheckoutClick('credits_299', 'credits')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pop-btn mt-4 block rounded-xl bg-[#FF2E63] py-2.5 text-center text-sm font-extrabold text-white"
                  >
                    Get +15 Credits ($2.99)
                  </a>
                ) : isSandbox ? (
                  <button
                    type="button"
                    onClick={onSandboxGrantCredits}
                    className="pop-btn mt-4 w-full rounded-xl bg-[#FF2E63] py-2.5 text-sm font-extrabold text-white cursor-pointer"
                  >
                    <Sparkles className="inline h-3.5 w-3.5 mr-1" />
                    Preview Unlock +15 Credits (Free Demo)
                  </button>
                ) : (
                  <div className="mt-4 rounded-xl border-2 border-[#1E1022]/20 bg-white py-2.5 text-center text-xs font-extrabold text-[#5A4664]">
                    Checkout Opening Soon
                  </div>
                )}
              </div>

              <div className="rounded-2xl border-[2.5px] border-[#1E1022] bg-[#FFFBEB] p-4 flex flex-col justify-between shadow-[4px_4px_0px_#1E1022] h-full">
                <div>
                  <span className="rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-xs font-extrabold uppercase text-[#1E1022]">
                    Most Popular
                  </span>
                  <div className="font-display text-2xl text-[#1E1022] mt-1.5">
                    VIP Black Card • $6.99
                  </div>
                  <p className="text-xs font-medium text-[#34223B] mt-1.5 leading-relaxed">
                    Unlimited Off-App iMessage Unlocks, Unlimited Rewinds &amp; Flirt Mode, ALL Deep-Cut VIP episodes forever + 15 bonus credits.
                  </p>
                </div>
                {wallet.isVip ? (
                  <div className="mt-4 rounded-xl border-2 border-[#1E1022] bg-[#D1FAE5] py-2.5 text-center text-xs font-extrabold text-[#065F46]">
                    ✓ VIP Black Card Unlocked
                  </div>
                ) : MONETIZATION_CONFIG.stripeVipPassUrl ? (
                  <a
                    href={MONETIZATION_CONFIG.stripeVipPassUrl}
                    onClick={() => handleStripeCheckoutClick('vip_699', 'vip')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pop-btn mt-4 block rounded-xl bg-[#FFBE0B] py-2.5 text-center text-sm font-extrabold text-[#1E1022]"
                  >
                    <Crown className="inline h-3.5 w-3.5 mr-1" />
                    Unlock VIP Black Card ($6.99)
                  </a>
                ) : isSandbox ? (
                  <button
                    type="button"
                    onClick={onSandboxUnlockVip}
                    className="pop-btn mt-4 w-full rounded-xl bg-[#FFBE0B] py-2.5 text-sm font-extrabold text-[#1E1022] cursor-pointer"
                  >
                    <Crown className="inline h-3.5 w-3.5 mr-1" />
                    Preview VIP Black Card (Free Demo)
                  </button>
                ) : (
                  <div className="mt-4 rounded-xl border-2 border-[#1E1022]/20 bg-white py-2.5 text-center text-xs font-extrabold text-[#5A4664]">
                    VIP Checkout Opening Soon
                  </div>
                )}
              </div>

              <div className="rounded-2xl border-2 border-[#1E1022] bg-[#FFF4F7] p-4 flex flex-col justify-between gap-3 h-full">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wide text-[#D90452]">
                    Espresso Martini Tip &amp; Cameos
                  </span>
                  <div className="font-display text-2xl text-[#1E1022] mt-1">
                    Immortalize Your Inside Joke
                  </div>
                  <p className="text-xs font-medium text-[#5A4664] mt-1.5 leading-relaxed">
                    Buy the creator an Espresso Martini ($5), or sponsor a custom $29 Cougar/Cub character cameo!
                  </p>
                </div>
                <div className="space-y-2">
                  {liveTipUrl ? (
                    <a
                      href={liveTipUrl}
                      onClick={() => handleStripeCheckoutClick('tip_5', 'tip')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pop-btn flex items-center justify-center gap-1.5 rounded-xl bg-[#FF2E63] py-2 text-xs font-extrabold text-white"
                    >
                      <Coffee className="h-3.5 w-3.5" />
                      <span>Tip an Espresso Martini ($5)</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setTipStatusMsg(
                          '🍸 Tip Jar activating shortly, grab +3 Free Dispatch Credits below in the meantime!',
                        )
                      }
                      className="pop-btn w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#FF2E63] py-2 text-xs font-extrabold text-white cursor-pointer"
                    >
                      <Coffee className="h-3.5 w-3.5" />
                      <span>Tip an Espresso Martini ($5)</span>
                    </button>
                  )}

                  {liveCameoUrl ? (
                    <a
                      href={liveCameoUrl}
                      onClick={() => handleStripeCheckoutClick('cameo_29', 'cameo')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pop-btn flex items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-xs font-extrabold text-[#1E1022]"
                    >
                      <Gift className="h-3.5 w-3.5 text-[#FF2E63]" />
                      <span>Sponsor Custom Scenario ($29)</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setTipStatusMsg(
                          '🎬 Custom $29 Cameo checkout opens right after Stripe verification!',
                        )
                      }
                      className="pop-btn w-full flex items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                    >
                      <Gift className="h-3.5 w-3.5 text-[#FF2E63]" />
                      <span>Sponsor Custom Scenario ($29)</span>
                    </button>
                  )}
                  {tipStatusMsg && <p className="text-xs font-bold text-[#D90452]">{tipStatusMsg}</p>}
                </div>
              </div>
            </div>

            {/* Overflow-Proof Promo Code + Newsletter (+3 Cr) + Cross-Browser VIP Restore */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-stretch">
              <form
                onSubmit={handlePromoSubmit}
                className="rounded-2xl border-2 border-[#1E1022] bg-[#FFF7F0] p-4 space-y-2.5"
              >
                <div className="text-xs font-extrabold uppercase text-[#1E1022]">
                  Have a Stripe VIP or Creator Code?
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder={isSandbox ? 'Enter code (e.g. VELVETVIP)' : 'Enter VIP or promo code'}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="min-w-0 w-full flex-1 rounded-xl border-2 border-[#1E1022] bg-white px-3 py-2 text-xs font-bold text-[#1E1022]"
                  />
                  <button
                    type="submit"
                    className="pop-btn shrink-0 rounded-xl bg-white px-3.5 py-2 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                  >
                    Redeem
                  </button>
                </div>
                {codeMessage && <p className="text-xs font-bold text-[#D90452]">{codeMessage}</p>}
              </form>

              <form
                onSubmit={handleNewsletterSubmit}
                className="rounded-2xl border-2 border-[#1E1022] bg-[#FFFBEB] p-4 space-y-2.5"
              >
                <div className="text-xs font-extrabold uppercase text-[#1E1022]">
                  <Mail className="inline h-3.5 w-3.5 mr-1 text-[#FF2E63]" />
                  The Cougar Dispatch (+{MONETIZATION_CONFIG.newsletterRewardCredits} Free Credits)
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 w-full flex-1 rounded-xl border-2 border-[#1E1022] bg-white px-3 py-2 text-xs font-bold text-[#1E1022]"
                  />
                  <button
                    type="submit"
                    className="pop-btn shrink-0 rounded-xl bg-[#FFBE0B] px-3.5 py-2 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                  >
                    +{MONETIZATION_CONFIG.newsletterRewardCredits} Cr
                  </button>
                </div>
                {newsletterMsg && <p className="text-xs font-extrabold text-[#065F46]">{newsletterMsg}</p>}
              </form>

              <form
                onSubmit={handleRestoreVip}
                className="rounded-2xl border-2 border-[#1E1022] bg-[#FFF4F7] p-4 space-y-2.5"
              >
                <div className="text-xs font-extrabold uppercase text-[#D90452]">
                  <ShieldCheck className="inline h-3.5 w-3.5 mr-1" />
                  Restore Paid VIP on New Device
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Checkout email"
                    value={restoreEmail}
                    onChange={(e) => setRestoreEmail(e.target.value)}
                    className="min-w-0 w-full flex-1 rounded-xl border-2 border-[#1E1022] bg-white px-3 py-2 text-xs font-bold text-[#1E1022]"
                  />
                  <button
                    type="submit"
                    className="pop-btn shrink-0 rounded-xl bg-[#FF2E63] px-3.5 py-2 text-xs font-extrabold text-white cursor-pointer"
                  >
                    Restore
                  </button>
                </div>
                {restoreMsg && <p className="text-xs font-bold text-[#D90452]">{restoreMsg}</p>}
              </form>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-[#1E1022] bg-white p-3.5">
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-[#1E1022]">
                  🛍️ Looking for Date-Night Gifts, Silk Robes &amp; Official Brass Clickers?
                </div>
                <p className="text-[11px] font-medium text-[#5A4664]">
                  Browse all {AFFILIATE_CATALOG.length} illustrated Cougar &amp; Cub picks in the Visual Shop tab.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('shop')}
                className="pop-btn shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#FFBE0B] px-3.5 py-2 text-xs font-extrabold text-[#1E1022] cursor-pointer"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Open Shop</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-5">
            {/* Verified Friend Referral Ladder (+3 Cr per real friend, max 3) */}
            <div className="rounded-2xl border-2 border-[#1E1022] bg-[#FFF4F7] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-xs font-extrabold uppercase text-[#1E1022]">
                    <Users className="h-3 w-3" /> Verified Friend Referrals
                  </span>
                  <h3 className="mt-1 font-display text-xl text-[#1E1022]">
                    Earn +{VERIFIED_REFERRAL_REWARD_CREDITS} Credits Per Friend Who Opens Your Link (Max {MAX_VERIFIED_REFERRAL_CLAIMS})
                  </h3>
                </div>
                <span className="rounded-full border-2 border-[#1E1022] bg-white px-3 py-1 text-xs font-extrabold text-[#1E1022]">
                  {refClaimedCount} / {MAX_VERIFIED_REFERRAL_CLAIMS} Verified Friend Bonuses
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 rounded-xl border-2 border-[#1E1022] bg-white p-3 text-xs">
                <div className="min-w-0 truncate font-semibold text-[#1E1022]">
                  <strong>Your Referral Link:</strong>{' '}
                  <code className="text-[#D90452] font-bold">{refUrl}</code>
                </div>
                <div className="flex flex-wrap shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      trackEvent('share_triggered', {
                        channel: 'copy_link',
                        share_surface: 'audition',
                        url: refUrl,
                      });
                      await shareOrCopy({
                        title: 'Cougars & Cubs Club',
                        text: 'Pass my 60-second Cougars & Cubs Vetting Test 🍸',
                        url: refUrl,
                      });
                      setQuestMsg(
                        `🔗 Referral link copied! Each real friend who opens it unlocks +${VERIFIED_REFERRAL_REWARD_CREDITS} Cr (up to 3 friends).`,
                      );
                    }}
                    className="pop-btn inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 font-extrabold text-[#1E1022] cursor-pointer"
                  >
                    <Copy className="h-3 w-3" /> Copy Link
                  </button>
                  <button
                    type="button"
                    disabled={verifyingRef || refClaimedCount >= MAX_VERIFIED_REFERRAL_CLAIMS}
                    onClick={handleVerifyReferrals}
                    className="pop-btn inline-flex items-center gap-1 rounded-lg bg-[#FFBE0B] px-3 py-1.5 font-extrabold text-[#1E1022] disabled:opacity-60 cursor-pointer"
                  >
                    <RefreshCw className={`h-3 w-3 ${verifyingRef ? 'animate-spin' : ''}`} />
                    <span>
                      {refClaimedCount >= MAX_VERIFIED_REFERRAL_CLAIMS
                        ? '✓ 3/3 Referrals Maxed'
                        : `Verify Clicks (${refClaimedCount}/3)`}
                    </span>
                  </button>
                </div>
              </div>
              {questMsg && <p className="text-xs font-extrabold text-[#D90452]">{questMsg}</p>}
            </div>

            {/* Raya-Style Velvet-Rope Club Waitlist (+2 Cr), Overflow-Proof Responsive Grid */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!waitlistContact.trim() || waitlistContact.trim().length < 4) return;
                identifyPlayerWithContact(waitlistContact.trim(), {
                  role: waitlistRole,
                  city: waitlistCity.trim(),
                  signup_source: 'raya_waitlist',
                });
                trackEvent('waitlist_submitted', {
                  role: waitlistRole,
                  city: waitlistCity.trim() || 'Virtual Lounge',
                });
                try {
                  const res = await fetch('/api/waitlist', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      ...getPostHogTracingHeaders(),
                    },
                    body: JSON.stringify({
                      role: waitlistRole,
                      city: waitlistCity.trim(),
                      vibe: waitlistVibe.trim(),
                      contact: waitlistContact.trim(),
                    }),
                  });
                  const data = (await res.json()) as { ok?: boolean; position?: number };
                  if (res.ok && data.ok) {
                    onClaimQuestReward?.('raya_waitlist_join', WAITLIST_REWARD_CREDITS);
                    setWaitlistMsg(
                      `🗝️ Velvet-Rope Application #${data.position ?? 142} received (+${WAITLIST_REWARD_CREDITS} Bonus Credits)! You’re on the list for our invite-only Virtual Trivia Salon.`,
                    );
                    setWaitlistVibe('');
                    setWaitlistContact('');
                  } else {
                    setWaitlistMsg('Please include a valid email or @handle so we can send your invite.');
                  }
                } catch {
                  onClaimQuestReward?.('raya_waitlist_join', WAITLIST_REWARD_CREDITS);
                  setWaitlistMsg(
                    `🗝️ Velvet-Rope Waitlist spot reserved (+${WAITLIST_REWARD_CREDITS} Bonus Credits)!`,
                  );
                }
              }}
              className="rounded-2xl border-2 border-[#1E1022] bg-gradient-to-r from-[#18101E] via-[#261633] to-[#18101E] p-4 sm:p-5 text-white space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#FBBF24]">
                  🗝️ Velvet-Rope Private Club Waitlist (+{WAITLIST_REWARD_CREDITS} Free Credits)
                </div>
                <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[11px] font-bold text-[#FDE68A]">
                  Invite-Only Virtual Salons
                </span>
              </div>
              <p className="text-xs text-white/85 leading-relaxed">
                Apply for our vetted member cohort, starting with low-pressure <strong>Virtual Trivia &amp; Speed-Vetting Salons</strong>.
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                <select
                  aria-label="Waitlist Role"
                  value={waitlistRole}
                  onChange={(e) => setWaitlistRole(e.target.value === 'cub' ? 'cub' : 'cougar')}
                  className="min-w-0 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white"
                >
                  <option value="cougar" className="text-[#18101E]">
                    🐆 Puma / Cougar / Jaguar
                  </option>
                  <option value="cub" className="text-[#18101E]">
                    🐕 Vetted Cub (21, 35)
                  </option>
                </select>
                <input
                  type="text"
                  maxLength={48}
                  placeholder="City / Timezone"
                  value={waitlistCity}
                  onChange={(e) => setWaitlistCity(e.target.value)}
                  className="min-w-0 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white placeholder:text-white/55"
                />
                <input
                  type="text"
                  maxLength={140}
                  placeholder="Your vibe (e.g. British Cub, Glam-ma...)"
                  value={waitlistVibe}
                  onChange={(e) => setWaitlistVibe(e.target.value)}
                  className="min-w-0 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white placeholder:text-white/55"
                />
                <input
                  type="text"
                  required
                  maxLength={120}
                  placeholder="Email or @IG / @X handle"
                  value={waitlistContact}
                  onChange={(e) => setWaitlistContact(e.target.value)}
                  className="min-w-0 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white placeholder:text-white/55"
                />
              </div>
              <button
                type="submit"
                className="pop-btn w-full sm:w-auto rounded-xl bg-[#FBBF24] px-5 py-2.5 text-xs font-extrabold text-[#18101E] cursor-pointer"
              >
                Apply to Velvet-Rope Waitlist (+{WAITLIST_REWARD_CREDITS} Cr)
              </button>
              {waitlistMsg && <p className="text-xs font-extrabold text-[#6EE7B7]">{waitlistMsg}</p>}
            </form>

            {/* $29 Custom Scenario / Archetype Cameo Brief Submission */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!cameoEmail.includes('@') || cameoBrief.trim().length < 10) return;
                identifyPlayerWithContact(cameoEmail, { signup_source: 'cameo_brief' });
                try {
                  const res = await fetch('/api/cameo-brief', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      ...getPostHogTracingHeaders(),
                    },
                    body: JSON.stringify({ email: cameoEmail, brief: cameoBrief }),
                  });
                  if (res.ok) {
                    setCameoMsg(
                      '🎬 Custom Scenario Brief saved! Matched to your $29 Stripe checkout email.',
                    );
                    setCameoBrief('');
                  } else {
                    setCameoMsg('Please check your message length and retry.');
                  }
                } catch {
                  setCameoMsg('🎬 Brief queued locally, thank you for sponsoring the next Club drop!');
                }
              }}
              className="rounded-2xl border-2 border-[#1E1022] bg-white p-4 space-y-2.5"
            >
              <div className="text-xs font-extrabold uppercase text-[#1E1022]">
                <Gift className="inline h-3.5 w-3.5 mr-1 text-[#FF2E63]" />
                Sponsored a $29 Custom Cougar / Cub Scenario? Submit Your Brief:
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[220px_1fr_auto]">
                <input
                  type="email"
                  required
                  placeholder="Your Stripe checkout email"
                  value={cameoEmail}
                  onChange={(e) => setCameoEmail(e.target.value)}
                  className="min-w-0 w-full rounded-xl border-2 border-[#1E1022] bg-[#FFF7F0] px-3 py-2 text-xs font-bold text-[#1E1022]"
                />
                <input
                  type="text"
                  required
                  minLength={10}
                  maxLength={400}
                  placeholder="Describe your custom character or couple inside joke..."
                  value={cameoBrief}
                  onChange={(e) => setCameoBrief(e.target.value)}
                  className="min-w-0 w-full rounded-xl border-2 border-[#1E1022] bg-[#FFF7F0] px-3 py-2 text-xs font-bold text-[#1E1022]"
                />
                <button
                  type="submit"
                  className="pop-btn rounded-xl bg-[#FFBE0B] px-4 py-2 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                >
                  Send Brief
                </button>
              </div>
              {cameoMsg && <p className="text-xs font-extrabold text-[#065F46]">{cameoMsg}</p>}
            </form>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl text-[#1E1022]">
                🛍️ Curated Cougar &amp; Cub Visual Shop ({AFFILIATE_CATALOG.length} Picks)
              </h3>
              <span className="text-xs font-semibold text-[#5A4664]">
                FTC Disclosure: Protected partner links may earn a small commission at zero extra cost.
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['all', `✨ All (${AFFILIATE_CATALOG.length})`],
                  ['cougar_cub_merch', '🐆 Cougar & Cub Merch'],
                  ['funny_cute', '🐶 Cute & Funny'],
                  ['cinema_pop_culture', '🎬 Movies & Books'],
                  ['houseboy', '🥂 Houseboy & Pantry'],
                  ['princess_luxury', '👑 Soft-Life Luxury'],
                  ['hosting_upgrade', '🛏️ Hosting & Travel'],
                  ['date_night', '🍸 Date Night'],
                  ['trail_wellness', '🏔️ Trail & Gym'],
                ] as const
              ).map(([cat, label]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setShopFilter(cat)}
                  className={`pop-btn h-9 rounded-xl px-3 text-xs cursor-pointer ${
                    shopFilter === cat
                      ? 'bg-[#FFBE0B] text-[#1E1022]'
                      : 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-stretch">
              {AFFILIATE_CATALOG.filter(
                (item) => shopFilter === 'all' || item.category === shopFilter,
              ).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border-2 border-[#1E1022] bg-white p-4 shadow-[3px_3px_0px_#1E1022] flex flex-col justify-between gap-3 h-full"
                >
                  <div className="space-y-2.5">
                    <ProductVisualThumbnail item={item} />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-[#1E1022]">
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-[#1E1022]">{item.name}</h4>
                    <p className="text-xs font-medium text-[#5A4664] leading-relaxed">
                      {item.cheekyPitch}
                    </p>
                  </div>

                  <a
                    href={buildAffiliateUrl(item, 'boutique_modal')}
                    onClick={() =>
                      trackEvent('affiliate_clicked', {
                        product_id: item.id,
                        product_name: item.name,
                        category: item.category,
                        placement: 'boutique_modal',
                      })
                    }
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="pop-btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FF2E63] py-2.5 text-xs font-extrabold text-white"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Shop Protected Partner Link</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
