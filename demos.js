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

  // each answer starts with what kind of result it is
  const verdicts = { clear: "TRUE NEGATIVE", blocked: "TRUE POSITIVE", fp: "FALSE POSITIVE", added: "ADDED" };
  const say = (kind, msg) => {
    result.dataset.kind = kind;
    result.innerHTML = `<strong class="verdict">${verdicts[kind]}</strong> `;
    result.append(msg);
  };
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
    else { msg = "All bits are on, but the exact list doesn't contain it, so the mail still goes through. This is why matches are double-checked."; kind = "fp"; }
    say(kind, msg);
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
    say("added", `${fresh.length ? `Bits ${fresh.join(", ")} turned on.` : "All its bits were already on."} Every future mail with this URL is now blocked.`);
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
// A browser port of the Java game (github.com/YehonatanAbramovitch/Arkanoid-Game), same numbers and rules:
// an 800x600 field, three black balls moving (-5,-5) per frame at 60 FPS, an inverted pyramid of 57x30 blocks,
// a 75px paddle that moves 5px per frame and wraps around at the walls, five paddle regions (300°, 330°,
// straight reflect, 30°, 60°), and the color rule: breaking a block paints the ball in that block's color,
// and a ball bounces off blocks of its own color without breaking them. 5 points a block, 100 for clearing.
Demos.arkanoid = (root) => {
  const W = 800, H = 600, R = 5, FRAME = 1000 / 60;
  const C = { yellow: "#ffff00", white: "#ffffff", red: "#ff0000", blue: "#0000ff", green: "#00ff00", pink: "#ffafaf", dark: "#404040", gray: "#808080", black: "#000000" };
  root.innerHTML = `
    <p class="lead">The Java game, ported to the browser with the same rules. Three balls are in play; each one takes the color of
      the last block it broke and bounces off blocks of its own color without breaking them. Move the paddle with the arrow keys,
      the mouse or your finger.</p>
    <div class="ark">
      <canvas width="${W}" height="${H}" tabindex="0" aria-label="Arkanoid game. Press Enter or Space to start, arrow keys to move the paddle."></canvas>
      <button class="ark-overlay" type="button"><span>Click to play</span></button>
    </div>`;
  const canvas = root.querySelector("canvas"), ctx = canvas.getContext("2d");
  const overlay = root.querySelector(".ark-overlay");
  const panel = root.closest('[role="tabpanel"]');
  // the frame of the field, as in Game.initialize(): top bar, side walls, and the bottom "death" block
  const walls = [
    { x: 0, y: 15, w: 800, h: 15, color: C.dark },
    { x: 0, y: 0, w: 20, h: 555, color: C.dark },
    { x: 780, y: 0, w: 20, h: 555, color: C.dark },
  ];
  const death = { x: 0, y: 565, w: 800, h: 50, color: C.dark };
  let blocks, balls, paddle, score, state = "ready", raf = 0, last = 0, acc = 0, keys = { left: false, right: false }, pointerX = null;

  const reset = () => {
    blocks = [];
    [[1, 13, 30, C.yellow], [2, 12, 60, C.white], [3, 11, 90, C.red], [4, 10, 120, C.blue], [5, 9, 150, C.green], [6, 8, 180, C.pink]]
      .forEach(([from, to, y, color]) => { for (let i = from; i < to; i++) blocks.push({ x: i * 57, y, w: 57, h: 30, color }); });
    balls = [[400, 400], [300, 300], [500, 500]].map(([x, y]) => ({ x, y, vx: -5, vy: -5, color: C.black }));
    paddle = { x: 400, y: 550, w: 75, h: 15 };
    score = 0;
  };

  // the ball's path this frame as a segment, against a rectangle grown by the ball's radius:
  // earliest entry time t in [0,1] and which face (x or y) it crosses
  const hit = (x, y, dx, dy, o) => {
    const r = { x: o.x - R, y: o.y - R, w: o.w + 2 * R, h: o.h + 2 * R };
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
  const fromAngle = (deg, speed) => ({ vx: Math.sin((deg * Math.PI) / 180) * speed, vy: -Math.cos((deg * Math.PI) / 180) * speed });

  // one frame of Ball.moveOneStep(): find the closest collision on the path, stop just before it, take the new velocity
  const step = (b) => {
    let left = 1;
    for (let guard = 0; guard < 4 && left > 0; guard++) {
      const dx = b.vx * left, dy = b.vy * left;
      let best = null;
      const consider = (o, kind) => { const h = hit(b.x, b.y, dx, dy, o); if (h && (!best || h.t < best.t)) best = { ...h, o, kind }; };
      walls.forEach((w) => consider(w, "wall"));
      consider(death, "death");
      blocks.forEach((k) => consider(k, "block"));
      consider(paddle, "paddle");
      if (!best) { b.x += dx; b.y += dy; return true; }
      if (best.kind === "death") return false; // BallRemover
      const t = Math.max(0, best.t - 1e-4);
      b.x += dx * t; b.y += dy * t; left *= 1 - best.t;
      if (best.kind === "paddle" && best.side === "y" && b.vy > 0) {
        const region = Math.min(4, Math.max(0, Math.floor(((b.x - paddle.x) / paddle.w) * 5)));
        const speed = Math.hypot(b.vx, b.vy);
        if (region === 2) b.vy = -b.vy;
        else Object.assign(b, fromAngle([300, 330, 0, 30, 60][region], speed));
      } else if (best.side === "x") b.vx = -b.vx;
      else b.vy = -b.vy;
      if (best.kind === "block" && best.o.color !== b.color) {
        // BlockRemover + ScoreTrackingListener: the ball takes the block's color, the block goes, +5
        b.color = best.o.color;
        blocks.splice(blocks.indexOf(best.o), 1);
        score += 5;
      }
    }
    return true;
  };

  // Paddle.moveLeft / moveRight: 5px a frame, wrapping to the other side at the walls
  const movePaddle = () => {
    if (pointerX !== null) { paddle.x = Math.max(20, Math.min(780 - paddle.w, pointerX - paddle.w / 2)); return; }
    if (keys.left) paddle.x = paddle.x - 5 <= 20 ? 780 - paddle.w : paddle.x - 5;
    else if (keys.right) paddle.x = paddle.x + paddle.w >= 780 ? 20 : paddle.x + 5;
  };

  const draw = () => {
    ctx.fillStyle = C.gray; ctx.fillRect(0, 0, W, H);
    const rect = (o, fill, outline) => {
      ctx.fillStyle = fill; ctx.fillRect(o.x, o.y, o.w, o.h);
      if (outline) { ctx.strokeStyle = C.black; ctx.lineWidth = 1; ctx.strokeRect(o.x + .5, o.y + .5, o.w - 1, o.h - 1); }
    };
    [...walls, death].forEach((w) => rect(w, w.color, true));
    blocks.forEach((k) => rect(k, k.color, true));
    rect(paddle, C.black);
    balls.forEach((b) => { ctx.fillStyle = b.color; ctx.beginPath(); ctx.arc(b.x, b.y, R, 0, Math.PI * 2); ctx.fill(); });
    // ScoreIndicator: a white strip with the score
    ctx.fillStyle = C.white; ctx.fillRect(0, 0, 800, 15);
    ctx.fillStyle = C.black; ctx.font = "16px Arial, sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillText(`Score:${score}`, 350, 14);
  };

  const frame = (now) => {
    raf = 0;
    if (panel.hidden || document.hidden) { if (state === "playing") state = "paused"; showOverlay(); return; }
    acc += Math.min(250, now - last); last = now;
    while (acc >= FRAME && state === "playing") {
      acc -= FRAME;
      movePaddle();
      balls = balls.filter(step);
      if (!blocks.length) { score += 100; state = "won"; }
      else if (!balls.length) state = "lost";
    }
    draw();
    if (state === "playing") raf = requestAnimationFrame(frame); else showOverlay();
  };
  const showOverlay = () => {
    overlay.querySelector("span").textContent = {
      ready: "Click to play", paused: "Paused. Click to continue",
      won: `Cleared! Score ${score}. Play again`, lost: `Game over. Score ${score}. Play again`,
    }[state];
    overlay.hidden = false;
  };
  const start = () => {
    if (state === "won" || state === "lost") reset();
    state = "playing"; overlay.hidden = true; canvas.focus({ preventScroll: true });
    last = performance.now(); acc = 0;
    if (!raf) raf = requestAnimationFrame(frame);
  };

  overlay.addEventListener("click", start);
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    pointerX = ((e.clientX - r.left) / r.width) * W;
    if (state !== "playing") { movePaddle(); draw(); }
  });
  canvas.addEventListener("pointerleave", () => { pointerX = null; });
  canvas.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); pointerX = null; keys[e.key === "ArrowLeft" ? "left" : "right"] = true; }
    if ((e.key === "Enter" || e.key === " ") && state !== "playing") { e.preventDefault(); start(); }
  });
  canvas.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
  });
  reset(); draw(); showOverlay();
};

// ---------- projects with their own live demo: show it inside the page ----------
// The demo is laid out at desktop size (1440px wide) and scaled to fit, so it looks exactly like the real site,
// whole building included. On the live site it's the same origin, so the frame's height follows the page inside it.
Demos.embed = (root) => {
  const src = root.dataset.src, W = 1440;
  root.innerHTML = `
    <p class="lead embed-lead">The live lab, running inside this page. Pick a problem, hide the world, and run the controller.</p>
    <div class="embed-wide"><div class="embed-frame"><iframe src="${src}" title="Live demo" allow="fullscreen"></iframe></div></div>
    <a class="back" href="${src}" target="_blank" rel="noopener">Open the lab in a new tab ↗</a>`;
  const wrap = root.querySelector(".embed-frame"), frame = wrap.querySelector("iframe");
  let H = 2300;
  const fit = () => {
    const w = wrap.clientWidth;
    if (w < 760) { wrap.classList.add("native"); frame.style.cssText = ""; wrap.style.height = ""; return; }
    wrap.classList.remove("native");
    const s = w / W;
    frame.style.cssText = `width:${W}px; height:${H}px; transform:scale(${s})`;
    wrap.style.height = `${Math.ceil(H * s)}px`;
  };
  new ResizeObserver(fit).observe(wrap);
  setInterval(() => {
    try {
      const doc = frame.contentDocument, h = Math.ceil(doc.body.getBoundingClientRect().bottom + 24); // content height, so it can shrink too
      if (h && Math.abs(h - H) > 4) { H = h; fit(); }
    } catch {} // different origin (local preview): keep the default height
  }, 600);
  fit();
};
