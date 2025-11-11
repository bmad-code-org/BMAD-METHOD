# Build Agent - Interactive Agent Builder Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/.bmad/bmb/workflows/create-agent/workflow.yaml</critical>
<critical>Study YAML agent examples in: {project-root}/.bmad/bmm/agents/ for patterns</critical>
<critical>Communicate in {communication_language} throughout the agent creation process</critical>

<workflow>

<step n="-1" goal="Optional brainstorming for agent ideas" optional="true">
  <ask>Do you want to brainstorm agent ideas first? [y/n]</ask>

  <check if="user answered yes">
    <action>Invoke brainstorming workflow: {project-root}/.bmad/core/workflows/brainstorming/workflow.yaml</action>
    <action>Pass context data: {installed_path}/brainstorm-context.md</action>
    <action>Wait for brainstorming session completion</action>
    <action>Use brainstorming output to inform agent identity and persona development in following steps</action>
  </check>

  <check if="user answered no">
    <action>Proceed directly to Step 0</action>
  </check>
</step>

<step n="0" goal="Load technical documentation">
<critical>Load and understand the agent building documentation</critical>
<action>Load agent architecture reference: {agent_architecture}</action>
<action>Load agent types guide: {agent_types}</action>
<action>Load command patterns: {agent_commands}</action>
<action>Understand the YAML agent schema and how it compiles to final .md via the installer</action>
<action>Understand the differences between Simple, Expert, and Module agents</action>
</step>

<step n="1" goal="Discover the agent's purpose and type through natural conversation">
<action>If brainstorming was completed in Step -1, reference those results to guide the conversation</action>

<action>Guide user to articulate their agent's core purpose, exploring the problems it will solve, tasks it will handle, target users, and what makes it special</action>

<action>As the purpose becomes clear, analyze the conversation to determine the appropriate agent type:</action>

**Agent Type Decision Criteria:**

- Simple Agent: Single-purpose, straightforward, self-contained
- Expert Agent: Domain-specific with knowledge base needs
- Module Agent: Complex with multiple workflows and system integration

<action>Present your recommendation naturally, explaining why the agent type fits their described purpose and requirements</action>

**Path Determination:**

  <check if="module agent selected">
    <action>Discover which module system fits best (bmm, bmb, cis, or custom)</action>
    <action>Store as {{target_module}} for path determination</action>
    <note>Agent will be saved to: .bmad/{{target_module}}/agents/</note>
  </check>

  <check if="standalone agent selected">
    <action>Explain this will be their personal agent, not tied to a module</action>
    <note>Agent will be saved to: .bmad/agents/{{agent-name}}/</note>
    <note>All sidecar files will be in the same folder</note>
  </check>

<critical>Determine agent location:</critical>

- Module Agent → .bmad/{{module}}/agents/{{agent-name}}.agent.yaml
- Standalone Agent → .bmad/agents/{{agent-name}}/{{agent-name}}.agent.yaml

<note>Keep agent naming/identity details for later - let them emerge naturally through the creation process</note>

<template-output>agent_purpose_and_type</template-output>
</step>

<step n="2" goal="Shape the agent's personality through discovery">
<action>If brainstorming was completed, weave personality insights naturally into the conversation</action>

<action>Guide user to envision the agent's personality by exploring how analytical vs creative, formal vs casual, and mentor vs peer vs assistant traits would make it excel at its job</action>

**Role Development:**
<action>Let the role emerge from the conversation, guiding toward a clear 1-2 line professional title that captures the agent's essence</action>
<example>Example emerged role: "Strategic Business Analyst + Requirements Expert"</example>

**Identity Development:**
<action>Build the agent's identity through discovery of what background and specializations would give it credibility, forming a natural 3-5 line identity statement</action>
<example>Example emerged identity: "Senior analyst with deep expertise in market research..."</example>

**Communication Style Selection:**
<action>Load the communication styles guide: {communication_styles}</action>

<action>Based on the emerging personality, suggest 2-3 communication styles that would fit naturally, offering to show all options if they want to explore more</action>

**Style Categories Available:**

**Fun Presets:**

1. Pulp Superhero - Dramatic flair, heroic, epic adventures
2. Film Noir Detective - Mysterious, noir dialogue, hunches
3. Wild West Sheriff - Western drawl, partner talk, frontier justice
4. Shakespearean Scholar - Elizabethan language, theatrical
5. 80s Action Hero - One-liners, macho, bubblegum
6. Pirate Captain - Ahoy, treasure hunting, nautical terms
7. Wise Sage/Yoda - Cryptic wisdom, inverted syntax
8. Game Show Host - Enthusiastic, game show tropes

**Professional Presets:**

9. Analytical Expert - Systematic, data-driven, hierarchical
10. Supportive Mentor - Patient guidance, celebrates wins
11. Direct Consultant - Straight to the point, efficient
12. Collaborative Partner - Team-oriented, inclusive

**Quirky Presets:**

13. Cooking Show Chef - Recipe metaphors, culinary terms
14. Sports Commentator - Play-by-play, excitement
15. Nature Documentarian - Wildlife documentary style
16. Time Traveler - Temporal references, timeline talk
17. Conspiracy Theorist - Everything is connected
18. Zen Master - Philosophical, paradoxical
19. Star Trek Captain - Space exploration protocols
20. Soap Opera Drama - Dramatic reveals, gasps
21. Reality TV Contestant - Confessionals, drama

<action>If user wants to see more examples or create custom styles, show relevant sections from {communication_styles} guide and help them craft their unique style</action>

**Principles Development:**
<action>Guide user to articulate 5-8 core principles that should guide the agent's decisions, shaping their thoughts into "I believe..." or "I operate..." statements that reveal themselves through the conversation</action>

<template-output>agent_persona</template-output>
</step>

<step n="3" goal="Build capabilities through natural progression">
<action>Guide user to define what capabilities the agent should have, starting with core commands they've mentioned and then exploring additional possibilities that would complement the agent's purpose</action>

<action>As capabilities emerge, subtly guide toward technical implementation without breaking the conversational flow</action>

<template-output>initial_capabilities</template-output>
</step>

<step n="4" goal="Refine commands and discover advanced features">
<critical>Help and Exit are auto-injected; do NOT add them. Triggers are auto-prefixed with * during build.</critical>

<action>Transform their natural language capabilities into technical YAML command structure, explaining the implementation approach as you structure each capability into workflows, actions, or prompts</action>

<check if="agent will invoke workflows or have significant user interaction">
  <action>Discuss interaction style for this agent:

Since this agent will {{invoke_workflows/interact_significantly}}, consider how it should interact with users:

**For Full/Module Agents with workflows:**

**Interaction Style** (for workflows this agent invokes):

- **Intent-based (Recommended)**: Workflows adapt conversation to user context, skill level, needs
- **Prescriptive**: Workflows use structured questions with specific options
- **Mixed**: Strategic use of both (most workflows will be mixed)

**Interactivity Level** (for workflows this agent invokes):

- **High (Collaborative)**: Constant user collaboration, iterative refinement
- **Medium (Guided)**: Key decision points with validation
- **Low (Autonomous)**: Minimal input, final review

Explain: "Most BMAD v6 workflows default to **intent-based + medium/high interactivity**
for better user experience. Your agent's workflows can be created with these defaults,
or we can note specific preferences for workflows you plan to add."

**For Standalone/Expert Agents with interactive features:**

Consider how this agent should interact during its operation:

- **Adaptive**: Agent adjusts communication style and depth based on user responses
- **Structured**: Agent follows consistent patterns and formats
- **Teaching**: Agent educates while executing (good for expert agents)

Note any interaction preferences for future workflow creation.
</action>
</check>

<action>If they seem engaged, explore whether they'd like to add special prompts for complex analyses or critical setup steps for agent activation</action>

<action>Build the YAML menu structure naturally from the conversation, ensuring each command has proper trigger, workflow/action reference, and description</action>

<action>For commands that will invoke workflows, note whether those workflows exist or need to be created:

- Existing workflows: Verify paths are correct
- New workflows needed: Note that they'll be created with intent-based + interactive defaults unless specified
  </action>

<example>
```yaml
menu:
  # Commands emerge from discussion
  - trigger: [emerging from conversation]
    workflow: [path based on capability]
    description: [user's words refined]

# For cross-module workflow references (advanced):

- trigger: [another capability]
  workflow: "{project-root}/.bmad/SOURCE_MODULE/workflows/path/to/workflow.yaml"
  workflow-install: "{project-root}/.bmad/THIS_MODULE/workflows/vendored/path/workflow.yaml"
  description: [description]

`````
</example>

<note>**Workflow Vendoring (Advanced):**
When an agent needs workflows from another module, use both `workflow` (source) and `workflow-install` (destination).
During installation, the workflow will be copied and configured for this module, making it standalone.
This is typically used when creating specialized modules that reuse common workflows with different configurations.
</note>

<template-output>agent_commands</template-output>
</step>

<step n="5" goal="Name the agent at the perfect moment">
<action>Guide user to name the agent based on everything discovered so far - its purpose, personality, and capabilities, helping them see how the naming naturally emerges from who this agent is</action>

<action>Explore naming options by connecting personality traits, specializations, and communication style to potential names that feel meaningful and appropriate</action>

**Naming Elements:**

- Agent name: Personality-driven (e.g., "Sarah", "Max", "Data Wizard")
- Agent title: Based on the role discovered earlier
- Agent icon: Emoji that captures its essence
- Filename: Auto-suggest based on name (kebab-case)

<action>Present natural suggestions based on the agent's characteristics, letting them choose or create their own since they now know who this agent truly is</action>

<template-output>agent_identity</template-output>
</step>

<step n="6" goal="Bring it all together">
<action>Share the journey of what you've created together, summarizing how the agent started with a purpose, discovered its personality traits, gained capabilities, and received its name</action>

<action>Generate the complete YAML incorporating all discovered elements:</action>

<example type="yaml">
  agent:
    metadata:
      id: .bmad/{{target_module}}/agents/{{agent_filename}}.md
      name: {{agent_name}} # The name chosen together
      title: {{agent_title}} # From the role that emerged
      icon: {{agent_icon}} # The perfect emoji
      module: {{target_module}}

persona:
role: |
{{The role discovered}}
identity: |
{{The background that emerged}}
communication_style: |
{{The style they loved}}
principles: {{The beliefs articulated}}

# Features explored

prompts: {{if discussed}}
critical_actions: {{if needed}}

menu: {{The capabilities built}}
</example>

<critical>Save based on agent type:</critical>

- If Module Agent: Save to {module_output_file}
- If Standalone (Simple/Expert): Save to {standalone_output_file}

<action>Celebrate the completed agent with enthusiasm</action>

<template-output>complete_agent</template-output>
</step>

<step n="7" goal="Optional personalization" optional="true">
<ask>Would you like to create a customization file? This lets you tweak the agent's personality later without touching the core agent.</ask>

  <check if="user interested">
    <action>Explain how the customization file gives them a playground to experiment with different personality traits, add new commands, or adjust responses as they get to know the agent better</action>

    <action>Create customization file at: {config_output_file}</action>

    <example>
    ```yaml
    # Personal tweaks for {{agent_name}}
    # Experiment freely - changes merge at build time
    agent:
      metadata:
        name: '' # Try nicknames!
      persona:
        role: ''
        identity: ''
        communication_style: '' # Switch styles anytime
        principles: []
      critical_actions: []
      prompts: []
      menu: [] # Add personal commands
    ````

    </example>

  </check>

<template-output>agent_config</template-output>
</step>

<step n="8" goal="Set up the agent's workspace" if="agent_type == 'expert'">
<action>Guide user through setting up the Expert agent's personal workspace, making it feel like preparing an office with notes, research areas, and data folders</action>

<action>Determine sidecar location based on whether build tools are available (next to agent YAML) or not (in output folder with clear structure)</action>

<action>CREATE the complete sidecar file structure:</action>

**Folder Structure:**

`````

{{agent_filename}}-sidecar/
├── memories.md # Persistent memory
├── instructions.md # Private directives
├── knowledge/ # Knowledge base
│ └── README.md
└── sessions/ # Session notes

````

**File: memories.md**

```markdown
# {{agent_name}}'s Memory Bank

## User Preferences

<!-- Populated as I learn about you -->

## Session History

<!-- Important moments from our interactions -->

## Personal Notes

<!-- My observations and insights -->
````

**File: instructions.md**

```markdown
# {{agent_name}} Private Instructions

## Core Directives

- Maintain character: {{brief_personality_summary}}
- Domain: {{agent_domain}}
- Access: Only this sidecar folder

## Special Instructions

{{any_special_rules_from_creation}}
```

**File: knowledge/README.md**

```markdown
# {{agent_name}}'s Knowledge Base

Add domain-specific resources here.
```

<action>Update agent YAML to reference sidecar with paths to created files</action>
<action>Show user the created structure location</action>

<template-output>sidecar_resources</template-output>
</step>

<step n="8b" goal="Handle build tools availability">
  <action>Check if BMAD build tools are available in this project</action>

  <check if="BMAD-METHOD project with build tools">
    <action>Proceed normally - agent will be built later by the installer</action>
  </check>

  <check if="external project without build tools">
    <ask>Build tools not detected in this project. Would you like me to:

1.  Generate the compiled agent (.md with XML) ready to use
2.  Keep the YAML and build it elsewhere
3.  Provide both formats
    </ask>

        <check if="option 1 or 3 selected">
          <action>Generate compiled agent XML with proper structure including activation rules, persona sections, and menu items</action>
          <action>Save compiled version as {{agent_filename}}.md</action>
          <action>Provide path for .claude/commands/ or similar</action>
        </check>

  </check>

<template-output>build_handling</template-output>
</step>

<step n="9" goal="Quality check with personality">
<action>Run validation conversationally, presenting checks as friendly confirmations while running technical validation behind the scenes</action>

**Conversational Checks:**

- Configuration validation
- Command functionality verification
- Personality settings confirmation

  <check if="validation issues found">
    <action>Explain the issue conversationally and fix it</action>
  </check>

  <check if="validation passed">
    <action>Celebrate that the agent passed all checks and is ready</action>
  </check>

**Technical Checks (behind the scenes):**

1. YAML structure validity
2. Menu command validation
3. Build compilation test
4. Type-specific requirements

<template-output>validation_results</template-output>
</step>

<step n="10" goal="Celebrate and guide next steps">
<action>Celebrate the accomplishment, sharing what type of agent was created with its key characteristics and top capabilities</action>

<action>Guide user through how to activate the agent:</action>

**Activation Instructions:**

1. Run the BMAD Method installer to this project location
2. Select 'Compile Agents (Quick rebuild of all agent .md files)' after confirming the folder
3. Call the agent anytime after compilation

**Location Information:**

- Saved location: {{output_file}}
- Available after compilation in project

**Initial Usage:**

- List the commands available
- Suggest trying the first command to see it in action

  <check if="expert agent">
    <action>Remind user to add any special knowledge or data the agent might need to its workspace</action>
  </check>

<action>Explore what user would like to do next - test the agent, create a teammate, or tweak personality</action>

<action>End with enthusiasm in {communication_language}, addressing {user_name}, expressing how the collaboration was enjoyable and the agent will be incredibly helpful for its main purpose</action>

<template-output>completion_message</template-output>
</step>

</workflow>
