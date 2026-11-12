import { useEffect, useRef } from 'react';
import { cssVar } from '../lib/theme';

/**
 * The signature: a quiet field of dots. Moving the cursor sends faint rings outward through it,
 * like a change spreading (the idea behind the Microsoft project). One soft ambient ring every few seconds.
 */
const GAP = 24, SPEED = 240, BAND = 36;
const SIZES = [1.6, 2, 2.4, 2.8];
/** quiet → hit, from the theme tokens --dot-0..3 */
const readColors = () => [0, 1, 2, 3].map((i) => cssVar(`--dot-${i}`));

export default function RippleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!, host = cv.parentElement!, c = cv.getContext('2d')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, dots = new Float32Array(0);
    const rings: { x: number; y: number; t: number; a: number }[] = [];
    let last = { x: -1e4, y: -1e4 }, ambient = 1.5, raf = 0, prev = 0, visible = true, COLORS = readColors();

    const fit = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const pts: number[] = [];
      for (let y = GAP / 2; y < H; y += GAP) for (let x = GAP / 2; x < W; x += GAP) pts.push(x, y);
      dots = Float32Array.from(pts);
      draw();
    };

    const draw = () => {
      c.clearRect(0, 0, W, H);
      const lv: number[][] = [[], [], [], []];
      for (let i = 0; i < dots.length; i += 2) {
        let x = dots[i], y = dots[i + 1], h = 0;
        for (const r of rings) {
          const R = r.t * SPEED, dx = x - r.x, dy = y - r.y, d = Math.hypot(dx, dy) + 0.01, w = Math.abs(d - R);
          if (w < BAND) {
            const k = (1 - w / BAND) * r.a * Math.max(0, 1 - R / 900);
            h += k; x += (dx / d) * k * 5; y += (dy / d) * k * 5;
          }
        }
        lv[h > 0.45 ? 3 : h > 0.2 ? 2 : h > 0.05 ? 1 : 0].push(x, y);
      }
      lv.forEach((a, j) => {
        const s = SIZES[j];
        c.fillStyle = COLORS[j]; c.beginPath();
        for (let i = 0; i < a.length; i += 2) c.rect(a[i] - s / 2, a[i + 1] - s / 2, s, s);
        c.fill();
      });
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - (prev || now)) / 1000); prev = now;
      if (!reduced) {
        ambient -= dt;
        if (ambient <= 0) { ambient = 5 + Math.random() * 3; rings.push({ x: W * (0.55 + Math.random() * 0.4), y: H * (0.2 + Math.random() * 0.6), t: 0, a: 0.45 }); }
      }
      for (const r of rings) r.t += dt;
      while (rings.length && rings[0].t * SPEED > Math.hypot(W, H)) rings.shift();
      draw();
      raf = visible && (rings.length || !reduced) ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => { if (!raf && visible) { prev = 0; raf = requestAnimationFrame(frame); } };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (y < 0 || y > H) return;
      if (Math.hypot(x - last.x, y - last.y) > 120 && rings.length < 5) { rings.push({ x, y, t: 0, a: 0.9 }); last = { x, y }; wake(); }
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); });
    const ro = new ResizeObserver(fit);
    io.observe(host); ro.observe(cv);
    const onTheme = () => { COLORS = readColors(); draw(); };
    host.addEventListener('pointermove', onMove);
    window.addEventListener('sk-theme', onTheme);
    fit(); wake();
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); host.removeEventListener('pointermove', onMove); window.removeEventListener('sk-theme', onTheme); };
  }, []);

  return <canvas ref={ref} className="ripple" aria-hidden="true" />;
}
