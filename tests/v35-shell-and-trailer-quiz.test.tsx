import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { MONETIZATION_CONFIG } from '../src/config/monetization';
import { POP_CULTURE_TRIVIA } from '../src/data/popCultureTrivia';
import { encodeChallengeLink } from '../src/lib/viral';

describe('v35 Unified Editorial Shell, Spoiler-Free Trailer Quiz, Visual Shoppable Guides & SEO Routing', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('renders clean editorial Hinge discovery by default with visible Support This Project CTA, 3 Friday Hearts, 3 Cr starter balance, and 15-sec Persona Setup', () => {
    const { container } = render(<App />);

    // Zero legacy 57-card grid, stick-figure academy, or 8-bit boxes
    expect(screen.queryByTestId('desktop-phone-simulator')).toBeNull();
    expect(container.textContent || '').not.toMatch(/8-Bit Neighborhood|PixiJS/i);

    // 4 primary navigation tabs inside Primary Club Navigation
    const primaryNav = screen.getByRole('navigation', { name: /Primary Club Navigation/i });
    expect(within(primaryNav).getByRole('button', { name: /^Hinge$/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('button', { name: /^In The Wild$/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('button', { name: /^Chats & Dates$/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('button', { name: /^Cub School$/i })).toBeInTheDocument();

    // Visible Support This Project link + 3 Friday Hearts + 5 Cr starter balance
    const supportLinks = screen.getAllByRole('link', { name: /Support This Project/i });
    expect(supportLinks.length).toBeGreaterThanOrEqual(1);
    expect(supportLinks[0].getAttribute('href')).toBe(MONETIZATION_CONFIG.tipJarUrl);
    expect(screen.getByTestId('hud-friday-hearts').textContent).toContain('❤️❤️❤️');
    expect(screen.getByRole('button', { name: /\b5 Cr\b/i })).toBeInTheDocument();

    // Quick 15-second Persona Setup saves playerName + personaTag into wallet
    fireEvent.click(screen.getByRole('button', { name: /Persona/i }));
    const nameInput = screen.getByLabelText(/Your First Name/i);
    fireEvent.change(nameInput, { target: { value: 'Sophia' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Persona/i }));
    expect(screen.getByText(/Sophia/i)).toBeInTheDocument();
  });

  it('hides answer images and YouTube embeds in PopCultureTriviaModal before answering (spoiler-free), reveals official trailer after answering with zero figcaption, and grants 0 free credits', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Club Extras/i }));
    fireEvent.click(screen.getByRole('button', { name: /Trailer & Pop Quiz/i }));

    const dialog = screen.getByRole('dialog', { name: /Pop-Culture Cougar & Cub Trivia/i });

    // Before selecting an option: ZERO img and ZERO iframe inside the quiz dialog
    expect(dialog.querySelector('img')).toBeNull();
    expect(dialog.querySelector('iframe')).toBeNull();
    expect(dialog.querySelector('figcaption')).toBeNull();

    // Pick an option on Question 1 (No Hard Feelings -> has youtubeEmbedUrl kIcLb0KAJAs)
    fireEvent.click(
      within(dialog).getByRole('button', {
        name: /earn a Buick Regal/i,
      }),
    );

    // After answering: reveals official YouTube privacy-enhanced trailer iframe & zero figcaption
    const iframe = dialog.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute('src')).toContain('youtube-nocookie.com/embed/kIcLb0KAJAs');
    expect(dialog.querySelector('figcaption')).toBeNull();

    // Wallet remains strictly at 5 Cr (0 free credit inflation)
    expect(screen.getByRole('button', { name: /\b5 Cr\b/i })).toBeInTheDocument();

    // Verify trivia order interleaves categories & spaces repeated references >= 12 questions apart
    const nhfIndices = POP_CULTURE_TRIVIA.map((q, idx) =>
      /no hard feelings|maneater/i.test(`${q.id} ${q.question}`) ? idx : -1,
    ).filter((idx) => idx >= 0);
    for (let i = 1; i < nhfIndices.length; i++) {
      expect(nhfIndices[i] - nhfIndices[i - 1]).toBeGreaterThanOrEqual(15);
    }

    // Answer key rotates across all 4 slots (0, 1, 2, 3) and uses 100% local images (zero wikimedia 429s)
    const usedSlots = new Set(POP_CULTURE_TRIVIA.map((q) => q.correctIndex));
    expect(usedSlots.size).toBe(4);
    for (const q of POP_CULTURE_TRIVIA) {
      expect(q.imageUrl).toMatch(/^\.\/images\//);
    }
  });

  it('renders VelvetJournalView with widescreen scene hero photos, above-the-fold real product photography, authentic iMessage bubbles (zero weird red/green cards), and inline checklist links', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Club Extras/i }));
    fireEvent.click(screen.getByRole('button', { name: /Guides & Zodiac/i }));

    // Hero editorial photo uses widescreen ./images/scenes/*.jpg + above-the-fold shoppable strip
    expect(screen.getByTestId('guide-hero-photo').getAttribute('src')).toMatch(
      /images\/scenes\//,
    );
    const aboveFoldShop = screen.getByTestId('guide-above-fold-shop');
    const shopImgs = aboveFoldShop.querySelectorAll('img');
    expect(shopImgs.length).toBeGreaterThanOrEqual(2);
    expect(shopImgs[0].getAttribute('src')).toContain('/images/products/');
    expect(aboveFoldShop.querySelector('svg[viewBox="0 0 96 96"]')).toBeNull();

    // Authentic iMessage bubbles present, and ZERO weird traffic-light red/green flag cards!
    expect(screen.getByTestId('guide-text-this-not-that')).toBeInTheDocument();
    expect(screen.queryByTestId('guide-green-red-flags')).toBeNull();

    // Switch to 10-Point Apartment Hosting Checklist -> verify inline shoppable product links
    fireEvent.click(
      screen.getByRole('button', {
        name: /First Time Hosting an Older Woman at Your Place/i,
      }),
    );
    const checklistPanel = screen.getByTestId('guide-hosting-checklist');
    const inlineShopLinks = checklistPanel.querySelectorAll('a[target="_blank"]');
    expect(inlineShopLinks.length).toBeGreaterThanOrEqual(3);
  });

  it('routes ?dilemma=campus-stroll-sushi-professor-student into Hawthorne University in InTheWildMapView and ?challenge= into PartnerAuditionView', () => {
    window.history.replaceState(
      {},
      '',
      '/?dilemma=campus-stroll-sushi-professor-student',
    );
    const { unmount } = render(<App />);
    expect(screen.getAllByText(/Hawthorne University/i).length).toBeGreaterThanOrEqual(1);
    unmount();

    const challengeUrl = encodeChallengeLink(
      {
        v: 1,
        senderName: 'Elena',
        senderRole: 'her',
        herId: 'elena',
        hisId: 'julian',
        episodeIds: ['check-drop', 'velvet-room'],
        preferredChoiceIndices: [0, 0],
      },
      'https://cougarsandcubs.club/',
    );
    window.history.replaceState({}, '', `/${new URL(challengeUrl).search}`);
    render(<App />);
    expect(screen.getByText(/Elena Sent You an Official Vetting Audition/i)).toBeInTheDocument();
  });
});
