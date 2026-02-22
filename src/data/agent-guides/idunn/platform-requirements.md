# Idunn's Platform Requirements Guide

**When to load:** During Phase 3 (Platform Requirements) or technical foundation work

---

## Core Principle

**Technical foundation enables everything - prove the concept works in parallel with design.**

Platform requirements aren't just technical specs - they're risk mitigation and feasibility validation.

---

## What is Phase 3?

**Phase 3 runs IN PARALLEL with Phase 4 (UX Design):**

```
Phase 3: Platform Requirements (You)
├── Validate technical feasibility
├── Create proofs of concept
├── Set up experimental endpoints
└── Document technical constraints

Phase 4: UX Design (Freya)
├── Create page specifications
├── Design user flows
├── Build interactive prototypes
└── Add functional requirements to PRD

Result: Design + Platform proven together
```

**Why parallel:** Design discovers what we need, Platform proves we can build it.

---

## The Platform PRD Structure

### 1. Technical Architecture
**How will this be built?**

- Technology stack decisions
- Infrastructure approach (cloud, serverless, containers)
- Database architecture
- API design patterns
- Authentication & authorization
- Caching strategy
- File storage

**Purpose:** Clear technical direction, validated choices

---

### 2. Data Model
**What information do we store and how?**

- Core entities and relationships
- Data validation rules
- Data migration strategy (if brownfield)
- Data retention policies
- GDPR/privacy considerations

**Purpose:** Solid foundation for all features

---

### 3. Integrations
**What external systems do we connect to?**

- Third-party APIs (payment, email, SMS, etc.)
- Authentication providers (OAuth, SAML, etc.)
- Analytics and monitoring
- Webhooks (incoming/outgoing)

**Purpose:** Validated integration approaches

---

### 4. Security Framework
**How do we protect users and data?**

- Authentication approach
- Authorization model (RBAC, ABAC, etc.)
- Data encryption (at rest, in transit)
- Security headers and CSP
- Rate limiting
- Audit logging

**Purpose:** Security baked in, not bolted on

---

### 5. Performance Framework
**How do we ensure speed and reliability?**

- Performance targets (page load, API response)
- Caching strategy
- CDN approach
- Database optimization
- Background jobs
- Real-time requirements (if any)

**Purpose:** Performance designed in, not hoped for

---

### 6. Scalability Approach
**How will this grow?**

- Expected load (users, requests, data)
- Scaling strategy (vertical, horizontal)
- Database scaling
- File storage scaling
- Cost projections

**Purpose:** No surprises as you grow

---

### 7. Monitoring & Operations
**How do we know it's working?**

- Application monitoring
- Error tracking
- Performance monitoring
- Logging strategy
- Alerting rules
- Backup and recovery

**Purpose:** Confidence in production

---

### 8. Deployment Strategy
**How do we ship it?**

- CI/CD pipeline
- Environment strategy (dev, staging, prod)
- Database migration approach
- Feature flags
- Rollback strategy

**Purpose:** Safe, repeatable deployments

---

### 9. Technical Constraints
**What are our technical limits?**

Document for Freya (UX Designer):
- Performance limits (page load budgets)
- Browser/device support
- File size/type limits
- Rate limits
- API restrictions
- Technical debt

**Purpose:** Design works within reality

---

## Proof of Concept Strategy

**Don't just spec - validate!**

### High-Risk Items to Prove
- ✅ Complex integrations (can we actually connect?)
- ✅ Performance concerns (can we handle the load?)
- ✅ Novel technical approaches (will this work?)
- ✅ Third-party dependencies (are they reliable?)

### What to Build
- Minimal experimental endpoints
- Small proof-of-concept apps
- Integration spike tests
- Load testing scripts

**Goal:** Reduce technical risk before committing to design decisions

---

## Parallel Work with Design

**Phase 3 and Phase 4 inform each other:**

### Design Discovers Needs
**Freya (Phase 4):** "Users need to upload 50MB video files"

**You (Phase 3):** "Okay, let me validate:
- Which cloud storage? (AWS S3, Cloudflare R2?)
- Direct upload or through backend?
- What's the cost at scale?
- Any processing needed?"

---

### Platform Sets Constraints
**You (Phase 3):** "Our API can handle 1000 req/sec max"

**Freya (Phase 4):** "Got it, I'll design with:
- Client-side caching
- Batch operations where possible
- Optimistic UI updates"

---

### Together You Iterate
**Freya:** "This feature needs real-time updates"

**You:** "WebSockets? Server-Sent Events? Or poll every 5 seconds?"

**Together:** "Let's prototype WebSockets, fall back to polling if issues"

---

## Reference, Don't Duplicate

**Platform PRD is the source of truth for technical details**

### ❌ Wrong (Duplication)
```
Page Spec: "Use OAuth 2.0 with authorization code flow..."
Platform PRD: "Use OAuth 2.0 with authorization code flow..."
```

**Why bad:** Two places to update, gets out of sync

---

### ✅ Right (Reference)
```
Page Spec: "User authentication (see Platform PRD Section 3.1)"
Platform PRD: "3.1 Authentication: OAuth 2.0 with authorization code flow..."
```

**Why better:** Single source of truth

---

## Organize by Value

**Group requirements by epic and development sequence:**

### Epic-Based Organization
```
Platform PRD
├── Epic 1: User Authentication
│   ├── OAuth 2.0 integration
│   ├── Session management
│   └── Password reset flow
├── Epic 2: Proposal Management
│   ├── Document storage
│   ├── Template engine
│   └── PDF generation
└── Epic 3: Team Collaboration
    ├── Real-time updates
    ├── Commenting system
    └── Permissions model
```

**Why:** Developers implement by epic, this maps to their workflow

---

## Technical Debt Tracking

**Document known compromises:**

### Format
```markdown
## Technical Debt

### [Item Name]
**What:** [Description of the compromise]
**Why:** [Reason we chose this approach]
**When to address:** [Timeline or trigger]
**Effort:** [Estimated work to fix]
```

### Example
```markdown
### File Upload Direct to Browser
**What:** Files upload directly to S3 from browser, no virus scanning
**Why:** Fast MVP, virus scanning adds $200/month and 2 weeks dev time
**When to address:** After 100 paid users or security audit
**Effort:** 1 week dev + integration testing
```

---

## Common Platform Mistakes

### ❌ Over-Engineering
"Let me design for 1M users from day 1..."

**Instead:** "Design for 1K users, document how to scale to 100K"

---

### ❌ Under-Specifying
"We'll figure out the database later..."

**Instead:** "SQLite for POC, Postgres for production, migration path documented"

---

### ❌ Ignoring Constraints
"Design whatever you want, we'll make it work..."

**Instead:** "Here are performance budgets and technical limits for design"

---

### ❌ Working in Isolation
"I'll finish the platform PRD, then design can start..."

**Instead:** "Start Platform PRD, share constraints early, iterate together"

---

## Platform PRD Checklist

Before marking Platform PRD "complete":

- [ ] **Architecture decided** - Technology stack validated?
- [ ] **Data model defined** - Core entities and relationships clear?
- [ ] **Integrations validated** - Proof of concepts for risky items?
- [ ] **Security framework** - Authentication, authorization, encryption?
- [ ] **Performance targets** - Measurable goals set?
- [ ] **Scalability approach** - Growth strategy documented?
- [ ] **Monitoring plan** - How we'll know it's working?
- [ ] **Constraints documented** - Shared with UX Designer?
- [ ] **Technical debt** - Known compromises tracked?
- [ ] **Organized by epics** - Maps to development workflow?

---

## Related Resources

- **Platform Requirements Workflow:** `../../workflows/1-project-brief/`
- **Platform PRD Template:** `../../workflows/1-project-brief/templates/platform-requirements.template.yaml`
- **Phase 4 Coordination:** Work with Freya WDS Designer Agent
- **BMM Handoff:** Feeds into BMM Phase 2 (Architecture)

---

*Platform requirements aren't overhead - they're risk mitigation and feasibility validation.*


