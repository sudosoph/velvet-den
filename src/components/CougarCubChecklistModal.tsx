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

export type ChecklistLifestyleTier = 'rookie' | 'intermediate' | 'deep_cuts';

export interface ChecklistItemSpec {
  id: string;
  tier: ChecklistLifestyleTier;
  points: 2 | 3 | 5;
  text: string;
  episodeId: string;
}

export const CHECKLIST_TIER_META: Record<
  ChecklistLifestyleTier,
  {
    badge: string;
    title: string;
    subtitle: string;
    pointsLabel: string;
  }
> = {
  rookie: {
    badge: '🐣 Level 1 • Rookie Initiation',
    title: 'First-Drink & App Culture Shocks',
    subtitle: 'Timeline math, ID flashlights, and surviving the opening DM filter.',
    pointsLabel: '+2 pts each',
  },
  intermediate: {
    badge: '🔥 Level 2 • Regular Rotation',
    title: 'Sleepover Rules, Gym Lore & Upgrading',
    subtitle: 'Lidded bins, 62°F cooling sheets, retiring 5-in-1 wash, and hotel-bar eye contact.',
    pointsLabel: '+3 pts each',
  },
  deep_cuts: {
    badge: '👑 Level 3 • Deep Cuts & Legends',
    title: 'Advanced Lifestyle & Hall-of-Fame Moments',
    subtitle: '"Two Queen beds?!", same-age-mom graduations, and Linen-Apron Houseboy Sundays.',
    pointsLabel: '+5 pts each',
  },
};

export const COUGAR_CUB_CHECKLIST_ITEMS: ChecklistItemSpec[] = [
  // === TIER 1: ROOKIE INITIATION (10 items × 2 pts = 20 pts) ===
  {
    id: 'math2008',
    tier: 'rookie',
    points: 2,
    text: 'Silently calculated where each of you was in 2008 within twenty minutes of sitting down on Date #1.',
    episodeId: 'velvet-room',
  },
  {
    id: 'late1900s',
    tier: 'rookie',
    points: 2,
    text: 'Heard (or accidentally called) 1998 "back in the late 1900s" out loud across a candlelit table.',
    episodeId: 'hawthorne-campus',
  },
  {
    id: 'bucketlistblock',
    tier: 'rookie',
    points: 2,
    text: 'Blocked a "never been with a cougar, bucket list" tourist who misspelled "discreet" as "discrete" in his bio.',
    episodeId: 'velvet-room',
  },
  {
    id: 'snapchatick',
    tier: 'rookie',
    points: 2,
    text: 'Got asked for your Snapchat handle past age 35 and felt your soul physically leave your body.',
    episodeId: 'code-switch-texting',
  },
  {
    id: 'uvbouncer',
    tier: 'rookie',
    points: 2,
    text: 'Watched a lounge bouncer UV-scan HIS driver’s license for forty-five seconds while waving her straight inside.',
    episodeId: 'havana-salsa',
  },
  {
    id: 'song-age-four',
    tier: 'rookie',
    points: 2,
    text: 'A classic early-2000s radio anthem came on in the car and the Cub beamed: "Oh yeah, my favorite song when I was four!"',
    episodeId: 'cougarmarket',
  },
  {
    id: 'genx-period-punctuation',
    tier: 'rookie',
    points: 2,
    text: 'Decoded that a text reading "Sounds good." with a period means genuine Gen-X happiness, not impending doom.',
    episodeId: 'velvet-room',
  },
  {
    id: 'gmail-older-license',
    tier: 'rookie',
    points: 2,
    text: 'Realized one partner’s firstname.lastname Gmail address is older than the other’s learner’s permit.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'nirvana-tshirt-check',
    tier: 'rookie',
    points: 2,
    text: 'Verified a date wearing a vintage Nirvana tee could actually name three songs off In Utero.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'podcast-mic-vetting',
    tier: 'rookie',
    points: 2,
    text: 'Dropped a casual Date #1 litmus question just to verify he has never owned a clip-on street-interview podcast mic.',
    episodeId: 'velvet-room',
  },

  // === TIER 2: INTERMEDIATE ROTATION (10 items × 3 pts = 30 pts) ===
  {
    id: 'liddedbin',
    tier: 'intermediate',
    points: 3,
    text: 'Inspected a twenty-something’s bathroom within thirty seconds for botanical soap, a clean hand towel, and a lidded bin.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'seatwarmer',
    tier: 'intermediate',
    points: 3,
    text: 'Used a phone flashlight on a tiny dim-lit menu while he quietly pre-heated your passenger-seat warmer.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'cubsplaining',
    tier: 'intermediate',
    points: 3,
    text: 'Caught a Cub mid-"Cubsplain" lecturing an actual homeowner on Fleetwood Mac, vinyl pressings, or mortgage rates.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'gymheadphones',
    tier: 'intermediate',
    points: 3,
    text: 'Respected the Sacred Gym Headphone Law for three full weeks before finally saying hello at the smoothie counter.',
    episodeId: 'dawn-lap-pool',
  },
  {
    id: 'cubgrooming',
    tier: 'intermediate',
    points: 3,
    text: '"Groomed" a Cub exclusively via beard oil, mineral SPF 50, and retiring his 5-in-1 neon-blue body wash.',
    episodeId: 'dawn-lap-pool',
  },
  {
    id: 'bamboo62',
    tier: 'intermediate',
    points: 3,
    text: 'Locked the bedroom thermostat at 62°F with cooling bamboo sheets (and two separate duvets) for 3 AM heat waves.',
    episodeId: 'palisades-racquet',
  },
  {
    id: 'babygirlmilk',
    tier: 'intermediate',
    points: 3,
    text: 'Sent or received a cheeky "Babygirl" glass-of-milk wink (or three-olive dirty martini) across a solo hotel bar.',
    episodeId: 'velvet-room',
  },
  {
    id: 'bigcarl',
    tier: 'intermediate',
    points: 3,
    text: 'Poured a giant "Cougar Town" Big Carl wine glass on Friday night and called it "just one glass."',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'early-dinner-convert',
    tier: 'intermediate',
    points: 3,
    text: 'Converted wholeheartedly to 7:15 PM reservations so you’re home in silk loungewear by ten next to a stocked wine fridge.',
    episodeId: 'velvet-room',
  },
  {
    id: 'blackcatgolden',
    tier: 'intermediate',
    points: 3,
    text: 'Lived the 🐈‍⬛ Black Cat Cougar × 🐕 Golden Retriever Cub dynamic: she paced the first three dates, and his tail only wagged harder.',
    episodeId: 'st-jude-coffee',
  },

  // === TIER 3: DEEP CUTS & LIFESTYLE APEX (10 items × 5 pts = 50 pts) ===
  {
    id: 'twoqueens',
    tier: 'deep_cuts',
    points: 5,
    text: 'Had a hotel clerk ask "Two Queen beds?" at check-in, or a waiter ask about separate checks "for you and your son."',
    episodeId: 'waiter-son-incident',
  },
  {
    id: 'sameageshock',
    tier: 'deep_cuts',
    points: 5,
    text: 'Realized post-kiss that he is the EXACT same age as your baby sibling, nephew, or grown child.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'sameagemom',
    tier: 'deep_cuts',
    points: 5,
    text: 'Met his parents for Sunday dinner and realized you and his mom graduated high school the exact same year.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'houseboysunday',
    tier: 'deep_cuts',
    points: 5,
    text: 'Unlocked Linen-Apron Houseboy Sunday: he cooked from scratch, folded every towel, and loaded the dishwasher like an engineer.',
    episodeId: 'cougarmarket',
  },
  {
    id: 'bench225',
    tier: 'deep_cuts',
    points: 5,
    text: 'Hit 5×225 on bench press (or trained specifically) to unlock upstairs stairway-carry privileges.',
    episodeId: 'dawn-lap-pool',
  },
  {
    id: 'softgoodboy',
    tier: 'deep_cuts',
    points: 5,
    text: 'Melted into an instant grin when she lifted your chin with two fingers and murmured "Good boy" (or got a British "Sorted xx").',
    episodeId: 'hawthorne-campus',
  },
  {
    id: 'getaway18h',
    tier: 'deep_cuts',
    points: 5,
    text: 'Pulled off the spontaneous 18-hour escape: quick 6 PM voice call → rooftop cocktails → midnight hotel pool & cedar sauna.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'maui-condo-twist',
    tier: 'deep_cuts',
    points: 5,
    text: 'Had a college-age Cub invite you to "my place in Hawaii" before admitting ten minutes later it’s his parents’ Maui condo.',
    episodeId: 'palisades-racquet',
  },
  {
    id: 'weddingplusone',
    tier: 'deep_cuts',
    points: 5,
    text: 'Walked into a wedding as each other’s proud +1, turned curious stares into comped dessert, and owned the slow dance.',
    episodeId: 'havana-salsa',
  },
  {
    id: 'anniversary365',
    tier: 'deep_cuts',
    points: 5,
    text: 'Celebrated a 6-Month or 1-Year age-gap anniversary long after nosy acquaintances predicted "two fun weekends."',
    episodeId: 'terminal-b-airport',
  },
];

export function computeChecklistScore(checkedIds: readonly string[]): number {
  const checkedSet = new Set(checkedIds);
  return COUGAR_CUB_CHECKLIST_ITEMS.reduce(
    (sum, item) => sum + (checkedSet.has(item.id) ? item.points : 0),
    0,
  );
}

function rankForScore(score: number): { title: string; subtitle: string; recommendedEp: string } {
  if (score >= 85) {
    return {
      title: '👑 HALL-OF-FAME COUGAR & CUB APEX',
      subtitle: 'You didn’t just date across the gap, you practically wrote the Sunset Hills bylaws.',
      recommendedEp: 'babygirl-hotel-bar-milk-or-martini',
    };
  }
  if (score >= 60) {
    return {
      title: '🐆 CERTIFIED SHORT-LEASH & LINEN-APRON PRO',
      subtitle: 'Survived "Two Queen beds?!", same-age-mom math, 62°F cooling sheets, and Houseboy Sundays.',
      recommendedEp: 'spontaneous-18h-pool-sauna-getaway',
    };
  }
  if (score >= 35) {
    return {
      title: '🔥 SEASONED SUNSET HILLS REGULAR',
      subtitle: 'Lidded-bin certified, immune to Cubsplaining, and fluent in 7:15 PM reservations.',
      recommendedEp: 'hotel-checkin-two-queen-beds-mixup',
    };
  }
  if (score >= 16) {
    return {
      title: '🍸 FIRST-DRINK CONTENDER',
      subtitle: 'Decoded Gen-X periods & UV bouncer scans, ready for Sleepover & Deep-Cut territory!',
      recommendedEp: 'velvet-room',
    };
  }
  return {
    title: '🐣 CURIOUS CUB / WINDOW SHOPPER',
    subtitle: 'Just lowered the age slider, step into Sunset Hills and earn your stripes!',
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
    const validIds = new Set(COUGAR_CUB_CHECKLIST_ITEMS.map((i) => i.id));
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string' && validIds.has(x))
      : [];
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

const TIER_ORDER: ChecklistLifestyleTier[] = ['rookie', 'intermediate', 'deep_cuts'];

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

  const score = computeChecklistScore(checkedIds);
  const rank = rankForScore(score);
  const refParam = referralCode ? `&ref=${encodeURIComponent(referralCode)}` : '';
  const checklistUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?checklist=1${refParam}`;

  const rookieCount = COUGAR_CUB_CHECKLIST_ITEMS.filter(
    (i) => i.tier === 'rookie' && checkedIds.includes(i.id),
  ).length;
  const interCount = COUGAR_CUB_CHECKLIST_ITEMS.filter(
    (i) => i.tier === 'intermediate' && checkedIds.includes(i.id),
  ).length;
  const deepCount = COUGAR_CUB_CHECKLIST_ITEMS.filter(
    (i) => i.tier === 'deep_cuts' && checkedIds.includes(i.id),
  ).length;

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
    const text = `🐆 Have You Ever? Cougars & Cubs Lifestyle Score: ${score}/100 (${rank.title})\n🐣 Rookie ${rookieCount}/10 · 🔥 Regular ${interCount}/10 · 👑 Deep Cuts ${deepCount}/10\nBeat my score:`;
    setSharePayload({
      title: `Share Club Lifestyle Score (${score}/100)`,
      message: text,
      url: checklistUrl,
      shareSurface: 'checklist_25pt',
      discordMarkdown: `**🐆 Have You Ever? Cougars & Cubs Score: ${score}/100** (${rank.title})\n🐣 Rookie **${rookieCount}/10** · 🔥 Regular **${interCount}/10** · 👑 Deep Cuts **${deepCount}/10** • Take the test: ${checklistUrl}`,
    });
  };

  let runningNumber = 0;

  const modalNode = (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-3 sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-label="Have You Ever? 3-Tier Cougars & Cubs Experience Test"
        onClick={onClose}
      >
        <div
          className="editorial-hinge-card relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 flex items-start justify-between gap-3 border-b border-zinc-200 bg-white px-5 py-4 sm:px-7">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Have You Ever? • Rookie → Regular → Deep Cuts (0 to 100 Score)
              </div>
              <h2 className="mt-0.5 text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 leading-tight">
                The 3-Tier Cougars &amp; Cubs Experience Test
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-600">
                Weighted by real-life subculture depth (+2 Rookie, +3 Regular, +5 Deep Cuts) to measure how seasoned you actually are.
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

          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Live Weighted Score & 3-Tier Breakdown Banner */}
            <div className="sticky top-0 z-10 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 shadow-2xs space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-900">
                    {rank.title}
                  </div>
                  <div className="text-xs text-zinc-600">{rank.subtitle}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div
                      data-testid="checklist-weighted-score"
                      className="text-2xl sm:text-3xl font-semibold leading-none text-zinc-950 tabular-nums"
                    >
                      {score}/100
                    </div>
                    <div className="text-xs font-medium text-zinc-500 mt-1">
                      {checkedIds.length}/{COUGAR_CUB_CHECKLIST_ITEMS.length} Checked
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

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-200/80 text-[11px] font-semibold text-zinc-700">
                <div>🐣 Rookie: {rookieCount}/10</div>
                <div>🔥 Regular: {interCount}/10</div>
                <div>👑 Deep Cuts: {deepCount}/10</div>
              </div>
            </div>

            {/* 3 Escalating Lifestyle Sections */}
            {TIER_ORDER.map((tierKey) => {
              const meta = CHECKLIST_TIER_META[tierKey];
              const tierItems = COUGAR_CUB_CHECKLIST_ITEMS.filter((i) => i.tier === tierKey);
              return (
                <section key={tierKey} data-testid={`checklist-tier-${tierKey}`} className="space-y-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 pb-2">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-rose-600">
                        {meta.badge}
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-zinc-950">
                        {meta.title}
                      </h3>
                      <p className="text-xs text-zinc-500">{meta.subtitle}</p>
                    </div>
                    <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white">
                      {meta.pointsLabel}
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {tierItems.map((item) => {
                      runningNumber += 1;
                      const num = runningNumber;
                      const checked = checkedIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors cursor-pointer ${
                            checked
                              ? 'border-zinc-900 bg-zinc-50 text-zinc-950 font-medium'
                              : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50/60'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {checked ? (
                              <CheckSquare className="h-4 w-4 shrink-0 text-zinc-950 mt-0.5" />
                            ) : (
                              <Square className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
                            )}
                            <span className="leading-relaxed">
                              <strong className="text-zinc-500 mr-1.5">#{num}.</strong>
                              {item.text}
                            </span>
                          </div>
                          <span
                            className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                              checked
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-zinc-100 text-zinc-500'
                            }`}
                          >
                            +{item.points}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* Bottom Share + Play Matched Scenario Funnel */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4">
              <button
                type="button"
                onClick={handleShareScore}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Lifestyle Score ({score}/100)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPlayMatchedScenario(rank.recommendedEp);
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" />
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
