import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  ChevronDown,
  Coffee,
  Crown,
  Flame,
  Gamepad2,
  Info,
  Menu,
  MessageCircle,
  Music,
  Newspaper,
  ShoppingBag,
  Sparkles,
  Volume2,
  VolumeX,
  Wrench,
  X,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { MONETIZATION_CONFIG } from '../config/monetization';
import type { WalletState } from '../domain/economy';
import { trackEvent } from '../lib/analytics';
import {
  isLoungeMusicPlaying,
  isSoundMuted,
  toggleLoungeMusic,
  toggleSoundMute,
} from '../lib/sound';

export type ClubTopTab =
  | 'game'
  | 'world'
  | 'journal'
  | 'inbox'
  | 'academy'
  | 'courtroom'
  | 'about';

interface TopHudBarProps {
  wallet: WalletState;
  activeTab: ClubTopTab;
  activePhase?: 'mixer' | 'swipes' | 'episodes' | 'outcome' | 'audition';
  levelBadge?: string;
  onSelectTab: (tab: ClubTopTab) => void;
  onOpenSwipeDeck?: () => void;
  onOpenFieldGuide: () => void;
  onOpenBoutique: (initialTab?: 'shop' | 'vip' | 'waitlist') => void;
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
  const [loreOpen, setLoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loreRef = useRef<HTMLDivElement | null>(null);
  const tapCountRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!loreOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (loreRef.current && !loreRef.current.contains(e.target as Node)) {
        setLoreOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [loreOpen]);

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
    setMobileMenuOpen(false);
    onGoHome();
  };

  const liveTipUrl = MONETIZATION_CONFIG.tipJarUrl || MONETIZATION_CONFIG.kofiUrl;

  return (
    <header className="sticky top-0 z-40 border-b border-[#18101E]/12 bg-white/95 backdrop-blur-md">
      {/* Balanced 3-Zone Header: Left Brand • Center Play & Lore Nav • Right Shop/Tip/Credits/Audio */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* ZONE 1: Brand Identity + Level Pill */}
        <div className="flex shrink-0 items-center gap-2">
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
            <span className="hidden sm:inline-flex h-6 items-center rounded-full bg-[#FEF3C7] border border-[#F59E0B]/40 px-2 text-[11px] font-extrabold text-[#92400E] whitespace-nowrap">
              {levelBadge}
            </span>
          )}
        </div>

        {/* ZONE 2: Balanced Center Navigation (Desktop) */}
        <nav
          aria-label="Primary Club Navigation"
          className="hidden lg:flex items-center justify-center gap-1.5"
        >
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'game' && activePhase === 'mixer' && onOpenSwipeDeck) {
                onOpenSwipeDeck();
              } else {
                onGoHome();
              }
            }}
            className={`inline-flex h-8.5 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'game' && (activePhase === 'mixer' || activePhase === 'swipes')
                ? 'border-transparent bg-gradient-to-r from-[#FD267A] to-[#FF6036] text-white shadow-2xs'
                : 'border-[#FECDD3] bg-[#FFF1F2] text-[#E11D48] hover:bg-[#FFE4E6]'
            }`}
          >
            <Flame className="h-3.5 w-3.5 shrink-0 fill-current" />
            <span>Swipe</span>
          </button>

          <button
            type="button"
            onClick={() => (activeTab === 'inbox' ? onSelectTab('game') : onOpenLiveInbox())}
            className={`inline-flex h-8.5 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'inbox'
                ? 'border-transparent bg-[#007AFF] text-white'
                : 'border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#DBEAFE]'
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Chats</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'world' ? 'game' : 'world')}
            className={`inline-flex h-8.5 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'world'
                ? 'border-transparent bg-[#059669] text-white'
                : 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46] hover:bg-[#D1FAE5]'
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5 shrink-0" />
            <span>Club Map</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'academy' ? 'game' : 'academy')}
            className={`inline-flex h-8.5 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'academy'
                ? 'border-transparent bg-[#7C3AED] text-white'
                : 'border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9] hover:bg-[#EDE9FE]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Obedience</span>
          </button>

          {/* Grouped Lore & Quizzes Popover */}
          <div ref={loreRef} className="relative">
            <button
              type="button"
              onClick={() => setLoreOpen((v) => !v)}
              aria-expanded={loreOpen}
              className={`inline-flex h-8.5 items-center justify-center gap-1 rounded-full border px-3 text-xs font-extrabold transition cursor-pointer ${
                loreOpen || activeTab === 'journal' || activeTab === 'courtroom'
                  ? 'border-[#18101E] bg-[#18101E] text-white'
                  : 'border-slate-200 bg-white text-[#18101E] hover:bg-slate-50'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />
              <span>Lore &amp; Quizzes</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${loreOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {loreOpen && (
              <div
                role="menu"
                className="absolute left-0 mt-2 w-64 rounded-2xl border-2 border-[#18101E] bg-white p-2 shadow-[4px_4px_0px_#18101E] space-y-1 z-50"
              >
                {onOpenPopTrivia && (
                  <button
                    type="button"
                    onClick={() => {
                      setLoreOpen(false);
                      onOpenPopTrivia();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-extrabold text-[#18101E] hover:bg-[#FFFBEB] cursor-pointer"
                  >
                    <Award className="h-4 w-4 text-[#D97706] shrink-0" />
                    <span>Pop-Culture Quiz (20 Qs)</span>
                  </button>
                )}

                {onOpenChecklist && (
                  <button
                    type="button"
                    onClick={() => {
                      setLoreOpen(false);
                      onOpenChecklist();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-extrabold text-[#18101E] hover:bg-[#FFF1F2] cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-[#E11D48] shrink-0" />
                    <span>Have You Ever? 25-Pt Test</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setLoreOpen(false);
                    onSelectTab('courtroom');
                  }}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-extrabold text-[#18101E] hover:bg-[#FEF3C7] cursor-pointer"
                >
                  <Crown className="h-4 w-4 text-[#D97706] shrink-0" />
                  <span>Crown / Dump Courtroom</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoreOpen(false);
                    onOpenFieldGuide();
                  }}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-extrabold text-[#18101E] hover:bg-slate-50 cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 text-[#E11D48] shrink-0" />
                  <span>Field Guide &amp; Icons</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoreOpen(false);
                    onSelectTab('journal');
                  }}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-extrabold text-[#18101E] hover:bg-slate-50 cursor-pointer"
                >
                  <Newspaper className="h-4 w-4 text-[#059669] shrink-0" />
                  <span>Club Guides &amp; 12-Sign Matcher</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'about' ? 'game' : 'about')}
            className={`inline-flex h-8.5 items-center justify-center gap-1 rounded-full border px-3 text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'about'
                ? 'border-[#18101E] bg-[#18101E] text-white'
                : 'border-slate-200 bg-white text-[#18101E] hover:bg-slate-50'
            }`}
          >
            <Info className="h-3.5 w-3.5 shrink-0 text-[#64748B]" />
            <span>About</span>
          </button>
        </nav>

        {/* ZONE 3: Right Shop, Tip $5, Credits / VIP & Audio Controls */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpenBoutique('shop')}
            className="inline-flex h-8.5 items-center justify-center gap-1 rounded-full border border-[#F59E0B]/45 bg-[#FFFBEB] hover:bg-[#FEF3C7] px-2.5 text-xs font-extrabold text-[#92400E] transition cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#E11D48] shrink-0" />
            <span>Shop</span>
          </button>

          {liveTipUrl ? (
            <a
              href={liveTipUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('tip_jar_clicked', { surface: 'top_hud' })}
              className="hidden sm:inline-flex h-8.5 items-center justify-center gap-1 rounded-full border border-[#FECDD3] bg-[#FFF1F2] hover:bg-[#FFE4E6] px-2.5 text-xs font-extrabold text-[#BE123C] transition"
            >
              <Coffee className="h-3.5 w-3.5 shrink-0" />
              <span>Tip $5</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => {
                trackEvent('tip_jar_clicked', { surface: 'top_hud_modal' });
                onOpenBoutique('vip');
              }}
              className="hidden sm:inline-flex h-8.5 items-center justify-center gap-1 rounded-full border border-[#FECDD3] bg-[#FFF1F2] hover:bg-[#FFE4E6] px-2.5 text-xs font-extrabold text-[#BE123C] transition cursor-pointer"
            >
              <Coffee className="h-3.5 w-3.5 shrink-0" />
              <span>Tip $5</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenBoutique('vip')}
            className="inline-flex h-8.5 items-center justify-center gap-1 rounded-full bg-[#18101E] hover:bg-[#2E1F38] px-3 text-xs font-extrabold text-white transition cursor-pointer"
          >
            {wallet.isFounderUnlimited ? (
              <Wrench className="h-3.5 w-3.5 text-[#FBBF24] shrink-0" />
            ) : (
              <Crown className="h-3.5 w-3.5 text-[#FBBF24] shrink-0" />
            )}
            <span className="whitespace-nowrap">
              {wallet.isFounderUnlimited
                ? 'Founder'
                : wallet.isVip
                  ? `VIP • ${wallet.credits} Cr`
                  : `${wallet.credits} Cr`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              const playing = toggleLoungeMusic();
              setBgmOn(playing);
              if (playing) setMuted(false);
            }}
            className={`hidden sm:inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border transition cursor-pointer ${
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
            className={`hidden sm:inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border transition cursor-pointer ${
              muted
                ? 'border-[#FECDD3] bg-[#FFF1F2] text-[#E11D48]'
                : 'border-slate-200 bg-slate-50 text-[#475569] hover:bg-slate-100 hover:text-[#18101E]'
            }`}
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
            title={muted ? 'Unmute game sound effects' : 'Mute game sound effects'}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          {/* Mobile Drawer Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle Club Navigation Menu"
            className="lg:hidden inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-slate-200 bg-white text-[#18101E] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer (< lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#18101E]/10 bg-white px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onGoHome();
              }}
              className="rounded-xl border border-[#FECDD3] bg-[#FFF1F2] px-3 py-2 text-left text-[#E11D48]"
            >
              🔥 Phone &amp; Swipe
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLiveInbox();
              }}
              className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-left text-[#1D4ED8]"
            >
              💬 Live Chats
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('world');
              }}
              className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-2 text-left text-[#065F46]"
            >
              🗺️ 8-Bit Club Map
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('academy');
              }}
              className="rounded-xl border border-[#DDD6FE] bg-[#F5F3FF] px-3 py-2 text-left text-[#6D28D9]"
            >
              🦮 Cub Obedience
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('journal');
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-[#18101E]"
            >
              📖 Club Guides
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('about');
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-[#18101E]"
            >
              ℹ️ About the Club
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {onOpenPopTrivia && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPopTrivia();
                }}
                className="rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-3 py-1 text-xs font-bold text-[#92400E]"
              >
                🎬 Pop Quiz
              </button>
            )}
            {onOpenChecklist && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChecklist();
                }}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-[#18101E]"
              >
                🔥 Have You Ever? 25-Pt
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFieldGuide();
              }}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-[#18101E]"
            >
              📚 Field Guide
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
