# Step 3: Generate Story with Verified Gap Analysis

## Goal
Generate complete 7-section story file using verified gap analysis from Step 2.

## Execution

### 1. Load Template

```bash
Read: {installed_path}/template.md
```

### 2. Fill Template Variables

**Basic Story Info:**
- `{{epic_num}}` - from Step 1
- `{{story_num}}` - from Step 1
- `{{story_title}}` - from existing story or epic
- `{{priority}}` - from epic (P0, P1, P2)
- `{{effort}}` - from epic or estimate

**Story Section:**
- `{{role}}` - from existing story
- `{{action}}` - from existing story
- `{{benefit}}` - from existing story

**Business Context:**
- `{{business_value}}` - from epic context
- `{{scale_requirements}}` - from epic/architecture
- `{{compliance_requirements}}` - from epic/architecture
- `{{urgency}}` - from epic priority

**Acceptance Criteria:**
- `{{acceptance_criteria}}` - from epic + existing story
- Update checkboxes based on Step 2 gap analysis:
  - [x] = Component verified EXISTS
  - [ ] = Component verified MISSING
  - [~] = Component verified PARTIAL (optional notation)

**Tasks / Subtasks:**
- `{{tasks_subtasks}}` - from epic + existing story
- Add "✅ DONE", "⚠️ PARTIAL", "❌ TODO" markers based on gap analysis

**Gap Analysis Section:**
- `{{implemented_components}}` - from Step 2 codebase scan (verified ✅)
- `{{missing_components}}` - from Step 2 codebase scan (verified ❌)
- `{{partial_components}}` - from Step 2 codebase scan (verified ⚠️)

**Architecture Compliance:**
- `{{architecture_patterns}}` - from architecture doc + playbooks
- Multi-tenant isolation requirements
- Caching strategies
- Error handling patterns
- Performance requirements

**Library/Framework Requirements:**
- `{{current_dependencies}}` - from Step 2 package.json scan
- `{{required_dependencies}}` - missing deps identified in Step 2

**File Structure:**
- `{{existing_files}}` - from Step 2 Glob results (verified ✅)
- `{{required_files}}` - from gap analysis (verified ❌)

**Testing Requirements:**
- `{{test_count}}` - from Step 2 test file count
- `{{required_tests}}` - based on missing components
- `{{coverage_target}}` - from architecture or default 90%

**Dev Agent Guardrails:**
- `{{guardrails}}` - from playbooks + previous story lessons
- What NOT to do
- Common mistakes to avoid

**Previous Story Intelligence:**
- `{{previous_story_learnings}}` - from Step 1 previous story Dev Agent Record

**Project Structure Notes:**
- `{{structure_alignment}}` - from architecture compliance

**References:**
- `{{references}}` - Links to epic, architecture, playbooks, related stories

**Definition of Done:**
- Standard DoD checklist with story-specific coverage target

### 3. Generate Complete Story

**Write filled template:**
```bash
Write: {story_dir}/story-{{epic_num}}.{{story_num}}.md
[Complete 7-section story with verified gap analysis]
```

### 4. Validate Generated Story

```bash
# Check section count
grep "^## " {story_dir}/story-{{epic_num}}.{{story_num}}.md | wc -l
# Should output: 7

# Check for gap analysis
grep -q "Gap Analysis.*Current State" {story_dir}/story-{{epic_num}}.{{story_num}}.md
# Should find it

# Run custom validation
./scripts/validate-bmad-format.sh {story_dir}/story-{{epic_num}}.{{story_num}}.md
# Update script to expect 7 sections + gap analysis subsection
```

### 5. Update Sprint Status

```bash
Read: {sprint_status}

# Find story entry
# Update status to "ready-for-dev" if was "backlog"
# Preserve all comments and structure

Write: {sprint_status}
```

### 6. Report Completion

**Output:**
```
✅ Story {{epic_num}}.{{story_num}} Regenerated with Gap Analysis

File: {story_dir}/story-{{epic_num}}.{{story_num}}.md
Sections: 7/7 ✅
Gap Analysis: VERIFIED with codebase scan

Summary:
  ✅ {{implemented_count}} components IMPLEMENTED (verified by file scan)
  ❌ {{missing_count}} components MISSING (verified file not found)
  ⚠️ {{partial_count}} components PARTIAL (file exists but mocked/incomplete)

Checkboxes in ACs and Tasks reflect VERIFIED status (not guesses).

Next Steps:
1. Review story file for accuracy
2. Use /dev-story to implement missing components
3. Story provides complete context for flawless implementation

Story is ready for development. 🚀
```

### 7. Cleanup

**Ask user:**
```
Story regeneration complete!

Would you like to:
[N] Regenerate next story ({{next_story_num}})
[Q] Quit workflow
[R] Review generated story first

Your choice:
```

**If N selected:** Loop back to Step 1 with next story number
**If Q selected:** End workflow
**If R selected:** Display story file, then show menu again

---

## Success Criteria

**Story generation succeeds when:**
1. ✅ 7 top-level ## sections present
2. ✅ Gap Analysis subsection exists with ✅/❌/⚠️ verified status
3. ✅ Checkboxes match codebase reality (spot-checked)
4. ✅ Dev Notes has all mandatory subsections
5. ✅ Definition of Done checklist included
6. ✅ File saved to correct location
7. ✅ Sprint status updated

---

**WORKFLOW COMPLETE - Ready to execute.**
