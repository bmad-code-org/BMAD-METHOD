# Merge Upstream Workflow Validation Checklist

## Pre-Merge Setup

- [ ] Git status confirmed clean working tree (no uncommitted changes)
- [ ] Current branch verified and matches target branch
- [ ] Upstream remote exists and is accessible
- [ ] Modification reference file loaded and reviewed
- [ ] Critical modification verified present before merge started

## Safety Measures

- [ ] Backup branch created with format: backup-before-pull-YYYYMMDD-HHMMSS
- [ ] Backup branch creation confirmed via `git branch` output
- [ ] Modification reference saved to claudedocs/installer-modification-reference.md
- [ ] Reference file includes: file path, line numbers, code snippet, verification command
- [ ] Reference file includes: insertion point details and recovery instructions

## Merge Execution

- [ ] Upstream changes fetched successfully from specified remote
- [ ] Merge commit statistics displayed (files changed, insertions, deletions)
- [ ] Merge strategy used: merge (not rebase) to preserve published history
- [ ] If conflicts occurred: All conflicts resolved manually
- [ ] If conflicts occurred: Critical modification preserved during resolution
- [ ] Merge commit created with proper commit hash recorded
- [ ] Git status shows clean state after merge (no unmerged paths)

## Critical Modification Preservation

- [ ] Post-merge verification executed: `grep -A 2 "Skip workflow instructions" tools/cli/installers/lib/core/installer.js`
- [ ] Verification output confirms modification exists at lines 913-916 (or nearby)
- [ ] Modification code intact: 4-line skip block for workflow instructions.md files
- [ ] If lost: Manual restoration completed following reference documentation
- [ ] If lost: Manual restoration verified with grep command
- [ ] Module detection verified: `find src/modules -name "install-menu-config.yaml"` returns all expected modules

## Memory Updates

- [ ] Serena MCP memory updated: CRITICAL-installer-fork-modification
- [ ] Serena memory includes: merge date, commit hash, backup branch name
- [ ] Serena memory includes: verification status and any conflicts encountered
- [ ] Serena memory includes: updated merge workflow history
- [ ] Graphiti MCP episode created with group_id: BMAD-METHOD
- [ ] Graphiti episode includes: merge context and upstream commits pulled
- [ ] Graphiti episode includes: modification preservation status
- [ ] Both memory systems confirmed successful storage

## Backup Branch Cleanup

- [ ] Backup branches identified: `git branch | grep backup-before-pull` executed
- [ ] All backup branches matching pattern backup-before-pull-\* listed
- [ ] Backup branches deleted successfully
- [ ] Deletion confirmed: `git branch` shows no backup-before-pull branches remain
- [ ] Number of cleaned up branches reported in summary

## Completeness

- [ ] Merge commit hash documented in completion summary
- [ ] Backup branches cleaned up count included in summary
- [ ] Files changed statistics recorded (files, insertions, deletions)
- [ ] Modification preservation status documented (preserved/manually restored)
- [ ] Reference documentation location confirmed: claudedocs/installer-modification-reference.md
- [ ] Next steps provided: optional push to origin, consider PR to upstream
- [ ] Future workflow invocation command documented: `workflow merge-upstream`

## Specific Module Validation

- [ ] teachflow module install config present: src/modules/teachflow/\_module-installer/install-menu-config.yaml
- [ ] bmm module install config present: src/modules/bmm/\_module-installer/install-menu-config.yaml
- [ ] cis module install config present: src/modules/cis/\_module-installer/install-menu-config.yaml
- [ ] bmb module install config present: src/modules/bmb/\_module-installer/install-menu-config.yaml
- [ ] All workflow instructions.md files protected (28+ files in bmm module)

## Final Validation

### Pre-Merge Setup Issues

- [ ] Issue List:

### Safety Measures Issues

- [ ] Issue List:

### Merge Execution Issues

- [ ] Issue List:

### Critical Modification Preservation Issues

- [ ] Issue List:

### Memory Updates Issues

- [ ] Issue List:

### Backup Branch Cleanup Issues

- [ ] Issue List:

### Completeness Issues

- [ ] Issue List:

### Module Validation Issues

- [ ] Issue List:

---

**Workflow Status**: [ ] Complete and Validated

**Signed off by**: **\*\*\*\***\_**\*\*\*\*** **Date**: **\*\*\*\***\_**\*\*\*\***
