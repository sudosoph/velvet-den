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

  const displayFont = '"Outfit", system-ui, sans-serif';
  const bodyFont = '"Plus Jakarta Sans", system-ui, sans-serif';
  const CX = W / 2;

  // 1. Palm Springs Sunlit Pop-Art Backdrop
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#FFF5EC');
  bg.addColorStop(0.5, '#FFE8F0');
  bg.addColorStop(1, '#FFF3D6');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Outer Bold Ink Frame
  drawRoundedPanel(ctx, 44, 44, W - 88, H - 88, 48, {
    fill: '#FFFDF9',
    stroke: '#1E1022',
    lineWidth: 6,
  });

  // 2. Top Brand Header Pill (y = 92..180)
  drawRoundedPanel(ctx, 130, 92, 820, 86, 43, {
    fill: '#FF2E63',
    stroke: '#1E1022',
    lineWidth: 5,
  });

  ctx.fillStyle = '#FFFFFF';
  drawAutoFitCentered(
    ctx,
    '🐆 Cougars & Cubs Club • Vibe Receipt',
    CX,
    148,
    760,
    36,
    24,
    '800',
    displayFont,
  );

  // 3. Couple Matchup Pop Card (y = 212..402)
  drawRoundedPanel(ctx, 90, 212, 900, 190, 32, {
    fill: '#FFF4F7',
    stroke: '#1E1022',
    lineWidth: 4,
  });

  ctx.fillStyle = '#1E1022';
  drawAutoFitCentered(
    ctx,
    `${summary.pairing.her.name} (${summary.pairing.her.age}F)  ×  ${summary.pairing.his.name} (${summary.pairing.his.age}M)`,
    CX,
    290,
    830,
    46,
    30,
    '800',
    displayFont,
  );

  ctx.fillStyle = '#D90452';
  drawAutoFitCentered(
    ctx,
    summary.pairing.badgeLabel,
    CX,
    356,
    820,
    30,
    20,
    '700',
    bodyFont,
  );

  // 4. Stacked Hero Score Medallion (y = 432..822)
  drawRoundedPanel(ctx, 90, 432, 900, 390, 36, {
    fill: '#FFBE0B',
    stroke: '#1E1022',
    lineWidth: 5,
  });

  ctx.fillStyle = '#1E1022';
  drawAutoFitCentered(ctx, `${summary.overallScore}%`, CX, 582, 800, 136, 96, '900', displayFont);

  ctx.font = `800 38px ${displayFont}`;
  ctx.fillStyle = '#1E1022';
  ctx.textAlign = 'center';
  const rankLines = wrapLines(ctx, summary.rankTitle, 820, 38, 2);
  rankLines.forEach((line, idx) => {
    ctx.fillText(line, CX, 652 + idx * 48, 820);
  });

  const strikesY = rankLines.length > 1 ? 774 : 740;
  ctx.fillStyle = summary.redFlags === 0 ? '#065F46' : '#9F1239';
  drawAutoFitCentered(
    ctx,
    `Red Flags: ${summary.redFlags} / 3  •  ${summary.redFlags === 0 ? 'Zero-Ick Run!' : 'Vetted Live'}`,
    CX,
    strikesY,
    800,
    28,
    22,
    '700',
    bodyFont,
  );

  // 5. Four Capsule Stat Bars (y = 864..1324)
  const statEntries: [string, number, string][] = [
    ['Emotional Maturity', summary.stats.maturity, '#FF2E63'],
    ['Chivalry & Effort', summary.stats.chivalry, '#FFBE0B'],
    ['Communication & EQ', summary.stats.eq, '#10B981'],
    ['Chemistry & Spark', summary.stats.chemistry, '#FF6B6B'],
  ];

  statEntries.forEach(([label, val, barColor], idx) => {
    const y = 890 + idx * 114;
    const clampedVal = Math.max(0, Math.min(100, Math.round(val)));

    ctx.font = `700 30px ${bodyFont}`;
    ctx.fillStyle = '#1E1022';
    ctx.textAlign = 'left';
    ctx.fillText(label, 105, y, 660);

    ctx.font = `800 32px ${displayFont}`;
    ctx.fillStyle = '#D90452';
    ctx.textAlign = 'right';
    ctx.fillText(`${clampedVal}/100`, 975, y, 160);

    drawRoundedPanel(ctx, 105, y + 18, 870, 30, 15, {
      fill: '#F3E8EE',
      stroke: '#1E1022',
      lineWidth: 3,
    });

    const fillW = Math.max(32, Math.round((870 * clampedVal) / 100));
    drawRoundedPanel(ctx, 105, y + 18, fillW, 30, 15, {
      fill: barColor,
      stroke: '#1E1022',
      lineWidth: 3,
    });
  });

  // 6. Earned Club Badges Card (y = 1364..1696)
  drawRoundedPanel(ctx, 90, 1364, 900, 326, 32, {
    fill: '#FFF4F7',
    stroke: '#1E1022',
    lineWidth: 4,
  });

  ctx.fillStyle = '#1E1022';
  drawAutoFitCentered(ctx, '🏆 Earned Club Badges', CX, 1420, 820, 32, 24, '800', displayFont);

  const badges =
    summary.badges.length > 0
      ? summary.badges.slice(0, 3)
      : ['Completed Official Cougars & Cubs Club Vetting'];

  badges.forEach((badge, idx) => {
    const pillY = 1450 + idx * 72;
    drawRoundedPanel(ctx, 130, pillY, 820, 56, 28, {
      fill: '#FFFFFF',
      stroke: '#1E1022',
      lineWidth: 3,
    });

    ctx.fillStyle = '#1E1022';
    drawAutoFitCentered(ctx, `✨ ${badge}`, CX, pillY + 38, 770, 26, 20, '700', bodyFont);
  });

  // 7. Footer Call-to-Action Pill (y = 1734..1830)
  const cleanDomain = publicUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  drawRoundedPanel(ctx, 90, 1734, 900, 92, 46, {
    fill: '#FF2E63',
    stroke: '#1E1022',
    lineWidth: 5,
  });

  ctx.fillStyle = '#FFFFFF';
  drawAutoFitCentered(
    ctx,
    `Play & Send Your 60s Audition → ${cleanDomain}`,
    CX,
    1792,
    830,
    32,
    22,
    '800',
    displayFont,
  );

  ctx.textAlign = 'left';
}
