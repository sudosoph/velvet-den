import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Coffee,
  ExternalLink,
  Flame,
  Heart,
  RotateCcw,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { MONETIZATION_CONFIG } from '../config/monetization';
import {
  EPISODES,
  RELATIONSHIP_STAGE_LABELS,
  type Episode,
  type RelationshipStage,
} from '../data/episodes';
import { POP_CULTURE_TRIVIA } from '../data/popCultureTrivia';
import { personalizeText, type GameRunState, type Stats } from '../domain/gameEngine';
import { buildAffiliateUrl, getAffiliateById } from '../lib/affiliates';
import { renderRichText } from '../lib/richText';
import { playVoiceNotePreview, sfx } from '../lib/sound';
import { getLocalChoicePercentagesSync, localCrowdStatsService } from '../services/adapters';
import { MinigameWidget } from './MinigameWidgets';

interface EpisodeStageProps {
  run: GameRunState;
  credits: number;
  onSelectChoice: (choiceIndex: number) => void;
  onCompleteMinigame: (episodeId: string, bonus: Partial<Stats>, badge: string) => void;
  onRewindLast: () => boolean;
  onShareDilemma: (episodeId: string, title: string) => void;
  onOpenBoutique: () => void;
  onFinishRun: () => void;
}

const STAGE_PILLS: { stage: RelationshipStage; short: string }[] = [
  { stage: 1, short: '1·Spark' },
  { stage: 2, short: '2·Rhythm' },
  { stage: 3, short: '3·Doors' },
  { stage: 4, short: '4·Public' },
  { stage: 5, short: '5·Doubt' },
  { stage: 6, short: '6·Future' },
];

interface SceneVisualSpec {
  imageUrl: string;
  locationBadge: string;
  ambientTint: string;
  vibeReadHer: string;
  vibeReadHim: string;
}

function getSceneVisualSpec(ep: Episode): SceneVisualSpec {
  const id = ep.id.toLowerCase();

  if (id.includes('pool') || id.includes('sauna') || id.includes('one-year')) {
    return {
      imageUrl: './images/scenes/hotel-pool-sauna.jpg',
      locationBadge: '🏨 Heated Midnight Pool & Cedar Sauna • 11:40 PM',
      ambientTint: 'from-cyan-950/35 via-slate-950/45 to-[#120822]/90',
      vibeReadHer: 'Steam curls off the water—his shoulders relax, holding warm eye contact without rushing.',
      vibeReadHim: 'Candlelight catches her smile through the pool mist—zero small-talk nerves, pure magnetism.',
    };
  }
  if (id.includes('campus') || id.includes('sushi') || id.includes('dutch-calculator')) {
    return {
      imageUrl: './images/scenes/campus-autumn-sushi.jpg',
      locationBadge: '🍣 Lantern Quad & Omakase Sushi Counter • 7:45 PM',
      ambientTint: 'from-amber-950/35 via-slate-950/50 to-[#140924]/90',
      vibeReadHer: 'Warm sake steam & cedar counter glow—one playful raised eyebrow sets the entire pace.',
      vibeReadHim: 'Sneakers on brick quadstones, sharp wit across the sushi bar—every cue is live.',
    };
  }
  if (id.includes('bowling')) {
    return {
      imageUrl: './images/scenes/neon-bowling-lounge.jpg',
      locationBadge: '🎳 Retro Neon Bowling & Jukebox Lounge • 9:30 PM',
      ambientTint: 'from-fuchsia-950/40 via-slate-950/45 to-[#140924]/90',
      vibeReadHer: 'Magenta neon gleams off the hardwood lane—he’s hyping your spare like the NBA Finals.',
      vibeReadHim: 'She laces up retro bowling shoes laughing—playful trash talk beats stiff steakhouses.',
    };
  }
  if (id.includes('picnic') || id.includes('dog-park') || ep.sceneArt === 'trader_joes_aisle') {
    return {
      imageUrl: './images/cast/dog-park-picnic.jpg',
      locationBadge: '🧺 Golden-Hour Meadow & Park Stroll • 5:15 PM',
      ambientTint: 'from-emerald-950/35 via-slate-950/45 to-[#140924]/90',
      vibeReadHer: 'Fresh linen blanket, real strawberries, zero pretentiousness—effort shows in every detail.',
      vibeReadHim: 'Golden sunlight hits her sunglasses as she leans back on the blanket grinning.',
    };
  }
  if (
    ep.sceneArt === 'palm_springs_pool' ||
    id.includes('palm-springs') ||
    id.includes('montana')
  ) {
    return {
      imageUrl: './images/scenes/palm-springs-resort.jpg',
      locationBadge: '🌴 Boutique Cabana & Sunset Terrace • 6:50 PM',
      ambientTint: 'from-rose-950/35 via-slate-950/45 to-[#140924]/90',
      vibeReadHer: 'Warm resort breeze & clinking glasses—everyone else fades into background static.',
      vibeReadHim: 'Poolside twilight & effortless confidence—hold your frame and enjoy the moment.',
    };
  }
  if (
    ep.sceneArt === 'ridge_trail_leash' ||
    id.includes('gym') ||
    id.includes('pilates') ||
    id.includes('bench-press')
  ) {
    return {
      imageUrl: './images/scenes/canyon-sunrise-trail.jpg',
      locationBadge: '🏔️ Sunrise Ridge & Sculpt Club • 6:15 AM',
      ambientTint: 'from-amber-950/35 via-slate-950/45 to-[#120922]/90',
      vibeReadHer: 'Endorphins high, posture locked—actions speak louder than brag texts out here.',
      vibeReadHim: 'Crisp morning air and steady cadence—match her pace without showing off.',
    };
  }
  if (
    ep.sceneArt === 'houseboy_apron' ||
    ep.sceneArt === 'thanksgiving_table' ||
    ep.sceneArt === 'brunch_daughter' ||
    id.includes('six-month') ||
    id.includes('roommates') ||
    id.includes('iron')
  ) {
    return {
      imageUrl: './images/scenes/sunday-kitchen-sanctuary.jpg',
      locationBadge: '🍝 Candlelit Marble Kitchen Sanctuary • Sunday 7:30 PM',
      ambientTint: 'from-amber-950/35 via-slate-950/45 to-[#140924]/90',
      vibeReadHer: 'Rosemary hitting cast iron, peonies on marble—domestic competence is pure catnip.',
      vibeReadHim: 'Warm pendant lights and two poured glasses—leave her kitchen cleaner than you found it.',
    };
  }
  if (
    ep.sceneArt === 'mirror_vanity' ||
    ep.sceneArt === 'bathroom_audit' ||
    ep.sceneArt === 'fertility_talk' ||
    ep.sceneArt === 'babysitter_clock' ||
    id.includes('thaw') ||
    id.includes('perimenopause') ||
    id.includes('menopause') ||
    id.includes('hobosexual') ||
    id.includes('doubt')
  ) {
    return {
      imageUrl: './images/scenes/luxury-bedroom-sanctuary.jpg',
      locationBadge: '🕯️ Rain-Lit Private Sanctuary • 11:15 PM',
      ambientTint: 'from-indigo-950/40 via-slate-950/50 to-[#120822]/90',
      vibeReadHer: 'Rain on glass and amber lamplight—unguarded honesty matters ten times more than lines.',
      vibeReadHim: 'Quiet sanctuary hours—listen deeply, keep ego at zero, and let closeness breathe.',
    };
  }
  if (ep.sceneArt === 'princess_bouquet' || id.includes('foreign')) {
    return {
      imageUrl: './images/scenes/coastal-convertible.jpg',
      locationBadge: '🌅 Coastal Sunset Overlook & Wine Lounge • 6:40 PM',
      ambientTint: 'from-rose-950/35 via-slate-950/45 to-[#140924]/90',
      vibeReadHer: 'Peonies on the passenger seat and ocean breeze—let someone else drive for once.',
      vibeReadHim: 'Passenger door opened, playlist dialed—lead with warmth and zero hesitation.',
    };
  }
  if (ep.sceneArt === 'waiter_shock' || id.includes('gala') || id.includes('wedding')) {
    return {
      imageUrl: './images/scenes/wedding-gala-cheers.jpg',
      locationBadge: '🥂 Skyline Lounge & Velvet Rope • 9:10 PM',
      ambientTint: 'from-purple-950/40 via-slate-950/45 to-[#140924]/90',
      vibeReadHer: 'Every head turns as you step inside—calm, amused pride makes a couple untouchable.',
      vibeReadHim: 'Hand steady at her waist—turn every double-take into your favorite shared joke.',
    };
  }
  if (ep.sceneArt === 'code_switch_phone') {
    return {
      imageUrl: './images/scenes/neon-bowling-lounge.jpg',
      locationBadge: '📱 Late-Night Velvet Booth & Glow • 10:05 PM',
      ambientTint: 'from-fuchsia-950/40 via-slate-950/50 to-[#140924]/90',
      vibeReadHer: 'Phone face-down on the table—direct adult communication beats streak games every time.',
      vibeReadHim: 'Drop the slang, hold steady eye contact, and lock in real plans like a grown man.',
    };
  }

  return {
    imageUrl: './images/scenes/wine-bar-booth.jpg',
    locationBadge: '🍷 Candlelit Corner Booth • Friday 8:20 PM',
    ambientTint: 'from-rose-950/40 via-slate-950/45 to-[#140924]/90',
    vibeReadHer: 'Candlelight flickers across two glasses—you can tell in 30 seconds if he owns his frame.',
    vibeReadHim: 'Warm booth glow and lingering eye contact—lead with generosity and zero games.',
  };
}

/**
 * Deterministically shuffles [0, 1, 2] per episode ID so Choice #1 isn't predictably
 * always the winning button, while passing the original choice index to gameEngine.
 */
function getShuffledChoiceOrder(episodeId: string): number[] {
  let hash = 2166136261;
  for (let i = 0; i < episodeId.length; i += 1) {
    hash ^= episodeId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const permutations: [number, number, number][] = [
    [0, 1, 2],
    [1, 0, 2],
    [2, 0, 1],
    [0, 2, 1],
    [1, 2, 0],
    [2, 1, 0],
  ];
  return permutations[(hash >>> 0) % permutations.length];
}

function getAffinityLevel(stats: Stats): { level: number; title: string; pct: number } {
  const avg = Math.round((stats.maturity + stats.chivalry + stats.eq + stats.chemistry) / 4);
  if (avg >= 85) return { level: 5, title: 'Soulmate Lock', pct: Math.min(100, avg) };
  if (avg >= 72) return { level: 4, title: 'Sanctuary Keyholder', pct: avg };
  if (avg >= 60) return { level: 3, title: 'Slow-Burn Heat', pct: avg };
  if (avg >= 48) return { level: 2, title: 'Magnetic Spark', pct: avg };
  return { level: 1, title: 'First Glance', pct: Math.max(12, avg) };
}

function getGreenFlagStreak(history: GameRunState['history']): number {
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const h = history[i];
    if (h.toastBanner.includes('RED FLAG') || h.toastBanner.includes('VETTING GATE')) {
      break;
    }
    streak += 1;
  }
  return streak;
}

export const EpisodeStage: React.FC<EpisodeStageProps> = ({
  run,
  credits,
  onSelectChoice,
  onCompleteMinigame,
  onRewindLast,
  onShareDilemma,
  onOpenBoutique,
  onFinishRun,
}) => {
  const [showingOutcomeForEpId, setShowingOutcomeForEpId] = useState<string | null>(null);
  const [crowdPcts, setCrowdPcts] = useState<number[]>(() =>
    getLocalChoicePercentagesSync('check-drop', 3),
  );
  const [particleBurst, setParticleBurst] = useState<string | null>(null);
  const [statFlyups, setStatFlyups] = useState<{ id: string; text: string; positive: boolean }[]>(
    [],
  );
  const [stageReaction, setStageReaction] = useState<'idle' | 'green' | 'red'>('idle');
  const [vibeCheckedEpIds, setVibeCheckedEpIds] = useState<Record<string, boolean>>({});
  const [answeredTriviaEpIds, setAnsweredTriviaEpIds] = useState<Record<string, number>>({});
  const [speakingEpId, setSpeakingEpId] = useState<string | null>(null);
  const stopVoiceRef = useRef<(() => void) | null>(null);

  const currentEpisode: Episode | undefined = run.episodeQueue[run.currentEpisodeIndex];
  const role = run.pairing.role;

  // Intersperse a breezy Pop-Culture Cougar/Cub Trivia card every 3rd episode (indices 2, 5, 8)
  const showInterludeTrivia =
    run.episodeQueue.length >= 4 &&
    (run.currentEpisodeIndex === 2 ||
      run.currentEpisodeIndex === 5 ||
      run.currentEpisodeIndex === 8);
  const interludeQuestion =
    POP_CULTURE_TRIVIA[run.currentEpisodeIndex % POP_CULTURE_TRIVIA.length];

  const lastEntry =
    showingOutcomeForEpId && run.history.length > 0
      ? run.history[run.history.length - 1]
      : null;
  const resolvedEpisode = lastEntry
    ? EPISODES.find((e) => e.id === lastEntry.episodeId)
    : undefined;
  const resolvedChoice =
    resolvedEpisode && lastEntry ? resolvedEpisode.choices[lastEntry.choiceIndex] : undefined;

  const displayedEpisode = resolvedEpisode ?? currentEpisode;
  const sceneSpec = useMemo(
    () => (displayedEpisode ? getSceneVisualSpec(displayedEpisode) : null),
    [displayedEpisode],
  );

  const shuffledIndices = useMemo(
    () => (currentEpisode ? getShuffledChoiceOrder(currentEpisode.id) : [0, 1, 2]),
    [currentEpisode],
  );

  const activeEpIdForStats = resolvedEpisode?.id ?? currentEpisode?.id ?? 'check-drop';
  const activeStage: RelationshipStage = resolvedEpisode?.stage ?? currentEpisode?.stage ?? 1;

  useEffect(() => {
    return () => {
      stopVoiceRef.current?.();
    };
  }, []);

  useEffect(() => {
    stopVoiceRef.current?.();
    setSpeakingEpId(null);
  }, [activeEpIdForStats, showingOutcomeForEpId]);

  useEffect(() => {
    let cancelled = false;
    const syncBase = getLocalChoicePercentagesSync(activeEpIdForStats, 3);
    setCrowdPcts(syncBase);
    localCrowdStatsService.getChoicePercentages(activeEpIdForStats, 3).then((live) => {
      if (!cancelled && live.join(',') !== syncBase.join(',')) {
        setCrowdPcts(live);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeEpIdForStats]);

  const handlePick = (idx: number) => {
    if (!currentEpisode) return;
    stopVoiceRef.current?.();
    setSpeakingEpId(null);

    const picked = currentEpisode.choices[idx];
    const flyups: { id: string; text: string; positive: boolean }[] = [];

    if (picked) {
      const { chemistry, chivalry, eq, maturity, redFlags } = picked.deltas;
      if (chemistry !== 0) {
        flyups.push({
          id: 'chem',
          text: `${chemistry > 0 ? '+' : ''}${chemistry} CHEMISTRY 🔥`,
          positive: chemistry > 0,
        });
      }
      if (chivalry !== 0) {
        flyups.push({
          id: 'chiv',
          text: `${chivalry > 0 ? '+' : ''}${chivalry} CHIVALRY 🥂`,
          positive: chivalry > 0,
        });
      } else if (eq !== 0) {
        flyups.push({
          id: 'eq',
          text: `${eq > 0 ? '+' : ''}${eq} EQ 💬`,
          positive: eq > 0,
        });
      } else if (maturity !== 0) {
        flyups.push({
          id: 'mat',
          text: `${maturity > 0 ? '+' : ''}${maturity} MATURITY ✨`,
          positive: maturity > 0,
        });
      }

      if (redFlags > 0) {
        sfx.redFlag();
        setStageReaction('red');
        setParticleBurst('🚩😬💔');
      } else {
        sfx.greenFlag();
        setStageReaction('green');
        setParticleBurst('💖🔥🥂✨');
      }
    }

    setStatFlyups(flyups.slice(0, 2));
    window.setTimeout(() => {
      setParticleBurst(null);
      setStatFlyups([]);
    }, 1350);

    setShowingOutcomeForEpId(currentEpisode.id);
    onSelectChoice(idx);
    localCrowdStatsService.recordChoice(currentEpisode.id, idx);
  };

  const handleRewindClick = () => {
    if (onRewindLast()) {
      sfx.messagePop();
      setStageReaction('idle');
      setShowingOutcomeForEpId(null);
    }
  };

  const handleToggleSceneVoice = () => {
    if (!displayedEpisode) return;
    if (speakingEpId === displayedEpisode.id) {
      stopVoiceRef.current?.();
      setSpeakingEpId(null);
      return;
    }
    stopVoiceRef.current?.();
    const rawLine = lastEntry
      ? lastEntry.outcomeText
      : personalizeText(
          role === 'her' ? displayedEpisode.setupHer : displayedEpisode.setupHim,
          run.pairing,
        );
    setSpeakingEpId(displayedEpisode.id);
    stopVoiceRef.current = playVoiceNotePreview(
      rawLine,
      role === 'her' ? 'her' : 'green_cub',
      () => setSpeakingEpId(null),
    );
  };

  const handleTapChemistrySpark = () => {
    if (!currentEpisode) return;
    sfx.hotspotFix();
    setParticleBurst('✨💓🔥');
    window.setTimeout(() => setParticleBurst(null), 900);
    setVibeCheckedEpIds((prev) => ({ ...prev, [currentEpisode.id]: true }));
  };

  const affinity = getAffinityLevel(run.stats);
  const streak = getGreenFlagStreak(run.history);

  const statItems: [string, number, string][] = [
    ['Maturity', run.stats.maturity, 'bg-rose-500'],
    ['Chivalry', run.stats.chivalry, 'bg-amber-400'],
    ['EQ / Consent', run.stats.eq, 'bg-teal-400'],
    ['Chemistry', run.stats.chemistry, 'bg-pink-500'],
  ];

  const affiliate = getAffiliateById(resolvedEpisode?.recommendedAffiliateId);
  const liveTipUrl = MONETIZATION_CONFIG.tipJarUrl || MONETIZATION_CONFIG.kofiUrl;

  const isRedOutcome =
    Boolean(lastEntry) &&
    (lastEntry!.toastBanner.includes('RED FLAG') ||
      lastEntry!.toastBanner.includes('VETTING GATE'));

  const cleanStoryTag = currentEpisode
    ? currentEpisode.subredditThreadInspiration.startsWith('r/CougarsAndCubs')
      ? `💬 Real Age-Gap Lore • ${currentEpisode.subredditThreadInspiration.replace(
          /^r\/CougarsAndCubs[^:]*:\s*/i,
          '',
        )}`
      : `🎬 ${currentEpisode.subredditThreadInspiration}`
    : '';

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Gamified Arcade HUD: Affinity Level XP Bar + Live Streak + 6-Stage Stepper */}
      <div className="vice-panel rounded-2xl bg-[#160c24] p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                {run.pairing.badgeLabel} • Scene{' '}
                {Math.min(run.currentEpisodeIndex + 1, run.episodeQueue.length)} of{' '}
                {run.episodeQueue.length}
              </span>
              {streak >= 2 && (
                <span className="animate-combo-pulse inline-flex items-center gap-1 rounded-full border border-amber-300 bg-gradient-to-r from-amber-400 to-rose-500 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-950 shadow">
                  <Flame className="h-3 w-3" /> {streak}x Streak!
                </span>
              )}
            </div>
            <div className="text-[11px] font-semibold text-pink-300">
              {RELATIONSHIP_STAGE_LABELS[activeStage]}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Affinity Level Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-pink-400/35 bg-pink-950/40 px-2.5 py-1">
              <Heart className="h-3.5 w-3.5 text-pink-400 fill-pink-400" />
              <div>
                <div className="text-[10px] font-extrabold uppercase text-pink-200 leading-none">
                  Lv.{affinity.level} • {affinity.title}
                </div>
                <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-black/60">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-amber-300 transition-all duration-500"
                    style={{ width: `${affinity.pct}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-extrabold">
              <span className="text-slate-300">Strikes:</span>
              {[0, 1, 2].map((strike) => (
                <span key={strike} className="text-base">
                  {strike < run.redFlags ? '🚩' : '⬜'}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 6-Stage Relationship Stepper */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {STAGE_PILLS.map(({ stage: st, short }) => {
            const reached = st <= activeStage;
            const current = st === activeStage;
            return (
              <div
                key={st}
                className={`rounded-lg px-2 py-1 text-center text-[10px] font-extrabold transition ${
                  current
                    ? st === 5
                      ? 'bg-gradient-to-r from-fuchsia-500 to-rose-400 text-white shadow ring-1 ring-amber-300'
                      : 'bg-gradient-to-r from-rose-500 to-amber-400 text-slate-950 shadow'
                    : reached
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/30'
                      : 'bg-black/40 text-slate-500'
                }`}
              >
                {short}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-0.5">
          {statItems.map(([label, val, barColor]) => (
            <div key={label}>
              <div className="flex justify-between text-xs font-bold text-slate-200">
                <span>{label}</span>
                <span>{val}</span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-800 border border-black">
                <div
                  className={`h-full ${barColor} transition-all duration-500`}
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CINEMATIC WIDESCREEN VISUAL-NOVEL STAGE (Ken-Burns Backdrop + Animated Character Sprites + Arcade Flyups) */}
      {sceneSpec && (
        <div
          className={`vice-panel relative h-64 sm:h-80 w-full overflow-hidden rounded-3xl border-2 border-black bg-[#0d0718] ${
            stageReaction === 'red' && lastEntry ? 'animate-screen-shake ring-2 ring-rose-500' : ''
          } ${stageReaction === 'green' && lastEntry ? 'ring-2 ring-amber-300' : ''}`}
        >
          {/* Animated Ken-Burns Scene Backdrop */}
          <img
            key={sceneSpec.imageUrl}
            src={sceneSpec.imageUrl}
            alt={sceneSpec.locationBadge}
            className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-b ${sceneSpec.ambientTint}`}
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0b0614] via-[#0b0614]/75 to-transparent" />

          {/* Top Bar: Location & Time Badge + Hear Scene Voiceover */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-[11px] font-extrabold text-amber-200 backdrop-blur-md shadow">
              {sceneSpec.locationBadge}
            </span>

            <button
              type="button"
              onClick={handleToggleSceneVoice}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/70 px-3 py-1 text-[11px] font-extrabold text-teal-200 hover:bg-black/90 backdrop-blur-md cursor-pointer"
            >
              {speakingEpId === displayedEpisode?.id ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-rose-300" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-teal-300" />
                  <span>Hear Scene</span>
                </>
              )}
            </button>
          </div>

          {/* Floating Particle Burst & Arcade Stat Fly-Ups */}
          {particleBurst && (
            <div className="pointer-events-none absolute inset-x-0 top-14 z-30 text-center text-4xl sm:text-5xl animate-float-particle drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {particleBurst}
            </div>
          )}

          {statFlyups.length > 0 && (
            <div className="pointer-events-none absolute inset-x-0 top-16 z-30 flex flex-col items-center gap-1.5">
              {statFlyups.map((f) => (
                <span
                  key={f.id}
                  className={`animate-stat-flyup rounded-full border-2 border-black px-3.5 py-1 text-xs sm:text-sm font-black shadow-[3px_3px_0px_#09050f] ${
                    f.positive
                      ? 'bg-gradient-to-r from-amber-300 to-pink-400 text-slate-950'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {f.text}
                </span>
              ))}
            </div>
          )}

          {/* Center-Stage Interactive Spark Button OR Outcome Stamp */}
          <div className="pointer-events-none absolute inset-x-0 bottom-20 sm:bottom-24 z-20 flex justify-center px-3">
            {lastEntry ? (
              <div
                className={`rounded-2xl border-2 border-black px-4 py-1.5 font-display text-xl sm:text-2xl tracking-wide shadow-[4px_4px_0px_#09050f] transition-transform duration-300 ${
                  isRedOutcome
                    ? '-rotate-3 bg-rose-600 text-white'
                    : 'rotate-1 bg-gradient-to-r from-amber-300 via-pink-300 to-teal-300 text-slate-950'
                }`}
              >
                {isRedOutcome ? '🚩 ICK ALERT!' : '💖 SPARKS FLYING!'}
              </div>
            ) : currentEpisode && !vibeCheckedEpIds[currentEpisode.id] ? (
              <button
                type="button"
                onClick={handleTapChemistrySpark}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border-2 border-amber-300 bg-black/80 px-3.5 py-1.5 text-[11px] font-extrabold text-amber-200 shadow-[3px_3px_0px_#09050f] hover:scale-105 hover:bg-rose-950/90 transition cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Tap to Read Body Language</span>
              </button>
            ) : null}
          </div>

          {/* Foreground Expressive Character Sprites (Glide Closer on Green Flag, Recoil on Red Flag!) */}
          <div className="absolute inset-x-3 sm:inset-x-6 bottom-2.5 z-20 flex items-end justify-between gap-2">
            {/* HER SPRITE */}
            <div
              className={`flex items-end gap-2.5 transition-all duration-500 ${
                lastEntry
                  ? isRedOutcome
                    ? '-translate-x-2 -rotate-2 opacity-90'
                    : 'translate-x-3 sm:translate-x-8 scale-105'
                  : ''
              }`}
            >
              <div className="relative">
                <img
                  src={run.pairing.her.photoUrl}
                  alt={run.pairing.her.name}
                  className={`h-24 w-20 sm:h-32 sm:w-26 rounded-2xl object-cover object-top border-2 shadow-[4px_4px_0px_#09050f] ${
                    role === 'her'
                      ? 'border-amber-300 ring-2 ring-rose-400'
                      : 'border-rose-400/80'
                  }`}
                />
                <span className="absolute -top-2.5 -right-2 rounded-full border border-black bg-rose-500 px-2 py-0.5 text-[10px] font-extrabold text-white shadow">
                  {lastEntry
                    ? isRedOutcome
                      ? '😒 Unimpressed'
                      : '😻 Smitten'
                    : role === 'her'
                      ? '🐆 You'
                      : '😼 Vetting'}
                </span>
              </div>
              <div className="pb-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                <div className="font-display text-xl sm:text-2xl text-white leading-none">
                  {run.pairing.her.name}, {run.pairing.her.age}F
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-rose-200">
                  {run.pairing.her.title}
                </div>
              </div>
            </div>

            {/* HIS SPRITE */}
            <div
              className={`flex items-end gap-2.5 text-right transition-all duration-500 ${
                lastEntry
                  ? isRedOutcome
                    ? 'translate-x-2 rotate-2 opacity-85'
                    : '-translate-x-3 sm:-translate-x-8 scale-105'
                  : ''
              }`}
            >
              <div className="pb-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                <div className="font-display text-xl sm:text-2xl text-white leading-none">
                  {run.pairing.his.name}, {run.pairing.his.age}M
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-teal-200">
                  {run.pairing.his.title}
                </div>
              </div>
              <div className="relative">
                <img
                  src={run.pairing.his.photoUrl}
                  alt={run.pairing.his.name}
                  className={`h-24 w-20 sm:h-32 sm:w-26 rounded-2xl object-cover object-top border-2 shadow-[4px_4px_0px_#09050f] ${
                    role === 'him'
                      ? 'border-amber-300 ring-2 ring-teal-400'
                      : 'border-teal-400/80'
                  }`}
                />
                <span className="absolute -top-2.5 -left-2 rounded-full border border-black bg-teal-400 px-2 py-0.5 text-[10px] font-extrabold text-slate-950 shadow">
                  {lastEntry
                    ? isRedOutcome
                      ? '😬 Busted'
                      : '🔥 Locked In'
                    : role === 'him'
                      ? '🔥 You'
                      : '✨ Courting'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Body-Language Cue Drawer (Revealed when player taps "Tap to Read Body Language") */}
      {!lastEntry && currentEpisode && sceneSpec && vibeCheckedEpIds[currentEpisode.id] && (
        <div className="animate-stage-in rounded-2xl border-2 border-amber-400/60 bg-gradient-to-r from-amber-950/50 via-[#1f1034] to-teal-950/50 px-4 py-3 text-xs sm:text-sm text-amber-100 flex items-center justify-between gap-3">
          <span>
            <strong className="text-amber-300">👀 Live Room Read:</strong>{' '}
            {role === 'her' ? sceneSpec.vibeReadHer : sceneSpec.vibeReadHim}
          </span>
          <span className="shrink-0 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-amber-300">
            Chemistry Ready
          </span>
        </div>
      )}

      {/* Outcome / Toast Transition Card */}
      {lastEntry && resolvedEpisode ? (
        <div className="vice-panel animate-stage-in rounded-3xl bg-[#1b0f2e] p-5 sm:p-7 space-y-4">
          <div
            className={`vice-toast inline-block rounded-xl border-2 border-black px-4 py-2 font-display text-2xl ${
              isRedOutcome ? 'bg-rose-600 text-white' : 'bg-amber-400 text-slate-950'
            }`}
          >
            ⚡ {lastEntry.toastBanner}
          </div>

          {lastEntry.badgeUnlocked && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-950/50 px-3 py-1.5 text-xs font-extrabold text-emerald-200 ml-2">
              <Award className="h-4 w-4 text-amber-300" />
              <span>Badge Unlocked: {lastEntry.badgeUnlocked}</span>
            </div>
          )}

          <h3 className="font-display text-3xl text-white">{resolvedEpisode.title}</h3>
          <p className="text-sm sm:text-base leading-relaxed text-slate-100">
            {renderRichText(lastEntry.outcomeText)}
          </p>

          <div className="rounded-xl bg-black/40 px-3.5 py-2 text-xs text-teal-300 font-semibold">
            📊 Global Club Pulse: {crowdPcts[lastEntry.choiceIndex] ?? 48}% of players chose this
            exact move.
          </div>

          {/* Peak-Laugh Tip Prompt */}
          {resolvedChoice?.triggerTipPrompt && Boolean(lastEntry.badgeUnlocked) && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-pink-400/50 bg-pink-950/50 p-3.5">
              <div className="text-xs text-pink-100">
                <strong>🍸 Lived this exact moment in real life?</strong> Toss an Espresso Martini
                in the Creator Lounge!
              </div>
              {liveTipUrl ? (
                <a
                  href={liveTipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-pink-500 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-[2px_2px_0px_#09050f] hover:bg-pink-400"
                >
                  <Coffee className="h-3.5 w-3.5" />
                  <span>Send a Martini Tip</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onOpenBoutique}
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-pink-500 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-[2px_2px_0px_#09050f] hover:bg-pink-400 cursor-pointer"
                >
                  <Coffee className="h-3.5 w-3.5" />
                  <span>Open Creator Lounge</span>
                </button>
              )}
            </div>
          )}

          {/* Contextual Club Boutique Affiliate Drop */}
          {affiliate && (
            <div className="rounded-2xl border-2 border-black bg-[#101e2b] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-300">
                  🛍️ Cougars &amp; Cubs Club Pick • {affiliate.badge}
                </span>
                <div className="mt-1 text-sm font-bold text-white">
                  {affiliate.name} ({affiliate.priceDisplay})
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{affiliate.cheekyPitch}</p>
              </div>
              <a
                href={buildAffiliateUrl(affiliate, `scene_${resolvedEpisode.id}`)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-teal-400 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-[3px_3px_0px_#09050f] hover:bg-teal-300"
              >
                <span>Shop Pick</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleRewindClick}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-slate-800 px-4 py-2.5 text-xs font-extrabold text-amber-300 hover:bg-slate-700 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Smooth Rewind (1 Credit • {credits} left)</span>
            </button>

            {run.status === 'busted' ? (
              <button
                type="button"
                onClick={() => {
                  sfx.redFlag();
                  onFinishRun();
                }}
                className="vice-panel rounded-2xl bg-rose-600 px-6 py-3 font-display text-2xl text-white hover:bg-rose-500 cursor-pointer"
              >
                3 Strikes! See Vibe Receipt →
              </button>
            ) : run.status === 'completed' ? (
              <button
                type="button"
                onClick={() => {
                  sfx.victoryFanfare();
                  onFinishRun();
                }}
                className="vice-panel rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 px-6 py-3 font-display text-2xl text-slate-950 hover:brightness-110 cursor-pointer"
              >
                See Official Vibe Receipt →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sfx.messagePop();
                  setStageReaction('idle');
                  setShowingOutcomeForEpId(null);
                }}
                className="vice-panel rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-3 font-display text-2xl text-slate-950 hover:brightness-110 cursor-pointer"
              >
                Next Stage Scene →
              </button>
            )}
          </div>
        </div>
      ) : currentEpisode ? (
        <div key={currentEpisode.id} className="space-y-4 animate-stage-in">
          {/* Interspersed Pop-Culture Cougar & Cub Trivia Bonus Card */}
          {showInterludeTrivia && interludeQuestion && (
            <div className="vice-panel rounded-2xl bg-gradient-to-r from-[#2c113b] via-[#1c1332] to-[#0f252e] p-4 space-y-3 border-2 border-pink-400/60">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  <Award className="h-4 w-4 text-pink-300" /> Pop-Culture Bonus Round •{' '}
                  {interludeQuestion.badge}
                </span>
                <span className="text-[11px] font-bold text-teal-300">
                  Bonus +6 Chemistry for Correct Hit!
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white">
                {renderRichText(interludeQuestion.question)}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {interludeQuestion.options.map((opt, oIdx) => {
                  const picked = answeredTriviaEpIds[currentEpisode.id];
                  const hasPicked = typeof picked === 'number';
                  const isCorrect = oIdx === interludeQuestion.correctIndex;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={hasPicked}
                      onClick={() => {
                        setAnsweredTriviaEpIds((prev) => ({ ...prev, [currentEpisode.id]: oIdx }));
                        if (isCorrect) {
                          sfx.greenFlag();
                          onCompleteMinigame(
                            `trivia_${currentEpisode.id}`,
                            { chemistry: 6 },
                            'Pop-Culture Cougar Scholar',
                          );
                        } else {
                          sfx.redFlag();
                        }
                      }}
                      className={`flex items-center justify-between rounded-xl border-2 px-3 py-2 text-left text-xs font-bold transition cursor-pointer ${
                        !hasPicked
                          ? 'border-black bg-black/50 text-slate-100 hover:bg-black/75'
                          : isCorrect
                            ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200'
                            : picked === oIdx
                              ? 'border-rose-500 bg-rose-950/70 text-rose-200'
                              : 'border-black/40 bg-black/25 text-slate-500'
                      }`}
                    >
                      <span>{opt}</span>
                      {hasPicked && isCorrect && (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                      )}
                    </button>
                  );
                })}
              </div>
              {typeof answeredTriviaEpIds[currentEpisode.id] === 'number' && (
                <p className="text-xs text-amber-200 leading-relaxed">
                  {renderRichText(interludeQuestion.funFact)}
                </p>
              )}
            </div>
          )}

          <div className="vice-panel rounded-3xl bg-[#180d28] p-5 sm:p-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-pink-300">
                {renderRichText(cleanStoryTag)}
              </span>
              <button
                type="button"
                onClick={() => onShareDilemma(currentEpisode.id, currentEpisode.title)}
                className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-slate-800 px-2.5 py-1 text-xs font-bold text-teal-300 hover:bg-slate-700 cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Ask Bestie: Ghost or Train?</span>
              </button>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl text-white">
              {currentEpisode.title}
            </h2>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm sm:text-base leading-relaxed text-slate-100">
              {renderRichText(
                personalizeText(
                  role === 'her' ? currentEpisode.setupHer : currentEpisode.setupHim,
                  run.pairing,
                ),
              )}
            </div>

            {/* Interactive Playable Arcade Minigame Widget */}
            {currentEpisode.minigame && (
              <MinigameWidget
                type={currentEpisode.minigame}
                alreadyCompleted={run.completedMinigameEpisodeIds.includes(currentEpisode.id)}
                herName={run.pairing.her.name}
                hisName={run.pairing.his.name}
                onWinBonus={(bonus, badge) => onCompleteMinigame(currentEpisode.id, bonus, badge)}
              />
            )}

            {/* Brain-to-Mouth Generational Code-Switch Box */}
            {currentEpisode.codeSwitchRawImpulse && (
              <div className="rounded-2xl border-2 border-amber-400 bg-amber-950/40 p-4 space-y-1.5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  🧠 Cub Brain-to-Mouth Code-Switch Filter
                </div>
                <p className="font-mono text-xs sm:text-sm text-white bg-black/50 rounded-lg px-3 py-2">
                  Raw Unfiltered Impulse: &ldquo;
                  {renderRichText(currentEpisode.codeSwitchRawImpulse.rawThought)}&rdquo;
                </p>
                <p className="text-xs text-amber-200">
                  ⚠️ {renderRichText(currentEpisode.codeSwitchRawImpulse.warningNote)}
                </p>
              </div>
            )}

            {/* Symmetric Inner-Insecurity Split Thought Bubbles */}
            {currentEpisode.innerInsecurityBubble && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-pink-400/50 bg-pink-950/40 p-3.5">
                  <div className="text-[11px] font-extrabold uppercase text-pink-300">
                    💭 {run.pairing.her.name}’s Silent Mirror Doubt
                  </div>
                  <p className="mt-1 text-xs italic text-slate-100 leading-relaxed">
                    {renderRichText(
                      personalizeText(currentEpisode.innerInsecurityBubble.herDoubt, run.pairing),
                    )}
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-teal-400/50 bg-teal-950/40 p-3.5">
                  <div className="text-[11px] font-extrabold uppercase text-teal-300">
                    💭 {run.pairing.his.name}’s Simultaneous Game Doubt
                  </div>
                  <p className="mt-1 text-xs italic text-slate-100 leading-relaxed">
                    {renderRichText(
                      personalizeText(currentEpisode.innerInsecurityBubble.hisDoubt, run.pairing),
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Deterministically Shuffled Action Move Cards (No Predictable "Option A Always Wins" Quiz!) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-amber-300">
                <span>🎯 Choose Your Play</span>
                <span className="text-[11px] text-slate-400">
                  {role === 'her' ? 'Vet His Instincts & Set the Standard' : 'Make Your Move'}
                </span>
              </div>

              {shuffledIndices.map((originalIdx, displayPosition) => {
                const choice = currentEpisode.choices[originalIdx];
                if (!choice) return null;
                const houseboyGateWarning =
                  currentEpisode.id === 'houseboy-sunday-sanctuary' &&
                  originalIdx === 0 &&
                  (run.stats.maturity < 60 || run.stats.eq < 60);

                return (
                  <button
                    key={originalIdx}
                    type="button"
                    onClick={() => handlePick(originalIdx)}
                    className="group w-full rounded-2xl border-2 border-black bg-gradient-to-r from-[#24143c] to-[#1c1232] p-4 text-left text-sm font-semibold text-white shadow-[4px_4px_0px_#09050f] hover:-translate-y-0.5 hover:from-[#321b54] hover:to-[#241744] hover:border-amber-400 active:translate-y-0.5 transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0 inline-flex h-7 px-2.5 items-center justify-center rounded-lg border border-black bg-amber-400 text-[11px] font-black uppercase text-slate-950 group-hover:bg-pink-300 transition">
                        Play {displayPosition + 1}
                      </span>
                      <span className="leading-relaxed">
                        {renderRichText(
                          personalizeText(
                            role === 'her' ? choice.labelHer : choice.labelHim,
                            run.pairing,
                          ),
                        )}
                        {houseboyGateWarning && (
                          <span className="ml-2 inline-block rounded bg-rose-500/30 px-2 py-0.5 text-[11px] font-bold text-rose-200">
                            🔒 Tip: Fix all 4 Sanctuary Upgrades above to clear 60+ Maturity &amp;
                            EQ!
                          </span>
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
