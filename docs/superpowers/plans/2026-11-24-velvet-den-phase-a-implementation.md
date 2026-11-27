# The Velvet Den: Cougars & Cubs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy **The Velvet Den: Cougars & Cubs** (Phase A static browser game + 3-part viral engine + automated affiliate/SEO/Discord growth engine + Phase B/C serverless seams) into a new `clubhost/velvet-den` GitHub repository with automated GitHub Pages deployment.

**Architecture:** A zero-backend Vite + React 19 + TypeScript + Tailwind v4 single-page web application backed by pure domain modules (`taxonomy`, `economy`, `affiliates`, `gameEngine`, `viral`) and swappable Phase B/C service interfaces (`adapters`). All monetization URLs (Ko-fi 0%-fee tips, Stripe Payment Links, Cameo commissions, newsletter capture, and affiliate tags) live in `src/config/monetization.ts`, paired with pre-rendered/crawlable Velvet Journal SEO guides, `sitemap.xml` generation, and a daily GitHub Actions growth bot for Discord and owned social hubs.

**Tech Stack:** TypeScript 5, Vite 6, React 19, Tailwind CSS v4, Lucide React, HTML5 Canvas API, Vitest + Testing Library (`jsdom`), Node 22 ESM automation scripts, GitHub Actions + GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-24-velvet-den-cougars-and-cubs-design.md`

## Global Constraints

- **Zero Explicit NSFW / Payment Rail Safety:** Strictly PG-13/R-rated cheeky comedy and fade-to-black romance; zero explicit erotica, nudity, or adult-toy store domains so Stripe and Ko-fi (§1 & §2.2) remain 100% compliant.
- **Zero Rockstar / Take-Two IP Infringement:** Never use `GTA`, `Grand Theft Auto`, `Pricedown` font, Rockstar star logos, or traced cover layouts; use original Vice-Sunset pop-art SVG mosaic panels and `Bebas Neue` + `Plus Jakarta Sans`.
- **Zero Third-Party Subreddit Spam:** Automated scripts target ONLY owned Discord webhooks, owned brand subreddits, and generated social copy—never `r/CougarsAndCubs`.
- **GitHub Pages Relative Asset Compatibility:** Vite `base` must be `'./'` so assets and query-param deep links (`?challenge=`, `?dilemma=`, `?journal=`, `?unlock=`) work under `https://clubhost.github.io/velvet-den/` and custom domains alike.
- **Responsive Viewport Support:** Zero horizontal overflow from `375px` mobile portrait through `1440px+` desktop widescreen.

## Review Focus

1. **Emoji/UTF-8 names or truncated/tampered `?challenge=` URLs:** `decodeChallengeParam` must encode/decode UTF-8 (`"Chloé 🐆"`) cleanly via `TextEncoder`/`TextDecoder` Base64URL and return `null` (graceful fallback banner, never an uncaught crash) on malformed or truncated query strings (tested in Task 5).
2. **Sub-10-year age gaps in the Pairing Mixer:** Mixing e.g. a 35F Puma with a 28M Cub (7-year gap) must still produce a valid playable `PairingAnalysis` (`isOfficialTenYearGap: false`, badge `"7-Year Puma-Lite Matchup"`) rather than throwing or misclassifying (tested in Task 2).
3. **Corrupted `localStorage` and duplicate reward farming:** `loadWallet` must recover cleanly to 10 daily credits if `localStorage` contains invalid JSON, and `grantRewardCredits` must be idempotent per `rewardKey` (`'first_share'`, `'newsletter_signup'`) so repeated clicks cannot farm unlimited credits (tested in Task 3).
4. **Affiliate URLs with existing query strings or prohibited adult domains:** `buildAffiliateUrl` must append tracking & UTM params via `URL`/`URLSearchParams` without producing double-`?` URLs, and must reject blocklisted explicit adult domains to protect Ko-fi/Stripe compliance (tested in Task 3).
5. **Rewinding out of a 3-Strike Red Flag bust:** Spending 1 credit on `rewindLastChoice` right after hitting `redFlags === 3` (`status: 'busted'`) must restore prior stats, reduce `redFlags` below 3, and flip `status` back to `'playing'` so the player can continue (tested in Task 4).

---

### Task 1: Project Scaffold, Theme Tokens & Monetization/Brand Config

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `index.html`, `.gitignore`
- Create: `src/index.css`, `src/config/brand.ts`, `src/config/monetization.ts`, `tests/setup.ts`, `tests/config.test.ts`

**Interfaces:**
- Produces:
  - `BRAND_CONFIG` in `src/config/brand.ts`: `{ name: string; subtitle: string; repoSlug: string; publicBaseUrl: string; discordInviteUrl: string; ownedSubredditUrl: string }`
  - `MONETIZATION_CONFIG` in `src/config/monetization.ts`: `{ dailyFreeCredits: 10; shareRewardCredits: 3; newsletterRewardCredits: 5; kofiUrl: string; stripeCreditPackUrl: string; stripeVipPassUrl: string; cameoCommissionUrl: string; newsletterActionUrl: string; amazonAssociateTag: string; partnerSubId: string; vipUnlockCodes: string[]; sandboxPreviewMode: boolean }`

- [ ] **Step 1: Scaffold `package.json`, TypeScript, Vite (`base: './'`), Tailwind v4, and Vitest (`jsdom`)**

Install `react`, `react-dom`, `lucide-react` and devDependencies `typescript`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@types/react`, `@types/react-dom`, `@types/node`.

- [ ] **Step 2: Write failing config sanity test in `tests/config.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { BRAND_CONFIG } from '../src/config/brand';
import { MONETIZATION_CONFIG } from '../src/config/monetization';

describe('Project configuration defaults', () => {
  it('exposes spec-pinned credit constants and safe non-empty fallback URLs', () => {
    expect(MONETIZATION_CONFIG.dailyFreeCredits).toBe(10);
    expect(MONETIZATION_CONFIG.shareRewardCredits).toBe(3);
    expect(MONETIZATION_CONFIG.newsletterRewardCredits).toBe(5);
    expect(BRAND_CONFIG.name).toContain('Velvet Den');
    expect(MONETIZATION_CONFIG.vipUnlockCodes.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/config.test.ts`
Expected: FAIL with module not found (`../src/config/brand`).

- [ ] **Step 4: Implement `index.html`, `src/index.css` (Vice-Sunset coral/magenta/teal/gold palette + `Bebas Neue` & `Plus Jakarta Sans`), `src/config/brand.ts`, and `src/config/monetization.ts`**

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/config.test.ts`
Expected: PASS.

- [ ] **Step 6: Initialize git and commit**

```bash
git init -b main && git add . && git commit -m "chore: scaffold Velvet Den Vite + React + Vitest project and brand/monetization config"
```

---

### Task 2: Wildlife Taxonomy, Generational Cohorts & Pairing Mixer Engine

**Files:**
- Create: `src/domain/taxonomy.ts`
- Test: `tests/taxonomy.test.ts`

**Interfaces:**
- Produces:
  - Types: `PlayerRole = 'her' | 'him'`, `FelineTier = 'lynx' | 'puma' | 'cougar' | 'jaguar' | 'panther'`, `GenerationCohort = 'gen_z' | 'millennial' | 'gen_x' | 'icon_60_plus'`, `HerArchetype`, `HisArchetype`, `FieldGuideEntry`, `PairingAnalysis`
  - Constants: `HER_ARCHETYPES: HerArchetype[]` (covering Puma 36F Single-Mom, Cougar 43F "Spoil-Me Princess" Soft-Life, Cougar 45F Done-With-Kids C-Suite, Jaguar 53F Trail-Running Empty-Nester, Panther/Sabertooth 62F Unapologetic Icon), `HIS_ARCHETYPES: HisArchetype[]` (Golden Retriever Houseboy 25M, Wants-Kids Old-Soul 26M, Trail-Runner Himbo 24M, Millennial Architect Cub 32M), `FIELD_GUIDE_ENTRIES: FieldGuideEntry[]` (Lynx, Puma, Cougar, Princess Cougar, Jaguar, Panther/Sabertooth, Cub sub-species including `"hey"` DM Goblin, Kitten, Mountain Lion / Silver Fox)
  - Functions:
    - `classifyFelineTier(age: number): FelineTier` (`22..29` lynx, `30..39` puma, `40..49` cougar, `50..59` jaguar, `>=60` panther)
    - `classifyGeneration(age: number): GenerationCohort` (`<=29` gen_z, `30..45` millennial, `46..61` gen_x, `>=62` icon_60_plus)
    - `analyzePairing(her: HerArchetype, his: HisArchetype, role: PlayerRole): PairingAnalysis` (computes `ageGap`, `felineTier`, `herGeneration`, `hisGeneration`, `isOfficialTenYearGap`, `badgeLabel`, `codeSwitchTip`, and `activeSubplotTags`)

- [ ] **Step 1: Write failing unit tests in `tests/taxonomy.test.ts`**

Assert exact tier boundaries (`39 -> 'puma'`, `40 -> 'cougar'`, `52 -> 'jaguar'`, `61 -> 'panther'`), generational phone-call/emoji code-switch tips (`millennial` warns against unannounced calls & `💀`; `gen_x` favors direct 6 PM calls over all-day texting), official 10+ year gap badge (`45 - 26 = 19`), AND Review Focus #2 (`36 - 29 = 7` returns `isOfficialTenYearGap: false` with `"7-Year Puma-Lite Matchup"` without throwing).

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/taxonomy.test.ts`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `src/domain/taxonomy.ts`**

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/taxonomy.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/taxonomy.ts tests/taxonomy.test.ts
git commit -m "feat: add feline taxonomy encyclopedia, generational cohorts, and pairing analyzer"
```

---

### Task 3: Credits Wallet, VIP Unlocks, Compliant Affiliate Router & Phase B/C Seams

**Files:**
- Create: `src/domain/economy.ts`, `src/lib/affiliates.ts`, `src/services/adapters.ts`
- Test: `tests/economy-affiliates.test.ts`

**Interfaces:**
- Consumes: `MONETIZATION_CONFIG` from `src/config/monetization.ts`
- Produces:
  - `WalletState`: `{ credits: number; lastRefillDate: string; isVip: boolean; unlockedEpisodeIds: string[]; claimedRewards: string[]; unlockedStamps: string[] }`
  - `loadWallet(storage?: Pick<Storage, 'getItem' | 'setItem'>, now?: Date): WalletState`
  - `spendCredits(wallet: WalletState, cost: number): { ok: boolean; wallet: WalletState }` (VIP users bypass episode unlock credit costs; daily credits refill to `max(wallet.credits, 10)` when `YYYY-MM-DD` advances)
  - `grantRewardCredits(wallet: WalletState, rewardKey: string, amount: number): { granted: boolean; wallet: WalletState }`
  - `applyUnlockCodeOrQuery(wallet: WalletState, codeOrSearch: string): { unlocked: 'vip' | 'credits' | null; wallet: WalletState }`
  - `AffiliateProduct` & `AFFILIATE_CATALOG: AffiliateProduct[]` (8 SFW-upscale products: *Japanese Cross-Back Houseboy Linen Apron*, *Ridge Trail Hydration Vest & Electrolytes*, *Mulberry Silk Lounge Robe*, *Matte-Black Lidded Bathroom Bin & Eucalyptus Soap Set*, *600-Thread-Count Percale Hosting Sheets*, *Signature Oud & Bergamot Date-Night EDP*, *Craft Espresso Martini Barware Kit*, *After-Dark Couples Conversation Deck*)
  - `buildAffiliateUrl(product: AffiliateProduct, placement: string): string`
  - `CrowdStatsService` & `AiDmVettingService` interfaces + Phase A local implementations in `src/services/adapters.ts`

- [ ] **Step 1: Write failing tests in `tests/economy-affiliates.test.ts`**

Test daily 10-credit reset across dates, VIP unlock codes (`VELVETVIP` & `?unlock=vip`), Review Focus #3 (corrupted JSON in storage resets safely; calling `grantRewardCredits(wallet, 'first_share', 3)` twice grants `+3` only once), and Review Focus #4 (`buildAffiliateUrl` preserves existing `?th=1` params without double `?`, injects `tag` + `utm_campaign`, and throws on prohibited explicit domains like `lovehoney.com` or `adamandeve.com`).

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/economy-affiliates.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/domain/economy.ts`, `src/lib/affiliates.ts`, and `src/services/adapters.ts`**

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/economy-affiliates.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/economy.ts src/lib/affiliates.ts src/services/adapters.ts tests/economy-affiliates.test.ts
git commit -m "feat: implement daily credits wallet, compliant affiliate router, and Phase B/C adapters"
```

---

### Task 4: Subreddit-Mined Plotlines, App Swipe Deck & Dual-POV Game Engine

**Files:**
- Create: `src/data/appProfiles.ts`, `src/data/episodes.ts`, `src/domain/gameEngine.ts`
- Test: `tests/gameEngine.test.ts`

**Interfaces:**
- Consumes: `PairingAnalysis`, `PlayerRole` from `src/domain/taxonomy.ts`
- Produces:
  - `SwipeProfile` & `APP_SWIPE_PROFILES: SwipeProfile[]` in `src/data/appProfiles.ts` (multi-photo cards with `ageShockZoom: boolean`, Photo 1 trail/suit vs Photo 2 Tito's liquor bottle trap, `"Short-term, open to long"`, `Nightlife` red flags, `"What's your Snap?"` & `"hey"` DM filters, and X-Ray hints)
  - `Episode`, `EpisodeChoice` (with `herPrompt`/`himPrompt`, optional `codeSwitchRawImpulse` banner, optional `innerInsecurityBubble: { herDoubt: string; hisDoubt: string }` split-thought reveal, stat deltas `{ maturity, chivalry, eq, chemistry, redFlags }`, `outcomeText`, optional `badgeUnlocked`, `triggerTipPrompt`, and `recommendedAffiliateId`) & `EPISODES: Episode[]` in `src/data/episodes.ts` covering all 16 spec plotlines (Check-Drop, `"Is That Your Son?"` Waiter, \$80 Babysitter Flake, 6 AM Ridge Trail Run & Short Leash, Princess Treatment & Zero Mental Load, Symmetric Mirror/Game Insecurity Reveal, Generational Code-Switch & Retro 2000s Gap, Earned Linen-Apron Houseboy Sunday, Kids/Fertility Crossroads, plus 4 VIP/Credit Deep-Cuts: *His Place Soap & Lidded-Bin Audit*, *5-Star Palm Springs 3x Income Gap*, *Thanksgiving With Her 23yo Son & His Class-of-'97 Mom*, *Trader Joe's Olive-Oil Aisle Approach*)
  - `Stats = { maturity: number; chivalry: number; eq: number; chemistry: number }`
  - `GameRunState`, `createRun(pairing: PairingAnalysis, includeVipEpisodeIds?: string[]): GameRunState`, `recordAppSwipe`, `applyEpisodeChoice`, `rewindLastChoice(run: GameRunState): GameRunState`, `computeRunSummary(run: GameRunState): RunSummary`

- [ ] **Step 1: Write failing tests in `tests/gameEngine.test.ts`**

Verify: (a) pairing tags dynamically route Single-Mom Babysitter vs Kids Crossroads episodes; (b) `Houseboy Sunday` requires `maturity >= 60 && eq >= 60` or branches to boundary check; (c) 3 Red Flags sets `status: 'busted'`; and (d) Review Focus #5: calling `rewindLastChoice` when `status === 'busted'` (`redFlags === 3`) restores prior stats, drops `redFlags` to `2`, and sets `status: 'playing'`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/gameEngine.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/data/appProfiles.ts`, `src/data/episodes.ts`, and `src/domain/gameEngine.ts`**

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/gameEngine.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/appProfiles.ts src/data/episodes.ts src/domain/gameEngine.ts tests/gameEngine.test.ts
git commit -m "feat: add 14 subreddit-mined plotlines, app swipe traps, and dual-POV game engine"
```

---

### Task 5: 3-Part Viral Engine (2-Player Audition Links, Dilemma Deep Links & Story Receipts)

**Files:**
- Create: `src/lib/viral.ts`
- Test: `tests/viral.test.ts`

**Interfaces:**
- Consumes: `RunSummary` from `src/domain/gameEngine.ts`, `PlayerRole` from `src/domain/taxonomy.ts`
- Produces:
  - `ChallengePayload`: `{ v: 1; senderName: string; senderRole: PlayerRole; herId: string; hisId: string; episodeIds: string[]; preferredChoiceIndices: number[] }`
  - `encodeChallengeLink(payload: ChallengePayload, baseUrl: string): string`
  - `decodeChallengeParam(param: string | null): ChallengePayload | null`
  - `scorePartnerAudition(payload: ChallengePayload, partnerChoiceIndices: number[]): { matchPercent: number; alignedCount: number; verdictTitle: string; roastNotes: string[] }`
  - `buildDilemmaShareLink(episodeOrProfileId: string, baseUrl: string): string`
  - `buildEmojiReceipt(summary: RunSummary, shareUrl: string): string`
  - `drawStoryReceiptToCanvas(canvas: HTMLCanvasElement, summary: RunSummary, publicUrl: string): void`

- [ ] **Step 1: Write failing tests in `tests/viral.test.ts`**

Test round-trip UTF-8/emoji `encodeChallengeLink` → `decodeChallengeParam` (`senderName: "Chloé 🐆"`), Review Focus #1 (truncated/garbled Base64 or wrong schema version returns `null` without throwing), `scorePartnerAudition` compatibility math (`5/5 -> 100%`, `0/5 -> 0%`), and `buildEmojiReceipt` formatting.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/viral.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/viral.ts`**

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/viral.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/viral.ts tests/viral.test.ts
git commit -m "feat: implement zero-backend 2-player audition links, dilemma deep links, and receipt generator"
```

---

### Task 6: Vice-Sunset Pop-Art UI, Viral Views, Velvet Concierge Shop & SEO Journal

**Files:**
- Create: `src/data/journalArticles.ts`
- Create: `src/components/ArtPanels.tsx`, `src/components/TopHudBar.tsx`, `src/components/PairingMixerView.tsx`, `src/components/FieldGuideModal.tsx`, `src/components/AppSwipeStage.tsx`, `src/components/EpisodeStage.tsx`, `src/components/OutcomeAndViralView.tsx`, `src/components/PartnerAuditionView.tsx`, `src/components/BoutiqueAndVipModal.tsx`, `src/components/VelvetJournalView.tsx`
- Create: `src/App.tsx`, `src/main.tsx`
- Test: `tests/app-flows.test.tsx`

**Interfaces:**
- Consumes: All domain/data/viral modules from Tasks 1–5.
- Produces: Complete interactive browser application supporting:
  - Pairing Mixer + Field Guide modal
  - Act I Swipe Stage with `"AGE: 26"` dramatic comic zoom, Photo 1 → Photo 2 Tito's liquor-bottle carousel reveal, 1-Credit X-Ray, and `"What's your Snap?"` filter
  - Act II/III Episode Stage with 4-stat Vice pop-art HUD + animated stat toasts, Brain-to-Mouth Generational Code-Switch box, 1-Credit Smooth Rewind, Peak-Laugh Ko-fi Tip Toast, Contextual Affiliate Drop, Crowd % pill, and `"Ask Bestie"` deep-link share
  - VIP Deep-Cut Episode Unlocker + Boutique/Ko-fi/Stripe/Cameo/Newsletter modal
  - End-of-run Emoji Receipt + 9:16 Canvas Story PNG download + `"Create 2-Player Audition Link"` builder (+3 Credits share reward)
  - Automatic URL entry routing for `?challenge=`, `?dilemma=`, `?journal=`, and `?unlock=`
  - **The Velvet Journal (Dating-Intent SEO)**: 5 age-gap dating & gift guides targeting relationship search intent (never wildlife/cat-owner keywords: e.g., *"Cougar vs. Puma vs. Jaguar Age Chart: Older Woman Dating Younger Man Guide"*, *"Dating an Older Woman in Your 20s: 11 Unwritten Rules"*, *"Best Gifts for an Older Woman Girlfriend Who Has Everything"*, *"First Time Hosting an Older Woman at Your Place Checklist"*, *"Millennial vs. Gen-Z Age-Gap Dating Code-Switching"*) with inline scenario launch buttons and affiliate cards that gracefully work with or without affiliate IDs configured yet.

- [ ] **Step 1: Write failing integration tests in `tests/app-flows.test.tsx`**

Test: (a) rendering the Pairing Mixer, toggling `"Play as Her"` / `"Play as Him"`, opening the Wildlife Field Guide; (b) triggering the `"AGE: 26"` shock zoom and Photo 2 liquor-bottle trap in Act I; (c) opening via a valid `?challenge=` URL renders the personalized Partner Audition flow, while a corrupted `?challenge=%%%bad` URL renders a friendly notice and falls back cleanly to the Mixer; (d) opening The Velvet Journal renders affiliate-linked guides with FTC disclosure.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/app-flows.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `src/data/journalArticles.ts`, UI components, bespoke pop-art SVG illustrations (`src/components/ArtPanels.tsx`), `src/App.tsx`, and `src/main.tsx`**

- [ ] **Step 4: Run full test suite & production Vite build**

Run: `npx vitest run && npm run build`
Expected: All test suites PASS and `dist/` builds with zero TypeScript or Vite errors.

- [ ] **Step 5: Commit**

```bash
git add src/ tests/app-flows.test.tsx
git commit -m "feat: build Vice-Sunset game UI, viral partner auditions, concierge shop, and SEO journal"
```

---

### Task 7: Automated Daily Growth Bot, Sitemap, Playbooks & GitHub Repo Deployment

**Files:**
- Create: `src/data/dailyDilemmas.json`, `scripts/generate-daily-drop.mjs`, `scripts/generate-seo-pages.mjs`, `scripts/generate-sitemap.mjs`
- Create: `.github/workflows/deploy-pages.yml`, `.github/workflows/daily-growth-engine.yml`
- Create: `docs/MONETIZATION_AND_GROWTH_PLAYBOOK.md`, `docs/PHASE_B_C_UPGRADE.md`, `README.md`
- Test: `tests/growth-scripts.test.ts`

**Interfaces:**
- Consumes: `AFFILIATE_CATALOG`, `buildAffiliateUrl` principles, `BRAND_CONFIG`
- Produces:
  - `scripts/generate-daily-drop.mjs`: selects the deterministic daily entry from `src/data/dailyDilemmas.json` (30 days of *"Vet or Ghost?"* dilemmas + taxonomy facts + TikTok/Reels hooks + auto-tagged affiliate pick), writes `dist-social/daily-drop.json` & `dist-social/social-pack.md`, and if `DISCORD_WEBHOOK_URL` is set, POSTs a rich Discord embed with a `?dilemma=` deep link.
  - `scripts/generate-sitemap.mjs`: generates `public/sitemap.xml` (covering root, journal slugs, and public dilemma deep links) and `public/robots.txt`, hooked into `prebuild` in `package.json`.
  - GitHub repository `clubhost/velvet-den` pushed with GitHub Pages deployment live.

- [ ] **Step 1: Write failing test in `tests/growth-scripts.test.ts`**

Verify `src/data/dailyDilemmas.json` has >= 30 unique entries, running `node scripts/generate-daily-drop.mjs --dry-run --date=2026-11-24` produces valid Discord embed JSON + TikTok/owned-subreddit Markdown containing a `?dilemma=` link and FTC-disclosed affiliate link, and `node scripts/generate-sitemap.mjs` writes valid XML in `public/sitemap.xml`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/growth-scripts.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/data/dailyDilemmas.json`, `scripts/generate-daily-drop.mjs`, `scripts/generate-sitemap.mjs`, GitHub workflows, `README.md`, `docs/MONETIZATION_AND_GROWTH_PLAYBOOK.md`, and `docs/PHASE_B_C_UPGRADE.md` (with ready-to-deploy Cloudflare Worker + Gemini Flash code for Phases B & C)**

- [ ] **Step 4: Run all tests, sitemap + daily-drop scripts, and production build**

Run: `npm test && node scripts/generate-daily-drop.mjs --dry-run && npm run build`
Expected: All tests PASS, `dist-social/social-pack.md` generated, `public/sitemap.xml` generated, `dist/` built cleanly.

- [ ] **Step 5: Commit, create GitHub repository `clubhost/velvet-den`, push `main`, and configure GitHub Pages**

```bash
git add . && git commit -m "feat: add daily Discord/social growth bot, SEO sitemap, and Phase B/C upgrade kit"
gh repo create clubhost/velvet-den --public --source=. --remote=origin --push
gh api -X POST repos/clubhost/velvet-den/pages -f build_type=workflow || true
```

Expected: Repository `https://github.com/clubhost/velvet-den` created, code pushed, and `deploy-pages.yml` workflow triggered.
