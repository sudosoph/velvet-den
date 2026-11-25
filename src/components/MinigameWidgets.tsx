import React, { useEffect, useState } from 'react';
import { CheckCircle2, CreditCard, Flame, Sparkles, Zap } from 'lucide-react';
import type { MinigameType } from '../data/episodes';
import type { Stats } from '../domain/gameEngine';
import { sfx } from '../lib/sound';

interface MinigameWidgetProps {
  type: MinigameType;
  alreadyCompleted: boolean;
  herName: string;
  hisName: string;
  onWinBonus: (bonus: Partial<Stats>, badge: string) => void;
}

/**
 * 1. CheckDropMinigame: Moving reflex meter where player slides their card into the check presenter
 * inside the emerald sweet-spot (35%..68%) — avoiding both "Split $0.37 Calculator" and "Awkward Pause".
 */
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
      setResultMsg('😅 Too early—almost pulled out the Venmo tax calculator! Tap Retry for the bonus.');
    } else {
      sfx.redFlag();
      setResultMsg('😬 Hesitated too long—she almost reached for her Amex! Tap Retry for the bonus.');
    }
  };

  return (
    <div className="rounded-2xl border-2 border-amber-400/70 bg-gradient-to-r from-[#231236] via-[#19142f] to-[#0f262c] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">
          <CreditCard className="h-4 w-4" /> Interactive Reflex Minigame • Check-Drop Timing
        </span>
        <span className="text-[11px] font-bold text-teal-300">
          Hit the Emerald Sweet Spot for +14 Stat Bonus!
        </span>
      </div>

      {/* Reflex Track */}
      <div className="relative h-9 w-full overflow-hidden rounded-xl border-2 border-black bg-slate-900">
        <div className="absolute inset-y-0 left-0 w-[34%] bg-rose-950/70 flex items-center justify-center text-[10px] font-bold text-rose-300">
          Venmo Math
        </div>
        <div className="absolute inset-y-0 left-[34%] w-[34%] bg-emerald-500/35 border-x-2 border-emerald-400 flex items-center justify-center text-[10px] font-extrabold uppercase text-emerald-200">
          🎯 Smooth Grab Zone
        </div>
        <div className="absolute inset-y-0 right-0 w-[32%] bg-rose-950/70 flex items-center justify-center text-[10px] font-bold text-rose-300">
          Awkward Pause
        </div>

        {/* Moving Card Cursor */}
        <div
          className="absolute top-0.5 bottom-0.5 w-3.5 -ml-1.5 rounded-md bg-amber-300 border-2 border-black shadow-[0_0_12px_#fbbf24] transition-none"
          style={{ left: `${cursor}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {!stopped && !completed ? (
          <button
            type="button"
            onClick={handleGrab}
            className="vice-panel rounded-xl bg-gradient-to-r from-amber-400 to-teal-400 px-4 py-2 text-xs font-extrabold uppercase text-slate-950 hover:brightness-110 cursor-pointer"
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
            className="rounded-xl border-2 border-black bg-slate-800 px-3.5 py-1.5 text-xs font-extrabold text-amber-300 hover:bg-slate-700 cursor-pointer"
          >
            🔄 Retry Reflex Shot
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Bonus Active! Now lock in your move below:
          </span>
        )}
        {resultMsg && <span className="text-xs font-bold text-amber-200">{resultMsg}</span>}
      </div>
    </div>
  );
};

/**
 * 2. TrailPaceMinigame: Pump your stride to match her 6 AM ridge pace and reach 100% Summit Meter!
 */
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
    <div className="rounded-2xl border-2 border-teal-400/70 bg-gradient-to-r from-[#0e262d] via-[#171c30] to-[#281236] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-teal-300">
          <Flame className="h-4 w-4 text-amber-300" /> Interactive Cardio Minigame • Keep {herName}’s Short-Leash Pace!
        </span>
        <span className="text-[11px] font-bold text-amber-300">
          Summit Progress: {Math.round(progress)}%
        </span>
      </div>

      {/* Canyon Ridge Track */}
      <div className="relative h-10 w-full overflow-hidden rounded-xl border-2 border-black bg-slate-950 px-2 flex items-center">
        <div
          className="h-6 rounded-lg bg-gradient-to-r from-rose-500 via-amber-400 to-teal-400 transition-all duration-150 flex items-center justify-end pr-2 text-xs font-extrabold text-slate-950"
          style={{ width: `${progress}%` }}
        >
          🏃‍♂️💨
        </div>
        <span className="absolute right-2.5 text-xs font-extrabold text-pink-200">
          🐆⛰️ Summit
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {!won && !completed ? (
          <button
            type="button"
            onClick={handlePumpStride}
            className="vice-panel rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 px-4 py-2 text-xs font-extrabold uppercase text-slate-950 hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            ⚡ Tap Fast: Pump Stride Up the Switchback!
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> ⛰️ Summit Reached on Her Short Leash! (+8 Chemistry, +6 Maturity)
          </span>
        )}
        <span className="text-[11px] text-slate-300">
          {won || completed
            ? 'Cardio verified! Pick your summit move below.'
            : 'Tap 4–5x before the incline pulls you back!'}
        </span>
      </div>
    </div>
  );
};

/**
 * 3. RoomHotspotMinigame: Tap all 4 apartment/sanctuary hazards to upgrade them!
 * Grants +8 Maturity & +8 EQ — helping unlock the 60+ Houseboy Sunday gate!
 */
const ROOM_ITEMS = [
  {
    id: 'soap',
    bad: '🧴 5-in-1 Blue Shower Gel',
    good: '🌿 Botanical Hand Soap',
  },
  {
    id: 'bin',
    bad: '🗑️ Open Wire Wastebasket',
    good: '🖤 Matte-Black Lidded Bin',
  },
  {
    id: 'sheets',
    bad: '🛏️ Wrinkled Polyester Sheets',
    good: '✨ 600TC Percale + Oak Frame',
  },
  {
    id: 'apron',
    bad: '🍕 Takeout Boxes on Counter',
    good: '🥂 Washed Linen Apron & Basil',
  },
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
    <div className="rounded-2xl border-2 border-pink-400/60 bg-gradient-to-br from-[#231134] to-[#10222b] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-pink-300">
          <Sparkles className="h-4 w-4 text-amber-300" /> Interactive Sanctuary Prep • Tap All 4 Upgrades ({fixedIds.length}/4)
        </span>
        <span className="text-[11px] font-bold text-emerald-300">
          <Zap className="inline h-3.5 w-3.5" /> +10 Maturity &amp; +10 EQ (Unlocks 60+ Gate!)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ROOM_ITEMS.map((item) => {
          const isFixed = completed || fixedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleToggleFix(item.id)}
              className={`flex items-center justify-between rounded-xl border-2 border-black px-3 py-2 text-left text-xs font-bold transition cursor-pointer ${
                isFixed
                  ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/60'
                  : 'bg-rose-950/60 text-rose-200 hover:bg-rose-900/70'
              }`}
            >
              <span>{isFixed ? item.good : item.bad}</span>
              <span className="ml-2 rounded px-1.5 py-0.5 text-[10px] font-extrabold bg-black/40">
                {isFixed ? '✓ READY' : 'TAP TO FIX'}
              </span>
            </button>
          );
        })}
      </div>

      {allFixed && (
        <div className="text-xs font-extrabold text-emerald-300">
          ✨ Spotless Sanctuary Certified! +10 Maturity &amp; +10 EQ applied—now choose your Sunday scene move!
        </div>
      )}
    </div>
  );
};

/**
 * 4. DoubtSpiralGame: Tap all 4 intrusive "2 AM Can This Actually Work?" fear bubbles
 * to ground them in honest adult reality before self-sabotage takes over!
 */
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
    <div className="rounded-2xl border-2 border-fuchsia-400/70 bg-gradient-to-br from-[#240e35] via-[#18122e] to-[#0f242c] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-fuchsia-300">
          <Sparkles className="h-4 w-4 text-amber-300" /> Interactive 2 AM Doubt Breaker • Reframe All 4 Fears ({clearedIds.length}/4)
        </span>
        <span className="text-[11px] font-bold text-teal-300">
          +8 EQ &amp; +8 Maturity (Stop Self-Sabotage!)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DOUBT_THOUGHTS.map((item) => {
          const isCleared = completed || clearedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClear(item.id)}
              className={`flex items-center justify-between gap-2 rounded-xl border-2 border-black px-3 py-2 text-left text-xs font-bold transition cursor-pointer ${
                isCleared
                  ? 'bg-teal-500/25 text-teal-100 border-teal-400/60'
                  : 'bg-fuchsia-950/70 text-pink-200 hover:bg-fuchsia-900/70'
              }`}
            >
              <span>{isCleared ? item.grounded : item.spiral}</span>
              <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-extrabold bg-black/40">
                {isCleared ? '✓ GROUNDED' : 'REFRAME'}
              </span>
            </button>
          );
        })}
      </div>

      {allCleared && (
        <div className="text-xs font-extrabold text-emerald-300">
          💞 2 AM Spiral Cleared! +8 EQ &amp; +8 Maturity unlocked—now handle the real conversation below!
        </div>
      )}
    </div>
  );
};

/**
 * 5. BenchPressCougarGame: Pump 5 clean bench-press reps at the gym so you have
 * the upper-body & core strength to sweep your Cougar off her feet!
 */
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
    <div className="rounded-2xl border-2 border-rose-400/70 bg-gradient-to-r from-[#290f2d] via-[#191330] to-[#0f262c] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-300">
          <Flame className="h-4 w-4 text-amber-300" /> Cub Gym Minigame • Bench Press for {herName} ({reps}/5 Reps)
        </span>
        <span className="text-[11px] font-bold text-amber-300">
          +8 Chemistry &amp; +8 Chivalry (Unlock Stairway Carry!)
        </span>
      </div>

      {/* Animated Barbell Rack */}
      <div className="relative h-12 w-full overflow-hidden rounded-xl border-2 border-black bg-slate-950 px-3 flex items-center justify-between">
        <div
          className={`flex items-center gap-2 font-display text-xl text-amber-300 transition-transform duration-150 ${
            barLifted ? '-translate-y-2 scale-105' : 'translate-y-0.5'
          }`}
        >
          <span>🏋️‍♂️</span>
          <span>═══╣ 225 LBS ╠═══</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((r) => (
            <span
              key={r}
              className={`h-3 w-5 rounded-sm border border-black ${
                r <= reps ? 'bg-emerald-400' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {!done ? (
          <button
            type="button"
            onClick={handleRep}
            className="vice-panel rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 px-4 py-2 text-xs font-extrabold uppercase text-slate-950 hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            💪 Press Rep ({reps}/5) — Train for {herName}!
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> 🔥 5x225 Crushed! Stairway-Carry Strength Unlocked (+8 Chemistry, +8 Chivalry)
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * 6. CubGroomingGlowUpGame: Literal physical "grooming" glow-up!
 * Upgrade a consenting adult Cub from 5-in-1 blue body wash to Danny Ramirez / Oli Green red-carpet polish!
 */
const GROOMING_UPGRADES = [
  {
    id: 'beard',
    before: '🪒 Scruffy Neckbeard',
    after: '✨ Sculpted Jawline + Beard Oil',
  },
  {
    id: 'skincare',
    before: '🧴 5-in-1 Neon-Blue Gel',
    after: '🌿 Peptide Cleanser + SPF 50',
  },
  {
    id: 'collar',
    before: '👕 Faded Frat Graphic Tee',
    after: '🥂 Tailored Rolled-Cuff Linen',
  },
  {
    id: 'scent',
    before: '💨 Locker-Room Body Spray',
    after: '🔥 Santal & Bergamot Parfum',
  },
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
    <div className="rounded-2xl border-2 border-pink-400/70 bg-gradient-to-r from-[#2b1038] via-[#1c1332] to-[#11262d] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-pink-300">
          <Sparkles className="h-4 w-4 text-amber-300" /> Cougar &ldquo;Grooming&rdquo; Salon • Polish {hisName} ({polishedIds.length}/4)
        </span>
        <span className="text-[11px] font-bold text-amber-300">
          +8 Chemistry &amp; +8 Chivalry (Red-Carpet Glow-Up!)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {GROOMING_UPGRADES.map((item) => {
          const isPolished = completed || polishedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handlePolish(item.id)}
              className={`rounded-xl border-2 px-3 py-2 text-left text-xs font-extrabold transition cursor-pointer ${
                isPolished
                  ? 'border-emerald-400 bg-emerald-950/60 text-emerald-200'
                  : 'border-rose-400/60 bg-rose-950/50 text-rose-200 hover:bg-rose-900/60'
              }`}
            >
              {isPolished ? item.after : `${item.before} (Tap to Groom!)`}
            </button>
          );
        })}
      </div>

      {allDone && (
        <div className="text-xs font-extrabold text-emerald-300">
          ✂️ Full &ldquo;Cougar-Groomed&rdquo; Glow-Up Complete! {hisName} looks ready to walk out beside Jessica Alba—now pick your move below!
        </div>
      )}
    </div>
  );
};

/**
 * 7. ThermostatPitCrewGame: Tactile 3 AM Perimenopause Cooling Dial (74°F -> 62°F) + Cold-Pillow Flip!
 */
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
    <div className="rounded-2xl border-2 border-cyan-400/70 bg-gradient-to-r from-[#0e2235] via-[#161932] to-[#261134] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-cyan-300">
          ❄️ 3 AM Cooling Pit-Crew Toy • Dial {herName}’s Room to 62°F &amp; Flip Pillow!
        </span>
        <span className="font-display text-2xl text-amber-300">{temp}°F</span>
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
        className="w-full accent-cyan-400 cursor-pointer h-2.5 rounded-lg bg-black/60"
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
          className={`rounded-xl border-2 border-black px-3.5 py-1.5 text-xs font-extrabold transition cursor-pointer ${
            pillowFlipped
              ? 'bg-cyan-400 text-slate-950'
              : 'bg-slate-800 text-cyan-200 hover:bg-slate-700'
          }`}
        >
          {pillowFlipped ? '✓ Pillow Flipped to Arctic Side' : '🧊 Tap to Flip Pillow to Cold Side'}
        </button>

        {awarded || completed ? (
          <span className="text-xs font-extrabold text-emerald-300">
            ❄️ 62°F Sanctuary Locked! (+10 EQ, +8 Chemistry)
          </span>
        ) : (
          <span className="text-[11px] text-slate-300">
            Slide dial down to 62°F + flip pillow!
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * 8. BigCarlWinePourGame: Cougar Town "Big Carl" Giant Goblet Pour!
 * Tap to pour Cabernet into the 74%..92% sweet spot without overflowing onto her white linen!
 */
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
    <div className="rounded-2xl border-2 border-rose-400/70 bg-gradient-to-r from-[#2c0e28] via-[#1b112e] to-[#10242c] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-pink-200">
          🍷 Cougar Town &ldquo;Big Carl&rdquo; Goblet • Pour to the 80% Gold Line!
        </span>
        <span className="text-xs font-extrabold text-amber-300">Goblet Level: {fill}%</span>
      </div>

      <div className="relative h-9 w-full overflow-hidden rounded-xl border-2 border-black bg-slate-950">
        <div
          className="h-full bg-gradient-to-r from-[#5c0a28] via-rose-700 to-rose-500 transition-all duration-150"
          style={{ width: `${fill}%` }}
        />
        <div className="absolute inset-y-0 left-[74%] w-[20%] border-x-2 border-amber-300 bg-amber-400/20 flex items-center justify-center text-[10px] font-extrabold text-amber-200">
          🥂 BIG CARL ZONE
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        {!locked && !completed ? (
          <button
            type="button"
            onClick={handlePourSplash}
            className="vice-panel rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 px-4 py-2 text-xs font-extrabold uppercase text-slate-950 hover:brightness-110 cursor-pointer"
          >
            🍷 Pour Heavy Splash (+22%)
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> 🍷 Jules Cobb Approved &ldquo;Just One Glass&rdquo; Pour! (+8 Chemistry, +8 Chivalry)
          </span>
        )}
      </div>
    </div>
  );
};

export const MinigameWidget: React.FC<MinigameWidgetProps> = ({
  type,
  alreadyCompleted,
  herName,
  hisName,
  onWinBonus,
}) => {
  if (type === 'check_reflex') {
    return <CheckDropReflexGame completed={alreadyCompleted} onWin={onWinBonus} />;
  }
  if (type === 'trail_pace') {
    return (
      <TrailPaceRunnerGame completed={alreadyCompleted} herName={herName} onWin={onWinBonus} />
    );
  }
  if (type === 'doubt_spiral') {
    return <DoubtSpiralGame completed={alreadyCompleted} onWin={onWinBonus} />;
  }
  if (type === 'bench_press') {
    return (
      <BenchPressCougarGame completed={alreadyCompleted} herName={herName} onWin={onWinBonus} />
    );
  }
  if (type === 'cub_grooming') {
    return (
      <CubGroomingGlowUpGame completed={alreadyCompleted} hisName={hisName} onWin={onWinBonus} />
    );
  }
  if (type === 'thermostat_dial') {
    return (
      <ThermostatPitCrewGame completed={alreadyCompleted} herName={herName} onWin={onWinBonus} />
    );
  }
  if (type === 'big_carl_pour') {
    return <BigCarlWinePourGame completed={alreadyCompleted} onWin={onWinBonus} />;
  }
  return <RoomAuditHotspotGame completed={alreadyCompleted} onWin={onWinBonus} />;
};
