# Zero-to-Approved Monetization, Affiliate & Growth Playbook

This guide walks you step by step from **zero affiliate accounts today** to fully automated tips, credit/VIP sales, affiliate commissions, newsletter revenue, and organic search/social growth—all by editing a single config file (`src/config/monetization.ts`) or GitHub Repository Variables.

---

## 1. Getting Approved for Amazon Associates & Levanta / Impact (15 Minutes)

Because Amazon Associates and DTC affiliate networks require a **live public website with original editorial content** before approving your application, **The Velvet Den** ships with **5 standalone static HTML dating & gift guides** pre-built under `/guides/<slug>/`:

1. `https://sudosoph.github.io/velvet-den/guides/cougar-vs-puma-vs-jaguar-dating-age-chart/`
2. `https://sudosoph.github.io/velvet-den/guides/first-time-hosting-older-woman-apartment-checklist/`
3. `https://sudosoph.github.io/velvet-den/guides/best-gifts-for-older-woman-girlfriend-dating-guide/`
4. `https://sudosoph.github.io/velvet-den/guides/millennial-vs-gen-z-age-gap-dating-code-switching/`
5. `https://sudosoph.github.io/velvet-den/guides/older-woman-younger-man-relationship-problems-kids-stigma/`

### Step-by-Step Application Order:
1. **Amazon Associates (`https://affiliate-program.amazon.com/`)**:
   - Enter `https://sudosoph.github.io/velvet-den/` as your Website URL.
   - Describe your site as: *"An interactive relationship game and editorial date-night/gift guide hub for adult age-gap couples, featuring hosting checklists, etiquette articles, and curated home/lifestyle gift picks."*
   - Choose your Store ID (e.g., `velvetden-20`). Amazon gives you immediate access; once 3 qualifying purchases happen within 180 days, their team reviews your public `/guides/` pages (which already include the required FTC reader disclosure!).
   - Paste your tag into `src/config/monetization.ts` (`amazonAssociateTag: 'velvetden-20'`) AND add `AMAZON_ASSOCIATE_TAG` under **GitHub Repo → Settings → Secrets and variables → Actions → Variables** so the daily bot + static SEO pages auto-tag every link!
2. **Higher-Commission DTC Affiliates (`10%–20%` vs Amazon’s `1%–4%`)**:
   - **Levanta (`https://levanta.io/`)**: Connects publishers directly to Amazon brands paying **15%–25%** commission with a 14-day attribution window instead of Amazon’s 24-hour window.
   - **Impact.com (`https://impact.com/`) / ShareASale**: Apply to SFW-upscale romance & home brands (*Brooklinen*, *Lunya* washable silk robes, *Uncommon Goods*, *Aesop / Malin+Goetz*, *Tinggly* experience gifts).
   - **Important Payment-Rail Rule**: Never add explicit adult-toy stores (*Lovehoney*, *Adam & Eve*) to pages linked to your Stripe or Ko-fi account—`src/lib/affiliates.ts` automatically blocks explicit domains so your payment processors stay 100% safe.

---

## 2. Turning On 0%-Fee Donations & Stripe Credit/VIP Unlocks

1. **Ko-fi Tip Jar & $29 Custom Scenario Commissions (0% Fee on Tips)**:
   - Create a free page at `https://ko-fi.com/` (set your tip metaphor to *"Espresso Martini"* at `$5`).
   - Enable **Commissions** with a `$29` listing: *"Immortalize Your Inside Joke / Custom Cougar or Cub Archetype in The Velvet Den."*
   - Update `kofiUrl` and `cameoCommissionUrl` in `src/config/monetization.ts`.
2. **Stripe Payment Links (Zero Backend Required)**:
   - In your Stripe Dashboard → **Payment Links**, create two links:
     - **+15 Velvet Credits ($2.99)** → Set *After payment → Redirect to your website*: `https://sudosoph.github.io/velvet-den/?unlock=credits15`
     - **VIP Black Card ($6.99)** → Set *After payment → Redirect to your website*: `https://sudosoph.github.io/velvet-den/?unlock=vip`
   - Paste both URLs into `stripeCreditPackUrl` and `stripeVipPassUrl` in `src/config/monetization.ts` and flip `sandboxPreviewMode: false`.

---

## 3. Newsletter Monetization ("The Velvet Dispatch")

- Create a free publication on **Beehiiv** (`https://www.beehiiv.com/`) or **Substack**.
- Paste your subscribe URL into `newsletterActionUrl` in `src/config/monetization.ts`.
- Players automatically get **+5 Bonus Velvet Credits** for subscribing, while Beehiiv **Boosts** can pay you **$2–$4 per referred subscriber** automatically on signup!

---

## 4. Automated Discord + Owned Community + SEO Growth Engine

1. **Submit `sitemap.xml` to Google Search Console**:
   - Add `https://sudosoph.github.io/velvet-den/` in Google Search Console and submit `sitemap.xml` (auto-generated on every build with dating-specific keywords—never generic cat/wildlife keywords!).
2. **Turn On the Daily Discord Dilemma Bot (60 Seconds)**:
   - In your Velvet Den Discord server: **Channel Settings → Integrations → Webhooks → New Webhook → Copy Webhook URL**.
   - In `sudosoph/velvet-den` on GitHub: **Settings → Secrets and variables → Actions → New repository secret** → Name: `DISCORD_WEBHOOK_URL`.
   - `.github/workflows/daily-growth-engine.yml` automatically posts a new *"Vet or Ghost?"* dilemma + `?dilemma=` deep link + auto-tagged Affiliate Pick every morning and saves ready-to-post **TikTok/Reels scripts** as workflow artifacts!
3. **`r/CougarsAndCubs` Etiquette (Never Spam)**:
   - Never point an automated bot at `r/CougarsAndCubs`. Participate genuinely as a real human (90/10 rule), share organic laughs on **Off Topic Mondays** or ask mods via Modmail first, and let players share their **Wordle-style Emoji Receipts** and **2-Player Partner Audition links** naturally!
