const $ = (id) => document.getElementById(id);
const accents = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const page = document.body.dataset.page;

const icons = {
  github: '<svg viewBox="0 0 24 24"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24"><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.5V9h3.6v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z"/></svg>',
  email: '<svg viewBox="0 0 24 24"><path d="M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm10 8.2L3.5 6.5v.1L12 13l8.5-6.4v-.1L12 12.2z"/></svg>',
};

function socialsHTML() {
  const links = Object.entries(SITE.socials)
    .filter(([, url]) => url)
    .map(([k, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${k}">${icons[k] || k}</a>`);
  links.push(`<a href="mailto:${esc(SITE.email)}" aria-label="email">${icons.email}</a>`);
  return links.join("");
}
// skill icons: tech logos from Devicon, concept icons from Tabler (both MIT); drawn as a mask in the group's color.
// A skill that isn't listed here gets a generic code icon, so new skills in data.js still render.
const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";
const TABLER = "https://cdn.jsdelivr.net/npm/@tabler/icons@3.24.0/icons/outline/";
const skillIcons = {
  "Python": "python/python-plain", "C++": "cplusplus/cplusplus-plain", "C": "c/c-plain", "Java": "java/java-plain",
  "JavaScript": "javascript/javascript-plain", "React": "react/react-original", "Node.js/Express": "nodejs/nodejs-plain",
  "MongoDB": "mongodb/mongodb-plain", "Git": "git/git-plain", "Docker": "docker/docker-plain", "CMake": "cmake/cmake-plain",
  "Linux": "linux/linux-plain", "Grafana": "grafana/grafana-plain",
  "REST APIs": "t:api", "JWT": "t:key", "OOP": "t:box-model-2", "Data Structures & Algorithms": "t:binary-tree",
  "GoogleTest": "t:test-pipe", "Unit testing": "t:checklist", "Machine Learning": "t:brain",
  "Neural networks": "t:topology-star-3", "Claude Code": "t:sparkles", "AI-assisted dev": "t:robot",
  "TCP/IP": "t:network", "Zabbix": "t:activity-heartbeat", "Incident triage": "t:alert-triangle",
  "Production troubleshooting": "t:bug",
};
const skillIcon = (name) => {
  const k = skillIcons[name] || "t:code";
  return k.startsWith("t:") ? `${TABLER}${k.slice(2)}.svg` : `${DEVICON}${k}.svg`;
};
const chips = (items) => `<div class="chips">${items.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>`;
// muted looping demo clip; started from JS (see startDemoVideos) since mobile browsers often ignore autoplay
const demoVideo = (v, title, onPage = false, attrs = "") => `
  <video ${attrs} src="${esc(onPage ? v.src : v.card || v.src)}" poster="${esc(v.poster)}" muted loop playsinline autoplay preload="auto"
    ${onPage ? "controls" : ""} ${!onPage && v.fit === "contain" ? `class="fit-contain" style="background:${esc(v.bg || "#000")}"` : ""}
    aria-label="${esc(title)} demo video"></video>`;

// play demo videos while on screen, pause them off screen; if the browser blocks autoplay
// (e.g. iOS Low Power Mode) mark the cover so a single tap starts it
function startDemoVideos() {
  const videos = document.querySelectorAll("video[autoplay]");
  const tryPlay = (v) => {
    v.muted = true;
    const p = v.play();
    if (p) p.then(() => v.parentElement.classList.remove("needs-tap"))
            .catch(() => v.parentElement.classList.add("needs-tap"));
  };
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) tryPlay(e.target); else e.target.pause();
  }), { threshold: 0.25 });
  videos.forEach((v) => {
    io.observe(v);
    // hide the tap mark as soon as frames actually play (more reliable on iOS than the play() promise)
    v.addEventListener("playing", () => v.parentElement.classList.remove("needs-tap"));
    // tapping a card clip opens the screenshots (see renderHome); also start it if autoplay was blocked
    if (!v.controls) v.addEventListener("click", () => { if (v.paused) tryPlay(v); });
  });
}
const shotsLabel = (images) => `▣ ${images.length} screenshot${images.length > 1 ? "s" : ""}`;
const list = (items, cls = "") => `<ul class="bullets ${cls}">${items.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;

// ---------- shared: header, footer ----------
const initials = SITE.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
$("logo").textContent = initials;
$("footName").textContent = SITE.name;
$("year").textContent = new Date().getFullYear();

// ---------- home page ----------
function renderHome() {
  document.title = `${SITE.name} - ${SITE.role}`;
  $("name").textContent = SITE.name;
  $("tagline").textContent = SITE.tagline;
  $("avatar").innerHTML = SITE.photo ? `<img src="${esc(SITE.photo)}" alt="${esc(SITE.name)}">` : initials;
  $("cvBtn").href = SITE.cvFile;
  $("mailBtn").href = `mailto:${SITE.email}`;
  $("mailBtn").textContent = SITE.email;
  $("heroSocials").innerHTML = $("footSocials").innerHTML = socialsHTML();

  $("aboutText").innerHTML = SITE.about.map((p, i) => `<p style="--i:${i}">${esc(p)}</p>`).join("");
  const groupOf = {};
  Object.entries(SITE.skills).forEach(([, items], i) => items.forEach((s) => (groupOf[s] = i)));
  const logos = Object.keys(groupOf).filter((s) => skillIcons[s] && !skillIcons[s].startsWith("t:"));
  const inner = logos.filter((s) => groupOf[s] === 0), outer = logos.filter((s) => groupOf[s] !== 0);
  const ring = (list, cls, R, dur, k0) => `
    <div class="ring ${cls}" style="--dur:${dur}s; --R:${R}cqw">${list.map((s, i) => `
      <div class="orb" style="--a:${(360 / list.length) * i}deg; --R:${R}cqw; --k:${k0 + i}; --accent:${accents[groupOf[s] % 4]}">
        <span class="orb-tile" data-name="${esc(s)}"><span class="skill-icon" style="--glyph:url('${skillIcon(s)}')"></span></span>
      </div>`).join("")}
    </div>`;
  $("orbit").innerHTML = `<div class="orbit-core">&lt;/&gt;</div>${ring(inner, "r1", 24, 60, 0)}${ring(outer, "r2", 43, 90, inner.length)}`;

  cvGame($("cvBtn"));

  $("skillGrid").innerHTML = Object.entries(SITE.skills).map(([group, items], i) => `
    <div class="skill-group" style="--accent:${accents[i % 4]}; --i:${i}">
      <h4>${esc(group)}</h4>
      <ul class="skill-list">${items.map((s) => `
        <li class="skill" data-skill="${esc(s)}"><span class="skill-icon" style="--glyph:url('${skillIcon(s)}')" aria-hidden="true"></span>${esc(s)}</li>`).join("")}
      </ul>
    </div>`).join("");
  skillsIntro();

  $("projectGrid").innerHTML = SITE.projects.map((p, i) => `
    <article class="card" style="--accent:${accents[i % 4]}; --i:${i}">
      ${p.video
        // clicking the clip (or the badge) opens the project's screenshots
        ? p.images && p.images.length
          ? `<div class="thumb has-video" data-cursor="view" data-project="${i}" role="button" tabindex="0" aria-label="View ${esc(p.title)} screenshots">
               ${demoVideo(p.video, p.title)}
             </div>`
          : `<div class="thumb has-video">${demoVideo(p.video, p.title)}</div>`
        : p.images && p.images.length
        ? `<button class="thumb" data-project="${i}" data-cursor="view" aria-label="View ${esc(p.title)} screenshots">
             <img src="${esc(p.images[0].src)}" alt="${esc(p.images[0].caption)}" loading="lazy">
             <span class="count">${shotsLabel(p.images)}</span>
           </button>`
        : `<div class="thumb">${esc(p.title[0])}</div>`}
      <div class="body">
        <h4>${esc(p.title)}</h4>
        ${list(p.bullets)}
        ${chips(p.tags)}
        <div class="actions">
          ${p.details ? `<a class="btn small primary" href="project.html?id=${esc(p.id)}">View project →</a>` : ""}
          ${p.github ? `<a class="btn small" href="${esc(p.github)}" target="_blank" rel="noopener">${icons.github} Code</a>` : ""}
          ${p.demo ? `<a class="btn small" href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo</a>` : ""}
        </div>
      </div>
    </article>`).join("");

  $("timeline").innerHTML = SITE.experience.map((e, i) => `
    <li style="--accent:${accents[i % 4]}; --i:${i}">
      <span class="when">${esc(e.when)}</span>
      <h4>${esc(e.title)}</h4>
      <div class="place">${esc(e.place)}</div>
      ${e.text ? `<p>${esc(e.text)}</p>` : ""}
      ${e.bullets ? list(e.bullets) : ""}
    </li>`).join("");

  document.querySelectorAll("[data-project]").forEach((btn) => {
    btn.onclick = () => openLightbox(SITE.projects[btn.dataset.project].images, 0);
    // the video cover is a div acting as a button, so give it the keyboard behavior too
    if (btn.tagName !== "BUTTON") btn.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); btn.onclick(); }
    };
  });

  $("role").textContent = SITE.role; // revealed by the CSS wipe (.role-wipe)
}


// skills intro: orbit first, then the logos fly into the group cards (once per visit to the page)
function skillsIntro() {
  const stage = $("skillsStage"), orbit = $("orbit");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { stage.classList.add("dispersed", "done"); return; }
  const io = new IntersectionObserver(([e]) => {
    if (e.intersectionRatio < 0.45) return;
    io.disconnect();
    orbit.classList.add("launched");
    setTimeout(disperse, 3200); // burst (~1.5s) plus a moment of orbiting
  }, { threshold: 0.45 });
  io.observe(orbit);

  function disperse() {
    const targets = new Map([...document.querySelectorAll("#skillGrid .skill")].map((li) => [li.dataset.skill, li.querySelector(".skill-icon")]));
    orbit.querySelectorAll(".orb-tile").forEach((tile, i) => {
      const icon = tile.querySelector(".skill-icon"), dest = targets.get(tile.dataset.name);
      if (!dest) return;
      const a = icon.getBoundingClientRect(), b = dest.getBoundingClientRect();
      if (!a.width || !b.width) return;
      // a copy of the logo travels in page coordinates, so scrolling mid-flight doesn't throw it off
      const fly = document.createElement("span");
      fly.className = "skill-icon fly";
      fly.style.cssText = `--glyph:${icon.style.getPropertyValue("--glyph")}; background:${getComputedStyle(icon).backgroundColor};
        left:${a.left + scrollX}px; top:${a.top + scrollY}px; width:${a.width}px; height:${a.height}px`;
      document.body.append(fly);
      dest.style.visibility = "hidden";
      fly.animate([
        { transform: "none" },
        { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${b.width / a.width})` },
      ], { duration: 950, delay: i * 45, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "both" })
        .finished.then(() => { dest.style.visibility = ""; fly.remove(); });
    });
    stage.classList.add("dispersed");
    setTimeout(() => stage.classList.add("done"), 1800);
  }
}

// ---------- project detail page ----------
function renderProject() {
  const id = new URLSearchParams(location.search).get("id");
  const idx = SITE.projects.findIndex((p) => p.id === id);
  const p = SITE.projects[idx];
  if (!p || !p.details) {
    $("project").innerHTML = `<p class="notfound">Project not found. <a href="index.html#projects">Back to projects →</a></p>`;
    return;
  }
  const d = p.details;
  document.title = `${p.title} - ${SITE.name}`;
  document.body.style.setProperty("--accent", accents[idx % 4]);

  const section = (n, title, html) => `
    <section class="p-section reveal"><h3 class="section-title"><span class="mono">${n}</span> ${title}</h3>${html}</section>`;

  const arch = `
    <p class="lead">${esc(d.architecture.text)}</p>
    <div class="arch">
      ${d.architecture.layers.map((row) => `
        <div class="arch-row">
          ${row.map((b) => `
            <div class="arch-box">
              <strong>${esc(b.name)}</strong>
              <span class="mono">${esc(b.tech)}</span>
              ${b.note ? `<small>${esc(b.note)}</small>` : ""}
            </div>`).join("")}
        </div>`).join('<div class="arch-arrow" aria-hidden="true">↓</div>')}
    </div>`;

  const challenges = `<div class="challenges">${d.challenges.map((c, i) => `
    <div class="challenge" style="--i:${i}">
      <div class="c-q"><span class="mono">#${i + 1}</span> ${esc(c.challenge)}</div>
      <div class="c-a"><span class="label">Solution</span>${esc(c.solution)}</div>
    </div>`).join("")}</div>`;

  const shots = `<div class="shots">${p.images.map((img, i) => `
    <figure style="--i:${i}"><button class="shot" data-i="${i}" aria-label="Enlarge: ${esc(img.caption)}"><img src="${esc(img.src)}" alt="${esc(img.caption)}" loading="lazy"></button>
    <figcaption>${esc(img.caption)}</figcaption></figure>`).join("")}</div>`;

  const links = `
    ${p.github ? `<a class="btn primary" href="${esc(p.github)}" target="_blank" rel="noopener">${icons.github} View code on GitHub</a>` : ""}
    ${p.demo ? `<a class="btn" href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo ↗</a>` : ""}`;

  $("project").innerHTML = `
    <a class="back" href="index.html#projects">← All projects</a>
    <header class="p-hero">
      <div class="meta">${d.meta.map((m) => `<span>${esc(m)}</span>`).join("")}</div>
      <h1>${esc(p.title)}</h1>
      ${chips(p.tags)}
      <div class="cta">${links}</div>
      ${p.video
        ? `<div class="p-cover p-video">${demoVideo(p.video, p.title, true)}</div>`
        : p.images.length ? `<button class="p-cover shot" data-i="0" aria-label="Enlarge screenshot"><img src="${esc(p.images[0].src)}" alt="${esc(p.images[0].caption)}"></button>` : ""}
    </header>
    ${section("01.", "The problem", `<p class="lead">${esc(d.problem)}</p>`)}
    ${section("02.", "My solution", `<p class="lead">${esc(d.solution)}</p>`)}
    ${section("03.", "Architecture", arch)}
    ${section("04.", "Key features", list(d.features, "features"))}
    ${section("05.", "Technical challenges", challenges)}
    ${section("06.", "Screenshots", shots)}
    <section class="p-section p-end reveal">
      <h3>Want to see how it works?</h3>
      <div class="cta">${links}</div>
      <a class="back" href="index.html#projects">← Back to all projects</a>
    </section>`;

  document.querySelectorAll(".shot").forEach((b) => b.onclick = () => openLightbox(p.images, +b.dataset.i));
}

// ---------- screenshot lightbox ----------
const lb = $("lightbox");
let lbImages = [], lbIndex = 0;
function showSlide(n, animate = true) {
  lbIndex = (n + lbImages.length) % lbImages.length;
  const img = lbImages[lbIndex];
  const el = $("lbImg");
  const apply = () => {
    el.src = img.src;
    el.alt = img.caption;
    $("lbCaption").textContent = `${img.caption}  ·  ${lbIndex + 1} / ${lbImages.length}`;
  };
  lb.classList.toggle("single", lbImages.length < 2);
  if (!animate) return apply();
  // blur-crossfade between slides so the swap reads as one motion
  el.classList.add("swap");
  setTimeout(() => {
    apply();
    const done = () => el.classList.remove("swap");
    el.decode ? el.decode().then(done, done) : done();
  }, 120);
}
function openLightbox(images, start) {
  lbImages = images;
  showSlide(start, false);
  lb.showModal();
}
$("lbPrev").onclick = () => showSlide(lbIndex - 1);
$("lbNext").onclick = () => showSlide(lbIndex + 1);
$("lbClose").onclick = () => lb.close();
lb.onclick = (e) => { if (e.target === lb) lb.close(); };
lb.onkeydown = (e) => {
  if (e.key === "ArrowLeft") showSlide(lbIndex - 1);
  if (e.key === "ArrowRight") showSlide(lbIndex + 1);
};

if (page === "project") renderProject(); else renderHome();
startDemoVideos();

// ---------- theme toggle (remembers choice; initial theme is set by the inline script in <head>) ----------
const root = document.documentElement;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
$("themeBtn").onclick = (e) => {
  const flip = () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch {}
  };
  if (!document.startViewTransition || reduceMotion) return flip();
  // the new theme spreads out in a circle from the toggle button
  const r = e.currentTarget.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.classList.add("theme-switching");
  const t = document.startViewTransition(flip);
  const clean = () => root.classList.remove("theme-switching");
  t.finished.then(clean, clean);
  t.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 550, easing: "cubic-bezier(0.77, 0, 0.175, 1)", pseudoElement: "::view-transition-new(root)" });
  }).catch(() => {}); // skipped transitions (e.g. hidden tab) still apply the theme via flip()
  t.finished.catch(() => {});
};

// ---------- mobile menu ----------
const navBar = document.querySelector(".nav");
const setMenu = (open) => {
  navBar.classList.toggle("open", open);
  $("menuBtn").setAttribute("aria-expanded", open);
  $("menuBtn").setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
$("menuBtn").onclick = () => setMenu(!navBar.classList.contains("open"));
$("siteNav").addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && navBar.classList.contains("open")) { setMenu(false); $("menuBtn").focus(); } });
document.addEventListener("click", (e) => { if (!navBar.contains(e.target)) setMenu(false); });

// ---------- nav: highlight the section currently on screen ----------
const navLinks = [...document.querySelectorAll("#siteNav a[href^='#']")];
if (navLinks.length) {
  const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
  }), { rootMargin: "-45% 0px -50% 0px" });
  navLinks.forEach((a) => { const s = document.querySelector(a.getAttribute("href")); if (s) spy.observe(s); });
}

// ---------- background: star tiles for the three space layers (drawn once, used as CSS background images) ----------
(function stars() {
  const tile = 512;
  const draw = (count, size, seed, dark) => {
    const c = document.createElement("canvas");
    c.width = c.height = tile;
    const x = c.getContext("2d");
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; // fixed seed: same sky every visit
    const tints = dark ? ["255,255,255", "255,255,255", "255,214,236", "205,195,255", "190,250,240"]
                       : ["123,92,255", "255,93,143", "24,170,150", "110,100,160"];
    for (let i = 0; i < count; i++) {
      const r = size * (0.5 + rnd());
      x.fillStyle = `rgba(${tints[(rnd() * tints.length) | 0]},${dark ? 0.45 + rnd() * 0.55 : 0.2 + rnd() * 0.3})`;
      x.beginPath(); x.arc(rnd() * tile, rnd() * tile, r, 0, Math.PI * 2); x.fill();
    }
    return `url(${c.toDataURL()})`;
  };
  // the tiles are cached for the visit so moving between pages doesn't redraw six canvases on load
  let cache = null;
  try { cache = JSON.parse(sessionStorage.getItem("star-tiles") || "null"); } catch {}
  if (!cache) {
    cache = {};
    [[120, 0.55, 11], [55, 0.95, 23], [18, 1.6, 37]].forEach(([n, size, seed], i) => {
      cache[`--stars${i + 1}-d`] = draw(n, size, seed, true);
      cache[`--stars${i + 1}-l`] = draw(n, size * 1.3, seed, false);
    });
    try { sessionStorage.setItem("star-tiles", JSON.stringify(cache)); } catch {}
  }
  Object.entries(cache).forEach(([k, v]) => root.style.setProperty(k, v));
})();

const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
if (finePointer && !reduceMotion) {
  // ---------- project cards: tilt toward the pointer + spotlight ----------
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
      card.style.setProperty("--ry", `${(px - 0.5) * 8}deg`);
      card.style.setProperty("--rx", `${(0.5 - py) * 6}deg`);
    });
    card.addEventListener("pointerleave", () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
  });

  // ---------- magnetic buttons: main actions lean toward the pointer ----------
  document.querySelectorAll(".cta .btn, .btn.big").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.25}px ${(e.clientY - r.top - r.height / 2) * 0.35}px`;
      btn.style.setProperty("--px", `${((e.clientX - r.left) / r.width) * 100}%`);
    });
    btn.addEventListener("pointerleave", () => { btn.style.translate = ""; });
  });

  // ---------- cursor: a trail of tech icons, plus a "View" label over project videos ----------
  const label = document.querySelector(".cursor-label");
  const trailIcons = Object.values(skillIcons).filter((k) => !k.startsWith("t:")).map((k) => `${DEVICON}${k}.svg`);
  const pool = Array.from({ length: 14 }, () => {
    const s = document.createElement("span");
    s.className = "trail-icon";
    document.body.append(s);
    return s;
  });
  let last = null, n = 0;
  document.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const view = e.target.closest?.("[data-cursor='view']");
    if (label) { label.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; label.classList.toggle("on", !!view); }
    if (view || lb.open) { last = null; return; } // keep the trail out of the way of the video and the gallery
    if (!last) { last = [e.clientX, e.clientY]; return; }
    if (Math.hypot(e.clientX - last[0], e.clientY - last[1]) < 70) return;
    last = [e.clientX, e.clientY];
    const el = pool[n % pool.length], x = e.clientX, y = e.clientY;
    el.style.setProperty("--glyph", `url('${trailIcons[n % trailIcons.length]}')`);
    el.style.background = accents[n % 4];
    n++;
    el.getAnimations().forEach((a) => a.cancel());
    const dx = (Math.random() - 0.5) * 36, dy = 16 + Math.random() * 18, rot = (Math.random() - 0.5) * 50;
    el.animate([
      { transform: `translate(${x}px, ${y}px) scale(.4)`, opacity: 0 },
      { transform: `translate(${x}px, ${y}px) scale(1) rotate(${rot / 2}deg)`, opacity: 0.9, offset: 0.2 },
      { transform: `translate(${x + dx}px, ${y + dy}px) scale(.6) rotate(${rot}deg)`, opacity: 0 },
    ], { duration: 900, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" });
  });
  document.documentElement.addEventListener("pointerleave", () => label && label.classList.remove("on"));
}

// ---------- page change: a jump to hyperspace between the home page and project pages ----------
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a || a.target === "_blank" || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.pathname === location.pathname || reduceMotion) return; // same page: plain anchor scroll
  e.preventDefault();
  try { sessionStorage.setItem("warp", "1"); } catch {}
  root.classList.add("warping");
  setTimeout(() => { location.href = url.href; }, 420);
});
// arrival: let the first frame paint stretched, then drop out of hyperspace
if (root.classList.contains("warp-in")) requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("warp-in")));
// coming back with the browser's back button can restore the page mid-jump
addEventListener("pageshow", () => root.classList.remove("warping", "warp-in"));

// ---------- CV download as a basketball shot ----------
function cvGame(btn) {
  if (!btn) return;
  let game;
  btn.addEventListener("click", (e) => {
    if (reduceMotion || e.metaKey || e.ctrlKey || e.shiftKey) return; // plain download / new tab
    e.preventDefault();
    if (game && game.classList.contains("on")) return;
    if (!game) {
      game = document.createElement("div");
      game.className = "hoop-game";
      game.setAttribute("aria-hidden", "true");
      game.innerHTML = `<div class="hoop"><span class="swish">Swish!</span><div class="board"></div><div class="rim"></div><div class="net"></div></div><span class="cv-ball">CV</span>`;
      document.body.append(game);
    }
    let shots = 0;
    try { shots = +localStorage.getItem("cv-shots") || 0; localStorage.setItem("cv-shots", ++shots); } catch { shots = 1; }
    game.querySelector(".board").textContent = `SCORE ${shots}`;
    const b = btn.getBoundingClientRect();
    const x0 = b.left + b.width / 2, y0 = b.top + b.height / 2;
    const hx = Math.min(innerWidth - 80, Math.max(80, b.right + 280)), hy = Math.max(80, b.top - 150);
    const hoop = game.querySelector(".hoop");
    hoop.style.left = `${hx}px`; hoop.style.top = `${hy}px`;
    game.classList.add("on");
    const rimY = hy + 78, ball = game.querySelector(".cv-ball");
    const at = (x, y, r) => `translate(${x}px, ${y}px) rotate(${r}deg)`;
    hoop.animate([{ opacity: 0, transform: "scale(.8)" }, { opacity: 1, transform: "none" }], { duration: 250, easing: "ease-out", fill: "both" });
    ball.animate([
      { transform: at(x0, y0, 0), offset: 0 },
      { transform: at((x0 + hx) / 2, Math.min(y0, hy) - 90, -200), offset: 0.5 },
      { transform: at(hx, rimY - 14, -340), offset: 0.82 },
      { transform: at(hx, rimY + 46, -380), opacity: 1, offset: 0.95 },
      { transform: at(hx, rimY + 70, -390), opacity: 0 },
    ], { duration: 950, easing: "linear", fill: "both" });
    setTimeout(() => {
      game.querySelector(".net").animate([{ transform: "scaleY(1)" }, { transform: "scaleY(1.35)" }, { transform: "scaleY(1)" }], { duration: 380, easing: "ease-out" });
      game.querySelector(".swish").animate([{ opacity: 0, translate: "-50% 8px" }, { opacity: 1, translate: "-50% 0" }, { opacity: 1, offset: 0.7 }, { opacity: 0 }], { duration: 900, easing: "ease-out" });
      // swish: open the CV in a new tab (still within the click's user-activation window, so it isn't blocked)
      const tab = window.open(btn.href, "_blank");
      if (tab) tab.opener = null;
    }, 760);
    setTimeout(() => {
      hoop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "both" }).finished.then(() => game.classList.remove("on"));
    }, 1700);
  });
}

// ---------- performance: pause the hero's looping avatar while it's off screen ----------
const hero = document.querySelector(".hero");
if (hero) new IntersectionObserver(([e]) => hero.classList.toggle("paused", !e.isIntersecting)).observe(hero);

// ---------- reveal sections on scroll ----------
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
}), { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
