import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  ChevronDown,
  Copy,
  Crown,
  ExternalLink,
  Gift,
  Heart,
  Lock,
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
  verifiedCameoSessionId?: string | null;
  onCameoBriefSubmitted?: () => void;
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
  verifiedCameoSessionId = null,
  onCameoBriefSubmitted,
  onClose,
  onRedeemCode,
  onRestoreVipSuccess,
  onSandboxGrantCredits,
  onSandboxUnlockVip,
  onClaimNewsletterBonus,
}) => {
  const [activeTab, setActiveTab] = useState<BoutiqueSectionTab>(initialSection);
  const [utilitiesOpen, setUtilitiesOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);
  const [restoreEmail, setRestoreEmail] = useState('');
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);
  const [questMsg, setQuestMsg] = useState<string | null>(null);
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
        ? '✨ Unlocked! VIP / Gift access applied to your wallet.'
        : isSandbox
          ? 'Code not recognized (try VELVETVIP in preview mode).'
          : 'Code not recognized. Double-check your gift code and try again.',
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
    setNewsletterMsg('🎉 You’re on The Velvet Dispatch list for new character & salon drops!');
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
      setRestoreMsg('Could not reach VIP restore service right now—try again in a moment.');
    }
  };

  const handleVerifiedCameoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedCameoSessionId || cameoBrief.trim().length < 10) return;
    try {
      const res = await fetch('/api/cameo-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getPostHogTracingHeaders(),
        },
        body: JSON.stringify({
          sessionId: verifiedCameoSessionId,
          brief: cameoBrief.trim(),
        }),
      });
      if (res.ok) {
        setCameoMsg(
          '🎬 Producer Brief locked in! Your custom Cougar or Cub character is queued for our next Club drop.',
        );
        setCameoBrief('');
        onCameoBriefSubmitted?.();
      } else {
        setCameoMsg('Please write at least one full sentence describing your character vibe.');
      }
    } catch {
      setCameoMsg('Network hiccup—please press Submit Brief once more.');
    }
  };

  const filteredProducts =
    shopFilter === 'all'
      ? AFFILIATE_CATALOG
      : AFFILIATE_CATALOG.filter((item) => item.category === shopFilter);

  const modalNode = (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#18101E]/65 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Cougars & Cubs Club VIP & Creator Lounge"
      onClick={onClose}
    >
      <div
        className="editorial-hinge-card relative max-h-[92vh] w-full max-w-5xl overflow-x-hidden overflow-y-auto rounded-3xl bg-[#FFFDF9] p-5 sm:p-8 space-y-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Consumer Header */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-[#18101E]">
                🐆 Your Wallet:{' '}
                <strong className="text-rose-700">
                  {wallet.isFounderUnlimited
                    ? '∞ Founder Unlimited'
                    : `${wallet.credits} Credits`}
                </strong>
              </span>
              {(wallet.isVip || wallet.isFounderUnlimited) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-900">
                  ✓ Lifetime VIP Active
                </span>
              )}
              {wallet.hasPatronBadge && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-950">
                  💛 Club Patron
                </span>
              )}
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#18101E]">
              Club Passes, VIP &amp; Date-Night Boutique
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-stone-200 bg-white p-2.5 text-stone-700 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
            aria-label="Close Boutique"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Clean shadcn Segmented Tab Control */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 rounded-xl bg-zinc-100 p-1">
          {(
            [
              ['vip', 'Passes & VIP'],
              ['shop', `Date-Night Shop (${AFFILIATE_CATALOG.length})`],
              ['rewards', 'Private Salon & Invite'],
            ] as const
          ).map(([tabId, label]) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setActiveTab(tabId)}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tabId
                  ? 'bg-white text-zinc-950 shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'vip' && (
          <div className="space-y-6">
            {/* Verified-Only Producer Brief Composer (Unlocks ONLY when a real $29 Stripe cs_... session verified) */}
            {verifiedCameoSessionId && (
              <form
                data-testid="verified-cameo-composer"
                onSubmit={handleVerifiedCameoSubmit}
                className="rounded-3xl border-2 border-emerald-400 bg-emerald-50/60 p-5 sm:p-6 space-y-3 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
                    ✓ Verified $29 Producer Pass
                  </span>
                  <span className="text-xs font-semibold text-emerald-900">
                    +50 Credits &amp; Lifetime VIP Applied
                  </span>
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#18101E]">
                  🎬 Describe Your Custom Cougar or Cub Character
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed">
                  Share the first-name persona, age, job, signature green flag (or hilarious red-flag trap!), and favorite Velvet Palms hangout—we’ll illustrate 6 slides and add them to the Club deck.
                </p>
                <textarea
                  required
                  minLength={10}
                  maxLength={500}
                  rows={3}
                  placeholder="Example: '44F Santa Barbara vineyard architect who roasts crypto bros over Pinot Noir and melts for a man who cooks Sunday breakfast...'"
                  value={cameoBrief}
                  onChange={(e) => setCameoBrief(e.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-white p-3.5 text-sm font-medium text-[#18101E]"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#18101E] px-6 py-3 text-sm font-extrabold text-white hover:bg-stone-800 cursor-pointer"
                >
                  Submit Verified Character Brief →
                </button>
              </form>
            )}
            {cameoMsg && (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-950">
                {cameoMsg}
              </div>
            )}

            {/* 3-Tier Romance-Sim Pricing Architecture (Readable 14-16px Typography, Clear Value Anchoring) */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 items-stretch">
              {/* TIER 1: Starter Pack ($2.99) */}
              <div className="rounded-3xl border border-stone-200 bg-white p-6 flex flex-col justify-between gap-6 shadow-xs">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                      À La Carte Starter
                    </div>
                    <h3 className="font-editorial text-2xl font-bold text-[#18101E] mt-1">
                      Weekend Date Pack
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-editorial text-4xl font-bold text-[#18101E]">$2.99</span>
                      <span className="text-sm font-semibold text-stone-500">one-time • 15 Credits</span>
                    </div>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    Top up your wallet for special moments across your favorite matches—never a recurring subscription.
                  </p>

                  <ul className="space-y-2.5 text-sm font-medium text-[#18101E]">
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-1" />
                      <span>Send <strong>Standout Roses</strong> &amp; VIP Flirt Moves (1 Cr)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-1" />
                      <span>Unblur <strong>Candid Photo Drops</strong> in chat (2 Cr)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-1" />
                      <span>Read <strong>Secret Bestie Group-Chat Leaks</strong> (2 Cr)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-1" />
                      <span>Play <strong>6-Month Weekend Epilogues</strong> (3 Cr)</span>
                    </li>
                  </ul>
                </div>

                {MONETIZATION_CONFIG.stripeCreditPackUrl ? (
                  <a
                    href={MONETIZATION_CONFIG.stripeCreditPackUrl}
                    onClick={() => handleStripeCheckoutClick('credits_299', 'credits')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-2xl border-2 border-[#18101E] bg-white py-3.5 text-center text-sm sm:text-base font-extrabold text-[#18101E] hover:bg-stone-50 transition"
                  >
                    Get 15 Credits — $2.99
                  </a>
                ) : isSandbox ? (
                  <button
                    type="button"
                    onClick={onSandboxGrantCredits}
                    className="w-full rounded-2xl bg-rose-600 py-3.5 text-sm font-extrabold text-white cursor-pointer"
                  >
                    <Sparkles className="inline h-4 w-4 mr-1" />
                    Preview +15 Credits (Free Demo)
                  </button>
                ) : null}
              </div>

              {/* TIER 2: HERO BEST-VALUE CARD ($6.99 Lifetime VIP Black Card) */}
              <div className="relative rounded-3xl border-2 border-amber-400 bg-[#18101E] p-6 text-white flex flex-col justify-between gap-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#18101E]">
                      ★ Most Popular • Best Value
                    </span>
                  </div>

                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-white">
                      Lifetime VIP Black Card
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-editorial text-4xl font-bold text-amber-300">$6.99</span>
                      <span className="text-sm font-semibold text-stone-300">once • yours forever</span>
                    </div>
                  </div>

                  <p className="text-sm text-stone-200 leading-relaxed">
                    Less than one happy-hour martini—unlocks the complete unrestricted romance sim across all 22 characters forever.
                  </p>

                  <ul className="space-y-2.5 text-sm font-medium text-white">
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-amber-300 mt-1" />
                      <span><strong>Unlimited</strong> Standout Roses &amp; VIP Flirt Choices</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-amber-300 mt-1" />
                      <span><strong>Every</strong> Candid Photo &amp; Secret Group-Chat Leak Free</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-amber-300 mt-1" />
                      <span><strong>All 10</strong> Velvet Cut 6-Month Epilogues Unlocked</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-amber-300 mt-1" />
                      <span><strong>+15 Bonus Credits</strong> &amp; cross-device email restore</span>
                    </li>
                  </ul>
                </div>

                {wallet.isVip ? (
                  <div className="rounded-2xl bg-emerald-500/20 border border-emerald-400/50 py-3.5 text-center text-sm font-extrabold text-emerald-200">
                    ✓ Lifetime VIP Black Card Active
                  </div>
                ) : MONETIZATION_CONFIG.stripeVipPassUrl ? (
                  <a
                    href={MONETIZATION_CONFIG.stripeVipPassUrl}
                    onClick={() => handleStripeCheckoutClick('vip_699', 'vip')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-amber-300 py-3.5 text-center text-sm sm:text-base font-extrabold text-[#18101E] hover:bg-amber-200 transition shadow-md"
                  >
                    <Crown className="h-4 w-4" />
                    <span>Unlock Lifetime VIP — $6.99</span>
                  </a>
                ) : isSandbox ? (
                  <button
                    type="button"
                    onClick={onSandboxUnlockVip}
                    className="w-full rounded-2xl bg-amber-300 py-3.5 text-sm font-extrabold text-[#18101E] cursor-pointer"
                  >
                    <Crown className="inline h-4 w-4 mr-1" />
                    Preview VIP Black Card (Free Demo)
                  </button>
                ) : null}
              </div>

              {/* TIER 3: PRODUCER CAMEO TIER ($29 Cast a Cougar or Cub) */}
              <div className="rounded-3xl border border-rose-200 bg-gradient-to-b from-rose-50/60 to-white p-6 flex flex-col justify-between gap-6 shadow-xs">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
                      🎬 Producer Edition
                    </div>
                    <h3 className="font-editorial text-2xl font-bold text-[#18101E] mt-1">
                      Cast a Cougar or Cub
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-editorial text-4xl font-bold text-[#18101E]">$29</span>
                      <span className="text-sm font-semibold text-stone-500">sponsor a character</span>
                    </div>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    Put a fictionalized Cougar, Cub, or legendary group-chat red flag into the game—just like classic indie dating-sim backer cameos!
                  </p>

                  <ul className="space-y-2.5 text-sm font-medium text-[#18101E]">
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-1" />
                      <span><strong>Custom 6-photo Hinge profile</strong> &amp; banter added to the Club</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-1" />
                      <span>Includes <strong>Lifetime VIP Black Card</strong> ($6.99 value)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-1" />
                      <span>Includes <strong>+50 Bonus Credits</strong> immediately</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-1" />
                      <span>Private character brief unlocks right after Stripe checkout</span>
                    </li>
                  </ul>
                </div>

                {liveCameoUrl && (
                  <a
                    href={liveCameoUrl}
                    onClick={() => handleStripeCheckoutClick('cameo_29', 'cameo')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3.5 text-center text-sm sm:text-base font-extrabold text-white hover:bg-rose-700 transition shadow-xs"
                  >
                    <Gift className="h-4 w-4" />
                    <span>Sponsor a Character — $29</span>
                  </a>
                )}
              </div>
            </div>

            {/* Clean Indie Tip Strip + Stripe Security Reassurance */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200/90 bg-amber-50/60 px-5 py-4">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-[#18101E]">
                  ☕ Loving Cougars &amp; Cubs Club ad-free?
                </div>
                <p className="text-xs sm:text-sm text-stone-600">
                  Buy the indie creator an Espresso Martini ($5) and unlock the <strong>💛 Club Patron</strong> badge on your profile.
                </p>
              </div>
              {liveTipUrl && (
                <a
                  href={liveTipUrl}
                  onClick={() => handleStripeCheckoutClick('tip_5', 'tip')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-300 bg-white px-5 py-2.5 text-sm font-extrabold text-[#18101E] hover:bg-amber-100 transition"
                >
                  <Heart className="h-4 w-4 fill-rose-600 text-rose-600" />
                  <span>Tip $5 Espresso Martini</span>
                </a>
              )}
            </div>

            {/* Clean Collapsible Restore & Gift Code Accordion (Zero Visual Clutter) */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/70">
              <button
                type="button"
                onClick={() => setUtilitiesOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left text-sm font-bold text-stone-700 hover:text-[#18101E] cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-stone-400" />
                  <span>Already purchased VIP or have a gift code?</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-stone-500 transition-transform ${
                    utilitiesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {utilitiesOpen && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 border-t border-stone-200 p-5 bg-white rounded-b-2xl">
                  <form onSubmit={handleRestoreVip} className="space-y-2">
                    <label className="block text-sm font-bold text-[#18101E]">
                      <ShieldCheck className="inline h-4 w-4 mr-1 text-emerald-700" />
                      Restore VIP Black Card on This Device
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="Email used on Stripe"
                        value={restoreEmail}
                        onChange={(e) => setRestoreEmail(e.target.value)}
                        className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm font-medium text-[#18101E]"
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded-xl bg-[#18101E] px-4 py-2.5 text-sm font-bold text-white cursor-pointer"
                      >
                        Restore
                      </button>
                    </div>
                    {restoreMsg && <p className="text-xs font-bold text-rose-700">{restoreMsg}</p>}
                  </form>

                  <form onSubmit={handlePromoSubmit} className="space-y-2">
                    <label className="block text-sm font-bold text-[#18101E]">
                      Redeem a Gift or Creator Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={isSandbox ? 'Enter code (e.g. VELVETVIP)' : 'Enter gift code'}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm font-medium text-[#18101E]"
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-[#18101E] hover:bg-stone-50 cursor-pointer"
                      >
                        Redeem
                      </button>
                    </div>
                    {codeMessage && <p className="text-xs font-bold text-rose-700">{codeMessage}</p>}
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-5">
            {/* Group Chat Invite Card */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 space-y-3 shadow-2xs">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold uppercase text-amber-950">
                  <Users className="h-3.5 w-3.5" /> Challenge Your Friends or Match
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#18101E]">
                  Share Your Personal Club Invite Link
                </h3>
                <p className="text-sm text-stone-600">
                  Drop your link in the group chat or send it to a real-life match to see if they survive Velvet Palms vetting.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-3.5 text-sm">
                <code className="min-w-0 break-all font-bold text-rose-700">{refUrl}</code>
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
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#18101E] px-5 py-2.5 text-sm font-extrabold text-white cursor-pointer"
                >
                  <Copy className="h-4 w-4" /> Copy Invite Link
                </button>
              </div>
              {questMsg && <p className="text-sm font-bold text-emerald-800">{questMsg}</p>}
            </div>

            {/* Private Salon Waitlist */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!waitlistContact.trim() || waitlistContact.trim().length < 4) return;
                identifyPlayerWithContact(waitlistContact.trim(), {
                  role: waitlistRole,
                  city: waitlistCity.trim(),
                  signup_source: 'club_waitlist',
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
              className="rounded-3xl bg-gradient-to-r from-[#18101E] via-[#261633] to-[#18101E] p-6 text-white space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-editorial text-2xl font-bold text-amber-300">
                  🗝️ Velvet-Rope Private Salon Waitlist
                </h3>
                <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-bold text-amber-200">
                  Invite-Only Live Events
                </span>
              </div>
              <p className="text-sm text-white/85 leading-relaxed">
                Apply for our vetted real-world &amp; virtual member cohort—starting with hosted Pop-Culture Trivia &amp; Speed-Vetting Salons.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <select
                  aria-label="Waitlist Role"
                  value={waitlistRole}
                  onChange={(e) => setWaitlistRole(e.target.value === 'cub' ? 'cub' : 'cougar')}
                  className="min-w-0 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm font-bold text-white"
                >
                  <option value="cougar" className="text-[#18101E]">
                    🐆 Puma / Cougar / Jaguar / Panther
                  </option>
                  <option value="cub" className="text-[#18101E]">
                    🥂 Vetted Cub (Ages 21–35)
                  </option>
                </select>
                <input
                  type="text"
                  maxLength={48}
                  placeholder="City / Timezone (e.g. LA, NYC, London)"
                  value={waitlistCity}
                  onChange={(e) => setWaitlistCity(e.target.value)}
                  className="min-w-0 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm font-medium text-white placeholder:text-white/60"
                />
                <input
                  type="text"
                  maxLength={140}
                  placeholder="Your one-line vibe..."
                  value={waitlistVibe}
                  onChange={(e) => setWaitlistVibe(e.target.value)}
                  className="min-w-0 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm font-medium text-white placeholder:text-white/60"
                />
                <input
                  type="text"
                  required
                  maxLength={120}
                  placeholder="Email or @IG / @X handle"
                  value={waitlistContact}
                  onChange={(e) => setWaitlistContact(e.target.value)}
                  className="min-w-0 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm font-medium text-white placeholder:text-white/60"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-amber-300 px-6 py-3 text-sm font-extrabold text-[#18101E] hover:bg-amber-200 transition cursor-pointer"
              >
                Apply to Private Salon →
              </button>
              {waitlistMsg && <p className="text-sm font-bold text-emerald-300">{waitlistMsg}</p>}
            </form>

            {/* Clean Newsletter Dispatch Card */}
            <form
              onSubmit={handleNewsletterSubmit}
              className="rounded-3xl border border-stone-200 bg-white p-6 space-y-3"
            >
              <div className="space-y-1">
                <h3 className="font-editorial text-xl font-bold text-[#18101E]">
                  <Mail className="inline h-5 w-5 mr-1.5 text-rose-600" />
                  The Velvet Dispatch (New Character Drops)
                </h3>
                <p className="text-sm text-stone-600">
                  Get notified once a month when new romance routes, Courtroom cases, and community cameos go live.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm font-medium text-[#18101E]"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-[#18101E] px-6 py-2.5 text-sm font-bold text-white hover:bg-stone-800 cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
              {newsletterMsg && (
                <p className="text-sm font-bold text-emerald-800">{newsletterMsg}</p>
              )}
            </form>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-editorial text-2xl font-bold text-[#18101E]">
                <ShoppingBag className="inline h-5 w-5 mr-1.5 text-rose-600" />
                Curated Date-Night &amp; Hosting Shop ({AFFILIATE_CATALOG.length} Picks)
              </h3>
              <span className="text-xs font-medium text-stone-500">
                Reader Disclosure: Partner links may earn a small commission at zero extra cost.
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['all', `✨ All (${AFFILIATE_CATALOG.length})`],
                  ['cougar_cub_merch', '🐆 Club Merch'],
                  ['cinema_pop_culture', '🎬 Movies & Books'],
                  ['houseboy', '🥂 Kitchen & Aprons'],
                  ['princess_luxury', '👑 Silk & Soft Life'],
                  ['hosting_upgrade', '🛏️ Hosting & Bedding'],
                  ['date_night', '🍸 Date Night & Grooming'],
                  ['trail_wellness', '🏔️ Trail & Gym'],
                ] as const
              ).map(([cat, label]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setShopFilter(cat)}
                  className={`rounded-full px-3.5 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
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
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-950">
                        {item.badge}
                      </span>
                      <span className="text-xs font-extrabold text-rose-700">
                        {item.priceDisplay}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#18101E] leading-snug">{item.name}</h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {item.cheekyPitch}
                    </p>
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
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#18101E] py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-stone-800 transition"
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

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
