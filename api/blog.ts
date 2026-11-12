import { getPosts } from './_lib/blog';

/** GET /api/blog — posts from the configured platform, cached for an hour. */
export async function GET() {
  try {
    return Response.json(await getPosts(), { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
  } catch {
    return Response.json({ configured: true, posts: [], error: 'unreachable' }, { status: 200 });
  }
}
