# UX/UI Specification Workflow Instructions

<workflow>

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow creates comprehensive UX/UI specifications - can run standalone or as part of plan-project</critical>
<critical>Uses ux-spec-template.md for structured output generation</critical>
<critical>Can optionally generate AI Frontend Prompts for tools like Vercel v0, Lovable.ai</critical>

<critical>DOCUMENT OUTPUT: Professional, precise, actionable UX specs. Use tables/lists over prose. User skill level ({user_skill_level}) affects conversation style ONLY, not document content.</critical>

<step n="0" goal="Check for workflow status">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: init-check</param>
</invoke-workflow>

<check if="status_exists == true">
  <action>Store {{status_file_path}} for later updates</action>
  <action>Set tracking_mode = true</action>
</check>

<check if="status_exists == false">
  <action>Set tracking_mode = false</action>
  <output>Note: Running without workflow tracking. Run `workflow-init` to enable progress tracking.</output>
</check>
</step>

<step n="1" goal="Load context and analyze project requirements">

<action>Determine workflow mode (standalone or integrated)</action>

<check if="mode is standalone">
  <ask>Do you have an existing PRD or requirements document? (y/n)

If yes: Provide the path to the PRD
If no: We'll gather basic requirements to create the UX spec
</ask>
</check>

<check if="no PRD in standalone mode">
  <ask>Let's gather essential information:

1. **Project Description**: What are you building?
2. **Target Users**: Who will use this?
3. **Core Features**: What are the main capabilities? (3-5 key features)
4. **Platform**: Web, mobile, desktop, or multi-platform?
5. **Existing Brand/Design**: Any existing style guide or brand to follow?
   </ask>
   </check>

<check if="PRD exists or integrated mode">
  <action>Load the following documents if available:</action>

- PRD.md (primary source for requirements and user journeys)
- epics.md (helps understand feature grouping)
- tech-spec.md (understand technical constraints)
- solution-architecture.md (if Level 3-4 project)
- bmm-workflow-status.md (understand project level and scope)

</check>

<action>Analyze project for UX complexity:</action>

- Number of user-facing features
- Types of users/personas mentioned
- Interaction complexity
- Platform requirements (web, mobile, desktop)

<action>Load ux-spec-template from workflow.yaml</action>

<template-output>project_context</template-output>

</step>

<step n="2" goal="Define UX goals and principles">

<ask>Let's establish the UX foundation. Based on the PRD:

**1. Target User Personas** (extract from PRD or define):

- Primary persona(s)
- Secondary persona(s)
- Their goals and pain points

**2. Key Usability Goals:**
What does success look like for users?

- Ease of learning?
- Efficiency for power users?
- Error prevention?
- Accessibility requirements?

**3. Core Design Principles** (3-5 principles):
What will guide all design decisions?
</ask>

<template-output>user_personas</template-output>
<template-output>usability_goals</template-output>
<template-output>design_principles</template-output>

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

</step>

<step n="3" goal="Create information architecture">

<action>Based on functional requirements from PRD, create site/app structure</action>

**Create comprehensive site map showing:**

- All major sections/screens
- Hierarchical relationships
- Navigation paths

<template-output>site_map</template-output>

**Define navigation structure:**

- Primary navigation items
- Secondary navigation approach
- Mobile navigation strategy
- Breadcrumb structure

<template-output>navigation_structure</template-output>

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

</step>

<step n="4" goal="Design user flows for critical paths">

<action>Extract key user journeys from PRD</action>
<action>For each critical user task, create detailed flow</action>

<for-each journey="user_journeys_from_prd">

**Flow: {{journey_name}}**

Define:

- User goal
- Entry points
- Step-by-step flow with decision points
- Success criteria
- Error states and edge cases

Create Mermaid diagram showing complete flow.

<template-output>user*flow*{{journey_number}}</template-output>

</for-each>

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

</step>

<step n="5" goal="Define component library approach">

<ask>Component Library Strategy:

**1. Design System Approach:**

- [ ] Use existing system (Material UI, Ant Design, etc.)
- [ ] Create custom component library
- [ ] Hybrid approach

**2. If using existing, which one?**

**3. Core Components Needed** (based on PRD features):
We'll need to define states and variants for key components.
</ask>

<action>For primary components, define:</action>

- Component purpose
- Variants needed
- States (default, hover, active, disabled, error)
- Usage guidelines

<template-output>design_system_approach</template-output>
<template-output>core_components</template-output>

</step>

<step n="6" goal="Establish visual design foundation">

<ask>Visual Design Foundation:

**1. Brand Guidelines:**
Do you have existing brand guidelines to follow? (y/n)

**2. If yes, provide link or key elements.**

**3. If no, let's define basics:**

- Primary brand personality (professional, playful, minimal, bold)
- Industry conventions to follow or break
  </ask>

<action>Define color palette with semantic meanings</action>

<template-output>color_palette</template-output>

<action>Define typography system</action>

<template-output>font_families</template-output>
<template-output>type_scale</template-output>

<action>Define spacing and layout grid</action>

<template-output>spacing_layout</template-output>

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

</step>

<step n="7" goal="Define responsive and accessibility strategy">

**Responsive Design:**

<action>Define breakpoints based on target devices from PRD</action>

<template-output>breakpoints</template-output>

<action>Define adaptation patterns for different screen sizes</action>

<template-output>adaptation_patterns</template-output>

**Accessibility Requirements:**

<action>Based on deployment intent from PRD, define compliance level</action>

<template-output>compliance_target</template-output>
<template-output>accessibility_requirements</template-output>

</step>

<step n="8" goal="Document interaction patterns" optional="true">

<ask>Would you like to define animation and micro-interactions? (y/n)

This is recommended for:

- Consumer-facing applications
- Projects emphasizing user delight
- Complex state transitions
  </ask>

<check if="yes or fuzzy match the user wants to define animation or micro interactions">

<action>Define motion principles</action>
<template-output>motion_principles</template-output>

<action>Define key animations and transitions</action>
<template-output>key_animations</template-output>
</check>

</step>

<step n="9" goal="Create wireframes and design references" optional="true">

<ask>Design File Strategy:

**1. Will you be creating high-fidelity designs?**

- Yes, in Figma
- Yes, in Sketch
- Yes, in Adobe XD
- No, development from spec
- Other (describe)

**2. For key screens, should we:**

- Reference design file locations
- Create low-fi wireframe descriptions
- Skip visual representations
  </ask>

<template-output if="design files will be created">design_files</template-output>

<check if="wireframe descriptions needed">
  <for-each screen="key_screens">
    <template-output>screen*layout*{{screen_number}}</template-output>
  </for-each>
</check>

</step>

<step n="10" goal="Generate next steps and output options">

## UX Specification Complete

<action>Generate specific next steps based on project level and outputs</action>

<template-output>immediate_actions</template-output>

**Design Handoff Checklist:**

- [ ] All user flows documented
- [ ] Component inventory complete
- [ ] Accessibility requirements defined
- [ ] Responsive strategy clear
- [ ] Brand guidelines incorporated
- [ ] Performance goals established

<check if="Level 3-4 project">
  - [ ] Ready for detailed visual design
  - [ ] Frontend architecture can proceed
  - [ ] Story generation can include UX details
</check>

<check if="Level 1-2 project or standalone">
  - [ ] Development can proceed with spec
  - [ ] Component implementation order defined
  - [ ] MVP scope clear

</check>

<template-output>design_handoff_checklist</template-output>

<ask>**✅ UX Specification Complete, {user_name}!**

UX Specification saved to {{ux_spec_file}}

**Additional Output Options:**

1. Generate AI Frontend Prompt (for Vercel v0, Lovable.ai, etc.)
2. Review UX specification
3. Create/update visual designs in design tool
4. Return to planning workflow (if not standalone)
5. Exit

Would you like to generate an AI Frontend Prompt? (y/n):</ask>

<check if="user selects yes or option 1">
  <goto step="11">Generate AI Frontend Prompt</goto>
</check>

</step>

<step n="11" goal="Generate AI Frontend Prompt" optional="true">

<action>Prepare context for AI Frontend Prompt generation</action>

<ask>What type of AI frontend generation are you targeting?

1. **Full application** - Complete multi-page application
2. **Single page** - One complete page/screen
3. **Component set** - Specific components or sections
4. **Design system** - Component library setup

Select option (1-4):</ask>

<action>Gather UX spec details for prompt generation:</action>

- Design system approach
- Color palette and typography
- Key components and their states
- User flows to implement
- Responsive requirements

<invoke-task>{project-root}/bmad/bmm/tasks/ai-fe-prompt.md</invoke-task>

<action>Save AI Frontend Prompt to {{ai_frontend_prompt_file}}</action>

<ask>AI Frontend Prompt saved to {{ai_frontend_prompt_file}}

This prompt is optimized for:

- Vercel v0
- Lovable.ai
- Other AI frontend generation tools

**Remember**: AI-generated code requires careful review and testing!

Next actions:

1. Copy prompt to AI tool
2. Return to UX specification
3. Exit workflow

Select option (1-3):</ask>

</step>

<step n="12" goal="Update status if tracking enabled">

<check if="tracking_mode == true">
  <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
    <param>mode: update</param>
    <param>action: complete_workflow</param>
    <param>workflow_name: ux</param>
  </invoke-workflow>

  <check if="success == true">
    <output>✅ Status updated! Next: {{next_workflow}}</output>
  </check>
</check>
</step>

</workflow>
