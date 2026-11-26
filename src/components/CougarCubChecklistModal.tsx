import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckSquare, Play, RotateCcw, Share2, Square, X } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { trackEvent } from '../lib/analytics';
import { sfx } from '../lib/sound';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

interface CougarCubChecklistModalProps {
  open: boolean;
  referralCode?: string;
  onClose: () => void;
  onClaimChecklistReward: (rewardKey: string, amount: number) => boolean;
  onPlayMatchedScenario: (episodeId: string) => void;
}

export const COUGAR_CUB_CHECKLIST_ITEMS: { id: string; text: string; episodeId: string }[] = [
  {
    id: 'nirvana-tshirt-check',
    text: 'Verified a date wearing a vintage Nirvana tee could actually name three songs off In Utero.',
    episodeId: 'velvet-room',
  },
  {
    id: 'wasnt-born-yet-math',
    text: 'Referenced a major 1990s cultural moment and heard the words "I wasn’t born yet" across the table.',
    episodeId: 'hawthorne-campus',
  },
  {
    id: 'fearless-voice-call',
    text: 'Answered or placed an actual voice phone call at 6 PM without needing three scheduling texts first.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'roll-window-crank',
    text: 'Made the circular hand-crank "roll down the car window" gesture and watched a twenty-something blink in confusion.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'gmail-older-license',
    text: 'Realized one partner’s firstname.lastname Gmail address is older than the other’s learner’s permit.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'two-day-hangover-gap',
    text: 'Witnessed the unfair biological divide between bouncing back at 7 AM vs. needing electrolytes after two glasses of Cabernet.',
    episodeId: 'dawn-lap-pool',
  },
  {
    id: 'paper-checkbook-sighting',
    text: 'Wrote (or watched your partner write) a physical paper check for a landscaper or contractor.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'myspace-html-mixtape',
    text: 'Swapped stories about coding MySpace Top 8 layouts and burning Sharpie-labeled CD-R road-trip mixtapes.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'genx-period-punctuation',
    text: 'Decoded that a text reading "Sounds good." with a period means genuine happiness, not impending doom.',
    episodeId: 'velvet-room',
  },
  {
    id: 'cursive-vs-squiggle',
    text: 'Compared flowing fountain-pen cursive on the dinner slip against an iPad fingertip squiggle.',
    episodeId: 'velvet-room',
  },
  {
    id: 'blockbuster-friday-aisle',
    text: 'Explained the Friday-night heartbreak of shaking an empty plastic rental box behind the new-release cover at Blockbuster.',
    episodeId: 'cougarmarket',
  },
  {
    id: 'thirty-second-quote-negotiation',
    text: 'Watched an experienced homeowner calmly renegotiate a repair estimate in thirty seconds flat on speakerphone.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'printed-mapquest-pages',
    text: 'Admitted to once navigating highway exits holding six stapled pages of printed MapQuest directions.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'dialup-modem-imitation',
    text: 'Imitated the screeching 56k dial-up internet handshake tone over late-night cocktails.',
    episodeId: 'havana-salsa',
  },
  {
    id: 'scandinavian-two-duvet-peace',
    text: 'Discovered the relationship magic of keeping a cool bedroom and two separate linen duvets so nobody steals covers.',
    episodeId: 'palisades-racquet',
  },
  {
    id: 'airport-arrival-philosophy',
    text: 'Merged two airport philosophies: arriving comfortably for lounge espresso vs. sprinting to Gate 42 as boarding closes.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'paper-menu-loyalty',
    text: 'Bonded instantly over despising sticky tabletop QR codes in favor of heavy cream cardstock menus.',
    episodeId: 'velvet-room',
  },
  {
    id: 'alanis-car-singalong',
    text: 'Belted every word of Alanis Morissette’s "You Oughta Know" with the convertible top down on Highway 1.',
    episodeId: 'cougarmarket',
  },
  {
    id: 'velvet-rope-one-id',
    text: 'Laughed when the cocktail-lounge doorman scrutinized only one driver’s license under a flashlight and waved the other straight through.',
    episodeId: 'havana-salsa',
  },
  {
    id: 'blackberry-scrollwheel-lore',
    text: 'Described the tactile click of a BlackBerry Pearl trackball or T9 pocket texting without looking at the screen.',
    episodeId: 'st-jude-coffee',
  },
  {
    id: 'dedicated-beverage-fridge',
    text: 'Experienced the domestic luxury of a second garage or pantry fridge stocked exclusively with chilled sparkling water and white wine.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'early-dinner-convert',
    text: 'Converted wholeheartedly to 7:15 PM candlelit reservations so you are both home in silk loungewear by ten.',
    episodeId: 'velvet-room',
  },
  {
    id: 'kitchen-landline-jack',
    text: 'Pointed out the mysterious rectangular wall plate where a coiled twenty-foot kitchen phone cord used to live.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'unbothered-table-glances',
    text: 'Turned five seconds of curious restaurant glances into an inside joke and got comped dessert by the bartender.',
    episodeId: 'havana-salsa',
  },
  {
    id: 'outlasted-every-skeptic',
    text: 'Toasted six months or a full year together long after nosy acquaintances predicted "two fun weekends."',
    episodeId: 'terminal-b-airport',
  },
];

function rankForScore(score: number): { title: string; subtitle: string; recommendedEp: string } {
  if (score >= 76) {
    return {
      title: '👑 HALL-OF-FAME COUGAR DEN APEX',
      subtitle: 'You didn’t just study age-gap courtship, you practically wrote the Cougars & Cubs Club handbook.',
      recommendedEp: 'babygirl-hotel-bar-milk-or-martini',
    };
  }
  if (score >= 48) {
    return {
      title: '🔥 CERTIFIED SHORT-LEASH & LINEN-APRON PRO',
      subtitle: 'Battle-tested across 1990s references, UV bouncers, and midnight hotel saunas.',
      recommendedEp: 'spontaneous-18h-pool-sauna-getaway',
    };
  }
  if (score >= 24) {
    return {
      title: '🍸 DAYLIGHT-BRUNCH CONTENDER',
      subtitle: 'Solid instincts, now let’s see how you handle grown-son math & hotel check-ins!',
      recommendedEp: 'hotel-checkin-two-queen-beds-mixup',
    };
  }
  return {
    title: '🐣 FRESH OUT THE DEN (ROOKIE)',
    subtitle: 'Brand new to the age-slider magic, start your live date run right now!',
    recommendedEp: 'babygirl-hotel-bar-milk-or-martini',
  };
}

const CHECKLIST_STORAGE_KEY = 'cc_club_checklist_v1';

export function loadChecklistCheckedIds(): string[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function toggleChecklistItemInStorage(id: string): string[] {
  const curr = loadChecklistCheckedIds();
  const next = curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // Ignore storage block
  }
  return next;
}

export const CougarCubChecklistModal: React.FC<CougarCubChecklistModalProps> = ({
  open,
  referralCode,
  onClose,
  onClaimChecklistReward,
  onPlayMatchedScenario,
}) => {
  const [checkedIds, setCheckedIds] = useState<string[]>(() => loadChecklistCheckedIds());
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  React.useEffect(() => {
    if (open) {
      setCheckedIds(loadChecklistCheckedIds());
    }
  }, [open]);

  if (!open) return null;

  const score = checkedIds.length * 4;
  const rank = rankForScore(score);
  const refParam = referralCode ? `&ref=${encodeURIComponent(referralCode)}` : '';
  const checklistUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?checklist=1${refParam}`;

  const toggleItem = (id: string) => {
    sfx.messagePop();
    const next = toggleChecklistItemInStorage(id);
    setCheckedIds(next);
  };

  const resetAll = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(CHECKLIST_STORAGE_KEY);
      }
    } catch {
      // Ignore storage block
    }
    setCheckedIds([]);
  };

  const handleShareScore = () => {
    onClaimChecklistReward('checklist_25pt_completed', 0);
    trackEvent('checklist_shared', {
      score,
      checked_count: checkedIds.length,
    });
    const text = `🐆 Have You Ever? 25-Pt Cougars & Cubs Club Score: ${score}/100 (${rank.title}) • Checked ${checkedIds.length}/25 boxes! Beat my score:`;
    setSharePayload({
      title: `Share 25-Pt Club Score (${score}/100)`,
      message: text,
      url: checklistUrl,
      shareSurface: 'checklist_25pt',
      discordMarkdown: `**🐆 Have You Ever? 25-Pt Cougars & Cubs Score: ${score}/100** (${rank.title})\nChecked **${checkedIds.length}/25** boxes • Take the test: ${checklistUrl}`,
    });
  };

  const modalNode = (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-3 sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-label="Have You Ever? 25-Point Cougars & Cubs Experience Test"
        onClick={onClose}
      >
        <div
          className="editorial-hinge-card relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 flex items-start justify-between gap-3 border-b border-zinc-200 bg-white px-5 py-4 sm:px-7">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Have You Ever? • 0 to 100 Club Score
              </div>
              <h2 className="mt-0.5 text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 leading-tight">
                The 25-Point Cougars &amp; Cubs Experience Test
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-600">
                Check every moment you’ve lived (or would survive) and compare your 0 to 100 score with your group chat.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Checklist"
              className="shrink-0 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 space-y-4">

          {/* Live Score Banner */}
          <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 shadow-2xs">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-900">
                {rank.title}
              </div>
              <div className="text-xs text-zinc-600">{rank.subtitle}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-semibold leading-none text-zinc-950 tabular-nums">
                  {score}/100
                </div>
                <div className="text-xs font-medium text-zinc-500 mt-1">
                  {checkedIds.length}/25 Checked
                </div>
              </div>
              {checkedIds.length > 0 && (
                <button
                  type="button"
                  onClick={resetAll}
                  title="Reset checkboxes"
                  className="rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* 25 Checkboxes */}
          <div className="grid gap-2">
            {COUGAR_CUB_CHECKLIST_ITEMS.map((item, idx) => {
              const checked = checkedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition-colors cursor-pointer ${
                    checked
                      ? 'border-zinc-900 bg-zinc-50 text-zinc-950 font-medium'
                      : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50/60'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="h-4 w-4 shrink-0 text-zinc-950 mt-0.5" />
                  ) : (
                    <Square className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
                  )}
                  <span className="leading-relaxed">
                    <strong className="text-zinc-500 mr-1.5">#{idx + 1}.</strong>
                    {item.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Share + Play Matched Scenario Funnel */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-zinc-200 pt-4">
            <button
              type="button"
              onClick={handleShareScore}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>Share 25-Pt Score ({score}/100)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onPlayMatchedScenario(rank.recommendedEp);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Play Matched Scenario →</span>
            </button>
          </div>
          </div>
        </div>
      </div>

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
