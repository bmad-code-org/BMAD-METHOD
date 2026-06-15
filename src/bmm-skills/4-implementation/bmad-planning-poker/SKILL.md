---
name: bmad-planning-poker
description: 'Collaborative story point estimation with AI agents. Use when the user says "planning poker", "estimate stories", or "plan poker"'
---

# Planning Poker Workflow

**Goal:** Facilitate collaborative story point estimation using AI agents as virtual team members with the human as a full participant. Hybrid: structured voting rounds with Party Mode debate when estimates diverge.

**Your Role:** You are a Planning Poker facilitator. Guide the estimation process, manage voting rounds, detect divergence, and trigger Party Mode debate when needed. The human is a voting participant, not just an observer.

## Conventions

- Bare paths resolve from the skill root.
- `{skill-root}` resolves to this skill's installed directory (where `customize.toml` lives).
- `{project-root}`-prefixed paths resolve from the project working directory.
- `{skill-name}` resolves to the skill directory's basename.

## On Activation

### Step 1: Resolve the Workflow Block

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`

**If the script fails**, resolve the `workflow` block yourself by reading these three files in base → team → user order and applying the same structural merge rules as the resolver:

1. `{skill-root}/customize.toml` — defaults
2. `{project-root}/_bmad/custom/{skill-name}.toml` — team overrides
3. `{project-root}/_bmad/custom/{skill-name}.user.toml` — personal overrides

Any missing file is skipped.

### Step 2: Execute Prepend Steps

Execute each entry in `{workflow.activation_steps_prepend}` in order before proceeding.

### Step 3: Load Persistent Facts

Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run.

### Step 4: Load Config

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `user_name`
- `communication_language`, `document_output_language`
- `implementation_artifacts`, `planning_artifacts`
- `date` as system-generated current datetime
- `project_context` = `**/project-context.md` (load if exists)
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Step 5: Greet the User

Greet `{user_name}`, speaking in `{communication_language}`.

### Step 6: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete.

## Paths

- `sprint_status_file` = `{implementation_artifacts}/sprint-status.yaml`
- `session_report_file` = `{implementation_artifacts}/planning-poker-{date}.md`
- `estimation_scale` = `{workflow.estimation_scale}` (default: fibonacci)
- `divergence_threshold` = `{workflow.divergence_threshold}` (default: 2.0)
- `max_rounds` = `{workflow.max_rounds}` (default: 3)
- `participating_agents` = `{workflow.participating_agents}`

## Input Files

| Input | Path | Load Strategy |
|-------|------|---------------|
| Sprint status | `{sprint_status_file}` | FULL_LOAD |

## Estimation Scales

### Fibonacci (default)
1, 2, 3, 5, 8, 13, 21 — use for relative effort estimation.

### T-shirt
XS, S, M, L, XL, XXL — use when effort is too uncertain for numbers.

### Linear
1, 2, 3, 4, 5, 6, 7, 8, 9, 10 — use when the team prefers absolute scale.

## Execution

<workflow>

<step n="1" goal="Discover unestimated stories">
<action>Load {project_context} for project-wide patterns and conventions (if exists)</action>
<action>Communicate in {communication_language} with {user_name}</action>

<action>Read the FULL file: {sprint_status_file}</action>
<check if="file not found">
  <output>No sprint-status.yaml found. Run sprint-planning first to generate it.</output>
  <action>Exit workflow</action>
</check>

<action>Parse the YAML. Look for the `development_status` section.</action>
<action>If a `story_points` section exists, skip any story that already has a story_points entry.</action>
<action>Collect all unestimated stories (keys matching `{epic_num}-{story_num}-{title}` pattern with no story_points entry).</action>
<action>Sort stories by epic number, then story number.</action>

<check if="no unestimated stories found">
  <output>All stories already estimated. If you need to re-estimate, delete or modify the story_points section in sprint-status.yaml first.</output>
  <action>Exit workflow</action>
</check>

<output>
**Stories to Estimate:** {{unestimated_count}}

{{#each unestimated_stories}}
- **{{key}}** — {{title}}
{{/each}}

**Scale:** {{estimation_scale}}
**Divergence threshold:** {{divergence_threshold}}x
**Participating agents:** {{participating_agents}}
**Human participant:** {{user_name}} (you)
</output>

<check if="unestimated_count > 15">
  <output>⚠️ Large backlog detected. Consider estimating only the top N stories (next sprint) or batching by epic.</output>
  <ask>Estimate all {{unestimated_count}} stories, limit to top-N by priority, or batch by epic? [all / top-N / epic / quit]</ask>
</check>
</step>

<step n="2" goal="Estimate each story">
<action>For each unestimated story in order:</action>

<substep n="2a" goal="Present the story">
<action>Display the story details:</action>
<output>
---
## Story {{story_key}}: {{story_title}}
{{story_description}}

**Acceptance Criteria:**
{{#each acceptance_criteria}}
- {{this}}
{{/each}}
---
</output>
</substep>

<substep n="2b" goal="Silent voting round">
<output>
🎴 **Silent Round** — Everyone estimates privately.

Valid values: {{scale_values}}

**{{user_name}}**, what is your estimate for this story?
</output>

<ask>Your estimate (or "?" if unsure / "skip" to skip this story):</ask>

<check if="user_input == 'skip'">
  <action>Mark story as skipped, continue to next story</action>
</check>

<check if="user_input == '?'">
  <action>Treat as "needs discussion" — estimate as "?" and proceed to reveal</action>
</check>

<action>Store human estimate as `{{human_estimate}}`</action>

<action>For each agent in {{participating_agents}}, load the agent's persona from `{project-root}/_bmad/core/config.yaml` agents section and ask them to estimate in character. Each agent gives ONLY their estimate and a 1-sentence reason. Agents do NOT see each other's estimates yet.</action>

<action>Collect agent estimates into `{{agent_estimates}}` map: `{agent_name: {estimate: value, reason: "..."}}`</action>
</substep>

<substep n="2c" goal="Reveal all estimates">
<output>
## Reveal — Story {{story_key}}

| Participant | Estimate |
|-------------|----------|
| **{{user_name}} (You)** | {{human_estimate}} |
{{#each agent_estimates}}
| {{name}} ({{title}}) | {{estimate}} |
{{/each}}

**Reasoning:**
{{#each agent_estimates}}
- **{{name}}:** {{reason}}
{{/each}}
</output>
</substep>

<substep n="2d" goal="Check for divergence">
<action>Find the max and min numeric estimates from {{all_estimates}} (exclude "?" values).</action>
<action>Calculate ratio: max_estimate / min_estimate</action>

<check if="any estimate is '?'">
  <action>Divergence is automatic — trigger debate to clarify.</action>
</check>

<check if="ratio > {{divergence_threshold}}">
  <output>
⚠️ **Divergence detected!**

Max estimate ({{max_estimate}}) is {{ratio}}x the min estimate ({{min_estimate}}).
Threshold: {{divergence_threshold}}x

**The outliers should explain their reasoning.**
</output>

  <action>Proceed to Party Debate (step 2e)</action>
</check>

<check if="ratio <= {{divergence_threshold}} AND no '?' estimates">
  <action>Skip debate — estimates are within acceptable range. Proceed to consensus (step 2f).</action>
</check>
</substep>

<substep n="2e" goal="Party Mode debate">
<action>If this is round > {{max_rounds}}, skip debate and go to PM tiebreak (step 2f).</action>

<output>
💬 **Entering debate mode.** The agents will discuss their estimates. You can challenge, agree, or push back on any point. This is your team talking — jump in anytime.

*Loading Party Mode...*
</output>

<action>Invoke the Party Mode skill (`bmad-party-mode`) context. Present the situation:</action>
<action>
- The story being estimated: {{story_key}}: {{story_title}} — {{story_description}}
- The current round's estimates: show all estimates
- The divergence: max ({{max_estimate}}) vs min ({{min_estimate}})
- Instruction: "These agents need to debate their estimates for this story. {{user_name}} is a participant. The high and low estimators should defend their positions. Goal: converge or clarify the disagreement."
- Only include the agents who gave the min and max estimates, plus {{user_name}} (human). Other agents can stay silent unless they have a relevant point.
</action>

<action>Run the Party Mode exchange (3-5 turns max for this debate). After the debate, summarize the key arguments made.</action>

<action>After debate, return to silent voting round (step 2b) for a re-vote. Increment round counter.</action>

<check if="round > {{max_rounds}}">
  <output>Maximum rounds reached ({{max_rounds}}). The PM will cast the final estimate.</output>
  <action>PM (John) reviews all debate arguments and casts the final estimate. Display it with reasoning.</action>
  <action>Set `{{consensus_estimate}}` = PM's estimate.</action>
  <action>Proceed to save (step 3).</action>
</check>
</substep>

<substep n="2f" goal="Reach consensus">
<check if="estimates converge naturally (ratio <= threshold AND no '?')">
  <output>
✅ **Consensus reached!**

Estimates cluster around: {{mode_estimate}}

| Participant | Final Estimate |
|-------------|---------------|
| **Consensus** | {{consensus_estimate}} |
</output>
  <action>Set `{{consensus_estimate}}` = the mode (most common) of all estimates, or the median if no mode.</action>
</check>

<action>Ask for final confirmation:</action>
<ask>The consensus estimate for **{{story_key}}** is **{{consensus_estimate}}**.
Accept this estimate? [y / n (provide your own) / skip]</ask>

<check if="user says 'n' with alternative">
  <action>Use user's alternative as `{{consensus_estimate}}`. The human has final authority.</action>
</check>

<check if="user says 'skip'">
  <action>Mark story as skipped. Continue to next story.</action>
</check>

<action>Store `{{consensus_estimate}}` with justification from the debate/discussion.</action>
</substep>

<step n="3" goal="Save estimation results">
<action>Update `{sprint_status_file}`:</action>

<action>Add a `story_points` section alongside `development_status` (do NOT modify `development_status`):</action>

```yaml
story_points:
  1-1-user-authentication: 5
  1-2-account-management: 8
```

<action>Each entry: story key → consensus estimate (number or t-shirt size string).</action>
<action>Do NOT overwrite existing story_points entries — only add new ones for stories estimated in this session.</action>

<output>
✅ **sprint-status.yaml updated** — {{newly_estimated_count}} stories estimated.
</output>
</step>

<step n="4" goal="Generate session report">
<action>Create `{{session_report_file}}` with full trace:</action>

```markdown
# Planning Poker Session — {{date}}

**Project:** {{project_name}}
**Scale:** {{estimation_scale}}
**Threshold:** {{divergence_threshold}}x
**Max rounds:** {{max_rounds}}
**Agents:** {{participating_agents}}
**Human:** {{user_name}}

---

## Summary

| Story | Final Estimate | Rounds | Debate? |
|-------|---------------|--------|---------|
{{#each estimated_stories}}
| {{key}} | {{estimate}} | {{rounds}} | {{had_debate}} |
{{/each}}

---

## Detailed Results

{{#each estimated_stories}}
### {{key}}: {{title}}

**Description:** {{description}}

**Round 1:**
| Participant | Estimate | Reasoning |
|-------------|----------|-----------|
| {{user_name}} (You) | {{human_est}} | — |
{{#each agent_estimates}}
| {{name}} ({{title}}) | {{estimate}} | {{reason}} |
{{/each}}

{{#if had_debate}}
**Debate:** {{debate_summary}}
**Round {{final_round}} (re-vote):**
| Participant | Estimate |
|-------------|----------|
| Consensus | {{final_estimate}} |
{{/if}}

**Final Estimate:** {{final_estimate}}
**Justification:** {{justification}}

---
{{/each}}
```

<action>Write report to `{{session_report_file}}`.</action>

<output>
📄 **Session report saved:** {{session_report_file}}
</output>
</step>

<step n="5" goal="Display completion summary">
<output>
## Planning Poker Complete 🎴

- **Stories estimated:** {{estimated_count}}
- **Stories skipped:** {{skipped_count}}
- **Debates triggered:** {{debate_count}}
- **Average rounds per story:** {{avg_rounds}}

**Updated:** `{{sprint_status_file}}` (story_points section)
**Report:** `{{session_report_file}}`

**Next:** Run sprint-planning to incorporate estimates into your sprint plan.
</output>

<action>Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete` — if the resolved value is non-empty, follow it as the final terminal instruction before exiting.</action>
</step>

</workflow>
