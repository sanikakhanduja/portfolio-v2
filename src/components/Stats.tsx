import CountUp from './CountUp';
import RatingChart from './RatingChart';
import { ArrowOut } from './Icons';
import { profiles } from '../content';
import { useStats } from '../lib/stats';
import { useReveal } from '../lib/useReveal';

const href = (label: string) => profiles.find((p) => p.label === label)!.href;
const day = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Coding stats: one rating chart per platform (different rating scales, so never one shared axis). */
export default function Stats() {
  const s = useStats();
  const grid = useReveal<HTMLDivElement>(), strip = useReveal<HTMLDivElement>();
  const live = s.live.leetcode || s.live.codeforces;
  const lc = s.leetcode, cf = s.codeforces;
  const cards = [
    { key: 'lc', title: 'LeetCode contest rating', link: href('LeetCode'), live: s.live.leetcode, value: lc.rating, history: lc.history,
      meta: `Top ${lc.topPercent}% worldwide · ${lc.history.length} contests` },
    { key: 'cf', title: 'Codeforces rating', link: href('Codeforces'), live: s.live.codeforces, value: cf.rating, history: cf.history,
      meta: `Max ${cf.maxRating} · ${cf.history.length} rated contests` },
  ];

  return (
    <section id="stats" className="sec" aria-labelledby="stats-h">
      <div className="wrap">
        <h2 id="stats-h">Coding stats</h2>
        <p className="sub">{live ? 'Live from my profiles. Hover a chart to see each contest.' : `From my profiles, last checked ${day(s.fetchedAt)}.`}</p>

        <div className="rating-grid" ref={grid}>
          {cards.map((c) => {
            const gain = c.history[c.history.length - 1].r - c.history[0].r;
            return (
              <article key={c.key} className="card rating-card">
                <header className="rc-head">
                  <a className="src" href={c.link} target="_blank" rel="noopener">
                    {c.live && <span className="live-dot" title="Live" />}{c.title}<ArrowOut />
                  </a>
                  <div className="rc-figure">
                    <b><CountUp value={c.value} /></b>
                    <span className="rc-gain">▲ {gain.toLocaleString('en-US')} since first contest</span>
                  </div>
                  <span className="stat-sub">{c.meta}</span>
                </header>
                <RatingChart data={c.history} label={c.title} />
              </article>
            );
          })}
        </div>

        <div className="card solved" ref={strip}>
          <b><CountUp value={lc.solved + cf.solved} /></b>
          <span>problems solved · <strong>{lc.solved}</strong> on LeetCode · <strong>{cf.solved}</strong> on Codeforces</span>
        </div>
      </div>
    </section>
  );
}
