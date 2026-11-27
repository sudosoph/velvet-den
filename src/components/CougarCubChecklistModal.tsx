import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, CheckSquare, Play, RotateCcw, Share2, Sparkles, Square, X } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { trackEvent } from '../lib/analytics';
import { awardPassportBonusXp } from '../lib/gamification';
import { sfx } from '../lib/sound';
import { CrowdsourceSubmissionBar } from './CrowdsourceSubmissionBar';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

interface CougarCubChecklistModalProps {
  open: boolean;
  referralCode?: string;
  onClose: () => void;
  onClaimChecklistReward: (rewardKey: string, amount: number) => boolean;
  onPlayMatchedScenario: (episodeId: string) => void;
}

export type ChecklistLifestyleTier = 'rookie' | 'intermediate' | 'deep_cuts';

export interface ChecklistItemSpec {
  id: string;
  tier: ChecklistLifestyleTier;
  points: 2 | 3 | 5;
  text: string;
  episodeId: string;
}

export const CHECKLIST_TIER_META: Record<
  ChecklistLifestyleTier,
  {
    badge: string;
    title: string;
    subtitle: string;
    pointsLabel: string;
  }
> = {
  rookie: {
    badge: '🐣 Level 1 • Rookie Initiation',
    title: 'First-Drink & App Culture Shocks',
    subtitle: 'Timeline math, ID flashlights, and surviving the opening DM filter.',
    pointsLabel: '+2 pts each',
  },
  intermediate: {
    badge: '🔥 Level 2 • Regular Rotation',
    title: 'Sleepover Rules, Gym Lore & Upgrading',
    subtitle: 'Lidded bins, 62°F cooling sheets, retiring 5-in-1 wash, and hotel-bar eye contact.',
    pointsLabel: '+3 pts each',
  },
  deep_cuts: {
    badge: '👑 Level 3 • Deep Cuts & Legends',
    title: 'Advanced Lifestyle & Hall-of-Fame Moments',
    subtitle: '"Two Queen beds?!", same-age-mom graduations, and Linen-Apron Houseboy Sundays.',
    pointsLabel: '+5 pts each',
  },
};

export const COUGAR_CUB_CHECKLIST_ITEMS: ChecklistItemSpec[] = [
  // === TIER 1: ROOKIE INITIATION (10 items × 2 pts = 20 pts) ===
  {
    id: 'math2008',
    tier: 'rookie',
    points: 2,
    text: 'Silently calculated where each of you was in 2008 within twenty minutes of sitting down on Date #1.',
    episodeId: 'velvet-room',
  },
  {
    id: 'late1900s',
    tier: 'rookie',
    points: 2,
    text: 'Heard (or accidentally called) 1998 "back in the late 1900s" out loud across a candlelit table.',
    episodeId: 'hawthorne-campus',
  },
  {
    id: 'bucketlistblock',
    tier: 'rookie',
    points: 2,
    text: 'Blocked a "never been with a cougar, bucket list" tourist who misspelled "discreet" as "discrete" in his bio.',
    episodeId: 'velvet-room',
  },
  {
    id: 'snapchatick',
    tier: 'rookie',
    points: 2,
    text: 'Got asked for your Snapchat handle past age 35 and felt your soul physically leave your body.',
    episodeId: 'code-switch-texting',
  },
  {
    id: 'uvbouncer',
    tier: 'rookie',
    points: 2,
    text: 'Watched a lounge bouncer UV-scan HIS driver’s license for forty-five seconds while waving her straight inside.',
    episodeId: 'havana-salsa',
  },
  {
    id: 'song-age-four',
    tier: 'rookie',
    points: 2,
    text: 'A classic early-2000s radio anthem came on in the car and the Cub beamed: "Oh yeah, my favorite song when I was four!"',
    episodeId: 'cougarmarket',
  },
  {
    id: 'genx-period-punctuation',
    tier: 'rookie',
    points: 2,
    text: 'Decoded that a text reading "Sounds good." with a period means genuine Gen-X happiness, not impending doom.',
    episodeId: 'velvet-room',
  },
  {
    id: 'gmail-older-license',
    tier: 'rookie',
    points: 2,
    text: 'Realized one partner’s firstname.lastname Gmail address is older than the other’s learner’s permit.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'nirvana-tshirt-check',
    tier: 'rookie',
    points: 2,
    text: 'Verified a date wearing a vintage Nirvana tee could actually name three songs off In Utero.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'podcast-mic-vetting',
    tier: 'rookie',
    points: 2,
    text: 'Dropped a casual Date #1 litmus question just to verify he has never owned a clip-on street-interview podcast mic.',
    episodeId: 'velvet-room',
  },

  // === TIER 2: INTERMEDIATE ROTATION (10 items × 3 pts = 30 pts) ===
  {
    id: 'liddedbin',
    tier: 'intermediate',
    points: 3,
    text: 'Inspected a twenty-something’s bathroom within thirty seconds for botanical soap, a clean hand towel, and a lidded bin.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'seatwarmer',
    tier: 'intermediate',
    points: 3,
    text: 'Used a phone flashlight on a tiny dim-lit menu while he quietly pre-heated your passenger-seat warmer.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'cubsplaining',
    tier: 'intermediate',
    points: 3,
    text: 'Caught a Cub mid-"Cubsplain" lecturing an actual homeowner on Fleetwood Mac, vinyl pressings, or mortgage rates.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'gymheadphones',
    tier: 'intermediate',
    points: 3,
    text: 'Respected the Sacred Gym Headphone Law for three full weeks before finally saying hello at the smoothie counter.',
    episodeId: 'dawn-lap-pool',
  },
  {
    id: 'cubgrooming',
    tier: 'intermediate',
    points: 3,
    text: '"Groomed" a Cub exclusively via beard oil, mineral SPF 50, and retiring his 5-in-1 neon-blue body wash.',
    episodeId: 'dawn-lap-pool',
  },
  {
    id: 'bamboo62',
    tier: 'intermediate',
    points: 3,
    text: 'Locked the bedroom thermostat at 62°F with cooling bamboo sheets (and two separate duvets) for 3 AM heat waves.',
    episodeId: 'palisades-racquet',
  },
  {
    id: 'babygirlmilk',
    tier: 'intermediate',
    points: 3,
    text: 'Sent or received a cheeky "Babygirl" glass-of-milk wink (or three-olive dirty martini) across a solo hotel bar.',
    episodeId: 'velvet-room',
  },
  {
    id: 'bigcarl',
    tier: 'intermediate',
    points: 3,
    text: 'Poured a giant "Cougar Town" Big Carl wine glass on Friday night and called it "just one glass."',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'early-dinner-convert',
    tier: 'intermediate',
    points: 3,
    text: 'Converted wholeheartedly to 7:15 PM reservations so you’re home in silk loungewear by ten next to a stocked wine fridge.',
    episodeId: 'velvet-room',
  },
  {
    id: 'blackcatgolden',
    tier: 'intermediate',
    points: 3,
    text: 'Lived the 🐈‍⬛ Black Cat Cougar × 🐕 Golden Retriever Cub dynamic: she paced the first three dates, and his tail only wagged harder.',
    episodeId: 'st-jude-coffee',
  },

  // === TIER 3: DEEP CUTS & LIFESTYLE APEX (10 items × 5 pts = 50 pts) ===
  {
    id: 'twoqueens',
    tier: 'deep_cuts',
    points: 5,
    text: 'Had a hotel clerk ask "Two Queen beds?" at check-in, or a waiter ask about separate checks "for you and your son."',
    episodeId: 'waiter-son-incident',
  },
  {
    id: 'sameageshock',
    tier: 'deep_cuts',
    points: 5,
    text: 'Realized post-kiss that he is the EXACT same age as your baby sibling, nephew, or grown child.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'sameagemom',
    tier: 'deep_cuts',
    points: 5,
    text: 'Met his parents for Sunday dinner and realized you and his mom graduated high school the exact same year.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'houseboysunday',
    tier: 'deep_cuts',
    points: 5,
    text: 'Unlocked Linen-Apron Houseboy Sunday: he cooked from scratch, folded every towel, and loaded the dishwasher like an engineer.',
    episodeId: 'cougarmarket',
  },
  {
    id: 'bench225',
    tier: 'deep_cuts',
    points: 5,
    text: 'Hit 5×225 on bench press (or trained specifically) to unlock upstairs stairway-carry privileges.',
    episodeId: 'dawn-lap-pool',
  },
  {
    id: 'softgoodboy',
    tier: 'deep_cuts',
    points: 5,
    text: 'Melted into an instant grin when she lifted your chin with two fingers and murmured "Good boy" (or got a British "Sorted xx").',
    episodeId: 'hawthorne-campus',
  },
  {
    id: 'getaway18h',
    tier: 'deep_cuts',
    points: 5,
    text: 'Pulled off the spontaneous 18-hour escape: quick 6 PM voice call → rooftop cocktails → midnight hotel pool & cedar sauna.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'maui-condo-twist',
    tier: 'deep_cuts',
    points: 5,
    text: 'Had a college-age Cub invite you to "my place in Hawaii" before admitting ten minutes later it’s his parents’ Maui condo.',
    episodeId: 'palisades-racquet',
  },
  {
    id: 'weddingplusone',
    tier: 'deep_cuts',
    points: 5,
    text: 'Walked into a wedding as each other’s proud +1, turned curious stares into comped dessert, and owned the slow dance.',
    episodeId: 'havana-salsa',
  },
  {
    id: 'anniversary365',
    tier: 'deep_cuts',
    points: 5,
    text: 'Celebrated a 6-Month or 1-Year age-gap anniversary long after nosy acquaintances predicted "two fun weekends."',
    episodeId: 'terminal-b-airport',
  },
];

export type ChecklistRoleTab = 'cougars' | 'cubs' | 'couples';

export const CUB_ONLY_CHECKLIST_ITEMS: ChecklistItemSpec[] = [
  // === TIER 1: ROOKIE CUB INITIATION (10 × 2 pts = 20 pts) ===
  {
    id: 'cub-lidded-bin-run',
    tier: 'rookie',
    points: 2,
    text: 'Made an emergency Target run for a lidded bathroom bin, botanical hand soap, and four real pillows before she saw your apartment.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'cub-punctuation-upgrade',
    tier: 'rookie',
    points: 2,
    text: 'Retired lowercase "u up 💀" texting cold turkey after seeing how crisp her first two sentences were.',
    episodeId: 'velvet-room',
  },
  {
    id: 'cub-under-table-google',
    tier: 'rookie',
    points: 2,
    text: 'Surreptitiously Googled a 1990s film or band reference under the dinner table so you wouldn’t look twelve.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'cub-id-carded-solo',
    tier: 'rookie',
    points: 2,
    text: 'Got thoroughly carded by the cocktail bartender while she received an immediate "Good evening" and wine list.',
    episodeId: 'velvet-room',
  },
  {
    id: 'cub-noon-confirmation',
    tier: 'rookie',
    points: 2,
    text: 'Sent a calm 12:00 PM Friday confirmation text with the restaurant address already booked so she made zero decisions.',
    episodeId: 'velvet-room',
  },
  {
    id: 'cub-banned-for-your-age',
    tier: 'rookie',
    points: 2,
    text: 'Permanently deleted the phrase "you look amazing for your age" from your vocabulary on pain of walking home.',
    episodeId: 'hawthorne-campus',
  },
  {
    id: 'cub-earbuds-patience',
    tier: 'rookie',
    points: 2,
    text: 'Held back politely at the gym or lap pool until both of her AirPods clicked into the case.',
    episodeId: 'dawn-lap-pool',
  },
  {
    id: 'cub-maam-slip-recovery',
    tier: 'rookie',
    points: 2,
    text: 'Accidentally let a polite Southern "Yes ma’am" slip out once and watched her arch one dangerous eyebrow.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'cub-phone-facedown',
    tier: 'rookie',
    points: 2,
    text: 'Kept your phone silenced in your jacket pocket from appetizer to check without glancing at sports scores once.',
    episodeId: 'velvet-room',
  },
  {
    id: 'cub-car-door-reflex',
    tier: 'rookie',
    points: 2,
    text: 'Opened her passenger door and pre-heated her seat warmer without acting like you deserved a medal.',
    episodeId: 'terminal-b-airport',
  },

  // === TIER 2: REGULAR ROTATION CUB (10 × 3 pts = 30 pts) ===
  {
    id: 'cub-retired-5in1',
    tier: 'intermediate',
    points: 3,
    text: 'Swapped 5-in-1 neon-blue shower gel for cedarwood wash, beard oil, and daily mineral SPF 50 on your neck.',
    episodeId: 'dawn-lap-pool',
  },
  {
    id: 'cub-budget-date-pride',
    tier: 'intermediate',
    points: 3,
    text: 'Planned and paid cleanly for a thoughtful neighborhood spot inside your real budget instead of flexing or whining about money.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'cub-silk-pillowcase-side',
    tier: 'intermediate',
    points: 3,
    text: 'Kept a dedicated 22-momme silk pillowcase and spare phone charger ready on her side of your bed.',
    episodeId: 'st-jude-coffee',
  },
  {
    id: 'cub-thermostat-survival',
    tier: 'intermediate',
    points: 3,
    text: 'Survived a 62°F freezing bedroom thermostat with heroic silence because her sleep sanctuary comes first.',
    episodeId: 'palisades-racquet',
  },
  {
    id: 'cub-silent-workday-zen',
    tier: 'intermediate',
    points: 3,
    text: 'Stayed completely unbothered when her executive workday ran silent from 9 AM to 6 PM without double-texting.',
    episodeId: 'hawthorne-campus',
  },
  {
    id: 'cub-heavy-bags-one-hand',
    tier: 'intermediate',
    points: 3,
    text: 'Carried both heavy weekender bags or antique-market crates in one trip so her hands stayed free for espresso.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'cub-zero-podcast-lectures',
    tier: 'intermediate',
    points: 3,
    text: 'Caught yourself before summarizing a three-hour podcast to a woman who already runs an entire department.',
    episodeId: 'velvet-room',
  },
  {
    id: 'cub-silk-island-cooking',
    tier: 'intermediate',
    points: 3,
    text: 'Sat her on the guest side of the counter with chilled wine while you cooked dinner from scratch and washed every pan.',
    episodeId: 'cougarmarket',
  },
  {
    id: 'cub-bestie-tribunal-pass',
    tier: 'intermediate',
    points: 3,
    text: 'Passed her protective best friends’ 90-second brunch or backyard BBQ interrogation with flying colors.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'cub-babysitter-clock-honor',
    tier: 'intermediate',
    points: 3,
    text: 'Arrived ten minutes early whenever a babysitter or post-shift sleep window was on the clock.',
    episodeId: 'st-jude-coffee',
  },

  // === TIER 3: S-RANK GOLDEN CUB LEGENDS (10 × 5 pts = 50 pts) ===
  {
    id: 'cub-public-hand-hold',
    tier: 'deep_cuts',
    points: 5,
    text: 'Walked into a packed restaurant or friend’s party holding her hand with unmistakable pride when people looked twice.',
    episodeId: 'havana-salsa',
  },
  {
    id: 'cub-shut-down-buddy',
    tier: 'deep_cuts',
    points: 5,
    text: 'Shut down a friend’s tired age-gap joke in one calm sentence without raising your voice or making it awkward.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'cub-prepped-mom-early',
    tier: 'deep_cuts',
    points: 5,
    text: 'Briefed your mom warmly a full week before Sunday dinner so zero people blinked at the table.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'cub-good-boy-grin',
    tier: 'deep_cuts',
    points: 5,
    text: 'Felt your pulse jump when she touched your jaw and murmured "Good boy" after you handled every Friday detail.',
    episodeId: 'hawthorne-campus',
  },
  {
    id: 'cub-lat-keys-respect',
    tier: 'deep_cuts',
    points: 5,
    text: 'Honored her peaceful solo house without stealth-leaving clutter until she explicitly cleared a drawer for you.',
    episodeId: 'velvet-room',
  },
  {
    id: 'cub-waiter-son-comeback',
    tier: 'deep_cuts',
    points: 5,
    text: 'Turned a clueless clerk’s "your mom?" or "two beds?" slip into an effortless kiss on her hand and a laugh.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'cub-fixed-latch-unasked',
    tier: 'deep_cuts',
    points: 5,
    text: 'Quietly fixed a sticky gate latch, cabinet hinge, or car wiper at her house without waiting to be asked.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'cub-corporate-gala-poise',
    tier: 'deep_cuts',
    points: 5,
    text: 'Put on dark tailoring for her work gala, charmed her colleagues for two hours, and let her shine center stage.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'cub-carry-upstairs-cardio',
    tier: 'deep_cuts',
    points: 5,
    text: 'Backed up your twenty-something stamina brag on a steep 6 AM coastal ridge run AND after midnight.',
    episodeId: 'dawn-lap-pool',
  },
  {
    id: 'cub-long-haul-partner',
    tier: 'deep_cuts',
    points: 5,
    text: 'Proved every skeptic wrong by showing up as her steady, devoted partner past the one-year mark.',
    episodeId: 'terminal-b-airport',
  },
];

export const COUPLES_DATENIGHT_CHECKLIST_ITEMS: ChecklistItemSpec[] = [
  // === TIER 1: TONIGHT'S EASY DATE-NIGHT SPARKS (10 × 2 pts = 20 pts) ===
  {
    id: 'pair-highschool-playlist',
    tier: 'rookie',
    points: 2,
    text: 'Swap phones and play each other the #1 song from the summer each of you got your driver’s license.',
    episodeId: 'cougarmarket',
  },
  {
    id: 'pair-bar-alibi-game',
    tier: 'rookie',
    points: 2,
    text: 'Sit side-by-side at a hotel bar, order one signature martini + one mocktail/milk wink, and invent backstories for neighboring booths.',
    episodeId: 'velvet-room',
  },
  {
    id: 'pair-movie-realism-audit',
    tier: 'rookie',
    points: 2,
    text: 'Stream No Hard Feelings, Babygirl, or The Idea of You together and pause twice to debate what Hollywood got right vs. hilarious.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'pair-zero-phone-lockbox',
    tier: 'rookie',
    points: 2,
    text: 'Put both phones in the coat closet at 7:30 PM sharp for an entire two-hour candlelit dinner.',
    episodeId: 'velvet-room',
  },
  {
    id: 'pair-slang-quiz-swap',
    tier: 'rookie',
    points: 2,
    text: 'Quiz each other on five 1990s cultural touchstones vs. five Gen-Z slang phrases; loser makes morning coffee.',
    episodeId: 'hawthorne-campus',
  },
  {
    id: 'pair-farmers-market-dare',
    tier: 'rookie',
    points: 2,
    text: 'Hit an 8 AM weekend farmers market with $25 cash and build the best impromptu picnic plate together.',
    episodeId: 'cougarmarket',
  },
  {
    id: 'pair-cookbook-roulette',
    tier: 'rookie',
    points: 2,
    text: 'Flip a cookbook open blindfolded on Sunday afternoon and cook whatever page lands before sunset.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'pair-bookstore-gift-pick',
    tier: 'rookie',
    points: 2,
    text: 'Split up inside an indie bookstore for fifteen minutes and buy the one paperback the other person MUST read.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'pair-sunset-walk-polaroid',
    tier: 'rookie',
    points: 2,
    text: 'Take a golden-hour neighborhood walk with hot drinks and snap one candid photo with zero retakes.',
    episodeId: 'st-jude-coffee',
  },
  {
    id: 'pair-three-card-questions',
    tier: 'rookie',
    points: 2,
    text: 'Deal three deep late-night couples prompts on the sofa after midnight with vinyl playing low.',
    episodeId: 'velvet-room',
  },

  // === TIER 2: WEEKEND RITUALS TOGETHER (10 × 3 pts = 30 pts) ===
  {
    id: 'pair-apron-role-reversal',
    tier: 'intermediate',
    points: 3,
    text: 'Run Official Houseboy Sunday: he ties on the chef apron and handles every course while she grades from the counter with wine.',
    episodeId: 'cougarmarket',
  },
  {
    id: 'pair-salsa-or-clay-bet',
    tier: 'intermediate',
    points: 3,
    text: 'Book a beginner salsa rotation or twilight mixed-doubles set with a dinner wager on the winner.',
    episodeId: 'havana-salsa',
  },
  {
    id: 'pair-cold-plunge-sauna',
    tier: 'intermediate',
    points: 3,
    text: 'Do a three-minute ocean or cold plunge followed by cedar sauna steam with zero complaining allowed.',
    episodeId: 'dawn-lap-pool',
  },
  {
    id: 'pair-35mm-midnight-screening',
    tier: 'intermediate',
    points: 3,
    text: 'Dress up for a late revival cinema screening and debate the ending over midnight fries and red wine.',
    episodeId: 'left-bank-books',
  },
  {
    id: 'pair-mystery-reservation',
    tier: 'intermediate',
    points: 3,
    text: 'Take turns planning a surprise Friday date where the other partner only gets the dress code and pickup time.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'pair-kitchen-slow-dance',
    tier: 'intermediate',
    points: 3,
    text: 'Put Al Green or Sade on in the kitchen while garlic simmers and dance through one full song barefoot.',
    episodeId: 'havana-salsa',
  },
  {
    id: 'pair-vintage-flea-hunt',
    tier: 'intermediate',
    points: 3,
    text: 'Hunt an early-morning flea market for one ridiculous barware or vinyl treasure for the house.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'pair-6am-summit-coffee',
    tier: 'intermediate',
    points: 3,
    text: 'Conquer a 6:30 AM ridge hike or beach swim together before grabbing warm croissants in sweats.',
    episodeId: 'st-jude-coffee',
  },
  {
    id: 'pair-blind-wine-tasting',
    tier: 'intermediate',
    points: 3,
    text: 'Wrap three bottles (or zero-proof botanicals) in paper bags at home and score a blind tasting for two.',
    episodeId: 'velvet-room',
  },
  {
    id: 'pair-favor-voucher-redeem',
    tier: 'intermediate',
    points: 3,
    text: 'Write three custom handwritten date-or-favor IOUs each and redeem the boldest one before Sunday night.',
    episodeId: 'palisades-racquet',
  },

  // === TIER 3: HALL-OF-FAME COUPLES ADVENTURES (10 × 5 pts = 50 pts) ===
  {
    id: 'pair-carryon-18h-escape',
    tier: 'deep_cuts',
    points: 5,
    text: 'Pack one carry-on duffel each on two hours’ notice for a spontaneous coastal or desert hotel escape.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'pair-own-the-room-toast',
    tier: 'deep_cuts',
    points: 5,
    text: 'Walk arm-in-arm into a black-tie wedding or gala and own the slow dance like you invented romance.',
    episodeId: 'havana-salsa',
  },
  {
    id: 'pair-host-friends-dinner',
    tier: 'deep_cuts',
    points: 5,
    text: 'Co-host a string-light backyard dinner mixing both friend circles seamlessly over great food.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'pair-roadtrip-top-down',
    tier: 'deep_cuts',
    points: 5,
    text: 'Drive two hours up the coast or out to Joshua Tree at dusk with zero podcasts and a shared vinyl-era queue.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'pair-airport-curbside-hero',
    tier: 'deep_cuts',
    points: 5,
    text: 'Surprise each other curbside at airport arrivals with their exact hot coffee order and dinner handled.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'pair-build-or-plant-something',
    tier: 'deep_cuts',
    points: 5,
    text: 'Build a piece of furniture, hang gallery art, or plant an herb box together without an argument.',
    episodeId: 'velvet-palms-bbq',
  },
  {
    id: 'pair-sunrise-canoe-or-surf',
    tier: 'deep_cuts',
    points: 5,
    text: 'Paddle out at sunrise together before the rest of the town wakes up, followed by diner pancakes.',
    episodeId: 'dawn-lap-pool',
  },
  {
    id: 'pair-handwritten-letter-swap',
    tier: 'deep_cuts',
    points: 5,
    text: 'Write each other an honest handwritten card naming the exact moment you knew the age gap didn’t matter.',
    episodeId: 'hawthorne-campus',
  },
  {
    id: 'pair-passport-stamp-trip',
    tier: 'deep_cuts',
    points: 5,
    text: 'Book a real passport-stamp trip together and laugh when hotel reception double-checks your suite booking.',
    episodeId: 'terminal-b-airport',
  },
  {
    id: 'pair-annual-anniversary-ritual',
    tier: 'deep_cuts',
    points: 5,
    text: 'Return to the exact bar, coffee cart, or booth where Date #1 happened to toast another full year.',
    episodeId: 'velvet-room',
  },
];

export const CHECKLIST_DECK_BY_TAB: Record<ChecklistRoleTab, ChecklistItemSpec[]> = {
  cougars: COUGAR_CUB_CHECKLIST_ITEMS,
  cubs: CUB_ONLY_CHECKLIST_ITEMS,
  couples: COUPLES_DATENIGHT_CHECKLIST_ITEMS,
};

export function computeChecklistScore(
  checkedIds: readonly string[],
  items: readonly ChecklistItemSpec[] = COUGAR_CUB_CHECKLIST_ITEMS,
): number {
  const checkedSet = new Set(checkedIds);
  return items.reduce((sum, item) => sum + (checkedSet.has(item.id) ? item.points : 0), 0);
}

function rankForScore(score: number): { title: string; subtitle: string; recommendedEp: string } {
  if (score >= 85) {
    return {
      title: '👑 HALL-OF-FAME COUGAR & CUB APEX',
      subtitle: 'You didn’t just date across the gap, you practically wrote the Sunset Hills bylaws.',
      recommendedEp: 'babygirl-hotel-bar-milk-or-martini',
    };
  }
  if (score >= 60) {
    return {
      title: '🐆 CERTIFIED SHORT-LEASH & LINEN-APRON PRO',
      subtitle: 'Survived "Two Queen beds?!", same-age-mom math, 62°F cooling sheets, and Houseboy Sundays.',
      recommendedEp: 'spontaneous-18h-pool-sauna-getaway',
    };
  }
  if (score >= 35) {
    return {
      title: '🔥 SEASONED SUNSET HILLS REGULAR',
      subtitle: 'Lidded-bin certified, immune to Cubsplaining, and fluent in 7:15 PM reservations.',
      recommendedEp: 'hotel-checkin-two-queen-beds-mixup',
    };
  }
  if (score >= 16) {
    return {
      title: '🍸 FIRST-DRINK CONTENDER',
      subtitle: 'Decoded Gen-X periods & UV bouncer scans, ready for Sleepover & Deep-Cut territory!',
      recommendedEp: 'velvet-room',
    };
  }
  return {
    title: '🐣 CURIOUS CUB / WINDOW SHOPPER',
    subtitle: 'Just lowered the age slider, step into Sunset Hills and earn your stripes!',
    recommendedEp: 'babygirl-hotel-bar-milk-or-martini',
  };
}

const CHECKLIST_STORAGE_KEYS: Record<ChecklistRoleTab, string> = {
  cougars: 'cc_club_checklist_v1',
  cubs: 'cc_club_checklist_cubs_v1',
  couples: 'cc_club_checklist_couples_v1',
};

export function loadChecklistCheckedIds(tab: ChecklistRoleTab = 'cougars'): string[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(CHECKLIST_STORAGE_KEYS[tab]);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    const validIds = new Set(CHECKLIST_DECK_BY_TAB[tab].map((i) => i.id));
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string' && validIds.has(x))
      : [];
  } catch {
    return [];
  }
}

export function toggleChecklistItemInStorage(
  id: string,
  tab: ChecklistRoleTab = 'cougars',
): string[] {
  const curr = loadChecklistCheckedIds(tab);
  const next = curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(CHECKLIST_STORAGE_KEYS[tab], JSON.stringify(next));
    }
  } catch {
    // Ignore storage block
  }
  return next;
}

function buildScoreDiagnostic(
  score: number,
  tab: ChecklistRoleTab,
  rookiePts: number,
  interPts: number,
  deepPts: number,
): {
  percentileLabel: string;
  meaningHeadline: string;
  meaningBody: string;
} {
  const percentile = Math.min(99, Math.max(8, Math.round(12 + score * 0.87)));
  const topPct = Math.max(1, 100 - percentile);
  const percentileLabel =
    score === 0 ? 'Unranked • Tick Your First Box' : `Top ${topPct}% of Club Players`;

  if (tab === 'couples') {
    if (score >= 65) {
      return {
        percentileLabel,
        meaningHeadline: `What ${score}/100 Means: Power-Couple Chemistry Unlocked`,
        meaningBody: `You two don’t just go out to eat; you actively build rituals, laugh at generational plot twists (${rookiePts}/20 spark pts), and travel like seasoned co-conspirators (${deepPts}/50 adventure pts).`,
      };
    }
    if (score >= 25) {
      return {
        percentileLabel,
        meaningHeadline: `What ${score}/100 Means: Real Date-Night Momentum`,
        meaningBody: `You’ve cleared the easy chemistry dares (${rookiePts}/20) and started building weekend traditions (${interPts}/30). Pick one 5-point adventure below for your next Friday night!`,
      };
    }
    return {
      percentileLabel,
      meaningHeadline: `What ${score}/100 Means: Fresh Date-Night Slate`,
      meaningBody: `Think of this 100-point board as your shared bucket list. Pick two +2pt sparks tonight (zero budget required) and watch how fast inside jokes stack up.`,
    };
  }

  if (tab === 'cubs') {
    if (score >= 65) {
      return {
        percentileLabel,
        meaningHeadline: `What ${score}/100 Means: Certified 5-Star Partner (Top ${topPct}%)`,
        meaningBody: `At ${score}/100, you’ve graduated light-years past tourist curiosity: lidded-bin & hosting game (${interPts}/30) is dialed, and your public pride + family poise (${deepPts}/50) put you in rare air.`,
      };
    }
    if (score >= 25) {
      return {
        percentileLabel,
        meaningHeadline: `What ${score}/100 Means: Promising Contender Moving Up`,
        meaningBody: `You’ve survived opening-date etiquette (${rookiePts}/20) and upgraded real habits (${interPts}/30). Where Cubs jump from 40s to 80+ is public hand-holding, cooking off-duty, and zero-ego steadiness.`,
      };
    }
    return {
      percentileLabel,
      meaningHeadline: `What ${score}/100 Means: Day-One Cub Recruit`,
      meaningBody: `Everyone starts under 25! Nail the 2-point basics first (crisp punctuation, noon Friday confirmation, lidded bathroom bin) before auditioning for Deep-Cut status.`,
    };
  }

  // Cougars tab
  if (score >= 65) {
    return {
      percentileLabel,
      meaningHeadline: `What ${score}/100 Means: Sunset Hills Legend (Top ${topPct}%)`,
      meaningBody: `Scoring ${score}/100 means you aren’t dipping a toe in: you filter tourists in ten seconds (${rookiePts}/20), enforce 62°F sanctuary standards (${interPts}/30), and have lived real-world Deep Cuts (${deepPts}/50) with zero apologies.`,
    };
  }
  if (score >= 25) {
    return {
      percentileLabel,
      meaningHeadline: `What ${score}/100 Means: Seasoned Chapter-Two Regular`,
      meaningBody: `At ${score}/100, you know the difference between a Tuesday love-bomber and a Golden Retriever keeper (${interPts}/30 Regular pts). Next frontier: spontaneous 18-hour escapes and unapologetic +1 pride!`,
    };
  }
  return {
    percentileLabel,
    meaningHeadline: `What ${score}/100 Means: Newly Lowered Slider`,
    meaningBody: `Under 25 points means you’re right at the fun discovery stage! Check off the 2-point initiation laughs first and test your instincts in Swipe or Out In The Wild.`,
  };
}

const TIER_ORDER: ChecklistLifestyleTier[] = ['rookie', 'intermediate', 'deep_cuts'];

export const CougarCubChecklistModal: React.FC<CougarCubChecklistModalProps> = ({
  open,
  referralCode,
  onClose,
  onClaimChecklistReward,
  onPlayMatchedScenario,
}) => {
  const [activeTab, setActiveTab] = useState<ChecklistRoleTab>('cougars');
  const [checkedByTab, setCheckedByTab] = useState<Record<ChecklistRoleTab, string[]>>(() => ({
    cougars: loadChecklistCheckedIds('cougars'),
    cubs: loadChecklistCheckedIds('cubs'),
    couples: loadChecklistCheckedIds('couples'),
  }));
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  React.useEffect(() => {
    if (open) {
      setCheckedByTab({
        cougars: loadChecklistCheckedIds('cougars'),
        cubs: loadChecklistCheckedIds('cubs'),
        couples: loadChecklistCheckedIds('couples'),
      });
    }
  }, [open]);

  if (!open) return null;

  const activeItems = CHECKLIST_DECK_BY_TAB[activeTab];
  const checkedIds = checkedByTab[activeTab];
  const score = computeChecklistScore(checkedIds, activeItems);
  const rank = rankForScore(score);
  const refParam = referralCode ? `&ref=${encodeURIComponent(referralCode)}` : '';
  const checklistUrl = `${BRAND_CONFIG.publicBaseUrl.replace(/\/?$/, '/')}?checklist=1${refParam}`;

  const rookieItemsChecked = activeItems.filter(
    (i) => i.tier === 'rookie' && checkedIds.includes(i.id),
  );
  const interItemsChecked = activeItems.filter(
    (i) => i.tier === 'intermediate' && checkedIds.includes(i.id),
  );
  const deepItemsChecked = activeItems.filter(
    (i) => i.tier === 'deep_cuts' && checkedIds.includes(i.id),
  );
  const rookieCount = rookieItemsChecked.length;
  const interCount = interItemsChecked.length;
  const deepCount = deepItemsChecked.length;

  const diagnostic = buildScoreDiagnostic(
    score,
    activeTab,
    rookieCount * 2,
    interCount * 3,
    deepCount * 5,
  );
  const nextUncheckedQuests = activeItems.filter((i) => !checkedIds.includes(i.id)).slice(0, 2);

  const toggleItem = (id: string) => {
    sfx.messagePop();
    const next = toggleChecklistItemInStorage(id, activeTab);
    setCheckedByTab((prev) => ({ ...prev, [activeTab]: next }));
    if (next.length === 5) {
      awardPassportBonusXp(
        `checklist_5_${activeTab}`,
        20,
        '5 Checklist Milestones Logged!',
        '☑️ +20 XP',
      );
    }
  };

  const resetAll = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(CHECKLIST_STORAGE_KEYS[activeTab]);
      }
    } catch {
      // Ignore storage block
    }
    setCheckedByTab((prev) => ({ ...prev, [activeTab]: [] }));
  };

  const tabDisplayLabel =
    activeTab === 'cougars'
      ? '🐆 Cougars Only'
      : activeTab === 'cubs'
        ? '🐕 Cubs Only'
        : '🥂 Couples Date-Night';

  const handleShareScore = () => {
    onClaimChecklistReward('checklist_25pt_completed', 0);
    awardPassportBonusXp(`checklist_share_${activeTab}`, 15, 'Score Card Shared!', '🥂 +15 XP');
    trackEvent('checklist_shared', {
      score,
      tab: activeTab,
      checked_count: checkedIds.length,
    });
    const text = `${tabDisplayLabel} Lifestyle Score: ${score}/100 (${rank.title} • ${diagnostic.percentileLabel})\n🐣 Rookie ${rookieCount}/10 · 🔥 Regular ${interCount}/10 · 👑 Deep Cuts ${deepCount}/10\nBeat my score:`;
    setSharePayload({
      title: `Share ${tabDisplayLabel} Score (${score}/100)`,
      message: text,
      url: checklistUrl,
      shareSurface: 'checklist_25pt',
      discordMarkdown: `**${tabDisplayLabel} Score: ${score}/100** (${rank.title} • ${diagnostic.percentileLabel})\n🐣 Rookie **${rookieCount}/10** · 🔥 Regular **${interCount}/10** · 👑 Deep Cuts **${deepCount}/10** • Take the test: ${checklistUrl}`,
    });
  };

  let runningNumber = 0;

  const modalNode = (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-3 sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-label="Have You Ever? 3-Tier Cougars & Cubs Experience Test"
        onClick={onClose}
      >
        <div
          className="editorial-hinge-card relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 border-b border-zinc-200 bg-white px-5 py-3.5 sm:px-7 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                  Have You Ever? • 0 to 100 Weighted Score (+20 XP)
                </div>
                <h2 className="mt-0.5 text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 leading-tight">
                  The Cougars &amp; Cubs Experience Test
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Checklist"
                className="shrink-0 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 3 Role & Couples Date-Night Mode Tabs */}
            <div
              data-testid="checklist-role-tabs"
              className="grid grid-cols-3 gap-1.5 rounded-xl bg-zinc-100 p-1"
            >
              {(
                [
                  { id: 'cougars', label: '🐆 Cougars Only' },
                  { id: 'cubs', label: '🐕 Cubs Only' },
                  { id: 'couples', label: '🥂 Couples Date-Night' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-zinc-950 shadow-2xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Live Weighted Score & 3-Tier Breakdown Pinned Cleanly in Header */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-900">
                      {rank.title}
                    </span>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800">
                      {diagnostic.percentileLabel}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-600">{rank.subtitle}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div
                      data-testid="checklist-weighted-score"
                      className="text-2xl sm:text-3xl font-semibold leading-none text-zinc-950 tabular-nums"
                    >
                      {score}/100
                    </div>
                    <div className="text-xs font-medium text-zinc-500 mt-1">
                      {checkedIds.length}/{activeItems.length} Checked
                    </div>
                  </div>
                  {checkedIds.length > 0 && (
                    <button
                      type="button"
                      onClick={resetAll}
                      title="Reset checkboxes"
                      className="rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-200/80 text-xs font-semibold text-zinc-700">
                <div>🐣 Rookie: {rookieCount}/10</div>
                <div>🔥 Regular: {interCount}/10</div>
                <div>👑 Deep Cuts: {deepCount}/10</div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 space-y-6">

            {/* 3 Escalating Lifestyle Sections */}
            {TIER_ORDER.map((tierKey) => {
              const meta = CHECKLIST_TIER_META[tierKey];
              const tierItems = activeItems.filter((i) => i.tier === tierKey);
              return (
                <section key={tierKey} data-testid={`checklist-tier-${tierKey}`} className="space-y-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 pb-2">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-rose-600">
                        {meta.badge}
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-zinc-950">
                        {meta.title}
                      </h3>
                      <p className="text-xs text-zinc-500">{meta.subtitle}</p>
                    </div>
                    <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white">
                      {meta.pointsLabel}
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {tierItems.map((item) => {
                      runningNumber += 1;
                      const num = runningNumber;
                      const checked = checkedIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors cursor-pointer ${
                            checked
                              ? 'border-zinc-900 bg-zinc-50 text-zinc-950 font-medium'
                              : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50/60'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {checked ? (
                              <CheckSquare className="h-4 w-4 shrink-0 text-zinc-950 mt-0.5" />
                            ) : (
                              <Square className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
                            )}
                            <span className="leading-relaxed">
                              <strong className="text-zinc-500 mr-1.5">#{num}.</strong>
                              {item.text}
                            </span>
                          </div>
                          <span
                            className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                              checked
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-zinc-100 text-zinc-500'
                            }`}
                          >
                            +{item.points}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* Gamified "What Does Your Score Actually Mean?" Diagnostic Card */}
            <section
              data-testid="checklist-score-diagnostic"
              className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/70 via-white to-amber-50/50 p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
                  <Award className="h-4 w-4" />
                  <span>Score Breakdown &amp; Meaning</span>
                </div>
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-amber-300">
                  {score}/100 • {diagnostic.percentileLabel}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-zinc-950">
                  {diagnostic.meaningHeadline}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                  {diagnostic.meaningBody}
                </p>
              </div>

              {/* 3 Sub-Skill Progress Bars */}
              <div className="grid gap-2.5 sm:grid-cols-3">
                {[
                  { label: '🐣 Initiation Fluency', pts: rookieCount * 2, max: 20 },
                  { label: '🔥 Sanctuary Standards', pts: interCount * 3, max: 30 },
                  { label: '👑 Deep-Cut Legends', pts: deepCount * 5, max: 50 },
                ].map((bar) => (
                  <div
                    key={bar.label}
                    className="rounded-xl border border-zinc-200 bg-white p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-800">
                      <span>{bar.label}</span>
                      <span className="tabular-nums text-zinc-500">
                        {bar.pts}/{bar.max}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                      <div
                        style={{ width: `${Math.round((bar.pts / bar.max) * 100)}%` }}
                        className="h-full rounded-full bg-zinc-900 transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {nextUncheckedQuests.length > 0 && (
                <div className="rounded-xl border border-zinc-200 bg-white p-3.5 space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Your Next 2 Unchecked Quests to Level Up:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-zinc-700">
                    {nextUncheckedQuests.map((q) => (
                      <li key={q.id} className="flex items-start gap-2">
                        <span className="font-bold text-rose-600 shrink-0">+{q.points}pt</span>
                        <span>{q.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Bottom Share + Play Matched Scenario Funnel */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4">
              <button
                type="button"
                onClick={handleShareScore}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                <span>Share {tabDisplayLabel} Score ({score}/100)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPlayMatchedScenario(rank.recommendedEp);
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Play Matched Scenario →</span>
              </button>
            </div>

            <CrowdsourceSubmissionBar surface="checklist" />
          </div>
        </div>
      </div>

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
