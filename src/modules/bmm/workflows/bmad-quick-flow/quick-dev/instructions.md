# Quick-Dev - Flexible Development Workflow

<workflow>

<critical>Communicate in {communication_language}, tailored to {user_skill_level}</critical>
<critical>Execute continuously until COMPLETE - do not stop for milestones</critical>
<critical>Flexible - handles tech-specs OR direct instructions</critical>
<critical>ALWAYS respect {project_context} if it exists - it defines project standards</critical>

<checkpoint-handlers>
  <on-select key="a">Load and execute {advanced_elicitation}, then return</on-select>
  <on-select key="p">Load and execute {party_mode_workflow}, then return</on-select>
  <on-select key="t">Load and execute {create_tech_spec_workflow}</on-select>
</checkpoint-handlers>

<step n="1" goal="Load project context and determine execution mode">

<action>Check if {project_context} exists. If yes, load it - this is your foundational reference for ALL implementation decisions (patterns, conventions, architecture).</action>

<action>Parse user input:

**Mode A: Tech-Spec** - e.g., `quick-dev tech-spec-auth.md`
→ Load spec, extract tasks/context/AC, goto step 3

**Mode B: Direct Instructions** - e.g., `refactor src/foo.ts...`
→ Offer planning choice
</action>

<check if="Mode A">
  <action>Load tech-spec, extract tasks/context/AC</action>
  <goto>step_3</goto>
</check>

<check if="Mode B">
  <ask>**[t] Plan first** - Create tech-spec then implement
**[e] Execute directly** - Start now</ask>

  <check if="t">
    <action>Load and execute {create_tech_spec_workflow}</action>
    <action>Continue to implementation after spec complete</action>
  </check>

  <check if="e">
    <ask>Any additional guidance before I begin? (patterns, files, constraints) Or "go" to start.</ask>
    <goto>step_2</goto>
  </check>
</check>

</step>

<step n="2" goal="Quick context gathering (direct mode)">

<action>Identify files to modify, find relevant patterns, note dependencies</action>

<action>Create mental plan: tasks, acceptance criteria, files to touch</action>

</step>

<step n="3" goal="Execute implementation" id="step_3">

<action>For each task:

1. **Load Context** - read files from spec or relevant to change
2. **Implement** - follow patterns, handle errors, follow conventions
3. **Test** - write tests, run existing tests, verify AC
4. **Mark Complete** - check off task [x], continue
   </action>

<action if="3 failures">HALT and request guidance</action>
<action if="tests fail">Fix before continuing</action>

<critical>Continue through ALL tasks without stopping</critical>

</step>

<step n="4" goal="Verify and complete">

<action>Verify: all tasks [x], tests passing, AC satisfied, patterns followed</action>

<check if="using tech-spec">
  <action>Update tech-spec status to "Completed", mark all tasks [x]</action>
</check>

<output>**Implementation Complete!**

**Summary:** {{implementation_summary}}
**Files Modified:** {{files_list}}
**Tests:** {{test_summary}}
**AC Status:** {{ac_status}}

---

**Before committing (Recommended): Copy this code review prompt to a different LLM**

```
You are a cynical, jaded code reviewer with zero patience for sloppy work. These uncommitted changes were submitted by a clueless weasel and you expect to find problems. Find at least five issues to fix or improve in it. Number them. Be skeptical of everything.
```

</output>

<action>You must explain what was implemented based on {user_skill_level}</action>

</step>

</workflow>
