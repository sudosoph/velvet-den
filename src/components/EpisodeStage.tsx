import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  ChevronDown,
  Coffee,
  ExternalLink,
  Flame,
  Heart,
  RotateCcw,
  Share2,
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
import { personalizeText, type GameRunState, type Stats } from '../domain/gameEngine';
import { buildAffiliateUrl, getAffiliateById } from '../lib/affiliates';
import { parseChoiceCardSpec } from '../lib/choiceParser';
import { renderRichText } from '../lib/richText';
import { playVoiceNotePreview, sfx } from '../lib/sound';
import { getLocalChoicePercentagesSync, localCrowdStatsService } from '../services/adapters';
import { MinigameWidget, resolveSceneGameType } from './MinigameWidgets';

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
  vibeReadHer: string;
  vibeReadHim: string;
}

function getSceneVisualSpec(ep: Episode): SceneVisualSpec {
  const id = ep.id.toLowerCase();

  if (id.includes('pool') || id.includes('sauna') || id.includes('one-year')) {
    return {
      imageUrl: './images/scenes/hotel-pool-sauna.jpg',
      locationBadge: '🏨 Heated Midnight Pool & Cedar Sauna • 11:40 PM',
      vibeReadHer: 'Steam curls off the water—his shoulders relax, holding warm eye contact without rushing.',
      vibeReadHim: 'Candlelight catches her smile through the pool mist—zero small-talk nerves, pure magnetism.',
    };
  }
  if (id.includes('campus') || id.includes('sushi') || id.includes('dutch-calculator')) {
    return {
      imageUrl: './images/scenes/campus-autumn-sushi.jpg',
      locationBadge: '🍣 Lantern Quad & Omakase Sushi Counter • 7:45 PM',
      vibeReadHer: 'Warm sake steam & cedar counter glow—one playful raised eyebrow sets the entire pace.',
      vibeReadHim: 'Sneakers on brick quadstones, sharp wit across the sushi bar—every cue is live.',
    };
  }
  if (id.includes('bowling')) {
    return {
      imageUrl: './images/scenes/neon-bowling-lounge.jpg',
      locationBadge: '🎳 Retro Neon Bowling & Jukebox Lounge • 9:30 PM',
      vibeReadHer: 'Warm neon gleams off the hardwood lane—he’s hyping your spare like the NBA Finals.',
      vibeReadHim: 'She laces up retro bowling shoes laughing—playful trash talk beats stiff steakhouses.',
    };
  }
  if (id.includes('picnic') || id.includes('dog-park') || ep.sceneArt === 'trader_joes_aisle') {
    return {
      imageUrl: './images/cast/dog-park-picnic.jpg',
      locationBadge: '🧺 Golden-Hour Meadow & Park Stroll • 5:15 PM',
      vibeReadHer: 'Fresh linen blanket, real strawberries, zero pretentiousness—effort shows in every detail.',
      vibeReadHim: 'Golden sunlight hits her sunglasses as she leans back on the blanket grinning.',
    };
  }
  if (ep.sceneArt === 'palm_springs_pool' || id.includes('palm-springs') || id.includes('montana')) {
    return {
      imageUrl: './images/scenes/palm-springs-resort.jpg',
      locationBadge: '🌴 Boutique Cabana & Sunset Terrace • 6:50 PM',
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
      vibeReadHer: 'Rain on glass and amber lamplight—unguarded honesty matters ten times more than lines.',
      vibeReadHim: 'Quiet sanctuary hours—listen deeply, keep ego at zero, and let closeness breathe.',
    };
  }
  if (ep.sceneArt === 'princess_bouquet' || id.includes('foreign')) {
    return {
      imageUrl: './images/scenes/coastal-convertible.jpg',
      locationBadge: '🌅 Coastal Sunset Overlook & Wine Lounge • 6:40 PM',
      vibeReadHer: 'Peonies on the passenger seat and ocean breeze—let someone else drive for once.',
      vibeReadHim: 'Passenger door opened, playlist dialed—lead with warmth and zero hesitation.',
    };
  }
  if (ep.sceneArt === 'waiter_shock' || id.includes('gala') || id.includes('wedding')) {
    return {
      imageUrl: './images/scenes/wedding-gala-cheers.jpg',
      locationBadge: '🥂 Skyline Lounge & Velvet Rope • 9:10 PM',
      vibeReadHer: 'Every head turns as you step inside—calm, amused pride makes a couple untouchable.',
      vibeReadHim: 'Hand steady at her waist—turn every double-take into your favorite shared joke.',
    };
  }
  if (ep.sceneArt === 'code_switch_phone') {
    return {
      imageUrl: './images/scenes/neon-bowling-lounge.jpg',
      locationBadge: '📱 Late-Night Velvet Booth & Glow • 10:05 PM',
      vibeReadHer: 'Phone face-down on the table—direct adult communication beats streak games every time.',
      vibeReadHim: 'Drop the slang, hold steady eye contact, and lock in real plans like a grown man.',
    };
  }

  return {
    imageUrl: './images/scenes/wine-bar-booth.jpg',
    locationBadge: '🍷 Candlelit Corner Booth • Friday 8:20 PM',
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
  const [curtainTitle, setCurtainTitle] = useState<string | null>(null);
  const [tiltState, setTiltState] = useState<{ idx: number; rx: number; ry: number } | null>(null);
  const [whispersOpen, setWhispersOpen] = useState(true);
  const [speakingEpId, setSpeakingEpId] = useState<string | null>(null);
  const stopVoiceRef = useRef<(() => void) | null>(null);

  const currentEpisode: Episode | undefined = run.episodeQueue[run.currentEpisodeIndex];
  const role = run.pairing.role;

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
    setTiltState(null);

    const picked = currentEpisode.choices[idx];
    const flyups: { id: string; text: string; positive: boolean }[] = [];

    if (picked) {
      const { chemistry, chivalry, eq, maturity, redFlags } = picked.deltas;
      if (chemistry !== 0) {
        flyups.push({
          id: 'chem',
          text: `${chemistry > 0 ? '+' : ''}${chemistry} Chemistry`,
          positive: chemistry > 0,
        });
      }
      if (chivalry !== 0) {
        flyups.push({
          id: 'chiv',
          text: `${chivalry > 0 ? '+' : ''}${chivalry} Chivalry`,
          positive: chivalry > 0,
        });
      } else if (eq !== 0) {
        flyups.push({
          id: 'eq',
          text: `${eq > 0 ? '+' : ''}${eq} EQ`,
          positive: eq > 0,
        });
      } else if (maturity !== 0) {
        flyups.push({
          id: 'mat',
          text: `${maturity > 0 ? '+' : ''}${maturity} Maturity`,
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

  const handleAdvanceNextScene = () => {
    sfx.messagePop();
    const nextEp = run.episodeQueue[run.currentEpisodeIndex];
    if (nextEp) {
      const nextSpec = getSceneVisualSpec(nextEp);
      setCurtainTitle(nextSpec.locationBadge);
      window.setTimeout(() => setCurtainTitle(null), 550);
    }
    setStageReaction('idle');
    setShowingOutcomeForEpId(null);
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

  const affinity = getAffinityLevel(run.stats);
  const streak = getGreenFlagStreak(run.history);

  const statItems: [string, number, number | undefined][] = [
    ['Maturity', run.stats.maturity, resolvedChoice?.deltas.maturity],
    ['Chivalry', run.stats.chivalry, resolvedChoice?.deltas.chivalry],
    ['EQ', run.stats.eq, resolvedChoice?.deltas.eq],
    ['Chemistry', run.stats.chemistry, resolvedChoice?.deltas.chemistry],
  ];

  const affiliate = getAffiliateById(resolvedEpisode?.recommendedAffiliateId);
  const liveTipUrl = MONETIZATION_CONFIG.tipJarUrl || MONETIZATION_CONFIG.kofiUrl;

  const isRedOutcome =
    Boolean(lastEntry) &&
    (lastEntry!.toastBanner.includes('RED FLAG') ||
      lastEntry!.toastBanner.includes('VETTING GATE'));

  const cleanStoryTag = currentEpisode
    ? currentEpisode.subredditThreadInspiration.startsWith('r/CougarsAndCubs')
      ? `Real Age-Gap Lore • ${currentEpisode.subredditThreadInspiration.replace(
          /^r\/CougarsAndCubs[^:]*:\s*/i,
          '',
        )}`
      : currentEpisode.subredditThreadInspiration
    : '';

  const sceneGameType = currentEpisode ? resolveSceneGameType(currentEpisode) : null;
  const sceneGameCompleted = currentEpisode
    ? run.completedMinigameEpisodeIds.includes(currentEpisode.id)
    : false;
  const isZeroProof =
    run.pairing.her.subplotTags.includes('zero_proof_wellness') ||
    run.pairing.his.subplotTags.includes('zero_proof_wellness');

  return (
    <div className="mx-auto max-w-5xl space-y-4 relative">
      {/* Velvet Curtain Scene Wipe Overlay */}
      {curtainTitle && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-[#0C0910]/85 backdrop-blur-md animate-curtain-wipe">
          <div className="rounded-full border border-[#E5C17B]/40 bg-[#15101C] px-6 py-3 font-display text-xl sm:text-2xl text-[#FDE68A] shadow-2xl">
            {curtainTitle}
          </div>
        </div>
      )}

      {/* Compact Glass Telemetry Bar (Replaces 230px Multi-Row Dashboard) */}
      <div className="vice-panel rounded-2xl px-4 py-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E5C17B]">
              Scene {Math.min(run.currentEpisodeIndex + 1, run.episodeQueue.length)}/
              {run.episodeQueue.length} • {RELATIONSHIP_STAGE_LABELS[activeStage]}
            </span>
            {streak >= 2 && (
              <span className="animate-combo-pulse inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-[11px] font-semibold text-[#FAF7F5]">
                <Flame className="h-3 w-3" /> {streak}x Streak
              </span>
            )}
          </div>

          {/* Inline 4-Stat Chips With Live Outcome Deltas */}
          <div className="flex flex-wrap items-center gap-2">
            {statItems.map(([label, val, delta]) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E1729] border border-white/[0.07] px-2.5 py-1 text-xs"
              >
                <span className="text-stone-400">{label}</span>
                <strong className="text-[#FAF7F5]">{val}</strong>
                {Boolean(lastEntry) && typeof delta === 'number' && delta !== 0 && (
                  <span
                    className={`font-semibold ${
                      delta > 0 ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-[#FDE68A] font-semibold">
              <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
              Lv.{affinity.level} {affinity.title}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-stone-300">
              {[0, 1, 2].map((strike) => (
                <span key={strike}>{strike < run.redFlags ? '🚩' : '⚪'}</span>
              ))}
            </span>
          </div>
        </div>

        {/* Slim 6-Stage Arc Strip */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {STAGE_PILLS.map(({ stage: st, short }) => {
            const reached = st <= activeStage;
            const current = st === activeStage;
            return (
              <div
                key={st}
                className={`rounded-lg px-2 py-1 text-center text-[11px] font-semibold tracking-wide transition ${
                  current
                    ? 'bg-[#E5C17B] text-[#0C0910]'
                    : reached
                      ? 'bg-emerald-500/12 text-emerald-300 border border-emerald-400/20'
                      : 'bg-[#1E1729] text-stone-400'
                }`}
              >
                {short}
              </div>
            );
          })}
        </div>
      </div>

      {/* DREAM DADDY-INSPIRED LIVING VISUAL-NOVEL STAGE */}
      {sceneSpec && (
        <div
          className={`vice-panel relative h-72 sm:h-[348px] w-full overflow-hidden rounded-3xl bg-[#0C0910] ${
            stageReaction === 'red' && lastEntry ? 'animate-screen-shake ring-2 ring-rose-500' : ''
          } ${stageReaction === 'green' && lastEntry ? 'ring-2 ring-[#E5C17B]/70' : ''}`}
        >
          <img
            key={sceneSpec.imageUrl}
            src={sceneSpec.imageUrl}
            alt={sceneSpec.locationBadge}
            className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C0910]/30 via-[#0C0910]/25 to-[#0C0910]/94" />

          {/* Ambient Floating Candlelight & Champagne Bokeh Orbs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <span className="animate-bokeh-drift absolute left-[14%] top-[28%] h-16 w-16 rounded-full bg-rose-500/20 blur-xl" />
            <span
              style={{ animationDelay: '1.8s' }}
              className="animate-bokeh-drift absolute right-[18%] top-[22%] h-20 w-20 rounded-full bg-[#E5C17B]/20 blur-xl"
            />
            <span
              style={{ animationDelay: '3.2s' }}
              className="animate-bokeh-drift absolute left-[46%] top-[36%] h-14 w-14 rounded-full bg-amber-300/15 blur-xl"
            />
          </div>

          {/* Top Bar: Location Stamp + Animated AI Voice-Note Player */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 p-3.5 sm:p-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0C0910]/80 px-3.5 py-1 text-xs font-medium text-[#FDE68A] backdrop-blur-md">
              {sceneSpec.locationBadge}
            </span>

            <button
              type="button"
              onClick={handleToggleSceneVoice}
              className="inline-flex items-center gap-2 rounded-full border border-[#E5C17B]/35 bg-[#0C0910]/80 px-3.5 py-1 text-xs font-semibold text-[#FAF7F5] hover:bg-[#0C0910] backdrop-blur-md transition cursor-pointer"
            >
              {speakingEpId === displayedEpisode?.id ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-rose-400" />
                  <span className="inline-flex items-end gap-0.5 h-3">
                    {[0, 1, 2, 3, 4].map((b) => (
                      <span
                        key={b}
                        style={{ animationDelay: `${b * 90}ms` }}
                        className="animate-waveform-bar w-0.5 h-3 rounded-full bg-[#E5C17B]"
                      />
                    ))}
                  </span>
                  <span>Stop Voice Note</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-[#E5C17B]" />
                  <span>🔊 Hear Scene Voice</span>
                </>
              )}
            </button>
          </div>

          {particleBurst && (
            <div className="pointer-events-none absolute inset-x-0 top-12 z-30 text-center text-4xl sm:text-5xl animate-float-particle">
              {particleBurst}
            </div>
          )}

          {statFlyups.length > 0 && (
            <div className="pointer-events-none absolute inset-x-0 top-14 z-30 flex flex-col items-center gap-1.5">
              {statFlyups.map((f) => (
                <span
                  key={f.id}
                  className={`animate-stat-flyup rounded-full px-4 py-1 text-xs sm:text-sm font-semibold shadow-xl ${
                    f.positive
                      ? 'bg-[#E5C17B] text-[#0C0910]'
                      : 'bg-rose-600 text-[#FAF7F5]'
                  }`}
                >
                  {f.text}
                </span>
              ))}
            </div>
          )}

          {/* Outcome Center Stamp */}
          {lastEntry && (
            <div className="pointer-events-none absolute inset-x-0 bottom-32 z-20 flex justify-center px-4">
              <div
                className={`rounded-full px-4 py-1 text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-xl ${
                  isRedOutcome
                    ? 'bg-rose-600 text-[#FAF7F5]'
                    : 'bg-[#E5C17B] text-[#0C0910]'
                }`}
              >
                {isRedOutcome ? '🚩 Red Flag Triggered' : '✨ Chemistry Sparked'}
              </div>
            </div>
          )}

          {/* Foreground Expressive Dream-Daddy Sprites + Floating Reaction Balloons */}
          <div className="absolute inset-x-3 sm:inset-x-6 bottom-3 z-20 flex items-end justify-between gap-3">
            {/* HER SPRITE */}
            <div
              className={`flex items-end gap-3 transition-all duration-500 ${
                lastEntry
                  ? isRedOutcome
                    ? '-translate-x-2 opacity-90'
                    : 'translate-x-3 sm:translate-x-8 scale-105'
                  : speakingEpId === displayedEpisode?.id && role === 'her'
                    ? 'animate-vn-talk'
                    : 'animate-portrait-breathe'
              }`}
            >
              <div className="relative">
                {/* Floating Comic Reaction Balloon */}
                <div className="animate-float-bubble hidden sm:block absolute -top-9 left-0 whitespace-nowrap rounded-2xl rounded-bl-xs border border-rose-400/40 bg-[#15101C]/95 px-2.5 py-1 text-[11px] font-semibold text-rose-200 shadow-lg">
                  {lastEntry
                    ? isRedOutcome
                      ? '🚩 "Excuse me?!"'
                      : '😻 "Now THAT’S a move…"'
                    : '🍸 "Impress me…"'}
                </div>

                <img
                  src={run.pairing.her.photoUrl}
                  alt={run.pairing.her.name}
                  className={`h-26 w-20 sm:h-36 sm:w-28 rounded-2xl object-cover object-top border-2 shadow-2xl transition-all ${
                    lastEntry && !isRedOutcome
                      ? 'border-[#E5C17B] ring-4 ring-rose-500/30'
                      : role === 'her'
                        ? 'border-rose-500'
                        : 'border-white/30'
                  }`}
                />
                <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-semibold text-[#FAF7F5] shadow">
                  {lastEntry
                    ? isRedOutcome
                      ? '😒 Ick'
                      : '😻 Smitten'
                    : role === 'her'
                      ? '🐆 You'
                      : '😼 Vetting'}
                </span>
              </div>
              <div className="pb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                <div className="font-display text-lg sm:text-[22px] text-[#FAF7F5]">
                  {run.pairing.her.name}, {run.pairing.her.age}
                </div>
                <div className="text-xs text-rose-200">{run.pairing.her.title}</div>
              </div>
            </div>

            {/* HIM SPRITE */}
            <div
              className={`flex items-end gap-3 text-right transition-all duration-500 ${
                lastEntry
                  ? isRedOutcome
                    ? 'translate-x-2 opacity-85'
                    : '-translate-x-3 sm:-translate-x-8 scale-105'
                  : speakingEpId === displayedEpisode?.id && role === 'him'
                    ? 'animate-vn-talk'
                    : 'animate-portrait-breathe'
              }`}
            >
              <div className="pb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                <div className="font-display text-lg sm:text-[22px] text-[#FAF7F5]">
                  {run.pairing.his.name}, {run.pairing.his.age}
                </div>
                <div className="text-xs text-[#FDE68A]">{run.pairing.his.title}</div>
              </div>
              <div className="relative">
                {/* Floating Comic Reaction Balloon */}
                <div className="animate-float-bubble hidden sm:block absolute -top-9 right-0 whitespace-nowrap rounded-2xl rounded-br-xs border border-[#E5C17B]/40 bg-[#15101C]/95 px-2.5 py-1 text-[11px] font-semibold text-[#FDE68A] shadow-lg">
                  {lastEntry
                    ? isRedOutcome
                      ? '💦 "Uh oh…"'
                      : '🔥 "Yes ma’am!"'
                    : '🥂 "Locked in!"'}
                </div>

                <img
                  src={run.pairing.his.photoUrl}
                  alt={run.pairing.his.name}
                  className={`h-26 w-20 sm:h-36 sm:w-28 rounded-2xl object-cover object-top border-2 shadow-2xl transition-all ${
                    lastEntry && !isRedOutcome
                      ? 'border-[#E5C17B] ring-4 ring-[#E5C17B]/30'
                      : role === 'him'
                        ? 'border-[#E5C17B]'
                        : 'border-white/30'
                  }`}
                />
                <span className="absolute -bottom-1.5 -left-1.5 rounded-full bg-[#E5C17B] px-2 py-0.5 text-[11px] font-semibold text-[#0C0910] shadow">
                  {lastEntry
                    ? isRedOutcome
                      ? '😬 Busted'
                      : '🔥 Locked In'
                    : role === 'him'
                      ? '🥂 You'
                      : '✨ Courting'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Earned Body-Language Insight (Unlocks automatically when the scene's tactile game completes!) */}
      {!lastEntry && currentEpisode && sceneSpec && sceneGameCompleted && (
        <div className="animate-stage-in rounded-2xl border border-[#E5C17B]/30 bg-[#1E1729] px-4 py-3 text-sm text-stone-200 flex items-center justify-between gap-3">
          <span>
            <strong className="text-[#FDE68A]">👀 Room Read Unlocked:</strong>{' '}
            {role === 'her' ? sceneSpec.vibeReadHer : sceneSpec.vibeReadHim}
          </span>
          <span className="shrink-0 rounded-full bg-emerald-500/15 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
            Bonus Active
          </span>
        </div>
      )}

      {/* Outcome Verdict Card */}
      {lastEntry && resolvedEpisode ? (
        <div className="vice-panel animate-stage-in rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`vice-toast inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider shadow ${
                isRedOutcome
                  ? 'bg-rose-950 border border-rose-500/50 text-rose-200'
                  : 'bg-[#E5C17B] text-[#0C0910]'
              }`}
            >
              ⚡ {lastEntry.toastBanner}
            </div>

            {lastEntry.badgeUnlocked && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-200">
                <Award className="h-3.5 w-3.5 text-[#E5C17B]" />
                <span>{lastEntry.badgeUnlocked}</span>
              </div>
            )}
          </div>

          <h3 className="font-display text-2xl sm:text-3xl text-[#FAF7F5]">
            {resolvedEpisode.title}
          </h3>
          <p className="text-[15px] sm:text-base leading-relaxed text-stone-200 max-w-[65ch]">
            {renderRichText(lastEntry.outcomeText)}
          </p>

          <div className="rounded-2xl bg-[#1E1729] border border-white/[0.07] px-4 py-3 text-sm text-stone-300">
            Global Club Pulse:{' '}
            <strong className="text-[#FDE68A]">
              {crowdPcts[lastEntry.choiceIndex] ?? 48}%
            </strong>{' '}
            of players made this exact move.
          </div>

          {resolvedChoice?.triggerTipPrompt && Boolean(lastEntry.badgeUnlocked) && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
              <div className="text-sm text-stone-200">
                <strong className="text-[#FAF7F5]">Lived this moment in real life?</strong> Toss an Espresso Martini in the Creator Lounge.
              </div>
              {liveTipUrl ? (
                <a
                  href={liveTipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-sm font-semibold text-[#FAF7F5] transition"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Send a Martini Tip</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onOpenBoutique}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-sm font-semibold text-[#FAF7F5] transition cursor-pointer"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Open Creator Lounge</span>
                </button>
              )}
            </div>
          )}

          {/* Protected Affiliate Boutique Drop */}
          {affiliate && (
            <div className="rounded-2xl bg-[#1E1729] border border-[#E5C17B]/25 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E5C17B]">
                  Curated Club Pick • {affiliate.badge}
                </span>
                <div className="text-base font-semibold text-[#FAF7F5]">
                  {affiliate.name} ({affiliate.priceDisplay})
                </div>
                <p className="text-sm text-stone-300">{affiliate.cheekyPitch}</p>
              </div>
              <a
                href={buildAffiliateUrl(affiliate, `scene_${resolvedEpisode.id}`)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#E5C17B] hover:bg-[#F0CFA0] px-4 py-2.5 text-sm font-semibold text-[#0C0910] transition"
              >
                <span>Shop Pick</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleRewindClick}
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-[#FDE68A] hover:bg-white/10 transition cursor-pointer"
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
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-3 text-[15px] font-semibold text-[#FAF7F5] shadow-lg transition cursor-pointer"
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
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-3 text-[15px] font-semibold text-[#FAF7F5] shadow-lg transition cursor-pointer"
              >
                See Official Vibe Receipt →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAdvanceNextScene}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-3 text-[15px] font-semibold text-[#FAF7F5] shadow-lg transition cursor-pointer"
              >
                Next Stage Scene →
              </button>
            )}
          </div>
        </div>
      ) : currentEpisode ? (
        <div key={currentEpisode.id} className="vice-panel rounded-3xl p-5 sm:p-7 space-y-5 animate-stage-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E5C17B]">
              {cleanStoryTag}
            </span>
            <button
              type="button"
              onClick={() => onShareDilemma(currentEpisode.id, currentEpisode.title)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-stone-200 hover:bg-white/10 transition cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-[#E5C17B]" />
              <span>Ask Bestie: Ghost or Train?</span>
            </button>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl text-[#FAF7F5]">
            {currentEpisode.title}
          </h2>

          {/* Dream-Daddy Visual-Novel Speaker Plaque + Dialogue Box */}
          <div className="animate-vn-box relative rounded-2xl border border-[#E5C17B]/30 bg-[#1E1729]/95 p-4 sm:p-5 shadow-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5C17B] px-3 py-0.5 font-display text-xs font-bold text-[#0C0910] mb-2">
              🎬 {role === 'her' ? `${run.pairing.her.name}’s POV` : `${run.pairing.his.name}’s POV`}
            </span>
            <p className="text-[15px] sm:text-base leading-relaxed text-[#FAF7F5] max-w-[68ch]">
              {renderRichText(
                personalizeText(
                  role === 'her' ? currentEpisode.setupHer : currentEpisode.setupHim,
                  run.pairing,
                ),
              )}
            </p>
          </div>

          {/* 100% Tactile Scene Coverage: Bespoke Minigame OR Auto-Matched Universal Microgame! */}
          {sceneGameType && (
            <MinigameWidget
              type={sceneGameType}
              alreadyCompleted={sceneGameCompleted}
              herName={run.pairing.her.name}
              hisName={run.pairing.his.name}
              zeroProof={isZeroProof}
              onWinBonus={(bonus, badge) => onCompleteMinigame(currentEpisode.id, bonus, badge)}
            />
          )}

          {/* Compact Collapsible Inner Whispers (Code-Switch / Mirror Doubts) */}
          {(currentEpisode.codeSwitchRawImpulse || currentEpisode.innerInsecurityBubble) && (
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setWhispersOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FDE68A] hover:text-white cursor-pointer"
              >
                <span>
                  {currentEpisode.codeSwitchRawImpulse
                    ? '🧠 Inner Cub Impulse Filter'
                    : '💭 Subtext & Inner Doubts'}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${whispersOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {whispersOpen && currentEpisode.codeSwitchRawImpulse && (
                <div className="rounded-2xl bg-[#1E1729] border border-[#E5C17B]/25 p-4 space-y-1.5">
                  <p className="text-sm text-[#FAF7F5]">
                    <span className="text-stone-400">Unfiltered impulse:</span> &ldquo;
                    {renderRichText(currentEpisode.codeSwitchRawImpulse.rawThought)}&rdquo;
                  </p>
                  <p className="text-xs text-[#FDE68A]">
                    ⚠️ {renderRichText(currentEpisode.codeSwitchRawImpulse.warningNote)}
                  </p>
                </div>
              )}

              {whispersOpen && currentEpisode.innerInsecurityBubble && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#1E1729] border border-rose-500/25 p-3.5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-rose-300">
                      {run.pairing.her.name}’s Silent Doubt
                    </div>
                    <p className="mt-1 text-sm italic text-stone-200 leading-relaxed">
                      {renderRichText(
                        personalizeText(currentEpisode.innerInsecurityBubble.herDoubt, run.pairing),
                      )}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#1E1729] border border-[#E5C17B]/25 p-3.5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
                      {run.pairing.his.name}’s Silent Doubt
                    </div>
                    <p className="mt-1 text-sm italic text-stone-200 leading-relaxed">
                      {renderRichText(
                        personalizeText(currentEpisode.innerInsecurityBubble.hisDoubt, run.pairing),
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3-Column Tactile Play Card Hand (3D Hover Tilt + 2-Tier Headline/Subtext) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E5C17B]">
                Choose Your Play
              </span>
              <span className="text-xs text-stone-400">
                {role === 'her' ? 'Vet his instincts & set the tone' : 'Make your move'}
              </span>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              {shuffledIndices.map((originalIdx, displayPosition) => {
                const choice = currentEpisode.choices[originalIdx];
                if (!choice) return null;
                const fullPersonalized = personalizeText(
                  role === 'her' ? choice.labelHer : choice.labelHim,
                  run.pairing,
                );
                const parsed = parseChoiceCardSpec(fullPersonalized, role);
                const houseboyGateWarning =
                  currentEpisode.id === 'houseboy-sunday-sanctuary' &&
                  originalIdx === 0 &&
                  (run.stats.maturity < 60 || run.stats.eq < 60);

                const isTilted = tiltState?.idx === displayPosition;

                return (
                  <button
                    key={originalIdx}
                    type="button"
                    style={{
                      animationDelay: `${displayPosition * 65}ms`,
                      transform: isTilted
                        ? `perspective(700px) rotateX(${tiltState.rx}deg) rotateY(${tiltState.ry}deg) translateY(-3px)`
                        : undefined,
                    }}
                    onPointerEnter={() => sfx.cardHoverTick()}
                    onPointerMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const nx = (e.clientX - rect.left) / rect.width - 0.5;
                      const ny = (e.clientY - rect.top) / rect.height - 0.5;
                      setTiltState({ idx: displayPosition, rx: -ny * 5, ry: nx * 5 });
                    }}
                    onPointerLeave={() => setTiltState(null)}
                    onClick={() => handlePick(originalIdx)}
                    className="animate-card-deal group flex flex-col justify-between rounded-2xl border border-white/12 bg-[#1E1729] p-4 text-left hover:border-[#E5C17B]/60 hover:bg-[#251d33] active:scale-[0.98] transition-colors cursor-pointer"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-semibold text-[#FDE68A]">
                          <span>{parsed.toneIcon}</span>
                          <span>{parsed.toneLabel}</span>
                        </span>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E5C17B]/40 text-xs font-semibold text-[#FDE68A] group-hover:bg-[#E5C17B] group-hover:text-[#0C0910] transition">
                          {String.fromCharCode(65 + displayPosition)}
                        </span>
                      </div>

                      <div className="text-[15px] font-semibold leading-snug text-[#FAF7F5]">
                        {renderRichText(parsed.headline)}
                      </div>

                      {parsed.restText && (
                        <div className="text-sm leading-relaxed text-stone-300">
                          {renderRichText(parsed.restText)}
                        </div>
                      )}
                    </div>

                    {houseboyGateWarning && (
                      <div className="mt-3 rounded-lg bg-rose-950/80 border border-rose-500/40 px-2.5 py-1 text-xs font-semibold text-rose-200">
                        🔒 Clear 60+ Maturity &amp; EQ above first
                      </div>
                    )}
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
