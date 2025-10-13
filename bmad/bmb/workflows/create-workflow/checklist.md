# Build Workflow - Validation Checklist

## Workflow Configuration (workflow.yaml)

- [ ] Name follows kebab-case convention
- [ ] Description clearly states workflow purpose
- [ ] All paths use proper variable substitution
- [ ] installed_path points to correct module location
- [ ] template/instructions paths are correct for workflow type
- [ ] Output file pattern is appropriate
- [ ] YAML syntax is valid (no parsing errors)

## Instructions Structure (instructions.md)

- [ ] Critical headers reference workflow engine
- [ ] All steps have sequential numbering
- [ ] Each step has a clear goal attribute
- [ ] Optional steps marked with optional="true"
- [ ] Repeating steps have appropriate repeat attributes
- [ ] All template-output tags have unique variable names
- [ ] Flow control (if any) has valid step references

## Template Structure (if document workflow)

- [ ] All sections have appropriate placeholders
- [ ] Variable names match template-output tags exactly
- [ ] Markdown formatting is valid
- [ ] Date and metadata fields included
- [ ] No unreferenced variables remain

## Content Quality

- [ ] Instructions are specific and actionable
- [ ] Examples provided where helpful
- [ ] Limits set for lists and content length
- [ ] User prompts are clear
- [ ] Step goals accurately describe outcomes

## Validation Checklist (if present)

- [ ] Criteria are measurable and specific
- [ ] Checks grouped logically by category
- [ ] Final validation summary included
- [ ] All critical requirements covered

## File System

- [ ] Workflow folder created in correct module
- [ ] All required files present based on workflow type
- [ ] File permissions allow execution
- [ ] No placeholder text remains (like {TITLE})

## Testing Readiness

- [ ] Workflow can be invoked without errors
- [ ] All required inputs are documented
- [ ] Output location is writable
- [ ] Dependencies (if any) are available

## Web Bundle Configuration (if applicable)

- [ ] web_bundle section present if needed
- [ ] Name, description, author copied from main config
- [ ] All file paths converted to bmad/-relative format
- [ ] NO {config_source} variables in web bundle
- [ ] NO {project-root} prefixes in paths
- [ ] Instructions path listed correctly
- [ ] Validation/checklist path listed correctly
- [ ] Template path listed (if document workflow)
- [ ] All data files referenced in instructions are listed
- [ ] All sub-workflows are included
- [ ] web_bundle_files array is complete:
  - [ ] Instructions.md included
  - [ ] Checklist.md included
  - [ ] Template.md included (if applicable)
  - [ ] All CSV/JSON data files included
  - [ ] All referenced templates included
  - [ ] All sub-workflow files included
- [ ] No external dependencies outside bundle

## Documentation

- [ ] README created (if requested)
- [ ] Usage instructions clear
- [ ] Example command provided
- [ ] Special requirements noted
- [ ] Web bundle deployment noted (if applicable)

## Final Validation

- [ ] Configuration: No issues
- [ ] Instructions: Complete and clear
- [ ] Template: Variables properly mapped
- [ ] Testing: Ready for test run
