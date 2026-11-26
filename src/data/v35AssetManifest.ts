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
  aprons_kitchen: './images/products/aprons-kitchen.jpg',
  silk_robe_pillowcase: './images/products/silk-robe-pillowcase.jpg',
  percale_bamboo_bedding: './images/products/percale-bamboo-bedding.jpg',
  bathroom_bin_soap: './images/products/bathroom-bin-soap.jpg',
  martini_barware_goblet: './images/products/martini-barware-goblet.jpg',
  parfum_grooming: './images/products/parfum-grooming.jpg',
  clicker_leather_leash: './images/products/clicker-leather-leash.jpg',
  mugs_love_coupons: './images/products/mugs-love-coupons.jpg',
  cinema_books: './images/products/cinema-books.jpg',
  weekender_picnic: './images/products/weekender-picnic.jpg',
  menu_readers: './images/products/menu-readers.jpg',
  trail_fitness: './images/products/trail-fitness.jpg',
  cast_iron_skillet: './images/products/cast-iron-skillet.jpg',
  mocktail_card_deck: './images/products/mocktail-card-deck.jpg',
};

const MOTIF_TO_PRODUCT_IMAGE_KEY: Record<string, keyof typeof V35_PRODUCT_IMAGES> = {
  apron_trophy: 'aprons_kitchen',
  apron_leopard: 'aprons_kitchen',
  apron_linen: 'aprons_kitchen',
  silk_robe: 'silk_robe_pillowcase',
  silk_pillow: 'silk_robe_pillowcase',
  percale_sheets: 'percale_bamboo_bedding',
  cooling_sheets: 'percale_bamboo_bedding',
  lidded_bin_soap: 'bathroom_bin_soap',
  copper_shaker: 'martini_barware_goblet',
  wine_goblet: 'martini_barware_goblet',
  parfum_bottle: 'parfum_grooming',
  grooming_kit: 'parfum_grooming',
  clicker_brass: 'clicker_leather_leash',
  leash_leather: 'clicker_leather_leash',
  mug_golden: 'mugs_love_coupons',
  mug_blackcat: 'mugs_love_coupons',
  love_coupons: 'mugs_love_coupons',
  trucker_cap: 'mugs_love_coupons',
  cinema_poster: 'cinema_books',
  picnic_basket: 'weekender_picnic',
  weekender_bag: 'weekender_picnic',
  menu_readers: 'menu_readers',
  hydration_vest: 'trail_fitness',
  weight_bench: 'trail_fitness',
  cast_iron: 'cast_iron_skillet',
  botanical_elixir: 'mocktail_card_deck',
  card_deck: 'mocktail_card_deck',
};

export function resolveProductPhotoUrl(motifOrKey: string): string {
  if (motifOrKey in V35_PRODUCT_IMAGES) {
    return V35_PRODUCT_IMAGES[motifOrKey];
  }
  const mappedKey = MOTIF_TO_PRODUCT_IMAGE_KEY[motifOrKey];
  return mappedKey ? V35_PRODUCT_IMAGES[mappedKey] : V35_PRODUCT_IMAGES.martini_barware_goblet;
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
