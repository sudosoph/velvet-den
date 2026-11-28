import React, { useState } from 'react';
import { Check, Send, X } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { renderRichText } from '../lib/richText';
import {
  type AuditionScenario,
  type ChallengePayload,
  findAuditionScenario,
  scorePartnerAudition,
  shareOrCopy,
} from '../lib/viral';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

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
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  const alignedPairs = challenge.episodeIds
    .map((id, idx) => ({
      scenario: findAuditionScenario(id),
      preferredChoiceIndex: challenge.preferredChoiceIndices[idx] ?? 0,
    }))
    .filter(
      (item): item is { scenario: AuditionScenario; preferredChoiceIndex: number } =>
        Boolean(item.scenario),
    );

  const scenarios = alignedPairs.map((p) => p.scenario);
  const receiverRole = challenge.senderRole === 'her' ? 'him' : 'her';

  if (scenarios.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-4 shadow-2xs">
        <p className="text-base text-zinc-950 font-semibold">This audition had no valid scenarios.</p>
        <button
          type="button"
          onClick={onExitToMainGame}
          className="inline-flex h-10 items-center rounded-lg bg-zinc-900 hover:bg-zinc-800 px-5 text-sm font-semibold text-white cursor-pointer"
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

  if (step >= scenarios.length) {
    const result = scorePartnerAudition(
      {
        ...challenge,
        episodeIds: alignedPairs.map((p) => p.scenario.id),
        preferredChoiceIndices: alignedPairs.map((p) => p.preferredChoiceIndex),
      },
      answers,
    );

    const handleSendBack = async () => {
      const url =
        typeof window !== 'undefined' && window.location.origin.startsWith('http')
          ? `${window.location.origin}${window.location.pathname}`
          : BRAND_CONFIG.publicBaseUrl;
      const msg = `🐆 I just took ${challenge.senderName}’s Cougars & Cubs Club Audition: ${result.matchPercent}% Match (${result.verdictTitle})!`;
      await shareOrCopy({
        title: `My Cougars & Cubs Club Audition Score for ${challenge.senderName}`,
        text: msg,
        url,
      });
      setCopiedReply(true);
      setSharePayload({
        title: `Send Audition Score (${result.matchPercent}%)`,
        message: msg,
        url,
        shareSurface: 'audition',
      });
    };

    return (
      <>
        <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-5 shadow-2xs animate-stage-in">
          <span className="inline-block rounded-md bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700">
            Audition Complete for {challenge.senderName}
          </span>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight text-rose-600">
              {result.matchPercent}%
            </span>
            <span className="text-xl sm:text-2xl font-semibold text-zinc-950">
              {result.verdictTitle}
            </span>
          </div>

          <ul className="space-y-2 text-sm font-medium text-zinc-700">
            {result.roastNotes.map((note, idx) => (
              <li
                key={idx}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
              >
                {note}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleSendBack}
              className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 cursor-pointer"
            >
              {copiedReply ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              <span>
                {copiedReply
                  ? `Score Ready · Text ${challenge.senderName}!`
                  : `Send My Score Back to ${challenge.senderName}`}
              </span>
            </button>
            <button
              type="button"
              onClick={onExitToMainGame}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-5 text-sm font-semibold text-zinc-900 cursor-pointer"
            >
              Play Full Game →
            </button>
          </div>
        </div>

        <SocialShareSheetModal
          payload={sharePayload}
          onClose={() => setSharePayload(null)}
        />
      </>
    );
  }

  const ep = scenarios[step];
  const perm = ep.choices.length === 3 ? getAuditionPermutation(ep.id) : ep.choices.map((_, i) => i);
  const setupCopy = receiverRole === 'her' ? ep.setupHer : ep.setupHim;

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-5 shadow-2xs animate-stage-in">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3.5">
        <div className="text-sm sm:text-base font-semibold text-zinc-950">
          🐆 {challenge.senderName} Sent You an Official Vetting Audition ({step + 1} /{' '}
          {scenarios.length})
        </div>
        <button
          type="button"
          aria-label="Exit audition to full game"
          onClick={onExitToMainGame}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">{ep.title}</h2>
      <p className="text-sm sm:text-base leading-relaxed text-zinc-700">
        {renderRichText(setupCopy)}
      </p>

      <div className="space-y-2.5">
        {perm.map((originalIdx, displayIdx) => {
          const c = ep.choices[originalIdx];
          if (!c) return null;
          const choiceCopy = receiverRole === 'her' ? c.labelHer : c.labelHim;
          return (
            <button
              key={originalIdx}
              type="button"
              onClick={() => handlePick(originalIdx)}
              className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-left text-sm sm:text-base font-medium whitespace-normal text-zinc-950 hover:border-zinc-400 hover:bg-zinc-50 transition cursor-pointer"
            >
              <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-xs font-semibold text-white">
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
