(function () {
  "use strict";

  const gbp = (n) => "\u00a3" + n.toLocaleString("en-GB");
  const domainOf = (url) => new URL(url).hostname.replace(/^www\./, "");

  /* ---------- build artist chapters ---------- */
  const artistsMount = document.getElementById("artists");
  const artistSections = ARTISTS.map((a) => {
    const isDarkBg = a.navTheme === "light"; // a "light" nav theme means the section behind it is dark
    const textColor = isDarkBg ? "#FFFFFF" : "#0A0A0A";
    const btnBg = isDarkBg ? "#FFFFFF" : "#0A0A0A";
    const btnColor = isDarkBg ? "#0A0A0A" : "#FFFFFF";
    const logo = a.logoBadge
      ? `<img src="${a.logoBadge}" alt="${a.name} logo" class="artist-logo-large">`
      : `<h2 class="artist-name-large">${a.name}</h2>`;
    const cta = a.url
      ? `<a href="${a.url}" class="btn-primary" style="background:${btnBg}; color:${btnColor};" target="_blank" rel="noopener">Visit ${domainOf(a.url)}</a>`
      : `<span class="coming-soon-badge">Store coming soon</span>`;

    return `
      <section class="chapter artist-chapter" data-nav-theme="${a.navTheme}" style="background:${a.bg}; color:${textColor};">
        <div class="artist-chapter-inner reveal">
          ${logo}
          <p class="artist-tag-large">${a.tag}</p>
          <div class="artist-cta">${cta}</div>
        </div>
      </section>`;
  }).join("");
  artistsMount.outerHTML = artistSections;

  /* ---------- build works grid ---------- */
  const worksGrid = document.getElementById("works-grid");
  worksGrid.innerHTML = WORKS.map((w) => {
    const priceText = w.price != null ? gbp(w.price) : (w.priceLabel || "");
    return `
      <a href="${w.url}" class="work-card" target="_blank" rel="noopener">
        <div class="work-image" style="background:${w.image}"></div>
        <div>
          <p class="work-title">${w.title}</p>
          <p class="work-artist">${w.artist}</p>
          <div class="work-row">
            <span class="work-price">${priceText}</span>
          </div>
          <span class="work-link">View on ${domainOf(w.url)}</span>
        </div>
      </a>`;
  }).join("");

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- adaptive nav colour ---------- */
  const nav = document.getElementById("site-nav");
  const themedSections = document.querySelectorAll("[data-nav-theme]");
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        nav.dataset.theme = entry.target.dataset.navTheme;
      }
    });
  }, { rootMargin: "-50% 0px -50% 0px" });
  themedSections.forEach((s) => navObserver.observe(s));

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
    const works = query
      ? WORKS.filter((w) => w.title.toLowerCase().includes(query) || w.artist.toLowerCase().includes(query))
      : WORKS;
    const journal = query ? JOURNAL.filter((j) => j.title.toLowerCase().includes(query)) : JOURNAL;
    const hasResults = artists.length + works.length + journal.length > 0;

    if (!hasResults) {
      searchResults.innerHTML = `<p class="search-empty">Nothing matches that search. Try an artist name, a piece, or a topic.</p>`;
      return;
    }

    let html = "";
    if (artists.length) {
      html += `<div><p class="eyebrow search-group-title">Artists</p>` +
        artists.map((a) => `
          <a href="${a.url || '#artists'}" class="search-row" ${a.url ? 'target="_blank" rel="noopener"' : 'data-close-search'}>
            <span class="search-row-title">${a.name}</span>
            <span class="search-row-meta">${a.url ? a.tag : "Store coming soon"}</span>
          </a>`).join("") + `</div>`;
    }
    if (works.length) {
      html += `<div><p class="eyebrow search-group-title">Work</p>` +
        works.map((w) => `
          <a href="${w.url}" class="search-row" target="_blank" rel="noopener">
            <span class="search-row-title">${w.title}</span>
            <span class="search-row-meta">${w.artist}${w.price != null ? ", " + gbp(w.price) : ""}</span>
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

  /* ---------- newsletter ---------- */
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterSuccess = document.getElementById("newsletter-success");
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsletterForm.hidden = true;
    newsletterSuccess.hidden = false;
  });
})();
