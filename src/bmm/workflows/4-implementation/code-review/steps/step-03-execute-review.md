---
name: 'step-03-execute-review'
description: 'Execute full adversarial review and record actionable findings'
nextStepFile: './step-04-present-and-resolve.md'
---

  <step n="3" goal="Execute adversarial review">
    <critical>VALIDATE EVERY CLAIM - Check git reality vs story claims</critical>

    <!-- Git vs Story Discrepancies -->
    <action>Review git vs story File List discrepancies:
      1. **Files changed but not in story File List** → MEDIUM finding (incomplete documentation)
      2. **Story lists files but no git changes** → HIGH finding (false claims)
      3. **Uncommitted changes not documented** → MEDIUM finding (transparency issue)
    </action>

    <!-- Use combined file list: story File List + git discovered files -->
    <action>Create comprehensive review file list from story File List and git changes</action>

    <!-- AC Validation -->
    <action>For EACH Acceptance Criterion:
      1. Read the AC requirement
      2. Search implementation files for evidence
      3. Determine: IMPLEMENTED, PARTIAL, or MISSING
      4. If MISSING/PARTIAL → HIGH SEVERITY finding
    </action>

    <!-- Task Completion Audit -->
    <action>For EACH task marked [x]:
      1. Read the task description
      2. Search files for evidence it was actually done
      3. **CRITICAL**: If marked [x] but NOT DONE → CRITICAL finding
      4. Record specific proof (file:line)
    </action>

    <!-- Code Quality Deep Dive -->
    <action>For EACH file in comprehensive review list:
      1. **Security**: Look for injection risks, missing validation, auth issues
      2. **Performance**: N+1 queries, inefficient loops, missing caching
      3. **Error Handling**: Missing try/catch, poor error messages
      4. **Code Quality**: Complex functions, magic numbers, poor naming
      5. **Test Quality**: Are tests real assertions or placeholders?
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
  </step>

## Next
- Read fully and follow: `./step-04-present-and-resolve.md`.
