import { describe, expect, it } from 'vitest';
import { analyzePairing, HER_ARCHETYPES, HIS_ARCHETYPES } from '../src/domain/taxonomy';
import { applyEpisodeChoice, computeRunSummary, createRun } from '../src/domain/gameEngine';
import {
  buildDilemmaShareLink,
  buildEmojiReceipt,
  decodeChallengeParam,
  encodeChallengeLink,
  scorePartnerAudition,
  type ChallengePayload,
} from '../src/lib/viral';

describe('3-part viral engine: 2-player audition links, dilemma deep links & emoji receipts', () => {
  it('round-trips UTF-8 and emoji nicknames safely via Base64URL (Review Focus #1)', () => {
    const payload: ChallengePayload = {
      v: 1,
      senderName: 'Chloé 🐆',
      senderRole: 'her',
      herId: HER_ARCHETYPES[0].id,
      hisId: HIS_ARCHETYPES[0].id,
      episodeIds: ['check-drop', 'waiter-son-incident', 'code-switch-texting', 'trail-run-short-leash', 'mirror-game-insecurities'],
      preferredChoiceIndices: [0, 0, 0, 0, 0],
    };

    const link = encodeChallengeLink(payload, 'https://sudosoph.github.io/velvet-den/');
    const url = new URL(link);
    const rawParam = url.searchParams.get('challenge');

    const decoded = decodeChallengeParam(rawParam);
    expect(decoded).toEqual(payload);
  });

  it('returns null without throwing on truncated, tampered, or wrong-version challenge links (Review Focus #1)', () => {
    expect(decodeChallengeParam(null)).toBeNull();
    expect(decodeChallengeParam('')).toBeNull();
    expect(decodeChallengeParam('%%%not-base64%%%')).toBeNull();
    expect(decodeChallengeParam('eyJ2IjoyfQ')).toBeNull(); // {"v":2}
    expect(decodeChallengeParam('eyJ2IjoxLCJzZW5kZXJOYW1lIjoiQWxpY2UifQ')).toBeNull(); // missing arrays
  });

  it('scores partner audition compatibility accurately and generates custom roast/praise notes', () => {
    const payload: ChallengePayload = {
      v: 1,
      senderName: 'Serena',
      senderRole: 'her',
      herId: 'serena-princess-cougar',
      hisId: 'leo-golden-cub',
      episodeIds: ['check-drop', 'waiter-son-incident', 'code-switch-texting', 'princess-soft-life', 'mirror-game-insecurities'],
      preferredChoiceIndices: [0, 0, 0, 0, 0],
    };

    const perfect = scorePartnerAudition(payload, [0, 0, 0, 0, 0]);
    expect(perfect.matchPercent).toBe(100);
    expect(perfect.alignedCount).toBe(5);

    const zero = scorePartnerAudition(payload, [1, 1, 1, 1, 1]);
    expect(zero.matchPercent).toBe(0);
    expect(zero.roastNotes.length).toBeGreaterThan(0);
  });

  it('builds 1-tap dilemma links and Wordle-style Emoji Vetting Receipts', () => {
    const dilemmaUrl = buildDilemmaShareLink('waiter-son-incident', 'https://sudosoph.github.io/velvet-den/');
    expect(dilemmaUrl).toBe('https://sudosoph.github.io/velvet-den/?dilemma=waiter-son-incident');

    let run = createRun(analyzePairing(HER_ARCHETYPES[0], HIS_ARCHETYPES[0], 'her'));
    run = applyEpisodeChoice(run, 0);
    const summary = computeRunSummary(run);

    const receipt = buildEmojiReceipt(summary, 'https://sudosoph.github.io/velvet-den/');
    expect(receipt).toContain('THE COUGAR DEN');
    expect(receipt).toContain('https://sudosoph.github.io/velvet-den/');
    expect(receipt).toContain(summary.rankTitle);
  });
});
