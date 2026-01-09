# Update Story - Modify Story in GitHub

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>PO WORKFLOW: Updates notify developers if story is in progress</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ UPDATE STORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <check if="story_key is empty">
    <output>
❌ ERROR: story_key parameter required

Usage:
  /update-story story_key=2-5-auth

HALTING
    </output>
    <action>HALT</action>
  </check>

  <action>Call: mcp__github__get_me()</action>
  <action>current_user = response.login</action>
</step>

<step n="1" goal="Fetch Current Story">
  <action>Call: mcp__github__search_issues({
    query: "repo:{{github_owner}}/{{github_repo}} label:story:{{story_key}}"
  })</action>

  <check if="no results">
    <output>❌ Story {{story_key}} not found in GitHub</output>
    <action>HALT</action>
  </check>

  <action>issue = response.items[0]</action>
  <action>is_locked = issue.assignee != null</action>

  <output>
📋 Current Story: {{story_key}}

**Title:** {{issue.title}}
**Status:** {{extract_status(issue.labels)}}
**Assignee:** {{issue.assignee?.login or "None"}}
**Issue:** #{{issue.number}}

---
**Current Body:**
{{issue.body}}
---
  </output>

  <check if="is_locked">
    <output>
⚠️ WARNING: Story is currently locked by @{{issue.assignee.login}}

Changes will be synced and developer notified.
Consider discussing significant changes before updating.
    </output>
  </check>
</step>

<step n="2" goal="Collect Updates">
  <ask>
**What would you like to update?**

[1] Acceptance Criteria - Add, modify, or remove ACs
[2] Title - Change story title
[3] Business Context - Update background/requirements
[4] Status - Change status label
[5] Priority/Complexity - Update sizing
[6] Custom - Make any other changes

Enter choice [1-6]:
  </ask>

  <check if="choice == 1">
    <output>Current ACs:</output>
    <action>Display current acceptance criteria from issue body</action>

    <ask>
How would you like to modify ACs?

[A] Add new AC
[M] Modify existing AC (specify number)
[R] Remove AC (specify number)
[W] Rewrite all ACs

Choice:
    </ask>

    <action>Collect AC changes based on choice</action>
  </check>

  <check if="choice == 2">
    <ask>New title:</ask>
    <action>Store new_title</action>
  </check>

  <check if="choice == 3">
    <ask>Updated business context:</ask>
    <action>Store new_context</action>
  </check>

  <check if="choice == 4">
    <ask>
New status:

[1] backlog
[2] ready-for-dev
[3] in-progress (not recommended - use /checkout-story)
[4] in-review
[5] done (not recommended - use /approve-story)

Choice:
    </ask>
    <action>Store new_status</action>
  </check>

  <check if="choice == 5">
    <ask>
New complexity:

[1] micro
[2] small
[3] medium
[4] large

Choice:
    </ask>
    <action>Store new_complexity</action>
  </check>

  <check if="choice == 6">
    <ask>Describe the changes you want to make:</ask>
    <action>Parse and apply custom changes</action>
  </check>
</step>

<step n="3" goal="Apply Updates">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Applying Updates
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="3a" title="Update GitHub Issue">
    <action>Build updated issue data based on changes</action>

    <action>Call: mcp__github__issue_write({
      method: "update",
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{issue.number}},
      title: {{new_title or issue.title}},
      body: {{updated_body}},
      labels: {{updated_labels}}
    })</action>

    <output>✅ Issue #{{issue.number}} updated</output>
  </substep>

  <substep n="3b" title="Notify developer if locked">
    <check if="is_locked">
      <action>Call: mcp__github__add_issue_comment({
        owner: {{github_owner}},
        repo: {{github_repo}},
        issue_number: {{issue.number}},
        body: "📢 **Story Updated by PO @{{current_user}}**\n\n" +
              "**Changes:**\n{{change_summary}}\n\n" +
              "@{{issue.assignee.login}} - Please review these updates.\n\n" +
              "_Updated at {{timestamp}}_"
      })</action>

      <output>📧 Developer @{{issue.assignee.login}} notified of changes</output>
    </check>
  </substep>

  <substep n="3c" title="Update local cache">
    <action>Invalidate cache for {{story_key}}</action>
    <action>Re-sync story to cache</action>
    <output>✅ Local cache updated</output>
  </substep>
</step>

<step n="4" goal="Completion">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STORY UPDATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Story:** {{story_key}}
**Issue:** #{{issue.number}}

**Changes Applied:**
{{change_summary}}

{{#if is_locked}}
**Developer Notified:** @{{issue.assignee.login}}
{{/if}}

**View:** `https://github.com/{{github_owner}}/{{github_repo}}/issues/{{issue.number}}`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>
