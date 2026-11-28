import fs from 'node:fs';
import path from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { BoutiqueAndVipModal } from '../src/components/BoutiqueAndVipModal';
import {
  ChatsAndDatesView,
  createInitialThread,
  getEmilyDraftHesitation,
} from '../src/components/ChatsAndDatesView';
import { SEED_COURTROOM_STORIES } from '../src/components/ClubCourtroomView';
import { evaluateRoastLocally } from '../src/components/RoastAndWingwomanModal';
import { V35_DISCORD_CHANNELS } from '../src/data/v35ChatsAndDates';
import { createDefaultWallet } from '../src/domain/economy';
import { AFFILIATE_CATALOG } from '../src/lib/affiliates';
import { downloadReceiptPng } from '../src/lib/receiptCanvas';
import worker from '../worker/index';

describe('v38 ENM/Poly Radar, Monster Prom 4-Stat Archetype Run, Thermal Receipts, iOS Unsent Slips, 39-Pick Shop & Dynamic /api/og', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('expands the Date-Night Shop to 39 verified Amazon ASINs with real studio JPEGs and updates the 3 VIP tiers', async () => {
    expect(AFFILIATE_CATALOG).toHaveLength(39);

    const newIds = [
      'all-fours-book',
      'ethical-slut-enm-guide',
      'rumours-vinyl',
      'warm-amber-table-lamp',
      'bedside-braided-charger-duo',
      'pineapple-upside-down-cocktail-pins',
    ];

    for (const id of newIds) {
      const product = AFFILIATE_CATALOG.find((p) => p.id === id);
      expect(product, `Missing ${id} in AFFILIATE_CATALOG`).toBeDefined();
      expect(product!.merchantUrl).toMatch(/^https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}$/);
      const diskPath = path.resolve(process.cwd(), 'public', `images/products/${id}.jpg`);
      expect(fs.existsSync(diskPath)).toBe(true);
      expect(fs.statSync(diskPath).size).toBeGreaterThan(100_000);

      const goRes = await worker.fetch(
        new Request(`https://cougarsandcubs.club/api/go/${id}?src=v38_test`),
        { AMAZON_ASSOCIATE_TAG: 'cougarsandcub-20' },
      );
      expect(goRes.status).toBe(302);
      expect(goRes.headers.get('Location')).toContain('tag=cougarsandcub-20');
    }

    const wallet = createDefaultWallet();
    render(
      <BoutiqueAndVipModal
        open={true}
        wallet={wallet}
        initialSection="vip"
        onClose={() => {}}
        onRedeemCode={() => false}
        onSandboxGrantCredits={() => {}}
        onSandboxUnlockVip={() => {}}
        onClaimNewsletterBonus={() => false}
      />,
    );

    expect(screen.getByRole('button', { name: /Date-Night Shop \(39\)/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Roast My Opener, Subtext & ENM Trap Lab/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/All 22/i)).toBeInTheDocument();
  });

  it('plays the 60s Monster Prom 4-Stat Archetype Run, renders a crumpled Thermal Receipt, and keeps Primary + Mobile Bottom Nav clean', () => {
    render(<App />);

    // Primary desktop nav still has exact 5 buttons; new Sticky Mobile Bottom Tab Bar uses its own aria-label
    const primaryNav = screen.getByRole('navigation', { name: /Primary Club Navigation/i });
    expect(within(primaryNav).getAllByRole('button')).toHaveLength(5);

    const mobileBottomNav = screen.getByRole('navigation', { name: /Mobile Bottom Navigation/i });
    expect(within(mobileBottomNav).getAllByRole('button')).toHaveLength(5);

    // Launch 60s Archetype Run from Compass pill
    fireEvent.click(screen.getByTestId('open-archetype-prom-pill'));
    expect(screen.getByTestId('archetype-prom-stage')).toBeInTheDocument();

    for (let round = 0; round < 5; round += 1) {
      fireEvent.click(screen.getByTestId('prom-choice-0'));
    }

    expect(screen.getByTestId('archetype-verdict-card')).toBeInTheDocument();
    expect(screen.getByTestId('thermal-receipt-preview').textContent).toContain(
      'THE MARLOW LOUNGE · SUNSET HILLS',
    );

    expect(
      screen.getByRole('button', { name: /Download Thermal Receipt PNG/i }),
    ).toBeInTheDocument();
    expect(typeof downloadReceiptPng).toBe('function');
  });

  it('distinguishes ethical Solo-Poly calendar honesty from fake Telegram DADT / Unicorn Ambushes across Roast Lab, Discord, and 46 Courtroom cases', async () => {
    const trapCheck = evaluateRoastLocally(
      'enm_check',
      'We have an open Don’t Ask Don’t Tell marriage, text me on Telegram only after 9 AM!',
      'her',
    );
    expect(trapCheck.score).toBeLessThan(20);

    const bradAmbush = evaluateRoastLocally(
      'enm_check',
      'Actually my husband Brad is parking right now so all three of us can grab margaritas!',
      'him',
    );
    expect(bradAmbush.score).toBeLessThan(20);

    const soloPolyClean = evaluateRoastLocally(
      'enm_check',
      'Solo-poly homeowner disclosed in Prompt #1: Thursday is metamour jazz, Friday through Sunday open for us.',
      'him',
    );
    expect(soloPolyClean.score).toBeGreaterThanOrEqual(85);

    // Worker /api/roast-utility supports enm_check
    const apiRes = await worker.fetch(
      new Request('https://cougarsandcubs.club/api/roast-utility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'enm_check',
          role: 'her',
          input: 'Text me on Telegram only, we have a Don’t Ask Don’t Tell marriage.',
        }),
      }),
      {},
    );
    expect(apiRes.status).toBe(200);
    const apiJson = (await apiRes.json()) as { score: number; verdictBadge: string };
    expect(apiJson.score).toBeLessThan(20);

    // 6th Discord channel + 46 synced Courtroom stories
    expect(V35_DISCORD_CHANNELS.some((c) => c.id === 'enm-and-plot-twists')).toBe(true);
    expect(SEED_COURTROOM_STORIES).toHaveLength(46);

    const courtRes = await worker.fetch(
      new Request('https://cougarsandcubs.club/api/courtroom'),
      {},
    );
    const courtJson = (await courtRes.json()) as { stories: { id: string }[] };
    expect(courtJson.stories.map((s) => s.id)).toEqual(SEED_COURTROOM_STORIES.map((s) => s.id));
  });

  it('wires background photo magnifiers, organic Bingo auto-toasts, 2-swipe intermission cards, iOS unsent text slips, Gen-X 👍 tapbacks, and live iOS text decoding', () => {
    render(<App />);

    // 1. Inspect Photo 1 background clue on Prowl -> unlocks clue + fires Organic Experience Bingo toast
    fireEvent.click(screen.getByTestId('hinge-photo-magnifier-btn'));
    expect(screen.getByTestId('hinge-photo-magnifier-clue')).toBeInTheDocument();
    expect(screen.getByTestId('organic-bingo-toast')).toBeInTheDocument();

    // 2. Swipe/pass 2 profiles on Prowl -> organic 1-tap Intermission Card surfaces
    fireEvent.click(screen.getByTestId('hinge-sticky-pass-btn'));
    fireEvent.click(screen.getByTestId('hinge-sticky-pass-btn'));
    expect(screen.getByTestId('hinge-intermission-card')).toBeInTheDocument();

    // 3. Open Lounge -> Simulate Live iOS Text Drop -> Decode Subtext opens Roast Lab prefilled
    fireEvent.click(screen.getByTestId('open-archetype-prom-pill'));
    fireEvent.click(screen.getByRole('button', { name: /All Party Modes/i }));
    fireEvent.click(screen.getByTestId('simulate-ios-ping-btn'));
    expect(screen.getByTestId('live-incoming-text-banner')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('banner-decode-subtext-btn'));
    expect(screen.getByTestId('roast-wingwoman-modal')).toBeInTheDocument();
  });

  it('recovers accidental iOS unsent lock-screen slips on Trap leads and translates Gen-X sincere 👍 tapbacks', () => {
    const wallet = createDefaultWallet();
    const grahamThread = {
      ...createInitialThread('graham', 'hinge', 'Quick drink Thursday?'),
      currentBeat: 2,
    };

    const { unmount } = render(
      <ChatsAndDatesView
        role="her"
        wallet={wallet}
        threads={[grahamThread]}
        selectedLeadId="graham"
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

    expect(screen.getByTestId('ios-unsent-slip-card')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('recover-unsent-preview-btn'));
    expect(screen.getByTestId('ios-unsent-recovered-text').textContent).toContain(
      'organic milk & pull-ups',
    );
    unmount();

    // Gen-X sincere thumbs-up translation on Claire's thread + Emily-is-Away draft hesitation
    const claireThread = createInitialThread('claire', 'hinge', 'Locked 7:45 at The Marlow.');
    render(
      <ChatsAndDatesView
        role="him"
        wallet={wallet}
        threads={[claireThread]}
        selectedLeadId="claire"
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

    expect(screen.getByTestId('genx-sincere-tapback').textContent).toContain(
      'Gen-X Translation: 100% happy',
    );
    expect(getEmilyDraftHesitation(2, 'him', false, false)).toContain('Sounds good.');
  });

  it('serves dynamic 1200x630 OpenGraph SVG scorecards at GET /api/og and injects OG meta tags into shared URLs', async () => {
    const ogRes = await worker.fetch(
      new Request(
        'https://cougarsandcubs.club/api/og?case=court-slide-five-brad-unicorn-ambush',
      ),
      {},
    );
    expect(ogRes.status).toBe(200);
    expect(ogRes.headers.get('Content-Type')).toContain('image/svg+xml');
    const svgText = await ogRes.text();
    expect(svgText).toContain('<svg');
    expect(svgText).toContain('Surprise Package Foul');

    const htmlRes = await worker.fetch(
      new Request(
        'https://cougarsandcubs.club/?court=1&case=court-slide-five-brad-unicorn-ambush',
      ),
      {
        ASSETS: {
          fetch: async () =>
            new Response(
              '<!doctype html><html><head><meta property="og:title" content="Old" /><meta property="og:image" content="https://cougarsandcubs.club/images/cast/hero-couple.jpg" /><title>App</title></head><body></body></html>',
              {
                headers: { 'content-type': 'text/html; charset=utf-8' },
              },
            ),
        },
      },
    );
    const html = await htmlRes.text();
    expect(html.match(/property="og:image"/g)).toHaveLength(1);
    expect(html).not.toContain('hero-couple.jpg');
    expect(html).toContain('/api/og?case=court-slide-five-brad-unicorn-ambush');
  });
});
