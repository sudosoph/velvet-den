import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HingeFeedView } from '../src/components/HingeFeedView';
import { InTheWildMapView } from '../src/components/InTheWildMapView';
import { createDefaultWallet } from '../src/domain/economy';

describe('v35 Editorial Hinge Feed (selective matching, zero clutter) & 10-Spot In The Wild Map', () => {
  it('renders clean first-person Hinge cards with zero desired-age filter, zero Photo 1 of 6 labels, and selective matching vs Pending Like', () => {
    const onSendHingeOpener = vi.fn();
    const wallet = createDefaultWallet(new Date('2026-11-26T12:00:00Z'));

    const { container } = render(
      <HingeFeedView
        role="her"
        wallet={wallet}
        matchedLeadIds={[]}
        cutLooseIds={[]}
        onSendHingeOpener={onSendHingeOpener}
        onSwitchRole={vi.fn()}
        onOpenWildMap={vi.fn()}
      />,
    );

    const htmlText = container.textContent || '';
    // Zero desired-age pre-filter UI and zero narrator/wardrobe pill clutter
    expect(htmlText).not.toMatch(/desired age|age filter|photo 1 of 6|oatmeal cashmere/i);
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(6);

    // Open comment sheet on Prompt 1 of the first Hinge profile (Julian, 27, selective)
    const likePromptBtns = screen.getAllByLabelText(/like prompt/i);
    fireEvent.click(likePromptBtns[0]);

    // Sending lazy opener #1 ("Hey cute accent where are you from", delta < 0) leaves Julian in Sent Like • Pending (not instant match)
    const lazyBtn = screen.getByRole('button', { name: /hey cute accent where are you from/i });
    fireEvent.click(lazyBtn);

    expect(onSendHingeOpener).toHaveBeenCalledTimes(1);
    expect(onSendHingeOpener.mock.calls[0][0]).toBe('julian');
    expect(onSendHingeOpener.mock.calls[0][4]).toBeLessThan(0);
    expect(screen.getAllByText(/sent like • pending/i).length).toBeGreaterThanOrEqual(1);

    // Next profile in deck is Søren (26, Standout) — sending a Standout Rose (1 Cr) matches immediately!
    const nextPromptBtns = screen.getAllByLabelText(/like prompt/i);
    fireEvent.click(nextPromptBtns[0]);
    const roseBtn = screen.getByRole('button', { name: /standout rose/i });
    fireEvent.click(roseBtn);

    expect(onSendHingeOpener).toHaveBeenCalledTimes(2);
    expect(onSendHingeOpener.mock.calls[1][0]).toBe('soren');
    expect(onSendHingeOpener.mock.calls[1][3]).toBe(1);
    expect(onSendHingeOpener.mock.calls[1][4]).toBeGreaterThan(20);
  });

  it('renders all 10 illustrated In The Wild hotspots, plays Miles curbside luggage/car takeover at Terminal B, and runs 3-beat Cameo on already-matched venues', () => {
    const onUnlockWildLead = vi.fn();
    const onCompleteCameo = vi.fn();

    const { rerender } = render(
      <InTheWildMapView
        role="her"
        activeLeadThreads={[]}
        completedCameoVenues={[]}
        onUnlockWildLead={onUnlockWildLead}
        onCompleteCameo={onCompleteCameo}
      />,
    );

    expect(screen.getAllByText(/The Marlow Lounge/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Hawthorne University/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Terminal B Arrivals/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Palisades Cul-de-Sac BBQ/i).length).toBeGreaterThanOrEqual(1);

    // Enter Terminal B Arrivals as her -> 3-beat cold-approach sequence (Open -> Read Intent -> Pull Number)
    fireEvent.click(screen.getByRole('button', { name: /Terminal B Arrivals/i }));
    expect(screen.getByText(/takes both of your heavy bags in one hand/i)).toBeTruthy();
    expect(screen.getByTestId('wild-signal-meter').textContent).toMatch(/15% Spark/i);

    // Beat 1: Open
    fireEvent.click(
      screen.getByRole('button', {
        name: /Hand over both bags with a slow smile/i,
      }),
    );
    expect(onUnlockWildLead).not.toHaveBeenCalled();
    expect(screen.getByTestId('wild-signal-meter').textContent).toMatch(/52% Spark/i);

    // Beat 2: Read real single/flirt intent
    fireEvent.click(screen.getByTestId('wild-followup-pass-option'));
    expect(onUnlockWildLead).not.toHaveBeenCalled();
    expect(screen.getByTestId('wild-signal-meter').textContent).toMatch(/84% Spark/i);

    // Beat 3: Smooth number close -> unlocks personal thread + stamp slam!
    fireEvent.click(screen.getByTestId('wild-followup-pass-option'));
    expect(onUnlockWildLead).toHaveBeenCalledWith('miles', 'terminal-b-airport', 22, undefined);
    expect(screen.getByTestId('wild-number-pulled-stamp')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Back to City Map/i }));

    // Re-render with miles already in activeLeadThreads -> Terminal B plays Claire 3-beat Chemistry Cameo instead of duplicating Chapter 1!
    rerender(
      <InTheWildMapView
        role="her"
        activeLeadThreads={['miles']}
        completedCameoVenues={[]}
        onUnlockWildLead={onUnlockWildLead}
        onCompleteCameo={onCompleteCameo}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Terminal B Arrivals/i }));
    const cameoBtn = screen.getByRole('button', { name: /Claim \+15% Chemistry Cameo/i });
    fireEvent.click(cameoBtn);
    expect(onCompleteCameo).toHaveBeenCalledWith('terminal-b-airport', 'miles', 15);

    // Even when both matched AND cameo completed, Terminal B STILL keeps its full 3-step scene playable & replayable (zero dead-end Return to Chat lock!)
    rerender(
      <InTheWildMapView
        role="her"
        activeLeadThreads={['miles']}
        completedCameoVenues={['terminal-b-airport']}
        completedWildVenues={['terminal-b-airport']}
        onUnlockWildLead={onUnlockWildLead}
        onCompleteCameo={onCompleteCameo}
      />,
    );
    expect(screen.queryByText(/Return to .* Chat/i)).toBeNull();
    expect(screen.getByTestId('wild-signal-meter').textContent).toMatch(/15% Spark/i);
    expect(
      screen.getByRole('button', { name: /Hand over both bags with a slow smile/i }),
    ).toBeTruthy();
  });

  it('seeds Wild-origin iMessage threads with hotspot-specific meet-cute banter, zero app-graduation confusion, and 3 comedic choices per hotspot', async () => {
    const { createInitialThread, ChatsAndDatesView } = await import(
      '../src/components/ChatsAndDatesView'
    );
    const { V35_WILD_VENUES } = await import('../src/data/v35WildVenues');
    const { V35_CHAT_CHAPTERS } = await import('../src/data/v35ChatsAndDates');

    // Every hotspot provides 3 distinct choices for both Her and Him, with zero spoken "xx"
    for (const venue of V35_WILD_VENUES) {
      expect(venue.choicesHer).toHaveLength(3);
      expect(venue.choicesHim).toHaveLength(3);
      expect(JSON.stringify(venue)).not.toMatch(/\sxx?["”]/i);
    }

    // Zero robotic "man/woman" slash templates in chat chapters
    expect(JSON.stringify(V35_CHAT_CHAPTERS)).not.toMatch(/man\/woman/i);

    // Cub meets Claire offline at The Marlow Lounge -> opens iMessage with napkin callback, NOT "noisy app / graduated off Hinge"
    const wildClaireThread = createInitialThread(
      'claire',
      'wild',
      undefined,
      false,
      'velvet-room',
    );
    expect(wildClaireThread.messages.some((m) => /cocktail napkin/i.test(m.text))).toBe(true);
    expect(
      wildClaireThread.messages.some((m) => /noisy app|graduated off hinge/i.test(m.text)),
    ).toBe(false);

    const wallet = createDefaultWallet(new Date('2026-11-26T12:00:00Z'));
    const { container } = render(
      <ChatsAndDatesView
        role="him"
        wallet={wallet}
        threads={[wildClaireThread]}
        selectedLeadId="claire"
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

    const viewText = container.textContent || '';
    expect(viewText).toMatch(/Met at The Marlow Lounge/i);
    expect(viewText).toMatch(/cocktail napkin/i);
    expect(viewText).not.toMatch(/graduated off Hinge|noisy app/i);
  });
});
