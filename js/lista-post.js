/* ============================================================
   LISTA-POST.JS — costruisce l'elenco dei post da posts/posts.json
   Usato sia in home (ultimi N) sia in blog.html (paginato).
   Il contenitore in HTML dichiara il comportamento con data-*:
     <div data-lista-post data-limite="3"></div>        -> ultimi 3
     <div data-lista-post data-per-pagina="5"></div>    -> paginato

   In blog.html sono supportati anche:
     - un campo <input data-cerca-post> per la ricerca live
     - il parametro ?tag=nome per filtrare per tag
   Quando ricerca o filtro sono attivi la paginazione è sospesa
   e vengono mostrati tutti i risultati.
   ============================================================ */
(function () {
  const container = document.querySelector('[data-lista-post]');
  if (!container) return;

  const limit   = parseInt(container.dataset.limite, 10) || 0;    // home: solo ultimi N
  const perPage = parseInt(container.dataset.perPagina, 10) || 0; // blog: post per pagina
  const searchInput = document.querySelector('[data-cerca-post]');
  const activeFilterBox = document.querySelector('[data-filtro-attivo]');

  let allPosts = [];
  const params = new URLSearchParams(window.location.search);
  const activeTag = (params.get('tag') || '').toLowerCase();

  // posts.json sta in posts/ e le liste vivono solo nelle pagine di root
  fetch('posts/posts.json', { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) throw new Error('posts.json non raggiungibile (' + response.status + ')');
      return response.json();
    })
    .then((posts) => {
      // più recente in cima
      posts.sort((a, b) => (a.dataISO < b.dataISO ? 1 : a.dataISO > b.dataISO ? -1 : 0));
      allPosts = posts;
      render();
      if (searchInput) searchInput.addEventListener('input', render);
    })
    .catch((error) => {
      container.innerHTML =
        '<p class="estratto">Impossibile caricare l\'elenco dei post.<br>' +
        'In locale apri il sito con un server (vedi README), non con doppio clic sul file.</p>';
      console.error(error);
    });

  function render() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const isFiltering = query !== '' || activeTag !== '';

    let list = allPosts;

    if (activeTag) {
      list = list.filter((p) => (p.tag || []).some((t) => t.toLowerCase() === activeTag));
    }
    if (query) {
      list = list.filter((p) =>
        (p.titolo + ' ' + p.estratto + ' ' + (p.tag || []).join(' ')).toLowerCase().includes(query)
      );
    }

    if (activeFilterBox) {
      activeFilterBox.innerHTML = activeTag
        ? `<a class="filtro-attivo" href="blog.html" title="Rimuovi il filtro">#${activeTag} ×</a>`
        : '';
    }

    let page = 1;
    let totalPages = 1;

    if (limit > 0) {
      list = list.slice(0, limit);
    } else if (perPage > 0 && !isFiltering) {
      totalPages = Math.max(1, Math.ceil(list.length / perPage));
      page = parseInt(params.get('pagina'), 10) || 1;
      page = Math.min(Math.max(1, page), totalPages);
      list = list.slice((page - 1) * perPage, page * perPage);
    }

    container.innerHTML = list.length
      ? list.map(renderRow).join('\n')
      : '<p class="nessun-risultato">Nessun post trovato. Prova con un\'altra ricerca.</p>';

    if (perPage > 0) {
      const paginationNav = document.querySelector('[data-paginazione]');
      if (paginationNav) paginationNav.innerHTML = isFiltering ? '' : renderPagination(page, totalPages);
    }
  }

  function renderRow(post) {
    const tags = (post.tag || [])
      .map((t) => `<a class="tag" href="blog.html?tag=${encodeURIComponent(t)}">#${t}</a>`)
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
