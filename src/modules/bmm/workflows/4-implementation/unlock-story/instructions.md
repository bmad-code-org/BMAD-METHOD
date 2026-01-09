# Unlock Story - Release Story Lock

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>TEAM COORDINATION: Releasing locks makes stories available for others</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔓 STORY UNLOCK - Release Lock
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="0a" title="Validate story_key parameter">
    <check if="story_key is empty">
      <output>
❌ ERROR: story_key parameter required

Usage:
  /unlock-story story_key=2-5-auth
  /unlock-story story_key=2-5-auth reason="Blocked on design"
  /unlock-story story_key=2-5-auth --force reason="Developer unavailable"

HALTING
      </output>
      <action>HALT</action>
    </check>

    <output>📦 Story: {{story_key}}</output>
  </substep>

  <substep n="0b" title="Verify GitHub MCP access">
    <action>Call: mcp__github__get_me()</action>

    <check if="API call fails">
      <output>
❌ CRITICAL: GitHub MCP not accessible

Cannot unlock story without GitHub API access.

HALTING
      </output>
      <action>HALT</action>
    </check>

    <action>current_user = response.login</action>
    <output>✅ GitHub connected as @{{current_user}}</output>
  </substep>
</step>

<step n="1" goal="Verify Story Lock Status">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Checking Lock Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="1a" title="Find story in GitHub">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:story:{{story_key}}"
    })</action>

    <check if="no results found">
      <output>
❌ ERROR: Story not found in GitHub

Story "{{story_key}}" does not exist.

HALTING
      </output>
      <action>HALT</action>
    </check>

    <action>issue = response.items[0]</action>
    <action>issue_number = issue.number</action>
    <action>current_assignee = issue.assignee?.login or null</action>
  </substep>

  <substep n="1b" title="Check lock ownership">
    <check if="current_assignee is null">
      <output>
ℹ️ Story is not locked

Story {{story_key}} has no assignee.
Nothing to unlock.

Issue: #{{issue_number}}
      </output>
      <action>Exit (already unlocked)</action>
    </check>

    <check if="current_assignee != current_user AND force != true">
      <output>
❌ PERMISSION DENIED

Story {{story_key}} is locked by @{{current_assignee}}

You can only unlock stories you have checked out.

Options:
1. Ask @{{current_assignee}} to unlock it
2. If you are a Scrum Master, use --force:
   /unlock-story story_key={{story_key}} --force reason="Developer unavailable"

HALTING
      </output>
      <action>HALT</action>
    </check>

    <check if="current_assignee != current_user AND force == true">
      <action>Verify current_user is in scrum_masters list</action>

      <check if="current_user not in scrum_masters">
        <output>
❌ PERMISSION DENIED

--force requires Scrum Master permissions.

Current Scrum Masters:
{{#each scrum_masters}}
- @{{this}}
{{/each}}

Your user: @{{current_user}}

HALTING
        </output>
        <action>HALT</action>
      </check>

      <output>
⚠️ FORCE UNLOCK

Scrum Master @{{current_user}} is unlocking story owned by @{{current_assignee}}

{{#if reason}}
Reason: {{reason}}
{{else}}
WARNING: No reason provided. Consider adding:
  /unlock-story story_key={{story_key}} --force reason="..."
{{/if}}
      </output>

      <action>Set force_unlock = true</action>
      <action>Set notify_owner = true</action>
    </check>

    <check if="current_assignee == current_user">
      <output>✅ You own this lock - proceeding with unlock</output>
      <action>Set force_unlock = false</action>
    </check>
  </substep>
</step>

<step n="2" goal="Release Lock">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 Releasing Lock
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="2a" title="Remove GitHub assignment">
    <action>ATOMIC UNLOCK with retry:</action>

    <action>
attempt = 0
max_attempts = 4

WHILE attempt < max_attempts:
  TRY:
    # 1. Remove assignee
    Call: mcp__github__issue_write({
      method: "update",
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{issue_number}},
      assignees: []
    })

    # 2. Update status label back to ready-for-dev
    # Get current labels first
    current_labels = issue.labels.map(l => l.name)

    # Remove in-progress, add ready-for-dev
    new_labels = current_labels
      .filter(l => l != "status:in-progress")

    # Only add ready-for-dev if story wasn't completed
    IF NOT current_labels.includes("status:done"):
      new_labels.push("status:ready-for-dev")

    Call: mcp__github__issue_write({
      method: "update",
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{issue_number}},
      labels: new_labels
    })

    # 3. Add unlock comment
    comment_body = "🔓 **Story unlocked**\n\n"

    IF force_unlock:
      comment_body += "Unlocked by Scrum Master @{{current_user}}\n"
      comment_body += "Previous owner: @{{current_assignee}}\n"
      IF reason:
        comment_body += "Reason: {{reason}}\n"
    ELSE:
      comment_body += "Released by @{{current_user}}\n"
      IF reason:
        comment_body += "Reason: {{reason}}\n"

    comment_body += "\n_Story is now available for checkout._"

    Call: mcp__github__add_issue_comment({
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{issue_number}},
      body: comment_body
    })

    # 4. Verify unlock
    sleep 1 second

    verification = Call: mcp__github__issue_read({
      method: "get",
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{issue_number}}
    })

    IF verification.assignees.length > 0:
      THROW "Unlock verification failed - still has assignees"

    output: "✅ GitHub Issue unassigned and verified"
    BREAK

  CATCH error:
    attempt++
    IF attempt < max_attempts:
      backoff = [1000, 3000, 9000][attempt - 1]
      sleep backoff ms
      output: "⚠️ Retry {{attempt}}/3: {{error}}"
    ELSE:
      output: "❌ FAILED to unlock after 3 retries: {{error}}"
      output: ""
      output: "The lock may still be active in GitHub."
      output: "Try again or manually unassign in GitHub UI."
      HALT
    </action>
  </substep>

  <substep n="2b" title="Remove local lock file">
    <action>lock_file = {{lock_dir}}/{{story_key}}.lock</action>

    <check if="lock_file exists">
      <action>Delete lock_file</action>
      <output>✅ Local lock file removed</output>
    </check>

    <check if="lock_file does not exist">
      <output>ℹ️ No local lock file found (already removed or on different machine)</output>
    </check>
  </substep>

  <substep n="2c" title="Update cache metadata">
    <action>Update cache meta to clear lock:</action>
    <action>
cache_meta = load {{cache_dir}}/.bmad-cache-meta.json

IF cache_meta.stories[{{story_key}}]:
  cache_meta.stories[{{story_key}}].locked_by = null
  cache_meta.stories[{{story_key}}].locked_until = null

save cache_meta
    </action>

    <output>✅ Cache metadata updated</output>
  </substep>

  <substep n="2d" title="Notify previous owner (if force unlock)">
    <check if="notify_owner == true">
      <output>
📧 Notification sent to @{{current_assignee}}:

"Your lock on story {{story_key}} has been released by Scrum Master @{{current_user}}.
{{#if reason}}Reason: {{reason}}{{/if}}

The story is now available for other developers.
If you were working on this, please coordinate with your team."
      </output>
    </check>
  </substep>
</step>

<step n="3" goal="Unlock Complete">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ UNLOCK COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Story:** {{story_key}}
**Issue:** #{{issue_number}}
**Previous Owner:** @{{current_assignee}}
**Status:** Available for checkout

{{#if reason}}
**Reason:** {{reason}}
{{/if}}

{{#if force_unlock}}
**Force Unlock:** Yes (by Scrum Master @{{current_user}})
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Story is now available.**

Other developers can checkout with:
  /checkout-story story_key={{story_key}}

View available stories:
  /available-stories

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>
