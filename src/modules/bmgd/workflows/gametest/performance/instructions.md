<!-- Powered by BMAD-CORE™ -->

# Performance Testing Strategy

**Workflow ID**: `_bmad/bmgd/gametest/performance`
**Version**: 1.0 (BMad v6)

---

## Overview

Design a comprehensive performance testing strategy covering frame rate, memory usage, loading times, and platform-specific requirements. Performance directly impacts player experience.

**Knowledge Base Reference**: `knowledge/performance-testing.md`

---

## Preflight Requirements

- ✅ Target platforms identified
- ✅ Performance requirements known (target FPS, memory limits)
- ✅ Representative content available for testing
- ✅ Profiling tools accessible

---

## Step 1: Define Performance Targets

### Frame Rate Targets

| Platform          | Target FPS | Minimum FPS | Notes              |
| ----------------- | ---------- | ----------- | ------------------ |
| PC (High)         | 60+        | 30          | Uncapped option    |
| PC (Low)          | 30         | 30          | Scalable settings  |
| PS5/Xbox X        | 60         | 60          | Performance mode   |
| PS4/Xbox One      | 30         | 30          | Locked             |
| Switch Docked     | 30         | 30          | Stable             |
| Switch Handheld   | 30         | 25          | Power saving       |
| Mobile (High)     | 60         | 30          | Device dependent   |
| Mobile (Standard) | 30         | 30          | Thermal throttling |

### Memory Budgets

| Platform      | Total RAM | Game Budget | Notes               |
| ------------- | --------- | ----------- | ------------------- |
| PC (Min spec) | 8 GB      | 4 GB        | Leave room for OS   |
| PS5           | 16 GB     | 12 GB       | Unified memory      |
| Xbox Series X | 16 GB     | 13 GB       | With Smart Delivery |
| Switch        | 4 GB      | 2.5 GB      | Tight constraints   |
| Mobile        | 4-6 GB    | 1.5-2 GB    | Background apps     |

### Loading Time Targets

| Scenario     | Target | Maximum |
| ------------ | ------ | ------- |
| Initial boot | < 10s  | 30s     |
| Level load   | < 15s  | 30s     |
| Fast travel  | < 5s   | 10s     |
| Respawn      | < 3s   | 5s      |

---

## Step 2: Identify Test Scenarios

### Stress Test Scenarios

Create scenarios that push performance limits:

```
SCENARIO: Maximum Entity Count
  GIVEN game level with normal enemy spawn
  WHEN enemy count reaches 50+
  THEN frame rate stays above minimum
  AND no visual artifacts
  AND audio doesn't stutter

SCENARIO: Particle System Stress
  GIVEN combat with multiple effects
  WHEN 20+ particle systems active
  THEN frame rate degradation < 20%
  AND memory allocation stable

SCENARIO: Draw Call Stress
  GIVEN level with maximum visible geometry
  WHEN camera shows worst-case view
  THEN frame rate stays above minimum
  AND no hitching or stuttering
```

### Memory Test Scenarios

```
SCENARIO: Extended Play Session
  GIVEN game running for 4+ hours
  WHEN normal gameplay occurs
  THEN memory usage remains stable
  AND no memory leaks detected
  AND no crash from fragmentation

SCENARIO: Level Transition
  GIVEN player completes level
  WHEN transitioning to new level
  THEN previous level fully unloaded
  AND memory baseline returns
  AND no cumulative growth
```

### Loading Test Scenarios

```
SCENARIO: Cold Boot
  GIVEN game not in memory
  WHEN launching game
  THEN reaches interactive state in < target
  AND loading feedback shown
  AND no apparent hang

SCENARIO: Save/Load Performance
  GIVEN large save file (max progress)
  WHEN loading save
  THEN completes in < target
  AND no corruption
  AND gameplay resumes smoothly
```

---

## Step 3: Define Test Methodology

### Automated Performance Tests

**Unity Profiler Integration**:

```csharp
[UnityTest]
public IEnumerator Performance_CombatScene_MaintainsFPS()
{
    using (Measure.ProfilerMarkers(new[] { "Main Thread" }))
    {
        SceneManager.LoadScene("CombatStressTest");
        yield return new WaitForSeconds(30f);
    }

    var metrics = Measure.Custom(new SampleGroupDefinition("FPS"));
    Assert.Greater(metrics.Median, 30, "FPS should stay above 30");
}
```

**Unreal Automation**:

```cpp
bool FPerformanceTest::RunTest(const FString& Parameters)
{
    // Capture baseline
    float StartTime = FPlatformTime::Seconds();

    // Run stress scenario
    for (int i = 0; i < 100; i++)
    {
        GetWorld()->SpawnActor<AStressTestActor>();
    }

    // Measure frame time
    float FrameTime = FApp::GetDeltaTime();
    TestTrue("Frame time under budget", FrameTime < 0.033f); // 30 FPS

    return true;
}
```

**Godot Benchmark**:

```gdscript
func test_performance_entity_stress():
    var frame_times = []

    # Spawn stress load
    for i in range(100):
        var entity = stress_entity.instantiate()
        add_child(entity)

    # Collect frame times
    for i in range(300):  # 5 seconds at 60fps
        await get_tree().process_frame
        frame_times.append(Performance.get_monitor(Performance.TIME_PROCESS))

    # Analyze
    var avg_frame_time = frame_times.reduce(func(a, b): return a + b) / frame_times.size()
    assert_lt(avg_frame_time, 0.033, "Average frame time under 33ms (30 FPS)")
```

### Manual Profiling Checklist

1. **CPU Profiling**
   - [ ] Identify hotspots
   - [ ] Check GC frequency
   - [ ] Verify multithreading usage

2. **GPU Profiling**
   - [ ] Draw call count
   - [ ] Overdraw analysis
   - [ ] Shader complexity

3. **Memory Profiling**
   - [ ] Heap allocation patterns
   - [ ] Asset memory usage
   - [ ] Leak detection over time

---

## Step 4: Create Benchmark Suite

### Benchmark Levels

Create dedicated benchmark scenarios:

| Benchmark       | Purpose                  | Duration |
| --------------- | ------------------------ | -------- |
| Combat Stress   | Max entities, effects    | 60s      |
| Open World      | Draw distance, streaming | 120s     |
| Menu Navigation | UI performance           | 30s      |
| Save/Load       | Persistence performance  | 30s      |

### Baseline Capture

1. Run benchmarks on reference hardware
2. Record baseline metrics
3. Set regression thresholds (e.g., 10% degradation = fail)
4. Integrate into CI pipeline

---

## Step 5: Platform-Specific Testing

### PC Testing

- Test across min/recommended specs
- Verify quality settings work
- Check VRAM usage at each tier
- Test at multiple resolutions

### Console Testing

- Test in both performance/quality modes
- Verify thermal throttling behavior
- Check suspend/resume impact
- Test with varying storage speeds

### Mobile Testing

- Test on low/mid/high tier devices
- Monitor thermal throttling
- Check battery impact
- Test with background apps

---

## Step 6: Generate Performance Test Plan

### Document Structure

```markdown
# Performance Test Plan: {Project Name}

## Performance Targets

[Tables for FPS, memory, loading times]

## Test Scenarios

### Frame Rate Tests

[Stress test scenarios]

### Memory Tests

[Extended play, leak detection scenarios]

### Loading Tests

[Boot, level load, save/load scenarios]

## Methodology

### Automated Tests

[Code examples, CI integration]

### Manual Profiling

[Checklist, tools to use]

## Benchmark Suite

[Benchmark definitions, baseline metrics]

## Platform Matrix

[Platform-specific requirements and tests]

## Regression Criteria

[What constitutes a performance regression]

## Schedule

[When performance tests run, who reviews]
```

---

## Deliverables

1. **Performance Test Plan** - Comprehensive strategy document
2. **Benchmark Scenarios** - Reproducible test levels
3. **Baseline Metrics** - Reference performance data
4. **Automated Tests** - CI-integrated performance tests

---

## Validation

Refer to `checklist.md` for validation criteria.
