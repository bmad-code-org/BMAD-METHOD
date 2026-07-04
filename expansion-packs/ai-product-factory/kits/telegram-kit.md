# Telegram Kit — AI Product Factory

Complete production workflow for Telegram bots.

## Included Workflows

| Phase | Skill/Agent | Output |
|---|---|---|
| Validation | `bmad-apf-validate-idea` | Validation report |
| Product | `bmad-apf-generate-prd` | Bot PRD |
| Build | `bmad-apf-build-mvp` | Bot codebase |
| Backend | `bmad-apf-backend` | API + PostgreSQL |
| Payments | `bmad-apf-payments` | Telegram Stars / Stripe |
| Admin | Platform agent | Admin web panel |
| Analytics | `bmad-apf-analytics` | Event tracking |
| Broadcast | Platform agent | Broadcast system |
| CRM | Platform agent | User management |
| Deploy | `bmad-apf-deploy-app` | Railway/Fly.io |

## Default Stack

- Bot: Node.js (Telegraf) or Python (aiogram)
- Database: PostgreSQL (Supabase)
- Admin Panel: Next.js
- Payments: Telegram Stars + Stripe
- Hosting: Railway / Fly.io
- Analytics: PostHog

## Bot Essentials

- [ ] /start command with onboarding
- [ ] Core bot commands
- [ ] Inline keyboards
- [ ] Payment integration
- [ ] Admin panel for management
- [ ] Broadcast messaging
- [ ] User CRM (tags, segments)
- [ ] Analytics events

## Getting Started

```
> use the bmad-apf-launch-startup skill
> Product type: telegram-bot
```
