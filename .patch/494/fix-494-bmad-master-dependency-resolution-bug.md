# GitHub Issue #494: bmad-master dependency resolution bug

**Issue URL**: https://github.com/bmad-code-org/BMAD-METHOD/issues/494  
**Reporter**: @piatra-automation  
**Date**: August 22, 2025  
**Status**: Open

## Description

**Bug Summary**: The bmad-master agent incorrectly resolves dependency paths due to missing variable interpolation syntax in the IDE-FILE-RESOLUTION documentation.

**Root Cause**: Line 14 shows `Dependencies map to root/type/name` instead of `Dependencies map to {root}/{type}/{name}`, causing the agent to treat "root" as a literal directory name rather than a variable placeholder.

## Steps to Reproduce

1. Use the bmad-master agent to execute any task that requires loading dependencies
2. The agent attempts to resolve paths like `bmad/tasks/create-doc.md` instead of `.bmad/tasks/create-doc.md`
3. Files fail to load because the root directory is interpreted as literal "bmad" rather than the actual project root (typically `.bmad`)
4. Agent cannot find project `core-config.yaml` and other dependencies

## Expected Behavior

Dependencies should resolve to the correct path format using variable interpolation, allowing the agent to properly locate project files in the `.bmad` directory structure.

## Environment Details

- **Model(s) Used**: Any model using bmad-master agent
- **Agentic IDE Used**: Any IDE implementing BMAD Method
- **Project Language**: N/A (affects all projects)
- **BMad Method version**: Current main branch

## Technical Details

**File**: `bmad-core/agents/bmad-master.md:14`  
**Current (incorrect)**: `Dependencies map to root/type/name`  
**Fixed**: `Dependencies map to {root}/{type}/{name}`

## Additional Context

This is a documentation bug in the agent definition that causes runtime path resolution failures. The missing curly braces prevent proper variable interpolation, making "root" a literal string instead of a placeholder for the actual project root directory.

## PR Status

Working on a fix - correcting the path format to use proper variable interpolation syntax `{root}/{type}/{name}`.

## Metadata

- **Assignees**: None
- **Labels**: None
- **Projects**: None
- **Milestone**: None
- **Participants**: @piatra-automation
