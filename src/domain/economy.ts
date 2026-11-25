import { MONETIZATION_CONFIG } from '../config/monetization';

export const WALLET_STORAGE_KEY = 'velvet_den_wallet_v1';

/**
 * Salted SHA-256 digest of the Founder passphrase.
 * Plaintext password is NEVER stored in client or repository source.
 */
export const FOUNDER_SALT = 'cc_founder_v1:';
export const FOUNDER_SHA256_HEX =
  '6db6ba6ecc5e83f90d1678b2dc636713c7583ac9cdf51b92c10b26c0c9d36dac';
const FOUNDER_SESSION_PROOF = FOUNDER_SHA256_HEX.slice(0, 24);

export interface WalletState {
  credits: number;
  lastRefillDate: string;
  isVip: boolean;
  isFounderUnlimited?: boolean;
  founderSessionToken?: string;
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

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyFounderPassphrase(passphrase: string): Promise<boolean> {
  const trimmed = passphrase.trim();
  if (trimmed.length < 12) return false;
  try {
    const hash = await sha256Hex(`${FOUNDER_SALT}${trimmed}`);
    return constantTimeEquals(hash, FOUNDER_SHA256_HEX);
  } catch {
    return false;
  }
}

export function grantFounderAccess(wallet: WalletState): WalletState {
  return {
    ...wallet,
    isVip: true,
    isFounderUnlimited: true,
    founderSessionToken: FOUNDER_SESSION_PROOF,
    credits: Math.max(wallet.credits, 999),
  };
}

export function revokeFounderAccess(wallet: WalletState): WalletState {
  return {
    ...wallet,
    isFounderUnlimited: false,
    founderSessionToken: undefined,
    credits: MONETIZATION_CONFIG.dailyFreeCredits,
  };
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

    const verifiedFounder =
      Boolean(parsed.isFounderUnlimited) &&
      parsed.founderSessionToken === FOUNDER_SESSION_PROOF;

    const normalized: WalletState = {
      credits,
      lastRefillDate: lastDate < today ? today : lastDate,
      isVip: Boolean(parsed.isVip),
      isFounderUnlimited: verifiedFounder,
      founderSessionToken: verifiedFounder ? FOUNDER_SESSION_PROOF : undefined,
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

/**
 * Synchronous promo/sandbox unlock handler.
 * NOTE: Founder Mode is strictly blocked from URL query strings (?founder=1) and
 * plaintext codes; it requires cryptographic passphrase verification via
 * `verifyFounderPassphrase` / `/api/founder-auth`.
 */
export function applyUnlockCodeOrQuery(
  wallet: WalletState,
  codeOrSearch: string,
): { unlocked: 'vip' | 'credits' | null; wallet: WalletState } {
  const trimmed = codeOrSearch.trim();
  if (!trimmed) return { unlocked: null, wallet };

  if (trimmed.startsWith('?')) {
    if (!MONETIZATION_CONFIG.sandboxPreviewMode) {
      return { unlocked: null, wallet };
    }

    const params = new URLSearchParams(trimmed);
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
