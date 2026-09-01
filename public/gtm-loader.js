/*!
 * Analytics bootstrap — gtag page_view fires on load so bounce sessions
 * count. Heavy GTM stays deferred until first interaction or a short idle
 * so it does not compete with LCP.
 */
(function () {
  var GTM_ID = 'GTM-TX2WCCLT';
  var GA_ID = 'G-3W6XVBLWXH';
  var gtmLoaded = false;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('js', new Date());
  gtag('config', GA_ID);

  var gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(gaScript);

  function loadGtm() {
    if (gtmLoaded) return;
    gtmLoaded = true;
    document.removeEventListener('touchstart', loadGtm, { passive: true });
    document.removeEventListener('scroll', loadGtm, { passive: true });
    document.removeEventListener('mousemove', loadGtm);
    document.removeEventListener('keydown', loadGtm);

    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    var gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(gtmScript);
  }

  function scheduleGtm() {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(function () { loadGtm(); }, { timeout: 3500 });
    } else {
      setTimeout(loadGtm, 3500);
    }
  }

  document.addEventListener('touchstart', loadGtm, { passive: true });
  document.addEventListener('scroll', loadGtm, { passive: true });
  document.addEventListener('mousemove', loadGtm);
  document.addEventListener('keydown', loadGtm);

  if (document.readyState === 'complete') {
    scheduleGtm();
  } else {
    window.addEventListener('load', scheduleGtm, { once: true });
  }
})();
