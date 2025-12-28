# BMM Planning Workflows (Phase 2)

## Phase 2 Planning Workflow Overview


## Quick Reference

| Workflow             | Agent       | Track                   | Purpose                               |
| -------------------- | ----------- | ----------------------- | ------------------------------------- |
| **prd**              | PM          | BMad Method, Enterprise | Strategic PRD with FRs/NFRs           |
| **create-ux-design** | UX Designer | BMad Method, Enterprise | Optional UX specification (after PRD) |

### prd (Product Requirements Document)

**Purpose:** Strategic PRD with Functional Requirements (FRs) and Non-Functional Requirements (NFRs) for software products (BMad Method track).

**Agent:** PM (with Architect and Analyst support)

**When to Use:**

- Medium to large feature sets
- Multi-screen user experiences
- Complex business logic
- Multiple system integrations
- Phased delivery required

**Scale-Adaptive Structure:**

- **Light:** Focused FRs/NFRs, simplified analysis (10-15 pages)
- **Standard:** Comprehensive FRs/NFRs, thorough analysis (20-30 pages)
- **Comprehensive:** Extensive FRs/NFRs, multi-phase, stakeholder analysis (30-50+ pages)

**Key Outputs:**

- PRD.md (complete requirements with FRs and NFRs)

**Note:** V6 improvement - PRD focuses on WHAT to build (requirements). Epic+Stories are created AFTER architecture via `create-epics-and-stories` workflow for better quality.

**Integration:** Feeds into Architecture (Phase 3)

**Example:** E-commerce checkout → PRD with 15 FRs (user account, cart management, payment flow) and 8 NFRs (performance, security, scalability).

---

### create-ux-design (UX Design)

**Purpose:** UX specification for projects where user experience is the primary differentiator (BMad Method track).

**Agent:** UX Designer

**When to Use:**

- UX is primary competitive advantage
- Complex user workflows needing design thinking
- Innovative interaction patterns
- Design system creation
- Accessibility-critical experiences

**Collaborative Approach:**

1. Visual exploration (generate multiple options)
2. Informed decisions (evaluate with user needs)
3. Collaborative design (refine iteratively)
4. Living documentation (evolves with project)

**Key Outputs:**

- ux-spec.md (complete UX specification)
- User journeys
- Wireframes and mockups
- Interaction specifications
- Design system (components, patterns, tokens)
- Epic breakdown (UX stories)

**Integration:** Feeds PRD or updates epics, then Architecture (Phase 3)

**Example:** Dashboard redesign → Card-based layout with split-pane toggle, 5 card components, 12 color tokens, responsive grid, 3 epics (Layout, Visualization, Accessibility).

## Best Practices

### 1. Do Product Brief from Phase 1 to kickstart the PRD for better results

### 2. Focus on "What" Not "How"

Planning defines **what** to build and **why**. Leave **how** (technical design) to Phase 3 (Solutioning).

### 3. Document-Project First for Brownfield

Always run `document-project` before planning brownfield projects. AI agents need existing codebase context and will make a large quality difference. If you are adding a small addition to an existing project, you might want to consider instead after using document-project to use the quick flow solo dev process instead.
