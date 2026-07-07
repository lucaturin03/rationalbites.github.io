/* ============================================================
   INCLUDE.JS — header, footer e piccoli componenti condivisi:
   - toggle tema chiaro/scuro (salvato in localStorage)
   - barra di avanzamento lettura negli articoli
   - riga "condividi" in fondo agli articoli
   - pulsante "torna su"
   ============================================================ */
(function () {
  const prefix = window.location.pathname.includes('/posts/') ? '../' : '';
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isPostPage = window.location.pathname.includes('/posts/');

  /* ---------- Header e navigazione ---------- */
  const navItems = [
    { href: 'index.html',    label: 'Home' },
    { href: 'blog.html',     label: 'Post' },
    { href: 'chi-sono.html', label: 'Chi siamo' },
    { href: 'contatti.html', label: 'Contatti' },
  ];

  const navHtml = navItems.map((item) => {
    const isActive = (currentPage === item.href) || (isPostPage && item.href === 'blog.html');
    return `<a href="${prefix}${item.href}"${isActive ? ' class="attiva"' : ''}>${item.label}</a>`;
  }).join('\n        ');

  const headerHtml = `
    <div class="header-inner">
      <a class="logo" href="${prefix}index.html">RationalBites<span class="cursor">_</span></a>
      <nav class="nav">
        ${navHtml}
        <button class="tema-toggle" type="button" aria-label="Cambia tema chiaro/scuro" title="Tema chiaro/scuro"></button>
      </nav>
    </div>`;

  const footerHtml = `
    <div class="footer-inner">
      <span>© ${new Date().getFullYear()} RationalBites — bocconi ragionati di codice ed elettronica</span>
      <span>
        <a href="${prefix}contatti.html">Contatti</a> ·
        <a href="https://github.com/lucaturin03">GitHub</a> ·
        <a href="${prefix}feed.xml">RSS</a>
      </span>
    </div>`;

  document.querySelector('header.header').innerHTML = headerHtml;
  document.querySelector('footer.footer').innerHTML = footerHtml;

  /* ---------- Toggle tema ---------- */
  const root = document.documentElement;
  const themeToggle = document.querySelector('.tema-toggle');

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateToggleIcon() {
    themeToggle.textContent = currentTheme() === 'dark' ? '☀' : '☾';
  }

  themeToggle.addEventListener('click', () => {
    const nextTheme = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    localStorage.setItem('tema', nextTheme);
    updateToggleIcon();
  });
  updateToggleIcon();

  /* ---------- Barra di lettura + condividi (solo articoli) ---------- */
  const article = document.querySelector('.articolo');
  if (article && isPostPage) {
    const progressBar = document.createElement('div');
    progressBar.className = 'barra-lettura';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressBar.style.width = percent + '%';
    }, { passive: true });

    const encodedTitle = encodeURIComponent(document.title);
    const encodedUrl = encodeURIComponent(window.location.href);
    const shareBox = document.createElement('div');
    shareBox.className = 'condividi';
    shareBox.innerHTML = `
      <span>Condividi:</span>
      <a href="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}" target="_blank" rel="noopener">X / Twitter</a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="https://wa.me/?text=${encodedTitle}%20${encodedUrl}" target="_blank" rel="noopener">WhatsApp</a>
      <button type="button" data-copia-link>Copia link</button>`;

    const postNav = article.querySelector('.nav-articoli');
    if (postNav) {
      article.insertBefore(shareBox, postNav);
    } else {
      article.appendChild(shareBox);
    }

    shareBox.querySelector('[data-copia-link]').addEventListener('click', (e) => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        e.target.textContent = 'Copiato ✓';
        setTimeout(() => { e.target.textContent = 'Copia link'; }, 2000);
      });
    });
  }

  /* ---------- Torna su ---------- */
  const backToTop = document.createElement('button');
  backToTop.className = 'torna-su';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Torna all\'inizio della pagina');
  backToTop.textContent = '↑';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visibile', window.scrollY > 600);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
