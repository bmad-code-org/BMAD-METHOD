# Phase 6: Dev Integration (UI Roadmap)

**Agent:** Freyja the PM  
**Output:** `E-UI-Roadmap/` (or your configured prefix)  
**Duration:** 1-2 hours

---

## What This Phase Does

Dev Integration prepares everything development teams need. This phase creates the bridge between design and implementation - the handoff package that enables development to begin without additional discovery work.

By the end, developers have a clear roadmap for building the UI you've designed.

---

## What You'll Create

Your UI Roadmap includes:

- **Priority Sequence** - What to build first and why
- **Scenario Mapping** - How scenarios translate to development order
- **Component Inventory** - All components needed, with status
- **Technical Notes** - Design constraints and decisions
- **Object ID Inventory** - Complete list for testing
- **Handoff Checklist** - Verification that everything is ready
- **Open Questions** - Items for the dev team to decide

---

## The Handoff Package

### Priority Sequence

Based on your Trigger Map priorities:
- Which scenarios serve the most important user triggers?
- What's the critical path for MVP?
- What can be deferred to later releases?

**Example:**
```
Priority 1: User Onboarding (Scenarios 1.1-1.3)
  - Serves highest-priority business goal
  - Enables all other user scenarios
  
Priority 2: Core Feature (Scenarios 2.1-2.4)
  - Primary value delivery
  - Most important user trigger activation
  
Priority 3: Settings & Account (Scenarios 3.1-3.2)
  - Supporting functionality
  - Can launch with minimal version
```

### Scenario-to-Development Mapping

How design scenarios map to development work:

| WDS Scenario | Development Epic | Dependencies |
|--------------|------------------|--------------|
| 01-User-Onboarding | Epic 1: Auth System | None |
| 02-Core-Feature | Epic 2: Main Feature | Epic 1 |
| 03-Settings | Epic 3: User Settings | Epic 1 |

### Component Inventory

All components from your Design System with development status:

| Component | Design Status | Dev Status | Notes |
|-----------|--------------|------------|-------|
| Button Primary | Complete | Ready | Use existing library |
| Phone Input | Complete | Needs Build | Custom with country selector |
| Calendar Widget | Complete | Needs Build | Complex interactions |

### Object ID Inventory

Complete list for test automation:

| Scenario | Object ID | Element Type | Notes |
|----------|-----------|--------------|-------|
| 1.1 | `welcome-hero-cta` | Button | Primary action |
| 1.1 | `welcome-signin-link` | Link | Secondary action |
| 1.2 | `signin-email-input` | Input | Required field |
| 1.2 | `signin-error-email` | Error | Validation message |

---

## How It Works

### Review Completeness

Before handoff, verify:
- All scenarios specified and reviewed
- Design system covers all components
- Object IDs assigned throughout
- Multilingual content complete
- HTML previews validated

### Identify Priorities

With Freyja, map your Trigger Map priorities to development order:
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
- [ ] HTML previews created for key scenarios
- [ ] Stakeholder review complete
- [ ] Open questions documented

### Ready for Development ✅
```

---

## When to Use This Phase

**Use this phase when:**
- Design work is substantially complete
- Ready to hand off to development
- Need to coordinate design-to-dev transition

**Start here if:**
- Joining a project with existing designs
- Need to organize existing documentation
- Preparing for development sprint planning

**Run continuously if:**
- Working in parallel with development
- Gradual handoff as scenarios complete

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

*Phase 6 of the Whiteport Design Studio method*

