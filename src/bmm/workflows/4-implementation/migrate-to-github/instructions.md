# Migrate to GitHub - Production-Grade Story Migration

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>RELIABILITY FIRST: This workflow prioritizes data integrity over speed</critical>

<workflow>

<step n="0" goal="Pre-Flight Safety Checks">
  <critical>MUST verify all prerequisites before ANY migration operations</critical>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PRE-FLIGHT SAFETY CHECKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="0a" title="Verify GitHub MCP access">
    <action>Test GitHub MCP connection:</action>
    <action>Call: mcp__github__get_me()</action>

    <check if="API call fails">
      <output>
❌ CRITICAL: GitHub MCP not accessible

Cannot proceed with migration without GitHub API access.

Possible causes:
- GitHub MCP server not configured
- Authentication token missing or invalid
- Network connectivity issues

Fix:
1. Ensure GitHub MCP is configured in Claude settings
2. Verify token has required permissions:
   - repo (full control)
   - write:discussion (for comments)
3. Test connection: Try any GitHub MCP command

HALTING - Cannot migrate without GitHub access.
      </output>
      <action>HALT</action>
    </check>

    <action>Extract current user info:</action>
    <action>  - username: {{user.login}}</action>
    <action>  - user_id: {{user.id}}</action>

    <output>✅ GitHub MCP connected (@{{username}})</output>
  </substep>

  <substep n="0b" title="Verify repository access">
    <action>Verify github_owner and github_repo parameters provided</action>

    <check if="parameters missing">
      <output>
❌ ERROR: GitHub repository not specified

Required parameters:
  github_owner: GitHub username or organization
  github_repo: Repository name

Usage:
  /migrate-to-github github_owner=jschulte github_repo=myproject
  /migrate-to-github github_owner=jschulte github_repo=myproject mode=execute

HALTING
      </output>
      <action>HALT</action>
    </check>

    <action>Test repository access:</action>
    <action>Call: mcp__github__list_issues({
      owner: {{github_owner}},
      repo: {{github_repo}},
      per_page: 1
    })</action>

    <check if="repository not found or access denied">
      <output>
❌ CRITICAL: Cannot access repository {{github_owner}}/{{github_repo}}

Possible causes:
- Repository doesn't exist
- Token lacks access to this repository
- Repository is private and token doesn't have permission

Verify:
1. Repository exists: <https://github.com/{{github_owner}}/{{github_repo}}>
2. Token has write access to issues
3. Repository name is spelled correctly

HALTING
      </output>
      <action>HALT</action>
    </check>

    <output>✅ Repository accessible ({{github_owner}}/{{github_repo}})</output>
  </substep>

  <substep n="0c" title="Verify local files exist">
    <action>Check sprint-status.yaml exists:</action>
    <action>test -f {{sprint_status}}</action>

    <check if="file not found">
      <output>
❌ ERROR: sprint-status.yaml not found at {{sprint_status}}

Cannot migrate without sprint status file.

Run /sprint-planning to generate it first.

HALTING
      </output>
      <action>HALT</action>
    </check>

    <action>Read and parse sprint-status.yaml</action>
    <action>Count total stories to migrate</action>

    <output>✅ Found {{total_stories}} stories in sprint-status.yaml</output>

    <action>Verify story files exist:</action>
    <action>For each story, try multiple naming patterns to find file</action>

    <action>Report:</action>
    <output>
📊 Story File Status:
- ✅ Files found: {{stories_with_files}}
- ❌ Files missing: {{stories_without_files}}
{{#if stories_without_files > 0}}
  Missing: {{missing_story_keys}}
{{/if}}
    </output>

    <check if="stories_without_files > 0">
      <ask>
⚠️ {{stories_without_files}} stories have no files

Options:
[C] Continue (only migrate stories with files)
[S] Skip these stories (add to skip list)
[H] Halt (fix missing files first)

Choice:
      </ask>

      <check if="choice == 'H'">
        <action>HALT</action>
      </check>
    </check>
  </substep>

  <substep n="0d" title="Check for existing migration">
    <action>Check if state file exists: {{state_file}}</action>

    <check if="state file exists">
      <action>Read migration state</action>
      <action>Extract: stories_migrated, issues_created, last_completed, timestamp</action>

      <output>
⚠️ Previous migration detected

Last migration:
- Date: {{migration_timestamp}}
- Stories migrated: {{stories_migrated.length}}
- Issues created: {{issues_created.length}}
- Last completed: {{last_completed}}
- Status: {{migration_status}}

Options:
[R] Resume (continue from where it left off)
[F] Fresh (start over, may create duplicates if not careful)
[V] View (show what was migrated)
[D] Delete state (clear and start fresh)

Choice:
      </output>

      <ask>How to proceed?</ask>

      <check if="choice == 'R'">
        <action>Set resume_mode = true</action>
        <action>Load list of already-migrated stories</action>
        <action>Filter them out from migration queue</action>
        <output>✅ Resuming from story: {{last_completed}}</output>
      </check>

      <check if="choice == 'F'">
        <output>⚠️ WARNING: Fresh start may create duplicate issues if stories were already migrated.</output>
        <ask>Confirm fresh start (will check for duplicates)? (yes/no):</ask>
        <check if="not confirmed">
          <action>HALT</action>
        </check>
      </check>

      <check if="choice == 'V'">
        <action>Display migration state details</action>
        <action>Then re-prompt for choice</action>
      </check>

      <check if="choice == 'D'">
        <action>Delete state file</action>
        <action>Set resume_mode = false</action>
        <output>✅ State cleared</output>
      </check>
    </check>
  </substep>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PRE-FLIGHT CHECKS PASSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- GitHub MCP: Connected
- Repository: Accessible
- Sprint status: Loaded ({{total_stories}} stories)
- Story files: {{stories_with_files}} found
- Mode: {{mode}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="1" goal="Dry-run mode - Preview migration plan">
  <check if="mode != 'dry-run'">
    <action>Skip to Step 2 (Execute mode)</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 DRY-RUN MODE (Preview Only - No Changes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This will show what WOULD happen without actually creating issues.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>For each story in sprint-status.yaml:</action>

  <iterate>For each story_key:</iterate>

  <substep n="1a" title="Check if issue already exists">
    <action>Search GitHub: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:story:{{story_key}}"
    })</action>

    <check if="issue found">
      <action>would_update = {{update_existing}}</action>
      <output>
📝 Story {{story_key}}:
   GitHub: Issue #{{existing_issue.number}} EXISTS
   Action: {{#if would_update}}Would UPDATE{{else}}Would SKIP{{/if}}
   Current labels: {{existing_issue.labels}}
   Current assignee: {{existing_issue.assignee || "none"}}
      </output>
    </check>

    <check if="issue not found">
      <action>would_create = true</action>
      <action>Read local story file</action>
      <action>Parse: title, ACs, tasks, epic, status</action>

      <output>
📝 Story {{story_key}}:
   GitHub: NOT FOUND
   Action: Would CREATE

   Proposed Issue:
   - Title: "Story {{story_key}}: {{parsed_title}}"
   - Labels: type:story, story:{{story_key}}, status:{{status}}, epic:{{epic_number}}, complexity:{{complexity}}
   - Milestone: Epic {{epic_number}}
   - Acceptance Criteria: {{ac_count}} items
   - Tasks: {{task_count}} items
   - Assignee: {{#if status == 'in-progress'}}@{{infer_from_git_log}}{{else}}none{{/if}}
      </output>
    </check>
  </substep>

  <action>Count actions:</action>
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DRY-RUN SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Total Stories:** {{total_stories}}

**Actions:**
- ✅ Would CREATE: {{would_create_count}} new issues
- 🔄 Would UPDATE: {{would_update_count}} existing issues
- ⏭️ Would SKIP: {{would_skip_count}} (existing, no update)

**Epics/Milestones:**
- Would CREATE: {{epic_milestones_to_create.length}} milestones
- Already exist: {{epic_milestones_existing.length}}

**Estimated API Calls:**
- Issue searches: {{total_stories}} (check existing)
- Issue creates: {{would_create_count}}
- Issue updates: {{would_update_count}}
- Milestone operations: {{milestone_operations}}
- **Total:** ~{{total_api_calls}} API calls

**Rate Limit Impact:**
- Authenticated limit: 5000/hour
- This migration: ~{{total_api_calls}} calls
- Remaining after: ~{{5000 - total_api_calls}}
- Safe: {{#if total_api_calls < 1000}}YES{{else}}Borderline (consider smaller batches){{/if}}

**Estimated Duration:** {{estimated_minutes}} minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ This was a DRY-RUN. No issues were created.

To execute the migration:
  /migrate-to-github mode=execute github_owner={{github_owner}} github_repo={{github_repo}}

To migrate only Epic 2:
  /migrate-to-github mode=execute filter_by_epic=2 github_owner={{github_owner}} github_repo={{github_repo}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Exit workflow (dry-run complete)</action>
</step>

<step n="2" goal="Execute mode - Perform migration with atomic operations">
  <check if="mode != 'execute'">
    <action>Skip to Step 3 (Verify mode)</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ EXECUTE MODE (Migrating Stories to GitHub)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**SAFETY GUARANTEES:**
✅ Idempotent - Can re-run safely (checks for duplicates)
✅ Atomic - Each story fully succeeds or rolls back
✅ Verified - Reads back each created issue
✅ Resumable - Saves state after each story
✅ Reversible - Creates rollback manifest
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <ask>
⚠️ FINAL CONFIRMATION

You are about to create ~{{would_create_count}} GitHub Issues.

This operation:
- WILL create issues in {{github_owner}}/{{github_repo}}
- WILL modify your GitHub repository
- CAN be rolled back (we'll create rollback manifest)
- CANNOT be undone automatically after issues are created

Have you:
- [ ] Run dry-run mode to preview?
- [ ] Verified repository is correct?
- [ ] Backed up sprint-status.yaml?
- [ ] Confirmed you want to proceed?

Type "I understand and want to proceed" to continue:
  </ask>

  <check if="confirmation != 'I understand and want to proceed'">
    <output>❌ Migration cancelled - confirmation not received</output>
    <action>HALT</action>
  </check>

  <action>Initialize migration state:</action>
  <action>
migration_state = {
  started_at: {{timestamp}},
  mode: "execute",
  github_owner: {{github_owner}},
  github_repo: {{github_repo}},
  total_stories: {{total_stories}},
  stories_migrated: [],
  issues_created: [],
  issues_updated: [],
  issues_failed: [],
  rollback_manifest: [],
  last_completed: null
}
  </action>

  <action>Save initial state to {{state_file}}</action>

  <action>Initialize rollback manifest (for safety):</action>
  <action>rollback_manifest = {
    created_at: {{timestamp}},
    github_owner: {{github_owner}},
    github_repo: {{github_repo}},
    created_issues: [] # Will track issue numbers for rollback
  }</action>

  <iterate>For each story in sprint-status.yaml:</iterate>

  <substep n="2a" title="Migrate single story (ATOMIC)">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Migrating {{current_index}}/{{total_stories}}: {{story_key}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <action>Read local story file</action>

    <check if="file not found">
      <output>  ⏭️ SKIP - No file found</output>
      <action>Add to migration_state.issues_failed with reason: "File not found"</action>
      <action>Continue to next story</action>
    </check>

    <action>Parse story file:</action>
    <action>  - Extract all 12 sections</action>
    <action>  - Parse Acceptance Criteria (convert to checkboxes)</action>
    <action>  - Parse Tasks (convert to checkboxes)</action>
    <action>  - Extract metadata: epic_number, complexity</action>

    <action>Check if issue already exists (idempotent check):</action>
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:story:{{story_key}}"
    })</action>

    <check if="issue exists AND update_existing == false">
      <output>  ✅ EXISTS - Issue #{{existing_issue.number}} (skipping, update_existing=false)</output>
      <action>Add to migration_state.stories_migrated (already done)</action>
      <action>Continue to next story</action>
    </check>

    <check if="issue exists AND update_existing == true">
      <output>  🔄 EXISTS - Issue #{{existing_issue.number}} (updating)</output>

      <action>ATOMIC UPDATE with retry:</action>
      <action>
attempt = 0
max_attempts = {{max_retries}} + 1

WHILE attempt < max_attempts:
  TRY:
    # Update issue
    result = mcp__github__issue_write({
      method: "update",
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{existing_issue.number}},
      title: "Story {{story_key}}: {{parsed_title}}",
      body: {{convertStoryToIssueBody(parsed)}},
      labels: {{generateLabels(story_key, status, parsed)}}
    })

    # Verify update succeeded (read back)
    sleep 1 second # GitHub eventual consistency

    verification = mcp__github__issue_read({
      method: "get",
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{existing_issue.number}}
    })

    # Check verification
    IF verification.title != expected_title:
      THROW "Write verification failed"

    # Success!
    output: "  ✅ UPDATED and VERIFIED - Issue #{{existing_issue.number}}"
    BREAK

  CATCH error:
    attempt++
    IF attempt < max_attempts:
      sleep {{retry_backoff_ms[attempt]}}
      output: "  ⚠️ Retry {{attempt}}/{{max_retries}} after error: {{error}}"
    ELSE:
      output: "  ❌ FAILED after {{max_retries}} retries: {{error}}"
      add to migration_state.issues_failed

      IF halt_on_critical_error:
        HALT
      ELSE:
        CONTINUE to next story
      </action>

      <action>Add to migration_state.issues_updated</action>
    </check>

    <check if="issue does NOT exist">
      <output>  🆕 CREATING new issue...</output>

      <action>Generate issue body from story file:</action>
      <action>
issue_body = """
**Story File:** [{{story_key}}.md]({{file_path_in_repo}})
**Epic:** {{epic_number}}
**Complexity:** {{complexity}} ({{task_count}} tasks)

## Business Context
{{parsed.businessContext}}

## Acceptance Criteria
{{#each parsed.acceptanceCriteria}}
- [ ] AC{{@index + 1}}: {{this}}
{{/each}}

## Tasks
{{#each parsed.tasks}}
- [ ] {{this}}
{{/each}}

## Technical Requirements
{{parsed.technicalRequirements}}

## Definition of Done
{{#each parsed.definitionOfDone}}
- [ ] {{this}}
{{/each}}

---
_Migrated from BMAD local files_
_Sync timestamp: {{timestamp}}_
_Local file: `{{story_file_path}}`_
"""
      </action>

      <action>Generate labels:</action>
      <action>
labels = [
  "type:story",
  "story:{{story_key}}",
  "status:{{current_status}}",
  "epic:{{epic_number}}",
  "complexity:{{complexity}}"
]

{{#if has_high_risk_keywords}}
labels.push("risk:high")
{{/if}}
      </action>

      <action>ATOMIC CREATE with retry and verification:</action>
      <action>
attempt = 0

WHILE attempt < max_attempts:
  TRY:
    # Create issue
    created_issue = mcp__github__issue_write({
      method: "create",
      owner: {{github_owner}},
      repo: {{github_repo}},
      title: "Story {{story_key}}: {{parsed_title}}",
      body: {{issue_body}},
      labels: {{labels}}
    })

    issue_number = created_issue.number

    # CRITICAL: Verify creation succeeded (read back)
    sleep 2 seconds # GitHub eventual consistency

    verification = mcp__github__issue_read({
      method: "get",
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{issue_number}}
    })

    # Verify all fields
    IF verification.title != expected_title:
      THROW "Title mismatch after create"

    IF NOT verification.labels.includes("story:{{story_key}}"):
      THROW "Story label missing after create"

    # Success - record for rollback capability
    output: "  ✅ CREATED and VERIFIED - Issue #{{issue_number}}"

    rollback_manifest.created_issues.push({
      story_key: {{story_key}},
      issue_number: {{issue_number}},
      created_at: {{timestamp}}
    })

    migration_state.issues_created.push({
      story_key: {{story_key}},
      issue_number: {{issue_number}}
    })

    BREAK

  CATCH error:
    attempt++

    # Check if issue was created despite error (orphaned issue)
    check_result = mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:story:{{story_key}}"
    })

    IF check_result.length > 0:
      # Issue was created, verification failed - treat as success
      output: "  ✅ CREATED (verification had transient error)"
      BREAK

    IF attempt < max_attempts:
      sleep {{retry_backoff_ms[attempt]}}
      output: "  ⚠️ Retry {{attempt}}/{{max_retries}}"
    ELSE:
      output: "  ❌ FAILED after {{max_retries}} retries: {{error}}"

      migration_state.issues_failed.push({
        story_key: {{story_key}},
        error: {{error}},
        attempts: {{attempt}}
      })

      IF halt_on_critical_error:
        output: "HALTING - Critical error during migration"
        save migration_state
        HALT
      ELSE:
        output: "Continuing despite failure (continue_on_failure=true)"
        CONTINUE to next story
      </action>
    </check>

    <action>Update migration state:</action>
    <action>migration_state.stories_migrated.push({{story_key}})</action>
    <action>migration_state.last_completed = {{story_key}}</action>

    <check if="save_state_after_each == true">
      <action>Save migration state to {{state_file}}</action>
      <action>Save rollback manifest to {{output_folder}}/migration-rollback-{{timestamp}}.yaml</action>
    </check>

    <check if="current_index % 10 == 0">
      <output>
📊 Progress: {{current_index}}/{{total_stories}} migrated
   Created: {{issues_created.length}}
   Updated: {{issues_updated.length}}
   Failed: {{issues_failed.length}}
      </output>
    </check>
  </substep>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MIGRATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Total:** {{total_stories}} stories processed
**Created:** {{issues_created.length}} new issues
**Updated:** {{issues_updated.length}} existing issues
**Failed:** {{issues_failed.length}} errors
**Duration:** {{actual_duration}}

{{#if issues_failed.length > 0}}
**Failed Stories:**
{{#each issues_failed}}
  - {{story_key}}: {{error}}
{{/each}}

Recommendation: Fix errors and re-run migration (will skip already-migrated stories)
{{/if}}

**Rollback Manifest:** {{rollback_manifest_path}}
(Use this file to delete created issues if needed)

**State File:** {{state_file}}
(Tracks migration progress for resume capability)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Continue to Step 3 (Verify)</action>
</step>

<step n="3" goal="Verify mode - Double-check migration accuracy">
  <check if="mode != 'verify' AND mode != 'execute'">
    <action>Skip to Step 4</action>
  </check>

  <check if="mode == 'execute'">
    <ask>
Migration complete. Run verification to double-check accuracy? (yes/no):
    </ask>

    <check if="response != 'yes'">
      <action>Skip to Step 5 (Report)</action>
    </check>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 VERIFICATION MODE (Double-Checking Migration)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Load migration state from {{state_file}}</action>

  <iterate>For each migrated story in migration_state.stories_migrated:</iterate>

  <action>Fetch issue from GitHub:</action>
  <action>Search: label:story:{{story_key}}</action>

  <check if="issue not found">
    <output>  ❌ VERIFICATION FAILED: {{story_key}} - Issue not found in GitHub</output>
    <action>Add to verification_failures</action>
  </check>

  <check if="issue found">
    <action>Verify fields match expected:</action>
    <action>  - Title contains story_key ✓</action>
    <action>  - Label "story:{{story_key}}" exists ✓</action>
    <action>  - Status label matches sprint-status.yaml ✓</action>
    <action>  - AC count matches local file ✓</action>

    <check if="all fields match">
      <output>  ✅ VERIFIED: {{story_key}} → Issue #{{issue_number}}</output>
    </check>

    <check if="fields mismatch">
      <output>  ⚠️ MISMATCH: {{story_key}} → Issue #{{issue_number}}</output>
      <output>     Expected: {{expected}}</output>
      <output>     Actual: {{actual}}</output>
      <action>Add to verification_warnings</action>
    </check>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 VERIFICATION RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Stories Checked:** {{stories_migrated.length}}
**✅ Verified Correct:** {{verified_count}}
**⚠️ Warnings:** {{verification_warnings.length}}
**❌ Failures:** {{verification_failures.length}}

{{#if verification_failures.length > 0}}
**Verification Failures:**
{{#each verification_failures}}
  - {{this}}
{{/each}}

❌ Migration has errors - issues may be missing or incorrect
{{else}}
✅ All migrated stories verified in GitHub
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="4" goal="Rollback mode - Delete created issues">
  <check if="mode != 'rollback'">
    <action>Skip to Step 5 (Report)</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ ROLLBACK MODE (Delete Migrated Issues)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Load rollback manifest from {{output_folder}}/migration-rollback-*.yaml</action>

  <check if="manifest not found">
    <output>
❌ ERROR: No rollback manifest found

Cannot rollback without manifest file.
Rollback manifests are in: {{output_folder}}/migration-rollback-*.yaml

HALTING
    </output>
    <action>HALT</action>
  </check>

  <output>
**Rollback Manifest:**
- Created: {{manifest.created_at}}
- Repository: {{manifest.github_owner}}/{{manifest.github_repo}}
- Issues to delete: {{manifest.created_issues.length}}

**WARNING:** This will PERMANENTLY DELETE these issues from GitHub:
{{#each manifest.created_issues}}
  - Issue #{{issue_number}}: {{story_key}}
{{/each}}

This operation CANNOT be undone!
  </output>

  <ask>
Type "DELETE ALL ISSUES" to proceed with rollback:
  </ask>

  <check if="confirmation != 'DELETE ALL ISSUES'">
    <output>❌ Rollback cancelled</output>
    <action>HALT</action>
  </check>

  <iterate>For each issue in manifest.created_issues:</iterate>

  <action>Delete issue (GitHub API doesn't support delete, so close + lock):</action>
  <action>
# GitHub doesn't allow issue deletion via API
# Best we can do: close, lock, and add label "migrated:rolled-back"

mcp__github__issue_write({
  method: "update",
  issue_number: {{issue_number}},
  state: "closed",
  labels: ["migrated:rolled-back", "do-not-use"],
  state_reason: "not_planned"
})

# Add comment explaining
mcp__github__add_issue_comment({
  issue_number: {{issue_number}},
  body: "Issue closed - migration was rolled back. Do not use."
})
  </action>

  <output>  ✅ Rolled back: Issue #{{issue_number}}</output>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ROLLBACK COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Issues Rolled Back:** {{manifest.created_issues.length}}

Note: GitHub API doesn't support issue deletion.
Issues were closed with label "migrated:rolled-back" instead.

To fully delete (manual):
1. Go to repository settings
2. Issues → Delete closed issues
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="5" goal="Generate comprehensive migration report">
  <action>Calculate final statistics:</action>
  <action>
final_stats = {
  total_stories: {{total_stories}},
  migrated_successfully: {{issues_created.length + issues_updated.length}},
  failed: {{issues_failed.length}},
  success_rate: ({{migrated_successfully}} / {{total_stories}}) * 100,
  duration: {{end_time - start_time}},
  avg_time_per_story: {{duration / total_stories}}
}
  </action>

  <check if="create_migration_report == true">
    <action>Write comprehensive report to {{report_path}}</action>

    <action>Report structure:</action>
    <action>
# GitHub Migration Report

**Date:** {{timestamp}}
**Repository:** {{github_owner}}/{{github_repo}}
**Mode:** {{mode}}

## Executive Summary

- **Total Stories:** {{total_stories}}
- **✅ Migrated:** {{migrated_successfully}} ({{success_rate}}%)
- **❌ Failed:** {{failed}}
- **Duration:** {{duration}}
- **Avg per story:** {{avg_time_per_story}}

## Created Issues

{{#each issues_created}}
- Story {{story_key}} → Issue #{{issue_number}}
  URL: <https://github.com/{{github_owner}}/{{github_repo}}/issues/{{issue_number}}>
{{/each}}

## Updated Issues

{{#each issues_updated}}
- Story {{story_key}} → Issue #{{issue_number}} (updated)
{{/each}}

## Failed Migrations

{{#if issues_failed.length > 0}}
{{#each issues_failed}}
- Story {{story_key}}: {{error}}
  Attempts: {{attempts}}
{{/each}}

**Recovery Steps:**
1. Fix underlying issues (check error messages)
2. Re-run migration (will skip already-migrated stories)
{{else}}
None - all stories migrated successfully!
{{/if}}

## Rollback Information

**Rollback Manifest:** {{rollback_manifest_path}}

To rollback this migration:
```bash
/migrate-to-github mode=rollback
```

## Next Steps

1. **Verify migration:** /migrate-to-github mode=verify
2. **Test story checkout:** /checkout-story story_key=2-5-auth
3. **Enable GitHub sync:** Update workflow.yaml with github_sync_enabled=true
4. **Product Owner setup:** Share GitHub Issues URL with PO team

## Migration Details

**API Calls Made:** ~{{total_api_calls}}
**Rate Limit Used:** {{api_calls_used}}/5000
**Errors Encountered:** {{error_count}}
**Retries Performed:** {{retry_count}}

---
_Generated by BMAD migrate-to-github workflow_
    </action>

    <output>📄 Migration report: {{report_path}}</output>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MIGRATION WORKFLOW COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Mode:** {{mode}}
**Success Rate:** {{success_rate}}%

{{#if mode == 'execute'}}
**✅ {{migrated_successfully}} stories now in GitHub Issues**

View in GitHub:
<https://github.com/{{github_owner}}/{{github_repo}}/issues?q=is:issue+label:type:story>

**Next Steps:**
1. Verify migration: /migrate-to-github mode=verify
2. Test workflows with GitHub sync enabled
3. Share Issues URL with Product Owner team

{{#if issues_failed.length > 0}}
⚠️ {{issues_failed.length}} stories failed - re-run to retry
{{/if}}
{{/if}}

{{#if mode == 'dry-run'}}
**This was a preview. No issues were created.**

To execute: /migrate-to-github mode=execute
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>
