import React, { useEffect, useState } from 'react';
import { CheckCircle2, CreditCard, Eye, Flame, Radar, Sparkles, Wine, Zap } from 'lucide-react';
import type { Episode, MinigameType } from '../data/episodes';
import type { Stats } from '../domain/gameEngine';
import { sfx } from '../lib/sound';

export type UniversalMicrogameType =
  | 'clink_toast'
  | 'eye_contact_hold'
  | 'flirt_pulse_rhythm'
  | 'red_flag_radar';

export type AnySceneGameType = MinigameType | UniversalMicrogameType;

export function resolveSceneGameType(episode: Episode): AnySceneGameType {
  if (episode.minigame) return episode.minigame;

  switch (episode.sceneArt) {
    case 'tapas_check':
    case 'palm_springs_pool':
    case 'princess_bouquet':
    case 'thanksgiving_table':
      return 'clink_toast';
    case 'mirror_vanity':
    case 'houseboy_apron':
    case 'fertility_talk':
    case 'ridge_trail_leash':
      return 'eye_contact_hold';
    case 'code_switch_phone':
    case 'babysitter_clock':
    case 'trader_joes_aisle':
      return 'flirt_pulse_rhythm';
    case 'waiter_shock':
    case 'brunch_daughter':
    case 'bathroom_audit':
    default:
      return episode.stage === 4 ? 'red_flag_radar' : 'clink_toast';
  }
}

interface MinigameWidgetProps {
  type: AnySceneGameType;
  alreadyCompleted: boolean;
  herName: string;
  hisName: string;
  zeroProof?: boolean;
  onWinBonus: (bonus: Partial<Stats>, badge: string) => void;
}

const FRAME_CLASS =
  'rounded-2xl border-2 border-[#1E1022] bg-[#1E1022] text-white p-4 space-y-3 shadow-[4px_4px_0px_#FFBE0B]';

/* ============================================================================
 * UNIVERSAL SCENE MICRO-INTERACTIONS (Covers the 60 scenes without bespoke minigame!)
 * ============================================================================ */

/**
 * U1. VelvetToastGame: Two opposing cocktail/mocktail glasses glide on sine motion.
 * Tap Clink in the center Gold Spark Zone (36..64%)!
 */
const VelvetToastGame: React.FC<{
  completed: boolean;
  zeroProof?: boolean;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, zeroProof, onWin }) => {
  const [phase, setPhase] = useState(15);
  const [dir, setDir] = useState<1 | -1>(1);
  const [won, setWon] = useState(completed);
  const [missNote, setMissNote] = useState<string | null>(null);

  useEffect(() => {
    if (won || completed) return;
    const id = window.setInterval(() => {
      setPhase((p) => {
        const next = p + dir * 4;
        if (next >= 88) {
          setDir(-1);
          return 88;
        }
        if (next <= 12) {
          setDir(1);
          return 12;
        }
        return next;
      });
    }, 36);
    return () => window.clearInterval(id);
  }, [dir, won, completed]);

  const handleClink = () => {
    if (won || completed) return;
    if (phase >= 34 && phase <= 66) {
      setWon(true);
      setMissNote(null);
      sfx.crystalClink();
      onWin({ chemistry: 5, chivalry: 4 }, 'Crystal Toast Spark');
    } else {
      sfx.redFlag();
      setMissNote('Almost! Wait until the two glasses meet in the center gold glow.');
    }
  };

  const leftGlass = zeroProof ? '🥤' : '🍸';
  const rightGlass = zeroProof ? '🍵' : '🥂';

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <Wine className="h-3.5 w-3.5 text-rose-400" /> Interactive Toast • Clink in the Gold Spark Zone
        </span>
        <span className="text-xs font-medium text-stone-300">+5 Chemistry · +4 Chivalry</span>
      </div>

      <div
        onClick={handleClink}
        className="relative h-11 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0C0910] cursor-pointer select-none"
      >
        <div className="absolute inset-y-0 left-[34%] w-[32%] bg-[#E5C17B]/20 border-x border-[#E5C17B]/60 flex items-center justify-center text-[11px] font-semibold uppercase tracking-wider text-[#FDE68A]">
          ✨ Spark Zone ✨
        </div>
        <span
          className="absolute top-1/2 -translate-y-1/2 -ml-3 text-xl transition-none"
          style={{ left: `${phase}%` }}
        >
          {leftGlass}
        </span>
        <span
          className="absolute top-1/2 -translate-y-1/2 -ml-3 text-xl transition-none"
          style={{ left: `${100 - phase}%` }}
        >
          {rightGlass}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        {!won && !completed ? (
          <button
            type="button"
            onClick={handleClink}
            className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-sm font-semibold text-[#FAF7F5] transition cursor-pointer"
          >
            🥂 Tap to Clink Glasses!
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Perfect crystal clink! Chemistry charged (+9 stats)
          </span>
        )}
        {missNote && <span className="text-xs text-rose-300">{missNote}</span>}
      </div>
    </div>
  );
};

/**
 * U2. EyeContactHoldGame: Hold or pump the Magnetic Gaze Meter into 70..95% sweet spot!
 */
const EyeContactHoldGame: React.FC<{
  completed: boolean;
  herName: string;
  hisName: string;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, herName, hisName, onWin }) => {
  const [tension, setTension] = useState(completed ? 85 : 18);
  const [holding, setHolding] = useState(false);
  const [won, setWon] = useState(completed);
  const [blinkMsg, setBlinkMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!holding || won || completed) return;
    const id = window.setInterval(() => {
      setTension((prev) => {
        const next = prev + 6;
        sfx.sliderTick(Math.round(next * 0.6));
        if (next > 97) {
          setHolding(false);
          sfx.redFlag();
          setBlinkMsg('Blinked! Hold & release right inside the 70–95% Gold Tension Zone.');
          return 18;
        }
        return next;
      });
    }, 65);
    return () => window.clearInterval(id);
  }, [holding, won, completed]);

  const releaseHold = () => {
    if (!holding || won || completed) return;
    setHolding(false);
    if (tension >= 68 && tension <= 96) {
      setWon(true);
      setBlinkMsg(null);
      sfx.greenFlag();
      onWin({ eq: 5, chemistry: 5 }, 'Unbroken Eye-Contact Magnet');
    } else if (tension < 68) {
      setBlinkMsg('Hold a beat longer (or tap Lock Gaze at 75%+) to seal the tension!');
    }
  };

  const handleQuickStep = () => {
    if (won || completed) return;
    const next = Math.min(86, tension + 24);
    sfx.sliderTick(Math.round(next * 0.6));
    setTension(next);
    if (next >= 70) {
      setWon(true);
      setBlinkMsg(null);
      sfx.greenFlag();
      onWin({ eq: 5, chemistry: 5 }, 'Unbroken Eye-Contact Magnet');
    }
  };

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <Eye className="h-3.5 w-3.5 text-rose-400" /> Magnetic Gaze • Hold Eye Contact ({herName} × {hisName})
        </span>
        <span className="text-xs font-medium text-stone-300">Tension: {Math.round(tension)}%</span>
      </div>

      <div className="relative h-9 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0C0910]">
        <div
          className="h-full bg-gradient-to-r from-rose-700 via-rose-500 to-[#E5C17B] transition-all duration-75"
          style={{ width: `${tension}%` }}
        />
        <div className="absolute inset-y-0 left-[68%] w-[28%] border-x border-[#E5C17B] bg-[#E5C17B]/20 flex items-center justify-center text-[11px] font-semibold text-[#FDE68A]">
          🔥 Sweet Spot
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        {!won && !completed ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onPointerDown={() => {
                setBlinkMsg(null);
                setHolding(true);
              }}
              onPointerUp={releaseHold}
              onPointerLeave={releaseHold}
              onClick={handleQuickStep}
              className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-sm font-semibold text-[#FAF7F5] transition cursor-pointer select-none"
            >
              {holding ? '🔥 Release in Sweet Spot!' : '👁️ Hold (or Tap 3×) to Lock Gaze'}
            </button>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Unbroken eye contact locked! (+5 EQ, +5 Chemistry)
          </span>
        )}
        {blinkMsg && <span className="text-xs text-stone-300">{blinkMsg}</span>}
      </div>
    </div>
  );
};

/**
 * U3. FlirtPulseRhythmGame: 3-Beat Banter Sync (Catch Eye -> Half-Smirk -> Send Spark)
 */
const PULSE_LABELS = ['1 · Catch Their Eye', '2 · Slow Half-Smirk', '3 · Deliver the Line'];

const FlirtPulseRhythmGame: React.FC<{
  completed: boolean;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, onWin }) => {
  const [beat, setBeat] = useState(completed ? 3 : 0);

  const handleBeatTap = () => {
    if (completed || beat >= 3) return;
    sfx.rhythmBeat(beat);
    const next = beat + 1;
    setBeat(next);
    if (next >= 3) {
      sfx.victoryFanfare();
      onWin({ maturity: 5, chemistry: 5 }, '3-Beat Banter Maestro');
    }
  };

  const done = completed || beat >= 3;

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <Sparkles className="h-3.5 w-3.5 text-rose-400" /> Chemistry Cadence • Hit All 3 Banter Beats ({Math.min(beat, 3)}/3)
        </span>
        <span className="text-xs font-medium text-stone-300">+5 Maturity · +5 Chemistry</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {PULSE_LABELS.map((lbl, idx) => (
          <div
            key={lbl}
            className={`rounded-xl px-2.5 py-2 text-center text-xs font-semibold border transition-all ${
              beat > idx
                ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200 scale-[1.02]'
                : idx === beat
                  ? 'border-[#E5C17B]/60 bg-[#E5C17B]/15 text-[#FDE68A] animate-pulse'
                  : 'border-white/10 bg-[#0C0910]/60 text-stone-400'
            }`}
          >
            {lbl}
          </div>
        ))}
      </div>

      {!done ? (
        <button
          type="button"
          onClick={handleBeatTap}
          className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-sm font-semibold text-[#FAF7F5] active:scale-95 transition cursor-pointer"
        >
          ⚡ Tap Beat {beat + 1}: {PULSE_LABELS[beat].split('·')[1].trim()}
        </button>
      ) : (
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> Rhythm dialed! Room read unlocked (+5 Maturity, +5 Chemistry)
        </div>
      )}
    </div>
  );
};

/**
 * U4. RedFlagRadarGame: Pop all 3 floating social-friction bubbles in the room!
 */
const RADAR_BUBBLES = [
  { id: 'stare', label: '👀 Table-9 Whisper', cleared: '✓ Unbothered Smile' },
  { id: 'pause', label: '😬 Awkward Silence', cleared: '✓ Smooth Poise' },
  { id: 'ego', label: '🚩 Fragile Ego Test', cleared: '✓ Calm Frame' },
];

const RedFlagRadarGame: React.FC<{
  completed: boolean;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, onWin }) => {
  const [popped, setPopped] = useState<string[]>(
    completed ? RADAR_BUBBLES.map((b) => b.id) : [],
  );

  const handlePop = (id: string) => {
    if (completed || popped.includes(id)) return;
    sfx.rhythmBeat(popped.length);
    const next = [...popped, id];
    setPopped(next);
    if (next.length === RADAR_BUBBLES.length) {
      sfx.greenFlag();
      onWin({ maturity: 5, eq: 5 }, 'Room-Radar Unbothered Pro');
    }
  };

  const done = completed || popped.length === RADAR_BUBBLES.length;

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <Radar className="h-3.5 w-3.5 text-rose-400" /> Room Radar • Pop All 3 Tension Bubbles ({popped.length}/3)
        </span>
        <span className="text-xs font-medium text-stone-300">+5 Maturity · +5 EQ</span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {RADAR_BUBBLES.map((b, idx) => {
          const isPopped = completed || popped.includes(b.id);
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => handlePop(b.id)}
              style={{ animationDelay: `${idx * 220}ms` }}
              className={`rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isPopped
                  ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200 scale-95'
                  : 'animate-float-bubble border-rose-500/45 bg-rose-950/70 text-rose-200 hover:bg-rose-900/80 hover:scale-105'
              }`}
            >
              {isPopped ? b.cleared : `${b.label} (Tap)`}
            </button>
          );
        })}
      </div>

      {done && (
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> Room cleared with effortless grace! (+5 Maturity, +5 EQ)
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 9 BESPOKE EPISODE MINIGAMES (Harmonized to Velvet & Champagne Palette)
 * ============================================================================ */

const CheckDropReflexGame: React.FC<{
  completed: boolean;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, onWin }) => {
  const [cursor, setCursor] = useState(18);
  const [dir, setDir] = useState<1 | -1>(1);
  const [stopped, setStopped] = useState(completed);
  const [resultMsg, setResultMsg] = useState<string | null>(
    completed ? '💳 Smooth Card-Slide Bonus Locked (+8 Chivalry, +6 Chemistry)!' : null,
  );

  useEffect(() => {
    if (stopped || completed) return;
    const timer = window.setInterval(() => {
      setCursor((prev) => {
        const next = prev + dir * 4.5;
        if (next >= 96) {
          setDir(-1);
          return 96;
        }
        if (next <= 4) {
          setDir(1);
          return 4;
        }
        return next;
      });
    }, 35);
    return () => window.clearInterval(timer);
  }, [dir, stopped, completed]);

  const handleGrab = () => {
    if (completed) return;
    setStopped(true);
    if (cursor >= 34 && cursor <= 68) {
      sfx.greenFlag();
      setResultMsg('💳 BULLSEYE! Smooth Zero-Ego Card Slide (+8 Chivalry, +6 Chemistry)!');
      onWin({ chivalry: 8, chemistry: 6 }, 'Quick-Draw Check Master');
    } else if (cursor < 34) {
      sfx.redFlag();
      setResultMsg('😅 Too early—almost pulled out the Venmo tax calculator! Tap Retry.');
    } else {
      sfx.redFlag();
      setResultMsg('😬 Hesitated too long—she almost reached for her Amex! Tap Retry.');
    }
  };

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <CreditCard className="h-3.5 w-3.5 text-rose-400" /> Reflex Minigame • Check-Drop Timing
        </span>
        <span className="text-xs font-medium text-stone-300">+8 Chivalry · +6 Chemistry</span>
      </div>

      <div className="relative h-9 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0C0910]">
        <div className="absolute inset-y-0 left-0 w-[34%] bg-rose-950/75 flex items-center justify-center text-xs font-medium text-rose-300">
          Venmo Math
        </div>
        <div className="absolute inset-y-0 left-[34%] w-[34%] bg-emerald-500/25 border-x border-emerald-400 flex items-center justify-center text-xs font-semibold text-emerald-200">
          🎯 Smooth Grab
        </div>
        <div className="absolute inset-y-0 right-0 w-[32%] bg-rose-950/75 flex items-center justify-center text-xs font-medium text-rose-300">
          Awkward Pause
        </div>

        <div
          className="absolute top-0.5 bottom-0.5 w-3.5 -ml-1.5 rounded-md bg-[#E5C17B] shadow-[0_0_12px_#E5C17B] transition-none"
          style={{ left: `${cursor}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {!stopped && !completed ? (
          <button
            type="button"
            onClick={handleGrab}
            className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-sm font-semibold text-[#FAF7F5] transition cursor-pointer"
          >
            💳 Slide Card Now!
          </button>
        ) : !completed ? (
          <button
            type="button"
            onClick={() => {
              setStopped(false);
              setResultMsg(null);
            }}
            className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-[#FDE68A] hover:bg-white/10 cursor-pointer"
          >
            🔄 Retry Reflex Shot
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Bonus Active! Lock in your move below:
          </span>
        )}
        {resultMsg && <span className="text-xs font-medium text-[#FDE68A]">{resultMsg}</span>}
      </div>
    </div>
  );
};

const TrailPaceRunnerGame: React.FC<{
  completed: boolean;
  herName: string;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, herName, onWin }) => {
  const [progress, setProgress] = useState(completed ? 100 : 20);
  const [won, setWon] = useState(completed);

  useEffect(() => {
    if (won || completed) return;
    const decay = window.setInterval(() => {
      setProgress((p) => Math.max(8, p - 2));
    }, 180);
    return () => window.clearInterval(decay);
  }, [won, completed]);

  const handlePumpStride = () => {
    if (won || completed) return;
    sfx.paceTap();
    const next = Math.min(100, progress + 22);
    setProgress(next);
    if (next >= 100) {
      setWon(true);
      sfx.victoryFanfare();
      onWin({ chemistry: 8, maturity: 6 }, '6 AM Summit Pace-Keeper');
    }
  };

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <Flame className="h-3.5 w-3.5 text-rose-400" /> Cardio Minigame • Keep {herName}’s Short-Leash Pace!
        </span>
        <span className="text-xs font-medium text-stone-300">Summit: {Math.round(progress)}%</span>
      </div>

      <div className="relative h-10 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0C0910] px-2 flex items-center">
        <div
          className="h-6 rounded-lg bg-gradient-to-r from-rose-600 to-[#E5C17B] transition-all duration-150 flex items-center justify-end pr-2 text-xs font-semibold text-[#0C0910]"
          style={{ width: `${progress}%` }}
        >
          🏃‍♂️💨
        </div>
        <span className="absolute right-3 text-xs font-semibold text-[#FDE68A]">🐆⛰️ Summit</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {!won && !completed ? (
          <button
            type="button"
            onClick={handlePumpStride}
            className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-sm font-semibold text-[#FAF7F5] active:scale-95 transition cursor-pointer"
          >
            ⚡ Tap Fast: Pump Stride Up the Switchback!
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> ⛰️ Summit Reached on Her Short Leash! (+8 Chemistry, +6 Maturity)
          </span>
        )}
      </div>
    </div>
  );
};

const ROOM_ITEMS = [
  { id: 'soap', bad: '🧴 5-in-1 Blue Shower Gel', good: '🌿 Botanical Hand Soap' },
  { id: 'bin', bad: '🗑️ Open Wire Wastebasket', good: '🖤 Matte-Black Lidded Bin' },
  { id: 'sheets', bad: '🛏️ Wrinkled Polyester Sheets', good: '✨ 600TC Percale + Oak Frame' },
  { id: 'apron', bad: '🍕 Takeout Boxes on Counter', good: '🥂 Washed Linen Apron & Basil' },
];

const RoomAuditHotspotGame: React.FC<{
  completed: boolean;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, onWin }) => {
  const [fixedIds, setFixedIds] = useState<string[]>(
    completed ? ROOM_ITEMS.map((i) => i.id) : [],
  );

  const handleToggleFix = (id: string) => {
    if (completed || fixedIds.includes(id)) return;
    sfx.hotspotFix();
    const next = [...fixedIds, id];
    setFixedIds(next);
    if (next.length === ROOM_ITEMS.length) {
      sfx.greenFlag();
      onWin({ maturity: 10, eq: 10 }, 'Sanctuary Prep Perfectionist');
    }
  };

  const allFixed = completed || fixedIds.length === ROOM_ITEMS.length;

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <Sparkles className="h-3.5 w-3.5 text-rose-400" /> Sanctuary Prep • Tap All 4 Upgrades ({fixedIds.length}/4)
        </span>
        <span className="text-xs font-medium text-emerald-300">
          <Zap className="inline h-3.5 w-3.5" /> +10 Maturity &amp; +10 EQ (Unlocks 60+ Gate!)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {ROOM_ITEMS.map((item, idx) => {
          const isFixed = completed || fixedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleToggleFix(item.id)}
              style={{ animationDelay: `${idx * 140}ms` }}
              className={`flex items-center justify-between rounded-2xl border px-3.5 py-2.5 text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isFixed
                  ? 'bg-emerald-500/15 text-emerald-200 border-emerald-400/50'
                  : 'animate-float-bubble bg-rose-950/65 text-rose-200 border-rose-500/40 hover:bg-rose-900/75'
              }`}
            >
              <span>{isFixed ? item.good : item.bad}</span>
              <span className="ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-black/45">
                {isFixed ? '✓ READY' : 'TAP TO FIX'}
              </span>
            </button>
          );
        })}
      </div>

      {allFixed && (
        <div className="text-xs font-semibold text-emerald-300">
          ✨ Spotless Sanctuary Certified! +10 Maturity &amp; +10 EQ applied—now choose your Sunday scene move!
        </div>
      )}
    </div>
  );
};

const DOUBT_THOUGHTS = [
  {
    id: 'stares',
    spiral: '🌀 "Everyone outside our bubble is judging the age gap..."',
    grounded: '💎 "Strangers stare for 5 seconds; real joy is ours every day."',
  },
  {
    id: 'phase',
    spiral: '🌀 "What if I’m just a fun temporary chapter?"',
    grounded: '💎 "Judge consistent effort & actions—not midnight fear."',
  },
  {
    id: 'martyr',
    spiral: '🌀 "Maybe I should end it first before someone gets hurt..."',
    grounded: '💎 "Never self-sabotage or make choices for your partner."',
  },
  {
    id: 'mundane',
    spiral: '🌀 "Does this still work on unglamorous Tuesdays?"',
    grounded: '💎 "Ordinary Tuesdays are where real partnership shines."',
  },
];

const DoubtSpiralGame: React.FC<{
  completed: boolean;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, onWin }) => {
  const [clearedIds, setClearedIds] = useState<string[]>(
    completed ? DOUBT_THOUGHTS.map((d) => d.id) : [],
  );

  const handleClear = (id: string) => {
    if (completed || clearedIds.includes(id)) return;
    sfx.hotspotFix();
    const next = [...clearedIds, id];
    setClearedIds(next);
    if (next.length === DOUBT_THOUGHTS.length) {
      sfx.greenFlag();
      onWin({ eq: 8, maturity: 8 }, '2 AM Doubt-Spiral Breaker');
    }
  };

  const allCleared = completed || clearedIds.length === DOUBT_THOUGHTS.length;

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <Sparkles className="h-3.5 w-3.5 text-rose-400" /> 2 AM Doubt Breaker • Reframe All 4 Fears ({clearedIds.length}/4)
        </span>
        <span className="text-xs font-medium text-stone-300">+8 EQ · +8 Maturity</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {DOUBT_THOUGHTS.map((item, idx) => {
          const isCleared = completed || clearedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClear(item.id)}
              style={{ animationDelay: `${idx * 160}ms` }}
              className={`flex items-center justify-between gap-2 rounded-2xl border px-3.5 py-2.5 text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isCleared
                  ? 'bg-emerald-500/15 text-emerald-200 border-emerald-400/50'
                  : 'animate-float-bubble bg-rose-950/65 text-rose-200 border-rose-500/40 hover:bg-rose-900/75'
              }`}
            >
              <span>{isCleared ? item.grounded : item.spiral}</span>
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-black/45">
                {isCleared ? '✓ GROUNDED' : 'REFRAME'}
              </span>
            </button>
          );
        })}
      </div>

      {allCleared && (
        <div className="text-xs font-semibold text-emerald-300">
          💞 2 AM Spiral Cleared! +8 EQ &amp; +8 Maturity unlocked—now handle the real conversation below!
        </div>
      )}
    </div>
  );
};

const BenchPressCougarGame: React.FC<{
  completed: boolean;
  herName: string;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, herName, onWin }) => {
  const [reps, setReps] = useState(completed ? 5 : 0);
  const [barLifted, setBarLifted] = useState(false);

  const handleRep = () => {
    if (completed || reps >= 5) return;
    sfx.paceTap();
    setBarLifted(true);
    window.setTimeout(() => setBarLifted(false), 140);
    const next = reps + 1;
    setReps(next);
    if (next >= 5) {
      sfx.victoryFanfare();
      onWin({ chemistry: 8, chivalry: 8 }, '225-Lb Stairway Carry Certified');
    }
  };

  const done = completed || reps >= 5;

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <Flame className="h-3.5 w-3.5 text-rose-400" /> Cub Gym Minigame • Bench Press for {herName} ({reps}/5 Reps)
        </span>
        <span className="text-xs font-medium text-stone-300">+8 Chemistry · +8 Chivalry</span>
      </div>

      <div className="relative h-12 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0C0910] px-3 flex items-center justify-between">
        <div
          className={`flex items-center gap-2 font-semibold text-base text-[#FDE68A] transition-transform duration-150 ${
            barLifted ? '-translate-y-2 scale-105' : 'translate-y-0.5'
          }`}
        >
          <span>🏋️‍♂️</span>
          <span>═══╣ 225 LBS ╠═══</span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((r) => (
            <span
              key={r}
              className={`h-3 w-5 rounded-sm ${
                r <= reps ? 'bg-emerald-400' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        {!done ? (
          <button
            type="button"
            onClick={handleRep}
            className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-sm font-semibold text-[#FAF7F5] active:scale-95 transition cursor-pointer"
          >
            💪 Press Rep ({reps}/5) — Train for {herName}!
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> 🔥 5x225 Crushed! Stairway-Carry Strength Unlocked (+8 Chemistry, +8 Chivalry)
          </span>
        )}
      </div>
    </div>
  );
};

const GROOMING_UPGRADES = [
  { id: 'beard', before: '🪒 Scruffy Neckbeard', after: '✨ Sculpted Jawline + Beard Oil' },
  { id: 'skincare', before: '🧴 5-in-1 Neon-Blue Gel', after: '🌿 Peptide Cleanser + SPF 50' },
  { id: 'collar', before: '👕 Faded Frat Graphic Tee', after: '🥂 Tailored Rolled-Cuff Linen' },
  { id: 'scent', before: '💨 Locker-Room Body Spray', after: '🔥 Santal & Bergamot Parfum' },
];

const CubGroomingGlowUpGame: React.FC<{
  completed: boolean;
  hisName: string;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, hisName, onWin }) => {
  const [polishedIds, setPolishedIds] = useState<string[]>(
    completed ? GROOMING_UPGRADES.map((g) => g.id) : [],
  );

  const handlePolish = (id: string) => {
    if (completed || polishedIds.includes(id)) return;
    sfx.hotspotFix();
    const next = [...polishedIds, id];
    setPolishedIds(next);
    if (next.length === GROOMING_UPGRADES.length) {
      sfx.victoryFanfare();
      onWin({ chemistry: 8, chivalry: 8 }, 'Cougar-Groomed Red-Carpet Certified');
    }
  };

  const allDone = completed || polishedIds.length === GROOMING_UPGRADES.length;

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <Sparkles className="h-3.5 w-3.5 text-rose-400" /> Cougar “Grooming” Salon • Polish {hisName} ({polishedIds.length}/4)
        </span>
        <span className="text-xs font-medium text-stone-300">+8 Chemistry · +8 Chivalry</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {GROOMING_UPGRADES.map((item, idx) => {
          const isPolished = completed || polishedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handlePolish(item.id)}
              style={{ animationDelay: `${idx * 140}ms` }}
              className={`rounded-2xl border px-3.5 py-2.5 text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isPolished
                  ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200'
                  : 'animate-float-bubble border-rose-500/40 bg-rose-950/65 text-rose-200 hover:bg-rose-900/75'
              }`}
            >
              {isPolished ? item.after : `${item.before} (Tap to Groom!)`}
            </button>
          );
        })}
      </div>

      {allDone && (
        <div className="text-xs font-semibold text-emerald-300">
          ✂️ Full “Cougar-Groomed” Glow-Up Complete! {hisName} looks ready to walk out beside Jessica Alba!
        </div>
      )}
    </div>
  );
};

const ThermostatPitCrewGame: React.FC<{
  completed: boolean;
  herName: string;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, herName, onWin }) => {
  const [temp, setTemp] = useState(completed ? 62 : 74);
  const [pillowFlipped, setPillowFlipped] = useState(completed);
  const [awarded, setAwarded] = useState(completed);

  const checkWin = (nextTemp: number, nextPillow: boolean) => {
    if (!awarded && !completed && nextTemp <= 63 && nextPillow) {
      setAwarded(true);
      sfx.victoryFanfare();
      onWin({ eq: 10, chemistry: 8 }, '62°F 3 AM Thermostat Pit-Crew Pro');
    }
  };

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          ❄️ 3 AM Cooling Pit-Crew • Dial {herName}’s Room to 62°F &amp; Flip Pillow!
        </span>
        <span className="font-display text-xl text-[#FDE68A]">{temp}°F</span>
      </div>

      <input
        type="range"
        aria-label="3 AM bedroom thermostat dial"
        min={60}
        max={76}
        value={temp}
        disabled={awarded || completed}
        onChange={(e) => {
          const val = Number(e.target.value);
          setTemp(val);
          sfx.sliderTick(90 - val);
          checkWin(val, pillowFlipped);
        }}
        className="w-full accent-[#E5C17B] cursor-pointer h-2.5 rounded-lg bg-[#0C0910]"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          disabled={awarded || completed}
          onClick={() => {
            sfx.hotspotFix();
            setPillowFlipped(true);
            checkWin(temp, true);
          }}
          className={`rounded-xl border px-4 py-2 text-sm font-semibold transition cursor-pointer ${
            pillowFlipped
              ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200'
              : 'border-white/12 bg-white/[0.06] text-[#FAF7F5] hover:bg-white/10'
          }`}
        >
          {pillowFlipped ? '✓ Pillow Flipped to Arctic Side' : '🧊 Tap to Flip Pillow to Cold Side'}
        </button>

        {awarded || completed ? (
          <span className="text-xs font-semibold text-emerald-300">
            ❄️ 62°F Sanctuary Locked! (+10 EQ, +8 Chemistry)
          </span>
        ) : (
          <span className="text-xs text-stone-400">Slide dial down to 62°F + flip pillow!</span>
        )}
      </div>
    </div>
  );
};

const BigCarlWinePourGame: React.FC<{
  completed: boolean;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, onWin }) => {
  const [fill, setFill] = useState(completed ? 84 : 16);
  const [locked, setLocked] = useState(completed);

  const handlePourSplash = () => {
    if (locked || completed) return;
    const next = Math.min(100, fill + 22);
    sfx.winePourGlug(next);
    setFill(next);
    if (next >= 74 && next <= 94) {
      setLocked(true);
      sfx.victoryFanfare();
      onWin({ chemistry: 8, chivalry: 8 }, '"Big Carl" Sommelier Pour Pro');
    } else if (next > 94) {
      sfx.redFlag();
      setFill(16);
    }
  };

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          🍷 Cougar Town “Big Carl” Goblet • Pour to the 80% Gold Line!
        </span>
        <span className="text-xs font-semibold text-[#FDE68A]">Goblet Level: {fill}%</span>
      </div>

      <div className="relative h-9 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0C0910]">
        <div
          className="h-full bg-gradient-to-r from-[#5c0a28] via-rose-700 to-rose-500 transition-all duration-150"
          style={{ width: `${fill}%` }}
        />
        <div className="absolute inset-y-0 left-[74%] w-[20%] border-x border-[#E5C17B] bg-[#E5C17B]/20 flex items-center justify-center text-[11px] font-semibold text-[#FDE68A]">
          🥂 BIG CARL ZONE
        </div>
      </div>

      <div>
        {!locked && !completed ? (
          <button
            type="button"
            onClick={handlePourSplash}
            className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-sm font-semibold text-[#FAF7F5] transition cursor-pointer"
          >
            🍷 Pour Heavy Splash (+22%)
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> 🍷 Jules Cobb Approved “Just One Glass” Pour! (+8 Chemistry, +8 Chivalry)
          </span>
        )}
      </div>
    </div>
  );
};

const BLACK_CAT_BEATS = [
  {
    catPrompt: '🐈‍⬛ Beat 1: She raises one cool eyebrow—"Slow down, eager puppy. I don’t clear my Friday that easily."',
    rightMove: '🐕 Grin Warmly & Match Her Unhurried Pace ("Zero rush—you’re worth waiting for")',
    rushTrap: '🚩 Love-Bomb 9 Texts in a Row ("PLS GIVE ME A CHANCE TONIGHT!!")',
  },
  {
    catPrompt: '😼 Beat 2: Half-smile unlocked! She tests your ego—"Most guys sulk when I push back on Date #1."',
    rightMove: '🐕 Laugh Unbothered ("Honestly? A woman with standards makes me 10x more interested")',
    rushTrap: '🚩 Get Defensive ("Why are you playing hard to get?!")',
  },
  {
    catPrompt: '😻 Beat 3: Her shoulders soften—"Okay, Golden Boy… convince me softly."',
    rightMove: '🐕 Hold Calm 7:30 Wine-Bar Plan & Let Her Choose Your Lap',
    rushTrap: '🚩 Crowd Her Space Before She Signals Ready',
  },
];

const BlackCatPaceGame: React.FC<{
  completed: boolean;
  herName: string;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, herName, onWin }) => {
  const [step, setStep] = useState(completed ? 3 : 0);
  const [hissNote, setHissNote] = useState<string | null>(null);

  const handlePatientBeat = () => {
    if (completed || step >= 3) return;
    setHissNote(null);
    const next = step + 1;
    setStep(next);
    if (next >= 3) {
      sfx.victoryFanfare();
      onWin({ chemistry: 10, eq: 8 }, '🐈‍⬛×🐕 Black Cat Whisperer');
    } else {
      sfx.greenFlag();
    }
  };

  const handleRushMistake = () => {
    if (completed || step >= 3) return;
    sfx.redFlag();
    setHissNote('🐈‍⬛ HISS! Too pushy—her Black Cat guard went right back up! Try the unbothered Golden-Retriever beat.');
  };

  const done = completed || step >= 3;

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          🐈‍⬛ Black Cat × 🐕 Golden Retriever Pacing Meter ({Math.min(step, 3)}/3 Earned)
        </span>
        <span className="text-xs font-medium text-stone-300">+10 Chemistry · +8 EQ</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {['1 · Aloof Side-Eye', '2 · Intrigued Smirk', '3 · Earned Purr 🔥'].map((lbl, idx) => (
          <div
            key={lbl}
            className={`rounded-xl py-1.5 px-2 text-center text-xs font-semibold border ${
              step > idx
                ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200'
                : idx === step
                  ? 'border-[#E5C17B]/60 bg-[#E5C17B]/15 text-[#FDE68A]'
                  : 'border-white/10 bg-[#0C0910]/60 text-stone-400'
            }`}
          >
            {lbl}
          </div>
        ))}
      </div>

      {!done ? (
        <div className="space-y-2.5">
          <p className="text-sm font-medium text-stone-200">{BLACK_CAT_BEATS[step].catPrompt}</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={handlePatientBeat}
              className="rounded-xl bg-[#E5C17B] hover:bg-[#F0CFA0] px-3.5 py-2.5 text-left text-xs sm:text-sm font-semibold text-[#0C0910] transition cursor-pointer"
            >
              {BLACK_CAT_BEATS[step].rightMove}
            </button>
            <button
              type="button"
              onClick={handleRushMistake}
              className="rounded-xl border border-rose-500/45 bg-rose-950/65 px-3.5 py-2.5 text-left text-xs sm:text-sm font-medium text-rose-200 hover:bg-rose-900/75 transition cursor-pointer"
            >
              {BLACK_CAT_BEATS[step].rushTrap}
            </button>
          </div>
          {hissNote && <p className="text-xs font-semibold text-rose-300">{hissNote}</p>}
        </div>
      ) : (
        <div className="text-xs font-semibold text-emerald-300">
          😻 Black Cat Melted! Your steady, unbothered Golden-Retriever warmth won {herName} over (+10 Chemistry, +8 EQ)!
        </div>
      )}
    </div>
  );
};

/**
 * 10. VenmoCalculatorBlockGame: Swat all 4 petty itemized Venmo popups!
 */
const VENMO_POPUPS = [
  { id: 'edamame', amount: '$4.12', note: '4/7ths of Shared Edamame Pods 🫛' },
  { id: 'ginger', amount: '$1.85', note: 'Extra Pickled Ginger & Wasabi Side' },
  { id: 'roll', amount: '$11.40', note: '2 Pieces of Dragon Roll + 8.75% Tax' },
  { id: 'parking', amount: '$24.26', note: 'Half Valet + "Campus Card Declined Fee"' },
];

const VenmoCalculatorBlockGame: React.FC<{
  completed: boolean;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, onWin }) => {
  const [blocked, setBlocked] = useState<string[]>(completed ? VENMO_POPUPS.map((p) => p.id) : []);

  const handleSwat = (id: string) => {
    if (completed || blocked.includes(id)) return;
    sfx.venmoSwat();
    const next = [...blocked, id];
    setBlocked(next);
    if (next.length === VENMO_POPUPS.length) {
      sfx.victoryFanfare();
      onWin({ maturity: 8, chivalry: 8 }, 'Blocked the $41.63 Venmo Calculator');
    }
  };

  const done = completed || blocked.length === VENMO_POPUPS.length;

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <CreditCard className="h-3.5 w-3.5 text-rose-400" /> Obstacle Arcade • Swat All 4 Petty Venmo Requests! ({blocked.length}/4)
        </span>
        <span className="text-xs font-medium text-stone-300">+8 Maturity · +8 Chivalry</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {VENMO_POPUPS.map((item, idx) => {
          const isSwatted = done || blocked.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              disabled={isSwatted}
              onClick={() => handleSwat(item.id)}
              style={{ animationDelay: `${idx * 80}ms` }}
              className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                isSwatted
                  ? 'border-emerald-400/40 bg-emerald-950/40 text-emerald-200 line-through opacity-80'
                  : 'animate-float-bubble border-rose-500/50 bg-[#0C0910] text-[#FAF7F5] hover:border-[#E5C17B] cursor-pointer'
              }`}
            >
              <div>
                <div className="font-bold text-rose-300">💸 Request: {item.amount}</div>
                <div className="text-stone-300">{item.note}</div>
              </div>
              <span
                className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase ${
                  isSwatted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-600 text-white'
                }`}
              >
                {isSwatted ? 'BLOCKED' : 'SWAT ✕'}
              </span>
            </button>
          );
        })}
      </div>

      {done && (
        <div className="text-xs font-semibold text-emerald-300">
          🛡️ All 4 itemized Venmo popups swatted into orbit! Zero edamame math tolerated (+16 stats)!
        </div>
      )}
    </div>
  );
};

/**
 * 11. RoommateKitchenEscapeGame: 7 AM Cheerios Mixing-Bowl Stealth Escape!
 */
const RoommateKitchenEscapeGame: React.FC<{
  completed: boolean;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, onWin }) => {
  const [pos, setPos] = useState(18);
  const [dir, setDir] = useState<1 | -1>(1);
  const [won, setWon] = useState(completed);
  const [spottedMsg, setSpottedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (won || completed) return;
    const id = window.setInterval(() => {
      setPos((p) => {
        const next = p + dir * 5;
        if (next >= 92) {
          setDir(-1);
          return 92;
        }
        if (next <= 8) {
          setDir(1);
          return 8;
        }
        return next;
      });
    }, 38);
    return () => window.clearInterval(id);
  }, [dir, won, completed]);

  const handleDash = () => {
    if (won || completed) return;
    if (pos >= 56 && pos <= 86) {
      setWon(true);
      setSpottedMsg(null);
      sfx.victoryFanfare();
      onWin({ eq: 8, maturity: 7 }, 'Stealth Espresso Extraction');
    } else {
      sfx.redFlag();
      setSpottedMsg('🥣 Spotted by Kyle’s Cheerios ladle! Wait for the Green Coast-Clear Window!');
    }
  };

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <Radar className="h-3.5 w-3.5 text-emerald-400" /> 7:10 AM Stealth Radar • Dodge the 3 Cheerios Roommates!
        </span>
        <span className="text-xs font-medium text-stone-300">+8 EQ · +7 Maturity</span>
      </div>

      <div
        onClick={handleDash}
        className="relative h-11 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0C0910] cursor-pointer select-none"
      >
        <div className="absolute inset-y-0 left-0 w-[55%] bg-rose-950/45 flex items-center pl-3 text-[11px] text-rose-300">
          🥣 Kyle &amp; Brody Gaming
        </div>
        <div className="absolute inset-y-0 left-[56%] w-[30%] bg-emerald-500/20 border-x border-emerald-400/60 flex items-center justify-center text-[11px] font-bold uppercase text-emerald-300">
          ☕ Coast Clear!
        </div>
        <span
          className="absolute top-1/2 -translate-y-1/2 -ml-3 text-xl"
          style={{ left: `${pos}%` }}
        >
          🕶️
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        {!won && !completed ? (
          <button
            type="button"
            onClick={handleDash}
            className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-sm font-semibold text-[#FAF7F5] transition cursor-pointer"
          >
            🕶️ Slip Out to Café!
          </button>
        ) : (
          <span className="text-xs font-semibold text-emerald-300">
            ✓ Clean getaway with hot lattes—zero mixing-bowl trauma (+15 stats)!
          </span>
        )}
        {spottedMsg && <span className="text-xs text-rose-300">{spottedMsg}</span>}
      </div>
    </div>
  );
};

/**
 * 12. HobosexualBagInterceptGame: Bounce all 4 contraband Week-3 move-in items!
 */
const CONTRABAND_ITEMS = [
  { id: 'ps5', label: '🎮 PS5 + Tangled HDMI Cord' },
  { id: 'socks', label: '🧦 2 Duffel Loads of Gym Laundry' },
  { id: 'whey', label: '💪 5-lb Vanilla Whey Protein Tub' },
  { id: 'lease', label: '📦 "My Lease Ended Friday" Box' },
];

const HobosexualBagInterceptGame: React.FC<{
  completed: boolean;
  onWin: (bonus: Partial<Stats>, badge: string) => void;
}> = ({ completed, onWin }) => {
  const [bounced, setBounced] = useState<string[]>(
    completed ? CONTRABAND_ITEMS.map((c) => c.id) : [],
  );

  const handleBounce = (id: string) => {
    if (completed || bounced.includes(id)) return;
    sfx.hotspotFix();
    const next = [...bounced, id];
    setBounced(next);
    if (next.length === CONTRABAND_ITEMS.length) {
      sfx.victoryFanfare();
      onWin({ maturity: 9, eq: 7 }, 'Sanctuary Door Bouncer');
    }
  };

  const done = completed || bounced.length === CONTRABAND_ITEMS.length;

  return (
    <div className={FRAME_CLASS}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FDE68A]">
          <Sparkles className="h-3.5 w-3.5 text-rose-400" /> Sanctuary Bouncer • Intercept All 4 Soft-Move-In Items! ({bounced.length}/4)
        </span>
        <span className="text-xs font-medium text-stone-300">+9 Maturity · +7 EQ</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CONTRABAND_ITEMS.map((item) => {
          const isOut = done || bounced.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              disabled={isOut}
              onClick={() => handleBounce(item.id)}
              className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                isOut
                  ? 'border-emerald-400/40 bg-emerald-950/40 text-emerald-300'
                  : 'border-white/14 bg-[#0C0910] text-[#FAF7F5] hover:border-[#E5C17B] cursor-pointer'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase ${
                  isOut ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#E5C17B] text-[#0C0910]'
                }`}
              >
                {isOut ? '✓ Bounced' : 'Bounce 🚪'}
              </span>
            </button>
          );
        })}
      </div>

      {done && (
        <div className="text-xs font-semibold text-emerald-300">
          👑 Sanctuary defended! Only a clean toothbrush &amp; fresh wine allowed inside (+16 stats)!
        </div>
      )}
    </div>
  );
};

export const MinigameWidget: React.FC<MinigameWidgetProps> = ({
  type,
  alreadyCompleted,
  herName,
  hisName,
  zeroProof,
  onWinBonus,
}) => {
  switch (type) {
    case 'check_reflex':
      return <CheckDropReflexGame completed={alreadyCompleted} onWin={onWinBonus} />;
    case 'trail_pace':
      return (
        <TrailPaceRunnerGame completed={alreadyCompleted} herName={herName} onWin={onWinBonus} />
      );
    case 'room_audit':
      return <RoomAuditHotspotGame completed={alreadyCompleted} onWin={onWinBonus} />;
    case 'doubt_spiral':
      return <DoubtSpiralGame completed={alreadyCompleted} onWin={onWinBonus} />;
    case 'bench_press':
      return (
        <BenchPressCougarGame completed={alreadyCompleted} herName={herName} onWin={onWinBonus} />
      );
    case 'cub_grooming':
      return (
        <CubGroomingGlowUpGame completed={alreadyCompleted} hisName={hisName} onWin={onWinBonus} />
      );
    case 'thermostat_dial':
      return (
        <ThermostatPitCrewGame completed={alreadyCompleted} herName={herName} onWin={onWinBonus} />
      );
    case 'big_carl_pour':
      return <BigCarlWinePourGame completed={alreadyCompleted} onWin={onWinBonus} />;
    case 'black_cat_pace':
      return (
        <BlackCatPaceGame completed={alreadyCompleted} herName={herName} onWin={onWinBonus} />
      );
    case 'venmo_calculator_block':
      return <VenmoCalculatorBlockGame completed={alreadyCompleted} onWin={onWinBonus} />;
    case 'roommate_kitchen_escape':
      return <RoommateKitchenEscapeGame completed={alreadyCompleted} onWin={onWinBonus} />;
    case 'hobosexual_bag_intercept':
      return <HobosexualBagInterceptGame completed={alreadyCompleted} onWin={onWinBonus} />;
    case 'clink_toast':
      return <VelvetToastGame completed={alreadyCompleted} zeroProof={zeroProof} onWin={onWinBonus} />;
    case 'eye_contact_hold':
      return (
        <EyeContactHoldGame
          completed={alreadyCompleted}
          herName={herName}
          hisName={hisName}
          onWin={onWinBonus}
        />
      );
    case 'flirt_pulse_rhythm':
      return <FlirtPulseRhythmGame completed={alreadyCompleted} onWin={onWinBonus} />;
    case 'red_flag_radar':
      return <RedFlagRadarGame completed={alreadyCompleted} onWin={onWinBonus} />;
    default:
      return null;
  }
};
