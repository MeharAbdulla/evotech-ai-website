# Daily blogs via GitHub Actions (10/day)

## Status: STOPPED

Automated blog publishing is **off** (workflow disabled + schedule removed).

To turn back on:
1. Restore the `schedule` block in [`.github/workflows/blog-daily.yml`](../.github/workflows/blog-daily.yml)
2. `gh workflow enable "Daily blog generation" --repo MeharAbdulla/evotech-ai-website`

## What’s set up

- Workflow: [`.github/workflows/blog-daily.yml`](../.github/workflows/blog-daily.yml)
- Repo: https://github.com/MeharAbdulla/evotech-ai-website
- GitHub secrets: `BLOG_CRON_SECRET`, `BLOG_CRON_URL`
- Schedule: removed (was 02:00 / 08:00 / 14:00 / 20:00 UTC)
- Manual run: only after re-enabling the workflow

## Required on Vercel (aeromek / bots-projects)

Production env must include:

| Name | Value |
|------|--------|
| `BLOG_DAILY_LIMIT` | `10` |
| `BLOG_CRON_SECRET` | **same** as GitHub secret `BLOG_CRON_SECRET` |
| `CRON_SECRET` | same value (optional, also accepted) |

Then redeploy so the API picks up the limit.

### CLI (when logged into bots-projects)

```bash
npx vercel login
# choose the account that owns bots-projects / aeromek

npx vercel env add BLOG_DAILY_LIMIT production --scope bots-projects-216e7e98 --yes
# enter: 10

npx vercel env add BLOG_CRON_SECRET production --scope bots-projects-216e7e98 --yes
# paste the same value as GitHub → Settings → Secrets → BLOG_CRON_SECRET

npx vercel deploy --prod --yes --scope bots-projects-216e7e98
```

### Or match existing Vercel secret to GitHub

If `BLOG_CRON_SECRET` already exists on Vercel, open GitHub → Settings → Secrets → Actions → edit `BLOG_CRON_SECRET` to that value (do not commit it).

## Test

```bash
gh workflow run "Daily blog generation" --repo MeharAbdulla/evotech-ai-website -f mode=fill
gh run list --repo MeharAbdulla/evotech-ai-website --workflow=blog-daily.yml --limit 3
```

## Note

Vercel blog generate crons were removed from `vercel.json` so only GitHub Actions publishes posts (cover backfill cron remains).
