# Autominator - n8n Workflow Automation Module

**Arnold the Autominator - I'll be back... with your workflows automated!** 🦾

Standalone module for n8n workflow automation, creation, migration, and optimization. Build, modify, migrate, and optimize n8n workflows with expert guidance and up-to-date documentation.

## Overview

Autominator is an independent BMAD module that specializes in n8n workflow automation. Whether you're building new workflows from scratch, migrating from other platforms, or optimizing existing workflows, Arnold has you covered.

## Agent

**Arnold** - n8n Workflow Automation Specialist

- Expert in n8n workflow creation, modification, and optimization
- Specializes in platform migration (Zapier, Make, HubSpot, Power Automate)
- Uses web search to access up-to-date n8n documentation
- Smart elicitation for accurate requirement gathering
- Comprehensive workflow validation and testing

## Workflows

### 1. Create Workflow

Build new n8n workflows from scratch based on your requirements.

**Triggers:**

- `*create-workflow`

**Features:**

- Smart elicitation to understand your needs
- Workflow type selection (webhook, scheduled, event-driven, manual, database-driven)
- Integration selection and configuration
- Complexity assessment
- Error handling strategy planning
- Web search integration for latest n8n docs
- Automatic JSON validation

### 2. Modify Workflow

Edit or update existing n8n workflows with backup and safety checks.

**Triggers:**

- `*modify-workflow`

**Features:**

- Load existing workflows from file or paste
- Selective modification (add, modify, or remove nodes)
- Connection management
- Automatic backup creation
- Change validation
- Rollback capability

### 3. Migrate Workflow

Migrate automation workflows from other platforms to n8n.

**Supported Platforms:**

- Zapier
- Make (Integromat)
- HubSpot Workflows
- Microsoft Power Automate
- IFTTT
- Custom platforms

**Triggers:**

- `*migrate-workflow`

**Features:**

- Platform-specific mapping
- Trigger and action conversion
- Data transformation planning
- Credential requirement identification
- Migration notes and documentation
- Post-migration testing guidance

### 4. Optimize Workflow

Analyze and improve existing n8n workflows for performance and best practices.

**Triggers:**

- `*optimize-workflow`

**Features:**

- Comprehensive workflow analysis
- Performance optimization recommendations
- Error handling improvements
- Code quality assessment
- Structure optimization
- Best practices validation
- Security review
- Automatic backup before changes
- Selective optimization application

## Quick Start

### Load Arnold Agent

```bash
# In your IDE, load the Autominator agent
agent autominator/autominator

# Or use the agent trigger
*autominator
```

### Create a Workflow

```bash
# Start the create workflow process
*create-workflow

# Follow the interactive prompts to:
# 1. Describe your workflow type
# 2. Select integrations
# 3. Define complexity level
# 4. Configure error handling
# 5. Review and confirm
```

### Migrate from Another Platform

```bash
# Start the migration process
*migrate-workflow

# Provide:
# 1. Source platform (Zapier, Make, HubSpot, etc.)
# 2. Workflow details or export file
# 3. Integration list
# 4. Desired output location
```

### Optimize Existing Workflow

```bash
# Analyze and improve a workflow
*optimize-workflow

# Select optimization focus:
# - Performance
# - Error Handling
# - Code Quality
# - Structure
# - Best Practices
# - Security
# - All
```

## Features

### Web Search Integration

- Automatic web search for n8n documentation
- Accesses official docs.n8n.io resources
- Up-to-date node configurations and best practices
- Problem-specific solution research

### Smart Elicitation

- Contextual analysis of existing information
- Numbered option selection
- Progressive requirement gathering
- Validation before execution

### Comprehensive Validation

- JSON syntax validation
- Schema compliance checking
- Connection integrity verification
- Error recovery (never deletes files)

### Platform Mappings

Built-in mappings for:

- Zapier triggers and actions
- Make modules and routers
- HubSpot workflow actions
- Power Automate flows
- Common automation patterns

### Shared Resources

- **n8n-helpers.md** - Node creation guidelines and patterns
- **n8n-templates.yaml** - 8 reusable workflow templates
- **platform-mappings.yaml** - Platform conversion reference

## Module Structure

```
autominator/
├── _module-installer/
│   └── install-config.yaml
├── agents/
│   └── autominator.agent.yaml
├── workflows/
│   ├── _shared/
│   │   ├── n8n-helpers.md
│   │   ├── n8n-templates.yaml
│   │   └── platform-mappings.yaml
│   ├── create-workflow/
│   │   ├── workflow.yaml
│   │   ├── instructions.md
│   │   └── checklist.md
│   ├── modify-workflow/
│   │   ├── workflow.yaml
│   │   ├── instructions.md
│   │   └── checklist.md
│   ├── migrate-workflow/
│   │   ├── workflow.yaml
│   │   ├── instructions.md
│   │   └── checklist.md
│   └── optimize-workflow/
│       ├── workflow.yaml
│       ├── instructions.md
│       └── checklist.md
└── README.md
```

## Requirements

- n8n instance or account
- IDE with BMAD support

## Installation

Autominator is a standalone module and can be installed independently:

```bash
# Install via BMAD
npx bmad-method@alpha install autominator

# Or manually copy to your BMAD installation
cp -r autominator/ /path/to/bmad/src/modules/
```

## Integration with Other Modules

Autominator is independent but can be used alongside:

- **BMM** - For project lifecycle management
- **CIS** - For creative workflow design
- **BMB** - For module building
- **BMGD** - For game development workflows

## Best Practices

1. **Provide Clear Context** - Describe your workflow purpose and requirements
2. **Use Smart Elicitation** - Let Arnold ask clarifying questions
3. **Test Before Activation** - Always test workflows with sample data
4. **Monitor Initial Runs** - Watch for errors in first executions
5. **Document Changes** - Keep notes on workflow modifications
6. **Backup Regularly** - Use modify-workflow's backup feature
7. **Review Optimizations** - Understand changes before applying

## Troubleshooting

### Workflow JSON Validation Fails

- Check for missing commas or brackets
- Verify all node IDs are unique
- Ensure all connections reference existing nodes
- Use the error location to fix syntax

### Workflow Execution Issues

- Verify all credentials are configured
- Test with sample data first
- Check error handling settings
- Review workflow logs for details

## Related Documentation

- **[n8n Documentation](https://docs.n8n.io/)** - Official n8n docs
- **[BMAD Method](../bmm/README.md)** - Core BMAD framework
- **[CIS Module](../cis/README.md)** - Creative facilitation
- **[BMB Module](../bmb/README.md)** - Module building

## Support

- **Issues** - Report bugs on GitHub
- **Questions** - Check the troubleshooting section
- **Feedback** - Share suggestions for improvements

---

**Ready to automate?** Load Arnold and start with `*create-workflow`!

Part of BMad Method - Transform automation potential through expert AI guidance.
