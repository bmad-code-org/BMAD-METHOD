# WDS ↔ BMad Method Integration Guide

**Complete guide for seamless design-to-development workflow**

---

## Overview

WDS (Whiteport Design Studio) and BMad Method integrate seamlessly to create a complete product development workflow:

- **WDS:** Design-first methodology (Phases 1-7)
- **BMad:** Development methodology (Phases 1-3)
- **Integration:** 3 clean touch points

---

## The Complete Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ WDS: Design Phase                                            │
├─────────────────────────────────────────────────────────────┤
│ Phase 1: Project Brief         → [WDS overides BMad]                             │
│ Phase 2: Trigger Map                                        │
│ Phase 3: Platform Requirements → [Touch Point 1: WDS→BMad] │
│ Phase 4: UX Design                                          │
│ Phase 5: Design System                                      │
│ Phase 6: Design Deliveries    → [Touch Point 2: WDS→BMad] │
│ Phase 7: Testing              ← [Touch Point 3: BMad→WDS] │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ BMad: Development Phase                                      │
├─────────────────────────────────────────────────────────────┤
│ Phase 1: Architecture         ← [Reads Touch Points 1, 2]  │
│ Phase 2: Implementation                                     │
│ Phase 3: Testing              → [Touch Point 3: BMad→WDS]  │
└─────────────────────────────────────────────────────────────┘
```

---

## The 3 Touch Points

### Touch Point 1: Platform Requirements

**When:** WDS Phase 3 Complete
**Direction:** WDS → BMad (WDS overrides BMad)
**File:** `A-Project-Brief/platform-requirements.yaml`

**What:** Tech stack, integrations, constraints
**Why:** Designer (with stakeholders) defines technical foundation
**BMad Action:** Read and respect these choices, design architecture accordingly

**Read:** [platform-requirements-spec.md](platform-requirements-spec.md)

---

### Touch Point 2: Design Deliveries

**When:** WDS Phase 6 Complete
**Direction:** WDS → BMad (Complete design handoff)
**Files:** 
- `deliveries/DD-*.yaml` (Design Deliveries)
- `C-Scenarios/` (All scenario specifications)
- `D-Design-System/` (Component library)
- `test-scenarios/TS-*.yaml` (Test scenarios)

**What:** Complete design package with all scenarios, components, and test criteria
**Why:** Single handoff of ALL design work at once
**BMad Action:** Read everything, break down into dev epics, implement features

**Includes:**
- Multi-agent handoff dialog (20-min structured conversation)
- All design deliveries packaged as testable epics
- Complete design system specifications
- Test scenarios for validation

**Read:** 
- [design-delivery-spec.md](design-delivery-spec.md)
- [handoff-protocol.md](handoff-protocol.md)

---

### Touch Point 3: Designer Validation

**When:** After BMad Implementation Complete
**Direction:** BMad → WDS (BMad integrates with WDS testing)
**Files:**
- `test-reports/TR-*.md` (Test results)
- `issues/ISS-*.md` (Issues found)

**What:** BMad requests designer validation, designer tests and approves
**Why:** Ensure implementation matches design vision and quality standards
**WDS Action:** Run test scenarios, create issues if needed, sign off when approved
**BMad Action:** Fix issues, retest until designer approval

**Process:**
1. BMad notifies WDS: "Feature complete, ready for validation"
2. WDS runs test scenarios
3. WDS creates issues if problems found
4. BMad fixes issues
5. Repeat until WDS signs off

**Read:** [testing-protocol.md](testing-protocol.md) *(to be created)*

---

## File Structure

```
project/
├── A-Project-Brief/
│   ├── project-brief.md
│   └── platform-requirements.yaml    ← Touch Point 1
│
├── B-Trigger-Map/
│   └── trigger-map.md
│
├── C-Scenarios/
│   ├── 01-welcome-screen/
│   │   └── Frontend/
│   │       └── specifications.md
│   └── flows/
│       └── user-flow.excalidraw
│
├── D-Design-System/                  ← Touch Point 3
│   ├── 02-Foundation/
│   │   ├── Colors/tokens.json
│   │   └── Typography/tokens.json
│   └── 03-Atomic-Components/
│       ├── Buttons/Button-Primary.md
│       └── Inputs/Input-Text.md
│
├── deliveries/                        ← Touch Point 2
│   ├── DD-001-login-onboarding.yaml
│   ├── DD-002-morning-dog-care.yaml
│   └── DD-001-handoff-log.md
│
├── test-scenarios/                    ← Touch Point 2
│   ├── TS-001-login-onboarding.yaml
│   └── TS-002-morning-dog-care.yaml
│
├── test-reports/                      ← Touch Point 3
│   ├── TR-001-2024-12-09.md
│   └── TR-001-2024-12-15.md
│
├── issues/                            ← Touch Point 3
│   ├── ISS-001-button-color.md
│   └── ISS-002-transition-speed.md
│
└── E-Architecture/                    ← BMad creates this
    ├── architecture.md
    └── epics/
        ├── epic-1.1-auth-infrastructure.md
        └── epic-1.2-welcome-login.md
```

---

## For WDS Users

### Phase 3: Define Platform Requirements

**Create:** `A-Project-Brief/platform-requirements.yaml`

```yaml
platform:
  frontend:
    framework: "react_native"
  backend:
    framework: "supabase"

integrations:
  - name: "supabase_auth"
    required: true

constraints:
  - "Must work offline"
  - "Must be accessible"
```

**This overrides BMad's tech stack decisions!**

**Template:** `templates/platform-requirements.template.yaml`

---

### Phase 4-5: Design Complete Testable Flows

**Strategic Approach:**
Design until you have a **complete testable user flow** that:
- ✅ Delivers value to the business
- ✅ Delivers value to the end user
- ✅ Can be tested for real feedback
- ✅ Is ready to hand off for development

**You're NOT designing everything at once!** You're designing the minimum complete flow that can be tested and validated.

**Phase 4: UX Design**
- Design scenarios for ONE complete user flow
- Create specifications for each scenario
- Ensure the flow delivers measurable value
- Verify it's testable end-to-end

**Phase 5: Design System**
- Define components needed for THIS flow
- Create design tokens for these components
- Document usage guidelines
- Build only what's needed for this delivery

**Goal:** Get to development and testing as fast as possible with a complete, valuable flow

```
D-Design-System/
├── 02-Foundation/
│   ├── Colors/tokens.json
│   ├── Typography/tokens.json
│   └── Spacing/tokens.json
└── 03-Atomic-Components/
    ├── Buttons/
    ├── Inputs/
    └── Cards/
```

---

### Phase 6: Design Deliveries (Iterative Handoffs)

**You can hand off as soon as you have ONE complete testable flow!**

**Iterative Approach:**

**First Delivery (Fastest Path to Testing):**
1. **Design ONE complete user flow** (Phases 4-5)
   - Example: Login & Onboarding
   - Delivers value: Users can access the app
   - Testable: Complete flow from app open to dashboard

2. **Create Design Delivery** for this flow
   - `deliveries/DD-001-login-onboarding.yaml`

3. **Create Test Scenario**
   - `test-scenarios/TS-001-login-onboarding.yaml`

4. **Handoff Dialog** with BMad Architect (~20-30 min)
   - Walk through this delivery
   - Answer questions
   - Agree on implementation approach

5. **Hand off to BMad** → Development starts!

**While BMad builds DD-001, you design DD-002:**
- Continue with next complete flow
- Example: Morning Dog Care
- Hand off when ready
- Parallel work = faster delivery

**Benefits:**
- ✅ Get to testing faster (weeks, not months)
- ✅ Validate design with real users early
- ✅ Learn and iterate before designing everything
- ✅ Parallel work (design + dev happening simultaneously)
- ✅ Deliver value incrementally

**Templates:** 
- `templates/design-delivery.template.yaml`
- `templates/test-scenario.template.yaml`

---

### Phase 7: Testing (After BMad Implementation)

**Wait for BMad notification:**
```
"Feature complete: DD-001 Login & Onboarding
 Ready for designer validation"
```

**Then:**
1. **Run test scenarios**
2. **Create issues** if problems found
3. **Wait for fixes**
4. **Retest** until approved
5. **Sign off** when quality meets standards

---

## For BMad Users

### Detect WDS Artifacts

**Check for WDS:**

```bash
# Priority 1: Design Deliveries
if [ -d "deliveries" ]; then
  echo "✓ WDS Design Deliveries found"
  mode="wds-enhanced"
  
# Priority 2: Platform Requirements
elif [ -f "A-Project-Brief/platform-requirements.yaml" ]; then
  echo "✓ WDS Platform Requirements found"
  mode="wds-basic"
  
# Priority 3: Traditional
else
  echo "⚠ No WDS artifacts"
  mode="traditional"
fi
```

---

### Read Platform Requirements

**Load tech stack decisions:**

```python
import yaml

with open('A-Project-Brief/platform-requirements.yaml') as f:
    reqs = yaml.safe_load(f)

frontend = reqs['platform']['frontend']['framework']
backend = reqs['platform']['backend']['framework']

print(f"Tech Stack: {frontend} + {backend}")
```

**Respect these choices - designer already decided**

---

### Read Design Deliveries

**Load design work:**

```python
import yaml

with open('deliveries/DD-001-login-onboarding.yaml') as f:
    delivery = yaml.safe_load(f)

name = delivery['delivery']['name']
scenarios = delivery['design_artifacts']['scenarios']

print(f"Delivery: {name}")
print(f"Scenarios: {len(scenarios)}")
```

**Break down into development epics**

---

### Participate in Handoff Dialog

**When Design Delivery is ready:**

1. **Receive handoff** from WDS UX Expert
2. **Ask clarifying questions**
3. **Propose epic breakdown**
4. **Commit to implementation**
5. **Document handoff**

**Protocol:** [handoff-protocol.md](handoff-protocol.md)

---

### Notify Designer When Ready

**After implementation:**

```
"Feature complete: DD-001 Login & Onboarding

Implemented:
✓ All 4 scenarios
✓ All error states
✓ All edge cases
✓ Design system components

Build: v0.1.0-beta.1
Ready for designer validation.
Test scenario: test-scenarios/TS-001.yaml"
```

---

### Receive Issues & Fix

**Designer finds issues:**

```markdown
# Issue: Button Color Incorrect

**Severity:** High
**Expected:** #2563EB
**Actual:** #3B82F6
**Design Ref:** D-Design-System/.../Button-Primary.md
```

**Fix and notify:**

```
"Issue ISS-001 fixed.
Build: v0.1.0-beta.2
Ready for retest."
```

---

## Benefits

### For Designers

- ✅ Control over tech stack decisions (Touch Point 1)
- ✅ Complete design work before handoff (Phases 4-5)
- ✅ Single clean handoff (Touch Point 2)
- ✅ Validate implementation matches design (Touch Point 3)
- ✅ Design integrity maintained throughout

### For Developers

- ✅ Clear tech stack from the start (Touch Point 1)
- ✅ Complete design package at once (Touch Point 2)
- ✅ All requirements and specifications provided
- ✅ Design system components fully defined
- ✅ Testing guidance included
- ✅ Designer validation ensures quality (Touch Point 3)

### For Teams

- ✅ 3 clean integration points (not 7!)
- ✅ Seamless design-to-development workflow
- ✅ Reduced miscommunication
- ✅ Faster iteration cycles
- ✅ Higher quality products
- ✅ Complete traceability

---

## Graceful Fallback

### BMad Without WDS

**BMad works standalone:**

```bash
if [ ! -d "deliveries" ]; then
  echo "No WDS artifacts - using traditional workflow"
  # Gather requirements
  # Design architecture
  # Implement features
fi
```

**No WDS required - BMad is independent**

---

## Quick Start

### For WDS Projects

**Phase 1-2:** Discovery (Project Brief, Trigger Map)
**Phase 3:** Platform Requirements → **Touch Point 1**

**Then iterate:**
**Phase 4-5:** Design ONE complete testable flow
**Phase 6:** Create delivery and handoff → **Touch Point 2**
**Phase 7:** Wait for implementation, then validate → **Touch Point 3**

**Repeat Phases 4-7 for each flow:**
- While BMad builds flow 1, design flow 2
- Parallel work = faster delivery
- Test and learn early

### For BMad Projects

**Check for Touch Point 1:** Platform Requirements
- If found: Read and respect tech stack
- If not found: Make your own decisions

**Wait for Touch Point 2:** Design Deliveries
- Receive complete design package
- Break down into dev epics
- Implement features

**Trigger Touch Point 3:** Request validation
- Notify designer when complete
- Fix issues as needed
- Iterate until sign-off

---

## Resources

### Specifications

- [Design Delivery Spec](design-delivery-spec.md)
- [Platform Requirements Spec](platform-requirements-spec.md)
- [Handoff Protocol](handoff-protocol.md)

### Templates

- `templates/design-delivery.template.yaml`
- `templates/platform-requirements.template.yaml`
- `templates/test-scenario.template.yaml`

### Examples

- See `WDS-V6-CONVERSION-ROADMAP.md` for integration details
- See `workflows/` for workflow documentation

---

## Summary

### The 3 Touch Points

1. **Platform Requirements** (WDS Phase 3 → BMad)
   - WDS overrides BMad's tech stack decisions
   - Designer defines technical foundation

2. **Design Deliveries** (WDS Phase 6 → BMad)
   - Complete design package handed off at once
   - Includes all scenarios, components, test scenarios
   - Single handoff with multi-agent dialog

3. **Designer Validation** (BMad Phase 3 → WDS Phase 7)
   - BMad requests validation when complete
   - Designer tests and creates issues if needed
   - Iterates until sign-off

### Why 3 Touch Points?

**Cleaner:** Not 7 continuous integration points
**Simpler:** Clear separation of concerns
**Realistic:** Matches how teams actually work
**Iterative:** Design → Handoff → Build → Test → Repeat
**Fast:** Get to testing in weeks, not months
**Quality:** Designer validates before ship

---

**This integration creates a seamless design-to-development workflow with 3 clean touch points that respect both design vision and technical excellence!** 🔗✨
