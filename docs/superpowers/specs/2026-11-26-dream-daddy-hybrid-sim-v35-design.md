# Cougars & Cubs Club v35 — *Dream Daddy* × *Hinge* × *In The Wild* Hybrid Simulation Design Spec

**Date:** 2026-11-26
**Status:** Ready for Approval (Builder Check Completed)
**Target Domain:** `https://cougarsandcubs.club`

---

## 1. Intent & Why

*Cougars & Cubs Club* (`v35`) unifies the entire product into a **single, cohesive, art-directed romantic-comedy dating simulation** inspired by *Dream Daddy: A Dad Dating Simulator* and modern app-romance hits (*Hinge*, *MeChat*, *Winked*).

### Core Design Thesis: "Vet the Traps, Go Back to the Drawing Board, Win Real Love"
The North Star of the game is **winning a real, lasting Chapter-Two relationship (S-Rank True Romance Ending)**—not mindlessly chatting forever or collecting shallow cards:
1. **Disguised Red Flags vs. Real Human Vulnerability**: Half the people you meet look dreamy at first glance, yet hide real `r/CougarsAndCubs` dealbreakers in Tinder chat or off-app iMessage (*lying about their age to bypass filters, never able to talk after 7 PM because they're married, 48-hour love-bombing before flaking, fetishizing older women as a bucket-list kink, or asking to come straight to your home on Date #1*).
2. **"Clock It & Cut Loose" Gamification**: At **any beat in Tinder Chat or Off-App iMessage**, the player can hit **`🚩 Cut Loose (Back to the Drawing Board)`**:
   - **Correctly cutting a disguised Trap loose in Text/iMessage** awards a **🏆 Bullet-Dodged Discernment Bonus** (+XP, +Intuition Meter, Bestie celebration text, shareable *Bullet Dodged Receipt*, and preserves your **Friday Night Heart** so you head right back to Hinge or out *In The Wild*).
   - **Ignoring red flags in Text/iMessage** lets you walk straight into a **Date Disaster** (stood up Friday at 4 PM, spouse calls mid-dinner, ex-husband ambush), costing **`-1 Friday Heart`** (`2 Cr` Rewind or start fresh back at the drawing board).
   - **Prematurely ghosting a Genuine Lead** over a *normal human insecurity* (e.g., nervous about his same-age mom, post-divorce marriage caution, grad-school stipend) triggers a Bestie reality-check (*"Hold on—that's vulnerability, not a red flag!"*) so players learn real emotional discernment.
3. **Strict "One-Joke, One-Home" Content Vault**: Every joke, red flag, IRL meet-cute, courtroom case, checklist item, and pop-culture trivia question appears in **one place only**. Overused filler (`pine pollen`, `qigong`, `tai chi`, `seed oil`, `bernedoodle`) is removed completely.
4. **Cohesive Visuals, Capped Chats & Real Monetization**: Primitive stick-figure PixiJS circles, boxy 8-bit `fillRect` maps, the 57-card front-page dump, endless aimless AI chats, and free-credit giveaways are retired in favor of **multi-expression animated portraits**, **10 illustrated *In The Wild* city venues**, **6-beat branching chats with Photo Drops**, **one-time `3` starter credits (`0` free handouts)**, an always-visible **☕ Tip Jar**, and **External Affiliate Date-Prep Picks**.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Clean Two-Door Discovery (`📱 Hinge` + `🗺️ In The Wild`)**: Going *"back to the drawing board"* after cutting an app red-flag loose feels fresh because **half the romanceable cast are *"In The Wild Exclusives"*** who refuse dating apps (like the `5'2"` tenured Literature Professor at Hawthorne University, the M&A Partner at the Downtown Hotel Martini Bar, the Airport-Pickup Younger Zaddy, and the Custom Carpenter).
- **Authentic Hinge Scrolling & ❤️ Prompt-Reply**: Vertical iOS Hinge cards with **6 character-specific slides**, **Vitals Strip** (`Age`, `Height`, `Job`, `School`, `Looking For`, `Kids / Marriage Stance`), and **3 Prompts** where tapping ❤️ on any photo/prompt opens 3 witty openers.
- **Capped 6-Beat Text & iMessage Vetting -> 3 Animated Visual-Novel Dates**: Structured choices (`2` free + `1 Cr` VIP smooth/spicy + optional `1 Cr` Custom AI Riff), **`2 Cr` Blurred Photo Drops**, active **`🚩 Cut Loose`** discernment button, and **3 Dates** culminating in True Love (S/A), Bittersweet Fling (B), or Roasted Disaster endings.
- **55+ Question Wikimedia & Official YouTube Trailer Quiz**: Verified `CC-BY`/`PD` portraits + 23 `oembed`-verified official studio YouTube trailers & music videos (`youtube-nocookie.com/embed/...`) across movies (headlined by Jennifer Lawrence's *No Hard Feelings*, *Babygirl*, *The Idea of You*, *Bridget Jones: Mad About the Boy*, *American Pie*, *Prime*, *Good Luck to You, Leo Grande*, *The Graduate*, *How Stella Got Her Groove Back*, and more), TV, books, songs, and 25+ celebrity couples (3-to-40 year woman-older gaps).
- **Tight Unit Economics**: Keep your 4 live Stripe links (`$2.99` `15 Cr`, `$6.99` `VIP Pass`, `$5` `Tip Jar`, `$29` `Custom Cameo`), strict **one-time `3` starter credits** (`0` daily refill, `0` free referral/waitlist/newsletter credits), prominent **☕ Tip Jar**, and external **Affiliate Boutique** (`/api/go/:id`).

### Non-Goals
- Real-world user-to-user dating or public unmoderated chatrooms.
- Native App Store / Steam wrappers in this milestone (web/mobile-web PWA on Cloudflare Workers).

### Anti-Goals (Immediate Failure Conditions)
1. **Zero Joke/Trope Repetition Across Modes**: `pine pollen`, `qigong`, `tai chi`, `seed oil`, and `bernedoodle` are purged; no joke repeats across Hinge, Wild Map, Chats, Dates, Courtroom, Checklist, or Trivia.
2. **Zero Stick Figures or 8-Bit Rectangle Maps**: Retire geometric `PIXI.Graphics` stick/circle rigs and pixel `fillRect` maps completely.
3. **Zero Front-Page Clutter**: Never dump 57 cards or 8 competing banners on screen 1.
4. **Zero Endless Chatbot Drift**: Every chat chapter resolves in `<= 6` beats into a Date unlock, Photo Drop, or Cut-Loose / Unmatch outcome.
5. **Zero Free Credit Farming**: Quizzes, checklists, courtroom votes, tea spills, newsletters, waitlists, and referrals award **XP / Badges / Polaroids only (`0` Credits)**.

---

## 3. Approaches Considered

1. **Approach A — App-Only *Dream Daddy* × *Hinge* Sim**: Cleanest single feed, but misses IRL age-gap culture (*hotel bars, airport pickups, campus lectures, salsa nights*).
2. **Approach B — Linear 10-Chapter Sitcom**: High cliffhanger control, but removes player freedom to vet, cut loose, and choose who to pursue.
3. **Approach C — Stat-Grinding Weekly Calendar**: Heavy spreadsheet friction before casual social visitors reach the humor and romance.
4. **Selected Approach (Hybrid *Hinge* + *In The Wild* Exclusives + *Cut-Loose* Vetting Campaign)**:
   - Unites **📱 Hinge** and the **🗺️ 10-Spot Illustrated City Map** around a **3-Heart Chapter-Two Campaign**: spot disguised red flags in Text/iMessage to walk away unscathed ("Back to the Drawing Board"), invest your 3 Dates in genuine partners, and earn a real relationship ending.

---

## 4. Core Game Loop & Progression Mechanics

### 4.1 Campaign HUD & "Friday Night Hearts" (`TopHudBar.tsx`)
- **Left**: `🐆 Cougars & Cubs` + Discernment Rank (`Lv.1 Sharp Eye`) + **3 Friday Hearts (`❤️❤️❤️`)** (protecting your peace—walking into a Date Disaster with a red-flag trap costs `1 Heart`; cutting a trap loose in Text/iMessage *saves* your Heart and grants `+25 Discernment XP`!).
- **Center (3 Clean Primary Views)**:
  - `📱 Hinge` (App Feed)
  - `🗺️ In The Wild` (10 Illustrated City Hotspots)
  - `💬 Chats & Dates` (Active Tinder / Earned iMessage threads + Bestie SMS)
- **Right (Always-Visible Monetization + Club Menu)**:
  - **`☕ Tip $5`** (rose-gold pill wired directly to live `tipJarUrl`, visible on mobile & desktop)
  - **`🛍️ Shop`** (32-item External Affiliate Boutique + `$29` Custom Cameo)
  - **`💎 3 Cr • VIP`** (`$2.99 / 15 Cr` & `$6.99 VIP Black Card`)
  - **`☰ Club Extras`** drawer: `🎬 55-Q Trailer & Pop Quiz` | `👑 Crown or Dump (30 Cases)` | `✅ 25-Pt Experience Test` | `📖 16 Guides & Zodiac Matcher` | `📸 Dateodex` | `ℹ️ About`.

### 4.2 Door #1: Authentic Hinge Feed (`HingeFeedView.tsx`) — 4 True Leads + 4 Disguised Traps per Role
- Because **half of Hinge is disguised traps** (just like real dating apps!), players must genuinely read all **6 slides**, **Vitals** (`Age`, `Height`, `Job`, `School`, `Looking For`, `Kids / Marriage Stance`), and **3 Prompts** instead of blindly swiping right.
- Tapping **❤️** on any specific photo or prompt opens a **3-Option Hinge Comment Sheet** (`2` Free openers + `1 Cr` **💎 Signature Smooth Opener**) that sparks **Chat Chapter 1 (Tinder DM)**.

### 4.3 Door #2: 10-Spot Illustrated "In The Wild" City Map (`InTheWildMapView.tsx`)
When you cut a Hinge dud loose (*"Back to the Drawing Board—let's go out in the real world!"*), the **10 Illustrated City Hotspots** offer **exclusive romance leads who aren't on Hinge** plus hilarious IRL etiquette tests:

| # | Illustrated Hotspot | Playable "Truth vs. Meme" Scene | Primary Character / Encounter |
|---|---|---|---|
| 1 | **🍸 The Velvet Room (Downtown Hotel & Steakhouse Piano Bar)** | 6 PM conference martinis at the mahogany bar. Spot the pale ring-tan-line on the slick finance guy vs. clinking glasses with an unbothered executive solo at the bar. | **Claire (46F M&A Partner — Wild Exclusive)** / **Graham (29M Ring-Tan-Line Trap)** |
| 2 | **🎓 Hawthorne University (Seminar & Post-Grades Reception)** | Electric office-hours banter with a `5'2"` Literature Professor. **Campus Rule**: Confess *before* final grades post = ethical rejection; wait until grades post & meet at the reception = romance unlock! | **Prof. Elena (44F — Wild Exclusive)** / **Julian (26M Hampstead TA)** |
| 3 | **✈️ Terminal B Arrivals & Centurion Lounge** | **Younger Zaddy Curbside Takeover**: Miles tracked your flight, meets you at Arrivals with your cortado, takes both your bags effortlessly in one hand, and already coordinated the black car & 8:15 corner table. | **Miles (31M Younger Zaddy — Wild Exclusive)** / **Celeste (58F)** |
| 4 | **💃 Havana & Vine (Salsa & Culinary Studio)** | 3-minute partner rotation & knife-skills pairing—zero creepy prowling, instant physical chemistry. | **Rafael (26M Carpenter — Wild Exclusive)** / **Sienna (39F)** |
| 5 | **🎾 Palisades Racquet & Pickleball Club** | Subbing into mixed doubles, net trash-talk, and watching out for the society divorcée using you to bait her ex-husband two courts over. | **Devon (24M Tennis Sub)** / **Brooke (42F Ex-Baiter Trap)** |
| 6 | **🏥 St. Jude Night-Shift Coffee Bay** | 6:45 AM shift swap: the `5'3"` divorced Trauma RN who mispronounces your name on purpose to tease you and wants zero mental load off-duty. | **Priya (36F Trauma RN — Wild Exclusive)** / **Marcus (27M Paramedic)** |
| 7 | **📚 Left Bank Books & First-Friday Gallery** | Reaching for Colette's *Chéri* / Abby Jimenez's *Part of Your World* over gallery prosecco; testing public poise. | **Julian (26M)** / **Celeste (58F — Wild Exclusive)** |
| 8 | **🏊 Dawn Lap Pool & Reformer Smoothie Bar** | **The Sub's Gym Rule**: Ambushing earbuds mid-set = *Instant Ick*; 3 weeks of lane nods + smoothie-bar banter = *Number Earned* (plus the *"Ma'am, there aren't cougars in New Jersey"* wildlife-officer cameo!). | **Marcus (27M — Wild Exclusive)** / **Summer (33F)** |
| 9 | **🛒 "The Cougarmarket" Wine & Olive Counter** | Roasts the Whole Foods prowler meme + features the viral **grocery-aisle lookalike tap mix-up** comedy scene! | **Leo (25M Sous-Chef)** + Shareable Wild Comedy Card |
| 10 | **🏡 Velvet Palms Cul-de-Sac & Backyard BBQ** | Home base with your **Bestie Jade/Sam**, custom walnut bookshelf install, and the **Friend's-Aunt Backyard BBQ** spark! | **Sienna (39F — Wild Exclusive)** / **Rafael (26M)** |

*(Builder Call: Each lead has one canonical primary intro—either Hinge OR their primary Wild Hotspot; visiting a secondary hotspot where an already-matched lead hangs out plays a bonus `3-beat Chemistry Cameo` (`+15% Chemistry`) without duplicating Chapter 1!)*

### 4.4 Capped 6-Beat Tinder & Off-App iMessage Vetting + `🚩 Cut Loose` Mechanic
- **Two-Stage Messaging (`Tinder App Chat` -> `Earned Off-App iMessage`)**:
  - **Chat 1 (6 Beats on Tinder — or Direct Off-App iMessage if met In The Wild!)**: Tests initial intent, conversational effort, and subtle tells.
  - **Chat 2 (6 Beats on iMessage — Post-Date #1)**: Tests evening availability (*"why does he vanish every night at 6:45 PM?"*), follow-through, and pacing.
  - **Beat Options**: `2` Free choices + `1` **💎 VIP Choice (`1 Cr`)** + optional **✍️ Custom AI Riff (`1 Cr`)** + persistent **`🚩 Cut Loose (Back to Drawing Board)`** button.
  - **Beat 4 Blurred Photo Drop (`2 Cr` / Free w/ VIP)**: Unblurs a character-specific candid scene into your permanent **Dateodex**.
  - **Payoff**: Surviving all 6 beats without getting unmatched—and without falling for a disguised trap—unlocks the next **Visual-Novel Date (`Date 1` -> `Date 2` -> `Date 3`)**.

### 4.5 3-Date Multi-Expression Visual Novel + Date-Prep Boutique + Animated "Cub Etiquette Sparring"
- **Expressive Portrait Stage**: High-res illustrated backdrops + character portraits with **5 animated expression states** (`neutral`, `smirk`, `laugh`, `blush`, `icked` via CSS spring transforms, lighting tints, expression badges & particle bursts) + **Bestie SMS Pop-Ins**.
- **Pre-Date #2 Affiliate Prep Drawer**: Optional *"Pick a Date Touch"* card linking to your **32-item External Affiliate Boutique** (`/api/go/:id` in new tab) + giving an in-scene dialogue callback.
- **3-Date *Dream Daddy* Arc**:
  - **Date 1 (`Vibe & Pacing Test`)**: Includes **The Robert Night-1 Trap** (trying to rush straight to the bedroom on Night 1 with guarded leads locks out their S-Rank True Romance!).
  - **Date 2 (`Real-Life Collision & Cub Training`)**: Meeting same-age parents, skeptical friends, or adult kids—plus an **animated dialogue-and-clicker *Cub Etiquette Sparring* scene** (replacing geometric stick figures!).
  - **Date 3 (`Vulnerability & True Relationship Verdict`)**: Navigating LAT vs. marriage, family timelines, and public hand-holding -> **S-Rank True Partnership**, **Bittersweet Fling**, or **Trap Explosion** (for players who ignored Text/iMessage red flags, with a `VIP / 2 Cr "Turn the Tables"` secret revenge climax on Wildcard Traps!).

---

## 5. Complete 16-Character Cast (`8` When Playing as Her, `8` When Playing as Him)

### 5.1 Playing as Her (`4` True Leads + `4` Disguised Red-Flag Traps)
- **True Leads (Goal: Win Real S-Rank Relationship)**:
  1. **Miles (`31M`, Wild Exclusive — ✈️ Airport / 🍸 Velvet Room)**: *The Airport-Luggage "Younger Zaddy" Architect* (`./images/cast/miles-32m.jpg`). Takes your bags at Arrivals, coordinates car + 8:15 dinner; hides workaholic vulnerability beneath flawless control.
  2. **Julian (`26M`, Hinge) — The Hampstead Literature Post-Grad** (`./images/cast/julian-27m.jpg`). British `"half seven is sorted / xx"` charm; navigating academic stipend/visa pride beside your career.
  3. **Rafael (`26M`, Wild Exclusive — 💃 Salsa / 🏡 Cul-de-Sac)**: *The Custom Walnut Carpenter* (`./images/cast/rafael-26m.jpg`). Grounded craftsmanship & salsa lead; tested at your snooty corporate black-tie gala.
  4. **Marcus (`27M`, Wild Exclusive — 🏊 Lap Pool / 🏥 Hospital)** (`./images/cast/marcus-26m.jpg`) & **Leo (`25M`, Hinge — Golden-Retriever Sous-Chef, `./images/cast/leo-25m.jpg`)** *(Note: both playable—`5` True Leads + `3` Disguised Traps = `8` total!)*: Marcus brings the *same-age protective mom Sunday dinner*; Leo brings *Black Cat × Golden Retriever pacing + Date #2 Cub Etiquette Sparring*.
- **Disguised Red-Flag Traps (Goal: Spot the Tell in Chat/iMessage & Cut Loose!)**:
  6. **Connor (`"27M"` -> Actually `21M`, Hinge Trap)** (`./images/cast/connor-bait.jpg`): Beat 2 confession *"full disclosure I'm 21 Hinge locked my age lol, let me come cook at your place tonight"*.
  7. **Graham (`29M`, Hinge & 🍸 Velvet Room Trap)** (`./images/cast/chadwick-24m.jpg`): *Joseph Twist*—impeccable daytime texts, **never free after 7 PM or Sundays**, pale wedding-ring tan line.
  8. **Devon (`24M`, Hinge Trap — The 48-Hour Love-Bomber Flake)** (`./images/cast/brandon-24m.jpg`): Writes three-paragraph soulmate poems Tuesday, calls you `"my dream MILF"`, then ghosts Friday at 4:15 PM unless cut loose first!

### 5.2 Playing as Him (`5` True Leads + `3` Disguised Red-Flag Traps = `8` Total)
- **True Leads (Goal: Win Real S-Rank Relationship)**:
  1. **Prof. Elena (`44F`, `5'2"`, Wild Exclusive — 🎓 Hawthorne University)** (`./images/cast/nadia-41f.jpg`). Tenured Comparative Lit professor; requires honoring the **Post-Grades Rule** before unlocking Left Bank Books romance.
  2. **Claire (`46F`, Wild Exclusive — 🍸 The Velvet Room)** (`./images/cast/claire-45f.jpg`). M&A Partner who divorced a man-child ex and swears *"never marrying again"*; won through consistent Living-Apart-Together partnership.
  3. **Priya (`36F`, `5'3"`, Wild Exclusive — 🏥 Hospital Coffee Bay)** (`./images/cast/priya-35f.jpg`). Night-shift Trauma RN Puma who teases you at shift change; tests follow-through and boundaries.
  4. **Sienna (`39F`, `5'4"`, Hinge & 🏡 Backyard BBQ)** (`./images/cast/sienna-38f.jpg`). Friend's-aunt / interior designer; tests public courage when the friend group finds out.
  5. **Summer (`33F`, `5'4"`, Hinge)** (`./images/cast/summer-32f.jpg`) *(plus **Celeste `58F`** `./images/cast/celeste-62f.jpg` at 📚 Gallery)*: Summer seeks a devoted younger partner ready for marriage & kids; Celeste tests unshakeable poise when waiters mistake you for her son.
- **Disguised Red-Flag Traps (Goal: Spot the Tell in Chat/iMessage & Cut Loose!)**:
  6. **Vanessa (`43F`, Hinge Trap — The "Separated" Mirage)** (`./images/cast/valentina-44f.jpg`): Claims *"practically divorced"*, refuses evening phone calls, husband texts mid-martini.
  7. **Brooke (`42F`, Hinge & 🎾 Racquet Club Trap — The Ex-Husband Pawn)** (`./images/cast/brooke-42f.jpg`): Drops subtle hints in iMessage (*"Wear navy—my ex hates navy"*); uses Date #1 strictly to make her ex jealous across the dining room.

---

## 6. Strict Non-Overlapping Content Vault & 55+ Question Due-Diligence Pop-Culture Canon

- **Zero Repeated Jokes ("One-Joke, One-Home" Law)**: Enforced by unit test scanning across `hingeProfiles`, `wildVenues`, `chatChapters`, `dateScripts`, `courtroomCases`, `checklistItems`, and `popCultureTrivia`. Zero `pine pollen`, `qigong`, `tai chi`, `seed oil`, or `bernedoodle` filler anywhere in the repo.
- **Every Embeddable YouTube ID Pre-Verified via `youtube.com/oembed` (`HTTP 200`)**: Served via privacy-enhanced `https://www.youtube-nocookie.com/embed/<id>` alongside verified open-licensed Wikimedia Commons portraits (`CC-BY` / `CC-BY-SA` / `PD`) with visible attribution captions.

### 6.1 Films (25 Canon Entries — 19 Official Trailer Embeds Verified)
1. ***No Hard Feelings* (2023)** — Jennifer Lawrence (Maddie, 32) & Andrew Barth Feldman (Percy, 19): Montauk Craigslist Buick Regal deal, Percy's tender piano cover of Hall & Oates's *"Maneater"*, and the fearless beach fight (`kIcLb0KAJAs` Sony green-band embed / `P15S6ND8kbQ` Sony red-band).
2. ***Babygirl* (2024)** — Nicole Kidman (Romy) & Harris Dickinson (Samuel): Halina Reijn's A24 CEO-intern thriller & the viral hotel-bar glass of milk scene (`-8Sx6U6Ou0Q`).
3. ***The Idea of You* (2024)** — Anne Hathaway (Solène, 40) & Nicholas Galitzine (Hayes Campbell, 24): Silver Lake gallery owner steps into August Moon's Coachella VIP trailer (`V8i6PB0gGOA`).
4. ***Bridget Jones: Mad About the Boy* (2025)** — Renée Zellweger (Bridget, 51) & Leo Woodall (Roxster, 29): Hampstead Heath park-ranger tree rescue (`DhAcAgULwYY`).
5. ***Good Luck to You, Leo Grande* (2022)** — Emma Thompson (Nancy Stokes, retired teacher) & Daryl McCormack (Leo Grande) (`TJcbZoJFLTU`).
6. ***The Graduate* (1967)** — Anne Bancroft (Mrs. Robinson, 35 IRL) & Dustin Hoffman (Benjamin Braddock, 29 IRL — only a 6-year real actor gap!) (`KVNFaxJspMQ`).
7. ***How Stella Got Her Groove Back* (1998)** — Angela Bassett (Stella, 40) & Taye Diggs (Winston, 20): inspired by Terry McMillan's real Jamaica vacation (`r3wbXFzPqcs`).
8. ***American Pie* (1999)** — Jennifer Coolidge (Stifler's Mom) & Eddie Kaye Thomas (Finch): launched `"MILF"` into global pop culture (`lp9Z4gc-9UA`).
9. ***Something's Gotta Give* (2003)** — Diane Keaton (Erica Barry) & Keanu Reeves (Dr. Julian Mercer, 36yo ER doctor courting her) (`3d9UYuqXz0I`).
10. ***Prime* (2005)** — Uma Thurman (Rafi, 37) & Bryan Greenberg (David, 23), with Meryl Streep as her therapist—and unwittingly David's mother.
11. ***A Family Affair* (2024)** — Nicole Kidman & Zac Efron (`Ytc2eifpiuQ`).
12. ***Lonely Planet* (2024)** — Laura Dern & Liam Hemsworth in Morocco (`lTu7j2GOGwQ`).
13. ***Magic Mike's Last Dance* (2023)** — Salma Hayek Pinault & Channing Tatum in London (`pBIGdw-BRxw`).
14. ***Cha Cha Real Smooth* (2022)** — Dakota Johnson & Cooper Raiff (`QRyyagJ9GPo`).
15. ***The Proposal* (2009)** — Sandra Bullock & Ryan Reynolds (real 12-year woman-older gap!) (`Wbhhokv84K4`).
16. ***Home Again* (2017)** — Reese Witherspoon & Pico Alexander (`TOyit5_mEQA`).
17. ***The Rebound* (2009)** — Catherine Zeta-Jones & Justin Bartha (`PlCsLXcmxaA`).
18. ***Happiness for Beginners* (2023)** — Ellie Kemper & Luke Grimes on the Appalachian Trail.
19. ***The Good Girl* (2002)** — Jennifer Aniston & 22yo Jake Gyllenhaal (`dLRRX2iK7tQ`).
20. ***I Could Never Be Your Woman* (2007)** — Michelle Pfeiffer & Paul Rudd (directed by Amy Heckerling).
21. ***Bull Durham* (1988)** — Susan Sarandon & Tim Robbins, sparking their real 21-year partnership (`qnWSvSrb1-I`).
22. ***White Palace* (1990)** — Susan Sarandon (Nora, 43yo St. Louis waitress) & James Spader (Max, 27yo ad exec).
23. ***Harold and Maude* (1971)** — Ruth Gordon (79) & Bud Cort (20) with Cat Stevens soundtrack (`_ckWTn-y5Rw`).
24. ***Sunset Boulevard* (1950)** — Gloria Swanson (Norma Desmond) & William Holden (Joe Gillis).
25. ***Adore* (2013)** / ***Unfaithful* (2002)** / ***Notes on a Scandal* (2006)** / ***The Reader* (2008)** — arthouse & thriller touchstones.

### 6.2 Television (11 Canon Entries)
*Sex and the City* (Samantha Jones & Smith Jerrod), *Ted Lasso* (Rebecca Welton & Sam Obisanya on *Bantr*), *Succession* (Gerri Kellman & Roman Roy), *Emily in Paris* (Sylvie Grateau & Erik), *The White Lotus* (Tanya / resort arcs), *Younger* (Liza & Josh across 7 seasons), *Cougar Town* (Jules Cobb & *"Big Carl"*), *Mrs. Fletcher* (Kathryn Hahn), *Hacks* (Deborah Vance), *Desperate Housewives* (Gabrielle Solis), and *30 Rock* (Liz Lemon & Criss Chros).

### 6.3 Books & Literature (10 Canon Entries)
Colette's *Chéri* (1920), Abby Jimenez's *Part of Your World* (2022), Robinne Lee's *The Idea of You* (2017 — book vs. movie ending!), Terry McMillan's *How Stella Got Her Groove Back* (1996), Miranda July's *All Fours* (2024), Julia May Jonas's *Vladimir* (2022), Katherine Center's *Happiness for Beginners* (2015), Tracey Garvis Graves's *On the Island* (2011), Julian Barnes's *The Only Story* (2018), and Jane Porter's *Flirting with Forty* (2006).

### 6.4 Songs & Music Video Moments (8 Canon Entries — 4 VEVO/Official Video Embeds Verified)
Fountains of Wayne *"Stacy's Mom"* (`dZLfasMPOU4`), Simon & Garfunkel *"Mrs. Robinson"* (`WTxS7RrjqqY`), Daryl Hall & John Oates *"Maneater"* (`yRYFKcMa_Ek`), Yung Gravy *"Betty (Get Money)"* (`8oE5Z2GLhNc` + bringing Sheri Easterling to the 2022 MTV VMAs), Rod Stewart *"Maggie May"*, Cher (*"Mom, I AM a rich man"*), Madonna *"Hung Up"*, and Mariah Carey *"Touch My Body"* (where she met Nick Cannon on set).

### 6.5 Real Celebrity Woman-Older Couples (28 Canon Entries — `3` to `40` Year Gaps)
- **15–40 Years**: Cher & AE Edwards (`40`), Kris Jenner & Corey Gamble (`25`), Brigitte & Emmanuel Macron (`24`), Kate Beckinsale & Pete Davidson (`20`), Sandra Bullock & Ryan Gosling (`16`), Tina Turner & Erwin Bach (`16`), Heidi Klum & Tom Kaulitz (`16`), Demi Moore & Ashton Kutcher (`15`), Sienna Miller & Oli Green (`15`).
- **10–14 Years**: Kim Cattrall & Russell Thomas (`14`), Kristin Cavallari & Mark Estes (`13`), Deborra-Lee Furness & Hugh Jackman (`13`), Lisa Bonet & Jason Momoa (`12`), Britney Spears & Sam Asghari (`12`), Mariah Carey & Nick Cannon (`11`), Ellie Goulding & Beau Minniear (`11`), Priyanka Chopra & Nick Jonas (`10`), Shakira & Gerard Piqué (`10` — strawberry jam jar!), Olivia Wilde & Harry Styles (`10`).
- **3–9 Years**: Gabrielle Union & Dwyane Wade (`9`), Julianne Moore & Bart Freundlich (`9`), Vanessa Hudgens & Cole Tucker (`8`), Eva Mendes & Ryan Gosling (`7`), Cameron Diaz & Benji Madden (`7`), Elsa Pataky & Chris Hemsworth (`7`), Miley Cyrus & Maxx Morando (`6`), Goldie Hawn & Kurt Russell (`5.5`), Yvonne McGuinness & Cillian Murphy (`4`), Halle Berry & Van Hunt (`3`), Meghan Markle & Prince Harry (`3`).

---

## 7. Economy, Live Stripe Links, Tip Jar & Legacy SEO Mapping (Builder Calls Included)

1. **Preserving Live Stripe Links (`Builder Call`)**:
   - Retains all 4 live `buy.stripe.com` Payment Links already configured in `src/config/monetization.ts`:
     - **`$2.99` Credit Pack (`15 Credits`)** (`stripeCreditPackUrl`)
     - **`$6.99` VIP Club Black Card** (`stripeVipPassUrl` — unlimited VIP choices, Photo Drops, Custom AI Riffs, Heart Rewinds, & `"Turn the Tables"` trap revenge endings)
     - **`$5.00` Creator Tip Jar** (`tipJarUrl` — pure creator tip + supporter badge, `0` free credit inflation; `/api/verify-checkout` updated to inspect `tier` query/metadata cleanly)
     - **`$29.00` Custom Character Cameo** (`cameoCommissionUrl` — preserved inside `BoutiqueAndVipModal`).
2. **Strict One-Time `3` Starter Credits (`Builder Call`)**:
   - New `velvet_wallet_v35` starts with **`3 Credits` once** (`no` daily UTC auto-refill, `0` credits from newsletter, waitlist, referrals, courtroom, quizzes, or shares).
   - Smart players preserve their 3 Friday Hearts for free by **spotting red flags in Text/iMessage and hitting `🚩 Cut Loose`**; reckless players who ignore red flags or want `2 Cr` Blurred Photo Drops, `1 Cr` Spicy VIP lines, `1 Cr` Custom AI Riffs, or `2 Cr` Heart Rewinds convert to `$2.99` Credits or `$6.99` VIP.
3. **Clean Retirement + Zero-404 SEO & Audition Compatibility (`Builder Call`)**:
   - Retires `PairingMixerView` (57-card dump), `PixiCubAcademyStage` (stick figures), `EightBitAdventureWorld` (8-bit boxes), and wellness-tainted `EPISODES`.
   - Preserves `PartnerAuditionView` (`?challenge=`) mapped onto `v35` date dilemmas, and maps all 16 `/guides/*/` static SEO `?dilemma=<slug>` links cleanly into their corresponding `v35` Lead or *In The Wild* hotspot so zero inbound links break.
