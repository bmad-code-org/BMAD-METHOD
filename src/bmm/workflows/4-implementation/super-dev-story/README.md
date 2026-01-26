# Super-Dev-Story Workflow

**Enhanced story development with comprehensive quality validation**

## What It Does

Super-dev-story is `/dev-story` on steroids - it includes ALL standard development steps PLUS additional quality gates:

```
Standard dev-story:
  1-8. Development cycle → Mark "review"

Super-dev-story:
  1-8. Development cycle
  9.5. Post-dev gap analysis (verify work complete)
  9.6. Automated code review (catch issues)
  → Fix issues if found (loop back to step 5)
  9. Mark "review" (only after all validation passes)
```

## When to Use

### Use `/super-dev-story` for:

- ✅ Security-critical features (auth, payments, PII handling)
- ✅ Complex business logic with many edge cases
- ✅ Stories you want bulletproof before human review
- ✅ High-stakes features (production releases, customer-facing)
- ✅ When you want to minimize review cycles

### Use standard `/dev-story` for:

- Documentation updates
- Simple UI tweaks
- Configuration changes
- Low-risk experimental features
- When speed matters more than extra validation

## Cost vs Benefit

| Aspect | dev-story | super-dev-story |
|--------|-----------|-----------------|
| **Tokens** | 50K-100K | 80K-150K (+30-50%) |
| **Time** | Normal | +20-30% |
| **Quality** | Good | Excellent |
| **Review cycles** | 1-3 iterations | 0-1 iterations |
| **False completions** | Possible | Prevented |

**ROI:** Extra 30K tokens (~$0.09) prevents hours of rework and multiple review cycles

## What Gets Validated

### Step 9.5: Post-Dev Gap Analysis

**Checks:**
- Tasks marked [x] → Code actually exists and works?
- Required files → Actually created?
- Claimed tests → Actually exist and pass?
- Partial implementations → Marked complete prematurely?

**Catches:**
- ❌ "Created auth service" → File doesn't exist
- ❌ "Added tests with 90% coverage" → Only 60% actual
- ❌ "Implemented login" → Function exists but incomplete

**Actions if issues found:**
- Unchecks false positive tasks
- Adds tasks for missing work
- Loops back to implementation

### Step 9.6: Automated Code Review

**Reviews:**
- ✅ Correctness (logic errors, edge cases)
- ✅ Security (vulnerabilities, input validation)
- ✅ Architecture (pattern compliance, SOLID principles)
- ✅ Performance (inefficiencies, optimization opportunities)
- ✅ Testing (coverage gaps, test quality)
- ✅ Code Quality (readability, maintainability)

**Actions if issues found:**
- Adds review findings as tasks
- Loops back to implementation
- Continues until issues resolved

## Usage

### Basic Usage

```bash
# Load any BMAD agent
/super-dev-story

# Follows same flow as dev-story, with extra validation
```

### Specify Story

```bash
/super-dev-story _bmad-output/implementation-artifacts/story-1.2.md
```

### Expected Flow

```
1. Pre-dev gap analysis
   ├─ "Approve task updates? [Y/A/n/e/s/r]"
   └─ Select option

2. Development (standard TDD cycle)
   └─ Implements all tasks

3. Post-dev gap analysis
   ├─ Scans codebase
   ├─ If gaps: adds tasks, loops back
   └─ If clean: proceeds

4. Code review
   ├─ Analyzes all changes
   ├─ If issues: adds tasks, loops back
   └─ If clean: proceeds

5. Story marked "review"
   └─ Truly complete!
```

## Fix Iteration Safety

Super-dev has a **max iteration limit** (default: 3) to prevent infinite loops:

```yaml
# workflow.yaml
super_dev_settings:
  max_fix_iterations: 3  # Stop after 3 fix cycles
  fail_on_critical_issues: true  # HALT if critical security issues
```

If exceeded:
```
🛑 Maximum Fix Iterations Reached

Attempted 3 fix cycles.
Manual intervention required.

Issues remaining:
- [List of unresolved issues]
```

## Examples

### Example 1: Perfect First Try

```
/super-dev-story

Pre-gap: ✅ Tasks accurate
Development: ✅ 8 tasks completed
Post-gap: ✅ All work verified
Code review: ✅ No issues

→ Story complete! (45 minutes, 85K tokens)
```

### Example 2: Post-Dev Catches Incomplete Work

```
/super-dev-story

Pre-gap: ✅ Tasks accurate
Development: ✅ 8 tasks completed
Post-gap: ⚠️ Tests claim 90% coverage, actual 65%

→ Adds task: "Increase test coverage to 90%"
→ Implements missing tests
→ Post-gap: ✅ Now 92% coverage
→ Code review: ✅ No issues

→ Story complete! (52 minutes, 95K tokens)
```

### Example 3: Code Review Finds Security Issue

```
/super-dev-story

Pre-gap: ✅ Tasks accurate
Development: ✅ 10 tasks completed
Post-gap: ✅ All work verified
Code review: 🚨 CRITICAL - SQL injection vulnerability

→ Adds task: "Fix SQL injection in user search"
→ Implements parameterized queries
→ Post-gap: ✅ Verified
→ Code review: ✅ Security issue resolved

→ Story complete! (58 minutes, 110K tokens)
```

## Comparison to Standard Workflow

### Standard Flow (dev-story)

```
Day 1: Develop story (30 min)
Day 2: Human review finds 3 issues
Day 3: Fix issues (20 min)
Day 4: Human review again
Day 5: Approved

Total: 5 days, 2 review cycles
```

### Super-Dev Flow

```
Day 1: Super-dev-story
  - Development (30 min)
  - Post-gap finds 1 issue (auto-fix 5 min)
  - Code review finds 2 issues (auto-fix 15 min)
  - Complete (50 min total)

Day 2: Human review
Day 3: Approved (minimal/no changes needed)

Total: 3 days, 1 review cycle
```

**Savings:** 2 days, 1 fewer review cycle, higher initial quality

## Troubleshooting

### "Super-dev keeps looping forever"

**Cause:** Each validation finds new issues
**Solution:** This indicates quality problems. Review max_fix_iterations setting or manually intervene.

### "Post-dev gap analysis keeps failing"

**Cause:** Dev agent marking tasks complete prematurely
**Solution:** This is expected! Super-dev catches this. The loop ensures actual completion.

### "Code review too strict"

**Cause:** Reviewing for issues standard dev-story would miss
**Solution:** This is intentional. For less strict review, use standard dev-story.

### "Too many tokens/too slow"

**Cause:** Multi-stage validation adds overhead
**Solution:** Use standard dev-story for non-critical stories. Reserve super-dev for important work.

## Best Practices

1. **Reserve for important stories** - Don't use for trivial changes
2. **Trust the process** - Fix iterations mean it's working correctly
3. **Review limits** - Adjust max_fix_iterations if stories are complex
4. **Monitor costs** - Track token usage vs review cycle savings
5. **Learn patterns** - Code review findings inform future architecture

## Configuration Reference

```yaml
# _bmad/bmm/config.yaml or _bmad/bmgd/config.yaml

# Per-project settings
super_dev_settings:
  post_dev_gap_analysis: true        # Enable post-dev validation
  auto_code_review: true              # Enable automatic code review
  fail_on_critical_issues: true      # HALT on security vulnerabilities
  max_fix_iterations: 3               # Maximum fix cycles before manual intervention
  auto_fix_minor_issues: false        # Auto-fix LOW severity without asking
```

## See Also

- [dev-story workflow](../dev-story/) - Standard development workflow
- [gap-analysis workflow](../gap-analysis/) - Standalone audit tool
- [Gap Analysis Guide](../../../../docs/gap-analysis.md) - Complete documentation
- [Super-Dev Mode Concept](../../../../docs/super-dev-mode.md) - Vision and roadmap

---

**Super-Dev-Story: Because "done" should mean DONE** ✅
