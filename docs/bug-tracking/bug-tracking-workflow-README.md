# Bug Tracking Workflow Wireframe

## Quick Reference

```
COMMANDS:
  /triage              - Triage new bugs from bugs.md
  /implement bug-NNN   - Implement a bug fix
  /implement feature-N - Implement a feature
  /verify              - List pending verification
  /verify bug-NNN      - Verify and close specific bug
  /verify all          - Batch verify all

FILES:
  docs/bugs.md         - Human-readable bug tracking
  docs/bugs.yaml       - Agent-readable metadata

SEVERITY → COMPLEXITY → WORKFLOW ROUTING:
  ┌──────────┬─────────┬─────────┬─────────┬─────────┐
  │          │ TRIVIAL │ SMALL   │ MEDIUM  │ COMPLEX │
  ├──────────┼─────────┼─────────┼─────────┼─────────┤
  │ CRITICAL │ correct-course (any complexity)       │
  ├──────────┼─────────┼─────────┼─────────┼─────────┤
  │ HIGH     │direct-fx│tech-spec│corr-crs │corr-crs │
  ├──────────┼─────────┼─────────┼─────────┼─────────┤
  │ MEDIUM   │direct-fx│tech-spec│corr-crs │corr-crs │
  ├──────────┼─────────┼─────────┼─────────┼─────────┤
  │ LOW      │direct-fx│ backlog │ backlog │ backlog │
  └──────────┴─────────┴─────────┴─────────┴─────────┘

SEVERITY:
  critical - Core broken, crashes, data loss
  high     - Major feature blocked, workaround exists
  medium   - Partial breakage, minor impact
  low      - Cosmetic, edge case

COMPLEXITY:
  trivial  - One-liner, minimal change
  small    - Single file change
  medium   - Multi-file change
  complex  - Architectural change

STATUS FLOW:
  reported → triaged → [routed] → in-progress → fixed/implemented → verified → closed

STATUS VALUES:
  triaged      - Analyzed, routed, awaiting implementation
  routed       - Sent to tech-spec or correct-course workflow
  in-progress  - Developer actively working
  fixed        - Code complete, awaiting verification (bugs)
  implemented  - Code complete, awaiting verification (features)
  closed       - Verified and closed
  backlog      - Deferred to future sprint
  blocked      - Cannot proceed until issue resolved
```

---

## Part 1: System Architecture

### System Overview

```
                              INPUT SOURCES
  +-------------------+     +-------------------+     +-------------------+
  |   IN-APP MODAL    |     |   MANUAL ENTRY    |     |  EXTERNAL ISSUE   |
  |   (Optional API)  |     |   (bugs.md)       |     |  TRACKER IMPORT   |
  +--------+----------+     +--------+----------+     +--------+----------+
           |                         |                         |
           +------------+------------+-------------------------+
                        |
                        v
           +============================+
           |     /triage (WORKFLOW)     |
           +============================+
                        |
        +---------------+---------------+---------------+
        |               |               |               |
        v               v               v               v
   direct-fix      tech-spec     correct-course     backlog
        |               |               |               |
        v               v               v               v
   /implement      /tech-spec     /correct-course   (deferred)
        |               |               |
        +---------------+---------------+
                        |
                        v
                   /verify → CLOSED
```

### File Architecture

```
{project-root}/
  docs/
    bugs.md              <-- User-facing: informal bug reports & tracking
    bugs.yaml            <-- Agent-facing: structured metadata database
    epics.md             <-- Context: for mapping bugs to stories
  _bmad/bmm/
    config.yaml          <-- Project configuration
    workflows/
      bug-tracking/      <-- Triage workflow files
      implement/         <-- Implementation workflow
      verify/            <-- Verification workflow
```

### bugs.md Structure

```markdown
# Bug Tracking - {project_name}

# manual input
## Bug: Login fails on iOS Safari
Description of the bug...
Reported by: User Name
Date: 2025-01-15

- **Crash on startup (Android)**: App crashes immediately. CRITICAL.

1. Form validation missing - No validation on email field

---

# Tracked Bugs
### bug-001: Login fails on iOS Safari
Brief description...
- **Severity:** high
- **Complexity:** small
- **Workflow:** tech-spec
- **Related:** story-2-3
**Notes:** Triage reasoning...

---

# Tracked Feature Requests
### feature-001: Dark mode toggle
Brief description...
- **Priority:** medium
- **Complexity:** medium
- **Workflow:** tech-spec

---

# Fixed Bugs
[IMPLEMENTED] bug-003: Header alignment [Sev: low, Fixed: 2025-01-18, Verified: pending]
  - Fix: Adjusted flexbox styling
  - File(s): src/components/Header.tsx

bug-002: Form submission error [Sev: medium, Fixed: 2025-01-15, Verified: 2025-01-16, CLOSED]
  - Fix: Added error boundary

---

# Implemented Features
[IMPLEMENTED] feature-002: Export to CSV [Impl: 2025-01-20, Verified: pending]
  - Files: src/export.ts, src/utils/csv.ts
```

---

## Part 2: Workflow Operations

### Slash Command Reference

| Command | Description | When to Use |
|---------|-------------|-------------|
| `/triage` | Main workflow - triage user-reported bugs | When new bugs are in bugs.md |
| `/implement bug-NNN` | Implement a specific bug fix | After triage, routed for direct-fix |
| `/implement feature-NNN` | Implement a feature request | After feature is triaged |
| `/verify` | List all pending verification | After implementation, before closing |
| `/verify bug-NNN` | Verify and close specific bug | After testing confirms fix works |
| `/verify all` | Batch verify all pending items | Bulk close multiple fixes |

### /triage Workflow

```
USER INVOKES: /triage
         |
         v
+---------------------------+
| STEP 1: INITIALIZATION    |
+---------------------------+
| - Load config.yaml        |
| - Check for bugs.yaml     |
| - Detect existing session |
+------------+--------------+
             |
    +--------+--------+
    |                 |
    v                 v
+-------------+   +-------------+
| Has pending |   | Fresh start |
| triaged work|   +------+------+
+------+------+          |
       |                 v
       v          +-------------+
+-------------+   | Scan manual |
| Show status |   | input section|
| [T/I/V/L/Q] |   +------+------+
+-------------+          |
                         v
                  +-------------+
                  | [S/C/Q]     |
                  | Sync/Cont/Q |
                  +------+------+
                         |
         +---------------+---------------+
         v               v               v
    [S] API Sync    [C] Continue    [Q] Quit

+---------------------------+
| STEP 2: API SYNC          |  (Optional - if [S] selected)
+---------------------------+
| GET /api/bug-reports/pending
| - Fetch, format, insert to bugs.md
| - POST /mark-synced
+---------------------------+

+---------------------------+
| STEP 3: PARSE             |
+---------------------------+
| Read "# manual input" only
| - Parse headers, bullets, numbered lists
| - Extract: title, desc, reporter, platform
| - Compare with bugs.yaml (NEW vs EXISTING)
+------------+--------------+
             |
    +--------+--------+
    v                 v
No new bugs      {N} new bugs
   [HALT]        [C] Continue
                      |
                      v
+---------------------------+
| STEP 4: TRIAGE (per bug)  |
+---------------------------+
| FOR EACH NEW BUG:
| 1. Generate bug-NNN ID
| 2. Assess SEVERITY (critical|high|med|low)
| 3. Assess COMPLEXITY (trivial|small|med|complex)
| 4. Apply ROUTING MATRIX → workflow
| 5. Map to story/epic if applicable
| 6. Assess DOC IMPACT (prd|architecture|ux)
| 7. Add triage notes
| 8. Present: [A]ccept/[M]odify/[S]kip/[N]ext
+---------------------------+
             |
             v (after all bugs)
+---------------------------+
| STEP 5: UPDATE FILES      |
+---------------------------+
| bugs.yaml: Add entries, update stats
| bugs.md: Remove from manual input,
|          Add to Tracked Bugs/Features
+---------------------------+
             |
             v
+---------------------------+
| STEP 6: COMPLETE          |
+---------------------------+
| Show summary + next steps:
| /implement bug-NNN
| /verify bug-NNN
+---------------------------+
```

### /implement Workflow

```
USER INVOKES: /implement bug-NNN
                    |
                    v
    +-------------------------------+
    | STEP 1-2: Load Context        |
    +-------------------------------+
    | - Parse ID (bug-NNN/feature-NNN)
    | - Load from bugs.yaml
    | - Check status (halt if backlog/blocked/deferred)
    +---------------+---------------+
                    |
                    v
    +-------------------------------+
    | STEP 3: Check Workflow Route  |
    +-------------------------------+
                    |
        +-----------+-----------+-----------+
        v           v           v           v
   correct-    tech-spec   direct-fix   ambiguous
   course                                   |
       |           |           |        Apply Matrix
       v           v           |
   [ROUTES TO  [ROUTES TO      |
   /correct-   /tech-spec      |
    course]     workflow]      |
       |           |           |
       v           v           v
   Creates     Creates    +--------+
   story       spec       | STEP 4:|
                          | Confirm|
                          +---+----+
                              |
                              v
                      +---------------+
                      | STEP 5:       |
                      | IMPLEMENT     |
                      +---------------+
                      | Dev Agent:    |
                      | - Read files  |
                      | - Make changes|
                      | - Minimal fix |
                      +-------+-------+
                              |
                              v
                      +---------------+
                      | STEP 6: Check |
                      | npm run check |
                      +-------+-------+
                              |
                              v
                      +---------------+
                      | STEP 7-8:     |
                      | Update Files  |
                      +---------------+
                      | bugs.yaml:    |
                      |  status: fixed|
                      | bugs.md:      |
                      |  [IMPLEMENTED]|
                      +-------+-------+
                              |
                              v
                      +---------------+
                      | STEP 9:       |
                      | "Run /verify" |
                      +---------------+
```

### /verify Workflow

```
USER INVOKES: /verify [bug-NNN]
                    |
        +-----------+-----------+
        v                       v
+---------------+       +---------------+
| No ID given   |       | ID provided   |
+-------+-------+       +-------+-------+
        |                       |
        v                       |
+---------------+               |
| List pending  |               |
| [IMPLEMENTED] |               |
| items         |               |
+-------+-------+               |
        |                       |
        +-------+---------------+
                |
                v
+-------------------------------+
| STEP 2: Load & Validate       |
+-------------------------------+
| - Verify status: fixed/implemented
| - Check file sync
+---------------+---------------+
                |
                v
+-------------------------------+
| STEP 3: Confirm Verification  |
+-------------------------------+
| Show: Title, type, date, files
| "Has this been tested?"
| [yes | no | skip]
+---------------+---------------+
                |
    +-----------+-----------+
    v           v           v
+-------+   +-------+   +-------+
| YES   |   | NO    |   | SKIP  |
+---+---+   +---+---+   +---+---+
    |           |           |
    v           v           v
Step 4      Add note    Next item
            "rework"

+-------------------------------+
| STEP 4-5: Update Files        |
+-------------------------------+
| bugs.yaml: status: closed,
|            verified_date
| bugs.md: Remove [IMPLEMENTED],
|          Add CLOSED tag
+-------------------------------+
                |
                v
+-------------------------------+
| STEP 6: Summary               |
| "bug-NNN VERIFIED and CLOSED" |
+-------------------------------+
```

---

## Part 3: Routing & Agent Delegation

### Workflow Routing by Type

| Workflow | Trigger Conditions | Pre-Implement Phase | Implementation Phase |
|----------|-------------------|---------------------|---------------------|
| **direct-fix** | high/med + trivial | None | Dev Agent in /implement Step 5 |
| **tech-spec** | high/med + small | Architect creates spec | /dev-story per spec |
| **correct-course** | critical (any) OR med/complex+ OR doc_impact | PM→Architect→SM create story | /dev-story per story |
| **backlog** | low + small+ | None (deferred) | Awaits sprint promotion |

### Agent Responsibilities

```
                         /triage
                            |
                            v
               +------------------------+
               |   SM AGENT (Scrum      |
               |   Master Facilitator)  |
               +------------------------+
               | - Runs triage workflow |
               | - Assesses severity    |
               | - Routes to workflows  |
               +-----------+------------+
                           |
       +-------------------+-------------------+
       v                   v                   v
+------------+      +------------+      +------------+
| Direct-Fix |      | Tech-Spec  |      | Correct-   |
+-----+------+      +-----+------+      | Course     |
      |                   |             +-----+------+
      v                   v                   |
+------------+      +------------+            v
| DEV AGENT  |      | ARCHITECT  |      +------------+
| /implement |      | /tech-spec |      | PM AGENT   |
| Step 5     |      +-----+------+      | + ARCHITECT|
+------------+            |             | + SM       |
                          v             +-----+------+
                    +------------+            |
                    | DEV AGENT  |            v
                    | /dev-story |      +------------+
                    +------------+      | DEV AGENT  |
                                        | /dev-story |
                                        +------------+
```

### Doc Impact Routing

When `doc_impact` flags are detected during /implement:

| Flag | Agent | Action |
|------|-------|--------|
| PRD | PM Agent | Update PRD.md |
| Architecture | Architect Agent | Update architecture.md |
| UX | UX Designer Agent | Update UX specs |

User is prompted: `[update-docs-first | proceed-anyway | cancel]`

---

## Part 4: State & Lifecycle

### File State Transitions

```
═══════════════════════════════════════════════════════════════════════════════
         DIRECT-FIX        TECH-SPEC       CORRECT-COURSE      BACKLOG
═══════════════════════════════════════════════════════════════════════════════

ENTRY    # manual input     # manual input   # manual input    # manual input
         (informal text)    (informal text)  (informal text)   (informal text)
              │                  │                │                 │
              ▼                  ▼                ▼                 ▼
─────────────────────────────────────────────────────────────────────────────────
TRIAGE   # Tracked Bugs     # Tracked Bugs   # Tracked Bugs    # Tracked Bugs
         bug-NNN            bug-NNN          bug-NNN           bug-NNN
         wf: direct-fix     wf: tech-spec    wf: correct-crs   wf: backlog
              │                  │                │                 │
              ▼                  ▼                ▼                 │
─────────────────────────────────────────────────────────────────────────────────
ROUTE    (skip)             /tech-spec       /correct-course   (waiting)
                            creates spec     creates story          │
              │                  │                │                 │
              ▼                  ▼                ▼                 │
─────────────────────────────────────────────────────────────────────────────────
CODE     /implement         /dev-story       /dev-story        (waiting)
         Step 5             per spec         per story              │
              │                  │                │                 │
              ▼                  ▼                ▼                 │
─────────────────────────────────────────────────────────────────────────────────
IMPL     # Fixed Bugs       # Fixed Bugs     # Fixed Bugs      (unchanged)
         [IMPLEMENTED]      [IMPLEMENTED]    [IMPLEMENTED]          │
         bug-NNN            bug-NNN          bug-NNN                │
              │                  │                │                 │
              ▼                  ▼                ▼                 │
─────────────────────────────────────────────────────────────────────────────────
VERIFY   /verify            /verify          /verify           (waiting)
         bug-NNN            bug-NNN          bug-NNN                │
              │                  │                │                 │
              ▼                  ▼                ▼                 ▼
─────────────────────────────────────────────────────────────────────────────────
DONE     CLOSED ✓           CLOSED ✓         CLOSED ✓          WAITING ◷
═══════════════════════════════════════════════════════════════════════════════

FILE STATE SUMMARY:
┌──────────┬─────────────────────────────┬──────────────────────────────────┐
│ STAGE    │ bugs.md                     │ bugs.yaml                        │
├──────────┼─────────────────────────────┼──────────────────────────────────┤
│ Entry    │ # manual input              │ (no entry)                       │
├──────────┼─────────────────────────────┼──────────────────────────────────┤
│ Triage   │ → # Tracked Bugs/Features   │ status: triaged + metadata       │
├──────────┼─────────────────────────────┼──────────────────────────────────┤
│ Implement│ → # Fixed [IMPLEMENTED]     │ status: fixed/implemented        │
├──────────┼─────────────────────────────┼──────────────────────────────────┤
│ Verify   │ [IMPLEMENTED] → CLOSED      │ status: closed + verified_date   │
└──────────┴─────────────────────────────┴──────────────────────────────────┘
```

---

## Appendix: Optional Extensions

### In-App Bug Reporting API

Optional integration for apps with built-in bug reporting UI:

1. **User submits** via in-app modal → `POST /api/bug-reports`
2. **Database stores** with `status: 'new'`
3. **During /triage Step 2** (if [S]ync selected):
   - `GET /api/bug-reports/pending` fetches new reports
   - Formats as markdown, inserts to `# manual input`
   - `POST /api/bug-reports/mark-synced` prevents re-fetch

This is optional - manual entry to bugs.md works without any API.
