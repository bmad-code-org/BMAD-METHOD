# Lock Status - View Story Assignments

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 LOCK STATUS - Team Story Assignments
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="0a" title="Verify GitHub MCP access">
    <action>Call: mcp__github__get_me()</action>

    <check if="API call fails">
      <output>
❌ CRITICAL: GitHub MCP not accessible

HALTING
      </output>
      <action>HALT</action>
    </check>

    <action>current_user = response.login</action>
    <output>Connected as @{{current_user}}</output>
  </substep>
</step>

<step n="1" goal="Fetch All Locked Stories">
  <substep n="1a" title="Search for assigned stories">
    <action>Build search query:</action>
    <action>
query = "repo:{{github_owner}}/{{github_repo}} label:type:story -no:assignee label:status:in-progress"

IF user is provided:
  query += " assignee:{{user}}"

IF epic is provided:
  query += " label:epic:{{epic}}"

query += " sort:updated-desc"
    </action>

    <action>Call: mcp__github__search_issues({ query: query })</action>
    <action>locked_stories = response.items</action>
  </substep>

  <substep n="1b" title="Analyze lock freshness">
    <action>For each locked story:</action>
    <action>
for story in locked_stories:
  updated_at = parse(story.updated_at)
  age_minutes = (now - updated_at) / 60000

  story.age_minutes = age_minutes
  story.age_display = format_duration(age_minutes)
  story.is_stale = age_minutes > stale_threshold_minutes

  # Extract story key from labels
  story_label = story.labels.find(l => l.name.startsWith("story:"))
  story.story_key = story_label?.name.replace("story:", "") or "unknown"

  # Extract epic
  epic_label = story.labels.find(l => l.name.startsWith("epic:"))
  story.epic = epic_label?.name.replace("epic:", "") or "?"
    </action>
  </substep>

  <substep n="1c" title="Group by developer">
    <action>Group stories by assignee:</action>
    <action>
locks_by_user = {}
stale_locks = []

for story in locked_stories:
  assignee = story.assignee.login

  if not locks_by_user[assignee]:
    locks_by_user[assignee] = []

  locks_by_user[assignee].push(story)

  if story.is_stale:
    stale_locks.push(story)
    </action>
  </substep>
</step>

<step n="2" goal="Display Lock Status">
  <check if="locked_stories.length == 0">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ℹ️ No Active Locks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No stories are currently locked.
All stories are available for checkout.

Find work: /available-stories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
    <action>Exit</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 ACTIVE LOCKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{#if user}}Filtered by: @{{user}}{{/if}}
{{#if epic}}Filtered by: Epic {{epic}}{{/if}}

  </output>

  <action>Display locks grouped by user:</action>

  <output>
{{#each locks_by_user}}
**@{{@key}}** ({{this.length}} {{#if this.length == 1}}story{{else}}stories{{/if}})
{{#each this}}
  {{#if is_stale}}⚠️{{else}}🔒{{/if}} {{story_key}} - Epic {{epic}}
     "{{title}}"
     Issue: #{{number}}
     Locked: {{age_display}} ago
     {{#if is_stale}}
     ⚠️ STALE (no activity for >{{stale_threshold_minutes}} min)
     {{/if}}

{{/each}}
{{/each}}
  </output>

  <check if="stale_locks.length > 0 AND show_stale == true">
    <output>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ STALE LOCKS (No Activity >{{stale_threshold_minutes}} min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each stale_locks}}
- {{story_key}} locked by @{{assignee.login}}
  Last activity: {{age_display}} ago
  Issue: #{{number}}

  Force unlock (SM only):
  /unlock-story story_key={{story_key}} --force reason="Stale lock"

{{/each}}

Scrum Masters can force-unlock stale stories to prevent blocking.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
  </check>

  <output>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Total Locked:** {{locked_stories.length}} stories
**Developers Active:** {{Object.keys(locks_by_user).length}}
**Stale Locks:** {{stale_locks.length}}

**Your Locks:**
{{#each locks_by_user[current_user]}}
- {{story_key}}: {{title}}
{{else}}
None
{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Actions:**
- See available stories: /available-stories
- Checkout a story: /checkout-story story_key=X-Y-slug
- Unlock your story: /unlock-story story_key=X-Y-slug

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>
