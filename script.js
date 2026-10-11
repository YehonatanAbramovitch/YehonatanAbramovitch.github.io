const $ = (id) => document.getElementById(id);
const accents = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

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

const initials = SITE.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
document.title = `${SITE.name} — ${SITE.role}`;
$("logo").textContent = initials;
$("name").textContent = SITE.name;
$("tagline").textContent = SITE.tagline;
$("avatar").innerHTML = SITE.photo ? `<img src="${esc(SITE.photo)}" alt="${esc(SITE.name)}">` : initials;
$("cvBtn").href = SITE.cvFile;
$("mailBtn").href = `mailto:${SITE.email}`;
$("mailBtn").textContent = SITE.email;
$("heroSocials").innerHTML = $("footSocials").innerHTML = socialsHTML();
$("footName").textContent = SITE.name;
$("year").textContent = new Date().getFullYear();

$("aboutText").innerHTML = SITE.about.map((p) => `<p>${esc(p)}</p>`).join("");
$("skills").innerHTML = Object.entries(SITE.skills).map(([group, items], i) => `
  <div><h4>${esc(group)}</h4><div class="chips" style="--accent:${accents[i % 4]}">
    ${items.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}
  </div></div>`).join("");

$("projectGrid").innerHTML = SITE.projects.map((p, i) => `
  <article class="card" style="--accent:${accents[i % 4]}">
    <div class="thumb">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)} screenshot">` : esc(p.title[0])}</div>
    <div class="body">
      <h4>${esc(p.title)}</h4>
      <p>${esc(p.description)}</p>
      <div class="chips">${p.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      <div class="links">
        ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener">Code →</a>` : ""}
        ${p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo →</a>` : ""}
      </div>
    </div>
  </article>`).join("");

$("timeline").innerHTML = SITE.experience.map((e, i) => `
  <li style="--accent:${accents[i % 4]}">
    <span class="when">${esc(e.when)}</span>
    <h4>${esc(e.title)}</h4>
    <div class="place">${esc(e.place)}</div>
    <p>${esc(e.text)}</p>
  </li>`).join("");

// typing effect for the role
(function type(i = 0) {
  $("role").textContent = SITE.role.slice(0, i);
  if (i < SITE.role.length) setTimeout(() => type(i + 1), 70);
})();

// theme toggle (remembers choice)
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

// reveal sections on scroll
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
