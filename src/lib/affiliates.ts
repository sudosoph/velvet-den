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
    priceDisplay: '$34',
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
    priceDisplay: '$48',
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
    priceDisplay: '$118',
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
    priceDisplay: '$42',
    badge: 'Subreddit Rule #1 Hosting Fix',
    cheekyPitch:
      'Every thread on r/CougarsAndCubs begs young men to own two things before she comes over: hand soap and a bathroom trash can WITH A LID.',
    whyItConverts: 'Instant laugh-and-buy gift from the Apartment Audit episode & SEO checklist.',
    merchantUrl: 'https://www.amazon.com/s?k=matte+black+bathroom+trash+can+with+lid+and+hand+soap+set',
  },
  {
    id: 'percale-hosting-sheets',
    name: '600-Thread-Count Crisp Long-Staple Cotton Sheet Set',
    category: 'hosting_upgrade',
    priceDisplay: '$79',
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
    priceDisplay: '$68',
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
    priceDisplay: '$54',
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
    priceDisplay: '$26',
    badge: 'Date #3 Conversation Spark',
    cheekyPitch:
      'Skip the small talk and jump straight into fun, cheeky, emotionally mature prompts designed for real connection.',
    whyItConverts: 'Impulse sub-$30 gift for real Cougar/Cub couples.',
    merchantUrl: 'https://www.amazon.com/s?k=couples+conversation+cards+date+night+game',
  },
];

export interface AffiliateTagOverrides {
  amazonAssociateTag?: string;
  partnerSubId?: string;
}

export function buildAffiliateUrl(
  product: AffiliateProduct,
  placement: string,
  overrides?: AffiliateTagOverrides,
): string {
  const parsed = new URL(product.merchantUrl);
  const host = parsed.hostname.toLowerCase();

  for (const banned of PROHIBITED_ADULT_DOMAINS) {
    if (host === banned || host.endsWith(`.${banned}`)) {
      throw new Error(
        `Blocked prohibited adult domain (${host}) to preserve Stripe & Ko-fi compliance.`,
      );
    }
  }

  const amazonTag = (
    overrides?.amazonAssociateTag ?? MONETIZATION_CONFIG.amazonAssociateTag
  ).trim();
  const subId = (overrides?.partnerSubId ?? MONETIZATION_CONFIG.partnerSubId).trim();

  if (amazonTag && host.includes('amazon.')) {
    parsed.searchParams.set('tag', amazonTag);
  }
  if (subId) {
    parsed.searchParams.set('subId', subId);
  }

  const safePlacement = placement.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48) || 'boutique';
  parsed.searchParams.set('utm_source', 'velvetden');
  parsed.searchParams.set('utm_medium', 'affiliate');
  parsed.searchParams.set('utm_campaign', safePlacement);

  return parsed.toString();
}

export function getAffiliateById(id?: string): AffiliateProduct | undefined {
  if (!id) return undefined;
  return AFFILIATE_CATALOG.find((item) => item.id === id);
}
