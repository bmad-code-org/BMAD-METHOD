---
name: 'step-05-consolidate-findings'
description: 'Merge and deduplicate findings from both review phases'

workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/code-review'
thisStepFile: '{workflow_path}/steps/step-05-consolidate-findings.md'
nextStepFile: '{workflow_path}/steps/step-06-resolve-and-update.md'
---

# Step 5: Consolidate Findings

**Goal:** Merge findings from context-aware review (Phase 1) and adversarial review (Phase 2), deduplicate, and present unified findings table.

---

## AVAILABLE STATE

From previous steps:

- `{story_path}`, `{story_key}`
- `{context_aware_findings}` - Findings from Phase 1 (step 3)
- `{asymmetric_findings}` - Findings from Phase 2 (step 4)

---

## STATE VARIABLE (capture now)

- `{consolidated_findings}` - Merged, deduplicated findings

---

## EXECUTION SEQUENCE

### 1. Merge All Findings

Combine both finding lists:

```
all_findings = {context_aware_findings} + {asymmetric_findings}
```

### 2. Deduplicate Findings

Identify duplicates (same underlying issue found by both phases):

**Duplicate Detection Criteria:**

- Same file + same line range
- Same issue type (e.g., both about error handling in same function)
- Overlapping descriptions

**Resolution Rule:**

Keep the MORE DETAILED version:

- If context-aware finding has AC reference → keep that
- If adversarial finding has better technical detail → keep that
- When in doubt, keep context-aware (has more context)

Mark duplicates as merged:

```
{
  id: "CF-{n}",
  merged_from: ["CAF-3", "AAF-2"],
  kept_version: "CAF-3",
  reason: "Context-aware version includes AC reference"
}
```

### 3. Normalize Severity

Apply consistent severity scale:

| Severity | Icon | Criteria |
| --- | --- | --- |
| CRITICAL | RED | Security vuln, data loss, tasks marked done but not, broken core functionality |
| HIGH | ORANGE | Missing AC implementation, logic errors, missing critical error handling |
| MEDIUM | YELLOW | Performance issues, incomplete features, documentation gaps |
| LOW | GREEN | Code style, minor improvements, suggestions |

### 4. Filter Noise

Review adversarial findings marked as NOISE:

- If clearly false positive (e.g., style preference, not actual issue) → exclude
- If questionable → keep with UNDECIDED validity
- If context reveals it's actually valid → upgrade to REAL

**Do NOT filter:**

- Any CRITICAL or HIGH severity
- Any context-aware findings (they have story context)

### 5. Create Consolidated Table

Build `{consolidated_findings}`:

```markdown
| ID | Severity | Source | Description | Location |
|----|----------|--------|-------------|----------|
| CF-1 | CRITICAL | task-audit | Task 3 marked [x] but not implemented | src/auth.ts |
| CF-2 | HIGH | ac-validation | AC2 partially implemented | src/api/*.ts |
| CF-3 | HIGH | adversarial | Missing error handling in API calls | src/api/client.ts:45 |
| CF-4 | MEDIUM | git-discrepancy | File changed but not in story | src/utils.ts |
| CF-5 | LOW | adversarial | Magic number should be constant | src/config.ts:12 |
```

### 6. Present Consolidated Findings

```markdown
**Consolidated Code Review Findings**

**Story:** {story_key}

**Summary:**
- Total findings: {count}
- CRITICAL: {count}
- HIGH: {count}
- MEDIUM: {count}
- LOW: {count}

**Deduplication:** {merged_count} duplicate findings merged

---

## Findings by Severity

### CRITICAL (Must Fix)
{list critical findings with full details}

### HIGH (Should Fix)
{list high findings with full details}

### MEDIUM (Consider Fixing)
{list medium findings}

### LOW (Nice to Fix)
{list low findings}

---

**Phase Sources:**
- Context-Aware (Phase 1): {count} findings
- Adversarial (Phase 2): {count} findings
```

---

## NEXT STEP DIRECTIVE

**CRITICAL:** When this step completes, explicitly state:

"**NEXT:** Loading `step-06-resolve-and-update.md`"

---

## SUCCESS METRICS

- All findings merged from both phases
- Duplicates identified and resolved (kept more detailed)
- Severity normalized consistently
- Noise filtered appropriately (but not excessively)
- Consolidated table created
- `{consolidated_findings}` populated
- Summary presented to user
- Explicit NEXT directive provided

## FAILURE MODES

- Missing findings from either phase
- Not detecting duplicates (double-counting issues)
- Inconsistent severity assignment
- Filtering real issues as noise
- Not storing consolidated findings
- No explicit NEXT directive at step completion
