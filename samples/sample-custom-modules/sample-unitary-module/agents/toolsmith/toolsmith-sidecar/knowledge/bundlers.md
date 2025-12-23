# Bundlers Domain

## File Index

- @/tools/cli/bundlers/bundle-web.js - CLI entry for bundling (uses Commander.js)
- @/tools/cli/bundlers/web-bundler.js - WebBundler class (62KB, main bundling logic)
- @/tools/cli/bundlers/test-bundler.js - Test bundler utilities
- @/tools/cli/bundlers/test-analyst.js - Analyst test utilities
- @/tools/validate-bundles.js - Bundle validation

## Bundle CLI Commands

```bash
# Bundle all modules
node tools/cli/bundlers/bundle-web.js all

# Clean and rebundle
node tools/cli/bundlers/bundle-web.js rebundle

# Bundle specific module
node tools/cli/bundlers/bundle-web.js module <name>

# Bundle specific agent
node tools/cli/bundlers/bundle-web.js agent <module> <agent>

# Bundle specific team
node tools/cli/bundlers/bundle-web.js team <module> <team>

# List available modules
node tools/cli/bundlers/bundle-web.js list

# Clean all bundles
node tools/cli/bundlers/bundle-web.js clean
```

## NPM Scripts

```bash
npm run bundle      # Generate all web bundles (output: web-bundles/)
npm run rebundle    # Clean and regenerate all bundles
npm run validate:bundles  # Validate bundle integrity
```

## Purpose

Web bundles allow BMAD agents and workflows to run in browser environments (like Claude.ai web interface, ChatGPT, Gemini) without file system access. Bundles inline all necessary content into self-contained files.

## Output Structure

```
web-bundles/
├── {module}/
│   ├── agents/
│   │   └── {agent-name}.md
│   └── teams/
│       └── {team-name}.md
```

## Architecture

### WebBundler Class

- Discovers modules from `src/modules/`
- Discovers agents from `{module}/agents/`
- Discovers teams from `{module}/teams/`
- Pre-discovers for complete manifests
- Inlines all referenced files

### Bundle Format

Bundles contain:

- Agent/team definition
- All referenced workflows
- All referenced templates
- Complete self-contained context

### Processing Flow

1. Read source agent/team
2. Parse XML/YAML for references
3. Inline all referenced files
4. Generate manifest data
5. Output bundled .md file

## Common Tasks

- Fix bundler output issues: Check web-bundler.js
- Add support for new content types: Modify WebBundler class
- Optimize bundle size: Review inlining logic
- Update bundle format: Modify output generation
- Validate bundles: Run `npm run validate:bundles`

## Relationships

- Bundlers consume what installers set up
- Bundle output should match docs (web-bundles-gemini-gpt-guide.md)
- Test bundles work correctly before release
- Bundle changes may need documentation updates

## Debugging

- Check `web-bundles/` directory for output
- Verify manifest generation in bundles
- Test bundles in actual web environments (Claude.ai, etc.)

---

## Domain Memories

<!-- Vexor appends bundler-specific learnings here -->
