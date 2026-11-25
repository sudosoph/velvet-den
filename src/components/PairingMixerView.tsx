import React from 'react';
import { Crown, Flame, Lock, Minus, Plus, Send, Sparkles } from 'lucide-react';
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
import { ArchetypePortraitSvg } from './ArtPanels';

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
  onQuickCreateAudition: () => void;
  onOpenFieldGuide: () => void;
}

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
  onQuickCreateAudition,
  onOpenFieldGuide,
}) => {
  const vipEpisodes = EPISODES.filter((e) => e.isVip);

  return (
    <div className="space-y-6">
      {noticeBanner && (
        <div className="vice-panel rounded-xl bg-amber-400/20 border-amber-400 px-4 py-3 text-sm font-semibold text-amber-200">
          {noticeBanner}
        </div>
      )}

      {/* Hero Banner */}
      <section className="vice-panel relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a0e38] via-[#1b0c2e] to-[#0b2930] p-5 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/40 bg-pink-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-200">
              <Flame className="h-3.5 w-3.5 text-amber-300" /> Inspired by Real Cougar &amp; Cub Lifestyle Stories
            </span>
            <h1 className="mt-3 font-display text-4xl sm:text-6xl leading-[0.96] text-white drop-shadow-[3px_3px_0px_#09050f]">
              VET HIS MATURITY. MASTER THE CODE-SWITCH. WIN COMMITMENT.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
              Mix &amp; match ages, generations, and real community subplots—from spotting the Photo #2 liquor-bottle trap and surviving{' '}
              <em className="text-amber-300">&ldquo;Is that your son?&rdquo;</em> to 6 AM short-leash trail runs, soft-life princess treatment, and linen-apron Sundays.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onStartGame}
              className="vice-panel rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 px-6 py-4 font-display text-3xl text-slate-950 hover:brightness-110 transition cursor-pointer"
            >
              🍸 Start Vetting
            </button>
            <button
              type="button"
              onClick={onQuickCreateAudition}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-teal-400 px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-[3px_3px_0px_#09050f] hover:bg-teal-300 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send 2-Player Audition to Your Cougar/Cub (+3 Cr)</span>
            </button>
          </div>
        </div>

        {/* Role Selector */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChangeRole('her')}
            className={`rounded-2xl border-2 border-black p-4 text-left transition cursor-pointer ${
              role === 'her'
                ? 'bg-rose-500 text-white shadow-[4px_4px_0px_#09050f]'
                : 'bg-black/40 text-slate-300 hover:bg-black/60'
            }`}
          >
            <div className="font-display text-2xl">🐆 Play as Her: Vet &amp; Train</div>
            <p className="text-xs opacity-90 mt-0.5">
              Weed out &ldquo;hey&rdquo; DMs &amp; liquor-bottle selfies, test his chivalry &amp; cardio, or claim full soft-life princess treatment.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChangeRole('him')}
            className={`rounded-2xl border-2 border-black p-4 text-left transition cursor-pointer ${
              role === 'him'
                ? 'bg-teal-400 text-slate-950 shadow-[4px_4px_0px_#09050f]'
                : 'bg-black/40 text-slate-300 hover:bg-black/60'
            }`}
          >
            <div className="font-display text-2xl">🔥 Play as Him: Impress &amp; Commit</div>
            <p className="text-xs opacity-90 mt-0.5">
              Code-switch out of group-chat slang, handle the tapas check, survive her 6 AM ridge pace, and prove you have real game.
            </p>
          </button>
        </div>
      </section>

      {/* Mix & Match Columns */}
      <section className="grid gap-5 lg:grid-cols-2">
        {/* Her Column */}
        <div className="vice-panel rounded-2xl bg-[#180d28] p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-3xl text-rose-400">
              1. Choose Her Archetype &amp; Age Tier
            </h2>
            <button
              type="button"
              onClick={onOpenFieldGuide}
              className="text-xs font-bold underline text-amber-300 hover:text-amber-200 cursor-pointer"
            >
              Puma vs Cougar vs Jaguar?
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {HER_ARCHETYPES.map((item) => {
              const selected = item.id === her.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectHer(item)}
                  className={`flex items-start gap-3.5 rounded-xl border-2 border-black p-3 transition cursor-pointer ${
                    selected
                      ? 'bg-gradient-to-r from-rose-950/90 to-fuchsia-950/80 ring-2 ring-rose-400'
                      : 'bg-[#221338]/70 hover:bg-[#291844]'
                  }`}
                >
                  <ArchetypePortraitSvg variant={item.portraitVariant} className="w-16 h-16" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold text-white">
                        {item.name}, {selected ? her.age : item.age}F • {item.title}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-amber-200/95">{item.tagline}</p>
                    {selected && (
                      <>
                        <p className="mt-2 rounded-lg bg-black/40 px-2.5 py-1.5 text-[11px] italic text-pink-200">
                          💭 Inner vulnerability: {item.secretInsecurity}
                        </p>
                        <div
                          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-black/50 px-2.5 py-1 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-slate-300 font-semibold">Custom Age:</span>
                          <button
                            type="button"
                            onClick={() => onAdjustHerAge(-1)}
                            className="rounded bg-slate-700 p-1 hover:bg-slate-600 cursor-pointer"
                            aria-label="Decrease Her Age"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-extrabold text-amber-300">{her.age}</span>
                          <button
                            type="button"
                            onClick={() => onAdjustHerAge(1)}
                            className="rounded bg-slate-700 p-1 hover:bg-slate-600 cursor-pointer"
                            aria-label="Increase Her Age"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* His Column */}
        <div className="vice-panel rounded-2xl bg-[#101c28] p-5">
          <h2 className="font-display text-3xl text-teal-300">
            2. Choose His Cub Archetype &amp; Life Stage
          </h2>

          <div className="mt-3 space-y-2.5">
            {HIS_ARCHETYPES.map((item) => {
              const selected = item.id === his.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectHis(item)}
                  className={`flex items-start gap-3.5 rounded-xl border-2 border-black p-3 transition cursor-pointer ${
                    selected
                      ? 'bg-gradient-to-r from-teal-950/90 to-slate-900 ring-2 ring-teal-400'
                      : 'bg-[#172838]/70 hover:bg-[#1e3448]'
                  }`}
                >
                  <ArchetypePortraitSvg variant={item.portraitVariant} className="w-16 h-16" />
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-white">
                      {item.name}, {selected ? his.age : item.age}M • {item.title}
                    </span>
                    <p className="mt-1 text-xs text-teal-200/95">{item.tagline}</p>
                    {selected && (
                      <>
                        <p className="mt-2 rounded-lg bg-black/40 px-2.5 py-1.5 text-[11px] italic text-cyan-200">
                          💭 Inner vulnerability: {item.secretInsecurity}
                        </p>
                        <div
                          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-black/50 px-2.5 py-1 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-slate-300 font-semibold">Custom Age:</span>
                          <button
                            type="button"
                            onClick={() => onAdjustHisAge(-1)}
                            className="rounded bg-slate-700 p-1 hover:bg-slate-600 cursor-pointer"
                            aria-label="Decrease His Age"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-extrabold text-teal-300">{his.age}</span>
                          <button
                            type="button"
                            onClick={() => onAdjustHisAge(1)}
                            className="rounded bg-slate-700 p-1 hover:bg-slate-600 cursor-pointer"
                            aria-label="Increase His Age"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Matchup Readout + Optional VIP Deep-Cut Add-ons */}
      <section className="vice-panel rounded-2xl bg-[#1a0f2b] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="rounded-md bg-amber-400 px-2.5 py-1 text-xs font-extrabold uppercase text-slate-950">
              {pairing.badgeLabel}
            </span>
            <span className="ml-2 text-xs font-bold text-teal-300">
              {pairing.generationalHeadline}
            </span>
            <p className="mt-2 text-xs sm:text-sm text-slate-200">
              <strong className="text-amber-300">🧠 Generational Code-Switch Briefing:</strong>{' '}
              {pairing.codeSwitchTip}
            </p>
          </div>
          <button
            type="button"
            onClick={onStartGame}
            className="rounded-xl border-2 border-black bg-rose-500 px-5 py-2.5 font-display text-2xl text-white shadow-[3px_3px_0px_#09050f] hover:bg-rose-400 cursor-pointer"
          >
            Enter The Prowl →
          </button>
        </div>

        {/* Optional Subreddit Deep-Cut VIP Bonus Episodes */}
        <div className="mt-4">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-pink-300">
            <Crown className="h-4 w-4 text-amber-300" />
            <span>Bonus Subreddit Deep-Cut Plotlines (Unlock with Credits or VIP Black Card)</span>
          </div>
          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
            {vipEpisodes.map((ep) => {
              const unlocked = wallet.isVip || wallet.unlockedEpisodeIds.includes(ep.id);
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
        </div>
      </section>
    </div>
  );
};
