# PR #812 Implementation Plan

## Overview

**PR #812: docs: update for v6-alpha workflow changes**

- **Status**: Open
- **Base Branch**: v6-alpha
- **Author**: GTauber
- **Issue**: Closes #811
- **Changes**: 72 additions, 39 deletions across 15 files
- **Focus**: Documentation consistency for v6-alpha workflow changes

## Objectives

### Primary Changes

1. Replace `*plan-project` with specialized commands across 15 files
   - `*prd` for Level 2-4 software projects
   - `*tech-spec` for Level 0-1 software projects
   - `*gdd` for game projects

2. Add sprint-status documentation for Level 4 projects

3. Update workflow diagrams and examples throughout documentation

4. Document two-tier status tracking system
   - workflow-status.md (Phases 1-3)
   - sprint-status.yaml (Phase 4 - Level 4 only)

5. Add consistency for prd/tech-spec alternatives in testarch docs

## Modified Files (15 Total)

### Root Documentation

- `README.md` (14 add, 4 del)
- `src/modules/bmm/README.md` (25 add, 4 del)

### Test Architecture

- `src/modules/bmm/testarch/README.md` (13 add, 13 del)

### Analysis Workflows

- `src/modules/bmm/workflows/1-analysis/brainstorm-game/instructions.md`
- `src/modules/bmm/workflows/1-analysis/brainstorm-project/instructions.md`
- `src/modules/bmm/workflows/1-analysis/document-project/instructions.md`
- `src/modules/bmm/workflows/1-analysis/game-brief/instructions.md`
- `src/modules/bmm/workflows/1-analysis/product-brief/instructions.md`

### Research Workflows

- `src/modules/bmm/workflows/1-analysis/research/instructions-deep-prompt.md`
- `src/modules/bmm/workflows/1-analysis/research/instructions-market.md`
- `src/modules/bmm/workflows/1-analysis/research/instructions-technical.md`

### Planning & Testing Workflows

- `src/modules/bmm/workflows/2-plan-workflows/ux/instructions-ux.md`
- `src/modules/bmm/workflows/README.md`
- `src/modules/bmm/workflows/testarch/framework/README.md`
- `src/modules/bmm/workflows/testarch/test-design/README.md`

## Implementation Pattern

### Replacement Rules

**Rule 1**: Replace `*plan-project` general references

- In software project contexts → `*prd` (for L2-4) or `*tech-spec` (for L0-1)
- In game project contexts → `*gdd`

**Rule 2**: Add level-specific guidance

- Include "(Level 2-4 projects)" or "(Level 0-1 projects)" where relevant
- Add clarity on when to use `*prd` vs `*tech-spec` vs `*gdd`

**Rule 3**: New sprint-status documentation

- Add sprint-planning workflow reference for Level 4 Phase 4
- Document sprint-status.yaml generation and auto-detection
- Keep workflow-status.md for Phases 1-3

**Rule 4**: Update workflow diagrams

- Phase 2 routing: prd (L2-4) / tech-spec (L0-1) for software, gdd for games
- Phase 4: Add sprint-planning for Level 4 before story creation cycle

## Success Criteria

✓ All 15 files properly updated with correct replacements
✓ No syntax errors in markdown or embedded XML/Handlebars  
✓ npm validate passes
✓ npm lint shows no new errors
✓ Consistent level-specific guidance throughout
✓ Sprint-status documentation accurate and complete
✓ Workflow diagrams correctly updated
✓ Ready for production release

## Technical Notes

### Content Validation Points

- Markdown formatting valid (no broken links, syntax)
- XML/Handlebars syntax correct in workflow files
- Table formatting and alignment preserved
- Cross-references remain valid
- No accidental deletions beyond intended changes

### Pattern Consistency

- Verify replacement pattern applied uniformly
- Check level-specific guidance is clear
- Ensure new sprint-status documentation is comprehensive
- Validate workflow diagram accuracy

### No Breaking Changes

- Documentation-only updates
- No code or configuration changes
- No runtime impact
- Purely content clarity and accuracy improvements

## Related Issues

- Closes #811: Documentation discrepancies
- Related commits: b8db080, 419043e, ddaefa3
