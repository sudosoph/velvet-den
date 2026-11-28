import React, { useState } from 'react';
import {
  ArrowBigUp,
  CheckSquare,
  ChevronDown,
  ExternalLink,
  MessageCircle,
  Share2,
  Sparkles,
  Square,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { JOURNAL_ARTICLES } from '../data/journalArticles';
import {
  AFFILIATE_SUPPORT_COPY,
  buildAffiliateUrl,
  getAffiliateById,
  isPrimeVideoDigitalPick,
} from '../lib/affiliates';
import { trackEvent } from '../lib/analytics';
import { sfx } from '../lib/sound';
import { CrowdsourceSubmissionBar } from './CrowdsourceSubmissionBar';
import { ProductVisualThumbnail } from './ProductVisualThumbnail';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

interface VelvetJournalViewProps {
  initialSlug?: string | null;
  onPlayScenario: (episodeId: string) => void;
}

interface ZodiacSignInfo {
  id: string;
  label: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  herVibe: string;
  himVibe: string;
  herAvatar: string;
  herCastName: string;
  himAvatar: string;
  himCastName: string;
}

const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    id: 'aries',
    label: 'Aries',
    symbol: '♈',
    element: 'Fire',
    herVibe: 'Bold trailblazer who loves directness & spontaneous weekend escapes',
    himVibe: 'Protective initiator who books Friday dinner in 90 seconds flat',
    herAvatar: './images/cast/astrid-41f.jpg',
    herCastName: 'Bold Trailblazer',
    himAvatar: './images/cast/marcus-26m.jpg',
    himCastName: 'Fast Initiator',
  },
  {
    id: 'taurus',
    label: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    herVibe: 'Sensory-luxury queen who clocks thread counts, Sancerre & slow touch',
    himVibe: 'Steady linen-apron chef who cooks from scratch & never rushes her pace',
    herAvatar: './images/cast/sienna-38f.jpg',
    herCastName: 'Sensory Luxe',
    himAvatar: './images/cast/rafael-hot-26m.jpg',
    himCastName: 'Linen-Apron Chef',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    symbol: '♊',
    element: 'Air',
    herVibe: 'Quick-witted conversationalist who needs sharp banter before appetizers',
    himVibe: 'Charming storyteller who keeps every museum walk unpredictable',
    herAvatar: './images/cast/elena-prof-44f.jpg',
    herCastName: 'Razor Banter',
    himAvatar: './images/cast/rory-24m.jpg',
    himCastName: 'Witty Raconteur',
  },
  {
    id: 'cancer',
    label: 'Cancer',
    symbol: '♋',
    element: 'Water',
    herVibe: 'Warm sanctuary builder with soft intuition & fierce inner-circle loyalty',
    himVibe: 'Devoted caretaker who remembers her exact morning coffee & shift hours',
    herAvatar: './images/cast/camila-39f.jpg',
    herCastName: 'Warm Sanctuary',
    himAvatar: './images/cast/liam-28m.jpg',
    himCastName: 'Devoted Keeper',
  },
  {
    id: 'leo',
    label: 'Leo',
    symbol: '♌',
    element: 'Fire',
    herVibe: 'Radiant main-character Cougar who thrives on grand chivalry & pride',
    himVibe: 'Sunny, proud +1 who pulls out her chair & beams past every stare',
    herAvatar: './images/cast/brooke-glam-42f.jpg',
    herCastName: 'Main-Character Glow',
    himAvatar: './images/cast/rafael-2.jpg',
    himCastName: 'Proud Plus-One',
  },
  {
    id: 'virgo',
    label: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    herVibe: 'Selective Black-Cat perfectionist who notices spotless counters instantly',
    himVibe: 'Observant Acts-of-Service pro with crisp linens & 62°F sleep precision',
    herAvatar: './images/cast/claire-2.jpg',
    herCastName: 'Selective Poise',
    himAvatar: './images/cast/soren-26m.jpg',
    himCastName: 'Precision Host',
  },
  {
    id: 'libra',
    label: 'Libra',
    symbol: '♎',
    element: 'Air',
    herVibe: 'Effortless Princess-Cougar aesthete drawn to candlelit booths & peonies',
    himVibe: 'Tailored old-soul gentleman with car-door manners & gallery wit',
    herAvatar: './images/cast/celeste-2.jpg',
    herCastName: 'Candlelit Aesthete',
    himAvatar: './images/cast/julian-27m.jpg',
    himCastName: 'Old-Soul Charmer',
  },
  {
    id: 'scorpio',
    label: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    herVibe: 'Magnetic slow-burn powerhouse who sees straight through fake flexing',
    himVibe: 'Locked-in Cub who worships privacy, eye contact & earned trust',
    herAvatar: './images/cast/claire-45f.jpg',
    herCastName: 'Slow-Burn Magnet',
    himAvatar: './images/cast/jin-25m.jpg',
    himCastName: 'Locked-In Focus',
  },
  {
    id: 'sagittarius',
    label: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    herVibe: 'Passport-ready adventurer with zero patience for clinginess or boredom',
    himVibe: 'Upbeat weekend co-pilot ready for 18-hour coastal drives on two hours’ notice',
    herAvatar: './images/cast/elena-6.jpg',
    herCastName: 'Highway 1 Rebel',
    himAvatar: './images/cast/marcus-2.jpg',
    himCastName: 'Weekend Co-Pilot',
  },
  {
    id: 'capricorn',
    label: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    herVibe: 'Corner-office closer who craves turning her decision brain off at 7:30 PM',
    himVibe: 'Composed "Cub Daddy" planner with grown-man follow-through beyond his years',
    herAvatar: './images/cast/claire-3.jpg',
    herCastName: 'Executive Closer',
    himAvatar: './images/cast/miles-zaddy-31m.jpg',
    himCastName: 'Steady Anchor',
  },
  {
    id: 'aquarius',
    label: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    herVibe: 'Unbothered rule-breaker who laughs at every outdated age-gap cliché',
    himVibe: 'Indie creative thinker who loves her mind first & respects her solo space',
    herAvatar: './images/cast/celeste-62f.jpg',
    herCastName: 'Unbothered Icon',
    himAvatar: './images/cast/jin-2.jpg',
    himCastName: 'Indie Creative',
  },
  {
    id: 'pisces',
    label: 'Pisces',
    symbol: '♓',
    element: 'Water',
    herVibe: 'Affectionate romantic who melts for handwritten notes & rainy vinyl mornings',
    himVibe: 'Emotionally fluent sweetheart with 100% phone-down presence after dark',
    herAvatar: './images/cast/sienna-2.jpg',
    herCastName: 'Velvet Romantic',
    himAvatar: './images/cast/julian-2.jpg',
    himCastName: 'Poetic Old Soul',
  },
];

const ELEMENT_BADGE_STYLE: Record<ZodiacSignInfo['element'], string> = {
  Fire: 'bg-amber-100 text-amber-950 border-amber-200',
  Earth: 'bg-stone-100 text-stone-800 border-stone-200',
  Air: 'bg-sky-100 text-sky-900 border-sky-200',
  Water: 'bg-indigo-100 text-indigo-900 border-indigo-200',
};

function computeZodiacPairing(her: ZodiacSignInfo, him: ZodiacSignInfo) {
  const pairKey = `${her.element}-${him.element}`;
  let rating = '93% Slow-Burn Spark';
  let polarity = '✨ Cross-Generational Magnetism';
  let dateIdea = '🍷 Candlelit corner wine booth + unhurried vinyl nightcap';
  let vettingTip = '⏳ Match her texting cadence and let trust build before rushing.';
  let scenePhoto = './images/scenes/wine-bar-booth.jpg';
  let meters = [
    { label: '🔥 Bedroom & Banter Voltage', pct: 93 },
    { label: '🛎️ Friday Planning & Chivalry', pct: 92 },
    { label: '🛋️ Sunday Sanctuary Peace', pct: 94 },
    { label: '🌶️ Slow-Burn Pushback Spark', pct: 91 },
  ];

  if (her.id === him.id) {
    rating = '95% Twin-Mirror Voltage';
    polarity = `🪞 Double ${her.label} Recognition`;
    dateIdea = '🍣 Late-night omakase counter + trading war stories until midnight';
    vettingTip = '⚡ You share identical blind spots, take turns owning Friday reservations!';
    scenePhoto = './images/scenes/campus-autumn-sushi.jpg';
    meters = [
      { label: '🔥 Bedroom & Banter Voltage', pct: 96 },
      { label: '🛎️ Friday Planning & Chivalry', pct: 91 },
      { label: '🛋️ Sunday Sanctuary Peace', pct: 95 },
      { label: '🌶️ Slow-Burn Pushback Spark', pct: 94 },
    ];
  } else if (
    (her.element === 'Fire' && him.element === 'Air') ||
    (her.element === 'Air' && him.element === 'Fire')
  ) {
    rating = '97% High-Octane Banter & Passport Spark';
    polarity = `🔥 ${her.element} × 💨 ${him.element} Combustible Chemistry`;
    dateIdea = '🥂 18-hour boutique hotel rooftop + heated midnight pool escape';
    vettingTip = '📅 Keep banter razor-sharp and lock in Thursday reservations by Tuesday noon.';
    scenePhoto = './images/scenes/hotel-pool-sauna.jpg';
    meters = [
      { label: '🔥 Bedroom & Banter Voltage', pct: 98 },
      { label: '🛎️ Friday Planning & Chivalry', pct: 95 },
      { label: '🛋️ Sunday Sanctuary Peace', pct: 93 },
      { label: '🌶️ Slow-Burn Pushback Spark', pct: 97 },
    ];
  } else if (
    (her.element === 'Earth' && him.element === 'Water') ||
    (her.element === 'Water' && him.element === 'Earth')
  ) {
    rating = '99% Sanctuary & Linen-Apron Soulmate Tier';
    polarity = `🌿 ${her.element} × 🌊 ${him.element} Grounded Devotion`;
    dateIdea = '🍝 Farmers-market figs + handmade Sunday pasta in a 62°F lamp-lit kitchen';
    vettingTip = '💎 Consistency is pure oxygen here, follow through on every small promise.';
    scenePhoto = './images/scenes/sunday-kitchen-sanctuary.jpg';
    meters = [
      { label: '🔥 Bedroom & Banter Voltage', pct: 97 },
      { label: '🛎️ Friday Planning & Chivalry', pct: 99 },
      { label: '🛋️ Sunday Sanctuary Peace', pct: 99 },
      { label: '🌶️ Slow-Burn Pushback Spark', pct: 96 },
    ];
  } else if (
    (her.element === 'Fire' && him.element === 'Earth') ||
    (her.element === 'Earth' && him.element === 'Fire')
  ) {
    rating = '96% Powerhouse × Steady Anchor Polarity';
    polarity = '👑 Glamour Meets Grounded Follow-Through';
    dateIdea = '🍸 6 PM hotel-bar three-olive Gibsons + pre-booked corner banquette';
    vettingTip = '🗝️ Earth handles parking and logistics; Fire brings fearless public pride.';
    scenePhoto = './images/scenes/velvet-room-bar.jpg';
    meters = [
      { label: '🔥 Bedroom & Banter Voltage', pct: 96 },
      { label: '🛎️ Friday Planning & Chivalry', pct: 98 },
      { label: '🛋️ Sunday Sanctuary Peace', pct: 94 },
      { label: '🌶️ Slow-Burn Pushback Spark', pct: 95 },
    ];
  } else if (pairKey === 'Fire-Fire' || pairKey === 'Water-Water') {
    rating = '96% All-In Magnetic Heat';
    polarity = `⚡ Pure ${her.element}-Sign Immersion`;
    dateIdea = '🌴 Top-down Highway 1 sunset drive + oceanfront terrace cocktails';
    vettingTip = '🤝 Zero ego scorekeeping allowed, keep communication candid and generous.';
    scenePhoto = './images/scenes/coastal-convertible.jpg';
    meters = [
      { label: '🔥 Bedroom & Banter Voltage', pct: 99 },
      { label: '🛎️ Friday Planning & Chivalry', pct: 93 },
      { label: '🛋️ Sunday Sanctuary Peace', pct: 92 },
      { label: '🌶️ Slow-Burn Pushback Spark', pct: 97 },
    ];
  } else {
    rating = '94% Black-Cat × Golden-Cub Intrigue';
    polarity = `🐈‍⬛ ${her.label} Poise × 🐕 ${him.label} Curiosity`;
    dateIdea = '🎳 Thursday gallery opening + competitive retro neon bowling nightcap';
    vettingTip = '🎧 Bridge your styles by asking great questions instead of Cubsplaining.';
    scenePhoto = './images/scenes/neon-bowling-lounge.jpg';
    meters = [
      { label: '🔥 Bedroom & Banter Voltage', pct: 94 },
      { label: '🛎️ Friday Planning & Chivalry', pct: 93 },
      { label: '🛋️ Sunday Sanctuary Peace', pct: 92 },
      { label: '🌶️ Slow-Burn Pushback Spark', pct: 96 },
    ];
  }

  return {
    rating,
    polarity,
    dateIdea,
    vettingTip,
    scenePhoto,
    meters,
  };
}

interface GuideVisualMeta {
  categoryPill: string;
  heroPhoto: string;
  sectionPhotos: [string, string, string, string];
  dontText: string;
  doText: string;
  greenFlag: string;
  redFlag: string;
  redditReceipt: {
    handle: string;
    upvotes: string;
    quote: string;
    topReply: string;
  };
  poll: {
    question: string;
    options: [
      { label: string; pct: number },
      { label: string; pct: number },
      { label: string; pct: number },
    ];
  };
}

const GUIDE_VISUAL_BY_SLUG: Record<string, GuideVisualMeta> = {
  'cougar-vs-puma-vs-jaguar-dating-age-chart': {
    categoryPill: '🐆 Subculture Slang • #1 Most Shared',
    heroPhoto: './images/scenes/velvet-room-bar.jpg',
    sectionPhotos: [
      './images/scenes/candlelit-cocktails.jpg',
      './images/scenes/wine-bar-booth.jpg',
      './images/scenes/coastal-convertible.jpg',
      './images/scenes/palm-springs-resort.jpg',
    ],
    dontText: 'ngl never been with a cougar before, bucket list check tonight??',
    doText: 'Booked us the quiet patio booth at 7:30 Friday. Sancerre is already on deck.',
    greenFlag: 'Knows Cougar never means Sugar Mama and takes Friday planning off her plate.',
    redFlag: 'Treats accomplished women like an Xbox achievement badge or expects rent money.',
    redditReceipt: {
      handle: 'u/SilverJaguar_52F • 40s/50s Regular',
      upvotes: '2.4k',
      quote:
        'PSA to every 25M entering the sub: I own my house, my car, and my retirement account. I don’t need a provider OR a dependent. I want a hot, emotionally present man who books a 7:30 table.',
      topReply: '↳ u/HampsteadCub_27M: Printed, framed, and taped above the espresso machine.',
    },
    poll: {
      question: '🗳️ Quick Vibe Vote: Which polarity makes your knees weakest?',
      options: [
        { label: '🥂 Decisive "Cub Daddy" who handles every Friday detail', pct: 46 },
        { label: '👑 Princess Cougar spoiled with peonies & car doors', pct: 34 },
        { label: '😈 Soft Mommy-Domme eyebrow raise & "Good boy"', pct: 20 },
      ],
    },
  },
  'first-time-hosting-older-woman-apartment-checklist': {
    categoryPill: '🏠 Viral 10-Point Hosting Audit',
    heroPhoto: './images/scenes/sunday-kitchen-sanctuary.jpg',
    sectionPhotos: [
      './images/products/hosting-lidded-bin-soap.jpg',
      './images/scenes/luxury-bedroom-sanctuary.jpg',
      './images/scenes/wine-bar-booth.jpg',
      './images/products/golden-retriever-boyfriend-mug.jpg',
    ],
    dontText: 'come thru whenever lol my roommate left dishes in the sink',
    doText: 'Dinner is simmering, lamps are dimmed, and chilled Pellegrino is poured whenever you arrive.',
    greenFlag: 'Lidded bathroom bin, botanical hand soap, four real pillows, and crisp cotton sheets.',
    redFlag: 'Bare floor mattress, neon 5-in-1 shower gel, and harsh surgical ceiling fluorescents.',
    redditReceipt: {
      handle: 'u/ManhattanBeach_46F • Verified Cougar',
      upvotes: '3.1k',
      quote:
        'Walked into a 26-year-old’s studio expecting dorm chaos. Instead: warm table lamps, 64°F AC, Aesop soap, a lidded bathroom bin, and a spare MagSafe cord on my nightstand. Still dating him 14 months later.',
      topReply: '↳ u/SilverLakeWoodworker: That spare nightstand charger has a 100% retention rate.',
    },
    poll: {
      question: '🗳️ Instant Walk-Out Poll: Which apartment crime is the #1 mood killer?',
      options: [
        { label: '🗑️ Unlined wire bathroom bin + damp mystery towel', pct: 52 },
        { label: '🛏️ Single pancaked pillow on shiny polyester sheets', pct: 33 },
        { label: '💡 Blinding overhead "Big Light" left on at 10 PM', pct: 15 },
      ],
    },
  },
  'best-gifts-for-older-woman-girlfriend-dating-guide': {
    categoryPill: '🎁 Gift & Soft-Life Listicles',
    heroPhoto: './images/scenes/palm-springs-resort.jpg',
    sectionPhotos: [
      './images/scenes/sunday-kitchen-sanctuary.jpg',
      './images/products/princess-mulberry-silk-robe.jpg',
      './images/products/date-night-oud-bergamot.jpg',
      './images/scenes/candlelit-cocktails.jpg',
    ],
    dontText: 'i didnt know what to get u since u already buy everything lol',
    doText: 'Remembered the Sicilian olive oil you praised three Tuesdays ago, plus Sunday dinner is on me.',
    greenFlag: 'Gifts tiny personal observations, sensory silk comfort, and homemade Sunday dinners.',
    redFlag: 'Competes insecurely with her salary or panic-buys generic mall clutter.',
    redditReceipt: {
      handle: 'u/PasadenaCourtyard_39F • Interior Designer',
      upvotes: '1.8k',
      quote:
        'He makes a third of what I make, yet gave me the best birthday gift of my life: a $28 bottle of the exact olive oil I mentioned once in October and handmade short-rib ragu in a linen apron.',
      topReply: '↳ u/TraumaRN_36F: Observation > price tags ten times out of ten!!',
    },
    poll: {
      question: '🗳️ Gift Check: What melts a woman who already buys her own luxury bags?',
      options: [
        { label: '🍝 Cooking from scratch + leaving her kitchen spotless', pct: 54 },
        { label: '💐 Remembering an offhand favorite from 3 weeks ago', pct: 31 },
        { label: '🧖‍♀️ 22-momme silk robe + zero-decision weekend getaway', pct: 15 },
      ],
    },
  },
  'millennial-vs-gen-z-age-gap-dating-code-switching': {
    categoryPill: '📱 Generational Texting Decoder',
    heroPhoto: './images/scenes/wine-bar-booth.jpg',
    sectionPhotos: [
      './images/scenes/campus-autumn-sushi.jpg',
      './images/scenes/velvet-room-bar.jpg',
      './images/scenes/neon-bowling-lounge.jpg',
      './images/scenes/candlelit-cocktails.jpg',
    ],
    dontText: 'yo u look crazy good for ur age whats ur snap??',
    doText: 'Here is my cell, free for a quick 6 PM call Thursday before our Friday 7:30 reservation?',
    greenFlag: 'Trades real phone numbers, reads Gen-X punctuation calmly, and confirms at noon.',
    redFlag: 'Asks a 45-year-old executive for Snapchat or spirals over a sincere 👍 emoji.',
    redditReceipt: {
      handle: 'u/LitChair_44F • Gen-X / Xennial Cusp',
      upvotes: '2.9k',
      quote:
        'Sweetest 26-year-old texted asking if I was mad at him because I replied "Sounds good." with a period between budget meetings. Sweetheart, if I were mad, you wouldn’t be getting my Friday night!',
      topReply: '↳ u/GenZ_Paramedic27: Learning that 👍 means "I adore you, see you at 8" saved my life.',
    },
    poll: {
      question: '🗳️ Texting Crime Poll: Fastest way a younger guy fumbles in the DMs?',
      options: [
        { label: '👻 Asking "do u have snap??" past age 23', pct: 58 },
        { label: '💀 Saying "you look amazing for your age!"', pct: 29 },
        { label: '😴 Sending "wyd" at 11:15 PM with zero plan', pct: 13 },
      ],
    },
  },
  'older-woman-younger-man-relationship-problems-kids-stigma': {
    categoryPill: '💬 Real Talk • Stares, Mirrors & Timelines',
    heroPhoto: './images/scenes/cozy-rain-suite.jpg',
    sectionPhotos: [
      './images/scenes/luxury-bedroom-sanctuary.jpg',
      './images/scenes/canyon-sunrise-trail.jpg',
      './images/scenes/wedding-gala-cheers.jpg',
      './images/scenes/sunday-kitchen-sanctuary.jpg',
    ],
    dontText: 'wait are those people at the next table staring at us??',
    doText: 'Let them stare, gives the sommelier an excuse to comp our dessert.',
    greenFlag: 'Talks kids/timelines honestly by Month 3 and holds your hand proudly in daylight.',
    redFlag: 'Avoids future conversations for two years or shrinks back when acquaintances look over.',
    redditReceipt: {
      handle: 'u/LakeZurichEnergy • 14-Yr Gap Married',
      upvotes: '2.2k',
      quote:
        'When a hotel clerk asked if we needed two Queen beds, my 28-year-old partner didn’t flinch, just smiled and said "One King is plenty, thanks." Confidence resets the whole room in three seconds.',
      topReply: '↳ u/CopenhagenArchitect: Deadpan warmth undefeated every single time.',
    },
    poll: {
      question: '🗳️ Public Side-Eye Poll: Best comeback when a waiter stumbles over the gap?',
      options: [
        { label: '🥂 Kiss her hand deadpan & joke into comped Champagne', pct: 61 },
        { label: '😎 Smile unbothered, happy couples don’t explain themselves', pct: 28 },
        { label: '😂 Wink and say "He’s here for my 90s vinyl collection"', pct: 11 },
      ],
    },
  },
  'black-cat-older-woman-golden-retriever-younger-man-dating-guide': {
    categoryPill: '🐈‍⬛ × 🐕 #1 Fan-Favorite Polarity',
    heroPhoto: './images/scenes/candlelit-cocktails.jpg',
    sectionPhotos: [
      './images/products/black-cat-girlfriend-leopard-mug.jpg',
      './images/products/golden-retriever-boyfriend-mug.jpg',
      './images/scenes/cozy-rain-suite.jpg',
      './images/scenes/sunday-kitchen-sanctuary.jpg',
    ],
    dontText: 'fine guess ur too busy for me then!!',
    doText: 'Zero rush at all, held Thursday next week just in case, and my evening stays yours.',
    greenFlag: 'Beams brighter when she paces the first three dates instead of taking boundaries personally.',
    redFlag: 'Sulks, love-bombs, or demands instant girlfriend energy before Date #2.',
    redditReceipt: {
      handle: 'u/GoldenCub_25M • Happily Spoken For',
      upvotes: '3.4k',
      quote:
        'Men her age got intimidated because she didn’t giggle at mediocre jokes on Date 1. Meanwhile, the first Friday she finally kicked off her heels and stole my hoodie felt like winning the Olympics.',
      topReply: '↳ u/BlackCatM_and_A: Earned warmth > cheap flattery forever.',
    },
    poll: {
      question: '🗳️ Polarity Check: Which side of the couch are you in a relationship?',
      options: [
        { label: '🐈‍⬛ Selective Black Cat who melts once trust is earned', pct: 49 },
        { label: '🐕 Sunny Golden Retriever who loves the slow burn', pct: 37 },
        { label: '🥂 Switch, cool in public, pure sap on Sunday morning', pct: 14 },
      ],
    },
  },
  'celebrity-cougars-and-cubs-pop-culture-guide': {
    categoryPill: '✨ Red-Carpet Hall of Fame',
    heroPhoto: './images/scenes/coastal-convertible.jpg',
    sectionPhotos: [
      './images/icons/pop_tina_erwin.jpg',
      './images/icons/pop_cher_icons.jpg',
      './images/icons/pop_sienna_oli.jpg',
      './images/icons/pop_kristin_montana.jpg',
    ],
    dontText: 'wait celebrity age gaps never last more than a summer right??',
    doText: 'Tina Turner & Erwin Bach went 38 years strong, queueing up our Capri era.',
    greenFlag: 'Hypes her spotlight like Nick Jonas, Tom Kaulitz, and Erwin Bach with zero ego.',
    redFlag: 'Gets competitive whenever she earns more or walks into a room as the headliner.',
    redditReceipt: {
      handle: 'u/RedCarpetHistorian • Pop Quiz Ace',
      upvotes: '1.9k',
      quote:
        'Whenever trolls claim woman-older couples are "just a phase," remind them Erwin Bach married Tina Turner 16 years his senior, stayed 38 years, and literally donated his kidney to save her life.',
      topReply: '↳ u/CapriYachtClub: Plus Goldie & Kurt at 42+ years and Julianne Moore at 28+ years!!',
    },
    poll: {
      question: '🗳️ Hall of Fame Vote: Ultimate Patron Couple of Cougars & Cubs Club?',
      options: [
        { label: '👑 Tina Turner & Erwin Bach (16-yr gap • 38 yrs)', pct: 48 },
        { label: '💎 Priyanka Chopra & Nick Jonas / Heidi & Tom', pct: 32 },
        { label: '🎸 Cher ("Mom, I AM a rich man") & Kim K × Lewis Hamilton', pct: 20 },
      ],
    },
  },
  'dating-younger-man-perimenopause-menopause-intimacy': {
    categoryPill: '🌙 62°F Sleep & Candid Intimacy Guide',
    heroPhoto: './images/scenes/luxury-bedroom-sanctuary.jpg',
    sectionPhotos: [
      './images/products/cooling-bamboo-sheets.jpg',
      './images/scenes/hotel-pool-sauna.jpg',
      './images/products/silk-pillowcase-sleepover-duo.jpg',
      './images/scenes/cozy-rain-suite.jpg',
    ],
    dontText: 'why do u have the bedroom AC cranked so cold lol',
    doText: 'Bedroom is pre-chilled to 62°F, cooling bamboo sheets are on, and ice water is on your side.',
    greenFlag: 'Treats 62°F thermostats, breathable bamboo sheets, and unhurried foreplay as standard.',
    redFlag: 'Brings fragile ego into bedroom communication or complains about cool sleep temps.',
    redditReceipt: {
      handle: 'u/JaguarInFullBloom_51F • Verified',
      upvotes: '2.6k',
      quote:
        'My ex acted personally offended by 3 AM hot flashes. My 31-year-old partner bought cooling bamboo sheets before our second weekend and keeps chilled Pellegrino on my nightstand without being asked.',
      topReply: '↳ u/PlayaVistaMedic: Happy, well-rested partner = undefeated Sunday mornings.',
    },
    poll: {
      question: '🗳️ Sacred Sleep Poll: Ideal bedroom temperature for an elite stayover?',
      options: [
        { label: '❄️ Crisp 62°F–64°F + breathable bamboo/linen layers', pct: 67 },
        { label: '🌬️ 65°F–67°F + two separate Scandinavian duvets', pct: 26 },
        { label: '🔥 Over 70°F (straight to Cub Obedience School!)', pct: 7 },
      ],
    },
  },
  'junior-cougar-6-year-age-gap-relationship-guide': {
    categoryPill: '🥂 3-to-9 Year "Junior Cougar" Sweet Spot',
    heroPhoto: './images/scenes/cougarmarket-wine.jpg',
    sectionPhotos: [
      './images/icons/pop_miley_maxx.jpg',
      './images/icons/pop_eva_ryan.jpg',
      './images/icons/pop_cameron_benji.jpg',
      './images/scenes/wedding-gala-cheers.jpg',
    ],
    dontText: 'six years barely even counts as an age gap lol',
    doText: 'You had a parallel-parked car in 2009 while I was in sophomore geometry, definitely counts.',
    greenFlag: 'Blends shared pop-culture overlap with proud public hand-holding and clear timelines.',
    redFlag: 'Uses a smaller gap as an excuse for Peter-Pan laziness or sloppy date planning.',
    redditReceipt: {
      handle: 'u/JuniorCougar_39F • 6-Yr Gap',
      upvotes: '1.5k',
      quote:
        'The 18-year-gap Jaguars tease us at the door, then pour us wine, because 39F × 33M has zero public stares AND all the playful "wait, what grade were you in during 2009?!" comedy.',
      topReply: '↳ u/PalmSpringsDrummer: Miley & Maxx, Eva & Ryan, Cameron & Benji, undefeated lane.',
    },
    poll: {
      question: '🗳️ Gatekeeper Debate: Does a 6-to-8 year woman-older gap get a Club seat?',
      options: [
        { label: '🥂 100% Yes, proud "Junior Cougar" badge unlocked!', pct: 64 },
        { label: '🐆 Honorary Puma/Junior seat (10+ yrs = full Cougar)', pct: 29 },
        { label: '📏 Only if he still opens every car door!', pct: 7 },
      ],
    },
  },
  'older-woman-grown-son-same-age-meeting-parents-guide': {
    categoryPill: '🥂 Grown Kids, Same-Age Moms & Wedding +1s',
    heroPhoto: './images/scenes/wedding-gala-cheers.jpg',
    sectionPhotos: [
      './images/scenes/campus-autumn-sushi.jpg',
      './images/scenes/sunday-kitchen-sanctuary.jpg',
      './images/scenes/wedding-gala-cheers.jpg',
      './images/scenes/wine-bar-booth.jpg',
    ],
    dontText: 'so since im dating ur mom im basically in charge now right??',
    doText: 'Already told my mom all about you, she cannot wait to swap 90s concert stories on Sunday.',
    greenFlag: 'Peer-level warmth with her college/adult kids + prepping his parents a full week ahead.',
    redFlag: 'Playing fake "stepdad" to a 22-year-old or springing a holiday doorway ambush on Mom.',
    redditReceipt: {
      handle: 'u/StanfordLawMom_46F • 20-Yr Gap',
      upvotes: '2.7k',
      quote:
        'My 22-year-old son met my 26-year-old partner at Manhattan Beach brunch. Zero weird authority posturing, they talked surf breaks for twenty minutes and my son texted afterward: "Okay Mom, he’s solid."',
      topReply: '↳ u/Station14Mom_49F: And thank heaven my son prepped me on Tuesday instead of Thanksgiving!',
    },
    poll: {
      question: '🗳️ Milestone Poll: Which real-world boss level felt most nerve-wracking?',
      options: [
        { label: '🥞 Brunch with her adult kid who is within 4 years of you', pct: 44 },
        { label: '🍷 Sunday dinner with his mom who graduated the same year', pct: 35 },
        { label: '💃 First formal wedding slow-dance in front of Table 9', pct: 21 },
      ],
    },
  },
  'spontaneous-weekend-getaway-date-ideas-older-woman-younger-man': {
    categoryPill: '🗺️ Anti-Boring Date Listicles',
    heroPhoto: './images/scenes/campus-autumn-sushi.jpg',
    sectionPhotos: [
      './images/scenes/hotel-pool-sauna.jpg',
      './images/products/linen-picnic-insulated-tote.jpg',
      './images/scenes/neon-bowling-lounge.jpg',
      './images/scenes/coastal-convertible.jpg',
    ],
    dontText: 'wanna just come sit on my couch and scroll streaming menus??',
    doText: 'Packed figs, Brie, and crusty baguette, bluff overlook at 5:30, then neon bowling at 8?',
    greenFlag: 'Beats stiff corporate dinner interviews with playful movement and real planning.',
    redFlag: 'Fake trust-fund flexing or dumping "idk where should we go" onto her Friday.',
    redditReceipt: {
      handle: 'u/FellowshipCub_27M • Early-Career Wins',
      upvotes: '2.1k',
      quote:
        'You don’t need a yacht budget to sweep a 44-year-old executive off her feet. A $35 hand-packed meadow picnic with fresh figs, chilled crisp white, and competitive retro bowling beat every $400 steakhouse.',
      topReply: '↳ u/WestsidePuma_38F: Effort + playfulness > corporate expense-account dinners ALWAYS.',
    },
    poll: {
      question: '🗳️ Friday Date Draft: Pick this weekend’s 5-Star itinerary!',
      options: [
        { label: '🧖‍♀️ 18-hour boutique hotel rooftop + midnight pool & sauna', pct: 51 },
        { label: '🧺 Sunset bluff fig-and-Brie picnic + retro neon bowling', pct: 31 },
        { label: '🍣 Autumn campus stroll + 12-seat sushi/vinyl bar', pct: 18 },
      ],
    },
  },
  'cougar-town-pop-culture-age-gap-dating-history': {
    categoryPill: '🍷 Big Carl & Sitcom History',
    heroPhoto: './images/scenes/canyon-sunrise-trail.jpg',
    sectionPhotos: [
      './images/icons/pop_cougar_town.jpg',
      './images/products/big-carl-giant-wine-glass.jpg',
      './images/scenes/cougarmarket-wine.jpg',
      './images/scenes/wedding-gala-cheers.jpg',
    ],
    dontText: 'arent divorced women in their 40s supposed to stay home quietly??',
    doText: 'Brought Pinot Noir and an oversized Big Carl goblet to toast our six-month mark.',
    greenFlag: 'Celebrates post-divorce joy, loud Cul-de-Sac friendships, and milestone anniversaries.',
    redFlag: 'Treats her second act like something she should tone down or apologize for.',
    redditReceipt: {
      handle: 'u/CulDeSacCrew_43F • Big Carl Owner',
      upvotes: '1.7k',
      quote:
        'Acquaintances gave me and my 28-year-old boyfriend "two fun weekends" right after my divorce finalized. Last Friday we clinked giant Big Carl wine glasses on our two-year anniversary!',
      topReply: '↳ u/PasadenaSam: Living happily ever after is the loudest flex in the zip code.',
    },
    poll: {
      question: '🗳️ Cul-de-Sac Poll: Official beverage vessel for Friday movie night?',
      options: [
        { label: '🍷 Comically oversized "Big Carl" Pinot goblet', pct: 53 },
        { label: '🍸 Ice-cold three-olive Gibson or Espresso Martini', pct: 33 },
        { label: '🌿 Zero-proof yuzu botanical spritz in crystal', pct: 14 },
      ],
    },
  },
  'astrology-zodiac-compatibility-older-woman-younger-man': {
    categoryPill: '🔮 Interactive 12×12 Star-Sign Guide',
    heroPhoto: './images/scenes/havana-salsa-studio.jpg',
    sectionPhotos: [
      './images/scenes/hotel-pool-sauna.jpg',
      './images/scenes/sunday-kitchen-sanctuary.jpg',
      './images/scenes/velvet-room-bar.jpg',
      './images/scenes/coastal-convertible.jpg',
    ],
    dontText: 'astrology is dumb lol anyway wyd tonight',
    doText: 'Texted my mom at lunch for my exact birth minute, tell me our Friday forecast.',
    greenFlag: 'Texts his mom for his exact birth time with playful curiosity and zero eye-rolling.',
    redFlag: 'Launches a 15-minute condescending lecture mocking things she enjoys for fun.',
    redditReceipt: {
      handle: 'u/ScorpioCougar_45F • Taurus Cub Partner',
      upvotes: '2.0k',
      quote:
        'Mentioned Co-Star once over martinis; within four minutes he texted his mom for his hospital birth certificate time. Reader, Scorpio Her × Taurus Cub really IS 99% sanctuary magic.',
      topReply: '↳ u/LeoQueen_48F: Aries/Leo Fire women with grounded Earth Cubs = chef’s kiss.',
    },
    poll: {
      question: '🗳️ Star-Sign Poll: Which Cub element brings the highest Husband/Partner EQ?',
      options: [
        { label: '🌿 Earth Cubs (Taurus, Virgo, Capricorn), culinary & steady', pct: 45 },
        { label: '🌊 Water Cubs (Cancer, Scorpio, Pisces), locked-in devotion', pct: 33 },
        { label: '🔥💨 Fire & Air Cubs, fearless banter & passport energy', pct: 22 },
      ],
    },
  },
  'master-list-cougar-cub-movies-older-woman-younger-man': {
    categoryPill: '🎬 Definitive 22-Film Watchlist',
    heroPhoto: './images/scenes/neon-bowling-lounge.jpg',
    sectionPhotos: [
      './images/products/bridget-jones-cougar-town-watch.jpg',
      './images/products/babygirl-movie-prime.jpg',
      './images/products/the-rebound-zeta-jones-prime.jpg',
      './images/icons/pop_stella_cinema.jpg',
    ],
    dontText: 'never heard of any of those movies lol put on sports highlights',
    doText: 'Chilled two glasses, starting with The Rebound or No Hard Feelings tonight?',
    greenFlag: 'Queues up Stella, Babygirl, or The Rebound with takeout already ordered.',
    redFlag: 'Scrolls streaming menus for 50 minutes until you both fall asleep annoyed.',
    redditReceipt: {
      handle: 'u/CinemaArchivist_41F • 22/22 Watched',
      upvotes: '2.5k',
      quote:
        'Justice for Catherine Zeta-Jones & Justin Bartha in The Rebound (2009)!! Everyone talks about Babygirl and The Idea of You, yet 25-year-old coffee-shop Aram wrote the Golden-Retriever Cub blueprint.',
      topReply: '↳ u/HampsteadRoxster: Pairing The Rebound + Bridget Jones: Mad About the Boy this Friday!',
    },
    poll: {
      question: '🗳️ Cinema Crown Poll: Pick the #1 Watch-Night Essential!',
      options: [
        { label: '🥛 Babygirl / The Idea of You (high-voltage streaming era)', pct: 42 },
        { label: '😂 No Hard Feelings / Bridget Jones: Mad About the Boy', pct: 33 },
        { label: '👑 How Stella Got Her Groove Back / The Rebound classics', pct: 25 },
      ],
    },
  },
  'movies-like-babygirl-idea-of-you-bridget-jones-older-woman-younger-man': {
    categoryPill: '🍿 Friday Watch-Night Pairing Guide',
    heroPhoto: './images/scenes/hotel-pool-sauna.jpg',
    sectionPhotos: [
      './images/products/babygirl-movie-prime.jpg',
      './images/products/idea-of-you-movie-book.jpg',
      './images/products/bridget-jones-cougar-town-watch.jpg',
      './images/scenes/cozy-rain-suite.jpg',
    ],
    dontText: 'idk pick whatever movie u want i guess',
    doText: 'Want hotel-bar tension (Babygirl), vacation glow (Stella), or London laughs (Bridget)?',
    greenFlag: 'Matches the movie vibe to her week, escapism after chaos, tension on date night.',
    redFlag: 'Spoils the ending ten minutes in or checks work Slack during the best scene.',
    redditReceipt: {
      handle: 'u/HalinaBarScene • Hotel-Bar Regular',
      upvotes: '1.9k',
      quote:
        'Learning that director Halina Reijn borrowed the Babygirl hotel-bar drink send from a real younger actor in Brussels made that scene ten times hotter.',
      topReply: '↳ u/MarlowLoungeBartender: Three-olive Gibson orders jumped 300% this year.',
    },
    poll: {
      question: '🗳️ Mood Matcher: Which Friday watch-night energy are you picking tonight?',
      options: [
        { label: '🍸 High-voltage hotel-bar tension (Babygirl / White Palace)', pct: 44 },
        { label: '🌴 Sun-drenched vacation chemistry (Stella / Idea of You)', pct: 34 },
        { label: '🧣 Cozy witty rom-com (Bridget Jones / The Rebound)', pct: 22 },
      ],
    },
  },
  'how-to-meet-older-women-in-the-wild-hotel-bar-gym-etiquette': {
    categoryPill: '🗺️ IRL "In The Wild" Field Manual',
    heroPhoto: './images/scenes/terminal-b-arrivals.jpg',
    sectionPhotos: [
      './images/scenes/canyon-sunrise-trail.jpg',
      './images/scenes/velvet-room-bar.jpg',
      './images/scenes/cougarmarket-wine.jpg',
      './images/scenes/havana-salsa-studio.jpg',
    ],
    dontText: 'hey wave wave take off ur headphones mid-squat real quick!!',
    doText: 'Waited until you wrapped up at the smoothie counter. I’m Marcus, by the way.',
    greenFlag: 'Respects the sacred gym headphone rule, builds warm familiarity, and never Cubsplains.',
    redFlag: 'Interrupts her workout mid-set or lectures her on wine tannins she mastered in 2005.',
    redditReceipt: {
      handle: 'u/DawnLapPool_42F • Met IRL',
      upvotes: '3.0k',
      quote:
        'He reracked his weights cleanly and shared a polite nod for three straight weeks without interrupting my headphones once. The morning my AirPods came out at the coffee counter, he introduced himself, smooth as silk.',
      topReply: '↳ u/RacquetClubSøren: Situational awareness beats pickup lines 100% of the time.',
    },
    poll: {
      question: '🗳️ IRL Venue Poll: Highest-success "In The Wild" spot to meet organically?',
      options: [
        { label: '🍸 Upscale hotel lobby bar or wine tasting (6–8:30 PM)', pct: 49 },
        { label: '🎾 Racquet club, run club, or post-workout smoothie bar', pct: 32 },
        { label: '📚 Independent bookstore, museum night, or salsa class', pct: 19 },
      ],
    },
  },
};

function getGuideVisualMeta(slug: string): GuideVisualMeta {
  return (
    GUIDE_VISUAL_BY_SLUG[slug] ??
    GUIDE_VISUAL_BY_SLUG['cougar-vs-puma-vs-jaguar-dating-age-chart']
  );
}

const SECTION_EMOJIS = ['🔥', '💡', '🥂', '👑'];

function splitIntoScannableBeats(body: string): string[] {
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length > 1) {
    return lines.map((l) => l.replace(/^[•-]\s*/, ''));
  }
  const sentences = body
    .split(/(?<=[.!?])\s+(?=[A-Z"“‘(0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.length > 0 ? sentences : [body];
}

const CHECKLIST_INLINE_PRODUCT_IDS: string[] = [
  'hosting-lidded-bin-soap',
  'hosting-lidded-bin-soap',
  'cub-grooming-beard-skincare-kit',
  'percale-hosting-sheets',
  'percale-hosting-sheets',
  'cooling-bamboo-sheets',
  'espresso-martini-barware',
  'zero-proof-botanical-mocktail-set',
  'silk-pillowcase-sleepover-duo',
  'golden-retriever-boyfriend-mug',
];

const MOVIE_WATCHLIST_IDS = [
  'no-hard-feelings-jlaw-prime',
  'babygirl-movie-prime',
  'idea-of-you-movie-book',
  'bridget-jones-cougar-town-watch',
  'the-rebound-zeta-jones-prime',
];

const HOSTING_STORAGE_KEY = 'cc_hosting_10pt_v1';

function loadHostingChecks(): number[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(HOSTING_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

export const VelvetJournalView: React.FC<VelvetJournalViewProps> = ({
  initialSlug,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialSlug && JOURNAL_ARTICLES.some((a) => a.slug === initialSlug)
      ? initialSlug
      : JOURNAL_ARTICLES[0].slug,
  );
  const [astroOpen, setAstroOpen] = useState<boolean>(
    initialSlug === 'astrology-zodiac-compatibility-older-woman-younger-man',
  );
  const [hostingChecks, setHostingChecks] = useState<number[]>(() => loadHostingChecks());
  const [herSignId, setHerSignId] = useState<string>('scorpio');
  const [himSignId, setHimSignId] = useState<string>('taurus');
  const [pollVotesBySlug, setPollVotesBySlug] = useState<Record<string, number>>({});
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  const active =
    JOURNAL_ARTICLES.find((a) => a.slug === selectedSlug) ?? JOURNAL_ARTICLES[0];
  const visualMeta = getGuideVisualMeta(active.slug);
  const showAstroMatcher =
    astroOpen || active.slug === 'astrology-zodiac-compatibility-older-woman-younger-man';

  const handleSelectArticle = (slug: string) => {
    setSelectedSlug(slug);
    if (slug === 'astrology-zodiac-compatibility-older-woman-younger-man') {
      setAstroOpen(true);
    }
    trackEvent('guide_opened', { slug });
  };

  const toggleHostingCheck = (idx: number) => {
    sfx.messagePop();
    const next = hostingChecks.includes(idx)
      ? hostingChecks.filter((i) => i !== idx)
      : [...hostingChecks, idx];
    setHostingChecks(next);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(HOSTING_STORAGE_KEY, JSON.stringify(next));
      }
    } catch {
      // Ignore storage block
    }
  };

  const herSign = ZODIAC_SIGNS.find((s) => s.id === herSignId) ?? ZODIAC_SIGNS[7];
  const himSign = ZODIAC_SIGNS.find((s) => s.id === himSignId) ?? ZODIAC_SIGNS[1];
  const zodiacMatch = computeZodiacPairing(herSign, himSign);

  const handleShareGuide = () => {
    const guideUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}guides/${active.slug}/`;
    setSharePayload({
      title: active.headline,
      message: `📖 Cougars & Cubs Club Guide: "${active.headline}" (${active.readTime})`,
      url: guideUrl,
      shareSurface: 'guide',
      discordMarkdown: `**📖 ${active.headline}** (${active.readTime})\n${active.metaDescription}\nRead & play scenario: ${guideUrl}`,
    });
  };

  const handleShareZodiac = () => {
    const astroUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?journal=astrology-zodiac-compatibility-older-woman-younger-man`;
    setSharePayload({
      title: `${herSign.symbol} ${herSign.label} Her × ${himSign.symbol} ${himSign.label} Cub`,
      message: `🔮 Cougars & Cubs Astro Match: ${herSign.symbol} ${herSign.label} Her × ${himSign.symbol} ${himSign.label} Cub, ${zodiacMatch.rating}! Test your signs:`,
      url: astroUrl,
      shareSurface: 'guide',
      discordMarkdown: `**🔮 ${herSign.symbol} ${herSign.label} Her × ${himSign.symbol} ${himSign.label} Cub, ${zodiacMatch.rating}**\n${zodiacMatch.dateIdea}\nTest your signs: ${astroUrl}`,
    });
  };

  const isMovieGuide =
    active.slug === 'master-list-cougar-cub-movies-older-woman-younger-man' ||
    active.slug === 'movies-like-babygirl-idea-of-you-bridget-jones-older-woman-younger-man';

  const selectedPollIdx = pollVotesBySlug[active.slug];

  return (
    <>
      <div className="w-full space-y-5 animate-stage-in">
        {/* Clean Standalone Magazine Header (Zero Unrelated Game Buttons) */}
        <div className="space-y-4 border-b border-zinc-200 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Cougars &amp; Cubs Magazine
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
                Playful Photo Listicles &amp; Subculture Field Notes
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setAstroOpen((v) => !v)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100 px-3.5 text-xs sm:text-sm font-semibold text-zinc-950 cursor-pointer transition-colors"
              >
                <span>
                  🔮 Quick Astro: {herSign.symbol} × {himSign.symbol}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-rose-600 transition-transform ${
                    showAstroMatcher ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={handleShareGuide}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 cursor-pointer"
              >
                <Share2 className="h-4 w-4 text-zinc-500" />
                <span>Share Listicle</span>
              </button>
            </div>
          </div>

          {/* 1-Tap Jump Bar (Clean Editorial Underline Tabs) */}
          <div className="flex flex-wrap items-center gap-6 border-b border-zinc-200">
            {[
              {
                slug: 'cougar-vs-puma-vs-jaguar-dating-age-chart',
                label: '🐆 Feline Age Chart',
              },
              {
                slug: 'first-time-hosting-older-woman-apartment-checklist',
                label: '🏠 10-Pt Apartment Audit',
              },
              {
                slug: 'master-list-cougar-cub-movies-older-woman-younger-man',
                label: '🎬 22-Film Watchlist',
              },
              {
                slug: 'celebrity-cougars-and-cubs-pop-culture-guide',
                label: '✨ Celeb Hall of Fame',
              },
              {
                slug: 'astrology-zodiac-compatibility-older-woman-younger-man',
                label: '🔮 12×12 Astro Matcher',
              },
            ].map((pill) => {
              const isCurrent = active.slug === pill.slug;
              return (
                <button
                  key={pill.slug}
                  type="button"
                  onClick={() => handleSelectArticle(pill.slug)}
                  className={`pb-3 text-sm whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                    isCurrent
                      ? 'border-rose-600 font-semibold text-zinc-950'
                      : 'border-transparent font-medium text-zinc-500 hover:text-zinc-950'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* On-Demand Quick Astro Pairing Toy: Opens When Toggled or on the Astrology Guide */}
        {showAstroMatcher && (
          <section
            className="rounded-2xl border border-rose-200 bg-gradient-to-br from-[#FFFDF9] via-rose-50/40 to-amber-50/40 p-4 sm:p-5 space-y-4 shadow-2xs"
            data-testid="zodiac-12x12-matcher"
          >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-xs font-extrabold uppercase text-amber-950">
                <Sparkles className="h-3.5 w-3.5 text-rose-600" /> Quick Astro Pairing
              </span>
              <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#18101E]">
                🔮 {herSign.symbol} {herSign.label} Her × {himSign.symbol} {himSign.label} Cub
              </h2>
              <span className="rounded-full bg-gradient-to-r from-rose-600 to-amber-500 px-3 py-0.5 text-xs font-extrabold text-white">
                💘 {zodiacMatch.rating}
              </span>
            </div>
            <button
              type="button"
              onClick={handleShareZodiac}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#18101E] px-3.5 py-1.5 text-xs font-extrabold text-white hover:bg-stone-800 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-amber-300" />
              <span>Share Astro Card</span>
            </button>
          </div>

          {/* 1-Tap Sign Pickers */}
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-rose-200/80 bg-white p-3 space-y-2">
              <label className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-rose-700">
                  🐆 Her Star Sign
                </span>
                <select
                  aria-label="Her Star Sign"
                  value={herSignId}
                  onChange={(e) => {
                    sfx.messagePop();
                    setHerSignId(e.target.value);
                  }}
                  className="rounded-lg border border-zinc-300 bg-zinc-50 px-2 py-1 text-xs font-bold text-zinc-950"
                >
                  {ZODIAC_SIGNS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.symbol} {s.label} ({s.element})
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-6 gap-1">
                {ZODIAC_SIGNS.map((s) => {
                  const activeChip = s.id === herSignId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      data-testid={`her-sign-chip-${s.id}`}
                      onClick={() => {
                        sfx.messagePop();
                        setHerSignId(s.id);
                      }}
                      className={`flex flex-col items-center justify-center rounded-lg border py-1 px-1 text-[11px] font-semibold transition cursor-pointer ${
                        activeChip
                          ? 'border-rose-600 bg-rose-600 text-white'
                          : 'border-zinc-200 bg-zinc-50/70 text-zinc-900 hover:border-rose-300'
                      }`}
                    >
                      <span className="text-xs leading-none">{s.symbol}</span>
                      <span className="mt-0.5 truncate max-w-full">{s.label.slice(0, 3)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-3 space-y-2">
              <label className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-zinc-950">
                  🐕 His Star Sign
                </span>
                <select
                  aria-label="His Star Sign"
                  value={himSignId}
                  onChange={(e) => {
                    sfx.messagePop();
                    setHimSignId(e.target.value);
                  }}
                  className="rounded-lg border border-zinc-300 bg-zinc-50 px-2 py-1 text-xs font-bold text-zinc-950"
                >
                  {ZODIAC_SIGNS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.symbol} {s.label} ({s.element})
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-6 gap-1">
                {ZODIAC_SIGNS.map((s) => {
                  const activeChip = s.id === himSignId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      data-testid={`him-sign-chip-${s.id}`}
                      onClick={() => {
                        sfx.messagePop();
                        setHimSignId(s.id);
                      }}
                      className={`flex flex-col items-center justify-center rounded-lg border py-1 px-1 text-[11px] font-semibold transition cursor-pointer ${
                        activeChip
                          ? 'border-zinc-950 bg-zinc-950 text-white'
                          : 'border-zinc-200 bg-zinc-50/70 text-zinc-900 hover:border-zinc-400'
                      }`}
                    >
                      <span className="text-xs leading-none">{s.symbol}</span>
                      <span className="mt-0.5 truncate max-w-full">{s.label.slice(0, 3)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Crisp Visual Polarity Readout + 4 Compatibility Meters */}
          <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr] items-stretch">
            <div className="grid gap-2.5 sm:grid-cols-3 items-stretch">
              <div className="flex items-center gap-2.5 rounded-xl border border-rose-100 bg-white p-2.5">
                <img
                  src={herSign.herAvatar}
                  alt={`${herSign.label} Her vibe`}
                  className="h-12 w-12 shrink-0 rounded-xl object-cover object-top border border-rose-200"
                />
                <div className="min-w-0 space-y-0.5">
                  <span
                    className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${ELEMENT_BADGE_STYLE[herSign.element]}`}
                  >
                    {herSign.symbol} {herSign.herCastName}
                  </span>
                  <p className="text-[11px] font-medium text-zinc-700 leading-snug line-clamp-2">
                    {herSign.herVibe}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-white p-2.5">
                <img
                  src={himSign.himAvatar}
                  alt={`${himSign.label} Cub vibe`}
                  className="h-12 w-12 shrink-0 rounded-xl object-cover object-top border border-stone-300"
                />
                <div className="min-w-0 space-y-0.5">
                  <span
                    className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${ELEMENT_BADGE_STYLE[himSign.element]}`}
                  >
                    {himSign.symbol} {himSign.himCastName}
                  </span>
                  <p className="text-[11px] font-medium text-zinc-700 leading-snug line-clamp-2">
                    {himSign.himVibe}
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-amber-200 min-h-[76px]">
                <img
                  src={zodiacMatch.scenePhoto}
                  alt="Ideal date setting"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18101E]/85 via-[#18101E]/25 to-transparent flex items-end p-2.5">
                  <p className="text-[11px] font-bold text-white leading-snug">
                    {zodiacMatch.dateIdea}
                  </p>
                </div>
              </div>
            </div>

            <div
              data-testid="zodiac-meter-grid"
              className="grid grid-cols-2 gap-2 rounded-xl border border-stone-200 bg-white p-3"
            >
              {zodiacMatch.meters.map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#18101E]">
                    <span className="truncate">{m.label}</span>
                    <span className="text-rose-700 shrink-0">{m.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-300"
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-[290px_1fr] items-start">
          {/* Illustrated Sidebar With Thumbnail Previews */}
          <aside className="editorial-hinge-card rounded-2xl bg-white p-3.5 space-y-2 lg:sticky lg:top-20 max-h-[82vh] overflow-y-auto">
            <div className="px-2 pb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
              All {JOURNAL_ARTICLES.length} Club Guides
            </div>
            <div className="space-y-1">
              {JOURNAL_ARTICLES.map((art, idx) => {
                const isSelected = art.slug === active.slug;
                const artMeta = getGuideVisualMeta(art.slug);
                return (
                  <button
                    key={art.slug}
                    type="button"
                    onClick={() => handleSelectArticle(art.slug)}
                    className={`w-full flex items-center gap-2.5 rounded-xl p-2 text-left text-xs font-medium whitespace-normal transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-950 text-white'
                        : 'bg-white text-zinc-800 hover:bg-zinc-50'
                    }`}
                  >
                    <img
                      src={artMeta.heroPhoto}
                      alt=""
                      loading="lazy"
                      className="h-11 w-11 shrink-0 rounded-lg object-cover object-top"
                    />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div
                        className={`text-xs font-semibold ${
                          isSelected ? 'text-rose-400' : 'text-zinc-400'
                        }`}
                      >
                        #{String(idx + 1).padStart(2, '0')} • {art.readTime}
                      </div>
                      <div className="leading-snug line-clamp-2">{art.seoTitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <article className="editorial-hinge-card rounded-2xl bg-white p-5 sm:p-8 space-y-7">
            {/* Editorial Magazine Header + 16:9 Widescreen Hero Photo */}
            <header className="space-y-4 border-b border-zinc-200 pb-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
                <span>{visualMeta.categoryPill}</span>
                <span className="text-zinc-300">/</span>
                <span className="text-zinc-500">{active.readTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
                {active.headline}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-zinc-600">
                {active.intro}
              </p>
              <div className="overflow-hidden rounded-2xl border border-zinc-200 aspect-[16/9] bg-zinc-950">
                <img
                  src={visualMeta.heroPhoto}
                  alt={active.headline}
                  data-testid="guide-hero-photo"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </header>

            {/* Interactive 10-Point Apartment Hosting Checklist (On Hosting Guide Only) */}
            {active.checklistItems && active.checklistItems.length > 0 && (
              <div
                data-testid="guide-hosting-checklist"
                className="rounded-2xl border border-amber-300 bg-amber-50/50 p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-200/80 px-2.5 py-0.5 text-xs font-extrabold uppercase text-amber-950">
                      <Sparkles className="h-3.5 w-3.5" /> Interactive 10-Point Audit
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-zinc-950">
                      Check Off All {active.checklistItems.length} Hosting Essentials
                    </h3>
                  </div>
                  <div className="rounded-full border border-zinc-300 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-zinc-950">
                    {hostingChecks.length}/{active.checklistItems.length} Ready
                  </div>
                </div>
                <div className="grid gap-2">
                  {active.checklistItems.map((itemText, idx) => {
                    const checked = hostingChecks.includes(idx);
                    const linkedProduct = getAffiliateById(
                      CHECKLIST_INLINE_PRODUCT_IDS[idx] ?? 'hosting-lidded-bin-soap',
                    );
                    return (
                      <div
                        key={itemText}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                          checked
                            ? 'border-zinc-900 bg-amber-50 text-zinc-950 font-bold'
                            : 'border-zinc-200 bg-white text-zinc-900 font-medium'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleHostingCheck(idx)}
                          className="flex items-start gap-2.5 text-left whitespace-normal cursor-pointer flex-1"
                        >
                          {checked ? (
                            <CheckSquare className="h-4 w-4 shrink-0 text-zinc-950 mt-0.5" />
                          ) : (
                            <Square className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
                          )}
                          <span>
                            <strong className="mr-1.5">#{idx + 1}.</strong>
                            {itemText}
                          </span>
                        </button>
                        {linkedProduct && (
                          <a
                            href={buildAffiliateUrl(linkedProduct, `checklist_row_${idx + 1}`)}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="shrink-0 inline-flex items-center gap-1 rounded-full bg-zinc-100 hover:bg-zinc-950 hover:text-white px-3 py-1 text-[11px] font-bold text-zinc-900 transition"
                          >
                            <span>🛍️ See Pick</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Uninterrupted Numbered Photo Listicle Stream (01, 02, 03...) */}
            <div className="space-y-6">
              {active.sections.map((sec, idx) => {
                const photoUrl =
                  visualMeta.sectionPhotos[idx % visualMeta.sectionPhotos.length];
                const cleanHeading = sec.heading.replace(/^\d+\.\s*/, '');
                const emoji = SECTION_EMOJIS[idx % SECTION_EMOJIS.length];
                const hasExplicitBullets = sec.body.includes('\n•');
                const beats = splitIntoScannableBeats(sec.body);

                return (
                  <section
                    key={sec.heading}
                    data-testid="guide-section-visual-card"
                    className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xs"
                  >
                    <div className="grid md:grid-cols-[240px_1fr] items-stretch">
                      <div className="relative min-h-[190px] bg-zinc-950">
                        <img
                          src={photoUrl}
                          alt={cleanHeading}
                          className="h-full w-full object-cover object-center"
                        />
                        <div className="absolute top-3 left-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950/90 text-xs font-extrabold text-white shadow-xs">
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 space-y-2.5 flex flex-col justify-center">
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 leading-snug">
                          {emoji} {cleanHeading}
                        </h3>
                        {hasExplicitBullets ? (
                          <ul className="space-y-2">
                            {beats.map((beat, bIdx) => (
                              <li
                                key={bIdx}
                                className="flex items-start gap-2 text-sm leading-relaxed text-zinc-700"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600" />
                                <span>{beat}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                            {sec.body}
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Post-Listicle Quick Laughs: Overheard Texts + Reader Receipt Side-by-Side */}
            <div className="grid gap-4 lg:grid-cols-2 border-t border-zinc-200 pt-6">
              <div
                data-testid="guide-text-this-not-that"
                className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-950">
                    <MessageCircle className="h-3.5 w-3.5 text-[#007AFF]" />
                    <span>Text This, Not That</span>
                  </div>
                  <span className="text-[11px] font-medium text-zinc-400">iMessage</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="self-start max-w-[92%] rounded-2xl rounded-bl-sm bg-[#E9E9EB] px-3.5 py-2 text-xs sm:text-sm font-medium text-zinc-900">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-500 mb-0.5">
                      Left on Read
                    </div>
                    &ldquo;{visualMeta.dontText}&rdquo;
                  </div>

                  <div className="self-end max-w-[92%] rounded-2xl rounded-br-sm bg-[#007AFF] px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-2xs">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-sky-100 mb-0.5">
                      Gets the Friday Table ✓
                    </div>
                    &ldquo;{visualMeta.doText}&rdquo;
                  </div>
                </div>
              </div>

              <div
                data-testid="guide-reddit-receipt"
                className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5 flex flex-col justify-between gap-2.5"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-zinc-950">
                      <span className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        Top Comment
                      </span>
                      <span>{visualMeta.redditReceipt.handle}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500">
                      <ArrowBigUp className="h-4 w-4 text-rose-600" />
                      <span>{visualMeta.redditReceipt.upvotes}</span>
                    </span>
                  </div>
                  <p className="text-sm font-medium text-zinc-900 leading-relaxed">
                    &ldquo;{visualMeta.redditReceipt.quote}&rdquo;
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600">
                  {visualMeta.redditReceipt.topReply}
                </div>
              </div>
            </div>

            {/* Interactive 1-Tap Club Poll */}
            <div
              data-testid="guide-club-poll"
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                  5-Second Club Poll
                </span>
                <span className="text-xs font-medium text-zinc-500">
                  {selectedPollIdx !== undefined
                    ? '✓ Vote Counted • Live Club Split'
                    : 'Tap an answer to see how the Club voted'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">
                {visualMeta.poll.question}
              </h3>
              <div className="grid gap-2">
                {visualMeta.poll.options.map((opt, oIdx) => {
                  const hasVoted = selectedPollIdx !== undefined;
                  const isPicked = selectedPollIdx === oIdx;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        sfx.messagePop();
                        setPollVotesBySlug((prev) => ({ ...prev, [active.slug]: oIdx }));
                      }}
                      className={`relative overflow-hidden rounded-2xl border px-4 py-2.5 text-left text-xs sm:text-sm font-bold transition cursor-pointer ${
                        isPicked
                          ? 'border-rose-600 bg-rose-50 text-[#18101E] shadow-xs'
                          : 'border-stone-200 bg-white text-[#18101E] hover:border-stone-400'
                      }`}
                    >
                      {hasVoted && (
                        <div
                          className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                            isPicked ? 'bg-rose-200/60' : 'bg-stone-100'
                          }`}
                          style={{ width: `${opt.pct}%` }}
                        />
                      )}
                      <div className="relative flex items-center justify-between gap-3">
                        <span>
                          {isPicked ? '✓ ' : ''}
                          {opt.label}
                        </span>
                        {hasVoted && (
                          <span className="shrink-0 font-extrabold text-rose-700">
                            {opt.pct}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shoppable Cinema Watchlist Strip on Movie Guides (Direct Title Links Only) */}
            {isMovieGuide && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 sm:p-5 space-y-3">
                <div className="text-xs font-extrabold uppercase tracking-wider text-rose-800">
                  🎬 Watch Directly on Prime Video
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {MOVIE_WATCHLIST_IDS.map((id) => {
                    const movieItem = getAffiliateById(id);
                    if (!movieItem) return null;
                    return (
                      <a
                        key={id}
                        href={buildAffiliateUrl(movieItem, `watchlist_${active.slug}`)}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="flex items-center justify-between gap-2.5 rounded-xl border border-stone-200 bg-white p-3 text-xs font-bold text-[#18101E] hover:border-rose-400 transition"
                      >
                        <span className="leading-snug">{movieItem.name}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Compact Non-Intrusive 2-Card Shoppable Footer Strip */}
            <section
              data-testid="guide-above-fold-shop"
              className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 sm:p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-900">
                  🛍️ Editor’s Picks for This Guide
                </span>
                <span className="text-[11px] font-medium text-stone-500">
                  {AFFILIATE_SUPPORT_COPY.compactInline}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {active.featuredAffiliateIds.slice(0, 2).map((id) => {
                  const item = getAffiliateById(id);
                  if (!item) return null;
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-stone-200 bg-white p-3.5 flex flex-col justify-between gap-2.5 shadow-2xs"
                    >
                      <div className="space-y-2">
                        <ProductVisualThumbnail item={item} />
                        <h3 className="text-sm font-bold text-[#18101E] leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                          {item.cheekyPitch}
                        </p>
                      </div>
                      <a
                        href={buildAffiliateUrl(item, `journal_top_${active.slug}`)}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={() =>
                          trackEvent('affiliate_clicked', {
                            item_id: item.id,
                            surface: 'journal_above_fold',
                            slug: active.slug,
                          })
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#18101E] py-2 text-xs font-bold text-white hover:bg-stone-800 transition"
                      >
                        <span>
                          {isPrimeVideoDigitalPick(item)
                            ? `Stream on Prime Video (${item.priceDisplay})`
                            : `View on Amazon (${item.priceDisplay})`}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>

            <CrowdsourceSubmissionBar surface="guides" />
          </article>
        </div>
      </div>

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </>
  );
};
