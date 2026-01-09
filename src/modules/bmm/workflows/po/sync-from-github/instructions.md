# Sync from GitHub - Update Local Cache

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 SYNC FROM GITHUB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Call: mcp__github__get_me()</action>

  <check if="API call fails">
    <output>❌ GitHub MCP not accessible</output>
    <action>HALT</action>
  </check>

  <action>Load cache metadata from {{cache_dir}}/.bmad-cache-meta.json</action>
  <action>last_sync = cache_meta.last_sync</action>

  <output>
Last sync: {{last_sync or "Never"}}
Mode: {{#if full_sync}}Full sync{{else}}Incremental{{/if}}
{{#if epic}}Filter: Epic {{epic}}{{/if}}
  </output>
</step>

<step n="1" goal="Fetch Changes">
  <check if="full_sync == true">
    <output>🔄 Performing full sync...</output>
    <action>Query all stories</action>
  </check>

  <check if="full_sync != true AND last_sync exists">
    <output>🔄 Fetching stories updated since {{last_sync}}...</output>
    <action>Query stories updated since last_sync</action>
  </check>

  <check if="full_sync != true AND last_sync is null">
    <output>🔄 No previous sync - performing initial full sync...</output>
    <action>Query all stories (first time sync)</action>
  </check>

  <substep n="1a" title="Search for updated stories">
    <action>Build query:</action>
    <action>
query = "repo:{{github_owner}}/{{github_repo}} label:type:story"

IF last_sync AND NOT full_sync:
  query += " updated:>={{last_sync_date}}"

IF epic:
  query += " label:epic:{{epic}}"
    </action>

    <action>Call: mcp__github__search_issues({ query: query })</action>
    <action>updated_stories = response.items</action>

    <output>Found {{updated_stories.length}} stories to sync</output>
  </substep>
</step>

<step n="2" goal="Sync Stories to Cache">
  <check if="updated_stories.length == 0">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Cache is up to date

No changes since last sync ({{last_sync}})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
    <action>Update last_sync timestamp</action>
    <action>Exit</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 Syncing Stories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>For each story in updated_stories:</action>

  <substep n="2a" title="Process each story">
    <action>
for issue in updated_stories:
  story_key = extract_story_key(issue)

  IF NOT story_key:
    output: "⚠️ Skipping issue #{{issue.number}} - no story key"
    CONTINUE

  # Convert issue to story content
  story_content = convert_issue_to_story(issue)

  # Write to cache
  cache_path = {{cache_dir}}/stories/{{story_key}}.md
  write_file(cache_path, story_content)

  # Update metadata
  cache_meta.stories[story_key] = {
    github_issue: issue.number,
    github_updated_at: issue.updated_at,
    cache_timestamp: now(),
    locked_by: issue.assignee?.login,
    locked_until: calculate_lock_expiry() if issue.assignee
  }

  output: "✅ {{story_key}} synced (Issue #{{issue.number}})"
    </action>
  </substep>

  <substep n="2b" title="Update sync metadata">
    <action>cache_meta.last_sync = now()</action>
    <action>Save cache_meta to {{cache_dir}}/.bmad-cache-meta.json</action>
  </substep>
</step>

<step n="3" goal="Sync Complete">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SYNC COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Stories Synced:** {{updated_stories.length}}
**Cache Location:** {{cache_dir}}/stories/
**Last Sync:** {{now}}

**Synced Stories:**
{{#each updated_stories}}
- {{story_key}}: {{title}} (Issue #{{number}})
{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps:**
- View dashboard: /dashboard
- Available stories: /available-stories
- Create story: /new-story

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>
