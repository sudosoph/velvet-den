export const ADVENTURE_STORAGE_KEY = 'cc_adventure_progress_v1';

export interface AdventureProgressState {
  xp: number;
  collectedItemIds: string[];
  defeatedGoblinIds: string[];
  solvedNodeIds: string[];
  bernedoodleAdopted: boolean;
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
  { minXp: 0, title: 'Fresh Out the Den', badgeEmoji: '🐣' },
  { minXp: 100, title: 'Poolside Charmer', badgeEmoji: '🍸' },
  { minXp: 240, title: 'Seed-Oil-Free Mommy’s Favorite', badgeEmoji: '🥑' },
  { minXp: 420, title: 'Tricolor Bernedoodle Co-Parent', badgeEmoji: '🐶' },
  { minXp: 650, title: 'Hall-of-Fame Club Legend', badgeEmoji: '👑' },
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
    return {
      xp: typeof parsed.xp === 'number' && Number.isFinite(parsed.xp) ? Math.max(0, parsed.xp) : 20,
      collectedItemIds: Array.isArray(parsed.collectedItemIds) ? parsed.collectedItemIds : [],
      defeatedGoblinIds: Array.isArray(parsed.defeatedGoblinIds) ? parsed.defeatedGoblinIds : [],
      solvedNodeIds: Array.isArray(parsed.solvedNodeIds) ? parsed.solvedNodeIds : [],
      bernedoodleAdopted: Boolean(parsed.bernedoodleAdopted),
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
  const next: AdventureProgressState = {
    ...prev,
    ...patch,
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
