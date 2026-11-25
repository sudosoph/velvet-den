import React, { useEffect, useRef, useState } from 'react';
import { Award, Compass, Flame, Gamepad2, Maximize2, Minimize2, Sparkles, Zap } from 'lucide-react';
import { POP_CULTURE_TRIVIA } from '../data/popCultureTrivia';
import type { PlayerRole } from '../domain/taxonomy';
import {
  getLevelInfo,
  type AdventureProgressState,
} from '../domain/progression';
import { sfx } from '../lib/sound';
import {
  COUGAR_CUB_CHECKLIST_ITEMS,
  loadChecklistCheckedIds,
  toggleChecklistItemInStorage,
} from './CougarCubChecklistModal';

interface EightBitAdventureWorldProps {
  role: PlayerRole;
  herName: string;
  hisName: string;
  progress: AdventureProgressState;
  defaultExpanded?: boolean;
  onGainXp: (deltaXp: number, patch?: Partial<AdventureProgressState>, rewardKey?: string) => void;
  onEnterEpisode: (episodeId: string) => void;
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
  isPuppyLounge?: boolean;
}

interface WorldNode {
  id: string;
  x: number;
  y: number;
  kind: 'trivia' | 'viral';
  label: string;
  emoji: string;
  triviaOffset: number;
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
    id: 'b_qigong',
    x: 165,
    y: 86,
    title: 'Qigong & Seed-Oil-Free Sanctuary',
    shortLabel: 'QIGONG CAFE',
    buttonName: 'Qigong & Tai Chi Cloud Hands ("Yes, Mommy")',
    emoji: '🧘‍♀️',
    roofColor: '#059669',
    wallColor: '#ECFDF5',
    episodeId: 'qigong-tai-chi-wellness-mommy-domme',
  },
  {
    id: 'b_puppy',
    x: 480,
    y: 86,
    title: 'Tricolor Mini Bernedoodle Waitlist #1',
    shortLabel: 'PUPPY & GHEE',
    buttonName: 'Seed-Oil-Free & Tricolor Mini Bernedoodle Mommy',
    emoji: '🐶',
    roofColor: '#FF2E63',
    wallColor: '#FFF4F7',
    episodeId: 'seed-oil-gluten-free-bernedoodle-mommy',
    isPuppyLounge: true,
  },
  {
    id: 'b_hawaii',
    x: 795,
    y: 86,
    title: 'Mom’s Maui Timeshare Cabana',
    shortLabel: 'MAUI TRAP',
    buttonName: '"Come to My Place in Hawaii" (Mom’s Timeshare)',
    emoji: '🌺',
    roofColor: '#F59E0B',
    wallColor: '#FFFBEB',
    episodeId: 'parents-hawaii-timeshare-flex-trap',
  },
  {
    id: 'b_venmo',
    x: 165,
    y: 414,
    title: '$41.63 Edamame Venmo Sushi',
    shortLabel: 'VENMO SUSHI',
    buttonName: 'Swat the $41.63 Edamame Venmo',
    emoji: '🚨',
    roofColor: '#E11D48',
    wallColor: '#FFF1F2',
    episodeId: 'broke-college-dutch-calculator-horror',
  },
  {
    id: 'b_velvet',
    x: 480,
    y: 414,
    title: 'Hotel Bar ("Babygirl" Lounge)',
    shortLabel: 'HOTEL LOUNGE',
    buttonName: '18-Hour Pool & Cedar Sauna',
    emoji: '🍸',
    roofColor: '#7C3AED',
    wallColor: '#F5F3FF',
    episodeId: 'spontaneous-18h-pool-sauna-getaway',
  },
  {
    id: 'b_sanctuary',
    x: 795,
    y: 414,
    title: 'Sanctuary Door & 4-Roommate Escape',
    shortLabel: 'DOOR BOUNCER',
    buttonName: 'Hobosexual PS5 & Laundry Bouncer',
    emoji: '🎮',
    roofColor: '#2563EB',
    wallColor: '#EFF6FF',
    episodeId: 'hobosexual-ps5-suitcase-creep',
  },
];

const WORLD_NODES: WorldNode[] = [
  {
    id: 'jukebox_west',
    x: 245,
    y: 252,
    kind: 'trivia',
    label: 'POP QUIZ #1',
    emoji: '🕹️',
    triviaOffset: 0,
  },
  {
    id: 'totem_viral',
    x: 480,
    y: 175,
    kind: 'viral',
    label: 'VIRAL SHRINE',
    emoji: '🔥',
    triviaOffset: 3,
  },
  {
    id: 'jukebox_east',
    x: 715,
    y: 252,
    kind: 'trivia',
    label: 'CINEMA QUIZ',
    emoji: '🎬',
    triviaOffset: 7,
  },
];

const PATROL_GOBLINS: PatrolGoblin[] = [
  {
    id: 'goblin_canola',
    name: 'Seed-Oil & Wheat Fry-Cook',
    emoji: '🛢️',
    taunt: '"Everything is deep-fried in soybean oil & wheat flour!!"',
    roastLine: 'Zapped with Cold-Pressed EVOO, Grass-Fed Ghee & Cassava Sourdough!',
    baseX: 315,
    baseY: 168,
    axis: 'x',
    range: 48,
    speed: 0.032,
  },
  {
    id: 'goblin_cubsplain',
    name: 'Podcast Cubsplainer Bro',
    emoji: '🤓',
    taunt: '"Well actually, let me explain Qigong & mortgages to you..."',
    roastLine: 'Silenced with two fingers under his chin: "Breathe with Mommy, good boy."',
    baseX: 645,
    baseY: 336,
    axis: 'x',
    range: 48,
    speed: 0.036,
  },
  {
    id: 'goblin_timeshare',
    name: 'Linda’s Maui Timeshare Son',
    emoji: '🌺',
    taunt: '"Come to MY place in Hawaii (Mom’s in the master suite)!"',
    roastLine: 'Exposed the 8 AM condo seminar & sent him back to study hall!',
    baseX: 795,
    baseY: 252,
    axis: 'y',
    range: 40,
    speed: 0.038,
  },
];

const WORLD_PICKUPS: WorldPickup[] = [
  { id: 'evoo_bottle', x: 165, y: 168, label: '+20 XP Cold-Pressed EVOO', color: '#10B981', accent: '#FEF08A' },
  { id: 'ghee_jar', x: 350, y: 336, label: '+20 XP Grass-Fed Ghee', color: '#F59E0B', accent: '#FFFBEB' },
  { id: 'bernedoodle_bone', x: 615, y: 168, label: '+20 XP Bernedoodle Treat', color: '#FF2E63', accent: '#FFFFFF' },
  { id: 'oolong_tea', x: 165, y: 336, label: '+20 XP Jasmine Oolong', color: '#14B8A6', accent: '#CCFBF1' },
  { id: 'gluten_free_tart', x: 565, y: 336, label: '+20 XP GF Cassava Tart', color: '#EC4899', accent: '#FCE7F3' },
  { id: 'martini_star', x: 795, y: 168, label: '+20 XP Zero-Proof Elixir', color: '#8B5CF6', accent: '#EDE9FE' },
];

export const EightBitAdventureWorld: React.FC<EightBitAdventureWorldProps> = ({
  role,
  herName,
  hisName,
  progress,
  defaultExpanded = false,
  onGainXp,
  onEnterEpisode,
  onOpenFullTrivia,
  onOpenFullChecklist,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeEncounter, setActiveEncounter] = useState<
    | { type: 'trivia'; nodeId: string; qIdx: number; picked: number | null }
    | { type: 'viral'; nodeId: string; itemIdx: number; voted: 'lived' | 'dodged' | null }
    | { type: 'goblin'; goblin: PatrolGoblin }
    | { type: 'building'; building: WorldBuilding }
    | null
  >(null);
  const [nearbyHint, setNearbyHint] = useState<string>('Walk with WASD / Arrows or Tap anywhere on the 8-Bit Resort!');
  const [toastLine, setToastLine] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<{ x: number; y: number; dir: number; frame: number; targetX: number | null; targetY: number | null }>({
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
    | { kind: 'node'; node: WorldNode }
    | { kind: 'goblin'; goblin: PatrolGoblin }
    | null
  >(null);

  const levelInfo = getLevelInfo(progress.xp);
  const avatarName = role === 'her' ? herName : hisName;

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

  const showWorldToast = (msg: string) => {
    setToastLine(msg);
  };

  const triggerNodeEncounter = (node: WorldNode) => {
    sfx.messagePop();
    if (node.kind === 'trivia') {
      const qIdx = (progressRef.current.triviaIndex + node.triviaOffset) % POP_CULTURE_TRIVIA.length;
      setActiveEncounter({ type: 'trivia', nodeId: node.id, qIdx, picked: null });
    } else {
      const itemIdx =
        (progressRef.current.triviaIndex + node.triviaOffset) % COUGAR_CUB_CHECKLIST_ITEMS.length;
      const item = COUGAR_CUB_CHECKLIST_ITEMS[itemIdx];
      const already = loadChecklistCheckedIds().includes(item.id) ? 'lived' : null;
      setActiveEncounter({ type: 'viral', nodeId: node.id, itemIdx, voted: already });
    }
  };

  const triggerBuildingAction = (b: WorldBuilding) => {
    if (b.isPuppyLounge && !progressRef.current.bernedoodleAdopted) {
      sfx.puppyBark();
      pushPopup(b.x, b.y - 24, '🐶 MISO ADOPTED! +35 XP', '#FF2E63');
      onGainXp(
        35,
        { bernedoodleAdopted: true },
        'world_bernedoodle_adopt',
      );
      showWorldToast(
        '🐶 Waitlist #1 Unlocked! Miso the Tricolor Mini Bernedoodle is now trotting right behind you!',
      );
      setActiveEncounter({ type: 'building', building: b });
      return;
    }
    sfx.crystalClink();
    setActiveEncounter({ type: 'building', building: b });
  };

  const handleInteractNearest = () => {
    const p = playerRef.current;
    const tick = performance.now() * 0.06;

    // 1. Check undefeated goblins
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

    // 2. Check Trivia / Viral Jukeboxes
    for (const n of WORLD_NODES) {
      if (Math.hypot(p.x - n.x, p.y - n.y) < 62) {
        triggerNodeEncounter(n);
        return;
      }
    }

    // 3. Check Buildings
    for (const b of BUILDINGS) {
      if (Math.hypot(p.x - b.x, p.y - b.y) < 76) {
        triggerBuildingAction(b);
        return;
      }
    }

    // Fallback: open nearest jukebox so pressing Interact always feels responsive!
    triggerNodeEncounter(WORLD_NODES[0]);
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

    const drawPixelPalm = (cx: number, cy: number, sway: number) => {
      if (!ctx) return;
      // Trunk
      ctx.fillStyle = '#8D5524';
      for (let i = 0; i < 6; i += 1) {
        ctx.fillRect(Math.round(cx + i * sway * 0.4), cy - i * 5, 6, 6);
      }
      // Fronds
      const topX = Math.round(cx + sway * 2);
      const topY = cy - 30;
      ctx.fillStyle = '#16A34A';
      ctx.fillRect(topX - 16, topY, 38, 6);
      ctx.fillRect(topX - 10, topY - 6, 26, 6);
      ctx.fillRect(topX - 20, topY + 6, 12, 5);
      ctx.fillRect(topX + 16, topY + 6, 12, 5);
      // Coconuts
      ctx.fillStyle = '#582F0E';
      ctx.fillRect(topX - 2, topY + 5, 4, 4);
      ctx.fillRect(topX + 5, topY + 5, 4, 4);
    };

    const drawBernedoodleSprite = (bx: number, by: number, wagTick: number) => {
      if (!ctx) return;
      const x = Math.round(bx);
      const y = Math.round(by);
      const bounce = Math.round(Math.abs(Math.sin(wagTick * 0.22)) * 2);
      // Shadow
      ctx.fillStyle = 'rgba(30,16,34,0.28)';
      ctx.fillRect(x - 9, y + 8, 18, 4);
      // Espresso/Jet-Dark Body (Tricolor coat #1)
      ctx.fillStyle = '#1E1420';
      ctx.fillRect(x - 8, y - 4 - bounce, 16, 10);
      // Snowy White Chest Blaze & Paws (Tricolor coat #2)
      ctx.fillStyle = '#FFFDF9';
      ctx.fillRect(x - 3, y - 1 - bounce, 7, 7);
      ctx.fillRect(x - 7, y + 5 - bounce, 4, 4);
      ctx.fillRect(x + 4, y + 5 - bounce, 4, 4);
      // Fluffy Head + Floppy Ears
      ctx.fillStyle = '#1E1420';
      ctx.fillRect(x - 7, y - 13 - bounce, 14, 10);
      ctx.fillRect(x - 10, y - 11 - bounce, 4, 8);
      ctx.fillRect(x + 6, y - 11 - bounce, 4, 8);
      // Caramel/Tan Eyebrows & Cheeks (Tricolor coat #3!)
      ctx.fillStyle = '#D97706';
      ctx.fillRect(x - 5, y - 11 - bounce, 3, 2);
      ctx.fillRect(x + 2, y - 11 - bounce, 3, 2);
      ctx.fillRect(x - 6, y - 6 - bounce, 3, 3);
      ctx.fillRect(x + 3, y - 6 - bounce, 3, 3);
      // White Muzzle + Pink Tongue
      ctx.fillStyle = '#FFFDF9';
      ctx.fillRect(x - 3, y - 7 - bounce, 6, 4);
      ctx.fillStyle = '#FF2E63';
      ctx.fillRect(x - 1, y - 3 - bounce, 2, 2);
      // Wagging White-Tipped Tail
      const wag = Math.sin(wagTick * 0.45) > 0 ? -3 : 1;
      ctx.fillStyle = '#1E1420';
      ctx.fillRect(x - 11, y - 6 - bounce + wag, 4, 4);
      ctx.fillStyle = '#FFFDF9';
      ctx.fillRect(x - 13, y - 8 - bounce + wag, 3, 3);
    };

    const drawAvatarSprite = (px: number, py: number, walkFrame: number, isHer: boolean) => {
      if (!ctx) return;
      const x = Math.round(px);
      const y = Math.round(py);
      const stepOffset = walkFrame % 2 === 0 ? 0 : 2;

      // Ground Shadow
      ctx.fillStyle = 'rgba(30,16,34,0.32)';
      ctx.fillRect(x - 10, y + 12, 20, 5);

      // Legs / Stride
      ctx.fillStyle = '#1E1022';
      ctx.fillRect(x - 6, y + 5 - stepOffset, 5, 8);
      ctx.fillRect(x + 2, y + 5 + (stepOffset ? 0 : -2), 5, 8);

      // Outfit Torso (Coral Resort Silk for Her / Mango Linen Apron-Collar for Him)
      ctx.fillStyle = isHer ? '#FF2E63' : '#FFBE0B';
      ctx.fillRect(x - 9, y - 8, 18, 14);
      ctx.fillStyle = '#1E1022';
      ctx.fillRect(x - 9, y + 4, 18, 2);

      // Head & Hair
      ctx.fillStyle = '#FDBA74';
      ctx.fillRect(x - 7, y - 20, 14, 12);

      // Hair Style
      ctx.fillStyle = isHer ? '#7C2D12' : '#291D2E';
      ctx.fillRect(x - 9, y - 24, 18, 6);
      if (isHer) {
        ctx.fillRect(x - 10, y - 20, 4, 12);
        ctx.fillRect(x + 6, y - 20, 4, 12);
      }

      // Cool Palm-Springs Shades
      ctx.fillStyle = '#1E1022';
      ctx.fillRect(x - 6, y - 16, 5, 3);
      ctx.fillRect(x + 1, y - 16, 5, 3);
      ctx.fillRect(x - 1, y - 15, 2, 1);
    };

    const loop = () => {
      if (!ctx) return;
      tick += 1;
      const p = playerRef.current;
      const prog = progressRef.current;

      // Movement calculation
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

      // Auto-collect pickups on overlap
      for (const item of WORLD_PICKUPS) {
        if (prog.collectedItemIds.includes(item.id)) continue;
        if (Math.hypot(p.x - item.x, p.y - item.y) < 28) {
          sfx.pixelCoin();
          pushPopup(item.x, item.y - 10, item.label, '#FFBE0B');
          onGainXp(20, {
            collectedItemIds: [...prog.collectedItemIds, item.id],
          });
          showWorldToast(`✨ Collected ${item.label}!`);
          break;
        }
      }

      // Update contextual prompt
      if (tick % 12 === 0) {
        let foundHint = '';
        for (const b of BUILDINGS) {
          if (Math.hypot(p.x - b.x, p.y - b.y) < 76) {
            foundHint = `${b.emoji} Near ${b.title} — Press INTERACT (or Tap) to Enter!`;
            break;
          }
        }
        if (!foundHint) {
          for (const n of WORLD_NODES) {
            if (Math.hypot(p.x - n.x, n.y - n.y) < 62) {
              foundHint = `${n.emoji} Near ${n.label} — Press INTERACT for +35 XP Bonus!`;
              break;
            }
          }
        }
        if (foundHint) setNearbyHint(foundHint);
      }

      // === RENDER 8-BIT RESORT TILEMAP ===
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Decorative pixel grass checker tufts
      ctx.fillStyle = '#22C55E';
      for (let gx = 16; gx < CANVAS_W; gx += 48) {
        for (let gy = 16; gy < CANVAS_H; gy += 48) {
          ctx.fillRect(gx, gy, 8, 4);
          ctx.fillRect(gx + 20, gy + 22, 6, 4);
        }
      }

      // Sandstone Resort Boardwalk Roads (Spacious 960x500 Grid — Zero Overlaps!)
      ctx.fillStyle = '#FDE68A';
      ctx.fillRect(115, 146, 730, 44); // North boulevard
      ctx.fillRect(115, 314, 730, 44); // South boulevard
      ctx.fillRect(143, 86, 44, 328);  // West avenue
      ctx.fillRect(458, 86, 44, 328);  // Center avenue
      ctx.fillRect(773, 86, 44, 328);  // East avenue
      ctx.strokeStyle = '#1E1022';
      ctx.lineWidth = 2;
      ctx.strokeRect(115, 146, 730, 44);
      ctx.strokeRect(115, 314, 730, 44);

      // Central Shimmering Palm Springs Tiki Pool (Cleanly Isolated!)
      ctx.fillStyle = '#1E1022';
      ctx.fillRect(352, 214, 256, 78);
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(356, 218, 248, 70);
      ctx.fillStyle = '#67E8F9';
      for (let wx = 372; wx < 584; wx += 32) {
        const waveX = wx + Math.round(Math.sin(tick * 0.07 + wx) * 5);
        ctx.fillRect(waveX, 238, 16, 4);
        ctx.fillRect(waveX + 8, 264, 14, 4);
      }

      // Swaying Palm Trees
      const sway = Math.sin(tick * 0.045) * 2.2;
      drawPixelPalm(54, 118, sway);
      drawPixelPalm(902, 118, -sway);
      drawPixelPalm(54, 424, sway);
      drawPixelPalm(902, 424, -sway);
      drawPixelPalm(322, 118, sway * 0.7);
      drawPixelPalm(638, 118, -sway * 0.7);

      // Draw 6 Enterable Pixel Buildings
      for (const b of BUILDINGS) {
        const isNear = Math.hypot(p.x - b.x, p.y - b.y) < 76;
        if (isNear) {
          ctx.strokeStyle = '#FF2E63';
          ctx.lineWidth = 3;
          ctx.strokeRect(b.x - 62, b.y - 42, 124, 78);
        }
        ctx.fillStyle = '#1E1022';
        ctx.fillRect(b.x - 54, b.y - 34, 112, 64);
        ctx.fillStyle = b.wallColor;
        ctx.fillRect(b.x - 56, b.y - 36, 108, 60);
        ctx.strokeStyle = '#1E1022';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(b.x - 56, b.y - 36, 108, 60);
        ctx.fillStyle = b.roofColor;
        ctx.fillRect(b.x - 58, b.y - 38, 112, 18);
        ctx.strokeRect(b.x - 58, b.y - 38, 112, 18);
        ctx.fillStyle = '#1E1022';
        ctx.fillRect(b.x - 9, b.y + 4, 18, 20);
        ctx.fillStyle = '#FFBE0B';
        ctx.fillRect(b.x + 4, b.y + 13, 3, 3);

        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.emoji, b.x, b.y - 24);
        ctx.fillStyle = '#1E1022';
        ctx.fillRect(b.x - 56, b.y + 27, 112, 16);
        ctx.fillStyle = '#FFFDF9';
        ctx.font = '700 9px "Silkscreen", monospace';
        ctx.fillText(b.shortLabel, b.x, b.y + 38);
      }

      // Draw Pickups
      for (const item of WORLD_PICKUPS) {
        if (prog.collectedItemIds.includes(item.id)) continue;
        const bob = Math.round(Math.sin(tick * 0.1 + item.x) * 3);
        ctx.fillStyle = '#1E1022';
        ctx.fillRect(item.x - 9, item.y - 9 + bob, 18, 18);
        ctx.fillStyle = item.color;
        ctx.fillRect(item.x - 7, item.y - 7 + bob, 14, 14);
        ctx.fillStyle = item.accent;
        ctx.fillRect(item.x - 3, item.y - 3 + bob, 6, 6);
      }

      // Draw 3 Embedded Pop-Culture & Viral Jukeboxes
      for (const n of WORLD_NODES) {
        const solved = prog.solvedNodeIds.includes(n.id);
        const pulse = Math.round(Math.sin(tick * 0.12) * 2);
        ctx.fillStyle = '#1E1022';
        ctx.fillRect(n.x - 16, n.y - 18 + pulse, 32, 34);
        ctx.fillStyle = solved ? '#10B981' : '#FFBE0B';
        ctx.fillRect(n.x - 14, n.y - 16 + pulse, 28, 30);
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.emoji, n.x, n.y + 4 + pulse);

        ctx.fillStyle = '#1E1022';
        ctx.fillRect(n.x - 46, n.y - 33 + pulse, 92, 13);
        ctx.fillStyle = '#FFBE0B';
        ctx.font = '700 8px "Silkscreen", monospace';
        ctx.fillText(n.label, n.x, n.y - 24 + pulse);
      }

      // Draw Roaming Red-Flag Patrol Goblins (Compact non-overlapping badge!)
      for (const g of PATROL_GOBLINS) {
        if (prog.defeatedGoblinIds.includes(g.id)) continue;
        const gx = Math.round(
          g.axis === 'x' ? g.baseX + Math.sin(tick * 0.06 * (g.speed * 28)) * g.range : g.baseX,
        );
        const gy = Math.round(
          g.axis === 'y' ? g.baseY + Math.cos(tick * 0.06 * (g.speed * 28)) * g.range : g.baseY,
        );
        ctx.fillStyle = '#1E1022';
        ctx.fillRect(gx - 13, gy - 13, 26, 26);
        ctx.fillStyle = '#FB7185';
        ctx.fillRect(gx - 11, gy - 11, 22, 22);
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(g.emoji, gx, gy + 5);

        ctx.fillStyle = '#9F1239';
        ctx.fillRect(gx - 18, gy - 26, 36, 12);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 8px "Silkscreen", monospace';
        ctx.fillText('ROAST', gx, gy - 17);
      }

      // Target click reticle
      if (p.targetX !== null && p.targetY !== null) {
        ctx.strokeStyle = '#FF2E63';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.targetX - 8, p.targetY - 8, 16, 16);
      }

      // Draw Tricolor Mini Bernedoodle Follower ("Miso") if adopted!
      if (prog.bernedoodleAdopted) {
        const crumb = trailRef.current[Math.min(12, trailRef.current.length - 1)] ?? {
          x: p.x - 26,
          y: p.y + 6,
        };
        drawBernedoodleSprite(crumb.x - 18, crumb.y + 4, tick);
      }

      // Draw Player Sprite
      drawAvatarSprite(p.x, p.y, p.frame, role === 'her');

      // Player Overhead Tag
      ctx.fillStyle = '#1E1022';
      ctx.fillRect(p.x - 34, p.y - 39, 68, 13);
      ctx.fillStyle = '#FFBE0B';
      ctx.font = '700 8px "Silkscreen", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`★ ${avatarName.slice(0, 9)}`, p.x, p.y - 29);

      // Draw Floating XP Popups
      popupsRef.current = popupsRef.current.filter((pop) => pop.ttl > 0);
      for (const pop of popupsRef.current) {
        pop.y -= 0.55;
        pop.ttl -= 1;
        ctx.fillStyle = '#1E1022';
        ctx.font = '700 11px "Fredoka", sans-serif';
        ctx.fillText(pop.text, pop.x + 1, pop.y + 1);
        ctx.fillStyle = pop.color;
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
    for (const n of WORLD_NODES) {
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
      {/* Top 8-Bit Arcade & Progression Header — Strictly Single-Row Aligned on Desktop */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-pixel inline-flex h-7 items-center gap-1.5 rounded-lg border-2 border-[#1E1022] bg-[#FF2E63] px-2.5 text-[11px] font-bold uppercase text-white shadow-[2px_2px_0px_#1E1022]">
              <Gamepad2 className="h-3.5 w-3.5" /> Live 8-Bit Adventure World
            </span>
            <span className="font-pixel inline-flex h-7 items-center gap-1 rounded-lg border-2 border-[#1E1022] bg-[#FFBE0B] px-2.5 text-[11px] font-bold text-[#1E1022]">
              {levelInfo.badgeEmoji} Lv.{levelInfo.level} • {progress.xp} XP
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl text-[#1E1022]">
            Walk the 8-Bit Club Resort: Pop-Culture Jukeboxes, Seed-Oil Goblins &amp; Date Venues!
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (!progress.bernedoodleAdopted) {
                sfx.puppyBark();
                onGainXp(35, { bernedoodleAdopted: true }, 'world_bernedoodle_adopt');
                showWorldToast(
                  '🐶 Tricolor Mini Bernedoodle "Miso" adopted from Waitlist #1—watch him trot behind you!',
                );
              } else {
                sfx.puppyBark();
                showWorldToast('🐶 Miso gave two happy barks! Walk around the map to watch him follow.');
              }
            }}
            className={`pop-btn h-11 rounded-xl px-4 text-sm cursor-pointer ${
              progress.bernedoodleAdopted
                ? 'bg-[#D1FAE5] text-[#065F46]'
                : 'bg-[#FFBE0B] text-[#1E1022]'
            }`}
          >
            {progress.bernedoodleAdopted
              ? '🐶 Miso (Tricolor Bernedoodle) Following ✓'
              : '🐶 Adopt Tricolor Mini Bernedoodle (+35 XP)'}
          </button>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="pop-btn h-11 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 text-sm text-[#1E1022] cursor-pointer"
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span>{expanded ? 'Compact View' : 'Expand Arcade'}</span>
          </button>
        </div>
      </div>

      {/* Live XP Progress Bar + Collectibles Counter */}
      <div className="rounded-2xl border-2 border-[#1E1022] bg-white px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-xs font-extrabold text-[#1E1022]">
            <span>
              {levelInfo.badgeEmoji} Adventure Rank: Lv.{levelInfo.level} {levelInfo.title}
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
            🥑 Pickups: {progress.collectedItemIds.length}/{WORLD_PICKUPS.length}
          </span>
          <span className="rounded-lg border border-[#1E1022] bg-[#FFE4E6] px-2.5 py-1">
            ⚡ Goblins Roasted: {progress.defeatedGoblinIds.length}/{PATROL_GOBLINS.length}
          </span>
          <span className="rounded-lg border border-[#1E1022] bg-[#ECFDF5] px-2.5 py-1">
            🕹️ Jukeboxes: {progress.solvedNodeIds.length}/{WORLD_NODES.length}
          </span>
        </div>
      </div>

      {/* 60FPS MOVING 8-BIT PIXEL CANVAS + RETRO ENCOUNTER OVERLAY */}
      <div className="relative overflow-hidden rounded-2xl border-[3px] border-[#1E1022] bg-[#1E1022] shadow-[5px_5px_0px_#1E1022]">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onClick={handleCanvasClick}
          aria-label="Interactive 8-Bit Cougars and Cubs Club Resort Overworld"
          className={`w-full cursor-crosshair block ${
            expanded ? 'max-h-[540px]' : 'max-h-[410px]'
          } object-contain bg-[#22C55E]`}
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Top-Left Live Proximity Ticker */}
        <div className="pointer-events-none absolute left-3 top-3 rounded-xl border-2 border-[#1E1022] bg-[#FFFDF9]/95 px-3 py-1 text-xs font-extrabold text-[#1E1022] shadow">
          <Compass className="inline h-3.5 w-3.5 mr-1 text-[#FF2E63]" />
          {toastLine || nearbyHint}
        </div>

        {/* Embedded 8-Bit RPG Encounter Drawer (Pop-Culture Trivia, Viral Check, Goblin Roast, or Venue Entry) */}
        {activeEncounter && (
          <div className="absolute inset-x-3 bottom-3 z-20 rounded-2xl border-[3px] border-[#1E1022] bg-[#FFFDF9] p-4 shadow-[5px_5px_0px_#1E1022] space-y-3 animate-stage-in">
            {activeEncounter.type === 'trivia' && (() => {
              const q = POP_CULTURE_TRIVIA[activeEncounter.qIdx];
              return (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-xs font-extrabold text-[#1E1022]">
                      <Award className="h-3.5 w-3.5" /> 8-Bit Jukebox Trivia • {q.badge}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveEncounter(null)}
                      className="rounded-lg border border-[#1E1022] bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                    >
                      Continue Walking ✕
                    </button>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#1E1022]">{q.question}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, idx) => {
                      const picked = activeEncounter.picked;
                      const isCorrect = idx === q.correctIndex;
                      let cls = 'bg-white text-[#1E1022] hover:bg-[#FFFBEB]';
                      if (picked !== null) {
                        if (isCorrect) cls = 'bg-[#D1FAE5] text-[#065F46]';
                        else if (picked === idx) cls = 'bg-[#FFE4E6] text-[#9F1239]';
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            if (activeEncounter.picked !== null) return;
                            const won = idx === q.correctIndex;
                            if (won) {
                              sfx.levelUp8Bit();
                              const solved = Array.from(
                                new Set([...progress.solvedNodeIds, activeEncounter.nodeId]),
                              );
                              onGainXp(
                                35,
                                { solvedNodeIds: solved, triviaIndex: progress.triviaIndex + 1 },
                                `world_trivia_${activeEncounter.nodeId}`,
                              );
                              showWorldToast('🎉 +35 XP! Jukebox High Score Unlocked!');
                            } else {
                              sfx.redFlag();
                              onGainXp(10, { triviaIndex: progress.triviaIndex + 1 });
                            }
                            setActiveEncounter({ ...activeEncounter, picked: idx });
                          }}
                          className={`rounded-xl border-2 border-[#1E1022] px-3 py-2 text-left text-xs sm:text-sm font-bold cursor-pointer ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {activeEncounter.picked !== null && (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#1E1022] bg-[#FFF7F0] px-3 py-2 text-xs font-bold text-[#1E1022]">
                      <span>{q.funFact}</span>
                      {onOpenFullTrivia && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveEncounter(null);
                            onOpenFullTrivia();
                          }}
                          className="text-[#FF2E63] underline font-extrabold cursor-pointer"
                        >
                          Full Quiz (+3 Cr) →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {activeEncounter.type === 'viral' && (() => {
              const item = COUGAR_CUB_CHECKLIST_ITEMS[activeEncounter.itemIdx];
              return (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#1E1022] bg-[#FF2E63] px-2.5 py-0.5 text-xs font-extrabold text-white">
                      <Flame className="h-3.5 w-3.5" /> Overworld Viral IRL Shrine (+25 XP)
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveEncounter(null)}
                      className="rounded-lg border border-[#1E1022] bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                    >
                      Keep Exploring ✕
                    </button>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#1E1022]">
                    &ldquo;{item.text}&rdquo;
                  </div>
                  {activeEncounter.voted === null ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          sfx.pixelCoin();
                          if (!loadChecklistCheckedIds().includes(item.id)) {
                            toggleChecklistItemInStorage(item.id);
                          }
                          const solved = Array.from(
                            new Set([...progress.solvedNodeIds, activeEncounter.nodeId]),
                          );
                          onGainXp(25, {
                            solvedNodeIds: solved,
                            triviaIndex: progress.triviaIndex + 1,
                          });
                          setActiveEncounter({ ...activeEncounter, voted: 'lived' });
                        }}
                        className="pop-btn rounded-xl bg-[#FF2E63] px-4 py-2 text-xs font-extrabold text-white cursor-pointer"
                      >
                        🙋‍♀️ Lived This IRL! (+25 XP)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          sfx.pixelCoin();
                          const solved = Array.from(
                            new Set([...progress.solvedNodeIds, activeEncounter.nodeId]),
                          );
                          onGainXp(20, {
                            solvedNodeIds: solved,
                            triviaIndex: progress.triviaIndex + 1,
                          });
                          setActiveEncounter({ ...activeEncounter, voted: 'dodged' });
                        }}
                        className="pop-btn rounded-xl bg-white px-4 py-2 text-xs font-extrabold text-[#1E1022] cursor-pointer"
                      >
                        🛡️ Dodged So Far (+20 XP)
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold text-[#065F46]">
                      <span>✓ Stamped onto your 25-Point Viral Score (+XP earned)!</span>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveEncounter(null);
                            onEnterEpisode(item.episodeId);
                          }}
                          className="text-[#FF2E63] underline cursor-pointer"
                        >
                          Play This Scene →
                        </button>
                        {onOpenFullChecklist && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveEncounter(null);
                              onOpenFullChecklist();
                            }}
                            className="text-[#1E1022] underline cursor-pointer"
                          >
                            All 25 Boxes →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {activeEncounter.type === 'goblin' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-[#1E1022] bg-[#FFE4E6] px-3 py-0.5 text-xs font-extrabold text-[#9F1239]">
                    {activeEncounter.goblin.emoji} Wild Red-Flag Goblin Ambush: {activeEncounter.goblin.name}
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
                    showWorldToast(`⚡ +30 XP! ${activeEncounter.goblin.roastLine}`);
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
                    Step inside to play the interactive animated episode &amp; arcade minigame (+XP)!
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
                      const epId = activeEncounter.building.episodeId;
                      setActiveEncounter(null);
                      onGainXp(15);
                      onEnterEpisode(epId);
                    }}
                    className="pop-btn rounded-xl bg-[#FF2E63] px-4 py-2 text-xs font-extrabold text-white cursor-pointer"
                  >
                    Enter Scene →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Symmetrical 44px-Height Arcade Controls + Equal-Width Encounter Buttons */}
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
              onMouseDown={() => {
                dpadRef.current = { dx, dy };
              }}
              onMouseUp={() => {
                dpadRef.current = { dx: 0, dy: 0 };
              }}
              onMouseLeave={() => {
                dpadRef.current = { dx: 0, dy: 0 };
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                dpadRef.current = { dx, dy };
              }}
              onTouchEnd={() => {
                dpadRef.current = { dx: 0, dy: 0 };
              }}
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
            className="pop-btn h-11 inline-flex items-center gap-1.5 rounded-xl bg-[#FF2E63] px-4 text-sm text-white cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>A • INTERACT</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => triggerNodeEncounter(WORLD_NODES[0])}
            className="pop-btn h-11 w-full rounded-xl bg-[#FFBE0B] px-3 text-sm text-[#1E1022] cursor-pointer"
          >
            🕹️ Jukebox Trivia (+35 XP)
          </button>
          <button
            type="button"
            onClick={() => triggerNodeEncounter(WORLD_NODES[1])}
            className="pop-btn h-11 w-full rounded-xl bg-[#FFF4F7] px-3 text-sm text-[#D90452] cursor-pointer"
          >
            🔥 Viral Shrine (+25 XP)
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
            className="pop-btn h-11 w-full rounded-xl bg-[#FFE4E6] px-3 text-sm text-[#9F1239] cursor-pointer"
          >
            ⚡ Intercept Red-Flag Goblin
          </button>
        </div>
      </div>

      {/* Equal-Height 3x2 Fast-Travel Venue Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {BUILDINGS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => {
              sfx.crystalClink();
              onGainXp(15);
              onEnterEpisode(b.episodeId);
            }}
            className="pop-btn h-20 rounded-2xl bg-white px-4 text-left hover:bg-[#FFFBEB] cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#D90452]">
                {b.emoji} Fast-Travel Venue
              </div>
              <div className="font-display text-base text-[#1E1022] leading-snug line-clamp-2">
                {b.buttonName}
              </div>
            </div>
            <span className="shrink-0 inline-flex h-9 items-center rounded-xl border-2 border-[#1E1022] bg-[#FFBE0B] px-3 text-xs font-bold text-[#1E1022]">
              Play →
            </span>
          </button>
        ))}
      </div>

      {/* Featured New Red-Flag Spotlight Banner */}
      <button
        type="button"
        onClick={() => {
          sfx.shockZoom();
          onGainXp(20);
          onEnterEpisode('pine-pollen-feels-incoherent-text-spiral');
        }}
        className="pop-btn w-full rounded-2xl bg-gradient-to-r from-[#FFF4F7] via-[#FFFBEB] to-[#ECFDF5] px-4 py-3 text-left hover:brightness-98 cursor-pointer flex flex-wrap sm:flex-nowrap items-center justify-between gap-3"
      >
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wide text-[#D90452]">
            🌲 New Cub Red-Flag Scene • Communication Mishaps &amp; Differing Expectations
          </div>
          <div className="font-display text-base text-[#1E1022] leading-snug">
            Pine-Pollen Testosterone &amp; The 11:47 PM &ldquo;All Up in My Feels&rdquo; Text Spiral
          </div>
        </div>
        <span className="shrink-0 inline-flex h-10 items-center rounded-xl border-2 border-[#1E1022] bg-[#FF2E63] px-3.5 text-xs font-bold text-white">
          Decode Texts →
        </span>
      </button>
    </section>
  );
};
