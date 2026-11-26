export const ADVENTURE_STORAGE_KEY = 'cc_adventure_progress_v1';

export interface AdventureProgressState {
  xp: number;
  collectedItemIds: string[];
  defeatedGoblinIds: string[];
  solvedNodeIds: string[];
  companionAdopted: boolean;
  bernedoodleAdopted?: boolean;
  triviaIndex: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  badgeEmoji: string;
  nextThreshold: number;
  progressPct: number;
}

const LEVEL_TIERS: { minXp: number; title: string; badgeEmoji: string }[] = [
  { minXp: 0, title: 'Smoothie-Bar Nod Rookie', badgeEmoji: '🐣' },
  { minXp: 100, title: 'UV-Bouncer Survivor', badgeEmoji: '🪪' },
  { minXp: 240, title: 'Off-App Blue-Bubble Pro', badgeEmoji: '💬' },
  { minXp: 420, title: 'Certified Good Boy / Sanctuary Icon', badgeEmoji: '👑' },
  { minXp: 650, title: 'Cougars & Cubs Club Legend', badgeEmoji: '🐆' },
];

export function getLevelInfo(xp: number): LevelInfo {
  const safeXp = Math.max(0, Math.floor(xp));
  let idx = 0;
  for (let i = 0; i < LEVEL_TIERS.length; i += 1) {
    if (safeXp >= LEVEL_TIERS[i].minXp) idx = i;
  }
  const curr = LEVEL_TIERS[idx];
  const next = LEVEL_TIERS[idx + 1];
  if (!next) {
    return {
      level: idx + 1,
      title: curr.title,
      badgeEmoji: curr.badgeEmoji,
      nextThreshold: curr.minXp,
      progressPct: 100,
    };
  }
  const span = Math.max(1, next.minXp - curr.minXp);
  const progressPct = Math.min(100, Math.round(((safeXp - curr.minXp) / span) * 100));
  return {
    level: idx + 1,
    title: curr.title,
    badgeEmoji: curr.badgeEmoji,
    nextThreshold: next.minXp,
    progressPct,
  };
}

export function createDefaultAdventureProgress(): AdventureProgressState {
  return {
    xp: 20,
    collectedItemIds: [],
    defeatedGoblinIds: [],
    solvedNodeIds: [],
    companionAdopted: false,
    bernedoodleAdopted: false,
    triviaIndex: 0,
  };
}

export function loadAdventureProgress(): AdventureProgressState {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return createDefaultAdventureProgress();
    }
    const raw = window.localStorage.getItem(ADVENTURE_STORAGE_KEY);
    if (!raw) return createDefaultAdventureProgress();
    const parsed = JSON.parse(raw) as Partial<AdventureProgressState>;
    const adopted = Boolean(parsed.companionAdopted ?? parsed.bernedoodleAdopted);
    return {
      xp: typeof parsed.xp === 'number' && Number.isFinite(parsed.xp) ? Math.max(0, parsed.xp) : 20,
      collectedItemIds: Array.isArray(parsed.collectedItemIds) ? parsed.collectedItemIds : [],
      defeatedGoblinIds: Array.isArray(parsed.defeatedGoblinIds) ? parsed.defeatedGoblinIds : [],
      solvedNodeIds: Array.isArray(parsed.solvedNodeIds) ? parsed.solvedNodeIds : [],
      companionAdopted: adopted,
      bernedoodleAdopted: adopted,
      triviaIndex: typeof parsed.triviaIndex === 'number' ? parsed.triviaIndex : 0,
    };
  } catch {
    return createDefaultAdventureProgress();
  }
}

export function saveAdventureProgress(state: AdventureProgressState): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(ADVENTURE_STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // Ignore storage quota / private mode
  }
}

export function grantAdventureXp(
  prev: AdventureProgressState,
  deltaXp: number,
  patch?: Partial<AdventureProgressState>,
): { next: AdventureProgressState; leveledUp: boolean; levelInfo: LevelInfo } {
  const prevLvl = getLevelInfo(prev.xp).level;
  const nextAdopted =
    patch?.companionAdopted ?? patch?.bernedoodleAdopted ?? prev.companionAdopted;
  const next: AdventureProgressState = {
    ...prev,
    ...patch,
    companionAdopted: nextAdopted,
    bernedoodleAdopted: nextAdopted,
    xp: Math.max(0, prev.xp + deltaXp),
  };
  const levelInfo = getLevelInfo(next.xp);
  saveAdventureProgress(next);
  return {
    next,
    leveledUp: levelInfo.level > prevLvl,
    levelInfo,
  };
}
