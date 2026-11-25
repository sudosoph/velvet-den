import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { APP_SWIPE_PROFILES, getSwipeDeckForRole, HER_SWIPE_PROFILES } from '../src/data/appProfiles';
import { EPISODES } from '../src/data/episodes';
import { applyMinigameBonus, createRun } from '../src/domain/gameEngine';
import { analyzePairing, HER_ARCHETYPES, HIS_ARCHETYPES } from '../src/domain/taxonomy';
import { evaluateDmLocally } from '../src/services/adapters';
import workerApp, { type WorkerEnv } from '../worker/index';

describe('v2 Interactive Game, Age-Specific 5-Stage Arcs, Photorealistic Tinder Deck & Worker API', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('includes Style A photorealistic images, names, heights, zodiacs, Spotify anthems & Tinder bios across both Her and His swipe decks', () => {
    expect(APP_SWIPE_PROFILES.length).toBeGreaterThanOrEqual(5);
    expect(HER_SWIPE_PROFILES.length).toBeGreaterThanOrEqual(3);

    for (const p of [...APP_SWIPE_PROFILES, ...HER_SWIPE_PROFILES]) {
      expect(p.name.length).toBeGreaterThan(1);
      expect(p.tinderBio.length).toBeGreaterThan(20);
      expect(p.spotifyAnthem.length).toBeGreaterThan(4);
      expect(p.hingePromptQuestion.length).toBeGreaterThan(4);
      expect(p.photos.length).toBeGreaterThanOrEqual(2);
      expect(p.photos[0].photoUrl).toMatch(/^\.\/images\/cast\/.+\.jpg$/);
      expect(p.photos[1].photoUrl).toMatch(/^\.\/images\/cast\/.+\.jpg$/);
    }

    expect(getSwipeDeckForRole('her')[0].id).toBe('connor-bottle-trap');
    expect(APP_SWIPE_PROFILES.some((p) => p.id === 'brandon-roblox-dl-trap')).toBe(true);
    expect(getSwipeDeckForRole('him')[0].id).toBe('her-claire-45');
  });

  it('routes 75 subplots accurately—including Black Cat × Golden Retriever Slow-Burn Pushback, Age-Slider Montana Cowboy, Broke College Dutch-Splitter & Anniversaries across all tracks', () => {
    expect(EPISODES.length).toBe(75);
    expect(HER_ARCHETYPES.length).toBe(37);
    expect(HIS_ARCHETYPES.length).toBe(17);

    const sienna38 = HER_ARCHETYPES.find((h) => h.id === 'sienna-junior-cougar')!;
    const miles32 = HIS_ARCHETYPES.find((c) => c.id === 'miles-millennial-cub')!;
    const maya36 = HER_ARCHETYPES.find((h) => h.id === 'maya-puma-mom')!;
    const chloe37 = HER_ARCHETYPES.find((h) => h.id === 'chloe-puma-dogmom')!;
    const claire45 = HER_ARCHETYPES.find((h) => h.id === 'claire-cougar-exec')!;
    const serena43 = HER_ARCHETYPES.find((h) => h.id === 'serena-princess-cougar')!;
    const valerie53 = HER_ARCHETYPES.find((h) => h.id === 'valerie-jaguar-trail')!;
    const celeste62 = HER_ARCHETYPES.find((h) => h.id === 'celeste-panther-icon')!;
    const leo25 = HIS_ARCHETYPES.find((c) => c.id === 'leo-golden-cub')!;

    // 6-Year "Junior Cougar" (38F × 32M = 6-yr gap): gets 2008 math, bench press, cub grooming, pop-culture renaissance, 30s low-iron ferritin, sister-age shock, younger sibling birth-year twin, 7-wedding summer, 6-yr clock Doubt, and Miley & Maxx sweet-spot finale!
    const juniorPairing = analyzePairing(sienna38, miles32, 'her');
    expect(juniorPairing.ageGap).toBe(6);
    expect(juniorPairing.badgeLabel).toBe('6-Year Junior Cougar Matchup');
    const juniorIds = createRun(juniorPairing).episodeQueue.map((e) => e.id);
    expect(juniorIds).toContain('junior-cougar-gatekeeper-tease');
    expect(juniorIds).toContain('cub-bench-press-cougar-training');
    expect(juniorIds).toContain('cub-grooming-red-carpet-glowup');
    expect(juniorIds).toContain('pop-culture-cougar-renaissance');
    expect(juniorIds).toContain('puma-low-iron-ferritin-care');
    expect(juniorIds).toContain('steamy-texts-sister-age-shock');
    expect(juniorIds).toContain('younger-sibling-same-birth-year');
    expect(juniorIds).toContain('junior-cougar-condo-vs-lease');
    expect(juniorIds).toContain('junior-cougar-wedding-season-marathon');
    expect(juniorIds).toContain('doubt-junior-cougar-timeline-sync');
    expect(juniorIds).toContain('junior-cougar-sweet-spot-future');
    expect(juniorIds).not.toContain('waiter-son-incident');
    expect(juniorIds).not.toContain('grown-son-same-age-collision');
    expect(juniorIds).not.toContain('babysitter-flake-test');

    // 37F Child-Free Divorced Dog-Mom Puma × 25M Cub: gets rescue-dog vetting, zero weaponized incompetence, Roblox friends shock, sibling birth-year twin, jaded divorcee brunch, peer-cynicism Doubt stage, and DINK dog-pack future—ZERO kid/babysitter/grown-son scenes!
    const dogMomIds = createRun(analyzePairing(chloe37, leo25, 'her')).episodeQueue.map(
      (e) => e.id,
    );
    expect(dogMomIds).toContain('puma-dog-park-vetting');
    expect(dogMomIds).toContain('puma-weaponized-incompetence-test');
    expect(dogMomIds).toContain('cub-friends-memes-roblox-shock');
    expect(dogMomIds).toContain('younger-sibling-same-birth-year');
    expect(dogMomIds).toContain('puma-brunch-cynical-peers');
    expect(dogMomIds).toContain('doubt-puma-peer-cynicism');
    expect(dogMomIds).toContain('puma-dogmom-dink-future');
    expect(dogMomIds).not.toContain('babysitter-flake-test');
    expect(dogMomIds).not.toContain('puma-kid-intro-boundary');
    expect(dogMomIds).not.toContain('puma-boys-groupchat-kid');
    expect(dogMomIds).not.toContain('waiter-son-incident');
    expect(dogMomIds).not.toContain('grown-son-same-age-collision');

    // 36F Single-Mom Puma × 25M Cub (11-yr gap): gets babysitter, 6-month kid boundary, Roblox friends, wedding +1 debut, Puma Doubt stage, 30s timeline; NEVER waiter-son-incident or grown-son-same-age-collision!
    const pumaQueue = createRun(analyzePairing(maya36, leo25, 'her')).episodeQueue;
    const pumaIds = pumaQueue.map((e) => e.id);
    expect(pumaIds).toContain('babysitter-flake-test');
    expect(pumaIds).toContain('puma-kid-intro-boundary');
    expect(pumaIds).toContain('cub-friends-memes-roblox-shock');
    expect(pumaIds).toContain('first-wedding-plus-one-debut');
    expect(pumaIds).toContain('doubt-puma-divorce-scar');
    expect(pumaIds).toContain('puma-one-and-done-clock');
    expect(pumaIds.indexOf('doubt-puma-divorce-scar')).toBeLessThan(
      pumaIds.indexOf('puma-one-and-done-clock'),
    );
    expect(pumaIds).not.toContain('puma-dog-park-vetting');
    expect(pumaIds).not.toContain('waiter-son-incident');
    expect(pumaIds).not.toContain('grown-son-same-age-collision');
    expect(pumaIds).not.toContain('adult-kid-brunch');

    // 45F Cougar (with adult_children) × 25M Cub: hits Pocket-Secret Test, 1900s/Venmo Whiplash, Perimenopause, Roblox Friends, Sibling Birth-Year, Wedding +1, Same-Age Mom, Grown-Son Same-Age Collision, Stage 5 Doubt & Stage 6 finale!
    const cougarIds = createRun(analyzePairing(claire45, leo25, 'her')).episodeQueue.map(
      (e) => e.id,
    );
    expect(cougarIds).toContain('babygirl-hotel-bar-milk-or-martini');
    expect(cougarIds).toContain('gym-headphones-vs-three-week-nod');
    expect(cougarIds).toContain('cubsplaining-and-bouncer-id-check');
    expect(cougarIds).toContain('hotel-checkin-two-queen-beds-mixup');
    expect(cougarIds).toContain('forum-redflag-pocket-secret-test');
    expect(cougarIds).toContain('generational-1900s-venmo-whiplash');
    expect(cougarIds).toContain('cub-bench-press-cougar-training');
    expect(cougarIds).toContain('cougar-perimenopause-surge-nightsweats');
    expect(cougarIds).toContain('steamy-texts-sister-age-shock');
    expect(cougarIds).toContain('cub-friends-memes-roblox-shock');
    expect(cougarIds).toContain('younger-sibling-same-birth-year');
    expect(cougarIds).toContain('first-wedding-plus-one-debut');
    expect(cougarIds).toContain('meeting-his-parents-same-age-mom');
    expect(cougarIds).toContain('grown-son-same-age-collision');
    expect(cougarIds).toContain('doubt-cougar-honeymoon-cliff');
    expect(cougarIds.indexOf('doubt-cougar-honeymoon-cliff')).toBeLessThan(
      cougarIds.indexOf('fertility-kids-crossroads'),
    );

    // Child-free 43F Cougar (Serena) × 25M Cub does NOT see grown-son-same-age-collision!
    const princessCougarIds = createRun(analyzePairing(serena43, leo25, 'her')).episodeQueue.map(
      (e) => e.id,
    );
    expect(princessCougarIds).not.toContain('grown-son-same-age-collision');

    // 53F Jaguar × 25M Cub (28-yr gap): gets 6 PM Gen-X call, Pilates shake, Menopause Intimacy Masterclass, Roblox Friends, Wedding +1, Same-Age Mom, Grown-Son Same-Age Collision, adult-kid-brunch, Stage 5 Doubt & Stage 6 LAT finale!
    const jaguarIds = createRun(analyzePairing(valerie53, leo25, 'her')).episodeQueue.map(
      (e) => e.id,
    );
    expect(jaguarIds).toContain('jaguar-genx-phone-call');
    expect(jaguarIds).toContain('jaguar-pilates-core-shake');
    expect(jaguarIds).toContain('menopause-intimacy-masterclass');
    expect(jaguarIds).toContain('steamy-texts-sister-age-shock');
    expect(jaguarIds).toContain('cub-friends-memes-roblox-shock');
    expect(jaguarIds).toContain('first-wedding-plus-one-debut');
    expect(jaguarIds).toContain('meeting-his-parents-same-age-mom');
    expect(jaguarIds).toContain('waiter-son-incident');
    expect(jaguarIds).toContain('grown-son-same-age-collision');
    expect(jaguarIds).toContain('adult-kid-brunch');
    expect(jaguarIds).toContain('doubt-jaguar-worlds-collide');
    expect(jaguarIds).toContain('jaguar-lat-living-apart');

    // 62F Panther × 25M Cub (37-yr gap): gets black-tie gala, Menopause Intimacy Masterclass, Wedding +1, Same-Age Mom, Grown-Son Same-Age Collision, fierce friends, Stage 5 Doubt & Stage 6 "75 and 45" timeline!
    const pantherIds = createRun(analyzePairing(celeste62, leo25, 'him')).episodeQueue.map(
      (e) => e.id,
    );
    expect(pantherIds).toContain('panther-black-tie-gala');
    expect(pantherIds).toContain('menopause-intimacy-masterclass');
    expect(pantherIds).toContain('first-wedding-plus-one-debut');
    expect(pantherIds).toContain('meeting-his-parents-same-age-mom');
    expect(pantherIds).toContain('grown-son-same-age-collision');
    expect(pantherIds).toContain('panther-protective-friends');
    expect(pantherIds).toContain('doubt-panther-real-world-gravity');
    expect(pantherIds).toContain('panther-timeline-75-45');
    expect(pantherIds).toContain('milestone-six-month-anniversary');
    expect(pantherIds).toContain('milestone-one-year-anniversary');

    // Fiery Foreign Cougar (Valentina 44F) × Fresh PhD Cub (Dr. Theo 27M) & Modest-Roots Cub (Rafael 26M)
    const valentina44 = HER_ARCHETYPES.find((h) => h.id === 'valentina-fiery-cougar')!;
    const theo27 = HIS_ARCHETYPES.find((c) => c.id === 'theo-phd-campus-cub')!;
    const rafael26 = HIS_ARCHETYPES.find((c) => c.id === 'rafael-accented-gentleman-cub')!;
    const fieryPhdPairing = analyzePairing(valentina44, theo27, 'her');
    expect(fieryPhdPairing.zodiacSpark).toContain('Aries');
    const fieryPhdIds = createRun(fieryPhdPairing).episodeQueue.map((e) => e.id);
    expect(fieryPhdIds).toContain('spontaneous-18h-pool-sauna-getaway');
    expect(fieryPhdIds).toContain('campus-stroll-sushi-professor-student');
    expect(fieryPhdIds).toContain('fiery-foreign-cougar-passion-test');
    expect(fieryPhdIds).toContain('milestone-one-year-anniversary');

    const modestIds = createRun(analyzePairing(claire45, rafael26, 'him')).episodeQueue.map(
      (e) => e.id,
    );
    expect(modestIds).toContain('retro-bowling-and-meadow-picnic');

    // Broke 21M College Dutch-Splitter (Kayden) triggers both the Venmo Calculator horror & 4-Roommate Cheerios kitchen ambush!
    const kayden21 = HIS_ARCHETYPES.find((c) => c.id === 'kayden-broke-dutch-cub')!;
    const colton25 = HIS_ARCHETYPES.find((c) => c.id === 'colton-montana-cowboy-cub')!;
    const brokeIds = createRun(analyzePairing(claire45, kayden21, 'her')).episodeQueue.map(
      (e) => e.id,
    );
    expect(brokeIds).toContain('broke-college-dutch-calculator-horror');
    expect(brokeIds).toContain('four-roommates-cereal-kitchen-horror');
    expect(brokeIds).toContain('hobosexual-ps5-suitcase-creep');

    const cowboyIds = createRun(analyzePairing(claire45, colton25, 'her')).episodeQueue.map(
      (e) => e.id,
    );
    expect(cowboyIds).toContain('montana-cowboy-age-slider-dare');
    expect(cowboyIds).toContain('black-cat-pushback-golden-retriever-test');
    expect(cowboyIds).toContain('black-cat-thaw-behind-closed-doors');
  });

  it('plays the 3-beat 🐈‍⬛ Black Cat × 🐕 Golden Retriever Slow-Burn Pacing minigame and melts her guard', () => {
    window.history.replaceState({}, '', '/?dilemma=black-cat-pushback-golden-retriever-test');
    render(<App />);

    expect(screen.getByText(/Black Cat × 🐕 Golden Retriever Pacing Meter/i)).toBeInTheDocument();

    // Hitting the rush trap triggers a playful Black Cat hiss without advancing
    fireEvent.click(screen.getByRole('button', { name: /Love-Bomb 9 Texts/i }));
    expect(screen.getByText(/HISS! Too pushy/i)).toBeInTheDocument();

    // Completing all 3 patient Golden-Retriever beats melts her guard!
    fireEvent.click(screen.getByRole('button', { name: /Grin Warmly & Match Her Unhurried Pace/i }));
    fireEvent.click(screen.getByRole('button', { name: /Laugh Unbothered/i }));
    fireEvent.click(screen.getByRole('button', { name: /Hold Calm 7:30 Wine-Bar Plan/i }));

    expect(screen.getByText(/Black Cat Melted!/i)).toBeInTheDocument();
  });

  it('lets players drag the Dating-App Age-Preference Slider to unlock Montana Cowboy (25) and Broke Dutch Trap (21)', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start Vetting/i }));

    const slider = screen.getByLabelText(/Dating app age preference slider/i);
    fireEvent.change(slider, { target: { value: '25' } });
    expect(screen.getByText(/KRISTIN CAVALLARI × MONTANA BOYZ ZONE/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Colton/i).length).toBeGreaterThanOrEqual(2);

    fireEvent.change(slider, { target: { value: '21' } });
    expect(screen.getByText(/SUB-23 DANGER ZONE UNLOCKED/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Kayden/i).length).toBeGreaterThanOrEqual(2);
  });

  it('plays the Cub Bench-Press minigame (5x225 reps) and unlocks Stairway-Carry bonus stats', () => {
    window.history.replaceState({}, '', '/?dilemma=cub-bench-press-cougar-training');
    render(<App />);

    expect(screen.getByText(/Cub Gym Minigame/i)).toBeInTheDocument();
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Press Rep/i }));
    }
    expect(screen.getByText(/5x225 Crushed! Stairway-Carry Strength Unlocked/i)).toBeInTheDocument();
  });

  it('plays the Cougar "Grooming" Salon minigame and polishes all 4 Cub red-carpet upgrades', () => {
    window.history.replaceState({}, '', '/?dilemma=cub-grooming-red-carpet-glowup');
    render(<App />);

    expect(screen.getByText(/Cougar “Grooming” Salon/i)).toBeInTheDocument();
    const groomBtns = screen.getAllByRole('button', { name: /Tap to Groom!/i });
    expect(groomBtns).toHaveLength(4);
    for (const btn of groomBtns) {
      fireEvent.click(btn);
    }
    expect(screen.getByText(/Full “Cougar-Groomed” Glow-Up Complete!/i)).toBeInTheDocument();
  });

  it('activates Founder Unlimited Mode via ?founder=1, grants infinite credits/VIP, and opens the Pop-Culture Quiz', () => {
    window.history.replaceState({}, '', '/?founder=1');
    render(<App />);

    expect(screen.getByText(/Founder Unlimited Mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Founder instant scene jumper/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Pop-Culture Quiz \(\+3 Cr\)/i }));
    expect(
      screen.getByRole('dialog', { name: /Pop-Culture Cougar & Cub Trivia/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Maxx Morando in Palm Springs/i)).toBeInTheDocument();
  });

  it('opens the TikTok-ready 25-Point Viral Experience Checklist via ?checklist=1 and scores checked boxes', () => {
    window.history.replaceState({}, '', '/?checklist=1');
    render(<App />);

    expect(
      screen.getByRole('dialog', { name: /25-Point Cougars & Cubs Viral Experience Checklist/i }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /late 1900s/i }));
    fireEvent.click(screen.getByRole('button', { name: /Babygirl/i }));
    expect(screen.getByText('8/100')).toBeInTheDocument();
  });

  it('renders the interactive 2 AM Doubt Breaker minigame on Stage 5 Doubt episodes and awards EQ + Maturity', () => {
    window.history.replaceState({}, '', '/?dilemma=doubt-cougar-honeymoon-cliff');
    render(<App />);

    expect(screen.getByText(/5·Doubt/i)).toBeInTheDocument();
    expect(screen.getByText(/Reframe All 4 Fears/i)).toBeInTheDocument();

    const reframeBtns = screen.getAllByRole('button', { name: /REFRAME/i });
    expect(reframeBtns).toHaveLength(4);
    for (const btn of reframeBtns) {
      fireEvent.click(btn);
    }
    expect(screen.getByText(/2 AM Spiral Cleared!/i)).toBeInTheDocument();
  });

  it('lets players earn Maturity & EQ via the interactive Sanctuary Prep minigame to unlock Linen-Apron Houseboy Sunday', () => {
    window.history.replaceState({}, '', '/?dilemma=houseboy-sunday-sanctuary');
    render(<App />);

    // Initially stats start at 50/50, so the 60+ gate notice is visible and minigame shows 0/4
    expect(screen.getByText(/Tap All 4 Upgrades/i)).toBeInTheDocument();

    const fixButtons = screen.getAllByRole('button', { name: /TAP TO FIX/i });
    expect(fixButtons).toHaveLength(4);
    for (const btn of fixButtons) {
      fireEvent.click(btn);
    }

    expect(screen.getByText(/Spotless Sanctuary Certified!/i)).toBeInTheDocument();

    // Now picking Choice A grants the full Certified Linen-Apron Houseboy payoff instead of hitting the 60+ gate!
    fireEvent.click(screen.getByRole('button', { name: /Toss him the washed linen apron/i }));
    expect(screen.getByText(/CERTIFIED HOUSEBOY XP/i)).toBeInTheDocument();

    // Unit check idempotency of applyMinigameBonus
    const run = createRun(analyzePairing(HER_ARCHETYPES[0], HIS_ARCHETYPES[0], 'him'));
    const boosted = applyMinigameBonus(run, 'check-drop', { chivalry: 8 }, 'Quick-Draw');
    const duplicate = applyMinigameBonus(boosted, 'check-drop', { chivalry: 8 }, 'Quick-Draw');
    expect(boosted.stats.chivalry).toBe(58);
    expect(duplicate.stats.chivalry).toBe(58);
  });

  it('opens Survive Their Inbox Live AI Texting modal, roasts Snapchat openers, and rewards concrete date plans', async () => {
    const snapVerdict = evaluateDmLocally({
      personaName: 'Claire',
      personaAge: 45,
      personaRole: 'her',
      playerMessage: 'hey u look good for ur age whats ur snap??',
    });
    expect(snapVerdict.passedVibeCheck).toBe(false);
    expect(snapVerdict.maturityDelta).toBeLessThan(0);

    const planVerdict = evaluateDmLocally({
      personaName: 'Claire',
      personaAge: 45,
      personaRole: 'her',
      playerMessage:
        'Booked a quiet corner table for tapas Friday at 7:30 PM—zero planning needed on your end.',
    });
    expect(planVerdict.passedVibeCheck).toBe(true);
    expect(planVerdict.chemistryDelta).toBeGreaterThan(15);

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Live AI Texting Mode/i }));
    expect(
      screen.getByRole('dialog', { name: /Survive Their Inbox/i }),
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Message Claire/i);
    fireEvent.change(input, {
      target: {
        value: 'Booked us a 7:30 wine-bar table Friday evening—peonies included.',
      },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Send$/i }));

    expect(await screen.findByText(/VIBE CHECK PASSED/i)).toBeInTheDocument();
  });

  it('handles Cloudflare Worker /api/health, /api/stats (KV), and /api/inbox-vet (Workers AI + fallback) cleanly', async () => {
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
              herReply: 'Friday at 7:30 works—bring your A-game and zero excuses. 🍸',
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
    const healthJson = (await healthRes.json()) as { ok: boolean; kvBound: boolean; aiBound: boolean };
    expect(healthJson.ok).toBe(true);
    expect(healthJson.kvBound).toBe(true);
    expect(healthJson.aiBound).toBe(true);

    const postStats = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId: 'check-drop', choiceIndex: 0 }),
      }),
      mockEnv,
    );
    expect(postStats.status).toBe(200);
    const statsJson = (await postStats.json()) as { percentages: number[] };
    expect(statsJson.percentages).toHaveLength(3);
    expect(statsJson.percentages.reduce((a, b) => a + b, 0)).toBe(100);

    const aiRes = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/inbox-vet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaName: 'Claire',
          personaAge: 45,
          playerMessage: 'Booked a 7:30 corner booth at The Velvet Lounge this Friday.',
        }),
      }),
      mockEnv,
    );
    expect(aiRes.status).toBe(200);
    const aiJson = (await aiRes.json()) as { passedVibeCheck: boolean; source: string };
    expect(aiJson.passedVibeCheck).toBe(true);
    expect(aiJson.source).toBe('workers-ai');

    // Verify anti-fake referral tracking (/api/referral-hit + /api/referral-status) & one-time checkout guard
    const refHitRes = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/referral-hit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.42' },
        body: JSON.stringify({ refCode: 'vd8k2p9' }),
      }),
      mockEnv,
    );
    expect(refHitRes.status).toBe(200);

    const refStatusRes = await workerApp.fetch(
      new Request('https://cougarsandcubs.club/api/referral-status?code=vd8k2p9'),
      mockEnv,
    );
    const refStatusJson = (await refStatusRes.json()) as {
      uniqueReferrals: number;
      claimableSlots: number;
    };
    expect(refStatusJson.uniqueReferrals).toBe(1);
    expect(refStatusJson.claimableSlots).toBe(1);

    const checkoutOnce = await workerApp.fetch(
      new Request(
        'https://cougarsandcubs.club/api/verify-checkout?session_id=cs_live_a1B2c3D4e5F6g7H8i9J0k1L2m3N4&tier=vip',
      ),
      mockEnv,
    );
    const checkoutOnceJson = (await checkoutOnce.json()) as { verified: boolean; grantType: string };
    expect(checkoutOnceJson.verified).toBe(true);
    expect(checkoutOnceJson.grantType).toBe('vip');

    // Second replay of exact same session_id is rejected!
    const checkoutReplay = await workerApp.fetch(
      new Request(
        'https://cougarsandcubs.club/api/verify-checkout?session_id=cs_live_a1B2c3D4e5F6g7H8i9J0k1L2m3N4&tier=vip',
      ),
      mockEnv,
    );
    const checkoutReplayJson = (await checkoutReplay.json()) as { verified: boolean };
    expect(checkoutReplayJson.verified).toBe(false);
  });
});
