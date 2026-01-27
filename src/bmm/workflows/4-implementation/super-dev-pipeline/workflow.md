# Super-Dev-Pipeline v3.0 - Unified Workflow

<purpose>
Implement a story using 4 independent agents with orchestrator-driven reconciliation.
Each agent has single responsibility. No agent validates its own work.
Orchestrator handles bookkeeping (story file updates, verification).
</purpose>

<philosophy>
**Agents do creative work. Orchestrator does bookkeeping.**

- Builder implements (creative)
- Inspector validates (verification)
- Reviewer finds issues (adversarial)
- Fixer resolves issues (creative)
- Orchestrator reconciles story file (mechanical)

Trust but verify. Fresh context per phase. Adversarial review.
</philosophy>

<config>
name: super-dev-pipeline
version: 3.0.0
execution_mode: multi_agent

agents:
  builder: {steps: 1-4, trust: low, timeout: 60min}
  inspector: {steps: 5-6, trust: medium, fresh_context: true, timeout: 30min}
  reviewer: {steps: 7, trust: high, adversarial: true, timeout: 30min}
  fixer: {steps: 8-9, trust: medium, timeout: 40min}

complexity_routing:
  micro: {skip: [reviewer], description: "Low-risk stories"}
  standard: {skip: [], description: "Normal stories"}
  complex: {skip: [], enhanced_review: true, description: "High-risk stories"}
</config>

<execution_context>
@patterns/hospital-grade.md
@patterns/agent-completion.md
</execution_context>

<process>

<step name="load_story" priority="first">
Load and validate the story file.

```bash
STORY_FILE="docs/sprint-artifacts/{{story_key}}.md"
[ -f "$STORY_FILE" ] || { echo "ERROR: Story file not found"; exit 1; }
```

Use Read tool on the story file. Parse:
- Complexity level (micro/standard/complex)
- Task count
- Acceptance criteria count

Determine which agents to spawn based on complexity routing.
</step>

<step name="spawn_builder">
**Phase 1: Builder Agent (Steps 1-4)**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔨 PHASE 1: BUILDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Spawn Builder agent:

```
Task({
  subagent_type: "general-purpose",
  description: "Implement story {{story_key}}",
  prompt: `
You are the BUILDER agent for story {{story_key}}.

<execution_context>
@patterns/hospital-grade.md
@patterns/tdd.md
@patterns/agent-completion.md
</execution_context>

<context>
Story: [inline story file content]
</context>

<objective>
Implement the story requirements:
1. Load and understand requirements
2. Analyze what exists vs needed
3. Write tests first (TDD)
4. Implement production code
</objective>

<constraints>
- DO NOT validate your own work
- DO NOT review your code
- DO NOT update story checkboxes
- DO NOT commit changes
</constraints>

<success_criteria>
- [ ] Tests written for all requirements
- [ ] Production code implements tests
- [ ] Return ## AGENT COMPLETE with file lists
</success_criteria>
`
})
```

**Wait for completion. Parse structured output.**

Verify files exist:
```bash
# For each file in "Files Created" and "Files Modified":
[ -f "$file" ] || echo "MISSING: $file"
```

If files missing or status FAILED: halt pipeline.
</step>

<step name="spawn_inspector">
**Phase 2: Inspector Agent (Steps 5-6)**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 PHASE 2: INSPECTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Spawn Inspector agent with **fresh context** (no Builder knowledge):

```
Task({
  subagent_type: "general-purpose",
  description: "Validate story {{story_key}} implementation",
  prompt: `
You are the INSPECTOR agent for story {{story_key}}.

<execution_context>
@patterns/verification.md
@patterns/hospital-grade.md
@patterns/agent-completion.md
</execution_context>

<context>
Story: [inline story file content]
</context>

<objective>
Independently verify the implementation:
1. Verify files exist and have content
2. Run type-check, lint, build
3. Run tests yourself
4. Give honest PASS/FAIL verdict
</objective>

<constraints>
- You have NO KNOWLEDGE of what Builder did
- Run all checks yourself
- Don't trust any claims
</constraints>

<success_criteria>
- [ ] All files verified to exist
- [ ] Type check passes (0 errors)
- [ ] Lint passes (0 warnings)
- [ ] Tests pass
- [ ] Return ## AGENT COMPLETE with evidence
</success_criteria>
`
})
```

**Wait for completion. Parse verdict.**

If FAIL: halt pipeline, report specific failures.
</step>

<step name="spawn_reviewer" if="complexity != micro">
**Phase 3: Reviewer Agent (Step 7)**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔎 PHASE 3: REVIEWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Spawn Reviewer agent with **adversarial stance**:

```
Task({
  subagent_type: "general-purpose",
  description: "Review story {{story_key}} code",
  prompt: `
You are the ADVERSARIAL REVIEWER for story {{story_key}}.

<execution_context>
@patterns/security-checklist.md
@patterns/hospital-grade.md
@patterns/agent-completion.md
</execution_context>

<context>
Story: [inline story file content]
</context>

<objective>
Find problems. Be critical. Look for:
- Security vulnerabilities (CRITICAL)
- Logic bugs and edge cases (HIGH)
- Performance issues (MEDIUM)
- Code style issues (LOW)
</objective>

<constraints>
- Your goal is to FIND ISSUES
- Don't rubber-stamp
- Be thorough
</constraints>

<success_criteria>
- [ ] All new files reviewed
- [ ] Security checks completed
- [ ] Issues categorized by severity
- [ ] Return ## AGENT COMPLETE with issue list
</success_criteria>
`
})
```

**Wait for completion. Parse issue counts.**
</step>

<step name="spawn_fixer">
**Phase 4: Fixer Agent (Steps 8-9)**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 PHASE 4: FIXER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Spawn Fixer agent:

```
Task({
  subagent_type: "general-purpose",
  description: "Fix issues in story {{story_key}}",
  prompt: `
You are the FIXER agent for story {{story_key}}.

<execution_context>
@patterns/hospital-grade.md
@patterns/agent-completion.md
</execution_context>

<context>
Story: [inline story file content]
Review issues: [inline reviewer findings]
</context>

<objective>
Fix CRITICAL and HIGH issues:
1. Fix ALL CRITICAL issues (security)
2. Fix ALL HIGH issues (bugs)
3. Fix MEDIUM if time allows
4. Skip LOW (gold-plating)
5. Commit with descriptive message
</objective>

<constraints>
- DO NOT skip CRITICAL issues
- DO NOT update story checkboxes (orchestrator does this)
- DO NOT update sprint-status (orchestrator does this)
</constraints>

<success_criteria>
- [ ] All CRITICAL fixed
- [ ] All HIGH fixed
- [ ] Tests still pass
- [ ] Git commit created
- [ ] Return ## AGENT COMPLETE with fix summary
</success_criteria>
`
})
```

**Wait for completion. Parse commit hash and fix counts.**
</step>

<step name="reconcile_story">
**Phase 5: Orchestrator Reconciliation**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 PHASE 5: RECONCILIATION (Orchestrator)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**YOU (orchestrator) do this directly. No agent spawn.**

**Step 5.1: Get what was built**
```bash
git log -3 --oneline | grep "{{story_key}}"
git diff HEAD~1 --name-only | head -20
```

**Step 5.2: Read story file**
Use Read tool: `docs/sprint-artifacts/{{story_key}}.md`

**Step 5.3: Check off completed tasks**
For each task related to files changed, use Edit tool:
```
old_string: "- [ ] Task description"
new_string: "- [x] Task description"
```

**Step 5.4: Fill Dev Agent Record**
Use Edit tool to update Dev Agent Record section with:
- Agent Model: Claude Sonnet 4 (multi-agent pipeline)
- Implementation Date: {{date}}
- Files Created/Modified: [list from git diff]
- Tests Added: [count from Inspector]
- Completion Notes: [brief summary]

**Step 5.5: Verify updates**
```bash
CHECKED=$(grep -c "^- \[x\]" docs/sprint-artifacts/{{story_key}}.md)
if [ "$CHECKED" -eq 0 ]; then
  echo "❌ BLOCKER: Zero checked tasks"
  exit 1
fi
echo "✅ Verified: $CHECKED tasks checked"
```

If verification fails: fix using Edit, then re-verify.
</step>

<step name="final_verification">
**Final Quality Gate**

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 FINAL VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Git commit exists
git log --oneline -3 | grep "{{story_key}}" || { echo "❌ No commit"; exit 1; }
echo "✅ Git commit found"

# 2. Story tasks checked
CHECKED=$(grep -c "^- \[x\]" docs/sprint-artifacts/{{story_key}}.md)
[ "$CHECKED" -gt 0 ] || { echo "❌ No tasks checked"; exit 1; }
echo "✅ $CHECKED tasks checked"

# 3. Dev Agent Record filled
grep -A 3 "### Dev Agent Record" docs/sprint-artifacts/{{story_key}}.md | grep -q "202" || { echo "❌ Record not filled"; exit 1; }
echo "✅ Dev Agent Record filled"

echo ""
echo "✅ STORY COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**Update sprint-status.yaml:**
Use Edit tool to change story status from `ready-for-dev` to `done`.
</step>

</process>

<failure_handling>
**Builder fails:** Don't spawn Inspector. Report failure.
**Inspector fails:** Don't spawn Reviewer. Report specific failures.
**Reviewer finds CRITICAL:** Fixer must fix (not optional).
**Fixer fails:** Report unfixed issues. Manual intervention needed.
**Reconciliation fails:** Fix using Edit tool. Re-verify.
</failure_handling>

<complexity_routing>
| Complexity | Agents | Notes |
|------------|--------|-------|
| micro | Builder → Inspector → Fixer | Skip Reviewer (low risk) |
| standard | Builder → Inspector → Reviewer → Fixer | Full pipeline |
| complex | Builder → Inspector → Reviewer (enhanced) → Fixer | Extra scrutiny |
</complexity_routing>

<success_criteria>
- [ ] All agents completed successfully
- [ ] Git commit exists for story
- [ ] Story file has checked tasks (count > 0)
- [ ] Dev Agent Record filled
- [ ] Sprint status updated to "done"
</success_criteria>
