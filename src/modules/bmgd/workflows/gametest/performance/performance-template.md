# Performance Test Plan: {PROJECT_NAME}

**Version**: {VERSION}
**Created**: {DATE}
**Author**: {AUTHOR}

---

## Overview

### Performance Philosophy

{High-level approach to performance for this project}

### Target Experience

- Primary target: {platform, e.g., "PS5 at 60 FPS"}
- Minimum viable: {platform, e.g., "PS4 at 30 FPS"}

---

## Performance Targets

### Frame Rate

| Platform      | Target FPS | Minimum FPS | Mode        |
| ------------- | ---------- | ----------- | ----------- |
| PC (High)     |            |             |             |
| PC (Low)      |            |             |             |
| PS5           |            |             | Performance |
| PS5           |            |             | Quality     |
| Xbox Series X |            |             |             |
| Switch        |            |             |             |
| Mobile        |            |             |             |

### Memory Budget

| Platform      | Total RAM | Game Budget | Reserve |
| ------------- | --------- | ----------- | ------- |
| PC (Min)      |           |             |         |
| PS5           |           |             |         |
| Xbox Series X |           |             |         |
| Switch        |           |             |         |
| Mobile        |           |             |         |

### Loading Times

| Scenario     | Target | Maximum | Notes |
| ------------ | ------ | ------- | ----- |
| Initial boot |        |         |       |
| Level load   |        |         |       |
| Fast travel  |        |         |       |
| Respawn      |        |         |       |
| Save/Load    |        |         |       |

---

## Test Scenarios

### Frame Rate Stress Tests

#### Scenario: {Name}

```
GIVEN {setup conditions}
WHEN {stress conditions applied}
THEN frame rate >= {minimum}
AND frame time variance < {threshold}
PLATFORM: {target platforms}
```

{Repeat for each scenario}

### Memory Tests

#### Scenario: Extended Play Session

```
GIVEN game running for 4+ hours
WHEN normal gameplay patterns occur
THEN memory usage stays within budget
AND no detected memory leaks
AND GC pauses < 16ms
```

#### Scenario: Level Transition

```
GIVEN player completes level
WHEN loading next level
THEN previous level memory freed
AND memory returns to baseline (+/- 5%)
```

### Loading Time Tests

#### Scenario: Cold Boot

```
GIVEN game not in memory
WHEN launching from platform UI
THEN interactive menu in < {target}s
AND loading progress visible
```

---

## Benchmark Suite

### Benchmark Levels

| Name          | Purpose   | Duration  | Key Metrics        |
| ------------- | --------- | --------- | ------------------ |
| {Benchmark 1} | {purpose} | {seconds} | FPS, frame time    |
| {Benchmark 2} | {purpose} | {seconds} | Draw calls, memory |
| {Benchmark 3} | {purpose} | {seconds} | Load time          |

### Baseline Metrics

| Benchmark | Platform | FPS (Avg) | FPS (1%) | Memory | Date |
| --------- | -------- | --------- | -------- | ------ | ---- |
|           |          |           |          |        |      |

### Regression Criteria

| Metric      | Warning | Failure |
| ----------- | ------- | ------- |
| FPS Average | -5%     | -10%    |
| FPS 1% Low  | -10%    | -20%    |
| Memory      | +5%     | +10%    |
| Load Time   | +10%    | +25%    |

---

## Profiling Methodology

### Tools

| Platform | CPU Profiler    | GPU Profiler      | Memory          |
| -------- | --------------- | ----------------- | --------------- |
| Unity    | Unity Profiler  | Frame Debugger    | Memory Profiler |
| Unreal   | Unreal Insights | RenderDoc         | Memreport       |
| Godot    | Profiler        | Shader debugger   | Monitors        |
| PC       | PIX, vtune      | RenderDoc, Nsight | RAMMap          |
| PS5      | Razor           | Razor GPU         | -               |
| Xbox     | PIX             | PIX               | -               |

### Profiling Checklist

#### CPU

- [ ] Main thread frame time
- [ ] Worker thread utilization
- [ ] GC frequency and duration
- [ ] Hotspot identification

#### GPU

- [ ] Draw call count
- [ ] Overdraw ratio
- [ ] Shader complexity
- [ ] Memory bandwidth

#### Memory

- [ ] Peak allocation
- [ ] Leak detection
- [ ] Fragmentation
- [ ] Asset memory breakdown

---

## Automated Tests

### CI Integration

```yaml
# Example CI configuration
performance-tests:
  stage: test
  script:
    - ./run-benchmarks.sh
    - ./check-regression.sh
  artifacts:
    reports:
      performance: benchmark-results.json
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"
```

### Automated Test Examples

{Engine-appropriate code examples}

---

## Platform-Specific Testing

### PC

- [ ] Test on minimum spec hardware
- [ ] Test on recommended spec hardware
- [ ] Verify quality presets work
- [ ] Check VRAM usage at each tier
- [ ] Test at 1080p, 1440p, 4K

### Console

- [ ] Test performance mode
- [ ] Test quality mode
- [ ] Check thermal throttling behavior
- [ ] Verify suspend/resume
- [ ] Test with HDD vs SSD (if applicable)

### Mobile

- [ ] Test on low-tier device
- [ ] Test on mid-tier device
- [ ] Test on high-tier device
- [ ] Monitor thermal throttling
- [ ] Check battery drain

---

## Schedule

| Activity           | Frequency | Owner     |
| ------------------ | --------- | --------- |
| Benchmark run      | Daily     | CI        |
| Regression review  | Weekly    | QA Lead   |
| Deep profiling     | Milestone | Tech Lead |
| Platform soak test | Monthly   | QA        |

---

## Reporting

### Weekly Performance Report

- Benchmark trends
- Regression incidents
- Optimization progress
- Risk areas

### Release Criteria

- [ ] All platforms meet minimum FPS
- [ ] No memory leaks in 4-hour test
- [ ] Load times within targets
- [ ] No regression > failure threshold

---

## Notes

{Additional considerations, known issues, platform quirks}
