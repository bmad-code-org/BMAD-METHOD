# Build Module Validation Checklist

## Module Identity and Metadata

### Basic Information

- [ ] Module code follows kebab-case convention (e.g., "rpg-toolkit")
- [ ] Module name is descriptive and title-cased
- [ ] Module purpose is clearly defined (1-2 sentences)
- [ ] Target audience is identified
- [ ] Version number follows semantic versioning (e.g., "1.0.0")
- [ ] Author information is present

### Naming Consistency

- [ ] Module code used consistently throughout all files
- [ ] No naming conflicts with existing modules
- [ ] All paths use consistent module code references

## Directory Structure

### Source Directories (bmad/{module-code}/)

- [ ] `/agents` directory created (even if empty)
- [ ] `/workflows` directory created (even if empty)
- [ ] `/tasks` directory exists (if tasks planned)
- [ ] `/templates` directory exists (if templates used)
- [ ] `/data` directory exists (if data files needed)
- [ ] `/_module-installer/install-config.yaml` present (defines configuration questions)
- [ ] `README.md` present with documentation

### Installed Module Structure (generated in target after installation)

- [ ] `/agents` directory for compiled agents
- [ ] `/workflows` directory for workflow instances
- [ ] `/data` directory for user data
- [ ] `config.yaml` generated from install-config.yaml during installation

## Component Planning

### Agents

- [ ] At least one agent defined or planned
- [ ] Agent purposes are distinct and clear
- [ ] Agent types (Simple/Expert/Module) identified
- [ ] No significant overlap between agents
- [ ] Primary agent is identified

### Workflows

- [ ] At least one workflow defined or planned
- [ ] Workflow purposes are clear
- [ ] Workflow types identified (Document/Action/Interactive)
- [ ] Primary workflow is identified
- [ ] Workflow complexity is appropriate

### Tasks (if applicable)

- [ ] Tasks have single, clear purposes
- [ ] Tasks don't duplicate workflow functionality
- [ ] Task files follow naming conventions

## Configuration Files

### Installation Configuration (install-config.yaml)

- [ ] `install-config.yaml` exists in `_module-installer`
- [ ] Module metadata present (code, name, version)
- [ ] Configuration questions defined for user input
- [ ] Default values provided for all questions
- [ ] Prompt text is clear and helpful
- [ ] Result templates use proper variable substitution
- [ ] Paths use proper variables ({project-root}, {value}, etc.)

### Generated Config (config.yaml in target)

- [ ] Generated during installation from install-config.yaml
- [ ] Contains all user-provided configuration values
- [ ] Module metadata included
- [ ] No config.yaml should exist in source module

## Installation Infrastructure

### Installer Files

- [ ] Install configuration validates against schema
- [ ] All source paths exist or are marked as templates
- [ ] Destination paths use correct variables
- [ ] Optional vs required steps clearly marked

### installer.js (if present)

- [ ] Main `installModule` function exists
- [ ] Error handling implemented
- [ ] Console logging for user feedback
- [ ] Exports correct function names
- [ ] Placeholder code replaced with actual logic (or logged as TODO)

### External Assets (if any)

- [ ] Asset files exist in assets directory
- [ ] Copy destinations are valid
- [ ] Permissions requirements documented

## Documentation

### README.md

- [ ] Module overview section present
- [ ] Installation instructions included
- [ ] Component listing with descriptions
- [ ] Quick start guide provided
- [ ] Configuration options documented
- [ ] At least one usage example
- [ ] Directory structure shown
- [ ] Author and date information

### Component Documentation

- [ ] Each agent has purpose documentation
- [ ] Each workflow has description
- [ ] Tasks are documented (if present)
- [ ] Examples demonstrate typical usage

### Development Roadmap

- [ ] TODO.md or roadmap section exists
- [ ] Planned components listed
- [ ] Development phases identified
- [ ] Quick commands for adding components

## Integration

### Cross-component References

- [ ] Agents reference correct workflow paths
- [ ] Workflows reference correct task paths
- [ ] All internal paths use module variables
- [ ] External dependencies declared

### Module Boundaries

- [ ] Module scope is well-defined
- [ ] No feature creep into other domains
- [ ] Clear separation from other modules

## Quality Checks

### Completeness

- [ ] At least one functional component (not all placeholders)
- [ ] Core functionality is implementable
- [ ] Module provides clear value

### Consistency

- [ ] Formatting consistent across files
- [ ] Variable naming follows conventions
- [ ] Communication style appropriate for domain

### Scalability

- [ ] Structure supports future growth
- [ ] Component organization is logical
- [ ] No hard-coded limits

## Testing and Validation

### Structural Validation

- [ ] YAML files parse without errors
- [ ] JSON files (if any) are valid
- [ ] XML files (if any) are well-formed
- [ ] No syntax errors in JavaScript files

### Path Validation

- [ ] All referenced paths exist or are clearly marked as TODO
- [ ] Variable substitutions are correct
- [ ] No absolute paths (unless intentional)

### Installation Testing

- [ ] Installation steps can be simulated
- [ ] No circular dependencies
- [ ] Uninstall process defined (if complex)

## Final Checks

### Ready for Use

- [ ] Module can be installed without errors
- [ ] At least one component is functional
- [ ] User can understand how to get started
- [ ] Next steps are clear

### Professional Quality

- [ ] No placeholder text remains (unless marked TODO)
- [ ] No obvious typos or grammar issues
- [ ] Professional tone throughout
- [ ] Contact/support information provided

## Issues Found

### Critical Issues

<!-- List any issues that MUST be fixed before module can be used -->

### Warnings

<!-- List any issues that should be addressed but won't prevent basic usage -->

### Improvements

<!-- List any optional enhancements that would improve the module -->

### Missing Components

<!-- List any planned components not yet implemented -->

## Module Complexity Assessment

### Complexity Rating

- [ ] Simple (1-2 agents, 2-3 workflows)
- [ ] Standard (3-5 agents, 5-10 workflows)
- [ ] Complex (5+ agents, 10+ workflows)

### Readiness Level

- [ ] Prototype (Basic structure, mostly placeholders)
- [ ] Alpha (Core functionality works)
- [ ] Beta (Most features complete, needs testing)
- [ ] Release (Full functionality, documented)

## Sign-off

**Module Name:** \***\*\*\*\*\***\_\_\***\*\*\*\*\***
**Module Code:** \***\*\*\*\*\***\_\_\***\*\*\*\*\***
**Version:** \***\*\*\*\*\***\_\_\***\*\*\*\*\***
**Validated By:** \***\*\*\*\*\***\_\_\***\*\*\*\*\***
**Date:** \***\*\*\*\*\***\_\_\***\*\*\*\*\***
**Status:** ⬜ Pass / ⬜ Pass with Issues / ⬜ Fail
