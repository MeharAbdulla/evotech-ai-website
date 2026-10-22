# Aeromek.com — Architecture Baseline

**Date:** 2026-10-13  
**Repo:** `c:\Users\Mz Computers\Videos\ai-website`  
**Production:** https://aeromek.com (Vercel team `bots-projects`)

## Architecture (verified)

| Layer | Stack |
|------|--------|
| Frontend | Create React App 5, React 19, React Router 7, Tailwind 3, react-helmet-async |
| Backend | FastAPI + Motor/MongoDB via `api/index.py` mounted at `/api` |
| Hosting | Vercel CRA + Python serverless function (`maxDuration` 300s) |
| Edge | `middleware.js` — www→apex, SPA trailing-slash strip (excludes `/api`), bot HTML for `/blog/*` and `/services/*` |

## Entry points

- `src/index.js` → `src/App.js`
- `backend/app/main.py` → routers (auth, projects, blog, seo, consultations, …)
- `api/index.py` Vercel shim

## Public routes

`/`, `/services`, `/services/:slug` (18 landings), `/projects`, `/projects/:id`, `/team`, `/gigs`, `/blog`, `/blog/:slug`, `/rc-planes`, `/rc-planes/:slug`, `/about`, `/contact`, `/privacy`, `/terms`, `*` → NotFound. Admin under `/admin/*` (JWT).

## Data sources

- Static: `cvProjects`, `aiProjects`, `pcbProjects`, `serviceLandings`, `rcPlanes`, gigs merge
- MongoDB: blogs, consultations, projects (admin), developers, site_config, gigs/services overlays

## Contact flow (verified in code)

`CTAContactSection` → `POST /api/consultations/` → Mongo insert → redirect to WhatsApp `wa.me/923217691508`. No SMTP email send implemented. Contact email shown: `aeromekai@gmail.com`.

## SEO modules

- `src/Components/Seo.jsx`, `src/seo/siteConfig.js`
- Dynamic sitemap `/sitemap.xml` → `/api/seo/sitemap`
- Bot prerender `/api/seo/blog|service/{slug}` via middleware
- `public/robots.txt` allows `/`, disallows `/admin`

## Analytics

Optional `REACT_APP_GA_MEASUREMENT_ID`, Vercel Analytics + Speed Insights.

## Test / build commands

| Command | Purpose |
|---------|---------|
| `npm start` | Local CRA |
| `npm run build` | Production frontend build |
| `CI=true npm test -- --watchAll=false` | Jest |
| No backend pytest suite found | — |

## Env var names (from `.env.example` only)

`REACT_APP_API_BASE_URL`, `REACT_APP_GA_MEASUREMENT_ID`, `MONGODB_URI`, `MONGODB_DB_NAME`, `JWT_SECRET_KEY`, `ZAI_API_KEY`, `ZAI_MODEL`, `GROQ_API_KEY`, `GEMINI_API_KEY`, `BLOG_PROVIDER`, `BLOG_DAILY_LIMIT`, `UNSPLASH_ACCESS_KEY`, `PIXABAY_API_KEY`, `TICKETMASTER_API_KEY`, `TICKETMASTER_API_SECRET`, `BLOG_CRON_SECRET`, `CRON_SECRET`

## Careful modules

- Blog cron + AI generation (`blog_generator.py`)
- Upload/GridFS routes
- Admin JWT auth
- Middleware/API trailing-slash interaction (previously caused blog Network Error)

## Baseline build/test (this session)

- `npm run build` — **passed** (earlier this session)
- `CI=true npm test -- --watchAll=false` — **3 suites / 6 tests passed**
