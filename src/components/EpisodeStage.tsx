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
  { stage: 3, short: '3·Sanctuary' },
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
      ambientTint: 'from-slate-950/30 via-slate-950/40 to-[#0e091a]/92',
      vibeReadHer: 'Steam curls off the water—his shoulders relax, holding warm eye contact without rushing.',
      vibeReadHim: 'Candlelight catches her smile through the pool mist—zero small-talk nerves, pure magnetism.',
    };
  }
  if (id.includes('campus') || id.includes('sushi') || id.includes('dutch-calculator')) {
    return {
      imageUrl: './images/scenes/campus-autumn-sushi.jpg',
      locationBadge: '🍣 Lantern Quad & Omakase Sushi Counter • 7:45 PM',
      ambientTint: 'from-slate-950/30 via-slate-950/45 to-[#0e091a]/92',
      vibeReadHer: 'Warm sake steam & cedar counter glow—one playful raised eyebrow sets the entire pace.',
      vibeReadHim: 'Sneakers on brick quadstones, sharp wit across the sushi bar—every cue is live.',
    };
  }
  if (id.includes('bowling')) {
    return {
      imageUrl: './images/scenes/neon-bowling-lounge.jpg',
      locationBadge: '🎳 Retro Neon Bowling & Jukebox Lounge • 9:30 PM',
      ambientTint: 'from-slate-950/30 via-slate-950/45 to-[#0e091a]/92',
      vibeReadHer: 'Magenta neon gleams off the hardwood lane—he’s hyping your spare like the NBA Finals.',
      vibeReadHim: 'She laces up retro bowling shoes laughing—playful trash talk beats stiff steakhouses.',
    };
  }
  if (id.includes('picnic') || id.includes('dog-park') || ep.sceneArt === 'trader_joes_aisle') {
    return {
      imageUrl: './images/cast/dog-park-picnic.jpg',
      locationBadge: '🧺 Golden-Hour Meadow & Park Stroll • 5:15 PM',
      ambientTint: 'from-slate-950/25 via-slate-950/45 to-[#0e091a]/92',
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
      ambientTint: 'from-slate-950/30 via-slate-950/45 to-[#0e091a]/92',
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
      ambientTint: 'from-slate-950/30 via-slate-950/45 to-[#0e091a]/92',
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
      ambientTint: 'from-slate-950/25 via-slate-950/45 to-[#0e091a]/92',
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
      ambientTint: 'from-slate-950/30 via-slate-950/45 to-[#0e091a]/92',
      vibeReadHer: 'Rain on glass and amber lamplight—unguarded honesty matters ten times more than lines.',
      vibeReadHim: 'Quiet sanctuary hours—listen deeply, keep ego at zero, and let closeness breathe.',
    };
  }
  if (ep.sceneArt === 'princess_bouquet' || id.includes('foreign')) {
    return {
      imageUrl: './images/scenes/coastal-convertible.jpg',
      locationBadge: '🌅 Coastal Sunset Overlook & Wine Lounge • 6:40 PM',
      ambientTint: 'from-slate-950/25 via-slate-950/45 to-[#0e091a]/92',
      vibeReadHer: 'Peonies on the passenger seat and ocean breeze—let someone else drive for once.',
      vibeReadHim: 'Passenger door opened, playlist dialed—lead with warmth and zero hesitation.',
    };
  }
  if (ep.sceneArt === 'waiter_shock' || id.includes('gala') || id.includes('wedding')) {
    return {
      imageUrl: './images/scenes/wedding-gala-cheers.jpg',
      locationBadge: '🥂 Skyline Lounge & Velvet Rope • 9:10 PM',
      ambientTint: 'from-slate-950/30 via-slate-950/45 to-[#0e091a]/92',
      vibeReadHer: 'Every head turns as you step inside—calm, amused pride makes a couple untouchable.',
      vibeReadHim: 'Hand steady at her waist—turn every double-take into your favorite shared joke.',
    };
  }
  if (ep.sceneArt === 'code_switch_phone') {
    return {
      imageUrl: './images/scenes/neon-bowling-lounge.jpg',
      locationBadge: '📱 Late-Night Velvet Booth & Glow • 10:05 PM',
      ambientTint: 'from-slate-950/30 via-slate-950/45 to-[#0e091a]/92',
      vibeReadHer: 'Phone face-down on the table—direct adult communication beats streak games every time.',
      vibeReadHim: 'Drop the slang, hold steady eye contact, and lock in real plans like a grown man.',
    };
  }

  return {
    imageUrl: './images/scenes/wine-bar-booth.jpg',
    locationBadge: '🍷 Candlelit Corner Booth • Friday 8:20 PM',
    ambientTint: 'from-slate-950/30 via-slate-950/45 to-[#0e091a]/92',
    vibeReadHer: 'Candlelight flickers across two glasses—you can tell in 30 seconds if he owns his frame.',
    vibeReadHim: 'Warm booth glow and lingering eye contact—lead with generosity and zero games.',
  };
}

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
  return { level: 1, title: 'First Glance', pct: Math.max(15, avg) };
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
          text: `${chemistry > 0 ? '+' : ''}${chemistry} Chemistry 🔥`,
          positive: chemistry > 0,
        });
      }
      if (chivalry !== 0) {
        flyups.push({
          id: 'chiv',
          text: `${chivalry > 0 ? '+' : ''}${chivalry} Chivalry 🥂`,
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
          text: `${maturity > 0 ? '+' : ''}${maturity} Maturity ✨`,
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
    }, 1450);

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

  const statItems: [string, number, number | undefined, string][] = [
    ['Maturity', run.stats.maturity, resolvedChoice?.deltas.maturity, 'from-rose-400 to-rose-500'],
    ['Chivalry', run.stats.chivalry, resolvedChoice?.deltas.chivalry, 'from-amber-300 to-amber-500'],
    ['EQ / Consent', run.stats.eq, resolvedChoice?.deltas.eq, 'from-emerald-300 to-emerald-500'],
    ['Chemistry', run.stats.chemistry, resolvedChoice?.deltas.chemistry, 'from-pink-400 to-rose-500'],
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
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Gamified Relationship HUD */}
      <div className="vice-panel rounded-3xl bg-[#150f24]/90 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">
                {run.pairing.badgeLabel} • Scene{' '}
                {Math.min(run.currentEpisodeIndex + 1, run.episodeQueue.length)} of{' '}
                {run.episodeQueue.length}
              </span>
              {streak >= 2 && (
                <span className="animate-combo-pulse inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 to-rose-400 px-3 py-0.5 text-xs font-extrabold text-slate-950 shadow">
                  <Flame className="h-3.5 w-3.5" /> {streak}x Streak
                </span>
              )}
            </div>
            <div className="text-sm font-medium text-rose-200">
              {RELATIONSHIP_STAGE_LABELS[activeStage]}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Affinity XP Meter */}
            <div className="flex items-center gap-2.5 rounded-2xl border border-rose-400/25 bg-white/5 px-3.5 py-2">
              <Heart className="h-4 w-4 text-rose-400 fill-rose-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-amber-200 leading-none">
                  Lv.{affinity.level} • {affinity.title}
                </div>
                <div className="mt-1.5 h-2 w-28 overflow-hidden rounded-full bg-black/50">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-300 transition-all duration-500"
                    style={{ width: `${affinity.pct}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs sm:text-sm font-bold">
              <span className="text-slate-300">Strikes:</span>
              {[0, 1, 2].map((strike) => (
                <span key={strike} className="text-base leading-none">
                  {strike < run.redFlags ? '🚩' : '⚪'}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 6-Stage Arc Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {STAGE_PILLS.map(({ stage: st, short }) => {
            const reached = st <= activeStage;
            const current = st === activeStage;
            return (
              <div
                key={st}
                className={`rounded-xl px-2.5 py-1.5 text-center text-xs font-bold transition ${
                  current
                    ? 'bg-gradient-to-r from-rose-500 to-amber-400 text-slate-950 shadow-sm'
                    : reached
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/25'
                      : 'bg-white/5 text-slate-400'
                }`}
              >
                {short}
              </div>
            );
          })}
        </div>

        {/* 4 Live Stat Meters With Outcome Delta Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
          {statItems.map(([label, val, delta, gradClass]) => (
            <div key={label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200">
                <span>{label}</span>
                <span className="inline-flex items-center gap-1.5">
                  <strong className="text-white">{val}</strong>
                  {Boolean(lastEntry) && typeof delta === 'number' && delta !== 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                        delta > 0
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/25 text-rose-300'
                      }`}
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </span>
                  )}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${gradClass} transition-all duration-500`}
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CINEMATIC WIDESCREEN VISUAL STAGE */}
      {sceneSpec && (
        <div
          className={`vice-panel relative h-68 sm:h-84 w-full overflow-hidden rounded-3xl bg-[#0d0718] ${
            stageReaction === 'red' && lastEntry ? 'animate-screen-shake ring-2 ring-rose-500' : ''
          } ${stageReaction === 'green' && lastEntry ? 'ring-2 ring-amber-300/80' : ''}`}
        >
          <img
            key={sceneSpec.imageUrl}
            src={sceneSpec.imageUrl}
            alt={sceneSpec.locationBadge}
            className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${sceneSpec.ambientTint}`} />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b0813] via-[#0b0813]/80 to-transparent" />

          {/* Top Bar: Location Stamp + Hear Scene */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 p-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/65 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-amber-200 backdrop-blur-md">
              {sceneSpec.locationBadge}
            </span>

            <button
              type="button"
              onClick={handleToggleSceneVoice}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/65 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-black/85 backdrop-blur-md transition cursor-pointer"
            >
              {speakingEpId === displayedEpisode?.id ? (
                <>
                  <VolumeX className="h-4 w-4 text-rose-300" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 text-amber-300" />
                  <span>Hear Scene</span>
                </>
              )}
            </button>
          </div>

          {particleBurst && (
            <div className="pointer-events-none absolute inset-x-0 top-14 z-30 text-center text-4xl sm:text-5xl animate-float-particle">
              {particleBurst}
            </div>
          )}

          {statFlyups.length > 0 && (
            <div className="pointer-events-none absolute inset-x-0 top-16 z-30 flex flex-col items-center gap-2">
              {statFlyups.map((f) => (
                <span
                  key={f.id}
                  className={`animate-stat-flyup rounded-full px-4 py-1 text-xs sm:text-sm font-bold shadow-lg ${
                    f.positive
                      ? 'bg-gradient-to-r from-amber-300 to-rose-300 text-slate-950'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {f.text}
                </span>
              ))}
            </div>
          )}

          {/* Center-Stage Interactive Body-Language Cue OR Outcome Stamp */}
          <div className="pointer-events-none absolute inset-x-0 bottom-24 sm:bottom-28 z-20 flex justify-center px-4">
            {lastEntry ? (
              <div
                className={`rounded-2xl px-4 py-1.5 font-display text-lg sm:text-xl shadow-xl transition-transform duration-300 ${
                  isRedOutcome
                    ? '-rotate-2 bg-rose-600 text-white'
                    : 'rotate-1 bg-gradient-to-r from-amber-300 to-rose-300 text-slate-950'
                }`}
              >
                {isRedOutcome ? '🚩 Ick Alert!' : '💖 Sparks Flying!'}
              </div>
            ) : currentEpisode && !vibeCheckedEpIds[currentEpisode.id] ? (
              <button
                type="button"
                onClick={handleTapChemistrySpark}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-black/75 px-4 py-2 text-xs sm:text-sm font-semibold text-amber-200 shadow-lg hover:scale-105 hover:bg-black/90 transition cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Tap to Read Body Language</span>
              </button>
            ) : null}
          </div>

          {/* Foreground Character Portraits */}
          <div className="absolute inset-x-4 sm:inset-x-6 bottom-3 z-20 flex items-end justify-between gap-3">
            {/* HER */}
            <div
              className={`flex items-end gap-3 transition-all duration-500 ${
                lastEntry
                  ? isRedOutcome
                    ? '-translate-x-2 -rotate-1 opacity-90'
                    : 'translate-x-3 sm:translate-x-8 scale-105'
                  : ''
              }`}
            >
              <div className="relative">
                <img
                  src={run.pairing.her.photoUrl}
                  alt={run.pairing.her.name}
                  className={`h-24 w-20 sm:h-32 sm:w-26 rounded-2xl object-cover object-top border-2 shadow-xl ${
                    role === 'her' ? 'border-amber-300' : 'border-rose-400/80'
                  }`}
                />
                <span className="absolute -top-2.5 -right-2 rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-bold text-white shadow">
                  {lastEntry
                    ? isRedOutcome
                      ? '😒 Unimpressed'
                      : '😻 Smitten'
                    : role === 'her'
                      ? '🐆 You'
                      : '😼 Vetting'}
                </span>
              </div>
              <div className="pb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                <div className="font-display text-lg sm:text-2xl text-white">
                  {run.pairing.her.name}, {run.pairing.her.age}F
                </div>
                <div className="text-xs sm:text-sm font-medium text-rose-200">
                  {run.pairing.her.title}
                </div>
              </div>
            </div>

            {/* HIM */}
            <div
              className={`flex items-end gap-3 text-right transition-all duration-500 ${
                lastEntry
                  ? isRedOutcome
                    ? 'translate-x-2 rotate-1 opacity-85'
                    : '-translate-x-3 sm:-translate-x-8 scale-105'
                  : ''
              }`}
            >
              <div className="pb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                <div className="font-display text-lg sm:text-2xl text-white">
                  {run.pairing.his.name}, {run.pairing.his.age}M
                </div>
                <div className="text-xs sm:text-sm font-medium text-amber-200">
                  {run.pairing.his.title}
                </div>
              </div>
              <div className="relative">
                <img
                  src={run.pairing.his.photoUrl}
                  alt={run.pairing.his.name}
                  className={`h-24 w-20 sm:h-32 sm:w-26 rounded-2xl object-cover object-top border-2 shadow-xl ${
                    role === 'him' ? 'border-amber-300' : 'border-amber-200/70'
                  }`}
                />
                <span className="absolute -top-2.5 -left-2 rounded-full bg-amber-300 px-2.5 py-0.5 text-xs font-bold text-slate-950 shadow">
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

      {/* Body-Language Cue Drawer */}
      {!lastEntry && currentEpisode && sceneSpec && vibeCheckedEpIds[currentEpisode.id] && (
        <div className="animate-stage-in rounded-2xl border border-amber-300/35 bg-amber-400/10 px-4 py-3.5 text-sm text-amber-100 flex items-center justify-between gap-3">
          <span>
            <strong className="text-amber-300">👀 Live Room Read:</strong>{' '}
            {role === 'her' ? sceneSpec.vibeReadHer : sceneSpec.vibeReadHim}
          </span>
          <span className="shrink-0 rounded-full bg-amber-300/20 px-3 py-1 text-xs font-bold text-amber-200">
            Chemistry Ready
          </span>
        </div>
      )}

      {/* Outcome Transition Card */}
      {lastEntry && resolvedEpisode ? (
        <div className="vice-panel animate-stage-in rounded-3xl bg-[#161026]/95 p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`vice-toast inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 font-display text-lg sm:text-xl shadow ${
                isRedOutcome ? 'bg-rose-600 text-white' : 'bg-amber-300 text-slate-950'
              }`}
            >
              ⚡ {lastEntry.toastBanner}
            </div>

            {lastEntry.badgeUnlocked && (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-3.5 py-2 text-xs sm:text-sm font-semibold text-emerald-200">
                <Award className="h-4 w-4 text-amber-300" />
                <span>Badge Unlocked: {lastEntry.badgeUnlocked}</span>
              </div>
            )}
          </div>

          <h3 className="font-display text-2xl sm:text-3xl text-white">{resolvedEpisode.title}</h3>
          <p className="text-base sm:text-lg leading-relaxed text-slate-100">
            {renderRichText(lastEntry.outcomeText)}
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 font-medium">
            📊 Global Club Pulse: <strong className="text-amber-300">{crowdPcts[lastEntry.choiceIndex] ?? 48}%</strong> of players chose this move.
          </div>

          {/* Peak-Laugh Tip Prompt */}
          {resolvedChoice?.triggerTipPrompt && Boolean(lastEntry.badgeUnlocked) && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-400/35 bg-rose-500/10 p-4">
              <div className="text-sm text-rose-100">
                <strong>🍸 Lived this exact moment in real life?</strong> Toss an Espresso Martini in the Creator Lounge!
              </div>
              {liveTipUrl ? (
                <a
                  href={liveTipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-400 transition"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Send a Martini Tip</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onOpenBoutique}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-400 transition cursor-pointer"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Open Creator Lounge</span>
                </button>
              )}
            </div>
          )}

          {/* Contextual Boutique Pick */}
          {affiliate && (
            <div className="rounded-2xl border border-white/12 bg-white/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block rounded-full bg-amber-300/20 px-3 py-0.5 text-xs font-bold uppercase text-amber-200">
                  🛍️ Cougars &amp; Cubs Club Pick • {affiliate.badge}
                </span>
                <div className="text-base font-bold text-white">
                  {affiliate.name} ({affiliate.priceDisplay})
                </div>
                <p className="text-sm text-slate-300">{affiliate.cheekyPitch}</p>
              </div>
              <a
                href={buildAffiliateUrl(affiliate, `scene_${resolvedEpisode.id}`)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-2xl bg-amber-300 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-200 transition"
              >
                <span>Shop Pick</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleRewindClick}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-amber-200 hover:bg-white/10 transition cursor-pointer"
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
                className="rounded-2xl bg-rose-600 px-6 py-3.5 font-display text-xl text-white shadow-lg hover:bg-rose-500 transition cursor-pointer"
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
                className="rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 px-6 py-3.5 font-display text-xl text-slate-950 shadow-lg hover:brightness-105 transition cursor-pointer"
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
                className="rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 px-6 py-3.5 font-display text-xl text-slate-950 shadow-lg hover:brightness-105 transition cursor-pointer"
              >
                Next Stage Scene →
              </button>
            )}
          </div>
        </div>
      ) : currentEpisode ? (
        <div key={currentEpisode.id} className="space-y-5 animate-stage-in">
          {/* Pop-Culture Bonus Round */}
          {showInterludeTrivia && interludeQuestion && (
            <div className="vice-panel rounded-3xl border-rose-400/35 bg-[#1b112c]/95 p-5 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">
                  <Award className="h-4 w-4 text-rose-300" /> Pop-Culture Bonus Round •{' '}
                  {interludeQuestion.badge}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-300">
                  Bonus +6 Chemistry for Correct Hit!
                </span>
              </div>
              <p className="text-base font-bold text-white">
                {renderRichText(interludeQuestion.question)}
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
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
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition cursor-pointer ${
                        !hasPicked
                          ? 'border-white/12 bg-white/5 text-slate-100 hover:bg-white/10'
                          : isCorrect
                            ? 'border-emerald-400/70 bg-emerald-950/60 text-emerald-200'
                            : picked === oIdx
                              ? 'border-rose-500/70 bg-rose-950/60 text-rose-200'
                              : 'border-white/5 bg-black/25 text-slate-500'
                      }`}
                    >
                      <span>{opt}</span>
                      {hasPicked && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                      )}
                    </button>
                  );
                })}
              </div>
              {typeof answeredTriviaEpIds[currentEpisode.id] === 'number' && (
                <p className="text-sm text-amber-200 leading-relaxed">
                  {renderRichText(interludeQuestion.funFact)}
                </p>
              )}
            </div>
          )}

          <div className="vice-panel rounded-3xl bg-[#150f24]/95 p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-medium text-rose-200">
                {renderRichText(cleanStoryTag)}
              </span>
              <button
                type="button"
                onClick={() => onShareDilemma(currentEpisode.id, currentEpisode.title)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-amber-200 hover:bg-white/10 transition cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                <span>Ask Bestie: Ghost or Train?</span>
              </button>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl text-white">
              {currentEpisode.title}
            </h2>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-base sm:text-[17px] leading-relaxed text-slate-100">
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
              <div className="rounded-2xl border border-amber-300/35 bg-amber-400/10 p-4 sm:p-5 space-y-2">
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">
                  🧠 Cub Brain-to-Mouth Code-Switch Filter
                </div>
                <p className="text-sm sm:text-base font-medium text-white bg-black/40 rounded-xl px-4 py-3">
                  Raw Unfiltered Impulse: &ldquo;
                  {renderRichText(currentEpisode.codeSwitchRawImpulse.rawThought)}&rdquo;
                </p>
                <p className="text-sm text-amber-200">
                  ⚠️ {renderRichText(currentEpisode.codeSwitchRawImpulse.warningNote)}
                </p>
              </div>
            )}

            {/* Symmetric Inner-Insecurity Split Thought Bubbles */}
            {currentEpisode.innerInsecurityBubble && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4">
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wide text-rose-300">
                    💭 {run.pairing.her.name}’s Silent Mirror Doubt
                  </div>
                  <p className="mt-1.5 text-sm italic text-slate-100 leading-relaxed">
                    {renderRichText(
                      personalizeText(currentEpisode.innerInsecurityBubble.herDoubt, run.pairing),
                    )}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-300/30 bg-amber-400/10 p-4">
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wide text-amber-200">
                    💭 {run.pairing.his.name}’s Simultaneous Game Doubt
                  </div>
                  <p className="mt-1.5 text-sm italic text-slate-100 leading-relaxed">
                    {renderRichText(
                      personalizeText(currentEpisode.innerInsecurityBubble.hisDoubt, run.pairing),
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Deterministically Shuffled Action Move Cards */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">
                <span>🎯 Choose Your Play</span>
                <span className="text-slate-400 font-medium normal-case">
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
                    className="group w-full rounded-2xl border border-white/14 bg-white/[0.05] p-4 sm:p-5 text-left text-base font-medium text-white shadow-sm hover:-translate-y-0.5 hover:bg-white/[0.09] hover:border-amber-300/60 active:translate-y-0 transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="mt-0.5 shrink-0 inline-flex h-7 px-3 items-center justify-center rounded-xl bg-amber-300 text-xs font-extrabold uppercase text-slate-950 group-hover:bg-rose-400 group-hover:text-white transition">
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
                          <span className="ml-2 inline-block rounded-lg bg-rose-500/25 px-2.5 py-0.5 text-xs font-semibold text-rose-200">
                            🔒 Tip: Fix all 4 Sanctuary Upgrades above to clear 60+ Maturity &amp; EQ!
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
