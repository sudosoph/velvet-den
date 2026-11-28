import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Camera,
  ChevronDown,
  Compass,
  Crown,
  Flame,
  Heart,
  Info,
  Menu,
  MessageCircle,
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
  passportLevel?: number;
  passportXp?: number;
  passportStreak?: number;
  onOpenPassportModal?: () => void;
  onSelectTab: (tab: ClubTopTab) => void;
  onOpenPersonaModal: () => void;
  onOpenFieldGuide: () => void;
  onOpenDateodex: () => void;
  onOpenBoutique: (initialTab?: BoutiqueSectionTab) => void;
  onOpenPopTrivia: () => void;
  onOpenChecklist: () => void;
  onOpenClubLounge?: (initialMode?: 'hub' | 'quiz') => void;
  onOpenRoastLab?: () => void;
  onSendPartnerAudition: () => void;
  onResetHearts?: () => void;
  onRequestFounderModal?: () => void;
  onGoHome: () => void;
}

export const TopHudBar: React.FC<TopHudBarProps> = ({
  wallet,
  activeTab,
  activeChatCount,
  passportLevel = 1,
  passportXp = 0,
  passportStreak = 1,
  onOpenPassportModal,
  onSelectTab,
  onOpenPersonaModal,
  onOpenFieldGuide,
  onOpenDateodex,
  onOpenBoutique,
  onOpenPopTrivia,
  onOpenChecklist,
  onOpenClubLounge,
  onOpenRoastLab,
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
    if (!import.meta.env.PROD && onRequestFounderModal) {
      tapCountRef.current += 1;
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        tapCountRef.current = 0;
      }, 2200);

      if (tapCountRef.current >= 5) {
        tapCountRef.current = 0;
        onRequestFounderModal();
        return;
      }
    }
    setMobileMenuOpen(false);
    onGoHome();
  };

  const liveTipUrl = MONETIZATION_CONFIG.tipJarUrl || MONETIZATION_CONFIG.kofiUrl;

  const navItemClass = (isActive: boolean) =>
    cn(
      'relative inline-flex h-14 lg:h-15 shrink-0 items-center justify-center gap-1.5 px-1 text-sm whitespace-nowrap transition-colors cursor-pointer border-b-2',
      isActive
        ? 'border-zinc-950 font-semibold text-zinc-950'
        : 'border-transparent font-medium text-zinc-500 hover:text-zinc-950',
    );

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/90 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex h-14 lg:h-15 w-full max-w-6xl items-center justify-between gap-3 sm:gap-5 px-3.5 sm:px-6">
        {/* LEFT: Architectural Brand Mark */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="group flex shrink-0 items-center gap-2 text-left whitespace-nowrap cursor-pointer"
        >
          <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white shadow-2xs group-hover:bg-rose-600 transition-colors">
            🐆
          </span>
          <span className="text-sm sm:text-base font-bold tracking-tight whitespace-nowrap text-zinc-950">
            {BRAND_CONFIG.name}
          </span>
        </button>

        {/* CENTER: Sleek 5-Tab Desktop Navigation (Zero Pill Borders) */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <nav
            aria-label="Primary Club Navigation"
            className="flex items-center gap-6 shrink-0"
          >
            <button
              type="button"
              onClick={() => onSelectTab('hinge')}
              className={navItemClass(activeTab === 'hinge')}
            >
              <span>Prowl</span>
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
                <span className="rounded-full bg-rose-600 px-1.5 py-0.5 text-[11px] leading-none font-bold text-white">
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
                    'h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform',
                    extrasOpen && 'rotate-180 text-zinc-950',
                  )}
                />
              </button>

              {extrasOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-13 w-64 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl space-y-0.5 z-50"
                >
                  {[
                    ...(onOpenRoastLab
                      ? [
                          {
                            icon: Flame,
                            label: 'AI Profile & Opener Roast',
                            action: () => onOpenRoastLab(),
                          },
                        ]
                      : []),
                    ...(onOpenClubLounge
                      ? [
                          {
                            icon: Sparkles,
                            label: '60s Archetype & Party Lounge',
                            action: () => onOpenClubLounge('quiz'),
                          },
                        ]
                      : []),
                    {
                      icon: Newspaper,
                      label: 'Club Guides & Zodiac Matcher',
                      action: () => onSelectTab('journal'),
                    },
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
                      label: '3-Tier Experience Test',
                      action: () => onOpenChecklist(),
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
                      icon: Sparkles,
                      label: 'Real Matchmaking & Discord',
                      action: () => onOpenBoutique('rewards'),
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
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
                      >
                        <Icon className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* RIGHT: Quiet, Uniform h-9 Action Toolbar */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {onOpenPassportModal && (
            <button
              type="button"
              data-testid="hud-passport-pill"
              onClick={onOpenPassportModal}
              title={`Club Rank ${passportLevel}/5 · ${passportXp} XP${passportStreak > 1 ? ` · ${passportStreak}d streak` : ''}`}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 sm:px-3 text-xs font-semibold whitespace-nowrap text-zinc-900 transition-colors cursor-pointer"
            >
              <Award className="h-3.5 w-3.5 text-rose-600 shrink-0" />
              <span>Rank {passportLevel}/5</span>
              <span className="hidden xl:inline text-zinc-400 font-normal tabular-nums">
                · {passportXp} XP
              </span>
            </button>
          )}

          <button
            type="button"
            aria-label="Persona & Account Reset"
            onClick={onOpenPersonaModal}
            title="Your Name, Vibe & Account Reset"
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 sm:px-3 text-xs font-medium whitespace-nowrap text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <User className="h-4 w-4 shrink-0 text-zinc-500" />
            <span className="hidden sm:inline">
              {wallet.playerName ? wallet.playerName : 'Persona'}
            </span>
          </button>

          <button
            type="button"
            aria-label="Shop"
            onClick={() => onOpenBoutique('shop')}
            className="hidden sm:inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3 text-xs font-medium whitespace-nowrap text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 shrink-0 text-zinc-500" />
            <span>Shop</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenBoutique('vip')}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-zinc-950 hover:bg-rose-600 px-3 text-xs font-semibold whitespace-nowrap text-white transition-colors cursor-pointer"
          >
            {!import.meta.env.PROD && wallet.isFounderUnlimited ? (
              <Wrench className="h-3.5 w-3.5 text-amber-300 shrink-0" />
            ) : (
              <Crown className="h-3.5 w-3.5 text-amber-300 shrink-0" />
            )}
            <span>
              {!import.meta.env.PROD && wallet.isFounderUnlimited
                ? 'Vault'
                : wallet.isVip
                  ? 'VIP Active'
                  : 'Club VIP'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              const nextMuted = toggleSoundMute();
              setMuted(nextMuted);
            }}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
            title={muted ? 'Unmute game audio' : 'Mute game audio'}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle Club Navigation Menu"
            className="lg:hidden inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Clean Mobile Drawer Menu (< lg), Zero Duplicate Horizontal Sub-Bar! */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-3.5 space-y-2.5 shadow-lg">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            {onOpenRoastLab && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRoastLab();
                }}
                className="col-span-2 rounded-lg bg-zinc-950 px-3.5 py-2.5 text-left font-semibold text-white"
              >
                📸 AI Profile Teardown &amp; Opener Roast
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('school');
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-900"
            >
              Cub School &amp; Certificates
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('journal');
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-900"
            >
              16 Guides &amp; Astro
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPopTrivia();
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-900"
            >
              Pop-Culture Trivia
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
              3-Tier Experience Test
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
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPersonaModal();
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-900"
            >
              Persona &amp; Reset Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBoutique('shop');
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-900"
            >
              Date-Night Shop
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBoutique('rewards');
              }}
              className="col-span-2 rounded-lg border border-rose-200 bg-rose-50/70 px-3 py-2 text-left font-semibold text-rose-900"
            >
              Real Matchmaking &amp; Discord Community
            </button>
          </div>
          {liveTipUrl && (
            <a
              href={liveTipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-zinc-200 bg-white px-3 py-2 text-center text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Support This Project
            </a>
          )}
        </div>
      )}

      {/* Thumb-Friendly Sticky Mobile Bottom Tab Bar (< lg) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        data-testid="mobile-bottom-tab-bar"
        className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur-xs px-2 py-1.5 shadow-lg"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onSelectTab('hinge');
            }}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold transition cursor-pointer',
              activeTab === 'hinge' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-500 hover:text-zinc-950',
            )}
          >
            <Heart className="h-4 w-4" />
            <span>Prowl</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onSelectTab('wild');
            }}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold transition cursor-pointer',
              activeTab === 'wild' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-500 hover:text-zinc-950',
            )}
          >
            <Compass className="h-4 w-4" />
            <span>Wild</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onSelectTab('chats');
            }}
            className={cn(
              'relative flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold transition cursor-pointer',
              activeTab === 'chats' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-500 hover:text-zinc-950',
            )}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chats</span>
            {activeChatCount > 0 && (
              <span className="absolute right-3 top-1 rounded-full bg-rose-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                {activeChatCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenClubLounge) {
                onOpenClubLounge('hub');
              } else {
                onOpenPopTrivia();
              }
            }}
            className="flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 transition cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-rose-600" />
            <span>Lounge</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBoutique('vip');
            }}
            className="flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold text-zinc-800 hover:text-rose-600 transition cursor-pointer"
          >
            <Crown className="h-4 w-4 text-amber-500" />
            <span>{wallet.isVip ? 'VIP ✓' : 'VIP'}</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
