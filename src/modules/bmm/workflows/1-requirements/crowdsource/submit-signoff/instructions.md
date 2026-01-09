# Submit Sign-off - Record Your Approval Decision

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✍️ SUBMIT SIGN-OFF
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
    <ask>Which document are you signing off on? Enter key:</ask>
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

  <substep n="1a" title="Find review issue">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:{{review_label}} label:{{doc_label}} label:review-status:signoff is:open"
    })</action>

    <check if="response.items.length == 0">
      <output>
❌ No active sign-off request found for {{doc_label}}

The document may be:
- Still in feedback stage
- Already approved
- Not yet created

Use [MT] My Tasks to see what's pending for you.
      </output>
      <action>HALT</action>
    </check>

    <action>review_issue = response.items[0]</action>
    <output>
📋 Found sign-off request: #{{review_issue.number}}
   {{review_issue.title}}
    </output>
  </substep>

  <substep n="1b" title="Load document">
    <action>Read doc_path</action>
    <check if="file not found">
      <output>❌ Document not found: {{doc_path}}</output>
      <action>HALT</action>
    </check>
    <action>doc_content = file_content</action>
    <action>
      title = extract_title(doc_content)
      version = extract_version(doc_content)
    </action>
  </substep>
</step>

<step n="2" goal="Check Existing Sign-off">
  <action>
    // Check if user already signed off
    signoff_label_prefix = `signoff-${current_user}-`
    existing_signoff = review_issue.labels.some(l =>
      l.name.startsWith(signoff_label_prefix)
    )
  </action>

  <check if="existing_signoff">
    <output>
⚠️ You have already submitted a sign-off decision for this document.

Would you like to:
[1] Change your decision
[2] View current status
[3] Cancel
    </output>
    <ask>Choice:</ask>
    <check if="choice == 2 OR choice == 3">
      <action>HALT</action>
    </check>
    <output>
Proceeding to update your sign-off decision...
    </output>
  </check>
</step>

<step n="3" goal="Show Document Summary">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 DOCUMENT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Title:** {{title}}
**Version:** v{{version}}
**Key:** {{doc_label}}

Would you like to view the full document before deciding?
  </output>

  <ask>View document? (y/n):</ask>
  <check if="response == 'y'">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 DOCUMENT CONTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{doc_content}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
  </check>
</step>

<step n="4" goal="Get Sign-off Decision">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗳️ YOUR DECISION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please select your sign-off decision:

[1] ✅ APPROVE - I approve this document
[2] ✅📝 APPROVE WITH NOTE - I approve with a minor note/observation
[3] 🚫 BLOCK - I cannot approve, there is a blocking issue

  </output>

  <ask>Decision (1-3):</ask>
  <action>
    decision_map = {
      '1': { key: 'approved', emoji: '✅', text: 'Approved' },
      '2': { key: 'approved_with_note', emoji: '✅📝', text: 'Approved with Note' },
      '3': { key: 'blocked', emoji: '🚫', text: 'Blocked' }
    }
    decision = decision_map[response] || decision_map['1']
  </action>
</step>

<step n="5" goal="Get Note or Reason">
  <check if="decision.key == 'approved_with_note'">
    <ask>Enter your note (this will be visible to all stakeholders):</ask>
    <action>note = response</action>
  </check>

  <check if="decision.key == 'blocked'">
    <output>
⚠️ Blocking a document requires a clear reason.

This will:
1. Prevent the document from being approved
2. Notify the PO and stakeholders
3. May trigger a new feedback round

    </output>
    <ask>Enter your blocking reason:</ask>
    <action>note = response</action>

    <output>
Would you like to create a formal feedback issue for this blocking concern?
    </output>
    <ask>Create feedback issue? (y/n):</ask>
    <check if="response == 'y'">
      <action>create_feedback_issue = true</action>
    </check>
  </check>

  <check if="decision.key == 'approved'">
    <action>note = null</action>
  </check>
</step>

<step n="6" goal="Submit Sign-off">
  <action>
    // Build sign-off comment
    signoff_comment = `### ${decision.emoji} Sign-off from @${current_user}

**Decision:** ${decision.text}
**Date:** ${new Date().toISOString().split('T')[0]}`

    if (note) {
      signoff_comment += `

**Note:**
${note}`
    }
  </action>

  <action>Call: mcp__github__add_issue_comment({
    owner: "{{github_owner}}",
    repo: "{{github_repo}}",
    issue_number: review_issue.number,
    body: signoff_comment
  })</action>

  <substep n="6a" title="Add sign-off label">
    <action>
      // Get current labels
      current_labels = review_issue.labels.map(l => l.name)

      // Remove any existing signoff label for this user
      new_labels = current_labels.filter(l =>
        !l.startsWith(`signoff-${current_user}-`)
      )

      // Add new signoff label
      decision_label = decision.key.replace(/_/g, '-')
      new_labels.push(`signoff-${current_user}-${decision_label}`)
    </action>

    <action>Call: mcp__github__issue_write({
      method: 'update',
      owner: "{{github_owner}}",
      repo: "{{github_repo}}",
      issue_number: review_issue.number,
      labels: new_labels
    })</action>
  </substep>

  <check if="create_feedback_issue">
    <action>
      feedback_body = `# 🚫 Blocking Concern

**Document:** \`${doc_label}\`
**Review:** #${review_issue.number}
**Type:** Blocking concern requiring resolution

---

## Concern

${note}

---

_Submitted by @${current_user} as part of sign-off for v${version}_`
    </action>

    <action>Call: mcp__github__issue_write({
      method: 'create',
      owner: "{{github_owner}}",
      repo: "{{github_repo}}",
      title: "🚫 Blocking: {{title}}",
      body: feedback_body,
      labels: ['type:{{document_type}}-feedback', doc_label, 'feedback-type:concern', 'priority:high', 'feedback-status:new', `linked-review:${review_issue.number}`]
    })</action>

    <output>
✅ Created feedback issue: #{{response.number}}
    </output>
  </check>

  <output>
✅ Sign-off submitted: {{decision.emoji}} {{decision.text}}
  </output>
</step>

<step n="7" goal="Check Approval Status">
  <output>
Checking if all required sign-offs are complete...
  </output>

  <action>
    // Refresh issue to get updated labels
    Call: mcp__github__issue_read({
      method: 'get',
      owner: github_owner,
      repo: github_repo,
      issue_number: review_issue.number
    })
  </action>

  <action>
    // Count sign-offs
    labels = response.labels.map(l => l.name)
    approved_count = labels.filter(l =>
      l.includes('-approved') || l.includes('-approved-with-note')
    ).length
    blocked_count = labels.filter(l => l.includes('-blocked')).length

    // Get stakeholder count from document
    stakeholder_count = extract_stakeholders(doc_content).length
  </action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SIGN-OFF STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Approved:** {{approved_count}} / {{stakeholder_count}}
**Blocked:** {{blocked_count}}
**Pending:** {{stakeholder_count - approved_count - blocked_count}}

  </output>

  <check if="blocked_count > 0">
    <output>
⚠️ Document has {{blocked_count}} blocking concern(s).
   Cannot be approved until resolved.
    </output>
  </check>

  <check if="approved_count == stakeholder_count AND blocked_count == 0">
    <output>
🎉 ALL SIGN-OFFS RECEIVED!

The document is ready to be marked as APPROVED.
    </output>

    <ask>Mark document as approved? (y/n):</ask>
    <check if="response == 'y'">
      <action>
        // Update document status
        updated_content = doc_content.replace(/\*\*Status:\*\* .+/, '**Status:** Approved')
      </action>
      <action>Write updated_content to doc_path</action>

      <action>
        // Update review issue
        final_labels = labels
          .filter(l => !l.startsWith('review-status:'))
          .concat(['review-status:approved'])
      </action>

      <action>Call: mcp__github__issue_write({
        method: 'update',
        owner: "{{github_owner}}",
        repo: "{{github_repo}}",
        issue_number: review_issue.number,
        labels: final_labels,
        state: 'closed',
        state_reason: 'completed'
      })</action>

      <action>Call: mcp__github__add_issue_comment({
        owner: "{{github_owner}}",
        repo: "{{github_repo}}",
        issue_number: review_issue.number,
        body: `## ✅ DOCUMENT APPROVED

All stakeholders have signed off. This document is now approved and ready for implementation.

**Final Version:** v${version}
**Approved:** ${new Date().toISOString().split('T')[0]}
**Approvals:** ${approved_count} / ${stakeholder_count}`
      })</action>

      <output>
✅ Document marked as APPROVED!
   Review issue #{{review_issue.number}} closed.
      </output>
    </check>
  </check>
</step>

<step n="8" goal="Summary">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SIGN-OFF COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your Decision:** {{decision.emoji}} {{decision.text}}
**Document:** {{title}} v{{version}}
**Review Issue:** #{{review_issue.number}}

Thank you for your review! 🙏

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
- "Sign off on [document]"
- "Submit my sign-off"
- "Approve the PRD"
- "I approve [document]"
- Menu trigger: `SO`
