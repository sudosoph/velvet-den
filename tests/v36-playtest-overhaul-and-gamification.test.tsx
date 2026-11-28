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

  it('delivers 3-Signal Room Scanner & 20/20 bespoke intention-reading scenes in In The Wild, plus clean Funny & Cute Shop filtering', async () => {
    const { getWildFollowUpSequence, getWildRoomClues, V35_WILD_VENUES } = await import(
      '../src/data/v35WildVenues'
    );
    const { InTheWildMapView } = await import('../src/components/InTheWildMapView');
    const { BoutiqueAndVipModal } = await import('../src/components/BoutiqueAndVipModal');

    // Every single venue × role has 3 bespoke Room Scanner clues & bespoke Beat 2/3 intention-reading scenes
    const promptsSeen = new Set<string>();
    for (const venue of V35_WILD_VENUES) {
      for (const role of ['her', 'him'] as const) {
        const clues = getWildRoomClues(venue.id, role);
        expect(clues).toHaveLength(3);
        const seq = getWildFollowUpSequence(venue.id, role, 'Lead');
        promptsSeen.add(`${role}:${seq.beat2.prompt}`);
      }
    }
    expect(promptsSeen.size).toBe(20);

    render(
      <InTheWildMapView
        role="her"
        activeLeadThreads={[]}
        completedCameoVenues={[]}
        initialVenueId="velvet-room"
        onUnlockWildLead={() => {}}
        onCompleteCameo={() => {}}
      />,
    );

    const scanner = screen.getByTestId('wild-room-scanner');
    expect(scanner.textContent).toMatch(/Decipher Intentions/i);
    fireEvent.click(within(scanner).getByRole('button', { name: /Eye Contact/i }));
    expect(scanner.textContent).toMatch(/1\/3 Signals Read/i);

    // Shop includes Funny & Cute filter and zero "Big Carl" / "Jules Cobb" reference
    const wallet = createDefaultWallet(new Date('2026-11-27T12:00:00Z'));
    render(
      <BoutiqueAndVipModal
        open={true}
        initialSection="shop"
        wallet={wallet}
        onClose={() => {}}
        onRedeemCode={() => false}
        onSandboxGrantCredits={() => {}}
        onSandboxUnlockVip={() => {}}
        onClaimNewsletterBonus={() => false}
      />,
    );

    const shopDialog = screen.getByRole('dialog', {
      name: /Cougars & Cubs Club VIP & Creator Lounge/i,
    });
    expect(shopDialog.textContent).not.toMatch(/Big Carl|Jules Cobb/i);
    const funnyFilter = within(shopDialog).getByRole('button', { name: /Funny & Cute/i });
    fireEvent.click(funnyFilter);
    expect(shopDialog.textContent).toMatch(/Full-Bottle Patio Goblet/i);
  });

  it('delivers Hit Dating-Sim Upgrades: Live iOS Push Banner, 2-Player & Solo Blind Sync, Date Table/Thermostat Rituals, Emily Draft Hesitation & Sunset Hills Sightings', async () => {
    const { LiveIncomingTextBanner, getSpontaneousPingForLead } = await import(
      '../src/components/LiveIncomingTextBanner'
    );
    const { CouplesBlindSyncModal, computeBlindSyncResult } = await import(
      '../src/components/CouplesBlindSyncModal'
    );
    const { RomanticDateStage } = await import('../src/components/RomanticDateStage');
    const { getEmilyDraftHesitation } = await import('../src/components/ChatsAndDatesView');

    // 1. Emily-is-Away draft hesitation covers Trap tells, Bold moves, and pivotal beats
    expect(getEmilyDraftHesitation(4, 'her', true, false)).toMatch(/waiting at home/i);
    expect(getEmilyDraftHesitation(2, 'him', false, true)).toMatch(/eager kid/i);
    expect(getEmilyDraftHesitation(3, 'her', false, false)).toMatch(/age gap/i);

    // 2. Live Incoming iOS Push Banner renders spontaneous persona ping & routes on click
    const julianThread = createInitialThread('julian', 'wild', undefined, false, 'left-bank-books');
    const milesThread = createInitialThread('miles', 'hinge');
    let openedLead = '';
    render(
      <LiveIncomingTextBanner
        activeThreads={[julianThread]}
        activeTab="hinge"
        anyModalOpen={false}
        forcePreviewLeadId="julian"
        onOpenBannerLead={(id) => {
          openedLead = id;
        }}
      />,
    );
    const banner = screen.getByTestId('live-incoming-text-banner');
    expect(banner.textContent).toContain(getSpontaneousPingForLead('julian'));
    fireEvent.click(within(banner).getByRole('button', { name: /Julian/i }));
    expect(openedLead).toBe('julian');

    // 3. Small-Town Sunset Hills Cross-Character Sighting appears when juggling 2+ active matches
    const wallet = createDefaultWallet(new Date('2026-11-27T12:00:00Z'));
    render(
      <ChatsAndDatesView
        role="her"
        wallet={wallet}
        threads={[julianThread, milesThread]}
        selectedLeadId="julian"
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
    const crossover = screen.getByTestId('sunset-hills-crossover-banner');
    expect(crossover.textContent).toContain('Julian');
    expect(crossover.textContent).toContain('Miles');

    // 4. Tactile Date-Night Thermostat Ritual on Date #3 applies +8 chemistry bonus
    render(
      <RomanticDateStage
        leadId="julian"
        dateNumber={3}
        role="her"
        wallet={wallet}
        onCompleteDate={() => {}}
        onLoseHeart={() => {}}
        onSpendCredits={() => true}
        onUnlockPov={() => true}
        onUnlockEpilogue={() => true}
        onBackToChats={() => {}}
      />,
    );
    const ritual = screen.getByTestId('date-table-ritual');
    expect(ritual.textContent).toMatch(/Sleepover Sanctuary Dial/i);
    fireEvent.click(within(ritual).getByRole('button', { name: /Set 63°F/i }));
    expect(ritual.textContent).toMatch(/\+8 ♥ Applied/i);

    // 5. 2-Player Pass-the-Phone Blind Sync & Sync Math
    expect(computeBlindSyncResult([0, 1, 0, 2, 1], [0, 1, 0, 2, 1]).syncPercent).toBe(100);
    render(<CouplesBlindSyncModal open={true} onClose={() => {}} />);
    const syncModal = screen.getByTestId('couples-blind-sync-modal');
    for (let i = 0; i < 5; i += 1) {
      fireEvent.click(within(syncModal).getByTestId('blind-sync-opt-0'));
    }
    expect(screen.getByTestId('blind-sync-handoff').textContent).toMatch(
      /Hand the Phone to Partner B/i,
    );
    fireEvent.click(
      within(syncModal).getByRole('button', { name: /Start Partner B’s Turn/i }),
    );
    for (let i = 0; i < 5; i += 1) {
      fireEvent.click(within(syncModal).getByTestId('blind-sync-opt-0'));
    }
    expect(screen.getByTestId('blind-sync-result-card').textContent).toMatch(/100%/);
  });

  it('ships Roast My Opener Lab (2 free -> 1 Cr), Midnight After-Dark gate (2 free -> 1 Cr), Async Sync links, Profile Micro-Polls, 10 Cougar Cases, 16-Guide Grid & Edge Cookie Guard', async () => {
    const { RoastAndWingwomanModal, evaluateRoastLocally } = await import(
      '../src/components/RoastAndWingwomanModal'
    );
    const { encodeBlindSyncChallenge, decodeBlindSyncChallenge } = await import(
      '../src/components/CouplesBlindSyncModal'
    );
    const { SEED_COURTROOM_STORIES } = await import('../src/components/ClubCourtroomView');
    const { VelvetJournalView } = await import('../src/components/VelvetJournalView');

    // 1. Roast My Opener Lab scores "for ur age / snap" cringe low and gates cleanly after 2 free runs
    const cringe = evaluateRoastLocally(
      'roast_opener',
      'u look crazy good for ur age whats ur snap??',
      'him',
    );
    expect(cringe.score).toBeLessThan(20);
    expect(cringe.upgradedRewrite.length).toBeGreaterThan(20);

    let spentCount = 0;
    const wallet = createDefaultWallet(new Date('2026-11-27T12:00:00Z'));
    render(
      <RoastAndWingwomanModal
        open={true}
        role="him"
        wallet={wallet}
        onClose={() => {}}
        onSpendCredit={() => {
          spentCount += 1;
          return true;
        }}
        onOpenVip={() => {}}
      />,
    );
    const roastModal = screen.getByTestId('roast-wingwoman-modal');
    expect(roastModal.textContent).toMatch(/2\/2 Free Runs Left/i);

    const textarea = within(roastModal).getByPlaceholderText(/Paste your real opener/i);
    fireEvent.change(textarea, { target: { value: 'hey beautiful whats ur snap' } });
    fireEvent.click(within(roastModal).getByRole('button', { name: /Run Free Club Panel/i }));
    expect(screen.getByTestId('roast-utility-result').textContent).toMatch(/10\/10 Ready-to-Send/i);
    expect(spentCount).toBe(0);

    fireEvent.click(within(roastModal).getByRole('button', { name: /Run Free Club Panel/i }));
    expect(spentCount).toBe(0);

    // 3rd run requires 1 Cr
    fireEvent.click(within(roastModal).getByRole('button', { name: /Run Club Panel \(1 Cr\)/i }));
    expect(spentCount).toBe(1);

    // 2. Worker POST /api/roast-utility & POST /api/starter-check (Cookie-Farm Guard)
    const kv = new Map<string, string>();
    const kvEnv = {
      VELVET_KV: {
        get: async (k: string) => kv.get(k) ?? null,
        put: async (k: string, v: string) => {
          kv.set(k, v);
        },
      },
    };
    const starter1 = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/starter-check', {
        method: 'POST',
        headers: { 'CF-Connecting-IP': '203.0.113.42', 'User-Agent': 'Mozilla/5.0 Test' },
      }),
      kvEnv,
    );
    expect(((await starter1.json()) as { starterAllowed: boolean }).starterAllowed).toBe(true);

    const starter2 = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/starter-check', {
        method: 'POST',
        headers: { 'CF-Connecting-IP': '203.0.113.42', 'User-Agent': 'Mozilla/5.0 Test' },
      }),
      kvEnv,
    );
    expect(((await starter2.json()) as { starterAllowed: boolean }).starterAllowed).toBe(false);

    const roastApi = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/roast-utility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'roast_opener',
          role: 'him',
          input: 'u look amazing for ur age whats ur snap',
        }),
      }),
      kvEnv,
    );
    expect(roastApi.status).toBe(200);
    const roastJson = (await roastApi.json()) as { score: number };
    expect(roastJson.score).toBeLessThan(30);

    // 3. Midnight After-Dark Mode turns iMessage dark & gates cleanly after 2 free teases
    window.localStorage.setItem('cc_after_dark_free_v1', '2');
    const julianImessage = createInitialThread('julian', 'wild', undefined, false, 'left-bank-books');
    render(
      <ChatsAndDatesView
        role="her"
        wallet={wallet}
        threads={[julianImessage]}
        selectedLeadId="julian"
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
    const stageShell = screen.getByTestId('chat-stage-imessage');
    fireEvent.click(within(stageShell).getByRole('button', { name: /After-Dark Mode/i }));
    expect(stageShell.className).toContain('bg-zinc-950');
    expect(screen.getByTestId('after-dark-unlock-gate').textContent).toMatch(
      /Unlock Julian After-Dark \(1 Cr\)/i,
    );

    // 4. Async Blind Sync URL encoding + 10 Cougar Cases + 2026 Trivia + All-16 Guide Grid Toggle
    const encoded = encodeBlindSyncChallenge([2, 1, 0, 2, 1], 'Claire');
    const decoded = decodeBlindSyncChallenge(encoded);
    expect(decoded?.answers).toEqual([2, 1, 0, 2, 1]);
    expect(decoded?.senderName).toBe('Claire');

    const cougarCases = SEED_COURTROOM_STORIES.filter((s) => s.subject === 'her');
    expect(cougarCases.length).toBeGreaterThanOrEqual(10);

    const triviaIds = new Set(POP_CULTURE_TRIVIA.map((q) => q.id));
    expect(triviaIds.has('jessica-alba-danny-ramirez-cabo')).toBe(true);
    expect(triviaIds.has('natalie-portman-good-sex-romcom')).toBe(true);

    render(<VelvetJournalView onPlayScenario={() => {}} />);
    const gridBtn = screen.getByTestId('toggle-all-guides-grid');
    expect(gridBtn.textContent).toMatch(/Collapse Grid/i);
    fireEvent.click(gridBtn);
    expect(gridBtn.textContent).toMatch(/View All 16 Guides/i);
  });
});
