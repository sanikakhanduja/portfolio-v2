import { useEffect, useRef, useState } from 'react';

const fmt = (v: number, d: number) => (d ? v.toFixed(d) : Math.round(v).toLocaleString('en-US'));
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Counts up once when it first scrolls into view. If the value later changes (live data arrives),
 * it glides from the old value to the new one. Screen readers get the final value.
 */
export default function CountUp({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // start at 0 so on-screen numbers don't flash their final value before counting (reduced motion: final value)
  const [shown, setShown] = useState(() => (reduced() ? value : 0));
  const seen = useRef(false);
  const from = useRef(value);

  const animate = (a: number, b: number) => {
    if (reduced()) { setShown(b); return () => {}; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1300), e = 1 - (1 - p) ** 3;
      setShown(a + (b - a) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  };

  useEffect(() => {
    const el = ref.current!;
    let stop = () => {};
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      seen.current = true;
      stop = animate(0, value);
      from.current = value;
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!seen.current || from.current === value) return;
    const stop = animate(from.current, value);
    from.current = value;
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} className="count">
      <span aria-hidden="true">{fmt(shown, decimals)}{suffix}</span>
      <span className="sr-only">{fmt(value, decimals)}{suffix}</span>
    </span>
  );
}
