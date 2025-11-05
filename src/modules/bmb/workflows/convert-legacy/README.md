# Convert Legacy Workflow

## Overview

The Convert Legacy workflow is a comprehensive migration tool that converts BMAD v4 items (agents, workflows, modules) to v6 compliant format with proper structure and conventions. It bridges the gap between legacy BMAD implementations and the modern v6 architecture, ensuring seamless migration while preserving functionality and improving structure.

## Key Features

- **Multi-Format Detection** - Automatically identifies v4 agents, workflows, tasks, templates, and modules
- **Intelligent Conversion** - Smart mapping from v4 patterns to v6 equivalents with structural improvements
- **Sub-Workflow Integration** - Leverages create-agent, create-workflow, and create-module workflows for quality output
- **Structure Modernization** - Converts YAML-based agents to XML, templates to workflows, tasks to structured workflows
- **Path Normalization** - Updates all references to use proper v6 path conventions
- **Validation System** - Comprehensive validation of converted items before finalization
- **Migration Reporting** - Detailed conversion reports with locations and manual adjustment notes

## Usage

### Basic Invocation

```bash
workflow convert-legacy
```

### With Legacy File Input

```bash
# Convert a specific v4 item
workflow convert-legacy --input /path/to/legacy-agent.md
```

### With Legacy Module

```bash
# Convert an entire v4 module structure
workflow convert-legacy --input /path/to/legacy-module/
```

### Configuration

The workflow uses standard BMB configuration:

- **output_folder**: Where converted items will be placed
- **user_name**: Author information for converted items
- **conversion_mappings**: v4-to-v6 pattern mappings (optional)

## Workflow Structure

### Files Included

```
convert-legacy/
├── workflow.yaml           # Configuration and metadata
├── instructions.md         # Step-by-step conversion guide
├── checklist.md           # Validation criteria
└── README.md              # This file
```

## Workflow Process

### Phase 1: Legacy Analysis (Steps 1-3)

**Item Identification and Loading**

- Accepts file path or directory from user
- Loads complete file/folder structure for analysis
- Automatically detects item type based on content patterns:
  - **Agents**: Contains `<agent>` or `<prompt>` XML tags
  - **Workflows**: Contains workflow YAML or instruction patterns
  - **Modules**: Contains multiple organized agents/workflows
  - **Tasks**: Contains `<task>` XML tags
  - **Templates**: Contains YAML-based document generators

**Legacy Structure Analysis**

- Parses v4 structure and extracts key components
- Maps v4 agent metadata (name, id, title, icon, persona)
- Analyzes v4 template sections and elicitation patterns
- Identifies task workflows and decision trees
- Catalogs dependencies and file references

**Target Module Selection**

- Prompts for target module (bmm, bmb, cis, custom)
- Determines proper installation paths using v6 conventions
- Shows target location for user confirmation
- Ensures all paths use `{project-root}/bmad/` format

### Phase 2: Conversion Strategy (Step 4)

**Strategy Selection Based on Item Type**

- **Simple Agents**: Direct XML conversion with metadata mapping
- **Complex Agents**: Workflow-assisted creation using create-agent
- **Templates**: Template-to-workflow conversion with proper structure
- **Tasks**: Task-to-workflow conversion with step mapping
- **Modules**: Full module creation using create-module workflow

**Workflow Type Determination**

- Analyzes legacy items to determine v6 workflow type:
  - **Document Workflow**: Generates documents with templates
  - **Action Workflow**: Performs actions without output documents
  - **Interactive Workflow**: Guides user interaction sessions
  - **Meta-Workflow**: Coordinates other workflows

### Phase 3: Conversion Execution (Steps 5a-5e)

**Direct Agent Conversion (5a)**

- Transforms v4 YAML agent format to v6 XML structure
- Maps persona blocks (role, style, identity, principles)
- Converts commands list to v6 `<cmds>` format
- Updates task references to workflow invocations
- Normalizes all paths to v6 conventions

**Workflow-Assisted Creation (5b-5e)**

- Extracts key information from legacy items
- Invokes appropriate sub-workflows:
  - `create-agent` for complex agent creation
  - `create-workflow` for template/task conversion
  - `create-module` for full module migration
- Ensures proper v6 structure and conventions

**Template-to-Workflow Conversion (5c)**

- Converts YAML template sections to workflow steps
- Maps `elicit: true` flags to `<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>` tags
- Transforms conditional sections to flow control
- Creates proper template.md from content structure
- Integrates v4 create-doc.md task patterns

**Task-to-Workflow Conversion (5e)**

- Analyzes task purpose to determine workflow type
- Extracts step-by-step instructions to workflow steps
- Converts decision trees to flow control tags
- Maps 1-9 elicitation menus to v6 elicitation patterns
- Preserves execution logic and critical notices

### Phase 4: Validation and Finalization (Steps 6-8)

**Comprehensive Validation**

- Validates XML structure for agents
- Checks YAML syntax for workflows
- Verifies template variable consistency
- Ensures proper file structure and naming

**Migration Reporting**

- Generates detailed conversion report
- Documents original and new locations
- Notes manual adjustments needed
- Provides warnings and recommendations

**Cleanup and Archival**

- Optional archival of original v4 files
- Final location confirmation
- Post-conversion instructions and next steps

## Output

### Generated Files

- **Converted Items**: Proper v6 format in target module locations
- **Migration Report**: Detailed conversion documentation
- **Validation Results**: Quality assurance confirmation

### Output Structure

Converted items follow v6 conventions:

1. **Agents** - XML format with proper persona and command structure
2. **Workflows** - Complete workflow folders with yaml, instructions, and templates
3. **Modules** - Full module structure with installation infrastructure
4. **Documentation** - Updated paths, references, and metadata

## Requirements

- **Legacy v4 Items** - Source files or directories to convert
- **Target Module Access** - Write permissions to target module directories
- **Sub-Workflow Availability** - create-agent, create-workflow, create-module workflows accessible
- **Conversion Mappings** (optional) - v4-to-v6 pattern mappings for complex conversions

## Best Practices

### Before Starting

1. **Backup Legacy Items** - Create copies of original v4 files before conversion
2. **Review Target Module** - Understand target module structure and conventions
3. **Plan Module Organization** - Decide where converted items should logically fit

### During Execution

1. **Validate Item Type Detection** - Confirm automatic detection or correct manually
2. **Choose Appropriate Strategy** - Use workflow-assisted creation for complex items
3. **Review Path Mappings** - Ensure all references use proper v6 path conventions
4. **Test Incrementally** - Convert simple items first to validate process

### After Completion

1. **Validate Converted Items** - Test agents and workflows for proper functionality
2. **Review Migration Report** - Address any manual adjustments noted
3. **Update Documentation** - Ensure README and documentation reflect changes
4. **Archive Originals** - Store v4 files safely for reference if needed

## Troubleshooting

### Common Issues

**Issue**: Item type detection fails or incorrect

- **Solution**: Manually specify item type when prompted
- **Check**: Verify file structure matches expected v4 patterns

**Issue**: Path conversion errors

- **Solution**: Ensure all references use `{project-root}/bmad/` format
- **Check**: Review conversion mappings for proper path patterns

**Issue**: Sub-workflow invocation fails

- **Solution**: Verify build workflows are available and accessible
- **Check**: Ensure target module exists and has proper permissions

**Issue**: XML or YAML syntax errors in output

- **Solution**: Review conversion mappings and adjust patterns
- **Check**: Validate converted files with appropriate parsers

## Customization

To customize this workflow:

1. **Update Conversion Mappings** - Modify v4-to-v6 pattern mappings in data/
2. **Extend Detection Logic** - Add new item type detection patterns
3. **Add Conversion Strategies** - Implement specialized conversion approaches
4. **Enhance Validation** - Add additional quality checks in validation step

## Version History

- **v1.0.0** - Initial release
  - Multi-format v4 item detection and conversion
  - Integration with create-agent, create-workflow, create-module
  - Comprehensive path normalization
  - Migration reporting and validation

## Support

For issues or questions:

- Review the workflow creation guide at `/bmad/bmb/workflows/create-workflow/workflow-creation-guide.md`
- Check conversion mappings at `/bmad/bmb/data/v4-to-v6-mappings.yaml`
- Validate output using `checklist.md`
- Consult BMAD v6 documentation for proper conventions

---

_Part of the BMad Method v6 - BMB (Builder) Module_
