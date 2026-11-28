import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Award,
  CheckSquare,
  Download,
  Film,
  Flame,
  Newspaper,
  RotateCcw,
  Scale,
  Share2,
  Smartphone,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import type { PlayerRole } from '../domain/taxonomy';
import { awardPassportBonusXp } from '../lib/gamification';
import { downloadReceiptPng } from '../lib/receiptCanvas';
import { sfx } from '../lib/sound';
import { SocialShareSheetModal, type ShareSheetPayload } from './SocialShareSheetModal';
import { Badge, Button } from './ui/primitives';

export interface MonsterPromStats {
  boldness: number;
  poise: number;
  wit: number;
  sanctuary: number;
}

interface PromScenarioChoice {
  label: string;
  statBoost: Partial<MonsterPromStats>;
  receiptItem: string;
  quip: string;
}

interface PromScenarioQuestion {
  id: string;
  badge: string;
  prompt: string;
  choices: [PromScenarioChoice, PromScenarioChoice, PromScenarioChoice];
}

const PROM_ARCHETYPE_QUESTIONS: PromScenarioQuestion[] = [
  {
    id: 'q1-dim-bistro-menu',
    badge: '🕯️ Round 1 of 5 • Dim Bistro Typography Crisis',
    prompt:
      'The moody wine bar prints its menu in 6-point grey italics under a single tea candle. Nobody can read a word. What is your move?',
    choices: [
      {
        label: 'Slip on chic tortoiseshell readers with zero shame and order a bottle of Barolo for the table.',
        statBoost: { poise: 4, boldness: 2 },
        receiptItem: '1x TORTOISESHELL MENU POISE ...... +4 POISE',
        quip: 'Main-character confidence turns reading glasses into a power accessory.',
      },
      {
        label: 'Hold the menu at full medieval town-crier arm’s length and bet your date a kiss if they guess the pasta.',
        statBoost: { wit: 4, boldness: 2 },
        receiptItem: '1x TOWN-CRIER MENU BANTER ........ +4 WIT',
        quip: 'Self-aware humor beats pretending you have hawk vision in the dark!',
      },
      {
        label: 'Whisper to the bartender ahead of time so oysters and two chilled Gibsons land with zero menu squinting.',
        statBoost: { sanctuary: 4, poise: 2 },
        receiptItem: '1x ZERO-SQUINT PRE-ORDER ......... +4 CARE',
        quip: 'Anticipating comfort without saying a word is S-rank courtship.',
      },
    ],
  },
  {
    id: 'q2-enm-vs-brad',
    badge: '🍍 Round 2 of 5 • Subreddit Plot-Twist Radar',
    prompt:
      'Two scenarios pop up in your DMs on the same Thursday: Profile A discloses Solo-Poly + Google Calendar upfront; Profile B drops "We have a Don’t Ask Don’t Tell marriage, text Telegram only." Your call?',
    choices: [
      {
        label: 'Respect transparent Solo-Poly honesty (even if checking fit) and block the fake Telegram DADT cheater in 0.4 seconds.',
        statBoost: { poise: 4, wit: 3 },
        receiptItem: '1x FAKE-DADT CHEATER BLOCKED ..... TOP 6%',
        quip: 'Certified subreddit veteran: real ENM never hides behind vanishing apps in a parking garage.',
      },
      {
        label: 'Reply to the Telegram cheater asking if 6:45 PM Table 9 has good breadsticks just to watch him sweat.',
        statBoost: { boldness: 4, wit: 3 },
        receiptItem: '1x TABLE-9 CHAOS INTERROGATION ... +4 BOLD',
        quip: 'Pure Monster Prom chaos energy, watching a liar panic in real time.',
      },
      {
        label: 'Keep your peace 100% drama-free: hold out strictly for someone whose Friday and Sunday nights are wide open.',
        statBoost: { sanctuary: 5, poise: 2 },
        receiptItem: '1x SANCTUARY PEACE PROTECTED ..... PRICELESS',
        quip: 'Protecting your weekend nervous system is undefeated.',
      },
    ],
  },
  {
    id: 'q3-genx-period-text',
    badge: '📱 Round 3 of 5 • The Punctuation Panic Test',
    prompt:
      'You send a flirty Friday plan at 11:45 AM. Twelve minutes later they reply with two words and a hard period: "Sounds good." plus a 👍 tapback.',
    choices: [
      {
        label: 'Smile and put your phone away: in Gen-X / executive grammar, a period + 👍 means 100% thrilled.',
        statBoost: { poise: 4, sanctuary: 3 },
        receiptItem: '1x GEN-X THUMBS-UP DECODED ....... +4 POISE',
        quip: 'Zero anxious double-texting! You speak fluent cross-generational iMessage.',
      },
      {
        label: 'Volley back dryly: "Careful, one more thumbs-up emoji and I’m bringing you Tuesday peonies."',
        statBoost: { boldness: 4, wit: 3 },
        receiptItem: '1x CHEEKY EMOJI TEASE ............ +4 WIT',
        quip: 'Playful teasing turns generational punctuation into an instant inside joke.',
      },
      {
        label: 'Type "Wait are u mad at me??", aggressively backspace all 25 letters (Emily is Away style), and send the restaurant pin.',
        statBoost: { sanctuary: 3, wit: 3 },
        receiptItem: '1x EMILY-BACKSPACE SAVE .......... CLUTCH',
        quip: 'Every great dater has survived one heroic backspace save before hitting send.',
      },
    ],
  },
  {
    id: 'q4-stayover-thermostat',
    badge: '❄️ Round 4 of 5 • Midnight Stayover Protocol',
    prompt:
      'Date #3 goes electric and you head back for a nightcap. What defines your signature overnight sanctuary?',
    choices: [
      {
        label: '63°F thermostat pre-chilled, crisp cotton percale, lidded bathroom bin, and 22-momme silk pillowcase.',
        statBoost: { sanctuary: 5, poise: 3 },
        receiptItem: '1x 63°F SILK STAYOVER SUITE ...... 5 STARS',
        quip: 'Nobody ever forgets waking up rested with zero 3 AM heat spikes.',
      },
      {
        label: 'Vinyl spinning low, warm amber table lamps on (overhead Big Light banished), and frothy espresso martinis.',
        statBoost: { boldness: 4, wit: 2 },
        receiptItem: '1x BANISHED OVERHEAD BIG LIGHT ... +4 VIBE',
        quip: 'Lighting and music do eighty percent of the seduction.',
      },
      {
        label: 'Love the midnight chemistry AND hand over a 7:30 AM iced latte kiss because Sunday is solo robe-and-crossword time.',
        statBoost: { poise: 4, boldness: 3 },
        receiptItem: '1x LIVING-APART-TOGETHER CROWN ... ICONIC',
        quip: 'Separate house keys + high romance is the secret weapon of lasting age-gap couples.',
      },
    ],
  },
  {
    id: 'q5-waiter-son-boss',
    badge: '🥂 Round 5 of 5 • The Brunch Waiter Boss Fight',
    prompt:
      'A nervous 20-year-old host glances between the two of you and blurts out: "Right this way! Just one cocktail menu, or two?"',
    choices: [
      {
        label: 'Lace fingers on the host stand without blinking: "Two martinis and one King booth, darling."',
        statBoost: { boldness: 5, poise: 3 },
        receiptItem: '1x HOST-STAND POWER HOLD ......... +5 BOLD',
        quip: 'Total daylight pride turns awkward bystanders into instant fans.',
      },
      {
        label: 'Deadpan together: "Two menus, and put a $10 bet down on who wins trivia tonight," then tip 25%.',
        statBoost: { wit: 5, poise: 2 },
        receiptItem: '1x MORTIFIED WAITER RESCUED ...... +5 WIT',
        quip: 'Classy humor + generous tipping is peak Club royalty.',
      },
      {
        label: 'Pull out her chair smoothly, wink across the candle, and let your chemistry answer for the whole room.',
        statBoost: { sanctuary: 4, poise: 4 },
        receiptItem: '1x UNBOTHERED CHAIR-PULL ......... +4 GRACE',
        quip: 'Quiet certainty speaks louder than any comeback.',
      },
    ],
  },
];

export interface ArchetypeVerdict {
  id: string;
  emoji: string;
  title: string;
  percentile: string;
  idealMatch: string;
  blindSpot: string;
  description: string;
}

export function computeArchetypeVerdict(
  stats: MonsterPromStats,
  role: PlayerRole,
): ArchetypeVerdict {
  const entries = Object.entries(stats) as [keyof MonsterPromStats, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const topStat = entries[0][0];

  if (topStat === 'sanctuary') {
    return role === 'her'
      ? {
          id: 'black-cat-sanctuary-queen',
          emoji: '🐈‍⬛',
          title: 'Sovereign Black-Cat Sanctuary Queen',
          percentile: 'TOP 7% OF CLUB REGULARS',
          idealMatch: '5-Star Sous-Chef Cub (Miles / Rafael Energy)',
          blindSpot: 'So cozy in your peaceful house you occasionally forget to unlock the gate on Friday.',
          description:
            '63°F bedroom, crisp linen, Living-Apart-Together boundaries, and zero tolerance for chaos. Once a younger man earns your Sunday morning trust, he never wants to leave.',
        }
      : {
          id: 'five-star-sous-chef-anchor',
          emoji: '🐕',
          title: '5-Star Sous-Chef & Sanctuary Anchor',
          percentile: 'TOP 6% OF VETTED CUBS',
          idealMatch: 'Corner-Office Jaguar or Selective Black Cat (Claire / Sienna)',
          blindSpot: 'Remember to tease playfully too, not just handle every single errand!',
          description:
            'Covered bathroom bin, four plumped pillows, noon Friday confirmations, and homemade Sunday pasta. You are the exact man r/CougarsAndCubs writes appreciation posts about.',
        };
  }

  if (topStat === 'boldness') {
    return role === 'her'
      ? {
          id: 'silver-panther-trailblazer',
          emoji: '🐆',
          title: 'Unapologetic Velvet Trailblazer',
          percentile: 'TOP 8% BOLDNESS TIER',
          idealMatch: 'Fearless Net-Play Architect or Salsa Lead (Søren / Rafael)',
          blindSpot: 'Timid men evaporate on contact; only decisive partners survive past drinks.',
          description:
            'Direct eye contact, passport stamped, open to unconventional chapters (from Living-Apart-Together to transparent Solo-Poly), and allergic to sheepishness.',
        }
      : {
          id: 'hotel-bar-closer-cub',
          emoji: '🔥',
          title: 'High-Voltage Hotel-Bar Closer',
          percentile: 'TOP 9% BOLDNESS TIER',
          idealMatch: 'Cannes Producer or Gallery Icon (Vivienne / Celeste / Astrid)',
          blindSpot: 'Slow down 15% on quiet Sunday mornings so high heat builds deep staying power.',
          description:
            'Zero hesitation at the mahogany bar, unbothered by stares, and bold enough to hand over your number in fifteen seconds flat.',
        };
  }

  if (topStat === 'wit') {
    return {
      id: 'razor-banter-menace',
      emoji: '🍸',
      title:
        role === 'her'
          ? 'Razor-Wit Literary & Cocktail Muse'
          : 'Old-Soul Banter & Vinyl Charmer',
      percentile: 'TOP 8% BANTER VOLTAGE',
      idealMatch:
        role === 'her'
          ? 'Dry-Humored Hampstead Fellow (Julian Energy)'
          : 'Sharp Faculty Chair or Osteria Chef (Elena / Camila)',
      blindSpot: 'Don’t turn every vulnerable moment into a stand-up callback!',
      description:
        'Foreplay starts in dry humor, Fleetwood Mac deep cuts, and spotting a fake "Tokyo market call" from across the room.',
    };
  }

  return {
    id: 'velvet-poise-diplomat',
    emoji: '👑',
    title:
      role === 'her'
        ? 'Cannes-Poise Jaguar Icon'
        : 'Tailored Car-Door Gentleman Cub',
    percentile: 'TOP 5% ETIQUETTE ROYALTY',
    idealMatch:
      role === 'her'
        ? 'Steady Hospitality Builder (Miles / Marcus)'
        : 'Executive Closer or Malibu Insider (Claire / Summer)',
    blindSpot: 'Let your hair down for competitive retro bowling once a month!',
    description:
      'Fluent in Gen-X punctuation, ethical boundaries, proportional generosity, and turning awkward waiter blunders into effortless grace.',
  };
}

export interface ArchetypeAndPromModalProps {
  open: boolean;
  role: PlayerRole;
  initialMode?: 'quiz' | 'hub';
  onClose: () => void;
  onOpenChecklist: () => void;
  onOpenTrivia: () => void;
  onOpenRoastLab: () => void;
  onOpenBlindSync: () => void;
  onOpenCourtroom: () => void;
  onOpenGuides: () => void;
  onOpenCubSchool: () => void;
  onTriggerLiveBannerPing?: () => void;
}

export const ArchetypeAndPromModal: React.FC<ArchetypeAndPromModalProps> = ({
  open,
  role,
  initialMode = 'hub',
  onClose,
  onOpenChecklist,
  onOpenTrivia,
  onOpenRoastLab,
  onOpenBlindSync,
  onOpenCourtroom,
  onOpenGuides,
  onOpenCubSchool,
  onTriggerLiveBannerPing,
}) => {
  const [tab, setTab] = useState<'hub' | 'quiz'>(initialMode);
  const [stepIdx, setStepIdx] = useState(0);
  const [stats, setStats] = useState<MonsterPromStats>({
    boldness: 10,
    poise: 10,
    wit: 10,
    sanctuary: 10,
  });
  const [receiptLines, setReceiptLines] = useState<string[]>([]);
  const [lastQuip, setLastQuip] = useState<string | null>(null);
  const [copiedReddit, setCopiedReddit] = useState(false);
  const [sharePayload, setSharePayload] = useState<ShareSheetPayload | null>(null);

  React.useEffect(() => {
    if (open) {
      setTab(initialMode);
    }
  }, [open, initialMode]);

  if (!open) return null;

  const isDone = stepIdx >= PROM_ARCHETYPE_QUESTIONS.length;
  const currentQ = PROM_ARCHETYPE_QUESTIONS[stepIdx];
  const verdict = computeArchetypeVerdict(stats, role);

  const handlePickChoice = (choice: PromScenarioChoice) => {
    sfx.greenFlag();
    setStats((prev) => ({
      boldness: prev.boldness + (choice.statBoost.boldness ?? 0),
      poise: prev.poise + (choice.statBoost.poise ?? 0),
      wit: prev.wit + (choice.statBoost.wit ?? 0),
      sanctuary: prev.sanctuary + (choice.statBoost.sanctuary ?? 0),
    }));
    setReceiptLines((prev) => [...prev, choice.receiptItem]);
    setLastQuip(choice.quip);

    if (stepIdx + 1 >= PROM_ARCHETYPE_QUESTIONS.length) {
      sfx.victoryFanfare();
      awardPassportBonusXp(
        `archetype_prom_quiz_${role}`,
        25,
        'Club Archetype Unlocked!',
        '🎭 +25 XP',
      );
    }
    setStepIdx((s) => s + 1);
  };

  const resetQuiz = () => {
    sfx.messagePop();
    setStepIdx(0);
    setStats({ boldness: 10, poise: 10, wit: 10, sanctuary: 10 });
    setReceiptLines([]);
    setLastQuip(null);
  };

  const handleDownloadThermalReceipt = () => {
    downloadReceiptPng({
      style: 'thermal',
      badge: 'MARLOW LOUNGE THERMAL RECEIPT',
      bigStat: verdict.percentile,
      verdictLabel: `${verdict.emoji} ${verdict.title}`,
      title: `Ideal Match: ${verdict.idealMatch}`,
      bullets:
        receiptLines.length > 0
          ? receiptLines
          : [
              `BOLDNESS: ${stats.boldness} · POISE: ${stats.poise}`,
              `BANTER WIT: ${stats.wit} · SANCTUARY: ${stats.sanctuary}`,
            ],
      footerNote: `STATS: BOLD ${stats.boldness} | POISE ${stats.poise} | WIT ${stats.wit} | CARE ${stats.sanctuary}`,
      filename: `club-thermal-receipt-${verdict.id}.png`,
    });
  };

  const handleShareArchetype = () => {
    const shareUrl = `${BRAND_CONFIG.publicBaseUrl.replace(
      /\/?$/,
      '/',
    )}?archetype=${encodeURIComponent(verdict.title)}&stat=${encodeURIComponent(
      verdict.percentile,
    )}`;
    setSharePayload({
      title: `${verdict.emoji} I got: ${verdict.title}`,
      message: `${verdict.emoji} Cougars & Cubs Archetype Receipt: "${verdict.title}" (${verdict.percentile})!\n🔥 Bold ${stats.boldness} · 🍸 Poise ${stats.poise} · 🧠 Wit ${stats.wit} · 🛋️ Sanctuary ${stats.sanctuary}\nTake the 60s test:`,
      url: shareUrl,
      shareSurface: 'checklist_25pt',
      onDownloadStoryPng: handleDownloadThermalReceipt,
    });
  };

  const modalContent = (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/65 p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Club Lounge & 60-Second Archetype Quiz"
        onClick={onClose}
      >
        <div
          className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 border-b border-zinc-200 bg-white px-5 py-4 sm:px-6 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Badge variant="accent">Club Lounge &amp; Party Modes</Badge>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950">
                   Quizzes, Thermal Receipts &amp; Wingwoman Utilities
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Club Lounge"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1">
              <button
                type="button"
                onClick={() => setTab('hub')}
                className={`rounded-lg py-2 px-3 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  tab === 'hub'
                    ? 'bg-white text-zinc-950 shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                🥂 All Party Modes (Bento Hub)
              </button>
              <button
                type="button"
                data-testid="lounge-archetype-tab"
                onClick={() => setTab('quiz')}
                className={`rounded-lg py-2 px-3 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  tab === 'quiz'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-zinc-700 hover:text-zinc-950'
                }`}
              >
                🎭 60s Archetype + Receipt Run
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-5 bg-zinc-50/60">
            {tab === 'hub' ? (
              <div className="space-y-4">
                {/* Hero Featured Card: 60s Archetype + Monster Prom 4-Stat Run */}
                <div className="rounded-2xl border-2 border-zinc-950 bg-zinc-950 p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-bold">
                      <Zap className="h-3.5 w-3.5" /> NEW • MONSTER-PROM 4-STAT PARTY RUN
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">
                      Which Cougar or Cub Archetype Are You? (60s)
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      5 rapid-fire social &amp; ENM curveballs → get your 4 Courting Stats, Ideal Match, and a crumpled Marlow Lounge Thermal Receipt PNG.
                    </p>
                  </div>
                  <Button
                    variant="accent"
                    onClick={() => setTab('quiz')}
                    className="shrink-0 min-h-11 text-sm font-bold"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Start 60s Run →</span>
                  </Button>
                </div>

                {/* Clean 2x3 shadcn Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      icon: Flame,
                      badge: 'AI Utility + ENM Radar',
                      title: 'Roast My Opener & ENM Trap Check',
                      desc: 'Paste any DM, bio, or "Don’t Ask Don’t Tell" excuse for a brutal panel score & rewrite.',
                      action: () => {
                        onClose();
                        onOpenRoastLab();
                      },
                    },
                    {
                      icon: CheckSquare,
                      badge: '0–100 Rite of Passage',
                      title: '"Have You Ever?" 3-Tier Checklist',
                      desc: 'Cougars Only, Cubs Only, and Couples Date-Night bingo + auto-unlocked story stamps.',
                      action: () => {
                        onClose();
                        onOpenChecklist();
                      },
                    },
                    {
                      icon: Users,
                      badge: 'Pass-Phone or Link',
                      title: '2-Player Couples Blind Sync',
                      desc: 'Answer 5 spicy scenarios blind and reveal where you match vs. clash.',
                      action: () => {
                        onClose();
                        onOpenBlindSync();
                      },
                    },
                    {
                      icon: Scale,
                      badge: '46 Real Subreddit Cases',
                      title: 'Crown or Dump Courtroom',
                      desc: 'Vote daily age-gap, ENM, and family dilemmas & see Cougar vs. Cub split bars.',
                      action: () => {
                        onClose();
                        onOpenCourtroom();
                      },
                    },
                    {
                      icon: Film,
                      badge: 'Boomers & Gen-X to Gen-Z',
                      title: 'All-Era Pop-Culture Trivia Sprint',
                      desc: '8-question movie, music, Cher, Studio 54 & streaming blitz with trailers.',
                      action: () => {
                        onClose();
                        onOpenTrivia();
                      },
                    },
                    {
                      icon: Newspaper,
                      badge: '16 Shoppable Listicles',
                      title: 'Club Magazine & 12×12 Zodiac',
                      desc: 'Illustrated BuzzFeed guides, 10-point apartment check, and pure astrological readings.',
                      action: () => {
                        onClose();
                        onOpenGuides();
                      },
                    },
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <button
                        key={card.title}
                        type="button"
                        onClick={card.action}
                        className="group flex flex-col justify-between gap-2.5 rounded-2xl border border-zinc-200 bg-white p-4 text-left hover:border-rose-400 hover:shadow-sm transition cursor-pointer"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600">
                              <Icon className="h-4 w-4" />
                              <span>{card.badge}</span>
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-zinc-950 group-hover:text-rose-600 transition-colors">
                            {card.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-zinc-900">Open →</span>
                      </button>
                    );
                  })}
                </div>

                {/* Live Mystic-Messenger / iOS Push Simulator & Cub School Quick Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCubSchool();
                    }}
                    className="font-semibold text-zinc-800 hover:text-rose-600 cursor-pointer"
                  >
                    🎓 Cub Etiquette School (+8% Spark Perk) →
                  </button>
                  {onTriggerLiveBannerPing && (
                    <button
                      type="button"
                      data-testid="simulate-ios-ping-btn"
                      onClick={() => {
                        onClose();
                        onTriggerLiveBannerPing();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                    >
                      <Smartphone className="h-3.5 w-3.5 text-sky-400" />
                      <span>Simulate Live iOS Text Drop</span>
                    </button>
                  )}
                </div>
              </div>
            ) : !isDone && currentQ ? (
              <div className="space-y-4" data-testid="archetype-prom-stage">
                {/* Monster Prom Live 4-Stat Bar */}
                <div className="grid grid-cols-4 gap-2 rounded-2xl border border-zinc-200 bg-white p-3 text-center">
                  {[
                    { label: '🔥 Bold', val: stats.boldness },
                    { label: '🍸 Poise', val: stats.poise },
                    { label: '🧠 Wit', val: stats.wit },
                    { label: '🛋️ Care', val: stats.sanctuary },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-zinc-50 py-1.5 px-2">
                      <div className="text-[11px] sm:text-xs font-semibold text-zinc-500">
                        {s.label}
                      </div>
                      <div className="text-sm sm:text-base font-extrabold text-zinc-950 tabular-nums">
                        {s.val}
                      </div>
                    </div>
                  ))}
                </div>

                {lastQuip && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-950">
                    ✓ {lastQuip}
                  </div>
                )}

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-4">
                  <Badge variant="accent">{currentQ.badge}</Badge>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950 leading-snug">
                    {currentQ.prompt}
                  </h3>
                  <div className="grid gap-2.5">
                    {currentQ.choices.map((ch, idx) => (
                      <button
                        key={ch.label}
                        type="button"
                        data-testid={`prom-choice-${idx}`}
                        onClick={() => handlePickChoice(ch)}
                        className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 hover:border-rose-500 hover:bg-rose-50/40 p-4 text-left text-sm sm:text-base font-medium text-zinc-900 transition cursor-pointer"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-xs font-bold text-white">
                          {['A', 'B', 'C'][idx]}
                        </span>
                        <span className="leading-snug">{ch.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4" data-testid="archetype-verdict-card">
                {/* Collectible Trading Card + Thermal Receipt Preview */}
                <div className="rounded-2xl border-2 border-zinc-950 bg-zinc-950 p-6 text-white space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="accent">
                      <Award className="h-3.5 w-3.5" /> {verdict.percentile}
                    </Badge>
                    <span className="text-xs font-semibold text-amber-300">
                      +25 Club XP Awarded
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-3xl sm:text-4xl">{verdict.emoji}</div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {verdict.title}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                      {verdict.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {[
                      { label: '🔥 Boldness', val: stats.boldness },
                      { label: '🍸 Poise', val: stats.poise },
                      { label: '🧠 Banter Wit', val: stats.wit },
                      { label: '🛋️ Sanctuary', val: stats.sanctuary },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-center"
                      >
                        <div className="text-xs text-zinc-300">{s.label}</div>
                        <div className="text-lg font-extrabold text-amber-300">{s.val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2 text-xs sm:text-sm">
                    <div className="rounded-xl border border-emerald-400/35 bg-emerald-500/15 p-3">
                      <strong className="text-emerald-300">💚 Ideal Match: </strong>
                      <span>{verdict.idealMatch}</span>
                    </div>
                    <div className="rounded-xl border border-rose-400/35 bg-rose-500/15 p-3">
                      <strong className="text-rose-300">🔭 Watch Out For: </strong>
                      <span>{verdict.blindSpot}</span>
                    </div>
                  </div>
                </div>

                {/* Faux Crumpled Thermal Receipt Preview */}
                <div
                  data-testid="thermal-receipt-preview"
                  className="mx-auto max-w-md rounded-xl border border-dashed border-zinc-400 bg-[#FAF8F2] p-5 font-mono text-xs text-zinc-900 shadow-sm space-y-2"
                >
                  <div className="text-center border-b border-dashed border-zinc-400 pb-2 space-y-0.5">
                    <div className="font-bold text-sm">THE MARLOW LOUNGE · SUNSET HILLS</div>
                    <div className="text-[11px] text-zinc-600">
                      OFFICIAL DATING ARCHETYPE RECEIPT
                    </div>
                  </div>
                  <div className="space-y-1 py-1">
                    {receiptLines.map((line, i) => (
                      <div key={i} className="truncate">
                        {line}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-dashed border-zinc-400 pt-2 flex items-center justify-between font-bold">
                    <span>RANK: {verdict.percentile}</span>
                    <span>VERIFIED ✓</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <Button
                    variant="accent"
                    onClick={handleDownloadThermalReceipt}
                    className="min-h-11 text-sm font-bold"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Thermal Receipt PNG</span>
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleShareArchetype}
                    className="min-h-11 text-sm font-bold"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share Dynamic Score Card</span>
                  </Button>
                  <Button
                    variant="outline"
                    data-testid="copy-reddit-archetype-btn"
                    onClick={async () => {
                      const redditSnippet = `**My Cougars & Cubs Club Archetype:** ${verdict.emoji} ${verdict.title} (${verdict.percentile})\n- Stats: 🔥 Bold ${stats.boldness} | 🍸 Poise ${stats.poise} | 🧠 Wit ${stats.wit} | 🛋️ Sanctuary ${stats.sanctuary}\n- Ideal Match: ${verdict.idealMatch}`;
                      try {
                        await navigator.clipboard?.writeText(redditSnippet);
                      } catch {
                        // Ignore clipboard block in jsdom
                      }
                      setCopiedReddit(true);
                      window.setTimeout(() => setCopiedReddit(false), 2400);
                    }}
                    className="min-h-11 text-sm font-semibold"
                  >
                    <span>{copiedReddit ? '✓ Copied for Reddit!' : '📋 Copy Reddit Flair'}</span>
                  </Button>
                  <Button variant="outline" onClick={resetQuiz} className="min-h-11 text-sm">
                    <RotateCcw className="h-4 w-4" />
                    <span>Play Again</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {sharePayload && (
        <SocialShareSheetModal
          payload={sharePayload}
          onClose={() => setSharePayload(null)}
        />
      )}
    </>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
