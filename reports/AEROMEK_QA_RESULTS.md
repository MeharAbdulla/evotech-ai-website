# QA Results

## Commands actually run

| Command | Result |
|---------|--------|
| `npm run build` | Passed (this session, prior to final deploy) |
| `CI=true npm test -- --watchAll=false` | **Passed** — 3 suites, 6 tests |
| `node scripts/generate_audit_csvs.mjs` | Wrote portfolio (20) + blog (97) CSVs |
| Live curl robots/sitemap/www/API | See route audit |

## Jest tests

- `src/App.test.js` — canonical helper smoke  
- `src/seo/siteConfig.test.js` — SITE_URL / absoluteUrl  
- `src/data/serviceLandings.test.js` — money slugs + unique titles  

## Not run / limitations

- Playwright/Cypress E2E — not in repo  
- Lighthouse / CWV lab scores — not run  
- Production contact form POST — intentionally not spam-submitted  
- Accessibility automated axe suite — not configured  
- Backend unit tests — none present  
- Full visual mobile QA in browser — partial (code + live HTTP only)

## Known regressions fixed this session

- Blog **Network Error** from API trailing-slash redirect loop — fixed  
- Misleading marketing claims — softened  

## Remaining failures / gaps

- Non-Googlebot crawlers still see SPA shell meta on deep links  
- Blog cluster duplicates need human merge decisions  
- No automated a11y CI yet  
