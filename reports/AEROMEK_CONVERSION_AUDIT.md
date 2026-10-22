# Conversion / Contact Audit

## Flow (code-verified)

1. User fills `CTAContactSection` (home `#contact` and `/contact`)  
2. Client validation: required fields via HTML `required`  
3. `POST /api/consultations/` stores lead in Mongo (`status: New`)  
4. Success → WhatsApp deep link with prefilled text  
5. Failure → inline error + WhatsApp fallback suggestion  
6. Admin reviews in `/admin/messages`

## Tests performed this session

| Test | Result |
|------|--------|
| Inspect form fields + submit handler in source | Done |
| Live POST of fake lead to production | **Not executed** (policy: no fake customer enquiries) |
| Email SMTP delivery | **N/A** — no email sender implemented |
| Domain mailbox `@aeromek.com` | **Not configured in code**; Gmail remains public contact |

## Issues & actions

| Issue | Severity | Action |
|-------|----------|--------|
| Unsubstantiated enterprise trust copy beside form | High (trust) | Softened copy |
| Primary CTA wording weak | Med | Hero/services CTAs updated |
| No analytics events for form_start/submit | Med | Not added (would need GA event wiring + privacy review) |
| `notify_new_leads` setting unused | Low | Documented; no silent email invented |
| Spam/rate limit on consultations | Unknown | Not verified; recommend adding server-side rate limit later |

## Recommended human steps

1. Confirm WhatsApp number ownership and business hours response  
2. Optionally add `contact@aeromek.com` **after** mailbox exists  
3. Add GA4 events only if measurement ID is set and PII excluded  
