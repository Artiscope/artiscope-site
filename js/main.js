(function () {
  "use strict";

  const gbp = (n) => "£" + n.toLocaleString("en-GB");
  const domainOf = (url) => new URL(url).hostname.replace(/^www\./, "");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /*
    Every page loads this same script. Each block below only runs when the
    page has the element it renders into, so pages opt in by markup alone.
  */

  /* ---------- artist cards (artists.html) ---------- */
  const artistsGrid = document.getElementById("artists-grid");
  if (artistsGrid) {
    artistsGrid.innerHTML = ARTISTS.map((a, i) => {
      const isDarkBg = a.navTheme === "light"; // a "light" nav theme means the artist's background is dark
      const textColor = isDarkBg ? "#FFFFFF" : "#0A0A0A";
      const btnBg = isDarkBg ? "#FFFFFF" : "#0A0A0A";
      const btnColor = isDarkBg ? "#0A0A0A" : "#FFFFFF";
      const logo = a.logoBadge
        ? `<img src="${a.logoBadge}" alt="${a.name} logo" class="artist-logo-large">`
        : `<h2 class="artist-name-large">${a.name}</h2>`;
      const cta = a.url
        ? `<a href="${a.url}" class="btn-primary" style="background:${btnBg}; color:${btnColor};" target="_blank" rel="noopener">Visit ${domainOf(a.url)}</a>`
        : `<span class="coming-soon-badge">Store coming soon</span>`;
      const cardStyle = a.bgImage ? `color:${textColor};` : `background:${a.bg}; color:${textColor};`;
      const photo = a.bgImage
        ? `<div class="artist-card-photo kenburns" style="background-image:url('${a.bgImage}');" aria-hidden="true"></div>`
        : "";

      return `
        <article class="artist-card${a.bgImage ? " artist-card-has-photo" : ""} reveal" id="${a.id}" style="${cardStyle} transition-delay:${(i % 3) * 90}ms;">
          ${photo}
          <div class="artist-card-inner">
            ${logo}
            <p class="artist-tag-large">${a.tag}</p>
            <div class="artist-cta">${cta}</div>
          </div>
        </article>`;
    }).join("");
  }

  /* ---------- works grid (work.html) ---------- */
  const worksGrid = document.getElementById("works-grid");
  if (worksGrid) {
    // Empty slots that show how the grid fills out as more pieces arrive.
    const placeholderCount = Math.max(0, 8 - WORKS.length);
    const cards = WORKS.map((w) => {
      const priceText = w.price != null ? gbp(w.price) : (w.priceLabel || "");
      const media = w.photo
        ? `<img src="${w.photo}" alt="${w.title} by ${w.artist}" class="work-photo kenburns" loading="lazy">`
        : "";
      return (delay) => `
        <a href="${w.url}" class="work-card reveal" style="transition-delay:${delay}ms;" target="_blank" rel="noopener">
          <div class="work-image" style="background:${w.image}">${media}</div>
          <div>
            <p class="work-title">${w.title}</p>
            <p class="work-artist">${w.artist}</p>
            <div class="work-row">
              <span class="work-price">${priceText}</span>
            </div>
            <span class="work-link">View on ${domainOf(w.url)}</span>
          </div>
        </a>`;
    });
    for (let i = 0; i < placeholderCount; i++) {
      cards.push((delay) => `
        <div class="work-card work-card-placeholder reveal" style="transition-delay:${delay}ms;" aria-hidden="true">
          <div class="work-image"><span class="placeholder-note">Placeholder</span></div>
          <div>
            <p class="work-title">Future piece</p>
            <p class="work-artist">Artist to be announced</p>
          </div>
        </div>`);
    }
    worksGrid.innerHTML = cards.map((card, i) => card((i % 4) * 90)).join("");
  }

  /* ---------- journal (journal.html) ---------- */
  const journalMount = document.getElementById("journal-list");
  if (journalMount) {
    const posts = JOURNAL.map((j) => `
      <article class="editorial-split journal-feature reveal">
        <div class="editorial-image"></div>
        <div class="editorial-copy">
          ${j.kicker ? `<p class="eyebrow">${j.kicker}</p>` : ""}
          <h2 class="display-3">${j.title}</h2>
          ${j.excerpt ? `<p>${j.excerpt}</p>` : ""}
          ${j.url ? `<a href="${j.url}" class="btn-ghost" target="_blank" rel="noopener">Visit ${domainOf(j.url)}</a>` : ""}
        </div>
      </article>`).join("");

    // Upcoming slots, clearly marked until real posts replace them.
    const upcoming = ["Upcoming release", "Artist interview", "Studio visit"].map((kind) => `
      <li class="journal-row reveal">
        <span class="journal-row-kind">${kind}</span>
        <span class="journal-row-title">Title to come</span>
        <span class="placeholder-note">Placeholder</span>
      </li>`).join("");

    journalMount.innerHTML = `
      ${posts}
      <div class="journal-upcoming">
        <p class="eyebrow">Coming up</p>
        <ul class="journal-rows">${upcoming}</ul>
      </div>`;
  }

  /* ---------- featured artwork slideshow (index.html) ---------- */
  const featured = document.getElementById("featured");
  if (featured && FEATURED.length) {
    const label = document.getElementById("featured-label");
    const multiple = FEATURED.length > 1;
    const slides = FEATURED.map((f, i) => {
      const slide = document.createElement("figure");
      slide.className = "featured-slide" + (i === 0 ? " is-active" : "");
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", `${i + 1} of ${FEATURED.length}`);
      slide.setAttribute("aria-hidden", i === 0 ? "false" : "true");
      slide.innerHTML = `<img src="${f.image}" alt="${f.alt}" class="kenburns"${f.position ? ` style="object-position:${f.position};"` : ""}${i === 0 ? "" : ' loading="lazy"'}>`;
      featured.insertBefore(slide, label);
      return slide;
    });

    let current = 0;
    let dots = [];
    const show = (i) => {
      slides[current].classList.remove("is-active");
      slides[current].setAttribute("aria-hidden", "true");
      if (dots.length) dots[current].removeAttribute("aria-current");
      current = (i + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      slides[current].setAttribute("aria-hidden", "false");
      if (dots.length) dots[current].setAttribute("aria-current", "true");
      const artist = FEATURED[current].artist;
      label.innerHTML = artist
        ? `<span class="featured-prefix">Featured artwork \u00b7 </span>${artist}`
        : "Featured artwork";
    };

    if (multiple) {
      // Autoplay, holding while the pointer or focus is on the slideshow,
      // while the tab is hidden, or while the visitor has paused it.
      // Starts paused for visitors who prefer reduced motion.
      const controls = document.createElement("div");
      controls.className = "featured-controls";
      controls.innerHTML =
        FEATURED.map((_, i) => `<button type="button" class="featured-dot" aria-label="Show artwork ${i + 1}"></button>`).join("") +
        `<button type="button" class="featured-toggle"></button>`;
      featured.appendChild(controls);
      dots = Array.from(controls.querySelectorAll(".featured-dot"));
      const toggle = controls.querySelector(".featured-toggle");

      let paused = reducedMotion.matches;
      let held = false;
      let timer = 0;
      const INTERVAL = 5000;
      const schedule = () => {
        clearInterval(timer);
        if (!paused && !held && !document.hidden) timer = setInterval(() => show(current + 1), INTERVAL);
      };
      const renderToggle = () => {
        toggle.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
        toggle.innerHTML = paused
          ? `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>`
          : `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="2" y="1" width="3" height="10"/><rect x="7" y="1" width="3" height="10"/></svg>`;
      };

      dots.forEach((dot, i) => dot.addEventListener("click", () => { show(i); schedule(); }));
      toggle.addEventListener("click", () => { paused = !paused; renderToggle(); schedule(); });
      featured.addEventListener("mouseenter", () => { held = true; schedule(); });
      featured.addEventListener("mouseleave", () => { held = false; schedule(); });
      featured.addEventListener("focusin", () => { held = true; schedule(); });
      featured.addEventListener("focusout", (e) => {
        if (!featured.contains(e.relatedTarget)) { held = false; schedule(); }
      });
      document.addEventListener("visibilitychange", schedule);

      renderToggle();
      schedule();
    }
    show(0);
  }

  /* ---------- homepage explore counts ---------- */
  const counts = { artists: ARTISTS.length, work: WORKS.length, journal: JOURNAL.length };
  document.querySelectorAll("[data-count]").forEach((el) => {
    el.textContent = String(counts[el.dataset.count]).padStart(2, "0");
  });

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
  // Match the nav to whichever section is directly behind it, so short
  // page headers get the right colour too.
  const nav = document.getElementById("site-nav");
  const themedSections = Array.from(document.querySelectorAll("[data-nav-theme]"));
  let navFrame = 0;
  function updateNavTheme() {
    navFrame = 0;
    const probe = nav.offsetHeight / 2;
    const current = themedSections.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= probe && r.bottom > probe;
    });
    if (current) nav.dataset.theme = current.dataset.navTheme;
  }
  const queueNavTheme = () => { if (!navFrame) navFrame = requestAnimationFrame(updateNavTheme); };
  window.addEventListener("scroll", queueNavTheme, { passive: true });
  window.addEventListener("resize", queueNavTheme);
  updateNavTheme();

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
          <a href="${a.url || "artists.html#" + a.id}" class="search-row" ${a.url ? 'target="_blank" rel="noopener"' : "data-close-search"}>
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
          <a href="journal.html" class="search-row" data-close-search>
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
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      newsletterForm.hidden = true;
      newsletterSuccess.hidden = false;
    });
  }

  /* ---------- contact form (about.html) ---------- */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const contactStatus = document.getElementById("contact-status");
    const connected = Boolean(CONTACT.email);
    document.getElementById("contact-unconnected").hidden = connected;

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const invalid = contactForm.querySelector(":invalid");
      if (invalid) {
        contactStatus.textContent = invalid.type === "email" && invalid.value
          ? "Please check your email address."
          : `Please fill in ${invalid.labels[0].textContent.toLowerCase()}.`;
        invalid.focus();
        return;
      }
      if (!connected) {
        contactStatus.textContent = "This form isn't connected yet, so nothing was sent.";
        return;
      }
      const data = new FormData(contactForm);
      const body = [
        data.get("message"),
        "",
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        data.get("phone") ? `Phone: ${data.get("phone")}` : ""
      ].join("\n").trim();
      const subject = `Message from ${data.get("name")}`;
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      contactStatus.textContent = "Your email app should open with the message ready to send.";
    });
  }

  /* ---------- transition veil on external links ---------- */
  // External links open in a new tab, so the veil is a brief fade to black
  // naming where you're headed, then lifts again behind the new tab.
  const veil = document.createElement("div");
  veil.className = "veil";
  veil.setAttribute("aria-hidden", "true");
  veil.innerHTML = `<p class="veil-text"></p>`;
  document.body.appendChild(veil);
  let veilTimer = 0;

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!/^https?:$/.test(link.protocol) || link.host === location.host) return;
    if (reducedMotion.matches) return;
    veil.firstElementChild.textContent = "Opening " + domainOf(link.href);
    veil.classList.add("is-on");
    clearTimeout(veilTimer);
    veilTimer = setTimeout(() => veil.classList.remove("is-on"), 900);
  });
  window.addEventListener("pageshow", () => veil.classList.remove("is-on"));
})();
