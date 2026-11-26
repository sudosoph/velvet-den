import fs from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  COUGAR_CUB_CHECKLIST_ITEMS,
  CougarCubChecklistModal,
} from '../src/components/CougarCubChecklistModal';
import { FieldGuideModal } from '../src/components/FieldGuideModal';
import { JOURNAL_ARTICLES } from '../src/data/journalArticles';
import { POP_CULTURE_TRIVIA } from '../src/data/popCultureTrivia';
import { V35_CAST_PROFILES } from '../src/data/v35Cast';
import { V35_CHAT_CHAPTERS, V35_DATE_SCRIPTS } from '../src/data/v35ChatsAndDates';

describe('v35 Bespoke 10-Lead Subreddit Scenarios, Fixed Local Field Guide Portraits & Luxury Modals', () => {
  it('gives all 10 Main Romance Leads 100% unique App DM openers and bespoke Date #1, Date #2, and Date #3 scripts', () => {
    const mainLeads = V35_CAST_PROFILES.filter((p) => p.tier === 'main_lead');
    expect(mainLeads).toHaveLength(10);

    const dmBeat1Openers = mainLeads.map(
      (p) => V35_CHAT_CHAPTERS[p.id].tinder[0].incomingMessages[0],
    );
    const date1Dialogues = mainLeads.map((p) => V35_DATE_SCRIPTS[p.id][0].beats[0].dialogue);
    const date2Titles = mainLeads.map((p) => V35_DATE_SCRIPTS[p.id][1].title);
    const date2Dialogues = mainLeads.map((p) => V35_DATE_SCRIPTS[p.id][1].beats[0].dialogue);
    const date3Titles = mainLeads.map((p) => V35_DATE_SCRIPTS[p.id][2].title);
    const date3Dialogues = mainLeads.map((p) => V35_DATE_SCRIPTS[p.id][2].beats[0].dialogue);

    expect(new Set(dmBeat1Openers).size).toBe(10);
    expect(new Set(date1Dialogues).size).toBe(10);
    expect(new Set(date2Titles).size).toBe(10);
    expect(new Set(date2Dialogues).size).toBe(10);
    expect(new Set(date3Titles).size).toBe(10);
    expect(new Set(date3Dialogues).size).toBe(10);
  });

  it('places each iconic subreddit & community scenario intentionally onto its rightful Main Lead without cross-lead duplication', () => {
    const stringifyDates = (id: string) => JSON.stringify(V35_DATE_SCRIPTS[id]).toLowerCase();

    // Miles: Sommelier "Will your son be..." mix-up turned into smooth hand-kiss & comped Champagne
    expect(stringifyDates('miles')).toMatch(/sommelier/);
    expect(stringifyDates('miles')).toMatch(/son/);

    // Soren: Boutique clerk "two Queen beds" mix-up on Date 1 + 62°F & two linen duvets on Date 2
    expect(stringifyDates('soren')).toMatch(/two queen beds/);
    expect(stringifyDates('soren')).toMatch(/62°f/);
    expect(stringifyDates('soren')).toMatch(/duvet/);

    // Julian: Catching himself before "Cubsplaining" 90s culture at the gallery + Sunday morning-light vulnerability
    expect(stringifyDates('julian')).toMatch(/cubsplain/);
    expect(stringifyDates('julian')).toMatch(/risotto|morning light/);

    // Rafael: Corporate black-tie gala +1 whisper test + fixing sticky patio latch unasked
    expect(stringifyDates('rafael')).toMatch(/gala|black-tie/);
    expect(stringifyDates('rafael')).toMatch(/latch/);

    // Marcus: UV-flashlight bouncer ID double-take + meeting his 49-year-old mom Denise (prepped a week ahead)
    expect(stringifyDates('marcus')).toMatch(/bouncer|uv/);
    expect(stringifyDates('marcus')).toMatch(/denise/);

    // Elena: Decoding Gen-X "Sounds good." + thumbs-up punctuation & sparring with faculty rival
    expect(stringifyDates('elena')).toMatch(/sounds good\./);
    expect(stringifyDates('elena')).toMatch(/dean|faculty/);

    // Claire: Smooth check-drop intercept + meeting her 22-year-old college son Leo at brunch + Living-Apart-Together two keys
    expect(stringifyDates('claire')).toMatch(/leo|college/);
    expect(stringifyDates('claire')).toMatch(/stepdad/);
    expect(stringifyDates('claire')).toMatch(/living-apart-together|separate keys|two sets of keys/);

    // Sienna: 6-year Junior Cougar 2009 geometry/license tease + claiming her proudly in front of nephew Sam's crew
    expect(stringifyDates('sienna')).toMatch(/2009|geometry/);
    expect(stringifyDates('sienna')).toMatch(/nephew|sam/);

    // Priya: 7:30 AM off-shift breakfast date + blackout-curtain sleep protection & cutthroat Scrabble
    expect(stringifyDates('priya')).toMatch(/cardamom|shift/);
    expect(stringifyDates('priya')).toMatch(/blackout|scrabble/);

    // Summer: Mineral SPF 50 neck check + clear family/marriage timeline vs stalling late-30s peers
    expect(stringifyDates('summer')).toMatch(/spf 50/);
    expect(stringifyDates('summer')).toMatch(/38|39|stalling|family/);
  });

  it('replaces broken thumb.wikimedia.org URLs in FieldGuideModal with verified local portraits and upgrades FieldGuide + Checklist to editorial luxury styling', () => {
    const fieldGuideSrc = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/FieldGuideModal.tsx'),
      'utf8',
    );
    expect(fieldGuideSrc).not.toContain('thumb.wikimedia.org');
    expect(fieldGuideSrc).not.toContain('vice-panel');
    expect(fieldGuideSrc).not.toContain('#FFBE0B');

    const checklistSrc = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/CougarCubChecklistModal.tsx'),
      'utf8',
    );
    expect(checklistSrc).not.toContain('vice-panel');
    expect(checklistSrc).not.toContain('#FFBE0B');

    // All 17 local Field Guide portrait files exist on disk (> 15 KB each)
    const iconsDir = path.resolve(process.cwd(), 'public/images/icons');
    const iconFiles = fs.readdirSync(iconsDir).filter((f) => f.endsWith('.jpg'));
    expect(iconFiles.length).toBeGreaterThanOrEqual(17);
    for (const file of iconFiles) {
      const stat = fs.statSync(path.join(iconsDir, file));
      expect(stat.size).toBeGreaterThan(15000);
    }

    // Render FieldGuideModal and verify all 39 local ./images/ portraits + editorial-hinge-card
    const { unmount } = render(
      <FieldGuideModal open={true} unlockedStamps={['pop_tina_erwin']} onClose={vi.fn()} />,
    );
    const dialog = screen.getByRole('dialog', { name: /Age-Gap Dating Field Guide/i });
    expect(dialog.innerHTML).toContain('editorial-hinge-card');
    const imgs = Array.from(dialog.querySelectorAll('img'));
    expect(imgs.length).toBeGreaterThanOrEqual(39);
    for (const img of imgs) {
      expect(img.getAttribute('src')).toMatch(/^\.\/images\/(icons|cast|scenes)\/[a-z0-9_-]+\.jpg$/);
    }
    unmount();

    // Render CougarCubChecklistModal and verify all 25 beloved items + 56 Pop Quiz items + 16 Guides remain intact
    expect(COUGAR_CUB_CHECKLIST_ITEMS).toHaveLength(25);
    expect(POP_CULTURE_TRIVIA.length).toBeGreaterThanOrEqual(55);
    expect(JOURNAL_ARTICLES).toHaveLength(16);

    render(
      <CougarCubChecklistModal
        open={true}
        onClose={vi.fn()}
        onClaimChecklistReward={() => false}
        onPlayMatchedScenario={vi.fn()}
      />,
    );
    const checklistDialog = screen.getByRole('dialog', {
      name: /Have You Ever\? 25-Point Cougars & Cubs Experience Test/i,
    });
    expect(checklistDialog.innerHTML).toContain('editorial-hinge-card');
  });
});
