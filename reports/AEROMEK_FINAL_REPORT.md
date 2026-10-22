# Aeromek.com — Final Engineering Report

**Date:** 2026-10-13  
**Scope:** Full audit + safe implementation for industrial computer vision positioning, SEO, conversion honesty, and QA.

---

## Confirmed findings

1. CRA SPA: default HTML shell uses homepage meta on all routes; Googlebot gets service/blog prerender via middleware.  
2. Blog Network Error was an **API redirect loop** (FastAPI slash vs Vercel slash strip) — confirmed and fixed.  
3. Unsubstantiated claims (“Global Enterprises”, “fault-tolerant”, “99.99% uptime”, inflated stats) existed in UI.  
4. No privacy/terms pages existed.  
5. Blog list API returned full post bodies (very large payloads).  
6. Portfolio status “Completed” implied production without evidence.  
7. Contact flow stores Mongo leads then opens WhatsApp; no SMTP.  

## Fixes implemented

- Softened CTA/About claims; portfolio status → “Demo available” for CV/AI static projects  
- Homepage SEO title + hero primary CTA; RC planes section deferred below portfolio  
- Privacy + Terms pages, footer links, sitemap entries  
- Blog list `limit`/`skip` + omit `content`; frontend requests `limit=48`  
- Services hub prioritizes vision money pages  
- Jest smoke tests for SEO config + service landings  
- Audit reports under `reports/`  

## Key files changed

- `middleware.js`, `vercel.json`  
- `src/pages/HomePage.jsx`, `Hero.jsx`, `About.jsx`, `CTAContactSection.jsx`, `Footer.jsx`, `ServicesPage.jsx`  
- `src/pages/PrivacyPage.jsx`, `TermsPage.jsx`, `App.js`  
- `src/data/cvProjects.js`, `aiProjects.js`, `serviceLandings.js` (prior), `public/index.html`, `siteConfig.js`  
- `backend/app/routes/blog.py`, `blog_schema.py`, `seo.py`  
- `src/services/blogService.js`, tests, `reports/*`  

## Tests actually run

- `CI=true npm test -- --watchAll=false` → 6 passed  
- Production build → passed earlier; redeploy after final changes  
- Live HTTP checks for robots, sitemap, www redirect, blog API  

## Issues requiring human approval

- Merge/redirect duplicate blog clusters  
- Replace Gmail with domain email only after mailbox exists  
- Any customer-named case studies  
- Blog posts that over-claim metrics  

## Unavailable / unverified

- Search volume tools  
- Lighthouse scores  
- Production form POST end-to-end  
- Intrusive security scans against production  

## Deploy / rollback

- Deploy: `npx vercel deploy --prod --yes --scope bots-projects-216e7e98`  
- Rollback: Vercel dashboard → previous production deployment Promote  

## Next priorities

1. Human blog cluster cleanup for warehouse/textile/drone intents  
2. Optional bot prerender for `/projects/:id`  
3. Consultation rate limiting  
4. Real CWV measurement + image weight pass  
5. Accessibility automated checks in CI  
