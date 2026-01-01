# Standalone Workflow Builder Architecture

This document describes the architecture of the standalone workflow builder system - a pure markdown approach to creating structured workflows.

## Core Architecture Principles

### 1. Micro-File Design

Each workflow consists of multiple focused, self-contained files, driven from a workflow.md file that is initially loaded:

```
workflow-folder/
├── workflow.md              # Main workflow configuration
├── steps/                   # Step instruction files (focused, self-contained)
│   ├── step-01-init.md
│   ├── step-02-profile.md
│   └── step-N-[name].md
├── templates/               # Content templates
│   ├── profile-section.md
│   └── [other-sections].md
└── data/                    # Optional data files
    └── [data-files].csv/.json
```

### 2. Just-In-Time (JIT) Loading

- **Single File in Memory**: Only the current step file is loaded
- **No Future Peeking**: Step files must not reference future steps
- **Sequential Processing**: Steps execute in strict order
- **On-Demand Loading**: Templates load only when needed

### 3. State Management

- **Frontmatter Tracking**: Workflow state stored in output document frontmatter
- **Progress Array**: `stepsCompleted` tracks completed steps
- **Last Step Marker**: `lastStep` indicates where to resume
- **Append-Only Building**: Documents grow by appending content

### 4. Execution Model

```
1. Load workflow.md → Read configuration
2. Execute step-01-init.md → Initialize or detect continuation
3. For each step:
   a. Load step file completely
   b. Execute instructions sequentially
   c. Wait for user input at menu points
   d. Only proceed with 'C' (Continue)
   e. Update document/frontmatter
   f. Load next step
```

## Key Components

### Workflow File (workflow.md)

- **Purpose**: Entry point and configuration
- **Content**: Role definition, goal, architecture rules
- **Action**: Points to step-01-init.md

### Step Files (step-NN-[name].md)

- **Size**: Focused and concise (typically 5-10KB)
- **Structure**: Frontmatter + sequential instructions
- **Features**: Self-contained rules, menu handling, state updates

### Frontmatter Variables

Standard variables in step files:

```yaml
workflow_path: '{project-root}/_bmad/bmb/reference/workflows/[workflow-name]'
thisStepFile: '{workflow_path}/steps/step-[N]-[name].md'
nextStepFile: '{workflow_path}/steps/step-[N+1]-[name].md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/[output-name]-{project_name}.md'
```

## Execution Flow

### Fresh Workflow

```
workflow.md
    ↓
step-01-init.md (creates document)
    ↓
step-02-[name].md
    ↓
step-03-[name].md
    ↓
...
    ↓
step-N-[final].md (completes workflow)
```

### Continuation Workflow

```
workflow.md
    ↓
step-01-init.md (detects existing document)
    ↓
step-01b-continue.md (analyzes state)
    ↓
step-[appropriate-next].md
```

## Menu System

### Standard Menu Pattern

```
Display: **Select an Option:** [A] [Action] [P] Party Mode [C] Continue

#### Menu Handling Logic:
- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save content, update frontmatter, load next step
```

### Menu Rules

- **Halt Required**: Always wait for user input
- **Continue Only**: Only proceed with 'C' selection
- **State Persistence**: Save before loading next step
- **Loop Back**: Return to menu after other actions

## Collaborative Dialogue Model

### Not Command-Response

- **Facilitator Role**: AI guides, user decides
- **Equal Partnership**: Both parties contribute
- **No Assumptions**: Don't assume user wants next step
- **Explicit Consent**: Always ask for input

### Example Pattern

```
AI: "Tell me about your dietary preferences."
User: [provides information]
AI: "Thank you. Now let's discuss your cooking habits."
[Continue conversation]
AI: **Menu Options**
```

## CSV Intelligence (Optional)

### Data-Driven Behavior

- Configuration in CSV files
- Dynamic menu options
- Variable substitution
- Conditional logic

### Example Structure

```csv
variable,type,value,description
cooking_frequency,choice,"daily|weekly|occasionally","How often user cooks"
meal_type,multi,"breakfast|lunch|dinner|snacks","Types of meals to plan"
```

## Best Practices

### File Size Limits

- **Step Files**: Keep focused and reasonably sized (5-10KB typical)
- **Templates**: Keep focused and reusable
- **Workflow File**: Keep lean, no implementation details

### Sequential Enforcement

- **Numbered Steps**: Use sequential numbering (1, 2, 3...)
- **No Skipping**: Each step must complete
- **State Updates**: Mark completion in frontmatter

### Error Prevention

- **Path Variables**: Use frontmatter variables, never hardcode
- **Complete Loading**: Always read entire file before execution
- **Menu Halts**: Never proceed without 'C' selection

## Migration from XML

### Advantages

- **No Dependencies**: Pure markdown, no XML parsing
- **Human Readable**: Files are self-documenting
- **Git Friendly**: Clean diffs and merges
- **Flexible**: Easier to modify and extend

### Key Differences

| XML Workflows     | Standalone Workflows    |
| ----------------- | ----------------------- |
| Single large file | Multiple micro-files    |
| Complex structure | Simple sequential steps |
| Parser required   | Any markdown viewer     |
| Rigid format      | Flexible organization   |

## Implementation Notes

### Critical Rules

- **NEVER** load multiple step files
- **ALWAYS** read complete step file first
- **NEVER** skip steps or optimize
- **ALWAYS** update frontmatter of the output file when a step is complete
- **NEVER** proceed without user consent

### Success Metrics

- Documents created correctly
- All steps completed sequentially
- User satisfied with collaborative process
- Clean, maintainable file structure

This architecture ensures disciplined, predictable workflow execution while maintaining flexibility for different use cases.
