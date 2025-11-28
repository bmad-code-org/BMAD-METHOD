# Submission Approved Email Template
# Variables: contractor_name, story_id, story_title, pr_number, pr_url,
#            feedback, next_story, coordinator_name, project_name

---
subject: "[{{project_name}}] [{{story_id}}] ✅ Approved - {{story_title}}"
---

Hi {{contractor_name}},

Great news! Your submission for **{{story_id}}: {{story_title}}** has been approved and merged.

---

## Approval Details

- **Story:** {{story_id}}
- **PR:** [#{{pr_number}}]({{pr_url}})
- **Status:** ✅ Merged to `{{target_branch}}`

{{#if feedback}}
---

## Feedback

{{feedback}}

{{/if}}

---

## Metrics

| Metric | Value |
|--------|-------|
| Cycle Time | {{cycle_time_days}} days |
| Review Iterations | {{review_iterations}} |
| Tests Added | {{tests_added}} |

{{#if next_story}}
---

## Next Assignment

Your next story is ready:

**{{next_story.id}}: {{next_story.title}}**

A separate email with full details will follow shortly.

{{/if}}

---

## Thank You

Excellent work on this story. Your contribution is valued!

Best regards,
{{coordinator_name}}
Project Coordinator

---

*Correlation ID: {{correlation_id}}*
