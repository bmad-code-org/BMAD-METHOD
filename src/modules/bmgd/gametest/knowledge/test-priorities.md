# Test Priorities Matrix

## Overview

Not all tests are equal. This guide provides a framework for prioritizing test creation, execution, and maintenance based on risk, impact, and resources.

## Priority Levels

### P0 - Critical (Ship Blockers)

**Definition**: Failures that prevent the game from being playable or shippable.

| Criteria               | Examples                       |
| ---------------------- | ------------------------------ |
| Game cannot start      | Crash on launch, infinite load |
| Core loop broken       | Cannot perform primary action  |
| Data loss              | Saves corrupted, progress lost |
| Platform certification | TRC/XR failures                |
| Legal/compliance       | Rating violations              |

**Testing Approach**:

- Automated smoke tests on every build
- Manual verification before any release
- Zero tolerance for P0 bugs in release builds

### P1 - High (Major Features)

**Definition**: Significant functionality that affects most players' experience.

| Criteria              | Examples                         |
| --------------------- | -------------------------------- |
| Major features broken | Multiplayer, progression systems |
| Frequent player paths | Main story, common actions       |
| Significant UX issues | Confusing UI, missing feedback   |
| Performance problems  | Unplayable frame rates           |

**Testing Approach**:

- Comprehensive automated tests
- Regular regression testing
- Full coverage in release candidates

### P2 - Medium (Standard Features)

**Definition**: Important functionality that affects significant portions of gameplay.

| Criteria           | Examples                      |
| ------------------ | ----------------------------- |
| Secondary features | Side quests, optional content |
| Edge cases         | Unusual player actions        |
| Platform-specific  | Single-platform issues        |
| Minor progression  | Non-critical collectibles     |

**Testing Approach**:

- Selective automation
- Milestone regression testing
- Coverage prioritized by usage data

### P3 - Low (Polish Items)

**Definition**: Issues that are noticeable but don't significantly impact gameplay.

| Criteria       | Examples                       |
| -------------- | ------------------------------ |
| Visual polish  | Minor clipping, texture issues |
| Audio polish   | Volume inconsistencies         |
| Rare scenarios | Edge cases with workarounds    |
| Nice-to-have   | QoL improvements               |

**Testing Approach**:

- Manual exploratory testing
- Automated only if easy/cheap
- Fixed as time permits

## Risk-Based Prioritization

### Risk Factors

| Factor              | High Risk           | Low Risk        |
| ------------------- | ------------------- | --------------- |
| Usage frequency     | Core loop           | Rarely accessed |
| Player visibility   | Always visible      | Hidden/optional |
| Data impact         | Saves, progression  | Cosmetic only   |
| Recovery difficulty | No workaround       | Easy to retry   |
| Change frequency    | Frequently modified | Stable code     |

### Risk Assessment Matrix

```
                    IMPACT
                Low      High
            ┌─────────┬─────────┐
      High  │   P2    │   P0    │
LIKELIHOOD  ├─────────┼─────────┤
      Low   │   P3    │   P1    │
            └─────────┴─────────┘
```

## Coverage Targets by Priority

| Priority | Unit Test | Integration | E2E/Smoke | Manual      |
| -------- | --------- | ----------- | --------- | ----------- |
| P0       | 100%      | 100%        | Required  | Pre-release |
| P1       | 80%+      | 80%+        | As needed | Milestone   |
| P2       | 60%+      | Key paths   | Optional  | Sprint      |
| P3       | Optional  | Optional    | No        | Ad-hoc      |

## Test Type Distribution

### Recommended Test Pyramid (Games)

```
                    ▲
                   /│\
                  / │ \    E2E/Smoke Tests (5%)
                 /  │  \   - Full game flow
                /   │   \  - Platform certification
               ───────────
              /     │     \
             /      │      \   Integration Tests (25%)
            /       │       \  - System interactions
           /        │        \ - Network, save, audio
          ─────────────────────
         /          │          \
        /           │           \  Unit Tests (70%)
       /            │            \ - Pure logic
      /             │             \- Algorithms, calculations
     ───────────────────────────────
```

### Game-Specific Considerations

Unlike web apps, games have unique testing needs:

| Test Type   | Standard App   | Game-Specific              |
| ----------- | -------------- | -------------------------- |
| Unit        | Business logic | Damage calc, AI decisions  |
| Integration | API + DB       | Physics, audio, network    |
| E2E         | User flows     | Gameplay scenarios         |
| Additional  | N/A            | Playtesting, balance, feel |

## Execution Order

### CI Pipeline (Every Commit)

1. P0 smoke tests (5-10 minutes)
2. P0/P1 unit tests (10-15 minutes)
3. P0 integration tests (5-10 minutes)

### Daily/Nightly

1. Full P0 suite
2. Full P1 suite
3. P2 regression suite
4. Performance benchmarks

### Milestone/Release

1. All automated tests
2. Full P0-P2 manual testing
3. Platform certification tests
4. Exploratory testing
5. Performance profiling

## Bug Triage Criteria

### Priority Assignment

| Question                   | P0   | P1        | P2   | P3   |
| -------------------------- | ---- | --------- | ---- | ---- |
| Can player complete game?  | No   | Affected  | No   | No   |
| How many players affected? | All  | Most      | Some | Few  |
| Is there a workaround?     | No   | Difficult | Yes  | Easy |
| Data at risk?              | Yes  | Possible  | No   | No   |
| Platform certification?    | Fail | Risk      | Pass | Pass |

### Severity vs Priority

```
SEVERITY: How bad is the bug?
  Critical → Crash, data loss
  Major    → Feature broken
  Minor    → Incorrect behavior
  Trivial  → Cosmetic

PRIORITY: How soon to fix?
  P0 → Immediately (blocks release)
  P1 → This sprint
  P2 → This milestone
  P3 → Backlog
```

## Resource Allocation

### QA Time Distribution

| Activity         | Percentage |
| ---------------- | ---------- |
| P0 verification  | 30%        |
| P1 testing       | 30%        |
| P2 testing       | 20%        |
| Exploratory      | 15%        |
| Test maintenance | 5%         |

### Automation Investment

| Priority | Automation Value | ROI            |
| -------- | ---------------- | -------------- |
| P0       | Essential        | Highest        |
| P1       | High             | High           |
| P2       | Medium           | Medium         |
| P3       | Low              | Often negative |

## Platform Priority Matrix

### Multi-Platform Prioritization

| Platform                | Player Base | Certification | Testing Priority  |
| ----------------------- | ----------- | ------------- | ----------------- |
| Primary (e.g., PC)      | 60%         | Light         | P0: All, P1: All  |
| Secondary (e.g., PS5)   | 25%         | Heavy         | P0: All, P1: Most |
| Tertiary (e.g., Switch) | 15%         | Medium        | P0: All, P1: Core |

### Cross-Platform Testing Strategy

```
         Platform Testing Coverage

         PC    PS5   Xbox  Switch  Mobile
P0       ████  ████  ████  ████    ████
P1       ████  ███░  ███░  ██░░    ██░░
P2       ███░  ██░░  ██░░  █░░░    █░░░
P3       ██░░  █░░░  █░░░  ░░░░    ░░░░

████ = Full coverage
███░ = High coverage
██░░ = Medium coverage
█░░░ = Low coverage
░░░░ = Minimal/none
```

## Best Practices

### DO

- Reassess priorities as development progresses
- Weight user-facing features higher
- Consider platform certification requirements
- Focus automation on stable, high-value areas
- Track bug escape rates by priority

### DON'T

- Treat all tests equally
- Automate P3 before P0/P1 coverage is solid
- Skip P0 testing for "small changes"
- Ignore platform-specific requirements
- Let P1/P2 bugs accumulate

## Metrics to Track

| Metric              | Target        | Purpose              |
| ------------------- | ------------- | -------------------- |
| P0 test pass rate   | 100%          | Build quality        |
| P0 bug escape rate  | 0%            | Test effectiveness   |
| P1 coverage         | 80%+          | Feature coverage     |
| Test execution time | < 30 min (CI) | Development velocity |
| Flaky test rate     | < 1%          | Test reliability     |
