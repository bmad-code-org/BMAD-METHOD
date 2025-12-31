# Session Manager Instructions

## Overview

The Session Manager provides persistent state management across conversations with token isolation, progress tracking, and context preservation.

## Session ID Format

```
{PREFIX}{YYYYMM}-{CLIENT}-{PROJECT}
```

Examples:
- `SES202501-ACME-AUDIT` - Default session for ACME audit project
- `ENG202501-TESLA-API` - Engineering session for Tesla API project
- `TST202501-INTERNAL-REWRITE` - Testing session for internal rewrite

## Commands

### SESSION start

Start a new session with structured identification.

**Usage:**
```
SESSION start
SESSION start --client ACME --project AUDIT
SESSION start --prefix ENG --client TESLA --project API
```

**Workflow:**
1. Check if active session exists
   - If yes, prompt: "Active session found: {id}. Close it first? [y/n]"
2. Generate session ID using format: `{PREFIX}{YYYYMM}-{CLIENT}-{PROJECT}`
3. Create session file at `{sessions_dir}/{session_id}.yaml`
4. Set as active session in `active-session.yaml`
5. Initialize session state:
   ```yaml
   session_id: "{session_id}"
   created: "{timestamp}"
   status: "active"
   client: "{client}"
   project: "{project}"
   tokens:
     initial: 0
     current: 0
     saved: 0
   agents_spawned: []
   artifacts: []
   milestones: []
   context_summary: ""
   ```
6. Display confirmation with session ID

### SESSION resume

Resume an existing session with context restoration.

**Workflow:**
1. Load `active-session.yaml` to get current session ID
2. If no active session, prompt: "No active session. Start new? [y/n]"
3. Load session file `{sessions_dir}/{session_id}.yaml`
4. Display session summary:
   ```
   Resuming Session: {session_id}
   Status: {status}
   Started: {created}
   Milestones: {milestone_count}
   Artifacts: {artifact_count}
   Token Usage: {current}/{max}

   Last Context:
   {context_summary}
   ```
5. Restore session variables to working memory

### SESSION status

Show current session status with visual indicators.

**Visual Status Indicators:**
| Indicator | Meaning |
|-----------|---------|
| :green_circle: | Active / On Track |
| :yellow_circle: | At Risk / Warning (>80% tokens) |
| :red_circle: | Blocked / Failed |
| :pause_button: | Paused |
| :white_check_mark: | Completed |

**Output Format:**
```
Session: {session_id} {status_indicator}
Duration: {duration}
Tokens: {current}/{max} ({percentage}%)
Progress Bar: [████████░░] 80%

Milestones:
- [x] Initial setup
- [x] Requirements gathered
- [ ] Implementation started

Recent Artifacts:
- docs/prd.md (created 2h ago)
- docs/architecture.md (modified 1h ago)

Agents Spawned This Session: {count}
Token Savings from Isolation: {saved_tokens}
```

### SESSION close

Close current session and archive.

**Workflow:**
1. Load active session
2. Generate context summary (key decisions, outcomes, next steps)
3. Update session status to "closed"
4. Move session file to `{session_archive_dir}/`
5. Clear `active-session.yaml`
6. Display closure summary with learnings

### SESSION list

List all sessions with status.

**Output:**
```
Active Sessions:
  SES202501-ACME-AUDIT :green_circle: (3 days)

Archived Sessions:
  ENG202412-TESLA-API :white_check_mark: (closed 2024-12-28)
  TST202412-INTERNAL-MVP :white_check_mark: (closed 2024-12-15)
```

### SESSION tokens

Show detailed token usage report.

**Output:**
```
Token Usage Report: {session_id}

Main Session:
  Used: 45,000 / 150,000 (30%)
  Remaining: 105,000

Subprocess Agents:
  analyst: 32,000 tokens (isolated)
  architect: 28,000 tokens (isolated)
  dev: 85,000 tokens (isolated)

Total Consumed (if no isolation): 190,000
Actual Main Session: 45,000
Tokens Saved: 145,000 (76% savings)
```

### SESSION savings

Show token savings from isolation architecture.

**Output:**
```
Token Isolation Savings

Without Isolation:
  All agent work in main context: 190,000 tokens
  Would exceed limit by: 40,000 tokens

With Isolation:
  Main session: 45,000 tokens
  Agents in subprocesses: 145,000 tokens (not counted)

Savings: 145,000 tokens (76%)
Status: :green_circle: Within budget
```

### SESSION switch

Switch to a different session.

**Workflow:**
1. Save current session state
2. Load specified session
3. Restore context
4. Update active-session.yaml

## Session File Structure

```yaml
# {session_id}.yaml
session_id: "SES202501-ACME-AUDIT"
created: "2025-01-15T10:30:00Z"
last_updated: "2025-01-15T14:45:00Z"
status: "active"  # active, paused, closed

# Identification
client: "ACME"
project: "AUDIT"
prefix: "SES"

# Token tracking
tokens:
  initial: 0
  current: 45000
  peak: 52000
  saved_by_isolation: 145000

# Agent tracking
agents_spawned:
  - id: "agent-123"
    type: "analyst"
    started: "2025-01-15T10:35:00Z"
    completed: "2025-01-15T10:42:00Z"
    tokens_used: 32000
    output_file: "_bmad-output/temp/analyst-123.md"

# Artifacts produced
artifacts:
  - path: "docs/prd.md"
    created: "2025-01-15T11:00:00Z"
    agent: "pm"
  - path: "docs/architecture.md"
    created: "2025-01-15T12:30:00Z"
    agent: "architect"

# Progress tracking
milestones:
  - name: "Requirements Complete"
    completed: "2025-01-15T11:30:00Z"
  - name: "Architecture Approved"
    completed: "2025-01-15T13:00:00Z"
  - name: "Implementation Started"
    completed: null

# Context for resume
context_summary: |
  Working on ACME security audit project.
  PRD complete, architecture approved.
  Currently implementing Epic 1: User Authentication.
  Next: Complete story 1-2-user-login.

# Session notes
notes:
  - "Client prefers OAuth2 over JWT"
  - "Performance requirement: <200ms response time"
```

## Integration with Token Isolation

When spawning agents via Task tool:
1. Record agent spawn in session
2. Track output file location
3. Calculate token savings
4. Update session totals

## Best Practices

1. **Always start a session** before beginning substantial work
2. **Update milestones** as you complete major phases
3. **Close sessions** when work is complete to maintain clean state
4. **Use meaningful names** for client/project identification
5. **Review savings** periodically to understand isolation benefits
