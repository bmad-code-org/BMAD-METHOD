# Super-Dev-Pipeline v3.1 - Token-Efficient Multi-Agent Pipeline

<purpose>
Implement a story using parallel verification agents with Builder context reuse.
Each agent has single responsibility. Builder fixes issues in its own context (50-70% token savings).
Orchestrator handles bookkeeping (story file updates, verification).
</purpose>

<philosophy>
**Token-Efficient Multi-Agent Pipeline**

- Builder implements (creative, context preserved)
- Inspector + Reviewers validate in parallel (verification, fresh context)
- Builder fixes issues (creative, reuses context - 50-70% token savings)
- Inspector re-checks (verification, quick check)
- Orchestrator reconciles story file (mechanical)

**Key Innovation:** Resume Builder instead of spawning fresh Fixer.
Builder already knows the codebase - just needs to fix specific issues.

Trust but verify. Fresh context for verification. Reuse context for fixes.
</philosophy>

<config>
name: story-full-pipeline
version: 3.2.0
execution_mode: multi_agent

phases:
  phase_1: Builder (saves agent_id)
  phase_2: [Inspector + N Reviewers] in parallel (N = 2/3/4 based on complexity)
  phase_3: Resume Builder with all findings (reuses context)
  phase_4: Inspector re-check (quick verification)
  phase_5: Orchestrator reconciliation

reviewer_counts:
  micro: 2 reviewers (security, architect/integration) v3.2.0+
  standard: 3 reviewers (security, logic/performance, architect/integration) v3.2.0+
  complex: 4 reviewers (security, logic, architect/integration, code quality) v3.2.0+

token_efficiency:
  - Phase 2 agents spawn in parallel (same cost, faster)
  - Phase 3 resumes Builder (50-70% token savings vs fresh Fixer)
  - Phase 4 Inspector only (no full re-review)
</config>

<execution_context>
@patterns/hospital-grade.md
@patterns/agent-completion.md
</execution_context>

<process>

<step name="load_story" priority="first">
Load and validate the story file.

\`\`\`bash
STORY_FILE="docs/sprint-artifacts/{{story_key}}.md"
[ -f "$STORY_FILE" ] || { echo "ERROR: Story file not found"; exit 1; }
\`\`\`

Use Read tool on the story file. Parse:
- Complexity level (micro/standard/complex)
- Task count
- Acceptance criteria count

Determine which agents to spawn based on complexity routing.
</step>

<step name="spawn_builder">
**Phase 1: Builder Agent (Steps 1-4)**

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔨 PHASE 1: BUILDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

Spawn Builder agent and save agent_id for later resume.

**CRITICAL: Save Builder's agent_id for later resume**

\`\`\`
BUILDER_AGENT_ID={{agent_id_from_task_result}}
echo "Builder agent: $BUILDER_AGENT_ID"
\`\`\`

Wait for completion. Parse structured output. Verify files exist.

If files missing or status FAILED: halt pipeline.
</step>

<step name="spawn_verification_parallel">
**Phase 2: Parallel Verification (Inspector + Reviewers)**

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 PHASE 2: PARALLEL VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

**CRITICAL: Spawn ALL verification agents in ONE message (parallel execution)**

Determine reviewer count based on complexity:
\`\`\`
if complexity == "micro": REVIEWER_COUNT = 1
if complexity == "standard": REVIEWER_COUNT = 2
if complexity == "complex": REVIEWER_COUNT = 3
\`\`\`

Spawn Inspector + N Reviewers in single message. Wait for ALL agents to complete. Collect findings.

Aggregate all findings from Inspector + Reviewers.
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
🔧 PHASE 5: RECONCILIATION (Orchestrator)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

**YOU (orchestrator) do this directly. No agent spawn.**

1. Get what was built (git log, git diff)
2. Read story file
3. Check off completed tasks (Edit tool)
4. Fill Dev Agent Record with pipeline details
5. Verify updates (grep task checkboxes)
6. Update sprint-status.yaml to "done"
</step>

<step name="final_verification">
**Final Quality Gate**

Verify:
1. Git commit exists
2. Story tasks checked (count > 0)
3. Dev Agent Record filled
4. Sprint status updated

If verification fails: fix using Edit, then re-verify.
</step>

</process>

<failure_handling>
**Builder fails:** Don't spawn verification. Report failure and halt.
**Inspector fails (Phase 2):** Still run Reviewers in parallel, collect all findings together.
**Inspector fails (Phase 4):** Resume Builder again with new issues (iterative fix loop).
**Builder resume fails:** Report unfixed issues. Manual intervention needed.
**Reconciliation fails:** Fix using Edit tool. Re-verify checkboxes.
</failure_handling>

<complexity_routing>
| Complexity | Pipeline | Reviewers | Total Phase 2 Agents |
|------------|----------|-----------|---------------------|
| micro | Builder → [Inspector + 2 Reviewers] → Resume Builder → Inspector recheck | 2 (security, architect) | 3 agents |
| standard | Builder → [Inspector + 3 Reviewers] → Resume Builder → Inspector recheck | 3 (security, logic, architect) | 4 agents |
| complex | Builder → [Inspector + 4 Reviewers] → Resume Builder → Inspector recheck | 4 (security, logic, architect, quality) | 5 agents |

**Key Improvements (v3.2.0):**
- All verification agents spawn in parallel (single message, faster execution)
- Builder resume in Phase 3 saves 50-70% tokens vs spawning fresh Fixer
- **NEW:** Architect/Integration Reviewer catches runtime issues (404s, pattern violations, missing migrations)

**Reviewer Specializations:**
- **Security:** Auth, injection, secrets, cross-tenant access
- **Logic/Performance:** Bugs, edge cases, N+1 queries, race conditions
- **Architect/Integration:** Routes work, patterns match, migrations applied, dependencies installed (v3.2.0+)
- **Code Quality:** Maintainability, naming, duplication (complex only)
</complexity_routing>

<success_criteria>
- [ ] Builder spawned and agent_id saved
- [ ] All verification agents completed in parallel
- [ ] Builder resumed with consolidated findings
- [ ] Inspector recheck passed
- [ ] Git commit exists for story
- [ ] Story file has checked tasks (count > 0)
- [ ] Dev Agent Record filled with all phases
- [ ] Sprint status updated to "done"
</success_criteria>
