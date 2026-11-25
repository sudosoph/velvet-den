import { MONETIZATION_CONFIG } from '../config/monetization';

export interface AffiliateProduct {
  id: string;
  name: string;
  category: 'houseboy' | 'trail_wellness' | 'princess_luxury' | 'hosting_upgrade' | 'date_night';
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
      'For 10 PM sparks followed by 3 AM flash-furnace heat waves—wicks heat instantly so nobody has to kick the duvet across the room.',
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
      'Because keeping up with a Cougar in her prime—and sweeping her up the stairs after espresso martinis—requires real chest and core reps.',
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
      'For the elite Cub who protects her blowout, honey braids, and retinol barrier at his place—plus a spare claw clip so she never has to hunt in her purse.',
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
