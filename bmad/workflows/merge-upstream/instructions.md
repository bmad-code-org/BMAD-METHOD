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

<step n="3" goal="Document critical modifications for reference">
<action>Create or update modification reference files in claudedocs/ directory</action>
<action>Document all fork-specific modifications that must be preserved during merge</action>
<action>Include file paths, line numbers, and critical code snippets</action>
<action>Add insertion point details and recovery instructions</action>
<action>Save verification commands for post-merge checking</action>

<example>
Reference files should include:

1. Installer Skip Block (claudedocs/installer-modification-reference.md):
   - File: tools/cli/installers/lib/core/installer.js
   - Lines: 913-916
   - Code: Skip block for workflow instructions.md
   - Verification: grep command to check presence

2. OpenCode Integration (claudedocs/opencode-integration-reference.md):
   - File: tools/cli/installers/lib/ide/opencode.js (entire file)
   - Type: Additive modification (new file)
   - Dependency: comment-json in package.json
   - Verification: File existence + dependency check + runtime check
</example>
</step>

<step n="4" goal="Verify modifications exist before merge">
<action>Execute verification commands to confirm all critical modifications are present</action>

<substep n="4a" goal="Verify Installer Modification">
<action>Use grep to search for the modification signature in the target file</action>

<critical>Command: grep -A 2 "Skip workflow instructions" tools/cli/installers/lib/core/installer.js</critical>

<check if="modification not found">
  <action>Alert user that critical installer modification is missing from current codebase</action>
  <action>Provide guidance on restoring the modification before attempting merge</action>
  <goto step="1">Halt until modification is restored</goto>
</check>

<action>Confirm installer modification present at expected location</action>
<action>Record current line numbers for post-merge comparison</action>
</substep>

<substep n="4b" goal="Verify OpenCode Integration">
<action>Execute OpenCode pre-merge verification checks</action>

<critical>Commands:
1. test -f tools/cli/installers/lib/ide/opencode.js
2. grep -q "comment-json" package.json
3. node -e "const {IdeManager}=require('./tools/cli/installers/lib/ide/manager');console.log(new IdeManager().getAvailableIdes().find(i=>i.value==='opencode')?'present':'missing')"
</critical>

<check if="any opencode check fails">
  <action>Alert user that OpenCode integration is incomplete or missing</action>
  <action>Provide recovery steps from claudedocs/opencode-integration-reference.md</action>
  <action>Suggest restoring from previous backup or commit</action>
  <goto step="1">Halt until OpenCode integration is restored</goto>
</check>

<action>Confirm OpenCode integration is complete and functional</action>
</substep>

<action>All fork modifications verified and ready for merge</action>
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

<step n="7" goal="Verify fork modifications preservation">
<action>Execute post-merge verification to confirm all critical fork modifications survived</action>

<substep n="7a" goal="Verify Installer Skip Block">
<critical>Command: grep -A 2 "Skip workflow instructions" tools/cli/installers/lib/core/installer.js</critical>

<check if="modification not found">
  <action>Alert user that critical installer modification was lost during merge</action>
  <action>Load recovery instructions from reference documentation</action>
  <action>Guide user to manually re-insert the 4-line modification after config.yaml skip block</action>
  <action>Verify manual restoration before continuing</action>
</check>

<action>Confirm modification exists at same or nearby line numbers</action>
<action>Check that all expected modules still have install-menu-config.yaml files</action>

<critical>Verification: find src/modules -name "install-menu-config.yaml" should show all modules intact</critical>
</substep>

<substep n="7b" goal="Verify OpenCode Integration">
<action>Execute OpenCode verification checks to confirm fork-specific feature survived</action>

<critical>Quick Verification Commands:</critical>

<action>Check 1 - OpenCode installer file exists</action>
<critical>Command: test -f tools/cli/installers/lib/ide/opencode.js && echo "✅ OpenCode present" || echo "❌ MISSING"</critical>

<check if="opencode.js not found">
  <action>Alert user that OpenCode integration was lost during merge</action>
  <action>Identify most recent backup branch: git branch -a | grep backup-before | tail -1</action>
  <action>Restore OpenCode: git checkout [backup-branch] -- tools/cli/installers/lib/ide/opencode.js</action>
  <action>Verify restoration successful</action>
</check>

<action>Check 2 - comment-json dependency exists in package.json</action>
<critical>Command: grep -q "comment-json" package.json && echo "✅ Dependency present" || echo "❌ MISSING"</critical>

<check if="dependency not found">
  <action>Alert user that comment-json dependency was lost during merge</action>
  <action>Restore package.json from backup OR manually add: "comment-json": "^4.2.5"</action>
  <action>Run: npm install</action>
  <action>Verify: npm list comment-json</action>
</check>

<action>Check 3 - OpenCode is discoverable by IDE manager (runtime check)</action>
<critical>Command: node -e "const {IdeManager}=require('./tools/cli/installers/lib/ide/manager');const opencode=new IdeManager().getAvailableIdes().find(i=>i.value==='opencode');console.log(opencode?'✅ OpenCode discoverable':'❌ MISSING from IDE list')"</critical>

<check if="opencode not discoverable">
  <action>Alert user about runtime discovery failure</action>
  <action>Verify both opencode.js file AND comment-json dependency are present</action>
  <action>Check for syntax errors: node -c tools/cli/installers/lib/ide/opencode.js</action>
  <action>If file is corrupted, restore from backup branch</action>
</check>

<action>Confirm all three OpenCode checks passed</action>
<action>Reference: Full recovery procedures in claudedocs/opencode-integration-reference.md</action>
</substep>

<action>Verify git status shows clean merge completion with all modifications intact</action>
</step>

<step n="8" goal="Update cross-session memories">
<action>Prepare comprehensive memory updates for Serena MCP with merge details</action>
<action>Include merge date, commit hash, backup branch name, verification results for all modifications</action>
<action>Document any conflicts encountered and how they were resolved</action>
<action>Update merge workflow history and success metrics</action>

<action>Write updated memory to Serena: CRITICAL-installer-fork-modification</action>
<action>Write updated memory to Serena: CRITICAL-opencode-fork-integration</action>

<action>Prepare episode for Graphiti MCP knowledge graph</action>
<action>Include merge context, upstream commits pulled, modification preservation status</action>
<action>Link to related entities: installer.js, modules, git workflow</action>

<action>Add merge episode to Graphiti with group_id: BMAD-METHOD</action>

<action>Verify both memory systems confirm successful storage</action>
</step>

<step n="9" goal="Clean up backup branches">
<action>List all backup branches created during merge process</action>
<action>Identify backup branches matching pattern: backup-before-pull-*</action>

<critical>Command: git branch | grep backup-before-pull</critical>

<check if="backup branches found">
  <action>Display found backup branches to user</action>
  <action>Delete all backup branches matching the pattern</action>
  <action>Confirm deletion with git branch output</action>
  <action>Report number of branches cleaned up</action>
</check>

<check if="no backup branches found">
  <action>Inform user that no backup branches need cleanup</action>
</check>

<action>Verify backup branches have been removed from git branch list</action>
</step>

<step n="10" goal="Report completion and next steps">
<action>Generate comprehensive merge completion summary for {user_name}</action>

<action>Include in summary:

- Merge status (success/conflicts resolved)
- Backup branches cleaned up (count)
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
