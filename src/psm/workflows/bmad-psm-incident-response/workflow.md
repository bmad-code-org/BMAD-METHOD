---
workflow_id: W-INCIDENT-001
workflow_name: Production Incident Response
version: 6.2.0
lead_agent: "SRE Minh"
supporting_agents: ["Architect Khang", "Mary Analyst"]
phase: "3-Run: Emergency Response & Recovery"
created_date: 2026-03-17
last_modified: 2026-03-17
config_file: "_config/config.yaml"
estimated_duration: "15 minutes to 2 hours (depending on severity)"
outputFile: '{output_folder}/psm-artifacts/incident-{{project_name}}-{{date}}.md'
---

# Production Incident Response Workflow — BMAD Pattern

## Metadata & Context

**Goal**: Triage, diagnose, resolve production incidents through systematic diagnosis and apply fixes with verification. This is the most critical workflow - minimize MTTR (Mean Time To Recovery) while maintaining system stability.

**Lead Team**:
- SRE Minh (Incident Command, Recovery Orchestration)
- Architect Khang (Root Cause Analysis, System-wide Impact)
- Mary Analyst (Impact Assessment, Post-Incident Review)

**Success Criteria**:
- ✓ Incident severity classified within 5 minutes
- ✓ Root cause identified within first triage pass
- ✓ Fix applied and verified
- ✓ System metrics returned to baseline
- ✓ Incident postmortem documented with action items
- ✓ Prevention measures identified

## Workflow Overview

Workflow này di qua 4 bước atomic, mỗi bước focus vào một phase khác nhau:

1. **Step-01-Triage** → Gather initial info, assess severity, classify impact
2. **Step-02-Diagnose** → Systematic diagnosis using observability data (logs, metrics, traces)
3. **Step-03-Fix** → Apply fix, verify resolution, validate recovery
4. **Step-04-Postmortem** → Document incident, identify action items, prevent recurrence

## Configuration Loading

Tự động load từ `_config/config.yaml`:

```yaml
project_context:
  organization: "[loaded from config]"
  environment: "production"
  incident_channel: "slack:#incidents"

workflow_defaults:
  communication_language: "Vietnamese-English"
  severity_levels: ["SEV1", "SEV2", "SEV3", "SEV4"]
  escalation_contacts: "[loaded from config]"
  on_call_engineer: "[loaded from config]"
```

## Workflow Architecture - Micro-File Design

BMAD pattern: Mỗi step là một file riêng, load just-in-time. Workflow chain:

```
workflow.md (entry point)
    ↓
step-01-triage.md (classify severity, initial assessment)
    ↓
step-02-diagnose.md (root cause analysis)
    ↓
step-03-fix.md (apply fix, verify)
    ↓
step-04-postmortem.md (document, prevent)
    ↓
incident-response-summary.md (final output)
```

**Key Benefits**:
- Single-step focus — engineer concentrates on one phase
- Knowledge isolation — load only relevant SKILL docs per step
- State tracking — save progress after each step
- Easy resumption — if interrupted, restart from exact step

## Skill References

Workflow này load knowledge từ:

- **5.07 Reliability & Resilience** → Circuit breaker patterns, fallback strategies, timeout management
- **5.08 Observability & Monitoring** → Structured logging, metrics queries, distributed tracing
- **5.09 Error Handling & Recovery** → Error classification, graceful degradation patterns
- **5.10 Production Readiness** → Incident prevention checklist, alerting setup
- **5.14 Documentation & Runbooks** → Postmortem templates, incident reports

## Execution Model

### Entry Point Logic

```
1. Check if incident session exists
   → If NEW incident: Start from step-01-triage.md
   → If ONGOING: Load incident-session.yaml → continue from last completed step
   → If RESOLVED: Load postmortem template

2. For each step:
   a) Load step-{N}-{name}.md
   b) Load referenced SKILL files (auto-parse "Load:" directives)
   c) Execute MENU [A][C] options
   d) Save step output to step-{N}-output.md + incident-context.yaml
   e) Move to next step or conclude

3. Final: Generate incident report + postmortem in outputs folder
```

### State Tracking

Incident session frontmatter tracks progress:

```yaml
incident_context:
  incident_id: "INC-2026-03-17-001"
  severity: "SEV1" | "SEV2" | "SEV3" | "SEV4"
  status: "triage" → "diagnosing" → "recovering" → "resolved" → "postmortem"
  affected_services: ["service-1", "service-2"]
  started_at: "2026-03-17T14:30:00Z"
  timeline:
    detected_at: "2026-03-17T14:30:00Z"
    triage_completed_at: "2026-03-17T14:35:00Z"
    root_cause_identified_at: "2026-03-17T14:50:00Z"
    fix_applied_at: "2026-03-17T15:10:00Z"
    resolved_at: "2026-03-17T15:15:00Z"
  current_step: "step-02-diagnose"
  last_updated: "2026-03-17T14:50:00Z"
  incident_commander: "SRE Minh"
```

## Mandatory Workflow Rules

1. **Speed first** — Triage must complete in < 5 minutes
2. **Root cause identification** — Must identify root cause before fix attempt
3. **Verify before declaring resolved** — Check metrics + user reports
4. **Document everything** — Every action logged for postmortem
5. **Escalation protocol** — SEV1 → Page on-call architect immediately
6. **Communication** — Update stakeholders every 5-10 minutes
7. **No flying blind** — All fixes must reference observability data

## Severity Scale

- **SEV1** — Service completely down, revenue impact, > 1% users affected → Page all on-call
- **SEV2** — Major degradation, significant users affected, partial functionality down
- **SEV3** — Moderate impact, some users affected, workaround possible
- **SEV4** — Minor issue, limited users, can defer to business hours

## Navigation

Hãy chọn cách bắt đầu:

- **[NEW-INC]** — Report new incident → Load step-01-triage
- **[RESUME-INC]** — Continue existing incident (detect progress from incident-session.yaml)
- **[ESCALATE]** — Escalate to on-call architect

---

**Hãy báo cáo tình trạng incident hoặc chọn [NEW-INC] để bắt đầu triage**
