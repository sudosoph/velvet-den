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

    // 4. Open Chat with Julian, advance to Beat 4 to verify 1-Cr portrait drop + 0-Cr EXIF clue, then Beat 6 -> Clean Fresh iMessage!
    fireEvent.click(within(celebration).getByRole('button', { name: /Text Julian Now/i }));

    for (let b = 1; b <= 3; b++) {
      fireEvent.click(screen.getAllByTestId('chat-suggestion-btn')[0]);
    }

    // Now on Beat 4: verify 1 Cr cost + Free 0 Cr EXIF inspection!
    const photoCard = screen.getByTestId('chat-photo-drop-card');
    expect(photoCard.textContent).toContain('1 Cr');
    fireEvent.click(within(photoCard).getByRole('button', { name: /Inspect Photo Metadata/i }));
    expect(screen.getByTestId('photo-exif-clue').textContent).toContain('Live Photo');

    // Finish Beats 4, 5, 6 and graduate to Personal iMessage -> old Hinge messages archived cleanly!
    for (let b = 4; b <= 6; b++) {
      fireEvent.click(screen.getAllByTestId('chat-suggestion-btn')[0]);
    }

    fireEvent.click(screen.getByRole('button', { name: /Give Him My Number/i }));
    expect(screen.getByTestId('chat-stage-imessage')).toBeInTheDocument();
    // Old Hinge opener/messages are archived cleanly out of the fresh iMessage feed!
    expect(
      screen.queryByText(/What do you think about keeping our own apartments long-term/i),
    ).toBeNull();
    expect(
      screen.getByRole('button', { name: /Earlier Hinge App Messages/i }),
    ).toBeInTheDocument();
  });
});
