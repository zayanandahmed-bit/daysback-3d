import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Served from the root of daysback.si.
const BASE = '/';
const SITE = 'https://daysback.si';

// One real HTML file per page, each with its own title, description and
// canonical URL. Without these, GitHub Pages answers /services etc. from
// 404.html with a 404 status and Google won't index them.
const PAGES = {
  services: ['Services | DaysBack: AI Agents, AI Receptionists & Automation',
    'Custom AI agents, AI voice receptionists, WhatsApp and lead follow-up, quoting automation, dashboards and websites that sell. Built around your business by DaysBack.'],
  reviews: ['Reviews | DaysBack',
    'Real Google reviews from businesses that work with DaysBack: AI receptionists, follow-up agents and automations that save 30+ hours a week.'],
  about: ['About DaysBack | AI Automation Agency',
    'DaysBack builds AI that takes work off your plate: no hype, no jargon, just automations that save real hours and win real customers.'],
  contact: ['Contact DaysBack | Book a Free 27-Minute Strategy Call',
    'Talk to DaysBack about automating your business. Book a free 27-minute strategy call; we reply within 1 hour. contact@daysback.si'],
};
// Not in the sitemap; real files so the URL works on a direct hit.
const EXTRA = { thanks: ['Thank you | DaysBack', 'Thanks for getting in touch with DaysBack.'] };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    {
      // GitHub Pages has no server-side rewrite, so a hard refresh on
      // /services would 404. Pages serves 404.html for anything it
      // can't find, so making that file a copy of index.html hands the
      // request back to the router instead.
      name: 'spa-404-fallback',
      closeBundle() {
        copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'));
        const home = readFileSync(resolve('dist/index.html'), 'utf8');
        for (const [path, [title, desc]] of Object.entries({ ...PAGES, ...EXTRA })) {
          const url = `${SITE}/${path}/`;
          const html = home
            .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
            .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(desc)}`)
            .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
            .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(desc)}`)
            .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
            .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`);
          mkdirSync(resolve(`dist/${path}`), { recursive: true });
          writeFileSync(resolve(`dist/${path}/index.html`), html);
        }
        const today = new Date().toISOString().slice(0, 10);
        writeFileSync(resolve('dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['', ...Object.keys(PAGES)].map((p) => `  <url><loc>${SITE}/${p}${p ? "/" : ""}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
        writeFileSync(resolve('dist/robots.txt'), `User-agent: *\nAllow: /\nDisallow: /reply\nDisallow: /thanks\n\nSitemap: ${SITE}/sitemap.xml\n`);
      },
    },
  ],
});
