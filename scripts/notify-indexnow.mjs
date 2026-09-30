// Pings the IndexNow API (https://www.indexnow.org/) so Bing (and other
// participating engines) fetch this site's sitemap URLs right away instead
// of waiting for their next scheduled crawl. Run manually after deploying
// a change that should get re-indexed quickly:
//   node scripts/notify-indexnow.mjs
// Requires public/<key>.txt (the IndexNow key file) to already be live at
// https://tsonova.com/<key>.txt — deploy before running this.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const host = 'tsonova.com';
const key = '7f41530bb6324c0bd3bdd94ed73ad6d1';
const keyLocation = `https://${host}/${key}.txt`;

const sitemap = readFileSync(path.join(rootDir, 'public', 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

if (urlList.length === 0) {
  console.error('No URLs found in public/sitemap.xml — nothing to submit.');
  process.exit(1);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});

console.log(`IndexNow: submitted ${urlList.length} URL(s), status ${response.status}`);
for (const url of urlList) console.log(`  ${url}`);
if (!response.ok) process.exit(1);
