import { usePosts, postDate, type Post } from '../lib/blog';
import { ArrowOut } from './Icons';
import { useReveal } from '../lib/useReveal';

function PostRow({ p }: { p: Post }) {
  return (
    <li>
      <a className="post" href={p.url} target="_blank" rel="noopener">
        <span className="post-meta">{postDate(p.date)}{p.minutes ? ` · ${p.minutes} min read` : ''}</span>
        <span className="post-title">{p.title}<ArrowOut /></span>
        {p.summary && <span className="post-sum">{p.summary}</span>}
        {p.tags.length > 0 && <span className="post-tags">{p.tags.slice(0, 4).map((t) => <span key={t}>{t}</span>)}</span>}
      </a>
    </li>
  );
}

/** Home teaser: the three latest posts. Renders nothing until there are posts. */
export function BlogTeaser() {
  const { posts } = usePosts();
  const card = useReveal<HTMLDivElement>();
  if (!posts.length) return null;
  return (
    <section id="blog" className="sec" aria-labelledby="blog-h">
      <div className="wrap">
        <div className="sec-head">
          <div><h2 id="blog-h">Writing</h2><p className="sub">Notes on what I’m learning.</p></div>
          <a className="more" href="/blog">All posts →</a>
        </div>
        <div className="card" ref={card}><ul className="posts">{posts.slice(0, 3).map((p) => <PostRow key={p.url} p={p} />)}</ul></div>
      </div>
    </section>
  );
}

/** /blog: every post, newest first. */
export function BlogPage() {
  const { loaded, posts } = usePosts();
  return (
    <section className="sec blog-page" aria-labelledby="blogp-h">
      <div className="wrap">
        <a className="back" href="/">← Back to portfolio</a>
        <h1 id="blogp-h" className="page-title">Writing</h1>
        <p className="sub">Notes on the tech I’m learning.</p>
        <div className="card">
          {!loaded ? <p className="empty">Loading posts…</p>
            : posts.length ? <ul className="posts">{posts.map((p) => <PostRow key={p.url} p={p} />)}</ul>
            : <p className="empty">The first posts are on their way.</p>}
        </div>
      </div>
    </section>
  );
}
