---
installed_path: '{project-root}/.bmad/bmb/workflows/create-module'
nextStepFile: '{installed_path}/steps/step-11-validate.md'
modulePlanFile: '{custom_module_location}/{module_name}/module-plan-{module_name}.md'
moduleTodoFile: '{custom_module_location}/{module_name}/TODO.md'
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 10: Generate Development Roadmap

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a Module Architect and Project Planner
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in development planning, user brings their module vision
- ✅ Maintain collaborative, forward-looking tone

### Step-Specific Rules:

- 🎯 Focus on creating actionable roadmap and TODO
- 🚫 FORBIDDEN to create actual components
- 💬 Prioritize tasks for successful launch
- 🚫 FORBIDDEN to set time estimates

## EXECUTION PROTOCOLS:

- 🎯 Use component status to determine next steps
- 💾 Create clear TODO.md with actionable items
- 📖 Add "step-10-roadmap" to stepsCompleted array` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C'

## CONTEXT BOUNDARIES:

- All module information from previous steps
- Current implementation status
- Focus on planning, not implementation
- Avoid time-based estimates

## STEP GOAL:

To create a development roadmap and TODO list that guides the next steps for completing the module.

## ROADMAP GENERATION PROCESS:

### 1. Review Current Status

"Let's create a development roadmap for your {module_display_name} module.

**Current Status Summary:**

- ✅ Module structure created
- ✅ Installer configured
- [Agent Status]
- [Workflow Status]
- [Documentation Status]

This roadmap will help you prioritize what to work on next."

### 2. Create Development Phases

"**Development Phases:**

I'll organize the remaining work into logical phases to ensure a successful module launch."

### 3. Generate TODO.md

Create file: {custom_module_location}/{module_name}/TODO.md

````markdown
# {module_display_name} Development Roadmap

## Phase 1: Core Components (MVP)

### Agents

- [ ] Implement [Agent 1 Name]
  - Use: `workflow create-agent`
  - Reference: module-plan.md for requirements
  - Priority: High

- [ ] Implement [Agent 2 Name]
  - Use: `workflow create-agent`
  - Reference: module-plan.md for requirements
  - Priority: High

### Workflows

- [ ] Implement [Workflow 1 Name]
  - Use: `workflow create-workflow`
  - Input: workflows/[workflow-1]/workflow-plan.md
  - Priority: High

- [ ] Implement [Workflow 2 Name]
  - Use: `workflow create-workflow`
  - Input: workflows/[workflow-2]/workflow-plan.md
  - Priority: Medium

### Integration

- [ ] Test agent-workflow integration
- [ ] Update agent menus (remove TODO flags)
- [ ] Validate configuration fields work correctly

## Phase 2: Enhanced Features

### Additional Components

- [ ] [Additional Agent 1]
  - Priority: Medium

- [ ] [Additional Workflow 1]
  - Priority: Low

### Improvements

- [ ] Add error handling
- [ ] Implement validation
- [ ] Optimize performance
- [ ] Add logging

## Phase 3: Polish and Launch

### Testing

- [ ] Unit test all agents
- [ ] Integration test workflows
- [ ] Test installer in clean project
- [ ] Test with sample data

### Documentation

- [ ] Add detailed API docs
- [ ] Create video tutorials
- [ ] Write troubleshooting guide
- [ ] Add FAQ section

### Release

- [ ] Version bump to 1.0.0
- [ ] Create release notes
- [ ] Tag release in Git
- [ ] Submit to module registry (if applicable)

## Quick Commands

### Create New Agent

```bash
workflow create-agent
```
````

### Create New Workflow

```bash
workflow create-workflow
```

### Test Module Installation

```bash
bmad install {module_name}
```

### Run Agent

```bash
agent {agent_name}
```

### Run Workflow

```bash
workflow {workflow_name}
```

## Development Notes

### Important Considerations

- [Note 1 about implementation]
- [Note 2 about integration]
- [Note 3 about compatibility]

### Dependencies

- [List any external dependencies]
- [BMAD version requirements]
- [Optional integrations]

### Module Structure Reference

```
{module_name}/
├── agents/          # ✅ Created, needs implementation
├── workflows/       # ✅ Structure created, plans written
├── tasks/           # ✅ Created
├── templates/       # ✅ Created
├── data/            # ✅ Created
├── _module-installer/  # ✅ Configured
└── README.md        # ✅ Complete
└── module.yaml      # ✅ Complete
```

## Completion Criteria

The module is complete when:

- [ ] All Phase 1 items are done
- [ ] Installation works smoothly
- [ ] Documentation covers all features
- [ ] Sample usage produces expected results

---

Created: [current date]
Last Updated: [current date]

````

### 4. Prioritize Immediate Next Steps

"**Immediate Next Steps (This Week):**

Based on your module's needs, I recommend starting with:

1. **[Most important agent]** - Core functionality
2. **[Most important workflow]** - Primary user journey
3. **[Integration task]** - Ensure components work together

**Which of these would you like to tackle first?**"

### 5. Provide Development Guidance

"**Development Tips:**

1. **Iterative Development**
   - Implement one component at a time
   - Test each component before moving on
   - Use the module-plan.md as your guide

2. **Testing Strategy**
   - Test in a clean project
   - Verify installation works
   - Check all menu options function

3. **Documentation Updates**
   - Update README.md as you implement features
   - Mark completed items in this TODO
   - Keep the module-plan.md in sync

4. **Getting Help**
   - Use BMAD documentation for patterns
   - Reference example modules
   - Ask for help when stuck"

### 6. Document Roadmap Creation

Update module-plan.md with roadmap section:

```markdown
## Development Roadmap

### TODO.md Created
- Location: {custom_module_location}/{module_name}/TODO.md
- Phases defined: 3
- Immediate tasks prioritized

### Next Steps Priority Order
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

### Quick Reference Commands
- `workflow create-agent` - Create new agents
- `workflow create-workflow` - Create new workflows
- `bmad install {module_name}` - Test installation

### Development Notes
- [Key implementation notes]
- [Testing recommendations]
- [Integration considerations]
````

### 7. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask} to explore development approaches
- IF P: Execute {partyModeWorkflow} to get creative input on implementation
- IF C: Save roadmap info to module-plan.md, add step-10-roadmap to the end of the stepsCompleted array in frontmatter, then load nextStepFile
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond then end with display again of the menu options

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- TODO.md created with clear phases
- Tasks prioritized by importance
- Quick reference commands included
- Development guidance provided
- Actionable next steps identified

### ❌ SYSTEM FAILURE:

- Not creating TODO.md file
- Including time estimates
- Not prioritizing tasks effectively
- Missing essential development commands

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and roadmap info is saved to module-plan.md with stepsCompleted updated to [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], will you then load, read entire file, then execute `{nextStepFile}` to begin final validation.
