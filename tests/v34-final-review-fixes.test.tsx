import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import { HER_SWIPE_PROFILES } from '../src/data/appProfiles';
import { createDefaultWallet, saveWallet } from '../src/domain/economy';
import { applyEpisodeChoice, createCharacterDateRun } from '../src/domain/gameEngine';
import { loadMatchCareer, saveMatchCareer, createDefaultMatchCareer } from '../src/domain/matchCareer';
import {
  analyzePairing,
  FIELD_GUIDE_ENTRIES,
  getProfileDetails,
  HER_ARCHETYPES,
  HIS_ARCHETYPES,
} from '../src/domain/taxonomy';
import workerApp, { type WorkerEnv } from '../worker/index';

describe('v34 Whole-Branch Final Review Fixes (Critical #1-#3 & Important #1-#6)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('Critical #1: preserves normal multi-word spaces in getProfileDetails and Workers AI humanizeChatText', async () => {
    const details = getProfileDetails(HER_ARCHETYPES[0]);
    expect(details.zodiac).toMatch(/Sun/);
    expect(details.zodiac).not.toContain('Scorpio • Sun');
    expect(details.signatureDrink).not.toMatch(/Espresso, Martini/);

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
          personaId: 'claire-cougar-exec',
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

  it('Critical #2: includes /ingest and /ingest/* in wrangler.jsonc run_worker_first for SPA asset routing', () => {
    const raw = readFileSync(join(process.cwd(), 'wrangler.jsonc'), 'utf8');
    const parsed = JSON.parse(raw) as {
      assets?: { not_found_handling?: string; run_worker_first?: string[] };
    };
    expect(parsed.assets?.not_found_handling).toBe('single-page-application');
    expect(parsed.assets?.run_worker_first).toContain('/ingest');
    expect(parsed.assets?.run_worker_first).toContain('/ingest/*');
  });

  it('Critical #3: restricts cold LiveInboxModal entry to earned starter match and shows "1 Starter Match • Swipe to Match With More!"', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^Chats$/i }));

    expect(
      screen.getByText(/1 Starter Match • Swipe to Match With More!/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/18 Cubs/i)).not.toBeInTheDocument();
    expect(screen.getByText(/1 Cub/i)).toBeInTheDocument();
  });

  it('Important #1: formats numeric age, hour, year, and percentage ranges without corrupted comma-space pairs', () => {
    for (const entry of FIELD_GUIDE_ENTRIES) {
      expect(entry.ageRange).not.toMatch(/\b\d+, \d+/);
    }
    for (const p of [...HER_ARCHETYPES, ...HIS_ARCHETYPES]) {
      expect(p.shortHook).not.toMatch(/Dates \d+, \d+|women \d+, \d+|45, 64/);
      expect(p.statusPill ?? '').not.toMatch(/Dates \d+, \d+/);
    }
    const traumaRn = HER_SWIPE_PROFILES.find((p) => p.tinderBio.includes('saving lives'));
    expect(traumaRn?.tinderBio).toContain('7 PM to 7 AM');

    window.history.replaceState({}, '', '/?court=1');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Dump Him \(Straight to Jail\)/i }));
    expect(screen.getByText(/Cougars \(35-65F\) Voted:/i)).toBeInTheDocument();
  });

  it('Important #2: enforces strict Sedona (Qigong) vs Sloane (Seed-Oil/Miso) chip quarantine and Barnaby referee', () => {
    const career = createDefaultMatchCareer();
    career.matchedIds = ['sedona-qigong-mommy', 'sloane-seedoil-bernedoodle-mommy'];
    saveMatchCareer(career);

    const { unmount } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /🥂 Play as Him/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Chats$/i }));

    // Select Sedona (46F) -> Qigong chips only, zero seed-oil or Mommy-Domme
    fireEvent.click(screen.getAllByRole('button', { name: /Sedona/i })[0]);
    expect(document.body.textContent || '').not.toMatch(/seed-oil-free corner table/i);
    expect(document.body.textContent || '').not.toMatch(/Yes, Mommy\./i);

    // Select Sloane (42F) -> Seed-oil/Miso chips only, zero Qigong/6:30 AM courtyard or Mommy-Domme
    fireEvent.click(screen.getAllByRole('button', { name: /Sloane/i })[0]);
    expect(document.body.textContent || '').not.toMatch(/Courtyard at 6:30 AM/i);
    expect(document.body.textContent || '').not.toMatch(/Yes, Mommy\./i);
    unmount();

    // PixiCubAcademyStage shows Barnaby for non-Sloane, Miso only for Sloane
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^Obedience$/i }));
    expect(screen.getByText(/Barnaby Refereeing Live/i)).toBeInTheDocument();
    expect(screen.queryByText(/Miso Refereeing Live/i)).not.toBeInTheDocument();
  });

  it('Important #3: Send to Bestie immediately copies profile link to clipboard and ?dilemma=<archetypeId> pre-loads that profile on the Phone Simulator', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { share: undefined, clipboard: { writeText } });

    const { unmount } = render(<App />);
    const phoneSim = screen.getByTestId('desktop-phone-simulator');
    fireEvent.click(within(phoneSim).getByRole('button', { name: /Send to Bestie/i }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('dilemma=leo-golden-cub'));
    expect(screen.getByRole('button', { name: /iMessage \/ SMS/i })).toBeInTheDocument();
    unmount();

    window.history.replaceState({}, '', '/?dilemma=simone-auntie-cougar');
    render(<App />);
    const sim2 = screen.getByTestId('desktop-phone-simulator');
    expect(within(sim2).getByText(/Simone, 44/i)).toBeInTheDocument();
  });

  it('Important #4: LiveInboxModal blocks false Off-App banner on 0-credit 2nd match, offers 2-Cr Early Flirt Boost, and rehabs female unmatches as Him', async () => {
    saveWallet({ ...createDefaultWallet(), credits: 0 });
    const career = createDefaultMatchCareer();
    career.matchedIds = ['kieran-anthropic-ai-cub', 'leo-golden-cub', 'claire-cougar-exec'];
    career.unlockedImessageIds = ['leo-golden-cub'];
    saveMatchCareer(career);

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^Chats$/i }));
    fireEvent.click(screen.getAllByRole('button', { name: /Kieran/i })[0]);

    // Early Flirt Boost 2 Cr CTA is offered while Flirt Mode is locked
    expect(screen.getByRole('button', { name: /Boost Flirt \(2 Cr\)/i })).toBeInTheDocument();

    // Land 2 green replies on 2nd match with 0 credits -> must NOT falsely claim NUMBER EARNED!
    for (const msg of [
      'Booked a quiet corner table Friday at 7:30 with halibut on the menu.',
      'Ready to get off this app? Text my real cell for Friday at 7:30.',
    ]) {
      fireEvent.change(screen.getByPlaceholderText(/Message Kieran on Tinder/i), {
        target: { value: msg },
      });
      fireEvent.click(screen.getAllByRole('button', { name: /^Send$/i })[0]);
      await screen.findByText(/VIBE CHECK PASSED:/i);
    }
    expect(screen.queryByText(/NUMBER EARNED!/i)).not.toBeInTheDocument();
    expect(loadMatchCareer().unlockedImessageIds).not.toContain('kieran-anthropic-ai-cub');

    // Close Boutique modal if opened by 0-credit check
    const closeBoutique = screen.queryByRole('button', { name: /Close Boutique/i });
    if (closeBoutique) fireEvent.click(closeBoutique);

    // Switch to Younger Man (Him) -> trigger 2 strikes on Claire -> Rehab via Obedience -> Unmatch cleared!
    fireEvent.click(screen.getByRole('button', { name: /🥂 Younger Man/i }));
    for (const bad of [
      'hey u look crazy good for ur age whats ur snap??',
      'ngl never been with a cougar before, bucket list tonight??',
    ]) {
      fireEvent.change(screen.getByPlaceholderText(/Message Claire on Tinder/i), {
        target: { value: bad },
      });
      fireEvent.click(screen.getAllByRole('button', { name: /^Send$/i })[0]);
      await screen.findByText(/VIBE CHECK ROASTED:/i);
    }
    expect(screen.getByText(/Two Red-Flag Strikes with Claire/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Enroll in Cub Obedience School/i }));
    fireEvent.click(screen.getByRole('button', { name: /Sit & Listen!/i }));
    fireEvent.click(screen.getByRole('button', { name: /Drop the Snap!/i }));
    fireEvent.click(screen.getByRole('button', { name: /Door & Seat-Warmer!/i }));
    fireEvent.click(screen.getByRole('button', { name: /Toss Grass-Fed Steak Treat/i }));
    expect(loadMatchCareer().rehabbedIds).toContain('claire-cougar-exec');
  });

  it('Important #5: initializes matchCareer baseline stats at 55 and places houseboy-sunday-sanctuary after stat-building Date #2 scenes', () => {
    const pairing = analyzePairing(HER_ARCHETYPES[0], HIS_ARCHETYPES[0], 'him');
    const date2Run = createCharacterDateRun(pairing, 1);

    expect(date2Run.stats.maturity).toBe(55);
    expect(date2Run.stats.eq).toBe(55);
    const houseboyIdx = date2Run.episodeQueue.findIndex(
      (e) => e.id === 'houseboy-sunday-sanctuary',
    );
    expect(houseboyIdx).toBe(2);

    // Playing green choices on Scenes 1 & 2 of Date #2 raises maturity & eq >= 60 before Scene 3!
    const after1 = applyEpisodeChoice(date2Run, 0);
    const after2 = applyEpisodeChoice(after1, 0);
    expect(after2.stats.maturity).toBeGreaterThanOrEqual(60);
    expect(after2.stats.eq).toBeGreaterThanOrEqual(60);
  });

  it('Important #6: aligns ClubCourtroomView rewards with +15 XP (zero fake +2 Cr) and keeps wallet at 5 Cr on LiveInboxModal tea spills', () => {
    saveWallet(createDefaultWallet());
    window.history.replaceState({}, '', '/?court=1');
    const { unmount } = render(<App />);

    expect(document.body.textContent || '').not.toMatch(/\+2 Cr|\+2 Free Credits/i);
    expect(screen.getAllByText(/\+15 XP/i).length).toBeGreaterThanOrEqual(3);
    unmount();

    window.history.replaceState({}, '', '/');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^Chats$/i }));
    const spillInput = screen.getByPlaceholderText(/Spill a real red flag or archetype idea/i);
    fireEvent.change(spillInput, {
      target: { value: 'He sent a $4.12 Venmo request for parking validation.' },
    });
    fireEvent.submit(spillInput.closest('form')!);
    expect(screen.getByText(/5 Cr/i)).toBeInTheDocument();
  });
});
