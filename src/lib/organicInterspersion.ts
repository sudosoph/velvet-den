export interface ExperienceBingoEventDetail {
  itemId: string;
  title: string;
  points: number;
}

const AUTO_BINGO_SEEN_KEY = 'cc_organic_bingo_seen_v1';

export function emitOrganicBingoUnlock(
  itemId: string,
  title: string,
  points: 2 | 3 | 5 = 3,
): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const rawSeen = window.localStorage?.getItem(AUTO_BINGO_SEEN_KEY);
    const seenList: string[] = rawSeen ? (JSON.parse(rawSeen) as string[]) : [];
    if (seenList.includes(itemId)) return false;

    const nextSeen = [...seenList, itemId];
    window.localStorage?.setItem(AUTO_BINGO_SEEN_KEY, JSON.stringify(nextSeen));

    // Also tick the checklist storage array so opening the Checklist reflects your live play!
    for (const storageKey of ['velvet_checklist_3tier_v35', 'cc_checklist_cougars_v1']) {
      const existingRaw = window.localStorage?.getItem(storageKey);
      const existing: string[] = existingRaw ? (JSON.parse(existingRaw) as string[]) : [];
      if (!existing.includes(itemId)) {
        window.localStorage?.setItem(storageKey, JSON.stringify([...existing, itemId]));
      }
    }

    window.dispatchEvent(
      new CustomEvent<ExperienceBingoEventDetail>('cc:experience-bingo', {
        detail: { itemId, title, points },
      }),
    );
    return true;
  } catch {
    return false;
  }
}

export interface InFeedIntermissionCardSpec {
  id: string;
  kind: 'courtroom' | 'trivia_bluff' | 'enm_radar';
  badge: string;
  question: string;
  optionA: string;
  optionB: string;
  winningIndex: 0 | 1;
  verdictText: string;
  linkedSurfaceLabel: string;
  targetAction: 'courtroom' | 'trivia' | 'roast_enm' | 'guides_dilemmas';
}

export const IN_FEED_INTERMISSION_CARDS: InFeedIntermissionCardSpec[] = [
  {
    id: 'intermission-brad-slide5',
    kind: 'enm_radar',
    badge: '🍍 ENM vs. Trap Quick-Check',
    question:
      'Four solo photos on Prowl, then on Date #1 she casually mentions "My husband Brad is parking the car so all three of us can vibe!" Verdict?',
    optionA: '🚩 Undisclosed Unicorn Ambush (Dump)',
    optionB: '👑 Totally Fine Surprise (Crown)',
    winningIndex: 0,
    verdictText:
      '96% of Cougars & ENM regulars agree: real ethical non-monogamy discloses upfront in Bio Line #1, never as a parking-lot ambush!',
    linkedSurfaceLabel: 'Test a Bio in ENM & Roast Lab →',
    targetAction: 'roast_enm',
  },
  {
    id: 'intermission-nirvana-bluff',
    kind: 'trivia_bluff',
    badge: '🎸 Live Generational Bluff Check',
    question:
      'Your 44F Gen-X date puts Fleetwood Mac’s "Rumours" on vinyl and asks who sang "Silver Springs." Which answer saves Friday night?',
    optionA: 'Stevie Nicks (written for Lindsey Buckingham)',
    optionB: 'Alanis Morissette on MTV Unplugged',
    winningIndex: 0,
    verdictText:
      'Nailed it! Knowing Stevie Nicks wrote "Silver Springs" staring daggers across the studio earns instant kitchen-island wine privileges.',
    linkedSurfaceLabel: 'Play All-Era Pop Trivia Sprint →',
    targetAction: 'trivia',
  },
  {
    id: 'intermission-town-crier-menu',
    kind: 'courtroom',
    badge: '⚖️ 10-Second Split-Jury Poll',
    question:
      'Dim bistro menu in 6-point grey italics: he quietly photographs the specials and zooms in 200% for both of you without making an age joke.',
    optionA: '👑 Crown Him (Chivalry Genius)',
    optionB: '🚩 Dump Him (Too Cheeky)',
    winningIndex: 0,
    verdictText:
      '98% Crowned! Solving dim-speakeasy typography with zero commentary is elite younger-partner intuition.',
    linkedSurfaceLabel: 'Vote 45 More Cases in Courtroom →',
    targetAction: 'courtroom',
  },
];
