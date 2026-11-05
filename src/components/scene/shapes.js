// Deterministic shape generators for the painterly, cel-shaded look.
// Seeded so the scene renders identically on every load (and in SSR).

export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

const f = (n) => Math.round(n * 10) / 10;

/** Scalloped "cloud of leaves" blob — the building block of the canopy. */
export function scallop(cx, cy, rx, ry, n = 9, seed = 1, jitter = 0.18, bulge = 0.55) {
  const r = rng(seed);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (r() - 0.5) * 0.35;
    const k = 1 + (r() - 0.5) * jitter;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % n];
    const mx = (p[0] + q[0]) / 2;
    const my = (p[1] + q[1]) / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const len = Math.hypot(dx, dy) || 1;
    const seg = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const b = seg * bulge * (0.7 + r() * 0.6);
    d += ` Q${f(mx + (dx / len) * b)} ${f(my + (dy / len) * b)} ${f(q[0])} ${f(q[1])}`;
  }
  return d + 'Z';
}

/** Jagged brush swash — used for painted clouds and grass patches. */
export function swash(x, y, len, thick, angleDeg = 0, seed = 1, spikes = 0.25) {
  const r = rng(seed);
  const a = (angleDeg * Math.PI) / 180;
  const ca = Math.cos(a), sa = Math.sin(a);
  const steps = Math.max(8, Math.round(len / 14));
  const top = [], bot = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const prof = Math.pow(Math.sin(Math.PI * t), 0.55);
    const wTop = thick * prof * (0.75 + r() * 0.35) + (r() < spikes ? thick * 0.45 * r() : 0);
    const wBot = thick * prof * (0.55 + r() * 0.3) + (r() < spikes * 0.6 ? thick * 0.3 * r() : 0);
    const lx = t * len + (r() - 0.5) * 10;
    top.push([lx, -wTop]);
    bot.push([lx + (r() - 0.5) * 8, wBot]);
  }
  const pts = [...top, ...bot.reverse()].map(([px, py]) => [x + px * ca - py * sa, y + px * sa + py * ca]);
  return 'M' + pts.map(([px, py]) => `${f(px)} ${f(py)}`).join(' L') + 'Z';
}

/** Irregular polygon (stepping stones, rocks). */
export function chunk(cx, cy, rx, ry, n = 7, seed = 1, jitter = 0.3) {
  const r = rng(seed);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (r() - 0.5) * 0.5;
    const k = 1 - r() * jitter;
    pts.push(`${f(cx + Math.cos(a) * rx * k)} ${f(cy + Math.sin(a) * ry * k)}`);
  }
  return 'M' + pts.join(' L') + 'Z';
}

/** Grass tuft: a fan of sharp blades. */
export function tuft(x, y, w, h, blades = 7, seed = 1, lean = 0) {
  const r = rng(seed);
  let d = '';
  for (let i = 0; i < blades; i++) {
    const t = blades === 1 ? 0.5 : i / (blades - 1);
    const bx = x - w / 2 + t * w;
    const bh = h * (0.55 + r() * 0.45) * (1 - Math.abs(t - 0.5) * 0.7);
    const tipX = bx + (t - 0.5) * w * 0.8 + lean * h * 0.3 + (r() - 0.5) * 10;
    const bw = 5 + r() * 5;
    d += `M${f(bx - bw)} ${f(y)} Q${f(bx - bw * 0.3)} ${f(y - bh * 0.6)} ${f(tipX)} ${f(y - bh)} Q${f(bx + bw * 0.2)} ${f(y - bh * 0.5)} ${f(bx + bw)} ${f(y)}Z `;
  }
  return d;
}

/** Leaf scatter positions for flecks/highlights. */
export function scatter(n, x0, y0, x1, y1, seed = 1) {
  const r = rng(seed);
  return Array.from({ length: n }, () => ({ x: x0 + r() * (x1 - x0), y: y0 + r() * (y1 - y0), s: 0.6 + r() * 0.8, a: r() * 360 }));
}

export const LEAF = 'M0 -9 Q7 -4 6 3 Q3 9 0 10 Q-3 9 -6 3 Q-7 -4 0 -9Z';
