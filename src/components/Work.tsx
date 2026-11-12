import OrgMark from './OrgMark';
import { useEffect, useRef, useState } from 'react';
import { work, type WorkKey } from '../content';
import { BOUNDS, TH, drawCS, drawMS, readTheme } from '../lib/viz';
import { useReveal } from '../lib/useReveal';

/**
 * Internship architecture. Each diagram plays slowly once when it scrolls into view, then rests on the
 * finished state. Steps are buttons: click to jump. Replay any time.
 */
export default function Work() {
  const [key, setKey] = useState<WorkKey>('ms');
  const [step, setStep] = useState(4);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ t: 99, playing: false, seen: false, key: 'ms' as WorkKey, step: 4 });
  const card = useReveal<HTMLDivElement>();
  const d = work[key];

  useEffect(() => {
    const cv = cvRef.current!, c = cv.getContext('2d')!, s = state.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 720, H = 320, raf = 0, prev = 0;
    const fit = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = Math.max(720, cv.clientWidth);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const paint = (t: number) => {
      c.clearRect(0, 0, W, H); c.fillStyle = TH.bg; c.fillRect(0, 0, W, H);
      (s.key === 'ms' ? drawMS : drawCS)(c, W, H, t);
    };
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - (prev || now)) / 1000); prev = now;
      const b = BOUNDS[s.key], D = b[5];
      if (s.playing) { s.t += dt * 0.9; if (s.t >= D) { s.t = D; s.playing = false; } }
      const t = Math.min(s.t, D);
      paint(t);
      let a = 4; for (let i = 0; i < 5; i++) if (t < b[i + 1]) { a = i; break; }
      if (a !== s.step) { s.step = a; setStep(a); }
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !s.seen) { s.seen = true; if (!reduced) { s.t = 0; s.playing = true; } }
    }, { threshold: 0.45 });
    const vis = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf); raf = 0;
      if (e.isIntersecting) { prev = 0; raf = requestAnimationFrame(frame); }
    });
    const ro = new ResizeObserver(fit);
    const onTheme = () => { readTheme(); paint(Math.min(s.t, BOUNDS[s.key][5])); };
    window.addEventListener('sk-theme', onTheme);
    readTheme(); fit(); ro.observe(cv); io.observe(cv); vis.observe(cv);
    document.fonts.ready.then(() => { if (!raf) { prev = 0; raf = requestAnimationFrame(frame); } });
    return () => { cancelAnimationFrame(raf); io.disconnect(); vis.disconnect(); ro.disconnect(); window.removeEventListener('sk-theme', onTheme); };
  }, []);

  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // hero internship chips ask for a diagram: select it and play it from the start
  useEffect(() => {
    const on = (e: Event) => {
      const k = (e as CustomEvent<WorkKey>).detail, s = state.current;
      setKey(k); s.key = k; s.seen = true; s.t = reduced() ? 99 : 0; s.playing = !reduced();
    };
    window.addEventListener('sk-work', on);
    return () => window.removeEventListener('sk-work', on);
  }, []);
  const choose = (k: WorkKey) => {
    setKey(k);
    const s = state.current;
    s.key = k; s.t = reduced() ? 99 : 0; s.playing = !reduced();
  };
  const replay = () => { const s = state.current; s.t = reduced() ? 99 : 0; s.playing = !reduced(); };
  const jump = (i: number) => { const s = state.current; s.playing = false; s.t = BOUNDS[s.key][i + 1] - 0.001; };

  return (
    <section id="work" className="sec" aria-labelledby="work-h">
      <div className="wrap">
        <h2 id="work-h">Inside the work</h2>
        <p className="sub">Two internship systems, animated the way they actually run.</p>
        <div className="card viz" ref={card}>
          <div className="viz-head">
            <div className="tabs" role="group" aria-label="Choose a project">
              {(Object.keys(work) as WorkKey[]).map((k) => (
                <button key={k} type="button" aria-pressed={key === k} onClick={() => choose(k)}>
                  <OrgMark org={work[k].org} size={14} />{work[k].org} · {work[k].name}
                </button>
              ))}
            </div>
            <button type="button" className="replay" onClick={replay}>↻ Replay</button>
          </div>
          <p className="viz-lead">{d.lead}</p>
          <div className="viz-canvas">
            <canvas ref={cvRef} role="img" aria-label={`${d.org} ${d.name}: ${d.steps.map((s) => s.join(' ')).join(', then ')}.`} />
          </div>
          <ol className="steps">
            {d.steps.map(([a, b], i) => (
              <li key={a}>
                <button type="button" className={i === step ? 'on' : i < step ? 'done' : undefined} aria-current={i === step ? 'step' : undefined} onClick={() => jump(i)}>
                  <b>{i + 1}. {a}</b><span>{b}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="viz-foot">
            <dl className="metrics">
              {d.metrics.map(([v, l]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}
            </dl>
            <ul className="stack">{d.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}
