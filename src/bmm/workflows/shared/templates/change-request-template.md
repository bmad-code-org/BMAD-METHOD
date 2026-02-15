---
change_id: "CR-{{sequence_number}}"
title: "{{change_title}}"
date_submitted: "{{date}}"
submitted_by: "{{agent_name}}"
status: "proposed"
priority: "{{Must|Should|Could|Won't}}"
baseline_version: "{{current_baseline_version}}"
---

# Requirements Change Request: {{change_id}}

## 1. Change Identification

| Field | Value |
|-------|-------|
| **Change ID** | {{change_id}} |
| **Title** | {{change_title}} |
| **Date Submitted** | {{date}} |
| **Submitted By** | {{agent_name}} |
| **Priority** | {{Must / Should / Could / Won't}} |
| **Category** | {{New Requirement / Modification / Deletion / Clarification}} |

## 2. Change Description

### What is being changed?

{{Detailed description of the proposed change}}

### Rationale

{{Why this change is necessary - link to stakeholder need, user feedback, technical discovery, or defect}}

### Source

{{Where did this change request originate - stakeholder name, user interview, technical finding, etc.}}

## 3. Affected Requirements

| Requirement ID | Document | Current Text | Proposed Change |
|---------------|----------|-------------|-----------------|
| {{REQ-ID}} | {{StRS/SyRS/PRD}} | {{Current requirement text}} | {{New/modified text or "DELETE"}} |

## 4. Impact Analysis

### 4.1 Document Impact

| Document | Impact Level | Description |
|----------|-------------|-------------|
| StRS | {{None / Low / Medium / High}} | {{What changes needed}} |
| SyRS | {{None / Low / Medium / High}} | {{What changes needed}} |
| PRD/SRS | {{None / Low / Medium / High}} | {{What changes needed}} |
| Architecture | {{None / Low / Medium / High}} | {{What changes needed}} |
| UX Design | {{None / Low / Medium / High}} | {{What changes needed}} |
| Epics & Stories | {{None / Low / Medium / High}} | {{What changes needed}} |
| Test Cases | {{None / Low / Medium / High}} | {{What changes needed}} |

### 4.2 RTM Impact

| Traceability Chain | Affected? | Details |
|-------------------|----------|---------|
| StRS → SyRS | {{Yes/No}} | {{Which links affected}} |
| SyRS → PRD | {{Yes/No}} | {{Which links affected}} |
| PRD → Stories | {{Yes/No}} | {{Which links affected}} |
| Stories → Tests | {{Yes/No}} | {{Which links affected}} |

### 4.3 Scope Impact

- **Scope Change:** {{Increase / Decrease / Neutral}}
- **Effort Estimate:** {{Minimal / Moderate / Significant}}
- **Timeline Impact:** {{None / Minor delay / Major delay}}
- **Risk Assessment:** {{Low / Medium / High}}

## 5. Baseline Comparison

**Current Baseline Version:** {{baseline_version}}

| Aspect | Baseline State | Proposed State |
|--------|---------------|---------------|
| {{Requirement count}} | {{N}} | {{N+/-M}} |
| {{Scope boundary}} | {{Current}} | {{Proposed}} |
| {{Architecture impact}} | {{Current}} | {{Proposed}} |

## 6. Approval

| Role | Decision | Date | Notes |
|------|---------|------|-------|
| Product Manager | {{Approved / Rejected / Deferred}} | {{date}} | {{notes}} |
| Architect | {{Approved / Rejected / Deferred}} | {{date}} | {{notes}} |
| Stakeholder | {{Approved / Rejected / Deferred}} | {{date}} | {{notes}} |

**Final Decision:** {{APPROVED / REJECTED / DEFERRED}}

## 7. Implementation Plan

### 7.1 Document Updates Required

- [ ] StRS updated (if affected)
- [ ] SyRS updated (if affected)
- [ ] PRD/SRS updated (if affected)
- [ ] Architecture updated (if affected)
- [ ] UX Design updated (if affected)
- [ ] Epics & Stories updated (if affected)
- [ ] RTM updated with new traceability links
- [ ] Test cases updated (if affected)
- [ ] Baseline version incremented

### 7.2 Downstream Notifications

| Workflow/Agent | Action Required |
|---------------|----------------|
| {{Agent/Workflow}} | {{What needs to happen}} |

## 8. Change History

| Date | Action | By | Details |
|------|--------|-----|---------|
| {{date}} | Created | {{agent}} | Initial change request |
