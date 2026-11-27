import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  type ActiveMatchThread,
  ChatsAndDatesView,
  createInitialThread,
} from '../src/components/ChatsAndDatesView';
import { CubSchoolView } from '../src/components/CubSchoolView';
import { RomanticDateStage } from '../src/components/RomanticDateStage';
import {
  createDefaultWallet,
  loseFridayHeart,
  recordBulletDodged,
  unlockContentWithCredits,
  type WalletState,
} from '../src/domain/economy';

function Harness({
  initialThreads,
  initialWallet,
  role = 'her',
}: {
  initialThreads: ActiveMatchThread[];
  initialWallet?: WalletState;
  role?: 'her' | 'him';
}) {
  const [threads, setThreads] = useState<ActiveMatchThread[]>(initialThreads);
  const [wallet, setWallet] = useState<WalletState>(
    initialWallet ?? createDefaultWallet(new Date('2026-11-26T12:00:00Z')),
  );
  const [cutLooseIds, setCutLooseIds] = useState<string[]>([]);

  return (
    <div>
      <div data-testid="wallet-summary">
        Hearts:{wallet.fridayHearts}|XP:{wallet.discernmentXp}|Cr:{wallet.credits}|Clues:
        {wallet.conspiracyClues.length}
      </div>
      <ChatsAndDatesView
        role={role}
        wallet={wallet}
        threads={threads}
        cutLooseIds={cutLooseIds}
        onUpdateThread={(updated) =>
          setThreads((prev) => prev.map((t) => (t.leadId === updated.leadId ? updated : t)))
        }
        onSpendCredits={(cost) => {
          if (!wallet.isVip && wallet.credits < cost) return false;
          if (!wallet.isVip && cost > 0) {
            setWallet((w) => ({ ...w, credits: w.credits - cost }));
          }
          return true;
        }}
        onUnlockBucketItem={(bucket, itemId, cost) => {
          const res = unlockContentWithCredits(wallet, bucket, itemId, cost);
          if (res.ok) setWallet(res.wallet);
          return res.ok;
        }}
        onCutLooseTrap={(leadId, clueId) => {
          setCutLooseIds((prev) => [...prev, leadId]);
          setWallet((w) => recordBulletDodged(w, leadId, clueId));
        }}
        onConfirmCutGenuine={(leadId) => {
          setCutLooseIds((prev) => [...prev, leadId]);
        }}
        onLoseHeart={() => setWallet((w) => loseFridayHeart(w))}
        onOpenHinge={vi.fn()}
        onOpenBoutique={vi.fn()}
      />
    </div>
  );
}

describe('v35 Multi-Match Evolving Chats, Cut-Loose Discernment, Romantic Date Stage & Cub School', () => {
  it('shows all matched threads simultaneously, starts Hinge matches in App DM (zero premature iMessage) until Beat 6 graduation, wraps suggestions without truncate, and gives 5 distinct Discord channels', () => {
    const threads = [
      createInitialThread('julian', 'hinge'),
      createInitialThread('soren', 'hinge'),
      createInitialThread('graham', 'hinge'),
    ];

    const { container } = render(<Harness initialThreads={threads} role="her" />);

    // All 3 matched leads appear simultaneously in the roster sidebar
    expect(screen.getAllByText(/Julian/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Søren/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Graham/i).length).toBeGreaterThanOrEqual(1);

    // Ungraduated Hinge thread shows App DM badge and NEVER tells Her to earn his number or enroll in Cub Obedience School
    expect(screen.getAllByText(/Hinge App DM/i).length).toBeGreaterThanOrEqual(1);
    expect(container.textContent || '').not.toMatch(
      /enroll in cub obedience|earn his number/i,
    );

    // Zero suggestion buttons have CSS `truncate`
    const buttons = Array.from(container.querySelectorAll('button'));
    for (const btn of buttons) {
      expect(btn.className).not.toContain('truncate');
    }

    // Advance Julian across 6 App DM beats -> Beat 6 presents "Give Him My Number (Move to iMessage)" -> upgrades into Blue-Bubble iMessage!
    for (let beat = 1; beat <= 6; beat++) {
      const choiceBtns = screen.getAllByTestId('chat-suggestion-btn');
      fireEvent.click(choiceBtns[0]);
    }
    const giveNumBtn = screen.getByRole('button', {
      name: /Give Him My Number/i,
    });
    fireEvent.click(giveNumBtn);
    expect(screen.getAllByText(/Earned iMessage/i).length).toBeGreaterThanOrEqual(1);

    // Switch to Club Discord Lounge and verify all 5 channels have distinct opening messages & suggestions
    fireEvent.click(screen.getByRole('button', { name: /Club Discord Lounge/i }));
    const seenOpenings = new Set<string>();
    for (const chLabel of [
      '#friday-lounge',
      '#red-flag-emergency',
      '#ask-a-cougar',
      '#spotted-in-the-wild',
      '#blind-spark-dm',
    ]) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(chLabel, 'i') }));
      const firstMsg = screen.getByTestId('discord-first-message').textContent || '';
      seenOpenings.add(firstMsg);
    }
    expect(seenOpenings.size).toBe(5);
  });

  it('awards +25 Discernment XP & Bullet-Dodged Receipt when cutting Trap Graham loose, while showing Bestie self-sabotage check on Genuine Lead Julian', () => {
    const threads = [
      createInitialThread('graham', 'hinge'),
      createInitialThread('julian', 'hinge'),
    ];
    render(<Harness initialThreads={threads} role="her" />);

    // Cut disguised Trap Graham loose -> +25 XP, 3 hearts preserved, scannable 3-tile receipt modal shown
    fireEvent.click(screen.getByRole('button', { name: /Cut Loose/i }));
    const dodgedModal = screen.getByTestId('bullet-dodged-modal');
    expect(dodgedModal.textContent).toMatch(/BULLET DODGED/i);
    expect(dodgedModal.textContent).toContain('+25 XP');
    expect(dodgedModal.textContent).toContain('Friday Heart');
    expect(dodgedModal.textContent).toContain('Table 9 File');
    expect(screen.getByTestId('wallet-summary').textContent).toContain('Hearts:3|XP:25');
    expect(screen.getByTestId('wallet-summary').textContent).toContain('Clues:1');

    // Select Genuine Lead Julian and click Cut Loose -> Bestie reality-check modal instead of false trap bonus!
    fireEvent.click(screen.getByTestId('thread-select-julian'));
    fireEvent.click(screen.getByRole('button', { name: /Cut Loose/i }));
    expect(screen.getByText(/Julian Is Genuine/i)).toBeTruthy();
    expect(screen.getByTestId('wallet-summary').textContent).toContain('XP:25');
  });

  it('plays RomanticDateStage with live expression transitions, Night-1 Pacing Test, S/A/B Date Rank (free replay, zero Smooth Rewind), Secret Group-Chat Leak, and Disaster heart loss on Traps', async () => {
    const onCompleteDate = vi.fn();
    const onLoseHeart = vi.fn();
    const onUnlockPov = vi.fn(() => true);
    const wallet = createDefaultWallet();

    const { container, rerender } = render(
      <RomanticDateStage
        leadId="soren"
        dateNumber={1}
        role="her"
        wallet={wallet}
        onCompleteDate={onCompleteDate}
        onLoseHeart={onLoseHeart}
        onSpendCredits={() => true}
        onUnlockPov={onUnlockPov}
        onUnlockEpilogue={() => true}
        onBackToChats={vi.fn()}
      />,
    );

    // Zero "Smooth Rewind" paywall anywhere
    expect(container.textContent || '').not.toMatch(/smooth rewind/i);

    // Step through Date 1's 3 beats choosing S-Rank slow-burn options
    fireEvent.click(
      screen.getByRole('button', {
        name: /Match their eye contact warmly/i,
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /Listen attentively and respond/i,
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /Savor a lingering goodnight kiss/i,
      }),
    );

    // Date Rank summary appears with S-RANK + Free Replay + 2 Cr Secret Group-Chat Leak
    expect(screen.getByText(/S-RANK/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Replay Date Free/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Unlock Secret Group-Chat Leak/i }));
    expect(onUnlockPov).toHaveBeenCalled();
    expect(screen.getByText(/Mate, I am completely done for/i)).toBeTruthy();

    // Walking into Date 1 with Trap Graham triggers Date Disaster (-1 Friday Heart, zero Smooth Rewind!)
    rerender(
      <RomanticDateStage
        leadId="graham"
        dateNumber={1}
        role="her"
        wallet={wallet}
        onCompleteDate={onCompleteDate}
        onLoseHeart={onLoseHeart}
        onSpendCredits={() => true}
        onUnlockPov={onUnlockPov}
        onUnlockEpilogue={() => true}
        onBackToChats={vi.fn()}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /Walk into the ambush unprepared/i,
      }),
    );
    expect(onLoseHeart).toHaveBeenCalledTimes(1);
    expect(container.textContent || '').not.toMatch(/smooth rewind/i);

    // Zero spoken "xx" text sign-offs anywhere inside spoken V35_DATE_SCRIPTS, and Julian Date #2 splits Stage Action from Spoken Card
    const { V35_DATE_SCRIPTS } = await import('../src/data/v35ChatsAndDates');
    for (const scripts of Object.values(V35_DATE_SCRIPTS)) {
      for (const s of scripts) {
        for (const b of s.beats) {
          expect(b.dialogue).not.toMatch(/\bxx\b/i);
          for (const ch of b.choices) {
            expect(ch.label).not.toMatch(/\bxx\b/i);
            expect(ch.response).not.toMatch(/\bxx\b/i);
          }
        }
      }
    }

    rerender(
      <RomanticDateStage
        leadId="julian"
        dateNumber={2}
        role="her"
        wallet={wallet}
        onCompleteDate={onCompleteDate}
        onLoseHeart={onLoseHeart}
        onSpendCredits={() => true}
        onUnlockPov={onUnlockPov}
        onUnlockEpilogue={() => true}
        onBackToChats={vi.fn()}
      />,
    );
    expect(screen.getByText(/Julian Speaks/i)).toBeInTheDocument();
    expect(screen.getByText(/S-Rank Chemistry/i)).toBeInTheDocument();
  });

  it('unlocks the Secret Table 9 Conspiracy Takedown episode once 3 clues are collected', () => {
    const clueWallet: WalletState = {
      ...createDefaultWallet(),
      conspiracyClues: ['clue-graham-645', 'clue-brooke-table9', 'clue-velvet-ring'],
    };
    render(
      <Harness
        initialThreads={[createInitialThread('miles', 'wild')]}
        initialWallet={clueWallet}
        role="her"
      />,
    );

    const launchConspiracyBtn = screen.getByRole('button', {
      name: /Table 9 \/ 6:45 Alibi Club Takedown/i,
    });
    fireEvent.click(launchConspiracyBtn);
    expect(screen.getByText(/6:45 Tokyo Portfolio Alibi Club/i)).toBeTruthy();
  });

  it('defaults CubSchoolView to Headmistress mode for her (Candidate for him), gives 12 completely distinct questions per mode, links contextual Amazon fixes, and issues the Certified Housebroken Cub Diploma', async () => {
    const { V35_CUB_SCHOOL_DRILLS, V35_HEADMISTRESS_DRILLS } = await import(
      '../src/data/v35CubSchool'
    );
    expect(V35_HEADMISTRESS_DRILLS).toHaveLength(12);
    expect(V35_CUB_SCHOOL_DRILLS).toHaveLength(12);
    const hmQuestions = new Set(V35_HEADMISTRESS_DRILLS.map((d) => d.punchyQuestion));
    const candQuestions = new Set(V35_CUB_SCHOOL_DRILLS.map((d) => d.punchyQuestion));
    expect(hmQuestions.size).toBe(12);
    expect(candQuestions.size).toBe(12);
    for (const q of hmQuestions) {
      expect(candQuestions.has(q)).toBe(false);
    }

    const { rerender } = render(<CubSchoolView role="her" />);
    expect(screen.getAllByText(/Headmistress Grading Mode/i).length).toBeGreaterThanOrEqual(1);
    const firstHeadmistressQ = screen.getByTestId('cub-school-question').textContent;
    expect(firstHeadmistressQ).toContain('Unless you prefer splitting since you are a VP');

    // Toggle to Candidate tab and confirm the question swaps immediately to the Candidate deck, then toggle back
    fireEvent.click(screen.getByRole('button', { name: /^Candidate$/i }));
    const firstCandidateQ = screen.getByTestId('cub-school-question').textContent;
    expect(firstCandidateQ).not.toBe(firstHeadmistressQ);
    expect(firstCandidateQ).toContain('heads to your bathroom');
    fireEvent.click(screen.getByRole('button', { name: /^Headmistress$/i }));
    expect(screen.getByTestId('cub-school-question').textContent).toBe(firstHeadmistressQ);

    // Contextual Amazon partner fix link opens in _blank via /api/go/ or tagged /dp/
    const fixLink = screen.getByRole('link', { name: /Shop the Fix/i });
    expect(fixLink.getAttribute('target')).toBe('_blank');

    // Step through all 12 drills picking Gold Star answers to earn the Diploma
    for (let i = 0; i < 12; i++) {
      const goldBtn = screen.getByTestId('gold-star-option');
      fireEvent.click(goldBtn);
      const nextBtn = screen.getByRole('button', {
        name: i < 11 ? /Next Scenario/i : /Claim Official Diploma/i,
      });
      fireEvent.click(nextBtn);
    }

    expect(screen.getByText(/Certified Housebroken Cub Diploma/i)).toBeTruthy();

    rerender(<CubSchoolView role="him" />);
    expect(screen.getAllByText(/Cub Candidate Exam/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('cub-school-question').textContent).toBe(firstCandidateQ);
  });
});
