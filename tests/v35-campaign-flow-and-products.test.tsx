import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { computeCampaignProgress } from '../src/components/CampaignCompassBar';
import { createInitialThread } from '../src/components/ChatsAndDatesView';
import { createDefaultWallet } from '../src/domain/economy';

describe('v35 Connected Dream Daddy Campaign Flow, Levels, 3-Date Hearts & Cub School Perk', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('computes Dream Daddy campaign levels (Lv.1 -> Lv.5), 3-Date hearts, and dynamic Next-Step guidance', () => {
    const emptyWallet = createDefaultWallet(new Date('2026-11-26T12:00:00Z'));

    const startProg = computeCampaignProgress({
      wallet: emptyWallet,
      threads: [],
      cubSchoolStars: 0,
      completedCameoCount: 0,
      role: 'her',
    });
    expect(startProg.level).toBe(1);
    expect(startProg.nextStep.targetTab).toBe('hinge');
    expect(startProg.etiquetteBonusActive).toBe(false);

    // Matching Julian in App DM points nextStep straight to vetting Julian in Chats & Dates
    const julianThread = createInitialThread('julian', 'hinge', 'Sharp architectural eye!');
    const dmProg = computeCampaignProgress({
      wallet: emptyWallet,
      threads: [julianThread],
      cubSchoolStars: 5,
      completedCameoCount: 1,
      role: 'her',
    });
    expect(dmProg.etiquetteBonusActive).toBe(true);
    expect(dmProg.nextStep.targetTab).toBe('chats');
    expect(dmProg.nextStep.leadId).toBe('julian');
    expect(dmProg.nextStep.ctaLabel).toMatch(/Julian/i);

    // Completing 3 S-Rank dates + dodging traps + Cub School stars advances player to Lv.4+
    const crownedMiles = {
      ...createInitialThread('miles', 'wild'),
      datesCompleted: 3,
      lastDateRank: 'S' as const,
    };
    const veteranWallet = {
      ...emptyWallet,
      discernmentXp: 75,
      conspiracyClues: ['c1', 'c2', 'c3'],
    };
    const highProg = computeCampaignProgress({
      wallet: veteranWallet,
      threads: [crownedMiles],
      cubSchoolStars: 10,
      completedCameoCount: 3,
      role: 'her',
    });
    expect(highProg.level).toBeGreaterThanOrEqual(4);
    expect(highProg.totalDatesCompleted).toBe(3);
    // 3 Conspiracy Clues assembled -> guides player to Table 9 Secret Finale!
    expect(highProg.nextStep.ctaLabel).toMatch(/Table 9/i);
  });

  it('pops a celebratory Hinge Match Splash Modal and hands off straight into Chats & Dates with 1 tap', () => {
    render(<App />);

    // Campaign Compass Bar is visible above the feed so players always see Level & Next Step
    expect(screen.getByTestId('campaign-compass-bar')).toBeTruthy();

    // Like Prompt 1 on Julian with an attuned high-EQ opener -> triggers instant match celebration modal!
    const likePromptBtns = screen.getAllByLabelText(/like prompt 1/i);
    fireEvent.click(likePromptBtns[0]);
    fireEvent.click(
      screen.getByRole('button', {
        name: /Translating "half seven" accurately/i,
      }),
    );

    const splash = screen.getByTestId('hinge-match-celebration');
    expect(splash.textContent).toMatch(/Julian/i);

    // Clicking primary "Text Julian Now" CTA hands off seamlessly into Chats & Dates!
    fireEvent.click(screen.getByRole('button', { name: /Text Julian Now/i }));
    expect(screen.getAllByText(/Hinge App DM/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('chat-beat-progress').textContent).toMatch(/Beat 1 of 6/i);
    expect(screen.getByTestId('lead-date-hearts-julian').textContent).toContain('♡♡♡');

    // Regression check: clicking Club Discord Lounge inside full <App /> (with selectedLeadId set) MUST switch to Discord!
    fireEvent.click(screen.getByRole('button', { name: /Club Discord Lounge/i }));
    expect(screen.getByTestId('discord-first-message')).toBeTruthy();
  });

  it('bridges In The Wild directly into iMessage AND connects Cub School Gold Stars (+8% Spark Perk) back to active matches', () => {
    render(<App />);

    // Jump to In The Wild -> Terminal B Arrivals -> unlock Miles -> click "Open iMessage with Miles Now"
    fireEvent.click(screen.getAllByRole('button', { name: /In The Wild/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /Terminal B Arrivals/i }));
    fireEvent.click(
      screen.getByRole('button', {
        name: /Hand over both bags with a slow smile/i,
      }),
    );

    const openMilesChatBtn = screen.getByRole('button', {
      name: /Open iMessage with Miles Now/i,
    });
    fireEvent.click(openMilesChatBtn);
    expect(screen.getAllByText(/Earned iMessage/i).length).toBeGreaterThanOrEqual(1);

    // Jump to Cub School, earn 4 Gold Stars to activate +8% Etiquette Spark Perk, then use 1-tap bridge back to Miles!
    fireEvent.click(screen.getAllByRole('button', { name: /Cub School|🎓 School/i })[0]);
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByTestId('gold-star-option'));
      fireEvent.click(screen.getByRole('button', { name: /Next Module/i }));
    }

    expect(screen.getByTestId('cub-school-perk-banner').textContent).toMatch(
      /\+8% Etiquette Spark Active/i,
    );

    const backToMatchBtn = screen.getByRole('button', {
      name: /Return to Active Match/i,
    });
    fireEvent.click(backToMatchBtn);
    expect(screen.getAllByText(/Miles/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('etiquette-perk-pill')).toBeTruthy();
  });
});
