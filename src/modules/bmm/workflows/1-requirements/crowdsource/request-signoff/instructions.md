# Request Sign-off - Final Stakeholder Approval

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✍️ REQUEST SIGN-OFF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Call: mcp__github__get_me()</action>
  <action>current_user = response.login</action>

  <check if="API call fails">
    <output>❌ GitHub MCP not accessible</output>
    <action>HALT</action>
  </check>
</step>

<step n="1" goal="Identify Document">
  <check if="document_key is empty">
    <ask>Which document needs sign-off? Enter key:</ask>
    <action>document_key = response</action>
  </check>

  <action>
    if (document_type === 'prd') {
      doc_path = `${docs_dir}/prd/${document_key}.md`
      doc_label = `prd:${document_key}`
      review_label = 'type:prd-review'
    } else {
      doc_path = `${docs_dir}/epics/epic-${document_key}.md`
      doc_label = `epic:${document_key}`
      review_label = 'type:epic-review'
    }
  </action>

  <action>Read doc_path</action>
  <check if="file not found">
    <output>❌ Document not found: {{doc_path}}</output>
    <action>HALT</action>
  </check>
  <action>doc_content = file_content</action>
  <action>
    title = extract_title(doc_content)
    version = extract_version(doc_content)
    stakeholders = extract_stakeholders(doc_content)
  </action>

  <output>
📄 Document: {{title}} v{{version}}
👥 Stakeholders: {{stakeholders.length}}
  </output>
</step>

<step n="2" goal="Configure Sign-off Requirements">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ SIGN-OFF CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

How should sign-off be determined?

[1] Count-based: Minimum number of approvals (e.g., 3 of 5 must approve)
[2] Percentage: Percentage must approve (e.g., 66% of stakeholders)
[3] Required + Optional: Specific people must approve + minimum optional

  </output>

  <ask>Choice (1-3):</ask>
  <action>threshold_type = choice</action>

  <check if="threshold_type == 1">
    <ask>Minimum approvals needed (out of {{stakeholders.length}}):</ask>
    <action>
      signoff_config = {
        threshold_type: 'count',
        minimum_approvals: parseInt(response),
        allow_blocks: true,
        block_threshold: 1
      }
    </action>
  </check>

  <check if="threshold_type == 2">
    <ask>Percentage required (e.g., 66 for 66%):</ask>
    <action>
      signoff_config = {
        threshold_type: 'percentage',
        approval_percentage: parseInt(response),
        allow_blocks: true,
        block_threshold: 1
      }
    </action>
  </check>

  <check if="threshold_type == 3">
    <output>
Current stakeholders: {{stakeholders.map(s => '@' + s).join(', ')}}

Enter REQUIRED approvers (must all approve):
    </output>
    <ask>Required approvers (comma-separated usernames):</ask>
    <action>required_approvers = response.split(',').map(s => s.trim().replace('@', ''))</action>

    <output>
Remaining stakeholders can be optional.
    </output>
    <ask>Minimum optional approvers needed:</ask>
    <action>
      optional_approvers = stakeholders.filter(s => !required_approvers.includes(s))
      signoff_config = {
        threshold_type: 'required_approvers',
        required: required_approvers,
        optional: optional_approvers,
        minimum_optional: parseInt(response),
        allow_blocks: true,
        block_threshold: 1
      }
    </action>
  </check>
</step>

<step n="3" goal="Set Sign-off Deadline">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 SIGN-OFF DEADLINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <ask>Days until sign-off deadline (default: 3):</ask>
  <action>
    days = parseInt(response) || 3
    deadline = new Date()
    deadline.setDate(deadline.getDate() + days)
    deadline_str = deadline.toISOString().split('T')[0]
  </action>

  <output>
Deadline: {{deadline_str}} ({{days}} days from now)
  </output>
</step>

<step n="4" goal="Find or Create Review Issue">
  <action>Call: mcp__github__search_issues({
    query: "repo:{{github_owner}}/{{github_repo}} label:{{review_label}} label:{{doc_label}} is:open"
  })</action>

  <check if="response.items.length > 0">
    <action>review_issue = response.items[0]</action>
    <output>
Found existing review issue: #{{review_issue.number}}
    </output>
  </check>

  <check if="response.items.length == 0">
    <output>
No existing review issue found. Creating one...
    </output>
    <action>
      // Create new review issue for sign-off
      issue_body = `# ✍️ Sign-off Request: ${title} v${version}

**Document Key:** \`${doc_label}\`
**Version:** ${version}
**Status:** 🟡 Awaiting Sign-off

---

## 📅 Deadline

**Sign-off Due:** ${deadline_str}

---

## 👥 Stakeholder Status

${stakeholders.map(s => `- [ ] @${s} - ⏳ Pending`).join('\n')}

---

_Sign-off requested by @${current_user} on ${new Date().toISOString().split('T')[0]}_`
    </action>

    <action>Call: mcp__github__issue_write({
      method: 'create',
      owner: "{{github_owner}}",
      repo: "{{github_repo}}",
      title: "Sign-off: {{title}} v{{version}}",
      body: issue_body,
      labels: [review_label, doc_label, `version:${version}`, 'review-status:signoff'],
      assignees: stakeholders
    })</action>

    <action>review_issue = response</action>
  </check>

  <substep n="4a" title="Update review issue to signoff status">
    <action>
      // Get current labels and update status
      current_labels = review_issue.labels.map(l => l.name)
      new_labels = current_labels
        .filter(l => !l.startsWith('review-status:'))
        .concat(['review-status:signoff'])
    </action>

    <action>Call: mcp__github__issue_write({
      method: 'update',
      owner: "{{github_owner}}",
      repo: "{{github_repo}}",
      issue_number: review_issue.number,
      labels: new_labels
    })</action>
  </substep>
</step>

<step n="5" goal="Post Sign-off Request Comment">
  <action>
    // Format configuration for display
    config_display = ''
    if (signoff_config.threshold_type === 'count') {
      config_display = `${signoff_config.minimum_approvals} approval(s) required`
    } else if (signoff_config.threshold_type === 'percentage') {
      config_display = `${signoff_config.approval_percentage}% must approve`
    } else {
      config_display = `Required: ${signoff_config.required.map(r => '@' + r).join(', ')}; Optional: ${signoff_config.minimum_optional} of ${signoff_config.optional.length}`
    }

    signoff_comment = `## ✍️ Sign-off Requested

${stakeholders.map(s => '@' + s).join(' ')}

**Version:** v${version}
**Deadline:** ${deadline_str}
**Threshold:** ${config_display}

---

### How to Sign Off

Reply to this issue with one of the following:

- ✅ **Approve**: \`/signoff approve\` - Sign off without concerns
- ✅📝 **Approve with Note**: \`/signoff approve-note: [your note]\` - Sign off with a minor note
- 🚫 **Block**: \`/signoff block: [reason]\` - Cannot approve, has blocking concern

---

### Sign-off Status

${stakeholders.map(s => `- [ ] @${s} - ⏳ Pending`).join('\n')}

---

_Please review the document and provide your sign-off decision by ${deadline_str}._`
  </action>

  <action>Call: mcp__github__add_issue_comment({
    owner: "{{github_owner}}",
    repo: "{{github_repo}}",
    issue_number: review_issue.number,
    body: signoff_comment
  })</action>

  <output>
✅ Sign-off request posted to #{{review_issue.number}}
  </output>
</step>

<step n="6" goal="Update Document Status">
  <action>
    updated_content = doc_content
      .replace(/\*\*Status:\*\* .+/, '**Status:** Sign-off')
      .replace(/\| Sign-off Deadline \| .+ \|/, `| Sign-off Deadline | ${deadline_str} |`)
  </action>

  <action>Write updated_content to doc_path</action>

  <output>
✅ Document status updated to 'Sign-off'
  </output>
</step>

<step n="7" goal="Summary">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SIGN-OFF REQUESTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Document:** {{title}} v{{version}}
**Review Issue:** #{{review_issue.number}}
**Deadline:** {{deadline_str}}
**Stakeholders:** {{stakeholders.length}}

**Sign-off Configuration:**
{{config_display}}

---

All stakeholders have been notified via GitHub @mentions.
Monitor progress with: "View sign-off status for {{doc_label}}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>

## Helper Functions

```javascript
function extract_title(content) {
  const match = content.match(/^#\s+(PRD|Epic):\s*(.+)$/m);
  return match ? match[2].trim() : 'Untitled';
}

function extract_version(content) {
  const match = content.match(/\*\*Version:\*\*\s*(\d+)/);
  return match ? match[1] : '1';
}

function extract_stakeholders(content) {
  const field = content.match(/\|\s*Stakeholders\s*\|\s*(.+?)\s*\|/);
  if (!field) return [];

  return field[1]
    .split(/[,\s]+/)
    .filter(s => s.startsWith('@'))
    .map(s => s.replace('@', ''));
}
```

## Natural Language Triggers

This workflow responds to:
- "Request sign-off for [document]"
- "Start sign-off round"
- "Get approval on PRD"
- Menu trigger: `RS`
