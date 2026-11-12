/**
 * Live coding stats, fetched server-side (LeetCode's API does not allow browser requests).
 * Every source fails independently; the client falls back to the last values it knows.
 */
const LEETCODE_USER = 'skz0812';
const CODEFORCES_USER = 'sanakhanduja';

/** One rated contest: unix seconds, rating after it, contest name. */
export type RatingPoint = { t: number; r: number; name: string };

export type Stats = {
  leetcode: { rating: number; contests: number; topPercent: number; solved: number; history: RatingPoint[] } | null;
  codeforces: { rating: number; maxRating: number; rank: string; solved: number; history: RatingPoint[] } | null;
  fetchedAt: string;
};

async function get(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function leetcode(): Promise<Stats['leetcode']> {
  const query = `query($u: String!) {
    userContestRanking(username: $u) { rating attendedContestsCount topPercentage }
    userContestRankingHistory(username: $u) { attended rating contest { title startTime } }
    matchedUser(username: $u) { submitStatsGlobal { acSubmissionNum { difficulty count } } }
  }`;
  const { data } = await get('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
    body: JSON.stringify({ query, variables: { u: LEETCODE_USER } }),
  });
  const all = data.matchedUser.submitStatsGlobal.acSubmissionNum.find((d: { difficulty: string }) => d.difficulty === 'All');
  return {
    rating: Math.round(data.userContestRanking.rating),
    contests: data.userContestRanking.attendedContestsCount,
    topPercent: data.userContestRanking.topPercentage,
    solved: all.count,
    history: data.userContestRankingHistory
      .filter((h: { attended: boolean }) => h.attended)
      .map((h: { rating: number; contest: { title: string; startTime: number } }) => ({ t: h.contest.startTime, r: Math.round(h.rating), name: h.contest.title })),
  };
}

async function codeforces(): Promise<Stats['codeforces']> {
  const [info, status, rating] = await Promise.all([
    get(`https://codeforces.com/api/user.info?handles=${CODEFORCES_USER}`),
    get(`https://codeforces.com/api/user.status?handle=${CODEFORCES_USER}`),
    get(`https://codeforces.com/api/user.rating?handle=${CODEFORCES_USER}`),
  ]);
  const u = info.result[0];
  const solved = new Set<string>();
  for (const s of status.result) if (s.verdict === 'OK') solved.add(`${s.problem.contestId}-${s.problem.index}`);
  const history = rating.result.map((c: { ratingUpdateTimeSeconds: number; newRating: number; contestName: string }) => ({
    t: c.ratingUpdateTimeSeconds, r: c.newRating, name: c.contestName,
  }));
  return { rating: u.rating, maxRating: u.maxRating, rank: u.rank, solved: solved.size, history };
}

export async function getStats(): Promise<Stats> {
  const [lc, cf] = await Promise.allSettled([leetcode(), codeforces()]);
  return {
    leetcode: lc.status === 'fulfilled' ? lc.value : null,
    codeforces: cf.status === 'fulfilled' ? cf.value : null,
    fetchedAt: new Date().toISOString(),
  };
}
