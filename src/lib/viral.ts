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
    `🐆 THE VELVET DEN • ${summary.pairing.her.age}F ${summary.pairing.her.name} × ${summary.pairing.his.age}M ${summary.pairing.his.name}`,
    bottleLine,
    episodeLines,
    `🏆 Rank: ${summary.rankTitle} (${summary.overallScore}%)`,
    `Think you’d pass my Cougar/Cub Vetting Test? 👉 ${shareUrl}`,
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
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(`${params.text}\n${params.url}`);
  }
  return 'copied';
}

export function drawStoryReceiptToCanvas(
  canvas: HTMLCanvasElement,
  summary: RunSummary,
  publicUrl: string,
): void {
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Sunset Vice gradient backdrop
  const bg = ctx.createLinearGradient(0, 0, 1080, 1920);
  bg.addColorStop(0, '#160924');
  bg.addColorStop(0.48, '#3b0a37');
  bg.addColorStop(1, '#09262c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1920);

  // Comic mosaic border frame
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 14;
  ctx.strokeRect(54, 54, 972, 1812);

  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(90, 110, 900, 110);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 62px "Bebas Neue", Impact, sans-serif';
  ctx.fillText('THE VELVET DEN • OFFICIAL VIBE RECEIPT', 125, 185);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 46px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(summary.pairing.badgeLabel.toUpperCase(), 95, 310);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    `${summary.pairing.her.name} (${summary.pairing.her.age}F) × ${summary.pairing.his.name} (${summary.pairing.his.age}M)`,
    95,
    375,
  );

  // Score hero box
  ctx.fillStyle = '#0d0814';
  ctx.fillRect(90, 440, 900, 290);
  ctx.strokeStyle = '#14b8a6';
  ctx.lineWidth = 6;
  ctx.strokeRect(90, 440, 900, 290);

  ctx.fillStyle = '#2dd4bf';
  ctx.font = 'bold 120px "Bebas Neue", Impact, sans-serif';
  ctx.fillText(`${summary.overallScore}%`, 130, 615);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px "Bebas Neue", Impact, sans-serif';
  ctx.fillText(summary.rankTitle.slice(0, 34), 390, 565);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Red Flags Triggered: ${summary.redFlags} / 3`, 390, 625);

  // Stat bars
  const statEntries: [string, number, string][] = [
    ['EMOTIONAL MATURITY', summary.stats.maturity, '#f43f5e'],
    ['CHIVALRY & EFFORT', summary.stats.chivalry, '#f59e0b'],
    ['GEN-Z / MILLENNIAL EQ', summary.stats.eq, '#14b8a6'],
    ['CHEMISTRY & THRILL', summary.stats.chemistry, '#ec4899'],
  ];

  statEntries.forEach(([label, val, color], idx) => {
    const y = 820 + idx * 140;
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${label}: ${val}`, 95, y);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(95, y + 22, 890, 40);
    ctx.fillStyle = color;
    ctx.fillRect(95, y + 22, Math.round((890 * val) / 100), 40);
  });

  // Earned stamps
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 36px "Bebas Neue", Impact, sans-serif';
  ctx.fillText('EARNED SUBREDDIT STAMPS:', 95, 1435);

  const badges = summary.badges.length > 0 ? summary.badges.slice(0, 4) : ['Completed The Den Audition'];
  badges.forEach((badge, idx) => {
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`🏆 ${badge}`, 110, 1495 + idx * 54);
  });

  // Footer URL
  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(90, 1730, 900, 95);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`PASS THE VETTING TEST: ${publicUrl.replace(/^https?:\/\//, '')}`, 120, 1790);
}
