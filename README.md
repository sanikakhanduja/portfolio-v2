# Sanika Khanduja · Portfolio

One-page portfolio built for recruiters: skimmable in 10–15 seconds, with live coding stats and animated architecture diagrams of the Microsoft and Cisco internship projects.

**Stack:** Vite, React 18, TypeScript, canvas animations, Vercel functions (`/api`).

```bash
npm install
npm run dev      # http://localhost:5173 (API routes served by the dev middleware)
npm run build
```

- `api/stats.ts`: live LeetCode and Codeforces stats, cached for an hour
- `api/blog.ts`: latest posts from Hashnode, Medium or Dev.to (set `BLOG` in `api/_lib/blog.ts`)
- `src/content.ts`: all copy and data
