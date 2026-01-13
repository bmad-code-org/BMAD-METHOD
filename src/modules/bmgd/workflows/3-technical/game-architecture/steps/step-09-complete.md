---
name: 'step-09-complete'
description: 'Complete the architecture workflow with final review and handoff guidance'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/3-technical/game-architecture'

# File References
thisStepFile: './step-09-complete.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-architecture.md'

# Handoff References
epicWorkflow: '{project-root}/_bmad/bmgd/workflows/4-production/epic-workflow/workflow.yaml'
projectContextWorkflow: '{project-root}/_bmad/bmgd/workflows/3-technical/generate-project-context/workflow.md'
---

# Step 9: Completion

**Progress: Step 9 of 9** - Architecture Complete!

## STEP GOAL:

Generate the executive summary, finalize the document, update workflow status, and provide clear handoff guidance for the next workflow phase.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game architect facilitator
- This is the final step - ensure completeness
- Provide actionable next steps

### Step-Specific Rules:

- Generate executive summary from all content
- Ensure document is ready for AI agent consumption
- Provide clear implementation guidance

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Generate final sections
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]`
- Present completion summary and next steps

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Generate Executive Summary

**Create summary from all sections:**

Based on all documented content, synthesize an executive summary:

```markdown
## Executive Summary

**{{game_name}}** architecture is designed for {{engine}} targeting {{platform}}.

**Key Architectural Decisions:**

- {{decision_1_summary}}
- {{decision_2_summary}}
- {{decision_3_summary}}

**Project Structure:** {{organization_pattern}} organization with {{system_count}} core systems.

**Implementation Patterns:** {{pattern_count}} patterns defined ensuring AI agent consistency.

**Ready for:** Epic implementation phase
```

### 2. Generate Development Setup Section

"Let me generate the development environment setup section.

**Development Prerequisites:**

````markdown
## Development Environment

### Prerequisites

{{prerequisites_list}}

### Setup Commands

```bash
{{setup_commands}}
```
````

### First Steps

1. {{first_step}}
2. {{second_step}}
3. {{third_step}}

````

Does this capture the setup process correctly?"

### 3. Finalize Document

**Update the document with final content:**

- Add Executive Summary at the top (after frontmatter)
- Add Development Environment section
- Update document status to 'complete'
- Update frontmatter with all steps completed

**Final frontmatter:**

```yaml
---
title: 'Game Architecture'
project: '{{project_name}}'
date: '{{date}}'
author: '{{user_name}}'
version: '1.0'
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
status: 'complete'
engine: '{{engine}}'
platform: '{{platform}}'
---
````

### 4. Update Workflow Status

**If not in standalone mode:**

Load `{output_folder}/bmgd-workflow-status.yaml` and:

- Update `create-architecture` status to the output file path
- Preserve all comments and structure
- Determine next workflow in sequence

### 5. Present Completion Summary

"**Architecture Complete!**

{{user_name}}, the Game Architecture for **{{game_name}}** is now complete!

**Architecture Summary:**

- **Engine:** {{engine}} v{{version}}
- **Platform:** {{platform}}
- **Organization:** {{organization_pattern}}
- **Decisions Made:** {{decision_count}}
- **Patterns Defined:** {{pattern_count}}

**Sections Completed:**

1. Project Context
2. Engine & Framework
3. Architectural Decisions
4. Cross-cutting Concerns
5. Project Structure
6. Implementation Patterns
7. Validation
8. Development Setup

**Document saved to:** `{outputFile}`

Do you want to review or adjust anything before we finalize?

**Optional Enhancement: Project Context File**

Would you like to create a `project-context.md` file? This is a concise, optimized guide for AI agents that captures:

- Critical engine-specific rules they might miss
- Specific patterns and conventions for your game project
- Performance and optimization requirements
- Anti-patterns and edge cases to avoid

{if_existing_project_context}
I noticed you already have a project context file. Would you like to update it with your new architectural decisions?
{else}
This file helps ensure AI agents implement game code consistently with your project's unique requirements and patterns.
{/if_existing_project_context}

**Create/Update project context?** [Y/N]"

### 6. Handle Project Context Creation Choice

If user responds 'Y' or 'yes' to creating/updating project context:

"Excellent choice! Let me launch the Generate Project Context workflow to create a comprehensive guide for AI agents.

This will help ensure consistent implementation by capturing:

- Engine-specific patterns and rules
- Performance and optimization conventions from your architecture
- Testing and quality standards
- Anti-patterns to avoid

The workflow will collaborate with you to create an optimized `project-context.md` file that AI agents will read before implementing any game code."

**Execute the Generate Project Context workflow:**

- Load and execute: `{projectContextWorkflow}`
- The workflow will handle discovery, generation, and completion of the project context file
- After completion, return here for final handoff

If user responds 'N' or 'no':
"Understood! Your architecture is complete and ready for implementation. You can always create a project context file later using the Generate Project Context workflow if needed."

### 7. Handle Review Requests

**If user wants to review:**

"Which section would you like to review?

1. Executive Summary
2. Engine & Framework
3. Architectural Decisions
4. Cross-cutting Concerns
5. Project Structure
6. Implementation Patterns
7. Validation Summary
8. Development Setup

Or type 'all' to see the complete document."

**Show requested section and allow edits.**

### 8. Present Next Steps Menu

**After user confirms completion:**

"**Recommended Next Steps for {{game_name}}:**

1. **Initialize Project** - Run the setup commands to create your project
   - Command: `{{setup_command}}`
   - This creates the base structure we designed

2. **Create Epics** - Break down GDD into implementation epics
   - Workflow: `create-epics`
   - Input: GDD + Architecture
   - Output: Implementation-ready epic stories

3. **Begin Implementation** - Start coding with AI agents
   - Each agent will read this architecture
   - Patterns ensure consistency across all code

**Which would you like to do next?**

1. Review the completed architecture
2. Proceed to Epic creation workflow
3. Exit workflow"

### 9. Handle User Selection

Based on user choice:

**If 1 (Review):**

- Present full document or requested section
- Return to next steps menu

**If 2 (Epic Creation):**

- Confirm architecture is saved
- Provide handoff guidance for epic workflow
- Note that architecture document will be input

**If 3 (Exit):**

- Confirm document is saved and complete
- Exit workflow gracefully

### 10. Provide Handoff Guidance

**For Epic Creation handoff:**

"**Handoff to Epic Creation**

Your architecture is ready to guide epic creation.

**What the Epic workflow will do:**

- Read your architecture document
- Break GDD features into implementable stories
- Ensure stories align with architectural patterns
- Create acceptance criteria referencing architecture

**Architecture inputs that will be used:**

- Project structure for file placement
- Implementation patterns for code style
- Cross-cutting concerns for consistency
- System mapping for story assignment

Ready to proceed to epic creation, or any questions about the architecture?"

---

## CRITICAL STEP COMPLETION NOTE

This is the final step. Ensure:

- Executive summary is generated
- All content is saved to architecture.md
- Frontmatter shows all 9 steps completed
- User has clear actionable next steps
- Handoff to epic workflow is smooth

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Executive summary synthesizes all content
- Development setup is complete
- Document status updated to 'complete'
- Frontmatter shows all steps completed
- Workflow status updated (if tracking)
- User has clear next steps
- Document saved and ready for AI agent consumption

### SYSTEM FAILURE:

- Missing executive summary
- Incomplete development setup
- Frontmatter not updated
- Status not updated when tracking
- No clear next steps provided
- User left without actionable guidance

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

---

## Game Architecture Workflow Complete

The Game Architecture workflow transforms a GDD into a comprehensive architecture document through 9 collaborative steps:

1. **Initialize** - Validate readiness, discover input documents
2. **Context** - Load and understand project requirements
3. **Starter** - Select engine and starter templates
4. **Decisions** - Make collaborative architectural decisions
5. **Cross-cutting** - Define patterns for all systems
6. **Structure** - Define project organization
7. **Patterns** - Design implementation patterns
8. **Validation** - Verify completeness and coherence
9. **Complete** - Finalize and provide handoff

This step-file architecture ensures consistent, thorough architecture creation with user collaboration at every step.
