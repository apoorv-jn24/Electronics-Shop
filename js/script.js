/* ==========================================================================
   EVEREST ELECTRICALS - CORE STORE & ENGINEERING ENGINE (js/main.js)
   ========================================================================== */

const CART_STORAGE_KEY = 'ee_estimate_cart';
let estimateCart = [];
let currentLang = 'en';

const i18nStrings = {
  en: {
    heroTitle: 'Wholesale ISI Electrical Supplies & Copper Winding Workshop',
    heroSubtitle: 'Direct counter for house-wiring FR copper coils, modular switch plates, MCB distribution boxes, and 5-star BLDC fans in <strong>Saroorpur Kalan, Baraut & Baghpat</strong>. Bring your electrician’s slip for instant wholesale billing.'
  },
  hi: {
    heroTitle: 'थोक ISI बिजली का सामान और कॉपर मोटर/पंखा वाइंडिंग वर्कशॉप',
    heroSubtitle: '1980 से <strong>सरूरपुर कलां, बड़ौत और बागपत</strong> का भरोसेमंद काउंटर। फिनोलेक्स, हैवेल्स, एंकर और लेग्रैंड के ओरिजिनल तार, एमसीबी और पंखे। अपने मिस्त्री की पर्ची अपलोड करें और तुरंत थोक रेट पाएं।'
  }
};

/* Sample Repair Workshop Database */
const repairJobsDB = {
  'EE-101': {
    status: 'Ready for Pickup',
    badgeClass: 'bg-emerald-100 text-emerald-800',
    item: 'Crompton High-Speed Ceiling Fan (Copper Winding + 6202 Bearing)',
    note: 'Passed 240V insulation & speed test · Counter Bill: ₹480'
  },
  'EE-102': {
    status: 'On Winding Bench',
    badgeClass: 'bg-amber-100 text-amber-800',
    item: 'Bajaj 25L Storage Water Geyser (Copper Element & Thermostat)',
    note: 'Tank descaling completed. Ready today by 6:30 PM · Est: ₹780'
  },
  'EE-103': {
    status: 'Technician Assigned',
    badgeClass: 'bg-blue-100 text-blue-800',
    item: 'Doorstep MCB Box Fault & Phase Check (Baraut Road)',
    note: 'Visiting Electrician (Ramesh) scheduled for 4:00 PM today.'
  }
};

/* Appliance-to-Wire Gauge Engineering Database */
const applianceSpecs = {
  ac15: {
    title: '1.5 Ton Split / Window AC (~1800W)',
    shortGauge: '2.5 sq.mm FR Copper',
    longGauge: '4.0 sq.mm FR Copper',
    mcb: '20A / 25A C-Curve SP',
    socket: '20A Modular AC Box',
    note: 'Always pull a dedicated 2.5 sq.mm circuit directly from the MCB box with 1.5 sq.mm earthing.'
  },
  ac20: {
    title: '2.0 Ton Heavy Duty AC (~2500W)',
    shortGauge: '4.0 sq.mm FR Copper',
    longGauge: '6.0 sq.mm FR Copper',
    mcb: '32A C-Curve SP MCB',
    socket: '25A/32A Heavy Starter Unit',
    note: 'Do not loop 2.0 Ton AC load with room switchboards. Use Finolex/Havells 4.0 sq.mm.'
  },
  geyser: {
    title: '25L Storage Water Geyser / Room Heater (~2000W)',
    shortGauge: '2.5 sq.mm FR Copper',
    longGauge: '4.0 sq.mm FR Copper',
    mcb: '16A / 20A C-Curve MCB',
    socket: '16A 3-Pin Shuttered Plug',
    note: 'Ensure 30mA RCCB protection in bathroom circuits to prevent shock hazards.'
  },
  submersible: {
    title: '1.5 HP – 2.0 HP Submersible Borewell Pump',
    shortGauge: '2.5 sq.mm 3-Core Flat Cable',
    longGauge: '4.0 sq.mm 3-Core Flat Cable',
    mcb: '25A / 32A C-Curve + Starter',
    socket: 'Oil/Air Motor Starter Panel',
    note: 'Use Finolex/Polycab waterproof PVC flat submersible cable for borewell depth.'
  },
  inverter: {
    title: 'Single Battery Home Inverter Line',
    shortGauge: '1.0 sq.mm FR Copper',
    longGauge: '1.5 sq.mm FR Copper',
    mcb: '10A / 16A B-Curve MCB',
    socket: 'Dedicated Inverter Phase Wire',
    note: 'Use a distinct wire color (e.g., Yellow or White) for inverter phase throughout the house.'
  },
  mainline: {
    title: 'Main Meter-to-DB Service Line (Up to 5 kW)',
    shortGauge: '6.0 sq.mm FR Copper',
    longGauge: '10.0 sq.mm Copper / Armoured',
    mcb: '40A / 63A Double Pole Isolator + RCCB',
    socket: 'Main Changeover / Busbar',
    note: 'Prevents voltage drop across rooms when AC, pump, and geyser run simultaneously.'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  /* 1. LIVE SHOP OPEN/CLOSED STATUS */
  const statusEl = document.getElementById('liveShopStatus');
  if (statusEl) {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    const openHour = now.getDay() === 0 ? 8 : 9;
    const isOpen = hour >= openHour && hour < 20;
    statusEl.innerHTML = `
      <span class="w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-rose-500'}"></span>
      <span>${isOpen ? 'Open Now · Closes 8:00 PM' : 'Closed · Opens Tomorrow'}</span>
    `;
  }

  /* 2. BILINGUAL TOGGLE */
  document.getElementById('langToggleBtn')?.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (i18nStrings[currentLang][key]) el.innerHTML = i18nStrings[currentLang][key];
    });
  });

  /* 3. MOBILE MENU */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('hidden');
      navMenu.classList.toggle('flex');
      navMenu.classList.toggle('flex-col');
      navMenu.classList.toggle('gap-2');
    });
  }

  /* 4. CATALOG FILTERING + VOICE SEARCH */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const activeCategoryLabel = document.getElementById('activeCategoryLabel');
  const navSearchInput = document.getElementById('navSearchInput');
  const brandPills = document.querySelectorAll('.brand-pill');

  const filterCatalog = ({ category = 'all', brand = 'all', query = '' }) => {
    const q = query.trim().toLowerCase();
    productCards.forEach((card) => {
      const cCat = card.getAttribute('data-category');
      const cBrand = card.getAttribute('data-brand');
      const text = card.textContent.toLowerCase();
      const show =
        (category === 'all' || cCat === category) &&
        (brand === 'all' || cBrand === brand) &&
        (!q || text.includes(q));
      card.style.display = show ? 'flex' : 'none';
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.className = 'filter-btn px-3.5 py-2 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:border-slate-900 transition';
      });
      btn.className = 'filter-btn active px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white transition';
      const category = btn.getAttribute('data-filter');
      if (activeCategoryLabel) activeCategoryLabel.textContent = btn.textContent;
      filterCatalog({ category });
    });
  });

  brandPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      brandPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      const brand = pill.getAttribute('data-brand');
      if (activeCategoryLabel) activeCategoryLabel.textContent = `Brand: ${pill.textContent}`;
      filterCatalog({ category: 'all', brand });
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  navSearchInput?.addEventListener('input', (e) => {
    const q = e.target.value;
    if (activeCategoryLabel) activeCategoryLabel.textContent = q ? `Search: "${q}"` : 'All Items';
    filterCatalog({ category: 'all', query: q });
  });

  /* Voice Search Integration */
  const voiceBtn = document.getElementById('voiceSearchBtn');
  if (voiceBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    voiceBtn.addEventListener('click', () => {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRec();
      rec.lang = 'en-IN';
      voiceBtn.classList.add('text-brand-red', 'animate-pulse');
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (navSearchInput) {
          navSearchInput.value = transcript;
          filterCatalog({ category: 'all', query: transcript });
          document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        }
      };
      rec.onend = () => voiceBtn.classList.remove('text-brand-red', 'animate-pulse');
      rec.start();
    });
  }

  /* 5. BHK HOUSE WIRING CALCULATOR */
  const calcBhk = document.getElementById('calcBhk');
  const calcBrand = document.getElementById('calcBrand');
  const calcSummaryTitle = document.getElementById('calcSummaryTitle');
  const calcTotalEstimate = document.getElementById('calcTotalEstimate');
  const calcBreakdown = document.getElementById('calcBreakdown');

  const bhkPresets = {
    '1': { label: '1 BHK / Shop', lightCoils: 3, powerCoils: 1, modules: '25–30 Modules', db: '6-Way SPN DB', baseCost: 9800 },
    '2': { label: '2 BHK Home', lightCoils: 5, powerCoils: 3, modules: '45–55 Modules', db: '8-Way Double Door DB', baseCost: 18500 },
    '3': { label: '3 BHK House', lightCoils: 8, powerCoils: 5, modules: '75–90 Modules', db: '12-Way Double Door DB', baseCost: 29500 },
    '4': { label: '4 BHK / Kothi', lightCoils: 12, powerCoils: 8, modules: '120+ Modules', db: '16-Way TPN DB + RCCB', baseCost: 46000 }
  };

  const brandMultipliers = {
    economy: { name: 'Economy ISI (Polycab/Anchor)', mult: 0.9 },
    standard: { name: 'Standard Pro (Finolex/Roma)', mult: 1.0 },
    premium: { name: 'Heavy Duty (Havells/Legrand)', mult: 1.18 }
  };

  const updateBhkCalc = () => {
    if (!calcBhk || !calcBrand) return;
    const preset = bhkPresets[calcBhk.value];
    const tier = brandMultipliers[calcBrand.value];
    const low = Math.round((preset.baseCost * tier.mult) / 100) * 100;
    const high = Math.round((low * 1.15) / 100) * 100;
    calcSummaryTitle.textContent = `${preset.label} · ${tier.name}`;
    calcTotalEstimate.textContent = `₹${low.toLocaleString('en-IN')} – ₹${high.toLocaleString('en-IN')}`;
    calcBreakdown.innerHTML = `
      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200"><span class="text-slate-500 block">1.0 / 1.5 sq.mm</span><strong class="text-slate-900">${preset.lightCoils} Coils (90m)</strong></div>
      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200"><span class="text-slate-500 block">2.5 / 4.0 sq.mm</span><strong class="text-slate-900">${preset.powerCoils} Coils (90m)</strong></div>
      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200"><span class="text-slate-500 block">Switchgear</span><strong class="text-slate-900">${preset.modules}</strong></div>
      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200"><span class="text-slate-500 block">Distribution</span><strong class="text-slate-900">${preset.db}</strong></div>
    `;
  };

  calcBhk?.addEventListener('change', updateBhkCalc);
  calcBrand?.addEventListener('change', updateBhkCalc);

  document.getElementById('sendCalcToQuoteBtn')?.addEventListener('click', () => {
    const preset = bhkPresets[calcBhk.value];
    const tier = brandMultipliers[calcBrand.value];
    const price = Math.round((preset.baseCost * tier.mult) / 100) * 100;
    addToQuoteCart(`KIT-${calcBhk.value}BHK`, `${preset.label} Wiring Kit (${tier.name})`, price);
  });

  /* 6. APPLIANCE WIRE GAUGE FINDER */
  const appSelect = document.getElementById('applianceSelect');
  const runLength = document.getElementById('wireRunLength');
  const updateWireCalc = () => {
    if (!appSelect || !runLength) return;
    const spec = applianceSpecs[appSelect.value];
    const isLong = runLength.value === 'long';
    document.getElementById('wireRecTitle').textContent = spec.title;
    document.getElementById('wireRecGauge').textContent = isLong ? spec.longGauge : spec.shortGauge;
    document.getElementById('wireRecMcb').textContent = spec.mcb;
    document.getElementById('wireRecSocket').textContent = spec.socket;
    document.getElementById('wireRecNote').textContent = spec.note;
  };
  appSelect?.addEventListener('change', updateWireCalc);
  runLength?.addEventListener('change', updateWireCalc);

  /* 7. REPAIR TOKEN TRACKER */
  const checkTokenBtn = document.getElementById('checkTokenBtn');
  const tokenInput = document.getElementById('repairTokenInput');
  const tokenResult = document.getElementById('repairTokenResult');
  checkTokenBtn?.addEventListener('click', () => {
    const code = (tokenInput.value || '').trim().toUpperCase().replace('#', '');
    const job = repairJobsDB[code];
    if (!job) {
      tokenResult.innerHTML = `
        <div class="text-brand-red font-bold">Token "${code || 'Empty'}" not found in active bench queue.</div>
        <p class="text-slate-600">Try sample tokens <strong>EE-101</strong>, <strong>EE-102</strong>, or <strong>EE-103</strong>, or contact our counter with your receipt.</p>
      `;
      return;
    }
    tokenResult.innerHTML = `
      <div class="flex items-center justify-between">
        <strong class="text-slate-900 font-mono">Token: #${code}</strong>
        <span class="${job.badgeClass} font-bold px-2 py-0.5 rounded text-[11px]">${job.status}</span>
      </div>
      <p class="text-slate-700"><strong>Item:</strong> ${job.item}</p>
      <p class="text-slate-600"><strong>Update:</strong> ${job.note}</p>
    `;
  });

  /* 8. PARCHI PHOTO PREVIEW & UPLOAD HANDLER */
  const parchiFileInput = document.getElementById('parchiFileInput');
  const parchiFileName = document.getElementById('parchiFileName');
  const parchiPreviewWrap = document.getElementById('parchiPreviewWrap');
  const parchiPreviewImg = document.getElementById('parchiPreviewImg');

  parchiFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    parchiFileName.textContent = `Selected: ${file.name}`;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        parchiPreviewImg.src = ev.target.result;
        parchiPreviewWrap.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('parchiForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('parchiCustomerName').value.trim();
    const phone = document.getElementById('parchiCustomerPhone').value.trim();
    const brand = document.getElementById('parchiBrandPref').value.trim() || 'Standard ISI';
    const fileName = parchiFileInput?.files[0]?.name || 'Handwritten Parchi';

    closeParchiModal();
    openEnquiry(`Handwritten Parchi Upload (${fileName}) - Brand Pref: ${brand}`);
    document.getElementById('customerName').value = name;
    document.getElementById('customerPhone').value = phone;
  });

  /* 9. LOCAL REVIEWS */
  const reviewsGrid = document.getElementById('googleReviewsGrid');
  if (reviewsGrid) {
    const reviews = [
      { author: 'Sandeep Tomar', loc: 'Saroorpur Kalan', text: 'Bought complete Finolex house wiring coils, Anchor Roma switches, and Legrand MCB box. 100% genuine stock at wholesale rate.' },
      { author: 'Vikas Chaudhary', loc: 'Baraut', text: 'Fastest copper ceiling fan winding and geyser repair in our area. Same-day technician fixed our house earthing fault.' },
      { author: 'Mohit Sharma (Contractor)', loc: 'Baghpat', text: 'Sourcing from Everest Electricals for 8 years. Transparent GST billing and unused switch boxes are exchanged easily.' }
    ];
    reviewsGrid.innerHTML = reviews.map(r => `
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div class="text-amber-500 text-xs mb-1">★★★★★</div>
        <p class="text-xs text-slate-700 leading-relaxed mb-2">"${r.text}"</p>
        <strong class="text-xs font-bold text-slate-900 block">${r.author} <span class="text-slate-500 font-normal">· ${r.loc}</span></strong>
      </div>
    `).join('');
  }

  /* 10. ESTIMATE CART INITIALIZATION */
  try {
    estimateCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  } catch (e) {
    estimateCart = [];
  }
  renderCart();

  document.getElementById('openCartBtn')?.addEventListener('click', toggleCartDrawer);
  document.getElementById('closeCartBtn')?.addEventListener('click', toggleCartDrawer);
  document.getElementById('closeCartBackdrop')?.addEventListener('click', toggleCartDrawer);
  document.getElementById('transferCartToFormBtn')?.addEventListener('click', () => {
    toggleCartDrawer();
    const summary = estimateCart.map(i => `${i.qty}x ${i.name} (₹${i.price * i.qty})`).join('\n- ');
    openEnquiry(`Estimate List (${estimateCart.length} items)`);
    document.getElementById('enquiryMessage').value = `Please share best bulk trade price for:\n- ${summary}`;
  });
});

/* ==========================================================================
   GLOBAL INTERACTIVE FUNCTIONS
   ========================================================================== */

function switchCalcTab(tab) {
  const bhkDiv = document.getElementById('calcTabBhk');
  const wireDiv = document.getElementById('calcTabWire');
  const btnBhk = document.getElementById('tabBtnBhk');
  const btnWire = document.getElementById('tabBtnWire');

  if (tab === 'bhk') {
    bhkDiv.classList.remove('hidden');
    wireDiv.classList.add('hidden');
    btnBhk.className = 'px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white transition';
    btnWire.className = 'px-4 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 transition';
  } else {
    wireDiv.classList.remove('hidden');
    bhkDiv.classList.add('hidden');
    btnWire.className = 'px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white transition';
    btnBhk.className = 'px-4 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 transition';
  }
}

function openParchiModal() {
  document.getElementById('parchiModal')?.classList.remove('hidden');
}

function closeParchiModal() {
  document.getElementById('parchiModal')?.classList.add('hidden');
}

function toggleCartDrawer() {
  document.getElementById('quoteCartDrawer')?.classList.toggle('hidden');
}

function addToQuoteCart(sku, name, price) {
  const existing = estimateCart.find(i => i.sku === sku);
  if (existing) {
    existing.qty += 1;
  } else {
    estimateCart.push({ sku, name, price, qty: 1 });
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(estimateCart));
  renderCart();
  const drawer = document.getElementById('quoteCartDrawer');
  if (drawer && drawer.classList.contains('hidden')) toggleCartDrawer();
}

function updateCartQty(sku, delta) {
  const item = estimateCart.find(i => i.sku === sku);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) estimateCart = estimateCart.filter(i => i.sku !== sku);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(estimateCart));
  renderCart();
}

function renderCart() {
  const badge = document.getElementById('cartCountBadge');
  const container = document.getElementById('cartItemsContainer');
  const subTotalEl = document.getElementById('cartSubTotalValue');
  const totalEl = document.getElementById('cartTotalValue');

  const totalCount = estimateCart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = estimateCart.reduce((sum, i) => sum + i.qty * i.price, 0);
  const taxableValue = Math.round(totalPrice / 1.18);

  if (badge) badge.textContent = totalCount;
  if (subTotalEl) subTotalEl.textContent = `₹${taxableValue.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

  if (!container) return;
  if (estimateCart.length === 0) {
    container.innerHTML = `<div class="text-center py-10 text-slate-400">Your Estimate List is empty. Click "+ Add to List" on any product to build an instant bill of materials.</div>`;
    return;
  }

  container.innerHTML = estimateCart.map(item => `
    <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
      <div class="pr-2">
        <div class="font-bold text-slate-900">${item.name}</div>
        <div class="text-[11px] font-mono text-slate-500">${item.sku} · ₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button onclick="updateCartQty('${item.sku}', -1)" class="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 font-bold">-</button>
        <span class="font-mono font-bold w-4 text-center">${item.qty}</span>
        <button onclick="updateCartQty('${item.sku}', 1)" class="w-6 h-6 rounded bg-slate-900 text-white font-bold">+</button>
      </div>
    </div>
  `).join('');
}

/* Generates a clean, printable Proforma GST Estimate Sheet in a new window */
function printGstEstimate() {
  if (estimateCart.length === 0) {
    alert('Please add at least one product to your Estimate List before printing.');
    return;
  }
  const total = estimateCart.reduce((sum, i) => sum + i.qty * i.price, 0);
  const taxable = Math.round(total / 1.18);
  const gst = total - taxable;

  const rows = estimateCart.map((item, idx) => `
    <tr>
      <td style="padding:8px;border:1px solid #cbd5e1;">${idx + 1}</td>
      <td style="padding:8px;border:1px solid #cbd5e1;"><strong>${item.name}</strong><br><small>SKU: ${item.sku}</small></td>
      <td style="padding:8px;border:1px solid #cbd5e1;text-align:center;">${item.qty}</td>
      <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;"><strong>₹${(item.price * item.qty).toLocaleString('en-IN')}</strong></td>
    </tr>
  `).join('');

  const win = window.open('', '_blank', 'width=800,height=700');
  win.document.write(`
    <html>
    <head>
      <title>Proforma Estimate - Everest Electricals</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; color: #0f172a; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
      </style>
    </head>
    <body>
      <div style="display:flex;justify-content:space-between;border-bottom:2px solid #0f172a;padding-bottom:12px;">
        <div>
          <h2 style="margin:0;">EVEREST ELECTRICALS</h2>
          <p style="margin:4px 0;font-size:12px;">Main Market, Saroorpur Kalan, Baghpat (UP) – 250611<br>Authorized ISI Electrical Retail & Wholesale Counter (Est. 1980)</p>
        </div>
        <div style="text-align:right;font-size:12px;">
          <strong>PROFORMA ESTIMATE</strong><br>
          Date: ${new Date().toLocaleDateString('en-IN')}
        </div>
      </div>
      <table>
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="padding:8px;border:1px solid #cbd5e1;text-align:left;">#</th>
            <th style="padding:8px;border:1px solid #cbd5e1;text-align:left;">Item Description</th>
            <th style="padding:8px;border:1px solid #cbd5e1;">Qty</th>
            <th style="padding:8px;border:1px solid #cbd5e1;text-align:right;">Unit Rate (Inc. GST)</th>
            <th style="padding:8px;border:1px solid #cbd5e1;text-align:right;">Line Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top:16px;text-align:right;font-size:13px;">
        <p style="margin:4px 0;">Taxable Amount: ₹${taxable.toLocaleString('en-IN')}</p>
        <p style="margin:4px 0;">Included GST (18%): ₹${gst.toLocaleString('en-IN')}</p>
        <h3 style="margin:8px 0;">Grand Estimate Total: ₹${total.toLocaleString('en-IN')}</h3>
        <p style="font-size:11px;color:#64748b;">Bring this sheet to Everest Electricals counter for special bulk contractor discount.</p>
      </div>
      <script>window.print();<\/script>
    </body>
    </html>
  `);
  win.document.close();
}

function openEnquiry(productName) {
  const typeSelect = document.getElementById('enquiryType');
  const subjectInput = document.getElementById('enquirySubject');
  const messageInput = document.getElementById('enquiryMessage');
  if (typeSelect) typeSelect.value = 'Product Enquiry';
  if (subjectInput) subjectInput.value = productName;
  if (messageInput) messageInput.value = `Hi Everest Electricals, please share the best counter/wholesale price for: ${productName}.`;
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

function openRepairEnquiry(serviceName) {
  const typeSelect = document.getElementById('enquiryType');
  const subjectInput = document.getElementById('enquirySubject');
  const messageInput = document.getElementById('enquiryMessage');
  if (typeSelect) typeSelect.value = 'Repair Booking';
  if (subjectInput) subjectInput.value = serviceName;
  if (messageInput) messageInput.value = `Hi Everest Electricals, I want to book a repair/technician for: ${serviceName}.`;
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}