/* ============================================================
   ADS.JS — gestione degli spazi pubblicitari.

   Ogni pagina dichiara gli slot con:
     <div class="ad-slot" data-ad="nome-slot"></div>

   Configurazione (oggetto ADS qui sotto):
     provider: 'placeholder' -> mostra un riquadro segnaposto
               'adsense'     -> carica Google AdSense
               'off'         -> nasconde tutti gli slot

   Per passare ad AdSense:
     1. registra il sito su https://adsense.google.com
     2. metti il tuo ID cliente in adsenseClient (es. 'ca-pub-1234…')
     3. crea le unità pubblicitarie e mappa nome-slot -> ID unità
        in adsenseSlots
     4. aggiorna ads.txt nella root con la riga fornita da Google
   ============================================================ */
(function () {
  const ADS = {
    provider: 'placeholder',
    adsenseClient: '',            // es. 'ca-pub-1234567890123456'
    adsenseSlots: {
      // 'home':       '1111111111',
      // 'blog':       '2222222222',
      // 'post-fine':  '3333333333',
    },
  };

  const slots = document.querySelectorAll('[data-ad]');
  if (!slots.length) return;

  if (ADS.provider === 'off') {
    slots.forEach((slot) => { slot.innerHTML = ''; });
    return;
  }

  if (ADS.provider === 'adsense' && ADS.adsenseClient) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADS.adsenseClient;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    slots.forEach((slot) => {
      const unitId = ADS.adsenseSlots[slot.dataset.ad];
      if (!unitId) { slot.innerHTML = ''; return; }
      slot.innerHTML =
        '<p class="ad-etichetta">Pubblicità</p>' +
        '<ins class="adsbygoogle" style="display:block"' +
        ' data-ad-client="' + ADS.adsenseClient + '"' +
        ' data-ad-slot="' + unitId + '"' +
        ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
    return;
  }

  // Segnaposto: rende visibile dove compariranno gli annunci
  slots.forEach((slot) => {
    slot.innerHTML =
      '<p class="ad-etichetta">Pubblicità</p>' +
      '<div class="ad-box">Spazio pubblicitario disponibile<br>' +
      '(slot "' + slot.dataset.ad + '" — configura js/ads.js)</div>';
  });
})();
