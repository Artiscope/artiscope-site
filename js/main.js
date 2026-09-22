(function () {
  "use strict";

  const gbp = (n) => "\u00a3" + n.toLocaleString("en-GB");
  const domainOf = (url) => new URL(url).hostname.replace(/^www\./, "");

  /* ---------- render: artists ---------- */
  const artistsGrid = document.getElementById("artists-grid");
  artistsGrid.innerHTML = ARTISTS.map((a) => {
    const inner = `
      <div class="artist-image" style="background:${a.gradient}">${a.url ? "[Signature piece]" : ""}</div>
      <div>
        <h3 class="artist-name">${a.name}</h3>
        <p class="artist-tag">${a.tag}</p>
        ${a.url ? "" : '<span class="coming-soon-badge" style="color:#6B6B6B;">Store coming soon</span>'}
      </div>`;
    return a.url
      ? `<a href="${a.url}" class="artist-card" target="_blank" rel="noopener">${inner}</a>`
      : `<div class="artist-card is-disabled">${inner}</div>`;
  }).join("");

  /* ---------- render: releases ---------- */
  const releasesGrid = document.getElementById("releases-grid");
  releasesGrid.innerHTML = RELEASES.map((r) => {
    if (r.kind === "featured") {
      return `
        <div class="release-card">
          <div class="release-image" style="background:${r.gradient}"></div>
          <div>
            <p class="release-title">${r.title}</p>
            <p class="release-artist">${r.artist}</p>
            <div class="release-row">
              <span class="release-price">${gbp(r.price)}</span>
            </div>
            <a href="${r.url}" class="btn-primary release-add" target="_blank" rel="noopener">Shop this piece</a>
            <span class="release-external">on ${domainOf(r.url)}</span>
          </div>
        </div>`;
    }
    return `
      <div class="release-card">
        <div class="release-image" style="background:${r.gradient}"></div>
        <div>
          <p class="release-title">${r.artist}</p>
          <p class="release-artist">${r.message}</p>
          <a href="${r.url}" class="btn-primary release-add" target="_blank" rel="noopener">Visit ${r.artist}</a>
          <span class="release-external">on ${domainOf(r.url)}</span>
        </div>
      </div>`;
  }).join("");

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

  function releaseLabel(r) { return r.kind === "featured" ? r.title : r.artist + " new release"; }
  function releaseMeta(r) { return r.kind === "featured" ? `${r.artist}, ${gbp(r.price)}` : r.message; }

  function renderSearch(rawQuery) {
    const query = rawQuery.toLowerCase().trim();
    const artists = query ? ARTISTS.filter((a) => a.name.toLowerCase().includes(query)) : ARTISTS;
    const releases = query
      ? RELEASES.filter((r) => releaseLabel(r).toLowerCase().includes(query) || r.artist.toLowerCase().includes(query))
      : RELEASES;
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
          <a href="${a.url || '#artists'}" class="search-row" ${a.url ? 'target="_blank" rel="noopener"' : 'data-close-search'}>
            <span class="search-row-title">${a.name}</span>
            <span class="search-row-meta">${a.url ? a.tag : "Store coming soon"}</span>
          </a>`).join("") + `</div>`;
    }
    if (releases.length) {
      html += `<div><p class="eyebrow search-group-title">New releases</p>` +
        releases.map((r) => `
          <a href="${r.url}" class="search-row" target="_blank" rel="noopener">
            <span class="search-row-title">${releaseLabel(r)}</span>
            <span class="search-row-meta">${releaseMeta(r)}</span>
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

  /* ---------- newsletter (front end only, no backend yet) ---------- */
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterSuccess = document.getElementById("newsletter-success");
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsletterForm.hidden = true;
    newsletterSuccess.hidden = false;
  });
})();
