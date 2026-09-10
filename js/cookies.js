/* ========================================
   COOKIE CONSENT — Everest Electricals
   Stores preference in localStorage (not a cookie itself).
   Gates: Google Maps iframe, Google Places API.
   ======================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'ee_cookie_consent'; // 'accepted' | 'rejected'
  var banner;

  /* ---- Public API ---- */
  window.cookieConsent = {
    accept: accept,
    reject: reject,
    hasConsent: hasConsent
  };

  function hasConsent() {
    return localStorage.getItem(STORAGE_KEY) === 'accepted';
  }

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    hideBanner();
    activateConsentedFeatures();
  }

  function reject() {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    hideBanner();
  }

  function hideBanner() {
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(function () { if (banner) banner.remove(); }, 500);
    }
  }

  /* ---- Activate features that need consent ---- */
  function activateConsentedFeatures() {
    loadConsentedMap();
    loadGooglePlaces();
  }

  /* ---- Map loader (called from inline button too) ---- */
  window.loadConsentedMap = function () {
    var iframe = document.getElementById('shopMapEmbed');
    var placeholder = document.getElementById('mapConsentPlaceholder');
    if (iframe && !iframe.src) {
      var dataSrc = iframe.getAttribute('data-src');
      if (dataSrc) {
        iframe.src = dataSrc;
        iframe.style.display = 'block';
      }
    }
    if (placeholder) placeholder.style.display = 'none';
  };

  /* ---- Google Places / Reviews loader ---- */
  function loadGooglePlaces() {
    // Check if Places API script already injected (it injects itself if key is set)
    // The existing inline Google Reviews script checks for API key;
    // we trigger it here post-consent by dispatching a custom event.
    document.dispatchEvent(new Event('cookieConsented'));
  }

  /* ---- Build and inject the banner DOM ---- */
  function showBanner() {
    banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div class="cookie-icon">🍪</div>' +
      '<div class="cookie-text">' +
        '<strong>We use cookies</strong>' +
        '<p>We embed Google Maps to show our shop location. Google may set cookies ' +
        '(<em>NID, CONSENT, SOCS</em>) when the map loads. No tracking cookies are set ' +
        'by this website itself. ' +
        '<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google\'s Privacy Policy</a>.' +
        '</p>' +
      '</div>' +
      '<div class="cookie-actions">' +
        '<button class="cookie-btn cookie-btn--accept" id="cookieAccept">Accept &amp; Show Map</button>' +
        '<button class="cookie-btn cookie-btn--reject" id="cookieReject">Reject</button>' +
      '</div>';

    document.body.appendChild(banner);

    // Animate in after paint
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('visible');
      });
    });

    document.getElementById('cookieAccept').addEventListener('click', accept);
    document.getElementById('cookieReject').addEventListener('click', reject);
  }

  /* ---- Init ---- */
  function init() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'accepted') {
      // Already accepted — load everything silently
      activateConsentedFeatures();
    } else if (stored === 'rejected') {
      // Already rejected — do nothing, map stays hidden
    } else {
      // First visit — show banner
      showBanner();
    }
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
