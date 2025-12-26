# Super-Dev Mode: Comprehensive Quality Workflow

## TL;DR

**Super-Dev Mode** ensures stories are **truly complete** through multi-stage validation:

```
Pre-validation → Development → Post-validation → Code Review → Fixes → Done ✅
```

No more "stupid-dev" where tasks get checked off without actually being complete!

## The Problem with "Stupid-Dev"

### Standard dev-story Flow

```
1. Read tasks
2. Implement features
3. Check off tasks
4. Mark story "review"
5. ??? (Hope it's actually done)
```

**What goes wrong:**
- ❌ Dev agent marks tasks complete prematurely
- ❌ Partial implementations claimed as "done"
- ❌ Missing edge cases not caught
- ❌ Code issues discovered later in manual review
- ❌ Story bounces back for rework

### Super-Dev Flow

```
1. PRE-DEV GAP ANALYSIS ✅
   ↓ Validate tasks match codebase

2. DEVELOPMENT ✅
   ↓ Implement features

3. POST-DEV GAP ANALYSIS 🆕
   ↓ Verify nothing was missed

4. ADVERSARIAL CODE REVIEW 🆕
   ↓ Catch issues, security, quality problems

5. FIX REVIEW FINDINGS 🆕
   ↓ Address all problems

6. MARK DONE ✅
   ↓ Only when truly complete
```

**What this prevents:**
- ✅ No premature task completion
- ✅ Catches partial implementations
- ✅ Finds missed edge cases
- ✅ Code review happens automatically
- ✅ Story only "done" when verified complete

## How It Works

### Stage 1: Pre-Dev Gap Analysis

Same as standard dev-story Step 1.5:
- Scans codebase
- Validates tasks against reality
- Proposes task updates
- User approves

### Stage 2: Development

Standard implementation cycle:
- Follows tasks sequentially
- Red-green-refactor (TDD)
- Runs tests
- Updates story file

### Stage 3: **NEW** - Post-Dev Gap Analysis

**This is the game-changer!**

After all tasks are checked off:

```xml
<step n="9.5" goal="Post-development gap analysis" if="super_dev_mode enabled">
  <critical>🔍 VERIFY COMPLETION - Did we actually build everything?</critical>

  <action>Re-scan codebase with original requirements</action>
  <action>Compare what should exist vs what actually exists</action>

  <check if="gaps found">
    <output>⚠️ POST-DEV GAPS DETECTED!

      Tasks marked complete but code missing or incomplete:
      {{list_of_gaps}}

      Adding missing work to task list...
    </output>

    <action>Add new tasks for missing work</action>
    <action>GOTO step 5 - Continue implementation</action>
  </check>

  <check if="no gaps">
    <output>✅ Post-dev validation passed - all work verified complete</output>
    <action>Continue to code review</action>
  </check>
</step>
```

### Stage 4: **NEW** - Adversarial Code Review

Auto-run code review workflow:

```xml
<step n="9.6" goal="Adversarial code review" if="super_dev_mode enabled">
  <critical>👀 INDEPENDENT REVIEW - Catch issues before human review</critical>

  <action>Run code-review workflow automatically</action>
  <action>Generate review findings</action>

  <check if="critical issues found">
    <output>🚨 CODE REVIEW FOUND CRITICAL ISSUES:

      {{list_of_critical_issues}}

      Auto-fixing issues...
    </output>

    <action>Add review findings as tasks</action>
    <action>GOTO step 5 - Implement fixes</action>
  </check>

  <check if="only minor issues found">
    <output>ℹ️ CODE REVIEW FOUND MINOR ISSUES:

      {{list_of_minor_issues}}
    </output>

    <ask>Auto-fix minor issues? [Y/n]:</ask>

    <check if="user approves">
      <action>Add review findings as tasks</action>
      <action>GOTO step 5 - Implement fixes</action>
    </check>
  </check>

  <check if="no issues found">
    <output>✅ Code review passed - no issues found</output>
    <action>Continue to completion</action>
  </check>
</step>
```

### Stage 5: Mark Done

Only after passing ALL validation:

```
✅ Pre-dev gap analysis passed
✅ Development completed
✅ Post-dev gap analysis passed
✅ Code review passed
✅ All issues fixed

→ NOW mark story "review"
```

## Configuration

### Enable Super-Dev Mode

Add to `_bmad/bmm/config.yaml`:

```yaml
# Super-Dev Mode (comprehensive quality workflow)
super_dev_mode: true  # Default: false

# Super-Dev Options
super_dev:
  post_dev_gap_analysis: true    # Re-validate after implementation
  auto_code_review: true          # Run code review automatically
  auto_fix_minor_issues: false    # Auto-fix minor review findings without asking
  fail_on_gaps: false             # Fail hard if post-dev gaps found (vs auto-fix)
```

### Per-Story Override

In story file frontmatter:

```yaml
---
super_dev_mode: true
---
```

## Usage

### Enable for All Stories

```bash
# Edit config
vim _bmad/bmm/config.yaml

# Add:
super_dev_mode: true

# Now all dev-story runs use super-dev mode
```

### Enable for One Story

```bash
# Edit story file
vim docs/sprint-artifacts/1-2-auth.md

# Add to frontmatter:
super_dev_mode: true

# Run dev-story as normal
/dev-story
```

### Batch Enable

```bash
# Enable for all stories in epic 2
for story in docs/sprint-artifacts/2-*.md; do
  # Add super_dev_mode to frontmatter
  sed -i '1a super_dev_mode: true' "$story"
done
```

## Examples

### Example 1: Post-Dev Gap Catches Missing Test

```
Story: "Implement user authentication"

Tasks after development:
[x] Create auth service
[x] Implement login endpoint
[x] Write tests

POST-DEV GAP ANALYSIS:
✅ auth.service.ts exists
✅ login endpoint exists
❌ Tests claim 90% coverage but only 60% actual
❌ Edge case tests missing

ACTION: Add missing tests to task list, continue development

RESULT: Story truly complete with full test coverage
```

### Example 2: Code Review Catches Security Issue

```
Story: "Add password reset feature"

Development complete, all tasks checked.

CODE REVIEW:
❌ CRITICAL: Password reset tokens not expiring
❌ MEDIUM: Error messages leak user existence
✅ All other checks passed

ACTION: Add security fixes to task list, continue development

RESULT: Secure implementation, no vulnerabilities
```

### Example 3: Everything Passes First Try

```
Story: "Update dashboard UI"

Tasks completed perfectly.

POST-DEV GAP ANALYSIS: ✅ All work verified
CODE REVIEW: ✅ No issues found

RESULT: Story marked "review" immediately
```

## Performance Impact

| Stage | Time | Value |
|-------|------|-------|
| Pre-dev gap analysis | 5-10s | Prevents duplicate work |
| Development | Normal | Standard implementation |
| Post-dev gap analysis | 5-10s | Catches incomplete work |
| Code review | 30-60s | Finds quality/security issues |
| **Total overhead** | **40-80s** | **Prevents hours of rework** |

**ROI:** Spending 1 minute extra per story prevents hours of:
- Rework from incomplete implementations
- Bug fixes from missed edge cases
- Security patches from vulnerabilities
- Review cycles from quality issues

## Comparison

### Standard Dev-Story

```
Time: 30 minutes dev work
Quality: ??? (unknown until manual review)
Rework: High probability
Cycle time: Long (multiple review iterations)
```

### Super-Dev Mode

```
Time: 31 minutes (30 dev + 1 validation)
Quality: High (multi-stage verified)
Rework: Minimal (issues caught early)
Cycle time: Short (passes review first time)
```

## Best Practices

### 1. Enable for Complex Stories

Stories with:
- Security implications
- Complex business logic
- Multiple integrations
- High test coverage requirements

### 2. Disable for Trivial Stories

Stories like:
- Documentation updates
- Simple UI tweaks
- Configuration changes

### 3. Use Auto-Fix for Minor Issues

```yaml
super_dev:
  auto_fix_minor_issues: true
```

Saves time on:
- Linting issues
- Formatting problems
- Simple refactoring

### 4. Batch Process with Caution

Super-dev mode increases time per story. For batch processing:
- Enable for critical stories only
- Or run overnight batch processing
- Or accept longer processing time for quality

## Troubleshooting

### "Post-dev gap analysis found missing work every time"

**Cause:** Dev agent marks tasks complete prematurely

**Solution:** This is EXACTLY what super-dev catches! Let it add the missing work and continue.

### "Code review fails every story"

**Cause:** Common coding issues not caught during development

**Solution:** This is working as designed. Review the patterns and add to "Dev Agent Guardrails" in future stories.

### "Super-dev mode takes too long"

**Cause:** Multiple validation stages add time

**Solution:**
- Disable for trivial stories
- Use `auto_fix_minor_issues: true`
- Accept quality over speed trade-off

### "Post-dev analysis conflicts with pre-dev analysis"

**Cause:** Codebase changed during development (other stories completed)

**Solution:** This is normal for batch planning. Post-dev analysis adapts to evolved codebase.

## FAQ

### Q: Does this replace manual code review?

**A:** No. This catches obvious issues automatically. Human review still needed for:
- Architecture decisions
- Business logic correctness
- UX/design decisions

### Q: Can I use post-dev gap analysis without code review?

**A:** Yes:
```yaml
super_dev:
  post_dev_gap_analysis: true
  auto_code_review: false
```

### Q: Does this work with custom workflows?

**A:** Yes, if your custom dev-story preserves the hook points for gap analysis and code review.

### Q: What if I disagree with code review findings?

**A:** You can reject auto-fixes and continue. The findings are logged for human review.

## Implementation Status

- ✅ **Pre-dev gap analysis** - Available in BMAD v6.0.0-alpha.22+
- 🚧 **Post-dev gap analysis** - Planned for v6.0.0-alpha.23
- 🚧 **Auto code review** - Planned for v6.0.0-alpha.23
- 🚧 **Super-dev mode config** - Planned for v6.0.0-alpha.23

## Contributing

Want to help implement super-dev mode?

1. Post-dev gap analysis implementation
2. Code review integration
3. Config system for super-dev options
4. Documentation and examples

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

**Super-Dev Mode: Because "done" should mean DONE, not "hope so"** ✅
