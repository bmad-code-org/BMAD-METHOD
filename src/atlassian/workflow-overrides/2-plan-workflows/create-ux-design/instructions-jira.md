# Create UX Design — Confluence Output

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

Creates a comprehensive UX design specification through a 14-step collaborative visual exploration workflow. All output is written to Confluence exclusively. After creation, links the UX design to any existing Epics via Jira Remote Issue Links and posts a handoff.

---

<workflow>

<step n="1" goal="Initialize and load context from Jira/Confluence">
<action>Communicate in {communication_language} with {user_name}</action>
<action>Invoke the `read-jira-context` task with `context_type: "project_overview"` to fetch existing project context from Confluence</action>
<action>Invoke `read-jira-context` with `context_type: "confluence_artefact"` and `scope_key: "prd"` to load the PRD if it exists</action>
<action>Invoke `read-jira-context` with `context_type: "confluence_artefact"` and `scope_key: "product_brief"` to load the product brief if it exists</action>
<action>Load the UX design template from `{template}`</action>
<action>Begin collaborative UX design facilitation with the user</action>
</step>

<step n="2" goal="Discovery — understand the product context">
<action>Review the PRD and product brief loaded from Confluence</action>
<action>Identify the core user personas, journeys, and requirements that the UX must address</action>
<action>Discuss with the user: target platforms, design constraints, brand guidelines, and inspiration</action>
</step>

<step n="3" goal="Core experience definition">
<action>Define the core experience principles that will guide the design:</action>
1. What is the primary user emotion we want to evoke?
2. What is the single most important interaction?
3. What differentiates this experience from competitors?
<action>Confirm the core experience pillars with the user</action>
</step>

<step n="4" goal="Emotional response mapping">
<action>Map the desired emotional responses across user journeys:</action>
- First impression / onboarding
- Core task execution
- Error handling and recovery
- Achievement and completion
<action>Validate with the user</action>
</step>

<step n="5" goal="Design inspiration and references">
<action>Explore design inspiration with the user:</action>
- Reference applications and design systems
- Visual style preferences (minimal, rich, playful, professional)
- Industry benchmarks and best practices
<action>Document agreed-upon design direction</action>
</step>

<step n="6" goal="Design system foundations">
<action>Establish the design system foundations:</action>
- Typography scale and hierarchy
- Color palette (primary, secondary, semantic)
- Spacing and grid system
- Iconography style
<action>Confirm with the user</action>
</step>

<step n="7" goal="Defining the experience — information architecture">
<action>Define the information architecture:</action>
- Navigation structure and hierarchy
- Content organization patterns
- User flow mapping
<action>Present and validate with the user</action>
</step>

<step n="8" goal="Visual foundation — layout patterns">
<action>Establish visual layout patterns:</action>
- Page layout templates
- Content density guidelines
- Responsive breakpoint strategy
<action>Confirm with the user</action>
</step>

<step n="9" goal="Design directions — key screens">
<action>Create design direction specifications for key screens:</action>
- Landing / home screen
- Primary task screens
- Settings and configuration
<action>Present options and gather user feedback</action>
</step>

<step n="10" goal="User journey wireframes">
<action>Specify wireframe details for primary user journeys:</action>
- Step-by-step flow descriptions
- Screen transitions and interactions
- State management (empty, loading, error, success)
<action>Validate with the user</action>
</step>

<step n="11" goal="Component strategy">
<action>Define the component strategy:</action>
- Reusable component library plan
- Component hierarchy and composition
- Interaction patterns (buttons, forms, modals, etc.)
<action>Confirm with the user</action>
</step>

<step n="12" goal="UX patterns and micro-interactions">
<action>Specify UX patterns and micro-interactions:</action>
- Feedback mechanisms (success, error, progress)
- Animation and transition guidelines
- Gesture and shortcut patterns
<action>Validate with the user</action>
</step>

<step n="13" goal="Responsive design and accessibility">
<action>Define responsive and accessibility specifications:</action>
- Responsive breakpoints and adaptation rules
- WCAG compliance targets
- Keyboard navigation patterns
- Screen reader considerations
- Colour contrast requirements
<action>Confirm with the user</action>
</step>

<step n="14" goal="Write UX design to Confluence, link to Epics, and hand off">
<action>Compile the complete UX design specification using the template at `{template}`</action>
<action>Generate the document in {document_output_language}</action>

<action>Invoke the `write-to-confluence` task with:</action>

```
space_key: "{confluence_space_key}"
parent_page_id: "{confluence_parent_page_id}"
title: "{project_name} — UX Design Specification"
content: "{compiled_ux_design_content}"
key_map_entry: "confluence_pages.ux_design"
```

<action>Update `{key_map_file}` with the new Confluence page ID under `confluence_pages.ux_design`</action>

<action>Link UX design to any existing Epics in Jira:</action>
<action>Call `Search Issues` with JQL: `project = {jira_project_key} AND issuetype = Epic ORDER BY rank ASC`</action>
<action>For each Epic found, call `Create Remote Issue Link` with:</action>

```
issue_key: "{epic_key}"
url: "{ux_design_confluence_page_url}"
title: "UX Design: {project_name}"
relationship: "documented by"
```

<action>Invoke the `post-handoff` task with:</action>

```
handoff_to: "Architect,SM"
handoff_type: "ux_design_complete"
summary: "UX design specification created and published to Confluence. Ready for architecture alignment and story creation."
confluence_page: "{ux_design_page_id}"
```

<action>Report to user:</action>

**UX Design Complete**

- **Confluence Page:** {ux_design_page_url}
- **Status:** Published
- **Epic Links:** {linked_epic_count} epics linked
- **Handoff:** Architect and SM agents notified

**Next Steps:**
1. Review the UX design specification on Confluence
2. Architect can align the architecture with UX requirements
3. SM can incorporate UX specifications into story acceptance criteria
</step>

</workflow>
