# View Feedback - Review All Stakeholder Input

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👁️ VIEW FEEDBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Call: mcp__github__get_me()</action>

  <check if="API call fails">
    <output>❌ GitHub MCP not accessible</output>
    <action>HALT</action>
  </check>
</step>

<step n="1" goal="Identify Document">
  <check if="document_key is empty">
    <ask>Which document? Enter key (e.g., "user-auth" for PRD, "2" for Epic):</ask>
    <action>document_key = response</action>
  </check>

  <check if="document_type is empty">
    <ask>Is this a [P]RD or [E]pic?</ask>
    <action>document_type = (response.toLowerCase().startsWith('p')) ? 'prd' : 'epic'</action>
  </check>

  <action>
    doc_label = `${document_type}:${document_key}`
    feedback_label = `type:${document_type}-feedback`
  </action>
</step>

<step n="2" goal="Fetch All Feedback">
  <action>Call: mcp__github__search_issues({
    query: "repo:{{github_owner}}/{{github_repo}} label:{{feedback_label}} label:{{doc_label}} is:open"
  })</action>

  <action>feedback_issues = response.items || []</action>

  <check if="feedback_issues.length == 0">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📭 NO FEEDBACK FOUND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No feedback has been submitted for {{doc_label}} yet.

**Actions:**
[SF] Submit Feedback
[MT] My Tasks
[Q] Quit
    </output>
    <ask>Choice:</ask>
    <check if="choice == 'SF'">
      <action>Load workflow: submit-feedback with document_key, document_type</action>
    </check>
    <check if="choice == 'MT'">
      <action>Load workflow: my-tasks</action>
    </check>
    <action>HALT</action>
  </check>
</step>

<step n="3" goal="Parse and Group Feedback">
  <action>
    // Parse feedback issues into structured data
    all_feedback = []
    by_section = {}
    by_type = {}
    by_status = { new: [], reviewed: [], incorporated: [], deferred: [] }
    conflicts = []

    for (issue of feedback_issues) {
      const labels = issue.labels.map(l => l.name)

      const fb = {
        id: issue.number,
        url: issue.html_url,
        title: issue.title.replace(/^[^\s]+\s+Feedback:\s*/, ''),
        section: extract_label(labels, 'feedback-section:') || 'General',
        type: extract_label(labels, 'feedback-type:') || 'suggestion',
        status: extract_label(labels, 'feedback-status:') || 'new',
        priority: extract_label(labels, 'priority:') || 'medium',
        submittedBy: issue.user?.login,
        createdAt: issue.created_at,
        body: issue.body
      }

      all_feedback.push(fb)

      // Group by section
      if (!by_section[fb.section]) by_section[fb.section] = []
      by_section[fb.section].push(fb)

      // Group by type
      if (!by_type[fb.type]) by_type[fb.type] = []
      by_type[fb.type].push(fb)

      // Group by status
      if (by_status[fb.status]) by_status[fb.status].push(fb)
    }

    // Detect potential conflicts (multiple feedback on same section)
    for (const [section, items] of Object.entries(by_section)) {
      if (items.length >= 2) {
        const concerns = items.filter(i => i.type === 'concern')
        const suggestions = items.filter(i => i.type === 'suggestion')

        if (concerns.length > 1 || (concerns.length >= 1 && suggestions.length >= 1)) {
          conflicts.push({
            section,
            count: items.length,
            items: items
          })
        }
      }
    }
  </action>
</step>

<step n="4" goal="Display Summary">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 FEEDBACK SUMMARY: {{doc_label}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Total Feedback:** {{all_feedback.length}} items

**By Status:**
  🆕 New:          {{by_status.new.length}}
  👀 Reviewed:     {{by_status.reviewed.length}}
  ✅ Incorporated: {{by_status.incorporated.length}}
  ⏸️ Deferred:     {{by_status.deferred.length}}

**By Type:**
{{#each by_type as |items type|}}
  {{get_type_emoji type}} {{type}}: {{items.length}}
{{/each}}

**By Section:**
{{#each by_section as |items section|}}
  • {{section}}: {{items.length}} item(s)
{{/each}}

{{#if conflicts.length}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ POTENTIAL CONFLICTS DETECTED: {{conflicts.length}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each conflicts}}
**{{section}}** - {{count}} stakeholders have input:
{{#each items}}
  • @{{submittedBy}}: "{{title}}"
{{/each}}

{{/each}}
{{/if}}
  </output>
</step>

<step n="5" goal="Display Options">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**View Options:**
[1] View by Section
[2] View by Type
[3] View Conflicts Only
[4] View All Details
[5] Export to Markdown

**Actions:**
[S] Synthesize Feedback (incorporate into document)
[R] Refresh
[Q] Quit

  </output>

  <ask>Choice:</ask>
</step>

<step n="6" goal="Handle Choice">
  <check if="choice == 1">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📂 FEEDBACK BY SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each by_section as |items section|}}
## {{section}} ({{items.length}} items)

{{#each items}}
┌────────────────────────────────────────────
│ #{{id}}: {{title}}
│ Type: {{get_type_emoji type}} {{type}} | Priority: {{priority}} | Status: {{status}}
│ By: @{{submittedBy}} on {{format_date createdAt}}
└────────────────────────────────────────────

{{/each}}
{{/each}}
    </output>
    <action>Goto step 5</action>
  </check>

  <check if="choice == 2">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏷️ FEEDBACK BY TYPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each by_type as |items type|}}
## {{get_type_emoji type}} {{type}} ({{items.length}} items)

{{#each items}}
| #{{id}} | {{title}} | @{{submittedBy}} | {{section}} |
{{/each}}

{{/each}}
    </output>
    <action>Goto step 5</action>
  </check>

  <check if="choice == 3">
    <check if="conflicts.length == 0">
      <output>
✅ No conflicts detected! All feedback is non-overlapping.
      </output>
      <action>Goto step 5</action>
    </check>

    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CONFLICTS REQUIRING RESOLUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each conflicts}}
## Conflict in: {{section}}

Multiple stakeholders have provided feedback on this section:

{{#each items}}
### @{{submittedBy}} - {{type}}
**{{title}}**

{{extract_feedback body}}

---
{{/each}}

**Suggested Resolution:** Use synthesis workflow to generate proposed resolution.

{{/each}}
    </output>
    <action>Goto step 5</action>
  </check>

  <check if="choice == 4">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ALL FEEDBACK DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each all_feedback}}
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ #{{id}}: {{title}}
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Type:     {{get_type_emoji type}} {{type}}
┃ Section:  {{section}}
┃ Priority: {{priority}}
┃ Status:   {{status}}
┃ By:       @{{submittedBy}}
┃ Date:     {{format_date createdAt}}
┃ URL:      {{url}}
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FEEDBACK:
┃ {{extract_feedback body}}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{/each}}
    </output>
    <action>Goto step 5</action>
  </check>

  <check if="choice == 5">
    <action>
      // Generate markdown export
      export_content = `# Feedback Report: ${doc_label}

Generated: ${new Date().toISOString()}
Total Feedback: ${all_feedback.length}

## Summary

| Type | Count |
|------|-------|
${Object.entries(by_type).map(([t, items]) => `| ${t} | ${items.length} |`).join('\n')}

## By Section

${Object.entries(by_section).map(([section, items]) => `
### ${section}

${items.map(fb => `- **${fb.title}** (${fb.type}, ${fb.priority}) - @${fb.submittedBy} #${fb.id}`).join('\n')}
`).join('\n')}

## Conflicts

${conflicts.length === 0 ? 'No conflicts detected.' : conflicts.map(c => `
### ${c.section}

${c.items.map(fb => `- @${fb.submittedBy}: "${fb.title}"`).join('\n')}
`).join('\n')}
`
      export_path = `${cache_dir}/feedback-report-${document_key}.md`
    </action>
    <action>Write export_content to export_path</action>
    <output>
✅ Exported to: {{export_path}}
    </output>
    <action>Goto step 5</action>
  </check>

  <check if="choice == 'S'">
    <output>
Opening synthesis workflow for {{doc_label}}...
    </output>
    <action>Load workflow: synthesize-feedback with document_key, document_type</action>
  </check>

  <check if="choice == 'R'">
    <action>Goto step 2</action>
  </check>

  <check if="choice == 'Q'">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
View Feedback closed.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
    <action>Exit</action>
  </check>

  <action>Goto step 5</action>
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

// Get emoji for feedback type
function get_type_emoji(type) {
  const emojis = {
    clarification: '📋',
    concern: '⚠️',
    suggestion: '💡',
    addition: '➕',
    priority: '🔢',
    scope: '📐',
    dependency: '🔗',
    'technical-risk': '🔧',
    'story-split': '✂️'
  };
  return emojis[type] || '📝';
}

// Format date for display
function format_date(isoDate) {
  return new Date(isoDate).toISOString().split('T')[0];
}

// Extract feedback content from issue body
function extract_feedback(body) {
  if (!body) return 'No details provided.';

  // Try to extract the Feedback section
  const match = body.match(/## Feedback\n\n([\s\S]*?)(?:\n##|$)/);
  if (match) {
    return match[1].trim().slice(0, 200) + (match[1].length > 200 ? '...' : '');
  }

  // Fallback to first 200 chars
  return body.slice(0, 200) + (body.length > 200 ? '...' : '');
}
```

## Natural Language Triggers

This workflow responds to:
- "View feedback for [document]"
- "Show feedback on PRD"
- "What feedback has been submitted?"
- "See all feedback for [document]"
- Menu trigger: `VF`
