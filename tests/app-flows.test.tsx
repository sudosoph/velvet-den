import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { HER_ARCHETYPES, HIS_ARCHETYPES } from '../src/domain/taxonomy';
import { encodeChallengeLink } from '../src/lib/viral';

describe('Cougars & Cubs Club end-to-end UI, viral entry links, and dating-intent SEO journal', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('renders Pairing Mixer, toggles Her/Him role, and opens the Age-Gap Field Guide', () => {
    render(<App />);
    expect(screen.getAllByText(/Cougars & Cubs Club/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Play as Him/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Play as Him/i }));
    expect(screen.getByText(/Impress & Commit/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Field Guide/i }));
    expect(screen.getByRole('dialog', { name: /Age-Gap Dating Field Guide/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Mountain Lion \/ Silver Fox/i).length).toBeGreaterThanOrEqual(1);
  });

  it('launches Act I App Swipe deck with AGE: 26 shock zoom and Photo 2 Tito’s bottle trap', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start Vetting/i }));

    // Connor 26 profile is first
    expect(screen.getByText(/Connor/i)).toBeInTheDocument();
    expect(screen.getByText(/Short-term, open to long/i)).toBeInTheDocument();

    // Trigger dramatic AGE: 26 zoom
    fireEvent.click(screen.getByRole('button', { name: /Zoom Age: 26/i }));
    expect(screen.getByText(/trading Pokémon cards/i)).toBeInTheDocument();

    // Flip to Photo 2 to reveal the liquor bottle trap
    fireEvent.click(screen.getByRole('button', { name: /Photo 2/i }));
    expect(screen.getByText(/handle of Tito’s/i)).toBeInTheDocument();
  });

  it('routes valid ?challenge= links into the 2-Player Partner Audition and recovers gracefully on corrupted links', () => {
    const validLink = encodeChallengeLink(
      {
        v: 1,
        senderName: 'Chloé 🐆',
        senderRole: 'her',
        herId: HER_ARCHETYPES[1].id,
        hisId: HIS_ARCHETYPES[0].id,
        episodeIds: ['check-drop', 'waiter-son-incident'],
        preferredChoiceIndices: [0, 0],
      },
      'https://sudosoph.github.io/velvet-den/',
    );
    const search = new URL(validLink).search;
    window.history.replaceState({}, '', `/${search}`);

    const { unmount } = render(<App />);
    expect(screen.getByText(/Chloé 🐆 Sent You an Official Vetting Audition/i)).toBeInTheDocument();
    unmount();

    // Corrupted link shows friendly fallback notice and lands safely on Pairing Mixer
    window.history.replaceState({}, '', '/?challenge=%%%bad-link');
    render(<App />);
    expect(screen.getByText(/audition link looked truncated/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Vetting/i })).toBeInTheDocument();
  });

  it('renders dating-intent SEO guides in The Velvet Journal with FTC affiliate disclosure', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Dating Guides/i }));

    expect(
      screen.getByRole('heading', {
        name: /Cougar vs\. Puma vs\. Jaguar Age Chart: Older Woman Dating Younger Man Guide/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/affiliate commission/i)).toBeInTheDocument();
  });
});
