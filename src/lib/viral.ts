import { EPISODES } from '../data/episodes';
import type { RunSummary } from '../domain/gameEngine';
import type { PlayerRole } from '../domain/taxonomy';

export interface ChallengePayload {
  v: 1;
  senderName: string;
  senderRole: PlayerRole;
  herId: string;
  hisId: string;
  episodeIds: string[];
  preferredChoiceIndices: number[];
}

export interface PartnerAuditionScore {
  matchPercent: number;
  alignedCount: number;
  verdictTitle: string;
  roastNotes: string[];
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(padLen);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function encodeChallengeLink(payload: ChallengePayload, baseUrl: string): string {
  const json = JSON.stringify(payload);
  const encoded = bytesToBase64Url(new TextEncoder().encode(json));
  const url = new URL(baseUrl);
  url.searchParams.set('challenge', encoded);
  return url.toString();
}

export function decodeChallengeParam(param: string | null): ChallengePayload | null {
  if (!param || typeof param !== 'string' || param.length > 4096) {
    return null;
  }
  if (!/^[A-Za-z0-9\-_]+$/.test(param)) {
    return null;
  }

  try {
    const bytes = base64UrlToBytes(param);
    const json = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    const parsed = JSON.parse(json) as Partial<ChallengePayload>;

    if (
      parsed.v !== 1 ||
      typeof parsed.senderName !== 'string' ||
      !parsed.senderName.trim() ||
      (parsed.senderRole !== 'her' && parsed.senderRole !== 'him') ||
      typeof parsed.herId !== 'string' ||
      typeof parsed.hisId !== 'string' ||
      !Array.isArray(parsed.episodeIds) ||
      parsed.episodeIds.length === 0 ||
      parsed.episodeIds.length > 10 ||
      !parsed.episodeIds.every((id) => typeof id === 'string') ||
      !Array.isArray(parsed.preferredChoiceIndices) ||
      parsed.preferredChoiceIndices.length !== parsed.episodeIds.length ||
      !parsed.preferredChoiceIndices.every(
        (idx) => typeof idx === 'number' && Number.isInteger(idx) && idx >= 0 && idx <= 2,
      )
    ) {
      return null;
    }

    return {
      v: 1,
      senderName: parsed.senderName.slice(0, 40),
      senderRole: parsed.senderRole,
      herId: parsed.herId,
      hisId: parsed.hisId,
      episodeIds: parsed.episodeIds,
      preferredChoiceIndices: parsed.preferredChoiceIndices,
    };
  } catch {
    return null;
  }
}

export function scorePartnerAudition(
  payload: ChallengePayload,
  partnerChoiceIndices: number[],
): PartnerAuditionScore {
  const total = payload.episodeIds.length;
  let alignedCount = 0;
  const roastNotes: string[] = [];

  for (let i = 0; i < total; i++) {
    const ep = EPISODES.find((e) => e.id === payload.episodeIds[i]);
    const title = ep ? ep.title.split('(')[0].trim() : `Scenario ${i + 1}`;
    const expected = payload.preferredChoiceIndices[i];
    const actual = partnerChoiceIndices[i];

    if (actual === expected) {
      alignedCount += 1;
      roastNotes.push(`💚 ${title}: Exact wavelength match with ${payload.senderName}!`);
    } else {
      const pickedChoice = ep?.choices[actual];
      const isRedFlag = (pickedChoice?.deltas.redFlags ?? 0) > 0;
      roastNotes.push(
        isRedFlag
          ? `🚩 ${title}: Triggered ${payload.senderName}’s dealbreaker alarm!`
          : `👀 ${title}: Different instinct than ${payload.senderName}—worth debating over drinks.`,
      );
    }
  }

  const matchPercent = total > 0 ? Math.round((alignedCount / total) * 100) : 0;

  let verdictTitle: string;
  if (matchPercent >= 80) {
    verdictTitle = 'SHORT-LEASH & LINEN-APRON CERTIFIED MATCH';
  } else if (matchPercent >= 60) {
    verdictTitle = 'STRONG CHEMISTRY — ONE TRAINING DATE NEEDED';
  } else {
    verdictTitle = 'GENERATIONAL TRANSLATOR REQUIRED IMMEDIATELY';
  }

  return {
    matchPercent,
    alignedCount,
    verdictTitle,
    roastNotes,
  };
}

export function buildDilemmaShareLink(episodeOrProfileId: string, baseUrl: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set('dilemma', episodeOrProfileId);
  return url.toString();
}

export function buildEmojiReceipt(summary: RunSummary, shareUrl: string): string {
  const bottleLine = summary.caughtBottleTrap
    ? '📱 App Audit: 🔍 Caught the Tito’s Bottle'
    : '📱 App Audit: ⚡ Survived The Prowl';

  const episodeLines = summary.episodeHighlights
    .slice(0, 4)
    .map((h) => `${h.emoji} ${h.title}`)
    .join('\n');

  return [
    `🐆 COUGARS & CUBS CLUB • ${summary.pairing.her.age}F ${summary.pairing.her.name} × ${summary.pairing.his.age}M ${summary.pairing.his.name}`,
    bottleLine,
    episodeLines,
    `🏆 Rank: ${summary.rankTitle} (${summary.overallScore}%)`,
    `Think you’d pass my Cougar/Cub Vetting Test? 👉 ${shareUrl}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildDiscordReceipt(summary: RunSummary, shareUrl: string): string {
  const highlights = summary.episodeHighlights
    .slice(0, 3)
    .map((h) => `> ${h.emoji} **${h.title}**`)
    .join('\n');

  return [
    `### 🐆 **COUGARS & CUBS CLUB — ${summary.overallScore}% VIBE MATCH**`,
    `**${summary.pairing.her.name} (${summary.pairing.her.age}F) × ${summary.pairing.his.name} (${summary.pairing.his.age}M)** • *${summary.rankTitle}*`,
    `📊 \`Maturity ${summary.stats.maturity}\` • \`Chivalry ${summary.stats.chivalry}\` • \`EQ ${summary.stats.eq}\` • \`Chemistry ${summary.stats.chemistry}\``,
    highlights,
    `🍸 **Pass the 60-Second Vetting Test:** ${shareUrl}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function shareOrCopy(params: {
  title: string;
  text: string;
  url: string;
}): Promise<'shared' | 'copied'> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share(params);
      return 'shared';
    } catch {
      // User dismissed or unsupported desktop share sheet; fall through to clipboard
    }
  }
  const payload = params.text.includes(params.url)
    ? params.text
    : `${params.text}\n${params.url}`;
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // Ignore denied clipboard permissions in restricted contexts
    }
  }
  return 'copied';
}

function drawRoundedPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  opts?: { fill?: string | CanvasGradient; stroke?: string; lineWidth?: number },
): void {
  if (typeof ctx.beginPath === 'function' && typeof ctx.quadraticCurveTo === 'function') {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (opts?.fill !== undefined) {
      ctx.fillStyle = opts.fill;
      ctx.fill();
    }
    if (opts?.stroke !== undefined) {
      ctx.strokeStyle = opts.stroke;
      if (opts.lineWidth) ctx.lineWidth = opts.lineWidth;
      ctx.stroke();
    }
    return;
  }

  // Fallback for minimal test canvas stubs lacking path primitives
  if (opts?.fill !== undefined && typeof ctx.fillRect === 'function') {
    ctx.fillStyle = opts.fill;
    ctx.fillRect(x, y, w, h);
  }
  if (opts?.stroke !== undefined && typeof ctx.strokeRect === 'function') {
    ctx.strokeStyle = opts.stroke;
    if (opts.lineWidth) ctx.lineWidth = opts.lineWidth;
    ctx.strokeRect(x, y, w, h);
  }
}

function measureSafeWidth(ctx: CanvasRenderingContext2D, text: string, approxPx: number): number {
  const measured = ctx.measureText ? ctx.measureText(text).width : 0;
  return measured > 0 ? measured : text.length * approxPx * 0.56;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontPx: number,
  maxLines: number,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];

  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${current} ${words[i]}`;
    if (measureSafeWidth(ctx, candidate, fontPx) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);

  if (lines.length <= maxLines) return lines;

  const clamped = lines.slice(0, maxLines);
  let last = clamped[maxLines - 1];
  while (last.length > 4 && measureSafeWidth(ctx, `${last}…`, fontPx) > maxWidth) {
    last = last.slice(0, -1).trimEnd();
  }
  clamped[maxLines - 1] = `${last}…`;
  return clamped;
}

function drawAutoFitCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  maxWidth: number,
  startPx: number,
  minPx: number,
  weight: string,
  family: string,
): void {
  let px = startPx;
  ctx.font = `${weight} ${px}px ${family}`;
  while (px > minPx && measureSafeWidth(ctx, text, px) > maxWidth) {
    px -= 2;
    ctx.font = `${weight} ${px}px ${family}`;
  }
  let finalStr = text;
  while (finalStr.length > 6 && measureSafeWidth(ctx, finalStr, px) > maxWidth) {
    finalStr = `${finalStr.slice(0, -2).trimEnd()}…`;
  }
  ctx.textAlign = 'center';
  ctx.fillText(finalStr, centerX, y, maxWidth);
}

/**
 * Overflow-proof 1080x1920 (9:16) IG Story & TikTok Receipt Renderer.
 * Every text block uses bounded measurement, auto-fitting, or multi-line wrapping
 * inside an 860px safe inner column so zero characters ever clip or overflow.
 */
export function drawStoryReceiptToCanvas(
  canvas: HTMLCanvasElement,
  summary: RunSummary,
  publicUrl: string,
): void {
  const W = 1080;
  const H = 1920;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const displayFont = '"Playfair Display", Georgia, serif';
  const bodyFont = '"DM Sans", system-ui, sans-serif';
  const CX = W / 2;

  // 1. Midnight Champagne & Rose Luxury Backdrop
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#120b1f');
  bg.addColorStop(0.5, '#22102d');
  bg.addColorStop(1, '#0d0a18');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  if (typeof ctx.createRadialGradient === 'function') {
    const glowTop = ctx.createRadialGradient(CX, 280, 40, CX, 280, 560);
    glowTop.addColorStop(0, 'rgba(244, 63, 94, 0.28)');
    glowTop.addColorStop(1, 'rgba(244, 63, 94, 0)');
    ctx.fillStyle = glowTop;
    ctx.fillRect(0, 0, W, 900);

    const glowBot = ctx.createRadialGradient(CX, 1520, 40, CX, 1520, 520);
    glowBot.addColorStop(0, 'rgba(251, 191, 36, 0.16)');
    glowBot.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glowBot;
    ctx.fillRect(0, 1000, W, 920);
  }

  // Outer Champagne Card Frame
  drawRoundedPanel(ctx, 48, 48, W - 96, H - 96, 48, {
    stroke: 'rgba(253, 230, 138, 0.35)',
    lineWidth: 3,
  });

  // 2. Top Brand Header Pill (y = 96..184)
  const pillGrad = ctx.createLinearGradient(180, 96, 900, 184);
  pillGrad.addColorStop(0, '#e11d48');
  pillGrad.addColorStop(1, '#d97706');
  drawRoundedPanel(ctx, 150, 96, 780, 84, 42, { fill: pillGrad });

  ctx.fillStyle = '#ffffff';
  drawAutoFitCentered(
    ctx,
    '🐆 COUGARS & CUBS CLUB • VIBE RECEIPT',
    CX,
    150,
    720,
    34,
    24,
    '800',
    displayFont,
  );

  // 3. Couple Matchup Glass Card (y = 216..406)
  drawRoundedPanel(ctx, 90, 216, 900, 190, 32, {
    fill: 'rgba(255, 255, 255, 0.05)',
    stroke: 'rgba(255, 255, 255, 0.12)',
    lineWidth: 2,
  });

  ctx.fillStyle = '#ffffff';
  drawAutoFitCentered(
    ctx,
    `${summary.pairing.her.name} (${summary.pairing.her.age}F)  ×  ${summary.pairing.his.name} (${summary.pairing.his.age}M)`,
    CX,
    292,
    830,
    46,
    30,
    '700',
    displayFont,
  );

  ctx.fillStyle = '#fde68a';
  drawAutoFitCentered(
    ctx,
    summary.pairing.badgeLabel,
    CX,
    358,
    820,
    30,
    20,
    '600',
    bodyFont,
  );

  // 4. Stacked Hero Score Medallion (y = 434..824) — Zero Side-by-Side Collision!
  drawRoundedPanel(ctx, 90, 434, 900, 390, 36, {
    fill: 'rgba(13, 9, 24, 0.82)',
    stroke: 'rgba(251, 191, 36, 0.4)',
    lineWidth: 3,
  });

  ctx.fillStyle = '#fbbf24';
  drawAutoFitCentered(ctx, `${summary.overallScore}%`, CX, 582, 800, 134, 96, '800', displayFont);

  // Multi-line wrapped Rank Title inside 820px width
  ctx.font = `700 38px ${displayFont}`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  const rankLines = wrapLines(ctx, summary.rankTitle, 820, 38, 2);
  rankLines.forEach((line, idx) => {
    ctx.fillText(line, CX, 654 + idx * 48, 820);
  });

  const strikesY = rankLines.length > 1 ? 776 : 742;
  ctx.fillStyle = summary.redFlags === 0 ? '#6ee7b7' : '#fda4af';
  drawAutoFitCentered(
    ctx,
    `Red Flags Triggered: ${summary.redFlags} / 3  •  ${summary.redFlags === 0 ? 'Zero-Ick Run' : 'Vetted Live'}`,
    CX,
    strikesY,
    800,
    28,
    22,
    '600',
    bodyFont,
  );

  // 5. Four Capsule Stat Bars (y = 864..1324)
  const statEntries: [string, number, string, string][] = [
    ['Emotional Maturity', summary.stats.maturity, '#fb7185', '#e11d48'],
    ['Chivalry & Effort', summary.stats.chivalry, '#fcd34d', '#d97706'],
    ['Communication & EQ', summary.stats.eq, '#6ee7b7', '#10b981'],
    ['Chemistry & Spark', summary.stats.chemistry, '#f472b6', '#db2777'],
  ];

  statEntries.forEach(([label, val, cStart, cEnd], idx) => {
    const y = 890 + idx * 114;
    const clampedVal = Math.max(0, Math.min(100, Math.round(val)));

    ctx.font = `600 30px ${bodyFont}`;
    ctx.fillStyle = '#f1f5f9';
    ctx.textAlign = 'left';
    ctx.fillText(label, 105, y, 660);

    ctx.font = `700 32px ${displayFont}`;
    ctx.fillStyle = '#fde68a';
    ctx.textAlign = 'right';
    ctx.fillText(`${clampedVal}/100`, 975, y, 160);

    // Track
    drawRoundedPanel(ctx, 105, y + 18, 870, 28, 14, {
      fill: 'rgba(255, 255, 255, 0.09)',
    });

    // Fill
    const fillW = Math.max(28, Math.round((870 * clampedVal) / 100));
    const barGrad = ctx.createLinearGradient(105, y + 18, 105 + fillW, y + 46);
    barGrad.addColorStop(0, cStart);
    barGrad.addColorStop(1, cEnd);
    drawRoundedPanel(ctx, 105, y + 18, fillW, 28, 14, { fill: barGrad });
  });

  // 6. Earned Club Badges Card (y = 1364..1696)
  drawRoundedPanel(ctx, 90, 1364, 900, 326, 32, {
    fill: 'rgba(255, 255, 255, 0.04)',
    stroke: 'rgba(255, 255, 255, 0.1)',
    lineWidth: 2,
  });

  ctx.fillStyle = '#fde68a';
  drawAutoFitCentered(ctx, '🏆 EARNED CLUB BADGES', CX, 1420, 820, 30, 24, '700', displayFont);

  const badges =
    summary.badges.length > 0
      ? summary.badges.slice(0, 3)
      : ['Completed Official Cougars & Cubs Club Vetting'];

  badges.forEach((badge, idx) => {
    const pillY = 1450 + idx * 72;
    drawRoundedPanel(ctx, 130, pillY, 820, 56, 28, {
      fill: 'rgba(244, 63, 94, 0.16)',
    });

    ctx.fillStyle = '#f8fafc';
    drawAutoFitCentered(ctx, `✨ ${badge}`, CX, pillY + 38, 770, 27, 20, '600', bodyFont);
  });

  // 7. Footer Call-to-Action Pill (y = 1734..1830)
  const cleanDomain = publicUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  drawRoundedPanel(ctx, 90, 1734, 900, 92, 46, { fill: pillGrad });

  ctx.fillStyle = '#ffffff';
  drawAutoFitCentered(
    ctx,
    `Play & Send Your 60s Audition → ${cleanDomain}`,
    CX,
    1792,
    830,
    32,
    22,
    '700',
    displayFont,
  );

  // Restore default left alignment for any external callers
  ctx.textAlign = 'left';
}
