import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FieldGuideModal } from '../src/components/FieldGuideModal';
import { VelvetJournalView } from '../src/components/VelvetJournalView';
import { JOURNAL_ARTICLES } from '../src/data/journalArticles';
import { FIELD_GUIDE_ENTRIES } from '../src/domain/taxonomy';

describe('v35 BuzzFeed & Top-Reddit Style Visual Club Guides, Illustrated Astro Toy & Full-Art Field Guide', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders BuzzFeed-style visual section photo cards, upvoted Reddit-style community receipts, interactive 1-tap polls, and bespoke bubbles across all 16 guides', () => {
    render(<VelvetJournalView onPlayScenario={vi.fn()} />);

    // Visual section cards with real photos break up every guide (zero wall of text)
    const sectionCards = screen.getAllByTestId('guide-section-visual-card');
    expect(sectionCards.length).toBeGreaterThanOrEqual(3);
    for (const card of sectionCards) {
      expect(card.querySelector('img')).not.toBeNull();
    }

    // Reddit-style upvoted community receipt callout is present
    expect(screen.getByTestId('guide-reddit-receipt')).toBeInTheDocument();

    // Interactive BuzzFeed 1-tap Vibe Poll votes and reveals percentage bars
    const poll = screen.getByTestId('guide-buzzfeed-poll');
    const pollButtons = within(poll).getAllByRole('button');
    expect(pollButtons.length).toBeGreaterThanOrEqual(3);
    fireEvent.click(pollButtons[0]);
    expect(poll.textContent).toMatch(/%/);

    // Every single one of the 16 guides has a widescreen ./images/scenes/ hero banner, bespoke iMessage copy, and zero weird emerald/rose traffic-light cards!
    const seenDoTexts = new Set<string>();
    for (const art of JOURNAL_ARTICLES) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(art.seoTitle.slice(0, 24), 'i') }));
      const heroSrc = screen.getByTestId('guide-hero-photo').getAttribute('src') || '';
      expect(heroSrc, `Guide ${art.slug} hero must be a widescreen scene`).toMatch(
        /^\.\/images\/scenes\/.+\.jpg$/,
      );
      const bubbleBox = screen.getByTestId('guide-text-this-not-that');
      expect(bubbleBox.textContent).not.toContain('idk what do u wanna do tonight?? u pick');
      expect(bubbleBox.innerHTML).not.toContain('bg-rose-50');
      expect(screen.queryByTestId('guide-green-red-flags')).toBeNull();
      seenDoTexts.add(bubbleBox.textContent || '');
    }
    expect(seenDoTexts.size).toBe(16);
  });

  it('opens the illustrated 12x12 Astro Matcher in 1 tap from the top bar with cast portraits, date scene photo, clickable emoji sign chips, and 4 visual compatibility meters', () => {
    render(<VelvetJournalView onPlayScenario={vi.fn()} />);

    // 1-tap jump pill opens the Astro Matcher immediately without hunting down to Guide #13
    fireEvent.click(screen.getByRole('button', { name: /🔮.*Astro Matcher/i }));

    const astro = screen.getByTestId('zodiac-12x12-matcher');
    expect(astro).toBeInTheDocument();

    // Contains real cast portraits (Her + Him) AND a date-night scene photo (>= 3 images!)
    const astroImgs = astro.querySelectorAll('img');
    expect(astroImgs.length).toBeGreaterThanOrEqual(3);

    // 4 visual emoji compatibility progress bars break up the reading into scannable BuzzFeed meters
    const meterGrid = within(astro).getByTestId('zodiac-meter-grid');
    expect(meterGrid.textContent).toMatch(/🔥/);
    expect(meterGrid.textContent).toMatch(/%/);

    // Clickable 1-tap sign chips work alongside accessible <select> elements
    fireEvent.click(within(astro).getByTestId('her-sign-chip-aries'));
    fireEvent.click(within(astro).getByTestId('him-sign-chip-libra'));
    expect(within(astro).getByText(/♈ Aries Her × ♎ Libra Cub/i)).toBeInTheDocument();
  });

  it('illustrates all 33 FieldGuideModal cards (including Feline Scale, Cub Taxonomy & Polarity Lore — zero text-only cards)', () => {
    render(<FieldGuideModal open={true} unlockedStamps={[]} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { name: /Age-Gap Dating Field Guide/i });
    const imgs = dialog.querySelectorAll('img');
    expect(imgs.length).toBe(FIELD_GUIDE_ENTRIES.length);
  });
});
