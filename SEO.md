# Search visibility for Elpida Labs

## Implemented in the website

- Every content page has a unique title and description, one H1, a production
  canonical, Open Graph metadata, and Twitter summary-card metadata.
- Both the GitHub Pages and Vercel builds identify `https://elpidalabs.xyz/` as
  canonical. GitHub Pages still works under `/ElpidaLabs/`. Its duplicate pages
  remain crawlable so search engines can discover their canonical links.
- The linked JSON-LD graph identifies the Organization, WebSite, page, article
  where applicable, and breadcrumbs. Article authorship uses Elpida Labs rather
  than unpublished personal identities. No dates, ratings, product releases,
  addresses, or credentials are invented.
- Inner content pages have visible breadcrumb navigation. Articles and product
  pages link to related content. All core text and links are server-independent
  static HTML, including when JavaScript is disabled.
- `sitemap.xml` lists all 11 canonical content URLs and excludes the 404 page.
  `robots.txt` references the production sitemap. The 404 document is noindex
  and Vercel serves missing URLs with a real 404 status.
- Vercel redirects www, `/index.html`, and legacy `/ElpidaLabs/` URLs to their
  corresponding production URLs.
- The site uses local fonts, sized images, lazy-loaded secondary artwork, small
  scripts, and no animation framework. Decorative loops stop offscreen or in
  background tabs. Reduced-motion preferences suppress motion.

## Account setup after publishing

On November 9, 2026, the `elpidalabs.xyz` Domain property was verified through
Vercel DNS in the signed-in owner's Search Console account. The production
sitemap was submitted and Google acknowledged the submission. Its initial
processing status was “couldn't fetch”; public checks returned HTTP 200 with
valid XML and 11 URLs, including with a Googlebot user agent. Sitemap processing
and actual indexing must still be confirmed in Search Console. Keep the Google
verification TXT record in DNS.

Google also accepted individual indexing requests for the homepage,
`elpida.html`, and `chaos-engine.html`, placing all three in its priority crawl
queue. This records successful requests, not confirmed indexing or rankings.

1. Add `elpidalabs.xyz` as a Domain property in
   [Google Search Console](https://search.google.com/search-console). Use the
   exact DNS TXT value Google supplies in the Vercel-managed DNS zone. Do not
   guess a verification token or put an unrelated token in the site.
2. Submit `https://elpidalabs.xyz/sitemap.xml`. Inspect the homepage and the two
   product URLs using URL Inspection, then request indexing where appropriate.
3. Validate public pages with
   [Rich Results Test](https://search.google.com/test/rich-results) and
   [PageSpeed Insights](https://pagespeed.web.dev/). Test mobile and desktop.
   Supported markup can establish eligibility; rich results are not guaranteed.
4. Monitor indexing, Google-selected canonicals, crawl errors, and Core Web
   Vitals. Search Console and field performance data need real traffic and time.
5. Publish substantive updates when the actual products change. Add approved
   author identities and accurate publication/update dates only when verified.
   Keep development status clear. Do not add fabricated testimonials or repeat
   keywords just to target search queries.

Search Console verification and sitemap submission require account access and
are not performed by the build. This document records the remaining account
steps; it does not claim indexing or a particular search ranking.

## Verification

`npm run check` validates canonical URLs, unique titles/descriptions, social
metadata, robots directives, linked schema, visible breadcrumbs, stable SVG
arrows, generated assets, and resource budgets. Browser suites cover keyboard
and accessibility behavior, mobile reflow, reduced motion, animation pause,
offscreen animation suspension, and the production artifact's routes/assets.

References: [Google's developer SEO guide](https://developers.google.com/search/docs/fundamentals/get-started-developers),
[site name guidance](https://developers.google.com/search/docs/appearance/site-names),
and [structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).
