# Submit Feedback - Structured Stakeholder Input

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 SUBMIT FEEDBACK
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
    <output>
Which document are you providing feedback on?

Enter the key (e.g., "user-auth" for PRD, "2" for Epic):
    </output>
    <ask>Document key:</ask>
    <action>document_key = response</action>
  </check>

  <substep n="1a" title="Auto-detect document type">
    <check if="document_type is empty">
      <action>
        // Try to find document
        prd_path = `${docs_dir}/prd/${document_key}.md`
        epic_path = `${docs_dir}/epics/epic-${document_key}.md`

        if (file_exists(prd_path)) {
          document_type = 'prd'
          doc_path = prd_path
        } else if (file_exists(epic_path)) {
          document_type = 'epic'
          doc_path = epic_path
        } else {
          // Ask user
          prompt_for_type = true
        }
      </action>

      <check if="prompt_for_type">
        <ask>Is this a [P]RD or [E]pic?</ask>
        <action>document_type = (response.toLowerCase().startsWith('p')) ? 'prd' : 'epic'</action>
      </check>
    </check>
  </substep>

  <substep n="1b" title="Set type-specific variables">
    <action>
      if (document_type === 'prd') {
        doc_path = `${docs_dir}/prd/${document_key}.md`
        doc_prefix = 'PRD'
        doc_label = `prd:${document_key}`
        review_label = 'type:prd-review'
        feedback_label = 'type:prd-feedback'
      } else {
        doc_path = `${docs_dir}/epics/epic-${document_key}.md`
        doc_prefix = 'Epic'
        doc_label = `epic:${document_key}`
        review_label = 'type:epic-review'
        feedback_label = 'type:epic-feedback'
      }
    </action>
  </substep>

  <substep n="1c" title="Find active review issue">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:{{review_label}} label:{{doc_label}} label:review-status:open is:open"
    })</action>

    <check if="response.items.length == 0">
      <output>
⚠️ No active feedback round found for {{doc_label}}

The document may be:
- Still in draft (not yet open for feedback)
- Already past the feedback stage

Would you like to:
[1] Submit feedback anyway (will be orphaned)
[2] View document
[3] Cancel
      </output>
      <ask>Choice:</ask>
      <check if="choice == 2">
        <action>Read and display doc_path</action>
        <action>Goto step 1c</action>
      </check>
      <check if="choice == 3">
        <action>HALT</action>
      </check>
      <action>review_issue_number = null</action>
    </check>

    <check if="response.items.length > 0">
      <action>review_issue = response.items[0]</action>
      <action>review_issue_number = review_issue.number</action>
      <output>
📋 Found active review: #{{review_issue_number}}
   {{review_issue.title}}
      </output>
    </check>
  </substep>
</step>

<step n="2" goal="Load Document and Show Sections">
  <action>Read doc_path</action>
  <action>doc_content = file_content</action>

  <action>
    // Extract sections for selection
    sections = extract_sections(doc_content)
  </action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 DOCUMENT SECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select the section your feedback relates to:

{{#each sections as |section index|}}
[{{add index 1}}] {{section}}
{{/each}}
[0] General / Overall document

  </output>

  <ask>Section number:</ask>
  <action>
    section_idx = parseInt(response)
    if (section_idx === 0) {
      selected_section = 'General'
    } else {
      selected_section = sections[section_idx - 1] || 'General'
    }
  </action>
</step>

<step n="3" goal="Choose Feedback Type">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏷️ FEEDBACK TYPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What type of feedback is this?

[1] 📋 Clarification - Something is unclear or needs more detail
[2] ⚠️ Concern - Potential issue, risk, or problem
[3] 💡 Suggestion - Improvement idea or alternative approach
[4] ➕ Addition - Missing requirement or feature
[5] 🔢 Priority - Disagree with prioritization or ordering
  </output>

  <check if="document_type == 'epic'">
    <output>
[6] 📐 Scope - Epic scope is too large or should be split
[7] 🔗 Dependency - Dependency or blocking relationship
[8] 🔧 Technical Risk - Technical or architectural concern
[9] ✂️ Story Split - Suggest different story breakdown
    </output>
  </check>

  <ask>Feedback type (number):</ask>
  <action>
    type_map = {
      '1': { key: 'clarification', emoji: '📋', label: 'feedback-type:clarification' },
      '2': { key: 'concern', emoji: '⚠️', label: 'feedback-type:concern' },
      '3': { key: 'suggestion', emoji: '💡', label: 'feedback-type:suggestion' },
      '4': { key: 'addition', emoji: '➕', label: 'feedback-type:addition' },
      '5': { key: 'priority', emoji: '🔢', label: 'feedback-type:priority' },
      '6': { key: 'scope', emoji: '📐', label: 'feedback-type:scope' },
      '7': { key: 'dependency', emoji: '🔗', label: 'feedback-type:dependency' },
      '8': { key: 'technical_risk', emoji: '🔧', label: 'feedback-type:technical-risk' },
      '9': { key: 'story_split', emoji: '✂️', label: 'feedback-type:story-split' }
    }
    feedback_type = type_map[response] || type_map['3']
  </action>
</step>

<step n="4" goal="Set Priority">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PRIORITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

How important is addressing this feedback?

[1] 🔴 High - Critical, blocks progress or has significant impact
[2] 🟡 Medium - Important but not blocking
[3] 🟢 Low - Nice to have, minor improvement

  </output>

  <ask>Priority (1-3, default 2):</ask>
  <action>
    priority_map = {
      '1': { key: 'high', label: 'priority:high' },
      '2': { key: 'medium', label: 'priority:medium' },
      '3': { key: 'low', label: 'priority:low' }
    }
    priority = priority_map[response] || priority_map['2']
  </action>
</step>

<step n="5" goal="Gather Feedback Content">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 YOUR FEEDBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <ask>Brief title for your feedback (one line):</ask>
  <action>feedback_title = response</action>

  <ask>Detailed feedback (describe your concern, question, or suggestion):</ask>
  <action>feedback_content = response</action>

  <output>
Would you like to suggest a specific change? (optional)
  </output>
  <ask>Suggested change (or press Enter to skip):</ask>
  <action>suggested_change = response || null</action>

  <output>
Any additional context or rationale? (optional)
  </output>
  <ask>Rationale (or press Enter to skip):</ask>
  <action>rationale = response || null</action>
</step>

<step n="6" goal="Create Feedback Issue">
  <action>
    // Build issue body
    issue_body = `# ${feedback_type.emoji} Feedback: ${feedback_type.key.charAt(0).toUpperCase() + feedback_type.key.slice(1)}

**Review:** ${review_issue_number ? '#' + review_issue_number : 'N/A'}
**Document:** \`${doc_label}\`
**Section:** ${selected_section}
**Type:** ${feedback_type.key}
**Priority:** ${priority.key}

---

## Feedback

${feedback_content}
`

    if (suggested_change) {
      issue_body += `
## Suggested Change

${suggested_change}
`
    }

    if (rationale) {
      issue_body += `
## Context/Rationale

${rationale}
`
    }

    issue_body += `
---

_Submitted by @${current_user} on ${new Date().toISOString().split('T')[0]}_
`

    // Build labels
    labels = [
      feedback_label,
      doc_label,
      `feedback-section:${selected_section.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`,
      feedback_type.label,
      'feedback-status:new',
      priority.label
    ]

    if (review_issue_number) {
      labels.push(`linked-review:${review_issue_number}`)
    }
  </action>

  <action>Call: mcp__github__issue_write({
    method: 'create',
    owner: "{{github_owner}}",
    repo: "{{github_repo}}",
    title: "{{feedback_type.emoji}} Feedback: {{feedback_title}}",
    body: issue_body,
    labels: labels
  })</action>

  <action>feedback_issue = response</action>

  <output>
✅ Feedback submitted: #{{feedback_issue.number}}
   {{feedback_issue.html_url}}
  </output>
</step>

<step n="7" goal="Link to Review Issue">
  <check if="review_issue_number">
    <action>
      link_comment = `${feedback_type.emoji} **New Feedback** from @${current_user}

**${feedback_title}** → #${feedback_issue.number}
Type: ${feedback_type.key} | Priority: ${priority.key} | Section: ${selected_section}`
    </action>

    <action>Call: mcp__github__add_issue_comment({
      owner: "{{github_owner}}",
      repo: "{{github_repo}}",
      issue_number: review_issue_number,
      body: link_comment
    })</action>

    <output>
✅ Feedback linked to review issue #{{review_issue_number}}
    </output>
  </check>
</step>

<step n="8" goal="Next Steps">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ FEEDBACK SUBMITTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Feedback:** {{feedback_title}}
**Issue:** #{{feedback_issue.number}}
**Type:** {{feedback_type.emoji}} {{feedback_type.key}}
**Section:** {{selected_section}}
**Priority:** {{priority.key}}

Your feedback has been recorded and the PO will be notified.

---

**Would you like to:**
[1] Submit more feedback on this document
[2] View all feedback for this document
[3] Return to My Tasks
[4] Done

  </output>

  <ask>Choice:</ask>

  <check if="choice == 1">
    <action>Goto step 2 (submit more feedback)</action>
  </check>

  <check if="choice == 2">
    <action>Load workflow: view-feedback with document_key, document_type</action>
  </check>

  <check if="choice == 3">
    <action>Load workflow: my-tasks</action>
  </check>

  <check if="choice == 4">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thank you for your feedback! 🙏
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
    <action>Exit</action>
  </check>
</step>

</workflow>

## Helper Functions

```javascript
// Extract section headers from document
function extract_sections(content) {
  const sections = [];
  const lines = content.split('\n');

  for (const line of lines) {
    // Match ## headers but not metadata sections
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const section = match[1].trim();
      // Skip metadata-like sections
      if (!['Metadata', 'Version History', 'Sign-off Status'].includes(section)) {
        sections.push(section);
      }
    }

    // Also capture ### subsections for detailed feedback
    const subMatch = line.match(/^###\s+(FR\d+|NFR\d+|US\d+):\s*(.+)$/);
    if (subMatch) {
      sections.push(`${subMatch[1]}: ${subMatch[2].slice(0, 40)}`);
    }
  }

  return sections;
}

// Check if file exists
function file_exists(path) {
  // Implemented by runtime
  return true;
}
```

## Natural Language Triggers

This workflow responds to:
- "Submit feedback on [document]"
- "I have feedback for the auth PRD"
- "Give feedback on epic 2"
- "Provide input on [document]"
- Menu trigger: `SF`
