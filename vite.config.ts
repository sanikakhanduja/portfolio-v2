import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Serves the Vercel functions in /api (GET handlers) during `npm run dev`, so local and production behave the same. */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const name = (req.url ?? '').split('?')[0].replace(/^\//, '');
        if (!/^[a-z-]+$/.test(name)) return next();
        try {
          const mod = await server.ssrLoadModule(`/api/${name}.ts`);
          const out: Response = await mod.GET(new Request(`http://localhost${req.originalUrl}`));
          res.statusCode = out.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(await out.text());
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
      });
    },
  };
}

export default defineConfig({ plugins: [react(), devApi()] });
