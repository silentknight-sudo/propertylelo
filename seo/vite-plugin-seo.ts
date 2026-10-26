import type { Plugin } from 'vite';
import { PROPERTIES_DATA, CITIES_DATA, BLOG_ARTICLES_DATA } from '../src/data/mockData';
import {
  SITE_URL,
  propertyPath,
  propertyUrl,
  propertyImageAlt,
  propertyDescriptor,
  propertyJsonLd,
  listingsItemListJsonLd,
  cityPath,
  articlePath
} from '../src/lib/seo';

// Build-time SEO for the SPA:
//  1. prerenders crawlable, semantic HTML of every listing into #root (React
//     replaces it on mount), so non-JS crawlers and social bots see content;
//  2. injects ItemList + flagship RealEstateListing JSON-LD into <head>;
//  3. generates sitemap.xml (with image extensions) from the same listing data.

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const jsonLdTag = (id: string, data: unknown) =>
  `<script type="application/ld+json" id="${id}">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

const published = PROPERTIES_DATA.filter((p) => !p.status || p.status === 'published');
const publishedBlogs = BLOG_ARTICLES_DATA.filter((b) => !b.status || b.status === 'published');
const flagship = published.find((p) => p.featured) || published[0];

function headTags(): string {
  const tags = [jsonLdTag('jsonld-listings', listingsItemListJsonLd(published, 'Verified properties for sale on PropertyLelo'))];
  if (flagship) tags.push(jsonLdTag('jsonld-flagship-listing', propertyJsonLd(flagship)));
  return tags.join('\n    ');
}

function prerenderedBody(): string {
  const cards = published
    .map(
      (p) => `
        <li class="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
          <a href="${esc(propertyPath(p))}" class="block">
            <img src="${esc(p.images?.[0] || '')}" alt="${esc(propertyImageAlt(p))}" width="800" height="500" loading="lazy" class="w-full aspect-[16/10] object-cover" />
            <div class="p-4">
              <h3 class="font-bold text-white">${esc(p.title)}</h3>
              <p class="text-sm text-blue-100/80">${esc(propertyDescriptor(p))}</p>
              <p class="text-sm font-bold text-orange-300">${esc(p.priceFormatted)} · ${p.area.toLocaleString('en-IN')} sq.ft${p.reraId ? ` · RERA ${esc(p.reraId)}` : ''}</p>
            </div>
          </a>
        </li>`
    )
    .join('');

  const cities = CITIES_DATA.map(
    (c) =>
      `<li><a href="${esc(cityPath(c.name))}" class="underline">Property in ${esc(c.name)}</a> – ${esc(c.propertyCount)} listings, avg ${esc(c.avgPriceSqft)}. Popular: ${c.popularLocalities.map(esc).join(', ')}.</li>`
  ).join('');

  const articles = publishedBlogs
    .map((b) => `<li><a href="${esc(articlePath(b))}" class="underline">${esc(b.title)}</a></li>`)
    .join('');

  return `
      <div id="seo-prerender" class="min-h-screen bg-[#001233] text-white px-4 py-24">
        <div class="max-w-6xl mx-auto">
          <h1 class="text-3xl sm:text-5xl font-extrabold">Buy Verified Homes &amp; Commercial Property in Delhi NCR &amp; Across India</h1>
          <p class="mt-4 max-w-3xl text-blue-100/90">RERA-verified flats, villas, penthouses, plots and assured-return commercial space in Noida, Gurgaon, Mumbai, Bangalore, Pune, Hyderabad, Chennai, Kolkata and Ahmedabad. Buy directly from owners and builders with zero brokerage on PropertyLelo.</p>
          <h2 class="mt-12 text-2xl font-bold">Verified properties for sale</h2>
          <ul class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${cards}
          </ul>
          <h2 class="mt-12 text-2xl font-bold">Real estate by city</h2>
          <ul class="mt-4 space-y-2 text-blue-100/90">${cities}</ul>
          <h2 class="mt-12 text-2xl font-bold">Property guides &amp; market insights</h2>
          <ul class="mt-4 space-y-2 text-blue-100/90">${articles}</ul>
        </div>
      </div>
    `;
}

function sitemapXml(): string {
  const today = new Date().toISOString().slice(0, 10);
  const url = (loc: string, priority: string, changefreq: string, extra = '', lastmod = today) =>
    `  <url>\n    <loc>${esc(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${extra}\n  </url>`;

  const entries: string[] = [url(`${SITE_URL}/`, '1.0', 'daily')];

  const cityNames = new Set<string>([...CITIES_DATA.map((c) => c.name), ...published.map((p) => p.city)]);
  cityNames.delete('Delhi NCR'); // default view, canonicalised to the homepage
  cityNames.forEach((c) => entries.push(url(`${SITE_URL}${cityPath(c)}`, '0.8', 'daily')));

  published.forEach((p) => {
    const images = (p.images || [])
      .slice(0, 5)
      .map(
        (img, i) =>
          `\n    <image:image>\n      <image:loc>${esc(img)}</image:loc>\n      <image:title>${esc(propertyImageAlt(p, i))}</image:title>\n    </image:image>`
      )
      .join('');
    entries.push(url(propertyUrl(p), p.featured ? '0.9' : '0.8', 'weekly', images));
  });

  publishedBlogs.forEach((b) => {
    const loc = b.seo?.canonicalUrl || `${SITE_URL}${articlePath(b)}`;
    const d = new Date(b.date);
    const lastmod = Number.isNaN(d.getTime())
      ? today
      : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    entries.push(url(loc, '0.7', 'monthly', '', lastmod));
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`;
}

export function seoPlugin(): Plugin {
  return {
    name: 'propertylelo-seo',
    transformIndexHtml(html) {
      return html
        .replace('</head>', `    ${headTags()}\n  </head>`)
        .replace('<div id="root"></div>', `<div id="root">${prerenderedBody()}</div>`);
    },
    configureServer(server) {
      server.middlewares.use('/sitemap.xml', (_req, res) => {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.end(sitemapXml());
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml() });
    }
  };
}
