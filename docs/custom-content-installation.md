# Custom Content Installation

This guide explains how to create and install custom BMAD content including agents, workflows, and modules. Custom content allows you to extend BMAD's functionality with your own specialized tools and workflows that can be shared across projects or teams.

## Types of Custom Content

### 1. Custom Agents and Workflows (Standalone)

Custom agents and workflows are standalone content packages that can be installed without being part of a full module. These are perfect for:

- Sharing specialized agents across projects
- Building a personal Agent powered Notebook vault
- Distributing workflow templates
- Creating agent libraries for specific domains

#### Structure

A custom agents and workflows package follows this structure:

```
my-custom-agents/
├── module.yaml          # Package configuration
├── agents/              # Agent definitions
│   └── my-agent/
│       └── agent.md
└── workflows/           # Workflow definitions
    └── my-workflow/
        └── workflow.md
```

#### Configuration

Create a `module.yaml` file in your package root:

```yaml
code: my-custom-agents
name: 'My Custom Agents and Workflows'
default_selected: true
```

#### Example

See `/example-custom-content` for a working example of a folder with multiple random custom agents and workflows. Technically its also just a module, but you will be able to further pick and choose from this folders contents of what you do and do not want to include in a destination folder. This way, you can store all custom content source in one location and easily install it to different locations.

### 2. Custom Modules

Custom modules are complete BMAD modules that can include their own configuration, documentation, along with agents and workflows that all compliment each other. Additionally they will have their own installation scripts, data, and potentially other tools. Modules can be used for:

- Domain-specific functionality (e.g., industry-specific workflows, entertainment, education and training, medical, etc...)
- Integration with external systems
- Specialized agent collections
- Custom tooling and utilities

#### Structure

A custom module follows this structure:

```
my-module/
├── _module-installer/
│   ├── installer.js           # optional, when it exists it will run with module installation
├── module.yaml                # Module installation configuration with custom question and answer capture
├── docs/                      # Module documentation
├── agents/                    # Module-specific agents
├── workflows/                 # Module-specific workflows
├── data/                      # csv or other content to power agent intelligence or workflows
├── tools/                     # Custom tools, hooks, mcp
└── sub-modules/               # IDE-specific customizations
    ├── vscode/
    └── cursor/
```

#### Module Configuration

The `module.yaml` file defines how your module is installed:

```yaml
# Module metadata
code: my-module
name: 'My Custom Module'
default_selected: false

header: 'My Custom Module'
subheader: 'Description of what this module does'

# Configuration prompts
my_setting:
  prompt: 'Configure your module setting'
  default: 'default-value'
  result: '{value}'
```

#### Example

See `/example-custom-module` for a complete example:

## Installation Process

### Step 1: Running the Installer

When you run the existing normal BMAD installer - either from the cloned repo, OR via NPX, it will ask about custom content:

```
? Do you have custom content to install?
❯ No (skip custom content)
  Enter a directory path
  Enter a URL [Coming soon]
```

### Step 2: Providing Custom Content Path

If you select "Enter a directory path", the installer will prompt for the location:

```
? Enter the path to your custom content directory: /path/to/folder/containing/content/folder
```

The installer will:

- Scan for `module.yaml` files (modules)
- Display an indication of how many installable folders it has found. Note that a project with stand along agents and workflows all under a single folder like the example will just list the count as 1 for that directory.

### Step 3: Selecting Content

The installer presents a unified selection interface:

```
? Select modules and custom content to install:
[── Custom Content ──]
 ◉ My Custom Agents and Workflows (/path/to/custom)
[── Official Content ──]
 ◯ BMM: Business Method & Management
 ◯ CIS: Creativity & Innovation Suite
```

## Agent Sidecar Support

Agents with sidecar content can store personal data, memories, and working files outside of the `.bmad` directory. This separation keeps personal content separate from BMAD's core files.

### What is Sidecar Content?

Sidecar content includes:

- Agent memories and learning data
- Personal working files
- Temporary data
- User-specific configurations

### Sidecar Configuration

The sidecar folder location is configured during BMAD core installation:

```
? Where should users' agent sidecar memory folders be stored?
❯ .bmad-user-memory
```

### How It Works

1. **Agent Declaration**: Agents declare `hasSidecar: true` in their metadata
2. **Sidecar Detection**: The installer automatically detects folders with "sidecar" in the name
3. **Installation**: Sidecar content is copied to the configured location
4. **Path Replacement**: The `{agent_sidecar_folder}` placeholder in agent configurations is replaced with the actual path to the installed instance of the sidecar folder. Now when you use the agent, depending on its design, will use the content in sidecar to record interactions, remember things you tell it, or serve a host of many other issues.

### Example Structure

```
my-agent/
├── agent.md              # Agent definition
└── my-agent-sidecar/     # Sidecar content folder
    ├── memories/
    ├── working/
    └── config/
```

### Git Integration

Since sidecar content is stored outside the `.bmad` directory (and typically outside version control), users can:

- Add the sidecar folder to `.gitignore` to exclude personal data
- Share agent definitions without exposing personal content
- Maintain separate configurations for different projects

Example `.gitignore` entry:

```
# Exclude agent personal data
.bmad-user-memory/
```

## Creating Custom Content with BMAD Builder

The BMAD Builder provides workflows that will guide you to produce your own custom content:

1. **Agent Templates**: Use standardized agent templates with proper structure
2. **Workflow Templates**: Create workflows using proven patterns
3. **Validation Tools**: Validate your content before distribution
4. **Package Generation**: Generate properly structured packages

### Best Practices

1. **Use Clear Naming**: Make your content codes and names descriptive
2. **Provide Documentation**: Include clear setup and usage instructions
3. **Test Installation**: Test your content in a clean environment
4. **Version Management**: Use semantic versioning for updates
5. **Respect User Privacy**: Keep personal data in sidecar folders

## Distribution

Custom content can be distributed:

1. **File System**: Copy folders directly to users
2. **Git Repositories**: Clone or download from version control
3. **Package Managers**: [Coming soon] npm package support
4. **URL Installation**: [Coming soon] Direct URL installation, including an official community vetted module forge

## Troubleshooting

### No Custom Content Found

- Ensure your `module.yaml` files are properly named
- Check file permissions
- Verify the directory path is correct

### Installation Errors

- Run the installer with verbose logging
- Check for syntax errors in YAML configuration files
- Verify all required files are present

### Sidecar Issues

- Ensure the agent has `hasSidecar: true` in metadata
- Check that sidecar folders contain "sidecar" in the name
- Verify the agent_sidecar_folder configuration
- Ensure the custom agent has proper language in it to actually use the sidecar content, including loading memories on agent load.

## Support

For help with custom content creation or installation:

1. Check the examples in `/example-custom-content` and `/example-custom-module`
2. Review the BMAD documentation
3. Create an issue in the BMAD repository
4. Join the BMAD community discussions on discord
