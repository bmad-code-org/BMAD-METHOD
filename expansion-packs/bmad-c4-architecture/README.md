# BMAD C4 Architecture Expansion Pack

## Overview

The BMAD C4 Architecture Expansion Pack extends BMad-Method with comprehensive C4 model visualization capabilities using Structurizr DSL. This expansion pack provides specialized agents, templates, and workflows for creating, maintaining, and validating architecture diagrams that effectively communicate system design across all stakeholder levels.

## What is C4 Model?

The C4 model is a hierarchical approach to visualizing software architecture through four levels of abstraction:

- **Context (Level 1)**: Shows how the system fits into the world around it
- **Container (Level 2)**: Zooms into the system boundary, showing high-level technical building blocks
- **Component (Level 3)**: Zooms into a container to show the components within it
- **Code (Level 4)**: Zooms into a component to show how it is implemented

## Features

### 🏛️ C4 Architect Agent (Simon)

- **Specialized Expertise**: C4 model methodology and Structurizr DSL
- **Visual Communication**: Creates clear, comprehensive architecture diagrams
- **Stakeholder Focus**: Tailors diagrams to audience needs
- **Quality Assurance**: Ensures consistency and completeness

### 📊 Complete C4 Model Support

- **Context Diagrams**: System in the world view
- **Container Diagrams**: High-level technical building blocks
- **Component Diagrams**: Internal component structure
- **Code Diagrams**: Implementation details (via UML tools)

### 🔧 Structurizr DSL Integration

- **Full DSL Support**: Complete Structurizr DSL syntax
- **Workspace Management**: Create and manage Structurizr workspaces
- **Export Capabilities**: Multiple output formats (PNG, SVG, PDF, DSL)
- **Validation**: Syntax and consistency checking

### 📋 Quality Assurance

- **Comprehensive Checklists**: Quality validation for all C4 levels
- **Best Practices**: Built-in guidelines and anti-patterns
- **Review Workflows**: Architecture review and improvement processes
- **Validation Tools**: Model consistency and completeness checks

## Installation

### Prerequisites

- BMAD-METHOD v4 or later
- Docker (recommended) OR Java 17+ (for Structurizr Lite Spring Boot)
- Node.js and npm

### Install the Expansion Pack

```bash
# Interactive installation (recommended)
npx bmad-method install

# Or install specific expansion pack
npm run install:expansion c4-architecture
```

### Manual Installation

```bash
# Copy expansion pack to your project
cp -r expansion-packs/bmad-c4-architecture .bmad-c4-architecture

# Update your core configuration
cp .bmad-c4-architecture/config.yaml .bmad-core/core-config.yaml
```

## Quick Start

### 1. Activate the C4 Architect Agent

```bash
# In your IDE
@c4-architect

# Or use the agent directly
*help
```

### 2. Create Your First C4 Diagram

```bash
# Create a context diagram
*create-context

# Create a container diagram
*create-container

# Create a component diagram
*create-component
```

### 3. Generate Complete Workspace

```bash
# Generate full Structurizr DSL workspace
*generate-dsl

# Validate your model
*validate-model

# Export diagrams
*export-diagrams
```

## Agent Commands

### Core Commands

- `*help` - Show all available commands
- `*create-context` - Create C4 Context diagram (Level 1)
- `*create-container` - Create C4 Container diagram (Level 2)
- `*create-component` - Create C4 Component diagram (Level 3)
- `*generate-dsl` - Generate complete Structurizr DSL workspace
- `*validate-model` - Validate C4 model consistency and completeness
- `*create-workspace` - Create new Structurizr workspace from scratch
- `*update-diagram` - Update existing diagram with new elements
- `*export-diagrams` - Export diagrams in various formats
- `*review-architecture` - Review and suggest improvements to architecture
- `*exit` - Exit the C4 Architect agent

## Team Configurations

### Architecture Team

```yaml
agents: ['architect', 'c4-architect']
```

Complete architecture team with C4 visualization capabilities.

### Visualization Team

```yaml
agents: ['c4-architect']
```

Focused team for architecture visualization and documentation.

### Full Development Team

```yaml
agents: ['analyst', 'pm', 'architect', 'c4-architect', 'dev', 'qa']
```

Complete development team including C4 model visualization.

## Workflows

### C4 Visualization Workflow

Complete workflow for creating C4 model diagrams:

1. **Planning**: Create workspace and gather information
2. **Creation**: Build context, container, and component diagrams
3. **Validation**: Validate diagrams and ensure quality
4. **Export**: Export diagrams and create documentation

### Architecture Review Workflow

Workflow for reviewing and improving existing architecture:

1. **Analysis**: Review existing architecture and identify issues
2. **Improvement**: Update diagrams based on findings
3. **Documentation**: Document changes and export updated diagrams

## Templates

### C4 Context Template

Interactive template for creating context diagrams with:

- System overview and business context
- User identification and goals
- External system mapping
- Relationship definition

### C4 Container Template

Template for container diagrams including:

- Container identification and technologies
- Communication patterns
- Security boundaries
- Data flow mapping

### C4 Component Template

Template for component diagrams with:

- Component identification and responsibilities
- Interface definitions
- Data flow patterns
- Technology specifications

### Structurizr Workspace Template

Complete workspace template for all C4 model levels with:

- Workspace configuration
- Multi-level diagram support
- Styling and theming options
- Export configuration

## Data and Guidelines

### C4 Model Guidelines

Comprehensive guidelines covering:

- C4 model principles and best practices
- Naming conventions and consistency
- Common anti-patterns to avoid
- Quality standards and validation

### Technical Preferences

Integration with BMAD-METHOD technical preferences system for:

- Consistent technology choices
- Styling preferences
- Export format preferences
- Validation criteria

## Checklists

### C4 Model Quality Checklist

Comprehensive quality assurance checklist covering:

- **Context Diagram**: Completeness, relationships, clarity
- **Container Diagram**: Technology choices, architecture, scalability
- **Component Diagram**: Design principles, interfaces, dependencies
- **DSL Quality**: Syntax, structure, best practices
- **Visual Quality**: Layout, styling, clarity
- **Documentation**: Completeness, consistency, accuracy

## Integration with Core BMad

### Planning Phase

- Create context diagrams to understand system scope
- Use diagrams for stakeholder communication
- Validate requirements against architecture

### Architecture Phase

- Create container diagrams for technical design
- Use component diagrams for detailed design
- Validate design decisions

### Development Phase

- Keep diagrams updated with implementation
- Use diagrams for developer onboarding
- Document architectural decisions

### Review Phase

- Regular diagram updates
- Version control diagram changes
- Use diagrams for impact analysis

## External Dependencies

### Required Tools

- **Structurizr Lite**: For diagram visualization and editing
- **Docker** (recommended) OR **Java 17+**: Required runtime for Structurizr Lite

### Optional Services

- **Structurizr Cloud**: For cloud-based diagram management
- **Version Control**: For diagram versioning and collaboration

## Configuration

### Structurizr Lite Setup

#### Option 1: Docker (Recommended)

```bash
# Pull the Docker image
docker pull structurizr/lite

# Create a data directory
mkdir -p ~/structurizr

# Run Structurizr Lite
docker run -it --rm -p 8080:8080 -v ~/structurizr:/usr/local/structurizr structurizr/lite

# Access at http://localhost:8080
```

#### Option 2: Spring Boot

```bash
# Download the WAR file
wget https://github.com/structurizr/lite/releases/latest/download/structurizr-lite.war

# Create a data directory
mkdir -p ~/structurizr

# Run Structurizr Lite (requires Java 17+)
java -jar structurizr-lite.war ~/structurizr

# Access at http://localhost:8080
```

### Expansion Pack Configuration

```yaml
# .bmad-c4-architecture/config.yaml
structurizr_lite_url: 'http://localhost:8080'
default_theme: 'default'
export_formats: ['png', 'svg', 'pdf', 'dsl']
auto_layout: true
validation_strict: true
```

## Usage Examples

### Example 1: Create Context Diagram

```bash
@c4-architect
*create-context

# Follow the interactive prompts:
# 1. System name: "E-commerce Platform"
# 2. Primary users: "Customers, Administrators, Support Staff"
# 3. External systems: "Payment Gateway, Email Service, Inventory System"
# 4. User interactions: "Customers browse products, place orders"
```

### Example 2: Generate Complete Workspace

```bash
@c4-architect
*generate-dsl

# Creates complete Structurizr DSL workspace with:
# - All C4 model levels
# - Proper relationships
# - Consistent styling
# - Export-ready format
```

### Example 3: Review and Update Architecture

```bash
@c4-architect
*review-architecture

# Reviews existing diagrams and provides:
# - Issue identification
# - Improvement suggestions
# - Quality assessment
# - Update recommendations
```

## Best Practices

### 1. Start Simple

- Begin with context diagrams
- Add detail gradually
- Focus on key relationships first

### 2. Maintain Consistency

- Use consistent naming conventions
- Apply consistent styling
- Follow established patterns

### 3. Regular Updates

- Keep diagrams current with system changes
- Review and update regularly
- Version control diagram changes

### 4. Stakeholder Communication

- Tailor diagrams to audience
- Use appropriate abstraction levels
- Include relevant context

### 5. Tool Integration

- Use Structurizr Lite for visualization
- Integrate with documentation systems
- Export to various formats as needed

## Troubleshooting

### Common Issues

#### Structurizr Lite Not Running

```bash
# Check if Structurizr Lite is running
curl http://localhost:8080

# Start Structurizr Lite (Docker)
docker run -it --rm -p 8080:8080 -v ~/structurizr:/usr/local/structurizr structurizr/lite

# Or start Structurizr Lite (Spring Boot)
java -jar structurizr-lite.war ~/structurizr
```

#### DSL Syntax Errors

```bash
# Validate DSL syntax
*validate-model

# Check for common issues:
# - Missing element definitions
# - Invalid relationships
# - Incorrect view configurations
```

#### Export Issues

```bash
# Check export configuration
*export-diagrams

# Verify output directory permissions
# Check available disk space
# Ensure Structurizr Lite is accessible
```

## Support and Community

- **Discord Community**: [Join Discord](https://discord.gg/gk8jAdXWmj)
- **GitHub Issues**: [Report bugs](https://github.com/bmadcode/bmad-method/issues)
- **Documentation**: [Browse docs](https://github.com/bmadcode/bmad-method/docs)
- **YouTube**: [BMadCode Channel](https://www.youtube.com/@BMadCode)

## Contributing

We welcome contributions to the C4 Architecture Expansion Pack! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Areas for Contribution

- Additional C4 model templates
- New export formats
- Enhanced validation rules
- Integration with other tools
- Documentation improvements

## License

This expansion pack is part of the BMAD-METHOD project and follows the same license terms.

## Version History

### v1.0.0

- Initial release
- Complete C4 model support
- Structurizr DSL integration
- Quality assurance tools
- Export capabilities

---

**Remember**: The C4 Architecture Expansion Pack is designed to enhance your architecture visualization capabilities, not replace your architectural expertise. Use it as a powerful tool to create clear, professional architecture diagrams that effectively communicate your system design.
