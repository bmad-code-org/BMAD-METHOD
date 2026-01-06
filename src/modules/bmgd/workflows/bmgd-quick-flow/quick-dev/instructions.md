# Quick-Dev - Flexible Game Development Workflow

<workflow>

<critical>Communicate in {communication_language}, tailored to {user_skill_level}</critical>
<critical>Execute continuously until COMPLETE - do not stop for milestones</critical>
<critical>Game-specific: Consider performance (60fps), feel, and player experience</critical>
<critical>ALWAYS respect {project_context} if it exists - it defines project standards</critical>

<checkpoint-handlers>
  <on-select key="a">Load and execute {advanced_elicitation}, then return</on-select>
  <on-select key="p">Load and execute {party_mode_exec}, then return</on-select>
  <on-select key="r">Load and execute {quick_prototype_workflow}</on-select>
</checkpoint-handlers>

<step n="1" goal="Load context and determine execution mode">

<action>Check if {project_context} exists. If yes, load it - this is your foundational reference for ALL implementation decisions (patterns, conventions, architecture).</action>

<action>Parse user input:

**Mode A: Tech-Spec** - e.g., `quick-dev tech-spec-combat.md`
→ Load spec, extract tasks/context/AC, goto step 3

**Mode B: Direct Instructions** - e.g., `implement player jump...`
→ Evaluate complexity, offer planning choice

**Mode C: Prototype Reference** - e.g., `quick-dev from prototype...`
→ Load prototype code, productionize
</action>

<check if="Mode A">
  <action>Load tech-spec, extract tasks/context/AC</action>
  <goto>step_3</goto>
</check>

<check if="Mode C">
  <action>Load prototype reference, identify production requirements</action>
  <goto>step_2</goto>
</check>

<check if="Mode B">

<action>Evaluate complexity against game development signals:

**Triggers planning** (if 2+ signals present):

- Multiple game systems (e.g., combat + inventory + UI)
- Performance-critical code (e.g., game loop, rendering, physics)
- Cross-platform considerations
- Multiplayer/networking
- Save system integration

**Simple enough for direct execution:**

- Single mechanic adjustment
- UI tweak
- Bug fix
- Asset integration
- Config/balance change
</action>

  <check if="complex task">
    <ask>This looks like a significant game feature.

**[t] Plan first** - Create tech-spec then implement (recommended)
**[r] Prototype first** - Test the idea before committing
**[w] Use full BMGD workflow** - For larger features
**[e] Execute directly** - Start implementation now</ask>

    <check if="t">
      <action>Create lightweight tech-spec with tasks and AC</action>
      <goto>step_3</goto>
    </check>

    <check if="r">
      <action>Load and execute {quick_prototype_workflow}</action>
      <action>Return here after prototype complete</action>
    </check>

    <check if="w">
      <action>Load and execute {workflow_init}</action>
      <action>EXIT quick-dev - user routed to full workflow</action>
    </check>

    <check if="e">
      <goto>step_2</goto>
    </check>

  </check>

  <check if="simple task">
    <ask>**[e] Execute directly** - Start now
**[t] Quick plan** - Brief task breakdown first</ask>

    <check if="e">
      <goto>step_2</goto>
    </check>

    <check if="t">
      <action>Create quick task list</action>
      <goto>step_3</goto>
    </check>

  </check>

</check>

</step>

<step n="2" goal="Quick context gathering">

<action>Identify scope:

- Files to modify
- Game systems affected
- Performance considerations
- Existing patterns to follow
  </action>

<action>Create mental plan:

- Tasks to complete
- Acceptance criteria
- Test approach (manual playtest, unit tests, etc.)
  </action>

</step>

<step n="3" goal="Execute implementation" id="step_3">

<action>For each task:

1. **Load Context** - Read relevant files, understand integration points
2. **Implement** - Follow patterns, consider performance, handle edge cases
3. **Test** - Run game, verify behavior, check frame rate impact
4. **Mark Complete** - Check off task [x], continue
   </action>

<action>Game-specific checks during implementation:

**Performance:**

- Avoid allocations in hot paths
- Use object pooling where appropriate
- Profile if frame time increases

**Feel:**

- Test input responsiveness
- Verify visual/audio feedback
- Check timing and pacing

**Integration:**

- Verify save/load compatibility
- Check multiplayer sync (if applicable)
- Test on target platform
  </action>

<action if="3 failures">HALT and request guidance</action>
<action if="tests fail">Fix before continuing</action>
<action if="frame rate drops">Profile and optimize before continuing</action>

<critical>Continue through ALL tasks without stopping</critical>

</step>

<step n="4" goal="Verify and complete">

<action>Verify completion:

- All tasks [x]
- Game runs without errors
- Feature works as specified
- Performance acceptable (target frame rate maintained)
- Patterns followed
  </action>

<check if="using tech-spec">
  <action>Update tech-spec status to "Completed", mark all tasks [x]</action>
</check>

<output>**Implementation Complete!**

**Summary:** {{implementation_summary}}
**Files Modified:** {{files_list}}
**Tests:** {{test_summary}}
**Performance:** {{performance_notes}}
**AC Status:** {{ac_status}}

---

**Recommended: Playtest the changes**

Run the game and verify:

- Feature works as expected
- No regressions in related systems
- Performance is acceptable
- Feel is right

**Before committing: Consider a code review**

```
You are a senior game developer reviewing code for a game project. These changes were just implemented. Look for:
1. Performance issues (allocations in loops, unnecessary calculations)
2. Game feel problems (timing, feedback, responsiveness)
3. Integration issues (save system, multiplayer, platform)
4. Code quality (patterns, readability, maintainability)
Find at least 3 issues or improvements.
```

</output>

<action>Explain what was implemented based on {user_skill_level}</action>

</step>

</workflow>
