# Custom Agent Installation

Install and personalize BMAD agents in your project.

## Quick Start

```bash
# From your project directory with BMAD installed
npx bmad agent-install
```

Or if you have bmad-cli installed globally:

```bash
bmad agent-install
```

## What It Does

1. **Discovers** available agent templates from your custom agents folder
2. **Prompts** you to personalize the agent (name, behavior, preferences)
3. **Compiles** the agent with your choices baked in
4. **Installs** to your project's `.bmad/custom/agents/` directory
5. **Creates** IDE commands for all your configured IDEs (Claude Code, Codex, Cursor, etc.)
6. **Saves** your configuration for automatic reinstallation during BMAD updates

## Options

```bash
bmad agent-install [options]

Options:
  -p, --path <path>     Direct path to specific agent YAML file or folder
  -d, --defaults        Use default values without prompting
  -t, --target <path>   Target installation directory
```

## Example Session

```
🔧 BMAD Agent Installer

Found BMAD at: /project/.bmad
Searching for agents in: /project/.bmad/custom/agents

Available Agents:

  1. 📄 commit-poet (simple)
  2. 📚 journal-keeper (expert)

Select agent to install (number): 1

Selected: commit-poet

📛 Agent Persona Name

   Agent type: commit-poet
   Default persona: Inkwell Von Comitizen

   Custom name (or Enter for default): Fred

   Persona: Fred
   File: fred-commit-poet.md

📝 Agent Configuration

   What's your preferred default commit message style?
   * 1. Conventional (feat/fix/chore)
     2. Narrative storytelling
     3. Poetic haiku
     4. Detailed explanation
   Choice (default: 1): 1

   How enthusiastic should the agent be?
     1. Moderate - Professional with personality
   * 2. High - Genuinely excited
     3. EXTREME - Full theatrical drama
   Choice (default: 2): 3

   Include emojis in commit messages? [Y/n]: y

✨ Agent installed successfully!
   Name: fred-commit-poet
   Location: /project/.bmad/custom/agents/fred-commit-poet
   Compiled: fred-commit-poet.md

   ✓ Source saved for reinstallation
   ✓ Added to agent-manifest.csv
   ✓ Created IDE commands:
      claude-code: /bmad:custom:agents:fred-commit-poet
      codex: /bmad-custom-agents-fred-commit-poet
      github-copilot: bmad-agent-custom-fred-commit-poet
```

## Reinstallation

Custom agents are automatically reinstalled when you run `bmad init --quick`. Your personalization choices are preserved in `.bmad/_cfg/custom/agents/`.

## Installing Reference Agents

The BMAD source includes example agents you can install. **You must copy them to your project first.**

### Step 1: Copy the Agent Template

**For simple agents** (single file):

```bash
# From your project root
cp node_modules/bmad-method/src/modules/bmb/reference/agents/stand-alone/commit-poet.agent.yaml \
   .bmad/custom/agents/
```

**For expert agents** (folder with sidecar files):

```bash
# Copy the entire folder
cp -r node_modules/bmad-method/src/modules/bmb/reference/agents/agent-with-memory/journal-keeper \
   .bmad/custom/agents/
```

### Step 2: Install and Personalize

```bash
npx bmad agent-install
# or: bmad agent-install
```

The installer will:

1. Find the copied template in `.bmad/custom/agents/`
2. Prompt for personalization (name, behavior, preferences)
3. Compile and install with your choices baked in
4. Create IDE commands for immediate use

### Available Reference Agents

**Simple (standalone file):**

- `commit-poet.agent.yaml` - Commit message artisan with style preferences

**Expert (folder with sidecar):**

- `journal-keeper/` - Personal journal companion with memory and pattern recognition

Find these in the BMAD source:

```
src/modules/bmb/reference/agents/
├── stand-alone/
│   └── commit-poet.agent.yaml
└── agent-with-memory/
    └── journal-keeper/
        ├── journal-keeper.agent.yaml
        └── journal-keeper-sidecar/
```

## Creating Your Own

Place your `.agent.yaml` files in `.bmad/custom/agents/`. Use the reference agents as templates.

Key sections in an agent YAML:

- `metadata`: name, title, icon, type
- `persona`: role, identity, communication_style, principles
- `prompts`: reusable prompt templates
- `menu`: numbered menu items
- `install_config`: personalization questions (optional, at end of file)

See the reference agents for complete examples with install_config templates and XML-style semantic tags.
