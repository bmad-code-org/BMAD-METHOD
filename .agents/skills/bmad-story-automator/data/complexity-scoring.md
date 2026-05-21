# Story Complexity Scoring (v2.0.0)

Estimate each story's complexity to predict dev-story success likelihood and inform agent selection. Scoring combines **regex-based pattern matching** (detecting domain signals in story text) with **structural analysis** (measuring story size and shape).

---

## How Scoring Works

The Python helper (`scripts/story-automator parse-story --rules`) performs two passes:

### Pass 1: Pattern Matching (regex rules)

Each rule in `complexity-rules.json` has a regex pattern tested case-insensitively against the concatenation of the story's **title + description + acceptance criteria**. When a rule matches, its score is added (positive = complexity, negative = simplicity).

### Pass 2: Structural Analysis

The parser also examines the story's **structure** independent of text content:

| Structural Factor | Condition | Score | Reason |
|---|---|---|---|
| Acceptance Criteria count (medium) | AC lines > 6 | +1 | More ACs = more surface area to implement and verify |
| Acceptance Criteria count (high) | AC lines > 10 | +2 | (replaces medium; not additive) Large AC count signals multi-faceted story |
| Explicit dependency | Story references dependency on another story | +1 | Cross-story dependencies add coordination overhead |
| Large story | Word count > 400 | +1 | Verbose stories indicate broader scope |

### Final Score

`final_score = sum(matched_rule_scores) + structural_bonus`

---

## Rule Categories (40 rules)

### External Integration (+2 each)

| Rule | Detects |
|---|---|
| External API integration | Third-party services (Stripe, Twilio, WhatsApp, AWS SDK, etc.) |
| Webhook/async processing | Webhooks, message queues, pub/sub, background jobs, event-driven patterns |
| Real-time communication | WebSockets, SSE, push notifications, live updates, long polling |

### Database & Data (+1 to +2)

| Rule | Score | Detects |
|---|---|---|
| Database schema changes | +1 | Migrations, new tables, index creation, foreign keys |
| Complex database operations | +2 | Complex queries, joins, subqueries, aggregates, stored procedures, transactions |
| Data transformation/ETL | +2 | Data pipelines, bulk import/export, CSV parsing, data sync, normalization |
| Caching layer | +1 | Redis, memcache, CDN, cache invalidation, session stores |
| Search/indexing | +2 | Elasticsearch, Algolia, full-text search, vector search |
| File upload/storage | +1 | S3, blob storage, file processing, PDF/CSV generation, presigned URLs |

### Security & Auth (+1 to +2)

| Rule | Score | Detects |
|---|---|---|
| Authentication system | +2 | Login flows, JWT, password reset, SSO, 2FA/MFA, social login |
| Authorization/permissions | +2 | RBAC, ACL, row-level security, multi-tenant isolation, route guards |
| Encryption/security | +1 | Encryption, hashing, CSRF/XSS protection, security headers, CORS |

### State & Architecture (+1 to +2)

| Rule | Score | Detects |
|---|---|---|
| Complex state management | +1 | Redux, Zustand, state machines, CQRS, event sourcing, optimistic updates |
| Backend + Frontend combined | +2 | Full-stack changes touching both API and UI layers |
| Service communication | +2 | Microservices, gRPC, API gateway, service mesh, distributed systems |
| Infrastructure changes | +2 | Docker, Kubernetes, CI/CD, reverse proxies, deployment, auto-scaling |

### Error Handling & Resilience (+1 to +2)

| Rule | Score | Detects |
|---|---|---|
| Complex error handling | +1 | Error boundaries, retry logic, circuit breakers, graceful degradation, idempotency |
| Transaction management | +2 | Atomic operations, distributed locks, conflict resolution, race conditions |

### Performance (+1)

| Rule | Score | Detects |
|---|---|---|
| Performance optimization | +1 | Pagination, lazy loading, code splitting, memoization, Core Web Vitals |
| Rate limiting/throttling | +1 | Rate limits, quotas, backoff strategies, cooldowns |
| Batch/bulk operations | +1 | Batch processing, bulk inserts/updates, cron jobs, scheduled tasks |

### UI/UX Complexity (+1)

| Rule | Score | Detects |
|---|---|---|
| Complex forms | +1 | Multi-step forms, wizards, dynamic forms, conditional fields |
| Charts/visualization | +1 | D3, Recharts, dashboards, heatmaps, canvas drawing |
| Drag and drop | +1 | DnD, sortable lists, Kanban boards, reorderable UI |
| Accessibility | +1 | WCAG, ARIA, screen reader support, keyboard navigation |
| Internationalization | +1 | i18n, translations, RTL support, locale-aware formatting |

### Testing Signals (+1)

| Rule | Score | Detects |
|---|---|---|
| Integration testing required | +1 | E2E tests, Playwright, Cypress, contract tests, API endpoint tests |
| Complex test setup | +1 | Test fixtures, service mocks, seed data, test containers |

### Cross-Cutting (+1)

| Rule | Score | Detects |
|---|---|---|
| Email/notification system | +1 | Email sending, push notifications, SMS, in-app notifications |
| Logging/monitoring | +1 | Observability, telemetry, distributed tracing, Sentry, Datadog |
| Configuration/feature flags | +1 | Feature toggles, A/B tests, remote config, LaunchDarkly |

### Simplicity Reducers (-1 to -2)

| Rule | Score | Detects |
|---|---|---|
| Frontend only | -1 | UI-only, CSS-only, layout-only, static pages |
| Simple CRUD | -1 | Basic CRUD, standard REST, straightforward endpoints |
| Documentation/config only | -2 | README updates, config changes, doc-only changes |
| Pure refactor | -1 | Code cleanup, renames, restructuring with no behavior change |
| Simple bug fix | -1 | Typo fixes, null checks, missing imports, one-line patches |

### Risk/Uncertainty Signals (+1 to +2)

| Rule | Score | Detects |
|---|---|---|
| Uncertain scope | +1 | Research spikes, prototypes, POCs, TBD items, exploratory work |
| Breaking change | +2 | Breaking changes, deprecations, major version bumps, migration guides |

---

## Complexity Levels

| Score | Level | Meaning | Agent Recommendation |
|---|---|---|---|
| ≤ 3 | **Low** | High success probability | Claude handles well autonomously |
| 4–7 | **Medium** | Normal execution, moderate risk | Codex primary with Claude fallback |
| ≥ 8 | **High** | Consider longer timeouts, may need intervention | Codex primary with Claude fallback, monitor closely |

---

## Why This Matters

**Session 3 learning:** Backend WhatsApp stories (6.5-6.8) consistently failed dev-story while frontend i18n stories (7.1-7.2) succeeded. The original 8-rule system couldn't distinguish these patterns.

**v2.0 improvements:**
- 40 rules across 10 categories (was 8 rules, 1 category)
- Structural analysis adds AC count, dependency, and story size signals
- 5 simplicity reducers (was 2) prevent over-scoring simple work
- Expanded regex patterns catch contextual signals, not just exact keywords
- Recalibrated thresholds account for higher score range

**Without accurate complexity scoring:**
- Agent configuration cannot be informed by actual story difficulty
- Simple stories get over-provisioned (waste) or complex stories get under-provisioned (failure)
- The orchestration may fail or produce suboptimal results
