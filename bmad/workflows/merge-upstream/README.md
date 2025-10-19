# Merge Upstream Workflow

**Version**: 1.0.0
**Author**: BMad
**Type**: Action Workflow (no document output)

## Purpose

Safely merge upstream repository changes while preserving critical fork modifications with automated verification and memory updates. This workflow provides a systematic, repeatable process for syncing with upstream repositories without losing custom code modifications.

## Use Cases

- Syncing your BMAD-METHOD fork with upstream bmad-code-org/BMAD-METHOD
- Preserving critical modifications during upstream pulls
- Maintaining cross-session memory of merge operations
- Ensuring custom modules remain functional after upstream integration

## How to Invoke

```bash
workflow merge-upstream
```

Or tell your BMAD agent:

```
Run the merge-upstream workflow
```

## Expected Inputs

**User Prompts During Execution:**

- Upstream remote name (default: `upstream`)
- Target branch name (default: `v6-alpha`)
- Confirmation before executing merge
- Conflict resolution if merge conflicts occur

**Files Referenced:**

- `claudedocs/installer-modification-reference.md` - Critical modification documentation
- `tools/cli/installers/lib/core/installer.js` - File containing critical modification

**Git State Required:**

- Clean working tree (no uncommitted changes)
- Upstream remote configured and accessible
- Current branch matches intended target branch

## Generated Outputs

**Git Artifacts:**

- Backup branch: `backup-before-pull-YYYYMMDD-HHMMSS`
- Merge commit with proper history preservation
- Updated reference documentation in `claudedocs/`

**Memory Updates:**

- **Serena MCP**: Updated `CRITICAL-installer-fork-modification` memory with merge details
- **Graphiti MCP**: New episode in `BMAD-METHOD` group with merge context

**Verification Reports:**

- Modification preservation status (preserved/manually restored)
- Module detection confirmation (all install-menu-config.yaml present)
- Merge statistics (files changed, commits integrated)

## Workflow Steps

1. **Pre-merge verification** - Verify clean git state and load reference docs
2. **Create backup branch** - Safety checkpoint with timestamp
3. **Document modification** - Update reference file in claudedocs/
4. **Verify before merge** - Confirm critical code exists pre-merge
5. **Fetch upstream** - Pull latest changes without merging
6. **Execute merge** - Merge with conflict handling guidance
7. **Verify preservation** - Confirm modification survived merge
8. **Update memories** - Save to Serena + Graphiti MCP
9. **Report completion** - Summary with next steps

## Special Requirements

**Required Tools:**

- **Git** - Version control for merge operations
- **Serena MCP** - Project memory management (must be active)
- **Graphiti MCP** - Knowledge graph memory (must be active)

**Critical File Protection:**
The workflow specifically protects:

- File: `tools/cli/installers/lib/core/installer.js`
- Lines: 913-916
- Code: Skip block for workflow instructions.md preservation

## Safety Features

- **Backup Branch**: Automatic timestamped backup before merge
- **Pre-merge Verification**: Confirms critical modifications exist before starting
- **Post-merge Verification**: Validates modifications survived merge
- **Recovery Guidance**: Step-by-step restoration if modifications lost
- **Memory Persistence**: Cross-session documentation for future reference

## Recovery Procedure

If merge fails or modifications are lost:

1. **Rollback**: `git reset --hard backup-before-pull-YYYYMMDD-HHMMSS`
2. **Restore**: Follow recovery instructions in `claudedocs/installer-modification-reference.md`
3. **Verify**: Run grep verification: `grep -A 2 "Skip workflow instructions" tools/cli/installers/lib/core/installer.js`
4. **Retry**: Execute workflow again after restoration

## Validation Checklist

After workflow completion, verify using `checklist.md`:

- 43 specific validation criteria across 7 categories
- Pre-merge setup, safety measures, merge execution
- Modification preservation, memory updates, completeness
- Module-specific validation for all 4 BMAD modules

## Next Steps After Workflow

**Optional:**

- Push to your fork: `git push origin v6-alpha`
- Submit PR to upstream to eliminate future maintenance burden

**For Future Syncs:**

- Run this workflow again when upstream has new changes
- Reference updated memories for historical context
- Use backup branches for safe rollback if needed

## Troubleshooting

**"Working tree not clean" error**

- Commit or stash uncommitted changes before running workflow
- Ensure no untracked files that should be tracked

**"Upstream remote not found"**

- Add upstream: `git remote add upstream https://github.com/bmad-code-org/BMAD-METHOD`
- Verify: `git remote -v`

**"Modification not found after merge"**

- Workflow will guide through manual restoration
- Reference file has exact code and insertion point
- Verification command confirms successful restoration

**"MCP servers not responding"**

- Ensure Serena and Graphiti MCP servers are active
- Check MCP configuration in .mcp.json
- Memory updates are critical for cross-session persistence

## Files in This Workflow

```
bmad/workflows/merge-upstream/
├── README.md           # This file
├── workflow.yaml       # Configuration and metadata
├── instructions.md     # Step-by-step execution guide
└── checklist.md        # Post-execution validation
```

## Version History

**v1.0.0** (2025-10-18)

- Initial workflow creation
- Based on successful manual merge execution
- Includes Serena + Graphiti memory integration
- Comprehensive validation checklist (43 criteria)

---

**Maintained by**: BMad
**Last Updated**: 2025-10-18
**Status**: Production Ready
