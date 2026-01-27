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

<verification_checklist>
## Implementation Execution Checklist

**Story {{story_key}} requires these exact steps (cannot skip):**

### Prerequisites (Auto-Fixed)
- [ ] **Step 0.1:** Story file exists (auto-create if missing)
- [ ] **Step 0.2:** Gap analysis complete (auto-run if missing)

### Phase 1: Builder (Steps 1-4)
- [ ] **Step 1.1:** Builder agent spawned
- [ ] **Step 1.2:** Builder creates completion artifact
- [ ] **Step 1.3:** Verify artifact exists (file check)
- [ ] **Step 1.4:** Verify claimed files exist

### Phase 2: Inspector (Steps 5-6)
- [ ] **Step 2.1:** Inspector agent spawned (fresh context)
- [ ] **Step 2.2:** Inspector runs all quality checks
- [ ] **Step 2.3:** Inspector creates completion artifact
- [ ] **Step 2.4:** Verify PASS verdict

### Phase 3: Reviewer (Step 7) [Skip if micro complexity]
- [ ] **Step 3.1:** Reviewer agent spawned (adversarial)
- [ ] **Step 3.2:** Reviewer finds issues
- [ ] **Step 3.3:** Reviewer creates completion artifact
- [ ] **Step 3.4:** Categorize issues (CRITICAL/HIGH/MEDIUM/LOW)

### Phase 4: Fixer (Steps 8-9)
- [ ] **Step 4.1:** Fixer agent spawned
- [ ] **Step 4.2:** Fixer resolves CRITICAL + HIGH issues
- [ ] **Step 4.3:** Fixer creates completion artifact
- [ ] **Step 4.4:** Fixer commits changes
- [ ] **Step 4.5:** Verify git commit exists

### Phase 5: Reconciliation (Orchestrator)
- [ ] **Step 5.1:** Load Fixer completion artifact
- [ ] **Step 5.2:** Parse JSON for structured data
- [ ] **Step 5.3:** Update story file tasks (check off completed)
- [ ] **Step 5.4:** Fill Dev Agent Record
- [ ] **Step 5.5:** Verify story file updated (bash check)

### Final Verification
- [ ] **Step 6.1:** Git commit exists for story
- [ ] **Step 6.2:** Story has checked tasks (count > 0)
- [ ] **Step 6.3:** Dev Agent Record filled
- [ ] **Step 6.4:** Sprint status updated to "done"

**If any step fails:**
- HALT immediately
- Report which step failed
- Fix before proceeding
- Cannot skip steps
</verification_checklist>

<step name="ensure_prerequisites" priority="first">
**AUTO-FIX MISSING PREREQUISITES**

```bash
STORY_FILE="docs/sprint-artifacts/{{story_key}}.md"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 CHECKING PREREQUISITES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**Check 1: Story file exists?**
```bash
if [ ! -f "$STORY_FILE" ]; then
  echo "⚠️  Story file not found, creating it..."
fi
```

If story file missing:
- Use Skill tool to invoke: `/bmad_bmm_create-story {{story_key}}`
- Wait for completion
- Verify file created: `[ -f "$STORY_FILE" ] || exit 1`

```bash
echo "✅ Story file exists: $STORY_FILE"
```

**Check 2: Gap analysis complete?**
```bash
GAP_COUNT=$(grep -c "^✅\|^❌" "$STORY_FILE" || echo "0")

if [ "$GAP_COUNT" -eq 0 ]; then
  echo "⚠️  Gap analysis missing, running it..."
fi
```

If gap analysis missing:
- Use Skill tool to invoke: `/bmad_bmm_gap-analysis {{story_key}}`
- Wait for completion
- Verify markers exist: `GAP_COUNT=$(grep -c "^✅\|^❌" "$STORY_FILE")`
- If still 0: exit 1 (can't auto-fix)

```bash
echo "✅ Gap analysis complete: $GAP_COUNT markers found"
echo "✅ All prerequisites satisfied"
echo ""
```

**Load story metadata:**

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

**Wait for completion.**

**VERIFICATION GATE: Builder Completion**

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 VERIFYING BUILDER COMPLETION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check completion artifact exists
COMPLETION_FILE="docs/sprint-artifacts/completions/{{story_key}}-builder.json"

if [ ! -f "$COMPLETION_FILE" ]; then
  echo ""
  echo "❌ BLOCKER: Builder failed to create completion artifact"
  echo "Expected: $COMPLETION_FILE"
  echo ""
  echo "Pipeline halted. Builder must create completion.json"
  exit 1
fi

echo "✅ Completion artifact found"

# Verify files claimed in artifact actually exist
echo "Verifying claimed files..."

# Parse files from JSON and verify existence
# (Simplified - orchestrator will do full JSON parsing)
FILES_MISSING=0
while IFS= read -r file; do
  if [ ! -f "$file" ]; then
    echo "❌ MISSING: $file"
    FILES_MISSING=$((FILES_MISSING + 1))
  else
    echo "✅ Found: $file"
  fi
done < <(grep -o '"[^"]*\.\(ts\|tsx\|js\|jsx\)"' "$COMPLETION_FILE" | tr -d '"')

if [ "$FILES_MISSING" -gt 0 ]; then
  echo ""
  echo "❌ BLOCKER: $FILES_MISSING files missing"
  echo "Builder claimed to create files that don't exist"
  exit 1
fi

echo "✅ All claimed files verified"
echo ""
```

If verification fails: halt pipeline.
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

**Step 5.1: Verify completion artifact exists**
```bash
FIXER_COMPLETION="docs/sprint-artifacts/completions/{{story_key}}-fixer.json"

if [ ! -f "$FIXER_COMPLETION" ]; then
  echo "❌ BLOCKER: Fixer completion artifact missing"
  echo "Cannot reconcile without completion data"
  exit 1
fi

echo "✅ Completion artifact found"
```

**Step 5.2: Load completion data**
Use Read tool on the Fixer completion artifact:
- `docs/sprint-artifacts/completions/{{story_key}}-fixer.json`

Parse JSON to extract:
- files_modified array
- files_created array (from Builder artifact if needed)
- git_commit hash
- quality_checks results
- tests counts

**Step 5.3: Read story file**
Use Read tool: `docs/sprint-artifacts/{{story_key}}.md`

**Step 5.4: Check off completed tasks**
For each task in the story:
- Match task description to files in completion artifact
- If file mentioned in task was created/modified, check off task
- Use Edit tool to change `- [ ]` to `- [x]`

**Step 5.5: Fill Dev Agent Record**
Use Edit tool to update Dev Agent Record section with data from completion.json:
```markdown
### Dev Agent Record
**Implementation Date:** {{timestamp from completion.json}}
**Agent Model:** Claude Sonnet 4.5 (multi-agent pipeline)
**Git Commit:** {{git_commit from completion.json}}

**Files Created:**
{{files_created from Builder completion.json}}

**Files Modified:**
{{files_modified from Fixer completion.json}}

**Tests:**
- Passing: {{tests.passing from Fixer completion.json}}
- Total: {{tests.total from Fixer completion.json}}
- Coverage: {{tests.coverage from Fixer completion.json}}%

**Quality Checks:**
{{quality_checks from Fixer completion.json}}

**Issues Fixed:**
{{fixes_applied from Fixer completion.json}}
```

**Step 5.6: Verify updates**
```bash
CHECKED=$(grep -c "^- \[x\]" docs/sprint-artifacts/{{story_key}}.md)
if [ "$CHECKED" -eq 0 ]; then
  echo "❌ BLOCKER: Zero checked tasks"
  echo "Orchestrator failed to update story file"
  exit 1
fi
echo "✅ Verified: $CHECKED tasks checked"

# Verify Dev Agent Record has timestamp
grep -A 10 "### Dev Agent Record" docs/sprint-artifacts/{{story_key}}.md | grep -q "202" || {
  echo "❌ BLOCKER: Dev Agent Record not filled"
  exit 1
}
echo "✅ Dev Agent Record filled"
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
