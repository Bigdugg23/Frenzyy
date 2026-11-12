/* ============================================================
   FRENZYY — SHARED PAGE LOGIC
   ============================================================ */

/* ---------- keep the shared site chrome consistent ---------- */
function initChrome(){
  const announcement = document.querySelector(".marquee-track");
  if (announcement) announcement.innerHTML = `
    <span>Drop 005 — now live</span><span>South Africa delivery available</span><span>Built in Cape Town</span><span>Limited production only</span>
    <span>Drop 005 — now live</span><span>South Africa delivery available</span><span>Built in Cape Town</span><span>Limited production only</span>`;

  const logo = document.querySelector(".brand-logo");
  if (logo) {
    logo.setAttribute("aria-label", "FRENZYY home");
    logo.innerHTML = '<span class="brand-mark">F//</span>FRENZYY';
  }

  const burger = document.getElementById("burgerBtn");
  if (burger) {
    burger.setAttribute("aria-label", "Open menu");
    burger.setAttribute("aria-expanded", "false");
    burger.innerHTML = "<span></span><span></span>";
  }

  document.querySelectorAll('.nav-menu a[href="about.html"]').forEach(link => link.textContent = "Studio");

  const footerLead = document.querySelector(".foot-grid > :first-child");
  if (footerLead) {
    footerLead.classList.add("foot-lead");
    const footerBrand = footerLead.querySelector(".foot-brand");
    if (footerBrand) footerBrand.innerHTML = "FRENZYY<span>®</span>";
  }
}

/* ---------- mobile nav ---------- */
function initNav(){
  const burger = document.getElementById("burgerBtn");
  const menu = document.getElementById("navMenu");
  if (!burger || !menu) return;
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    menu.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }));
}

/* ---------- scroll reveal ---------- */
function initReveal(){
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ---------- product card markup ---------- */
function productCardHTML(p){
  const status = getStatusTag(p);
  const tagHTML = status.label ? `<span class="tag-pill ${status.cls}">${status.label}</span>` : "";
  const artClass = p.category.toLowerCase().replace(/[^a-z]/g, "");
  return `
    <div class="product-card reveal">
      <div class="product-media">
        ${tagHTML}
        <img src="${p.img}" alt="${p.name}" class="ph-img"
             onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'ph product-art art-${artClass}',innerHTML:'<span class=art-code>F//${p.id.slice(-3)}</span><span class=art-name>${p.name}</span><i></i>'}))">
      </div>
      <div class="product-info">
        <div class="product-topline"><div class="product-cat">${p.category} / ${p.sku}</div><div class="product-price">${formatPrice(p.price)}</div></div>
        <div class="product-name">${p.name}</div>
        <a class="card-link" href="product.html?id=${p.id}" aria-label="View ${p.name}"><span>${status.cls === "out" ? "View archive" : "View piece"}</span><b>↗</b></a>
      </div>
    </div>`;
}

/* ---------- SHOP PAGE ---------- */
function renderShop(){
  const grid = document.getElementById("shopGrid");
  const pills = document.querySelectorAll(".filter-pill");
  if (!grid) return;

  function draw(filter){
    const items = filter === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
    grid.innerHTML = items.map(productCardHTML).join("");
    initReveal();
  }

  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      draw(pill.dataset.filter);
    });
  });

  draw("All");
}

/* ---------- HOME PAGE FEATURED ---------- */
function renderFeatured(){
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;
  const featured = PRODUCTS.slice(0, 3);
  grid.innerHTML = featured.map(productCardHTML).join("");
  initReveal();
}

/* ---------- PRODUCT DETAIL PAGE ---------- */
let _selectedSize = null;
let _selectedQty = 1;

function renderProductDetail(){
  const wrap = document.getElementById("productDetailWrap");
  if (!wrap) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = getProductById(id) || PRODUCTS[0];

  document.title = `${product.name} — FRENZYY`;

  const status = getStatusTag(product);
  const artClass = product.category.toLowerCase().replace(/[^a-z]/g, "");
  const sizeButtons = product.sizes.map(s => {
    const disabled = s.stock === 0;
    return `
      <button class="size-opt ${disabled ? "disabled" : ""}" data-size="${s.size}" ${disabled ? "disabled" : ""}>
        ${s.size}
        <span class="stock-hint">${disabled ? "SOLD OUT" : s.stock + " LEFT"}</span>
      </button>`;
  }).join("");

  wrap.innerHTML = `
    <div class="product-detail">
      <div class="pd-media reveal">
        <img src="${product.img}" alt="${product.name}"
             onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'ph product-art art-${artClass}',innerHTML:'<span class=art-code>F//${product.id.slice(-3)}</span><span class=art-name>${product.name}</span><i></i>'}))">
      </div>
      <div class="pd-info reveal">
        <div class="product-cat">${product.category}</div>
        <h1>${product.name}</h1>
        <div class="pd-sku">SKU: ${product.sku} ${status.label ? "· " + status.label : ""}</div>
        <div class="pd-price">${formatPrice(product.price)}</div>
        <p class="pd-desc">${product.desc}</p>

        <div class="size-row">
          <span class="label">Select Size</span>
          <div class="size-options" id="sizeOptions">${sizeButtons}</div>
        </div>

        <div class="qty-row">
          <span class="label" style="margin-bottom:0;">Qty</span>
          <div class="qty-stepper">
            <button id="qtyMinus" type="button">&minus;</button>
            <span class="qty-val" id="qtyVal">1</span>
            <button id="qtyPlus" type="button">+</button>
          </div>
        </div>

        <div id="stockNote" class="stock-note"></div>

        <div class="pd-actions">
          <button class="btn btn-fill" id="addToBagBtn" disabled>Select A Size</button>
          <a class="btn btn-outline" href="cart.html">View Bag</a>
        </div>

        <div class="spec-strip">
          <div><span>Fabric</span>${product.details?.fabric || "Heavyweight cotton blend"}</div>
          <div><span>Fit</span>${product.details?.fit || "Relaxed / box cut"}</div>
          <div><span>Care</span>${product.details?.care || "Cold wash / hang dry"}</div>
        </div>

        <div class="product-assurances">
          <div><b>01</b><span>Small-run production</span></div>
          <div><b>02</b><span>Made in Cape Town</span></div>
          <div><b>03</b><span>Delivery confirmed with your order</span></div>
        </div>
      </div>
    </div>
  `;

  initReveal();

  const sizeOptions = wrap.querySelectorAll(".size-opt:not(.disabled)");
  const addBtn = document.getElementById("addToBagBtn");
  const stockNote = document.getElementById("stockNote");
  const qtyVal = document.getElementById("qtyVal");
  const qtyMinus = document.getElementById("qtyMinus");
  const qtyPlus = document.getElementById("qtyPlus");

  _selectedSize = null;
  _selectedQty = 1;

  function refreshStockNote(){
    if (!_selectedSize) { stockNote.textContent = ""; return; }
    const stock = findSizeStock(product.id, _selectedSize);
    const inCart = getCartLineQty(product.id, _selectedSize);
    const remaining = stock - inCart;
    if (remaining <= 3) {
      stockNote.className = "stock-note low";
      stockNote.textContent = `\u26A0 ONLY ${Math.max(remaining,0)} LEFT IN THIS SIZE`;
    } else {
      stockNote.className = "stock-note ok";
      stockNote.textContent = `${remaining} IN STOCK`;
    }
  }

  sizeOptions.forEach(btn => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".size-opt").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      _selectedSize = btn.dataset.size;
      _selectedQty = 1;
      qtyVal.textContent = _selectedQty;
      addBtn.disabled = false;
      addBtn.textContent = "Add To Bag";
      refreshStockNote();
    });
  });

  qtyMinus.addEventListener("click", () => {
    if (_selectedQty > 1) { _selectedQty--; qtyVal.textContent = _selectedQty; }
  });
  qtyPlus.addEventListener("click", () => {
    if (!_selectedSize) return;
    const stock = findSizeStock(product.id, _selectedSize);
    const inCart = getCartLineQty(product.id, _selectedSize);
    if (_selectedQty + inCart < stock) { _selectedQty++; qtyVal.textContent = _selectedQty; }
  });

  if (status.cls === "out") {
    addBtn.textContent = "Sold Out";
    addBtn.disabled = true;
  }

  addBtn.addEventListener("click", () => {
    if (!_selectedSize) return;
    addToCart(product.id, _selectedSize, _selectedQty);
    refreshStockNote();
    addBtn.textContent = "Added \u2713";
    setTimeout(() => { if (addBtn) addBtn.textContent = "Add More"; }, 1400);
  });
}

/* ---------- CART PAGE ---------- */
function renderCartPage(){
  const wrap = document.getElementById("cartWrap");
  if (!wrap) return;

  const lines = getCartLines();

  if (lines.length === 0) {
    wrap.innerHTML = `
      <div class="empty-cart reveal">
        <div class="big-icon">\u{1F6A7}</div>
        <h2 class="section-title" style="margin-bottom:14px;">Your Bag Is Empty</h2>
        <p style="margin-bottom:28px;">Nothing on site yet. Go grab something before it's gone.</p>
        <a class="btn btn-fill" href="shop.html">Shop The Drop</a>
      </div>`;
    initReveal();
    return;
  }

  const itemsHTML = lines.map(line => `
    <div class="cart-item reveal" data-pid="${line.productId}" data-size="${line.size}">
      <div class="thumb">
        <img src="${line.product.img}" alt="${line.product.name}"
             onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'ph',innerHTML:'NO IMG'}))">
      </div>
      <div>
        <div class="ci-name">${line.product.name}</div>
        <div class="ci-meta">SIZE ${line.size} &middot; ${formatPrice(line.product.price)} EACH</div>
        <div class="ci-controls">
          <div class="qty-stepper">
            <button type="button" class="ci-minus">&minus;</button>
            <span class="qty-val">${line.qty}</span>
            <button type="button" class="ci-plus">+</button>
          </div>
          <button type="button" class="remove-link">Remove</button>
        </div>
      </div>
      <div class="ci-price">${formatPrice(line.lineTotal)}</div>
    </div>
  `).join("");

  const total = getCartTotal();
  wrap.innerHTML = `
    <div class="cart-layout">
      <div>${itemsHTML}</div>
      <div class="summary-box reveal">
        <h3>Order Summary</h3>
        <div class="shipping-note"><b>SA delivery available</b><span>Cost and timing confirmed when your order is placed.</span></div>
        <div class="summary-row"><span>Subtotal</span><span>${formatPrice(total)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>Calculated at checkout</span></div>
        <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
        <button class="btn btn-fill btn-block" id="checkoutBtn" style="margin-top:18px;">Proceed To Checkout</button>
        <p style="font-family:var(--font-mono); font-size:.66rem; color:#888; margin-top:14px; line-height:1.6;">
          \u{1F6A7} Online payments are still being wired up. For now, checkout will give you an order summary to send us directly.
        </p>
      </div>
    </div>
  `;

  initReveal();

  wrap.querySelectorAll(".cart-item").forEach(card => {
    const pid = card.dataset.pid;
    const size = card.dataset.size;
    const qtyValEl = card.querySelector(".qty-val");

    card.querySelector(".ci-minus").addEventListener("click", () => {
      const newQty = parseInt(qtyValEl.textContent) - 1;
      setCartLineQty(pid, size, newQty);
      renderCartPage();
    });
    card.querySelector(".ci-plus").addEventListener("click", () => {
      const newQty = parseInt(qtyValEl.textContent) + 1;
      setCartLineQty(pid, size, newQty);
      renderCartPage();
    });
    card.querySelector(".remove-link").addEventListener("click", () => {
      removeFromCart(pid, size);
      renderCartPage();
    });
  });

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckoutModal);
}

/* ---------- CHECKOUT PLACEHOLDER MODAL ---------- */
function openCheckoutModal(){
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.add("open");
}
function closeCheckoutModal(){
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.remove("open");
}
function copyOrderSummary(){
  const lines = getCartLines();
  const text = lines.map(l => `${l.qty} x ${l.product.name} (${l.size}) — ${formatPrice(l.lineTotal)}`).join("\n")
    + `\n\nTOTAL: ${formatPrice(getCartTotal())}`;
  navigator.clipboard?.writeText(text).then(() => {
    const btn = document.getElementById("copySummaryBtn");
    if (btn) { const old = btn.textContent; btn.textContent = "Copied \u2713"; setTimeout(() => btn.textContent = old, 1500); }
  });
}

/* ---------- CONTACT FORM (UI only, no backend yet) ---------- */
function initContactForm(){
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    btn.textContent = "Message Sent \u2713";
    btn.disabled = true;
  });
}

/* ---------- FAQ accordions ---------- */
function initAccordions(){
  document.querySelectorAll(".faq-button").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const open = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
    });
  });
}

/* ---------- run on every page ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initChrome();
  initNav();
  initReveal();
  initAccordions();
});
