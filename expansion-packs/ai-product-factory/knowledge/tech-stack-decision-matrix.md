# Tech Stack Decision Matrix

Conditional reference for `bmad-apf-plan-delivery`. Use only when the approved delivery plan requires a stack decision.

## Decision Factors

| Factor | Weight | Questions |
|---|---|---|
| Time to MVP | High | How fast must we ship? |
| Team skills | High | What does the team know? |
| Scale needs | Medium | Users at launch? Year 1? |
| Offline support | Medium | Must work without network? |
| Real-time | Medium | Live updates needed? |
| Platform | High | iOS, Android, Web, All? |
| Budget | Medium | Free tier sufficient? |

## Recommended Stacks by Product Type

### Mobile App (Cross-Platform)

**Flutter** — Best for: pixel-perfect UI, single codebase, fast MVP
- Frontend: Flutter + Riverpod/Bloc
- Backend: Supabase or Firebase
- Auth: Supabase Auth / Firebase Auth
- Payments: RevenueCat + Stripe
- Analytics: PostHog / Firebase Analytics
- CI/CD: Codemagic / GitHub Actions + Fastlane

**React Native** — Best for: web team going mobile, Expo ecosystem
- Frontend: React Native + Expo
- Backend: Supabase
- State: Zustand / TanStack Query
- Payments: RevenueCat
- Analytics: PostHog

### Mobile App (Native iOS)

**SwiftUI** — Best for: iOS-only, Apple ecosystem depth
- Frontend: SwiftUI + SwiftData
- Backend: CloudKit or Supabase
- Payments: StoreKit 2 + RevenueCat
- Analytics: TelemetryDeck / PostHog

### SaaS Web Application

- Frontend: Next.js 15 + React + Tailwind + Shadcn UI
- Backend: Next.js API Routes or separate FastAPI/Node
- Database: PostgreSQL (Supabase/Neon)
- Auth: Supabase Auth / Clerk / NextAuth
- Payments: Stripe
- Email: Resend / Loops
- Analytics: PostHog
- Hosting: Vercel / Railway
- Monitoring: Sentry

### Landing Page

- Framework: Next.js or Astro
- Styling: Tailwind CSS
- CMS: MDX / Contentlayer (optional)
- Analytics: Plausible / PostHog
- Forms: Resend / Formspree
- Hosting: Vercel / Netlify
- SEO: next-seo, sitemap

### Telegram Bot

- Runtime: Node.js (Telegraf) or Python (aiogram)
- Database: PostgreSQL (Supabase)
- Payments: Telegram Stars / Stripe
- Admin: Custom web panel (Next.js)
- Hosting: Railway / Fly.io
- Analytics: PostHog

### AI Agent

- Frontend: Next.js (chat UI)
- Backend: Python (FastAPI) or Node.js
- LLM: OpenAI / Anthropic API
- Memory: Vector DB (Pinecone / Supabase pgvector)
- Tools: Function calling / MCP
- Deployment: Vercel + Railway / Modal
- Observability: Langfuse / Helicone

## Anti-Patterns

- Do NOT choose microservices for MVP
- Do NOT self-host databases for MVP unless required
- Do NOT build custom auth — use Supabase/Clerk/Firebase
- Do NOT add analytics unless the selected track has a measurement need
