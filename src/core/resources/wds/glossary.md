# WDS Glossary

**Key terms and concepts used throughout Whiteport Design Studio**

---

## Software Development Terms

### Greenfield Development

**Definition:** Building a new project from scratch with no constraints from existing systems.

**Origin:** Agricultural term - plowing a green field that has never been cultivated before.

**In software:**
- No legacy code to maintain
- Full creative freedom
- Define architecture from scratch
- Choose tech stack freely
- Design without constraints
- Start with blank canvas

**In WDS:**
- **Phases 1-7:** New Product Development
- Complete user flows designed from scratch
- Full Project Brief
- Platform Requirements defined
- All design decisions are yours

**Example:**
"We're building a new dog care app from scratch. No existing product, no constraints. Pure greenfield."

---

### Brownfield Development

**Definition:** Developing within an existing system with established constraints.

**Origin:** Industrial term - redeveloping land previously used for industrial purposes (often contaminated, requiring cleanup).

**In software:**
- Existing codebase to work with
- Legacy systems to integrate
- Established patterns to follow
- Tech stack already decided
- Work within constraints
- Cleanup and improvement

**In WDS:**
- **Phase 8:** Existing Product Development
- Targeted improvements to existing product
- Limited Project Brief (strategic challenge)
- Platform Requirements already decided
- Work within existing design system

**Example:**
"We're improving an existing product with 60% onboarding drop-off. Tech stack is React Native + Supabase. Pure brownfield."

---

## Lean Manufacturing Terms

### Kaizen (改善) - Continuous Improvement

**Japanese:** 改善
- 改 (kai) = Change
- 善 (zen) = Good

**Definition:** Small, incremental, continuous improvements over time.

**Origin:** Japanese manufacturing philosophy, popularized by Toyota Production System.

**Characteristics:**
- **Small changes:** 1-2 weeks each
- **Low cost, low risk:** Minimal investment
- **Everyone participates:** Bottom-up approach
- **Continuous:** Never stops
- **Gradual improvement:** Compounds over time
- **Process-focused:** Improve how we work
- **Data-driven:** Measure everything

**In product design:**
- Ship → Monitor → Learn → Improve → Ship → Repeat
- Small updates beat big redesigns
- User feedback drives improvements
- Data informs decisions
- Quality improves gradually
- Team learns continuously

**In WDS:**
- **Phase 8:** Ongoing Development
- System Updates (SU-XXX) instead of Design Deliveries
- 1-2 week improvement cycles
- Measure impact after each cycle
- Iterate based on learnings

**Examples:**
- Add onboarding tooltip to improve feature usage (15% → 60%)
- Optimize button color for better conversion (+5%)
- Improve error message clarity (-80% support tickets)
- Shorten form from 10 fields to 5 (+20% completion)

**Philosophy:**
"Great products aren't built in one big redesign. They're built through continuous, disciplined improvement. One cycle at a time. Forever."

---

### Kaikaku (改革) - Revolutionary Change

**Japanese:** 改革
- 改 (kai) = Change
- 革 (kaku) = Reform/Revolution

**Definition:** Radical, revolutionary transformation in a short period.

**Origin:** Japanese manufacturing philosophy, used for major system overhauls.

**Characteristics:**
- **Large changes:** Months of work
- **High cost, high risk:** Major investment
- **Leadership-driven:** Top-down approach
- **One-time event:** Not continuous
- **Dramatic improvement:** Big leap forward
- **Result-focused:** Achieve specific outcome
- **Disruptive:** Major changes to system

**In product design:**
- Complete redesign
- Platform migration (web → mobile)
- Architecture overhaul
- Brand transformation
- Business model pivot
- Technology stack change

**In WDS:**
- **Phases 1-7:** New Product Development (greenfield)
- Complete user flows designed
- Full Design Deliveries (DD-XXX)
- Major product launch
- Revolutionary change

**Examples:**
- Complete product redesign (v1.0 → v2.0)
- Migrate from web to mobile-first
- Rebrand entire product
- Change from B2C to B2B
- Rebuild on new tech stack

**Philosophy:**
"Sometimes you need revolutionary change. But after Kaikaku, always return to Kaizen for continuous improvement."

---

### Kaizen vs Kaikaku: When to Use Each

**Use Kaizen (改善) when:**
- ✅ Product is live and working
- ✅ Need continuous improvement
- ✅ Want low-risk changes
- ✅ Team capacity is limited
- ✅ Learning is important
- ✅ **WDS Phase 8: Ongoing Development**

**Use Kaikaku (改革) when:**
- ✅ Starting from scratch (greenfield)
- ✅ Product needs complete overhaul
- ✅ Market demands radical change
- ✅ Current approach is fundamentally broken
- ✅ Have resources for big change
- ✅ **WDS Phases 1-7: New Product Development**

**Best practice:** Kaikaku to establish, Kaizen to improve.

```
Kaikaku (改革): Build product v1.0 (Phases 1-7)
    ↓
Launch
    ↓
Kaizen (改善): Continuous improvement (Phase 8)
    ↓
Kaizen cycle 1, 2, 3, 4, 5... (ongoing)
    ↓
(If needed) Kaikaku: Major redesign v2.0
    ↓
Kaizen: Continuous improvement again
```

---

### Muda (無駄) - Waste

**Japanese:** 無駄 = Waste, uselessness

**Definition:** Any activity that consumes resources but creates no value.

**Origin:** Toyota Production System, one of the three types of waste (Muda, Mura, Muri).

**Types of waste in product design:**

1. **Overproduction:** Designing features nobody uses
2. **Waiting:** Blocked on approvals or development
3. **Transportation:** Handoff friction between designer and developer
4. **Over-processing:** Excessive polish on low-impact features
5. **Inventory:** Unshipped designs sitting in Figma
6. **Motion:** Inefficient workflows and tools
7. **Defects:** Bugs, rework, and quality issues

**Kaizen eliminates Muda through:**
- Small, focused improvements
- Fast cycles (ship → learn → improve)
- Continuous measurement
- Learning from every cycle
- Eliminating handoff friction

**In WDS:**
- Design specifications eliminate handoff waste
- Iterative deliveries eliminate inventory waste
- Fast cycles eliminate waiting waste
- Measurement eliminates overproduction waste

---

## WDS-Specific Terms

### Design Delivery (DD-XXX)

**Definition:** A structured YAML package for handing off design work to BMad.

**Used for BOTH:**
- ✅ Complete new user flows (Greenfield/Kaikaku)
- ✅ Incremental improvements (Brownfield/Kaizen)

**The format is the same - only the scope differs!**

**Contains:**
- User value and business value
- Design artifacts (scenarios, components)
- Technical requirements
- Acceptance criteria
- Testing guidance
- Effort estimate
- What's changing vs staying (for improvements)
- Expected impact and metrics (for improvements)

**Scope variations:**

**Large scope (New flows):**
```yaml
delivery:
  id: "DD-001"
  name: "Login & Onboarding"
  type: "complete_flow"
  scope: "new"
```

**Small scope (Improvements):**
```yaml
delivery:
  id: "DD-015"
  name: "Feature X Onboarding Improvement"
  type: "incremental_improvement"
  scope: "update"
```

**Examples:**
- `DD-001-login-onboarding.yaml` (complete new flow)
- `DD-015-feature-x-onboarding.yaml` (incremental improvement)

**Why one format?**
- Simpler for BMad to consume
- Consistent handoff process
- Same validation workflow
- Easier to track and manage

---

### Platform Requirements

**Definition:** YAML file defining the technical stack and constraints.

**Contains:**
- Tech stack choices
- Integrations
- Constraints
- Rationale

**Used in:**
- Phase 3 (New Product)
- Greenfield projects
- Touch Point 1: WDS → BMad

**File:**
`A-Project-Brief/platform-requirements.yaml`

---

### Test Scenario (TS-XXX)

**Definition:** Structured YAML defining validation steps for designers to verify a Design Delivery.

**Relationship to Design Delivery:**
- **One-to-one:** Each DD-XXX has a corresponding TS-XXX
- **Created together:** Test Scenario is created when Design Delivery is created (Phase 6, Step 6.3)
- **Validates goals:** Tests verify that business and user goals defined in DD-XXX are achieved
- **Same numbering:** TS-001 validates DD-001, TS-002 validates DD-002, etc.

**Contains:**
- Happy path tests (verify user goals achieved)
- Error state tests (verify error handling)
- Edge case tests (verify robustness)
- Design system validation (verify visual consistency)
- Accessibility tests (verify WCAG compliance)
- Sign-off criteria (based on DD-XXX acceptance criteria)

**Used in:**
- Phase 6 (Design Deliveries) - Created alongside DD-XXX
- Phase 7 (Testing) - Executed to validate implementation
- Designer validation
- Touch Point 3: BMad → WDS

**Example:**
```
DD-001-login-onboarding.yaml → TS-001-login-onboarding.yaml
DD-015-feature-x-improvement.yaml → TS-015-feature-x-improvement.yaml
```

**Why tied to DD?**
The Test Scenario validates that the business and user goals defined in the Design Delivery are actually achieved in the implementation. Without the DD's clear goals, you wouldn't know what to test!

---

## WDS Workflow Terms

### Touch Points

**Definition:** Defined integration points where WDS and BMad exchange information.

**Three touch points:**

1. **Touch Point 1: WDS → BMad (Platform Requirements)**
   - WDS defines tech stack
   - BMad respects decisions
   - Phase 3

2. **Touch Point 2: WDS → BMad (Design Deliveries)**
   - WDS hands off complete flows
   - BMad implements
   - Phase 6

3. **Touch Point 3: BMad → WDS (Designer Validation)**
   - BMad requests validation
   - WDS tests and approves
   - Phase 7

---

### Linchpin Designer

**Definition:** A designer who is indispensable because they provide user-centric creativity that AI cannot replicate.

**Origin:** Seth Godin's book "Linchpin: Are You Indispensable?" (2010)

**Characteristics:**
- Walks into chaos and creates order
- Navigates 5 dimensions of thinking simultaneously
- Provides emotional labor (genuinely cares about outcome)
- Bridges business, psychology, and technology
- Delivers results when there's no roadmap

**Opposite:** Factory worker who follows instructions and can be replaced.

**In WDS:**
- Designer as gatekeeper between business and user needs
- Catches AI's confident but ridiculous mistakes
- Ensures design intent is preserved
- Creates products with soul

---

### 5-Dimensional Thinking

**Definition:** The ability to navigate five different dimensions of product thinking simultaneously.

**The 5 dimensions:**

1. **Business Existence (WHY)** - Understanding purpose and value creation
2. **Business Goals (SUCCESS)** - Connecting to metrics and impact
3. **Product Strategy (HOW)** - Making hard choices about features
4. **Target Groups (WHO)** - Empathy and understanding needs
5. **Technical Viability (FEASIBLE)** - Bridging design and implementation

**Why it matters:**
- Most people can handle 1-2 dimensions
- Irreplaceable designers navigate all 5 simultaneously
- Each dimension informs the others
- Miss one, and your design falls apart

**In WDS:**
- Project Brief covers all 5 dimensions
- Trigger Map connects dimensions
- Design Deliveries preserve all 5 dimensions
- Specifications capture the connections

---

## Comparison Table

| Concept | Type | WDS Phase | Approach | Timeline | Deliverable |
|---------|------|-----------|----------|----------|-------------|
| **Greenfield** | Software Dev | Phases 1-7 | New product | Months | DD-XXX |
| **Brownfield** | Software Dev | Phase 8 | Existing product | Weeks | DD-XXX |
| **Kaikaku (改革)** | Lean | Phases 1-7 | Revolutionary | Months | DD-XXX (large scope) |
| **Kaizen (改善)** | Lean | Phase 8 | Continuous | 1-2 weeks | DD-XXX (small scope) |

**Note:** All design work is handed off as Design Deliveries (DD-XXX). The scope and content differ, but the format is consistent.

---

## Usage Examples

### Greenfield + Kaikaku
"We're building a new dog care app from scratch (greenfield). This is a complete product launch (Kaikaku). We'll use WDS Phases 1-7 to design complete user flows, then hand off Design Deliveries to BMad."

### Brownfield + Kaizen
"We're improving an existing product with 60% onboarding drop-off (brownfield). We'll make small, incremental improvements (Kaizen). We'll use WDS Phase 8 to create Design Deliveries (small scope) and measure impact after each cycle."

### Greenfield → Brownfield
"We started with greenfield development (Phases 1-7), launched the product, and now we're in brownfield mode (Phase 8) doing continuous Kaizen improvements."

### Kaikaku → Kaizen
"We did a major redesign (Kaikaku) using Phases 1-7. Now we're in continuous improvement mode (Kaizen) using Phase 8, shipping small updates every 1-2 weeks."

---

**This glossary helps you understand the philosophical foundations of WDS workflows!** 🎯📚
