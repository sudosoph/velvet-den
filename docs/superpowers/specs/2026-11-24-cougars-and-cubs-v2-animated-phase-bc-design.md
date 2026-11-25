# Cougars & Cubs Club (v2): Style A Photorealism, Animated Onboarding, 26-Subplot Arc & Phases B + C Design Spec

**Date:** 2026-11-24  
**Status:** Ready for Partner Approval (Builder Check Passed)  
**Target Domain:** `cougarsandcubs.club` (Clean Free Cloudflare URL: `https://cougarsandcubs.pages.dev` — zero `sophiaraji.workers.dev` exposure!)  
**GitHub Repository:** `sudosoph/velvet-den`

---

## 1. Intent & Why

v1 proved the concept on GitHub Pages, and playtesting surfaced four clear upgrades to turn it into an addictive, high-converting consumer game and lifestyle brand on **`cougarsandcubs.club`**:

1. **Attraction & Visual Appeal (Style A Photorealism)**: Players coming for a cheeky Cougar & Cub game want to see **genuinely handsome young men** and **stunning, radiant women**—not flat vector icons.
2. **Zero-Wall-of-Text Animated Onboarding**: Replace the dense single-page setup form with a fast, visual 3-step onboarding flow, Tinder-style spring swipe physics, and smooth transitions.
3. **2x Deeper Cohesive Storyline (26 Subplots Across 5 Chapters)**: Expand from 14 scenes to **26 lived-in subreddit subplots** spanning a 5-chapter relationship arc so free play feels rich and Credit/VIP Story Packs have massive replay pull.
4. **Full Phase B + Phase C Interactivity & Isolated Monetization**: Move off `natalwealth.app` onto a **dedicated Stripe sub-account** + **Unified Cloudflare Worker + KV + Workers AI** deployment on `cougarsandcubs.club`, unlocking live global crowd choice stats (**Phase B**), server-verified Stripe Checkout unlocks (**Phase B**), and live interactive AI *"Survive Her Inbox / Late-Night Text"* banter rounds (**Phase C**).

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
1. **Style A Photorealistic Cast & Dating-App Gallery (`public/images/`)**:
   - Generate and ship high-resolution sun-drenched photorealistic portraits & dating-app photos (strictly tasteful SFW/PG-13 luxury editorial & Hinge style):
     - **5 Stunning Women Portraits**: Claire (45F C-Suite Cougar), Serena (43F "Spoil-Me Princess" Cougar), Maya (36F Cool-Aunt Puma), Valerie (53F 6 AM Ridge-Runner Jaguar), Celeste (62F Silver-Haired Palm Springs Panther Icon).
     - **4 Handsome Cub Portraits**: Leo (25M Curly-Haired Linen-Apron Houseboy), Julian (26M Chiselled Old-Soul w/ Peonies), Dante (24M Sun-Kissed Trail Runner), Miles (32M Tailored Rooftop Architect).
     - **Named Tinder-Style Dual Swipe Decks (Act I "The Prowl")**:
       - Realistic **Tinder/Hinge Card Frame** complete with **First Name + Age**, verified checkmark, *"Active 4m ago • 3 miles away"*, height/job/zodiac pills, **hilarious Tinder bios**, Hinge-style prompt callouts, Spotify anthem tags, and multi-photo tap bars:
       - **Cub Deck (When Playing as Her — 6 Named Profiles)**:
         1. **Connor, 26** (*6'1" • Tech Sales*) — *"6'1 because apparently that matters 🙄 Work hard play harder. Never been with an older woman before 👀"* (`Short-term, open to long` • Photo #1 coastal stud → Photo #2 purple-LED Tito's bottle selfie).
         2. **Tyler "Ty", 24** (*5'11" • "Stealth Crypto Founder"*) — *"Just moved out of my parents' pool house 💪 Add my Snap, barely check this app."* (Photo #1 wedding blazer → Photo #2 bare floor mattress + white crew socks & slides).
         3. **Mateo, 26** (*6'0" • Physical Therapist*) — *"Own an oak bedframe, 600TC sheets, AND a lidded bathroom trash can. Seeking my 6 AM trail pace partner & Sunday pasta co-chef."* (Photo #1 summit runner → Photo #2 washed linen apron cooking).
         4. **Julian, 27** (*6'2" • Structural Engineer*) — *"Old soul who opens car doors, books Thursday 7:30 reservations before Wednesday, and calls instead of texting 'wyd'."* (Photo #1 golden-hour olive linen w/ peonies).
         5. **Brandon "Brando", 25** (*6'0" • Personal Trainer*) — *"Certified Golden Retriever energy 🐕 Will carry all 9 Trader Joe's bags in one trip and fix your patio door."*
         6. **Chadwick "Chad", 23** (*6'3" • "Weekend DJ"*) — *"Here for a good time not a long time 🔥 Looking for a rich cougar to fly me to Cabo lol jk... unless?? 😏"* (Sugar-mama hunter trap!).
       - **Cougar / Puma / Jaguar Deck (When Playing as Him — 5 Named Profiles)**:
         - **Claire, 45**, **Serena, 43**, **Maya, 36**, **Valerie, 53**, and **Celeste, 62**—each with full photorealistic portraits, sharp Tinder bios laying down her real standards, and opening DM tests!
     - **Hero Couple Splash Backdrop** for Step 1 onboarding.
2. **3-Step Visual Onboarding & Tactile Animations (Zero Walls of Text)**:
   - **Step 1 (Splash)**: Full-bleed golden-hour couple portrait backdrop, floating ember/sparkle motion, punchy 6-word hook, and two giant visual cards: **🐆 Play as Her** vs **🔥 Play as Him** (+ direct shortcut to **💬 Live AI Inbox Mode**).
   - **Step 2 (Visual Portrait Carousel)**: Swipeable/tappable **3:4 full-photo cards** showing only Name, Age Pill, and a 1-line hook by default; deeper lore, inner-doubt preview, and custom age `+/-` drawer open cleanly on an optional `"Details / Customize"` toggle.
   - **Step 3 (Animated Gameplay)**:
     - Act I cards animate out left (`NOPE 🚩` stamp tilt) or right (`DATE 💚` stamp tilt) on swipe/click, with dramatic zoom-shake on `"Age: 26"`.
     - Act II–V episodes feature smooth slide-fade transitions, animated stat bar deltas (`+20` floating pills), and celebration confetti/ember bursts on unlocked badges.
3. **Age-Bracket & Profile-Specific 5-Stage Relationship Progression (~28 Tailored Subplots)**:
   - Rather than running every couple through the same generic scenes (e.g., nobody asks a 36F Puma if a 25M is her *son*, and a 62F Panther doesn't hire an \$80 babysitter!), the story engine builds a **bespoke 5-Stage Relationship Arc** (*Stage 1: First Spark → Stage 2: Courting Rhythm → Stage 3: Behind Closed Doors & Real Quirks → Stage 4: Friends, Family & Public Eyes → Stage 5: The Future*) gated by **exact age gap, feline tier, generational matchup, and profile tags**, interpolating the chosen partner's real name, age, and career throughout:
   - **Track A — Puma Arc (30s Woman, 8–14 Yr Gap, e.g. Maya 36F × 24–27M Cub)**:
     - *Stage 1*: Elder Millennial (`😂` / text-before-calling) vs. Gen-Z (`💀` / Snapchat) courting calibration.
     - *Stage 2*: The **\$80 Babysitter Clock** & sacred Friday schedule test.
     - *Stage 3*: **6-Month Kid-Intro Boundary** & **Co-Parenting Ex-Husband Driveway Run-In** while his sneakers are by the door.
     - *Stage 4*: **His Boys' Group-Chat Roast** (*"Wait she has a kid?!"*) & Pilates/brunch rhythm.
     - *Stage 5*: **"One-and-Done" vs. Baby #2 Biological Clock Talk** (she's 36 and happy with one; is he ready for step-parenting life?).
   - **Track B — Cougar / Princess Arc (40s Woman, 14–22 Yr Gap, e.g. Claire 45F / Serena 43F × 25–28M Cub)**:
     - *Stage 1*: **Tapas Check-Drop** (*Cougar ≠ Sugar Mama*) OR **Passenger-Princess Peonies & Zero Mental Load** date.
     - *Stage 2*: **9:30 PM Retinol, Silk Pillowcase & 62°F Bedroom Thermostat** vs. his midnight taco energy + **Wardrobe/Emoji Code-Switch**.
     - *Stage 3*: **She Coaches His Salary Negotiation (+25% Raise)** without slipping into "boss/mom" dynamic + **Morning Sunlight Mirror vs. "Enough Game?" Doubts**.
     - *Stage 4*: **Earned Linen-Apron Houseboy Sunday** (`60+ Maturity & EQ` gate) + **His Apartment Lidded-Bin & 600TC Sheets Audit**.
     - *Stage 5*: **Tubes-Tied / Done-With-Kids vs. Wants-Kids Someday Crossroads** OR **Wedding Plus-One Side-Eyes**.
   - **Track C — Jaguar Arc (50s Empty-Nester, 22–30 Yr Gap, e.g. Valerie 53F × 24–32M Cub)**:
     - *Stage 1*: **Gen-X "Call Me at 6 PM, Don't Micro-Text All Day" Test** + **"In the Wild" Trader Joe's Olive-Oil Shot**.
     - *Stage 2*: **`"Table for You and Your Son?"` Host-Stand Test** (triggered specifically on 20+ year gaps!) + **6 AM Canyon Switchbacks Short-Leash Pace** & **Pilates Reformer Core-Shake**.
     - *Stage 3*: **Fiercely Guarded Post-Divorce Solo Sanctuary** (no 5-lb whey tubs colonizing her counter!).
     - *Stage 4*: **Brunch With Her 23-Year-Old College Daughter** (younger than him!) + **Thanksgiving With His Class-of-'95 Mom** (same age as Valerie!).
     - *Stage 5*: **Living Apart Together (LAT) vs. Moving In** commitment pact.
   - **Track D — Panther / Sabertooth Arc (60+ Icon, 28–38 Yr Gap, e.g. Celeste 62F × 27–32M Cub)**:
     - *Stage 1*: **Black-Tie / Rooftop Cocktail Poise** & phone-face-down presence.
     - *Stage 2*: **Public Hand-Holding & Stares Test** (owning a 30-year gap in daylight without flinching).
     - *Stage 3*: **5-Star Palm Springs 3x Wealth Gap** (bringing devotion, driving, and thoughtful planning when she owns the desert villa) + **Morning Sunlight Silver-Hair & Game Vulnerability**.
     - *Stage 4*: **Protective Best Friends' Dinner** (*"We won't let some 30-year-old break Celeste's heart"*).
     - *Stage 5*: **The Real Timeline & Aging Conversation** (*"When I'm 75 and you're 45..."* — met with grounded, adult love and eyes-wide-open commitment).
4. **Phase B — Unified Cloudflare Pages + Pages Functions (`https://cougarsandcubs.pages.dev` + `https://cougarsandcubs.club`)**:
   - Deployed as a **Cloudflare Pages + Functions** project (`cougarsandcubs`) rather than a `.workers.dev` route so your personal `sophiaraji` handle never appears in the URL (and your existing `agentic-architecture.sophiaraji.workers.dev` Worker stays untouched!).
   - **Live Global Crowd Percentages (`/api/stats`)**: Backed by Cloudflare KV (`VELVET_KV`), recording real player choices and returning live community percentages with graceful local fallback if offline.
   - **Isolated Stripe Account + Verified Checkout (`/api/verify-checkout`)**: Dedicated Stripe sub-account separate from `natalwealth.app` providing live Payment Links for:
     1. **Espresso Martini Creator Tip Jar** (Stripe customer-chooses-amount tip link, \$5 default — zero Ko-fi account needed unless desired),
     2. **+15 Velvet Credits (\$2.99)**,
     3. **VIP Black Card All-Access (\$6.99)**,
     4. **Custom Archetype / Subplot Cameo (\$29)**,
     with HMAC-signed unlock tokens verified by the Worker when `STRIPE_SECRET_KEY` is configured (and graceful fallback when running static).
5. **Phase C — Live Interactive AI "Survive Her Inbox / Late-Night Text" Mode (`/api/inbox-vet`)**:
   - Players pick any Cougar or Cub photo card and enter an iMessage-style live 3-turn texting challenge (1 Credit per session, with **1 free trial round** included for every new player!).
   - Powered by **Cloudflare Workers AI** (`env.AI` `@cf/meta/llama-3.3-70b-instruct-fp8-fast`, with optional `GEMINI_API_KEY` override).
   - Enforces strict PG-13/R cheeky romance system guardrails + output sanitization (refusing explicit erotica playfully in-character: *"Easy there, tiger—earn dinner first"*) and returns structured JSON (`{ reply, maturityDelta, chivalryDelta, chemistryDelta, coachNote, passed }`).

### Non-Goals
- Cross-device email/password login walls (zero-login onboarding remains paramount).
- Explicit NSFW imagery or adult chat (strictly prohibited to protect the dedicated Stripe account).

### Anti-Goals
- Never bill or display `natalwealth.app` on any payment link or receipt—Stripe configuration must target ONLY the dedicated `Cougars & Cubs Club` Stripe account.
- Never revert to walls of text on the landing page—every onboarding step must fit comfortably above the fold on mobile and desktop.

---

## 3. Approaches Considered

1. **Option 1 — Unified Cloudflare Worker (Static Assets + `/api/*` + KV + Workers AI) + Separate Stripe Account (Selected)**
   - Zero CORS issues, \$0 base cost on Cloudflare's free tier, native Workers AI for Phase C without requiring an external LLM billing key, instant deployment on `sophiaraji.workers.dev` + 1-click custom domain attachment to `cougarsandcubs.club`.
2. **Option 2 — Split GitHub Pages + Separate Gemini Worker**: Rejected due to split origins/CORS and mandatory external LLM API key setup before Phase C works.
3. **Option 3 — D1 Email/Password Accounts**: Rejected because login friction hurts viral link conversion.

---

## 4. Constraints & Builder Calls

- **Graceful Progressive Enhancement**: All `/api/stats`, `/api/verify-checkout`, and `/api/inbox-vet` calls run live on Cloudflare (`cougars-and-cubs-club.sophiaraji.workers.dev` / `cougarsandcubs.club`) and gracefully fall back if previewed statically on GitHub Pages.
- **No Dead Placeholder Ko-fi / Payment Links *(Builder Call)***: Remove the uncreated `https://ko-fi.com/sudosoph` URL so players never hit an external 404; Tip Martini & Cameo buttons route through the in-app Creator Lounge modal when `tipJarUrl` / `cameoCommissionUrl` are blank, and automatically open live **Stripe Payment Links** (including a Stripe *"Choose What You Pay"* Tip Link!) the moment the dedicated `Cougars & Cubs Club` Stripe sub-account is connected.
- **Non-Blocking Stripe Provisioning + Auto-Live Lock *(Builder Call)***: Ship both `/api/verify-checkout` (`?session_id={CHECKOUT_SESSION_ID}` HMAC token verification) AND a 1-command `scripts/setup-stripe-links.mjs` provisioning script (plus live Stripe MCP provisioning as soon as the new sub-account is authorized in session, strictly ignoring `natalwealth.app`). Once live Stripe URLs are populated, `sandboxPreviewMode` automatically locks off free demo unlocks.
- **Image Performance *(Builder Call)***: Store generated Style A `.jpg` portraits under `public/images/` with `object-cover object-top` framing so faces never crop awkwardly on mobile or desktop.
- **SEO Domain Sync *(Builder Call)***: Update `BRAND_CONFIG` to `Cougars & Cubs Club` (`https://cougarsandcubs.club/`, with live Worker preview at `https://cougars-and-cubs-club.sophiaraji.workers.dev/`).
