# <!-- Powered by BMAD™ Core -->

# Deployment Strategies for JavaScript Applications

Quick reference for deployment patterns and platforms.

## Deployment Patterns

**Rolling Deployment** - Gradual instance replacement. Pros: Simple, zero downtime. Cons: Old/new versions mix during deploy. Best for: Most apps (default)

**Blue-Green** - Two identical environments, switch traffic. Pros: Instant rollback, pre-test. Cons: 2x infrastructure cost. Best for: Critical apps needing instant rollback

**Canary** - Route small % to new version, increase gradually. Pros: Safe real-user testing, early detection. Cons: Complex routing, needs good monitoring. Best for: High-risk changes, large user bases

## Recommended Platforms

### Frontend (Next.js/React)
**Vercel** - Zero-config Next.js, automatic HTTPS, global CDN, preview deployments, serverless functions
**Netlify** - JAMstack focus, forms, serverless, similar to Vercel

### Backend / Full-Stack
**Railway** - Simple, PostgreSQL/Redis/MongoDB included, GitHub integration, automatic SSL
**Render** - Similar to Railway, good for Node.js/Docker, managed databases
**Fly.io** - Global edge deployment, Docker-based, great for WebSocket apps

### Enterprise / Complex
**AWS (ECS/Fargate)** - Full control, scalable, complex setup, higher cost
**Google Cloud Run** - Serverless containers, auto-scaling, pay per use
**DigitalOcean App Platform** - Simple Heroku alternative, reasonable pricing

## CI/CD Pattern

**GitHub Actions** - Test on PR, deploy on merge to main
**GitLab CI** - Similar workflow, built-in container registry
**CircleCI** - Fast, good caching, pipeline visualization

**Standard Flow:**
1. Push to branch → Run tests
2. Merge to main → Build + test
3. Deploy to staging → Run smoke tests
4. Deploy to production (manual approval for critical apps)
5. Monitor metrics post-deploy

## Environment Management

**Local:** .env file (never commit)
**Staging/Production:** Platform environment variables or secrets manager
**Secrets:** AWS Secrets Manager, HashiCorp Vault, or platform-specific

## Database Migrations

**Strategy:** Run migrations BEFORE deploying new code
**Tools:** Prisma migrate, TypeORM migrations, or raw SQL scripts
**Safety:** Test migrations on staging first, backup before production

## Monitoring Post-Deploy

- Health check endpoints (`/health`, `/ready`)
- Error tracking (Sentry, Rollbar)
- Performance monitoring (Datadog, New Relic)
- Log aggregation (Logtail, Better Stack)
- Alert on error rate spikes or response time degradation

## Rollback Plan

**Immediate:** Revert to previous deployment (platform UI or CLI)
**Database:** Keep backward-compatible migrations for at least one version
**Feature Flags:** Use feature flags to disable new features without redeployment
