# Checkout Story - Lock Story for Development

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>TEAM COORDINATION: This workflow prevents duplicate work by locking stories</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <critical>Verify prerequisites before attempting lock acquisition</critical>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 STORY CHECKOUT - Lock Acquisition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="0a" title="Validate story_key parameter">
    <check if="story_key is empty or not provided">
      <output>
❌ ERROR: story_key parameter required

Usage:
  /checkout-story story_key=2-5-auth

Available stories:
  Run /available-stories to see unlocked stories

HALTING
      </output>
      <action>HALT</action>
    </check>

    <action>Validate story_key format: {{story_key}}</action>
    <action>Expected format: {epic_number}-{story_number}-{slug}</action>
    <action>Example: 2-5-auth, 3-1-user-profile</action>

    <check if="format invalid">
      <output>
⚠️ WARNING: story_key format may be non-standard

Expected: {epic}-{story}-{slug} (e.g., "2-5-auth")
Received: {{story_key}}

Proceeding anyway - will search GitHub for matching story...
      </output>
    </check>

    <output>📦 Story: {{story_key}}</output>
  </substep>

  <substep n="0b" title="Verify GitHub MCP access">
    <action>Test GitHub MCP connection:</action>
    <action>Call: mcp__github__get_me()</action>

    <check if="API call fails">
      <output>
❌ CRITICAL: GitHub MCP not accessible

Cannot checkout story without GitHub API access.
Story locking requires GitHub Issue assignment.

Fix:
1. Ensure GitHub MCP is configured
2. Verify authentication token is valid
3. Check network connectivity

HALTING
      </output>
      <action>HALT</action>
    </check>

    <action>Extract current user: {{current_user}} = response.login</action>
    <output>✅ GitHub connected as @{{current_user}}</output>
  </substep>

  <substep n="0c" title="Check user's current locks">
    <action>Count user's currently locked stories</action>
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} assignee:{{current_user}} label:status:in-progress label:type:story"
    })</action>

    <action>current_lock_count = response.total_count or response.items.length</action>

    <check if="current_lock_count >= max_locks_per_user">
      <output>
⚠️ WARNING: Maximum locks reached

You have {{current_lock_count}}/{{max_locks_per_user}} stories locked:
{{#each current_locks}}
- {{story_key}}: {{title}}
{{/each}}

Either:
1. Complete a story: /dev-story story_file={{first_lock}}
2. Unlock a story: /unlock-story story_key={{first_lock_key}}

HALTING (max_locks_per_user={{max_locks_per_user}})
      </output>
      <action>HALT</action>
    </check>

    <output>📊 Current locks: {{current_lock_count}}/{{max_locks_per_user}}</output>
  </substep>
</step>

<step n="1" goal="Check Story Availability">
  <critical>Verify story exists and is not locked by another developer</critical>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Checking Story Availability
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="1a" title="Search for story in GitHub">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:story:{{story_key}}"
    })</action>

    <check if="no results found">
      <output>
❌ ERROR: Story not found in GitHub

Story "{{story_key}}" does not exist in GitHub Issues.

Options:
1. Check story key spelling
2. Run /available-stories to see available stories
3. If story exists locally but not in GitHub:
   Run /migrate-to-github to sync stories

HALTING
      </output>
      <action>HALT</action>
    </check>

    <action>issue = response.items[0]</action>
    <action>issue_number = issue.number</action>
    <action>issue_title = issue.title</action>
    <action>current_assignee = issue.assignee?.login or null</action>

    <output>
📋 Found: Issue #{{issue_number}}
   Title: {{issue_title}}
   Status: {{extract_status_label(issue.labels)}}
   Assignee: {{current_assignee or "None (available)"}}
    </output>
  </substep>

  <substep n="1b" title="Check if already locked">
    <check if="current_assignee exists AND current_assignee != current_user">
      <output>
❌ STORY LOCKED

🔒 Story {{story_key}} is locked by @{{current_assignee}}

Issue: #{{issue_number}}
Locked since: {{issue.updated_at}}

Options:
1. Choose different story: /available-stories
2. Contact @{{current_assignee}} to coordinate
3. Ask Scrum Master to force-unlock if developer is unavailable:
   /unlock-story story_key={{story_key}} --force

HALTING - Cannot checkout locked story
      </output>
      <action>HALT</action>
    </check>

    <check if="current_assignee == current_user">
      <output>
✅ Story already locked by you

You already have this story checked out.
Lock will be refreshed.

Issue: #{{issue_number}}
      </output>
      <action>Set refresh_mode = true</action>
    </check>

    <check if="current_assignee is null">
      <output>✅ Story is available for checkout</output>
      <action>Set refresh_mode = false</action>
    </check>
  </substep>
</step>

<step n="2" goal="Acquire Lock (Atomic Operation)">
  <critical>Acquire lock with retry logic and verification</critical>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 Acquiring Lock
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="2a" title="Create local lock file">
    <action>Ensure lock directory exists: {{lock_dir}}</action>
    <action>Create lock file: {{lock_dir}}/{{story_key}}.lock</action>

    <action>Lock file content:
```yaml
story_key: {{story_key}}
github_issue: {{issue_number}}
locked_by: {{current_user}}
locked_at: {{current_timestamp}}
timeout_at: {{current_timestamp + 8 hours}}
last_heartbeat: {{current_timestamp}}
epic_number: {{extract_epic_from_story_key(story_key)}}
```
    </action>

    <output>✅ Local lock file created</output>
  </substep>

  <substep n="2b" title="Assign GitHub Issue (with retry)">
    <action>ATOMIC ASSIGNMENT with verification:</action>

    <action>
attempt = 0
max_attempts = 4  # 1 initial + 3 retries
backoffs = [1000, 3000, 9000]  # ms

WHILE attempt < max_attempts:
  TRY:
    # 1. Assign issue to current user
    Call: mcp__github__issue_write({
      method: "update",
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{issue_number}},
      assignees: ["{{current_user}}"]
    })

    # 2. Update status label
    Call: mcp__github__issue_write({
      method: "update",
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{issue_number}},
      labels: [update: remove "status:backlog", "status:ready-for-dev"; add "status:in-progress"]
    })

    # 3. Add lock comment
    Call: mcp__github__add_issue_comment({
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{issue_number}},
      body: "🔒 **Story locked by @{{current_user}}**\n\n" +
            "Lock acquired at: {{current_timestamp}}\n" +
            "Lock expires: {{timeout_at}}\n\n" +
            "_This lock prevents duplicate work. Lock will auto-expire after 8 hours._"
    })

    # 4. Verify assignment (CRITICAL - read back)
    sleep 1 second  # GitHub eventual consistency

    verification = Call: mcp__github__issue_read({
      method: "get",
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{issue_number}}
    })

    # Check verification
    IF verification.assignees does not include {{current_user}}:
      THROW "Assignment verification failed - issue not assigned"

    IF verification.labels does not include "status:in-progress":
      THROW "Label verification failed - status not updated"

    # SUCCESS!
    output: "✅ GitHub Issue assigned and verified"
    BREAK

  CATCH error:
    attempt++
    IF attempt < max_attempts:
      sleep backoffs[attempt - 1]
      output: "⚠️ Retry {{attempt}}/3 after error: {{error}}"
    ELSE:
      # ROLLBACK: Remove local lock file
      delete {{lock_dir}}/{{story_key}}.lock

      output: "❌ FAILED to acquire lock after 3 retries"
      output: "Error: {{error}}"
      output: ""
      output: "Local lock file removed (rollback)"
      output: ""
      output: "Possible causes:"
      output: "- Network connectivity issues"
      output: "- GitHub API rate limiting"
      output: "- Race condition (another dev assigned first)"
      output: ""
      output: "Try again in a few minutes or check /available-stories"
      HALT
    </action>
  </substep>

  <substep n="2c" title="Update cache metadata">
    <action>Update cache meta with lock info:</action>
    <action>
cache_meta = load {{cache_dir}}/.bmad-cache-meta.json

cache_meta.stories[{{story_key}}] = {
  github_issue: {{issue_number}},
  locked_by: "{{current_user}}",
  locked_until: "{{timeout_at}}",
  locked_at: "{{current_timestamp}}"
}

save cache_meta
    </action>

    <output>✅ Cache metadata updated</output>
  </substep>
</step>

<step n="3" goal="Pre-fetch Epic Context">
  <check if="epic_prefetch == false">
    <action>Skip to Step 4</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Pre-fetching Epic Context
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="3a" title="Extract epic number">
    <action>epic_number = extract first segment from story_key</action>
    <action>Example: "2-5-auth" → epic_number = 2</action>

    <output>📁 Epic {{epic_number}}</output>
  </substep>

  <substep n="3b" title="Fetch all stories in epic">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:epic:{{epic_number}} label:type:story"
    })</action>

    <action>epic_stories = response.items</action>
    <output>Found {{epic_stories.length}} stories in Epic {{epic_number}}</output>
  </substep>

  <substep n="3c" title="Cache all epic stories">
    <action>For each story in epic_stories:</action>
    <action>  - Extract story_key from labels</action>
    <action>  - Convert issue body to story content</action>
    <action>  - Write to cache: {{cache_dir}}/stories/{story_key}.md</action>
    <action>  - Update cache metadata</action>

    <output>
📥 Cached {{epic_stories.length}} stories:
{{#each epic_stories}}
  - {{story_key}}: {{title}}
{{/each}}

These stories are now available via Read tool for fast LLM access.
    </output>
  </substep>
</step>

<step n="4" goal="Checkout Complete">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CHECKOUT COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Story:** {{story_key}}
**Issue:** #{{issue_number}}
**Locked by:** @{{current_user}}
**Lock expires:** {{timeout_at}} (8 hours)

**Cached Story File:**
{{cache_dir}}/stories/{{story_key}}.md

{{#if epic_prefetch}}
**Epic Context:**
{{epic_stories.length}} related stories cached for context
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps:**
1. Start development:
   /dev-story story_file={{cache_dir}}/stories/{{story_key}}.md

2. Or use batch pipeline:
   /super-dev-pipeline story_key={{story_key}}

**Lock Management:**
- Lock auto-refreshes during implementation
- Lock auto-expires after 8 hours of inactivity
- Manual unlock: /unlock-story story_key={{story_key}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>
