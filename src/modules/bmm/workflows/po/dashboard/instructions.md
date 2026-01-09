# Dashboard - Sprint Progress Overview

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>PO WORKFLOW: Real-time visibility into sprint progress from GitHub</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SPRINT DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="0a" title="Verify GitHub access">
    <action>Call: mcp__github__get_me()</action>

    <check if="API call fails">
      <output>❌ GitHub MCP not accessible</output>
      <action>HALT</action>
    </check>

    <output>Connected as @{{current_user}}</output>
  </substep>
</step>

<step n="1" goal="Fetch Sprint Data">
  <substep n="1a" title="Fetch all stories by status">
    <action>Fetch backlog stories:</action>
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:story label:status:backlog{{#if epic}} label:epic:{{epic}}{{/if}}"
    })</action>
    <action>backlog_stories = response.items</action>

    <action>Fetch ready-for-dev stories:</action>
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:story label:status:ready-for-dev{{#if epic}} label:epic:{{epic}}{{/if}}"
    })</action>
    <action>ready_stories = response.items</action>

    <action>Fetch in-progress stories:</action>
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:story label:status:in-progress{{#if epic}} label:epic:{{epic}}{{/if}}"
    })</action>
    <action>in_progress_stories = response.items</action>

    <action>Fetch in-review stories:</action>
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:story label:status:in-review{{#if epic}} label:epic:{{epic}}{{/if}}"
    })</action>
    <action>review_stories = response.items</action>

    <action>Fetch done stories:</action>
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:story label:status:done{{#if epic}} label:epic:{{epic}}{{/if}}"
    })</action>
    <action>done_stories = response.items</action>
  </substep>

  <substep n="1b" title="Calculate metrics">
    <action>total_stories = all stories count</action>
    <action>completed_count = done_stories.length</action>
    <action>completion_pct = (completed_count / total_stories) * 100</action>
    <action>active_developers = unique assignees from in_progress_stories</action>
    <action>blocked_count = count stories with label:blocked</action>
  </substep>

  <substep n="1c" title="Extract progress from comments">
    <action>For each in_progress story:</action>
    <action>  - Get latest comment matching "Task X/Y complete"</action>
    <action>  - Extract progress percentage</action>
  </substep>
</step>

<step n="2" goal="Display Dashboard">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SPRINT DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{#if epic}}Filtered: Epic {{epic}}{{else}}All Epics{{/if}}
Generated: {{timestamp}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📈 Sprint Progress

**Overall:** {{completion_pct}}% complete ({{completed_count}}/{{total_stories}} stories)

```
[{{progress_bar}}] {{completion_pct}}%
```

**By Status:**
- 📋 Backlog: {{backlog_stories.length}}
- ✅ Ready: {{ready_stories.length}}
- 🔧 In Progress: {{in_progress_stories.length}}
- 👀 In Review: {{review_stories.length}}
- ✓ Done: {{done_stories.length}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🔧 Active Work

{{#each in_progress_stories}}
**@{{assignee.login}}** - {{story_key}}
   "{{title}}"
   Progress: {{progress_pct}}% ({{progress_tasks}})
   Issue: #{{number}}
   Started: {{time_since(updated_at)}} ago

{{else}}
No stories currently in progress.
{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 👀 Awaiting Review

{{#each review_stories}}
- {{story_key}}: "{{title}}"
  Developer: @{{assignee.login}}
  Issue: #{{number}}
  {{#if has_pr}}PR: #{{pr_number}}{{/if}}

{{else}}
No stories awaiting review.
{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✅ Ready for Development

{{#each ready_stories}}
- {{story_key}}: "{{title}}"
  Complexity: {{complexity_label}}
  Issue: #{{number}}
  Checkout: `/checkout-story story_key={{story_key}}`

{{else}}
No stories ready for development.
{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 👥 Developer Activity

{{#each active_developers}}
**@{{login}}** - {{story_count}} {{#if story_count == 1}}story{{else}}stories{{/if}}
{{#each their_stories}}
  - {{story_key}} ({{progress_pct}}%)
{{/each}}

{{else}}
No active developers.
{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#if blocked_count > 0}}
## ⚠️ Blockers

{{#each blocked_stories}}
- {{story_key}}: {{title}}
  Blocker: {{blocker_description}}
  Assigned: @{{assignee.login}}

{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{/if}}

## 📊 Velocity (Last 7 Days)

- Stories Completed: {{weekly_completed}}
- Avg Time to Complete: {{avg_completion_time}}
- Projected Sprint End: {{projected_completion}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Quick Actions:**
- View in GitHub: `https://github.com/{{github_owner}}/{{github_repo}}/issues?q=is:issue+label:type:story`
- Create story: /new-story
- Approve story: /approve-story story_key=X-Y-slug
- Check locks: /lock-status

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>
