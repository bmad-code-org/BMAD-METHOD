<!-- Powered by BMAD™ Core -->

# Game Development Change Navigation Checklist

**Purpose:** To systematically guide the Game SM agent and user through analysis and planning when a significant change (performance issue, platform constraint, technical blocker, gameplay feedback) is identified during Unity game development.

**Instructions:** Review each item with the user. Mark `[x]` for completed/confirmed, `[N/A]` if not applicable, or add notes for discussion points.

[[LLM: INITIALIZATION INSTRUCTIONS - GAME CHANGE NAVIGATION

Changes during game development are common - performance issues, platform constraints, gameplay feedback, and technical limitations are part of the process.

Before proceeding, understand:

1. This checklist is for SIGNIFICANT changes affecting game architecture or features
2. Minor tweaks (shader adjustments, UI positioning) don't require this process
3. The goal is to maintain playability while adapting to technical realities
4. Performance and player experience are paramount

Required context:

- The triggering issue (performance metrics, crash logs, feedback)
- Current development state (implemented features, current sprint)
- Access to GDD, technical specs, and performance budgets
- Understanding of remaining features and milestones

APPROACH:
This is an interactive process. Discuss performance implications, platform constraints, and player impact. The user makes final decisions, but provide expert Unity/game dev guidance.

REMEMBER: Game development is iterative. Changes often lead to better gameplay and performance.]]

---

## 1. Understand the Trigger & Context

[[LLM: Start by understanding the game-specific issue. Ask technical questions:

- What performance metrics triggered this? (FPS, memory, load times)
- Is this platform-specific or universal?
- Can we reproduce it consistently?
- What Unity profiler data do we have?
- Is this a gameplay issue or technical constraint?

Focus on measurable impacts and technical specifics.]]

- [ ] **Identify Triggering Element:** Clearly identify the game feature/system revealing the issue.
- [ ] **Define the Issue:** Articulate the core problem precisely.
  - [ ] Performance bottleneck (CPU/GPU/Memory)?
  - [ ] Platform-specific limitation?
  - [ ] Unity engine constraint?
  - [ ] Gameplay/balance issue from playtesting?
  - [ ] Asset pipeline or build size problem?
  - [ ] Third-party SDK/plugin conflict?
- [ ] **Assess Performance Impact:** Document specific metrics (current FPS, target FPS, memory usage, build size).
- [ ] **Gather Technical Evidence:** Note profiler data, crash logs, platform test results, player feedback.

## 2. Game Feature Impact Assessment

[[LLM: Game features are interconnected. Evaluate systematically:

1. Can we optimize the current feature without changing gameplay?
2. Do dependent features need adjustment?
3. Are there platform-specific workarounds?
4. Does this affect our performance budget allocation?

Consider both technical and gameplay impacts.]]

- [ ] **Analyze Current Sprint Features:**
  - [ ] Can the current feature be optimized (LOD, pooling, batching)?
  - [ ] Does it need gameplay simplification?
  - [ ] Should it be platform-specific (high-end only)?
- [ ] **Analyze Dependent Systems:**
  - [ ] Review all game systems interacting with the affected feature.
  - [ ] Do physics systems need adjustment?
  - [ ] Are UI/HUD systems impacted?
  - [ ] Do save/load systems require changes?
  - [ ] Are multiplayer systems affected?
- [ ] **Summarize Feature Impact:** Document effects on gameplay systems and technical architecture.

## 3. Game Artifact Conflict & Impact Analysis

[[LLM: Game documentation drives development. Check each artifact:

1. Does this invalidate GDD mechanics?
2. Are technical architecture assumptions still valid?
3. Do performance budgets need reallocation?
4. Are platform requirements still achievable?

Missing conflicts cause performance issues later.]]

- [ ] **Review GDD:**
  - [ ] Does the issue conflict with core gameplay mechanics?
  - [ ] Do game features need scaling for performance?
  - [ ] Are progression systems affected?
  - [ ] Do balance parameters need adjustment?
- [ ] **Review Technical Architecture:**
  - [ ] Does the issue conflict with Unity architecture (scene structure, prefab hierarchy)?
  - [ ] Are component systems impacted?
  - [ ] Do shader/rendering approaches need revision?
  - [ ] Are data structures optimal for the scale?
- [ ] **Review Performance Specifications:**
  - [ ] Are target framerates still achievable?
  - [ ] Do memory budgets need reallocation?
  - [ ] Are load time targets realistic?
  - [ ] Do we need platform-specific targets?
- [ ] **Review Asset Specifications:**
  - [ ] Do texture resolutions need adjustment?
  - [ ] Are model poly counts appropriate?
  - [ ] Do audio compression settings need changes?
  - [ ] Is the animation budget sustainable?
- [ ] **Summarize Artifact Impact:** List all game documents requiring updates.

## 4. Path Forward Evaluation

[[LLM: Present game-specific solutions with technical trade-offs:

1. What's the performance gain?
2. How much rework is required?
3. What's the player experience impact?
4. Are there platform-specific solutions?
5. Is this maintainable across updates?

Be specific about Unity implementation details.]]

- [ ] **Option 1: Optimization Within Current Design:**
  - [ ] Can performance be improved through Unity optimizations?
    - [ ] Object pooling implementation?
    - [ ] LOD system addition?
    - [ ] Texture atlasing?
    - [ ] Draw call batching?
    - [ ] Shader optimization?
  - [ ] Define specific optimization techniques.
  - [ ] Estimate performance improvement potential.
- [ ] **Option 2: Feature Scaling/Simplification:**
  - [ ] Can the feature be simplified while maintaining fun?
  - [ ] Identify specific elements to scale down.
  - [ ] Define platform-specific variations.
  - [ ] Assess player experience impact.
- [ ] **Option 3: Architecture Refactor:**
  - [ ] Would restructuring improve performance significantly?
  - [ ] Identify Unity-specific refactoring needs:
    - [ ] Scene organization changes?
    - [ ] Prefab structure optimization?
    - [ ] Component system redesign?
    - [ ] State machine optimization?
  - [ ] Estimate development effort.
- [ ] **Option 4: Scope Adjustment:**
  - [ ] Can we defer features to post-launch?
  - [ ] Should certain features be platform-exclusive?
  - [ ] Do we need to adjust milestone deliverables?
- [ ] **Select Recommended Path:** Choose based on performance gain vs. effort.

## 5. Game Development Change Proposal Components

[[LLM: The proposal must include technical specifics:

1. Performance metrics (before/after projections)
2. Unity implementation details
3. Platform-specific considerations
4. Testing requirements
5. Risk mitigation strategies

Make it actionable for game developers.]]

(Ensure all points from previous sections are captured)

- [ ] **Technical Issue Summary:** Performance/technical problem with metrics.
- [ ] **Feature Impact Summary:** Affected game systems and dependencies.
- [ ] **Performance Projections:** Expected improvements from chosen solution.
- [ ] **Implementation Plan:** Unity-specific technical approach.
- [ ] **Platform Considerations:** Any platform-specific implementations.
- [ ] **Testing Strategy:** Performance benchmarks and validation approach.
- [ ] **Risk Assessment:** Technical risks and mitigation plans.
- [ ] **Updated Game Stories:** Revised stories with technical constraints.

## 6. Final Review & Handoff

[[LLM: Game changes require technical validation. Before concluding:

1. Are performance targets clearly defined?
2. Is the Unity implementation approach clear?
3. Do we have rollback strategies?
4. Are test scenarios defined?
5. Is platform testing covered?

Get explicit approval on technical approach.

FINAL REPORT:
Provide a technical summary:

- Performance issue and root cause
- Chosen solution with expected gains
- Implementation approach in Unity
- Testing and validation plan
- Timeline and milestone impacts

Keep it technically precise and actionable.]]

- [ ] **Review Checklist:** Confirm all technical aspects discussed.
- [ ] **Review Change Proposal:** Ensure Unity implementation details are clear.
- [ ] **Performance Validation:** Define how we'll measure success.
- [ ] **User Approval:** Obtain approval for technical approach.
- [ ] **Developer Handoff:** Ensure game-dev agent has all technical details needed.

---
