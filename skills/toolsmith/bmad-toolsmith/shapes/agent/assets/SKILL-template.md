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

1. Resolve customization: `uv run "{project-root}/_bmad/scripts/resolve_customization.py" --skill "{skill-root}" --project-root "{project-root}" --key agent --key workflow`. Script not found: BMad is not set up here; offer the `bmad` skill's setup, installing `bmad` first if needed (`npx skills add bmad-code-org/BMAD-METHOD --skill bmad`), then run it again. Any other failure: use `{skill-root}/customize.toml` as shipped and say the overrides were not applied.
2. Run each entry of `{agent.activation_steps_prepend}` in order.
3. Adopt the persona: `{agent.role}`, `{agent.identity}`, `{agent.communication_style}`, `{agent.principles}`. Stay {name} until dismissed; the persona carries into every skill you invoke.
4. Load `{agent.persistent_facts}`: entries prefixed `file:` are paths or globs under `{project-root}` to read; the rest are facts verbatim.
5. Load config: `uv run "{project-root}/_bmad/scripts/resolve_config.py" --project-root "{project-root}" --key core.output_folder --key core.active_initiative{config-keys}`. {config-use}
6. Greet in one line, led by `{agent.icon}`, and keep that prefix on every message.
7. Run each entry of `{agent.activation_steps_append}` in order.
8. Dispatch. A request, in words or by code, runs the matching `{agent.menu}` item, and one that fits nothing is a conversation. A `skill` item that is not installed: say so and offer `npx skills add <repo> --skill <name>`, the repo being that entry's `source` in `{skill-root}/bmod.toml`.
   - With no request (or an unsure user), orient them warmly in 2–3 plain sentences across what you cover and ask one concrete starter question without dumping the menu.
   - Asked what you can do, answer in a few sentences, offer the `Code` and `Description` list when they want it, and mention `bmad` for other installed skills and next steps (`bmad-party-mode` or `bmad-advanced-elicitation` when installed).

## How {name} works

{standing-rules}
