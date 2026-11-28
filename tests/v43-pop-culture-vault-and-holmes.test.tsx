import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PopCultureTriviaModal,
  TRIVIA_CURATED_PACKS,
  buildTriviaSprintDeck,
} from '../src/components/PopCultureTriviaModal';
import { VelvetJournalView } from '../src/components/VelvetJournalView';
import { JOURNAL_ARTICLES } from '../src/data/journalArticles';
import { POP_CULTURE_TRIVIA } from '../src/data/popCultureTrivia';
import { FIELD_GUIDE_ENTRIES } from '../src/domain/taxonomy';

describe('v43 150-Question Pop-Culture Vault, 6 Curated Packs, Katie Holmes, Elizabeth Holmes & Plot-Twist Guide', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('expands POP_CULTURE_TRIVIA to 150 verified questions featuring Katie Holmes, Elizabeth Holmes & Billy Evans, Joan Collins, Sandra Bullock & Ryan Gosling, and more', () => {
    expect(POP_CULTURE_TRIVIA).toHaveLength(150);

    const ids = new Set(POP_CULTURE_TRIVIA.map((q) => q.id));
    expect(ids.has('katie-holmes-bobby-wooten-emilio-vitolo')).toBe(true);
    expect(ids.has('elizabeth-holmes-billy-evans-mit-ring')).toBe(true);
    expect(ids.has('the-dropout-hulu-sunny-to-billy-pivot')).toBe(true);
    expect(ids.has('joan-collins-percy-gibson-quote')).toBe(true);
    expect(ids.has('sandra-bullock-ryan-gosling-murder-by-numbers')).toBe(true);
    expect(ids.has('jennifer-lopez-casper-smart-dance')).toBe(true);
    expect(ids.has('britney-spears-sam-asghari-slumber-party')).toBe(true);
    expect(ids.has('kim-kardashian-pete-davidson-aladdin-snl')).toBe(true);
    expect(ids.has('courteney-cox-johnny-mcdaid-ed-sheeran')).toBe(true);
    expect(ids.has('deborra-lee-furness-hugh-jackman-correlli')).toBe(true);
    expect(ids.has('lisa-bonet-jason-momoa-jazz-club-guinness')).toBe(true);
    expect(ids.has('cher-tom-cruise-top-5-lovers')).toBe(true);
    expect(ids.has('robin-wright-clement-giraudet-cannes')).toBe(true);
    expect(ids.has('vivienne-westwood-andreas-kronthaler-vienna')).toBe(true);

    // Every curated pack question ID must exist in POP_CULTURE_TRIVIA
    expect(TRIVIA_CURATED_PACKS).toHaveLength(6);
    for (const pack of TRIVIA_CURATED_PACKS) {
      expect(pack.questionIds.length).toBeGreaterThanOrEqual(12);
      for (const qId of pack.questionIds) {
        expect(ids.has(qId), `Missing trivia ID ${qId} in pack ${pack.id}`).toBe(true);
      }
    }
  });

  it('ships Curated Theme Packs, 5/8/15/All Round Lengths, Mastery Vault tracking, and instant Celebrity Search', () => {
    render(
      <PopCultureTriviaModal
        open={true}
        onClose={vi.fn()}
        onEarnTriviaReward={() => false}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: /Pop-Culture Cougar & Cub Trivia/i });
    expect(dialog.textContent).toMatch(/0\/150 mastered/i);

    // 1. Switch round length from default 8 Qs -> Quick 5 Qs
    const lengthBar = within(dialog).getByTestId('trivia-length-bar');
    fireEvent.click(within(lengthBar).getByRole('button', { name: '5 Qs' }));
    expect(dialog.textContent).toMatch(/Question 1 of 5/i);

    // 2. Open 6 Curated Packs drawer -> launch Scandal, Tabloids & Plot Twists pack (opens with Elizabeth Holmes & Billy Evans!)
    fireEvent.click(within(dialog).getByTestId('trivia-packs-toggle-btn'));
    const packsGrid = within(dialog).getByTestId('trivia-curated-packs-grid');
    expect(packsGrid.textContent).toMatch(/Hollywood Toyboys/i);
    expect(packsGrid.textContent).toMatch(/Scandal, Tabloids & Plot Twists/i);

    fireEvent.click(within(packsGrid).getByTestId('trivia-pack-scandal_twists'));
    expect(dialog.textContent).toMatch(/Elizabeth Holmes/i);
    expect(dialog.textContent).toMatch(/MIT class signet ring/i);

    // Answer correctly -> increments mastered vault count to 1/150!
    fireEvent.click(
      within(dialog).getByRole('button', { name: /federal asset forfeiture/i }),
    );
    expect(dialog.textContent).toMatch(/1\/150 mastered/i);

    // 3. Instant Vault Search for "Katie Holmes" pulls up her Manhattan creative era directly
    const searchInput = within(dialog).getByTestId('trivia-vault-search');
    fireEvent.change(searchInput, { target: { value: 'Katie Holmes' } });
    expect(dialog.textContent).toMatch(/Bobby Wooten III/i);

    // Verify buildTriviaSprintDeck unseenOnly excludes mastered IDs
    const filteredUnseen = buildTriviaSprintDeck('all', 'all', false, {
      packId: 'scandal_twists',
      unseenOnly: true,
      masteredIds: ['elizabeth-holmes-billy-evans-mit-ring'],
    });
    expect(
      filteredUnseen.some((q) => q.id === 'elizabeth-holmes-billy-evans-mit-ring'),
    ).toBe(false);
  });

  it('publishes Guide #17 on Plot-Twist Celebrity Couples (Elizabeth Holmes & Billy Evans, Katie Holmes, Joan Collins) & Field Guide entries', () => {
    const plotTwistGuide = JOURNAL_ARTICLES.find(
      (a) => a.slug === 'elizabeth-holmes-billy-evans-katie-holmes-plot-twist-couples',
    );
    expect(plotTwistGuide).toBeDefined();
    expect(plotTwistGuide?.sections).toHaveLength(6);

    const fgIds = new Set(FIELD_GUIDE_ENTRIES.map((e) => e.id));
    expect(fgIds.has('pop_elizabeth_holmes_billy')).toBe(true);
    expect(fgIds.has('pop_katie_holmes_manhattan')).toBe(true);
    expect(fgIds.has('pop_joan_collins_percy')).toBe(true);

    render(
      <VelvetJournalView
        initialSlug="elizabeth-holmes-billy-evans-katie-holmes-plot-twist-couples"
        onPlayScenario={vi.fn()}
      />,
    );
    expect(screen.getByTestId('guide-buzzfeed-lede').textContent).toMatch(/MIT signet ring/i);
    expect(document.body.textContent).toMatch(/If he dies, he dies!/i);
  });
});
