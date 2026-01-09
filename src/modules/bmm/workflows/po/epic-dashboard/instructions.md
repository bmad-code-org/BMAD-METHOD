# Epic Dashboard - Enterprise Progress Visibility

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 EPIC DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Call: mcp__github__get_me()</action>

  <check if="API call fails">
    <output>❌ GitHub MCP not accessible - cannot fetch epic data</output>
    <action>HALT</action>
  </check>
</step>

<step n="1" goal="Fetch All Epics">
  <check if="epic_key is empty">
    <action>Query all epics:</action>
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:epic is:open"
    })</action>
  </check>

  <check if="epic_key is not empty">
    <action>Query specific epic:</action>
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:epic:{{epic_key}}"
    })</action>
  </check>

  <action>epics = response.items</action>

  <check if="epics.length == 0">
    <output>
No epics found{{#if epic_key}} for epic:{{epic_key}}{{/if}}.

**Tip:** Create epics as GitHub Issues with label `type:epic`
    </output>
    <action>HALT</action>
  </check>
</step>

<step n="2" goal="Aggregate Epic Metrics">
  <action>For each epic, fetch stories:</action>

  <substep n="2a" title="Fetch stories per epic">
    <action>
for epic in epics:
  epic_label = extract_epic_key(epic)  # e.g., "epic:2"

  # Fetch all stories for this epic
  stories_response = await mcp__github__search_issues({
    query: "repo:{{github_owner}}/{{github_repo}} label:type:story label:{{epic_label}}"
  })

  epic.stories = stories_response.items

  # Calculate metrics
  epic.metrics = {
    total: epic.stories.length,
    done: count_by_label(epic.stories, "status:done"),
    in_review: count_by_label(epic.stories, "status:in-review"),
    in_progress: count_by_label(epic.stories, "status:in-progress"),
    backlog: count_by_label(epic.stories, "status:backlog"),
    blocked: count_by_label(epic.stories, "priority:blocked")
  }

  epic.metrics.progress = (epic.metrics.done / epic.metrics.total * 100).toFixed(0) + "%"
  epic.metrics.active_work = epic.metrics.in_progress + epic.metrics.in_review
    </action>
  </substep>

  <substep n="2b" title="Calculate risk indicators">
    <action>
for epic in epics:
  epic.risks = []

  # Check for stale in-progress stories (no update in 24h)
  for story in epic.stories:
    if has_label(story, "status:in-progress"):
      hours_since_update = calculate_hours_since(story.updated_at)
      if hours_since_update > 24:
        epic.risks.push({
          story: story,
          risk: "stale",
          message: "No activity for " + hours_since_update + "h"
        })

  # Check for blocked stories
  for story in epic.stories:
    if has_label(story, "priority:blocked"):
      epic.risks.push({
        story: story,
        risk: "blocked",
        message: "Story blocked - needs attention"
      })

  # Check for stories in review too long (>48h)
  for story in epic.stories:
    if has_label(story, "status:in-review"):
      hours_since_update = calculate_hours_since(story.updated_at)
      if hours_since_update > 48:
        epic.risks.push({
          story: story,
          risk: "review-delayed",
          message: "In review for " + hours_since_update + "h"
        })
    </action>
  </substep>
</step>

<step n="3" goal="Display Epic Overview">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 EPIC OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each epics}}
┌─────────────────────────────────────────┐
│ EPIC {{epic_key}}: {{title}}
├─────────────────────────────────────────┤
│ Progress: [{{progress_bar}}] {{metrics.progress}}
│
│ Stories: {{metrics.total}} total
│   ✅ Done:        {{metrics.done}}
│   👀 In Review:   {{metrics.in_review}}
│   🔨 In Progress: {{metrics.in_progress}}
│   📋 Backlog:     {{metrics.backlog}}
│   🚫 Blocked:     {{metrics.blocked}}
│
{{#if risks.length}}
│ ⚠️  RISKS: {{risks.length}}
{{#each risks}}
│   • {{story.story_key}}: {{message}}
{{/each}}
{{/if}}
└─────────────────────────────────────────┘

{{/each}}
  </output>
</step>

<step n="4" goal="Show Burndown (if enabled)">
  <check if="show_burndown == true">
    <substep n="4a" title="Calculate burndown">
      <action>
for epic in epics:
  # Get closed stories with timestamps
  closed_stories = filter(epic.stories, has_label("status:done"))

  # Group by completion date
  completion_by_date = {}
  for story in closed_stories:
    date = format_date(story.closed_at)
    completion_by_date[date] = (completion_by_date[date] || 0) + 1

  epic.burndown = {
    total_scope: epic.metrics.total,
    completed: epic.metrics.done,
    remaining: epic.metrics.total - epic.metrics.done,
    completion_history: completion_by_date
  }
      </action>
    </substep>

    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 BURNDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each epics}}
**Epic {{epic_key}}:** {{burndown.completed}}/{{burndown.total_scope}} stories completed ({{burndown.remaining}} remaining)

Recent Completions:
{{#each burndown.completion_history as |count date|}}
  {{date}}: {{count}} {{#if (gt count 1)}}stories{{else}}story{{/if}} completed
{{/each}}

{{/each}}
    </output>
  </check>
</step>

<step n="5" goal="Show Detailed Story List (if enabled)">
  <check if="show_details == true">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 STORY DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each epics}}
## Epic {{epic_key}}: {{title}}

{{#each stories}}
| {{story_key}} | {{title}} | {{status}} | @{{assignee.login or "-"}} |
{{/each}}

{{/each}}
    </output>
  </check>
</step>

<step n="6" goal="Interactive Menu">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Actions:**
[E] View specific Epic (enter epic key)
[D] Toggle story Details
[B] Toggle Burndown
[R] Refresh data
[Q] Quit

  </output>

  <ask>Choice:</ask>

  <check if="choice == 'E'">
    <ask>Enter epic key (e.g., 2):</ask>
    <action>Set epic_key = input</action>
    <action>Goto step 1 (refetch with filter)</action>
  </check>

  <check if="choice == 'D'">
    <action>Toggle show_details</action>
    <action>Goto step 3</action>
  </check>

  <check if="choice == 'B'">
    <action>Toggle show_burndown</action>
    <action>Goto step 3</action>
  </check>

  <check if="choice == 'R'">
    <action>Goto step 1 (refresh)</action>
  </check>

  <check if="choice == 'Q'">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Epic Dashboard closed.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
    <action>Exit</action>
  </check>
</step>

</workflow>

## Helper Functions

```javascript
// Extract epic key from issue labels
function extract_epic_key(epic) {
  for (label of epic.labels) {
    if (label.name.startsWith("epic:")) {
      return label.name.replace("epic:", "")
    }
  }
  return epic.number.toString()
}

// Count stories with specific label
function count_by_label(stories, label_name) {
  return stories.filter(s =>
    s.labels.some(l => l.name === label_name)
  ).length
}

// Check if story has label
function has_label(story, label_name) {
  return story.labels.some(l => l.name === label_name)
}

// Calculate hours since timestamp
function calculate_hours_since(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime()
  return Math.floor(diff / (1000 * 60 * 60))
}

// Generate ASCII progress bar
function generate_progress_bar(percent, width = 20) {
  const filled = Math.floor(percent * width / 100)
  const empty = width - filled
  return '█'.repeat(filled) + '░'.repeat(empty)
}
```
