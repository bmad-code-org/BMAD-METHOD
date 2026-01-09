# Create Epic Draft - From PRD to Implementation-Ready Epics

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 CREATE EPIC FROM PRD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Call: mcp__github__get_me()</action>
  <action>current_user = response.login</action>

  <check if="API call fails">
    <output>❌ GitHub MCP not accessible</output>
    <action>HALT</action>
  </check>
</step>

<step n="1" goal="Select Source PRD">
  <check if="source_prd is empty">
    <substep n="1a" title="List approved PRDs">
      <action>Call: mcp__github__search_issues({
        query: "repo:{{github_owner}}/{{github_repo}} label:type:prd-review label:review-status:approved is:closed"
      })</action>

      <check if="response.items.length == 0">
        <output>
❌ No approved PRDs found.

You need an approved PRD to create epics from.
Use the PRD Dashboard [PD] to see PRD status.
        </output>
        <action>HALT</action>
      </check>

      <action>
        approved_prds = response.items.map(issue => {
          const labels = issue.labels.map(l => l.name)
          const prd_key = labels.find(l => l.startsWith('prd:'))?.replace('prd:', '')
          return {
            key: prd_key,
            title: issue.title.replace(/^(PRD Review|Sign-off):\s*/, '').replace(/\s+v\d+$/, ''),
            issue_number: issue.number,
            approved_date: issue.closed_at
          }
        }).filter(p => p.key)
      </action>

      <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 APPROVED PRDs AVAILABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each approved_prds}}
[{{@index + 1}}] prd:{{key}} - {{title}}
    Approved: {{approved_date}}
{{/each}}

      </output>
    </substep>

    <ask>Select PRD to create epic from (1-{{approved_prds.length}}):</ask>
    <action>source_prd = approved_prds[parseInt(response) - 1].key</action>
  </check>

  <output>
📄 Source PRD: prd:{{source_prd}}
  </output>
</step>

<step n="2" goal="Load PRD Document">
  <action>prd_path = `${docs_dir}/prd/${source_prd}.md`</action>
  <action>Read prd_path</action>

  <check if="file not found">
    <output>❌ PRD document not found: {{prd_path}}</output>
    <action>HALT</action>
  </check>

  <action>prd_content = file_content</action>
  <action>
    prd_title = extract_title(prd_content)
    prd_version = extract_version(prd_content)
    user_stories = extract_user_stories(prd_content)
    functional_reqs = extract_functional_requirements(prd_content)
    nfrs = extract_non_functional_requirements(prd_content)
    constraints = extract_constraints(prd_content)
    stakeholders_from_prd = extract_stakeholders(prd_content)
  </action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 PRD SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Title:** {{prd_title}}
**Version:** v{{prd_version}}
**User Stories:** {{user_stories.length}}
**Functional Requirements:** {{functional_reqs.length}}
**Non-Functional Requirements:** {{nfrs.length}}

  </output>
</step>

<step n="3" goal="Check Existing Epics">
  <action>Call: mcp__github__search_issues({
    query: "repo:{{github_owner}}/{{github_repo}} label:type:epic-review label:source-prd:{{source_prd}}"
  })</action>

  <check if="response.items.length > 0">
    <action>
      existing_epics = response.items.map(issue => {
        const labels = issue.labels.map(l => l.name)
        return {
          key: labels.find(l => l.startsWith('epic:'))?.replace('epic:', ''),
          title: issue.title,
          state: issue.state
        }
      })
    </action>

    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ EXISTING EPICS FROM THIS PRD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each existing_epics}}
  • epic:{{key}} - {{title}} ({{state}})
{{/each}}

Would you like to:
[1] Create additional epic (for different scope)
[2] View existing epics and exit
[3] Cancel
    </output>

    <ask>Choice:</ask>
    <check if="response == '2' OR response == '3'">
      <action>HALT</action>
    </check>
  </check>
</step>

<step n="4" goal="Epic Configuration">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ EPIC CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="4a" title="Select User Stories for Epic">
    <output>
Select which user stories this epic will implement:

{{#each user_stories}}
[{{@index + 1}}] {{id}}: {{title}}
    As a {{role}}, I want {{capability}}
{{/each}}

Enter story numbers (comma-separated) or 'all':
    </output>

    <ask>Stories to include:</ask>
    <action>
      if (response.toLowerCase() === 'all') {
        selected_stories = user_stories
      } else {
        const indices = response.split(',').map(s => parseInt(s.trim()) - 1)
        selected_stories = indices.map(i => user_stories[i]).filter(Boolean)
      }
    </action>

    <output>
Selected {{selected_stories.length}} user stories for this epic.
    </output>
  </substep>

  <substep n="4b" title="Epic title and key">
    <action>
      // Generate suggested epic key
      epic_number = (existing_epics?.length || 0) + 1
      suggested_key = `${source_prd}-epic-${epic_number}`

      // Generate suggested title based on selected stories
      if (selected_stories.length === 1) {
        suggested_title = selected_stories[0].title
      } else {
        suggested_title = `${prd_title} - Phase ${epic_number}`
      }
    </action>

    <output>
**Suggested Epic Key:** {{suggested_key}}
**Suggested Title:** {{suggested_title}}

    </output>

    <ask>Epic title (or press Enter for suggested):</ask>
    <action>epic_title = response || suggested_title</action>

    <check if="epic_key is empty">
      <ask>Epic key (or press Enter for suggested):</ask>
      <action>epic_key = response || suggested_key</action>
    </check>
  </substep>

  <substep n="4c" title="Epic stakeholders">
    <output>
PRD Stakeholders: {{stakeholders_from_prd.map(s => '@' + s).join(', ')}}

Epic reviews typically involve:
- Tech Lead (scope/split decisions)
- PO (priority/acceptance)
- Domain experts (technical feasibility)

    </output>

    <check if="stakeholders.length == 0">
      <ask>Epic stakeholders (comma-separated usernames, or 'same' for PRD stakeholders):</ask>
      <action>
        if (response.toLowerCase() === 'same') {
          stakeholders = stakeholders_from_prd
        } else {
          stakeholders = response.split(',').map(s => s.trim().replace('@', ''))
        }
      </action>
    </check>
  </substep>
</step>

<step n="5" goal="Generate Story Breakdown">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 GENERATING STORY BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing selected user stories and generating implementation stories...
  </output>

  <action>
    // Use LLM to break down user stories into implementation stories
    prompt = `Based on the following PRD user stories, generate a set of implementation stories for an epic.

PRD Title: ${prd_title}
Epic Title: ${epic_title}

Selected User Stories:
${selected_stories.map(s => `- ${s.id}: ${s.title}\n  As a ${s.role}, I want ${s.capability}, so that ${s.benefit}`).join('\n')}

Related Functional Requirements:
${functional_reqs.map(fr => `- ${fr.id}: ${fr.title}`).join('\n')}

Non-Functional Requirements to consider:
${nfrs.map(nfr => `- ${nfr.id}: ${nfr.title}`).join('\n')}

Generate 3-7 implementation stories that:
1. Are independently deliverable
2. Follow a logical implementation order
3. Include clear acceptance criteria
4. Reference the source user stories
5. Consider technical dependencies

Output format:
---
### Story 1: [Title]
**Source US:** [user story id]
**Description:** [brief description]
**Acceptance Criteria:**
- [ ] [criterion 1]
- [ ] [criterion 2]
**Dependencies:** [any dependencies]
**Estimated Complexity:** [S/M/L/XL]
---`

    // LLM generates story breakdown
    generated_stories = await llm_generate(prompt)
  </action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PROPOSED STORY BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{generated_stories}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Would you like to:
[1] Accept this breakdown
[2] Modify (add/remove/edit stories)
[3] Regenerate with different approach
[4] Cancel
  </output>

  <ask>Choice:</ask>
  <check if="response == '2'">
    <ask>Describe your modifications:</ask>
    <action>
      // Regenerate with user feedback
      modification_prompt = `${prompt}\n\nUser requested modifications:\n${response}\n\nPlease regenerate the story breakdown incorporating this feedback.`
      generated_stories = await llm_generate(modification_prompt)
    </action>
    <output>
Updated story breakdown:

{{generated_stories}}
    </output>
  </check>

  <check if="response == '3'">
    <ask>What approach should be used?</ask>
    <action>
      approach_prompt = `${prompt}\n\nApproach to use:\n${response}\n\nPlease regenerate using this approach.`
      generated_stories = await llm_generate(approach_prompt)
    </action>
    <output>
Regenerated story breakdown:

{{generated_stories}}
    </output>
  </check>

  <check if="response == '4'">
    <action>HALT</action>
  </check>
</step>

<step n="6" goal="Create Epic Document">
  <action>
    epic_doc = `# Epic: ${epic_title}

**Epic Key:** \`epic:${epic_key}\`
**Source PRD:** \`prd:${source_prd}\` (v${prd_version})
**Version:** 1
**Status:** Draft
**Created:** ${new Date().toISOString().split('T')[0]}
**Last Updated:** ${new Date().toISOString().split('T')[0]}

---

## Metadata
| Field | Value |
|-------|-------|
| Product Owner | @${current_user} |
| Stakeholders | ${stakeholders.map(s => '@' + s).join(', ')} |
| Tech Lead | TBD |
| Feedback Deadline | TBD |
| Sign-off Deadline | TBD |

---

## Overview

This epic implements the following user stories from prd:${source_prd}:

${selected_stories.map(s => `- **${s.id}:** ${s.title}`).join('\n')}

---

## Goals

${selected_stories.map((s, i) => `${i + 1}. ${s.capability}`).join('\n')}

---

## Implementation Stories

${generated_stories}

---

## Dependencies

<!-- List any dependencies on other epics, external systems, or teams -->

- TBD

---

## Technical Considerations

<!-- Notes on architecture, performance, security, etc. -->

### From NFRs:
${nfrs.map(nfr => `- ${nfr.title}`).join('\n')}

### Constraints:
${constraints.map(c => `- ${c}`).join('\n')}

---

## Out of Scope

<!-- What is explicitly NOT included in this epic -->

- TBD

---

## Version History
| Version | Date | Changes | Feedback Incorporated |
|---------|------|---------|----------------------|
| 1 | ${new Date().toISOString().split('T')[0]} | Initial draft from PRD | - |

---

## Sign-off Status
| Stakeholder | Status | Date | Notes |
|-------------|--------|------|-------|
${stakeholders.map(s => `| @${s} | ⏳ Pending | - | - |`).join('\n')}
`
  </action>

  <action>epic_path = `${docs_dir}/epics/epic-${epic_key}.md`</action>
  <action>Write epic_doc to epic_path</action>

  <output>
✅ Epic document created: {{epic_path}}
  </output>
</step>

<step n="7" goal="Create GitHub Review Issue">
  <action>
    issue_body = `# 📦 Epic Review: ${epic_title}

**Epic Key:** \`epic:${epic_key}\`
**Source PRD:** prd:${source_prd}
**Version:** 1
**Status:** 📝 Draft

---

## Included Stories

This epic implements user stories from the approved PRD:
${selected_stories.map(s => `- ${s.id}: ${s.title}`).join('\n')}

---

## Document Link

📄 [Epic Document](${epic_path})

---

## Story Breakdown

${generated_stories}

---

## Stakeholders

${stakeholders.map(s => `- @${s}`).join('\n')}

---

_Created by @${current_user} on ${new Date().toISOString().split('T')[0]}_
_Ready for feedback round when PO opens it._`
  </action>

  <action>Call: mcp__github__issue_write({
    method: 'create',
    owner: "{{github_owner}}",
    repo: "{{github_repo}}",
    title: "Epic Review: {{epic_title}}",
    body: issue_body,
    labels: ['type:epic-review', `epic:${epic_key}`, `source-prd:${source_prd}`, 'version:1', 'review-status:draft']
  })</action>

  <action>review_issue = response</action>

  <output>
✅ Review issue created: #{{review_issue.number}}
  </output>
</step>

<step n="8" goal="Summary">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ EPIC CREATED SUCCESSFULLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Epic:** epic:{{epic_key}}
**Title:** {{epic_title}}
**Source PRD:** prd:{{source_prd}}
**Document:** {{epic_path}}
**Review Issue:** #{{review_issue.number}}

**Stories:** {{selected_stories.length}} user stories → implementation breakdown
**Stakeholders:** {{stakeholders.length}}

---

**Next Steps:**
1. Review and refine the story breakdown
2. Assign Tech Lead
3. Open feedback round with: "Open feedback for epic:{{epic_key}}"
4. Once feedback is incorporated, request sign-off

**Quick Actions:**
[OF] Open feedback round
[ED] View Epic Dashboard
[VF] View feedback

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

function extract_user_stories(content) {
  const stories = [];
  const usRegex = /###\s+(US\d+):\s*(.+)\n+As a (.+), I want (.+), so that (.+)/g;
  let match;
  while ((match = usRegex.exec(content)) !== null) {
    stories.push({
      id: match[1],
      title: match[2].trim(),
      role: match[3].trim(),
      capability: match[4].trim(),
      benefit: match[5].trim()
    });
  }
  return stories;
}

function extract_functional_requirements(content) {
  const reqs = [];
  const frRegex = /###\s+(FR\d+):\s*(.+)\n+([\s\S]*?)(?=###|$)/g;
  let match;
  while ((match = frRegex.exec(content)) !== null) {
    reqs.push({
      id: match[1],
      title: match[2].trim(),
      description: match[3].trim()
    });
  }
  return reqs;
}

function extract_non_functional_requirements(content) {
  const nfrs = [];
  const nfrRegex = /###\s+(NFR\d+):\s*(.+)/g;
  let match;
  while ((match = nfrRegex.exec(content)) !== null) {
    nfrs.push({
      id: match[1],
      title: match[2].trim()
    });
  }
  return nfrs;
}

function extract_constraints(content) {
  const section = content.match(/## Constraints\n+([\s\S]*?)(?=\n##|$)/);
  if (!section) return [];

  return section[1]
    .split('\n')
    .filter(line => line.startsWith('-'))
    .map(line => line.replace(/^-\s*/, '').trim());
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
- "Create epic from PRD"
- "Break down PRD into epics"
- "Start epic from [prd]"
- Menu trigger: `CE`
