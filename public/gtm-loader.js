/*!
 * Analytics bootstrap — gtag page_view fires on load so bounce sessions
 * are counted. The GTM container stays deferred until first interaction
 * or a quiet post-load window, keeping the July 2026 LCP path intact.
 */
(function () {
  var gtagLoaded = false;
  var gtmLoaded = false;
  var GTM_ID = 'GTM-TX2WCCLT';
  var GA_ID = 'G-3W6XVBLWXH';

  window.dataLayer = window.dataLayer || [];

  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function loadGtag() {
    if (gtagLoaded) return;
    gtagLoaded = true;

    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(gaScript);

    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function loadGtm() {
    if (gtmLoaded) return;
    gtmLoaded = true;

    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    var gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(gtmScript);
  }

  loadGtag();

  var kicked = false;
  function kick() {
    if (kicked) return;
    kicked = true;
    document.removeEventListener('touchstart', kick, { passive: true });
    document.removeEventListener('scroll', kick, { passive: true });
    document.removeEventListener('mousemove', kick);
    document.removeEventListener('keydown', kick);
    loadGtm();
  }

  function scheduleGtm() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(function () { setTimeout(loadGtm, 30000); }, { timeout: 32000 });
    } else {
      setTimeout(loadGtm, 30000);
    }
  }

  document.addEventListener('touchstart', kick, { passive: true });
  document.addEventListener('scroll', kick, { passive: true });
  document.addEventListener('mousemove', kick);
  document.addEventListener('keydown', kick);

  if (document.readyState === 'complete') {
    scheduleGtm();
  } else {
    window.addEventListener('load', scheduleGtm, { once: true });
  }
})();
