# Requirements Change Management - Validation Checklist

## Change Request Completeness

- [ ] Change request has unique ID (CR-###)
- [ ] Change title clearly describes the modification
- [ ] Change category identified (New / Modification / Deletion / Clarification)
- [ ] Priority assigned (Must / Should / Could / Won't)
- [ ] Rationale provided explaining why the change is needed
- [ ] Source identified (stakeholder, technical finding, defect, etc.)
- [ ] Affected requirements listed with current and proposed text

## Impact Analysis

- [ ] All affected requirement documents identified
- [ ] Impact level assessed for each document (None / Low / Medium / High)
- [ ] RTM traceability chain traced for affected requirements
- [ ] Scope impact assessed (Increase / Decrease / Neutral)
- [ ] Effort estimate provided (Minimal / Moderate / Significant)
- [ ] Timeline impact assessed (None / Minor delay / Major delay)
- [ ] Risk assessment completed (Low / Medium / High)

## Baseline Comparison

- [ ] Current baseline version documented
- [ ] Baseline state vs. proposed state compared
- [ ] All deviations from baseline clearly documented

## Approval Process

- [ ] Change request presented to appropriate decision maker
- [ ] Decision recorded (Approved / Rejected / Deferred)
- [ ] Decision rationale documented
- [ ] If deferred: conditions for revisiting specified

## Implementation (After Approval)

- [ ] All affected requirement documents updated
- [ ] Requirement attributes updated (status, change reference)
- [ ] RTM updated with new/modified traceability links
- [ ] No orphan requirements created by the change
- [ ] No broken traceability links after the change
- [ ] Downstream artifacts update plan created (stories, tests, architecture)
- [ ] Baseline version incremented in all affected documents
- [ ] Change log entries added to all affected documents
- [ ] Change request status updated to "IMPLEMENTED"

## Post-Implementation Verification

- [ ] Cross-document consistency verified (no terminology conflicts)
- [ ] RTM integrity verified (forward and backward traceability intact)
- [ ] No scope creep introduced beyond approved change
- [ ] Change history file updated and searchable
