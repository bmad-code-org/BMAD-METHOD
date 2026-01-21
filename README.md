![BMad Method](banner-bmad-method.png)

[![Version](https://img.shields.io/npm/v/bmad-method?color=blue&label=version)](https://www.npmjs.com/package/bmad-method)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/gk8jAdXWmj)

**Build More, Architect Dreams** — An AI-driven agile development framework with 21 specialized agents, 50+ guided workflows, and scale-adaptive intelligence that adjusts from bug fixes to enterprise systems.

**100% free and open source.** No paywalls. No gated content. No gated Discord. We believe in empowering everyone, not just those who can pay.

## Why BMad?

Traditional AI tools do the thinking for you, producing average results. BMad agents act as expert collaborators who guide you through structured workflows to bring out your best thinking.

- **Scale-Adaptive**: Automatically adjusts planning depth based on project complexity (Level 0-4)
- **Structured Workflows**: Grounded in agile best practices across analysis, planning, architecture, and implementation
- **Specialized Agents**: 12+ domain experts (PM, Architect, Developer, UX, Scrum Master, and more)
- **Complete Lifecycle**: From brainstorming to deployment, with just-in-time documentation

## Quick Start

**Prerequisites**: [Node.js](https://nodejs.org) v20+

```bash
npx bmad-fh install
```

Follow the installer prompts to configure your project. Then run:

```bash
*workflow-init
```

This analyzes your project and recommends a track:

| Track           | Best For                  | Time to First Story |
| --------------- | ------------------------- | ------------------- |
| **Quick Flow**  | Bug fixes, small features | ~5 minutes          |
| **BMad Method** | Products and platforms    | ~15 minutes         |
| **Enterprise**  | Compliance-heavy systems  | ~30 minutes         |

## Modules

| Module                                | Purpose                                                  |
| ------------------------------------- | -------------------------------------------------------- |
| **BMad Method (BMM)**                 | Core agile development with 34 workflows across 4 phases |
| **BMad Builder (BMB)**                | Create custom agents and domain-specific modules         |
| **Creative Intelligence Suite (CIS)** | Innovation, brainstorming, and problem-solving           |

## Documentation

**[Full Documentation](http://docs.bmad-method.org)** — Tutorials, how-to guides, concepts, and reference

- [Getting Started Tutorial](http://docs.bmad-method.org/tutorials/getting-started/getting-started-bmadv6/)
- [Upgrading from Previous Versions](http://docs.bmad-method.org/how-to/installation/upgrade-to-v6/)

### For v4 Users

- **[v4 Documentation](https://github.com/bmad-code-org/BMAD-METHOD/tree/V4/docs)**

## Multi-Scope Parallel Development

BMad supports running multiple workflows in parallel across different terminal sessions with isolated artifacts. Perfect for:

- **Multi-team projects** — Each team works in their own scope
- **Parallel feature development** — Develop auth, payments, and catalog simultaneously
- **Microservices** — One scope per service with shared contracts
- **Experimentation** — Create isolated scopes for spikes and prototypes

### Quick Start

```bash
# Initialize scope system
npx bmad-fh scope init

# Create a scope (you'll be prompted to activate it)
npx bmad-fh scope create auth --name "Authentication Service"
# ✓ Scope 'auth' created successfully!
# ? Set 'auth' as your active scope for this session? (Y/n)

# Run workflows - artifacts now go to _bmad-output/auth/
# The active scope is stored in .bmad-scope file

# For parallel development in different terminals:
# Terminal 1:
npx bmad-fh scope set auth     # Activate auth scope
# Terminal 2:
npx bmad-fh scope set payments # Activate payments scope

# Share artifacts between scopes
npx bmad-fh scope sync-up auth       # Promote to shared layer
npx bmad-fh scope sync-down payments # Pull shared updates
```

> **Important:** Workflows only use scoped directories when a scope is active.
> After creating a scope, accept the prompt to activate it, or run `scope set <id>` manually.

### CLI Reference

| Command                            | Description                                 |
| ---------------------------------- | ------------------------------------------- |
| `npx bmad-fh scope init`           | Initialize the scope system in your project |
| `npx bmad-fh scope list`           | List all scopes (alias: `ls`)               |
| `npx bmad-fh scope create <id>`    | Create a new scope (alias: `new`)           |
| `npx bmad-fh scope info <id>`      | Show scope details (alias: `show`)          |
| `npx bmad-fh scope set [id]`       | Set active scope for session (alias: `use`) |
| `npx bmad-fh scope unset`          | Clear active scope (alias: `clear`)         |
| `npx bmad-fh scope remove <id>`    | Remove a scope (aliases: `rm`, `delete`)    |
| `npx bmad-fh scope archive <id>`   | Archive a completed scope                   |
| `npx bmad-fh scope activate <id>`  | Reactivate an archived scope                |
| `npx bmad-fh scope sync-up <id>`   | Promote artifacts to shared layer           |
| `npx bmad-fh scope sync-down <id>` | Pull shared updates into scope              |
| `npx bmad-fh scope help [cmd]`     | Show help (add command for detailed help)   |

### Create Options

```bash
npx bmad-fh scope create auth \
  --name "Authentication Service" \
  --description "User auth, SSO, and session management" \
  --deps users,notifications \
  --context  # Create scope-specific project-context.md
```

### Directory Structure

After initialization and scope creation:

```
project-root/
├── _bmad/
│   ├── _config/
│   │   └── scopes.yaml          # Scope registry and settings
│   └── _events/
│       ├── event-log.yaml       # Event history
│       └── subscriptions.yaml   # Cross-scope subscriptions
│
├── _bmad-output/
│   ├── _shared/                 # Shared knowledge layer
│   │   ├── project-context.md   # Global project context
│   │   ├── contracts/           # Integration contracts
│   │   └── principles/          # Architecture principles
│   │
│   ├── auth/                    # Auth scope artifacts
│   │   ├── planning-artifacts/
│   │   ├── implementation-artifacts/
│   │   └── tests/
│   │
│   └── payments/                # Payments scope artifacts
│       └── ...
│
└── .bmad-scope                  # Session-sticky active scope (gitignored)
```

### Access Model

Scopes follow a "read-any, write-own" isolation model:

| Operation | Own Scope | Other Scopes | \_shared/   |
| --------- | --------- | ------------ | ----------- |
| **Read**  | Allowed   | Allowed      | Allowed     |
| **Write** | Allowed   | Blocked      | via sync-up |

### Workflow Integration

Workflows (run via agent menus like `CP` for Create PRD, `DS` for Dev Story) automatically detect and use scope context. Resolution order:

1. Session context from `.bmad-scope` file (set via `scope set`)
2. `BMAD_SCOPE` environment variable
3. Prompt user to select or create scope

**Setting your active scope:**

```bash
# Set scope for your terminal session
npx bmad-fh scope set auth

# Or use environment variable (useful for CI/CD)
export BMAD_SCOPE=auth
```

**Scope-aware path variables in workflows:**

- `{scope}` → Scope ID (e.g., "auth")
- `{scope_path}` → `_bmad-output/auth`
- `{scope_planning}` → `_bmad-output/auth/planning-artifacts`
- `{scope_implementation}` → `_bmad-output/auth/implementation-artifacts`
- `{scope_tests}` → `_bmad-output/auth/tests`

### Getting Help

```bash
# Show comprehensive help for all scope commands
npx bmad-fh scope help

# Get detailed help for a specific command
npx bmad-fh scope help create
npx bmad-fh scope help sync-up
```

See [Multi-Scope Guide](docs/multi-scope-guide.md) for complete documentation.

## Community

- [Discord](https://discord.gg/gk8jAdXWmj) — Get help, share ideas, collaborate
- [YouTube](https://www.youtube.com/@BMadCode) — Tutorials, master class, and podcast (launching Feb 2025)
- [GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues) — Bug reports and feature requests
- [Discussions](https://github.com/bmad-code-org/BMAD-METHOD/discussions) — Community conversations

## Support BMad

BMad is free for everyone — and always will be. If you'd like to support development:

- ⭐ [Star us on GitHub](https://github.com/bmad-code-org/BMAD-METHOD/) — Helps others discover BMad
- 📺 [Subscribe on YouTube](https://www.youtube.com/@BMadCode) — Master class launching Feb 2026
- ☕ [Buy Me a Coffee](https://buymeacoffee.com/bmad) — Fuel the development
- 🏢 Corporate sponsorship — DM on Discord
- 🎤 Speaking & Media — Available for conferences, podcasts, interviews (Discord)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License — see [LICENSE](LICENSE) for details.

---

**BMad** and **BMAD-METHOD** are trademarks of BMad Code, LLC. See [TRADEMARK.md](TRADEMARK.md) for details.

[![Contributors](https://contrib.rocks/image?repo=bmad-code-org/BMAD-METHOD)](https://github.com/bmad-code-org/BMAD-METHOD/graphs/contributors)

See [CONTRIBUTORS.md](CONTRIBUTORS.md) for contributor information.
