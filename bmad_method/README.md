# bmad-method (Python installer)

A **pure-Python** installer for the [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD):
`pip install bmad-method` gives you a `bmad` command that scaffolds BMAD's
skills, agents, and workflows into a project for use with AI IDEs - **with no
npm / Node toolchain required**.

> **Proof of concept / draft.** This packaging is a good-faith PoC. The BMAD
> payload, name, and wordmark belong to the upstream project. Publishing under a
> `bmad-*` name on any index is **gated on the upstream redistribution /
> trademark ruling** - see the bundled `TRADEMARK.md`.

## Usage

```bash
# Non-interactive scaffold into the current directory
bmad install --directory . --modules bmm --tools claude-code --yes

# See which IDE/tool targets are supported
bmad list-tools
```

This creates a `_bmad/` directory (config + manifests + runtime scripts) and
installs the skills into your tool's skills directory (e.g. `.claude/skills/`
for Claude Code). Launch your AI agent and invoke the `bmad-help` skill to get
started.

## What it does

The BMAD payload - skills, agents, modules, runtime scripts - is just data
files (Markdown / YAML / Python). Only the *installer* was Node. This package
reimplements the install actions in Python:

1. copies the module payload into `_bmad/<module>/`;
2. generates the central config (`_bmad/config.toml`, per-module `config.yaml`)
   and manifests (`_bmad/_config/*`);
3. copies each skill into the selected tool's skills directory.

The scaffolded runtime is dependency-free and uses only the standard library
(`tomllib`, hence **Python 3.11+**). The installer itself depends on `PyYAML`
to parse `module.yaml` / `SKILL.md` frontmatter.

## Scope

This PoC targets fresh, non-interactive installs of the built-in `core` and
`bmm` modules. Updates, external/marketplace modules, and interactive prompts
are handled by the upstream Node installer and are out of scope here.
