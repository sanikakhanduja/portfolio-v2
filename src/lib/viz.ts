/**
 * Architecture diagrams as pure functions of time: draw(ctx, W, H, t). That makes "jump to step",
 * "replay" and "rest on the finished state" trivial. Step i spans BOUNDS[key][i]..BOUNDS[key][i+1] seconds.
 */
import type { WorkKey } from '../content';
import { cssVar } from './theme';

export const BOUNDS: Record<WorkKey, number[]> = { ms: [0, 1, 2.5, 4.6, 6.6, 8], cs: [0, 0.8, 1.8, 4, 5.2, 7] };

/** Colours come from the page's theme tokens; call readTheme() on load and whenever the theme changes. */
export const TH = {
  bg: '#FFFFFF', ink: '#111316', mute: '#5F636A', line: '#D3D6CE', acc: '#FF4F1A',
  font: '"Familjen Grotesk Variable", system-ui, sans-serif', mono: '"IBM Plex Mono", ui-monospace, monospace',
};

export function readTheme() {
  TH.bg = cssVar('--card'); TH.ink = cssVar('--ink'); TH.mute = cssVar('--mute'); TH.line = cssVar('--line'); TH.acc = cssVar('--acc');
}

type C = CanvasRenderingContext2D;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
function edge(c: C, x1: number, y1: number, x2: number, y2: number, p: number, lit: boolean) {
  if (p <= 0) return;
  c.lineWidth = lit ? 1.6 : 1;
  c.strokeStyle = lit ? TH.acc : TH.line;
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 + (x2 - x1) * p, y1 + (y2 - y1) * p); c.stroke();
}
function box(c: C, x: number, y: number, w: number, h: number, lit: boolean) {
  c.lineWidth = lit ? 1.6 : 1;
  c.strokeStyle = lit ? TH.acc : TH.line;
  c.fillStyle = lit ? alpha(TH.acc, 0.12) : TH.bg;
  c.beginPath(); c.roundRect(x, y, w, h, 5); c.fill(); c.stroke();
}
function label(c: C, s: string, x: number, y: number, col = TH.mute, size = 10.5, align: CanvasTextAlign = 'left') {
  c.font = `${size}px ${TH.mono}`; c.fillStyle = col; c.textAlign = align; c.fillText(s, x, y);
}

/** Microsoft: a config change spreads through layouts and SKUs to the machines it would affect. */
export function drawMS(c: C, W: number, H: number, t: number) {
  const top = 58, bot = H - 62, mid = (top + bot) / 2, R = rng(7);
  const X = { pr: 24, cfg: 118, lay: 286, sku: 410, m: 540 };
  label(c, 'PULL REQUEST', X.pr, 30); label(c, 'CONFIG · 80K+ LINES', X.cfg, 30);
  label(c, 'LAYOUTS', X.lay, 30); label(c, 'SKUS', X.sku, 30); label(c, 'MACHINES', X.m, 30);

  const prY = mid - 18;
  box(c, X.pr, prY, 64, 36, t > 0.15);
  c.font = `600 13px ${TH.font}`; c.fillStyle = TH.ink; c.textAlign = 'center'; c.fillText('PR', X.pr + 32, prY + 22);
  if (t > 0 && t < 1.4) {
    c.strokeStyle = alpha(TH.acc, clamp(1 - t / 1.4)); c.lineWidth = 1.2;
    c.beginPath(); c.arc(X.pr + 32, mid, 8 + t * 40, 0, 7); c.stroke();
  }

  // config file: a scanline reads it, the changed line lights up
  const rows = 18, rh = (bot - top) / rows, K = 7, sy = top + (bot - top) * clamp((t - 1) / 1.5);
  for (let i = 0; i < rows; i++) {
    const y = top + i * rh + rh / 2, w = 36 + R() * 56, passed = y < sy;
    c.fillStyle = i === K && passed ? TH.acc : passed ? alpha(TH.ink, 0.45) : TH.line;
    c.fillRect(X.cfg, y - 1.5, w, 3);
  }
  if (t > 1 && t < 2.6) {
    c.strokeStyle = alpha(TH.acc, 0.55); c.lineWidth = 1;
    c.beginPath(); c.moveTo(X.cfg - 6, sy); c.lineTo(X.cfg + 100, sy); c.stroke();
  }
  const ky = top + K * rh + rh / 2;
  edge(c, X.pr + 64, mid, X.cfg - 6, ky, clamp(t / 0.8), true);

  const LY = [0, 1, 2, 3, 4, 5].map((i) => top + 8 + i * ((bot - top - 30) / 5)), LA = [1, 4], p1 = clamp((t - 2.5) / 0.9);
  LA.forEach((i) => edge(c, X.cfg + 96, ky, X.lay, LY[i] + 11, p1, true));
  LY.forEach((y, i) => box(c, X.lay, y, 78, 22, LA.includes(i) && p1 >= 1));

  const SY = [...Array(10)].map((_, i) => top + 2 + i * ((bot - top - 16) / 9));
  const SA: [number, number][] = [[1, 1], [1, 2], [4, 6], [4, 7]], p2 = clamp((t - 3.5) / 0.9);
  SA.forEach(([l, s]) => edge(c, X.lay + 78, LY[l] + 11, X.sku, SY[s] + 7, p2, true));
  SY.forEach((y, i) => box(c, X.sku, y, 60, 14, SA.some((a) => a[1] === i) && p2 >= 1));

  // machines: the 59 nearest the change light up as the blast radius expands
  const g = 15, cols = Math.floor((W - 24 - X.m) / g), rowsM = Math.floor((bot - top) / g);
  const cx = X.m + cols * g * 0.55, cy = top + rowsM * g * 0.5;
  const ms: { x: number; y: number; d: number }[] = [];
  for (let r = 0; r < rowsM; r++) for (let q = 0; q < cols; q++) {
    const x = X.m + q * g, y = top + r * g;
    ms.push({ x, y, d: Math.hypot(x - cx, (y - cy) * 1.3) + R() * 26 });
  }
  const sorted = [...ms].sort((a, b) => a.d - b.d), hit = new Set(sorted.slice(0, 59)), maxR = sorted[58].d * 1.08;
  const pr = clamp((t - 4.6) / 2), rad = ease(pr) * maxR;
  if (t > 4.4) SA.forEach(([, s]) => edge(c, X.sku + 60, SY[s] + 7, cx, cy, clamp((t - 4.4) / 0.5), false));
  let lit = 0;
  for (const m of ms) {
    const on = hit.has(m) && m.d <= rad;
    if (on) lit++;
    c.fillStyle = on ? TH.acc : TH.line; c.fillRect(m.x, m.y, 10, 10);
  }
  if (pr > 0 && pr < 1) for (const k of [1, 0.75, 0.5]) {
    c.strokeStyle = alpha(TH.acc, 0.5 * (1 - pr) * k); c.lineWidth = 1.4;
    c.beginPath(); c.ellipse(cx + 5, cy + 5, rad * k, (rad * k) / 1.3, 0, 0, 7); c.stroke();
  }
  if (t > 4.6) label(c, `${lit} affected`, X.m, 47, TH.acc, 11); // own line under MACHINES: never collides

  const pc = clamp((t - 6.6) / 0.7);
  if (pc > 0) {
    const msg = 'Bot comment on the PR: this change affects 59+ machines · posted in 10–15 s';
    c.save(); c.globalAlpha = pc;
    c.font = `500 13px ${TH.font}`;
    const bw = Math.min(W - 48, c.measureText(msg).width + 26);
    box(c, X.pr, H - 44, bw, 30, true);
    c.font = `500 13px ${TH.font}`; c.fillStyle = TH.ink; c.textAlign = 'left'; c.fillText(msg, X.pr + 13, H - 24.5);
    c.restore();
  }
}

/** Cisco: past defects cluster by meaning; a new defect pulls its nearest neighbours and is routed. */
export function drawCS(c: C, W: number, H: number, t: number) {
  const R = rng(11), ax0 = 26, ax1 = W * 0.6, ay0 = 48, ay1 = H - 26;
  label(c, 'PAST DEFECTS · 30,000+', ax0, 30); label(c, 'CO-PILOT', W * 0.64, 30);
  const C = [...Array(9)].map(() => ({ x: ax0 + 40 + R() * (ax1 - ax0 - 80), y: ay0 + 30 + R() * (ay1 - ay0 - 60) }));
  const T = 4;
  const pts = [...Array(320)].map((_, i) => {
    const k = i % 9, a = R() * 6.283, r = Math.sqrt(-2 * Math.log(R() + 1e-6)) * 16;
    return { k, i, sx: ax0 + R() * (ax1 - ax0), sy: ay0 + R() * (ay1 - ay0), x: C[k].x + Math.cos(a) * r, y: C[k].y + Math.sin(a) * r };
  });
  const q = { x: C[T].x + 14, y: C[T].y - 10 };
  const org = ease(clamp((t - 0.8) / 1));
  const nn = [...pts].sort((a, b) => Math.hypot(a.x - q.x, a.y - q.y) - Math.hypot(b.x - q.x, b.y - q.y)).slice(0, 8);
  const hl = clamp((t - 4) / 0.6);

  for (const p of pts) {
    const al = clamp((t - (p.i / 320) * 0.7) / 0.25);
    if (al <= 0) continue;
    const x = p.sx + (p.x - p.sx) * org, y = p.sy + (p.y - p.sy) * org, mine = p.k === T;
    c.globalAlpha = al * (hl > 0 && !mine ? 1 - 0.6 * hl : 1);
    c.fillStyle = mine && hl > 0 ? TH.acc : alpha(TH.ink, 0.55);
    c.beginPath(); c.arc(x, y, mine && hl > 0 ? 2.4 : 1.8, 0, 7); c.fill();
  }
  c.globalAlpha = 1;

  if (t >= 1.8) {
    const pr = clamp((t - 1.8) / 0.9);
    c.strokeStyle = alpha(TH.acc, 0.7 * (1 - pr)); c.lineWidth = 1.3;
    c.beginPath(); c.arc(q.x, q.y, 6 + pr * 30, 0, 7); c.stroke();
    nn.forEach((p, j) => edge(c, q.x, q.y, p.x, p.y, clamp((t - 2.6 - j * 0.15) / 0.4), true));
    c.globalAlpha = clamp((t - 1.8) / 0.4);
    c.fillStyle = TH.acc; c.beginPath(); c.arc(q.x, q.y, 5, 0, 7); c.fill();
    c.strokeStyle = TH.bg; c.lineWidth = 2; c.stroke();
    c.globalAlpha = 1;
    label(c, 'NEW DEFECT', q.x + 10, q.y - 10, TH.acc, 10);
  }

  const px = W * 0.64, pw = W - px - 24;
  const row = (y: number, a: string, b: string, s: number) => {
    const al = clamp((t - s) / 0.5);
    if (al <= 0) return;
    c.globalAlpha = al;
    c.font = `600 14px ${TH.font}`; c.fillStyle = TH.ink; c.textAlign = 'left'; c.fillText(a, px, y);
    c.font = `13px ${TH.font}`; c.fillStyle = TH.mute; c.fillText(b, px, y + 19);
    c.globalAlpha = 1;
  };
  row(64, 'Milvus · similarity search', '8 nearest past defects retrieved', 2.6);
  row(116, 'LangChain · RAG', 'Uses those defects as context', 4);
  const pc = clamp((t - 5.2) / 0.6);
  if (pc > 0) {
    c.globalAlpha = pc;
    box(c, px, 152, pw, 118, true);
    label(c, 'ROUTED TO A COMPONENT', px + 16, 176, TH.acc, 11);
    c.font = `700 38px ${TH.font}`; c.fillStyle = TH.ink; c.fillText('77%', px + 16, 220);
    c.font = `13px ${TH.font}`; c.fillStyle = TH.mute;
    c.fillText('component-prediction accuracy', px + 16, 242); c.fillText('across 135+ components', px + 16, 259);
    c.globalAlpha = 1;
  }
}
