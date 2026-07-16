/* ==========================================================================
   VAPE AVE — pickup ordering (simulated demo: no data leaves the browser)
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Demo catalog ---------- */
  const PRODUCTS = [
    { id: "gb-pulse", name: "Geek Bar Pulse 15K", cat: "disposables", price: 19.99, tag: "Best seller",
      flavors: ["Miami Mint", "Blue Razz Ice", "Meta Moon", "Sour Apple B-Burst", "Watermelon Ice", "Cherry Bomb", "Mexico Mango"] },
    { id: "foger-30k", name: "Foger Switch Pro 30K", cat: "disposables", price: 24.99, tag: "New drop",
      flavors: ["Strawberry Ice", "Meta Moon", "Skittles Cupcake", "Strawberry Kiwi", "Chocolate Cupcake"] },
    { id: "lost-mary", name: "Lost Mary MO20000", cat: "disposables", price: 21.99,
      flavors: ["Blue Razz Ice", "Grape Jelly", "Watermelon BG", "Pineapple Apple Pear"] },
    { id: "raz-tn", name: "RAZ TN9000", cat: "disposables", price: 17.99,
      flavors: ["Strawberry Ice", "Blue Raz Cotton Candy", "Miami Mint", "Cactus Jack"] },
    { id: "salt-30", name: "Salt Nic E-Liquid 30mL", cat: "eliquids", price: 16.99,
      flavors: ["Blue Razz", "Strawberry Kiwi", "Clear", "Peach Ice", "Menthol"] },
    { id: "free-100", name: "Freebase E-Liquid 100mL", cat: "eliquids", price: 21.99,
      flavors: ["Dessert Blend", "Fruit Punch", "Iced Menthol", "Custard"] },
    { id: "pod-kit", name: "Pod System Starter Kit", cat: "devices", price: 29.99, tag: "Staff pick" },
    { id: "box-mod", name: "220W Box Mod Kit", cat: "devices", price: 59.99 },
    { id: "coils", name: "Replacement Coils (5-pack)", cat: "accessories", price: 15.99 },
    { id: "battery", name: "18650 Battery + Charger", cat: "accessories", price: 19.99 },
    { id: "grinder", name: "4-Piece Metal Grinder", cat: "accessories", price: 24.99 },
    { id: "glass-hand", name: "Local Art Glass Hand Pipe", cat: "glass", price: 34.99, tag: "One of a kind" },
  ];

  const CAT_ICONS = {
    disposables: '<svg viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><circle cx="12" cy="17" r="1.2"/></svg>',
    eliquids: '<svg viewBox="0 0 24 24"><path d="M10 3h4v4l2 3v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10l2-3z"/><line x1="8" y1="14" x2="16" y2="14"/></svg>',
    devices: '<svg viewBox="0 0 24 24"><rect x="7" y="4" width="10" height="16" rx="3"/><rect x="10" y="8" width="4" height="5" rx="1"/><line x1="12" y1="16" x2="12" y2="17"/></svg>',
    accessories: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
    glass: '<svg viewBox="0 0 24 24"><path d="M12 3v5"/><path d="M8 8h8l1 9a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3l1-9z"/><path d="M10 3h4"/></svg>',
  };

  const grid = document.getElementById("productGrid");
  if (!grid) return;

  /* ---------- Cart state (session-only) ---------- */
  let cart = {};
  try {
    cart = JSON.parse(sessionStorage.getItem("vapeave-cart") || "{}");
  } catch (e) { cart = {}; }

  const save = () => sessionStorage.setItem("vapeave-cart", JSON.stringify(cart));
  const money = (n) => "$" + n.toFixed(2);
  const cartLines = () => Object.entries(cart);
  const cartCount = () => cartLines().reduce((s, [, l]) => s + l.qty, 0);
  const cartTotal = () => cartLines().reduce((s, [, l]) => s + l.qty * l.price, 0);

  /* ---------- Render products ---------- */
  function renderProducts(filter) {
    grid.innerHTML = "";
    PRODUCTS.filter((p) => filter === "all" || p.cat === filter).forEach((p) => {
      const card = document.createElement("article");
      card.className = "product";
      card.innerHTML = `
        ${p.tag ? `<span class="product__tag">${p.tag}</span>` : ""}
        <div class="product__icon product__icon--${p.cat}" aria-hidden="true">${CAT_ICONS[p.cat]}</div>
        <h3 class="product__name">${p.name}</h3>
        <p class="product__price">${money(p.price)}</p>
        ${p.flavors ? `
          <label class="product__flavor-label" for="fl-${p.id}">Flavor</label>
          <select class="product__flavor" id="fl-${p.id}">
            ${p.flavors.map((f) => `<option>${f}</option>`).join("")}
          </select>` : ""}
        <button class="btn btn--green btn--sm product__add" data-id="${p.id}">Add to order</button>
      `;
      grid.appendChild(card);
    });
  }

  renderProducts("all");

  /* ---------- Filters ---------- */
  const filters = document.getElementById("menuFilters");
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".menu-filter");
    if (!btn) return;
    filters.querySelectorAll(".menu-filter").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    renderProducts(btn.dataset.filter);
  });

  /* ---------- Add to cart ---------- */
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".product__add");
    if (!btn) return;
    const p = PRODUCTS.find((x) => x.id === btn.dataset.id);
    const flavorSel = document.getElementById("fl-" + p.id);
    const flavor = flavorSel ? flavorSel.value : null;
    const key = p.id + (flavor ? "::" + flavor : "");
    if (cart[key]) cart[key].qty += 1;
    else cart[key] = { name: p.name, flavor, price: p.price, qty: 1 };
    save();
    updateCartUI();
    toast(`Added ${p.name}${flavor ? " — " + flavor : ""}`);
  });

  /* ---------- Toast ---------- */
  const toastEl = document.getElementById("toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = "✓ " + msg;
    toastEl.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-shown"), 2200);
  }

  /* ---------- Drawer ---------- */
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  const cartView = document.getElementById("cartView");
  const confirmView = document.getElementById("cartConfirm");

  function openCart() {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-shown"));
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.classList.remove("is-shown");
    setTimeout(() => { overlay.hidden = true; }, 300);
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-cart-open]").forEach((b) => b.addEventListener("click", openCart));
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("confirmClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
  document.getElementById("cartBrowse").addEventListener("click", () => {
    closeCart();
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- Cart UI ---------- */
  const itemsEl = document.getElementById("cartItems");
  const emptyEl = document.getElementById("cartEmpty");
  const bodyEl = document.getElementById("cartBody");

  function updateCartUI() {
    const count = cartCount();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = count;
      el.hidden = count === 0;
    });

    const lines = cartLines();
    emptyEl.hidden = lines.length > 0;
    bodyEl.hidden = lines.length === 0;

    itemsEl.innerHTML = "";
    lines.forEach(([key, l]) => {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <div class="cart-item__info">
          <strong>${l.name}</strong>
          ${l.flavor ? `<span class="cart-item__flavor">${l.flavor}</span>` : ""}
          <span class="cart-item__price">${money(l.price)}</span>
        </div>
        <div class="cart-item__qty">
          <button data-dec="${key}" aria-label="Decrease quantity">−</button>
          <span>${l.qty}</span>
          <button data-inc="${key}" aria-label="Increase quantity">+</button>
        </div>
      `;
      itemsEl.appendChild(li);
    });

    document.getElementById("cartSubtotal").textContent = money(cartTotal());
    document.getElementById("cartPoints").textContent = "earns " + Math.floor(cartTotal()) + " pts";
  }

  itemsEl.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    if (inc) cart[inc.dataset.inc].qty += 1;
    if (dec) {
      const key = dec.dataset.dec;
      cart[key].qty -= 1;
      if (cart[key].qty <= 0) delete cart[key];
    }
    if (inc || dec) { save(); updateCartUI(); }
  });

  updateCartUI();

  /* ---------- Simulated checkout ---------- */
  const form = document.getElementById("pickupForm");
  const errEl = document.getElementById("cartError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("puName").value.trim();
    const phone = document.getElementById("puPhone").value.trim();
    if (!name || !phone) {
      errEl.hidden = false;
      errEl.textContent = "Add a name and mobile number so we know whose bag it is.";
      return;
    }
    errEl.hidden = true;

    const num = "VA-" + String(Math.floor(1000 + Math.random() * 9000));
    const timeSel = document.getElementById("puTime").value;
    const mins = timeSel === "asap" ? 15 : timeSel === "30" ? 30 : timeSel === "60" ? 60 : null;
    let readyText = "Ready this evening — we'll text you";
    if (mins) {
      const t = new Date(Date.now() + mins * 60000);
      readyText = "Ready around " + t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }

    document.getElementById("confirmNum").textContent = num;
    document.getElementById("confirmReady").textContent = readyText;
    document.getElementById("confirmName").textContent = name;
    document.getElementById("confirmPhone").textContent = phone;

    cartView.hidden = true;
    confirmView.hidden = false;
  });

  document.getElementById("confirmReset").addEventListener("click", () => {
    cart = {};
    save();
    updateCartUI();
    form.reset();
    confirmView.hidden = true;
    cartView.hidden = false;
    closeCart();
  });
})();
