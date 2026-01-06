<!-- Powered by BMAD-CORE™ -->

# Game Test Design

**Workflow ID**: `_bmad/bmgd/gametest/test-design`
**Version**: 1.0 (BMad v6)

---

## Overview

Create comprehensive test scenarios for game projects, covering gameplay mechanics, progression systems, multiplayer functionality, and platform requirements. This workflow produces a prioritized test plan based on risk assessment and player impact.

---

## Preflight Requirements

- ✅ Game design documentation available (GDD, feature specs)
- ✅ Understanding of target platforms
- ✅ Knowledge of core gameplay loop

---

## Step 1: Gather Context

### Actions

1. **Read Game Design Documentation**
   - Locate GDD or game-design.md
   - Identify core mechanics and features
   - Note target platforms and certification requirements

2. **Identify Critical Systems**
   - Core gameplay loop
   - Progression/save systems
   - Multiplayer (if applicable)
   - Monetization (if applicable)

3. **Assess Risk Areas**
   - Player-facing features (highest priority)
   - Data persistence (save/load)
   - Platform certification requirements
   - Performance-critical paths

---

## Step 2: Define Test Categories

### Core Gameplay Testing

**Knowledge Base Reference**: `knowledge/playtesting.md`

| Category           | Focus                      | Priority |
| ------------------ | -------------------------- | -------- |
| Core Loop          | Primary mechanic execution | P0       |
| Combat/Interaction | Hit detection, feedback    | P0       |
| Movement           | Physics, collision, feel   | P0       |
| UI/UX              | Menu navigation, HUD       | P1       |
| Audio              | Sound triggers, music      | P2       |

### Progression Testing

**Knowledge Base Reference**: `knowledge/save-testing.md`

| Category     | Focus              | Priority |
| ------------ | ------------------ | -------- |
| Save/Load    | Data persistence   | P0       |
| Unlocks      | Content gating     | P1       |
| Economy      | Currency, rewards  | P1       |
| Achievements | Trigger conditions | P2       |

### Multiplayer Testing (if applicable)

**Knowledge Base Reference**: `knowledge/multiplayer-testing.md`

| Category        | Focus               | Priority |
| --------------- | ------------------- | -------- |
| Connectivity    | Join/leave handling | P0       |
| Synchronization | State consistency   | P0       |
| Latency         | Degraded network    | P1       |
| Matchmaking     | Player grouping     | P1       |

### Platform Testing

**Knowledge Base Reference**: `knowledge/certification-testing.md`

| Category      | Focus               | Priority |
| ------------- | ------------------- | -------- |
| Certification | TRC/XR requirements | P0       |
| Input         | Controller support  | P0       |
| Performance   | FPS, loading times  | P1       |
| Accessibility | Assist features     | P1       |

---

## Step 3: Create Test Scenarios

### Scenario Format

For each critical feature, create scenarios using this format:

```
SCENARIO: [Descriptive Name]
  GIVEN [Initial state/preconditions]
  WHEN [Action taken]
  THEN [Expected outcome]
  PRIORITY: P0/P1/P2/P3
  CATEGORY: [gameplay/progression/multiplayer/platform]
```

### Example Scenarios

**Gameplay - Combat**

```
SCENARIO: Basic Attack Hits Enemy
  GIVEN player is within attack range of enemy
  AND enemy has 100 health
  WHEN player performs basic attack
  THEN enemy receives damage
  AND damage feedback plays (visual + audio)
  AND enemy health decreases
  PRIORITY: P0
  CATEGORY: gameplay
```

**Progression - Save System**

```
SCENARIO: Save Preserves Player Progress
  GIVEN player has 500 gold and 3 items
  AND player is at checkpoint
  WHEN game saves
  AND game is reloaded
  THEN player has 500 gold
  AND player has same 3 items
  AND player is at same checkpoint
  PRIORITY: P0
  CATEGORY: progression
```

**Multiplayer - Network Degradation**

```
SCENARIO: Gameplay Under High Latency
  GIVEN 2 players in session
  AND network latency is 200ms
  WHEN Player 1 attacks Player 2
  THEN damage is applied correctly
  AND positions remain synchronized
  AND no desync occurs
  PRIORITY: P1
  CATEGORY: multiplayer
```

---

## Step 4: Prioritize Test Coverage

### Priority Assignment

**Knowledge Base Reference**: `knowledge/test-priorities.md`

| Priority | Criteria                     | Coverage Target |
| -------- | ---------------------------- | --------------- |
| P0       | Ship blockers, certification | 100% automated  |
| P1       | Major features, common paths | 80% automated   |
| P2       | Secondary features           | 60% automated   |
| P3       | Edge cases, polish           | Manual only     |

### Risk-Based Ordering

1. **Critical Path** - Main gameplay loop
2. **Data Integrity** - Save/load, progression
3. **Platform Requirements** - Certification items
4. **User Experience** - Feel, polish, accessibility

---

## Step 5: Generate Test Design Document

### Document Structure

```markdown
# Game Test Design: [Project Name]

## Overview

- Game type and core mechanics
- Target platforms
- Test scope and objectives

## Risk Assessment

- High-risk areas identified
- Mitigation strategies

## Test Categories

### Gameplay Tests

[Scenarios...]

### Progression Tests

[Scenarios...]

### Multiplayer Tests (if applicable)

[Scenarios...]

### Platform Tests

[Scenarios...]

## Coverage Matrix

| Feature | P0  | P1  | P2  | P3  |
| ------- | --- | --- | --- | --- |
| Combat  | 5   | 10  | 8   | 4   |

| ...

## Automation Strategy

- Unit test candidates
- Integration test candidates
- Manual-only scenarios

## Next Steps

1. Implement P0 tests
2. Set up CI integration
3. Plan playtesting sessions
```

---

## Deliverables

1. **Test Design Document** - `{output_folder}/game-test-design.md`
2. **Scenario List** - Prioritized test scenarios
3. **Coverage Matrix** - Feature vs priority breakdown
4. **Automation Recommendations** - What to automate vs manual test

---

## Output Summary

```markdown
## Test Design Complete

**Project**: {project_name}
**Scenarios Created**: {count}
**Priority Breakdown**:

- P0 (Critical): {p0_count}
- P1 (High): {p1_count}
- P2 (Medium): {p2_count}
- P3 (Low): {p3_count}

**Focus Areas Covered**:

- ✅ Core Gameplay
- ✅ Progression/Save
- ✅ Platform Requirements
- {✅/⬜} Multiplayer

**Next Steps**:

1. Review scenarios with team
2. Use `automate` workflow to generate test code
3. Use `playtest-plan` for manual testing sessions
```

---

## Validation

Refer to `checklist.md` for validation criteria.
