/*!
 * Analytics bootstrap — defers GTM + gtag until first user interaction
 * or an idle window (3.5s after load). Reduces main-thread blocking
 * and improves LCP/TBT on cold visits.
 */
(function () {
  var loaded = false;
  var GTM_ID = 'GTM-TX2WCCLT';
  var GA_ID = 'G-3W6XVBLWXH';

  window.dataLayer = window.dataLayer || [];

  function load() {
    if (loaded) return;
    loaded = true;

    // GTM bootstrap event
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    var gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(gtmScript);

    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(gaScript);

    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  var kicked = false;
  function kick() {
    if (kicked) return;
    kicked = true;
    document.removeEventListener('touchstart', kick, { passive: true });
    document.removeEventListener('scroll', kick, { passive: true });
    document.removeEventListener('mousemove', kick);
    document.removeEventListener('keydown', kick);
    load();
  }

  function schedule() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(function () { setTimeout(load, 3500); }, { timeout: 6000 });
    } else {
      setTimeout(load, 4500);
    }
  }

  document.addEventListener('touchstart', kick, { passive: true });
  document.addEventListener('scroll', kick, { passive: true });
  document.addEventListener('mousemove', kick);
  document.addEventListener('keydown', kick);

  if (document.readyState === 'complete') {
    schedule();
  } else {
    window.addEventListener('load', schedule, { once: true });
  }
})();
