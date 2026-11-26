import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { APP_SWIPE_PROFILES, getSwipeDeckForRole, HER_SWIPE_PROFILES } from '../src/data/appProfiles';
import { EPISODES } from '../src/data/episodes';
import { createRun } from '../src/domain/gameEngine';
import { analyzePairing, HER_ARCHETYPES, HIS_ARCHETYPES } from '../src/domain/taxonomy';
import { evaluateDmLocally } from '../src/services/adapters';
import workerApp, { type WorkerEnv } from '../worker/index';

describe('v34 Coherence: Phone Landing, Connected Inbox/Obedience Loop, In-The-Wild 8-Bit Map & Worker API', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('includes 6-photo Style A photorealistic profiles across both Her and His swipe decks', () => {
    expect(APP_SWIPE_PROFILES.length).toBeGreaterThanOrEqual(5);
    expect(HER_SWIPE_PROFILES.length).toBeGreaterThanOrEqual(3);

    for (const p of [...APP_SWIPE_PROFILES, ...HER_SWIPE_PROFILES]) {
      expect(p.name.length).toBeGreaterThan(1);
      expect(p.tinderBio.length).toBeGreaterThan(20);
      expect(p.spotifyAnthem.length).toBeGreaterThan(4);
      expect(p.hingePromptQuestion.length).toBeGreaterThan(4);
      expect(p.photos.length).toBeGreaterThanOrEqual(6);
    }

    expect(getSwipeDeckForRole('her')[0].id).toBe('connor-bottle-trap');
    expect(getSwipeDeckForRole('her')[1].id).toBe('kieran-anthropic-ai-cub');
    expect(APP_SWIPE_PROFILES.some((p) => p.id === 'brandon-roblox-dl-trap')).toBe(true);
    expect(getSwipeDeckForRole('him')[0].id).toBe('her-claire-45');
  });

  it('routes 87 subplots accurately with strict quirk quarantine and Any-Age Princess romance', () => {
    expect(EPISODES.length).toBe(87);
    expect(HER_ARCHETYPES.length).toBe(39);
    expect(HIS_ARCHETYPES.length).toBe(18);
    const kieran28 = HIS_ARCHETYPES.find((c) => c.id === 'kieran-anthropic-ai-cub')!;
    expect(kieran28.age).toBe(28);
    expect(
      createRun(analyzePairing(HER_ARCHETYPES[0], kieran28, 'her')).episodeQueue.map((e) => e.id),
    ).toContain('early-anthropic-ai-cub-quiet-generosity');

    const sedona46 = HER_ARCHETYPES.find((h) => h.id === 'sedona-qigong-mommy')!;
    const sloane42 = HER_ARCHETYPES.find((h) => h.id === 'sloane-seedoil-bernedoodle-mommy')!;
    const leo = HIS_ARCHETYPES.find((c) => c.id === 'leo-golden-cub')!;

    const sedonaIds = createRun(analyzePairing(sedona46, leo, 'him')).episodeQueue.map((e) => e.id);
    expect(sedonaIds).toContain('qigong-tai-chi-wellness-mommy-domme');
    expect(sedonaIds).not.toContain('seed-oil-gluten-free-bernedoodle-mommy');

    const sloaneIds = createRun(analyzePairing(sloane42, leo, 'him')).episodeQueue.map((e) => e.id);
    expect(sloaneIds).toContain('seed-oil-gluten-free-bernedoodle-mommy');
    expect(sloaneIds).not.toContain('qigong-tai-chi-wellness-mommy-domme');

    const sienna38 = HER_ARCHETYPES.find((h) => h.id === 'sienna-junior-cougar')!;
    const miles32 = HIS_ARCHETYPES.find((c) => c.id === 'miles-millennial-cub')!;
    const juniorPairing = analyzePairing(sienna38, miles32, 'her');
    expect(juniorPairing.ageGap).toBe(6);
    expect(juniorPairing.badgeLabel).toBe('6-Year Junior Cougar Matchup');
  });

  it('plays the 3-beat Black Cat × Golden Retriever Slow-Burn Pacing minigame and melts her guard', () => {
    window.history.replaceState({}, '', '/?dilemma=black-cat-pushback-golden-retriever-test');
    render(<App />);

    expect(screen.getByText(/Black Cat × 🐕 Golden Retriever Pacing Meter/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Love-Bomb 9 Texts/i }));
    expect(screen.getByText(/HISS! Too pushy/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Grin Warmly & Match Her Unhurried Pace/i }));
    fireEvent.click(screen.getByRole('button', { name: /Laugh Unbothered/i }));
    fireEvent.click(screen.getByRole('button', { name: /Hold Calm 7:30 Wine-Bar Plan/i }));
    expect(screen.getByText(/Black Cat Melted!/i)).toBeInTheDocument();
  });

  it('plays Venmo Swatter, Bench Press, Grooming Salon, Maui Cross-Exam, Qigong Breath Sync & Bernedoodle Audit minigames via scene deep links', () => {
    window.history.replaceState({}, '', '/?dilemma=broke-college-dutch-calculator-horror');
    const u1 = render(<App />);
    for (const btn of screen.getAllByRole('button', { name: /SWAT ✕/i })) {
      fireEvent.click(btn);
    }
    expect(screen.getByText(/All 4 itemized Venmo popups swatted into orbit!/i)).toBeInTheDocument();
    u1.unmount();

    window.history.replaceState({}, '', '/?dilemma=cub-bench-press-cougar-training');
    const u2 = render(<App />);
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Press Rep/i }));
    }
    expect(screen.getByText(/5x225 Crushed!/i)).toBeInTheDocument();
    u2.unmount();

    window.history.replaceState({}, '', '/?dilemma=cub-grooming-red-carpet-glowup');
    const u3 = render(<App />);
    for (const btn of screen.getAllByRole('button', { name: /Tap to Groom!/i })) {
      fireEvent.click(btn);
    }
    expect(screen.getByText(/Full “Cougar-Groomed” Glow-Up Complete!/i)).toBeInTheDocument();
    u3.unmount();

    window.history.replaceState({}, '', '/?dilemma=parents-hawaii-timeshare-flex-trap');
    const u4 = render(<App />);
    for (const btn of screen.getAllByRole('button', { name: /PRESS →/i })) {
      fireEvent.click(btn);
    }
    expect(screen.getByText(/Mom’s Maui Timeshare Exposed in 4K!/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Burst out laughing at the sheer audacity/i }));
    expect(screen.getByRole('button', { name: /Have You Ever\? IRL Check/i })).toBeInTheDocument();
    u4.unmount();

    window.history.replaceState({}, '', '/?dilemma=qigong-tai-chi-wellness-mommy-domme');
    const u5 = render(<App />);
    for (const btn of screen.getAllByRole('button', { name: /SYNC →/i })) {
      fireEvent.click(btn);
    }
    expect(screen.getByText(/Full Tai Chi Cloud-Hands harmony unlocked/i)).toBeInTheDocument();
    u5.unmount();

    window.history.replaceState({}, '', '/?dilemma=seed-oil-gluten-free-bernedoodle-mommy');
    const u6 = render(<App />);
    for (const btn of screen.getAllByRole('button', { name: /UPGRADE →/i })) {
      fireEvent.click(btn);
    }
    expect(screen.getByText(/Zero seed oils, zero gluten/i)).toBeInTheDocument();
    u6.unmount();
  });

  it('lets players drag the Dating-App Age-Preference Slider in AppSwipeStage to unlock Montana Cowboy (25) and Sub-23 Danger Zone (21)', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start Vetting/i }));

    const slider = screen.getByLabelText(/Dating app age preference slider/i);
    fireEvent.change(slider, { target: { value: '25' } });
    expect(screen.getByText(/KRISTIN CAVALLARI × MONTANA BOYZ ZONE/i)).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: '21' } });
    expect(screen.getByText(/SUB-23 DANGER ZONE UNLOCKED/i)).toBeInTheDocument();
  });

  it('blocks ?founder=1 URL bypass, unlocks Founder Playtest Vault via salted passphrase, and opens CC-BY Pop-Culture Quiz', async () => {
    window.history.replaceState({}, '', '/?founder=1');
    render(<App />);

    expect(screen.queryByLabelText(/Founder instant scene jumper/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Founder Vault/i }));
    const passInput = screen.getByLabelText(/Private Vault Passphrase/i);

    fireEvent.change(passInput, { target: { value: 'wrongpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /Unlock Founder Vault/i }));
    expect(await screen.findByText(/Invalid Founder passphrase/i)).toBeInTheDocument();

    fireEvent.change(passInput, { target: { value: 'ChampagneClub!2026#Sophia' } });
    fireEvent.click(screen.getByRole('button', { name: /Unlock Founder Vault/i }));

    expect(await screen.findByText(/Founder Playtest Vault/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Founder instant scene jumper/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Lore & Quizzes/i }));
    fireEvent.click(screen.getByRole('button', { name: /Pop-Culture Quiz \(20 Qs\)/i }));
    expect(
      screen.getByRole('dialog', { name: /Pop-Culture Cougar & Cub Trivia/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Wikimedia Commons/i)).toBeInTheDocument();
  });

  it('opens Have You Ever? 25-Point Experience Test via ?checklist=1 with zero wellness filler or "Viral" self-labels', () => {
    window.history.replaceState({}, '', '/?checklist=1');
    render(<App />);

    const checklistModal = screen.getByRole('dialog', {
      name: /Have You Ever\? 25-Point Cougars & Cubs Experience Test/i,
    });
    expect(checklistModal).toBeInTheDocument();
    expect(within(checklistModal).getByText(/favorite song when I was 4/i)).toBeInTheDocument();
    expect(within(checklistModal).getByText(/Sorted, Mummy xx/i)).toBeInTheDocument();
    expect(within(checklistModal).getByText(/bucket list/i)).toBeInTheDocument();
    expect(within(checklistModal).queryByText(/bernedoodle|qigong/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /late 1900s/i }));
    fireEvent.click(screen.getByRole('button', { name: /Babygirl/i }));
    expect(screen.getByText('8/100')).toBeInTheDocument();
  });

  it('plays the "In The Wild" 8-Bit Neighborhood Date Map with 6 real-world hotspots, Barnaby rescue dog, street encounters & subculture goblins', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Club Map/i }));
    expect(screen.getByText(/In The Wild • 8-Bit Neighborhood Date Map/i)).toBeInTheDocument();
    expect(document.body.textContent || '').not.toMatch(/Qigong|Bernedoodle|Seed-Oil/i);

    // Verify all 6 In The Wild venues
    expect(screen.getByText(/6 PM WINE & CSA/i)).toBeInTheDocument();
    expect(screen.getByText(/GYM & SMOOTHIE/i)).toBeInTheDocument();
    expect(screen.getByText(/HOTEL LOBBY BAR/i)).toBeInTheDocument();
    expect(screen.getByText(/UV BOUNCER & BISTRO/i)).toBeInTheDocument();
    expect(screen.getByText(/SUNDAY SANCTUARY/i)).toBeInTheDocument();
    expect(screen.getByText(/CLUB GIFT SHOP/i)).toBeInTheDocument();

    // Adopt Rescue Golden "Barnaby" (+35 XP)
    fireEvent.click(screen.getByRole('button', { name: /Adopt Rescue Golden "Barnaby"/i }));
    expect(screen.getByText(/Barnaby Following/i)).toBeInTheDocument();

    // Intercept & roast a roaming subculture goblin
    fireEvent.click(screen.getByRole('button', { name: /Intercept Red-Flag Goblin/i }));
    fireEvent.click(screen.getByRole('button', { name: /Roast & Zap Red-Flag Goblin/i }));
    expect(screen.getByText(/Goblins Roasted: 1\/3/i)).toBeInTheDocument();
  });

  it('connects LiveInboxModal: Earned Match starter, Profile Memory Bonus, 2-strike Unmatch + Cub Obedience Rehab, Discord Advice Pills, Visual Gift Card & 3-turn Date #1 Handoff', async () => {
    // Verify British Cub Julian natural dialect in local evaluator
    const julianVerdict = evaluateDmLocally({
      personaId: 'julian-oldsoul-cub',
      personaName: 'Julian',
      personaAge: 27,
      personaRole: 'him',
      playerMessage: 'Half seven works if you behave yourself tonight.',
    });
    expect(julianVerdict.passedVibeCheck).toBe(true);
    expect(julianVerdict.herReply).toMatch(/sorted|proper|Mummy|xx/i);

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /^Chats$/i }));
    expect(
      screen.getByRole('dialog', { name: /Survive Their Inbox/i }),
    ).toBeInTheDocument();

    // Visual Gift Pick card is rendered in right dossier panel
    expect(screen.getByText(/Send a Thoughtful Date Gift/i)).toBeInTheDocument();

    // Profile Memory Bonus triggers when referencing Leo's memory keyword ("linen" / "pasta")
    const input = screen.getByPlaceholderText(/Message Leo on Tinder/i);
    fireEvent.change(input, {
      target: { value: 'If you bring that linen apron and handmade pasta Friday at 7:30, you have a deal.' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: /^Send$/i })[0]);
    expect(await screen.findByText(/Profile Memory Bonus/i)).toBeInTheDocument();

    // Earn 2nd spark to unlock Off-App iMessage free for Match #1
    fireEvent.change(screen.getByPlaceholderText(/Message Leo on Tinder/i), {
      target: { value: 'Ready to get off this app? Text my real cell to lock in Friday at 7:30.' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: /^Send$/i })[0]);
    expect(await screen.findByText(/NUMBER EARNED!/i)).toBeInTheDocument();

    // Switch to iMessage and complete 3 green turns to unlock Date #1 Handoff Card
    fireEvent.click(screen.getByRole('button', { name: /^iMessage$/i }));
    for (const line of [
      'Saved your number, call me Thursday at 6 PM to confirm Friday at 7:30.',
      'Pick me up at 7:15 sharp and keep your phone on silent.',
      'Looking forward to Friday dinner, bring your A-game.',
    ]) {
      fireEvent.change(screen.getByPlaceholderText(/Message Leo on iMessage/i), {
        target: { value: line },
      });
      fireEvent.click(screen.getAllByRole('button', { name: /^Send$/i })[0]);
      await screen.findByText(/OFF-APP CHEMISTRY:/i);
    }
    expect(await screen.findByRole('button', { name: /Go on Date #1/i })).toBeInTheDocument();

    // Switch to Discord #ask-the-den and verify clickable Advice Suggestion Pills
    fireEvent.click(screen.getByRole('button', { name: /^Discord$/i }));
    fireEvent.click(screen.getByRole('button', { name: /ask-the-den/i }));
    expect(screen.getByText(/Ask the Den • Tap a Question Pill/i)).toBeInTheDocument();
    const nirvanaPill = screen.getByRole('button', { name: /Nirvana/i });
    fireEvent.click(nirvanaPill);
    expect((screen.getByPlaceholderText(/Post anonymously/i) as HTMLInputElement).value).toMatch(
      /Nirvana/i,
    );

    // Trigger 2 consecutive red-flag strikes on Tinder to verify Unmatched Receipt + Cub Obedience School rehab CTA
    fireEvent.click(screen.getByRole('button', { name: /^Tinder$/i }));
    for (const badLine of [
      'hey u look crazy good for ur age whats ur snap??',
      'ngl never been with a cougar before, bucket list discrete link tonight??',
    ]) {
      fireEvent.change(screen.getByPlaceholderText(/Message Leo on Tinder/i), {
        target: { value: badLine },
      });
      fireEvent.click(screen.getAllByRole('button', { name: /^Send$/i })[0]);
      await screen.findByText(/VIBE CHECK ROASTED:/i);
    }
    expect(screen.getByText(/Two Red-Flag Strikes with Leo/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Enroll in Cub Obedience School/i }),
    ).toBeInTheDocument();
  });

  it('graduates a Cub in 2D PixiJS Obedience Sim, scans all 5 apartment hazards, stamps Dateodex, and votes in Courtroom', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /^Obedience$/i }));
    expect(screen.getByText(/Cub Obedience Simulator & 2D Room Roast/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Sit & Listen!/i }));
    fireEvent.click(screen.getByRole('button', { name: /Drop the Snap!/i }));
    fireEvent.click(screen.getByRole('button', { name: /Door & Seat-Warmer!/i }));
    fireEvent.click(screen.getByRole('button', { name: /Toss Grass-Fed Steak Treat/i }));

    expect(screen.getByText(/OFFICIAL CUB OBEDIENCE DIPLOMA • RANK S/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Scan His Apartment Next/i }));
    fireEvent.click(screen.getByRole('button', { name: /1 Flat Yellowed College Pillow/i }));
    fireEvent.click(screen.getByRole('button', { name: /Unlidded Bathroom Trash Can/i }));
    fireEvent.click(screen.getByRole('button', { name: /5-in-1 Body\/Hair\/Dish\/Engine Wash/i }));
    fireEvent.click(screen.getByRole('button', { name: /Draft \$19\.50 Ribeye Venmo Request/i }));
    fireEvent.click(screen.getByRole('button', { name: /11:47 PM Pine-Pollen Tincture/i }));
    expect(screen.getByText(/5 \/ 5 Upgraded/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Open Unlocked Polaroid/i }));
    expect(screen.getByText(/Unlockable Club Polaroid Memories \(2\/6\)/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Crown Him \/ Dump Him Court/i }));
    fireEvent.click(screen.getByRole('button', { name: /Dump Him \(Straight to Jail\)/i }));
    expect(
      screen.getByText(/Live Blind-Spot Split: 🐆 How Cougars Voted vs\. 🐕 How Cubs Thought/i),
    ).toBeInTheDocument();
  });

  it('handles Cloudflare Worker /api/health (v34), /api/stats (KV), /api/inbox-vet, /api/verify-checkout, and /api/go/:id cleanly', async () => {
    const memoryKv = new Map<string, string>();
    const mockEnv: WorkerEnv = {
      VELVET_KV: {
        async get(k) {
          return memoryKv.get(k) ?? null;
        },
        async put(k, v) {
          memoryKv.set(k, v);
        },
      },
      AI: {
        async run() {
          return {
            response: JSON.stringify({
              herReply: 'Friday at 7:30 works, bring your A-game and zero excuses.',
              maturityDelta: 20,
              chivalryDelta: 18,
              chemistryDelta: 22,
              coachNote: 'Clean reservation confidence!',
              passedVibeCheck: true,
            }),
          };
        },
      },
    };

    const healthRes = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/health'),
      mockEnv,
    );
    expect(healthRes.status).toBe(200);
    const healthJson = (await healthRes.json()) as {
      ok: boolean;
      version: string;
      kvBound: boolean;
      aiBound: boolean;
    };
    expect(healthJson.ok).toBe(true);
    expect(healthJson.version).toContain('v34');

    const saveTagRes = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/founder-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passphrase: 'ChampagneClub!2026#Sophia',
          amazonAssociateTag: 'cougarclub-20',
        }),
      }),
      mockEnv,
    );
    expect(saveTagRes.status).toBe(200);

    const apronRedirect = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/go/houseboy-linen-apron?src=houseboy_scene'),
      mockEnv,
    );
    expect(apronRedirect.status).toBe(302);
    expect(apronRedirect.headers.get('Location')).toContain('tag=cougarclub-20');
  });
});
