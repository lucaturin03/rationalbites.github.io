# Bit & Bottiglie — blog statico per GitHub Pages

Sito 100% HTML + CSS, nessuna dipendenza, nessun build step.

## Struttura

```
├── index.html            # home: hero + ultimi post
├── blog.html             # elenco completo dei post
├── chi-sono.html         # pagina about
├── contatti.html         # contatti
├── 404.html              # pagina di errore (GitHub Pages la usa in automatico)
├── css/style.css         # tutto lo stile del sito
├── img/                  # immagini degli articoli
└── posts/                # un file HTML per ogni articolo
    ├── benvenuto.html
    ├── wordpress-header-sticky.html
    └── esp32-homekit-condizionatore.html
```

## Pubblicare

1. Crea il repository `tuousername.github.io` su GitHub.
2. Push di tutti i file sul branch `main`.
3. Settings → Pages → Source: **Deploy from a branch → main / (root)**.
4. Il sito è su `https://tuousername.github.io` dopo circa un minuto.

Se usi un repo con un altro nome, il sito sarà su
`https://tuousername.github.io/nome-repo/` — i percorsi relativi
usati nelle pagine funzionano comunque, senza modifiche.

## Aggiungere un post

1. Duplica un file in `posts/` e modifica titolo, meta, data e contenuto.
2. Aggiungi la riga corrispondente in `blog.html` e (se vuoi) in `index.html`.
3. Push.

## Personalizzare

- Colori e font: tutte le variabili sono in cima a `css/style.css` (`:root`).
- Nome del sito: cerca `bit&bottiglie` e sostituisci ovunque.
- Link e email: cerca `tuousername` e `tua@email.it`.

## Nota

Header e footer sono ripetuti in ogni pagina: è il compromesso dell'HTML puro.
Se in futuro i post diventano tanti e la duplicazione pesa, la struttura si
migra a Jekyll (supportato nativamente da GitHub Pages) mantenendo lo stesso CSS.
