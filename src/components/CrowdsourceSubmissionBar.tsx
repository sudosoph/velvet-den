import React, { useState } from 'react';
import { Check, Lightbulb, Send, X } from 'lucide-react';
import { awardPassportBonusXp } from '../lib/gamification';
import { sfx } from '../lib/sound';

export type CrowdsourceSurface =
  | 'checklist'
  | 'cub_school_her'
  | 'cub_school_him'
  | 'trivia'
  | 'wild'
  | 'guides';

interface CrowdsourceCopySpec {
  pillPrompt: string;
  heading: string;
  tagLabel: string;
  tagPlaceholder: string;
  exampleHint: string;
  inputPlaceholder: string;
}

const SURFACE_SPECS: Record<CrowdsourceSurface, CrowdsourceCopySpec> = {
  cub_school_her: {
    pillPrompt: 'Got a funny way you trained or checked a Cub IRL? Send yours (+15 XP)',
    heading: 'Submit a "How I Trained My Cub" Scenario',
    tagLabel: 'Ages & Vibe (Optional)',
    tagPlaceholder: 'e.g. 44F × 26M • Chicago',
    exampleHint:
      'Clear Cougar-trains-Cub example: "He called my 1998 Lauryn Hill tour tee \'sick vintage thrifting,\' so I made him learn three tracks before Sunday pancakes."',
    inputPlaceholder:
      'What rookie Cub habit did he pull, and how did you playfully check or train him?',
  },
  cub_school_him: {
    pillPrompt: 'Fumbled (or aced) a real test with an older woman? Confess yours (+15 XP)',
    heading: 'Submit a Real Cub Etiquette Lesson',
    tagLabel: 'Ages & City (Optional)',
    tagPlaceholder: 'e.g. 25M × 42F • Austin',
    exampleHint:
      'Clear Cub lesson example: "Bought a lidded trash bin, 4 cotton pillows, and chilled sparkling water before Date #3 and she still brags about it."',
    inputPlaceholder:
      'Share the real rookie fumble you learned from (or the smooth move that won her over)...',
  },
  checklist: {
    pillPrompt: 'Have a hilarious Cougar, Cub, or Date-Night milestone we missed? Add it (+15 XP)',
    heading: 'Pitch a New Checklist Item',
    tagLabel: 'Which List? (Cougar / Cub / Date Night)',
    tagPlaceholder: 'e.g. Cougars Only • Deep Cut',
    exampleHint:
      'Example: "Folded his laundry once and realized my favorite concert hoodie is two years older than him."',
    inputPlaceholder: 'Write your hyper-specific "Have You Ever?" moment in one punchy sentence...',
  },
  trivia: {
    pillPrompt: 'Did we miss an iconic age-gap movie, book, show, or celebrity couple? Suggest it (+15 XP)',
    heading: 'Nominate a Pop-Culture Trivia Question',
    tagLabel: 'Category (Movie / TV / Book / Celeb)',
    tagPlaceholder: 'e.g. BookTok / Celeb Couple',
    exampleHint:
      'Example: "Miriam Toews or Miranda July\'s All Fours motel makeover!" or a favorite celebrity couple.',
    inputPlaceholder: 'Name the movie, TV couple, book, or celebrity moment we should add next...',
  },
  wild: {
    pillPrompt: 'Met (or hilariously fumbled) out in the wild IRL? Share the story (+15 XP)',
    heading: 'Drop a Real "In The Wild" Meet-Cute or Fumble',
    tagLabel: 'Where Did It Happen?',
    tagPlaceholder: 'e.g. Trader Joe’s Wine Aisle • 43F × 27M',
    exampleHint:
      'Example: "Asked him to reach the top-shelf olive oil, noticed zero wedding ring, and traded numbers before checkout."',
    inputPlaceholder: 'How did you read the room and break the ice offline (or what went sideways)?',
  },
  guides: {
    pillPrompt: 'Have a real age-gap tip or funny receipt for this listicle? Send it in (+15 XP)',
    heading: 'Send a Community Receipt for the Magazine',
    tagLabel: 'Anonymous Handle / Age Pair',
    tagPlaceholder: 'e.g. 46F × 29M • Seattle',
    exampleHint:
      'Example: "Prepping his mom a week before Sunday dinner turned an awkward ambush into instant wine-night besties."',
    inputPlaceholder: 'Share your best one-liner rule, funny quote, or real-world lesson...',
  },
};

interface CrowdsourceSubmissionBarProps {
  surface: CrowdsourceSurface;
  onAwardXp?: () => void;
  compact?: boolean;
}

export const CrowdsourceSubmissionBar: React.FC<CrowdsourceSubmissionBarProps> = ({
  surface,
  onAwardXp,
  compact = false,
}) => {
  const spec = SURFACE_SPECS[surface];
  const [open, setOpen] = useState(false);
  const [contextTag, setContextTag] = useState('');
  const [body, setBody] = useState('');
  const [submittedMsg, setSubmittedMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBody = body.trim();
    if (cleanBody.length < 12) return;

    sfx.victoryFanfare();
    awardPassportBonusXp(
      `crowdsource_${surface}_${Date.now()}`,
      15,
      'Community Idea Sent!',
      '💡 +15 XP',
    );
    onAwardXp?.();
    setSubmittedMsg('🎉 Sent to the Club Greenlight Desk (+15 XP)! Top player submissions get added every Friday.');
    setBody('');

    if (
      typeof window !== 'undefined' &&
      typeof fetch === 'function' &&
      !(navigator.userAgent || '').toLowerCase().includes('jsdom')
    ) {
      try {
        await fetch('/api/community/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            surface,
            contextTag: contextTag.trim().slice(0, 60),
            content: cleanBody.slice(0, 320),
          }),
        });
      } catch {
        // Optimistic local save already rewarded
      }
    }
  };

  return (
    <div
      data-testid={`crowdsource-bar-${surface}`}
      className={`rounded-2xl border border-amber-200/90 bg-amber-50/60 ${
        compact ? 'px-3.5 py-2.5' : 'px-4 py-3'
      }`}
    >
      {!open ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-900">
            <Lightbulb className="h-4 w-4 shrink-0 text-amber-600" />
            <span>{submittedMsg ?? spec.pillPrompt}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSubmittedMsg(null);
              setOpen(true);
            }}
            className="shrink-0 rounded-full bg-zinc-950 hover:bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            + Submit Idea
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-bold text-zinc-950">{spec.heading}</span>
            <button
              type="button"
              aria-label="Close submission form"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-zinc-200 bg-white p-1 text-zinc-500 hover:text-zinc-950 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="rounded-xl border border-amber-200/80 bg-white/90 px-3 py-2 text-xs text-zinc-600 leading-snug">
            {spec.exampleHint}
          </p>

          <div className="grid gap-2 sm:grid-cols-[200px_1fr]">
            <input
              type="text"
              maxLength={60}
              aria-label={spec.tagLabel}
              placeholder={spec.tagPlaceholder}
              value={contextTag}
              onChange={(e) => setContextTag(e.target.value)}
              className="min-w-0 h-10 rounded-xl border border-zinc-300 bg-white px-3 text-xs sm:text-sm text-zinc-950"
            />
            <input
              type="text"
              required
              minLength={12}
              maxLength={320}
              aria-label={spec.heading}
              placeholder={spec.inputPlaceholder}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-w-0 h-10 rounded-xl border border-zinc-300 bg-white px-3.5 text-xs sm:text-sm text-zinc-950"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-zinc-500">
              100% anonymous • Zero names or contact info needed
            </span>
            <button
              type="submit"
              disabled={body.trim().length < 12}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 px-4 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              {submittedMsg ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
              <span>Send &amp; Claim +15 XP</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
