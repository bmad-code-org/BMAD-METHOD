# Game Test Design: {PROJECT_NAME}

**Version**: 1.0
**Created**: {DATE}
**Author**: {AUTHOR}

---

## Overview

### Game Description

{Brief description of the game, genre, and core mechanics}

### Target Platforms

- [ ] PC (Steam/Epic)
- [ ] PlayStation 5
- [ ] Xbox Series X|S
- [ ] Nintendo Switch
- [ ] Mobile (iOS/Android)

### Test Scope

{What is in scope and out of scope for testing}

---

## Risk Assessment

### High-Risk Areas

| Area   | Risk              | Mitigation      |
| ------ | ----------------- | --------------- |
| {area} | {potential issue} | {test strategy} |

### Risk Priority Matrix

```
                    IMPACT
                Low      High
            ┌─────────┬─────────┐
      High  │   P2    │   P0    │
LIKELIHOOD  ├─────────┼─────────┤
      Low   │   P3    │   P1    │
            └─────────┴─────────┘
```

---

## Test Categories

### 1. Core Gameplay Tests

#### 1.1 Core Loop

```
SCENARIO: {Scenario Name}
  GIVEN {preconditions}
  WHEN {action}
  THEN {expected outcome}
  PRIORITY: P0
  CATEGORY: gameplay
```

#### 1.2 Combat/Interaction

{scenarios}

#### 1.3 Movement/Physics

{scenarios}

---

### 2. Progression Tests

#### 2.1 Save/Load System

```
SCENARIO: Basic Save/Load Round Trip
  GIVEN player has made progress
  WHEN game is saved and reloaded
  THEN all progress is preserved
  PRIORITY: P0
  CATEGORY: progression
```

#### 2.2 Unlock System

{scenarios}

#### 2.3 Economy

{scenarios}

---

### 3. Multiplayer Tests (if applicable)

#### 3.1 Connectivity

{scenarios}

#### 3.2 Synchronization

{scenarios}

#### 3.3 Network Degradation

{scenarios}

---

### 4. Platform Tests

#### 4.1 Certification Requirements

{scenarios for TRC/XR items}

#### 4.2 Input Handling

{scenarios}

#### 4.3 Performance

{scenarios}

#### 4.4 Accessibility

{scenarios}

---

## Coverage Matrix

| Feature       | P0  | P1  | P2  | P3  | Total |
| ------------- | --- | --- | --- | --- | ----- |
| Core Gameplay |     |     |     |     |       |
| Combat        |     |     |     |     |       |
| Progression   |     |     |     |     |       |
| Save/Load     |     |     |     |     |       |
| Multiplayer   |     |     |     |     |       |
| Platform      |     |     |     |     |       |
| **Total**     |     |     |     |     |       |

---

## Automation Strategy

### Recommended for Automation (Unit/Integration)

- {feature/scenario} - Reason
- {feature/scenario} - Reason

### Manual Testing Required

- {feature/scenario} - Reason (e.g., requires human judgment on "feel")
- {feature/scenario} - Reason

### Automation Tools

- **Engine**: {Unity/Unreal/Godot}
- **Framework**: {Unity Test Framework/Unreal Automation/GUT}
- **CI Integration**: {GitHub Actions/Jenkins/etc.}

---

## Playtesting Recommendations

### Internal Playtests

- Focus: Core loop validation
- Participants: QA + dev team
- Duration: {hours}

### External Playtests

- Focus: User experience, difficulty curve
- Participants: Target audience
- Duration: {hours}

---

## Next Steps

1. [ ] Review test design with team
2. [ ] Prioritize P0 test implementation
3. [ ] Set up test framework (use `framework` workflow)
4. [ ] Generate automated tests (use `automate` workflow)
5. [ ] Plan playtesting sessions (use `playtest-plan` workflow)

---

## Appendix

### Glossary

{Game-specific terms and definitions}

### References

- Game Design Document
- Platform Certification Guidelines
- Knowledge Base: `qa-index.csv`
