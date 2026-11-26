import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { V35_CAST_PROFILES } from '../src/data/v35Cast';
import { V35_DISCORD_CHANNELS } from '../src/data/v35ChatsAndDates';

describe('v35 Discord Topic-Exact Replies + Open-Ended AI & Hinge Novel Engagement Hooks', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('gives all 5 Discord channels 3 distinct Her replies and 3 distinct Him replies and answers Living-Apart-Together accurately', async () => {
    for (const ch of V35_DISCORD_CHANNELS) {
      expect(ch.repliesHer).toHaveLength(3);
      expect(ch.repliesHim).toHaveLength(3);
      expect(new Set(ch.repliesHer).size).toBe(3);
      expect(new Set(ch.repliesHim).size).toBe(3);
    }

    render(<App />);

    // Navigate to Chats & Dates -> Club Discord Lounge -> #ask-a-cougar
    const primaryNav = screen.getByRole('navigation', { name: /Primary Club Navigation/i });
    fireEvent.click(within(primaryNav).getByRole('button', { name: /Chats/i }));
    fireEvent.click(screen.getByRole('button', { name: /Club Discord Lounge/i }));
    fireEvent.click(screen.getByRole('button', { name: /#ask-a-cougar/i }));

    // Click Prompt #3 ("Best boundary line when you love Living-Apart-Together and never want to merge houses again?")
    const latBtn = screen.getByRole('button', {
      name: /Best boundary line when you love Living-Apart-Together/i,
    });
    fireEvent.click(latBtn);

    // Must answer about Living-Apart-Together / keeping own house keys—NEVER Prof_Elena's grad-stipend budget reply!
    expect(screen.getByText(/keeping my own house keys forever/i)).toBeInTheDocument();
    expect(screen.queryByText(/Plan thoughtful dates squarely inside your budget/i)).toBeNull();

    // Now test the Open-Ended Discord message bar on moving in together!
    const input = screen.getByLabelText(/Message #ask-a-cougar/i);
    fireEvent.change(input, {
      target: { value: 'Should we move in together after six months or keep our own places?' },
    });
    fireEvent.submit(screen.getByTestId('discord-open-form'));

    await waitFor(() => {
      expect(
        screen.getByText(/Living-Apart-Together is my favorite arrangement/i),
      ).toBeInTheDocument();
      // Second regular (Claire_M&A) also chimes in with a punchy co-sign!
      expect(screen.getByText(/Keep both leases for at least year one/i)).toBeInTheDocument();
    });

    // Test split-bill coherence in #ask-a-cougar (must call out Date #1 split fumble, never call it generous!)
    fireEvent.change(input, {
      target: { value: 'He invited me out and offered to split the bill on Date 1, what do I do?' },
    });
    fireEvent.submit(screen.getByTestId('discord-open-form'));

    await waitFor(() => {
      expect(
        screen.getByText(/pay your half with a warm smile so you owe him nothing/i),
      ).toBeInTheDocument();
    });

    // Bounded scrollable feed + interactive Discord reactions work cleanly
    expect(screen.getByTestId('discord-message-feed')).toBeInTheDocument();
    const reactBtns = screen.getAllByRole('button', { name: /React 🥂/i });
    fireEvent.click(reactBtns[0]);
    expect(reactBtns[0].textContent).toContain('🥂 1');
  });

  it('equips every Hinge profile with Cast Strip jumping, playable Voice Prompt + Bestie subtext, Friday Story Preview, and live AI custom opener replies', async () => {
    for (const p of V35_CAST_PROFILES) {
      expect(p.voicePrompt?.transcript.length).toBeGreaterThan(20);
      expect(p.voicePrompt?.subtextTell.length).toBeGreaterThan(15);
      expect(p.fridayStoryHook?.startsWith('If you match:')).toBe(true);
    }

    render(<App />);

    // 1. Cast Strip shows Tonight's 8 Singles and lets player jump straight to Graham and back to Julian
    const castStrip = screen.getByTestId('hinge-cast-strip');
    expect(within(castStrip).getAllByRole('button')).toHaveLength(8);

    fireEvent.click(screen.getByTestId('cast-jump-graham'));
    expect(screen.getByRole('heading', { name: /^Graham$/i })).toBeInTheDocument();
    expect(screen.getByTestId('hinge-story-hook').textContent).toContain('Table 9');

    fireEvent.click(screen.getByTestId('cast-jump-julian'));
    expect(screen.getByRole('heading', { name: /^Julian$/i })).toBeInTheDocument();

    // 2. Voice Prompt plays & unlocks Bestie subtext tell
    expect(screen.queryByTestId('hinge-voice-subtext')).toBeNull();
    fireEvent.click(screen.getByTestId('hinge-voice-play-btn'));
    expect(screen.getByTestId('hinge-voice-subtext').textContent).toContain('Bestie Read:');

    // 3. Custom open-ended Hinge opener receives a live contextual reply in Match Celebration & Chat
    fireEvent.click(screen.getByRole('button', { name: /Like prompt 1:/i }));
    const noteInput = screen.getByLabelText(/Optional comment for Julian/i);
    fireEvent.change(noteInput, {
      target: { value: 'What do you think about keeping our own apartments long-term?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Send Like \+ Note/i }));

    const celebration = await screen.findByTestId('hinge-match-celebration');
    await waitFor(() => {
      expect(within(celebration).getByTestId('hinge-custom-live-reply').textContent).toMatch(
        /two peaceful sanctuaries|merge leases/i,
      );
    });

    // 4. Open Chat with Julian -> can switch back to Chapter Beats or stay in Adaptive Replies, inspect 1-Cr / 0-Cr EXIF, snooze iMessage ("Not Yet"), and graduate only when ready!
    fireEvent.click(within(celebration).getByRole('button', { name: /Text Julian Now/i }));

    // Switch to Chapter Beat view to advance rapidly through Beats 1-6
    const chapterToggle = screen.queryByRole('button', { name: /Show Chapter Beat/i });
    if (chapterToggle) fireEvent.click(chapterToggle);

    for (let b = 1; b <= 3; b++) {
      fireEvent.click(screen.getAllByTestId('chat-suggestion-btn')[0]);
    }

    // Now on Beat 4: verify 1st Sample Free badge on card, zero price on button, EXIF clue, and +10% Spark reveal at 0 Cr cost!
    const photoCard = screen.getByTestId('chat-photo-drop-card');
    expect(photoCard.textContent).toContain('1st Sample Free');
    const unblurBtn = within(photoCard).getByRole('button', {
      name: /^Unblur Portrait & Secret Note$/i,
    });
    expect(unblurBtn.textContent).not.toContain('Cr');
    fireEvent.click(within(photoCard).getByRole('button', { name: /^Inspect Photo Metadata$/i }));
    expect(screen.getByTestId('photo-exif-clue').textContent).toContain('Live Photo');
    fireEvent.click(unblurBtn);
    expect(photoCard.textContent).toContain('+10% Chemistry Spark Unlocked');
    expect(screen.getByRole('button', { name: /\b5 Cr\b/i })).toBeInTheDocument();

    // Finish Beats 4, 5, 6 -> player can click "Not Yet — Keep Bantering on Hinge" AND still have suggestion chips!
    for (let b = 4; b <= 6; b++) {
      fireEvent.click(screen.getAllByTestId('chat-suggestion-btn')[0]);
    }

    const notYetBtn = screen.getByRole('button', { name: /Not Yet, Keep Bantering on Hinge/i });
    fireEvent.click(notYetBtn);
    expect(screen.getAllByTestId('chat-suggestion-btn')).toHaveLength(3);

    // And when ready later, clicking "Move to iMessage" in the header graduates cleanly into fresh iMessage!
    fireEvent.click(screen.getByRole('button', { name: /^Move to iMessage$/i }));
    expect(screen.getByTestId('chat-stage-imessage')).toBeInTheDocument();
    expect(
      screen.queryByText(/What do you think about keeping our own apartments long-term/i),
    ).toBeNull();
    expect(
      screen.getByRole('button', { name: /Earlier Hinge App Messages/i }),
    ).toBeInTheDocument();
  });

  it('enforces zero literal em-dashes across src/ and wires pre-date Persona Name & Signature Vibe gameplay perks', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const walkFiles = (dir: string): string[] => {
      const out: string[] = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...walkFiles(full));
        else if (/\.(ts|tsx|css)$/.test(entry.name)) out.push(full);
      }
      return out;
    };
    const srcDir = path.resolve(process.cwd(), 'src');
    const offending: string[] = [];
    for (const file of walkFiles(srcDir)) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('\u2014')) {
        offending.push(path.relative(srcDir, file));
      }
    }
    expect(offending).toEqual([]);

    // Verify Zero-Nonsense Executive grants +10 bonus Trap XP (35 total instead of 25)
    const {
      createDefaultWallet,
      updatePlayerPersona,
      recordBulletDodged,
      getPersonaVibeSpec,
    } = await import('../src/domain/economy');
    let wallet = createDefaultWallet();
    wallet = updatePlayerPersona(wallet, 'Sophia', 'Zero-Nonsense Executive');
    wallet = recordBulletDodged(wallet, 'connor', 'clue-connor-card');
    expect(wallet.discernmentXp).toBe(35);
    expect(getPersonaVibeSpec('Corner-Booth Connoisseur')?.dateScoreBonus).toBe(8);

    // Verify pre-chat / pre-date 5-Second Club Check-In onboarding card renders when Name & Vibe are unset
    window.localStorage.clear();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Like prompt 1:/i }));
    const noteInput = screen.getByLabelText(/Optional comment for Julian/i);
    fireEvent.change(noteInput, {
      target: { value: 'Love that Sunday slow-roast rule, what are we pouring?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Send Like \+ Note/i }));
    const celebration = await screen.findByTestId('hinge-match-celebration');
    fireEvent.click(within(celebration).getByRole('button', { name: /Text Julian Now/i }));

    const onboardingForm = screen.getByTestId('inline-persona-onboarding');
    expect(onboardingForm).toBeInTheDocument();
    const nameInput = within(onboardingForm).getByLabelText(/Quick first name/i);
    fireEvent.change(nameInput, { target: { value: 'Sophia' } });
    fireEvent.click(
      within(onboardingForm).getByRole('button', { name: /Corner-Booth Connoisseur/i }),
    );
    fireEvent.click(
      within(onboardingForm).getByRole('button', { name: /Save Name & Activate Perk/i }),
    );

    const perkBadge = screen.getByTestId('active-vibe-perk-badge');
    expect(perkBadge.textContent).toContain('Sophia');
    expect(perkBadge.textContent).toContain('+8 Date Score');

    // Verify RomanticDateStage applies +8 score bonus and greets Sophia by name on Scene 1
    const { RomanticDateStage } = await import('../src/components/RomanticDateStage');
    const dateWallet = updatePlayerPersona(
      createDefaultWallet(),
      'Sophia',
      'Corner-Booth Connoisseur',
    );
    const { container } = render(
      <RomanticDateStage
        leadId="julian"
        dateNumber={1}
        role="her"
        wallet={dateWallet}
        onCompleteDate={() => {}}
        onLoseHeart={() => {}}
        onSpendCredits={() => true}
        onUnlockPov={() => true}
        onUnlockEpilogue={() => true}
        onBackToChats={() => {}}
      />,
    );
    expect(container.textContent).toContain('So glad it’s finally you across the table, Sophia');
    expect(container.textContent).toContain('+8 Signature Vibe Bonus applied toward S-Rank');
  });
});
