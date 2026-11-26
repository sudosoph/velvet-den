import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { MONETIZATION_CONFIG } from '../src/config/monetization';
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
    expect(within(primaryNav).getByRole('button', { name: /📱 Hinge/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('button', { name: /🗺️ In The Wild/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('button', { name: /💬 Chats & Dates/i })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('button', { name: /🎓 Cub School/i })).toBeInTheDocument();

    // Visible Support This Project link + 3 Friday Hearts + 3 Cr starter balance
    const supportLinks = screen.getAllByRole('link', { name: /Support This Project/i });
    expect(supportLinks.length).toBeGreaterThanOrEqual(1);
    expect(supportLinks[0].getAttribute('href')).toBe(MONETIZATION_CONFIG.tipJarUrl);
    expect(screen.getByTestId('hud-friday-hearts').textContent).toContain('❤️❤️❤️');
    expect(screen.getByRole('button', { name: /\b3 Cr\b/i })).toBeInTheDocument();

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

    // Wallet remains strictly at 3 Cr (0 free credit inflation)
    expect(screen.getByRole('button', { name: /\b3 Cr\b/i })).toBeInTheDocument();
  });

  it('renders VelvetJournalView with hero photo, above-the-fold real product photography (zero SVG motif boxes), Text This Not That bubbles, Green/Red Flag cards, and inline checklist links', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Club Extras/i }));
    fireEvent.click(screen.getByRole('button', { name: /Guides & Zodiac/i }));

    // Hero editorial photo + above-the-fold shoppable strip with real ./images/products/*.jpg photos
    expect(screen.getByTestId('guide-hero-photo').getAttribute('src')).toMatch(
      /images\/(scenes|cast)\//,
    );
    const aboveFoldShop = screen.getByTestId('guide-above-fold-shop');
    const shopImgs = aboveFoldShop.querySelectorAll('img');
    expect(shopImgs.length).toBeGreaterThanOrEqual(2);
    expect(shopImgs[0].getAttribute('src')).toContain('/images/products/');
    expect(aboveFoldShop.querySelector('svg[viewBox="0 0 96 96"]')).toBeNull();

    // Text This, Not That callout + Green Flag vs Red Flag split card
    expect(screen.getByTestId('guide-text-this-not-that')).toBeInTheDocument();
    expect(screen.getByTestId('guide-green-red-flags')).toBeInTheDocument();

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
