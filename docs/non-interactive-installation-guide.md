# Non-Interactive Installation Guide

This guide helps you convert interactive BMAD installations to non-interactive CLI commands for automation, CI/CD pipelines, and scripted deployments.

## Table of Contents

- [Quick Start](#quick-start)
- [Migration from Interactive to CLI](#migration-from-interactive-to-cli)
- [Common Use Cases](#common-use-cases)
- [CLI Options Reference](#cli-options-reference)
- [Team-Based Installation](#team-based-installation)
- [Profile-Based Installation](#profile-based-installation)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Minimal Non-Interactive Installation

```bash
npx bmad-method@alpha install -y
```

This installs BMAD with:
- Default user name from system (USER environment variable)
- Intermediate skill level
- Default output folder (`_bmad-output`)
- BMM module
- All agents and workflows from BMM

### Custom Non-Interactive Installation

```bash
npx bmad-method@alpha install -y \
  --user-name=YourName \
  --skill-level=advanced \
  --output-folder=.artifacts
```

## Migration from Interactive to CLI

### Step 1: Note Your Current Configuration

If you have an existing BMAD installation, check your configuration:

```bash
# View your current configuration
cat _bmad/core/config.yaml
cat _bmad/bmm/config.yaml
```

Example output:
```yaml
user_name: Alice
user_skill_level: intermediate
output_folder: "{project-root}/_bmad-output"
communication_language: English
```

### Step 2: Convert to CLI Command

Based on your configuration, build the equivalent CLI command:

```bash
npx bmad-method@alpha install -y \
  --user-name=Alice \
  --skill-level=intermediate \
  --output-folder=_bmad-output \
  --communication-language=English
```

### Step 3: Replicate Module and Agent Selection

Check what agents and workflows you currently have:

```bash
# View installed agents
cat _bmad/_config/agents.csv

# View installed workflows
cat _bmad/_config/workflows.csv
```

If you have specific agents installed, add them to your command:

```bash
npx bmad-method@alpha install -y \
  --user-name=Alice \
  --agents=dev,architect,pm
```

## Common Use Cases

### 1. CI/CD Pipeline Installation

```yaml
# .github/workflows/setup-bmad.yml
name: Setup BMAD
on: [push]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - name: Install BMAD
        run: npx bmad-method@alpha install -y --profile=minimal
```

### 2. Docker Container Setup

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY . .

# Install BMAD non-interactively
RUN npx bmad-method@alpha install -y \
    --user-name=ContainerUser \
    --skill-level=intermediate \
    --output-folder=.bmad-output

CMD ["npm", "start"]
```

### 3. Team Onboarding Script

```bash
#!/bin/bash
# onboard-developer.sh

echo "Setting up BMAD for $USER..."

npx bmad-method@alpha install -y \
  --user-name=$USER \
  --skill-level=intermediate \
  --team=fullstack \
  --output-folder=.bmad-output

echo "BMAD installation complete!"
```

### 4. Infrastructure as Code

```bash
# terraform/setup.sh
npx bmad-method@alpha install -y \
  --user-name=TerraformBot \
  --skill-level=advanced \
  --modules=core,bmm \
  --agents=dev,architect,analyst \
  --workflows=create-prd,create-architecture,dev-story
```

### 5. Minimal Developer Setup

For developers who only need code generation:

```bash
npx bmad-method@alpha install -y \
  --profile=minimal \
  --user-name=$USER
```

## CLI Options Reference

### Core Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `-y, --non-interactive` | Skip all prompts | `false` | `install -y` |
| `--user-name <name>` | User name | System user | `--user-name=Alice` |
| `--skill-level <level>` | Skill level | `intermediate` | `--skill-level=advanced` |
| `--output-folder <path>` | Output folder | `_bmad-output` | `--output-folder=.artifacts` |
| `--communication-language <lang>` | Communication language | `English` | `--communication-language=Spanish` |
| `--document-language <lang>` | Document language | `English` | `--document-language=French` |

### Module & Selection Options

| Option | Description | Example |
|--------|-------------|---------|
| `--modules <list>` | Comma-separated modules | `--modules=core,bmm,bmbb` |
| `--agents <list>` | Comma-separated agents | `--agents=dev,architect,pm` |
| `--workflows <list>` | Comma-separated workflows | `--workflows=create-prd,dev-story` |

### Team & Profile Options

| Option | Description | Example |
|--------|-------------|---------|
| `--team <name>` | Install predefined team | `--team=fullstack` |
| `--profile <name>` | Installation profile | `--profile=minimal` |

## Team-Based Installation

Teams are predefined bundles of agents and workflows optimized for specific use cases.

### Available Teams

#### Fullstack Team

```bash
npx bmad-method@alpha install -y --team=fullstack
```

**Includes:**
- Agents: analyst, architect, pm, sm, ux-designer
- Module: BMM

**Use for:** Full product development teams

#### Game Development Team

```bash
npx bmad-method@alpha install -y --team=gamedev
```

**Includes:**
- Agents: game-designer, game-dev, game-architect, game-scrum-master
- Workflows: brainstorm-game, game-brief, gdd, narrative
- Module: BMGD (Game Development)

**Use for:** Game development projects

### Modifying Team Selections

You can add or remove agents from a team:

```bash
# Add dev agent to fullstack team
npx bmad-method@alpha install -y --team=fullstack --agents=+dev

# Remove ux-designer from fullstack team
npx bmad-method@alpha install -y --team=fullstack --agents=-ux-designer

# Add and remove multiple
npx bmad-method@alpha install -y --team=fullstack --agents=+dev,+tea,-ux-designer
```

## Profile-Based Installation

Profiles are pre-configured installations for common scenarios.

### Available Profiles

#### Minimal Profile

```bash
npx bmad-method@alpha install -y --profile=minimal
```

**Includes:**
- Modules: core
- Agents: dev
- Workflows: create-tech-spec, quick-dev

**Use for:** Simple development, code generation only

#### Solo Developer Profile

```bash
npx bmad-method@alpha install -y --profile=solo-dev
```

**Includes:**
- Modules: core, bmm
- Agents: dev, architect, analyst, tech-writer
- Workflows: create-tech-spec, quick-dev, dev-story, code-review, create-prd, create-architecture

**Use for:** Individual developers working on full projects

#### Full Profile

```bash
npx bmad-method@alpha install -y --profile=full
```

**Includes:**
- All modules
- All agents
- All workflows

**Use for:** Maximum flexibility, exploring all BMAD features

#### Team Profile

```bash
npx bmad-method@alpha install -y --profile=team
```

**Includes:**
- Modules: core, bmm
- Agents: dev, architect, pm, sm, analyst, ux-designer
- Workflows: create-product-brief, create-prd, create-architecture, create-epics-and-stories, sprint-planning, create-story, dev-story, code-review, workflow-init

**Use for:** Team collaboration, full agile workflow

### Overriding Profile Settings

```bash
# Use minimal profile but add architect agent
npx bmad-method@alpha install -y --profile=minimal --agents=dev,architect

# Use solo-dev profile with custom output folder
npx bmad-method@alpha install -y --profile=solo-dev --output-folder=.custom
```

## Troubleshooting

### Issue: "Team not found"

**Solution:** Check available teams:

```bash
# List available teams in your installation
ls src/modules/*/teams/team-*.yaml
```

Available teams depend on installed modules. Ensure you have the required modules.

### Issue: "Agent not found in manifest"

**Solution:** The agent name might be incorrect. Check available agents:

```bash
# View all available agents
find src/modules -name "*.agent.yaml" -o -name "*-agent.md"
```

Common agent names: `dev`, `architect`, `pm`, `sm`, `analyst`, `ux-designer`, `tech-writer`

### Issue: "Installation hangs"

**Solution:** Ensure you're using the `-y` flag for non-interactive mode:

```bash
# Correct
npx bmad-method@alpha install -y

# Incorrect (will wait for input)
npx bmad-method@alpha install
```

### Issue: "Permission denied"

**Solution:** Check file permissions or run with appropriate privileges:

```bash
# Check current directory permissions
ls -la

# Ensure you have write permissions
chmod u+w .
```

### Issue: "Invalid skill level"

**Solution:** Use one of the valid skill levels:

- `beginner`
- `intermediate`
- `advanced`

```bash
# Correct
npx bmad-method@alpha install -y --skill-level=advanced

# Incorrect
npx bmad-method@alpha install -y --skill-level=expert
```

## Advanced Examples

### Reproducible Installation

Save your installation command for reproducibility:

```bash
#!/bin/bash
# install-bmad.sh - Reproducible BMAD installation

npx bmad-method@alpha install -y \
  --user-name=ProjectBot \
  --skill-level=intermediate \
  --output-folder=_bmad-output \
  --modules=core,bmm \
  --agents=dev,architect,pm,analyst \
  --workflows=create-prd,create-architecture,create-tech-spec,dev-story,code-review \
  --communication-language=English \
  --document-language=English
```

### Environment-Based Installation

Use environment variables for flexibility:

```bash
#!/bin/bash
# Detect user from environment
USER_NAME=${BMAD_USER:-$USER}

# Detect skill level from environment or default to intermediate
SKILL_LEVEL=${BMAD_SKILL_LEVEL:-intermediate}

npx bmad-method@alpha install -y \
  --user-name=$USER_NAME \
  --skill-level=$SKILL_LEVEL \
  --output-folder=${BMAD_OUTPUT_FOLDER:-_bmad-output}
```

### Conditional Installation

```bash
#!/bin/bash
# Install different configurations based on environment

if [ "$CI" = "true" ]; then
  # CI environment: minimal installation
  npx bmad-method@alpha install -y --profile=minimal
elif [ "$TEAM_MODE" = "true" ]; then
  # Team development: full team setup
  npx bmad-method@alpha install -y --team=fullstack
else
  # Local development: solo-dev profile
  npx bmad-method@alpha install -y --profile=solo-dev --user-name=$USER
fi
```

## Next Steps

- Read the [main README](../README.md) for BMAD overview
- Explore [Custom Content Installation](./custom-content-installation.md)
- Join the [BMAD Discord](https://discord.gg/gk8jAdXWmj) community

## Feedback

Found an issue or have a suggestion? Please report it at:
https://github.com/bmad-code-org/BMAD-METHOD/issues
