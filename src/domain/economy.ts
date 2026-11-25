import { MONETIZATION_CONFIG } from '../config/monetization';

export const WALLET_STORAGE_KEY = 'velvet_den_wallet_v1';

export interface WalletState {
  credits: number;
  lastRefillDate: string;
  isVip: boolean;
  isFounderUnlimited?: boolean;
  referralCode?: string;
  unlockedEpisodeIds: string[];
  claimedRewards: string[];
  unlockedStamps: string[];
}

export const SOCIAL_SHARE_QUEST_IDS = [
  'quest_groupchat_roast',
  'quest_x_threads_post',
  'quest_reddit_discord_drop',
] as const;

export const MAX_VERIFIED_REFERRAL_CLAIMS = 3;

function generateReferralCode(): string {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  let out = 'vd';
  for (let i = 0; i < 5; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

function toUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getDefaultStorage(): StorageLike | undefined {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // Private browsing or blocked storage
  }
  return undefined;
}

export function createDefaultWallet(now: Date = new Date()): WalletState {
  return {
    credits: MONETIZATION_CONFIG.dailyFreeCredits,
    lastRefillDate: toUtcDateKey(now),
    isVip: false,
    isFounderUnlimited: false,
    referralCode: generateReferralCode(),
    unlockedEpisodeIds: [],
    claimedRewards: [],
    unlockedStamps: ['puma', 'cougar'],
  };
}

export function loadWallet(storage?: StorageLike, now: Date = new Date()): WalletState {
  const store = storage ?? getDefaultStorage();
  const today = toUtcDateKey(now);

  if (!store) {
    return createDefaultWallet(now);
  }

  try {
    const raw = store.getItem(WALLET_STORAGE_KEY);
    if (!raw) {
      const fresh = createDefaultWallet(now);
      saveWallet(fresh, store);
      return fresh;
    }

    const parsed = JSON.parse(raw) as Partial<WalletState>;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof parsed.credits !== 'number' ||
      !Number.isFinite(parsed.credits)
    ) {
      const recovered = createDefaultWallet(now);
      saveWallet(recovered, store);
      return recovered;
    }

    const lastDate = typeof parsed.lastRefillDate === 'string' ? parsed.lastRefillDate : today;
    const credits =
      lastDate < today
        ? Math.max(parsed.credits, MONETIZATION_CONFIG.dailyFreeCredits)
        : Math.max(0, Math.floor(parsed.credits));

    const referralCode =
      typeof parsed.referralCode === 'string' && /^vd[a-z0-9]{4,8}$/.test(parsed.referralCode)
        ? parsed.referralCode
        : generateReferralCode();

    const normalized: WalletState = {
      credits,
      lastRefillDate: lastDate < today ? today : lastDate,
      isVip: Boolean(parsed.isVip),
      isFounderUnlimited: Boolean(parsed.isFounderUnlimited),
      referralCode,
      unlockedEpisodeIds: Array.isArray(parsed.unlockedEpisodeIds) ? parsed.unlockedEpisodeIds : [],
      claimedRewards: Array.isArray(parsed.claimedRewards) ? parsed.claimedRewards : [],
      unlockedStamps: Array.isArray(parsed.unlockedStamps)
        ? parsed.unlockedStamps
        : ['puma', 'cougar'],
    };

    if (lastDate < today || !parsed.referralCode) {
      saveWallet(normalized, store);
    }
    return normalized;
  } catch {
    const recovered = createDefaultWallet(now);
    saveWallet(recovered, store);
    return recovered;
  }
}

export function saveWallet(wallet: WalletState, storage?: StorageLike): void {
  const store = storage ?? getDefaultStorage();
  if (!store) return;
  try {
    store.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
  } catch {
    // Ignore QuotaExceededError in private mode
  }
}

export function spendCredits(
  wallet: WalletState,
  cost: number,
): { ok: boolean; wallet: WalletState } {
  if (wallet.isFounderUnlimited || cost <= 0) return { ok: true, wallet };
  if (wallet.credits < cost) {
    return { ok: false, wallet };
  }
  return {
    ok: true,
    wallet: {
      ...wallet,
      credits: wallet.credits - cost,
    },
  };
}

export function unlockEpisodeWithCredits(
  wallet: WalletState,
  episodeId: string,
  cost: number,
): { ok: boolean; wallet: WalletState } {
  if (
    wallet.isFounderUnlimited ||
    wallet.isVip ||
    wallet.unlockedEpisodeIds.includes(episodeId)
  ) {
    return {
      ok: true,
      wallet: wallet.unlockedEpisodeIds.includes(episodeId)
        ? wallet
        : { ...wallet, unlockedEpisodeIds: [...wallet.unlockedEpisodeIds, episodeId] },
    };
  }
  const spent = spendCredits(wallet, cost);
  if (!spent.ok) return spent;
  return {
    ok: true,
    wallet: {
      ...spent.wallet,
      unlockedEpisodeIds: [...spent.wallet.unlockedEpisodeIds, episodeId],
    },
  };
}

export function unlockStamp(wallet: WalletState, stampId: string): WalletState {
  if (wallet.unlockedStamps.includes(stampId)) return wallet;
  return {
    ...wallet,
    unlockedStamps: [...wallet.unlockedStamps, stampId],
  };
}

export function grantRewardCredits(
  wallet: WalletState,
  rewardKey: string,
  amount: number,
): { granted: boolean; wallet: WalletState } {
  if (!rewardKey || amount <= 0 || wallet.claimedRewards.includes(rewardKey)) {
    return { granted: false, wallet };
  }
  return {
    granted: true,
    wallet: {
      ...wallet,
      credits: wallet.credits + amount,
      claimedRewards: [...wallet.claimedRewards, rewardKey],
    },
  };
}

const FOUNDER_KEYS = new Set(['foundermode', 'sophia999', 'sudosoph', 'velvetfounder']);

export function applyUnlockCodeOrQuery(
  wallet: WalletState,
  codeOrSearch: string,
): { unlocked: 'vip' | 'credits' | 'founder' | null; wallet: WalletState } {
  const trimmed = codeOrSearch.trim();
  if (!trimmed) return { unlocked: null, wallet };

  if (trimmed.startsWith('?')) {
    const params = new URLSearchParams(trimmed);
    const founderParam = (params.get('founder') ?? '').trim().toLowerCase();
    if (
      founderParam === '1' ||
      founderParam === 'true' ||
      founderParam === 'sophia' ||
      FOUNDER_KEYS.has(founderParam)
    ) {
      return {
        unlocked: 'founder',
        wallet: {
          ...wallet,
          isVip: true,
          isFounderUnlimited: true,
          credits: Math.max(wallet.credits, 999),
        },
      };
    }

    // Only allow client-side ?unlock= preview parameters while sandboxPreviewMode is true!
    if (!MONETIZATION_CONFIG.sandboxPreviewMode) {
      return { unlocked: null, wallet };
    }

    const token = (params.get('unlock') ?? '').trim().toLowerCase();
    if (token === 'vip' || token === 'blackcard') {
      if (wallet.claimedRewards.includes(`stripe_${token}`)) {
        return { unlocked: 'vip', wallet: { ...wallet, isVip: true } };
      }
      return {
        unlocked: 'vip',
        wallet: {
          ...wallet,
          isVip: true,
          credits: wallet.credits + 10,
          claimedRewards: [...wallet.claimedRewards, `stripe_${token}`],
        },
      };
    }
    if (token === 'credits15') {
      const grant = grantRewardCredits(wallet, 'stripe_credits15_once', 15);
      return { unlocked: grant.granted ? 'credits' : null, wallet: grant.wallet };
    }
    return { unlocked: null, wallet };
  }

  const normalizedCode = trimmed.toLowerCase();
  if (FOUNDER_KEYS.has(normalizedCode)) {
    return {
      unlocked: 'founder',
      wallet: {
        ...wallet,
        isVip: true,
        isFounderUnlimited: true,
        credits: Math.max(wallet.credits, 999),
      },
    };
  }

  // Only accept public demo VIP codes while sandboxPreviewMode is enabled!
  if (!MONETIZATION_CONFIG.sandboxPreviewMode) {
    return { unlocked: null, wallet };
  }

  const upper = trimmed.toUpperCase();
  if (MONETIZATION_CONFIG.vipUnlockCodes.includes(upper)) {
    const rewardId = `code_${upper}`;
    const already = wallet.claimedRewards.includes(rewardId);
    return {
      unlocked: 'vip',
      wallet: {
        ...wallet,
        isVip: true,
        credits: already ? wallet.credits : wallet.credits + 10,
        claimedRewards: already ? wallet.claimedRewards : [...wallet.claimedRewards, rewardId],
      },
    };
  }

  return { unlocked: null, wallet };
}
