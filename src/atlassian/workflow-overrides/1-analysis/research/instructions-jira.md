# Research — Confluence Output

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: the workflow-jira.yaml for this workflow</critical>

## Overview

Conducts research (market, domain, or technical) using web search and verified sources. The research type is determined by `{research_type}`. Output is written to Confluence as a research report page.

**Prerequisite:** Web search capability required. If unavailable, abort and inform the user.

---

<workflow>

<step n="1" goal="Initialize and discover research context">
<action>Communicate in {communication_language} with {user_name}</action>
<action>Invoke the `read-jira-context` task with `context_type: "project_overview"` to check for existing product brief or other context on Confluence</action>

<action>Greet the user and begin topic discovery:</action>

"Welcome {user_name}! Let's get started with your **{research_type} research**.

**What topic, problem, or area do you want to research?**"

<action>Clarify with the user:</action>
1. **Core Topic**: What exactly about the topic are you most interested in?
2. **Research Goals**: What do you hope to achieve with this research?
3. **Scope**: Should we focus broadly or dive deep into specific aspects?

<action>Set `research_topic` and `research_goals` from the discussion</action>
</step>

<step n="2" goal="Execute research steps">
<action>Follow the standard {research_type} research step files for the research methodology</action>

The research steps vary by type:
- **Market**: Customer behaviour, pain points, decisions, competitive analysis
- **Domain**: Domain analysis, competitive landscape, regulatory focus, technical trends
- **Technical**: Technical overview, integration patterns, architectural patterns, implementation research

<action>Use web search to gather current data and verified sources</action>
<action>Build the research document progressively, citing all sources</action>
</step>

<step n="3" goal="Synthesise research findings">
<action>Compile the final research synthesis:</action>

1. Executive summary of key findings
2. Detailed analysis sections (per research type methodology)
3. Recommendations and implications
4. Source citations with URLs

<action>Format using the research template at `{template}`</action>
<action>Generate the document in {document_output_language}</action>
</step>

<step n="4" goal="Write research report to Confluence and hand off">
<action>Invoke the `write-to-confluence` task with:</action>

```
space_key: "{confluence_space_key}"
parent_page_id: "{confluence_parent_page_id}"
title: "{project_name} — {research_type} Research: {research_topic}"
content: "{compiled_research_report}"
key_map_entry: "confluence_pages.research_{research_type}"
```

<action>Update `{key_map_file}` with the new Confluence page ID under `confluence_pages.research_{research_type}`</action>

<action>Invoke the `post-handoff` task with:</action>

```
handoff_to: "PM"
handoff_type: "research_complete"
summary: "{research_type} research on '{research_topic}' published to Confluence."
confluence_page: "{research_page_id}"
```

<action>Report to user:</action>

**Research Complete: {research_type}**

- **Topic:** {research_topic}
- **Confluence Page:** {research_page_url}
- **Sources Cited:** {source_count}
- **Handoff:** PM agent notified

**Next Steps:**
1. Review the research report on Confluence
2. Run additional research types if needed (market, domain, technical)
3. PM agent can incorporate findings into PRD creation
</step>

</workflow>
