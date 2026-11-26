import {
  getHingeExtendedProfile,
  HER_ARCHETYPES,
  HIS_ARCHETYPES,
  type HerArchetype,
  type HisArchetype,
  type PlayerRole,
} from './taxonomy';
import type { Stats } from './gameEngine';

export type RelationshipStats = Stats;

export const MATCH_CAREER_STORAGE_KEY = 'velvet_match_career_v34';

export interface VelvetDadbookProfile {
  fridayVibe: 'candlelit_bistro' | 'home_cooking' | 'spontaneous_escape';
  polarityStyle: 'princess_romance' | 'soft_good_boy' | 'witty_equal';
  dealbreaker: 'snapchat_streaks' | 'venmo_math' | 'bucket_list_tourists';
}

export interface MatchCareerState {
  dadbook: VelvetDadbookProfile;
  dadbookCompleted: boolean;
  swipedIds: string[];
  matchedIds: string[];
  superLikedIds: string[];
  unmatchedIds: string[];
  rehabbedIds: string[];
  unlockedImessageIds: string[];
  memoryBonusClaimedIds: string[];
  dateStageByMatchId: Record<string, 0 | 1 | 2 | 3>;
  statsByMatchId: Record<string, RelationshipStats>;
}

export function createDefaultMatchCareer(): MatchCareerState {
  return {
    dadbook: {
      fridayVibe: 'candlelit_bistro',
      polarityStyle: 'witty_equal',
      dealbreaker: 'snapchat_streaks',
    },
    dadbookCompleted: false,
    swipedIds: [],
    matchedIds: [],
    superLikedIds: [],
    unmatchedIds: [],
    rehabbedIds: [],
    unlockedImessageIds: [],
    memoryBonusClaimedIds: [],
    dateStageByMatchId: {},
    statsByMatchId: {},
  };
}

let memoryCareerFallback: MatchCareerState | null = null;

export function loadMatchCareer(): MatchCareerState {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(MATCH_CAREER_STORAGE_KEY);
      if (!raw) return createDefaultMatchCareer();
      const parsed = JSON.parse(raw) as Partial<MatchCareerState>;
      const defaults = createDefaultMatchCareer();
      return {
        dadbook: {
          fridayVibe: parsed.dadbook?.fridayVibe ?? defaults.dadbook.fridayVibe,
          polarityStyle: parsed.dadbook?.polarityStyle ?? defaults.dadbook.polarityStyle,
          dealbreaker: parsed.dadbook?.dealbreaker ?? defaults.dadbook.dealbreaker,
        },
        dadbookCompleted: Boolean(parsed.dadbookCompleted),
        swipedIds: Array.isArray(parsed.swipedIds) ? parsed.swipedIds : [],
        matchedIds: Array.isArray(parsed.matchedIds) ? parsed.matchedIds : [],
        superLikedIds: Array.isArray(parsed.superLikedIds) ? parsed.superLikedIds : [],
        unmatchedIds: Array.isArray(parsed.unmatchedIds) ? parsed.unmatchedIds : [],
        rehabbedIds: Array.isArray(parsed.rehabbedIds) ? parsed.rehabbedIds : [],
        unlockedImessageIds: Array.isArray(parsed.unlockedImessageIds)
          ? parsed.unlockedImessageIds
          : [],
        memoryBonusClaimedIds: Array.isArray(parsed.memoryBonusClaimedIds)
          ? parsed.memoryBonusClaimedIds
          : [],
        dateStageByMatchId:
          parsed.dateStageByMatchId && typeof parsed.dateStageByMatchId === 'object'
            ? parsed.dateStageByMatchId
            : {},
        statsByMatchId:
          parsed.statsByMatchId && typeof parsed.statsByMatchId === 'object'
            ? parsed.statsByMatchId
            : {},
      };
    }
  } catch {
    // Fall back cleanly
  }
  return memoryCareerFallback ? { ...memoryCareerFallback } : createDefaultMatchCareer();
}

export function saveMatchCareer(state: MatchCareerState): void {
  memoryCareerFallback = state;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(MATCH_CAREER_STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // Ignore private-mode quota error
  }
}

export function ensureStarterMatchForRole(
  state: MatchCareerState,
  playerRole: PlayerRole,
): MatchCareerState {
  const pool = playerRole === 'her' ? HIS_ARCHETYPES : HER_ARCHETYPES;
  const validIds = new Set(pool.map((p) => p.id));
  const hasRoleMatch = state.matchedIds.some((id) => validIds.has(id));
  if (hasRoleMatch) return state;

  const starterId = playerRole === 'her' ? 'leo-golden-cub' : 'claire-cougar-exec';
  const next: MatchCareerState = {
    ...state,
    matchedIds: [...state.matchedIds, starterId],
    dateStageByMatchId: {
      ...state.dateStageByMatchId,
      [starterId]: state.dateStageByMatchId[starterId] ?? 0,
    },
  };
  saveMatchCareer(next);
  return next;
}

export function checkProfileMemoryHit(
  person: HerArchetype | HisArchetype,
  playerText: string,
): { hit: boolean; bonusLine: string } {
  const ext = getHingeExtendedProfile(person);
  const lower = playerText.toLowerCase();
  const candidates = new Set<string>([ext.memoryKeyword.toLowerCase()]);
  if ('petName' in person && person.petName) {
    const petFirst = person.petName.split(/\s+/)[0].replace(/[^a-z0-9]/gi, '').toLowerCase();
    if (petFirst.length >= 3) candidates.add(petFirst);
  }
  for (const kw of candidates) {
    if (kw.length >= 3 && lower.includes(kw)) {
      return {
        hit: true,
        bonusLine: ext.memoryRewardLine,
      };
    }
  }
  return { hit: false, bonusLine: '' };
}
