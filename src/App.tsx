import React, { useEffect, useMemo, useState } from 'react';
import { Check, Lock, ShieldCheck, Wrench, X } from 'lucide-react';
import { BRAND_CONFIG } from './config/brand';
import { MONETIZATION_CONFIG } from './config/monetization';
import { AboutClubView } from './components/AboutClubView';
import {
  BoutiqueAndVipModal,
  type BoutiqueSectionTab,
} from './components/BoutiqueAndVipModal';
import {
  CampaignCompassBar,
  computeCampaignProgress,
} from './components/CampaignCompassBar';
import {
  type ActiveMatchThread,
  ChatsAndDatesView,
  createInitialThread,
} from './components/ChatsAndDatesView';
import { ClubCourtroomView } from './components/ClubCourtroomView';
import { ClubPassportOverlay } from './components/ClubPassportOverlay';
import { CougarCubChecklistModal } from './components/CougarCubChecklistModal';
import { CouplesBlindSyncModal } from './components/CouplesBlindSyncModal';
import { CubSchoolView } from './components/CubSchoolView';
import { DateodexModal } from './components/DateodexModal';
import { FieldGuideModal } from './components/FieldGuideModal';
import { HingeFeedView } from './components/HingeFeedView';
import { InTheWildMapView } from './components/InTheWildMapView';
import { LiveIncomingTextBanner } from './components/LiveIncomingTextBanner';
import { PartnerAuditionView } from './components/PartnerAuditionView';
import { PopCultureTriviaModal } from './components/PopCultureTriviaModal';
import { RoastAndWingwomanModal } from './components/RoastAndWingwomanModal';
import { TopHudBar, type ClubTopTab } from './components/TopHudBar';
import { VelvetJournalView } from './components/VelvetJournalView';
import { getCastProfileById, V35_CAST_PROFILES } from './data/v35Cast';
import { V35_WILD_VENUES } from './data/v35WildVenues';
import {
  loadDateodex,
  recordDateodexCourtVote,
  stampDateodexCharacters,
  unlockDateodexPolaroid,
  type DateodexState,
} from './domain/dateodex';
import {
  addConspiracyClue,
  applyUnlockCodeOrQuery,
  getPersonaVibeSpec,
  grantFounderAccess,
  grantPatronBadge,
  grantRewardCredits,
  loadWallet,
  loseFridayHeart,
  PERSONA_VIBE_SPECS,
  recordBulletDodged,
  resetFridayHearts,
  restoreVerifiedVip,
  revokeFounderAccess,
  saveWallet,
  spendCredits,
  unlockContentWithCredits,
  unlockStamp,
  updatePlayerPersona,
  verifyFounderPassphrase,
  type WalletState,
} from './domain/economy';
import type { PlayerRole } from './domain/taxonomy';
import { trackEvent } from './lib/analytics';
import {
  emitXpBurst,
  loadPassportMeta,
  resolvePassportLevel,
  XP_BURST_EVENT,
} from './lib/gamification';
import {
  decodeChallengeParam,
  encodeChallengeLink,
  shareOrCopy,
  type ChallengePayload,
} from './lib/viral';
import {
  recordIncomingReferralHit,
  verifyStripeCheckoutSession,
} from './services/adapters';

const FOUNDER_DEVICE_SEAL_KEY = 'cc_founder_device_seal_v2';
const SIM_STORAGE_KEY = 'velvet_sim_state_v35';

interface PersistedSimState {
  threads: ActiveMatchThread[];
  cutLooseIds: string[];
  completedCameoVenues: string[];
  completedWildVenues?: string[];
  cubSchoolStars: number;
}

function loadSimState(): PersistedSimState {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {
        threads: [],
        cutLooseIds: [],
        completedCameoVenues: [],
        completedWildVenues: [],
        cubSchoolStars: 0,
      };
    }
    const raw = window.localStorage.getItem(SIM_STORAGE_KEY);
    if (!raw) {
      return {
        threads: [],
        cutLooseIds: [],
        completedCameoVenues: [],
        completedWildVenues: [],
        cubSchoolStars: 0,
      };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedSimState>;
    const threads = Array.isArray(parsed.threads) ? parsed.threads : [];
    const seededWild = threads
      .filter((t) => Boolean(t.originVenueId))
      .map((t) => t.originVenueId as string);
    const savedWild = Array.isArray(parsed.completedWildVenues) ? parsed.completedWildVenues : [];
    return {
      threads,
      cutLooseIds: Array.isArray(parsed.cutLooseIds) ? parsed.cutLooseIds : [],
      completedCameoVenues: Array.isArray(parsed.completedCameoVenues)
        ? parsed.completedCameoVenues
        : [],
      completedWildVenues: Array.from(new Set([...seededWild, ...savedWild])),
      cubSchoolStars:
        typeof parsed.cubSchoolStars === 'number' && Number.isFinite(parsed.cubSchoolStars)
          ? Math.max(0, Math.min(12, Math.floor(parsed.cubSchoolStars)))
          : 0,
    };
  } catch {
    return {
      threads: [],
      cutLooseIds: [],
      completedCameoVenues: [],
      completedWildVenues: [],
      cubSchoolStars: 0,
    };
  }
}

function saveSimState(state: PersistedSimState): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(SIM_STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // Ignore storage block
  }
}

const DILEMMA_SLUG_TO_VENUE: Record<string, string> = {
  'campus-stroll-sushi-professor-student': 'hawthorne-campus',
  'check-drop': 'velvet-room',
  'waiter-son-incident': 'velvet-room',
  'babygirl-hotel-bar-milk-or-martini': 'velvet-room',
  'mirror-game-insecurities': 'velvet-palms-bbq',
  'pop-culture-cougar-renaissance': 'velvet-room',
  'fiery-foreign-cougar-passion-test': 'havana-salsa',
  'black-cat-pushback-golden-retriever-test': 'velvet-room',
  'vip-apartment-soap-audit': 'velvet-palms-bbq',
  'grown-son-same-age-collision': 'velvet-palms-bbq',
  'milestone-six-month-anniversary': 'cougarmarket',
  'princess-soft-life': 'terminal-b-airport',
  'spontaneous-18h-pool-sauna-getaway': 'dawn-lap-pool',
  'cougar-perimenopause-surge-nightsweats': 'dawn-lap-pool',
  'gym-headphones-vs-three-week-nod': 'palisades-racquet',
  'cubsplaining-and-bouncer-id-check': 'velvet-room',
  'code-switch-texting': 'left-bank-books',
  'junior-cougar-gatekeeper-tease': 'left-bank-books',
  'trail-run-short-leash': 'palisades-racquet',
  'babysitter-flake-test': 'st-jude-coffee',
  'houseboy-sunday-sanctuary': 'velvet-palms-bbq',
  'fertility-kids-crossroads': 'dawn-lap-pool',
  'vip-palm-springs-income-gap': 'palisades-racquet',
  'vip-thanksgiving-double-boss': 'velvet-palms-bbq',
  'vip-trader-joes-wild-approach': 'cougarmarket',
  'adult-kid-brunch': 'st-jude-coffee',
  'hotel-checkin-two-queen-beds-mixup': 'velvet-room',
};

export function resolveDilemmaRoute(slug: string | null): {
  tab: ClubTopTab;
  venueId?: string;
  roleOverride?: PlayerRole;
} | null {
  if (!slug) return null;
  const clean = slug.trim();
  if (!clean) return null;

  if (clean === 'connor-bottle-trap') {
    return { tab: 'hinge', roleOverride: 'her' };
  }

  if (V35_WILD_VENUES.some((v) => v.id === clean)) {
    return { tab: 'wild', venueId: clean };
  }

  if (DILEMMA_SLUG_TO_VENUE[clean]) {
    return {
      tab: 'wild',
      venueId: DILEMMA_SLUG_TO_VENUE[clean],
      roleOverride:
        clean === 'campus-stroll-sushi-professor-student' ? 'him' : undefined,
    };
  }

  const castHit = V35_CAST_PROFILES.find((p) => p.id === clean);
  if (castHit) {
    const roleOverride: PlayerRole = castHit.role === 'her' ? 'him' : 'her';
    if (castHit.discoveryDoor === 'wild' && castHit.primaryWildVenueId) {
      return {
        tab: 'wild',
        venueId: castHit.primaryWildVenueId,
        roleOverride,
      };
    }
    return {
      tab: 'hinge',
      roleOverride,
    };
  }

  // Fallback any unknown historical dilemma slug cleanly into The Marlow Lounge
  return { tab: 'wild', venueId: 'velvet-room' };
}

function readInitialUrlState() {
  if (typeof window === 'undefined') {
    return {
      challenge: null as ChallengePayload | null,
      corruptedChallenge: false,
      dilemmaRoute: null as ReturnType<typeof resolveDilemmaRoute>,
      journalSlug: null as string | null,
      unlockQuery: '',
      stripeSessionId: null as string | null,
      refCode: null as string | null,
      openChecklist: false,
      openQuiz: false,
      openWorld: false,
      openAcademy: false,
      openCourt: false,
      courtCaseId: null as string | null,
      syncChallenge: null as string | null,
      openAbout: false,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const rawChallenge = params.get('challenge');
  const decoded = decodeChallengeParam(rawChallenge);
  const corruptedChallenge = Boolean(rawChallenge && !decoded);
  const dilemmaRoute = resolveDilemmaRoute(params.get('dilemma'));
  const journalSlug = params.get('journal');
  const unlockQuery = params.has('unlock') ? window.location.search : '';
  const stripeSessionId = params.get('session_id');
  const refCode = params.get('ref');
  const openChecklist = params.get('checklist') === '1';
  const openQuiz = params.get('quiz') === '1';
  const openWorld = params.get('world') === '1';
  const openAcademy = params.get('academy') === '1';
  const courtCaseId = params.get('case');
  const syncChallenge = params.get('sync');
  const openCourt = params.get('court') === '1' || Boolean(courtCaseId);
  const openAbout = params.get('about') === '1';

  return {
    challenge: decoded,
    corruptedChallenge,
    dilemmaRoute,
    journalSlug,
    unlockQuery,
    stripeSessionId,
    refCode,
    openChecklist,
    openQuiz,
    openWorld,
    openAcademy,
    openCourt,
    courtCaseId,
    syncChallenge,
    openAbout,
  };
}

const PERSONA_VIBE_OPTIONS = [
  'Corner-Booth Connoisseur',
  'Playful Slow-Burn Romantic',
  'Zero-Nonsense Executive',
  'Golden-Hour Weekend Escapist',
];

export default function App() {
  const initialUrl = useMemo(() => readInitialUrlState(), []);
  const initialSim = useMemo(() => loadSimState(), []);

  const [wallet, setWallet] = useState<WalletState>(() => {
    const base = loadWallet();
    if (initialUrl.unlockQuery) {
      const unlocked = applyUnlockCodeOrQuery(base, initialUrl.unlockQuery);
      saveWallet(unlocked.wallet);
      return unlocked.wallet;
    }
    return base;
  });

  const [role, setRoleState] = useState<PlayerRole>(() => {
    if (initialUrl.dilemmaRoute?.roleOverride) {
      return initialUrl.dilemmaRoute.roleOverride;
    }
    if (!import.meta.env.VITEST && typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('velvet_player_role_v1');
        if (saved === 'her' || saved === 'him') return saved;
      } catch {
        // Ignore storage error
      }
    }
    return 'her';
  });

  const setRole = (next: PlayerRole) => {
    setRoleState(next);
    const nextValidThread = threads.find((t) => {
      if (cutLooseIds.includes(t.leadId)) return false;
      const p = getCastProfileById(t.leadId);
      return Boolean(p && p.role !== next);
    });
    setSelectedChatLeadId(nextValidThread?.leadId ?? null);
    setWildVenueFocusId(undefined);
    if (!import.meta.env.VITEST && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('velvet_player_role_v1', next);
      } catch {
        // Ignore storage error
      }
    }
  };

  const [threads, setThreads] = useState<ActiveMatchThread[]>(initialSim.threads);
  const [cutLooseIds, setCutLooseIds] = useState<string[]>(initialSim.cutLooseIds);
  const [completedCameoVenues, setCompletedCameoVenues] = useState<string[]>(
    initialSim.completedCameoVenues,
  );
  const [completedWildVenues, setCompletedWildVenues] = useState<string[]>(
    initialSim.completedWildVenues ?? [],
  );
  const [cubSchoolStars, setCubSchoolStars] = useState<number>(initialSim.cubSchoolStars);
  const [openConspiracyDirectly, setOpenConspiracyDirectly] = useState(false);
  const [autoLaunchDateRequest, setAutoLaunchDateRequest] = useState<{
    leadId: string;
    dateNumber: 1 | 2 | 3;
    nonce: number;
  } | null>(null);
  const [selectedChatLeadId, setSelectedChatLeadId] = useState<string | null>(
    initialSim.threads[0]?.leadId ?? null,
  );
  const [wildVenueFocusId, setWildVenueFocusId] = useState<string | undefined>(
    initialUrl.dilemmaRoute?.venueId,
  );

  const [dateodex, setDateodex] = useState<DateodexState>(() => loadDateodex());
  const [activeTab, setActiveTab] = useState<ClubTopTab>(() => {
    if (initialUrl.journalSlug) return 'journal';
    if (initialUrl.openAbout) return 'about';
    if (initialUrl.openWorld) return 'wild';
    if (initialUrl.openAcademy) return 'school';
    if (initialUrl.openCourt) return 'courtroom';
    if (initialUrl.dilemmaRoute) return initialUrl.dilemmaRoute.tab;
    return 'hinge';
  });

  const [activeChallenge, setActiveChallenge] = useState<ChallengePayload | null>(
    initialUrl.challenge,
  );
  const [noticeBanner, setNoticeBanner] = useState<string | null>(
    initialUrl.corruptedChallenge
      ? 'Heads up: that audition link looked truncated or expired, browse Prowl or In The Wild below!'
      : null,
  );

  const [personaModalOpen, setPersonaModalOpen] = useState(false);
  const [draftName, setDraftName] = useState(wallet.playerName);
  const [draftVibe, setDraftVibe] = useState(
    wallet.personaTag || PERSONA_VIBE_OPTIONS[0],
  );

  const [fieldGuideOpen, setFieldGuideOpen] = useState(false);
  const [dateodexOpen, setDateodexOpen] = useState(false);
  const [boutiqueOpen, setBoutiqueOpen] = useState(false);
  const [boutiqueInitialTab, setBoutiqueInitialTab] = useState<BoutiqueSectionTab>('vip');
  const [verifiedCameoSessionId, setVerifiedCameoSessionId] = useState<string | null>(() => {
    try {
      return typeof window !== 'undefined'
        ? window.localStorage.getItem('velvet_verified_cameo_session')
        : null;
    } catch {
      return null;
    }
  });
  const [popTriviaOpen, setPopTriviaOpen] = useState(initialUrl.openQuiz);
  const [checklistOpen, setChecklistOpen] = useState(initialUrl.openChecklist);
  const [blindSyncOpen, setBlindSyncOpen] = useState(Boolean(initialUrl.syncChallenge));
  const [roastLabOpen, setRoastLabOpen] = useState(false);
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const [passportMeta, setPassportMeta] = useState(() => loadPassportMeta());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncMeta = () => setPassportMeta(loadPassportMeta());
    window.addEventListener(XP_BURST_EVENT, syncMeta);
    return () => window.removeEventListener(XP_BURST_EVENT, syncMeta);
  }, []);

  const activeVisibleThreads = useMemo(
    () =>
      threads.filter((t) => {
        if (cutLooseIds.includes(t.leadId)) return false;
        const profile = getCastProfileById(t.leadId);
        return Boolean(profile && profile.role !== role);
      }),
    [threads, cutLooseIds, role],
  );
  const campaignSummary = useMemo(
    () =>
      computeCampaignProgress({
        wallet,
        threads: activeVisibleThreads,
        cubSchoolStars,
        completedCameoCount: completedCameoVenues.length,
        role,
        bonusXp: passportMeta.bonusXp,
      }),
    [wallet, activeVisibleThreads, cubSchoolStars, completedCameoVenues.length, role, passportMeta.bonusXp],
  );
  const passportResolved = useMemo(
    () => resolvePassportLevel(campaignSummary.totalPoints),
    [campaignSummary.totalPoints],
  );

  // Reward skill progression: automatically grant +1 Bonus Credit at Passport Lv.2 & Lv.4!
  useEffect(() => {
    const lvl = passportResolved.spec.level;
    if (lvl >= 2 && !wallet.claimedRewards.includes('passport_lvl_2_credit')) {
      const granted = grantRewardCredits(wallet, 'passport_lvl_2_credit', 1);
      if (granted.granted) {
        setWallet(granted.wallet);
        saveWallet(granted.wallet);
        emitXpBurst(0, '+1 Free Club Credit Unlocked!', '💎 LV.2 REWARD');
      }
    } else if (lvl >= 4 && !wallet.claimedRewards.includes('passport_lvl_4_credit')) {
      const granted = grantRewardCredits(wallet, 'passport_lvl_4_credit', 1);
      if (granted.granted) {
        setWallet(granted.wallet);
        saveWallet(granted.wallet);
        emitXpBurst(0, '+1 Free Club Credit Unlocked!', '💎 LV.4 REWARD');
      }
    }
  }, [passportResolved.spec.level, wallet]);

  // Edge Cookie-Farm Guard: verify fresh unverified starter wallets once against /api/starter-check
  useEffect(() => {
    if (import.meta.env.VITEST || typeof window === 'undefined' || typeof fetch !== 'function') {
      return;
    }
    try {
      const checked = window.localStorage.getItem('cc_starter_edge_checked_v1');
      if (checked) return;
      window.localStorage.setItem('cc_starter_edge_checked_v1', '1');
      const isFreshUnverified =
        !wallet.isVip &&
        wallet.claimedRewards.length === 0 &&
        wallet.discernmentXp === 0 &&
        threads.length === 0;
      if (!isFreshUnverified) return;
      fetch('/api/starter-check', { method: 'POST' })
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { starterAllowed?: boolean } | null) => {
          if (data && data.starterAllowed === false) {
            setWallet((prev) => {
              if (prev.isVip || prev.claimedRewards.length > 0) return prev;
              const clamped = { ...prev, credits: 0 };
              saveWallet(clamped);
              return clamped;
            });
          }
        })
        .catch(() => {});
    } catch {
      // Ignore storage restriction
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [founderModalOpen, setFounderModalOpen] = useState(false);
  const [founderPassInput, setFounderPassInput] = useState('');
  const [founderSessionPass, setFounderSessionPass] = useState('');
  const [founderDeviceSeal, setFounderDeviceSeal] = useState<string>(() => {
    try {
      return typeof window !== 'undefined'
        ? window.localStorage.getItem(FOUNDER_DEVICE_SEAL_KEY) || ''
        : '';
    } catch {
      return '';
    }
  });
  const [founderAuthError, setFounderAuthError] = useState<string | null>(null);
  const [founderTagInput, setFounderTagInput] = useState(
    MONETIZATION_CONFIG.amazonAssociateTag || '',
  );
  const [founderTagProtected, setFounderTagProtected] = useState(
    Boolean(MONETIZATION_CONFIG.amazonAssociateTag),
  );
  const [founderTagStatus, setFounderTagStatus] = useState<string | null>(null);

  useEffect(() => {
    saveSimState({
      threads,
      cutLooseIds,
      completedCameoVenues,
      completedWildVenues,
      cubSchoolStars,
    });
  }, [threads, cutLooseIds, completedCameoVenues, completedWildVenues, cubSchoolStars]);

  useEffect(() => {
    const anyModalOpen =
      boutiqueOpen ||
      popTriviaOpen ||
      checklistOpen ||
      blindSyncOpen ||
      roastLabOpen ||
      fieldGuideOpen ||
      dateodexOpen ||
      personaModalOpen ||
      founderModalOpen;
    if (!anyModalOpen || typeof window === 'undefined') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setBoutiqueOpen(false);
      setPopTriviaOpen(false);
      setChecklistOpen(false);
      setBlindSyncOpen(false);
      setRoastLabOpen(false);
      setFieldGuideOpen(false);
      setDateodexOpen(false);
      setPersonaModalOpen(false);
      setFounderModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    boutiqueOpen,
    popTriviaOpen,
    checklistOpen,
    blindSyncOpen,
    roastLabOpen,
    fieldGuideOpen,
    dateodexOpen,
    personaModalOpen,
    founderModalOpen,
  ]);

  useEffect(() => {
    if (import.meta.env.VITEST) return;
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
    } catch {
      // Ignore scroll error
    }
  }, [activeTab]);

  const updateWallet = (next: WalletState) => {
    setWallet(next);
    saveWallet(next);
  };

  const openBoutiqueWithTab = (tab: BoutiqueSectionTab = 'vip') => {
    setBoutiqueInitialTab(tab);
    setBoutiqueOpen(true);
  };

  useEffect(() => {
    if (import.meta.env.PROD || !founderDeviceSeal || import.meta.env.VITEST || typeof fetch !== 'function') return;
    let cancelled = false;
    fetch('/api/founder-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ founderSeal: founderDeviceSeal }),
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            try {
              window.localStorage.removeItem(FOUNDER_DEVICE_SEAL_KEY);
            } catch {}
            if (!cancelled) setFounderDeviceSeal('');
          }
          return;
        }
        const data = (await res.json()) as {
          authorized?: boolean;
          amazonAssociateTag?: string;
          affiliateProtected?: boolean;
        };
        if (!cancelled && data.authorized === true) {
          setWallet((prev) => grantFounderAccess(prev));
          if (data.amazonAssociateTag !== undefined) {
            setFounderTagInput(data.amazonAssociateTag);
            setFounderTagProtected(Boolean(data.affiliateProtected));
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [founderDeviceSeal]);

  useEffect(() => {
    if (
      initialUrl.refCode &&
      initialUrl.refCode.toLowerCase() !== (wallet.referralCode || '').toLowerCase()
    ) {
      recordIncomingReferralHit(initialUrl.refCode);
    }
  }, [initialUrl.refCode, wallet.referralCode]);

  useEffect(() => {
    if (!initialUrl.stripeSessionId) return;
    const sessionKey = `stripe_session_${initialUrl.stripeSessionId}`;
    if (wallet.claimedRewards.includes(sessionKey)) return;

    let tierHint = '';
    try {
      tierHint = window.localStorage.getItem('velvet_pending_stripe_tier') || '';
    } catch {
      // Ignore storage block
    }

    verifyStripeCheckoutSession(initialUrl.stripeSessionId, tierHint).then((result) => {
      if (!result.verified) return;
      try {
        window.localStorage.removeItem('velvet_pending_stripe_tier');
      } catch {
        // Ignore storage block
      }
      setWallet((prev) => {
        if (prev.claimedRewards.includes(sessionKey)) return prev;
        if (result.grantType === 'patron' || tierHint === 'tip') {
          const nextPatron = grantPatronBadge(prev, sessionKey);
          saveWallet(nextPatron);
          return nextPatron;
        }
        const next: WalletState = {
          ...prev,
          isVip: result.grantType === 'vip' ? true : prev.isVip,
          credits: prev.credits + (result.credits ?? 15),
          claimedRewards: [...prev.claimedRewards, sessionKey],
        };
        saveWallet(next);
        return next;
      });
      trackEvent('purchase_verified', {
        tier: result.grantType ?? tierHint,
        credits: result.credits ?? 0,
      });
      if (result.cameoSessionId) {
        setVerifiedCameoSessionId(result.cameoSessionId);
        try {
          window.localStorage.setItem('velvet_verified_cameo_session', result.cameoSessionId);
        } catch {
          // Ignore storage block
        }
        setBoutiqueInitialTab('vip');
        setBoutiqueOpen(true);
      }
      setNoticeBanner(
        result.cameoSessionId
          ? '🎬 $29 Producer Sponsorship verified! Write your custom Cougar or Cub brief below.'
          : result.grantType === 'patron' || tierHint === 'tip'
            ? '💛 Thank you for supporting Cougars & Cubs Club! Your Club Patron badge is live.'
            : '🎉 Stripe Checkout verified! Your VIP / Club Credits are live.',
      );
    });
  }, [initialUrl.stripeSessionId, wallet.claimedRewards]);

  const handleFounderUnlockSubmit = async (e: React.FormEvent) => {
    if (import.meta.env.PROD) return;
    e.preventDefault();
    const trimmed = founderPassInput.trim();
    if (trimmed.length < 12) {
      setFounderAuthError('Invalid Founder passphrase. Access denied.');
      return;
    }

    let authorized = false;
    if (typeof fetch === 'function') {
      try {
        const res = await fetch('/api/founder-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passphrase: trimmed }),
        });
        if (res.ok) {
          const data = (await res.json()) as {
            authorized?: boolean;
            founderSeal?: string;
            amazonAssociateTag?: string;
            affiliateProtected?: boolean;
          };
          if (data.authorized === true) {
            authorized = true;
            if (data.founderSeal) {
              setFounderDeviceSeal(data.founderSeal);
              try {
                window.localStorage.setItem(FOUNDER_DEVICE_SEAL_KEY, data.founderSeal);
              } catch {}
            }
            if (data.amazonAssociateTag !== undefined) {
              setFounderTagInput(data.amazonAssociateTag);
              setFounderTagProtected(Boolean(data.affiliateProtected));
            }
          }
        } else if (res.status === 401 || res.status === 400) {
          setFounderAuthError('Invalid Founder passphrase. Access denied.');
          return;
        }
      } catch {
        // Offline Vitest fallback below
      }
    }

    if (!authorized && import.meta.env.VITEST) {
      authorized = await verifyFounderPassphrase(trimmed);
    }

    if (!authorized) {
      setFounderAuthError('Invalid Founder passphrase. Access denied.');
      return;
    }

    setWallet((prev) => grantFounderAccess(prev));
    setFounderSessionPass(trimmed);
    setFounderPassInput('');
    setFounderAuthError(null);
    setFounderModalOpen(false);
    setNoticeBanner('👑 Founder Playtest Vault unlocked on this browser.');
  };

  const handleSaveFounderAmazonTag = async (e: React.FormEvent) => {
    if (import.meta.env.PROD) return;
    e.preventDefault();
    if (!founderSessionPass && !founderDeviceSeal) {
      setFounderModalOpen(true);
      return;
    }
    const cleanTag = founderTagInput.trim();
    try {
      const res = await fetch('/api/founder-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passphrase: founderSessionPass || undefined,
          founderSeal: founderDeviceSeal || undefined,
          amazonAssociateTag: cleanTag,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        affiliateProtected?: boolean;
        error?: string;
      };
      if (res.ok && data.ok) {
        setFounderTagProtected(Boolean(data.affiliateProtected));
        setFounderTagStatus(
          cleanTag
            ? `✓ Protected! /api/go/* injects tag=${cleanTag}`
            : 'Cleared tag',
        );
      } else {
        setFounderTagStatus(data.error || 'Could not save tag.');
      }
    } catch {
      setFounderTagStatus('Saved locally for session.');
    }
  };

  const handleLockFounderMode = () => {
    if (import.meta.env.PROD) return;
    updateWallet(revokeFounderAccess(wallet));
    setFounderSessionPass('');
    setFounderDeviceSeal('');
    try {
      window.localStorage.removeItem(FOUNDER_DEVICE_SEAL_KEY);
    } catch {}
    setFounderTagStatus(null);
    setNoticeBanner('🔒 Founder Mode locked: viewing standard 5-Credit player mode.');
  };

  const openWildMapOverview = () => {
    setWildVenueFocusId(undefined);
    setActiveChallenge(null);
    setActiveTab('wild');
  };

  const handleLaunchScenarioSlug = (slug: string) => {
    const resolved = resolveDilemmaRoute(slug);
    if (!resolved) return;
    if (resolved.roleOverride) setRole(resolved.roleOverride);
    setWildVenueFocusId(resolved.venueId);
    setActiveChallenge(null);
    setActiveTab(resolved.tab);
  };

  const handleSendPartnerAudition = async () => {
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin.startsWith('http')
        ? `${window.location.origin}${window.location.pathname}`
        : BRAND_CONFIG.publicBaseUrl;
    const scenarioIds = ['check-drop', 'velvet-room', 'waiter-son-incident', 'code-switch-texting'];
    const link = encodeChallengeLink(
      {
        v: 1,
        senderName: wallet.playerName || (role === 'her' ? 'Claire' : 'Julian'),
        senderRole: role,
        herId: 'claire',
        hisId: 'julian',
        episodeIds: scenarioIds,
        preferredChoiceIndices: scenarioIds.map(() => 0),
      },
      baseUrl,
    );
    await shareOrCopy({
      title: 'Pass My 60-Second Cougars & Cubs Vetting Audition',
      text: 'Think you’d survive dating me? Take my 60-second Cougars & Cubs Vetting Audition 👀',
      url: link,
    });
    setNoticeBanner('🔗 60-Second Partner Audition link copied! Text it to your Cougar or Cub.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F8] text-zinc-900">
      <LiveIncomingTextBanner
        activeThreads={activeVisibleThreads}
        activeTab={activeTab}
        anyModalOpen={
          boutiqueOpen ||
          popTriviaOpen ||
          checklistOpen ||
          blindSyncOpen ||
          fieldGuideOpen ||
          dateodexOpen ||
          personaModalOpen ||
          passportModalOpen
        }
        onOpenBannerLead={(leadId, pingText) => {
          setThreads((prev) =>
            prev.map((t) => {
              if (t.leadId !== leadId) return t;
              if (t.messages.some((m) => m.text === pingText)) return t;
              return {
                ...t,
                messages: [...t.messages, { sender: 'match', text: pingText }],
              };
            }),
          );
          setSelectedChatLeadId(leadId);
          setOpenConspiracyDirectly(false);
          setActiveTab('chats');
        }}
      />

      <TopHudBar
        wallet={wallet}
        activeTab={activeTab}
        activeChatCount={activeVisibleThreads.length}
        passportLevel={passportResolved.spec.level}
        passportXp={campaignSummary.totalPoints}
        passportStreak={passportMeta.streakDays}
        onOpenPassportModal={() => setPassportModalOpen(true)}
        onSelectTab={(tab) => {
          if (tab === 'wild') {
            openWildMapOverview();
            return;
          }
          setActiveChallenge(null);
          setActiveTab(tab);
        }}
        onOpenPersonaModal={() => {
          setDraftName(wallet.playerName);
          setDraftVibe(wallet.personaTag || PERSONA_VIBE_OPTIONS[0]);
          setPersonaModalOpen(true);
        }}
        onOpenFieldGuide={() => setFieldGuideOpen(true)}
        onOpenDateodex={() => setDateodexOpen(true)}
        onOpenBoutique={openBoutiqueWithTab}
        onOpenPopTrivia={() => setPopTriviaOpen(true)}
        onOpenChecklist={() => setChecklistOpen(true)}
        onSendPartnerAudition={handleSendPartnerAudition}
        onResetHearts={() => updateWallet(resetFridayHearts(wallet))}
        onRequestFounderModal={
          !import.meta.env.PROD
            ? () => {
                setFounderAuthError(null);
                setFounderModalOpen(true);
              }
            : undefined
        }
        onGoHome={() => {
          setActiveChallenge(null);
          setActiveTab('hinge');
        }}
      />

      {!import.meta.env.PROD && wallet.isFounderUnlimited && (
        <div className="border-b border-amber-300 bg-amber-50 px-4 py-2.5 sm:px-6 text-xs">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-extrabold text-zinc-950">
              <Wrench className="h-4 w-4 text-rose-600" />
              👑 Founder Playtest Vault • ∞ Credits &amp; All Unlocks Active
            </span>

            <form
              onSubmit={handleSaveFounderAmazonTag}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 font-bold text-emerald-900">
                <ShieldCheck className="h-3.5 w-3.5" />
                {founderTagProtected ? 'Amazon /api/go/* Active' : 'Gateway Ready'}
              </span>
              <input
                type="text"
                aria-label="Amazon Associate Tag"
                placeholder="cougarsandcub-20"
                value={founderTagInput}
                onChange={(e) => setFounderTagInput(e.target.value)}
                className="w-38 rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-bold text-zinc-950"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1 font-bold text-white cursor-pointer"
              >
                <Check className="h-3 w-3" />
                <span>Save Tag</span>
              </button>
              {founderTagStatus && (
                <span className="text-emerald-800 font-bold">{founderTagStatus}</span>
              )}
              <button
                type="button"
                onClick={handleLockFounderMode}
                className="inline-flex items-center gap-1 rounded-full bg-zinc-950 px-3 py-1 font-bold text-white cursor-pointer"
              >
                <Lock className="h-3 w-3" />
                <span>Lock Founder</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {!activeChallenge &&
        (activeTab === 'hinge' ||
          activeTab === 'wild' ||
          activeTab === 'chats' ||
          activeTab === 'school') && (
          <CampaignCompassBar
            wallet={wallet}
            threads={activeVisibleThreads}
            cutLooseIds={cutLooseIds}
            cubSchoolStars={cubSchoolStars}
            completedCameoCount={completedCameoVenues.length}
            bonusXp={passportMeta.bonusXp}
            streakDays={passportMeta.streakDays}
            role={role}
            activeTab={activeTab}
            onSwitchRole={(nextRole) => setRole(nextRole)}
            onOpenPassportModal={() => setPassportModalOpen(true)}
            onOpenMatchmaking={() => openBoutiqueWithTab('rewards')}
            onNavigateStep={(step) => {
              if (step.leadId) setSelectedChatLeadId(step.leadId);
              setOpenConspiracyDirectly(Boolean(step.openConspiracy));
              if (step.leadId && step.launchDateNumber) {
                setAutoLaunchDateRequest({
                  leadId: step.leadId,
                  dateNumber: step.launchDateNumber,
                  nonce: Date.now(),
                });
              } else {
                setAutoLaunchDateRequest(null);
              }
              setActiveTab(step.targetTab);
            }}
            onSelectMatchChat={(leadId) => {
              setSelectedChatLeadId(leadId);
              setOpenConspiracyDirectly(false);
              setActiveTab('chats');
            }}
            onOpenCubSchool={() => setActiveTab('school')}
            onOpenWildMap={openWildMapOverview}
            onOpenPopTrivia={() => setPopTriviaOpen(true)}
            onOpenChecklist={() => setChecklistOpen(true)}
            onOpenBlindSync={() => setBlindSyncOpen(true)}
            onOpenRoastLab={() => setRoastLabOpen(true)}
            onOpenGuides={() => setActiveTab('journal')}
            onOpenCourtroom={() => setActiveTab('courtroom')}
            onSendPartnerAudition={handleSendPartnerAudition}
            onResetHearts={() => updateWallet(resetFridayHearts(wallet))}
          />
        )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6">

        {noticeBanner && (
          <div className="editorial-hinge-card flex items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-300 px-4 py-3 text-xs sm:text-sm font-bold text-amber-950">
            <span>{noticeBanner}</span>
            <button
              type="button"
              onClick={() => setNoticeBanner(null)}
              className="rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-zinc-950 cursor-pointer"
              aria-label="Dismiss notice"
            >
              ✕
            </button>
          </div>
        )}

        {activeChallenge ? (
          <PartnerAuditionView
            challenge={activeChallenge}
            onExitToMainGame={() => {
              setActiveChallenge(null);
              setActiveTab('hinge');
            }}
          />
        ) : activeTab === 'about' ? (
          <AboutClubView
            onGoToHinge={() => setActiveTab('hinge')}
            onOpenChats={() => setActiveTab('chats')}
            onOpenCubSchool={() => setActiveTab('school')}
            onOpenWildMap={openWildMapOverview}
            onOpenBoutique={() => openBoutiqueWithTab('shop')}
            onOpenGuides={() => setActiveTab('journal')}
          />
        ) : activeTab === 'courtroom' ? (
          <ClubCourtroomView
            role={role}
            initialCaseId={initialUrl.courtCaseId}
            onBackToRoster={() => setActiveTab('hinge')}
            onOpenCubAcademy={() => setActiveTab('school')}
            onCastCourtVote={() => {
              setDateodex((prev) => recordDateodexCourtVote(prev));
            }}
            onGrantBonusCredits={() => false}
          />
        ) : activeTab === 'journal' ? (
          <VelvetJournalView
            initialSlug={initialUrl.journalSlug}
            onPlayScenario={handleLaunchScenarioSlug}
          />
        ) : activeTab === 'wild' ? (
          <InTheWildMapView
            role={role}
            activeLeadThreads={threads.map((t) => t.leadId)}
            completedCameoVenues={completedCameoVenues}
            completedWildVenues={completedWildVenues}
            initialVenueId={wildVenueFocusId}
            onClearInitialVenue={() => setWildVenueFocusId(undefined)}
            onUnlockWildLead={(leadId, venueId, bonus, clueId) => {
              if (clueId) {
                updateWallet(addConspiracyClue(wallet, clueId));
              }
              setCompletedWildVenues((prev) =>
                prev.includes(venueId) ? prev : [...prev, venueId],
              );
              const alreadyMatched = threads.some((t) => t.leadId === leadId);
              setThreads((prev) => {
                if (prev.some((t) => t.leadId === leadId)) {
                  return prev.map((t) =>
                    t.leadId === leadId
                      ? { ...t, chemistry: Math.min(100, t.chemistry + 8) }
                      : t,
                  );
                }
                const created = createInitialThread(leadId, 'wild', undefined, false, venueId);
                const wildPerk = getPersonaVibeSpec(wallet.personaTag)?.wildChemistryBonus ?? 0;
                created.chemistry = Math.min(96, created.chemistry + bonus + wildPerk);
                return [created, ...prev];
              });
              setSelectedChatLeadId(leadId);
              const person = getCastProfileById(leadId);
              if (!alreadyMatched) {
                setNoticeBanner(
                  `🍸 Pulled ${person?.name ?? leadId}’s number! Keep exploring Sunset Hills or message them anytime in Chats & Dates.`,
                );
              }
            }}
            onCompleteCameo={(venueId, leadId, bonus) => {
              setCompletedCameoVenues((prev) =>
                prev.includes(venueId) ? prev : [...prev, venueId],
              );
              setDateodex((prev) => unlockDateodexPolaroid(prev, 'polaroid-sanctuary-scan'));
              setThreads((prev) =>
                prev.map((t) =>
                  t.leadId === leadId
                    ? { ...t, chemistry: Math.min(100, t.chemistry + bonus) }
                    : t,
                ),
              );
            }}
            onOpenChatWithLead={(leadId) => {
              setSelectedChatLeadId(leadId);
              setOpenConspiracyDirectly(false);
              setActiveTab('chats');
            }}
          />
        ) : activeTab === 'chats' ? (
          <ChatsAndDatesView
            role={role}
            wallet={wallet}
            threads={activeVisibleThreads}
            selectedLeadId={selectedChatLeadId}
            cutLooseIds={cutLooseIds}
            cubSchoolStars={cubSchoolStars}
            initialOpenConspiracy={openConspiracyDirectly}
            autoLaunchDateRequest={autoLaunchDateRequest}
            onSelectLead={(id) => {
              setOpenConspiracyDirectly(false);
              setAutoLaunchDateRequest(null);
              setSelectedChatLeadId(id);
            }}
            onUpdateThread={(updated) => {
              const previous = threads.find((t) => t.leadId === updated.leadId);
              if (
                previous &&
                updated.datesCompleted > previous.datesCompleted &&
                updated.lastDateRank !== 'F'
              ) {
                const rank = updated.lastDateRank ?? (updated.sRankLockedOut ? 'A' : 'S');
                if (rank === 'S') {
                  const sRankBonus = grantRewardCredits(wallet, 'milestone_first_s_rank', 2);
                  if (sRankBonus.granted) {
                    updateWallet(sRankBonus.wallet);
                    setNoticeBanner(
                      '🏆 First 5-Star Date Unlocked! Polaroid memory added to your Dateodex.',
                    );
                  }
                }
                setDateodex((prev) =>
                  stampDateodexCharacters(
                    prev,
                    [
                      {
                        characterId: updated.leadId,
                        verdict: 'crowned',
                        rank,
                        note: `Date #${updated.datesCompleted} Complete`,
                      },
                    ],
                    updated.datesCompleted >= 2
                      ? ['polaroid-kitchen-apron', 'polaroid-coastal-sunset']
                      : ['polaroid-kitchen-apron'],
                  ),
                );
              }
              setThreads((prev) =>
                prev.map((t) => (t.leadId === updated.leadId ? updated : t)),
              );
            }}
            onSpendCredits={(cost) => {
              const res = spendCredits(wallet, cost);
              if (!res.ok) {
                openBoutiqueWithTab('vip');
                return false;
              }
              updateWallet(res.wallet);
              return true;
            }}
            onUnlockBucketItem={(bucket, itemId, cost) => {
              const res = unlockContentWithCredits(wallet, bucket, itemId, cost);
              if (!res.ok) {
                openBoutiqueWithTab('vip');
                return false;
              }
              updateWallet(res.wallet);
              return true;
            }}
            onCutLooseTrap={(leadId, clueId) => {
              updateWallet(recordBulletDodged(wallet, leadId, clueId));
              emitXpBurst(25, 'Trap Blocked!', '🚫 DODGED');
              setCutLooseIds((prev) => (prev.includes(leadId) ? prev : [...prev, leadId]));
              setThreads((prev) => prev.filter((t) => t.leadId !== leadId));
              setDateodex((prev) =>
                stampDateodexCharacters(prev, [
                  {
                    characterId: leadId,
                    verdict: 'dumped',
                    rank: 'S',
                    note: 'Bullet Dodged (+25 XP)',
                  },
                ]),
              );
            }}
            onConfirmCutGenuine={(leadId) => {
              setCutLooseIds((prev) => (prev.includes(leadId) ? prev : [...prev, leadId]));
              setThreads((prev) => prev.filter((t) => t.leadId !== leadId));
            }}
            onLoseHeart={() => {
              updateWallet(loseFridayHeart(wallet));
            }}
            onRecordConspiracyClue={(clueId) => {
              updateWallet(addConspiracyClue(wallet, clueId));
            }}
            onOpenHinge={() => setActiveTab('hinge')}
            onOpenBoutique={(tab) => openBoutiqueWithTab(tab ?? 'vip')}
            onOpenCubSchool={() => setActiveTab('school')}
            onSavePersona={(pName, pVibe) => {
              updateWallet(updatePlayerPersona(wallet, pName, pVibe));
            }}
          />
        ) : activeTab === 'school' ? (
          <CubSchoolView
            role={role}
            initialGoldStars={cubSchoolStars}
            activeMatchName={
              (() => {
                const activeMatch = activeVisibleThreads[0];
                return activeMatch
                  ? (getCastProfileById(activeMatch.leadId)?.name ?? null)
                  : null;
              })()
            }
            onUpdateGoldStars={(stars) =>
              setCubSchoolStars((prev) => Math.max(prev, stars))
            }
            onEarnDiploma={() => {
              updateWallet(unlockStamp(wallet, 'golden_cub'));
              setDateodex((prev) => unlockDateodexPolaroid(prev, 'polaroid-obedience-s'));
            }}
            onReturnToActiveMatch={() => {
              const activeMatch = activeVisibleThreads[0];
              if (activeMatch) setSelectedChatLeadId(activeMatch.leadId);
              setOpenConspiracyDirectly(false);
              setActiveTab('chats');
            }}
            onGoToHinge={() => setActiveTab('hinge')}
          />
        ) : (
          <HingeFeedView
            role={role}
            wallet={wallet}
            matchedLeadIds={threads.map((t) => t.leadId)}
            cutLooseIds={cutLooseIds}
            etiquetteBonusActive={cubSchoolStars >= 4}
            onSendHingeOpener={(leadId, _label, openerText, cost, delta, outcome, isCustomOpener) => {
              if (cost > 0) {
                const spent = spendCredits(wallet, cost);
                if (!spent.ok) {
                  openBoutiqueWithTab('vip');
                  return false;
                }
                updateWallet(spent.wallet);
              }
              if (outcome === 'pending_like') return true;

              setThreads((prev) => {
                if (prev.some((t) => t.leadId === leadId)) return prev;
                const created = createInitialThread(leadId, 'hinge', openerText, Boolean(isCustomOpener));
                created.chemistry = Math.max(25, Math.min(92, created.chemistry + delta));
                return [created, ...prev];
              });
              setSelectedChatLeadId(leadId);
              return true;
            }}
            onDeliverCustomOpenerReply={(leadId, replyText, chemistryDelta, suggestedReplies) => {
              setThreads((prev) =>
                prev.map((t) =>
                  t.leadId === leadId
                    ? {
                        ...t,
                        chemistry: Math.max(15, Math.min(98, t.chemistry + Math.round(chemistryDelta / 2))),
                        adaptiveSuggestions: suggestedReplies ?? t.adaptiveSuggestions,
                        messages: [...t.messages, { sender: 'match', text: replyText }],
                      }
                    : t,
                ),
              );
            }}
            onSwitchRole={(nextRole) => setRole(nextRole)}
            onOpenWildMap={openWildMapOverview}
            onOpenChats={(leadId) => {
              if (leadId) setSelectedChatLeadId(leadId);
              setActiveTab('chats');
            }}
          />
        )}
      </main>

      <footer className="border-t border-zinc-200 bg-white py-10 text-sm text-zinc-600">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 grid gap-8 md:grid-cols-[1.5fr_1fr_1fr] items-start">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-xs font-bold text-white">
                🐆
              </span>
              <span className="text-sm font-bold text-zinc-950">
                {BRAND_CONFIG.name}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500 max-w-sm">
              Interactive older-woman × younger-man rom-com, red-flag courtroom, and insider courtship guide for consenting adults (21+).
            </p>
            <p className="text-[11px] leading-relaxed text-zinc-400 max-w-md">
              💛 100% banner-ad-free indie project. As an Amazon Associate we earn from qualifying purchases and Prime trials at $0 extra cost to you, helping fund live AI servers and new chapters.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-950">
              Play
            </div>
            <div className="flex flex-col items-start gap-1.5 text-sm font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('hinge')}
                className="text-zinc-600 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Prowl Dating App
              </button>
              <button
                type="button"
                onClick={openWildMapOverview}
                className="text-zinc-600 hover:text-rose-600 transition-colors cursor-pointer"
              >
                In The Wild
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chats')}
                className="text-zinc-600 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Chats &amp; Dates
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('school')}
                className="text-zinc-600 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Cub School
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-950">
              Explore &amp; Support
            </div>
            <div className="flex flex-col items-start gap-1.5 text-sm font-medium">
              <button
                type="button"
                onClick={() => setPopTriviaOpen(true)}
                className="text-zinc-600 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Trailer Quiz
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('journal')}
                className="text-zinc-600 hover:text-rose-600 transition-colors cursor-pointer"
              >
                16 Club Guides
              </button>
              <button
                type="button"
                onClick={() => openBoutiqueWithTab('shop')}
                className="text-zinc-600 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Date-Night Shop
              </button>
              <button
                type="button"
                onClick={() => openBoutiqueWithTab('rewards')}
                className="text-zinc-900 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
              >
                Real Matchmaking &amp; Discord
              </button>
              <a
                href={MONETIZATION_CONFIG.tipJarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-600 hover:text-rose-700 font-semibold transition-colors"
              >
                Support This Project →
              </a>
              {!import.meta.env.PROD && (
                <button
                  type="button"
                  onClick={() => {
                    if (wallet.isFounderUnlimited) {
                      handleLockFounderMode();
                    } else {
                      setFounderAuthError(null);
                      setFounderModalOpen(true);
                    }
                  }}
                  className="inline-flex items-center gap-1 pt-1 text-xs font-medium text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                  aria-label="Founder Vault"
                >
                  <Lock className="h-3 w-3" />
                  <span>{wallet.isFounderUnlimited ? 'Lock Founder' : 'Founder'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Quick 15-Second Persona Setup Modal */}
      {personaModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="15-Second Persona Setup"
          onClick={() => setPersonaModalOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              updateWallet(updatePlayerPersona(wallet, draftName, draftVibe));
              setPersonaModalOpen(false);
            }}
            className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl"
          >
            <div className="shrink-0 flex items-center justify-between gap-3 border-b border-zinc-200 bg-white px-6 py-4">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                Your Name &amp; Friday Vibe
              </h2>
              <button
                type="button"
                onClick={() => setPersonaModalOpen(false)}
                aria-label="Close Persona Setup"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="persona-name-input"
                  className="block text-xs font-medium text-zinc-700"
                >
                  Your First Name (Used on Dates &amp; Texts)
                </label>
                <input
                  id="persona-name-input"
                  type="text"
                  maxLength={28}
                  placeholder="Your first name (optional)"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full h-11 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-medium text-zinc-700">
                  Friday Signature Vibe (Unlocks Active Chat &amp; Date Perks)
                </div>
                <div className="grid gap-2">
                  {PERSONA_VIBE_SPECS.map((spec) => (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setDraftVibe(spec.id)}
                      className={`rounded-xl border px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                        draftVibe === spec.id
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-bold">
                        <span>
                          {spec.emoji} {spec.id}
                        </span>
                        <span
                          className={`text-[11px] font-extrabold ${
                            draftVibe === spec.id ? 'text-rose-300' : 'text-rose-700'
                          }`}
                        >
                          {spec.perkBadge}
                        </span>
                      </div>
                      <div
                        className={`mt-0.5 text-[11px] leading-snug ${
                          draftVibe === spec.id ? 'text-zinc-300' : 'text-zinc-500'
                        }`}
                      >
                        {spec.perkSummary}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPersonaModalOpen(false)}
                  className="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-xs font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center rounded-lg bg-zinc-900 px-4 text-xs font-medium text-white hover:bg-zinc-800 cursor-pointer"
                >
                  Save Persona
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Dev / Test Only Passphrase Modal */}
      {!import.meta.env.PROD && founderModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Founder Passphrase Vault"
          onClick={() => setFounderModalOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleFounderUnlockSubmit}
            className="editorial-hinge-card flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
          >
            <div className="shrink-0 flex items-start justify-between gap-3 border-b border-zinc-200 bg-white px-6 py-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Salted SHA-256 Protected
                </div>
                <h2 className="mt-0.5 text-xl font-semibold tracking-tight text-zinc-950">
                  Founder Playtest &amp; Affiliate Vault
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFounderModalOpen(false)}
                aria-label="Close Founder Vault"
                className="shrink-0 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="founder-passphrase-input"
                  className="block text-xs font-bold uppercase tracking-wide text-zinc-900"
                >
                  Private Vault Passphrase
                </label>
                <input
                  id="founder-passphrase-input"
                  type="password"
                  autoFocus
                  required
                  placeholder="Enter private passphrase..."
                  value={founderPassInput}
                  onChange={(e) => {
                    setFounderPassInput(e.target.value);
                    if (founderAuthError) setFounderAuthError(null);
                  }}
                  className="min-w-0 w-full h-11 rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-950"
                />
                {founderAuthError && (
                  <p className="text-xs font-bold text-rose-700">{founderAuthError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setFounderModalOpen(false)}
                  className="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-xs font-medium text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center rounded-lg bg-rose-600 px-5 text-xs font-bold text-white cursor-pointer"
                >
                  Unlock Founder Vault
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <FieldGuideModal
        open={fieldGuideOpen}
        unlockedStamps={wallet.unlockedStamps}
        onClose={() => setFieldGuideOpen(false)}
      />

      <DateodexModal
        open={dateodexOpen}
        dateodex={dateodex}
        wallet={wallet}
        cutLooseIds={cutLooseIds}
        onClose={() => setDateodexOpen(false)}
      />

      <PopCultureTriviaModal
        open={popTriviaOpen}
        referralCode={wallet.referralCode}
        onClose={() => setPopTriviaOpen(false)}
        onEarnTriviaReward={(key, amount) => {
          const res = grantRewardCredits(wallet, key, amount);
          if (res.granted) updateWallet(res.wallet);
          return res.granted;
        }}
      />

      <CougarCubChecklistModal
        open={checklistOpen}
        referralCode={wallet.referralCode}
        onClose={() => setChecklistOpen(false)}
        onClaimChecklistReward={(key, amount) => {
          const res = grantRewardCredits(wallet, key, amount);
          if (res.granted) updateWallet(res.wallet);
          return res.granted;
        }}
        onPlayMatchedScenario={(episodeId) => {
          setChecklistOpen(false);
          handleLaunchScenarioSlug(episodeId);
        }}
      />

      <CouplesBlindSyncModal
        open={blindSyncOpen}
        initialSyncChallenge={initialUrl.syncChallenge}
        playerName={wallet.playerName}
        onClose={() => setBlindSyncOpen(false)}
      />

      <RoastAndWingwomanModal
        open={roastLabOpen}
        role={role}
        wallet={wallet}
        onClose={() => setRoastLabOpen(false)}
        onSpendCredit={(cost) => {
          const res = spendCredits(wallet, cost);
          if (!res.ok) {
            openBoutiqueWithTab('vip');
            return false;
          }
          updateWallet(res.wallet);
          return true;
        }}
        onOpenVip={() => {
          setRoastLabOpen(false);
          openBoutiqueWithTab('vip');
        }}
      />

      <BoutiqueAndVipModal
        open={boutiqueOpen}
        wallet={wallet}
        initialSection={boutiqueInitialTab}
        verifiedCameoSessionId={verifiedCameoSessionId}
        onCameoBriefSubmitted={() => {
          setVerifiedCameoSessionId(null);
          try {
            window.localStorage.removeItem('velvet_verified_cameo_session');
          } catch {
            // Ignore storage block
          }
        }}
        onClose={() => setBoutiqueOpen(false)}
        onRedeemCode={(code) => {
          const res = applyUnlockCodeOrQuery(wallet, code);
          if (res.unlocked) {
            updateWallet(res.wallet);
            return true;
          }
          return false;
        }}
        onRestoreVipSuccess={() => {
          updateWallet(restoreVerifiedVip(wallet));
        }}
        onSandboxGrantCredits={() => {
          updateWallet({ ...wallet, credits: wallet.credits + 15 });
        }}
        onSandboxUnlockVip={() => {
          updateWallet({ ...wallet, isVip: true, credits: wallet.credits + 15 });
        }}
        onClaimNewsletterBonus={(email) => {
          if (typeof fetch === 'function') {
            fetch('/api/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, source: 'boutique_modal' }),
            }).catch(() => {});
          }
          return false;
        }}
      />
      <ClubPassportOverlay
        totalXp={campaignSummary.totalPoints}
        streakDays={passportMeta.streakDays}
        etiquetteBonusActive={cubSchoolStars >= 4}
        datesCompleted={campaignSummary.totalDatesCompleted}
        trapsDodged={cutLooseIds.length}
        passportModalOpen={passportModalOpen}
        onClosePassportModal={() => setPassportModalOpen(false)}
        onJumpToMode={(mode) => {
          if (mode === 'checklist') setChecklistOpen(true);
          else if (mode === 'trivia') setPopTriviaOpen(true);
          else if (mode === 'wild') openWildMapOverview();
          else setActiveTab(mode);
        }}
      />
    </div>
  );
}
