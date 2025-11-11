# ReDoc Workflow Validation Checklist

## Initialization and Setup

- [ ] All BMAD convention documents loaded and understood
- [ ] Target path validated and exists
- [ ] Target type correctly identified (module/workflow/agent/folder)
- [ ] Documentation execution plan created with reverse-tree order

## File Analysis

- [ ] All files in target scope read completely (no offset/limit usage)
- [ ] Existing README.md files detected and last-redoc-date parsed
- [ ] Massive folders (>10 items) identified for catalog document creation
- [ ] Documentation depth levels calculated correctly

## Leaf-Level Documentation (Workflows)

- [ ] Each workflow's ALL files read: workflow.yaml, instructions.md, template.md, checklist.md
- [ ] README.md includes frontmatter with current last-redoc-date
- [ ] Description is 2-4 paragraphs of technical writer quality
- [ ] Focuses on DISTINCTIVE features, not BMAD boilerplate conventions
- [ ] Includes "Usage" section with invocation command
- [ ] Includes "Inputs" and "Outputs" sections where applicable
- [ ] Succinct and precise language used throughout

## Leaf-Level Documentation (Agents)

- [ ] Each agent file read completely including XML structure, commands, persona
- [ ] README.md includes frontmatter with current last-redoc-date
- [ ] Description is 1-3 paragraphs of technical writer quality
- [ ] Lists all available commands clearly
- [ ] Explains when to use this agent
- [ ] Highlights unique capabilities vs standard agent patterns

## Mid-Level Documentation (Folders)

- [ ] All child README.md files read before generating folder README
- [ ] Workflows categorized logically if massive folder (>10 items)
- [ ] Agents categorized by type if massive folder (>10 items)
- [ ] Catalog documents (WORKFLOWS-CATALOG.md, AGENTS-CATALOG.md) created for massive folders
- [ ] Catalog documents include frontmatter with last-redoc-date
- [ ] Folder README.md references catalog if one exists
- [ ] Folder README.md is succinct (1-2 paragraphs + listings/links)
- [ ] Notable/commonly-used items highlighted

## Root Module Documentation

- [ ] Module config.yaml read and understood
- [ ] Workflows and agents folder READMEs read before creating root README
- [ ] Root README includes frontmatter with current last-redoc-date
- [ ] Module purpose clearly stated in 2-3 sentences
- [ ] Links to /workflows/README.md and /agents/README.md included
- [ ] 2-3 key workflows mentioned with context
- [ ] 2-3 key agents mentioned with context
- [ ] Configuration section highlights UNIQUE settings only
- [ ] Usage section explains invocation patterns
- [ ] BMAD convention knowledge applied (describes only distinctive aspects)

## Quality Standards

- [ ] All documentation uses proper BMAD terminology
- [ ] Technical writer quality: clear, concise, professional
- [ ] No placeholder text or generic descriptions remain
- [ ] All links are valid and correctly formatted
- [ ] Frontmatter syntax is correct and dates are current
- [ ] No redundant explanation of standard BMAD patterns

## Validation and Reporting

- [ ] All planned documentation items created/updated
- [ ] Frontmatter dates verified as current across all files
- [ ] File paths and internal links validated
- [ ] Summary report generated with counts and coverage
- [ ] Files skipped (if any) documented with reasons

## Git Diff Analysis (Optional Step)

- [ ] last-redoc-date timestamps extracted correctly
- [ ] Git log queried for changes since last redoc
- [ ] Modified files identified and reported
- [ ] Findings presented clearly to user

## Final Validation

- [ ] Documentation Coverage
  - All README.md files in scope created/updated
  - Catalog documents created where needed
  - No documentation gaps identified

- [ ] Execution Quality
  - Reverse-tree order followed (leaf → root)
  - Autonomous execution (minimal user prompts)
  - Only clarification questions asked when truly necessary

- [ ] Output Quality
  - Technical precision maintained throughout
  - Succinct descriptions (no verbose explanations)
  - Professional documentation standards met
