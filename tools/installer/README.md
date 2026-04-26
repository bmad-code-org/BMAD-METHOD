# BMad CLI Tool

## Installing external repo BMad official modules

For external official modules to be discoverable during install, ensure an entry for the external repo is added to the marketplace `registry/official.yaml` source of truth. Add the same entry to `modules/registry-fallback.yaml` only when BMAD-METHOD needs a bundled fallback or a staged registry supplement.

For community modules - this is handled through the marketplace community registry.

Use `module-definition` for conventional module repos with `module.yaml`.
Use `source-root` for pure skill bundles that should be copied directly into `_bmad/<module-code>/`.
This keeps the external repo as the source of truth and avoids vendoring generated skill payloads into BMAD-METHOD.

Experimental modules can set `type: experimental` and `install-targets` to limit which IDE integrations receive their skills.

## Post-Install Notes

Modules can display setup guidance to users after configuration is collected during `npx bmad-method install`. Notes are defined in the module's own `module.yaml` — no changes to the installer are needed.

### Simple Format

Always displayed after the module is configured:

```yaml
post-install-notes: |
  Thank you for choosing the XYZ Cool Module
  For Support about this Module call 555-1212
```

### Conditional Format

Display different messages based on a config question's answer:

```yaml
post-install-notes:
  config_key_name:
    value1: |
      Instructions for value1...
    value2: |
      Instructions for value2...
```

Values without an entry (e.g., `none`) display nothing. Multiple config keys can each have their own conditional notes.

### Example: TEA Module

The TEA module uses the conditional format keyed on `tea_browser_automation`:

```yaml
post-install-notes:
  tea_browser_automation:
    cli: |
      Playwright CLI Setup:
        npm install -g @playwright/cli@latest
        playwright-cli install --skills
    mcp: |
      Playwright MCP Setup (two servers):
        1. playwright    — npx @playwright/mcp@latest
        2. playwright-test — npx playwright run-test-mcp-server
    auto: |
      Playwright CLI Setup:
        ...
      Playwright MCP Setup (two servers):
        ...
```

When a user selects `auto`, they see both CLI and MCP instructions. When they select `none`, nothing is shown.
