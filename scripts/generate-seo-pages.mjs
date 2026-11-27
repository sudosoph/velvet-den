#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_BASE = (
  process.env.PUBLIC_BASE_URL || 'https://cougarsandcubs.club/'
).replace(/\/?$/, '/');

const monetizationSource = readFileSync(join(ROOT, 'src/config/monetization.ts'), 'utf8');
const affiliatesSource = readFileSync(join(ROOT, 'src/lib/affiliates.ts'), 'utf8');
const configSubId = monetizationSource.match(/partnerSubId:\s*'([^']*)'/)?.[1] || '';

// Only emit direct Amazon URLs when AMAZON_ASSOCIATE_TAG is explicitly passed in env;
// otherwise route static SEO links through /api/go/:id for KV tag rotation & PostHog click tracking.
const EXPLICIT_AMAZON_TAG = (process.env.AMAZON_ASSOCIATE_TAG ?? '').trim();
const PARTNER_SUB_ID = (process.env.PARTNER_SUB_ID ?? configSubId).trim();

const CANONICAL_ITEMS_BY_ID = {};
for (const m of affiliatesSource.matchAll(
  /\{\s*id:\s*'([^']+)',\s*name:\s*(?:'([^']+)'|"([^"]+)"),[\s\S]*?priceDisplay:\s*'([^']+)',[\s\S]*?merchantUrl:\s*'([^']+)'/g,
)) {
  const id = m[1];
  CANONICAL_ITEMS_BY_ID[id] = {
    name: m[2] || m[3],
    price: m[4],
    url: m[5],
    img: `../../images/products/${id}.jpg`,
  };
}

const PROHIBITED_ADULT_DOMAINS = [
  'lovehoney.com',
  'adamandeve.com',
  'pinkcherry.com',
  'bad-dragon.com',
  'lelo.com',
];

const PRODUCT_CATALOG_MAP = new Proxy(CANONICAL_ITEMS_BY_ID, {
  get(target, prop) {
    if (typeof prop === 'string' && prop in target) {
      return target[prop];
    }
    return (
      target['espresso-martini-barware'] || {
        name: 'Mint & Mortar Copper Cocktail Shaker Set',
        price: '$38 Barware Set',
        url: 'https://www.amazon.com/dp/B08KQCX9Z9',
        img: '../../images/products/espresso-martini-barware.jpg',
      }
    );
  },
});

function tagAmazon(productId, slug) {
  const prod = PRODUCT_CATALOG_MAP[productId];
  const canonicalUrl = prod.url;
  const u = new URL(canonicalUrl);
  const host = u.hostname.toLowerCase();
  for (const banned of PROHIBITED_ADULT_DOMAINS) {
    if (host === banned || host.endsWith(`.${banned}`)) {
      throw new Error(`Blocked prohibited adult domain (${host})`);
    }
  }
  if (!EXPLICIT_AMAZON_TAG) {
    return `${PUBLIC_BASE}api/go/${encodeURIComponent(productId)}?src=${encodeURIComponent(`seo_${slug}`)}`;
  }
  if (host.includes('amazon.')) {
    u.searchParams.set('tag', EXPLICIT_AMAZON_TAG);
    u.searchParams.set('linkCode', 'll2');
  }
  if (PARTNER_SUB_ID) {
    u.searchParams.set('subId', PARTNER_SUB_ID);
  }
  u.searchParams.set('utm_source', 'cougarsandcubs_seo');
  u.searchParams.set('utm_medium', 'organic_guide');
  u.searchParams.set('utm_campaign', slug);
  return u.toString();
}

const STATIC_GUIDES = [
  {
    slug: 'cougar-vs-puma-vs-jaguar-dating-age-chart',
    title: 'Cougar vs. Puma vs. Jaguar Age Chart: Older Woman Dating Younger Man Guide',
    description:
      'What is the difference between a Puma, Cougar, Jaguar, and Panther in age-gap dating? Learn the real older-woman / younger-man relationship slang, etiquette, and rules.',
    episodeId: 'velvet-room',
    heroImg: '../../images/scenes/velvet-room-bar.jpg',
    dontText: 'never been with a cougar before, bucket list tonight??',
    doText: 'Booked us the quiet corner booth at 7:30 Friday—Sancerre is already waiting.',
    paragraphs: [
      'In older-woman / younger-man age-gap dating communities such as Cougars & Cubs Club, relationship labels follow clear community etiquette rather than tabloid clichés.',
      'A Puma refers to a woman in her 30s (under 40) dating a younger man. A Cougar is a woman aged 40 or older with at least a 10-year age gap with her younger male partner (Cub) or younger female partner (Kitten). Women in their 50s embrace Jaguar status, and confident women 60+ claim Panther.',
      'Above all, remember Rule #1: Cougar never means Sugar Mama, and many high-achieving women love soft-life romance, planned reservations, flowers, and car doors opened after managing everyone else’s mental load all week.',
    ],
    faqs: [
      {
        q: 'What age qualifies as a Cougar versus a Puma in dating?',
        a: 'In age-gap dating etiquette, a Puma is a woman aged 30 to 39 dating a younger partner, while a Cougar is a woman aged 40+ who is at least 10 years older than her partner.',
      },
      {
        q: 'What does Cub mean in an older-woman younger-man relationship?',
        a: 'A Cub is an adult younger man (10+ years younger) dating or partnered with a Cougar, Puma, or Jaguar.',
      },
    ],
    pickIds: ['princess-mulberry-silk-robe', 'espresso-martini-barware'],
  },
  {
    slug: 'first-time-hosting-older-woman-apartment-checklist',
    title: 'First Time Hosting an Older Woman at Your Place: The Apartment Audit Checklist',
    description:
      'Inviting an older woman back to your apartment in your 20s? Pass the bathroom and bedroom test: oak bedframe, cotton percale sheets, hand soap, and a lidded trash can.',
    episodeId: 'velvet-palms-bbq',
    heroImg: '../../images/scenes/sunday-kitchen-sanctuary.jpg',
    dontText: 'come thru whenever lol my roommate left dishes in the sink',
    doText: 'Dinner is simmering, lamps are dimmed, and chilled sparkling water is poured whenever you arrive.',
    paragraphs: [
      'When an accomplished woman in her 40s or 50s visits a younger man’s apartment for the first time, square footage rarely matters—hygiene and adult preparation decide everything.',
      'Start with the non-negotiable bathroom checklist: botanical liquid hand soap (never dish soap), two fresh guest hand towels, a spotless mirror, and a bathroom trash can with a closed lid.',
      'In the bedroom, retire dark microfiber dorm sheets for breathable 600-thread-count cotton percale on a real bedframe with four supportive pillows.',
    ],
    faqs: [
      {
        q: 'Do older women care if a younger man lives in a small apartment?',
        a: 'No—financial responsibility, spotless cleanliness, clean cotton sheets, and a lidded bathroom trash can matter far more than luxury square footage.',
      },
    ],
    pickIds: ['hosting-lidded-bin-soap', 'percale-hosting-sheets'],
  },
  {
    slug: 'best-gifts-for-older-woman-girlfriend-dating-guide',
    title: 'Best Gifts for an Older Woman Girlfriend Who Already Has Everything',
    description:
      'Dating a successful woman in her 40s or 50s? Choose thoughtful, romantic date-night and soft-life gifts that prove emotional maturity and observation.',
    episodeId: 'terminal-b-airport',
    heroImg: '../../images/scenes/palm-springs-resort.jpg',
    dontText: 'i didnt know what to get u since u already buy everything lol',
    doText: 'Remembered the Sicilian olive oil you mentioned three weeks ago—plus Sunday dinner is on me.',
    paragraphs: [
      'When your girlfriend already owns her home and buys her own luxury staples, the best gifts focus on sensory comfort, shared rituals, and taking tasks off her plate.',
      'Top favorites include a 22-momme mulberry silk robe for her evening wind-down, cooking Sunday dinner from scratch in a washed cross-back linen apron, and pairing wine night with an intimacy conversation deck.',
    ],
    faqs: [
      {
        q: 'How can a younger man impress an older woman when she earns more?',
        a: 'Lead with planning, consistency, thoughtful observation, and personal comfort gifts rather than trying to compete on flashy price tags.',
      },
    ],
    pickIds: ['trophy-boyfriend-cooking-apron', 'princess-mulberry-silk-robe', 'fill-in-love-coupon-cards'],
  },
  {
    slug: 'millennial-vs-gen-z-age-gap-dating-code-switching',
    title: 'Millennial & Gen-X Women Dating Gen-Z Men: The Courting Code-Switch Guide',
    description:
      'Why asking a 45-year-old woman for Snapchat is an instant red flag, and how younger men code-switch texting, emojis, phone calls, and chivalry across generations.',
    episodeId: 'left-bank-books',
    heroImg: '../../images/scenes/wine-bar-booth.jpg',
    dontText: 'yo u look crazy good for ur age whats ur snap??',
    doText: 'Here is my cell—free for a quick 6 PM call Thursday before our Friday 7:30 reservation?',
    paragraphs: [
      'Younger men who thrive in age-gap relationships master generational code-switching: keeping emotional literacy and consent awareness while dropping Snapchat requests and vague midnight texts.',
      'Calibrate to her cohort: Elder Millennial women (34-45) love a quick text before a phone call plus a calendar dinner invite, while Gen-X women (46-60) appreciate a direct 6 PM phone call over all-day work texting.',
    ],
    faqs: [
      {
        q: 'Should you ask an older woman for her Snapchat on a dating app?',
        a: 'Never. Offer your real phone number and propose a clear date, time, and neighborhood spot instead.',
      },
    ],
    pickIds: ['date-night-oud-bergamot', 'after-dark-couples-deck'],
  },
  {
    slug: 'older-woman-younger-man-relationship-problems-kids-stigma',
    title: 'Older Woman, Younger Man Relationships: Navigating Kids, Waiters & Insecurities',
    description:
      'Real solutions to older-woman / younger-man relationship challenges: fertility and kids mismatches, public stares, mirror doubts, and meeting adult children.',
    episodeId: 'velvet-palms-bbq',
    heroImg: '../../images/scenes/cozy-rain-suite.jpg',
    dontText: 'wait are people staring at us right now??',
    doText: 'Corner booth for two, please—and two glasses of the Sancerre.',
    paragraphs: [
      'Every real age-gap couple eventually faces three classic moments: laughing off a clueless restaurant host, reassuring silent insecurities in bright morning light, and having an honest conversation about kids and timelines.',
      'While she may privately wonder how softer skin compares to 23-year-olds, he is usually wondering if his composure is strong enough for an accomplished woman to invite him back.',
    ],
    faqs: [
      {
        q: 'How do older-woman / younger-man couples navigate the kids conversation?',
        a: 'Discuss family and timeline goals transparently in the first few months so both partners choose a shared path with eyes wide open.',
      },
    ],
    pickIds: ['trail-hydration-vest', 'after-dark-couples-deck'],
  },
  {
    slug: 'celebrity-cougars-and-cubs-pop-culture-guide',
    title: 'Celebrity Cougars and Cubs: Jessica Alba, Sienna Miller, Ellie Goulding & Miley Cyrus',
    description:
      'From Jessica Alba & Danny Ramirez and Sienna Miller & Oli Green to Ellie Goulding & Beau Minniear and Miley Cyrus & Maxx Morando, how pop culture entered its Golden Cougar Era.',
    episodeId: 'velvet-room',
    heroImg: '../../images/scenes/velvet-room-bar.jpg',
    dontText: 'so is this like a celebrity PR stunt??',
    doText: 'Queue up No Hard Feelings or The Idea of You Friday—I am bringing takeout.',
    paragraphs: [
      'Hollywood’s double standard around older-woman / younger-man relationships has officially collapsed, led by self-made women dating confident younger partners without apology.',
      'Jessica Alba and Danny Ramirez embody effortless 40s Cougar × early-30s Cub chemistry, while Sienna Miller & Oli Green and Ellie Goulding & Beau Minniear welcomed babies together while dominating London and Met Gala red carpets.',
    ],
    faqs: [
      {
        q: 'Who are the most famous Cougar and Cub celebrity couples right now?',
        a: 'Top pop-culture older-woman / younger-man couples include Jessica Alba & Danny Ramirez, Sienna Miller & Oli Green, Ellie Goulding & Beau Minniear, Miley Cyrus & Maxx Morando, Heidi Klum & Tom Kaulitz, and Priyanka Chopra & Nick Jonas.',
      },
    ],
    pickIds: ['cub-grooming-beard-skincare-kit', 'princess-mulberry-silk-robe'],
  },
  {
    slug: 'dating-younger-man-perimenopause-menopause-intimacy',
    title: 'Dating a Younger Man in Perimenopause & Menopause: Real Intimacy & Sleep Guide',
    description:
      'Honest advice on perimenopause libido surges, 3 AM hot flashes, menopause intimacy, cooling bamboo sheets, and high-EQ communication with a younger male partner.',
    episodeId: 'dawn-lap-pool',
    heroImg: '../../images/scenes/hotel-pool-sauna.jpg',
    dontText: 'why is the AC freezing in here lol',
    doText: 'Set the bedroom to 62°F, put the cooling bamboo sheets on, and poured ice water for your nightstand.',
    paragraphs: [
      'One of the best-kept secrets of 40s, 50s, and 60+ Cougar, Jaguar, and Panther relationships is how liberating intimacy becomes once communication replaces guesswork.',
      'In perimenopause, women frequently experience late-evening desire surges paired with 3 AM temperature swings. High-EQ Cubs keep bedrooms at 62°F and upgrade to 100% bamboo viscose cooling sheets.',
    ],
    faqs: [
      {
        q: 'How do couples handle perimenopause night sweats and menopause intimacy shifts?',
        a: 'Pair breathable bamboo cooling sheets and a 62°F bedroom with unhurried warmup, open communication, and chilled bedside hydration.',
      },
    ],
    pickIds: ['cooling-bamboo-sheets', 'silk-pillowcase-sleepover-duo'],
  },
  {
    slug: 'junior-cougar-6-year-age-gap-relationship-guide',
    title: 'Junior Cougar Meaning: Why a 5-to-9 Year Age Gap Is Modern Dating’s Sweet Spot',
    description:
      'Under strict 10-year Cougar rules, a 6-to-8 year older-woman / younger-man gap earns the Junior Cougar badge. Learn why couples love the micro-generational sweet spot.',
    episodeId: 'left-bank-books',
    heroImg: '../../images/scenes/wine-bar-booth.jpg',
    dontText: 'six years barely even counts!!',
    doText: 'Six years means you had your driver’s license while I was finishing algebra—still counts.',
    paragraphs: [
      'While strict Cougars & Cubs Club taxonomy reserves official Cougar status for a 10+ year gap at age 40+, women who are 5 to 9 years older than their partner proudly claim the "Junior Cougar" title.',
      'A 6-year gap (such as 38F × 32M, or Miley Cyrus & Maxx Morando) blends shared cultural touchstones and zero public stares with homeowner-era intentionality.',
    ],
    faqs: [
      {
        q: 'Does a 6-year age gap count as a Cougar relationship?',
        a: 'Community purists playfully dub a 5-to-9 year older-woman / younger-man gap a "Junior Cougar" matchup, offering age-gap spark with closely aligned life timelines.',
      },
    ],
    pickIds: ['cast-iron-steak-skillet', 'after-dark-couples-deck'],
  },
  {
    slug: 'older-woman-grown-son-same-age-meeting-parents-guide',
    title: 'Dating an Older Woman With a Grown Son Your Age (Plus Meeting Parents & First Wedding +1)',
    description:
      'Real advice from Cougar and Cub couples on navigating grown children the same age as her partner, meeting his same-age parents, and attending your first wedding as a +1.',
    episodeId: 'velvet-palms-bbq',
    heroImg: '../../images/scenes/sunday-kitchen-sanctuary.jpg',
    dontText: 'im basically the man of the house now right??',
    doText: 'Already told my mom all about you—she cannot wait to talk 90s concerts over brunch.',
    paragraphs: [
      'One of the most talked-about milestones in 18+ year older-woman / younger-man relationships happens when her adult son or daughter is within a year or two of her partner’s age.',
      'Successful couples follow three golden rules: brief family warmly ahead of time instead of springing doorway ambushes, never try to play "stepdad" to a peer-aged adult child, and carry calm pride onto the dance floor at your first wedding together.',
    ],
    faqs: [
      {
        q: 'How should a younger man act when meeting an older girlfriend’s grown children?',
        a: 'Treat them with warm peer-level respect, zero step-parent posturing, and steady consistency.',
      },
    ],
    pickIds: ['espresso-martini-barware', 'after-dark-couples-deck'],
  },
  {
    slug: 'spontaneous-weekend-getaway-date-ideas-older-woman-younger-man',
    title: 'Best Cougar & Cub Date Ideas: 18-Hour Getaways, Campus Sushi, Meadow Picnics & Bowling',
    description:
      'Skip boring dinner interviews: why spontaneous 18-hour boutique hotel pool & sauna getaways, campus sushi strolls, sunlit picnics, and retro bowling spark unforgettable chemistry.',
    episodeId: 'dawn-lap-pool',
    heroImg: '../../images/scenes/campus-autumn-sushi.jpg',
    dontText: 'wanna just come watch TV on my couch??',
    doText: 'Packed figs, Brie, and sourdough—coastal overlook at 5:30, then retro bowling at 8?',
    paragraphs: [
      'Accomplished women in their late 30s, 40s, 50s, and 60s have already sat through a lifetime of stiff corporate steakhouse dinners—what actually wins their hearts is playful energy, planning effort, and romance.',
      'Top fan-favorite dates include a spontaneous 18-hour boutique getaway featuring sunset rooftop cocktails plus a heated hotel pool and cedar sauna, an autumn university quad stroll with omakase sushi, or a hand-packed meadow picnic.',
    ],
    faqs: [
      {
        q: 'How can a younger man on an early-career budget plan an amazing date for an older woman?',
        a: 'Thoughtful preparation beats expensive flash every time: pack a linen-blanket meadow picnic with fresh baguette and strawberries, followed by playful retro bowling.',
      },
    ],
    pickIds: ['princess-mulberry-silk-robe', 'houseboy-linen-apron'],
  },
  {
    slug: 'cougar-town-pop-culture-age-gap-dating-history',
    title: 'From Cougar Town’s "Big Carl" to Modern Icons: How Pop Culture Rewrote Age-Gap Romance',
    description:
      'How Courteney Cox’s Cougar Town ("Big Carl" wine glasses & post-divorce joy) paved the way for modern Cougar and Cub romances in film, TV, and celebrity culture.',
    episodeId: 'cougarmarket',
    heroImg: '../../images/scenes/cougarmarket-wine.jpg',
    dontText: 'aren’t you supposed to settle down quietly after divorce??',
    doText: 'Brought a fresh bottle of Pinot and a Big Carl glass to toast six months.',
    paragraphs: [
      'When Courteney Cox launched Cougar Town as newly divorced 40-something Jules Cobb armed with her oversized wine glass "Big Carl," television began shifting older-woman / younger-man stories from punchlines to joyful self-reclamation.',
      'Today, from romantic films and BookTok bestsellers to real-life couples celebrating anniversaries, modern Cougars and Cubs embrace humor, emotional intelligence, and unapologetic partnership.',
    ],
    faqs: [
      {
        q: 'What was Jules Cobb’s giant wine glass called on Cougar Town?',
        a: 'Courteney Cox’s character Jules Cobb famously named her comically oversized red wine glass "Big Carl" (later followed by Big Joe and Big Lou).',
      },
    ],
    pickIds: ['big-carl-giant-wine-glass', 'bridget-jones-cougar-town-watch', 'chic-candlelit-menu-readers'],
  },
  {
    slug: 'astrology-zodiac-compatibility-older-woman-younger-man',
    title: 'Zodiac & Star-Sign Compatibility in Older-Woman / Younger-Man Relationships',
    description:
      'Explore astrology chemistry for Cougars and Cubs: why Scorpio, Aries, Leo, Taurus, and Virgo pairings create magnetic cross-generational romance.',
    episodeId: 'havana-salsa',
    heroImg: '../../images/scenes/havana-salsa-studio.jpg',
    dontText: 'astrology is fake lol anyway wyd',
    doText: 'Texted my mom for my exact birth time—tell me if Scorpio and Taurus survive Friday dinner.',
    paragraphs: [
      'Astrology-loving Cougars and Cubs swear by cross-element magnetism: fiery Aries and Leo women thrive with grounded, devoted Taurus or Cancer Cubs who worship their boldness without competing for the spotlight.',
      'Meanwhile, perceptive Scorpio and Virgo archetypes gravitate toward emotionally fluent partners who remember tiny comfort details, from passenger-seat warmers to 62°F bamboo-sheet sleep setups.',
    ],
    faqs: [
      {
        q: 'Which zodiac signs match best in Cougar and Cub dating?',
        a: 'Fire-and-Earth pairings (Aries or Leo with Taurus or Virgo) and Water-and-Earth pairings (Scorpio or Cancer with Taurus or Capricorn) rank highest for lasting passion and domestic harmony.',
      },
    ],
    pickIds: ['date-night-oud-bergamot', 'cooling-bamboo-sheets'],
  },
  {
    slug: 'master-list-cougar-cub-movies-older-woman-younger-man',
    title:
      'Complete Master List of Cougar & Cub Movies (22 Films): No Hard Feelings, The Rebound & Good Sex',
    description:
      'The complete older-woman / younger-man movie master list: Jennifer Lawrence in No Hard Feelings, Catherine Zeta-Jones in The Rebound, Natalie Portman in Good Sex, Babygirl, The Idea of You & Stella.',
    episodeId: 'velvet-room',
    heroImg: '../../images/scenes/velvet-room-bar.jpg',
    dontText: 'never seen any rom-coms lol put on sports highlights',
    doText: 'Queued up No Hard Feelings and The Rebound—you pick round one.',
    paragraphs: [
      'From foundational Hollywood classics to the streaming renaissance, older-woman / younger-man cinema has evolved into one of the sharpest, funniest romance genres on earth.',
      'Comedy & Streaming Hits: Jennifer Lawrence & Andrew Barth Feldman in No Hard Feelings (2023), Natalie Portman in Good Sex, Renée Zellweger & Leo Woodall in Bridget Jones: Mad About the Boy (2025), Nicole Kidman & Harris Dickinson in Babygirl (2024), and Anne Hathaway & Nicholas Galitzine in The Idea of You (2024).',
      'Foundational Icons: Catherine Zeta-Jones & Justin Bartha in The Rebound (2009), Angela Bassett & Taye Diggs in How Stella Got Her Groove Back (1998), and Susan Sarandon in White Palace (1990) and Bull Durham (1988).',
    ],
    faqs: [
      {
        q: 'What is Catherine Zeta-Jones’ Cougar and Cub movie called?',
        a: 'Catherine Zeta-Jones stars in The Rebound (2009) as a 40-year-old newly divorced mother in Manhattan who falls for her warm 25-year-old barista Aram (Justin Bartha).',
      },
    ],
    pickIds: [
      'no-hard-feelings-jlaw-prime',
      'the-rebound-zeta-jones-prime',
      'babygirl-movie-prime',
      'idea-of-you-movie-book',
    ],
  },
  {
    slug: 'movies-like-babygirl-idea-of-you-bridget-jones-older-woman-younger-man',
    title: 'Best Older-Woman / Younger-Man Movies: Babygirl, No Hard Feelings, The Idea of You & Bridget Jones',
    description:
      'Loved Babygirl’s hotel-bar scene, No Hard Feelings, The Idea of You, or Bridget Jones: Mad About the Boy? Explore the golden wave of Cougar & Cub cinema.',
    episodeId: 'velvet-room',
    heroImg: '../../images/scenes/velvet-room-bar.jpg',
    dontText: 'what do you want to watch idk',
    doText: 'Chilled two coupes—want hotel-bar tension (Babygirl) or Montauk laughs (No Hard Feelings)?',
    paragraphs: [
      'Cinema and streaming have entered a full-scale older-woman / younger-man renaissance, led by Nicole Kidman and Harris Dickinson in Babygirl, Jennifer Lawrence in No Hard Feelings, Anne Hathaway and Nicholas Galitzine in The Idea of You, and Renée Zellweger and Leo Woodall in Bridget Jones: Mad About the Boy.',
      'Across every hit, the modern narrative celebrates accomplished women reclaiming desire, humor, and autonomy alongside emotionally present younger men.',
    ],
    faqs: [
      {
        q: 'Why did the glass of milk scene in Babygirl go viral?',
        a: 'In Babygirl, Harris Dickinson’s younger character sends Nicole Kidman’s CEO character a glass of milk across a hotel bar, a bold real-life moment borrowed from director Halina Reijn.',
      },
    ],
    pickIds: ['babygirl-movie-prime', 'no-hard-feelings-jlaw-prime', 'idea-of-you-movie-book'],
  },
  {
    slug: 'how-to-meet-older-women-in-the-wild-hotel-bar-gym-etiquette',
    title: 'How to Meet Older Women "In the Wild": Hotel Bars, Gym Headphone Rules & Zero Cubsplaining',
    description:
      'Real advice from Cougars & Cubs Club on meeting Cougars in real life: upscale hotel bars, Terminal B arrivals, the sacred gym headphone rule, and avoiding Cubsplaining.',
    episodeId: 'palisades-racquet',
    heroImg: '../../images/scenes/terminal-b-arrivals.jpg',
    dontText: 'hey take off your headphones real quick!!',
    doText: 'Waited until you wrapped up at the smoothie counter—I am Julian, by the way.',
    paragraphs: [
      'Younger men frequently ask where to meet confident women in their late 30s, 40s, and 50s offline without coming across as intrusive. Rule #1: never interrupt a woman mid-workout when her headphones are on.',
      'Instead, focus on organic, high-trust settings: upscale hotel lobby bars between 6 PM and 8:30 PM, racquet clubs, wine tastings, and community salsa studios—and never "Cubsplain" life skills she mastered twenty years ago.',
    ],
    faqs: [
      {
        q: 'Should you approach an older woman at the gym while she wears headphones?',
        a: 'Never interrupt a set or ask someone to remove headphones. Build friendly familiarity over several weeks and say hello naturally once headphones are off.',
      },
    ],
    pickIds: ['date-night-oud-bergamot', 'cub-grooming-beard-skincare-kit'],
  },
  {
    slug: 'black-cat-older-woman-golden-retriever-younger-man-dating-guide',
    title: 'Black Cat Older Woman & Golden Retriever Younger Man: Why Slow-Burn Pushback Works',
    description:
      'Explore why sunny Golden-Retriever younger men are magnetically drawn to cool, unhurried Black Cat older women who take their time and push back a little at first.',
    episodeId: 'velvet-room',
    heroImg: '../../images/scenes/cozy-rain-suite.jpg',
    dontText: 'fine guess ur too busy for me then!!',
    doText: 'Zero rush at all—I booked Thursday next week just in case, and my evening stays yours.',
    paragraphs: [
      'One of the strongest chemistry pairings in modern age-gap dating is the selective, unhurried "Black Cat" older woman matched with an enthusiastic, sunny "Golden Retriever" younger man.',
      'Unlike insecure dates who get defensive when a woman sets boundaries on Date #1, a true Golden-Retriever Cub loves the slow burn, smiling warmly and proving his reliability week after week.',
    ],
    faqs: [
      {
        q: 'Why do Golden Retriever younger men love Black Cat older women?',
        a: 'Because her calm, unhurried standards make every smile and invitation feel genuinely earned, while his sunny, zero-ego warmth lets her relax out of daily decision fatigue.',
      },
    ],
    pickIds: ['short-leash-leather-dog-leash', 'fill-in-love-coupon-cards', 'silk-pillowcase-sleepover-duo'],
  },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

for (const g of STATIC_GUIDES) {
  const canonical = `${PUBLIC_BASE}guides/${g.slug}/`;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: g.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const picksHtml = g.pickIds
    .map((pid) => {
      const prod = PRODUCT_CATALOG_MAP[pid];
      if (!prod) return '';
      const href = tagAmazon(pid, g.slug);
      return `<a class="pick-card" href="${escapeHtml(href)}" rel="noopener noreferrer sponsored" target="_blank">
          <img src="${escapeHtml(prod.img)}" alt="${escapeHtml(prod.name)}" loading="lazy" />
          <div class="pick-body">
            <span class="pick-price">${escapeHtml(prod.price)}</span>
            <strong>${escapeHtml(prod.name)}</strong>
            <span class="pick-cta">${
              /prime|movie|watch/i.test(pid)
                ? 'Stream / Rent Digitally on Prime Video →'
                : 'Shop Protected Pick on Amazon →'
            }</span>
          </div>
        </a>`;
    })
    .join('\n        ');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(g.title)} | Cougars and Cubs Club</title>
  <meta name="description" content="${escapeHtml(g.description)}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:site_name" content="Cougars and Cubs Club" />
  <meta property="og:title" content="${escapeHtml(g.title)}" />
  <meta property="og:description" content="${escapeHtml(g.description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${PUBLIC_BASE}images/scenes/velvet-room-bar.jpg" />
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { margin: 0; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; background: #FAF7F2; color: #18101E; line-height: 1.7; }
    main { max-width: 860px; margin: 0 auto; padding: 36px 20px 72px; }
    .card { background: #FFFFFF; border: 1px solid rgba(24,16,30,0.1); box-shadow: 0 18px 42px -18px rgba(24,16,30,0.12); border-radius: 28px; padding: 32px; }
    .badge { display: inline-block; background: #18101E; color: #fff; font-weight: 800; font-size: 13px; padding: 8px 16px; border-radius: 999px; text-decoration: none; }
    .hero { width: 100%; height: 280px; object-fit: cover; border-radius: 22px; margin: 20px 0 12px; display: block; }
    h1, h2, h3 { font-family: 'Playfair Display', Georgia, serif; color: #18101E; }
    h1 { font-size: 2.1rem; line-height: 1.2; margin: 12px 0; }
    h2 { font-size: 1.45rem; color: #BE123C; margin-top: 32px; }
    .disclosure { font-size: 13px; color: #57534E; font-weight: 600; }
    .picks-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin: 22px 0; }
    .pick-card { display: flex; flex-direction: column; border: 1px solid #E7E5E4; border-radius: 20px; overflow: hidden; text-decoration: none; color: #18101E; background: #FFFDF9; transition: transform .15s ease; }
    .pick-card:hover { transform: translateY(-2px); }
    .pick-card img { width: 100%; height: 160px; object-fit: cover; }
    .pick-body { padding: 14px; display: flex; flex-direction: column; gap: 6px; }
    .pick-price { font-size: 11px; font-weight: 800; color: #BE123C; text-transform: uppercase; }
    .pick-cta { font-size: 12px; font-weight: 800; color: #18101E; margin-top: 4px; }
    .bubbles { display: flex; flex-direction: column; gap: 10px; margin: 22px 0; padding: 18px; border-radius: 22px; background: #F8F7F5; border: 1px solid #E7E5E4; }
    .bubble-bad { align-self: flex-start; max-width: 86%; background: #E9E9EB; border-radius: 18px 18px 18px 4px; padding: 12px 16px; font-size: 14px; color: #18101E; }
    .bubble-good { align-self: flex-end; max-width: 86%; background: #007AFF; border-radius: 18px 18px 4px 18px; padding: 12px 16px; font-size: 14px; color: #FFFFFF; }
    .cta { margin: 28px 0; padding: 24px; border-radius: 22px; background: #FFFBEB; border: 1px solid #FDE68A; }
    .btn { display: inline-block; margin-top: 12px; background: #E11D48; color: #FFFFFF; font-weight: 800; padding: 12px 24px; border-radius: 999px; text-decoration: none; }
  </style>
</head>
<body>
  <main>
    <div class="card">
      <a class="badge" href="../../">← Play Cougars &amp; Cubs Club</a>
      <img class="hero" src="${escapeHtml(g.heroImg)}" alt="${escapeHtml(g.title)}" />
      <h1>${escapeHtml(g.title)}</h1>
      <p class="disclosure">💛 100% Ad-Free Indie Club ($0 Extra to You): Editorial guide for adult age-gap relationships. As an Amazon Associate we earn a small affiliate commission from qualifying purchases and Prime trials at zero extra cost to you, helping fund our live AI servers and new chapters.</p>
      <section aria-label="Editor Picks Above the Fold">
        <div class="picks-grid">
        ${picksHtml}
        </div>
      </section>
      <div class="bubbles">
        <div class="bubble-bad"><strong>❌ Don’t Text This:</strong><br/>&ldquo;${escapeHtml(g.dontText)}&rdquo;</div>
        <div class="bubble-good"><strong>✅ S-Rank Blue Bubble:</strong><br/>&ldquo;${escapeHtml(g.doText)}&rdquo;</div>
      </div>
      ${g.paragraphs
        .map(
          (p, idx) =>
            `<div style="margin:16px 0;padding:18px 20px;border-radius:20px;border:1px solid #E7E5E4;background:#FFFDF9;"><span style="display:inline-block;background:#18101E;color:#FCD34D;font-weight:800;font-size:11px;padding:3px 10px;border-radius:999px;margin-bottom:8px;">#${String(idx + 1).padStart(2, '0')} ✨ Club Takeaway</span><p style="margin:0;">${escapeHtml(p)}</p></div>`,
        )
        .join('\n      ')}
      <div class="cta">
        <strong>🎮 Ready to test your instincts in Sunset Hills?</strong>
        <p style="margin:6px 0 0;font-size:15px;">Step straight into this exact interactive venue as Her or as Him—and text a 60-second Partner Audition link to your real-life Cougar or Cub.</p>
        <a class="btn" href="../../?dilemma=${encodeURIComponent(g.episodeId)}">Play Interactive Scenario Free →</a>
      </div>
      <section>
        <h2>Frequently Asked Questions</h2>
        ${g.faqs
          .map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`)
          .join('\n        ')}
      </section>
      <nav style="margin-top:36px;padding-top:20px;border-top:1px solid rgba(24,16,30,0.1)">
        <h2>More Cougars &amp; Cubs Club Guides</h2>
        <ul>
          ${STATIC_GUIDES.filter((other) => other.slug !== g.slug)
            .map(
              (other) =>
                `<li><a style="color:#BE123C;font-weight:700" href="../${other.slug}/">${escapeHtml(other.title)}</a></li>`,
            )
            .join('\n          ')}
        </ul>
      </nav>
    </div>
  </main>
</body>
</html>
`;

  const dir = join(ROOT, 'dist', 'guides', g.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

console.log(`Generated ${STATIC_GUIDES.length} static SEO guide pages under dist/guides/.`);
