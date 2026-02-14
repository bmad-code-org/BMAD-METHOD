# BMad CLI Tool

## Installing external repo BMad official modules

For external official modules to be discoverable during install, ensure an entry for the external repo is added to external-official-modules.yaml.

For community modules - this will be handled in a different way. This file is only for registration of modules under the bmad-code-org.

## Post-Install Configuration Notes for Module Authors

The installer can display setup guidance to users after a module's configuration is collected. This is handled by the `displayModulePostConfigNotes(moduleName)` method in `installers/lib/core/config-collector.js`.

### When It Runs

The method is called in two places:

- After `collectModuleConfig()` completes (full interactive configuration)
- After `collectModuleConfigQuick()` completes (quick mode with existing config)

This ensures users see relevant setup instructions regardless of installation path.

### Guards

Output is suppressed when:

- **Silent mode** (`this._silentConfig`) — non-interactive installations skip all output
- **Feature disabled** — e.g., if the config value is `'none'`, no guidance is needed

### Adding Support for a New Module

To add post-config notes for your module, add a conditional block in `displayModulePostConfigNotes()`:

```javascript
async displayModulePostConfigNotes(moduleName) {
  if (this._silentConfig) return;

  // Existing: TEA module handler
  if (moduleName !== 'tea') return;
  // ...

  // To add your module, replace the early return above with:
  if (moduleName === 'your-module') {
    const config = this.collectedConfig[moduleName];
    if (!config || !config.your_config_key) return;

    const value = config.your_config_key;
    if (value === 'none') return;

    const color = await prompts.getColor();
    await prompts.log.message('');
    await prompts.log.info(color.bold('Your Setup Instructions:'));
    await prompts.log.message(color.dim('  Instructions based on selected value...'));
  }
}
```

### Key Details

- Read config values from `this.collectedConfig[moduleName]`
- Use `prompts.log.info()` for headers and `prompts.log.message()` for details
- Use `color.bold()` and `color.dim()` for visual hierarchy
- The config question that drives the output is defined in the module's `module.yaml`

### Working Example: TEA Module

The TEA module defines a `tea_browser_automation` config question with options: `auto`, `cli`, `mcp`, `none`. After configuration, the handler at lines 1207-1235 displays Playwright CLI install commands and/or MCP setup links based on the user's selection.
