#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_BASE = (
  process.env.PUBLIC_BASE_URL || 'https://sudosoph.github.io/velvet-den/'
).replace(/\/?$/, '/');
const AMAZON_TAG = (process.env.AMAZON_ASSOCIATE_TAG || '').trim();

function tagAmazon(rawUrl, slug) {
  const u = new URL(rawUrl);
  if (AMAZON_TAG && u.hostname.includes('amazon.')) {
    u.searchParams.set('tag', AMAZON_TAG);
  }
  u.searchParams.set('utm_source', 'velvetden_seo');
  u.searchParams.set('utm_medium', 'organic_guide');
  u.searchParams.set('utm_campaign', slug);
  return u.toString();
}

const STATIC_GUIDES = [
  {
    slug: 'cougar-vs-puma-vs-jaguar-dating-age-chart',
    title: 'Cougar vs. Puma vs. Jaguar Age Chart: Older Woman Dating Younger Man Guide',
    description:
      'What is the difference between a Puma, Cougar, Jaguar, and Panther in age-gap dating? Learn the real older-woman / younger-man relationship slang, etiquette, and rules.',
    episodeId: 'check-drop',
    paragraphs: [
      'In older-woman / younger-man age-gap dating communities such as r/CougarsAndCubs, relationship labels follow clear community etiquette rather than tabloid clichés.',
      'A Puma refers to a woman in her 30s (under 40) dating a younger man. A Cougar is a woman aged 40 or older with at least a 10-year age gap with her younger male partner (Cub) or younger female partner (Kitten). Women in their 50s embrace Jaguar status, and confident women 60+ claim Panther or Sabertooth.',
      'Above all, remember Rule #1: Cougar never means Sugar Mama, and many high-achieving women secretly love soft-life princess treatment—planned reservations, flowers, and car doors opened—after managing everyone else’s mental load all week.',
    ],
    faqs: [
      {
        q: 'What age qualifies as a Cougar versus a Puma in dating?',
        a: 'In age-gap dating etiquette, a Puma is a woman aged 30–39 dating a younger partner, while a Cougar is a woman aged 40+ who is at least 10 years older than her partner.',
      },
      {
        q: 'What does Cub mean in an older-woman younger-man relationship?',
        a: 'A Cub is an adult younger man (10+ years younger) dating or partnered with a Cougar, Puma, or Jaguar.',
      },
    ],
    picks: [
      {
        name: '22-Momme Mulberry Silk Kimono Robe ($118)',
        url: 'https://www.amazon.com/s?k=100+percent+mulberry+silk+robe+women+22+momme',
      },
      {
        name: 'Weighted Copper Espresso Martini Barware Set ($54)',
        url: 'https://www.amazon.com/s?k=espresso+martini+cocktail+shaker+coupe+glasses+set',
      },
    ],
  },
  {
    slug: 'first-time-hosting-older-woman-apartment-checklist',
    title: 'First Time Hosting an Older Woman at Your Place: The Apartment Audit Checklist',
    description:
      'Inviting an older woman back to your apartment in your 20s? Pass the bathroom and bedroom test: oak bedframe, cotton percale sheets, hand soap, and a lidded trash can.',
    episodeId: 'vip-apartment-soap-audit',
    paragraphs: [
      'When an accomplished woman in her 40s or 50s visits a younger man’s apartment for the first time, square footage rarely matters—hygiene and adult preparation decide everything.',
      'Start with the non-negotiable bathroom checklist: botanical liquid hand soap (never dish soap), two fresh guest hand towels, a spotless mirror, and a bathroom trash can with a closed lid.',
      'In the bedroom, retire dark microfiber dorm sheets for breathable 600-thread-count cotton percale on a real bedframe with four supportive pillows.',
    ],
    faqs: [
      {
        q: 'Do older women care if a younger man lives in a small apartment?',
        a: 'No—financial responsibility, spotless cleanliness, clean cotton sheets, and a lidded bathroom trash can matter far more than luxury square footage.',
      },
    ],
    picks: [
      {
        name: 'Matte-Black Lidded Bathroom Bin + Botanical Hand Soap ($42)',
        url: 'https://www.amazon.com/s?k=matte+black+bathroom+trash+can+with+lid+and+hand+soap+set',
      },
      {
        name: '600-Thread-Count Cotton Percale Hosting Sheet Set ($79)',
        url: 'https://www.amazon.com/s?k=long+staple+cotton+percale+sheet+set+queen+white',
      },
    ],
  },
  {
    slug: 'best-gifts-for-older-woman-girlfriend-dating-guide',
    title: 'Best Gifts for an Older Woman Girlfriend Who Already Has Everything',
    description:
      'Dating a successful woman in her 40s or 50s? Choose thoughtful, romantic date-night and soft-life gifts that prove emotional maturity and observation.',
    episodeId: 'princess-soft-life',
    paragraphs: [
      'When your girlfriend already owns her home and buys her own luxury staples, the best gifts focus on sensory comfort, shared rituals, and taking tasks off her plate.',
      'Top favorites include a 22-momme mulberry silk robe for her evening wind-down, cooking Sunday dinner from scratch in a washed cross-back linen apron, and pairing wine night with an intimacy conversation deck.',
    ],
    faqs: [
      {
        q: 'How can a younger man impress an older woman when she earns more?',
        a: 'Lead with planning, consistency, thoughtful observation, and personal comfort gifts rather than trying to compete on flashy price tags.',
      },
    ],
    picks: [
      {
        name: '22-Momme Mulberry Silk Lounge Robe ($118)',
        url: 'https://www.amazon.com/s?k=100+percent+mulberry+silk+robe+women+22+momme',
      },
      {
        name: 'Japanese Cross-Back Heavyweight Linen Apron ($34)',
        url: 'https://www.amazon.com/s?k=japanese+cross+back+washed+linen+apron+men',
      },
    ],
  },
  {
    slug: 'millennial-vs-gen-z-age-gap-dating-code-switching',
    title: 'Millennial & Gen-X Women Dating Gen-Z Men: The Courting Code-Switch Guide',
    description:
      'Why asking a 45-year-old woman for Snapchat is an instant red flag—and how younger men code-switch texting, emojis, phone calls, and chivalry across generations.',
    episodeId: 'code-switch-texting',
    paragraphs: [
      'Younger men who thrive in age-gap relationships master generational code-switching: keeping Gen-Z emotional literacy and consent awareness while dropping Snapchat requests, skull emojis, and vague "u tryna link" texts.',
      'Calibrate to her cohort: Elder Millennial women (34–45) love a quick text before a phone call plus a calendar dinner invite, while Gen-X women (46–60) prefer a direct 6 PM phone call over all-day work texting.',
    ],
    faqs: [
      {
        q: 'Should you ask an older woman for her Snapchat on a dating app?',
        a: 'Never. Offer your real phone number and propose a clear date, time, and neighborhood spot instead.',
      },
    ],
    picks: [
      {
        name: 'Warm Cedar, Bergamot & Amber Eau de Parfum ($68)',
        url: 'https://www.amazon.com/s?k=bergamot+cedar+amber+eau+de+parfum+men',
      },
      {
        name: 'After-Dark Couples Conversation Card Deck ($26)',
        url: 'https://www.amazon.com/s?k=couples+conversation+cards+date+night+game',
      },
    ],
  },
  {
    slug: 'older-woman-younger-man-relationship-problems-kids-stigma',
    title: 'Older Woman, Younger Man Relationships: Navigating Kids, Waiters & Insecurities',
    description:
      'Real solutions to older-woman / younger-man relationship challenges: fertility and kids mismatches, public stares, mirror doubts, and meeting adult children.',
    episodeId: 'mirror-game-insecurities',
    paragraphs: [
      'Every real age-gap couple eventually faces three classic moments: laughing off a clueless restaurant host, reassuring silent insecurities in bright morning light, and having an honest conversation about kids and timelines.',
      'While she may privately wonder how softer skin compares to 23-year-olds, he is usually wondering if his game is strong enough for an accomplished woman to invite him back.',
    ],
    faqs: [
      {
        q: 'How do older-woman / younger-man couples navigate the kids conversation?',
        a: 'Discuss family and timeline goals transparently in the first few months so both partners choose a shared path with eyes wide open.',
      },
    ],
    picks: [
      {
        name: 'Ultralight Ridge-Run Hydration Vest ($48)',
        url: 'https://www.amazon.com/s?k=ultralight+trail+running+hydration+vest+pack',
      },
      {
        name: 'After-Dark Couples Conversation Card Deck ($26)',
        url: 'https://www.amazon.com/s?k=couples+conversation+cards+date+night+game',
      },
    ],
  },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

for (const g of STATIC_GUIDES) {
  const canonical = `${PUBLIC_BASE}guides/${g.slug}/`;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: g.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(g.title)} | The Velvet Den</title>
  <meta name="description" content="${escapeHtml(g.description)}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${escapeHtml(g.title)}" />
  <meta property="og:description" content="${escapeHtml(g.description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonical}" />
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #0d0814; color: #f1f5f9; line-height: 1.7; }
    main { max-width: 760px; margin: 0 auto; padding: 40px 20px 72px; }
    .badge { display: inline-block; background: #f43f5e; color: #fff; font-weight: 800; font-size: 12px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; text-decoration: none; }
    h1 { font-size: 2.1rem; line-height: 1.18; margin: 16px 0; color: #fff; }
    h2 { color: #2dd4bf; margin-top: 32px; }
    .cta { margin: 28px 0; padding: 22px; border: 3px solid #000; border-radius: 16px; background: linear-gradient(135deg, #2b0f3a, #0b2a30); }
    .btn { display: inline-block; margin-top: 10px; background: #f59e0b; color: #09050f; font-weight: 800; padding: 12px 20px; border-radius: 10px; text-decoration: none; }
    .picks { background: #160c24; border: 2px solid #000; border-radius: 16px; padding: 20px; margin-top: 28px; }
    .pick-link { display: block; margin: 10px 0; color: #fde68a; font-weight: 700; }
    .disclosure { font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <main>
    <a class="badge" href="../../">← Play The Velvet Den: Cougars &amp; Cubs</a>
    <h1>${escapeHtml(g.title)}</h1>
    <p class="disclosure">Editorial Guide for Adult Age-Gap Relationships • Reader disclosure: curated shopping links below may earn a small affiliate commission at no extra cost to you.</p>
    ${g.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n    ')}
    <div class="cta">
      <strong>🎮 Ready to test your instincts in this exact scenario?</strong>
      <p style="margin:6px 0 0;font-size:14px;">Play as Her (Vet &amp; Train) or Play as Him (Impress &amp; Commit)—then text a 60-second Vetting Audition link to your real-life Cougar or Cub.</p>
      <a class="btn" href="../../?dilemma=${encodeURIComponent(g.episodeId)}">Play Interactive Scenario Free →</a>
    </div>
    <section class="picks">
      <h2>Curated Date-Night &amp; Hosting Picks</h2>
      ${g.picks
        .map(
          (p) =>
            `<a class="pick-link" href="${escapeHtml(tagAmazon(p.url, g.slug))}" rel="noopener noreferrer sponsored" target="_blank">🛍️ ${escapeHtml(p.name)} →</a>`,
        )
        .join('\n      ')}
    </section>
    <section>
      <h2>Frequently Asked Questions</h2>
      ${g.faqs
        .map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`)
        .join('\n      ')}
    </section>
  </main>
</body>
</html>
`;

  const dir = join(ROOT, 'dist', 'guides', g.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

console.log(`Generated ${STATIC_GUIDES.length} static SEO guide pages under dist/guides/.`);
