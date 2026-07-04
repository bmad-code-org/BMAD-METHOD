---
name: bmad-apf-choose-stack
description: Select optimal tech stack based on product requirements, team skills, and platform constraints.
---

# Choose Tech Stack — AI Product Factory

## On Activation

1. Load PRD, architecture constraints, `{target_platform}`, `{product_type}`.
2. Load `file:{project-root}/expansion-packs/ai-product-factory/knowledge/tech-stack-decision-matrix.md`

## Step 1: Requirements Extraction

From PRD and MVP features, extract:
- Real-time needs
- Offline support
- Auth complexity
- Payment requirements
- Scale expectations
- Team skill assumptions

## Step 2: Platform Selection

Based on `{target_platform}` and `{product_type}`:

| Product Type | Default Stack |
|---|---|
| mobile-app + flutter | Flutter + Supabase/Firebase + RevenueCat |
| mobile-app + react-native | React Native + Expo + Supabase |
| mobile-app + swiftui | SwiftUI + SwiftData + CloudKit/Supabase |
| saas | Next.js + Supabase/PostgreSQL + Stripe |
| landing | Next.js + Tailwind + Vercel |
| telegram-bot | Node.js/Python + Telegram Bot API + PostgreSQL |
| ai-agent | Next.js/Python + OpenAI/Anthropic + Vector DB |

## Step 3: Component Selection

For each layer, recommend with rationale:
- Frontend framework
- Backend/API
- Database
- Auth provider
- Payments
- Analytics (PostHog/Amplitude)
- Hosting/CI

## Step 4: ADR Document

Write Architecture Decision Record to `{apf_artifacts}/engineering/tech-stack.md` with:
- Decision summary
- Options considered
- Rationale
- Trade-offs accepted

## Handoff

- `bmad-create-architecture` (BMM)
- `bmad-apf-build-mvp`

Run `{workflow.on_complete}`.
