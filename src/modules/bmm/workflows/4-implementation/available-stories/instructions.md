# Available Stories - Find Unlocked Work

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 AVAILABLE STORIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="0a" title="Verify GitHub MCP access">
    <action>Call: mcp__github__get_me()</action>

    <check if="API call fails">
      <output>
❌ CRITICAL: GitHub MCP not accessible

Cannot list stories without GitHub API access.

HALTING
      </output>
      <action>HALT</action>
    </check>

    <action>current_user = response.login</action>
    <output>Connected as @{{current_user}}</output>
  </substep>
</step>

<step n="1" goal="Fetch Available Stories">
  <substep n="1a" title="Search for unlocked stories">
    <action>Build search query:</action>
    <action>
query = "repo:{{github_owner}}/{{github_repo}} label:type:story no:assignee"

# Add status filter
IF status is provided:
  query += " label:status:{{status}}"
ELSE:
  query += " (label:status:ready-for-dev OR label:status:backlog)"

# Add epic filter
IF epic is provided:
  query += " label:epic:{{epic}}"

# Sort by most recently updated
query += " sort:updated-desc"
    </action>

    <action>Call: mcp__github__search_issues({ query: query })</action>

    <action>available_stories = response.items</action>
  </substep>

  <substep n="1b" title="Fetch locked stories (if show_locked)">
    <check if="show_locked == true">
      <action>Build locked query:</action>
      <action>
locked_query = "repo:{{github_owner}}/{{github_repo}} label:type:story -no:assignee"

IF epic is provided:
  locked_query += " label:epic:{{epic}}"
      </action>

      <action>Call: mcp__github__search_issues({ query: locked_query })</action>
      <action>locked_stories = response.items</action>
    </check>
  </substep>
</step>

<step n="2" goal="Display Results">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 AVAILABLE STORIES (Unlocked)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{#if epic}}Filter: Epic {{epic}}{{/if}}
{{#if status}}Filter: Status {{status}}{{/if}}

  </output>

  <check if="available_stories.length == 0">
    <output>
No unlocked stories found.

{{#if epic}}
All stories in Epic {{epic}} are either:
- Already locked by a developer
- Completed (status:done)
- Not yet created

Try:
- /available-stories (no filter)
- /lock-status epic={{epic}} (see who has what)
{{else}}
All stories are currently locked or completed.

Try:
- /lock-status (see who's working on what)
{{/if}}
    </output>
  </check>

  <check if="available_stories.length > 0">
    <action>Group stories by epic:</action>

    <output>
{{#each available_stories_by_epic}}
**Epic {{epic_number}}**
{{#each stories}}
  {{@index + 1}}. {{story_key}}
     Title: {{title}}
     Status: {{status_label}}
     Complexity: {{complexity_label}}
     Issue: #{{issue_number}}
     Checkout: /checkout-story story_key={{story_key}}

{{/each}}
{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Total Available:** {{available_stories.length}} stories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
  </check>

  <check if="show_locked == true AND locked_stories.length > 0">
    <output>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 LOCKED STORIES (Not Available)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each locked_stories}}
  ~~{{story_key}}~~ - Locked by @{{assignee}}
     Title: {{title}}
     Issue: #{{issue_number}}
     Since: {{updated_at}}

{{/each}}

**Total Locked:** {{locked_stories.length}} stories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
  </check>

  <output>

**Quick Actions:**
- Checkout a story: /checkout-story story_key=X-Y-slug
- Filter by epic: /available-stories epic=2
- See all locks: /lock-status
- See your locks: /lock-status user={{current_user}}

  </output>
</step>

</workflow>
