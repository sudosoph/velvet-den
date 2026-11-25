import React, { useRef, useState } from 'react';
import {
  BookOpen,
  Crown,
  Flame,
  Gamepad2,
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
  activeTab: 'game' | 'world' | 'journal' | 'inbox';
  levelBadge?: string;
  onSelectTab: (tab: 'game' | 'world' | 'journal' | 'inbox') => void;
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
  levelBadge,
  onSelectTab,
  onOpenFieldGuide,
  onOpenBoutique,
  onOpenLiveInbox,
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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2.5 px-4 py-2.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex shrink-0 items-center justify-between lg:justify-start gap-2.5">
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex shrink-0 items-center gap-2 text-left cursor-pointer"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#1E1022] bg-[#FF2E63] text-lg text-white shadow-[3px_3px_0px_#1E1022] group-hover:-translate-y-0.5 transition">
              🐆
            </span>
            <span className="font-display text-lg sm:text-xl whitespace-nowrap text-[#1E1022] group-hover:text-[#FF2E63] transition-colors">
              {BRAND_CONFIG.name}
            </span>
          </button>

          {levelBadge && (
            <span className="font-pixel inline-flex h-7 items-center rounded-lg border-2 border-[#1E1022] bg-[#FFBE0B] px-2 text-[11px] font-bold text-[#1E1022] shadow-[2px_2px_0px_#1E1022]">
              {levelBadge}
            </span>
          )}
        </div>

        <nav className="flex w-full lg:w-auto overflow-x-auto no-scrollbar items-center lg:justify-end gap-2 pb-0.5 lg:pb-0">
          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'world' ? 'game' : 'world')}
            className={`pop-btn shrink-0 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-sm cursor-pointer ${
              activeTab === 'world'
                ? 'bg-[#FF2E63] text-white'
                : 'bg-[#ECFDF5] text-[#065F46] hover:bg-[#D1FAE5]'
            }`}
          >
            <Gamepad2 className="h-4 w-4" />
            <span>8-Bit World</span>
          </button>

          <button
            type="button"
            title="Live AI Chat on Tinder, iMessage & Discord"
            onClick={() =>
              activeTab === 'inbox' ? onSelectTab('game') : onOpenLiveInbox()
            }
            className={`pop-btn shrink-0 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-sm cursor-pointer ${
              activeTab === 'inbox'
                ? 'bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-white'
                : 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]'
            }`}
          >
            <Flame
              className={`h-4 w-4 ${activeTab === 'inbox' ? 'text-white' : 'text-[#FD267A]'}`}
            />
            <span>Live Chat</span>
          </button>

          <button
            type="button"
            onClick={onOpenFieldGuide}
            className="pop-btn shrink-0 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white px-3 text-sm text-[#1E1022] hover:bg-[#FFF4F7] cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-[#FF2E63]" />
            <span>Field Guide</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'journal' ? 'game' : 'journal')}
            className={`pop-btn shrink-0 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-sm cursor-pointer ${
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
            className="pop-btn shrink-0 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#FFBE0B] hover:bg-[#FFD166] px-3.5 text-sm text-[#1E1022] cursor-pointer"
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
            <ShoppingBag className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              const playing = toggleLoungeMusic();
              setBgmOn(playing);
              if (playing) setMuted(false);
            }}
            className={`pop-btn shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl cursor-pointer ${
              bgmOn
                ? 'bg-[#FF2E63] text-white'
                : 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]'
            }`}
            aria-label={bgmOn ? 'Pause lounge soundtrack' : 'Play lounge soundtrack'}
            title="Toggle Cocktail Lounge Soundtrack"
          >
            <Music className="h-4 w-4" />
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
