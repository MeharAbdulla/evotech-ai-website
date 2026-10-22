# Technical SEO

## Verified

| Item | Status |
|------|--------|
| HTTPS apex `aeromek.com` | OK |
| www → apex 308 | OK (middleware) |
| SPA trailing slash strip | OK (middleware; **API excluded**) |
| robots.txt Allow `/`, Disallow `/admin`, Sitemap | OK |
| Dynamic sitemap with priorities | OK |
| Bot HTML for `/services/:slug` and `/blog/:slug` | OK for Googlebot |
| Per-route Helmet meta after JS | OK for users |
| Organization/WebSite JSON-LD in index.html | Present |
| Service FAQ/Service/Breadcrumb JSON-LD in bot HTML | Present |

## Confirmed gaps

| Gap | Severity | Notes |
|-----|----------|-------|
| SPA shell homepage meta for non-bot crawlers | Medium | Expected CRA limitation; bot middleware mitigates Google on services/blog |
| No bot prerender for `/projects/:id`, `/contact`, etc. | Medium | Future enhancement |
| Blog list previously huge | Medium | Fixed with projection + limit |
| Privacy/terms missing from sitemap | Low | Added to STATIC_PATHS |

## Metadata rules in use

- Unique titles/descriptions on service landings and major pages via `Seo.jsx`  
- Homepage: Industrial Computer Vision & AI Engineering  
- Canonical always `https://aeromek.com` + path  

## Not claimed

Lighthouse scores were **not** run in this session; do not invent CWV numbers.
