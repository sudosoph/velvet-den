import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckSquare,
  ChevronDown,
  Copy,
  ExternalLink,
  Link2,
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

type GuideDirectoryCategory = 'all' | 'etiquette' | 'dilemmas' | 'pop_culture' | 'astro_slang';

interface ZodiacSignInfo {
  id: string;
  label: string;
  symbol: string;
  dates: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  ruler: string;
  herTitle: string;
  herAstroProfile: string;
  himTitle: string;
  himAstroProfile: string;
  herMoodScene: string;
  himMoodScene: string;
}

const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    id: 'aries',
    label: 'Aries',
    symbol: '♈',
    dates: 'Mar 21 – Apr 19',
    element: 'Fire',
    modality: 'Cardinal',
    ruler: 'Mars',
    herTitle: 'The Fearless Mars Trailblazer',
    herAstroProfile:
      'Ruled by Mars, an Aries Cougar knows inside ninety seconds whether the spark is real. She loves bold eye contact, playful competition, and spontaneous Friday plans, and vanishes the instant a man hesitates or acts timid.',
    himTitle: 'The Decisive First-Move Initiator',
    himAstroProfile:
      'An Aries Cub never lingers in two-week texting limbo. He locks the 7:30 corner booth right away, matches her candor word-for-word, and brings energizing weekend momentum.',
    herMoodScene: './images/scenes/velvet-room-bar.jpg',
    himMoodScene: './images/scenes/coastal-convertible.jpg',
  },
  {
    id: 'taurus',
    label: 'Taurus',
    symbol: '♉',
    dates: 'Apr 20 – May 20',
    element: 'Earth',
    modality: 'Fixed',
    ruler: 'Venus',
    herTitle: 'The Venusian Sanctuary Connoisseur',
    herAstroProfile:
      'Ruled by sensual Venus, a Taurus Cougar curates 10/10 home peace: crisp linen, great Pinot, and unhurried touch. You cannot rush her trust with flashy lines, only steady consistency and tactile care.',
    himTitle: 'The Grounded Chef & Slow-Burn Anchor',
    himAstroProfile:
      'A Taurus Cub shows up with farmers-market groceries, cooks from scratch without trashing her kitchen, and savors slow Sunday mornings with zero frantic rushing.',
    herMoodScene: './images/scenes/luxury-bedroom-sanctuary.jpg',
    himMoodScene: './images/scenes/sunday-kitchen-sanctuary.jpg',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    symbol: '♊',
    dates: 'May 21 – Jun 20',
    element: 'Air',
    modality: 'Mutable',
    ruler: 'Mercury',
    herTitle: 'The Mercury Wit & Banter Magnet',
    herAstroProfile:
      'For a Gemini Cougar, attraction starts entirely in the brain. She stays effortlessly youthful because she is endlessly curious, drawn to quick-witted humor, gallery hopping, and late-night storytelling.',
    himTitle: 'The Quick-Silver Conversationalist',
    himAstroProfile:
      'A Gemini Cub keeps every date fresh and unpredictable, volleying dry banter across the bar and turning mundane errands into inside jokes.',
    herMoodScene: './images/scenes/candlelit-cocktails.jpg',
    himMoodScene: './images/scenes/neon-bowling-lounge.jpg',
  },
  {
    id: 'cancer',
    label: 'Cancer',
    symbol: '♋',
    dates: 'Jun 21 – Jul 22',
    element: 'Water',
    modality: 'Cardinal',
    ruler: 'The Moon',
    herTitle: 'The Lunar Sanctuary & Deep Intuition Queen',
    herAstroProfile:
      'Selective at the front gate and fiercely devoted once you are inside, a Cancer Cougar reads emotional honesty instantly. She melts when someone cares for the woman behind her busy daytime armor.',
    himTitle: 'The Emotionally Fluent Keeper',
    himAstroProfile:
      'A Cancer Cub remembers her exact morning coffee order, checks she got home safe, and builds a warm, fiercely loyal private world for two.',
    herMoodScene: './images/scenes/cozy-rain-suite.jpg',
    himMoodScene: './images/scenes/sunday-kitchen-sanctuary.jpg',
  },
  {
    id: 'leo',
    label: 'Leo',
    symbol: '♌',
    dates: 'Jul 23 – Aug 22',
    element: 'Fire',
    modality: 'Fixed',
    ruler: 'The Sun',
    herTitle: 'The Solar Main-Character Icon',
    herAstroProfile:
      'Radiant, generous, and unapologetic, a Leo Cougar thrives on old-school courtship, genuine admiration, and a partner who holds her hand proudly in every room they enter.',
    himTitle: 'The Proud Front-Row Hype Partner',
    himAstroProfile:
      'Zero fragile ego: a Leo Cub pulls out her chair, cheers her career wins louder than anyone, and treats walking beside an accomplished woman like winning the championship.',
    herMoodScene: './images/scenes/palm-springs-resort.jpg',
    himMoodScene: './images/scenes/wedding-gala-cheers.jpg',
  },
  {
    id: 'virgo',
    label: 'Virgo',
    symbol: '♍',
    dates: 'Aug 23 – Sep 22',
    element: 'Earth',
    modality: 'Mutable',
    ruler: 'Mercury',
    herTitle: 'The Discerning Detail & High-Standards Muse',
    herAstroProfile:
      'A Virgo Cougar clocks clean fingernails, punctuation, and follow-through in five seconds flat. She rarely falls for loud bravado, yet softens completely when a partner handles life’s details cleanly.',
    himTitle: 'The Acts-of-Service Precision Host',
    himAstroProfile:
      'A Virgo Cub’s love language is pure competence: 63°F bedroom pre-chilled, lidded bathroom bin spotless, car detailed, and Friday reservations confirmed by noon.',
    herMoodScene: './images/scenes/wine-bar-booth.jpg',
    himMoodScene: './images/scenes/luxury-bedroom-sanctuary.jpg',
  },
  {
    id: 'libra',
    label: 'Libra',
    symbol: '♎',
    dates: 'Sep 23 – Oct 22',
    element: 'Air',
    modality: 'Cardinal',
    ruler: 'Venus',
    herTitle: 'The Candlelit Venusian Aesthete',
    herAstroProfile:
      'Graceful, social, and allergic to crude openers, a Libra Cougar falls for ambiance, tailored style, car-door manners, and effortless conversational flow.',
    himTitle: 'The Old-Soul Diplomat & Charmer',
    himAstroProfile:
      'A Libra Cub blends twenty-something warmth with classic romance, picking moody vinyl wine bars and gliding smoothly into her friend group.',
    herMoodScene: './images/scenes/cougarmarket-wine.jpg',
    himMoodScene: './images/scenes/wine-bar-booth.jpg',
  },
  {
    id: 'scorpio',
    label: 'Scorpio',
    symbol: '♏',
    dates: 'Oct 23 – Nov 21',
    element: 'Water',
    modality: 'Fixed',
    ruler: 'Pluto & Mars',
    herTitle: 'The Magnetic Slow-Burn Powerhouse',
    herAstroProfile:
      'A Scorpio Cougar has built-in radar for fake flexing and bucket-list tourists. She craves privacy, locked-in eye contact, and all-in emotional and physical voltage.',
    himTitle: 'The Locked-In Devoted Pursuer',
    himAstroProfile:
      'A Scorpio Cub keeps his phone face-down all night, never gossips to his buddies, and matches her intensity with steady, unshakeable focus.',
    herMoodScene: './images/scenes/candlelit-cocktails.jpg',
    himMoodScene: './images/scenes/hotel-pool-sauna.jpg',
  },
  {
    id: 'sagittarius',
    label: '♐',
    symbol: '♐',
    dates: 'Nov 22 – Dec 21',
    element: 'Fire',
    modality: 'Mutable',
    ruler: 'Jupiter',
    herTitle: 'The Passport-Ready Free Spirit',
    herAstroProfile:
      'Ruled by expansive Jupiter, a Sagittarius Cougar values freedom, big laughs, and weekend escapes. Clingy jealousy or heavy guilt-trips end the romance overnight.',
    himTitle: 'The Spontaneous Weekend Co-Pilot',
    himAstroProfile:
      'Upbeat, philosophical, and packed in ten minutes, a Sagittarius Cub turns coastal drives, trail runs, and last-minute flights into pure joy.',
    herMoodScene: './images/scenes/coastal-convertible.jpg',
    himMoodScene: './images/scenes/canyon-sunrise-trail.jpg',
  },
  {
    id: 'capricorn',
    label: 'Capricorn',
    symbol: '♑',
    dates: 'Dec 22 – Jan 19',
    element: 'Earth',
    modality: 'Cardinal',
    ruler: 'Saturn',
    herTitle: 'The Executive Saturn Queen Off the Clock',
    herAstroProfile:
      'A Capricorn Cougar runs complex worlds all week; after 7 PM Friday she wants calm competence so she can finally exhale and turn her decision brain off.',
    himTitle: 'The Old-Head Ambition & Reliability Rock',
    himAstroProfile:
      'Mature well beyond his birth certificate, a Capricorn Cub respects her calendar, builds his own career steadily, and delivers 100% on his word.',
    herMoodScene: './images/scenes/velvet-room-bar.jpg',
    himMoodScene: './images/scenes/terminal-b-arrivals.jpg',
  },
  {
    id: 'aquarius',
    label: 'Aquarius',
    symbol: '♒',
    dates: 'Jan 20 – Feb 18',
    element: 'Air',
    modality: 'Fixed',
    ruler: 'Uranus & Saturn',
    herTitle: 'The Unbothered Rule-Breaker & Visionary',
    herAstroProfile:
      'Conventional timelines bore an Aquarius Cougar to tears. Living-Apart-Together, unconventional age gaps, and deep midnight debates are her natural habitat.',
    himTitle: 'The Independent Mind-First Rebel',
    himAstroProfile:
      'An Aquarius Cub couldn’t care less what strangers think, falls in love with her originality first, and honors her solo recharge nights.',
    herMoodScene: './images/scenes/havana-salsa-studio.jpg',
    himMoodScene: './images/scenes/campus-autumn-sushi.jpg',
  },
  {
    id: 'pisces',
    label: 'Pisces',
    symbol: '♓',
    dates: 'Feb 19 – Mar 20',
    element: 'Water',
    modality: 'Mutable',
    ruler: 'Neptune',
    herTitle: 'The Velvet Romantic & Intuitive Muse',
    herAstroProfile:
      'Warm, poetic, and deeply sensual, a Pisces Cougar treasures handwritten notes, vinyl records in the rain, and partners who stay tender in a cynical world.',
    himTitle: 'The Soulful Sweetheart & Attentive Lover',
    himAstroProfile:
      'A Pisces Cub brings unguarded affection, poetic intuition, and unhurried presence that makes every weekend feel like an indie romance film.',
    herMoodScene: './images/scenes/cozy-rain-suite.jpg',
    himMoodScene: './images/scenes/candlelit-cocktails.jpg',
  },
];

// Fix Sagittarius label typo cleanly right in place:
ZODIAC_SIGNS[8].label = 'Sagittarius';

function computeZodiacPairing(her: ZodiacSignInfo, him: ZodiacSignInfo) {
  const pairKey = `${her.element}-${him.element}`;
  let rating = '93% Slow-Burn Magnetic Fit';
  let dateIdea = 'Candlelit corner wine booth + unhurried vinyl nightcap';
  let scenePhoto = './images/scenes/wine-bar-booth.jpg';
  let pairingHeadline = `${her.element} Poise Meets ${him.element} Devotion`;
  let whyItWorks = `Her ${her.label} (${her.ruler}) standards pair intriguingly with his ${him.label} (${him.ruler}) energy: she brings seasoned clarity while he brings fresh, attentive momentum that keeps both of them out of dating ruts.`;
  let blindSpot =
    her.modality === 'Fixed' && him.modality === 'Fixed'
      ? 'Two Fixed signs rarely budge first after a disagreement. Trade stubborn silence for humor early.'
      : 'Align your weekday texting tempo in Month One so neither reads busy work hours as cooling off.';
  let meters = [
    { label: '🔥 Chemistry & Banter', pct: 93 },
    { label: '🛎️ Friday Planning', pct: 92 },
    { label: '🛋️ Sunday Peace', pct: 94 },
    { label: '🌶️ Long-Term Spark', pct: 91 },
  ];

  if (her.id === him.id) {
    rating = '95% Mirror-Sign Voltage';
    dateIdea = 'Late-night chef’s counter + trading stories until midnight';
    scenePhoto = './images/scenes/campus-autumn-sushi.jpg';
    pairingHeadline = `Double ${her.label}: Instant Mutual Recognition`;
    whyItWorks = `Sharing ${her.label} (${her.element}, ruled by ${her.ruler}) across a 10+ year gap means zero translation needed: she already mastered the exact instincts he is growing into, creating uncanny bedroom and humor sync.`;
    blindSpot = `Because you share the same ${her.label} blind spots, take turns initiating hard timeline talks instead of mirroring each other’s avoidance.`;
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
    rating = '97% High-Octane Banter & Spark';
    dateIdea = '18-hour boutique hotel rooftop + midnight pool escape';
    scenePhoto = './images/scenes/hotel-pool-sauna.jpg';
    pairingHeadline = 'Air Feeds Fire: Electric Wit & Zero Boredom';
    whyItWorks = `Classic astrological combustion: ${her.label}’s ${her.element.toLowerCase()} confidence and ${him.label}’s ${him.element.toLowerCase()} curiosity spark inside five minutes. Expect nonstop laughter, spontaneous overnight trips, and proud public chemistry.`;
    blindSpot =
      'With so much fast banter and motion, remember to slow down for quiet, grounded Sunday check-ins.';
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
    pairingHeadline = 'Earth Holds Water: Deep Sensory Loyalty';
    whyItWorks = `The highest-lasting age-gap pairing in astrology: ${her.label} (${her.element}) and ${him.label} (${him.element}) blend tactile luxury, emotional safety, and real-world reliability. Neither plays app games; both crave an unhurried private sanctuary.`;
    blindSpot =
      'This pairing is so cozy indoors that you may skip going out for weeks; book one dressed-up Friday night a month.';
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
    rating = '96% Glamour × Grounded Anchor';
    dateIdea = '6:30 PM hotel-bar martinis + pre-booked corner banquette';
    scenePhoto = './images/scenes/velvet-room-bar.jpg';
    pairingHeadline = 'Power Couple Polarity: Heat Meets Follow-Through';
    whyItWorks = `${her.label} and ${him.label} balance passion with execution: Fire brings boldness and playfulness so life never turns routine, while Earth handles reservations, logistics, and grown-up follow-through.`;
    blindSpot =
      'Fire moves on impulse while Earth plans ahead; give twenty-four hours’ notice on weekend getaways and everyone wins.';
    meters = [
      { label: '🔥 Chemistry & Banter', pct: 96 },
      { label: '🛎️ Friday Planning', pct: 98 },
      { label: '🛋️ Sunday Peace', pct: 94 },
      { label: '🌶️ Long-Term Spark', pct: 95 },
    ];
  } else if (pairKey === 'Fire-Fire' || pairKey === 'Water-Water') {
    rating = '96% Undeniable Magnetic Heat';
    dateIdea = 'Top-down coastal sunset drive + oceanfront drinks';
    scenePhoto = './images/scenes/coastal-convertible.jpg';
    pairingHeadline =
      pairKey === 'Fire-Fire'
        ? 'Double Fire: Fearless Adventure & Chemistry'
        : 'Double Water: Locked-In Intuition & Depth';
    whyItWorks =
      pairKey === 'Fire-Fire'
        ? `An ${her.label} Cougar with a ${him.label} Cub skips every ounce of awkwardness: direct pursuit, high physical chemistry, and zero care for onlookers.`
        : `An ${her.label} Cougar with a ${him.label} Cub communicates in glances across a crowded room, building fierce private intimacy and emotional trust.`;
    blindSpot =
      pairKey === 'Fire-Fire'
        ? 'Keep playful debates playful; let small ego flare-ups cool over good food.'
        : 'Say needs out loud instead of expecting even a psychic partner to read every silence.';
    meters = [
      { label: '🔥 Chemistry & Banter', pct: 99 },
      { label: '🛎️ Friday Planning', pct: 93 },
      { label: '🛋️ Sunday Peace', pct: 92 },
      { label: '🌶️ Long-Term Spark', pct: 97 },
    ];
  } else if (pairKey === 'Earth-Earth' || pairKey === 'Air-Air') {
    rating = '95% Effortless Wavelength Match';
    dateIdea =
      pairKey === 'Earth-Earth'
        ? 'Vineyard tasting + quiet boutique stayover'
        : 'Thursday gallery opening + competitive retro bowling';
    scenePhoto =
      pairKey === 'Earth-Earth'
        ? './images/scenes/cougarmarket-wine.jpg'
        : './images/scenes/neon-bowling-lounge.jpg';
    pairingHeadline =
      pairKey === 'Earth-Earth'
        ? 'Double Earth: Five-Star Standards & Calm Trust'
        : 'Double Air: Endless Wit & Independent Space';
    whyItWorks =
      pairKey === 'Earth-Earth'
        ? `${her.label} and ${him.label} speak the exact same language of punctuality, quality wine, clean spaces, and actions over empty promises.`
        : `${her.label} and ${him.label} can talk for four hours straight over one bottle of Sancerre while fully respecting each other’s solo routines.`;
    blindSpot =
      pairKey === 'Earth-Earth'
        ? 'Leave work calendars at the door at 7:30 PM so dates stay romantic rather than logistical.'
        : 'Anchor great banter with tactile romance and locked calendar dates.';
    meters = [
      { label: '🔥 Chemistry & Banter', pct: 95 },
      { label: '🛎️ Friday Planning', pct: 96 },
      { label: '🛋️ Sunday Peace', pct: 96 },
      { label: '🌶️ Long-Term Spark', pct: 94 },
    ];
  }

  return { rating, dateIdea, scenePhoto, pairingHeadline, whyItWorks, blindSpot, meters };
}

interface GuideVisualMeta {
  categoryPill: string;
  directoryGroup: Exclude<GuideDirectoryCategory, 'all'>;
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
    directoryGroup: 'astro_slang',
    heroPhoto: './images/scenes/velvet-room-bar.jpg',
    sectionPhotos: [
      './images/cast/summer-blonde-33f.jpg',
      './images/cast/sienna-38f.jpg',
      './images/cast/claire-45f.jpg',
      './images/cast/celeste-2.jpg',
      './images/cast/vivienne-61f.jpg',
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
    categoryPill: '10-Item Hosting Check',
    directoryGroup: 'etiquette',
    heroPhoto: './images/scenes/sunday-kitchen-sanctuary.jpg',
    sectionPhotos: [
      './images/products/hosting-lidded-bin-soap.jpg',
      './images/products/date-night-oud-bergamot.jpg',
      './images/products/cub-grooming-beard-skincare-kit.jpg',
      './images/scenes/luxury-bedroom-sanctuary.jpg',
      './images/products/percale-hosting-sheets.jpg',
      './images/products/cooling-bamboo-sheets.jpg',
      './images/scenes/candlelit-cocktails.jpg',
      './images/scenes/wine-bar-booth.jpg',
      './images/products/silk-pillowcase-sleepover-duo.jpg',
      './images/scenes/cozy-rain-suite.jpg',
    ],
    dontText: 'come thru whenever lol my roommate left dishes in the sink',
    doText: 'Dinner is on, lamps are dimmed, and sparkling water is chilled whenever you get here.',
    doSummary: 'Covered bathroom bin, four real pillows, warm lamps, silk case, and 8 AM coffee.',
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
    directoryGroup: 'etiquette',
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
    categoryPill: 'All-Era Decoder',
    directoryGroup: 'astro_slang',
    heroPhoto: './images/scenes/wine-bar-booth.jpg',
    sectionPhotos: [
      './images/scenes/campus-autumn-sushi.jpg',
      './images/scenes/velvet-room-bar.jpg',
      './images/scenes/neon-bowling-lounge.jpg',
      './images/scenes/candlelit-cocktails.jpg',
      './images/scenes/coastal-convertible.jpg',
    ],
    dontText: 'yo u look crazy good for ur age whats ur snap??',
    doText: 'Here is my number. Want to grab 7:30 drinks Thursday at Left Bank?',
    doSummary: 'Trade real phone numbers, trust Gen-X punctuation, and confirm at noon.',
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
    categoryPill: 'Real Dilemmas',
    directoryGroup: 'dilemmas',
    heroPhoto: './images/scenes/cozy-rain-suite.jpg',
    sectionPhotos: [
      './images/scenes/wedding-gala-cheers.jpg',
      './images/scenes/velvet-room-bar.jpg',
      './images/scenes/canyon-sunrise-trail.jpg',
      './images/scenes/palm-springs-resort.jpg',
      './images/scenes/sunday-kitchen-sanctuary.jpg',
      './images/scenes/hotel-pool-sauna.jpg',
    ],
    dontText: 'wait maybe come to my office party next year instead so nobody gossips??',
    doText: 'One King bed is plenty, thanks. Proud to walk into the holiday gala with you Friday.',
    doSummary: 'Date proudly in daylight, align on kids by Month 3, and split trips proportionally.',
    skipSummary: 'Keeping anyone a secret, dodging timeline math, or letting strangers shame you.',
    poll: {
      question: 'Which real-world age-gap dilemma needs the clearest early boundary?',
      options: [
        { label: 'Zero "dirty little secret" hiding from friends or work events', baseVotes: 82 },
        { label: 'Honest Month-3 talk on whether he wants future kids', baseVotes: 41 },
        { label: 'Fair proportional vacation budgets without bruised egos', baseVotes: 19 },
      ],
    },
  },
  'black-cat-older-woman-golden-retriever-younger-man-dating-guide': {
    categoryPill: 'Relationship Polarity',
    directoryGroup: 'dilemmas',
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
    directoryGroup: 'pop_culture',
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
    directoryGroup: 'dilemmas',
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
    directoryGroup: 'astro_slang',
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
    directoryGroup: 'dilemmas',
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
    directoryGroup: 'etiquette',
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
    directoryGroup: 'pop_culture',
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
    directoryGroup: 'astro_slang',
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
    directoryGroup: 'pop_culture',
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
    directoryGroup: 'pop_culture',
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
    directoryGroup: 'etiquette',
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

const MOVIE_WATCHLIST_IDS = [
  'no-hard-feelings-jlaw-prime',
  'babygirl-movie-prime',
  'idea-of-you-movie-book',
  'bridget-jones-cougar-town-watch',
  'the-rebound-zeta-jones-prime',
];

const DIRECTORY_FILTERS: { id: GuideDirectoryCategory; label: string }[] = [
  { id: 'all', label: `⚡ All ${JOURNAL_ARTICLES.length} Listicles` },
  { id: 'etiquette', label: '🏠 Hosting & Offline Etiquette' },
  { id: 'dilemmas', label: '💬 Real-Life Dilemmas' },
  { id: 'pop_culture', label: '🎬 Movies, TV & Celebs' },
  { id: 'astro_slang', label: '🔮 Astro & Era Decoder' },
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
  const [directoryCategory, setDirectoryCategory] = useState<GuideDirectoryCategory>('all');
  const [showAllGuidesGrid, setShowAllGuidesGrid] = useState(true);
  const [hostingChecks, setHostingChecks] = useState<number[]>(() => loadHostingChecks());
  const [herSignId, setHerSignId] = useState<string>('scorpio');
  const [himSignId, setHimSignId] = useState<string>('taurus');
  const [pollVotesBySlug, setPollVotesBySlug] = useState<Record<string, number>>(() =>
    loadSavedPollVotes(),
  );
  const [serverPercentagesBySlug, setServerPercentagesBySlug] = useState<
    Record<string, number[]>
  >({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  const activeIdx = Math.max(
    0,
    JOURNAL_ARTICLES.findIndex((a) => a.slug === selectedSlug),
  );
  const active = JOURNAL_ARTICLES[activeIdx] ?? JOURNAL_ARTICLES[0];
  const prevArticle =
    JOURNAL_ARTICLES[(activeIdx - 1 + JOURNAL_ARTICLES.length) % JOURNAL_ARTICLES.length];
  const nextArticle = JOURNAL_ARTICLES[(activeIdx + 1) % JOURNAL_ARTICLES.length];
  const visualMeta = getGuideVisualMeta(active.slug);
  const showAstroMatcher =
    astroOpen || active.slug === 'astrology-zodiac-compatibility-older-woman-younger-man';
  const isHostingChecklistGuide =
    active.slug === 'first-time-hosting-older-woman-apartment-checklist';

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
        const readerAnchor = document.getElementById('club-guide-reader-card');
        if (readerAnchor && typeof readerAnchor.scrollIntoView === 'function') {
          readerAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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

  const guideBaseUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}guides/${active.slug}/`;

  const copyQuickLink = (url: string, key: string) => {
    sfx.messagePop();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        void navigator.clipboard.writeText(url);
      }
    } catch {
      // Ignore clipboard error
    }
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2200);
  };

  const handleShareGuide = () => {
    setSharePayload({
      title: active.headline,
      message: `📖 Cougars & Cubs Magazine: "${active.headline}" (${active.readTime})`,
      url: guideBaseUrl,
      shareSurface: 'guide',
      discordMarkdown: `**📖 ${active.headline}** (${active.readTime})\n${active.metaDescription}\nRead here: ${guideBaseUrl}`,
    });
  };

  const handleShareSectionItem = (itemNum: number, cleanHeading: string, subhead?: string) => {
    const itemUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?journal=${encodeURIComponent(
      active.slug,
    )}#item-${itemNum}`;
    copyQuickLink(itemUrl, `sec-${itemNum}`);
    setSharePayload({
      title: `#${String(itemNum).padStart(2, '0')} ${cleanHeading}`,
      message: `🔥 #${itemNum} from "${active.headline}": ${cleanHeading}${
        subhead ? ` (${subhead})` : ''
      }`,
      url: itemUrl,
      shareSurface: 'guide',
      discordMarkdown: `**#${itemNum} ${cleanHeading}** (${active.headline})\n${
        subhead ?? ''
      }\nRead & share: ${itemUrl}`,
    });
  };

  const handleShareZodiac = () => {
    const astroUrl = `${BRAND_CONFIG.publicBaseUrl.replace(
      /\/?$/,
      '/',
    )}?journal=astrology-zodiac-compatibility-older-woman-younger-man`;
    setSharePayload({
      title: `${herSign.symbol} ${herSign.label} Her × ${himSign.symbol} ${himSign.label} Cub`,
      message: `🔮 Astro Match: ${herSign.symbol} ${herSign.label} Her × ${himSign.symbol} ${himSign.label} Cub, ${zodiacMatch.rating}! Test your signs:`,
      url: astroUrl,
      shareSurface: 'guide',
      discordMarkdown: `**🔮 ${herSign.symbol} ${herSign.label} Her × ${himSign.symbol} ${himSign.label} Cub (${zodiacMatch.rating})**\n${zodiacMatch.whyItWorks}\nTest your signs: ${astroUrl}`,
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

  const visibleDirectoryArticles = JOURNAL_ARTICLES.filter((art) => {
    if (directoryCategory === 'all') return true;
    return getGuideVisualMeta(art.slug).directoryGroup === directoryCategory;
  });

  return (
    <>
      <div className="mx-auto w-full max-w-5xl space-y-8 animate-stage-in">
        {/* Top Magazine Masthead + Quick Astro Toggle + Easy Multi-Row Directory */}
        <header className="space-y-5 border-b border-zinc-200 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <Badge variant="accent">Club Magazine • 16 Shoppable Photo Listicles</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                Viral Photo Listicles, Visual Charts &amp; Date-Night Playbooks
              </h1>
              <p className="text-sm sm:text-base text-zinc-600">
                Browse any of the 16 illustrated guides below, test your 12×12 star signs, or share individual picks straight to your group chat.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => setAstroOpen((v) => !v)}
                className="min-h-11 border-rose-200 bg-rose-50/70 text-sm font-semibold text-zinc-950 hover:bg-rose-100/80"
              >
                <span>
                  🔮 Quick Astro: {herSign.symbol} × {himSign.symbol}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-rose-600 transition-transform ${
                    showAstroMatcher ? 'rotate-180' : ''
                  }`}
                />
              </Button>
              <Button
                variant="outline"
                onClick={() => copyQuickLink(guideBaseUrl, 'top-copy')}
                className="min-h-11 text-sm"
              >
                <Copy className="h-4 w-4 text-zinc-500" />
                <span>{copiedKey === 'top-copy' ? 'Copied Link!' : 'Copy Link'}</span>
              </Button>
              <Button variant="accent" onClick={handleShareGuide} className="min-h-11 text-sm">
                <Share2 className="h-4 w-4" />
                <span>Share Listicle</span>
              </Button>
            </div>
          </div>

          {/* 5 Featured 1-Tap Editorial Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-zinc-200 pb-3">
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
                slug: 'older-woman-younger-man-relationship-problems-kids-stigma',
                label: '💬 6 Real Dilemmas',
              },
              {
                slug: 'master-list-cougar-cub-movies-older-woman-younger-man',
                label: '🎬 22-Film Watchlist',
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
                  className={`min-h-10 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                    isCurrent
                      ? 'border-rose-600 bg-rose-600 text-white shadow-2xs'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-zinc-950'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* Always-Browsable Multi-Row Magazine Directory Grid (Zero Hidden Horizontal Strip!) */}
          <div className="space-y-3" data-testid="guide-directory-browser">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {DIRECTORY_FILTERS.map((cat) => {
                  const activeCat = directoryCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setDirectoryCategory(cat.id);
                        setShowAllGuidesGrid(true);
                      }}
                      className={`min-h-9 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                        activeCat
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200/80 hover:text-zinc-950'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                data-testid="toggle-all-guides-grid"
                onClick={() => setShowAllGuidesGrid((v) => !v)}
                className="text-sm font-semibold text-rose-600 hover:text-zinc-950 transition-colors cursor-pointer"
              >
                {showAllGuidesGrid
                  ? `Reading #${String(activeIdx + 1).padStart(2, '0')} • Collapse Grid ↑`
                  : `View All ${JOURNAL_ARTICLES.length} Guides ↓`}
              </button>
            </div>

            {showAllGuidesGrid && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {visibleDirectoryArticles.map((art) => {
                  const globalIdx = JOURNAL_ARTICLES.findIndex((a) => a.slug === art.slug);
                  const isSelected = art.slug === active.slug;
                  const artMeta = getGuideVisualMeta(art.slug);
                  return (
                    <button
                      key={art.slug}
                      type="button"
                      onClick={() => handleSelectArticle(art.slug)}
                      className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition cursor-pointer w-full ${
                        isSelected
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm ring-2 ring-rose-500/30'
                          : 'border-zinc-200 bg-white text-zinc-900 hover:border-rose-300 hover:bg-zinc-50'
                      }`}
                    >
                      <img
                        src={artMeta.heroPhoto}
                        alt=""
                        loading="lazy"
                        className="h-12 w-12 shrink-0 rounded-lg object-cover object-center border border-zinc-200/50"
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div
                          className={`text-xs font-semibold ${
                            isSelected ? 'text-rose-300' : 'text-rose-600'
                          }`}
                        >
                          #{String(globalIdx + 1).padStart(2, '0')} • {artMeta.categoryPill}
                        </div>
                        <div className="text-sm font-semibold leading-snug line-clamp-2">
                          {art.seoTitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </header>

        {/* Pure Astrological 12×12 Cougar × Cub Matcher (Zero Random Game Cast, Crisp Large Typography) */}
        {showAstroMatcher && (
          <Card className="p-6 sm:p-8 space-y-6" data-testid="zodiac-12x12-matcher">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">
                    <Sparkles className="h-3.5 w-3.5" /> 12×12 Astrological Matcher
                  </Badge>
                  <Badge variant="default">{zodiacMatch.rating}</Badge>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                  🔮 {herSign.symbol} {herSign.label} Her × {himSign.symbol} {himSign.label} Cub
                </h2>
              </div>
              <Button
                variant="outline"
                onClick={handleShareZodiac}
                className="min-h-10 text-sm font-semibold"
              >
                <Share2 className="h-4 w-4 text-rose-600" />
                <span>Share Astrological Reading</span>
              </Button>
            </div>

            {/* Sign Pickers */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-3">
                <label className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold uppercase tracking-wide text-rose-600">
                    🐆 Her Cougar Star Sign
                  </span>
                  <select
                    aria-label="Her Star Sign"
                    value={herSignId}
                    onChange={(e) => {
                      sfx.messagePop();
                      setHerSignId(e.target.value);
                    }}
                    className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900"
                  >
                    {ZODIAC_SIGNS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.symbol} {s.label} ({s.element} • {s.dates})
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
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
                        className={`flex flex-col items-center justify-center rounded-xl border py-2 px-1.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                          activeChip
                            ? 'border-rose-600 bg-rose-600 text-white shadow-2xs'
                            : 'border-zinc-200 bg-white text-zinc-800 hover:border-rose-300'
                        }`}
                      >
                        <span className="text-base leading-none">{s.symbol}</span>
                        <span className="mt-1 truncate max-w-full">{s.label.slice(0, 3)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-3">
                <label className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold uppercase tracking-wide text-zinc-900">
                    🐕 His Cub Star Sign
                  </span>
                  <select
                    aria-label="His Star Sign"
                    value={himSignId}
                    onChange={(e) => {
                      sfx.messagePop();
                      setHimSignId(e.target.value);
                    }}
                    className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900"
                  >
                    {ZODIAC_SIGNS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.symbol} {s.label} ({s.element} • {s.dates})
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
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
                        className={`flex flex-col items-center justify-center rounded-xl border py-2 px-1.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                          activeChip
                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-2xs'
                            : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400'
                        }`}
                      >
                        <span className="text-base leading-none">{s.symbol}</span>
                        <span className="mt-1 truncate max-w-full">{s.label.slice(0, 3)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Readable, Zero-Squint Astrological Archetype Cards (Pure Astrology + Editorial Mood Scenes) */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden flex flex-col">
                <div className="relative h-36 w-full overflow-hidden bg-zinc-100">
                  <img
                    src={herSign.herMoodScene}
                    alt={`${herSign.label} Cougar astrological mood`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/25 to-transparent flex items-end p-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                        {herSign.symbol} {herSign.label} Cougar • {herSign.element} ({herSign.modality}) • Ruled by {herSign.ruler}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug">
                        {herSign.herTitle}
                      </h3>
                    </div>
                  </div>
                </div>
                <p className="p-4 sm:p-5 text-sm sm:text-base text-zinc-700 leading-relaxed">
                  {herSign.herAstroProfile}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden flex flex-col">
                <div className="relative h-36 w-full overflow-hidden bg-zinc-100">
                  <img
                    src={himSign.himMoodScene}
                    alt={`${himSign.label} Cub astrological mood`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/25 to-transparent flex items-end p-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                        {himSign.symbol} {himSign.label} Cub • {himSign.element} ({himSign.modality}) • Ruled by {himSign.ruler}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug">
                        {himSign.himTitle}
                      </h3>
                    </div>
                  </div>
                </div>
                <p className="p-4 sm:p-5 text-sm sm:text-base text-zinc-700 leading-relaxed">
                  {himSign.himAstroProfile}
                </p>
              </div>
            </div>

            {/* Pairing Synthesis + Ideal Date Scene + 4 Compatibility Meters */}
            <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr] items-stretch">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  ✨ Why {herSign.label} × {himSign.label} Sparks Across an Age Gap
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-zinc-950 leading-snug">
                  {zodiacMatch.pairingHeadline}
                </h4>
                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                  {zodiacMatch.whyItWorks}
                </p>
                <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-zinc-800 leading-relaxed">
                  <strong className="font-semibold text-zinc-950">🔭 Watch-Out Cue: </strong>
                  {zodiacMatch.blindSpot}
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4">
                <div className="relative overflow-hidden rounded-2xl border border-zinc-200 min-h-[130px] flex-1">
                  <img
                    src={zodiacMatch.scenePhoto}
                    alt="Ideal astrological date setting"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/35 to-transparent flex items-end p-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                        Ideal First Date Setting
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                        {zodiacMatch.dateIdea}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  data-testid="zodiac-meter-grid"
                  className="grid grid-cols-2 gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4"
                >
                  {zodiacMatch.meters.map((m) => (
                    <div key={m.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-900">
                        <span className="truncate">{m.label}</span>
                        <span className="font-bold text-rose-600 shrink-0">{m.pct}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                        <div
                          className="h-full rounded-full bg-rose-600 transition-all duration-300"
                          style={{ width: `${m.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Airy Single-Column BuzzFeed Photo Listicle Canvas */}
        <Card
          id="club-guide-reader-card"
          className="mx-auto max-w-3xl p-6 sm:p-10 space-y-10 scroll-mt-20"
        >
          {/* Clean Title + Readable Intro + Viral Share Strip + Widescreen Hero */}
          <header className="space-y-4 border-b border-zinc-200 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">
                  #{String(activeIdx + 1).padStart(2, '0')} • {visualMeta.categoryPill}
                </Badge>
                <Badge variant="outline">{active.readTime}</Badge>
                {isHostingChecklistGuide && active.checklistItems && (
                  <Badge variant="default">
                    ✓ {hostingChecks.length} / {active.sections.length} Ticked Off
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyQuickLink(guideBaseUrl, 'hero-copy')}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs sm:text-sm font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                  <Link2 className="h-3.5 w-3.5 text-rose-600" />
                  <span>{copiedKey === 'hero-copy' ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareGuide}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 px-3.5 text-xs sm:text-sm font-semibold text-white cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 leading-tight">
              {active.headline}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-zinc-700">
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

          {/* Spacious BuzzFeed Numbered Photo Listicle Stream (Wrapped in guide-hosting-checklist on the 10-Pt Guide so all 10 illustrated shop picks live inside!) */}
          <div
            data-testid={isHostingChecklistGuide ? 'guide-hosting-checklist' : undefined}
            className="space-y-10"
          >
            {isHostingChecklistGuide && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <Badge variant="accent">Interactive 10-of-10 Visual Apartment Audit</Badge>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">
                    Tick Off All 10 Illustrated Upgrades Below Before She Comes Over
                  </h3>
                </div>
                <Badge variant="default">
                  {hostingChecks.length} / {active.sections.length} Ready
                </Badge>
              </div>
            )}

          <div className="space-y-12">
            {active.sections.map((sec, idx) => {
              const itemNumber = idx + 1;
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
              const linkedProduct = sec.affiliateId
                ? getAffiliateById(sec.affiliateId)
                : undefined;
              const isChecked = hostingChecks.includes(idx);

              return (
                <section
                  key={sec.heading}
                  id={`item-${itemNumber}`}
                  data-testid="guide-section-visual-card"
                  className="space-y-4 scroll-mt-24 border-b border-zinc-100 pb-10 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-base font-bold text-white">
                        {String(itemNumber).padStart(2, '0')}
                      </span>
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 leading-snug">
                          {cleanHeading}
                        </h3>
                        {sec.subhead && (
                          <p className="text-sm sm:text-base font-semibold text-rose-600">
                            {sec.subhead}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleShareSectionItem(itemNumber, cleanHeading, sec.subhead)
                      }
                      aria-label={`Share item ${itemNumber}: ${cleanHeading}`}
                      className="shrink-0 inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs sm:text-sm font-semibold text-zinc-700 hover:border-rose-300 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>
                        {copiedKey === `sec-${itemNumber}`
                          ? 'Copied!'
                          : `Share #${String(itemNumber).padStart(2, '0')}`}
                      </span>
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-zinc-200 aspect-[16/10] bg-zinc-100">
                    <img
                      src={photoUrl}
                      alt={cleanHeading}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  {hasExplicitBullets ? (
                    <ul className="grid gap-2.5 pt-1">
                      {bulletLines.map((line) => (
                        <li
                          key={line}
                          className="flex items-start gap-3 rounded-xl border border-zinc-200/90 bg-zinc-50/70 px-4 py-3 text-base text-zinc-800 leading-relaxed"
                        >
                          <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-rose-600" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base sm:text-lg leading-relaxed text-zinc-800">
                      {sec.body}
                    </p>
                  )}

                  {/* Interactive Tick-Off Button Right Inside Each of the 10 Hosting Cards */}
                  {isHostingChecklistGuide && (
                    <button
                      type="button"
                      onClick={() => toggleHostingCheck(idx)}
                      className={`inline-flex min-h-11 w-full sm:w-auto items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm sm:text-base font-semibold transition cursor-pointer ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                          : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <Square className="h-4 w-4 shrink-0 text-zinc-400" />
                      )}
                      <span>
                        {isChecked
                          ? `✓ Upgrade #${itemNumber} Ready in My Apartment`
                          : `Mark Upgrade #${itemNumber} Ready`}
                      </span>
                    </button>
                  )}

                  {/* Illustrated BuzzFeed Shop Pick Card With Real Product Photo & Fun Description */}
                  {linkedProduct && (
                    <div
                      data-testid="guide-inline-shop-card"
                      className="rounded-2xl border border-zinc-200 bg-zinc-50/75 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
                    >
                      <div className="sm:w-44 shrink-0">
                        <ProductVisualThumbnail item={linkedProduct} compact />
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="accent">{linkedProduct.badge}</Badge>
                          <span className="text-xs font-semibold text-zinc-500">
                            {linkedProduct.priceDisplay}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-zinc-950 leading-snug">
                          {linkedProduct.name}
                        </h4>
                        <p className="text-sm text-zinc-700 leading-relaxed">
                          {linkedProduct.cheekyPitch}
                        </p>
                        <div className="pt-1 flex flex-wrap items-center gap-2">
                          <a
                            href={buildAffiliateUrl(
                              linkedProduct,
                              `listicle_item_${active.slug}_${itemNumber}`,
                            )}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            onClick={() =>
                              trackEvent('affiliate_clicked', {
                                item_id: linkedProduct.id,
                                surface: 'journal_inline_item',
                                slug: active.slug,
                              })
                            }
                            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 text-xs sm:text-sm font-semibold text-white transition"
                          >
                            <span>
                              {isPrimeVideoDigitalPick(linkedProduct)
                                ? `Stream on Prime Video`
                                : `Shop Pick on Amazon`}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
          </div>

          {/* Quick Side-by-Side Recap: Text This Not That + 2-Line Cheat Sheet */}
          <div className="grid gap-4 md:grid-cols-2 border-t border-zinc-200 pt-8">
            <div
              data-testid="guide-text-this-not-that"
              className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-900">
                  <MessageCircle className="h-4 w-4 text-[#007AFF]" />
                  <span>Text This, Not That</span>
                </div>
                <span className="text-xs font-medium text-zinc-500">iMessage</span>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="self-start max-w-[92%] rounded-2xl rounded-bl-sm bg-[#E9E9EB] px-4 py-3 text-sm sm:text-base text-zinc-900">
                  <div className="text-xs font-semibold text-zinc-500 mb-0.5">
                    Left on Read
                  </div>
                  &ldquo;{visualMeta.dontText}&rdquo;
                </div>

                <div className="self-end max-w-[92%] rounded-2xl rounded-br-sm bg-[#007AFF] px-4 py-3 text-sm sm:text-base text-white">
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
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                10-Second Cheat Sheet
              </div>
              <div className="space-y-2.5 text-sm sm:text-base">
                <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-white p-3.5 text-zinc-800">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-semibold text-zinc-950">Do this: </span>
                    <span>{visualMeta.doSummary}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-white p-3.5 text-zinc-800">
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
              <span className="text-xs sm:text-sm font-medium text-zinc-600">
                {selectedPollIdx !== undefined
                  ? `✓ Vote counted • ${totalPollVotes} total votes`
                  : `${totalPollVotes} votes • Tap to vote`}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950">
              {visualMeta.poll.question}
            </h3>
            <div className="grid gap-2.5">
              {visualMeta.poll.options.map((opt, oIdx) => {
                const hasVoted = selectedPollIdx !== undefined;
                const isPicked = selectedPollIdx === oIdx;
                const pct = computedPollPercentages[oIdx] ?? 0;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleVotePoll(oIdx)}
                    className={`relative overflow-hidden rounded-xl border px-4 py-3.5 text-left text-sm sm:text-base font-medium transition cursor-pointer ${
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
                        <span className="shrink-0 font-bold tabular-nums text-rose-600">
                          {pct}%
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Illustrated Prime Video Cards on Movie Watchlists */}
          {isMovieGuide && (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-3.5">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                🎬 Stream Essential Watchlist Titles on Prime Video
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {MOVIE_WATCHLIST_IDS.map((id) => {
                  const movieItem = getAffiliateById(id);
                  if (!movieItem) return null;
                  return (
                    <a
                      key={id}
                      href={buildAffiliateUrl(movieItem, `watchlist_${active.slug}`)}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex flex-col justify-between gap-2.5 rounded-xl border border-zinc-200 bg-white p-3.5 hover:border-rose-400 transition"
                    >
                      <div className="space-y-2">
                        <ProductVisualThumbnail item={movieItem} compact />
                        <div className="text-sm font-bold text-zinc-950 leading-snug">
                          {movieItem.name}
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-2">
                          {movieItem.cheekyPitch}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                        <span>Watch on Prime Video</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Compact 2-Card Shoppable Footer */}
          <section
            data-testid="guide-above-fold-shop"
            className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 space-y-3.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                🛍️ Editor’s Top Picks for This Listicle
              </span>
              <span className="text-xs text-zinc-500">
                {AFFILIATE_SUPPORT_COPY.compactInline}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {active.featuredAffiliateIds.slice(0, 2).map((id) => {
                const item = getAffiliateById(id);
                if (!item) return null;
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-zinc-200 bg-white p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2.5">
                      <ProductVisualThumbnail item={item} />
                      <h4 className="text-base font-bold text-zinc-950 leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-sm text-zinc-600 leading-relaxed">
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
                      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs sm:text-sm font-semibold text-white transition"
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

          {/* Bottom Viral Share + Keep-Reading Next/Previous Listicle Cards */}
          <footer className="space-y-5 border-t border-zinc-200 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/60 px-5 py-4">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-zinc-950">
                  Know someone who needs this listicle before Friday?
                </div>
                <p className="text-xs sm:text-sm text-zinc-600">
                  Send it straight to iMessage, Reddit, or your group chat in one tap.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => copyQuickLink(guideBaseUrl, 'footer-copy')}
                  className="min-h-10 text-sm bg-white"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copiedKey === 'footer-copy' ? 'Copied!' : 'Copy Link'}</span>
                </Button>
                <Button variant="accent" onClick={handleShareGuide} className="min-h-10 text-sm">
                  <Share2 className="h-4 w-4" />
                  <span>Share This Guide</span>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {prevArticle && (
                <button
                  type="button"
                  aria-label="Previous Guide"
                  onClick={() => handleSelectArticle(prevArticle.slug)}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-left hover:border-rose-300 hover:bg-zinc-50 transition cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 shrink-0 text-zinc-500" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-zinc-500">Previous Guide</div>
                    <div className="text-sm font-bold text-zinc-950 line-clamp-1">
                      {prevArticle.headline}
                    </div>
                  </div>
                </button>
              )}
              {nextArticle && (
                <button
                  type="button"
                  aria-label="Read Next Listicle"
                  onClick={() => handleSelectArticle(nextArticle.slug)}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-left hover:border-rose-300 hover:bg-zinc-50 transition cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-rose-600">Read Next Listicle</div>
                    <div className="text-sm font-bold text-zinc-950 line-clamp-1">
                      {nextArticle.headline}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-rose-600" />
                </button>
              )}
            </div>
          </footer>

          <CrowdsourceSubmissionBar surface="guides" compact />
        </Card>
      </div>

      {sharePayload && (
        <SocialShareSheetModal
          payload={sharePayload}
          onClose={() => setSharePayload(null)}
        />
      )}
    </>
  );
};
