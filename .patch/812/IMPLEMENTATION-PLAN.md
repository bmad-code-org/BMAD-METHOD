# PR #812 Implementation Plan - Documentation Update for v6-alpha Workflow Changes

## PR Overview

- **PR Number**: 812
- **Status**: Open
- **Base Branch**: v6-alpha
- **Head Branch**: docs/update-v6-alpha-workflow-changes
- **Author**: GTauber
- **Created**: 2025-10-22T18:31:41Z
- **Changes**: 15 files, 72 additions, 39 deletions
- **Scope**: Documentation updates for v6-alpha workflow changes

## Change Summary

### Primary Objectives

1. **Replace `*plan-project` with specialized commands**: `*prd`, `*tech-spec`, and `*gdd` across 15 documentation files
2. **Add sprint-status documentation**: For Level 4 projects
3. **Update workflow diagrams and examples**: Throughout documentation
4. **Document two-tier status tracking system**: workflow-status vs sprint-status
5. **Add consistency for prd/tech-spec alternatives**: In testarch docs

### Issue Resolution

- **Closes Issue**: #811
- **Related Commits**:
  - b8db080 (architecture name standardization)
  - 419043e (sprint planning)
  - ddaefa3 (sprint plan for level 4)

## Files to Modify (15 Total)

### Category 1: Root Documentation (2 files)

1. **README.md** (18 changes: 14 add, 4 del)
   - Replace `plan-project` with `prd`, `tech-spec`, `gdd`
   - Add sprint-planning documentation for Level 4
   - Update Scrum Master section with sprint-status workflow
   - Add two-tier status tracking system documentation

2. **src/modules/bmm/README.md** (29 changes: 25 add, 4 del)
   - Replace `plan-project` with `prd` (Level 2-4) and `tech-spec` (Level 0-1)
   - Add "Status Tracking in BMM" section
   - Document workflow-status.md vs sprint-status.yaml difference
   - Update usage examples

### Category 2: Test Architecture Documentation (1 file)

3. **src/modules/bmm/testarch/README.md** (26 changes: 13 add, 13 del)
   - Replace `*plan-project` with `*prd` or `*tech-spec` throughout
   - Update workflow diagrams in documentation
   - Update table headers and examples (Greenfield, Brownfield)
   - Update worked examples

### Category 3: Analysis Workflows (5 files)

4. **src/modules/bmm/workflows/1-analysis/brainstorm-game/instructions.md** (2 changes: 1 add, 1 del)
   - Replace `plan-project` with `gdd`

5. **src/modules/bmm/workflows/1-analysis/brainstorm-project/instructions.md** (2 changes: 1 add, 1 del)
   - Replace `plan-project` with `prd` (Level 2-4) or `tech-spec` (Level 0-1)

6. **src/modules/bmm/workflows/1-analysis/document-project/instructions.md** (2 changes: 1 add, 1 del)
   - Replace `plan-project` with `prd` or `tech-spec`

7. **src/modules/bmm/workflows/1-analysis/game-brief/instructions.md** (2 changes: 1 add, 1 del)
   - Replace `plan-project` with `gdd`

8. **src/modules/bmm/workflows/1-analysis/product-brief/instructions.md** (2 changes: 1 add, 1 del)
   - Replace `plan-project` with `prd` (Level 2-4 projects)

### Category 4: Research Workflows (3 files)

9. **src/modules/bmm/workflows/1-analysis/research/instructions-deep-prompt.md** (4 changes: 2 add, 2 del)
   - Replace `plan-project` with `prd` or `tech-spec`

10. **src/modules/bmm/workflows/1-analysis/research/instructions-market.md** (4 changes: 2 add, 2 del)
    - Replace `plan-project` with `prd` (software L2-4) or `gdd` (games)

11. **src/modules/bmm/workflows/1-analysis/research/instructions-technical.md** (4 changes: 2 add, 2 del)
    - Replace `plan-project` with `prd` (Level 2-4) or `tech-spec`

### Category 5: Planning & Testing Workflows (4 files)

12. **src/modules/bmm/workflows/2-plan-workflows/ux/instructions-ux.md** (2 changes: 1 add, 1 del)
    - Replace `plan-project` with `prd`

13. **src/modules/bmm/workflows/README.md** (10 changes: 6 add, 4 del)
    - Update workflow phase diagram (Phase 2: Planning)
    - Add sprint-planning for Level 4 in Phase 4
    - Replace `plan-project` references with conditional `prd`/`tech-spec`
    - Update brownfield section

14. **src/modules/bmm/workflows/testarch/framework/README.md** (2 changes: 1 add, 1 del)
    - Replace `plan-project` with `prd` or `tech-spec`

15. **src/modules/bmm/workflows/testarch/test-design/README.md** (2 changes: 1 add, 1 del)
    - Replace `plan-project` with `prd` or `tech-spec`

## Pattern Recognition

### Replacement Pattern

- **`*plan-project`** → **`*prd`** (for software Level 2-4 projects)
- **`*plan-project`** → **`*tech-spec`** (for software Level 0-1 projects)
- **`*plan-project`** → **`*gdd`** (for game projects)

### New Documentation Elements

1. **Two-tier status tracking system**:
   - workflow-status.md (Phases 1-3)
   - sprint-status.yaml (Phase 4 - Level 4 only)

2. **Level-aware instructions**:
   - Level 0-1: Use `*tech-spec`
   - Level 2-4: Use `*prd`
   - Games: Use `*gdd`

3. **Sprint planning workflow**:
   - For Level 4 projects only
   - Generates `sprint-status.yaml` from epic files
   - Auto-detects current status based on file existence

## Testing Strategy

### File Validation

- [ ] All 15 files present and retrievable
- [ ] No syntax errors in markdown/XML/YAML
- [ ] All file paths correct

### Content Validation

- [ ] Verify `plan-project` replaced appropriately in all 15 files
- [ ] Verify level-specific guidance (L0-1 vs L2-4) is consistent
- [ ] Verify sprint-status documentation added
- [ ] Verify workflow diagrams updated correctly

### Automated Testing

- [ ] npm validate: Passes all configuration checks
- [ ] npm lint: No new errors (ignore pre-existing)
- [ ] File structure integrity

### Documentation Verification

- [ ] Markdown formatting valid (no broken links, syntax errors)
- [ ] XML/Handlebars syntax correct in workflow files
- [ ] Table formatting consistent
- [ ] Cross-references valid

## Expected Outcomes

### Successful Implementation

✅ All 15 files updated with correct replacements
✅ Status tracking system properly documented
✅ Level-aware guidance consistent
✅ Sprint planning workflow for Level 4 documented
✅ npm validate passes
✅ npm lint shows no new errors
✅ Documentation remains production-ready

### No Breaking Changes

- Documentation-only updates
- No code changes
- No configuration changes
- Pure content updates for clarity and accuracy

## Reference Notes

### Previous PR Patterns

- PR #745: Marketplace plugin (307 lines, 1 file)
- PR #777: 'new' tool fix (1 line, targeted change)
- PR #784: Handoff workflows (1,625 lines, 10 files, comprehensive)

### Current PR Pattern

- PR #812: Documentation update (72 additions, 39 deletions, 15 files)
- Focus: Consistency and clarity
- Scope: Documentation only
- Impact: High visibility (README, TEA guides, workflows)

## Success Criteria

1. **All files properly updated**: 15/15 files with correct replacements
2. **No new lint errors**: npm lint clean (ignoring pre-existing)
3. **Configuration valid**: npm validate passes
4. **Documentation consistency**: All references updated appropriately
5. **Functional completeness**: Ready for production release
6. **Quality gates**: No broken links, syntax errors, or inconsistencies

## Implementation Notes

### Key Considerations

- This is documentation-only changes
- Changes follow clear, predictable patterns
- Multiple files need similar replacements (ensures consistency)
- Level-aware guidance is critical for accuracy
- Sprint-status documentation is new (Level 4 specific)

### Validation Points

- Workflow diagrams must be accurate
- Table formatting must remain consistent
- XML/Handlebars syntax in workflow files must be valid
- Cross-references must remain valid

### Risk Mitigation

- Documentation changes have no runtime impact
- Consistent replacement pattern reduces error risk
- Clear level-specific guidance prevents user confusion
- All changes traceable to PR #811 issue resolution
