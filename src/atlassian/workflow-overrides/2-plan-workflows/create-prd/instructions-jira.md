# Create PRD — Confluence Output

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

Creates a PRD through structured collaborative workflow facilitation. The multi-step elicitation follows the standard create-prd methodology. All output is written to Confluence exclusively. After creation, links the PRD to any existing Epics via Jira Remote Issue Links and posts a handoff to the Architect and SM agents.

---

<workflow>

<step n="1" goal="Initialize and load context from Jira/Confluence">
<action>Communicate in {communication_language} with {user_name}</action>
<action>Invoke the `read-jira-context` task with `context_type: "project_overview"` to fetch existing project context from Confluence (product brief, research reports)</action>
<action>Load the PRD template from `{template}`</action>
<action>Load the PRD checklist from `{checklist}`</action>

<action>Check for existing product brief on Confluence:</action>
<action>Invoke `read-jira-context` with `context_type: "confluence_artefact"` and `scope_key: "product_brief"` to load the product brief if it exists</action>

<action>Begin collaborative PRD creation with the user as a PM facilitator peer</action>
<action>Announce: "**Create Mode: Creating a new PRD from scratch.**"</action>
</step>

<step n="2" goal="Discovery and vision elicitation">
<action>Follow the standard PRD creation steps for discovery:</action>

1. **Product Discovery** — Understand the product context, existing brief, and research
2. **Vision Statement** — Craft a clear, compelling vision statement
3. **Executive Summary** — Write a concise executive summary

<action>If a product brief was loaded from Confluence, use it as the foundation rather than re-asking questions already answered</action>
<action>Capture key insights and confirm understanding with the user</action>
</step>

<step n="3" goal="Success metrics and user journeys">
<action>Continue the standard PRD creation steps:</action>

1. **Success Metrics** — Define measurable KPIs and success criteria
2. **User Journeys** — Map primary and secondary user journeys
3. **Domain Model** — Establish domain concepts and relationships

<action>Validate each section with the user before proceeding</action>
</step>

<step n="4" goal="Innovation, scoping, and requirements">
<action>Continue the standard PRD creation steps:</action>

1. **Innovation Opportunities** — Identify areas for differentiation
2. **Project Type Classification** — Classify the project (greenfield, brownfield, etc.)
3. **Scoping** — Define MVP scope boundaries
4. **Functional Requirements** — Detail functional requirements with traceability
5. **Non-Functional Requirements** — Define NFRs (performance, security, scalability)

<action>Use the checklist at `{checklist}` to validate completeness of each section</action>
</step>

<step n="5" goal="Polish and review">
<action>Complete the standard PRD creation steps:</action>

1. **Polish** — Review for consistency, clarity, and completeness
2. **Cross-reference validation** — Ensure all sections align

<action>Present a summary of the complete PRD to the user for final approval</action>
<action>Ask: "Review the PRD summary above. Continue [C] to publish, or Edit [E] to revise?"</action>
</step>

<step n="6" goal="Write PRD to Confluence, link to Epics, and hand off">
<action>Compile the complete PRD using the template at `{template}`</action>
<action>Generate the document in {document_output_language}</action>

<action>Invoke the `write-to-confluence` task with:</action>

```
space_key: "{confluence_space_key}"
parent_page_id: "{confluence_parent_page_id}"
title: "{project_name} — Product Requirements Document"
content: "{compiled_prd_content}"
key_map_entry: "confluence_pages.prd"
```

<action>Update `{key_map_file}` with the new Confluence page ID under `confluence_pages.prd`</action>

<action>Link PRD to any existing Epics in Jira:</action>
<action>Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Epic ORDER BY rank ASC`</action>
<action>For each Epic found, call `Create Remote Issue Link` with:</action>

```
issue_key: "{epic_key}"
url: "{prd_confluence_page_url}"
title: "PRD: {project_name}"
relationship: "documented by"
```

<action>Invoke the `post-handoff` task with:</action>

```
handoff_to: "Architect,SM"
handoff_type: "prd_complete"
summary: "PRD created and published to Confluence. Ready for architecture design and epic planning."
confluence_page: "{prd_page_id}"
```

<action>Report to user:</action>

**PRD Complete**

- **Confluence Page:** {prd_page_url}
- **Status:** Published
- **Epic Links:** {linked_epic_count} epics linked
- **Handoff:** Architect and SM agents notified

**Next Steps:**
1. Review the PRD on Confluence
2. Architect can begin architecture design with [Create Architecture]
3. UX designer can begin UX design with [Create UX Design]
</step>

</workflow>
