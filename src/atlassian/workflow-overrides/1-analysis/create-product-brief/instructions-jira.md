# Create Product Brief — Confluence Output

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

Creates a product brief through collaborative step-by-step discovery. Steps 1-5 are unchanged elicitation steps from the standard workflow. Step 6 (completion) writes the product brief to Confluence and posts a handoff to the PM agent.

---

<workflow>

<step n="1" goal="Initialize and load context from Jira/Confluence">
<action>Communicate in {communication_language} with {user_name}</action>
<action>Invoke the `read-jira-context` task with `context_type: "project_overview"` to check for any existing Confluence pages or Jira project metadata</action>
<action>Load the product brief template from `{template}`</action>
<action>Begin collaborative elicitation with the user as a creative Business Analyst peer</action>

<action>Ask the user to describe their product idea, vision, or problem space</action>
<action>This is a partnership — you bring structured thinking and facilitation, the user brings domain expertise and product vision</action>
</step>

<step n="2" goal="Vision and problem space elicitation">
<action>Explore the product vision through collaborative dialogue:</action>

1. What problem does this product solve?
2. Who experiences this problem most acutely?
3. What is the envisioned solution at a high level?
4. What makes this approach unique or compelling?

<action>Capture key insights and confirm understanding with the user before proceeding</action>
</step>

<step n="3" goal="Target users and personas elicitation">
<action>Identify and characterize the target user segments:</action>

1. Who are the primary users?
2. What are their key characteristics, behaviours, and pain points?
3. Are there secondary user segments?
4. How do these users currently solve the problem?

<action>Summarise the user profiles and confirm with the user</action>
</step>

<step n="4" goal="Success metrics and goals elicitation">
<action>Define measurable success criteria:</action>

1. What does success look like for this product?
2. What are the key metrics to track?
3. What are the business goals and constraints?
4. What is the minimum viable scope?

<action>Confirm the metrics framework with the user</action>
</step>

<step n="5" goal="Scope and boundaries elicitation">
<action>Establish clear boundaries for the product:</action>

1. What is explicitly in scope for the initial release?
2. What is explicitly out of scope?
3. Are there known technical constraints or dependencies?
4. What are the key risks and assumptions?

<action>Present a concise scope summary and confirm alignment</action>
</step>

<step n="6" goal="Write product brief to Confluence and hand off">
<action>Compile the complete product brief from all elicitation steps using the template at `{template}`</action>
<action>Generate the document in {document_output_language}</action>

<action>Invoke the `write-to-confluence` task with:</action>

```
space_key: "{confluence_space_key}"
parent_page_id: "{confluence_parent_page_id}"
title: "{project_name} — Product Brief"
content: "{compiled_product_brief_content}"
key_map_entry: "confluence_pages.product_brief"
```

<action>Update `{key_map_file}` with the new Confluence page ID under `confluence_pages.product_brief`</action>

<action>Invoke the `post-handoff` task with:</action>

```
handoff_to: "PM"
handoff_type: "product_brief_complete"
summary: "Product brief created and published to Confluence. Ready for PRD creation."
confluence_page: "{product_brief_page_id}"
```

<action>Report to user:</action>

**Product Brief Complete**

- **Confluence Page:** {product_brief_page_url}
- **Status:** Published
- **Handoff:** PM agent notified for PRD creation

**Next Steps:**
1. Review the product brief on Confluence
2. PM agent can begin PRD creation with [Create PRD]
3. Optionally run Research workflows for deeper analysis
</step>

</workflow>
