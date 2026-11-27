import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const releaseDir = path.join(rootDir, 'release');
const stageDir = path.join(releaseDir, 'itch-html5-stage');
const zipPath = path.join(releaseDir, 'cougars-and-cubs-club-deluxe-html5.zip');
const listingPath = path.join(releaseDir, 'ITCH_IO_LISTING.md');

if (!fs.existsSync(distDir)) {
  throw new Error('dist/ directory missing, run `npm run build` first.');
}

fs.rmSync(stageDir, { recursive: true, force: true });
fs.mkdirSync(stageDir, { recursive: true });

// Copy core HTML5 SPA assets (index.html, assets/, images/) with relative ./ paths for Itch.io iframe
for (const item of ['index.html', 'assets', 'images']) {
  const src = path.join(distDir, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(stageDir, item), { recursive: true });
  }
}

// Stamp Deluxe HTML5 Edition metadata inside staged index.html
const indexHtmlPath = path.join(stageDir, 'index.html');
let html = fs.readFileSync(indexHtmlPath, 'utf8');
html = html.replace(
  '</head>',
  '  <meta name="x-cougars-edition" content="itch-deluxe-html5" />\n  </head>',
);
fs.writeFileSync(indexHtmlPath, html, 'utf8');

fs.rmSync(zipPath, { force: true });

// Create clean zip archive with index.html at top level (required by Itch.io HTML5 runner)
try {
  execFileSync('zip', ['-r', '-q', zipPath, '.'], { cwd: stageDir });
} catch {
  // Fallback to Python zipfile if `zip` binary isn't installed
  execFileSync(
    'python3',
    [
      '-c',
      `import os, zipfile
stage = ${JSON.stringify(stageDir)}
out = ${JSON.stringify(zipPath)}
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, _, files in os.walk(stage):
        for f in files:
            full = os.path.join(root, f)
            zf.write(full, os.path.relpath(full, stage))`,
    ],
    { cwd: rootDir },
  );
}

fs.rmSync(stageDir, { recursive: true, force: true });

const listingMarkdown = `# Cougars & Cubs Club, Deluxe HTML5 Edition (Itch.io Upload Sheet)

- **Upload File**: \`release/cougars-and-cubs-club-deluxe-html5.zip\`
- **Kind of Project**: \`HTML\` ("This file will be played in the browser")
- **Viewport Dimensions**: \`1120\` × \`760\` px
- **Frame Options**: Check **Mobile friendly**, **Automatically start on page load**, and **Fullscreen button**
- **Genre**: Visual Novel / Simulation / Comedy Romance
- **Tags**: \`dating-sim\`, \`visual-novel\`, \`romance\`, \`comedy\`, \`interactive-fiction\`, \`age-gap\`, \`minigames\`

## Copy-Paste Store Description (Includes DR 91 SEO Backlink)

Lower your age slider, dodge the red flags, and find real chemistry in **Cougars & Cubs Club**, an original animated romantic-comedy dating simulator & etiquette game!

- **54 Distinct Characters (Every Single Year From 30–64 & 21–33)**: Heights, star signs, signature cocktails & zero-proof mocktails, and custom plot twists.
- **78 Animated Scenes & Tactile Arcade Toys**: Swat itemized \$41.63 edamame Venmo requests, escape 7 AM Cheerios roommates, bounce Week-3 "Hobosexual" PS5 bags, pour a *Cougar Town* Big Carl, and melt a cool Black Cat Cougar with patient Golden-Retriever warmth.
- **Playable Voice-Note Waveforms, Lounge Rhodes Soundtrack & Live AI Inbox**: Test your openers live and export 9:16 Vibe Receipts for iMessage, Discord, and TikTok.

👉 **Play the full live cloud edition + multiplayer Crush Auditions at [https://cougarsandcubs.club](https://cougarsandcubs.club)**
`;

fs.writeFileSync(listingPath, listingMarkdown, 'utf8');
const sizeMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);
console.log(`Built Itch.io Deluxe HTML5 bundle: ${zipPath} (${sizeMb} MB)`);
