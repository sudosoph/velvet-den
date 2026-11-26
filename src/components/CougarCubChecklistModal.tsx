import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckSquare, Play, RotateCcw, Share2, Sparkles, Square, X } from 'lucide-react';
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#18101E]/65 p-3 sm:p-5 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Have You Ever? 25-Point Cougars & Cubs Experience Test"
      >
        <div className="editorial-hinge-card relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-[#FFFDF9] p-5 sm:p-7 space-y-4 shadow-2xl">
          <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-rose-700">
                <Sparkles className="h-3.5 w-3.5" /> Have You Ever? • 0 to 100 Club Score
              </span>
              <h2 className="mt-1.5 font-editorial text-2xl sm:text-3xl font-bold text-[#18101E] leading-tight">
                The 25-Point Cougars &amp; Cubs Experience Test
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-medium text-stone-600">
                Check every moment you’ve lived (or would survive) and compare your 0 to 100 score with your group chat!
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Checklist"
              className="rounded-full border border-stone-200 bg-white p-2.5 text-stone-700 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Live Score Banner */}
          <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-[#FFFDF9] to-rose-50/70 px-4 py-3.5 shadow-sm">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-rose-700">
                {rank.title}
              </div>
              <div className="text-xs font-medium text-stone-600">{rank.subtitle}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-editorial text-3xl sm:text-4xl font-bold leading-none text-[#18101E]">
                  {score}/100
                </div>
                <div className="text-[11px] font-extrabold text-stone-600">
                  {checkedIds.length}/25 Checked
                </div>
              </div>
              {checkedIds.length > 0 && (
                <button
                  type="button"
                  onClick={resetAll}
                  title="Reset checkboxes"
                  className="rounded-full border border-stone-300 bg-white p-2 text-stone-700 hover:bg-stone-50 cursor-pointer"
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
                  className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-left text-sm transition cursor-pointer ${
                    checked
                      ? 'border-rose-400 bg-rose-50/70 text-[#18101E] font-bold shadow-2xs'
                      : 'border-stone-200 bg-white text-[#18101E] font-medium hover:border-stone-400 hover:bg-stone-50/60'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  ) : (
                    <Square className="h-4 w-4 shrink-0 text-stone-400 mt-0.5" />
                  )}
                  <span className="leading-relaxed">
                    <strong className="text-rose-600 mr-1.5">#{idx + 1}.</strong>
                    {item.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Share + Play Matched Scenario Funnel */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-stone-200 pt-4">
            <button
              type="button"
              onClick={handleShareScore}
              className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-amber-950 hover:bg-amber-200/80 transition cursor-pointer"
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
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-rose-700 transition cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Play Matched Scenario →</span>
            </button>
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
