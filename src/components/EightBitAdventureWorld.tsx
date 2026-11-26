import React, { useEffect, useRef, useState } from 'react';
import { Compass, Gamepad2, Maximize2, Minimize2, Sparkles, Zap } from 'lucide-react';
import type { PlayerRole } from '../domain/taxonomy';
import {
  getLevelInfo,
  type AdventureProgressState,
} from '../domain/progression';
import { sfx } from '../lib/sound';

interface EightBitAdventureWorldProps {
  role: PlayerRole;
  herName: string;
  hisName: string;
  progress: AdventureProgressState;
  defaultExpanded?: boolean;
  onGainXp: (deltaXp: number, patch?: Partial<AdventureProgressState>, rewardKey?: string) => void;
  onEnterEpisode: (episodeId: string) => void;
  onOpenBoutique?: () => void;
  onOpenFullTrivia?: () => void;
  onOpenFullChecklist?: () => void;
}

interface WorldBuilding {
  id: string;
  x: number;
  y: number;
  title: string;
  shortLabel: string;
  buttonName: string;
  emoji: string;
  roofColor: string;
  wallColor: string;
  episodeId: string;
  opensBoutique?: boolean;
}

interface StreetApproachNode {
  id: string;
  x: number;
  y: number;
  label: string;
  emoji: string;
  prompt: string;
  smoothOption: string;
  fumbleOption: string;
  winOutcome: string;
}

interface PatrolGoblin {
  id: string;
  name: string;
  emoji: string;
  taunt: string;
  roastLine: string;
  baseX: number;
  baseY: number;
  axis: 'x' | 'y';
  range: number;
  speed: number;
}

interface WorldPickup {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
  accent: string;
}

interface FloatingPopup {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  ttl: number;
}

const CANVAS_W = 960;
const CANVAS_H = 500;

const BUILDINGS: WorldBuilding[] = [
  {
    id: 'b_wine',
    x: 165,
    y: 86,
    title: '6 PM Wine Shop & Farmers CSA',
    shortLabel: '6 PM WINE & CSA',
    buttonName: '6 PM Wine Shop & CSA Meet-Cute',
    emoji: '🍷',
    roofColor: '#E11D48',
    wallColor: '#FFF1F2',
    episodeId: 'puma-dog-park-vetting',
  },
  {
    id: 'b_gym',
    x: 480,
    y: 86,
    title: 'Sculpt Gym & Smoothie Counter',
    shortLabel: 'GYM & SMOOTHIE',
    buttonName: 'Sacred Gym Headphone Law & Smoothie Nod',
    emoji: '🏋️‍♀️',
    roofColor: '#059669',
    wallColor: '#ECFDF5',
    episodeId: 'gym-headphones-vs-three-week-nod',
  },
  {
    id: 'b_hotel',
    x: 795,
    y: 86,
    title: 'Velvet Hotel Lobby Bar',
    shortLabel: 'HOTEL LOBBY BAR',
    buttonName: '"Babygirl" Hotel Bar Milk or Dirty Martini',
    emoji: '🍸',
    roofColor: '#7C3AED',
    wallColor: '#F5F3FF',
    episodeId: 'babygirl-hotel-bar-milk-or-martini',
  },
  {
    id: 'b_bistro',
    x: 165,
    y: 414,
    title: 'UV Bouncer & Candlelit Bistro',
    shortLabel: 'UV BOUNCER & BISTRO',
    buttonName: '45-Second UV Bouncer ID Scan & Check Drop',
    emoji: '🪪',
    roofColor: '#F59E0B',
    wallColor: '#FFFBEB',
    episodeId: 'cubsplaining-and-bouncer-id-check',
  },
  {
    id: 'b_sanctuary',
    x: 480,
    y: 414,
    title: 'Linen-Apron Sunday Sanctuary',
    shortLabel: 'SUNDAY SANCTUARY',
    buttonName: '4-Pillow Sanctuary & Linen-Apron Sunday',
    emoji: '🏡',
    roofColor: '#2563EB',
    wallColor: '#EFF6FF',
    episodeId: 'houseboy-sunday-sanctuary',
  },
  {
    id: 'b_shop',
    x: 795,
    y: 414,
    title: 'Club Gift & Apron Boutique',
    shortLabel: 'CLUB GIFT SHOP',
    buttonName: 'Club Gift & Apron Boutique (32 Picks)',
    emoji: '🛍️',
    roofColor: '#18101E',
    wallColor: '#FFFDF9',
    episodeId: 'cub-grooming-red-carpet-glowup',
    opensBoutique: true,
  },
];

const STREET_NODES: StreetApproachNode[] = [
  {
    id: 'approach_bookstore',
    x: 245,
    y: 252,
    label: 'BOOKSTORE NOD',
    emoji: '📚',
    prompt:
      'In The Wild: You both reach for the same architecture monograph at 6:15 PM. What is your move?',
    smoothOption: 'Smile warmly, ask what caught her eye, and hand her your number with zero hovering.',
    fumbleOption: 'Launch into a 12-minute podcast lecture on mid-century concrete.',
    winOutcome: '+35 XP! Unhurried bookstore curiosity beats Cubsplaining every single day.',
  },
  {
    id: 'approach_market',
    x: 480,
    y: 175,
    label: 'PEACH STAND',
    emoji: '🍑',
    prompt:
      'In The Wild: Saturday farmers market line. She laughs when the vendor drops an heirloom peach.',
    smoothOption: '"Save me a good peach while I grab coffee next door? I’m Leo."',
    fumbleOption: '"Wow you look insane for your age, do you have Snapchat?"',
    winOutcome: '+35 XP! Daylight farmers-market banter unlocked a Thursday wine date!',
  },
  {
    id: 'approach_valet',
    x: 715,
    y: 252,
    label: 'VALET RAIN',
    emoji: '☔',
    prompt:
      'In The Wild: Sudden 7 PM rain outside the gallery. Valet is backed up ten minutes.',
    smoothOption: 'Offer the dry half of your umbrella and keep the banter light while cars pull up.',
    fumbleOption: 'Brag that your mom Linda owns a guest condo condo in Maui.',
    winOutcome: '+35 XP! Effortless chivalry under one umbrella sparked instant chemistry.',
  },
];

const PATROL_GOBLINS: PatrolGoblin[] = [
  {
    id: 'goblin_snap',
    name: '"What’s Ur Snap?" Streak Goblin',
    emoji: '👻',
    taunt: '"yo u look crazy good for ur age 🔥 whats ur snap so we streak??"',
    roastLine: 'Exiled back to homeroom! Grown courtship happens on real calendars and real numbers.',
    baseX: 315,
    baseY: 168,
    axis: 'x',
    range: 48,
    speed: 0.032,
  },
  {
    id: 'goblin_tourist',
    name: '"Discrete Bucket-List" Tourist',
    emoji: '🪣',
    taunt: '"ngl never been with a cougar before, bucket list!! discrete link after 11pm??"',
    roastLine: 'Blocked in 0.3 seconds AND handed a dictionary for "discreet" vs. "discrete"!',
    baseX: 645,
    baseY: 336,
    axis: 'x',
    range: 48,
    speed: 0.036,
  },
  {
    id: 'goblin_split-tab',
    name: '$19.50 Ribeye split-tab Splitter',
    emoji: '💸',
    taunt: '"had so much fun!! just requested $19.50 + $1.14 salt tax on split-tab 😊"',
    roastLine: 'Swatted into orbit! Never invite someone out and itemize four edamame pods.',
    baseX: 795,
    baseY: 252,
    axis: 'y',
    range: 40,
    speed: 0.038,
  },
];

const WORLD_PICKUPS: WorldPickup[] = [
  { id: 'pink_peonies', x: 165, y: 168, label: '+20 XP Fresh Pink Peonies', color: '#EC4899', accent: '#FCE7F3' },
  { id: 'sancerre_chill', x: 350, y: 336, label: '+20 XP Chilled Sancerre', color: '#F59E0B', accent: '#FFFBEB' },
  { id: 'brass_clicker', x: 615, y: 168, label: '+20 XP Good-Boy Clicker', color: '#10B981', accent: '#D1FAE5' },
  { id: 'linen_apron', x: 165, y: 336, label: '+20 XP Heavyweight Linen Apron', color: '#14B8A6', accent: '#CCFBF1' },
  { id: 'silk_pillow', x: 565, y: 336, label: '+20 XP 22-Momme Silk Pillow', color: '#8B5CF6', accent: '#EDE9FE' },
  { id: 'dirty_martini', x: 795, y: 168, label: '+20 XP Olive Dirty Martini', color: '#EF4444', accent: '#FEE2E2' },
];

export const EightBitAdventureWorld: React.FC<EightBitAdventureWorldProps> = ({
  role,
  herName,
  hisName,
  progress,
  defaultExpanded = false,
  onGainXp,
  onEnterEpisode,
  onOpenBoutique,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeEncounter, setActiveEncounter] = useState<
    | { type: 'approach'; node: StreetApproachNode; picked: 'smooth' | 'fumble' | null }
    | { type: 'goblin'; goblin: PatrolGoblin }
    | { type: 'building'; building: WorldBuilding }
    | null
  >(null);
  const [nearbyHint, setNearbyHint] = useState<string>(
    'Walk with WASD / Arrows or Tap any "In The Wild" Neighborhood Hotspot!',
  );
  const [toastLine, setToastLine] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<{
    x: number;
    y: number;
    dir: number;
    frame: number;
    targetX: number | null;
    targetY: number | null;
  }>({
    x: 480,
    y: 312,
    dir: 1,
    frame: 0,
    targetX: null,
    targetY: null,
  });
  const trailRef = useRef<{ x: number; y: number }[]>(
    Array.from({ length: 18 }, () => ({ x: 452, y: 316 })),
  );
  const keysRef = useRef<Set<string>>(new Set());
  const dpadRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const popupsRef = useRef<FloatingPopup[]>([]);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const pendingTargetActionRef = useRef<
    | { kind: 'building'; building: WorldBuilding }
    | { kind: 'node'; node: StreetApproachNode }
    | { kind: 'goblin'; goblin: PatrolGoblin }
    | null
  >(null);

  const levelInfo = getLevelInfo(progress.xp);
  const avatarName = role === 'her' ? herName : hisName;
  const isBarnabyFollowing = Boolean(progress.companionAdopted || progress.puppyAdopted);

  const pushPopup = (x: number, y: number, text: string, color = '#FFBE0B') => {
    popupsRef.current.push({
      id: Date.now() + Math.random(),
      x,
      y,
      text,
      color,
      ttl: 52,
    });
  };

  const triggerNodeEncounter = (node: StreetApproachNode) => {
    sfx.messagePop();
    setActiveEncounter({ type: 'approach', node, picked: null });
  };

  const triggerBuildingAction = (b: WorldBuilding) => {
    sfx.crystalClink();
    setActiveEncounter({ type: 'building', building: b });
  };

  const handleInteractNearest = () => {
    const p = playerRef.current;
    const tick = performance.now() * 0.06;

    for (const g of PATROL_GOBLINS) {
      if (progressRef.current.defeatedGoblinIds.includes(g.id)) continue;
      const gx = g.axis === 'x' ? g.baseX + Math.sin(tick * g.speed) * g.range : g.baseX;
      const gy = g.axis === 'y' ? g.baseY + Math.cos(tick * g.speed) * g.range : g.baseY;
      if (Math.hypot(p.x - gx, p.y - gy) < 64) {
        sfx.shockZoom();
        setActiveEncounter({ type: 'goblin', goblin: g });
        return;
      }
    }

    for (const n of STREET_NODES) {
      if (Math.hypot(p.x - n.x, p.y - n.y) < 62) {
        triggerNodeEncounter(n);
        return;
      }
    }

    for (const b of BUILDINGS) {
      if (Math.hypot(p.x - b.x, p.y - b.y) < 76) {
        triggerBuildingAction(b);
        return;
      }
    }

    triggerNodeEncounter(STREET_NODES[0]);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        if (k.startsWith('arrow') && expanded) e.preventDefault();
        keysRef.current.add(k);
        playerRef.current.targetX = null;
        playerRef.current.targetY = null;
        pendingTargetActionRef.current = null;
      } else if ((k === 'e' || k === ' ') && expanded && !activeEncounter) {
        e.preventDefault();
        handleInteractNearest();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [expanded, activeEncounter]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      ctx = null;
    }
    if (!ctx) return;

    let rafId = 0;
    let tick = 0;
    let stepSoundTick = 0;

    const drawGoldenRetrieverSprite = (bx: number, by: number, wagTick: number) => {
      if (!ctx) return;
      const x = Math.round(bx);
      const y = Math.round(by);
      const bounce = Math.round(Math.abs(Math.sin(wagTick * 0.22)) * 2);
      ctx.fillStyle = 'rgba(30,16,34,0.28)';
      ctx.fillRect(x - 9, y + 8, 18, 4);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(x - 8, y - 4 - bounce, 16, 10);
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(x - 3, y - 1 - bounce, 7, 7);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(x - 7, y - 13 - bounce, 14, 10);
      ctx.fillRect(x - 10, y - 11 - bounce, 4, 8);
      ctx.fillRect(x + 6, y - 11 - bounce, 4, 8);
      ctx.fillStyle = '#FF2E63';
      ctx.fillRect(x - 1, y - 3 - bounce, 2, 2);
      const wag = Math.sin(wagTick * 0.45) > 0 ? -3 : 1;
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(x - 12, y - 6 - bounce + wag, 5, 4);
    };

    const drawAvatarSprite = (px: number, py: number, walkFrame: number, isHer: boolean) => {
      if (!ctx) return;
      const x = Math.round(px);
      const y = Math.round(py);
      const stepOffset = walkFrame % 2 === 0 ? 0 : 2;
      ctx.fillStyle = 'rgba(30,16,34,0.32)';
      ctx.fillRect(x - 10, y + 12, 20, 5);
      ctx.fillStyle = '#1E1022';
      ctx.fillRect(x - 6, y + 5 - stepOffset, 5, 8);
      ctx.fillRect(x + 2, y + 5 + (stepOffset ? 0 : -2), 5, 8);
      ctx.fillStyle = isHer ? '#FF2E63' : '#FFBE0B';
      ctx.fillRect(x - 9, y - 8, 18, 14);
      ctx.fillStyle = '#FDBA74';
      ctx.fillRect(x - 7, y - 20, 14, 12);
      ctx.fillStyle = isHer ? '#7C2D12' : '#291D2E';
      ctx.fillRect(x - 9, y - 24, 18, 6);
      ctx.fillStyle = '#1E1022';
      ctx.fillRect(x - 6, y - 16, 5, 3);
      ctx.fillRect(x + 1, y - 16, 5, 3);
    };

    const loop = () => {
      if (!ctx) return;
      tick += 1;
      const p = playerRef.current;
      const prog = progressRef.current;

      let vx = dpadRef.current.dx;
      let vy = dpadRef.current.dy;
      if (keysRef.current.has('a') || keysRef.current.has('arrowleft')) vx -= 1;
      if (keysRef.current.has('d') || keysRef.current.has('arrowright')) vx += 1;
      if (keysRef.current.has('w') || keysRef.current.has('arrowup')) vy -= 1;
      if (keysRef.current.has('s') || keysRef.current.has('arrowdown')) vy += 1;

      if (vx === 0 && vy === 0 && p.targetX !== null && p.targetY !== null) {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 6) {
          vx = dx / dist;
          vy = dy / dist;
        } else {
          p.targetX = null;
          p.targetY = null;
          const pending = pendingTargetActionRef.current;
          pendingTargetActionRef.current = null;
          if (pending) {
            if (pending.kind === 'building') triggerBuildingAction(pending.building);
            else if (pending.kind === 'node') triggerNodeEncounter(pending.node);
            else if (pending.kind === 'goblin') {
              sfx.shockZoom();
              setActiveEncounter({ type: 'goblin', goblin: pending.goblin });
            }
          }
        }
      }

      const speed = 3.1;
      if (vx !== 0 || vy !== 0) {
        const mag = Math.hypot(vx, vy) || 1;
        p.x = Math.max(36, Math.min(CANVAS_W - 36, p.x + (vx / mag) * speed));
        p.y = Math.max(48, Math.min(CANVAS_H - 32, p.y + (vy / mag) * speed));
        if (tick % 8 === 0) p.frame += 1;
        trailRef.current.unshift({ x: p.x, y: p.y });
        if (trailRef.current.length > 20) trailRef.current.pop();
        stepSoundTick += 1;
        if (stepSoundTick % 16 === 0) sfx.pixelStep(p.frame);
      }

      for (const item of WORLD_PICKUPS) {
        if (prog.collectedItemIds.includes(item.id)) continue;
        if (Math.hypot(p.x - item.x, p.y - item.y) < 28) {
          sfx.pixelCoin();
          pushPopup(item.x, item.y - 10, item.label, '#FFBE0B');
          onGainXp(20, {
            collectedItemIds: [...prog.collectedItemIds, item.id],
          });
          setToastLine(`✨ Collected ${item.label}!`);
          break;
        }
      }

      if (tick % 12 === 0) {
        for (const b of BUILDINGS) {
          if (Math.hypot(p.x - b.x, p.y - b.y) < 76) {
            setNearbyHint(`${b.emoji} Near ${b.title} • Press INTERACT (or Tap) to Enter!`);
            break;
          }
        }
      }

      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.fillStyle = '#FDE68A';
      ctx.fillRect(115, 146, 730, 44);
      ctx.fillRect(115, 314, 730, 44);
      ctx.fillRect(143, 86, 44, 328);
      ctx.fillRect(458, 86, 44, 328);
      ctx.fillRect(773, 86, 44, 328);

      // Central Neighborhood Fountain Plaza
      ctx.fillStyle = '#1E1022';
      ctx.fillRect(352, 214, 256, 78);
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(356, 218, 248, 70);

      for (const b of BUILDINGS) {
        ctx.fillStyle = b.wallColor;
        ctx.fillRect(b.x - 56, b.y - 36, 112, 60);
        ctx.strokeStyle = '#1E1022';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(b.x - 56, b.y - 36, 112, 60);
        ctx.fillStyle = b.roofColor;
        ctx.fillRect(b.x - 58, b.y - 38, 116, 18);
        ctx.fillStyle = '#1E1022';
        ctx.fillRect(b.x - 58, b.y + 26, 116, 16);
        ctx.fillStyle = '#FFFDF9';
        ctx.font = '700 8px "Silkscreen", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(b.shortLabel, b.x, b.y + 37);
      }

      for (const n of STREET_NODES) {
        const solved = prog.solvedNodeIds.includes(n.id);
        ctx.fillStyle = solved ? '#10B981' : '#FFBE0B';
        ctx.fillRect(n.x - 14, n.y - 16, 28, 30);
      }

      for (const g of PATROL_GOBLINS) {
        if (prog.defeatedGoblinIds.includes(g.id)) continue;
        const gx = Math.round(
          g.axis === 'x' ? g.baseX + Math.sin(tick * 0.06 * (g.speed * 28)) * g.range : g.baseX,
        );
        const gy = Math.round(
          g.axis === 'y' ? g.baseY + Math.cos(tick * 0.06 * (g.speed * 28)) * g.range : g.baseY,
        );
        ctx.fillStyle = '#FB7185';
        ctx.fillRect(gx - 11, gy - 11, 22, 22);
      }

      if (prog.companionAdopted || prog.puppyAdopted) {
        const crumb = trailRef.current[Math.min(12, trailRef.current.length - 1)] ?? {
          x: p.x - 26,
          y: p.y + 6,
        };
        drawGoldenRetrieverSprite(crumb.x - 18, crumb.y + 4, tick);
      }

      drawAvatarSprite(p.x, p.y, p.frame, role === 'her');

      popupsRef.current = popupsRef.current.filter((pop) => pop.ttl > 0);
      for (const pop of popupsRef.current) {
        pop.y -= 0.55;
        pop.ttl -= 1;
        ctx.fillStyle = pop.color;
        ctx.font = '700 11px "Fredoka", sans-serif';
        ctx.fillText(pop.text, pop.x, pop.y);
      }

      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(rafId);
  }, [role, avatarName]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const cx = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
    const cy = ((e.clientY - rect.top) / rect.height) * CANVAS_H;

    playerRef.current.targetX = cx;
    playerRef.current.targetY = cy;
    pendingTargetActionRef.current = null;

    for (const g of PATROL_GOBLINS) {
      if (progress.defeatedGoblinIds.includes(g.id)) continue;
      if (Math.hypot(cx - g.baseX, cy - g.baseY) < 65) {
        pendingTargetActionRef.current = { kind: 'goblin', goblin: g };
        return;
      }
    }
    for (const n of STREET_NODES) {
      if (Math.hypot(cx - n.x, cy - n.y) < 38) {
        pendingTargetActionRef.current = { kind: 'node', node: n };
        return;
      }
    }
    for (const b of BUILDINGS) {
      if (Math.hypot(cx - b.x, cy - b.y) < 58) {
        pendingTargetActionRef.current = { kind: 'building', building: b };
        return;
      }
    }
  };

  return (
    <section className="vice-panel rounded-3xl p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#FFFDF9] to-[#FFF4F7]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-pixel inline-flex h-7 items-center gap-1.5 rounded-lg border-2 border-[#1E1022] bg-[#FF2E63] px-2.5 text-[11px] font-bold uppercase text-white shadow-[2px_2px_0px_#1E1022]">
              <Gamepad2 className="h-3.5 w-3.5" /> In The Wild • 8-Bit Neighborhood Date Map
            </span>
            <span className="font-pixel inline-flex h-7 items-center gap-1 rounded-lg border-2 border-[#1E1022] bg-[#FFBE0B] px-2.5 text-[11px] font-bold text-[#1E1022]">
              {levelInfo.badgeEmoji} Lv.{levelInfo.level} • {progress.xp} XP
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl text-[#1E1022]">
            Walk 6 Real-World &ldquo;In The Wild&rdquo; Date Venues, Street Meet-Cutes &amp; Subculture Goblins!
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              sfx.puppyBark();
              if (!isBarnabyFollowing) {
                onGainXp(35, { companionAdopted: true, puppyAdopted: true });
                setToastLine(
                  '🐕 Rescue Golden "Barnaby" joined your walk! Watch him trot right behind you.',
                );
              } else {
                setToastLine('🐕 Barnaby gave two happy Golden-Retriever barks!');
              }
            }}
            className={`pop-btn h-11 rounded-xl px-4 text-sm font-bold cursor-pointer ${
              isBarnabyFollowing
                ? 'bg-[#D1FAE5] text-[#065F46]'
                : 'bg-[#FFBE0B] text-[#1E1022]'
            }`}
          >
            {isBarnabyFollowing
              ? '🐕 Barnaby Following ✓'
              : '🐕 Adopt Rescue Golden "Barnaby" (+35 XP)'}
          </button>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="pop-btn h-11 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 text-sm font-bold text-[#1E1022] cursor-pointer"
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span>{expanded ? 'Compact View' : 'Expand Map'}</span>
          </button>
        </div>
      </div>

      {/* Live XP Progress Bar + Counters */}
      <div className="rounded-2xl border-2 border-[#1E1022] bg-white px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-xs font-extrabold text-[#1E1022]">
            <span>
              {levelInfo.badgeEmoji} Club Rank: Lv.{levelInfo.level} {levelInfo.title}
            </span>
            <span className="text-[#D90452]">
              {progress.xp} / {levelInfo.nextThreshold} XP ({levelInfo.progressPct}%)
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#1E1022] bg-[#FFF7F0]">
            <div
              className="h-full bg-gradient-to-r from-[#FF2E63] to-[#FFBE0B] transition-all duration-300"
              style={{ width: `${Math.max(8, levelInfo.progressPct)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold text-[#1E1022]">
          <span className="rounded-lg border border-[#1E1022] bg-[#FFFBEB] px-2.5 py-1">
            💐 Gifts: {progress.collectedItemIds.length}/{WORLD_PICKUPS.length}
          </span>
          <span className="rounded-lg border border-[#1E1022] bg-[#FFE4E6] px-2.5 py-1">
            ⚡ Goblins Roasted: {progress.defeatedGoblinIds.length}/{PATROL_GOBLINS.length}
          </span>
          <span className="rounded-lg border border-[#1E1022] bg-[#ECFDF5] px-2.5 py-1">
            🥂 Street Approaches: {progress.solvedNodeIds.length}/{STREET_NODES.length}
          </span>
        </div>
      </div>

      {/* 8-BIT PIXEL CANVAS + ENCOUNTER DRAWER */}
      <div className="relative overflow-hidden rounded-2xl border-[3px] border-[#1E1022] bg-[#1E1022] shadow-[5px_5px_0px_#1E1022]">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onClick={handleCanvasClick}
          aria-label="In The Wild 8-Bit Neighborhood Date Map"
          className={`w-full cursor-crosshair block ${
            expanded ? 'max-h-[540px]' : 'max-h-[410px]'
          } object-contain bg-[#22C55E]`}
          style={{ imageRendering: 'pixelated' }}
        />

        <div className="pointer-events-none absolute left-3 top-3 rounded-xl border-2 border-[#1E1022] bg-[#FFFDF9]/95 px-3 py-1 text-xs font-extrabold text-[#1E1022] shadow">
          <Compass className="inline h-3.5 w-3.5 mr-1 text-[#FF2E63]" />
          {toastLine || nearbyHint}
        </div>

        {activeEncounter && (
          <div className="absolute inset-x-3 bottom-3 z-20 rounded-2xl border-[3px] border-[#1E1022] bg-[#FFFDF9] p-4 shadow-[5px_5px_0px_#1E1022] space-y-3 animate-stage-in">
            {activeEncounter.type === 'approach' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-xs font-extrabold text-[#1E1022]">
                    {activeEncounter.node.emoji} Street Meet-Cute • {activeEncounter.node.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveEncounter(null)}
                    className="rounded-lg border border-[#1E1022] bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                  >
                    Keep Walking ✕
                  </button>
                </div>
                <p className="text-sm font-extrabold text-[#1E1022]">{activeEncounter.node.prompt}</p>
                {activeEncounter.picked === null ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        sfx.levelUp8Bit();
                        const solved = Array.from(
                          new Set([...progress.solvedNodeIds, activeEncounter.node.id]),
                        );
                        onGainXp(35, { solvedNodeIds: solved });
                        setToastLine(activeEncounter.node.winOutcome);
                        setActiveEncounter({ ...activeEncounter, picked: 'smooth' });
                      }}
                      className="rounded-xl border-2 border-[#1E1022] bg-white hover:bg-[#ECFDF5] p-3 text-left text-xs font-bold text-[#1E1022] cursor-pointer"
                    >
                      ✨ {activeEncounter.node.smoothOption}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sfx.redFlag();
                        setActiveEncounter({ ...activeEncounter, picked: 'fumble' });
                      }}
                      className="rounded-xl border-2 border-[#1E1022] bg-white hover:bg-[#FFF1F2] p-3 text-left text-xs font-bold text-[#1E1022] cursor-pointer"
                    >
                      💀 {activeEncounter.node.fumbleOption}
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#1E1022] bg-[#ECFDF5] px-3 py-2 text-xs font-extrabold text-[#065F46]">
                    {activeEncounter.picked === 'smooth'
                      ? activeEncounter.node.winOutcome
                      : '🚩 Instant side-eye! Try the unhurried high-EQ approach next time.'}
                  </div>
                )}
              </div>
            )}

            {activeEncounter.type === 'goblin' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-[#1E1022] bg-[#FFE4E6] px-3 py-0.5 text-xs font-extrabold text-[#9F1239]">
                    {activeEncounter.goblin.emoji} Wild Red-Flag Goblin: {activeEncounter.goblin.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveEncounter(null)}
                    className="text-xs font-extrabold text-[#5A4664] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm font-bold text-[#1E1022]">{activeEncounter.goblin.taunt}</p>
                <button
                  type="button"
                  onClick={() => {
                    sfx.pixelZap();
                    const defeated = Array.from(
                      new Set([...progress.defeatedGoblinIds, activeEncounter.goblin.id]),
                    );
                    onGainXp(30, { defeatedGoblinIds: defeated });
                    setToastLine(`⚡ +30 XP! ${activeEncounter.goblin.roastLine}`);
                    setActiveEncounter(null);
                  }}
                  className="pop-btn inline-flex items-center gap-1.5 rounded-xl bg-[#FF2E63] px-4 py-2 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
                >
                  <Zap className="h-4 w-4" />
                  <span>Roast &amp; Zap Red-Flag Goblin (+30 XP)</span>
                </button>
              </div>
            )}

            {activeEncounter.type === 'building' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold uppercase text-[#D90452]">
                    {activeEncounter.building.emoji} Arrived at {activeEncounter.building.title}
                  </div>
                  <div className="text-sm font-bold text-[#1E1022]">
                    Step inside to play this neighborhood venue!
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveEncounter(null)}
                    className="pop-btn rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                  >
                    Stay Outside
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const b = activeEncounter.building;
                      setActiveEncounter(null);
                      onGainXp(15);
                      if (b.opensBoutique && onOpenBoutique) {
                        onOpenBoutique();
                      } else {
                        onEnterEpisode(b.episodeId);
                      }
                    }}
                    className="pop-btn rounded-xl bg-[#FF2E63] px-4 py-2 text-xs font-extrabold text-white cursor-pointer"
                  >
                    Enter Venue →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls + Quick Encounters */}
      <div className="grid gap-3 lg:grid-cols-[auto_1fr] items-center rounded-2xl border-2 border-[#1E1022] bg-white p-3">
        <div className="flex items-center gap-2">
          {(
            [
              ['◀', -1, 0, 'Walk Left'],
              ['▲', 0, -1, 'Walk Up'],
              ['▼', 0, 1, 'Walk Down'],
              ['▶', 1, 0, 'Walk Right'],
            ] as const
          ).map(([glyph, dx, dy, label]) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={() => {
                playerRef.current.x = Math.max(
                  36,
                  Math.min(CANVAS_W - 36, playerRef.current.x + dx * 28),
                );
                playerRef.current.y = Math.max(
                  48,
                  Math.min(CANVAS_H - 32, playerRef.current.y + dy * 28),
                );
                playerRef.current.frame += 1;
                sfx.pixelStep(playerRef.current.frame);
              }}
              className="pop-btn h-11 w-11 rounded-xl bg-[#FFF7F0] text-sm text-[#1E1022] cursor-pointer select-none"
            >
              {glyph}
            </button>
          ))}

          <button
            type="button"
            onClick={handleInteractNearest}
            className="pop-btn h-11 inline-flex items-center gap-1.5 rounded-xl bg-[#FF2E63] px-4 text-sm font-bold text-white cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>A • INTERACT</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => triggerNodeEncounter(STREET_NODES[0])}
            className="pop-btn h-11 w-full rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] px-3 text-xs sm:text-sm font-bold text-[#92400E] inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>📚 Practice &ldquo;In The Wild&rdquo; Approach (+35 XP)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const nextGoblin =
                PATROL_GOBLINS.find((g) => !progress.defeatedGoblinIds.includes(g.id)) ??
                PATROL_GOBLINS[0];
              sfx.shockZoom();
              setActiveEncounter({ type: 'goblin', goblin: nextGoblin });
            }}
            className="pop-btn h-11 w-full rounded-xl bg-[#18101E] hover:bg-[#2E1F38] px-3 text-xs sm:text-sm font-bold text-white inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>⚡ Intercept Red-Flag Goblin (+30 XP)</span>
          </button>
        </div>
      </div>

      {/* 6 Fast-Travel In The Wild Venues */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {BUILDINGS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => {
              sfx.crystalClink();
              onGainXp(15);
              if (b.opensBoutique && onOpenBoutique) {
                onOpenBoutique();
              } else {
                onEnterEpisode(b.episodeId);
              }
            }}
            className="pop-btn min-h-[84px] rounded-2xl bg-white p-4 text-left hover:bg-[#FFFBEB] cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="min-w-0 space-y-1">
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#E11D48]">
                {b.emoji} {b.shortLabel}
              </div>
              <div className="font-display text-sm sm:text-[15px] text-[#18101E] leading-snug">
                {b.buttonName}
              </div>
            </div>
            <span className="shrink-0 inline-flex h-8 items-center rounded-full bg-[#FEF3C7] border border-[#F59E0B]/40 px-3 text-xs font-extrabold text-[#92400E] whitespace-nowrap">
              Enter →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
