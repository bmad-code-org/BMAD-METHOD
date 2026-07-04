---
name: bmad-apf-deploy-app
description: Deploy the application to production — web hosting, app stores, or cloud infrastructure.
---

# Deploy App — AI Product Factory

## On Activation

1. Load tech stack, CI/CD config, build progress.
2. Load deployment checklist: `file:{project-root}/expansion-packs/ai-product-factory/checklists/deployment-checklist.md`

## Step 1: Pre-Deploy Verification

- [ ] All tests passing
- [ ] Environment variables documented
- [ ] Secrets configured (not in repo)
- [ ] Database migrations ready
- [ ] Security audit passed

## Step 2: Infrastructure

Invoke `bmad-apf-infrastructure` and/or `bmad-apf-docker`:
- Provision hosting (Vercel/Railway/AWS/GCP)
- Configure domains
- Set up monitoring

## Step 3: CI/CD Pipeline

Invoke `bmad-apf-cicd`:
- GitHub Actions workflow
- Build → Test → Deploy pipeline
- Environment promotion (staging → production)

## Step 4: Platform-Specific Deployment

Based on `{product_type}`:

| Type | Agent | Output |
|---|---|---|
| web/saas | Infrastructure + Vercel | Production URL |
| mobile-app | `bmad-apf-fastlane` → store agents | TestFlight/Play Console |
| landing | Vercel/Netlify | Landing URL |
| telegram | Server deployment | Bot live |
| ai-agent | Cloud deployment | Agent endpoint |

## Step 5: Post-Deploy Verification

- Smoke test all critical paths
- Verify analytics firing
- Verify auth flows
- Document deployed URLs

Output: `{apf_artifacts}/deployment/deploy-report.md`

## Handoff

- Marketing: `bmad-apf-generate-landing`
- Growth: `bmad-apf-growth-analytics`

Run `{workflow.on_complete}`.
