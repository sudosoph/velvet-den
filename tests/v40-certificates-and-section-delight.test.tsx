import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { CougarCubChecklistModal } from '../src/components/CougarCubChecklistModal';
import { CubSchoolView } from '../src/components/CubSchoolView';
import { DateodexModal } from '../src/components/DateodexModal';
import { FieldGuideModal } from '../src/components/FieldGuideModal';
import {
  buildTriviaSprintDeck,
  PopCultureTriviaModal,
} from '../src/components/PopCultureTriviaModal';
import { loadDateodex } from '../src/domain/dateodex';
import { createDefaultWallet } from '../src/domain/economy';
import worker from '../worker/index';

describe('v40 Shareable Cougar/Cub Gold-Seal Vetting Certificates, /api/og?cert=1 Cards & Section-by-Section Delight Polish', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('mints personalized Cougar & Cub Gold-Seal Vetting Certificates in Cub School and opens shared ?cert=1 links directly', () => {
    const { unmount } = render(<CubSchoolView role="her" playerName="Vivian" initialGoldStars={9} />);

    fireEvent.click(screen.getByTestId('open-vetting-certificate-btn'));
    const cert = screen.getByTestId('official-vetting-certificate');
    expect(cert.textContent).toContain('Vivian');
    expect(cert.textContent).toContain('Certified Sovereign Cougar & Master Vetter');

    // Customize recipient name to confer a Vetted Cub Diploma onto a partner
    fireEvent.change(screen.getByTestId('certificate-recipient-input'), {
      target: { value: 'Julian' },
    });
    fireEvent.change(screen.getByLabelText(/Select Certificate Seal/i), {
      target: { value: 'cub_diploma' },
    });
    expect(screen.getByTestId('official-vetting-certificate').textContent).toContain('Julian');
    expect(screen.getByTestId('official-vetting-certificate').textContent).toContain(
      'Certified Housebroken Cub Diploma',
    );
    expect(screen.getByTestId('download-gold-certificate-btn')).toBeInTheDocument();
    expect(screen.getByTestId('copy-reddit-certificate-btn')).toBeInTheDocument();
    unmount();

    // Shared ?cert=1&holder=... URL opens App directly on the personalized Gold-Seal Certificate
    window.history.replaceState(
      {},
      '',
      '/?cert=1&holder=Miles&seal=Certified+Housebroken+Cub+Diploma',
    );
    render(<App />);
    expect(screen.getByTestId('official-vetting-certificate').textContent).toContain('Miles');
  });

  it('serves dynamic Gold-Seal Certificate OpenGraph SVG cards at GET /api/og?cert=1 and injects deduplicated OG meta tags', async () => {
    const ogRes = await worker.fetch(
      new Request(
        'https://cougarsandcubs.club/api/og?cert=1&holder=Claire&seal=Certified+Sovereign+Cougar',
      ),
      {},
    );
    expect(ogRes.status).toBe(200);
    expect(ogRes.headers.get('Content-Type')).toContain('image/svg+xml');
    const svg = await ogRes.text();
    expect(svg).toContain('CONFERRED: CLAIRE');
    expect(svg).toContain('Certified Sovereign Cougar');

    const htmlRes = await worker.fetch(
      new Request(
        'https://cougarsandcubs.club/?cert=1&holder=Claire&seal=Certified+Sovereign+Cougar',
      ),
      {
        ASSETS: {
          fetch: async () =>
            new Response(
              '<!doctype html><html><head><meta property="og:image" content="old.jpg" /><title>App</title></head><body></body></html>',
              { headers: { 'content-type': 'text/html; charset=utf-8' } },
            ),
        },
      },
    );
    const html = await htmlRes.text();
    expect(html.match(/property="og:image"/g)).toHaveLength(1);
    expect(html).toContain('cert=1');
    expect(html).toContain('holder=Claire');
  });

  it('delights across Dateodex (Women/Men filters + Dossier Certificate), Trivia (Hot-Streak pill + Historian Certificate), Checklist Certificate, and Field Guide Search/Copy', () => {
    const wallet = createDefaultWallet();

    // 1. Dateodex filters 11 Women / 11 Men + Dossier Certificate button
    const { unmount: unmountDateodex } = render(
      <DateodexModal
        open={true}
        dateodex={loadDateodex()}
        wallet={wallet}
        cutLooseIds={['graham']}
        onClose={() => {}}
      />,
    );
    expect(screen.getByTestId('dateodex-download-dossier-btn')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /11 Women/i }));
    expect(screen.getByText(/Claire, 46/i)).toBeInTheDocument();
    expect(screen.queryByText(/Julian, 27/i)).toBeNull();
    unmountDateodex();

    // 2. Pop-Culture Trivia shows 2x Hot-Streak pill on consecutive right answers + Historian Certificate on finish
    const unshuffledEasy = buildTriviaSprintDeck('all', 'easy', false);
    const { unmount: unmountTrivia } = render(
      <PopCultureTriviaModal
        open={true}
        onClose={() => {}}
        onEarnTriviaReward={() => false}
      />,
    );
    fireEvent.click(screen.getByText(unshuffledEasy[0].options[unshuffledEasy[0].correctIndex]));
    fireEvent.click(screen.getByRole('button', { name: /Next Question/i }));
    fireEvent.click(screen.getByText(unshuffledEasy[1].options[unshuffledEasy[1].correctIndex]));
    expect(screen.getByTestId('trivia-hot-streak-pill').textContent).toContain('2x Streak!');
    for (let q = 1; q < unshuffledEasy.length; q += 1) {
      if (q > 1) {
        fireEvent.click(
          screen.getByText(unshuffledEasy[q].options[unshuffledEasy[q].correctIndex]),
        );
      }
      fireEvent.click(
        screen.getByRole('button', {
          name: q + 1 >= unshuffledEasy.length ? /See Final Score/i : /Next Question/i,
        }),
      );
    }
    expect(screen.getByTestId('trivia-download-certificate-btn')).toBeInTheDocument();
    unmountTrivia();

    // 3. Checklist exposes Rite-of-Passage Certificate PNG download
    const { unmount: unmountChecklist } = render(
      <CougarCubChecklistModal
        open={true}
        onClose={() => {}}
        onClaimChecklistReward={() => false}
        onPlayMatchedScenario={() => {}}
      />,
    );
    expect(screen.getByTestId('checklist-download-certificate-btn')).toBeInTheDocument();
    unmountChecklist();

    // 4. Field Guide instant search filters to matching lore & copies definition
    render(<FieldGuideModal open={true} unlockedStamps={[]} onClose={() => {}} />);
    fireEvent.change(screen.getByTestId('field-guide-search-input'), {
      target: { value: 'Cher' },
    });
    expect(screen.getAllByText(/Cher/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/DM Goblin/i)).toBeNull();
  });
});
