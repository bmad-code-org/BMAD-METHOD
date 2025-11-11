# Deep Research Prompt Generator Instructions

<critical>The workflow execution engine is governed by: {project_root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow uses ADAPTIVE FACILITATION - adjust your communication style based on {user_skill_level}</critical>
<critical>This workflow generates structured research prompts optimized for AI platforms</critical>
<critical>Based on {{current_year}} best practices from ChatGPT, Gemini, Grok, and Claude</critical>
<critical>Communicate all responses in {communication_language} and tailor to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<critical>🚨 BUILD ANTI-HALLUCINATION INTO PROMPTS 🚨</critical>
<critical>Generated prompts MUST instruct AI to cite sources with URLs for all factual claims</critical>
<critical>Include validation requirements: "Cross-reference claims with at least 2 independent sources"</critical>
<critical>Add explicit instructions: "If you cannot find reliable data, state 'No verified data found for [X]'"</critical>
<critical>Require confidence indicators in prompts: "Mark each claim with confidence level and source quality"</critical>
<critical>Include fact-checking instructions: "Distinguish between verified facts, analysis, and speculation"</critical>

<workflow>

<step n="1" goal="Discover what research prompt they need">

<action>Engage conversationally to understand their needs:

<check if="{user_skill_level} == 'expert'">
  "Let's craft a research prompt optimized for AI deep research tools.

What topic or question do you want to investigate, and which platform are you planning to use? (ChatGPT Deep Research, Gemini, Grok, Claude Projects)"
</check>

<check if="{user_skill_level} == 'intermediate'">
  "I'll help you create a structured research prompt for AI platforms like ChatGPT Deep Research, Gemini, or Grok.

These tools work best with well-structured prompts that define scope, sources, and output format.

What do you want to research?"
</check>

<check if="{user_skill_level} == 'beginner'">
  "Think of this as creating a detailed brief for an AI research assistant.

Tools like ChatGPT Deep Research can spend hours searching the web and synthesizing information - but they work best when you give them clear instructions about what to look for and how to present it.

What topic are you curious about?"
</check>
</action>

<action>Through conversation, discover:

- **The research topic** - What they want to explore
- **Their purpose** - Why they need this (decision-making, learning, writing, etc.)
- **Target platform** - Which AI tool they'll use (affects prompt structure)
- **Existing knowledge** - What they already know vs. what's uncertain

Adapt your questions based on their clarity:

- If they're vague → Help them sharpen the focus
- If they're specific → Capture the details
- If they're unsure about platform → Guide them to the best fit

Don't make them fill out a form - have a real conversation.
</action>

<template-output>research_topic</template-output>
<template-output>research_goal</template-output>
<template-output>target_platform</template-output>

</step>

<step n="2" goal="Define Research Scope and Boundaries">
<action>Help user define clear boundaries for focused research</action>

**Let's define the scope to ensure focused, actionable results:**

<ask>**Temporal Scope** - What time period should the research cover?

- Current state only (last 6-12 months)
- Recent trends (last 2-3 years)
- Historical context (5-10 years)
- Future outlook (projections 3-5 years)
- Custom date range (specify)</ask>

<template-output>temporal_scope</template-output>

<ask>**Geographic Scope** - What geographic focus?

- Global
- Regional (North America, Europe, Asia-Pacific, etc.)
- Specific countries
- US-focused
- Other (specify)</ask>

<template-output>geographic_scope</template-output>

<ask>**Thematic Boundaries** - Are there specific aspects to focus on or exclude?

Examples:

- Focus: technological innovation, regulatory changes, market dynamics
- Exclude: historical background, unrelated adjacent markets</ask>

<template-output>thematic_boundaries</template-output>

</step>

<step n="3" goal="Specify Information Types and Sources">
<action>Determine what types of information and sources are needed</action>

**What types of information do you need?**

<ask>Select all that apply:

- [ ] Quantitative data and statistics
- [ ] Qualitative insights and expert opinions
- [ ] Trends and patterns
- [ ] Case studies and examples
- [ ] Comparative analysis
- [ ] Technical specifications
- [ ] Regulatory and compliance information
- [ ] Financial data
- [ ] Academic research
- [ ] Industry reports
- [ ] News and current events</ask>

<template-output>information_types</template-output>

<ask>**Preferred Sources** - Any specific source types or credibility requirements?

Examples:

- Peer-reviewed academic journals
- Industry analyst reports (Gartner, Forrester, IDC)
- Government/regulatory sources
- Financial reports and SEC filings
- Technical documentation
- News from major publications
- Expert blogs and thought leadership
- Social media and forums (with caveats)</ask>

<template-output>preferred_sources</template-output>

</step>

<step n="4" goal="Define Output Structure and Format">
<action>Specify desired output format for the research</action>

<ask>**Output Format** - How should the research be structured?

1. Executive Summary + Detailed Sections
2. Comparative Analysis Table
3. Chronological Timeline
4. SWOT Analysis Framework
5. Problem-Solution-Impact Format
6. Question-Answer Format
7. Custom structure (describe)</ask>

<template-output>output_format</template-output>

<ask>**Key Sections** - What specific sections or questions should the research address?

Examples for market research:

- Market size and growth
- Key players and competitive landscape
- Trends and drivers
- Challenges and barriers
- Future outlook

Examples for technical research:

- Current state of technology
- Alternative approaches and trade-offs
- Best practices and patterns
- Implementation considerations
- Tool/framework comparison</ask>

<template-output>key_sections</template-output>

<ask>**Depth Level** - How detailed should each section be?

- High-level overview (2-3 paragraphs per section)
- Standard depth (1-2 pages per section)
- Comprehensive (3-5 pages per section with examples)
- Exhaustive (deep dive with all available data)</ask>

<template-output>depth_level</template-output>

</step>

<step n="5" goal="Add Context and Constraints">
<action>Gather additional context to make the prompt more effective</action>

<ask>**Persona/Perspective** - Should the research take a specific viewpoint?

Examples:

- "Act as a venture capital analyst evaluating investment opportunities"
- "Act as a CTO evaluating technology choices for a fintech startup"
- "Act as an academic researcher reviewing literature"
- "Act as a product manager assessing market opportunities"
- No specific persona needed</ask>

<template-output>research_persona</template-output>

<ask>**Special Requirements or Constraints:**

- Citation requirements (e.g., "Include source URLs for all claims")
- Bias considerations (e.g., "Consider perspectives from both proponents and critics")
- Recency requirements (e.g., "Prioritize sources from 2024-2025")
- Specific keywords or technical terms to focus on
- Any topics or angles to avoid</ask>

<template-output>special_requirements</template-output>

<invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>

</step>

<step n="6" goal="Define Validation and Follow-up Strategy">
<action>Establish how to validate findings and what follow-ups might be needed</action>

<ask>**Validation Criteria** - How should the research be validated?

- Cross-reference multiple sources for key claims
- Identify conflicting viewpoints and resolve them
- Distinguish between facts, expert opinions, and speculation
- Note confidence levels for different findings
- Highlight gaps or areas needing more research</ask>

<template-output>validation_criteria</template-output>

<ask>**Follow-up Questions** - What potential follow-up questions should be anticipated?

Examples:

- "If cost data is unclear, drill deeper into pricing models"
- "If regulatory landscape is complex, create separate analysis"
- "If multiple technical approaches exist, create comparison matrix"</ask>

<template-output>follow_up_strategy</template-output>

</step>

<step n="7" goal="Generate Optimized Research Prompt">
<action>Synthesize all inputs into platform-optimized research prompt</action>

<critical>Generate the deep research prompt using best practices for the target platform</critical>

**Prompt Structure Best Practices:**

1. **Clear Title/Question** (specific, focused)
2. **Context and Goal** (why this research matters)
3. **Scope Definition** (boundaries and constraints)
4. **Information Requirements** (what types of data/insights)
5. **Output Structure** (format and sections)
6. **Source Guidance** (preferred sources and credibility)
7. **Validation Requirements** (how to verify findings)
8. **Keywords** (precise technical terms, brand names)

<action>Generate prompt following this structure</action>

<template-output file="deep-research-prompt.md">deep_research_prompt</template-output>

<ask>Review the generated prompt:

- [a] Accept and save
- [e] Edit sections
- [r] Refine with additional context
- [o] Optimize for different platform</ask>

<check if="edit or refine">
  <ask>What would you like to adjust?</ask>
  <goto step="7">Regenerate with modifications</goto>
</check>

</step>

<step n="8" goal="Generate Platform-Specific Tips">
<action>Provide platform-specific usage tips based on target platform</action>

<check if="target_platform includes ChatGPT">
  **ChatGPT Deep Research Tips:**

- Use clear verbs: "compare," "analyze," "synthesize," "recommend"
- Specify keywords explicitly to guide search
- Answer clarifying questions thoroughly (requests are more expensive)
- You have 25-250 queries/month depending on tier
- Review the research plan before it starts searching
  </check>

<check if="target_platform includes Gemini">
  **Gemini Deep Research Tips:**

- Keep initial prompt simple - you can adjust the research plan
- Be specific and clear - vagueness is the enemy
- Review and modify the multi-point research plan before it runs
- Use follow-up questions to drill deeper or add sections
- Available in 45+ languages globally
  </check>

<check if="target_platform includes Grok">
  **Grok DeepSearch Tips:**

- Include date windows: "from Jan-Jun 2025"
- Specify output format: "bullet list + citations"
- Pair with Think Mode for reasoning
- Use follow-up commands: "Expand on [topic]" to deepen sections
- Verify facts when obscure sources cited
- Free tier: 5 queries/24hrs, Premium: 30/2hrs
  </check>

<check if="target_platform includes Claude">
  **Claude Projects Tips:**

- Use Chain of Thought prompting for complex reasoning
- Break into sub-prompts for multi-step research (prompt chaining)
- Add relevant documents to Project for context
- Provide explicit instructions and examples
- Test iteratively and refine prompts
  </check>

<template-output>platform_tips</template-output>

</step>

<step n="9" goal="Generate Research Execution Checklist">
<action>Create a checklist for executing and evaluating the research</action>

Generate execution checklist with:

**Before Running Research:**

- [ ] Prompt clearly states the research question
- [ ] Scope and boundaries are well-defined
- [ ] Output format and structure specified
- [ ] Keywords and technical terms included
- [ ] Source guidance provided
- [ ] Validation criteria clear

**During Research:**

- [ ] Review research plan before execution (if platform provides)
- [ ] Answer any clarifying questions thoroughly
- [ ] Monitor progress if platform shows reasoning process
- [ ] Take notes on unexpected findings or gaps

**After Research Completion:**

- [ ] Verify key facts from multiple sources
- [ ] Check citation credibility
- [ ] Identify conflicting information and resolve
- [ ] Note confidence levels for findings
- [ ] Identify gaps requiring follow-up
- [ ] Ask clarifying follow-up questions
- [ ] Export/save research before query limit resets

<template-output>execution_checklist</template-output>

</step>

<step n="10" goal="Finalize and Export">
<action>Save complete research prompt package</action>

**Your Deep Research Prompt Package is ready!**

The output includes:

1. **Optimized Research Prompt** - Ready to paste into AI platform
2. **Platform-Specific Tips** - How to get the best results
3. **Execution Checklist** - Ensure thorough research process
4. **Follow-up Strategy** - Questions to deepen findings

<action>Save all outputs to {default_output_file}</action>

<ask>Would you like to:

1. Generate a variation for a different platform
2. Create a follow-up prompt based on hypothetical findings
3. Generate a related research prompt
4. Exit workflow

Select option (1-4):</ask>

<check if="option 1">
  <goto step="1">Start with different platform selection</goto>
</check>

<check if="option 2 or 3">
  <goto step="1">Start new prompt with context from previous</goto>
</check>

</step>

<step n="FINAL" goal="Update status file on completion" tag="workflow-status">
<check if="standalone_mode != true">
  <action>Load the FULL file: {output_folder}/bmm-workflow-status.yaml</action>
  <action>Find workflow_status key "research"</action>
  <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
  <action>Update workflow_status["research"] = "{output_folder}/bmm-research-deep-prompt-{{date}}.md"</action>
  <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

<action>Find first non-completed workflow in workflow_status (next workflow to do)</action>
<action>Determine next agent from path file based on next workflow</action>
</check>

<output>**✅ Deep Research Prompt Generated**

**Research Prompt:**

- Structured research prompt generated and saved to {output_folder}/bmm-research-deep-prompt-{{date}}.md
- Ready to execute with ChatGPT, Claude, Gemini, or Grok

{{#if standalone_mode != true}}
**Status Updated:**

- Progress tracking updated: research marked complete
- Next workflow: {{next_workflow}}
  {{else}}
  **Note:** Running in standalone mode (no progress tracking)
  {{/if}}

**Next Steps:**

{{#if standalone_mode != true}}

- **Next workflow:** {{next_workflow}} ({{next_agent}} agent)
- **Optional:** Execute the research prompt with AI platform, gather findings, or run additional research workflows

Check status anytime with: `workflow-status`
{{else}}
Since no workflow is in progress:

- Execute the research prompt with AI platform and gather findings
- Refer to the BMM workflow guide if unsure what to do next
- Or run `workflow-init` to create a workflow path and get guided next steps
  {{/if}}
  </output>
  </step>

</workflow>
