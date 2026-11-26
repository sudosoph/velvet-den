import { HER_ARCHETYPES, HIS_ARCHETYPES } from './taxonomy';

export const DATEODEX_STORAGE_KEY = 'cc_dateodex_v1';

export type DateodexVerdict = 'crowned' | 'friendzoned' | 'dumped';
export type DateLetterRank = 'S' | 'A' | 'B' | 'C' | 'F';

export interface DateodexStamp {
  characterId: string;
  verdict: DateodexVerdict;
  rank: DateLetterRank;
  note: string;
  updatedAt: string;
}

export interface PolaroidSpec {
  id: string;
  title: string;
  caption: string;
  unlockHint: string;
  imageUrl: string;
  rotationClass: string;
}

export interface DateodexState {
  stamps: Record<string, DateodexStamp>;
  unlockedPolaroidIds: string[];
  courtVotesCast: number;
}

export const CLUB_POLAROIDS: PolaroidSpec[] = [
  {
    id: 'polaroid-obedience-s',
    title: 'Certified Good Boy™ Graduation',
    caption: 'Zero Cubsplaining, off-leash heel mastered & ribeye treat earned.',
    unlockHint: 'Graduate a Cub in the 2D PixiJS Obedience Sim',
    imageUrl: './images/cast/dog-park-picnic.jpg',
    rotationClass: '-rotate-1',
  },
  {
    id: 'polaroid-sanctuary-scan',
    title: '4-Pillow Percale Sanctuary',
    caption: 'Lidded trash bin, bergamot soap & zero $41.63 split-tab drafts.',
    unlockHint: 'Clear all 5 hazards in the 2D Apartment Red-Flag Scanner',
    imageUrl: './images/scenes/luxury-bedroom-sanctuary.jpg',
    rotationClass: 'rotate-1',
  },
  {
    id: 'polaroid-coastal-sunset',
    title: 'PCH Golden-Hour Convertible',
    caption: 'Peonies on the passenger seat & 80+ Chemistry unlocked.',
    unlockHint: 'Finish a Date Run with 75+ Chemistry',
    imageUrl: './images/scenes/coastal-convertible.jpg',
    rotationClass: '-rotate-1',
  },
  {
    id: 'polaroid-kitchen-apron',
    title: 'Sunday Cast-Iron & Linen Apron',
    caption: 'Cast-iron ribeye sizzling, kitchen spotless before Monday.',
    unlockHint: 'Complete your first Date Run',
    imageUrl: './images/scenes/sunday-kitchen-sanctuary.jpg',
    rotationClass: 'rotate-1',
  },
  {
    id: 'polaroid-cedar-sauna',
    title: 'Midnight Hotel Pool & Sauna',
    caption: 'The Club Courtroom ruled unanimously: Crown Him.',
    unlockHint: 'Vote on 3 cases in Crown Him or Dump Him Courtroom',
    imageUrl: './images/scenes/hotel-pool-sauna.jpg',
    rotationClass: '-rotate-1',
  },
  {
    id: 'polaroid-cabana-club',
    title: 'Palm Springs VIP Cabana Club',
    caption: '5+ Roster legends vetted in your Club Dateodex.',
    unlockHint: 'Collect 4+ character stamps in your Dateodex',
    imageUrl: './images/scenes/palm-springs-resort.jpg',
    rotationClass: 'rotate-1',
  },
];

export function computeDateLetterRank(scoreAvg: number, busted = false): DateLetterRank {
  if (busted) return 'F';
  if (scoreAvg < 48) return 'C';
  if (scoreAvg >= 82) return 'S';
  if (scoreAvg >= 68) return 'A';
  return 'B';
}

export function computeDateodexVerdict(scoreAvg: number, busted = false): DateodexVerdict {
  if (busted || scoreAvg < 48) return 'dumped';
  if (scoreAvg >= 66) return 'crowned';
  return 'friendzoned';
}

export function createDefaultDateodex(): DateodexState {
  return {
    stamps: {},
    unlockedPolaroidIds: [],
    courtVotesCast: 0,
  };
}

export function loadDateodex(): DateodexState {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return createDefaultDateodex();
    }
    const raw = window.localStorage.getItem(DATEODEX_STORAGE_KEY);
    if (!raw) return createDefaultDateodex();
    const parsed = JSON.parse(raw) as Partial<DateodexState>;
    return {
      stamps: parsed.stamps && typeof parsed.stamps === 'object' ? parsed.stamps : {},
      unlockedPolaroidIds: Array.isArray(parsed.unlockedPolaroidIds)
        ? parsed.unlockedPolaroidIds
        : [],
      courtVotesCast: typeof parsed.courtVotesCast === 'number' ? parsed.courtVotesCast : 0,
    };
  } catch {
    return createDefaultDateodex();
  }
}

export function saveDateodex(state: DateodexState): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(DATEODEX_STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // Ignore private-mode storage errors
  }
}

export function stampDateodexCharacters(
  prev: DateodexState,
  entries: { characterId: string; verdict: DateodexVerdict; rank: DateLetterRank; note: string }[],
  extraPolaroidIds: string[] = [],
): DateodexState {
  const nextStamps = { ...prev.stamps };
  const now = new Date().toISOString();

  for (const item of entries) {
    const existing = nextStamps[item.characterId];
    const rankOrder: Record<DateLetterRank, number> = { S: 5, A: 4, B: 3, C: 2, F: 1 };
    if (!existing || rankOrder[item.rank] >= rankOrder[existing.rank]) {
      nextStamps[item.characterId] = {
        characterId: item.characterId,
        verdict: item.verdict,
        rank: item.rank,
        note: item.note,
        updatedAt: now,
      };
    }
  }

  const unlockedSet = new Set([...prev.unlockedPolaroidIds, ...extraPolaroidIds]);
  if (Object.keys(nextStamps).length >= 4) {
    unlockedSet.add('polaroid-cabana-club');
  }

  const next: DateodexState = {
    ...prev,
    stamps: nextStamps,
    unlockedPolaroidIds: Array.from(unlockedSet),
  };
  saveDateodex(next);
  return next;
}

export function unlockDateodexPolaroid(prev: DateodexState, polaroidId: string): DateodexState {
  if (prev.unlockedPolaroidIds.includes(polaroidId)) return prev;
  const next: DateodexState = {
    ...prev,
    unlockedPolaroidIds: [...prev.unlockedPolaroidIds, polaroidId],
  };
  saveDateodex(next);
  return next;
}

export function recordDateodexCourtVote(prev: DateodexState): DateodexState {
  const count = prev.courtVotesCast + 1;
  const unlocked = new Set(prev.unlockedPolaroidIds);
  if (count >= 3) {
    unlocked.add('polaroid-cedar-sauna');
  }
  const next: DateodexState = {
    ...prev,
    courtVotesCast: count,
    unlockedPolaroidIds: Array.from(unlocked),
  };
  saveDateodex(next);
  return next;
}

export function getTotalRosterCount(): number {
  return HER_ARCHETYPES.length + HIS_ARCHETYPES.length;
}
