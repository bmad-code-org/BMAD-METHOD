# Create Story Quality Validation Checklist

```xml
<critical>This validation runs in a FRESH CONTEXT by an independent validator agent</critical>
<critical>The validator audits story quality and offers to improve if issues are found</critical>
<critical>Load only the story file and necessary source documents - do NOT load workflow instructions</critical>

<validation-checklist>

<expectations>
**What create-story workflow should have accomplished:**

1. **Previous Story Continuity:** If a previous story exists (status: done/review/in-progress), current story should have "Learnings from Previous Story" subsection in Dev Notes that references: new files created, completion notes, architectural decisions, unresolved review items
2. **Source Document Coverage:** Story should cite tech spec (if exists), epics, PRD, and relevant architecture docs (architecture.md, testing-strategy.md, coding-standards.md, unified-project-structure.md)
3. **Requirements Traceability:** ACs sourced from tech spec (preferred) or epics, not invented
4. **Dev Notes Quality:** Specific guidance with citations, not generic advice
5. **Task-AC Mapping:** Every AC has tasks, every task references AC, testing subtasks present
6. **Structure:** Status="drafted", proper story statement, Dev Agent Record sections initialized
</expectations>

## Validation Steps

### 1. Load Story and Extract Metadata
- [ ] Load story file: {{story_file_path}}
- [ ] Parse sections: Status, Story, ACs, Tasks, Dev Notes, Dev Agent Record, Change Log
- [ ] Extract: epic_num, story_num, story_key, story_title
- [ ] Initialize issue tracker (Critical/Major/Minor)

### 2. Previous Story Continuity Check

**Find previous story:**
- [ ] Load {output_folder}/sprint-status.yaml
- [ ] Find current {{story_key}} in development_status
- [ ] Identify story entry immediately above (previous story)
- [ ] Check previous story status

**If previous story status is done/review/in-progress:**
- [ ] Load previous story file: {story_dir}/{{previous_story_key}}.md
- [ ] Extract: Dev Agent Record (Completion Notes, File List with NEW/MODIFIED)
- [ ] Extract: Senior Developer Review section if present
- [ ] Count unchecked [ ] items in Review Action Items
- [ ] Count unchecked [ ] items in Review Follow-ups (AI)

**Validate current story captured continuity:**
- [ ] Check: "Learnings from Previous Story" subsection exists in Dev Notes
  - If MISSING and previous story has content → **CRITICAL ISSUE**
- [ ] If subsection exists, verify it includes:
  - [ ] References to NEW files from previous story → If missing → **MAJOR ISSUE**
  - [ ] Mentions completion notes/warnings → If missing → **MAJOR ISSUE**
  - [ ] Calls out unresolved review items (if any exist) → If missing → **CRITICAL ISSUE**
  - [ ] Cites previous story: [Source: stories/{{previous_story_key}}.md]

**If previous story status is backlog/drafted:**
- [ ] No continuity expected (note this)

**If no previous story exists:**
- [ ] First story in epic, no continuity expected

### 3. Source Document Coverage Check

**Build available docs list:**
- [ ] Check exists: tech-spec-epic-{{epic_num}}*.md in {tech_spec_search_dir}
- [ ] Check exists: {output_folder}/epics.md
- [ ] Check exists: {output_folder}/PRD.md
- [ ] Check exists in {output_folder}/ or {project-root}/docs/:
  - architecture.md, testing-strategy.md, coding-standards.md
  - unified-project-structure.md, tech-stack.md
  - backend-architecture.md, frontend-architecture.md, data-models.md

**Validate story references available docs:**
- [ ] Extract all [Source: ...] citations from story Dev Notes
- [ ] Tech spec exists but not cited → **CRITICAL ISSUE**
- [ ] Epics exists but not cited → **CRITICAL ISSUE**
- [ ] Architecture.md exists → Read for relevance → If relevant but not cited → **MAJOR ISSUE**
- [ ] Testing-strategy.md exists → Check Dev Notes mentions testing standards → If not → **MAJOR ISSUE**
- [ ] Testing-strategy.md exists → Check Tasks have testing subtasks → If not → **MAJOR ISSUE**
- [ ] Coding-standards.md exists → Check Dev Notes references standards → If not → **MAJOR ISSUE**
- [ ] Unified-project-structure.md exists → Check Dev Notes has "Project Structure Notes" subsection → If not → **MAJOR ISSUE**

**Validate citation quality:**
- [ ] Verify cited file paths are correct and files exist → Bad citations → **MAJOR ISSUE**
- [ ] Check citations include section names, not just file paths → Vague citations → **MINOR ISSUE**

### 4. Acceptance Criteria Quality Check

- [ ] Extract Acceptance Criteria from story
- [ ] Count ACs: {{ac_count}} (if 0 → **CRITICAL ISSUE** and halt)
- [ ] Check story indicates AC source (tech spec, epics, PRD)

**If tech spec exists:**
- [ ] Load tech spec
- [ ] Search for this story number
- [ ] Extract tech spec ACs for this story
- [ ] Compare story ACs vs tech spec ACs → If mismatch → **MAJOR ISSUE**

**If no tech spec but epics.md exists:**
- [ ] Load epics.md
- [ ] Search for Epic {{epic_num}}, Story {{story_num}}
- [ ] Story not found in epics → **CRITICAL ISSUE** (should have halted)
- [ ] Extract epics ACs
- [ ] Compare story ACs vs epics ACs → If mismatch without justification → **MAJOR ISSUE**

**Validate AC quality:**
- [ ] Each AC is testable (measurable outcome)
- [ ] Each AC is specific (not vague)
- [ ] Each AC is atomic (single concern)
- [ ] Vague ACs found → **MINOR ISSUE**

### 5. Task-AC Mapping Check

- [ ] Extract Tasks/Subtasks from story
- [ ] For each AC: Search tasks for "(AC: #{{ac_num}})" reference
  - [ ] AC has no tasks → **MAJOR ISSUE**
- [ ] For each task: Check if references an AC number
  - [ ] Tasks without AC refs (and not testing/setup) → **MINOR ISSUE**
- [ ] Count tasks with testing subtasks
  - [ ] Testing subtasks < ac_count → **MAJOR ISSUE**

### 6. Dev Notes Quality Check

**Check required subsections exist:**
- [ ] Architecture patterns and constraints
- [ ] References (with citations)
- [ ] Project Structure Notes (if unified-project-structure.md exists)
- [ ] Learnings from Previous Story (if previous story has content)
- [ ] Missing required subsections → **MAJOR ISSUE**

**Validate content quality:**
- [ ] Architecture guidance is specific (not generic "follow architecture docs") → If generic → **MAJOR ISSUE**
- [ ] Count citations in References subsection
  - [ ] No citations → **MAJOR ISSUE**
  - [ ] < 3 citations and multiple arch docs exist → **MINOR ISSUE**
- [ ] Scan for suspicious specifics without citations:
  - API endpoints, schema details, business rules, tech choices
  - [ ] Likely invented details found → **MAJOR ISSUE**

### 7. Story Structure Check

- [ ] Status = "drafted" → If not → **MAJOR ISSUE**
- [ ] Story section has "As a / I want / so that" format → If malformed → **MAJOR ISSUE**
- [ ] Dev Agent Record has required sections:
  - Context Reference, Agent Model Used, Debug Log References, Completion Notes List, File List
  - [ ] Missing sections → **MAJOR ISSUE**
- [ ] Change Log initialized → If missing → **MINOR ISSUE**
- [ ] File in correct location: {story_dir}/{{story_key}}.md → If not → **MAJOR ISSUE**

### 8. Unresolved Review Items Alert

**CRITICAL CHECK for incomplete review items from previous story:**

- [ ] If previous story has "Senior Developer Review (AI)" section:
  - [ ] Count unchecked [ ] items in "Action Items"
  - [ ] Count unchecked [ ] items in "Review Follow-ups (AI)"
  - [ ] If unchecked items > 0:
    - [ ] Check current story "Learnings from Previous Story" mentions these
    - [ ] If NOT mentioned → **CRITICAL ISSUE** with details:
      - List all unchecked items with severity
      - Note: "These may represent epic-wide concerns"
      - Required: Add to Learnings section with note about pending items

## Validation Report Generation

**Calculate severity counts:**
- Critical: {{critical_count}}
- Major: {{major_count}}
- Minor: {{minor_count}}

**Determine outcome:**
- Critical > 0 OR Major > 3 → **FAIL**
- Major ≤ 3 and Critical = 0 → **PASS with issues**
- All = 0 → **PASS**

**Generate report:**
```

# Story Quality Validation Report

Story: {{story_key}} - {{story_title}}
Outcome: {{outcome}} (Critical: {{critical_count}}, Major: {{major_count}}, Minor: {{minor_count}})

## Critical Issues (Blockers)

{{list_each_with_description_and_evidence}}

## Major Issues (Should Fix)

{{list_each_with_description_and_evidence}}

## Minor Issues (Nice to Have)

{{list_each_with_description}}

## Successes

{{list_what_was_done_well}}

```

## User Alert and Remediation

**If FAIL:**
- Show issues summary and top 3 issues
- Offer options: (1) Auto-improve story, (2) Show detailed findings, (3) Fix manually, (4) Accept as-is
- If option 1: Re-load source docs, regenerate affected sections, re-run validation

**If PASS with issues:**
- Show issues list
- Ask: "Improve story? (y/n)"
- If yes: Enhance story with missing items

**If PASS:**
- Confirm: All quality standards met
- List successes
- Ready for story-context generation

</validation-checklist>
```

## Quick Reference

**Validation runs in fresh context and checks:**

1. ✅ Previous story continuity captured (files, notes, **unresolved review items**)
2. ✅ All relevant source docs discovered and cited
3. ✅ ACs match tech spec/epics exactly
4. ✅ Tasks cover all ACs with testing
5. ✅ Dev Notes have specific guidance with citations (not generic)
6. ✅ Structure and metadata complete

**Severity Levels:**

- **CRITICAL** = Missing previous story reference, missing tech spec cite, unresolved review items not called out, story not in epics
- **MAJOR** = Missing arch docs, missing files from previous story, vague Dev Notes, ACs don't match source, no testing subtasks
- **MINOR** = Vague citations, orphan tasks, missing Change Log

**Outcome Triggers:**

- **FAIL** = Any critical OR >3 major issues
- **PASS with issues** = ≤3 major issues, no critical
- **PASS** = All checks passed
