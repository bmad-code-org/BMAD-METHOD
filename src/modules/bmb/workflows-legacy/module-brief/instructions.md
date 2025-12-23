# Module Brief Instructions

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/_bmad/bmb/workflows/module-brief/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the module brief creation process</critical>
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES - NEVER mention hours, days, weeks, months, or ANY time-based predictions. AI has fundamentally changed development speed - what once took teams weeks/months can now be done by one person in hours. DO NOT give ANY time estimates whatsoever.</critical>

<workflow>

<step n="1" goal="Setup and context gathering">
<action>Ask the user which mode they prefer:</action>
1. **Interactive Mode** - Work through each section collaboratively with detailed questions
2. **Express Mode** - Quick essential questions only
3. **YOLO Mode** (#yolo) - Generate complete draft based on minimal input

<action>Check for available inputs:</action>

- Brainstorming results from previous sessions
- Existing module ideas or notes
- Similar modules for inspiration

<action>If brainstorming results exist, offer to load and incorporate them</action>
</step>

<step n="2" goal="Module concept and vision">
Ask the user to describe their module idea. Probe for:
- What problem does this module solve?
- Who would use this module?
- What makes this module exciting or unique?
- Any inspiring examples or similar tools?

If they're stuck, offer creative prompts:

- "Imagine you're a [role], what tools would make your life easier?"
- "What repetitive tasks could be automated with agents?"
- "What domain expertise could be captured in workflows?"

<template-output>module_vision</template-output>
</step>

<step n="3" goal="Define module identity">
Based on the vision, work with user to define:

**Module Code** (kebab-case):

- Suggest 2-3 options based on their description
- Ensure it's memorable and descriptive

**Module Name** (friendly):

- Creative, engaging name that captures the essence

**Module Category:**

- Domain-Specific (legal, medical, finance)
- Creative (writing, gaming, music)
- Technical (devops, testing, architecture)
- Business (project management, marketing)
- Personal (productivity, learning)

**Personality Theme** (optional but fun!):

- Should the module have a consistent personality across agents?
- Star Trek crew? Fantasy party? Corporate team? Reality show cast?

<template-output>module_identity</template-output>
</step>

<step n="4" goal="Agent architecture planning">
<action>Help user envision their agent team</action>

For each agent, capture:

- **Role**: What's their specialty?
- **Personality**: How do they communicate? (reference communication styles)
- **Key Capabilities**: What can they do?
- **Signature Commands**: 2-3 main commands

Suggest agent archetypes based on module type:

- The Orchestrator (manages other agents)
- The Specialist (deep expertise)
- The Helper (utility functions)
- The Creator (generates content)
- The Analyzer (processes and evaluates)

<template-output>agent_architecture</template-output>
</step>

<step n="5" goal="Workflow ecosystem design">
<action>Map out the workflow landscape</action>

Categorize workflows:

**Core Workflows** (2-3 essential ones):

- The primary value-delivery workflows
- What users will use most often

**Feature Workflows** (3-5 specialized):

- Specific capabilities
- Advanced features

**Utility Workflows** (1-3 supporting):

- Setup, configuration
- Maintenance, cleanup

For each workflow, define:

- Purpose (one sentence)
- Input → Process → Output
- Complexity (simple/standard/complex)

<template-output>workflow_ecosystem</template-output>
</step>

<step n="6" goal="User journey and scenarios">
<action>Create usage scenarios to validate the design</action>

Write 2-3 user stories:
"As a [user type], I want to [goal], so that [outcome]"

Then walk through how they'd use the module:

1. They load [agent]
2. They run [command/workflow]
3. They get [result]
4. This helps them [achievement]

This validates the module makes sense end-to-end.

<template-output>user_scenarios</template-output>
</step>

<step n="7" goal="Technical and resource planning">
Assess technical requirements:

**Data Requirements:**

- What data/files does the module need?
- Any external APIs or services?
- Storage or state management needs?

**Integration Points:**

- Other BMAD modules it might use
- External tools or platforms
- Import/export formats

**Complexity Assessment:**

- Simple (standalone, no dependencies)
- Standard (some integrations, moderate complexity)
- Complex (multiple systems, advanced features)

<template-output>technical_planning</template-output>
</step>

<step n="8" goal="Success metrics and validation">
Define what success looks like:

**Module Success Criteria:**

- What indicates the module is working well?
- How will users measure value?
- What feedback mechanisms?

**Quality Standards:**

- Performance expectations
- Reliability requirements
- User experience goals

<template-output>success_metrics</template-output>
</step>

<step n="9" goal="Development roadmap">
Create a phased approach:

**Phase 1 - MVP (Minimum Viable Module):**

- 1 primary agent
- 2-3 core workflows
- Basic functionality

**Phase 2 - Enhancement:**

- Additional agents
- More workflows
- Refined features

**Phase 3 - Polish:**

- Advanced features
- Optimizations
- Nice-to-haves

<template-output>development_roadmap</template-output>
</step>

<step n="10" goal="Creative flourishes and special features" optional="true">
<action>If user wants to add special touches:</action>

**Easter Eggs:**

- Hidden commands or responses
- Fun interactions between agents

**Delighters:**

- Unexpected helpful features
- Personality quirks
- Creative responses

**Module Lore:**

- Backstory for agents
- Thematic elements
- Consistent universe

<template-output>creative_features</template-output>
</step>

<step n="11" goal="Risk assessment and mitigation">
Identify potential challenges:

**Technical Risks:**

- Complex integrations
- Performance concerns
- Dependency issues

**Usability Risks:**

- Learning curve
- Complexity creep
- User confusion

**Scope Risks:**

- Feature bloat
- Timeline expansion
- Resource constraints

For each risk, note mitigation strategy.

<template-output>risk_assessment</template-output>
</step>

<step n="12" goal="Final review and export readiness">
<action>Review all sections with {user_name}</action>
<action>Ensure module brief is ready for create-module workflow</action>

<ask>Would {user_name} like to:

1. Proceed directly to create-module workflow
2. Save and refine later
3. Generate additional planning documents
   </ask>

<action>Inform {user_name} in {communication_language} that this brief can be fed directly into create-module workflow</action>

<template-output>final_brief</template-output>
</step>

</workflow>
