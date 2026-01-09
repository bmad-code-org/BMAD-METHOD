# Open Feedback Round - Start Async Stakeholder Review

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔔 OPEN FEEDBACK ROUND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Call: mcp__github__get_me()</action>
  <action>current_user = response.login</action>

  <check if="API call fails">
    <output>❌ GitHub MCP not accessible - required for coordination</output>
    <action>HALT</action>
  </check>
</step>

<step n="1" goal="Identify Document">
  <check if="document_key is empty">
    <ask>Which document? Enter key (e.g., "user-auth" for PRD, "2" for Epic):</ask>
    <action>document_key = response</action>
  </check>

  <check if="document_type is empty OR document_type == 'prd'">
    <action>doc_path = {{docs_dir}}/prd/{{document_key}}.md</action>
    <action>document_type = 'prd'</action>
    <action>doc_prefix = 'PRD'</action>
    <action>doc_label_prefix = 'prd'</action>
  </check>

  <check if="document_type == 'epic'">
    <action>doc_path = {{docs_dir}}/epics/epic-{{document_key}}.md</action>
    <action>doc_prefix = 'Epic'</action>
    <action>doc_label_prefix = 'epic'</action>
  </check>

  <substep n="1a" title="Load document">
    <action>Read doc_path</action>
    <check if="file not found">
      <output>
❌ Document not found: {{doc_path}}

Please ensure the {{document_type}} exists. Use:
- "Create PRD" (CP) to create a new PRD
- Check that the key is correct
      </output>
      <action>HALT</action>
    </check>
    <action>doc_content = file_content</action>
  </substep>

  <substep n="1b" title="Extract metadata from document">
    <action>
      // Parse document metadata
      title = extract_between(doc_content, '# PRD: ', '\n') ||
              extract_between(doc_content, '# Epic: ', '\n') ||
              document_key
      version = extract_field(doc_content, 'Version') || '1'
      status = extract_field(doc_content, 'Status') || 'draft'
      stakeholders = extract_stakeholders(doc_content)
      owner = extract_field(doc_content, 'Product Owner')?.replace('@', '')
    </action>
  </substep>

  <check if="status != 'draft' AND status != 'feedback'">
    <output>
⚠️ This {{document_type}} is currently in status: {{status}}

Feedback rounds can only be opened for documents in 'draft' or 'feedback' status.
Current status suggests this may already be in synthesis or sign-off.
    </output>
    <ask>Continue anyway? (y/n):</ask>
    <check if="response != 'y'">
      <action>HALT</action>
    </check>
  </check>

  <output>
📄 Document: {{title}}
📌 Key: {{doc_label_prefix}}:{{document_key}}
📊 Version: {{version}}
👥 Stakeholders: {{stakeholders.length}}
  </output>
</step>

<step n="2" goal="Set Feedback Deadline">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 FEEDBACK DEADLINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

How long should stakeholders have to provide feedback?
  </output>

  <ask>Days until deadline (default: 5):</ask>
  <action>
    days = parseInt(response) || 5
    deadline = new Date()
    deadline.setDate(deadline.getDate() + days)
    deadline_str = deadline.toISOString().split('T')[0]
  </action>

  <output>
Deadline: {{deadline_str}} ({{days}} days from now)
  </output>
</step>

<step n="3" goal="Create GitHub Review Issue">
  <action>
    // Build stakeholder checklist
    checklist = stakeholders.map(s =>
      `- [ ] @${s.replace('@', '')} - ⏳ Pending feedback`
    ).join('\n')

    // Build issue body
    issue_body = `# 📣 ${doc_prefix} Review: ${title} v${version}

**Document Key:** \`${doc_label_prefix}:${document_key}\`
**Version:** ${version}
**Owner:** @${owner || current_user}
**Status:** 🟡 Open for Feedback

---

## 📅 Deadline

**Feedback Due:** ${deadline_str}

---

## 📋 Document Summary

${extract_summary(doc_content)}

---

## 👥 Stakeholder Feedback Status

${checklist}

---

## 📝 How to Provide Feedback

1. Review the document: \`docs/${document_type}/${document_key}.md\`
2. For each piece of feedback, create a new comment or linked issue:
   - **Clarification**: Something unclear → \`/feedback clarification\`
   - **Concern**: Potential issue → \`/feedback concern\`
   - **Suggestion**: Improvement idea → \`/feedback suggestion\`
   - **Addition**: Missing requirement → \`/feedback addition\`

Or use the workflow: "Submit feedback on ${doc_label_prefix}:${document_key}"

---

## 🔄 Review Status

- [ ] All stakeholders have provided feedback
- [ ] Feedback synthesized into new version
- [ ] Ready for sign-off

---

_This review round was opened by @${current_user} on ${new Date().toISOString().split('T')[0]}_
`
  </action>

  <substep n="3a" title="Check for existing open review">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:{{doc_label_prefix}}-review label:{{doc_label_prefix}}:{{document_key}} is:open"
    })</action>

    <check if="response.items.length > 0">
      <output>
⚠️ An open review round already exists for this document:
   Issue #{{response.items[0].number}}: {{response.items[0].title}}

Would you like to:
[1] Use existing review issue
[2] Close old and create new
[3] Cancel
      </output>
      <ask>Choice:</ask>
      <check if="choice == 1">
        <action>review_issue = response.items[0]</action>
        <action>Goto step 4 (skip issue creation)</action>
      </check>
      <check if="choice == 2">
        <action>Call: mcp__github__issue_write({
          method: 'update',
          owner: github_owner,
          repo: github_repo,
          issue_number: response.items[0].number,
          state: 'closed',
          state_reason: 'not_planned'
        })</action>
      </check>
      <check if="choice == 3">
        <action>HALT</action>
      </check>
    </check>
  </substep>

  <substep n="3b" title="Create review issue">
    <action>
      labels = [
        `type:${doc_label_prefix}-review`,
        `${doc_label_prefix}:${document_key}`,
        `version:${version}`,
        'review-status:open'
      ]
    </action>

    <action>Call: mcp__github__issue_write({
      method: 'create',
      owner: "{{github_owner}}",
      repo: "{{github_repo}}",
      title: "{{doc_prefix}} Review: {{title}} v{{version}}",
      body: issue_body,
      labels: labels,
      assignees: stakeholders.map(s => s.replace('@', ''))
    })</action>

    <action>review_issue = response</action>

    <output>
✅ Review issue created: #{{review_issue.number}}
   {{review_issue.html_url}}
    </output>
  </substep>
</step>

<step n="4" goal="Update Document Status">
  <substep n="4a" title="Update status in document">
    <action>
      // Update the Status field in the document
      updated_content = doc_content
        .replace(/\*\*Status:\*\* .+/, '**Status:** Feedback')
        .replace(/\| Feedback Deadline \| .+ \|/, `| Feedback Deadline | ${deadline_str} |`)
    </action>
    <action>Write updated_content to doc_path</action>
  </substep>

  <substep n="4b" title="Update cache">
    <action>
      if (document_type === 'prd') {
        cacheManager.writePrd(document_key, updated_content, {
          status: 'feedback',
          review_issue: review_issue.number,
          feedback_deadline: deadline_str
        })
      } else {
        cacheManager.writeEpic(document_key, updated_content, {
          status: 'feedback',
          review_issue: review_issue.number,
          feedback_deadline: deadline_str
        })
      }
    </action>
  </substep>
</step>

<step n="5" goal="Notify Stakeholders">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 STAKEHOLDER NOTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="5a" title="Create notification comment">
    <action>
      mentions = stakeholders.map(s => `@${s.replace('@', '')}`).join(' ')
      notification = `## 📣 Feedback Requested

${mentions}

You have been asked to review this ${doc_prefix}.

**Deadline:** ${deadline_str}
**Document:** \`docs/${document_type}/${document_key}.md\`

Please review and provide your feedback by creating linked feedback issues or comments.

---

**Quick Actions:**
- View document in repo
- Use "Submit feedback" workflow
- Comment directly on this issue

Thank you for your input! 🙏`
    </action>

    <action>Call: mcp__github__add_issue_comment({
      owner: "{{github_owner}}",
      repo: "{{github_repo}}",
      issue_number: review_issue.number,
      body: notification
    })</action>
  </substep>

  <output>
✅ Stakeholders notified via GitHub @mentions
  </output>
</step>

<step n="6" goal="Summary">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ FEEDBACK ROUND OPENED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Document:** {{title}} v{{version}}
**Review Issue:** #{{review_issue.number}}
**Deadline:** {{deadline_str}}
**Stakeholders Notified:** {{stakeholders.length}}

The following stakeholders have been notified:
{{stakeholders.map(s => '  • @' + s.replace('@', '')).join('\n')}}

---

**Next Steps:**
1. Stakeholders submit feedback via GitHub
2. Monitor progress with: "View feedback for {{doc_label_prefix}}:{{document_key}}"
3. When ready, synthesize with: "Synthesize feedback for {{doc_label_prefix}}:{{document_key}}"

**Quick Commands:**
- [VF] View Feedback
- [SZ] Synthesize Feedback
- [PD] PRD Dashboard / [ED] Epic Dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>

## Helper Functions

```javascript
// Extract text between markers
function extract_between(content, start, end) {
  const startIdx = content.indexOf(start);
  if (startIdx === -1) return null;
  const endIdx = content.indexOf(end, startIdx + start.length);
  return content.slice(startIdx + start.length, endIdx).trim();
}

// Extract field from markdown table or bold format
function extract_field(content, field) {
  // Try bold format: **Field:** value
  const boldMatch = content.match(new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+?)(?:\\n|$)`));
  if (boldMatch) return boldMatch[1].trim();

  // Try table format: | Field | value |
  const tableMatch = content.match(new RegExp(`\\|\\s*${field}\\s*\\|\\s*(.+?)\\s*\\|`));
  if (tableMatch) return tableMatch[1].trim();

  return null;
}

// Extract stakeholders from document
function extract_stakeholders(content) {
  const field = extract_field(content, 'Stakeholders');
  if (!field) return [];

  return field
    .split(/[,\s]+/)
    .filter(s => s.startsWith('@'))
    .map(s => s.replace('@', ''));
}

// Extract summary section from document
function extract_summary(content) {
  // Try to get Vision + Problem Statement
  const vision = extract_between(content, '## Vision', '##') ||
                 extract_between(content, '## Vision', '\n---');
  const problem = extract_between(content, '## Problem Statement', '##') ||
                  extract_between(content, '## Problem Statement', '\n---');

  if (vision || problem) {
    let summary = '';
    if (vision) summary += `**Vision:** ${vision.slice(0, 200)}...\n\n`;
    if (problem) summary += `**Problem:** ${problem.slice(0, 200)}...`;
    return summary;
  }

  // Fallback: first 500 chars
  return content.slice(0, 500) + '...';
}
```

## Natural Language Triggers

This workflow responds to:
- "Open feedback for [prd-key]"
- "Start feedback round for [document]"
- "Request feedback on PRD"
- Menu trigger: `OF`
