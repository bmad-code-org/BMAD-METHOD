# <!-- Powered by BMAD™ Core -->

# Deployment Readiness Checklist

## Code Quality
- [ ] **All Tests Pass** - Unit, integration, E2E tests green
- [ ] **No TypeScript Errors** - tsc --noEmit passes
- [ ] **No Lint Errors** - ESLint passes
- [ ] **Code Coverage** - Meets target (80%+)
- [ ] **Code Review** - All changes peer reviewed
- [ ] **Dependencies Updated** - No critical vulnerabilities

## Environment Configuration
- [ ] **Environment Variables** - All required env vars documented
- [ ] **Secrets Configured** - Production secrets set in hosting platform
- [ ] **Database URL** - Production database URL configured
- [ ] **API Keys** - All third-party API keys set
- [ ] **Feature Flags** - Feature flag configuration ready

## Database
- [ ] **Migrations Tested** - Migrations tested on staging
- [ ] **Rollback Plan** - Migration rollback tested
- [ ] **Seed Data** - Production seed data if needed
- [ ] **Backups** - Automated backups configured
- [ ] **Connection Pool** - Connection pooling configured

## Security
- [ ] **HTTPS** - SSL certificate installed and tested
- [ ] **Security Headers** - All security headers configured
- [ ] **CORS** - CORS properly configured for production domain
- [ ] **Rate Limiting** - Rate limiting enabled
- [ ] **Authentication** - Auth flows tested in production-like environment
- [ ] **Secrets Rotation** - Secrets rotation plan in place
- [ ] **npm audit** - No high/critical vulnerabilities

## Performance
- [ ] **Load Testing** - Tested at 2x expected load
- [ ] **CDN Configuration** - CDN configured and tested
- [ ] **Caching** - Redis/caching layer configured
- [ ] **Database Indexes** - Critical indexes in place
- [ ] **Bundle Size** - Frontend bundle size optimized
- [ ] **Lighthouse Score** - >90 on all metrics

## Monitoring & Logging
- [ ] **Error Tracking** - Sentry or similar configured
- [ ] **Logging** - Structured logging configured
- [ ] **APM** - Application monitoring configured
- [ ] **Uptime Monitoring** - Uptime monitors set up
- [ ] **Alerts** - Critical alerts configured
- [ ] **Dashboards** - Monitoring dashboards created

## CI/CD Pipeline
- [ ] **Automated Tests** - All tests run in CI
- [ ] **Build Process** - Build succeeds in CI
- [ ] **Deployment Script** - Automated deployment configured
- [ ] **Rollback Process** - Rollback procedure documented and tested
- [ ] **Blue-Green/Canary** - Safe deployment strategy
- [ ] **Health Checks** - Health check endpoints working

## Documentation
- [ ] **README** - Complete setup and deployment instructions
- [ ] **API Docs** - API documentation up to date
- [ ] **Architecture** - Architecture docs current
- [ ] **Runbooks** - Incident response runbooks
- [ ] **Changelog** - Release notes prepared

## Infrastructure
- [ ] **DNS** - DNS configured and propagated
- [ ] **Load Balancer** - Load balancer configured if needed
- [ ] **Auto-scaling** - Auto-scaling rules configured
- [ ] **Firewall Rules** - Firewall properly configured
- [ ] **Database Backups** - Automated backups running
- [ ] **Disaster Recovery** - DR plan documented

## Third-Party Services
- [ ] **Payment Gateway** - Stripe/payment provider in production mode
- [ ] **Email Service** - Email provider configured
- [ ] **Storage** - S3 or file storage configured
- [ ] **Analytics** - Analytics tracking configured
- [ ] **CDN** - CDN service active

## Pre-Launch Checklist
- [ ] **Smoke Tests** - Critical paths tested on production
- [ ] **Performance Test** - Production performance verified
- [ ] **Security Scan** - Final security audit completed
- [ ] **Backup Verified** - Can restore from backup
- [ ] **Rollback Tested** - Rollback procedure verified
- [ ] **Team Notified** - All team members aware of launch
- [ ] **Support Ready** - Support team briefed

## Post-Launch
- [ ] **Monitor Metrics** - Watch dashboards for 24 hours
- [ ] **Error Rates** - Monitor error rates closely
- [ ] **Performance** - Verify performance targets met
- [ ] **User Feedback** - Collect and monitor user feedback
- [ ] **Hotfix Process** - Hotfix procedure ready if needed

**Deployment Readiness:** [ ] Go [ ] No-Go

**Blockers:**
_List any items preventing deployment_

**Launch Date:** _________
**Launch Time:** _________
**Launch Coordinator:** _________