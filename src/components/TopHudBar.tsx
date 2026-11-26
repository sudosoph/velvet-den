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
import { cn } from '../lib/utils';
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

  const navItemClass = (isActive: boolean) =>
    cn(
      'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer',
      isActive
        ? 'bg-white text-zinc-950 shadow-2xs'
        : 'text-zinc-600 hover:text-zinc-950',
    );

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* LEFT: Anchored Brand Wordmark + Subtle Persona Button */}
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex shrink-0 items-center gap-2 text-left whitespace-nowrap cursor-pointer"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-sm text-white group-hover:bg-rose-600 transition-colors">
              🐆
            </span>
            <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap text-zinc-950">
              {BRAND_CONFIG.name}
            </span>
          </button>

          <span className="hidden sm:inline text-zinc-200">|</span>

          <button
            type="button"
            onClick={onOpenPersonaModal}
            className="hidden sm:inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium whitespace-nowrap text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <User className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span>{wallet.playerName ? wallet.playerName : 'Persona'}</span>
          </button>
        </div>

        {/* CENTER: shadcn/ui Segmented TabsList (Uniform 14px text-sm, Clean Rounded-lg Track) */}
        <nav
          aria-label="Primary Club Navigation"
          className="hidden lg:flex items-center gap-0.5 rounded-lg bg-zinc-100 p-1 shrink-0"
        >
          <button
            type="button"
            onClick={() => onSelectTab('hinge')}
            className={navItemClass(activeTab === 'hinge')}
          >
            <span>Hinge</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('wild')}
            className={navItemClass(activeTab === 'wild')}
          >
            <span>In The Wild</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('chats')}
            className={navItemClass(activeTab === 'chats')}
          >
            <span>Chats &amp; Dates</span>
            {activeChatCount > 0 && (
              <span className="rounded-full bg-rose-600 px-1.5 py-0.5 text-xs leading-none font-semibold text-white">
                {activeChatCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('school')}
            className={navItemClass(activeTab === 'school')}
          >
            <span>Cub School</span>
          </button>

          <div ref={extrasRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setExtrasOpen((v) => !v)}
              aria-expanded={extrasOpen}
              className={navItemClass(
                extrasOpen ||
                  activeTab === 'journal' ||
                  activeTab === 'courtroom' ||
                  activeTab === 'about',
              )}
            >
              <span>Club Extras</span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform',
                  extrasOpen && 'rotate-180',
                )}
              />
            </button>

            {extrasOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg space-y-0.5 z-50"
              >
                {[
                  {
                    icon: Award,
                    label: `${POP_CULTURE_TRIVIA.length}-Q Trailer & Pop Quiz`,
                    action: () => onOpenPopTrivia(),
                  },
                  {
                    icon: Crown,
                    label: 'Crown or Dump Courtroom',
                    action: () => onSelectTab('courtroom'),
                  },
                  {
                    icon: Sparkles,
                    label: '25-Pt Experience Test',
                    action: () => onOpenChecklist(),
                  },
                  {
                    icon: Newspaper,
                    label: '16 Guides & Zodiac Matcher',
                    action: () => onSelectTab('journal'),
                  },
                  {
                    icon: Camera,
                    label: 'Dateodex & Polaroids',
                    action: () => onOpenDateodex(),
                  },
                  {
                    icon: BookOpen,
                    label: 'Age-Gap Field Guide',
                    action: () => onOpenFieldGuide(),
                  },
                  {
                    icon: Send,
                    label: 'Send 60s Partner Audition',
                    action: () => onSendPartnerAudition(),
                  },
                  {
                    icon: Info,
                    label: 'About Cougars & Cubs Club',
                    action: () => onSelectTab('about'),
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setExtrasOpen(false);
                        item.action();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      <Icon className="h-4 w-4 text-zinc-500 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT: Uniform h-9 shadcn Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          {liveTipUrl && (
            <a
              href={liveTipUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Support This Project"
              onClick={() => trackEvent('tip_jar_clicked', { surface: 'top_hud' })}
              className="hidden sm:inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium whitespace-nowrap text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
            >
              <Heart className="h-3.5 w-3.5 text-rose-600 shrink-0" />
              <span>Support</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => onOpenBoutique('shop')}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium whitespace-nowrap text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span>Shop</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenBoutique('vip')}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-3 text-xs font-semibold whitespace-nowrap text-white transition-colors cursor-pointer"
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
            className={cn(
              'hidden sm:inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors cursor-pointer',
              muted
                ? 'bg-zinc-100 text-zinc-900'
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',
            )}
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle Club Navigation Menu"
            className="lg:hidden inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-900 hover:bg-zinc-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Compact Mobile Tab Strip (< lg) */}
      <div className="lg:hidden border-t border-zinc-200 bg-zinc-50 px-3 py-1.5 flex items-center justify-between gap-1 overflow-x-auto">
        {(
          [
            ['hinge', 'Hinge'],
            ['wild', 'In The Wild'],
            ['chats', `Chats${activeChatCount > 0 ? ` (${activeChatCount})` : ''}`],
            ['school', 'Cub School'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onSelectTab(id);
            }}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer',
              activeTab === id ? 'bg-zinc-900 text-white' : 'text-zinc-600',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPersonaModal();
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-900"
            >
              {wallet.playerName ? wallet.playerName : 'Set Persona'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPopTrivia();
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-900"
            >
              {POP_CULTURE_TRIVIA.length}-Q Trailer Quiz
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('courtroom');
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-900"
            >
              Crown or Dump
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChecklist();
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-900"
            >
              25-Pt Experience Test
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('journal');
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-900"
            >
              16 Guides &amp; Zodiac
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFieldGuide();
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-900"
            >
              Field Guide
            </button>
          </div>
          {liveTipUrl && (
            <a
              href={liveTipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg bg-zinc-900 px-3 py-2 text-center text-sm font-medium text-white"
            >
              Support This Project ($5)
            </a>
          )}
        </div>
      )}
    </header>
  );
};
