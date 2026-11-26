import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Award,
  ExternalLink,
  Heart,
  Lock,
  RotateCcw,
  Share2,
  Sparkles,
  Unlock,
} from 'lucide-react';
import { MONETIZATION_CONFIG } from '../config/monetization';
import {
  EXPRESSION_MOTION_PRESETS,
  type PortraitExpression,
  V35_CAST_VISUALS,
} from '../data/v35AssetManifest';
import { getCastProfileById } from '../data/v35Cast';
import { V35_CHAT_CHAPTERS, V35_DATE_SCRIPTS } from '../data/v35ChatsAndDates';
import type { WalletState } from '../domain/economy';
import { buildAffiliateUrl, getAffiliateById } from '../lib/affiliates';
import { sfx } from '../lib/sound';
import { shareOrCopy } from '../lib/viral';

export interface DreamDaddyDateStageProps {
  leadId: string;
  dateNumber: 1 | 2 | 3 | 4;
  role: 'her' | 'him';
  wallet: WalletState;
  initialSRankLockedOut?: boolean;
  onCompleteDate: (
    leadId: string,
    dateNumber: number,
    rank: 'S' | 'A' | 'B' | 'F',
    sRankLockedOut: boolean,
  ) => void;
  onLoseHeart: () => void;
  onSpendCredits: (cost: number) => boolean;
  onUnlockPov: (povId: string, cost: number) => boolean;
  onUnlockEpilogue: (epilogueId: string, cost: number) => boolean;
  onRecordConspiracyClue?: (clueId: string) => void;
  onLaunchNextDate?: (nextDateNumber: 1 | 2 | 3 | 4) => void;
  onBackToChats: () => void;
}

export const DreamDaddyDateStage: React.FC<DreamDaddyDateStageProps> = ({
  leadId,
  dateNumber,
  role,
  wallet,
  initialSRankLockedOut = false,
  onCompleteDate,
  onLoseHeart,
  onSpendCredits,
  onUnlockPov,
  onUnlockEpilogue,
  onRecordConspiracyClue,
  onLaunchNextDate,
  onBackToChats,
}) => {
  const profile = getCastProfileById(leadId);
  const scripts = V35_DATE_SCRIPTS[leadId] || [];
  const script = scripts.find((s) => s.dateNumber === dateNumber) ?? scripts[0];
  const visual = V35_CAST_VISUALS[leadId];

  const [beatIdx, setBeatIdx] = useState(0);
  const [expression, setExpression] = useState<PortraitExpression>(
    script?.beats[0]?.speakerExpression ?? 'neutral',
  );
  const [score, setScore] = useState(0);
  const [sRankLockedOut, setSRankLockedOut] = useState(initialSRankLockedOut);
  const [disasterHit, setDisasterHit] = useState(false);
  const [sparringToast, setSparringToast] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [povUnlocked, setPovUnlocked] = useState(false);
  const [copiedPolaroid, setCopiedPolaroid] = useState(false);

  useEffect(() => {
    const firstExp = script?.beats[0]?.speakerExpression ?? 'neutral';
    setBeatIdx(0);
    setExpression(firstExp);
    setScore(0);
    setSRankLockedOut(initialSRankLockedOut);
    setDisasterHit(false);
    setSparringToast(false);
    setLastFeedback(null);
    setFinished(false);
    setPovUnlocked(wallet.unlockedPovIds.includes(`${leadId}-date-${dateNumber}`));
    setCopiedPolaroid(false);
    // Intentionally keyed strictly on [leadId, dateNumber] so mid-session wallet/lockout updates never reset finished state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId, dateNumber]);

  if (!profile || !script || !visual) {
    return null;
  }

  const preset = EXPRESSION_MOTION_PRESETS[expression];
  const portraitIdx = Math.min(5, (dateNumber - 1 + beatIdx) % 6);
  const portraitSrc = visual.sixUniquePhotos[portraitIdx] || visual.primaryPortrait;
  const currentBeat = script.beats[beatIdx];
  const playerGreeting = wallet.playerName ? `${wallet.playerName}, ` : '';

  const prepProducts = (script.prepAffiliateIds || [])
    .map((id) => getAffiliateById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const computeRank = (): 'S' | 'A' | 'B' | 'F' => {
    if (disasterHit) return 'F';
    if (score >= 48 && !sRankLockedOut) return 'S';
    if (score >= 24) return 'A';
    return 'B';
  };

  const handleChoice = (choice: (typeof currentBeat.choices)[number]) => {
    if (choice.cost && choice.cost > 0) {
      const ok = onSpendCredits(choice.cost);
      if (!ok) return;
    }

    setExpression(choice.nextExpression);
    const nextScore = score + choice.chemistryDelta;
    const nextLocked = sRankLockedOut || Boolean(choice.locksOutSRank);
    const nextDisaster = disasterHit || Boolean(choice.triggersDisasterHeartLoss);

    setScore(nextScore);
    setSRankLockedOut(nextLocked);
    setLastFeedback(choice.response);

    if (choice.triggersCubSparring) {
      setSparringToast(true);
    }

    if (choice.triggersTurnTablesRevenge) {
      const clueId =
        V35_CHAT_CHAPTERS[leadId]?.cutLooseVerdict.conspiracyClueId || `clue-${leadId}-revenge`;
      onRecordConspiracyClue?.(clueId);
    }

    if (choice.triggersDisasterHeartLoss) {
      sfx.redFlag();
      setDisasterHit(true);
      onLoseHeart();
    } else if (choice.chemistryDelta >= 0) {
      sfx.greenFlag();
    } else {
      sfx.redFlag();
    }

    if (beatIdx + 1 < script.beats.length) {
      setBeatIdx(beatIdx + 1);
    } else {
      const finalRank: 'S' | 'A' | 'B' | 'F' = nextDisaster
        ? 'F'
        : nextScore >= 48 && !nextLocked
          ? 'S'
          : nextScore >= 24
            ? 'A'
            : 'B';
      setFinished(true);
      onCompleteDate(leadId, script.dateNumber, finalRank, nextLocked);
    }
  };

  const handleFreeReplay = () => {
    sfx.messagePop();
    setBeatIdx(0);
    setExpression(script.beats[0]?.speakerExpression ?? 'neutral');
    setScore(0);
    setDisasterHit(false);
    setLastFeedback(null);
    setFinished(false);
  };

  const rank = computeRank();
  const povId = `${leadId}-date-${script.dateNumber}`;
  const isPovUnlocked =
    povUnlocked ||
    Boolean(wallet.isVip || wallet.isFounderUnlimited || wallet.unlockedPovIds.includes(povId));
  const hasDate4Epilogue = scripts.some((s) => s.dateNumber === 4);
  const epilogueId = `${leadId}-epilogue-4`;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 animate-stage-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToChats}
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Chats</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
          <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-rose-900">
            Date #{script.dateNumber} • {profile.name} ({profile.age})
          </span>
          <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-amber-900">
            {'❤️'.repeat(Math.max(0, wallet.fridayHearts)) || '💔 0 Hearts'}
          </span>
        </div>
      </div>

      {/* Optional Pre-Date #2 Boutique Touch Strip */}
      {!finished && prepProducts.length > 0 && (
        <section className="editorial-hinge-card rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-amber-50/70 via-white to-rose-50/60 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
              🛍️ Pre-Date Signature Touch (Optional Partner Picks)
            </span>
            <span className="text-[11px] font-medium text-stone-500">Opens on Amazon</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {prepProducts.map((prod) => (
              <a
                key={prod.id}
                href={buildAffiliateUrl(prod, `date2_prep_${leadId}`)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-2.5 hover:border-amber-400 transition"
              >
                <img
                  src={prod.photoUrl}
                  alt={prod.name}
                  className="h-12 w-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#18101E] line-clamp-1">{prod.name}</div>
                  <div className="text-[11px] font-semibold text-rose-700 inline-flex items-center gap-1">
                    <span>{prod.priceDisplay}</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Full-Bleed Sunset Visual-Novel Stage */}
      <section className="relative overflow-hidden rounded-3xl bg-[#140D19] text-white shadow-2xl">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={script.venueBackdrop}
            alt={script.title}
            className="h-full w-full object-cover animate-ken-burns opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140D19] via-[#140D19]/35 to-transparent" />

          {/* Expressive Animated Character Bust */}
          <div className="absolute inset-x-6 bottom-4 flex items-end justify-between gap-4">
            <div className="max-w-lg space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300/95 px-3 py-1 text-xs font-extrabold text-[#18101E]">
                <span>{preset.particle}</span>
                <span>
                  {profile.name} • {preset.badge}
                </span>
              </span>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                {script.title}
              </h1>
            </div>

            <div className="relative shrink-0">
              <span
                key={`${expression}-${beatIdx}`}
                className="pointer-events-none absolute -top-4 -right-2 z-10 text-2xl animate-float-particle"
              >
                {preset.particle}
              </span>
              <img
                src={portraitSrc}
                alt={profile.name}
                className={`h-40 w-30 sm:h-52 sm:w-40 rounded-2xl object-cover ring-3 shadow-2xl transition-all duration-300 ${preset.tintClass} ${preset.motionClass}`}
              />
            </div>
          </div>
        </div>

        {/* Frosted Velvet Dialogue Dock OR Date Rank Summary */}
        <div className="velvet-stage-dock p-6 sm:p-8 space-y-5">
          {!finished ? (
            <>
              {currentBeat.bestiePopIn && (
                <div className="rounded-2xl bg-white/10 border border-amber-200/30 px-4 py-2.5 text-xs sm:text-sm font-medium text-amber-200">
                  📱 {currentBeat.bestiePopIn}
                </div>
              )}

              {sparringToast && (
                <div className="rounded-2xl bg-emerald-500/20 border border-emerald-300/40 px-4 py-2.5 text-xs font-bold text-emerald-200">
                  🔔 Etiquette Sparring Round Activated — Public Frame Held Under Fire!
                </div>
              )}

              {lastFeedback && (
                <div className="rounded-2xl bg-amber-300/15 border border-amber-300/30 px-4 py-3 text-sm italic text-amber-100">
                  {lastFeedback}
                </div>
              )}

              <p className="font-editorial text-lg sm:text-xl leading-relaxed text-white">
                {playerGreeting}
                {currentBeat.dialogue}
              </p>

              <div className="grid gap-3 pt-1">
                {currentBeat.choices.map((choice) => (
                  <button
                    key={choice.label}
                    type="button"
                    onClick={() => handleChoice(choice)}
                    className={`w-full rounded-2xl p-4 text-left text-sm sm:text-base font-medium whitespace-normal transition cursor-pointer ${
                      choice.cost
                        ? 'border border-amber-300/80 bg-gradient-to-r from-amber-400/20 to-rose-400/20 text-amber-100 hover:border-amber-200'
                        : 'border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/40'
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-5 animate-stage-in">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-300">
                    Dream Daddy Date Verdict • Date #{script.dateNumber} Complete
                  </div>
                  <h2 className="mt-1 font-editorial text-3xl sm:text-4xl font-bold text-white">
                    {rank === 'F' ? '🚩 DATE DISASTER' : `${rank}-RANK ROMANCE`}
                  </h2>
                  <p className="mt-1 text-sm text-stone-300">
                    {rank === 'S'
                      ? `Unblemished slow-burn chemistry with ${profile.name}! Polaroid unlocked in your Dateodex.`
                      : rank === 'F'
                        ? `You ignored the chat red flags and lost 1 Friday Night Heart! Next time hit 🚩 Cut Loose in text.`
                        : sRankLockedOut
                          ? `Rushing Night 1 capped your ceiling at ${rank}-Rank—replay free anytime to earn S-Rank!`
                          : `Warm connection unlocked—replay free anytime if you want to chase S-Rank!`}
                  </p>
                </div>

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-300 font-editorial text-4xl font-black text-[#18101E] shadow-xl">
                  {rank}
                </div>
              </div>

              {lastFeedback && (
                <p className="text-sm text-amber-100/90 leading-relaxed">{lastFeedback}</p>
              )}

              {/* Secret Group-Chat Leak (2 Cr / Free w/ VIP) */}
              <div className="rounded-2xl border border-amber-300/35 bg-white/5 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      🔓 Post-Date Group-Chat Leak ({script.secretBestiePovLeak.friendName})
                    </div>
                    <p className="text-xs text-stone-300">
                      Read what {profile.name} texted right after leaving the restaurant.
                    </p>
                  </div>

                  {!isPovUnlocked && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onUnlockPov(povId, script.secretBestiePovLeak.cost)) {
                          sfx.greenFlag();
                          setPovUnlocked(true);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-4 py-2 text-xs font-extrabold text-[#18101E] cursor-pointer"
                    >
                      {wallet.isVip ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      <span>
                        Unlock Secret Group-Chat Leak ({wallet.isVip ? 'VIP Free' : '2 Cr'})
                      </span>
                    </button>
                  )}
                </div>

                {isPovUnlocked && (
                  <div className="space-y-2 rounded-xl bg-black/40 p-3.5 text-xs sm:text-sm text-emerald-200">
                    {script.secretBestiePovLeak.messages.map((line) => (
                      <div key={line}>💬 {line}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bar: Free Replay, Next Date / Epilogue, Share Polaroid, Support */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleFreeReplay}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Replay Date Free</span>
                  </button>

                  {rank !== 'F' && script.dateNumber < 3 && onLaunchNextDate && (
                    <button
                      type="button"
                      onClick={() =>
                        onLaunchNextDate((script.dateNumber + 1) as 1 | 2 | 3 | 4)
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-500 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Continue to Date #{script.dateNumber + 1} →</span>
                    </button>
                  )}

                  {rank !== 'F' && script.dateNumber === 3 && hasDate4Epilogue && onLaunchNextDate && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onUnlockEpilogue(epilogueId, 3)) {
                          onLaunchNextDate(4);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-5 py-2.5 text-xs font-extrabold text-[#18101E] cursor-pointer"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>
                        🌙 Unlock Velvet Cut Weekend Epilogue ({wallet.isVip ? 'VIP Free' : '3 Cr'})
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      await shareOrCopy({
                        title: `${rank}-Rank Date with ${profile.name}`,
                        text: `🐆 Scored ${rank}-RANK on Date #${script.dateNumber} with ${profile.name} (${role === 'her' ? 'Cougar' : 'Cub'} Campaign) on Cougars & Cubs Club!`,
                        url: 'https://cougarsandcubs.club',
                      });
                      setCopiedPolaroid(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-2.5 text-xs font-bold text-white cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>{copiedPolaroid ? 'Polaroid Copied!' : 'Share Polaroid'}</span>
                  </button>
                </div>

                <a
                  href={MONETIZATION_CONFIG.tipJarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-200/20 border border-amber-300/40 px-4 py-2 text-xs font-bold text-amber-200 hover:bg-amber-200/30"
                >
                  <Heart className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  <span>💛 Support This Project</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
