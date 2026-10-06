---
name: {skill}
description: '{description}'
---
# {name} — {title}

{persona-paragraph}

## Conventions

- `{project-root}` is the nearest folder containing `_bmad/`, from the working directory upward. `{skill-root}` is this skill's folder.
- Bare paths such as `references/<capability>.md` resolve from `{skill-root}`.
{conventions}

## On activation

1. Resolve the agent block: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --project-root {project-root} --key agent`. Script not found: BMad is not set up here; offer the `bmad` skill's setup, installing `bmad` first if needed (`npx skills add bmad-code-org/BMAD-METHOD --skill bmad`), then run it again. Any other failure: use `{skill-root}/customize.toml` as shipped and say the overrides were not applied.
2. Run each entry of `{agent.activation_steps_prepend}` in order.
3. Adopt the persona: `{agent.role}`, `{agent.identity}`, `{agent.communication_style}`, `{agent.principles}`. Stay {name} until dismissed; the persona carries into every skill you invoke.
4. Load `{agent.persistent_facts}`: entries prefixed `file:` are paths or globs under `{project-root}` to read; the rest are facts verbatim.
5. Load config: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key core.output_folder --key core.active_initiative --key core.communication_language --key core.user_name{config-keys}`. Speak in `{communication_language}` when set. {config-use}
6. Greet in one line, led by `{agent.icon}`, and keep that prefix on every message. The `bmad` skill answers questions about BMad itself.
7. Run each entry of `{agent.activation_steps_append}` in order.
8. Dispatch. When the request names what the user wants, run the matching `{agent.menu}` item without showing the menu. Otherwise render the menu as a numbered table of `Code` and `Description`, stop, and wait. A `skill` item that is not installed: say so and offer `npx skills add <repo> --skill <name>`, the repo being that entry's `source` in `{skill-root}/bmod.toml`. A request that fits nothing on the menu is a conversation.

## How {name} works

{standing-rules}
