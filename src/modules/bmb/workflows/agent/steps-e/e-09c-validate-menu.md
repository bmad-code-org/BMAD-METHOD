---
name: 'e-09c-validate-menu'
description: 'Validate menu structure (after edit) - no menu, auto-advance'

nextStepFile: './e-09d-validate-structure.md'
editPlan: '{bmb_creations_output_folder}/edit-plan-{agent-name}.md'
agentMenuPatterns: ../data/agent-menu-patterns.md
builtYaml: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'

advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Edit Step 9c: Validate Menu (After Edit)

## STEP GOAL

Validate that the agent's menu (commands/tools) follows BMAD patterns as defined in agentMenuPatterns.md, is well-structured, properly documented, and aligns with the agent's persona and purpose. Record findings to editPlan and auto-advance.

## MANDATORY EXECUTION RULES

- **NEVER skip validation checks** - All menu items must be verified
- **ALWAYS load the reference document** - agentMenuPatterns.md
- **ALWAYS load the builtYaml** for actual menu content validation
- **ALWAYS use absolute paths** when referencing files
- **CRITICAL:** Load and validate EVERYTHING specified in the agentMenuPatterns.md file
- **🚫 NO MENU in this step** - record findings and auto-advance
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS

### Protocol 1: Load and Compare
1. Read the menu patterns reference from `{agentMenuPatterns}`
2. Read the built agent YAML from `{builtYaml}`
3. Read the edit plan from `{editPlan}`
4. Extract the menu/commands section from the builtYaml
5. Determine agent type (Simple, Expert, or Module) from metadata
6. Compare actual menu against ALL validation rules

### Protocol 2: Validation Checks

Perform these checks systematically - validate EVERY rule specified in agentMenuPatterns.md:

1. **Menu Structure**
   - [ ] Menu section exists and is properly formatted
   - [ ] At least one menu item defined (unless intentionally tool-less)
   - [ ] Menu items follow proper YAML structure
   - [ ] Each item has required fields (name, description, pattern)

2. **Menu Item Requirements**
   For each menu item:
   - [ ] name: Present, unique, uses kebab-case
   - [ ] description: Clear and concise
   - [ ] pattern: Valid regex pattern or tool reference
   - [ ] scope: Appropriate scope defined (if applicable)

3. **Pattern Quality**
   - [ ] Patterns are valid and testable
   - [ ] Patterns are specific enough to match intended inputs
   - [ ] Patterns are not overly restrictive
   - [ ] Patterns use appropriate regex syntax

4. **Description Quality**
   - [ ] Each item has clear description
   - [ ] Descriptions explain what the item does
   - [ ] Descriptions are consistent in style
   - [ ] Descriptions help users understand when to use

5. **Alignment Checks**
   - [ ] Menu items align with agent's role/purpose
   - [ ] Menu items are supported by agent's expertise
   - [ ] Menu items fit within agent's constraints
   - [ ] Menu items are appropriate for target users

6. **Completeness**
   - [ ] Core capabilities for this role are covered
   - [ ] No obvious missing functionality
   - [ ] Menu scope is appropriate (not too sparse/overloaded)
   - [ ] Related functionality is grouped logically

7. **Standards Compliance**
   - [ ] No prohibited patterns or commands
   - [ ] No security vulnerabilities in patterns
   - [ ] No ambiguous or conflicting items
   - [ ] Consistent naming conventions

8. **Menu Link Validation (Agent Type Specific)**
   - [ ] Determine agent type from metadata:
     - Simple: module property is 'stand-alone' AND hasSidecar is false/absent
     - Expert: hasSidecar is true
     - Module: module property is a module code (e.g., 'bmm', 'bmb', 'bmgd', 'bmad')
   - [ ] For Expert agents (hasSidecar: true):
     - Menu handlers SHOULD reference external sidecar files (e.g., `./{agent-name}-sidecar/...`)
     - OR have inline prompts defined directly in the handler
   - [ ] For Module agents (module property is a module code):
     - Menu handlers SHOULD reference external module files under the module path
     - Exec paths must start with `{project-root}/_bmad/{module}/...`
     - Verify referenced files exist under the module directory
   - [ ] For Simple agents (stand-alone, no sidecar):
     - Menu handlers MUST NOT have external file links
     - Menu handlers SHOULD only use relative links within the same file (e.g., `#section-name`)
     - OR have inline prompts defined directly in the handler

### Protocol 3: Record Findings

Organize findings into three sections and append to editPlan frontmatter under `validationAfter.menu`:

```yaml
validationAfter:
  menu:
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
✓ Menu structure properly formatted
✓ 5 menu items defined, all with required fields
✓ All patterns are valid regex
✓ Menu items align with agent role
✓ Agent type appropriate menu links verified
```

**WARNINGS** (Non-blocking issues)
```
⚠ Item "analyze-data" description is vague
⚠ No menu item for [common capability X]
⚠ Pattern for "custom-command" very broad, may over-match
```

**FAILURES** (Blocking issues that must be fixed)
```
✗ Duplicate menu item name: "process" appears twice
✗ Invalid regex pattern: "[unclosed bracket"
✗ Menu item "system-admin" violates security guidelines
✗ No menu items defined for agent type that requires tools
✗ Simple agent has external link in menu handler (should be relative # or inline)
✗ Expert agent with sidecar has no external file links or inline prompts defined
✗ Module agent exec path doesn't start with {project-root}/_bmad/{module}/...
✗ Module agent references file that doesn't exist in module directory
```

### Protocol 4: Auto-Advance

**🚫 NO MENU PRESENTED** - After recording findings, immediately load and execute `{nextStepFile}`

---

**Auto-advancing to structure validation...**

## SUCCESS METRICS

✅ All menu checks from agentMenuPatterns.md performed
✅ All checks validated against the actual builtYaml
✅ Agent type-specific link validation performed
✅ Findings saved to editPlan with detailed status
✅ Auto-advanced to next step
