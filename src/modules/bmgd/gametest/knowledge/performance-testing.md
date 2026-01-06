# Performance Testing for Games

## Overview

Performance testing ensures your game runs smoothly on target hardware. Frame rate, load times, and memory usage directly impact player experience.

## Key Performance Metrics

### Frame Rate

- **Target:** 30fps, 60fps, 120fps depending on platform/genre
- **Measure:** Average, minimum, 1% low, 0.1% low
- **Goal:** Consistent frame times, no stutters

### Frame Time Budget

At 60fps, you have 16.67ms per frame:

```
Rendering:     8ms  (48%)
Game Logic:    4ms  (24%)
Physics:       2ms  (12%)
Audio:         1ms  (6%)
UI:            1ms  (6%)
Headroom:      0.67ms (4%)
```

### Memory

- **RAM:** Total allocation, peak usage, fragmentation
- **VRAM:** Texture memory, render targets, buffers
- **Goal:** Stay within platform limits with headroom

### Load Times

- **Initial Load:** Time to main menu
- **Level Load:** Time between scenes
- **Streaming:** Asset loading during gameplay
- **Goal:** Meet platform certification requirements

## Profiling Tools by Engine

### Unity

- **Profiler Window** - CPU, GPU, memory, rendering
- **Frame Debugger** - Draw call analysis
- **Memory Profiler** - Heap snapshots
- **Profile Analyzer** - Compare captures

### Unreal Engine

- **Unreal Insights** - Comprehensive profiling
- **Stat Commands** - Runtime statistics
- **GPU Visualizer** - GPU timing breakdown
- **Memory Report** - Allocation tracking

### Godot

- **Debugger** - Built-in profiler
- **Monitors** - Real-time metrics
- **Remote Debugger** - Profile on device

### Platform Tools

- **PIX** (Xbox/Windows) - GPU debugging
- **RenderDoc** - GPU capture and replay
- **Instruments** (iOS/macOS) - Apple profiling
- **Android Profiler** - Android Studio tools

## Performance Testing Process

### 1. Establish Baselines

- Profile on target hardware
- Record key metrics
- Create benchmark scenes

### 2. Set Budgets

- Define frame time budgets per system
- Set memory limits
- Establish load time targets

### 3. Monitor Continuously

- Integrate profiling in CI
- Track metrics over time
- Alert on regressions

### 4. Optimize When Needed

- Profile before optimizing
- Target biggest bottlenecks
- Verify improvements

## Common Performance Issues

### CPU Bottlenecks

| Issue                 | Symptoms          | Solution                          |
| --------------------- | ----------------- | --------------------------------- |
| Too many game objects | Slow update loop  | Object pooling, LOD               |
| Expensive AI          | Spiky frame times | Budget AI, spread over frames     |
| Physics overload      | Physics spikes    | Simplify colliders, reduce bodies |
| GC stutter            | Regular hitches   | Avoid runtime allocations         |

### GPU Bottlenecks

| Issue               | Symptoms          | Solution                         |
| ------------------- | ----------------- | -------------------------------- |
| Overdraw            | Fill rate limited | Occlusion culling, reduce layers |
| Too many draw calls | CPU-GPU bound     | Batching, instancing, atlasing   |
| Shader complexity   | Long GPU times    | Simplify shaders, LOD            |
| Resolution too high | Fill rate limited | Dynamic resolution, FSR/DLSS     |

### Memory Issues

| Issue         | Symptoms          | Solution                     |
| ------------- | ----------------- | ---------------------------- |
| Texture bloat | High VRAM         | Compress, mipmap, stream     |
| Leaks         | Growing memory    | Track allocations, fix leaks |
| Fragmentation | OOM despite space | Pool allocations, defrag     |

## Benchmark Scenes

Create standardized test scenarios:

### Stress Test Scene

- Maximum entities on screen
- Complex visual effects
- Worst-case for performance

### Typical Gameplay Scene

- Representative of normal play
- Average entity count
- Baseline for comparison

### Isolated System Tests

- Combat only (no rendering)
- Rendering only (no game logic)
- AI only (pathfinding stress)

## Automated Performance Testing

### CI Integration

```yaml
# Example: Fail build if frame time exceeds budget
performance_test:
  script:
    - run_benchmark --scene stress_test
    - check_metrics --max-frame-time 16.67ms --max-memory 2GB
  artifacts:
    - performance_report.json
```

### Regression Detection

- Compare against previous builds
- Alert on significant changes (>10%)
- Track trends over time

## Platform-Specific Considerations

### Console

- Fixed hardware targets
- Strict certification requirements
- Thermal throttling concerns

### PC

- Wide hardware range
- Scalable quality settings
- Min/recommended specs

### Mobile

- Thermal throttling
- Battery impact
- Memory constraints
- Background app pressure

## Performance Testing Checklist

### Before Release

- [ ] Profiled on all target platforms
- [ ] Frame rate targets met
- [ ] No memory leaks
- [ ] Load times acceptable
- [ ] No GC stutters in gameplay
- [ ] Thermal tests passed (mobile/console)
- [ ] Certification requirements met

### Ongoing

- [ ] Performance tracked in CI
- [ ] Regression alerts configured
- [ ] Benchmark scenes maintained
- [ ] Budgets documented and enforced
