# Current Development Context

## Active Development Focus

**Branch**: `v6-alpha`

**Status**: Alpha release - active development and refinement

## Recent Major Changes

### v6 Alpha Features
- Revolutionary scale-adaptive workflows (Levels 0-4)
- Project-adaptive architecture documentation
- Full agent customization via `bmad/_cfg/agents/`
- Multi-language support (communication + output)
- Unified installation system with module selection
- Smart context engine for brownfield projects

### Architectural Improvements
- Unified `bmad/` directory structure (vs scattered folders)
- Agent customization system that survives updates
- Improved installer with migration detection
- Modular architecture allowing domain-specific extensions
- IDE integration framework

## Current Work Areas

1. **Kilocode Integration**: Optimizing workflows, agents, modes, and rules for Kilocode AI
2. **Documentation**: Maintaining comprehensive guides for v6 features
3. **Testing**: Ensuring stability across installation scenarios
4. **Community**: Supporting alpha users and gathering feedback

## Key Files to Know

- `tools/cli/` - Installation and bundler CLI
- `bmad/core/` - Core framework code
- `bmad/core/agents/bmad-master.md` - Central orchestrator
- `bmad/core/config.yaml` - User configuration
- `bmad/_cfg/` - User customizations directory
- `src/modules/` - Module source code

## Development Conventions

- Agent files use XML-structured markdown with frontmatter
- Workflows defined in YAML with accompanying instructions
- Customizations in `_cfg/` directory survive updates
- All modules install to single `bmad/` folder
- CLI tools built with Node.js (v20+)

## Known Constraints

- Alpha version - expect breaking changes
- Some workflows marked as "todo" (not yet implemented)
- Migration from v4 requires careful handling
- Node.js v20+ required
- IDE integration varies by environment

## Next Priorities

1. Stabilize v6 core features
2. Complete remaining workflow implementations
3. Enhance Kilocode integration
4. Gather alpha feedback and iterate
5. Prepare for beta release
