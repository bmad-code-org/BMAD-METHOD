# Step Completion Protocol

**Purpose:** Standard protocol for completing workflow steps and communicating progress to users.

---

## When to Use

Apply this protocol whenever you:
- Complete a Product Brief step
- Finish a major task or milestone
- Update agent dialog files
- Make significant changes to project files

---

## Protocol Steps

### 1. Complete the Work

- Finish all tasks required for the step
- Ensure all artifacts are generated and validated
- Verify step requirements are met

### 2. Update Agent Dialog Files

**If project has agent dialog structure:**

1. Update the relevant dialog file (e.g., `dialog/02-vision.md`, `dialog/decisions.md`)
2. Document reflection checkpoint (synthesis + confirmation/correction)
3. Record final outputs and key insights
4. Mark step complete in `dialog/README.md` progress tracker

**If this is a meta-level agent dialog** (like ongoing session work):

1. Move completed task from CURRENT WORK to top of COMPLETED WORK
2. Update CURRENT PLAN checkboxes (⏳ → ✅)
3. Move next task from UPCOMING WORK to CURRENT WORK
4. Update CURRENT WORK section with new task details

### 3. Show Git Diff (MANDATORY)

**ALWAYS show git diff of changes made.**

**For single file changes:**
```bash
git diff path/to/file.md
```

**For multiple files:**
```bash
git diff --stat path/to/directory/
```

**For all changes in session:**
```bash
git diff --stat
```

**Why this matters:**
- Transparency: User sees exactly what changed
- Validation: User can review changes before committing
- Context: Clear record of progress made
- Accountability: Agent and user stay aligned

**When NOT to show diff:**
- Files too large (>50KB) - show `--stat` only
- Binary files (images, PDFs) - mention they were created/modified
- Sensitive information - describe changes verbally instead

### 4. Present Summary

**Tell the user what was accomplished:**

```markdown
✅ **[Task/Step Name] Complete**

[Brief summary of what was done - 1-3 sentences]

**Changes made:**
- [Key change 1]
- [Key change 2]
- [Key change 3]

**Files modified:** [count] files, [+insertions]/-[deletions] lines

[If applicable: What's next or what to review]
```

### 5. Update State

**Update project state files if needed:**
- Update `.wds-project-outline.yaml` if phase/step status changed
- Update frontmatter in step files if using state tracking
- Update any progress trackers

---

## Example Execution

**Scenario:** Just completed Step 3 (Positioning) in Product Brief

**Agent actions:**

1. ✅ **Completed work:** Generated positioning statement with components
2. ✅ **Updated dialog:** Added to `dialog/07-positioning.md` and `dialog/README.md`
3. ✅ **Show diff:**

```bash
git diff --stat src/workflows/.../dialog/
```

Output:
```
dialog/07-positioning.md | 45 ++++++++++++++++++++
dialog/README.md         |  2 +-
2 files changed, 46 insertions(+), 1 deletion(-)
```

4. ✅ **Present to user:**

```markdown
✅ **Step 3: Positioning Complete**

Created positioning statement synthesized from conversation about target customers, alternatives, and differentiation.

**Key outputs:**
- Positioning statement for vehicle owners in northern Öland
- Component breakdown (target, need, category, benefit, alternatives, differentiator)
- Strategic rationale documenting why this positioning makes sense

**Files modified:** 2 files, 46 insertions(+), 1 deletion(-)

**Next:** Step 4 - Business Model (B2B/B2C/Both)
```

5. ✅ **Updated state:** Marked Step 3 complete in progress tracking

---

## Common Mistakes to Avoid

❌ **DON'T:**
- Skip showing git diff (transparency matters!)
- Batch multiple steps without showing individual diffs
- Present diff without explaining what changed
- Show diff of unrelated files from previous work
- Forget to update agent dialog files

✅ **DO:**
- Show diff immediately after making changes
- Explain what the diff represents
- Update dialog files before showing diff
- Keep diffs focused on current work
- Use `--stat` for high-level overview when many files changed

---

## Integration with Workflows

**This protocol is referenced by:**
- All Product Brief step files (steps-c/*.md)
- Agent dialog templates (workflows/1-project-brief/templates/project-brief-dialog/USAGE.md)
- Workflow orchestration files (workflow.md)

**Agents should:**
- Internalize this protocol
- Apply it consistently
- Adapt language to user's working relationship context
- Use git diff tools fluently

---

**Status:** Active protocol for all WDS workflow steps
**Last Updated:** 2026-02-12
