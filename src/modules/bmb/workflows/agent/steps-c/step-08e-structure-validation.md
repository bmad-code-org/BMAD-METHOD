---
name: 'step-07e-structure-validation'
description: 'Validate YAML structure and completeness'

# File References
# Routes to 8F if Expert, else to 9
nextStepFileExpert: './step-08f-sidecar-validation.md'
nextStepFileSimple: './step-09-celebrate.md'
simpleValidation: ../data/simple-agent-validation.md
expertValidation: ../data/expert-agent-validation.md
agentCompilation: ../data/agent-compilation.md
builtYaml: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# STEP GOAL

Validate the built agent YAML file for structural completeness and correctness against the appropriate validation checklist (simple or expert), then route to sidecar validation if needed or proceed to celebration.

# MANDATORY EXECUTION RULES

1. **NEVER skip validation** - All agents must pass structural validation before completion
2. **ALWAYS use the correct validation checklist** based on agent type (simple vs expert)
3. **NEVER auto-fix without user consent** - Report issues and ask for permission
4. **ALWAYS check hasSidecar flag** before determining next step routing
5. **MUST load and parse the actual built YAML** - Not just show it, but validate it
6. **ALWAYS provide clear, actionable feedback** for any validation failures

# EXECUTION PROTOCOLS

## Context Awareness

- User is in the final validation phase
- Agent has been built and written to disk
- This is the "quality gate" before completion
- User expects thorough but fair validation
- Route depends on agent type (expert vs simple)

## User Expectations

- Clear validation results with specific issues identified
- Line-number references for YAML problems
- Option to fix issues or continue (if minor)
- Logical routing based on agent type
- Professional, constructive feedback tone

## Tone and Style

- Professional and thorough
- Constructive, not pedantic
- Clear prioritization of issues (critical vs optional)
- Encouraging when validation passes
- Actionable when issues are found

# CONTEXT BOUNDARIES

## What to Validate

- YAML syntax and structure
- Required frontmatter fields presence
- Required sections completeness
- Field format correctness
- Path validity (for references)
- Agent type consistency (simple vs expert requirements)

## What NOT to Validate

- Artistic choices in descriptions
- Persona writing style
- Command naming creativity
- Feature scope decisions

## When to Escalate

- Critical structural errors that break agent loading
- Missing required fields
- YAML syntax errors preventing file parsing
- Path references that don't exist

# EXECUTION SEQUENCE

## 1. Load Validation Context

```bash
# Load the appropriate validation checklist based on agent type
if agentType == "expert":
    validationFile = expertValidation
else:
    validationFile = simpleValidation

# Load the built agent YAML
builtAgent = read(builtYaml)

# Load compilation rules for reference
compilationRules = read(agentCompilation)
```

**Action:** Present a brief status message:
```
🔍 LOADING VALIDATION FRAMEWORK
   Agent Type: {detected type}
   Validation Standard: {simple|expert}
   Built File: {builtYaml path}
```

## 2. Execute Structural Validation

Run systematic checks against the validation checklist:

### A. YAML Syntax Validation
- Parse YAML without errors
- Check indentation consistency
- Validate proper escaping of special characters
- Verify no duplicate keys

### B. Frontmatter Validation
- All required fields present
- Field values correct type (string, boolean, array)
- No empty required fields
- Proper array formatting

### C. Section Completeness
- All required sections present (based on agent type)
- Sections not empty unless explicitly optional
- Proper markdown heading hierarchy

### D. Field-Level Validation
- Path references exist and are valid
- Boolean fields are actual booleans (not strings)
- Array fields properly formatted
- No malformed YAML structures

### E. Agent Type Specific Checks

**For Simple Agents:**
- No sidecar requirements
- Basic fields complete
- No advanced configuration

**For Expert Agents:**
- Sidecar flag set correctly
- Sidecar folder path specified
- All expert fields present
- Advanced features properly configured

## 3. Generate Validation Report

Present findings in structured format:

```markdown
# 🎯 STRUCTURAL VALIDATION REPORT

## Agent: {agent-name}
Type: {simple|expert}
File: {builtYaml}

---

## ✅ PASSED CHECKS ({count})
{List of all validations that passed}

## ⚠️  ISSUES FOUND ({count})
{If any issues, list each with:}
### Issue #{number}: {type}
**Severity:** [CRITICAL|MODERATE|MINOR]
**Location:** Line {line} or Section {section}
**Problem:** {clear description}
**Impact:** {what this breaks}
**Suggested Fix:** {specific action}

---

## 📊 VALIDATION SUMMARY
**Overall Status:** [PASSED|FAILED|CONDITIONAL]
**Critical Issues:** {count}
**Moderate Issues:** {count}
**Minor Issues:** {count}
**Can Load Safely:** [YES|NO]

---

{If PASSED}
## 🎉 VALIDATION SUCCESSFUL
Your agent YAML is structurally sound and ready for use!
All required fields present and correctly formatted.

{If ISSUES FOUND}
## 🔧 RECOMMENDED ACTIONS
1. Address critical issues first
2. Review moderate issues
3. Minor issues can be deferred
```

## 4. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [F] Fix Findings [P] Party Mode [C] Continue"

### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF F: Apply auto-fixes to {builtYaml} for identified issues, then redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Proceed to next validation step, update frontmatter, then only then load, read entire file, then execute {nextStepFileExpert} or {nextStepFileSimple}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#4-present-menu-options)

### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

If [F] selected: Work through issues systematically
- Load specific section needing fix
- Present current state
- Apply auto-fixes or guide user through corrections
- Re-validate after each fix
- Confirm resolution and re-present menu

If [C] selected:
- Warn about implications if issues exist
- Get explicit confirmation if critical issues
- Document acceptance of issues
- Proceed to routing

## 5. Route to Next Step

After validation passes or user chooses to continue:

### Check Agent Type and Route

```yaml
# Check for sidecar requirement
hasSidecar = checkBuiltYamlForSidecarFlag()

if hasSidecar == true:
    # Expert agent with sidecar
    nextStep = nextStepFileExpert
    routeMessage = """
    📦 Expert agent detected with sidecar configuration.
    → Proceeding to sidecar validation (Step 7F)
    """
else:
    # Simple agent or expert without sidecar
    nextStep = nextStepFileSimple
    routeMessage = """
    ✅ Simple agent validation complete.
    → Proceeding to celebration (Step 8)
    """
```

**Action:** Present routing decision and transition:
```markdown
# 🚀 VALIDATION COMPLETE - ROUTING DECISION

{routeMessage}

**Next Step:** {nextStep filename}
**Reason:** Agent type {simple|expert} with sidecar={hasSidecar}

Press [Enter] to continue to {next step description}...
```

# CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [validation complete with any findings addressed], will you then load and read fully `{nextStepFileExpert}` or `{nextStepFileSimple}` to execute and begin [sidecar validation or celebration].

**BEFORE proceeding to next step:**

1. ✅ Validation checklist executed completely
2. ✅ All critical issues resolved or explicitly accepted
3. ✅ User informed of routing decision
4. ✅ Next step file path determined correctly
5. ⚠️  **CRITICAL:** For expert agents, verify hasSidecar is TRUE before routing to 7F
6. ⚠️  **CRITICAL:** For simple agents, verify hasSidecar is FALSE before routing to 8

**DO NOT PROCEED IF:**
- YAML has critical syntax errors preventing loading
- User has not acknowledged validation results
- Routing logic is unclear or conflicting

# SUCCESS METRICS

## Step Complete When:
- [ ] Validation report generated and presented
- [ ] User has reviewed findings
- [ ] Critical issues resolved or accepted
- [ ] Routing decision communicated and confirmed
- [ ] Next step path verified and ready

## Quality Indicators:
- Validation thoroughness (all checklist items covered)
- Issue identification clarity and specificity
- User satisfaction with resolution process
- Correct routing logic applied
- Clear transition to next step

## Failure Modes:
- Skipping validation checks
- Auto-fixing without permission
- Incorrect routing (simple→7F or expert→8 with sidecar)
- Unclear or missing validation report
- Proceeding with critical YAML errors
