import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  EXPRESSION_MOTION_PRESETS,
  V35_CAST_VISUALS,
  V35_PRODUCT_IMAGES,
  V35_SCENE_BACKDROPS,
} from '../src/data/v35AssetManifest';
import { V35_CAST_PROFILES } from '../src/data/v35Cast';

describe('v35 cast hotness floor, 6-photo uniqueness, scenes & product photography manifest', () => {
  it('ensures all 20 cast members have 6 existing >40KB photos, 10 scene backdrops, and 12 real product photos', () => {
    const entries = Object.values(V35_CAST_VISUALS);
    expect(entries.length).toBeGreaterThanOrEqual(20);

    for (const entry of entries) {
      expect(entry.sixUniquePhotos).toHaveLength(6);
      expect(entry.primaryPortrait).toBe(entry.sixUniquePhotos[0]);
      for (const rel of entry.sixUniquePhotos) {
        const diskPath = path.resolve(process.cwd(), 'public', rel.replace(/^\.\//, ''));
        expect(fs.existsSync(diskPath), `Missing cast photo ${diskPath}`).toBe(true);
        expect(
          fs.statSync(diskPath).size,
          `Low-res stock image ${diskPath}`,
        ).toBeGreaterThan(40_000);
      }
    }

    const sceneEntries = Object.values(V35_SCENE_BACKDROPS);
    expect(sceneEntries.length).toBe(10);
    for (const rel of sceneEntries) {
      const diskPath = path.resolve(process.cwd(), 'public', rel.replace(/^\.\//, ''));
      expect(fs.existsSync(diskPath), `Missing scene ${diskPath}`).toBe(true);
      expect(fs.statSync(diskPath).size).toBeGreaterThan(35_000);
    }

    const productEntries = Object.values(V35_PRODUCT_IMAGES);
    expect(productEntries.length).toBeGreaterThanOrEqual(12);
    for (const rel of productEntries) {
      const diskPath = path.resolve(process.cwd(), 'public', rel.replace(/^\.\//, ''));
      expect(fs.existsSync(diskPath), `Missing product photo ${diskPath}`).toBe(true);
      expect(fs.statSync(diskPath).size).toBeGreaterThan(35_000);
    }

    expect(Object.keys(EXPRESSION_MOTION_PRESETS)).toEqual([
      'neutral',
      'smirk',
      'laugh',
      'blush',
      'icked',
    ]);
  });

  it('enforces 100% globally unique photo URLs across all 6 slides of every character (zero shared filler scenes) and >= 6 blondes', () => {
    const entries = Object.values(V35_CAST_VISUALS);
    const allUrls = entries.flatMap((e) => e.sixUniquePhotos);
    expect(allUrls.length).toBe(entries.length * 6);
    expect(new Set(allUrls).size).toBe(allUrls.length);

    const blondes = entries.filter((c) => c.hairLook.includes('blonde'));
    expect(blondes.length).toBeGreaterThanOrEqual(6);

    for (const purged of [
      'sedona-qigong-46f.jpg',
      'devon-23m.jpg',
      'nadia-41f.jpg',
      'brandon-24m.jpg',
    ]) {
      expect(fs.existsSync(path.resolve(process.cwd(), 'public/images/cast', purged))).toBe(false);
    }
  });

  it('ships real neural MP3 voice notes for all 22 cast profiles with zero robotic browser speechSynthesis or Bestie Read clutter', () => {
    expect(V35_CAST_PROFILES).toHaveLength(22);
    const seenAudioUrls = new Set<string>();

    for (const profile of V35_CAST_PROFILES) {
      expect(profile.voicePrompt, `Missing voicePrompt on ${profile.id}`).toBeDefined();
      const audioUrl = profile.voicePrompt!.audioUrl;
      expect(audioUrl).toBe(`./audio/voices/${profile.id}.mp3`);
      seenAudioUrls.add(audioUrl);

      const diskPath = path.resolve(process.cwd(), 'public', audioUrl.replace(/^\.\//, ''));
      expect(fs.existsSync(diskPath), `Missing voice MP3 ${diskPath}`).toBe(true);
      expect(
        fs.statSync(diskPath).size,
        `Voice MP3 too small ${diskPath}`,
      ).toBeGreaterThan(35_000);
    }

    expect(seenAudioUrls.size).toBe(22);

    const soundTs = fs.readFileSync(path.resolve(process.cwd(), 'src/lib/sound.ts'), 'utf8');
    const feedTsx = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/HingeFeedView.tsx'),
      'utf8',
    );
    expect(soundTs).not.toMatch(/speechSynthesis|SpeechSynthesisUtterance/);
    expect(feedTsx).not.toMatch(/speechSynthesis|Bestie Read|subtextTell|hinge-voice-subtext/);
  });
});
