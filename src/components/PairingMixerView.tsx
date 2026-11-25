import React, { useState } from 'react';
import {
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crown,
  Flame,
  Lock,
  MessageCircle,
  Minus,
  Plus,
  Send,
  Sparkles,
} from 'lucide-react';
import { EPISODES } from '../data/episodes';
import type { WalletState } from '../domain/economy';
import {
  HER_ARCHETYPES,
  HIS_ARCHETYPES,
  type HerArchetype,
  type HisArchetype,
  type PairingAnalysis,
  type PlayerRole,
} from '../domain/taxonomy';
import { sfx } from '../lib/sound';

interface PairingMixerViewProps {
  role: PlayerRole;
  her: HerArchetype;
  his: HisArchetype;
  pairing: PairingAnalysis;
  wallet: WalletState;
  selectedVipIds: string[];
  noticeBanner: string | null;
  onChangeRole: (role: PlayerRole) => void;
  onSelectHer: (her: HerArchetype) => void;
  onSelectHis: (his: HisArchetype) => void;
  onAdjustHerAge: (delta: number) => void;
  onAdjustHisAge: (delta: number) => void;
  onToggleVipEpisode: (episodeId: string, creditCost: number) => void;
  onStartGame: () => void;
  onOpenLiveInbox: () => void;
  onOpenPopTrivia: () => void;
  onQuickCreateAudition: () => void;
  onOpenFieldGuide: () => void;
}

type HerDecadeFilter = 'all' | '30s' | '40s' | '50s' | '60s';

export const PairingMixerView: React.FC<PairingMixerViewProps> = ({
  role,
  her,
  his,
  pairing,
  wallet,
  selectedVipIds,
  noticeBanner,
  onChangeRole,
  onSelectHer,
  onSelectHis,
  onAdjustHerAge,
  onAdjustHisAge,
  onToggleVipEpisode,
  onStartGame,
  onOpenLiveInbox,
  onOpenPopTrivia,
  onQuickCreateAudition,
  onOpenFieldGuide,
}) => {
  const [showVipDrawer, setShowVipDrawer] = useState(false);
  const [herFilter, setHerFilter] = useState<HerDecadeFilter>('all');
  const [herPhotoIdx, setHerPhotoIdx] = useState(0);
  const [hisPhotoIdx, setHisPhotoIdx] = useState(0);

  const vipEpisodes = EPISODES.filter((e) => e.isVip);

  const filteredHerList = HER_ARCHETYPES.filter((item) => {
    if (herFilter === '30s') return item.age < 40;
    if (herFilter === '40s') return item.age >= 40 && item.age < 50;
    if (herFilter === '50s') return item.age >= 50 && item.age < 60;
    if (herFilter === '60s') return item.age >= 60;
    return true;
  });

  const herGallery = her.galleryPhotos?.length
    ? her.galleryPhotos
    : [
        { label: '📸 Portrait', url: her.photoUrl },
        { label: '🏖️ Lagoon Swim', url: './images/cast/camila-39f.jpg' },
        { label: '🐾 Park Rosé', url: './images/cast/dog-park-picnic.jpg' },
      ];
  const hisGallery = his.galleryPhotos?.length
    ? his.galleryPhotos
    : [
        { label: '📸 Portrait', url: his.photoUrl },
        { label: '🍝 Chef Mode', url: './images/cast/leo-25m.jpg' },
        { label: '🐾 Dog Picnic', url: './images/cast/dog-park-picnic.jpg' },
      ];

  const activeHerSlide = herGallery[herPhotoIdx % herGallery.length];
  const activeHisSlide = hisGallery[hisPhotoIdx % hisGallery.length];

  return (
    <div className="space-y-6 animate-stage-in">
      {noticeBanner && (
        <div className="vice-panel rounded-xl bg-amber-400/20 border-amber-400 px-4 py-3 text-sm font-semibold text-amber-200">
          {noticeBanner}
        </div>
      )}

      {/* Breezy Visual Game Splash — Cinematic Portrait + Instant Play */}
      <section className="vice-panel relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a0e38] via-[#180b2a] to-[#0b272e] p-4 sm:p-7">
        <div className="grid gap-6 md:grid-cols-[1.25fr_0.9fr] md:items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/40 bg-pink-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-200">
              <Flame className="h-3.5 w-3.5 text-amber-300" /> Cougars &amp; Cubs Club • Interactive Romance Game
            </span>

            <h1 className="font-display text-4xl sm:text-6xl leading-[0.95] text-white drop-shadow-[3px_3px_0px_#09050f]">
              BROWSE YOUR TYPE. VET THE RED FLAGS. WIN REAL LOVE.
            </h1>

            <p className="text-sm text-slate-200 max-w-xl">
              Scroll multi-photo Tinder cards across every decade &amp; vibe—from 35F hiking Pumas and 44F Palm Springs bikini Cougars to 51F redhead Jaguars and 61F silver-braided Panthers—paired with arcade minigames, pop-culture trivia, and live AI texting.
            </p>

            {/* Role Toggle Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  onChangeRole('her');
                }}
                className={`rounded-2xl border-2 border-black px-4 py-3 text-left transition cursor-pointer ${
                  role === 'her'
                    ? 'bg-rose-500 text-white shadow-[4px_4px_0px_#09050f]'
                    : 'bg-black/45 text-slate-300 hover:bg-black/65'
                }`}
              >
                <div className="font-display text-2xl leading-none">🐆 Play as Her</div>
                <div className="text-[11px] font-bold opacity-95 mt-1">
                  Vet &amp; Train • Catch Red Flags
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  onChangeRole('him');
                }}
                className={`rounded-2xl border-2 border-black px-4 py-3 text-left transition cursor-pointer ${
                  role === 'him'
                    ? 'bg-teal-400 text-slate-950 shadow-[4px_4px_0px_#09050f]'
                    : 'bg-black/45 text-slate-300 hover:bg-black/65'
                }`}
              >
                <div className="font-display text-2xl leading-none">🔥 Play as Him</div>
                <div className="text-[11px] font-bold opacity-95 mt-1">
                  Impress &amp; Commit • Code-Switch
                </div>
              </button>
            </div>

            {/* Primary Play CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  sfx.swipeRight();
                  onStartGame();
                }}
                className="vice-panel rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 px-7 py-3.5 font-display text-3xl text-slate-950 hover:brightness-110 active:scale-98 transition cursor-pointer"
              >
                🍸 Start Vetting
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  onOpenLiveInbox();
                }}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-black bg-[#152836] px-4 py-3 text-xs font-extrabold text-teal-300 shadow-[3px_3px_0px_#09050f] hover:bg-[#1c3547] cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 text-amber-300" />
                <span>💬 Live AI Texting Mode</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  onOpenPopTrivia();
                }}
                className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-black bg-[#2b1238] px-4 py-3 text-xs font-extrabold text-pink-200 shadow-[3px_3px_0px_#09050f] hover:bg-[#381849] cursor-pointer"
              >
                <Award className="h-4 w-4 text-amber-300" />
                <span>🎬 Pop-Culture Quiz (+3 Cr)</span>
              </button>
            </div>
          </div>

          {/* Photorealistic Hero Couple Card */}
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border-3 border-black shadow-[6px_6px_0px_#09050f]">
            <img
              src="./images/cast/hero-couple.jpg"
              alt="Sunlit rooftop Cougar and Cub couple"
              className="h-64 sm:h-72 w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <div>
                <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-950">
                  {pairing.badgeLabel}
                </span>
                <div className="mt-1 font-display text-2xl text-white leading-none">
                  {her.name} ({her.age}F) × {his.name} ({his.age}M)
                </div>
              </div>
              <button
                type="button"
                onClick={onQuickCreateAudition}
                className="shrink-0 inline-flex items-center gap-1 rounded-xl border-2 border-black bg-teal-400 px-2.5 py-1.5 text-[11px] font-extrabold text-slate-950 hover:bg-teal-300 cursor-pointer"
                title="Send a 60-second Vetting Audition link to your real Cougar or Cub"
              >
                <Send className="h-3 w-3" />
                <span>2P Link (+3 Cr)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Step 1: Diverse Her Cast Browser With Decade Filter Pills */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-3xl text-rose-400">
              1. Pick Her Type ({her.name}, {her.age}F — {HER_ARCHETYPES.length} Profiles)
            </h2>
            <p className="text-xs text-slate-300">
              Filter by decade or browse across Black, Latina, South &amp; East Asian, Blonde, Copper-Redhead &amp; Silver icons
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenFieldGuide}
            className="text-xs font-bold underline text-amber-300 hover:text-amber-200 cursor-pointer"
          >
            Junior Cougar (6-Yr) vs Puma vs Cougar vs Jaguar?
          </button>
        </div>

        {/* Decade Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['all', `All Women (${HER_ARCHETYPES.length})`],
              ['30s', '30s Pumas & Junior Cougars'],
              ['40s', '40s Cougars'],
              ['50s', '50s Jaguars'],
              ['60s', '60s+ Panthers'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setHerFilter(id)}
              className={`rounded-full border-2 border-black px-3.5 py-1 text-xs font-extrabold transition cursor-pointer ${
                herFilter === id
                  ? 'bg-rose-500 text-white shadow-[2px_2px_0px_#09050f]'
                  : 'bg-[#1b102d] text-slate-300 hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filteredHerList.map((item) => {
            const selected = item.id === her.id;
            const displayAge = selected ? her.age : item.age;
            return (
              <div
                key={item.id}
                onClick={() => {
                  sfx.messagePop();
                  onSelectHer(item);
                  setHerPhotoIdx(0);
                }}
                className={`group relative overflow-hidden rounded-2xl border-2 border-black transition cursor-pointer ${
                  selected
                    ? 'ring-3 ring-rose-400 shadow-[5px_5px_0px_#f43f5e] -translate-y-0.5'
                    : 'opacity-90 hover:opacity-100 hover:-translate-y-0.5'
                }`}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.photoUrl}
                    alt={`${item.name}, ${displayAge}`}
                    className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12071d] via-black/25 to-transparent" />
                  {item.lookBadge && (
                    <span className="absolute top-2 left-2 rounded-full bg-black/75 px-2 py-0.5 text-[9px] font-bold text-amber-200 border border-amber-300/30">
                      {item.lookBadge.split('•')[0].trim()}
                    </span>
                  )}
                  {selected && (
                    <span className="absolute top-2 right-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow">
                      Selected
                    </span>
                  )}
                  <div className="absolute bottom-2 left-2.5 right-2.5">
                    <div className="font-display text-2xl text-white leading-none">
                      {item.name}, <span className="text-amber-300">{displayAge}</span>
                    </div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wide text-rose-300 mt-0.5">
                      {item.title}
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-slate-200 line-clamp-2">
                      {item.shortHook}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 2: Diverse Handsome Cubs Grid */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-3xl text-teal-300">
            2. Pick Her Cub ({his.name}, {his.age}M — {HIS_ARCHETYPES.length} Cubs)
          </h2>
          <span className="text-xs text-slate-400">
            From 6&apos;2&quot; firefighters &amp; sous-chefs to redhead hikers, blonde swimmers &amp; 30s architects
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {HIS_ARCHETYPES.map((item) => {
            const selected = item.id === his.id;
            const displayAge = selected ? his.age : item.age;
            return (
              <div
                key={item.id}
                onClick={() => {
                  sfx.messagePop();
                  onSelectHis(item);
                  setHisPhotoIdx(0);
                }}
                className={`group relative overflow-hidden rounded-2xl border-2 border-black transition cursor-pointer ${
                  selected
                    ? 'ring-3 ring-teal-400 shadow-[5px_5px_0px_#2dd4bf] -translate-y-0.5'
                    : 'opacity-90 hover:opacity-100 hover:-translate-y-0.5'
                }`}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.photoUrl}
                    alt={`${item.name}, ${displayAge}`}
                    className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1622] via-black/25 to-transparent" />
                  {item.lookBadge && (
                    <span className="absolute top-2 left-2 rounded-full bg-black/75 px-2 py-0.5 text-[9px] font-bold text-teal-200 border border-teal-300/30">
                      {item.lookBadge.split('•')[0].trim()}
                    </span>
                  )}
                  {selected && (
                    <span className="absolute top-2 right-2 rounded-full bg-teal-400 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-950 shadow">
                      Selected
                    </span>
                  )}
                  <div className="absolute bottom-2 left-2.5 right-2.5">
                    <div className="font-display text-2xl text-white leading-none">
                      {item.name}, <span className="text-teal-300">{displayAge}</span>
                    </div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wide text-amber-300 mt-0.5">
                      {item.title}
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-slate-200 line-clamp-2">
                      {item.shortHook}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Side-by-Side Scrollable Tinder Profile Inspector for Selected Pair! */}
      <section className="grid gap-4 md:grid-cols-2">
        {/* Selected Her Full Multi-Photo Card */}
        <div className="vice-panel rounded-3xl bg-[#1a0d2b] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-300">
              🐆 Selected Her Profile • Scroll Photos
            </span>
            {her.lookBadge && (
              <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                {her.lookBadge}
              </span>
            )}
          </div>

          <div className="relative aspect-[4/3.6] w-full overflow-hidden rounded-2xl border-2 border-black bg-slate-950">
            <img
              src={activeHerSlide.url}
              alt={`${her.name} ${activeHerSlide.label}`}
              className="h-full w-full object-cover object-top"
            />
            <button
              type="button"
              aria-label="Previous Her photo"
              onClick={() => setHerPhotoIdx((i) => (i - 1 + herGallery.length) % herGallery.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next Her photo"
              onClick={() => setHerPhotoIdx((i) => (i + 1) % herGallery.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-2 flex gap-1">
              {herGallery.map((g, idx) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setHerPhotoIdx(idx)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold cursor-pointer ${
                    idx === herPhotoIdx % herGallery.length
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-black/75 text-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-200">{her.vibeSummary}</p>
          {her.interests && (
            <div className="flex flex-wrap gap-1.5">
              {her.interests.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-rose-500/20 border border-rose-400/30 px-2.5 py-0.5 text-[10px] font-bold text-rose-200"
                >
                  ✨ {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Selected His Full Multi-Photo Card */}
        <div className="vice-panel rounded-3xl bg-[#0e1e2b] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-300">
              🔥 Selected Cub Profile • Scroll Photos
            </span>
            {his.lookBadge && (
              <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[11px] font-bold text-teal-200">
                {his.lookBadge}
              </span>
            )}
          </div>

          <div className="relative aspect-[4/3.6] w-full overflow-hidden rounded-2xl border-2 border-black bg-slate-950">
            <img
              src={activeHisSlide.url}
              alt={`${his.name} ${activeHisSlide.label}`}
              className="h-full w-full object-cover object-top"
            />
            <button
              type="button"
              aria-label="Previous Cub photo"
              onClick={() => setHisPhotoIdx((i) => (i - 1 + hisGallery.length) % hisGallery.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next Cub photo"
              onClick={() => setHisPhotoIdx((i) => (i + 1) % hisGallery.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-2 flex gap-1">
              {hisGallery.map((g, idx) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setHisPhotoIdx(idx)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold cursor-pointer ${
                    idx === hisPhotoIdx % hisGallery.length
                      ? 'bg-teal-400 text-slate-950'
                      : 'bg-black/75 text-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-200">{his.vibeSummary}</p>
          {his.interests && (
            <div className="flex flex-wrap gap-1.5">
              {his.interests.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-teal-500/20 border border-teal-400/30 px-2.5 py-0.5 text-[10px] font-bold text-teal-200"
                >
                  ✨ {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Compact Matchup Dock + Custom Age Dial + Expandable VIP Add-Ons */}
      <section className="vice-panel rounded-3xl bg-[#180e29] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-amber-400 px-2.5 py-0.5 text-xs font-extrabold uppercase text-slate-950">
                {pairing.badgeLabel}
              </span>
              <span className="text-xs font-bold text-pink-300">{pairing.trackTitle}</span>
            </div>

            {/* Custom Age Fine-Tuning Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/45 px-2.5 py-1">
                <span className="text-rose-300 font-bold">{her.name}’s Age:</span>
                <button
                  type="button"
                  onClick={() => onAdjustHerAge(-1)}
                  className="rounded bg-slate-700 p-1 hover:bg-slate-600 cursor-pointer"
                  aria-label="Decrease Her Age"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="font-extrabold text-amber-300 w-6 text-center">{her.age}</span>
                <button
                  type="button"
                  onClick={() => onAdjustHerAge(1)}
                  className="rounded bg-slate-700 p-1 hover:bg-slate-600 cursor-pointer"
                  aria-label="Increase Her Age"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/45 px-2.5 py-1">
                <span className="text-teal-300 font-bold">{his.name}’s Age:</span>
                <button
                  type="button"
                  onClick={() => onAdjustHisAge(-1)}
                  className="rounded bg-slate-700 p-1 hover:bg-slate-600 cursor-pointer"
                  aria-label="Decrease His Age"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="font-extrabold text-teal-300 w-6 text-center">{his.age}</span>
                <button
                  type="button"
                  onClick={() => onAdjustHisAge(1)}
                  className="rounded bg-slate-700 p-1 hover:bg-slate-600 cursor-pointer"
                  aria-label="Increase His Age"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowVipDrawer((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-black/50 px-3.5 py-2.5 text-xs font-extrabold text-amber-300 hover:bg-black/70 cursor-pointer"
            >
              <Crown className="h-4 w-4" />
              <span>Bonus VIP Scenes ({selectedVipIds.length}/4)</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${showVipDrawer ? 'rotate-180' : ''}`}
              />
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.swipeRight();
                onStartGame();
              }}
              className="rounded-xl border-2 border-black bg-rose-500 px-6 py-2.5 font-display text-2xl text-white shadow-[3px_3px_0px_#09050f] hover:bg-rose-400 cursor-pointer"
            >
              Enter The Prowl →
            </button>
          </div>
        </div>

        {showVipDrawer && (
          <div className="pt-3 border-t border-white/10 grid gap-2.5 sm:grid-cols-2">
            {vipEpisodes.map((ep) => {
              const unlocked =
                wallet.isVip ||
                Boolean(wallet.isFounderUnlimited) ||
                wallet.unlockedEpisodeIds.includes(ep.id);
              const active = selectedVipIds.includes(ep.id);
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => onToggleVipEpisode(ep.id, ep.creditCost)}
                  className={`flex items-center justify-between gap-3 rounded-xl border-2 border-black p-3 text-left transition cursor-pointer ${
                    active
                      ? 'bg-amber-400/20 ring-2 ring-amber-400'
                      : 'bg-black/40 hover:bg-black/60'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{ep.title}</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      {ep.subredditThreadInspiration}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                      unlocked
                        ? active
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-slate-700 text-emerald-300'
                        : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    {unlocked ? (
                      <>
                        <Sparkles className="h-3 w-3" />
                        <span>{active ? 'Added' : 'Include'}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        <span>{ep.creditCost} Cr</span>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
