# Step 9: Finalize the PRD

## Purpose

Create the master PRD that references all Phase 3 work.

## Context for Agent

The PRD is the single source of truth. It starts here with technical foundation and grows during Phase 4 as functional requirements are added from UX design.

## Instructions

Create `C-Requirements/10-PRD.md` with this structure:

```markdown
# Product Requirements Document: [Project Name]

_Phase 3 Complete: Technical Foundation Established_
_Last Updated: [Date]_

## 1. Executive Summary
[Link to Product Brief from Phase 1]
[Link to Trigger Map from Phase 2]

## 2. Technical Foundation (Phase 3)

### 2.1 Platform Architecture
[Link to C-Requirements/00-Platform-Architecture.md]

### 2.2 External Integrations
[Link to C-Requirements/01-Integration-Map.md]

### 2.3 Technical Validation
[Link to C-Requirements/02-Technical-Proofs-Of-Concept.md]

### 2.4 Security & Compliance
[Link to C-Requirements/03-Security-Framework.md]

### 2.5 API Specifications
[Link to C-Requirements/04-API-Specifications.md]

### 2.6 Data Models
[Link to C-Requirements/05-Data-Models.md]

### 2.7 Performance Requirements
[Link to C-Requirements/06-Performance-Requirements.md]

### 2.8 Technical Constraints
[Link to C-Requirements/07-Technical-Constraints.md]

### 2.9 Acceptance Criteria
[Link to C-Requirements/08-Acceptance-Criteria.md]

## 3. Platform Backlog Recommendations
[Link to C-Requirements/09-Platform-Backlog-Recommendations.md]

## 4. Functional Requirements (Phase 4)
_Populated during Phase 4 (UX Design) as pages/scenarios complete._

## 5. Next Steps

**For BMM Agents:**
- Use platform backlog recommendations to create E-Backlog/
- Create detailed epics and stories from requirements
- Establish implementation roadmap

**For Phase 4 (UX Design):**
- Technical constraints provide design boundaries
- API specifications define data available to UI
- Begin UX design with confidence in feasibility

## 6. Change Log
- [Date] - Phase 3 complete: Technical foundation established
```

**Output:** Create `C-Requirements/10-PRD.md`

## Next Step

Proceed to step-10-summary.md

## State Update

```yaml
stepsCompleted: ['step-01-welcome.md', 'step-02-platform-architecture.md', 'step-03-integration-mapping.md', 'step-04-technical-validation.md', 'step-05-security-framework.md', 'step-06-api-specifications.md', 'step-07-data-and-performance.md', 'step-08-backlog-recommendations.md', 'step-09-prd-finalization.md']
```
