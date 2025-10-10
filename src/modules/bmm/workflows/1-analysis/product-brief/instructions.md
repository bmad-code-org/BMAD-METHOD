# Product Brief - Interactive Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Initialize product brief session">
<action>Welcome the user to the Product Brief creation process</action>
<action>Explain this is a collaborative process to define their product vision</action>
<ask>Ask the user to provide the project name for this product brief</ask>
<template-output>project_name</template-output>
</step>

<step n="1" goal="Gather available inputs and context">
<action>Check what inputs the user has available:</action>
<ask>Do you have any of these documents to help inform the brief?
1. Market research
2. Brainstorming results
3. Competitive analysis
4. Initial product ideas or notes
5. None - let's start fresh

Please share any documents you have or select option 5.</ask>

<action>Load and analyze any provided documents</action>
<action>Extract key insights and themes from input documents</action>

<ask>Based on what you've shared (or if starting fresh), please tell me:

- What's the core problem you're trying to solve?
- Who experiences this problem most acutely?
- What sparked this product idea?</ask>

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
<ask>Let's dig deeper into the problem. Tell me:
- What's the current state that frustrates users?
- Can you quantify the impact? (time lost, money spent, opportunities missed)
- Why do existing solutions fall short?
- Why is solving this urgent now?</ask>

<action>Challenge vague statements and push for specificity</action>
<action>Help the user articulate measurable pain points</action>
<action>Create a compelling problem statement with evidence</action>

<template-output>problem_statement</template-output>
</step>

<step n="4" goal="Develop the proposed solution" if="collaboration_mode == 'interactive'">
<ask>Now let's shape your solution vision:
- What's your core approach to solving this problem?
- What makes your solution different from what exists?
- Why will this succeed where others haven't?
- Paint me a picture of the ideal user experience</ask>

<action>Focus on the "what" and "why", not implementation details</action>
<action>Help articulate key differentiators</action>
<action>Craft a clear solution vision</action>

<template-output>proposed_solution</template-output>
</step>

<step n="5" goal="Identify target users" if="collaboration_mode == 'interactive'">
<ask>Who exactly will use this product? Let's get specific:

For your PRIMARY users:

- What's their demographic/professional profile?
- What are they currently doing to solve this problem?
- What specific pain points do they face?
- What goals are they trying to achieve?

Do you have a SECONDARY user segment? If so, let's define them too.</ask>

<action>Push beyond generic personas like "busy professionals"</action>
<action>Create specific, actionable user profiles</action>
<action>[VISUAL PLACEHOLDER: User persona cards or journey map would be valuable here]</action>

<template-output>primary_user_segment</template-output>
<template-output>secondary_user_segment</template-output>
</step>

<step n="6" goal="Establish goals and success metrics" if="collaboration_mode == 'interactive'">
<ask>What does success look like? Let's set SMART goals:

Business objectives (with measurable outcomes):

- Example: "Acquire 1000 paying users within 6 months"
- Example: "Reduce customer support tickets by 40%"

User success metrics (behaviors/outcomes, not features):

- Example: "Users complete core task in under 2 minutes"
- Example: "70% of users return weekly"

What are your top 3-5 Key Performance Indicators?</ask>

<action>Help formulate specific, measurable goals</action>
<action>Distinguish between business and user success</action>

<template-output>business_objectives</template-output>
<template-output>user_success_metrics</template-output>
<template-output>key_performance_indicators</template-output>
</step>

<step n="7" goal="Define MVP scope" if="collaboration_mode == 'interactive'">
<ask>Let's be ruthless about MVP scope.

What are the absolute MUST-HAVE features for launch?

- Think: What's the minimum to validate your core hypothesis?
- For each feature, why is it essential?

What tempting features need to wait for v2?

- What would be nice but isn't critical?
- What adds complexity without core value?

What would constitute a successful MVP launch?

[VISUAL PLACEHOLDER: Consider a feature priority matrix or MoSCoW diagram]</ask>

<action>Challenge scope creep aggressively</action>
<action>Push for true minimum viability</action>
<action>Clearly separate must-haves from nice-to-haves</action>

<template-output>core_features</template-output>
<template-output>out_of_scope</template-output>
<template-output>mvp_success_criteria</template-output>
</step>

<step n="8" goal="Assess financial impact and ROI">
<ask>Let's talk numbers and strategic value:

**Financial Considerations:**

- What's the expected development investment (budget/resources)?
- What's the revenue potential or cost savings opportunity?
- When do you expect to reach break-even?
- How does this align with available budget?

**Strategic Alignment:**

- Which company OKRs or strategic objectives does this support?
- How does this advance key strategic initiatives?
- What's the opportunity cost of NOT doing this?

[VISUAL PLACEHOLDER: Consider adding a simple ROI projection chart here]</ask>

<action>Help quantify financial impact where possible</action>
<action>Connect to broader company strategy</action>
<action>Document both tangible and intangible value</action>

<template-output>financial_impact</template-output>
<template-output>company_objectives_alignment</template-output>
<template-output>strategic_initiatives</template-output>
</step>

<step n="9" goal="Explore post-MVP vision" optional="true">
<ask>Looking beyond MVP (optional but helpful):

If the MVP succeeds, what comes next?

- Phase 2 features?
- Expansion opportunities?
- Long-term vision (1-2 years)?

This helps ensure MVP decisions align with future direction.</ask>

<template-output>phase_2_features</template-output>
<template-output>long_term_vision</template-output>
<template-output>expansion_opportunities</template-output>
</step>

<step n="10" goal="Document technical considerations">
<ask>Let's capture technical context. These are preferences, not final decisions:

Platform requirements:

- Web, mobile, desktop, or combination?
- Browser/OS support needs?
- Performance requirements?
- Accessibility standards?

Do you have technology preferences or constraints?

- Frontend frameworks?
- Backend preferences?
- Database needs?
- Infrastructure requirements?

Any existing systems to integrate with?</ask>

<action>Check for technical-preferences.yaml file if available</action>
<action>Note these are initial thoughts for PM and architect to consider</action>

<template-output>platform_requirements</template-output>
<template-output>technology_preferences</template-output>
<template-output>architecture_considerations</template-output>
</step>

<step n="11" goal="Identify constraints and assumptions">
<ask>Let's set realistic expectations:

What constraints are you working within?

- Budget or resource limits?
- Timeline or deadline pressures?
- Team size and expertise?
- Technical limitations?

What assumptions are you making?

- About user behavior?
- About the market?
- About technical feasibility?</ask>

<action>Document constraints clearly</action>
<action>List assumptions to validate during development</action>

<template-output>constraints</template-output>
<template-output>key_assumptions</template-output>
</step>

<step n="12" goal="Assess risks and open questions" optional="true">
<ask>What keeps you up at night about this project?

Key risks:

- What could derail the project?
- What's the impact if these risks materialize?

Open questions:

- What do you still need to figure out?
- What needs more research?

[VISUAL PLACEHOLDER: Risk/impact matrix could help prioritize]

Being honest about unknowns helps us prepare.</ask>

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
3. Save and prepare for handoff to PM

This brief will serve as the primary input for creating the Product Requirements Document (PRD).</ask>

<template-output>final_brief</template-output>
</step>

</workflow>
