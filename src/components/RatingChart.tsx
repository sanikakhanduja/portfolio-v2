import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

export type Point = { t: number; r: number; name: string };

const fmtDate = (t: number, long = false) =>
  new Date(t * 1000).toLocaleDateString('en-GB', long ? { day: 'numeric', month: 'short', year: 'numeric' } : { month: 'short', year: 'numeric' });

/** Clean tick values: 3–5 round numbers covering [lo, hi]. */
function ticks(lo: number, hi: number) {
  const span = hi - lo;
  const step = [25, 50, 100, 200, 250, 500].find((s) => span / s <= 4) ?? 1000;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) out.push(v);
  return out;
}

/**
 * One platform's contest rating over time (single series, so the card title names it; no legend).
 * Line draws itself once when scrolled into view. Hover / touch-drag / arrow keys move a crosshair
 * with a tooltip. A visually hidden table carries every value for screen readers.
 */
export default function RatingChart({ data, label }: { data: Point[]; label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(480);
  const [drawn, setDrawn] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const gradId = useId();
  const H = 190, PAD = { l: 44, r: 14, t: 14, b: 26 };

  useEffect(() => {
    const el = wrap.current!;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setDrawn(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  const g = useMemo(() => {
    const t0 = data[0].t, t1 = data[data.length - 1].t;
    const rs = data.map((d) => d.r);
    const pad = Math.max(40, (Math.max(...rs) - Math.min(...rs)) * 0.12);
    const lo = Math.min(...rs) - pad, hi = Math.max(...rs) + pad;
    const x = (t: number) => PAD.l + ((t - t0) / Math.max(1, t1 - t0)) * (w - PAD.l - PAD.r);
    const y = (r: number) => PAD.t + (1 - (r - lo) / (hi - lo)) * (H - PAD.t - PAD.b);
    const pts = data.map((d) => [x(d.t), y(d.r)] as const);
    const line = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`).join('');
    const area = `${line}L${pts[pts.length - 1][0].toFixed(1)},${H - PAD.b}L${pts[0][0].toFixed(1)},${H - PAD.b}Z`;
    return { pts, line, area, y, yt: ticks(lo, hi) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, w]);

  const pick = (clientX: number) => {
    const r = wrap.current!.getBoundingClientRect(), mx = clientX - r.left;
    let best = 0;
    g.pts.forEach(([px], i) => { if (Math.abs(px - mx) < Math.abs(g.pts[best][0] - mx)) best = i; });
    setHover(best);
  };
  const onMove = (e: PointerEvent) => pick(e.clientX);
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const last = data.length - 1, cur = hover ?? last;
    setHover(e.key === 'Home' ? 0 : e.key === 'End' ? last : Math.max(0, Math.min(last, cur + (e.key === 'ArrowLeft' ? -1 : 1))));
  };

  const h = hover !== null ? data[hover] : null;
  const hp = hover !== null ? g.pts[hover] : null;
  const end = g.pts[g.pts.length - 1], first = data[0];
  const tipLeft = hp ? Math.min(Math.max(hp[0], 90), w - 90) : 0;

  return (
    <div className="rchart" ref={wrap}>
      <div
        className={`rchart-plot${drawn ? ' is-drawn' : ''}`}
        tabIndex={0}
        role="img"
        aria-label={`${label}: from ${first.r} in ${fmtDate(first.t)} to ${data[data.length - 1].r} in ${fmtDate(data[data.length - 1].t)}, over ${data.length} contests. Use left and right arrow keys to read each contest.`}
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
        onKeyDown={onKey}
        onBlur={() => setHover(null)}
      >
        <svg width={w} height={H} aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--chart)" stopOpacity="0.14" />
              <stop offset="1" stopColor="var(--chart)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {g.yt.map((v) => (
            <g key={v}>
              <line x1={PAD.l} x2={w - PAD.r} y1={g.y(v)} y2={g.y(v)} className="rc-grid" />
              <text x={PAD.l - 8} y={g.y(v) + 4} className="rc-tick" textAnchor="end">{v.toLocaleString('en-US')}</text>
            </g>
          ))}
          <text x={PAD.l} y={H - 6} className="rc-tick">{fmtDate(first.t)}</text>
          <text x={w - PAD.r} y={H - 6} className="rc-tick" textAnchor="end">{fmtDate(data[data.length - 1].t)}</text>

          <path d={g.area} fill={`url(#${gradId})`} className="rc-area" />
          <path d={g.line} pathLength={1} className="rc-line" />
          {/* start value, muted: the story is the climb */}
          <circle cx={g.pts[0][0]} cy={g.pts[0][1]} r={3} className="rc-start" />
          <circle cx={end[0]} cy={end[1]} r={4.5} className="rc-end" />

          {hp && (
            <g className="rc-hover">
              <line x1={hp[0]} x2={hp[0]} y1={PAD.t} y2={H - PAD.b} className="rc-cross" />
              <circle cx={hp[0]} cy={hp[1]} r={5} className="rc-end" />
            </g>
          )}
        </svg>

        {h && hp && (
          <div className="rc-tip" style={{ left: tipLeft, top: Math.max(0, hp[1] - 78) }} aria-hidden="true">
            <b>{h.r.toLocaleString('en-US')}</b>
            {hover! > 0 && (
              <span className={`rc-delta ${h.r >= data[hover! - 1].r ? 'up' : 'down'}`}>
                {h.r >= data[hover! - 1].r ? '▲' : '▼'} {Math.abs(h.r - data[hover! - 1].r)}
              </span>
            )}
            <span className="rc-name">{h.name}</span>
            <span className="rc-date">{fmtDate(h.t, true)}</span>
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">{h ? `${h.name}, ${fmtDate(h.t, true)}: rating ${h.r}` : ''}</p>

      <div className="sr-only"><table>
        <caption>{label}, by contest</caption>
        <thead><tr><th>Contest</th><th>Date</th><th>Rating</th></tr></thead>
        <tbody>{data.map((d) => <tr key={d.t}><td>{d.name}</td><td>{fmtDate(d.t, true)}</td><td>{d.r}</td></tr>)}</tbody>
      </table></div>
    </div>
  );
}
