---
name: bmad-apf-generate-backend
description: Generate backend services, API endpoints, and database integration from architecture and PRD.
---

# Generate Backend — AI Product Factory

## On Activation

1. Load architecture, database schema, PRD API requirements, tech stack.
2. Load backend patterns: `file:{project-root}/expansion-packs/ai-product-factory/knowledge/backend-patterns.md`

## Step 1: API Specification

Generate OpenAPI spec from PRD requirements.
Output: `{apf_artifacts}/engineering/api-spec.yaml`

## Step 2: Database Implementation

Invoke `bmad-apf-database` — migrations, models, seed data.

## Step 3: Service Layer

Implement via Cursor:
- Route handlers
- Business logic
- Validation
- Error handling

## Step 4: Auth Integration

Invoke `bmad-apf-authentication` — wire auth middleware.

## Step 5: Test Coverage

API integration tests for all endpoints.

## Handoff

`bmad-apf-build-mvp` (frontend integration) or `bmad-apf-deploy-app`.

Run `{workflow.on_complete}`.
