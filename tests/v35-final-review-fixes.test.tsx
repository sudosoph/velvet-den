import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App, { resolveDilemmaRoute } from '../src/App';
import {
  type ActiveMatchThread,
  ChatsAndDatesView,
  createInitialThread,
} from '../src/components/ChatsAndDatesView';
import { SEED_COURTROOM_STORIES } from '../src/components/ClubCourtroomView';
import { DreamDaddyDateStage } from '../src/components/DreamDaddyDateStage';
import { InTheWildMapView } from '../src/components/InTheWildMapView';
import { V35_DATE_SCRIPTS } from '../src/data/v35ChatsAndDates';
import { CLUB_POLAROIDS, getTotalRosterCount, loadDateodex } from '../src/domain/dateodex';
import * as economy from '../src/domain/economy';
import { HER_ARCHETYPES, HIS_ARCHETYPES } from '../src/domain/taxonomy';
import { getAffiliateById } from '../src/lib/affiliates';
import workerApp from '../worker/index';

describe('v35 Whole-Branch Final Review Fixes (Critical #1-#4 & Important #1-#7)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('Critical #1: DreamDaddyDateStage stays on finished summary when unlocking Secret Group-Chat POV Leak or hitting S-Rank lockout on final beat', () => {
    const StatefulDateHarness: React.FC = () => {
      const [wallet, setWallet] = useState<economy.WalletState>(() => ({
        ...economy.createDefaultWallet(),
        credits: 5,
      }));
      const [lockedOut, setLockedOut] = useState(false);

      return (
        <DreamDaddyDateStage
          leadId="soren"
          dateNumber={1}
          role="her"
          wallet={wallet}
          initialSRankLockedOut={lockedOut}
          onCompleteDate={(_id, _num, _rank, nextLocked) => setLockedOut(nextLocked)}
          onLoseHeart={() => {}}
          onSpendCredits={(cost) => {
            const res = economy.spendCredits(wallet, cost);
            if (!res.ok) return false;
            setWallet(res.wallet);
            return true;
          }}
          onUnlockPov={(povId, cost) => {
            const res = economy.unlockContentWithCredits(wallet, 'unlockedPovIds', povId, cost);
            if (!res.ok) return false;
            setWallet(res.wallet);
            return true;
          }}
          onUnlockEpilogue={() => true}
          onBackToChats={() => {}}
        />
      );
    };

    render(<StatefulDateHarness />);
    const sorenDate1 = V35_DATE_SCRIPTS.soren.find((d) => d.dateNumber === 1)!;

    // Step through Beats 1..N, choosing locksOutSRank if present on the final beat (or first choice)
    for (let i = 0; i < sorenDate1.beats.length; i++) {
      const beat = sorenDate1.beats[i];
      const lockChoice = beat.choices.find((c) => c.locksOutSRank) ?? beat.choices[0];
      fireEvent.click(
        screen.getByRole('button', {
          name: new RegExp(lockChoice.label.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        }),
      );
    }

    // Must remain on Date #1 Complete screen even after lockedOut state updated
    expect(screen.getByText(/Date #1 Complete/i)).toBeInTheDocument();

    // Unlock Secret Group-Chat Leak (2 Cr) -> updates wallet.unlockedPovIds -> must NOT reset to Beat 0!
    fireEvent.click(screen.getByRole('button', { name: /Unlock Secret Group-Chat Leak/i }));
    expect(screen.getByText(/Date #1 Complete/i)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(sorenDate1.secretBestiePovLeak.messages[0].slice(0, 22), 'i')),
    ).toBeInTheDocument();
  });

  it('Critical #2: restoreVerifiedVip persists isVip=true across saveWallet and loadWallet reloads', () => {
    const restoreFn = (economy as unknown as { restoreVerifiedVip?: (w: economy.WalletState) => economy.WalletState })
      .restoreVerifiedVip;
    expect(typeof restoreFn).toBe('function');

    const restored = restoreFn!(economy.createDefaultWallet());
    economy.saveWallet(restored);
    const reloaded = economy.loadWallet();
    expect(reloaded.isVip).toBe(true);
  });

  it('Critical #3: F-rank Date Disaster does not increment datesCompleted, offer nonexistent Trap Date #2, or award crowned Dateodex stamp, and Date #4 requires 3 Cr / VIP', () => {
    const grahamThread: ActiveMatchThread = {
      ...createInitialThread('graham', 'wild'),
      stage: 'imessage',
      currentBeat: 6,
      datesCompleted: 0,
    };
    const milesThread: ActiveMatchThread = {
      ...createInitialThread('miles', 'wild'),
      stage: 'imessage',
      currentBeat: 6,
      datesCompleted: 3,
    };
    window.localStorage.setItem(
      'velvet_sim_state_v35',
      JSON.stringify({
        threads: [grahamThread, milesThread],
        cutLooseIds: [],
        completedCameoVenues: [],
      }),
    );
    economy.saveWallet({ ...economy.createDefaultWallet(), credits: 0 });

    render(<App />);
    fireEvent.click(
      screen.getAllByRole('button', { name: /Chats & Dates/i })[0],
    );

    // Launch Graham Date #1 -> walk into Trap Disaster (rank === 'F')
    fireEvent.click(screen.getAllByRole('button', { name: /Date #1/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /Walk into the ambush unprepared/i }));
    fireEvent.click(screen.getByRole('button', { name: /Back to Chats/i }));

    // Must NOT offer nonexistent Date #2 on Graham or crown Graham in Dateodex
    expect(screen.queryByRole('button', { name: /Date #2/i })).toBeNull();
    expect(loadDateodex().stamps.graham).toBeUndefined();

    // Select Miles (datesCompleted: 3, 0 credits) -> launching Date #4 / Epilogue must require 3 Cr and open Boutique!
    fireEvent.click(screen.getByRole('button', { name: /Miles/i }));
    const date4Btn = screen.getAllByRole('button', { name: /Epilogue|Date #4/i })[0];
    fireEvent.click(date4Btn);
    expect(
      screen.getByRole('dialog', { name: /Cougars & Cubs Club VIP/i }),
    ).toBeInTheDocument();
  });

  it('Critical #4: Turn the Tables (1 Cr) choice on Trap Date #1 awards the Table 9 Conspiracy Clue', () => {
    const onRecordConspiracyClue = vi.fn();
    const grahamThread: ActiveMatchThread = {
      ...createInitialThread('graham', 'wild'),
      stage: 'imessage',
      currentBeat: 6,
    };

    render(
      <ChatsAndDatesView
        role="her"
        wallet={{ ...economy.createDefaultWallet(), credits: 3 }}
        threads={[grahamThread]}
        cutLooseIds={[]}
        onUpdateThread={() => {}}
        onSpendCredits={() => true}
        onUnlockBucketItem={() => true}
        onCutLooseTrap={() => {}}
        onConfirmCutGenuine={() => {}}
        onLoseHeart={() => {}}
        onRecordConspiracyClue={onRecordConspiracyClue}
        onOpenHinge={() => {}}
        onOpenBoutique={() => {}}
      />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: /Date #1/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /Turn the Tables/i }));
    expect(onRecordConspiracyClue).toHaveBeenCalledWith('clue-graham-645');
  });

  it('Important #1: Secondary Wild hotspot triggers Chemistry Cameo for matched lead and awards +15 chemistry to the active thread', () => {
    const onCompleteCameo = vi.fn();
    const { unmount } = render(
      <InTheWildMapView
        role="her"
        activeLeadThreads={['miles']}
        completedCameoVenues={[]}
        initialVenueId="velvet-room"
        onUnlockWildLead={vi.fn()}
        onCompleteCameo={onCompleteCameo}
      />,
    );

    // Velvet Room has secondaryCameoLeadId === 'miles' -> should render Cameo and pass 'miles' to onCompleteCameo!
    const claimBtn = screen.getByRole('button', { name: /Claim \+15% Chemistry Cameo/i });
    fireEvent.click(claimBtn);
    expect(onCompleteCameo).toHaveBeenCalledWith('velvet-room', 'miles', 15);
    unmount();

    // Primary venue terminal-b-airport when 'miles' is matched also passes 'miles' (not unmatched speaker 'claire')
    const onCompletePrimary = vi.fn();
    render(
      <InTheWildMapView
        role="her"
        activeLeadThreads={['miles']}
        completedCameoVenues={[]}
        initialVenueId="terminal-b-airport"
        onUnlockWildLead={vi.fn()}
        onCompleteCameo={onCompletePrimary}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Claim \+15% Chemistry Cameo/i }));
    expect(onCompletePrimary).toHaveBeenCalledWith('terminal-b-airport', 'miles', 15);
  });

  it('Important #2: HingeFeedView blocks false Match banner on 0-credit Standout Rose and advances pending match pop-in on subsequent Likes', () => {
    economy.saveWallet({ ...economy.createDefaultWallet(), credits: 0 });
    const { unmount } = render(<App />);

    // Open reply modal on first prompt and attempt Standout Rose with 0 Cr
    fireEvent.click(screen.getByRole('button', { name: /Send a Note or Rose/i }));
    fireEvent.click(screen.getByRole('button', { name: /Send a Standout Rose/i }));

    expect(
      screen.getByRole('dialog', { name: /Cougars & Cubs Club VIP/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/It’s a Match with/i)).toBeNull();
    unmount();

    // Fresh 3-credit run: send low-effort Pending Like on Julian, then 2 attuned Likes on subsequent profiles -> Julian pops in!
    window.localStorage.clear();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Send a Note or Rose/i }));
    const customInput = screen.getByPlaceholderText(/write your own note/i);
    fireEvent.change(customInput, { target: { value: 'hey' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Like/i }));
    expect(screen.getAllByText(/Sent Like • Pending/i).length).toBeGreaterThanOrEqual(1);

    // Like next 2 profiles (without pressing Pass) -> must advance pending counter and trigger Surprise Match Pop-In!
    for (let step = 0; step < 2; step++) {
      fireEvent.click(screen.getByRole('button', { name: /Send a Note or Rose/i }));
      const bestChoice = screen.getAllByTestId('hinge-opener-option')[1];
      fireEvent.click(bestChoice);
    }
    expect(screen.getByText(/Surprise Match Pop-In/i)).toBeInTheDocument();
  });

  it('Important #3: Worker GET /api/courtroom returns all 15 v35 seed stories matching SEED_COURTROOM_STORIES IDs', async () => {
    const res = await workerApp.fetch(new Request('https://cougarsandcubs.club/api/courtroom'), {});
    expect(res.status).toBe(200);
    const data = (await res.json()) as { stories: { id: string }[] };
    expect(data.stories.map((s) => s.id)).toEqual(SEED_COURTROOM_STORIES.map((s) => s.id));
  });

  it('Important #4: resolveDilemmaRoute maps Wild-exclusive cast IDs to their Wild venue, connor-bottle-trap to Hinge, and vip-trader-joes-wild-approach to cougarmarket', () => {
    expect(resolveDilemmaRoute('miles')).toEqual({
      tab: 'wild',
      venueId: 'terminal-b-airport',
      roleOverride: 'her',
    });
    expect(resolveDilemmaRoute('elena')).toEqual({
      tab: 'wild',
      venueId: 'hawthorne-campus',
      roleOverride: 'him',
    });
    expect(resolveDilemmaRoute('connor-bottle-trap')).toEqual({
      tab: 'hinge',
      roleOverride: 'her',
    });
    expect(resolveDilemmaRoute('vip-trader-joes-wild-approach')).toEqual({
      tab: 'wild',
      venueId: 'cougarmarket',
    });
    expect(resolveDilemmaRoute('houseboy-sunday-sanctuary')).toEqual({
      tab: 'wild',
      venueId: 'velvet-palms-bbq',
    });
  });

  it('Important #5: Static SEO guides route picks via /api/go/:id by default and match canonical affiliates.ts ASINs when explicitly tagged', () => {
    const ROOT = process.cwd();
    const cleanEnv = { ...process.env };
    delete cleanEnv.AMAZON_ASSOCIATE_TAG;

    execFileSync('node', ['scripts/generate-seo-pages.mjs'], {
      cwd: ROOT,
      env: cleanEnv,
      stdio: 'pipe',
    });
    const htmlGateway = fs.readFileSync(
      path.join(ROOT, 'dist/guides/cougar-vs-puma-vs-jaguar-dating-age-chart/index.html'),
      'utf8',
    );
    expect(htmlGateway).toContain('/api/go/princess-mulberry-silk-robe');

    execFileSync('node', ['scripts/generate-seo-pages.mjs'], {
      cwd: ROOT,
      env: { ...cleanEnv, AMAZON_ASSOCIATE_TAG: 'cougarsandcub-20' },
      stdio: 'pipe',
    });
    const htmlTagged = fs.readFileSync(
      path.join(ROOT, 'dist/guides/cougar-vs-puma-vs-jaguar-dating-age-chart/index.html'),
      'utf8',
    );
    const canonicalSilkUrl = getAffiliateById('princess-mulberry-silk-robe')!.merchantUrl;
    expect(htmlTagged).toContain(canonicalSilkUrl);
  });

  it('Important #6: Free-typing live AI message in ChatsAndDatesView keeps currentBeat unchanged so scripted story beats are never skipped', async () => {
    let latestThread = createInitialThread('julian', 'hinge', 'Loved your prompt!');
    render(
      <ChatsAndDatesView
        role="her"
        wallet={economy.createDefaultWallet()}
        threads={[latestThread]}
        cutLooseIds={[]}
        onUpdateThread={(u) => {
          latestThread = u;
        }}
        onSpendCredits={() => true}
        onUnlockBucketItem={() => true}
        onCutLooseTrap={() => {}}
        onConfirmCutGenuine={() => {}}
        onLoseHeart={() => {}}
        onOpenHinge={() => {}}
        onOpenBoutique={() => {}}
      />,
    );

    const input = screen.getByPlaceholderText(/Type anything freely to Julian/i);
    fireEvent.change(input, { target: { value: 'Half seven on Friday works if you bring your A-game.' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(latestThread.messages.some((m) => m.text.includes('Half seven on Friday'))).toBe(true);
    });
    expect(latestThread.currentBeat).toBe(1);
  });

  it('Important #7: Every photoUrl in taxonomy.ts exists on disk, archetype IDs contain zero spaces, and Dateodex getTotalRosterCount() equals 22 with v35 Polaroid hints', () => {
    for (const p of [...HER_ARCHETYPES, ...HIS_ARCHETYPES]) {
      expect(/\s/.test(p.id), `Invalid whitespace in ID ${p.id}`).toBe(false);
      const diskPath = path.resolve(process.cwd(), 'public', p.photoUrl.replace(/^\.\//, ''));
      expect(fs.existsSync(diskPath), `Missing taxonomy photo ${diskPath}`).toBe(true);
      for (const g of p.galleryPhotos ?? []) {
        const gPath = path.resolve(process.cwd(), 'public', g.url.replace(/^\.\//, ''));
        expect(fs.existsSync(gPath), `Missing taxonomy gallery photo ${gPath}`).toBe(true);
      }
    }

    expect(getTotalRosterCount()).toBe(22);
    expect(JSON.stringify(CLUB_POLAROIDS)).not.toMatch(/PixiJS|2D Apartment/i);
  });
});
