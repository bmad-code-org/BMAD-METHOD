# Step 7: Data Models & Performance Requirements

## Purpose

Document database schemas, entity relationships, and performance benchmarks.

## Context for Agent

Formalize the data model from earlier discussions and set clear performance expectations.

## Instructions

### 7A: Data Models

"We identified your core entities earlier. Now let's document the complete data model."

For each entity:
- Entity name and purpose
- All fields with types, constraints, defaults
- Relationships (one-to-many, many-to-many)
- Indexes for performance
- Business rules: validation, required/optional, unique constraints, cascade delete, audit trail

Create entity relationship diagram (ERD) showing all connections.

### 7B: Performance Requirements

Document systematically:
- **Response Times:** Expected latency per API category
- **Throughput:** Concurrent users, requests per second
- **Data Volume:** Expected record counts, storage needs
- **Availability:** Uptime requirements (99%, 99.9%, 99.99%?)
- **Scalability:** Growth projections and scaling triggers

### 7C: Technical Constraints for UX

Create handoff document for UX team:
- **What's Possible:** Validated features from PoCs
- **What Has Limitations:** API limits, performance constraints
- **What Affects Design:** Loading states, offline behavior, real-time vs polling
- **What's Expensive:** Cost-sensitive features requiring careful UX

### 7D: Acceptance Criteria

For each major platform area (auth, integrations, security, etc.):
- Functional criteria: What must work?
- Performance criteria: How fast/scalable?
- Security criteria: What standards?
- Testing criteria: What tests must pass?

Ask: "Any other data modeling, performance, or constraint considerations?"

**Outputs:**
- `05-Data-Models.md`
- `06-Performance-Requirements.md`
- `07-Technical-Constraints.md`
- `08-Acceptance-Criteria.md`

## Next Step

Proceed to step-08-backlog-recommendations.md

## State Update

```yaml
stepsCompleted: ['step-01-welcome.md', 'step-02-platform-architecture.md', 'step-03-integration-mapping.md', 'step-04-technical-validation.md', 'step-05-security-framework.md', 'step-06-api-specifications.md', 'step-07-data-and-performance.md']
```
