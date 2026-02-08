---
name: 'step-03-execute-review'
description: 'Execute full adversarial review and record actionable findings'
nextStepFile: './step-04-present-and-resolve.md'
reviewFindingsFile: '{story_dir}/review-findings.json'
---

  <step n="3" goal="Execute adversarial review">
    <critical>VALIDATE EVERY CLAIM - Check git reality vs story claims</critical>
    <critical>Every issue MUST be captured using the structured findings contract below</critical>

    <action>Initialize findings artifacts:
      - Set {{review_findings}} = [] (in-memory array)
      - Set {{review_findings_file}} = {reviewFindingsFile}
      - Set {{review_findings_schema}} = "id,severity,type,summary,detail,file_line,proof,suggested_fix,reviewer,timestamp"
      - Each finding record MUST contain:
        id, severity, type, summary, detail, file_line, proof, suggested_fix, reviewer, timestamp
      - `file_line` is the required `file:line` locator field and MUST use `path/to/file:line` format
      - `reviewer` value MUST be `senior-dev-review`
      - `timestamp` MUST use system ISO datetime
    </action>

    <!-- Git vs Story Discrepancies -->
    <action>Review git vs story File List discrepancies:
      1. **Files changed but not in story File List** → MEDIUM finding (incomplete documentation)
      2. **Story lists files but no git changes** → HIGH finding (false claims)
      3. **Uncommitted changes not documented** → MEDIUM finding (transparency issue)
      For every discrepancy, append a finding object to {{review_findings}}.
    </action>

    <!-- Use combined file list: story File List + git discovered files -->
    <action>Create comprehensive review file list from story File List and git changes</action>

    <!-- AC Validation -->
    <action>For EACH Acceptance Criterion:
      1. Read the AC requirement
      2. Search implementation files for evidence
      3. Determine: IMPLEMENTED, PARTIAL, or MISSING using this algorithm:
        - Parse each AC into explicit clauses (single requirement statements).
        - Evaluate each clause independently, then derive overall AC status from clause outcomes.
        - IMPLEMENTED:
          - EVERY clause has direct code evidence tied to the story execution path, and
          - Evidence includes at least one strong corroborator for AC behavior (automated test, integration test, or reproducible runtime proof), and
          - Weak evidence (docs/comments/README) is only supplemental.
        - PARTIAL:
          - One or more clauses have direct evidence, but at least one clause lacks direct evidence, OR
          - Coverage is only indirect (helper/generic utility not proven wired), OR
          - Evidence is mostly weak and not corroborated by code/tests.
        - MISSING:
          - No clause has credible direct implementation evidence, and
          - No test/runtime proof demonstrates AC behavior.
      4. Evidence-type rules:
        - Strong evidence: implementation code plus validating tests/runtime proof.
        - Medium evidence: implementation code without validating tests.
        - Weak evidence: comments, README/docs, design notes, screenshots, or unverifiable logs.
        - Weak evidence alone cannot qualify an AC as IMPLEMENTED.
      5. Indirect evidence rules:
        - Helper functions/utilities count as indirect until explicit call sites or integration coverage prove the AC path.
        - Generic capability not wired to this story remains PARTIAL.
      6. Severity mapping for AC gaps:
        - MISSING + security/data-loss/compliance/core user flow risk -> HIGH.
        - MISSING + non-core behavior or secondary UX/documentation requirement -> MEDIUM.
        - PARTIAL + security/data-integrity/compliance risk -> HIGH.
        - PARTIAL + degraded core behavior -> MEDIUM.
        - PARTIAL + optional/non-critical behavior gap with safe fallback -> LOW.
      7. Classification examples:
        - IMPLEMENTED example: AC requires validation + error response, and code path plus passing test covers all clauses.
        - PARTIAL example: helper exists and one clause passes, but integration path for another clause is unproven.
        - MISSING example: AC text exists, but no matching code path or tests are found.
      8. If AC is PARTIAL or MISSING, append a finding object to {{review_findings}} with status, severity, and clause-level proof.
    </action>

    <action>When creating findings from any action above, populate fields using this mapping:
      - id:
        - Git discrepancy: `GIT-DIFF-{{index}}`
        - AC gap: `AC-{{ac_id}}-{{status}}-{{index}}`
        - Task mismatch: `TASK-{{task_id}}-MISMATCH-{{index}}`
        - Code-quality issue: `CQ-{{category}}-{{index}}`
      - severity:
        - Use explicit severity rule from the originating action block
      - type:
        - `story-sync` for git/story discrepancies
        - `acceptance-criteria` for AC gaps
        - `task-audit` for task completion mismatches
        - `code-quality` for quality/security/performance/test issues
      - summary:
        - One-line, user-facing issue statement
      - detail:
        - Include violated expectation plus observed behavior
      - file_line:
        - `path/to/file:line` evidence anchor (use most relevant file and line)
      - proof:
        - Concrete evidence snippet (code, test output, or git command result)
      - suggested_fix:
        - Actionable implementation guidance
      - reviewer:
        - `senior-dev-review`
      - timestamp:
        - System ISO datetime at finding creation time
    </action>

    <!-- Task Completion Audit -->
    <action>For EACH task marked [x]:
      1. Read the task description
      2. Search files for evidence it was actually done
      3. **CRITICAL**: If marked [x] but NOT DONE → CRITICAL finding
      4. Record specific proof (file:line)
      5. Append finding object to {{review_findings}} when mismatch is found
    </action>

    <!-- Code Quality Deep Dive -->
    <action>For EACH file in comprehensive review list:
      1. **Security**: Look for injection risks, missing validation, auth issues
      2. **Performance**: N+1 queries, inefficient loops, missing caching
      3. **Error Handling**: Missing try/catch, poor error messages
      4. **Code Quality**: Complex functions, magic numbers, poor naming
      5. **Test Quality**: Are tests real assertions or placeholders?
      6. For each issue, append finding object to {{review_findings}}
    </action>

    <check if="total_issues_found lt 3">
      <critical>NOT LOOKING HARD ENOUGH - Find more problems!</critical>
      <action>Re-examine code for:
        - Edge cases and null handling
        - Architecture violations
        - Documentation gaps
        - Integration issues
        - Dependency problems
        - Git commit message quality (if applicable)
      </action>
      <action>Find at least 3 more specific, actionable issues</action>
    </check>

    <action>Persist findings contract for downstream step:
      - Save {{review_findings}} as JSON array to {{review_findings_file}}
      - Ensure JSON is valid and each finding includes all required fields
      - Set {{findings_contract}} = "JSON array at {{review_findings_file}} with schema {{review_findings_schema}}"
      - Step 4 MUST load findings from {{review_findings_file}} and validate against {{review_findings_schema}} before presenting or resolving
    </action>

    <action>Example finding record (must match real records):
      {
        "id": "AC-003-MISSING-001",
        "severity": "HIGH",
        "type": "acceptance-criteria",
        "summary": "AC-3 missing null-check in API handler",
        "detail": "Endpoint accepts null payload despite AC requiring rejection with 400.",
        "file_line": "src/api/handler.ts:87",
        "proof": "No guard before dereference; test suite lacks AC-3 rejection test.",
        "suggested_fix": "Add null guard + 400 response and add regression test in test/api/handler.test.ts.",
        "reviewer": "senior-dev-review",
        "timestamp": "2026-02-08T00:00:00.000Z"
      }
    </action>
  </step>

## Next
- Read fully and follow: `./step-04-present-and-resolve.md`.
