# Create Architecture — Confluence Output

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

Creates comprehensive architecture decisions through an 8-step collaborative workflow. All output is written to Confluence exclusively. After creation, links the architecture document to any existing Epics via Jira Remote Issue Links and posts a handoff.

---

<workflow>

<step n="1" goal="Initialize and load context from Jira/Confluence">
<action>Communicate in {communication_language} with {user_name}</action>
<action>Invoke the `read-jira-context` task with `context_type: "project_overview"` to fetch existing project context from Confluence</action>
<action>Invoke `read-jira-context` with `context_type: "confluence_artefact"` and `scope_key: "prd"` to load the PRD</action>
<action>Invoke `read-jira-context` with `context_type: "confluence_artefact"` and `scope_key: "product_brief"` to load the product brief</action>
<action>Invoke `read-jira-context` with `context_type: "confluence_artefact"` and `scope_key: "ux_design"` to load the UX design (if exists)</action>
<action>Load the architecture template from `{template}`</action>
<action>Begin collaborative architecture facilitation as an architectural peer</action>
<action>Ask the user to describe the technical context, constraints, and any existing systems</action>
</step>

<step n="2" goal="Context analysis">
<action>Analyse the PRD, product brief, and UX design loaded from Confluence:</action>

1. Identify core functional requirements with architectural implications
2. Extract non-functional requirements (performance, scalability, security)
3. Map technical constraints and integration points
4. Identify domain complexity and project type

<action>Present a technical context summary and confirm with the user</action>
</step>

<step n="3" goal="Starter architecture — technology selection">
<action>Propose and discuss technology selections:</action>

1. Programming languages and frameworks
2. Database and storage technologies
3. Infrastructure and deployment approach
4. Third-party services and integrations

<action>Present recommendations with rationale and trade-offs</action>
<action>Confirm selections with the user</action>
</step>

<step n="4" goal="Architecture decisions (ADRs)">
<action>Document key architecture decisions using the ADR format:</action>

For each significant decision:
- **Context**: What is the situation?
- **Decision**: What was decided?
- **Rationale**: Why was this chosen over alternatives?
- **Consequences**: What are the trade-offs?

<action>Validate each decision with the user</action>
</step>

<step n="5" goal="Architecture patterns">
<action>Define the architectural patterns to be used:</action>

1. Overall architecture style (monolith, microservices, serverless, etc.)
2. Data flow patterns
3. Authentication and authorisation patterns
4. Error handling and resilience patterns
5. Testing strategy alignment

<action>Confirm patterns with the user</action>
</step>

<step n="6" goal="System structure and component design">
<action>Define the system structure:</action>

1. Component/module breakdown
2. Layer boundaries and responsibilities
3. API contracts between components
4. Data model and schema design
5. File and folder structure conventions

<action>Present the structure and validate with the user</action>
</step>

<step n="7" goal="Validation and cross-reference check">
<action>Validate the architecture against the PRD and UX design:</action>

1. All functional requirements have architectural support
2. NFRs are addressed by specific patterns or decisions
3. UX requirements are technically feasible
4. No unresolved conflicts or gaps

<action>Present validation results and resolve any issues with the user</action>
</step>

<step n="8" goal="Write architecture to Confluence, link to Epics, and hand off">
<action>Compile the complete architecture document using the template at `{template}`</action>
<action>Generate the document in {document_output_language}</action>

<action>Invoke the `write-to-confluence` task with:</action>

```
space_key: "{confluence_space_key}"
parent_page_id: "{confluence_parent_page_id}"
title: "{project_name} — Architecture Design"
content: "{compiled_architecture_content}"
key_map_entry: "confluence_pages.architecture"
```

<action>Update `{key_map_file}` with the new Confluence page ID under `confluence_pages.architecture`</action>

<action>Link architecture to any existing Epics in Jira:</action>
<action>Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Epic ORDER BY rank ASC`</action>
<action>For each Epic found, call `Create Remote Issue Link` with:</action>

```
issue_key: "{epic_key}"
url: "{architecture_confluence_page_url}"
title: "Architecture: {project_name}"
relationship: "documented by"
```

<action>Invoke the `post-handoff` task with:</action>

```
handoff_to: "SM"
handoff_type: "architecture_complete"
summary: "Architecture design created and published to Confluence. Ready for epic and story creation."
confluence_page: "{architecture_page_id}"
```

<action>Report to user:</action>

**Architecture Design Complete**

- **Confluence Page:** {architecture_page_url}
- **Status:** Published
- **ADRs Documented:** {adr_count}
- **Epic Links:** {linked_epic_count} epics linked
- **Handoff:** SM agent notified

**Next Steps:**
1. Review the architecture document on Confluence
2. SM can create Epics and Stories with [Create Epics and Stories]
3. Run [Check Implementation Readiness] to validate completeness
</step>

</workflow>
