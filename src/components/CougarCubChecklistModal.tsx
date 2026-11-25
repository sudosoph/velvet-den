import React, { useState } from 'react';
import { CheckSquare, Copy, Play, RotateCcw, Share2, Sparkles, Square, X } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { shareOrCopy } from '../lib/viral';
import { sfx } from '../lib/sound';

interface CougarCubChecklistModalProps {
  open: boolean;
  referralCode?: string;
  onClose: () => void;
  onClaimChecklistReward: (rewardKey: string, amount: number) => boolean;
  onPlayMatchedScenario: (episodeId: string) => void;
}

export const COUGAR_CUB_CHECKLIST_ITEMS: { id: string; text: string; episodeId: string }[] = [
  {
    id: 'math2008',
    text: 'Silently calculated where you both were in 2008 within 20 minutes of Date #1.',
    episodeId: 'junior-cougar-gatekeeper-tease',
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
    text: 'Got asked "what’s your Snap?" past age 35—and felt your soul leave your body.',
    episodeId: 'code-switch-texting',
  },
  {
    id: 'seatwarmer',
    text: 'Used a phone flashlight on a tiny menu—while he pre-heated your passenger-seat warmer.',
    episodeId: 'candlelit-menu-font-seatwarmer',
  },
  {
    id: 'twoqueens',
    text: 'Had a hotel clerk or waiter ask: "Two Queen beds for you and your son?!"',
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
    id: 'cubsplaining',
    text: 'Caught a Cub "Cubsplaining" Fleetwood Mac, vinyl, or mortgages to an actual homeowner.',
    episodeId: 'cubsplaining-and-bouncer-id-check',
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
    id: 'bigcarl',
    text: 'Poured a giant "Cougar Town" Big Carl wine glass and called it "just one glass."',
    episodeId: 'milestone-six-month-anniversary',
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
    id: 'petstaredown',
    text: 'Survived an unblinking stare-down from her spoiled rescue dog or orange cat Mochi.',
    episodeId: 'puma-dog-park-vetting',
  },
  {
    id: 'campussushi',
    text: 'Dressed down in sneakers for a campus stroll + sushi "Professor & Grad Student" bit.',
    episodeId: 'campus-stroll-sushi-professor-student',
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
    text: 'Unlocked Linen-Apron Houseboy Sunday (cooked from scratch + zero dishes left in the sink).',
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
      subtitle: 'You didn’t just read r/CougarsAndCubs—you practically wrote the sacred texts.',
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
      subtitle: 'Solid instincts—now let’s see how you handle grown-son math & hotel check-ins!',
      recommendedEp: 'hotel-checkin-two-queen-beds-mixup',
    };
  }
  return {
    title: '🐣 FRESH OUT THE DEN (ROOKIE)',
    subtitle: 'Brand new to the age-slider magic—start your live training run right now!',
    recommendedEp: 'babygirl-hotel-bar-milk-or-martini',
  };
}

export const CougarCubChecklistModal: React.FC<CougarCubChecklistModalProps> = ({
  open,
  referralCode,
  onClose,
  onClaimChecklistReward,
  onPlayMatchedScenario,
}) => {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [shareToast, setShareToast] = useState<string | null>(null);

  if (!open) return null;

  const score = checkedIds.length * 4;
  const rank = rankForScore(score);
  const refParam = referralCode ? `&ref=${encodeURIComponent(referralCode)}` : '';
  const checklistUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?checklist=1${refParam}`;

  const toggleItem = (id: string) => {
    sfx.messagePop();
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleShareScore = async () => {
    const text = `🐆 Official Cougars & Cubs Experience Test: ${score}/100 (${rank.title}) — Checked ${checkedIds.length}/25 boxes 💀 Beat my score:`;
    await shareOrCopy({
      title: 'Cougars & Cubs 25-Point Viral Score Test',
      text,
      url: checklistUrl,
    });
    const granted = onClaimChecklistReward('viral_checklist_share', 2);
    setShareToast(
      granted
        ? '🎉 Score card copied to clipboard (+2 Bonus Credits unlocked)! Drop it in TikTok/X/group chat!'
        : '📤 Score card & referral link copied! Challenge your group chat or date.',
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="25-Point Cougars & Cubs Viral Experience Checklist"
    >
      <div className="vice-panel relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-[#140b24] p-4 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <span className="inline-flex items-center gap-1 rounded bg-pink-500/25 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-pink-200">
              <Sparkles className="h-3 w-3 text-amber-300" /> TikTok Green-Screen Ready • 0–100 Score Test
            </span>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl text-white leading-none">
              THE 25-POINT COUGARS &amp; CUBS EXPERIENCE TEST
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              Check every moment you’ve lived (or would survive)—share your 0–100 score for +2 Free Credits!
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Checklist"
            className="rounded-xl border-2 border-black bg-slate-800 p-2 text-slate-200 hover:bg-rose-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Score Banner */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-gradient-to-r from-[#2c103d] via-[#1b1130] to-[#0d2830] px-4 py-3 shadow-lg">
          <div>
            <div className="text-[11px] font-extrabold uppercase text-amber-300">{rank.title}</div>
            <div className="text-xs text-slate-200">{rank.subtitle}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-display text-4xl leading-none text-teal-300">{score}/100</div>
              <div className="text-[10px] font-bold text-slate-300">{checkedIds.length}/25 Checked</div>
            </div>
            {checkedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setCheckedIds([])}
                title="Reset checkboxes"
                className="rounded-lg bg-black/50 p-2 text-slate-300 hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* 25 Checkboxes */}
        <div className="grid gap-1.5">
          {COUGAR_CUB_CHECKLIST_ITEMS.map((item, idx) => {
            const checked = checkedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`flex items-start gap-2.5 rounded-xl border px-3 py-2 text-left text-xs transition cursor-pointer ${
                  checked
                    ? 'border-amber-400/70 bg-amber-400/15 text-white font-semibold'
                    : 'border-white/10 bg-black/35 text-slate-200 hover:bg-black/55'
                }`}
              >
                {checked ? (
                  <CheckSquare className="h-4 w-4 shrink-0 text-amber-300 mt-0.5" />
                ) : (
                  <Square className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                )}
                <span>
                  <strong className="text-pink-300 mr-1">#{idx + 1}.</strong>
                  {item.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Viral Share + Play Matched Scenario Funnel */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={handleShareScore}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-amber-400 px-4 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-amber-300 cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Score Receipt (+2 Cr)</span>
            <Copy className="h-3.5 w-3.5 ml-0.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onPlayMatchedScenario(rank.recommendedEp);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-rose-500 px-5 py-2.5 font-display text-xl text-white hover:bg-rose-400 cursor-pointer"
          >
            <Play className="h-4 w-4" />
            <span>Play Matched Scenario →</span>
          </button>
        </div>

        {shareToast && <p className="text-xs font-bold text-emerald-300">{shareToast}</p>}
      </div>
    </div>
  );
};
