#!/usr/bin/env node
/* ============================================================
   genera-feed.mjs — genera feed.xml (RSS 2.0) da posts/posts.json.
   Da rilanciare dopo ogni nuovo post:
    node scripts/genera-feed.mjs
   ============================================================ */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE_URL = 'https://lucaturin03.github.io/rationalbites.github.io';
const SITE_TITLE = 'RationalBites';
const SITE_DESCRIPTION = 'Note su codice, elettronica, domotica e qualche bicchiere di vino.';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const JSON_FILE = join(ROOT, 'posts', 'posts.json');
const FEED_FILE = join(ROOT, 'feed.xml');

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

const posts = JSON.parse(await readFile(JSON_FILE, 'utf8'));
posts.sort((a, b) => (a.dataISO < b.dataISO ? 1 : a.dataISO > b.dataISO ? -1 : 0));

const items = posts.map((p) => {
  const url = `${SITE_URL}/posts/${p.slug}.html`;
  const pubDate = new Date(`${p.dataISO}T08:00:00Z`).toUTCString();
  const categories = (p.tag || [])
    .map((t) => `      <category>${escapeXml(t)}</category>`)
    .join('\n');
  return `    <item>
      <title>${escapeXml(p.titolo)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(p.estratto)}</description>
${categories}
    </item>`;
}).join('\n');

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>it-it</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

await writeFile(FEED_FILE, feed, 'utf8');
console.log(`Generato feed.xml (${posts.length} post)`);
