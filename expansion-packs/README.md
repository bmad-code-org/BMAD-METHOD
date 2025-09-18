# BMad Method Expansion Packs

Expansion packs extend BMad-Method beyond traditional software development, providing specialized agent teams, templates, and workflows for specific domains and industries. Each pack is a self-contained ecosystem designed to bring the power of AI-assisted workflows to any field.

## Available Expansion Packs

### 🏛️ C4 Architecture

**Purpose**: C4 model visualization and Structurizr DSL generation  
**Agents**: C4 Architect (Simon)  
**Focus**: Architecture diagrams, system visualization, stakeholder communication  
**Status**: ✅ Available

### 🎮 Game Development

**Godot Game Dev**: 2D/3D game development with Godot engine
**2D Phaser Game Dev**: Web-based 2D games with Phaser.js
**2D Unity Game Dev**: 2D games with Unity engine
**Status**: ✅ Available

### ✍️ Creative Writing

**Purpose**: Creative writing and content creation  
**Agents**: Writer, Editor, Content Strategist  
**Focus**: Story development, content planning, creative workflows  
**Status**: ✅ Available

### 🔧 Infrastructure & DevOps

**Purpose**: Infrastructure and DevOps workflows  
**Agents**: DevOps Engineer (Alex)  
**Focus**: Cloud infrastructure, CI/CD, platform engineering  
**Status**: ✅ Available

## Installation

### Install Specific Expansion Pack

```bash
# C4 Architecture
cd expansion-packs/bmad-c4-architecture
./install.sh

# Game Development
npm run install:expansion godot-game-dev

# Infrastructure & DevOps
npm run install:expansion infrastructure-devops
```

### Interactive Installation

```bash
npx bmad-method install
```

## Creating Custom Expansion Packs

Expansion packs follow a standard structure:

```
expansion-pack-name/
├── agents/         # Specialized agent definitions
├── agent-teams/    # Team configurations
├── tasks/          # Workflow instructions
├── templates/      # Document templates
├── checklists/     # Quality assurance
├── data/           # Knowledge base
├── workflows/      # Process definitions
├── utils/          # Utilities and tools
├── config.yaml     # Pack configuration
├── README.md       # Documentation
└── install.sh      # Installation script
```

### Key Components

- **Agents**: Specialized personas for the domain
- **Templates**: Domain-specific document templates
- **Tasks**: Workflow instructions and processes
- **Checklists**: Quality assurance and validation
- **Data**: Knowledge base and guidelines
- **Workflows**: Complete process flows
- **Config**: Domain-specific configuration

## Contributing

We welcome contributions to existing expansion packs and new expansion pack ideas! Please see our [Contributing Guide](../CONTRIBUTING.md) for details.

### Ideas for New Expansion Packs

- Mobile App Development (React Native, Flutter)
- Data Science & Analytics
- Machine Learning & AI
- Blockchain & Web3
- IoT & Embedded Systems
- Content Management Systems
- E-commerce Platforms
- Healthcare Applications
- Financial Services
- Education Technology
