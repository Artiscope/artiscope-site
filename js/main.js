(function () {
  "use strict";

  const gbp = (n) => "\u00a3" + n.toLocaleString("en-GB");

  /* ---------- render: artists ---------- */
  const artistsGrid = document.getElementById("artists-grid");
  artistsGrid.innerHTML = ARTISTS.map((a) => `
    <a href="#" class="artist-card">
      <div class="artist-image" style="background:${a.gradient}">[Signature piece]</div>
      <div>
        <h3 class="artist-name">${a.name}</h3>
        <p class="artist-tag">${a.tag}</p>
      </div>
    </a>
  `).join("");

  /* ---------- render: releases (filterable) ---------- */
  const releasesGrid = document.getElementById("releases-grid");
  const releasesEmpty = document.getElementById("releases-empty");
  const filterTabs = document.getElementById("filter-tabs");
  let currentFilter = "all";

  function renderReleases() {
    const list = RELEASES.filter((r) => currentFilter === "all" || r.type === currentFilter);
    releasesEmpty.hidden = list.length !== 0;
    releasesGrid.innerHTML = list.map((r) => `
      <div class="release-card">
        <div class="release-image" style="background:${r.gradient}"></div>
        <div>
          <p class="release-title">${r.title}</p>
          <p class="release-artist">${r.artist}</p>
          <div class="release-row">
            <span class="release-price">${gbp(r.price)}</span>
            <span class="release-edition">${r.editionText}</span>
          </div>
          <button class="btn-primary release-add" data-add="${r.id}">Add to bag</button>
        </div>
      </div>
    `).join("");
  }
  renderReleases();

  filterTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-tab");
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    [...filterTabs.querySelectorAll(".filter-tab")].forEach((t) => t.classList.toggle("is-active", t === btn));
    renderReleases();
  });

  releasesGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const item = RELEASES.find((r) => r.id === btn.dataset.add);
    if (item) addToCart(item);
  });

  /* ---------- mobile menu ---------- */
  const mobileMenu = document.getElementById("mobile-menu");
  document.getElementById("menu-toggle").addEventListener("click", () => { mobileMenu.hidden = false; });
  document.getElementById("menu-close").addEventListener("click", () => { mobileMenu.hidden = true; });
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { mobileMenu.hidden = true; }));

  /* ---------- search ---------- */
  const searchOverlay = document.getElementById("search-overlay");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  function openSearch() {
    searchOverlay.hidden = false;
    searchInput.value = "";
    renderSearch("");
    searchInput.focus();
  }
  function closeSearch() { searchOverlay.hidden = true; }

  document.getElementById("search-toggle").addEventListener("click", openSearch);
  document.getElementById("search-close").addEventListener("click", closeSearch);
  searchInput.addEventListener("input", (e) => renderSearch(e.target.value));

  function renderSearch(rawQuery) {
    const query = rawQuery.toLowerCase().trim();
    const artists = query ? ARTISTS.filter((a) => a.name.toLowerCase().includes(query)) : ARTISTS;
    const releases = query ? RELEASES.filter((r) => r.title.toLowerCase().includes(query) || r.artist.toLowerCase().includes(query)) : RELEASES;
    const journal = query ? JOURNAL.filter((j) => j.title.toLowerCase().includes(query)) : JOURNAL;
    const hasResults = artists.length + releases.length + journal.length > 0;

    if (!hasResults) {
      searchResults.innerHTML = `<p class="search-empty">Nothing matches that search. Try an artist name, a piece, or a topic.</p>`;
      return;
    }

    let html = "";
    if (artists.length) {
      html += `<div><p class="eyebrow search-group-title">Artists</p>` +
        artists.map((a) => `
          <a href="#artists" class="search-row" data-close-search>
            <span class="search-row-title">${a.name}</span>
            <span class="search-row-meta">${a.tag}</span>
          </a>`).join("") + `</div>`;
    }
    if (releases.length) {
      html += `<div><p class="eyebrow search-group-title">Editions</p>` +
        releases.map((r) => `
          <a href="#editions" class="search-row" data-close-search>
            <span class="search-row-title">${r.title}</span>
            <span class="search-row-meta">${r.artist}, ${gbp(r.price)}</span>
          </a>`).join("") + `</div>`;
    }
    if (journal.length) {
      html += `<div><p class="eyebrow search-group-title">Journal</p>` +
        journal.map((j) => `
          <a href="#journal" class="search-row" data-close-search>
            <span class="search-row-title">${j.title}</span>
          </a>`).join("") + `</div>`;
    }
    searchResults.innerHTML = html;
  }

  searchResults.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-search]")) closeSearch();
  });

  /* ---------- cart, persisted in localStorage ---------- */
  const CART_KEY = "artiscope-cart";
  const cartBackdrop = document.getElementById("cart-backdrop");
  const cartDrawer = document.getElementById("cart-drawer");
  const cartBody = document.getElementById("cart-body");
  const cartFoot = document.getElementById("cart-foot");
  const cartSubtotalEl = document.getElementById("cart-subtotal");
  const cartBadge = document.getElementById("cart-badge");

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (err) {
      return [];
    }
  }
  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  let cart = loadCart();

  function openCart() { cartBackdrop.hidden = false; cartDrawer.hidden = false; }
  function closeCart() { cartBackdrop.hidden = true; cartDrawer.hidden = true; }

  document.getElementById("cart-toggle").addEventListener("click", () => {
    if (cartDrawer.hidden) openCart(); else closeCart();
  });
  document.getElementById("cart-close").addEventListener("click", closeCart);
  cartBackdrop.addEventListener("click", closeCart);

  function addToCart(item) {
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: item.id, title: item.title, artist: item.artist, price: item.price, gradient: item.gradient, qty: 1 });
    }
    saveCart(cart);
    renderCart();
    openCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((i) => i.id !== id);
    saveCart(cart);
    renderCart();
  }

  function renderCart() {
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    cartBadge.hidden = count === 0;
    cartBadge.textContent = String(count);

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <p>Your bag is empty.</p>
          <a href="#editions" class="btn-ghost" data-close-cart>Browse new releases</a>
        </div>`;
      cartFoot.hidden = true;
      return;
    }

    cartBody.innerHTML = cart.map((i) => `
      <div class="cart-item">
        <div class="cart-item-thumb" style="background:${i.gradient}"></div>
        <div class="cart-item-body">
          <p class="cart-item-title">${i.title}</p>
          <p class="cart-item-artist">${i.artist}</p>
          <div class="cart-item-row">
            <span>Qty ${i.qty}</span>
            <span>${gbp(i.price)}</span>
          </div>
        </div>
        <button class="cart-remove" aria-label="Remove item" data-remove="${i.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="4" x2="20" y2="20"></line><line x1="20" y1="4" x2="4" y2="20"></line></svg>
        </button>
      </div>
    `).join("");

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    cartSubtotalEl.textContent = gbp(subtotal);
    cartFoot.hidden = false;
  }

  cartBody.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) removeFromCart(removeBtn.dataset.remove);
    if (e.target.closest("[data-close-cart]")) closeCart();
  });

  document.getElementById("checkout-btn").addEventListener("click", () => {
    alert("This is a prototype, checkout is not connected to real payments yet.");
  });

  renderCart();

  /* ---------- newsletter (front end only, no backend yet) ---------- */
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterSuccess = document.getElementById("newsletter-success");
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsletterForm.hidden = true;
    newsletterSuccess.hidden = false;
  });
})();
