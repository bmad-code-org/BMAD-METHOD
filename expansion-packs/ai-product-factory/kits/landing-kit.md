# Landing Kit — AI Product Factory

Complete production workflow for landing pages and marketing sites.

## Included Workflows

| Phase | Skill/Agent | Output |
|---|---|---|
| Validation | `bmad-apf-validate-idea` | Validation report |
| Brand | `bmad-apf-brand` | Brand guidelines |
| Copy | `bmad-apf-landing` | Landing copy |
| Build | `bmad-apf-generate-landing` | Deployed landing page |
| SEO | `bmad-apf-seo` | SEO optimization |
| Content | `bmad-apf-content` | Privacy, Terms, FAQ |
| Analytics | `bmad-apf-analytics` | PostHog/Plausible |
| Social | `bmad-apf-social` | Launch content |
| Email | `bmad-apf-email` | Welcome sequences |

## Default Stack

- Next.js + Tailwind CSS + Shadcn UI
- Vercel hosting
- PostHog analytics
- Resend for forms

## Page Sections

1. Hero (headline + CTA)
2. Problem/Solution
3. Features/Benefits
4. Social Proof
5. Pricing (optional)
6. FAQ
7. Footer (legal links)

## Getting Started

```
> use the bmad-apf-generate-landing skill
```

Or full pipeline:

```
> use the bmad-apf-launch-startup skill
> Product type: landing
```
