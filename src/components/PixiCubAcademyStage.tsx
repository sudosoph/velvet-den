import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  Bell,
  Camera,
  Crown,
  ExternalLink,
  Eye,
  Heart,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import {
  CLUB_POLAROIDS,
  getTotalRosterCount,
  type DateodexState,
} from '../domain/dateodex';
import {
  HER_ARCHETYPES,
  HIS_ARCHETYPES,
  type HerArchetype,
  type HisArchetype,
  type PlayerRole,
} from '../domain/taxonomy';
import { buildAffiliateUrl, getAffiliateById } from '../lib/affiliates';
import { sfx } from '../lib/sound';

interface PixiCubAcademyStageProps {
  role: PlayerRole;
  her: HerArchetype;
  his: HisArchetype;
  dateodex: DateodexState;
  initialSubTab?: 'obedience' | 'scanner' | 'dateodex';
  onBackToRoster: () => void;
  onSelectHis: (nextHis: HisArchetype) => void;
  onSelectHer: (nextHer: HerArchetype) => void;
  onGraduateCub: (hisId: string, herId: string) => boolean;
  onCompleteRoomScan: (hisId: string) => void;
  onOpenCourtroom: () => void;
}

interface ObedienceDrill {
  id: string;
  badge: string;
  wildImpulse: string;
  cubBubbleBefore: string;
  cubBubbleAfter: string;
  rightCmdLabel: string;
  rightCmdSub: string;
  wrongCmdLabel: string;
  wrongFeedback: string;
  expressionBefore: 'smug' | 'sweat' | 'rush' | 'eager';
  statLabel: string;
}

interface RoomHazard {
  id: string;
  emoji: string;
  xPct: number;
  yPct: number;
  redLabel: string;
  greenUpgrade: string;
  roastLine: string;
}

const OBEDIENCE_DRILLS: ObedienceDrill[] = [
  {
    id: 'drill-cubsplain',
    badge: 'Drill 1 of 4 • Impulse Control',
    wildImpulse: '🤓 Wild Cub Impulse: He clears his throat to "well actually" her career!',
    cubBubbleBefore: '"Well actually, I heard on a 3-hr podcast, "',
    cubBubbleAfter: '"Wait, tell me how YOU built it first 🥺✨"',
    rightCmdLabel: '🔔 Clicker: "Sit & Listen!"',
    rightCmdSub: 'Mute the podcast brain & unlock active curiosity (+25 Obedience)',
    wrongCmdLabel: '😴 Let Him Cubsplain for 20 Mins',
    wrongFeedback: 'BARK! Never reward a podcast lecture on Date #1, hit the Clicker!',
    expressionBefore: 'smug',
    statLabel: 'Zero-Cubsplain Ears',
  },
  {
    id: 'drill-contraband',
    badge: 'Drill 2 of 4 • Texting Roast',
    wildImpulse: '👻 Wild Cub Impulse: Two minutes into your Uber he types "for ur age + whats ur snap??"',
    cubBubbleBefore: '"u look crazy good for ur age 🔥 whats ur snap??"',
    cubBubbleAfter: '"Deleted Snap in 2019 😅 7:30 wine bar Friday, here’s my real # 🍸"',
    rightCmdLabel: '📵 Command: "Drop the Snap!"',
    rightCmdSub: 'Roast teenage streak requests & train real calendar invites (+25 Housebroken)',
    wrongCmdLabel: '👻 Download Snapchat for Streaks',
    wrongFeedback: 'YELP! You run a department and own a wine fridge, never reward "whats ur snap"!',
    expressionBefore: 'sweat',
    statLabel: 'Zero-Snapchat Thumb',
  },
  {
    id: 'drill-leash-heel',
    badge: 'Drill 3 of 4 • Chivalry Reflex',
    wildImpulse: '🚗 Wild Cub Impulse: He walks curb-side on his phone & forgets the passenger door!',
    cubBubbleBefore: '"Wait oh did you want me to get the door??"',
    cubBubbleAfter: '"Street-side locked, car door open & seat warmer pre-set to Level 2 ✨"',
    rightCmdLabel: '🦮 Gentle Tug: "Door & Seat-Warmer!"',
    rightCmdSub: 'Train automatic sidewalk etiquette & warm car doors (+25 Chivalry)',
    wrongCmdLabel: '🥶 Open Your Own Freezing Door',
    wrongFeedback: 'WHOA! Give the braided short-leash a playful tug so chivalry becomes muscle memory!',
    expressionBefore: 'rush',
    statLabel: 'Seat-Warmer Chivalry',
  },
  {
    id: 'drill-good-boy-treat',
    badge: 'Drill 4 of 4 • Positive Reinforcement',
    wildImpulse: '🐕‍🦺 Final Exam: Phone face-down on Do Not Disturb & Friday 7:30 Resy locked!',
    cubBubbleBefore: '"Phone’s tucked away all night, just excited to hear about your week 😊"',
    cubBubbleAfter: '"CERTIFIED GOOD BOY™ UNLOCKED! 💖👑🥩"',
    rightCmdLabel: '🥩 Toss Grass-Fed Steak Treat ("Good Boy!")',
    rightCmdSub: 'Reward calm Golden-Retriever devotion & mint S-Rank Diploma (+25 Chemistry)',
    wrongCmdLabel: '👻 Leave Him on Read for 4 Days',
    wrongFeedback: 'When a Cub nails all 3 green flags, toss the treat and praise him!',
    expressionBefore: 'eager',
    statLabel: 'Good-Boy Recall',
  },
];

const ROOM_HAZARDS: RoomHazard[] = [
  {
    id: 'haz-pillow',
    emoji: '🛏️',
    xPct: 22,
    yPct: 48,
    redLabel: '1 Flat Yellowed College Pillow',
    greenUpgrade: '4 Plush Percale + Mulberry Silk Pillows',
    roastLine: 'Upgraded single pancake pillow to a 4-pillow hotel cloud!',
  },
  {
    id: 'haz-trash',
    emoji: '🗑️',
    xPct: 76,
    yPct: 62,
    redLabel: 'Unlidded Bathroom Trash Can',
    greenUpgrade: 'Matte-Black Lidded Bin & Hand Towel',
    roastLine: 'Installed a lidded bathroom bin, civilization restored!',
  },
  {
    id: 'haz-soap',
    emoji: '🧴',
    xPct: 64,
    yPct: 32,
    redLabel: '5-in-1 Body/Hair/Dish/Engine Wash',
    greenUpgrade: 'Cedarwood & Bergamot Apothecary Set',
    roastLine: 'Banished the 5-in-1 neon gel for real cedar skincare!',
  },
  {
    id: 'haz-venmo',
    emoji: '💸',
    xPct: 45,
    yPct: 72,
    redLabel: 'Draft $19.50 Ribeye Venmo Request',
    greenUpgrade: 'Handwritten Love Coupon & Wine Menu',
    roastLine: 'Deleted the petty Venmo draft before she ever saw it!',
  },
  {
    id: 'haz-pollen',
    emoji: '🌲',
    xPct: 83,
    yPct: 28,
    redLabel: '11:47 PM Pine-Pollen Tincture',
    greenUpgrade: 'Chilled Zero-Proof Botanical Spritz',
    roastLine: 'Swapped midnight pine-pollen spirals for calm botanical spritzes!',
  },
];

function isWebGlCapableRuntime(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = (navigator.userAgent || '').toLowerCase();
  if (ua.includes('jsdom') || ua.includes('happy-dom')) return false;
  return true;
}

export const PixiCubAcademyStage: React.FC<PixiCubAcademyStageProps> = ({
  her,
  his,
  dateodex,
  initialSubTab = 'obedience',
  onBackToRoster,
  onSelectHis,
  onGraduateCub,
  onCompleteRoomScan,
  onOpenCourtroom,
}) => {
  const [subTab, setSubTab] = useState<'obedience' | 'scanner' | 'dateodex'>(initialSubTab);
  const [drillIdx, setDrillIdx] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [feedbackToast, setFeedbackToast] = useState<{ text: string; ok: boolean } | null>(null);
  const [graduatedCreditToast, setGraduatedCreditToast] = useState(false);
  const [scannedHazardIds, setScannedHazardIds] = useState<string[]>([]);
  const [lastScanNote, setLastScanNote] = useState<string | null>(null);
  const [pixiReady, setPixiReady] = useState(false);

  const pixiHostRef = useRef<HTMLDivElement | null>(null);
  const animTriggerRef = useRef<{ kind: 'clicker' | 'treat' | 'bark'; ts: number }>({
    kind: 'clicker',
    ts: 0,
  });
  const stateRef = useRef({
    drillIdx,
    graduated: false,
    herName: her.name,
    hisName: his.name,
  });

  const isGraduated = completedIds.length >= OBEDIENCE_DRILLS.length;
  const currentDrill = OBEDIENCE_DRILLS[Math.min(drillIdx, OBEDIENCE_DRILLS.length - 1)];
  const obedienceScore = completedIds.length * 25;

  stateRef.current = {
    drillIdx,
    graduated: isGraduated,
    herName: her.name,
    hisName: his.name,
  };

  // Mount genuine 60fps PixiJS v8 WebGL/Canvas 2D Stage in browser runtimes!
  useEffect(() => {
    if (subTab !== 'obedience' || !isWebGlCapableRuntime() || !pixiHostRef.current) {
      return;
    }

    let cancelled = false;
    let destroyFn: (() => void) | null = null;

    (async () => {
      try {
        const PIXI = await import('pixi.js');
        if (cancelled || !pixiHostRef.current) return;

        const app = new PIXI.Application();
        await app.init({
          width: 860,
          height: 290,
          backgroundColor: 0x18101e,
          antialias: true,
          resolution: Math.min(2, window.devicePixelRatio || 1),
          autoDensity: true,
        });

        if (cancelled || !pixiHostRef.current) {
          app.destroy(true, { children: true });
          return;
        }

        const canvasEl = app.canvas as HTMLCanvasElement;
        canvasEl.style.width = '100%';
        canvasEl.style.height = 'auto';
        canvasEl.style.display = 'block';
        pixiHostRef.current.innerHTML = '';
        pixiHostRef.current.appendChild(canvasEl);
        setPixiReady(true);

        // Background Lounge Stage & Velvet Rug
        const bg = new PIXI.Graphics();
        bg.roundRect(18, 18, 824, 254, 22)
          .fill({ color: 0x24162d })
          .stroke({ width: 2, color: 0xfd267a, alpha: 0.45 });
        bg.ellipse(430, 226, 330, 34).fill({ color: 0x351e42, alpha: 0.9 });
        bg.ellipse(430, 226, 260, 22).fill({ color: 0xfd267a, alpha: 0.16 });
        app.stage.addChild(bg);

        // Dynamic Braided Leather Short-Leash Graphics
        const leashGfx = new PIXI.Graphics();
        app.stage.addChild(leashGfx);

        // Left Character Rig: Cougar Trainer
        const herRig = new PIXI.Container();
        herRig.x = 205;
        herRig.y = 185;
        const herBody = new PIXI.Graphics();
        herBody.roundRect(-28, -48, 56, 78, 18).fill({ color: 0xe11d48 });
        herBody.circle(0, -72, 26).fill({ color: 0xffedd5 }).stroke({ width: 3, color: 0xfbbf24 });
        // Sunglasses / Cool Black-Cat Wink
        herBody.roundRect(-17, -79, 14, 8, 3).fill({ color: 0x18101e });
        herBody.roundRect(3, -79, 14, 8, 3).fill({ color: 0x18101e });
        herBody.moveTo(-6, -63).quadraticCurveTo(0, -58, 7, -63).stroke({ width: 2.5, color: 0xe11d48 });
        // Golden Clicker in right hand
        herBody.roundRect(24, -26, 20, 14, 5).fill({ color: 0xfbbf24 }).stroke({ width: 2, color: 0x18101e });
        herRig.addChild(herBody);

        const herLabel = new PIXI.Text({
          text: `🐆 ${stateRef.current.herName}`,
          style: {
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 13,
            fontWeight: '800',
            fill: 0xffffff,
          },
        });
        herLabel.anchor.set(0.5, 0);
        herLabel.y = 38;
        herRig.addChild(herLabel);
        app.stage.addChild(herRig);

        // Center Companion: Miso the Tricolor Mini Bernedoodle!
        const puppyRig = new PIXI.Container();
        puppyRig.x = 430;
        puppyRig.y = 212;
        const puppyGfx = new PIXI.Graphics();
        puppyGfx.roundRect(-20, -16, 40, 24, 10).fill({ color: 0xfef3c7 });
        puppyGfx.circle(-12, -16, 13).fill({ color: 0x1f2937 });
        puppyGfx.circle(-16, -18, 5).fill({ color: 0xd97706 });
        puppyGfx.circle(-13, -17, 2.5).fill({ color: 0xffffff });
        puppyRig.addChild(puppyGfx);
        const puppyTag = new PIXI.Text({
          text: '🐶 Miso (Referee)',
          style: {
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 11,
            fontWeight: '700',
            fill: 0xfde68a,
          },
        });
        puppyTag.anchor.set(0.5, 0);
        puppyTag.y = 13;
        puppyRig.addChild(puppyTag);
        app.stage.addChild(puppyRig);

        // Right Character Rig: Cub Trainee + Wagging Golden-Retriever Tail!
        const hisRig = new PIXI.Container();
        hisRig.x = 655;
        hisRig.y = 185;

        const tailGfx = new PIXI.Graphics();
        tailGfx.roundRect(18, -14, 28, 10, 5).fill({ color: 0xf59e0b });
        hisRig.addChild(tailGfx);

        const hisBody = new PIXI.Graphics();
        hisBody.roundRect(-30, -48, 60, 78, 18).fill({ color: 0x2563eb });
        // Braided collar nod badge
        hisBody.roundRect(-18, -48, 36, 9, 4).fill({ color: 0x92400e }).stroke({ width: 1.5, color: 0xfbbf24 });
        hisBody.circle(0, -72, 26).fill({ color: 0xffedd5 }).stroke({ width: 3, color: 0x60a5fa });
        hisRig.addChild(hisBody);

        const hisFaceText = new PIXI.Text({
          text: '🤓',
          style: { fontSize: 24 },
        });
        hisFaceText.anchor.set(0.5, 0.5);
        hisFaceText.y = -73;
        hisRig.addChild(hisFaceText);

        const hisLabel = new PIXI.Text({
          text: `🐕 ${stateRef.current.hisName}`,
          style: {
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 13,
            fontWeight: '800',
            fill: 0xffffff,
          },
        });
        hisLabel.anchor.set(0.5, 0);
        hisLabel.y = 38;
        hisRig.addChild(hisLabel);
        app.stage.addChild(hisRig);

        // Flying Parabolic Treat & Clicker Ring Layer
        const fxLayer = new PIXI.Container();
        app.stage.addChild(fxLayer);

        // Top Stage Banner Text
        const hudBanner = new PIXI.Text({
          text: '60FPS PIXIJS OBEDIENCE RING • TAP COMMANDS BELOW OR CLICK CUB TO NUDGE!',
          style: {
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 11,
            fontWeight: '800',
            fill: 0xfda4af,
            letterSpacing: 1,
          },
        });
        hudBanner.anchor.set(0.5, 0);
        hudBanner.x = 430;
        hudBanner.y = 32;
        app.stage.addChild(hudBanner);

        const particles: {
          txt: InstanceType<typeof PIXI.Text>;
          vx: number;
          vy: number;
          life: number;
        }[] = [];

        let elapsed = 0;
        let lastHandledTriggerTs = 0;

        app.ticker.add((ticker) => {
          elapsed += ticker.deltaTime * 0.06;
          const st = stateRef.current;

          herLabel.text = `🐆 ${st.herName}`;
          hisLabel.text = `🐕 ${st.hisName}`;

          // Expressive breathing & tail-wag speed
          herRig.y = 185 + Math.sin(elapsed * 2.1) * 3;
          const wagSpeed = st.graduated ? 12 : 5 + st.drillIdx * 1.8;
          tailGfx.rotation = Math.sin(elapsed * wagSpeed) * 0.45;
          hisRig.y = (st.graduated ? 182 : 185) + Math.cos(elapsed * 2.6) * (st.graduated ? 5 : 3);
          puppyRig.y = 212 + Math.abs(Math.sin(elapsed * 4.2)) * -6;

          const faces = ['🤓', '😅', '🏃', '🥺'];
          hisFaceText.text = st.graduated ? '😍' : faces[st.drillIdx] || '🐕';

          // Draw Braided Leather Short-Leash Curve between Her hand & Cub collar
          leashGfx.clear();
          const startX = herRig.x + 36;
          const startY = herRig.y - 19;
          const endX = hisRig.x - 18;
          const endY = hisRig.y - 44;
          const sag = st.graduated ? 48 : st.drillIdx === 2 ? 6 : 32 + Math.sin(elapsed * 3) * 6;
          leashGfx
            .moveTo(startX, startY)
            .quadraticCurveTo((startX + endX) / 2, Math.max(startY, endY) + sag, endX, endY)
            .stroke({
              width: 3.5,
              color: st.graduated ? 0xfbbf24 : 0xd97706,
              alpha: 0.95,
            });

          // Spawn burst particles on command trigger!
          if (animTriggerRef.current.ts > lastHandledTriggerTs) {
            lastHandledTriggerTs = animTriggerRef.current.ts;
            const kind = animTriggerRef.current.kind;
            const icons =
              kind === 'treat'
                ? ['🥩', '💖', '👑', '✨', '🏆']
                : kind === 'bark'
                  ? ['🚩', '🐾', '💥']
                  : ['🔔', '✨', '💚', '🐕'];
            for (let i = 0; i < 8; i += 1) {
              const p = new PIXI.Text({
                text: icons[i % icons.length],
                style: { fontSize: 20 },
              });
              p.anchor.set(0.5, 0.5);
              p.x = kind === 'treat' ? 430 : hisRig.x;
              p.y = hisRig.y - 65;
              fxLayer.addChild(p);
              particles.push({
                txt: p,
                vx: (Math.random() - 0.5) * 5.5,
                vy: -2.4 - Math.random() * 3.2,
                life: 52,
              });
            }
          }

          for (let i = particles.length - 1; i >= 0; i -= 1) {
            const pt = particles[i];
            pt.txt.x += pt.vx * ticker.deltaTime;
            pt.txt.y += pt.vy * ticker.deltaTime;
            pt.vy += 0.08 * ticker.deltaTime;
            pt.life -= ticker.deltaTime;
            pt.txt.alpha = Math.max(0, pt.life / 52);
            if (pt.life <= 0) {
              fxLayer.removeChild(pt.txt);
              pt.txt.destroy();
              particles.splice(i, 1);
            }
          }
        });

        destroyFn = () => {
          app.destroy(true, { children: true });
        };
      } catch {
        setPixiReady(false);
      }
    })();

    return () => {
      cancelled = true;
      if (destroyFn) destroyFn();
    };
  }, [subTab]);

  const handleRightCommand = () => {
    if (isGraduated) return;
    const drill = OBEDIENCE_DRILLS[drillIdx];
    const nextCompleted = [...completedIds, drill.id];
    setCompletedIds(nextCompleted);

    if (nextCompleted.length >= OBEDIENCE_DRILLS.length) {
      sfx.victoryFanfare();
      animTriggerRef.current = { kind: 'treat', ts: Date.now() };
      setFeedbackToast({
        text: `${his.name} passed all 4 Obedience Drills! S-Rank "Certified Good Boy™" Diploma & Polaroid Unlocked!`,
        ok: true,
      });
      const granted = onGraduateCub(his.id, her.id);
      if (granted) setGraduatedCreditToast(true);
    } else {
      sfx.greenFlag();
      animTriggerRef.current = { kind: 'clicker', ts: Date.now() };
      setFeedbackToast({
        text: `${drill.cubBubbleAfter} (+25 Obedience)`,
        ok: true,
      });
      setDrillIdx(drillIdx + 1);
    }
  };

  const handleWrongCommand = () => {
    sfx.redFlag();
    animTriggerRef.current = { kind: 'bark', ts: Date.now() };
    setFeedbackToast({
      text: currentDrill.wrongFeedback,
      ok: false,
    });
  };

  const handleResetDrill = () => {
    sfx.messagePop();
    setDrillIdx(0);
    setCompletedIds([]);
    setFeedbackToast(null);
  };

  const handleScanHazard = (hazard: RoomHazard) => {
    if (scannedHazardIds.includes(hazard.id)) return;
    sfx.greenFlag();
    const next = [...scannedHazardIds, hazard.id];
    setScannedHazardIds(next);
    setLastScanNote(hazard.roastLine);
    if (next.length === ROOM_HAZARDS.length) {
      sfx.victoryFanfare();
      onCompleteRoomScan(his.id);
    }
  };

  const totalRoster = getTotalRosterCount();
  const totalStamped = Object.keys(dateodex.stamps).length;
  const allCast = [...HER_ARCHETYPES, ...HIS_ARCHETYPES];

  return (
    <div className="w-full space-y-5 animate-stage-in">
      {/* Header & Mode Switcher */}
      <section className="vice-panel rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-white via-[#FFF7F9] to-[#FFFDF5] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToRoster}
            className="pop-btn inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-extrabold text-[#18101E] cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Roster</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B]/40 px-3 text-xs font-extrabold text-[#92400E]">
              <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
              <span>PixiJS 2D Arcade • Dream Daddy × Date Everything Mode</span>
            </span>
            <button
              type="button"
              onClick={onOpenCourtroom}
              className="pop-btn inline-flex h-8 items-center gap-1.5 rounded-full bg-[#18101E] px-3.5 text-xs font-extrabold text-white cursor-pointer"
            >
              <Crown className="h-3.5 w-3.5 text-[#FBBF24]" />
              <span>Crown Him / Dump Him Court →</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl text-[#18101E]">
              🐕 Cub Obedience Simulator &amp; 2D Room Roast
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#475569] mt-1">
              Pure satirical arcade sim: clicker-train <strong>{his.name} ({his.age}M)</strong> out of classic dating-app blunders, X-ray his bachelor pad, and collect all {totalRoster} Dateodex stamps &amp; Polaroid CGs.
            </p>
          </div>

          {/* Quick Cub Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="academy-cub-select" className="text-xs font-extrabold text-[#475569]">
              Trainee Cub:
            </label>
            <select
              id="academy-cub-select"
              aria-label="Select Cub to Train"
              value={his.id}
              onChange={(e) => {
                const found = HIS_ARCHETYPES.find((c) => c.id === e.target.value);
                if (found) {
                  onSelectHis(found);
                  handleResetDrill();
                }
              }}
              className="h-9 rounded-xl border border-[#18101E]/20 bg-white px-3 text-xs font-bold text-[#18101E]"
            >
              {HIS_ARCHETYPES.map((cub) => (
                <option key={cub.id} value={cub.id}>
                  {cub.name} ({cub.age}M) • {cub.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3 Clean Sub-Mode Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#18101E]/10">
          <button
            type="button"
            onClick={() => setSubTab('obedience')}
            className={`pop-btn h-11 rounded-2xl px-4 text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer ${
              subTab === 'obedience'
                ? 'bg-gradient-to-r from-[#E11D48] to-[#FF6036] text-white border-transparent'
                : 'bg-white text-[#18101E]'
            }`}
          >
            <Bell className="h-4 w-4 shrink-0" />
            <span>1. 2D Cub Clicker School (+3 Cr)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('scanner')}
            className={`pop-btn h-11 rounded-2xl px-4 text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer ${
              subTab === 'scanner'
                ? 'bg-[#059669] text-white border-transparent'
                : 'bg-white text-[#18101E]'
            }`}
          >
            <Eye className="h-4 w-4 shrink-0" />
            <span>2. Apartment X-Ray Scanner ({scannedHazardIds.length}/5)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('dateodex')}
            className={`pop-btn h-11 rounded-2xl px-4 text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer ${
              subTab === 'dateodex'
                ? 'bg-[#7C3AED] text-white border-transparent'
                : 'bg-white text-[#18101E]'
            }`}
          >
            <Camera className="h-4 w-4 shrink-0" />
            <span>
              3. Dateodex &amp; Polaroids ({totalStamped}/{totalRoster})
            </span>
          </button>
        </div>
      </section>

      {/* =====================================================================
       * SUB-MODE 1: 60FPS PIXIJS 2D CUB OBEDIENCE & CLICKER SCHOOL
       * ===================================================================== */}
      {subTab === 'obedience' && (
        <section className="vice-panel rounded-3xl p-5 sm:p-6 bg-white space-y-5">
          {graduatedCreditToast && (
            <div className="rounded-2xl bg-[#D1FAE5] border border-[#059669]/30 px-4 py-3 text-xs sm:text-sm font-extrabold text-[#065F46]">
              🎉 +3 Bonus Club Credits awarded for graduating your first Certified Good Boy™!
            </div>
          )}

          {/* Top Obedience Meter + 4 Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#18101E] px-3 py-1 text-xs font-extrabold text-[#FBBF24]">
                Obedience Score: {obedienceScore}/100
              </span>
              <span className="rounded-full bg-[#FFF1F2] border border-[#FECDD3] px-3 py-1 text-xs font-extrabold text-[#E11D48]">
                {isGraduated ? 'Rank S • Off-Leash Certified!' : currentDrill.badge}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {OBEDIENCE_DRILLS.map((d, idx) => {
                const done = completedIds.includes(d.id);
                return (
                  <span
                    key={d.id}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold border ${
                      done
                        ? 'border-[#059669]/40 bg-[#ECFDF5] text-[#065F46]'
                        : idx === drillIdx
                          ? 'border-[#F59E0B] bg-[#FFFBEB] text-[#92400E]'
                          : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {done ? '✓ ' : `${idx + 1}. `}
                    {d.statLabel}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 60fps PixiJS 2D Canvas Container + Expressive Character Overlay */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#18101E] bg-[#18101E] p-3 sm:p-4">
            <div ref={pixiHostRef} className="w-full overflow-hidden rounded-2xl" />

            {/* Accessible / Non-WebGL Visual Stage Fallback when running headless or before WebGL init */}
            {!pixiReady && (
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#24162D] px-6 py-8 text-white">
                <div className="flex items-center gap-3">
                  <img
                    src={her.photoUrl}
                    alt={her.name}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-[#FD267A]"
                  />
                  <div>
                    <div className="text-xs font-extrabold uppercase text-[#FDA4AF]">
                      Trainer • Braided Short-Leash Ready
                    </div>
                    <div className="font-display text-lg">{her.name}, {her.age}F</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl">{isGraduated ? '🦮💖👑' : '🔔〰️🦮'}</div>
                  <div className="text-[11px] font-bold text-[#FDE68A] mt-1">
                    🐶 Miso Refereeing Live
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="text-xs font-extrabold uppercase text-[#93C5FD]">
                      Trainee Cub • {isGraduated ? '😍 Heart-Eyes' : '🐕 Tail Wagging'}
                    </div>
                    <div className="font-display text-lg">{his.name}, {his.age}M</div>
                  </div>
                  <img
                    src={his.photoUrl}
                    alt={his.name}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-[#FBBF24]"
                  />
                </div>
              </div>
            )}

            {/* Live Comic Dialogue Bubble Strip */}
            <div className="mt-3 rounded-2xl bg-white/95 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs sm:text-sm font-extrabold text-[#18101E]">
                {isGraduated
                  ? `🏆 ${his.name} (${his.age}M) graduated with S-Rank Sanctuary Privileges!`
                  : currentDrill.wildImpulse}
              </div>
              <div className="rounded-xl bg-[#FFF1F2] border border-[#FECDD3] px-3 py-1.5 text-xs font-bold text-[#BE123C]">
                {his.name}:{' '}
                {isGraduated ? '"Good boy mode locked for life 😍🥂"' : currentDrill.cubBubbleBefore}
              </div>
            </div>
          </div>

          {feedbackToast && (
            <div
              className={`rounded-2xl px-4 py-3 text-xs sm:text-sm font-extrabold border ${
                feedbackToast.ok
                  ? 'bg-[#ECFDF5] border-[#059669]/30 text-[#065F46]'
                  : 'bg-[#FFF1F2] border-[#E11D48]/30 text-[#BE123C]'
              }`}
            >
              {feedbackToast.text}
            </div>
          )}

          {/* Command Buttons OR Official Certified Good Boy Diploma */}
          {isGraduated ? (
            <div className="rounded-3xl border-2 border-[#F59E0B] bg-gradient-to-r from-[#FFFBEB] via-white to-[#FFF1F2] p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#18101E] px-3 py-1 text-xs font-extrabold text-[#FBBF24]">
                    <Award className="h-3.5 w-3.5" />
                    <span>OFFICIAL CUB OBEDIENCE DIPLOMA • RANK S</span>
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl text-[#18101E]">
                    👑 {his.name} ({his.age}M) • Certified Good Boy™
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-[#475569]">
                    Trained personally by <strong>{her.name} ({her.age}F)</strong>. Stamped as{' '}
                    <strong>👑 Crowned (Rank S)</strong> in your Club Dateodex &amp; unlocked{' '}
                    <strong>Polaroid #1</strong>!
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSubTab('scanner')}
                    className="pop-btn h-11 rounded-2xl bg-[#059669] px-4 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
                  >
                    Scan His Apartment Next →
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubTab('dateodex')}
                    className="pop-btn h-11 rounded-2xl bg-[#7C3AED] px-4 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
                  >
                    View Unlocked Polaroid 📸
                  </button>
                  <button
                    type="button"
                    onClick={handleResetDrill}
                    className="pop-btn h-11 rounded-2xl bg-white px-4 text-xs sm:text-sm font-bold text-[#18101E] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Train Again</span>
                  </button>
                </div>
              </div>

              {/* Contextual Self-Referential Graduation Merch Bar */}
              <div className="pt-3 border-t border-[#F59E0B]/30 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-[#92400E]">
                  <ShoppingBag className="h-3.5 w-3.5 text-[#E11D48]" />
                  <span>Official Certified Good-Boy Graduation Kit (Real-Life Inside-Joke Gifts)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(
                    [
                      'trophy-boyfriend-cooking-apron',
                      'good-boy-brass-training-clicker',
                      'leopard-print-cougar-apron',
                    ] as const
                  ).map((affId) => {
                    const item = getAffiliateById(affId);
                    if (!item) return null;
                    return (
                      <a
                        key={item.id}
                        href={buildAffiliateUrl(item, 'cub_academy_diploma')}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="rounded-2xl border border-[#18101E]/15 bg-white hover:bg-[#FFFDF5] p-3.5 flex flex-col justify-between gap-2 transition shadow-xs"
                      >
                        <div>
                          <span className="inline-block rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-extrabold text-[#92400E]">
                            {item.badge}
                          </span>
                          <div className="mt-1 text-xs font-extrabold text-[#18101E]">
                            {item.name}
                          </div>
                          <p className="mt-0.5 text-[11px] font-medium text-[#64748B] line-clamp-2">
                            {item.cheekyPitch}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#E11D48]">
                          <span>Shop Protected Link</span>
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleRightCommand}
                className="pop-btn rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#FF6036] p-4 text-left text-white border-transparent cursor-pointer"
              >
                <div className="text-sm sm:text-base font-extrabold">{currentDrill.rightCmdLabel}</div>
                <div className="text-xs font-medium text-white/90 mt-1">
                  {currentDrill.rightCmdSub}
                </div>
              </button>

              <button
                type="button"
                onClick={handleWrongCommand}
                className="pop-btn rounded-2xl bg-slate-50 hover:bg-[#FFF1F2] p-4 text-left text-[#18101E] cursor-pointer"
              >
                <div className="text-sm sm:text-base font-extrabold">{currentDrill.wrongCmdLabel}</div>
                <div className="text-xs font-medium text-[#64748B] mt-1">
                  Test what happens if you let a feral habit slide…
                </div>
              </button>
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
       * SUB-MODE 2: DATE EVERYTHING × FLORENCE POINT-AND-CLICK ROOM SCANNER
       * ===================================================================== */}
      {subTab === 'scanner' && (
        <section className="vice-panel rounded-3xl p-5 sm:p-6 bg-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-[#18101E]">
                🕶️ Cougar X-Ray Shades: Inspect {his.name}’s Apartment!
              </h2>
              <p className="text-xs sm:text-sm font-medium text-[#475569]">
                He stepped into the kitchen for sparkling water, tap all <strong>5 bachelor-pad red flags</strong> directly inside the room to upgrade his sanctuary!
              </p>
            </div>
            <span className="rounded-full bg-[#ECFDF5] border border-[#059669]/30 px-3.5 py-1 text-xs font-extrabold text-[#065F46]">
              {scannedHazardIds.length} / {ROOM_HAZARDS.length} Upgraded
            </span>
          </div>

          <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-3xl border-2 border-[#18101E] bg-[#18101E]">
            <img
              src="./images/scenes/luxury-bedroom-sanctuary.jpg"
              alt="Cub Apartment Inspection Scene"
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40" />

            {ROOM_HAZARDS.map((haz) => {
              const fixed = scannedHazardIds.includes(haz.id);
              return (
                <button
                  key={haz.id}
                  type="button"
                  onClick={() => handleScanHazard(haz)}
                  style={{ left: `${haz.xPct}%`, top: `${haz.yPct}%` }}
                  className={`-translate-x-1/2 -translate-y-1/2 absolute rounded-2xl px-3 py-2 text-xs font-extrabold shadow-lg transition transform hover:scale-105 cursor-pointer ${
                    fixed
                      ? 'bg-[#059669] text-white border-2 border-white'
                      : 'bg-[#FFBE0B] text-[#18101E] border-2 border-[#18101E] animate-bounce'
                  }`}
                >
                  <span>{fixed ? '✨ ' : `🚩 ${haz.emoji} `}</span>
                  <span>{fixed ? haz.greenUpgrade : haz.redLabel}</span>
                </button>
              );
            })}
          </div>

          {lastScanNote && (
            <div className="rounded-2xl bg-[#ECFDF5] border border-[#059669]/30 px-4 py-3 text-xs sm:text-sm font-extrabold text-[#065F46] flex items-center justify-between gap-3">
              <span>✨ {lastScanNote}</span>
              {scannedHazardIds.length === ROOM_HAZARDS.length && (
                <button
                  type="button"
                  onClick={() => setSubTab('dateodex')}
                  className="pop-btn rounded-xl bg-[#059669] px-3 py-1.5 text-xs font-extrabold text-white cursor-pointer"
                >
                  Open Unlocked Polaroid 📸
                </button>
              )}
            </div>
          )}

          {/* Contextual Real-Life Bachelor-Pad Upgrade Picks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {(['hosting-lidded-bin-soap', 'silk-pillowcase-sleepover-duo'] as const).map((affId) => {
              const item = getAffiliateById(affId);
              if (!item) return null;
              return (
                <a
                  key={item.id}
                  href={buildAffiliateUrl(item, 'academy_room_scanner')}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="rounded-2xl border border-slate-200 bg-[#FFFDF9] hover:bg-[#FFFBEB] p-3.5 flex items-center justify-between gap-3 transition"
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#059669]">
                      Real-Life Sanctuary Fix • {item.badge}
                    </span>
                    <div className="text-xs sm:text-sm font-extrabold text-[#18101E] mt-0.5">
                      {item.name}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-xl bg-[#18101E] px-3 py-2 text-xs font-extrabold text-white inline-flex items-center gap-1">
                    <span>Shop</span>
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================================
       * SUB-MODE 3: DATE EVERYTHING "DATEODEX" + UNLOCKABLE POLAROID CGS
       * ===================================================================== */}
      {subTab === 'dateodex' && (
        <div className="space-y-5">
          {/* Polaroid Scrapbook */}
          <section className="vice-panel rounded-3xl p-5 sm:p-6 bg-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-xl sm:text-2xl text-[#18101E]">
                  📸 Unlockable Club Polaroid Memories ({dateodex.unlockedPolaroidIds.length}/
                  {CLUB_POLAROIDS.length})
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#475569]">
                  Collect romantic &amp; comedic milestone CGs across Date Runs, Cub Obedience, Room Scans, and the Courtroom.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CLUB_POLAROIDS.map((pol) => {
                const unlocked = dateodex.unlockedPolaroidIds.includes(pol.id);
                return (
                  <div
                    key={pol.id}
                    className={`rounded-2xl border border-slate-200 bg-[#FFFDF9] p-3 shadow-sm transition ${pol.rotationClass}`}
                  >
                    <div className="relative h-44 w-full overflow-hidden rounded-xl bg-[#18101E]">
                      <img
                        src={pol.imageUrl}
                        alt={pol.title}
                        className={`h-full w-full object-cover transition duration-500 ${
                          unlocked ? 'blur-none scale-100' : 'blur-md scale-110 opacity-45'
                        }`}
                      />
                      {!unlocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                          <ShieldCheck className="h-6 w-6 text-[#FBBF24] mb-1" />
                          <div className="text-xs font-extrabold uppercase tracking-wider text-[#FDE68A]">
                            Locked Polaroid
                          </div>
                          <div className="text-[11px] font-medium text-white/90 mt-1">
                            {pol.unlockHint}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="pt-3 px-1">
                      <div className="text-sm font-extrabold text-[#18101E]">
                        {unlocked ? `✨ ${pol.title}` : '??? Mystery Memory'}
                      </div>
                      <div className="text-xs font-medium text-[#64748B] mt-0.5">
                        {unlocked ? pol.caption : pol.unlockHint}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Dynamic Character Dateodex Collection Grid */}
          <section className="vice-panel rounded-3xl p-5 sm:p-6 bg-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-xl sm:text-2xl text-[#18101E]">
                  📖 {totalRoster}-Member Club Dateodex (👑 Crowned • 🤝 Friend • 🚩 Dumped)
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#475569]">
                  Inspired by <em>Date Everything!</em> &amp; <em>Dream Daddy</em>, collect an S/A/B/C rank stamp on every Cougar, Puma, Jaguar &amp; Cub in the Club!
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-extrabold">
                <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-[#92400E]">
                  👑{' '}
                  {
                    Object.values(dateodex.stamps).filter((s) => s.verdict === 'crowned').length
                  }{' '}
                  Crowned
                </span>
                <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[#1D4ED8]">
                  🤝{' '}
                  {
                    Object.values(dateodex.stamps).filter((s) => s.verdict === 'friendzoned')
                      .length
                  }{' '}
                  Friendzoned
                </span>
                <span className="rounded-full bg-[#FFF1F2] px-3 py-1 text-[#E11D48]">
                  🚩{' '}
                  {Object.values(dateodex.stamps).filter((s) => s.verdict === 'dumped').length}{' '}
                  Dumped
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {allCast.map((member) => {
                const stamp = dateodex.stamps[member.id];
                const isHer = 'tier' in member;
                return (
                  <div
                    key={member.id}
                    className={`rounded-2xl border p-2.5 text-center space-y-1.5 ${
                      stamp?.verdict === 'crowned'
                        ? 'border-[#F59E0B] bg-[#FFFBEB]'
                        : stamp?.verdict === 'friendzoned'
                          ? 'border-[#93C5FD] bg-[#EFF6FF]'
                          : stamp?.verdict === 'dumped'
                            ? 'border-[#FECDD3] bg-[#FFF1F2]'
                            : 'border-slate-200 bg-slate-50/70 opacity-75'
                    }`}
                  >
                    <div className="relative mx-auto h-14 w-14 overflow-hidden rounded-full border border-black/10">
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="h-full w-full object-cover object-top"
                      />
                      {stamp && (
                        <span className="absolute -bottom-0.5 right-0 rounded-full bg-[#18101E] px-1.5 text-[10px] font-extrabold text-[#FBBF24]">
                          {stamp.rank}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-extrabold text-[#18101E] truncate">
                      {member.name}, {member.age}
                      {isHer ? 'F' : 'M'}
                    </div>
                    <div className="text-[10px] font-extrabold uppercase">
                      {stamp ? (
                        stamp.verdict === 'crowned' ? (
                          <span className="text-[#B45309] inline-flex items-center gap-0.5">
                            <Heart className="h-3 w-3 fill-current" /> Crowned
                          </span>
                        ) : stamp.verdict === 'friendzoned' ? (
                          <span className="text-[#1D4ED8]">🤝 Friend</span>
                        ) : (
                          <span className="text-[#E11D48]">🚩 Dumped</span>
                        )
                      ) : (
                        <span className="text-slate-400">Unvetted</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
