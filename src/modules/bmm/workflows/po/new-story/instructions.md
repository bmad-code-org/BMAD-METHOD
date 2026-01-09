# New Story - Create Story in GitHub Issues

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>PO WORKFLOW: Creates stories directly in GitHub as source of truth</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 NEW STORY - Create in GitHub Issues
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="0a" title="Verify GitHub MCP access">
    <action>Call: mcp__github__get_me()</action>

    <check if="API call fails">
      <output>
❌ CRITICAL: GitHub MCP not accessible

Cannot create stories without GitHub API access.

HALTING
      </output>
      <action>HALT</action>
    </check>

    <action>current_user = response.login</action>
    <output>✅ GitHub connected as @{{current_user}}</output>
  </substep>

  <substep n="0b" title="Load epic context">
    <action>Search for existing epics/milestones:</action>
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:type:epic"
    })</action>

    <action>existing_epics = response.items.map(e => extract epic number from labels)</action>

    <output>
📁 Existing Epics:
{{#each existing_epics}}
- Epic {{number}}: {{title}}
{{else}}
No epics found - you may need to run /migrate-to-github first
{{/each}}
    </output>
  </substep>
</step>

<step n="1" goal="Gather Story Information">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Story Details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <ask>
**Which epic does this story belong to?**

{{#each existing_epics}}
[{{number}}] Epic {{number}}: {{title}}
{{/each}}
[N] New epic (will create)

Enter epic number:
  </ask>

  <action>Store {{epic_number}}</action>

  <ask>
**What is the story title?**

Keep it concise and descriptive.
Example: "User password reset via email"

Title:
  </ask>

  <action>Store {{story_title}}</action>

  <ask>
**Write the user story:**

Format: "As a [role], I want [capability], so that [benefit]"

Example: "As a user, I want to reset my password via email, so that I can regain access to my account when I forget my credentials."

User Story:
  </ask>

  <action>Store {{user_story}}</action>

  <ask>
**Provide business context:**

Why is this story important? What problem does it solve?
Include any relevant background that helps developers understand the need.

Business Context:
  </ask>

  <action>Store {{business_context}}</action>
</step>

<step n="2" goal="Define Acceptance Criteria (BDD)">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Acceptance Criteria (BDD Format)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <ask>
**Define acceptance criteria using BDD format:**

Each AC should follow:
- **Given** [context/precondition]
- **When** [action/trigger]
- **Then** [expected outcome]

Example:
```
AC1: Password reset email sent
- Given: User exists and has verified email
- When: User clicks "Forgot Password" and enters email
- Then: Reset email sent within 30 seconds with valid link

AC2: Reset link expires
- Given: Reset link was generated
- When: More than 1 hour has passed
- Then: Link shows expiry message, user must request new link
```

Enter your acceptance criteria (can enter multiple):
  </ask>

  <action>Store {{acceptance_criteria}}</action>

  <action>Parse and validate ACs have Given/When/Then structure</action>

  <check if="ACs don't follow BDD format">
    <output>
⚠️ Acceptance criteria should follow Given/When/Then format.

Let me help restructure these...
    </output>
    <action>Suggest BDD-formatted version of provided ACs</action>
    <ask>Use this restructured version? [Y/n]</ask>
  </check>
</step>

<step n="3" goal="Estimate Complexity">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Story Sizing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <ask>
**What is the complexity of this story?**

[1] Micro - 1-2 tasks, <1 hour (simple bug fix, text change)
[2] Small - 3-5 tasks, 1-4 hours (single feature, limited scope)
[3] Medium - 6-10 tasks, 4-8 hours (multiple components, integration)
[4] Large - 11-15 tasks, 1-2 days (significant feature, cross-cutting)
[5] Epic-sized - Should be broken into smaller stories

Complexity [1-5]:
  </ask>

  <action>Map to complexity label:
    1 → complexity:micro
    2 → complexity:small
    3 → complexity:medium
    4 → complexity:large
    5 → "Story is too large, should be split"
  </action>

  <check if="complexity == 5">
    <output>
⚠️ This story seems too large for a single story.

Consider breaking it into smaller stories, each focusing on a specific piece of functionality.

Would you like help breaking this down?
    </output>
    <ask>Continue anyway [C] or Break down [B]?</ask>

    <check if="break down">
      <action>Help user identify sub-stories</action>
      <action>HALT - Create sub-stories instead</action>
    </check>
  </check>
</step>

<step n="4" goal="Generate Story Key">
  <substep n="4a" title="Determine next story number">
    <action>Search for existing stories in this epic:</action>
    <action>Call: mcp__github__search_issues({
      query: "repo:{{github_owner}}/{{github_repo}} label:epic:{{epic_number}} label:type:story"
    })</action>

    <action>Extract story numbers from labels (e.g., story:2-5-auth → 5)</action>
    <action>next_story_number = max(story_numbers) + 1 OR 1 if no stories</action>
  </substep>

  <substep n="4b" title="Generate story slug">
    <action>Create slug from title:</action>
    <action>slug = story_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20)</action>
    <action>story_key = "{{epic_number}}-{{next_story_number}}-{{slug}}"</action>

    <output>
📎 Story Key: {{story_key}}
    </output>
  </substep>
</step>

<step n="5" goal="Create GitHub Issue">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Creating GitHub Issue
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <substep n="5a" title="Generate issue body">
    <action>Format issue body:</action>
    <action>
issue_body = """
**Story Key:** `{{story_key}}`
**Epic:** {{epic_number}}
**Complexity:** {{complexity_label}}

## User Story
{{user_story}}

## Business Context
{{business_context}}

## Acceptance Criteria

{{#each acceptance_criteria}}
### AC{{@index + 1}}: {{title}}
- [ ] **Given:** {{given}}
- [ ] **When:** {{when}}
- [ ] **Then:** {{then}}

{{/each}}

## Tasks
_Tasks will be generated by developer during checkout_

## Definition of Done
- [ ] All acceptance criteria verified
- [ ] Unit tests written and passing
- [ ] Integration tests where applicable
- [ ] Code reviewed
- [ ] Documentation updated if needed

---
_Created via BMAD PO workflow_
_Story file: `{{story_key}}.md`_
"""
    </action>
  </substep>

  <substep n="5b" title="Create issue with labels">
    <action>Create GitHub Issue:</action>
    <action>
labels = [
  "type:story",
  "story:{{story_key}}",
  "epic:{{epic_number}}",
  "status:backlog",
  "{{complexity_label}}"
]

Call: mcp__github__issue_write({
  method: "create",
  owner: {{github_owner}},
  repo: {{github_repo}},
  title: "Story {{story_key}}: {{story_title}}",
  body: issue_body,
  labels: labels
})
    </action>

    <action>issue_number = response.number</action>
    <action>issue_url = response.html_url</action>
  </substep>

  <substep n="5c" title="Verify creation">
    <action>Wait 1 second for GitHub eventual consistency</action>
    <action>Call: mcp__github__issue_read({
      method: "get",
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{issue_number}}
    })</action>

    <check if="verification fails">
      <output>
❌ Issue creation verification failed

The issue may not have been created properly.
Please check GitHub directly.
      </output>
      <action>HALT</action>
    </check>

    <output>✅ GitHub Issue #{{issue_number}} created and verified</output>
  </substep>
</step>

<step n="6" goal="Sync to Local Cache">
  <substep n="6a" title="Create local story file">
    <action>Create cache file: {{cache_dir}}/stories/{{story_key}}.md</action>
    <action>Content = converted issue body to BMAD story format</action>
    <output>✅ Cached: {{cache_dir}}/stories/{{story_key}}.md</output>
  </substep>

  <substep n="6b" title="Update cache metadata">
    <action>Update {{cache_dir}}/.bmad-cache-meta.json:</action>
    <action>
meta.stories[{{story_key}}] = {
  github_issue: {{issue_number}},
  github_updated_at: now(),
  cache_timestamp: now(),
  locked_by: null,
  locked_until: null
}
    </action>
  </substep>

  <substep n="6c" title="Update sprint-status.yaml">
    <check if="{{sprint_status}} file exists">
      <action>Add story to sprint-status.yaml:</action>
      <action>
development_status:
  {{story_key}}: backlog  # New story
      </action>
      <output>✅ Added to sprint-status.yaml</output>
    </check>
  </substep>
</step>

<step n="7" goal="Completion">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STORY CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Story Key:** {{story_key}}
**Title:** {{story_title}}
**Epic:** {{epic_number}}
**Complexity:** {{complexity_label}}

**GitHub Issue:** #{{issue_number}}
**URL:** {{issue_url}}

**Local Cache:** {{cache_dir}}/stories/{{story_key}}.md
**Sprint Status:** backlog

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps:**
- View in GitHub: {{issue_url}}
- Mark ready for dev: Update label to `status:ready-for-dev`
- Developers can checkout: `/checkout-story story_key={{story_key}}`

**Other Actions:**
- Create another story: /new-story
- View dashboard: /dashboard
- Update this story: /update-story story_key={{story_key}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

</workflow>
