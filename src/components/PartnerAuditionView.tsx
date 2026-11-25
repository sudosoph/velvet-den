import React, { useState } from 'react';
import { Check, Send } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { EPISODES } from '../data/episodes';
import {
  scorePartnerAudition,
  shareOrCopy,
  type ChallengePayload,
} from '../lib/viral';

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

  if (episodes.length === 0) {
    return (
      <div className="vice-panel rounded-2xl bg-[#180d28] p-6 text-center space-y-4">
        <p className="text-white font-bold">This audition had no valid episodes.</p>
        <button
          type="button"
          onClick={onExitToMainGame}
          className="rounded-xl bg-amber-400 px-4 py-2 font-bold text-slate-950 cursor-pointer"
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
        title: `My Velvet Den Audition Score for ${challenge.senderName}`,
        text: `🐆 I just took ${challenge.senderName}’s Velvet Den Vetting Audition: ${result.matchPercent}% Match (${result.verdictTitle})!`,
        url,
      });
      setCopiedReply(true);
    };

    return (
      <div className="mx-auto max-w-2xl vice-panel rounded-3xl bg-[#180d28] p-6 sm:p-8 space-y-5">
        <span className="rounded bg-teal-400 px-2.5 py-1 text-xs font-extrabold uppercase text-slate-950">
          Audition Complete for {challenge.senderName}
        </span>
        <div className="flex items-baseline gap-4">
          <span className="font-display text-6xl text-amber-300">{result.matchPercent}%</span>
          <span className="font-display text-3xl text-white">{result.verdictTitle}</span>
        </div>

        <ul className="space-y-2 text-sm text-slate-200">
          {result.roastNotes.map((note, idx) => (
            <li key={idx} className="rounded-xl bg-black/40 px-3.5 py-2.5">
              {note}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleSendBack}
            className="flex-1 vice-panel flex items-center justify-center gap-2 rounded-2xl bg-teal-400 py-3 font-display text-2xl text-slate-950 cursor-pointer"
          >
            {copiedReply ? <Check className="h-5 w-5" /> : <Send className="h-5 w-5" />}
            <span>
              {copiedReply
                ? `Score Copied — Text ${challenge.senderName}!`
                : `Send My Score Back to ${challenge.senderName}`}
            </span>
          </button>
          <button
            type="button"
            onClick={onExitToMainGame}
            className="rounded-2xl border-2 border-black bg-rose-500 px-5 py-3 font-display text-2xl text-white cursor-pointer"
          >
            Play Full Game →
          </button>
        </div>
      </div>
    );
  }

  const ep = episodes[step];

  return (
    <div className="mx-auto max-w-2xl vice-panel rounded-3xl bg-[#180d28] p-6 sm:p-8 space-y-5">
      <div className="rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-4 py-2.5 font-display text-2xl text-slate-950">
        🐆 {challenge.senderName} Sent You an Official Vetting Audition ({step + 1} /{' '}
        {episodes.length})
      </div>

      <h2 className="font-display text-3xl sm:text-4xl text-white">{ep.title}</h2>
      <p className="text-sm sm:text-base text-slate-200">
        {receiverRole === 'her' ? ep.setupHer : ep.setupHim}
      </p>

      <div className="space-y-3">
        {ep.choices.map((c, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePick(idx)}
            className="w-full rounded-2xl border-2 border-black bg-[#25143d] p-4 text-left text-sm font-semibold text-white hover:border-teal-400 cursor-pointer"
          >
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded bg-teal-400 text-xs font-extrabold text-slate-950">
              {String.fromCharCode(65 + idx)}
            </span>
            {receiverRole === 'her' ? c.labelHer : c.labelHim}
          </button>
        ))}
      </div>
    </div>
  );
};
