# Game Development Change Navigation Checklist (Godot)

**Purpose:** To systematically guide the Game SM agent and user through analysis and planning when a significant change (performance issue, platform constraint, technical blocker, gameplay feedback) is identified during Godot game development.

**Instructions:** Review each item with the user. Mark `[x]` for completed/confirmed, `[N/A]` if not applicable, or add notes for discussion points.

[[LLM: INITIALIZATION INSTRUCTIONS - GAME CHANGE NAVIGATION

Changes during game development are common - performance issues, platform constraints, gameplay feedback, and technical limitations are part of the process.

Before proceeding, understand:

1. This checklist is for SIGNIFICANT changes affecting game architecture or features
2. Minor tweaks (shader adjustments, UI positioning) don't require this process
3. The goal is to maintain playability while adapting to technical realities
4. Performance (60+ FPS) and player experience are paramount
5. Consider both GDScript and C# implementation options

Required context:

- The triggering issue (performance metrics, crash logs, feedback)
- Current development state (implemented features, current sprint)
- Access to GDD, technical specs, and performance budgets
- Understanding of remaining features and milestones
- Current language usage (GDScript vs C#) per system

APPROACH:
This is an interactive process. Discuss performance implications, platform constraints, and player impact. The user makes final decisions, but provide expert Godot/game dev guidance.

REMEMBER: Game development is iterative. Changes often lead to better gameplay and performance.]]

---

## 1. Understand the Trigger & Context

[[LLM: Start by understanding the game-specific issue. Ask technical questions:

- What performance metrics triggered this? (FPS, frame time, memory)
- Is this platform-specific or universal?
- Can we reproduce it consistently?
- What Godot profiler data do we have?
- Is this a GDScript performance issue that C# could solve?
- Are we hitting Godot engine limits?

Focus on measurable impacts and technical specifics.]]

- [ ] **Identify Triggering Element:** Clearly identify the game feature/system revealing the issue.
- [ ] **Define the Issue:** Articulate the core problem precisely.
  - [ ] Performance bottleneck (CPU/GPU/Memory)?
  - [ ] Draw call or batching issue?
  - [ ] Platform-specific limitation?
  - [ ] Godot engine constraint?
  - [ ] GDScript vs C# performance difference?
  - [ ] Node tree complexity issue?
  - [ ] Signal overhead problem?
  - [ ] Physics engine bottleneck?
  - [ ] Gameplay/balance issue from playtesting?
  - [ ] Asset import or resource loading problem?
  - [ ] Export template or platform issue?
- [ ] **Assess Performance Impact:** Document specific metrics (current FPS, target 60+ FPS, frame time ms, draw calls, memory usage).
- [ ] **Gather Technical Evidence:** Note Godot profiler data, performance monitor stats, platform test results, player feedback.

## 2. Game Feature Impact Assessment

[[LLM: Game features are interconnected in Godot's node system. Evaluate systematically:

1. Can we optimize the current feature without changing gameplay?
2. Should this system move from GDScript to C#?
3. Do dependent scenes/nodes need adjustment?
4. Are there Godot-specific optimizations available?
5. Does this affect our performance budget allocation?

Consider both technical and gameplay impacts.]]

- [ ] **Analyze Current Sprint Features:**
  - [ ] Can the current feature be optimized?
    - [ ] Object pooling for frequently instantiated nodes?
    - [ ] LOD system implementation?
    - [ ] Draw call batching improvements?
    - [ ] Move hot code from GDScript to C#?
    - [ ] Static typing in GDScript for performance?
  - [ ] Does it need gameplay simplification?
  - [ ] Should it be platform-specific (high-end only)?
- [ ] **Analyze Dependent Systems:**
  - [ ] Review all scenes and nodes interacting with the affected feature.
  - [ ] Do physics bodies need optimization?
  - [ ] Are Control nodes/UI systems impacted?
  - [ ] Do Resource save/load systems require changes?
  - [ ] Are multiplayer RPCs affected?
  - [ ] Do signal connections need optimization?
- [ ] **Language Migration Assessment:**
  - [ ] Would moving this system to C# improve performance?
  - [ ] What's the interop overhead if we split languages?
  - [ ] Can we maintain rapid iteration with C#?
- [ ] **Summarize Feature Impact:** Document effects on node hierarchy, scene structure, and technical architecture.

## 3. Game Artifact Conflict & Impact Analysis

[[LLM: Game documentation drives development. Check each artifact:

1. Does this invalidate GDD mechanics?
2. Are technical architecture assumptions still valid?
3. Do performance budgets need reallocation?
4. Are platform requirements still achievable?
5. Does our language strategy (GDScript/C#) need revision?

Missing conflicts cause performance issues later.]]

- [ ] **Review GDD:**
  - [ ] Does the issue conflict with core gameplay mechanics?
  - [ ] Do game features need scaling for performance?
  - [ ] Are progression systems affected?
  - [ ] Do balance parameters need adjustment?
- [ ] **Review Technical Architecture:**
  - [ ] Does the issue conflict with Godot architecture (scene structure, node hierarchy)?
  - [ ] Are autoload/singleton systems impacted?
  - [ ] Do shader/rendering approaches need revision?
  - [ ] Are Resource structures optimal for the scale?
  - [ ] Is the GDScript/C# split still appropriate?
- [ ] **Review Performance Specifications:**
  - [ ] Are target framerates (60+ FPS) still achievable?
  - [ ] Do memory budgets need reallocation?
  - [ ] Are load time targets realistic?
  - [ ] Do we need platform-specific targets?
  - [ ] Are draw call budgets exceeded?
- [ ] **Review Asset Specifications:**
  - [ ] Do texture import settings need adjustment?
  - [ ] Are mesh instance counts appropriate?
  - [ ] Do audio bus configurations need changes?
  - [ ] Is the animation tree complexity sustainable?
  - [ ] Are particle system limits appropriate?
- [ ] **Summarize Artifact Impact:** List all game documents requiring updates.

## 4. Path Forward Evaluation

[[LLM: Present Godot-specific solutions with technical trade-offs:

1. What's the performance gain (FPS improvement)?
2. How much rework is required?
3. What's the player experience impact?
4. Are there platform-specific solutions?
5. Should we migrate systems from GDScript to C#?
6. Can we leverage Godot 4.x features if on 3.x?

Be specific about Godot implementation details.]]

- [ ] **Option 1: Optimization Within Current Design:**
  - [ ] Can performance be improved through Godot optimizations?
    - [ ] Object pooling with node reuse?
    - [ ] MultiMesh for instancing?
    - [ ] Viewport optimization?
    - [ ] Occlusion culling setup?
    - [ ] Static typing in GDScript?
    - [ ] Batch draw calls with CanvasItem?
    - [ ] Optimize signal connections?
    - [ ] Reduce node tree depth?
  - [ ] Define specific optimization techniques.
  - [ ] Estimate performance improvement potential.
- [ ] **Option 2: Language Migration:**
  - [ ] Would moving to C# provide needed performance?
  - [ ] Identify hot paths for C# conversion.
  - [ ] Define interop boundaries.
  - [ ] Assess development velocity impact.
- [ ] **Option 3: Feature Scaling/Simplification:**
  - [ ] Can the feature be simplified while maintaining fun?
  - [ ] Identify specific elements to scale down.
  - [ ] Define platform-specific variations.
  - [ ] Assess player experience impact.
- [ ] **Option 4: Architecture Refactor:**
  - [ ] Would restructuring improve performance significantly?
  - [ ] Identify Godot-specific refactoring needs:
    - [ ] Scene composition changes?
    - [ ] Node hierarchy optimization?
    - [ ] Signal system redesign?
    - [ ] Autoload restructuring?
    - [ ] Resource management improvements?
  - [ ] Estimate development effort.
- [ ] **Option 5: Scope Adjustment:**
  - [ ] Can we defer features to post-launch?
  - [ ] Should certain features be platform-exclusive?
  - [ ] Do we need to adjust milestone deliverables?
- [ ] **Select Recommended Path:** Choose based on performance gain vs. effort.

## 5. Game Development Change Proposal Components

[[LLM: The proposal must include technical specifics:

1. Performance metrics (before/after projections with FPS targets)
2. Godot implementation details (nodes, scenes, scripts)
3. Language strategy (GDScript vs C# per system)
4. Platform-specific considerations
5. Testing requirements (GUT for GDScript, GoDotTest for C#)
6. Risk mitigation strategies

Make it actionable for game developers.]]

(Ensure all points from previous sections are captured)

- [ ] **Technical Issue Summary:** Performance/technical problem with metrics.
- [ ] **Feature Impact Summary:** Affected nodes, scenes, and systems.
- [ ] **Performance Projections:** Expected improvements from chosen solution (target 60+ FPS).
- [ ] **Implementation Plan:** Godot-specific technical approach.
  - [ ] Node hierarchy changes
  - [ ] Scene restructuring needs
  - [ ] Script migration (GDScript to C#)
  - [ ] Resource optimization
  - [ ] Signal flow improvements
- [ ] **Platform Considerations:** Any platform-specific implementations.
- [ ] **Testing Strategy:**
  - [ ] GUT tests for GDScript changes
  - [ ] GoDotTest for C# changes
  - [ ] Performance benchmarks
  - [ ] Platform validation approach
- [ ] **Risk Assessment:** Technical risks and mitigation plans.
- [ ] **Updated Game Stories:** Revised stories with technical constraints.

## 6. Final Review & Handoff

[[LLM: Game changes require technical validation. Before concluding:

1. Are performance targets (60+ FPS) clearly defined?
2. Is the Godot implementation approach clear?
3. Is the language strategy (GDScript/C#) documented?
4. Do we have rollback strategies?
5. Are test scenarios defined for both languages?
6. Is platform testing covered?

Get explicit approval on technical approach.

FINAL REPORT:
Provide a technical summary:

- Performance issue and root cause
- Chosen solution with expected FPS gains
- Implementation approach in Godot (nodes, scenes, languages)
- GDScript vs C# decisions and rationale
- Testing and validation plan (GUT/GoDotTest)
- Timeline and milestone impacts

Keep it technically precise and actionable.]]

- [ ] **Review Checklist:** Confirm all technical aspects discussed.
- [ ] **Review Change Proposal:** Ensure Godot implementation details are clear.
- [ ] **Language Strategy:** Confirm GDScript vs C# decisions documented.
- [ ] **Performance Validation:** Define how we'll measure success (profiler metrics).
- [ ] **Test Coverage:** Ensure both GUT and GoDotTest coverage planned.
- [ ] **User Approval:** Obtain approval for technical approach.
- [ ] **Developer Handoff:** Ensure game-dev agent has all technical details needed.

---
