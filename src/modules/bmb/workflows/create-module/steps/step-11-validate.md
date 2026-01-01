---
workflowFile: '{installed_path}/workflow.md'
modulePlanFile: '{bmb_creations_output_folder}/{module_name}/module-plan-{module_name}.md'
validationChecklist: '{installed_path}/validation.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 11: Validate and Finalize Module

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a Module Architect and Quality Assurance Specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in BMAD validation patterns, user brings their module knowledge
- ✅ Maintain collaborative, thorough tone

### Step-Specific Rules:

- 🎯 Focus on validation and quality checks
- 🚫 FORBIDDEN to modify core structure at this stage
- 💬 Present findings clearly with recommendations
- 🚫 FORBIDDEN to skip validation steps

## EXECUTION PROTOCOLS:

- 🎯 Run validation checklist systematically
- 💾 Document validation results
- 📖 Append "step-11-validate" to stepsCompleted array` before completing
- 🚫 FORBIDDEN to mark as complete without validation

## CONTEXT BOUNDARIES:

- Module fully created with all components
- Focus on validation, not new creation
- Use validation checklist for systematic review
- Ensure BMAD compliance

## STEP GOAL:

To validate the completed module structure, ensure all components are properly configured, and provide next steps for testing and deployment.

## VALIDATION PROCESS:

### 1. Initialize Validation

"Let's validate your {module_display_name} module to ensure it meets all BMAD standards and is ready for use.

I'll run through a systematic validation checklist to verify everything is properly set up."

### 2. Structure Validation

"**1. Module Structure Check**"

Validate module directory structure

```
Expected Structure:
{module_name}/
├── agents/                    [✅/❌]
├── workflows/                 [✅/❌]
├── tasks/                     [✅/❌]
├── templates/                 [✅/❌]
├── data/                      [✅/❌]
├── _module-installer/         [✅/❌]
│   └── installer.js           [✅/N/A]
├── module.yaml                [✅/❌]
└── README.md                  [✅/❌]
```

**Results:**

- [List validation results for each item]

### 3. Configuration Validation

"**2. Configuration Files Check**"

**Install Configuration:**
Validate module.yaml

- [ ] YAML syntax valid
- [ ] Module code matches folder name
- [ ] All required fields present
- [ ] Path templates use correct format
- [ ] Configuration fields properly defined

**Module Plan:**
Review module-plan.md

- [ ] All sections completed
- [ ] stepsCompleted array includes all steps
- [ ] Module identity documented
- [ ] Component plan clear

### 4. Component Validation

"**3. Components Check**"

**Agents:**
Check agents folder

- [ ] Agent files created (or placeholders with TODO)
- [ ] YAML frontmatter valid (if created)
- [ ] TODO flags used for missing workflows
- [ ] Reference patterns followed

**Workflows:**
Check workflows folder

- [ ] Folders created for planned workflows
- [ ] workflow-plan.md files created (or placeholders)
- [ ] README.md in each workflow folder
- [ ] Plans include all required sections

### 5. Documentation Validation

"**4. Documentation Check**"

**README.md:**
Review README.md content

- [ ] All sections present
- [ ] Installation instructions correct
- [ ] Usage examples clear
- [ ] Development status accurate
- [ ] Contact information included

**TODO.md:**
Review TODO.md

- [ ] Development phases defined
- [ ] Tasks prioritized
- [ ] Quick commands included
- [ ] Completion criteria clear

### 6. Integration Validation

"**5. Integration Points Check**"

Review integration requirements

- [ ] Agent workflows reference correctly
- [ ] Configuration fields accessible
- [ ] Module paths consistent
- [ ] No circular dependencies

### 7. Present Validation Results

"**Validation Summary:**

**✅ Passed:**

- [List items that passed validation]

**⚠️ Warnings:**

- [List items that need attention but don't block use]

**❌ Issues:**

- [List critical issues that need fixing]

**Overall Status:**
[Ready for testing / Needs fixes before testing]"

### 8. Handle Validation Issues

"**Addressing Issues:**

Let's fix the critical issues before completing the validation."

For each issue:

1. **Explain the issue** clearly
2. **Show how to fix** it
3. **Make the fix** if user approves
4. **Re-validate** the fixed item

Fix issues one by one with user confirmation

### 9. Final Module Summary

"**Module Creation Complete!**

**Module Summary:**

- **Name:** {module_display_name}
- **Code:** {module_name}
- **Location:** {bmb_creations_output_folder}/{module_name}
- **Type:** {module_type}
- **Status:** Ready for testing

**Created Components:**

- [agent_count] agents ([created] created, [planned-created] planned)
- [workflow_count] workflows (plans created)
- [task_count] tasks
- Complete installer configuration
- Comprehensive documentation

### 10. Next Steps Guidance

"**Your Next Steps:**

1. **Test the Installation:**

   ```bash
   cd [test-project]
   bmad install {module_name}
   ```

2. **Implement Components:**
   - Follow TODO.md for prioritized tasks
   - Use `workflow create-agent` for remaining agents
   - Use `workflow create-workflow` for workflows

3. **Test Functionality:**
   - Load agents: `agent [agent-name]`
   - Run workflows: `workflow [workflow-name]`
   - Verify all menu options work

4. **Iterate and Improve:**
   - Gather feedback from users
   - Add missing features
   - Fix any bugs found

5. **Share Your Module:**
   - Document improvements in README.md
   - Consider submitting to BMAD registry
   - Share with the community"

### 11. Document Validation

Create validation summary in module-plan.md:

```markdown
## Validation Results

### Date Validated

[current date]

### Validation Checklist

- [ ] Structure: Complete
- [ ] Configuration: Valid
- [ ] Components: Ready
- [ ] Documentation: Complete
- [ ] Integration: Verified

### Issues Found and Resolved

[List any issues fixed during validation]

### Final Status

[Ready for testing / Requires additional fixes]

### Next Steps

1. [First next step]
2. [Second next step]
3. [Third next step]
```

### 12. Complete Workflow

Mark workflow as complete:
Update module-plan.md frontmatter:
Add "step-11-validate" to stepsCompleted array
Set lastStep to 'validate'
Set status to 'complete'
Add current date to completionDate

```

"**🎉 Congratulations!**

Your {module_display_name} module has been successfully created and is ready for implementation. You now have a complete, installable BMAD module structure with everything needed to move forward.

Would you like me to help you with anything else?"

### 13. Final MENU OPTIONS

Display: **Module Creation Complete!** [A] Advanced Elicitation [P] Party Mode [C] Exit

#### Menu Handling Logic:

- IF A: Execute {project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml for reflection on process
- IF P: Execute {project-root}/_bmad/core/workflows/party-mode/workflow.md to celebrate completion
- IF C: Mark as complete and exit gracefully
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- This is the final step - workflow complete
- User can ask questions or exit
- Always respond helpfully to final queries

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All validation checks performed
- Issues identified and resolved
- Module marked as complete
- Clear next steps provided
- User satisfied with results

### ❌ SYSTEM FAILURE:

- Skipping validation checks
- Not documenting validation results
- Marking as complete with critical issues
- Not providing next steps guidance

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

## CRITICAL STEP COMPLETION NOTE

WHEN validation is complete, all issues resolved (or documented), and module-plan.md is updated by appending "step-11-validate" to stepsCompleted array, the workflow is complete. Present final summary and allow user to exit or ask final questions.
```
