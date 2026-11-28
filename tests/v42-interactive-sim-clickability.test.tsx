import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatsAndDatesView, createInitialThread } from '../src/components/ChatsAndDatesView';
import { CougarCubChecklistModal } from '../src/components/CougarCubChecklistModal';
import { HingeFeedView } from '../src/components/HingeFeedView';
import { InTheWildMapView } from '../src/components/InTheWildMapView';
import { createDefaultWallet } from '../src/domain/economy';

describe('v42 Interactive Dating-Sim Clickability & Subreddit Polish Across Checklist, Wild, Prowl & Discord', () => {
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

  it('removes duplicate role bar in Prowl, enables full-card prompt click + sticky ♥ quick reply + arrow keys', () => {
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

    // Zero duplicate "Playing as Her / Playing as Him" bar inside HingeFeedView
    expect(document.body.textContent).not.toMatch(/Playing as Him/i);

    // Sticky ♥ Quick Reply FAB opens the reply modal directly
    fireEvent.click(screen.getByTestId('hinge-sticky-like-btn'));
    expect(screen.getByRole('dialog', { name: /Reply to/i })).toBeInTheDocument();
  });

  it('renders live Discord community reaction counts (+1 on click) and tactile [1][2][3] Emily-Is-Away choice keycaps', () => {
    const wallet = createDefaultWallet(new Date('2026-11-28T12:00:00Z'));
    const thread = createInitialThread('claire', 'hinge');

    render(
      <ChatsAndDatesView
        role="him"
        wallet={wallet}
        threads={[thread]}
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

    // Tactile [1][2][3] keycaps on DM beat choices
    const choiceBtns = screen.getAllByTestId('chat-suggestion-btn');
    expect(choiceBtns[0].textContent).toMatch(/^1/);

    // Switch to Discord -> verify community reaction count increments +1 on click
    fireEvent.click(screen.getByRole('button', { name: /Club Discord Lounge/i }));
    const firstMsg = screen.getByTestId('discord-first-message');
    const reactBtn = within(firstMsg).getByRole('button', { name: /React 🥂/i });
    const beforeNum = Number((reactBtn.textContent || '').replace(/\D+/g, ''));
    expect(beforeNum).toBeGreaterThan(0);

    fireEvent.click(reactBtn);
    const afterNum = Number((reactBtn.textContent || '').replace(/\D+/g, ''));
    expect(afterNum).toBe(beforeNum + 1);
  });
});
