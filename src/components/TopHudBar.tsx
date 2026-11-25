import React, { useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Coffee,
  Crown,
  MessageCircle,
  Newspaper,
  ShoppingBag,
  Sparkles,
  Volume2,
  VolumeX,
  Wrench,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { MONETIZATION_CONFIG } from '../config/monetization';
import type { WalletState } from '../domain/economy';
import { isSoundMuted, toggleSoundMute } from '../lib/sound';

interface TopHudBarProps {
  wallet: WalletState;
  activeTab: 'game' | 'journal';
  onSelectTab: (tab: 'game' | 'journal') => void;
  onOpenFieldGuide: () => void;
  onOpenBoutique: () => void;
  onOpenLiveInbox: () => void;
  onOpenPopTrivia?: () => void;
  onToggleFounderMode?: () => void;
  onGoHome: () => void;
}

export const TopHudBar: React.FC<TopHudBarProps> = ({
  wallet,
  activeTab,
  onSelectTab,
  onOpenFieldGuide,
  onOpenBoutique,
  onOpenLiveInbox,
  onOpenPopTrivia,
  onToggleFounderMode,
  onGoHome,
}) => {
  const [muted, setMuted] = useState(() => isSoundMuted());
  const tapCountRef = useRef(0);
  const liveTipUrl = MONETIZATION_CONFIG.tipJarUrl || MONETIZATION_CONFIG.kofiUrl;

  const handleLogoClick = () => {
    tapCountRef.current += 1;
    if (tapCountRef.current >= 5 && onToggleFounderMode) {
      tapCountRef.current = 0;
      onToggleFounderMode();
      return;
    }
    onGoHome();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0d0917]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={handleLogoClick}
          className="group flex items-center gap-3 text-left cursor-pointer"
          title="Home (Tip: Click 5x to toggle Founder Unlimited Test Mode)"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-400 text-xl shadow-md">
            🐆
          </span>
          <div>
            <div className="font-display text-lg sm:text-xl text-white group-hover:text-amber-200 transition-colors">
              {BRAND_CONFIG.name}
            </div>
            <div className="hidden md:block text-xs text-slate-400">
              {BRAND_CONFIG.subtitle}
            </div>
          </div>
        </button>

        <nav className="flex w-full sm:w-auto overflow-x-auto no-scrollbar items-center gap-2 pb-0.5 sm:pb-0">
          <button
            type="button"
            onClick={onOpenLiveInbox}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-100 hover:bg-white/10 transition cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 text-rose-400" />
            <span>AI Text</span>
          </button>

          {onOpenPopTrivia && (
            <button
              type="button"
              onClick={onOpenPopTrivia}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-100 hover:bg-white/10 transition cursor-pointer"
            >
              <Award className="h-4 w-4 text-amber-300" />
              <span>Quiz</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenFieldGuide}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-100 hover:bg-white/10 transition cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-amber-200" />
            <span>Field Guide</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'journal' ? 'game' : 'journal')}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'journal'
                ? 'border-amber-300/60 bg-amber-300 text-slate-950'
                : 'border-white/12 bg-white/5 text-slate-100 hover:bg-white/10'
            }`}
          >
            <Newspaper className="h-4 w-4" />
            <span>Dating Guides</span>
          </button>

          <button
            type="button"
            onClick={onOpenBoutique}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-sm hover:brightness-105 transition cursor-pointer"
          >
            {wallet.isFounderUnlimited ? (
              <Wrench className="h-4 w-4" />
            ) : wallet.isVip ? (
              <Crown className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>
              {wallet.isFounderUnlimited
                ? '∞ Founder VIP'
                : wallet.isVip
                  ? `VIP • ${wallet.credits} Cr`
                  : `${wallet.credits} Credits`}
            </span>
            <ShoppingBag className="h-3.5 w-3.5 ml-0.5" />
          </button>

          {liveTipUrl ? (
            <a
              href={liveTipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/15 px-3 py-2 text-xs sm:text-sm font-semibold text-rose-200 hover:bg-rose-500/25 transition"
              title="Buy the creator an Espresso Martini"
            >
              <Coffee className="h-4 w-4" />
              <span className="hidden lg:inline">Tip Martini</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={onOpenBoutique}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/15 px-3 py-2 text-xs sm:text-sm font-semibold text-rose-200 hover:bg-rose-500/25 transition cursor-pointer"
              title="Open Creator Tip Jar & VIP Lounge"
            >
              <Coffee className="h-4 w-4" />
              <span className="hidden lg:inline">Tip Martini</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMuted(toggleSoundMute())}
            className="shrink-0 inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 p-2 text-slate-200 hover:bg-white/10 transition cursor-pointer"
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
            title={muted ? 'Unmute game sound effects' : 'Mute game sound effects'}
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-rose-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-amber-300" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
