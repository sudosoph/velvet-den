import type { analyzePairing, PlayerRole } from '../domain/taxonomy';

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

export interface RunSummary {
  pairing: ReturnType<typeof analyzePairing>;
  overallScore: number;
  rankTitle: string;
  redFlags: number;
  caughtBottleTrap?: boolean;
  stats: {
    maturity: number;
    chivalry: number;
    eq: number;
    chemistry: number;
  };
  badges: string[];
  episodeHighlights: { emoji: string; title: string }[];
}

export interface AuditionScenario {
  id: string;
  title: string;
  setupHer: string;
  setupHim: string;
  choices: {
    labelHer: string;
    labelHim: string;
    isRedFlag?: boolean;
  }[];
}

export const V35_AUDITION_SCENARIOS: AuditionScenario[] = [
  {
    id: 'check-drop',
    title: 'The Friday Tapas Check Drop',
    setupHer:
      'First-date leather checkbook lands between two empty espresso martini coupes. He knows you run a forty-person department. How should this moment go?',
    setupHim:
      'The leather checkbook lands on the marble table at 8:45 PM. She earns three times your salary, and you invited her out. Your move?',
    choices: [
      {
        labelHer: 'He picks up the check cleanly with zero awkward speech; I get our nightcap round next door.',
        labelHim: 'Pick up the check cleanly with a warm smile, you invited her out, zero speeches.',
      },
      {
        labelHer: 'We split down the middle effortlessly and plan Sunday brunch before standing up.',
        labelHim: 'Offer cleanly first, and if she insists on splitting, thank her warmly and lock in Date #2.',
      },
      {
        labelHer: 'He taps the folder and jokes about putting it on my corporate card.',
        labelHim: 'Joke about putting dinner on her corporate expense card since she is the boss.',
        isRedFlag: true,
      },
    ],
  },
  {
    id: 'velvet-room',
    title: '6:30 PM at The Velvet Room Hotel Bar',
    setupHer:
      'You are unwinding solo at the brass hotel bar when a sharp 27-year-old two stools down catches your eye. What opening wins you over?',
    setupHim:
      'She is reading a hardcover menu over a chilled dirty martini at The Velvet Room. How do you bridge the two-stool gap?',
    choices: [
      {
        labelHer: 'Specific observation, dry humor, and offering his real number with zero hovering.',
        labelHim: 'Make one observant, unhurried remark, make her laugh, and let her set the pace.',
      },
      {
        labelHer: 'Sending over a splash of sparkling water and asking my favorite neighborhood spot.',
        labelHim: 'Ask the bartender for her recommendation before introducing yourself.',
      },
      {
        labelHer: 'Opening with "You look incredible for your age, never been with a cougar before!"',
        labelHim: 'Tell her she looks amazing for her age and mention your bucket list.',
        isRedFlag: true,
      },
    ],
  },
  {
    id: 'waiter-son-incident',
    title: 'The Clueless Host Stand Moment',
    setupHer:
      'A nervous nineteen-year-old host glances up from the iPad and blurts out: "Table for you and your son tonight?"',
    setupHim:
      'The teenage host panics at the podium and asks her: "Just a table for you and your son tonight?" All eyes flick to you.',
    choices: [
      {
        labelHer: 'He slips his hand onto my lower back, grins unbothered, and says "Corner booth for my date, please."',
        labelHim: 'Hold her hand warmly, smile without flinching, and ask for the quiet corner booth for two.',
      },
      {
        labelHer: 'We both burst out laughing together before the host finishes turning red.',
        labelHim: 'Share an amused look with her so the whole moment turns into your private inside joke.',
      },
      {
        labelHer: 'He drops my hand, steps two feet sideways, and stares at his shoes in silence.',
        labelHim: 'Drop her hand and mutter awkwardly while staring at the floor.',
        isRedFlag: true,
      },
    ],
  },
  {
    id: 'code-switch-texting',
    title: 'The Generational Texting Test',
    setupHer:
      'You match on Tuesday afternoon during back-to-back client meetings. What message makes you actually excited for Friday?',
    setupHim:
      'You match on Tuesday afternoon while she is leading meetings. How do you move from app banter to a real Friday date?',
    choices: [
      {
        labelHer: 'Real phone number + two concrete neighborhood spots for Friday at 7:30 PM.',
        labelHim: 'Offer your real cell number and propose a specific Friday 7:30 PM neighborhood reservation.',
      },
      {
        labelHer: 'A quick 6 PM voice call check-in on Thursday so I know reservations are handled.',
        labelHim: 'Confirm Thursday afternoon that the corner table is booked so she can relax.',
      },
      {
        labelHer: '"wyd tn?? drop ur snap"',
        labelHim: 'Ask for her Snapchat and send "u up??" at 11:40 PM.',
        isRedFlag: true,
      },
    ],
  },
  {
    id: 'hawthorne-campus',
    title: 'Autumn Quad & Omakase Boundaries',
    setupHer:
      'Chemistry sparks offline, but timing requires patience and discretion for two weeks. How does a grown partner handle a boundary?',
    setupHim:
      'She sets a clear two-week boundary before your first off-campus sushi dinner. How do you respond?',
    choices: [
      {
        labelHer: 'Zero pouting, zero double-texting, he books the 7:30 counter for the exact evening the window opens.',
        labelHim: 'Respect her timeline 100% and show up with a locked 7:30 omakase reservation when the window opens.',
      },
      {
        labelHer: 'Light, unhurried banter once or twice a week with zero pressure.',
        labelHim: 'Keep communication warm, calm, and completely pressure-free.',
      },
      {
        labelHer: 'Pushing to bend her professional rules tonight to "prove the spark is real."',
        labelHim: 'Guilt-trip her into breaking her boundary early.',
        isRedFlag: true,
      },
    ],
  },
  {
    id: 'trail-run-short-leash',
    title: 'The 6:30 AM Saturday Sanity Check',
    setupHer:
      'Saturday morning arrives after Friday cocktails: farmers market espresso and a coastal walk are on deck.',
    setupHim:
      'You bragged about your twenty-something stamina all week, and her alarm goes off for an 8 AM coastal ridge walk.',
    choices: [
      {
        labelHer: 'Up with two iced oat cortados in hand, sunglasses ready, zero complaints.',
        labelHim: 'Bring two coffees to the passenger seat ten minutes early and match her stride.',
      },
      {
        labelHer: 'Cooking eggs and sourdough back at the kitchen counter right after the walk.',
        labelHim: 'Prep post-walk breakfast and wash every pan before noon.',
      },
      {
        labelHer: 'Groaning until 1:30 PM while scrolling reels at max volume in bed.',
        labelHim: 'Sleep through noon and ask what she is making you for lunch.',
        isRedFlag: true,
      },
    ],
  },
  {
    id: 'mirror-game-insecurities',
    title: 'Bright Sunday Morning Kitchen Light',
    setupHer:
      'Sunlight pours across the marble counter at 8 AM, zero candlelight, messy hair, oversized linen shirt.',
    setupHim:
      'Bright Sunday morning kitchen light, she glances in the hallway mirror before coffee.',
    choices: [
      {
        labelHer: 'Pulls me in by the waist over coffee and looks at me like I am the only woman on earth, never saying "for your age."',
        labelHim: 'Kiss her shoulder with genuine awe and zero backhanded "for your age" qualifiers.',
      },
      {
        labelHer: 'Hands me my exact coffee order and asks what record we are spinning.',
        labelHim: 'Pour her coffee how she likes it and keep the morning unhurried.',
      },
      {
        labelHer: 'Making a weird backhanded age joke before coffee has even brewed.',
        labelHim: 'Drop a clumsy age-comparison joke.',
        isRedFlag: true,
      },
    ],
  },
  {
    id: 'princess-soft-life',
    title: 'Turning Off Her Executive Brain at 7:30 PM',
    setupHer:
      'After fifty decisions at work, Friday at 7:30 PM arrives. What makes you melt immediately?',
    setupHim:
      'She makes high-stakes decisions from Monday to Friday at 6 PM. How do you run Friday night?',
    choices: [
      {
        labelHer: 'Reservation confirmed Tuesday, car door opened, zero "idk where do u wanna go" texts.',
        labelHim: 'Book the booth Tuesday, handle parking, and let her turn off decision mode completely.',
      },
      {
        labelHer: 'Home-cooked Sunday pasta in a clean apartment with a lidded bathroom bin and four real pillows.',
        labelHim: 'Cook from scratch in a spotless apartment with crisp cotton sheets and warm lamp lighting.',
      },
      {
        labelHer: 'Texting at 7:15 PM: "idk what are u in the mood for, can u book something?"',
        labelHim: 'Dump the entire Friday planning load back onto her at 7:15 PM.',
        isRedFlag: true,
      },
    ],
  },
];

export function findAuditionScenario(id: string): AuditionScenario | undefined {
  return V35_AUDITION_SCENARIOS.find((s) => s.id === id);
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
    const ep = findAuditionScenario(payload.episodeIds[i]);
    const title = ep ? ep.title : `Scenario ${i + 1}`;
    const expected = payload.preferredChoiceIndices[i];
    const actual = partnerChoiceIndices[i];

    if (actual === expected) {
      alignedCount += 1;
      roastNotes.push(`💚 ${title}: Exact wavelength match with ${payload.senderName}!`);
    } else {
      const pickedChoice = ep?.choices[actual];
      const isRedFlag = Boolean(pickedChoice?.isRedFlag);
      roastNotes.push(
        isRedFlag
          ? `🚩 ${title}: Triggered ${payload.senderName}’s dealbreaker alarm!`
          : `👀 ${title}: Different instinct than ${payload.senderName}, worth debating over drinks.`,
      );
    }
  }

  const matchPercent = total > 0 ? Math.round((alignedCount / total) * 100) : 0;

  let verdictTitle: string;
  if (matchPercent >= 80) {
    verdictTitle = 'S-RANK LINEN-APRON & CORNER-BOOTH CERTIFIED MATCH';
  } else if (matchPercent >= 60) {
    verdictTitle = 'STRONG CHEMISTRY. ONE TRAINING DATE NEEDED';
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
    ? '📱 App Audit: 🔍 Caught the 2 AM Mirror Tell'
    : '📱 App Audit: ⚡ Survived Velvet Palms Vetting';

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
    `### 🐆 **COUGARS & CUBS CLUB, ${summary.overallScore}% VIBE MATCH**`,
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

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#FFF5EC');
  bg.addColorStop(0.5, '#FFE8F0');
  bg.addColorStop(1, '#FFF3D6');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  drawRoundedPanel(ctx, 44, 44, W - 88, H - 88, 48, {
    fill: '#FFFDF9',
    stroke: '#1E1022',
    lineWidth: 6,
  });

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
