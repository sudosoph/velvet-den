import { useMemo, useState } from 'react';
import { BRAND_CONFIG } from './config/brand';
import { MONETIZATION_CONFIG } from './config/monetization';
import { AppSwipeStage } from './components/AppSwipeStage';
import { BoutiqueAndVipModal } from './components/BoutiqueAndVipModal';
import { EpisodeStage } from './components/EpisodeStage';
import { FieldGuideModal } from './components/FieldGuideModal';
import { OutcomeAndViralView } from './components/OutcomeAndViralView';
import { PairingMixerView } from './components/PairingMixerView';
import { PartnerAuditionView } from './components/PartnerAuditionView';
import { TopHudBar } from './components/TopHudBar';
import { VelvetJournalView } from './components/VelvetJournalView';
import { EPISODES } from './data/episodes';
import {
  applyUnlockCodeOrQuery,
  grantRewardCredits,
  loadWallet,
  saveWallet,
  spendCredits,
  unlockEpisodeWithCredits,
  unlockStamp,
  type WalletState,
} from './domain/economy';
import {
  applyEpisodeChoice,
  computeRunSummary,
  createRun,
  recordAppSwipe,
  rewindLastChoice,
  type GameRunState,
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

type ScreenPhase = 'mixer' | 'swipes' | 'episodes' | 'outcome' | 'audition';

function readInitialUrlState() {
  if (typeof window === 'undefined') {
    return {
      challenge: null as ChallengePayload | null,
      corruptedChallenge: false,
      dilemmaId: null as string | null,
      journalSlug: null as string | null,
      unlockQuery: '',
    };
  }
  const params = new URLSearchParams(window.location.search);
  const rawChallenge = params.get('challenge');
  const decoded = decodeChallengeParam(rawChallenge);
  const corruptedChallenge = Boolean(rawChallenge && !decoded);
  const dilemmaId = params.get('dilemma');
  const journalSlug = params.get('journal');
  const unlockQuery = params.has('unlock') ? window.location.search : '';

  return { challenge: decoded, corruptedChallenge, dilemmaId, journalSlug, unlockQuery };
}

export default function App() {
  const initialUrl = useMemo(() => readInitialUrlState(), []);

  const [wallet, setWallet] = useState<WalletState>(() => {
    const base = loadWallet();
    if (initialUrl.unlockQuery) {
      const unlocked = applyUnlockCodeOrQuery(base, initialUrl.unlockQuery);
      saveWallet(unlocked.wallet);
      return unlocked.wallet;
    }
    return base;
  });

  const [role, setRole] = useState<PlayerRole>('her');
  const [her, setHer] = useState<HerArchetype>(HER_ARCHETYPES[0]);
  const [his, setHis] = useState<HisArchetype>(HIS_ARCHETYPES[0]);
  const [selectedVipIds, setSelectedVipIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'game' | 'journal'>(
    initialUrl.journalSlug ? 'journal' : 'game',
  );
  const [fieldGuideOpen, setFieldGuideOpen] = useState(false);
  const [boutiqueOpen, setBoutiqueOpen] = useState(false);
  const [noticeBanner, setNoticeBanner] = useState<string | null>(
    initialUrl.corruptedChallenge
      ? 'Heads up: that audition link looked truncated or expired—mix your own Cougar & Cub run below!'
      : null,
  );
  const [activeChallenge, setActiveChallenge] = useState<ChallengePayload | null>(
    initialUrl.challenge,
  );

  const pairing = useMemo(() => analyzePairing(her, his, role), [her, his, role]);

  const [run, setRun] = useState<GameRunState | null>(() => {
    if (initialUrl.dilemmaId && EPISODES.some((e) => e.id === initialUrl.dilemmaId)) {
      return createRun(
        analyzePairing(HER_ARCHETYPES[0], HIS_ARCHETYPES[0], 'her'),
        [],
        initialUrl.dilemmaId,
      );
    }
    return null;
  });

  const [phase, setPhase] = useState<ScreenPhase>(() => {
    if (initialUrl.challenge) return 'audition';
    if (initialUrl.dilemmaId && EPISODES.some((e) => e.id === initialUrl.dilemmaId)) {
      return 'episodes';
    }
    return 'mixer';
  });

  const updateWallet = (next: WalletState) => {
    setWallet(next);
    saveWallet(next);
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
    const stamped = unlockStamp(wallet, pairing.felineTier);
    updateWallet(stamped);
    const freshRun = createRun(pairing, selectedVipIds);
    setRun(freshRun);
    setPhase('swipes');
    setActiveTab('game');
  };

  const handleQuickCreateAudition = async () => {
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin.startsWith('http')
        ? `${window.location.origin}${window.location.pathname}`
        : BRAND_CONFIG.publicBaseUrl;

    const link = encodeChallengeLink(
      {
        v: 1,
        senderName: role === 'her' ? her.name : his.name,
        senderRole: role,
        herId: her.id,
        hisId: his.id,
        episodeIds: [
          'check-drop',
          'waiter-son-incident',
          'code-switch-texting',
          'trail-run-short-leash',
          'mirror-game-insecurities',
        ],
        preferredChoiceIndices: [0, 0, 0, 0, 0],
      },
      baseUrl,
    );

    await shareOrCopy({
      title: 'Pass My 60-Second Velvet Den Vetting Audition',
      text: 'Think you’d survive dating me? Take my 60-second Velvet Den Vetting Audition 👀',
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
      title: 'Ghost or Train? — The Velvet Den',
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
        onGoHome={() => {
          setActiveTab('game');
          setPhase('mixer');
          setActiveChallenge(null);
        }}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-3 py-6 sm:px-6 sm:py-8">
        {activeTab === 'journal' ? (
          <VelvetJournalView
            initialSlug={initialUrl.journalSlug}
            onPlayScenario={(episodeId) => {
              const targetEp = EPISODES.find((e) => e.id === episodeId);
              if (targetEp?.isVip && !wallet.isVip && !wallet.unlockedEpisodeIds.includes(episodeId)) {
                const unlock = unlockEpisodeWithCredits(wallet, episodeId, targetEp.creditCost);
                if (!unlock.ok) {
                  setBoutiqueOpen(true);
                  return;
                }
                updateWallet(unlock.wallet);
              }
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
            role={role}
            credits={wallet.credits}
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
            onRewindLast={() => {
              const res = spendCredits(wallet, 1);
              if (!res.ok) {
                setBoutiqueOpen(true);
                return;
              }
              updateWallet(res.wallet);
              setRun((prev) => (prev ? rewindLastChoice(prev) : prev));
            }}
            onShareDilemma={handleShareDilemma}
            onFinishBustedRun={() => setPhase('outcome')}
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
            noticeBanner={noticeBanner}
            onChangeRole={setRole}
            onSelectHer={(nextHer) => setHer(nextHer)}
            onSelectHis={(nextHis) => setHis(nextHis)}
            onAdjustHerAge={(d) =>
              setHer((prev) => ({ ...prev, age: Math.max(30, Math.min(72, prev.age + d)) }))
            }
            onAdjustHisAge={(d) =>
              setHis((prev) => ({ ...prev, age: Math.max(21, Math.min(45, prev.age + d)) }))
            }
            onToggleVipEpisode={handleToggleVipEpisode}
            onStartGame={handleStartGame}
            onQuickCreateAudition={handleQuickCreateAudition}
            onOpenFieldGuide={() => setFieldGuideOpen(true)}
          />
        )}

        {/* Auto-advance when episodes finish and pending outcome card dismissed */}
        {activeTab === 'game' && phase === 'episodes' && run?.status === 'completed' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setPhase('outcome')}
              className="vice-panel rounded-2xl bg-amber-400 px-6 py-3 font-display text-2xl text-slate-950 cursor-pointer"
            >
              Generate Official Vibe Check &amp; Receipt →
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 bg-black/50 py-5 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-5xl px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            {BRAND_CONFIG.name} • Cheeky PG-13/R Satire for Adult Age-Gap Relationships (21+)
          </span>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('journal')}
              className="hover:text-amber-300 underline cursor-pointer"
            >
              Age-Gap Dating &amp; Gift Guides
            </button>
            <button
              type="button"
              onClick={() => setBoutiqueOpen(true)}
              className="hover:text-teal-300 underline cursor-pointer"
            >
              Concierge Boutique &amp; VIP
            </button>
          </div>
        </div>
      </footer>

      <FieldGuideModal
        open={fieldGuideOpen}
        unlockedStamps={wallet.unlockedStamps}
        onClose={() => setFieldGuideOpen(false)}
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
        onSandboxGrantCredits={() => {
          updateWallet({ ...wallet, credits: wallet.credits + 15 });
        }}
        onSandboxUnlockVip={() => {
          updateWallet({ ...wallet, isVip: true, credits: wallet.credits + 10 });
        }}
        onClaimNewsletterBonus={() => {
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
