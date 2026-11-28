import React, { useEffect, useRef } from 'react';

export interface CelebrationBurstCanvasProps {
  active: boolean;
  palette?: 'match' | 'gold' | 'stamp';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  alpha: number;
}

const PALETTES: Record<NonNullable<CelebrationBurstCanvasProps['palette']>, string[]> = {
  match: ['#E11D48', '#FB7185', '#FBBF24', '#FFF1F2', '#F43F5E'],
  gold: ['#FBBF24', '#FDE68A', '#E11D48', '#34D399', '#FFFFFF'],
  stamp: ['#E11D48', '#F59E0B', '#10B981', '#F43F5E'],
};

export const CelebrationBurstCanvas: React.FC<CelebrationBurstCanvasProps> = ({
  active,
  palette = 'match',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active || import.meta.env.VITEST || typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = window.innerWidth || 1024);
    const h = (canvas.height = window.innerHeight || 768);
    const colors = PALETTES[palette];

    const particles: Particle[] = Array.from({ length: 68 }, (_, idx) => {
      const angle = (Math.PI * 2 * idx) / 68 + (Math.random() - 0.5) * 0.25;
      const speed = 5 + Math.random() * 9;
      return {
        x: w / 2 + (Math.random() - 0.5) * 140,
        y: h * 0.34 + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4.5,
        size: 6 + Math.random() * 7,
        color: colors[idx % colors.length],
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.24,
        alpha: 1,
      };
    });

    let rafId = 0;
    let frame = 0;
    const render = () => {
      frame += 1;
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28;
        p.vx *= 0.985;
        p.rotation += p.vr;
        if (frame > 42) {
          p.alpha = Math.max(0, p.alpha - 0.028);
        }
        if (p.alpha > 0 && p.y < h + 40) {
          alive += 1;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
          ctx.restore();
        }
      }
      if (alive > 0 && frame < 110) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    rafId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(rafId);
  }, [active, palette]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      data-testid="celebration-burst-canvas"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[85] h-full w-full"
    />
  );
};
