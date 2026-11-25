import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();

describe('Automated daily growth bot, static dating-intent SEO pages & sitemap', () => {
  it('contains >= 30 unique daily dilemmas and generates Discord + TikTok + owned-sub drops cleanly', () => {
    const rawBank = readFileSync(join(ROOT, 'src/data/dailyDilemmas.json'), 'utf8');
    const bank = JSON.parse(rawBank) as { id: string }[];
    expect(bank.length).toBeGreaterThanOrEqual(30);
    expect(new Set(bank.map((b) => b.id)).size).toBeGreaterThanOrEqual(30);

    execFileSync('node', ['scripts/generate-daily-drop.mjs', '--dry-run', '--date=2026-11-24'], {
      cwd: ROOT,
      stdio: 'pipe',
    });

    const payloadPath = join(ROOT, 'dist-social/daily-drop.json');
    const socialMdPath = join(ROOT, 'dist-social/social-pack.md');
    expect(existsSync(payloadPath)).toBe(true);
    expect(existsSync(socialMdPath)).toBe(true);

    const payload = JSON.parse(readFileSync(payloadPath, 'utf8'));
    expect(payload.discordPayload.embeds[0].description).toContain('?dilemma=');

    const md = readFileSync(socialMdPath, 'utf8');
    expect(md).toContain('TikTok / Reels / Shorts');
    expect(md.toLowerCase()).toContain('affiliate');
  });

  it('generates sitemap.xml and standalone dating-intent static HTML guide pages with FAQPage JSON-LD', () => {
    execFileSync('node', ['scripts/generate-sitemap.mjs'], { cwd: ROOT, stdio: 'pipe' });
    const sitemap = readFileSync(join(ROOT, 'public/sitemap.xml'), 'utf8');
    expect(sitemap).toContain('<urlset');
    expect(sitemap).toContain('/guides/cougar-vs-puma-vs-jaguar-dating-age-chart/');

    execFileSync('node', ['scripts/generate-seo-pages.mjs'], { cwd: ROOT, stdio: 'pipe' });
    const guideHtmlPath = join(
      ROOT,
      'dist/guides/cougar-vs-puma-vs-jaguar-dating-age-chart/index.html',
    );
    expect(existsSync(guideHtmlPath)).toBe(true);

    const html = readFileSync(guideHtmlPath, 'utf8');
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('Older Woman Dating Younger Man Guide');
    // Must not confuse search crawlers with veterinary / pet cat keywords
    expect(html.toLowerCase()).not.toContain('veterinary');
  });
});
