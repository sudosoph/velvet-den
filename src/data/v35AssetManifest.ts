export type PortraitExpression = 'neutral' | 'smirk' | 'laugh' | 'blush' | 'icked';

export type HairLook =
  | 'platinum_blonde'
  | 'golden_blonde'
  | 'dirty_blonde'
  | 'mediterranean_dark'
  | 'latin_curls'
  | 'black_athletic'
  | 'east_asian'
  | 'copper_auburn'
  | 'silver_fox'
  | 'brunette_glam'
  | 'south_asian';

export interface CastVisualEntry {
  id: string;
  primaryPortrait: string;
  sixUniquePhotos: [string, string, string, string, string, string];
  hairLook: HairLook;
  role: 'him' | 'her';
}

export const V35_CAST_VISUALS: Record<string, CastVisualEntry> = {
  julian: {
    id: 'julian',
    primaryPortrait: './images/cast/julian-27m.jpg',
    sixUniquePhotos: [
      './images/cast/julian-27m.jpg',
      './images/cast/julian-2.jpg',
      './images/cast/julian-3.jpg',
      './images/cast/julian-4.jpg',
      './images/cast/julian-5.jpg',
      './images/cast/julian-6.jpg',
    ],
    hairLook: 'mediterranean_dark',
    role: 'him',
  },
  soren: {
    id: 'soren',
    primaryPortrait: './images/cast/soren-26m.jpg',
    sixUniquePhotos: [
      './images/cast/soren-26m.jpg',
      './images/cast/soren-2.jpg',
      './images/cast/soren-3.jpg',
      './images/cast/soren-4.jpg',
      './images/cast/soren-5.jpg',
      './images/cast/soren-6.jpg',
    ],
    hairLook: 'platinum_blonde',
    role: 'him',
  },
  miles: {
    id: 'miles',
    primaryPortrait: './images/cast/miles-zaddy-31m.jpg',
    sixUniquePhotos: [
      './images/cast/miles-zaddy-31m.jpg',
      './images/cast/miles-2.jpg',
      './images/cast/miles-3.jpg',
      './images/cast/miles-4.jpg',
      './images/cast/miles-5.jpg',
      './images/cast/miles-6.jpg',
    ],
    hairLook: 'dirty_blonde',
    role: 'him',
  },
  rafael: {
    id: 'rafael',
    primaryPortrait: './images/cast/rafael-hot-26m.jpg',
    sixUniquePhotos: [
      './images/cast/rafael-hot-26m.jpg',
      './images/cast/rafael-2.jpg',
      './images/cast/rafael-3.jpg',
      './images/cast/rafael-4.jpg',
      './images/cast/rafael-5.jpg',
      './images/cast/rafael-6.jpg',
    ],
    hairLook: 'latin_curls',
    role: 'him',
  },
  marcus: {
    id: 'marcus',
    primaryPortrait: './images/cast/marcus-26m.jpg',
    sixUniquePhotos: [
      './images/cast/marcus-26m.jpg',
      './images/cast/marcus-2.jpg',
      './images/cast/marcus-3.jpg',
      './images/cast/marcus-4.jpg',
      './images/cast/marcus-5.jpg',
      './images/cast/marcus-6.jpg',
    ],
    hairLook: 'black_athletic',
    role: 'him',
  },
  rory: {
    id: 'rory',
    primaryPortrait: './images/cast/rory-24m.jpg',
    sixUniquePhotos: [
      './images/cast/rory-24m.jpg',
      './images/cast/rory-2.jpg',
      './images/cast/rory-3.jpg',
      './images/cast/rory-4.jpg',
      './images/cast/rory-5.jpg',
      './images/cast/rory-6.jpg',
    ],
    hairLook: 'golden_blonde',
    role: 'him',
  },
  jin: {
    id: 'jin',
    primaryPortrait: './images/cast/jin-25m.jpg',
    sixUniquePhotos: [
      './images/cast/jin-25m.jpg',
      './images/cast/jin-2.jpg',
      './images/cast/jin-3.jpg',
      './images/cast/jin-4.jpg',
      './images/cast/jin-5.jpg',
      './images/cast/jin-6.jpg',
    ],
    hairLook: 'east_asian',
    role: 'him',
  },
  liam: {
    id: 'liam',
    primaryPortrait: './images/cast/liam-28m.jpg',
    sixUniquePhotos: [
      './images/cast/liam-28m.jpg',
      './images/cast/liam-2.jpg',
      './images/cast/liam-3.jpg',
      './images/cast/liam-4.jpg',
      './images/cast/liam-5.jpg',
      './images/cast/liam-6.jpg',
    ],
    hairLook: 'copper_auburn',
    role: 'him',
  },
  graham: {
    id: 'graham',
    primaryPortrait: './images/cast/chadwick-24m.jpg',
    sixUniquePhotos: [
      './images/cast/chadwick-24m.jpg',
      './images/cast/graham-2.jpg',
      './images/cast/graham-3.jpg',
      './images/cast/graham-4.jpg',
      './images/cast/graham-5.jpg',
      './images/cast/graham-6.jpg',
    ],
    hairLook: 'golden_blonde',
    role: 'him',
  },
  connor: {
    id: 'connor',
    primaryPortrait: './images/cast/connor-bait.jpg',
    sixUniquePhotos: [
      './images/cast/connor-bait.jpg',
      './images/cast/connor-bottle-trap.jpg',
      './images/cast/connor-3.jpg',
      './images/cast/connor-4.jpg',
      './images/cast/connor-5.jpg',
      './images/cast/connor-6.jpg',
    ],
    hairLook: 'dirty_blonde',
    role: 'him',
  },
  devon: {
    id: 'devon',
    primaryPortrait: './images/cast/sam-25m.jpg',
    sixUniquePhotos: [
      './images/cast/sam-25m.jpg',
      './images/cast/devon-2.jpg',
      './images/cast/devon-3.jpg',
      './images/cast/devon-4.jpg',
      './images/cast/devon-5.jpg',
      './images/cast/devon-6.jpg',
    ],
    hairLook: 'dirty_blonde',
    role: 'him',
  },
  elena: {
    id: 'elena',
    primaryPortrait: './images/cast/elena-prof-44f.jpg',
    sixUniquePhotos: [
      './images/cast/elena-prof-44f.jpg',
      './images/cast/elena-2.jpg',
      './images/cast/elena-3.jpg',
      './images/cast/elena-4.jpg',
      './images/cast/elena-5.jpg',
      './images/cast/elena-6.jpg',
    ],
    hairLook: 'golden_blonde',
    role: 'her',
  },
  claire: {
    id: 'claire',
    primaryPortrait: './images/cast/claire-45f.jpg',
    sixUniquePhotos: [
      './images/cast/claire-45f.jpg',
      './images/cast/claire-2.jpg',
      './images/cast/claire-3.jpg',
      './images/cast/claire-4.jpg',
      './images/cast/claire-5.jpg',
      './images/cast/claire-6.jpg',
    ],
    hairLook: 'brunette_glam',
    role: 'her',
  },
  sienna: {
    id: 'sienna',
    primaryPortrait: './images/cast/sienna-38f.jpg',
    sixUniquePhotos: [
      './images/cast/sienna-38f.jpg',
      './images/cast/sienna-2.jpg',
      './images/cast/sienna-3.jpg',
      './images/cast/sienna-4.jpg',
      './images/cast/sienna-5.jpg',
      './images/cast/sienna-6.jpg',
    ],
    hairLook: 'copper_auburn',
    role: 'her',
  },
  priya: {
    id: 'priya',
    primaryPortrait: './images/cast/priya-35f.jpg',
    sixUniquePhotos: [
      './images/cast/priya-35f.jpg',
      './images/cast/priya-2.jpg',
      './images/cast/priya-3.jpg',
      './images/cast/priya-4.jpg',
      './images/cast/priya-5.jpg',
      './images/cast/priya-6.jpg',
    ],
    hairLook: 'south_asian',
    role: 'her',
  },
  summer: {
    id: 'summer',
    primaryPortrait: './images/cast/summer-blonde-33f.jpg',
    sixUniquePhotos: [
      './images/cast/summer-blonde-33f.jpg',
      './images/cast/summer-2.jpg',
      './images/cast/summer-3.jpg',
      './images/cast/summer-4.jpg',
      './images/cast/summer-5.jpg',
      './images/cast/summer-6.jpg',
    ],
    hairLook: 'golden_blonde',
    role: 'her',
  },
  celeste: {
    id: 'celeste',
    primaryPortrait: './images/cast/celeste-62f.jpg',
    sixUniquePhotos: [
      './images/cast/celeste-62f.jpg',
      './images/cast/celeste-2.jpg',
      './images/cast/celeste-3.jpg',
      './images/cast/celeste-4.jpg',
      './images/cast/celeste-5.jpg',
      './images/cast/celeste-6.jpg',
    ],
    hairLook: 'silver_fox',
    role: 'her',
  },
  astrid: {
    id: 'astrid',
    primaryPortrait: './images/cast/astrid-41f.jpg',
    sixUniquePhotos: [
      './images/cast/astrid-41f.jpg',
      './images/cast/astrid-2.jpg',
      './images/cast/astrid-3.jpg',
      './images/cast/astrid-4.jpg',
      './images/cast/astrid-5.jpg',
      './images/cast/astrid-6.jpg',
    ],
    hairLook: 'platinum_blonde',
    role: 'her',
  },
  camila: {
    id: 'camila',
    primaryPortrait: './images/cast/camila-39f.jpg',
    sixUniquePhotos: [
      './images/cast/camila-39f.jpg',
      './images/cast/camila-2.jpg',
      './images/cast/camila-3.jpg',
      './images/cast/camila-4.jpg',
      './images/cast/camila-5.jpg',
      './images/cast/camila-6.jpg',
    ],
    hairLook: 'brunette_glam',
    role: 'her',
  },
  vivienne: {
    id: 'vivienne',
    primaryPortrait: './images/cast/vivienne-61f.jpg',
    sixUniquePhotos: [
      './images/cast/vivienne-61f.jpg',
      './images/cast/vivienne-2.jpg',
      './images/cast/vivienne-3.jpg',
      './images/cast/vivienne-4.jpg',
      './images/cast/vivienne-5.jpg',
      './images/cast/vivienne-6.jpg',
    ],
    hairLook: 'silver_fox',
    role: 'her',
  },
  vanessa: {
    id: 'vanessa',
    primaryPortrait: './images/cast/valentina-glam-44f.jpg',
    sixUniquePhotos: [
      './images/cast/valentina-glam-44f.jpg',
      './images/cast/vanessa-2.jpg',
      './images/cast/vanessa-3.jpg',
      './images/cast/vanessa-4.jpg',
      './images/cast/vanessa-5.jpg',
      './images/cast/vanessa-6.jpg',
    ],
    hairLook: 'brunette_glam',
    role: 'her',
  },
  brooke: {
    id: 'brooke',
    primaryPortrait: './images/cast/brooke-glam-42f.jpg',
    sixUniquePhotos: [
      './images/cast/brooke-glam-42f.jpg',
      './images/cast/brooke-2.jpg',
      './images/cast/brooke-3.jpg',
      './images/cast/brooke-4.jpg',
      './images/cast/brooke-5.jpg',
      './images/cast/brooke-6.jpg',
    ],
    hairLook: 'golden_blonde',
    role: 'her',
  },
};

export const V35_SCENE_BACKDROPS: Record<string, string> = {
  'velvet-room': './images/scenes/velvet-room-bar.jpg',
  'hawthorne-campus': './images/scenes/campus-autumn-sushi.jpg',
  'terminal-b-airport': './images/scenes/terminal-b-arrivals.jpg',
  'havana-salsa': './images/scenes/havana-salsa-studio.jpg',
  'palisades-racquet': './images/scenes/palm-springs-resort.jpg',
  'st-jude-coffee': './images/scenes/cozy-rain-suite.jpg',
  'left-bank-books': './images/scenes/wine-bar-booth.jpg',
  'dawn-lap-pool': './images/scenes/hotel-pool-sauna.jpg',
  cougarmarket: './images/scenes/cougarmarket-wine.jpg',
  'velvet-palms-bbq': './images/scenes/sunday-kitchen-sanctuary.jpg',
};

export const V35_PRODUCT_IMAGES: Record<string, string> = {
  'trophy-boyfriend-cooking-apron': './images/products/trophy-boyfriend-cooking-apron.jpg',
  'leopard-print-cougar-apron': './images/products/leopard-print-cougar-apron.jpg',
  'good-boy-brass-training-clicker': './images/products/good-boy-brass-training-clicker.jpg',
  'funny-cougar-stemless-wine-glass': './images/products/funny-cougar-stemless-wine-glass.jpg',
  'golden-retriever-boyfriend-mug': './images/products/golden-retriever-boyfriend-mug.jpg',
  'black-cat-girlfriend-leopard-mug': './images/products/black-cat-girlfriend-leopard-mug.jpg',
  'cougar-hunter-retro-trucker-hat': './images/products/cougar-hunter-retro-trucker-hat.jpg',
  'houseboy-linen-apron': './images/products/houseboy-linen-apron.jpg',
  'trail-hydration-vest': './images/products/trail-hydration-vest.jpg',
  'princess-mulberry-silk-robe': './images/products/princess-mulberry-silk-robe.jpg',
  'hosting-lidded-bin-soap': './images/products/hosting-lidded-bin-soap.jpg',
  'percale-hosting-sheets': './images/products/percale-hosting-sheets.jpg',
  'date-night-oud-bergamot': './images/products/date-night-oud-bergamot.jpg',
  'espresso-martini-barware': './images/products/espresso-martini-barware.jpg',
  'after-dark-couples-deck': './images/products/after-dark-couples-deck.jpg',
  'cooling-bamboo-sheets': './images/products/cooling-bamboo-sheets.jpg',
  'cast-iron-steak-skillet': './images/products/cast-iron-steak-skillet.jpg',
  'adjustable-dumbbell-bench': './images/products/adjustable-dumbbell-bench.jpg',
  'cub-grooming-beard-skincare-kit': './images/products/cub-grooming-beard-skincare-kit.jpg',
  'silk-pillowcase-sleepover-duo': './images/products/silk-pillowcase-sleepover-duo.jpg',
  'zero-proof-botanical-mocktail-set': './images/products/zero-proof-botanical-mocktail-set.jpg',
  'fill-in-love-coupon-cards': './images/products/fill-in-love-coupon-cards.jpg',
  'short-leash-leather-dog-leash': './images/products/short-leash-leather-dog-leash.jpg',
  'big-carl-giant-wine-glass': './images/products/big-carl-giant-wine-glass.jpg',
  'chic-candlelit-menu-readers': './images/products/chic-candlelit-menu-readers.jpg',
  'no-hard-feelings-jlaw-prime': './images/products/no-hard-feelings-jlaw-prime.jpg',
  'part-of-your-world-book': './images/products/part-of-your-world-book.jpg',
  'babygirl-movie-prime': './images/products/babygirl-movie-prime.jpg',
  'idea-of-you-movie-book': './images/products/idea-of-you-movie-book.jpg',
  'bridget-jones-cougar-town-watch': './images/products/bridget-jones-cougar-town-watch.jpg',
  'the-rebound-zeta-jones-prime': './images/products/the-rebound-zeta-jones-prime.jpg',
  'linen-picnic-insulated-tote': './images/products/linen-picnic-insulated-tote.jpg',
  'velvet-travel-weekender-duffel': './images/products/velvet-travel-weekender-duffel.jpg',
};

const MOTIF_TO_PRODUCT_IMAGE_KEY: Record<string, keyof typeof V35_PRODUCT_IMAGES> = {
  apron_trophy: 'trophy-boyfriend-cooking-apron',
  apron_leopard: 'leopard-print-cougar-apron',
  apron_linen: 'houseboy-linen-apron',
  silk_robe: 'princess-mulberry-silk-robe',
  silk_pillow: 'silk-pillowcase-sleepover-duo',
  percale_sheets: 'percale-hosting-sheets',
  cooling_sheets: 'cooling-bamboo-sheets',
  lidded_bin_soap: 'hosting-lidded-bin-soap',
  copper_shaker: 'espresso-martini-barware',
  wine_goblet: 'funny-cougar-stemless-wine-glass',
  parfum_bottle: 'date-night-oud-bergamot',
  grooming_kit: 'cub-grooming-beard-skincare-kit',
  clicker_brass: 'good-boy-brass-training-clicker',
  leash_leather: 'short-leash-leather-dog-leash',
  mug_golden: 'golden-retriever-boyfriend-mug',
  mug_blackcat: 'black-cat-girlfriend-leopard-mug',
  love_coupons: 'fill-in-love-coupon-cards',
  trucker_cap: 'cougar-hunter-retro-trucker-hat',
  cinema_poster: 'no-hard-feelings-jlaw-prime',
  picnic_basket: 'linen-picnic-insulated-tote',
  weekender_bag: 'velvet-travel-weekender-duffel',
  menu_readers: 'chic-candlelit-menu-readers',
  hydration_vest: 'trail-hydration-vest',
  weight_bench: 'adjustable-dumbbell-bench',
  cast_iron: 'cast-iron-steak-skillet',
  botanical_elixir: 'zero-proof-botanical-mocktail-set',
  card_deck: 'after-dark-couples-deck',
};

export function resolveProductPhotoUrl(motifOrKey: string): string {
  if (motifOrKey in V35_PRODUCT_IMAGES) {
    return V35_PRODUCT_IMAGES[motifOrKey];
  }
  const mappedKey = MOTIF_TO_PRODUCT_IMAGE_KEY[motifOrKey];
  return mappedKey
    ? V35_PRODUCT_IMAGES[mappedKey]
    : V35_PRODUCT_IMAGES['espresso-martini-barware'];
}

export const EXPRESSION_MOTION_PRESETS: Record<
  PortraitExpression,
  { badge: string; particle: string; tintClass: string; motionClass: string }
> = {
  neutral: {
    badge: 'Composed',
    particle: '✨',
    tintClass: 'ring-amber-200/50 shadow-amber-900/20',
    motionClass: 'v35-portrait-breathe',
  },
  smirk: {
    badge: 'Intrigued',
    particle: '😏',
    tintClass: 'ring-amber-400/70 shadow-amber-500/30',
    motionClass: 'v35-portrait-smirk',
  },
  laugh: {
    badge: 'Delighted',
    particle: '🥂',
    tintClass: 'ring-emerald-300/70 shadow-emerald-500/30',
    motionClass: 'v35-portrait-laugh',
  },
  blush: {
    badge: 'Flustered',
    particle: '💗',
    tintClass: 'ring-rose-400/80 shadow-rose-500/40',
    motionClass: 'v35-portrait-blush',
  },
  icked: {
    badge: 'Major Ick',
    particle: '🚩',
    tintClass: 'ring-red-500/80 shadow-red-900/40 grayscale-[25%]',
    motionClass: 'v35-portrait-icked',
  },
};
