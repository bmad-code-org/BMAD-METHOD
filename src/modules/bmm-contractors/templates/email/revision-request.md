# Revision Request Email Template
# Variables: contractor_name, story_id, story_title, pr_number, pr_url,
#            review_summary, required_changes, optional_suggestions,
#            deadline, coordinator_name, project_name

---
subject: "[{{project_name}}] [{{story_id}}] Revisions Requested - {{story_title}}"
---

Hi {{contractor_name}},

Thank you for your submission on **{{story_id}}: {{story_title}}**.

After review, we've identified some changes needed before this can be approved.

---

## Review Summary

{{review_summary}}

---

## Required Changes

These must be addressed before approval:

{{#each required_changes}}
### {{@index}}. {{title}}

{{description}}

{{#if code_location}}
**Location:** `{{code_location}}`
{{/if}}

{{#if example}}
**Example:**
```{{language}}
{{example}}
```
{{/if}}

{{/each}}

---

{{#if optional_suggestions}}
## Suggestions (Optional)

These are recommendations that would improve the code but aren't blocking:

{{#each optional_suggestions}}
- {{this}}
{{/each}}

{{/if}}

---

## Pull Request

- **PR:** [#{{pr_number}}]({{pr_url}})
- **Branch:** `{{branch_name}}`

---

## Deadline for Revisions

Please submit revisions by **{{deadline}}**.

---

## Reply Instructions

After making changes:

1. Push your commits to the same branch
2. Reply to this email with: `SUBMITTED - Revisions complete`

If you have questions about any feedback:
- Reply with: `QUESTION - [your question]`

If you're blocked:
- Reply with: `BLOCKED - [what's blocking you]`

---

## Need Clarification?

If any feedback is unclear, please ask. We want to help you succeed.

Best regards,
{{coordinator_name}}
Project Coordinator

---

*Correlation ID: {{correlation_id}}*
