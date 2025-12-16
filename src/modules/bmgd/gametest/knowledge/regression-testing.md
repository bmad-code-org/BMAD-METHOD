# Regression Testing for Games

## Overview

Regression testing catches bugs introduced by new changes. In games, this includes functional regressions, performance regressions, and design regressions.

## Types of Regression

### Functional Regression

- Features that worked before now break
- New bugs introduced by unrelated changes
- Broken integrations between systems

### Performance Regression

- Frame rate drops
- Memory usage increases
- Load time increases
- Battery drain (mobile)

### Design Regression

- Balance changes with unintended side effects
- UX changes that hurt usability
- Art changes that break visual consistency

### Save Data Regression

- Old save files no longer load
- Progression lost or corrupted
- Achievements/unlocks reset

## Regression Testing Strategy

### Test Suite Layers

```
High-Frequency (Every Commit)
├── Unit Tests - Fast, isolated
├── Smoke Tests - Can game launch and run?
└── Critical Path - Core gameplay works

Medium-Frequency (Nightly)
├── Integration Tests - System interactions
├── Full Playthrough - Automated or manual
└── Performance Benchmarks - Frame time, memory

Low-Frequency (Release)
├── Full Matrix - All platforms/configs
├── Certification Tests - Platform requirements
└── Localization - All languages
```

### What to Test

#### Critical Path (Must Not Break)

- Game launches
- New game starts
- Save/load works
- Core gameplay loop completes
- Main menu navigation

#### High Priority

- All game systems function
- Progression works end-to-end
- Multiplayer connects and syncs
- In-app purchases process
- Achievements trigger

#### Medium Priority

- Edge cases in systems
- Optional content accessible
- Settings persist correctly
- Localization displays

## Automated Regression Tests

### Smoke Tests

```python
# Run on every commit
def test_game_launches():
    process = launch_game()
    assert wait_for_main_menu(timeout=30)
    process.terminate()

def test_new_game_starts():
    launch_game()
    click_new_game()
    assert wait_for_gameplay(timeout=60)

def test_save_load_roundtrip():
    launch_game()
    start_new_game()
    perform_actions()
    save_game()
    load_game()
    assert verify_state_matches()
```

### Playthrough Bots

```python
# Automated player that plays through content
class PlaythroughBot:
    def run_level(self, level):
        self.load_level(level)
        while not self.level_complete:
            self.perform_action()
            self.check_for_softlocks()
            self.record_metrics()
```

### Visual Regression

```python
# Compare screenshots against baselines
def test_main_menu_visual():
    launch_game()
    screenshot = capture_screen()
    assert compare_to_baseline(screenshot, 'main_menu', threshold=0.01)
```

## Performance Regression Detection

### Metrics to Track

- Average frame time
- 1% low frame time
- Memory usage (peak, average)
- Load times
- Draw calls
- Texture memory

### Automated Benchmarks

```yaml
performance_benchmark:
  script:
    - run_benchmark_scene --duration 60s
    - collect_metrics
    - compare_to_baseline
  fail_conditions:
    - frame_time_avg > baseline * 1.1 # 10% tolerance
    - memory_peak > baseline * 1.05 # 5% tolerance
```

### Trend Tracking

- Graph metrics over time
- Alert on upward trends
- Identify problematic commits

## Save Compatibility Testing

### Version Matrix

Maintain save files from:

- Previous major version
- Previous minor version
- Current development build

### Automated Validation

```python
def test_save_compatibility():
    for save_file in LEGACY_SAVES:
        load_save(save_file)
        assert no_errors()
        assert progress_preserved()
        assert inventory_intact()
```

### Schema Versioning

- Version your save format
- Implement upgrade paths
- Log migration issues

## Regression Bug Workflow

### 1. Detection

- Automated test fails
- Manual tester finds issue
- Player report comes in

### 2. Verification

- Confirm it worked before
- Identify when it broke
- Find the breaking commit

### 3. Triage

- Assess severity
- Determine fix urgency
- Assign to appropriate developer

### 4. Fix and Verify

- Implement fix
- Add regression test
- Verify fix doesn't break other things

### 5. Post-Mortem

- Why wasn't this caught?
- How can we prevent similar issues?
- Do we need new tests?

## Bisecting Regressions

When a regression is found, identify the breaking commit:

### Git Bisect

```bash
git bisect start
git bisect bad HEAD          # Current is broken
git bisect good v1.2.0       # Known good version
# Git will checkout commits to test
# Run test, mark good/bad
git bisect good/bad
# Repeat until culprit found
```

### Automated Bisect

```bash
git bisect start HEAD v1.2.0
git bisect run ./run_regression_test.sh
```

## Regression Testing Checklist

### Per Commit

- [ ] Unit tests pass
- [ ] Smoke tests pass
- [ ] Build succeeds on all platforms

### Per Merge to Main

- [ ] Integration tests pass
- [ ] Performance benchmarks within tolerance
- [ ] Save compatibility verified

### Per Release

- [ ] Full playthrough completed
- [ ] All platforms tested
- [ ] Legacy saves load correctly
- [ ] No new critical regressions
- [ ] All previous hotfix issues still resolved

## Building a Regression Suite

### Start Small

1. Add tests for bugs as they're fixed
2. Cover critical path first
3. Expand coverage over time

### Maintain Quality

- Delete flaky tests
- Keep tests fast
- Update tests with design changes

### Measure Effectiveness

- Track bugs caught by tests
- Track bugs that slipped through
- Identify coverage gaps
