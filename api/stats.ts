import { getStats } from './_lib/stats';

/** GET /api/stats — cached at the edge for an hour, served stale for a day while it refreshes. */
export async function GET() {
  const stats = await getStats();
  return Response.json(stats, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
