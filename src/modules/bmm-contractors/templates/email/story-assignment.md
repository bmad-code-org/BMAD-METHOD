# Story Assignment Email Template
# Variables: contractor_name, story_id, story_title, story_description,
#            acceptance_criteria, technical_context, branch_name, base_branch,
#            deadline, deadline_timezone, project_name, coordinator_name

---
subject: "[{{project_name}}] [{{story_id}}] {{story_title}}"
---

Hi {{contractor_name}},

You've been assigned a new story for **{{project_name}}**.

---

## Story: {{story_id}}

**{{story_title}}**

### Description

{{story_description}}

---

## Acceptance Criteria

{{#each acceptance_criteria}}
- [ ] {{this}}
{{/each}}

---

## Technical Context

{{technical_context}}

---

## Git Information

| Field | Value |
|-------|-------|
| **Branch Name** | `{{branch_name}}` |
| **Base Branch** | `{{base_branch}}` |
| **Repository** | {{repository_url}} |

### Getting Started

```bash
# Clone and create your branch
git checkout {{base_branch}}
git pull origin {{base_branch}}
git checkout -b {{branch_name}}
```

---

## Deadline

**{{deadline}}** ({{deadline_timezone}})

Please acknowledge receipt of this assignment within 24 hours.

---

## Reply Instructions

Please reply to this email with one of the following commands:

| Command | When to Use | Example |
|---------|-------------|---------|
| `ACKNOWLEDGED` | You've received and understand the assignment | "ACKNOWLEDGED - Starting tomorrow" |
| `QUESTION` | You need clarification | "QUESTION - Should login accept email or username?" |
| `BLOCKED` | You're stuck and need help | "BLOCKED - Can't access the test database" |
| `PROGRESS` | Status update | "PROGRESS - 60% complete, finishing tests" |
| `SUBMITTED` | Work is ready for review | "SUBMITTED - PR #123 ready for review" |

---

## Resources

{{#if resources}}
{{#each resources}}
- [{{name}}]({{url}})
{{/each}}
{{else}}
- Project documentation: {{docs_url}}
{{/if}}

---

## Questions?

Reply to this email or reach out to {{coordinator_name}}.

Best regards,
{{coordinator_name}}
Project Coordinator

---

*This is an automated message from the BMAD Contractor Coordination system.*
*Correlation ID: {{correlation_id}}*
