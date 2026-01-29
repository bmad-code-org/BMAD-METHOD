# Story-Full-Pipeline v4.0 - Enhanced Multi-Agent Pipeline

<purpose>
Implement a story using parallel verification agents with Builder context reuse.
Enhanced with playbook learning, code citation evidence, test quality validation, and automated coverage gates.
Builder fixes issues in its own context (50-70% token savings).
</purpose>

<philosophy>
**Quality Through Discipline, Continuous Learning**

- Playbook Query: Load relevant patterns before starting
- Builder: Implements with playbook knowledge (context preserved)
- Inspector + Test Quality + Reviewers: Validate in parallel with proof
- Coverage Gate: Automated threshold enforcement
- Builder: Fixes issues in same context (50-70% token savings)
- Inspector: Quick recheck
- Orchestrator: Reconciles mechanically
- Reflection: Updates playbooks for future agents

Trust but verify. Fresh context for verification. Evidence-based validation. Self-improving system.
</philosophy>

<config>
name: story-full-pipeline
version: 4.0.0
execution_mode: multi_agent

phases:
  phase_0: Playbook Query (orchestrator)
  phase_1: Builder (saves agent_id)
  phase_2: [Inspector + Test Quality + N Reviewers] in parallel
  phase_2.5: Coverage Gate (automated)
  phase_3: Resume Builder with all findings (reuses context)
  phase_4: Inspector re-check (quick verification)
  phase_5: Orchestrator reconciliation
  phase_6: Playbook Reflection

reviewer_counts:
  micro: 2 reviewers (security, architect/integration)
  standard: 3 reviewers (security, logic/performance, architect/integration)
  complex: 4 reviewers (security, logic, architect/integration, code quality)

quality_gates:
  coverage_threshold: 80  # % line coverage required
  task_verification: "all_with_evidence"  # Inspector must cite file:line
  critical_issues: "must_fix"
  high_issues: "must_fix"

token_efficiency:
  - Phase 2 agents spawn in parallel (same cost, faster)
  - Phase 3 resumes Builder (50-70% token savings vs fresh agent)
  - Phase 4 Inspector only (no full re-review)

playbooks:
  enabled: true
  directory: "docs/playbooks/implementation-playbooks"
  max_load: 3
  auto_apply_updates: false
</config>

<execution_context>
@patterns/verification.md
@patterns/tdd.md
@patterns/agent-completion.md
</execution_context>

<process>

<step name="load_story" priority="first">
**Load and parse story file**

\`\`\`bash
STORY_FILE="docs/sprint-artifacts/{{story_key}}.md"
[ -f "$STORY_FILE" ] || { echo "ERROR: Story file not found"; exit 1; }
\`\`\`

Use Read tool. Extract:
- Task count
- Acceptance criteria count
- Keywords for risk scoring

**Determine complexity:**
\`\`\`bash
TASK_COUNT=$(grep -c "^- \[ \]" "$STORY_FILE")
RISK_KEYWORDS=$(grep -ciE "auth|security|payment|encryption|migration|database" "$STORY_FILE")

if [ "$TASK_COUNT" -le 3 ] && [ "$RISK_KEYWORDS" -eq 0 ]; then
  COMPLEXITY="micro"
  REVIEWER_COUNT=2
elif [ "$TASK_COUNT" -ge 16 ] || [ "$RISK_KEYWORDS" -gt 0 ]; then
  COMPLEXITY="complex"
  REVIEWER_COUNT=4
else
  COMPLEXITY="standard"
  REVIEWER_COUNT=3
fi
\`\`\`

Determine agents to spawn: Inspector + Test Quality + $REVIEWER_COUNT Reviewers
</step>

<step name="query_playbooks">
**Phase 0: Playbook Query**

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 PHASE 0: PLAYBOOK QUERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

**Extract story keywords:**
\`\`\`bash
STORY_KEYWORDS=$(grep -E "^## Story Title|^### Feature|^## Business Context" "$STORY_FILE" | sed 's/[#]//g' | tr '\n' ' ')
echo "Story keywords: $STORY_KEYWORDS"
\`\`\`

**Search for relevant playbooks:**
Use Grep tool:
- Pattern: extracted keywords
- Path: \`docs/playbooks/implementation-playbooks/\`
- Output mode: files_with_matches
- Limit: 3 files

**Load matching playbooks:**
For each playbook found:
- Use Read tool
- Extract sections: Common Gotchas, Code Patterns, Test Requirements

If no playbooks exist:
\`\`\`
ℹ️  No playbooks found - this will be the first story to create them
\`\`\`

Store playbook content for Builder.
</step>

<step name="spawn_builder">
**Phase 1: Builder Agent**

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔨 PHASE 1: BUILDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

Spawn Builder agent and **SAVE agent_id for resume later**:

\`\`\`
BUILDER_TASK = Task({
  subagent_type: "general-purpose",
  description: "Implement story {{story_key}}",
  prompt: \`
You are the BUILDER agent for story {{story_key}}.

<execution_context>
@patterns/tdd.md
@patterns/agent-completion.md
</execution_context>

<context>
Story: [inline story file content]

{{IF playbooks loaded}}
Relevant Playbooks (review before implementing):
[inline playbook content]

Pay special attention to:
- Common Gotchas in these playbooks
- Code Patterns to follow
- Test Requirements to satisfy
{{ENDIF}}
</context>

<objective>
Implement the story requirements:
1. Review story tasks and acceptance criteria
2. **Review playbooks** for gotchas and patterns (if provided)
3. Analyze what exists vs needed (gap analysis)
4. **Write tests FIRST** (TDD - tests before implementation)
5. Implement production code to pass tests
</objective>

<constraints>
- DO NOT validate your own work
- DO NOT review your code
- DO NOT update story checkboxes
- DO NOT commit changes yet
</constraints>

<success_criteria>
- [ ] Reviewed playbooks for guidance
- [ ] Tests written for all requirements
- [ ] Production code implements tests
- [ ] Tests pass
- [ ] Return structured completion artifact
</success_criteria>

<completion_format>
Return structured JSON artifact:
{
  "agent": "builder",
  "story_key": "{{story_key}}",
  "status": "SUCCESS" | "FAILED",
  "files_created": ["path/to/file.tsx", ...],
  "files_modified": ["path/to/file.tsx", ...],
  "tests_added": {
    "total": 12,
    "passing": 12
  },
  "tasks_addressed": ["task description from story", ...]
}

Save to: docs/sprint-artifacts/completions/{{story_key}}-builder.json
</completion_format>
\`
})

BUILDER_AGENT_ID = {{extract agent_id from Task result}}
\`\`\`

**CRITICAL: Store Builder agent ID:**
\`\`\`bash
echo "Builder agent ID: $BUILDER_AGENT_ID"
echo "$BUILDER_AGENT_ID" > /tmp/builder-agent-id.txt
\`\`\`

**Wait for completion. Verify artifact exists:**
\`\`\`bash
BUILDER_COMPLETION="docs/sprint-artifacts/completions/{{story_key}}-builder.json"
[ -f "$BUILDER_COMPLETION" ] || { echo "❌ No builder artifact"; exit 1; }
\`\`\`

**Verify files exist:**
\`\`\`bash
# For each file in files_created and files_modified:
[ -f "$file" ] || echo "❌ MISSING: $file"
\`\`\`

If files missing or status FAILED: halt pipeline.
</step>

<step name="spawn_verification_parallel">
**Phase 2: Parallel Verification (Inspector + Test Quality + Reviewers)**

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 PHASE 2: PARALLEL VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Spawning: Inspector + Test Quality + {{REVIEWER_COUNT}} Reviewers
Total agents: {{2 + REVIEWER_COUNT}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

**CRITICAL: Spawn ALL agents in ONE message (parallel execution)**

Send single message with multiple Task calls:
1. Inspector Agent
2. Test Quality Agent
3. Security Reviewer
4. Logic/Performance Reviewer (if standard/complex)
5. Architect/Integration Reviewer
6. Code Quality Reviewer (if complex)

---

## Inspector Agent Prompt:

\`\`\`
Task({
  subagent_type: "general-purpose",
  description: "Validate story {{story_key}} implementation",
  prompt: \`
You are the INSPECTOR agent for story {{story_key}}.

<execution_context>
@patterns/verification.md
@patterns/agent-completion.md
</execution_context>

<context>
Story: [inline story file content]
</context>

<objective>
Independently verify implementation WITH CODE CITATIONS:

1. Read story file - understand ALL tasks
2. Read each file Builder created/modified
3. **Map EACH task to specific code with file:line citations**
4. Run verification checks:
   - Type-check (0 errors required)
   - Lint (0 warnings required)
   - Tests (all passing required)
   - Build (success required)
</objective>

<critical_requirement>
**EVERY task must have evidence.**

For each task, provide:
- file:line where it's implemented
- Brief quote of relevant code
- Verdict: IMPLEMENTED or NOT_IMPLEMENTED

Example:
Task: "Display occupant agreement status"
Evidence: src/features/agreement/StatusBadge.tsx:45-67
Code: "const StatusBadge = ({ status }) => ..."
Verdict: IMPLEMENTED
</critical_requirement>

<constraints>
- You have NO KNOWLEDGE of what Builder did
- Run all checks yourself - don't trust claims
- **Every task needs file:line citation**
- If code doesn't exist: mark NOT IMPLEMENTED with reason
</constraints>

<success_criteria>
- [ ] ALL tasks mapped to code locations
- [ ] Type check: 0 errors
- [ ] Lint: 0 warnings
- [ ] Tests: all passing
- [ ] Build: success
- [ ] Return structured evidence
</success_criteria>

<completion_format>
{
  "agent": "inspector",
  "story_key": "{{story_key}}",
  "verdict": "PASS" | "FAIL",
  "task_verification": [
    {
      "task": "Create agreement view component",
      "implemented": true,
      "evidence": [
        {
          "file": "src/features/agreement/AgreementView.tsx",
          "lines": "15-67",
          "code_snippet": "export const AgreementView = ({ agreementId }) => {...}"
        },
        {
          "file": "src/features/agreement/AgreementView.test.tsx",
          "lines": "8-45",
          "code_snippet": "describe('AgreementView', () => {...})"
        }
      ]
    },
    {
      "task": "Add status badge",
      "implemented": false,
      "evidence": [],
      "reason": "No StatusBadge component found in src/features/agreement/"
    }
  ],
  "checks": {
    "type_check": {"passed": true, "errors": 0},
    "lint": {"passed": true, "warnings": 0},
    "tests": {"passed": true, "total": 12, "passing": 12},
    "build": {"passed": true}
  }
}

Save to: docs/sprint-artifacts/completions/{{story_key}}-inspector.json
</completion_format>
\`
})
\`\`\`

---

## Test Quality Agent Prompt:

\`\`\`
Task({
  subagent_type: "general-purpose",
  description: "Review test quality for {{story_key}}",
  prompt: \`
You are the TEST QUALITY agent for story {{story_key}}.

<context>
Story: [inline story file content]
Builder completion: [inline builder artifact]
</context>

<objective>
Review test files for quality and completeness:

1. Find all test files created/modified by Builder
2. For each test file, verify:
   - **Happy path**: Primary functionality tested ✓
   - **Edge cases**: null, empty, invalid inputs ✓
   - **Error conditions**: Failures handled properly ✓
   - **Assertions**: Meaningful checks (not just "doesn't crash")
   - **Test names**: Descriptive and clear
   - **Deterministic**: No random data, no timing dependencies
3. Check that tests actually validate the feature

**Focus on:** What's missing? What edge cases weren't considered?
</objective>

<success_criteria>
- [ ] All test files reviewed
- [ ] Edge cases identified (covered or missing)
- [ ] Error conditions verified
- [ ] Assertions are meaningful
- [ ] Tests are deterministic
- [ ] Return quality assessment
</success_criteria>

<completion_format>
{
  "agent": "test_quality",
  "story_key": "{{story_key}}",
  "verdict": "PASS" | "NEEDS_IMPROVEMENT",
  "test_files_reviewed": ["path/to/test.tsx", ...],
  "issues": [
    {
      "severity": "HIGH",
      "file": "path/to/test.tsx:45",
      "issue": "Missing edge case: empty input array",
      "recommendation": "Add test: expect(fn([])).toThrow(...)"
    },
    {
      "severity": "MEDIUM",
      "file": "path/to/test.tsx:67",
      "issue": "Test uses Math.random() - could be flaky",
      "recommendation": "Use fixed test data"
    }
  ],
  "coverage_analysis": {
    "edge_cases_covered": true | false,
    "error_conditions_tested": true | false,
    "meaningful_assertions": true | false,
    "tests_are_deterministic": true | false
  },
  "summary": {
    "high_issues": 1,
    "medium_issues": 2,
    "low_issues": 0
  }
}

Save to: docs/sprint-artifacts/completions/{{story_key}}-test-quality.json
</completion_format>
\`
})
\`\`\`

---

(Continue with Security, Logic, Architect, Quality reviewers as before...)

**Wait for ALL agents to complete.**

Collect completion artifacts:
- \`inspector.json\`
- \`test-quality.json\`
- \`reviewer-security.json\`
- \`reviewer-logic.json\` (if spawned)
- \`reviewer-architect.json\`
- \`reviewer-quality.json\` (if spawned)

Parse all findings and aggregate by severity.
</step>

<step name="coverage_gate">
**Phase 2.5: Coverage Gate (Automated)**

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PHASE 2.5: COVERAGE GATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

Run coverage check:
\`\`\`bash
# Run tests with coverage
npm test -- --coverage --silent 2>&1 | tee coverage-output.txt

# Extract coverage percentage (adjust grep pattern for your test framework)
COVERAGE=$(grep -E "All files|Statements" coverage-output.txt | head -1 | grep -oE "[0-9]+\.[0-9]+|[0-9]+" | head -1 || echo "0")

echo "Coverage: ${COVERAGE}%"
echo "Threshold: {{coverage_threshold}}%"

# Compare coverage
if (( $(echo "$COVERAGE < {{coverage_threshold}}" | bc -l) )); then
  echo "❌ Coverage ${COVERAGE}% below threshold {{coverage_threshold}}%"
  echo "Builder must add more tests before proceeding"
  exit 1
fi

echo "✅ Coverage gate passed: ${COVERAGE}%"
\`\`\`

If coverage fails: add to issues list for Builder to fix.
</step>

<step name="resume_builder_with_findings">
**Phase 3: Resume Builder with All Findings**

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 PHASE 3: RESUME BUILDER (Fix Issues)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

**CRITICAL: Resume Builder agent (reuses context!)**

Use Task tool with `resume: "{{BUILDER_AGENT_ID}}"` parameter.

Builder receives all consolidated findings and fixes:
1. ALL CRITICAL issues (security, blockers)
2. ALL HIGH issues (bugs, logic errors)
3. MEDIUM if quick (<30 min total)
4. Skip LOW (gold-plating)
5. Commit with descriptive message

Wait for completion. Parse commit hash and fix counts.
</step>

<step name="inspector_recheck">
**Phase 4: Quick Inspector Re-Check**

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PHASE 4: RE-VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

Spawn Inspector only (not full review). Quick functional verification.

If FAIL: Resume Builder again with new issues.
If PASS: Proceed to reconciliation.
</step>

<step name="reconcile_story">
**Phase 5: Orchestrator Reconciliation**

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PHASE 5: RECONCILIATION (Orchestrator)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

**YOU (orchestrator) do this directly. No agent spawn.**

**5.1: Load completion artifacts**
\`\`\`bash
BUILDER_FIXES="docs/sprint-artifacts/completions/{{story_key}}-builder-fixes.json"
INSPECTOR="docs/sprint-artifacts/completions/{{story_key}}-inspector.json"
\`\`\`

Use Read tool on all artifacts.

**5.2: Read story file**
Use Read tool: \`docs/sprint-artifacts/{{story_key}}.md\`

**5.3: Check off completed tasks using Inspector evidence**

For each task in \`inspector.task_verification\`:
- If \`implemented: true\` and has evidence:
  - Use Edit tool: \`"- [ ] {{task}}"\` → \`"- [x] {{task}}"\`

**5.4: Fill Dev Agent Record with evidence**

Use Edit tool:
\`\`\`text
**Dev Agent Record**
**Implementation Date:** {{timestamp}}
**Agent Model:** Claude Sonnet 4.5 (multi-agent pipeline v4.0)
**Git Commit:** {{git_commit}}

**Pipeline Phases:**
- Phase 0: Playbook Query ({{playbooks_loaded}} loaded)
- Phase 1: Builder (initial implementation)
- Phase 2: Parallel Verification
  - Inspector: {{verdict}} with code citations
  - Test Quality: {{verdict}}
  - {{REVIEWER_COUNT}} Reviewers: {{issues_found}}
- Phase 2.5: Coverage Gate ({{coverage}}%)
- Phase 3: Builder (resumed, fixed {{fixes_count}} issues)
- Phase 4: Inspector re-check ({{verdict}})

**Files Created:** {{count}}
**Files Modified:** {{count}}
**Tests:** {{tests.passing}}/{{tests.total}} passing ({{coverage}}%)
**Issues Fixed:** {{critical}} CRITICAL, {{high}} HIGH, {{medium}} MEDIUM

**Task Evidence:** (Inspector code citations)
{{for each task with evidence}}
- [x] {{task}}
  - {{evidence[0].file}}:{{evidence[0].lines}}
{{endfor}}
\`\`\`

**5.5: Verify updates**
\`\`\`bash
CHECKED=$(grep -c "^- \[x\]" docs/sprint-artifacts/{{story_key}}.md)
[ "$CHECKED" -gt 0 ] || { echo "❌ Zero tasks checked"; exit 1; }
echo "✅ Reconciled: $CHECKED tasks with evidence"
\`\`\`
</step>

<step name="final_verification">
**Final Quality Gate**

\`\`\`bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 FINAL VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Git commit exists
git log --oneline -3 | grep "{{story_key}}" || { echo "❌ No commit"; exit 1; }
echo "✅ Git commit found"

# 2. Story tasks checked with evidence
CHECKED=$(grep -c "^- \[x\]" docs/sprint-artifacts/{{story_key}}.md)
[ "$CHECKED" -gt 0 ] || { echo "❌ No tasks checked"; exit 1; }
echo "✅ $CHECKED tasks checked with code citations"

# 3. Dev Agent Record filled
grep -A 5 "### Dev Agent Record" docs/sprint-artifacts/{{story_key}}.md | grep -q "202" || { echo "❌ Record not filled"; exit 1; }
echo "✅ Dev Agent Record filled"

# 4. Coverage met threshold
FINAL_COVERAGE=$(jq -r '.tests.coverage' docs/sprint-artifacts/completions/{{story_key}}-builder-fixes.json)
if (( $(echo "$FINAL_COVERAGE < {{coverage_threshold}}" | bc -l) )); then
  echo "❌ Coverage ${FINAL_COVERAGE}% still below threshold"
  exit 1
fi
echo "✅ Coverage: ${FINAL_COVERAGE}%"

echo ""
echo "✅ STORY COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
\`\`\`

**Update sprint-status.yaml:**
Use Edit tool: \`"{{story_key}}: ready-for-dev"\` → \`"{{story_key}}: done"\`
</step>

<step name="playbook_reflection">
**Phase 6: Playbook Reflection**

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 PHASE 6: PLAYBOOK REFLECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

Spawn Reflection Agent:

\`\`\`
Task({
  subagent_type: "general-purpose",
  description: "Extract learnings from {{story_key}}",
  prompt: \`
You are the REFLECTION agent for story {{story_key}}.

<context>
Story: [inline story file]
Builder initial: [inline builder.json]
All review findings: [inline all reviewer artifacts]
Builder fixes: [inline builder-fixes.json]
Test quality issues: [inline test-quality.json]
</context>

<objective>
Identify what future agents should know:

1. **What issues were found?** (from reviewers)
2. **What did Builder miss initially?** (gaps, edge cases, security)
3. **What playbook knowledge would have prevented these?**
4. **Which module/feature area does this apply to?**
5. **Should we update existing playbook or create new?**

Questions:
- What gotchas should future builders know?
- What code patterns should be standard?
- What test requirements are essential?
- What similar stories exist?
</objective>

<success_criteria>
- [ ] Analyzed review findings
- [ ] Identified preventable issues
- [ ] Determined which playbook(s) to update
- [ ] Return structured proposal
</success_criteria>

<completion_format>
{
  "agent": "reflection",
  "story_key": "{{story_key}}",
  "learnings": [
    {
      "issue": "SQL injection in query builder",
      "root_cause": "Builder used string concatenation (didn't know pattern)",
      "prevention": "Playbook should document: always use parameterized queries",
      "applies_to": "database queries, API endpoints with user input"
    },
    {
      "issue": "Missing edge case tests for empty arrays",
      "root_cause": "Test Quality Agent found gap",
      "prevention": "Playbook should require: test null/empty/invalid for all inputs",
      "applies_to": "all data processing functions"
    }
  ],
  "playbook_proposal": {
    "action": "update_existing" | "create_new",
    "playbook": "docs/playbooks/implementation-playbooks/database-api-patterns.md",
    "module": "api/database",
    "updates": {
      "common_gotchas": [
        "Never concatenate user input into SQL - use parameterized queries",
        "Test edge cases: null, undefined, [], '', invalid input"
      ],
      "code_patterns": [
        "db.query(sql, [param1, param2]) ✓",
        "sql + userInput ✗"
      ],
      "test_requirements": [
        "Test SQL injection attempts: expect(query(\"' OR 1=1--\")).toThrow()",
        "Test empty inputs: expect(fn([])).toHandle() or .toThrow()"
      ],
      "related_stories": ["{{story_key}}"]
    }
  }
}

Save to: docs/sprint-artifacts/completions/{{story_key}}-reflection.json
</completion_format>
\`
})
\`\`\`

**Wait for completion.**

**Review playbook proposal:**
\`\`\`bash
REFLECTION="docs/sprint-artifacts/completions/{{story_key}}-reflection.json"
ACTION=$(jq -r '.playbook_proposal.action' "$REFLECTION")
PLAYBOOK=$(jq -r '.playbook_proposal.playbook' "$REFLECTION")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Playbook Update Proposal"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Action: $ACTION"
echo "Playbook: $PLAYBOOK"
echo ""
jq -r '.learnings[] | "- \(.issue)\n  Prevention: \(.prevention)"' "$REFLECTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
\`\`\`

If \`auto_apply_updates: true\` in config:
- Read playbook (or create from template if new)
- Use Edit tool to add learnings to sections
- Commit playbook update

If \`auto_apply_updates: false\` (default):
- Display proposal for manual review
- User can apply later with \`/update-playbooks {{story_key}}\`
</step>

</process>

<failure_handling>
**Builder fails (Phase 1):** Don't spawn verification. Report failure and halt.
**Inspector fails (Phase 2):** Still collect other reviewer findings.
**Test Quality fails:** Add issues to Builder fix list.
**Coverage below threshold:** Add to Builder fix list.
**Reviewers find CRITICAL:** Builder MUST fix when resumed.
**Inspector fails (Phase 4):** Resume Builder again (iterative loop, max 3 iterations).
**Builder resume fails:** Report unfixed issues. Manual intervention.
**Reconciliation fails:** Fix with Edit tool, re-verify.
</failure_handling>

<complexity_routing>
| Complexity | Phase 2 Agents | Total | Security |
|------------|----------------|-------|----------|
| micro | Inspector + Test Quality + 2 Reviewers | 4 agents | Security Reviewer + Architect |
| standard | Inspector + Test Quality + 3 Reviewers | 5 agents | Security + Logic + Architect |
| complex | Inspector + Test Quality + 4 Reviewers | 6 agents | Security + Logic + Architect + Quality |

**All verification agents spawn in parallel (single message)**
</complexity_routing>

<success_criteria>
- [ ] Phase 0: Playbooks loaded (if available)
- [ ] Phase 1: Builder spawned, agent_id saved
- [ ] Phase 2: All verification agents completed in parallel
- [ ] Phase 2.5: Coverage gate passed
- [ ] Phase 3: Builder resumed with consolidated findings
- [ ] Phase 4: Inspector recheck passed
- [ ] Phase 5: Orchestrator reconciled with Inspector evidence
- [ ] Phase 6: Playbook reflection completed
- [ ] Git commit exists
- [ ] Story tasks checked with code citations
- [ ] Dev Agent Record filled
- [ ] Coverage ≥ {{coverage_threshold}}%
- [ ] Sprint status: done
</success_criteria>

<improvements_v4>
1. ✅ Resume Builder for fixes (v3.2+) - 50-70% token savings
2. ✅ Inspector provides code citations (v4.0) - file:line evidence for every task
3. ✅ Removed "hospital-grade" framing (v4.0) - kept disciplined gates
4. ✅ Micro stories get 2 reviewers + security scan (v3.2+) - not zero
5. ✅ Test Quality Agent (v4.0) + Coverage Gate (v4.0) - validates test quality and enforces threshold
6. ✅ Playbook query (v4.0) before Builder + reflection (v4.0) after - continuous learning
</improvements_v4>
