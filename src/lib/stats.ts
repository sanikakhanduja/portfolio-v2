import { useEffect, useState } from 'react';
import { statsFallback } from '../content';

export type Stats = {
  leetcode: typeof statsFallback.leetcode;
  codeforces: typeof statsFallback.codeforces;
  fetchedAt: string;
  live: { leetcode: boolean; codeforces: boolean };
};

const initial: Stats = { ...statsFallback, live: { leetcode: false, codeforces: false } };
let cache: Promise<Stats> | null = null;

/** One request per page load, shared by every component that shows a stat. */
function load(): Promise<Stats> {
  cache ??= fetch('/api/stats')
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((d) => ({
      leetcode: d.leetcode ?? statsFallback.leetcode,
      codeforces: d.codeforces ?? statsFallback.codeforces,
      fetchedAt: d.fetchedAt,
      live: { leetcode: !!d.leetcode, codeforces: !!d.codeforces },
    }))
    .catch(() => initial);
  return cache;
}

export function useStats() {
  const [s, setS] = useState<Stats>(initial);
  useEffect(() => { let on = true; load().then((v) => on && setS(v)); return () => { on = false; }; }, []);
  return s;
}
