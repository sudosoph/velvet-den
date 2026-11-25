import React, { useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Crown,
  MessageCircle,
  Music,
  Newspaper,
  ShoppingBag,
  Sparkles,
  Volume2,
  VolumeX,
  Wrench,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import type { WalletState } from '../domain/economy';
import {
  isLoungeMusicPlaying,
  isSoundMuted,
  toggleLoungeMusic,
  toggleSoundMute,
} from '../lib/sound';

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
  const [bgmOn, setBgmOn] = useState(() => isLoungeMusicPlaying());
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
    <header className="sticky top-0 z-30 border-b-[2.5px] border-[#1E1022] bg-[#FFFDF9]/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={handleLogoClick}
          className="group flex items-center gap-3 text-left cursor-pointer"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[#1E1022] bg-[#FF2E63] text-xl text-white shadow-[3px_3px_0px_#1E1022] group-hover:-translate-y-0.5 transition">
            🐆
          </span>
          <div>
            <div className="font-display text-xl sm:text-2xl text-[#1E1022] group-hover:text-[#FF2E63] transition-colors">
              {BRAND_CONFIG.name}
            </div>
            <div className="hidden xl:block text-xs font-semibold text-[#5A4664]">
              {BRAND_CONFIG.subtitle}
            </div>
          </div>
        </button>

        <nav className="flex w-full lg:w-auto overflow-x-auto no-scrollbar items-center gap-2 pb-0.5 lg:pb-0">
          <button
            type="button"
            onClick={onOpenLiveInbox}
            className="pop-btn shrink-0 inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-3.5 text-sm font-bold text-[#1E1022] hover:bg-[#FFF4F7] cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 text-[#FF2E63]" />
            <span>AI Text</span>
          </button>

          {onOpenPopTrivia && (
            <button
              type="button"
              onClick={onOpenPopTrivia}
              className="pop-btn shrink-0 inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-3.5 text-sm font-bold text-[#1E1022] hover:bg-[#FFF4F7] cursor-pointer"
            >
              <Award className="h-4 w-4 text-[#FF2E63]" />
              <span>Quiz</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenFieldGuide}
            className="pop-btn shrink-0 inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-3.5 text-sm font-bold text-[#1E1022] hover:bg-[#FFF4F7] cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-[#FF2E63]" />
            <span>Field Guide</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'journal' ? 'game' : 'journal')}
            className={`pop-btn shrink-0 inline-flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-sm font-bold cursor-pointer ${
              activeTab === 'journal'
                ? 'bg-[#FF2E63] text-white'
                : 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]'
            }`}
          >
            <Newspaper className="h-4 w-4" />
            <span>Dating Guides</span>
          </button>

          <button
            type="button"
            onClick={onOpenBoutique}
            className="pop-btn shrink-0 inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#FFBE0B] hover:bg-[#FFD166] px-4 text-sm font-extrabold text-[#1E1022] cursor-pointer"
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
            onClick={() => {
              const playing = toggleLoungeMusic();
              setBgmOn(playing);
              if (playing) setMuted(false);
            }}
            className={`pop-btn shrink-0 inline-flex h-10 items-center gap-1 rounded-xl px-3 text-sm font-bold cursor-pointer ${
              bgmOn
                ? 'bg-[#FF2E63] text-white'
                : 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]'
            }`}
            aria-label={bgmOn ? 'Pause lounge soundtrack' : 'Play lounge soundtrack'}
            title="Toggle Cocktail Lounge Soundtrack"
          >
            <Music className="h-4 w-4" />
            <span className="hidden md:inline">{bgmOn ? 'BGM On' : 'BGM'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const nextMuted = toggleSoundMute();
              setMuted(nextMuted);
              if (nextMuted) setBgmOn(false);
            }}
            className="pop-btn shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1E1022] hover:bg-[#FFF4F7] cursor-pointer"
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
            title={muted ? 'Unmute game sound effects' : 'Mute game sound effects'}
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-[#FF2E63]" />
            ) : (
              <Volume2 className="h-4 w-4 text-[#1E1022]" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
