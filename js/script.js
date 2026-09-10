/* ========================================
   EVEREST ELECTRICALS – JavaScript
   ======================================== */
'use strict';

/* ========================================
   PRELOADER
   ======================================== */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) setTimeout(() => preloader.classList.add('hidden'), 1200);
});

/* ========================================
   NAVBAR – Sticky & Active Link
   ======================================== */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const navLinks  = document.querySelectorAll('.nav-link');

let rafPending = false;
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  toggleScrollTop();
  // P1: Throttle the active-link scan with requestAnimationFrame
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => {
      updateActiveNavLink();
      rafPending = false;
    });
  }
});

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // M1: Set exact height so menu is never clipped
  if (isOpen) {
    navMenu.style.setProperty('--menu-h', navMenu.scrollHeight + 'px');
  }
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ========================================
   TOPBAR / NAVBAR DYNAMIC OFFSET FIX
   Measures topbar actual height and keeps
   navbar perfectly below it at all times.
   ======================================== */
const topbarEl = document.getElementById('topbar');

function adjustNavbarTop() {
  const topbarH = topbarEl ? topbarEl.offsetHeight : (window.innerWidth <= 768 ? 56 : 38);
  // Update CSS variable so all calc() references stay in sync
  document.documentElement.style.setProperty('--topbar-h', topbarH + 'px');
  document.documentElement.style.setProperty('--header-h', (topbarH + (navbar ? navbar.offsetHeight : 68)) + 'px');
  // Also set inline style on navbar for immediate effect
  if (navbar) navbar.style.top = topbarH + 'px';
}

adjustNavbarTop();
window.addEventListener('resize', adjustNavbarTop);
document.addEventListener('DOMContentLoaded', adjustNavbarTop);


function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY;
  sections.forEach(section => {
    const top    = section.offsetTop - 130;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(l => l.classList.remove('active'));
      if (link) link.classList.add('active');
    }
  });
}

/* ========================================
   SMOOTH ANCHOR SCROLL (fixed navbar offset)
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    }
  });
});

/* ========================================
   HERO PARTICLES
   ======================================== */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = window.innerWidth < 600 ? 15 : 35;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size     = Math.random() * 4 + 2;
    const x        = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay    = Math.random() * 12;
    // Some particles are orange (accent)
    const color = Math.random() > 0.7 ? '#FF6B00' : '#1B3A6B';
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${x}%; bottom:-10px;
      background:${color};
      animation-duration:${duration}s;
      animation-delay:-${delay}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ========================================
   ANIMATED COUNTER
   ======================================== */
const statNumbers    = document.querySelectorAll('.stat-number');
let   countersStarted = false;

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const step     = target / (duration / 16);
  let current    = 0;
  const timer    = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

// P1: IntersectionObserver for animated counters — fires once when stats enter view
const heroStats = document.querySelector('.hero-stats');
if (heroStats && statNumbers.length) {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(el => animateCounter(el));
        counterObs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  counterObs.observe(heroStats);
}

/* ========================================
   PRODUCT FILTER TABS
   ======================================== */
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards  = document.querySelectorAll('.product-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    let visibleIndex = 0;
    productCards.forEach(card => {
      const matches = filter === 'all' || card.getAttribute('data-category') === filter;
      if (matches) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        const delay = visibleIndex * 60;
        visibleIndex++;
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, delay);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ========================================
   SCROLL REVEAL ANIMATIONS
   ======================================== */
function initRevealElements() {
  const map = [
    { selector: '.about-image-col',      cls: 'reveal-left'  },
    { selector: '.about-content-col',    cls: 'reveal-right' },
    { selector: '.product-card',         cls: 'reveal'       },
    { selector: '.repair-card',          cls: 'reveal'       },
    { selector: '.why-card',             cls: 'reveal'       },
    { selector: '.service-card',         cls: 'reveal'       },
    { selector: '.gallery-item',         cls: 'reveal'       },
    { selector: '.contact-info-col',     cls: 'reveal-left'  },
    { selector: '.contact-form-col',     cls: 'reveal-right' },
    { selector: '.section-header',       cls: 'reveal'       },
    { selector: '.feature-item',         cls: 'reveal'       },
    { selector: '.testimonial-card',     cls: 'reveal'       },
    { selector: '.brand-pill',           cls: 'reveal'       },
    { selector: '.repair-cta-banner',    cls: 'reveal'       },
  ];
  map.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
        el.classList.add(cls);
      }
    });
  });

  // Stagger delays
  document.querySelectorAll('.product-card').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 0.08}s`; });
  document.querySelectorAll('.service-card').forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 0.1}s`; });
  document.querySelectorAll('.repair-card').forEach((el, i)  => { el.style.transitionDelay = `${(i % 3) * 0.1}s`; });
  document.querySelectorAll('.gallery-item').forEach((el, i)  => { el.style.transitionDelay = `${i * 0.07}s`; });
  document.querySelectorAll('.why-card').forEach((el, i)      => { el.style.transitionDelay = `${(i % 3) * 0.1}s`; });
  document.querySelectorAll('.testimonial-card').forEach((el, i) => { el.style.transitionDelay = `${i * 0.12}s`; });
  // P1: Single IntersectionObserver replaces per-scroll getBoundingClientRect loop
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target); // fire once only — no redundant checks
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initRevealElements();
});

/* ========================================
   SCROLL TO TOP BUTTON
   ======================================== */
const scrollTopBtn = document.getElementById('scrollTop');
function toggleScrollTop() {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ========================================
   ENQUIRY MODAL (Products)
   ======================================== */
const enquiryModal    = document.getElementById('enquiryModal');
const modalClose      = document.getElementById('modalClose');
const modalProductName = document.getElementById('modalProductName');
const modalIconWrap   = document.getElementById('modalIconWrap');
const modalTitle      = document.getElementById('modalTitle');
const modalDesc       = document.getElementById('modalDesc');

function openEnquiry(productName) {
  modalTitle.textContent     = 'Product Enquiry';
  modalProductName.textContent = productName;
  modalProductName.className   = 'modal-product-name';
  modalIconWrap.className      = 'modal-icon modal-icon--product';
  modalIconWrap.innerHTML      = '<i class="fas fa-comment-dots"></i>';
  modalDesc.textContent        = 'Interested in this product? Contact us directly:';

  const emailLink = document.getElementById('modalEmail');
  if (emailLink) {
    const subject = encodeURIComponent(`Enquiry: ${productName} – Everest Electricals`);
    const body    = encodeURIComponent(`Hello,\n\nI am interested in: ${productName}\n\nPlease share details and pricing.\n\nThank you.`);
    emailLink.href = `mailto:apoorvjainji@gmail.com?subject=${subject}&body=${body}`;
  }

  enquiryModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openRepairEnquiry(serviceName) {
  modalTitle.textContent       = 'Repair Service Enquiry';
  modalProductName.textContent = serviceName;
  modalProductName.className   = 'modal-product-name repair-name';
  modalIconWrap.className      = 'modal-icon modal-icon--repair';
  modalIconWrap.innerHTML      = '<i class="fas fa-tools"></i>';
  modalDesc.textContent        = 'Need this repair service? Reach out to us:';

  const emailLink = document.getElementById('modalEmail');
  if (emailLink) {
    const subject = encodeURIComponent(`Repair Enquiry: ${serviceName} – Everest Electricals`);
    const body    = encodeURIComponent(`Hello,\n\nI need: ${serviceName}\n\nPlease contact me at your earliest.\n\nThank you.`);
    emailLink.href = `mailto:apoorvjainji@gmail.com?subject=${subject}&body=${body}`;
  }

  enquiryModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  enquiryModal.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
enquiryModal.addEventListener('click', e => { if (e.target === enquiryModal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ========================================
   CONTACT FORM VALIDATION
   ======================================== */
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

function showError(inputId, errorId, msg) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (inp) inp.classList.add('error');
  if (err) err.textContent = msg;
}
function clearErrors() {
  ['formName','formPhone','formEmail','formMessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('error');
  });
  ['nameError','phoneError','emailError','messageError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

// Real-time clear on input
['formName','formPhone','formEmail','formMessage'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    el.classList.remove('error');
    const errId = id.replace('form','').toLowerCase() + 'Error';
    const errEl = document.getElementById(errId);
    if (errEl) errEl.textContent = '';
  });
});

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  clearErrors();
  let valid = true;

  const name  = document.getElementById('formName').value.trim();
  const phone = document.getElementById('formPhone').value.trim().replace(/\s/g,'');
  const email = document.getElementById('formEmail').value.trim();
  const msg   = document.getElementById('formMessage').value.trim();

  if (!name || name.length < 2) {
    showError('formName', 'nameError', 'Please enter your full name (min 2 characters).');
    valid = false;
  }
  if (!phone) {
    showError('formPhone', 'phoneError', 'Please enter your phone number.');
    valid = false;
  } else if (!/^[6-9]\d{9}$/.test(phone)) {
    showError('formPhone', 'phoneError', 'Enter a valid 10-digit Indian mobile number.');
    valid = false;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('formEmail', 'emailError', 'Please enter a valid email address.');
    valid = false;
  }
  if (!msg || msg.length < 10) {
    showError('formMessage', 'messageError', 'Please write a message (min 10 characters).');
    valid = false;
  }
  if (!valid) return;

  const submitBtn    = document.getElementById('submitFormBtn');
  const errorBanner  = document.getElementById('formErrorBanner');
  const mailtoLink   = document.getElementById('mailtoFallback');
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled  = true;

  // Build pre-filled mailto link and open user's email client
  const product  = document.getElementById('formProduct') ? document.getElementById('formProduct').value : '';
  const urgency  = document.getElementById('formUrgency') ? document.getElementById('formUrgency').value : '';
  const subject  = encodeURIComponent(`Enquiry from ${name} – Everest Electricals`);
  const mailBody = encodeURIComponent(
    `Name: ${name}\nPhone: ${phone}\nEmail: ${email || 'Not provided'}\nProduct/Service: ${product || 'General Enquiry'}\nUrgency: ${urgency || 'Not specified'}\n\nMessage:\n${msg}`
  );

  window.location.href = `mailto:apoorvjainji@gmail.com?subject=${subject}&body=${mailBody}`;

  // Show success state
  contactForm.reset();
  submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  submitBtn.disabled  = false;
  if (errorBanner) errorBanner.style.display = 'none';
  formSuccess.style.display = 'flex';
  setTimeout(() => { formSuccess.style.display = 'none'; }, 8000);
});

/* ========================================
   FOOTER YEAR
   ======================================== */
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ========================================
   GALLERY ITEM CLICK → TOAST
   ======================================== */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const label = item.querySelector('.gallery-overlay span')?.textContent || 'Photo';
    showToast(`📸 ${label}`);
  });
});

function showToast(message) {
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed; bottom:100px; left:50%; transform:translateX(-50%);
    background:rgba(10,31,68,0.95); color:#fff;
    padding:12px 24px; border-radius:50px;
    font-size:0.9rem; font-weight:600;
    box-shadow:0 8px 24px rgba(0,0,0,0.3);
    z-index:3000; white-space:nowrap;
    border:1px solid rgba(255,215,0,0.25);
    animation:slide-up-toast 0.3s ease;
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ========================================
   WHATSAPP FLOAT – Delayed show
   ======================================== */
const waFloat = document.getElementById('whatsappFloat');
if (waFloat) {
  waFloat.style.cssText += 'opacity:0;transform:scale(0.5);transition:all 0.5s cubic-bezier(0.34,1.56,0.64,1);';
  setTimeout(() => { waFloat.style.opacity = '1'; waFloat.style.transform = 'scale(1)'; }, 3000);
}

/* [data-wa-product] listener removed — no elements use this attribute in HTML */

/* ========================================
   SERVICE CARD RIPPLE
   ======================================== */
document.querySelectorAll('.service-card, .why-card').forEach(card => {
  card.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const color  = this.classList.contains('service-card--repair') ? 'rgba(255,76,41,0.2)' : 'rgba(255,215,0,0.2)';
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:10px; height:10px;
      background:${color};
      transform:scale(0);
      animation:ripple-grow 0.6s linear;
      left:${e.offsetX-5}px; top:${e.offsetY-5}px;
      pointer-events:none;
    `;
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});



/* ========================================
   FAN ICON – Spin on hover
   ======================================== */
const fanIcon = document.querySelector('.product-img--fan i');
if (fanIcon) {
  const fanStyle = document.createElement('style');
  fanStyle.textContent = `@keyframes spin-fan{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;
  document.head.appendChild(fanStyle);
  fanIcon.parentElement.addEventListener('mouseenter', () => { fanIcon.style.animation = 'spin-fan 1s linear infinite'; });
  fanIcon.parentElement.addEventListener('mouseleave', () => { fanIcon.style.animation = ''; });
}

/* ========================================
   REPAIR CARD PULSING GLOW (on featured)
   ======================================== */
const featureRepairCard = document.querySelector('.repair-card--featured');
if (featureRepairCard) {
  const glowStyle = document.createElement('style');
  glowStyle.textContent = `
    @keyframes repair-glow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255,76,41,0); }
      50% { box-shadow: 0 0 0 8px rgba(255,76,41,0.08); }
    }
    .repair-card--featured { animation: repair-glow 3s ease infinite; }
  `;
  document.head.appendChild(glowStyle);
}

/* ========================================
   AUTO-SELECT REPAIR IN FORM (from modal)
   ======================================== */
/* Auto-fill contact form — called when user wants to pre-fill a service/product.
   Usage: prefillForm('Fan Repair & Servicing', true) */
window.prefillForm = function (value, urgency) {
  const sel = document.getElementById('formProduct');
  if (sel) {
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === value) { sel.selectedIndex = i; break; }
    }
  }
  if (urgency) {
    const urg = document.getElementById('formUrgency');
    if (urg) {
      for (let i = 0; i < urg.options.length; i++) {
        if (urg.options[i].value.includes('Today')) { urg.selectedIndex = i; break; }
      }
    }
  }
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
};

console.log('%c⚡ Everest Electricals – Website Loaded!', 'color:#F59E0B;font-size:16px;font-weight:bold;background:#0C2340;padding:8px 16px;border-radius:6px;');

/* ========================================
   NEWSLETTER FORM — mailto fallback (no backend configured)
   ======================================== */
const newsletterForm    = document.getElementById('newsletterForm');
const newsletterSuccess = document.getElementById('newsletterSuccess');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('⚠️ Please enter a valid email address.');
      return;
    }
    // Open pre-filled email to subscribe
    const subject = encodeURIComponent('Trade Deals Subscription – Everest Electricals');
    const body    = encodeURIComponent(`Please add me to your trade deals mailing list.\n\nEmail: ${email}`);
    window.location.href = `mailto:apoorvjainji@gmail.com?subject=${subject}&body=${body}`;
    newsletterForm.style.display = 'none';
    if (newsletterSuccess) newsletterSuccess.style.display = 'flex';
  });
}



/* ========================================
   B1: Navigation Product Search
   ======================================== */
const navSearchInput = document.getElementById('navSearchInput');
const navSearchBtn   = document.getElementById('navSearchBtn');

function runProductSearch() {
  const query = navSearchInput ? navSearchInput.value.trim().toLowerCase() : '';
  if (!query) return;

  // Scroll to products section first
  const productsSection = document.getElementById('products');
  if (productsSection) {
    const navH = navbar ? navbar.offsetHeight : 72;
    window.scrollTo({ top: productsSection.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  }

  // Activate 'All Products' filter
  const allFilter = document.querySelector('.filter-btn[data-filter="all"]');
  if (allFilter) {
    document.querySelectorAll('.filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    allFilter.classList.add('active'); allFilter.setAttribute('aria-selected','true');
  }

  let matches = 0;
  document.querySelectorAll('.product-card').forEach(card => {
    const name = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('.product-desc')?.textContent.toLowerCase() || '';
    const brand = card.querySelector('.product-brand')?.textContent.toLowerCase() || '';
    const hit  = name.includes(query) || desc.includes(query) || brand.includes(query);
    card.classList.toggle('hidden', !hit);
    if (hit) matches++;
  });

  if (matches === 0) {
    showToast(`🔍 No products found for “${navSearchInput.value.trim()}”`);
    // Reset to show all after 3 seconds
    setTimeout(() => {
      document.querySelectorAll('.product-card').forEach(c => c.classList.remove('hidden'));
    }, 3000);
  } else {
    showToast(`✅ ${matches} product${matches > 1 ? 's' : ''} found for “${navSearchInput.value.trim()}”`);
  }
}

if (navSearchBtn) navSearchBtn.addEventListener('click', runProductSearch);
if (navSearchInput) {
  navSearchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') runProductSearch();
  });
  // Reset product list when search is cleared
  navSearchInput.addEventListener('input', () => {
    if (navSearchInput.value.trim() === '') {
      document.querySelectorAll('.product-card').forEach(c => c.classList.remove('hidden'));
    }
  });
}

/* FIX 3 – Apply .scrolled class on initial page load if already scrolled */
if (navbar && window.scrollY > 60) {
  navbar.classList.add('scrolled');
}

