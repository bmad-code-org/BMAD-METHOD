# Open Epic Feedback - Collect Stakeholder Input on Story Breakdown

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 OPEN EPIC FEEDBACK ROUND
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
    <substep n="1a" title="List draft epics">
      <action>Call: mcp__github__search_issues({
        query: "repo:{{github_owner}}/{{github_repo}} label:type:epic-review label:review-status:draft is:open"
      })</action>

      <check if="response.items.length == 0">
        <output>
❌ No draft epics found.

Create an epic first with: "Create epic from PRD"
        </output>
        <action>HALT</action>
      </check>

      <action>
        draft_epics = response.items.map(issue => {
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
📦 DRAFT EPICS AVAILABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each draft_epics}}
[{{@index + 1}}] epic:{{key}} - {{title}}
    Source: prd:{{source_prd}} | Issue: #{{issue_number}}
{{/each}}

      </output>
    </substep>

    <ask>Select epic (1-{{draft_epics.length}}):</ask>
    <action>epic_key = draft_epics[parseInt(response) - 1].key</action>
    <action>review_issue_number = draft_epics[parseInt(response) - 1].issue_number</action>
  </check>

  <output>
📦 Selected: epic:{{epic_key}}
  </output>
</step>

<step n="2" goal="Load Epic Document">
  <action>epic_path = `${docs_dir}/epics/epic-${epic_key}.md`</action>
  <action>Read epic_path</action>

  <check if="file not found">
    <output>❌ Epic document not found: {{epic_path}}</output>
    <action>HALT</action>
  </check>

  <action>epic_content = file_content</action>
  <action>
    title = extract_title(epic_content)
    version = extract_version(epic_content)
    stakeholders = extract_stakeholders(epic_content)
    source_prd = extract_source_prd(epic_content)
    stories = extract_epic_stories(epic_content)
  </action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 EPIC SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Title:** {{title}}
**Version:** v{{version}}
**Source PRD:** prd:{{source_prd}}
**Stories:** {{stories.length}} implementation stories
**Stakeholders:** {{stakeholders.length}}

  </output>
</step>

<step n="3" goal="Find or Validate Review Issue">
  <check if="review_issue_number is empty">
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:epic-review label:epic:{{epic_key}} is:open"
    })</action>

    <check if="response.items.length == 0">
      <output>❌ No review issue found for epic:{{epic_key}}</output>
      <action>HALT</action>
    </check>

    <action>review_issue = response.items[0]</action>
    <action>review_issue_number = review_issue.number</action>
  </check>

  <check if="review_issue is empty">
    <action>Call: mcp__github__issue_read({
      method: 'get',
      owner: github_owner,
      repo: github_repo,
      issue_number: review_issue_number
    })</action>
    <action>review_issue = response</action>
  </check>

  <output>
📋 Review Issue: #{{review_issue_number}}
  </output>
</step>

<step n="4" goal="Configure Feedback Round">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ FEEDBACK ROUND CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Epic feedback focuses on:
- **Scope**: Is the epic size right? Should it be split/merged?
- **Story Breakdown**: Are stories well-defined and independent?
- **Dependencies**: Are technical dependencies captured?
- **Priority**: Is the story order correct?
- **Technical Risk**: Are there architecture concerns?

  </output>

  <ask>Days until feedback deadline (default: {{feedback_days}}):</ask>
  <action>
    feedback_days = parseInt(response) || feedback_days
    deadline = new Date()
    deadline.setDate(deadline.getDate() + feedback_days)
    deadline_str = deadline.toISOString().split('T')[0]
  </action>

  <output>
**Deadline:** {{deadline_str}} ({{feedback_days}} days from now)

**Stakeholders to notify:**
{{#each stakeholders}}
  • @{{this}}
{{/each}}

  </output>

  <ask>Add additional stakeholders? (comma-separated or 'none'):</ask>
  <action>
    if (response.toLowerCase() !== 'none' && response.trim()) {
      additional = response.split(',').map(s => s.trim().replace('@', ''))
      stakeholders = [...new Set([...stakeholders, ...additional])]
    }
  </action>
</step>

<step n="5" goal="Update Epic Document">
  <action>
    updated_content = epic_content
      .replace(/\*\*Status:\*\* .+/, '**Status:** Feedback')
      .replace(/\| Feedback Deadline \| .+ \|/, `| Feedback Deadline | ${deadline_str} |`)
  </action>

  <action>Write updated_content to epic_path</action>

  <output>
✅ Epic status updated to 'Feedback'
  </output>
</step>

<step n="6" goal="Update Review Issue">
  <action>
    // Get current labels
    current_labels = review_issue.labels.map(l => l.name)

    // Update status label
    new_labels = current_labels
      .filter(l => !l.startsWith('review-status:'))
      .concat(['review-status:open'])
  </action>

  <action>Call: mcp__github__issue_write({
    method: 'update',
    owner: "{{github_owner}}",
    repo: "{{github_repo}}",
    issue_number: review_issue_number,
    labels: new_labels,
    assignees: stakeholders
  })</action>

  <output>
✅ Review issue updated with stakeholders
  </output>
</step>

<step n="7" goal="Post Feedback Request">
  <action>
    feedback_comment = `## 💬 Feedback Round Open

${stakeholders.map(s => '@' + s).join(' ')}

**Epic:** epic:${epic_key}
**Version:** v${version}
**Deadline:** ${deadline_str}
**Source PRD:** prd:${source_prd}

---

## 📦 Story Breakdown

${stories.map((s, i) => `${i + 1}. **${s.title}** (${s.complexity || 'TBD'})\n   ${s.description || ''}`).join('\n\n')}

---

## Feedback Types for Epics

Please provide feedback on:

- 🔍 **Scope**: Is this epic the right size? Should it be split or merged with another?
- 📝 **Story Breakdown**: Are stories well-defined, independent, and testable?
- 🔗 **Dependencies**: Are technical dependencies correctly identified?
- ⚡ **Priority**: Is the story order optimal for delivery?
- ⚠️ **Technical Risk**: Are there architectural or technical concerns?
- ➕ **Missing Stories**: Should additional stories be added?

---

### How to Submit Feedback

Reply with structured feedback or use the feedback workflow:

\`\`\`
/feedback epic:${epic_key}
Section: [Story Breakdown / Dependencies / Technical Risk / etc.]
Type: [scope / dependency / priority / technical_risk / story_split / missing_story]
Feedback: [Your detailed feedback]
\`\`\`

Or simply comment with your thoughts.

---

_Feedback requested by @${current_user} on ${new Date().toISOString().split('T')[0]}_
_Please respond by ${deadline_str}_`
  </action>

  <action>Call: mcp__github__add_issue_comment({
    owner: "{{github_owner}}",
    repo: "{{github_repo}}",
    issue_number: review_issue_number,
    body: feedback_comment
  })</action>

  <output>
✅ Feedback request posted
  </output>
</step>

<step n="8" goal="Summary">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ EPIC FEEDBACK ROUND OPENED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Epic:** epic:{{epic_key}}
**Title:** {{title}}
**Review Issue:** #{{review_issue_number}}
**Deadline:** {{deadline_str}}
**Stakeholders:** {{stakeholders.length}} notified

---

All stakeholders have been @mentioned and will receive
GitHub notifications.

**Monitor progress with:**
- "View feedback for epic:{{epic_key}}"
- "Epic Dashboard" or [ED]

**After collecting feedback:**
- "Synthesize feedback for epic:{{epic_key}}"

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

function extract_stakeholders(content) {
  const field = content.match(/\|\s*Stakeholders\s*\|\s*(.+?)\s*\|/);
  if (!field) return [];

  return field[1]
    .split(/[,\s]+/)
    .filter(s => s.startsWith('@'))
    .map(s => s.replace('@', ''));
}

function extract_epic_stories(content) {
  const stories = [];
  // Match story sections in various formats
  const storyRegex = /###\s+Story\s+\d+:\s*(.+)\n+([\s\S]*?)(?=###|---|\n##|$)/gi;
  let match;
  while ((match = storyRegex.exec(content)) !== null) {
    const title = match[1].trim();
    const body = match[2];

    // Extract complexity
    const complexityMatch = body.match(/\*\*Estimated Complexity:\*\*\s*(\w+)/i);

    // Extract description
    const descMatch = body.match(/\*\*Description:\*\*\s*(.+)/);

    stories.push({
      title: title,
      description: descMatch ? descMatch[1].trim() : '',
      complexity: complexityMatch ? complexityMatch[1] : null
    });
  }
  return stories;
}
```

## Epic-Specific Feedback Types

```yaml
feedback_types:
  scope_concern:
    label: "Scope"
    description: "Epic is too large/small, should be split/merged"
    emoji: "🔍"

  story_split:
    label: "Story Breakdown"
    description: "Story needs to be split, combined, or redefined"
    emoji: "📝"

  dependency:
    label: "Dependency"
    description: "Missing or incorrect dependency identification"
    emoji: "🔗"

  priority_question:
    label: "Priority"
    description: "Story order or priority should change"
    emoji: "⚡"

  technical_risk:
    label: "Technical Risk"
    description: "Architecture or technical feasibility concern"
    emoji: "⚠️"

  missing_story:
    label: "Missing Story"
    description: "An additional story should be added"
    emoji: "➕"
```

## Natural Language Triggers

This workflow responds to:
- "Open feedback for epic"
- "Start epic feedback round"
- "Get feedback on epic"
- Menu trigger: `OE`
