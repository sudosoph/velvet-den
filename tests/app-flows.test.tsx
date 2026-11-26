import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { HER_ARCHETYPES, HIS_ARCHETYPES } from '../src/domain/taxonomy';
import { encodeChallengeLink } from '../src/lib/viral';

describe('Cougars & Cubs Club v34 Option A Desktop Phone Landing, 3-Zone Nav, About Page & Interactive Guides', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('renders Option A Desktop Phone Simulator with restored hero slogan, 6-photo Hinge vitals, IT’S A MATCH splash, and 3-Zone TopHudBar + About page', () => {
    render(<App />);

    // Restored hero slogan + zero "Draft " or "Viral IRL" self-labels
    expect(
      screen.getByText(/Lower Your Age Slider\. Vet the Red Flags\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Win Real Love\./i)).toBeInTheDocument();
    expect(document.body.textContent || '').not.toMatch(/Draft Your Roster|Viral IRL/i);

    // Balanced 3-zone TopHudBar actions
    expect(screen.getByRole('button', { name: /^Swipe$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Chats$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Club Map$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Obedience$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^About$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Shop$/i })).toBeInTheDocument();

    // Option A Desktop Phone Simulator shows scrollable 6-slide Hinge profile vitals + aspect-[3/4] portrait
    const phoneSim = screen.getByTestId('desktop-phone-simulator');
    expect(within(phoneSim).getByText(/6\/6 Verified Slides|Slide 1 of 6/i)).toBeInTheDocument();
    expect(within(phoneSim).getByText(/School & Major/i)).toBeInTheDocument();
    expect(within(phoneSim).getByText(/Work & Field/i)).toBeInTheDocument();
    expect(phoneSim.querySelector('.aspect-\\[3\\/4\\]')).not.toBeNull();
    expect(phoneSim.querySelector('.aspect-\\[3\\/4\\] img')?.getAttribute('src')).toMatch(
      /\.\/images\//,
    );

    // Send to Bestie opens multi-app SocialShareSheetModal
    fireEvent.click(within(phoneSim).getByRole('button', { name: /Send to Bestie/i }));
    expect(screen.getByRole('button', { name: /iMessage \/ SMS/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Instagram/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Close share sheet/i }));

    // Liking inside the Phone Simulator triggers IT'S A MATCH! celebration and adds to Earned Matches
    fireEvent.click(within(phoneSim).getByRole('button', { name: /Match on Phone/i }));
    expect(screen.getByText(/IT'S A MATCH!/i)).toBeInTheDocument();

    // Clicking About in TopHudBar opens dedicated AboutClubView
    fireEvent.click(screen.getByRole('button', { name: /^About$/i }));
    expect(
      screen.getByRole('heading', { name: /What Is Cougars & Cubs Club\?/i }),
    ).toBeInTheDocument();

    // Opening Lore & Quizzes menu opens Field Guide
    fireEvent.click(screen.getByRole('button', { name: /Lore & Quizzes/i }));
    fireEvent.click(screen.getByRole('button', { name: /Field Guide/i }));
    expect(screen.getByRole('dialog', { name: /Age-Gap Dating Field Guide/i })).toBeInTheDocument();
  });

  it('launches Act I Trap-Detection Swipe Deck with AGE: 26 shock zoom, Photo 2 Tito’s bottle trap, and zero early red-flag spoiler toast', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start Vetting/i }));

    // Connor 26 profile is first with 6 slides and aspect-[3/4] zero-crop framing
    expect(screen.getByText(/Connor/i)).toBeInTheDocument();
    expect(screen.getByText(/Short-term, open to long/i)).toBeInTheDocument();

    // Trigger dramatic AGE: 26 zoom
    fireEvent.click(screen.getByRole('button', { name: /Zoom Age: 26/i }));
    expect(screen.getByText(/Flip through all six photos/i)).toBeInTheDocument();

    // Flip to Photo 2 to reveal the liquor bottle trap
    fireEvent.click(screen.getByRole('button', { name: /2 AM Mirror/i }));
    expect(screen.getByText(/handle of Tito’s/i)).toBeInTheDocument();

    // Swiping right on a trap does NOT spoil "had hidden red flags" upfront
    fireEvent.click(screen.getByRole('button', { name: /Swipe Right \(Date\)/i }));
    expect(document.body.textContent || '').not.toContain('had hidden red flags');
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
      'https://cougarsandcubs.club/',
    );
    const search = new URL(validLink).search;
    window.history.replaceState({}, '', `/${search}`);

    const { unmount } = render(<App />);
    expect(screen.getByText(/Chloé 🐆 Sent You an Official Vetting Audition/i)).toBeInTheDocument();
    unmount();

    window.history.replaceState({}, '', '/?challenge=%%%bad-link');
    render(<App />);
    expect(screen.getByText(/audition link looked truncated/i)).toBeInTheDocument();
    expect(screen.getByTestId('desktop-phone-simulator')).toBeInTheDocument();
  });

  it('renders complete interactive Club Guides with 10-point Hosting checkboxes and 12×12 Zodiac Matcher', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Lore & Quizzes/i }));
    fireEvent.click(screen.getByRole('button', { name: /Club Guides & 12-Sign Matcher/i }));

    expect(
      screen.getByRole('heading', {
        name: /Cougar vs\. Puma vs\. Jaguar Age Chart: Older Woman Dating Younger Man Guide/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/affiliate commission/i)).toBeInTheDocument();

    // Switch to 10-Point Hosting Checklist guide -> verify interactive checkboxes
    fireEvent.click(
      screen.getByRole('button', {
        name: /First Time Hosting an Older Woman at Your Place/i,
      }),
    );
    expect(screen.getByText(/0\/10 Ready/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Bathroom Trash Can With a Closed Lid/i }));
    expect(screen.getByText(/1\/10 Ready/i)).toBeInTheDocument();

    // Switch to Astrology guide -> verify interactive 12-Sign Her x Him Matcher
    fireEvent.click(
      screen.getByRole('button', {
        name: /Zodiac & Star-Sign Compatibility/i,
      }),
    );
    expect(screen.getByTestId('zodiac-12x12-matcher')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Her Star Sign/i), { target: { value: 'leo' } });
    fireEvent.change(screen.getByLabelText(/His Star Sign/i), { target: { value: 'gemini' } });
    expect(screen.getByText(/♌ Leo Her × ♊ Gemini Cub/i)).toBeInTheDocument();
  });
});
