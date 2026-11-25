import React, { useState } from 'react';
import { Coffee, Crown, ExternalLink, Gift, Mail, Sparkles, X } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { MONETIZATION_CONFIG } from '../config/monetization';
import type { WalletState } from '../domain/economy';
import { AFFILIATE_CATALOG, buildAffiliateUrl } from '../lib/affiliates';

interface BoutiqueAndVipModalProps {
  open: boolean;
  wallet: WalletState;
  onClose: () => void;
  onRedeemCode: (code: string) => boolean;
  onSandboxGrantCredits: () => void;
  onSandboxUnlockVip: () => void;
  onClaimNewsletterBonus: (email: string) => boolean;
}

export const BoutiqueAndVipModal: React.FC<BoutiqueAndVipModalProps> = ({
  open,
  wallet,
  onClose,
  onRedeemCode,
  onSandboxGrantCredits,
  onSandboxUnlockVip,
  onClaimNewsletterBonus,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);

  if (!open) return null;

  const isSandbox = MONETIZATION_CONFIG.sandboxPreviewMode;

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onRedeemCode(promoCode);
    setCodeMessage(
      ok
        ? '✨ Unlocked! VIP / Bonus Credits applied to your wallet.'
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
        ? '🎉 Welcome to The Velvet Dispatch! +5 Bonus Credits added.'
        : 'You’re on the list! (Newsletter bonus already claimed.)',
    );
    setEmail('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Velvet Concierge Boutique & VIP Upgrades"
    >
      <div className="vice-panel relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-[#160c24] p-5 sm:p-7 space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="inline-block rounded bg-amber-400/20 px-2.5 py-0.5 text-xs font-extrabold uppercase text-amber-300">
              Credits • VIP Black Card • Date-Night Boutique
            </span>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl text-white">
              The Velvet Concierge &amp; Creator Lounge
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Balance: <strong className="text-amber-300">{wallet.credits} Credits</strong>{' '}
              {wallet.isVip && <strong className="text-emerald-300">• VIP BLACK CARD ACTIVE</strong>}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border-2 border-black bg-slate-800 p-2 text-slate-200 hover:bg-rose-600 cursor-pointer"
            aria-label="Close Boutique"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tier Cards: Credits, VIP Black Card, Tip Jar, Custom Cameo */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Pack 1: 15 Credits */}
          <div className="rounded-2xl border-2 border-black bg-[#211235] p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-teal-300">Action Pack</span>
              <div className="font-display text-3xl text-white mt-1">+15 Velvet Credits • $2.99</div>
              <p className="text-xs text-slate-300 mt-1">
                Smooth Rewinds on red-flag fumbles, Dating App X-Ray Scans, and individual Deep-Cut episode unlocks.
              </p>
            </div>
            {MONETIZATION_CONFIG.stripeCreditPackUrl ? (
              <a
                href={MONETIZATION_CONFIG.stripeCreditPackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-xl border-2 border-black bg-teal-400 py-2.5 text-center text-xs font-extrabold text-slate-950"
              >
                Get +15 Credits ($2.99)
              </a>
            ) : isSandbox ? (
              <button
                type="button"
                onClick={onSandboxGrantCredits}
                className="mt-4 w-full rounded-xl border-2 border-black bg-teal-400 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-teal-300 cursor-pointer"
              >
                <Sparkles className="inline h-3.5 w-3.5 mr-1" />
                Preview Unlock +15 Credits (Free Demo)
              </button>
            ) : (
              <div className="mt-4 rounded-xl bg-slate-800 py-2.5 text-center text-xs font-bold text-slate-400">
                Checkout Opening Soon
              </div>
            )}
          </div>

          {/* Pack 2: Lifetime VIP Black Card */}
          <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-[#2f153e] to-[#1d0e2a] p-4 flex flex-col justify-between">
            <div>
              <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-950">
                Most Popular
              </span>
              <div className="font-display text-3xl text-amber-300 mt-1">
                VIP Black Card • $6.99
              </div>
              <p className="text-xs text-slate-200 mt-1">
                Unlocks ALL 4 Subreddit Deep-Cut episodes forever (His Bathroom Audit, 5-Star Palm Springs, Thanksgiving Boss, Trader Joe&rsquo;s) + 10 bonus credits.
              </p>
            </div>
            {wallet.isVip ? (
              <div className="mt-4 rounded-xl bg-emerald-400/20 py-2.5 text-center text-xs font-extrabold text-emerald-300">
                ✓ VIP Black Card Unlocked
              </div>
            ) : MONETIZATION_CONFIG.stripeVipPassUrl ? (
              <a
                href={MONETIZATION_CONFIG.stripeVipPassUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-xl border-2 border-black bg-amber-400 py-2.5 text-center text-xs font-extrabold text-slate-950"
              >
                <Crown className="inline h-3.5 w-3.5 mr-1" />
                Unlock VIP Black Card ($6.99)
              </a>
            ) : isSandbox ? (
              <button
                type="button"
                onClick={onSandboxUnlockVip}
                className="mt-4 w-full rounded-xl border-2 border-black bg-amber-400 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-amber-300 cursor-pointer"
              >
                <Crown className="inline h-3.5 w-3.5 mr-1" />
                Preview VIP Black Card (Free Demo)
              </button>
            ) : (
              <div className="mt-4 rounded-xl bg-slate-800 py-2.5 text-center text-xs font-bold text-slate-400">
                VIP Checkout Opening Soon
              </div>
            )}
          </div>

          {/* Pack 3: Creator Tip + $29 Custom Archetype Cameo */}
          <div className="rounded-2xl border-2 border-black bg-[#211235] p-4 flex flex-col justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase text-pink-300">
                0%-Fee Tip &amp; Custom Cameos
              </span>
              <div className="font-display text-3xl text-white mt-1">
                Immortalize Your Inside Joke
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Buy the creator an Espresso Martini—or sponsor a custom $29 Cougar/Cub dating profile or dilemma in the next drop!
              </p>
            </div>
            <div className="space-y-2">
              <a
                href={MONETIZATION_CONFIG.kofiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-pink-600 py-2 text-xs font-extrabold text-white hover:bg-pink-500"
              >
                <Coffee className="h-3.5 w-3.5" />
                <span>Tip an Espresso Martini ($5)</span>
              </a>
              <a
                href={MONETIZATION_CONFIG.cameoCommissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-slate-800 py-2 text-xs font-bold text-amber-300 hover:bg-slate-700"
              >
                <Gift className="h-3.5 w-3.5" />
                <span>Sponsor Custom Scenario ($29)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Promo Code + Newsletter Lead Magnet Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <form
            onSubmit={handlePromoSubmit}
            className="rounded-2xl border-2 border-black bg-black/40 p-4 space-y-2"
          >
            <div className="text-xs font-extrabold uppercase text-slate-300">
              Have a Stripe VIP Pass or Promo Code?
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={isSandbox ? 'Enter code (e.g. VELVETVIP)' : 'Enter VIP or promo code'}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-700 px-4 py-2 text-xs font-bold text-white hover:bg-slate-600 cursor-pointer"
              >
                Redeem
              </button>
            </div>
            {codeMessage && <p className="text-xs text-teal-300">{codeMessage}</p>}
          </form>

          <form
            onSubmit={handleNewsletterSubmit}
            className="rounded-2xl border-2 border-black bg-black/40 p-4 space-y-2"
          >
            <div className="text-xs font-extrabold uppercase text-amber-300">
              <Mail className="inline h-3.5 w-3.5 mr-1" />
              Join The Velvet Dispatch (+5 Free Credits + Weekly Dilemmas)
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
              />
              <button
                type="submit"
                className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-amber-300 cursor-pointer"
              >
                Claim +5 Cr
              </button>
            </div>
            {newsletterMsg && <p className="text-xs text-emerald-300">{newsletterMsg}</p>}
          </form>
        </div>

        {/* Curated Lifestyle & Date-Night Affiliate Boutique */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-3xl text-white">
              🛍️ Curated Cougar &amp; Cub Lifestyle Essentials
            </h3>
            <span className="text-[11px] text-slate-400">
              FTC Disclosure: Selected links may earn a small affiliate commission at zero extra cost to you.
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {AFFILIATE_CATALOG.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border-2 border-black bg-[#101c28] p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-teal-400/20 px-2 py-0.5 text-[10px] font-extrabold uppercase text-teal-300">
                      {item.badge}
                    </span>
                    <span className="text-sm font-extrabold text-amber-300">
                      {item.priceDisplay}
                    </span>
                  </div>
                  <h4 className="mt-1.5 text-sm font-bold text-white">{item.name}</h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{item.cheekyPitch}</p>
                </div>

                <a
                  href={buildAffiliateUrl(item, 'boutique_modal')}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-teal-400 py-2 text-xs font-extrabold text-slate-950 hover:bg-teal-300"
                >
                  <span>Shop on Merchant</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Community Links */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-300">
          <span>Join our daily &ldquo;Vet or Ghost?&rdquo; community polls:</span>
          <div className="flex gap-3 font-bold">
            <a
              href={BRAND_CONFIG.discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-300 underline"
            >
              Velvet Den Discord
            </a>
            <a
              href={BRAND_CONFIG.ownedSubredditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-300 underline"
            >
              Official Brand Community
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
