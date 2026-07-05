/* ============================================================
   LISTA-POST.JS — costruisce l'elenco dei post da posts/posts.json
   Usato sia in home (ultimi N) sia in blog.html (paginato).
   Il contenitore in HTML dichiara il comportamento con data-*:
     <div data-lista-post data-limite="3"></div>        -> ultimi 3
     <div data-lista-post data-per-pagina="5"></div>     -> paginato
   ============================================================ */
(function () {
  const container = document.querySelector('[data-lista-post]');
  if (!container) return;

  const limit   = parseInt(container.dataset.limite, 10) || 0;    // home: solo ultimi N
  const perPage = parseInt(container.dataset.perPagina, 10) || 0; // blog: post per pagina

  // posts.json sta in posts/ e le liste vivono solo nelle pagine di root
  fetch('posts/posts.json', { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) throw new Error('posts.json non raggiungibile (' + response.status + ')');
      return response.json();
    })
    .then((posts) => render(posts))
    .catch((error) => {
      container.innerHTML =
        '<p class="estratto">Impossibile caricare l\'elenco dei post.<br>' +
        'In locale apri il sito con un server (vedi README), non con doppio clic sul file.</p>';
      console.error(error);
    });

  function render(posts) {
    // più recente in cima
    posts.sort((a, b) => (a.dataISO < b.dataISO ? 1 : a.dataISO > b.dataISO ? -1 : 0));

    let list = posts;
    let page = 1;
    let totalPages = 1;

    if (limit > 0) {
      list = posts.slice(0, limit);
    } else if (perPage > 0) {
      totalPages = Math.max(1, Math.ceil(posts.length / perPage));
      const params = new URLSearchParams(window.location.search);
      page = parseInt(params.get('pagina'), 10) || 1;
      page = Math.min(Math.max(1, page), totalPages);
      list = posts.slice((page - 1) * perPage, page * perPage);
    }

    container.innerHTML = list.map(renderRow).join('\n');

    if (perPage > 0) {
      const nav = document.querySelector('[data-paginazione]');
      if (nav) nav.innerHTML = renderPagination(page, totalPages);
    }
  }

  function renderRow(post) {
    const tags = (post.tag || [])
      .map((t) => `<a class="tag" href="blog.html">#${t}</a>`)
      .join('\n        ');
    return `    <article class="riga-post">
      <span class="data">${post.data}</span>
      <div>
        <h2><a href="posts/${post.slug}.html">${post.titolo}</a></h2>
        <p class="estratto">${post.estratto}</p>
        ${tags}
      </div>
    </article>`;
  }

  function renderPagination(page, totalPages) {
    if (totalPages <= 1) return '';
    const prev = page > 1
      ? `<a href="?pagina=${page - 1}">← Più recenti</a>`
      : '<span></span>';
    const next = page < totalPages
      ? `<a href="?pagina=${page + 1}">Più vecchi →</a>`
      : '<span></span>';
    return `${prev}
      <span class="pagina-corrente">Pagina ${page} di ${totalPages}</span>
      ${next}`;
  }
})();
