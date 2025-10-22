#!/bin/bash
# BMad Project Setup Script
# Creates a BMad workspace for any project, linked to the central installation

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Central BMad installation
BMAD_HOME="/Users/hbl/Documents/BMAD-METHOD/bmad"

# Check if BMad is installed
if [ ! -d "$BMAD_HOME" ]; then
    echo -e "${YELLOW}Error: Central BMad not found at $BMAD_HOME${NC}"
    echo "Please install BMad first by running: npm run install:bmad"
    exit 1
fi

# Get project path
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: ./setup-project-bmad.sh /path/to/your/project${NC}"
    echo ""
    echo "Example: ./setup-project-bmad.sh /Users/hbl/Documents/my-app"
    exit 1
fi

PROJECT_ROOT="$1"
PROJECT_NAME=$(basename "$PROJECT_ROOT")

# Validate project directory exists
if [ ! -d "$PROJECT_ROOT" ]; then
    echo -e "${YELLOW}Error: Project directory does not exist: $PROJECT_ROOT${NC}"
    exit 1
fi

# Check if .bmad already exists
if [ -d "$PROJECT_ROOT/.bmad" ]; then
    echo -e "${YELLOW}Warning: .bmad workspace already exists in $PROJECT_NAME${NC}"
    read -p "Overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

echo -e "${BLUE}Setting up BMad workspace for: ${GREEN}$PROJECT_NAME${NC}"
echo ""

# Create workspace directories
echo -e "${BLUE}Creating workspace structure...${NC}"
mkdir -p "$PROJECT_ROOT/.bmad"/{analysis,planning,stories,sprints,retrospectives,context}

# Create .bmadrc configuration
echo -e "${BLUE}Creating configuration file...${NC}"
cat > "$PROJECT_ROOT/.bmad/.bmadrc" << EOF
# BMad Project Configuration
# This file links this project to the central BMad installation

# Central BMad installation path
BMAD_HOME="$BMAD_HOME"

# Project information
PROJECT_NAME="$PROJECT_NAME"
PROJECT_ROOT="$PROJECT_ROOT"

# Workspace directories (relative to project root)
WORKSPACE_ROOT=".bmad"
ANALYSIS_DIR="\${WORKSPACE_ROOT}/analysis"
PLANNING_DIR="\${WORKSPACE_ROOT}/planning"
STORIES_DIR="\${WORKSPACE_ROOT}/stories"
SPRINTS_DIR="\${WORKSPACE_ROOT}/sprints"
RETROS_DIR="\${WORKSPACE_ROOT}/retrospectives"
CONTEXT_DIR="\${WORKSPACE_ROOT}/context"

# BMad modules enabled for this project
BMAD_MODULES="core,bmm"

# IDE configuration
BMAD_IDE="claude-code"

# Version
BMAD_VERSION="6.0.0-alpha.0"
EOF

# Create README
echo -e "${BLUE}Creating workspace README...${NC}"
cat > "$PROJECT_ROOT/.bmad/README.md" << EOF
# BMad Workspace - $PROJECT_NAME

This workspace contains all BMad Method artifacts for the $PROJECT_NAME project.

## 📁 Directory Structure

\`\`\`
.bmad/
├── analysis/        # Research, brainstorming, product briefs
├── planning/        # PRDs, architecture docs, epics
├── stories/         # Development stories and technical specs
├── sprints/         # Sprint planning and tracking
├── retrospectives/  # Sprint retrospectives and learnings
├── context/         # Story-specific context and expertise
└── .bmadrc          # Configuration linking to central BMad
\`\`\`

## 🔗 Central BMad Installation

This project uses the centralized BMad installation at:
\`$BMAD_HOME\`

All agents, workflows, and tasks are shared from the central installation.
Only project-specific artifacts are stored in this workspace.

## 🚀 Quick Start

### Activate BMad Agents (Claude Code)

Agents are available as slash commands:

\`\`\`
/bmad:bmm:agents:analyst     - Research & analysis
/bmad:bmm:agents:pm          - Product planning
/bmad:bmm:agents:architect   - Technical architecture
/bmad:bmm:agents:sm          - Story management
/bmad:bmm:agents:dev         - Development
/bmad:bmm:agents:sr          - Code review
\`\`\`

### Common Workflows

\`\`\`
/bmad:bmm:workflows:brainstorm-project  - Project ideation
/bmad:bmm:workflows:plan-project        - Create PRD & architecture
/bmad:bmm:workflows:create-story        - Generate dev stories
/bmad:bmm:workflows:dev-story           - Implement story
/bmad:bmm:workflows:review-story        - Code review
\`\`\`

## 📋 BMad Method Phases

1. **Analysis** (Optional) - Research and ideation
2. **Planning** (Required) - PRD and architecture
3. **Solutioning** (Level 3-4) - Technical specifications
4. **Implementation** (Iterative) - Stories and sprints

## 🔧 Configuration

See \`.bmadrc\` for project-specific settings and central BMad linkage.

---

**Note:** This workspace is isolated to this project. Each project has its own \`.bmad/\` folder to prevent documentation from mixing between projects.
EOF

# Create .gitignore if needed
if [ ! -f "$PROJECT_ROOT/.bmad/.gitignore" ]; then
    echo -e "${BLUE}Creating .gitignore...${NC}"
    cat > "$PROJECT_ROOT/.bmad/.gitignore" << EOF
# Ignore temporary files
*.tmp
*.temp
*.bak

# Keep workspace structure but ignore WIP files if needed
# Uncomment to ignore work-in-progress files:
# **/wip/
EOF
fi

# Success message
echo ""
echo -e "${GREEN}✅ BMad workspace created successfully!${NC}"
echo ""
echo -e "${BLUE}📁 Workspace location:${NC} $PROJECT_ROOT/.bmad"
echo -e "${BLUE}🔗 Linked to BMad:${NC} $BMAD_HOME"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. cd $PROJECT_ROOT"
echo "2. Open Claude Code in this directory"
echo "3. Type / to see available BMad commands"
echo "4. Start with: /bmad:bmm:workflows:plan-project"
echo ""
