# Development Mode - Focus Areas

When in **bmad-dev** mode, focus on:

## Code Quality

- Follow ESLint configuration in `eslint.config.mjs`
- Use Prettier formatting from `prettier.config.mjs`
- Write clean, maintainable code
- Add comments for complex logic
- Consider performance implications

## BMAD Framework Conventions

- Respect the directory structure (`bmad/core/`, `bmad/{module}/`, `bmad/_cfg/`)
- Follow agent file structure (XML-in-markdown)
- Use proper workflow YAML format
- Maintain manifest files when adding agents/workflows
- Keep customizations in `_cfg/` directory

## Testing Mindset

- Test agent activation before committing
- Verify workflow execution
- Check config loading
- Validate customization overrides
- Run linting before commits

## Development Workflow

1. Read relevant files before modifying
2. Make changes following conventions
3. Test changes locally
4. Lint and format code
5. Commit with conventional commit messages

## File Operations

- Prefer editing existing files over creating new ones
- Use update-safe customization patterns
- Keep manifests in sync with actual files
- Validate YAML/XML syntax

## Error Handling

- Provide helpful error messages
- Check for file existence before reading
- Validate user input
- Handle edge cases gracefully
- Log errors with context
