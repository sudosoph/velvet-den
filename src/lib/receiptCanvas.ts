export interface ReceiptCanvasOptions {
  style?: 'luxury' | 'thermal' | 'certificate';
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

function renderThermalPaperReceipt(
  ctx: CanvasRenderingContext2D,
  opts: ReceiptCanvasOptions,
): void {
  // Moody Bar Backdrop Behind Paper Receipt
  ctx.fillStyle = '#18181B';
  ctx.fillRect(0, 0, 1080, 1350);

  // Crumpled Cream Thermal Paper Sheet with Zig-Zag Torn Top & Bottom
  const left = 110;
  const right = 970;
  const top = 76;
  const bottom = 1274;
  const tooth = 20;

  ctx.fillStyle = '#FAF7EF';
  ctx.beginPath();
  ctx.moveTo(left, top);
  for (let x = left; x < right; x += tooth) {
    ctx.lineTo(x + tooth / 2, top - 12);
    ctx.lineTo(Math.min(right, x + tooth), top);
  }
  ctx.lineTo(right, bottom);
  for (let x = right; x > left; x -= tooth) {
    ctx.lineTo(x - tooth / 2, bottom + 12);
    ctx.lineTo(Math.max(left, x - tooth), bottom);
  }
  ctx.closePath();
  ctx.fill();

  // Receipt Header
  ctx.fillStyle = '#09090B';
  ctx.textAlign = 'center';
  ctx.font = '800 34px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('THE MARLOW LOUNGE · SUNSET HILLS', 540, 152);

  ctx.fillStyle = '#52525B';
  ctx.font = '600 22px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(opts.badge.slice(0, 42).toUpperCase(), 540, 192);
  ctx.fillText('TABLE 01 · SERVER: JADE · ADULTS 21+', 540, 224);

  // Dashed Rule
  ctx.textAlign = 'left';
  ctx.fillStyle = '#71717A';
  ctx.font = '600 22px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('------------------------------------------------', 156, 266);

  // Big Score / Percentile Stamp
  ctx.fillStyle = '#E11D48';
  ctx.font = '900 72px Inter, system-ui, sans-serif';
  ctx.fillText(opts.bigStat.slice(0, 26), 156, 352);

  ctx.fillStyle = '#09090B';
  ctx.font = '800 34px Inter, system-ui, sans-serif';
  const verdictLines = wrapCanvasLines(ctx, opts.verdictLabel, 760).slice(0, 2);
  let y = 408;
  for (const line of verdictLines) {
    ctx.fillText(line, 156, y);
    y += 42;
  }

  ctx.fillStyle = '#3F3F46';
  ctx.font = '600 26px ui-monospace, SFMono-Regular, Menlo, monospace';
  const titleLines = wrapCanvasLines(ctx, opts.title, 760).slice(0, 2);
  y += 12;
  for (const line of titleLines) {
    ctx.fillText(line, 156, y);
    y += 36;
  }

  y += 14;
  ctx.fillStyle = '#71717A';
  ctx.font = '600 22px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('QTY  ITEMIZED DATING RECEIPT               SCORE', 156, y);
  y += 30;
  ctx.fillText('------------------------------------------------', 156, y);
  y += 42;

  // Itemized Thermal Rows
  ctx.fillStyle = '#18181B';
  ctx.font = '600 24px ui-monospace, SFMono-Regular, Menlo, monospace';
  for (const bullet of opts.bullets.slice(0, 5)) {
    const wrapped = wrapCanvasLines(ctx, bullet, 760).slice(0, 2);
    for (const bLine of wrapped) {
      ctx.fillText(bLine, 156, y);
      y += 34;
    }
    y += 14;
  }

  // Bottom Totals + Barcode
  ctx.fillStyle = '#71717A';
  ctx.fillText('------------------------------------------------', 156, 1048);
  ctx.fillStyle = '#09090B';
  ctx.font = '800 26px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(
    (opts.footerNote || 'VERDICT: CERTIFIED CLUB ROYALTY').slice(0, 46),
    156,
    1090,
  );

  // Faux Scannable Barcode Bars
  let bx = 250;
  const pattern = [6, 3, 9, 4, 3, 8, 5, 3, 10, 4, 6, 3, 7, 4, 9, 3, 5, 8, 4, 6, 3, 9, 5];
  ctx.fillStyle = '#09090B';
  for (let i = 0; i < pattern.length; i += 1) {
    const w = pattern[i];
    ctx.fillRect(bx, 1126, w, 74);
    bx += w + (i % 2 === 0 ? 7 : 5);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#52525B';
  ctx.font = '700 22px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('COUGARSANDCUBS.CLUB · NO SIGNUP · PLAY FREE', 540, 1236);
  ctx.textAlign = 'left';
}

function renderGoldSealCertificate(
  ctx: CanvasRenderingContext2D,
  opts: ReceiptCanvasOptions,
): void {
  // Obsidian Gallery Matting
  ctx.fillStyle = '#09090B';
  ctx.fillRect(0, 0, 1080, 1350);

  // Ivory Museum Parchment Sheet
  ctx.fillStyle = '#FCF9F2';
  ctx.fillRect(54, 54, 972, 1242);

  // Outer Metallic Gold Frame + Inner Crimson Hairline
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 8;
  ctx.strokeRect(78, 78, 924, 1194);

  ctx.strokeStyle = '#E11D48';
  ctx.lineWidth = 3;
  ctx.strokeRect(96, 96, 888, 1158);

  ctx.textAlign = 'center';

  // Top Academy Crest
  ctx.fillStyle = '#9F1239';
  ctx.font = '800 24px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('🏛️ SUNSET HILLS ACADEMY OF COURTSHIP & DISCERNMENT', 540, 168);

  ctx.fillStyle = '#D97706';
  ctx.font = '700 20px Inter, system-ui, sans-serif';
  ctx.fillText(opts.badge.slice(0, 48).toUpperCase(), 540, 208);

  // Formal Conferral Lead-In
  ctx.fillStyle = '#52525B';
  ctx.font = 'italic 28px Georgia, serif';
  ctx.fillText('Know All Cougars, Pumas, Jaguars & Cubs That', 540, 286);

  // Recipient Name Banner
  ctx.fillStyle = '#09090B';
  ctx.font = '800 68px Georgia, serif';
  ctx.fillText(opts.bigStat.slice(0, 26), 540, 382);

  ctx.fillStyle = '#D97706';
  ctx.fillRect(220, 408, 640, 3);

  // Official Conferred Seal Title
  ctx.fillStyle = '#BE123C';
  ctx.font = '800 36px Inter, system-ui, sans-serif';
  const sealLines = wrapCanvasLines(ctx, opts.verdictLabel, 780).slice(0, 2);
  let y = 472;
  for (const line of sealLines) {
    ctx.fillText(line, 540, y);
    y += 46;
  }

  // Citation Subhead
  ctx.fillStyle = '#27272A';
  ctx.font = '600 28px Georgia, serif';
  const citeLines = wrapCanvasLines(ctx, opts.title, 780).slice(0, 2);
  y += 18;
  for (const line of citeLines) {
    ctx.fillText(line, 540, y);
    y += 40;
  }

  // Honours Bullet Box
  ctx.textAlign = 'left';
  y += 28;
  ctx.fillStyle = '#F5F0E4';
  ctx.fillRect(140, y, 800, 310);
  ctx.strokeStyle = '#E4D8C1';
  ctx.lineWidth = 2;
  ctx.strokeRect(140, y, 800, 310);

  let by = y + 52;
  ctx.font = '600 25px Inter, system-ui, sans-serif';
  for (const b of opts.bullets.slice(0, 4)) {
    ctx.fillStyle = '#D97706';
    ctx.fillText('★', 172, by);
    ctx.fillStyle = '#18181B';
    const wrapped = wrapCanvasLines(ctx, b, 690).slice(0, 2);
    for (const wl of wrapped) {
      ctx.fillText(wl, 210, by);
      by += 36;
    }
    by += 18;
  }

  // Dual Faculty Signatures + Embossed Crimson/Gold Wax Seal
  ctx.textAlign = 'center';
  ctx.fillStyle = '#18181B';
  ctx.font = 'italic 28px Georgia, serif';
  ctx.fillText('Prof. Elena Vance, 44', 280, 1086);
  ctx.fillText('Claire Sterling, 46', 800, 1086);

  ctx.fillStyle = '#71717A';
  ctx.fillRect(160, 1100, 240, 2);
  ctx.fillRect(680, 1100, 240, 2);
  ctx.font = '700 18px Inter, system-ui, sans-serif';
  ctx.fillText('DEAN OF ETIQUETTE', 280, 1128);
  ctx.fillText('SENIOR VETTING PARTNER', 800, 1128);

  // Center Wax Seal
  ctx.beginPath();
  ctx.arc(540, 1094, 68, 0, Math.PI * 2);
  ctx.fillStyle = '#BE123C';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#F59E0B';
  ctx.stroke();

  ctx.fillStyle = '#FEF3C7';
  ctx.font = '800 20px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('VETTED', 540, 1088);
  ctx.fillText('21+ SEAL', 540, 1114);

  ctx.fillStyle = '#52525B';
  ctx.font = '700 20px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(
    opts.footerNote || 'VERIFIED AT COUGARSANDCUBS.CLUB · OFFICIAL CLUB REGISTRY',
    540,
    1218,
  );
  ctx.textAlign = 'left';
}

export function downloadReceiptPng(opts: ReceiptCanvasOptions): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    if (opts.style === 'certificate') {
      renderGoldSealCertificate(ctx, opts);
    } else if (opts.style === 'thermal') {
      renderThermalPaperReceipt(ctx, opts);
    } else {
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
    }

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
