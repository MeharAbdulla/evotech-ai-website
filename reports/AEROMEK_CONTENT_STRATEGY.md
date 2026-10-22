# Blog Content Strategy

## Context

~97 published posts via AI cron (`blog_generator.py`). List API previously returned full markdown bodies (~761KB). Posts are SEO-oriented industrial CV topics.

## Highest priority improvements

1. **Cluster review for GSC-impression topics** — warehouse collision avoidance, textile machine vision, drone building/roof inspection. Use `AEROMEK_BLOG_AUDIT.csv` rows marked `HUMAN_REVIEW_CLUSTER`. Keep the best URL per intent; merge or redirect near-duplicates after human review.
2. **Do not cite AI posts as measured lab results** — no invented FPS/accuracy. Add “engineering guidance” framing where claims sound experimental.
3. **Internal links** — generator already prompts service URLs; after deploy, spot-check top posts link to `/services/workplace-object-detection`, `/services/industrial-inspection`, `/services/drone-systems`, `/services/computer-vision`.
4. **Reduce volume pressure** — prefer quality edits over more daily posts until clusters are cleaned.
5. **Author/update honesty** — do not claim specialist bylines without evidence; prefer “Aeromek AI engineering notes” + `updated_at`.

## Actions already taken in code

- Boosted TOPIC_ROTATION for warehouse/textile/drone intents  
- List endpoint omits `content` + supports `limit`  
- Blog footer links in crawler HTML point at money services  

## Do not

- Mass-delete thin posts solely by word count  
- Keyword-stuff new service clones  
- Fabricate case studies into blog content  
