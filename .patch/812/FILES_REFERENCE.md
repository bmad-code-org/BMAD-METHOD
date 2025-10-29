# PR #812 Files Reference

## Overview

Retrieved PR #812 metadata and file change information from GitHub API.

**PR #812: docs: update for v6-alpha workflow changes**

- Status: Open
- Base Branch: v6-alpha
- Author: GTauber
- Commits: 1
- Changes: 72 additions, 39 deletions
- Files: 15 modified
- Issue: Closes #811

## Files to Modify (15 Total)

### Root Documentation (2 files)

1. README.md (18 changes: 14 add, 4 del)
2. src/modules/bmm/README.md (29 changes: 25 add, 4 del)

### Test Architecture (1 file)

3. src/modules/bmm/testarch/README.md (26 changes: 13 add, 13 del)

### Analysis Workflows (5 files)

4. src/modules/bmm/workflows/1-analysis/brainstorm-game/instructions.md (2 changes)
5. src/modules/bmm/workflows/1-analysis/brainstorm-project/instructions.md (2 changes)
6. src/modules/bmm/workflows/1-analysis/document-project/instructions.md (2 changes)
7. src/modules/bmm/workflows/1-analysis/game-brief/instructions.md (2 changes)
8. src/modules/bmm/workflows/1-analysis/product-brief/instructions.md (2 changes)

### Research Workflows (3 files)

9. src/modules/bmm/workflows/1-analysis/research/instructions-deep-prompt.md (4 changes)
10. src/modules/bmm/workflows/1-analysis/research/instructions-market.md (4 changes)
11. src/modules/bmm/workflows/1-analysis/research/instructions-technical.md (4 changes)

### Planning & Testing Workflows (4 files)

12. src/modules/bmm/workflows/2-plan-workflows/ux/instructions-ux.md (2 changes)
13. src/modules/bmm/workflows/README.md (10 changes)
14. src/modules/bmm/workflows/testarch/framework/README.md (2 changes)
15. src/modules/bmm/workflows/testarch/test-design/README.md (2 changes)

## Primary Changes

### Pattern Replacements

- `*plan-project` → `*prd` (Level 2-4 software projects)
- `*plan-project` → `*tech-spec` (Level 0-1 software projects)
- `*plan-project` → `*gdd` (game projects)

### New Documentation

- Add sprint-status.yaml documentation for Level 4 Phase 4
- Document two-tier status tracking system
- Update workflow diagrams for Phase 2 and Phase 4

## Implementation Status

Ready to begin file modifications. All 15 files identified and documented.
PR files retrieved from GitHub API successfully.
Feature branch created: feature/docs-update-v6-alpha-workflow-changes-812
Todo list created with 12 actionable items.
