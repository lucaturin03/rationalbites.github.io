# Blog su GitHub Pages (Jekyll)

## Struttura

```
├── _config.yml          # configurazione del sito
├── _layouts/
│   ├── default.html     # layout base (header, nav, footer)
│   └── post.html        # layout dei singoli post
├── _posts/              # i tuoi articoli in Markdown
│   └── 2026-07-05-benvenuto.md
├── assets/css/style.css # stile del sito
├── index.html           # home con lista post
├── archivio.html        # archivio per anno
├── about.md             # pagina "Chi sono"
├── 404.html             # pagina di errore
└── Gemfile              # solo per sviluppo locale
```

## Pubblicare su GitHub

1. Crea un repository su GitHub:
   - `tuousername.github.io` → il sito sarà su `https://tuousername.github.io`
   - qualsiasi altro nome → sarà su `https://tuousername.github.io/nome-repo`
     (in questo caso imposta `baseurl: /nome-repo` in `_config.yml`)
2. Fai il push di questi file sul branch `main`.
3. Su GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
4. Dopo un minuto circa il sito è online. Ogni push successivo lo aggiorna.

## Scrivere un nuovo post

Crea un file in `_posts/` con nome `AAAA-MM-GG-titolo.md`:

```markdown
---
title: "Titolo del post"
tags: [esp32, domotica]
---

Il contenuto in Markdown...
```

Il layout `post` è già impostato di default, non serve specificarlo.

## Anteprima in locale (opzionale)

Serve Ruby installato:

```bash
gem install bundler
bundle install
bundle exec jekyll serve
# → http://localhost:4000
```

## Prima di pubblicare

- In `_config.yml`: aggiorna `title`, `description`, `author`, `url`
- In `about.md`: metti i tuoi link e la tua email
