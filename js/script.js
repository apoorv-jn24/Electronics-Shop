/* ========================================
   JAIN ELECTRICALS – JavaScript
   ======================================== */

'use strict';

/* ========================================
   PRELOADER
   ======================================== */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 1200);
});

/* ========================================
   NAVBAR – Scroll & Active Link
   ======================================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
  toggleScrollTop();
  triggerRevealAnimations();
});

// Hamburger Toggle
hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Close menu on nav link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Active nav link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      if (navLink) navLink.classList.add('active');
    }
  });
}

/* ========================================
   HERO PARTICLES
   ======================================== */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = window.innerWidth < 600 ? 15 : 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      bottom: -10px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;

    container.appendChild(p);
  }
}
createParticles();

/* ========================================
   ANIMATED COUNTER (HERO STATS)
   ======================================== */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

// Trigger counters when hero stats come into view
const statNumbers = document.querySelectorAll('.stat-number');
let countersStarted = false;

function checkCounters() {
  if (countersStarted) return;
  const heroStats = document.querySelector('.hero-stats');
  if (!heroStats) return;

  const rect = heroStats.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    countersStarted = true;
    statNumbers.forEach(el => animateCounter(el));
  }
}
window.addEventListener('scroll', checkCounters);
// Run on load if already in view
setTimeout(checkCounters, 1400);

/* ========================================
   PRODUCT FILTER TABS
   ======================================== */
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    // Update active button
    filterButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Filter cards with animation
    productCards.forEach((card, index) => {
      const category = card.getAttribute('data-category');
      const matches = filter === 'all' || category === filter;

      if (matches) {
        card.classList.remove('hidden');
        // Stagger re-appear animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 60);
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
  const revealTargets = [
    // About
    { selector: '.about-image-col', cls: 'reveal-left' },
    { selector: '.about-content-col', cls: 'reveal-right' },
    // Products
    { selector: '.product-card', cls: 'reveal' },
    // Services
    { selector: '.service-card', cls: 'reveal' },
    // Gallery
    { selector: '.gallery-item', cls: 'reveal' },
    // Contact
    { selector: '.contact-info-col', cls: 'reveal-left' },
    { selector: '.contact-form-col', cls: 'reveal-right' },
    // Section headers
    { selector: '.section-header', cls: 'reveal' },
    // About features
    { selector: '.feature-item', cls: 'reveal' },
  ];

  revealTargets.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.classList.contains('reveal') &&
          !el.classList.contains('reveal-left') &&
          !el.classList.contains('reveal-right')) {
        el.classList.add(cls);
      }
    });
  });

  // Add delays to product cards & service cards for stagger effect
  document.querySelectorAll('.product-card').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });
  document.querySelectorAll('.service-card').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 0.1}s`;
  });
  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.07}s`;
  });
}

function triggerRevealAnimations() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const windowHeight = window.innerHeight;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight - 80) {
      el.classList.add('visible');
    }
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initRevealElements();
  triggerRevealAnimations(); // Check elements already in view
});

/* ========================================
   SCROLL TO TOP BUTTON
   ======================================== */
const scrollTopBtn = document.getElementById('scrollTop');

function toggleScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========================================
   ENQUIRY MODAL
   ======================================== */
const enquiryModal = document.getElementById('enquiryModal');
const modalClose = document.getElementById('modalClose');
const modalProductName = document.getElementById('modalProductName');
const whatsappLink = document.getElementById('modalWhatsapp');

function openEnquiry(productName) {
  modalProductName.textContent = productName;

  // Dynamic WhatsApp message
  const msg = encodeURIComponent(`Hello! I am interested in *${productName}* from Jain Electricals. Please share more details.`);
  whatsappLink.href = `https://wa.me/919876543210?text=${msg}`;

  enquiryModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  enquiryModal.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
enquiryModal.addEventListener('click', (e) => {
  if (e.target === enquiryModal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ========================================
   CONTACT FORM VALIDATION
   ======================================== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Helper: show / clear error
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('error');
  if (error) error.textContent = message;
}
function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.remove('error');
  if (error) error.textContent = '';
}

// Real-time validation
['formName', 'formPhone', 'formEmail', 'formMessage'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    const errorId = id.replace('form', '') .toLowerCase() + 'Error';
    clearError(id, `${id.replace('form', '').toLowerCase()}Error`);
  });
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  // Clear previous errors
  ['nameError', 'phoneError', 'emailError', 'messageError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  ['formName', 'formPhone', 'formEmail', 'formMessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('error');
  });

  // Name
  const name = document.getElementById('formName').value.trim();
  if (!name || name.length < 2) {
    showError('formName', 'nameError', 'Please enter your full name (min 2 characters).');
    valid = false;
  }

  // Phone
  const phone = document.getElementById('formPhone').value.trim();
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone) {
    showError('formPhone', 'phoneError', 'Please enter your phone number.');
    valid = false;
  } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    showError('formPhone', 'phoneError', 'Please enter a valid 10-digit Indian mobile number.');
    valid = false;
  }

  // Email (optional but must be valid if filled)
  const email = document.getElementById('formEmail').value.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('formEmail', 'emailError', 'Please enter a valid email address.');
    valid = false;
  }

  // Message
  const message = document.getElementById('formMessage').value.trim();
  if (!message || message.length < 10) {
    showError('formMessage', 'messageError', 'Please enter a message (min 10 characters).');
    valid = false;
  }

  if (!valid) return;

  // Simulate form submission (button loading state)
  const submitBtn = document.getElementById('submitFormBtn');
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    submitBtn.disabled = false;
    formSuccess.style.display = 'flex';

    setTimeout(() => {
      formSuccess.style.display = 'none';
    }, 6000);
  }, 1800);
});

/* ========================================
   CONTACT FORM – Pre-fill product from enquiry modal
   ======================================== */
function prefillContactForm(productName) {
  const productSelect = document.getElementById('formProduct');
  if (productSelect) {
    for (let i = 0; i < productSelect.options.length; i++) {
      if (productSelect.options[i].value === productName) {
        productSelect.selectedIndex = i;
        break;
      }
    }
  }
  // Scroll to contact
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

/* ========================================
   FOOTER YEAR
   ======================================== */
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ========================================
   SMOOTH ANCHOR SCROLL (custom offset for fixed navbar)
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 72;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  });
});

/* ========================================
   SERVICE CARD – Ripple Effect on Click
   ======================================== */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      width: 10px; height: 10px;
      background: rgba(255,215,0,0.35);
      transform: scale(0);
      animation: ripple-grow 0.6s linear;
      left: ${e.offsetX - 5}px;
      top: ${e.offsetY - 5}px;
      pointer-events: none;
    `;
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Ripple CSS (injected dynamically)
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-grow {
    to { transform: scale(40); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

/* ========================================
   NAVBAR – Colour change on light sections
   ======================================== */
function updateNavbarBg() {
  const lightSections = ['about', 'services', 'contact'];
  const scrollY = window.scrollY;

  lightSections.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    const top = section.offsetTop - 80;
    const bottom = top + section.offsetHeight;
    // No extra action needed – handled by .scrolled class
  });
}
window.addEventListener('scroll', updateNavbarBg);

/* ========================================
   GALLERY ITEM – Lightbox Feel (Simple)
   ======================================== */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const label = item.querySelector('.gallery-overlay span')?.textContent || 'Photo';
    // Could integrate a real lightbox; for now, show a quick toast
    showToast(`📸 ${label}`);
  });
});

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
    background: rgba(10,31,68,0.92);
    color: #fff;
    padding: 12px 24px; border-radius: 50px;
    font-size: 0.9rem; font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    z-index: 3000;
    animation: slide-up-toast 0.3s ease;
    border: 1px solid rgba(255,215,0,0.25);
  `;

  const toastAnim = document.createElement('style');
  toastAnim.textContent = `
    @keyframes slide-up-toast {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(toastAnim);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ========================================
   WHATSAPP FLOAT – Show after 3s delay
   ======================================== */
const waFloat = document.getElementById('whatsappFloat');
if (waFloat) {
  waFloat.style.opacity = '0';
  waFloat.style.transform = 'scale(0.5)';
  waFloat.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  setTimeout(() => {
    waFloat.style.opacity = '1';
    waFloat.style.transform = 'scale(1)';
  }, 3000);
}

/* ========================================
   FAN ICON – Rotation on Hover
   ======================================== */
const fanIcon = document.querySelector('.product-img--fan i');
if (fanIcon) {
  fanIcon.style.transition = 'transform 0.3s ease';
  fanIcon.parentElement.addEventListener('mouseenter', () => {
    fanIcon.style.animation = 'spin-fan 1s linear infinite';
  });
  fanIcon.parentElement.addEventListener('mouseleave', () => {
    fanIcon.style.animation = '';
  });
}

const fanSpinStyle = document.createElement('style');
fanSpinStyle.textContent = `
  @keyframes spin-fan { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(fanSpinStyle);

/* ========================================
   BULB ICON – Glow on Hover
   ======================================== */
const bulbIcon = document.querySelector('.product-img--led i');
if (bulbIcon) {
  bulbIcon.parentElement.addEventListener('mouseenter', () => {
    bulbIcon.style.textShadow = '0 0 20px #7fff7f, 0 0 40px #7fff7f';
    bulbIcon.style.transition = 'text-shadow 0.3s ease';
  });
  bulbIcon.parentElement.addEventListener('mouseleave', () => {
    bulbIcon.style.textShadow = '';
  });
}

console.log('%c⚡ Jain Electricals Website Loaded Successfully!', 'color: #FFD700; font-size: 16px; font-weight: bold;');
