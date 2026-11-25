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
  'celebrity-cougars-and-cubs-pop-culture-guide',
  'dating-younger-man-perimenopause-menopause-intimacy',
  'junior-cougar-6-year-age-gap-relationship-guide',
  'first-time-hosting-older-woman-apartment-checklist',
  'best-gifts-for-older-woman-girlfriend-dating-guide',
  'millennial-vs-gen-z-age-gap-dating-code-switching',
  'older-woman-younger-man-relationship-problems-kids-stigma',
  'older-woman-grown-son-same-age-meeting-parents-guide',
  'spontaneous-weekend-getaway-date-ideas-older-woman-younger-man',
  'cougar-town-pop-culture-age-gap-dating-history',
  'astrology-zodiac-compatibility-older-woman-younger-man',
  'movies-like-babygirl-idea-of-you-bridget-jones-older-woman-younger-man',
  'how-to-meet-older-women-in-the-wild-hotel-bar-gym-etiquette',
  'black-cat-older-woman-golden-retriever-younger-man-dating-guide',
];

const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: PUBLIC_BASE, priority: '1.0', changefreq: 'daily' },
  ...GUIDE_SLUGS.map((slug) => ({
    loc: `${PUBLIC_BASE}guides/${slug}/`,
    priority: '0.9',
    changefreq: 'weekly',
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
console.log(`Generated public/sitemap.xml (${urls.length} canonical URLs) and public/robots.txt.`);
