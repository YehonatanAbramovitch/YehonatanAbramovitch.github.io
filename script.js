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
const chips = (items) => `<div class="chips">${items.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>`;
// muted looping demo clip; started from JS (see startDemoVideos) since mobile browsers often ignore autoplay
const demoVideo = (v, title, onPage = false) => `
  <video src="${esc(onPage ? v.src : v.card || v.src)}" poster="${esc(v.poster)}" muted loop playsinline autoplay preload="auto"
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
    // tapping a paused card clip starts it (the project-page player has its own controls)
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

  $("aboutText").innerHTML = SITE.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("skills").innerHTML = Object.entries(SITE.skills).map(([group, items], i) => `
    <div style="--accent:${accents[i % 4]}"><h4>${esc(group)}</h4>${chips(items)}</div>`).join("");

  $("projectGrid").innerHTML = SITE.projects.map((p, i) => `
    <article class="card" style="--accent:${accents[i % 4]}">
      ${p.video
        // with a video, tapping the cover only plays the clip; the screenshots open from the badge
        ? `<div class="thumb has-video">
             ${demoVideo(p.video, p.title)}
             ${p.images && p.images.length ? `<button class="count" data-project="${i}" aria-label="View ${esc(p.title)} screenshots">${shotsLabel(p.images)}</button>` : ""}
           </div>`
        : p.images && p.images.length
        ? `<button class="thumb" data-project="${i}" aria-label="View ${esc(p.title)} screenshots">
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
    <li style="--accent:${accents[i % 4]}">
      <span class="when">${esc(e.when)}</span>
      <h4>${esc(e.title)}</h4>
      <div class="place">${esc(e.place)}</div>
      ${e.text ? `<p>${esc(e.text)}</p>` : ""}
      ${e.bullets ? list(e.bullets) : ""}
    </li>`).join("");

  document.querySelectorAll("[data-project]").forEach((btn) =>
    btn.onclick = () => openLightbox(SITE.projects[btn.dataset.project].images, 0));

  // typing effect for the role
  (function type(i = 0) {
    $("role").textContent = SITE.role.slice(0, i);
    if (i < SITE.role.length) setTimeout(() => type(i + 1), 70);
  })();
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
    <div class="challenge">
      <div class="c-q"><span class="mono">#${i + 1}</span> ${esc(c.challenge)}</div>
      <div class="c-a"><span class="label">Solution</span>${esc(c.solution)}</div>
    </div>`).join("")}</div>`;

  const shots = `<div class="shots">${p.images.map((img, i) => `
    <figure><button class="shot" data-i="${i}" aria-label="Enlarge: ${esc(img.caption)}"><img src="${esc(img.src)}" alt="${esc(img.caption)}" loading="lazy"></button>
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
function showSlide(n) {
  lbIndex = (n + lbImages.length) % lbImages.length;
  const img = lbImages[lbIndex];
  $("lbImg").src = img.src;
  $("lbImg").alt = img.caption;
  $("lbCaption").textContent = `${img.caption}  ·  ${lbIndex + 1} / ${lbImages.length}`;
  lb.classList.toggle("single", lbImages.length < 2);
}
function openLightbox(images, start) {
  lbImages = images;
  showSlide(start);
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

// ---------- theme toggle (remembers choice) ----------
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
  else if (matchMedia("(prefers-color-scheme: dark)").matches) root.dataset.theme = "dark";
} catch {}
$("themeBtn").onclick = () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
};

// ---------- reveal sections on scroll ----------
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
}), { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
