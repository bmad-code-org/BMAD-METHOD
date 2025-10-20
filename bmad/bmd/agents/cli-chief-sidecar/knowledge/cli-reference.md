# CLI Reference - Primary Knowledge Source

**Primary Reference:** `{project-root}/tools/cli/README.md`

This document contains Scott's curated knowledge about the CLI system. The full README should always be consulted for complete details.

## Quick Architecture Overview

### Two Primary Functions

1. **Installation** - Compiles YAML agents to IDE-integrated markdown files
   - Entry: `commands/install.js`
   - Compiler flag: `forWebBundle: false`
   - Output: `{target}/bmad/` + IDE directories
   - Features: customize.yaml merging, IDE artifacts, manifest generation

2. **Bundling** - Packages agents into standalone web bundles
   - Entry: `bundlers/bundle-web.js`
   - Compiler flag: `forWebBundle: true`
   - Output: `web-bundles/`
   - Features: Inline dependencies, no filesystem access needed

### Core Components

**Compilation Engine** (`lib/yaml-xml-builder.js`)

- Converts YAML agents to XML
- Handles both IDE and web formats
- Uses fragment system for modular activation blocks

**Installer** (`installers/lib/core/installer.js`)

- Orchestrates full installation flow
- Manages 6 stages: input → pre-install → install → IDE → manifests → validation

**IDE System** (`installers/lib/ide/`)

- 14 IDE integrations via base-derived architecture
- BaseIDE class provides common functionality
- Each handler implements: setup(), createArtifacts(), cleanup()

**Manifest Generator** (`installers/lib/core/manifest-generator.js`)

- Creates 5 manifest files: installation, workflows, agents, tasks, files
- Enables update detection and integrity validation

### Key Directories

```
tools/cli/
├── bmad-cli.js              # Main entry point
├── commands/                # CLI command handlers
├── bundlers/                # Web bundling system
├── installers/              # Installation system
│   └── lib/
│       ├── core/           # Core installer logic
│       ├── modules/        # Module processing
│       └── ide/            # IDE integrations
└── lib/                    # Shared compilation utilities
```

### Fragment System

Location: `src/utility/models/fragments/`

- `activation-steps.xml` - IDE activation (filesystem-aware)
- `web-bundle-activation-steps.xml` - Web activation (bundled)
- `menu-handlers.xml` - Menu handler wrapper
- `handler-*.xml` - Individual handler types (workflow, exec, tmpl, data, action)

Fragments are injected dynamically based on agent capabilities.

### Common Operations

**Adding New IDE Support:**

1. Create handler: `installers/lib/ide/{ide-code}.js`
2. Extend BaseIDE class
3. Implement required methods
4. Auto-discovered on next run

**Adding Menu Handlers:**

1. Create fragment: `fragments/handler-{type}.xml`
2. Update agent-analyzer.js to detect attribute
3. Update activation-builder.js to inject fragment

**Debugging Installation:**

- Check logs for compilation errors
- Verify target directory permissions
- Validate module dependencies resolved
- Confirm IDE artifacts created

## Scott's Operational Notes

### Common Issues to Watch For

1. **Path Resolution** - Always use `{project-root}` variables
2. **Backward Compatibility** - Test with existing installations
3. **IDE Artifacts** - Verify creation for all selected IDEs
4. **Config Merging** - Ensure customize.yaml properly merged
5. **Manifest Generation** - All 5 files must be created

### Best Practices

1. **Test in Isolation** - Use temporary directories for testing
2. **Check Dependencies** - 4-pass system should resolve all refs
3. **Validate Compilation** - Every agent must compile without errors
4. **Verify Integrity** - File hashes must match manifests
5. **Document Changes** - Update README when adding features

### Future Enhancement Areas

- Enhanced error reporting with recovery suggestions
- Installation dry-run mode
- Partial update capability
- Better rollback mechanisms
- Performance optimization for large module sets

---

**Captain's Note:** This is a living document. Update as patterns emerge and knowledge grows!
