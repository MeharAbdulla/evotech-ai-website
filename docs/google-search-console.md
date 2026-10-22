# Google Search Console — DNS verification for aeromek.com

Domain DNS is at **Spaceship** (not Vercel):
- Nameservers: `launch1.spaceship.net`, `launch2.spaceship.net`

## Domain property (TXT) — required for `aeromek.com` domain property

1. Spaceship → Domains → **aeromek.com** → DNS
2. Add record:
   - Type: `TXT`
   - Host/Name: `@`
   - Value: `google-site-verification=Zptoc6alNw-ddSfUBFErdnfp3nWgx2dgz1dKX`
3. Save → wait 15–60 min → check https://toolbox.googleapps.com/apps/dig/#TXT/aeromek.com
4. Search Console → VERIFY

## Faster alternative — URL prefix + HTML meta (already in site)

1. Search Console → Add property → **URL prefix** → `https://aeromek.com`
2. Choose **HTML tag** verification
3. Site already has:
   `<meta name="google-site-verification" content="Zptoc6alNw-ddSfUBFErdnfp3nWgx2dgz1dKX" />`
   If Google shows a *different* content value for the URL-prefix property, replace the meta content and redeploy.
4. Click VERIFY
5. Sitemaps → submit `https://aeromek.com/sitemap.xml`

## Google Analytics 4

1. https://analytics.google.com → Admin → Create GA4 property for `aeromek.com`
2. Copy Measurement ID (`G-XXXXXXXX`)
3. Vercel → Project → Settings → Environment Variables →
   `REACT_APP_GA_MEASUREMENT_ID` = `G-XXXXXXXX` (Production)
4. Redeploy
5. In GA4 → Admin → Product links → link **Search Console** after both are verified
