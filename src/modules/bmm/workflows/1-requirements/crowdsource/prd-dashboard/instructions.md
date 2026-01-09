# PRD Dashboard - Central Visibility Hub

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PRD DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Call: mcp__github__get_me()</action>
  <action>current_user = response.login</action>

  <check if="API call fails">
    <output>❌ GitHub MCP not accessible</output>
    <action>HALT</action>
  </check>
</step>

<step n="1" goal="Fetch All PRD Data">
  <output>
Loading PRD data from GitHub...
  </output>

  <substep n="1a" title="Fetch PRD review issues">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:prd-review"
    })</action>
    <action>review_issues = response.items || []</action>
  </substep>

  <substep n="1b" title="Fetch PRD feedback">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:prd-feedback is:open"
    })</action>
    <action>feedback_issues = response.items || []</action>
  </substep>

  <substep n="1c" title="Process PRD data">
    <action>
      prds = {}
      status_counts = { draft: 0, feedback: 0, synthesis: 0, signoff: 0, approved: 0 }

      // Process review issues to get PRD status
      for (issue of review_issues) {
        const labels = issue.labels.map(l => l.name)
        const prd_key = extract_label(labels, 'prd:')

        if (!prd_key) continue

        if (!prds[prd_key]) {
          prds[prd_key] = {
            key: prd_key,
            title: issue.title.replace(/^(PRD Review|Sign-off):\s*/, '').replace(/\s+v\d+$/, ''),
            reviews: [],
            feedback: [],
            status: 'draft',
            owner: null,
            last_activity: issue.updated_at
          }
        }

        prds[prd_key].reviews.push(issue)

        // Determine current status from most recent review
        const review_status = extract_label(labels, 'review-status:')
        if (review_status === 'open' && issue.state === 'open') {
          prds[prd_key].status = 'feedback'
        } else if (review_status === 'signoff' && issue.state === 'open') {
          prds[prd_key].status = 'signoff'
        } else if (review_status === 'approved' || issue.state === 'closed') {
          prds[prd_key].status = 'approved'
        }

        if (new Date(issue.updated_at) > new Date(prds[prd_key].last_activity)) {
          prds[prd_key].last_activity = issue.updated_at
        }
      }

      // Attach feedback to PRDs
      for (issue of feedback_issues) {
        const labels = issue.labels.map(l => l.name)
        const prd_key = extract_label(labels, 'prd:')

        if (prd_key && prds[prd_key]) {
          prds[prd_key].feedback.push({
            id: issue.number,
            title: issue.title.replace(/^[^\s]+\s+Feedback:\s*/, ''),
            type: extract_label(labels, 'feedback-type:'),
            status: extract_label(labels, 'feedback-status:'),
            submittedBy: issue.user?.login
          })
        }
      }

      // Count by status
      for (prd of Object.values(prds)) {
        status_counts[prd.status] = (status_counts[prd.status] || 0) + 1
      }

      prd_list = Object.values(prds).sort((a, b) =>
        new Date(b.last_activity) - new Date(a.last_activity)
      )
    </action>
  </substep>
</step>

<step n="2" goal="Display Portfolio Overview">
  <check if="prd_key is empty">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PRD PORTFOLIO DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Status Summary:**
  📝 Draft:     {{status_counts.draft}} PRDs
  💬 Feedback:  {{status_counts.feedback}} PRDs (collecting input)
  🔄 Synthesis: {{status_counts.synthesis}} PRDs (being processed)
  ✍️ Sign-off:  {{status_counts.signoff}} PRDs (awaiting approval)
  ✅ Approved:  {{status_counts.approved}} PRDs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Active PRDs:**
┌──────────────────┬────────────────────────┬─────────┬──────────────┐
│ PRD Key          │ Title                  │ Status  │ Activity     │
├──────────────────┼────────────────────────┼─────────┼──────────────┤
{{#each prd_list}}
│ prd:{{pad_right key 12}} │ {{pad_right title 22}} │ {{status_emoji status}} │ {{time_ago last_activity}} │
{{/each}}
└──────────────────┴────────────────────────┴─────────┴──────────────┘

{{#if attention_needed}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ **Attention Needed:**
{{#each attention_items}}
  • {{prd_key}} - {{message}}
{{/each}}
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <action>Goto step 4 (interactive menu)</action>
  </check>
</step>

<step n="3" goal="Display PRD Detail View">
  <check if="prd_key is not empty">
    <action>prd = prds[prd_key]</action>

    <check if="!prd">
      <output>
❌ PRD not found: prd:{{prd_key}}
      </output>
      <action>prd_key = ''</action>
      <action>Goto step 2</action>
    </check>

    <action>
      // Get active review issue
      active_review = prd.reviews.find(r => r.state === 'open')

      // Count feedback by status
      new_feedback = prd.feedback.filter(f => f.status === 'new').length
      reviewed_feedback = prd.feedback.filter(f => f.status === 'reviewed').length

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
    </action>

    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PRD DETAIL: prd:{{prd_key}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Title:** {{prd.title}}
**Status:** {{status_emoji prd.status}} {{prd.status}}
**Last Updated:** {{time_ago prd.last_activity}}
{{#if active_review}}
**Review Issue:** #{{active_review.number}}
{{/if}}

━━━ FEEDBACK PROGRESS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Total Feedback:** {{prd.feedback.length}} items
  ├── 🆕 New:       {{new_feedback}}
  ├── 👀 Reviewed:  {{reviewed_feedback}}
  └── ✅ Processed: {{prd.feedback.length - new_feedback - reviewed_feedback}}

{{#if prd.feedback.length}}
**By Type:**
{{#each feedback_by_type}}
  • {{type}}: {{count}}
{{/each}}
{{/if}}

{{#if prd.status == 'signoff'}}
━━━ SIGN-OFF PROGRESS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each signed_off}}
  {{#if (eq status 'approved')}}✅{{/if}}{{#if (eq status 'approved-with-note')}}✅📝{{/if}}{{#if (eq status 'blocked')}}🚫{{/if}} @{{user}} - {{status}}
{{/each}}

{{#each pending_stakeholders}}
  ⏳ @{{this}} - Pending
{{/each}}

**Progress:** {{signed_off.length}} / {{stakeholders.length}}
{{/if}}

{{#if conflicts}}
━━━ CONFLICTS DETECTED ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each conflicts}}
⚠️ **{{section}}** - Multiple stakeholders have input
{{#each items}}
  • @{{submittedBy}}: "{{title}}"
{{/each}}
{{/each}}
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
  </check>
</step>

<step n="4" goal="Interactive Menu">
  <output>
**Actions:**
[1-{{prd_list.length}}] View specific PRD (enter number)
[C] Create new PRD
[F] View feedback for a PRD
[S] Synthesize feedback
[R] Refresh
[B] Back to portfolio (if in detail view)
[Q] Quit

  </output>

  <ask>Choice:</ask>

  <check if="choice is number AND choice <= prd_list.length">
    <action>selected_prd = prd_list[parseInt(choice) - 1]</action>
    <action>prd_key = selected_prd.key</action>
    <action>Goto step 3</action>
  </check>

  <check if="choice == 'C'">
    <action>Load workflow: create-prd-draft</action>
  </check>

  <check if="choice == 'F'">
    <ask>Enter PRD key:</ask>
    <action>Load workflow: view-feedback with document_key = response, document_type = 'prd'</action>
  </check>

  <check if="choice == 'S'">
    <ask>Enter PRD key:</ask>
    <action>Load workflow: synthesize-feedback with document_key = response, document_type = 'prd'</action>
  </check>

  <check if="choice == 'R'">
    <action>Goto step 1</action>
  </check>

  <check if="choice == 'B'">
    <action>prd_key = ''</action>
    <action>Goto step 2</action>
  </check>

  <check if="choice == 'Q'">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRD Dashboard closed.
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

// Find items needing attention
function find_attention_items(prds) {
  const items = [];

  for (const prd of Object.values(prds)) {
    // Check for stale feedback rounds
    const hours_since_activity = (Date.now() - new Date(prd.last_activity)) / (1000 * 60 * 60);

    if (prd.status === 'feedback' && hours_since_activity > 120) { // 5 days
      items.push({
        prd_key: `prd:${prd.key}`,
        message: `No activity for ${Math.floor(hours_since_activity / 24)} days`
      });
    }

    // Check for blocked sign-offs
    if (prd.status === 'signoff') {
      const blocked = prd.reviews.some(r =>
        r.labels.some(l => l.name.includes('-blocked'))
      );
      if (blocked) {
        items.push({
          prd_key: `prd:${prd.key}`,
          message: 'Has blocking concerns'
        });
      }
    }
  }

  return items;
}
```

## Natural Language Triggers

This workflow responds to:
- "Show PRD dashboard"
- "What PRDs are in progress?"
- "PRD status"
- "View all PRDs"
- Menu trigger: `PD`
