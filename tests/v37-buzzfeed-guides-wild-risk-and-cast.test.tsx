import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClubCourtroomView } from '../src/components/ClubCourtroomView';
import { HingeFeedView } from '../src/components/HingeFeedView';
import { InTheWildMapView } from '../src/components/InTheWildMapView';
import { PopCultureTriviaModal } from '../src/components/PopCultureTriviaModal';
import { VelvetJournalView } from '../src/components/VelvetJournalView';
import { JOURNAL_ARTICLES } from '../src/data/journalArticles';
import { POP_CULTURE_TRIVIA, resolveTriviaCategory } from '../src/data/popCultureTrivia';
import { getWildFollowUpSequence, V35_WILD_VENUES } from '../src/data/v35WildVenues';
import { createDefaultWallet } from '../src/domain/economy';

describe('v37 BuzzFeed Shoppable Photo Listicles, Pure Astrological Matcher, 11x11 Cast, All-Era Trivia & High-Risk Wild Detection', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('displays all 10 illustrated apartment upgrades with real product photos & share buttons, plus an immediately browsable 16-guide directory grid', () => {
    render(
      <VelvetJournalView
        initialSlug="first-time-hosting-older-woman-apartment-checklist"
        onPlayScenario={vi.fn()}
      />,
    );

    // Directory browser is immediately visible with all 16 articles and category filters
    const directory = screen.getByTestId('guide-directory-browser');
    expect(directory).toBeInTheDocument();
    expect(JOURNAL_ARTICLES).toHaveLength(16);

    // All 10/10 items on the 10-point apartment checklist render with their own section photo AND illustrated inline Shop Pick card
    const sectionCards = screen.getAllByTestId('guide-section-visual-card');
    expect(sectionCards).toHaveLength(10);

    const inlineShopCards = screen.getAllByTestId('guide-inline-shop-card');
    expect(inlineShopCards).toHaveLength(10);
    for (const shopCard of inlineShopCards) {
      expect(shopCard.querySelector('img')).not.toBeNull();
    }

    // Per-item share links exist across all 10 showcased upgrades
    expect(screen.getAllByRole('button', { name: /Share item \d+:/i })).toHaveLength(10);
  });

  it('renders pure astrological Cougar × Cub readings with zero random game cast characters or cast face photos', () => {
    render(
      <VelvetJournalView
        initialSlug="astrology-zodiac-compatibility-older-woman-younger-man"
        onPlayScenario={vi.fn()}
      />,
    );

    const astro = screen.getByTestId('zodiac-12x12-matcher');
    const imgs = Array.from(astro.querySelectorAll('img'));
    expect(imgs.length).toBeGreaterThanOrEqual(3);

    // Zero random game cast photos in the astrological matcher (editorial scene mood imagery only)
    for (const img of imgs) {
      expect(img.getAttribute('src')).toMatch(/^\.\/images\/scenes\/.+\.jpg$/);
      expect(img.getAttribute('src')).not.toMatch(/\/images\/cast\//);
    }

    expect(astro.textContent).toMatch(/Venusian|Pluto|Soulmate Sanctuary Tier/i);
  });

  it('unlocks symmetric 11 Men (as Her) and 11 Women (as Him) on Prowl while keeping Julian #1', () => {
    const wallet = createDefaultWallet(new Date('2026-11-27T12:00:00Z'));
    const { rerender } = render(
      <HingeFeedView
        role="her"
        wallet={wallet}
        matchedLeadIds={[]}
        cutLooseIds={[]}
        onSendHingeOpener={vi.fn()}
        onSwitchRole={vi.fn()}
        onOpenWildMap={vi.fn()}
      />,
    );

    const stripHer = screen.getByTestId('hinge-cast-strip');
    expect(stripHer.textContent).toContain('Tonight’s 11 Singles');
    expect(within(stripHer).getAllByRole('button')).toHaveLength(11);
    expect(screen.getByRole('heading', { name: /^Julian$/i })).toBeInTheDocument();

    rerender(
      <HingeFeedView
        role="him"
        wallet={wallet}
        matchedLeadIds={[]}
        cutLooseIds={[]}
        onSendHingeOpener={vi.fn()}
        onSwitchRole={vi.fn()}
        onOpenWildMap={vi.fn()}
      />,
    );

    const stripHim = screen.getByTestId('hinge-cast-strip');
    expect(stripHim.textContent).toContain('Tonight’s 11 Singles');
    expect(within(stripHim).getAllByRole('button')).toHaveLength(11);
  });

  it('features Boomer, Silver Panther & Gen-X questions inside the expanded era_culture trivia category', () => {
    const eraQuestions = POP_CULTURE_TRIVIA.filter(
      (q) => resolveTriviaCategory(q) === 'era_culture',
    );
    expect(eraQuestions.length).toBeGreaterThanOrEqual(12);
    expect(eraQuestions.some((q) => q.id === 'genx-cassette-pencil-rewind-ritual')).toBe(true);
    expect(eraQuestions.some((q) => q.id === 'boomer-helen-mirren-taylor-hackford')).toBe(true);

    render(
      <PopCultureTriviaModal
        open={true}
        onClose={vi.fn()}
        onEarnTriviaReward={() => false}
      />,
    );

    expect(
      screen.getByRole('button', { name: /Boomers & Gen-X to Gen-Z/i }),
    ).toBeInTheDocument();
  });

  it('enforces 1-in-3 signal precision, Approachability Diagnosis on 3/3 scan, Polite Brush-Offs, -1 Heart crash-outs, and poppy turn banners in In The Wild', () => {
    for (const venue of V35_WILD_VENUES) {
      for (const role of ['her', 'him'] as const) {
        const seq = getWildFollowUpSequence(venue.id, role, 'Lead');
        const beat2Passes = seq.beat2.choices.filter(
          (c) => !c.isMemeFail && !c.isPoliteBrushOff,
        );
        const beat3Passes = seq.beat3.choices.filter(
          (c) => !c.isMemeFail && !c.isPoliteBrushOff,
        );
        expect(beat2Passes).toHaveLength(1);
        expect(beat3Passes).toHaveLength(1);
      }
    }

    const onLoseHeart = vi.fn();
    const onUnlockWildLead = vi.fn();
    render(
      <InTheWildMapView
        role="him"
        activeLeadThreads={[]}
        completedCameoVenues={[]}
        initialVenueId="velvet-room"
        onUnlockWildLead={onUnlockWildLead}
        onCompleteCameo={vi.fn()}
        onLoseHeart={onLoseHeart}
      />,
    );

    // Trying secondary cheeky opener blind (0/3 scanned) triggers Polite Brush-Off + poppy banner!
    fireEvent.click(screen.getByRole('button', { name: /fresh cocktail olive/i }));
    expect(screen.getByTestId('wild-turn-pop-banner').textContent).toMatch(/BLIND APPROACH/i);
    expect(onUnlockWildLead).not.toHaveBeenCalled();

    // Rewind, scan all 3 Room Signals -> unlocks Approachability Diagnosis!
    fireEvent.click(screen.getByRole('button', { name: /Read the 3 Room Signals/i }));
    const scanner = screen.getByTestId('wild-room-scanner');
    for (const btn of within(scanner).getAllByRole('button')) {
      fireEvent.click(btn);
    }
    expect(screen.getByTestId('wild-approachability-verdict').textContent).toMatch(
      /OPEN WINDOW/i,
    );

    // Rookie crash-out deducts 1 Friday Heart!
    fireEvent.click(screen.getByRole('button', { name: /boss lady/i }));
    expect(onLoseHeart).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('wild-turn-pop-banner').textContent).toMatch(/SHOT DOWN/i);
  });

  it('includes the 6 under-represented Reddit age-gap dilemmas in Club Courtroom', () => {
    render(
      <ClubCourtroomView
        role="her"
        initialCaseId="court-holiday-gala-dirty-secret-dodge"
        onBackToRoster={vi.fn()}
        onOpenCubAcademy={vi.fn()}
        onCastCourtVote={vi.fn()}
        onGrantBonusCredits={() => false}
      />,
    );

    expect(
      screen.getByText(/Winter Gala Allowed "Zero Plus-Ones"/i),
    ).toBeInTheDocument();
  });
});
