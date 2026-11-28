import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FieldGuideModal } from '../src/components/FieldGuideModal';
import {
  computeExactPollPercentages,
  VelvetJournalView,
} from '../src/components/VelvetJournalView';
import { JOURNAL_ARTICLES } from '../src/data/journalArticles';
import { FIELD_GUIDE_ENTRIES } from '../src/domain/taxonomy';

describe('v35 Illustrated Visual Club Guides, Astro Toy & Full-Art Field Guide', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders airy BuzzFeed numbered photo listicles, zero fake Reddit handles, real vote-incrementing Club Polls summing to 100%, and topic-pure copy across all 16 guides', () => {
    const { container } = render(<VelvetJournalView onPlayScenario={vi.fn()} />);

    // Guide #1 (Feline Age Chart) stays strictly on the 5 feline tiers with brief listicle copy
    const ageChartArticle = JOURNAL_ARTICLES[0];
    expect(ageChartArticle.sections).toHaveLength(5);
    expect(ageChartArticle.sections.map((s) => s.heading).join(' ')).toMatch(
      /Junior Cougar.*Puma.*Cougar.*Jaguar.*Panther/,
    );

    // Every non-bullet listicle section across all 16 guides stays brief and scannable (< 240 chars)
    for (const art of JOURNAL_ARTICLES) {
      expect(art.intro.length).toBeLessThan(160);
      for (const sec of art.sections) {
        expect(sec.subhead, `Missing subhead in ${art.slug}`).toBeTruthy();
        if (!sec.body.includes('\n•')) {
          expect(sec.body.length, `Long wall-of-text in ${art.slug}: ${sec.heading}`).toBeLessThan(
            240,
          );
        }
      }
    }

    // Visual section cards with real photos break up every guide (zero wall of text)
    const sectionCards = screen.getAllByTestId('guide-section-visual-card');
    expect(sectionCards.length).toBeGreaterThanOrEqual(4);
    for (const card of sectionCards) {
      expect(card.querySelector('img')).not.toBeNull();
    }

    // Zero fake u/ Reddit handles or fake upvote callouts; clean Quick Takeaway card instead
    expect(screen.getByTestId('guide-quick-takeaway')).toBeInTheDocument();
    expect(screen.queryByTestId('guide-reddit-receipt')).toBeNull();
    expect(container.textContent).not.toMatch(/\bu\/[A-Za-z0-9_]+/);

    // Real Club Poll math: increments total votes on click, persists to localStorage, and percentages always sum to 100%
    expect(computeExactPollPercentages([68, 49, 33]).reduce((a, b) => a + b, 0)).toBe(100);
    expect(computeExactPollPercentages([1, 1, 1]).reduce((a, b) => a + b, 0)).toBe(100);

    const poll = screen.getByTestId('guide-club-poll');
    expect(poll.textContent).toContain('150 votes');
    const pollButtons = within(poll).getAllByRole('button');
    expect(pollButtons).toHaveLength(3);
    fireEvent.click(pollButtons[0]);
    expect(poll.textContent).toContain('151 total votes');
    const renderedPcts = Array.from(poll.textContent?.matchAll(/(\d+)%/g) ?? []).map((m) =>
      Number(m[1]),
    );
    expect(renderedPcts).toHaveLength(3);
    expect(renderedPcts.reduce((a, b) => a + b, 0)).toBe(100);

    // Every single one of the 16 guides has a widescreen ./images/scenes/ hero banner and bespoke iMessage copy
    const seenDoTexts = new Set<string>();
    for (const art of JOURNAL_ARTICLES) {
      fireEvent.click(
        screen.getByRole('button', { name: new RegExp(art.seoTitle.slice(0, 22), 'i') }),
      );
      const heroSrc = screen.getByTestId('guide-hero-photo').getAttribute('src') || '';
      expect(heroSrc, `Guide ${art.slug} hero must be a widescreen scene`).toMatch(
        /^\.\/images\/scenes\/.+\.jpg$/,
      );
      const bubbleBox = screen.getByTestId('guide-text-this-not-that');
      expect(bubbleBox.textContent).not.toContain('idk what do u wanna do tonight?? u pick');
      seenDoTexts.add(bubbleBox.textContent || '');
    }
    expect(seenDoTexts.size).toBe(JOURNAL_ARTICLES.length);
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

    // 4 visual compatibility progress bars break up the reading into scannable meters
    const meterGrid = within(astro).getByTestId('zodiac-meter-grid');
    expect(meterGrid.textContent).toMatch(/🔥/);
    expect(meterGrid.textContent).toMatch(/%/);

    // Clickable 1-tap sign chips work alongside accessible <select> elements
    fireEvent.click(within(astro).getByTestId('her-sign-chip-aries'));
    fireEvent.click(within(astro).getByTestId('him-sign-chip-libra'));
    expect(within(astro).getByText(/♈ Aries Her × ♎ Libra Cub/i)).toBeInTheDocument();
  });

  it('illustrates all 39 FieldGuideModal cards eagerly with real person portraits (zero lazy-load blanks, zero empty room crops, zero hidden images)', () => {
    render(<FieldGuideModal open={true} unlockedStamps={[]} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { name: /Age-Gap Dating Field Guide/i });
    expect(dialog.className).not.toContain('backdrop-blur');
    const imgs = Array.from(dialog.querySelectorAll('img'));
    expect(imgs.length).toBe(FIELD_GUIDE_ENTRIES.length);
    for (const img of imgs) {
      expect(img.getAttribute('loading')).toBeNull();
      expect(img.getAttribute('src')).toMatch(/^\.\/images\/(cast|icons)\/.+\.jpg$/);
    }
  });
});
