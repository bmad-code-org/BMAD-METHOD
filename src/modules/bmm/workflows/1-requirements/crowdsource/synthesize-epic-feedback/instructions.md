# Synthesize Epic Feedback - LLM-Powered Story Refinement

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 SYNTHESIZE EPIC FEEDBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Call: mcp__github__get_me()</action>
  <action>current_user = response.login</action>

  <check if="API call fails">
    <output>❌ GitHub MCP not accessible</output>
    <action>HALT</action>
  </check>
</step>

<step n="1" goal="Select Epic">
  <check if="epic_key is empty">
    <substep n="1a" title="List epics with feedback">
      <action>Call: mcp__github__search_issues({
        query: "repo:{{github_owner}}/{{github_repo}} label:type:epic-review label:review-status:open is:open"
      })</action>

      <check if="response.items.length == 0">
        <output>
❌ No epics currently collecting feedback.

Use [ED] Epic Dashboard to see all epics.
        </output>
        <action>HALT</action>
      </check>

      <action>
        feedback_epics = response.items.map(issue => {
          const labels = issue.labels.map(l => l.name)
          return {
            key: labels.find(l => l.startsWith('epic:'))?.replace('epic:', ''),
            title: issue.title.replace(/^Epic Review:\s*/, ''),
            source_prd: labels.find(l => l.startsWith('source-prd:'))?.replace('source-prd:', ''),
            issue_number: issue.number
          }
        }).filter(e => e.key)
      </action>

      <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 EPICS WITH ACTIVE FEEDBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each feedback_epics}}
[{{@index + 1}}] epic:{{key}} - {{title}}
    Source: prd:{{source_prd}} | Issue: #{{issue_number}}
{{/each}}

      </output>
    </substep>

    <ask>Select epic to synthesize (1-{{feedback_epics.length}}):</ask>
    <action>epic_key = feedback_epics[parseInt(response) - 1].key</action>
    <action>review_issue_number = feedback_epics[parseInt(response) - 1].issue_number</action>
  </check>
</step>

<step n="2" goal="Load Epic and Feedback">
  <substep n="2a" title="Load epic document">
    <action>epic_path = `${docs_dir}/epics/epic-${epic_key}.md`</action>
    <action>Read epic_path</action>

    <check if="file not found">
      <output>❌ Epic document not found: {{epic_path}}</output>
      <action>HALT</action>
    </check>

    <action>epic_content = file_content</action>
    <action>
      title = extract_title(epic_content)
      version = parseInt(extract_version(epic_content))
      source_prd = extract_source_prd(epic_content)
      current_stories = extract_epic_stories(epic_content)
      dependencies = extract_dependencies(epic_content)
    </action>
  </substep>

  <substep n="2b" title="Fetch feedback issues">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:epic-feedback label:epic:{{epic_key}} label:feedback-status:new"
    })</action>

    <check if="response.items.length == 0">
      <output>
⚠️ No new feedback found for epic:{{epic_key}}

All feedback may have been processed already.
Check the Epic Dashboard [ED] for status.
      </output>

      <ask>Continue anyway to create new version? (y/n):</ask>
      <check if="response != 'y'">
        <action>HALT</action>
      </check>
      <action>feedback_items = []</action>
    </check>

    <check if="response.items.length > 0">
      <action>
        feedback_items = response.items.map(issue => {
          const labels = issue.labels.map(l => l.name)
          return {
            id: issue.number,
            title: issue.title,
            body: issue.body,
            type: labels.find(l => l.startsWith('feedback-type:'))?.replace('feedback-type:', ''),
            section: labels.find(l => l.startsWith('feedback-section:'))?.replace('feedback-section:', ''),
            submittedBy: issue.user?.login,
            created: issue.created_at
          }
        })
      </action>
    </check>
  </substep>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 SYNTHESIS INPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Epic:** epic:{{epic_key}}
**Title:** {{title}}
**Version:** v{{version}}
**Stories:** {{current_stories.length}}
**Feedback Items:** {{feedback_items.length}}

  </output>
</step>

<step n="3" goal="Update Status to Synthesis">
  <action>Call: mcp__github__search_issues({
    query: "repo:{{github_owner}}/{{github_repo}} label:type:epic-review label:epic:{{epic_key}} is:open"
  })</action>

  <action>review_issue = response.items[0]</action>

  <action>
    current_labels = review_issue.labels.map(l => l.name)
    new_labels = current_labels
      .filter(l => !l.startsWith('review-status:'))
      .concat(['review-status:synthesis'])
  </action>

  <action>Call: mcp__github__issue_write({
    method: 'update',
    owner: "{{github_owner}}",
    repo: "{{github_repo}}",
    issue_number: review_issue.number,
    labels: new_labels
  })</action>

  <output>
🔒 Epic locked for synthesis (review-status:synthesis)
  </output>
</step>

<step n="4" goal="Analyze Feedback">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ANALYZING FEEDBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>
    // Group feedback by type
    feedback_by_type = {
      scope: [],
      story_split: [],
      dependency: [],
      priority: [],
      technical_risk: [],
      missing_story: []
    }

    for (item of feedback_items) {
      const type = item.type || 'general'
      if (!feedback_by_type[type]) feedback_by_type[type] = []
      feedback_by_type[type].push(item)
    }

    // Identify story-specific feedback
    story_feedback = {}
    for (item of feedback_items) {
      if (item.section && item.section.startsWith('story')) {
        const story_id = item.section
        if (!story_feedback[story_id]) story_feedback[story_id] = []
        story_feedback[story_id].push(item)
      }
    }
  </action>

  <output>
**Feedback by Type:**
  🔍 Scope: {{feedback_by_type.scope.length}}
  📝 Story Split: {{feedback_by_type.story_split.length}}
  🔗 Dependencies: {{feedback_by_type.dependency.length}}
  ⚡ Priority: {{feedback_by_type.priority.length}}
  ⚠️ Technical Risk: {{feedback_by_type.technical_risk.length}}
  ➕ Missing Stories: {{feedback_by_type.missing_story.length}}

  </output>
</step>

<step n="5" goal="Detect Conflicts">
  <action>
    conflicts = []

    // Check for conflicting scope feedback
    if (feedback_by_type.scope.length > 1) {
      const split_requests = feedback_by_type.scope.filter(f =>
        f.body?.toLowerCase().includes('split') || f.body?.toLowerCase().includes('too large')
      )
      const merge_requests = feedback_by_type.scope.filter(f =>
        f.body?.toLowerCase().includes('merge') || f.body?.toLowerCase().includes('too small')
      )

      if (split_requests.length > 0 && merge_requests.length > 0) {
        conflicts.push({
          type: 'scope_direction',
          description: 'Conflicting feedback on epic size',
          items: [...split_requests, ...merge_requests]
        })
      }
    }

    // Check for conflicting priority feedback
    if (feedback_by_type.priority.length > 1) {
      conflicts.push({
        type: 'priority_order',
        description: 'Multiple priority reordering suggestions',
        items: feedback_by_type.priority
      })
    }

    // Check for conflicting story changes
    for ([story_id, items] of Object.entries(story_feedback)) {
      if (items.length > 1) {
        conflicts.push({
          type: 'story_conflict',
          story: story_id,
          description: `Multiple feedback on ${story_id}`,
          items: items
        })
      }
    }
  </action>

  <check if="conflicts.length > 0">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CONFLICTS DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each conflicts}}
**{{type}}:** {{description}}
{{#each items}}
  • @{{submittedBy}}: "{{title}}"
{{/each}}

{{/each}}

These will be analyzed and resolved by the synthesis engine.
    </output>
  </check>
</step>

<step n="6" goal="Generate Synthesis">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 GENERATING SYNTHESIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Processing {{feedback_items.length}} feedback items...
  </output>

  <action>
    synthesis_prompt = `You are synthesizing stakeholder feedback for an epic. Your goal is to:
1. Incorporate valid feedback into story definitions
2. Resolve conflicts with clear rationale
3. Maintain story independence and testability
4. Ensure technical feasibility

## Epic Context

**Title:** ${title}
**Source PRD:** prd:${source_prd}

## Current Stories

${current_stories.map((s, i) => `### Story ${i + 1}: ${s.title}
${s.description || ''}
**Complexity:** ${s.complexity || 'TBD'}
**Acceptance Criteria:**
${s.acceptance_criteria || 'TBD'}
`).join('\n')}

## Dependencies

${dependencies.join('\n') || 'None specified'}

## Feedback to Process

${feedback_items.map(f => `### Feedback #${f.id} from @${f.submittedBy}
**Type:** ${f.type || 'general'}
**Section:** ${f.section || 'general'}
**Content:**
${f.body}
`).join('\n---\n')}

${conflicts.length > 0 ? `
## Conflicts to Resolve

${conflicts.map(c => `**${c.type}:** ${c.description}
Conflicting feedback:
${c.items.map(i => `- @${i.submittedBy}: ${i.title}`).join('\n')}
`).join('\n')}
` : ''}

## Your Task

Generate an updated epic with:

1. **Story Updates:** For each story, show:
   - Original version
   - Proposed changes
   - Which feedback drove the change
   - Confidence level (high/medium/low)

2. **New Stories:** If missing_story feedback is valid, add new stories

3. **Story Removals/Merges:** If story_split feedback suggests it

4. **Dependency Updates:** Based on dependency feedback

5. **Conflict Resolutions:** For each conflict, explain your resolution and rationale

6. **Deferred Feedback:** Any feedback not incorporated and why

Output format:
---
## Summary
[Brief overview of changes]

## Story Changes
[For each modified story]

## New Stories
[Any new stories added]

## Removed/Merged Stories
[Any stories removed or merged]

## Dependency Updates
[Changes to dependencies]

## Conflict Resolutions
[How conflicts were resolved]

## Deferred Feedback
[Feedback not incorporated and why]
---`

    synthesis_result = await llm_generate(synthesis_prompt)
  </action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 SYNTHESIS RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{synthesis_result}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="7" goal="Review and Approve Changes">
  <output>
**Review the proposed changes above.**

Options:
[1] Accept all changes
[2] Accept with modifications
[3] Reject and keep current version
[4] View detailed diff

  </output>

  <ask>Choice:</ask>

  <check if="response == '3'">
    <output>
Changes rejected. Epic remains at v{{version}}.
    </output>

    <action>
      new_labels = current_labels
        .filter(l => !l.startsWith('review-status:'))
        .concat(['review-status:open'])
    </action>

    <action>Call: mcp__github__issue_write({
      method: 'update',
      owner: "{{github_owner}}",
      repo: "{{github_repo}}",
      issue_number: review_issue.number,
      labels: new_labels
    })</action>

    <action>HALT</action>
  </check>

  <check if="response == '2'">
    <ask>Describe your modifications:</ask>
    <action>
      modification_prompt = `${synthesis_prompt}

Previous synthesis:
${synthesis_result}

User modifications requested:
${response}

Please regenerate the synthesis incorporating these modifications.`

      synthesis_result = await llm_generate(modification_prompt)
    </action>

    <output>
Updated synthesis:

{{synthesis_result}}
    </output>
  </check>

  <check if="response == '4'">
    <action>
      diff_prompt = `Generate a detailed diff showing:
1. Each story's original text vs proposed text
2. New sections added
3. Sections removed
4. Specific line-by-line changes

Current epic content:
${epic_content}

Proposed changes from synthesis:
${synthesis_result}`

      diff_output = await llm_generate(diff_prompt)
    </action>

    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DETAILED DIFF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{diff_output}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <ask>Accept these changes? (y/n):</ask>
    <check if="response != 'y'">
      <action>HALT</action>
    </check>
  </check>
</step>

<step n="8" goal="Generate Updated Epic">
  <action>
    new_version = version + 1

    update_prompt = `Generate the complete updated epic document in markdown format.

Original epic:
${epic_content}

Changes to apply:
${synthesis_result}

Requirements:
1. Increment version to ${new_version}
2. Update "Last Updated" to today's date
3. Keep document structure intact
4. Add entry to Version History table
5. Update Status to "Feedback" (for next round) or "Ready for Sign-off"

Output the complete markdown document.`

    updated_epic = await llm_generate(update_prompt)
  </action>
</step>

<step n="9" goal="Save Updated Epic">
  <action>Write updated_epic to epic_path</action>

  <output>
✅ Epic document updated: {{epic_path}}
   Version: v{{version}} → v{{new_version}}
  </output>
</step>

<step n="10" goal="Update Feedback Issues">
  <action>
    // Mark processed feedback as incorporated
    for (item of feedback_items) {
      Call: mcp__github__issue_write({
        method: 'update',
        owner: github_owner,
        repo: github_repo,
        issue_number: item.id,
        labels: item.labels
          .filter(l => !l.startsWith('feedback-status:'))
          .concat(['feedback-status:incorporated']),
        state: 'closed',
        state_reason: 'completed'
      })
    }
  </action>

  <output>
✅ {{feedback_items.length}} feedback issues marked as incorporated
  </output>
</step>

<step n="11" goal="Update Review Issue">
  <action>
    synthesis_comment = `## 🔄 Synthesis Complete

**Version:** v${version} → v${new_version}
**Feedback Processed:** ${feedback_items.length} items
**Conflicts Resolved:** ${conflicts.length}

---

### Summary of Changes

${synthesis_result.split('## Summary')[1]?.split('##')[0] || 'See updated epic document'}

---

### Feedback Incorporated

${feedback_items.map(f => `- ✅ #${f.id} (@${f.submittedBy}): ${f.title}`).join('\n')}

---

_Synthesized by @${current_user} on ${new Date().toISOString().split('T')[0]}_`
  </action>

  <action>Call: mcp__github__add_issue_comment({
    owner: "{{github_owner}}",
    repo: "{{github_repo}}",
    issue_number: review_issue.number,
    body: synthesis_comment
  })</action>

  <action>
    // Update version label and unlock
    final_labels = new_labels
      .filter(l => !l.startsWith('version:') && !l.startsWith('review-status:'))
      .concat([`version:${new_version}`, 'review-status:open'])
  </action>

  <action>Call: mcp__github__issue_write({
    method: 'update',
    owner: "{{github_owner}}",
    repo: "{{github_repo}}",
    issue_number: review_issue.number,
    labels: final_labels
  })</action>

  <output>
✅ Review issue updated with synthesis summary
  </output>
</step>

<step n="12" goal="Summary">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ EPIC SYNTHESIS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Epic:** epic:{{epic_key}}
**Version:** v{{version}} → v{{new_version}}
**Feedback Processed:** {{feedback_items.length}}
**Conflicts Resolved:** {{conflicts.length}}

**Document:** {{epic_path}}
**Review Issue:** #{{review_issue.number}}

---

**Next Steps:**
- Review the updated epic document
- Open another feedback round if needed
- Or request sign-off when ready

**Quick Actions:**
[OE] Open another feedback round
[RS] Request sign-off
[ED] Epic Dashboard

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

function extract_source_prd(content) {
  const match = content.match(/\*\*Source PRD:\*\*\s*`?prd:([^`\s]+)`?/);
  return match ? match[1] : null;
}

function extract_epic_stories(content) {
  const stories = [];
  const storyRegex = /###\s+Story\s+(\d+):\s*(.+)\n+([\s\S]*?)(?=###\s+Story|---|\n##|$)/gi;
  let match;
  while ((match = storyRegex.exec(content)) !== null) {
    const number = match[1];
    const title = match[2].trim();
    const body = match[3];

    const complexityMatch = body.match(/\*\*(?:Estimated )?Complexity:\*\*\s*(\w+)/i);
    const descMatch = body.match(/\*\*Description:\*\*\s*(.+)/);
    const acMatch = body.match(/\*\*Acceptance Criteria:\*\*\s*([\s\S]*?)(?=\*\*|$)/);

    stories.push({
      number: number,
      title: title,
      description: descMatch ? descMatch[1].trim() : '',
      complexity: complexityMatch ? complexityMatch[1] : null,
      acceptance_criteria: acMatch ? acMatch[1].trim() : null
    });
  }
  return stories;
}

function extract_dependencies(content) {
  const section = content.match(/## Dependencies\n+([\s\S]*?)(?=\n##|$)/);
  if (!section) return [];

  return section[1]
    .split('\n')
    .filter(line => line.startsWith('-'))
    .map(line => line.replace(/^-\s*/, '').trim())
    .filter(line => line && line !== 'TBD');
}
```

## Natural Language Triggers

This workflow responds to:
- "Synthesize epic feedback"
- "Process feedback for epic"
- "Merge epic feedback"
- Menu trigger: `SE`
