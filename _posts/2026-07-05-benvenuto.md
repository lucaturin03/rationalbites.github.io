---
title: "Benvenuto sul blog"
tags: [meta]
---

Questo è il primo post. I post vanno nella cartella `_posts/` con il nome
nel formato `AAAA-MM-GG-titolo.md`. Tutto quello che scrivi qui è Markdown
normale.

<!--more-->

## Blocchi di codice

I blocchi di codice hanno la syntax highlighting automatica:

```python
def saluta(nome):
    print(f"Ciao, {nome}!")

saluta("mondo")
```

## Immagini

Metti le immagini in `assets/img/` e richiamale così:

```markdown
![Descrizione]({{ '/assets/img/foto.jpg' | relative_url }})
```

## Excerpt

Il tag `<!--more-->` che vedi sopra separa l'anteprima (mostrata in home)
dal resto del post. Se non lo metti, Jekyll usa il primo paragrafo.
