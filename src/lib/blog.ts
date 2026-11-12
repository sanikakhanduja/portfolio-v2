import { useEffect, useState } from 'react';

export type Post = { title: string; url: string; date: string; minutes: number | null; tags: string[]; summary: string };
type Blog = { loaded: boolean; configured: boolean; posts: Post[] };

let cache: Promise<Blog> | null = null;
const load = () =>
  (cache ??= fetch('/api/blog')
    .then((r) => r.json())
    .then((d) => ({ loaded: true, configured: !!d.configured, posts: d.posts ?? [] }))
    .catch(() => ({ loaded: true, configured: false, posts: [] })));

export function usePosts(): Blog {
  const [b, setB] = useState<Blog>({ loaded: false, configured: false, posts: [] });
  useEffect(() => { let on = true; load().then((v) => on && setB(v)); return () => { on = false; }; }, []);
  return b;
}

export const postDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
