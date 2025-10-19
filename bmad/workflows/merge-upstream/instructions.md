# Merge Upstream Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/workflows/merge-upstream/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow process</critical>

<workflow>

<step n="1" goal="Pre-merge verification and setup">
<action>Verify git repository status to ensure a clean working tree before beginning merge</action>
<action>Check current branch and confirm it matches the expected target branch</action>
<action>Identify the upstream remote and target branch to merge from</action>

<ask>What is the upstream remote name? (default: upstream)</ask>
<ask>What branch should we merge from upstream? (default: v6-alpha)</ask>

<action>Verify the upstream remote exists and is accessible</action>

<check if="working tree not clean">
  <action>Alert user about uncommitted changes that must be resolved first</action>
  <action>Provide guidance: commit changes, stash them, or clean the working directory</action>
  <goto step="1">Wait for user to resolve before continuing</goto>
</check>

<action>Load the modification reference documentation from: {modification_reference}</action>
<action>Review critical file locations and modification details that must be preserved</action>
</step>

<step n="2" goal="Create safety backup branch">
<action>Generate a timestamped backup branch name using format: backup-before-pull-YYYYMMDD-HHMMSS</action>
<action>Create the backup branch from current HEAD as a safety checkpoint</action>
<action>Verify backup branch was created successfully</action>
<action>Inform user of backup branch name for potential rollback</action>

<critical>This backup branch is essential for recovery if the merge encounters unexpected issues</critical>
</step>

<step n="3" goal="Document critical modification for reference">
<action>Create or update the modification reference file in claudedocs/ directory</action>
<action>Document the exact code that must be preserved during merge</action>
<action>Include file path, line numbers, and the critical code snippet</action>
<action>Add insertion point details and recovery instructions</action>
<action>Save verification commands for post-merge checking</action>

<example>
Reference file should include:
- File: tools/cli/installers/lib/core/installer.js
- Lines: 913-916
- Code: Skip block for workflow instructions.md
- Verification: grep command to check presence
</example>
</step>

<step n="4" goal="Verify modification exists before merge">
<action>Execute verification command to confirm critical modification is present</action>
<action>Use grep to search for the modification signature in the target file</action>

<critical>Command: grep -A 2 "Skip workflow instructions" tools/cli/installers/lib/core/installer.js</critical>

<check if="modification not found">
  <action>Alert user that critical modification is missing from current codebase</action>
  <action>Provide guidance on restoring the modification before attempting merge</action>
  <goto step="1">Halt until modification is restored</goto>
</check>

<action>Confirm modification present at expected location</action>
<action>Record current line numbers for post-merge comparison</action>
</step>

<step n="5" goal="Fetch upstream changes">
<action>Fetch latest changes from upstream remote without merging</action>
<action>Display summary of incoming changes: commits, files, insertions/deletions</action>
<action>Review commit messages from upstream to understand what's being integrated</action>

<critical>Command: git fetch {{upstream_remote}} {{target_branch}}</critical>

<action if="fetch fails">Alert user about network issues or remote access problems</action>
</step>

<step n="6" goal="Execute merge with safety checks">
<action>Explain merge strategy: using merge (not rebase) to preserve published history</action>
<action>Display number of divergent commits between local and upstream</action>

<ask>Ready to proceed with merge? Review upstream changes above. [yes/no]</ask>

<check if="user declines">
  <action>Inform user they can review changes and restart workflow when ready</action>
  <action>Remind user of backup branch location for safety</action>
  <goto step="END">Exit workflow</goto>
</check>

<action>Execute merge command: git merge {{upstream_remote}}/{{target_branch}}</action>

<check if="merge conflicts occur">
  <action>Display conflict files and conflict markers</action>
  <action>Guide user through conflict resolution, emphasizing preservation of critical modification</action>
  <action>Provide specific guidance for installer.js conflicts if present</action>
  <ask>Have you resolved all conflicts? [yes/no]</ask>
  <action if="conflicts resolved">Verify modification preserved during resolution</action>
  <action if="conflicts not resolved">Wait for user to complete resolution</action>
</check>

<action>Record merge commit hash for documentation</action>
<action>Display merge statistics: files changed, insertions, deletions</action>
</step>

<step n="7" goal="Verify modification preservation">
<action>Execute post-merge verification to confirm critical modification survived</action>

<critical>Command: grep -A 2 "Skip workflow instructions" tools/cli/installers/lib/core/installer.js</critical>

<check if="modification not found">
  <action>Alert user that critical modification was lost during merge</action>
  <action>Load recovery instructions from reference documentation</action>
  <action>Guide user to manually re-insert the 4-line modification after config.yaml skip block</action>
  <action>Verify manual restoration before continuing</action>
</check>

<action>Confirm modification exists at same or nearby line numbers</action>
<action>Verify git status shows clean merge completion</action>
<action>Check that all expected modules still have install-menu-config.yaml files</action>

<critical>Verification: find src/modules -name "install-menu-config.yaml" should show all modules intact</critical>
</step>

<step n="8" goal="Update cross-session memories">
<action>Prepare comprehensive memory update for Serena MCP with merge details</action>
<action>Include merge date, commit hash, backup branch name, verification results</action>
<action>Document any conflicts encountered and how they were resolved</action>
<action>Update merge workflow history and success metrics</action>

<action>Write updated memory to Serena: CRITICAL-installer-fork-modification</action>

<action>Prepare episode for Graphiti MCP knowledge graph</action>
<action>Include merge context, upstream commits pulled, modification preservation status</action>
<action>Link to related entities: installer.js, modules, git workflow</action>

<action>Add merge episode to Graphiti with group_id: BMAD-METHOD</action>

<action>Verify both memory systems confirm successful storage</action>
</step>

<step n="9" goal="Report completion and next steps">
<action>Generate comprehensive merge completion summary for {user_name}</action>

<action>Include in summary:

- Merge status (success/conflicts resolved)
- Backup branch name and location
- Merge commit hash
- Files changed statistics
- Modification preservation status (preserved/manually restored)
- Memory update confirmations (Serena + Graphiti)
- Reference documentation location
  </action>

<action>Provide next steps guidance:

- Optional: Push to origin fork (git push origin {{target_branch}})
- Consider: Submit PR to upstream to eliminate future maintenance
- Future: Use this workflow for subsequent upstream syncs
  </action>

<action>Remind user of verification commands for future reference</action>

<critical>Workflow complete! All critical modifications preserved and documented.</critical>
</step>

</workflow>
