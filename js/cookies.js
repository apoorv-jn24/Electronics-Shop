/* ==========================================================================
   EVEREST ELECTRICALS - COOKIE & PREFERENCE MANAGER (js/cookies.js)
   Synced with cookies.json key: 'ee_cookie_consent'
   ========================================================================== */

(function () {
  const CONSENT_STORAGE_KEY = 'ee_cookie_consent';
  const CONSENT_EXPIRY_DAYS = 180;

  function getStoredConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!raw) return null;

      const data = JSON.parse(raw);
      if (!data || !data.timestamp) return null;

      const expiryMs = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (Date.now() - data.timestamp > expiryMs) {
        localStorage.removeItem(CONSENT_STORAGE_KEY);
        return null;
      }
      return data.status;
    } catch (err) {
      return null;
    }
  }

  function saveConsent(status) {
    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ status, timestamp: Date.now() })
      );
    } catch (err) {}
  }

  function hideBanner(banner) {
    if (!banner) return;
    banner.classList.remove('cookie-banner--visible');
    setTimeout(() => banner.setAttribute('hidden', ''), 360);
  }

  function showBanner(banner) {
    if (!banner) return;
    banner.removeAttribute('hidden');
    void banner.offsetWidth;
    banner.classList.add('cookie-banner--visible');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');

    if (!banner) return;

    if (!getStoredConsent()) {
      setTimeout(() => showBanner(banner), 1200);
    }

    acceptBtn?.addEventListener('click', () => {
      saveConsent('accepted');
      hideBanner(banner);
    });

    declineBtn?.addEventListener('click', () => {
      saveConsent('rejected');
      hideBanner(banner);
    });
  });
})();