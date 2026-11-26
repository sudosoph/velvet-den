import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { BoutiqueAndVipModal } from '../src/components/BoutiqueAndVipModal';
import { PartnerAuditionView } from '../src/components/PartnerAuditionView';
import { MONETIZATION_CONFIG } from '../src/config/monetization';
import { createDefaultWallet, saveWallet } from '../src/domain/economy';
import { applyEpisodeChoice, createRun } from '../src/domain/gameEngine';
import { analyzePairing, HER_ARCHETYPES, HIS_ARCHETYPES } from '../src/domain/taxonomy';
import { shareOrCopy, type ChallengePayload } from '../src/lib/viral';

describe('Whole-branch review fixes (Critical & Important)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('Fix #1: 0-credit Smooth Rewind on a busted run keeps the busted verdict card intact instead of stranding the UI', () => {
    const zeroWallet = { ...createDefaultWallet(), credits: 0 };
    saveWallet(zeroWallet);
    window.history.replaceState({}, '', '/?dilemma=check-drop');

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /corporate card, Mommy|spoil me/i }));
    expect(screen.getByText(/RED FLAG!/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Smooth Rewind/i }));
    expect(screen.getByRole('dialog', { name: /Cougars & Cubs Club VIP/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Close Boutique/i }));
    expect(screen.getByText(/RED FLAG!/i)).toBeInTheDocument();
  });

  it('Fix #2: Houseboy Sunday enforces maturity >= 60 && eq >= 60 vetting gate before granting Linen-Apron payoff', () => {
    const pairing = analyzePairing(HER_ARCHETYPES[0], HIS_ARCHETYPES[0], 'him');
    let lowRun = createRun(pairing, [], 'houseboy-sunday-sanctuary');
    lowRun = {
      ...lowRun,
      stats: { maturity: 45, chivalry: 50, eq: 45, chemistry: 60 },
    };

    const gatedOutcome = applyEpisodeChoice(lowRun, 0);
    expect(gatedOutcome.badges).not.toContain('Certified Linen-Apron Houseboy');
    expect(gatedOutcome.history[0].toastBanner).toMatch(/VETTING GATE|BOUNDARY/i);

    let highRun = createRun(pairing, [], 'houseboy-sunday-sanctuary');
    highRun = {
      ...highRun,
      stats: { maturity: 65, chivalry: 60, eq: 65, chemistry: 60 },
    };
    const unlockedOutcome = applyEpisodeChoice(highRun, 0);
    expect(unlockedOutcome.badges).toContain('Certified Linen-Apron Houseboy');
  });

  it('Fix #3: BoutiqueAndVipModal hides VELVETVIP hint and demo buttons when sandboxPreviewMode is false', () => {
    const origSandbox = MONETIZATION_CONFIG.sandboxPreviewMode;
    MONETIZATION_CONFIG.sandboxPreviewMode = false;
    try {
      render(
        <BoutiqueAndVipModal
          open={true}
          wallet={createDefaultWallet()}
          onClose={() => {}}
          onRedeemCode={() => false}
          onSandboxGrantCredits={() => {}}
          onSandboxUnlockVip={() => {}}
          onClaimNewsletterBonus={() => true}
        />,
      );

      expect(screen.queryByPlaceholderText(/VELVETVIP/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Free Demo/i)).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /Credits & VIP/i }));
      fireEvent.change(screen.getByPlaceholderText(/Enter VIP or promo code/i), {
        target: { value: 'WRONG' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Redeem/i }));
      expect(screen.queryByText(/VELVETVIP/i)).not.toBeInTheDocument();
    } finally {
      MONETIZATION_CONFIG.sandboxPreviewMode = origSandbox;
    }
  });

  it('Fix #4: Completing the final episode shows one Receipt button and navigates directly to Outcome in 1 click', () => {
    window.history.replaceState({}, '', '/?dilemma=check-drop');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /slide his card in/i }));

    const receiptButtons = screen.getAllByRole('button', { name: /Vibe.*Receipt/i });
    expect(receiptButtons).toHaveLength(1);

    fireEvent.click(receiptButtons[0]);
    expect(screen.getByText(/Official Cougars & Cubs Club Verdict/i)).toBeInTheDocument();
  });

  it('Fix #13: Pool & Sauna getaway renders bold rich text without raw ** asterisks and zero fake forum label', () => {
    window.history.replaceState({}, '', '/?dilemma=spontaneous-18h-pool-sauna-getaway');
    render(<App />);
    expect(screen.getByText(/18-hour spontaneous escape/i)).toBeInTheDocument();
    expect(document.body.textContent || '').not.toContain('**');
    expect(
      screen.getAllByText(/Heated Midnight Pool & Cedar Sauna/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(document.querySelector('img[src*="hotel-pool-sauna.jpg"]')).not.toBeNull();
  });

  it('Fix #5: analyzePairing handles zero/negative age gaps and Gen-Z Her cohort cleanly', () => {
    const her32 = { ...HER_ARCHETYPES[2], age: 32 };
    const his35 = { ...HIS_ARCHETYPES[3], age: 35 };
    const reverse = analyzePairing(her32, his35, 'her');
    expect(reverse.badgeLabel).not.toContain('-3-Year');

    const her27 = { ...HER_ARCHETYPES[2], age: 27 };
    const his22 = { ...HIS_ARCHETYPES[0], age: 22 };
    const lynxMatch = analyzePairing(her27, his22, 'her');
    expect(lynxMatch.herGeneration).toBe('gen_z');
    expect(lynxMatch.codeSwitchTip).not.toContain('Icon Alert');
  });

  it('Fix #6 & #7: Act I Ask Bestie opens multi-app Share Sheet for profile deep link (?dilemma=tyler-snapchat-ick)', async () => {
    window.history.replaceState({}, '', '/?dilemma=tyler-snapchat-ick');
    render(<App />);
    expect(screen.getByText(/Tyler/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Ask Bestie/i }));
    expect(screen.getByRole('button', { name: /iMessage \/ SMS/i })).toBeInTheDocument();
  });

  it('Fix #8: Launching a scenario preview from Club Guides does not silently deduct from the 5-Credit starter wallet', () => {
    const startWallet = createDefaultWallet();
    saveWallet(startWallet);

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Lore & Quizzes/i }));
    fireEvent.click(screen.getByRole('button', { name: /Club Guides & 12-Sign Matcher/i }));
    fireEvent.click(
      screen.getByRole('button', {
        name: /First Time Hosting an Older Woman at Your Place/i,
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: /Play.*Scenario Free/i }));

    expect(screen.getByText(/5 Cr/i)).toBeInTheDocument();
  });

  it('Fix #9: SEO & daily-drop scripts read fallback tags from src/config/monetization.ts and normalize URLs', () => {
    const ROOT = process.cwd();
    execFileSync('node', ['scripts/generate-daily-drop.mjs', '--dry-run', '--date=2026-11-24'], {
      cwd: ROOT,
      env: {
        ...process.env,
        PUBLIC_BASE_URL: 'https://sudosoph.github.io/velvet-den',
        AMAZON_ASSOCIATE_TAG: 'testtag-20',
        PARTNER_SUB_ID: 'sub99',
      },
      stdio: 'pipe',
    });

    const raw = JSON.parse(readFileSync(join(ROOT, 'dist-social/daily-drop.json'), 'utf8'));
    const desc = raw.discordPayload.embeds[0].description as string;
    expect(desc).toContain('https://sudosoph.github.io/velvet-den/?dilemma=');
    expect(desc).toContain('tag=testtag-20');
    expect(desc).toContain('subId=sub99');
  });

  it('Fix #10: PartnerAuditionView keeps preferredChoiceIndices aligned when unknown episodeIds are filtered out', () => {
    const mixedChallenge: ChallengePayload = {
      v: 1,
      senderName: 'Valerie',
      senderRole: 'her',
      herId: HER_ARCHETYPES[0].id,
      hisId: HIS_ARCHETYPES[0].id,
      episodeIds: ['retired-nonexistent-ep', 'check-drop'],
      preferredChoiceIndices: [2, 0],
    };

    render(<PartnerAuditionView challenge={mixedChallenge} onExitToMainGame={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Pick up the check cleanly/i }));
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('Fix #12: shareOrCopy avoids duplicating URL in copied text and handles clipboard permission errors without throwing', async () => {
    const writeText = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('Denied'));
    Object.assign(navigator, {
      share: undefined,
      clipboard: { writeText },
    });

    const res1 = await shareOrCopy({
      title: 'Receipt',
      text: 'Score 90% 👉 https://example.com/',
      url: 'https://example.com/',
    });
    expect(res1).toBe('copied');
    expect(writeText).toHaveBeenCalledWith('Score 90% 👉 https://example.com/');

    await expect(
      shareOrCopy({
        title: 'Receipt',
        text: 'Hello',
        url: 'https://example.com/',
      }),
    ).resolves.toBe('copied');
  });
});
