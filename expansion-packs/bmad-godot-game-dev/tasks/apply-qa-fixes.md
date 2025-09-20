<!-- Powered by BMAD™ Core -->

# apply-qa-fixes

Implement fixes based on QA results (gate and assessments) for a specific Godot game story. This task is for the Game Developer agent to systematically consume QA outputs and apply game code/test changes while only updating allowed sections in the story file.

## Purpose

- Read QA outputs for a game story (gate YAML + assessment markdowns)
- Create a prioritized, deterministic fix plan for game features
- Apply game code and test changes to close gaps and address issues
- Update only the allowed story sections for the Game Developer agent

## Inputs

```yaml
required:
  - story_id: '{epic}.{story}' # e.g., "2.2"
  - qa_root: from `.bmad-godot-game-dev/config.yaml` key `qa.qaLocation` (e.g., `docs/project/qa`)
  - story_root: from `.bmad-godot-game-dev/config.yaml` key `devStoryLocation` (e.g., `docs/project/stories`)
  - project_root: Godot project root directory (containing project.godot)

optional:
  - story_title: '{title}' # derive from story H1 if missing
  - story_slug: '{slug}' # derive from title (lowercase, hyphenated) if missing
```

## QA Sources to Read

- Gate (YAML): `{qa_root}/gates/{epic}.{story}-*.yml`
  - If multiple, use the most recent by modified time
- Assessments (Markdown):
  - Test Design: `{qa_root}/assessments/{epic}.{story}-test-design-*.md`
  - Traceability: `{qa_root}/assessments/{epic}.{story}-trace-*.md`
  - Risk Profile: `{qa_root}/assessments/{epic}.{story}-risk-*.md`
  - NFR Assessment: `{qa_root}/assessments/{epic}.{story}-nfr-*.md`

## Prerequisites

- Godot 4.x installed and configured
- Testing frameworks installed:
  - **GDScript**: GUT (Godot Unit Test) framework installed as addon
  - **C#**: GoDotTest or GodotTestDriver NuGet packages installed
- Project builds successfully in Godot Editor
- Test commands available:
  - GDScript: `godot --headless --script res://addons/gut/gut_cmdln.gd`
  - C#: `dotnet test` or `godot --headless --run-tests`

## Process (Do not skip steps)

### 0) Load Core Config & Locate Story

- Read `.bmad-core/core-config.yaml` and resolve `qa_root`, `story_root`, and `project_root`
- Locate story file in `{story_root}/{epic}.{story}.*.md`
  - HALT if missing and ask for correct story id/path

### 1) Collect QA Findings

- Parse the latest gate YAML:
  - `gate` (PASS|CONCERNS|FAIL|WAIVED)
  - `top_issues[]` with `id`, `severity`, `finding`, `suggested_action`
  - `nfr_validation.*.status` and notes
  - `trace` coverage summary/gaps
  - `test_design.coverage_gaps[]`
  - `risk_summary.recommendations.must_fix[]` (if present)
- Read any present assessment markdowns and extract explicit gaps/recommendations

### 2) Build Deterministic Fix Plan (Priority Order)

Apply in order, highest priority first:

1. High severity items in `top_issues` (gameplay/performance/stability/maintainability)
2. NFR statuses: all FAIL must be fixed → then CONCERNS
3. Test Design `coverage_gaps` (prioritize P0 gameplay scenarios)
4. Trace uncovered requirements (AC-level, especially gameplay mechanics)
5. Risk `must_fix` recommendations
6. Medium severity issues, then low

Guidance:

- Prefer tests closing coverage gaps before/with code changes
- Keep changes minimal and targeted; follow Godot best practices and project architecture
- Respect scene organization and node hierarchy
- Follow GDScript style guide or C# conventions as appropriate

### 3) Apply Changes

- Implement game code fixes per plan:
  - GDScript: Follow Godot style guide, use signals for decoupling
  - C#: Follow .NET conventions, use events/delegates appropriately
- Add missing tests to close coverage gaps:
  - **GDScript Tests (GUT)**:
    - Unit tests in `test/unit/` for game logic
    - Integration tests in `test/integration/` for scene interactions
    - Use `gut.p()` for parameterized tests
    - Mock nodes with `double()` and `stub()`
  - **C# Tests (GoDotTest/GodotTestDriver)**:
    - Unit tests using xUnit or NUnit patterns
    - Integration tests for scene and node interactions
    - Use test fixtures for game state setup
- Follow Godot patterns:
  - Autoload/singleton patterns for global game state
  - Signal-based communication between nodes
  - Resource files (.tres/.res) for data management
  - Scene inheritance for reusable components

### 4) Validate

**For GDScript Projects:**

- Run GUT tests: `godot --headless --script res://addons/gut/gut_cmdln.gd -gselect=test/ -gexit`
- Check for script errors in Godot Editor (Script Editor panel)
- Validate scene references and node paths
- Run game in editor to verify no runtime errors

**For C# Projects:**

- Build solution: `dotnet build`
- Run tests: `dotnet test` or `godot --headless --run-tests`
- Check for compilation errors
- Validate no null reference exceptions in gameplay

**For Both:**

- Test gameplay mechanics manually if needed
- Verify performance (check FPS, memory usage)
- Iterate until all tests pass and no errors

### 5) Update Story (Allowed Sections ONLY)

CRITICAL: Dev agent is ONLY authorized to update these sections of the story file. Do not modify any other sections (e.g., QA Results, Story, Acceptance Criteria, Dev Notes, Testing):

- Tasks / Subtasks Checkboxes (mark any fix subtask you added as done)
- Dev Agent Record →
  - Agent Model Used (if changed)
  - Debug Log References (test results, Godot console output)
  - Completion Notes List (what changed, why, how)
  - File List (all added/modified/deleted files)
- Change Log (new dated entry describing applied fixes)
- Status (see Rule below)

Status Rule:

- If gate was PASS and all identified gaps are closed → set `Status: Ready for Done`
- Otherwise → set `Status: Ready for Review` and notify QA to re-run the review

### 6) Do NOT Edit Gate Files

- Dev does not modify gate YAML. If fixes address issues, request QA to re-run `review-story` to update the gate

## Blocking Conditions

- Missing `.bmad-core/core-config.yaml`
- Story file not found for `story_id`
- No QA artifacts found (neither gate nor assessments)
  - HALT and request QA to generate at least a gate file (or proceed only with clear developer-provided fix list)
- Godot project file (`project.godot`) not found
- Testing framework not properly installed (GUT addon missing or NuGet packages not restored)

## Completion Checklist

- Godot project builds without errors
- All tests pass:
  - GDScript: GUT tests green
  - C#: dotnet test successful
- No script errors in Godot Editor
- All high severity `top_issues` addressed
- NFR FAIL → resolved; CONCERNS minimized or documented
- Coverage gaps closed or explicitly documented with rationale
- Gameplay features tested and working
- Story updated (allowed sections only) including File List and Change Log
- Status set according to Status Rule

## Example: Story 2.2 - Player Movement System

Given gate `docs/project/qa/gates/2.2-*.yml` shows

- `coverage_gaps`: Jump mechanics edge cases untested (AC2)
- `coverage_gaps`: Input buffering not tested (AC4)
- `top_issues`: Performance drops when multiple players active

Fix plan:

**GDScript Example:**

- Add GUT test for jump height variation based on button hold time
- Add test for input buffering during state transitions
- Optimize player movement script using object pooling for effects
- Test with `gut.p()` parameterized tests for different player counts

**C# Example:**

- Add GoDotTest unit test for jump physics calculations
- Add integration test for input system using GodotTestDriver
- Refactor movement system to use Jobs/Tasks for parallel processing
- Verify with performance profiler

- Re-run tests and update Dev Agent Record + File List accordingly

## Key Principles

- Deterministic, risk-first prioritization
- Minimal, maintainable changes following Godot best practices
- Tests validate gameplay behavior and close gapså
- Respect Godot's node-based architecture and signal system
- Maintain clear separation between game logic and presentation
- Strict adherence to allowed story update areas
- Gate ownership remains with QA; Game Developer signals readiness via Status

## Testing Framework References

### GUT (GDScript)

- Documentation: https://github.com/bitwes/Gut/wiki
- Test structure: `extends GutTest`
- Assertions: `assert_eq()`, `assert_true()`, `assert_has_signal()`
- Mocking: `double()`, `stub()`, `spy_on()`

### GoDotTest/GodotTestDriver (C#)

- GoDotTest: xUnit-style testing for Godot C#
- GodotTestDriver: Integration testing with scene manipulation
- Test attributes: `[Fact]`, `[Theory]`, `[InlineData]`
- Scene testing: Load scenes, interact with nodes, verify state
