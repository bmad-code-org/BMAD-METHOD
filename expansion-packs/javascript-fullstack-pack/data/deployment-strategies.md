# <!-- Powered by BMAD™ Core -->

# Deployment Strategies for JavaScript Applications

## Deployment Patterns

### 1. Rolling Deployment
**How it works:** Gradually replace old instances with new ones

**Pros:**
- Simple to implement
- No additional infrastructure needed
- Zero downtime

**Cons:**
- During deployment, old and new versions run simultaneously
- Rollback requires another deployment

**Best for:** Most applications, default choice

### 2. Blue-Green Deployment
**How it works:** Two identical environments, switch traffic between them

**Pros:**
- Instant rollback (switch back)
- Test new version before switching
- Zero downtime

**Cons:**
- Double infrastructure cost during deployment
- Database migrations can be tricky

**Best for:** Critical applications needing instant rollback

### 3. Canary Deployment
**How it works:** Route small % of traffic to new version, gradually increase

**Pros:**
- Test with real users safely
- Early problem detection
- Gradual rollout reduces risk

**Cons:**
- Complex routing logic
- Need good monitoring
- Longer deployment time

**Best for:** High-risk changes, large user bases

## Platform-Specific Deployment

### Vercel (Recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables
vercel env add DATABASE_URL production
```

**Features:**
- Automatic HTTPS
- Global CDN
- Preview deployments for PRs
- Zero-config for Next.js
- Serverless functions

### Railway (Backend/Full-stack)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and init
railway login
railway init

# Deploy
railway up
```

**Features:**
- PostgreSQL, Redis, MongoDB
- Environment variables
- Automatic SSL
- GitHub integration

### Docker + Fly.io
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

```bash
# Deploy
fly launch
fly deploy
```

### AWS (EC2/ECS/Fargate)
- Most flexible
- Complex setup
- Full control
- Higher costs

### DigitalOcean App Platform
- Simple like Heroku
- Reasonable pricing
- Good for full-stack apps

## CI/CD Setup

### GitHub Actions
**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Database Migrations

### Strategy 1: Migrations Before Deployment
```bash
# Run migrations before deploying new code
npm run db:migrate
npm run deploy
```

**Pros:** Safer, new code expects new schema

**Cons:** Brief downtime if migration is slow

### Strategy 2: Backward-Compatible Migrations
```bash
# 1. Deploy code that works with old and new schema
# 2. Run migration
# 3. Deploy code that uses new schema only
```

**Pros:** Zero downtime

**Cons:** More complex, requires multiple deploys

### Prisma Migrations
```bash
# Generate migration
npx prisma migrate dev --name add_user_role

# Apply in production
npx prisma migrate deploy
```

## Environment Management

### Environments
- **Development:** Local machine
- **Staging:** Pre-production testing
- **Production:** Live application

### Environment Variables
```bash
# Development (.env.local)
DATABASE_URL=postgresql://localhost:5432/dev
NEXT_PUBLIC_API_URL=http://localhost:3000

# Staging
DATABASE_URL=postgresql://staging.db/app
NEXT_PUBLIC_API_URL=https://staging.app.com

# Production
DATABASE_URL=postgresql://prod.db/app
NEXT_PUBLIC_API_URL=https://app.com
```

## Rollback Strategies

### 1. Git Revert + Redeploy
```bash
git revert HEAD
git push origin main
# Triggers new deployment
```

### 2. Previous Build Rollback
Most platforms keep previous builds:
```bash
# Vercel
vercel rollback

# Railway
railway rollback

# Fly.io
fly releases
fly deploy --image <previous-image>
```

### 3. Blue-Green Switch Back
If using blue-green, switch traffic back to previous environment

## Health Checks

```typescript
// /api/health endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis
    await redis.ping();

    res.json({ status: 'healthy' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error });
  }
});
```

## Monitoring Post-Deployment

### Metrics to Watch
- Error rate
- Response time (p50, p95, p99)
- CPU/Memory usage
- Database connection pool
- API endpoint latencies

### Tools
- **Sentry:** Error tracking
- **Datadog:** Full APM
- **Vercel Analytics:** Frontend vitals
- **PostHog:** Product analytics
- **Uptime Robot:** Uptime monitoring

## Deployment Checklist

### Pre-Deployment
- [ ] All tests pass locally and in CI
- [ ] Code reviewed and approved
- [ ] Database migrations tested on staging
- [ ] Environment variables configured
- [ ] Rollback plan ready
- [ ] Team notified of deployment

### During Deployment
- [ ] Monitor error rates
- [ ] Check health endpoints
- [ ] Verify critical user flows
- [ ] Watch application metrics

### Post-Deployment
- [ ] Smoke test production
- [ ] Check error tracking (Sentry)
- [ ] Monitor for 24 hours
- [ ] Update changelog
- [ ] Mark deployment as successful

## Common Issues & Solutions

**Issue:** Database connection pool exhausted

**Solution:** Increase pool size or implement connection pooling middleware

**Issue:** Cold starts in serverless

**Solution:** Use provisioned concurrency or switch to container-based hosting

**Issue:** Build failing in CI

**Solution:** Ensure all dependencies in package.json, check environment variables

**Issue:** Rollback needed

**Solution:** Use platform-specific rollback or git revert + redeploy