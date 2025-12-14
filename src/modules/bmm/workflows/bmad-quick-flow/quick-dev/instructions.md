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

<action>Record current HEAD as baseline for later review. Run `git rev-parse HEAD` and store the result as {baseline_commit}.</action>

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

  <!-- Escalation Threshold: Lightweight check - should we invoke scale-adaptive? -->

<action>Evaluate escalation threshold against user input (minimal tokens, no file loading):

**Triggers escalation** (if 2+ signals present):

- Multiple components mentioned (e.g., dashboard + api + database)
- System-level language (e.g., platform, integration, architecture)
- Uncertainty about approach (e.g., "how should I", "best way to")
- Multi-layer scope (e.g., UI + backend + data together)
- Extended timeframe (e.g., "this week", "over the next few days")

**Reduces signal:**

- Simplicity markers (e.g., "just", "quickly", "fix", "bug", "typo", "simple", "basic", "minor")
- Single file/component focus
- Confident, specific request

Use holistic judgment, not mechanical keyword matching.</action>

  <!-- No Escalation: Simple request, offer existing choice -->
  <check if="escalation threshold NOT triggered">
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

  <!-- Escalation Triggered: Load scale-adaptive and evaluate level -->
  <check if="escalation threshold triggered">
    <action>Load {project_levels} and evaluate user input against detection_hints.keywords</action>
    <action>Determine level (0-4) using scale-adaptive definitions</action>

    <!-- Level 0: Scale-adaptive confirms simple, fall back to standard choice -->
    <check if="level 0">
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

    <check if="level 1 or 2 or couldn't determine level">
      <ask>This looks like a focused feature with multiple components.

**[t] Create tech-spec first** (recommended)
**[w] Seems bigger than quick-dev** — see what BMad Method recommends (workflow-init)
**[e] Execute directly**</ask>

      <check if="t">
        <action>Load and execute {create_tech_spec_workflow}</action>
        <action>Continue to implementation after spec complete</action>
      </check>

      <check if="w">
        <action>Load and execute {workflow_init}</action>
        <action>EXIT quick-dev - user has been routed to BMad Method</action>
      </check>

      <check if="e">
        <ask>Any additional guidance before I begin? (patterns, files, constraints) Or "go" to start.</ask>
        <goto>step_2</goto>
      </check>
    </check>

    <!-- Level 3+: BMad Method territory, recommend workflow-init -->
    <check if="level 3 or higher">
      <ask>This sounds like platform/system work.

**[w] Start BMad Method** (recommended) (workflow-init)
**[t] Create tech-spec** (lighter planning)
**[e] Execute directly** - feeling lucky</ask>

      <check if="w">
        <action>Load and execute {workflow_init}</action>
        <action>EXIT quick-dev - user has been routed to BMad Method</action>
      </check>

      <check if="t">
        <action>Load and execute {create_tech_spec_workflow}</action>
        <action>Continue to implementation after spec complete</action>
      </check>

      <check if="e">
        <ask>Any additional guidance before I begin? (patterns, files, constraints) Or "go" to start.</ask>
        <goto>step_2</goto>
      </check>
    </check>

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

<step n="4" goal="Verify and transition to review">

<action>Verify: all tasks [x], tests passing, AC satisfied, patterns followed</action>

<check if="using tech-spec">
  <action>Update tech-spec status to "Completed", mark all tasks [x]</action>
</check>

<output>**Implementation Complete!**

**Summary:** {{implementation_summary}}
**Files Modified:** {{files_list}}
**Tests:** {{test_summary}}
**AC Status:** {{ac_status}}

Running adversarial code review...
</output>

<action>Proceed immediately to step 5</action>

</step>

<step n="5" goal="Adversarial code review (automatic)">

<action>Construct diff of all changes since workflow started and capture as {diff_output}:

**Tracked file changes:**

```bash
git diff {baseline_commit}
```

**New files created by this workflow:**
Only include untracked files that YOU actually created during steps 2-4. Do not include pre-existing untracked files. For each new file you created, include its full content as a "new file" addition.

Combine both into {diff_output} for review. Do NOT `git add` anything - this is read-only inspection.</action>

<action>Execute adversarial review using this hierarchy (try in order until one succeeds):

1. **Spawn subagent** (preferred) - pass the diff output along with this prompt:

   ```
   You are a cynical, jaded code reviewer with zero patience for sloppy work. This diff was submitted by a clueless weasel and you expect to find problems. Find at least five issues to fix or improve. Number them. Be skeptical of everything.

   <diff>
   {diff_output}
   </diff>
   ```

2. **CLI fallback** - pipe diff to `claude --print` with same prompt

3. **Inline self-review** - Review the diff output yourself using the cynical reviewer persona above
   </action>

<check if="zero findings returned">
  <action>HALT - Zero findings is suspicious. Adversarial review should always find something. Request user guidance.</action>
</check>

<action>Process findings:

- Assign IDs: F1, F2, F3...
- Assign severity: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low
- Classify each: **real** (confirmed issue) | **noise** (false positive) | **uncertain** (needs discussion)
  </action>

<output>**Adversarial Review Findings**

| ID  | Severity | Classification | Finding |
| --- | -------- | -------------- | ------- |
| F1  | 🟠       | real           | ...     |
| F2  | 🟡       | noise          | ...     |
| ... |

</output>

<ask>How would you like to handle these findings?

**[1] Walk through** - Discuss each finding individually
**[2] Auto-fix** - Automatically fix issues classified as "real"
**[3] Skip** - Acknowledge and proceed to commit</ask>

<check if="1">
  <action>Present each finding one by one. For each, ask: fix now / skip / discuss</action>
  <action>Apply fixes as approved</action>
</check>

<check if="2">
  <action>Automatically fix all findings classified as "real"</action>
  <action>Report what was fixed</action>
</check>

<check if="3">
  <action>Acknowledge findings were reviewed and user chose to skip</action>
</check>

<output>**Review complete. Ready to commit.**</output>

<action>Explain what was implemented based on {user_skill_level}</action>

</step>

</workflow>
