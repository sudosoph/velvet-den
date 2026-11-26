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
  Music,
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
import {
  isLoungeMusicPlaying,
  isSoundMuted,
  toggleLoungeMusic,
  toggleSoundMute,
} from '../lib/sound';
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
  onResetHearts,
  onRequestFounderModal,
  onGoHome,
}) => {
  const [muted, setMuted] = useState(() => isSoundMuted());
  const [bgmOn, setBgmOn] = useState(() => isLoungeMusicPlaying());
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
  const heartsDisplay =
    wallet.fridayHearts > 0
      ? '❤️'.repeat(wallet.fridayHearts) + '🤍'.repeat(Math.max(0, 3 - wallet.fridayHearts))
      : '🤍🤍🤍';

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#FFFDF9]/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2.5 px-3 py-2.5 sm:px-6">
        {/* ZONE 1: Brand + Friday Hearts + Quick Persona Pill */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex shrink-0 items-center gap-2 text-left cursor-pointer"
          >
            <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#18101E] to-rose-700 text-base text-white group-hover:scale-105 transition">
              🐆
            </span>
            <span className="font-editorial text-base sm:text-lg font-bold whitespace-nowrap text-[#18101E] group-hover:text-rose-700 transition-colors">
              {BRAND_CONFIG.name}
            </span>
          </button>

          <div
            data-testid="hud-friday-hearts"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-bold text-stone-700"
            title="Friday Date Energy (3 Hearts)"
          >
            <span>{heartsDisplay}</span>
            <span className="text-stone-400">•</span>
            <span>{wallet.discernmentXp} XP</span>
            {wallet.fridayHearts === 0 && onResetHearts && (
              <button
                type="button"
                onClick={onResetHearts}
                className="ml-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-extrabold text-white cursor-pointer"
              >
                New Friday
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenPersonaModal}
            className="inline-flex h-7.5 items-center gap-1 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 px-2.5 text-[11px] font-bold text-stone-700 cursor-pointer"
          >
            <User className="h-3 w-3 text-rose-600" />
            <span>{wallet.playerName ? wallet.playerName : 'Persona'}</span>
          </button>
        </div>

        {/* ZONE 2: Uncluttered 4-Tab Primary Sim Nav + Club Extras Drawer */}
        <nav
          aria-label="Primary Club Navigation"
          className="hidden xl:flex items-center justify-center gap-1.5"
        >
          <button
            type="button"
            onClick={() => onSelectTab('hinge')}
            className={`inline-flex h-8.5 items-center justify-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'hinge'
                ? 'bg-[#18101E] text-white shadow-xs'
                : 'border border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
            }`}
          >
            <span>📱 Hinge</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('wild')}
            className={`inline-flex h-8.5 items-center justify-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'wild'
                ? 'bg-[#18101E] text-white shadow-xs'
                : 'border border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
            }`}
          >
            <span>🗺️ In The Wild</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('chats')}
            className={`inline-flex h-8.5 items-center justify-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'chats'
                ? 'bg-[#007AFF] text-white shadow-xs'
                : 'border border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
            }`}
          >
            <span>💬 Chats &amp; Dates</span>
            {activeChatCount > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
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
            className={`inline-flex h-8.5 items-center justify-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'school'
                ? 'bg-[#18101E] text-white shadow-xs'
                : 'border border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
            }`}
          >
            <span>🎓 Cub School</span>
          </button>

          <div ref={extrasRef} className="relative">
            <button
              type="button"
              onClick={() => setExtrasOpen((v) => !v)}
              aria-expanded={extrasOpen}
              className={`inline-flex h-8.5 items-center justify-center gap-1 rounded-full border px-3 text-xs font-bold transition cursor-pointer ${
                extrasOpen ||
                activeTab === 'journal' ||
                activeTab === 'courtroom' ||
                activeTab === 'about'
                  ? 'border-[#18101E] bg-[#18101E] text-white'
                  : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
              }`}
            >
              <span>☰ Club Extras</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${extrasOpen ? 'rotate-180' : ''}`}
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

        {/* ZONE 3: Support This Project, Date-Night Shop, Credits/VIP & Audio */}
        <div className="flex shrink-0 items-center gap-1.5">
          {liveTipUrl && (
            <a
              href={liveTipUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('tip_jar_clicked', { surface: 'top_hud' })}
              className="hidden sm:inline-flex h-8.5 items-center justify-center gap-1 rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 text-xs font-extrabold text-amber-950 transition"
            >
              <Heart className="h-3.5 w-3.5 fill-amber-500 text-amber-600 shrink-0" />
              <span>💛 Support This Project</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => onOpenBoutique('shop')}
            className="inline-flex h-8.5 items-center justify-center gap-1 rounded-full border border-stone-200 bg-white hover:bg-stone-50 px-2.5 text-xs font-bold text-[#18101E] transition cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-rose-600 shrink-0" />
            <span>Shop</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenBoutique('vip')}
            className="inline-flex h-8.5 items-center justify-center gap-1 rounded-full bg-[#18101E] hover:bg-stone-800 px-3 text-xs font-extrabold text-white transition cursor-pointer"
          >
            {wallet.isFounderUnlimited ? (
              <Wrench className="h-3.5 w-3.5 text-amber-300 shrink-0" />
            ) : (
              <Crown className="h-3.5 w-3.5 text-amber-300 shrink-0" />
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
                ? 'border-rose-600 bg-rose-600 text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
            aria-label={bgmOn ? 'Pause lounge soundtrack' : 'Play lounge soundtrack'}
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
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle Club Navigation Menu"
            className="xl:hidden inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-stone-200 bg-white text-[#18101E] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Compact Mobile Tab Strip (< xl) so 4 core tabs stay 1-tap everywhere */}
      <div className="xl:hidden border-t border-stone-100 bg-[#FFFDF9] px-3 py-1.5 flex items-center justify-between gap-1 overflow-x-auto">
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
        <div className="xl:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPopTrivia();
              }}
              className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-left text-amber-950"
            >
              🎬 {POP_CULTURE_TRIVIA.length}-Q Trailer Quiz
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('courtroom');
              }}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-left text-[#18101E]"
            >
              👑 Crown or Dump
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChecklist();
              }}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-left text-rose-900"
            >
              ✅ 25-Pt Experience Test
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('journal');
              }}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-left text-[#18101E]"
            >
              📖 16 Guides &amp; Zodiac
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDateodex();
              }}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-left text-[#18101E]"
            >
              📸 Dateodex
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('about');
              }}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-left text-[#18101E]"
            >
              ℹ️ About the Club
            </button>
          </div>
          {liveTipUrl && (
            <a
              href={liveTipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-center text-xs font-extrabold text-amber-950"
            >
              💛 Support This Project ($5)
            </a>
          )}
        </div>
      )}
    </header>
  );
};
