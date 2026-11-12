import TechIcon from './TechIcon';
import { coreCS, projects, skills } from '../content';
import { useReveal } from '../lib/useReveal';

/** which projects used each technology (from the project stacks) */
const usedIn: Record<string, string[]> = {};
for (const p of projects) for (const s of p.stack) (usedIn[s] ||= []).push(p.name);

/** Every technology as a logo tile, grouped by area. Tiles used in a project say where on hover or focus. */
export default function Skills() {
  const body = useReveal<HTMLDivElement>();
  return (
    <section id="skills" className="sec" aria-labelledby="skills-h">
      <div className="wrap">
        <h2 id="skills-h">Skills</h2>
        <p className="sub">What I build with. Hover a logo to see where I used it.</p>
        <div className="card skills" ref={body}>
          {skills.map((g) => (
            <div key={g.area} className="skill-row">
              <h3 className="skill-area">{g.area}</h3>
              <ul className="tiles">
                {g.items.map((s) => {
                  const used = usedIn[s];
                  return (
                    <li key={s} className={`tile${used ? ' has-use' : ''}`} tabIndex={used ? 0 : undefined}
                      aria-label={used ? `${s}, used in ${used.join(' and ')}` : undefined}>
                      <TechIcon name={s} />
                      <span>{s}</span>
                      {used && <span className="tile-tip" aria-hidden="true">Used in {used.join(', ')}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="skill-row">
            <h3 className="skill-area">Core CS</h3>
            <ul className="tiles">{coreCS.map((s) => <li key={s} className="tile tile-text">{s}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}
