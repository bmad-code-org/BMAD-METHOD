# Approve Story - PO Sign-Off

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>PO WORKFLOW: Final approval closes issue and releases lock</critical>

<workflow>

<step n="0" goal="Pre-Flight Checks">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ APPROVE STORY - PO Sign-Off
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <check if="story_key is empty">
    <output>
❌ ERROR: story_key parameter required

Usage:
  /approve-story story_key=2-5-auth

HALTING
    </output>
    <action>HALT</action>
  </check>

  <action>Call: mcp__github__get_me()</action>
  <action>current_user = response.login</action>
</step>

<step n="1" goal="Fetch Story and PR">
  <action>Call: mcp__github__search_issues({
    query: "repo:{{github_owner}}/{{github_repo}} label:story:{{story_key}}"
  })</action>

  <check if="no results">
    <output>❌ Story {{story_key}} not found</output>
    <action>HALT</action>
  </check>

  <action>issue = response.items[0]</action>
  <action>status = extract_status(issue.labels)</action>

  <check if="status != 'in-review'">
    <output>
⚠️ Story is not in review status

Current status: {{status}}
Expected: in-review

Stories should be marked "in-review" by developers when complete.
    </output>

    <ask>Proceed anyway? [y/N]:</ask>
    <check if="not confirmed">
      <action>HALT</action>
    </check>
  </check>

  <action>Search for linked PR:</action>
  <action>Call: mcp__github__search_pull_requests({
    query: "repo:{{github_owner}}/{{github_repo}} {{story_key}} OR closes:#{{issue.number}}"
  })</action>

  <action>pr = response.items[0] if exists</action>
</step>

<step n="2" goal="Display Story for Review">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 STORY REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Story:** {{story_key}}
**Title:** {{issue.title}}
**Developer:** @{{issue.assignee?.login or "Unknown"}}
**Issue:** #{{issue.number}}
{{#if pr}}
**PR:** #{{pr.number}} ({{pr.state}})
{{/if}}

---

## Acceptance Criteria

{{#each acceptance_criteria}}
{{@index + 1}}. {{title}}
   - Given: {{given}}
   - When: {{when}}
   - Then: {{then}}

{{/each}}

---

## Implementation Summary

{{#if pr}}
**PR Description:**
{{pr.body}}

**Files Changed:** {{pr.changed_files}}
**Additions:** +{{pr.additions}}
**Deletions:** -{{pr.deletions}}
{{else}}
No linked PR found. Review implementation in issue comments.
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <ask>
**Have you verified the acceptance criteria are met?**

[A] Approve - All ACs satisfied, story complete
[R] Request Changes - Issues found, needs more work
[D] Defer - Need more time to review
[V] View Details - Show more information

Choice:
  </ask>
</step>

<step n="3" goal="Process Decision">
  <check if="choice == 'A'">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Approving Story
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <substep n="3a" title="Update issue status">
      <action>Update labels: remove status:in-review, add status:done</action>
      <action>Call: mcp__github__issue_write({
        method: "update",
        owner: {{github_owner}},
        repo: {{github_repo}},
        issue_number: {{issue.number}},
        state: "closed",
        state_reason: "completed",
        labels: [update labels]
      })</action>
    </substep>

    <substep n="3b" title="Add approval comment">
      <action>Call: mcp__github__add_issue_comment({
        owner: {{github_owner}},
        repo: {{github_repo}},
        issue_number: {{issue.number}},
        body: "✅ **Story Approved by PO @{{current_user}}**\n\n" +
              "All acceptance criteria verified.\n" +
              "Story complete.\n\n" +
              "_Approved at {{timestamp}}_"
      })</action>
    </substep>

    <substep n="3c" title="Merge PR if exists">
      <check if="pr exists AND pr.state == 'open'">
        <ask>Merge PR #{{pr.number}}? [Y/n]:</ask>

        <check if="confirmed">
          <action>Call: mcp__github__merge_pull_request({
            owner: {{github_owner}},
            repo: {{github_repo}},
            pullNumber: {{pr.number}},
            merge_method: "squash"
          })</action>
          <output>✅ PR #{{pr.number}} merged</output>
        </check>
      </check>
    </substep>

    <substep n="3d" title="Release lock">
      <action>Unassign developer from issue</action>
      <action>Clear local lock file if exists</action>
      <action>Update cache metadata</action>
    </substep>

    <substep n="3e" title="Update sprint status">
      <check if="{{sprint_status}} file exists">
        <action>Update development_status[{{story_key}}] = "done"</action>
        <output>✅ Sprint status updated</output>
      </check>
    </substep>

    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STORY APPROVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Story:** {{story_key}}
**Status:** Done ✓
**Issue:** #{{issue.number}} (Closed)
{{#if pr_merged}}
**PR:** #{{pr.number}} (Merged)
{{/if}}

Developer @{{issue.assignee?.login}} has been notified.
Lock released - story complete!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
  </check>

  <check if="choice == 'R'">
    <ask>What changes are needed?</ask>
    <action>Store feedback</action>

    <action>Call: mcp__github__add_issue_comment({
      owner: {{github_owner}},
      repo: {{github_repo}},
      issue_number: {{issue.number}},
      body: "🔄 **Changes Requested by PO @{{current_user}}**\n\n" +
            "{{feedback}}\n\n" +
            "Please address and update for re-review.\n\n" +
            "_Feedback at {{timestamp}}_"
    })</action>

    <action>Update label: status:in-review → status:in-progress</action>

    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 CHANGES REQUESTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story returned to developer for updates.
Developer @{{issue.assignee?.login}} notified.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
  </check>

  <check if="choice == 'D'">
    <output>
Review deferred. Story remains in 'in-review' status.
    </output>
  </check>

  <check if="choice == 'V'">
    <action>Show full issue body and all comments</action>
    <action>Goto step 2 for another choice</action>
  </check>
</step>

</workflow>
