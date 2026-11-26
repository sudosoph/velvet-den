import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { analyzePairing, HER_ARCHETYPES, HIS_ARCHETYPES } from '../src/domain/taxonomy';
import {
  buildDilemmaShareLink,
  buildDiscordReceipt,
  buildEmojiReceipt,
  decodeChallengeParam,
  drawStoryReceiptToCanvas,
  encodeChallengeLink,
  scorePartnerAudition,
  type ChallengePayload,
  type RunSummary,
} from '../src/lib/viral';
import { SocialShareSheetModal } from '../src/components/SocialShareSheetModal';
import * as analytics from '../src/lib/analytics';

describe('3-part viral engine: 2-player audition links, dilemma deep links & emoji receipts', () => {
  it('round-trips UTF-8 and emoji nicknames safely via Base64URL', () => {
    const payload: ChallengePayload = {
      v: 1,
      senderName: 'Chloé 🐆',
      senderRole: 'her',
      herId: HER_ARCHETYPES[0].id,
      hisId: HIS_ARCHETYPES[0].id,
      episodeIds: ['check-drop', 'waiter-son-incident', 'code-switch-texting', 'trail-run-short-leash', 'mirror-game-insecurities'],
      preferredChoiceIndices: [0, 0, 0, 0, 0],
    };

    const link = encodeChallengeLink(payload, 'https://cougarsandcubs.club/');
    const url = new URL(link);
    const rawParam = url.searchParams.get('challenge');

    const decoded = decodeChallengeParam(rawParam);
    expect(decoded).toEqual(payload);
  });

  it('returns null without throwing on truncated, tampered, or wrong-version challenge links', () => {
    expect(decodeChallengeParam(null)).toBeNull();
    expect(decodeChallengeParam('')).toBeNull();
    expect(decodeChallengeParam('%%%not-base64%%%')).toBeNull();
    expect(decodeChallengeParam('eyJ2IjoyfQ')).toBeNull();
    expect(decodeChallengeParam('eyJ2IjoxLCJzZW5kZXJOYW1lIjoiQWxpY2UifQ')).toBeNull();
  });

  it('scores partner audition compatibility accurately and generates custom roast/praise notes', () => {
    const payload: ChallengePayload = {
      v: 1,
      senderName: 'Serena',
      senderRole: 'her',
      herId: 'claire',
      hisId: 'julian',
      episodeIds: ['check-drop', 'waiter-son-incident', 'code-switch-texting', 'princess-soft-life', 'mirror-game-insecurities'],
      preferredChoiceIndices: [0, 0, 0, 0, 0],
    };

    const perfect = scorePartnerAudition(payload, [0, 0, 0, 0, 0]);
    expect(perfect.matchPercent).toBe(100);
    expect(perfect.alignedCount).toBe(5);

    const zero = scorePartnerAudition(payload, [2, 2, 2, 2, 2]);
    expect(zero.matchPercent).toBe(0);
    expect(zero.roastNotes.length).toBeGreaterThan(0);
  });

  it('builds 1-tap dilemma links and 9:16 Story Canvas Vetting Receipts without overflow', () => {
    const dilemmaUrl = buildDilemmaShareLink('velvet-room', 'https://cougarsandcubs.club/');
    expect(dilemmaUrl).toBe('https://cougarsandcubs.club/?dilemma=velvet-room');

    const summary: RunSummary = {
      pairing: analyzePairing(HER_ARCHETYPES[0], HIS_ARCHETYPES[0], 'her'),
      overallScore: 94,
      rankTitle: 'S-RANK VELVET PALMS LIFEMATE',
      redFlags: 0,
      caughtBottleTrap: true,
      stats: { maturity: 92, chivalry: 95, eq: 94, chemistry: 96 },
      badges: ['Corner-Booth Certified'],
      episodeHighlights: [{ emoji: '🍸', title: 'The Velvet Room Spark' }],
    };

    const receipt = buildEmojiReceipt(summary, 'https://cougarsandcubs.club/');
    expect(receipt).toContain('COUGARS & CUBS CLUB');
    expect(receipt).toContain('https://cougarsandcubs.club/');

    const discordCard = buildDiscordReceipt(summary, 'https://cougarsandcubs.club/');
    expect(discordCard).toContain('COUGARS & CUBS CLUB');

    const drawnCalls: { text: string; x: number; y: number; maxWidth?: number; align: string }[] = [];
    const fakeCtx = {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '30px sans-serif',
      textAlign: 'left',
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillRect: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      quadraticCurveTo: () => {},
      closePath: () => {},
      stroke: () => {},
      fill: () => {},
      measureText: (txt: string) => ({ width: txt.length * 22 }),
      fillText(txt: string, x: number, y: number, maxWidth?: number) {
        drawnCalls.push({ text: txt, x, y, maxWidth, align: this.textAlign });
      },
    };
    const fakeCanvas = {
      width: 0,
      height: 0,
      getContext: () => fakeCtx,
    } as unknown as HTMLCanvasElement;

    drawStoryReceiptToCanvas(
      fakeCanvas,
      {
        ...summary,
        rankTitle: 'APEX COUGARS & CUBS CLUB LIFEMATE EXTRAORDINAIRE WITH VERY LONG TITLE',
        badges: [
          '18-Hour Midnight Hotel Pool & Cedar Sauna Getaway Legend With Extra Words',
          'Black Cat & Golden Retriever Slow-Burn Polarity Champion',
        ],
      },
      'https://cougarsandcubs.club/',
    );

    expect(fakeCanvas.width).toBe(1080);
    expect(fakeCanvas.height).toBe(1920);
    for (const call of drawnCalls) {
      expect(call.maxWidth).toBeDefined();
      expect(call.maxWidth!).toBeLessThanOrEqual(870);
    }
  });

  it('renders Instagram-style SocialShareSheetModal with all 9 channels and fires PostHog share_triggered', () => {
    const spy = vi.spyOn(analytics, 'trackEvent');
    render(
      React.createElement(SocialShareSheetModal, {
        payload: {
          title: 'Send Profile to Bestie',
          message: 'Would you match with Marcus, 26?!',
          url: 'https://cougarsandcubs.club/?dilemma=marcus',
          shareSurface: 'bestie_profile',
        },
        onClose: () => {},
      }),
    );

    for (const label of [
      'iMessage / SMS',
      'WhatsApp',
      'Instagram',
      'TikTok',
      'Discord',
      'X',
      'Threads',
      'Telegram',
      'Copy Link',
    ]) {
      expect(screen.getByRole('button', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    }

    fireEvent.click(screen.getByRole('button', { name: /Copy Link/i }));
    expect(spy).toHaveBeenCalledWith(
      'share_triggered',
      expect.objectContaining({
        channel: 'copy_link',
        share_surface: 'bestie_profile',
      }),
    );
    spy.mockRestore();
  });
});
