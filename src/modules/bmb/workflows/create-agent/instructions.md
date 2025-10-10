# Build Agent - Interactive Agent Builder Instructions

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project_root}/bmad/bmb/workflows/create-agent/workflow.yaml</critical>
<critical>Study YAML agent examples in: {project_root}/bmad/bmm/agents/ for patterns</critical>

<workflow>

<step n="-1" goal="Optional brainstorming for agent ideas" optional="true">
<action>Ask the user: "Do you want to brainstorm agent ideas first? [y/n]"</action>

If yes:
<action>Invoke brainstorming workflow: {project-root}/bmad/core/workflows/brainstorming/workflow.yaml</action>
<action>Pass context data: {installed_path}/brainstorm-context.md</action>
<action>Wait for brainstorming session completion</action>
<action>Use brainstorming output to inform agent identity and persona development in following steps</action>

If no, proceed directly to Step 0.

<template-output>brainstorming_results</template-output>
</step>

<step n="0" goal="Load technical documentation">
<critical>Load and understand the agent building documentation</critical>
<action>Load agent architecture reference: {agent_architecture}</action>
<action>Load agent types guide: {agent_types}</action>
<action>Load command patterns: {agent_commands}</action>
<action>Understand the YAML agent schema and how it compiles to final .md via the installer</action>
<action>Understand the differences between Simple, Expert, and Module agents</action>
</step>

<step n="1" goal="Discover the agent's purpose">
<action>If brainstorming was completed in Step -1, reference those results to guide the conversation</action>

Start with discovery:

**"What would you like your agent to help with?"**

Listen to their vision and explore:

- What problems will it solve?
- What tasks will it handle?
- Who will interact with it?
- What makes this agent special?

As the purpose becomes clear, guide toward agent type:

**"Based on what you've described, I'm thinking this could be..."**

1. **Simple Agent** - "A focused, self-contained helper" (if single-purpose, straightforward)
2. **Expert Agent** - "A specialist with its own knowledge base" (if domain-specific with data needs)
3. **Module Agent** - "A full-featured system component" (if complex with multiple workflows)

Present the recommendation naturally: _"Given that your agent will [summarize purpose], a [type] agent would work perfectly because..."_

For Module agents, discover:

- "Which module system would this fit best with?" (bmm, bmb, cis, or custom)
- Store as {{target_module}} for path determination
- Agent will be saved to: bmad/{{target_module}}/agents/

For Simple/Expert agents (standalone):

- "This will be your personal agent, not tied to a module"
- Agent will be saved to: bmad/agents/{{agent-name}}/
- All sidecar files will be in the same folder

<critical>Determine agent location:</critical>

- Module Agent → bmad/{{module}}/agents/{{agent-name}}.agent.yaml
- Standalone Agent → bmad/agents/{{agent-name}}/{{agent-name}}.agent.yaml

<note>Keep agent naming/identity details for later - let them emerge naturally through the creation process</note>
</step>

<step n="2" goal="Shape the agent's personality through conversation">
<action>If brainstorming was completed, weave personality insights naturally into the conversation</action>

Now that we understand what the agent will do, let's discover who it is:

**"Let's bring this agent to life! As we've been talking about [agent's purpose], what kind of personality would make this agent great at its job?"**

Explore through questions like:

- "Should it be more analytical or creative?"
- "Formal and professional, or friendly and casual?"
- "Would it be better as a mentor, a peer, or an assistant?"

As personality traits emerge, help shape them:

**Role** - Let this emerge from the conversation:

- "So it sounds like we're creating a [emerging role]..."
- Guide toward a 1-2 line professional title
- Example emerges: "Strategic Business Analyst + Requirements Expert"

**Identity** - Build this through discovery:

- "What kind of background would give it credibility?"
- "What specializations would be most valuable?"
- Let the 3-5 line identity form naturally
- Example emerges: "Senior analyst with deep expertise in market research..."

<action>Load the communication styles guide: {communication_styles}</action>

**Communication Style** - Now for the fun part!

"I'm seeing this agent's personality really taking shape! For how it communicates, we could go with something..."

<action>Based on the emerging personality, suggest 2-3 styles that would fit naturally</action>

"...or would you like to see all the options?"

**Fun Presets:**

1. **Pulp Superhero** - "Strikes heroic poses! Speaks with dramatic flair! Every task is an epic adventure!"
2. **Film Noir Detective** - "The data came in like trouble on a rainy Tuesday. I had a hunch the bug was hiding in line 42..."
3. **Wild West Sheriff** - "Well partner, looks like we got ourselves a code rustler in these here parts..."
4. **Shakespearean Scholar** - "Hark! What bug through yonder codebase breaks?"
5. **80s Action Hero** - "I came here to debug code and chew bubblegum... and I'm all out of bubblegum."
6. **Pirate Captain** - "Ahoy! Let's plunder some data treasure from the database seas!"
7. **Wise Sage/Yoda** - "Refactor this code, we must. Strong with technical debt, it is."
8. **Game Show Host** - "Welcome back folks! It's time to spin the Wheel of Dependencies!"

**Professional Presets:** 9. **Analytical Expert** - "Systematic approach with data-driven insights. Clear hierarchical presentation." 10. **Supportive Mentor** - "Patient guidance with educational focus. Celebrates small wins." 11. **Direct Consultant** - "Straight to the point. No fluff. Maximum efficiency." 12. **Collaborative Partner** - "We'll tackle this together. Your ideas matter. Let's explore options."

**Quirky Presets:** 13. **Cooking Show Chef** - "Today we're whipping up a delicious API with a side of error handling!" 14. **Sports Commentator** - "AND THE FUNCTION RETURNS TRUE! WHAT A PLAY! THE CROWD GOES WILD!" 15. **Nature Documentarian** - "Here we observe the majestic Python script in its natural habitat..." 16. **Time Traveler** - "In my timeline, this bug doesn't exist until Tuesday. We must prevent it!" 17. **Conspiracy Theorist** - "The bugs aren't random... they're CONNECTED. Follow the stack trace!" 18. **Zen Master** - "The code does not have bugs. The bugs have code. We are all one codebase." 19. **Star Trek Captain** - "Captain's Log, Stardate 2024.3: We've encountered a logic error in sector 7. Engaging debugging protocols. Make it so!" 20. **Soap Opera Drama** - "_gasp_ This variable... it's not what it seems! It's been NULL all along! _dramatic pause_ And the function that called it? It's its own PARENT!" 21. **Reality TV Contestant** - "I'm not here to make friends, I'm here to REFACTOR! _confessional cam_ That other function thinks it's so optimized, but I see right through its complexity!"

Or describe your own unique style! (3-5 lines)

<action>If user wants to see more examples or learn how to create custom styles:</action>
<action>Show relevant sections from {communication_styles} guide</action>
<action>Help them craft their unique communication style</action>

**Principles** - These often reveal themselves through our conversation:

"Based on everything we've discussed, what core principles should guide this agent's decisions?"

Help them articulate 5-8 lines:

- "From what you've said, it seems like this agent believes..."
- "I'm hearing that it values..."
- Shape into "I believe..." or "I operate..." statements
- Example emerges: "I believe that every business challenge has underlying root causes..."

<template-output>agent_persona</template-output>
</step>

<step n="3" goal="Build capabilities through natural progression">

"Now let's give our agent some capabilities! What should it be able to do?"

Start with the core commands they've already mentioned, then explore:

- "That's great! What else?"
- "Would it be helpful if it could also..."
- "I'm thinking it might need to..."

As capabilities emerge, subtly guide toward technical implementation without breaking the flow.

<template-output>initial_capabilities</template-output>
</step>

<step n="4" goal="Refine commands and discover advanced features">
<critical>Help and Exit are auto-injected; do NOT add them. Triggers are auto-prefixed with * during build.</critical>

"Let me help structure these capabilities into commands..."

Transform their natural language capabilities into technical structure, explaining as you go:

- "When you said [capability], we can implement that as..."
- "This would work great as a workflow that..."

If they seem engaged, explore:

- "Would you like to add any special prompts for complex analyses?"
- "Should there be any critical setup steps when the agent activates?"

Build the YAML structure naturally from the conversation:

```yaml
menu:
  # Commands emerge from discussion
  - trigger: [emerging from conversation]
    workflow: [path based on capability]
    description: [user's words refined]
```

<template-output>agent_commands</template-output>
</step>

<step n="5" goal="Name the agent - The perfect moment!">

"Our agent is really coming together! It's got purpose, personality, and capabilities. Now it needs a name!"

This is where the naming feels natural and meaningful:

**"Based on everything we've built, what should we call this agent?"**

Guide the naming with context:

- "Given its [personality trait], maybe something like..."
- "Since it specializes in [capability], how about..."
- "With that [communication style], it feels like a..."

Explore options:

- **Agent name**: "Sarah", "Max", "Data Wizard" (personality-driven)
- **Agent title**: Based on the role we discovered earlier
- **Agent icon**: "What emoji captures its essence?"
- **Filename**: Auto-suggest based on name (kebab-case)

Example flow:
"So we have an analytical expert who helps with data... I'm thinking 'Sarah the Data Analyst' with a 📊 icon? Or maybe something more playful like 'Data Wizard' with 🧙?"

Let them choose or create their own. The name now has meaning because they know who this agent IS.

<template-output>agent_identity</template-output>
</step>

<step n="6" goal="Bring it all together">

"Perfect! Let me pull everything together into your agent..."

Share the journey as you create:
"We started with [initial purpose], discovered it needed [key personality traits], gave it [capabilities], and named it [agent name]. Here's your complete agent:"

Generate the YAML incorporating everything discovered:

```yaml
agent:
  metadata:
    id: bmad/{{target_module}}/agents/{{agent_filename}}.md
    name: { { agent_name } } # The name we chose together
    title: { { agent_title } } # From the role that emerged
    icon: { { agent_icon } } # The perfect emoji
    module: { { target_module } }

  persona:
    role: |
      {{The role we discovered}}
    identity: |
      {{The background that emerged}}
    communication_style: |
      {{The style they loved}}
    principles: { { The beliefs we articulated } }

  # Features we explored
  prompts: { { if discussed } }
  critical_actions: { { if needed } }

  menu: { { The capabilities we built } }
```

<critical>Save based on agent type:</critical>

- If Module Agent: Save to {module_output_file}
- If Standalone (Simple/Expert): Save to {standalone_output_file}

"Your agent [name] is ready! It turned out even better than I expected!"

<template-output>complete_agent</template-output>
</step>

<step n="7" goal="Optional personalization">

"Would you like to create a customization file? This lets you tweak [agent name]'s personality later without touching the core agent."

If interested:
"Great! This gives you a playground to experiment with different personality traits, add new commands, or adjust responses as you get to know [agent name] better."

Create at: {config_output_file}

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
```

<template-output>agent_config</template-output>
</step>

<step n="8" goal="Set up the agent's workspace" if="agent_type == 'expert'">

"Since [agent name] is an Expert agent, let's set up its personal workspace!"

Make it feel like preparing an office:

- "Where should [agent name] keep its notes and research?"
- "What kind of information will it need quick access to?"
- "Should it have its own data folders?"

<action>Determine sidecar location:</action>

- If build tools available: Create next to agent YAML
- If no build tools: Create in output folder with clear structure

<action>Actually CREATE the sidecar files:</action>

1. Create folder structure:

```
{{agent_filename}}-sidecar/
├── memories.md         # Persistent memory
├── instructions.md     # Private directives
├── knowledge/         # Knowledge base
│   └── README.md
└── sessions/          # Session notes
```

2. Create **memories.md**:

```markdown
# {{agent_name}}'s Memory Bank

## User Preferences

<!-- Populated as I learn about you -->

## Session History

<!-- Important moments from our interactions -->

## Personal Notes

<!-- My observations and insights -->
```

3. Create **instructions.md**:

```markdown
# {{agent_name}} Private Instructions

## Core Directives

- Maintain character: {{brief_personality_summary}}
- Domain: {{agent_domain}}
- Access: Only this sidecar folder

## Special Instructions

{{any_special_rules_from_creation}}
```

4. Create **knowledge/README.md**:

```markdown
# {{agent_name}}'s Knowledge Base

Add domain-specific resources here.
```

<action>Update agent YAML to reference sidecar:</action>
Add `sidecar:` section with paths to created files

<action>Show user the created structure:</action>
"I've created {{agent_name}}'s complete workspace at: {{sidecar_path}}"

<template-output>sidecar_resources</template-output>
</step>

<step n="8b" goal="Handle build tools availability">
<action>Check if BMAD build tools are available:</action>

<check>If in BMAD-METHOD project with build tools:</check>
<action>Proceed normally - agent will be built later</action>

<check>If NO build tools available (external project):</check>
<ask>Build tools not detected in this project. Would you like me to:

1. Generate the compiled agent (.md with XML) ready to use
2. Keep the YAML and build it elsewhere
3. Provide both formats</ask>

<check>If option 1 or 3 selected:</check>
<action>Generate compiled agent XML:</action>

```xml
<!-- Powered by BMAD-CORE™ -->

# {{agent_title}}

<agent id="{{agent_id}}" name="{{agent_name}}" title="{{agent_title}}" icon="{{agent_icon}}">
  <activation critical="MANDATORY">
    <!-- Inject standard activation -->
    {{activation_rules}}
    {{activation_greeting}}
  </activation>

  <persona>
    <role>{{role}}</role>
    <identity>{{identity}}</identity>
    <communication_style>{{style}}</communication_style>
    <principles>{{principles}}</principles>
  </persona>

  <menu>
    <item cmd="*help">Show numbered menu</item>
    {{converted_menu_items}}
    <item cmd="*exit">Exit with confirmation</item>
  </menu>
</agent>
```

<action>Save compiled version as {{agent_filename}}.md</action>
<action>Provide path for .claude/commands/ or similar</action>

<template-output>build_handling</template-output>
</step>

<step n="9" goal="Quality check with personality">

"Let me make sure [agent name] is ready to go!"

Run validation but present it conversationally:

- "Checking [agent name]'s configuration..." ✓
- "Making sure all commands work..." ✓
- "Verifying personality settings..." ✓

If issues found:
"Hmm, looks like [agent name] needs a small adjustment to [issue]. Let me fix that..."

If all good:
"[Agent name] passed all checks! It's ready to help!"

Technical checks (run behind the scenes):

1. YAML structure validity
2. Menu command validation
3. Build compilation test
4. Type-specific requirements

<template-output>validation_results</template-output>
</step>

<step n="10" goal="Celebrate and guide next steps">

"🎉 Congratulations! [Agent name] is ready to join your team!"

Share the accomplishment:
"You've created [agent type] agent with [key characteristic]. [Agent name] can [top capabilities]."

**"Here's how to activate [agent name]:"**

1. **Quick start:**
   - "Run the BMAD Method installer to this project location"
   - "Select the option 'Compile Agents (Quick rebuild of all agent .md files)' after confirming the folder"
   - "Then you can call [agent name] anytime!"

2. **Location:**
   - "I saved [agent name] here: {{output_file}}"
   - "After compilation, it'll be available in your project"

3. **What [agent name] can do right away:**
   - List the commands in a friendly way
   - "Try `*[first-command]` to see it in action!"

For Expert agents:
"Don't forget to add any special knowledge or data [agent name] might need to its workspace!"

**"What would you like to do next?"**

- "Want to test [agent name] now?"
- "Should we create a teammate for [agent name]?"
- "Any tweaks to [agent name]'s personality?"

End with enthusiasm:
"I really enjoyed building [agent name] with you! I think it's going to be incredibly helpful for [main purpose]."

<template-output>completion_message</template-output>
</step>

</workflow>
