# Step 6: API Specifications (API-First Design)

## Purpose

Define comprehensive API contracts through systematic category-by-category discussion.

## Context for Agent

API-first approach: clear service contracts enable backend development in parallel with UX design. For each endpoint, document method, path, purpose, request/response format, and business rules.

## Instructions

Explain: "By defining clear service contracts now, we enable backend development to proceed in parallel with UX design."

### 6A: Authentication APIs

Based on the security framework, define auth endpoints:
- Login, logout, token refresh, password reset, email verification
- For each: method/path, request/response, business rules (token lifetime, error responses, rate limiting)

### 6B: Core Entity APIs (CRUD)

For each entity from the data model:
- `GET /api/{entity}` - List with pagination
- `GET /api/{entity}/:id` - Get single
- `POST /api/{entity}` - Create
- `PUT /api/{entity}/:id` - Update
- `DELETE /api/{entity}/:id` - Delete
- Business rules: validation, authorization, pagination, related data, constraints

### 6C: External Integration APIs

For each external service from Step 3:
- Wrapper endpoints with method/path
- Business rules: pre-call validation, caching, fallback on failure, rate limiting, cost tracking

### 6D: Business Logic APIs

Dedicated endpoints for calculations, availability checks, pricing, recommendations, aggregations:
- For each: method/path, purpose, request/response, calculation logic, edge cases, performance expectations

## After All APIs

Summarize the API surface and ask: "Any other API operations we should include?"

**Output:** Create `04-API-Specifications.md`

## Next Step

Proceed to step-07-data-and-performance.md

## State Update

```yaml
stepsCompleted: ['step-01-welcome.md', 'step-02-platform-architecture.md', 'step-03-integration-mapping.md', 'step-04-technical-validation.md', 'step-05-security-framework.md', 'step-06-api-specifications.md']
```
