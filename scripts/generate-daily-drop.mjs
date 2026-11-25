#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const PUBLIC_BASE_URL =
  process.env.PUBLIC_BASE_URL || 'https://sudosoph.github.io/velvet-den/';
const AMAZON_TAG = (process.env.AMAZON_ASSOCIATE_TAG || '').trim();
const PARTNER_SUB_ID = (process.env.PARTNER_SUB_ID || '').trim();
const DISCORD_WEBHOOK_URL = (process.env.DISCORD_WEBHOOK_URL || '').trim();

const AFFILIATE_URLS = {
  'houseboy-linen-apron': {
    name: 'Japanese Cross-Back Heavyweight Linen Apron ($34)',
    url: 'https://www.amazon.com/s?k=japanese+cross+back+washed+linen+apron+men',
  },
  'trail-hydration-vest': {
    name: 'Ultralight Ridge-Run Hydration Vest ($48)',
    url: 'https://www.amazon.com/s?k=ultralight+trail+running+hydration+vest+pack',
  },
  'princess-mulberry-silk-robe': {
    name: '22-Momme Mulberry Silk Kimono Lounge Robe ($118)',
    url: 'https://www.amazon.com/s?k=100+percent+mulberry+silk+robe+women+22+momme',
  },
  'hosting-lidded-bin-soap': {
    name: 'Matte-Black Lidded Bathroom Bin + Botanical Hand Wash ($42)',
    url: 'https://www.amazon.com/s?k=matte+black+bathroom+trash+can+with+lid+and+hand+soap+set',
  },
  'percale-hosting-sheets': {
    name: '600-Thread-Count Cotton Percale Sheet Set ($79)',
    url: 'https://www.amazon.com/s?k=long+staple+cotton+percale+sheet+set+queen+white',
  },
  'date-night-oud-bergamot': {
    name: 'Warm Cedar, Bergamot & Amber Eau de Parfum ($68)',
    url: 'https://www.amazon.com/s?k=bergamot+cedar+amber+eau+de+parfum+men',
  },
  'espresso-martini-barware': {
    name: 'Weighted Copper Cocktail Shaker & Coupe Glasses ($54)',
    url: 'https://www.amazon.com/s?k=espresso+martini+cocktail+shaker+coupe+glasses+set',
  },
  'after-dark-couples-deck': {
    name: 'After-Dark Couples Conversation Card Deck ($26)',
    url: 'https://www.amazon.com/s?k=couples+conversation+cards+date+night+game',
  },
};

function decorateAffiliateLink(rawUrl, campaign) {
  const parsed = new URL(rawUrl);
  if (AMAZON_TAG && parsed.hostname.includes('amazon.')) {
    parsed.searchParams.set('tag', AMAZON_TAG);
  }
  if (PARTNER_SUB_ID) {
    parsed.searchParams.set('subId', PARTNER_SUB_ID);
  }
  parsed.searchParams.set('utm_source', 'velvetden_bot');
  parsed.searchParams.set('utm_medium', 'daily_drop');
  parsed.searchParams.set('utm_campaign', campaign);
  return parsed.toString();
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dateArg = args.find((a) => a.startsWith('--date='))?.split('=')[1];
const targetDate = dateArg ? new Date(`${dateArg}T12:00:00Z`) : new Date();

const bank = JSON.parse(readFileSync(join(ROOT, 'src/data/dailyDilemmas.json'), 'utf8'));
const dayIndex = Math.floor(targetDate.getTime() / 86_400_000) % bank.length;
const entry = bank[Math.abs(dayIndex)];

const dilemmaUrl = `${PUBLIC_BASE_URL}?dilemma=${encodeURIComponent(entry.dilemmaEpisodeId)}`;
const product =
  AFFILIATE_URLS[entry.affiliateId] || AFFILIATE_URLS['after-dark-couples-deck'];
const taggedProductUrl = decorateAffiliateLink(product.url, entry.id);

const discordPayload = {
  username: 'The Velvet Den • Daily Vetting Poll',
  embeds: [
    {
      title: `🐆 Daily Vet or Ghost: ${entry.headline}`,
      description: [
        `**${entry.question}**`,
        '',
        `🧠 *Insider Fact:* ${entry.datingLoreFact}`,
        '',
        `🎮 **[Play This Exact Scenario Free →](${dilemmaUrl})**`,
        `🛍️ **Today’s Velvet Concierge Pick:** [${product.name}](${taggedProductUrl}) *(affiliate disclosure: supports the game at zero extra cost)*`,
      ].join('\n'),
      color: 16007006,
      footer: {
        text: 'React 💚 = Train/Keep • 🚩 = Instant Ghost • Share link with your Cougar/Cub!',
      },
    },
  ],
};

const socialPackMd = `# Daily Growth Content Pack (${targetDate.toISOString().slice(0, 10)})

## 1. Owned Brand Subreddit / Discord Discussion Post
**Title:** Vet or Ghost? ${entry.headline}

${entry.question}

> **Insider Lore:** ${entry.datingLoreFact}

- 🎮 **Test your instincts in today’s interactive scene:** ${dilemmaUrl}
- 🛍️ **Featured Concierge Pick:** [${product.name}](${taggedProductUrl}) *(Disclosure: affiliate link—may earn a small commission at no extra cost to you.)*

---

## 2. TikTok / Reels / Shorts 15-Second Script
- **On-Screen Hook (0–3s):** ${entry.tiktokHook}
- **Body Overlay (3–10s):** "${entry.headline}" — ${entry.question}
- **CTA (10–15s):** "Play the Cougar & Cub Vetting Audition in bio & send your score to your crush 👀🐆"

---

## 3. Pinterest Pin Copy (Traffic to Dating & Gift Guides)
- **Pin Title:** ${entry.headline.slice(0, 90)}
- **Destination URL:** ${dilemmaUrl}
`;

const outDir = join(ROOT, 'dist-social');
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, 'daily-drop.json'),
  JSON.stringify({ date: targetDate.toISOString().slice(0, 10), entry, discordPayload }, null, 2),
);
writeFileSync(join(outDir, 'social-pack.md'), socialPackMd);

if (!dryRun && DISCORD_WEBHOOK_URL) {
  const res = await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(discordPayload),
  });
  if (!res.ok) {
    throw new Error(`Discord webhook failed with HTTP ${res.status}`);
  }
  console.log('Posted daily drop to Discord webhook.');
} else {
  console.log(`Generated daily drop (${entry.id}) in dist-social/.`);
}
