# acme-devlog — Authoring & Customization

This doc lives in the module source. It is **excluded** from install via `bmad.install.ignore` (see `.claude-plugin/plugin.json`). Read it on GitHub or in a clone of the module repo, not under `_bmad/devlog/`.

## Customizing Clio

Clio's defaults live in `_bmad/devlog/skills/bmad-agent-historian/customize.toml`. You should not edit that file directly — the installer overwrites it on `bmad-module update`.

Instead, drop overrides into one of:

| File                                          | Scope            | Git status  |
| --------------------------------------------- | ---------------- | ----------- |
| `_bmad/custom/bmad-agent-historian.toml`      | Team (committed) | tracked     |
| `_bmad/custom/bmad-agent-historian.user.toml` | Personal         | git-ignored |

Both files use the same TOML shape as the base `customize.toml`. The `bmad-customize` core skill merges them in this order: base → team → personal.

**Merge rules:**

- Scalars: override wins.
- Tables: deep merge.
- Arrays of tables keyed by `code` (e.g. `[[agent.menu]]`): matching codes replace, new codes append.
- Other arrays (`persistent_facts`, `principles`, `activation_steps_*`): append.

### Example — add a menu item

`_bmad/custom/bmad-agent-historian.user.toml`:

```toml
[[agent.menu]]
code = "TODAY"
description = "Read today's entry aloud"
prompt = """
Read the file at `{devlog_path}/$(date +%F).md` if it exists. If not,
say "No entry yet for today — try the WRT menu item."
"""
```

### Example — change communication style

`_bmad/custom/bmad-agent-historian.toml`:

```toml
[agent]
communication_style = "Crisp, dry, footnoted. Cites entries like a historian writing for The Economist."
```

## Why a SessionStart hook?

The hook is convenience, not requirement. Disable it by removing the `hooks` field from `_bmad/devlog/.claude-plugin/plugin.json` (or by uninstalling). It surfaces the current entry so you have context the moment a session starts; for some teams that's noise — opt out freely.

## Why `module.yaml` lives under `skills/bmad-devlog-setup/assets/`?

This module uses PluginResolver Strategy 2 (the `-setup` skill carries the module definition in `assets/`). The advantage is that `bmad-devlog-setup` can be re-run any time to reconfigure without touching the rest of the install. The `bmad.moduleDefinition` field in `plugin.json` points the installer at the right file.

A simpler module can put `module.yaml` at `skills/module.yaml` (the default) and skip `bmad.setupSkill`.
