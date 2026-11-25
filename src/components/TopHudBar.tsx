import React, { useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Crown,
  Flame,
  Gamepad2,
  Music,
  Newspaper,
  ShoppingBag,
  Sparkles,
  Users,
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
  onOpenChecklist?: () => void;
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
  onOpenPopTrivia,
  onOpenChecklist,
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
    <header className="sticky top-0 z-30 border-b border-[#18101E]/10 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-2 px-3 py-2 sm:px-5 xl:flex-row xl:items-center xl:justify-between">
        {/* Brand Identity + Level Pill */}
        <div className="flex shrink-0 items-center justify-between xl:justify-start gap-2">
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex shrink-0 items-center gap-2 text-left cursor-pointer"
          >
            <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#E11D48] to-[#FB7185] text-base text-white shadow-xs group-hover:scale-105 transition">
              🐆
            </span>
            <span className="font-display text-base sm:text-lg whitespace-nowrap text-[#18101E] group-hover:text-[#E11D48] transition-colors">
              {BRAND_CONFIG.name}
            </span>
          </button>

          {levelBadge && (
            <span className="inline-flex h-6 items-center rounded-full bg-[#FEF3C7] border border-[#F59E0B]/40 px-2 text-[11px] font-extrabold text-[#92400E] whitespace-nowrap">
              {levelBadge}
            </span>
          )}
        </div>

        {/* Unified Top Navigation Bar: Roster, Live Chat, Pop Quiz (+3 Cr), 25-Pt Test, 8-Bit World, Guides & Wallet */}
        <nav className="flex w-full xl:w-auto xl:ml-auto overflow-x-auto no-scrollbar items-center justify-start gap-1 pb-0.5 xl:pb-0">
          <button
            type="button"
            onClick={onGoHome}
            className={`pop-btn shrink-0 whitespace-nowrap inline-flex h-8.5 items-center justify-center gap-1 rounded-full px-2.5 text-xs font-bold cursor-pointer ${
              activeTab === 'game'
                ? 'bg-[#18101E] text-white'
                : 'bg-white text-[#18101E] hover:bg-[#F8FAFC]'
            }`}
          >
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span>The Roster</span>
          </button>

          <button
            type="button"
            title="Live AI Chat on Tinder, iMessage & Discord"
            onClick={() => (activeTab === 'inbox' ? onSelectTab('game') : onOpenLiveInbox())}
            className={`pop-btn shrink-0 whitespace-nowrap inline-flex h-8.5 items-center justify-center gap-1 rounded-full px-2.5 text-xs font-bold cursor-pointer ${
              activeTab === 'inbox'
                ? 'bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-white border-transparent'
                : 'bg-[#FFF1F2] text-[#BE123C] hover:bg-[#FFE4E6]'
            }`}
          >
            <Flame className="h-3.5 w-3.5 shrink-0" />
            <span>Live Chat</span>
          </button>

          {onOpenPopTrivia && (
            <button
              type="button"
              onClick={onOpenPopTrivia}
              className="pop-btn shrink-0 whitespace-nowrap inline-flex h-8.5 items-center justify-center gap-1 rounded-full bg-[#FFFBEB] hover:bg-[#FEF3C7] px-2.5 text-xs font-bold text-[#92400E] cursor-pointer"
            >
              <Award className="h-3.5 w-3.5 text-[#D97706] shrink-0" />
              <span className="whitespace-nowrap">Pop Quiz</span>
              <span className="rounded-full bg-[#FDE68A] px-1.5 py-0.2 text-[10px] font-extrabold text-[#78350F] whitespace-nowrap">
                +3 Cr
              </span>
            </button>
          )}

          {onOpenChecklist && (
            <button
              type="button"
              onClick={onOpenChecklist}
              className="pop-btn shrink-0 whitespace-nowrap inline-flex h-8.5 items-center justify-center gap-1 rounded-full bg-white hover:bg-[#FFF1F2] px-2.5 text-xs font-bold text-[#18101E] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#E11D48] shrink-0" />
              <span className="whitespace-nowrap">25-Pt Test</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'world' ? 'game' : 'world')}
            className={`pop-btn shrink-0 whitespace-nowrap inline-flex h-8.5 items-center justify-center gap-1 rounded-full px-2.5 text-xs font-bold cursor-pointer ${
              activeTab === 'world'
                ? 'bg-[#059669] text-white border-transparent'
                : 'bg-[#ECFDF5] text-[#065F46] hover:bg-[#D1FAE5]'
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">8-Bit World</span>
          </button>

          <button
            type="button"
            onClick={onOpenFieldGuide}
            className="pop-btn shrink-0 whitespace-nowrap inline-flex h-8.5 items-center justify-center gap-1 rounded-full bg-white px-2.5 text-xs font-bold text-[#18101E] hover:bg-[#F8FAFC] cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#E11D48] shrink-0" />
            <span>Field Guide</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'journal' ? 'game' : 'journal')}
            className={`pop-btn shrink-0 whitespace-nowrap inline-flex h-8.5 items-center justify-center gap-1 rounded-full px-2.5 text-xs font-bold cursor-pointer ${
              activeTab === 'journal'
                ? 'bg-[#18101E] text-white'
                : 'bg-white text-[#18101E] hover:bg-[#F8FAFC]'
            }`}
          >
            <Newspaper className="h-3.5 w-3.5 shrink-0" />
            <span>Dating Guides</span>
          </button>

          <button
            type="button"
            onClick={onOpenBoutique}
            className="pop-btn shrink-0 whitespace-nowrap inline-flex h-8.5 items-center justify-center gap-1 rounded-full bg-[#18101E] hover:bg-[#2E1F38] px-3 text-xs font-bold text-white cursor-pointer"
          >
            {wallet.isFounderUnlimited ? (
              <Wrench className="h-3.5 w-3.5 text-[#FBBF24] shrink-0" />
            ) : wallet.isVip ? (
              <Crown className="h-3.5 w-3.5 text-[#FBBF24] shrink-0" />
            ) : (
              <ShoppingBag className="h-3.5 w-3.5 text-[#FBBF24] shrink-0" />
            )}
            <span className="whitespace-nowrap">
              {wallet.isFounderUnlimited
                ? 'Founder Mode'
                : wallet.isVip
                  ? `VIP • ${wallet.credits} Cr`
                  : `${wallet.credits} Credits`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              const playing = toggleLoungeMusic();
              setBgmOn(playing);
              if (playing) setMuted(false);
            }}
            className={`pop-btn shrink-0 inline-flex h-8.5 w-8.5 items-center justify-center rounded-full cursor-pointer ${
              bgmOn ? 'bg-[#E11D48] text-white' : 'bg-white text-[#18101E] hover:bg-[#F8FAFC]'
            }`}
            aria-label={bgmOn ? 'Pause lounge soundtrack' : 'Play lounge soundtrack'}
            title="Toggle Cocktail Lounge Soundtrack"
          >
            <Music className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              const nextMuted = toggleSoundMute();
              setMuted(nextMuted);
              if (nextMuted) setBgmOn(false);
            }}
            className="pop-btn shrink-0 inline-flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white text-[#18101E] hover:bg-[#F8FAFC] cursor-pointer"
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
            title={muted ? 'Unmute game sound effects' : 'Mute game sound effects'}
          >
            {muted ? (
              <VolumeX className="h-3.5 w-3.5 text-[#E11D48]" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-[#18101E]" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
