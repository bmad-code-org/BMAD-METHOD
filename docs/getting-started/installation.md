# Installation

Get BMAD Method running in your project in under 2 minutes.

## Quick Install

```bash
npx bmad-method@alpha install
```

This interactive installer will:

1. Detect your IDE (Claude Code, Cursor, VS Code, etc.)
2. Let you choose which modules to install
3. Configure agents and workflows for your project

## Requirements

- **Node.js** 18+ (for the installer)
- **Git** (recommended for version control)
- An **AI-powered IDE** or access to Claude/ChatGPT/Gemini

## Module Options

During installation, you'll choose which modules to install:

| Module   | Description      | Best For                                 |
| -------- | ---------------- | ---------------------------------------- |
| **BMM**  | BMAD Method Core | Software development projects            |
| **BMGD** | Game Development | Game projects with specialized workflows |
| **BMB**  | Builder          | Creating custom agents and workflows     |

## Post-Installation

After installation, your project will have:

```
your-project/
├── _bmad/              # BMAD configuration and agents
│   ├── bmm/            # Method module (if installed)
│   ├── bmgd/           # Game dev module (if installed)
│   └── config.yaml     # Your project configuration
├── .claude/            # IDE-specific setup (varies by IDE)
└── ... your code
```

## Next Steps

1. **Read the [Quick Start Guide](../modules/bmm/quick-start.md)** to build your first feature
2. **Check your [IDE Guide](../ide-info/index.md)** for IDE-specific tips
3. **Explore [Workflows](../modules/bmm/workflows-planning.md)** to understand the methodology

## Alternative: Web Bundles

Don't want to install? Use BMAD agents directly in:

- **Claude Projects** - Upload the web bundle
- **ChatGPT** - Use custom GPT bundles
- **Gemini** - Import agent prompts

See the [Web Bundles Guide](../web-bundles-gemini-gpt-guide.md) for details.

## Troubleshooting

### Common Issues

**"Command not found: npx"**
: Install Node.js 18+ from [nodejs.org](https://nodejs.org)

**"Permission denied"**
: Run with appropriate permissions or check your npm configuration

**IDE not detected**
: The installer will prompt you to select your IDE manually

For more help, see [Troubleshooting](../modules/bmm/troubleshooting.md) or join our [Discord](https://discord.gg/bmad).
