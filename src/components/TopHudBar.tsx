import React from 'react';
import { BookOpen, Coffee, Crown, Newspaper, ShoppingBag, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { MONETIZATION_CONFIG } from '../config/monetization';
import type { WalletState } from '../domain/economy';

interface TopHudBarProps {
  wallet: WalletState;
  activeTab: 'game' | 'journal';
  onSelectTab: (tab: 'game' | 'journal') => void;
  onOpenFieldGuide: () => void;
  onOpenBoutique: () => void;
  onGoHome: () => void;
}

export const TopHudBar: React.FC<TopHudBarProps> = ({
  wallet,
  activeTab,
  onSelectTab,
  onOpenFieldGuide,
  onOpenBoutique,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b-3 border-black bg-[#12091c]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-6">
        <button
          type="button"
          onClick={onGoHome}
          className="group flex items-center gap-2.5 text-left cursor-pointer"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-rose-500 to-amber-400 text-xl shadow-[3px_3px_0px_#09050f]">
            🐆
          </span>
          <div>
            <div className="font-display text-xl sm:text-2xl leading-none text-white group-hover:text-amber-300 transition-colors">
              {BRAND_CONFIG.name}
            </div>
            <div className="hidden sm:block text-[11px] text-slate-300">
              {BRAND_CONFIG.subtitle}
            </div>
          </div>
        </button>

        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenFieldGuide}
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-teal-300 hover:bg-slate-700 cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Field Guide</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'journal' ? 'game' : 'journal')}
            className={`inline-flex items-center gap-1.5 rounded-lg border-2 border-black px-2.5 py-1.5 text-xs font-bold cursor-pointer ${
              activeTab === 'journal'
                ? 'bg-teal-400 text-slate-950'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Newspaper className="h-3.5 w-3.5" />
            <span>Dating Guides</span>
          </button>

          <button
            type="button"
            onClick={onOpenBoutique}
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-gradient-to-r from-amber-400 to-rose-400 px-2.5 py-1.5 text-xs font-extrabold text-slate-950 shadow-[2px_2px_0px_#09050f] hover:brightness-105 cursor-pointer"
          >
            {wallet.isVip ? <Crown className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span>{wallet.isVip ? `VIP • ${wallet.credits} Cr` : `${wallet.credits} Credits`}</span>
            <ShoppingBag className="h-3.5 w-3.5 ml-0.5" />
          </button>

          <a
            href={MONETIZATION_CONFIG.kofiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-pink-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#09050f] hover:bg-pink-500"
            title="Buy the creator an Espresso Martini (0% platform fee)"
          >
            <Coffee className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Tip Martini</span>
          </a>
        </nav>
      </div>
    </header>
  );
};
