import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';

describe('v35 Clean Consumer Nav Bar (Zero Overflow/Pill Soup) & Unobstructed Real Hinge Photos', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('strips all top-of-photo caption bars and duplicate header clutter from Hinge profiles so photos look 100% like real Hinge', () => {
    const { container } = render(<App />);

    // Zero floating slide caption bars ("Stole five minutes of Amalfi sun...") anywhere on Hinge feed!
    expect(container.textContent || '').not.toContain(
      'Stole five minutes of Amalfi sun between archive days',
    );
    expect(container.textContent || '').not.toContain(
      '6 AM single scull before the river gets choppy',
    );

    // Every 3:4 Hinge photo frame has ONLY the <img> and the bottom-right Heart <button> — zero text overlay divs!
    const photoFrames = Array.from(container.querySelectorAll('article .aspect-\\[3\\/4\\]'));
    expect(photoFrames).toHaveLength(6);
    for (const frame of photoFrames) {
      expect(frame.querySelectorAll('div, p, span').length).toBe(0);
      expect(frame.querySelector('img')).not.toBeNull();
      expect(frame.querySelector('button')).not.toBeNull();
    }

    // Zero duplicate "Meet Exclusives In The Wild" pill stacked right below the Compass Bar
    expect(container.textContent || '').not.toContain('Meet Exclusives In The Wild');
  });

  it('renders a clean unified segmented Primary Navigation with zero individual pill borders, zero h-8.5 height clipping, and zero double emojis', () => {
    const { container } = render(<App />);

    const primaryNav = screen.getByRole('navigation', { name: /Primary Club Navigation/i });
    const navButtons = within(primaryNav).getAllByRole('button');
    expect(navButtons.length).toBe(5);

    for (const btn of navButtons) {
      expect(btn.className).toContain('whitespace-nowrap');
      expect(btn.className).toContain('shrink-0');
      expect(btn.className).not.toContain('h-8.5');
    }

    // Zero double-emoji / icon+emoji collisions in TopHudBar or CampaignCompassBar
    const supportLink = screen.getAllByRole('link', { name: /Support This Project/i })[0];
    expect(supportLink.textContent).not.toContain('💛');

    const compass = screen.getByTestId('campaign-compass-bar');
    expect(compass.textContent).not.toContain('🎓');
    expect(compass.textContent).not.toContain('🗺️');

    // Friday hearts remain cleanly accessible via hud-friday-hearts
    expect(screen.getByTestId('hud-friday-hearts').textContent).toContain('❤️❤️❤️');
    expect(container.querySelectorAll('header .border-stone-200').length).toBeLessThanOrEqual(4);
  });
});
