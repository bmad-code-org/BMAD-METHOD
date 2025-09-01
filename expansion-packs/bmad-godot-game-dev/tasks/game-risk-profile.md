<!-- Powered by BMAD™ Core -->

# game-risk-profile

Generate a comprehensive risk assessment matrix for a Godot game story implementation using probability × impact analysis focused on game development challenges.

## Inputs

```yaml
required:
  - story_id: '{epic}.{story}' # e.g., "1.3"
  - story_path: 'docs/stories/{epic}.{story}.*.md'
  - story_title: '{title}' # If missing, derive from story file H1
  - story_slug: '{slug}' # If missing, derive from title (lowercase, hyphenated)
```

## Purpose

Identify, assess, and prioritize risks in Godot game feature implementation. Provide risk mitigation strategies and playtesting focus areas based on game development risk levels.

## Risk Assessment Framework

### Risk Categories

**Category Prefixes:**

- `TECH`: Technical/Engine Risks
- `PERF`: Performance/Optimization Risks
- `GAME`: Gameplay/Mechanics Risks
- `ART`: Art/Asset Pipeline Risks
- `PLAT`: Platform/Deployment Risks
- `PLAY`: Player Experience Risks

1. **Technical/Engine Risks (TECH)**
   - Godot version compatibility issues
   - GDScript/C# integration problems
   - Node tree architecture complexity
   - Signal connection failures
   - Plugin/addon conflicts
   - Memory leak in scene transitions

2. **Performance/Optimization Risks (PERF)**
   - Frame rate drops below 60 FPS
   - Draw call bottlenecks
   - Physics engine slowdowns
   - Particle system overload
   - Texture memory exhaustion
   - Shader compilation spikes

3. **Gameplay/Mechanics Risks (GAME)**
   - Game balance issues
   - Control responsiveness problems
   - Collision detection failures
   - AI behavior bugs
   - Progression breaking bugs
   - Save/load system corruption

4. **Art/Asset Pipeline Risks (ART)**
   - Asset import failures
   - Texture atlas overflow
   - Animation sync issues
   - Audio streaming problems
   - Font rendering issues
   - Sprite batching failures

5. **Platform/Deployment Risks (PLAT)**
   - Export template issues
   - Platform-specific bugs
   - Mobile performance degradation
   - Web build compatibility
   - Console certification failures
   - Steam/itch.io integration problems

6. **Player Experience Risks (PLAY)**
   - Tutorial unclear or broken
   - Difficulty curve too steep/shallow
   - Multiplayer desync issues
   - Achievements not triggering
   - Localization text overflow
   - Accessibility features missing

## Risk Analysis Process

### 1. Risk Identification

For each category, identify specific risks:

```yaml
risk:
  id: 'PERF-001' # Use prefixes: TECH, PERF, GAME, ART, PLAT, PLAY
  category: performance
  title: 'Particle system causing frame drops in boss battle'
  description: 'Multiple particle emitters active during boss fight drops FPS below 30'
  affected_components:
    - 'BossArena.tscn'
    - 'ParticleManager.gd'
    - 'BossAttackEffects'
  detection_method: 'Profiler showed 80% GPU usage on particles'
```

### 2. Risk Assessment

Evaluate each risk using probability × impact:

**Probability Levels:**

- `High (3)`: Likely to occur (>70% chance)
- `Medium (2)`: Possible occurrence (30-70% chance)
- `Low (1)`: Unlikely to occur (<30% chance)

**Impact Levels:**

- `High (3)`: Severe consequences (game unplayable, save corruption, platform rejection)
- `Medium (2)`: Moderate consequences (noticeable lag, minor bugs, progression issues)
- `Low (1)`: Minor consequences (visual glitches, UI issues, quality of life problems)

### Risk Score = Probability × Impact

- 9: Critical Risk (Red)
- 6: High Risk (Orange)
- 4: Medium Risk (Yellow)
- 2-3: Low Risk (Green)
- 1: Minimal Risk (Blue)

### 3. Risk Prioritization

Create risk matrix:

```markdown
## Risk Matrix

| Risk ID  | Description                  | Probability | Impact     | Score | Priority |
| -------- | ---------------------------- | ----------- | ---------- | ----- | -------- |
| GAME-001 | Boss fight progression block | High (3)    | High (3)   | 9     | Critical |
| PERF-001 | Particle FPS drops           | Medium (2)  | Medium (2) | 4     | Medium   |
| PLAT-001 | Mobile export crashes        | Low (1)     | High (3)   | 3     | Low      |
```

### 4. Risk Mitigation Strategies

For each identified risk, provide mitigation:

```yaml
mitigation:
  risk_id: 'PERF-001'
  strategy: 'preventive' # preventive|detective|corrective
  actions:
    - 'Implement particle pooling system'
    - 'Add LOD (Level of Detail) for particle effects'
    - 'Use GPU particles instead of CPU particles'
    - 'Limit max particle count per emitter'
  testing_requirements:
    - 'Performance profiling on min spec hardware'
    - 'Stress test with all effects active'
    - 'FPS monitoring during boss encounters'
  residual_risk: 'Low - May still drop to 45 FPS on very low-end devices'
  owner: 'game-dev'
  timeline: 'Before beta release'
```

## Outputs

### Output 1: Gate YAML Block

Generate for pasting into gate file under `risk_summary`:

**Output rules:**

- Only include assessed risks; do not emit placeholders
- Sort risks by score (desc) when emitting highest and any tabular lists
- If no risks: totals all zeros, omit highest, keep recommendations arrays empty

```yaml
# risk_summary (paste into gate file):
risk_summary:
  totals:
    critical: X # score 9
    high: Y # score 6
    medium: Z # score 4
    low: W # score 2-3
  highest:
    id: GAME-001
    score: 9
    title: 'Boss fight progression blocker'
  recommendations:
    must_fix:
      - 'Fix collision detection in boss arena'
    monitor:
      - 'Track FPS metrics during gameplay'
```

### Output 2: Markdown Report

**Save to:** `qa.qaLocation/assessments/{epic}.{story}-risk-{YYYYMMDD}.md`

```markdown
# Risk Profile: Story {epic}.{story}

Date: {date}
Reviewer: Linus (Test Architect)

## Executive Summary

- Total Risks Identified: X
- Critical Risks: Y
- High Risks: Z
- Risk Score: XX/100 (calculated)

## Critical Risks Requiring Immediate Attention

### 1. [ID]: Risk Title

**Score: 9 (Critical)**
**Probability**: High - Detailed reasoning
**Impact**: High - Potential consequences
**Mitigation**:

- Immediate action required
- Specific steps to take
  **Testing Focus**: Specific test scenarios needed

## Risk Distribution

### By Category

- Technical/Engine: X risks (Y critical)
- Performance: X risks (Y critical)
- Gameplay: X risks (Y critical)
- Art/Assets: X risks (Y critical)
- Platform: X risks (Y critical)
- Player Experience: X risks (Y critical)

### By Component

- Game Scenes: X risks
- Player Controller: X risks
- Enemy AI: X risks
- UI/Menus: X risks
- Audio System: X risks
- Save System: X risks

## Detailed Risk Register

[Full table of all risks with scores and mitigations]

## Risk-Based Testing Strategy

### Priority 1: Critical Risk Tests

- Playtesting scenarios for game-breaking bugs
- Performance testing on target platforms
- Save/load integrity testing
- Multiplayer stress testing (if applicable)

### Priority 2: High Risk Tests

- Integration test scenarios
- Edge case coverage

### Priority 3: Medium/Low Risk Tests

- Standard functional tests
- Regression test suite

## Risk Acceptance Criteria

### Must Fix Before Production

- All critical risks (score 9)
- High risks affecting security/data

### Can Deploy with Mitigation

- Medium risks with compensating controls
- Low risks with monitoring in place

### Accepted Risks

- Document any risks team accepts
- Include sign-off from appropriate authority

## Monitoring Requirements

Post-release monitoring for:

- Frame rate metrics and performance stats
- Crash reports and error logs
- Player progression analytics
- Achievement completion rates
- Player retention metrics

## Risk Review Triggers

Review and update risk profile when:

- Major gameplay mechanics added
- New platforms targeted
- Godot engine version upgraded
- Performance issues reported by playtesters
- Art style or asset pipeline changes
- Multiplayer features added
```

## Risk Scoring Algorithm

Calculate overall story risk score:

```text
Base Score = 100
For each risk:
  - Critical (9): Deduct 20 points
  - High (6): Deduct 10 points
  - Medium (4): Deduct 5 points
  - Low (2-3): Deduct 2 points

Minimum score = 0 (extremely risky)
Maximum score = 100 (minimal risk)
```

## Risk-Based Recommendations

Based on risk profile, recommend:

1. **Testing Priority**
   - Which tests to run first
   - Additional test types needed
   - Test environment requirements

2. **Development Focus**
   - Code review emphasis areas
   - Additional validation needed
   - Security controls to implement

3. **Deployment Strategy**
   - Phased rollout for high-risk changes
   - Feature flags for risky features
   - Rollback procedures

4. **Monitoring Setup**
   - Metrics to track
   - Alerts to configure
   - Dashboard requirements

## Integration with Quality Gates

**Deterministic gate mapping:**

- Any risk with score ≥ 9 → Gate = FAIL (unless waived)
- Else if any score ≥ 6 → Gate = CONCERNS
- Else → Gate = PASS
- Unmitigated risks → Document in gate

### Output 3: Story Hook Line

**Print this line for review task to quote:**

```text
Risk profile: qa.qaLocation/assessments/{epic}.{story}-risk-{YYYYMMDD}.md
```

## Key Principles

- Identify risks early and systematically
- Use consistent probability × impact scoring
- Provide actionable mitigation strategies
- Link risks to specific test requirements
- Track residual risk after mitigation
- Update risk profile as story evolves
