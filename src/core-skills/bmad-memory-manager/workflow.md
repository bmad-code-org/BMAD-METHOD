---
context_file: '' # Optional context file path for project-specific guidance
---

# Memory Manager Workflow

This workflow routes `persist`, `recover`, `list`, and `clear` requests into the correct storage surface, verifies the result when verification matters, and logs operations whenever the log surface already exists or the operation is already writing sidecar state. Treat the decision tables below as low-freedom instructions: precision matters more than improvisation.

---

## Setup

Before any write operation, ensure `_bmad/_memory/` exists at project root and is listed in `.gitignore`. Warn the user if it is not gitignored — sidecar data must never be committed. Read-only operations should report absence rather than materializing storage.

## Request Shapes

| Operation | Required fields | Notes |
|-----------|-----------------|-------|
| `persist` | `scope`, `key`, content, optional `caller:` | Writes session or workspace state |
| `recover` | `scope`, `key`, optional `caller:` | Returns stored state or null |
| `list` | optional `caller:` | Enumerates workspace sidecars |
| `clear` | `scope`, optional `target`, optional `caller:` | Clears one sidecar or all workspace sidecars |

### Naming Conventions

| Context | Pattern | Example |
|---------|---------|---------|
| Session (Copilot tool) | `/memories/session/{caller}-{key}.md` | `/memories/session/discovery-rigor-state-ledger.md` |
| Session fallback (sidecar) | `_bmad/_memory/{caller}-sidecar/{key}-{YYYY-MM-DD}.md` | `_bmad/_memory/discovery-rigor-sidecar/state-ledger-2026-03-24.md` |
| Workspace | `_bmad/_memory/{caller}-sidecar/{key}.md` | `_bmad/_memory/discovery-rigor-sidecar/learned-patterns.md` |
| Ops log | `_bmad/_memory/_ops-log.md` | (fixed path) |

---

## Caller Identity Resolution

Determine the caller ID before every operation using this table:

| Priority | Condition | Resolved Caller ID | Example |
|----------|-----------|---------------------|---------|
| 1 (highest) | `caller:` parameter provided | Value of `caller:` | `caller: "discovery-rigor"` → `discovery-rigor` |
| 2 (default) | No `caller:` parameter | `memory-manager` | User says "list workspace memory" → `memory-manager` |

Caller ID determines the sidecar directory name. `caller: "discovery-rigor"` → `_bmad/_memory/discovery-rigor-sidecar/`.

---

## Persist

Ensure `_bmad/_memory/` directory exists. Resolve caller identity. Prepare the provenance header.

| Row | Scope | Tool Available? | Verify Result | Action |
|-----|-------|-----------------|---------------|--------|
| P1 | session | yes | read-back matches | Write to `/memories/session/{caller}-{key}.md`. Log success. |
| P2 | session | yes | read-back fails | Fall back to `_bmad/_memory/{caller}-sidecar/{key}-{YYYY-MM-DD}.md`. Log warning + fallback. |
| P3 | session | no | n/a | Write to `_bmad/_memory/{caller}-sidecar/{key}-{YYYY-MM-DD}.md`. Log fallback. |
| P4 | workspace | n/a | n/a | Write to `_bmad/_memory/{caller}-sidecar/{key}.md` (overwrite). Log success. |

After the write completes:

1. Add the provenance header to the written file: `<!-- bmad-memory | skill: {caller} | last-write: {YYYY-MM-DD} | purpose: {key} -->`
2. Append an ops-log entry (see Ops Log section below).

> **Key distinctions:**
>
> - P2/P3 append `-{YYYY-MM-DD}` (ISO date, sorts lexicographically). These are ephemeral snapshots.
> - P4 has no date suffix — workspace files are overwrite-in-place canonical sidecars.
> - P2 is the verify-fail branch: session write succeeded but read-back didn't match → demote to sidecar.
> - One file per key per day for session fallback. A second persist on the same day overwrites the existing dated file.

---

## Recover

Resolve caller identity. Determine scope from the invocation.

| Row | Scope | Step 1 | Found? | Step 2 | Found? | Result |
|-----|-------|--------|--------|--------|--------|--------|
| R1 | session | Check `/memories/session/{caller}-{key}.md` | yes | — | — | Return content. Log success. |
| R2 | session | Check `/memories/session/{caller}-{key}.md` | no | Check `_bmad/_memory/{caller}-sidecar/{key}-*.md` (alphabetically last = latest date) | yes | Return content. Log "recovered from fallback". |
| R3 | session | Check `/memories/session/{caller}-{key}.md` | no | Check `_bmad/_memory/{caller}-sidecar/{key}-*.md` | no | Return null. Log "no state found". |
| R4 | workspace | Check `_bmad/_memory/{caller}-sidecar/{key}.md` | yes | — | — | Return content. Log success. |
| R5 | workspace | Check `_bmad/_memory/{caller}-sidecar/{key}.md` | no | — | — | Return null. Log "no state found". |

After the check completes, append an ops-log entry only if `_bmad/_memory/_ops-log.md` already exists. Do not create `_bmad/_memory/` or `_ops-log.md` for a read-only recover.

> **Key distinction for R2:** "Alphabetically last" works because the filename contract uses ISO 8601 dates (`{key}-YYYY-MM-DD.md`), which sort lexicographically. No date parsing required.

---

## Ops Log

The ops log lives at `_bmad/_memory/_ops-log.md`. It is append-only. Write operations append a row after completion; read-only operations append only when the log surface already exists.

**Format:**

```markdown
| Date | Skill | Operation | Scope | Key | Status |
|------|-------|-----------|-------|-----|--------|
| 2026-03-24 | discovery-rigor | persist | session | state-ledger | success |
```

**Rules:**

- If `_ops-log.md` does not exist yet, create it with the header row first, then append the data row.
- Append one row per operation when the log surface already exists. Read-only `recover` and `list` must not materialize `_bmad/_memory/` just to create an ops log.
- Status values: `success`, `fallback`, `warning`, `no-state-found`, `cleared`.
- The ops log is the primary debugging tool — log, don't halt.

---

## List

Resolve caller identity. Check that `_bmad/_memory/` exists — if it does not, report `no memory directory found` and stop without appending an ops-log entry because the log surface does not exist yet.

**Procedure:**

1. Enumerate all `*-sidecar/` directories under `_bmad/_memory/`.
2. For each sidecar directory, report:
   - **Skill name** — directory name with the `-sidecar` suffix stripped.
   - **File count** — number of files in the directory.
   - **Last modified** — date of the newest file.
3. Report `_ops-log.md` existence and row count (if it exists).
4. Append an ops-log entry.

---

## Clear

Resolve caller identity. Confirm the target scope.

| Row | Mode | Input | Deletes | Ops Log |
|-----|------|-------|---------|---------|
| C1 | Granular | `clear | scope: workspace | target: "{skill}"` | `_bmad/_memory/{skill}-sidecar/` contents only | Append `cleared {skill}` |
| C2 | Full | `clear | scope: workspace` | All `*-sidecar/` dirs + `_ops-log.md` | Log is deleted as part of clear |

After clear, the next memory operation will recreate `_ops-log.md` with a fresh header (per the Ops Log section rules).

> **Key distinction for C2:** The ops-log entry must be appended *before* deleting the ops log file. Order matters — C2 is the only operation where the log itself is destroyed. The entry serves as a "last known action" marker if the log is recreated later.
