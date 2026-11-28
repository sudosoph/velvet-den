import React, { useEffect, useState } from 'react';
import { Flame, MessageCircle, Smartphone, X } from 'lucide-react';
import { V35_CAST_VISUALS } from '../data/v35AssetManifest';
import { getCastProfileById } from '../data/v35Cast';
import { sfx } from '../lib/sound';
import type { ActiveMatchThread } from './ChatsAndDatesView';
import type { ClubTopTab } from './TopHudBar';

const SPONTANEOUS_LEAD_PINGS: Record<string, string[]> = {
  julian: [
    'Just walked past a bookshop window with a first-edition photo monograph and thought of you immediately.',
    'Quick British sanity check: is arriving seven minutes early with a bottle of Barolo keen or proper manners?',
  ],
  soren: [
    'Quick architectural poll before Friday: corner booth by the fireplace or terrace overlooking the water?',
    'Reserved Court 3 for Saturday morning just in case Thursday cocktails run dangerously well.',
  ],
  miles: [
    'Pulled a test espresso roast this afternoon and set aside a bag with your name on it.',
    'Already confirmed valet at the restaurant for Friday at 7:45 so you just walk straight in.',
  ],
  rafael: [
    'Band rehearsal wrapped early tonight. Save one slow track on your mental playlist for me.',
    'Hand-rubbing walnut oil onto a new tabletop in the shop and still thinking about your laugh.',
  ],
  marcus: [
    'Quiet shift at the station so far, still smiling about our conversation earlier.',
    'Off shift at 7 AM tomorrow with eight hours of sleep and oak-smoked brisket planned for Friday.',
  ],
  liam: [
    'Finished sanding the cedar bench before sunset and realized I never asked your go-to wine.',
  ],
  rory: [
    'Hampstead park dogs are on top form today, though Sunset Hills still wins for company.',
    'Still slightly mortified about mistaking you in Aisle 4, let me buy that apology Rioja soon.',
  ],
  jin: [
    'Found an off-menu omakase counter with eight seats total. Tell me you like uni.',
  ],
  graham: [
    'Quick heads up, silence text notifications after 6:30 PM tonight, Tokyo portfolio call running super late.',
    'Hey delete my last text if a preview popped up, Siri dictated someone else’s grocery list lol.',
  ],
  connor: [
    'Yo my promoter buddy just comped a VIP bottle table Thursday if you bring two hot friends.',
    'Wait quick question do u know if The Marlow scans vertical out-of-state IDs super hard??',
  ],
  devon: [
    'Pre-workout kicked in at the market and I somehow bought four rotisserie chickens, send help.',
    'My studio lease is super corporate rn, mind if I crash at your peaceful place Fri thru Tue?',
  ],
  claire: [
    'Stepped out of depositions for five minutes of espresso and caught myself re-reading your last message.',
    'Sounds good. 👍 (And before you overthink it, that is my sincere happy face.)',
  ],
  sienna: [
    'Golden hour on the coastal bluff is ridiculous right now. Saving a chilled glass of Sancerre for Friday.',
    'Put Al Green on the turntable and officially closed my laptop for the weekend.',
  ],
  summer: [
    'Wrapped morning studio edits early and still thinking about our banter.',
  ],
  priya: [
    'Off shift with eight hours of real sleep ahead, officially dangerous company for dinner.',
  ],
  elena: [
    'Crossed three dreadful faculty meetings off my calendar just to keep Friday evening unhurried.',
  ],
  brooke: [
    'Fair warning, once you survive my group’s patio wine night you are permanently drafted.',
    'Wear navy Friday and meet me right beside Table 9 at 7:58 PM sharp, trust the vision!',
  ],
  vivienne: [
    'Gallery installation wrapped twenty minutes early. Impress me with your favorite neighborhood bistro. -V',
    'Cannes screener finished. Bring dry wit and zero small talk at half seven. -V',
  ],
  celeste: [
    'Airport lounge espresso is tragic today, counting on you for a proper Gibson when I land.',
  ],
  astrid: [
    'Sauna and cold plunge complete. Shared my open Friday window on my calendar if you can keep pace.',
  ],
  camila: [
    'Heard a live salsa horn section warming up downtown and immediately thought of you.',
  ],
  vanessa: [
    'Quick note, please don’t text after 6:15 PM tonight, contractors have our home Wi-Fi upside down!',
  ],
};

export function getSpontaneousPingForLead(leadId: string, variantIndex = 0): string {
  const list = SPONTANEOUS_LEAD_PINGS[leadId];
  if (!list || list.length === 0) {
    return 'Caught myself smiling at my phone mid-afternoon. Still on for this week?';
  }
  return list[Math.abs(variantIndex) % list.length].trim();
}

export interface LiveIncomingTextBannerProps {
  activeThreads: ActiveMatchThread[];
  activeTab: ClubTopTab;
  anyModalOpen: boolean;
  forcePreviewLeadId?: string;
  simulateNonce?: number;
  role?: 'her' | 'him';
  onOpenBannerLead: (leadId: string, pingText: string) => void;
  onDecodePingInRoastLab?: (pingText: string) => void;
}

export const LiveIncomingTextBanner: React.FC<LiveIncomingTextBannerProps> = ({
  activeThreads,
  activeTab,
  anyModalOpen,
  forcePreviewLeadId,
  simulateNonce = 0,
  role = 'her',
  onOpenBannerLead,
  onDecodePingInRoastLab,
}) => {
  const [bannerState, setBannerState] = useState<{
    leadId: string;
    pingText: string;
  } | null>(() => {
    if (forcePreviewLeadId) {
      return {
        leadId: forcePreviewLeadId,
        pingText: getSpontaneousPingForLead(forcePreviewLeadId, 0),
      };
    }
    return null;
  });
  const [pingedLeadIds, setPingedLeadIds] = useState<string[]>([]);

  useEffect(() => {
    if (forcePreviewLeadId) {
      setBannerState({
        leadId: forcePreviewLeadId,
        pingText: getSpontaneousPingForLead(forcePreviewLeadId, 0),
      });
    }
  }, [forcePreviewLeadId]);

  useEffect(() => {
    if (!simulateNonce) return;
    const fallbackPool =
      role === 'her'
        ? ['graham', 'julian', 'miles', 'connor']
        : ['claire', 'vanessa', 'sienna', 'vivienne'];
    const leadId =
      activeThreads[simulateNonce % Math.max(1, activeThreads.length)]?.leadId ??
      fallbackPool[simulateNonce % fallbackPool.length];
    sfx.messagePop();
    setBannerState({
      leadId,
      pingText: getSpontaneousPingForLead(leadId, simulateNonce),
    });
  }, [simulateNonce, activeThreads, role]);

  useEffect(() => {
    if (import.meta.env.VITEST || forcePreviewLeadId) return;
    if (activeTab === 'chats' || anyModalOpen || bannerState) return;

    const candidate = activeThreads.find((t) => !pingedLeadIds.includes(t.leadId));
    if (!candidate) return;

    const pingText = getSpontaneousPingForLead(candidate.leadId, pingedLeadIds.length);
    const alreadyInMessages = candidate.messages.some((m) => m.text === pingText);
    if (alreadyInMessages) {
      setPingedLeadIds((prev) => [...prev, candidate.leadId]);
      return;
    }

    const timer = window.setTimeout(() => {
      sfx.messagePop();
      setPingedLeadIds((prev) => [...prev, candidate.leadId]);
      setBannerState({
        leadId: candidate.leadId,
        pingText,
      });
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [activeThreads, activeTab, anyModalOpen, bannerState, pingedLeadIds, forcePreviewLeadId]);

  useEffect(() => {
    if (!forcePreviewLeadId && activeTab === 'chats' && bannerState && !simulateNonce) {
      setBannerState(null);
    }
  }, [activeTab, bannerState, forcePreviewLeadId, simulateNonce]);

  if (!bannerState) return null;

  const profile = getCastProfileById(bannerState.leadId);
  const visual = V35_CAST_VISUALS[bannerState.leadId];
  const thread = activeThreads.find((t) => t.leadId === bannerState.leadId);
  if (!profile || !visual) return null;

  const isImessage = thread?.stage === 'imessage';

  return (
    <div
      data-testid="live-incoming-text-banner"
      role="status"
      aria-live="polite"
      className="fixed top-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-[55] animate-stage-in"
    >
      <div className="rounded-2xl border border-zinc-200/95 bg-white/95 p-3.5 shadow-2xl ring-1 ring-zinc-950/10 space-y-2.5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => {
              const target = bannerState;
              setBannerState(null);
              onOpenBannerLead(target.leadId, target.pingText);
            }}
            className="flex min-w-0 flex-1 items-start gap-3 text-left cursor-pointer"
          >
            <div className="relative shrink-0">
              <img
                src={visual.primaryPortrait}
                alt={profile.name}
                className="h-11 w-11 rounded-full object-cover border border-zinc-200"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white shadow-2xs ${
                  isImessage ? 'bg-[#007AFF]' : 'bg-rose-600'
                }`}
              >
                {isImessage ? (
                  <Smartphone className="h-2.5 w-2.5" />
                ) : (
                  <MessageCircle className="h-2.5 w-2.5" />
                )}
              </span>
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-950">
                  {profile.name}, {profile.age}
                </span>
                <span className="text-[11px] font-medium text-zinc-500">
                  {isImessage ? 'iMessage · now' : 'Prowl DM · now'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-800 line-clamp-2 leading-snug">
                {bannerState.pingText}
              </p>
            </div>
          </button>

          <button
            type="button"
            aria-label="Dismiss incoming message banner"
            onClick={() => setBannerState(null)}
            className="shrink-0 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Authentic iOS Quick-Action Pills */}
        <div className="flex items-center justify-end gap-2 border-t border-zinc-100 pt-2">
          {onDecodePingInRoastLab && (
            <button
              type="button"
              data-testid="banner-decode-subtext-btn"
              onClick={() => {
                const text = bannerState.pingText;
                setBannerState(null);
                onDecodePingInRoastLab(text);
              }}
              className="inline-flex h-7 items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-900 hover:text-white px-2.5 text-[11px] font-semibold text-zinc-800 transition cursor-pointer"
            >
              <Flame className="h-3 w-3 text-rose-600" />
              <span>Decode Subtext</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              const target = bannerState;
              setBannerState(null);
              onOpenBannerLead(target.leadId, target.pingText);
            }}
            className="inline-flex h-7 items-center gap-1 rounded-lg bg-[#007AFF] hover:bg-blue-600 px-3 text-[11px] font-semibold text-white transition cursor-pointer"
          >
            <span>Reply in Thread →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
