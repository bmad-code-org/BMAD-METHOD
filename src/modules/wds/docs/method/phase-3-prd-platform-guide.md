# Phase 3: PRD Platform (Technical Foundation)

**Agent:** Freya the PM  
**Output:** `C-Requirements/` (or your configured prefix)

---

## What This Phase Does

This phase establishes everything technical that can be done **without the final UI**. It's about platform decisions, technical feasibility, and proving that your innovative features actually work.

By the end, you'll have a solid technical foundation and confidence that your key features are buildable.

---

## The Core Principle

**Prove our concept works technically — in parallel with design work.**

While UX designers explore how users interact with features, technical validation runs alongside:

- Can we actually build this?
- Do the external services we need exist and work as expected?
- What platform and infrastructure do we need?
- What constraints does design need to know about?

Design and technical validation inform each other. Neither waits for the other to finish.

---

## What You'll Create

- **Platform Architecture** - Technology stack and infrastructure decisions
- **Data Model** - Core entities and relationships
- **Integration Map** - External services and how they connect
- **Technical Proofs of Concept** - Validation that risky features work
- **Experimental Endpoints** - API specs for known requirements (feeds into E-UI-Roadmap)
- **Security Framework** - Authentication, authorization, data protection
- **Technical Constraints Document** - What design needs to know

---

## How It Works

### Stage 1: Platform Decisions (30-45 minutes)

Establish the technical foundation:

**Architecture:**

- What technology stack fits your needs?
- Monolith vs. microservices vs. serverless?
- What hosting/infrastructure approach?
- What are the key technical constraints?

**Data Model:**

- What are the core entities?
- How do they relate to each other?
- What's the database strategy?

### Stage 2: Integration Mapping (20-30 minutes)

Identify all external dependencies:

- Authentication providers (OAuth, SSO)
- Payment systems (Stripe, PayPal)
- Third-party APIs (Google Maps, SendGrid, Twilio)
- Data sources and feeds
- Analytics and monitoring

### Stage 3: Technical Proofs of Concept (Variable)

**This is crucial.** For innovative or risky features, validate feasibility BEFORE committing to the design.

**Examples:**

| Feature Idea                        | Proof of Concept Question                                          |
| ----------------------------------- | ------------------------------------------------------------------ |
| "Show drive time between locations" | Can we call Google Maps Directions API and get estimated duration? |
| "Real-time availability updates"    | Can we set up WebSocket connections that scale?                    |
| "AI-powered recommendations"        | Does the ML model perform well enough with our data?               |
| "Offline mode"                      | Can we sync data reliably when connection returns?                 |
| "Video calling"                     | Which provider works best? What's the latency?                     |

**What a PoC validates:**

- The API/service exists and does what we need
- Performance is acceptable
- Cost is within budget
- Data format works for our needs
- Edge cases are handleable

**PoC Output:**

- Working code snippet or prototype
- Documented limitations and gotchas
- Cost estimates (API calls, compute, etc.)
- Go/No-Go recommendation for the feature

> **Why this matters:** It's a great morale boost when you've proven your core features will work. And if you discover limitations or surprises, it's valuable to know them early so design can account for them from the start.

### Stage 4: Security & Performance Framework (20-30 minutes)

**Security:**

- Authentication approach (passwords, OAuth, SSO, passwordless)
- Authorization model (roles, permissions, row-level security)
- Data encryption needs (at rest, in transit)
- Compliance requirements (GDPR, HIPAA, PCI-DSS, etc.)

**Performance:**

- Expected load and scale
- Response time expectations
- Availability requirements (99.9%? 99.99%?)
- Caching strategy

### Stage 5: Experimental Endpoints (Variable)

**Set up the endpoints you KNOW you'll need.**

Even before the UI is designed, you often know certain data operations are essential. Setting these up early provides:

- **Early validation** - Does the endpoint actually return what we need?
- **Fail fast** - Discover problems before investing in design
- **Developer head start** - Backend work can begin immediately
- **Design confidence** - Designers know what data is available

**What to set up:**

| Endpoint Type         | Example                                  | Why Early?                  |
| --------------------- | ---------------------------------------- | --------------------------- |
| Core CRUD             | `GET /api/dogs`, `POST /api/bookings`    | Foundation for everything   |
| External integrations | `GET /api/routes/estimate` (Google Maps) | Validates third-party works |
| Authentication        | `/api/auth/login`, `/api/auth/refresh`   | Security model proven       |
| Key calculations      | `/api/availability/check`                | Business logic validated    |

**Output:**

For each experimental endpoint, document:

- Endpoint specification (method, path, request/response)
- What it validates
- Current status (stub, working, blocked)
- Dependencies and notes

These specifications go in your Requirements folder AND become tasks in the `E-UI-Roadmap/` handover folder for development teams.

> **The mindset:** Every endpoint you validate early is one less surprise during development. Every endpoint that fails early saves weeks of wasted design work.

### Stage 6: Technical Constraints Document (15-20 minutes)

Create a summary of what UX design needs to know:

- **What's possible** - Features validated by PoCs
- **What's not possible** - Technical limitations discovered
- **What's expensive** - Features with high API/compute costs
- **What affects design** - Loading times, offline behavior, real-time vs. polling
- **Platform capabilities** - What the framework/platform provides out of the box

This document becomes essential input for Phase 4 (UX Design).

---

## The Design Connection

Phase 3 is informed by:

- **Product Brief** (Phase 1) - Strategic vision and constraints
- **Trigger Map** (Phase 2) - Prioritized features from Feature Impact Analysis

And it enables:

- **UX Design** (Phase 4) - Design within known technical constraints
- **Design System** (Phase 5) - Component technical requirements
- **Development** - Platform work can begin in parallel with design

---

## Parallel Streams

Once Phase 3 is complete:

```
Phase 3 Complete
       │
       ├──► E-UI-Roadmap/ receives:
       │    • Experimental endpoint specs
       │    • API implementation tasks
       │    • Infrastructure setup tasks
       │
       ├──► Platform/Backend Development can START
       │    (Infrastructure, APIs, data model)
       │
       └──► Phase 4: UX Design can START
            (Informed by technical constraints)
```

This parallelism is one of WDS's key efficiency gains. Development teams can begin backend work while designers continue with UX.

---

## When to Use This Phase

**Use this phase when:**

- Building platform/infrastructure for a new product
- Features depend on external APIs or services
- Innovative features need technical validation
- Development team needs architectural clarity before design

**Skip or minimize if:**

- Simple project with obvious technical approach
- Working within existing platform/infrastructure
- Enhancement that doesn't change architecture
- All features use proven, familiar technology

---

## What to Prepare

Bring:

- Product Brief (Phase 1)
- Trigger Map with Feature Impact Analysis (Phase 2)
- Any existing technical constraints
- Development team availability for PoC work

---

## What Comes Next

Your technical foundation enables:

- **Phase 4: UX Design** - Design with confidence about what's technically possible
- **Phase 6: Dev Integration** - Handoff with complete technical context
- **Development** - Backend/platform work can begin immediately

---

## Tips for Great Sessions

**Validate risky features first**

- If the Google Maps API doesn't return drive times in a usable format, you need to know NOW
- Don't design features you can't build

**Document constraints clearly**

- Designers need to know what's possible
- "Loading state required" vs "instant" changes UX significantly

**Involve developers**

- Technical decisions benefit from dev input
- PoC work may require developer time
- Architecture is a conversation, not a decree

**Stay connected to strategy**

- Reference Feature Impact Analysis scores
- High-impact features deserve more PoC investment
- Don't over-engineer for hypothetical needs

---

## Example Output

See: `examples/dog-week-patterns/C-Requirements/` for the Dog Week technical foundation.

**What Dog Week needed to prove early:**

- _"Can we show dog owners how long it takes to walk to a dog walker?"_ → Google Maps Directions API returns walking time between coordinates ✓
- _"Can we check real-time availability across multiple walkers?"_ → Endpoint aggregates calendar data in <200ms ✓
- _"Can we handle Swish payments for Swedish users?"_ → Swish API integration validated with test transactions ✓
- _"Can walkers see their schedule on mobile?"_ → Responsive calendar component renders correctly on iOS/Android browsers ✓

These early discoveries shaped both the design AND the development approach.

---

_Phase 3 of the Whiteport Design Studio method_
