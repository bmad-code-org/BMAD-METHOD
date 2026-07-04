---
name: bmad-apf-generate-landing
description: Generate and deploy a high-converting landing page with SEO, analytics, and legal pages.
---

# Generate Landing Page — AI Product Factory

## On Activation

1. Load product vision, brand guidelines, personas, competitive positioning.
2. Load landing kit: `file:{project-root}/expansion-packs/ai-product-factory/kits/landing-kit.md`

## Step 1: Copywriting

Invoke `bmad-apf-landing` logic:
- Hero headline + subheadline
- Problem/agitation/solution
- Features/benefits
- Social proof placeholders
- CTA strategy
- Pricing section (if applicable)

Output: `{apf_artifacts}/marketing/landing-copy.md`

## Step 2: Page Structure

Define sections and component layout.
Output: `{apf_artifacts}/marketing/landing-structure.md`

## Step 3: Implementation

Build via Cursor:
- Next.js + Tailwind + Shadcn UI
- Responsive, mobile-first
- Dark mode support
- Cookie consent
- Analytics pixels (PostHog/GA)

## Step 4: SEO

Invoke `bmad-apf-seo`:
- Meta tags, OG tags
- Structured data (JSON-LD)
- Sitemap, robots.txt
- Keyword optimization

## Step 5: Legal Pages

Invoke `bmad-apf-content`:
- Privacy Policy
- Terms of Service
- FAQ

## Step 6: Deploy

Deploy to Vercel/Netlify with custom domain guidance.

Output: `{apf_artifacts}/marketing/landing-deploy-report.md`

## Handoff

- `bmad-apf-social` (launch content)
- `bmad-apf-product-hunt`

Run `{workflow.on_complete}`.
