# Security and Tenancy Review

**Goal:** Identify exploitable security vulnerabilities, authorization gaps, data isolation leaks (multi-tenancy), and unsafe concurrency primitives introduced or exposed by the changed code.
Ask one question — *"Could an untrusted input, unauthorized user, or concurrent execution cross trust boundaries, leak isolated tenant data, or corrupt runtime state?"*
Do not comment on style, conventions, or non-security refactoring.

---

## The Core Security and Isolation Threat Classes

Every finding must map to at least one of these concrete threat classes:

1. **Multi-Tenancy & Data Isolation Leak (High/Critical)**
   - Database queries/mutations touching shared tables without scoping by tenant/organization identifier (`org_id`, `tenant_id`).
   - `INSERT ... ON CONFLICT (...) DO UPDATE` (upserts) where the conflict target key is global or lacks explicit `tenant_id` guarding in the `WHERE` clause, allowing cross-tenant state overwriting.
   - Resource access by ID (e.g. `/resource/:id`, parameters from body or URL) without verifying tenant ownership before reading or mutating.
   - Real-time/PubSub broadcasts (WebSockets, SSE, EventBus, Redis PubSub) sending tenant-sensitive frames across shared channels or failing to isolate streams by tenant and authenticated actor.

2. **Broken Authorization & Privilege Escalation (High/Critical)**
   - Missing or weak authorization guards on newly exposed routes, RPC methods, or handlers.
   - Blind trust of client-supplied claims, headers, role flags, or impersonation tokens without server-side validation.
   - IDOR (Insecure Direct Object Reference) and missing object-level access controls.

3. **Injection & Data Deserialization (High/Critical)**
   - Dynamic SQL construction (`fmt.Sprintf`, string concatenation) instead of parameterized queries / placeholders.
   - Command injection via unescaped shell commands (`exec.Command`, `child_process.exec`, `sh -c`).
   - Unsafe HTML/template injection (XSS) in frontend/server-rendered templates.
   - Insecure deserialization or unvalidated deep JSON/XML parsing without payload bounds.

4. **Secrets, Authentication & Session Exposure (High)**
   - Hardcoded tokens, API keys, credentials, or private keys committed to source or tests without mocking.
   - Logging sensitive credentials, authorization tokens, or unmasked PII in server logs or analytics events.
   - Broken session lifetime, missing CSRF protection on state-changing endpoints, or missing signature checks.

5. **Concurrency, State Corruption & DoS (Medium/High)**
   - Data race on shared maps, slices, or structs without synchronization (`sync.RWMutex`, channels, atomics).
   - Sharing non-thread-safe request contexts (e.g. `gin.Context`, GORM `tx`) across asynchronous goroutines/tasks.
   - Unbounded input reading (`io.ReadAll` or stream readers without byte limits), creating memory exhaustion (DoS).
   - Missing rate-limiting or debounce on expensive external calls or authentication endpoints.

---

## Evidence Rules

- **Ground every claim with verifiable code trace:** State the exact entry point, the untrusted input or execution path, and the missing guard at file and line.
- **Trace the attack or failure path:** Explain concretely how the condition is reached. Theoretical vulnerabilities on unreachable code do not qualify.
- **State the observable harm:** Explain what an attacker or cross-tenant actor gains (e.g. "Tenant A can overwrite Tenant B's records via upsert", "unauthenticated caller can trigger remote command execution").
- Do NOT editorialize or propose sweeping architectural overhauls; provide a concise, minimal remediation snippet.
- Do NOT assign arbitrary rankings or priority labels; the triage layer determines final severity.

---

## Execution Sequence

### Step 1: Scope & Surface Identification
Identify changed files touching:
- API routes, RPC handlers, HTTP endpoints.
- Database queries, ORM calls, SQL migrations, repository methods.
- Authentication, authorization, session management, token parsing.
- Concurrency primitives (goroutines, async workers, shared caches, mutexes, WebSockets).
- External input parsing (multipart forms, file uploads, deserialization).

If the diff touches none of these surfaces (e.g., pure documentation, asset styling, typo fixes), return clean:
`[]` and stop.

### Step 2: Mechanical Threat Walk
For each changed line in scope, walk the 5 Threat Classes:
1. Is tenancy/organization scoping enforced on every query and mutation?
2. Are permissions checked before executing domain actions?
3. Are inputs sanitized and parameterized before reaching execution engines?
4. Are secrets or PII kept out of plaintext logs and client responses?
5. Is concurrent access safely locked and payload sizes capped?

### Step 3: Filter & Format Findings
Discard theoretical or already-guarded paths silently. Collect verified gaps.

---

## Output Format

Return ONLY a valid JSON array of objects. Each finding contains exactly these four fields:

```json
[
  {
    "location": "path/to/file.ext:123",
    "threat_class": "Multi-Tenancy Isolation Leak | Broken Authorization | Injection | Secret Exposure | Concurrency Defect",
    "vulnerability_description": "Precise description of what is unhandled and how the boundary is breached",
    "remediation": "Concise code change or guard required to secure the path"
  }
]
```

If no vulnerabilities or isolation gaps are found:
```json
[]
```
