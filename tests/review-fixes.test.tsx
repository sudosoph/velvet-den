import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { BoutiqueAndVipModal } from '../src/components/BoutiqueAndVipModal';
import { MONETIZATION_CONFIG } from '../src/config/monetization';
import { createDefaultWallet } from '../src/domain/economy';
import { PartnerAuditionView } from '../src/components/PartnerAuditionView';
import { shareOrCopy, type ChallengePayload } from '../src/lib/viral';
import workerApp, { type WorkerEnv } from '../worker/index';

describe('Security, Worker, Boutique, Checklist, Zodiac & Audition Regression Suite (v35)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('blocks ?founder=1 URL bypass and unlocks Founder Vault only via salted passphrase', async () => {
    window.history.replaceState({}, '', '/?founder=1');
    render(<App />);

    expect(screen.queryByText(/Founder Playtest Vault/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Founder Vault/i }));
    const passInput = screen.getByLabelText(/Private Vault Passphrase/i);

    fireEvent.change(passInput, { target: { value: 'wrongpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /Unlock Founder Vault/i }));
    expect(await screen.findByText(/Invalid Founder passphrase/i)).toBeInTheDocument();

    fireEvent.change(passInput, { target: { value: 'ChampagneClub!2026#Sophia' } });
    fireEvent.click(screen.getByRole('button', { name: /Unlock Founder Vault/i }));
    expect((await screen.findAllByText(/Founder Playtest Vault/i)).length).toBeGreaterThanOrEqual(1);
  });

  it('includes /ingest and /ingest/* in wrangler.jsonc run_worker_first and humanizes Workers AI chat punctuation', async () => {
    const raw = readFileSync(join(process.cwd(), 'wrangler.jsonc'), 'utf8');
    const parsed = JSON.parse(raw) as {
      assets?: { not_found_handling?: string; run_worker_first?: string[] };
    };
    expect(parsed.assets?.not_found_handling).toBe('single-page-application');
    expect(parsed.assets?.run_worker_first).toContain('/ingest');
    expect(parsed.assets?.run_worker_first).toContain('/ingest/*');

    const mockEnv: WorkerEnv = {
      AI: {
        async run() {
          return {
            response: JSON.stringify({
              herReply: 'See you Friday at seven thirty — bring peonies.',
              maturityDelta: 18,
              chivalryDelta: 18,
              chemistryDelta: 20,
              coachNote: 'Decisive plan.',
              passedVibeCheck: true,
            }),
          };
        },
      },
    };

    const res = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/inbox-vet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId: 'claire',
          personaName: 'Claire',
          personaAge: 45,
          personaRole: 'her',
          playerMessage: 'Booked us a quiet corner booth Friday at 7:30.',
        }),
      }),
      mockEnv,
    );
    const data = (await res.json()) as { herReply: string };
    expect(data.herReply).toBe('See you Friday at seven thirty, bring peonies.');
  });

  it('hides VELVETVIP hint and demo buttons when sandboxPreviewMode is false', () => {
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
          onClaimNewsletterBonus={() => false}
        />,
      );

      expect(screen.queryByPlaceholderText(/VELVETVIP/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Free Demo/i)).not.toBeInTheDocument();
    } finally {
      MONETIZATION_CONFIG.sandboxPreviewMode = origSandbox;
    }
  });

  it('opens 3-Tier Experience Test via ?checklist=1, recovers gracefully from corrupted ?challenge=, and runs 12x12 Zodiac Matcher', () => {
    window.history.replaceState({}, '', '/?checklist=1');
    const { unmount } = render(<App />);
    const checklistModal = screen.getByRole('dialog', {
      name: /Have You Ever\? 3-Tier Cougars & Cubs Experience Test/i,
    });
    expect(checklistModal).toBeInTheDocument();
    expect(within(checklistModal).getByText(/Nirvana tee/i)).toBeInTheDocument();
    unmount();

    window.history.replaceState({}, '', '/?challenge=%%%bad-link');
    const u2 = render(<App />);
    expect(screen.getByText(/audition link looked truncated/i)).toBeInTheDocument();
    u2.unmount();

    window.history.replaceState(
      {},
      '',
      '/?journal=astrology-zodiac-compatibility-older-woman-younger-man',
    );
    render(<App />);
    expect(screen.getByTestId('zodiac-12x12-matcher')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Her Star Sign/i), { target: { value: 'leo' } });
    fireEvent.change(screen.getByLabelText(/His Star Sign/i), { target: { value: 'gemini' } });
    expect(screen.getByText(/♌ Leo Her × ♊ Gemini Cub/i)).toBeInTheDocument();
  });

  it('keeps preferredChoiceIndices aligned in PartnerAuditionView, deduplicates shareOrCopy URLs, and tags daily-drop links with /dp/ ASINs', async () => {
    const mixedChallenge: ChallengePayload = {
      v: 1,
      senderName: 'Valerie',
      senderRole: 'her',
      herId: 'claire',
      hisId: 'julian',
      episodeIds: ['retired-nonexistent-ep', 'check-drop'],
      preferredChoiceIndices: [2, 0],
    };

    render(<PartnerAuditionView challenge={mixedChallenge} onExitToMainGame={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Pick up the check cleanly/i }));
    expect(screen.getByText('100%')).toBeInTheDocument();

    const writeText = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('Denied'));
    Object.assign(navigator, { share: undefined, clipboard: { writeText } });
    const res1 = await shareOrCopy({
      title: 'Receipt',
      text: 'Score 90% 👉 https://example.com/',
      url: 'https://example.com/',
    });
    expect(res1).toBe('copied');
    expect(writeText).toHaveBeenCalledWith('Score 90% 👉 https://example.com/');

    const ROOT = process.cwd();
    execFileSync('node', ['scripts/generate-daily-drop.mjs', '--dry-run', '--date=2026-11-24'], {
      cwd: ROOT,
      env: {
        ...process.env,
        PUBLIC_BASE_URL: 'https://cougarsandcubs.club',
        AMAZON_ASSOCIATE_TAG: 'cougarsandcub-20',
      },
      stdio: 'pipe',
    });
    const rawDrop = JSON.parse(readFileSync(join(ROOT, 'dist-social/daily-drop.json'), 'utf8'));
    const desc = rawDrop.discordPayload.embeds[0].description as string;
    expect(desc).toContain('amazon.com/dp/');
    expect(desc).toContain('tag=cougarsandcub-20');
  });
});
