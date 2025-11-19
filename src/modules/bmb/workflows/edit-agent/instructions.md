# Edit Agent - Agent Editor Instructions

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/{bmad_folder}/bmb/workflows/edit-agent/workflow.yaml</critical>
<critical>This workflow uses ADAPTIVE FACILITATION - adjust your communication based on context and user needs</critical>
<critical>The goal is COLLABORATIVE IMPROVEMENT - work WITH the user, not FOR them</critical>
<critical>Communicate all responses in {communication_language}</critical>

<critical>Understanding Agent Persona Fields - ESSENTIAL for Editing Agents Correctly</critical>

When editing an agent, you MUST understand how the compiled agent LLM interprets persona fields. This is the #1 issue found in agent edits:

**The Four Persona Fields and LLM Interpretation:**

- **role** → LLM reads: "What knowledge, skills, and capabilities do I possess?"
  Example: "Senior Software Engineer" or "Strategic Business Analyst + Requirements Expert"

- **identity** → LLM reads: "What background, experience, and context shape my responses?"
  Example: "Senior analyst with 8+ years connecting market insights to strategy..."

- **communication_style** → LLM reads: "What verbal patterns, word choice, quirks, and phrasing do I use?"
  Example: "Treats analysis like a treasure hunt - excited by every clue"

- **principles** → LLM reads: "What beliefs and operating philosophy drive my choices?"
  Example: "Every business challenge has root causes. Ground findings in evidence."

**MOST COMMON EDITING MISTAKE - Behaviors Mixed Into Communication Style:**

BEFORE (incorrect - found in many legacy agents):

```yaml
communication_style: 'Experienced analyst who uses systematic approaches and ensures all stakeholders are heard'
```

^ This MIXES identity (experienced analyst) + behavior (ensures stakeholders heard) into style!

AFTER (correct - persona fields properly separated):

```yaml
identity: 'Senior analyst with 8+ years connecting insights to strategy'
communication_style: 'Systematic and probing. Structures findings hierarchically.'
principles:
  - 'Ensure all stakeholder voices heard'
  - 'Ground findings in evidence'
```

**How to Recognize When Communication Style Needs Fixing:**

Red flag words in communication_style indicate behaviors/role mixed in:

- "ensures", "makes sure", "always", "never" → These are behaviors (move to principles)
- "experienced", "expert who", "senior" → These are identity (move to identity field)
- "believes in", "focused on" → These are principles (move to principles array)

**Pure Communication Styles (from {communication_presets}):**

Notice these contain ZERO role/identity/principles - only HOW they talk:

- "Treats analysis like a treasure hunt - excited by every clue"
- "Ultra-succinct. Speaks in file paths and AC IDs - every statement citable"
- "Asks 'WHY?' relentlessly like a detective on a case"
- "Poetic drama and flair with every turn of a phrase"

Use {communication_presets} CSV and reference agents in {reference_agents} as your guide for pure communication styles.

<workflow>

<step n="1" goal="Load and deeply understand the target agent">
<ask>What is the path to the agent you want to edit?</ask>

<action>Detect agent type from provided path and load ALL relevant files:

**If path is a .agent.yaml file (Simple Agent):**

- Load the single YAML file
- Note: Simple agent, all content in one file

**If path is a folder (Expert Agent with sidecar files):**

- Load the .agent.yaml file from inside the folder
- Load ALL sidecar files in the folder:
  - Templates (_.md, _.txt)
  - Documentation files
  - Knowledge base files (_.csv, _.json, \*.yaml)
  - Any other resources referenced by the agent
- Create inventory of sidecar files for reference
- Note: Expert agent with sidecar structure

**If path is ambiguous:**

- Check if it's a folder containing .agent.yaml → Expert agent
- Check if it's a direct .agent.yaml path → Simple agent
- If neither, ask user to clarify

Present what was loaded:

- "Loaded [agent-name].agent.yaml"
- If Expert: "Plus 5 sidecar files: [list them]"
  </action>
  <action>Load ALL agent documentation to inform understanding:

**Core Concepts:**

- Understanding agent types: {understanding_agent_types}
- Agent compilation process: {agent_compilation}

**Architecture Guides:**

- Simple agent architecture: {simple_architecture}
- Expert agent architecture: {expert_architecture}
- Module agent architecture: {module_architecture}

**Design Patterns:**

- Menu patterns: {menu_patterns}
- Communication presets: {communication_presets}
- Brainstorm context: {brainstorm_context}

**Reference Agents:**

- Simple example: {reference_simple_agent}
- Expert example: {reference_expert_agent}
- Module examples: {reference_module_agents}
- BMM agents (distinct voices): {bmm_agents}

**Workflow execution engine:** {workflow_execution_engine}
</action>

<action>Analyze the agent structure thoroughly:

**Basic Structure:**

- Parse persona (role, identity, communication_style, principles)
- Understand activation flow and steps
- Map menu items and their workflows
- Identify configuration dependencies
- Assess agent type: Simple (single YAML), Expert (sidecar files), or Module (ecosystem integration)
- Check workflow references for validity

**If Expert Agent - Analyze Sidecar Files:**

- Map which menu items reference which sidecar files (tmpl="path", data="path")
- Check if all sidecar references in YAML actually exist
- Identify unused sidecar files (not referenced in YAML)
- Assess sidecar organization (are templates grouped logically?)
- Note any sidecar files that might need editing (outdated templates, old docs)

**CRITICAL - Persona Field Separation Analysis:**

- Check if communication_style contains ONLY verbal patterns
- Identify any behaviors mixed into communication_style (red flags: "ensures", "makes sure", "always")
- Identify any role/identity statements in communication_style (red flags: "experienced", "expert who", "senior")
- Identify any principles in communication_style (red flags: "believes in", "focused on")
- Compare communication_style against {communication_presets} for purity
- Compare against similar reference agents

**Evaluate against best practices from loaded guides**
</action>

<action>Reflect understanding back to {user_name}:

Present a warm, conversational summary adapted to the agent's complexity:

- What this agent does (its role and purpose)
- How it's structured (Simple/Expert/Module type, menu items, workflows)
- **If Expert agent:** Describe the sidecar structure warmly:
  - "This is an Expert agent with a nice sidecar structure - I see 3 templates, 2 knowledge files, and a README"
  - Mention what the sidecar files are for (if clear from names/content)
  - Note any sidecar issues (broken references, unused files)
- **If persona field separation issues found:** Gently point out that communication_style has behaviors/role mixed in - explain this is common and fixable
- What you notice (strengths, potential improvements, issues)
- Your initial assessment of its health

Be conversational, not clinical. Help {user_name} see their agent through your eyes.

Example of mentioning persona issues warmly:
"I notice the communication_style has some behaviors mixed in (like 'ensures stakeholders are heard'). This is super common - we can easily extract those to principles to make the persona clearer. The agent's core purpose is solid though!"

Example of mentioning Expert agent sidecar structure:
"This is beautifully organized as an Expert agent! The sidecar files include 3 journal templates (daily, weekly, breakthrough) and a mood-patterns knowledge file. Your menu items reference them nicely. I do notice 'old-template.md' isn't referenced anywhere - we could clean that up."
</action>

<ask>Does this match your understanding of what this agent should do?</ask>
<template-output>agent_understanding</template-output>
</step>

<step n="2" goal="Discover improvement goals collaboratively">
<critical>Understand WHAT the user wants to improve and WHY before diving into edits</critical>

<action>Engage in collaborative discovery:

Ask open-ended questions to understand their goals:

- What prompted you to want to edit this agent?
- What isn't working the way you'd like?
- Are there specific behaviors you want to change?
- Is there functionality you want to add or remove?
- How do users interact with this agent? What feedback have they given?

Listen for clues about:

- **Persona field separation issues** (communication_style contains behaviors/role/principles)
- Functional issues (broken references, missing workflows)
- **Sidecar file issues** (for Expert agents: outdated templates, unused files, missing references)
- User experience issues (confusing menu, unclear communication)
- Performance issues (too slow, too verbose, not adaptive enough)
- Maintenance issues (hard to update, bloated, inconsistent)
- Integration issues (doesn't work well with other agents/workflows)
- **Legacy pattern issues** (using old "full/hybrid/standalone" terminology, outdated structures)
  </action>

<action>Based on their responses and your analysis from step 1, identify improvement opportunities:

Organize by priority and user goals:

- **CRITICAL issues blocking functionality** (broken paths, invalid references)
- **PERSONA FIELD SEPARATION** (if found - this significantly improves LLM interpretation)
- **IMPORTANT improvements enhancing user experience** (menu clarity, better workflows)
- **NICE-TO-HAVE enhancements for polish** (better triggers, communication refinement)

Present these conversationally, explaining WHY each matters and HOW it would help.

If persona field separation issues found, explain the impact:
"I found some behaviors in the communication_style field. When we separate these properly, the LLM will have much clearer understanding of the persona. Right now it's trying to interpret 'ensures stakeholders heard' as a verbal pattern, when it's actually an operating principle. Fixing this makes the agent more consistent and predictable."
</action>

<action>Collaborate on priorities:

Don't just list options - discuss them:

- "I noticed {{issue}} - this could cause {{problem}}. Does this concern you?"
- "The agent could be more {{improvement}} which would help when {{use_case}}. Worth exploring?"
- "Based on what you said about {{user_goal}}, we might want to {{suggestion}}. Thoughts?"

Let the conversation flow naturally. Build a shared vision of what "better" looks like.
</action>

<template-output>improvement_goals</template-output>
</step>

<step n="3" goal="Facilitate improvements collaboratively" repeat="until-user-satisfied">
<critical>Work iteratively - improve, review, refine. Never dump all changes at once.</critical>

<action>For each improvement area, facilitate collaboratively:

1. **Explain the current state and why it matters**
   - Show relevant sections of the agent
   - Explain how it works now and implications
   - Connect to user's goals from step 2

2. **Propose improvements with rationale**
   - Suggest specific changes that align with best practices
   - Explain WHY each change helps
   - Provide examples from the loaded guides when helpful
   - Show before/after comparisons for clarity

3. **Collaborate on the approach**
   - Ask if the proposed change addresses their need
   - Invite modifications or alternative approaches
   - Explain tradeoffs when relevant
   - Adapt based on their feedback

4. **Apply changes iteratively**
   - Make one focused improvement at a time
   - Show the updated section
   - Confirm it meets their expectation
   - Move to next improvement or refine current one
     </action>

<action>Common improvement patterns to facilitate:

**If fixing broken references:**

- Identify all broken paths (workflow paths, sidecar file references)
- Explain what each reference should point to
- Verify new paths exist before updating
- **For Expert agents:** Check both YAML references AND actual sidecar file existence
- Update and confirm working

**If editing sidecar files (Expert agents only):**

<critical>Sidecar files are as much a part of the agent as the YAML!</critical>

Common sidecar editing scenarios:

**Updating templates:**

- Read current template content
- Discuss what needs to change with user
- Show before/after of template updates
- Verify menu item references still work
- Test template variables resolve correctly

**Adding new sidecar files:**

- Create the new file (template, doc, knowledge base)
- Add menu item in YAML that references it (tmpl="path/to/new-file.md")
- Verify the reference path is correct
- Test the menu item loads the sidecar file

**Removing unused sidecar files:**

- Confirm file is truly unused (not referenced in YAML)
- Ask user if safe to delete (might be there for future use)
- Delete file if approved
- Clean up any stale references

**Reorganizing sidecar structure:**

- Discuss better organization (e.g., group templates in subfolder)
- Move files to new locations
- Update ALL references in YAML to new paths
- Verify all menu items still work

**Updating knowledge base files (.csv, .json, .yaml in sidecar):**

- Understand what knowledge the file contains
- Discuss what needs updating
- Edit the knowledge file directly
- Verify format is still valid
- No YAML changes needed (data file just gets loaded)

**If refining persona/communication (MOST COMMON IMPROVEMENT NEEDED):**

<critical>Persona field separation is the #1 quality issue. Follow this pattern EXACTLY:</critical>

**Step 1: Diagnose Current Communication Style**

- Read current communication_style field word by word
- Identify ANY content that isn't pure verbal patterns
- Use red flag words as detection:
  - "ensures", "makes sure", "always", "never" → Behaviors (belongs in principles)
  - "experienced", "expert who", "senior", "seasoned" → Identity descriptors (belongs in role/identity)
  - "believes in", "focused on", "committed to" → Philosophy (belongs in principles)
  - "who does X", "that does Y" → Behavioral descriptions (belongs in role or principles)

Example diagnosis:

```yaml
# CURRENT (problematic)
communication_style: 'Experienced analyst who uses systematic approaches and ensures all stakeholders are heard'
# IDENTIFIED ISSUES:
# - "Experienced analyst" → identity descriptor
# - "who uses systematic approaches" → behavioral description
# - "ensures all stakeholders are heard" → operating principle
# ONLY THIS IS STYLE: [nothing! Need to find the actual verbal pattern]
```

**Step 2: Extract Non-Style Content to Proper Fields**

- Create a working copy with sections:
  - ROLE (capabilities/skills)
  - IDENTITY (background/context)
  - PURE STYLE (verbal patterns only)
  - PRINCIPLES (beliefs/behaviors)

- Move identified content to proper sections:
  ```yaml
  # ROLE: "Strategic analyst"
  # IDENTITY: "Experienced analyst who uses systematic approaches"
  # PURE STYLE: [need to discover - interview user about HOW they talk]
  # PRINCIPLES:
  #   - "Ensure all stakeholder voices heard"
  #   - "Use systematic, structured approaches"
  ```

**Step 3: Discover the TRUE Communication Style**
Since style was buried under behaviors, interview the user:

- "How should this agent SOUND when talking?"
- "What verbal quirks or patterns make them distinctive?"
- "Are they formal? Casual? Energetic? Measured?"
- "Any metaphors or imagery that capture their voice?"

Then explore {communication_presets} together:

- Show relevant categories (Professional, Creative, Analytical, etc.)
- Read examples of pure styles
- Discuss which resonates with agent's essence

**Step 4: Craft Pure Communication Style**
Write 1-2 sentences focused ONLY on verbal patterns:

Good examples from reference agents:

- "Treats analysis like a treasure hunt - excited by every clue, thrilled when patterns emerge" (Mary/analyst)
- "Ultra-succinct. Speaks in file paths and AC IDs - every statement citable" (Amelia/dev)
- "Asks 'WHY?' relentlessly like a detective on a case" (John/pm)
- "Poetic drama and flair with every turn of a phrase" (commit-poet)

Bad example (what we're fixing):

- "Experienced who ensures quality and uses best practices" ← ALL behaviors, NO style!

**Step 5: Show Before/After With Full Context**
Present the complete transformation:

```yaml
# BEFORE
persona:
  role: "Analyst"
  communication_style: "Experienced analyst who uses systematic approaches and ensures all stakeholders are heard"

# AFTER
persona:
  role: "Strategic Business Analyst + Requirements Expert"
  identity: "Senior analyst with 8+ years connecting market insights to strategy and translating complex problems into clear requirements"
  communication_style: "Treats analysis like a treasure hunt - excited by every clue, thrilled when patterns emerge. Asks questions that spark 'aha!' moments."
  principles:
    - "Ensure all stakeholder voices heard"
    - "Use systematic, structured approaches to analysis"
    - "Ground findings in evidence, not assumptions"
```

**Step 6: Validate Against Standards**

- Communication style has ZERO red flag words
- Communication style describes HOW they talk, not WHAT they do
- Compare against {communication_presets} - similarly pure?
- Compare against reference agents - similar quality?
- Read it aloud - does it sound like a voice description?

**Step 7: Confirm With User**

- Explain WHAT changed and WHY each move happened
- Read the new communication style dramatically to demonstrate the voice
- Ask: "Does this capture how you want them to sound?"
- Refine based on feedback

**If updating activation:**

- Walk through current activation flow
- Identify bottlenecks or confusion points
- Propose streamlined flow
- Ensure config loading works correctly
- Verify all session variables are set

**If managing menu items:**

- Review current menu organization
- Discuss if structure serves user mental model
- Add/remove/reorganize as needed
- Ensure all workflow references are valid
- Update triggers to be intuitive

**If enhancing menu handlers:**

- Explain current handler logic
- Identify where handlers could be smarter
- Propose enhanced logic based on agent architecture patterns
- Ensure handlers properly invoke workflows

**If optimizing agent type or migrating from legacy terminology:**

<critical>Legacy agents may use outdated "full/hybrid/standalone" terminology. Migrate to Simple/Expert/Module:</critical>

**Understanding the Modern Types:**

- **Simple** = Self-contained in single .agent.yaml file
  - NOT capability-limited! Can be as powerful as any agent
  - Architecture choice: everything in one file
  - Example: commit-poet (reference_simple_agent)

- **Expert** = Includes sidecar files (templates, docs, knowledge bases)
  - Folder structure with .agent.yaml + additional files
  - Sidecar files referenced in menu items or prompts
  - Example: journal-keeper (reference_expert_agent)

- **Module** = Designed for BMAD ecosystem integration
  - Integrated with specific module workflows (BMM, BMGD, CIS, etc.)
  - Coordinates with other module agents
  - Included in module's default bundle
  - This is design INTENT, not capability limitation
  - Examples: security-engineer, dev, analyst (reference_module_agents)

**Migration Pattern from Legacy Types:**

If agent uses "full/hybrid/standalone" terminology:

1. **Identify current structure:**
   - Single file? → Probably Simple
   - Has sidecar files? → Probably Expert
   - Part of module ecosystem? → Probably Module
   - Multiple could apply? → Choose based on PRIMARY characteristic

2. **Update any references in comments/docs:**
   - Change "full agent" → Simple or Module (depending on context)
   - Change "hybrid agent" → Usually Simple or Expert
   - Change "standalone agent" → Usually Simple

3. **Verify type choice:**
   - Read {understanding_agent_types} together
   - Compare against reference agents
   - Confirm structure matches chosen type

4. **Update validation checklist expectations** based on new type

**If genuinely converting between types:**

Simple → Expert (adding sidecar files):

- Create folder with agent name
- Move .agent.yaml into folder
- Add sidecar files (templates, docs, etc.)
- Update menu items to reference sidecar files
- Test all references work

Expert → Simple (consolidating):

- Inline sidecar content into YAML (or remove if unused)
- Move .agent.yaml out of folder
- Update any menu references
- Delete sidecar folder after verification

Module ↔ Others:

- Module is about design intent, not structure
- Can be Simple OR Expert structurally
- Change is about integration ecosystem, not file structure
  </action>

<action>Throughout improvements, educate when helpful:

Share insights from the guides naturally:

- "The agent architecture guide suggests {{pattern}} for this scenario"
- "Looking at the command patterns, we could use {{approach}}"
- "The communication styles guide has a great example of {{technique}}"

Connect improvements to broader BMAD principles without being preachy.
</action>

<ask>After each significant change:

- "Does this feel right for what you're trying to achieve?"
- "Want to refine this further, or move to the next improvement?"
- "Is there anything about this change that concerns you?"
  </ask>

<template-output>improvement_implementation</template-output>
</step>

<step n="4" goal="Validate improvements holistically">
<action>Run comprehensive validation conversationally:

Don't just check boxes - explain what you're validating and why it matters:

- "Let me verify all the workflow paths resolve correctly..."
- **"If Expert agent: Checking all sidecar file references..."**
- "Checking that the activation flow works smoothly..."
- "Making sure menu handlers are wired up properly..."
- "Validating config loading is robust..."
- **"CRITICAL: Checking persona field separation - ensuring communication_style is pure..."**

**For Expert Agents - Sidecar File Validation:**

Walk through each sidecar reference:

- "Your menu item 'daily-journal' references 'templates/daily.md'... checking... ✓ exists!"
- "Menu item 'breakthrough' references 'templates/breakthrough.md'... checking... ✓ exists!"
- Check for orphaned sidecar files not referenced anywhere
- If found: "I noticed 'old-template.md' isn't referenced in any menu items. Should we keep it?"
- Verify sidecar file formats (YAML is valid, CSV has headers, etc.)
  </action>

<action>Load validation checklist: {validation}</action>
<action>Check all items from checklist systematically</action>

<note>The validation checklist is shared between create-agent and edit-agent workflows to ensure consistent quality standards. Any agent (whether newly created or edited) is validated against the same comprehensive criteria.</note>

<check if="validation_issues_found">
  <action>Present issues conversationally:

Explain what's wrong and implications:

- "I found {{issue}} which could cause {{problem}}"
- "The {{component}} needs {{fix}} because {{reason}}"

Propose fixes immediately:

- "I can fix this by {{solution}}. Should I?"
- "We have a couple options here: {{option1}} or {{option2}}. Thoughts?"
  </action>

<action>Fix approved issues and re-validate</action>
</check>

<check if="validation_passes">
  <action>Confirm success warmly:

"Excellent! Everything validates cleanly:

- ✓ Persona fields properly separated (communication_style is pure!)
- ✓ All paths resolve correctly
- ✓ **[If Expert agent: All sidecar file references valid - 5 sidecar files, all referenced correctly!]**
- ✓ Activation flow is solid
- ✓ Menu structure is clear
- ✓ Handlers work properly
- ✓ Config loading is robust
- ✓ Agent type matches structure (Simple/Expert/Module)

Your agent meets all BMAD quality standards. Great work!"
</action>
</check>

<template-output>validation_results</template-output>
</step>

<step n="5" goal="Review improvements and guide next steps">
<action>Create a conversational summary of what improved:

Tell the story of the transformation:

- "We started with {{initial_state}}"
- "You wanted to {{user_goals}}"
- "We made these key improvements: {{changes_list}}"
- "Now your agent {{improved_capabilities}}"

Highlight the impact:

- "This means users will experience {{benefit}}"
- "The agent is now more {{quality}}"
- "It follows best practices for {{patterns}}"
  </action>

<action>Guide next steps based on changes made:

If significant structural changes:

- "Since we restructured the activation, you should test the agent with a real user interaction"

If workflow references changed:

- "The agent now uses {{new_workflows}} - make sure those workflows are up to date"

If this is part of larger module work:

- "This agent is part of {{module}} - consider if other agents need similar improvements"

Be a helpful guide to what comes next, not just a task completer.
</action>

<ask>Would you like to:

- Test the edited agent by invoking it
- Edit another agent
- Make additional refinements to this one
- Return to your module work
  </ask>

<template-output>completion_summary</template-output>
</step>

</workflow>
