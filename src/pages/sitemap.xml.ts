import { site } from '../content/site';

/* Sitemap for search engines. Lists every indexable page with the date its content last changed. */
export function GET() {
  const urls = site.seo.pages
    .map(
      (p) =>
        `  <url>\n    <loc>${new URL(p.path, site.url).href}</loc>\n    <lastmod>${p.updated}</lastmod>\n  </url>`
    )
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
