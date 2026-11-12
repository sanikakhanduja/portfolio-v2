/**
 * Blog posts from the platform Sanika writes on. Set BLOG once she picks one:
 *   { platform: 'hashnode', user: 'sanika.hashnode.dev' }   ← her publication host
 *   { platform: 'medium',   user: 'sanikakhanduja' }        ← her @username
 *   { platform: 'devto',    user: 'sanikakhanduja' }        ← her username
 * While platform is null, the site shows no blog section and /blog says posts are coming.
 */
export const BLOG: { platform: 'hashnode' | 'medium' | 'devto' | null; user: string } = { platform: null, user: '' };

export type Post = { title: string; url: string; date: string; minutes: number | null; tags: string[]; summary: string };

const timeout = () => AbortSignal.timeout(8000);
const strip = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const clip = (s: string, n = 180) => (s.length > n ? `${s.slice(0, n).replace(/\s+\S*$/, '')}…` : s);

async function devto(user: string): Promise<Post[]> {
  const res = await fetch(`https://dev.to/api/articles?username=${encodeURIComponent(user)}&per_page=30`, { signal: timeout() });
  const list = await res.json();
  return list.map((a: { title: string; url: string; published_at: string; reading_time_minutes: number; tag_list: string[]; description: string }) => ({
    title: a.title, url: a.url, date: a.published_at, minutes: a.reading_time_minutes, tags: a.tag_list, summary: a.description,
  }));
}

async function hashnode(host: string): Promise<Post[]> {
  const query = `query($h: String!) { publication(host: $h) { posts(first: 30) { edges { node {
    title url publishedAt readTimeInMinutes brief tags { name } } } } } }`;
  const res = await fetch('https://gql.hashnode.com', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { h: host } }), signal: timeout(),
  });
  const { data } = await res.json();
  return (data?.publication?.posts.edges ?? []).map(({ node: n }: { node: { title: string; url: string; publishedAt: string; readTimeInMinutes: number; brief: string; tags: { name: string }[] } }) => ({
    title: n.title, url: n.url, date: n.publishedAt, minutes: n.readTimeInMinutes, tags: n.tags.map((t) => t.name), summary: clip(n.brief),
  }));
}

async function medium(user: string): Promise<Post[]> {
  const res = await fetch(`https://medium.com/feed/@${encodeURIComponent(user)}`, { signal: timeout() });
  const xml = await res.text();
  const tag = (block: string, t: string) => (block.match(new RegExp(`<${t}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${t}>`)) ?? [])[1] ?? '';
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
    const body = strip(tag(it, 'content:encoded'));
    return {
      title: strip(tag(it, 'title')), url: tag(it, 'link').split('?')[0], date: new Date(tag(it, 'pubDate')).toISOString(),
      minutes: Math.max(1, Math.round(body.split(' ').length / 230)),
      tags: [...it.matchAll(/<category>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/g)].map((m) => m[1]),
      summary: clip(body),
    };
  });
}

export async function getPosts(): Promise<{ configured: boolean; posts: Post[] }> {
  const { platform, user } = BLOG;
  if (!platform || !user) return { configured: false, posts: [] };
  const posts = await (platform === 'devto' ? devto(user) : platform === 'hashnode' ? hashnode(user) : medium(user));
  posts.sort((a, b) => b.date.localeCompare(a.date));
  return { configured: true, posts };
}
