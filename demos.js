// Interactive demos for the project pages. Each one is started the first time its tab is opened
// (see the tabs code in script.js) and only runs while that tab is visible.
const Demos = {};

// ---------- Gmail project: the URL Bloom filter, live ----------
// Same idea as the C++ filter server: a bit array, k hash functions applied one after another
// ("repeated hashing"), and an exact blacklist that confirms possible matches. The server uses
// std::hash; here FNV-1a stands in so it runs in the browser.
Demos.bloom = (root) => {
  const M = 64, K = 3;
  const bits = new Array(M).fill(false);
  const list = new Set();
  const fnv = (s) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  };
  const positions = (url) => {
    const out = [];
    let h = fnv(url);
    for (let i = 0; i < K; i++) { out.push(h % M); h = fnv(String(h)); }
    return out;
  };
  const norm = (s) => s.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");

  root.innerHTML = `
    <p class="lead">This is the filter that guarded every outgoing mail, running in your browser. A URL is hashed ${K} times;
      each hash picks one of ${M} bits. If any of those bits is off, the URL is <strong>definitely not</strong> on the blacklist.
      If all are on, it <strong>might</strong> be, and only then is the exact list searched.</p>
    <form class="bloom-form">
      <label for="bloomUrl">URL</label>
      <div class="bloom-row">
        <input id="bloomUrl" name="url" autocomplete="off" spellcheck="false" placeholder="phishing-login.example" required>
        <button class="btn small primary" type="submit">Check</button>
        <button class="btn small" type="button" data-act="add">Add to blacklist</button>
      </div>
      <button class="bloom-fp" type="button" data-act="fp">Find a false positive for me</button>
    </form>
    <div class="bloom-bits" aria-hidden="true">${bits.map((_, i) => `<span data-i="${i}"></span>`).join("")}</div>
    <p class="bloom-hashes mono" aria-hidden="true"></p>
    <p class="bloom-result" role="status" aria-live="polite"></p>
    <div class="bloom-list"><span class="mono">blacklist</span><span class="bloom-items"></span></div>`;

  const cells = [...root.querySelectorAll(".bloom-bits span")];
  const input = root.querySelector("#bloomUrl");
  const result = root.querySelector(".bloom-result");
  const hashes = root.querySelector(".bloom-hashes");

  const paint = (probe = [], fresh = []) => {
    cells.forEach((c, i) => {
      c.classList.toggle("on", bits[i]);
      c.classList.toggle("probe", probe.includes(i));
      c.classList.toggle("fresh", fresh.includes(i));
    });
    root.querySelector(".bloom-items").innerHTML = [...list].map((u) => `<span class="chip">${u.replace(/[&<>"]/g, "")}</span>`).join("");
  };
  const add = (url) => {
    const pos = positions(url), fresh = pos.filter((p) => !bits[p]);
    pos.forEach((p) => (bits[p] = true));
    list.add(url);
    return { pos, fresh };
  };
  const check = (url) => {
    const pos = positions(url);
    hashes.textContent = pos.map((p, i) => `h${i + 1}(url) → bit ${p}`).join("   ·   ");
    const allOn = pos.every((p) => bits[p]);
    let msg, kind;
    if (!allOn) { msg = `Definitely not blacklisted: bit ${pos.find((p) => !bits[p])} is off. Answered with ${K} lookups and no list search.`; kind = "clear"; }
    else if (list.has(url)) { msg = "Blacklisted: all bits are on and the exact list confirms it, so this mail would be blocked."; kind = "blocked"; }
    else { msg = "False positive: all bits are on, but the exact list doesn't contain it, so the mail still goes through. This is why matches are double-checked."; kind = "fp"; }
    result.textContent = msg;
    result.dataset.kind = kind;
    paint(pos);
  };

  ["phishing-login.example", "malware-download.example", "fake-bank.example"].forEach(add);
  paint();
  result.textContent = "Three known-bad URLs are already in the filter. Try one of them, or any other URL.";

  root.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const url = norm(input.value);
    if (url) check(url);
  });
  root.querySelector('[data-act="add"]').addEventListener("click", () => {
    const url = norm(input.value);
    if (!url) { input.focus(); return; }
    const { pos, fresh } = add(url);
    hashes.textContent = pos.map((p, i) => `h${i + 1}(url) → bit ${p}`).join("   ·   ");
    result.textContent = `Added. ${fresh.length ? `Bits ${fresh.join(", ")} turned on.` : "All its bits were already on."} Every future mail with this URL is now blocked.`;
    result.dataset.kind = "blocked";
    paint(pos, fresh);
  });
  root.querySelector('[data-act="fp"]').addEventListener("click", () => {
    for (let i = 1; i < 20000; i++) {
      const url = `harmless-site-${i}.example`;
      if (!list.has(url) && positions(url).every((p) => bits[p])) { input.value = url; check(url); return; }
    }
    result.textContent = "No false positive found among the first 20,000 tries. Add a few more URLs and try again.";
  });
};

// ---------- Arkanoid project: the game, playable ----------
// A small port of the Java game's rules: a pyramid of blocks, two balls, a paddle split into five
// regions that set the bounce angle, a score with a bonus for clearing the level, and collision found
// along each step's path (not just at the end position) so fast balls don't tunnel through blocks.
Demos.arkanoid = (root) => {
  const W = 800, H = 500, WALL = 20, R = 6, SPEED = 380;
  root.innerHTML = `
    <p class="lead">Move the paddle with the mouse, your finger or the arrow keys. Where the ball lands on the paddle sets the angle it leaves at.</p>
    <div class="ark">
      <canvas width="${W}" height="${H}" tabindex="0" aria-label="Arkanoid game. Press Enter or Space to start, arrow keys to move."></canvas>
      <button class="ark-overlay" type="button"><span>Click to play</span></button>
    </div>`;
  const canvas = root.querySelector("canvas"), ctx = canvas.getContext("2d");
  const overlay = root.querySelector(".ark-overlay");
  const panel = root.closest('[role="tabpanel"]');
  const colors = ["#e9d64a", "#f2f2f2", "#e8413c", "#2f5fe0", "#3fcf4a", "#f2a3b3"];
  let blocks, balls, paddle, score, state = "ready", raf = 0, last = 0, keys = { left: false, right: false };

  const reset = () => {
    blocks = [];
    const bw = 50, bh = 22;
    colors.forEach((color, row) => {
      const count = 12 - row;
      for (let c = 0; c < count; c++) blocks.push({ x: W - WALL - bw * (c + 1), y: 90 + row * bh, w: bw, h: bh, color });
    });
    paddle = { x: W / 2 - 55, y: H - 34, w: 110, h: 14 };
    balls = [-25, 25].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return { x: W / 2, y: H - 60, vx: SPEED * Math.sin(a), vy: -SPEED * Math.cos(a) };
    });
    score = 0;
  };

  // segment (x,y)+(dx,dy) against a rectangle: returns the earliest entry time t in [0,1] and which face was hit
  const hit = (x, y, dx, dy, r) => {
    const slab = (p, d, lo, hi) => {
      if (d === 0) return p < lo || p > hi ? null : [-Infinity, Infinity];
      const a = (lo - p) / d, b = (hi - p) / d;
      return a < b ? [a, b] : [b, a];
    };
    const sx = slab(x, dx, r.x, r.x + r.w), sy = slab(y, dy, r.y, r.y + r.h);
    if (!sx || !sy) return null;
    const tin = Math.max(sx[0], sy[0]), tout = Math.min(sx[1], sy[1]);
    if (tin > tout || tin < 0 || tin > 1) return null;
    return { t: tin, side: sx[0] > sy[0] ? "x" : "y" };
  };
  const grow = (o) => ({ x: o.x - R, y: o.y - R, w: o.w + 2 * R, h: o.h + 2 * R });
  const walls = [{ x: -100, y: 0, w: 100 + WALL, h: H }, { x: W - WALL, y: 0, w: 100 + WALL, h: H }, { x: 0, y: -100, w: W, h: 100 + WALL }];

  const move = (b, dt) => {
    let left = dt;
    for (let guard = 0; guard < 4 && left > 0; guard++) {
      const dx = b.vx * left, dy = b.vy * left;
      let best = null;
      const consider = (o, kind) => { const h = hit(b.x, b.y, dx, dy, grow(o)); if (h && (!best || h.t < best.t)) best = { ...h, o, kind }; };
      walls.forEach((w) => consider(w, "wall"));
      blocks.forEach((k) => consider(k, "block"));
      if (b.vy > 0) consider(paddle, "paddle");
      if (!best) { b.x += dx; b.y += dy; return; }
      const t = Math.max(0, best.t - 1e-4);
      b.x += dx * t; b.y += dy * t; left *= 1 - best.t;
      if (best.kind === "paddle" && best.side === "y") {
        // five regions, like the Java paddle: outer ones send the ball off at a steeper angle
        const region = Math.min(4, Math.max(0, Math.floor(((b.x - paddle.x) / paddle.w) * 5)));
        const deg = [-60, -30, 0, 30, 60][region];
        const sp = Math.hypot(b.vx, b.vy), a = (deg * Math.PI) / 180;
        if (deg === 0) b.vy = -Math.abs(b.vy); else { b.vx = sp * Math.sin(a); b.vy = -sp * Math.cos(a); }
      } else if (best.side === "x") b.vx = -b.vx; else b.vy = -b.vy;
      if (best.kind === "block") { blocks.splice(blocks.indexOf(best.o), 1); score += 5; }
    }
  };

  const draw = () => {
    ctx.fillStyle = "#3c3c3c"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#808080"; ctx.fillRect(WALL, WALL, W - 2 * WALL, H - WALL);
    blocks.forEach((k) => { ctx.fillStyle = k.color; ctx.fillRect(k.x, k.y, k.w, k.h); ctx.strokeStyle = "#222"; ctx.strokeRect(k.x + .5, k.y + .5, k.w - 1, k.h - 1); });
    ctx.fillStyle = "#f0c419"; ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.strokeStyle = "#222"; ctx.strokeRect(paddle.x + .5, paddle.y + .5, paddle.w - 1, paddle.h - 1);
    ctx.fillStyle = "#fff"; balls.forEach((b) => { ctx.beginPath(); ctx.arc(b.x, b.y, R, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#111"; ctx.stroke(); });
    ctx.fillStyle = "#fff"; ctx.fillRect(WALL, 0, W - 2 * WALL, WALL);
    ctx.fillStyle = "#111"; ctx.font = "600 15px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
    ctx.fillText(`Score: ${score}`, W / 2, 15);
  };

  const frame = (now) => {
    raf = 0;
    if (panel.hidden || document.hidden) { state = state === "playing" ? "paused" : state; showOverlay(); return; }
    const dt = Math.min(1 / 30, (now - last) / 1000); last = now;
    const step = 460 * dt;
    if (keys.left) paddle.x -= step;
    if (keys.right) paddle.x += step;
    paddle.x = Math.max(WALL, Math.min(W - WALL - paddle.w, paddle.x));
    balls.forEach((b) => move(b, dt));
    balls = balls.filter((b) => b.y < H + R * 2);
    if (!blocks.length) { score += 100; state = "won"; }
    else if (!balls.length) state = "lost";
    draw();
    if (state === "playing") raf = requestAnimationFrame(frame); else showOverlay();
  };
  const showOverlay = () => {
    const text = { ready: "Click to play", paused: "Paused. Click to continue", won: `Cleared! Score ${score}. Play again`, lost: `Game over. Score ${score}. Play again` }[state];
    overlay.querySelector("span").textContent = text;
    overlay.hidden = false;
  };
  const start = () => {
    if (state === "won" || state === "lost") reset();
    state = "playing"; overlay.hidden = true; canvas.focus({ preventScroll: true });
    last = performance.now();
    if (!raf) raf = requestAnimationFrame(frame);
  };

  overlay.addEventListener("click", start);
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    paddle.x = ((e.clientX - r.left) / r.width) * W - paddle.w / 2;
    if (state !== "playing") { paddle.x = Math.max(WALL, Math.min(W - WALL - paddle.w, paddle.x)); draw(); }
  });
  canvas.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); keys[e.key === "ArrowLeft" ? "left" : "right"] = true; }
    if ((e.key === "Enter" || e.key === " ") && state !== "playing") { e.preventDefault(); start(); }
  });
  canvas.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
  });
  reset(); draw(); showOverlay();
};
