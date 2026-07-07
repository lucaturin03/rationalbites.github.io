# RationalBites

Un blog personale su **codice, elettronica e domotica** — con qualche divagazione
su un buon bicchiere di vino. Niente tutorial acchiappaclick: solo le cose che ci
piacciono davvero, raccontate come le racconteremmo a un amico.

> L'idea è semplice: quando smontiamo qualcosa per capirla, ne scriviamo. Ogni
> post è un "bite" — un boccone ragionato: un problema concreto, il ragionamento
> dietro la soluzione e il codice per replicarla. Scriviamo di ciò che ci
> appassiona, senza calendario editoriale e senza forzature.

## Struttura

- Pagine statiche in root (`index.html`, `blog.html`, `chi-sono.html`, `contatti.html`)
- Post in `posts/`, indicizzati da `posts/posts.json`
- Header e footer iniettati da `js/include.js` (con toggle tema chiaro/scuro,
  barra di lettura, condivisione e pulsante "torna su")
- Elenco post, ricerca e filtro per tag in `js/lista-post.js`
- Spazi pubblicitari gestiti da `js/ads.js` (vedi sotto)

## Sviluppo in locale

Il sito usa `fetch()` per caricare `posts.json`, quindi va aperto con un server
locale, non con doppio clic sul file:

```
npx http-server .        # oppure: python -m http.server
```

## Nuovo post

```
node scripts/nuovo-post.mjs    # crea il file del post e aggiorna posts.json
node scripts/genera-feed.mjs   # rigenera feed.xml (RSS)
```

## Pubblicità

Gli slot sono `<div class="ad-slot" data-ad="nome"></div>` e li gestisce
`js/ads.js`. Di default mostrano un segnaposto; per attivare Google AdSense:

1. registra il sito su AdSense e ottieni l'ID editore (`ca-pub-…`)
2. in `js/ads.js` imposta `provider: 'adsense'`, `adsenseClient` e la mappa
   `adsenseSlots` (nome slot → ID unità pubblicitaria)
3. in `ads.txt` togli il commento alla riga di Google e inserisci il tuo ID

Per spegnere tutto: `provider: 'off'`.
