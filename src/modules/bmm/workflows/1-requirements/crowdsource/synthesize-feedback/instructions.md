# Synthesize Feedback - LLM-Powered Conflict Resolution

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 SYNTHESIZE FEEDBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This workflow will:
1. Analyze all feedback for the document
2. Identify conflicts and themes
3. Generate proposed changes with rationale
4. Allow you to accept/modify/reject each change
5. Update the document with a new version

  </output>

  <action>Call: mcp__github__get_me()</action>
  <action>current_user = response.login</action>

  <check if="API call fails">
    <output>❌ GitHub MCP not accessible</output>
    <action>HALT</action>
  </check>
</step>

<step n="1" goal="Identify Document and Load Content">
  <check if="document_key is empty">
    <ask>Which document? Enter key:</ask>
    <action>document_key = response</action>
  </check>

  <action>
    if (document_type === 'prd') {
      doc_path = `${docs_dir}/prd/${document_key}.md`
      doc_label = `prd:${document_key}`
      feedback_label = 'type:prd-feedback'
    } else {
      doc_path = `${docs_dir}/epics/epic-${document_key}.md`
      doc_label = `epic:${document_key}`
      feedback_label = 'type:epic-feedback'
    }
  </action>

  <action>Read doc_path</action>
  <check if="file not found">
    <output>❌ Document not found: {{doc_path}}</output>
    <action>HALT</action>
  </check>
  <action>original_content = file_content</action>
  <action>current_version = extract_version(original_content)</action>

  <output>
📄 Loaded: {{doc_label}} v{{current_version}}
  </output>
</step>

<step n="2" goal="Fetch All New Feedback">
  <action>Call: mcp__github__search_issues({
    query: "repo:{{github_owner}}/{{github_repo}} label:{{feedback_label}} label:{{doc_label}} label:feedback-status:new is:open"
  })</action>

  <action>feedback_issues = response.items || []</action>

  <check if="feedback_issues.length == 0">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ NO NEW FEEDBACK TO PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All feedback has already been processed (reviewed, incorporated, or deferred).

Would you like to:
[1] Re-process already-reviewed feedback
[2] View feedback history
[3] Return to dashboard
    </output>
    <ask>Choice:</ask>
    <check if="choice == 1">
      <action>Call: mcp__github__search_issues({
        query: "repo:{{github_owner}}/{{github_repo}} label:{{feedback_label}} label:{{doc_label}} is:open"
      })</action>
      <action>feedback_issues = response.items || []</action>
    </check>
    <check if="choice == 2">
      <action>Load workflow: view-feedback with document_key, document_type</action>
    </check>
    <check if="choice == 3">
      <action>HALT</action>
    </check>
  </check>

  <output>
📋 Found {{feedback_issues.length}} feedback items to process
  </output>
</step>

<step n="3" goal="Parse and Analyze Feedback">
  <action>
    // Parse all feedback into structured format
    all_feedback = []
    by_section = {}

    for (issue of feedback_issues) {
      const labels = issue.labels.map(l => l.name)

      const fb = {
        id: issue.number,
        title: issue.title.replace(/^[^\s]+\s+Feedback:\s*/, ''),
        section: extract_label(labels, 'feedback-section:') || 'General',
        type: extract_label(labels, 'feedback-type:') || 'suggestion',
        priority: extract_label(labels, 'priority:') || 'medium',
        submittedBy: issue.user?.login,
        body: issue.body,
        suggestedChange: extract_suggested_change(issue.body)
      }

      all_feedback.push(fb)

      if (!by_section[fb.section]) by_section[fb.section] = []
      by_section[fb.section].push(fb)
    }

    sections_with_feedback = Object.keys(by_section)
  </action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 FEEDBACK ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Sections with Feedback:** {{sections_with_feedback.length}}
{{#each by_section as |items section|}}
  • {{section}}: {{items.length}} item(s)
{{/each}}

Processing each section...
  </output>
</step>

<step n="4" goal="Process Each Section">
  <action>proposed_changes = []</action>
  <action>section_index = 0</action>

  <loop for="section of sections_with_feedback">
    <action>section_index++</action>
    <action>section_feedback = by_section[section]</action>

    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 SECTION {{section_index}}/{{sections_with_feedback.length}}: {{section}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Feedback Items:** {{section_feedback.length}}

{{#each section_feedback}}
┌─ #{{id}}: {{title}}
│  Type: {{type}} | Priority: {{priority}} | By: @{{submittedBy}}
{{#if suggestedChange}}
│  💡 Suggests: {{suggestedChange}}
{{/if}}
└────────────────────────────────────
{{/each}}
    </output>

    <substep n="4a" title="Extract original section text">
      <action>
        original_section_text = extract_section(original_content, section)
      </action>
    </substep>

    <substep n="4b" title="Check for conflicts">
      <action>
        has_conflict = section_feedback.length >= 2 &&
          section_feedback.some(f => f.type === 'concern') &&
          section_feedback.some(f => f.type === 'suggestion' || f.type === 'concern')
      </action>
    </substep>

    <check if="has_conflict">
      <output>
⚠️ CONFLICT DETECTED - Multiple stakeholders have different views

Generating resolution proposal...
      </output>

      <action>
        // Build conflict resolution prompt
        conflict_prompt = `You are helping resolve conflicting stakeholder feedback on a ${document_type.toUpperCase()}.

SECTION: ${section}

ORIGINAL TEXT:
${original_section_text || '[Section not found in document]'}

CONFLICTING FEEDBACK:
${section_feedback.map(f => `
- @${f.submittedBy} (${f.type}, ${f.priority}): "${f.title}"
  ${f.suggestedChange ? 'Suggests: ' + f.suggestedChange : ''}
`).join('\n')}

Propose a resolution that:
1. Addresses the core concerns of all parties
2. Maintains document coherence
3. Is actionable and specific

Respond with:
1. PROPOSED_TEXT: The updated section text
2. RATIONALE: Why this resolution works (2-3 sentences)
3. TRADE_OFFS: What compromises were made
4. CONFIDENCE: high/medium/low`
      </action>

      <output>
**Original Text:**
{{original_section_text || '[Section not found]'}}

---

**🤖 AI-Proposed Resolution:**

{{LLM processes conflict_prompt and generates resolution}}

      </output>
    </check>

    <check if="!has_conflict">
      <action>
        // Non-conflicting feedback - straightforward merge
        merge_prompt = `Incorporate the following feedback into this ${document_type.toUpperCase()} section:

SECTION: ${section}

ORIGINAL TEXT:
${original_section_text || '[Section not found]'}

FEEDBACK TO INCORPORATE:
${section_feedback.map(f => `
- ${f.type}: ${f.title}
  ${f.suggestedChange ? 'Suggested change: ' + f.suggestedChange : 'Address this concern'}
`).join('\n')}

Generate updated section text that:
1. Addresses all feedback points
2. Maintains consistent tone and format
3. Is clear and actionable

Return the complete updated section text.`
      </action>

      <output>
**Original Text:**
{{original_section_text || '[Section not found]'}}

---

**🤖 AI-Proposed Update:**

{{LLM processes merge_prompt and generates updated text}}

      </output>
    </check>

    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to do with this proposed change?

[A] Accept as proposed
[M] Modify (I'll provide my version)
[R] Reject (keep original)
[S] Skip for now

    </output>

    <ask>Decision for {{section}}:</ask>

    <check if="choice == 'A'">
      <action>
        proposed_changes.push({
          section: section,
          decision: 'accept',
          newText: proposed_text,
          feedbackIds: section_feedback.map(f => f.id)
        })
      </action>
      <output>✅ Accepted</output>
    </check>

    <check if="choice == 'M'">
      <ask>Enter your modified text for this section:</ask>
      <action>
        proposed_changes.push({
          section: section,
          decision: 'modified',
          newText: response,
          feedbackIds: section_feedback.map(f => f.id)
        })
      </action>
      <output>✅ Modified version saved</output>
    </check>

    <check if="choice == 'R'">
      <action>
        proposed_changes.push({
          section: section,
          decision: 'reject',
          newText: null,
          feedbackIds: section_feedback.map(f => f.id)
        })
      </action>
      <output>❌ Rejected - keeping original</output>
    </check>

    <check if="choice == 'S'">
      <output>⏭️ Skipped</output>
    </check>
  </loop>
</step>

<step n="5" goal="Review All Changes">
  <action>
    accepted_changes = proposed_changes.filter(c => c.decision === 'accept' || c.decision === 'modified')
    rejected_changes = proposed_changes.filter(c => c.decision === 'reject')
  </action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 SYNTHESIS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Accepted Changes:** {{accepted_changes.length}}
{{#each accepted_changes}}
  ✅ {{section}} ({{decision}})
{{/each}}

**Rejected Changes:** {{rejected_changes.length}}
{{#each rejected_changes}}
  ❌ {{section}}
{{/each}}

---

  </output>

  <check if="accepted_changes.length == 0">
    <output>
No changes to apply. Workflow complete.
    </output>
    <action>HALT</action>
  </check>

  <ask>Apply these changes to the document? (y/n):</ask>

  <check if="response != 'y'">
    <output>
Changes not applied. You can re-run synthesis later.
    </output>
    <action>HALT</action>
  </check>
</step>

<step n="6" goal="Apply Changes to Document">
  <action>
    new_version = parseInt(current_version) + 1
    updated_content = original_content

    // Apply each accepted change
    for (change of accepted_changes) {
      if (change.newText) {
        updated_content = replace_section(updated_content, change.section, change.newText)
      }
    }

    // Update version and timestamp
    updated_content = updated_content
      .replace(/\*\*Version:\*\* \d+/, `**Version:** ${new_version}`)
      .replace(/\*\*Last Updated:\*\* .+/, `**Last Updated:** ${new Date().toISOString().split('T')[0]}`)
      .replace(/\*\*Status:\*\* .+/, '**Status:** Draft')

    // Add version history entry
    version_entry = `| ${new_version} | ${new Date().toISOString().split('T')[0]} | Synthesized feedback from ${all_feedback.length} items | ${accepted_changes.map(c => c.section).join(', ')} |`
    updated_content = updated_content.replace(
      /(## Version History\n\n\|[^\n]+\|\n\|[^\n]+\|)/,
      `$1\n${version_entry}`
    )
  </action>

  <action>Write updated_content to doc_path</action>

  <output>
✅ Document updated to v{{new_version}}
  </output>
</step>

<step n="7" goal="Update Feedback Status">
  <output>
Updating feedback issue statuses...
  </output>

  <action>
    // Mark accepted feedback as incorporated
    for (change of accepted_changes) {
      for (id of change.feedbackIds) {
        await update_feedback_status(id, 'incorporated')
      }
    }

    // Mark rejected feedback as reviewed
    for (change of rejected_changes) {
      for (id of change.feedbackIds) {
        await update_feedback_status(id, 'reviewed')
      }
    }
  </action>

  <output>
✅ {{accepted_changes.flatMap(c => c.feedbackIds).length}} feedback items marked as incorporated
✅ {{rejected_changes.flatMap(c => c.feedbackIds).length}} feedback items marked as reviewed
  </output>
</step>

<step n="8" goal="Update Review Issue">
  <action>Call: mcp__github__search_issues({
    query: "repo:{{github_owner}}/{{github_repo}} label:type:{{document_type}}-review label:{{doc_label}} is:open"
  })</action>

  <check if="response.items.length > 0">
    <action>review_issue = response.items[0]</action>

    <action>
      synthesis_comment = `## 🔄 Synthesis Complete

**New Version:** v${new_version}
**Feedback Processed:** ${all_feedback.length} items
**Changes Applied:** ${accepted_changes.length} sections

## Summary of Changes

${accepted_changes.map(c => `- ✅ **${c.section}**: Updated based on ${c.feedbackIds.length} feedback item(s)`).join('\n')}

${rejected_changes.length > 0 ? `
## Feedback Not Incorporated

${rejected_changes.map(c => `- ❌ **${c.section}**: Kept original`).join('\n')}
` : ''}

---

The document has been updated. Review the changes and proceed to sign-off when ready.

_Synthesis performed by @${current_user} on ${new Date().toISOString().split('T')[0]}_`
    </action>

    <action>Call: mcp__github__add_issue_comment({
      owner: "{{github_owner}}",
      repo: "{{github_repo}}",
      issue_number: review_issue.number,
      body: synthesis_comment
    })</action>
  </check>
</step>

<step n="9" goal="Next Steps">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SYNTHESIS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Document:** {{doc_label}}
**New Version:** v{{new_version}}
**Changes Applied:** {{accepted_changes.length}} sections
**Feedback Processed:** {{all_feedback.length}} items

---

**Next Steps:**
[1] Request sign-off from stakeholders
[2] Open another feedback round (for major changes)
[3] View updated document
[4] Done

  </output>

  <ask>Choice:</ask>

  <check if="choice == 1">
    <action>Load workflow: request-signoff with document_key, document_type</action>
  </check>

  <check if="choice == 2">
    <action>Load workflow: open-feedback-round with document_key, document_type</action>
  </check>

  <check if="choice == 3">
    <action>Read and display doc_path</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Synthesis workflow complete.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>

## Helper Functions

```javascript
// Extract version from document
function extract_version(content) {
  const match = content.match(/\*\*Version:\*\*\s*(\d+)/);
  return match ? match[1] : '1';
}

// Extract label value by prefix
function extract_label(labels, prefix) {
  for (const label of labels) {
    if (label.startsWith(prefix)) {
      return label.replace(prefix, '');
    }
  }
  return null;
}

// Extract suggested change from issue body
function extract_suggested_change(body) {
  if (!body) return null;
  const match = body.match(/## Suggested Change\n\n([\s\S]*?)(?:\n##|$)/);
  return match ? match[1].trim().slice(0, 150) : null;
}

// Extract section content from document
function extract_section(content, sectionName) {
  // Normalize section name for matching
  const normalized = sectionName.toLowerCase().replace(/-/g, ' ');

  // Try to find the section
  const regex = new RegExp(`^##\\s+${normalized}\\s*$`, 'im');
  const match = content.match(regex);

  if (!match) return null;

  const startIdx = match.index + match[0].length;
  const nextSection = content.indexOf('\n## ', startIdx);
  const endIdx = nextSection > -1 ? nextSection : content.length;

  return content.slice(startIdx, endIdx).trim();
}

// Replace section content in document
function replace_section(content, sectionName, newText) {
  const normalized = sectionName.toLowerCase().replace(/-/g, ' ');
  const regex = new RegExp(`(^##\\s+${normalized}\\s*$)([\\s\\S]*?)(?=\\n## |$)`, 'im');

  return content.replace(regex, `$1\n\n${newText}\n\n`);
}

// Update feedback status via GitHub
async function update_feedback_status(issueNumber, newStatus) {
  // Get current labels
  const issue = await mcp__github__issue_read({
    method: 'get',
    owner: github_owner,
    repo: github_repo,
    issue_number: issueNumber
  });

  const labels = issue.labels
    .map(l => l.name)
    .filter(l => !l.startsWith('feedback-status:'));

  labels.push(`feedback-status:${newStatus}`);

  await mcp__github__issue_write({
    method: 'update',
    owner: github_owner,
    repo: github_repo,
    issue_number: issueNumber,
    labels: labels
  });

  // Close if incorporated or deferred
  if (newStatus === 'incorporated' || newStatus === 'deferred') {
    await mcp__github__issue_write({
      method: 'update',
      owner: github_owner,
      repo: github_repo,
      issue_number: issueNumber,
      state: 'closed',
      state_reason: newStatus === 'incorporated' ? 'completed' : 'not_planned'
    });
  }
}
```

## Natural Language Triggers

This workflow responds to:
- "Synthesize feedback for [document]"
- "Process feedback on PRD"
- "Incorporate feedback into [document]"
- "Merge feedback"
- Menu trigger: `SZ`
