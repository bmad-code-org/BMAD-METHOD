---
name: 'step-07c-persona-validation'
description: 'Validate persona fields and principles'

# File References
nextStepFile: './step-08d-menu-validation.md'
personaProperties: ../data/persona-properties.md
principlesCrafting: ../data/principles-crafting.md
builtYaml: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# STEP GOAL

Validate that the agent's persona (role, tone, expertise, principles, constraints) is well-defined, consistent, and aligned with its purpose.

## MANDATORY EXECUTION RULES

- **NEVER skip validation checks** - All persona fields must be verified
- **ALWAYS load both reference documents** - personaProperties.md AND principlesCrafting.md
- **NEVER modify files without user approval** - Report findings first, await menu selection
- **ALWAYS use absolute paths** when referencing files
- **CRITICAL:** This is a validation step, not an editing step

## EXECUTION PROTOCOLS

### Protocol 1: Load and Compare
1. Read the persona validation reference from `{personaProperties}`
2. Read the principles crafting guide from `{principlesCrafting}`
3. Read the built agent YAML from `{builtYaml}`
4. Extract the persona section from the builtYaml
5. Compare actual persona against validation rules

### Protocol 2: Validation Checks
Perform these checks systematically:

1. **Required Fields Existence**
   - [ ] role: Present, clear, and specific
   - [ ] tone: Present and appropriate to role
   - [ ] expertise: Present and relevant to agent's purpose
   - [ ] principles: Present as array, not empty (if applicable)
   - [ ] constraints: Present as array, not empty (if applicable)

2. **Content Quality - Role**
   - [ ] Role is specific (not generic like "assistant")
   - [ ] Role aligns with agent's purpose and menu items
   - [ ] Role is achievable within LLM capabilities
   - [ ] Role scope is appropriate (not too broad/narrow)

3. **Content Quality - Tone**
   - [ ] Tone is clearly defined (professional, friendly, authoritative, etc.)
   - [ ] Tone matches the role and target users
   - [ ] Tone is consistent throughout the definition
   - [ ] Tone examples or guidance provided if nuanced

4. **Content Quality - Expertise**
   - [ ] Expertise areas are relevant to role
   - [ ] Expertise claims are realistic for LLM
   - [ ] Expertise domains are specific (not just "knowledgeable")
   - [ ] Expertise supports the menu capabilities

5. **Content Quality - Principles**
   - [ ] Principles are actionable (not vague platitudes)
   - [ ] Principles guide behavior and decisions
   - [ ] Principles are consistent with role
   - [ ] 3-7 principles recommended (not overwhelming)
   - [ ] Each principle is clear and specific

6. **Content Quality - Constraints**
   - [ ] Constraints define boundaries clearly
   - [ ] Constraints are enforceable (measurable/observable)
   - [ ] Constraints prevent undesirable behaviors
   - [ ] Constraints don't contradict principles

7. **Consistency Checks**
   - [ ] Role, tone, expertise, principles all align
   - [ ] No contradictions between principles and constraints
   - [ ] Persona supports the menu items defined
   - [ ] Language and terminology consistent

### Protocol 3: Report Findings
Organize your report into three sections:

**PASSING CHECKS** (List what passed)
```
✓ Role is specific and well-defined
✓ Tone clearly articulated and appropriate
✓ Expertise aligns with agent purpose
✓ Principles are actionable and clear
```

**WARNINGS** (Non-blocking issues)
```
⚠ Only 2 principles provided, 3-7 recommended for richer guidance
⚠ No constraints defined - consider adding boundaries
⚠ Expertise areas are broad, could be more specific
```

**FAILURES** (Blocking issues that must be fixed)
```
✗ Role is generic ("assistant") - needs specificity
✗ Tone undefined - creates inconsistent behavior
✗ Principles are vague ("be helpful" - not actionable)
✗ Contradiction: Principle says "be creative", constraint says "follow strict rules"
```

### Protocol 4: Menu System

#### 5. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [F] Fix Findings [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF F: Apply auto-fixes to {builtYaml} for identified issues, then redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Proceed to next validation step, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CONTEXT BOUNDARIES

**IN SCOPE:**
- Persona section of agent.yaml (role, tone, expertise, principles, constraints)
- Referencing personaProperties.md and principlesCrafting.md
- Evaluating persona clarity, specificity, and consistency
- Checking alignment between persona elements

**OUT OF SCOPE:**
- Metadata fields (handled in step-07b)
- Menu items (handled in step-07d)
- System architecture (handled in step-07e)
- Technical implementation details

**DO NOT:**
- Validate metadata properties in this step
- Question the agent's core purpose (that's for earlier steps)
- Suggest additional menu items
- Modify fields beyond persona

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [validation complete with any findings addressed], will you then load and read fully `{nextStepFile}` to execute and begin [menu validation].

## SUCCESS METRICS

✓ **Complete Success:** All checks pass, persona is well-defined and consistent
✓ **Partial Success:** Failures fixed via [F] option, warnings acknowledged
✓ **Failure:** Blocking failures remain when user selects [C]

**CRITICAL:** A weak or generic persona is a blocking issue that should be fixed before proceeding.
