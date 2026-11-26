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
  'https://www.amazon.com/s?k=trophy+husband+funny+cooking+apron+for+men': 'trophy-boyfriend-cooking-apron',
  'https://www.amazon.com/s?k=leopard+print+kitchen+apron+with+pockets': 'leopard-print-cougar-apron',
  'https://www.amazon.com/s?k=dog+training+clicker+wrist+strap+treat+pouch': 'good-boy-brass-training-clicker',
  'https://www.amazon.com/s?k=funny+cougar+wine+glass+gift+for+women': 'funny-cougar-stemless-wine-glass',
  'https://www.amazon.com/s?k=golden+retriever+energy+funny+mug+gift': 'golden-retriever-boyfriend-mug',
  'https://www.amazon.com/s?k=black+cat+energy+funny+coffee+mug+gift': 'black-cat-girlfriend-leopard-mug',
  'https://www.amazon.com/s?k=funny+cougar+trucker+hat+novelty+gift': 'cougar-hunter-retro-trucker-hat',
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
  'https://www.amazon.com/s?k=foldable+adjustable+weight+bench+home+gym': 'adjustable-dumbbell-bench',
  'https://www.amazon.com/s?k=sandalwood+beard+oil+mens+skincare+grooming+gift+set': 'cub-grooming-beard-skincare-kit',
  'https://www.amazon.com/s?k=22+momme+mulberry+silk+pillowcase+queen+claw+clip': 'silk-pillowcase-sleepover-duo',
  'https://www.amazon.com/s?k=non+alcoholic+botanical+aperitif+mocktail+coupe+glasses': 'zero-proof-botanical-mocktail-set',
  'https://www.amazon.com/s?k=fill+in+the+blank+love+coupons+cards+for+couples': 'fill-in-love-coupon-cards',
  'https://www.amazon.com/s?k=braided+leather+short+traffic+dog+leash+brass+clasp': 'short-leash-leather-dog-leash',
  'https://www.amazon.com/s?k=oversized+giant+full+bottle+wine+glass+funny+gift': 'big-carl-giant-wine-glass',
  'https://www.amazon.com/s?k=oversized+tortoiseshell+reading+glasses+women+chic': 'chic-candlelit-menu-readers',
  'https://www.amazon.com/s?k=Babygirl+Nicole+Kidman+Prime+Video+movie': 'babygirl-movie-prime',
  'https://www.amazon.com/s?k=The+Idea+of+You+Robinne+Lee+book+and+movie': 'idea-of-you-movie-book',
  'https://www.amazon.com/s?k=Bridget+Jones+Mad+About+the+Boy+Prime+Video': 'bridget-jones-cougar-town-watch',
  'https://www.amazon.com/s?k=The+Rebound+Catherine+Zeta+Jones+Prime+Video+movie': 'the-rebound-zeta-jones-prime',
  'https://www.amazon.com/s?k=grass+fed+ghee+and+cold+pressed+extra+virgin+olive+oil': 'seed-oil-free-ghee-evoo-set',
  'https://www.amazon.com/s?k=wicker+picnic+basket+for+2+with+waterproof+blanket': 'linen-picnic-insulated-tote',
  'https://www.amazon.com/s?k=mens+canvas+leather+overnight+weekender+duffel+bag': 'velvet-travel-weekender-duffel',
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
      'In older-woman / younger-man age-gap dating communities such as Cougars & Cubs Club, relationship labels follow clear community etiquette rather than tabloid clichés.',
      'A Puma refers to a woman in her 30s (under 40) dating a younger man. A Cougar is a woman aged 40 or older with at least a 10-year age gap with her younger male partner (Cub) or younger female partner (Kitten). Women in their 50s embrace Jaguar status, and confident women 60+ claim Panther or Sabertooth.',
      'Above all, remember Rule #1: Cougar never means Sugar Mama, and many high-achieving women secretly love soft-life princess treatment, planned reservations, flowers, and car doors opened, after managing everyone else’s mental load all week.',
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
      'When an accomplished woman in her 40s or 50s visits a younger man’s apartment for the first time, square footage rarely matters, hygiene and adult preparation decide everything.',
      'Start with the non-negotiable bathroom checklist: botanical liquid hand soap (never dish soap), two fresh guest hand towels, a spotless mirror, and a bathroom trash can with a closed lid.',
      'In the bedroom, retire dark microfiber dorm sheets for breathable 600-thread-count cotton percale on a real bedframe with four supportive pillows.',
    ],
    faqs: [
      {
        q: 'Do older women care if a younger man lives in a small apartment?',
        a: 'No, financial responsibility, spotless cleanliness, clean cotton sheets, and a lidded bathroom trash can matter far more than luxury square footage.',
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
        name: '"Trophy Husband (In Training)" Funny Pocket Chef Apron',
        url: 'https://www.amazon.com/s?k=trophy+husband+funny+cooking+apron+for+men',
      },
      {
        name: 'Fierce Leopard-Print Cougar Hostess & Sous-Chef Apron',
        url: 'https://www.amazon.com/s?k=leopard+print+kitchen+apron+with+pockets',
      },
      {
        name: 'Fill-in-the-Blank Romantic Love Coupon Cards',
        url: 'https://www.amazon.com/s?k=fill+in+the+blank+love+coupons+cards+for+couples',
      },
      {
        name: '22-Momme Mulberry Silk Lounge Robe',
        url: 'https://www.amazon.com/s?k=100+percent+mulberry+silk+robe+women+22+momme',
      },
    ],
  },
  {
    slug: 'millennial-vs-gen-z-age-gap-dating-code-switching',
    title: 'Millennial & Gen-X Women Dating Gen-Z Men: The Courting Code-Switch Guide',
    description:
      'Why asking a 45-year-old woman for Snapchat is an instant red flag, and how younger men code-switch texting, emojis, phone calls, and chivalry across generations.',
    episodeId: 'code-switch-texting',
    paragraphs: [
      'Younger men who thrive in age-gap relationships master generational code-switching: keeping Gen-Z emotional literacy and consent awareness while dropping Snapchat requests, skull emojis, and vague "u tryna link" texts.',
      'Calibrate to her cohort: Elder Millennial women (34-45) love a quick text before a phone call plus a calendar dinner invite, while Gen-X women (46-60) prefer a direct 6 PM phone call over all-day work texting.',
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
      'From Jessica Alba & Danny Ramirez and Sienna Miller & Oli Green to Ellie Goulding & Beau Minniear and newlyweds Miley Cyrus & Maxx Morando, how pop culture entered its Golden Cougar Era.',
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
      'One of the best-kept secrets of 40s, 50s, and 60+ Cougar, Jaguar, and Panther relationships is how liberating intimacy becomes once communication replaces guesswork, including zero pregnancy scares in menopause.',
      'In perimenopause (often ages 40-51), women frequently experience dramatic 10 PM desire surges paired with 3 AM night sweats and temperature swings. High-EQ Cubs keep bedrooms at 62°F, upgrade to 100% bamboo viscose cooling sheets, and treat estradiol patches and unhurried foreplay as normal adult teamwork.',
    ],
    faqs: [
      {
        q: 'How do couples handle perimenopause night sweats and menopause intimacy shifts?',
        a: 'Pair breathable bamboo cooling sheets and a 62°F bedroom with unhurried warmup, open communication, and luxury bedside hydration, turning biology into effortless closeness.',
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
      'While strict Cougars & Cubs Club taxonomy reserves official Cougar status for a 10+ year gap at age 40+, women who are 5 to 9 years older than their partner proudly claim the "Junior Cougar" title.',
      'A 6-year gap (such as 38F × 32M, or newlyweds Miley Cyrus & Maxx Morando) blends shared cultural touchstones and zero public stares with playful 2008 high-school math banter and homeowner-era intentionality.',
    ],
    faqs: [
      {
        q: 'Does a 6-year age gap count as a Cougar relationship?',
        a: 'Community purists playfully dub a 5-to-9 year older-woman / younger-man gap a "Junior Cougar" matchup, offering all the spark of age-gap chemistry with closely aligned life timelines.',
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
      'One of the most talked-about milestones in 18+ year older-woman / younger-man relationships happens when her adult son or daughter is within a year or two of her partner’s age, or when her partner’s mother graduated high school the exact same year she did.',
      'Successful couples follow three golden rules: brief family warmly ahead of time instead of springing doorway ambushes, never try to play "stepdad" to a peer-aged adult child, and carry calm, unbothered pride onto the dance floor at your first wedding together as a +1.',
    ],
    faqs: [
      {
        q: 'How should a younger man act when meeting an older girlfriend’s grown children?',
        a: 'Treat them with warm peer-level respect, zero step-parent posturing, and steady consistency, letting them see firsthand how happy and respected their mother is.',
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
      'Accomplished women in their late 30s, 40s, 50s, and 60s have already sat through a lifetime of stiff corporate steakhouse dinners, what actually wins their hearts is playful energy, planning effort, and romance.',
      'Top fan-favorite dates include a spontaneous 18-hour boutique getaway (after a chemistry-tested video call) featuring sunset rooftop cocktails plus a heated hotel pool and cedar sauna, an autumn university quad stroll with omakase sushi, or a hand-packed meadow picnic paired with retro neon bowling.',
    ],
    faqs: [
      {
        q: 'How can a younger man on an early-career or student budget plan an amazing date for an older woman?',
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
        name: 'Oversized "Big Carl" XL Full-Bottle Red-Wine Goblet',
        url: 'https://www.amazon.com/s?k=oversized+giant+full+bottle+wine+glass+funny+gift',
      },
      {
        name: 'Bridget Jones: Mad About the Boy & Cougar Town Watch Collection',
        url: 'https://www.amazon.com/s?k=Bridget+Jones+Mad+About+the+Boy+Prime+Video',
      },
      {
        name: 'Oversized Tortoiseshell Bistro Menu Reading Glasses',
        url: 'https://www.amazon.com/s?k=oversized+tortoiseshell+reading+glasses+women+chic',
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
    slug: 'master-list-cougar-cub-movies-older-woman-younger-man',
    title:
      'Complete Master List of Cougar & Cub Movies (22 Films): Catherine Zeta-Jones’ The Rebound to Natalie Portman’s Good Sex',
    description:
      'The complete older-woman / younger-man movie master list: Catherine Zeta-Jones in The Rebound, Natalie Portman’s upcoming Netflix rom-com Good Sex, Babygirl, The Idea of You, Bridget Jones, How Stella Got Her Groove Back & Bull Durham.',
    episodeId: 'babygirl-hotel-bar-milk-or-martini',
    paragraphs: [
      'From foundational Hollywood classics to the 2024-2026 streaming explosion, older-woman / younger-man ("Cougar & Cub") cinema has evolved into one of the sharpest, funniest, and highest-grossing romance genres on earth.',
      'Upcoming & New Wave: Natalie Portman leads Lena Dunham’s Netflix rom-com Good Sex as Ally, a 40-year-old NYC couples therapist torn between a 20-something Brooklyn creative (Tucker Pillsbury / Role Model) and a 50-something executive (Mark Ruffalo), right alongside Renée Zellweger & Leo Woodall in Bridget Jones: Mad About the Boy (2025), Nicole Kidman & Harris Dickinson in Babygirl (2024), Anne Hathaway & Nicholas Galitzine in The Idea of You (2024), Laura Dern & Liam Hemsworth in Lonely Planet (2024), and Nicole Kidman & Zac Efron in A Family Affair (2024).',
      '2000s, 2020s Rom-Com & Indie Favorites: Catherine Zeta-Jones set the modern post-divorce rom-com blueprint in The Rebound (2009) opposite 25-year-old coffee-shop barista Justin Bartha, joined by Good Luck to You, Leo Grande (Emma Thompson & Daryl McCormack), Cha Cha Real Smooth (Dakota Johnson & Cooper Raiff), Home Again (Reese Witherspoon & Pico Alexander), Hello I Must Be Going (Melanie Lynskey & Christopher Abbott), I Could Never Be Your Woman (Michelle Pfeiffer & Paul Rudd), Prime (Uma Thurman & Bryan Greenberg), and Keanu Reeves swooning over Diane Keaton in Something’s Gotta Give.',
      'Foundational Icons: Angela Bassett & Taye Diggs in How Stella Got Her Groove Back (1998), Susan Sarandon in both White Palace (1990, with James Spader) and Bull Durham (1988, mentoring rookie pitcher Tim Robbins), Harold and Maude (1971), The Graduate (1967), and All That Heaven Allows (1955).',
    ],
    faqs: [
      {
        q: 'What is Catherine Zeta-Jones’ Cougar and Cub movie called?',
        a: 'Catherine Zeta-Jones stars in The Rebound (2009) as a 40-year-old newly divorced mother of two in Manhattan who falls for her warm 25-year-old barista and nanny Aram (Justin Bartha).',
      },
      {
        q: 'What is Natalie Portman’s upcoming older-woman younger-man movie?',
        a: 'Natalie Portman stars in Lena Dunham’s Netflix romantic comedy Good Sex as a 40-year-old NYC couples therapist caught between a 20-something Brooklyn hipster (Tucker Pillsbury / Role Model) and a 50-something Manhattan man (Mark Ruffalo).',
      },
    ],
    picks: [
      {
        name: 'The Rebound (Catherine Zeta-Jones & Justin Bartha • Prime Video)',
        url: 'https://www.amazon.com/s?k=The+Rebound+Catherine+Zeta+Jones+Prime+Video+movie',
      },
      {
        name: 'Babygirl (Nicole Kidman • Prime Video 4K)',
        url: 'https://www.amazon.com/s?k=Babygirl+Nicole+Kidman+Prime+Video+movie',
      },
      {
        name: 'The Idea of You, Robinne Lee Paperback & Prime Video',
        url: 'https://www.amazon.com/s?k=The+Idea+of+You+Robinne+Lee+book+and+movie',
      },
      {
        name: 'Bridget Jones: Mad About the Boy (Prime Video)',
        url: 'https://www.amazon.com/s?k=Bridget+Jones+Mad+About+the+Boy+Prime+Video',
      },
    ],
  },
  {
    slug: 'movies-like-babygirl-idea-of-you-bridget-jones-older-woman-younger-man',
    title: 'Best Older-Woman / Younger-Man Movies: Babygirl, The Idea of You, Bridget Jones & Lonely Planet',
    description:
      'Loved Babygirl’s hotel-bar scene, The Idea of You, Bridget Jones: Mad About the Boy, or Lonely Planet? Explore the golden wave of Cougar & Cub cinema, and play the scenarios live.',
    episodeId: 'babygirl-hotel-bar-milk-or-martini',
    paragraphs: [
      'Cinema and streaming have entered a full-scale older-woman / younger-man renaissance, led by Nicole Kidman and Harris Dickinson in A24’s Babygirl (and its endlessly memed hotel-bar glass-of-milk power play), Anne Hathaway and Nicholas Galitzine in The Idea of You, Renée Zellweger and Leo Woodall in Bridget Jones: Mad About the Boy, and Laura Dern and Liam Hemsworth in Lonely Planet.',
      'Across all four hits, plus classic comfort television like Courteney Cox’s Cougar Town, the modern narrative celebrates accomplished women reclaiming desire, humor, and autonomy alongside emotionally present younger men.',
    ],
    faqs: [
      {
        q: 'Why did the glass of milk scene in Babygirl go viral?',
        a: 'In Babygirl, Harris Dickinson’s younger character sends Nicole Kidman’s CEO character a glass of milk across a hotel bar, a bold real-life moment borrowed from director Halina Reijn that sparked millions of TikTok parodies.',
      },
      {
        q: 'What are the best recent older-woman / younger-man romance movies to stream?',
        a: 'Top recent titles include The Idea of You (2024), Lonely Planet (2024), Babygirl (2024), Bridget Jones: Mad About the Boy (2025), and Good Luck to You, Leo Grande.',
      },
    ],
    picks: [
      {
        name: 'Babygirl (Nicole Kidman • Prime Video 4K)',
        url: 'https://www.amazon.com/s?k=Babygirl+Nicole+Kidman+Prime+Video+movie',
      },
      {
        name: 'The Idea of You, Robinne Lee Paperback & Prime Video',
        url: 'https://www.amazon.com/s?k=The+Idea+of+You+Robinne+Lee+book+and+movie',
      },
      {
        name: 'Bridget Jones: Mad About the Boy (Prime Video)',
        url: 'https://www.amazon.com/s?k=Bridget+Jones+Mad+About+the+Boy+Prime+Video',
      },
    ],
  },
  {
    slug: 'how-to-meet-older-women-in-the-wild-hotel-bar-gym-etiquette',
    title: 'How to Meet Older Women "In the Wild": Hotel Bars, Gym Headphone Rules & Zero Cubsplaining',
    description:
      'Real advice from Cougars & Cubs Club on meeting Cougars in real life: why upscale hotel bars beat supermarket ambushes, the sacred gym headphone rule, and avoiding Cubsplaining.',
    episodeId: 'gym-headphones-vs-three-week-nod',
    paragraphs: [
      'Younger men frequently ask where to meet confident women in their late 30s, 40s, and 50s offline without coming across as intrusive. Community veterans agree on rule #1: never interrupt a woman mid-workout when her headphones are on, and skip rehearsed grocery-aisle pickup lines.',
      'Instead, focus on organic, high-trust settings: upscale hotel lobby bars where solo business travelers unwind, recurring fitness or climbing communities where three weeks of polite nods build natural rapport, trivia nights, and wine tastings, and never "Cubsplain" basic life skills she mastered twenty years ago.',
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
      'Unlike insecure dates who get defensive when a woman sets boundaries or refuses to rush on Date #1, a true Golden-Retriever Cub loves the slow burn, smiling warmly when she pushes back a little and proving his reliability week after week.',
      'When an independent Cougar, Puma, or Jaguar finally lets down her guard after weeks of steady courtship, the earned intimacy outlasts fast love-bombing every time.',
    ],
    faqs: [
      {
        q: 'Why do Golden Retriever younger men love Black Cat older women?',
        a: 'Because her calm, unhurried standards make every smile and invitation feel genuinely earned, while his sunny, zero-ego warmth lets her relax out of daily decision fatigue.',
      },
      {
        q: 'Is pushing back early in age-gap dating a red flag or a green flag?',
        a: 'Playful, honest pacing is a major green flag, it filters out impatient novelty-seekers and rewards partners who bring steady adult consistency.',
      },
    ],
    picks: [
      {
        name: 'Braided Leather "Short-Leash" Dog Leash (Barnaby & Golden-Retriever Approved)',
        url: 'https://www.amazon.com/s?k=braided+leather+short+traffic+dog+leash+brass+clasp',
      },
      {
        name: 'Fill-in-the-Blank Romantic Love Coupon Cards',
        url: 'https://www.amazon.com/s?k=fill+in+the+blank+love+coupons+cards+for+couples',
      },
      {
        name: '22-Momme Mulberry Silk Pillowcase & Claw-Clip Set',
        url: 'https://www.amazon.com/s?k=22+momme+mulberry+silk+pillowcase+queen+claw+clip',
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
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { margin: 0; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; background: #FFF7F0; color: #1E1022; line-height: 1.7; }
    main { max-width: 820px; margin: 0 auto; padding: 40px 20px 72px; }
    .card { background: #FFFFFF; border: 2.5px solid #1E1022; box-shadow: 5px 5px 0px #1E1022; border-radius: 24px; padding: 32px; }
    .badge { display: inline-block; background: #FF2E63; color: #fff; font-weight: 800; font-size: 13px; padding: 6px 14px; border-radius: 999px; border: 2px solid #1E1022; box-shadow: 3px 3px 0px #1E1022; text-decoration: none; }
    h1, h2, h3 { font-family: 'Outfit', system-ui, sans-serif; color: #1E1022; }
    h1 { font-size: 2rem; line-height: 1.18; margin: 18px 0 12px; }
    h2 { font-size: 1.35rem; color: #D90452; margin-top: 32px; }
    .cta { margin: 28px 0; padding: 24px; border: 2.5px solid #1E1022; box-shadow: 4px 4px 0px #1E1022; border-radius: 20px; background: #FFF4F7; }
    .btn { display: inline-block; margin-top: 12px; background: #FFBE0B; color: #1E1022; border: 2px solid #1E1022; box-shadow: 3px 3px 0px #1E1022; font-weight: 800; padding: 12px 22px; border-radius: 14px; text-decoration: none; }
    .picks { background: #FFFBEB; border: 2.5px solid #1E1022; border-radius: 20px; padding: 22px; margin-top: 28px; }
    .pick-link { display: block; margin: 10px 0; color: #1E1022; font-weight: 800; text-decoration: underline; }
    .disclosure { font-size: 13px; color: #5A4664; font-weight: 600; }
  </style>
</head>
<body>
  <main>
    <div class="card">
      <a class="badge" href="../../">← Play Cougars &amp; Cubs Club</a>
      <h1>${escapeHtml(g.title)}</h1>
      <p class="disclosure">Editorial Guide for Adult Age-Gap Relationships • Reader disclosure: curated shopping links below may earn a small affiliate commission at no extra cost to you.</p>
      ${g.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n      ')}
      <div class="cta">
        <strong>🎮 Ready to test your instincts in this exact scenario?</strong>
        <p style="margin:6px 0 0;font-size:15px;">Play as Her (Vet &amp; Train) or Play as Him (Impress &amp; Commit), then text a 60-second Vetting Audition link to your real-life Cougar or Cub.</p>
        <a class="btn" href="../../?dilemma=${encodeURIComponent(g.episodeId)}">Play Interactive Scenario Free →</a>
      </div>
      <section class="picks">
        <h2>Curated Date-Night &amp; Hosting Picks</h2>
        ${g.picks
          .map(
            (p) =>
              `<a class="pick-link" href="${escapeHtml(tagAmazon(p.url, g.slug))}" rel="noopener noreferrer sponsored" target="_blank">🛍️ ${escapeHtml(p.name.replace(/\s*\(\$\d+\)/g, ' (Check Price on Amazon)'))} →</a>`,
          )
          .join('\n        ')}
      </section>
      <section>
        <h2>Frequently Asked Questions</h2>
        ${g.faqs
          .map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`)
          .join('\n        ')}
      </section>
      <nav style="margin-top:36px;padding-top:20px;border-top:2px solid rgba(30,16,34,0.12)">
        <h2>More Cougars &amp; Cubs Club Guides</h2>
        <ul>
          ${STATIC_GUIDES.filter((other) => other.slug !== g.slug)
            .map(
              (other) =>
                `<li><a style="color:#D90452;font-weight:700" href="../${other.slug}/">${escapeHtml(other.title)}</a></li>`,
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
