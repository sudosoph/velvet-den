import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckSquare,
  ChevronDown,
  ExternalLink,
  MessageCircle,
  Share2,
  Sparkles,
  Square,
  X,
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
import { awardPassportBonusXp } from '../lib/gamification';
import { sfx } from '../lib/sound';
import { CrowdsourceSubmissionBar } from './CrowdsourceSubmissionBar';
import { ProductVisualThumbnail } from './ProductVisualThumbnail';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';
import { Badge, Button, Card } from './ui/primitives';

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
    herVibe: 'Bold trailblazer who loves directness and spontaneous weekend escapes',
    himVibe: 'Decisive initiator who books Friday dinner in ninety seconds flat',
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
    herVibe: 'Sensory-luxury fan who notices thread counts, good wine, and unhurried touch',
    himVibe: 'Steady home chef who cooks from scratch and never rushes her pace',
    herAvatar: './images/cast/sienna-38f.jpg',
    herCastName: 'Sensory Luxe',
    himAvatar: './images/cast/rafael-hot-26m.jpg',
    himCastName: 'Weekend Chef',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    symbol: '♊',
    element: 'Air',
    herVibe: 'Quick-witted conversationalist who needs sharp banter before appetizers',
    himVibe: 'Playful storyteller who keeps every gallery walk unpredictable',
    herAvatar: './images/cast/elena-prof-44f.jpg',
    herCastName: 'Razor Banter',
    himAvatar: './images/cast/rory-24m.jpg',
    himCastName: 'Witty Storyteller',
  },
  {
    id: 'cancer',
    label: 'Cancer',
    symbol: '♋',
    element: 'Water',
    herVibe: 'Warm sanctuary builder with strong intuition and inner-circle loyalty',
    himVibe: 'Devoted partner who remembers her exact morning coffee and shift hours',
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
    herVibe: 'Radiant main-character energy that thrives on chivalry and public pride',
    himVibe: 'Sunny, proud +1 who pulls out her chair and smiles past every stare',
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
    herVibe: 'Selective perfectionist who notices spotless counters and good manners instantly',
    himVibe: 'Observant host with crisp cotton sheets and 62°F bedroom precision',
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
    herVibe: 'Effortless aesthete drawn to candlelit booths, fresh flowers, and grace',
    himVibe: 'Tailored old-soul charmer with car-door manners and dry wit',
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
    himVibe: 'Locked-in partner who values privacy, eye contact, and earned trust',
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
    himVibe: 'Upbeat weekend co-pilot ready for coastal drives on two hours’ notice',
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
    herVibe: 'Corner-office closer who loves turning her decision brain off at 7:30 PM',
    himVibe: 'Composed planner with grown-man follow-through beyond his years',
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
    himVibe: 'Independent creative thinker who loves her mind first and respects her space',
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
    herVibe: 'Warm romantic who melts for handwritten notes and rainy vinyl mornings',
    himVibe: 'Emotionally fluent sweetheart with 100% phone-down presence at dinner',
    herAvatar: './images/cast/sienna-2.jpg',
    herCastName: 'Velvet Romantic',
    himAvatar: './images/cast/julian-2.jpg',
    himCastName: 'Poetic Old Soul',
  },
];

function computeZodiacPairing(her: ZodiacSignInfo, him: ZodiacSignInfo) {
  const pairKey = `${her.element}-${him.element}`;
  let rating = '93% Slow-Burn Spark';
  let dateIdea = 'Candlelit wine booth + unhurried vinyl nightcap';
  let scenePhoto = './images/scenes/wine-bar-booth.jpg';
  let meters = [
    { label: '🔥 Chemistry & Banter', pct: 93 },
    { label: '🛎️ Friday Planning', pct: 92 },
    { label: '🛋️ Sunday Peace', pct: 94 },
    { label: '🌶️ Long-Term Spark', pct: 91 },
  ];

  if (her.id === him.id) {
    rating = '95% Twin-Sign Voltage';
    dateIdea = 'Late-night sushi counter + trading stories until midnight';
    scenePhoto = './images/scenes/campus-autumn-sushi.jpg';
    meters = [
      { label: '🔥 Chemistry & Banter', pct: 96 },
      { label: '🛎️ Friday Planning', pct: 91 },
      { label: '🛋️ Sunday Peace', pct: 95 },
      { label: '🌶️ Long-Term Spark', pct: 94 },
    ];
  } else if (
    (her.element === 'Fire' && him.element === 'Air') ||
    (her.element === 'Air' && him.element === 'Fire')
  ) {
    rating = '97% High-Octane Banter';
    dateIdea = '18-hour boutique hotel rooftop + midnight pool escape';
    scenePhoto = './images/scenes/hotel-pool-sauna.jpg';
    meters = [
      { label: '🔥 Chemistry & Banter', pct: 98 },
      { label: '🛎️ Friday Planning', pct: 95 },
      { label: '🛋️ Sunday Peace', pct: 93 },
      { label: '🌶️ Long-Term Spark', pct: 97 },
    ];
  } else if (
    (her.element === 'Earth' && him.element === 'Water') ||
    (her.element === 'Water' && him.element === 'Earth')
  ) {
    rating = '99% Soulmate Sanctuary Tier';
    dateIdea = 'Farmers-market figs + homemade Sunday pasta in a lamp-lit kitchen';
    scenePhoto = './images/scenes/sunday-kitchen-sanctuary.jpg';
    meters = [
      { label: '🔥 Chemistry & Banter', pct: 97 },
      { label: '🛎️ Friday Planning', pct: 99 },
      { label: '🛋️ Sunday Peace', pct: 99 },
      { label: '🌶️ Long-Term Spark', pct: 96 },
    ];
  } else if (
    (her.element === 'Fire' && him.element === 'Earth') ||
    (her.element === 'Earth' && him.element === 'Fire')
  ) {
    rating = '96% Glamour × Steady Anchor';
    dateIdea = '6:30 PM hotel-bar martinis + pre-booked corner booth';
    scenePhoto = './images/scenes/velvet-room-bar.jpg';
    meters = [
      { label: '🔥 Chemistry & Banter', pct: 96 },
      { label: '🛎️ Friday Planning', pct: 98 },
      { label: '🛋️ Sunday Peace', pct: 94 },
      { label: '🌶️ Long-Term Spark', pct: 95 },
    ];
  } else if (pairKey === 'Fire-Fire' || pairKey === 'Water-Water') {
    rating = '96% Magnetic Heat';
    dateIdea = 'Top-down coastal sunset drive + oceanfront drinks';
    scenePhoto = './images/scenes/coastal-convertible.jpg';
    meters = [
      { label: '🔥 Chemistry & Banter', pct: 99 },
      { label: '🛎️ Friday Planning', pct: 93 },
      { label: '🛋️ Sunday Peace', pct: 92 },
      { label: '🌶️ Long-Term Spark', pct: 97 },
    ];
  } else {
    rating = '94% Opposites-Attract Intrigue';
    dateIdea = 'Thursday gallery opening + competitive retro bowling';
    scenePhoto = './images/scenes/neon-bowling-lounge.jpg';
    meters = [
      { label: '🔥 Chemistry & Banter', pct: 94 },
      { label: '🛎️ Friday Planning', pct: 93 },
      { label: '🛋️ Sunday Peace', pct: 92 },
      { label: '🌶️ Long-Term Spark', pct: 96 },
    ];
  }

  return { rating, dateIdea, scenePhoto, meters };
}

interface GuideVisualMeta {
  categoryPill: string;
  heroPhoto: string;
  sectionPhotos: string[];
  dontText: string;
  doText: string;
  doSummary: string;
  skipSummary: string;
  poll: {
    question: string;
    options: [
      { label: string; baseVotes: number },
      { label: string; baseVotes: number },
      { label: string; baseVotes: number },
    ];
  };
}

const GUIDE_VISUAL_BY_SLUG: Record<string, GuideVisualMeta> = {
  'cougar-vs-puma-vs-jaguar-dating-age-chart': {
    categoryPill: 'Subculture Slang',
    heroPhoto: './images/scenes/velvet-room-bar.jpg',
    sectionPhotos: [
      './images/scenes/cougarmarket-wine.jpg',
      './images/scenes/candlelit-cocktails.jpg',
      './images/scenes/wine-bar-booth.jpg',
      './images/scenes/coastal-convertible.jpg',
      './images/scenes/palm-springs-resort.jpg',
    ],
    dontText: 'ngl never been with a cougar before, bucket list check tonight??',
    doText: 'Booked us a quiet patio table at 7:30 Friday. See you there.',
    doSummary: 'Use the chart playfully for laughs and book real Friday plans.',
    skipSummary: 'Never treat a woman’s age tier like a bucket-list achievement badge.',
    poll: {
      question: 'Which tier on the Feline Age Chart has the best dating energy?',
      options: [
        { label: '40s Cougar: peaceful home, sharp humor, zero games', baseVotes: 68 },
        { label: '50s+ Jaguar & Panther: peak confidence and zero small talk', baseVotes: 49 },
        { label: '30s Puma & Junior Cougar: shared playlist sweet spot', baseVotes: 33 },
      ],
    },
  },
  'first-time-hosting-older-woman-apartment-checklist': {
    categoryPill: 'Hosting Checklist',
    heroPhoto: './images/scenes/sunday-kitchen-sanctuary.jpg',
    sectionPhotos: [
      './images/products/hosting-lidded-bin-soap.jpg',
      './images/scenes/luxury-bedroom-sanctuary.jpg',
      './images/scenes/wine-bar-booth.jpg',
      './images/scenes/cozy-rain-suite.jpg',
    ],
    dontText: 'come thru whenever lol my roommate left dishes in the sink',
    doText: 'Dinner is on, lamps are dimmed, and sparkling water is chilled whenever you get here.',
    doSummary: 'Covered bathroom bin, four real pillows, warm lamps, and a spare phone cord.',
    skipSummary: 'Bare floor mattresses, damp mystery towels, and blinding overhead lights.',
    poll: {
      question: 'Which apartment crime is the fastest instant walk-out?',
      options: [
        { label: 'Open wire bathroom bin + damp mystery towel', baseVotes: 78 },
        { label: 'One flat pancake pillow on shiny polyester sheets', baseVotes: 51 },
        { label: 'Blinding overhead ceiling light left on at 10 PM', baseVotes: 23 },
      ],
    },
  },
  'best-gifts-for-older-woman-girlfriend-dating-guide': {
    categoryPill: 'Date-Night & Gifts',
    heroPhoto: './images/scenes/palm-springs-resort.jpg',
    sectionPhotos: [
      './images/scenes/cougarmarket-wine.jpg',
      './images/scenes/candlelit-cocktails.jpg',
      './images/scenes/sunday-kitchen-sanctuary.jpg',
      './images/products/princess-mulberry-silk-robe.jpg',
      './images/scenes/wine-bar-booth.jpg',
    ],
    dontText: 'i didnt know what to get u since u already buy everything lol',
    doText: 'Grabbed that Sicilian olive oil you mentioned three weeks ago, plus Sunday dinner is on me.',
    doSummary: 'Win with specific memory, home-cooked dinner, and zero-decision Friday plans.',
    skipSummary: 'Competing insecurely with her salary or buying generic mall clutter.',
    poll: {
      question: 'What wins hardest with a woman who already buys her own luxury?',
      options: [
        { label: 'Cooking dinner from scratch + leaving her kitchen spotless', baseVotes: 74 },
        { label: 'Remembering a small favorite she mentioned weeks ago', baseVotes: 46 },
        { label: 'Planning a full weekend date where she makes zero decisions', baseVotes: 31 },
      ],
    },
  },
  'millennial-vs-gen-z-age-gap-dating-code-switching': {
    categoryPill: 'Texting Decoder',
    heroPhoto: './images/scenes/wine-bar-booth.jpg',
    sectionPhotos: [
      './images/scenes/campus-autumn-sushi.jpg',
      './images/scenes/velvet-room-bar.jpg',
      './images/scenes/neon-bowling-lounge.jpg',
      './images/scenes/candlelit-cocktails.jpg',
    ],
    dontText: 'yo u look crazy good for ur age whats ur snap??',
    doText: 'Here is my number. Want to grab 7:30 drinks Thursday at Left Bank?',
    doSummary: 'Trade real phone numbers, trust her punctuation, and confirm at noon.',
    skipSummary: 'Asking for Snapchat past age 25 or adding "for your age" to compliments.',
    poll: {
      question: 'Fastest way a younger guy fumbles in the DMs?',
      options: [
        { label: 'Asking "do u have snap??"', baseVotes: 84 },
        { label: 'Saying "you look amazing for your age!"', baseVotes: 45 },
        { label: 'Sending "wyd" at 11:15 PM with zero plan', baseVotes: 21 },
      ],
    },
  },
  'older-woman-younger-man-relationship-problems-kids-stigma': {
    categoryPill: 'Real Talk',
    heroPhoto: './images/scenes/cozy-rain-suite.jpg',
    sectionPhotos: [
      './images/scenes/hotel-pool-sauna.jpg',
      './images/scenes/canyon-sunrise-trail.jpg',
      './images/scenes/wedding-gala-cheers.jpg',
      './images/scenes/sunday-kitchen-sanctuary.jpg',
    ],
    dontText: 'wait are those people at the next table staring at us??',
    doText: 'One King bed is plenty, thanks. Shall we grab a drink before dinner?',
    doSummary: 'Talk timelines honestly by Month 3 and hold hands proudly in public.',
    skipSummary: 'Dodging the kids talk for two years or acting sheepish on the sidewalk.',
    poll: {
      question: 'Best response when a hotel clerk asks "Two Queen beds?"',
      options: [
        { label: 'Smile warmly: "One King is plenty, thank you"', baseVotes: 82 },
        { label: 'Squeeze her hand and laugh together on the elevator', baseVotes: 41 },
        { label: 'Wink and ask if that comes with comped Champagne', baseVotes: 19 },
      ],
    },
  },
  'black-cat-older-woman-golden-retriever-younger-man-dating-guide': {
    categoryPill: 'Relationship Polarity',
    heroPhoto: './images/scenes/candlelit-cocktails.jpg',
    sectionPhotos: [
      './images/scenes/velvet-room-bar.jpg',
      './images/scenes/wine-bar-booth.jpg',
      './images/scenes/cozy-rain-suite.jpg',
      './images/scenes/sunday-kitchen-sanctuary.jpg',
    ],
    dontText: 'fine guess ur too busy for me then!!',
    doText: 'Zero rush at all. Held Thursday at 8 for us whenever your week clears.',
    doSummary: 'Match her pace warmly without double-texting or rushing trust.',
    skipSummary: 'Tuesday love-bombing followed by pouting when she has a busy workday.',
    poll: {
      question: 'Which side of this pairing are you in relationships?',
      options: [
        { label: 'Selective Black Cat who warms up once trust is real', baseVotes: 66 },
        { label: 'Upbeat Golden Retriever who enjoys the slow burn', baseVotes: 52 },
        { label: 'Cool in public, total softie on Sunday morning', baseVotes: 24 },
      ],
    },
  },
  'celebrity-cougars-and-cubs-pop-culture-guide': {
    categoryPill: 'Pop Culture Icons',
    heroPhoto: './images/scenes/coastal-convertible.jpg',
    sectionPhotos: [
      './images/icons/pop_tina_erwin.jpg',
      './images/icons/pop_priyanka_nick.jpg',
      './images/icons/pop_cher_icons.jpg',
      './images/icons/pop_sienna_oli.jpg',
      './images/icons/pop_olivia_harry.jpg',
    ],
    dontText: 'wait celebrity age gaps never last more than one summer right??',
    doText: 'Tina Turner and Erwin Bach went 38 years strong. Pack your weekend bag.',
    doSummary: 'Cheer her spotlight from the front row with zero fragile ego.',
    skipSummary: 'Competing with her career success or acting intimidated by her title.',
    poll: {
      question: 'Ultimate Hall-of-Fame Couple?',
      options: [
        { label: 'Tina Turner & Erwin Bach (16-yr gap • 38 years)', baseVotes: 69 },
        { label: 'Priyanka & Nick / Heidi Klum & Tom Kaulitz', baseVotes: 47 },
        { label: 'Cher, Nicole Scherzinger & Kim K × Lewis Hamilton era', baseVotes: 34 },
      ],
    },
  },
  'dating-younger-man-perimenopause-menopause-intimacy': {
    categoryPill: 'Sleep & Intimacy',
    heroPhoto: './images/scenes/luxury-bedroom-sanctuary.jpg',
    sectionPhotos: [
      './images/products/cooling-bamboo-sheets.jpg',
      './images/scenes/cozy-rain-suite.jpg',
      './images/scenes/hotel-pool-sauna.jpg',
      './images/scenes/sunday-kitchen-sanctuary.jpg',
    ],
    dontText: 'why do u have the bedroom AC cranked so cold lol',
    doText: 'Bedroom is set to 62°F and ice water is already on your nightstand.',
    doSummary: 'Cool bedroom, breathable cotton layers, ice water, and unhurried pace.',
    skipSummary: 'Overheated synthetic comforters or rushing past warmup.',
    poll: {
      question: 'Ideal bedroom temperature for an overnight stay?',
      options: [
        { label: 'Crisp 62°F–64°F + breathable cotton layers', baseVotes: 88 },
        { label: '65°F–67°F + two separate Scandinavian duvets', baseVotes: 36 },
        { label: 'Over 70°F (straight to detention)', baseVotes: 11 },
      ],
    },
  },
  'junior-cougar-6-year-age-gap-relationship-guide': {
    categoryPill: '4–9 Year Gap',
    heroPhoto: './images/scenes/cougarmarket-wine.jpg',
    sectionPhotos: [
      './images/icons/pop_miley_maxx.jpg',
      './images/icons/pop_eva_ryan.jpg',
      './images/icons/pop_cameron_benji.jpg',
      './images/scenes/wedding-gala-cheers.jpg',
    ],
    dontText: 'six years barely even counts as an age gap lol',
    doText: 'You already had an apartment while I was taking sophomore geometry, definitely counts.',
    doSummary: 'Enjoy shared cultural references alongside clear, game-free dating.',
    skipSummary: 'Using a smaller gap as an excuse for lazy date planning.',
    poll: {
      question: 'Does a 5-to-8 year woman-older gap belong in the Club?',
      options: [
        { label: '100% Yes: proud Junior Cougar seat unlocked', baseVotes: 79 },
        { label: 'Honorary Puma seat (10+ years is classic Cougar)', baseVotes: 38 },
        { label: 'Yes, as long as he still books Friday dinner!', baseVotes: 18 },
      ],
    },
  },
  'older-woman-grown-son-same-age-meeting-parents-guide': {
    categoryPill: 'Family & Weddings',
    heroPhoto: './images/scenes/wedding-gala-cheers.jpg',
    sectionPhotos: [
      './images/scenes/campus-autumn-sushi.jpg',
      './images/scenes/sunday-kitchen-sanctuary.jpg',
      './images/scenes/wine-bar-booth.jpg',
      './images/scenes/velvet-room-bar.jpg',
    ],
    dontText: 'so since im dating ur mom im basically in charge now right??',
    doText: 'Already told my mom all about you on Tuesday, she’s excited for Sunday brunch.',
    doSummary: 'Treat her adult kids like warm peers and prep his mom a week ahead.',
    skipSummary: 'Fake stepdad posturing or springing a surprise holiday ambush.',
    poll: {
      question: 'Which real-life milestone feels biggest?',
      options: [
        { label: 'Brunch with her adult kid who is near your age', baseVotes: 58 },
        { label: 'Sunday dinner with his mom from your graduating era', baseVotes: 49 },
        { label: 'Walking into your first formal wedding together', baseVotes: 29 },
      ],
    },
  },
  'spontaneous-weekend-getaway-date-ideas-older-woman-younger-man': {
    categoryPill: 'Date Ideas',
    heroPhoto: './images/scenes/campus-autumn-sushi.jpg',
    sectionPhotos: [
      './images/products/linen-picnic-insulated-tote.jpg',
      './images/scenes/wine-bar-booth.jpg',
      './images/scenes/sunday-kitchen-sanctuary.jpg',
      './images/scenes/neon-bowling-lounge.jpg',
      './images/scenes/hotel-pool-sauna.jpg',
    ],
    dontText: 'wanna just come sit on my couch and scroll Netflix??',
    doText: 'Packed figs and Brie for the bluff at 5:30, then two games of retro bowling at 8.',
    doSummary: 'Pair simple movement, side-by-side seating, and decisive planning.',
    skipSummary: 'Loud four-top dinner interviews or "idk what do u wanna do."',
    poll: {
      question: 'Pick this Friday’s winning date plan:',
      options: [
        { label: '18-hour coastal hotel pool & morning espresso escape', baseVotes: 67 },
        { label: 'Sunset bluff picnic + competitive retro bowling', baseVotes: 44 },
        { label: '12-seat vinyl listening bar + late-night ramen', baseVotes: 28 },
      ],
    },
  },
  'cougar-town-pop-culture-age-gap-dating-history': {
    categoryPill: 'TV Binge List',
    heroPhoto: './images/scenes/canyon-sunrise-trail.jpg',
    sectionPhotos: [
      './images/icons/pop_cougar_town.jpg',
      './images/scenes/velvet-room-bar.jpg',
      './images/scenes/cougarmarket-wine.jpg',
      './images/scenes/palm-springs-resort.jpg',
      './images/scenes/wedding-gala-cheers.jpg',
    ],
    dontText: 'arent divorced women in their 40s supposed to stay home quietly??',
    doText: 'Chilled the Pinot. Starting Younger Season 1 or Samantha & Smith episodes tonight?',
    doSummary: 'Queue up smart, funny shows where older women own their second act.',
    skipSummary: 'Outdated sitcom clichés that treat 40+ dating like a punchline.',
    poll: {
      question: 'Best TV older-woman / younger-man storyline of all time?',
      options: [
        { label: 'Samantha Jones & Smith Jerrod (Sex and the City)', baseVotes: 76 },
        { label: 'Liza Miller & Josh (Younger)', baseVotes: 43 },
        { label: 'Jules Cobb (Cougar Town) & Deborah Vance (Hacks)', baseVotes: 26 },
      ],
    },
  },
  'astrology-zodiac-compatibility-older-woman-younger-man': {
    categoryPill: '12×12 Star Signs',
    heroPhoto: './images/scenes/havana-salsa-studio.jpg',
    sectionPhotos: [
      './images/scenes/coastal-convertible.jpg',
      './images/scenes/sunday-kitchen-sanctuary.jpg',
      './images/scenes/wine-bar-booth.jpg',
      './images/scenes/hotel-pool-sauna.jpg',
    ],
    dontText: 'astrology is dumb lol anyway wyd tonight',
    doText: 'Texted my mom at lunch for my exact birth time. Give me the honest verdict.',
    doSummary: 'Play along with curiosity when she checks your sign over drinks.',
    skipSummary: 'Giving a condescending ten-minute lecture mocking fun bar banter.',
    poll: {
      question: 'Which element makes the best younger male partner?',
      options: [
        { label: 'Earth (Taurus, Virgo, Capricorn): steady & cooks dinner', baseVotes: 64 },
        { label: 'Water (Cancer, Scorpio, Pisces): deep focus & loyalty', baseVotes: 48 },
        { label: 'Fire & Air: fast banter and spontaneous weekend trips', baseVotes: 31 },
      ],
    },
  },
  'master-list-cougar-cub-movies-older-woman-younger-man': {
    categoryPill: '22-Film Watchlist',
    heroPhoto: './images/scenes/neon-bowling-lounge.jpg',
    sectionPhotos: [
      './images/products/bridget-jones-cougar-town-watch.jpg',
      './images/products/the-rebound-zeta-jones-prime.jpg',
      './images/products/babygirl-movie-prime.jpg',
      './images/icons/pop_stella_cinema.jpg',
    ],
    dontText: 'never heard of any of those lol put on sports highlights',
    doText: 'Takeout is ordered. Starting with The Rebound or Bridget Jones tonight?',
    doSummary: 'Pick the movie before dinner lands so nobody scrolls menus for an hour.',
    skipSummary: 'Checking work emails mid-movie or spoiling the ending.',
    poll: {
      question: 'Pick the #1 essential movie from the 22-film vault:',
      options: [
        { label: 'Babygirl / The Idea of You (new streaming wave)', baseVotes: 61 },
        { label: 'Bridget Jones: Mad About the Boy / No Hard Feelings', baseVotes: 49 },
        { label: 'How Stella Got Her Groove Back / The Rebound', baseVotes: 39 },
      ],
    },
  },
  'movies-like-babygirl-idea-of-you-bridget-jones-older-woman-younger-man': {
    categoryPill: 'Watch-Night Moods',
    heroPhoto: './images/scenes/hotel-pool-sauna.jpg',
    sectionPhotos: [
      './images/products/babygirl-movie-prime.jpg',
      './images/products/idea-of-you-movie-book.jpg',
      './images/products/bridget-jones-cougar-town-watch.jpg',
      './images/scenes/cozy-rain-suite.jpg',
    ],
    dontText: 'idk pick whatever movie u want i guess',
    doText: 'Want hotel-bar tension (Babygirl), vacation glow (Stella), or London laughs (Bridget)?',
    doSummary: 'Give her three clear watch-night moods and handle the wine.',
    skipSummary: 'Handing her the remote after a 50-hour workweek.',
    poll: {
      question: 'Which Friday watch-night mood wins tonight?',
      options: [
        { label: 'High-voltage hotel-bar tension (Babygirl / White Palace)', baseVotes: 63 },
        { label: 'Sun-drenched getaway chemistry (Stella / Idea of You)', baseVotes: 48 },
        { label: 'Witty rom-com laughs (Bridget Jones / The Rebound)', baseVotes: 35 },
      ],
    },
  },
  'how-to-meet-older-women-in-the-wild-hotel-bar-gym-etiquette': {
    categoryPill: 'Offline Field Guide',
    heroPhoto: './images/scenes/terminal-b-arrivals.jpg',
    sectionPhotos: [
      './images/scenes/velvet-room-bar.jpg',
      './images/scenes/canyon-sunrise-trail.jpg',
      './images/scenes/cougarmarket-wine.jpg',
      './images/scenes/wine-bar-booth.jpg',
      './images/scenes/havana-salsa-studio.jpg',
    ],
    dontText: 'hey take off ur headphones mid-set real quick!!',
    doText: 'Saw you wrapping up at the coffee counter. I’m Marcus, by the way.',
    doSummary: 'Wait until headphones come out, skip Cubsplaining, and offer your number.',
    skipSummary: 'Interrupting mid-workout or lecturing her on wine or real estate.',
    poll: {
      question: 'Best real-life place to spark a conversation naturally?',
      options: [
        { label: '6:30 PM hotel lobby bar or neighborhood wine bar', baseVotes: 71 },
        { label: 'Racquet club, run club, or post-workout coffee counter', baseVotes: 46 },
        { label: 'Saturday farmers market, bookstore, or museum night', baseVotes: 29 },
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

/**
 * Largest-remainder percentage calculation so poll bars ALWAYS sum to 100%
 * and genuinely reflect every single vote cast.
 */
export function computeExactPollPercentages(counts: readonly number[]): number[] {
  const safeCounts = counts.map((c) => Math.max(0, Math.floor(c)));
  const total = safeCounts.reduce((acc, c) => acc + c, 0);
  if (total <= 0) {
    const even = Math.floor(100 / Math.max(1, safeCounts.length));
    return safeCounts.map((_, idx) =>
      idx === 0 ? 100 - even * (safeCounts.length - 1) : even,
    );
  }
  const exact = safeCounts.map((c) => (c / total) * 100);
  const floored = exact.map((v) => Math.floor(v));
  let remainder = 100 - floored.reduce((acc, v) => acc + v, 0);
  const order = exact
    .map((v, idx) => ({ idx, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < order.length && remainder > 0; i += 1) {
    floored[order[i].idx] += 1;
    remainder -= 1;
  }
  return floored;
}

const POLL_STORAGE_KEY = 'cc_guide_poll_votes_v1';
const HOSTING_STORAGE_KEY = 'cc_hosting_10pt_v1';

function loadSavedPollVotes(): Record<string, number> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return {};
    const raw = window.localStorage.getItem(POLL_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    const clean: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < 3) {
        clean[k] = v;
      }
    }
    return clean;
  } catch {
    return {};
  }
}

function savePollVotes(votes: Record<string, number>): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(votes));
    }
  } catch {
    // Ignore storage error
  }
}

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

function isLiveHttpRuntime(): boolean {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return false;
  const ua = (navigator.userAgent || '').toLowerCase();
  if (ua.includes('jsdom')) return false;
  return window.location.protocol === 'https:' || window.location.protocol === 'http:';
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
  const [pollVotesBySlug, setPollVotesBySlug] = useState<Record<string, number>>(() =>
    loadSavedPollVotes(),
  );
  const [serverPercentagesBySlug, setServerPercentagesBySlug] = useState<
    Record<string, number[]>
  >({});
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  const active =
    JOURNAL_ARTICLES.find((a) => a.slug === selectedSlug) ?? JOURNAL_ARTICLES[0];
  const visualMeta = getGuideVisualMeta(active.slug);
  const showAstroMatcher =
    astroOpen || active.slug === 'astrology-zodiac-compatibility-older-woman-younger-man';

  // Sync live KV poll percentages when running in browser
  useEffect(() => {
    if (!isLiveHttpRuntime()) return;
    let cancelled = false;
    const epId = `guide_poll_${active.slug}`.slice(0, 64);
    fetch(`/api/stats?episodeId=${encodeURIComponent(epId)}&choices=3`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { percentages?: number[]; source?: string } | null) => {
        if (
          !cancelled &&
          data?.source === 'kv' &&
          Array.isArray(data.percentages) &&
          data.percentages.length === 3
        ) {
          setServerPercentagesBySlug((prev) => ({
            ...prev,
            [active.slug]: data.percentages!,
          }));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [active.slug]);

  const handleSelectArticle = (slug: string) => {
    setSelectedSlug(slug);
    if (slug === 'astrology-zodiac-compatibility-older-woman-younger-man') {
      setAstroOpen(true);
    }
    trackEvent('guide_opened', { slug });
    if (!import.meta.env.VITEST && typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        // Ignore scroll error
      }
    }
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
      // Ignore storage error
    }
  };

  const handleVotePoll = (choiceIdx: number) => {
    sfx.messagePop();
    const alreadyVoted = pollVotesBySlug[active.slug] !== undefined;
    const nextVotes = { ...pollVotesBySlug, [active.slug]: choiceIdx };
    setPollVotesBySlug(nextVotes);
    savePollVotes(nextVotes);

    if (!alreadyVoted) {
      awardPassportBonusXp(`guide_poll_${active.slug}`, 5, 'Poll Vote Counted!', '🗳️ +5 XP');
    }

    if (isLiveHttpRuntime()) {
      const epId = `guide_poll_${active.slug}`.slice(0, 64);
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeId: epId,
          choiceIndex: choiceIdx,
          choiceCount: 3,
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { percentages?: number[] } | null) => {
          if (data?.percentages && data.percentages.length === 3) {
            setServerPercentagesBySlug((prev) => ({
              ...prev,
              [active.slug]: data.percentages!,
            }));
          }
        })
        .catch(() => {});
    }
  };

  const herSign = ZODIAC_SIGNS.find((s) => s.id === herSignId) ?? ZODIAC_SIGNS[7];
  const himSign = ZODIAC_SIGNS.find((s) => s.id === himSignId) ?? ZODIAC_SIGNS[1];
  const zodiacMatch = computeZodiacPairing(herSign, himSign);

  const handleShareGuide = () => {
    const guideUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}guides/${active.slug}/`;
    setSharePayload({
      title: active.headline,
      message: `📖 Cougars & Cubs Magazine: "${active.headline}" (${active.readTime})`,
      url: guideUrl,
      shareSurface: 'guide',
      discordMarkdown: `**📖 ${active.headline}** (${active.readTime})\n${active.metaDescription}\nRead here: ${guideUrl}`,
    });
  };

  const handleShareZodiac = () => {
    const astroUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?journal=astrology-zodiac-compatibility-older-woman-younger-man`;
    setSharePayload({
      title: `${herSign.symbol} ${herSign.label} Her × ${himSign.symbol} ${himSign.label} Cub`,
      message: `🔮 Astro Match: ${herSign.symbol} ${herSign.label} Her × ${himSign.symbol} ${himSign.label} Cub, ${zodiacMatch.rating}! Test your signs:`,
      url: astroUrl,
      shareSurface: 'guide',
      discordMarkdown: `**🔮 ${herSign.symbol} ${herSign.label} Her × ${himSign.symbol} ${himSign.label} Cub (${zodiacMatch.rating})**\n${zodiacMatch.dateIdea}\nTest your signs: ${astroUrl}`,
    });
  };

  const isMovieGuide =
    active.slug === 'master-list-cougar-cub-movies-older-woman-younger-man' ||
    active.slug === 'movies-like-babygirl-idea-of-you-bridget-jones-older-woman-younger-man';

  const selectedPollIdx = pollVotesBySlug[active.slug];
  const liveCounts = visualMeta.poll.options.map(
    (opt, idx) => opt.baseVotes + (selectedPollIdx === idx ? 1 : 0),
  );
  const totalPollVotes = liveCounts.reduce((acc, c) => acc + c, 0);
  const computedPollPercentages =
    serverPercentagesBySlug[active.slug] ?? computeExactPollPercentages(liveCounts);

  return (
    <>
      <div className="mx-auto w-full max-w-4xl space-y-8 animate-stage-in">
        {/* Top Magazine Masthead + Quick Astro Toggle */}
        <header className="space-y-5 border-b border-zinc-200 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <Badge variant="accent">Club Magazine • 16 Photo Listicles</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                Quick Reads, Visual Charts &amp; Date-Night Playbooks
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => setAstroOpen((v) => !v)}
                className="border-rose-200 bg-rose-50/60 text-zinc-950 hover:bg-rose-100/70"
              >
                <span>
                  🔮 Quick Astro: {herSign.symbol} × {himSign.symbol}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-rose-600 transition-transform ${
                    showAstroMatcher ? 'rotate-180' : ''
                  }`}
                />
              </Button>
              <Button variant="outline" onClick={handleShareGuide}>
                <Share2 className="h-4 w-4 text-zinc-500" />
                <span>Share</span>
              </Button>
            </div>
          </div>

          {/* 5 Featured 1-Tap Editorial Tabs */}
          <div className="flex items-center gap-5 overflow-x-auto border-b border-zinc-200 no-scrollbar">
            {[
              {
                slug: 'cougar-vs-puma-vs-jaguar-dating-age-chart',
                label: '🐆 Feline Age Chart',
              },
              {
                slug: 'first-time-hosting-older-woman-apartment-checklist',
                label: '🏠 10-Pt Apartment Check',
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

          {/* Clean Horizontal All-16 Listicle Picker (Replaces Narrow Cramped Sidebar) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {JOURNAL_ARTICLES.map((art, idx) => {
              const isSelected = art.slug === active.slug;
              const artMeta = getGuideVisualMeta(art.slug);
              return (
                <button
                  key={art.slug}
                  type="button"
                  onClick={() => handleSelectArticle(art.slug)}
                  className={`group flex shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition cursor-pointer max-w-[240px] ${
                    isSelected
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-2xs'
                      : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <img
                    src={artMeta.heroPhoto}
                    alt=""
                    loading="lazy"
                    className="h-9 w-9 shrink-0 rounded-lg object-cover object-top"
                  />
                  <div className="min-w-0">
                    <div
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-rose-400' : 'text-zinc-400'
                      }`}
                    >
                      #{String(idx + 1).padStart(2, '0')} • {artMeta.categoryPill}
                    </div>
                    <div className="text-xs font-semibold leading-snug line-clamp-1">
                      {art.seoTitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </header>

        {/* On-Demand Quick Astro Matcher (Pure shadcn Card & Tokens) */}
        {showAstroMatcher && (
          <Card className="p-5 sm:p-6 space-y-5" data-testid="zodiac-12x12-matcher">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="accent">
                  <Sparkles className="h-3.5 w-3.5" /> Quick Astro
                </Badge>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950">
                  🔮 {herSign.symbol} {herSign.label} Her × {himSign.symbol} {himSign.label} Cub
                </h2>
                <Badge variant="default">{zodiacMatch.rating}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleShareZodiac}>
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Pairing</span>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3.5 space-y-2.5">
                <label className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                    🐆 Her Star Sign
                  </span>
                  <select
                    aria-label="Her Star Sign"
                    value={herSignId}
                    onChange={(e) => {
                      sfx.messagePop();
                      setHerSignId(e.target.value);
                    }}
                    className="h-8 rounded-md border border-zinc-200 bg-white px-2.5 text-xs font-semibold text-zinc-900"
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
                        className={`flex flex-col items-center justify-center rounded-lg border py-1.5 px-1 text-xs font-medium transition cursor-pointer ${
                          activeChip
                            ? 'border-rose-600 bg-rose-600 text-white'
                            : 'border-zinc-200 bg-white text-zinc-800 hover:border-rose-300'
                        }`}
                      >
                        <span className="leading-none">{s.symbol}</span>
                        <span className="mt-0.5 truncate max-w-full">{s.label.slice(0, 3)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3.5 space-y-2.5">
                <label className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-900">
                    🐕 His Star Sign
                  </span>
                  <select
                    aria-label="His Star Sign"
                    value={himSignId}
                    onChange={(e) => {
                      sfx.messagePop();
                      setHimSignId(e.target.value);
                    }}
                    className="h-8 rounded-md border border-zinc-200 bg-white px-2.5 text-xs font-semibold text-zinc-900"
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
                        className={`flex flex-col items-center justify-center rounded-lg border py-1.5 px-1 text-xs font-medium transition cursor-pointer ${
                          activeChip
                            ? 'border-zinc-900 bg-zinc-900 text-white'
                            : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400'
                        }`}
                      >
                        <span className="leading-none">{s.symbol}</span>
                        <span className="mt-0.5 truncate max-w-full">{s.label.slice(0, 3)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr] items-stretch">
              <div className="grid gap-2.5 sm:grid-cols-3 items-stretch">
                <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white p-3">
                  <img
                    src={herSign.herAvatar}
                    alt={`${herSign.label} Her vibe`}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover object-top border border-zinc-200"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-xs font-semibold text-zinc-950">
                      {herSign.symbol} {herSign.herCastName}
                    </div>
                    <p className="text-xs text-zinc-600 leading-snug line-clamp-2">
                      {herSign.herVibe}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white p-3">
                  <img
                    src={himSign.himAvatar}
                    alt={`${himSign.label} Cub vibe`}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover object-top border border-zinc-200"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-xs font-semibold text-zinc-950">
                      {himSign.symbol} {himSign.himCastName}
                    </div>
                    <p className="text-xs text-zinc-600 leading-snug line-clamp-2">
                      {himSign.himVibe}
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-zinc-200 min-h-[80px]">
                  <img
                    src={zodiacMatch.scenePhoto}
                    alt="Ideal date setting"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/25 to-transparent flex items-end p-2.5">
                    <p className="text-xs font-medium text-white leading-snug">
                      {zodiacMatch.dateIdea}
                    </p>
                  </div>
                </div>
              </div>

              <div
                data-testid="zodiac-meter-grid"
                className="grid grid-cols-2 gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5"
              >
                {zodiacMatch.meters.map((m) => (
                  <div key={m.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-zinc-900">
                      <span className="truncate">{m.label}</span>
                      <span className="font-semibold text-rose-600 shrink-0">{m.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-full rounded-full bg-rose-600 transition-all duration-300"
                        style={{ width: `${m.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Airy Single-Column BuzzFeed Photo Listicle Canvas */}
        <Card className="mx-auto max-w-3xl p-6 sm:p-10 space-y-10">
          {/* Clean Title + 1-Line Subhead + Widescreen Hero */}
          <header className="space-y-4 border-b border-zinc-200 pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">{visualMeta.categoryPill}</Badge>
              <Badge variant="outline">{active.readTime}</Badge>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 leading-tight">
              {active.headline}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-zinc-600">
              {active.intro}
            </p>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 aspect-[16/9] bg-zinc-100">
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
            <section
              data-testid="guide-hosting-checklist"
              className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <Badge variant="accent">Interactive 10-Point Check</Badge>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950">
                    Tick Off Your Apartment Before She Arrives
                  </h3>
                </div>
                <Badge variant="default">
                  {hostingChecks.length} / {active.checklistItems.length} Ready
                </Badge>
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
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm transition ${
                        checked
                          ? 'border-zinc-900 bg-white text-zinc-950 font-semibold'
                          : 'border-zinc-200 bg-white text-zinc-800'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleHostingCheck(idx)}
                        className="flex items-start gap-2.5 text-left whitespace-normal cursor-pointer flex-1"
                      >
                        {checked ? (
                          <CheckSquare className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                        ) : (
                          <Square className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
                        )}
                        <span>
                          <strong className="text-zinc-400 mr-1.5">#{idx + 1}.</strong>
                          {itemText}
                        </span>
                      </button>
                      {linkedProduct && (
                        <a
                          href={buildAffiliateUrl(linkedProduct, `checklist_row_${idx + 1}`)}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="shrink-0 inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 hover:bg-zinc-900 hover:text-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition"
                        >
                          <span>See Pick</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Spacious BuzzFeed Numbered Photo Listicle Stream (Big Number + Title + Subtitle + Photo + Short Caption) */}
          <div className="space-y-12">
            {active.sections.map((sec, idx) => {
              const photoUrl =
                visualMeta.sectionPhotos[idx % visualMeta.sectionPhotos.length];
              const cleanHeading = sec.heading.replace(/^\d+\.\s*/, '');
              const hasExplicitBullets = sec.body.includes('\n•');
              const bulletLines = hasExplicitBullets
                ? sec.body
                    .split('\n')
                    .map((l) => l.replace(/^[•-]\s*/, '').trim())
                    .filter(Boolean)
                : [];

              return (
                <section
                  key={sec.heading}
                  data-testid="guide-section-visual-card"
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-sm font-bold text-white">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 leading-snug">
                        {cleanHeading}
                      </h3>
                      {sec.subhead && (
                        <p className="text-sm font-medium text-rose-600">{sec.subhead}</p>
                      )}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-zinc-200 aspect-[16/10] bg-zinc-100">
                    <img
                      src={photoUrl}
                      alt={cleanHeading}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  {hasExplicitBullets ? (
                    <ul className="grid gap-2 pt-1">
                      {bulletLines.map((line) => (
                        <li
                          key={line}
                          className="flex items-start gap-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-2.5 text-sm sm:text-base text-zinc-800"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base leading-relaxed text-zinc-700">
                      {sec.body}
                    </p>
                  )}
                </section>
              );
            })}
          </div>

          {/* Quick Side-by-Side Recap: Text This Not That + 2-Line Cheat Sheet (Zero Fake Reddit Handles) */}
          <div className="grid gap-4 md:grid-cols-2 border-t border-zinc-200 pt-8">
            <div
              data-testid="guide-text-this-not-that"
              className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-900">
                  <MessageCircle className="h-3.5 w-3.5 text-[#007AFF]" />
                  <span>Text This, Not That</span>
                </div>
                <span className="text-xs text-zinc-400">iMessage</span>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="self-start max-w-[92%] rounded-2xl rounded-bl-sm bg-[#E9E9EB] px-3.5 py-2.5 text-sm text-zinc-900">
                  <div className="text-xs font-semibold text-zinc-500 mb-0.5">
                    Left on Read
                  </div>
                  &ldquo;{visualMeta.dontText}&rdquo;
                </div>

                <div className="self-end max-w-[92%] rounded-2xl rounded-br-sm bg-[#007AFF] px-3.5 py-2.5 text-sm text-white">
                  <div className="text-xs font-semibold text-sky-100 mb-0.5">
                    Gets the Friday Table ✓
                  </div>
                  &ldquo;{visualMeta.doText}&rdquo;
                </div>
              </div>
            </div>

            <div
              data-testid="guide-quick-takeaway"
              className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 flex flex-col justify-between gap-3"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                10-Second Cheat Sheet
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-white p-3 text-zinc-800">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-semibold text-zinc-950">Do this: </span>
                    <span>{visualMeta.doSummary}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-white p-3 text-zinc-800">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  <div>
                    <span className="font-semibold text-zinc-950">Skip this: </span>
                    <span>{visualMeta.skipSummary}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live-Calculated & KV-Persisted 1-Tap Club Poll */}
          <section
            data-testid="guide-club-poll"
            className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 sm:p-6 space-y-3.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="accent">Live Reader Poll</Badge>
              <span className="text-xs font-medium text-zinc-500">
                {selectedPollIdx !== undefined
                  ? `✓ Vote counted • ${totalPollVotes} total votes`
                  : `${totalPollVotes} votes • Tap to vote`}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">
              {visualMeta.poll.question}
            </h3>
            <div className="grid gap-2">
              {visualMeta.poll.options.map((opt, oIdx) => {
                const hasVoted = selectedPollIdx !== undefined;
                const isPicked = selectedPollIdx === oIdx;
                const pct = computedPollPercentages[oIdx] ?? 0;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleVotePoll(oIdx)}
                    className={`relative overflow-hidden rounded-xl border px-4 py-3 text-left text-sm font-medium transition cursor-pointer ${
                      isPicked
                        ? 'border-rose-600 bg-white text-zinc-950 font-semibold'
                        : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    {hasVoted && (
                      <div
                        className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                          isPicked ? 'bg-rose-100/90' : 'bg-zinc-100'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    )}
                    <div className="relative flex items-center justify-between gap-3">
                      <span>
                        {isPicked ? '✓ ' : ''}
                        {opt.label}
                      </span>
                      {hasVoted && (
                        <span className="shrink-0 font-semibold tabular-nums text-rose-600">
                          {pct}%
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Direct Prime Video Links on Movie Watchlists */}
          {isMovieGuide && (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                🎬 Stream Specific Titles Directly on Prime Video
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
                      className="flex items-center justify-between gap-2.5 rounded-xl border border-zinc-200 bg-white p-3 text-xs font-semibold text-zinc-900 hover:border-rose-400 transition"
                    >
                      <span className="leading-snug">{movieItem.name}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Compact 2-Card Shoppable Footer */}
          <section
            data-testid="guide-above-fold-shop"
            className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                🛍️ Editor’s Picks for This Listicle
              </span>
              <span className="text-xs text-zinc-500">
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
                    className="rounded-xl border border-zinc-200 bg-white p-3.5 flex flex-col justify-between gap-2.5"
                  >
                    <div className="space-y-2">
                      <ProductVisualThumbnail item={item} />
                      <h4 className="text-sm font-semibold text-zinc-950 leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
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
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-white transition"
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
        </Card>
      </div>

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </>
  );
};
