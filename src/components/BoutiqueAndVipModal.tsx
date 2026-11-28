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
  X,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { MONETIZATION_CONFIG } from '../config/monetization';
import type { WalletState } from '../domain/economy';
import {
  AFFILIATE_CATALOG,
  AFFILIATE_SUPPORT_COPY,
  buildAffiliateUrl,
  isPrimeVideoDigitalPick,
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
          ? 'Code not recognized (try BLACKCARD in preview mode).'
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
    setNewsletterMsg('🎉 You’re on the Cougars & Cubs Club Dispatch list for monthly character drops!');
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
      setCameoMsg('Network hiccup, please press Submit Brief once more.');
    }
  };

  const filteredProducts =
    shopFilter === 'all'
      ? AFFILIATE_CATALOG
      : AFFILIATE_CATALOG.filter((item) => item.category === shopFilter);

  const modalNode = (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/60 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Cougars & Cubs Club VIP & Creator Lounge"
      onClick={onClose}
    >
      <div
        data-testid="boutique-modal-shell"
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Non-Scrolling Header + Tabs (Close X Always Accessible) */}
        <div className="shrink-0 border-b border-zinc-200 bg-white px-5 pt-5 pb-4 sm:px-8 sm:pt-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                {wallet.isVip ? (
                  <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-emerald-800 font-bold">
                    ✓ Lifetime VIP Black Card Active
                  </span>
                ) : (
                  <span className="rounded-md bg-zinc-100 px-2.5 py-0.5 text-zinc-700">
                    Core Game Free to Play
                  </span>
                )}
                {wallet.hasPatronBadge && (
                  <span className="rounded-md bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-amber-800 font-bold">
                    💛 Club Patron
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                Club VIP, Real Matchmaking &amp; Date-Night Shop
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
              aria-label="Close Boutique"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Clean Segmented Tab Control */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 rounded-xl bg-zinc-100 p-1">
            {(
              [
                ['vip', 'Club VIP & Perks'],
                ['rewards', 'Real Matchmaking & Discord'],
                ['shop', `Date-Night Shop (${AFFILIATE_CATALOG.length})`],
              ] as const
            ).map(([tabId, label]) => (
              <button
                key={tabId}
                type="button"
                onClick={() => setActiveTab(tabId)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tabId
                    ? 'bg-white text-zinc-950 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Independently Scrollable Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-zinc-50/80 p-5 sm:p-7 space-y-5">

        {activeTab === 'vip' && (
          <div className="space-y-5">
            {/* Verified-Only Producer Brief Composer (Unlocks ONLY when a real $29 Stripe cs_... session verified) */}
            {verifiedCameoSessionId && (
              <form
                data-testid="verified-cameo-composer"
                onSubmit={handleVerifiedCameoSubmit}
                className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5 space-y-3 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
                    ✓ Verified $29 Producer Pass
                  </span>
                  <span className="text-xs font-medium text-emerald-900">
                    +50 Credits &amp; Lifetime VIP Applied
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  Describe Your Custom Cougar or Cub Character
                </h3>
                <textarea
                  required
                  minLength={10}
                  maxLength={500}
                  rows={3}
                  placeholder="First-name persona, age, job, green flag (or funny red flag), and favorite hangout..."
                  value={cameoBrief}
                  onChange={(e) => setCameoBrief(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white p-3.5 text-sm text-zinc-950 focus:border-zinc-950 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800 cursor-pointer"
                >
                  Submit Verified Character Brief →
                </button>
              </form>
            )}
            {cameoMsg && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-950">
                {cameoMsg}
              </div>
            )}

            {/* 3-Tier Pricing Cards (Clean shadcn Layout, Zero Subtitle Bloat) */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-stretch">
              {/* TIER 1: Starter Pack ($2.99) */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-2xs">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-zinc-950">
                        Weekend Bonus Pack
                      </h3>
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                        One-Time
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 pt-1">
                      <span className="text-3xl font-bold tracking-tight text-zinc-950">$2.99</span>
                      <span className="text-xs font-medium text-zinc-500">no subscription</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm text-zinc-700">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                      <span><strong className="text-zinc-950">+15 Club Credits</strong> for Standout Roses &amp; bold openers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                      <span>Extra <strong className="text-zinc-950">Roast My Opener &amp; ENM Trap Radar</strong> runs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                      <span>Unlock <strong className="text-zinc-950">Midnight After-Dark</strong>, Group-Chat Leaks &amp; Epilogues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                      <span>Supports 100% banner-ad-free indie hosting</span>
                    </li>
                  </ul>
                </div>

                {MONETIZATION_CONFIG.stripeCreditPackUrl ? (
                  <a
                    href={MONETIZATION_CONFIG.stripeCreditPackUrl}
                    onClick={() => handleStripeCheckoutClick('credits_299', 'credits')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-zinc-300 bg-white text-sm font-semibold text-zinc-950 hover:bg-zinc-50 transition-colors"
                  >
                    Get Weekend Bonus Pack
                  </a>
                ) : isSandbox ? (
                  <button
                    type="button"
                    onClick={onSandboxGrantCredits}
                    className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-rose-600 text-sm font-semibold text-white cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Preview +15 Credits (Free Demo)</span>
                  </button>
                ) : null}
              </div>

              {/* TIER 2: HERO BEST-VALUE CARD ($6.99 Lifetime VIP Black Card) */}
              <div className="relative rounded-2xl border-2 border-zinc-950 bg-zinc-950 p-5 sm:p-6 text-white flex flex-col justify-between gap-5 shadow-md">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-white">
                        Lifetime VIP Black Card
                      </h3>
                      <span className="rounded-md bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
                        Best Value
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 pt-1">
                      <span className="text-3xl font-bold tracking-tight text-white">$6.99</span>
                      <span className="text-xs font-medium text-zinc-400">once · yours forever</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm text-zinc-200">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                      <span><strong className="text-white">Unlimited</strong> Roast My Opener, Subtext &amp; ENM Trap Lab</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                      <span><strong className="text-white">All 22</strong> Midnight After-Dark Routes &amp; Standout Roses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                      <span><strong className="text-white">Every</strong> Group-Chat Leak, Polaroid &amp; Weekend Escape Epilogue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                      <span><strong className="text-white">+15 Bonus Credits</strong> &amp; instant email device restore</span>
                    </li>
                  </ul>
                </div>

                {wallet.isVip ? (
                  <div className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-emerald-400/50 bg-emerald-500/20 text-sm font-semibold text-emerald-200">
                    ✓ Lifetime VIP Black Card Active
                  </div>
                ) : MONETIZATION_CONFIG.stripeVipPassUrl ? (
                  <a
                    href={MONETIZATION_CONFIG.stripeVipPassUrl}
                    onClick={() => handleStripeCheckoutClick('vip_699', 'vip')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-rose-600 text-sm font-semibold text-white hover:bg-rose-500 transition-colors"
                  >
                    <Crown className="h-4 w-4" />
                    <span>Unlock Lifetime VIP</span>
                  </a>
                ) : isSandbox ? (
                  <button
                    type="button"
                    onClick={onSandboxUnlockVip}
                    className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-rose-600 text-sm font-semibold text-white cursor-pointer"
                  >
                    <Crown className="h-4 w-4" />
                    <span>Preview VIP Black Card (Free Demo)</span>
                  </button>
                ) : null}
              </div>

              {/* TIER 3: PRODUCER CAMEO TIER ($29 Cast a Cougar or Cub) */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-2xs">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-zinc-950">
                        Cast a Cougar or Cub
                      </h3>
                      <span className="rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-xs font-medium text-rose-700">
                        Producer
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5 pt-1">
                      <span className="text-3xl font-bold tracking-tight text-zinc-950">$29</span>
                      <span className="text-xs font-medium text-zinc-500">sponsor a character</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm text-zinc-700">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                      <span><strong className="text-zinc-950">Custom 6-photo Prowl profile</strong>, voice note &amp; banter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                      <span>Includes <strong className="text-zinc-950">Lifetime VIP Black Card</strong> + <strong className="text-zinc-950">50 Credits</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                      <span>Unlimited <strong className="text-zinc-950">Roast Lab, After-Dark</strong>, leaks &amp; epilogues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                      <span>Private Producer brief unlocks immediately after checkout</span>
                    </li>
                  </ul>
                </div>

                {liveCameoUrl && (
                  <a
                    href={liveCameoUrl}
                    onClick={() => handleStripeCheckoutClick('cameo_29', 'cameo')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
                  >
                    <Gift className="h-4 w-4" />
                    <span>Sponsor a Character</span>
                  </a>
                )}
              </div>
            </div>

            {/* Clean Indie Tip Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-2xs">
              <div className="text-sm text-zinc-700">
                <strong className="font-semibold text-zinc-950">Enjoying Cougars &amp; Cubs Club ad-free?</strong>{' '}
                Tip an Espresso Martini ($5) and unlock the <strong>💛 Club Patron</strong> badge.
              </div>
              {liveTipUrl && (
                <a
                  href={liveTipUrl}
                  onClick={() => handleStripeCheckoutClick('tip_5', 'tip')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-xs sm:text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
                  <span>Send an Espresso Martini</span>
                </a>
              )}
            </div>

            {/* Clean Collapsible Restore & Gift Code Accordion */}
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => setUtilitiesOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left text-sm font-medium text-zinc-700 hover:text-zinc-950 cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-zinc-400" />
                  <span>Already purchased VIP or have a gift code?</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-500 transition-transform ${
                    utilitiesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {utilitiesOpen && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 border-t border-zinc-200 p-5 bg-zinc-50/50 rounded-b-2xl">
                  <form onSubmit={handleRestoreVip} className="space-y-2">
                    <label className="block text-xs font-semibold text-zinc-800">
                      <ShieldCheck className="inline h-3.5 w-3.5 mr-1 text-emerald-700" />
                      Restore VIP on This Device
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="Email used on Stripe"
                        value={restoreEmail}
                        onChange={(e) => setRestoreEmail(e.target.value)}
                        className="min-w-0 flex-1 h-9 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-950"
                      />
                      <button
                        type="submit"
                        className="shrink-0 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 text-xs font-semibold text-white cursor-pointer"
                      >
                        Restore
                      </button>
                    </div>
                    {restoreMsg && <p className="text-xs font-semibold text-rose-700">{restoreMsg}</p>}
                  </form>

                  <form onSubmit={handlePromoSubmit} className="space-y-2">
                    <label className="block text-xs font-semibold text-zinc-800">
                      Redeem a Gift Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={isSandbox ? 'Enter code (e.g. BLACKCARD)' : 'Enter gift code'}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="min-w-0 flex-1 h-9 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-950"
                      />
                      <button
                        type="submit"
                        className="shrink-0 h-9 rounded-lg border border-zinc-300 bg-white px-4 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 cursor-pointer"
                      >
                        Redeem
                      </button>
                    </div>
                    {codeMessage && <p className="text-xs font-semibold text-rose-700">{codeMessage}</p>}
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-4">
            {/* Group Chat Invite Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-3 shadow-2xs">
              <h3 className="text-lg font-semibold text-zinc-950">
                Share Your Club Invite Link
              </h3>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm">
                <code className="min-w-0 break-all text-xs sm:text-sm font-semibold text-rose-700">{refUrl}</code>
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
                      text: 'Think you’d survive dating me? Take my Cougars & Cubs Vetting Audition 🍸',
                      url: refUrl,
                    });
                    setQuestMsg('🔗 Invite link copied! Drop it in your group chat.');
                  }}
                  className="shrink-0 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 text-xs font-semibold text-white cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy Invite Link
                </button>
              </div>
              {questMsg && <p className="text-xs font-semibold text-emerald-800">{questMsg}</p>}
            </div>

            {/* Private Club Salon & Live Events Waitlist */}
            <form
              data-testid="private-club-waitlist-form"
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
                      `🥂 Club Application #${data.position ?? 142} received! You’re on the list for our invite-only Pop-Culture Trivia & Speed-Vetting Salon.`,
                    );
                    setWaitlistVibe('');
                    setWaitlistContact('');
                  } else {
                    setWaitlistMsg('Please include a valid email or @handle so we can send your invite.');
                  }
                } catch {
                  setWaitlistMsg('🥂 Private Club Waitlist spot reserved!');
                }
              }}
              className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-4 shadow-2xs"
            >
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-semibold text-zinc-950">
                  Real-Life Matchmaking &amp; Discord Waitlist
                </h3>
                <p className="text-sm text-zinc-600">
                  Reserve your spot for verified 21+ Discord waves and curated city mixers.
                </p>
              </div>

              <div
                role="group"
                aria-label="Waitlist Role"
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                <button
                  type="button"
                  onClick={() => setWaitlistRole('cougar')}
                  className={`min-h-[44px] rounded-xl border px-4 py-2.5 text-left text-sm font-semibold whitespace-normal leading-snug transition cursor-pointer ${
                    waitlistRole === 'cougar'
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-2xs'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  🐆 Cougar / Puma / Jaguar (Her)
                </button>
                <button
                  type="button"
                  onClick={() => setWaitlistRole('cub')}
                  className={`min-h-[44px] rounded-xl border px-4 py-2.5 text-left text-sm font-semibold whitespace-normal leading-snug transition cursor-pointer ${
                    waitlistRole === 'cub'
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-2xs'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  🥂 Vetted Cub, Ages 21 to 35 (Him)
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <input
                  type="text"
                  maxLength={48}
                  placeholder="City (e.g. LA, NYC, London)"
                  value={waitlistCity}
                  onChange={(e) => setWaitlistCity(e.target.value)}
                  className="min-w-0 w-full h-10 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  maxLength={120}
                  placeholder="Email or @handle for invite"
                  value={waitlistContact}
                  onChange={(e) => setWaitlistContact(e.target.value)}
                  className="min-w-0 w-full h-10 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none"
                />
                <input
                  type="text"
                  maxLength={140}
                  placeholder="Your Friday date vibe in one line (optional)"
                  value={waitlistVibe}
                  onChange={(e) => setWaitlistVibe(e.target.value)}
                  className="sm:col-span-2 min-w-0 w-full h-10 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-rose-600 px-5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors cursor-pointer"
                >
                  Join Private Club Waitlist →
                </button>
                {waitlistMsg && <p className="text-sm font-semibold text-emerald-700">{waitlistMsg}</p>}
              </div>
            </form>

            {/* Real Community Subreddit Links */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-3 shadow-2xs">
              <h3 className="text-base sm:text-lg font-semibold text-zinc-950">
                Real Age-Gap Communities on Reddit
              </h3>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href="https://www.reddit.com/r/CougarsAndCubs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 text-xs sm:text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  <span>Visit r/CougarsAndCubs</span>
                  <ExternalLink className="h-3.5 w-3.5 text-rose-600" />
                </a>
                <a
                  href="https://www.reddit.com/r/AgeGap/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 text-xs sm:text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  <span>Visit r/AgeGap</span>
                  <ExternalLink className="h-3.5 w-3.5 text-rose-600" />
                </a>
              </div>
            </div>

            {/* Clean Newsletter Dispatch Card */}
            <form
              onSubmit={handleNewsletterSubmit}
              className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-3 shadow-2xs"
            >
              <h3 className="text-base sm:text-lg font-semibold text-zinc-950">
                <Mail className="inline h-4 w-4 mr-1.5 text-rose-600" />
                Monthly Character &amp; Case Drops
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-0 flex-1 h-10 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-950 focus:border-zinc-950 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 h-10 rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800 cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
              {newsletterMsg && (
                <p className="text-xs font-semibold text-emerald-700">{newsletterMsg}</p>
              )}
            </form>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-zinc-950 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-rose-600" />
                <span>Date-Night &amp; Hosting Shop ({AFFILIATE_CATALOG.length})</span>
              </h3>
              <span className="text-xs text-zinc-500">{AFFILIATE_SUPPORT_COPY.compactInline}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ['all', `All (${AFFILIATE_CATALOG.length})`],
                  ['cougar_cub_merch', '🐆 Club Merch'],
                  ['funny_cute', '🎁 Funny & Cute'],
                  ['cinema_pop_culture', '🎬 Prime Video & Books'],
                  ['houseboy', '🥂 Kitchen'],
                  ['princess_luxury', '👑 Silk & Soft Life'],
                  ['hosting_upgrade', '🛏️ Hosting'],
                  ['date_night', '🍸 Date Night'],
                  ['trail_wellness', '🏔️ Trail & Gym'],
                ] as const
              ).map(([cat, label]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setShopFilter(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    shopFilter === cat
                      ? 'bg-zinc-900 font-semibold text-white'
                      : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
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
                  className="rounded-2xl border border-zinc-200 bg-white p-4 flex flex-col justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-2">
                    <ProductVisualThumbnail item={item} />
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-zinc-500">
                        {item.badge}
                      </span>
                      <span className="font-semibold text-rose-600 whitespace-nowrap">
                        {item.priceDisplay}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-zinc-950 leading-snug">{item.name}</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">
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
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 text-xs sm:text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
                  >
                    <span>
                      {isPrimeVideoDigitalPick(item)
                        ? 'Stream / Rent on Prime Video'
                        : 'Shop on Amazon'}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
