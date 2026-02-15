# Requirements Traceability Matrix (RTM) - Integrity Checklist

## Document Structure

- [ ] RTM document exists at the expected location
- [ ] Forward Traceability table present and populated
- [ ] Backward Traceability table present and populated
- [ ] Coverage Analysis section present
- [ ] Orphan Analysis section present
- [ ] Requirement Status Summary present
- [ ] Change History section present with at least one entry

## Forward Traceability (StRS → SyRS → PRD → Stories → Tests)

### StRS → SyRS Coverage

- [ ] Every StRS requirement is referenced by at least one SyRS requirement
- [ ] No StRS requirements listed as "orphan" (no forward link)
- [ ] Forward traceability coverage > 90%
- [ ] Derived SyRS requirements (no StRS source) are documented with justification

### SyRS → PRD Coverage

- [ ] Every SyRS requirement is referenced by at least one PRD requirement
- [ ] No SyRS requirements listed as "orphan" (no forward link)
- [ ] Forward traceability coverage > 90%
- [ ] Derived PRD requirements (no SyRS source) are documented with justification

### PRD → Stories Coverage

- [ ] Every PRD functional requirement is covered by at least one story
- [ ] No PRD requirements listed as "orphan" (no forward link)
- [ ] Forward traceability coverage > 95%
- [ ] FR Coverage Map in epics document is consistent with RTM

### Stories → Tests Coverage (TEA module, if installed)

- [ ] Every story acceptance criterion has at least one test reference
- [ ] Test references are valid (test files/cases exist)
- [ ] Test coverage by requirement is documented

## Backward Traceability (Tests → Stories → PRD → SyRS → StRS)

- [ ] Every story traces back to at least one PRD requirement
- [ ] Every PRD requirement traces back to a SyRS requirement (or is marked as derived)
- [ ] Every SyRS requirement traces back to a StRS requirement (or is marked as derived)
- [ ] No orphan stories (stories without requirement traceability)

## Orphan Detection

- [ ] No orphan StRS requirements (requirements with no downstream links)
- [ ] No orphan SyRS requirements (requirements with no upstream OR downstream links)
- [ ] No orphan PRD requirements (requirements with no downstream links to stories)
- [ ] No orphan stories (stories with no upstream links to requirements)
- [ ] All identified orphans have been resolved or documented with justification

## Requirement Status Consistency

- [ ] Requirement statuses in RTM match statuses in source documents
- [ ] No "Approved" requirements in RTM that are "Draft" in source document
- [ ] Verification methods in RTM match those in source documents
- [ ] Priority levels in RTM match those in source documents

## Coverage Statistics

- [ ] Overall forward traceability coverage calculated
- [ ] Per-level coverage percentages documented
- [ ] Coverage meets minimum thresholds:
  - StRS → SyRS: > 90%
  - SyRS → PRD: > 90%
  - PRD → Stories: > 95%
- [ ] Coverage trends noted (if RTM has been updated multiple times)

## Cross-Document ID Consistency

- [ ] Requirement IDs in RTM match exactly with source documents
- [ ] No typos or mismatched IDs in traceability links
- [ ] ID format is consistent across all levels (e.g., STK-BIZ-001, SYS-FUNC-001, FR-AUTH-001)
- [ ] No duplicate requirement IDs within any single level

## Change Tracking

- [ ] RTM version matches latest document versions
- [ ] Change history records when RTM was last updated
- [ ] Any recent document changes are reflected in RTM
- [ ] Baseline alignment noted (RTM baseline matches document baselines)
