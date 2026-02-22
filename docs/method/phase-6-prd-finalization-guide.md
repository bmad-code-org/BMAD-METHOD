# Phase 6: PRD Finalization (Complete PRD)

**Agent:** Freya the PM  
**Output:** Complete PRD in `C-Requirements/` + Handoff materials in `E-UI-Roadmap/`

---

## What This Phase Does

PRD Finalization compiles all the functional requirements discovered during Phase 4 into a complete, development-ready Product Requirements Document.

**The key insight:** Your PRD started in Phase 3 with platform/infrastructure. During Phase 4, each page added functional requirements (via step 4E). Now you organize, prioritize, and finalize everything for development handoff.

By the end, developers have a complete PRD covering both technical foundation and all UI-driven features.

---

## What You'll Create

**Updated PRD (C-Requirements/) includes:**

**From Phase 3 (Technical Foundation):**

- Platform architecture
- Data model
- Integration map
- Technical proofs of concept
- Experimental endpoints
- Security framework

**Added from Phase 4 (Functional Requirements):**

- All features discovered during page design
- Page-to-feature traceability
- Priority rankings
- Feature dependencies
- Implementation notes

**New in Phase 6:**

- Feature organization by epic/area
- Development sequence
- MVP scope definition
- Technical dependencies mapped

**Handoff Package (E-UI-Roadmap/):**

- Priority sequence document
- Scenario-to-development mapping
- Component inventory (if Design System enabled)
- Open questions for dev team

---

## How It Works

### Stage 1: Review Collected Requirements (30-45 minutes)

**Gather all functional requirements added during Phase 4:**

Go through each scenario specification and extract the requirements added in step 4E:

```
From 1.1-Start-Page:
- User authentication system
- Session management
- Password reset flow

From 1.2-Sign-Up:
- Email validation (format, domain check, duplicate prevention)
- Phone number validation with country code
- Account activation via email

From 2.1-Dog-Calendar:
- Availability calendar API
- Real-time updates via WebSocket
- Date/time localization
```

**Compile into master feature list** with page references preserved.

### Stage 2: Organize by Epic/Feature Area (30-45 minutes)

**Group related features together:**

```markdown
## Epic 1: User Authentication & Account Management

### Features

**User Registration**

- Required by: 1.2-Sign-Up
- Email validation (format, domain, duplicates)
- Phone validation with country codes
- Account activation flow

**User Login**

- Required by: 1.1-Start-Page, multiple pages
- Email/password authentication
- Session management (30-day persistence)
- "Remember me" functionality

**Password Management**

- Required by: 1.1-Start-Page (reset link)
- Password reset via email
- Password strength validation
- Secure token generation
```

### Stage 3: Define Priorities & Sequence (45-60 minutes)

**Based on your Phase 2 Feature Impact Analysis:**

Reference the scoring you did in Phase 2 to inform priorities:

```markdown
## Development Sequence

### Priority 1: MVP - Core User Flow

**Target:** Weeks 1-4

Features from Epic 1 (Authentication) + Epic 2 (Core Booking):

- User registration (Impact Score: 14)
- User login (Impact Score: 16)
- Availability calendar (Impact Score: 16)
- Basic booking flow (Impact Score: 18)

**Why this order:**
Serves Priority 1 target group, addresses highest-impact drivers.

### Priority 2: Enhanced Features

**Target:** Weeks 5-8

Features from Epic 3 (Payments) + Epic 4 (Notifications):

- Payment processing (Impact Score: 12)
- Booking confirmations (Impact Score: 11)
- Calendar sync (Impact Score: 8)
```

### Stage 4: Map Dependencies (20-30 minutes)

**Technical dependencies between features:**

```markdown
## Feature Dependencies

**Booking Flow** depends on:

- ✓ User authentication (must be logged in)
- ✓ Availability calendar (must see open slots)
- ⚠️ Payment system (can launch with "pay in person" temporarily)
- ⚠️ Notifications (can launch without, add later)

**Recommendation:** Launch MVP with auth + calendar, add payments in Sprint 2.
```

### Stage 5: Create Handoff Package (30-45 minutes)

**Organize for development team:**

In `E-UI-Roadmap/` folder, create:

1. **`priority-sequence.md`** - What to build when and why
2. **`scenario-to-epic-mapping.md`** - How WDS scenarios map to dev epics
3. **`component-inventory.md`** (if Design System enabled) - All components needed
4. **`open-questions.md`** - Decisions for dev team to make

---

## The Complete PRD Structure

Your finalized PRD in `C-Requirements/` combines all phases:

```markdown
# Product Requirements Document

## 1. Technical Foundation (from Phase 3)

### Platform Architecture

- Technology stack decisions
- Infrastructure approach
- Hosting and deployment

### Data Model

- Core entities and relationships
- Database schema
- Data flow diagrams

### Integrations

- External services (Google Maps, Stripe, etc.)
- API specifications
- Authentication providers

### Security & Performance

- Authentication/authorization approach
- Data protection
- Performance requirements
- Proofs of concept results

## 2. Functional Requirements (from Phase 4)

### Epic 1: User Authentication & Account Management

**Features:**

- User registration (Required by: 1.2-Sign-Up)
- User login (Required by: 1.1-Start-Page, multiple)
- Password management (Required by: 1.1-Start-Page)

[Detailed specifications for each feature]

### Epic 2: [Next Epic]

[...]

## 3. Development Roadmap (from Phase 6)

### Priority 1: MVP (Weeks 1-4)

- Features list with Impact Scores
- Why these first (references Trigger Map)
- Timeline estimate
- Dependencies

### Priority 2: Enhanced Features (Weeks 5-8)

[...]

## 4. Dependencies & Constraints

- Technical dependencies between features
- Design constraints from Phase 4
- Third-party limitations discovered in Phase 3

## 5. Success Metrics

- Business goals from Phase 1
- Feature-specific KPIs
- How we measure success
```

---

## Continuous vs. Final Handoff

**The pattern:**

- **Phase 3:** Initial PRD with technical foundation
- **Phase 4:** PRD grows with each page (step 4E adds requirements)
- **Phase 6 (First time):** Organize MVP scope from completed scenarios
  - Create first handoff package
  - Development can begin
- **Phase 4 continues:** More pages designed, more requirements added
- **Phase 6 (Ongoing):** Update PRD priorities, create new handoff packages
  - Weekly or bi-weekly updates
  - Keep dev team synced

**You can run Phase 6 multiple times as design progresses.**

---

## When to Use This Phase

**First PRD Finalization when:**

- You have MVP-level scenarios complete (enough for dev to start)
- Core user flows are specified
- Critical features are documented
- Enough work for 2-4 week sprint

**Ongoing PRD Updates as:**

- Additional scenarios complete
- New feature areas designed
- Priorities shift based on learning
- Sprint planning needs updated scope

**Timeline example:**

```
Week 1-2: Phase 1-3 (Strategy, Research, Platform foundation)
Week 3-4: Phase 4 Scenarios 1-3 (Core MVP flows)
Week 5:   Phase 6 First Finalization
          └──► PRD v1.0: MVP scope ready
          └──► Development Sprint 1 begins

Week 6-7: Phase 4 Scenarios 4-6 (Additional features)
          Phase 5 Design System (extract components)
Week 8:   Phase 6 Update
          └──► PRD v1.1: Sprint 2 scope added
          └──► Development Sprint 2 begins

Week 9+:  Design continues in parallel with development
          Regular Phase 6 updates for new sprints
```

**The beauty:** Design doesn't block development. You hand off in waves.

Complete list for test automation:

| Scenario | Object ID             | Element Type | Notes              |
| -------- | --------------------- | ------------ | ------------------ |
| 1.1      | `welcome-hero-cta`    | Button       | Primary action     |
| 1.1      | `welcome-signin-link` | Link         | Secondary action   |
| 1.2      | `signin-email-input`  | Input        | Required field     |
| 1.2      | `signin-error-email`  | Error        | Validation message |

---

## How the Handoff Works

### Review Completeness

Before handoff, verify:

- All scenarios specified and reviewed
- Design system covers all components
- Object IDs assigned throughout
- Multilingual content complete
- HTML prototypes validated

### Identify Priorities

With Freya, map your Trigger Map priorities to development order:

- Which user triggers are most critical?
- What's the minimum viable experience?
- What can wait for later releases?

### Document Technical Context

Capture what developers need to know:

- Design decisions and their rationale
- Technical constraints discovered during design
- Interaction patterns that need special attention
- Performance considerations

### Create the Handoff

Organize everything into the UI Roadmap folder:

- Clear priority sequence
- Complete component inventory
- Technical notes and open questions
- Verification checklist

---

## The Handoff Checklist

```markdown
## Design Handoff Verification

### Product Foundation

- [ ] Product Brief complete and current
- [ ] Trigger Map with prioritized users and goals
- [ ] ICP clearly defined

### Requirements

- [ ] PRD with technical specifications
- [ ] Platform architecture documented
- [ ] Integration requirements listed

### Visual Design

- [ ] All scenarios have specifications
- [ ] All pages have Object IDs
- [ ] States documented (empty, loading, error, success)

### Design System

- [ ] All components documented
- [ ] Design tokens defined
- [ ] Usage guidelines written

### Validation

- [ ] HTML prototypes created for key scenarios
- [ ] Stakeholder review complete
- [ ] Open questions documented

### Ready for Development ✅
```

---

## When to Use This Phase (Summary)

**First handoff when:**

- You have enough scenarios for MVP
- Core user flows are specified
- Critical components are documented
- Developers can start building foundational features

**Ongoing handoffs as:**

- Each major scenario completes
- New component patterns emerge
- Design decisions affect development
- Sprint planning needs updated priorities

**The rhythm:**

```
Week 1-2: Design Phase 1-3 (Strategy, Research, Platform)
Week 3-4: Design Phase 4 Scenarios 1-2 (Core flows)
         └──► First Handoff: MVP scope
Week 5-6: Design Phase 4 Scenarios 3-4
         Design Phase 5 (Components from 1-2)
         └──► Second Handoff: Additional features
Week 7+:  Design continues...
          Development builds in parallel
          └──► Ongoing handoffs as design progresses
```

**You DON'T need to finish all design before handing off.**

Development and design work in parallel streams, with regular sync points.

---

## What to Prepare

Bring:

- Completed scenario specifications (Phase 4)
- Design System (Phase 5)
- PRD (Phase 3)
- Trigger Map priorities (Phase 2)

---

## What Comes Next

Your UI Roadmap enables:

- **Development kickoff** - Clear starting point
- **Sprint planning** - Prioritized work items
- **Test automation** - Object ID inventory
- **QA validation** - Specifications to verify against

---

## Tips for Great Sessions

**Think from dev perspective**

- What questions will developers have?
- What decisions can't you make for them?
- What context will save them time?

**Be explicit about priorities**

- Not everything is Priority 1
- Make trade-offs visible
- Connect priorities to business goals

**Document the unknowns**

- Open questions are valuable
- Don't pretend certainty you don't have
- Let dev team contribute decisions

**Keep it updated**

- Handoff is ongoing, not one-time
- Update as design evolves
- Maintain as source of truth

---

## Integration with BMM

When handing off to BMad Method (BMM) for development:

```
WDS → E-UI-Roadmap/ → BMM Architecture & Stories
```

The UI Roadmap provides:

- Context for architecture decisions
- Specifications for story creation
- Priorities for sprint planning
- Test automation foundations

---

## Example Output

See: `examples/dog-week-patterns/E-UI-Roadmap/` for a complete UI Roadmap from a real project.

---

_Phase 6 of the Whiteport Design Studio method_
