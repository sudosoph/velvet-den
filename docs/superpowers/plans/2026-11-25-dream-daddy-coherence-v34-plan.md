# Cougars & Cubs Club v34 (*Dream Daddy* Coherence, Desktop Phone Landing & PostHog) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify *Cougars & Cubs Club* into a coherent *Dream Daddy*-style romance & vetting simulator featuring an Option A Desktop Phone Landing, 6-photo Hinge profiles with zero cross-person portrait bugs, rich diverse cast archetypes (`5'1"`–`6'3"`), complete Club Guides, an Instagram-style Share Sheet, a visual 32-item Boutique with tight 5-credit unit economics, and end-to-end PostHog conversion/affiliate/share analytics.

**Architecture:** We layer a persisted career & *Dadbook*-style profile memory state (`src/domain/matchCareer.ts`) and an optional-env PostHog telemetry module (`src/lib/analytics.ts` + Cloudflare Worker `/ingest/*` proxy and `posthog-node` edge events) cleanly beneath refactored React views (`PairingMixerView`, `LiveInboxModal`, `EightBitAdventureWorld`, `AboutClubView`, `BoutiqueAndVipModal`, `PopCultureTriviaModal`, `VelvetJournalView`, and `SocialShareSheetModal`). All 57 cast portraits remain strictly `aspect-[3/4]` (`0.75`) inside bounded widths with zero cross-person gallery reuse.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, Tailwind CSS 4, PixiJS 8, Cloudflare Workers (KV + Workers AI), `posthog-js@1`, `@posthog/react@1`, `posthog-node@6`, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-25-dream-daddy-coherence-v34-design.md`

## Global Constraints

- Hero slogan MUST be `"Lower Your Age Slider. Vet the Red Flags. Win Real Love."` — zero `"Draft [Name]"`, zero `"Draft Your Roster"`, and zero user-facing `"Viral"` self-labels (`"Have You Ever?"` / `"25-Pt Club Score"` instead).
- Zero banned external forum terms (`r-e-d-d-i-t`, `s-u-b-r-e-d-d-i-t`, `r/cougar`, `modest-roots`), zero em-dashes (`—`) in chat/UI copy, zero bio-reciting texts, and zero `"babe"` from female personas across `src/`, `scripts/`, and `worker/`.
- Zero unlicensed tabloid/paparazzi photos; Pop-Culture Quiz & Hall of Fame portraits use verified Wikimedia Commons `CC-BY` / `CC-BY-SA` / Public Domain URLs with visible attribution captions.
- Zero cross-person portrait reuse: no `./images/cast/<person>.jpg` file may appear in any other character's `photoUrl`, `galleryPhotos`, or `photos` array; every Hinge profile has `>= 6` captioned slides (`Slide 1` = own `3:4` portrait; `Slides 2–6` = 5 face-free POV camera-roll shots, excluding `wine-bar-booth.jpg` hand shots on mismatched profiles).
- Portrait containers MUST use `aspect-[3/4]` with bounded `max-w` (never `lg:max-w-none` + clamped `max-h-[...]` or `h-52`/`h-64 w-full`).
- Quarantine Qigong/Tai Chi strictly to `sedona-qigong-mommy` (`46F`), GF/seed-oil-free + Mini Bernedoodle strictly to `sloane-seedoil-bernedoodle-mommy` (`42F`), and Reformer Pilates Push-Present / Mommy-Makeover strictly to `summer-32f` (`32F`).
- `dailyFreeCredits: 5`, `newsletterRewardCredits: 3`, `shareRewardCredits: 0`; Match #1 Off-App iMessage unlock is `0 Cr`, while 2nd+ Off-App iMessage unlocks, Early Flirt Boost, and Chat Unmatch Rewind cost `2 Cr` (all `$0` with `$6.99` VIP Black Card).
- PostHog keys (`VITE_POSTHOG_PROJECT_TOKEN`, `VITE_POSTHOG_HOST`, Worker `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) MUST be read optionally via env vars (never hardcoded in source), erroring loudly in browser dev if missing while staying a safe no-op in Vitest and unconfigured builds.

## Review Focus

1. **Direct Cold Entry into `LiveInboxModal` Before Any Swipes**: Opening `💬 Chats` cold when `matchedIds` is empty must auto-seed 1 starter match for the active player role so `LiveInboxModal` never crashes on `undefined` `selected` contact, while displaying `"1 Starter Match • Swipe to Match With More!"`.
2. **Ad-Blocker & Missing-Env Resilience for PostHog**: When `VITE_POSTHOG_PROJECT_TOKEN` is unset (e.g., CI/Vitest or fork builds) or network calls to `/ingest` reject, `trackEvent` and `/api/go/:id` redirects must never throw or delay navigation.
3. **Narrow Viewport (`360px`–`768px`) Overflow in `BoutiqueAndVipModal` & `TopHudBar`**: Inputs inside grid/flex forms must carry `min-w-0 w-full` with buttons stacking full-width below `sm`/`lg` so buttons never bleed across card borders, and `TopHudBar` must collapse cleanly below `lg`.
4. **3-Date Cumulative Stat Gate Reachability**: Cumulative stats stored in `matchCareer.ts` (`starting at 55`) must carry into `createCharacterDateRun(pairing, dateStage)` so Date #2/#3 scenes with `maturity >= 60 && eq >= 60` (`houseboy-sunday-sanctuary`) are reachable without soft-locking.
5. **`?dilemma=` Deep Links & Clipboard Fallback in Share Sheet**: Visiting `?dilemma=tyler-snapchat-ick` or `?dilemma=her-claire-45` must still route cleanly, and clicking `Send to Bestie` / `Ask Bestie` must copy the URL immediately *and* open `SocialShareSheetModal`.

---

### Task 1: PostHog Client, Worker Edge Capture & First-Party `/ingest` Proxy

**Files:**
- Modify: `package.json`, `package-lock.json`, `.gitignore`, `src/main.tsx`, `worker/index.ts`
- Create: `.env.example`, `src/lib/analytics.ts`
- Test: `tests/analytics.test.ts`

**Interfaces:**
- Produces in `src/lib/analytics.ts`:
  - `initPostHogClient(): PostHog | null`
  - `trackEvent(event: VelvetAnalyticsEvent, properties?: Record<string, unknown>): void`
  - `identifyPlayerWithContact(contactEmailOrHandle: string, extraProps?: Record<string, unknown>): void`
  - `getPostHogTracingHeaders(): Record<string, string>`

- [ ] **Step 1: Install PostHog packages**
  Run: `npm install --save posthog-js@1 @posthog/react@1 posthog-node@6`
  Expected: `package.json` and `package-lock.json` updated cleanly with exit code `0`.

- [ ] **Step 2: Write the failing test in `tests/analytics.test.ts`**
  ```ts
  import { describe, expect, it, vi } from 'vitest';
  import {
    buildAnalyticsPayload,
    getOrCreateStablePlayerUuid,
    trackEvent,
    identifyPlayerWithContact,
  } from '../src/lib/analytics';

  describe('PostHog analytics contract & safe no-op guard', () => {
    it('attaches app="cougars_and_cubs_club" and never throws when token is unset in Vitest', () => {
      const payload = buildAnalyticsPayload({ product_id: 'leopard-print-cougar-apron', placement: 'boutique' });
      expect(payload.app).toBe('cougars_and_cubs_club');
      expect(payload.product_id).toBe('leopard-print-cougar-apron');
      expect(() => trackEvent('affiliate_clicked', { product_id: 'leopard-print-cougar-apron' })).not.toThrow();
    });

    it('generates a stable non-PII UUID for distinct_id and never uses raw email as distinct_id', () => {
      const id1 = getOrCreateStablePlayerUuid();
      const id2 = getOrCreateStablePlayerUuid();
      expect(id1).toBe(id2);
      expect(id1).toMatch(/^cc_[a-z0-9-]+$/i);
      expect(() => identifyPlayerWithContact('sophia@example.com', { role: 'her' })).not.toThrow();
    });
  });
  ```

- [ ] **Step 3: Run test to verify it fails**
  Run: `npx vitest run tests/analytics.test.ts`
  Expected: FAIL with module `../src/lib/analytics` not found.

- [ ] **Step 4: Implement `src/lib/analytics.ts`, `.env.example`, `src/main.tsx`, and Worker `/ingest` proxy + edge capture in `worker/index.ts`**
  - Create `.env.example` with `VITE_POSTHOG_PROJECT_TOKEN=phc_your_project_token_here` and `VITE_POSTHOG_HOST=/ingest` (ensure `.env` and `.env.local` are in `.gitignore`).
  - In `src/lib/analytics.ts`: read `import.meta.env.VITE_POSTHOG_PROJECT_TOKEN` and `import.meta.env.VITE_POSTHOG_HOST` optionally; in `import.meta.env.DEV && !import.meta.env.VITEST` log `console.error("VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured")` when unset; initialize `posthog.init(token, { api_host: host || '/ingest', ui_host: 'https://us.posthog.com', defaults: '2026-08-30', capture_exceptions: true })` when set; wrap `<App />` in `<PostHogProvider client={posthog}>` in `src/main.tsx` when initialized.
  - In `worker/index.ts`: add `/ingest/*` reverse proxy forwarding static assets to `https://us-assets.i.posthog.com` and ingestion calls to `env.POSTHOG_HOST || 'https://us.i.posthog.com'`, plus non-blocking `ctx.waitUntil` `PostHog` (`posthog-node`) server-side `captureImmediate` + `shutdown` on `/api/go/:id` (`affiliate_redirect_served`), `/api/verify-checkout` (`checkout_verified_server`), `/api/waitlist` (`waitlist_submitted_server`), and `/api/subscribe` (`newsletter_subscribed_server`) whenever `env.POSTHOG_PROJECT_TOKEN` is configured.

- [ ] **Step 5: Run test to verify it passes**
  Run: `npx vitest run tests/analytics.test.ts`
  Expected: PASS.

- [ ] **Step 6: Commit**
  ```bash
  git add package.json package-lock.json .gitignore .env.example src/lib/analytics.ts src/main.tsx worker/index.ts tests/analytics.test.ts
  git commit -m "feat(analytics): add PostHog React & Cloudflare Worker SDKs with /ingest proxy"
  ```

---

### Task 2: Unique Cast Portraits, Zero Cross-Person Gallery Contamination, 6-Photo Hinge Vitals, Petite Heights & Diverse Archetypes

**Files:**
- Create: `public/images/cast/sloane-42f.jpg`, `public/images/cast/rafael-26m.jpg`, `public/images/cast/chadwick-24m.jpg`, `public/images/cast/sam-25m.jpg`
- Modify: `src/domain/taxonomy.ts`, `src/data/appProfiles.ts`
- Test: `tests/taxonomy.test.ts`

**Interfaces:**
- Produces in `src/domain/taxonomy.ts`:
  - `HingePhotoSlide`: `{ url: string; caption: string; tag: string }`
  - `HingeExtendedProfile`: `{ schoolAndMajor: string; fieldOfWork: string; jobTitle: string; bio: string; lifeStance: string; funFacts: [string, string]; prompts: { question: string; answer: string }[]; slides: HingePhotoSlide[]; memoryKeyword: string; memoryRewardLine: string; matchSelectivity: 'warm' | 'selective' | 'chaos_twist' }`
  - `getHingeExtendedProfile(person: HerArchetype | HisArchetype): HingeExtendedProfile`
  - New `SubplotTag` union additions: `'soft_mommy_domme' | 'cub_daddy_zaddy' | 'glamma_grandmother' | 'trophy_wife_reborn' | 'tradwife_homemaker' | 'eat_pray_love_nomad' | 'csa_ranch_dreamer'`

- [ ] **Step 1: Generate/stage unique `3:4` portraits for `sloane-42f.jpg`, `rafael-26m.jpg`, `chadwick-24m.jpg`, and `sam-25m.jpg`**
  Use `image-generator` (and any un-deployed unique cast artifacts) cropped/sized at `3:4` (`0.75`) in `public/images/cast/` so zero profiles across `taxonomy.ts` or `appProfiles.ts` share a `photoUrl`.

- [ ] **Step 2: Write the failing tests in `tests/taxonomy.test.ts`**
  Add tests asserting:
  - Every `HER_ARCHETYPES` (`39`, covering every integer age `30..64`) and `HIS_ARCHETYPES` (`18`) has a 100% unique `photoUrl` (`new Set(all.map(p => p.photoUrl)).size === all.length`).
  - Zero cast portrait files (`./images/cast/...` belonging to any character) ever appear inside any *other* character's `galleryPhotos`, `getHingeExtendedProfile(p).slides`, or `appProfiles.ts` `photos`.
  - Every character's `getHingeExtendedProfile(p)` returns `slides.length >= 6`, non-empty `schoolAndMajor`, `fieldOfWork`, `bio`, `funFacts.length === 2`, and `prompts.length === 3`.
  - At least `10` women in `HER_ARCHETYPES` have petite heights in `["5'1\"", "5'2\"", "5'3\"", "5'4\""]`.
  - `/qigong|tai chi/i` matches ONLY `sedona-qigong-mommy`; `/bernedoodle|seed-oil|canola/i` matches ONLY `sloane-seedoil-bernedoodle-mommy`; `/mommy makeover|push present/i` matches ONLY `summer-32f` (or her ID `summer-beach-puma`).
  - `FIELD_GUIDE_ENTRIES` puts `princess_cougar` in `crossover_lore` with `/Any Age/i`, includes `soft_mommy_domme_lore`, `cub_daddy_zaddy_lore`, and `bucket_list_tourist_lore` (zero Qigong/Bernedoodle in `FIELD_GUIDE_ENTRIES`), and includes comprehensive `pop_culture` entries for `Priyanka Chopra & Nick Jonas`, `Heidi Klum & Tom Kaulitz`, `Tina Turner & Erwin Bach`, `Cher`, `Demi Moore & Ashton Kutcher`, `Kris Jenner & Corey Gamble`, `Brigitte & Emmanuel Macron`, `Gabrielle Union & Dwyane Wade`, and `How Stella Got Her Groove Back`.

- [ ] **Step 3: Run tests to verify they fail**
  Run: `npx vitest run tests/taxonomy.test.ts`
  Expected: FAIL on duplicate `brooke-42f.jpg`/`mateo-26m.jpg`, cross-person galleries, missing `getHingeExtendedProfile`, and zero petite heights.

- [ ] **Step 4: Implement cast refresh, gallery cleanup, `getHingeExtendedProfile`, and Hall of Fame expansion in `src/domain/taxonomy.ts` and `src/data/appProfiles.ts`**
  - Update heights (`10+` petite `5'1"`–`5'4"` women), quarantine Sedona (`46F`), Sloane (`42F` with `sloane-42f.jpg`), and Summer (`32F` Reformer Pilates Push-Present / Mommy-Makeover Puma), and assign all portrait-aligned real-world archetypes (Hannah `33F` Tradwife Homemaker, Zoe `34F` 5:30 AM Horse Girl, Priya `35F` Trauma RN, Chloé `37F` Child-Free Jet-Setter, Amber `40F` `5'1"` & Helen `63F` `5'2"` Art & Estate Jewelry Collectors, Serena `43F` `5'2"` Burned-by-Older-Ex Trophy Wife, Simone `44F` / Monica `49F` / Vivienne `61F` Soft Mommy-Domme, Diana `50F` `5'2"` 200h→300h RYT *Eat Pray Love* Nomad, Renée `52F` `5'4"` Fishbowl Principal, Margot `55F` `5'3"` CSA & Ranch Dreamer, Evelyn `56F` `5'5"` Second-Act Widow, Celeste `62F` & Beatrice `64F` `5'3"` Active "Glam-ma" Grandmothers).
  - Clean all cross-person portraits out of `taxonomy.ts` and `appProfiles.ts`; strip early `"🚩"` labels from `HIS_ARCHETYPES` / `appProfiles.ts` titles so red/green flags are never spoiled upfront; implement `getHingeExtendedProfile(person)` using only face-free POV scene images (`sunday-kitchen-sanctuary.jpg`, `hotel-pool-sauna.jpg`, `campus-autumn-sushi.jpg`, `candlelit-cocktails.jpg`, `coastal-convertible.jpg`, `cozy-rain-suite.jpg`, `luxury-bedroom-sanctuary.jpg`, `neon-bowling-lounge.jpg`, `palm-springs-resort.jpg`, `wedding-gala-cheers.jpg`, `dog-park-picnic.jpg`).
  - Expand `FIELD_GUIDE_ENTRIES` with comprehensive Pop-Culture Hall of Fame entries and clean Romance & Polarity entries.

- [ ] **Step 5: Run tests to verify they pass**
  Run: `npx vitest run tests/taxonomy.test.ts`
  Expected: PASS.

- [ ] **Step 6: Commit**
  ```bash
  git add public/images/cast/ src/domain/taxonomy.ts src/data/appProfiles.ts tests/taxonomy.test.ts
  git commit -m "feat(cast): unique portraits, 6-photo Hinge profiles, petite heights, diverse archetypes & Hall of Fame"
  ```

---

### Task 3: Exit-Ready 5-Credit Economy, Visual 32-Item Boutique, Responsive Overflow Fix & Instagram-Style Share Sheet

**Files:**
- Modify: `src/config/monetization.ts`, `src/domain/economy.ts`, `src/lib/affiliates.ts`, `src/components/BoutiqueAndVipModal.tsx`, `scripts/generate-seo-pages.mjs`
- Create: `src/components/ProductVisualThumbnail.tsx`, `src/components/SocialShareSheetModal.tsx`
- Test: `tests/config.test.ts`, `tests/economy-affiliates.test.ts`, `tests/viral.test.ts`

**Interfaces:**
- Produces in `src/components/ProductVisualThumbnail.tsx`:
  - `ProductVisualThumbnail: React.FC<{ item: AffiliateProduct; compact?: boolean }>`
- Produces in `src/components/SocialShareSheetModal.tsx`:
  - `ShareSheetPayload`: `{ title: string; message: string; url: string; shareSurface: 'audition' | 'bestie_profile' | 'pop_quiz' | 'checklist_25pt' | 'guide' | 'verdict_receipt'; discordMarkdown?: string; onDownloadStoryPng?: () => void }`
  - `SocialShareSheetModal: React.FC<{ payload: ShareSheetPayload | null; onClose: () => void }>`

- [ ] **Step 1: Update & write failing tests in `tests/config.test.ts`, `tests/economy-affiliates.test.ts`, and `tests/viral.test.ts`**
  - Assert `MONETIZATION_CONFIG.dailyFreeCredits === 5`, `newsletterRewardCredits === 3`, `shareRewardCredits === 0`.
  - Assert every item in `AFFILIATE_CATALOG` (`32` items) has `visualSpec` metadata and zero `/qigong|bernedoodle/i` leaked in `badge` (except `seed-oil-free-ghee-evoo-set` if tied to clean pantry).
  - Assert `SocialShareSheetModal` renders circular share actions for `iMessage / SMS`, `WhatsApp`, `Instagram`, `TikTok`, `Discord`, `X`, `Threads`, `Telegram`, and `Copy Link`, and fires `share_triggered` on click.

- [ ] **Step 2: Run tests to verify they fail**
  Run: `npx vitest run tests/config.test.ts tests/economy-affiliates.test.ts tests/viral.test.ts`
  Expected: FAIL on `dailyFreeCredits === 10` and missing `SocialShareSheetModal` / `ProductVisualThumbnail`.

- [ ] **Step 3: Implement economy tuning, `ProductVisualThumbnail.tsx`, `SocialShareSheetModal.tsx`, and responsive 3-tab `BoutiqueAndVipModal.tsx`**
  - Update `src/config/monetization.ts` (`dailyFreeCredits: 5`, `newsletterRewardCredits: 3`, `shareRewardCredits: 0`).
  - Add rich illustrated SVG/studio product card visuals (`ProductVisualThumbnail.tsx`) for all 32 items in `src/lib/affiliates.ts` (leopard apron, Trophy Husband apron, brass clicker, wine goblet, silk robe, copper martini shaker, lidded matte-black bin + botanical soap, bamboo sheets, movie posters, etc.) + clean out Qigong/Bernedoodle badges.
  - Build `SocialShareSheetModal.tsx` with direct deep-share links (`sms:?&body=...`, `https://wa.me/?text=...`, Instagram copy + inbox open + optional 9:16 PNG download, TikTok copy + open, Discord markdown copy, X intent, Threads intent, Telegram share, Copy Link, `navigator.share` fallback) + `trackEvent('share_triggered', ...)`.
  - Refactor `BoutiqueAndVipModal.tsx` with `initialSection?: 'shop' | 'vip' | 'rewards'` tabs, visual product thumbnails on every shop card, `min-w-0 w-full` inputs + responsive stacked buttons (`grid-cols-1 lg:grid-cols-...`, zero horizontal bleed!), and PostHog `paywall_opened` / `stripe_checkout_clicked` / `affiliate_clicked` / `identifyPlayerWithContact` events.

- [ ] **Step 4: Run tests to verify they pass**
  Run: `npx vitest run tests/config.test.ts tests/economy-affiliates.test.ts tests/viral.test.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/config/monetization.ts src/domain/economy.ts src/lib/affiliates.ts src/components/ProductVisualThumbnail.tsx src/components/SocialShareSheetModal.tsx src/components/BoutiqueAndVipModal.tsx scripts/generate-seo-pages.mjs tests/config.test.ts tests/economy-affiliates.test.ts tests/viral.test.ts
  git commit -m "feat(monetization): 5-credit economy, visual 32-item boutique, overflow-proof UI & IG share sheet"
  ```

---

### Task 4: 3-Date Career Engine, Polarity Episodes, Verified `CC-BY` Pop-Culture Quiz & Complete Club Guides

**Files:**
- Create: `src/domain/matchCareer.ts`
- Modify: `src/domain/dateodex.ts`, `src/domain/progression.ts`, `src/domain/gameEngine.ts`, `src/data/episodes.ts`, `src/data/popCultureTrivia.ts`, `src/components/PopCultureTriviaModal.tsx`, `src/components/CougarCubChecklistModal.tsx`, `src/components/InGameClubAside.tsx`, `src/components/FieldGuideModal.tsx`, `src/data/journalArticles.ts`, `src/components/VelvetJournalView.tsx`
- Test: `tests/gameEngine.test.ts`

**Interfaces:**
- Produces in `src/domain/matchCareer.ts`:
  - `VelvetDadbookProfile`: `{ fridayVibe: 'candlelit_bistro' | 'home_cooking' | 'spontaneous_escape'; polarityStyle: 'princess_romance' | 'soft_good_boy' | 'witty_equal'; dealbreaker: 'snapchat_streaks' | 'venmo_math' | 'bucket_list_tourists' }`
  - `MatchCareerState`: `{ dadbook: VelvetDadbookProfile; swipedIds: string[]; matchedIds: string[]; superLikedIds: string[]; unmatchedIds: string[]; rehabbedIds: string[]; dateStageByMatchId: Record<string, 0 | 1 | 2 | 3>; statsByMatchId: Record<string, RelationshipStats> }`
  - `loadMatchCareer(): MatchCareerState`, `saveMatchCareer(state: MatchCareerState): void`
  - `checkProfileMemoryHit(person: HerArchetype | HisArchetype, playerText: string): { hit: boolean; bonusLine: string }`
- Produces in `src/domain/gameEngine.ts`:
  - `createCharacterDateRun(pairing: PairingAnalysis, dateStage: 0 | 1 | 2, priorStats?: RelationshipStats): GameRunState`

- [ ] **Step 1: Verify Wikimedia Commons `CC-BY` / `CC-BY-SA` / Public Domain URLs & write failing tests in `tests/gameEngine.test.ts`**
  - Query `https://commons.wikimedia.org/w/api.php` via quick script to confirm open-licensed portrait URLs + exact photographer & license strings for the Pop-Culture Quiz & Hall of Fame celebrities.
  - Add tests in `tests/gameEngine.test.ts` asserting:
    - `princess-soft-life` is queued for `princess_treatment` pairings across 30s, 40s, 50s, and 60s+ (not restricted to 40s) and uses pure sweeping romance copy.
    - `createCharacterDateRun(pairing, 0)` builds a focused 3-scene Date #1 run and carries `priorStats` into Date #2/#3 so `houseboy-sunday-sanctuary` (`>= 60` gate) unlocks cleanly.
    - `POP_CULTURE_TRIVIA` contains zero Qigong/Bernedoodle/seed-oil questions, includes *How Stella Got Her Groove Back* & *Priyanka / Tina Turner / Demi*, and includes verified Wikimedia Commons attribution metadata.
    - `JOURNAL_ARTICLES` has `>= 4` sections (or `10` checklist items) on `first-time-hosting-older-woman-apartment-checklist` and `>= 3` substantive sections on every guide (zero 1-paragraph stubs!).

- [ ] **Step 2: Run tests to verify they fail**
  Run: `npx vitest run tests/gameEngine.test.ts`
  Expected: FAIL on missing `matchCareer.ts`, missing `createCharacterDateRun`, 40s-only `princess_treatment`, and stubbed `JOURNAL_ARTICLES`.

- [ ] **Step 3: Implement `matchCareer.ts`, 3-Date runs, Polarity episodes, `CC-BY` Pop-Culture Quiz + Share Card, and complete Club Guides**
  - Create `src/domain/matchCareer.ts`; update `dateodex.ts` (`'S' | 'A' | 'B' | 'C' | 'F'`) and `progression.ts` (clean subculture XP titles, `companionAdopted` replacing Bernedoodle wording).
  - Reframe `princess-soft-life` in `src/data/episodes.ts` & `src/domain/gameEngine.ts` to any-age sweeping romance; add standalone episodes `soft-mommy-domme-good-boy-command`, `cub-daddy-zaddy-dinner-takeover`, and `bucket-list-tourist-instant-block`; quarantine `qigong-tai-chi-wellness-mommy-domme` (renamed title without Mommy-Domme) to Sedona and `seed-oil-gluten-free-bernedoodle-mommy` to Sloane.
  - Update `CougarCubChecklistModal.tsx` & `InGameClubAside.tsx` (replace `"Viral"` labels with `"Have You Ever?"` / `"25-Pt Club Score"`; swap 2 wellness boxes for `"Good Boy" / "Cub Daddy"` polarity & `Bucket-List Tourist` block; wire `SocialShareSheetModal`).
  - Update `popCultureTrivia.ts`, `PopCultureTriviaModal.tsx`, and `FieldGuideModal.tsx` with verified Wikimedia Commons `CC-BY` / `CC-BY-SA` / PD portraits + credit captions + 1-tap Wordle-style **Share Score Card**.
  - Expand all 16 articles in `journalArticles.ts` and upgrade `VelvetJournalView.tsx` with **interactive 10-Point Apartment Hosting Checkboxes**, **interactive 12-Sign Her × Him Chemistry Picker**, `ProductVisualThumbnail` cards, and **1-tap Share Guide** button.

- [ ] **Step 4: Run tests to verify they pass**
  Run: `npx vitest run tests/gameEngine.test.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/domain/matchCareer.ts src/domain/dateodex.ts src/domain/progression.ts src/domain/gameEngine.ts src/data/episodes.ts src/data/popCultureTrivia.ts src/components/PopCultureTriviaModal.tsx src/components/CougarCubChecklistModal.tsx src/components/InGameClubAside.tsx src/components/FieldGuideModal.tsx src/data/journalArticles.ts src/components/VelvetJournalView.tsx tests/gameEngine.test.ts
  git commit -m "feat(content): 3-date career engine, CC-BY pop quiz share card, complete guides & polarity episodes"
  ```

---

### Task 5: Option A Desktop Phone Landing, `About` Page, Balanced 3-Zone Nav, Connected Chat/Obedience Loop & "In The Wild" 8-Bit Map

**Files:**
- Create: `src/components/AboutClubView.tsx`
- Modify: `src/components/TopHudBar.tsx`, `src/components/PairingMixerView.tsx`, `src/components/AppSwipeStage.tsx`, `src/components/LiveInboxModal.tsx`, `src/components/EightBitAdventureWorld.tsx`, `src/components/OutcomeAndViralView.tsx`, `src/components/PartnerAuditionView.tsx`, `src/components/PixiCubAcademyStage.tsx`, `src/App.tsx`
- Test: `tests/app-flows.test.tsx`, `tests/review-fixes.test.tsx`, `tests/v2-interactive.test.tsx`

**Interfaces:**
- Consumes: `matchCareer.ts`, `analytics.ts`, `SocialShareSheetModal.tsx`, `ProductVisualThumbnail.tsx`, `getHingeExtendedProfile`, `createCharacterDateRun`.
- Produces: Complete end-to-end `v34` application, passing 100% of migrated & new test suites + production Vite/SEO build.

- [ ] **Step 1: Update & write failing integration tests in `tests/v2-interactive.test.tsx`, `tests/app-flows.test.tsx`, and `tests/review-fixes.test.tsx`**
  - Assert `"Lower Your Age Slider. Vet the Red Flags. Win Real Love."` is rendered on home landing and zero `"Draft "` / `"Viral IRL"` labels exist.
  - Assert Option A Desktop Phone Simulator renders 6-slide Hinge profile vitals (School/Major, Field of Work, Bio, Fun Facts, `aspect-[3/4]` portrait), `Send to Bestie`, and triggers animated **`IT'S A MATCH!`** celebration adding the match to `LiveInboxModal`.
  - Assert `TopHudBar` renders balanced 3-zone navigation (`Swipe`, `Chats`, `Club Map`, `Obedience`, `Lore & Quizzes`, `About`, `Shop`, `Tip $5`, `Credits / VIP`) and clicking `About` renders `AboutClubView`.
  - Assert `LiveInboxModal` supports Profile Memory Bonus, 2-strike Unmatched Receipt (`Rewind` `2 Cr` or `🦮 Cub Obedience` rehab), Discord `#ask-the-den` Advice Suggestion Pills, matched Visual Gift Pick card, and 3-turn iMessage → **Go on Date #1** handoff.
  - Assert `EightBitAdventureWorld` renders the 6 `"In The Wild"` venues (*Wine & CSA*, *Gym & Smoothie*, *Hotel Lobby Bar*, *UV Bouncer Bistro*, *Sunday Sanctuary*, *Club Gift Shop*) with zero Qigong/Bernedoodle/Pop-Quiz duplication.

- [ ] **Step 2: Run tests to verify they fail**
  Run: `npx vitest run tests/app-flows.test.tsx tests/review-fixes.test.tsx tests/v2-interactive.test.tsx`
  Expected: FAIL on old `v32` `"Draft Your Roster"` / 8-Bit Qigong / missing `About` & Phone Landing UI.

- [ ] **Step 3: Implement `AboutClubView.tsx`, 3-Zone `TopHudBar.tsx`, Option A Desktop Phone `PairingMixerView.tsx`, Connected `LiveInboxModal.tsx`, "In The Wild" `EightBitAdventureWorld.tsx`, and `App.tsx` wiring**
  - Build `AboutClubView.tsx` and wire `activeTab === 'about'` in `TopHudBar.tsx` and `App.tsx`.
  - Rebuild `TopHudBar.tsx` into a clean, responsive 3-zone aligned header with `Lore & Quizzes ▾` menu, mobile drawer toggle below `lg`, and visible `🛍️ Shop`, `🍸 Tip $5`, and `💎 Credits / VIP` CTAs.
  - Transform `PairingMixerView.tsx` into the **Option A Desktop Phone Simulator Landing** (left column = Hero slogan, 3-tap *Velvet Profile* setup, Earned Matches tray, `Invite Bestie` / `Send 60s Audition`, `About` anchor; right column = interactive iPhone frame housing the scrollable 6-photo Hinge profile with `aspect-[3/4]` uncropped portraits, School/Major, Job/Field, Bio, 2 Fun Facts, 3 Prompts, `✕ Pass` / `★ Super Like` / `❤️ Match` / `👯‍♀️ Send to Bestie`, and animated **`IT'S A MATCH!`** celebration).
  - Upgrade `AppSwipeStage.tsx` (`aspect-[3/4]` uncropped portraits, zero early `"had hidden red flags"` spoiler toast, organic match/clue reveal, `SocialShareSheetModal`).
  - Upgrade `LiveInboxModal.tsx` (Earned Match Queue with 1 starter match fallback on cold open; Profile Memory Bonus floating hearts; `2 Cr` gate on 2nd+ iMessage unlock / early Flirt boost / Unmatch Rewind; `🦮 Send to Cub Obedience School` rehab button; Discord `#ask-the-den` / `#in-the-wild-help` / `#cub-training-101` clickable Advice Suggestion Pills; 3-turn iMessage → Date #1/#2/#3 Handoff Card; visual `ProductVisualThumbnail` gift card in right panel).
  - Retheme `EightBitAdventureWorld.tsx` to the 6 `"In The Wild"` neighborhood venues, 3 original street approach micro-encounters, and 3 subculture goblins (Snap Bro, Bucket-List Tourist, `$19.50` Venmo Splitter).
  - Connect `OutcomeAndViralView.tsx`, `PartnerAuditionView.tsx`, and `PixiCubAcademyStage.tsx` (rehab clears chat strike + `aspect-[3/4]` portraits + `SocialShareSheetModal` + Date #1/#2 `"Return to iMessage for Next Date"` progression).

- [ ] **Step 4: Run full test suite, TypeScript + SEO build, and banned-term check**
  Run: `npm test -- --run && npm run build && ! grep -riE "r""eddit|subr""eddit|r/cougar|modest-roots" src/ scripts/ worker/`
  Expected: All test files PASS (`0` errors), `npm run build` exits `0`, banned-term grep exits `0`.

- [ ] **Step 5: Commit**
  ```bash
  git add src/ tests/ index.html public/
  git commit -m "feat(v34): Option A desktop phone landing, About page, 3-date coherence, In-The-Wild 8-bit & PostHog"
  ```
