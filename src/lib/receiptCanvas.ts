export interface ReceiptCanvasOptions {
  badge: string;
  title: string;
  bigStat: string;
  verdictLabel: string;
  bullets: string[];
  footerNote?: string;
  filename?: string;
}

function wrapCanvasLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function downloadReceiptPng(opts: ReceiptCanvasOptions): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Obsidian Luxury Receipt Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1350);
    bgGrad.addColorStop(0, '#09090B');
    bgGrad.addColorStop(0.55, '#18181B');
    bgGrad.addColorStop(1, '#09090B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1350);

    // Subtle Inner Card Frame
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
    ctx.lineWidth = 4;
    ctx.strokeRect(56, 56, 968, 1238);

    // Top Pill Badge
    ctx.fillStyle = '#E11D48';
    ctx.fillRect(96, 108, 420, 54);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 24px Inter, system-ui, sans-serif';
    ctx.fillText(opts.badge.slice(0, 32).toUpperCase(), 120, 143);

    // Big Stat Callout
    ctx.fillStyle = '#FBBF24';
    ctx.font = '800 116px Inter, system-ui, sans-serif';
    ctx.fillText(opts.bigStat, 96, 305);

    // Verdict Label
    ctx.fillStyle = '#FDA4AF';
    ctx.font = '700 34px Inter, system-ui, sans-serif';
    ctx.fillText(opts.verdictLabel.slice(0, 48), 96, 368);

    // Main Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 46px Inter, system-ui, sans-serif';
    const titleLines = wrapCanvasLines(ctx, opts.title, 880).slice(0, 3);
    let cursorY = 456;
    for (const line of titleLines) {
      ctx.fillText(line, 96, cursorY);
      cursorY += 58;
    }

    // Divider
    cursorY += 24;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.fillRect(96, cursorY, 888, 2);
    cursorY += 58;

    // Bullet Points
    ctx.font = '500 30px Inter, system-ui, sans-serif';
    for (const bullet of opts.bullets.slice(0, 4)) {
      ctx.fillStyle = '#F43F5E';
      ctx.fillText('•', 96, cursorY);
      ctx.fillStyle = '#E4E4E7';
      const wrapped = wrapCanvasLines(ctx, bullet, 840).slice(0, 3);
      for (const bLine of wrapped) {
        ctx.fillText(bLine, 132, cursorY);
        cursorY += 44;
      }
      cursorY += 22;
    }

    // Footer Brand Signature
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(96, 1170, 888, 2);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 28px Inter, system-ui, sans-serif';
    ctx.fillText('🐆 Cougars & Cubs Club · cougarsandcubs.club', 96, 1226);

    ctx.fillStyle = '#A1A1AA';
    ctx.font = '500 22px Inter, system-ui, sans-serif';
    ctx.fillText(
      opts.footerNote || 'Interactive Rom-Com, Vetting Lab & Courtroom',
      96,
      1264,
    );

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = opts.filename || 'cougars-and-cubs-receipt.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch {
    return false;
  }
}
