import React, { useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Crown,
  Flame,
  Gamepad2,
  MessageCircle,
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
  activeTab: 'game' | 'world' | 'journal' | 'inbox' | 'academy' | 'courtroom';
  activePhase?: 'mixer' | 'swipes' | 'episodes' | 'outcome' | 'audition';
  levelBadge?: string;
  onSelectTab: (tab: 'game' | 'world' | 'journal' | 'inbox' | 'academy' | 'courtroom') => void;
  onOpenSwipeDeck?: () => void;
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
  activePhase = 'mixer',
  levelBadge,
  onSelectTab,
  onOpenSwipeDeck,
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
    <header className="sticky top-0 z-30 border-b border-[#18101E]/10 bg-white/95 backdrop-blur-md">
      {/* Strictly locked to max-w-7xl px-4 sm:px-6 so left & right edges align pixel-for-pixel with <main> and <footer> */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-2.5 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
        {/* Brand Identity + Level Pill */}
        <div className="flex shrink-0 items-center justify-between xl:justify-start gap-2">
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex shrink-0 items-center gap-2 text-left cursor-pointer"
          >
            <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FD267A] to-[#FF6036] text-base text-white group-hover:scale-105 transition">
              🐆
            </span>
            <span className="font-display text-base sm:text-[17px] whitespace-nowrap text-[#18101E] group-hover:text-[#E11D48] transition-colors">
              {BRAND_CONFIG.name}
            </span>
          </button>

          {levelBadge && (
            <span className="inline-flex h-6 items-center rounded-full bg-[#FEF3C7] border border-[#F59E0B]/40 px-2 text-[11px] font-extrabold text-[#92400E] whitespace-nowrap">
              {levelBadge}
            </span>
          )}
        </div>

        {/* Pixel-Aligned Single-Row Navigation: 4 Play Modes + Quizzes/Guides + Wallet + Clean Flat Audio Icons */}
        <nav className="flex w-full xl:w-auto xl:ml-auto overflow-x-auto no-scrollbar items-center justify-start gap-1 pb-0.5 xl:pb-0">
          <button
            type="button"
            onClick={onGoHome}
            className={`shrink-0 whitespace-nowrap inline-flex h-8 items-center justify-center gap-1 rounded-full border px-2 text-[11px] font-bold transition cursor-pointer ${
              activeTab === 'game' && activePhase === 'mixer'
                ? 'border-[#18101E] bg-[#18101E] text-white'
                : 'border-slate-200 bg-white text-[#18101E] hover:bg-slate-50'
            }`}
          >
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span>Roster</span>
          </button>

          {onOpenSwipeDeck && (
            <button
              type="button"
              onClick={onOpenSwipeDeck}
              title="Open Tinder Swipe Deck"
              className={`shrink-0 whitespace-nowrap inline-flex h-8 items-center justify-center gap-1 rounded-full border px-2 text-[11px] font-bold transition cursor-pointer ${
                activeTab === 'game' && activePhase === 'swipes'
                  ? 'border-transparent bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-white'
                  : 'border-[#FECDD3] bg-[#FFF1F2] text-[#E11D48] hover:bg-[#FFE4E6]'
              }`}
            >
              <Flame className="h-3.5 w-3.5 shrink-0 fill-current" />
              <span>Swipe</span>
            </button>
          )}

          <button
            type="button"
            title="Live AI Chat on Tinder, iMessage & Discord"
            onClick={() => (activeTab === 'inbox' ? onSelectTab('game') : onOpenLiveInbox())}
            className={`shrink-0 whitespace-nowrap inline-flex h-8 items-center justify-center gap-1 rounded-full border px-1.5 text-[11px] font-bold transition cursor-pointer ${
              activeTab === 'inbox'
                ? 'border-transparent bg-[#007AFF] text-white'
                : 'border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#DBEAFE]'
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Live Chat</span>
          </button>

          <button
            type="button"
            title="2D PixiJS Cub Obedience Sim, Apartment Scanner & Dateodex"
            onClick={() => onSelectTab(activeTab === 'academy' ? 'game' : 'academy')}
            className={`shrink-0 whitespace-nowrap inline-flex h-8 items-center justify-center gap-1 rounded-full border px-1.5 text-[11px] font-bold transition cursor-pointer ${
              activeTab === 'academy'
                ? 'border-transparent bg-[#7C3AED] text-white'
                : 'border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9] hover:bg-[#EDE9FE]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Cub Sim</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'world' ? 'game' : 'world')}
            className={`shrink-0 whitespace-nowrap inline-flex h-8 items-center justify-center gap-1 rounded-full border px-1.5 text-[11px] font-bold transition cursor-pointer ${
              activeTab === 'world'
                ? 'border-transparent bg-[#059669] text-white'
                : 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46] hover:bg-[#D1FAE5]'
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">8-Bit World</span>
          </button>

          {onOpenPopTrivia && (
            <button
              type="button"
              onClick={onOpenPopTrivia}
              title="Pop-Culture Cougar & Cub Quiz (+3 Cr)"
              className="shrink-0 whitespace-nowrap inline-flex h-8 items-center justify-center gap-1 rounded-full border border-[#FDE68A] bg-[#FFFBEB] hover:bg-[#FEF3C7] px-1.5 text-[11px] font-bold text-[#92400E] transition cursor-pointer"
            >
              <Award className="h-3.5 w-3.5 text-[#D97706] shrink-0" />
              <span className="whitespace-nowrap">Quiz</span>
              <span className="rounded-full bg-[#FDE68A] px-1.5 py-0.2 text-[10px] font-extrabold text-[#78350F] whitespace-nowrap">
                +3 Cr
              </span>
            </button>
          )}

          {onOpenChecklist && (
            <button
              type="button"
              onClick={onOpenChecklist}
              title="25-Point Viral Age-Gap Score Test (+2 Cr)"
              className="shrink-0 whitespace-nowrap inline-flex h-8 items-center justify-center gap-1 rounded-full border border-slate-200 bg-white hover:bg-[#FFF1F2] px-1.5 text-[11px] font-bold text-[#18101E] transition cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#E11D48] shrink-0" />
              <span className="whitespace-nowrap">25-Pt</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenFieldGuide}
            className="shrink-0 whitespace-nowrap inline-flex h-8 items-center justify-center gap-1 rounded-full border border-slate-200 bg-white px-1.5 text-[11px] font-bold text-[#18101E] hover:bg-slate-50 transition cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#E11D48] shrink-0" />
            <span>Field Guide</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'journal' ? 'game' : 'journal')}
            className={`shrink-0 whitespace-nowrap inline-flex h-8 items-center justify-center gap-1 rounded-full border px-1.5 text-[11px] font-bold transition cursor-pointer ${
              activeTab === 'journal'
                ? 'border-[#18101E] bg-[#18101E] text-white'
                : 'border-slate-200 bg-white text-[#18101E] hover:bg-slate-50'
            }`}
          >
            <Newspaper className="h-3.5 w-3.5 shrink-0" />
            <span>Dating Guides</span>
          </button>

          <button
            type="button"
            onClick={onOpenBoutique}
            className="shrink-0 whitespace-nowrap inline-flex h-8 items-center justify-center gap-1 rounded-full bg-[#18101E] hover:bg-[#2E1F38] px-2.5 text-[11px] font-bold text-white transition cursor-pointer"
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

          {/* Clean Flat Audio Buttons (Zero leftover comic shadow!) */}
          <button
            type="button"
            onClick={() => {
              const playing = toggleLoungeMusic();
              setBgmOn(playing);
              if (playing) setMuted(false);
            }}
            className={`shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border transition cursor-pointer ${
              bgmOn
                ? 'border-[#E11D48] bg-[#E11D48] text-white'
                : 'border-slate-200 bg-slate-50 text-[#475569] hover:bg-slate-100 hover:text-[#18101E]'
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
            className={`shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border transition cursor-pointer ${
              muted
                ? 'border-[#FECDD3] bg-[#FFF1F2] text-[#E11D48]'
                : 'border-slate-200 bg-slate-50 text-[#475569] hover:bg-slate-100 hover:text-[#18101E]'
            }`}
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
            title={muted ? 'Unmute game sound effects' : 'Mute game sound effects'}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
        </nav>
      </div>
    </header>
  );
};
