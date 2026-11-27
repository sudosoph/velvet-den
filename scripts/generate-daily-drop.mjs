#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const PUBLIC_BASE_URL = (
  process.env.PUBLIC_BASE_URL || 'https://cougarsandcubs.club/'
).replace(/\/?$/, '/');

const monetizationSource = readFileSync(join(ROOT, 'src/config/monetization.ts'), 'utf8');
const affiliatesSource = readFileSync(join(ROOT, 'src/lib/affiliates.ts'), 'utf8');
const configAmazonTag =
  monetizationSource.match(/amazonAssociateTag:\s*'([^']*)'/)?.[1] || '';
const configSubId = monetizationSource.match(/partnerSubId:\s*'([^']*)'/)?.[1] || '';

const AMAZON_TAG = (process.env.AMAZON_ASSOCIATE_TAG ?? configAmazonTag).trim();
const PARTNER_SUB_ID = (process.env.PARTNER_SUB_ID ?? configSubId).trim();
const DISCORD_WEBHOOK_URL = (process.env.DISCORD_WEBHOOK_URL || '').trim();

const CANONICAL_URLS_BY_ID = {};
for (const m of affiliatesSource.matchAll(/\{\s*id:\s*'([^']+)',[\s\S]*?merchantUrl:\s*'([^']+)'/g)) {
  CANONICAL_URLS_BY_ID[m[1]] = m[2];
}

const PROHIBITED_ADULT_DOMAINS = [
  'lovehoney.com',
  'adamandeve.com',
  'pinkcherry.com',
  'bad-dragon.com',
  'lelo.com',
];

const AFFILIATE_URLS = {
  'houseboy-linen-apron': {
    name: 'Japanese Cross-Back Heavyweight Linen Apron (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B093GJW13K',
  },
  'trail-hydration-vest': {
    name: 'Ultralight Ridge-Run Hydration Vest (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B0CS6BG78C',
  },
  'princess-mulberry-silk-robe': {
    name: '22-Momme Mulberry Silk Kimono Lounge Robe (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B08CDKTWDP',
  },
  'hosting-lidded-bin-soap': {
    name: 'Matte-Black Lidded Bathroom Bin + Botanical Hand Wash (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B0C7CWK533',
  },
  'percale-hosting-sheets': {
    name: '600-Thread-Count Cotton Percale Sheet Set (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B0D2W3ZRVQ',
  },
  'date-night-oud-bergamot': {
    name: 'Warm Cedar, Bergamot & Amber Eau de Parfum (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B0987VCM34',
  },
  'espresso-martini-barware': {
    name: 'Weighted Copper Cocktail Shaker & Coupe Glasses (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B091D8N1DF',
  },
  'after-dark-couples-deck': {
    name: 'After-Dark Couples Conversation Card Deck (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B097N3W56F',
  },
  'cooling-bamboo-sheets': {
    name: '100% Organic Bamboo Viscose Cooling Sheet Set (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B0851BPRN9',
  },
  'cast-iron-steak-skillet': {
    name: '12-Inch Pre-Seasoned Cast-Iron Ribeye Skillet (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B00006JSUB',
  },
  'adjustable-dumbbell-bench': {
    name: 'Heavy-Duty Foldable Weight Bench (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B07DNYSJ8W',
  },
  'cub-grooming-beard-skincare-kit': {
    name: 'Sandalwood Beard Oil & Men’s Skincare Kit (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B07CGMT4FB',
  },
  'silk-pillowcase-sleepover-duo': {
    name: '22-Momme Mulberry Silk Pillowcase & Claw-Clip Set (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B0CLXZ5LW7',
  },
  'zero-proof-botanical-mocktail-set': {
    name: 'Zero-Proof Botanical Aperitif & Mocktail Coupe Set (Check Price on Amazon)',
    url: 'https://www.amazon.com/dp/B0C7R39X8G',
  },
};

function decorateAffiliateLink(productId, fallbackUrl, campaign) {
  const rawUrl = CANONICAL_URLS_BY_ID[productId] || fallbackUrl;
  const parsed = new URL(rawUrl);
  const host = parsed.hostname.toLowerCase();
  for (const banned of PROHIBITED_ADULT_DOMAINS) {
    if (host === banned || host.endsWith(`.${banned}`)) {
      throw new Error(`Blocked prohibited adult domain (${host})`);
    }
  }
  if (!AMAZON_TAG && !PARTNER_SUB_ID && productId) {
    return `${PUBLIC_BASE_URL}api/go/${encodeURIComponent(productId)}?src=${encodeURIComponent(`daily_${campaign}`)}`;
  }
  if (AMAZON_TAG && host.includes('amazon.')) {
    parsed.searchParams.set('tag', AMAZON_TAG);
    parsed.searchParams.set('linkCode', 'll2');
  }
  if (PARTNER_SUB_ID) {
    parsed.searchParams.set('subId', PARTNER_SUB_ID);
  }
  parsed.searchParams.set('utm_source', 'cougarsandcubs_daily');
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

const dilemmaUrlObj = new URL(PUBLIC_BASE_URL);
dilemmaUrlObj.searchParams.set('dilemma', entry.dilemmaEpisodeId);
const dilemmaUrl = dilemmaUrlObj.toString();
const productId = AFFILIATE_URLS[entry.affiliateId]
  ? entry.affiliateId
  : 'after-dark-couples-deck';
const product = AFFILIATE_URLS[productId];
const taggedProductUrl = decorateAffiliateLink(productId, product.url, entry.id);

const discordPayload = {
  username: 'Cougars & Cubs Club • Daily Vetting Poll',
  embeds: [
    {
      title: `🐆 Daily Vet or Ghost: ${entry.headline}`,
      description: [
        `**${entry.question}**`,
        '',
        `🧠 *Insider Fact:* ${entry.datingLoreFact}`,
        '',
        `🎮 **[Play This Exact Scenario Free →](${dilemmaUrl})**`,
        `🛍️ **Today’s Club Pick:** [${product.name}](${taggedProductUrl}) *(affiliate disclosure: supports the game at zero extra cost)*`,
      ].join('\n'),
      color: 16007006,
      footer: {
        text: 'React 💚 = Keep • 🚩 = Cut Loose • Share link with your Cougar/Cub!',
      },
    },
  ],
};

const socialPackMd = `# Daily Growth Content Pack (${targetDate.toISOString().slice(0, 10)})

## 1. Cougars & Cubs Club Community / Discord Discussion Poll
**Title:** Vet or Ghost? ${entry.headline}

${entry.question}

> **Insider Lore:** ${entry.datingLoreFact}

- 🎮 **Test your instincts in today’s interactive scene:** ${dilemmaUrl}
- 🛍️ **Featured Concierge Pick:** [${product.name}](${taggedProductUrl}) *(Disclosure: affiliate link, may earn a small commission at no extra cost to you.)*

---

## 2. TikTok / Reels / Shorts 15-Second Script
- **On-Screen Hook (0–3s):** ${entry.tiktokHook}
- **Body Overlay (3–10s):** "${entry.headline}", ${entry.question}
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
