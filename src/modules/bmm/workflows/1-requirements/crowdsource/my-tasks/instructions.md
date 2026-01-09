# My Tasks - Unified Inbox for PRD & Epic Collaboration

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 MY TASKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Call: mcp__github__get_me()</action>
  <action>current_user = response.login</action>

  <check if="API call fails">
    <output>❌ GitHub MCP not accessible - cannot fetch tasks</output>
    <action>HALT</action>
  </check>

  <output>
Checking tasks for @{{current_user}}...
  </output>
</step>

<step n="1" goal="Fetch PRD Tasks">
  <substep n="1a" title="Query PRDs awaiting feedback">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} type:issue label:type:prd-review label:review-status:open assignee:{{current_user}} is:open"
    })</action>
    <action>prd_feedback_issues = response.items || []</action>
  </substep>

  <substep n="1b" title="Query PRDs awaiting your sign-off">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} type:issue label:type:prd-review label:review-status:signoff assignee:{{current_user}} is:open"
    })</action>
    <action>prd_signoff_issues = response.items || []</action>
  </substep>

  <substep n="1c" title="Alternative: Query by stakeholder label if no assignee">
    <check if="prd_feedback_issues.length == 0 AND prd_signoff_issues.length == 0">
      <action>Call: mcp__github__search_issues({
        query: "repo:{{github_owner}}/{{github_repo}} type:issue label:type:prd-review is:open mentions:{{current_user}}"
      })</action>
      <action>prd_mentioned_issues = response.items || []</action>
      <action>
        // Filter by status
        prd_feedback_issues = prd_mentioned_issues.filter(i =>
          i.labels.some(l => l.name === 'review-status:open')
        )
        prd_signoff_issues = prd_mentioned_issues.filter(i =>
          i.labels.some(l => l.name === 'review-status:signoff')
        )
      </action>
    </check>
  </substep>
</step>

<step n="2" goal="Fetch Epic Tasks">
  <substep n="2a" title="Query Epics awaiting feedback">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} type:issue label:type:epic-review label:review-status:open assignee:{{current_user}} is:open"
    })</action>
    <action>epic_feedback_issues = response.items || []</action>
  </substep>

  <substep n="2b" title="Alternative: Query by mentions">
    <check if="epic_feedback_issues.length == 0">
      <action>Call: mcp__github__search_issues({
        query: "repo:{{github_owner}}/{{github_repo}} type:issue label:type:epic-review label:review-status:open is:open mentions:{{current_user}}"
      })</action>
      <action>epic_feedback_issues = response.items || []</action>
    </check>
  </substep>
</step>

<step n="3" goal="Calculate Urgency">
  <action>
now = new Date()
all_tasks = []

// Process PRD feedback tasks
for (issue of prd_feedback_issues) {
  deadline = extract_deadline(issue)
  days_remaining = deadline ? days_until(deadline) : null

  all_tasks.push({
    type: 'prd-feedback',
    issue: issue,
    prd_key: extract_label(issue, 'prd:'),
    title: issue.title.replace(/^PRD Review:\s*/, ''),
    action: '💬 Give Feedback',
    deadline: deadline,
    days_remaining: days_remaining,
    urgency: calculate_urgency(days_remaining)
  })
}

// Process PRD sign-off tasks
for (issue of prd_signoff_issues) {
  deadline = extract_deadline(issue)
  days_remaining = deadline ? days_until(deadline) : null

  all_tasks.push({
    type: 'prd-signoff',
    issue: issue,
    prd_key: extract_label(issue, 'prd:'),
    title: issue.title.replace(/^PRD Review:\s*/, ''),
    action: '✍️ Sign-off',
    deadline: deadline,
    days_remaining: days_remaining,
    urgency: calculate_urgency(days_remaining)
  })
}

// Process Epic feedback tasks
for (issue of epic_feedback_issues) {
  deadline = extract_deadline(issue)
  days_remaining = deadline ? days_until(deadline) : null

  all_tasks.push({
    type: 'epic-feedback',
    issue: issue,
    epic_key: extract_label(issue, 'epic:'),
    title: issue.title.replace(/^Epic Review:\s*/, ''),
    action: '💬 Give Feedback',
    deadline: deadline,
    days_remaining: days_remaining,
    urgency: calculate_urgency(days_remaining)
  })
}

// Sort by urgency (urgent first, then deadline, then type)
all_tasks.sort((a, b) => {
  if (a.urgency !== b.urgency) return a.urgency - b.urgency
  if (a.days_remaining !== b.days_remaining) {
    if (a.days_remaining === null) return 1
    if (b.days_remaining === null) return -1
    return a.days_remaining - b.days_remaining
  }
  return 0
})

urgent_tasks = all_tasks.filter(t => t.urgency === 1)
pending_tasks = all_tasks.filter(t => t.urgency === 2)
no_deadline_tasks = all_tasks.filter(t => t.urgency === 3)
  </action>
</step>

<step n="4" goal="Display Task List">
  <check if="all_tasks.length == 0">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ NO PENDING TASKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're all caught up! No PRDs or Epics are waiting for your input.

**Other Actions:**
[PD] View PRD Dashboard
[ED] View Epic Dashboard
[DS] View Sprint Dashboard
    </output>
    <action>HALT</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 MY TASKS - @{{current_user}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <check if="urgent_tasks.length > 0">
    <output>
🔴 URGENT (Deadline Soon)
┌──────────────────┬────────────────────┬───────────────┐
│ Document         │ Action Needed      │ Deadline      │
├──────────────────┼────────────────────┼───────────────┤
{{#each urgent_tasks}}
│ {{pad_right document_key 16}} │ {{pad_right action 18}} │ {{format_deadline deadline days_remaining}} │
{{/each}}
└──────────────────┴────────────────────┴───────────────┘
    </output>
  </check>

  <check if="pending_tasks.length > 0">
    <output>
📋 PENDING
┌──────────────────┬────────────────────┬───────────────┐
│ Document         │ Action Needed      │ Deadline      │
├──────────────────┼────────────────────┼───────────────┤
{{#each pending_tasks}}
│ {{pad_right document_key 16}} │ {{pad_right action 18}} │ {{format_deadline deadline days_remaining}} │
{{/each}}
└──────────────────┴────────────────────┴───────────────┘
    </output>
  </check>

  <check if="no_deadline_tasks.length > 0">
    <output>
📝 NO DEADLINE SET
{{#each no_deadline_tasks}}
  • {{document_key}}: {{action}}
{{/each}}
    </output>
  </check>
</step>

<step n="5" goal="Quick Actions Menu">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Quick Actions:**
{{#each all_tasks as |task index|}}
[{{add index 1}}] {{task.action}} on {{task.document_key}}
{{/each}}

**Other Actions:**
[PD] View PRD Dashboard
[ED] View Epic Dashboard
[R] Refresh
[Q] Quit

  </output>

  <ask>Choice (number or letter):</ask>

  <check if="choice is number AND choice <= all_tasks.length">
    <action>selected_task = all_tasks[parseInt(choice) - 1]</action>

    <check if="selected_task.type == 'prd-feedback'">
      <output>
Opening feedback submission for PRD: {{selected_task.prd_key}}
      </output>
      <action>Load workflow: submit-feedback with document_key = selected_task.prd_key, document_type = 'prd'</action>
    </check>

    <check if="selected_task.type == 'prd-signoff'">
      <output>
Opening sign-off for PRD: {{selected_task.prd_key}}
      </output>
      <action>Load workflow: submit-signoff with document_key = selected_task.prd_key, document_type = 'prd'</action>
    </check>

    <check if="selected_task.type == 'epic-feedback'">
      <output>
Opening feedback submission for Epic: {{selected_task.epic_key}}
      </output>
      <action>Load workflow: submit-feedback with document_key = selected_task.epic_key, document_type = 'epic'</action>
    </check>
  </check>

  <check if="choice == 'PD'">
    <action>Load workflow: prd-dashboard</action>
  </check>

  <check if="choice == 'ED'">
    <action>Load workflow: epic-dashboard</action>
  </check>

  <check if="choice == 'R'">
    <action>Goto step 1 (refresh)</action>
  </check>

  <check if="choice == 'Q'">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
My Tasks closed.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
    <action>Exit</action>
  </check>
</step>

</workflow>

## Helper Functions

```javascript
// Extract deadline from issue body (looks for **Deadline:** pattern)
function extract_deadline(issue) {
  const match = issue.body?.match(/\*\*Deadline:\*\*\s*(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

// Extract label value by prefix
function extract_label(issue, prefix) {
  for (const label of issue.labels) {
    if (label.name.startsWith(prefix)) {
      return label.name.replace(prefix, '');
    }
  }
  return issue.number.toString();
}

// Calculate days until deadline
function days_until(deadline) {
  const target = new Date(deadline);
  const now = new Date();
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Calculate urgency level (1 = urgent, 2 = pending, 3 = no deadline)
function calculate_urgency(days_remaining) {
  if (days_remaining === null) return 3;
  if (days_remaining <= 2) return 1;
  return 2;
}

// Format deadline for display
function format_deadline(deadline, days_remaining) {
  if (!deadline) return 'No deadline';
  if (days_remaining <= 0) return '⚠️ OVERDUE!';
  if (days_remaining === 1) return 'Tomorrow!';
  return `${days_remaining} days`;
}

// Pad string to right
function pad_right(str, length) {
  return (str + ' '.repeat(length)).slice(0, length);
}
```

## Natural Language Triggers

This workflow responds to:
- "What needs my attention?"
- "What PRDs need my input?"
- "What's waiting for me?"
- "My tasks"
- "Show my pending tasks"
- Menu trigger: `MT`
