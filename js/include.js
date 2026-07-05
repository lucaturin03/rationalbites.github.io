(function () {
  const prefix = window.location.pathname.includes('/posts/') ? '../' : '';
  const pagina = window.location.pathname.split('/').pop() || 'index.html';
  const inPost = window.location.pathname.includes('/posts/');

  const voci = [
    { href: 'index.html',    testo: 'Home' },
    { href: 'blog.html',     testo: 'Post' },
    { href: 'chi-sono.html', testo: 'Chi siamo' },
    { href: 'contatti.html', testo: 'Contatti' },
  ];

  const nav = voci.map(v => {
    const attiva = (pagina === v.href) || (inPost && v.href === 'blog.html');
    return `<a href="${prefix}${v.href}"${attiva ? ' class="attiva"' : ''}>${v.testo}</a>`;
  }).join('\n        ');

  const header = `
    <div class="header-inner">
      <a class="logo" href="${prefix}index.html">RationalBites<span class="cursor">_</span></a>
      <nav class="nav">
        ${nav}
      </nav>
    </div>`;

  const footer = `
    <div class="footer-inner">
      <span>© ${new Date().getFullYear()} Rationalbites</span>
      <span><a href="${prefix}contatti.html">Contatti</a> · <a href="https://github.com/tuousername">GitHub</a></span>
    </div>`;

  document.querySelector('header.header').innerHTML = header;
  document.querySelector('footer.footer').innerHTML = footer;
})();
