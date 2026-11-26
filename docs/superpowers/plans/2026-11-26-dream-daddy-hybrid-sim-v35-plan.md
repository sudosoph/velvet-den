# Cougars & Cubs Club v35 (Dream Daddy × Hinge × In The Wild Sim) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Cougars & Cubs Club into a visually cohesive, editorial-luxury *Dream Daddy* × *Hinge* × *In The Wild* romantic-comedy simulation with 20+ 10/10 diverse swipeable characters, 10 deep 3-Date main arcs, `🚩 Cut Loose` text/iMessage red-flag vetting, 12 real-subreddit Cub Obedience School drills, a 7-bucket non-overlapping humor vault, 55+ verified trailer/pop-culture trivia questions, friendly `💛 Support This Project` tipping, and day-one Amazon Associates + Stripe monetization.

**Architecture:** A clean 4-pill editorial shell (`📱 Hinge`, `🗺️ In The Wild`, `💬 Chats & Dates`, `🎓 Cub School`) plus a warm top HUD (`❤️❤️❤️` Friday Hearts, `💛 Support This Project`, `🛍️ Date-Night Shop`, `💎 3 Cr • VIP`, and `☰ Club Extras` drawer) replaces the legacy 57-card grid, geometric PixiJS stick figures, and 8-bit canvas. Pure TypeScript data vaults (`src/data/v35*.ts`) enforce a 7-bucket humor partition via automated tests while feeding an editorial Hinge card scroller, a 10-spot illustrated city map, a capped 6-beat Tinder/iMessage vetting engine, and a full-bleed multi-expression *Dream Daddy* visual-novel date stage.

**Tech Stack:** React 19, TypeScript 5, Tailwind CSS 4, Vite, Vitest + Testing Library, Lucide React, Cloudflare Workers + KV + Workers AI (`worker/index.ts`), PostHog, Stripe Payment Links, Amazon Associates (`/api/go/:id`).

**Spec:** `docs/superpowers/specs/2026-11-26-dream-daddy-hybrid-sim-v35-design.md`

## Global Constraints

- **Zero Banned Filler, Recycled `v34` Gags, or Stage-Direction Pills:** `pine pollen`, `qigong`, `tai chi`, `seed oil`, `bernedoodle`, `maui`, `timeshare`, `sheryl crow`, `james webb`, `tito`, `roblox`, `venmo`, `oatmeal cashmere`, and `photo 1 of` must not appear anywhere in `src/`, `worker/`, or `public/guides/`.
- **Real First-Person Hinge Profiles & Asymmetric Number Polarity:** Hinge profiles render clean interleaved photos, Vitals, and first-person prompts (`"My simple pleasures"`, `"Together, we could"`, `"A friend's review of me"`) with **zero** `"Photo X of 6"` counters, **zero** third-person photo descriptions, and **zero** top/tab pills (`Cortado`, `Kitchen`, `Booth`). When `playerRole === 'her'`, **he** tries to keep her interested to earn **her** number (`📱 Give Him My Number` vs. `🚩 Cut Him Loose`); when `playerRole === 'him'`, **he** earns **her** number.
- **7-Bucket Strict Humor Partition (100% Original Rewrites):** `SEED_COURTROOM_STORIES` in `ClubCourtroomView.tsx` (15 brand-new cases), `COUGAR_CUB_CHECKLIST_ITEMS` in `CougarCubChecklistModal.tsx` (25 brand-new generational moments), and `AFFILIATE_CATALOG` pitches in `src/lib/affiliates.ts` are rewritten from scratch so zero jokes overlap across Cub School, Chat Traps, Hinge, Wild Venues, Crown/Dump, Have You Ever, or Trivia.
- **100% Globally Unique 6-Photo Sets Per Character (Zero Shared Slides 4–6):** Every single profile in `V35_CAST_PROFILES` has **6 globally unique photo URLs** depicting that specific character in 6 distinct personality-driven moments (`new Set(allPhotoUrls).size === allPhotoUrls.length`—never recycling generic kitchen/cocktail/pool filler scenes across multiple men or women).
- **No Pre-Game Age Filter + Real Selective Hinge Matching:** Remove the desired-age filter selector so players encounter the full surprising age spectrum (`21`–`62`) organically. Tapping `❤️` + sending an opener evaluates compatibility against that character's personality: mismatched/generic openers go to `Sent Like (No Match)` (or prompt spotting them `🗺️ In The Wild`), high-EQ openers trigger immediate or delayed `✨ It's a Match!` pop-ins, and `🌹 Send a Rose (1 Cr / VIP)` guarantees priority match attention on selective Standouts.
- **Editorial Luxury UI (No Amateur Clutter):** Retire `PairingMixerView.tsx`, `PixiCubAcademyStage.tsx`, `EightBitAdventureWorld.tsx`, `EpisodeStage.tsx`, `SceneChatInterface.tsx`, and `src/data/episodes.ts`. No front-page multi-banner clutter or Neo-Brutalist comic border soup.
- **Strict Economy & Live Links:** Preserve all 4 live `buy.stripe.com` URLs in `src/config/monetization.ts`. New storage key `velvet_wallet_v35` grants `3` one-time starter credits (`0` daily refill, `0` free credits from quizzes, courtroom, checklists, shares, newsletters, waitlists, or referrals). Friendly `💛 Support This Project` button stays visible in `TopHudBar` and ending/diploma cards.
- **Verified Post-Answer Media Reveal (No Spoilers, No Caption Clutter):** In `PopCultureTriviaModal.tsx`, neither `imageUrl` nor `youtubeEmbedUrl` renders before `selectedOpt !== null`; both reveal *after* answering with zero `<figcaption>` attribution text at the bottom.
- **Real Specific Amazon `/dp/<ASIN>` Products, Real Product Photos & Above-the-Fold Shoppable Guides:** Every product in `AFFILIATE_CATALOG` and `worker/index.ts` (`AFFILIATE_REDIRECT_URLS`) must point to a **verified specific Amazon product page (`https://www.amazon.com/dp/<ASIN>`, zero generic `/s?k=` search pages)** paired with a real studio product photograph under `public/images/products/*.jpg` (retiring all weird SVG box placeholders in `ProductVisualThumbnail.tsx`). Both `VelvetJournalView.tsx` and `scripts/generate-seo-pages.mjs` lead with a `16:9` hero image, an **above-the-fold visual product strip**, interactive `"Text This, Not That"` & `Green Flag vs. Red Flag` cards, and **inline `/api/go/:id` affiliate links on every checklist/watchlist item**.
- **Strict Role-Perspective Symmetry (`playerRole === 'her'` vs. `'him'`):** Never show `"Enroll in Cub Obedience School"` or Cub-targeted coaching to a Cougar player (`playerRole === 'her'`). For `her`, chat fizzles offer `🚩 Cut Him Loose`, `↺ Rewind Beat (2 Cr)`, `🗺️ Meet Better Men In The Wild`, or a cheeky `🎓 Send Him an Obedience Referral Link` share button; `CubSchoolView` defaults to **🐆 Headmistress Mode** for `her` and **🎓 Cub Exam Mode** for `him`; and `/api/inbox-vet` + `adapters.ts` explicitly tailor `coachNote` to the player's role.
- **Zero-404 Compatibility:** Preserve `?challenge=` (`PartnerAuditionView`), `?session_id=` (`/api/verify-checkout`), `/api/go/:id` (`GET` and `HEAD`), and all 16 `/guides/<slug>/` `?dilemma=<slug>` deep links.

## Review Focus

1. **Returning `v34` Browser LocalStorage Migration:** A returning user with `velvet_den_wallet_v1` holding a verified paid `stripe_*` VIP claim must keep `isVip: true` when migrating to `velvet_wallet_v35`, whereas unverified/free legacy balances reset cleanly to the one-time `3` starter credits without re-granting on refresh (pinned in Task 2 tests).
2. **`HEAD` Requests on `/api/go/:id` & Unknown Affiliate IDs:** Social/iMessage link unfurlers send `HEAD /api/go/<id>` — must return `302` with `Location` (including `?tag=` when configured in `env.AMAZON_ASSOCIATE_TAG` or `VELVET_KV`) without crashing or returning `405` (pinned in Task 2 tests).
3. **Premature `🚩 Cut Loose` on a Genuine Lead vs. Disguised Trap:** Clicking `🚩 Cut Loose` on a Genuine Lead (e.g., Julian nervous about academic stipend or Marcus mentioning his same-age mom) must trigger the Bestie self-sabotage check instead of awarding a false Bullet-Dodged bonus, while cutting a Trap (`Connor`, `Graham`, `Devon`, `Vanessa`, `Brooke`) awards `+25` Discernment XP and preserves all 3 Friday Hearts (pinned in Task 5 tests).
4. **Wild-Exclusive vs. Secondary Hotspot Collision:** Visiting a lead's secondary *In The Wild* venue after already unlocking their thread must play their `3-beat Chemistry Cameo` (`+15` chemistry) rather than resetting or duplicating Chat Chapter 1 (pinned in Task 4 tests).
5. **Legacy `/guides/<slug>/?dilemma=<slug>` Inbound SEO Clicks:** Opening `/?dilemma=campus-stroll-sushi-professor-student` or any of the 16 guide slugs must route directly into the matching `v35` Wild Hotspot or Lead instead of falling through to a blank or broken state (pinned in Task 6 tests).

---

### Task 1: Bespoke "Variety of 10/10 Hot" Cast Portraits, Sunset Venue Art & Asset Manifest

**Files:**
- Create: `public/images/cast/soren-26m.jpg`
- Create: `public/images/cast/rory-24m.jpg`
- Create: `public/images/cast/miles-zaddy-31m.jpg`
- Create: `public/images/cast/rafael-hot-26m.jpg`
- Create: `public/images/cast/elena-prof-44f.jpg`
- Create: `public/images/cast/summer-blonde-33f.jpg`
- Create: `public/images/cast/valentina-glam-44f.jpg`
- Create: `public/images/cast/brooke-glam-42f.jpg`
- Create: `public/images/scenes/velvet-room-bar.jpg`
- Create: `public/images/scenes/terminal-b-arrivals.jpg`
- Create: `public/images/scenes/havana-salsa-studio.jpg`
- Create: `public/images/scenes/cougarmarket-wine.jpg`
- Create: `public/images/products/*.jpg` (`12` studio/lifestyle product photos covering aprons, silk robe & pillowcase, percale/bamboo bedding, lidded bathroom bin & botanical soap, copper martini barware & Big Carl goblet, cedar parfum & grooming kit, brass clicker & leather leash, mugs & love coupons, cinema & book stack, weekender duffel & picnic basket, tortoiseshell readers, trail/fitness gear)
- Delete: `public/images/cast/sedona-qigong-46f.jpg`, `public/images/cast/devon-23m.jpg`, `public/images/cast/nadia-41f.jpg`, `public/images/cast/brandon-24m.jpg`
- Create: `src/data/v35AssetManifest.ts`
- Test: `tests/v35-assets-and-hotness.test.ts`

**Interfaces:**
- Produces:
  - `export type PortraitExpression = 'neutral' | 'smirk' | 'laugh' | 'blush' | 'icked';`
  - `export type HairLook = 'platinum_blonde' | 'golden_blonde' | 'dirty_blonde' | 'mediterranean_dark' | 'latin_curls' | 'black_athletic' | 'east_asian' | 'copper_auburn' | 'silver_fox' | 'brunette_glam' | 'south_asian';`
  - `export interface CastVisualEntry { id: string; primaryPortrait: string; sixUniquePhotos: [string, string, string, string, string, string]; hairLook: HairLook; role: 'him' | 'her'; }`
  - `export const V35_CAST_VISUALS: Record<string, CastVisualEntry>`
  - `export const V35_SCENE_BACKDROPS: Record<string, string>`
  - `export const EXPRESSION_MOTION_PRESETS: Record<PortraitExpression, { badge: string; particle: string; tintClass: string; motionClass: string }>`

- [ ] **Step 1: Generate the 8 new 10/10 diverse cast portraits and 4 missing *In The Wild* sunset venue illustrations via `image-generator` subagents**

Generate high-resolution editorial romance-sim portraits (`soren-26m.jpg` Nordic platinum-blonde tennis/architect Adonis, `rory-24m.jpg` golden-blonde Hampstead park ranger with dimples, `miles-zaddy-31m.jpg` 31M dirty-blonde green-eyed Younger Zaddy in charcoal coat curbside at airport, `rafael-hot-26m.jpg` clean-shaven sun-bronzed Brazilian salsa craftsman in rolled black silk shirt, `elena-prof-44f.jpg` chic honey-blonde 44F literature professor in warm library light, `summer-blonde-33f.jpg` sun-kissed California blonde 33F dermatologist, `valentina-glam-44f.jpg` glamorous 44F Riviera icon, `brooke-glam-42f.jpg` glamorous 42F blonde tennis-club socialite) and 4 lush *Dream Daddy*-caliber sunset venue backdrops (`velvet-room-bar.jpg`, `terminal-b-arrivals.jpg`, `havana-salsa-studio.jpg`, `cougarmarket-wine.jpg`). Copy into `public/images/cast/` and `public/images/scenes/`, and remove `sedona-qigong-46f.jpg`, `devon-23m.jpg`, `nadia-41f.jpg`, and `brandon-24m.jpg`.

- [ ] **Step 2: Write the failing asset quality & visual diversity test in `tests/v35-assets-and-hotness.test.ts`**

```ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { V35_CAST_VISUALS, V35_SCENE_BACKDROPS } from '../src/data/v35AssetManifest';

describe('v35 cast hotness floor & visual diversity manifest', () => {
  it('ensures every cast portrait & scene backdrop exists on disk and exceeds 40KB quality floor', () => {
    const entries = Object.values(V35_CAST_VISUALS);
    expect(entries.length).toBeGreaterThanOrEqual(20);
    for (const entry of entries) {
      for (const rel of entry.sixUniquePhotos) {
        const diskPath = path.resolve(process.cwd(), 'public', rel.replace(/^\.\//, ''));
        expect(fs.existsSync(diskPath), `Missing ${diskPath}`).toBe(true);
        expect(fs.statSync(diskPath).size, `Low-res stock image ${diskPath}`).toBeGreaterThan(40_000);
      }
    }
    for (const rel of Object.values(V35_SCENE_BACKDROPS)) {
      const diskPath = path.resolve(process.cwd(), 'public', rel.replace(/^\.\//, ''));
      expect(fs.existsSync(diskPath), `Missing scene ${diskPath}`).toBe(true);
    }
  });

  it('enforces 100% globally unique photo URLs across all 6 slides of every character (zero shared filler scenes) and >= 6 blondes', () => {
    const entries = Object.values(V35_CAST_VISUALS);
    const allUrls = entries.flatMap((e) => e.sixUniquePhotos);
    expect(allUrls.length).toBe(entries.length * 6);
    expect(new Set(allUrls).size).toBe(allUrls.length);
    const blondes = entries.filter((c) => c.hairLook.includes('blonde'));
    expect(blondes.length).toBeGreaterThanOrEqual(6);
    for (const purged of ['sedona-qigong-46f.jpg', 'devon-23m.jpg', 'nadia-41f.jpg', 'brandon-24m.jpg']) {
      expect(fs.existsSync(path.resolve(process.cwd(), 'public/images/cast', purged))).toBe(false);
    }
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/v35-assets-and-hotness.test.ts`
Expected: FAIL with `Cannot find module '../src/data/v35AssetManifest'`

- [ ] **Step 4: Implement `src/data/v35AssetManifest.ts`**

Map all 20+ cast members (`julian`, `soren`, `miles`, `rafael`, `marcus`, `rory`, `jin`, `liam`, `graham`, `connor`, `devon`, `elena`, `claire`, `sienna`, `priya`, `summer`, `celeste`, `astrid`, `camila`, `vivienne`, `vanessa`, `brooke`) to high-res `public/images/cast/` portraits and `public/images/scenes/` lifestyle slides (`>= 40KB` each), plus `V35_SCENE_BACKDROPS` for all 10 *In The Wild* venues and `EXPRESSION_MOTION_PRESETS`.

- [ ] **Step 5: Run test to verify it passes and commit**

Run: `npx vitest run tests/v35-assets-and-hotness.test.ts`
Expected: PASS (`2 passed`)

```bash
git add public/images/ src/data/v35AssetManifest.ts tests/v35-assets-and-hotness.test.ts
git commit -m "feat(v35-art): generate 10/10 diverse blonde & heartthrob portraits, sunset venues, and asset manifest"
```

---

### Task 2: Strict 3-Credit Campaign Wallet, Friendly Support Badge & Day-One Amazon/Stripe Edge Fixes

**Files:**
- Modify: `src/config/monetization.ts`
- Modify: `src/domain/economy.ts`
- Modify: `src/lib/affiliates.ts`
- Modify: `worker/index.ts`
- Test: `tests/v35-economy-and-affiliate.test.ts`

**Interfaces:**
- Produces:
  - `MONETIZATION_CONFIG`: `amazonAssociateTag: 'cougarsandcub-20'`, `starterCredits: 3`, `dailyFreeCredits: 0`, `shareRewardCredits: 0`, `newsletterRewardCredits: 0`, preserving exact `tipJarUrl`, `stripeCreditPackUrl`, `stripeVipPassUrl`, `cameoCommissionUrl`.
  - `WalletState`: adds `fridayHearts: number` (`0..3`, default `3`), `discernmentXp: number` (default `0`), `hasPatronBadge: boolean` (default `false`), `unlockedPovIds: string[]`, `unlockedPhotoIds: string[]`.
  - `WALLET_STORAGE_KEY = 'velvet_wallet_v35'` (migrates verified `stripe_*` VIP from `velvet_den_wallet_v1` once).
  - `loseFridayHeart(wallet: WalletState): WalletState` & `rewindFridayHeartWithCredits(wallet: WalletState, cost?: number): { ok: boolean; wallet: WalletState }` & `recordBulletDodged(wallet: WalletState, personaId: string): WalletState`
  - `AFFILIATE_CATALOG`: purges `seed-oil-free-ghee-evoo-set`, adds `no-hard-feelings-jlaw-prime` and `part-of-your-world-book`.
  - `worker/index.ts`: `/api/go/:id` accepts `GET` and `HEAD`; `/api/verify-checkout` handles `tier=tip` -> `{ verified: true, grantType: 'patron', credits: 0 }` (`0` credit inflation) while `credits` -> `+15`, `vip` -> `vip` + `+15`, `cameo` -> `vip` + `+50`; purges all `pine pollen` / `qigong` / `tai chi` / `seed oil` / `bernedoodle` regexes from `worker/index.ts`.

- [ ] **Step 1: Write the failing economy, migration, affiliate `HEAD`, and Worker cleanliness tests in `tests/v35-economy-and-affiliate.test.ts`**

Test:
1. `createDefaultWallet()` starts with `credits: 3`, `fridayHearts: 3`, `discernmentXp: 0`, `isVip: false`.
2. `loadWallet()` across a simulated next-day UTC boundary does **not** refill credits (`0` daily refill), and migrates `isVip: true` if `velvet_den_wallet_v1` contains `stripe_session_cs_live_123`, while resetting unverified legacy credits to `3`.
3. Every single item in `AFFILIATE_CATALOG` and `AFFILIATE_REDIRECT_URLS` resolves to a specific `https://www.amazon.com/dp/<10-char-ASIN>` product URL (zero `/s?k=` search URLs!), includes `no-hard-feelings-jlaw-prime` and `part-of-your-world-book` (`/dp/1538704374`), and contains zero `seed-oil` IDs or descriptions.
4. `worker.fetch(new Request('https://cougarsandcubs.club/api/go/no-hard-feelings-jlaw-prime', { method: 'HEAD' }), { AMAZON_ASSOCIATE_TAG: 'sophia-20' })` returns `302` with `tag=sophia-20` and `linkCode=ll2` in `Location`.
5. `worker/index.ts` source contains zero matches for `/pine\s*pollen|qigong|tai\s*chi|seed[- ]oil|bernedoodle/i`, and `POST /api/inbox-vet` with `personaRole: 'him'` (meaning human player is `her`) instructs AI / heuristic `coachNote` from the Cougar's perspective (never lecturing her like a Cub).

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/v35-economy-and-affiliate.test.ts`
Expected: FAIL (`credits` is `5`, `HEAD` returns `405`, `seed-oil` still present)

- [ ] **Step 3: Implement updates in `src/config/monetization.ts`, `src/domain/economy.ts`, `src/lib/affiliates.ts`, and `worker/index.ts`**

Update wallet migration & heart/discernment helpers, zero out all free credit constants (`VERIFIED_REFERRAL_REWARD_CREDITS = 0`, `WAITLIST_REWARD_CREDITS = 0`), update `AFFILIATE_CATALOG` + `AFFILIATE_REDIRECT_URLS`, support `HEAD` on `/api/go/:id`, update `isTip` in `handleVerifyCheckout` to grant `grantType: 'patron'` with `credits: 0`, and purge legacy wellness regexes from `worker/index.ts`.

- [ ] **Step 4: Run test to verify it passes and commit**

Run: `npx vitest run tests/v35-economy-and-affiliate.test.ts`
Expected: PASS (`5 passed`)

```bash
git add src/config/monetization.ts src/domain/economy.ts src/lib/affiliates.ts worker/index.ts tests/v35-economy-and-affiliate.test.ts
git commit -m "feat(v35-economy): enforce one-time 3 starter credits, patron tip badge, and Amazon HEAD redirect"
```

---

### Task 3: 7-Bucket Non-Overlapping Content Vault (Cast, 10 Wild Venues, 6-Beat Chats, 3-Date Scripts, 12 Cub School Drills & 55-Q Verified Trailer Quiz)

**Files:**
- Create: `src/data/v35Cast.ts`
- Create: `src/data/v35WildVenues.ts`
- Create: `src/data/v35ChatsAndDates.ts`
- Create: `src/data/v35CubSchool.ts`
- Modify: `src/data/popCultureTrivia.ts`
- Modify: `src/components/ClubCourtroomView.tsx` (rewrite `SEED_COURTROOM_STORIES` with 15 brand-new original cases)
- Modify: `src/components/CougarCubChecklistModal.tsx` (rewrite `COUGAR_CUB_CHECKLIST_ITEMS` with 25 brand-new original generational moments)
- Modify: `src/lib/affiliates.ts` (refresh `cheekyPitch` & `badge` copy to remove Maui timeshare / recycled `v34` references)
- Modify: `src/data/dailyDilemmas.json`
- Modify: `src/data/journalArticles.ts`
- Modify: `src/domain/taxonomy.ts`
- Test: `tests/v35-content-uniqueness.test.ts`

**Interfaces:**
- Consumes: `V35_CAST_VISUALS`, `V35_SCENE_BACKDROPS`, `PortraitExpression` from `src/data/v35AssetManifest.ts`.
- Produces:
  - `src/data/v35Cast.ts`:
    - `export interface HingePromptItem { id: string; question: string; answer: string; openers: [ { text: string; delta: number }, { text: string; delta: number }, { text: string; delta: number; isVipSmooth: true } ]; }`
    - `export interface V35CastProfile { id: string; name: string; age: number; role: 'him' | 'her'; tier: 'main_lead' | 'trap' | 'cameo'; discoveryDoor: 'hinge' | 'wild' | 'both'; primaryWildVenueId?: string; secondaryWildVenueId?: string; tagline: string; vitals: { height: string; job: string; school: string; neighborhood: string; lookingFor: string; kidsStance: string }; slides: { url: string; caption: string; tag: string }[]; prompts: [HingePromptItem, HingePromptItem, HingePromptItem]; trapTellSummary?: string; vulnerabilityNote?: string; }`
    - `export const V35_CAST_PROFILES: V35CastProfile[]` (`22` total: `10` `main_lead` + `5` `trap` + `7` `cameo`).
  - `src/data/v35WildVenues.ts`:
    - `export interface WildVenueSpot { id: string; number: number; name: string; subtitle: string; emoji: string; backdropUrl: string; primaryHerLeadId: string; primaryHimLeadId: string; secondaryCameoLeadId: string; sceneSetupHer: string; sceneSetupHim: string; choicesHer: { label: string; outcomeText: string; unlocksChatWithId?: string; chemistryBonus: number; isMemeFail?: boolean }[]; choicesHim: { label: string; outcomeText: string; unlocksChatWithId?: string; chemistryBonus: number; isMemeFail?: boolean }[]; cameoBeat: { speakerId: string; line: string; boostText: string }; }`
    - `export const V35_WILD_VENUES: WildVenueSpot[]` (`10` hotspots: `velvet-room`, `hawthorne-campus`, `terminal-b-airport`, `havana-salsa`, `palisades-racquet`, `st-jude-coffee`, `left-bank-books`, `dawn-lap-pool`, `cougarmarket`, `velvet-palms-bbq`).
  - `src/data/v35ChatsAndDates.ts`:
    - `export interface ChatBeat { beatNumber: 1 | 2 | 3 | 4 | 5 | 6; incomingMessages: string[]; photoDrop?: { id: string; previewCaption: string; imageUrl: string; unlockCost: 2 }; choices: [ { text: string; reply: string; delta: number }, { text: string; reply: string; delta: number }, { text: string; reply: string; delta: number; cost: 1; badge: string } ]; trapClueHint?: string; }`
    - `export interface DateSceneScript { dateNumber: 1 | 2 | 3 | 4; title: string; venueBackdrop: string; prepAffiliateIds?: string[]; beats: { speakerExpression: PortraitExpression; dialogue: string; bestiePopIn?: string; choices: { label: string; response: string; nextExpression: PortraitExpression; chemistryDelta: number; cost?: number; locksOutSRank?: boolean; triggersCubSparring?: boolean; triggersTurnTablesRevenge?: boolean }[] }[]; secretBestiePovLeak: { friendName: string; messages: string[]; cost: 2 }; }`
    - `export const V35_CHAT_CHAPTERS: Record<string, { tinder: ChatBeat[]; imessage: ChatBeat[]; cutLooseVerdict: { isActualTrap: boolean; headline: string; bestieNote: string; receiptShareLine: string } }>`
    - `export const V35_DATE_SCRIPTS: Record<string, DateSceneScript[]>`
  - `src/data/v35CubSchool.ts`:
    - `export interface CubSchoolDrill { id: string; moduleNumber: number; title: string; redditComplaintQuote: string; scenarioSetup: string; rookieCrime: string; options: [ { label: string; isGoldStar: boolean; headmistressVerdict: string; expression: PortraitExpression }, { label: string; isGoldStar: boolean; headmistressVerdict: string; expression: PortraitExpression }, { label: string; isGoldStar: boolean; headmistressVerdict: string; expression: PortraitExpression } ]; fixItAffiliateId?: string; }`
    - `export const V35_CUB_SCHOOL_DRILLS: CubSchoolDrill[]` (`12` real-subreddit complaint drills).
  - `src/data/popCultureTrivia.ts`: `POP_CULTURE_TRIVIA` expanded to `>= 55` non-repeating questions across Movies (*No Hard Feelings* `kIcLb0KAJAs`, *Babygirl* `-8Sx6U6Ou0Q`, *The Idea of You* `V8i6PB0gGOA`, *Bridget Jones: Mad About the Boy* `DhAcAgULwYY`, *Good Luck to You, Leo Grande* `TJcbZoJFLTU`, *American Pie* `lp9Z4gc-9UA`, *Prime*, *The Graduate* `KVNFaxJspMQ`, *How Stella Got Her Groove Back* `r3wbXFzPqcs`, *Something's Gotta Give* `3d9UYuqXz0I`, *The Proposal* `Wbhhokv84K4`, *Cha Cha Real Smooth* `QRyyagJ9GPo`, *Magic Mike's Last Dance* `pBIGdw-BRxw`, *Home Again* `TOyit5_mEQA`, *The Rebound* `PlCsLXcmxaA`, *The Good Girl* `dLRRX2iK7tQ`, *Bull Durham* `qnWSvSrb1-I`, *Harold and Maude* `_ckWTn-y5Rw`, *White Palace*, *Sunset Boulevard*, *Happiness for Beginners*, *I Could Never Be Your Woman*), TV (*Samantha & Smith*, *Rebecca & Sam*, *Gerri & Roman*, *Sylvie & Erik*, *White Lotus*, *Younger*, *Cougar Town*, *Mrs. Fletcher*, *Hacks*, *Desperate Housewives*, *30 Rock*), Books (*Chéri*, *Part of Your World*, *The Idea of You*, *All Fours*, *Vladimir*, *On the Island*, *The Only Story*, *Flirting with Forty*), Songs (*"Stacy's Mom"* `dZLfasMPOU4`, *"Mrs. Robinson"* `WTxS7RrjqqY`, *"Maneater"* `yRYFKcMa_Ek`, *"Betty (Get Money)"* `8oE5Z2GLhNc`, *"Maggie May"*, Cher, Madonna, Mariah), and 28 Celebrity Couples (`3` to `40` yr gaps), with optional `youtubeEmbedUrl?: string`.

- [ ] **Step 1: Write the failing 7-bucket uniqueness, banned-trope purge, and 55-Q trailer quiz test in `tests/v35-content-uniqueness.test.ts`**

Assert:
1. Zero occurrences of `/pine\s*pollen|qigong|tai\s*chi|seed[- ]oil|bernedoodle|timeshare|sheryl\s*crow|james\s*webb|roblox|1\.75l\s+bottle\s+of\s+tito|venmo|oatmeal\s+cashmere|photo\s+\d+\s+of\s+\d+/i` across `src/` and `worker/`.
2. `V35_CAST_PROFILES` has `>= 20` profiles (`10` `main_lead` with 3+ Date scripts each, `5` `trap`, `>= 5` `cameo`), each with 6 clean photo URLs (optional natural Hinge photo prompt only, zero third-person narrator descriptions, zero room/outfit tab pills) and 3 casual first-person Hinge prompts.
3. `V35_WILD_VENUES` has exact length `10` including Terminal B Zaddy luggage coordination & Hawthorne University Post-Grades Rule.
4. `V35_CUB_SCHOOL_DRILLS` has exact length `12` covering the 12 real `r/CougarsAndCubs` complaints, and none of its 12 topics (`"trash can"`, `"flat pillow"`, `"whats ur snap"`, `"u have snap"`, `"charitable donation"`, `"sti panel"`) appear in `SEED_COURTROOM_STORIES`, `COUGAR_CUB_CHECKLIST_ITEMS`, `v35Cast.ts`, or `v35ChatsAndDates.ts`.
5. `SEED_COURTROOM_STORIES` (`15` brand-new cases) and `COUGAR_CUB_CHECKLIST_ITEMS` (`25` brand-new generational items) share zero 5-word n-grams with each other or with any other `v35` module.
6. `POP_CULTURE_TRIVIA.length >= 55`, includes *No Hard Feelings* (Jennifer Lawrence) with `https://www.youtube-nocookie.com/embed/kIcLb0KAJAs`, and every `youtubeEmbedUrl` uses `https://www.youtube-nocookie.com/embed/` with one of the 23 `oembed`-verified 11-char IDs.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/v35-content-uniqueness.test.ts`
Expected: FAIL (`v35Cast` module missing, banned tropes still present in legacy files)

- [ ] **Step 3: Implement `v35Cast.ts`, `v35WildVenues.ts`, `v35ChatsAndDates.ts`, `v35CubSchool.ts`, and clean/expand `popCultureTrivia.ts`, `dailyDilemmas.json`, `journalArticles.ts`, and `taxonomy.ts`**

Author witty, human, non-overlapping scripts grounded in real community lingo (including British `"half seven / sorted / xx"`, Zaddy curbside luggage coordination, Campus Post-Grades ethics, and 55 verified pop-culture & trailer questions). Clean any lingering wellness phrases from `taxonomy.ts`, `dailyDilemmas.json`, `journalArticles.ts`, and `appProfiles.ts`.

- [ ] **Step 4: Run test to verify it passes and commit**

Run: `npx vitest run tests/v35-content-uniqueness.test.ts`
Expected: PASS

```bash
git add src/data/ src/domain/taxonomy.ts tests/v35-content-uniqueness.test.ts
git commit -m "feat(v35-content): add 7-bucket partitioned cast, 10 wild venues, 12 cub school drills & 55-Q trailer quiz"
```

---

### Task 4: Editorial Luxury Design System, Authentic Hinge Feed & 10-Spot Illustrated "In The Wild" Map

**Files:**
- Modify: `src/index.css`
- Create: `src/components/HingeFeedView.tsx`
- Create: `src/components/InTheWildMapView.tsx`
- Test: `tests/v35-hinge-and-wild.test.tsx`

**Interfaces:**
- Consumes: `V35_CAST_PROFILES`, `V35CastProfile` from `src/data/v35Cast.ts`; `V35_WILD_VENUES`, `WildVenueSpot` from `src/data/v35WildVenues.ts`; `WalletState` from `src/domain/economy.ts`.
- Produces:
  - `HingeFeedView`: props `{ role: 'her' | 'him'; wallet: WalletState; matchedLeadIds: string[]; cutLooseIds: string[]; onSendHingeOpener: (leadId: string, promptOrSlideLabel: string, openerText: string, cost: number, delta: number) => void; onSwitchRole: (role: 'her' | 'him') => void; onOpenWildMap: () => void }`
  - `InTheWildMapView`: props `{ role: 'her' | 'him'; activeLeadThreads: string[]; completedCameoVenues: string[]; onUnlockWildLead: (leadId: string, venueId: string, bonus: number) => void; onCompleteCameo: (venueId: string, leadId: string, bonus: number) => void }`

- [ ] **Step 1: Write the failing UI tests in `tests/v35-hinge-and-wild.test.tsx`**

Test:
1. `HingeFeedView` renders an authentic vertical Hinge card (`Name` header, interleaved full-bleed `3:4` photos, Vitals strip with `Age`, `Height`, `Job`, `School`, `Looking For`, and 3 first-person prompts) with **zero** desired-age pre-filter, **zero** `"Photo 1 of 6"` text, and **zero** wardrobe/room tab pills (`Cortado`, `Kitchen`, `Booth`, `Oatmeal Cashmere`); sending a low-effort/mismatched opener puts the profile into `Sent Like (No Immediate Match)` while continuing the shuffled deck, whereas picking the personality-attuned opener (or `🌹 Send a Rose • 1 Cr`) triggers a real match (with delayed match pop-in support on selective leads).
2. `InTheWildMapView` renders all 10 illustrated hotspots (`The Velvet Room`, `Hawthorne University`, `Terminal B Arrivals`, etc.); selecting `Terminal B Arrivals` as `her` plays Miles's luggage-taking & car/dinner-coordinating scene and calls `onUnlockWildLead('miles', 'terminal-b-airport', ...)`; visiting a hotspot whose lead is already in `activeLeadThreads` plays the `3-beat Chemistry Cameo` (`onCompleteCameo`) instead of duplicating Chapter 1.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/v35-hinge-and-wild.test.tsx`
Expected: FAIL (`HingeFeedView` not found)

- [ ] **Step 3: Implement editorial CSS tokens/animations in `src/index.css`, `src/components/HingeFeedView.tsx`, and `src/components/InTheWildMapView.tsx`**

Replace harsh black comic borders with warm alabaster/velvet editorial styling (`rounded-3xl`, soft warm elevation shadows, serif display names, smooth spring animations, idle portrait breathing keyframes, and full-bleed `3:4` / `16:9` imagery).

- [ ] **Step 4: Run test to verify it passes and commit**

Run: `npx vitest run tests/v35-hinge-and-wild.test.tsx`
Expected: PASS

```bash
git add src/index.css src/components/HingeFeedView.tsx src/components/InTheWildMapView.tsx tests/v35-hinge-and-wild.test.tsx
git commit -m "feat(v35-discovery): build editorial Hinge feed and 10-spot illustrated In The Wild map"
```

---

### Task 5: Capped 6-Beat Chat Vetting (`🚩 Cut Loose`), *Dream Daddy* Animated 3-Date Stage & 🎓 Cub Obedience School

**Files:**
- Create: `src/components/DreamDaddyDateStage.tsx`
- Create: `src/components/ChatsAndDatesView.tsx`
- Create: `src/components/CubSchoolView.tsx`
- Test: `tests/v35-vetting-dates-and-school.test.tsx`

**Interfaces:**
- Consumes: `V35_CHAT_CHAPTERS`, `V35_DATE_SCRIPTS` from `src/data/v35ChatsAndDates.ts`; `V35_CUB_SCHOOL_DRILLS` from `src/data/v35CubSchool.ts`; `EXPRESSION_MOTION_PRESETS` from `src/data/v35AssetManifest.ts`; `AFFILIATE_CATALOG`, `buildAffiliateUrl` from `src/lib/affiliates.ts`.
- Produces:
  - `DreamDaddyDateStage`: full-bleed sunset/candlelit stage rendering character portrait with live `PortraitExpression` transitions (`neutral`, `smirk`, `laugh`, `blush`, `icked`), breathing animation, floating reaction particles, Bestie (**Jade** / **Sam**) SMS pop-in, interconnected Velvet Palms cast references, Pre-Date #2 Amazon Affiliate prep drawer, Date #2 interactive set-piece, animated ***Dream Daddy* `S / A / B / C` Date Rank Screen**, post-date `2 Cr` **🔓 Unlock Their Secret Bestie Text POV** modal, S-Rank / Bittersweet / Turn-the-Tables Revenge ending Polaroid (with warm `💛 Support This Project` CTA), and `3 Cr` Date #4 Epilogue unlock.
  - `ChatsAndDatesView`: multi-match `activeThreads` roster (showing **all** matched leads simultaneously—fixing the `v34` 1-match bug) where each Hinge match has **one single evolving thread** that starts strictly in **App DM UI** (zero premature iMessage tab!) and upgrades into **blue-bubble iMessage UI** only upon Beat-6 number graduation (or immediately for *In The Wild* leads), featuring a clear **`🔥 After-Dark Spicy Toggle`** in iMessage (replacing the vague `v34` `"Flirt Mode"` label so it visibly shifts quick-replies & AI banter into bold late-night chemistry + `2 Cr` Blurred Photo Drops), free-typing live AI input (`0 Cr`), non-blocking `🍸 Go on Date` unlock banner, and persistent **`🚩 Cut Loose`** button.
  - `CubSchoolView`: 12-drill interactive **Cub Obedience School** (`🐆 Headmistress` & `🎓 Cub Candidate` toggle, animated Gold Star / Detention stamp, contextual *"Send Him the Fix"* Amazon partner cards, and shareable **Certified Housebroken Cub Diploma** with `💛 Support This Project` link).

- [ ] **Step 1: Write the failing vetting, date progression, POV unlock, and Cub School tests in `tests/v35-vetting-dates-and-school.test.tsx`**

Test:
1. Matching with 3 different Hinge leads (`julian`, `soren`, `graham`) populates **all 3** simultaneously in `ChatsAndDatesView`'s sidebar, and each ungraduated Hinge thread renders strictly in `App DM` mode with **zero** premature `iMessage` tab until Beat 6 graduation (`📱 Give Him My Number` -> upgrades that thread into blue-bubble `iMessage`).
2. Hitting `🚩 Cut Loose` on disguised Trap `graham` (7 PM vanish / married) awards `+25` Discernment XP, preserves `fridayHearts === 3`, and renders the shareable **🏆 Bullet-Dodged Receipt**.
3. Hitting `🚩 Cut Loose` on Genuine Lead `julian` opens the Bestie self-sabotage reality-check confirmation instead of awarding a false trap bonus.
4. Completing all 6 beats on Genuine Lead `soren` unlocks **Date 1** on `DreamDaddyDateStage`, updates portrait expression state across beats, enforces *The Robert Night-1 Pacing Test*, renders the animated **`S / A / B` Date Rank** summary, and unlocks the `2 Cr` **Secret Bestie Text POV** modal.
5. Ignoring Trap tells through Beat 6 into Date 1 triggers a **Date Disaster** (`fridayHearts` drops from `3` to `2`, offering `2 Cr` Time-Turner Rewind).
6. `CubSchoolView` defaults to `🐆 Headmistress` framing when `role === 'her'` (and `🎓 Cub Candidate` when `role === 'him'`), steps through the 12 real-subreddit complaint drills, renders contextual Amazon *"Send Him the Fix"* partner link (`target="_blank"`), and produces the shareable Diploma; and `ChatsAndDatesView` when `role === 'her'` **never** asks her to *"earn his number"* or *"Enroll in Cub Obedience School"*—instead *he* works to keep her interested and she chooses **`📱 Give Him My Number`** vs. **`🚩 Cut Him Loose`**.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/v35-vetting-dates-and-school.test.tsx`
Expected: FAIL (`ChatsAndDatesView` missing)

- [ ] **Step 3: Implement `DreamDaddyDateStage.tsx`, `ChatsAndDatesView.tsx`, and `CubSchoolView.tsx`**

Build full-bleed *Dream Daddy* visual-novel staging with smooth expression animations, capped 6-beat chat progression, `🚩 Cut Loose` discernment loop, Secret POV leaks, and the 12-module Cub Obedience School.

- [ ] **Step 4: Run test to verify it passes and commit**

Run: `npx vitest run tests/v35-vetting-dates-and-school.test.tsx`
Expected: PASS

```bash
git add src/components/DreamDaddyDateStage.tsx src/components/ChatsAndDatesView.tsx src/components/CubSchoolView.tsx tests/v35-vetting-dates-and-school.test.tsx
git commit -m "feat(v35-sim): implement 6-beat Cut-Loose vetting, Dream Daddy animated date stage, and Cub School"
```

---

### Task 6: Uncluttered Shell, Friendly `💛 Support This Project` HUD, 55-Q Trailer Quiz Player, Legacy Retirement & SEO Build Verification

**Files:**
- Modify: `src/components/TopHudBar.tsx`
- Modify: `src/components/ProductVisualThumbnail.tsx` (render crisp `<img>` product photography instead of SVG placeholder boxes)
- Modify: `src/components/VelvetJournalView.tsx` (add hero imagery, above-the-fold visual product cards, `"Text This, Not That"` iMessage bubbles, `Green/Red Flag` split cards, and 100% affiliate-linked checklist/watchlist rows)
- Modify: `src/components/PopCultureTriviaModal.tsx` (hide `imageUrl` & `youtubeEmbedUrl` until `selectedOpt !== null`, remove `<figcaption>` credit line, add optional Amazon watch/read CTA on reveal)
- Modify: `src/components/BoutiqueAndVipModal.tsx`
- Modify: `src/components/PartnerAuditionView.tsx`
- Modify: `src/App.tsx`
- Modify: `scripts/generate-seo-pages.mjs` (upgrade static `/guides/*/index.html` with hero photos, above-the-fold visual product cards with `<img>`, `"Text This / Not That"` callouts, and linked items)
- Delete: `src/components/PairingMixerView.tsx`, `src/components/PixiCubAcademyStage.tsx`, `src/components/EightBitAdventureWorld.tsx`, `src/components/EpisodeStage.tsx`, `src/components/SceneChatInterface.tsx`, `src/components/MinigameWidgets.tsx`, `src/data/episodes.ts`
- Test: `tests/v35-shell-and-trailer-quiz.test.tsx`

**Interfaces:**
- Consumes: All `v35` views and data modules from Tasks 1–5.
- Produces:
  - Unified uncluttered `App.tsx` shell with 4 primary navigation tabs (`📱 Hinge`, `🗺️ In The Wild`, `💬 Chats & Dates`, `🎓 Cub School`), `❤️❤️❤️` Friday Hearts + Discernment Rank in `TopHudBar`, warm visible **`💛 Support This Project`** button (`tipJarUrl`), `🛍️ Date-Night Shop` & `💎 Credits / VIP` modal (`0` free credit giveaways), `☰ Club Extras` drawer (`🎬 55-Q Trailer & Pop Quiz`, `👑 Crown or Dump`, `✅ 25-Pt Experience Test`, `📖 16 Guides & Zodiac`, `📸 Dateodex`, `ℹ️ About`), `PartnerAuditionView` (`?challenge=`), and automatic routing for all 16 `?dilemma=<slug>` SEO guide links into their matching `v35` Lead or *In The Wild* venue.

- [ ] **Step 1: Write the failing shell, friendly support CTA, YouTube trailer embed, and SEO `?dilemma=` routing tests in `tests/v35-shell-and-trailer-quiz.test.tsx`**

Test:
1. Default screen renders clean editorial Hinge discovery (no 57-card grid, no stick-figure canvas, no 8-bit boxes) with visible `💛 Support This Project` link pointing to `MONETIZATION_CONFIG.tipJarUrl`, `❤️❤️❤️` Friday Hearts, and `3 Cr` starter balance.
2. Opening `🎬 55-Q Trailer & Pop Quiz` shows **zero** answer `<img>` or `<iframe>` before selecting an option (preventing spoilers), then reveals the celebrity photo / `youtube-nocookie.com/embed/` trailer *after* clicking an option with zero `<figcaption>` attribution text, and grants `0` free credits on completion.
3. Opening `📖 Guides` (`VelvetJournalView`) renders a hero `<img>`, an **above-the-fold** shoppable product card strip with real `public/images/products/*.jpg` photography (zero SVG placeholder boxes), `"Text This, Not That"` interactive callouts, and inline `/api/go/` affiliate links on checklist items.
4. Visiting `/?dilemma=campus-stroll-sushi-professor-student` routes cleanly into `InTheWildMapView` at `hawthorne-campus` (zero broken links), and `/?challenge=` renders `PartnerAuditionView`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/v35-shell-and-trailer-quiz.test.tsx`
Expected: FAIL

- [ ] **Step 3: Refactor `TopHudBar.tsx`, `PopCultureTriviaModal.tsx`, `BoutiqueAndVipModal.tsx`, `ClubCourtroomView.tsx`, `CougarCubChecklistModal.tsx`, `PartnerAuditionView.tsx`, `App.tsx`, and `scripts/generate-seo-pages.mjs`; delete retired `v34` clutter files and update/remove obsolete `v34`-specific tests**

Ensure zero unused imports, zero `tsc -b` errors, zero free credit buttons in Courtroom/Checklist/Trivia/Boutique, and regenerated static `/guides/*/index.html` pages with zero banned wellness phrases.

- [ ] **Step 4: Run full test suite and production build (`tsc -b && vite build && generate-seo-pages`)**

Run: `npm test && npm run build`
Expected: PASS (`0` failed test suites, `0` TypeScript errors, clean `dist/` + `public/guides/` output)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(v35): unify Dream Daddy x Hinge x In The Wild simulation shell, trailer quiz, and clean SEO routes"
```
