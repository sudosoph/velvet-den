import React, { useState } from 'react';
import { Check, Send } from 'lucide-react';
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
      <div className="editorial-hinge-card mx-auto max-w-xl rounded-3xl bg-white p-8 text-center space-y-4">
        <p className="text-base text-[#18101E] font-bold">This audition had no valid scenarios.</p>
        <button
          type="button"
          onClick={onExitToMainGame}
          className="rounded-full bg-[#18101E] px-6 py-3 text-sm font-extrabold text-white cursor-pointer"
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
        <div className="mx-auto max-w-2xl editorial-hinge-card rounded-3xl bg-white p-6 sm:p-8 space-y-5 animate-stage-in">
          <span className="inline-block rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 text-xs font-extrabold uppercase text-amber-950">
            Audition Complete for {challenge.senderName}
          </span>

          <div className="flex flex-wrap items-baseline gap-4">
            <span className="font-editorial text-5xl sm:text-6xl font-bold text-rose-600">
              {result.matchPercent}%
            </span>
            <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#18101E]">
              {result.verdictTitle}
            </span>
          </div>

          <ul className="space-y-2.5 text-sm sm:text-base font-semibold text-stone-800">
            {result.roastNotes.map((note, idx) => (
              <li
                key={idx}
                className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
              >
                {note}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleSendBack}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-rose-600 py-3.5 text-base font-bold text-white hover:bg-rose-700 cursor-pointer"
            >
              {copiedReply ? <Check className="h-5 w-5" /> : <Send className="h-5 w-5" />}
              <span>
                {copiedReply
                  ? `Score Ready • Text ${challenge.senderName}!`
                  : `Send My Score Back to ${challenge.senderName}`}
              </span>
            </button>
            <button
              type="button"
              onClick={onExitToMainGame}
              className="rounded-full border border-stone-300 bg-white px-6 py-3.5 text-base font-bold text-[#18101E] cursor-pointer"
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
    <div className="mx-auto max-w-2xl editorial-hinge-card rounded-3xl bg-white p-6 sm:p-8 space-y-5 animate-stage-in">
      <div className="rounded-2xl bg-amber-100 border border-amber-300/70 px-4 py-3 font-editorial text-lg sm:text-xl font-bold text-[#18101E]">
        🐆 {challenge.senderName} Sent You an Official Vetting Audition ({step + 1} /{' '}
        {scenarios.length})
      </div>

      <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#18101E]">{ep.title}</h2>
      <p className="text-base font-medium leading-relaxed text-stone-700">
        {renderRichText(setupCopy)}
      </p>

      <div className="space-y-3">
        {perm.map((originalIdx, displayIdx) => {
          const c = ep.choices[originalIdx];
          if (!c) return null;
          const choiceCopy = receiverRole === 'her' ? c.labelHer : c.labelHim;
          return (
            <button
              key={originalIdx}
              type="button"
              onClick={() => handlePick(originalIdx)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50/70 p-4 sm:p-5 text-left text-sm sm:text-base font-semibold whitespace-normal text-[#18101E] hover:border-stone-400 hover:bg-white transition cursor-pointer"
            >
              <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#18101E] text-xs font-extrabold text-amber-300">
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
