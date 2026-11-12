import CountUp from './CountUp';
import { highlights, leadership, results } from '../content';
import { rippleFrom } from '../lib/ripple';
import { useReveal } from '../lib/useReveal';

/** Main focus: three headline results first, then the rest and leadership in two quiet lists. */
export default function Achievements() {
  const top = useReveal<HTMLDivElement>(), more = useReveal<HTMLDivElement>();
  return (
    <section id="achievements" className="sec" aria-labelledby="ach-h">
      <div className="wrap">
        <h2 id="ach-h">Achievements</h2>
        <p className="sub">Competitions, academics and leadership.</p>

        <div className="hl-grid" ref={top}>
          {highlights.map((h) => (
            <article key={h.event} className="card hl" onPointerEnter={rippleFrom}>
              <p className="hl-num">
                {h.pre && <span className="hl-pre">{h.pre}</span>}
                <CountUp value={h.count} decimals={h.count % 1 ? 1 : 0} suffix={h.suf} />
              </p>
              <h3 className="hl-event">{h.event}</h3>
              <p className="hl-title">{h.title}</p>
              <p className="hl-detail">{h.detail}</p>
            </article>
          ))}
        </div>

        <div className="ach-more" ref={more}>
          <div className="card list-card">
            <h3 className="list-h">More results</h3>
            <ul className="rows">
              {results.map((r) => (
                <li key={r.event}>
                  <span className="row-main"><b>{r.event}</b><span className="row-detail">{r.detail}</span></span>
                  <span className="pill">{r.result}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card list-card">
            <h3 className="list-h">Leadership</h3>
            <ul className="rows">
              {leadership.map((l) => (
                <li key={l.role}><span className="row-main"><b>{l.role}</b><span className="row-detail">{l.detail}</span></span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
