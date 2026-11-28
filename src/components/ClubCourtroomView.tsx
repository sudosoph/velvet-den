import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Crown,
  Flame,
  Flag,
  MessageSquareQuote,
  Send,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import type { PlayerRole } from '../domain/taxonomy';
import { awardPassportBonusXp } from '../lib/gamification';
import { downloadReceiptPng } from '../lib/receiptCanvas';
import { sfx } from '../lib/sound';
import { shareOrCopy } from '../lib/viral';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';

export interface CourtroomStory {
  id: string;
  aslTag: string;
  subject?: 'him' | 'her';
  headline: string;
  story: string;
  vibeBadge: string;
  topComment?: string;
  crownHer: number;
  dumpHer: number;
  crownHim: number;
  dumpHim: number;
  communitySubmitted?: boolean;
}

type CourtFilterTab = 'all' | 'cub_cases' | 'cougar_cases' | 'split_jury' | 'community';

interface ClubCourtroomViewProps {
  role: PlayerRole;
  initialCaseId?: string | null;
  onBackToRoster: () => void;
  onOpenCubAcademy: () => void;
  onCastCourtVote: () => void;
  onGrantBonusCredits: (rewardKey: string, amount: number) => boolean;
}

export const SEED_COURTROOM_STORIES: CourtroomStory[] = [
  {
    id: 'court-fleetwood-mac-flat-tire',
    aslTag: '39F × 24M • Phoenix',
    subject: 'him',
    headline:
      'Changed My Flat Highway Tire in Eight Minutes Flat, Then Asked If Fleetwood Mac Was "That TikTok Cranberry Juice Band"',
    story:
      'Pulled onto a scorching shoulder while I stayed in white linen, swapped my spare without me lifting a finger, hopped back into the driver’s seat, and deadpan called Stevie Nicks a promising new indie vocalist.',
    vibeBadge: '⚡ Split-Jury Classic',
    topComment:
      'Mandatory Rumours vinyl homework tonight, though any 24-year-old who swaps a highway spare in eight minutes gets probation instead of jail.',
    crownHer: 74,
    dumpHer: 26,
    crownHim: 93,
    dumpHim: 7,
  },
  {
    id: 'court-lasagna-macro-scale',
    aslTag: '42F × 26M • Chicago',
    subject: 'him',
    headline:
      'Pulled a Pocket Digital Food Scale Out at My Dinner Party to Weigh My Homemade Short-Rib Lasagna to the Gram',
    story:
      'Simmered Sunday ragu for five hours for six close friends. Before taking a bite, he zeroed out a stainless macro scale beside my Bordeaux stems and logged "estimated ricotta density" into his phone.',
    vibeBadge: '⚖️ Gym-Bro Blind Spot',
    topComment:
      'Weighing homemade five-hour ragu in front of dinner guests violates at least three articles of the Geneva Convention.',
    crownHer: 6,
    dumpHer: 94,
    crownHim: 44,
    dumpHim: 56,
  },
  {
    id: 'court-sunday-715am-robe-boot',
    aslTag: '28M × 51F • Manhattan Beach',
    subject: 'her',
    headline:
      'Handed Me an Iced Espresso & Forehead Kiss at 7:15 AM Sharp Because "Sunday Morning Is Strictly Solo Robe & Crossword Time"',
    story:
      'Unbelievable Saturday steak dinner and chemistry, then at 7:15 AM she cheerfully walked me out to my car holding warm banana bread and locked her courtyard gate behind me.',
    vibeBadge: '🐆 Peak Cougar Boundary',
    topComment:
      '96% of Cougars voting Crown Her while Cubs stand bewildered in the driveway holding warm banana bread is cinema.',
    crownHer: 96,
    dumpHer: 4,
    crownHim: 58,
    dumpHim: 42,
  },
  {
    id: 'court-close-friends-green-circle',
    aslTag: '41F × 25M • Los Angeles',
    subject: 'him',
    headline: 'Posted Our Cabo Anniversary Dinner Exclusively to His 9-Person "Close Friends" Ring',
    story:
      'Four months of great dates, yet when he finally posted our beachfront toast I spotted the neon green circle, populated strictly by out-of-state cousins and zero local pals.',
    vibeBadge: '🟢 Soft-Launch Dodge',
    topComment:
      'If the circle is neon green and his local friends aren’t in it, you are in Witness Protection, not a relationship.',
    crownHer: 8,
    dumpHer: 92,
    crownHim: 29,
    dumpHim: 71,
  },
  {
    id: 'court-1999-prom-king-crossover',
    aslTag: '45F × 25M • Austin',
    subject: 'him',
    headline:
      'Discovered Over Mimosas That His 47-Year-Old Mom & I Both Dated the Exact Same 1999 High-School Quarterback',
    story:
      'His mom mentioned senior prom in Evanston, opened an old photo album, and there stood my 1999 ex Chad in frosted tips. My boyfriend laughed, clinked glasses with both of us, and ordered French toast.',
    vibeBadge: '🥂 Unflappable King',
    topComment:
      'You and his mom bonding over 1999 Frosted-Tips Chad just guaranteed peaceful holidays for the next decade.',
    crownHer: 88,
    dumpHer: 12,
    crownHim: 92,
    dumpHim: 8,
  },
  {
    id: 'court-cabo-gate-bellhop-dodge',
    aslTag: '27M × 45F • Miami',
    subject: 'her',
    headline:
      'Upgraded Us Both to First Class to Cabo, Then Told Her Country-Club Neighbor at Gate D12 I Was "Helping With Her Carry-On"',
    story:
      'Four months of nonstop chemistry at home, yet the instant her Boca tennis partner strolled up at boarding, she panicked and demoted me to unpaid airport skycap until takeoff.',
    vibeBadge: '✈️ Secret Skycap Foul',
    topComment:
      'Even lie-flat pods cannot cure secret-bellhop syndrome. Claim your Cub in boarding group 1 or fly solo.',
    crownHer: 19,
    dumpHer: 81,
    crownHim: 9,
    dumpHim: 91,
  },
  {
    id: 'court-wifi-79-vintage-blurt',
    aslTag: '46F × 27M • Seattle',
    subject: 'him',
    headline:
      'Cracked My Home Wi-Fi Password Because It Ended in "79" and Immediately Blurted Out "Whoa, Vintage!"',
    story:
      'Connected his laptop on Date #3, guessed my birth-year digits in ten seconds, whispered "Whoa, vintage," saw my expression, and sprinted to the wine shop for my favorite Pinot Noir as penance.',
    vibeBadge: '🍷 Saved by Pinot?',
    topComment:
      'Calling 1979 "vintage" inside her own living room is bold for a man within decorative-pillow range, emergency Pinot saved his life.',
    crownHer: 53,
    dumpHer: 47,
    crownHim: 79,
    dumpHim: 21,
  },
  {
    id: 'court-ex-husband-ribeye-tongs',
    aslTag: '48F × 29M • Denver',
    subject: 'him',
    headline:
      'My Petty Ex Showed Up Forty Minutes Early to Rattle Him; My Boyfriend Handed Him Tongs & Asked How He Takes His Ribeye',
    story:
      'Richard walked onto the patio expecting awkward panic. My 29-year-old didn’t flinch once at the grill, poured him sparkling water with lime, and dissolved the whole power play inside ninety seconds.',
    vibeBadge: '🥩 Zero-Ego Mastery',
    topComment:
      'Zero chest-puffing, zero insecurity, medium-rare diplomacy. Promote this man immediately.',
    crownHer: 99,
    dumpHer: 1,
    crownHim: 96,
    dumpHim: 4,
  },
  {
    id: 'court-roommates-crashed-sonoma',
    aslTag: '46F × 24M • Napa',
    subject: 'him',
    headline: 'Two Uninvited Roommates Pulled Up to Our Vineyard Cottage Carrying Warm Seltzer Packs',
    story:
      'I booked a quiet Sonoma rental for our weekend escape. At 9 PM gravel crunches outside and his two buddies stroll in asking for the Wi-Fi password and pool towels.',
    vibeBadge: '🚩 Boundary Crash',
    topComment:
      'Nothing evaporates Sonoma romance faster than two unannounced frat roommates hunting for hot-tub towels.',
    crownHer: 4,
    dumpHer: 96,
    crownHim: 18,
    dumpHim: 82,
  },
  {
    id: 'court-stealth-omakase-ego-test',
    aslTag: '26M × 43F • New York',
    subject: 'her',
    headline:
      'Handed the Hostess Her Amex Before We Even Sat Down on Date #2 "Just to See If Covering Omakase Would Bruise My Ego"',
    story:
      'When I reached for the bill, the server smiled and said it was settled at 7:30 PM. She watched my reaction over sake and grinned: "Good, zero pouting. Nightcaps down the block are on you."',
    vibeBadge: '🍣 Power-Move Test',
    topComment:
      'Passing the surprise omakase check-drop with a smile and buying cocktails next door is undefeated.',
    crownHer: 84,
    dumpHer: 16,
    crownHim: 88,
    dumpHim: 12,
  },
  {
    id: 'court-pta-mom-compliment-fumble',
    aslTag: '41F × 23M • San Diego',
    subject: 'him',
    headline:
      'Tried to Praise My Patio Hosting Skills by Saying "You Have Such Elite Hot-Carpool-Mom Energy"',
    story:
      'Carried out prosciutto figs and chilled rosé onto my deck, and he earnestly believed comparing me to his childhood neighborhood crush was Shakespearean flattery.',
    vibeBadge: '💀 Compliment Crime',
    topComment:
      'Step away from the prosciutto figs and banish the word "carpool" from your vocabulary forever, rookie.',
    crownHer: 9,
    dumpHer: 91,
    crownHim: 41,
    dumpHim: 59,
  },
  {
    id: 'court-delta-hold-rebook-hero',
    aslTag: '44F × 27M • Atlanta',
    subject: 'him',
    headline:
      'Connecting Flight Cancelled at 10 PM; He Sat on Hold With Delta for 47 Minutes While I Showered',
    story:
      'Landed stranded in Charlotte during summer storms. Without me asking, he conferenced the airline desk, rebooked me into seat 2A on the 7 AM departure, and had hot ginger tea waiting downstairs.',
    vibeBadge: '✈️ Travel MVP',
    topComment:
      'Competence during airline meltdowns is worth ten dozen roses.',
    crownHer: 97,
    dumpHer: 3,
    crownHim: 92,
    dumpHim: 8,
  },
  {
    id: 'court-mature-skin-birthday-box',
    aslTag: '42F × 25M • Boston',
    subject: 'him',
    headline: 'Wrapped Up a $180 Jar Labeled "Extra-Firming Mature Wrinkle Rescue" for My Birthday',
    story:
      'Swore the department-store clerk told him it was the luxury bestseller, sweetest handwritten card attached to the most mortifying label on earth.',
    vibeBadge: '🎁 Clueless Sweetheart?',
    topComment:
      'Whoever worked the department-store counter that afternoon woke up choosing pure violence.',
    crownHer: 38,
    dumpHer: 62,
    crownHim: 64,
    dumpHim: 36,
  },
  {
    id: 'court-percale-63f-thermostat',
    aslTag: '49F × 30M • Dallas',
    subject: 'him',
    headline:
      'Quietly Swapped His Heavy Duvet for Crisp Cotton Percale & Set the Bedroom to 63°F Without Making a Speech',
    story:
      'Mentioned once in passing that warm bedrooms wreck my sleep. Next Friday at his place, a quiet fan was running, ice water sat on my nightstand, and zero awkward commentary was made.',
    vibeBadge: '❄️ 63°F Sanctuary King',
    topComment:
      'Crisp percale, 63 degrees, ice water on the nightstand, zero weirdness. Build a statue of him.',
    crownHer: 99,
    dumpHer: 1,
    crownHim: 94,
    dumpHim: 6,
  },
  {
    id: 'court-air-fryer-hobosexual-creep',
    aslTag: '43F × 25M • Nashville',
    subject: 'him',
    headline:
      'Left Three Hoodies, a Dual-Basket Air Fryer & a PS5 at My House After Month One, Then Asked About "Our Wi-Fi Speed"',
    story:
      'Never discussed moving in. Walked into my kitchen Thursday morning to discover my espresso machine pushed aside for a giant black air fryer and gaming headset.',
    vibeBadge: '🎮 Stealth Squatting',
    topComment:
      'Stealth appliance colonization starts with one left-behind charger and ends with an air fryer on your marble counter.',
    crownHer: 3,
    dumpHer: 97,
    crownHim: 21,
    dumpHim: 79,
  },
  {
    id: 'court-stick-shift-porsche-lessons',
    aslTag: '49F × 29M • Scottsdale',
    subject: 'him',
    headline: 'Secretly Took Three Stick-Shift Lessons So He Could Drive My Classic Carrera Home',
    story:
      'Never acted weird that he didn’t drive manual, booked an instructor on his own dime and smoothly took the keys after our wine-pairing dinner.',
    vibeBadge: '🏎️ Smooth Operator',
    topComment:
      'Quietly learning manual transmission on his own dime instead of getting defensive is top-tier confidence.',
    crownHer: 96,
    dumpHer: 4,
    crownHim: 95,
    dumpHim: 5,
  },
  {
    id: 'court-shut-down-buddy-joke',
    aslTag: '45F × 26M • Chicago',
    subject: 'him',
    headline: 'Shut Down His Friend’s "Mrs. Robinson" Crack in Three Calm Words Without Raising His Voice',
    story:
      'At his friend’s birthday pub night, one guy made a tired movie joke. My boyfriend smiled deadpan, said "Show some class," and moved us to a cozy corner banquette.',
    vibeBadge: '🛡️ Spine of Steel',
    topComment:
      'Three calm words and zero theatrics. Nothing hotter than a younger man who commands instant respect from his peers.',
    crownHer: 99,
    dumpHer: 1,
    crownHim: 93,
    dumpHim: 7,
  },
  {
    id: 'court-four-monitor-snowstorm',
    aslTag: '44F × 24M • Minneapolis',
    subject: 'him',
    headline: 'Set Up Four Curved Crypto Monitors on My Dining Table During a Two-Day Blizzard',
    story:
      'Came over before the snow hit carrying two suitcases of cables and turned my walnut dining room into a glowing day-trading command bunker until Tuesday.',
    vibeBadge: '🖥️ Cable Squatting',
    topComment:
      'Four curved monitors on solid walnut should carry a mandatory snowbank eviction.',
    crownHer: 6,
    dumpHer: 94,
    crownHim: 27,
    dumpHim: 73,
  },
  {
    id: 'court-joan-didion-cram-session',
    aslTag: '44F × 27M • Cambridge',
    subject: 'him',
    headline:
      'Accidentally Revealed on AirPlay That He Watched a 40-Minute Joan Didion Lecture Before Meeting My Book-Club Friends',
    story:
      'Queued up dinner jazz from his phone and flashed three nights of secret study notes on Slouching Towards Bethlehem because he wanted to hold his own at my table.',
    vibeBadge: '📚 Homework Sweetheart',
    topComment:
      'Pre-game film study on Joan Didion for your friends is Peak Golden Retriever Excellence.',
    crownHer: 97,
    dumpHer: 3,
    crownHim: 91,
    dumpHim: 9,
  },
  {
    id: 'court-wedding-grandma-friend-dodge',
    aslTag: '40F × 25M • Charleston',
    subject: 'him',
    headline: 'Introduced Me to His 82-Year-Old Grandmother at a Family Wedding as "My Good Friend"',
    story:
      'Claimed afterward he didn’t want Nana to spill punch on her dress from shock, after I flew two states in heels to be his date.',
    vibeBadge: '💒 Plus-One Foul',
    topComment:
      'Blaming 82-year-old Nana when Nana probably had hotter stories in 1968 is cowardly work.',
    crownHer: 5,
    dumpHer: 95,
    crownHim: 22,
    dumpHim: 78,
  },
  {
    id: 'court-toothbrush-stays-in-bag',
    aslTag: '51F × 30M • Boulder',
    subject: 'him',
    headline: 'Kept His Charger & Toothbrush Inside His Duffel Until I Explicitly Offered Him a Drawer',
    story:
      'Zero stealth territory-marking in my townhouse for three straight months, waited until I cleared top-drawer space before leaving a single item behind.',
    vibeBadge: '🧳 Sanctuary Respect',
    topComment:
      'Respecting a woman’s peaceful bathroom counter until invited is how you earn a permanent drawer.',
    crownHer: 95,
    dumpHer: 5,
    crownHim: 87,
    dumpHim: 13,
  },
  {
    id: 'court-birthday-receipt-calculator',
    aslTag: '43F × 26M • San Francisco',
    subject: 'him',
    headline: 'Pulled Out a Receipt-Scanning Tax App to Itemize Who Ate Which Calamari Ring',
    story:
      'Invited me out for HIS idea of tapas, then spent eleven minutes under the candle photographing the paper slip to calculate exact 8.625% tax.',
    vibeBadge: '🧮 Itemized Ick',
    topComment:
      'Auditing individual calamari rings by candlelight should automatically disable his dating apps for ninety days.',
    crownHer: 3,
    dumpHer: 97,
    crownHim: 19,
    dumpHim: 81,
  },
  {
    id: 'court-prepaid-valet-surprise',
    aslTag: '48F × 28M • Miami',
    subject: 'him',
    headline: 'Pre-Paid Valet & Tipped the Hostess Ahead So My Wallet Never Left My Evening Clutch',
    story:
      'Took me out for my promotion celebration on his sous-chef paycheck, coordinated every detail with the restaurant at 4 PM so the evening glided seamlessly.',
    vibeBadge: '🥂 Pure Class',
    topComment:
      'Effort, planning, and pride in taking care of the evening always outshine flash.',
    crownHer: 98,
    dumpHer: 2,
    crownHim: 91,
    dumpHim: 9,
  },
  {
    id: 'court-kept-boyfriend-kitchen-reel',
    aslTag: '45F × 23M • Dallas',
    subject: 'him',
    headline: 'Filmed a "Day in the Life of a Kept Boyfriend" Reel in My Marble Kitchen While I Worked',
    story:
      'Found my espresso machine and backyard pool trending with 90,000 views while he posed in my robe pretending I pay his car note.',
    vibeBadge: '📱 Clout Tourist',
    topComment:
      'Confiscate the silk robe immediately and invoice him for location rental fees.',
    crownHer: 2,
    dumpHer: 98,
    crownHim: 14,
    dumpHim: 86,
  },
  {
    id: 'court-grocery-mistaken-hip-tap',
    aslTag: '42F × 26M • Portland',
    subject: 'him',
    headline:
      'Accidentally Snuck Up & Hugged a Stranger in Matching Camel Cashmere at the Olive Bar While I Watched Five Feet Away',
    story:
      'Went to grab marinated artichokes, spotted a blonde bun in an identical camel coat, whispered "Missed you today" into a startled realtor’s scarf, then bought both of us apology bouquets.',
    vibeBadge: '🫒 Aisle Mistaken Identity',
    topComment:
      'Buying apology peonies for BOTH women in the produce section is elite crisis management.',
    crownHer: 82,
    dumpHer: 18,
    crownHim: 89,
    dumpHim: 11,
  },
  {
    id: 'court-seedy-motel-autocorrect-roleplay',
    aslTag: '51F × 29M • Philadelphia',
    subject: 'him',
    headline:
      'Tried to Send a Moody Noir Roleplay Text About Meeting as Strangers, Autocorrected "Sultry Boutique Hotel" to "Seedy Motel"',
    story:
      'Wanted to surprise me with a cinematic cocktail-bar meetup after my conference, hit send while walking his dog, and frantically followed up with four voice notes swearing he booked the Four Seasons.',
    vibeBadge: '📱 Autocorrect Disaster',
    topComment:
      'Only forgive him if the Four Seasons confirmation screenshot arrived within ninety seconds of "seedy motel."',
    crownHer: 76,
    dumpHer: 24,
    crownHim: 88,
    dumpHim: 12,
  },
  {
    id: 'court-whey-tub-vs-herbal-apothecary',
    aslTag: '44F × 25M • Charlotte',
    subject: 'him',
    headline:
      'Alphabetized My Fourteen Loose-Leaf Herbal Teas by Caffeine Level to Make Room for His Five-Pound Vanilla Whey Tub',
    story:
      'Gave him one weekend pantry shelf. Came downstairs Monday to find chamomile through tulsi labeled in neat calligraphy beside a giant plastic protein drum and his marathon finisher mug.',
    vibeBadge: '🍵 Pantry Diplomacy',
    topComment:
      'Any 25-year-old who alphabetizes chamomile-to-tulsi earns permanent shelf clearance for the giant whey drum.',
    crownHer: 91,
    dumpHer: 9,
    crownHim: 94,
    dumpHim: 6,
  },
  {
    id: 'court-lat-diagonal-king-bed-rule',
    aslTag: '29M × 48F • San Francisco',
    subject: 'her',
    headline:
      'Turned Down Moving In Together After Two Amazing Years Because "Separate Leases Keep Us Obsessed & I Sleep Diagonally"',
    story:
      'We spend four nights a week cooking, traveling, and laughing, yet she renewed her sunny townhouse lease solo so Tuesday and Wednesday remain sacred quiet starfish-sleep nights.',
    vibeBadge: '🛏️ Living Apart Together',
    topComment:
      'Living Apart Together within ten minutes of each other is the undefeated secret weapon of modern relationships.',
    crownHer: 95,
    dumpHer: 5,
    crownHim: 61,
    dumpHim: 39,
  },
  {
    id: 'court-accidental-cougar-npr-panic',
    aslTag: '26M × 42F • Seattle',
    subject: 'her',
    headline:
      'Assumed My Bearded Bar-Trivia Teammate Was 35 Until I Mentioned Buying My First Civic in 1999 & He Said "I Was Born in 2000"',
    story:
      'Flirted for forty minutes over craft cocktails thinking we were peers, froze mid-sip when birth years dropped, then laughed so hard we booked Friday dinner anyway.',
    vibeBadge: '😳 Accidental Cougar Panic',
    topComment:
      'Every Accidental Cougar has survived that exact five-second math freeze before realizing he is calmer than every 44-year-old ex.',
    crownHer: 93,
    dumpHer: 7,
    crownHim: 95,
    dumpHim: 5,
  },
  {
    id: 'court-bestie-brunch-tribunal-ambush',
    aslTag: '27M × 44F • Scottsdale',
    subject: 'her',
    headline:
      'Invited Me to "Low-Key Sunday Coffee" on Date #3 That Turned Out to Be a Four-Woman Patio Mimosa Interrogation',
    story:
      'Walked onto the bistro terrace expecting two lattes and walked straight into four protective best friends firing rapid-fire career and intention questions before pastries arrived.',
    vibeBadge: '🥂 Mimosa Tribunal',
    topComment:
      'Give a man at least twenty-four hours of mental prep before summoning the four-woman mimosa Senate.',
    crownHer: 41,
    dumpHer: 59,
    crownHim: 19,
    dumpHim: 81,
  },
  {
    id: 'court-all-clad-kitchen-ban',
    aslTag: '28M × 47F • Chicago',
    subject: 'her',
    headline:
      'Banned Me From Touching Her Copper Cookware Forever After Catching Me Hovering Near a Pan With a Metal Fork Once',
    story:
      'Offered to scramble eggs Sunday morning, reached toward the drawer for a fork, and got gently escorted to a barstool with espresso while she took over.',
    vibeBadge: '🍳 Copper-Pan Law',
    topComment:
      'Metal utensils near seasoned French copper is a felony in forty-eight states, sit on the barstool and look handsome.',
    crownHer: 89,
    dumpHer: 11,
    crownHim: 52,
    dumpHim: 48,
  },
  {
    id: 'court-waiter-son-burgundy-comeback',
    aslTag: '25M × 49F • Boston',
    subject: 'her',
    headline:
      'Rookie Server Asked "Sparkling Water for Your Son?" and She Replied "He’s My Date, Bring Us Your Best Pinot" Without Blinking',
    story:
      'Poor kid turned bright crimson at our booth. She didn’t flinch, squeezed my hand across the tablecloth, and tipped twenty-five percent anyway.',
    vibeBadge: '🍷 Unbothered Icon',
    topComment:
      'Zero embarrassment, total grace, and tipping the mortified waiter generously is peak queen behavior.',
    crownHer: 98,
    dumpHer: 2,
    crownHim: 97,
    dumpHim: 3,
  },
  {
    id: 'court-kiddo-sancerre-knee-pat',
    aslTag: '26M × 43F • Austin',
    subject: 'her',
    headline:
      'Accidentally Patted My Knee & Said "Good Point, Kiddo" After Two Glasses of Sancerre in Front of My Friends',
    story:
      'Everything was rolling smoothly at pub trivia until muscle memory betrayed her mid-debate and the entire table went dead silent for three full seconds.',
    vibeBadge: '💀 Sancerre Slip-Up',
    topComment:
      'Dropping "kiddo" with a knee pat in front of his boys requires immediate apology tacos.',
    crownHer: 34,
    dumpHer: 66,
    crownHim: 22,
    dumpHim: 78,
  },
  {
    id: 'court-executive-assistant-calendar-invite',
    aslTag: '28M × 46F • New York',
    subject: 'her',
    headline:
      'Had Her Executive Assistant Email Me a Formal 7:30 PM Calendar Invite With Restaurant Parking Notes for Date #2',
    story:
      'Opened my inbox Wednesday morning to a crisp calendar block titled "Dinner w/ Lauren (Confirmed Booth)" complete with coat-check details.',
    vibeBadge: '📅 C-Suite Efficiency',
    topComment:
      'Half of us find C-suite calendar invites intimidating and the other half would propose on the spot.',
    crownHer: 72,
    dumpHer: 28,
    crownHim: 64,
    dumpHim: 36,
  },
];

function isLiveHttpRuntime(): boolean {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return false;
  const ua = (navigator.userAgent || '').toLowerCase();
  if (ua.includes('jsdom')) return false;
  return window.location.protocol === 'https:' || window.location.protocol === 'http:';
}

function getDailyDropNumberAndSeedId(): { dropNum: number; seedId: string } {
  const epochDay = Math.floor(Date.now() / 86_400_000);
  const dropNum = Math.max(1, epochDay - 20750);
  const idx = epochDay % SEED_COURTROOM_STORIES.length;
  return { dropNum, seedId: SEED_COURTROOM_STORIES[idx].id };
}

function isSplitJuryCase(item: CourtroomStory): boolean {
  const herTotal = Math.max(1, item.crownHer + item.dumpHer);
  const himTotal = Math.max(1, item.crownHim + item.dumpHim);
  const herCrownPct = Math.round((item.crownHer / herTotal) * 100);
  const himCrownPct = Math.round((item.crownHim / himTotal) * 100);
  return (
    Math.abs(herCrownPct - himCrownPct) >= 20 ||
    (herCrownPct >= 25 && herCrownPct <= 75)
  );
}

export const ClubCourtroomView: React.FC<ClubCourtroomViewProps> = ({
  role,
  initialCaseId = null,
  onBackToRoster,
  onOpenCubAcademy,
  onCastCourtVote,
  onGrantBonusCredits,
}) => {
  const [stories, setStories] = useState<CourtroomStory[]>(SEED_COURTROOM_STORIES);
  const [filterTab, setFilterTab] = useState<CourtFilterTab>('all');
  const [mobilePitchOpen, setMobilePitchOpen] = useState(false);
  const [votes, setVotes] = useState<Record<string, 'crown' | 'dump'>>({});
  const [copiedDaily, setCopiedDaily] = useState(false);
  const [creditToast, setCreditToast] = useState<string | null>(null);
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);
  const docketTopRef = useRef<HTMLDivElement | null>(null);

  // Pitch Story Form
  const [aslInput, setAslInput] = useState('43F × 26M • Los Angeles');
  const [subjectInput, setSubjectInput] = useState<'him' | 'her'>('him');
  const [headlineInput, setHeadlineInput] = useState('');
  const [storyInput, setStoryInput] = useState('');
  const [pitchStatus, setPitchStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isLiveHttpRuntime()) return;
    let cancelled = false;
    fetch('/api/courtroom')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { stories?: CourtroomStory[] } | null) => {
        if (!cancelled && data?.stories && Array.isArray(data.stories) && data.stories.length > 0) {
          const seedMap = new Map(SEED_COURTROOM_STORIES.map((s) => [s.id, s]));
          const hydrated = data.stories.map((remote) => {
            const localSeed = seedMap.get(remote.id);
            return localSeed
              ? {
                  ...localSeed,
                  crownHer: remote.crownHer,
                  dumpHer: remote.dumpHer,
                  crownHim: remote.crownHim,
                  dumpHim: remote.dumpHim,
                }
              : remote;
          });
          setStories(hydrated);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const { dropNum, seedId } = useMemo(() => getDailyDropNumberAndSeedId(), []);
  const dailyStory = useMemo(
    () =>
      (initialCaseId ? stories.find((s) => s.id === initialCaseId) : undefined) ??
      stories.find((s) => s.id === seedId) ??
      stories[0],
    [stories, seedId, initialCaseId],
  );

  const communityCount = useMemo(
    () => stories.filter((s) => Boolean(s.communitySubmitted)).length,
    [stories],
  );

  const filteredDocket = useMemo(() => {
    const rest = stories.filter((s) => s.id !== dailyStory?.id);
    if (filterTab === 'cub_cases') {
      return rest.filter((s) => (s.subject ?? 'him') === 'him' && !s.communitySubmitted);
    }
    if (filterTab === 'cougar_cases') {
      return rest.filter((s) => s.subject === 'her');
    }
    if (filterTab === 'split_jury') {
      return rest.filter((s) => isSplitJuryCase(s));
    }
    if (filterTab === 'community') {
      return rest.filter((s) => Boolean(s.communitySubmitted));
    }
    return rest;
  }, [stories, dailyStory?.id, filterTab]);

  const handleVote = async (storyId: string, verdict: 'crown' | 'dump') => {
    if (votes[storyId]) return;
    if (verdict === 'crown') sfx.greenFlag();
    else sfx.redFlag();

    setVotes((prev) => ({ ...prev, [storyId]: verdict }));
    onCastCourtVote();

    setStories((prev) =>
      prev.map((s) => {
        if (s.id !== storyId) return s;
        return {
          ...s,
          crownHer: s.crownHer + (role === 'her' && verdict === 'crown' ? 1 : 0),
          dumpHer: s.dumpHer + (role === 'her' && verdict === 'dump' ? 1 : 0),
          crownHim: s.crownHim + (role === 'him' && verdict === 'crown' ? 1 : 0),
          dumpHim: s.dumpHim + (role === 'him' && verdict === 'dump' ? 1 : 0),
        };
      }),
    );

    if (storyId === dailyStory?.id) {
      onGrantBonusCredits(`daily_drop_${dropNum}`, 0);
      awardPassportBonusXp(`court_daily_${dropNum}`, 15, 'Daily Court Verdict!', '⚖️ +15 XP');
      setCreditToast('🎉 +15 Club XP & Dateodex stamp recorded for Today’s Daily Court Drop!');
    }

    if (isLiveHttpRuntime()) {
      try {
        await fetch('/api/courtroom/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storyId, verdict, role }),
        });
      } catch {
        // Local optimistic update already applied
      }
    }
  };

  const formatPronounLabels = (item: CourtroomStory) => {
    const isHer = item.subject === 'her';
    return {
      crownLabel: isHer ? 'Crown Her' : 'Crown Him',
      crownHeroLabel: isHer ? 'Crown Her (Icon Behavior)' : 'Crown Him (Keeper Material)',
      dumpLabel: isHer ? 'Dump Her' : 'Dump Him',
      dumpHeroLabel: isHer ? 'Dump Her (Out of Pocket)' : 'Dump Him (Straight to Jail)',
      receiptCrown: isHer ? '👑 CROWN HER' : '👑 CROWN HIM',
      receiptDump: isHer ? '🚩 DUMP HER' : '🚩 DUMP HIM',
    };
  };

  const handleShareDailyReceipt = async () => {
    if (!dailyStory) return;
    const picked = votes[dailyStory.id] ?? 'dump';
    const labels = formatPronounLabels(dailyStory);
    const herTotal = Math.max(1, dailyStory.crownHer + dailyStory.dumpHer);
    const herDumpPct = Math.round((dailyStory.dumpHer / herTotal) * 100);
    const himTotal = Math.max(1, dailyStory.crownHim + dailyStory.dumpHim);
    const himCrownPct = Math.round((dailyStory.crownHim / himTotal) * 100);

    const url =
      typeof window !== 'undefined' && window.location.origin.startsWith('http')
        ? `${window.location.origin}/?court=1&case=${encodeURIComponent(dailyStory.id)}`
        : `${BRAND_CONFIG.publicBaseUrl}/?court=1&case=${encodeURIComponent(dailyStory.id)}`;

    const receipt = `🐆 Cougars & Cubs Daily #${dropNum} (${dailyStory.aslTag})\nMy Verdict: ${
      picked === 'crown' ? labels.receiptCrown : labels.receiptDump
    }\n🐆 Cougars Voted: ${herDumpPct}% Dump · 🐕 Cubs Thought: ${himCrownPct}% Crown 💀\nVote today’s case:`;

    await shareOrCopy({
      title: `Cougars & Cubs Daily #${dropNum}`,
      text: receipt,
      url,
    });
    setCopiedDaily(true);
    setSharePayload({
      title: `Cougars & Cubs Daily #${dropNum}`,
      message: receipt,
      url,
      shareSurface: 'verdict_receipt',
      onDownloadStoryPng: () => {
        downloadReceiptPng({
          badge: `Club Courtroom #${dropNum}`,
          bigStat: picked === 'crown' ? 'CROWNED' : 'DUMPED',
          verdictLabel: `${dailyStory.aslTag} · ${dailyStory.vibeBadge}`,
          title: dailyStory.headline,
          bullets: [
            `Cougars Voted: ${herDumpPct}% Dump`,
            `Cubs Voted: ${himCrownPct}% Crown`,
            dailyStory.topComment || dailyStory.story,
          ],
          filename: `courtroom-${dailyStory.id}.png`,
        });
      },
    });
    window.setTimeout(() => setCopiedDaily(false), 2600);
  };

  const handleShareCaseReceipt = async (item: CourtroomStory) => {
    const picked = votes[item.id] ?? 'dump';
    const labels = formatPronounLabels(item);
    const herTotal = Math.max(1, item.crownHer + item.dumpHer);
    const herDumpPct = Math.round((item.dumpHer / herTotal) * 100);
    const himTotal = Math.max(1, item.crownHim + item.dumpHim);
    const himCrownPct = Math.round((item.crownHim / himTotal) * 100);
    const url =
      typeof window !== 'undefined' && window.location.origin.startsWith('http')
        ? `${window.location.origin}/?court=1`
        : `${BRAND_CONFIG.publicBaseUrl}/?court=1`;
    const receipt = `⚖️ Club Courtroom (${item.aslTag}): "${item.headline}"\nMy Verdict: ${
      picked === 'crown' ? labels.receiptCrown : labels.receiptDump
    } • Cougars: ${herDumpPct}% Dump vs. Cubs: ${himCrownPct}% Crown!`;
    await shareOrCopy({
      title: `Club Courtroom Verdict (${item.aslTag})`,
      text: receipt,
      url,
    });
    setSharePayload({
      title: `Club Courtroom Verdict (${item.aslTag})`,
      message: receipt,
      url,
      shareSurface: 'verdict_receipt',
    });
  };

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHead = headlineInput.trim();
    const cleanBody = storyInput.trim();
    if (cleanHead.length < 8 || cleanBody.length < 20) {
      setPitchStatus('Give your report a punchy headline (8+ chars) and at least one full sentence!');
      return;
    }

    const optimistic: CourtroomStory = {
      id: `user-${Date.now()}`,
      aslTag: aslInput.trim().slice(0, 36) || '42F × 26M • Club Member',
      subject: subjectInput,
      headline: cleanHead.slice(0, 95),
      story: cleanBody.slice(0, 260),
      vibeBadge: '✨ Live Player Field Report',
      crownHer: 5,
      dumpHer: 5,
      crownHim: 5,
      dumpHim: 5,
      communitySubmitted: true,
    };

    sfx.victoryFanfare();
    setStories((prev) => [optimistic, ...prev]);
    setHeadlineInput('');
    setStoryInput('');
    setFilterTab('all');
    setMobilePitchOpen(false);
    setPitchStatus(
      '✓ Live now at the top of the Courtroom Docket! Stored anonymously so players can vote Crown or Dump immediately.',
    );

    onGrantBonusCredits('courtroom_story_pitch', 0);
    awardPassportBonusXp(`court_pitch_${Date.now()}`, 15, 'Field Report Live!', '⚖️ +15 XP');
    setCreditToast(
      '🎉 Your anonymous Field Report is now live at the top of the Courtroom Docket (+15 XP)!',
    );

    if (docketTopRef.current && typeof docketTopRef.current.scrollIntoView === 'function') {
      try {
        docketTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch {
        // Ignore scroll error in jsdom
      }
    }

    if (isLiveHttpRuntime()) {
      try {
        await fetch('/api/courtroom/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            aslTag: optimistic.aslTag,
            subject: optimistic.subject,
            headline: optimistic.headline,
            story: optimistic.story,
          }),
        });
      } catch {
        // Optimistically rendered
      }
    }
  };

  const renderPitchFormFields = (idPrefix: string) => (
    <form onSubmit={handleSubmitStory} className="space-y-3">
      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-zinc-100 p-1">
        <button
          type="button"
          onClick={() => setSubjectInput('him')}
          className={`h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
            subjectInput === 'him' ? 'bg-zinc-950 text-white shadow-2xs' : 'text-zinc-600'
          }`}
        >
          🐕 Judge the Cub
        </button>
        <button
          type="button"
          onClick={() => setSubjectInput('her')}
          className={`h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
            subjectInput === 'her' ? 'bg-zinc-950 text-white shadow-2xs' : 'text-zinc-600'
          }`}
        >
          🐆 Judge the Cougar
        </button>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-court-asl`}
          className="block text-xs font-medium text-zinc-700 mb-1"
        >
          Ages &amp; City Tag
        </label>
        <input
          id={`${idPrefix}-court-asl`}
          type="text"
          maxLength={36}
          value={aslInput}
          onChange={(e) => setAslInput(e.target.value)}
          className="w-full h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-court-headline`}
          className="block text-xs font-medium text-zinc-700 mb-1"
        >
          Punchy Case Headline
        </label>
        <input
          id={`${idPrefix}-court-headline`}
          type="text"
          maxLength={95}
          placeholder="e.g. Brought a pocket food scale to weigh my homemade lasagna…"
          value={headlineInput}
          onChange={(e) => setHeadlineInput(e.target.value)}
          className="w-full h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
        />
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-court-story`}
          className="block text-xs font-medium text-zinc-700 mb-1"
        >
          What Happened? (240 chars max)
        </label>
        <textarea
          id={`${idPrefix}-court-story`}
          rows={3}
          maxLength={240}
          placeholder="Drop the anonymous receipt so Cougars & Cubs can vote Crown or Dump!"
          value={storyInput}
          onChange={(e) => setStoryInput(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-900"
        />
      </div>

      <p className="text-[11px] leading-snug text-zinc-500">
        100% anonymous (emails &amp; handles auto-scrubbed). Goes live immediately at the top of this Courtroom docket for community voting.
      </p>

      <button
        type="submit"
        className="w-full h-10 rounded-lg bg-rose-600 text-sm font-semibold text-white hover:bg-rose-700 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Send className="h-3.5 w-3.5" />
        <span>Post Live to Courtroom (+15 XP)</span>
      </button>
    </form>
  );

  const renderSplitBars = (item: CourtroomStory) => {
    const herTotal = Math.max(1, item.crownHer + item.dumpHer);
    const herCrownPct = Math.round((item.crownHer / herTotal) * 100);
    const herDumpPct = 100 - herCrownPct;

    const himTotal = Math.max(1, item.crownHim + item.dumpHim);
    const himCrownPct = Math.round((item.crownHim / himTotal) * 100);
    const himDumpPct = 100 - himCrownPct;

    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 space-y-2.5">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
            <span>🐆 Cougars (35-65F)</span>
            <span>
              <strong className="text-emerald-700">{herCrownPct}% Crown</strong> ·{' '}
              <strong className="text-rose-600">{herDumpPct}% Dump</strong>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 flex">
            <div style={{ width: `${herCrownPct}%` }} className="bg-emerald-600 h-full" />
            <div style={{ width: `${herDumpPct}%` }} className="bg-rose-600 h-full" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
            <span>🐕 Cubs (21-34M)</span>
            <span>
              <strong className="text-emerald-700">{himCrownPct}% Crown</strong> ·{' '}
              <strong className="text-rose-600">{himDumpPct}% Dump</strong>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 flex">
            <div style={{ width: `${himCrownPct}%` }} className="bg-amber-500 h-full" />
            <div style={{ width: `${himDumpPct}%` }} className="bg-rose-600 h-full" />
          </div>
        </div>

        {item.topComment && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700">
            <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <div>
              <strong className="font-semibold text-zinc-950">Top Jury Comment: </strong>
              <span>&ldquo;{item.topComment}&rdquo;</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const dailyLabels = dailyStory ? formatPronounLabels(dailyStory) : null;

  return (
    <div className="w-full space-y-5 animate-stage-in">
      {creditToast && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900">
          {creditToast}
        </div>
      )}

      {/* Clean Single-Row Header + Mobile Inline Anon Report Drawer */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToRoster}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Roster</span>
            </button>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-950">
              Crown or Dump Courtroom
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mobile (< lg): Opens inline right at the top instead of scrolling 4,000px to bottom */}
            <button
              type="button"
              data-testid="mobile-anon-report-toggle"
              onClick={() => setMobilePitchOpen((v) => !v)}
              className="lg:hidden inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 text-xs sm:text-sm font-semibold text-rose-900 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 text-rose-600" />
              <span>{mobilePitchOpen ? 'Hide Report Form' : '+ Anon Field Report (+15 XP)'}</span>
            </button>

            <a
              href="#courtroom-pitch-form"
              className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 text-xs sm:text-sm font-semibold text-rose-900 hover:bg-rose-100 transition-colors"
            >
              <Send className="h-3.5 w-3.5 text-rose-600" />
              <span>+ Anon Field Report (+15 XP)</span>
            </a>

            <button
              type="button"
              onClick={onOpenCubAcademy}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 text-xs sm:text-sm font-medium text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Cub School →</span>
            </button>
          </div>
        </div>

        {mobilePitchOpen && (
          <div
            data-testid="mobile-anon-report-drawer"
            className="lg:hidden rounded-2xl border border-rose-200 bg-rose-50/40 p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-zinc-950">
                Drop an Anonymous Field Report (+15 XP)
              </span>
              <button
                type="button"
                aria-label="Close mobile field report form"
                onClick={() => setMobilePitchOpen(false)}
                className="rounded-lg border border-zinc-200 bg-white p-1.5 text-zinc-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {renderPitchFormFields('mobile')}
          </div>
        )}
      </section>

      {/* TODAY'S SYNCHRONIZED DAILY RED FLAG DROP */}
      {dailyStory && dailyLabels && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white">
              <Flame className="h-3.5 w-3.5 text-rose-400" />
              <span>Today’s Daily Drop #{dropNum} • +15 XP</span>
            </span>
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700">
              {dailyStory.aslTag} • {dailyStory.vibeBadge}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
            {dailyStory.headline}
          </h2>
          <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">{dailyStory.story}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleVote(dailyStory.id, 'crown')}
              className={`h-11 rounded-lg font-medium text-sm inline-flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                votes[dailyStory.id] === 'crown'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <Crown className="h-4 w-4 text-emerald-600" />
              <span>{dailyLabels.crownHeroLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => handleVote(dailyStory.id, 'dump')}
              className={`h-11 rounded-lg font-medium text-sm inline-flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                votes[dailyStory.id] === 'dump'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <Flag className="h-4 w-4 text-rose-600" />
              <span>{dailyLabels.dumpHeroLabel}</span>
            </button>
          </div>

          {votes[dailyStory.id] && (
            <div className="space-y-3 pt-1">
              {renderSplitBars(dailyStory)}
              <button
                type="button"
                onClick={handleShareDailyReceipt}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-xs font-medium text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                {copiedDaily ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                <span>
                  {copiedDaily
                    ? 'Daily Verdict Copied for Group Chat!'
                    : `Share Daily #${dropNum} Blind-Spot Receipt`}
                </span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* DOCKET FILTER PILLS */}
      <div
        ref={docketTopRef}
        className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
      >
        {(
          [
            ['all', `🔥 All Cases (${stories.length - 1})`],
            ['split_jury', '⚡ Split-Jury Debates'],
            ['cub_cases', '🐕 Judge the Cub'],
            ['cougar_cases', '🐆 Judge the Cougar'],
            [
              'community',
              `✨ Player Reports${communityCount > 0 ? ` (${communityCount})` : ''}`,
            ],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilterTab(id)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              filterTab === id
                ? 'bg-zinc-900 font-semibold text-white shadow-2xs'
                : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* COURTROOM CASE DOCKET + DESKTOP STICKY PITCH SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
        <div className="space-y-4">
          {filteredDocket.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center space-y-3">
              <p className="text-sm font-medium text-zinc-700">
                No player field reports posted in this view yet, be the first to drop an anonymous case!
              </p>
              <button
                type="button"
                onClick={() => setMobilePitchOpen(true)}
                className="lg:hidden inline-flex h-9 items-center gap-1.5 rounded-full bg-rose-600 px-4 text-xs font-bold text-white cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Drop First Anon Field Report (+15 XP)</span>
              </button>
            </div>
          ) : (
            filteredDocket.map((item) => {
              const voted = votes[item.id];
              const labels = formatPronounLabels(item);
              return (
                <article
                  key={item.id}
                  className={`rounded-2xl border bg-white p-5 shadow-xs space-y-3.5 ${
                    item.communitySubmitted ? 'border-rose-300 ring-1 ring-rose-100' : 'border-zinc-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                    <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-zinc-800">
                      {item.aslTag}
                    </span>
                    <span
                      className={`rounded-md border px-2.5 py-1 ${
                        item.communitySubmitted
                          ? 'border-rose-200 bg-rose-50 font-semibold text-rose-800'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                      }`}
                    >
                      {item.vibeBadge}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
                    {item.headline}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{item.story}</p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleVote(item.id, 'crown')}
                      className={`h-9 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                        voted === 'crown'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      <Crown className="h-3.5 w-3.5" />
                      <span>{labels.crownLabel}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleVote(item.id, 'dump')}
                      className={`h-9 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                        voted === 'dump'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      <Flag className="h-3.5 w-3.5" />
                      <span>{labels.dumpLabel}</span>
                    </button>
                  </div>

                  {voted && (
                    <div className="space-y-2.5">
                      {renderSplitBars(item)}
                      <button
                        type="button"
                        onClick={() => handleShareCaseReceipt(item)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors cursor-pointer"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Share Case Receipt</span>
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        {/* DESKTOP SIDEBAR: PITCH YOUR REAL DATE TO BE GREENLIT INTO THE GAME */}
        <aside
          id="courtroom-pitch-form"
          className="hidden lg:block rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3.5 lg:sticky lg:top-20"
        >
          <div className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
            <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
            <span>Live Courtroom Docket • +15 XP</span>
          </div>

          <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
            Drop an Anonymous Field Report
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Submit an anonymous real-life green flag or red flag. Your case posts immediately to the top of the live Courtroom docket so Cougars &amp; Cubs can vote Crown or Dump.
          </p>

          {renderPitchFormFields('desktop')}

          {pitchStatus && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-900">
              {pitchStatus}
            </div>
          )}
        </aside>
      </div>

      <SocialShareSheetModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </div>
  );
};
