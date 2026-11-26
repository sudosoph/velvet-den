import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { CubSchoolView } from '../src/components/CubSchoolView';
import { V35_CUB_SCHOOL_DRILLS } from '../src/data/v35CubSchool';

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

    // Sticky Hinge Pass / Left-Swipe (X) button is immediately visible in the viewport & advances profile on click
    const stickyPassBtn = screen.getByTestId('hinge-sticky-pass-btn');
    expect(stickyPassBtn.closest('.sticky')).not.toBeNull();
    expect(screen.getByRole('heading', { name: /Julian/i })).toBeInTheDocument();
    fireEvent.click(stickyPassBtn);
    expect(screen.getByRole('heading', { name: /Søren/i })).toBeInTheDocument();
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

  it('keeps the Hinge Like modal crisp (no backdrop-blur veil), sends a plain Like immediately when clicking Send Like without typing, and dismisses via backdrop click or Escape', () => {
    render(<App />);

    // 1. Open Hinge Like modal on Photo 1 of Julian
    const likePhotoBtn = screen.getByRole('button', { name: /Like photo 1 of Julian/i });
    fireEvent.click(likePhotoBtn);

    const dialog = screen.getByRole('dialog', { name: /Reply to Julian/i });
    expect(dialog.className).not.toContain('backdrop-blur');

    // 2. Escape closes the modal cleanly
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /Reply to Julian/i })).toBeNull();

    // 3. Re-open and click the dim backdrop outside the modal card -> closes cleanly
    fireEvent.click(likePhotoBtn);
    const reopened = screen.getByRole('dialog', { name: /Reply to Julian/i });
    fireEvent.click(reopened);
    expect(screen.queryByRole('dialog', { name: /Reply to Julian/i })).toBeNull();

    // 4. Re-open and click "Send Like" with an empty comment box -> sends Like immediately & advances to Søren!
    fireEvent.click(likePhotoBtn);
    const sendLikeBtn = screen.getByRole('button', { name: /^Send Like$/i });
    fireEvent.click(sendLikeBtn);
    expect(screen.queryByRole('dialog', { name: /Reply to Julian/i })).toBeNull();
    expect(screen.getByRole('heading', { name: /Søren/i })).toBeInTheDocument();
  });

  it('renders Cub School as a punchy visual scene quiz (question first, zero pre-question blockquote, concise A/B/C options)', () => {
    for (const drill of V35_CUB_SCHOOL_DRILLS) {
      expect((drill as { sceneImage?: string }).sceneImage).toMatch(/^\.\/images\/scenes\/.+\.jpg$/);
      const q = (drill as { punchyQuestion?: string }).punchyQuestion || '';
      expect(q.endsWith('?')).toBe(true);
      expect(q.length).toBeLessThanOrEqual(95);
      for (const opt of drill.options) {
        expect(opt.label.length).toBeLessThanOrEqual(95);
      }
    }

    const { container } = render(<CubSchoolView role="her" />);
    // Zero blockquote clutter before picking an option!
    expect(container.querySelectorAll('blockquote').length).toBe(0);
    // Scene illustration + bold question ending in ? immediately visible
    expect(screen.getByTestId('cub-school-scene-img')).toBeInTheDocument();
    expect(screen.getByTestId('cub-school-question').textContent?.trim().endsWith('?')).toBe(true);
  });
});
