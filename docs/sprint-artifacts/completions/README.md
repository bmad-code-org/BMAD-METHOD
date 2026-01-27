---
title: Agent Completion Artifacts
description: Documentation for agent completion artifact contract and formats
---

# Agent Completion Artifacts

This directory stores completion artifacts created by BMAD workflow agents.

## Purpose

**Problem:** Agents were failing to update story files reliably (60% success rate).

**Solution:** Agents create JSON completion artifacts instead. Orchestrator reads these artifacts to update story files mechanically.

## Contract

### Agent Responsibility
Each agent MUST create a completion artifact before finishing:
- File path: `{{story_key}}-{{agent_name}}.json`
- Format: Structured JSON (see formats below)
- Verification: File exists = work done (binary check)

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

## Artifact Formats

### Builder Completion (`{{story_key}}-builder.json`)

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

### Inspector Completion (`{{story_key}}-inspector.json`)

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
    "lib/billing/payment-processor.ts",
    "lib/billing/__tests__/payment-processor.test.ts"
  ],
  "timestamp": "2026-01-27T02:35:00Z"
}
```

### Reviewer Completion (`{{story_key}}-reviewer.json`)

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
      "location": "api/occupant/agreement/route.ts:45",
      "description": "SQL injection vulnerability"
    },
    {
      "severity": "HIGH",
      "location": "lib/rentals/expiration-alerts.ts:67",
      "description": "N+1 query pattern"
    }
  ],
  "files_reviewed": [
    "api/occupant/agreement/route.ts",
    "lib/rentals/expiration-alerts.ts"
  ],
  "timestamp": "2026-01-27T02:40:00Z"
}
```

### Fixer Completion (`{{story_key}}-fixer.json`)

**This is the FINAL artifact used by orchestrator for reconciliation.**

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
    "Added authorization check in admin route (CRITICAL)",
    "Fixed N+1 query pattern (HIGH)"
  ],
  "files_modified": [
    "api/occupant/agreement/route.ts",
    "api/admin/rentals/spaces/[id]/route.ts",
    "lib/rentals/expiration-alerts.ts"
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

## Verification Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Agent Phase                                                  │
├─────────────────────────────────────────────────────────────┤
│ 1. Agent does work (build/inspect/review/fix)              │
│ 2. Agent creates completion.json with Write tool            │
│ 3. Agent returns "AGENT COMPLETE" message                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Verification Gate                                            │
├─────────────────────────────────────────────────────────────┤
│ 1. Orchestrator checks: [ -f "$COMPLETION_FILE" ]          │
│ 2. If missing → HALT (hard stop)                           │
│ 3. If exists → Verify files claimed actually exist          │
│ 4. If files missing → HALT (hard stop)                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Reconciliation Phase (After Fixer)                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Orchestrator reads fixer completion.json                │
│ 2. Orchestrator parses JSON for structured data            │
│ 3. Orchestrator updates story file using Edit tool         │
│ 4. Orchestrator verifies updates with bash checks          │
│ 5. If verification fails → Fix and retry                   │
└─────────────────────────────────────────────────────────────┘
```

## Benefits

**Reliability:** 60% → 100% (file exists is binary)
**Simplicity:** No complex output parsing
**Auditability:** JSON files are version controlled
**Debuggability:** Can inspect completion artifacts when issues occur
**Enforcement:** Can't proceed without completion artifact (hard stop)

## Cleanup

Completion artifacts can be deleted after successful reconciliation, or kept for audit trail.

Suggested cleanup: After story marked "done", move artifacts to archive or delete.

```bash
# Archive completed story artifacts
mv docs/sprint-artifacts/completions/19-4-*.json \
   docs/sprint-artifacts/completions/archive/

# Or delete after verification
rm docs/sprint-artifacts/completions/19-4-*.json
```
