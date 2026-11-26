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
import { getPersonaVibeSpec, type WalletState } from '../domain/economy';
import { buildAffiliateUrl, getAffiliateById } from '../lib/affiliates';
import { sfx } from '../lib/sound';
import { shareOrCopy } from '../lib/viral';

export interface RomanticDateStageProps {
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

export const RomanticDateStage: React.FC<RomanticDateStageProps> = ({
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

  const activeVibeSpec = getPersonaVibeSpec(wallet.personaTag);
  const startingVibeScore = activeVibeSpec?.dateScoreBonus ?? 0;

  const [beatIdx, setBeatIdx] = useState(0);
  const [expression, setExpression] = useState<PortraitExpression>(
    script?.beats[0]?.speakerExpression ?? 'neutral',
  );
  const [score, setScore] = useState(startingVibeScore);
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
    setScore(getPersonaVibeSpec(wallet.personaTag)?.dateScoreBonus ?? 0);
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
    setScore(startingVibeScore);
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
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Chats</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-600">
          {(wallet.playerName || activeVibeSpec) && (
            <span
              data-testid="date-persona-perk-pill"
              className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-900"
            >
              {activeVibeSpec ? `${activeVibeSpec.emoji} ` : '✨ '}
              {wallet.playerName ? `${wallet.playerName} • ` : ''}
              {activeVibeSpec ? `${activeVibeSpec.id} (+${activeVibeSpec.dateScoreBonus} Score)` : 'VIP Guest'}
            </span>
          )}
          <span className="text-zinc-950">
            Date #{script.dateNumber} • {profile.name} ({profile.age})
          </span>
          <span className="text-zinc-300">•</span>
          <span>
            {'❤️'.repeat(Math.max(0, wallet.fridayHearts)) || '💔 0 Hearts'}
          </span>
        </div>
      </div>

      {/* Optional Pre-Date #2 Boutique Touch Strip */}
      {!finished && prepProducts.length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Pre-Date Signature Touch (Optional Partner Picks)
            </span>
            <span className="text-xs font-medium text-zinc-400">Opens on Amazon</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {prepProducts.map((prod) => (
              <a
                key={prod.id}
                href={buildAffiliateUrl(prod, `date2_prep_${leadId}`)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-2.5 hover:bg-zinc-100 transition-colors"
              >
                <img
                  src={prod.photoUrl}
                  alt={prod.name}
                  className="h-12 w-12 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-950 line-clamp-1">{prod.name}</div>
                  <div className="text-xs font-medium text-rose-600 inline-flex items-center gap-1">
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
      <section className="relative overflow-hidden rounded-2xl bg-zinc-950 text-white shadow-xl">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={script.venueBackdrop}
            alt={script.title}
            className="h-full w-full object-cover animate-ken-burns opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent" />

          {/* Expressive Animated Character Bust */}
          <div className="absolute inset-x-6 bottom-4 flex items-end justify-between gap-4">
            <div className="max-w-lg space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1 text-xs font-bold text-zinc-950">
                <span>{preset.particle}</span>
                <span>
                  {profile.name} • {preset.badge}
                </span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
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
                className={`h-40 w-30 sm:h-52 sm:w-40 rounded-xl object-cover ring-2 shadow-2xl transition-all duration-300 ${preset.tintClass} ${preset.motionClass}`}
              />
            </div>
          </div>
        </div>

        {/* Clean Dialogue Dock OR Date Rank Summary */}
        <div className="border-t border-white/10 bg-zinc-950 p-6 sm:p-8 space-y-5">
          {!finished ? (
            <>
              <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  {script.beats.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-6 rounded-full transition-all ${
                        i <= beatIdx ? 'bg-rose-500' : 'bg-white/15'
                      }`}
                    />
                  ))}
                  <span className="ml-1.5 text-zinc-300">
                    Scene {beatIdx + 1} of {script.beats.length}
                  </span>
                </span>
                <span className="text-rose-400">Chase S-Rank ♥♥♥</span>
              </div>

              {currentBeat.bestiePopIn && (
                <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs sm:text-sm font-medium text-zinc-200">
                  📱 {currentBeat.bestiePopIn}
                </div>
              )}

              {sparringToast && (
                <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/30 px-4 py-2.5 text-xs font-semibold text-emerald-200">
                  🔔 Etiquette Sparring Round Activated. Public Frame Held Under Fire!
                </div>
              )}

              {lastFeedback && (
                <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm italic text-zinc-200">
                  {lastFeedback}
                </div>
              )}

              {beatIdx === 0 && (wallet.playerName || activeVibeSpec) && (
                <div className="rounded-xl bg-rose-500/15 border border-rose-400/30 px-4 py-2.5 text-xs sm:text-sm font-medium text-rose-100">
                  {wallet.playerName
                    ? `“So glad it’s finally you across the table, ${wallet.playerName},” ${profile.name} smiles warmly.`
                    : `${profile.name} spots your ${activeVibeSpec?.id} energy right away.`}
                  {activeVibeSpec
                    ? ` (${activeVibeSpec.emoji} +${activeVibeSpec.dateScoreBonus} Signature Vibe Bonus applied toward S-Rank!)`
                    : ''}
                </div>
              )}

              <p className="text-lg sm:text-xl font-medium leading-relaxed text-white">
                {currentBeat.dialogue}
              </p>

              <div className="grid gap-2.5 pt-1">
                {currentBeat.choices.map((choice) => (
                  <button
                    key={choice.label}
                    type="button"
                    onClick={() => handleChoice(choice)}
                    className={`w-full rounded-xl p-4 text-left text-sm sm:text-base font-medium whitespace-normal transition-colors cursor-pointer ${
                      choice.cost
                        ? 'border border-rose-500/60 bg-rose-600/15 text-white hover:bg-rose-600/25'
                        : 'border border-white/15 bg-white/5 text-white hover:bg-white/12 hover:border-white/30'
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-5 animate-stage-in">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-rose-400">
                    Date Night Verdict • Date #{script.dateNumber} Complete
                  </div>
                  <h2 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    {rank === 'F' ? '🚩 DATE DISASTER' : `${rank}-RANK ROMANCE`}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-300">
                    {rank === 'S'
                      ? `Unblemished slow-burn chemistry with ${profile.name}! Polaroid unlocked in your Dateodex.`
                      : rank === 'F'
                        ? `You ignored the chat red flags and lost 1 Friday Night Heart! Next time hit 🚩 Cut Loose in text.`
                        : sRankLockedOut
                          ? `Rushing Night 1 capped your ceiling at ${rank}-Rank, replay free anytime to earn S-Rank!`
                          : `Warm connection unlocked, replay free anytime if you want to chase S-Rank!`}
                  </p>
                </div>

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-600 text-4xl font-extrabold text-white shadow-xl">
                  {rank}
                </div>
              </div>

              {lastFeedback && (
                <p className="text-sm text-zinc-200 leading-relaxed">{lastFeedback}</p>
              )}

              {/* Secret Group-Chat Leak (Cost on Card Header, Clean Button) */}
              <div className="rounded-xl border border-white/15 bg-white/5 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                        🔓 Post-Date Group-Chat Leak ({script.secretBestiePovLeak.friendName})
                      </span>
                      <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-200">
                        {isPovUnlocked
                          ? 'Unlocked'
                          : wallet.isVip || wallet.isFounderUnlimited
                            ? 'VIP Included'
                            : `${script.secretBestiePovLeak.cost} Cr`}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-300">
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
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 cursor-pointer"
                    >
                      {wallet.isVip ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      <span>Unlock Secret Group-Chat Leak</span>
                    </button>
                  )}
                </div>

                {isPovUnlocked && (
                  <div className="space-y-2 rounded-lg bg-black/40 p-3.5 text-xs sm:text-sm text-emerald-200">
                    {script.secretBestiePovLeak.messages.map((line) => (
                      <div key={line}>💬 {line}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Velvet Cut 6-Month Weekend Epilogue Card (Cost on Card Header, Clean Button) */}
              {rank !== 'F' && script.dateNumber === 3 && hasDate4Epilogue && onLaunchNextDate && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        🌙 6-Month Weekend Escape Epilogue
                      </span>
                      <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-200">
                        {wallet.isVip ||
                        wallet.isFounderUnlimited ||
                        wallet.unlockedEpilogueIds.includes(epilogueId)
                          ? 'VIP / Unlocked'
                          : '3 Cr'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-200">
                      Fast-forward six months into your private weekend getaway with {profile.name}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onUnlockEpilogue(epilogueId, 3)) {
                        onLaunchNextDate(4);
                      }
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-amber-300 px-4 text-xs font-extrabold text-zinc-950 hover:bg-amber-200 cursor-pointer"
                  >
                    <Award className="h-3.5 w-3.5" />
                    <span>Unlock Weekend Escape Epilogue</span>
                  </button>
                </div>
              )}

              {/* Action Bar: Free Replay, Next Date, Share Polaroid, Support */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleFreeReplay}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3.5 text-xs font-semibold text-white hover:bg-white/15 cursor-pointer"
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
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white hover:bg-rose-500 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Continue to Date #{script.dateNumber + 1} →</span>
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
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/20 px-3.5 text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>{copiedPolaroid ? 'Polaroid Copied!' : 'Share Polaroid'}</span>
                  </button>
                </div>

                <a
                  href={MONETIZATION_CONFIG.tipJarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  <Heart className="h-3.5 w-3.5 text-rose-500" />
                  <span>Support This Project</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
