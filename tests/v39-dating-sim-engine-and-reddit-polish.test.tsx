import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import {
  ChatsAndDatesView,
  createInitialThread,
} from '../src/components/ChatsAndDatesView';
import { RoastAndWingwomanModal } from '../src/components/RoastAndWingwomanModal';
import { V35_CAST_PROFILES } from '../src/data/v35Cast';
import {
  computeRelationshipStepper,
  computeVettingRadarStatus,
  PHONE_A_FRIEND_INTEL_BY_LEAD,
} from '../src/data/v39DatingSimEngine';
import { createDefaultWallet } from '../src/domain/economy';
import { CLUB_PASSPORT_LEVELS } from '../src/lib/gamification';

describe('v39 Hit Dating-Sim Engine: Clear 5-Rank Ladder, 5-Stage Relationship Track, Dual Spark/Flag Radar, Phone-a-Friend Discord Lifeline & Reddit Subculture Polish', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('displays Rank X/5 clearly in the HUD, unifies 5-Rank XP thresholds, and shows Season Victory Goals in the Club Passport', () => {
    expect(CLUB_PASSPORT_LEVELS.map((l) => l.minXp)).toEqual([0, 40, 100, 180, 280]);

    render(<App />);

    const passportPill = screen.getByTestId('hud-passport-pill');
    expect(passportPill.textContent).toContain('Rank 1/5');

    const seasonGoalPill = screen.getByTestId('hud-season-goal-pill');
    expect(seasonGoalPill.textContent).toContain('Dates 0/3');
    expect(seasonGoalPill.textContent).toContain('Traps 0/3');

    fireEvent.click(passportPill);
    const modal = screen.getByTestId('club-passport-modal');
    expect(modal.textContent).toContain('Season Goals · How to Beat the Game');
    expect(modal.textContent).toContain('Grants +1 Free Club Credit automatically');
  });

  it('equips all 22 cast leads with bespoke Phone-a-Friend Discord regular intel and distinguishes Traps from Keepers', () => {
    expect(Object.keys(PHONE_A_FRIEND_INTEL_BY_LEAD).sort()).toEqual(
      V35_CAST_PROFILES.map((p) => p.id).sort(),
    );

    // Beat 1 starts un-spoiled on both Trap and Keeper
    expect(
      computeVettingRadarStatus({
        isActualTrap: true,
        currentBeat: 1,
        stage: 'app_dm',
        datesCompleted: 0,
        hasTrapBeatHint: false,
        inspectedPhotoClue: false,
        recoveredUnsentSlip: false,
        phoneAFriendChecked: false,
      }).state,
    ).toBe('unvetted');

    // Phone-a-Friend or Beat 4+ exposes Trap vs. verifies Keeper
    expect(
      computeVettingRadarStatus({
        isActualTrap: true,
        currentBeat: 2,
        stage: 'app_dm',
        datesCompleted: 0,
        hasTrapBeatHint: false,
        inspectedPhotoClue: false,
        recoveredUnsentSlip: false,
        phoneAFriendChecked: true,
      }).state,
    ).toBe('confirmed_trap');

    expect(
      computeVettingRadarStatus({
        isActualTrap: false,
        currentBeat: 2,
        stage: 'app_dm',
        datesCompleted: 0,
        hasTrapBeatHint: false,
        inspectedPhotoClue: false,
        recoveredUnsentSlip: false,
        phoneAFriendChecked: true,
      }).state,
    ).toBe('verified_keeper');

    const steps = computeRelationshipStepper({
      stage: 'imessage',
      currentBeat: 3,
      chemistry: 82,
      datesCompleted: 2,
      lastDateRank: 'S',
    });
    expect(steps.map((s) => s.status)).toEqual(['done', 'done', 'done', 'active', 'upcoming']);
  });

  it('renders the 5-Step Relationship Stepper, Dual Meters, Per-Turn Reaction Banner, and live Phone-a-Friend Discord handoff + Trap Block', () => {
    const wallet = createDefaultWallet();
    const onCutLooseTrap = vi.fn();
    let threadState = createInitialThread('graham', 'hinge', 'Quick drink Thursday?');

    const { rerender } = render(
      <ChatsAndDatesView
        role="her"
        wallet={wallet}
        threads={[threadState]}
        selectedLeadId="graham"
        cutLooseIds={[]}
        onUpdateThread={(next) => {
          threadState = next;
        }}
        onSpendCredits={() => true}
        onUnlockBucketItem={() => true}
        onCutLooseTrap={onCutLooseTrap}
        onConfirmCutGenuine={() => {}}
        onLoseHeart={() => {}}
        onOpenHinge={() => {}}
        onOpenBoutique={() => {}}
      />,
    );

    // 1. 5-Stage Stepper & Dual Meters visible immediately
    expect(screen.getByTestId('relationship-stage-stepper').textContent).toContain('1. Match ✓');
    expect(screen.getByTestId('relationship-stage-stepper').textContent).toContain(
      '2. Vibe Check (1/6)',
    );
    expect(screen.getByTestId('dual-dating-sim-meters').textContent).toContain(
      'Chemistry Spark:',
    );
    expect(screen.getByTestId('vetting-flag-radar').textContent).toContain(
      'Vetting In Progress',
    );

    // 2. Pick a Beat 1 reply -> triggers unmistakable Per-Turn Hit-Sim Feedback Banner
    const firstSuggestion = screen.getAllByTestId('chat-suggestion-btn')[0];
    fireEvent.click(firstSuggestion);
    rerender(
      <ChatsAndDatesView
        role="her"
        wallet={wallet}
        threads={[threadState]}
        selectedLeadId="graham"
        cutLooseIds={[]}
        onUpdateThread={(next) => {
          threadState = next;
        }}
        onSpendCredits={() => true}
        onUnlockBucketItem={() => true}
        onCutLooseTrap={onCutLooseTrap}
        onConfirmCutGenuine={() => {}}
        onLoseHeart={() => {}}
        onOpenHinge={() => {}}
        onOpenBoutique={() => {}}
      />,
    );
    expect(screen.getByTestId('chat-turn-feedback-banner').textContent).toMatch(/Spark/i);

    // 3. Tap Phone-a-Friend (Discord) -> routes to #red-flag-emergency with Priya & Claire's tea on Graham + 1-tap Block!
    fireEvent.click(screen.getByTestId('phone-a-friend-discord-btn'));
    expect(screen.getByTestId('discord-return-to-match-bar').textContent).toContain(
      'MARRIED 6:45 CURFEW TRAP',
    );
    expect(screen.getByTestId('discord-message-feed').textContent).toContain(
      'Montecito soccer-carpool curfew',
    );

    fireEvent.click(screen.getByTestId('discord-instant-block-trap-btn'));
    expect(onCutLooseTrap).toHaveBeenCalledWith('graham', expect.any(String));
  });

  it('cycles recognizable subreddit insider field notes on Prowl and supports 1-tap Reddit markdown copy in Archetype & Roast Lab', () => {
    const { unmount } = render(<App />);

    const noteBar = screen.getByTestId('subreddit-field-note-bar');
    expect(noteBar.textContent).toContain('r/CougarsAndCubs Rule #1');
    fireEvent.click(screen.getByTestId('next-subreddit-note-btn'));
    expect(screen.getByTestId('subreddit-field-note-bar').textContent).toContain(
      'Gen-X iMessage Decoder',
    );

    // Archetype run exposes Copy Reddit Flair button
    fireEvent.click(screen.getByTestId('open-archetype-prom-pill'));
    for (let i = 0; i < 5; i += 1) {
      fireEvent.click(screen.getByTestId('prom-choice-0'));
    }
    expect(screen.getByTestId('copy-reddit-archetype-btn')).toBeInTheDocument();
    unmount();

    // Roast Lab exposes Copy for Reddit button
    render(
      <RoastAndWingwomanModal
        open={true}
        role="him"
        wallet={createDefaultWallet()}
        initialTool="roast_opener"
        initialPrefillText="You look amazing for your age, got snap?"
        onClose={() => {}}
        onSpendCredit={() => true}
        onOpenVip={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Run Free Club Panel/i }));
    expect(screen.getByTestId('copy-reddit-roast-btn')).toBeInTheDocument();
  });
});
