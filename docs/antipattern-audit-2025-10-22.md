# BMAD Workflow Conditional Execution Antipattern Audit

**Date:** 2025-10-22
**Auditor:** Claude Code (BMad Builder Agent)
**Scope:** All markdown files under `src/`

---

## Executive Summary

**Critical Issue Identified:** Invalid self-closing `<check>` tag pattern found throughout BMAD workflow codebase.

**Impact:**

- **98 instances** across **14 workflow files**
- Affects core workflows, builder workflows, and method workflows
- Creates XML parsing ambiguity and unpredictable LLM behavior
- Violates BMAD workflow specification (workflow.xml)

**Severity:** CRITICAL - Invalid XML structure, ambiguous conditional scope

---

## The Antipattern

### Invalid Pattern (Self-Closing Check)

```xml
<!-- ❌ WRONG - Invalid XML structure -->
<check>If condition met:</check>
<action>Do something</action>
<action>Do something else</action>
```

**Problems:**

1. Check tag doesn't wrap anything (invalid XML)
2. Ambiguous scope - unclear which actions are conditional
3. Breaks formatters and parsers
4. Not part of BMAD workflow spec
5. Unpredictable LLM interpretation

### Correct Patterns

**Single conditional action:**

```xml
<!-- ✅ CORRECT - Inline conditional -->
<action if="condition met">Do something</action>
```

**Multiple conditional actions:**

```xml
<!-- ✅ CORRECT - Proper wrapper block -->
<check if="condition met">
  <action>Do something</action>
  <action>Do something else</action>
</check>
```

---

## Audit Results

### Total Count

- **Total Instances:** 98
- **Affected Files:** 14
- **Modules Affected:** 4 (BMB, BMM, CIS, Core)

### Breakdown by File

| File                                                                 | Count | Priority    |
| -------------------------------------------------------------------- | ----- | ----------- |
| `modules/bmb/workflows/edit-workflow/instructions.md`                | 21    | 🔴 CRITICAL |
| `modules/bmm/workflows/4-implementation/dev-story/instructions.md`   | 13    | 🔴 CRITICAL |
| `modules/bmb/workflows/convert-legacy/instructions.md`               | 13    | 🔴 CRITICAL |
| `modules/bmb/workflows/create-module/instructions.md`                | 12    | 🔴 CRITICAL |
| `modules/bmb/workflows/create-agent/instructions.md`                 | 11    | 🔴 CRITICAL |
| `core/workflows/party-mode/instructions.md`                          | 7     | 🟡 HIGH     |
| `modules/bmm/workflows/4-implementation/correct-course/checklist.md` | 5     | 🟡 HIGH     |
| `core/workflows/brainstorming/instructions.md`                       | 5     | 🟡 HIGH     |
| `modules/cis/workflows/storytelling/instructions.md`                 | 3     | 🟢 MEDIUM   |
| `modules/bmb/workflows/audit-workflow/instructions.md`               | 3     | 🟢 MEDIUM   |
| `modules/bmb/workflows/create-workflow/workflow-creation-guide.md`   | 2     | 🟢 MEDIUM   |
| `modules/bmm/workflows/1-analysis/product-brief/instructions.md`     | 1     | 🟢 LOW      |
| `modules/bmm/workflows/1-analysis/game-brief/instructions.md`        | 1     | 🟢 LOW      |
| `modules/bmb/workflows/redoc/instructions.md`                        | 1     | 🟢 LOW      |

### Breakdown by Module

**BMB (Builder) Module: 63 instances (64%)**

- edit-workflow: 21
- convert-legacy: 13
- create-module: 12
- create-agent: 11
- audit-workflow: 3
- create-workflow: 2
- redoc: 1

**BMM (Method) Module: 20 instances (20%)**

- dev-story: 13
- correct-course: 5
- product-brief: 1
- game-brief: 1

**Core Workflows: 12 instances (12%)**

- party-mode: 7
- brainstorming: 5

**CIS (Creative) Module: 3 instances (3%)**

- storytelling: 3

---

## Example Instances

### Example 1: create-agent/instructions.md (Line 13-20)

**BEFORE (Invalid):**

```xml
<check>If yes:</check>
  <action>Invoke brainstorming workflow: {project-root}/bmad/core/workflows/brainstorming/workflow.yaml</action>
  <action>Pass context data: {installed_path}/brainstorm-context.md</action>
  <action>Wait for brainstorming session completion</action>

  <check>If no:</check>
    <action>Proceed directly to Step 0</action>
```

**AFTER (Correct):**

```xml
<check if="user answered yes">
  <action>Invoke brainstorming workflow: {project-root}/bmad/core/workflows/brainstorming/workflow.yaml</action>
  <action>Pass context data: {installed_path}/brainstorm-context.md</action>
  <action>Wait for brainstorming session completion</action>
</check>

<check if="user answered no">
  <action>Proceed directly to Step 0</action>
</check>
```

### Example 2: dev-story/instructions.md (Line 54-55)

**BEFORE (Invalid):**

```xml
<check>If story file inaccessible → HALT: "Cannot develop story without access to story file"</check>
<check>If task requirements ambiguous → ASK user to clarify or HALT</check>
```

**AFTER (Correct):**

```xml
<action if="story file inaccessible">HALT: "Cannot develop story without access to story file"</action>
<action if="task requirements ambiguous">ASK user to clarify or HALT</action>
```

---

## Impact Assessment

### Technical Impact

1. **XML Validity:** Invalid structure violates XML parsing rules
2. **Formatter Confusion:** Custom formatters incorrectly indent following content
3. **Scope Ambiguity:** Unclear which actions are inside vs outside conditional
4. **Maintainability:** Future developers confused by ambiguous structure

### LLM Adherence Impact

**Potential Issues:**

- LLM may interpret check as unconditional statement
- Actions may execute when they shouldn't (or vice versa)
- Inconsistent behavior across different LLMs
- Unpredictable results in complex nested conditionals

**Observed Behavior:**

- LLMs often "figure it out" through context and proximity
- Colon (`:`) pattern signals "here's what to do"
- Works in simple cases but risky in complex logic

**Risk Level:** MEDIUM-HIGH

- May work "most of the time" but unreliable
- Fails in edge cases and complex nested logic
- Future LLMs may interpret differently

---

## Root Cause Analysis

### Why This Happened

1. **Implicit convention evolved** - Self-closing check pattern emerged organically
2. **No enforcement** - No linter or validator caught the pattern
3. **Copy-paste propagation** - Pattern copied across workflows
4. **Formatting hid the issue** - Manual indentation made it "look right"
5. **LLM tolerance** - Current LLMs often figured it out despite ambiguity

### Meta-Problem

**The workflows that CREATE workflows have the antipattern:**

- create-workflow: 2 instances
- create-agent: 11 instances
- create-module: 12 instances
- edit-workflow: 21 instances
- convert-legacy: 13 instances

This means NEW workflows were being created WITH the antipattern built-in!

---

## Remediation Plan

### Phase 1: Immediate (High Priority Files)

Fix top 5 offenders (63% of problem):

1. edit-workflow (21 instances)
2. dev-story (13 instances)
3. convert-legacy (13 instances)
4. create-module (12 instances)
5. create-agent (11 instances)

**Total:** 70 instances (71% of problem)

### Phase 2: Core Workflows

Fix core workflows (critical for all modules):

1. party-mode (7 instances)
2. brainstorming (5 instances)

**Total:** 12 instances

### Phase 3: Remaining

Fix remaining 16 instances across 7 files

### Phase 4: Prevention

1. **Update audit-workflow** ✅ DONE
   - Added antipattern detection to Step 4
   - Flags with CRITICAL severity
   - Suggests correct patterns

2. **Update creation guide** ✅ DONE
   - Documented antipattern in workflow-creation-guide.md
   - Clear examples of correct vs incorrect patterns
   - Added to best practices

3. **Update checklist** ✅ DONE
   - Added validation criteria to checklist.md
   - 3 new checks for conditional execution patterns

4. **Create automated fixer** (TODO)
   - Bulk conversion script for remaining instances
   - Pattern matching and replacement logic

---

## Specification Reference

From `bmad/core/tasks/workflow.xml`:

```xml
<tag>action if="condition" - Single conditional action (inline, no closing tag needed)</tag>
<tag>check if="condition">...</check> - Conditional block wrapping multiple items (closing tag required)</tag>
```

**Key Point:** Check tags MUST have `if=""` attribute and MUST wrap content with closing tag.

The self-closing pattern `<check>text</check>` is **NOT in the spec** and is **invalid**.

---

## Detection Command

To find all instances:

```bash
grep -r "<check>[^<]*</check>" src --include="*.md" -n
```

To count by file:

```bash
grep -r "<check>[^<]*</check>" src --include="*.md" -c | grep -v ":0$"
```

---

## Next Actions

- [ ] Create bulk-fix script for automated conversion
- [ ] Fix Phase 1 files (70 instances)
- [ ] Fix Phase 2 files (12 instances)
- [ ] Fix Phase 3 files (16 instances)
- [ ] Run audit-workflow on all fixed files to verify
- [ ] Update formatter to detect and warn on antipattern
- [ ] Add pre-commit hook to prevent future instances

---

## References

- **Workflow Spec:** `bmad/core/tasks/workflow.xml`
- **Creation Guide:** `src/modules/bmb/workflows/create-workflow/workflow-creation-guide.md`
- **Audit Workflow:** `src/modules/bmb/workflows/audit-workflow/`
- **This Report:** `docs/antipattern-audit-2025-10-22.md`

---

**Report Status:** Complete
**Action Required:** Yes - 98 instances need remediation
**Priority:** CRITICAL - Affects core functionality and workflow creation
