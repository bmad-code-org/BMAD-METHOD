# BMB Workflows

## Available Workflows in bmb

**Meal Prep & Nutrition Plan**

- Path: `_bmad/bmb/workflows/create-agent/data/reference/workflows/meal-prep-nutrition/workflow.md`
- Creates personalized meal plans through collaborative nutrition planning between an expert facilitator and individual seeking to improve their nutrition habits.

**create-agent**

- Path: `_bmad/bmb/workflows/create-agent/workflow.md`
- Interactive workflow to build BMAD Core compliant agents with optional brainstorming, persona development, and command structure

**create-module**

- Path: `_bmad/bmb/workflows/create-module/workflow.md`
- Interactive workflow to build complete BMAD modules with agents, workflows, and installation infrastructure

**create-workflow**

- Path: `_bmad/bmb/workflows/create-workflow/workflow.md`
- Create structured standalone workflows using markdown-based step architecture

**edit-agent**

- Path: `_bmad/bmb/workflows/edit-agent/workflow.md`
- Edit existing BMAD agents while following all best practices and conventions

**edit-workflow**

- Path: `_bmad/bmb/workflows/edit-workflow/workflow.md`
- Intelligent workflow editor that helps modify existing workflows while following best practices

**workflow-compliance-check**

- Path: `_bmad/bmb/workflows/workflow-compliance-check/workflow.md`
- Systematic validation of workflows against BMAD standards with adversarial analysis and detailed reporting

## Execution

When running any workflow:

1. LOAD {project-root}/\_bmad/core/tasks/workflow.xml
2. Pass the workflow path as 'workflow-config' parameter
3. Follow workflow.xml instructions EXACTLY
4. Save outputs after EACH section

## Modes

- Normal: Full interaction
- #yolo: Skip optional steps
