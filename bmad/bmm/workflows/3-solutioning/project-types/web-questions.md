# Web Project Architecture Questions

## Frontend

1. **Framework choice:**
   - Next.js (React, App Router, SSR)
   - React (SPA, client-only)
   - Vue 3 + Nuxt
   - Svelte + SvelteKit
   - Other: **\_\_\_**

2. **Styling approach:**
   - Tailwind CSS (utility-first)
   - CSS Modules
   - Styled Components (CSS-in-JS)
   - Sass/SCSS
   - Other: **\_\_\_**

3. **State management:** (if complex client state)
   - Zustand (lightweight)
   - Redux Toolkit
   - Jotai/Recoil (atomic)
   - Context API only
   - Server state only (React Query/SWR)

## Backend

4. **Backend approach:**
   - Next.js API Routes (integrated)
   - Express.js (Node.js)
   - Nest.js (Node.js, structured)
   - FastAPI (Python)
   - Django (Python)
   - Rails (Ruby)
   - Other: **\_\_\_**

5. **API paradigm:**
   - REST
   - GraphQL (Apollo, Relay)
   - tRPC (type-safe)
   - gRPC
   - Mix: **\_\_\_**

## Database

6. **Primary database:**
   - PostgreSQL (relational, ACID)
   - MySQL
   - MongoDB (document)
   - Supabase (PostgreSQL + backend services)
   - Firebase Firestore
   - Other: **\_\_\_**

7. **ORM/Query builder:**
   - Prisma (type-safe, modern)
   - Drizzle ORM
   - TypeORM
   - Sequelize
   - Mongoose (for MongoDB)
   - Raw SQL
   - Database client directly (Supabase SDK)

## Authentication

8. **Auth approach:**
   - Supabase Auth (managed, built-in)
   - Auth0 (managed, enterprise)
   - Clerk (managed, developer-friendly)
   - NextAuth.js (self-hosted)
   - Firebase Auth
   - Custom JWT implementation
   - Passport.js

## Deployment

9. **Hosting platform:**
   - Vercel (optimal for Next.js)
   - Netlify
   - AWS (EC2, ECS, Lambda)
   - Google Cloud
   - Heroku
   - Railway
   - Self-hosted

10. **CI/CD:**
    - GitHub Actions
    - GitLab CI
    - CircleCI
    - Vercel/Netlify auto-deploy
    - Other: **\_\_\_**

## Additional Services (if applicable)

11. **Email service:** (if transactional emails needed)
    - Resend (developer-friendly, modern)
    - SendGrid
    - AWS SES
    - Postmark
    - None needed

12. **Payment processing:** (if e-commerce/subscriptions)
    - Stripe (comprehensive)
    - Lemon Squeezy (SaaS-focused)
    - PayPal
    - Square
    - None needed

13. **File storage:** (if user uploads)
    - Supabase Storage
    - AWS S3
    - Cloudflare R2
    - Vercel Blob
    - Uploadthing
    - None needed

14. **Search:** (if full-text search beyond database)
    - Elasticsearch
    - Algolia
    - Meilisearch
    - Typesense
    - Database full-text (PostgreSQL)
    - None needed

15. **Caching:** (if performance critical)
    - Redis (external cache)
    - In-memory (Node.js cache)
    - CDN caching (Cloudflare/Vercel)
    - None needed

16. **Monitoring/Error Tracking:**
    - Sentry (error tracking)
    - PostHog (product analytics)
    - Datadog
    - LogRocket
    - Vercel Analytics
    - None needed
