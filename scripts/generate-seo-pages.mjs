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
const configAmazonTag =
  monetizationSource.match(/amazonAssociateTag:\s*'([^']*)'/)?.[1] || '';
const configSubId = monetizationSource.match(/partnerSubId:\s*'([^']*)'/)?.[1] || '';

const AMAZON_TAG = (process.env.AMAZON_ASSOCIATE_TAG ?? configAmazonTag).trim();
const PARTNER_SUB_ID = (process.env.PARTNER_SUB_ID ?? configSubId).trim();

const PROHIBITED_ADULT_DOMAINS = [
  'lovehoney.com',
  'adamandeve.com',
  'pinkcherry.com',
  'bad-dragon.com',
  'lelo.com',
];

const URL_TO_PRODUCT_ID = {
  'https://www.amazon.com/s?k=japanese+cross+back+washed+linen+apron+men': 'houseboy-linen-apron',
  'https://www.amazon.com/s?k=ultralight+trail+running+hydration+vest+pack': 'trail-hydration-vest',
  'https://www.amazon.com/s?k=100+percent+mulberry+silk+robe+women+22+momme': 'princess-mulberry-silk-robe',
  'https://www.amazon.com/s?k=matte+black+bathroom+trash+can+with+lid+and+hand+soap+set': 'hosting-lidded-bin-soap',
  'https://www.amazon.com/s?k=long+staple+cotton+percale+sheet+set+queen+white': 'percale-hosting-sheets',
  'https://www.amazon.com/s?k=bergamot+cedar+amber+eau+de+parfum+men': 'date-night-oud-bergamot',
  'https://www.amazon.com/s?k=espresso+martini+cocktail+shaker+coupe+glasses+set': 'espresso-martini-barware',
  'https://www.amazon.com/s?k=couples+conversation+cards+date+night+game': 'after-dark-couples-deck',
  'https://www.amazon.com/s?k=100+percent+bamboo+viscose+cooling+sheets+queen': 'cooling-bamboo-sheets',
  'https://www.amazon.com/s?k=12+inch+pre+seasoned+cast+iron+skillet': 'cast-iron-steak-skillet',
  'https://www.amazon.com/s?k=sandalwood+beard+oil+mens+skincare+grooming+gift+set': 'cub-grooming-beard-skincare-kit',
  'https://www.amazon.com/s?k=22+momme+mulberry+silk+pillowcase+queen+claw+clip': 'silk-pillowcase-sleepover-duo',
};

function tagAmazon(rawUrl, slug) {
  const u = new URL(rawUrl);
  const host = u.hostname.toLowerCase();
  for (const banned of PROHIBITED_ADULT_DOMAINS) {
    if (host === banned || host.endsWith(`.${banned}`)) {
      throw new Error(`Blocked prohibited adult domain (${host})`);
    }
  }
  const productId = URL_TO_PRODUCT_ID[rawUrl];
  // Route static SEO guide picks through our protected /api/go/:id edge gateway unless an explicit tag override was passed
  if (!AMAZON_TAG && productId) {
    return `${PUBLIC_BASE}api/go/${encodeURIComponent(productId)}?src=${encodeURIComponent(`seo_${slug}`)}`;
  }
  if (AMAZON_TAG && host.includes('amazon.')) {
    u.searchParams.set('tag', AMAZON_TAG);
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
    episodeId: 'check-drop',
    paragraphs: [
      'In older-woman / younger-man age-gap dating communities such as r/CougarsAndCubs, relationship labels follow clear community etiquette rather than tabloid clichés.',
      'A Puma refers to a woman in her 30s (under 40) dating a younger man. A Cougar is a woman aged 40 or older with at least a 10-year age gap with her younger male partner (Cub) or younger female partner (Kitten). Women in their 50s embrace Jaguar status, and confident women 60+ claim Panther or Sabertooth.',
      'Above all, remember Rule #1: Cougar never means Sugar Mama, and many high-achieving women secretly love soft-life princess treatment—planned reservations, flowers, and car doors opened—after managing everyone else’s mental load all week.',
    ],
    faqs: [
      {
        q: 'What age qualifies as a Cougar versus a Puma in dating?',
        a: 'In age-gap dating etiquette, a Puma is a woman aged 30–39 dating a younger partner, while a Cougar is a woman aged 40+ who is at least 10 years older than her partner.',
      },
      {
        q: 'What does Cub mean in an older-woman younger-man relationship?',
        a: 'A Cub is an adult younger man (10+ years younger) dating or partnered with a Cougar, Puma, or Jaguar.',
      },
    ],
    picks: [
      {
        name: '22-Momme Mulberry Silk Kimono Robe ($118)',
        url: 'https://www.amazon.com/s?k=100+percent+mulberry+silk+robe+women+22+momme',
      },
      {
        name: 'Weighted Copper Espresso Martini Barware Set ($54)',
        url: 'https://www.amazon.com/s?k=espresso+martini+cocktail+shaker+coupe+glasses+set',
      },
    ],
  },
  {
    slug: 'first-time-hosting-older-woman-apartment-checklist',
    title: 'First Time Hosting an Older Woman at Your Place: The Apartment Audit Checklist',
    description:
      'Inviting an older woman back to your apartment in your 20s? Pass the bathroom and bedroom test: oak bedframe, cotton percale sheets, hand soap, and a lidded trash can.',
    episodeId: 'vip-apartment-soap-audit',
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
    picks: [
      {
        name: 'Matte-Black Lidded Bathroom Bin + Botanical Hand Soap ($42)',
        url: 'https://www.amazon.com/s?k=matte+black+bathroom+trash+can+with+lid+and+hand+soap+set',
      },
      {
        name: '600-Thread-Count Cotton Percale Hosting Sheet Set ($79)',
        url: 'https://www.amazon.com/s?k=long+staple+cotton+percale+sheet+set+queen+white',
      },
    ],
  },
  {
    slug: 'best-gifts-for-older-woman-girlfriend-dating-guide',
    title: 'Best Gifts for an Older Woman Girlfriend Who Already Has Everything',
    description:
      'Dating a successful woman in her 40s or 50s? Choose thoughtful, romantic date-night and soft-life gifts that prove emotional maturity and observation.',
    episodeId: 'princess-soft-life',
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
    picks: [
      {
        name: '22-Momme Mulberry Silk Lounge Robe ($118)',
        url: 'https://www.amazon.com/s?k=100+percent+mulberry+silk+robe+women+22+momme',
      },
      {
        name: 'Japanese Cross-Back Heavyweight Linen Apron ($34)',
        url: 'https://www.amazon.com/s?k=japanese+cross+back+washed+linen+apron+men',
      },
    ],
  },
  {
    slug: 'millennial-vs-gen-z-age-gap-dating-code-switching',
    title: 'Millennial & Gen-X Women Dating Gen-Z Men: The Courting Code-Switch Guide',
    description:
      'Why asking a 45-year-old woman for Snapchat is an instant red flag—and how younger men code-switch texting, emojis, phone calls, and chivalry across generations.',
    episodeId: 'code-switch-texting',
    paragraphs: [
      'Younger men who thrive in age-gap relationships master generational code-switching: keeping Gen-Z emotional literacy and consent awareness while dropping Snapchat requests, skull emojis, and vague "u tryna link" texts.',
      'Calibrate to her cohort: Elder Millennial women (34–45) love a quick text before a phone call plus a calendar dinner invite, while Gen-X women (46–60) prefer a direct 6 PM phone call over all-day work texting.',
    ],
    faqs: [
      {
        q: 'Should you ask an older woman for her Snapchat on a dating app?',
        a: 'Never. Offer your real phone number and propose a clear date, time, and neighborhood spot instead.',
      },
    ],
    picks: [
      {
        name: 'Warm Cedar, Bergamot & Amber Eau de Parfum ($68)',
        url: 'https://www.amazon.com/s?k=bergamot+cedar+amber+eau+de+parfum+men',
      },
      {
        name: 'After-Dark Couples Conversation Card Deck ($26)',
        url: 'https://www.amazon.com/s?k=couples+conversation+cards+date+night+game',
      },
    ],
  },
  {
    slug: 'older-woman-younger-man-relationship-problems-kids-stigma',
    title: 'Older Woman, Younger Man Relationships: Navigating Kids, Waiters & Insecurities',
    description:
      'Real solutions to older-woman / younger-man relationship challenges: fertility and kids mismatches, public stares, mirror doubts, and meeting adult children.',
    episodeId: 'mirror-game-insecurities',
    paragraphs: [
      'Every real age-gap couple eventually faces three classic moments: laughing off a clueless restaurant host, reassuring silent insecurities in bright morning light, and having an honest conversation about kids and timelines.',
      'While she may privately wonder how softer skin compares to 23-year-olds, he is usually wondering if his game is strong enough for an accomplished woman to invite him back.',
    ],
    faqs: [
      {
        q: 'How do older-woman / younger-man couples navigate the kids conversation?',
        a: 'Discuss family and timeline goals transparently in the first few months so both partners choose a shared path with eyes wide open.',
      },
    ],
    picks: [
      {
        name: 'Ultralight Ridge-Run Hydration Vest ($48)',
        url: 'https://www.amazon.com/s?k=ultralight+trail+running+hydration+vest+pack',
      },
      {
        name: 'After-Dark Couples Conversation Card Deck ($26)',
        url: 'https://www.amazon.com/s?k=couples+conversation+cards+date+night+game',
      },
    ],
  },
  {
    slug: 'celebrity-cougars-and-cubs-pop-culture-guide',
    title: 'Celebrity Cougars and Cubs: Jessica Alba, Sienna Miller, Ellie Goulding & Miley Cyrus',
    description:
      'From Jessica Alba & Danny Ramirez and Sienna Miller & Oli Green to Ellie Goulding & Beau Minniear and newlyweds Miley Cyrus & Maxx Morando—how pop culture entered its Golden Cougar Era.',
    episodeId: 'pop-culture-cougar-renaissance',
    paragraphs: [
      'Hollywood’s double standard around older-woman / younger-man relationships has officially collapsed, led by a new generation of self-made women dating confident younger partners without apology.',
      'Jessica Alba and Top Gun: Maverick star Danny Ramirez embody effortless 40s Cougar × early-30s Cub chemistry, while Sienna Miller & Oli Green (15-year gap) and Ellie Goulding & Beau Minniear (11-year gap) welcomed babies together while dominating London and Met Gala red carpets.',
      'Meanwhile, Miley Cyrus marrying her 6-years-younger drummer partner Maxx Morando in Palm Springs cemented the sub-10-year "Junior Cougar" sweet spot alongside enduring icons like Heidi Klum & Tom Kaulitz, Priyanka Chopra & Nick Jonas, and Cher.',
    ],
    faqs: [
      {
        q: 'Who are the most famous Cougar and Cub celebrity couples right now?',
        a: 'Top pop-culture older-woman / younger-man couples include Jessica Alba & Danny Ramirez, Sienna Miller & Oli Green, Ellie Goulding & Beau Minniear, Miley Cyrus & Maxx Morando, Heidi Klum & Tom Kaulitz, and Priyanka Chopra & Nick Jonas.',
      },
    ],
    picks: [
      {
        name: 'Sandalwood Beard Oil & Men’s Red-Carpet Grooming Kit ($46)',
        url: 'https://www.amazon.com/s?k=sandalwood+beard+oil+mens+skincare+grooming+gift+set',
      },
      {
        name: '22-Momme Mulberry Silk Kimono Lounge Robe ($118)',
        url: 'https://www.amazon.com/s?k=100+percent+mulberry+silk+robe+women+22+momme',
      },
    ],
  },
  {
    slug: 'dating-younger-man-perimenopause-menopause-intimacy',
    title: 'Dating a Younger Man in Perimenopause & Menopause: Real Intimacy & Sleep Guide',
    description:
      'Honest advice on perimenopause libido surges, 3 AM hot flashes, menopause intimacy, cooling bamboo sheets, and high-EQ communication with a younger male partner.',
    episodeId: 'cougar-perimenopause-surge-nightsweats',
    paragraphs: [
      'One of the best-kept secrets of 40s, 50s, and 60+ Cougar, Jaguar, and Panther relationships is how liberating intimacy becomes once communication replaces guesswork—including zero pregnancy scares in menopause.',
      'In perimenopause (often ages 40–51), women frequently experience dramatic 10 PM desire surges paired with 3 AM night sweats and temperature swings. High-EQ Cubs keep bedrooms at 62°F, upgrade to 100% bamboo viscose cooling sheets, and treat estradiol patches and unhurried foreplay as normal adult teamwork.',
    ],
    faqs: [
      {
        q: 'How do couples handle perimenopause night sweats and menopause intimacy shifts?',
        a: 'Pair breathable bamboo cooling sheets and a 62°F bedroom with unhurried warmup, open communication, and luxury bedside hydration—turning biology into effortless closeness.',
      },
    ],
    picks: [
      {
        name: '100% Organic Bamboo Viscose Cooling Sheet Set ($89)',
        url: 'https://www.amazon.com/s?k=100+percent+bamboo+viscose+cooling+sheets+queen',
      },
      {
        name: '22-Momme Mulberry Silk Pillowcase & Claw-Clip Set ($39)',
        url: 'https://www.amazon.com/s?k=22+momme+mulberry+silk+pillowcase+queen+claw+clip',
      },
    ],
  },
  {
    slug: 'junior-cougar-6-year-age-gap-relationship-guide',
    title: 'Junior Cougar Meaning: Why a 5-to-9 Year Age Gap Is Modern Dating’s Sweet Spot',
    description:
      'Under strict 10-year Cougar rules, a 6-to-8 year older-woman / younger-man gap earns the Junior Cougar badge. Learn why couples love the micro-generational sweet spot.',
    episodeId: 'junior-cougar-gatekeeper-tease',
    paragraphs: [
      'While strict r/CougarsAndCubs taxonomy reserves official Cougar status for a 10+ year gap at age 40+, women who are 5 to 9 years older than their partner proudly claim the "Junior Cougar" title.',
      'A 6-year gap (such as 38F × 32M, or newlyweds Miley Cyrus & Maxx Morando) blends shared cultural touchstones and zero public stares with playful 2008 high-school math banter and homeowner-era intentionality.',
    ],
    faqs: [
      {
        q: 'Does a 6-year age gap count as a Cougar relationship?',
        a: 'Community purists playfully dub a 5-to-9 year older-woman / younger-man gap a "Junior Cougar" matchup—offering all the spark of age-gap chemistry with closely aligned life timelines.',
      },
    ],
    picks: [
      {
        name: '12-Inch Pre-Seasoned Cast-Iron Ribeye Skillet ($44)',
        url: 'https://www.amazon.com/s?k=12+inch+pre+seasoned+cast+iron+skillet',
      },
      {
        name: 'After-Dark Couples Conversation Card Deck ($26)',
        url: 'https://www.amazon.com/s?k=couples+conversation+cards+date+night+game',
      },
    ],
  },
  {
    slug: 'older-woman-grown-son-same-age-meeting-parents-guide',
    title: 'Dating an Older Woman With a Grown Son Your Age (Plus Meeting Parents & First Wedding +1)',
    description:
      'Real advice from Cougar and Cub couples on navigating grown children the same age as her partner, meeting his same-age parents, and attending your first wedding as a +1.',
    episodeId: 'grown-son-same-age-collision',
    paragraphs: [
      'One of the most talked-about milestones in 18+ year older-woman / younger-man relationships happens when her adult son or daughter is within a year or two of her partner’s age—or when her partner’s mother graduated high school the exact same year she did.',
      'Successful couples follow three golden rules: brief family warmly ahead of time instead of springing doorway ambushes, never try to play "stepdad" to a peer-aged adult child, and carry calm, unbothered pride onto the dance floor at your first wedding together as a +1.',
    ],
    faqs: [
      {
        q: 'How should a younger man act when meeting an older girlfriend’s grown children?',
        a: 'Treat them with warm peer-level respect, zero step-parent posturing, and steady consistency—letting them see firsthand how happy and respected their mother is.',
      },
      {
        q: 'How do you prepare parents when your girlfriend is your mom’s age?',
        a: 'Tell your parents warmly a week before the visit rather than surprising them at the door, and anchor the conversation around shared values and how well you treat each other.',
      },
    ],
    picks: [
      {
        name: 'Weighted Copper Espresso Martini Barware Set ($54)',
        url: 'https://www.amazon.com/s?k=espresso+martini+cocktail+shaker+coupe+glasses+set',
      },
      {
        name: 'After-Dark Couples Conversation Card Deck ($26)',
        url: 'https://www.amazon.com/s?k=couples+conversation+cards+date+night+game',
      },
    ],
  },
  {
    slug: 'spontaneous-weekend-getaway-date-ideas-older-woman-younger-man',
    title: 'Best Cougar & Cub Date Ideas: 18-Hour Getaways, Campus Sushi, Meadow Picnics & Bowling',
    description:
      'Skip boring dinner interviews: why spontaneous 18-hour boutique hotel pool & sauna getaways, campus sushi strolls, sunlit picnics, and retro bowling spark unforgettable chemistry.',
    episodeId: 'spontaneous-18h-pool-sauna-getaway',
    paragraphs: [
      'Accomplished women in their late 30s, 40s, 50s, and 60s have already sat through a lifetime of stiff corporate steakhouse dinners—what actually wins their hearts is playful energy, planning effort, and romance.',
      'Top fan-favorite dates include a spontaneous 18-hour boutique getaway (after a chemistry-tested video call) featuring sunset rooftop cocktails plus a heated hotel pool and cedar sauna, an autumn university quad stroll with omakase sushi, or a hand-packed meadow picnic paired with retro neon bowling.',
    ],
    faqs: [
      {
        q: 'How can a younger man on a modest budget plan an amazing date for an older woman?',
        a: 'Thoughtful preparation beats expensive flash every time: pack a linen-blanket meadow picnic with fresh baguette and strawberries, followed by playful retro bowling.',
      },
    ],
    picks: [
      {
        name: '22-Momme Mulberry Silk Kimono Lounge Robe ($118)',
        url: 'https://www.amazon.com/s?k=100+percent+mulberry+silk+robe+women+22+momme',
      },
      {
        name: 'Japanese Cross-Back Heavyweight Linen Apron ($34)',
        url: 'https://www.amazon.com/s?k=japanese+cross+back+washed+linen+apron+men',
      },
    ],
  },
  {
    slug: 'cougar-town-pop-culture-age-gap-dating-history',
    title: 'From Cougar Town’s "Big Carl" to 2026 Icons: How Pop Culture Rewrote Age-Gap Romance',
    description:
      'How Courteney Cox’s Cougar Town ("Big Carl" wine glasses & post-divorce joy) paved the way for modern Cougar and Cub romances in film, TV, and celebrity culture.',
    episodeId: 'milestone-six-month-anniversary',
    paragraphs: [
      'When Courteney Cox launched Cougar Town as newly divorced 40-something Jules Cobb armed with her legendary oversized wine glass "Big Carl," television began shifting older-woman / younger-man stories from punchlines to joyful self-reclamation.',
      'Today, from romantic films and BookTok bestsellers to real-life couples celebrating 6-month and 1-year anniversaries, modern Cougars and Cubs embrace humor, emotional intelligence, and unapologetic partnership.',
    ],
    faqs: [
      {
        q: 'What was Jules Cobb’s giant wine glass called on Cougar Town?',
        a: 'Courteney Cox’s character Jules Cobb famously named her comically oversized red wine glass "Big Carl" (later followed by Big Joe and Big Lou).',
      },
    ],
    picks: [
      {
        name: 'Weighted Copper Cocktail & Wine Barware Set ($54)',
        url: 'https://www.amazon.com/s?k=espresso+martini+cocktail+shaker+coupe+glasses+set',
      },
      {
        name: 'After-Dark Couples Conversation Card Deck ($26)',
        url: 'https://www.amazon.com/s?k=couples+conversation+cards+date+night+game',
      },
    ],
  },
  {
    slug: 'astrology-zodiac-compatibility-older-woman-younger-man',
    title: 'Zodiac & Star-Sign Compatibility in Older-Woman / Younger-Man Relationships',
    description:
      'Explore astrology chemistry for Cougars and Cubs: why Scorpio, Aries, Leo, Taurus, and Virgo pairings create magnetic cross-generational romance.',
    episodeId: 'fiery-foreign-cougar-passion-test',
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
    picks: [
      {
        name: 'Warm Cedar, Bergamot & Amber Eau de Parfum ($68)',
        url: 'https://www.amazon.com/s?k=bergamot+cedar+amber+eau+de+parfum+men',
      },
      {
        name: '100% Organic Bamboo Viscose Cooling Sheet Set ($89)',
        url: 'https://www.amazon.com/s?k=100+percent+bamboo+viscose+cooling+sheets+queen',
      },
    ],
  },
  {
    slug: 'movies-like-babygirl-idea-of-you-bridget-jones-older-woman-younger-man',
    title: 'Best Older-Woman / Younger-Man Movies: Babygirl, The Idea of You, Bridget Jones & Lonely Planet',
    description:
      'Loved Babygirl’s hotel-bar scene, The Idea of You, Bridget Jones: Mad About the Boy, or Lonely Planet? Explore the golden wave of Cougar & Cub cinema—and play the scenarios live.',
    episodeId: 'babygirl-hotel-bar-milk-or-martini',
    paragraphs: [
      'Cinema and streaming have entered a full-scale older-woman / younger-man renaissance—led by Nicole Kidman and Harris Dickinson in A24’s Babygirl (and its endlessly memed hotel-bar glass-of-milk power play), Anne Hathaway and Nicholas Galitzine in The Idea of You, Renée Zellweger and Leo Woodall in Bridget Jones: Mad About the Boy, and Laura Dern and Liam Hemsworth in Lonely Planet.',
      'Across all four hits—plus classic comfort television like Courteney Cox’s Cougar Town—the modern narrative celebrates accomplished women reclaiming desire, humor, and autonomy alongside emotionally present younger men.',
    ],
    faqs: [
      {
        q: 'Why did the glass of milk scene in Babygirl go viral?',
        a: 'In Babygirl, Harris Dickinson’s younger character sends Nicole Kidman’s CEO character a glass of milk across a hotel bar—a bold real-life moment borrowed from director Halina Reijn that sparked millions of TikTok parodies.',
      },
      {
        q: 'What are the best recent older-woman / younger-man romance movies to stream?',
        a: 'Top recent titles include The Idea of You (2024), Lonely Planet (2024), Babygirl (2024), Bridget Jones: Mad About the Boy (2025), and Good Luck to You, Leo Grande.',
      },
    ],
    picks: [
      {
        name: '22-Momme Mulberry Silk Kimono Lounge Robe ($118)',
        url: 'https://www.amazon.com/s?k=100+percent+mulberry+silk+robe+women+22+momme',
      },
      {
        name: 'Weighted Copper Espresso Martini Barware Set ($54)',
        url: 'https://www.amazon.com/s?k=espresso+martini+cocktail+shaker+coupe+glasses+set',
      },
    ],
  },
  {
    slug: 'how-to-meet-older-women-in-the-wild-hotel-bar-gym-etiquette',
    title: 'How to Meet Older Women "In the Wild": Hotel Bars, Gym Headphone Rules & Zero Cubsplaining',
    description:
      'Real advice from r/CougarsAndCubs on meeting Cougars in real life: why upscale hotel bars beat supermarket ambushes, the sacred gym headphone rule, and avoiding Cubsplaining.',
    episodeId: 'gym-headphones-vs-three-week-nod',
    paragraphs: [
      'Younger men frequently ask where to meet confident women in their late 30s, 40s, and 50s offline without coming across as intrusive. Community veterans agree on rule #1: never interrupt a woman mid-workout when her headphones are on, and skip rehearsed grocery-aisle pickup lines.',
      'Instead, focus on organic, high-trust settings: upscale hotel lobby bars where solo business travelers unwind, recurring fitness or climbing communities where three weeks of polite nods build natural rapport, trivia nights, and wine tastings—and never "Cubsplain" basic life skills she mastered twenty years ago.',
    ],
    faqs: [
      {
        q: 'Should you approach an older woman at the gym while she wears headphones?',
        a: 'Never interrupt a set or ask someone to remove headphones. Build friendly, non-intrusive familiarity over several weeks and say hello naturally at the smoothie counter once headphones are off.',
      },
      {
        q: 'What is the best place to meet single older women offline?',
        a: 'Upscale hotel bars, wine tastings, run clubs, dance classes, and community trivia nights rank highest because guests are already in a relaxed, social mindset.',
      },
    ],
    picks: [
      {
        name: 'Warm Cedar, Bergamot & Amber Eau de Parfum ($68)',
        url: 'https://www.amazon.com/s?k=bergamot+cedar+amber+eau+de+parfum+men',
      },
      {
        name: 'Sandalwood Beard Oil & Men’s Skincare Kit ($46)',
        url: 'https://www.amazon.com/s?k=sandalwood+beard+oil+mens+skincare+grooming+gift+set',
      },
    ],
  },
  {
    slug: 'black-cat-older-woman-golden-retriever-younger-man-dating-guide',
    title:
      'Black Cat Older Woman & Golden Retriever Younger Man: Why Slow-Burn Pushback Works',
    description:
      'Explore why sunny Golden-Retriever younger men are magnetically drawn to cool, unhurried Black Cat older women who take their time and push back a little at first.',
    episodeId: 'black-cat-pushback-golden-retriever-test',
    paragraphs: [
      'One of the strongest chemistry pairings in modern age-gap dating is the selective, unhurried "Black Cat" older woman matched with an enthusiastic, sunny "Golden Retriever" younger man.',
      'Unlike insecure dates who get defensive when a woman sets boundaries or refuses to rush on Date #1, a true Golden-Retriever Cub loves the slow burn—smiling warmly when she pushes back a little and proving his reliability week after week.',
      'When an independent Cougar, Puma, or Jaguar finally lets down her guard after weeks of steady courtship, the earned intimacy outlasts fast love-bombing every time.',
    ],
    faqs: [
      {
        q: 'Why do Golden Retriever younger men love Black Cat older women?',
        a: 'Because her calm, unhurried standards make every smile and invitation feel genuinely earned, while his sunny, zero-ego warmth lets her relax out of daily decision fatigue.',
      },
      {
        q: 'Is pushing back early in age-gap dating a red flag or a green flag?',
        a: 'Playful, honest pacing is a major green flag—it filters out impatient novelty-seekers and rewards partners who bring steady adult consistency.',
      },
    ],
    picks: [
      {
        name: '22-Momme Mulberry Silk Pillowcase & Claw-Clip Set ($39)',
        url: 'https://www.amazon.com/s?k=22+momme+mulberry+silk+pillowcase+queen+claw+clip',
      },
      {
        name: 'Warm Cedar, Bergamot & Amber Eau de Parfum ($68)',
        url: 'https://www.amazon.com/s?k=bergamot+cedar+amber+eau+de+parfum+men',
      },
    ],
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
  <meta property="og:image" content="${PUBLIC_BASE}images/cast/hero-couple.jpg" />
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #0d0814; color: #f1f5f9; line-height: 1.7; }
    main { max-width: 760px; margin: 0 auto; padding: 40px 20px 72px; }
    .badge { display: inline-block; background: #f43f5e; color: #fff; font-weight: 800; font-size: 12px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; text-decoration: none; }
    h1 { font-size: 2.1rem; line-height: 1.18; margin: 16px 0; color: #fff; }
    h2 { color: #2dd4bf; margin-top: 32px; }
    .cta { margin: 28px 0; padding: 22px; border: 3px solid #000; border-radius: 16px; background: linear-gradient(135deg, #2b0f3a, #0b2a30); }
    .btn { display: inline-block; margin-top: 10px; background: #f59e0b; color: #09050f; font-weight: 800; padding: 12px 20px; border-radius: 10px; text-decoration: none; }
    .picks { background: #160c24; border: 2px solid #000; border-radius: 16px; padding: 20px; margin-top: 28px; }
    .pick-link { display: block; margin: 10px 0; color: #fde68a; font-weight: 700; }
    .disclosure { font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <main>
    <a class="badge" href="../../">← Play Cougars &amp; Cubs Club</a>
    <h1>${escapeHtml(g.title)}</h1>
    <p class="disclosure">Editorial Guide for Adult Age-Gap Relationships • Reader disclosure: curated shopping links below may earn a small affiliate commission at no extra cost to you.</p>
    ${g.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n    ')}
    <div class="cta">
      <strong>🎮 Ready to test your instincts in this exact scenario?</strong>
      <p style="margin:6px 0 0;font-size:14px;">Play as Her (Vet &amp; Train) or Play as Him (Impress &amp; Commit)—then text a 60-second Vetting Audition link to your real-life Cougar or Cub.</p>
      <a class="btn" href="../../?dilemma=${encodeURIComponent(g.episodeId)}">Play Interactive Scenario Free →</a>
    </div>
    <section class="picks">
      <h2>Curated Date-Night &amp; Hosting Picks</h2>
      ${g.picks
        .map(
          (p) =>
            `<a class="pick-link" href="${escapeHtml(tagAmazon(p.url, g.slug))}" rel="noopener noreferrer sponsored" target="_blank">🛍️ ${escapeHtml(p.name)} →</a>`,
        )
        .join('\n      ')}
    </section>
    <section>
      <h2>Frequently Asked Questions</h2>
      ${g.faqs
        .map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`)
        .join('\n      ')}
    </section>
    <nav style="margin-top:36px;padding-top:20px;border-top:1px solid #334155">
      <h2>More Cougars &amp; Cubs Club Guides</h2>
      <ul>
        ${STATIC_GUIDES.filter((other) => other.slug !== g.slug)
          .map(
            (other) =>
              `<li><a style="color:#5eead4" href="../${other.slug}/">${escapeHtml(other.title)}</a></li>`,
          )
          .join('\n        ')}
      </ul>
    </nav>
  </main>
</body>
</html>
`;

  const dir = join(ROOT, 'dist', 'guides', g.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

console.log(`Generated ${STATIC_GUIDES.length} static SEO guide pages under dist/guides/.`);
