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
      - Each finding record MUST contain:
        id, severity, type, summary, detail, file_line, proof, suggested_fix, reviewer, timestamp
      - `file_line` format MUST be `path/to/file:line`
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
        - IMPLEMENTED:
          - Direct code evidence exists for ALL AC clauses, and
          - At least one corroborating test OR deterministic runtime verification exists, and
          - Any docs/comments are supported by code/test evidence.
        - PARTIAL:
          - Some AC clauses have direct implementation evidence but one or more clauses are missing OR only indirectly covered, or
          - Evidence is helper/utility code not clearly wired to the story path, or
          - Evidence is docs/comments only without strong corroboration.
        - MISSING:
          - No credible code/test/docs evidence addresses the AC clauses.
      4. Evidence-strength rules:
        - Code + tests = strong evidence
        - Code only = medium evidence
        - Docs/comments/README only = weak evidence (cannot justify IMPLEMENTED alone)
      5. Indirect evidence rules:
        - Generic helpers/utilities count as PARTIAL unless explicitly wired by call sites OR integration tests.
      6. Severity mapping for AC gaps:
        - MISSING critical-path AC → HIGH
        - MISSING non-critical AC → MEDIUM
        - PARTIAL critical-path AC → HIGH
        - PARTIAL non-critical AC → MEDIUM
      7. If AC is PARTIAL or MISSING, append a finding object to {{review_findings}}.
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
      - Set {{findings_contract}} = "JSON array at {{review_findings_file}}"
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
