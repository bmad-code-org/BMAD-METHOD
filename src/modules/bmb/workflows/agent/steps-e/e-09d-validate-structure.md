---
name: 'e-09d-validate-structure'
description: 'Validate YAML structure (after edit) - no menu, auto-advance'

nextStepFile: './e-09e-validate-sidecar.md'
editPlan: '{bmb_creations_output_folder}/edit-plan-{agent-name}.md'
simpleValidation: ../data/simple-agent-validation.md
expertValidation: ../data/expert-agent-validation.md
agentCompilation: ../data/agent-compilation.md
builtYaml: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'

advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Edit Step 9d: Validate Structure (After Edit)

## STEP GOAL

Validate the built agent YAML file for structural completeness and correctness against the appropriate validation checklist (simple or expert) from agentCompilation.md. Record findings to editPlan and auto-advance.

## MANDATORY EXECUTION RULES

- **NEVER skip validation** - All agents must pass structural validation
- **ALWAYS use the correct validation checklist** based on agent type (simple vs expert)
- **ALWAYS load the builtYaml** for actual structure validation
- **ALWAYS use absolute paths** when referencing files
- **CRITICAL:** Load and validate EVERYTHING specified in the agentCompilation.md file
- **MUST check hasSidecar flag** to determine correct validation standard
- **🚫 NO MENU in this step** - record findings and auto-advance
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS

### Protocol 1: Load and Compare
1. Read the agent compilation reference from `{agentCompilation}`
2. Read the simple validation checklist from `{simpleValidation}`
3. Read the expert validation checklist from `{expertValidation}`
4. Read the built agent YAML from `{builtYaml}`
5. Read the edit plan from `{editPlan}`
6. Determine agent type (simple vs expert) to select correct checklist

### Protocol 2: Validation Checks

Perform these checks systematically - validate EVERY rule specified in agentCompilation.md:

#### A. YAML Syntax Validation
- [ ] Parse YAML without errors
- [ ] Check indentation consistency (2-space standard)
- [ ] Validate proper escaping of special characters
- [ ] Verify no duplicate keys in any section

#### B. Frontmatter Validation
- [ ] All required fields present (name, description, version, etc.)
- [ ] Field values are correct type (string, boolean, array)
- [ ] No empty required fields
- [ ] Proper array formatting with dashes
- [ ] Boolean fields are actual booleans (not strings)

#### C. Section Completeness
- [ ] All required sections present based on agent type
- [ ] Sections not empty unless explicitly optional
- [ ] Proper markdown heading hierarchy (##, ###)
- [ ] No orphaned content without section headers

#### D. Field-Level Validation
- [ ] Path references exist and are valid
- [ ] Array fields properly formatted
- [ ] No malformed YAML structures
- [ ] File references use correct path format

#### E. Agent Type Specific Checks

**For Simple Agents (hasSidecar is false/absent, module is 'stand-alone'):**
- [ ] No sidecar requirements
- [ ] No sidecar-folder path in metadata
- [ ] Basic fields complete
- [ ] No expert-only configuration present
- [ ] Menu handlers use only internal references (#) or inline prompts

**For Expert Agents (hasSidecar is true):**
- [ ] Sidecar flag set correctly in metadata
- [ ] Sidecar folder path specified in metadata
- [ ] All expert fields present
- [ ] Advanced features properly configured
- [ ] Menu handlers reference sidecar files or have inline prompts

**For Module Agents (module is a module code like 'bmm', 'bmb', etc.):**
- [ ] Module property is valid module code
- [ ] Exec paths for menu handlers start with `{project-root}/_bmad/{module}/...`
- [ ] Referenced files exist under the module directory
- [ ] If also hasSidecar: true, sidecar configuration is valid

### Protocol 3: Record Findings

Organize findings into three sections and append to editPlan frontmatter under `validationAfter.structure`:

```yaml
validationAfter:
  structure:
    agentType: [simple|expert|module]
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
✓ Valid YAML syntax, no parse errors
✓ All required frontmatter fields present
✓ Proper 2-space indentation throughout
✓ All required sections complete for agent type
✓ Path references are valid
```

**WARNINGS** (Non-blocking issues)
```
⚠ Some optional sections are empty
⚠ Minor formatting inconsistencies
⚠ Some descriptions are brief
```

**FAILURES** (Blocking issues that must be fixed)
```
✗ YAML syntax error preventing parsing
✗ Duplicate key 'name' in metadata
✗ Required field 'description' is empty
✗ Invalid boolean value 'yes' (should be true/false)
✗ Path reference points to non-existent file
✗ Simple agent has sidecar-folder specified
✗ Expert agent missing sidecar-folder path
```

### Protocol 4: Auto-Advance

**🚫 NO MENU PRESENTED** - After recording findings, immediately load and execute `{nextStepFile}`

---

**Auto-advancing to sidecar validation...**

## SUCCESS METRICS

✅ All structure checks from agentCompilation.md performed
✅ Correct validation checklist used based on agent type
✅ All checks validated against the actual builtYaml
✅ Findings saved to editPlan with detailed status
✅ Agent type correctly identified and validated
✅ Auto-advanced to next step
