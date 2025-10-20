# Build Module Workflow

## Overview

The Build Module workflow is an interactive scaffolding system that creates complete BMAD modules with agents, workflows, tasks, and installation infrastructure. It serves as the primary tool for building new modules in the BMAD ecosystem, guiding users through the entire module creation process from concept to deployment-ready structure.

## Key Features

- **Interactive Module Planning** - Collaborative session to define module concept, scope, and architecture
- **Intelligent Scaffolding** - Automatic creation of proper directory structures and configuration files
- **Component Integration** - Seamless integration with create-agent and create-workflow workflows
- **Installation Infrastructure** - Complete installer setup with configuration templates
- **Module Brief Integration** - Can use existing module briefs as blueprints for accelerated development
- **Validation and Documentation** - Built-in validation checks and comprehensive README generation

## Usage

### Basic Invocation

```bash
workflow create-module
```

### With Module Brief Input

```bash
# If you have a module brief from the module-brief workflow
workflow create-module --input module-brief-my-module-2024-09-26.md
```

### Configuration

The workflow loads critical variables from the BMB configuration:

- **custom_module_location**: Where custom modules are created (default: `bmad/`)
- **user_name**: Module author information
- **date**: Automatic timestamp for versioning

## Workflow Structure

### Files Included

```
create-module/
├── workflow.yaml           # Configuration and metadata
├── instructions.md         # Step-by-step execution guide
├── checklist.md           # Validation criteria
├── module-structure.md    # Module architecture guide
├── installer-templates/   # Installation templates
│   ├── install-config.yaml
│   └── installer.js
└── README.md             # This file
```

## Workflow Process

### Phase 1: Concept Definition (Steps 1-2)

**Module Vision and Identity**

- Define module concept, purpose, and target audience
- Establish module code (kebab-case) and friendly name
- Choose module category (Domain-Specific, Creative, Technical, Business, Personal)
- Plan component architecture with agent and workflow specifications

**Module Brief Integration**

- Automatically detects existing module briefs in output folder
- Can load and use briefs as pre-populated blueprints
- Accelerates planning when comprehensive brief exists

### Phase 2: Architecture Planning (Steps 3-4)

**Directory Structure Creation**

- Creates complete module directory hierarchy
- Sets up agent, workflow, task, template, and data folders
- Establishes installer directory with proper configuration

**Module Configuration**

- Defines configuration questions in install-config.yaml (config.yaml generated during installation)
- Configures component counts and references
- Sets up output and data folder specifications

### Phase 3: Component Creation (Steps 5-6)

**Interactive Component Building**

- Optional creation of first agent using create-agent workflow
- Optional creation of first workflow using create-workflow workflow
- Creates placeholders for components to be built later

**Workflow Integration**

- Seamlessly invokes sub-workflows for component creation
- Ensures proper file placement and structure
- Maintains module consistency across components

### Phase 4: Installation and Documentation (Steps 7-9)

**Installer Infrastructure**

- Creates install-config.yaml with configuration questions for deployment
- Sets up optional installer.js for complex installation logic
- Configures post-install messaging and instructions

**Comprehensive Documentation**

- Generates detailed README.md with usage examples
- Creates development roadmap for remaining components
- Provides quick commands for continued development

### Phase 5: Validation and Finalization (Step 10)

**Quality Assurance**

- Validates directory structure and configuration files
- Checks component references and path consistency
- Ensures installer configuration is deployment-ready
- Provides comprehensive module summary and next steps

## Output

### Generated Files

- **Module Directory**: Complete module structure at `{project-root}/bmad/{module_code}/`
- **Configuration Files**:
  - Source: install-config.yaml (configuration questions)
  - Target: config.yaml (generated from user answers during installation)
- **Documentation**: README.md, TODO.md development roadmap
- **Component Placeholders**: Structured folders for agents, workflows, and tasks

### Output Structure

The workflow creates a complete module ready for development:

1. **Module Identity** - Name, code, version, and metadata
2. **Directory Structure** - Proper BMAD module hierarchy
3. **Configuration System** - Runtime and installation configs
4. **Component Framework** - Ready-to-use agent and workflow scaffolding
5. **Installation Infrastructure** - Deployment-ready installer
6. **Documentation Suite** - README, roadmap, and development guides

## Requirements

- **Module Brief** (optional but recommended) - Use module-brief workflow first for best results
- **BMAD Core Configuration** - Properly configured BMB config.yaml
- **Build Tools Access** - create-agent and create-workflow workflows must be available

## Best Practices

### Before Starting

1. **Create a Module Brief** - Run module-brief workflow for comprehensive planning
2. **Review Existing Modules** - Study similar modules in `/bmad/` for patterns and inspiration
3. **Define Clear Scope** - Have a concrete vision of what the module will accomplish

### During Execution

1. **Use Module Briefs** - Load existing briefs when prompted for accelerated development
2. **Start Simple** - Create one core agent and workflow, then expand iteratively
3. **Leverage Sub-workflows** - Use create-agent and create-workflow for quality components
4. **Validate Early** - Review generated structure before proceeding to next phases

### After Completion

1. **Follow the Roadmap** - Use generated TODO.md for systematic development
2. **Test Installation** - Validate installer with `bmad install {module_code}`
3. **Iterate Components** - Use quick commands to add agents and workflows
4. **Document Progress** - Update README.md as the module evolves

## Troubleshooting

### Common Issues

**Issue**: Module already exists at target location

- **Solution**: Choose a different module code or remove existing module
- **Check**: Verify output folder permissions and available space

**Issue**: Sub-workflow invocation fails

- **Solution**: Ensure create-agent and create-workflow workflows are available
- **Check**: Validate workflow paths in config.yaml

**Issue**: Installation configuration invalid

- **Solution**: Review install-config.yaml syntax and paths
- **Check**: Ensure all referenced paths use {project-root} variables correctly

## Customization

To customize this workflow:

1. **Modify Instructions** - Update instructions.md to adjust scaffolding steps
2. **Extend Templates** - Add new installer templates in installer-templates/
3. **Update Validation** - Enhance checklist.md with additional quality checks
4. **Add Components** - Integrate additional sub-workflows for specialized components

## Version History

- **v1.0.0** - Initial release
  - Interactive module scaffolding
  - Component integration with create-agent and create-workflow
  - Complete installation infrastructure
  - Module brief integration support

## Support

For issues or questions:

- Review the workflow creation guide at `/bmad/bmb/workflows/create-workflow/workflow-creation-guide.md`
- Study module structure patterns at `module-structure.md`
- Validate output using `checklist.md`
- Consult existing modules in `/bmad/` for examples

---

_Part of the BMad Method v5 - BMB (Builder) Module_
