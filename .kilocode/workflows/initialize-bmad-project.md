# Initialize BMAD Project

This workflow helps set up a new project using the BMAD framework by running the interactive installer and configuring the development environment.

## Prerequisites

- Node.js v20+ installed
- Project directory created
- IDE ready for BMAD integration

## Workflow Steps

### 1. Verify Prerequisites

First, check that Node.js is properly installed:

```bash
node --version
```

Ensure the version is v20 or higher. If not, install or upgrade Node.js from https://nodejs.org

### 2. Navigate to Project Directory

Change to your project's root directory:

```bash
cd /path/to/your/project
```

### 3. Run BMAD Installer

Execute the BMAD v6 Alpha installer:

```bash
npx bmad-method@alpha install
```

For stable v4 version (production):

```bash
npx bmad-method install
```

### 4. Complete Interactive Setup

The installer will prompt you for:

1. **Project Location**: Confirm or specify the installation directory
2. **Module Selection**: Choose which modules to install:
   - BMM (BMad Method) - Recommended for software/game development
   - BMB (BMad Builder) - For creating custom agents/workflows
   - CIS (Creative Intelligence Suite) - Shared creative resources
3. **Game Development**: If installing BMM, optionally include game development agents
4. **User Configuration**:
   - Your name (used by agents)
   - Preferred communication language
   - Output folder preference
   - Project name
5. **IDE Integration**: Select your development environment
   - Claude Code
   - Cursor
   - VS Code
   - Other

### 5. Verify Installation

Check that the `bmad/` directory was created:

```bash
ls bmad/
```

You should see:
- `core/` - Core framework
- `bmm/` or `bmb/` or `cis/` - Selected modules
- `_cfg/` - Customization directory

### 6. Review Configuration

Check the generated configuration:

```bash
cat bmad/core/config.yaml
```

Verify your settings are correct. Edit if needed.

### 7. Test Agent Activation

Activate the BMad Master agent in your IDE and verify it loads correctly. You should see:

- Welcome message with your name
- Menu of available options
- Ability to list workflows and tasks

### 8. Run Initial Workflow (Optional)

For BMM users, start the project initialization workflow:

```bash
/workflow-init
```

This will guide you through setting up your project's workflow system based on complexity.

## Post-Installation Tasks

- [ ] Configure IDE-specific settings if needed
- [ ] Review available agents in `bmad/_cfg/agent-manifest.csv`
- [ ] Explore workflows in `bmad/_cfg/workflow-manifest.csv`
- [ ] Customize agent behaviors via `bmad/_cfg/agents/` if desired
- [ ] Add `bmad/` to `.gitignore` (recommended - users install their own)
- [ ] Commit any project-specific configuration changes

## Troubleshooting

**Node version too old**: Update Node.js to v20+

**Installation fails**:
- Clear npm cache: `npm cache clean --force`
- Try again with verbose logging: `npx bmad-method@alpha install --verbose`

**Agent not loading**:
- Verify `bmad/core/config.yaml` exists
- Check IDE integration was configured
- Restart IDE

**Customization not working**:
- Verify file structure in `bmad/_cfg/agents/`
- Check YAML syntax
- Ensure file names match agent slugs

## Next Steps

Once installation is complete:

1. **For BMM**: Run `/workflow-init` with Analyst agent
2. **For BMB**: Explore agent/workflow creation workflows
3. **General**: Review the documentation in `bmad/*/README.md` files

## Resources

- [BMAD Documentation](./README.md)
- [BMM Workflows Guide](./bmad/bmm/workflows/README.md)
- [BMB Creation Guide](./bmad/bmb/README.md)
- [v4 to v6 Upgrade Guide](./docs/v4-to-v6-upgrade.md)
