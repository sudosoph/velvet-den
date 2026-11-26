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

    expect(screen.getAllByText(/The Velvet Room/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Hawthorne University/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Terminal B Arrivals/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Velvet Palms Cul-de-Sac BBQ/i).length).toBeGreaterThanOrEqual(1);

    // Enter Terminal B Arrivals as her -> Miles takes both bags & coordinated car + 8:15 table
    fireEvent.click(screen.getByRole('button', { name: /Terminal B Arrivals/i }));
    expect(screen.getByText(/takes both of your heavy bags in one hand/i)).toBeTruthy();

    fireEvent.click(
      screen.getByRole('button', {
        name: /Hand over both bags with a slow smile/i,
      }),
    );
    expect(onUnlockWildLead).toHaveBeenCalledWith('miles', 'terminal-b-airport', 22, undefined);
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
    expect(onCompleteCameo).toHaveBeenCalledWith('terminal-b-airport', 'claire', 15);
  });
});
