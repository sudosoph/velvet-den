import React, { useEffect, useState } from 'react';
import {
  Copy,
  Crown,
  ExternalLink,
  Gift,
  Heart,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { MONETIZATION_CONFIG } from '../config/monetization';
import type { WalletState } from '../domain/economy';
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
import { ProductVisualThumbnail } from './ProductVisualThumbnail';

export type BoutiqueSectionTab = 'shop' | 'vip' | 'rewards';

interface BoutiqueAndVipModalProps {
  open: boolean;
  wallet: WalletState;
  initialSection?: BoutiqueSectionTab;
  onClose: () => void;
  onRedeemCode: (code: string) => boolean;
  onRestoreVipSuccess?: () => void;
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
  const [questMsg, setQuestMsg] = useState<string | null>(null);
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
    onClaimNewsletterBonus(email);
    setNewsletterMsg('🎉 You’re on The Velvet Dispatch list for new episode & salon drops!');
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

  const filteredProducts =
    shopFilter === 'all'
      ? AFFILIATE_CATALOG
      : AFFILIATE_CATALOG.filter((item) => item.category === shopFilter);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18101E]/65 p-3 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Cougars & Cubs Club VIP & Creator Lounge"
    >
      <div className="editorial-hinge-card relative max-h-[90vh] w-full max-w-4xl overflow-x-hidden overflow-y-auto rounded-3xl bg-[#FFFDF9] p-5 sm:p-7 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-4">
          <div className="min-w-0">
            <span className="inline-block rounded-full bg-amber-100 border border-amber-300/70 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wide text-amber-950">
              Date-Night Shop • Desire Unlocks • VIP Black Card
            </span>
            <h2 className="mt-1.5 font-editorial text-2xl sm:text-3xl font-bold text-[#18101E]">
              Cougars &amp; Cubs Club Boutique &amp; VIP
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-stone-600">
              Balance:{' '}
              <strong className="text-rose-700">
                {wallet.isFounderUnlimited
                  ? '∞ Unlimited Founder Credits'
                  : `${wallet.credits} Credits (${MONETIZATION_CONFIG.starterCredits} starter)`}
              </strong>{' '}
              {(wallet.isVip || wallet.isFounderUnlimited) && (
                <strong className="text-emerald-700">• VIP BLACK CARD ACTIVE</strong>
              )}
              {wallet.hasPatronBadge && (
                <strong className="text-amber-700"> • 💛 CLUB PATRON</strong>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-stone-200 bg-white p-2 text-stone-700 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
            aria-label="Close Boutique"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(
            [
              ['shop', `🛍️ Date-Night Shop (${AFFILIATE_CATALOG.length})`],
              ['vip', '💎 Credits & VIP'],
              ['rewards', '🗝️ Salon Waitlist & Invite'],
            ] as const
          ).map(([tabId, label]) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setActiveTab(tabId)}
              className={`rounded-full px-4 py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                activeTab === tabId
                  ? 'bg-[#18101E] text-white'
                  : 'border border-stone-200 bg-white text-[#18101E] hover:bg-stone-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'vip' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-stretch">
              <div className="rounded-3xl border border-stone-200 bg-white p-5 flex flex-col justify-between h-full shadow-2xs">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wide text-rose-700">
                    Desire Pack
                  </span>
                  <div className="font-editorial text-2xl font-bold text-[#18101E] mt-1">
                    +15 Den Credits • $2.99
                  </div>
                  <p className="text-xs font-medium text-stone-600 mt-2 leading-relaxed">
                    Send Standout Roses (1 Cr), read Secret Group-Chat Leaks (2 Cr), unblur Candid Photo Drops (2 Cr), and play Velvet Cut Weekend Epilogues (3 Cr).
                  </p>
                </div>
                {MONETIZATION_CONFIG.stripeCreditPackUrl ? (
                  <a
                    href={MONETIZATION_CONFIG.stripeCreditPackUrl}
                    onClick={() => handleStripeCheckoutClick('credits_299', 'credits')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block rounded-full bg-rose-600 py-2.5 text-center text-sm font-extrabold text-white hover:bg-rose-700 transition"
                  >
                    Get +15 Credits ($2.99)
                  </a>
                ) : isSandbox ? (
                  <button
                    type="button"
                    onClick={onSandboxGrantCredits}
                    className="mt-4 w-full rounded-full bg-rose-600 py-2.5 text-sm font-extrabold text-white cursor-pointer"
                  >
                    <Sparkles className="inline h-3.5 w-3.5 mr-1" />
                    Preview Unlock +15 Credits (Free Demo)
                  </button>
                ) : null}
              </div>

              <div className="rounded-3xl border-2 border-amber-400 bg-amber-50/60 p-5 flex flex-col justify-between shadow-md h-full">
                <div>
                  <span className="rounded-full bg-amber-300 px-2.5 py-0.5 text-xs font-extrabold uppercase text-[#18101E]">
                    Most Popular
                  </span>
                  <div className="font-editorial text-2xl font-bold text-[#18101E] mt-1.5">
                    VIP Black Card • $6.99
                  </div>
                  <p className="text-xs font-medium text-stone-700 mt-2 leading-relaxed">
                    Unlimited Standout Roses, ALL Secret Group-Chat Leaks, Candid Photos &amp; Velvet Cut Weekend Epilogues forever + 15 bonus credits.
                  </p>
                </div>
                {wallet.isVip ? (
                  <div className="mt-4 rounded-full bg-emerald-100 py-2.5 text-center text-xs font-extrabold text-emerald-900">
                    ✓ VIP Black Card Unlocked
                  </div>
                ) : MONETIZATION_CONFIG.stripeVipPassUrl ? (
                  <a
                    href={MONETIZATION_CONFIG.stripeVipPassUrl}
                    onClick={() => handleStripeCheckoutClick('vip_699', 'vip')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block rounded-full bg-[#18101E] py-2.5 text-center text-sm font-extrabold text-amber-300 hover:bg-stone-800 transition"
                  >
                    <Crown className="inline h-3.5 w-3.5 mr-1" />
                    Unlock VIP Black Card ($6.99)
                  </a>
                ) : isSandbox ? (
                  <button
                    type="button"
                    onClick={onSandboxUnlockVip}
                    className="mt-4 w-full rounded-full bg-[#18101E] py-2.5 text-sm font-extrabold text-amber-300 cursor-pointer"
                  >
                    <Crown className="inline h-3.5 w-3.5 mr-1" />
                    Preview VIP Black Card (Free Demo)
                  </button>
                ) : null}
              </div>

              <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-5 flex flex-col justify-between gap-3 h-full">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wide text-rose-700">
                    Indie Creator Support
                  </span>
                  <div className="font-editorial text-2xl font-bold text-[#18101E] mt-1">
                    💛 Support This Project
                  </div>
                  <p className="text-xs font-medium text-stone-600 mt-2 leading-relaxed">
                    Keep Cougars &amp; Cubs Club ad-free with a $5 Espresso Martini tip (unlocks the 💛 Club Patron badge), or commission a $29 custom character cameo!
                  </p>
                </div>
                <div className="space-y-2">
                  {liveTipUrl && (
                    <a
                      href={liveTipUrl}
                      onClick={() => handleStripeCheckoutClick('tip_5', 'tip')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-full bg-amber-300 py-2.5 text-xs font-extrabold text-[#18101E] hover:bg-amber-400 transition"
                    >
                      <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
                      <span>💛 Support This Project ($5)</span>
                    </a>
                  )}

                  {liveCameoUrl && (
                    <a
                      href={liveCameoUrl}
                      onClick={() => handleStripeCheckoutClick('cameo_29', 'cameo')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-full border border-stone-300 bg-white py-2 text-xs font-extrabold text-[#18101E]"
                    >
                      <Gift className="h-3.5 w-3.5 text-rose-600" />
                      <span>Sponsor Custom Scenario ($29)</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-stretch">
              <form
                onSubmit={handlePromoSubmit}
                className="rounded-2xl border border-stone-200 bg-white p-4 space-y-2.5"
              >
                <div className="text-xs font-extrabold uppercase text-[#18101E]">
                  Have a VIP or Creator Code?
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder={isSandbox ? 'Enter code (e.g. VELVETVIP)' : 'Enter VIP or promo code'}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="min-w-0 w-full flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-bold text-[#18101E]"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-extrabold text-[#18101E] cursor-pointer"
                  >
                    Redeem
                  </button>
                </div>
                {codeMessage && <p className="text-xs font-bold text-rose-700">{codeMessage}</p>}
              </form>

              <form
                onSubmit={handleNewsletterSubmit}
                className="rounded-2xl border border-stone-200 bg-white p-4 space-y-2.5"
              >
                <div className="text-xs font-extrabold uppercase text-[#18101E]">
                  <Mail className="inline h-3.5 w-3.5 mr-1 text-rose-600" />
                  Join The Velvet Dispatch
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 w-full flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-bold text-[#18101E]"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl bg-[#18101E] px-3.5 py-2 text-xs font-extrabold text-white cursor-pointer"
                  >
                    Join
                  </button>
                </div>
                {newsletterMsg && (
                  <p className="text-xs font-extrabold text-emerald-800">{newsletterMsg}</p>
                )}
              </form>

              <form
                onSubmit={handleRestoreVip}
                className="rounded-2xl border border-stone-200 bg-white p-4 space-y-2.5"
              >
                <div className="text-xs font-extrabold uppercase text-rose-700">
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
                    className="min-w-0 w-full flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-bold text-[#18101E]"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-extrabold text-white cursor-pointer"
                  >
                    Restore
                  </button>
                </div>
                {restoreMsg && <p className="text-xs font-bold text-rose-700">{restoreMsg}</p>}
              </form>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold uppercase text-amber-950">
                    <Users className="h-3 w-3" /> Invite Your Group Chat
                  </span>
                  <h3 className="mt-1 font-editorial text-xl font-bold text-[#18101E]">
                    Share Your Personal Club Invite Link
                  </h3>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs">
                <div className="min-w-0 break-all font-semibold text-[#18101E]">
                  <strong>Your Link:</strong>{' '}
                  <code className="text-rose-700 font-bold">{refUrl}</code>
                </div>
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
                      text: 'Pass my Cougars & Cubs Club Vetting Simulation 🍸',
                      url: refUrl,
                    });
                    setQuestMsg('🔗 Invite link copied! Drop it in your group chat.');
                  }}
                  className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[#18101E] px-4 py-2 font-extrabold text-white cursor-pointer"
                >
                  <Copy className="h-3 w-3" /> Copy Link
                </button>
              </div>
              {questMsg && <p className="text-xs font-extrabold text-emerald-800">{questMsg}</p>}
            </div>

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
                    setWaitlistMsg(
                      `🗝️ Velvet-Rope Application #${data.position ?? 142} received! You’re on the list for our invite-only Virtual Trivia Salon.`,
                    );
                    setWaitlistVibe('');
                    setWaitlistContact('');
                  } else {
                    setWaitlistMsg('Please include a valid email or @handle so we can send your invite.');
                  }
                } catch {
                  setWaitlistMsg('🗝️ Velvet-Rope Waitlist spot reserved!');
                }
              }}
              className="rounded-3xl bg-gradient-to-r from-[#18101E] via-[#261633] to-[#18101E] p-5 text-white space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-amber-300">
                  🗝️ Velvet-Rope Private Club Waitlist
                </div>
                <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-200">
                  Invite-Only Virtual Salons
                </span>
              </div>
              <p className="text-xs text-white/85 leading-relaxed">
                Apply for our vetted member cohort, starting with low-pressure Virtual Trivia &amp; Speed-Vetting Salons.
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
                    🐕 Vetted Cub (21-35)
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
                  placeholder="Your vibe"
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
                className="w-full sm:w-auto rounded-full bg-amber-300 px-5 py-2.5 text-xs font-extrabold text-[#18101E] cursor-pointer"
              >
                Apply to Velvet-Rope Waitlist
              </button>
              {waitlistMsg && <p className="text-xs font-extrabold text-emerald-300">{waitlistMsg}</p>}
            </form>

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
              className="rounded-2xl border border-stone-200 bg-white p-4 space-y-2.5"
            >
              <div className="text-xs font-extrabold uppercase text-[#18101E]">
                <Gift className="inline h-3.5 w-3.5 mr-1 text-rose-600" />
                Sponsored a $29 Custom Cougar / Cub Scenario? Submit Your Brief:
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[220px_1fr_auto]">
                <input
                  type="email"
                  required
                  placeholder="Your Stripe checkout email"
                  value={cameoEmail}
                  onChange={(e) => setCameoEmail(e.target.value)}
                  className="min-w-0 w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-bold text-[#18101E]"
                />
                <input
                  type="text"
                  required
                  minLength={10}
                  maxLength={400}
                  placeholder="Describe your custom character or couple inside joke..."
                  value={cameoBrief}
                  onChange={(e) => setCameoBrief(e.target.value)}
                  className="min-w-0 w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-bold text-[#18101E]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#18101E] px-4 py-2 text-xs font-extrabold text-white cursor-pointer"
                >
                  Send Brief
                </button>
              </div>
              {cameoMsg && <p className="text-xs font-extrabold text-emerald-800">{cameoMsg}</p>}
            </form>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-editorial text-2xl font-bold text-[#18101E]">
                <ShoppingBag className="inline h-5 w-5 mr-1.5 text-rose-600" />
                Curated Cougar &amp; Cub Date-Night Shop ({AFFILIATE_CATALOG.length} Picks)
              </h3>
              <span className="text-xs font-semibold text-stone-500">
                FTC Disclosure: Protected partner links may earn a small commission at zero extra cost.
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ['all', `✨ All (${AFFILIATE_CATALOG.length})`],
                  ['cougar_cub_merch', '🐆 Cougar & Cub Merch'],
                  ['cinema_pop_culture', '🎬 Movies & Books'],
                  ['houseboy', '🥂 Kitchen & Aprons'],
                  ['princess_luxury', '👑 Soft-Life Silk'],
                  ['hosting_upgrade', '🛏️ Hosting & Bedding'],
                  ['date_night', '🍸 Date Night & Grooming'],
                  ['trail_wellness', '🏔️ Trail & Gym'],
                ] as const
              ).map(([cat, label]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setShopFilter(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    shopFilter === cat
                      ? 'bg-[#18101E] text-white'
                      : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-stone-200 bg-white p-4 flex flex-col justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-2">
                    <ProductVisualThumbnail item={item} />
                    <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-950">
                      {item.badge}
                    </span>
                    <h4 className="text-sm font-bold text-[#18101E] leading-snug">{item.name}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{item.cheekyPitch}</p>
                  </div>
                  <a
                    href={buildAffiliateUrl(item, 'boutique_shop')}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    onClick={() =>
                      trackEvent('affiliate_clicked', {
                        item_id: item.id,
                        surface: 'boutique_shop',
                      })
                    }
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#18101E] py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition"
                  >
                    <span>Shop on Amazon</span>
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
