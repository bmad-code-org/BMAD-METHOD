# Epic Dashboard - Central Epic Visibility with PRD Lineage

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 EPIC DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Call: mcp__github__get_me()</action>
  <action>current_user = response.login</action>

  <check if="API call fails">
    <output>❌ GitHub MCP not accessible</output>
    <action>HALT</action>
  </check>
</step>

<step n="1" goal="Fetch All Epic Data">
  <output>
Loading epic data from GitHub...
  </output>

  <substep n="1a" title="Fetch epic review issues">
    <action>
      query = "repo:{{github_owner}}/{{github_repo}} label:type:epic-review"
      if (source_prd) {
        query += ` label:source-prd:${source_prd}`
      }
    </action>

    <action>Call: mcp__github__search_issues({
      query: query
    })</action>
    <action>review_issues = response.items || []</action>
  </substep>

  <substep n="1b" title="Fetch epic feedback">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:epic-feedback is:open"
    })</action>
    <action>feedback_issues = response.items || []</action>
  </substep>

  <substep n="1c" title="Process epic data">
    <action>
      epics = {}
      status_counts = { draft: 0, feedback: 0, synthesis: 0, signoff: 0, approved: 0 }
      prds_with_epics = {}

      // Process review issues to get epic status
      for (issue of review_issues) {
        const labels = issue.labels.map(l => l.name)
        const epic_key = extract_label(labels, 'epic:')
        const source_prd_key = extract_label(labels, 'source-prd:')

        if (!epic_key) continue

        if (!epics[epic_key]) {
          epics[epic_key] = {
            key: epic_key,
            title: issue.title.replace(/^Epic Review:\s*/, '').replace(/\s+v\d+$/, ''),
            source_prd: source_prd_key,
            reviews: [],
            feedback: [],
            status: 'draft',
            stories: 0,
            last_activity: issue.updated_at,
            issue_number: issue.number
          }
        }

        epics[epic_key].reviews.push(issue)

        // Track PRDs with epics
        if (source_prd_key) {
          if (!prds_with_epics[source_prd_key]) {
            prds_with_epics[source_prd_key] = []
          }
          if (!prds_with_epics[source_prd_key].includes(epic_key)) {
            prds_with_epics[source_prd_key].push(epic_key)
          }
        }

        // Determine current status from most recent review
        const review_status = extract_label(labels, 'review-status:')
        if (review_status === 'open' && issue.state === 'open') {
          epics[epic_key].status = 'feedback'
        } else if (review_status === 'synthesis' && issue.state === 'open') {
          epics[epic_key].status = 'synthesis'
        } else if (review_status === 'signoff' && issue.state === 'open') {
          epics[epic_key].status = 'signoff'
        } else if (review_status === 'approved' || issue.state === 'closed') {
          epics[epic_key].status = 'approved'
        } else if (review_status === 'draft') {
          epics[epic_key].status = 'draft'
        }

        if (new Date(issue.updated_at) > new Date(epics[epic_key].last_activity)) {
          epics[epic_key].last_activity = issue.updated_at
        }
      }

      // Attach feedback to epics
      for (issue of feedback_issues) {
        const labels = issue.labels.map(l => l.name)
        const epic_key = extract_label(labels, 'epic:')

        if (epic_key && epics[epic_key]) {
          epics[epic_key].feedback.push({
            id: issue.number,
            title: issue.title,
            type: extract_label(labels, 'feedback-type:'),
            status: extract_label(labels, 'feedback-status:'),
            submittedBy: issue.user?.login
          })
        }
      }

      // Count by status
      for (epic of Object.values(epics)) {
        status_counts[epic.status] = (status_counts[epic.status] || 0) + 1
      }

      epic_list = Object.values(epics).sort((a, b) =>
        new Date(b.last_activity) - new Date(a.last_activity)
      )
    </action>
  </substep>
</step>

<step n="2" goal="Display Portfolio Overview">
  <check if="epic_key is empty">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 EPIC PORTFOLIO DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Status Summary:**
  📝 Draft:     {{status_counts.draft}} epics
  💬 Feedback:  {{status_counts.feedback}} epics (collecting input)
  🔄 Synthesis: {{status_counts.synthesis}} epics (being processed)
  ✍️ Sign-off:  {{status_counts.signoff}} epics (awaiting approval)
  ✅ Approved:  {{status_counts.approved}} epics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Active Epics:**
┌──────────────────┬────────────────────────┬─────────┬──────────────┬──────────────┐
│ Epic Key         │ Title                  │ Status  │ Source PRD   │ Activity     │
├──────────────────┼────────────────────────┼─────────┼──────────────┼──────────────┤
{{#each epic_list}}
│ epic:{{pad_right key 10}} │ {{pad_right title 22}} │ {{status_emoji status}} │ prd:{{pad_right source_prd 8}} │ {{time_ago last_activity}} │
{{/each}}
└──────────────────┴────────────────────────┴─────────┴──────────────┴──────────────┘

{{#if source_prd}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Filtered by PRD:** prd:{{source_prd}}
{{/if}}

{{#if attention_needed}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ **Attention Needed:**
{{#each attention_items}}
  • {{epic_key}} - {{message}}
{{/each}}
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**PRD Coverage:**
{{#each prds_with_epics}}
  • prd:{{@key}} → {{this.length}} epic(s)
{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <action>Goto step 4 (interactive menu)</action>
  </check>
</step>

<step n="3" goal="Display Epic Detail View">
  <check if="epic_key is not empty">
    <action>epic = epics[epic_key]</action>

    <check if="!epic">
      <output>
❌ Epic not found: epic:{{epic_key}}
      </output>
      <action>epic_key = ''</action>
      <action>Goto step 2</action>
    </check>

    <action>
      // Load epic document for story count
      epic_path = `${docs_dir}/epics/epic-${epic_key}.md`
      Read epic_path
      epic_content = file_content || ''

      stories = extract_epic_stories(epic_content)
      tech_lead = extract_tech_lead(epic_content)
      dependencies = extract_dependencies(epic_content)

      // Get active review issue
      active_review = epic.reviews.find(r => r.state === 'open')

      // Count feedback by status
      new_feedback = epic.feedback.filter(f => f.status === 'new').length
      reviewed_feedback = epic.feedback.filter(f => f.status === 'reviewed').length

      // Get stakeholders who haven't responded
      if (active_review) {
        stakeholders = active_review.assignees?.map(a => a.login) || []

        // Parse sign-off labels
        signoff_labels = active_review.labels
          .map(l => l.name)
          .filter(l => l.startsWith('signoff-'))

        signed_off = signoff_labels.map(l => {
          const match = l.match(/^signoff-(.+)-(approved|approved-with-note|blocked)$/)
          return match ? { user: match[1], status: match[2] } : null
        }).filter(Boolean)

        pending_stakeholders = stakeholders.filter(s =>
          !signed_off.some(so => so.user === s)
        )
      }

      // Count feedback by type
      feedback_by_type = {}
      for (f of epic.feedback) {
        const type = f.type || 'general'
        feedback_by_type[type] = (feedback_by_type[type] || 0) + 1
      }
    </action>

    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 EPIC DETAIL: epic:{{epic_key}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Title:** {{epic.title}}
**Status:** {{status_emoji epic.status}} {{epic.status}}
**Source PRD:** prd:{{epic.source_prd}}
**Tech Lead:** {{tech_lead || 'TBD'}}
**Last Updated:** {{time_ago epic.last_activity}}
{{#if active_review}}
**Review Issue:** #{{active_review.number}}
{{/if}}

━━━ STORY BREAKDOWN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Total Stories:** {{stories.length}}

{{#each stories}}
  {{@index + 1}}. {{title}} ({{complexity || 'TBD'}})
{{/each}}

━━━ DEPENDENCIES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#if dependencies.length}}
{{#each dependencies}}
  • {{this}}
{{/each}}
{{else}}
  None specified
{{/if}}

━━━ FEEDBACK PROGRESS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Total Feedback:** {{epic.feedback.length}} items
  ├── 🆕 New:       {{new_feedback}}
  ├── 👀 Reviewed:  {{reviewed_feedback}}
  └── ✅ Processed: {{epic.feedback.length - new_feedback - reviewed_feedback}}

{{#if epic.feedback.length}}
**By Type:**
{{#each feedback_by_type}}
  • {{@key}}: {{this}}
{{/each}}
{{/if}}

{{#if (eq epic.status 'signoff')}}
━━━ SIGN-OFF PROGRESS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each signed_off}}
  {{#if (eq status 'approved')}}✅{{/if}}{{#if (eq status 'approved-with-note')}}✅📝{{/if}}{{#if (eq status 'blocked')}}🚫{{/if}} @{{user}} - {{status}}
{{/each}}

{{#each pending_stakeholders}}
  ⏳ @{{this}} - Pending
{{/each}}

**Progress:** {{signed_off.length}} / {{stakeholders.length}}
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
  </check>
</step>

<step n="4" goal="Interactive Menu">
  <output>
**Actions:**
[1-{{epic_list.length}}] View specific epic (enter number)
[C] Create new epic from PRD
[F] View feedback for an epic
[S] Synthesize epic feedback
[P] Filter by PRD
[R] Refresh
[B] Back to portfolio (if in detail view)
[Q] Quit

  </output>

  <ask>Choice:</ask>

  <check if="choice is number AND choice <= epic_list.length">
    <action>selected_epic = epic_list[parseInt(choice) - 1]</action>
    <action>epic_key = selected_epic.key</action>
    <action>Goto step 3</action>
  </check>

  <check if="choice == 'C'">
    <action>Load workflow: create-epic-draft</action>
  </check>

  <check if="choice == 'F'">
    <ask>Enter epic key:</ask>
    <action>Load workflow: view-feedback with document_key = response, document_type = 'epic'</action>
  </check>

  <check if="choice == 'S'">
    <ask>Enter epic key:</ask>
    <action>Load workflow: synthesize-epic-feedback with epic_key = response</action>
  </check>

  <check if="choice == 'P'">
    <ask>Enter PRD key to filter by (or 'all'):</ask>
    <action>source_prd = (response.toLowerCase() === 'all') ? '' : response</action>
    <action>Goto step 1</action>
  </check>

  <check if="choice == 'R'">
    <action>Goto step 1</action>
  </check>

  <check if="choice == 'B'">
    <action>epic_key = ''</action>
    <action>Goto step 2</action>
  </check>

  <check if="choice == 'Q'">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Epic Dashboard closed.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
    <action>Exit</action>
  </check>

  <action>Goto step 4</action>
</step>

</workflow>

## Helper Functions

```javascript
// Extract label value by prefix
function extract_label(labels, prefix) {
  for (const label of labels) {
    if (label.startsWith(prefix)) {
      return label.replace(prefix, '');
    }
  }
  return null;
}

// Get status emoji
function status_emoji(status) {
  const emojis = {
    draft: '📝',
    feedback: '💬',
    synthesis: '🔄',
    signoff: '✍️',
    approved: '✅'
  };
  return emojis[status] || '❓';
}

// Format time ago
function time_ago(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const hours = Math.floor((now - then) / (1000 * 60 * 60));

  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  return then.toISOString().split('T')[0];
}

// Pad string to right
function pad_right(str, length) {
  if (!str) str = '';
  return (str + ' '.repeat(length)).slice(0, length);
}

// Extract epic stories from content
function extract_epic_stories(content) {
  const stories = [];
  const storyRegex = /###\s+Story\s+\d+:\s*(.+)\n+([\s\S]*?)(?=###\s+Story|---|\n##|$)/gi;
  let match;
  while ((match = storyRegex.exec(content)) !== null) {
    const title = match[1].trim();
    const body = match[2];
    const complexityMatch = body.match(/\*\*(?:Estimated )?Complexity:\*\*\s*(\w+)/i);

    stories.push({
      title: title,
      complexity: complexityMatch ? complexityMatch[1] : null
    });
  }
  return stories;
}

// Extract tech lead from content
function extract_tech_lead(content) {
  const match = content.match(/\|\s*Tech Lead\s*\|\s*(@?\w+)\s*\|/);
  return match ? match[1] : null;
}

// Extract dependencies from content
function extract_dependencies(content) {
  const section = content.match(/## Dependencies\n+([\s\S]*?)(?=\n##|$)/);
  if (!section) return [];

  return section[1]
    .split('\n')
    .filter(line => line.startsWith('-'))
    .map(line => line.replace(/^-\s*/, '').trim())
    .filter(line => line && line !== 'TBD');
}

// Find items needing attention
function find_attention_items(epics) {
  const items = [];

  for (const epic of Object.values(epics)) {
    const hours_since_activity = (Date.now() - new Date(epic.last_activity)) / (1000 * 60 * 60);

    // Check for stale feedback rounds
    if (epic.status === 'feedback' && hours_since_activity > 72) { // 3 days
      items.push({
        epic_key: `epic:${epic.key}`,
        message: `No activity for ${Math.floor(hours_since_activity / 24)} days`
      });
    }

    // Check for blocked sign-offs
    if (epic.status === 'signoff') {
      const blocked = epic.reviews.some(r =>
        r.labels.some(l => l.name.includes('-blocked'))
      );
      if (blocked) {
        items.push({
          epic_key: `epic:${epic.key}`,
          message: 'Has blocking concerns'
        });
      }
    }

    // Check for epics with unprocessed feedback
    const new_feedback = epic.feedback.filter(f => f.status === 'new').length;
    if (new_feedback >= 5) {
      items.push({
        epic_key: `epic:${epic.key}`,
        message: `${new_feedback} unprocessed feedback items`
      });
    }
  }

  return items;
}
```

## Natural Language Triggers

This workflow responds to:
- "Show epic dashboard"
- "What epics are in progress?"
- "Epic status"
- "View all epics"
- "Epics from PRD [key]"
- Menu trigger: `ED`
