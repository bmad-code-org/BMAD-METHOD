# Technology Stack & Setup

## Core Technologies

### Runtime
- **Node.js**: v20+ (required)
- **JavaScript**: ES6+ with CommonJS modules
- **Package Manager**: npm

### Languages
- **Markdown**: Agent definitions, documentation
- **YAML**: Workflow configurations, settings
- **XML**: Structured agent data (embedded in markdown)
- **JavaScript**: CLI tools and bundler

## Project Dependencies

### Production Dependencies

```json
{
  "ora": "^8.1.1",           // Elegant terminal spinners
  "chalk": "^5.3.0",         // Terminal string styling
  "prompts": "^2.4.2",       // Interactive CLI prompts
  "commander": "^12.1.0",    // CLI framework
  "yaml": "^2.6.1",          // YAML parser
  "glob": "^11.0.0",         // File pattern matching
  "fast-xml-parser": "^4.5.0" // XML parsing
}
```

### Development Dependencies

```json
{
  "@eslint/js": "^9.17.0",
  "eslint": "^9.17.0",
  "prettier": "^3.4.2",
  "husky": "^9.1.7",         // Git hooks
  "lint-staged": "^15.2.11"  // Pre-commit linting
}
```

## File Structure

```
bmad-method/
├── package.json              # Project metadata & scripts
├── package-lock.json         # Dependency lock
├── .nvmrc                    # Node version specification
├── .npmrc                    # npm configuration
├── eslint.config.mjs         # ESLint configuration
├── prettier.config.mjs       # Prettier configuration
├── .husky/                   # Git hooks
│   └── pre-commit           # Pre-commit checks
├── src/                      # Source code
│   └── modules/             # Module implementations
│       ├── bmm/             # BMad Method module
│       ├── bmb/             # BMad Builder module
│       └── cis/             # Creative Intelligence Suite
├── tools/                    # Build & development tools
│   └── cli/                 # Installation CLI
│       ├── install.js       # Interactive installer
│       ├── bundler.js       # Module bundler
│       └── utils/           # Shared utilities
├── bmad/                     # Installed framework (runtime)
│   ├── core/                # Core framework
│   ├── _cfg/                # User customizations
│   └── {modules}/           # Installed modules
├── docs/                     # Documentation
├── test/                     # Test files
└── .kilocode/               # Kilocode AI configuration
```

## Build & Development

### Available Scripts

```bash
# Install alpha version
npx bmad-method@alpha install

# Install stable version (v4)
npx bmad-method install

# Development (from source)
npm install
npm run lint
npm run format
```

### Code Quality

**ESLint**: JavaScript linting
- Config: `eslint.config.mjs`
- Rules: ES6+ standards
- Auto-fix on pre-commit

**Prettier**: Code formatting
- Config: `prettier.config.mjs`
- Runs on pre-commit via lint-staged
- Formats JS, JSON, YAML, MD

**Husky**: Git hooks
- Pre-commit: Runs lint-staged
- Ensures code quality before commits

## Installation Process

### User Installation Flow

1. User runs: `npx bmad-method@alpha install`
2. CLI downloads and executes installer
3. Interactive prompts:
   - Project location
   - Module selection (BMM, BMB, CIS)
   - User configuration (name, language)
   - Game development option (for BMM)
   - IDE selection
4. Installer generates:
   - `bmad/` directory structure
   - Module files (core + selected)
   - `config.yaml` with user settings
   - Customization templates in `_cfg/`
   - IDE-specific config files
   - Manifests (agents, workflows, tasks)
5. IDE integration setup
6. Completion message with next steps

### Technical Installation Details

**Module Bundling**:
- Source in `src/modules/`
- CLI bundles to distributable format
- Copies to user's project as `bmad/{module}/`

**Manifest Generation**:
- Scans installed agents → `agent-manifest.csv`
- Scans workflows → `workflow-manifest.csv`
- Scans tasks → `task-manifest.csv`
- Used for runtime discovery

**IDE Integration**:
- **Claude Code**: `.claude/` directory setup
- **Cursor**: `.cursorrules` file generation
- **VS Code**: `.vscode/` settings
- **Cline/Roo**: Compatible formats

## Configuration Files

### Project Configuration

**config.yaml** (bmad/core/config.yaml)
```yaml
user_name: "Developer Name"
communication_language: "en"
output_folder: "_docs"
project_name: "MyProject"
```

### Agent Customization

**Agent Override** (bmad/_cfg/agents/agent-name.yaml)
```yaml
name: "Custom Name"
description: "Custom description"
communication_style: "Custom style"
additional_instructions: "Extra behavior"
```

### IDE Configuration

**.claude/** (Claude Code)
- Agent files as slash commands
- Task shortcuts
- Workflow commands

**.cursorrules** (Cursor)
- Inline rules for agent behavior
- Project-specific instructions

## Development Workflow

### Working with Agents

1. Create/edit in `src/modules/{module}/agents/`
2. Use XML-in-markdown format
3. Test with IDE integration
4. Customizations go to `bmad/_cfg/agents/`

### Working with Workflows

1. Create YAML in `src/modules/{module}/workflows/`
2. Add instructions.md
3. Optional: template.md, checklist.md
4. Test with BMad Master agent
5. Reference in agent menu items

### Testing Approach

- Manual testing via IDE integration
- Installer testing in clean environments
- Workflow validation with real projects
- User feedback from alpha testers

## Version Control

### What to Commit
- Source code (`src/`, `tools/`)
- Configuration (eslint, prettier, etc.)
- Documentation (`docs/`, READMEs)
- Package files (package.json, lock)

### What to Ignore (.gitignore)
- `node_modules/`
- `bmad/` (installed by users)
- IDE-specific files (user-dependent)
- Build artifacts
- `.env` files

## Distribution

### npm Package
- Package: `bmad-method`
- Alpha: `bmad-method@alpha`
- Stable: `bmad-method` (v4.x currently)
- Registry: npm public registry

### Installation Sources
1. **npx**: Direct from npm (recommended)
2. **GitHub**: Clone and run from source
3. **Local**: Development and testing

## Environment Requirements

### Minimum Requirements
- **Node.js**: v20.0.0+
- **OS**: Windows, macOS, Linux
- **IDE**: Any supporting markdown or AI agents
- **Disk**: ~50MB for framework + modules

### Recommended Setup
- **Node.js**: Latest LTS
- **IDE**: Claude Code, Cursor, or VS Code with AI extensions
- **Git**: For version control integration
- **Terminal**: Modern with Unicode support

## Troubleshooting

### Common Issues
1. **Node version mismatch**: Check `.nvmrc`, use nvm
2. **Installation fails**: Clear npm cache, retry
3. **Agent not loading**: Check file paths, manifests
4. **Config not found**: Verify `bmad/core/config.yaml` exists
5. **Customization not applying**: Check YAML syntax, file names

### Debug Mode
- Check installer output for errors
- Verify manifest files were generated
- Confirm config.yaml has all required fields
- Test agents individually before workflows
