# Phase 3: Requirements (PRD)

**Agent:** Freyja the PM  
**Output:** `D-PRD/` (or your configured prefix)  
**Duration:** 1-2 hours

---

## What This Phase Does

Requirements defines the technical foundation and functional specifications. This phase bridges strategic vision with implementation details, creating the PRD (Product Requirements Document) that guides development.

By the end, you'll have clear requirements that development teams can act on.

---

## What You'll Create

Your PRD includes:

- **Platform Architecture** - Technology stack and infrastructure decisions
- **Data Model** - Core entities and relationships
- **API Specifications** - Endpoints and data contracts
- **Integration Requirements** - External services and dependencies
- **Security Framework** - Authentication, authorization, data protection
- **Performance Requirements** - Speed, scale, reliability expectations
- **Functional Specifications** - Feature-level requirements

---

## How It Works

### Platform Foundation First

Before diving into features, establish the technical foundation:

**Architecture Decisions:**
- What technology stack fits your needs?
- Monolith vs. microservices vs. serverless?
- What hosting/infrastructure approach?
- What are the key technical constraints?

**Data Model:**
- What are the core entities?
- How do they relate to each other?
- What's the database strategy?

**Integration Points:**
- What external services are needed?
- Authentication providers?
- Payment systems?
- Third-party APIs?

### Security & Performance

**Security Framework:**
- How do users authenticate?
- What authorization model?
- Data encryption approach?
- Compliance requirements?

**Performance Requirements:**
- Expected load and scale?
- Response time expectations?
- Availability requirements?
- Caching strategy?

### Functional Requirements

After the foundation is set, define feature-level requirements:

- User stories or use cases
- Acceptance criteria
- Edge cases and error handling
- Integration with the technical foundation

---

## The Design Connection

PRD work in WDS is informed by:

- **Product Brief** (Phase 1) - Strategic vision and success criteria
- **Trigger Map** (Phase 2) - User priorities and business goals

And it enables:

- **UX Design** (Phase 4) - Technical context for design decisions
- **Design System** (Phase 5) - Component technical requirements
- **Development** - Clear implementation guidance

---

## When to Use This Phase

**Use this phase when:**
- Building platform/infrastructure for a new product
- Need technical decisions documented before design
- Development team needs architectural clarity

**Timing considerations:**
- Can run parallel to Phase 4 (UX Design) once foundation is set
- Platform infrastructure can start while UX design continues
- Functional requirements often finalize after Phase 4

**Skip or minimize if:**
- Simple project with obvious technical approach
- Working within existing platform/infrastructure
- Enhancement that doesn't change architecture

---

## What to Prepare

Bring:
- Product Brief (Phase 1)
- Trigger Map (Phase 2)
- Any existing technical constraints
- Development team input if available

---

## What Comes Next

Your PRD enables:

- **Phase 4: UX Design** - Design within technical constraints
- **Phase 6: Dev Integration** - Handoff with complete technical context
- **Development** - Backend/platform work can begin

---

## Tips for Great Sessions

**Balance depth with progress**
- Document decisions, not every detail
- Focus on what developers need to start
- Iterate as design clarifies requirements

**Stay connected to strategy**
- Reference trigger map priorities
- Ensure technical decisions serve user goals
- Don't over-engineer for hypothetical needs

**Collaborate with development**
- Technical decisions benefit from dev input
- Early alignment prevents rework
- Architecture is a conversation, not a decree

---

## Example Output

See: `examples/dog-week-patterns/D-PRD/` for a complete PRD from a real project.

---

*Phase 3 of the Whiteport Design Studio method*

