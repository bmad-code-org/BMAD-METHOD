# Escalate Blocker Workflow

## Overview

This workflow manages the escalation of contractor blockers via SMTP email. It ensures blockers are routed to the right people with full context and tracked until resolution.

## Prerequisites

- Contractor has reported a blocker (BLOCKED command)
- Or: Blocker detected through other means (standup, SLA breach)
- Module state accessible

---

## Workflow Stages

### Stage 1: Identify Blocker

**Objective:** Load blocker details and context.

**Blocker Sources:**

1. **Contractor Email** - Parse BLOCKED command:
   ```
   From: backend@contractor.example
   Subject: Re: [PROJECT] [STORY-123] Story Assignment

   BLOCKED - Cannot access staging database. Getting connection refused errors.
   Tried from local and CI environments, same result.

   Error: Connection refused to staging-db.example.com:5432
   ```

2. **Standup Detection** - Blocker identified during standup
3. **SLA Breach** - Automatic detection of stalled work
4. **Manual Report** - Coordinator-identified blocker

**Load Blocker Context:**

```yaml
blocker:
  id: "BLK-2025-001"
  reported_at: "2025-11-28T10:30:00Z"
  reported_by: "backend-001"
  contractor_name: "Backend Developer"
  contractor_email: "backend@contractor.example"

  # Source
  source: "email"
  email_correlation_id: "assign-STORY-123-backend-001"

  # Story context
  story_id: "STORY-123"
  story_title: "Implement user authentication API"
  story_priority: "high"

  # Blocker details
  description: "Cannot access staging database"
  details: |
    Getting connection refused errors.
    Tried from local and CI environments, same result.
    Error: Connection refused to staging-db.example.com:5432

  # Duration
  blocked_since: "2025-11-28T10:30:00Z"
  hours_blocked: 26
```

**Output:** Complete blocker context loaded

---

### Stage 2: Classify Blocker

**Objective:** Determine blocker type, severity, and resolution owner.

**Blocker Types:**

| Type | Description | Typical Owner |
|------|-------------|---------------|
| Access | Permission/credential issues | DevOps/Admin |
| Infrastructure | System/environment problems | DevOps |
| Dependency | Waiting on another story/team | PM/Coordinator |
| Technical | Code/architecture questions | Tech Lead |
| Requirements | Unclear or missing requirements | PM/PO |
| External | Third-party dependency | Varies |
| Resource | Missing tools, licenses, data | Admin |

**Severity Levels:**

| Severity | Criteria | Response Time |
|----------|----------|---------------|
| 🔴 Critical | Blocks multiple contractors or critical path | 4 hours |
| 🟠 High | Blocks single contractor on priority work | 8 hours |
| 🟡 Medium | Blocks work but workarounds exist | 24 hours |
| 🟢 Low | Minor impediment | 48 hours |

**Classification:**

```yaml
classification:
  type: "infrastructure"
  subtype: "database_access"
  severity: "high"
  reason: "Blocks priority story, no workaround"

  # Resolution routing
  resolution_owner: "devops"
  resolution_owner_email: "devops@yourcompany.com"
  backup_owner: "tech-lead"

  # Impact assessment
  impact:
    stories_blocked: 1
    contractors_blocked: 1
    is_critical_path: true
    downstream_impact:
      - "STORY-124 depends on STORY-123 completion"
      - "STORY-125 blocked by same issue"

  # SLA
  response_sla_hours: 8
  resolution_sla_hours: 24
```

**Pattern Detection:**

```yaml
pattern_check:
  similar_blockers:
    - BLK-2025-098  # Same staging DB issue 2 weeks ago
  recurring: true
  frequency: "2 times in 30 days"
  recommendation: "Consider systemic fix for staging DB access"
```

**Output:** Blocker classified and routed

---

### Stage 3: Determine Recipients

**Objective:** Identify all parties who should receive the escalation.

**Recipient Rules:**

```yaml
recipient_rules:
  - type: "infrastructure"
    primary: ["devops@yourcompany.com"]
    cc: ["coordinator@yourcompany.com"]

  - type: "dependency"
    primary: ["blocking_story_owner"]
    cc: ["coordinator@yourcompany.com", "pm@yourcompany.com"]

  - type: "requirements"
    primary: ["pm@yourcompany.com", "po@yourcompany.com"]
    cc: ["coordinator@yourcompany.com"]

  - severity: "critical"
    always_cc: ["lead@yourcompany.com", "manager@yourcompany.com"]
```

**Determined Recipients:**

```yaml
recipients:
  to:
    - email: "devops@yourcompany.com"
      name: "DevOps Team"
      reason: "Infrastructure owner"

  cc:
    - email: "coordinator@yourcompany.com"
      name: "Project Coordinator"
      reason: "Tracking"
    - email: "backend@contractor.example"
      name: "Backend Developer"
      reason: "Blocked contractor (keep informed)"

  reply_to: "coordinator@yourcompany.com"
```

**Output:** Recipient list determined

---

### Stage 4: Prepare Escalation

**Objective:** Compose escalation email with full context.

**Escalation Email Template:**

```markdown
Subject: [PROJECT] 🚨 BLOCKER: Cannot access staging database - STORY-123

## Escalation Summary

| Field | Value |
|-------|-------|
| Blocker ID | BLK-2025-001 |
| Severity | 🟠 HIGH |
| Type | Infrastructure / Database Access |
| Blocked Since | Nov 28, 2025 10:30 UTC (26 hours) |
| Response SLA | 8 hours |
| Resolution SLA | 24 hours |

---

## Contractor Blocked

**Name:** Backend Developer (backend-001)
**Email:** backend@contractor.example
**Story:** STORY-123 - Implement user authentication API
**Story Priority:** High

---

## Blocker Description

**Issue:**
Cannot access staging database. Getting connection refused errors.

**Details from Contractor:**
> Tried from local and CI environments, same result.
> Error: Connection refused to staging-db.example.com:5432

**What They've Tried:**
- Connection from local environment
- Connection from CI environment
- Same error in both cases

---

## Impact Assessment

- **Stories Blocked:** 1
- **Contractors Blocked:** 1
- **Critical Path:** Yes
- **Downstream Impact:**
  - STORY-124 (Frontend login) depends on STORY-123 completion
  - STORY-125 (Mobile auth) may be affected by same issue

---

## Requested Action

Please investigate and resolve the staging database access issue.

**Needed:**
1. Verify staging-db.example.com:5432 is accessible
2. Check contractor's IP is whitelisted (if applicable)
3. Verify database credentials are current
4. Confirm any recent infrastructure changes

---

## Pattern Alert ⚠️

This appears to be a recurring issue:
- Similar blocker BLK-2025-098 occurred 2 weeks ago
- Frequency: 2 times in 30 days
- Recommendation: Consider systemic fix for staging DB access

---

## Response Required

Please reply to this email with:
1. **ACKNOWLEDGED** - You're looking into it
2. **RESOLVED** - Issue is fixed (include summary)
3. **NEEDS_INFO** - You need more information (include questions)
4. **TRANSFERRED** - Re-routing to another team (include contact)

**SLA Reminder:** Response expected within 8 hours.

---

Thank you for your prompt attention.

---
Blocker ID: BLK-2025-001
Correlation ID: escalation-BLK-2025-001
Story: STORY-123
Contractor: backend-001
```

**Output:** Escalation email prepared

---

### Stage 5: Send Escalation

**Objective:** Send escalation email via SMTP.

**Email Dispatch:**

```yaml
email:
  to: ["devops@yourcompany.com"]
  cc:
    - "coordinator@yourcompany.com"
    - "backend@contractor.example"
  reply_to: "coordinator@yourcompany.com"
  subject: "[PROJECT] 🚨 BLOCKER: Cannot access staging database - STORY-123"
  body: "{escalation_email_content}"
  priority: "high"
  correlation_id: "escalation-BLK-2025-001"
  headers:
    X-Blocker-ID: "BLK-2025-001"
    X-Story-ID: "STORY-123"
    X-Severity: "high"
```

**Use send-email task:**

```xml
<invoke task="send-email">
  <param name="to">devops@yourcompany.com</param>
  <param name="cc">coordinator@yourcompany.com,backend@contractor.example</param>
  <param name="subject">[PROJECT] 🚨 BLOCKER: Cannot access staging database - STORY-123</param>
  <param name="template">blocker-escalation</param>
  <param name="variables">
    blocker_id: "BLK-2025-001"
    severity: "high"
    type: "infrastructure"
    description: "Cannot access staging database"
    contractor_name: "Backend Developer"
    story_id: "STORY-123"
  </param>
  <param name="priority">high</param>
</invoke>
```

**Send Confirmation to Contractor:**

```yaml
contractor_notification:
  to: "backend@contractor.example"
  subject: "[PROJECT] [STORY-123] Your blocker has been escalated"
  body: |
    Hi Backend Developer,

    Your blocker has been escalated to the DevOps team.

    **Blocker:** Cannot access staging database
    **Escalated To:** DevOps Team
    **Expected Response:** Within 8 hours

    We'll notify you when there's an update. In the meantime, if you
    have any additional information, reply to this email.

    Blocker ID: BLK-2025-001
    Correlation ID: escalation-BLK-2025-001
```

**Output:** Escalation emails sent

---

### Stage 6: Track Blocker

**Objective:** Record blocker and set follow-up reminders.

**Update Module State:**

```yaml
blockers:
  - id: "BLK-2025-001"
    status: "escalated"
    story_id: "STORY-123"
    contractor_id: "backend-001"
    type: "infrastructure"
    severity: "high"
    description: "Cannot access staging database"

    # Timeline
    reported_at: "2025-11-28T10:30:00Z"
    escalated_at: "2025-11-29T12:30:00Z"
    hours_before_escalation: 26
    response_sla_deadline: "2025-11-29T20:30:00Z"
    resolution_sla_deadline: "2025-11-30T12:30:00Z"

    # Routing
    escalated_to: "devops@yourcompany.com"
    escalation_email_id: "escalation-BLK-2025-001"

    # Resolution
    resolved_at: null
    resolved_by: null
    resolution_summary: null

    # Follow-ups
    reminders_sent: 0
    next_reminder: "2025-11-29T18:30:00Z"
```

**Set Follow-Up Reminders:**

```yaml
reminder_schedule:
  - trigger: "response_sla - 2h"
    action: "send_reminder"
    recipients: ["devops@yourcompany.com"]
    template: "blocker-reminder"
    if_status: "escalated"

  - trigger: "response_sla"
    action: "check_response"
    if_no_response: "re_escalate"
    add_recipients: ["lead@yourcompany.com"]

  - trigger: "resolution_sla - 4h"
    action: "send_urgent_reminder"
    subject_prefix: "⚠️ SLA WARNING"

  - trigger: "resolution_sla"
    action: "escalate_to_management"
    if_unresolved: true
    recipients: ["manager@yourcompany.com"]
```

**Create Calendar Reminder (if integration available):**

```yaml
calendar:
  event: "Check blocker BLK-2025-001"
  time: "response_sla_deadline"
  attendees: ["coordinator@yourcompany.com"]
```

**Output:** Blocker tracked with follow-up schedule

---

## Events Published

**contractor.blocker.escalated:**
```yaml
blocker_id: "BLK-2025-001"
story_id: "STORY-123"
contractor_id: "backend-001"
type: "infrastructure"
severity: "high"
description: "Cannot access staging database"
escalated_to: "devops@yourcompany.com"
escalated_at: "2025-11-29T12:30:00Z"
hours_blocked: 26
response_sla_hours: 8
correlation_id: "escalation-BLK-2025-001"
```

---

## Handling Responses

**Parse Response Emails:**

When reply is received to escalation email:

```yaml
response_commands:
  ACKNOWLEDGED:
    action: "update_status"
    new_status: "in_progress"
    notify: ["contractor"]
    message: "DevOps is investigating your blocker."

  RESOLVED:
    action: "resolve_blocker"
    new_status: "resolved"
    notify: ["contractor"]
    message: "Your blocker has been resolved: {resolution_summary}"
    trigger_event: "contractor.blocker.resolved"

  NEEDS_INFO:
    action: "request_info"
    new_status: "needs_info"
    forward_to: ["contractor"]
    message: "DevOps needs more information: {questions}"

  TRANSFERRED:
    action: "re_route"
    new_status: "transferred"
    notify: ["contractor", "new_owner"]
    message: "Blocker transferred to {new_owner}"
```

**Resolution Email to Contractor:**

```
Subject: [PROJECT] [STORY-123] ✅ Blocker Resolved - Database Access

Hi Backend Developer,

Great news! Your blocker has been resolved.

**Blocker:** Cannot access staging database
**Resolution:** Staging database was temporarily down for maintenance.
               It has been restored and should be accessible now.
**Resolved By:** DevOps Team

**Action Required:**
Please verify you can access the staging database and continue work on STORY-123.
Reply with PROGRESS when you resume work.

If the issue persists, reply with BLOCKED and we'll re-escalate.

---
Blocker ID: BLK-2025-001
Resolution Time: 6 hours
```

---

## Auto-Escalation Rules

**Scheduled Check (Every 4 Hours):**

```yaml
auto_escalation:
  check_frequency: "*/4 hours"

  rules:
    - condition: "blocker.status == 'reported' AND hours_since_report > 24"
      action: "auto_escalate"
      severity_boost: "+1"

    - condition: "blocker.status == 'escalated' AND hours_since_escalation > response_sla"
      action: "re_escalate"
      add_recipients: ["lead"]
      subject_prefix: "⚠️ SLA BREACH"

    - condition: "blocker.status == 'in_progress' AND hours_since_acknowledged > resolution_sla"
      action: "escalate_to_management"
      add_recipients: ["manager"]
      subject_prefix: "🚨 RESOLUTION SLA BREACH"
```

---

## Blocker Dashboard

**Blocker Summary View:**

```
Active Blockers: 3

| ID | Severity | Contractor | Story | Type | Hours | Status | Owner |
|----|----------|------------|-------|------|-------|--------|-------|
| BLK-001 | 🟠 HIGH | backend-001 | STORY-123 | Infra | 26h | Escalated | DevOps |
| BLK-002 | 🟡 MED | frontend-001 | STORY-124 | Dependency | 12h | Reported | Coordinator |
| BLK-003 | 🔴 CRIT | mobile-001 | STORY-125 | Access | 4h | In Progress | Admin |

Blockers by Type:
- Infrastructure: 1
- Dependency: 1
- Access: 1

Average Resolution Time: 18 hours
SLA Compliance: 75%
```

---

## Tips for Effective Escalation

1. **Include full context** - Async recipients need complete information
2. **Clear severity** - Make urgency obvious immediately
3. **Specific asks** - Tell recipient exactly what's needed
4. **Track patterns** - Recurring blockers need systemic fixes
5. **Keep contractor informed** - They're waiting and anxious
6. **Respect SLAs** - Escalate promptly, not prematurely
7. **Close the loop** - Always send resolution notification
