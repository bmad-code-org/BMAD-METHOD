# Product Brief - Interactive Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<critical>DOCUMENT OUTPUT: Concise, professional, strategically focused. Use tables/lists over prose. User skill level ({user_skill_level}) affects conversation style ONLY, not document content.</critical>

<workflow>

<step n="0" goal="Validate workflow readiness">
<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: validate</param>
  <param>calling_workflow: product-brief</param>
</invoke-workflow>

<check if="status_exists == false">
  <output>{{suggestion}}</output>
  <output>Note: Product Brief is optional. You can continue without status tracking.</output>
  <action>Set standalone_mode = true</action>
</check>

<check if="status_exists == true">
  <action>Store {{status_file_path}} for later updates</action>

  <check if="project_level < 2">
    <output>Note: Product Brief is most valuable for Level 2+ projects. Your project is Level {{project_level}}.</output>
    <output>You may want to skip directly to technical planning instead.</output>
  </check>

  <check if="warning != ''">
    <output>{{warning}}</output>
    <ask>Continue with Product Brief anyway? (y/n)</ask>
    <check if="n">
      <output>Exiting. {{suggestion}}</output>
      <action>Exit workflow</action>
    </check>
  </check>
</check>
</step>

<step n="1" goal="Initialize product brief session">
<action>Welcome the user in {communication_language} to the Product Brief creation process</action>
<action>Explain this is a collaborative process to define their product vision and strategic foundation</action>
<action>Ask the user to provide the project name for this product brief</action>
<template-output>project_name</template-output>
</step>

<step n="1" goal="Gather available inputs and context">
<action>Explore what existing materials the user has available to inform the brief</action>
<action>Offer options for input sources: market research, brainstorming results, competitive analysis, initial ideas, or starting fresh</action>
<action>If documents are provided, load and analyze them to extract key insights, themes, and patterns</action>
<action>Engage the user about their core vision: what problem they're solving, who experiences it most acutely, and what sparked this product idea</action>
<action>Build initial understanding through conversational exploration rather than rigid questioning</action>

<template-output>initial_context</template-output>
</step>

<step n="2" goal="Choose collaboration mode">
<ask>How would you like to work through the brief?

**1. Interactive Mode** - We'll work through each section together, discussing and refining as we go
**2. YOLO Mode** - I'll generate a complete draft based on our conversation so far, then we'll refine it together

Which approach works best for you?</ask>

<action>Store the user's preference for mode</action>
<template-output>collaboration_mode</template-output>
</step>

<step n="3" goal="Define the problem statement" if="collaboration_mode == 'interactive'">
<action>Guide deep exploration of the problem: current state frustrations, quantifiable impact (time/money/opportunities), why existing solutions fall short, urgency of solving now</action>
<action>Challenge vague statements and push for specificity with probing questions</action>
<action>Help the user articulate measurable pain points with evidence</action>
<action>Craft a compelling, evidence-based problem statement</action>

<template-output>problem_statement</template-output>
</step>

<step n="4" goal="Develop the proposed solution" if="collaboration_mode == 'interactive'">
<action>Shape the solution vision by exploring: core approach to solving the problem, key differentiators from existing solutions, why this will succeed, ideal user experience</action>
<action>Focus on the "what" and "why", not implementation details - keep it strategic</action>
<action>Help articulate compelling differentiators that make this solution unique</action>
<action>Craft a clear, inspiring solution vision</action>

<template-output>proposed_solution</template-output>
</step>

<step n="5" goal="Identify target users" if="collaboration_mode == 'interactive'">
<action>Guide detailed definition of primary users: demographic/professional profile, current problem-solving methods, specific pain points, goals they're trying to achieve</action>
<action>Explore secondary user segments if applicable and define how their needs differ</action>
<action>Push beyond generic personas like "busy professionals" - demand specificity and actionable details</action>
<action>Create specific, actionable user profiles that inform product decisions</action>

<template-output>primary_user_segment</template-output>
<template-output>secondary_user_segment</template-output>
</step>

<step n="6" goal="Establish goals and success metrics" if="collaboration_mode == 'interactive'">
<action>Guide establishment of SMART goals across business objectives and user success metrics</action>
<action>Explore measurable business outcomes (user acquisition targets, cost reductions, revenue goals)</action>
<action>Define user success metrics focused on behaviors and outcomes, not features (task completion time, return frequency)</action>
<action>Help formulate specific, measurable goals that distinguish between business and user success</action>
<action>Identify top 3-5 Key Performance Indicators that will track product success</action>

<template-output>business_objectives</template-output>
<template-output>user_success_metrics</template-output>
<template-output>key_performance_indicators</template-output>
</step>

<step n="7" goal="Define MVP scope" if="collaboration_mode == 'interactive'">
<action>Be ruthless about MVP scope - identify absolute MUST-HAVE features for launch that validate the core hypothesis</action>
<action>For each proposed feature, probe why it's essential vs nice-to-have</action>
<action>Identify tempting features that need to wait for v2 - what adds complexity without core value</action>
<action>Define what constitutes a successful MVP launch with clear criteria</action>
<action>Challenge scope creep aggressively and push for true minimum viability</action>
<action>Clearly separate must-haves from nice-to-haves</action>

<template-output>core_features</template-output>
<template-output>out_of_scope</template-output>
<template-output>mvp_success_criteria</template-output>
</step>

<step n="8" goal="Assess financial impact and ROI" if="collaboration_mode == 'interactive'">
<action>Explore financial considerations: development investment, revenue potential, cost savings opportunities, break-even timing, budget alignment</action>
<action>Investigate strategic alignment: company OKRs, strategic objectives, key initiatives supported, opportunity cost of NOT doing this</action>
<action>Help quantify financial impact where possible - both tangible and intangible value</action>
<action>Connect this product to broader company strategy and demonstrate strategic value</action>

<template-output>financial_impact</template-output>
<template-output>company_objectives_alignment</template-output>
<template-output>strategic_initiatives</template-output>
</step>

<step n="9" goal="Explore post-MVP vision" optional="true" if="collaboration_mode == 'interactive'">
<action>Guide exploration of post-MVP future: Phase 2 features, expansion opportunities, long-term vision (1-2 years)</action>
<action>Ensure MVP decisions align with future direction while staying focused on immediate goals</action>

<template-output>phase_2_features</template-output>
<template-output>long_term_vision</template-output>
<template-output>expansion_opportunities</template-output>
</step>

<step n="10" goal="Document technical considerations" if="collaboration_mode == 'interactive'">
<action>Capture technical context as preferences, not final decisions</action>
<action>Explore platform requirements: web/mobile/desktop, browser/OS support, performance needs, accessibility standards</action>
<action>Investigate technology preferences or constraints: frontend/backend frameworks, database needs, infrastructure requirements</action>
<action>Identify existing systems requiring integration</action>
<action>Check for technical-preferences.yaml file if available</action>
<action>Note these are initial thoughts for PM and architect to consider during planning</action>

<template-output>platform_requirements</template-output>
<template-output>technology_preferences</template-output>
<template-output>architecture_considerations</template-output>
</step>

<step n="11" goal="Identify constraints and assumptions" if="collaboration_mode == 'interactive'">
<action>Guide realistic expectations setting around constraints: budget/resource limits, timeline pressures, team size/expertise, technical limitations</action>
<action>Explore assumptions being made about: user behavior, market conditions, technical feasibility</action>
<action>Document constraints clearly and list assumptions that need validation during development</action>

<template-output>constraints</template-output>
<template-output>key_assumptions</template-output>
</step>

<step n="12" goal="Assess risks and open questions" optional="true" if="collaboration_mode == 'interactive'">
<action>Facilitate honest risk assessment: what could derail the project, impact if risks materialize</action>
<action>Document open questions: what still needs figuring out, what needs more research</action>
<action>Help prioritize risks by impact and likelihood</action>
<action>Frame unknowns as opportunities to prepare, not just worries</action>

<template-output>key_risks</template-output>
<template-output>open_questions</template-output>
<template-output>research_areas</template-output>
</step>

<!-- YOLO Mode - Generate everything then refine -->
<step n="3" goal="Generate complete brief draft" if="collaboration_mode == 'yolo'">
<action>Based on initial context and any provided documents, generate a complete product brief covering all sections</action>
<action>Make reasonable assumptions where information is missing</action>
<action>Flag areas that need user validation with [NEEDS CONFIRMATION] tags</action>

<template-output>problem_statement</template-output>
<template-output>proposed_solution</template-output>
<template-output>primary_user_segment</template-output>
<template-output>secondary_user_segment</template-output>
<template-output>business_objectives</template-output>
<template-output>user_success_metrics</template-output>
<template-output>key_performance_indicators</template-output>
<template-output>core_features</template-output>
<template-output>out_of_scope</template-output>
<template-output>mvp_success_criteria</template-output>
<template-output>phase_2_features</template-output>
<template-output>long_term_vision</template-output>
<template-output>expansion_opportunities</template-output>
<template-output>financial_impact</template-output>
<template-output>company_objectives_alignment</template-output>
<template-output>strategic_initiatives</template-output>
<template-output>platform_requirements</template-output>
<template-output>technology_preferences</template-output>
<template-output>architecture_considerations</template-output>
<template-output>constraints</template-output>
<template-output>key_assumptions</template-output>
<template-output>key_risks</template-output>
<template-output>open_questions</template-output>
<template-output>research_areas</template-output>

<action>Present the complete draft to the user</action>
<ask>Here's the complete brief draft. What would you like to adjust or refine?</ask>
</step>

<step n="4" goal="Refine brief sections" repeat="until-approved" if="collaboration_mode == 'yolo'">
<ask>Which section would you like to refine?
1. Problem Statement
2. Proposed Solution
3. Target Users
4. Goals and Metrics
5. MVP Scope
6. Post-MVP Vision
7. Financial Impact and Strategic Alignment
8. Technical Considerations
9. Constraints and Assumptions
10. Risks and Questions
11. Save and continue</ask>

<action>Work with user to refine selected section</action>
<action>Update relevant template outputs</action>
</step>

<!-- Final steps for both modes -->
<step n="13" goal="Create executive summary">
<action>Synthesize all sections into a compelling executive summary</action>
<action>Include:
- Product concept in 1-2 sentences
- Primary problem being solved
- Target market identification
- Key value proposition</action>

<template-output>executive_summary</template-output>
</step>

<step n="14" goal="Compile supporting materials">
<action>If research documents were provided, create a summary of key findings</action>
<action>Document any stakeholder input received during the process</action>
<action>Compile list of reference documents and resources</action>

<template-output>research_summary</template-output>
<template-output>stakeholder_input</template-output>
<template-output>references</template-output>
</step>

<step n="15" goal="Final review and handoff">
<action>Generate the complete product brief document</action>
<action>Review all sections for completeness and consistency</action>
<action>Flag any areas that need PM attention with [PM-TODO] tags</action>

<ask>The product brief is complete! Would you like to:

1. Review the entire document
2. Make final adjustments
3. Generate an executive summary version (3-page limit)
4. Save and prepare for handoff to PM

This brief will serve as the primary input for creating the Product Requirements Document (PRD).</ask>

<check if="user chooses option 3 (executive summary)">
  <action>Create condensed 3-page executive brief focusing on: problem statement, proposed solution, target users, MVP scope, financial impact, and strategic alignment</action>
  <action>Save as: {output_folder}/product-brief-executive-{{project_name}}-{{date}}.md</action>
</check>

<template-output>final_brief</template-output>
<template-output>executive_brief</template-output>
</step>

<step n="16" goal="Update status file on completion">
<check if="standalone_mode != true">
  <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
    <param>mode: update</param>
    <param>action: complete_workflow</param>
    <param>workflow_name: product-brief</param>
  </invoke-workflow>

  <check if="success == true">
    <output>Status updated! Next: {{next_workflow}}</output>
  </check>
</check>

<output>**✅ Product Brief Complete, {user_name}!**

**Brief Document:**

- Product brief saved to {output_folder}/bmm-product-brief-{{project_name}}-{{date}}.md

{{#if standalone_mode != true}}
**Status Updated:**

- Progress tracking updated
- Current workflow marked complete
  {{else}}
  **Note:** Running in standalone mode (no progress tracking)
  {{/if}}

**Next Steps:**

{{#if standalone_mode != true}}

- **Next required:** {{next_workflow}} ({{next_agent}} agent)
- **Optional:** Gather additional stakeholder input or run research workflows before proceeding

Check status anytime with: `workflow-status`
{{else}}
Since no workflow is in progress:

- Refer to the BMM workflow guide if unsure what to do next
- Or run `workflow-init` to create a workflow path and get guided next steps
  {{/if}}
  </output>
  </step>

</workflow>
