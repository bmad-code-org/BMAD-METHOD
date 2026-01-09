# Create PRD Draft - Start Async Requirements Collaboration

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CREATE PRD DRAFT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Call: mcp__github__get_me()</action>
  <action>current_user = response.login</action>

  <check if="API call fails">
    <output>❌ GitHub MCP not accessible - required for PRD coordination</output>
    <action>HALT</action>
  </check>
</step>

<step n="1" goal="Choose Creation Method">
  <output>
How would you like to create this PRD?

[1] Start from scratch (guided prompts)
[2] Import from existing BMAD PRD workflow output
[3] Import from product brief document
[4] Use minimal template (fill in later)

  </output>

  <ask>Choice (1-4):</ask>
  <action>creation_method = choice</action>
</step>

<step n="2" goal="Gather Basic Information">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 BASIC INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <ask>PRD Title (e.g., "User Authentication System"):</ask>
  <action>prd_title = response</action>

  <ask>PRD Key (short identifier, e.g., "user-auth", no spaces):</ask>
  <action>prd_key = response.toLowerCase().replace(/\s+/g, '-')</action>

  <substep n="2a" title="Check for existing PRD">
    <action>Check if file exists at: {{docs_dir}}/{{prd_key}}.md</action>
    <check if="file exists">
      <output>
⚠️ A PRD with key "{{prd_key}}" already exists.
Would you like to:
[1] Choose a different key
[2] Create a new version of this PRD
[3] Cancel
      </output>
      <ask>Choice:</ask>
      <check if="choice == 1">
        <action>Goto step 2</action>
      </check>
      <check if="choice == 2">
        <action>is_new_version = true</action>
        <action>Load existing PRD and increment version</action>
      </check>
      <check if="choice == 3">
        <action>HALT</action>
      </check>
    </check>
  </substep>
</step>

<step n="3" goal="Gather Content (Method-Dependent)">
  <check if="creation_method == 1">
    <substep n="3a" title="Guided prompts - Vision">
      <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 VISION & PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </output>

      <ask>What is the vision for this product/feature? (1-2 sentences)</ask>
      <action>vision = response</action>

      <ask>What problem does this solve? What pain points does it address?</ask>
      <action>problem_statement = response</action>
    </substep>

    <substep n="3b" title="Guided prompts - Goals">
      <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 GOALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </output>

      <ask>List the primary goals (one per line, or comma-separated):</ask>
      <action>goals = parse_list(response)</action>
    </substep>

    <substep n="3c" title="Guided prompts - User Stories">
      <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 USER STORIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enter user stories in format: "As a [role], I want [capability], so that [benefit]"
(Enter empty line when done)
      </output>

      <action>user_stories = []</action>
      <loop>
        <ask>User Story (or press Enter to finish):</ask>
        <check if="response is empty">
          <action>break loop</action>
        </check>
        <action>user_stories.push(response)</action>
      </loop>
    </substep>

    <substep n="3d" title="Guided prompts - Requirements">
      <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 FUNCTIONAL REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

List key functional requirements (one per line, or press Enter to skip for now):
      </output>

      <ask>Functional Requirements:</ask>
      <action>functional_reqs = parse_list(response)</action>

      <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ NON-FUNCTIONAL REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

List non-functional requirements (performance, security, etc.):
      </output>

      <ask>Non-Functional Requirements:</ask>
      <action>non_functional_reqs = parse_list(response)</action>
    </substep>

    <substep n="3e" title="Guided prompts - Constraints & Out of Scope">
      <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 CONSTRAINTS & OUT OF SCOPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </output>

      <ask>What constraints apply? (technical, timeline, budget, etc.):</ask>
      <action>constraints = parse_list(response)</action>

      <ask>What is explicitly out of scope for this PRD?:</ask>
      <action>out_of_scope = parse_list(response)</action>
    </substep>
  </check>

  <check if="creation_method == 2">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 IMPORT FROM BMAD PRD WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Looking for existing PRD output in project...
    </output>

    <action>Glob for: **/prd-output.md, **/prd-*.md in project</action>
    <action>List found files for user selection</action>

    <ask>Select file number to import (or path):</ask>
    <action>import_path = response</action>
    <action>Read and parse imported PRD content</action>
  </check>

  <check if="creation_method == 3">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 IMPORT FROM PRODUCT BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <ask>Path to product brief document:</ask>
    <action>brief_path = response</action>
    <action>Read product brief and extract PRD sections using LLM</action>
  </check>

  <check if="creation_method == 4">
    <action>
      // Minimal template - just placeholders
      vision = "[To be defined]"
      problem_statement = "[To be defined]"
      goals = ["[Goal 1]", "[Goal 2]"]
      user_stories = []
      functional_reqs = []
      non_functional_reqs = []
      constraints = []
      out_of_scope = []
    </action>
  </check>
</step>

<step n="4" goal="Define Stakeholders">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 STAKEHOLDERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Who should review this PRD and provide feedback?
Enter GitHub usernames (one per line, with or without @):
  </output>

  <action>stakeholders = [current_user]</action>
  <loop>
    <ask>Stakeholder username (or press Enter to finish):</ask>
    <check if="response is empty">
      <action>break loop</action>
    </check>
    <action>
      username = response.replace('@', '')
      if (!stakeholders.includes(username)) {
        stakeholders.push(username)
      }
    </action>
  </loop>

  <output>
Stakeholders: {{stakeholders.map(s => '@' + s).join(', ')}}
  </output>
</step>

<step n="5" goal="Generate PRD Markdown">
  <action>
prd_content = `# PRD: ${prd_title}

**PRD Key:** \`prd:${prd_key}\`
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
| Feedback Deadline | [To be set] |
| Sign-off Deadline | [To be set] |

---

## Vision

${vision}

## Problem Statement

${problem_statement}

## Goals

${goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

## User Stories

${user_stories.length > 0
  ? user_stories.map((s, i) => `### US${i + 1}: ${extract_story_title(s)}\n${s}\n`).join('\n')
  : '*No user stories defined yet.*'}

## Functional Requirements

${functional_reqs.length > 0
  ? functional_reqs.map((r, i) => `### FR${i + 1}\n${r}\n`).join('\n')
  : '*No functional requirements defined yet.*'}

## Non-Functional Requirements

${non_functional_reqs.length > 0
  ? non_functional_reqs.map((r, i) => `### NFR${i + 1}\n${r}\n`).join('\n')
  : '*No non-functional requirements defined yet.*'}

## Constraints

${constraints.length > 0
  ? constraints.map(c => `- ${c}`).join('\n')
  : '*No constraints defined.*'}

## Out of Scope

${out_of_scope.length > 0
  ? out_of_scope.map(c => `- ${c}`).join('\n')
  : '*Nothing explicitly marked out of scope.*'}

---

## Version History

| Version | Date | Changes | Feedback Incorporated |
|---------|------|---------|----------------------|
| 1 | ${new Date().toISOString().split('T')[0]} | Initial draft | - |

---

## Sign-off Status

| Stakeholder | Status | Date | Notes |
|-------------|--------|------|-------|
${stakeholders.map(s => `| @${s} | ⏳ Pending | - | - |`).join('\n')}
`
  </action>
</step>

<step n="6" goal="Save PRD and Update Cache">
  <substep n="6a" title="Ensure docs directory exists">
    <action>Ensure directory exists: {{docs_dir}}</action>
  </substep>

  <substep n="6b" title="Write PRD file">
    <action>prd_path = {{docs_dir}}/{{prd_key}}.md</action>
    <action>Write prd_content to prd_path</action>
  </substep>

  <substep n="6c" title="Update local cache">
    <action>
      // Using CacheManager
      cacheManager.writePrd(prd_key, prd_content, {
        version: 1,
        status: 'draft',
        stakeholders: stakeholders,
        owner: current_user
      })
    </action>
  </substep>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PRD DRAFT CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Title:** {{prd_title}}
**Key:** prd:{{prd_key}}
**File:** {{prd_path}}
**Stakeholders:** {{stakeholders.length}}

The PRD has been saved locally. It is NOT yet on GitHub.
  </output>
</step>

<step n="7" goal="Next Steps">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your PRD draft is ready. What would you like to do next?

[1] Open feedback round now (notify stakeholders)
[2] Edit PRD further before sharing
[3] View PRD
[4] Done for now

  </output>

  <ask>Choice:</ask>

  <check if="choice == 1">
    <output>
Opening feedback round for prd:{{prd_key}}...
    </output>
    <action>Load workflow: open-feedback-round with prd_key = prd_key</action>
  </check>

  <check if="choice == 2">
    <output>
To edit the PRD, open: {{prd_path}}

When ready, run the feedback round with:
  "Open feedback for prd:{{prd_key}}"
  or use menu trigger: OF
    </output>
    <action>Exit</action>
  </check>

  <check if="choice == 3">
    <action>Read and display prd_path</action>
    <action>Goto step 7</action>
  </check>

  <check if="choice == 4">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRD draft saved. Ready for feedback when you are!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
    <action>Exit</action>
  </check>
</step>

</workflow>

## Helper Functions

```javascript
// Parse comma or newline separated list
function parse_list(input) {
  if (!input || input.trim() === '') return [];
  return input
    .split(/[,\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Extract title from user story
function extract_story_title(story) {
  const match = story.match(/I want\s+(.+?),?\s+so that/i);
  return match ? match[1].slice(0, 40) : 'User Story';
}
```

## Natural Language Triggers

This workflow responds to:
- "Create a new PRD"
- "Start a PRD for [feature]"
- "I need to write requirements for..."
- Menu trigger: `CP`
