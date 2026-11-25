#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_BASE = (
  process.env.PUBLIC_BASE_URL || 'https://cougarsandcubs.club/'
).replace(/\/?$/, '/');

const GUIDE_SLUGS = [
  'cougar-vs-puma-vs-jaguar-dating-age-chart',
  'first-time-hosting-older-woman-apartment-checklist',
  'best-gifts-for-older-woman-girlfriend-dating-guide',
  'millennial-vs-gen-z-age-gap-dating-code-switching',
  'older-woman-younger-man-relationship-problems-kids-stigma',
];

const DILEMMA_IDS = [
  'check-drop',
  'waiter-son-incident',
  'code-switch-texting',
  'princess-soft-life',
  'trail-run-short-leash',
  'mirror-game-insecurities',
  'houseboy-sunday-sanctuary',
  'fertility-kids-crossroads',
];

const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: PUBLIC_BASE, priority: '1.0', changefreq: 'weekly' },
  ...GUIDE_SLUGS.map((slug) => ({
    loc: `${PUBLIC_BASE}guides/${slug}/`,
    priority: '0.9',
    changefreq: 'monthly',
  })),
  ...DILEMMA_IDS.map((id) => ({
    loc: `${PUBLIC_BASE}?dilemma=${id}`,
    priority: '0.7',
    changefreq: 'monthly',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${PUBLIC_BASE}sitemap.xml
`;

const pubDir = join(ROOT, 'public');
mkdirSync(pubDir, { recursive: true });
writeFileSync(join(pubDir, 'sitemap.xml'), xml);
writeFileSync(join(pubDir, 'robots.txt'), robots);
console.log(`Generated public/sitemap.xml (${urls.length} URLs) and public/robots.txt.`);
