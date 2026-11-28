import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatsAndDatesView, createInitialThread } from '../src/components/ChatsAndDatesView';
import { CougarCubChecklistModal } from '../src/components/CougarCubChecklistModal';
import { HingeFeedView } from '../src/components/HingeFeedView';
import { InTheWildMapView } from '../src/components/InTheWildMapView';
import { createDefaultWallet } from '../src/domain/economy';
import { evaluateDmLocally } from '../src/services/adapters';
import workerApp from '../worker/index';

describe('v42 Interactive Dating-Sim Clickability, Post-Beat Graduation Card & Tactical Text Reactions', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('pops live subreddit insider quips and Radix progress bar when clicking Checklist items', () => {
    render(
      <CougarCubChecklistModal
        open={true}
        onClose={vi.fn()}
        onClaimChecklistReward={() => false}
        onPlayMatchedScenario={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', {
      name: /Have You Ever\? 3-Tier Cougars & Cubs Experience Test/i,
    });
    fireEvent.click(within(dialog).getByRole('button', { name: /late 1900s/i }));

    const quip = within(dialog).getByTestId('checklist-live-quip');
    expect(quip.textContent).toMatch(/late 1900s/i);
    expect(within(dialog).getByRole('progressbar')).toBeInTheDocument();
  });

  it('strips internal "1-in-3 Signal Precision" dev subtitles from In The Wild and supports 1-tap Scan All 3', () => {
    render(
      <InTheWildMapView
        role="him"
        activeLeadThreads={[]}
        completedCameoVenues={[]}
        initialVenueId="velvet-room"
        onUnlockWildLead={vi.fn()}
        onCompleteCameo={vi.fn()}
      />,
    );

    expect(document.body.textContent).not.toMatch(/1-in-3 Signal Precision/i);
    expect(document.body.textContent).not.toMatch(/High-Stakes Signal Detection/i);

    fireEvent.click(screen.getByTestId('wild-quick-scan-all-btn'));
    expect(screen.getByTestId('wild-approachability-verdict')).toBeInTheDocument();
  });

  it('removes duplicate role bar in Prowl, enables full-card prompt click + sticky ♥ quick reply', () => {
    const wallet = {
      ...createDefaultWallet(new Date('2026-11-28T12:00:00Z')),
      discernmentXp: 40,
    };
    render(
      <HingeFeedView
        role="him"
        wallet={wallet}
        matchedLeadIds={['claire']}
        cutLooseIds={[]}
        onSendHingeOpener={() => true}
        onSwitchRole={vi.fn()}
        onOpenWildMap={vi.fn()}
      />,
    );

    expect(document.body.textContent).not.toMatch(/Playing as Him/i);

    fireEvent.click(screen.getByTestId('hinge-sticky-like-btn'));
    expect(screen.getByRole('dialog', { name: /Reply to/i })).toBeInTheDocument();
  });

  it('shows inline Number-Drop Graduation Card RIGHT after the last message bubble (for 75%+ Spark & Beat 6) and rewards tactical text reactions', () => {
    const wallet = createDefaultWallet(new Date('2026-11-28T12:00:00Z'));
    const highSparkThread = {
      ...createInitialThread('claire', 'hinge'),
      chemistry: 76,
      currentBeat: 3,
    };

    let latestUpdated = highSparkThread;
    const { unmount } = render(
      <ChatsAndDatesView
        role="him"
        wallet={wallet}
        threads={[highSparkThread]}
        cutLooseIds={[]}
        onUpdateThread={(u) => {
          latestUpdated = u;
        }}
        onSpendCredits={() => true}
        onUnlockBucketItem={() => true}
        onCutLooseTrap={vi.fn()}
        onConfirmCutGenuine={vi.fn()}
        onLoseHeart={vi.fn()}
        onOpenHinge={vi.fn()}
        onOpenBoutique={vi.fn()}
      />,
    );

    // 1. Inline iMessage Contact Card appears directly inside dm-message-feed right after the last bubble!
    const feed = screen.getByTestId('dm-message-feed');
    const inlineGradCard = within(feed).getByTestId('inline-imessage-graduation-card');
    expect(inlineGradCard.textContent).toMatch(/Save Her Number \(Move to iMessage\)/i);

    // 2. Reacting ❤️ to Claire's incoming text grants +2% Spark & renders inline reaction receipt!
    const heartBtns = within(feed).getAllByRole('button', { name: 'Tapback ❤️' });
    fireEvent.click(heartBtns[0]);
    expect(latestUpdated.chemistry).toBe(78);
    expect(within(feed).getByTestId('tapback-outcome-pill').textContent).toMatch(/\+2% Spark/i);

    unmount();

    // 3. Reacting 🚩 on a Disguised Trap (Vanessa) clocks shady subtext (+5 XP) & updates Gut-Check Radar!
    const trapThread = createInitialThread('vanessa', 'hinge');
    render(
      <ChatsAndDatesView
        role="him"
        wallet={wallet}
        threads={[trapThread]}
        cutLooseIds={[]}
        onUpdateThread={vi.fn()}
        onSpendCredits={() => true}
        onUnlockBucketItem={() => true}
        onCutLooseTrap={vi.fn()}
        onConfirmCutGenuine={vi.fn()}
        onLoseHeart={vi.fn()}
        onOpenHinge={vi.fn()}
        onOpenBoutique={vi.fn()}
      />,
    );
    const trapFeed = screen.getByTestId('dm-message-feed');
    const flagBtns = within(trapFeed).getAllByRole('button', { name: 'Tapback 🚩' });
    fireEvent.click(flagBtns[0]);
    expect(within(trapFeed).getByTestId('tapback-outcome-pill').textContent).toMatch(
      /Shady subtext clocked/i,
    );
  });

  it('normalizes multi-turn chat history into alternating user/assistant messages for Workers AI and answers contextual free-text questions directly', async () => {
    let capturedRoles: string[] = [];
    const mockEnv = {
      AI: {
        run: async (_model: string, payload: { messages: { role: string; content: string }[] }) => {
          capturedRoles = payload.messages.map((m) => m.role);
          const sys = payload.messages[0]?.content || '';
          // Ensure prompt template contains valid JSON literals (never invalid ":number(" or ":boolean")
          expect(sys).not.toContain(':number(');
          expect(sys).not.toContain(':boolean');
          return {
            response: {
              herReply:
                'Definitely big scruffy dogs on Hampstead Heath, and I made sourdough eggs this morning x Which camp are you in?',
              suggestedReplies: [
                'Loyal dog camp too, sourdough eggs sound dangerously competent.',
                'Wait, do you actually bake the sourdough or buy it?',
                '💎 Save me a slice on Sunday morning and prove it.',
              ],
              maturityDelta: 16,
              chivalryDelta: 15,
              chemistryDelta: 18,
              coachNote: 'Warm personal banter landed cleanly.',
              passedVibeCheck: true,
            },
          };
        },
      },
    };

    const res = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/inbox-vet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId: 'julian',
          personaName: 'Julian',
          personaAge: 27,
          personaTitle: 'Architectural Restorer',
          personaRole: 'him',
          playerRole: 'her',
          platform: 'tinder',
          playerMessage: 'Do you like dogs or cats more, and what did you have for breakfast?',
          history: [
            { sender: 'match', text: 'Caught me sketching cornices.' },
            { sender: 'match', text: 'Tell me you rescue my afternoon.' },
            {
              sender: 'player',
              text: 'Do you like dogs or cats more, and what did you have for breakfast?',
            },
          ],
        }),
      }),
      mockEnv as never,
    );

    expect(res.status).toBe(200);
    const json = (await res.json()) as { herReply: string; source: string };
    expect(json.source).toBe('workers-ai');
    expect(json.herReply).toMatch(/dogs/i);

    // Verify strictly alternating roles: system -> user -> assistant -> user (zero duplicate user/user or assistant/assistant!)
    expect(capturedRoles).toEqual(['system', 'user', 'assistant', 'user']);

    // Also verify offline contextual fallback answers everyday questions directly
    const localReply = evaluateDmLocally({
      personaId: 'julian',
      personaName: 'Julian',
      personaAge: 27,
      personaRole: 'him',
      playerRole: 'her',
      playerMessage: 'Do you prefer dogs or cats?',
    });
    expect(localReply.herReply).toMatch(/dog|cat/i);
  });
});
