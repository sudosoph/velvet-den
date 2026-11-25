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
    <header className="sticky top-0 z-30 border-b-3 border-black bg-[#12091c]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-6">
        <button
          type="button"
          onClick={handleLogoClick}
          className="group flex items-center gap-2.5 text-left cursor-pointer"
          title="Home (Tip: Click 5x to toggle Founder Unlimited Test Mode)"
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

        <nav className="flex w-full sm:w-auto overflow-x-auto no-scrollbar items-center gap-1.5 sm:gap-2 pb-0.5 sm:pb-0">
          <button
            type="button"
            onClick={onOpenLiveInbox}
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-[#1c2b3a] px-2.5 py-1.5 text-xs font-extrabold text-amber-300 hover:bg-[#25394d] cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5 text-teal-300" />
            <span>AI Text</span>
          </button>

          {onOpenPopTrivia && (
            <button
              type="button"
              onClick={onOpenPopTrivia}
              className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-[#2a1237] px-2.5 py-1.5 text-xs font-extrabold text-pink-200 hover:bg-[#381849] cursor-pointer"
            >
              <Award className="h-3.5 w-3.5 text-amber-300" />
              <span>Quiz</span>
            </button>
          )}

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
            {wallet.isFounderUnlimited ? (
              <Wrench className="h-3.5 w-3.5" />
            ) : wallet.isVip ? (
              <Crown className="h-3.5 w-3.5" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
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
              className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-pink-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#09050f] hover:bg-pink-500"
              title="Buy the creator an Espresso Martini"
            >
              <Coffee className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Tip Martini</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={onOpenBoutique}
              className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-pink-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#09050f] hover:bg-pink-500 cursor-pointer"
              title="Open Creator Tip Jar & VIP Lounge"
            >
              <Coffee className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Tip Martini</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMuted(toggleSoundMute())}
            className="inline-flex items-center justify-center rounded-lg border-2 border-black bg-slate-800 p-1.5 text-slate-200 hover:bg-slate-700 cursor-pointer"
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
            title={muted ? 'Unmute game sound effects' : 'Mute game sound effects'}
          >
            {muted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-teal-300" />}
          </button>
        </nav>
      </div>
    </header>
  );
};
