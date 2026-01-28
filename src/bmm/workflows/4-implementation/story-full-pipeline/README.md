# Story-Full-Pipeline v4.0

Enhanced multi-agent pipeline with playbook learning, code citation evidence, test quality validation, and resume-builder fixes.

## What's New in v4.0

### 1. Resume Builder (v3.2+)
**Token Efficiency: 50-70% savings**

- Phase 3 now RESUMES Builder agent with review findings
- Builder already has full codebase context
- More efficient than spawning fresh Fixer agent

### 2. Inspector Code Citations (v4.0)
**Evidence-Based Verification**

- Inspector must map EVERY task to file:line citations
- Example: "Create component" → "src/Component.tsx:45-67"
- No more "trust me, it works" - requires proof
- Returns structured JSON with code evidence per task

### 3. Remove Hospital-Grade Framing (v4.0)
**Focus on Concrete Verification**

- Dropped psychological appeal language
- Kept rigorous verification gates and bash checks
- Replaced with patterns/verification.md + patterns/tdd.md

### 4. Micro Stories Get Security Scan (v4.0)
**Even Simple Stories Need Security**

- No longer skip ALL review for micro stories
- Still get 2 reviewers: Security + Architect
- Lightweight but catches critical vulnerabilities

### 5. Test Quality Agent + Coverage Gate (v4.0)
**Validate Test Completeness**

- New Test Quality Agent validates:
  - Edge cases covered (null, empty, invalid)
  - Error conditions tested
  - Meaningful assertions (not just "doesn't crash")
  - No flaky tests (random data, timing)
- Automated Coverage Gate enforces 80% threshold
- Builder must fix test gaps before proceeding

### 6. Playbook Learning System (v4.0)
**Continuous Improvement Through Reflection**

- **Phase 0:** Query playbooks before implementation
- Builder gets relevant patterns/gotchas upfront
- **Phase 6:** Reflection agent extracts learnings
- Auto-generates playbook updates for future agents
- Bootstrap mode: auto-initializes playbooks if missing

## Pipeline Flow

```
Phase 0: Playbook Query (orchestrator)
         ↓
Phase 1: Builder (initial implementation)
         ↓
Phase 2: Inspector + Test Quality + N Reviewers (parallel)
         ↓
Phase 2.5: Coverage Gate (automated)
         ↓
Phase 3: Resume Builder (fix issues with context)
         ↓
Phase 4: Inspector re-check (quick verification)
         ↓
Phase 5: Orchestrator reconciliation (evidence-based)
         ↓
Phase 6: Playbook Reflection (extract learnings)
```

## Complexity Routing

| Complexity | Phase 2 Agents | Total | Reviewers |
|------------|----------------|-------|-----------|
| micro | Inspector + Test Quality + 2 | 4 agents | Security + Architect |
| standard | Inspector + Test Quality + 3 | 5 agents | Security + Logic + Architect |
| complex | Inspector + Test Quality + 4 | 6 agents | Security + Logic + Architect + Quality |

## Quality Gates

- **Coverage Threshold:** 80% line coverage required
- **Task Verification:** ALL tasks need file:line evidence
- **Critical Issues:** MUST fix
- **High Issues:** MUST fix

## Token Efficiency

- Phase 2 agents spawn in parallel (same cost, faster)
- Phase 3 resumes Builder (50-70% token savings vs fresh agent)
- Phase 4 Inspector only (no full re-review)

## Playbook Configuration

```yaml
playbooks:
  enabled: true
  directory: "docs/playbooks/implementation-playbooks"
  bootstrap_mode: true  # Auto-initialize if missing
  max_load: 3
  auto_apply_updates: false  # Require manual review
  discovery:
    enabled: true
    sources: ["git_history", "docs", "existing_code"]
```

## How It Avoids CooperBench Coordination Failures

Unlike the multi-agent coordination failures documented in CooperBench (Stanford/SAP 2026):

1. **Sequential Implementation** - ONE Builder agent implements entire story (no parallel implementation conflicts)
2. **Parallel Review** - Multiple agents review in parallel (safe read-only operations)
3. **Context Reuse** - SAME agent fixes issues (no expectation failures about partner state)
4. **Evidence-Based** - file:line citations prevent vague communication
5. **Clear Roles** - Builder writes, reviewers validate (no overlapping responsibilities)

The workflow uses agents for **verification parallelism**, not **implementation parallelism** - avoiding the "curse of coordination."

## Files

**Agent Prompts:**
- `agents/builder.md` - Implementation agent (with playbook awareness)
- `agents/inspector.md` - Validation agent (requires code citations)
- `agents/test-quality.md` - Test quality validation (v4.0)
- `agents/reviewer.md` - Adversarial review agent
- `agents/architect-integration-reviewer.md` - Architecture/integration review
- `agents/fixer.md` - Issue resolution agent (deprecated, uses resume Builder)
- `agents/reflection.md` - Playbook learning agent (v4.0)

**Workflow Config:**
- `workflow.yaml` - Main configuration (v4.0)
- `workflow.md` - Complete step-by-step documentation

**Templates:**
- `../templates/implementation-playbook-template.md` - Playbook structure

## Usage

```bash
# Run story-full-pipeline
/story-full-pipeline story_key=17-10
```

## Backward Compatibility

Falls back to single-agent mode if multi-agent execution fails.
