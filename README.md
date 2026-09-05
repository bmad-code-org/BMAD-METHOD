![BMad Method](banner-bmad-method.png)


[![Version](https://img.shields.io/github/v/tag/bmad-code-org/BMAD-METHOD?color=blue&label=version)](https://github.com/bmad-code-org/BMAD-METHOD/tags)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/gk8jAdXWmj)

**Agile Ai Driven Development — turn an idea or change request into working software without giving up the thinking.**

Ai Driven Development (AiDD) covers the whole effort, not only the code: what to build, how it holds together, and how it changes as you learn. BMad Method is the agile way to do it — decisions stay explicit, context carries forward, and the process sizes itself to the work. Small changes go straight to build. Complex work gets the depth it needs. The same method covers a weekend prototype and a system with years of history behind it.

![The BMad delivery loop: a vague notion starts at Clarify, a big clear idea at Plan, and a small change at Build and verify; Learn and adjust loops back to Plan](docs/images/bmad-delivery-loop.svg)

_Start anywhere. Use BMad end to end, or carry its briefs, specifications, and architecture into your existing delivery workflow._

## Start Building

Choose one install route. You need an AI coding tool that supports skills and
[uv](https://docs.astral.sh/uv/) for BMad setup and Python scripts.

**Skills CLI** — with [Node.js and npm](https://nodejs.org) and Git, run in your project:

```bash
npx skills add bmad-code-org/BMAD-METHOD
```

Select the skills and coding tool you want; include `bmad` for setup and help.

**Claude Code plugin** — add the marketplace inside Claude Code:

```text
/plugin marketplace add bmad-code-org/bmad-plugins
```

**Codex plugin** — add the marketplace from your terminal:

```bash
codex plugin marketplace add bmad-code-org/bmad-plugins
```

For either marketplace, install `bmad-method` for the delivery workflows and
`bmad-toolbox` for standalone skills, including the `bmad` hub.

Open your coding tool in the project and ask the `bmad` skill to run
`bmad setup`. Then invoke `bmad-build` with what you want to change. Ask
`bmad` whenever you want guidance on what comes next or what is optional.

**[Build your first project with BMad →](https://docs.bmad-method.org/start/build-your-first-change/)**

**[Add BMad to an existing codebase →](https://docs.bmad-method.org/existing-codebases/start-in-an-existing-codebase/)**

BMad is free and open source, with no paywalled workflows or gated community.
Use `bmad update` to check versions; install updates with `npx skills update`
or your plugin marketplace. After updating, ask for `bmad doctor` to repair
the project's existing runtime.

## Why BMad?

Coding assistants are effective at implementation, but they often turn unstated assumptions into code. BMad keeps you in control while its agents and workflows make the important decisions explicit and preserve them as context for the work that follows.

- **Right-sized process** — Go directly to implementation for clear changes or add deeper planning for larger initiatives.
- **New or existing code** — Start from nothing, or establish verified context on a codebase you inherited and work from what is actually there.
- **Durable context** — Carry product and technical decisions forward instead of re-explaining them in every chat.
- **Specialized perspectives** — Bring in product, architecture, UX, development, and testing expertise when it helps.
- **Guided collaboration** — Use structured workflows and multiple-agent discussions without handing over judgment.
- **One delivery path** — Move from early thinking through reviewed implementation, correction, and learning.

[See how much planning a change needs →](https://docs.bmad-method.org/plan/choose-a-planning-path/)

## BMad Ecosystem

Install the core method or add official modules for specialized work.

| Module | Purpose |
| --- | --- |
| **[BMad Method](https://github.com/bmad-code-org/BMAD-METHOD)** | Plan and deliver software, from new prototypes to established codebases |
| **[BMad Builder](https://github.com/bmad-code-org/bmad-builder)** | Skill, workflow, and agent builder |
| **[BMad Creative Intelligence Suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)** | Creative thinking partners for innovation, design thinking, and storytelling |
| **[BMad Test Architect](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise)** | Enterprise testing add-on for BMad Method |
| **[BMad Loop](https://github.com/bmad-code-org/bmad-loop)** | Builds, verifies, and retros a whole epic unattended |
| **[BMad Game Dev Studio](https://github.com/bmad-code-org/bmad-module-game-dev-studio)** | Ideate, design, and build games in any framework, including Unity, Unreal, Godot, and Phaser |

## Plan on the Web

[Web bundles](https://bmadcode.com/web-bundles/) package selected BMad workflows as Google Gemini Gems and ChatGPT Custom GPTs. Use them for planning in your existing web subscription, then bring the resulting artifacts into your AI coding tool for implementation.

## Documentation

- **[Build Your First Change](https://docs.bmad-method.org/start/build-your-first-change/)** — Install BMad and build a small project.
- **[Choose a Planning Path](https://docs.bmad-method.org/plan/choose-a-planning-path/)** — Pick how much planning a change needs and see what each planning skill produces.
- **[Start in an Existing Codebase](https://docs.bmad-method.org/existing-codebases/start-in-an-existing-codebase/)** — Add BMad to an existing codebase.

## Community

- [Discord](https://discord.gg/gk8jAdXWmj) — Get help, share ideas, and collaborate.
- [YouTube](https://youtube.com/@BMadCode) — Watch tutorials and master classes.
- [GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues) — Report bugs and request features.
- [GitHub Discussions](https://github.com/bmad-code-org/BMAD-METHOD/discussions) — Join longer community conversations.
- [BMad Code](https://bmadcode.com) — Explore the wider ecosystem.

## Support and Contributing

BMad is free for everyone and always will be. Star the repository, [buy me a coffee](https://buymeacoffee.com/bmad), or email <contact@bmadcode.com> for corporate sponsorship.

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

MIT License — see [LICENSE](LICENSE) for details.

**BMad** and **BMAD-METHOD** are trademarks of BMad Code, LLC. See [TRADEMARK.md](TRADEMARK.md) for details.

If you would like to contribute, join us in the discord and read [CONTRIBUTORS.md](CONTRIBUTORS.md) first.
