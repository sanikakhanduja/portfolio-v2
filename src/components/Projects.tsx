import OrgMark from './OrgMark';
import { useRef } from 'react';
import Pipeline, { type PipelineHandle } from './Pipeline';
import TechIcon from './TechIcon';
import { ArrowOut } from './Icons';
import { projects, type WorkKey } from '../content';
import { rippleFrom } from '../lib/ripple';
import { useReveal } from '../lib/useReveal';

const openWork = (k: WorkKey) => {
  window.dispatchEvent(new CustomEvent<WorkKey>('sk-work', { detail: k }));
  document.getElementById('work')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
};

/** Every project at a glance: result, one line, its architecture as a five-step pipeline, the stack, the links. */
export default function Projects() {
  const grid = useReveal<HTMLDivElement>();
  return (
    <section id="projects" className="sec" aria-labelledby="proj-h">
      <div className="wrap">
        <h2 id="proj-h">Projects</h2>
        <p className="sub">Each card shows how the system works. Hover a card to replay it.</p>
        <div className="proj-grid" ref={grid}>
          {projects.map((p) => <ProjectCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p }: { p: (typeof projects)[number] }) {
  const pipe = useRef<PipelineHandle>(null);
  return (
    <article className="card proj" onPointerEnter={(e) => { rippleFrom(e); pipe.current?.replay(); }}>
      <header className="proj-head">
        <span className="proj-meta"><OrgMark org={p.org} size={13} />{p.org} · {p.year}{p.internal && <span className="tag">Internship</span>}</span>
        <h3>{p.name}</h3>
      </header>
      <p className="proj-result"><b>{p.result.value}</b><span>{p.result.label}</span></p>
      <p className="proj-desc">{p.description}</p>
      <Pipeline ref={pipe} stages={p.stages} label={p.name} />
      <footer className="proj-foot">
        <ul className="proj-stack" aria-label="Tech used">
          {p.stack.map((s) => <li key={s}><TechIcon name={s} size={14} />{s}</li>)}
        </ul>
        <div className="proj-links">
          {p.work && <button type="button" onClick={() => openWork(p.work!)}>Full architecture ↓</button>}
          {p.links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noopener">{l.label}<ArrowOut /></a>)}
        </div>
      </footer>
    </article>
  );
}
