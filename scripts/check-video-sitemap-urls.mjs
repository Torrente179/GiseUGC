/**
 * Live Googlebot HEAD + R2 robots/hotlink check for the curated video sitemap.
 * Not part of `vite build` on Vercel (no guaranteed egress). Run locally or
 * in a networked job: `npm run seo:check-video-urls`.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const loader = await createServer({
  configFile: false,
  root,
  resolve: { alias: { '@': path.join(root, 'src') } },
  server: { middlewareMode: true },
  appType: 'custom',
  plugins: [],
});

try {
  const { writeVideoSitemapFile } = await loader.ssrLoadModule('/src/lib/video-sitemap.ts');
  await writeVideoSitemapFile(root, { verifyUrls: true });
  console.log('video sitemap URL checks passed');
} finally {
  await loader.close();
}
