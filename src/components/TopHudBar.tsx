import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Camera,
  ChevronDown,
  Crown,
  Heart,
  Info,
  Menu,
  Newspaper,
  Send,
  ShoppingBag,
  Sparkles,
  User,
  Volume2,
  VolumeX,
  Wrench,
  X,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { MONETIZATION_CONFIG } from '../config/monetization';
import { POP_CULTURE_TRIVIA } from '../data/popCultureTrivia';
import type { WalletState } from '../domain/economy';
import { trackEvent } from '../lib/analytics';
import { isSoundMuted, toggleSoundMute } from '../lib/sound';
import type { BoutiqueSectionTab } from './BoutiqueAndVipModal';

export type ClubTopTab =
  | 'hinge'
  | 'wild'
  | 'chats'
  | 'school'
  | 'journal'
  | 'courtroom'
  | 'about';

interface TopHudBarProps {
  wallet: WalletState;
  activeTab: ClubTopTab;
  activeChatCount: number;
  onSelectTab: (tab: ClubTopTab) => void;
  onOpenPersonaModal: () => void;
  onOpenFieldGuide: () => void;
  onOpenDateodex: () => void;
  onOpenBoutique: (initialTab?: BoutiqueSectionTab) => void;
  onOpenPopTrivia: () => void;
  onOpenChecklist: () => void;
  onSendPartnerAudition: () => void;
  onResetHearts?: () => void;
  onRequestFounderModal?: () => void;
  onGoHome: () => void;
}

export const TopHudBar: React.FC<TopHudBarProps> = ({
  wallet,
  activeTab,
  activeChatCount,
  onSelectTab,
  onOpenPersonaModal,
  onOpenFieldGuide,
  onOpenDateodex,
  onOpenBoutique,
  onOpenPopTrivia,
  onOpenChecklist,
  onSendPartnerAudition,
  onRequestFounderModal,
  onGoHome,
}) => {
  const [muted, setMuted] = useState(() => isSoundMuted());
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const extrasRef = useRef<HTMLDivElement | null>(null);
  const tapCountRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!extrasOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (extrasRef.current && !extrasRef.current.contains(e.target as Node)) {
        setExtrasOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [extrasOpen]);

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
    <header className="sticky top-0 z-40 border-b border-stone-200/75 bg-[#FFFDF9]/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        {/* LEFT: Clean Brand Mark + Subtle Ghost Persona Trigger */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex shrink-0 items-center gap-2.5 text-left whitespace-nowrap cursor-pointer"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#18101E] text-sm text-white group-hover:bg-rose-700 transition-colors">
              🐆
            </span>
            <span className="font-editorial text-lg font-bold whitespace-nowrap text-[#18101E] group-hover:text-rose-700 transition-colors">
              {BRAND_CONFIG.name}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenPersonaModal}
            className="hidden sm:inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold whitespace-nowrap text-stone-500 hover:bg-stone-100 hover:text-[#18101E] transition cursor-pointer"
          >
            <User className="h-3.5 w-3.5 text-rose-600 shrink-0" />
            <span>{wallet.playerName ? wallet.playerName : 'Persona'}</span>
          </button>
        </div>

        {/* CENTER: One Unified Segmented Track (Zero Individual Pill Borders, Zero Wrapping) */}
        <nav
          aria-label="Primary Club Navigation"
          className="hidden lg:flex items-center gap-0.5 rounded-full bg-stone-100/95 p-1 shrink-0"
        >
          <button
            type="button"
            onClick={() => onSelectTab('hinge')}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'hinge'
                ? 'bg-[#18101E] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#18101E]'
            }`}
          >
            <span>📱 Hinge</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('wild')}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'wild'
                ? 'bg-[#18101E] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#18101E]'
            }`}
          >
            <span>🗺️ In The Wild</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('chats')}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'chats'
                ? 'bg-[#007AFF] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#18101E]'
            }`}
          >
            <span>💬 Chats &amp; Dates</span>
            {activeChatCount > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none font-extrabold ${
                  activeTab === 'chats'
                    ? 'bg-white text-[#007AFF]'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {activeChatCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('school')}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'school'
                ? 'bg-[#18101E] text-white shadow-xs'
                : 'text-stone-600 hover:text-[#18101E]'
            }`}
          >
            <span>🎓 Cub School</span>
          </button>

          <div ref={extrasRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setExtrasOpen((v) => !v)}
              aria-expanded={extrasOpen}
              className={`inline-flex shrink-0 items-center justify-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                extrasOpen ||
                activeTab === 'journal' ||
                activeTab === 'courtroom' ||
                activeTab === 'about'
                  ? 'bg-[#18101E] text-white shadow-xs'
                  : 'text-stone-600 hover:text-[#18101E]'
              }`}
            >
              <span>☰ Club Extras</span>
              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                  extrasOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {extrasOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-72 rounded-3xl border border-stone-200 bg-white p-2.5 shadow-xl space-y-1 z-50"
              >
                <button
                  type="button"
                  onClick={() => {
                    setExtrasOpen(false);
                    onOpenPopTrivia();
                  }}
                  className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-xs font-bold text-[#18101E] hover:bg-amber-50 cursor-pointer"
                >
                  <Award className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>🎬 {POP_CULTURE_TRIVIA.length}-Q Trailer &amp; Pop Quiz</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExtrasOpen(false);
                    onSelectTab('courtroom');
                  }}
                  className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-xs font-bold text-[#18101E] hover:bg-amber-50 cursor-pointer"
                >
                  <Crown className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>👑 Crown or Dump Courtroom</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExtrasOpen(false);
                    onOpenChecklist();
                  }}
                  className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-xs font-bold text-[#18101E] hover:bg-rose-50 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>✅ 25-Pt Experience Test</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExtrasOpen(false);
                    onSelectTab('journal');
                  }}
                  className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-xs font-bold text-[#18101E] hover:bg-stone-50 cursor-pointer"
                >
                  <Newspaper className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>📖 16 Guides &amp; Zodiac Matcher</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExtrasOpen(false);
                    onOpenDateodex();
                  }}
                  className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-xs font-bold text-[#18101E] hover:bg-stone-50 cursor-pointer"
                >
                  <Camera className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>📸 Dateodex &amp; Polaroids</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExtrasOpen(false);
                    onOpenFieldGuide();
                  }}
                  className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-xs font-bold text-[#18101E] hover:bg-stone-50 cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>📚 Age-Gap Field Guide</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExtrasOpen(false);
                    onSendPartnerAudition();
                  }}
                  className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-xs font-bold text-[#18101E] hover:bg-stone-50 cursor-pointer"
                >
                  <Send className="h-4 w-4 text-[#007AFF] shrink-0" />
                  <span>🤝 Send 60s Partner Audition</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExtrasOpen(false);
                    onSelectTab('about');
                  }}
                  className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-xs font-bold text-[#18101E] hover:bg-stone-50 cursor-pointer"
                >
                  <Info className="h-4 w-4 text-stone-500 shrink-0" />
                  <span>ℹ️ About Cougars &amp; Cubs Club</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT: Clean Ghost Actions + Single Primary Wallet Pill (Zero Double Emojis) */}
        <div className="flex shrink-0 items-center gap-1.5">
          {liveTipUrl && (
            <a
              href={liveTipUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Support This Project"
              onClick={() => trackEvent('tip_jar_clicked', { surface: 'top_hud' })}
              className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold whitespace-nowrap text-stone-700 hover:bg-amber-50 hover:text-amber-950 transition"
            >
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-600 shrink-0" />
              <span>Support</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => onOpenBoutique('shop')}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold whitespace-nowrap text-stone-700 hover:bg-stone-100 hover:text-[#18101E] transition cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-rose-600 shrink-0" />
            <span>Shop</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenBoutique('vip')}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#18101E] hover:bg-stone-800 px-3.5 py-1.5 text-xs font-extrabold whitespace-nowrap text-white transition cursor-pointer"
          >
            {wallet.isFounderUnlimited ? (
              <Wrench className="h-3.5 w-3.5 text-amber-300 shrink-0" />
            ) : (
              <Crown className="h-3.5 w-3.5 text-amber-300 shrink-0" />
            )}
            <span>
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
              const nextMuted = toggleSoundMute();
              setMuted(nextMuted);
            }}
            className={`hidden sm:inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition cursor-pointer ${
              muted
                ? 'bg-rose-50 text-rose-600'
                : 'text-stone-500 hover:bg-stone-100 hover:text-[#18101E]'
            }`}
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle Club Navigation Menu"
            className="lg:hidden inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#18101E] hover:bg-stone-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Compact Mobile Tab Strip (< lg) */}
      <div className="lg:hidden border-t border-stone-100 bg-[#FFFDF9] px-3 py-1.5 flex items-center justify-between gap-1 overflow-x-auto">
        {(
          [
            ['hinge', '📱 Hinge'],
            ['wild', '🗺️ Wild'],
            ['chats', `💬 Chats${activeChatCount > 0 ? ` (${activeChatCount})` : ''}`],
            ['school', '🎓 School'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onSelectTab(id);
            }}
            className={`rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap cursor-pointer ${
              activeTab === id ? 'bg-[#18101E] text-white' : 'text-stone-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPersonaModal();
              }}
              className="rounded-xl bg-stone-100 px-3 py-2 text-left text-[#18101E]"
            >
              👤 {wallet.playerName ? wallet.playerName : 'Set Persona'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPopTrivia();
              }}
              className="rounded-xl bg-amber-50 px-3 py-2 text-left text-amber-950"
            >
              🎬 {POP_CULTURE_TRIVIA.length}-Q Trailer Quiz
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('courtroom');
              }}
              className="rounded-xl bg-stone-100 px-3 py-2 text-left text-[#18101E]"
            >
              👑 Crown or Dump
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChecklist();
              }}
              className="rounded-xl bg-rose-50 px-3 py-2 text-left text-rose-900"
            >
              ✅ 25-Pt Experience Test
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('journal');
              }}
              className="rounded-xl bg-stone-100 px-3 py-2 text-left text-[#18101E]"
            >
              📖 16 Guides &amp; Zodiac
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFieldGuide();
              }}
              className="rounded-xl bg-stone-100 px-3 py-2 text-left text-[#18101E]"
            >
              📚 Field Guide
            </button>
          </div>
          {liveTipUrl && (
            <a
              href={liveTipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-amber-50 px-3 py-2 text-center text-xs font-extrabold text-amber-950"
            >
              Support This Project ($5)
            </a>
          )}
        </div>
      )}
    </header>
  );
};
