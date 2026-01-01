---
name: 'e-09b-validate-persona'
description: 'Validate persona (after edit) - no menu, auto-advance'

nextStepFile: './e-09c-validate-menu.md'
editPlan: '{bmb_creations_output_folder}/edit-plan-{agent-name}.md'
personaProperties: ../data/persona-properties.md
principlesCrafting: ../data/principles-crafting.md
builtYaml: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'

advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Edit Step 9b: Validate Persona (After Edit)

## STEP GOAL

Validate that the agent's persona (role, identity, communication_style, principles) is well-defined, consistent, and aligned with its purpose as defined in personaProperties.md and principlesCrafting.md. Record findings to editPlan and auto-advance.

## MANDATORY EXECUTION RULES

- **NEVER skip validation checks** - All persona fields must be verified
- **ALWAYS load both reference documents** - personaProperties.md AND principlesCrafting.md
- **ALWAYS load the builtYaml** for actual persona content validation
- **ALWAYS use absolute paths** when referencing files
- **CRITICAL:** Load and validate EVERYTHING specified in the personaProperties.md file
- **🚫 NO MENU in this step** - record findings and auto-advance
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS

### Protocol 1: Load and Compare
1. Read the persona validation reference from `{personaProperties}`
2. Read the principles crafting guide from `{principlesCrafting}`
3. Read the built agent YAML from `{builtYaml}`
4. Read the edit plan from `{editPlan}`
5. Extract the persona section from the builtYaml
6. Compare actual persona against ALL validation rules

### Protocol 2: Validation Checks

Perform these checks systematically - validate EVERY rule specified in personaProperties.md:

1. **Required Fields Existence**
   - [ ] role: Present, clear, and specific
   - [ ] identity: Present and defines who the agent is
   - [ ] communication_style: Present and appropriate to role
   - [ ] principles: Present as array, not empty (if applicable)

2. **Content Quality - Role**
   - [ ] Role is specific (not generic like "assistant")
   - [ ] Role aligns with agent's purpose and menu items
   - [ ] Role is achievable within LLM capabilities
   - [ ] Role scope is appropriate (not too broad/narrow)

3. **Content Quality - Identity**
   - [ ] Identity clearly defines the agent's character
   - [ ] Identity is consistent with the role
   - [ ] Identity provides context for behavior
   - [ ] Identity is not generic or cliché

4. **Content Quality - Communication Style**
   - [ ] Communication style is clearly defined
   - [ ] Style matches the role and target users
   - [ ] Style is consistent throughout the definition
   - [ ] Style examples or guidance provided if nuanced
   - [ ] Style focuses on speech patterns only (not behavior)

5. **Content Quality - Principles**
   - [ ] Principles are actionable (not vague platitudes)
   - [ ] Principles guide behavior and decisions
   - [ ] Principles are consistent with role
   - [ ] 3-7 principles recommended (not overwhelming)
   - [ ] Each principle is clear and specific
   - [ ] First principle activates expert knowledge domain

6. **Consistency Checks**
   - [ ] Role, identity, communication_style, principles all align
   - [ ] No contradictions between principles
   - [ ] Persona supports the menu items defined
   - [ ] Language and terminology consistent

### Protocol 3: Record Findings

Organize findings into three sections and append to editPlan frontmatter under `validationAfter.persona`:

```yaml
validationAfter:
  persona:
    status: [pass|fail|warning]
    passing:
      - "{check description}"
      - "{check description}"
    warnings:
      - "{non-blocking issue}"
    failures:
      - "{blocking issue that must be fixed}"
```

**PASSING CHECKS** (List what passed)
```
✓ Role is specific and well-defined
✓ Identity clearly articulated and appropriate
✓ Communication style clearly defined
✓ Principles are actionable and clear
✓ First principle activates expert knowledge
```

**WARNINGS** (Non-blocking issues)
```
⚠ Only 2 principles provided, 3-7 recommended for richer guidance
⚠ Communication style could be more specific
⚠ Expertise areas are broad, could be more specific
```

**FAILURES** (Blocking issues that must be fixed)
```
✗ Role is generic ("assistant") - needs specificity
✗ Communication style undefined - creates inconsistent behavior
✗ Principles are vague ("be helpful" - not actionable)
✗ First principle doesn't activate expert knowledge
```

### Protocol 4: Auto-Advance

**🚫 NO MENU PRESENTED** - After recording findings, immediately load and execute `{nextStepFile}`

---

**Auto-advancing to menu validation...**

## SUCCESS METRICS

✅ All persona checks from personaProperties.md performed
✅ All checks validated against the actual builtYaml
✅ Findings saved to editPlan with detailed status
✅ Auto-advanced to next step
