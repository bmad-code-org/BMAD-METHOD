<!-- Powered by BMAD™ Core -->

# game-test-design

Create comprehensive Godot game test scenarios using GUT (GDScript) or GoDotTest/GodotTestDriver (C#) with appropriate test level recommendations for game feature implementation.

## Inputs

```yaml
required:
  - story_id: '{epic}.{story}' # e.g., "1.3"
  - story_path: '{devStoryLocation}/{epic}.{story}.*.md' # Path from core-config.yaml
  - story_title: '{title}' # If missing, derive from story file H1
  - story_slug: '{slug}' # If missing, derive from title (lowercase, hyphenated)
```

## Purpose

Design a complete Godot game test strategy that identifies what to test, at which level (unit/integration/playtesting), and which testing framework to use (GUT for GDScript, GoDotTest/GodotTestDriver for C#). This ensures efficient test coverage for game mechanics, systems, and player experience while maintaining appropriate test boundaries.

## Dependencies

```yaml
data:
  - game-test-levels-framework.md # Unit/Integration/Playtesting decision criteria
  - game-test-priorities-matrix.md # P0/P1/P2/P3 classification for game features
frameworks:
  gdscript:
    - GUT (Godot Unit Test) # Native GDScript testing framework
  csharp:
    - GoDotTest # xUnit-based testing for C#
    - GodotTestDriver # UI automation and integration testing
```

## Godot Testing Frameworks

### GUT (Godot Unit Test) - GDScript

- **Best for**: Game logic, state machines, inventory systems, damage calculations
- **Setup**: Install via AssetLib or GitHub
- **Test location**: `res://tests/unit/`
- **Example**: Testing player health system, weapon damage modifiers

### GoDotTest - C#

- **Best for**: C# game systems, complex algorithms, data structures
- **Setup**: NuGet package with xUnit integration
- **Test location**: `tests/` directory in project root
- **Example**: Testing procedural generation, AI decision trees

### GodotTestDriver - C#

- **Best for**: UI automation, integration testing, scene transitions
- **Setup**: NuGet package for UI testing
- **Test location**: `tests/integration/`
- **Example**: Testing menu navigation, save/load flows, multiplayer lobbies

## Process

### 1. Analyze Story Requirements

Break down each acceptance criterion into testable game scenarios. For each AC:

- Identify the core game mechanic or system to test
- Determine input variations (controls, player actions)
- Consider edge cases (collision boundaries, resource limits)
- Note platform-specific behaviors
- Identify performance requirements (FPS, memory)

### 2. Apply Game Test Level Framework

**Reference:** Load `game-test-levels-framework.md` for detailed criteria

Quick rules for Godot:

- **Unit Tests (GUT/GoDotTest)**: Game logic, damage calculations, inventory systems, state machines
- **Integration Tests (GUT/GodotTestDriver)**: Scene interactions, signal connections, save/load, physics
- **Playtesting**: Full gameplay loops, difficulty balance, fun factor, performance on target hardware

### 3. Assign Priorities

**Reference:** Load `test-priorities-matrix.md` for classification

Quick priority assignment for games:

- **P0**: Game-breaking bugs, save corruption, core mechanics, progression blockers
- **P1**: Combat systems, player movement, UI responsiveness, multiplayer sync
- **P2**: Visual effects, audio, achievements, secondary mechanics
- **P3**: Cosmetics, easter eggs, optional content

### 4. Design Test Scenarios

For each identified test need, create:

```yaml
test_scenario:
  id: '{epic}.{story}-{LEVEL}-{SEQ}'
  requirement: 'AC reference'
  priority: P0|P1|P2|P3
  level: unit|integration|playtest
  framework: GUT|GoDotTest|GodotTestDriver|Manual
  description: 'What game feature/mechanic is being tested'
  justification: 'Why this level and framework were chosen'
  test_scene: 'res://tests/{TestSceneName}.tscn' # For automated tests
  mitigates_risks: ['PERF-001', 'GAME-002'] # From risk profile
```

### 5. Validate Coverage

Ensure:

- Every AC has at least one test
- No duplicate coverage across levels
- Critical paths have multiple levels
- Risk mitigations are addressed

## Outputs

### Output 1: Test Design Document

**Save to:** `qa.qaLocation/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md`

```markdown
# Test Design: Story {epic}.{story}

Date: {date}
Designer: Quinn (Game Test Architect)

## Game Test Strategy Overview

- Total test scenarios: X
- Unit tests (GUT/GoDotTest): Y (A%)
- Integration tests (GodotTestDriver): Z (B%)
- Playtesting scenarios: W (C%)
- Framework distribution: GUT: X%, GoDotTest: Y%, Manual: Z%
- Priority distribution: P0: X, P1: Y, P2: Z

## Test Scenarios by Acceptance Criteria

### AC1: {description}

#### Scenarios

| ID           | Level       | Framework | Priority | Test                          | Justification                |
| ------------ | ----------- | --------- | -------- | ----------------------------- | ---------------------------- |
| 1.3-UNIT-001 | Unit        | GUT       | P0       | Player damage calculation     | Core combat logic            |
| 1.3-INT-001  | Integration | GoDotTest | P0       | Enemy AI pathfinding          | NavigationAgent2D behavior   |
| 1.3-PLAY-001 | Playtest    | Manual    | P1       | Boss fight difficulty balance | Player experience validation |

[Continue for all ACs...]

## Risk Coverage

[Map test scenarios to identified risks if risk profile exists]

## Recommended Execution Order

1. P0 Unit tests (fail fast)
2. P0 Integration tests
3. P0 E2E tests
4. P1 tests in order
5. P2+ as time permits
```

### Output 2: Gate YAML Block

Generate for inclusion in quality gate:

```yaml
test_design:
  scenarios_total: X
  by_level:
    unit: Y
    integration: Z
    playtest: W
  by_framework:
    gut: A
    godottest: B
    testdriver: C
    manual: D
  by_priority:
    p0: A
    p1: B
    p2: C
  coverage_gaps: [] # List any ACs without tests
  performance_tests: [] # FPS, memory, load time tests
```

### Output 3: Trace References

Print for use by trace-requirements task:

```text
Test design matrix: qa.qaLocation/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md
P0 tests identified: {count}
```

## Game Testing Quality Checklist

Before finalizing, verify:

- [ ] Every AC has test coverage
- [ ] Test frameworks match language (GUT for GDScript, GoDotTest for C#)
- [ ] Physics and collision tests use proper test scenes
- [ ] Performance tests target minimum spec hardware
- [ ] Multiplayer tests cover desync scenarios
- [ ] Save/load tests verify data integrity
- [ ] Platform-specific tests for each export target
- [ ] Test scenes are properly organized in res://tests/

## Key Game Testing Principles

- **Shift left**: Test game logic early with GUT/GoDotTest before full integration
- **Performance first**: Profile early and often, test on min spec
- **Player experience**: Balance automated tests with human playtesting
- **Framework selection**: GUT for GDScript game logic, GoDotTest for C# systems, GodotTestDriver for UI
- **Scene isolation**: Test components in minimal scenes to reduce dependencies
- **Fast feedback**: Unit tests in CI/CD, integration tests nightly, playtests per sprint
- **Platform coverage**: Test exports on all target platforms regularly
