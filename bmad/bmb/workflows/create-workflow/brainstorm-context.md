# Workflow Brainstorming Context

_Context provided to brainstorming workflow when creating a new BMAD workflow_

## Session Focus

You are brainstorming ideas for a **BMAD workflow** - a guided, multi-step process that helps users accomplish complex tasks with structure, consistency, and quality.

## What is a BMAD Workflow?

A workflow is a structured process that provides:

- **Clear Steps**: Sequential operations with defined goals
- **User Guidance**: Prompts, questions, and decisions at each phase
- **Quality Output**: Documents, artifacts, or completed actions
- **Repeatability**: Same process yields consistent results
- **Type**: Document (creates docs), Action (performs tasks), Interactive (guides sessions), Autonomous (runs automated), Meta (orchestrates other workflows)

## Brainstorming Goals

Explore and define:

### 1. Problem and Purpose

- **What task needs structure?** (specific process users struggle with)
- **Why is this hard manually?** (complexity, inconsistency, missing steps)
- **What would ideal process look like?** (steps, checkpoints, outputs)
- **Who needs this?** (target users and their pain points)

### 2. Process Flow

- **How many phases?** (typically 3-10 major steps)
- **What's the sequence?** (logical flow from start to finish)
- **What decisions are needed?** (user choices that affect path)
- **What's optional vs required?** (flexibility points)
- **What checkpoints matter?** (validation, review, approval points)

### 3. Inputs and Outputs

- **What inputs are needed?** (documents, data, user answers)
- **What outputs are generated?** (documents, code, configurations)
- **What format?** (markdown, XML, YAML, actions)
- **What quality criteria?** (how to validate success)

### 4. Workflow Type and Style

- **Document Workflow?** Creates structured documents (PRDs, specs, reports)
- **Action Workflow?** Performs operations (refactoring, deployment, analysis)
- **Interactive Workflow?** Guides creative process (brainstorming, planning)
- **Autonomous Workflow?** Runs without user input (batch processing, generation)
- **Meta Workflow?** Orchestrates other workflows (project setup, module creation)

## Creative Constraints

A great BMAD workflow should be:

- **Focused**: Solves one problem well (not everything)
- **Structured**: Clear phases with defined goals
- **Flexible**: Optional steps, branching paths where appropriate
- **Validated**: Checklist to verify completeness and quality
- **Documented**: README explains when and how to use it

## Workflow Architecture Questions

### Core Structure

1. **Workflow name** (kebab-case, e.g., "product-brief")
2. **Purpose** (one sentence)
3. **Type** (document/action/interactive/autonomous/meta)
4. **Major phases** (3-10 high-level steps)
5. **Output** (what gets created)

### Process Details

1. **Required inputs** (what user must provide)
2. **Optional inputs** (what enhances results)
3. **Decision points** (where user chooses path)
4. **Checkpoints** (where to pause for approval)
5. **Variables** (data passed between steps)

### Quality and Validation

1. **Success criteria** (what defines "done")
2. **Validation checklist** (measurable quality checks)
3. **Common issues** (troubleshooting guidance)
4. **Best practices** (tips for optimal results)

## Workflow Pattern Examples

### Document Generation Workflows

- **Product Brief**: Idea → Vision → Features → Market → Output
- **PRD**: Requirements → User Stories → Acceptance Criteria → Document
- **Architecture**: Requirements → Decisions → Design → Diagrams → ADRs
- **Technical Spec**: Epic → Implementation → Testing → Deployment → Doc

### Action Workflows

- **Code Refactoring**: Analyze → Plan → Refactor → Test → Commit
- **Deployment**: Build → Test → Stage → Validate → Deploy → Monitor
- **Migration**: Assess → Plan → Convert → Validate → Deploy
- **Analysis**: Collect → Process → Analyze → Report → Recommend

### Interactive Workflows

- **Brainstorming**: Setup → Generate → Expand → Evaluate → Prioritize
- **Planning**: Context → Goals → Options → Decisions → Plan
- **Review**: Load → Analyze → Critique → Suggest → Document

### Meta Workflows

- **Project Setup**: Plan → Architecture → Stories → Setup → Initialize
- **Module Creation**: Brainstorm → Brief → Agents → Workflows → Install
- **Sprint Planning**: Backlog → Capacity → Stories → Commit → Kickoff

## Workflow Design Patterns

### Linear Flow

Simple sequence: Step 1 → Step 2 → Step 3 → Done

**Good for:**

- Document generation
- Structured analysis
- Sequential builds

### Branching Flow

Conditional paths: Step 1 → [Decision] → Path A or Path B → Merge → Done

**Good for:**

- Different project types
- Optional deep dives
- Scale-adaptive processes

### Iterative Flow

Refinement loops: Step 1 → Step 2 → [Review] → (Repeat if needed) → Done

**Good for:**

- Creative processes
- Quality refinement
- Approval cycles

### Router Flow

Type selection: [Select Type] → Load appropriate instructions → Execute → Done

**Good for:**

- Multi-mode workflows
- Reusable frameworks
- Flexible tools

## Suggested Brainstorming Techniques

Particularly effective for workflow ideation:

1. **Process Mapping**: Draw current painful process, identify improvements
2. **Step Decomposition**: Break complex task into atomic steps
3. **Checkpoint Thinking**: Where do users need pause/review/decision?
4. **Pain Point Analysis**: What makes current process frustrating?
5. **Success Visualization**: What does perfect execution look like?

## Key Questions to Answer

1. What manual process needs structure and guidance?
2. What makes this process hard or inconsistent today?
3. What are the 3-10 major phases/steps?
4. What document or output gets created?
5. What inputs are required from the user?
6. What decisions or choices affect the flow?
7. What quality criteria define success?
8. Document, Action, Interactive, Autonomous, or Meta workflow?
9. What makes this workflow valuable vs doing it manually?
10. What would make this workflow delightful to use?

## Output Goals

Generate:

- **Workflow name**: Clear, describes the process
- **Purpose statement**: One sentence explaining value
- **Workflow type**: Classification with rationale
- **Phase outline**: 3-10 major steps with goals
- **Input/output description**: What goes in, what comes out
- **Key decisions**: Where user makes choices
- **Success criteria**: How to know it worked
- **Unique value**: Why this workflow beats manual process
- **Use cases**: 3-5 scenarios where this workflow shines

---

_This focused context helps create valuable, structured BMAD workflows_
