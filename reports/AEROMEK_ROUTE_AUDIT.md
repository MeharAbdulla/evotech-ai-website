# Aeromek.com — Route Audit

**Method:** Live `curl` against https://aeromek.com + source route map in `src/App.js`.  
**Important finding:** CRA serves the same `index.html` shell (homepage meta) for normal browsers on every SPA path. Googlebot on `/services/:slug` receives middleware prerender with page-specific title/canonical. This matches “homepage content when fetching /services” observations from dumb HTML fetchers — **not** a broken React router for humans.

| Route | Expected | Observed (default UA) | Severity | Root cause | Remediation | Status |
|-------|----------|----------------------|----------|------------|-------------|--------|
| `/` | Home + home meta | 200, home title/canonical | OK | — | Keep | Verified |
| `/services` | Services index | 200 shell + client render | Med (SEO) | SPA shell meta | Helmet after hydrate; optional bot HTML later | Verified shell |
| `/services/computer-vision` | CV service | Shell for humans; **bot prerender OK** | Med/Low | CRA + middleware bots only | Keep bot HTML; consider broader prerender | Verified bot |
| `/services/workplace-object-detection` | Warehouse CV | Same pattern | Med/Low | Same | Same | Verified bot |
| `/services/industrial-inspection` | Textile/inspection | Same pattern | Med/Low | Same | Same | Verified bot |
| `/blog` | Blog index | 200; was Network Error during redirect loop | **Critical→Fixed** | `/api/blog` ↔ slash redirect loop | Removed API slash strip from vercel redirects | Fixed + retested API |
| `/blog/:slug` | Article | Client + bot HTML | Low | SPA shell for non-bot | Keep | Partial |
| `/contact` | Contact form | 200 shell | Med SEO | SPA | Helmet | Verified shell |
| `/projects`, `/projects/:id` | Portfolio | 200 shell | Med SEO | SPA | In sitemap | Verified shell |
| `/about`, `/team`, `/gigs` | Static pages | 200 shell | Low | SPA | — | Verified shell |
| `/rc-planes` | Product catalog | 200 shell | Low | SPA | Deprioritized in sitemap | Verified shell |
| `/privacy`, `/terms` | Legal | **Added this session** | Was missing | No routes | New pages + footer links | Implemented |
| `/robots.txt` | Allow + sitemap | OK | OK | — | — | Verified |
| `/sitemap.xml` | Indexable URLs | 200, ~182 URLs | OK | — | Added privacy/terms | Verified |
| `www` host | 308 → apex | 308 | OK | middleware | Keep | Verified |
| Trailing slash SPA | 308 strip | 308 | OK | middleware (not `/api`) | Keep | Verified |
| `/api/blog/` | JSON list | Was huge full content | Med perf | No projection/limit | `limit` + omit content | Implemented (deploy) |

## External fetch limitation

Tools that only read first HTML bytes will always see homepage title on SPA routes. Do not treat that alone as “routes broken.” Human navigation uses client routing; Googlebot services get prerender.
