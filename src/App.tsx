import { useEffect, useMemo, useState } from 'react';
import { Check, Lock, ShieldCheck, Wrench, X } from 'lucide-react';
import { BRAND_CONFIG } from './config/brand';
import { MONETIZATION_CONFIG } from './config/monetization';
import { AboutClubView } from './components/AboutClubView';
import { AppSwipeStage } from './components/AppSwipeStage';
import { BoutiqueAndVipModal } from './components/BoutiqueAndVipModal';
import { ClubCourtroomView } from './components/ClubCourtroomView';
import { CougarCubChecklistModal } from './components/CougarCubChecklistModal';
import { EightBitAdventureWorld } from './components/EightBitAdventureWorld';
import { EpisodeStage } from './components/EpisodeStage';
import { FieldGuideModal } from './components/FieldGuideModal';
import { LiveInboxModal, type InboxAppPlatform } from './components/LiveInboxModal';
import { OutcomeAndViralView } from './components/OutcomeAndViralView';
import { PairingMixerView } from './components/PairingMixerView';
import { PartnerAuditionView } from './components/PartnerAuditionView';
import { PixiCubAcademyStage } from './components/PixiCubAcademyStage';
import { PopCultureTriviaModal } from './components/PopCultureTriviaModal';
import { TopHudBar, type ClubTopTab } from './components/TopHudBar';
import { VelvetJournalView } from './components/VelvetJournalView';
import { APP_SWIPE_PROFILES, HER_SWIPE_PROFILES } from './data/appProfiles';
import { EPISODES } from './data/episodes';
import {
  computeDateLetterRank,
  computeDateodexVerdict,
  loadDateodex,
  recordDateodexCourtVote,
  stampDateodexCharacters,
  unlockDateodexPolaroid,
  type DateodexState,
} from './domain/dateodex';
import {
  applyUnlockCodeOrQuery,
  grantFounderAccess,
  grantRewardCredits,
  loadWallet,
  revokeFounderAccess,
  saveWallet,
  spendCredits,
  unlockEpisodeWithCredits,
  unlockStamp,
  verifyFounderPassphrase,
  type WalletState,
} from './domain/economy';
import {
  applyEpisodeChoice,
  applyMinigameBonus,
  computeRunSummary,
  createCharacterDateRun,
  createRun,
  recordAppSwipe,
  rewindLastChoice,
  type GameRunState,
  type RunPacingMode,
} from './domain/gameEngine';
import { loadMatchCareer, saveMatchCareer } from './domain/matchCareer';
import {
  getLevelInfo,
  grantAdventureXp,
  loadAdventureProgress,
  type AdventureProgressState,
} from './domain/progression';
import {
  analyzePairing,
  HER_ARCHETYPES,
  HIS_ARCHETYPES,
  type HerArchetype,
  type HisArchetype,
  type PlayerRole,
} from './domain/taxonomy';
import { trackEvent } from './lib/analytics';
import {
  buildDilemmaShareLink,
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

type ScreenPhase = 'mixer' | 'swipes' | 'episodes' | 'outcome' | 'audition';

function readInitialUrlState() {
  if (typeof window === 'undefined') {
    return {
      challenge: null as ChallengePayload | null,
      corruptedChallenge: false,
      dilemmaId: null as string | null,
      journalSlug: null as string | null,
      unlockQuery: '',
      stripeSessionId: null as string | null,
      refCode: null as string | null,
      openChecklist: false,
      openQuiz: false,
      openWorld: false,
      openAcademy: false,
      openCourt: false,
      openAbout: false,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const rawChallenge = params.get('challenge');
  const decoded = decodeChallengeParam(rawChallenge);
  const corruptedChallenge = Boolean(rawChallenge && !decoded);
  const dilemmaId = params.get('dilemma');
  const journalSlug = params.get('journal');
  const unlockQuery = params.has('unlock') ? window.location.search : '';
  const stripeSessionId = params.get('session_id');
  const refCode = params.get('ref');
  const openChecklist = params.get('checklist') === '1';
  const openQuiz = params.get('quiz') === '1';
  const openWorld = params.get('world') === '1';
  const openAcademy = params.get('academy') === '1';
  const openCourt = params.get('court') === '1';
  const openAbout = params.get('about') === '1';

  return {
    challenge: decoded,
    corruptedChallenge,
    dilemmaId,
    journalSlug,
    unlockQuery,
    stripeSessionId,
    refCode,
    openChecklist,
    openQuiz,
    openWorld,
    openAcademy,
    openCourt,
    openAbout,
  };
}

export default function App() {
  const initialUrl = useMemo(() => readInitialUrlState(), []);

  const initialHerDeckIdx = useMemo(() => {
    if (!initialUrl.dilemmaId) return -1;
    return HER_SWIPE_PROFILES.findIndex((p) => p.id === initialUrl.dilemmaId);
  }, [initialUrl.dilemmaId]);

  const initialCubDeckIdx = useMemo(() => {
    if (!initialUrl.dilemmaId) return -1;
    return APP_SWIPE_PROFILES.findIndex((p) => p.id === initialUrl.dilemmaId);
  }, [initialUrl.dilemmaId]);

  const initialSwipeProfileIdx =
    initialCubDeckIdx >= 0 ? initialCubDeckIdx : initialHerDeckIdx;

  const initialArchetypeHer = useMemo(
    () =>
      initialUrl.dilemmaId
        ? HER_ARCHETYPES.find((h) => h.id === initialUrl.dilemmaId)
        : undefined,
    [initialUrl.dilemmaId],
  );
  const initialArchetypeHis = useMemo(
    () =>
      initialUrl.dilemmaId
        ? HIS_ARCHETYPES.find((c) => c.id === initialUrl.dilemmaId)
        : undefined,
    [initialUrl.dilemmaId],
  );

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
    if (initialHerDeckIdx >= 0) return 'him';
    if (initialCubDeckIdx >= 0) return 'her';
    if (initialArchetypeHer) return 'him';
    if (initialArchetypeHis) return 'her';
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
    if (!import.meta.env.VITEST && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('velvet_player_role_v1', next);
      } catch {
        // Ignore storage error
      }
    }
  };
  const [her, setHer] = useState<HerArchetype>(() => initialArchetypeHer ?? HER_ARCHETYPES[0]);
  const [his, setHis] = useState<HisArchetype>(() => initialArchetypeHis ?? HIS_ARCHETYPES[0]);
  const [rehabTargetId, setRehabTargetId] = useState<string | null>(null);
  const [pacingMode, setPacingMode] = useState<RunPacingMode>('curated');
  const [customEditCount, setCustomEditCount] = useState<number>(0);
  const [selectedVipIds, setSelectedVipIds] = useState<string[]>([]);
  const [adventureProgress, setAdventureProgress] = useState<AdventureProgressState>(() =>
    loadAdventureProgress(),
  );
  const [dateodex, setDateodex] = useState<DateodexState>(() => loadDateodex());
  const [academySubTab, setAcademySubTab] = useState<'obedience' | 'scanner' | 'dateodex'>(
    'obedience',
  );
  const [activeTab, setActiveTab] = useState<ClubTopTab>(
    initialUrl.journalSlug
      ? 'journal'
      : initialUrl.openAbout
        ? 'about'
        : initialUrl.openWorld
          ? 'world'
          : initialUrl.openAcademy
            ? 'academy'
            : initialUrl.openCourt
              ? 'courtroom'
              : 'game',
  );
  const [preferredInboxContactId, setPreferredInboxContactId] = useState<string | null>(null);
  const [inboxInitialPlatform, setInboxInitialPlatform] = useState<InboxAppPlatform>('tinder');
  const [activeCareerMatchId, setActiveCareerMatchId] = useState<string | null>(null);
  const [completedDateNum, setCompletedDateNum] = useState<1 | 2 | 3 | undefined>(undefined);

  const [fieldGuideOpen, setFieldGuideOpen] = useState(false);
  const [boutiqueOpen, setBoutiqueOpen] = useState(false);
  const [popTriviaOpen, setPopTriviaOpen] = useState(initialUrl.openQuiz);
  const [checklistOpen, setChecklistOpen] = useState(initialUrl.openChecklist);
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
  const [founderApronClicks, setFounderApronClicks] = useState<number | null>(null);
  const [founderVaultTab, setFounderVaultTab] = useState<'chats' | 'spills' | 'waitlist'>('chats');
  const [founderAiLogs, setFounderAiLogs] = useState<
    { persona?: string; platform?: string; playerMsg?: string; aiReply?: string; passed?: boolean }[]
  >([]);
  const [founderFeedbackLogs, setFounderFeedbackLogs] = useState<
    {
      persona?: string;
      reaction?: string;
      aiReply?: string;
      note?: string;
      optInContact?: string;
    }[]
  >([]);
  const [founderWaitlistLogs, setFounderWaitlistLogs] = useState<
    { role?: string; city?: string; vibe?: string; contact?: string }[]
  >([]);
  const [noticeBanner, setNoticeBanner] = useState<string | null>(
    initialUrl.corruptedChallenge
      ? 'Heads up: that audition link looked truncated or expired, pick your match on the phone below!'
      : null,
  );
  const [activeChallenge, setActiveChallenge] = useState<ChallengePayload | null>(
    initialUrl.challenge,
  );
  const [swipeStartIdx, setSwipeStartIdx] = useState<number>(
    initialSwipeProfileIdx >= 0 ? initialSwipeProfileIdx : 0,
  );

  const pairing = useMemo(() => analyzePairing(her, his, role), [her, his, role]);

  const [run, setRun] = useState<GameRunState | null>(() => {
    const defaultRole: PlayerRole = initialHerDeckIdx >= 0 ? 'him' : 'her';
    const defaultPairing = analyzePairing(HER_ARCHETYPES[0], HIS_ARCHETYPES[0], defaultRole);
    if (initialSwipeProfileIdx >= 0) {
      return createRun(defaultPairing);
    }
    if (initialUrl.dilemmaId && EPISODES.some((e) => e.id === initialUrl.dilemmaId)) {
      return createRun(defaultPairing, [], initialUrl.dilemmaId);
    }
    return null;
  });

  const [phase, setPhase] = useState<ScreenPhase>(() => {
    if (initialUrl.challenge) return 'audition';
    if (initialSwipeProfileIdx >= 0) return 'swipes';
    if (initialUrl.dilemmaId && EPISODES.some((e) => e.id === initialUrl.dilemmaId)) {
      return 'episodes';
    }
    return 'mixer';
  });

  const updateWallet = (next: WalletState) => {
    setWallet(next);
    saveWallet(next);
  };

  const handleGainAdventureXp = (
    deltaXp: number,
    patch?: Partial<AdventureProgressState>,
  ) => {
    setAdventureProgress((prev) => {
      const res = grantAdventureXp(prev, deltaXp, patch);
      if (res.leveledUp) {
        setNoticeBanner(
          `🕹️ LEVEL UP! You reached Lv.${res.levelInfo.level} ${res.levelInfo.badgeEmoji} ${res.levelInfo.title}!`,
        );
      }
      return res.next;
    });
  };

  useEffect(() => {
    if (!founderDeviceSeal || import.meta.env.VITEST || typeof fetch !== 'function') return;
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
          sampleClicks?: Record<string, number>;
          recentAiLogs?: {
            persona?: string;
            platform?: string;
            playerMsg?: string;
            aiReply?: string;
            passed?: boolean;
          }[];
          recentFeedback?: {
            persona?: string;
            reaction?: string;
            aiReply?: string;
            note?: string;
            optInContact?: string;
          }[];
          waitlistEntries?: {
            role?: string;
            city?: string;
            vibe?: string;
            contact?: string;
          }[];
        };
        if (!cancelled && data.authorized === true) {
          setWallet((prev) => grantFounderAccess(prev));
          if (data.amazonAssociateTag !== undefined) {
            setFounderTagInput(data.amazonAssociateTag);
            setFounderTagProtected(Boolean(data.affiliateProtected));
          }
          if (
            data.sampleClicks &&
            typeof data.sampleClicks['houseboy-linen-apron'] === 'number'
          ) {
            setFounderApronClicks(data.sampleClicks['houseboy-linen-apron']);
          }
          if (Array.isArray(data.recentAiLogs)) setFounderAiLogs(data.recentAiLogs);
          if (Array.isArray(data.recentFeedback)) setFounderFeedbackLogs(data.recentFeedback);
          if (Array.isArray(data.waitlistEntries)) setFounderWaitlistLogs(data.waitlistEntries);
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
        credits: result.credits ?? 15,
      });
      setNoticeBanner('🎉 Stripe Checkout verified! Your VIP / Club Credits are live.');
    });
  }, [initialUrl.stripeSessionId, wallet.claimedRewards]);

  const handleFounderUnlockSubmit = async (e: React.FormEvent) => {
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
            sampleClicks?: Record<string, number>;
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
            if (
              data.sampleClicks &&
              typeof data.sampleClicks['houseboy-linen-apron'] === 'number'
            ) {
              setFounderApronClicks(data.sampleClicks['houseboy-linen-apron']);
            }
          }
        } else if (res.status === 401 || res.status === 400) {
          setFounderAuthError('Invalid Founder passphrase. Access denied.');
          return;
        }
      } catch {
        // Fall through to local check only in offline Vitest unit test runner
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
    setNoticeBanner(
      '👑 Founder Vault unlocked on THIS browser only (every other visitor stays in normal 5-Credit player mode).',
    );
  };

  const handleSaveFounderAmazonTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!founderSessionPass && !founderDeviceSeal) {
      setFounderModalOpen(true);
      setFounderAuthError('Re-enter your Founder passphrase once to update KV config.');
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
            ? `✓ Protected! /api/go/* now injects tag=${cleanTag}`
            : 'Cleared tag (links still route safely via /api/go/*)',
        );
      } else {
        setFounderTagStatus(data.error || 'Could not save tag.');
      }
    } catch {
      setFounderTagStatus('Saved locally for session (deploy Worker for edge KV sync).');
    }
  };

  const handleLockFounderMode = () => {
    updateWallet(revokeFounderAccess(wallet));
    setFounderSessionPass('');
    setFounderDeviceSeal('');
    try {
      window.localStorage.removeItem(FOUNDER_DEVICE_SEAL_KEY);
    } catch {}
    setFounderTagStatus(null);
    setNoticeBanner('🔒 Founder Mode locked: viewing exact normal 5-Credit player mode.');
  };

  const handleFounderPlaytestJump = (target: 'mixer' | 'swipes' | 'episodes' | 'outcome') => {
    setActiveTab('game');
    setActiveChallenge(null);
    if (target === 'mixer') {
      setPhase('mixer');
      return;
    }
    if (target === 'swipes') {
      if (!run) setRun(createRun(pairing, selectedVipIds, undefined, pacingMode));
      setPhase('swipes');
      return;
    }
    if (target === 'episodes') {
      if (!run) setRun(createRun(pairing, selectedVipIds, undefined, pacingMode));
      setPhase('episodes');
      return;
    }
    if (target === 'outcome') {
      if (run && run.history.length > 0) {
        setPhase('outcome');
        return;
      }
      let demoRun = createRun(pairing, selectedVipIds, undefined, 'curated');
      for (let i = 0; i < Math.min(3, demoRun.episodeQueue.length); i++) {
        demoRun = applyEpisodeChoice(demoRun, 0);
      }
      setRun(demoRun);
      setPhase('outcome');
    }
  };

  const handleToggleVipEpisode = (episodeId: string, creditCost: number) => {
    if (selectedVipIds.includes(episodeId)) {
      setSelectedVipIds((prev) => prev.filter((id) => id !== episodeId));
      return;
    }
    const res = unlockEpisodeWithCredits(wallet, episodeId, creditCost);
    if (!res.ok) {
      setBoutiqueOpen(true);
      return;
    }
    updateWallet(res.wallet);
    setSelectedVipIds((prev) => [...prev, episodeId]);
  };

  const handleStartGame = () => {
    let activeWallet = wallet;
    if (customEditCount >= 2 && !wallet.isVip && !wallet.isFounderUnlimited) {
      const spent = spendCredits(wallet, 1);
      if (!spent.ok) {
        setBoutiqueOpen(true);
        return;
      }
      activeWallet = spent.wallet;
    }
    const stamped = unlockStamp(activeWallet, pairing.felineTier);
    updateWallet(stamped);
    setSwipeStartIdx(0);
    setActiveCareerMatchId(null);
    setCompletedDateNum(undefined);
    setNoticeBanner(null);
    const freshRun = createRun(pairing, selectedVipIds, undefined, pacingMode);
    setRun(freshRun);
    setPhase('swipes');
    setActiveTab('game');
  };

  const handleStartCharacterDate = (contactId: string, contactRole: 'her' | 'him') => {
    const career = loadMatchCareer();
    const rawStage = career.dateStageByMatchId[contactId] ?? 0;
    const boundedStage = Math.min(2, rawStage) as 0 | 1 | 2;
    const priorStats = career.statsByMatchId[contactId];

    let freshPairing: ReturnType<typeof analyzePairing>;
    if (contactRole === 'her') {
      const pickedHer = HER_ARCHETYPES.find((h) => h.id === contactId) ?? her;
      setHer(pickedHer);
      setRole('him');
      freshPairing = analyzePairing(pickedHer, his, 'him');
    } else {
      const pickedHis = HIS_ARCHETYPES.find((c) => c.id === contactId) ?? his;
      setHis(pickedHis);
      setRole('her');
      freshPairing = analyzePairing(her, pickedHis, 'her');
    }

    if (!career.matchedIds.includes(contactId)) {
      career.matchedIds = [contactId, ...career.matchedIds];
      saveMatchCareer(career);
    }

    setActiveCareerMatchId(contactId);
    setCompletedDateNum((boundedStage + 1) as 1 | 2 | 3);
    setRun(createCharacterDateRun(freshPairing, boundedStage, priorStats));
    trackEvent('date_stage_started', {
      contact_id: contactId,
      date_number: boundedStage + 1,
    });
    setActiveTab('game');
    setPhase('episodes');
  };

  const handleShareDilemma = async (id: string, title: string) => {
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin.startsWith('http')
        ? `${window.location.origin}${window.location.pathname}`
        : BRAND_CONFIG.publicBaseUrl;
    const link = buildDilemmaShareLink(id, baseUrl);
    await shareOrCopy({
      title: 'Ghost or Train? • Cougars & Cubs Club',
      text: `👀 Group-chat verdict needed: "${title}"`,
      url: link,
    });
    setNoticeBanner('📤 Dilemma link copied, drop it in the group chat!');
  };

  const handleQuickCreateAudition = async () => {
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin.startsWith('http')
        ? `${window.location.origin}${window.location.pathname}`
        : BRAND_CONFIG.publicBaseUrl;
    const episodeIds = createRun(pairing, selectedVipIds)
      .episodeQueue.slice(0, 5)
      .map((e) => e.id);
    const link = encodeChallengeLink(
      {
        v: 1,
        senderName: role === 'her' ? her.name : his.name,
        senderRole: role,
        herId: her.id,
        hisId: his.id,
        episodeIds,
        preferredChoiceIndices: episodeIds.map(() => 0),
      },
      baseUrl,
    );
    await shareOrCopy({
      title: 'Pass My 60-Second Cougars & Cubs Vetting Audition',
      text: 'Think you’d survive dating me? Take my 60-second Cougars & Cubs Vetting Audition 👀',
      url: link,
    });
    setNoticeBanner('🔗 2-Player Vetting Audition link copied! Text it to your Cougar or Cub.');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopHudBar
        wallet={wallet}
        activeTab={activeTab}
        activePhase={phase}
        levelBadge={`Lv.${getLevelInfo(adventureProgress.xp).level}`}
        onSelectTab={setActiveTab}
        onOpenSwipeDeck={handleStartGame}
        onOpenFieldGuide={() => setFieldGuideOpen(true)}
        onOpenBoutique={() => setBoutiqueOpen(true)}
        onOpenLiveInbox={() => {
          setInboxInitialPlatform('tinder');
          setActiveTab('inbox');
        }}
        onOpenPopTrivia={() => setPopTriviaOpen(true)}
        onOpenChecklist={() => setChecklistOpen(true)}
        onRequestFounderModal={() => {
          setFounderAuthError(null);
          setFounderModalOpen(true);
        }}
        onGoHome={() => {
          setActiveTab('game');
          setPhase('mixer');
          setActiveChallenge(null);
          setNoticeBanner(null);
        }}
      />

      {/* Password-Protected Founder Playtest & Affiliate Vault Bar */}
      {wallet.isFounderUnlimited && (
        <div className="border-b-[2.5px] border-[#1E1022] bg-[#FFF1CC] px-4 py-3 sm:px-6">
          <div className="mx-auto w-full max-w-6xl space-y-2.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-extrabold text-[#1E1022]">
                <Wrench className="h-4 w-4 text-[#FF2E63]" />
                👑 Founder Playtest Vault • ∞ Credits &amp; All VIP Unlocked
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    ['mixer', '1. Phone Landing'],
                    ['swipes', '2. Swipe Deck'],
                    ['episodes', '3. Scene Stage'],
                    ['outcome', '4. Verdict & 9:16 Card'],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleFounderPlaytestJump(key)}
                    className={`pop-btn rounded-xl px-3 py-1.5 font-bold cursor-pointer ${
                      activeTab === 'game' && phase === key
                        ? 'bg-[#FF2E63] text-white'
                        : 'bg-white text-[#1E1022] hover:bg-[#FFF4F7]'
                    }`}
                  >
                    {label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleLockFounderMode}
                  className="pop-btn inline-flex items-center gap-1 rounded-xl bg-[#1E1022] px-3 py-1.5 font-bold text-white cursor-pointer"
                >
                  <Lock className="h-3 w-3" />
                  <span>Lock Founder Mode</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#1E1022]/15 pt-2.5">
              <select
                aria-label="Founder instant scene jumper"
                defaultValue=""
                onChange={(e) => {
                  const epId = e.target.value;
                  if (!epId) return;
                  setRun(createRun(pairing, selectedVipIds, epId));
                  setActiveTab('game');
                  setPhase('episodes');
                }}
                className="max-w-full sm:max-w-sm rounded-xl border-2 border-[#1E1022] bg-white px-3 py-1.5 text-xs font-bold text-[#1E1022]"
              >
                <option value="">⚡ Jump to Any Scene / Minigame ({EPISODES.length})...</option>
                {EPISODES.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    [Stage {ep.stage}
                    {ep.minigame ? ` • 🎮 ${ep.minigame}` : ' • ✨ tactile'}
                    {ep.isVip ? ' • 👑 VIP' : ''}] {ep.title}
                  </option>
                ))}
              </select>

              <form
                onSubmit={handleSaveFounderAmazonTag}
                className="flex flex-wrap items-center gap-2"
              >
                <span
                  className={`inline-flex items-center gap-1 rounded-xl border-2 border-[#1E1022] px-2.5 py-1 font-bold ${
                    founderTagProtected
                      ? 'bg-[#D1FAE5] text-[#065F46]'
                      : 'bg-white text-[#1E1022]'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {founderTagProtected
                    ? 'Amazon /api/go/* Tag Active'
                    : 'Amazon /api/go/* Gateway Ready'}
                  {founderApronClicks !== null ? ` • Apron Clicks: ${founderApronClicks}` : ''}
                </span>
                <input
                  type="text"
                  aria-label="Amazon Associate Tag"
                  placeholder="yourtag-20"
                  value={founderTagInput}
                  onChange={(e) => setFounderTagInput(e.target.value)}
                  className="w-36 rounded-xl border-2 border-[#1E1022] bg-white px-3 py-1 text-xs font-bold text-[#1E1022]"
                />
                <button
                  type="submit"
                  className="pop-btn inline-flex items-center gap-1 rounded-xl bg-[#FF2E63] px-3 py-1 font-bold text-white cursor-pointer"
                >
                  <Check className="h-3 w-3" />
                  <span>Save Tag</span>
                </button>
                {founderTagStatus && (
                  <span className="text-[#065F46] font-bold">{founderTagStatus}</span>
                )}
              </form>
            </div>

            {(founderAiLogs.length > 0 ||
              founderFeedbackLogs.length > 0 ||
              founderWaitlistLogs.length > 0) && (
              <div className="border-t border-[#1E1022]/15 pt-2.5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-extrabold text-[#1E1022]">
                    📊 Live Idea &amp; Player Telemetry Vault
                  </div>
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      onClick={() => setFounderVaultTab('chats')}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold cursor-pointer ${
                        founderVaultTab === 'chats'
                          ? 'bg-[#18101E] text-white'
                          : 'bg-white text-[#18101E]'
                      }`}
                    >
                      💬 AI Chats ({founderAiLogs.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFounderVaultTab('spills')}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold cursor-pointer ${
                        founderVaultTab === 'spills'
                          ? 'bg-[#18101E] text-white'
                          : 'bg-white text-[#18101E]'
                      }`}
                    >
                      🫖 Spills ({founderFeedbackLogs.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFounderVaultTab('waitlist')}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold cursor-pointer ${
                        founderVaultTab === 'waitlist'
                          ? 'bg-[#18101E] text-white'
                          : 'bg-white text-[#18101E]'
                      }`}
                    >
                      🗝️ Waitlist ({founderWaitlistLogs.length})
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        {noticeBanner && (
          <div className="vice-panel flex items-center justify-between gap-3 rounded-2xl bg-[#FFBE0B] px-4 py-3 text-sm font-extrabold text-[#1E1022]">
            <span>{noticeBanner}</span>
            <button
              type="button"
              onClick={() => setNoticeBanner(null)}
              className="rounded-lg border-2 border-[#1E1022] bg-white px-2 py-0.5 text-xs font-extrabold text-[#1E1022] cursor-pointer"
              aria-label="Dismiss notice"
            >
              ✕
            </button>
          </div>
        )}

        {activeTab === 'about' ? (
          <AboutClubView
            onGoToPhoneLanding={() => {
              setActiveTab('game');
              setPhase('mixer');
            }}
            onOpenChats={() => setActiveTab('inbox')}
            onOpenCubAcademy={() => {
              setAcademySubTab('obedience');
              setActiveTab('academy');
            }}
            onOpenWorldMap={() => setActiveTab('world')}
            onOpenBoutique={() => setBoutiqueOpen(true)}
            onOpenGuides={() => setActiveTab('journal')}
          />
        ) : activeTab === 'inbox' ? (
          <LiveInboxModal
            open={true}
            wallet={wallet}
            playerRole={role}
            onChangePlayerRole={setRole}
            preferredHerId={her.id}
            preferredHisId={his.id}
            preferredContactId={preferredInboxContactId}
            initialPlatform={inboxInitialPlatform}
            onClose={() => setActiveTab('game')}
            onJumpToWorld={() => setActiveTab('world')}
            onOpenCubAcademyRehab={(targetId) => {
              setRehabTargetId(targetId);
              const foundHis = HIS_ARCHETYPES.find((c) => c.id === targetId);
              const foundHer = HER_ARCHETYPES.find((h) => h.id === targetId);
              if (foundHis) setHis(foundHis);
              if (foundHer) setHer(foundHer);
              setAcademySubTab('obedience');
              setActiveTab('academy');
            }}
            onStartDateWithContact={handleStartCharacterDate}
            onGrantBonusCredits={(key, amt) => {
              const res = grantRewardCredits(wallet, key, amt);
              if (res.granted) updateWallet(res.wallet);
              return res.granted;
            }}
            onSpendCredits={(amt) => {
              const res = spendCredits(wallet, amt);
              if (!res.ok) {
                setBoutiqueOpen(true);
                return false;
              }
              updateWallet(res.wallet);
              return true;
            }}
            onSpendCreditOrOpenBoutique={() => {
              const res = spendCredits(wallet, 1);
              if (!res.ok) {
                setBoutiqueOpen(true);
                return false;
              }
              updateWallet(res.wallet);
              return true;
            }}
          />
        ) : activeTab === 'academy' ? (
          <PixiCubAcademyStage
            role={role}
            her={her}
            his={his}
            dateodex={dateodex}
            initialSubTab={academySubTab}
            onBackToRoster={() => setActiveTab('game')}
            onSelectHis={setHis}
            onSelectHer={setHer}
            onGraduateCub={(hisId, herId) => {
              handleGainAdventureXp(45);
              const career = loadMatchCareer();
              const idsToRehab = Array.from(
                new Set([
                  hisId,
                  ...(rehabTargetId ? [rehabTargetId] : []),
                  ...(role === 'him' ? [herId] : []),
                ]),
              );
              for (const rid of idsToRehab) {
                if (!career.rehabbedIds.includes(rid)) {
                  career.rehabbedIds = [...career.rehabbedIds, rid];
                }
                career.unmatchedIds = career.unmatchedIds.filter((id) => id !== rid);
              }
              saveMatchCareer(career);
              setRehabTargetId(null);
              trackEvent('cub_rehab_graduated', { cub_id: hisId });
              setDateodex((prev) =>
                stampDateodexCharacters(
                  prev,
                  [
                    {
                      characterId: hisId,
                      verdict: 'crowned',
                      rank: 'S',
                      note: 'Certified Good Boy™ (PixiJS Obedience S-Rank)',
                    },
                    {
                      characterId: herId,
                      verdict: 'crowned',
                      rank: 'S',
                      note: 'Master Clicker Trainer',
                    },
                  ],
                  ['polaroid-obedience-s'],
                ),
              );
              return false;
            }}
            onCompleteRoomScan={(hisId) => {
              handleGainAdventureXp(30);
              setDateodex((prev) => {
                const withPol = unlockDateodexPolaroid(prev, 'polaroid-sanctuary-scan');
                return stampDateodexCharacters(withPol, [
                  {
                    characterId: hisId,
                    verdict: 'crowned',
                    rank: 'A',
                    note: '4-Pillow Sanctuary Approved',
                  },
                ]);
              });
            }}
            onOpenCourtroom={() => setActiveTab('courtroom')}
          />
        ) : activeTab === 'courtroom' ? (
          <ClubCourtroomView
            role={role}
            onBackToRoster={() => setActiveTab('game')}
            onOpenCubAcademy={() => {
              setAcademySubTab('obedience');
              setActiveTab('academy');
            }}
            onCastCourtVote={() => {
              handleGainAdventureXp(15);
              setDateodex((prev) => recordDateodexCourtVote(prev));
            }}
            onGrantBonusCredits={(key) => {
              const res = grantRewardCredits(wallet, key, 0);
              if (res.granted) updateWallet(res.wallet);
              return false;
            }}
          />
        ) : activeTab === 'journal' ? (
          <VelvetJournalView
            initialSlug={initialUrl.journalSlug}
            onPlayScenario={(episodeId) => {
              setRun(createRun(pairing, selectedVipIds, episodeId));
              setActiveTab('game');
              setPhase('episodes');
            }}
          />
        ) : activeTab === 'world' ? (
          <EightBitAdventureWorld
            role={role}
            herName={her.name}
            hisName={his.name}
            progress={adventureProgress}
            defaultExpanded={true}
            onGainXp={handleGainAdventureXp}
            onEnterEpisode={(episodeId) => {
              setRun(createRun(pairing, selectedVipIds, episodeId));
              setActiveTab('game');
              setPhase('episodes');
            }}
            onOpenBoutique={() => setBoutiqueOpen(true)}
            onOpenFullTrivia={() => setPopTriviaOpen(true)}
            onOpenFullChecklist={() => setChecklistOpen(true)}
          />
        ) : phase === 'audition' && activeChallenge ? (
          <PartnerAuditionView
            challenge={activeChallenge}
            onExitToMainGame={() => {
              setActiveChallenge(null);
              setPhase('mixer');
            }}
          />
        ) : phase === 'swipes' && run ? (
          <AppSwipeStage
            key={`${role}-${swipeStartIdx}`}
            role={role}
            credits={wallet.credits}
            isFounderUnlimited={Boolean(wallet.isFounderUnlimited)}
            initialProfileIndex={swipeStartIdx}
            onBackToRoster={() => setPhase('mixer')}
            onOpenLiveChat={() => setActiveTab('inbox')}
            onSpendXrayCredit={() => {
              const res = spendCredits(wallet, 1);
              if (!res.ok) {
                setBoutiqueOpen(true);
                return false;
              }
              updateWallet(res.wallet);
              return true;
            }}
            onSwipeProfile={(profileId, dir) => {
              setRun((prev) => (prev ? recordAppSwipe(prev, profileId, dir) : prev));
            }}
            onShareDilemma={handleShareDilemma}
            onCompleteSwipes={() => setPhase('episodes')}
            onOpenPopTrivia={() => setPopTriviaOpen(true)}
            onOpenChecklist={() => setChecklistOpen(true)}
          />
        ) : phase === 'episodes' && run ? (
          <EpisodeStage
            run={run}
            credits={wallet.credits}
            onBackToRoster={() => setPhase('mixer')}
            onJumpToSwipes={() => setPhase('swipes')}
            onOpenLiveChat={() => setActiveTab('inbox')}
            onSelectChoice={(choiceIdx) => {
              handleGainAdventureXp(20);
              setRun((prev) => {
                if (!prev) return prev;
                return applyEpisodeChoice(prev, choiceIdx);
              });
            }}
            onCompleteMinigame={(episodeId, bonus, badge) => {
              handleGainAdventureXp(20);
              setRun((prev) => (prev ? applyMinigameBonus(prev, episodeId, bonus, badge) : prev));
            }}
            onRewindLast={() => {
              const res = spendCredits(wallet, 1);
              if (!res.ok) {
                setBoutiqueOpen(true);
                return false;
              }
              updateWallet(res.wallet);
              setRun((prev) => (prev ? rewindLastChoice(prev) : prev));
              return true;
            }}
            onShareDilemma={handleShareDilemma}
            onOpenBoutique={() => setBoutiqueOpen(true)}
            onFinishRun={() => {
              if (run) {
                const avg = Math.round(
                  (run.stats.maturity +
                    run.stats.chivalry +
                    run.stats.eq +
                    run.stats.chemistry) /
                    4,
                );
                const busted = run.status === 'busted';
                const rank = computeDateLetterRank(avg, busted);
                const verdict = computeDateodexVerdict(avg, busted);
                const extraPols = ['polaroid-kitchen-apron'];
                if (run.stats.chemistry >= 75 && !busted) {
                  extraPols.push('polaroid-coastal-sunset');
                }
                setDateodex((prev) =>
                  stampDateodexCharacters(
                    prev,
                    [
                      {
                        characterId: run.pairing.her.id,
                        verdict,
                        rank,
                        note: 'Date Run Complete',
                      },
                      {
                        characterId: run.pairing.his.id,
                        verdict,
                        rank,
                        note: 'Date Run Complete',
                      },
                    ],
                    extraPols,
                  ),
                );

                if (activeCareerMatchId && !busted) {
                  const career = loadMatchCareer();
                  const prevStage = career.dateStageByMatchId[activeCareerMatchId] ?? 0;
                  career.dateStageByMatchId[activeCareerMatchId] = Math.min(3, prevStage + 1) as
                    | 0
                    | 1
                    | 2
                    | 3;
                  career.statsByMatchId[activeCareerMatchId] = { ...run.stats };
                  saveMatchCareer(career);
                }

                trackEvent('date_stage_completed', {
                  busted,
                  rank,
                  overall_score: avg,
                  date_number: completedDateNum ?? 1,
                });
              }
              setPhase('outcome');
            }}
            onOpenPopTrivia={() => setPopTriviaOpen(true)}
            onOpenChecklist={() => setChecklistOpen(true)}
          />
        ) : phase === 'outcome' && run ? (
          <OutcomeAndViralView
            run={run}
            summary={computeRunSummary(run)}
            completedDateNumber={completedDateNum}
            onReturnToImessage={
              activeCareerMatchId
                ? () => {
                    setPreferredInboxContactId(activeCareerMatchId);
                    setInboxInitialPlatform('imessage');
                    setActiveTab('inbox');
                  }
                : undefined
            }
            onClaimShareBonus={() => {
              const res = grantRewardCredits(
                wallet,
                'first_share',
                MONETIZATION_CONFIG.shareRewardCredits,
              );
              if (res.granted) updateWallet(res.wallet);
              return res.granted;
            }}
            onPlayAgain={() => setPhase('mixer')}
            onOpenBoutique={() => setBoutiqueOpen(true)}
          />
        ) : (
          <PairingMixerView
            role={role}
            her={her}
            his={his}
            pairing={pairing}
            wallet={wallet}
            selectedVipIds={selectedVipIds}
            pacingMode={pacingMode}
            customEditCount={customEditCount}
            noticeBanner={null}
            onChangeRole={setRole}
            onChangePacingMode={setPacingMode}
            onSelectHer={(nextHer) => {
              setHer(nextHer);
              setCustomEditCount(0);
              if (nextHer.id === 'sienna-junior-cougar') {
                const miles = HIS_ARCHETYPES.find((c) => c.id === 'miles-millennial-cub');
                if (miles) {
                  setHis(miles);
                  return;
                }
              }
              if (his.age >= nextHer.age) {
                setHis((prev) => ({ ...prev, age: Math.max(21, nextHer.age - 1) }));
              }
            }}
            onSelectHis={(nextHis) => {
              setHis(nextHis);
              setCustomEditCount(0);
              if (her.age <= nextHis.age) {
                setHer((prev) => ({ ...prev, age: Math.min(72, nextHis.age + 1) }));
              }
            }}
            onUpdateHerCustom={(nextHer) => {
              const onlyDrinkChange =
                nextHer.signatureDrink !== her.signatureDrink &&
                nextHer.name === her.name &&
                nextHer.zodiac === her.zodiac;
              setHer(nextHer);
              if (!onlyDrinkChange) {
                setCustomEditCount((c) => c + 1);
              }
            }}
            onUpdateHisCustom={(nextHis) => {
              setHis(nextHis);
              setCustomEditCount((c) => c + 1);
            }}
            onAdjustHerAge={(d) =>
              setHer((prev) => ({
                ...prev,
                age: Math.max(his.age + 1, Math.min(72, prev.age + d)),
              }))
            }
            onAdjustHisAge={(d) =>
              setHis((prev) => ({
                ...prev,
                age: Math.max(21, Math.min(her.age - 1, prev.age + d)),
              }))
            }
            onToggleVipEpisode={handleToggleVipEpisode}
            onStartGame={handleStartGame}
            onStartCharacterDate={handleStartCharacterDate}
            onOpenBoutique={() => setBoutiqueOpen(true)}
            onOpenLiveInbox={(matchId) => {
              if (matchId) setPreferredInboxContactId(matchId);
              setInboxInitialPlatform('tinder');
              setActiveTab('inbox');
            }}
            onOpenPopTrivia={() => setPopTriviaOpen(true)}
            onOpenChecklist={() => setChecklistOpen(true)}
            onQuickCreateAudition={handleQuickCreateAudition}
            onOpenFieldGuide={() => setFieldGuideOpen(true)}
            onOpenWorldTab={() => setActiveTab('world')}
            onOpenCubAcademy={(sub = 'obedience') => {
              setAcademySubTab(sub);
              setActiveTab('academy');
            }}
            onOpenCourtroom={() => setActiveTab('courtroom')}
            onOpenAbout={() => setActiveTab('about')}
            dateodexStampedCount={Object.keys(dateodex.stamps).length}
            adventureProgress={adventureProgress}
            onGainAdventureXp={handleGainAdventureXp}
            onJumpToMapScene={(episodeId) => {
              setRun(createRun(pairing, selectedVipIds, episodeId));
              setActiveTab('game');
              setPhase('episodes');
            }}
          />
        )}
      </main>

      <footer className="border-t border-[#18101E]/10 bg-white py-8 text-sm text-[#475569]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 grid gap-6 md:grid-cols-[1.3fr_1fr_1fr] items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#FD267A] to-[#FF6036] text-xs text-white">
                🐆
              </span>
              <span className="font-display text-base text-[#18101E]">{BRAND_CONFIG.name}</span>
            </div>
            <p className="text-xs leading-relaxed text-[#64748B] max-w-sm">
              Interactive romantic-comedy dating simulator, multi-platform AI chat studio, and age-gap relationship guide for consenting adults (21+).
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
              Play Modes
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('game');
                  setPhase('mixer');
                }}
                className="rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1 text-[#18101E] cursor-pointer"
              >
                Phone Feed
              </button>
              <button
                type="button"
                onClick={handleStartGame}
                className="rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1 text-[#18101E] cursor-pointer"
              >
                Trap-Spotter Deck
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('inbox')}
                className="rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1 text-[#18101E] cursor-pointer"
              >
                Live Chats &amp; Discord
              </button>
              <button
                type="button"
                onClick={() => {
                  setAcademySubTab('obedience');
                  setActiveTab('academy');
                }}
                className="rounded-full border border-[#DDD6FE] bg-[#F5F3FF] hover:bg-[#EDE9FE] px-3 py-1 text-[#5B21B6] cursor-pointer"
              >
                2D Cub Obedience Sim
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('world')}
                className="rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1 text-[#18101E] cursor-pointer"
              >
                In-The-Wild 8-Bit Map
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className="rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1 text-[#18101E] cursor-pointer"
              >
                About the Club
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8]">
              Quizzes, Guides &amp; Shop
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPopTriviaOpen(true)}
                className="rounded-full border border-slate-200 bg-white hover:bg-[#FFFBEB] px-3 py-1 text-[#18101E] cursor-pointer"
              >
                Pop-Culture Quiz
              </button>
              <button
                type="button"
                onClick={() => setChecklistOpen(true)}
                className="rounded-full border border-slate-200 bg-white hover:bg-[#FFF1F2] px-3 py-1 text-[#18101E] cursor-pointer"
              >
                Have You Ever? 25-Pt Test
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('journal')}
                className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1 text-[#18101E] cursor-pointer"
              >
                Complete Club Guides
              </button>
              <button
                type="button"
                onClick={() => setBoutiqueOpen(true)}
                className="rounded-full bg-[#18101E] hover:bg-[#2E1F38] px-3 py-1 text-white cursor-pointer"
              >
                🛍️ Visual Gift Shop &amp; VIP
              </button>
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
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-[#64748B] hover:text-[#E11D48] transition cursor-pointer"
                aria-label="Founder Vault"
              >
                <Lock className="h-3 w-3" />
                <span>{wallet.isFounderUnlimited ? 'Lock Founder' : 'Founder'}</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {founderModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1022]/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Founder Passphrase Vault"
        >
          <form
            onSubmit={handleFounderUnlockSubmit}
            className="vice-panel w-full max-w-md rounded-3xl p-6 space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3 py-0.5 text-xs font-extrabold uppercase text-[#1E1022]">
                  <Lock className="h-3 w-3" /> Salted SHA-256 Protected
                </span>
                <h2 className="mt-2 font-display text-2xl text-[#1E1022]">
                  Founder Playtest &amp; Affiliate Vault
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFounderModalOpen(false)}
                aria-label="Close Founder Vault"
                className="pop-btn rounded-xl bg-[#FFF4F7] p-2 text-[#1E1022] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="founder-passphrase-input"
                className="block text-xs font-extrabold uppercase tracking-wide text-[#1E1022]"
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
                className="min-w-0 w-full rounded-2xl border-2 border-[#1E1022] bg-[#FFF7F0] px-4 py-3 text-sm font-bold text-[#1E1022] focus:border-[#FF2E63] focus:outline-none"
              />
              {founderAuthError && (
                <p className="text-xs font-extrabold text-[#D90452]">{founderAuthError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFounderModalOpen(false)}
                className="pop-btn rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#1E1022] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="pop-btn rounded-xl bg-[#FF2E63] px-5 py-2.5 text-sm font-extrabold text-white cursor-pointer"
              >
                Unlock Founder Vault
              </button>
            </div>
          </form>
        </div>
      )}

      <FieldGuideModal
        open={fieldGuideOpen}
        unlockedStamps={wallet.unlockedStamps}
        onClose={() => setFieldGuideOpen(false)}
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
          setRun(createRun(pairing, selectedVipIds, episodeId));
          setActiveTab('game');
          setPhase('episodes');
        }}
      />

      <BoutiqueAndVipModal
        open={boutiqueOpen}
        wallet={wallet}
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
          updateWallet({ ...wallet, isVip: true });
        }}
        onClaimQuestReward={(rewardId, amount) => {
          const res = grantRewardCredits(wallet, rewardId, amount);
          if (res.granted) updateWallet(res.wallet);
          return res.granted;
        }}
        onSandboxGrantCredits={() => {
          updateWallet({ ...wallet, credits: wallet.credits + 15 });
        }}
        onSandboxUnlockVip={() => {
          updateWallet({ ...wallet, isVip: true, credits: wallet.credits + 10 });
        }}
        onClaimNewsletterBonus={(email) => {
          if (typeof fetch === 'function') {
            fetch('/api/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, source: 'boutique_modal' }),
            }).catch(() => {});
          }
          const res = grantRewardCredits(
            wallet,
            'newsletter_signup',
            MONETIZATION_CONFIG.newsletterRewardCredits,
          );
          if (res.granted) updateWallet(res.wallet);
          return res.granted;
        }}
      />
    </div>
  );
}
