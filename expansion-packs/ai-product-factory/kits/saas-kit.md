# SaaS Kit — AI Product Factory

Complete production workflow for SaaS web applications.

## Included Workflows

| Phase | Skill/Agent | Output |
|---|---|---|
| Validation → PRD | Founder + Product layers | Full product spec |
| UX + Design | UX + Design layers | Design system |
| Stack | `bmad-apf-choose-stack` | Next.js + Supabase + Stripe |
| Architecture | `bmad-create-architecture` | System architecture |
| Build | `bmad-apf-build-mvp` | SaaS codebase |
| Auth | `bmad-apf-authentication` | Clerk/Supabase Auth |
| Billing | `bmad-apf-payments` | Stripe subscriptions |
| Dashboard | Platform agent | Admin dashboard |
| Emails | `bmad-apf-email` | Transactional emails |
| Monitoring | `bmad-apf-infrastructure` | Sentry + uptime |
| Deploy | `bmad-apf-deploy-app` | Vercel/Railway |
| Landing | `bmad-apf-generate-landing` | Marketing site |

## Default Stack

- Frontend: Next.js 15 + React + Tailwind + Shadcn UI
- Backend: Next.js API Routes + Supabase
- Database: PostgreSQL (Supabase)
- Auth: Supabase Auth or Clerk
- Payments: Stripe (subscriptions)
- Email: Resend
- Analytics: PostHog
- Hosting: Vercel

## SaaS Essentials

- [ ] User registration + login
- [ ] Subscription billing (free + paid tiers)
- [ ] Admin panel
- [ ] User dashboard
- [ ] Email notifications
- [ ] Usage limits per tier
- [ ] Settings page
- [ ] Data export (GDPR)

## Getting Started

```
> use the bmad-apf-launch-startup skill
> Product type: saas
> Platform: web
```
