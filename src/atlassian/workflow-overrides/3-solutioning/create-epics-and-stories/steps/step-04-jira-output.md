# Step 4: Output Epics and Stories to Jira

**This step replaces the default file-write output step.** The elicitation and analysis steps (1–3) remain unchanged — they build the epics/stories structure in the agent's working memory. This step writes that structure to Jira.

---

## Prerequisites

- Steps 1–3 have completed: you have a fully formed epics/stories structure with:
  - Epic titles, goals, and FR coverage
  - Story titles, user stories (As a / I want / So that), and acceptance criteria (Given/When/Then)
- Configuration loaded: `{jira_project_key}`, `{confluence_space_key}`, `{agent_label_prefix}`, `{key_map_file}`
- PRD Confluence page exists (look up `confluence_pages.prd` in `{key_map_file}`)

---

<workflow>

<step n="4.1" goal="Create Jira Epics">
<action>For each Epic in the structure, call `Create Issue`:</action>

```
project_key: "{jira_project_key}"
issue_type: "Epic"
summary: "Epic {N}: {epic_title}"
description: |
  ## Goal
  {epic_goal}

  ## Requirements Coverage
  {fr_coverage_for_this_epic}
additional_fields:
  labels: ["{agent_label_prefix}pm", "bmad-epic"]
```

<action>Record each returned issue key (e.g., `PROJ-10`, `PROJ-11`)</action>
<action>Update `{key_map_file}` under `epics`: `epic-{N}: "{issue_key}"`</action>
</step>

<step n="4.2" goal="Create Jira Stories and link to Epics">
<action>For each Story under each Epic, call `Create Issue`:</action>

```
project_key: "{jira_project_key}"
issue_type: "Story"
summary: "Story {N}.{M}: {story_title}"
description: |
  ## User Story
  As a {user_type},
  I want {capability},
  So that {value_benefit}.

  ## Acceptance Criteria

  {for_each_ac}
  **Given** {precondition}
  **When** {action}
  **Then** {expected_outcome}
  {end_for_each}
additional_fields:
  labels: ["{agent_label_prefix}pm", "bmad-story"]
```

<action>After each Story is created, call `Link to Epic`:</action>

```
issue_key: "{story_issue_key}"
epic_key: "{parent_epic_issue_key}"
```

<action>Update `{key_map_file}` under `stories`: `{N}-{M}-{kebab_title}: "{story_issue_key}"`</action>

**Kebab-case conversion rules (same as sprint-planning):**
- Replace period with dash: `1.1` → `1-1`
- Convert title to kebab-case: `User Authentication` → `user-authentication`
- Final key: `1-1-user-authentication`
</step>

<step n="4.3" goal="Link PRD Confluence page to Epics">
<action>Look up `confluence_pages.prd` in `{key_map_file}` to get the PRD page ID</action>
<action>For each Epic created, call `Create Remote Issue Link`:</action>

```
issue_key: "{epic_issue_key}"
url: "{confluence_base_url}/pages/{prd_page_id}"
title: "PRD: {project_name}"
summary: "Product Requirements Document"
```
</step>

<step n="4.4" goal="Dual-write to local files (if configured)">
<action>If `{output_mode}` is `"dual"`:</action>
<action>Also write the complete epics/stories document to `{planning_artifacts}/epics.md` using the standard bmm template</action>
<action>This ensures local file access remains available as a cache</action>
</step>

<step n="4.5" goal="Report results">
<action>Present a summary to the user:</action>

**Jira Output Complete**

| Type | Count | Project |
|---|---|---|
| Epics created | {epic_count} | {jira_project_key} |
| Stories created | {story_count} | {jira_project_key} |
| Epic-Story links | {link_count} | — |
| PRD remote links | {epic_count} | — |

**Key Map Updated:** `{key_map_file}`

**Next Steps:**
1. Review the created issues in Jira: `project = {jira_project_key} AND labels = bmad-epic`
2. Run the Architect workflow to create the Architecture Decision Document
3. Run Sprint Planning to organise stories into sprints
</step>

</workflow>
