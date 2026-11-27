import { MONETIZATION_CONFIG } from '../config/monetization';
import { resolveProductPhotoUrl } from '../data/v35AssetManifest';

export type AffiliateCategory =
  | 'cougar_cub_merch'
  | 'funny_cute'
  | 'cinema_pop_culture'
  | 'houseboy'
  | 'trail_wellness'
  | 'princess_luxury'
  | 'hosting_upgrade'
  | 'date_night';

export type AffiliateVisualMotif =
  | 'apron_trophy'
  | 'apron_leopard'
  | 'clicker_brass'
  | 'wine_goblet'
  | 'mug_golden'
  | 'mug_blackcat'
  | 'trucker_cap'
  | 'apron_linen'
  | 'hydration_vest'
  | 'silk_robe'
  | 'lidded_bin_soap'
  | 'percale_sheets'
  | 'parfum_bottle'
  | 'copper_shaker'
  | 'card_deck'
  | 'cooling_sheets'
  | 'cast_iron'
  | 'weight_bench'
  | 'grooming_kit'
  | 'silk_pillow'
  | 'botanical_elixir'
  | 'love_coupons'
  | 'leash_leather'
  | 'menu_readers'
  | 'cinema_poster'
  | 'picnic_basket'
  | 'weekender_bag';

export interface AffiliateVisualSpec {
  motif: AffiliateVisualMotif;
  emoji: string;
  accentFrom: string;
  accentTo: string;
  studioLabel: string;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  category: AffiliateCategory;
  priceDisplay: string;
  badge: string;
  cheekyPitch: string;
  whyItConverts: string;
  merchantUrl: string;
  photoUrl: string;
  visualSpec: AffiliateVisualSpec;
}

const PROHIBITED_ADULT_DOMAINS = [
  'lovehoney.com',
  'adamandeve.com',
  'pinkcherry.com',
  'bad-dragon.com',
  'lelo.com',
];

const RAW_AFFILIATE_CATALOG: Omit<AffiliateProduct, 'visualSpec' | 'photoUrl'>[] = [
  {
    id: 'trophy-boyfriend-cooking-apron',
    name: '"Trophy Husband (In Training)" Pocket Chef Apron',
    category: 'cougar_cub_merch',
    priceDisplay: '$18 Amazon Pick',
    badge: '🐕 S-Rank Sous-Chef Apron',
    cheekyPitch:
      'Dual-pocket chef apron for the vetted younger partner who sears rosemary ribeye, washes every skillet before midnight, and wears his title with a grin.',
    whyItConverts: 'Self-aware kitchen gift for Sunday dinner dates and Cub School graduates.',
    merchantUrl: 'https://www.amazon.com/dp/B0BXXDBB8F',
  },
  {
    id: 'leopard-print-cougar-apron',
    name: 'Classic Leopard-Print Hostess & Chef Apron (With Pockets)',
    category: 'cougar_cub_merch',
    priceDisplay: '$16 Signature Pick',
    badge: '🐆 Iconic Spotted Hostess Apron',
    cheekyPitch:
      'Whether she wears it shaking chilled martinis or ties it onto her 26-year-old sous-chef on Sunday morning, deep pockets hold the wine key and meat thermometer.',
    whyItConverts: 'Playful visual wink for couples cooking nights.',
    merchantUrl: 'https://www.amazon.com/dp/B0GLPF6K39',
  },
  {
    id: 'good-boy-brass-training-clicker',
    name: 'Ergonomic Obedience Training Clicker & Wrist-Strap Duo',
    category: 'cougar_cub_merch',
    priceDisplay: '$9 Gag Gift',
    badge: '🔔 Official Cub School Prop',
    cheekyPitch:
      'Keep one on the marble kitchen island and give a single polite click whenever he starts summarizing a three-hour finance podcast.',
    whyItConverts: 'Under-$10 impulse add-on straight out of Cub Obedience School.',
    merchantUrl: 'https://www.amazon.com/dp/B08FQQ3R3S',
  },
  {
    id: 'funny-cougar-stemless-wine-glass',
    name: 'Godinger Original Cougar-Town Inspired Full-Bottle Wine Topper Glass',
    category: 'cougar_cub_merch',
    priceDisplay: '$15 Gift Pick',
    badge: '🍷 Cul-de-Sac Toast Classic',
    cheekyPitch:
      'Unapologetic barware built for girls’ night, divorce-party glow-ups, or celebrating six months with a partner who actually plans Friday dinner.',
    whyItConverts: 'High-intent novelty barware gift.',
    merchantUrl: 'https://www.amazon.com/dp/B077TC25XQ',
  },
  {
    id: 'golden-retriever-boyfriend-mug',
    name: '"Golden Retriever Energy" Ceramic Morning Coffee Mug',
    category: 'cougar_cub_merch',
    priceDisplay: '$15 Cute Gift',
    badge: '☕ Morning Espresso Favorite',
    cheekyPitch:
      'For the sunny, unbothered 27-year-old who texts back in ninety seconds, carries every grocery bag in one trip, and brings oat lattes to bed.',
    whyItConverts: 'Beloved age-gap archetype mug for morning coffee.',
    merchantUrl: 'https://www.amazon.com/dp/B07MLLXW4Q',
  },
  {
    id: 'black-cat-girlfriend-leopard-mug',
    name: '"Black Cat Energy" Ceramic Espresso Mug',
    category: 'cougar_cub_merch',
    priceDisplay: '$15 Cute Gift',
    badge: '🐈‍⬛ Selective Counterpart Mug',
    cheekyPitch:
      'Pairs beside his Golden-Retriever mug on the counter, built for the poised Black-Cat woman whose calendar and standards stay undefeated.',
    whyItConverts: 'Natural his-and-hers pair alongside the Golden Retriever mug.',
    merchantUrl: 'https://www.amazon.com/dp/B0DNJ8P9Z3',
  },
  {
    id: 'cougar-hunter-retro-trucker-hat',
    name: 'Retro Foam Novelty Lake-Day & Pickleball Snapback Trucker Hat',
    category: 'cougar_cub_merch',
    priceDisplay: '$17 Gag Pick',
    badge: '🧢 Claimed Weekend Cap',
    cheekyPitch:
      'Self-referential comedy for boat days, mixed-doubles courts, and backyard BBQs once she officially claims him off the apps.',
    whyItConverts: 'Playful weekend gag gift for confident couples.',
    merchantUrl: 'https://www.amazon.com/dp/B0D5BRYPVT',
  },
  {
    id: 'houseboy-linen-apron',
    name: 'Japanese Cross-Back Washed Cotton-Linen Chef Apron',
    category: 'houseboy',
    priceDisplay: '$22 Kitchen Pick',
    badge: '🥂 Sunday Brunch Uniform',
    cheekyPitch:
      'No neck-tie pinch, two deep side pockets, and washed linen drape for the man who preps homemade pasta and leaves the kitchen spotless.',
    whyItConverts: 'Everyday upgrade for home-cooked Date #3 nights.',
    merchantUrl: 'https://www.amazon.com/dp/B093GJW13K',
  },
  {
    id: 'trail-hydration-vest',
    name: 'Salomon Cross 12 Ultralight Trail-Running Hydration Pack',
    category: 'trail_wellness',
    priceDisplay: '$89 Trail Pick',
    badge: '🏔️ 6 AM Ridge-Run Essential',
    cheekyPitch:
      'Bragging about twenty-something cardio means nothing when an experienced coastal runner drops you on mile four of the bluff trail.',
    whyItConverts: 'Trusted gear pick for active outdoor couples.',
    merchantUrl: 'https://www.amazon.com/dp/B0D59W2JZX',
  },
  {
    id: 'princess-mulberry-silk-robe',
    name: 'LILYSILK Women’s 100% Grade-6A Mulberry Silk Kimono Lounge Robe',
    category: 'princess_luxury',
    priceDisplay: '$169 Luxury Pick',
    badge: '👑 Chapter-Two Soft-Life Icon',
    cheekyPitch:
      'She ran everyone else’s meetings all week. Pour a chilled Pinot, run the bath, and wrap her in pure Grade-6A mulberry silk charmeuse.',
    whyItConverts: 'High-ticket anniversary and weekend getaway gift.',
    merchantUrl: 'https://www.amazon.com/dp/B0FD3H89H5',
  },
  {
    id: 'hosting-lidded-bin-soap',
    name: 'Sleek Matte-Black Step Bathroom Trash Can With Soft-Close Lid',
    category: 'hosting_upgrade',
    priceDisplay: '$29 Hosting Fix',
    badge: '🧴 Cub School Drill #1 Fix',
    cheekyPitch:
      'Rule one of Cub Obedience School before inviting a grown woman over: retire the open plastic wastebasket and put a lidded bin beside clean hand towels.',
    whyItConverts: 'Direct practical fix from Cub School Drill #1.',
    merchantUrl: 'https://www.amazon.com/dp/B0FHH85CXQ',
  },
  {
    id: 'percale-hosting-sheets',
    name: 'Linenwalas 100% Organic Long-Staple Cotton Crisp Sheet Set (Queen)',
    category: 'hosting_upgrade',
    priceDisplay: '$58 Bedroom Upgrade',
    badge: '🛏️ Cub School Drill #2 Fix',
    cheekyPitch:
      'Retire the navy dorm microfiber and single pancake pillow before she sees your apartment. Crisp breathable cotton and four real pillows are mandatory.',
    whyItConverts: 'Essential bedroom upgrade for first sleepovers.',
    merchantUrl: 'https://www.amazon.com/dp/B0C7LGBLYJ',
  },
  {
    id: 'date-night-oud-bergamot',
    name: 'NOIR Essence Bergamot, Cedar & Warm Amber Eau de Parfum (3.4 oz)',
    category: 'date_night',
    priceDisplay: '$36 Scent Pick',
    badge: '🌲 Close-Collarbone Signature',
    cheekyPitch:
      'Leaves locker-room body spray in college. Warm bergamot, dry cedarwood, and subtle amber built for leaning across a mahogany cocktail bar.',
    whyItConverts: 'Easy pre-date confidence upgrade.',
    merchantUrl: 'https://www.amazon.com/dp/B0DX3V4YC1',
  },
  {
    id: 'espresso-martini-barware',
    name: 'Mint & Mortar 7-Piece Copper Cocktail Shaker & Bamboo Stand Set',
    category: 'date_night',
    priceDisplay: '$38 Barware Set',
    badge: '🍸 Marlow Lounge Home Bar Kit',
    cheekyPitch:
      'Weighted 24-ounce copper cobbler shaker, double jigger, and Hawthorne strainer for shaking two frothy espresso martinis after dinner.',
    whyItConverts: 'Signature barware set tied to The Marlow Lounge martini scenes.',
    merchantUrl: 'https://www.amazon.com/dp/B08KQCX9Z9',
  },
  {
    id: 'after-dark-couples-deck',
    name: "We're Not Really Strangers: Couples Edition Card Game (150 Cards)",
    category: 'date_night',
    priceDisplay: '$25 Date-Night Game',
    badge: '🃏 Three-Level Chemistry Deck',
    cheekyPitch:
      'Skip repetitive app small talk and deal three levels of thoughtful, disarming late-night prompts over wine on the sofa.',
    whyItConverts: 'Bestselling couples conversation deck.',
    merchantUrl: 'https://www.amazon.com/dp/B0B7V56B7H',
  },
  {
    id: 'cooling-bamboo-sheets',
    name: 'Ultra-Soft Cooling Tencel Lyocell & Breathable Sheet Set (4-Piece)',
    category: 'hosting_upgrade',
    priceDisplay: '$64 Sleep Sanctuary',
    badge: '❄️ 3 AM Cool-Sleep Hero',
    cheekyPitch:
      'Wicks heat away in seconds so nobody wakes up kicking the duvet off at 3 AM, pure hotel-suite airflow all night.',
    whyItConverts: 'Solves warm-sleeper comfort on weekend stays.',
    merchantUrl: 'https://www.amazon.com/dp/B08HR2WW6T',
  },
  {
    id: 'cast-iron-steak-skillet',
    name: 'Lodge 12-Inch Pre-Seasoned Cast-Iron Deep Skillet With Glass Lid',
    category: 'houseboy',
    priceDisplay: '$44 Kitchen Staple',
    badge: '🥩 Friday Steakhouse Sear',
    cheekyPitch:
      'Heavy American cast iron that holds a steakhouse crust on garlic-rosemary ribeye and goes straight from burner to oven.',
    whyItConverts: 'Iconic lifetime kitchen workhorse.',
    merchantUrl: 'https://www.amazon.com/dp/B0BFQ1SV7X',
  },
  {
    id: 'adjustable-dumbbell-bench',
    name: 'FLYBIRD 750-Lb Foldable Multi-Position Home Workout Bench',
    category: 'trail_wellness',
    priceDisplay: '$99 Strength Pick',
    badge: '🏋️ Carry-Both-Suitcases Strength',
    cheekyPitch:
      'Folds flat into a closet in ten seconds and handles full incline/flat dumbbell work so carrying both roller bags at Terminal B feels effortless.',
    whyItConverts: ' #1 Amazon compact home-gym bench.',
    merchantUrl: 'https://www.amazon.com/dp/B07HNLBZ4Y',
  },
  {
    id: 'cub-grooming-beard-skincare-kit',
    name: 'Every Man Jack 5-Piece Sandalwood Beard, Face Lotion & Wood Comb Kit',
    category: 'date_night',
    priceDisplay: '$32 Grooming Set',
    badge: '💈 Zero Scratchy-Stubble Kit',
    cheekyPitch:
      'Softens scruff with warm sandalwood oil, face lotion, and beard butter so leaning in for a kiss never feels like sandpaper.',
    whyItConverts: 'Practical grooming gift set for men.',
    merchantUrl: 'https://www.amazon.com/dp/B0B84DJXSW',
  },
  {
    id: 'silk-pillowcase-sleepover-duo',
    name: 'LILYSILK 22-Momme 100% Pure Mulberry Silk Pillowcase',
    category: 'princess_luxury',
    priceDisplay: '$45 Guest-Side MVP',
    badge: '✨ Blowout-Saving Sleepover Touch',
    cheekyPitch:
      'Keeping a genuine 22-momme mulberry silk pillowcase on her side of the bed protects her honey blowout and skin barrier overnight.',
    whyItConverts: 'Thoughtful high-converting sleepover surprise.',
    merchantUrl: 'https://www.amazon.com/dp/B00V5WN3HE',
  },
  {
    id: 'zero-proof-botanical-mocktail-set',
    name: 'Ghia Non-Alcoholic Mediterranean Botanical Apéritif Duo (500ml × 2)',
    category: 'date_night',
    priceDisplay: '$68 Zero-Proof Spritz',
    badge: '🌿 8-Hour Beauty-Sleep Spritz',
    cheekyPitch:
      'Crisp yuzu, rosemary, and bitter gentian over sparkling water, all the candlelit cocktail ritual with zero 7 AM hangover.',
    whyItConverts: 'Cult-favorite non-alcoholic date-night bottle.',
    merchantUrl: 'https://www.amazon.com/dp/B0B545FNBW',
  },
  {
    id: 'fill-in-love-coupon-cards',
    name: '30-Card Fill-In-The-Blank Romantic Date & Favor Voucher Book',
    category: 'funny_cute',
    priceDisplay: '$11 Under-$15 Gem',
    badge: '💌 Handwritten Favor Vouchers',
    cheekyPitch:
      'Write custom IOUs she will actually redeem: "One Full Sunday Car Wash & Espresso Delivery," "Zero-Questions Restaurant Booking," or "Foot Massage During Movie Night."',
    whyItConverts: 'High-conversion stocking stuffer and anniversary add-on.',
    merchantUrl: 'https://www.amazon.com/dp/B0D9LZGXXM',
  },
  {
    id: 'short-leash-leather-dog-leash',
    name: 'Taglory Hand-Braided Leather Dog Leash With Solid Brass Clasp',
    category: 'funny_cute',
    priceDisplay: '$21 Cheeky Pick',
    badge: '🦮 Park-Walk & Inside-Joke Classic',
    cheekyPitch:
      'Built with full-grain braided leather and a 360-degree solid brass clasp for Hampstead park walks, plus an undefeated couples inside joke.',
    whyItConverts: 'Handsome pet upgrade and playful wink.',
    merchantUrl: 'https://www.amazon.com/dp/B0H2XPRGDS',
  },
  {
    id: 'big-carl-giant-wine-glass',
    name: 'Original Big Betty 750ml Full-Bottle XL Stemmed Wine Goblet',
    category: 'funny_cute',
    priceDisplay: '$22 Gag Classic',
    badge: '🍷 Cougar Town "Big Carl" Tribute',
    cheekyPitch:
      'Channel Jules Cobb on patio wine night: technically "just one glass of Pinot Noir" when the crystal goblet holds the entire 750ml bottle.',
    whyItConverts: 'Classic pop-culture tribute gift.',
    merchantUrl: 'https://www.amazon.com/dp/B0053T01UM',
  },
  {
    id: 'chic-candlelit-menu-readers',
    name: 'Madison Avenue Oversized Tortoiseshell Blue-Light & Bistro Glasses',
    category: 'funny_cute',
    priceDisplay: '$19 Bistro Style',
    badge: '👓 Dim-Speakeasy Menu Hero',
    cheekyPitch:
      'Because moody cocktail lounges print menus in six-point grey italics in the dark, and chic Italian-style tortoiseshell frames beat phone flashlights.',
    whyItConverts: 'Relatable fashion-meets-function accessory.',
    merchantUrl: 'https://www.amazon.com/dp/B088JPW8PD',
  },
  {
    id: 'no-hard-feelings-jlaw-prime',
    name: 'No Hard Feelings (Jennifer Lawrence & Andrew Barth Feldman • Prime Video Digital)',
    category: 'cinema_pop_culture',
    priceDisplay: 'Prime Video Rent / Stream',
    badge: '🎬 Montauk Rom-Com Stream',
    cheekyPitch:
      'Stream or digitally rent Jennifer Lawrence and Andrew Barth Feldman’s hilarious Montauk comedy on Prime Video, including that piano-bar rendition of "Maneater."',
    whyItConverts: 'Earns Amazon Digital Video rental/purchase commission and Prime Video trial bounties.',
    merchantUrl: 'https://www.amazon.com/dp/B0BZMJ7K5H',
  },
  {
    id: 'part-of-your-world-book',
    name: 'Part of Your World. Abby Jimenez Bestselling Novel (Kindle & Paperback)',
    category: 'cinema_pop_culture',
    priceDisplay: '$14 Kindle / Book',
    badge: '📚 #1 BookTok Age-Gap Romance',
    cheekyPitch:
      'ER doctor Alexis Montgomery (37) meets small-town carpenter Daniel Grant (28), the gold-standard modern novel on navigating two worlds with heart.',
    whyItConverts: 'Beloved age-gap romance novel recommended at Left Bank Books.',
    merchantUrl: 'https://www.amazon.com/dp/1538704374',
  },
  {
    id: 'babygirl-movie-prime',
    name: 'Babygirl (Nicole Kidman & Harris Dickinson • A24 4K Prime Video Digital)',
    category: 'cinema_pop_culture',
    priceDisplay: 'Prime Video 4K Rent / Buy',
    badge: '🥛 Viral Hotel-Bar Stream',
    cheekyPitch:
      'Digitally rent or stream Halina Reijn’s electric A24 thriller starring Nicole Kidman and Harris Dickinson in 4K UHD on Prime Video, tall glass of milk optional.',
    whyItConverts: 'Instant 4K digital video rental/purchase & Prime Video trial conversion.',
    merchantUrl: 'https://www.amazon.com/dp/B0DD3TTPFS',
  },
  {
    id: 'idea-of-you-movie-book',
    name: 'The Idea of You (Anne Hathaway & Nicholas Galitzine • Prime Video Original)',
    category: 'cinema_pop_culture',
    priceDisplay: 'Included w/ Prime Trial',
    badge: '🎨 Prime Video Exclusive Stream',
    cheekyPitch:
      'Stream Anne Hathaway and Nicholas Galitzine’s Silver Lake-meets-Coachella romance exclusively on Prime Video (included free with a 30-day Prime trial).',
    whyItConverts: 'Prime Video Original exclusive drives Amazon Prime 30-day free-trial bounties.',
    merchantUrl: 'https://www.amazon.com/dp/B0CV72X1BL',
  },
  {
    id: 'bridget-jones-cougar-town-watch',
    name: 'Bridget Jones: Mad About the Boy (Renée Zellweger & Leo Woodall • Prime Video Digital)',
    category: 'cinema_pop_culture',
    priceDisplay: '$3.99 Digital Rent • Prime',
    badge: '🌳 Hampstead Park-Ranger Stream',
    cheekyPitch:
      'Digitally rent or buy Renée Zellweger and Leo Woodall’s hilarious Hampstead Heath Chapter-Two romance instantly on Prime Video.',
    whyItConverts: 'Instant $3.99 Prime Video digital rental companion to Rory’s cameo.',
    merchantUrl: 'https://www.amazon.com/dp/B0DKPH9DN2',
  },
  {
    id: 'the-rebound-zeta-jones-prime',
    name: 'The Rebound (Catherine Zeta-Jones & Justin Bartha • Prime Video Stream & Rent)',
    category: 'cinema_pop_culture',
    priceDisplay: 'Prime Trial or $2.99 HD Rent',
    badge: '🎞️ Manhattan Coffee-Shop Stream',
    cheekyPitch:
      'Stream with a 30-day Prime trial or digitally rent in HD for $2.99: Catherine Zeta-Jones moves above a NYC coffeehouse and falls for 25-year-old Justin Bartha.',
    whyItConverts: 'Triggers Prime 30-day free-trial bounty or instant $2.99 HD digital rental.',
    merchantUrl: 'https://www.amazon.com/dp/B006QSRTWC',
  },
  {
    id: 'linen-picnic-insulated-tote',
    name: 'Woven Wicker Insulated Sunset Picnic Basket & Canvas Tote for Two',
    category: 'date_night',
    priceDisplay: '$39 Date-Night Pick',
    badge: '🧺 Golden-Hour Bluff Date Kit',
    cheekyPitch:
      'Pack chilled Sancerre, ripe figs, and triple-cream brie for an effortless coastal bluff or botanical-garden sunset date.',
    whyItConverts: 'Romantic outdoor date upgrade.',
    merchantUrl: 'https://www.amazon.com/dp/B0GS1TFTY6',
  },
  {
    id: 'velvet-travel-weekender-duffel',
    name: 'Polare 23-Inch Waxed Canvas & Full-Grain Leather Weekender Duffel',
    category: 'hosting_upgrade',
    priceDisplay: '$119 Travel Pick',
    badge: '🧳 Weekend Escape Leather Duffel',
    cheekyPitch:
      'Heavy waxed canvas and saddle leather sized cleanly for pressed linen shirts, cedar parfum, and a spontaneous 48-hour coastal getaway.',
    whyItConverts: 'Handsome weekend travel bag tied to Date #4 epilogues.',
    merchantUrl: 'https://www.amazon.com/dp/B0GTQF7ZK9',
  },
];

const VISUAL_SPEC_BY_ID: Record<string, AffiliateVisualSpec> = {
  'trophy-boyfriend-cooking-apron': {
    motif: 'apron_trophy',
    emoji: '👨‍🍳',
    accentFrom: '#FFF4E6',
    accentTo: '#FDE68A',
    studioLabel: 'Chef Apron',
  },
  'leopard-print-cougar-apron': {
    motif: 'apron_leopard',
    emoji: '🐆',
    accentFrom: '#FEF3C7',
    accentTo: '#FDBA74',
    studioLabel: 'Cougar Print',
  },
  'good-boy-brass-training-clicker': {
    motif: 'clicker_brass',
    emoji: '🔔',
    accentFrom: '#FFE4E6',
    accentTo: '#FDE68A',
    studioLabel: 'Obedience Prop',
  },
  'funny-cougar-stemless-wine-glass': {
    motif: 'wine_goblet',
    emoji: '🍷',
    accentFrom: '#FFE4E6',
    accentTo: '#FECDD3',
    studioLabel: 'Cougar Barware',
  },
  'golden-retriever-boyfriend-mug': {
    motif: 'mug_golden',
    emoji: '🐕',
    accentFrom: '#FEF9C3',
    accentTo: '#FDE68A',
    studioLabel: 'Golden Mug',
  },
  'black-cat-girlfriend-leopard-mug': {
    motif: 'mug_blackcat',
    emoji: '🐈‍⬛',
    accentFrom: '#F3E8FF',
    accentTo: '#FBCFE8',
    studioLabel: 'Black Cat Mug',
  },
  'cougar-hunter-retro-trucker-hat': {
    motif: 'trucker_cap',
    emoji: '🧢',
    accentFrom: '#E0F2FE',
    accentTo: '#BAE6FD',
    studioLabel: 'Retro Cap',
  },
  'houseboy-linen-apron': {
    motif: 'apron_linen',
    emoji: '🥂',
    accentFrom: '#F5F5F4',
    accentTo: '#E7E5E4',
    studioLabel: 'Washed Linen',
  },
  'trail-hydration-vest': {
    motif: 'hydration_vest',
    emoji: '🏔️',
    accentFrom: '#DCFCE7',
    accentTo: '#A7F3D0',
    studioLabel: '6 AM Trail',
  },
  'princess-mulberry-silk-robe': {
    motif: 'silk_robe',
    emoji: '👑',
    accentFrom: '#FCE7F3',
    accentTo: '#FBCFE8',
    studioLabel: '22-Momme Silk',
  },
  'hosting-lidded-bin-soap': {
    motif: 'lidded_bin_soap',
    emoji: '🧴',
    accentFrom: '#F3F4F6',
    accentTo: '#FDE68A',
    studioLabel: 'Lidded Bin',
  },
  'percale-hosting-sheets': {
    motif: 'percale_sheets',
    emoji: '🛏️',
    accentFrom: '#EFF6FF',
    accentTo: '#DBEAFE',
    studioLabel: 'Crisp Percale',
  },
  'date-night-oud-bergamot': {
    motif: 'parfum_bottle',
    emoji: '🌲',
    accentFrom: '#FEF3C7',
    accentTo: '#E5E7EB',
    studioLabel: 'Cedar & Bergamot',
  },
  'espresso-martini-barware': {
    motif: 'copper_shaker',
    emoji: '🍸',
    accentFrom: '#FFEDD5',
    accentTo: '#FDBA74',
    studioLabel: 'Copper Shaker',
  },
  'after-dark-couples-deck': {
    motif: 'card_deck',
    emoji: '🃏',
    accentFrom: '#FFE4E6',
    accentTo: '#DDD6FE',
    studioLabel: 'Couples Deck',
  },
  'cooling-bamboo-sheets': {
    motif: 'cooling_sheets',
    emoji: '❄️',
    accentFrom: '#ECFEFF',
    accentTo: '#CFFAFE',
    studioLabel: 'Cool Sheets',
  },
  'cast-iron-steak-skillet': {
    motif: 'cast_iron',
    emoji: '🥩',
    accentFrom: '#FFEDD5',
    accentTo: '#FECACA',
    studioLabel: '12" Cast Iron',
  },
  'adjustable-dumbbell-bench': {
    motif: 'weight_bench',
    emoji: '🏋️',
    accentFrom: '#F1F5F9',
    accentTo: '#CBD5E1',
    studioLabel: 'Home Bench',
  },
  'cub-grooming-beard-skincare-kit': {
    motif: 'grooming_kit',
    emoji: '💈',
    accentFrom: '#FEF3C7',
    accentTo: '#FDE68A',
    studioLabel: 'Sandalwood Kit',
  },
  'silk-pillowcase-sleepover-duo': {
    motif: 'silk_pillow',
    emoji: '✨',
    accentFrom: '#FDF2F8',
    accentTo: '#FCE7F3',
    studioLabel: '22-Momme Silk',
  },
  'zero-proof-botanical-mocktail-set': {
    motif: 'botanical_elixir',
    emoji: '🌿',
    accentFrom: '#ECFDF5',
    accentTo: '#FBCFE8',
    studioLabel: 'Ghia Apéritif',
  },
  'fill-in-love-coupon-cards': {
    motif: 'love_coupons',
    emoji: '💌',
    accentFrom: '#FFE4E6',
    accentTo: '#FEF3C7',
    studioLabel: 'Love Vouchers',
  },
  'short-leash-leather-dog-leash': {
    motif: 'leash_leather',
    emoji: '🦮',
    accentFrom: '#FEF3C7',
    accentTo: '#FED7AA',
    studioLabel: 'Braided Leash',
  },
  'big-carl-giant-wine-glass': {
    motif: 'wine_goblet',
    emoji: '🍷',
    accentFrom: '#FFE4E6',
    accentTo: '#FDA4AF',
    studioLabel: '750ml "Big Carl"',
  },
  'chic-candlelit-menu-readers': {
    motif: 'menu_readers',
    emoji: '👓',
    accentFrom: '#FEF9C3',
    accentTo: '#FED7AA',
    studioLabel: 'Bistro Readers',
  },
  'no-hard-feelings-jlaw-prime': {
    motif: 'cinema_poster',
    emoji: '🎬',
    accentFrom: '#FEF3C7',
    accentTo: '#FDA4AF',
    studioLabel: 'Montauk Comedy',
  },
  'part-of-your-world-book': {
    motif: 'cinema_poster',
    emoji: '📖',
    accentFrom: '#E0E7FF',
    accentTo: '#FDE68A',
    studioLabel: 'Abby Jimenez',
  },
  'babygirl-movie-prime': {
    motif: 'cinema_poster',
    emoji: '🎬',
    accentFrom: '#FCE7F3',
    accentTo: '#FDE68A',
    studioLabel: 'A24 Cinema Night',
  },
  'idea-of-you-movie-book': {
    motif: 'cinema_poster',
    emoji: '📚',
    accentFrom: '#E0E7FF',
    accentTo: '#FCE7F3',
    studioLabel: 'Robinne Lee',
  },
  'bridget-jones-cougar-town-watch': {
    motif: 'cinema_poster',
    emoji: '🍿',
    accentFrom: '#FFE4E6',
    accentTo: '#FEF3C7',
    studioLabel: 'Rom-Com Night',
  },
  'the-rebound-zeta-jones-prime': {
    motif: 'cinema_poster',
    emoji: '🎞️',
    accentFrom: '#FEF3C7',
    accentTo: '#FBCFE8',
    studioLabel: 'Classic Stream',
  },
  'linen-picnic-insulated-tote': {
    motif: 'picnic_basket',
    emoji: '🧺',
    accentFrom: '#FEF3C7',
    accentTo: '#DCFCE7',
    studioLabel: 'Picnic Basket',
  },
  'velvet-travel-weekender-duffel': {
    motif: 'weekender_bag',
    emoji: '🧳',
    accentFrom: '#F5F5F4',
    accentTo: '#FDE68A',
    studioLabel: 'Leather Weekender',
  },
};

export const AFFILIATE_CATALOG: AffiliateProduct[] = RAW_AFFILIATE_CATALOG.map((item) => {
  const visualSpec = VISUAL_SPEC_BY_ID[item.id] ?? {
    motif: 'card_deck' as const,
    emoji: '✨',
    accentFrom: '#FFF4F7',
    accentTo: '#FDE68A',
    studioLabel: 'Club Pick',
  };
  return {
    ...item,
    visualSpec,
    photoUrl: resolveProductPhotoUrl(item.id),
  };
});

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
  const host = (window.location.hostname || '').toLowerCase();
  if (
    !host ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '[::1]' ||
    host.endsWith('.local')
  ) {
    return false;
  }
  return window.location.protocol === 'https:' || window.location.protocol === 'http:';
}

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

const PRIME_VIDEO_DIGITAL_IDS = new Set([
  'no-hard-feelings-jlaw-prime',
  'babygirl-movie-prime',
  'idea-of-you-movie-book',
  'bridget-jones-cougar-town-watch',
  'the-rebound-zeta-jones-prime',
]);

export function isPrimeVideoDigitalPick(item: Pick<AffiliateProduct, 'id'>): boolean {
  return PRIME_VIDEO_DIGITAL_IDS.has(item.id);
}

export interface ExtraPrimeVideoStreamPick {
  goSlug: string;
  label: string;
  merchantUrl: string;
}

export const EXTRA_TRIVIA_PRIME_VIDEO_STREAMS: Record<string, ExtraPrimeVideoStreamPick> = {
  'stella-groove-jamaica': {
    goSlug: 'stella-groove-prime',
    label: 'How Stella Got Her Groove Back (Prime Video Stream / Rent)',
    merchantUrl: 'https://www.amazon.com/dp/B001LGW1LI',
  },
  'somethings-gotta-give-keanu': {
    goSlug: 'somethings-gotta-give-prime',
    label: 'Something’s Gotta Give (Prime Video & Paramount+ Trial)',
    merchantUrl: 'https://www.amazon.com/dp/B000N90JG8',
  },
  'magic-mike-last-dance-london': {
    goSlug: 'magic-mike-last-dance-prime',
    label: 'Magic Mike’s Last Dance (Prime Video Digital Rent / Stream)',
    merchantUrl: 'https://www.amazon.com/dp/B0B6MKKGP9',
  },
  'cougar-town-big-carl': {
    goSlug: 'cougar-town-prime',
    label: 'Cougar Town Complete Series (Prime Video Digital)',
    merchantUrl: 'https://www.amazon.com/dp/B00RNG9I1G',
  },
};

export function buildPrimeVideoRouteUrl(
  goSlug: string,
  rawAmazonUrl: string,
  placement: string,
  overrides?: AffiliateTagOverrides,
): string {
  const parsed = validateSafeMerchantDomain(rawAmazonUrl);
  const safePlacement = placement.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48) || 'pop_culture';

  if (!overrides && isLiveBrowserEdgeRuntime()) {
    return `/api/go/${encodeURIComponent(goSlug)}?src=${encodeURIComponent(safePlacement)}`;
  }

  const amazonTag = (
    overrides?.amazonAssociateTag ?? MONETIZATION_CONFIG.amazonAssociateTag
  ).trim();
  const subId = (overrides?.partnerSubId ?? MONETIZATION_CONFIG.partnerSubId).trim();

  if (amazonTag) {
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

export function buildPrimeVideoBountyUrl(
  placement: string,
  overrides?: AffiliateTagOverrides,
): string {
  return buildPrimeVideoRouteUrl(
    'prime-video-trial',
    'https://www.amazon.com/amazonprime',
    placement,
    overrides,
  );
}
