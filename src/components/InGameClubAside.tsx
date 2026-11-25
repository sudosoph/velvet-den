import React, { useState } from 'react';
import { Award, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import { POP_CULTURE_TRIVIA } from '../data/popCultureTrivia';
import { sfx } from '../lib/sound';
import {
  COUGAR_CUB_CHECKLIST_ITEMS,
  loadChecklistCheckedIds,
  toggleChecklistItemInStorage,
} from './CougarCubChecklistModal';

interface InGameClubAsideProps {
  seedKey: string;
  matchedEpisodeId?: string;
  onOpenFullTrivia?: () => void;
  onOpenFullChecklist?: () => void;
}

function hashKey(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export const InGameClubAside: React.FC<InGameClubAsideProps> = ({
  seedKey,
  matchedEpisodeId,
  onOpenFullTrivia,
  onOpenFullChecklist,
}) => {
  const seed = hashKey(seedKey);
  const [mode, setMode] = useState<'viral' | 'pop'>(() => (seed % 2 === 0 ? 'viral' : 'pop'));
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [viralAns, setViralAns] = useState<'lived' | 'dodged' | null>(() => {
    const matched =
      COUGAR_CUB_CHECKLIST_ITEMS.find((c) => c.episodeId === matchedEpisodeId) ??
      COUGAR_CUB_CHECKLIST_ITEMS[seed % COUGAR_CUB_CHECKLIST_ITEMS.length];
    return loadChecklistCheckedIds().includes(matched.id) ? 'lived' : null;
  });

  const viralItem =
    COUGAR_CUB_CHECKLIST_ITEMS.find((c) => c.episodeId === matchedEpisodeId) ??
    COUGAR_CUB_CHECKLIST_ITEMS[seed % COUGAR_CUB_CHECKLIST_ITEMS.length];

  const popItem = POP_CULTURE_TRIVIA[seed % POP_CULTURE_TRIVIA.length];
  const livedPct = 61 + (seed % 27);

  const handleViralVote = (choice: 'lived' | 'dodged') => {
    sfx.messagePop();
    setViralAns(choice);
    const current = loadChecklistCheckedIds();
    if (choice === 'lived' && !current.includes(viralItem.id)) {
      toggleChecklistItemInStorage(viralItem.id);
    }
  };

  const handlePickTrivia = (idx: number) => {
    if (pickedOption !== null) return;
    if (idx === popItem.correctIndex) sfx.greenFlag();
    else sfx.redFlag();
    setPickedOption(idx);
  };

  const checkedCount = loadChecklistCheckedIds().length;

  return (
    <div className="rounded-2xl border-2 border-[#1E1022] bg-gradient-to-r from-[#FFF4F7] via-[#FFFDF9] to-[#FFFBEB] p-4 sm:p-5 space-y-3 shadow-[3px_3px_0px_#1E1022]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-xl border-2 border-[#1E1022] bg-white p-0.5 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setMode('viral')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition cursor-pointer ${
              mode === 'viral' ? 'bg-[#FF2E63] text-white' : 'text-[#1E1022] hover:bg-[#FFF4F7]'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Viral IRL Check</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('pop')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition cursor-pointer ${
              mode === 'pop' ? 'bg-[#FFBE0B] text-[#1E1022]' : 'text-[#1E1022] hover:bg-[#FFFBEB]'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Pop-Culture Aside</span>
          </button>
        </div>

        {mode === 'viral' && onOpenFullChecklist && (
          <button
            type="button"
            onClick={onOpenFullChecklist}
            className="text-xs font-extrabold text-[#D90452] hover:underline cursor-pointer"
          >
            Your IRL Score: {checkedCount * 4}/100 →
          </button>
        )}
        {mode === 'pop' && onOpenFullTrivia && (
          <button
            type="button"
            onClick={onOpenFullTrivia}
            className="text-xs font-extrabold text-[#B45309] hover:underline cursor-pointer"
          >
            Full Pop-Culture Blitz (+3 Cr) →
          </button>
        )}
      </div>

      {mode === 'viral' ? (
        <div className="space-y-3">
          <div className="text-base font-extrabold text-[#1E1022] leading-snug">
            &ldquo;{viralItem.text}&rdquo;
          </div>

          {viralAns === null ? (
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => handleViralVote('lived')}
                className="pop-btn rounded-xl bg-[#FF2E63] px-4 py-2 text-sm font-extrabold text-white cursor-pointer"
              >
                🙋‍♀️ Lived This IRL!
              </button>
              <button
                type="button"
                onClick={() => handleViralVote('dodged')}
                className="pop-btn rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-[#1E1022] cursor-pointer"
              >
                🛡️ Dodged So Far
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-[#1E1022] bg-white px-3.5 py-2.5 text-sm font-bold text-[#1E1022]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
                <span>
                  <strong className="text-[#FF2E63]">{livedPct}%</strong> of Club regulars have survived this exact moment!
                </span>
              </span>
              {onOpenFullChecklist && (
                <button
                  type="button"
                  onClick={onOpenFullChecklist}
                  className="text-xs font-extrabold text-[#FF2E63] underline cursor-pointer"
                >
                  See All 25 Boxes →
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#1E1022] bg-[#FFBE0B] px-2.5 py-0.5 text-xs font-extrabold text-[#1E1022]">
              <Sparkles className="inline h-3 w-3 mr-1" />
              {popItem.badge}
            </span>
          </div>
          <div className="text-base font-extrabold text-[#1E1022] leading-snug">
            {popItem.question}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {popItem.options.map((opt, idx) => {
              const isPicked = pickedOption === idx;
              const isCorrect = idx === popItem.correctIndex;
              let cls = 'bg-white text-[#1E1022] hover:bg-[#FFFBEB] border-[#1E1022]';
              if (pickedOption !== null) {
                if (isCorrect) cls = 'bg-[#D1FAE5] text-[#065F46] border-[#1E1022]';
                else if (isPicked) cls = 'bg-[#FFE4E6] text-[#9F1239] border-[#1E1022]';
                else cls = 'bg-white/60 text-[#5A4664] border-[#1E1022]/20';
              }
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handlePickTrivia(idx)}
                  className={`rounded-xl border-2 px-3.5 py-2 text-left text-sm font-bold transition cursor-pointer ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {pickedOption !== null && (
            <div className="rounded-xl border-2 border-[#1E1022] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#1E1022]">
              <strong className="text-[#FF2E63]">
                {pickedOption === popItem.correctIndex ? '✨ Nailed it! ' : '🎬 Club Lore: '}
              </strong>
              {popItem.funFact}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
