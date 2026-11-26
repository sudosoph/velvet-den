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
    id: 'court-sheryl-crow-cold-plunge-laundry',
    aslTag: '43F × 25M • Santa Barbara',
    headline: 'Said Sheryl Crow Was His "Favorite Song When I Was 4," Then Folded My Laundry & Loaded the Dishwasher',
    story:
      'Sheryl Crow’s "Soak Up the Sun" came on in my car and he beamed, "Oh yeah, my favorite song when I was 4!" Nearly drove off PCH. Then Sunday he did a 6 AM cold plunge, briefed me on James Webb space news to impress me, folded all my laundry, and set up my dishwasher.',
    vibeBadge: '☀️ Overachieving Cub',
    crownHer: 94,
    dumpHer: 6,
    crownHim: 89,
    dumpHim: 11,
  },
  {
    id: 'daily-cast-iron-steak-venmo',
    aslTag: '44F × 25M • Austin',
    headline: 'Cooked Me Grass-Fed Ribeye… Then Sent a $19.50 Venmo at 8:15 AM',
    story:
      'He wore a linen apron, seared rosemary steak in ghee, and washed every dish before midnight. Next morning on my drive to work my phone buzzed: "$19.50 • your half of the butcher ribeye 🥩😊." Crown him or dump him?!',
    vibeBadge: '💸 Dutch Math Emergency',
    crownHer: 8,
    dumpHer: 92,
    crownHim: 46,
    dumpHim: 54,
  },
  {
    id: 'court-four-pillows-silk-clip',
    aslTag: '47F × 27M • Chicago',
    headline: 'Bought a 22-Momme Silk Pillowcase & Claw Clip After ONE Sleepover',
    story:
      'After our first sleepover I joked about cotton frizzing my blowout. Friday week two I walk into his apartment: 4 crisp percale pillows, a brand-new mulberry silk pillowcase on "my" side, lidded bathroom trash can, and my favorite zero-proof spritz chilled.',
    vibeBadge: '🐕 Hall-of-Fame Golden Retriever',
    crownHer: 97,
    dumpHer: 3,
    crownHim: 88,
    dumpHim: 12,
  },
  {
    id: 'court-pine-pollen-midnight-spiral',
    aslTag: '42F × 24M • Scottsdale',
    headline: 'Blamed His 11:47 PM 9-Text Meltdown on "Pine Pollen Testosterone"',
    story:
      'Told him upfront I read in bed with tea at 9:30 PM on weeknights. Woke up at 6 AM to 9 unhinged texts ending with "sorry babe the wild pine-pollen tincture has my T surging & got me all up in my feels 🥺🌲."',
    vibeBadge: '🌲 Biohacker Spiral',
    crownHer: 9,
    dumpHer: 91,
    crownHim: 39,
    dumpHim: 61,
  },
  {
    id: 'court-waiter-son-tip-move',
    aslTag: '51F × 28M • Manhattan',
    headline: 'Waiter Asked If I Wanted Separate Checks "For My Son", Watch His Move',
    story:
      'Buzzy West Village bistro. Waiter sets the check down and asks if I am treating my son for graduation. Without blinking, my date slid his card in, grinned, kissed my hand, and said "Definitely one check, my girlfriend’s just genetically unfair."',
    vibeBadge: '👑 Unshakeable Frame',
    crownHer: 98,
    dumpHer: 2,
    crownHim: 91,
    dumpHim: 9,
  },
  {
    id: 'court-maui-moms-timeshare',
    aslTag: '39F × 23M • San Diego',
    headline: 'Bragged About "His Place in Maui", His Parents Were in the Kitchen!',
    story:
      'Invited me for a romantic 4-day getaway to "my condo in Wailea." We open the front door with suitcases and his mom is standing at the blender in a visor asking if we want Costco turkey wraps.',
    vibeBadge: '🌺 Timeshare Mirage',
    crownHer: 14,
    dumpHer: 86,
    crownHim: 52,
    dumpHim: 48,
  },
  {
    id: 'court-perimenopause-bamboo-sheets',
    aslTag: '49F × 30M • Seattle',
    headline: '3 AM Hot Flash, He Wordlessly Flipped the Cooling Pillow & Grabbed Ice Water',
    story:
      'Woke up mortified kicking the duvet off at 3 AM. Zero weirdness, he sleepily kissed my shoulder, cracked the window two inches, handed me ice water, and ordered cooling bamboo sheets to his place the next afternoon.',
    vibeBadge: '💚 Grown-Man EQ',
    crownHer: 99,
    dumpHer: 1,
    crownHim: 93,
    dumpHim: 7,
  },
  {
    id: 'court-whats-ur-snap-1900s',
    aslTag: '45F × 24M • Miami',
    headline: 'Great Chemistry All Dinner… Then He Texted "u look crazy good for ur age 🔥 whats ur snap??"',
    story:
      'Opened every door, laughed at my dry jokes, and walked me to my Uber. Two minutes into the ride my phone pings: "yo tonight was fire ngl 💀 u look crazy good for someone born in the late 1900s!! whats ur snap so we streak??"',
    vibeBadge: '👻 Triple-Combo Ick',
    crownHer: 4,
    dumpHer: 96,
    crownHim: 49,
    dumpHim: 51,
  },
  {
    id: 'court-titos-mattress-cubsplain',
    aslTag: '43F × 25M • Denver',
    headline: 'Tried to "Cubsplain" Mortgages From a Bare Floor Mattress Next to an Empty Tito’s Handle',
    story:
      'I own two properties. We stop by his apartment to grab his jacket: 5-in-1 neon-blue body wash on the sink, unlidded trash can, bare mattress on the floor, and he spends 14 minutes lecturing me on fixed-rate amortization from a podcast.',
    vibeBadge: '🤓 Podcast Cubsplainer',
    crownHer: 3,
    dumpHer: 97,
    crownHim: 34,
    dumpHim: 66,
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
      if (onGrantBonusCredits(`daily_drop_${dropNum}`, 2)) {
        setCreditToast('🎉 +2 Bonus Credits for voting in Today’s Daily Red Flag Drop!');
      }
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

    if (onGrantBonusCredits('courtroom_story_pitch', 2)) {
      setCreditToast('🎉 +2 Bonus Credits added for pitching a real scenario!');
    }

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
            <span>🐆 Cougars (35, 65F) Voted:</span>
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
            <span>🐕 Cubs (21, 34M) Guessed:</span>
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
              <span>Today’s Daily Drop #{dropNum} • +2 Cr</span>
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
            <span>Greenlight Board • +2 Free Credits</span>
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
              <span>Submit Case to Courtroom (+2 Cr)</span>
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
