import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import {
  ChatsAndDatesView,
  createInitialThread,
} from '../src/components/ChatsAndDatesView';
import {
  CHECKLIST_DECK_BY_TAB,
  computeChecklistScore,
  CougarCubChecklistModal,
} from '../src/components/CougarCubChecklistModal';
import {
  buildTriviaSprintDeck,
  PopCultureTriviaModal,
  TRIVIA_SPRINT_SIZE,
} from '../src/components/PopCultureTriviaModal';
import { POP_CULTURE_TRIVIA } from '../src/data/popCultureTrivia';
import { V35_CAST_PROFILES } from '../src/data/v35Cast';
import { V35_CHAT_CHAPTERS } from '../src/data/v35ChatsAndDates';
import { createDefaultWallet } from '../src/domain/economy';
import { AFFILIATE_CATALOG } from '../src/lib/affiliates';
import workerApp from '../worker/index';

describe('v36 Playtest Overhaul: Gamification, Human Texts, 3-Tab Checklist, Sprint Trivia, Free Chat Photos & Amazon Compliance', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('renders the 4-Mode Home Onboarding Switcher and opens the 5-Level Club Passport Modal from the HUD pill', () => {
    render(<App />);

    const modeGrid = screen.getByTestId('club-onboarding-mode-grid');
    expect(modeGrid.textContent).toMatch(/Prowl & Offline Dates/i);
    expect(modeGrid.textContent).toMatch(/Have You Ever/i);
    expect(modeGrid.textContent).toMatch(/Pop-Culture Trivia/i);
    expect(modeGrid.textContent).toMatch(/Cub School & Courtroom/i);

    const passportPill = screen.getByTestId('hud-passport-pill');
    fireEvent.click(passportPill);

    const passportModal = screen.getByTestId('club-passport-modal');
    expect(passportModal.textContent).toMatch(/Club Passport/i);
    expect(passportModal.textContent).toMatch(/Lv\.5/i);
  });

  it('populates 132/132 non-empty Hinge slide captions and purges flat 2D bio-prop opening messages', () => {
    let totalSlides = 0;
    for (const profile of V35_CAST_PROFILES) {
      expect(profile.slides).toHaveLength(6);
      for (const slide of profile.slides) {
        totalSlides += 1;
        expect(slide.caption.trim().length).toBeGreaterThan(8);
      }

      if (profile.tier !== 'trap') {
        const beat1Opener = V35_CHAT_CHAPTERS[profile.id].tinder[0].incomingMessages[0];
        expect(beat1Opener).not.toMatch(
          /walnut sawdust|fabric samples|cardamom cold brew|sixty covers|34th floor|cedar ridge beam|contact sheets/i,
        );
      }
    }
    expect(totalSlides).toBe(132);
  });

  it('supports Trivia Category + Easy/Hard 8-question sprints and includes Nicole Scherzinger, Lewis Hamilton & Kim K questions', () => {
    const ids = new Set(POP_CULTURE_TRIVIA.map((q) => q.id));
    expect(ids.has('kim-kardashian-lewis-hamilton-2026')).toBe(true);
    expect(ids.has('nicole-scherzinger-athlete-streak')).toBe(true);
    expect(ids.has('nicole-scherzinger-sunset-blvd-tony')).toBe(true);

    for (const cat of [
      'all',
      'movies',
      'tv',
      'books',
      'music_celebs',
      'sports',
      'royals_history',
      'era_culture',
    ] as const) {
      const sprint = buildTriviaSprintDeck(cat, 'all', false);
      expect(sprint.length).toBe(TRIVIA_SPRINT_SIZE);
    }

    const easyBooks = buildTriviaSprintDeck('books', 'easy', false);
    expect(easyBooks.length).toBeGreaterThanOrEqual(5);

    render(
      <PopCultureTriviaModal
        open={true}
        onClose={() => {}}
        onEarnTriviaReward={() => false}
      />,
    );
    const dialog = screen.getByRole('dialog', { name: /Pop-Culture Cougar & Cub Trivia/i });
    expect(within(dialog).getByTestId('trivia-category-bar')).toBeTruthy();
    expect(within(dialog).getByTestId('trivia-difficulty-bar')).toBeTruthy();
    expect(dialog.textContent).toMatch(/Question 1 of 8/i);
  });

  it('renders 3 Checklist tabs (Cougars Only, Cubs Only, Couples Date-Night) each summing to 100 pts with a Score Diagnostic card', () => {
    for (const tab of ['cougars', 'cubs', 'couples'] as const) {
      const items = CHECKLIST_DECK_BY_TAB[tab];
      expect(items).toHaveLength(30);
      expect(computeChecklistScore(items.map((i) => i.id), items)).toBe(100);
    }

    render(
      <CougarCubChecklistModal
        open={true}
        onClose={() => {}}
        onClaimChecklistReward={() => false}
        onPlayMatchedScenario={() => {}}
      />,
    );

    const tabs = screen.getByTestId('checklist-role-tabs');
    fireEvent.click(within(tabs).getByRole('button', { name: /Cubs Only/i }));
    expect(screen.getByTestId('checklist-score-diagnostic').textContent).toMatch(
      /Day-One Cub Recruit/i,
    );

    fireEvent.click(within(tabs).getByRole('button', { name: /Couples Date-Night/i }));
    expect(screen.getByTestId('checklist-score-diagnostic').textContent).toMatch(
      /Fresh Date-Night Slate/i,
    );
  });

  it('displays chat photo drops unblurred for free (0 Cr), strips static $ prices from AFFILIATE_CATALOG, and accepts POST /api/community/submit', async () => {
    // 1. Zero static $ prices in AFFILIATE_CATALOG (Amazon Associates Operating Agreement compliance)
    for (const item of AFFILIATE_CATALOG) {
      expect(item.priceDisplay).not.toMatch(/\$\d/);
      expect(item.whyItConverts).not.toMatch(/\$\d/);
    }

    // 2. Beat 4 photoDrop renders completely unblurred with zero credit paywall
    const beat4Julian = {
      ...createInitialThread('julian', 'hinge'),
      currentBeat: 4, // Beat 4 (1-indexed) has photoDrop
    };
    const wallet = createDefaultWallet(new Date('2026-11-27T12:00:00Z'));
    const { container } = render(
      <ChatsAndDatesView
        role="her"
        wallet={wallet}
        threads={[beat4Julian]}
        selectedLeadId="julian"
        cutLooseIds={[]}
        onUpdateThread={() => {}}
        onSpendCredits={() => false}
        onUnlockBucketItem={() => false}
        onCutLooseTrap={() => {}}
        onConfirmCutGenuine={() => {}}
        onLoseHeart={() => {}}
        onOpenHinge={() => {}}
        onOpenBoutique={() => {}}
      />,
    );
    expect(screen.getByTestId('chat-photo-drop-card')).toBeInTheDocument();
    expect(container.querySelector('.blur-md')).toBeNull();
    expect(container.textContent).not.toMatch(/Unblur Portrait|Included Free/i);

    // 3. Strict opposite-role thread filtering: Prof. Elena (role='her') NEVER shows up when playing as Her!
    const elenaThread = createInitialThread('elena', 'wild');
    const julianThread = createInitialThread('julian', 'hinge');
    const { container: herView } = render(
      <ChatsAndDatesView
        role="her"
        wallet={wallet}
        threads={[elenaThread, julianThread]}
        selectedLeadId="elena"
        cutLooseIds={[]}
        onUpdateThread={() => {}}
        onSpendCredits={() => true}
        onUnlockBucketItem={() => true}
        onCutLooseTrap={() => {}}
        onConfirmCutGenuine={() => {}}
        onLoseHeart={() => {}}
        onOpenHinge={() => {}}
        onOpenBoutique={() => {}}
      />,
    );
    expect(herView.textContent).toContain('Julian');
    expect(herView.textContent).not.toContain('Elena, 44');

    // 4. Zero robotic "I have the frame" or "Private eyes only... wins the corner booth" in date/chat scripts
    const { V35_DATE_SCRIPTS } = await import('../src/data/v35ChatsAndDates');
    expect(JSON.stringify(V35_DATE_SCRIPTS)).not.toMatch(/I have the frame/i);
    expect(JSON.stringify(V35_CHAT_CHAPTERS)).not.toMatch(/Private eyes only|wins the corner booth/i);

    // 5. Worker POST /api/community/submit stores sanitized crowdsourced submissions
    const store = new Map<string, string>();
    const res = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/community/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surface: 'cub_school_her',
          roleTag: '44F • Denver',
          content: 'Wore a vintage 1996 tour shirt and admitted he thought it was a skate brand!',
        }),
      }),
      {
        VELVET_KV: {
          get: async (k) => store.get(k) ?? null,
          put: async (k, v) => {
            store.set(k, v);
          },
        },
      },
    );
    expect(res.status).toBe(200);
    const saved = JSON.parse(store.get('community:submissions:v1') || '[]');
    expect(saved).toHaveLength(1);
    expect(saved[0].surface).toBe('cub_school_her');
  });
});
