import React, { useMemo, useState } from 'react';
import { Check, Send } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { EPISODES } from '../data/episodes';
import { personalizeText } from '../domain/gameEngine';
import { analyzePairing, HER_ARCHETYPES, HIS_ARCHETYPES } from '../domain/taxonomy';
import { renderRichText } from '../lib/richText';
import {
  scorePartnerAudition,
  shareOrCopy,
  type ChallengePayload,
} from '../lib/viral';

function getAuditionPermutation(epId: string): [number, number, number] {
  let h = 2166136261;
  for (let i = 0; i < epId.length; i += 1) {
    h ^= epId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const perms: [number, number, number][] = [
    [1, 0, 2],
    [0, 2, 1],
    [2, 0, 1],
    [0, 1, 2],
    [2, 1, 0],
    [1, 2, 0],
  ];
  return perms[(h >>> 0) % perms.length];
}

interface PartnerAuditionViewProps {
  challenge: ChallengePayload;
  onExitToMainGame: () => void;
}

export const PartnerAuditionView: React.FC<PartnerAuditionViewProps> = ({
  challenge,
  onExitToMainGame,
}) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [copiedReply, setCopiedReply] = useState(false);

  const alignedPairs = challenge.episodeIds
    .map((id, idx) => ({
      episode: EPISODES.find((e) => e.id === id),
      preferredChoiceIndex: challenge.preferredChoiceIndices[idx] ?? 0,
    }))
    .filter(
      (item): item is { episode: NonNullable<typeof item.episode>; preferredChoiceIndex: number } =>
        Boolean(item.episode),
    );

  const episodes = alignedPairs.map((p) => p.episode);
  const receiverRole = challenge.senderRole === 'her' ? 'him' : 'her';
  const pairing = useMemo(() => {
    const her = HER_ARCHETYPES.find((h) => h.id === challenge.herId) ?? HER_ARCHETYPES[0];
    const his = HIS_ARCHETYPES.find((c) => c.id === challenge.hisId) ?? HIS_ARCHETYPES[0];
    return analyzePairing(her, his, receiverRole);
  }, [challenge.herId, challenge.hisId, receiverRole]);

  if (episodes.length === 0) {
    return (
      <div className="vice-panel rounded-3xl p-8 text-center space-y-4">
        <p className="text-base text-[#1E1022] font-bold">This audition had no valid episodes.</p>
        <button
          type="button"
          onClick={onExitToMainGame}
          className="pop-btn rounded-2xl bg-[#FFBE0B] px-5 py-2.5 text-sm font-extrabold text-[#1E1022] cursor-pointer"
        >
          Play Full Game
        </button>
      </div>
    );
  }

  const handlePick = (choiceIdx: number) => {
    const next = [...answers, choiceIdx];
    setAnswers(next);
    setStep(step + 1);
  };

  if (step >= episodes.length) {
    const result = scorePartnerAudition(
      {
        ...challenge,
        episodeIds: alignedPairs.map((p) => p.episode.id),
        preferredChoiceIndices: alignedPairs.map((p) => p.preferredChoiceIndex),
      },
      answers,
    );

    const handleSendBack = async () => {
      const url =
        typeof window !== 'undefined' && window.location.origin.startsWith('http')
          ? `${window.location.origin}${window.location.pathname}`
          : BRAND_CONFIG.publicBaseUrl;
      await shareOrCopy({
        title: `My Cougars & Cubs Club Audition Score for ${challenge.senderName}`,
        text: `🐆 I just took ${challenge.senderName}’s Cougars & Cubs Club Audition: ${result.matchPercent}% Match (${result.verdictTitle})!`,
        url,
      });
      setCopiedReply(true);
    };

    return (
      <div className="mx-auto max-w-2xl vice-panel rounded-3xl p-6 sm:p-8 space-y-5 animate-stage-in">
        <span className="inline-block rounded-full border-2 border-[#1E1022] bg-[#FFBE0B] px-3.5 py-1 text-xs font-extrabold uppercase text-[#1E1022]">
          Audition Complete for {challenge.senderName}
        </span>

        <div className="flex flex-wrap items-baseline gap-4">
          <span className="font-display text-5xl sm:text-6xl text-[#FF2E63]">
            {result.matchPercent}%
          </span>
          <span className="font-display text-2xl sm:text-3xl text-[#1E1022]">
            {result.verdictTitle}
          </span>
        </div>

        <ul className="space-y-2.5 text-sm sm:text-base font-semibold text-[#1E1022]">
          {result.roastNotes.map((note, idx) => (
            <li key={idx} className="rounded-2xl border-2 border-[#1E1022]/15 bg-[#FFF7F0] px-4 py-3">
              {note}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleSendBack}
            className="pop-btn flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#FF2E63] py-3.5 font-display text-lg text-white cursor-pointer"
          >
            {copiedReply ? <Check className="h-5 w-5" /> : <Send className="h-5 w-5" />}
            <span>
              {copiedReply
                ? `Score Copied • Text ${challenge.senderName}!`
                : `Send My Score Back to ${challenge.senderName}`}
            </span>
          </button>
          <button
            type="button"
            onClick={onExitToMainGame}
            className="pop-btn rounded-2xl bg-white px-6 py-3.5 font-display text-lg text-[#1E1022] cursor-pointer"
          >
            Play Full Game →
          </button>
        </div>
      </div>
    );
  }

  const ep = episodes[step];
  const perm = ep.choices.length === 3 ? getAuditionPermutation(ep.id) : ep.choices.map((_, i) => i);
  const setupCopy = personalizeText(
    receiverRole === 'her' ? ep.setupHer : ep.setupHim,
    pairing,
  );

  return (
    <div className="mx-auto max-w-2xl vice-panel rounded-3xl p-6 sm:p-8 space-y-5 animate-stage-in">
      <div className="rounded-2xl border-2 border-[#1E1022] bg-[#FFBE0B] px-4 py-3 font-display text-lg sm:text-xl text-[#1E1022]">
        🐆 {challenge.senderName} Sent You an Official Vetting Audition ({step + 1} /{' '}
        {episodes.length})
      </div>

      <h2 className="font-display text-2xl sm:text-3xl text-[#1E1022]">{ep.title}</h2>
      <p className="text-base font-medium leading-relaxed text-[#34223B]">
        {renderRichText(setupCopy)}
      </p>

      <div className="space-y-3">
        {perm.map((originalIdx, displayIdx) => {
          const c = ep.choices[originalIdx];
          if (!c) return null;
          const choiceCopy = personalizeText(
            receiverRole === 'her' ? c.labelHer : c.labelHim,
            pairing,
          );
          return (
            <button
              key={originalIdx}
              type="button"
              onClick={() => handlePick(originalIdx)}
              className="pop-btn w-full rounded-2xl bg-white p-4 sm:p-5 text-left text-base font-bold text-[#1E1022] hover:bg-[#FFF4F7] cursor-pointer"
            >
              <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-xl border border-[#1E1022] bg-[#FFBE0B] text-xs font-extrabold text-[#1E1022]">
                {String.fromCharCode(65 + displayIdx)}
              </span>
              {renderRichText(choiceCopy)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
