import React, { useEffect, useState } from 'react';
import { MessageCircle, Smartphone, X } from 'lucide-react';
import { V35_CAST_VISUALS } from '../data/v35AssetManifest';
import { getCastProfileById } from '../data/v35Cast';
import { sfx } from '../lib/sound';
import type { ActiveMatchThread } from './ChatsAndDatesView';
import type { ClubTopTab } from './TopHudBar';

const SPONTANEOUS_LEAD_PINGS: Record<string, string> = {
  julian:
    'Just walked past a bookshop window with a first-edition photo monograph and thought of you immediately.',
  soren:
    'Quick architectural poll before Friday: corner booth by the fireplace or terrace overlooking the water?',
  miles:
    'Pulled a test espresso roast this afternoon and set aside a bag with your name on it.',
  rafael:
    'Band rehearsal wrapped early tonight. Save one slow track on your mental playlist for me.',
  marcus:
    'Quiet shift at the station so far, still smiling about our conversation earlier.',
  liam:
    'Finished sanding the cedar bench before sunset and realized I never asked your go-to wine.',
  rory:
    'Hampstead park dogs are on top form today, though Sunset Hills still wins for company.',
  jin:
    'Found an off-menu omakase counter with eight seats total. Tell me you like uni.',
  graham:
    'Quick heads up, silence text notifications after 6:30 PM tonight, Tokyo portfolio call running super late.',
  connor:
    'Yo my promoter buddy just comped a VIP bottle table Thursday if you bring two hot friends.',
  devon:
    'Pre-workout kicked in at the market and I somehow bought four rotisserie chickens, send help.',
  claire:
    'Stepped out of depositions for five minutes of espresso and caught myself re-reading your last message.',
  sienna:
    'Golden hour on the coastal bluff is ridiculous right now. Saving a chilled glass of Sancerre for Friday.',
  summer:
    'Wrapped morning studio edits early and still thinking about our banter.',
  priya:
    'Off shift with eight hours of real sleep ahead, officially dangerous company for dinner.',
  elena:
    'Crossed three dreadful faculty meetings off my calendar just to keep Friday evening unhurried.',
  brooke:
    'Fair warning, once you survive my group’s patio wine night you are permanently drafted.',
  vivienne:
    'Gallery installation wrapped twenty minutes early. Impress me with your favorite neighborhood bistro.',
  celeste:
    'Airport lounge espresso is tragic today, counting on you for a proper drink when I land.',
  astrid:
    ' Sauna and cold plunge complete. Hope your week is keeping pace.',
  camila:
    'Heard a live salsa horn section warming up downtown and immediately thought of you.',
  vanessa:
    'Quick note, please don’t text after 6:15 PM tonight, contractors have our home Wi-Fi upside down!',
};

export function getSpontaneousPingForLead(leadId: string): string {
  return (
    SPONTANEOUS_LEAD_PINGS[leadId]?.trim() ||
    'Caught myself smiling at my phone mid-afternoon. Still on for this week?'
  );
}

export interface LiveIncomingTextBannerProps {
  activeThreads: ActiveMatchThread[];
  activeTab: ClubTopTab;
  anyModalOpen: boolean;
  forcePreviewLeadId?: string;
  onOpenBannerLead: (leadId: string, pingText: string) => void;
}

export const LiveIncomingTextBanner: React.FC<LiveIncomingTextBannerProps> = ({
  activeThreads,
  activeTab,
  anyModalOpen,
  forcePreviewLeadId,
  onOpenBannerLead,
}) => {
  const [bannerState, setBannerState] = useState<{
    leadId: string;
    pingText: string;
  } | null>(() => {
    if (forcePreviewLeadId) {
      return {
        leadId: forcePreviewLeadId,
        pingText: getSpontaneousPingForLead(forcePreviewLeadId),
      };
    }
    return null;
  });
  const [pingedLeadIds, setPingedLeadIds] = useState<string[]>([]);

  useEffect(() => {
    if (forcePreviewLeadId) {
      setBannerState({
        leadId: forcePreviewLeadId,
        pingText: getSpontaneousPingForLead(forcePreviewLeadId),
      });
    }
  }, [forcePreviewLeadId]);

  useEffect(() => {
    if (import.meta.env.VITEST || forcePreviewLeadId) return;
    if (activeTab === 'chats' || anyModalOpen || bannerState) return;

    const candidate = activeThreads.find((t) => !pingedLeadIds.includes(t.leadId));
    if (!candidate) return;

    const pingText = getSpontaneousPingForLead(candidate.leadId);
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
    }, 8500);

    return () => window.clearTimeout(timer);
  }, [activeThreads, activeTab, anyModalOpen, bannerState, pingedLeadIds, forcePreviewLeadId]);

  // Hide banner automatically if user navigates directly into Chats
  useEffect(() => {
    if (!forcePreviewLeadId && activeTab === 'chats' && bannerState) {
      setBannerState(null);
    }
  }, [activeTab, bannerState, forcePreviewLeadId]);

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
      <div className="flex items-start gap-3 rounded-2xl border border-zinc-200/90 bg-white/95 backdrop-blur-md p-3.5 shadow-xl ring-1 ring-zinc-950/5">
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
              <span className="text-[11px] font-medium text-zinc-400">
                {isImessage ? 'iMessage · now' : 'Prowl DM · now'}
              </span>
            </div>
            <p className="text-xs text-zinc-700 line-clamp-2 leading-snug">
              {bannerState.pingText}
            </p>
            <span className="inline-block pt-0.5 text-[11px] font-semibold text-rose-600">
              Tap to reply in thread →
            </span>
          </div>
        </button>

        <button
          type="button"
          aria-label="Dismiss incoming message banner"
          onClick={() => setBannerState(null)}
          className="shrink-0 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
