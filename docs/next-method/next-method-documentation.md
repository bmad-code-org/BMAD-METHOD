# NEXT-METHOD™ Documentation

**Next Method - Iterative AI-driven development with BMAD-METHOD™**

## 📖 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
4. [Commands Reference](#commands-reference)
5. [Workflow Phases](#workflow-phases)
6. [Usage Examples](#usage-examples)
7. [Configuration](#configuration)
8. [Integration with BMAD-METHOD](#integration-with-bmad-method)
9. [Troubleshooting](#troubleshooting)
10. [API Reference](#api-reference)
11. [Contributing](#contributing)

## 🎯 Overview

NEXT-METHOD is an intelligent wrapper around BMAD-METHOD that provides an iterative, guided development experience. Instead of manually choosing which tasks or commands to run, you simply type `next` repeatedly, and the system intelligently suggests and executes the next appropriate step.

### Key Benefits

- **Reduced Cognitive Load** - No need to remember what to do next
- **Guided Development** - System suggests logical next steps
- **Context Awareness** - Remembers progress and adapts suggestions
- **Faster Workflow** - Less time deciding, more time doing
- **Learning Tool** - Understands development workflow step by step
- **Full BMAD Access** - All existing features preserved

## 🚀 Quick Start

### Installation

```bash
# Global installation
npm install -g next-method

# Or use npx
npx next-method install
```

### First Steps

```bash
# Navigate to your project directory
cd your-project

# Start the iterative development process
next

# Continue with next suggested step
next

# Keep going...
next
```

## 🧠 Core Concepts

### The "Next" Philosophy

NEXT-METHOD transforms development from a manual decision-making process into an intelligent, guided workflow:

**Before (BMAD-METHOD):**
```
User must know what to do next → Manually choose command → Execute → Decide next step → Repeat...
```

**After (NEXT-METHOD):**
```
User types: next → System suggests next step → User confirms → System tracks progress → User types: next → System suggests next logical step → Repeat...
```

### Context Management

NEXT-METHOD maintains persistent context about your project:

- **Project Type**: Greenfield (new) vs Brownfield (existing)
- **Current Phase**: Development phase tracking
- **Action History**: Complete audit trail of all actions
- **Progress State**: What's been completed and what's next

### Intelligent Suggestions

The system provides context-aware recommendations based on:

- Current project phase
- Previous actions taken
- Project type and characteristics
- Development best practices

## 📋 Commands Reference

### Core Commands

#### `next`
Get next suggested action and execute it interactively.

**Options:**
- `--auto, -a`: Automatically execute the most logical next step
- `--suggest, -s`: Show all available options without executing

**Examples:**
```bash
next                        # Interactive mode
next --auto                 # Auto-execute next step
next --suggest              # Show suggestions only
```

#### `next status`
Display current project status and context.

**Output includes:**
- Current development phase
- Project type
- Last action performed
- Recent action history

#### `next reset`
Reset the Next Method context (requires confirmation).

**Use when:**
- Starting a new project
- Clearing development history
- Troubleshooting context issues

### BMAD-METHOD Wrappers

#### `next install`
Install BMAD Method (wraps `bmad install`).

**Options:** All standard BMAD install options supported
```bash
next install --full
next install --expansion-only
next install --ide cursor
```

#### `next update`
Update existing BMAD installation (wraps `bmad update`).

**Options:** All standard BMAD update options supported
```bash
next update --force
next update --dry-run
```

### NPM Scripts

```bash
npm run next          # Run next command locally
npm run next:auto     # Auto-execute next step
npm run next:suggest  # Show suggestions only
```

## 🏗️ Workflow Phases

NEXT-METHOD guides you through these development phases:

### 1. Project Detection
- **Purpose**: Determine if working on greenfield or brownfield project
- **Trigger**: First `next` command
- **Actions**: Analyze directory structure, detect project markers

### 2. Project Creation/Analysis
- **Greenfield**: Start new project structure
- **Brownfield**: Analyze existing codebase and requirements
- **Output**: Project context and initial assessment

### 3. Requirements Generation
- **Purpose**: Create user stories and requirements
- **Prerequisites**: Project analysis complete
- **Tools**: BMAD-METHOD requirements generation

### 4. Architecture Design
- **Purpose**: Design technical architecture
- **Prerequisites**: Requirements defined
- **Output**: Technical specifications and design documents

### 5. Implementation
- **Purpose**: Code and develop features
- **Prerequisites**: Architecture designed
- **Focus**: Feature development and coding

### 6. Testing & Validation
- **Purpose**: Test and validate implementation
- **Prerequisites**: Features implemented
- **Activities**: Unit testing, integration testing, QA

### 7. Deployment
- **Purpose**: Deploy the application
- **Prerequisites**: Testing completed
- **Activities**: Production deployment, monitoring setup

## 💡 Usage Examples

### Basic Iterative Workflow

```bash
# Start the process
next

# Continue with next suggestion
next

# Keep going...
next

# See all options
next --suggest

# Auto-execute next step
next --auto
```

### Project Type Detection

```bash
# Empty directory - will detect as greenfield
mkdir new-project && cd new-project
next

# Existing project - will detect as brownfield
cd existing-project
next
```

### Hands-Free Development

```bash
# Auto-execute multiple steps
next --auto
next --auto
next --auto
```

### Custom BMAD Commands

```bash
# Install specific expansion pack
next install --expansion-packs game-dev

# Configure for specific IDE
next install --ide cursor --ide vscode
```

## ⚙️ Configuration

### Context File

NEXT-METHOD creates a `.next-context.json` file in your project directory:

```json
{
  "currentPhase": "start",
  "projectType": "greenfield",
  "lastAction": "create",
  "suggestions": [],
  "history": [
    {
      "timestamp": "2025-09-02T14:25:08.240Z",
      "action": "detect",
      "result": { "type": "greenfield" },
      "phase": "start"
    }
  ],
  "metadata": {}
}
```

### Environment Variables

- `NEXT_DEBUG`: Enable debug logging
- `NEXT_CONTEXT_FILE`: Custom context file path
- `NEXT_AUTO_CONFIRM`: Auto-confirm all actions

### IDE Integration

NEXT-METHOD integrates with popular IDEs:

- **VS Code**: Command palette integration
- **Cursor**: AI assistant integration
- **JetBrains**: Terminal integration
- **Vim/Emacs**: Command-line integration

## 🔗 Integration with BMAD-METHOD

### Preserved Functionality

NEXT-METHOD maintains 100% compatibility with BMAD-METHOD:

- **All Agents**: Analyst, Architect, PM, Dev, QA, etc.
- **All Teams**: Full-stack, UI-only, service-only teams
- **All Workflows**: Greenfield, brownfield, expansion packs
- **All Commands**: Install, update, build, validate, etc.

### Command Mapping

| NEXT-METHOD | BMAD-METHOD | Purpose |
|-------------|-------------|---------|
| `next install` | `bmad install` | Install BMAD framework |
| `next update` | `bmad update` | Update installation |
| `next` | N/A | Iterative workflow |

### Expansion Packs

All BMAD-METHOD expansion packs work seamlessly:

- **Game Development**: Unity, Phaser, etc.
- **Creative Writing**: Story generation, content creation
- **Infrastructure**: DevOps, cloud deployment
- **Custom Domains**: Your own specialized agents

## 🐛 Troubleshooting

### Common Issues

#### Context File Errors
```bash
# Reset context if corrupted
next reset

# Check context file permissions
ls -la .next-context.json
```

#### Command Not Found
```bash
# Ensure global installation
npm install -g next-method

# Check PATH
which next
```

#### BMAD Integration Issues
```bash
# Verify BMAD installation
next install --dry-run

# Check BMAD version
bmad --version
```

### Debug Mode

Enable debug logging:
```bash
export NEXT_DEBUG=true
next
```

### Getting Help

```bash
# Command help
next --help
next --help

# Status check
next status

# Reset if stuck
next reset
```

## 🔌 API Reference

### NextMethodContext Class

```javascript
class NextMethodContext {
  constructor()
  loadContext()
  saveContext()
  updateContext(updates)
  addToHistory(action, result)
  getNextSuggestions()
}
```

### Context Object Structure

```typescript
interface NextContext {
  currentPhase: string;
  projectType: 'greenfield' | 'brownfield' | null;
  lastAction: string | null;
  suggestions: Suggestion[];
  history: HistoryEntry[];
  metadata: Record<string, any>;
}
```

### Suggestion Object

```typescript
interface Suggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  priority?: number;
}
```

## 🤝 Contributing

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/next-method.git

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

### Adding New Actions

1. **Extend NextMethodContext**: Add new action types
2. **Update Suggestion Logic**: Modify `getNextSuggestions()`
3. **Implement Action**: Create action handler function
4. **Add Tests**: Ensure functionality works correctly

### Contributing Guidelines

- Follow existing code style
- Add comprehensive tests
- Update documentation
- Submit pull requests

## 📚 Additional Resources

### Documentation
- [BMAD-METHOD Core Documentation](docs/)
- [Expansion Packs Guide](expansion-packs/)
- [API Reference](docs/api.md)

### Community
- [Discord Community](https://discord.gg/your-community)
- [GitHub Issues](https://github.com/your-org/next-method/issues)
- [Discussions](https://github.com/your-org/next-method/discussions)

### Examples
- [Sample Projects](examples/)
- [Workflow Templates](templates/)
- [Video Tutorials](https://youtube.com/your-channel)

---

**NEXT-METHOD™** - Making AI-driven development as simple as typing "next" repeatedly! 🚀

*Built with ❤️ for the AI-assisted development community*
