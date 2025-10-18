# Workflow Status System

The universal entry point for BMM workflows - answers "what should I do now?" for any agent.

## Overview

The workflow status system provides:

- **Smart project initialization** - Detects existing work and infers project details
- **Simple status tracking** - Key-value pairs for instant parsing
- **Intelligent routing** - Suggests next actions based on current state
- **Modular workflow paths** - Each project type/level has its own clean definition

## Architecture

### Core Components

```
workflow-status/
├── workflow.yaml              # Main configuration
├── instructions.md            # Status checker (99 lines)
├── workflow-status-template.md # Clean key-value template
├── project-levels.yaml        # Source of truth for scale definitions
└── paths/                     # Modular workflow definitions
    ├── greenfield-level-0.yaml through level-4.yaml
    ├── brownfield-level-0.yaml through level-4.yaml
    └── game-design.yaml
```

### Related Workflow

```
workflow-init/
├── workflow.yaml              # Initialization configuration
└── instructions.md            # Smart setup (182 lines)
```

## How It Works

### For New Projects

1. User runs `workflow-status`
2. System finds no status file
3. Directs to `workflow-init`
4. Init workflow:
   - Scans for existing work (PRDs, code, etc.)
   - Infers project details from what it finds
   - Asks minimal questions (name + description)
   - Confirms understanding in one step
   - Creates status file with workflow path

### For Existing Projects

1. User runs `workflow-status`
2. System reads status file
3. Shows current state and options:
   - Continue in-progress work
   - Next required step
   - Available optional workflows
4. User picks action

## Status File Format

Simple key-value pairs for instant parsing:

```markdown
PROJECT_NAME: MyProject
PROJECT_TYPE: software
PROJECT_LEVEL: 2
FIELD_TYPE: greenfield
CURRENT_PHASE: 2-Planning
CURRENT_WORKFLOW: prd
TODO_STORY: story-1.2.md
IN_PROGRESS_STORY: story-1.1.md
NEXT_ACTION: Continue PRD
NEXT_COMMAND: prd
NEXT_AGENT: pm
```

Any agent can instantly grep what they need:

- SM: `grep 'TODO_STORY:' status.md`
- DEV: `grep 'IN_PROGRESS_STORY:' status.md`
- Any: `grep 'NEXT_ACTION:' status.md`

## Project Levels

Source of truth: `/src/modules/bmm/README.md` lines 77-85

- **Level 0**: Single atomic change (1 story)
- **Level 1**: Small feature (1-10 stories)
- **Level 2**: Medium project (5-15 stories)
- **Level 3**: Complex system (12-40 stories)
- **Level 4**: Enterprise scale (40+ stories)

## Workflow Paths

Each combination has its own file:

- `greenfield-level-X.yaml` - New projects at each level
- `brownfield-level-X.yaml` - Existing codebases at each level
- `game-design.yaml` - Game projects (all levels)

Benefits:

- Load only what's needed (60 lines vs 750+)
- Easy to maintain individual paths
- Clear separation of concerns

## Smart Detection

The init workflow intelligently detects:

**Project Type:**

- Finds GDD → game
- Otherwise → software

**Project Level:**

- Reads PRD epic/story counts
- Analyzes scope descriptions
- Makes educated guess

**Field Type:**

- Finds source code → brownfield
- Only planning docs → greenfield
- Checks git history age

**Documentation Status:**

- Finds index.md → was undocumented
- Good README → documented
- Missing docs → needs documentation

## Usage Examples

### Any Agent Checking Status

```
Agent: workflow-status
Result: "TODO: story-1.2.md, Next: create-story"
```

### New Project Setup

```
Agent: workflow-status
System: "No status found. Run workflow-init"
Agent: workflow-init
System: "Tell me about your project"
User: "Building a dashboard with user management"
System: "Level 2 greenfield software project. Correct?"
User: "Yes"
System: "Status created! Next: pm agent, run prd"
```

### Smart Inference

```
System finds: prd-dashboard.md with 3 epics
System finds: package.json, src/ directory
System infers: Level 2 brownfield software
User confirms or corrects
```

## Philosophy

**Less Structure, More Intelligence**

Instead of complex if/else logic:

- Trust the LLM to analyze and infer
- Use natural language for corrections
- Keep menus simple and contextual
- Let intelligence emerge from the model

**Result:** A workflow system that feels like talking to a smart assistant, not filling out a form.

## Implementation Details

### workflow-init (6 Steps)

1. **Scan for existing work** - Check for docs, code, git history
2. **Confirm findings** - Show what was detected (if anything)
3. **Gather info** - Name, description, confirm type/level/field
4. **Load path file** - Select appropriate workflow definition
5. **Generate workflow** - Build from path file
6. **Create status file** - Save and show next step

### workflow-status (4 Steps)

1. **Check for status file** - Direct to init if missing
2. **Parse status** - Extract key-value pairs
3. **Display options** - Show current, required, optional
4. **Handle selection** - Execute user's choice

## Best Practices

1. **Let the AI guess** - It's usually right, user corrects if needed
2. **One conversation** - Get all info in Step 3 of init
3. **Simple parsing** - Key-value pairs, not complex structures
4. **Modular paths** - Each scenario in its own file
5. **Trust intelligence** - LLM understands context better than rules

## Integration

Other workflows read the status to coordinate:

- `create-story` reads TODO_STORY
- `dev-story` reads IN_PROGRESS_STORY
- Any workflow can check CURRENT_PHASE
- All agents can ask "what should I do?"

The status file is the single source of truth for project state and the hub that keeps all agents synchronized.

## Benefits

✅ **Smart Detection** - Infers from existing work instead of asking everything
✅ **Minimal Questions** - Just name and description in most cases
✅ **Clean Status** - Simple key-value pairs for instant parsing
✅ **Modular Paths** - 60-line files instead of 750+ line monolith
✅ **Natural Language** - "Tell me about your project" not "Pick 1-12"
✅ **Intelligent Menus** - Shows only relevant options
✅ **Fast Parsing** - Grep instead of complex logic
✅ **Easy Maintenance** - Change one level without affecting others

## Future Enhancements

- Visual progress indicators
- Time tracking and estimates
- Multi-project support
- Team synchronization

---

**This workflow is the front door to BMad Method. Start here to know what to do next.**
