---
workflowType: 'rtm'
track: 'enterprise'
version: '1.0'
status: 'draft'
last_updated: '{{date}}'
generated_by: '{{agent_name}}'
---

# Requirements Traceability Matrix - {{project_name}}

**Author:** {{user_name}}
**Date:** {{date}}
**ISO 29148 Reference:** Requirements Traceability

## Purpose

This Requirements Traceability Matrix (RTM) provides bidirectional traceability across the entire requirements chain:

**Forward Traceability:** StRS → SyRS → PRD/SRS → Stories → Tests
**Backward Traceability:** Tests → Stories → PRD/SRS → SyRS → StRS

## Traceability Matrix

### Stakeholder Requirements → System/Software Requirements

| StRS Req ID | StRS Description | SyRS Ref(s) | PRD/SRS Ref(s) | Status |
|-------------|-----------------|-------------|----------------|--------|
| | | | | |

### Software Requirements → Stories → Tests

| PRD/SRS Req ID | Description | Priority | Story Ref(s) | Test Ref(s) | V&V Method | Status |
|---------------|-------------|----------|-------------|-------------|------------|--------|
| | | | | | | |

## Coverage Analysis

### Forward Traceability Coverage

| Source Level | Total Reqs | Traced Forward | Not Traced | Coverage % |
|-------------|-----------|---------------|------------|------------|
| StRS | | | | |
| SyRS | | | | |
| PRD/SRS | | | | |
| Stories | | | | |

### Orphan Analysis

#### Orphan Requirements (not traced to any downstream artifact)

| Req ID | Source | Description | Action Needed |
|--------|--------|-------------|--------------|
| | | | |

#### Orphan Stories (not traced to any requirement)

| Story ID | Epic | Description | Action Needed |
|----------|------|-------------|--------------|
| | | | |

#### Orphan Tests (not traced to any story or requirement)

| Test ID | Description | Action Needed |
|---------|-------------|--------------|
| | | |

## Requirement Status Summary

| Status | Count | Percentage |
|--------|-------|------------|
| Proposed | | |
| Approved | | |
| Implemented | | |
| Verified | | |
| Deferred | | |
| Rejected | | |

## Change History

| Date | Change | By | Affected Reqs |
|------|--------|-----|--------------|
| {{date}} | Initial RTM creation | {{agent_name}} | All |
