import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { siGithub } from 'simple-icons';
import { person, profiles, resume } from '../content';
import { copyText } from '../lib/useCopy';
import { usePosts } from '../lib/blog';
import { ArrowOut, Mail } from './Icons';
import ThemeToggle from './ThemeToggle';

/** Page order: Achievements, Projects, Skills, Stats, Work, Ask. */
const SECTIONS = [
  { id: 'achievements', label: 'Achievements' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'stats', label: 'Stats' },
  { id: 'work', label: 'Work' },
  { id: 'ask', label: 'Ask' },
];
const href = (l: string) => profiles.find((p) => p.label === l)!.href;

/**
 * Sticky top bar in three columns: monogram + name · centred sections (one sliding underline marks the
 * current one) · icon tools, a divider, and the one solid button: Résumé. Transparent over the hero.
 */
export default function Bar({ onBlog }: { onBlog: boolean }) {
  const { posts } = usePosts();
  const [active, setActive] = useState(onBlog ? 'blog' : '');
  const [scrolled, setScrolled] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const ind = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(scrollY > 8);
      if (!onBlog && scrollY < innerHeight * 0.4) setActive('');
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    if (onBlog) return () => removeEventListener('scroll', onScroll);
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) setActive(e.target.id);
    }, { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); };
  }, [onBlog]);

  // slide the underline under the current link
  useLayoutEffect(() => {
    const place = () => {
      const a = nav.current?.querySelector<HTMLElement>(`[data-id="${active}"]`), el = ind.current;
      if (!el) return;
      if (!a) { el.style.opacity = '0'; return; }
      el.style.opacity = '1';
      el.style.width = `${a.offsetWidth - 24}px`;
      el.style.transform = `translateX(${a.offsetLeft + 12}px)`;
    };
    place();
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [active, posts.length]);

  return (
    <header className={`bar${scrolled || onBlog ? ' is-scrolled' : ''}`}>
      <a className="skip" href="#main">Skip to content</a>
      <div className="wrap bar-inner">
        <a className="me" href="/" aria-label={`${person.name}, home`}>
          <span className="mono" aria-hidden="true">S<i>K</i></span>
          <span className="me-name">{person.name}</span>
        </a>
        <nav className="sections" aria-label="Sections" ref={nav}>
          {SECTIONS.map((s) => (
            <a key={s.id} data-id={s.id} href={`/#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>{s.label}</a>
          ))}
          {posts.length > 0 && <a data-id="blog" href="/blog" aria-current={onBlog ? 'page' : undefined}>Blog</a>}
          <span className="ind" ref={ind} aria-hidden="true" />
        </nav>
        <div className="bar-right">
          <a className="icon-btn" href={href('GitHub')} target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d={siGithub.path} fill="currentColor" /></svg>
          </a>
          <a className="icon-btn" href={href('LinkedIn')} target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" />
              <path d="M7 10v7M7 7v.01M11 17v-7m0 3.2c0-1.9 1.2-3.2 2.8-3.2s2.7 1.1 2.7 3.1V17" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </a>
          <button type="button" className="icon-btn" onClick={() => copyText(person.email, `Email copied · ${person.email}`)} aria-label={`Copy email address ${person.email}`} title="Copy email">
            <Mail />
          </button>
          <ThemeToggle />
          <span className="bar-div" aria-hidden="true" />
          <a className="res" href={resume.href} target="_blank" rel="noopener">Résumé <ArrowOut /></a>
        </div>
      </div>
    </header>
  );
}
