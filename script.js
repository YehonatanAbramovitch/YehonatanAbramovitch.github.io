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
  $("skillGrid").innerHTML = Object.entries(SITE.skills).map(([group, items], i) => `
    <div class="skill-group" style="--accent:${accents[i % 4]}; --i:${i}">
      <h4>${esc(group)} <span class="mono">${items.length}</span></h4>
      <ul class="skill-list">${items.map((s) => `
        <li class="skill"><span class="skill-icon" style="--glyph:url('${skillIcon(s)}')" aria-hidden="true"></span>${esc(s)}</li>`).join("")}
      </ul>
    </div>`).join("");

  $("projectGrid").innerHTML = SITE.projects.map((p, i) => `
    <article class="card" style="--accent:${accents[i % 4]}; --i:${i}">
      ${p.video
        // clicking the clip (or the badge) opens the project's screenshots
        ? `<div class="thumb has-video" data-cursor="view">
             ${demoVideo(p.video, p.title, false, p.images && p.images.length ? `data-project="${i}"` : "")}
             ${p.images && p.images.length ? `<button class="count" data-project="${i}" aria-label="View ${esc(p.title)} screenshots">${shotsLabel(p.images)}</button>` : ""}
           </div>`
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

  document.querySelectorAll("[data-project]").forEach((btn) =>
    btn.onclick = () => openLightbox(SITE.projects[btn.dataset.project].images, 0));

  scramble($("role"), SITE.role);
}

// decode effect: random glyphs settle into the real text, left to right
function scramble(el, text) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = text; return; }
  const glyphs = "!<>-_\\/[]{}=+*^?#01";
  const start = performance.now() + 450; // let the hero entrance land first
  const perChar = 38, settle = 260;
  el.setAttribute("aria-label", text);
  (function frame(now) {
    const t = now - start;
    let out = "", done = true;
    for (let i = 0; i < text.length; i++) {
      const lockAt = i * perChar + settle;
      if (text[i] === " " || t >= lockAt) out += t < 0 && text[i] !== " " ? "" : text[i];
      else { done = false; out += t > i * perChar - settle ? glyphs[(Math.random() * glyphs.length) | 0] : ""; }
    }
    el.textContent = out;
    if (!done) requestAnimationFrame(frame);
  })(performance.now());
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
  const t = document.startViewTransition(flip);
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

// ---------- background: the color blobs drift and recolor for each section ----------
const sections = document.querySelectorAll("main > section");
if (sections.length) {
  const bg = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) document.body.dataset.section = e.target.id || "hero";
  }), { rootMargin: "-50% 0px -50% 0px" });
  sections.forEach((s) => bg.observe(s));
}

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
    });
    btn.addEventListener("pointerleave", () => { btn.style.translate = ""; });
  });

  // ---------- custom cursor: a dot plus a ring that trails it and grows over clickable things ----------
  const dot = document.querySelector(".cursor-dot"), ring = document.querySelector(".cursor-ring");
  if (dot && ring) {
    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = Math.abs(mx - rx) + Math.abs(my - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    document.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      root.classList.add("has-cursor"); // only once a real mouse moves, so touch/hybrid devices keep the native cursor
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      root.classList.add("cursor-on");
      const t = e.target.closest?.("[data-cursor], a, button, .card");
      ring.dataset.state = !t ? "" : t.dataset.cursor || (t.matches(".card") ? "card" : "link");
      if (!raf) raf = requestAnimationFrame(loop);
    });
    document.addEventListener("pointerdown", () => ring.classList.add("down"));
    document.addEventListener("pointerup", () => ring.classList.remove("down"));
    document.documentElement.addEventListener("pointerleave", () => root.classList.remove("cursor-on"));
  }
}

// ---------- reveal sections on scroll ----------
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
}), { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
