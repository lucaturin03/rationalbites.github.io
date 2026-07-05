#!/usr/bin/env node
/* ============================================================
   nuovo-post.mjs — crea un nuovo post da riga di comando.
   SOLO LOCALE: scrive file, non va eseguito in produzione.

   Uso:
    node scripts/nuovo-post.mjs (fa qualche domanda e genera il file + aggiorna posts/posts.json)
   ============================================================ */

import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const POST_FOLDER = join(ROOT, 'posts');
const FILE_JSON = join(POST_FOLDER, 'posts.json');

const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu','lug', 'ago', 'set', 'ott', 'nov', 'dic'];

function slugify(testo) {
  return testo
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function today() {
  const d = new Date();
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const label = `${String(d.getDate()).padStart(2, '0')} ${MESI[d.getMonth()]} ${d.getFullYear()}`;
  return { iso, label };
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

function postTemplate({ titolo, sottotitolo, dataLabel, minuti, tag, precSlug, precTitolo }) {
  const tagHtml = tag.map((t) => `          <span class="tag">#${t}</span>`).join('\n');
  const sottotitoloHtml = sottotitolo
    ? `\n        <p class="sottotitolo">${escapeHtml(sottotitolo)}</p>`
    : '';
  const navPrec = precSlug
    ? `<a href="${precSlug}.html">← ${escapeHtml(precTitolo)}</a>`
    : '<span></span>';

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(titolo)}</title>
  <meta name="description" content="${escapeHtml(sottotitolo || titolo)}">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

  <header class="header"></header>

  <main class="contenuto-stretto">
    <article class="articolo">

      <header class="articolo-testata">
        <p class="meta">${dataLabel} · ${minuti} min di lettura ·
${tagHtml}
        </p>
        <h1>${escapeHtml(titolo)}</h1>${sottotitoloHtml}
      </header>

      <p>Scrivi qui il tuo post…</p>

      <nav class="nav-articoli">
        ${navPrec}
        <a href="../blog.html">Tutti i post →</a>
      </nav>

    </article>
  </main>

  <footer class="footer"></footer>

  <script src="../js/include.js"></script>
</body>
</html>
`;
}

async function main() {
  let rl = null;
  const ask = async (domanda, def = '') => {
    if (!rl) {rl = 
      createInterface({ input: stdin, output: stdout });
    }

    const r = (await rl.question(def ? `${domanda} [${def}]: ` : `${domanda}: `)).trim();
    return r || def;
  };

  const oggi = today();
  const titolo = await ask('Titolo del post');
  if (!titolo) { 
    console.error('Serve un titolo.'); process.exit(1); 
  }

  const sottotitolo = await ask('Sottotitolo (invio per saltare)');
  const tagRaw = await ask('Tag separati da virgola', 'meta');
  const estratto = await ask('Estratto (1-2 righe per l\'elenco)');
  const minuti = parseInt(await ask('Minuti di lettura', '3'));
  if (rl) {
    rl.close();
  }

  const dataLabel = oggi.label;
  const tag = tagRaw.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
  const slug = slugify(titolo);

  const fileHtml = join(POST_FOLDER, `${slug}.html`);
  if (await exists(fileHtml)) {
    console.error(`Esiste già posts/${slug}.html, cambia titolo o slug.`);
    process.exit(1);
  }

  let posts = [];
  if (await exists(FILE_JSON)) {
    posts = JSON.parse(await readFile(FILE_JSON, 'utf8'));
  }
  posts.sort((a, b) => (a.dataISO < b.dataISO ? 1 : a.dataISO > b.dataISO ? -1 : 0));
  const previous = posts[0];

  const html = postTemplate({
    titolo, sottotitolo, dataLabel, minuti, tag,
    precSlug: previous ? previous.slug : '',
    precTitolo: previous ? previous.titolo : '',
  });
  await writeFile(fileHtml, html, 'utf8');

  posts.unshift({ slug, titolo, data: dataLabel, dataISO, estratto, tag });
  posts.sort((a, b) => (a.dataISO < b.dataISO ? 1 : a.dataISO > b.dataISO ? -1 : 0));
  await writeFile(FILE_JSON, JSON.stringify(posts, null, 2) + '\n', 'utf8');

  console.log(`\nCreato  posts/${slug}.html`);
  console.log(`Aggiornato  posts/posts.json (${posts.length} post)`);
  console.log('\nApri il file, scrivi il contenuto e fai il push. Home e blog si aggiornano da soli.');
}

main().catch((e) => { console.error(e); process.exit(1); });
