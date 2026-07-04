# Deployment Checklist — AI Product Factory

Verify before deploying to production.

## Pre-Deploy
- [ ] All tests passing in CI
- [ ] No critical/high security vulnerabilities
- [ ] Environment variables documented
- [ ] Secrets in secure vault (not in repo)
- [ ] Database migrations tested on staging
- [ ] Rollback plan documented

## Infrastructure
- [ ] Hosting provisioned
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] CDN configured (if applicable)
- [ ] Backup strategy in place

## Application
- [ ] Production build succeeds
- [ ] Health check endpoint responds
- [ ] Auth flows work in production
- [ ] Payment webhooks configured (if applicable)
- [ ] Email delivery verified (if applicable)

## Monitoring
- [ ] Error tracking (Sentry) active
- [ ] Uptime monitoring configured
- [ ] Analytics firing correctly
- [ ] Alert thresholds set

## Mobile (if applicable)
- [ ] Signing certificates valid
- [ ] Provisioning profiles current
- [ ] App Store metadata complete
- [ ] Screenshots uploaded
- [ ] TestFlight/Internal testing passed

## Post-Deploy
- [ ] Smoke test all critical paths
- [ ] Verify analytics events
- [ ] Document production URLs
- [ ] Notify team of deployment
