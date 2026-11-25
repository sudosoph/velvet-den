import { useEffect, useMemo, useState } from 'react';
import { Check, Lock, ShieldCheck, Wrench, X } from 'lucide-react';
import { BRAND_CONFIG } from './config/brand';
import { MONETIZATION_CONFIG } from './config/monetization';
import { AppSwipeStage } from './components/AppSwipeStage';
import { BoutiqueAndVipModal } from './components/BoutiqueAndVipModal';
import { CougarCubChecklistModal } from './components/CougarCubChecklistModal';
import { EpisodeStage } from './components/EpisodeStage';
import { FieldGuideModal } from './components/FieldGuideModal';
import { LiveInboxModal } from './components/LiveInboxModal';
import { OutcomeAndViralView } from './components/OutcomeAndViralView';
import { PairingMixerView } from './components/PairingMixerView';
import { PartnerAuditionView } from './components/PartnerAuditionView';
import { PopCultureTriviaModal } from './components/PopCultureTriviaModal';
import { TopHudBar } from './components/TopHudBar';
import { VelvetJournalView } from './components/VelvetJournalView';
import { APP_SWIPE_PROFILES, HER_SWIPE_PROFILES } from './data/appProfiles';
import { EPISODES } from './data/episodes';
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
  createRun,
  recordAppSwipe,
  rewindLastChoice,
  type GameRunState,
  type RunPacingMode,
} from './domain/gameEngine';
import {
  analyzePairing,
  HER_ARCHETYPES,
  HIS_ARCHETYPES,
  type HerArchetype,
  type HisArchetype,
  type PlayerRole,
} from './domain/taxonomy';
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

  return {
    challenge: decoded,
    corruptedChallenge,
    dilemmaId,
    journalSlug,
    unlockQuery,
    stripeSessionId,
    refCode,
    openChecklist,
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

  const [wallet, setWallet] = useState<WalletState>(() => {
    const base = loadWallet();
    if (initialUrl.unlockQuery) {
      const unlocked = applyUnlockCodeOrQuery(base, initialUrl.unlockQuery);
      saveWallet(unlocked.wallet);
      return unlocked.wallet;
    }
    return base;
  });

  const [role, setRole] = useState<PlayerRole>(initialHerDeckIdx >= 0 ? 'him' : 'her');
  const [her, setHer] = useState<HerArchetype>(HER_ARCHETYPES[0]);
  const [his, setHis] = useState<HisArchetype>(HIS_ARCHETYPES[0]);
  const [pacingMode, setPacingMode] = useState<RunPacingMode>('curated');
  const [customEditCount, setCustomEditCount] = useState<number>(0);
  const [selectedVipIds, setSelectedVipIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'game' | 'journal'>(
    initialUrl.journalSlug ? 'journal' : 'game',
  );
  const [fieldGuideOpen, setFieldGuideOpen] = useState(false);
  const [boutiqueOpen, setBoutiqueOpen] = useState(false);
  const [liveInboxOpen, setLiveInboxOpen] = useState(false);
  const [popTriviaOpen, setPopTriviaOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(initialUrl.openChecklist);
  const [founderModalOpen, setFounderModalOpen] = useState(false);
  const [founderPassInput, setFounderPassInput] = useState('');
  const [founderSessionPass, setFounderSessionPass] = useState('');
  const [founderAuthError, setFounderAuthError] = useState<string | null>(null);
  const [founderTagInput, setFounderTagInput] = useState(
    MONETIZATION_CONFIG.amazonAssociateTag || '',
  );
  const [founderTagProtected, setFounderTagProtected] = useState(
    Boolean(MONETIZATION_CONFIG.amazonAssociateTag),
  );
  const [founderTagStatus, setFounderTagStatus] = useState<string | null>(null);
  const [founderApronClicks, setFounderApronClicks] = useState<number | null>(null);
  const [noticeBanner, setNoticeBanner] = useState<string | null>(
    initialUrl.corruptedChallenge
      ? 'Heads up: that audition link looked truncated or expired—mix your own Cougar & Cub run below!'
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
          credits: prev.credits + (result.credits ?? (result.grantType === 'vip' ? 15 : 15)),
          claimedRewards: [...prev.claimedRewards, sessionKey],
        };
        saveWallet(next);
        return next;
      });
      setNoticeBanner('🎉 Stripe Checkout verified! Your VIP / Den Credits are live.');
    });
  }, [initialUrl.stripeSessionId, wallet.claimedRewards]);

  const handleFounderUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = founderPassInput.trim();
    const localValid = await verifyFounderPassphrase(trimmed);
    if (!localValid) {
      setFounderAuthError('Invalid Founder passphrase. Access denied.');
      return;
    }

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
            amazonAssociateTag?: string;
            affiliateProtected?: boolean;
            sampleClicks?: Record<string, number>;
          };
          if (data.amazonAssociateTag !== undefined) {
            setFounderTagInput(data.amazonAssociateTag);
            setFounderTagProtected(Boolean(data.affiliateProtected));
          }
          if (data.sampleClicks && typeof data.sampleClicks['houseboy-linen-apron'] === 'number') {
            setFounderApronClicks(data.sampleClicks['houseboy-linen-apron']);
          }
        }
      } catch {
        // Offline or local unit test environment — local SHA-256 already verified
      }
    }

    updateWallet(grantFounderAccess(wallet));
    setFounderSessionPass(trimmed);
    setFounderPassInput('');
    setFounderAuthError(null);
    setFounderModalOpen(false);
    setNoticeBanner(
      '👑 Founder Playtest & Affiliate Vault ACTIVE: ∞ Credits, all VIP scenes, 1-click stage jumpers, and live Amazon tag vault unlocked.',
    );
  };

  const handleSaveFounderAmazonTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!founderSessionPass) {
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
          passphrase: founderSessionPass,
          amazonAssociateTag: cleanTag,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        amazonAssociateTag?: string;
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
    setFounderTagStatus(null);
    setNoticeBanner('🔒 Founder Mode locked — viewing normal player wallet & VIP state.');
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
    // Monetized Custom Fantasy Builder: 1st custom tweak & zero-proof drink swaps are free;
    // stacking 2+ custom plot twists/names uses 1 Den Credit (or is unlimited with VIP Black Card!)
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
    setNoticeBanner(null);
    const freshRun = createRun(pairing, selectedVipIds, undefined, pacingMode);
    setRun(freshRun);
    setPhase('swipes');
    setActiveTab('game');
  };

  const handleQuickCreateAudition = async () => {
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin.startsWith('http')
        ? `${window.location.origin}${window.location.pathname}`
        : BRAND_CONFIG.publicBaseUrl;

    const previewQueue = createRun(pairing, selectedVipIds).episodeQueue.slice(0, 5);
    const episodeIds =
      previewQueue.length > 0
        ? previewQueue.map((e) => e.id)
        : [
            'check-drop',
            'code-switch-texting',
            'trail-run-short-leash',
            'mirror-game-insecurities',
            'houseboy-sunday-sanctuary',
          ];

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

    const bonus = grantRewardCredits(
      wallet,
      'first_share',
      MONETIZATION_CONFIG.shareRewardCredits,
    );
    if (bonus.granted) {
      updateWallet(bonus.wallet);
      setNoticeBanner(
        '🔗 2-Player Vetting Audition link copied to clipboard (+3 Bonus Credits added)! Text it to your Cougar or Cub.',
      );
    } else {
      setNoticeBanner('🔗 2-Player Vetting Audition link copied! Text it to your Cougar or Cub.');
    }
  };

  const handleShareDilemma = async (id: string, title: string) => {
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin.startsWith('http')
        ? `${window.location.origin}${window.location.pathname}`
        : BRAND_CONFIG.publicBaseUrl;
    const link = buildDilemmaShareLink(id, baseUrl);
    await shareOrCopy({
      title: 'Ghost or Train? — Cougars & Cubs Club',
      text: `👀 Brunch group-chat verdict needed: "${title}" — Ghost or Train?`,
      url: link,
    });
    setNoticeBanner('📤 Dilemma link copied—drop it in the group chat!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopHudBar
        wallet={wallet}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenFieldGuide={() => setFieldGuideOpen(true)}
        onOpenBoutique={() => setBoutiqueOpen(true)}
        onOpenLiveInbox={() => setLiveInboxOpen(true)}
        onOpenPopTrivia={() => setPopTriviaOpen(true)}
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
        <div className="border-b border-[#E5C17B]/30 bg-gradient-to-r from-[#171122] via-[#1E152A] to-[#171122] px-3 py-2.5 shadow-lg">
          <div className="mx-auto max-w-5xl space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-bold text-[#FDE68A]">
                <Wrench className="h-3.5 w-3.5 text-emerald-400" />
                👑 Founder Playtest Vault • ∞ Credits &amp; All VIP Unlocked
              </span>

              {/* 1-Click Whole-Game Screen Switchers */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    ['mixer', '1. Matchmaker'],
                    ['swipes', '2. Swipe Deck'],
                    ['episodes', '3. Scene Stage'],
                    ['outcome', '4. Verdict & 9:16 Card'],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleFounderPlaytestJump(key)}
                    className={`rounded-lg border px-2.5 py-1 font-semibold transition cursor-pointer ${
                      activeTab === 'game' && phase === key
                        ? 'border-[#E5C17B] bg-[#E5C17B] text-[#0C0910]'
                        : 'border-white/15 bg-black/45 text-stone-200 hover:border-[#E5C17B]/50 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleLockFounderMode}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-400/35 bg-rose-950/60 px-2.5 py-1 font-semibold text-rose-200 hover:bg-rose-900/70 cursor-pointer"
                >
                  <Lock className="h-3 w-3" />
                  <span>Lock Founder Mode</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2">
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
                className="max-w-full sm:max-w-xs rounded-lg border border-[#E5C17B]/40 bg-[#0C0910] px-2.5 py-1.5 text-xs font-semibold text-[#FAF7F5]"
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

              {/* Protected Amazon Affiliate Tag Vault */}
              <form
                onSubmit={handleSaveFounderAmazonTag}
                className="flex flex-wrap items-center gap-1.5"
              >
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold ${
                    founderTagProtected
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30'
                      : 'bg-amber-500/15 text-[#FDE68A] border border-[#E5C17B]/30'
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
                  className="w-32 rounded-lg border border-white/15 bg-[#0C0910] px-2.5 py-1 text-xs text-white placeholder:text-stone-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-lg bg-[#E5C17B] px-2.5 py-1 font-bold text-[#0C0910] hover:bg-[#FDE68A] cursor-pointer"
                >
                  <Check className="h-3 w-3" />
                  <span>Save Tag</span>
                </button>
                {founderTagStatus && (
                  <span className="text-emerald-300 font-medium">{founderTagStatus}</span>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl flex-1 px-3 py-6 sm:px-6 sm:py-8 space-y-4">
        {noticeBanner && (
          <div className="vice-panel flex items-center justify-between gap-3 rounded-xl bg-amber-400/20 border-amber-400 px-4 py-3 text-sm font-semibold text-amber-200">
            <span>{noticeBanner}</span>
            <button
              type="button"
              onClick={() => setNoticeBanner(null)}
              className="rounded px-2 py-0.5 text-xs font-extrabold text-amber-100 hover:bg-black/30 cursor-pointer"
              aria-label="Dismiss notice"
            >
              ✕
            </button>
          </div>
        )}

        {activeTab === 'journal' ? (
          <VelvetJournalView
            initialSlug={initialUrl.journalSlug}
            onPlayScenario={(episodeId) => {
              setRun(createRun(pairing, selectedVipIds, episodeId));
              setActiveTab('game');
              setPhase('episodes');
            }}
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
          />
        ) : phase === 'episodes' && run ? (
          <EpisodeStage
            run={run}
            credits={wallet.credits}
            onSelectChoice={(choiceIdx) => {
              setRun((prev) => {
                if (!prev) return prev;
                return applyEpisodeChoice(prev, choiceIdx);
              });
            }}
            onCompleteMinigame={(episodeId, bonus, badge) => {
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
            onFinishRun={() => setPhase('outcome')}
          />
        ) : phase === 'outcome' && run ? (
          <OutcomeAndViralView
            run={run}
            summary={computeRunSummary(run)}
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
            onOpenBoutique={() => setBoutiqueOpen(true)}
            onOpenLiveInbox={() => setLiveInboxOpen(true)}
            onOpenPopTrivia={() => setPopTriviaOpen(true)}
            onOpenChecklist={() => setChecklistOpen(true)}
            onQuickCreateAudition={handleQuickCreateAudition}
            onOpenFieldGuide={() => setFieldGuideOpen(true)}
            onJumpToMapScene={(episodeId) => {
              setRun(createRun(pairing, selectedVipIds, episodeId));
              setActiveTab('game');
              setPhase('episodes');
            }}
          />
        )}
      </main>

      <footer className="border-t border-white/10 bg-[#0C0910]/90 py-5 text-center text-xs text-stone-400">
        <div className="mx-auto max-w-5xl px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            {BRAND_CONFIG.name} • Cheeky PG-13/R Satire for Adult Age-Gap Relationships (21+)
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setPopTriviaOpen(true)}
              className="hover:text-rose-300 underline cursor-pointer"
            >
              Pop-Culture Quiz
            </button>
            <button
              type="button"
              onClick={() => setLiveInboxOpen(true)}
              className="hover:text-rose-300 underline cursor-pointer"
            >
              Live AI Texting
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('journal')}
              className="hover:text-[#FDE68A] underline cursor-pointer"
            >
              Age-Gap Dating &amp; Gift Guides
            </button>
            <button
              type="button"
              onClick={() => setBoutiqueOpen(true)}
              className="hover:text-[#FDE68A] underline cursor-pointer"
            >
              Cougars &amp; Cubs Club VIP Lounge
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
              className="inline-flex items-center gap-1 text-stone-500 hover:text-[#E5C17B] transition cursor-pointer"
              aria-label="Founder Vault"
            >
              <Lock className="h-3 w-3" />
              <span>{wallet.isFounderUnlimited ? 'Lock Founder' : 'Founder'}</span>
            </button>
          </div>
        </div>
      </footer>

      {founderModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Founder Passphrase Vault"
        >
          <form
            onSubmit={handleFounderUnlockSubmit}
            className="vice-panel w-full max-w-md rounded-3xl bg-[#15101C] p-6 space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5C17B]/35 bg-[#E5C17B]/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-[#FDE68A]">
                  <Lock className="h-3 w-3" /> Salted SHA-256 Protected
                </span>
                <h2 className="mt-1.5 font-display text-2xl text-white">
                  Founder Playtest &amp; Affiliate Vault
                </h2>
                <p className="mt-1 text-xs text-stone-300">
                  Enter your private Founder passphrase to unlock unlimited credits, 1-click stage playtesting, and live Amazon Associate Tag configuration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFounderModalOpen(false)}
                aria-label="Close Founder Vault"
                className="rounded-xl border border-white/12 bg-[#1E1729] p-2 text-stone-300 hover:bg-rose-600 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="founder-passphrase-input" className="block text-xs font-bold uppercase tracking-wider text-stone-300">
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
                className="w-full rounded-2xl border border-white/15 bg-[#0C0910] px-4 py-3 text-sm text-white placeholder:text-stone-500 focus:border-[#E5C17B] focus:outline-none"
              />
              {founderAuthError && (
                <p className="text-xs font-semibold text-rose-300">{founderAuthError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFounderModalOpen(false)}
                className="rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-stone-300 hover:bg-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:from-rose-500 hover:to-rose-400 cursor-pointer"
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

      <LiveInboxModal
        open={liveInboxOpen}
        wallet={wallet}
        onClose={() => setLiveInboxOpen(false)}
        onSpendCreditOrOpenBoutique={() => {
          const res = spendCredits(wallet, 1);
          if (!res.ok) {
            setLiveInboxOpen(false);
            setBoutiqueOpen(true);
            return false;
          }
          updateWallet(res.wallet);
          return true;
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
