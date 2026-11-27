export interface ClubLevelSpec {
  level: 1 | 2 | 3 | 4 | 5;
  minXp: number;
  nextMinXp: number;
  title: string;
  badgeEmoji: string;
  perkSummary: string;
}

export const CLUB_PASSPORT_LEVELS: ClubLevelSpec[] = [
  {
    level: 1,
    minXp: 0,
    nextMinXp: 50,
    title: 'Club Newcomer',
    badgeEmoji: '🐣',
    perkSummary: '3 Friday Hearts & full free access to all 4 Club game modes.',
  },
  {
    level: 2,
    minXp: 50,
    nextMinXp: 130,
    title: 'Sharp Flirt & Vetter',
    badgeEmoji: '🍸',
    perkSummary: 'Unlocks Sharp Vetter Passport Seal & +5% icebreaker confidence in Sunset Hills.',
  },
  {
    level: 3,
    minXp: 130,
    nextMinXp: 230,
    title: 'Sunset Hills Regular',
    badgeEmoji: '🔥',
    perkSummary: 'Insider Lounge status, priority community case badge & veteran checklist rank.',
  },
  {
    level: 4,
    minXp: 230,
    nextMinXp: 350,
    title: '5-Star Heartthrob',
    badgeEmoji: '🐆',
    perkSummary: 'Mastered off-app cold approaches, red-flag radar & 5-Star date chemistry.',
  },
  {
    level: 5,
    minXp: 350,
    nextMinXp: 500,
    title: 'Crown Icon of the Club',
    badgeEmoji: '👑',
    perkSummary: 'Highest Sunset Hills honor: Hall-of-Fame Cougar & Cub Club Royalty.',
  },
];

const PASSPORT_META_STORAGE_KEY = 'cc_passport_meta_v1';

export interface PassportMetaState {
  bonusXp: number;
  awardedKeys: string[];
  streakDays: number;
  lastActiveDate: string;
  lastSeenLevel: number;
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayKey(): string {
  const d = new Date(Date.now() - 86_400_000);
  return d.toISOString().slice(0, 10);
}

export function loadPassportMeta(): PassportMetaState {
  const today = getTodayKey();
  const fallback: PassportMetaState = {
    bonusXp: 0,
    awardedKeys: [],
    streakDays: 1,
    lastActiveDate: today,
    lastSeenLevel: 1,
  };
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(PASSPORT_META_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(PASSPORT_META_STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw) as Partial<PassportMetaState>;
    let streakDays =
      typeof parsed.streakDays === 'number' && parsed.streakDays >= 1
        ? Math.floor(parsed.streakDays)
        : 1;
    const lastActive = typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : today;
    if (lastActive !== today) {
      streakDays = lastActive === getYesterdayKey() ? streakDays + 1 : 1;
    }
    const hydrated: PassportMetaState = {
      bonusXp:
        typeof parsed.bonusXp === 'number' && Number.isFinite(parsed.bonusXp)
          ? Math.max(0, Math.floor(parsed.bonusXp))
          : 0,
      awardedKeys: Array.isArray(parsed.awardedKeys)
        ? parsed.awardedKeys.filter((k): k is string => typeof k === 'string')
        : [],
      streakDays,
      lastActiveDate: today,
      lastSeenLevel:
        typeof parsed.lastSeenLevel === 'number' && parsed.lastSeenLevel >= 1
          ? Math.min(5, Math.floor(parsed.lastSeenLevel))
          : 1,
    };
    window.localStorage.setItem(PASSPORT_META_STORAGE_KEY, JSON.stringify(hydrated));
    return hydrated;
  } catch {
    return fallback;
  }
}

export function savePassportMeta(next: PassportMetaState): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(PASSPORT_META_STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // Ignore storage error
  }
}

export interface XpBurstEventDetail {
  id: number;
  amount: number;
  label: string;
  stampText?: string;
}

export const XP_BURST_EVENT = 'cc:xp-burst';

export function emitXpBurst(amount: number, label: string, stampText?: string): void {
  if (typeof window === 'undefined') return;
  const detail: XpBurstEventDetail = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    amount,
    label,
    stampText,
  };
  window.dispatchEvent(new CustomEvent<XpBurstEventDetail>(XP_BURST_EVENT, { detail }));
}

export function awardPassportBonusXp(
  uniqueKey: string,
  amount: number,
  label: string,
  stampText?: string,
): PassportMetaState {
  const current = loadPassportMeta();
  if (current.awardedKeys.includes(uniqueKey)) {
    if (stampText) emitXpBurst(0, label, stampText);
    return current;
  }
  const updated: PassportMetaState = {
    ...current,
    bonusXp: current.bonusXp + Math.max(0, amount),
    awardedKeys: [...current.awardedKeys, uniqueKey],
  };
  savePassportMeta(updated);
  emitXpBurst(amount, label, stampText);
  return updated;
}

export function resolvePassportLevel(totalXp: number): {
  spec: ClubLevelSpec;
  progressPct: number;
  xpIntoLevel: number;
  xpNeededForNext: number;
} {
  let active = CLUB_PASSPORT_LEVELS[0];
  for (const tier of CLUB_PASSPORT_LEVELS) {
    if (totalXp >= tier.minXp) {
      active = tier;
    }
  }
  if (active.level === 5) {
    return {
      spec: active,
      progressPct: 100,
      xpIntoLevel: totalXp - active.minXp,
      xpNeededForNext: 0,
    };
  }
  const span = Math.max(1, active.nextMinXp - active.minXp);
  const into = Math.max(0, totalXp - active.minXp);
  return {
    spec: active,
    progressPct: Math.max(6, Math.min(100, Math.round((into / span) * 100))),
    xpIntoLevel: into,
    xpNeededForNext: Math.max(0, active.nextMinXp - totalXp),
  };
}
