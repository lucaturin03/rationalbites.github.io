#!/usr/bin/env node
/* ============================================================
   nuovo-post.mjs — create a new post from the command line.
   LOCAL ONLY: it writes files, do not run it in production.

   Usage:
    node scripts/nuovo-post.mjs (asks a few questions and generates the file + updates posts/posts.json)
   ============================================================ */

import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_FOLDER = join(ROOT, 'posts');
const JSON_FILE = join(POSTS_FOLDER, 'posts.json');

const MONTHS = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];

function slugify(text) {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function today() {
  const d = new Date();
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const label = `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  return { iso, label };
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

function postTemplate({ title, subtitle, dateLabel, minutes, tags, prevSlug, prevTitle }) {
  const tagsHtml = tags.map((t) => `          <span class="tag">#${t}</span>`).join('\n');
  const subtitleHtml = subtitle
    ? `\n        <p class="sottotitolo">${escapeHtml(subtitle)}</p>`
    : '';
  const prevNav = prevSlug
    ? `<a href="${prevSlug}.html">← ${escapeHtml(prevTitle)}</a>`
    : '<span></span>';

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(subtitle || title)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(subtitle || title)}">
  <meta property="og:type" content="article">
  <link rel="icon" type="image/svg+xml" href="../img/favicon.svg">
  <link rel="stylesheet" href="../css/style.css">
  <script>try{var t=localStorage.getItem('tema');if(t)document.documentElement.dataset.theme=t;}catch(e){}</script>
</head>
<body>

  <header class="header"></header>

  <main class="contenuto-stretto">
    <article class="articolo">

      <header class="articolo-testata">
        <p class="meta">${dateLabel} · ${minutes} min di lettura ·
${tagsHtml}
        </p>
        <h1>${escapeHtml(title)}</h1>${subtitleHtml}
      </header>

      <p>Scrivi qui il tuo post…</p>

      <div class="ad-slot" data-ad="post-fine"></div>

      <nav class="nav-articoli">
        ${prevNav}
        <a href="../blog.html">Tutti i post →</a>
      </nav>

    </article>
  </main>

  <footer class="footer"></footer>

  <script src="../js/include.js"></script>
  <script src="../js/ads.js"></script>
</body>
</html>
`;
}

async function main() {
  let rl = null;
  const ask = async (question, def = '') => {
    if (!rl) {
      rl = createInterface({ input: stdin, output: stdout });
    }

    const answer = (await rl.question(def ? `${question} [${def}]: ` : `${question}: `)).trim();
    return answer || def;
  };

  const date = today();
  const title = await ask('Titolo del post');
  if (!title) {
    console.error('Serve un titolo.'); process.exit(1);
  }

  const subtitle = await ask('Sottotitolo (invio per saltare)');
  const rawTags = await ask('Tag separati da virgola', 'meta');
  const excerpt = await ask('Estratto (1-2 righe per l\'elenco)');
  const minutes = parseInt(await ask('Minuti di lettura', '3'));
  if (rl) {
    rl.close();
  }

  const dateLabel = date.label;
  const tags = rawTags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
  const slug = slugify(title);

  const htmlFile = join(POSTS_FOLDER, `${slug}.html`);
  if (await exists(htmlFile)) {
    console.error(`Esiste già posts/${slug}.html, cambia titolo o slug.`);
    process.exit(1);
  }

  let posts = [];
  if (await exists(JSON_FILE)) {
    posts = JSON.parse(await readFile(JSON_FILE, 'utf8'));
  }
  posts.sort((a, b) => (a.dataISO < b.dataISO ? 1 : a.dataISO > b.dataISO ? -1 : 0));
  const previous = posts[0];

  const html = postTemplate({
    title, subtitle, dateLabel, minutes, tags,
    prevSlug: previous ? previous.slug : '',
    prevTitle: previous ? previous.titolo : '',
  });
  await writeFile(htmlFile, html, 'utf8');

  posts.unshift({ slug, titolo: title, data: dateLabel, dataISO: date.iso, estratto: excerpt, tag: tags });
  posts.sort((a, b) => (a.dataISO < b.dataISO ? 1 : a.dataISO > b.dataISO ? -1 : 0));
  await writeFile(JSON_FILE, JSON.stringify(posts, null, 2) + '\n', 'utf8');

  console.log(`\nCreato posts/${slug}.html`);
  console.log(`Aggiornato posts/posts.json (${posts.length} post)`);
  console.log('Apri il file, scrivi il contenuto e fai il push.');
  console.log('Ricorda: node scripts/genera-feed.mjs per aggiornare il feed RSS.');
}

main().catch((e) => { console.error(e); process.exit(1); });
