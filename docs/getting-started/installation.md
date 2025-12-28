# Installation

Get BMAD Method running in your project in under 2 minutes.

## Quick Install

```bash
npx bmad-method install
```

This interactive installer will:

1. Detect your IDE (Claude Code, Cursor, VS Code, etc.)
2. Let you choose which modules to install
3. Configure agents and workflows for your project

## Requirements

- **Node.js** 20+ (for the installer)
- **Git** (recommended for version control)
- An **AI-powered Agent and/or IDE** or access to Claude/ChatGPT/Gemini

## Module Options

During installation, you'll choose which modules to install:

| Module   | Description          | Best For                                              |
| -------- | -------------------- | ----------------------------------------------------- |
| **BMM**  | BMAD Method Core     | Software development projects                         |
| **BMGD** | Game Development     | Game projects with specialized workflows              |
| **CIS**  | Creative Intel Suite | Creativity Unlocking Suite, not software dev specific |
| **BMB**  | Builder              | Creating custom agents and workflows                  |

You will also be asked if you would like to install custom content (agents, workflows or modules) you have created with the BMB, or shared from others in the community.


## Post-Installation

After installation, your project will have:

```
your-project/
├── _bmad/              # BMAD configuration and agents
│   ├── bmm/            # Method module (if installed)
│   ├── bmgd/           # Game dev module (if installed)
│   ├── core/           # Always installed, includes party mode, advanced elicitation, and other core generic utils
│   ├── {others}/       # etc...
├── _bmad-output/       # BMAD default output folder - configurable during install
├── .claude/            # IDE-specific setup (varies by IDE)
└── ... your code       # maybe nothing else yet if a fresh new folder
```

## Next Steps

1. **Read the [Quick Start Guide](../modules/bmm/quick-start.md)** to build your first feature
2. **Explore [Workflows](../modules/bmm/workflows-planning.md)** to understand the methodology

## Troubleshooting

### Common Issues

**"Command not found: npx"**
: Install Node.js 20+ from [nodejs.org](https://nodejs.org)

**"Permission denied"**
: Run with appropriate permissions or check your npm configuration

For more help, join our [Discord](https://discord.gg/bmad).
