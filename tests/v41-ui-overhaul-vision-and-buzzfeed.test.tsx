import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { ChatsAndDatesView } from '../src/components/ChatsAndDatesView';
import { CubSchoolView } from '../src/components/CubSchoolView';
import {
  RoastAndWingwomanModal,
  evaluateProfileTeardownLocally,
} from '../src/components/RoastAndWingwomanModal';
import { VelvetJournalView } from '../src/components/VelvetJournalView';
import { JOURNAL_ARTICLES } from '../src/data/journalArticles';
import { POP_CULTURE_TRIVIA } from '../src/data/popCultureTrivia';
import { createDefaultWallet, loadWallet, saveWallet } from '../src/domain/economy';
import { FIELD_GUIDE_ENTRIES } from '../src/domain/taxonomy';
import { AFFILIATE_CATALOG } from '../src/lib/affiliates';
import workerApp from '../worker/index';

describe('v41 Radix shadcn/ui Overhaul, AI Vision Profile Teardown, BuzzFeed Guides, Boy Toy Lore & Account Reset', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('wipes old matches, threads, and blocks via 1-click Reset Story (and /?reset=1) while preserving paid VIP', () => {
    const vipWallet = {
      ...createDefaultWallet(new Date('2026-11-28T12:00:00Z')),
      isVip: true,
      hasPatronBadge: true,
      discernmentXp: 95,
      claimedRewards: ['stripe_cs_live_vip999', 'school_homework_clear'],
      conspiracyClues: ['clue_1'],
    };
    saveWallet(vipWallet);
    window.localStorage.setItem(
      'velvet_sim_state_v35',
      JSON.stringify({
        threads: [
          {
            leadId: 'julian',
            originDoor: 'hinge',
            stage: 'imessage',
            currentBeat: 6,
            chemistry: 88,
            datesCompleted: 2,
            messages: [{ sender: 'match', text: 'See you Friday at 7:30.' }],
          },
        ],
        cutLooseIds: ['connor'],
        completedCameoVenues: ['velvet-room'],
        cubSchoolStars: 9,
      }),
    );

    render(<App />);

    // Active match shows before reset (default role is 'her', so Julian is visible)
    expect(screen.getByTestId('campaign-compass-bar').textContent).toMatch(/Julian/i);

    // Open Persona modal -> click Reset Story -> Confirm Wipe
    fireEvent.click(screen.getByRole('button', { name: /Persona & Account Reset/i }));
    fireEvent.click(screen.getByTestId('reset-story-progress-btn'));
    fireEvent.click(screen.getByTestId('confirm-reset-story-btn'));

    // Old threads and blocks are wiped, while VIP remains active
    const simAfter = JSON.parse(window.localStorage.getItem('velvet_sim_state_v35') || '{}');
    expect(simAfter.threads).toEqual([]);
    expect(simAfter.cutLooseIds).toEqual([]);
    const savedAfter = loadWallet();
    expect(savedAfter.isVip).toBe(true);
    expect(savedAfter.hasPatronBadge).toBe(true);
    expect(savedAfter.claimedRewards).toEqual(['stripe_cs_live_vip999']);
  });

  it('audits all 16 Club Guides for warm BuzzFeed ledes, insider callouts & story hooks BEFORE any sells', () => {
    expect(JOURNAL_ARTICLES).toHaveLength(16);

    let totalSections = 0;
    for (const article of JOURNAL_ARTICLES) {
      expect(article.buzzfeedLede).toHaveLength(2);
      expect(article.buzzfeedLede[0].length).toBeGreaterThan(75);
      expect(article.buzzfeedLede[1].length).toBeGreaterThan(75);
      expect(article.insiderCallout.length).toBeGreaterThan(40);
      expect(article.readTime.toLowerCase()).not.toContain('shoppable');

      for (const sec of article.sections) {
        totalSections += 1;
        expect((sec.storyHook || '').length).toBeGreaterThan(45);
      }
    }
    expect(totalSections).toBe(79);

    // Astrology guide has zero inline sells, and dilemma/texting guides never stuff every section
    const astroHit = JOURNAL_ARTICLES.find(
      (a) => a.slug === 'astrology-zodiac-compatibility-older-woman-younger-man',
    )!;
    expect(astroHit.sections.every((s) => !s.affiliateId)).toBe(true);

    const restrainedSlugs = [
      'older-woman-grown-son-same-age-meeting-parents-guide',
      'millennial-vs-gen-z-age-gap-dating-code-switching',
    ];
    for (const slug of restrainedSlugs) {
      const hit = JOURNAL_ARTICLES.find((a) => a.slug === slug)!;
      expect(hit.sections.filter((s) => Boolean(s.affiliateId)).length).toBeLessThanOrEqual(1);
    }

    render(
      <VelvetJournalView
        initialSlug="first-time-hosting-older-woman-apartment-checklist"
        onPlayScenario={vi.fn()}
      />,
    );

    const lede = screen.getByTestId('guide-buzzfeed-lede');
    expect(lede.textContent).toMatch(/Picture this: Friday drinks went electric/i);
    expect(document.body.textContent).not.toMatch(/Shoppable Photo Listicles/i);
    expect(document.body.textContent).not.toMatch(/Interactive 10-of-10 Visual Apartment Audit/i);

    // Ensure BuzzFeed storytelling lede appears in the DOM BEFORE the first Amazon product card
    const fullHtml = document.body.innerHTML;
    expect(fullHtml.indexOf('View on Amazon')).toBeGreaterThan(0);
    expect(fullHtml.indexOf('guide-buzzfeed-lede')).toBeLessThan(
      fullHtml.indexOf('View on Amazon'),
    );
  });

  it('weaves authentic "Boy Toy" lore across Field Guide, Pop-Culture Trivia, Certificates, and Profile Teardown', () => {
    const boyToyEntry = FIELD_GUIDE_ENTRIES.find((e) => e.id === 'trophy_boy_toy_lore');
    expect(boyToyEntry).toBeDefined();
    expect(boyToyEntry?.insiderLore).toMatch(/Boy Toy/i);

    const madonnaQ = POP_CULTURE_TRIVIA.find((q) => q.id === 'madonna-1984-boy-toy-belt-buckle');
    expect(madonnaQ).toBeDefined();
    expect(madonnaQ?.options[madonnaQ.correctIndex]).toMatch(/BOY TOY/i);

    const teardown = evaluateProfileTeardownLocally(
      '25M gym selfie • looking to be your new boy toy 😉',
      'him',
      1,
      140,
    );
    expect(teardown.score).toBeLessThanOrEqual(20);
    expect(teardown.clicheScan).toMatch(/Boy Toy/i);

    render(<CubSchoolView role="him" initialOpenCertificate={true} />);
    const sealSelect = screen.getByLabelText(/Select Certificate Seal/i) as HTMLSelectElement;
    expect(sealSelect.innerHTML).toMatch(/Trophy Boy Toy/i);
  });

  it('splits Outbound AI Vision Profile Teardown from Inbound Discord Text/ENM Vetting and serves POST /api/profile-teardown', async () => {
    const wallet = createDefaultWallet(new Date('2026-11-28T12:00:00Z'));
    render(
      <RoastAndWingwomanModal
        open={true}
        role="him"
        wallet={wallet}
        initialTool="profile_teardown"
        onClose={vi.fn()}
        onSpendCredit={() => true}
        onOpenVip={vi.fn()}
      />,
    );

    const modal = screen.getByTestId('roast-wingwoman-modal');
    // Clean 3 outbound tabs: zero muddled ENM tab inside Profile & Opener Roast
    expect(modal.textContent).toMatch(/AI Profile Teardown/i);
    expect(modal.textContent).toMatch(/Roast Opener/i);
    expect(modal.textContent).toMatch(/Rewrite Bio/i);
    expect(modal.textContent).not.toMatch(/ENM \/ Trap/i);

    // Upload a mock screenshot + paste bio -> run teardown
    const fileInput = within(modal).getByTestId('profile-teardown-file-input');
    const mockFile = new File([new Uint8Array([137, 80, 78, 71])], 'hinge-slide-1.png', {
      type: 'image/png',
    });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const textarea = within(modal).getByTestId('roast-studio-textarea');
    fireEvent.change(textarea, {
      target: {
        value: '28M architect, Sunday ragu from scratch, strong opinions on Fleetwood Mac.',
      },
    });
    fireEvent.click(within(modal).getByRole('button', { name: /Run Free Club Panel/i }));

    await waitFor(() => {
      expect(screen.getByTestId('profile-teardown-result')).toBeInTheDocument();
    });
    expect(screen.getByTestId('profile-teardown-result').textContent).toMatch(
      /91\s*\/\s*100|85\s*\/\s*100/,
    );

    // Verify Worker POST /api/profile-teardown endpoint responds cleanly
    const workerRes = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/profile-teardown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'him',
          promptsText: 'Looking to be a cougar boy toy on my bucket list!',
          imageCount: 1,
          imageStats: { avgBrightness: 70 },
        }),
      }),
      {},
    );
    expect(workerRes.status).toBe(200);
    const workerJson = (await workerRes.json()) as {
      score: number;
      photoAuditBullets: string[];
      promptRewrites: string[];
    };
    expect(workerJson.score).toBeLessThanOrEqual(20);
    expect(workerJson.photoAuditBullets).toHaveLength(3);
    expect(workerJson.promptRewrites).toHaveLength(3);

    // Verify Inbound Text / ENM Vetter lives inside Chats & Dates -> Club Discord Lounge
    render(
      <ChatsAndDatesView
        role="him"
        wallet={wallet}
        threads={[]}
        cutLooseIds={[]}
        onUpdateThread={vi.fn()}
        onSpendCredits={() => true}
        onUnlockBucketItem={() => true}
        onCutLooseTrap={vi.fn()}
        onConfirmCutGenuine={vi.fn()}
        onLoseHeart={vi.fn()}
        onOpenHinge={vi.fn()}
        onOpenBoutique={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Club Discord Lounge/i }));
    const discordVetter = screen.getByTestId('discord-inbound-vetter-bar');
    expect(discordVetter.textContent).toMatch(/Decode a real text or ENM/i);
    expect(discordVetter.textContent).toMatch(/Check Telegram DADT \/ ENM/i);
  });

  it('replaces all legacy 404 Amazon ASINs with verified live catalog ASINs across client & worker redirects', async () => {
    const deadAsins = new Set([
      'B0CR5Z1P4W',
      'B0CSX7L9V8',
      'B096TTBFYR',
      'B07N4M94X4',
      'B08N5M7S6K',
    ]);
    for (const item of AFFILIATE_CATALOG) {
      for (const dead of deadAsins) {
        expect(item.merchantUrl).not.toContain(dead);
      }
      const res = await workerApp.fetch(
        new Request(`https://cougarsandcubs.club/api/go/${item.id}`),
        {},
      );
      expect(res.status).toBe(302);
      const loc = res.headers.get('Location') || '';
      expect(loc).toContain('tag=cougarsandcub-20');
      for (const dead of deadAsins) {
        expect(loc).not.toContain(dead);
      }
    }
  });
});
