import React, { useRef, useState } from 'react';
import {
  Award,
  BookOpen,
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
  onRequestFounderModal?: () => void;
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
  onRequestFounderModal,
  onGoHome,
}) => {
  const [muted, setMuted] = useState(() => isSoundMuted());
  const tapCountRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);

  const handleLogoClick = () => {
    tapCountRef.current += 1;
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => {
      tapCountRef.current = 0;
    }, 2200);

    if (tapCountRef.current >= 5 && onRequestFounderModal) {
      tapCountRef.current = 0;
      onRequestFounderModal();
      return;
    }
    onGoHome();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0C0910]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={handleLogoClick}
          className="group flex items-center gap-3 text-left cursor-pointer"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-[#E5C17B] text-xl shadow-md">
            🐆
          </span>
          <div>
            <div className="font-display text-xl sm:text-[22px] text-[#FAF7F5] group-hover:text-[#FDE68A] transition-colors">
              {BRAND_CONFIG.name}
            </div>
            <div className="hidden md:block text-xs text-stone-400">
              {BRAND_CONFIG.subtitle}
            </div>
          </div>
        </button>

        <nav className="flex w-full sm:w-auto overflow-x-auto no-scrollbar items-center gap-1.5 sm:gap-2 pb-0.5 sm:pb-0">
          <button
            type="button"
            onClick={onOpenLiveInbox}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-stone-300 hover:bg-white/[0.06] hover:text-[#FAF7F5] transition cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 text-rose-400" />
            <span>AI Text</span>
          </button>

          {onOpenPopTrivia && (
            <button
              type="button"
              onClick={onOpenPopTrivia}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-stone-300 hover:bg-white/[0.06] hover:text-[#FAF7F5] transition cursor-pointer"
            >
              <Award className="h-4 w-4 text-[#E5C17B]" />
              <span>Quiz</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenFieldGuide}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-stone-300 hover:bg-white/[0.06] hover:text-[#FAF7F5] transition cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-[#E5C17B]" />
            <span>Field Guide</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'journal' ? 'game' : 'journal')}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
              activeTab === 'journal'
                ? 'bg-white/10 text-[#FDE68A]'
                : 'text-stone-300 hover:bg-white/[0.06] hover:text-[#FAF7F5]'
            }`}
          >
            <Newspaper className="h-4 w-4" />
            <span>Dating Guides</span>
          </button>

          <button
            type="button"
            onClick={onOpenBoutique}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#E5C17B] hover:bg-[#F0CFA0] px-3.5 py-2 text-sm font-semibold text-[#0C0910] shadow-sm transition cursor-pointer"
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

          <button
            type="button"
            onClick={() => setMuted(toggleSoundMute())}
            className="shrink-0 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-2 text-stone-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
            title={muted ? 'Unmute game sound effects' : 'Mute game sound effects'}
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-rose-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-[#E5C17B]" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
