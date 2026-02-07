---
name: 'step-04-present-and-resolve'
description: 'Present findings and either apply fixes or create follow-up action items'
nextStepFile: './step-05-update-status.md'
---

  <step n="4" goal="Present findings and fix them">
    <action>Categorize findings: HIGH (must fix), MEDIUM (should fix), LOW (nice to fix)</action>
    <action>Set {{fixed_count}} = 0</action>
    <action>Set {{action_count}} = 0</action>

    <output>**Code Review Findings, {user_name}**

      **Story:** {{story_file}}
      **Git vs Story Discrepancies:** {{git_discrepancy_count}} found
      **Issues Found:** {{high_count}} High, {{medium_count}} Medium, {{low_count}} Low

      ## 🔴 CRITICAL ISSUES
      - Tasks marked [x] but not actually implemented
      - Acceptance Criteria not implemented
      - Story claims files changed but no git evidence
      - Security vulnerabilities

      ## 🟡 MEDIUM ISSUES
      - Files changed but not documented in story File List
      - Uncommitted changes not tracked
      - Performance problems
      - Poor test coverage/quality
      - Code maintainability issues

      ## 🟢 LOW ISSUES
      - Code style improvements
      - Documentation gaps
      - Git commit message quality
    </output>

    <ask>What should I do with these issues?

      1. **Fix them automatically** - I'll update the code and tests
      2. **Create action items** - Add to story Tasks/Subtasks for later
      3. **Show me details** - Deep dive into specific issues

      Choose [1], [2], or specify which issue to examine:</ask>

    <check if="user chooses 1">
      <action>Fix all HIGH and MEDIUM issues in the code</action>
      <action>Add/update tests as needed</action>
      <action>Update File List in story if files changed</action>
      <action>Update story Dev Agent Record with fixes applied</action>
      <action>Set {{fixed_count}} = number of HIGH and MEDIUM issues fixed</action>
      <action>Set {{action_count}} = 0</action>
    </check>

    <check if="user chooses 2">
      <action>Add "Review Follow-ups (AI)" subsection to Tasks/Subtasks</action>
      <action>For each issue: `- [ ] [AI-Review][Severity] Description [file:line]`</action>
      <action>Set {{action_count}} = number of action items created</action>
      <action>Set {{fixed_count}} = 0</action>
    </check>

    <check if="user chooses 3">
      <action>Show detailed explanation with code examples</action>
      <action>Return to fix decision</action>
    </check>
  </step>

## Next
- Read fully and follow: `./step-05-update-status.md`.
