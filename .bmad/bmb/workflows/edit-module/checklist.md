# Edit Module - Validation Checklist

Use this checklist to validate module edits meet BMAD Core standards.

## Module Structure Validation

- [ ] Module has clear 3-letter code (bmm, bmb, cis, etc.)
- [ ] Module is in correct location (src/modules/ for source, .bmad/ for installed)
- [ ] agents/ directory exists
- [ ] workflows/ directory exists
- [ ] config.yaml exists in module root
- [ ] README.md exists in module root
- [ ] Directory structure follows BMAD conventions

## Configuration Validation

### Required Fields

- [ ] module_name is descriptive and clear
- [ ] module_code is 3-letter code matching directory name
- [ ] user_name field present
- [ ] communication_language field present
- [ ] output_folder field present

### Optional Fields (if used)

- [ ] custom_agent_location documented
- [ ] custom_module_location documented
- [ ] Module-specific fields documented in README

### File Quality

- [ ] config.yaml is valid YAML syntax
- [ ] No duplicate keys
- [ ] Values are appropriate types (strings, paths, etc.)
- [ ] Comments explain non-obvious fields

## Agent Validation

### Agent Files

- [ ] All agents in agents/ directory
- [ ] Agent files follow naming: {agent-name}.agent.yaml or .md
- [ ] Agent filenames use kebab-case
- [ ] No orphaned or temporary agent files

### Agent Content

- [ ] Each agent has clear role and purpose
- [ ] Agents reference workflows correctly
- [ ] Agent workflow paths are valid
- [ ] Agents load module config correctly (if needed)
- [ ] Agent menu items reference existing workflows

### Agent Integration

- [ ] All agents listed in module README
- [ ] Agent relationships documented (if applicable)
- [ ] Cross-agent workflows properly linked

## Workflow Validation

### Workflow Structure

- [ ] All workflows in workflows/ directory
- [ ] Each workflow directory has workflow.yaml
- [ ] Each workflow directory has instructions.md
- [ ] Workflow directories use kebab-case naming
- [ ] No orphaned or incomplete workflow directories

### Workflow Content

- [ ] workflow.yaml is valid YAML
- [ ] workflow.yaml has name field
- [ ] workflow.yaml has description field
- [ ] workflow.yaml has author field
- [ ] instructions.md has proper <workflow> structure
- [ ] Workflow steps are numbered and logical

### Workflow Integration

- [ ] All workflows listed in module README
- [ ] Workflow paths in agents are correct
- [ ] Cross-module workflow references are valid
- [ ] Sub-workflow references exist

## Documentation Validation

### Module README

- [ ] Module README describes purpose clearly
- [ ] README lists all agents with descriptions
- [ ] README lists all workflows with descriptions
- [ ] README includes installation instructions (if applicable)
- [ ] README explains module's role in BMAD ecosystem

### Workflow READMEs

- [ ] Each workflow has its own README.md
- [ ] Workflow READMEs explain purpose
- [ ] Workflow READMEs list inputs/outputs
- [ ] Workflow READMEs include usage examples

### Other Documentation

- [ ] Usage guides present (if needed)
- [ ] Architecture docs present (if complex module)
- [ ] Examples provided (if applicable)

## Cross-References Validation

- [ ] Agent workflow references point to existing workflows
- [ ] Workflow sub-workflow references are valid
- [ ] Cross-module references use correct paths
- [ ] Config file paths use {project-root} correctly
- [ ] No hardcoded absolute paths

## Installer Validation (Source Modules Only)

- [ ] Installer script exists in tools/cli/installers/
- [ ] Installer script name: install-{module-code}.js
- [ ] Module metadata in installer is correct
- [ ] Web bundle configuration valid (if applicable)
- [ ] Installation paths are correct
- [ ] Dependencies documented in installer

## Web Bundle Validation (If Applicable)

- [ ] Web bundles configured in workflow.yaml files
- [ ] All referenced files included in web_bundle_files
- [ ] Paths are .bmad/-relative (not project-root)
- [ ] No config_source references in web bundles
- [ ] Invoked workflows included in dependencies

## Quality Checks

- [ ] No placeholder text remains ({MODULE_NAME}, {CODE}, etc.)
- [ ] No broken file references
- [ ] No duplicate content across files
- [ ] Consistent naming conventions throughout
- [ ] Module purpose is clear from README alone

## Integration Checks

- [ ] Module doesn't conflict with other modules
- [ ] Shared resources properly documented
- [ ] Dependencies on other modules explicit
- [ ] Module can be installed independently (if designed that way)

## User Experience

- [ ] Module purpose is immediately clear
- [ ] Agents have intuitive names
- [ ] Workflows have descriptive names
- [ ] Menu items are logically organized
- [ ] Error messages are helpful
- [ ] Success messages confirm actions

## Final Checks

- [ ] All files have been saved
- [ ] File permissions are correct
- [ ] Git status shows expected changes
- [ ] Module is ready for testing
- [ ] Documentation accurately reflects changes
