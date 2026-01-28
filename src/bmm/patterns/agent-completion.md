# Agent Completion Artifact Pattern

**Problem:** Agents fail to update story files reliably (60% success rate)
**Solution:** Agents create completion.json artifacts. Orchestrator uses them to update story files.

## The Contract

### Agent Responsibility
Each agent MUST create a completion artifact before finishing:
- **File path:** `docs/sprint-artifacts/completions/{{story_key}}-{{agent_name}}.json`
- **Format:** Structured JSON (see formats below)
- **Verification:** File exists = work done (binary check)

### Orchestrator Responsibility
Orchestrator reads completion artifacts and:
- Parses JSON for structured data
- Updates story file tasks (check off completed)
- Fills Dev Agent Record with evidence
- Verifies updates succeeded

## Why This Works

**File-based verification:**
- ✅ Binary check: File exists or doesn't
- ✅ No complex parsing of agent output
- ✅ No reconciliation logic needed
- ✅ Hard stop if artifact missing

**JSON format:**
- ✅ Easy to parse reliably
- ✅ Structured data (not prose)
- ✅ Version controllable
- ✅ Auditable trail

## How to Use This Pattern

### In Agent Prompts

Include this in every agent prompt:

```markdown
## CRITICAL: Create Completion Artifact

**MANDATORY:** Before returning, you MUST create a completion artifact JSON file.

**File Path:** `docs/sprint-artifacts/completions/{{story_key}}-{{agent_name}}.json`

**Format:**
```json
{
  "story_key": "{{story_key}}",
  "agent": "{{agent_name}}",
  "status": "SUCCESS",
  "files_created": ["file1.ts", "file2.ts"],
  "files_modified": ["file3.ts"],
  "timestamp": "2026-01-27T02:30:00Z"
}
```

**Use Write tool to create this file. No exceptions.**
```

### In Orchestrator Verification

After agent completes, verify artifact exists:

```bash
COMPLETION_FILE="docs/sprint-artifacts/completions/{{story_key}}-{{agent}}.json"

if [ ! -f "$COMPLETION_FILE" ]; then
  echo "❌ BLOCKER: Agent failed to create completion artifact"
  exit 1
fi

echo "✅ Completion artifact found"
```

### In Reconciliation

Parse artifact to update story file:

```markdown
1. Load completion artifact with Read tool
2. Parse JSON to extract data
3. Use Edit tool to update story file
4. Verify updates with bash checks
```

## Artifact Formats by Agent

### Builder Completion

```json
{
  "story_key": "19-4",
  "agent": "builder",
  "status": "SUCCESS",
  "tasks_completed": [
    "Create PaymentProcessor service",
    "Add retry logic with exponential backoff"
  ],
  "files_created": [
    "lib/billing/payment-processor.ts",
    "lib/billing/__tests__/payment-processor.test.ts"
  ],
  "files_modified": [
    "lib/billing/worker.ts"
  ],
  "tests": {
    "files": 2,
    "cases": 15
  },
  "timestamp": "2026-01-27T02:30:00Z"
}
```

### Inspector Completion

```json
{
  "story_key": "19-4",
  "agent": "inspector",
  "status": "PASS",
  "quality_checks": {
    "type_check": "PASS",
    "lint": "PASS",
    "build": "PASS"
  },
  "tests": {
    "passing": 45,
    "failing": 0,
    "total": 45,
    "coverage": 95
  },
  "files_verified": [
    "lib/billing/payment-processor.ts"
  ],
  "timestamp": "2026-01-27T02:35:00Z"
}
```

### Reviewer Completion

```json
{
  "story_key": "19-4",
  "agent": "reviewer",
  "status": "ISSUES_FOUND",
  "issues": {
    "critical": 2,
    "high": 3,
    "medium": 4,
    "low": 2,
    "total": 11
  },
  "must_fix": [
    {
      "severity": "CRITICAL",
      "location": "api/route.ts:45",
      "description": "SQL injection vulnerability"
    }
  ],
  "files_reviewed": [
    "api/route.ts"
  ],
  "timestamp": "2026-01-27T02:40:00Z"
}
```

### Fixer Completion (FINAL)

```json
{
  "story_key": "19-4",
  "agent": "fixer",
  "status": "SUCCESS",
  "issues_fixed": {
    "critical": 2,
    "high": 3,
    "total": 5
  },
  "fixes_applied": [
    "Fixed SQL injection in agreement route (CRITICAL)",
    "Added authorization check (CRITICAL)"
  ],
  "files_modified": [
    "api/route.ts"
  ],
  "quality_checks": {
    "type_check": "PASS",
    "lint": "PASS",
    "build": "PASS"
  },
  "tests": {
    "passing": 48,
    "failing": 0,
    "total": 48,
    "coverage": 96
  },
  "git_commit": "a1b2c3d4e5f",
  "timestamp": "2026-01-27T02:50:00Z"
}
```

## Benefits

- **Reliability:** 60% → 100% (file exists is binary)
- **Simplicity:** No complex output parsing
- **Auditability:** JSON files are version controlled
- **Debuggability:** Can inspect artifacts when issues occur
- **Enforcement:** Can't proceed without completion artifact (hard stop)

## Anti-Patterns

**Don't do this:**
- ❌ Trust agent output without verification
- ❌ Parse agent prose for structured data
- ❌ Let agents update story files directly
- ❌ Skip artifact creation ("just this once")

**Do this instead:**
- ✅ Verify artifact exists (binary check)
- ✅ Parse JSON for reliable data
- ✅ Orchestrator updates story files
- ✅ Hard stop if artifact missing
