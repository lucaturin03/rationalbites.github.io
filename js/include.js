/* ============================================================
   INCLUDE.JS — header e footer comuni a tutte le pagine.
   Si modifica QUI una volta sola, cambia ovunque.
   ============================================================ */

(function () {
  // Prefisso per i percorsi relativi: le pagine dentro /posts/
  // devono risalire di un livello.
  const prefix = window.location.pathname.includes('/posts/') ? '../' : '';

  // Nome del file corrente, per evidenziare la voce di menu attiva
  const pagina = window.location.pathname.split('/').pop() || 'index.html';
  const inPost = window.location.pathname.includes('/posts/');

  const voci = [
    { href: 'index.html',    testo: 'Home' },
    { href: 'blog.html',     testo: 'Blog' },
    { href: 'chi-sono.html', testo: 'Chi sono' },
    { href: 'contatti.html', testo: 'Contatti' },
  ];

  const nav = voci.map(v => {
    // Un articolo evidenzia "Blog"
    const attiva = (pagina === v.href) || (inPost && v.href === 'blog.html');
    return `<a href="${prefix}${v.href}"${attiva ? ' class="attiva"' : ''}>${v.testo}</a>`;
  }).join('\n        ');

  const header = `
    <div class="header-inner">
      <a class="logo" href="${prefix}index.html">rationalbites<span class="cursor">_</span></a>
      <nav class="nav">
        ${nav}
      </nav>
    </div>`;

  const footer = `
    <div class="footer-inner">
      <span>© ${new Date().getFullYear()} Luca — rationalbites</span>
      <span><a href="${prefix}contatti.html">Contatti</a> · <a href="https://github.com/tuousername">GitHub</a></span>
    </div>`;

  document.querySelector('header.header').innerHTML = header;
  document.querySelector('footer.footer').innerHTML = footer;
})();
