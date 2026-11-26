import React, { useState } from 'react';
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
    id: 'sherylcrow4',
    text: 'Sheryl Crow’s "Soak Up the Sun" came on and the Cub beamed: "Oh yeah, that was my favorite song when I was 4!"',
    episodeId: 'sheryl-crow-cold-plunge-impress-incident',
  },
  {
    id: 'late1900s',
    text: 'Heard (or accidentally called) 1998 "back in the late 1900s" out loud.',
    episodeId: 'generational-1900s-venmo-whiplash',
  },
  {
    id: 'liddedbin',
    text: 'Inspected a 20-something’s bathroom for liquid hand soap and a trash can with a lid.',
    episodeId: 'vip-apartment-soap-audit',
  },
  {
    id: 'titosbottle',
    text: 'Caught a shirtless Tito’s mirror selfie or floor mattress hiding in Photo #2.',
    episodeId: 'check-drop',
  },
  {
    id: 'snapchatick',
    text: 'Got asked "what’s your Snap?" past age 35, and felt your soul leave your body.',
    episodeId: 'code-switch-texting',
  },
  {
    id: 'softgoodboy',
    text: 'Melted into an instant grin when she lifted your chin and murmured "Good boy" (or sent a proper British "Sorted, Mummy xx" text).',
    episodeId: 'soft-mommy-domme-good-boy-command',
  },
  {
    id: 'twoqueens',
    text: 'Had a hotel clerk ask "Two Queen beds?" at check-in, or a waiter ask if you want separate checks "for you and your son."',
    episodeId: 'hotel-checkin-two-queen-beds-mixup',
  },
  {
    id: 'sameageshock',
    text: 'Realized post-kiss he’s the EXACT same age as your baby sibling or grown son.',
    episodeId: 'grown-son-same-age-collision',
  },
  {
    id: 'robloxfriends',
    text: 'Met his younger friends and found them AirDropping memes & playing Roblox at 10 PM.',
    episodeId: 'cub-friends-memes-roblox-shock',
  },
  {
    id: 'hawaiitimeshare',
    text: 'Had a skeptical-age college Cub invite you to "my place in Hawaii", then admit it’s his parents’ timeshare.',
    episodeId: 'parents-hawaii-timeshare-flex-trap',
  },
  {
    id: 'uvbouncer',
    text: 'Watched a bouncer UV-scan HIS ID for 45 seconds while waving her straight inside.',
    episodeId: 'cubsplaining-and-bouncer-id-check',
  },
  {
    id: 'gymheadphones',
    text: 'Respected the Sacred Gym Headphone Law for 3 weeks before saying hi at the smoothie bar.',
    episodeId: 'gym-headphones-vs-three-week-nod',
  },
  {
    id: 'babygirlmilk',
    text: 'Sent or received a cheeky "Babygirl" glass-of-milk wink (or dirty martini) at a solo hotel bar.',
    episodeId: 'babygirl-hotel-bar-milk-or-martini',
  },
  {
    id: 'andrewtatevetting',
    text: 'Dropped a casual test question on Date #1 just to verify he’s never quoted Andrew Tate or bought a clip-on podcast mic.',
    episodeId: 'sheryl-crow-cold-plunge-impress-incident',
  },
  {
    id: 'bamboo62',
    text: 'Locked the bedroom at 62°F with bamboo cooling sheets for 3 AM perimenopause heat waves.',
    episodeId: 'cougar-perimenopause-surge-nightsweats',
  },
  {
    id: 'cubgrooming',
    text: '"Groomed" a Cub exclusively via beard oil, SPF 50 & retiring his 5-in-1 neon-blue body wash.',
    episodeId: 'cub-grooming-red-carpet-glowup',
  },
  {
    id: 'bench225',
    text: 'Hit 5x225 on bench press specifically to unlock upstairs stairway-carry privileges.',
    episodeId: 'cub-bench-press-cougar-training',
  },
  {
    id: 'bucketlistblock',
    text: 'Instantly blocked a "never been with a cougar, bucket list" tourist who misspelled "discreet" as "discrete" in his bio.',
    episodeId: 'bucket-list-tourist-instant-block',
  },
  {
    id: 'cubcoldplungespace',
    text: 'Watched an eager Cub try way too hard to impress you with 6 AM 37°F cold plunges and passionate updates on James Webb space news.',
    episodeId: 'sheryl-crow-cold-plunge-impress-incident',
  },
  {
    id: 'getaway18h',
    text: 'Did a spontaneous 18-hour getaway: app video call → rooftop drinks → midnight hotel pool & sauna.',
    episodeId: 'spontaneous-18h-pool-sauna-getaway',
  },
  {
    id: 'blackcatgolden',
    text: 'Lived the 🐈‍⬛ Black Cat Cougar × 🐕 Golden Retriever Cub dynamic: she took her time & pushed back at first, and his tail only wagged harder.',
    episodeId: 'black-cat-pushback-golden-retriever-test',
  },
  {
    id: 'sameagemom',
    text: 'Met his parents and realized you and his mom graduated high school the exact same year.',
    episodeId: 'meeting-his-parents-same-age-mom',
  },
  {
    id: 'weddingplusone',
    text: 'Walked into a wedding as each other’s +1 and owned the slow dance past Table 9’s whispers.',
    episodeId: 'first-wedding-plus-one-debut',
  },
  {
    id: 'houseboysunday',
    text: 'Unlocked Linen-Apron Houseboy Sunday: he cooked from scratch, folded all your laundry, and loaded the dishwasher like an engineer.',
    episodeId: 'houseboy-sunday-sanctuary',
  },
  {
    id: 'anniversary365',
    text: 'Celebrated a 6-Month or 1-Year age-gap anniversary after skeptics gave it "two weekends."',
    episodeId: 'milestone-one-year-anniversary',
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
      subtitle: 'Battle-tested across 1900s jokes, UV bouncers, and midnight hotel saunas.',
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

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1022]/60 p-3 sm:p-5 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Have You Ever? 25-Point Cougars & Cubs Experience Test"
      >
        <div className="vice-panel relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-5 sm:p-7 space-y-4">
          <div className="flex items-start justify-between gap-3 border-b-2 border-[#1E1022]/12 pb-3">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#1E1022] bg-[#FFE3EC] px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide text-[#D90452]">
                <Sparkles className="h-3.5 w-3.5" /> Have You Ever? • 0 to 100 Club Score
              </span>
              <h2 className="mt-1.5 font-display text-2xl sm:text-3xl text-[#1E1022] leading-tight">
                The 25-Point Cougars &amp; Cubs Experience Test
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-medium text-[#5A4664]">
                Check every moment you’ve lived (or would survive) and compare your 0 to 100 score with your group chat!
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Checklist"
              className="pop-btn rounded-xl bg-[#FFF4F7] p-2 text-[#1E1022] hover:bg-[#FF2E63] hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Live Score Banner */}
          <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[#1E1022] bg-[#FFBE0B] px-4 py-3 shadow-[3px_3px_0px_#1E1022]">
            <div>
              <div className="text-xs font-extrabold uppercase text-[#1E1022]">{rank.title}</div>
              <div className="text-xs font-semibold text-[#34223B]">{rank.subtitle}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-display text-4xl leading-none text-[#1E1022]">{score}/100</div>
                <div className="text-xs font-extrabold text-[#1E1022]">{checkedIds.length}/25 Checked</div>
              </div>
              {checkedIds.length > 0 && (
                <button
                  type="button"
                  onClick={resetAll}
                  title="Reset checkboxes"
                  className="rounded-lg border-2 border-[#1E1022] bg-white p-2 text-[#1E1022] cursor-pointer"
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
                  className={`flex items-start gap-2.5 rounded-xl border-2 px-3.5 py-2.5 text-left text-sm transition cursor-pointer ${
                    checked
                      ? 'border-[#1E1022] bg-[#FFF4F7] text-[#1E1022] font-extrabold'
                      : 'border-[#1E1022]/15 bg-white text-[#1E1022] font-medium hover:border-[#1E1022]'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="h-4 w-4 shrink-0 text-[#FF2E63] mt-0.5" />
                  ) : (
                    <Square className="h-4 w-4 shrink-0 text-[#5A4664] mt-0.5" />
                  )}
                  <span>
                    <strong className="text-[#FF2E63] mr-1">#{idx + 1}.</strong>
                    {item.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Share + Play Matched Scenario Funnel */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-t-2 border-[#1E1022]/12 pt-3">
            <button
              type="button"
              onClick={handleShareScore}
              className="pop-btn inline-flex items-center gap-1.5 rounded-xl bg-[#FFBE0B] px-4 py-2.5 text-sm font-extrabold text-[#1E1022] cursor-pointer"
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
              className="pop-btn inline-flex items-center gap-1.5 rounded-xl bg-[#FF2E63] px-5 py-2.5 font-display text-lg text-white cursor-pointer"
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
};
