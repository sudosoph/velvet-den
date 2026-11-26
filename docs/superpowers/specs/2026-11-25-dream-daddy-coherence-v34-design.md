# Cougars & Cubs Club (`v34`) — *Dream Daddy* Narrative Coherence, Cast Diversity & Exit-Ready Monetization Spec

## 1. Intent & The "Dream Daddy Exit" Thesis

Right now, `cougarsandcubs.club` has strong comedic DNA and viral hooks, but its modes behave like separate widgets rather than one cohesive romance game:
- All 57 profiles are exposed upfront on a static `"Draft Your Roster"` grid (`"Draft Camila"`) and pre-populated inside `Live Chat` before the player ever swipes.
- `iMessage` has no climax handoff into dates and no hard fail/unmatch state.
- `8-Bit World` repeats top-bar Pop Quiz / Checklist questions and over-indexes on one character's Qigong / seed-oil / Bernedoodle quirks.
- Several female profiles repeat coastal executive / Pilates / Qigong tropes, two cast pairs share duplicate photos (`Sloane` + `Brooke`, `Mateo` + `Rafael`, plus swipe traps `Connor/Chadwick` and `Brandon/Sam`), zero women are under `5'5"`, and wide desktop screens crop faces (`lg:max-w-none` + fixed heights).
- The economy hands out `10` daily credits + `50+` free bonus credits while hiding live Stripe links (`$2.99`, `$5` Tip, `$6.99` VIP, `$29` Cameo) and text-only affiliate cards behind a generic `Credits` button.

**Why *Dream Daddy* (and *Wordle* / *Episode*) became acquirable IP**:
1. **Unforgettable, non-interchangeable characters** you discover and fall in love with one by one.
2. **One unified progression loop**: `Browse & Swipe Rich Profiles → Surprise Animated Match → Tinder Vetting (or Cub Obedience Rehab) → Earned Off-App iMessage → 3-Date Character Route (via iMessage or the 8-Bit Neighborhood Map) → S/A/B/F Collectible Ending Card`.
3. **Frictionless organic K-factor** (`Send Profile to Bestie`, `2-Player Audition`, `Pop-Culture Quiz Score`, `Have You Ever? 25-Pt Score` via an Instagram-style multi-app share sheet) + **clean IP chain of title** (zero unlicensed tabloid paparazzi photos) + **real conversion unit economics**.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
1. **Swipe-First Discovery & Animated Matching**: Restore the hero slogan **`"Lower Your Age Slider. Vet the Red Flags. Win Real Love."`** Replace static `"Draft [Name]"` directory cards with rich, scrollable Hinge/Raya-style simulated profiles (`5'1"`–`6'3"`, 3 prompts, voice-note quote, kids/life stance, anthem, full-face `aspect-[3/4]` portraits capped so wide screens never crop faces), surprising match odds, and an animated **`IT'S A MATCH!`** celebration that populates your Earned Match Queue & Live Chat.
2. **Coherent Chat → Obedience Rehab → Off-App iMessage → 3-Date Arc**:
   - **Tinder (2 green sparks)** unlocks their personal **iMessage number** + **Flirt Mode**.
   - **2 red-flag strikes** trigger an **Unmatched / Blocked Receipt** (`2 Credits` or VIP to Rewind).
   - **Trainable Cub fumbles** surface **`🦮 Enroll in Cub Obedience School`** right inside Live Chat, linking directly into the 2D PixiJS clicker / `"Drop the Snap!"` / braided short-leash / steak-treat trainer (`PixiCubAcademyStage.tsx`) to clear a strike and boost Chivalry.
   - **Discord** functions as the **Anonymous Community Advice Lounge** (`#ask-the-den`, `#in-the-wild-help`, `#cub-training-101`, `#boys-roblox-vc`) with **1-tap Advice Suggestion Pills** modeled on real age-gap advice posts + the 3-stage undercover **Mystery Regular Subplot**.
   - **Off-App iMessage (3 green turns)** culminates in a **Date Night Invite Card** (`"Friday 7:30 PM Locked In — Go on Date #1"` or `"Meet at Their Spot on the 8-Bit Map"`), running a **tailored 3-Date Route (`Date #1 → Morning-After iMessage → Date #2 → Date #3 Finale → S/A/B/F Dateodex Stamp`)**.
3. **8-Bit "In The Wild" Neighborhood Overworld**: Retheme `EightBitAdventureWorld.tsx` into the neighborhood map where your earned matches hang out across **6 IRL subculture venues** (*6 PM Wine & CSA Market*, *Velvet Gym & Smoothie Bar*, *Hotel Lobby Bar*, *UV Bouncer & Bistro Patio*, *Sunday Kitchen & Barn*, *Club Gift Boutique*), each with **8-Bit-exclusive street approach micro-encounters** (zero duplicate Pop Quiz or Checklist drawers, zero Qigong/seed-oil/Bernedoodle filler).
4. **100% Unique Cast Portraits, Petite Heights (`5'1"`–`5'4"`), Quirks Quarantined & Rich Real-World Archetypes**:
   - Quarantine **Qigong & Tai Chi** strictly to **Sedona (`46F`, studio founder — not Mommy-Domme)** and **gluten/seed-oil-free + Mini Bernedoodle** strictly to **Sloane (`42F` — not Mommy-Domme)**; strip both out of global quizzes, checklists, 8-Bit World, XP ranks, and generic Field Guide entries.
   - Generate/assign unique portraits so **Sloane**, **Rafael**, **Chadwick**, and **Sam** have zero duplicate photos.
   - Add realistic petite heights (`5'1"`, `5'2"`, `5'3"`, `5'4"`) across 10+ women and diversify repetitive corporate/Pilates bios into vivid real-life archetypes: **62F Active "Glam-ma" Grandmother ("Gigi")**, **43F Burned-by-Older-Ex → Adored Trophy Wife (`5'2"`)**, **39F Tradwife-Curious Sourdough Homemaker (`5'3"`)**, **41F 200hr→300hr RYT Global *Eat Pray Love* Nomad (`5'2"`)**, **34F 5:30 AM Horse Girl (`5'4"`)**, **44F Weekly CSA Box & Future Ranch Dreamer (`5'3"`)**, **40F Fine Art & Estate Jewelry Collector (`5'1"`)**, **37F Child-Free-by-Choice Jet-Setter (`5'2"`)**, **35F Night-Shift Trauma Nurse (`5'3"`)**, **52F Small-Town Fishbowl Principal (`5'4"`)**, and **56F Warm Second-Act Widow**.
   - Reframe **Princess Cougar** to **`Any Age • Pure Sweeping Romance`** (flowers, hand-kissing, candlelit reservations across 30s–60s+, never corporate burnout) and give **Soft Mommy-Domme / `"Good Boy"` Praise**, **`"Cub Daddy / Junior Zaddy"`**, and **Blocking `"Bucket-List Tourists"`** clean standalone entries in the Field Guide, Checklist, and Episodes.
5. **Comprehensive Pop-Culture Hall of Fame + Legal `CC-BY` Portraits + Share Sheet**:
   - Expand Hall of Fame & Trivia to cover **Priyanka Chopra & Nick Jonas, Heidi Klum & Tom Kaulitz, Tina Turner & Erwin Bach, Cher, Demi Moore & Ashton Kutcher, Kris Jenner & Corey Gamble, Brigitte & Emmanuel Macron, Gabrielle Union & Dwyane Wade, Julianne Moore & Bart Freundlich, Cameron Diaz & Benji Madden, Eva Mendes & Ryan Gosling, Goldie Hawn & Kurt Russell (5.5-yr gap • 40+ years together), Meghan Markle & Prince Harry (3-yr royal micro-gap • divorced 30s actress × younger prince), Madonna, Mariah Carey & Bryan Tanaka, Susan Sarandon, Olivia Wilde & Harry Styles, Jessica Alba & Danny Ramirez, Sienna Miller & Oli Green, Ellie Goulding & Beau Minniear, Miley Cyrus & Maxx Morando, Kristin Cavallari & Mark Estes**, plus *How Stella Got Her Groove Back*, *The Graduate*, *Babygirl*, *The Idea of You*, *Bridget Jones: Mad About the Boy*, *The Rebound*, *Cougar Town*, and *Good Sex*.
   - Replace the 2 wellness trivia questions in `popCultureTrivia.ts` with real cinema/celeb Hall-of-Fame questions, add verified **Wikimedia Commons `CC-BY` / `CC-BY-SA` / Public Domain portraits** with attribution captions, and add a **Wordle-style Quiz Score Share Card**.
   - Build **`SocialShareSheetModal.tsx`** (Instagram-style share tray: **iMessage/SMS, WhatsApp, Instagram DM + 9:16 Story PNG, TikTok, Discord, X, Threads, Telegram, Copy Link, Native More**) powering **`👯‍♀️ Send Profile to Bestie`**, **`👯‍♀️ Invite Bestie`**, **`🎯 2-Player Audition`**, **Quiz Score**, **`Have You Ever?` 25-Pt Score** (zero `"Viral"` self-labels in UI!), and **Date Verdict Receipts**.
6. **Exit-Ready Credit Economy, Visual 32-Item Boutique & Visible CTAs**:
   - Tighten starter/daily credits (`10` → **`5`**); remove free wallet credits from quizzes, checklists, and 8-bit pickups (they award XP & Stamps instead; only Newsletter `+3 Cr`, Raya Waitlist `+2 Cr`, and Verified Friend Referrals `+3 Cr` grant wallet credits).
   - Keep **Match #1 Off-App iMessage unlock free**; gate **2nd+ Off-App iMessage unlocks (`2 Cr`)**, **manual Flirt Mode boost (`2 Cr`)**, and **Unmatch Rewinds (`2 Cr`)** — all **unlimited with the `$6.99` VIP Black Card**.
   - Add crisp **visual product artwork thumbnails** to all **32** items in `AFFILIATE_CATALOG`, fix all responsive input/button overflow in `BoutiqueAndVipModal.tsx`, surface a **contextual Visual Gift Pick** right inside `LiveInboxModal.tsx`, and place clear **`🛍️ Shop`**, **`🍸 Tip $5`**, and **`💎 Credits / VIP`** pills in `TopHudBar.tsx` and the footer.

### Non-Goals & Anti-Goals
- **Anti-Goal 1**: Never use *Daily Mail*, Backgrid, Splash, or Getty unlicensed paparazzi images.
- **Anti-Goal 2**: Never display `"Draft [Name]"`, `"Draft Your Roster"`, or self-congratulatory `"Viral"` labels in user-facing UI.
- **Anti-Goal 3**: Never include banned external forum brand terms (`r-e-d-d-i-t` / `s-u-b-r-e-d-d-i-t` / `modest-roots`), em-dashes (`—`), bio-reciting texts, or female personas saying `"babe"` in `src/`, `scripts/`, or `worker/`.
- **Anti-Goal 4**: Never stretch vertical portraits with `w-full` + clamped heights (`h-52`, `h-64`, `max-h-[340px] lg:max-w-none`) on desktop screens.

---

## 3. Approaches Considered

1. **Selected — Unified Progression Spine Over Existing Architecture (`v34` Cohesive Build)**:
   - Unify `PairingMixerView.tsx` (now the **Swipe & Read Profile Deck + Match Celebration + Quick Mode Hub**), `LiveInboxModal.tsx` (Earned Match Queue + Tinder → Obedience Rehab → Off-App iMessage → 3-Date Handoff + Discord Advice Pills), `EightBitAdventureWorld.tsx` ("In The Wild" Neighborhood Date Map), `PopCultureTriviaModal.tsx`, `FieldGuideModal.tsx`, `BoutiqueAndVipModal.tsx`, and `SocialShareSheetModal.tsx` around shared persisted match/date progression (`velvet_match_career_v34`).
   - *Why chosen*: Delivers the complete *Dream Daddy* game feel, fixes every visual/content/economy leak simultaneously, and preserves 100% compatibility with existing Cloudflare Worker KV/AI endpoints and SEO routes.
2. **Rejected — Cosmetic Text Patch Without Changing the Static Roster / Pre-Filled Inbox**:
   - Leaves all 57 profiles unlocked before swiping and leaves iMessage endless without date handoffs; fails the core *"surprising real game"* requirement.
3. **Rejected — Separate Standalone Visual-Novel Engine Rewrite**:
   - Discards working 60fps PixiJS Obedience School, Live Llama-3.3 AI Inbox, Courtroom KV voting, and 16 SEO pages for months of unnecessary rewrite risk.

---

## 4. Detailed Architecture & Builder Decisions

### 4.1 Unified Match & 3-Date Career State (`src/domain/matchCareer.ts` — Builder Call)
- Persisted in `localStorage` under `velvet_match_career_v34` (gracefully seeded in unit tests or direct `Live Chat` clicks with 1 starter match if `matchedIds` is empty so `LiveInboxModal` always renders a playable match immediately, while showing `"1 Matched • Swipe to Meet 38 More!"`):
  - `swipedSeenIds: string[]`, `matchedIds: string[]`, `superLikedIds: string[]`
  - `dateStageByMatchId: Record<string, 0 | 1 | 2 | 3>` (`0` = chatting pre-Date #1, `1` = Date #1 completed, `2` = Date #2 completed, `3` = S/A/B/F Route Completed!)
  - `unmatchedIds: string[]` (triggered on 2 red-flag strikes in a thread; cleared by spending `2 Credits` on Rewind or enrolling a Cub in `🦮 Cub Obedience School`!).
  - `rehabbedIds: string[]` (graduating a Cub in `PixiCubAcademyStage` clears 1 strike and adds `+1` green spark).

### 4.2 Swipe-First Rich Simulated Profile Deck & Animated Match Splash (`PairingMixerView.tsx`)
- **Top Hero**: Slogan **`"Lower Your Age Slider. Vet the Red Flags. Win Real Love."`**, `🐆 Play as Her` / `🥂 Play as Him` switcher + compact **"Your Profile"** age stepper (`You: 43F` / `26M`), plus quick access pills to `💬 Matches (N)`, `🗺️ 8-Bit Map`, `🦮 Cub Obedience`, `⚖️ Courtroom`, `🎬 Pop Quiz`, and `✨ Have You Ever? (25-Pt)`.
- **Centerpiece Simulated Dating-App Card**:
  - Left column (`max-w-[360px] mx-auto w-full`): True **`aspect-[3/4]`** vertical portrait (`object-cover object-[50%_15%]`) with photo tabs, height + zodiac badge, and age/tier badge — guaranteed never to letterbox or crop faces at `1440px–2560px`!
  - Right column: Full Hinge/Raya-style scrollable profile dossier:
    - Name, Age, Title, Neighborhood/Origin, Vitals pills (`📏 5'2"`, `💎 Child-Free by Choice` / `👵 Proud Gigi of 2` / `🐎 Barn at 5:30 AM`, `🍸 Signature Drink`, `🎵 Anthem`).
    - **3 Distinct Simulated Prompts** (*Prompt 1: "Green flags I look for"*, *Prompt 2: "My simple pleasures / Typical Sunday"*, *Prompt 3: "Together we could / Voice Note"*) generated deterministically from each profile's unique archetype data + `DELIGHT_DETAILS` (zero duplicate prompt copy!).
    - Action bar at bottom of card:
      - `✕ Pass` (advances deck with card-fly animation)
      - `★ Super Like` (guaranteed instant match + gold spark!)
      - `❤️ Like / Match` (~80% match rate on standard profiles; selective Black-Cat / Trophy-Wife / Panther profiles have a playful 1-in-4 `"Playing Hard to Get — Try ★ Super Like or Match Her Energy!"` beat or match with extra excitement!)
      - `👯‍♀️ Send to Bestie` (opens `SocialShareSheetModal` with `?dilemma=<profileId>` link & *"Would you swipe right on [Name], [Age]?!"* preview!).
- **Animated `"IT'S A MATCH! 🔥"` Modal Overlay**:
  - Sliding dual `aspect-[3/4]` portraits + confetti/spark burst + `sfx.victoryFanfare()` + their custom 1-line match reaction + **`💬 Text [Name] Now`** (opens `LiveInboxModal` focused on `[Name]`) and **`🔥 Keep Swiping`**.
- **Earned Match Tray Below Card**: Shows circular avatars of everyone you've matched with so far (`💬 Text [Name]`, `🍸 Date #1/#2/#3`, zero `"Draft"` text!).

### 4.3 Coherent Chat Loop, Unmatch & 3-Date Handoff (`LiveInboxModal.tsx` & `App.tsx`)
- **Tinder**:
  - 2 green-flag sparks → **Match #1 Off-App iMessage number is FREE**; **2nd+ matches** prompt `Unlock [Name]'s Personal iMessage Number (2 Credits • Free w/ VIP)` so earned progression directly drives conversions!
  - 2 red-flag strikes → **Unmatched Receipt Card** (`"[Name] unmatched you after two red flags 💀"`) with **`⏪ Rewind Strike (2 Cr)`** or (when playing as Her) **`🦮 Send ${selected.name} to Cub Obedience School (Free Rehab!)`**.
- **Discord Advice Lounge**:
  - Channels: `#ask-the-den`, `#in-the-wild-help`, `#cub-training-101`, `#boys-roblox-vc` + undercover `🕵️ Mystery Regular DM`.
  - Above the Discord input bar: **4 role-tailored Advice Suggestion Pills** (clickable 1-tap questions that post to the channel and get multi-voice anon community coaching).
- **Off-App iMessage → 3-Date Route Handoff**:
  - After **3 green-flag turns** in an off-app iMessage thread (per date stage), a prominent **Date Night Ready Card** appears in the thread:
    - Stage 0 → **`🍸 Friday 7:30 Locked In: Go on Date #1 with [Name] →`** (or **`🗺️ Meet at Their Spot on the 8-Bit Map`**)
    - Stage 1 → **`🌙 Date #1 Sparked! Launch Date #2 (Sanctuary & Polarity) →`**
    - Stage 2 → **`👑 Final Boss: Launch Date #3 & Unlock Ending Stamp →`**
  - In `App.tsx`, launching a character's Date Route builds a **focused 3-scene run** (`createCharacterDateRun(pairing, dateStage)`) matched to that character's specific `subplotTags` (not an 8-scene generic marathon!), and completing it increments `dateStageByMatchId[matchId]`, stamps their Dateodex Polaroid, and unlocks the next morning's iMessage follow-up!

### 4.4 Coherent 8-Bit "In The Wild" Neighborhood Map (`EightBitAdventureWorld.tsx`)
- Replace all 6 buildings, 3 goblins, 3 nodes, and 6 pickups:
  - **6 Buildings (Connected to Resident Matches & Date Venues)**:
    1. `🍷 6 PM WINE & CSA` (`b_wine_csa` — Farmers Market & Wine Aisle Basket Check)
    2. `🏋️‍♀️ GYM & SMOOTHIE` (`b_gym_headphone` — Sacred Headphone Law & Plate Rerack)
    3. `🍸 HOTEL LOBBY BAR` (`b_hotel_bar` — Solo Traveler Ring Check & *Babygirl* / Martini Send)
    4. `🪪 UV BOUNCER & BISTRO` (`b_bistro_uv` — 45s UV ID Scan & Waiter *"Your Son?"* Parry)
    5. `🏡 SUNDAY SANCTUARY` (`b_sunday_barn` — Folded Laundry, Dishwasher & `"Good Boy"` / `"Cub Daddy"` Polarity)
    6. `🛍️ CLUB GIFT SHOP` (`b_gift_shop` — Opens the Visual Boutique directly!)
  - **3 Street Approach Micro-Encounter Nodes (100% Unique to 8-Bit — Zero Top-Bar Quiz/Checklist Duplication!)**:
    1. `🛒 AISLE 4 APPROACH` (Spot single-serving ribeye + Sancerre vs. family juice boxes)
    2. `🎧 AIRPODS CHECK` (Wait for headphones off at smoothie bar vs. mid-set interruption)
    3. `💍 RING-FINGER SCAN` (Clock tan-line ring trap vs. genuine solo traveler at hotel bar)
  - **3 Patrolling Subculture Goblins**:
    1. `👻 "What's Ur Snap?" Bro`
    2. `🪣 Bucket-List Tourist` (*"Never been with an older woman, tryna cross it off my list!"*)
    3. `💸 $19.50 Venmo Splitter`
  - **Companion**: Keep optional pixel dog companion renamed to **`🐕 Rescue Golden "Barnaby"`** (zero Bernedoodle/seed-oil reference!) and update XP level titles in `progression.ts` to pure Cougar-Cub subculture ranks (` Smoothie-Bar Nod Rookie` → `UV-Bouncer Survivor` → `Off-App Blue-Bubble Pro` → `Certified Good Boy / Sanctuary Icon` → `Velvet Den Legend`).

### 4.5 Cast Audit Fixes, Unique Portraits & Wikimedia `CC-BY` Celebrity Visuals
- **New Unique Cast Portraits** (generated via `image-generator` into `public/images/cast/`):
  1. `sloane-42f.jpg` (Sloane, 42F — sunlit Montecito wellness dog-mom, completely distinct from Brooke's tennis photo)
  2. `rafael-26m.jpg` (use/copy dedicated Rafael portrait from artifacts or generate fresh so Mateo & Rafael have 100% distinct faces)
  3. `chadwick-24m.jpg` & `sam-25m.jpg` for `appProfiles.ts` so zero profiles anywhere share a `photoUrl`.
- **Pop-Culture Hall of Fame & Trivia (`popCultureTrivia.ts`, `PopCultureTriviaModal.tsx`, `FieldGuideModal.tsx`, `journalArticles.ts`)**:
  - Verify real **Wikimedia Commons `CC-BY` / `CC-BY-SA` / Public Domain** image URLs + exact photographer & license strings via Wikimedia Commons API (`commons.wikimedia.org/w/api.php`) at build preparation time; store clean attribution caption (`Photo: <Author> • <License> via Wikimedia Commons`) on each trivia/Hall-of-Fame card, with graceful illustrated badge fallback if offline.
  - Add 1-tap **Share My Pop-Culture Score** button in `PopCultureTriviaModal.tsx` opening `SocialShareSheetModal` with a Wordle-style emoji grid (`🐆🎬 16/18`).

### 4.6 Responsive Boutique Overhaul, Visual Product Thumbnails & Top-Bar CTAs
- **`src/lib/affiliates.ts`**: Add visual product card artwork (`visualEmoji`, `accentGradient`, and crisp inline SVG/studio product illustration component `ProductVisualThumbnail` rendering tailored visual art for aprons, brass clicker, wine goblets, silk robes, copper shakers, bamboo sheets, lidded matte-black bin + soap, leather weekender, and 4K movie posters!) + clean out leaked Qigong/Bernedoodle badges.
- **`BoutiqueAndVipModal.tsx`**:
  - 3 clean tabs at top: **`🛍️ Visual Shop (32)`** | **`💎 Credits & VIP`** | **`🗝️ Waitlist & Free Bonus`**.
  - Every `<input>` gets `min-w-0 w-full` and every form button stacks cleanly underneath on narrow widths (`flex flex-col sm:flex-row` / `grid-cols-1 lg:grid-cols-...`) — zero horizontal overflow at `320px–1920px`.
- **`TopHudBar.tsx`**:
  - Clean streamlined navigation: `🔥 Swipe`, `💬 Chats`, `🗺️ 8-Bit Map`, `🦮 Cub Obedience`, `🎬 Quiz`, `✨ 25-Pt`, `📖 Lore`, **`🛍️ Shop`**, **`🍸 Tip $5`**, and **`💎 Credits / VIP`** + flat audio toggles.
- **`LiveInboxModal.tsx` Right Panel**: Include 1 compact **Visual Date-Night Gift Card** matched to the active character (`Shop Gift Pick →`) + **`👯‍♀️ Send Profile to Bestie`** & **`🎯 Send 60s Audition`**.

---

## 5. Resolved Builder Calls (Post-Review)

1. **Swipe Deck & Red-Flag Photo X-Ray Coexistence (Builder Call)**:
   - `PairingMixerView.tsx` becomes the primary **Swipe & Read Profile Deck** over `HER_ARCHETYPES` (`39`, covering every age `30..64`) and `HIS_ARCHETYPES` (`18`), while `AppSwipeStage.tsx` remains accessible via a `"🔍 Photo Red-Flag X-Ray Lab"` pill and `?dilemma=` deep links so all Photo-2 Tito's bottle / floor-mattress / age-slider flows continue working seamlessly. Clicking `Send to Bestie` / `Ask Bestie` copies the link to clipboard immediately *and* opens `SocialShareSheetModal`.
2. **Portrait-Aligned Archetype Assignments Preserving `30..64` Coverage (Builder Call)**:
   - Every refreshed archetype pairs with a visually matching portrait while preserving 100% integer age coverage `30..64` and pinned subplot tags:
     - **Sloane (`42F`, `5'4"`)**: Gets new unique portrait `sloane-42f.jpg` (strictly GF/seed-oil-free + Mini Bernedoodle; zero Mommy-Domme).
     - **Sedona (`46F`, `5'8"`)**: Strictly serene Qigong & Tai Chi studio founder (zero Mommy-Domme, zero Bernedoodle/seed-oil).
     - **Rafael (`26M`, `6'0"`)**: Gets dedicated unique portrait `rafael-26m.jpg` (zero collision with `mateo-26m.jpg`).
     - **Hannah (`33F`, `5'3"`)**: Tradwife-curious sourdough, peach-canning & ironed-linen homemaker.
     - **Zoe (`34F`, `5'4"`)**: 5:30 AM Horse Girl, dressage & barn boss.
     - **Priya (`35F`, `5'3"`)**: Night-shift trauma nurse craving zero-baggage playfulness off-shift.
     - **Chloé (`37F`, `5'2"`)**: Proudly child-free-by-choice jet-setter & rescue-dog mom (`dog_mom_divorced` preserved).
     - **Amber (`40F`, `5'1"`)** & **Helen (`63F`, `5'2"`)**: Fine art & estate gold jewelry collectors.
     - **Nadia (`41F`, `5'2"`)**: Petite cozy BookTok & stare-down cat Cougar (Astrid `41F` Malibu surfer preserved).
     - **Serena (`43F`, `5'2"`)**: Burned by a critical older ex-husband → now wants to be the pampered, idolized Trophy Wife to an ambitious younger man (`princess_treatment` preserved).
     - **Simone (`44F`, `5'8"`)**, **Monica (`49F`, `5'4"`)**, & **Vivienne (`61F`, `5'9"`)**: Carry standalone `soft_mommy_domme` (`"Good Boy"` praise & poised romantic command, zero Qigong/wellness).
     - **Diana (`50F`, `5'2"`)**: 200hr → 300hr RYT global *Eat Pray Love* nomad living out of a carry-on across Bali, Lisbon & Oaxaca (replaces duplicate Pilates/breathwork bio).
     - **Renée (`52F`, `5'4"`)**: Small-town fishbowl high-school principal sneaking two towns over for date night.
     - **Margot (`55F`, `5'3"`)**: Weekly CSA farm-box regular, backyard hens & future 15-acre ranch dreamer.
     - **Evelyn (`56F`, `5'5"`)**: Warm second-act widow rediscovering laughter with an unjaded younger partner.
     - **Celeste (`62F`, `5'6"`)** & **Beatrice (`64F`, `5'3"`)**: Active 60s "Glam-ma" grandmothers ("Gigi") balancing Saturday 10 AM grandkid soccer sidelines with unapologetic romance.
3. **3-Date Career Cumulative Stats & Rank Transitions (Builder Call)**:
   - Relationship stats carry cumulatively across a match's Dates `#1 → #2 → #3` inside `velvet_match_career_v34` so Date #2/#3 stat gates (`>= 60`) are naturally earned. Completing Date #1 or #2 displays a `"Return to iMessage for Morning-After Text & Date #2/#3 →"` CTA; Date #3 mints the final `S / A / B / F` Dateodex Polaroid. On the 8-Bit Map, all 6 venues are freely enterable at any time.
4. **Exact Credit Metering & Test Migration (Builder Call)**:
   - Remove per-3-message chat credit drain in `LiveInboxModal.tsx` so Match #1's full Tinder → Off-App iMessage → 3-Date Route plays cleanly on `dailyFreeCredits: 5`, while gating **2nd+ Off-App iMessage Unlocks (`2 Cr`)**, **Early Flirt Mode Boost (`2 Cr`)**, and **Chat Unmatch Rewind (`2 Cr`)** (`EpisodeStage` choice rewind stays `1 Cr`; VIP Black Card `$6.99` unlocks everything unlimited). Quizzes, Checklists, Shares, Obedience School, Courtroom, and 8-Bit grant **XP & Stamps** (`0` wallet credits); only Newsletter (`+3 Cr`), Raya Waitlist (`+2 Cr`), and Verified Friend Referrals (`+3 Cr` × max 3) grant wallet credits. Update legacy `v32` test assertions to verify the new `v34` invariants.

---

## 6. Visual Framing, Navigation, About Page & Hidden Red-Flag Strategy Refinements

1. **Zero-Crop `3:4` (`0.75`) Full-Portrait Framing at Every Screen Width**:
   - All 57 cast `.jpg` files in `public/images/cast/` have a native `0.75` (`3:4`) aspect ratio (`480×640`, `642×860`, `717×960`, `800×1071`, `880×1178`).
   - Every portrait card across `PairingMixerView.tsx`, `AppSwipeStage.tsx`, `LiveInboxModal.tsx`, `EpisodeStage.tsx`, and `PixiCubAcademyStage.tsx` MUST use `aspect-[3/4]` with a bounded width (`w-full max-w-[300px] sm:max-w-[330px] mx-auto`) and **NEVER** combine `w-full` / `lg:max-w-none` with a clamped `max-h-[...]` or landscape `h-52` / `h-64` box. This guarantees 100% of every character's face, hair, and upper/full body remains visible with zero cropping on wide desktop monitors.

2. **Adaptive, Balanced 3-Zone Navigation + Dedicated `About` Page (`TopHudBar.tsx` & `AboutClubView.tsx`)**:
   - Replace the 12-pill scrolling row in `TopHudBar.tsx` with a balanced, responsive 3-zone header:
     - **Left**: Brand logo + level badge (`🐆 Cougars & Cubs Club`).
     - **Center (Desktop flex row; clean toggle drawer on `< lg` screens)**: **`🔥 Swipe`** • **`💬 Chats`** • **`🗺️ Club Map`** • **`🦮 Obedience`** • **`📖 Lore & Quizzes ▾`** (dropdown/popover grouping *Pop-Culture Quiz*, *25-Pt Club Score*, *Crown/Dump Courtroom*, *Field Guide*, *Dating Guides*) • **`ℹ️ About`**.
     - **Right**: **`🛍️ Shop`** • **`🍸 Tip $5`** • **`💎 5 Cr / VIP`** • Audio controls.
   - Create **`src/components/AboutClubView.tsx`** (`activeTab === 'about'`): anchors newcomers with **(a)** What *Cougars & Cubs Club* Is (21+ *Dream Daddy*-inspired comedy vetting & romance simulator), **(b)** How the 4-Stage Detective & 3-Date Loop Works, **(c)** Our Manifesto & Cast Spectrum (from 30s Pumas to 60s "Glam-ma" grandmothers, child-free jet-setters, horse girls, and chivalrous Cubs), and **(d)** Direct CTAs to Start Swiping, Join the Virtual Salon Waitlist, or Visit the Boutique.

3. **Zero Early Flag Spoilers + *Dream Daddy* / *Monster Prom* Mechanics (Gallery Bug Fix, 6-Photo Hinge Profiles & Memory Payoffs)**:
   - **Critical Gallery Bug Fix (Zero Cross-Person Portraits)**: Remove all 46 cross-contaminated gallery entries across `taxonomy.ts` and `appProfiles.ts` (e.g., Marcus showing Leo as Photo #3; Mei-Ling showing Claire; Jin showing Leo/Julian; Vivienne showing Celeste) and add an automated test in `tests/taxonomy.test.ts` guaranteeing **no cast portrait file ever appears in another person's `photoUrl`, `galleryPhotos`, or `photos` array**. Also exclude `wine-bar-booth.jpg` (visible fair-skinned hands) from diverse characters' POV galleries.
   - **6-Photo Hinge/Tinder Profile Anatomy on Every Card**:
     - **Minimum 6 Captioned Visual Slides per Profile**: Slide 1 = Character's unique `3:4` portrait; Slides 2-6 = 5 tailored, face-free first-person POV camera-roll shots (kitchen/cooking POV, weekend resort/barn/pool POV, bedroom/living-room clue shot, night-out/jukebox/sushi POV, dog-picnic/convertible/library POV) with personal Hinge captions.
     - **Complete Vitals & Fun Facts**: Every profile displays **Bio**, **Job Title & Field of Work**, **School / Alma Mater & Major**, **Height (`5'1"`-`6'3"`)**, **Neighborhood**, **Family/Life Stance**, **Interests**, **2 Quirky Fun Facts**, and **3 Hinge Prompts**.
   - **Never Expose Red or Green Flags Early (Pure *Dream Daddy* Mystery & Memory Gameplay)**:
     - Strip early spoiler labels (`"🚩 Red-Flag Cub"`, `"💚 Green Flag Verified"`, `"Trap Missed! Had hidden red flags"`) from swipe cards and swipe feedback so every profile reads like a believable, intriguing match.
     - **"Velvet Profile" 3-Tap Intro Setup (*Dream Daddy* "Dadbook" Mechanic)**: Players set their own quick vibe & courtship style (*Sweeping Princess Romance*, *Soft `"Good Boy"` Command*, or *Witty Equal Banter*), which dynamically flavors match banter and compatibility.
     - **Subtle Clues & Profile Memory Checks (*S-Rank* Secret Sauce)**: Clues live subtly inside Photo 2-6 captions, School/Major, and Fun Facts (e.g., an air mattress "waiting on furniture delivery," a Finance major's "split-check optimization spreadsheet," a Trauma RN's 7 AM post-shift taco ritual, or a 62yo Glam-ma's Saturday 10 AM toddler soccer game). Referencing what you noticed in chat or on Dates #1-#3 triggers **`✨ Profile Memory Bonus` + floating hearts** toward their **S-Rank Ending Memory**, while matching with a secretly messy profile lets the comedic disaster **unfold organically in chat / Date #1** (where you can roast them, bail, or enroll them in **`🦮 Cub Obedience School`**) instead of spoiling it at the swipe!

4. **Complete, Shareable Club Guides (`VelvetJournalView.tsx` & `journalArticles.ts`) + Single-Profile Pilates Push-Present Puma**:
   - **Single-Profile Addition (Strictly 1 Profile Only)**: Add the **Early-30s Reformer Pilates Puma (`32F`)** looking for an energetic, devoted younger Cub to have her first baby with—openly planning her **diamond push present & Mommy Makeover** afterward. Strictly quarantined to that single character profile (never added to Pop-Culture Trivia, Field Guide, Checklist, or 8-Bit World).
   - **Eliminate All Stubbed Guide Articles**:
     - Expand `first-time-hosting-older-woman-apartment-checklist` from 2 stubbed paragraphs to **all 10 numbered, interactive checklist items** (with live checkable boxes + `👯‍♀️ Send Checklist to a Cub / Bestie`).
     - Expand all 1-paragraph stub guides (`junior-cougar`, `grown-son`, `cougar-town`, `movies-like-babygirl`, `spontaneous-weekend-getaway`, etc.) into genuine multi-section, scannable, funny & useful articles with honest read-time badges and zero Qigong/Mommy-Domme leakage.
     - Upgrade `astrology-zodiac-compatibility-older-woman-younger-man` from a 1-paragraph esoteric stub into an **interactive 12-Sign Her × Him Chemistry Picker** covering all 12 signs cleanly alongside practical audience-favorite takeaways (including how to spot Bucket-List Tourists vs. relationship-ready Cubs).
     - Add a **1-tap Share Article button** on every guide in `VelvetJournalView.tsx` opening `SocialShareSheetModal` with its canonical `/guides/<slug>/` URL so readers can text/WhatsApp/IG/Pinterest any guide directly.

---

## 7. Option A Desktop Phone Landing & PostHog Conversion/Affiliate/Share Analytics

1. **Option A — Desktop Phone Simulator Landing + `About` Anchor (`PairingMixerView.tsx` & `AboutClubView.tsx`)**:
   - On desktop viewports (`lg+`), `PairingMixerView.tsx` presents a two-column hero studio: **Left = Story & Club Command** (restored slogan **`"Lower Your Age Slider. Vet the Red Flags. Win Real Love."`**, 3-tap *Velvet Profile* setup, Earned Match Queue, `👯‍♀️ Invite Bestie` / `🎯 Send 60s Audition`, and `ℹ️ About the Game` anchor); **Right = Realistic Interactive iPhone Simulator Frame (`w-full max-w-[400px]`)** housing the scrollable 6-photo Hinge/Tinder profile feed (`aspect-[3/4]` portraits that can never stretch wide or crop faces/bodies!). On mobile viewports, the phone chrome steps out of the way so the card fills the mobile screen naturally.

2. **PostHog Full-Funnel Product, Affiliate & Share Analytics (`posthog-js@1`, `@posthog/react@1`, `posthog-node@6`)**:
   - Client SDK initialized optionally via `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` (routed through a first-party Cloudflare Worker `/ingest/*` reverse proxy on production so ad blockers never drop conversion or affiliate events; loud dev error if unconfigured; safe no-op in Vitest).
   - Track structured events with `app: "cougars_and_cubs_club"`:
     - **Affiliates**: `affiliate_clicked` (`product_id`, `product_name`, `category`, `placement`) on client + `affiliate_redirect_served` server-side in `worker/index.ts` (`/api/go/:id`).
     - **Shares**: `share_triggered` (`channel`: `whatsapp | imessage | instagram | tiktok | discord | x | threads | telegram | copy_link | native`, `share_surface`: `audition | bestie_profile | pop_quiz | checklist_25pt | guide | verdict_receipt`).
     - **Core Funnel & Monetization Conversions**: `velvet_profile_customized`, `profile_swiped`, `match_unlocked`, `profile_memory_bonus`, `off_app_imessage_unlocked`, `cub_obedience_graduated`, `date_stage_started`, `date_stage_completed`, `paywall_opened`, `stripe_checkout_clicked` (`tier`: `credits_299 | vip_699 | tip_5 | cameo_29`), `checkout_verified_server`, `waitlist_submitted`, `newsletter_subscribed`.
   - Identify users cleanly with a stable client UUID when they submit Newsletter, Waitlist, or VIP Restore (storing email as a person property, never as `distinct_id`).
