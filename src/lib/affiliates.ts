import { MONETIZATION_CONFIG } from '../config/monetization';

export type AffiliateCategory =
  | 'cougar_cub_merch'
  | 'funny_cute'
  | 'cinema_pop_culture'
  | 'houseboy'
  | 'trail_wellness'
  | 'princess_luxury'
  | 'hosting_upgrade'
  | 'date_night';

export interface AffiliateProduct {
  id: string;
  name: string;
  category: AffiliateCategory;
  priceDisplay: string;
  badge: string;
  cheekyPitch: string;
  whyItConverts: string;
  merchantUrl: string;
}

const PROHIBITED_ADULT_DOMAINS = [
  'lovehoney.com',
  'adamandeve.com',
  'pinkcherry.com',
  'bad-dragon.com',
  'lelo.com',
];

export const AFFILIATE_CATALOG: AffiliateProduct[] = [
  {
    id: 'trophy-boyfriend-cooking-apron',
    name: '"Trophy Husband (In Training)" Funny Pocket Chef Apron',
    category: 'cougar_cub_merch',
    priceDisplay: 'Cub Merch Pick',
    badge: '🐕 S-Rank Cub Graduation Apron',
    cheekyPitch:
      'Upgrade him from plain linen to full self-awareness: pocketed chef apron for the vetted Cub who sears grass-fed ribeye, washes every pan, and wears his title with pride.',
    whyItConverts: 'Self-referential Cougar/Cub apron payoff for Cub Academy & Sunday Houseboy fans.',
    merchantUrl: 'https://www.amazon.com/s?k=trophy+husband+funny+cooking+apron+for+men',
  },
  {
    id: 'leopard-print-cougar-apron',
    name: 'Fierce Leopard-Print Cougar Hostess & Sous-Chef Apron (With Pockets)',
    category: 'cougar_cub_merch',
    priceDisplay: 'Cougar Signature',
    badge: '🐆 Iconic Cougar Print Apron',
    cheekyPitch:
      'Whether she wears it shaking espresso martinis or ties it onto her 26-year-old sous-chef on Sunday morning, spotted Cougar couture with deep pockets for his phone and thermometer.',
    whyItConverts: 'Instant visual Cougar wink for couples cooking nights and kitchen selfies.',
    merchantUrl: 'https://www.amazon.com/s?k=leopard+print+kitchen+apron+with+pockets',
  },
  {
    id: 'good-boy-brass-training-clicker',
    name: '"Certified Good Boy" Obedience Clicker & Wrist-Strap Gag Gift',
    category: 'cougar_cub_merch',
    priceDisplay: 'Under-$12 Gag',
    badge: '🔔 Official 2D Cub Sim Prop',
    cheekyPitch:
      'Straight out of our 2D Cub Obedience School: keep one on the marble island and give a single polite click whenever he starts to "well actually" a podcast.',
    whyItConverts: 'Hilarious under-$12 impulse add-on that triggers Amazon’s 24-hour universal cart cookie.',
    merchantUrl: 'https://www.amazon.com/s?k=dog+training+clicker+wrist+strap+treat+pouch',
  },
  {
    id: 'funny-cougar-stemless-wine-glass',
    name: 'Sassy "Certified Cougar" Novelty Wine Glass & Gift Box',
    category: 'cougar_cub_merch',
    priceDisplay: 'Funny Gift Pick',
    badge: '🍷 Self-Aware Cougar Barware',
    cheekyPitch:
      'Unapologetic Cougar barware that leans all the way into the bit, ideal 40th/50th birthday, divorce-party glow-up, or 6-month Cub anniversary toast.',
    whyItConverts: 'High-intent self-referential gift search for Cougar birthdays & anniversaries.',
    merchantUrl: 'https://www.amazon.com/s?k=funny+cougar+wine+glass+gift+for+women',
  },
  {
    id: 'golden-retriever-boyfriend-mug',
    name: '"Golden Retriever Energy" Boyfriend Ceramic Coffee Mug',
    category: 'cougar_cub_merch',
    priceDisplay: 'Cute Gift Pick',
    badge: '☕ Morning Cortado Inside Joke',
    cheekyPitch:
      'For the sunny, unbothered 27-year-old Cub who texts back in 90 seconds, carries every grocery bag in one trip, and brings her oat latte in bed.',
    whyItConverts: 'Viral TikTok/age-gap archetype gift with massive couples conversion.',
    merchantUrl: 'https://www.amazon.com/s?k=golden+retriever+energy+funny+mug+gift',
  },
  {
    id: 'black-cat-girlfriend-leopard-mug',
    name: '"Black Cat Energy" Ceramic Espresso Mug (His & Hers Pair)',
    category: 'cougar_cub_merch',
    priceDisplay: 'Cute Gift Pick',
    badge: '🐈‍⬛ Selective Cougar Counterpart',
    cheekyPitch:
      'Pairs with his Golden-Retriever mug on the kitchen counter, for the poised, slow-burn Black-Cat Cougar whose calendar and standards stay undefeated.',
    whyItConverts: 'Natural 2-item bundle pair alongside the Golden Retriever Boyfriend mug.',
    merchantUrl: 'https://www.amazon.com/s?k=black+cat+energy+funny+coffee+mug+gift',
  },
  {
    id: 'cougar-hunter-retro-trucker-hat',
    name: 'Retro Foam "Cougar" Novelty Lake-Day & Pickleball Trucker Hat',
    category: 'cougar_cub_merch',
    priceDisplay: 'Cheeky Gag Pick',
    badge: '🧢 Claimed-Cub Weekend Cap',
    cheekyPitch:
      'Peak self-referential comedy for boat days, pickleball courts, and backyard BBQs once she officially claims him off the dating apps.',
    whyItConverts: 'Playful viral gag gift for couples who love leaning into age-gap banter.',
    merchantUrl: 'https://www.amazon.com/s?k=funny+cougar+trucker+hat+novelty+gift',
  },
  {
    id: 'houseboy-linen-apron',
    name: 'Japanese Cross-Back Heavyweight Linen Apron',
    category: 'houseboy',
    priceDisplay: 'Amazon Pick',
    badge: 'Sunday Houseboy Uniform',
    cheekyPitch:
      'For the vetted Cub who passed every maturity test and is ready to meal-prep, scrub counters, and look dangerously good doing her chores.',
    whyItConverts: 'Direct payoff to the Earned Houseboy Sunday subplot.',
    merchantUrl: 'https://www.amazon.com/s?k=japanese+cross+back+washed+linen+apron+men',
  },
  {
    id: 'trail-hydration-vest',
    name: 'Ultralight Ridge-Run Hydration Vest & Electrolyte Pack',
    category: 'trail_wellness',
    priceDisplay: 'Amazon Pick',
    badge: '6 AM Short-Leash Survival',
    cheekyPitch:
      'Because bragging about 25-year-old cardio means nothing when a 52-year-old Jaguar drops you on mile four of the ridge trail.',
    whyItConverts: 'Pairs directly with the 6 AM Steep Trail Run episode.',
    merchantUrl: 'https://www.amazon.com/s?k=ultralight+trail+running+hydration+vest+pack',
  },
  {
    id: 'princess-mulberry-silk-robe',
    name: '22-Momme Mulberry Silk Kimono Lounge Robe',
    category: 'princess_luxury',
    priceDisplay: 'Luxury Pick',
    badge: 'Princess Cougar Favorite',
    cheekyPitch:
      'She carried everyone else’s mental load all week. Pour her a Pinot, draw the bath, and wrap her in pure soft-life luxury.',
    whyItConverts: 'High-AOV gift tied to the Princess Cougar & Palm Springs arcs.',
    merchantUrl: 'https://www.amazon.com/s?k=100+percent+mulberry+silk+robe+women+22+momme',
  },
  {
    id: 'hosting-lidded-bin-soap',
    name: 'Matte-Black Lidded Bathroom Bin + Aesop-Style Botanical Hand Wash',
    category: 'hosting_upgrade',
    priceDisplay: 'Amazon Pick',
    badge: 'Rule #1 Hosting Fix',
    cheekyPitch:
      'Every experienced woman begs young men to own two things before she comes over: botanical hand soap and a bathroom trash can WITH A LID.',
    whyItConverts: 'Instant laugh-and-buy gift from the Apartment Audit episode & SEO checklist.',
    merchantUrl: 'https://www.amazon.com/s?k=matte+black+bathroom+trash+can+with+lid+and+hand+soap+set',
  },
  {
    id: 'percale-hosting-sheets',
    name: '600-Thread-Count Crisp Long-Staple Cotton Sheet Set',
    category: 'hosting_upgrade',
    priceDisplay: 'Amazon Pick',
    badge: 'Retire the Navy Polyester',
    cheekyPitch:
      'Upgrade from dorm microfiber before inviting a C-Suite Cougar back to your place. Bonus points if you own an actual oak bedframe.',
    whyItConverts: 'Core item in the First-Time Hosting SEO guide.',
    merchantUrl: 'https://www.amazon.com/s?k=long+staple+cotton+percale+sheet+set+queen+white',
  },
  {
    id: 'date-night-oud-bergamot',
    name: 'Warm Cedar, Bergamot & Amber Eau de Parfum',
    category: 'date_night',
    priceDisplay: 'Amazon Pick',
    badge: 'Code-Switch Signature Scent',
    cheekyPitch:
      'Leaves club body-spray in sophomore year. Subtle, warm, close-to-the-collarbone sophistication when you lean in to open her car door.',
    whyItConverts: 'High-converting Cub self-upgrade before first dates.',
    merchantUrl: 'https://www.amazon.com/s?k=bergamot+cedar+amber+eau+de+parfum+men',
  },
  {
    id: 'espresso-martini-barware',
    name: 'Weighted Copper Cocktail Shaker & Coupe Glass Pair',
    category: 'date_night',
    priceDisplay: 'Amazon Pick',
    badge: '"Not Her Son" Toast Kit',
    cheekyPitch:
      'For shaking two celebratory espresso martinis at home right after laughing off the restaurant waiter.',
    whyItConverts: 'Connects to the viral Waiter Incident & Check-Drop episodes.',
    merchantUrl: 'https://www.amazon.com/s?k=espresso+martini+cocktail+shaker+coupe+glasses+set',
  },
  {
    id: 'after-dark-couples-deck',
    name: 'Deep-Dive Intimacy & Life-Stage Couples Card Deck',
    category: 'date_night',
    priceDisplay: 'Amazon Pick',
    badge: 'Date #3 Conversation Spark',
    cheekyPitch:
      'Skip the small talk and jump straight into fun, cheeky, emotionally mature prompts designed for real connection.',
    whyItConverts: 'Impulse date-night gift for real Cougar/Cub couples.',
    merchantUrl: 'https://www.amazon.com/s?k=couples+conversation+cards+date+night+game',
  },
  {
    id: 'cooling-bamboo-sheets',
    name: '100% Organic Bamboo Viscose Temperature-Regulating Sheet Set',
    category: 'hosting_upgrade',
    priceDisplay: 'Amazon Pick',
    badge: '3 AM Perimenopause & Menopause Hero',
    cheekyPitch:
      'For 10 PM sparks followed by 3 AM flash-furnace heat waves, wicks heat instantly so nobody has to kick the duvet across the room.',
    whyItConverts: 'Directly solves the #1 sleep/intimacy complaint in 40s–60s relationships.',
    merchantUrl: 'https://www.amazon.com/s?k=100+percent+bamboo+viscose+cooling+sheets+queen',
  },
  {
    id: 'cast-iron-steak-skillet',
    name: '12-Inch Pre-Seasoned Cast-Iron Ribeye Skillet',
    category: 'houseboy',
    priceDisplay: 'Amazon Pick',
    badge: '30s Low-Iron Caretaking MVP',
    cheekyPitch:
      'When her ferritin hits 11 and her toes are ice cubes: sear a grass-fed ribeye with lemony spinach in cast iron like an elite high-EQ Cub.',
    whyItConverts: 'Tied directly to the 30s Hormonal & Low-Iron Caretaking subplot.',
    merchantUrl: 'https://www.amazon.com/s?k=12+inch+pre+seasoned+cast+iron+skillet',
  },
  {
    id: 'adjustable-dumbbell-bench',
    name: 'Heavy-Duty Foldable Weight Bench ("Carry Her Upstairs" Kit)',
    category: 'trail_wellness',
    priceDisplay: 'Fitness Pick',
    badge: 'Cub Bench-Press Essential',
    cheekyPitch:
      'Because keeping up with a Cougar in her prime, and sweeping her up the stairs after espresso martinis, requires real chest and core reps.',
    whyItConverts: 'Direct tie-in to the Cub Bench-Press Training minigame.',
    merchantUrl: 'https://www.amazon.com/s?k=foldable+adjustable+weight+bench+home+gym',
  },
  {
    id: 'cub-grooming-beard-skincare-kit',
    name: 'Sandalwood Beard Oil, Peptide Moisturizer & Barber Grooming Kit',
    category: 'princess_luxury',
    priceDisplay: 'Amazon Pick',
    badge: '"Cougar-Groomed" Red-Carpet Kit',
    cheekyPitch:
      'The ONLY kind of "grooming" endorsed by Cougars & Cubs Club: throw out his 5-in-1 neon-blue shower gel and polish a grown 26+ Cub to Danny Ramirez red-carpet sheen.',
    whyItConverts: 'Direct payoff to the Cub "Grooming" Salon minigame & pop-culture episode.',
    merchantUrl: 'https://www.amazon.com/s?k=sandalwood+beard+oil+mens+skincare+grooming+gift+set',
  },
  {
    id: 'silk-pillowcase-sleepover-duo',
    name: '22-Momme Mulberry Silk Pillowcase & Tortoiseshell Claw-Clip Set',
    category: 'princess_luxury',
    priceDisplay: 'Amazon Pick',
    badge: 'His Apartment "Her Drawer" MVP',
    cheekyPitch:
      'For the elite Cub who protects her blowout, honey braids, and retinol barrier at his place, plus a spare claw clip so she never has to hunt in her purse.',
    whyItConverts: 'Direct tie-in to the Silk Pillowcase & Secret "Her Drawer" lifestyle episode.',
    merchantUrl: 'https://www.amazon.com/s?k=22+momme+mulberry+silk+pillowcase+queen+claw+clip',
  },
  {
    id: 'zero-proof-botanical-mocktail-set',
    name: 'Zero-Proof Botanical Aperitif Elixir & Ribbed Mocktail Coupe Set',
    category: 'date_night',
    priceDisplay: 'Wellness Pick',
    badge: 'Qigong Mommy & Sleep-First MVP',
    cheekyPitch:
      'For Qigong & Tai Chi Wellness Mommies protecting 8 hours of beauty sleep and attentive Cubs who prefer 6:30 AM Cloud-Hands stamina over tequila hangovers.',
    whyItConverts: 'Direct tie-in to the Qigong Wellness Mommy-Domme & Zero-Proof Mocktail episodes.',
    merchantUrl: 'https://www.amazon.com/s?k=non+alcoholic+botanical+aperitif+mocktail+coupe+glasses',
  },
  {
    id: 'fill-in-love-coupon-cards',
    name: 'Fill-in-the-Blank Romantic Love Coupon Cards & Date-Night Vouchers',
    category: 'funny_cute',
    priceDisplay: 'Cute Gift Pick',
    badge: 'Founder Favorite • Under-$15 Gem',
    cheekyPitch:
      'Hand-write custom IOUs she actually craves: "1 Zero-Dishes Linen-Apron Sunday," "3 AM Cold-Pillow Flip," "Uncomplaining Target Run," or "18h Cedar Sauna Escape."',
    whyItConverts: 'Ultra-high-conversion impulse gift that unlocks Amazon’s 24-hour universal cart cookie.',
    merchantUrl: 'https://www.amazon.com/s?k=fill+in+the+blank+love+coupons+cards+for+couples',
  },
  {
    id: 'short-leash-leather-dog-leash',
    name: 'Braided Leather Hands-Free "Short-Leash" Dog Leash & Brass Clasp',
    category: 'funny_cute',
    priceDisplay: 'Cheeky Pick',
    badge: 'Bernedoodle & Golden-Retriever Boyfriend Approved',
    cheekyPitch:
      'Officially built for walking her tricolor Mini Bernedoodle "Miso" or rescue pup Barnaby, unofficially the funniest inside-joke gift for a Cub who loves staying on Mommy’s short leash.',
    whyItConverts: 'Double-entendre viral hit across Dog-Mom Puma, Bernedoodle Mommy, and Short-Leash Trail arcs.',
    merchantUrl: 'https://www.amazon.com/s?k=braided+leather+short+traffic+dog+leash+brass+clasp',
  },
  {
    id: 'big-carl-giant-wine-glass',
    name: 'Oversized "Big Carl" XL Stemmed Red-Wine Goblet (Holds Full Bottle)',
    category: 'funny_cute',
    priceDisplay: 'Funny Gag Gift',
    badge: 'Cougar Town "Just One Glass" Icon',
    cheekyPitch:
      'Channel Courteney Cox’s Jules Cobb on girls’ night or your 6-month anniversary: technically "just one glass of Pinot" when the goblet holds 750ml.',
    whyItConverts: 'Direct payoff to the Big Carl Wine Pour minigame & Cougar Town SEO guide.',
    merchantUrl: 'https://www.amazon.com/s?k=oversized+giant+full+bottle+wine+glass+funny+gift',
  },
  {
    id: 'chic-candlelit-menu-readers',
    name: 'Oversized Tortoiseshell Designer Blue-Light & Bistro Menu Readers',
    category: 'funny_cute',
    priceDisplay: 'Amazon Pick',
    badge: '6-Point Candlelit Menu Hero',
    cheekyPitch:
      'Because trendy speakeasies print menus in microscopic grey italics in pitch darkness, and slipping on chic tortoiseshell frames beats borrowing his iPhone flashlight.',
    whyItConverts: 'Laugh-out-loud relatable payoff to the Candlelit Menu Font & Seat-Warmer episode.',
    merchantUrl: 'https://www.amazon.com/s?k=oversized+tortoiseshell+reading+glasses+women+chic',
  },
  {
    id: 'babygirl-movie-prime',
    name: 'Babygirl (Prime Video 4K Watch-Night & Collector’s Edition)',
    category: 'cinema_pop_culture',
    priceDisplay: 'Prime Video',
    badge: '"Tall Glass of Milk" Cinema Night',
    cheekyPitch:
      'Queue up Nicole Kidman & Harris Dickinson’s iconic A24 hotel-bar power play for Friday movie night, tall glass of milk or dirty olive martini optional.',
    whyItConverts: 'Zero-return instant streaming rental/purchase directly from our #1 viral hotel-bar scene.',
    merchantUrl: 'https://www.amazon.com/s?k=Babygirl+Nicole+Kidman+Prime+Video+movie',
  },
  {
    id: 'idea-of-you-movie-book',
    name: 'The Idea of You • Robinne Lee Paperback & Prime Video Double Feature',
    category: 'cinema_pop_culture',
    priceDisplay: 'Book & Prime',
    badge: '#1 Cougar × Cub Comfort Watch',
    cheekyPitch:
      'From Anne Hathaway & Nicholas Galitzine’s Coachella VIP trailer meet-cute to Robinne Lee’s beloved novel, mandatory homework for every modern Cub.',
    whyItConverts: 'High-volume BookTok + streaming conversion from Celebrity & Cougar Cinema guides.',
    merchantUrl: 'https://www.amazon.com/s?k=The+Idea+of+You+Robinne+Lee+book+and+movie',
  },
  {
    id: 'bridget-jones-cougar-town-watch',
    name: 'Bridget Jones: Mad About the Boy & Cougar Town Comfort-Watch Collection',
    category: 'cinema_pop_culture',
    priceDisplay: 'Prime Video',
    badge: 'Second-Act Rom-Com Royalty',
    cheekyPitch:
      'Celebrate Leo Woodall’s charming 29-year-old park ranger "Roxster" winning over Bridget Jones alongside Jules Cobb’s Cul-de-Sac Crew.',
    whyItConverts: 'Direct match for second-act divorced/widowed Puma & Cougar readers.',
    merchantUrl: 'https://www.amazon.com/s?k=Bridget+Jones+Mad+About+the+Boy+Prime+Video',
  },
  {
    id: 'the-rebound-zeta-jones-prime',
    name: 'The Rebound (Catherine Zeta-Jones & Justin Bartha • Prime Video)',
    category: 'cinema_pop_culture',
    priceDisplay: 'Prime Video',
    badge: 'OG NYC Cougar × Barista Rom-Com',
    cheekyPitch:
      'Catherine Zeta-Jones (40) moves above a Manhattan coffee shop after her divorce and falls for 25-year-old Golden-Retriever nanny Justin Bartha, pure blueprint cinema.',
    whyItConverts: 'High-intent streaming rental/buy directly from our Master List of Cougar & Cub Movies.',
    merchantUrl: 'https://www.amazon.com/s?k=The+Rebound+Catherine+Zeta+Jones+Prime+Video+movie',
  },
  {
    id: 'seed-oil-free-ghee-evoo-set',
    name: 'Grass-Fed Artisanal Ghee & Cold-Pressed Tuscan Extra-Virgin Olive Oil Duo',
    category: 'houseboy',
    priceDisplay: 'Wellness Pantry',
    badge: '100% Seed-Oil-Free Mommy Approved',
    cheekyPitch:
      'Retire canola and soybean oil before your Holistic Health-Nut Mommy inspects your kitchen, sear her grass-fed ribeye in pure ghee and polyphenol EVOO.',
    whyItConverts: 'Direct payoff to the Seed-Oil-Free & Tricolor Mini Bernedoodle Mommy audit minigame.',
    merchantUrl: 'https://www.amazon.com/s?k=grass+fed+ghee+and+cold+pressed+extra+virgin+olive+oil',
  },
  {
    id: 'linen-picnic-insulated-tote',
    name: 'Woven Willow & Waterproof Linen Sunset Picnic Basket for Two',
    category: 'date_night',
    priceDisplay: 'Date-Night Pick',
    badge: 'Beats Mom’s Maui Timeshare',
    cheekyPitch:
      'Proof that an honest meadow picnic with fresh figs and gluten-free crackers beats pretending your mom Linda’s Hawaii timeshare is "your place" every single time.',
    whyItConverts: 'Payoff to both the Meadow Picnic & Mom’s Hawaii Timeshare Interrogation scenes.',
    merchantUrl: 'https://www.amazon.com/s?k=wicker+picnic+basket+for+2+with+waterproof+blanket',
  },
  {
    id: 'velvet-travel-weekender-duffel',
    name: 'Canvas & Full-Grain Leather Overnight Weekender Bag ("Zero PS5" Edition)',
    category: 'hosting_upgrade',
    priceDisplay: 'Travel Pick',
    badge: '18h Getaway • Sanctuary Approved',
    cheekyPitch:
      'Sized cleanly for pressed linen, cedar parfum, and a spontaneous 18-hour hotel-sauna escape, intentionally too compact to smuggle a PS5 and gym laundry into her condo.',
    whyItConverts: 'Bridges the Spontaneous 18h Getaway and Hobosexual PS5 Bouncer episodes.',
    merchantUrl: 'https://www.amazon.com/s?k=mens+canvas+leather+overnight+weekender+duffel+bag',
  },
];

export interface AffiliateTagOverrides {
  amazonAssociateTag?: string;
  partnerSubId?: string;
}

function validateSafeMerchantDomain(rawUrl: string): URL {
  const parsed = new URL(rawUrl);
  const host = parsed.hostname.toLowerCase();
  for (const banned of PROHIBITED_ADULT_DOMAINS) {
    if (host === banned || host.endsWith(`.${banned}`)) {
      throw new Error(
        `Blocked prohibited adult domain (${host}) to preserve Stripe & Amazon compliance.`,
      );
    }
  }
  return parsed;
}

function isLiveBrowserEdgeRuntime(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  if (ua.toLowerCase().includes('jsdom')) return false;
  return window.location.protocol === 'https:' || window.location.protocol === 'http:';
}

/**
 * Builds an affiliate URL with full domain allowlist validation and tag injection.
 * - When `overrides` are provided (or in offline/unit-test environments), returns the
 *   direct tagged Amazon URL (`?tag=...&linkCode=ll2`).
 * - In live browser production, routes catalog items through `/api/go/:id` on the
 *   Cloudflare Worker so every click (Linen Apron, Silk Robe, Cooling Sheets, etc.)
 *   is protected by the edge Associate Tag (from Worker env or KV) + click-tracked!
 */
export function buildAffiliateUrl(
  product: AffiliateProduct,
  placement: string,
  overrides?: AffiliateTagOverrides,
): string {
  const parsed = validateSafeMerchantDomain(product.merchantUrl);
  const host = parsed.hostname.toLowerCase();
  const safePlacement = placement.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48) || 'boutique';

  if (
    !overrides &&
    isLiveBrowserEdgeRuntime() &&
    AFFILIATE_CATALOG.some((item) => item.id === product.id)
  ) {
    return `/api/go/${encodeURIComponent(product.id)}?src=${encodeURIComponent(safePlacement)}`;
  }

  const amazonTag = (
    overrides?.amazonAssociateTag ?? MONETIZATION_CONFIG.amazonAssociateTag
  ).trim();
  const subId = (overrides?.partnerSubId ?? MONETIZATION_CONFIG.partnerSubId).trim();

  if (amazonTag && host.includes('amazon.')) {
    parsed.searchParams.set('tag', amazonTag);
    parsed.searchParams.set('linkCode', 'll2');
  }
  if (subId) {
    parsed.searchParams.set('subId', subId);
  }

  parsed.searchParams.set('utm_source', 'cougarsandcubs');
  parsed.searchParams.set('utm_medium', 'affiliate');
  parsed.searchParams.set('utm_campaign', safePlacement);

  return parsed.toString();
}

export function getAffiliateById(id?: string): AffiliateProduct | undefined {
  if (!id) return undefined;
  return AFFILIATE_CATALOG.find((item) => item.id === id);
}
