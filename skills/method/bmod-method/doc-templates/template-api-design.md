---
title: ""
template: api-design
version: 1.0.0
category: decisions
description: "Public API, webhook, or partner integration contract with versioning and error rules."
not_for: "Internal story-to-story seams inside one epic (`arch-epic`); whole-system architecture (`arch-spine`)."
agents: [bmad-agent-architect]
facilitation_order: [consumers-and-use-cases, auth-tenancy-and-rate-limits, resources-endpoints-and-events, errors-and-edge-cases, versioning-and-lifecycle, contract-testing-and-sandbox, open-questions]
guidance: guidance-method.md
rubric: rubric-architecture.md
status: draft
created: ""
updated: ""
---

<!-- purpose: Lock a durable external or cross-team API, webhook, or event contract before consumers build against it and breaking changes become expensive. -->

<!-- stance:
  - Think like an external developer integrating against this API for the first time with no internal context.
  - Force upfront calls on the rules teams regret skipping: idempotency, pagination, rate limits, error codes, webhook retries/signing, and deprecation windows.
  - Align conventions with existing repo or parent `arch-spine` `AD-n` rules when present.
-->

<!-- opening: Read any parent `arch-spine`, `prd`, or existing API specs first, then ask who consumes this surface (public developers, specific B2B partners, or separate internal teams) and what compatibility promises apply. -->

<!-- inputs: Consumer profiles, core operations/events, auth/tenancy model, and SLA/compatibility expectations. -->

<!-- writing:
  - Keep endpoint and event tables crisp with exact methods, paths/topics, idempotency keys, and status/error shapes.
  - Show concrete JSON payload examples only inside fenced code blocks where they fix a non-obvious envelope or webhook signature shape.
-->

<!-- companions: When machine-readable specs are needed for codegen, SDKs, or partner portals, also write `openapi.yaml` or `asyncapi.yaml` beside `{doc}` and register it in the parent `arch-spine` Contract index. -->

<!-- done when: Auth, scopes, and rate limits are explicit; every endpoint or event defines inputs, outputs, pagination, and idempotency; error taxonomy and webhook delivery semantics are settled; and versioning/deprecation rules are agreed. -->

# {title}

## Table of Contents

## Consumers and use cases
<!--
  - Name who integrates (public devs, B2B partners, mobile clients, peer services), expected traffic/burst patterns, and any parent `OKR-N` / `INV-N` or `AD-n` constraints.
  - State sync vs. async (REST/RPC vs. webhooks/events) boundaries clearly.
  - Done when consumers, primary flows, and compatibility stakes are clear.
-->

## Auth, tenancy and rate limits
<!--
  - Specify authentication mechanism (OAuth2, API keys, mTLS, JWT), fine-grained scopes, tenant isolation enforcement, and secret rotation.
  - Define rate-limit tiers, burst policy, response headers (`Retry-After`, quota headers), and abuse throttling.
  - Done when an integrator knows how to authenticate, stay isolated, and handle throttling.
-->

## Resources, endpoints and events
<!--
  - List endpoints/operations and outbound webhooks or domain events in structured tables with exact resource nouns, pagination strategy (cursor vs. offset), filtering, and idempotency keys on mutating calls.
  - For webhooks/events, specify payload envelope, HMAC/signature verification, ordering guarantees, and retry/backoff/DLQ behavior.
  - Include a `diagram: sequence` for multi-step async or callback flows.
  - Done when every public operation and event contract is complete enough to write `openapi.yaml` / `asyncapi.yaml` or contract tests.
-->

## Errors and edge cases
<!--
  - Lock one uniform error envelope (code, message, machine-readable type, correlation/request ID, field-level details) and HTTP/status mapping.
  - Cover partial failures, validation errors, timeouts, duplicate submissions, and out-of-order deliveries.
  - Done when consumers can handle every error class programmatically without parsing free text.
-->

## Versioning and lifecycle
<!--
  - Define versioning scheme (URL prefix, header, date-based, additive-only schema evolution), what constitutes a breaking change, deprecation notice policy, and sunset mechanics.
  - Done when both provider and consumers agree on how changes ship safely.
-->

## Contract testing and sandbox
<!--
  - Specify sandbox/mock environment behavior, schema validation in CI, consumer-driven contract tests, and whether `openapi.yaml` / `asyncapi.yaml` companion files are emitted.
  - Done when breaking changes are caught automatically before release.
-->

## Open questions
<!-- optional. Unsettled contract details, naming owner and target milestone. -->
