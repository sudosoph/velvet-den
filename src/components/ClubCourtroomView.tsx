import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Crown,
  Flame,
  Flag,
  Send,
  Share2,
  Sparkles,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import type { PlayerRole } from '../domain/taxonomy';
import { sfx } from '../lib/sound';
import { shareOrCopy } from '../lib/viral';

export interface CourtroomStory {
  id: string;
  aslTag: string;
  headline: string;
  story: string;
  vibeBadge: string;
  crownHer: number;
  dumpHer: number;
  crownHim: number;
  dumpHim: number;
  communitySubmitted?: boolean;
}

interface ClubCourtroomViewProps {
  role: PlayerRole;
  onBackToRoster: () => void;
  onOpenCubAcademy: () => void;
  onCastCourtVote: () => void;
  onGrantBonusCredits: (rewardKey: string, amount: number) => boolean;
}

export const SEED_COURTROOM_STORIES: CourtroomStory[] = [
  {
    id: 'court-delta-hold-rebook-hero',
    aslTag: '44F × 27M • Atlanta',
    headline:
      'Connecting Flight Cancelled at 10 PM; He Sat on Hold With Delta for 47 Minutes While I Showered',
    story:
      'Landed stranded in Charlotte during summer storms. Without me asking, he conferenced the airline desk, rebooked me into seat 2A on the 7 AM departure, and had hot ginger tea waiting downstairs.',
    vibeBadge: '✈️ Travel MVP',
    crownHer: 97,
    dumpHer: 3,
    crownHim: 92,
    dumpHim: 8,
  },
  {
    id: 'court-close-friends-green-circle',
    aslTag: '41F × 25M • Los Angeles',
    headline: 'Posted Our Cabo Anniversary Dinner Exclusively to His 9-Person "Close Friends" Ring',
    story:
      'Four months of great dates, yet when he finally posted our beachfront toast I spotted the neon green circle—populated strictly by out-of-state cousins and zero local pals.',
    vibeBadge: '🟢 Soft-Launch Dodge',
    crownHer: 8,
    dumpHer: 92,
    crownHim: 29,
    dumpHim: 71,
  },
  {
    id: 'court-allergen-brownies-soccer',
    aslTag: '43F × 28M • Seattle',
    headline: 'Baked Nut-Free Fudge Brownies From Scratch for My Teenager’s Regional Soccer Bus',
    story:
      'Remembered from one passing comment six weeks earlier that my son’s goalkeeper has a tree-nut allergy, labeled every tin neatly, and cheered from the top bleacher.',
    vibeBadge: '🧁 High-EQ King',
    crownHer: 98,
    dumpHer: 2,
    crownHim: 94,
    dumpHim: 6,
  },
  {
    id: 'court-roommates-crashed-sonoma',
    aslTag: '46F × 24M • Napa',
    headline: 'Two Uninvited Roommates Pulled Up to Our Vineyard Cottage Carrying Warm Seltzer Packs',
    story:
      'I booked a quiet Sonoma rental for our weekend escape. At 9 PM gravel crunches outside and his two buddies stroll in asking for the Wi-Fi password and pool towels.',
    vibeBadge: '🚩 Boundary Crash',
    crownHer: 4,
    dumpHer: 96,
    crownHim: 18,
    dumpHim: 82,
  },
  {
    id: 'court-stick-shift-porsche-lessons',
    aslTag: '49F × 29M • Scottsdale',
    headline: 'Secretly Took Three Stick-Shift Lessons So He Could Drive My Classic Carrera Home',
    story:
      'Never acted weird that he didn’t drive manual—booked an instructor on his own dime and smoothly took the keys after our wine-pairing dinner.',
    vibeBadge: '🏎️ Smooth Operator',
    crownHer: 96,
    dumpHer: 4,
    crownHim: 95,
    dumpHim: 5,
  },
  {
    id: 'court-shut-down-buddy-joke',
    aslTag: '45F × 26M • Chicago',
    headline: 'Shut Down His Friend’s "Mrs. Robinson" Crack in Three Calm Words Without Raising His Voice',
    story:
      'At his friend’s birthday pub night, one guy made a tired movie joke. My boyfriend smiled deadpan, said "Show some class," and moved us to a cozy corner banquette.',
    vibeBadge: '🛡️ Spine of Steel',
    crownHer: 99,
    dumpHer: 1,
    crownHim: 93,
    dumpHim: 7,
  },
  {
    id: 'court-mature-skin-birthday-box',
    aslTag: '42F × 25M • Boston',
    headline: 'Wrapped Up a $180 Jar Labeled "Extra-Firming Mature Wrinkle Rescue" for My Birthday',
    story:
      'Swore the department-store clerk told him it was the luxury bestseller—sweetest handwritten card attached to the most mortifying label on earth.',
    vibeBadge: '🎁 Clueless Sweetheart?',
    crownHer: 38,
    dumpHer: 62,
    crownHim: 64,
    dumpHim: 36,
  },
  {
    id: 'court-toothbrush-stays-in-bag',
    aslTag: '51F × 30M • Denver',
    headline: 'Kept His Charger & Toothbrush Inside His Duffel Until I Explicitly Offered Him a Drawer',
    story:
      'Zero stealth territory-marking in my townhouse for three straight months—waited until I cleared top-drawer space before leaving a single item behind.',
    vibeBadge: '🧳 Sanctuary Respect',
    crownHer: 95,
    dumpHer: 5,
    crownHim: 87,
    dumpHim: 13,
  },
  {
    id: 'court-four-monitor-snowstorm',
    aslTag: '44F × 24M • Minneapolis',
    headline: 'Set Up Four Curved Crypto Monitors on My Dining Table During a Two-Day Blizzard',
    story:
      'Came over before the snow hit carrying two suitcases of cables and turned my walnut dining room into a glowing day-trading command bunker until Tuesday.',
    vibeBadge: '🖥️ Cable Squatting',
    crownHer: 6,
    dumpHer: 94,
    crownHim: 27,
    dumpHim: 73,
  },
  {
    id: 'court-prepaid-valet-surprise',
    aslTag: '48F × 28M • Miami',
    headline: 'Pre-Paid Valet & Tipped the Hostess Ahead So My Wallet Never Left My Evening Clutch',
    story:
      'Took me out for my promotion celebration on his sous-chef paycheck—coordinated every detail with the restaurant at 4 PM so the evening glided seamlessly.',
    vibeBadge: '🥂 Pure Class',
    crownHer: 98,
    dumpHer: 2,
    crownHim: 91,
    dumpHim: 9,
  },
  {
    id: 'court-wedding-grandma-friend-dodge',
    aslTag: '40F × 25M • Charleston',
    headline: 'Introduced Me to His 82-Year-Old Grandmother at a Family Wedding as "My Good Friend"',
    story:
      'Claimed afterward he didn’t want Nana to spill punch on her dress from shock—after I flew two states in heels to be his date.',
    vibeBadge: '💒 Plus-One Foul',
    crownHer: 5,
    dumpHer: 95,
    crownHim: 22,
    dumpHim: 78,
  },
  {
    id: 'court-birthday-receipt-calculator',
    aslTag: '43F × 26M • San Francisco',
    headline: 'Pulled Out a Receipt-Scanning Tax App to Itemize Who Ate Which Calamari Ring',
    story:
      'Invited me out for HIS idea of tapas, then spent eleven minutes under the candle photographing the paper slip to calculate exact 8.625% tax.',
    vibeBadge: '🧮 Itemized Ick',
    crownHer: 3,
    dumpHer: 97,
    crownHim: 19,
    dumpHim: 81,
  },
  {
    id: 'court-fixed-moms-wifi-printer',
    aslTag: '47F × 27M • Portland',
    headline: 'Spent Ninety Patient Minutes Fixing My 74-Year-Old Mom’s Wireless Printer & Wrote Big Labels',
    story:
      'Never sighed once, drew her a laminated three-step cheat sheet in thick marker, and stayed for lemon bars at her kitchen table.',
    vibeBadge: '🖨️ Son-in-Law Tier',
    crownHer: 99,
    dumpHer: 1,
    crownHim: 96,
    dumpHim: 4,
  },
  {
    id: 'court-kept-boyfriend-kitchen-reel',
    aslTag: '45F × 23M • Dallas',
    headline: 'Filmed a "Day in the Life of a Kept Boyfriend" Reel in My Marble Kitchen While I Worked',
    story:
      'Found my espresso machine and backyard pool trending with 90,000 views while he posed in my robe pretending I pay his car note.',
    vibeBadge: '📱 Clout Tourist',
    crownHer: 2,
    dumpHer: 98,
    crownHim: 14,
    dumpHim: 86,
  },
  {
    id: 'court-groomer-pickup-deposition',
    aslTag: '50F × 29M • Washington DC',
    headline: 'Left Work Early to Pick Up My Muddy Golden Retriever When My Deposition Ran Late',
    story:
      'Picked up Cooper before the kennel late fee hit, towel-dried every paw, walked him two miles, and had Thai curry waiting when I got home at eight.',
    vibeBadge: '🐾 Ride-or-Die Partner',
    crownHer: 99,
    dumpHer: 1,
    crownHim: 97,
    dumpHim: 3,
  },
];

function isLiveHttpRuntime(): boolean {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return false;
  const ua = (navigator.userAgent || '').toLowerCase();
  if (ua.includes('jsdom')) return false;
  return window.location.protocol === 'https:' || window.location.protocol === 'http:';
}

function getDailyDropNumberAndIndex(total: number): { dropNum: number; idx: number } {
  const epochDay = Math.floor(Date.now() / 86_400_000);
  const dropNum = Math.max(1, epochDay - 20750);
  return { dropNum, idx: epochDay % Math.max(1, total) };
}

export const ClubCourtroomView: React.FC<ClubCourtroomViewProps> = ({
  role,
  onBackToRoster,
  onOpenCubAcademy,
  onCastCourtVote,
  onGrantBonusCredits,
}) => {
  const [stories, setStories] = useState<CourtroomStory[]>(SEED_COURTROOM_STORIES);
  const [votes, setVotes] = useState<Record<string, 'crown' | 'dump'>>({});
  const [copiedDaily, setCopiedDaily] = useState(false);
  const [creditToast, setCreditToast] = useState<string | null>(null);

  // Pitch Story Form
  const [aslInput, setAslInput] = useState('43F × 26M • Los Angeles');
  const [headlineInput, setHeadlineInput] = useState('');
  const [storyInput, setStoryInput] = useState('');
  const [pitchStatus, setPitchStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isLiveHttpRuntime()) return;
    let cancelled = false;
    fetch('/api/courtroom')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { stories?: CourtroomStory[] } | null) => {
        if (!cancelled && data?.stories && Array.isArray(data.stories) && data.stories.length > 0) {
          setStories(data.stories);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const { dropNum, idx: dailyIdx } = useMemo(
    () => getDailyDropNumberAndIndex(SEED_COURTROOM_STORIES.length),
    [],
  );
  const dailyStory = stories[dailyIdx] ?? stories[0];

  const handleVote = async (storyId: string, verdict: 'crown' | 'dump') => {
    if (votes[storyId]) return;
    if (verdict === 'crown') sfx.greenFlag();
    else sfx.redFlag();

    setVotes((prev) => ({ ...prev, [storyId]: verdict }));
    onCastCourtVote();

    setStories((prev) =>
      prev.map((s) => {
        if (s.id !== storyId) return s;
        return {
          ...s,
          crownHer: s.crownHer + (role === 'her' && verdict === 'crown' ? 1 : 0),
          dumpHer: s.dumpHer + (role === 'her' && verdict === 'dump' ? 1 : 0),
          crownHim: s.crownHim + (role === 'him' && verdict === 'crown' ? 1 : 0),
          dumpHim: s.dumpHim + (role === 'him' && verdict === 'dump' ? 1 : 0),
        };
      }),
    );

    if (storyId === dailyStory.id) {
      onGrantBonusCredits(`daily_drop_${dropNum}`, 0);
      setCreditToast('🎉 +15 Club XP & Dateodex stamp recorded for Today’s Daily Red Flag Drop!');
    }

    if (isLiveHttpRuntime()) {
      try {
        await fetch('/api/courtroom/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storyId, verdict, role }),
        });
      } catch {
        // Local optimistic update already applied
      }
    }
  };

  const handleShareDailyReceipt = async () => {
    const picked = votes[dailyStory.id] ?? 'dump';
    const herTotal = Math.max(1, dailyStory.crownHer + dailyStory.dumpHer);
    const herDumpPct = Math.round((dailyStory.dumpHer / herTotal) * 100);
    const himTotal = Math.max(1, dailyStory.crownHim + dailyStory.dumpHim);
    const himCrownPct = Math.round((dailyStory.crownHim / himTotal) * 100);

    const url =
      typeof window !== 'undefined' && window.location.origin.startsWith('http')
        ? `${window.location.origin}/?court=1`
        : `${BRAND_CONFIG.publicBaseUrl}/?court=1`;

    const receipt = `🐆 Cougars & Cubs Daily #${dropNum} (${dailyStory.aslTag})\nMy Verdict: ${
      picked === 'crown' ? '👑 CROWN HIM' : '🚩 DUMP HIM'
    }\n🐆 Cougars Voted: ${herDumpPct}% Dump · 🐕 Cubs Thought: ${himCrownPct}% Crown 💀\nVote today’s case:`;

    await shareOrCopy({
      title: `Cougars & Cubs Daily #${dropNum}`,
      text: receipt,
      url,
    });
    setCopiedDaily(true);
    window.setTimeout(() => setCopiedDaily(false), 2600);
  };

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHead = headlineInput.trim();
    const cleanBody = storyInput.trim();
    if (cleanHead.length < 8 || cleanBody.length < 20) {
      setPitchStatus('Give your story a punchy headline (8+ chars) and at least one full sentence!');
      return;
    }

    const optimistic: CourtroomStory = {
      id: `user-${Date.now()}`,
      aslTag: aslInput.trim().slice(0, 36) || '42F × 26M • Club Member',
      headline: cleanHead.slice(0, 95),
      story: cleanBody.slice(0, 260),
      vibeBadge: '✨ Player Field Report',
      crownHer: 5,
      dumpHer: 5,
      crownHim: 5,
      dumpHim: 5,
      communitySubmitted: true,
    };

    sfx.victoryFanfare();
    setStories((prev) => [optimistic, ...prev]);
    setHeadlineInput('');
    setStoryInput('');
    setPitchStatus('Submitted to the Live Courtroom! Top-voted Friday stories get animated into playable scenes.');

    onGrantBonusCredits('courtroom_story_pitch', 0);
    setCreditToast('🎉 +15 Club XP earned for pitching a real scenario to the Greenlight Board!');

    if (isLiveHttpRuntime()) {
      try {
        await fetch('/api/courtroom/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            aslTag: optimistic.aslTag,
            headline: optimistic.headline,
            story: optimistic.story,
          }),
        });
      } catch {
        // Optimistically rendered
      }
    }
  };

  const renderSplitBars = (item: CourtroomStory) => {
    const herTotal = Math.max(1, item.crownHer + item.dumpHer);
    const herCrownPct = Math.round((item.crownHer / herTotal) * 100);
    const herDumpPct = 100 - herCrownPct;

    const himTotal = Math.max(1, item.crownHim + item.dumpHim);
    const himCrownPct = Math.round((item.crownHim / himTotal) * 100);
    const himDumpPct = 100 - himCrownPct;

    return (
      <div className="rounded-2xl border border-slate-200 bg-[#FFFDF9] p-3.5 space-y-2.5">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
          Live Blind-Spot Split: 🐆 How Cougars Voted vs. 🐕 How Cubs Thought
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-extrabold text-[#18101E]">
            <span>🐆 Cougars (35-65F) Voted:</span>
            <span>
              <strong className="text-[#059669]">{herCrownPct}% 👑 Crown</strong> •{' '}
              <strong className="text-[#E11D48]">{herDumpPct}% 🚩 Dump</strong>
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#FFE4E6] flex">
            <div style={{ width: `${herCrownPct}%` }} className="bg-[#059669] h-full" />
            <div style={{ width: `${herDumpPct}%` }} className="bg-[#E11D48] h-full" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-extrabold text-[#18101E]">
            <span>🐕 Cubs (21-34M) Guessed:</span>
            <span>
              <strong className="text-[#059669]">{himCrownPct}% 👑 Crown</strong> •{' '}
              <strong className="text-[#E11D48]">{himDumpPct}% 🚩 Dump</strong>
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#FFE4E6] flex">
            <div style={{ width: `${himCrownPct}%` }} className="bg-[#F59E0B] h-full" />
            <div style={{ width: `${himDumpPct}%` }} className="bg-[#E11D48] h-full" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-5 animate-stage-in">
      {creditToast && (
        <div className="vice-panel rounded-2xl bg-[#D1FAE5] px-5 py-3 text-xs sm:text-sm font-extrabold text-[#065F46]">
          {creditToast}
        </div>
      )}

      {/* Header */}
      <section className="vice-panel rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-white via-[#FFF7F9] to-[#FFFBEB] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToRoster}
            className="pop-btn inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-extrabold text-[#18101E] cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Roster</span>
          </button>

          <button
            type="button"
            onClick={onOpenCubAcademy}
            className="pop-btn inline-flex h-9 items-center gap-1.5 rounded-full bg-[#18101E] px-4 text-xs font-extrabold text-white cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FBBF24]" />
            <span>Open 2D Cub Obedience Sim →</span>
          </button>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl text-[#18101E]">
          👑 Crown Him or 🚩 Dump Him • Live Club Courtroom
        </h1>
        <p className="text-xs sm:text-sm font-medium text-[#475569] max-w-3xl">
          Play <strong>Today’s Synchronized 60-Second Drop</strong>, judge real age-gap field reports to expose the{' '}
          <strong>🐆 Cougar vs. 🐕 Cub blind-spot gap</strong>, and pitch your own date story to become next Friday’s animated episode!
        </p>
      </section>

      {/* TODAY'S SYNCHRONIZED DAILY RED FLAG DROP */}
      {dailyStory && (
        <section className="vice-panel rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#18101E] via-[#261730] to-[#18101E] text-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFBE0B] px-3 py-1 text-xs font-extrabold uppercase text-[#18101E]">
              <Flame className="h-3.5 w-3.5 fill-[#E11D48] text-[#E11D48]" />
              <span>Today’s Daily Drop #{dropNum} • +15 XP</span>
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-[#FDE68A]">
              {dailyStory.aslTag} • {dailyStory.vibeBadge}
            </span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl text-white">{dailyStory.headline}</h2>
          <p className="text-sm sm:text-base font-medium text-white/90 leading-relaxed">
            {dailyStory.story}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleVote(dailyStory.id, 'crown')}
              className={`pop-btn h-12 rounded-2xl font-extrabold text-sm inline-flex items-center justify-center gap-2 cursor-pointer ${
                votes[dailyStory.id] === 'crown'
                  ? 'bg-[#059669] text-white border-white'
                  : 'bg-[#FFFBEB] text-[#92400E] border-transparent'
              }`}
            >
              <Crown className="h-4 w-4" />
              <span>👑 Crown Him (Husband Material)</span>
            </button>

            <button
              type="button"
              onClick={() => handleVote(dailyStory.id, 'dump')}
              className={`pop-btn h-12 rounded-2xl font-extrabold text-sm inline-flex items-center justify-center gap-2 cursor-pointer ${
                votes[dailyStory.id] === 'dump'
                  ? 'bg-[#E11D48] text-white border-white'
                  : 'bg-[#FFF1F2] text-[#BE123C] border-transparent'
              }`}
            >
              <Flag className="h-4 w-4" />
              <span>🚩 Dump Him (Straight to Jail)</span>
            </button>
          </div>

          {votes[dailyStory.id] && (
            <div className="space-y-3 pt-1">
              {renderSplitBars(dailyStory)}
              <button
                type="button"
                onClick={handleShareDailyReceipt}
                className="pop-btn inline-flex h-10 items-center gap-2 rounded-xl bg-[#FFBE0B] px-4 text-xs font-extrabold text-[#18101E] cursor-pointer"
              >
                {copiedDaily ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                <span>
                  {copiedDaily
                    ? 'Daily Verdict Copied for Group Chat!'
                    : `Share Daily #${dropNum} Blind-Spot Receipt`}
                </span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* COURTROOM CASE DOCKET + STORY PITCH */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
        <div className="space-y-4">
          {stories
            .filter((s) => s.id !== dailyStory?.id)
            .map((item) => {
              const voted = votes[item.id];
              return (
                <article
                  key={item.id}
                  className="vice-panel rounded-3xl p-5 bg-white space-y-3.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[#18101E]">
                      {item.aslTag}
                    </span>
                    <span className="rounded-full bg-[#FFF1F2] px-3 py-1 text-[#E11D48]">
                      {item.vibeBadge}
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl text-[#18101E]">
                    {item.headline}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#334155] leading-relaxed">
                    {item.story}
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleVote(item.id, 'crown')}
                      className={`pop-btn h-10 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                        voted === 'crown'
                          ? 'bg-[#059669] text-white border-transparent'
                          : 'bg-[#ECFDF5] text-[#065F46]'
                      }`}
                    >
                      <Crown className="h-3.5 w-3.5" />
                      <span>👑 Crown Him</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleVote(item.id, 'dump')}
                      className={`pop-btn h-10 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                        voted === 'dump'
                          ? 'bg-[#E11D48] text-white border-transparent'
                          : 'bg-[#FFF1F2] text-[#BE123C]'
                      }`}
                    >
                      <Flag className="h-3.5 w-3.5" />
                      <span>🚩 Dump Him</span>
                    </button>
                  </div>

                  {voted && renderSplitBars(item)}
                </article>
              );
            })}
        </div>

        {/* PITCH YOUR REAL DATE TO BE GREENLIT INTO THE GAME */}
        <aside className="vice-panel rounded-3xl p-5 bg-[#FFFDF9] space-y-3.5 lg:sticky lg:top-20">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] px-3 py-1 text-[11px] font-extrabold uppercase text-[#92400E]">
            <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
            <span>Greenlight Board • +15 XP &amp; Dateodex</span>
          </div>

          <h3 className="font-display text-xl text-[#18101E]">
            Put My Date in the Game!
          </h3>
          <p className="text-xs font-medium text-[#475569] leading-relaxed">
            Submit an anonymous real-life green flag or unhinged red flag (zero names or contact info). Every Friday, the #1 community-voted report becomes a playable illustrated scene!
          </p>

          <form onSubmit={handleSubmitStory} className="space-y-3">
            <div>
              <label htmlFor="court-asl" className="block text-[11px] font-extrabold text-[#475569] mb-1">
                Ages &amp; City Tag
              </label>
              <input
                id="court-asl"
                type="text"
                maxLength={36}
                value={aslInput}
                onChange={(e) => setAslInput(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-[#18101E]"
              />
            </div>

            <div>
              <label htmlFor="court-headline" className="block text-[11px] font-extrabold text-[#475569] mb-1">
                Headline
              </label>
              <input
                id="court-headline"
                type="text"
                maxLength={95}
                placeholder="e.g. Brought homemade sourdough & fixed my patio latch…"
                value={headlineInput}
                onChange={(e) => setHeadlineInput(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-[#18101E]"
              />
            </div>

            <div>
              <label htmlFor="court-story" className="block text-[11px] font-extrabold text-[#475569] mb-1">
                What Happened? (240 chars max)
              </label>
              <textarea
                id="court-story"
                rows={4}
                maxLength={240}
                placeholder="Tell the Club Courtroom what happened so Cougars & Cubs can vote Crown or Dump!"
                value={storyInput}
                onChange={(e) => setStoryInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-[#18101E]"
              />
            </div>

            <button
              type="submit"
              className="pop-btn w-full h-11 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#FF6036] text-xs sm:text-sm font-extrabold text-white border-transparent inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Case to Courtroom (+15 XP)</span>
            </button>
          </form>

          {pitchStatus && (
            <div className="rounded-xl bg-[#ECFDF5] border border-[#059669]/30 p-3 text-xs font-bold text-[#065F46]">
              {pitchStatus}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
