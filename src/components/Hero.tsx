import RippleField from './RippleField';
import CountUp from './CountUp';
import { internships, person, proof, resume, type WorkKey } from '../content';
import { Download } from './Icons';
import OrgMark from './OrgMark';
import { useStats } from '../lib/stats';

/** Tell the work section which diagram to show (it plays it from the start). */
const openWork = (key: WorkKey) => window.dispatchEvent(new CustomEvent<WorkKey>('sk-work', { detail: key }));

/** First screen, read in one pass: status → name → what I build → where I interned → four proof numbers. */
export default function Hero() {
  const stats = useStats();
  return (
    <section id="top" className="hero" aria-label="Introduction">
      <RippleField />
      <div className="wrap hero-inner">
        <span className="status">{person.lookingFor}</span>
        <h1 className="name">Sanika Khanduja<span className="dot" aria-hidden="true">.</span></h1>
        <p className="tagline">{person.tagline}</p>
        <a className="cta" href={resume.href} download={resume.file}>
          <Download /> Download résumé
        </a>
        <div className="interned">
          <span className="int-label">Interned at</span>
          {internships.map((c) => (
            <a key={c.key} className="co" href="#work" onClick={() => openWork(c.key)} aria-label={`${c.org} ${c.year}, ${c.what}. See how it works.`}>
              <OrgMark org={c.org} />
              <span className="co-text">
                <span className="co-name">{c.org}<span className="co-yr">{c.year}</span></span>
                <span className="co-what">{c.what}</span>
              </span>
              <svg className="co-go" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3v10m0 0-4-4m4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          ))}
          <span className="edu">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            B.Tech CSE, IGDTUW ’27
          </span>
        </div>
        <ul className="proof">
          {proof.map((p) => (
            <li key={p.src}>
              <small>{p.src}{p.live && stats.live.leetcode && <span className="live-dot" title="Live" />}</small>
              <b><CountUp value={p.live ? stats.leetcode.rating : p.value} decimals={p.decimals} suffix={p.suffix} /></b>
              <span>{p.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
