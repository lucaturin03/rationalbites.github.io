# rationalbites — blog statico per GitHub Pages

Sito 100% HTML + CSS + un file JS per l'header/footer comune. Nessuna build.

## Struttura

```
├── index.html            # home: hero + ultimi post
├── blog.html             # elenco completo dei post
├── chi-sono.html         # pagina about
├── contatti.html         # contatti
├── 404.html              # pagina di errore (GitHub Pages la usa in automatico)
├── css/style.css         # tutto lo stile del sito
├── js/include.js         # header e footer comuni (si modificano solo qui)
├── img/                  # immagini degli articoli
└── posts/                # un file HTML per ogni articolo
```

## Header e footer comuni

Ogni pagina contiene solo due placeholder vuoti:

```html
<header class="header"></header>
...
<footer class="footer"></footer>
<script src="js/include.js"></script>   <!-- ../js/include.js dentro posts/ -->
```

`js/include.js` li riempie al caricamento, evidenzia da solo la voce di menu
attiva e sistema i percorsi relativi per le pagine dentro `posts/`.
Per cambiare menu, logo o footer si modifica solo quel file.

## Pubblicare

1. Crea il repository `tuousername.github.io` su GitHub.
2. Push di tutti i file sul branch `main`.
3. Settings → Pages → Source: **Deploy from a branch → main / (root)**.
4. Il sito è su `https://tuousername.github.io` dopo circa un minuto.

## Aggiungere un post

1. Duplica un file in `posts/`, modifica titolo, meta, data e contenuto.
2. Aggiungi la riga corrispondente in `blog.html` e (se vuoi) in `index.html`.
3. Push.

## Personalizzare

- Colori e font: variabili in cima a `css/style.css` (`:root`).
- Menu, logo, footer: `js/include.js`.
- Link e email: cerca `tuousername` e `tua@email.it`.
