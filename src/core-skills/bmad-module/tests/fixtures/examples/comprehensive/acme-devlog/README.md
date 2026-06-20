# acme-devlog

A daily engineering devlog for BMAD-driven projects.

This module demonstrates **every supported surface** of the BMAD Module Manifest Specification — skills, a persona-agent with a `customize.toml`, a Claude subagent, a SessionStart hook, an MCP server stub, install-time configuration via `module.yaml`, and a setup skill. Use it as a reference when authoring a real module.

## What it does

- **Write** a structured daily entry (template-driven) with `/bmad-devlog-write`.
- **Summarize** a date range with `/bmad-devlog-summarize`.
- **Consult Clio**, a persona-agent historian, with `/bmad-agent-historian`. Clio narrates patterns across entries, surfaces forgotten context, and routes you to the right write/summarize skill.
- **Show today's entry** at session start (via the `SessionStart` hook).
- **Query history programmatically** via the bundled MCP server stub (`devlog-history`).

## Install

```
bmad-module install acme/acme-devlog
```

Installs to `_bmad/devlog/`. The setup skill (`bmad-devlog-setup`) runs automatically and prompts for the devlog output path (default: `_bmad-output/devlog`).

## Configuration

After install, `_bmad/devlog/config.yaml` records your devlog path. Override defaults per skill via `_bmad/custom/`:

- Team: `_bmad/custom/bmad-agent-historian.toml`
- Personal: `_bmad/custom/bmad-agent-historian.user.toml`

See `docs/index.md` (in this repo) for the customization recipe.

## Uninstall

```
bmad-module remove devlog            # leaves _bmad/custom/bmad-agent-historian*.toml intact
bmad-module remove devlog --purge    # removes user customizations too
```

Devlog entries written to `_bmad-output/devlog/` are **never** deleted by uninstall.

## License

MIT. See `LICENSE`.
