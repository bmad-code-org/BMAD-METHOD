# Step 8.4: Create Design Delivery

## Your Task

Package your incremental improvement as a Design Delivery (DD-XXX) for BMad.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 8.3 (update designed)
- ✅ Update specifications created
- ✅ Change scope documented
- ✅ Before/after comparison ready

---

## Design Delivery Format for All Improvements

**IMPORTANT:** All design work uses Design Deliveries (DD-XXX), whether it's:

- ✅ Complete new user flows (large scope)
- ✅ Incremental improvements (small scope)

**The format is the same - only the scope and content differ!**

### Large Scope (New Flows)

- Multiple scenarios
- Complete user flow
- Full feature implementation
- Weeks of work

### Small Scope (Improvements)

- Targeted changes
- Updates existing feature
- Focused improvement
- Days of work

**Both use DD-XXX format!**

---

## Create Design Delivery File

**File:** `deliveries/DD-XXX-description.yaml`

**Numbering:**

- Continue from last DD number
- If last new flow was DD-010, next improvement is DD-011
- Use leading zeros (DD-001, DD-002, etc.)

**Example:**

- DD-001 to DD-010: New flows (Phases 4-7)
- DD-011: First improvement (Phase 8)
- DD-012: Second improvement (Phase 8)

---

## Design Delivery Template (Small Scope)

```yaml
delivery:
  id: 'DD-XXX'
  name: '[Short descriptive name]'
  type: 'incremental_improvement' # vs "complete_flow" for new features
  scope: 'update' # vs "new" for new features
  version: 'v2.0'
  previous_version: 'v1.0'
  created_at: '2024-12-09T14:00:00Z'
  designer: '[Your name]'
  status: 'ready_for_handoff'

# What's the improvement?
improvement:
  summary: |
    [2-3 sentence summary of what's changing and why]

    Example:
    "Adding inline onboarding to Feature X to improve user understanding
     and increase usage from 15% to 60%. Analytics show 40% drop-off due
     to confusion. This update adds tooltips, step-by-step guidance, and
     success celebration."

  problem: |
    [What problem does this solve?]

    Example:
    "Feature X has low engagement (15% usage) and high drop-off (40%).
     User feedback indicates confusion about how to use it. 12 support
     tickets mention 'I don't understand Feature X'."

  solution: |
    [What's the solution?]

    Example:
    "Add inline onboarding that appears on first use:
     - Tooltip explaining Feature X purpose
     - Step-by-step guide for first action
     - Success celebration when completed
     - Help button for future reference"

  expected_impact: |
    [What will improve?]

    Example:
    "- Feature X usage: 15% → 60%
     - Drop-off: 40% → 10%
     - Support tickets: -80%
     - User satisfaction: +1.5 points"

# What's changing?
changes:
  scope:
    screens_affected:
      - 'Feature X main screen'
      - 'Feature X onboarding overlay'

    features_affected:
      - 'Feature X interaction flow'

    components_new:
      - id: 'cmp-tooltip-001'
        name: 'Inline Tooltip'
        file: 'D-Design-System/03-Atomic-Components/Tooltips/Tooltip-Inline.md'

      - id: 'cmp-guide-001'
        name: 'Step Guide'
        file: 'D-Design-System/03-Atomic-Components/Guides/Guide-Step.md'

    components_modified:
      - id: 'cmp-btn-001'
        name: 'Primary Button'
        changes: 'Added help icon variant'
        file: 'D-Design-System/03-Atomic-Components/Buttons/Button-Primary.md'

    components_unchanged:
      - 'All other components remain as-is'

  what_stays_same:
    - 'Brand colors and typography'
    - 'Core layout structure'
    - 'Navigation pattern'
    - 'Data model'
    - 'Tech stack'

# Design artifacts
design_artifacts:
  specifications:
    - path: 'C-Scenarios/XX-feature-x-update/Frontend/specifications.md'
      description: 'Updated Feature X specifications'

    - path: 'C-Scenarios/XX-feature-x-update/change-scope.md'
      description: "What's changing vs staying"

    - path: 'C-Scenarios/XX-feature-x-update/before-after.md'
      description: 'Before/after comparison'

  components:
    - path: 'D-Design-System/03-Atomic-Components/Tooltips/Tooltip-Inline.md'
      description: 'New inline tooltip component'

    - path: 'D-Design-System/03-Atomic-Components/Guides/Guide-Step.md'
      description: 'New step guide component'

# Technical requirements
technical_requirements:
  frontend:
    - 'Implement inline tooltip component'
    - 'Add first-use detection logic'
    - 'Implement step-by-step guide'
    - 'Add success celebration animation'
    - 'Add help button with persistent access'
    - 'Store dismissal state in user preferences'

  backend:
    - 'Add user preference field: feature_x_onboarding_completed'
    - 'API endpoint to save dismissal state'

  data:
    - 'User preferences table: add feature_x_onboarding_completed (boolean)'

  integrations:
    - 'Analytics: Track onboarding completion'
    - 'Analytics: Track help button usage'

# Acceptance criteria
acceptance_criteria:
  - id: 'AC-001'
    description: 'Inline tooltip appears on first use of Feature X'
    verification: 'Open Feature X as new user, tooltip appears'

  - id: 'AC-002'
    description: 'Step guide walks user through first action'
    verification: 'Follow guide, complete first action successfully'

  - id: 'AC-003'
    description: 'Success celebration appears on completion'
    verification: 'Complete first action, celebration appears'

  - id: 'AC-004'
    description: "Onboarding doesn't appear on subsequent uses"
    verification: 'Use Feature X again, no onboarding shown'

  - id: 'AC-005'
    description: 'Help button provides access to guide anytime'
    verification: 'Click help button, guide appears'

  - id: 'AC-006'
    description: 'Dismissal state persists across sessions'
    verification: 'Dismiss, logout, login, onboarding not shown'

# Testing guidance
testing_guidance:
  test_scenario_file: 'test-scenarios/TS-XXX.yaml'

  key_tests:
    - 'First-time user experience (happy path)'
    - 'Dismissal and persistence'
    - 'Help button access'
    - 'Edge case: Multiple devices'
    - 'Edge case: Cleared cache'

  success_criteria:
    - 'All acceptance criteria pass'
    - 'No regressions in existing functionality'
    - 'Performance impact < 50ms'
    - 'Accessibility: Screen reader compatible'

# Metrics and validation
metrics:
  baseline:
    - metric: 'Feature X usage rate'
      current: '15%'
      target: '60%'

    - metric: 'Drop-off rate'
      current: '40%'
      target: '10%'

    - metric: 'Support tickets (Feature X)'
      current: '12/month'
      target: '2/month'

    - metric: 'User satisfaction'
      current: '3.2/5'
      target: '4.5/5'

  measurement_period: '2 weeks after release'

  success_threshold:
    - 'Feature X usage > 50% (minimum)'
    - 'Drop-off < 15% (minimum)'
    - 'Support tickets < 5/month'

  rollback_criteria:
    - 'Feature X usage < 20% after 2 weeks'
    - 'Drop-off > 35% after 2 weeks'
    - 'Critical bugs reported'

# Effort estimate
effort:
  design: '1 day'
  frontend: '1 day'
  backend: '0.5 days'
  testing: '0.5 days'
  total: '3 days'
  complexity: 'Low'

# Timeline
timeline:
  design_complete: '2024-12-09'
  handoff_date: '2024-12-09'
  development_start: '2024-12-10'
  development_complete: '2024-12-12'
  testing_complete: '2024-12-13'
  release_date: '2024-12-13'
  measurement_end: '2024-12-27'

# Handoff
handoff:
  architect: '[BMad Architect name]'
  developer: '[BMad Developer name]'
  handoff_dialog_required: false # Small update, dialog optional
  notes: |
    Small, focused improvement. Specifications are clear.
    Dialog available if questions arise.

# Related
related:
  improvement_file: 'improvements/IMP-XXX-feature-x-onboarding.md'
  analytics_report: 'analytics/feature-x-usage-2024-11.md'
  user_feedback: 'feedback/feature-x-confusion-2024-11.md'
  original_delivery: 'deliveries/DD-XXX-feature-x.yaml' # If applicable
```

---

## Create Test Scenario

**File:** `test-scenarios/TS-XXX-description.yaml`

**Simplified for incremental improvements:**

```yaml
test_scenario:
  id: 'TS-XXX'
  name: '[Update Name] Validation'
  type: 'incremental_improvement'
  delivery_id: 'DD-XXX'
  created_at: '2024-12-09T14:00:00Z'

# Focus on what changed
test_focus:
  - 'New onboarding flow'
  - 'Dismissal persistence'
  - 'Help button access'
  - 'No regressions'

# Happy path (new functionality)
happy_path:
  - id: 'HP-001'
    name: 'First-time user sees onboarding'
    steps:
      - action: 'Open Feature X as new user'
        expected: 'Inline tooltip appears'
      - action: "Read tooltip, tap 'Next'"
        expected: 'Step guide appears'
      - action: 'Follow guide, complete action'
        expected: 'Success celebration appears'
      - action: 'Dismiss celebration'
        expected: 'Feature X is ready to use'

# Regression testing (existing functionality)
regression_tests:
  - id: 'REG-001'
    name: 'Existing Feature X functionality unchanged'
    steps:
      - action: 'Use Feature X core functionality'
        expected: 'Works exactly as before'

# Edge cases
edge_cases:
  - id: 'EC-001'
    name: 'Dismissal persists across sessions'
    steps:
      - action: 'Dismiss onboarding'
      - action: 'Logout and login'
      - action: 'Open Feature X'
        expected: 'Onboarding not shown'

# Accessibility
accessibility:
  - id: 'A11Y-001'
    name: 'Screen reader announces onboarding'
    checks:
      - 'Tooltip announced correctly'
      - 'Guide steps announced'
      - 'Help button labeled'
```

---

## Next Step

After creating the delivery:

```
[C] Continue to step-8.5-hand-off.md
```

---

## Success Metrics

✅ Design Delivery file created
✅ Change scope clearly defined
✅ All artifacts referenced
✅ Acceptance criteria defined
✅ Metrics and targets set
✅ Test scenario created
✅ Rollback criteria defined

---

## Failure Modes

❌ Vague change description
❌ Missing artifacts
❌ No success metrics
❌ No rollback criteria
❌ Scope too large
❌ No before/after comparison

---

**Remember:** Design Deliveries (small scope) are focused, measurable improvements!
