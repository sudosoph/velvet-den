import React, { useState } from 'react';
import {
  Check,
  Coffee,
  Copy,
  Crown,
  ExternalLink,
  Gift,
  Mail,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { MONETIZATION_CONFIG } from '../config/monetization';
import {
  MAX_VERIFIED_REFERRAL_CLAIMS,
  SOCIAL_SHARE_QUEST_IDS,
  type WalletState,
} from '../domain/economy';
import { AFFILIATE_CATALOG, buildAffiliateUrl } from '../lib/affiliates';
import { shareOrCopy } from '../lib/viral';
import { fetchVerifiedReferralSlots } from '../services/adapters';

interface BoutiqueAndVipModalProps {
  open: boolean;
  wallet: WalletState;
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
  onClose,
  onRedeemCode,
  onRestoreVipSuccess,
  onClaimQuestReward,
  onSandboxGrantCredits,
  onSandboxUnlockVip,
  onClaimNewsletterBonus,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);
  const [restoreEmail, setRestoreEmail] = useState('');
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);
  const [tipStatusMsg, setTipStatusMsg] = useState<string | null>(null);
  const [questMsg, setQuestMsg] = useState<string | null>(null);
  const [verifyingRef, setVerifyingRef] = useState(false);

  if (!open) return null;

  const isSandbox = MONETIZATION_CONFIG.sandboxPreviewMode;
  const liveTipUrl = MONETIZATION_CONFIG.tipJarUrl || MONETIZATION_CONFIG.kofiUrl;
  const liveCameoUrl = MONETIZATION_CONFIG.cameoCommissionUrl;

  const refCode = wallet.referralCode || 'vdclub1';
  const refUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?ref=${encodeURIComponent(refCode)}`;
  const socialClaimedCount = SOCIAL_SHARE_QUEST_IDS.filter((id) =>
    wallet.claimedRewards.includes(id),
  ).length;
  const refClaimedCount = [1, 2, 3].filter((n) =>
    wallet.claimedRewards.includes(`ref_verified_${n}`),
  ).length;
  const totalFreeQuestCreditsEarned = socialClaimedCount * 2 + refClaimedCount * 5;
  const maxFreeQuestCredits = SOCIAL_SHARE_QUEST_IDS.length * 2 + MAX_VERIFIED_REFERRAL_CLAIMS * 5;
  const allFreeQuestsMaxed = totalFreeQuestCreditsEarned >= maxFreeQuestCredits;

  const handleSocialQuest = async (
    questId: (typeof SOCIAL_SHARE_QUEST_IDS)[number],
    mode: 'groupchat' | 'x' | 'community',
  ) => {
    if (wallet.claimedRewards.includes(questId)) {
      setQuestMsg('Already claimed that channel—verify a friend referral or top up above!');
      return;
    }
    const dilemmaUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?dilemma=grown-son-same-age-collision&ref=${encodeURIComponent(refCode)}`;
    if (mode === 'x' && typeof window !== 'undefined') {
      const tweetText = encodeURIComponent(
        `Just got called "born in the late 1900s" in Cougars & Cubs Club and survived the Tito’s mirror-selfie test 💀 Bet you can’t beat 88%: ${refUrl}`,
      );
      window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'noopener,noreferrer');
    } else if (mode === 'groupchat') {
      await shareOrCopy({
        title: 'Group-Chat Debate — Cougars & Cubs Club',
        text: `Wait how would y’all handle finding out your date’s grown son graduated the exact same year as you 💀 Pass the test:`,
        url: dilemmaUrl,
      });
    } else {
      await shareOrCopy({
        title: 'Cougars & Cubs Club Vetting Challenge',
        text: `🐆 65 real Cougar & Cub scenarios (from 18h hotel-sauna getaways & campus PhD sushi to 3 AM Roblox shock)—see your rank:`,
        url: refUrl,
      });
    }
    const granted = onClaimQuestReward ? onClaimQuestReward(questId, 2) : false;
    setQuestMsg(
      granted
        ? '🎉 +2 Bonus Credits unlocked! When real friends click your link, tap "Verify Friend Clicks" for +5 Cr each!'
        : 'Link copied! Share it with friends to unlock +5 Cr referral bonuses.',
    );
  };

  const handleVerifyReferrals = async () => {
    setVerifyingRef(true);
    try {
      const status = await fetchVerifiedReferralSlots(refCode);
      let newlyGranted = 0;
      for (let slot = 1; slot <= Math.min(MAX_VERIFIED_REFERRAL_CLAIMS, status.claimableSlots); slot++) {
        const key = `ref_verified_${slot}`;
        if (!wallet.claimedRewards.includes(key) && onClaimQuestReward) {
          if (onClaimQuestReward(key, 5)) {
            newlyGranted += 5;
          }
        }
      }
      if (newlyGranted > 0) {
        setQuestMsg(`🔥 Verified ${status.uniqueReferrals} real friend click(s)! +${newlyGranted} Den Credits added!`);
      } else if (refClaimedCount >= MAX_VERIFIED_REFERRAL_CLAIMS) {
        setQuestMsg('🔒 Maximum 3/3 friend referral bonuses claimed—grab +15 Credits ($2.99) or Lifetime VIP ($6.99) above!');
      } else {
        setQuestMsg(
          `Verified clicks so far: ${status.uniqueReferrals}/3. Drop your referral link in a group chat or Hinge bio and check again!`,
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
    const granted = onClaimNewsletterBonus(email);
    setNewsletterMsg(
      granted
        ? '🎉 Welcome to The Cougar Dispatch! +5 Bonus Credits added.'
        : 'You’re on the list! (Newsletter bonus already claimed.)',
    );
    setEmail('');
  };

  const handleRestoreVip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreEmail.includes('@')) return;
    try {
      const res = await fetch('/api/restore-vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setRestoreMsg('Could not reach VIP restore service right now—try again in a moment.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1022]/60 p-3 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Cougars & Cubs Club VIP & Creator Lounge"
    >
      <div className="vice-panel relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl p-5 sm:p-7 space-y-6">
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#1E1022]/12 pb-4">
          <div>
            <span className="inline-block rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3 py-0.5 text-xs font-extrabold uppercase tracking-wide text-[#1E1022]">
              Club Credits • VIP Black Card • Date-Night Boutique
            </span>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl text-[#1E1022]">
              Cougars &amp; Cubs Club VIP Lounge
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#5A4664]">
              Balance:{' '}
              <strong className="text-[#D90452]">
                {wallet.isFounderUnlimited ? '∞ Unlimited Founder Credits' : `${wallet.credits} Credits`}
              </strong>{' '}
              {(wallet.isVip || wallet.isFounderUnlimited) && (
                <strong className="text-[#065F46]">• VIP BLACK CARD ACTIVE</strong>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pop-btn rounded-xl bg-[#FFF4F7] p-2 text-[#1E1022] hover:bg-[#FF2E63] hover:text-white cursor-pointer"
            aria-label="Close Boutique"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Equal-Height Tier Cards */}
        <div className="grid gap-4 md:grid-cols-3 items-stretch">
          <div className="rounded-2xl border-2 border-[#1E1022] bg-[#FFF7F0] p-4 flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wide text-[#D90452]">Action Pack</span>
              <div className="font-display text-2xl text-[#1E1022] mt-1">+15 Den Credits • $2.99</div>
              <p className="text-xs font-medium text-[#5A4664] mt-1.5 leading-relaxed">
                Smooth Rewinds on red-flag fumbles, Live AI Inbox replies, X-Ray Scans, and Deep-Cut episode unlocks.
              </p>
            </div>
            {MONETIZATION_CONFIG.stripeCreditPackUrl ? (
              <a
                href={MONETIZATION_CONFIG.stripeCreditPackUrl}
                onClick={() => rememberPendingStripeTier('credits')}
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
                Unlocks Unlimited Custom Cougar/Cub Fantasy Builds + ALL 4 Deep-Cut VIP episodes forever + Unlimited Live AI Texting + 15 bonus credits.
              </p>
            </div>
            {wallet.isVip ? (
              <div className="mt-4 rounded-xl border-2 border-[#1E1022] bg-[#D1FAE5] py-2.5 text-center text-xs font-extrabold text-[#065F46]">
                ✓ VIP Black Card Unlocked
              </div>
            ) : MONETIZATION_CONFIG.stripeVipPassUrl ? (
              <a
                href={MONETIZATION_CONFIG.stripeVipPassUrl}
                onClick={() => rememberPendingStripeTier('vip')}
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
                Buy the creator an Espresso Martini—or sponsor a custom $29 Cougar/Cub dating profile or dilemma in the next drop!
              </p>
            </div>
            <div className="space-y-2">
              {liveTipUrl ? (
                <a
                  href={liveTipUrl}
                  onClick={() => rememberPendingStripeTier('tip')}
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
                      '🍸 Dedicated Cougars & Cubs Club Stripe Tip Jar activating shortly—grab +5 Free Dispatch Credits below in the meantime!',
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
                  onClick={() => rememberPendingStripeTier('cameo')}
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
                      '🎬 Custom $29 Cougar/Cub Cameo checkout opens right after Stripe verification—join The Cougar Dispatch below for priority slots!',
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

        {/* Share & Referral Ladder */}
        {onClaimQuestReward && (
          <div className="rounded-2xl border-2 border-[#1E1022] bg-[#FFF4F7] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-xs font-extrabold uppercase text-[#1E1022]">
                  <Users className="h-3 w-3" /> Share &amp; Refer Before Paywall Cap
                </span>
                <h3 className="mt-1 font-display text-xl text-[#1E1022]">
                  Earn Up to +{maxFreeQuestCredits} Free Credits Sharing Across Socials &amp; Group Chats
                </h3>
              </div>
              <span className="rounded-full border-2 border-[#1E1022] bg-white px-3 py-1 text-xs font-extrabold text-[#1E1022]">
                {allFreeQuestsMaxed
                  ? '🔒 Max Free Cap Reached (Paid Refills Only)'
                  : `${totalFreeQuestCreditsEarned} / ${maxFreeQuestCredits} Free Quest Credits Claimed`}
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
              {[
                {
                  id: 'quest_groupchat_roast' as const,
                  mode: 'groupchat' as const,
                  label: '💬 Text Group-Chat Dilemma (+2 Cr)',
                },
                {
                  id: 'quest_x_threads_post' as const,
                  mode: 'x' as const,
                  label: '🐦 Post "1900s" Roast on X (+2 Cr)',
                },
                {
                  id: 'quest_reddit_discord_drop' as const,
                  mode: 'community' as const,
                  label: '🔥 Share to Discord / Reddit (+2 Cr)',
                },
              ].map((q) => {
                const done = wallet.claimedRewards.includes(q.id);
                return (
                  <button
                    key={q.id}
                    type="button"
                    disabled={done}
                    onClick={() => handleSocialQuest(q.id, q.mode)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#1E1022] px-3 py-2.5 text-xs font-extrabold transition ${
                      done
                        ? 'bg-[#D1FAE5] text-[#065F46] cursor-default'
                        : 'pop-btn bg-[#FF2E63] text-white cursor-pointer'
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                    <span>{done ? '✓ Claimed (+2 Cr)' : q.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 rounded-xl border-2 border-[#1E1022] bg-white p-2.5 text-xs">
              <div className="truncate font-semibold text-[#1E1022]">
                <strong>Verified Friend Link (+5 Cr/click, max 3):</strong>{' '}
                <code className="text-[#D90452] font-bold">{refUrl}</code>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await shareOrCopy({
                      title: 'Cougars & Cubs Club',
                      text: 'Pass my 60-second Cougars & Cubs Vetting Test 🍸',
                      url: refUrl,
                    });
                    setQuestMsg('🔗 Personal referral link copied! Each real friend who opens it unlocks +5 Cr (up to 3 friends).');
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
        )}

        {/* Promo Code + Newsletter Lead Magnet + Cross-Browser VIP Restore */}
        <div className="grid gap-4 md:grid-cols-3 items-stretch">
          <form
            onSubmit={handlePromoSubmit}
            className="rounded-2xl border-2 border-[#1E1022] bg-[#FFF7F0] p-4 space-y-2"
          >
            <div className="text-xs font-extrabold uppercase text-[#1E1022]">
              Have a Stripe VIP or Creator Code?
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={isSandbox ? 'Enter code (e.g. VELVETVIP)' : 'Enter VIP or promo code'}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 rounded-xl border-2 border-[#1E1022] bg-white px-3 py-2 text-xs font-bold text-[#1E1022]"
              />
              <button
                type="submit"
                className="pop-btn rounded-xl bg-white px-3.5 py-2 text-xs font-extrabold text-[#1E1022] cursor-pointer"
              >
                Redeem
              </button>
            </div>
            {codeMessage && <p className="text-xs font-bold text-[#D90452]">{codeMessage}</p>}
          </form>

          <form
            onSubmit={handleNewsletterSubmit}
            className="rounded-2xl border-2 border-[#1E1022] bg-[#FFFBEB] p-4 space-y-2"
          >
            <div className="text-xs font-extrabold uppercase text-[#1E1022]">
              <Mail className="inline h-3.5 w-3.5 mr-1 text-[#FF2E63]" />
              The Cougar Dispatch (+5 Free Credits)
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-xl border-2 border-[#1E1022] bg-white px-3 py-2 text-xs font-bold text-[#1E1022]"
              />
              <button
                type="submit"
                className="pop-btn rounded-xl bg-[#FFBE0B] px-3.5 py-2 text-xs font-extrabold text-[#1E1022] cursor-pointer"
              >
                +5 Cr
              </button>
            </div>
            {newsletterMsg && <p className="text-xs font-extrabold text-[#065F46]">{newsletterMsg}</p>}
          </form>

          <form
            onSubmit={handleRestoreVip}
            className="rounded-2xl border-2 border-[#1E1022] bg-[#FFF4F7] p-4 space-y-2"
          >
            <div className="text-xs font-extrabold uppercase text-[#D90452]">
              <ShieldCheck className="inline h-3.5 w-3.5 mr-1" />
              Restore Paid VIP on New Device
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Checkout email"
                value={restoreEmail}
                onChange={(e) => setRestoreEmail(e.target.value)}
                className="flex-1 rounded-xl border-2 border-[#1E1022] bg-white px-3 py-2 text-xs font-bold text-[#1E1022]"
              />
              <button
                type="submit"
                className="pop-btn rounded-xl bg-[#FF2E63] px-3 py-2 text-xs font-extrabold text-white cursor-pointer"
              >
                Restore
              </button>
            </div>
            {restoreMsg && <p className="text-xs font-bold text-[#D90452]">{restoreMsg}</p>}
          </form>
        </div>

        {/* Curated Lifestyle & Date-Night Affiliate Boutique */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-2xl text-[#1E1022]">
              🛍️ Curated Cougar &amp; Cub Lifestyle Essentials
            </h3>
            <span className="text-xs font-semibold text-[#5A4664]">
              FTC Disclosure: Protected partner links may earn a small commission at zero extra cost to you.
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 items-stretch">
            {AFFILIATE_CATALOG.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border-2 border-[#1E1022] bg-white p-4 shadow-[3px_3px_0px_#1E1022] flex flex-col justify-between gap-3 h-full"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-xs font-extrabold uppercase text-[#1E1022]">
                      {item.badge}
                    </span>
                    <span className="text-sm font-extrabold text-[#D90452]">
                      {item.priceDisplay}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-extrabold text-[#1E1022]">{item.name}</h4>
                  <p className="mt-1 text-xs font-medium text-[#5A4664] leading-relaxed">{item.cheekyPitch}</p>
                </div>

                <a
                  href={buildAffiliateUrl(item, 'boutique_modal')}
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
      </div>
    </div>
  );
};
