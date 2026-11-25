import React, { useState } from 'react';
import { Check, Send } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { EPISODES } from '../data/episodes';
import { renderRichText } from '../lib/richText';
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
      <div className="vice-panel rounded-3xl bg-[#150f24]/95 p-8 text-center space-y-4">
        <p className="text-base text-white font-semibold">This audition had no valid episodes.</p>
        <button
          type="button"
          onClick={onExitToMainGame}
          className="rounded-2xl bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950 cursor-pointer"
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
      <div className="mx-auto max-w-2xl vice-panel rounded-3xl bg-[#150f24]/95 p-6 sm:p-8 space-y-5 animate-stage-in">
        <span className="inline-block rounded-full bg-amber-300 px-3.5 py-1 text-xs font-bold uppercase text-slate-950">
          Audition Complete for {challenge.senderName}
        </span>

        <div className="flex flex-wrap items-baseline gap-4">
          <span className="font-display text-5xl sm:text-6xl text-amber-300">
            {result.matchPercent}%
          </span>
          <span className="font-display text-2xl sm:text-3xl text-white">
            {result.verdictTitle}
          </span>
        </div>

        <ul className="space-y-2.5 text-sm sm:text-base text-slate-200">
          {result.roastNotes.map((note, idx) => (
            <li key={idx} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              {note}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleSendBack}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 py-3.5 font-display text-lg text-slate-950 shadow-lg hover:brightness-105 transition cursor-pointer"
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
            className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-display text-lg text-white hover:bg-white/10 transition cursor-pointer"
          >
            Play Full Game →
          </button>
        </div>
      </div>
    );
  }

  const ep = episodes[step];

  return (
    <div className="mx-auto max-w-2xl vice-panel rounded-3xl bg-[#150f24]/95 p-6 sm:p-8 space-y-5 animate-stage-in">
      <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 px-4 py-3 font-display text-lg sm:text-xl text-slate-950">
        🐆 {challenge.senderName} Sent You an Official Vetting Audition ({step + 1} /{' '}
        {episodes.length})
      </div>

      <h2 className="font-display text-2xl sm:text-3xl text-white">{ep.title}</h2>
      <p className="text-base leading-relaxed text-slate-100">
        {renderRichText(receiverRole === 'her' ? ep.setupHer : ep.setupHim)}
      </p>

      <div className="space-y-3">
        {ep.choices.map((c, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePick(idx)}
            className="w-full rounded-2xl border border-white/14 bg-white/[0.05] p-4 sm:p-5 text-left text-base font-medium text-white hover:bg-white/[0.09] hover:border-amber-300/60 transition cursor-pointer"
          >
            <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-amber-300 text-xs font-extrabold text-slate-950">
              {String.fromCharCode(65 + idx)}
            </span>
            {renderRichText(receiverRole === 'her' ? c.labelHer : c.labelHim)}
          </button>
        ))}
      </div>
    </div>
  );
};
