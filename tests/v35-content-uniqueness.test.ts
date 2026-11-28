import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SEED_COURTROOM_STORIES } from '../src/components/ClubCourtroomView';
import { COUGAR_CUB_CHECKLIST_ITEMS } from '../src/components/CougarCubChecklistModal';
import {
  POP_CULTURE_TRIVIA,
  resolveTriviaCategory,
  resolveTriviaLevel,
} from '../src/data/popCultureTrivia';
import { V35_CAST_PROFILES } from '../src/data/v35Cast';
import {
  V35_CHAT_CHAPTERS,
  V35_DATE_SCRIPTS,
  V35_DISCORD_CHANNELS,
  V35_TABLE_9_CONSPIRACY,
} from '../src/data/v35ChatsAndDates';
import { V35_CUB_SCHOOL_DRILLS } from '../src/data/v35CubSchool';
import { V35_WILD_VENUES } from '../src/data/v35WildVenues';

const ZERO_TOLERANCE_BAN_REGEX =
  /pine\s*pollen|bernedoodle|james\s*webb|oatmeal\s+cashmere|photo\s+\d+\s+of\s+\d+|2d\s+cub|2d\s+sim|obedience\s+sim|the\s+dating\s+sim|vetting\s+simulation|next\s+module|12-module/i;

const ICONIC_SINGLE_USE_JOKES: {
  name: string;
  regex: RegExp;
  expectedOwnerId: string;
}[] = [
  { name: "Tito's mirror bottle", regex: /\btito['’]?s\b/i, expectedOwnerId: 'connor' },
  { name: 'Venmo split math', regex: /\bvenmo\b/i, expectedOwnerId: 'devon' },
  { name: 'Roblox stay-home excuse', regex: /\broblox\b/i, expectedOwnerId: 'devon' },
  { name: 'Parents Maui timeshare flex', regex: /\btimeshare\b/i, expectedOwnerId: 'connor' },
  { name: 'Sheryl Crow coastal stereo', regex: /sheryl\s*crow/i, expectedOwnerId: 'elena' },
  { name: 'Qigong / Tai Chi / Seed-Oil wellness', regex: /qigong|tai\s*chi|seed[- ]oil/i, expectedOwnerId: 'astrid' },
];

const VERIFIED_YOUTUBE_IDS = new Set([
  'kIcLb0KAJAs',
  'P15S6ND8kbQ',
  '-8Sx6U6Ou0Q',
  'V8i6PB0gGOA',
  'DhAcAgULwYY',
  'TJcbZoJFLTU',
  'Ytc2eifpiuQ',
  'lTu7j2GOGwQ',
  'pBIGdw-BRxw',
  'QRyyagJ9GPo',
  'Wbhhokv84K4',
  'TOyit5_mEQA',
  'PlCsLXcmxaA',
  'dLRRX2iK7tQ',
  '3d9UYuqXz0I',
  'lp9Z4gc-9UA',
  'r3wbXFzPqcs',
  'qnWSvSrb1-I',
  '_ckWTn-y5Rw',
  'KVNFaxJspMQ',
  'dZLfasMPOU4',
  'WTxS7RrjqqY',
  'yRYFKcMa_Ek',
  '8oE5Z2GLhNc',
]);

function collectCodeFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectCodeFiles(full));
    } else if (/\.(ts|tsx|json)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function extractFiveWordNgrams(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const grams = new Set<string>();
  for (let i = 0; i <= words.length - 5; i++) {
    grams.add(words.slice(i, i + 5).join(' '));
  }
  return grams;
}

describe('v35 7-bucket non-overlapping content vault, banned-trope purge & 55-Q trailer quiz', () => {
  it('purges zero-tolerance narrator/filler clutter everywhere and restricts each iconic joke to strictly 1 rightful character owner', () => {
    const files = [
      ...collectCodeFiles(path.resolve(process.cwd(), 'src')),
      ...collectCodeFiles(path.resolve(process.cwd(), 'worker')),
    ];
    const violations: string[] = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const match = content.match(ZERO_TOLERANCE_BAN_REGEX);
      if (match) {
        violations.push(`${path.relative(process.cwd(), file)}: "${match[0]}"`);
      }
    }
    expect(violations).toEqual([]);

    // Non-character buckets must have 0 occurrences of any single-use iconic joke
    const nonCharacterFiles = files.filter(
      (f) => !f.endsWith('v35Cast.ts') && !f.endsWith('v35ChatsAndDates.ts'),
    );
    for (const file of nonCharacterFiles) {
      const content = fs.readFileSync(file, 'utf8');
      for (const joke of ICONIC_SINGLE_USE_JOKES) {
        expect(
          joke.regex.test(content),
          `Iconic joke "${joke.name}" leaked into ${path.relative(process.cwd(), file)}`,
        ).toBe(false);
      }
    }

    // Across all 22 characters (profile + chat + dates), each iconic joke belongs to strictly 1 owner
    for (const joke of ICONIC_SINGLE_USE_JOKES) {
      const matchingOwners = V35_CAST_PROFILES.filter((profile) => {
        const blob = JSON.stringify({
          profile,
          chat: V35_CHAT_CHAPTERS[profile.id],
          dates: V35_DATE_SCRIPTS[profile.id],
        });
        return joke.regex.test(blob);
      }).map((p) => p.id);

      expect(
        matchingOwners,
        `Expected "${joke.name}" to appear once on ${joke.expectedOwnerId}, got [${matchingOwners.join(', ')}]`,
      ).toEqual([joke.expectedOwnerId]);
    }
  });

  it('delivers 22 authentic first-person Hinge cast profiles, 10 main leads with 3+ dates, and 5 distinct Discord channels', () => {
    expect(V35_CAST_PROFILES.length).toBeGreaterThanOrEqual(20);
    const mainLeads = V35_CAST_PROFILES.filter((p) => p.tier === 'main_lead');
    const traps = V35_CAST_PROFILES.filter((p) => p.tier === 'trap');
    const cameos = V35_CAST_PROFILES.filter((p) => p.tier === 'cameo');

    expect(mainLeads).toHaveLength(10);
    expect(traps).toHaveLength(5);
    expect(cameos.length).toBeGreaterThanOrEqual(5);

    for (const profile of V35_CAST_PROFILES) {
      expect(profile.slides).toHaveLength(6);
      for (const slide of profile.slides) {
        expect(slide.tag).toBe('');
        expect(slide.caption).not.toMatch(/photo\s+\d+|cortado|kitchen|booth/i);
      }
      expect(profile.prompts).toHaveLength(3);
      for (const prompt of profile.prompts) {
        expect(prompt.openers).toHaveLength(3);
        expect(prompt.openers[2].isVipSmooth).toBe(true);
      }
      const chapter = V35_CHAT_CHAPTERS[profile.id];
      expect(chapter, `Missing chat chapter for ${profile.id}`).toBeDefined();
      expect(chapter.tinder).toHaveLength(6);
      expect(chapter.imessage).toHaveLength(6);
    }

    for (const lead of mainLeads) {
      const scripts = V35_DATE_SCRIPTS[lead.id];
      expect(scripts, `Missing date scripts for ${lead.id}`).toBeDefined();
      expect(scripts.length).toBeGreaterThanOrEqual(3);
    }

    expect(V35_DISCORD_CHANNELS).toHaveLength(5);
    const openingTexts = V35_DISCORD_CHANNELS.map((c) => c.seededMessages[0]?.text);
    expect(new Set(openingTexts).size).toBe(5);
    expect(V35_TABLE_9_CONSPIRACY.requiredClueCount).toBe(3);
  });

  it('delivers exact 10 In The Wild venues and 12 quarantined Cub Obedience School drills', () => {
    expect(V35_WILD_VENUES).toHaveLength(10);
    const terminalB = V35_WILD_VENUES.find((v) => v.id === 'terminal-b-airport');
    const hawthorne = V35_WILD_VENUES.find((v) => v.id === 'hawthorne-campus');
    expect(terminalB?.sceneSetupHer.toLowerCase()).toContain('bags');
    expect(hawthorne?.sceneSetupHim.toLowerCase()).toContain('grades');

    expect(V35_CUB_SCHOOL_DRILLS).toHaveLength(12);
    const otherBucketsBlob = JSON.stringify({
      court: SEED_COURTROOM_STORIES,
      checklist: COUGAR_CUB_CHECKLIST_ITEMS,
      cast: V35_CAST_PROFILES,
      chats: V35_CHAT_CHAPTERS,
    }).toLowerCase();

    for (const quarantined of [
      'trash can',
      'flat pillow',
      'whats ur snap',
      'u have snap',
      'charitable donation',
      'sti panel',
    ]) {
      expect(otherBucketsBlob).not.toContain(quarantined);
    }
  });

  it('enforces 24 researched Courtroom cases and 30 3-Tier Checklist items with zero 5-word n-gram overlap across buckets', () => {
    expect(SEED_COURTROOM_STORIES).toHaveLength(24);
    expect(COUGAR_CUB_CHECKLIST_ITEMS).toHaveLength(30);

    const courtGrams = extractFiveWordNgrams(
      SEED_COURTROOM_STORIES.map((s) => `${s.headline} ${s.story}`).join(' '),
    );
    const checklistGrams = extractFiveWordNgrams(
      COUGAR_CUB_CHECKLIST_ITEMS.map((i) => i.text).join(' '),
    );
    const schoolGrams = extractFiveWordNgrams(
      V35_CUB_SCHOOL_DRILLS.map((d) => `${d.title} ${d.scenarioSetup} ${d.rookieCrime}`).join(' '),
    );

    const courtVsChecklist = [...courtGrams].filter((g) => checklistGrams.has(g));
    const courtVsSchool = [...courtGrams].filter((g) => schoolGrams.has(g));
    const checklistVsSchool = [...checklistGrams].filter((g) => schoolGrams.has(g));

    expect(courtVsChecklist).toEqual([]);
    expect(courtVsSchool).toEqual([]);
    expect(checklistVsSchool).toEqual([]);
  });

  it('delivers >= 55 non-repeating Pop-Culture & Official Trailer Quiz questions with verified youtube-nocookie embeds', () => {
    expect(POP_CULTURE_TRIVIA.length).toBeGreaterThanOrEqual(55);
    const ids = POP_CULTURE_TRIVIA.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);

    const noHardFeelings = POP_CULTURE_TRIVIA.find((q) =>
      q.question.toLowerCase().includes('no hard feelings') || q.id.includes('no-hard-feelings'),
    );
    expect(noHardFeelings).toBeDefined();

    // Enforce strict option parallelism & formatting consistency across all 58 questions
    for (const q of POP_CULTURE_TRIVIA) {
      expect(q.options).toHaveLength(4);
      for (const opt of q.options) {
        expect(opt, `${q.id} has untrimmed whitespace in "${opt}"`).toBe(opt.trim());
        expect(opt, `${q.id} starts with lowercase typo in "${opt}"`).not.toMatch(/^[a-z]/);
      }

      // If any song option includes artist attribution ('" by '), all 4 options must include artist attribution
      const byCount = q.options.filter((opt) => /"\s+by\s+/i.test(opt)).length;
      if (byCount > 0) {
        expect(byCount, `${q.id} mixes attributed and unattributed song options`).toBe(4);
      }

      // Prevent dead-giveaway length tells where the correct answer is > 1.85x the average distractor length
      const correctLen = q.options[q.correctIndex].length;
      const wrongAvg =
        q.options
          .filter((_, idx) => idx !== q.correctIndex)
          .reduce((sum, opt) => sum + opt.length, 0) / 3;
      expect(
        correctLen / Math.max(1, wrongAvg),
        `${q.id} correct answer "${q.options[q.correctIndex]}" is disproportionately longer than distractors`,
      ).toBeLessThan(1.85);
    }
    expect(noHardFeelings?.youtubeEmbedUrl).toBe(
      'https://www.youtube-nocookie.com/embed/kIcLb0KAJAs',
    );

    const trailerQuestions = POP_CULTURE_TRIVIA.filter((q) => Boolean(q.youtubeEmbedUrl));
    expect(trailerQuestions.length).toBeGreaterThanOrEqual(20);

    for (const q of trailerQuestions) {
      const m = q.youtubeEmbedUrl?.match(
        /^https:\/\/www\.youtube-nocookie\.com\/embed\/([A-Za-z0-9_-]{11})$/,
      );
      expect(m, `Invalid YouTube embed URL: ${q.youtubeEmbedUrl}`).not.toBeNull();
      expect(VERIFIED_YOUTUBE_IDS.has(m![1]), `Unverified YouTube ID: ${m![1]}`).toBe(true);
    }
  });

  it('guarantees 17/17 bespoke non-repeating Prowl & iMessage beats across genuine leads and 110+ Trivia questions organized across 3 Levels x 7 Categories', () => {
    expect(POP_CULTURE_TRIVIA.length).toBeGreaterThanOrEqual(110);
    for (const cat of [
      'movies',
      'tv',
      'books',
      'music_celebs',
      'sports',
      'royals_history',
      'era_culture',
    ] as const) {
      for (const lvl of [1, 2, 3] as const) {
        const count = POP_CULTURE_TRIVIA.filter(
          (q) => resolveTriviaCategory(q) === cat && resolveTriviaLevel(q) === lvl,
        ).length;
        expect(count, `Category ${cat} Level ${lvl} should have >= 4 questions`).toBeGreaterThanOrEqual(4);
      }
    }

    const genuineProfiles = V35_CAST_PROFILES.filter((p) => p.tier !== 'trap');
    expect(genuineProfiles).toHaveLength(17);

    const beat3Set = new Set(
      genuineProfiles.map((p) => V35_CHAT_CHAPTERS[p.id].tinder[2].incomingMessages[0]),
    );
    const beat4Set = new Set(
      genuineProfiles.map((p) => V35_CHAT_CHAPTERS[p.id].tinder[3].incomingMessages[0]),
    );
    const beat5Set = new Set(
      genuineProfiles.map((p) => V35_CHAT_CHAPTERS[p.id].tinder[4].incomingMessages[0]),
    );
    const imsg3Set = new Set(
      genuineProfiles.map((p) => V35_CHAT_CHAPTERS[p.id].imessage[2].incomingMessages[0]),
    );
    const imsg4NoteSet = new Set(
      genuineProfiles.map((p) => V35_CHAT_CHAPTERS[p.id].imessage[3].photoDrop?.secretNote),
    );

    expect(beat3Set.size).toBe(17);
    expect(beat4Set.size).toBe(17);
    expect(beat5Set.size).toBe(17);
    expect(imsg3Set.size).toBe(17);
    expect(imsg4NoteSet.size).toBe(17);
  });
});
