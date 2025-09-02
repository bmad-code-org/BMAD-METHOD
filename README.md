# NEXT-METHOD™

**Next Method - Iterative AI-driven development with BMAD-METHOD™**

NEXT-METHOD is an intelligent wrapper around BMAD-METHOD that provides an iterative, guided development experience. Instead of manually choosing which tasks or commands to run, you simply type `next` repeatedly, and the system intelligently suggests and executes the next appropriate step.

## 🚀 Quick Start

```bash
# Install NEXT-METHOD
npm install -g next-method

# Or use npx
npx next-method install

# Start the iterative development process
next
```

## ✨ How It Works

NEXT-METHOD maintains context about your project and automatically suggests the next logical step:

1. **Project Detection** - Automatically detects if you're working on a greenfield or brownfield project
2. **Intelligent Suggestions** - Based on your current phase, suggests the next action
3. **Context Awareness** - Remembers what you've done and what comes next
4. **Iterative Flow** - Just keep typing `next` to progress through your project

## 🔄 The "Next" Workflow

```bash
# First time - detect project type
next

# Continue with next suggested step
next

# Keep going...
next

# See all available options
next --suggest

# Auto-execute the most logical next step
next --auto
```

## 📋 Available Commands

### Core Commands
- `next` - Get next suggested action and execute it
- `next --auto` - Automatically execute the most logical next step
- `next --suggest` - Show all available next steps without executing
- `next status` - Show current project status and context
- `next reset` - Reset the Next Method context

### BMAD-METHOD Wrappers
- `next install` - Install BMAD Method (wraps bmad install)
- `next update` - Update existing BMAD installation (wraps bmad update)

### NPM Scripts
- `npm run next` - Run the next command locally
- `npm run next:auto` - Auto-execute next step
- `npm run next:suggest` - Show suggestions only

## 🏗️ Project Phases

NEXT-METHOD guides you through these development phases:

1. **Project Detection** - Determine if greenfield or brownfield
2. **Project Creation/Analysis** - Start new project or analyze existing
3. **Requirements Generation** - Create user stories and requirements
4. **Architecture Design** - Design technical architecture
5. **Implementation** - Code and develop features
6. **Testing & Validation** - Test and validate implementation
7. **Deployment** - Deploy the application

## 🎯 Use Cases

### Greenfield Development
- Start with `next` to detect empty directory
- Follow suggestions to create new project structure
- Progress through requirements, architecture, and implementation

### Brownfield Development
- Start with `next` to analyze existing codebase
- Get suggestions for improving or extending current project
- Follow iterative improvement workflow

### Learning & Exploration
- Use `next --suggest` to see all available options
- Understand the development workflow step by step
- Learn BMAD-METHOD concepts through guided execution

## 🔧 Configuration

NEXT-METHOD creates a `.next-context.json` file in your project directory to maintain context:

```json
{
  "currentPhase": "start",
  "projectType": "greenfield",
  "lastAction": "create",
  "suggestions": [],
  "history": [],
  "metadata": {}
}
```

## 🌟 Features

- **Context Persistence** - Remembers your progress across sessions
- **Intelligent Suggestions** - Context-aware next step recommendations
- **BMAD-METHOD Integration** - Full access to all BMAD features
- **Interactive Interface** - Beautiful CLI with emojis and colors
- **Auto-execution** - Option to automatically run suggested steps
- **History Tracking** - Complete audit trail of all actions taken

## 🚀 Getting Started

1. **Install NEXT-METHOD:**
   ```bash
   npm install -g next-method
   ```

2. **Navigate to your project directory:**
   ```bash
   cd your-project
   ```

3. **Start the iterative process:**
   ```bash
   next
   ```

4. **Keep going:**
   ```bash
   next
   next
   next
   ```

## 🔗 Integration with BMAD-METHOD

NEXT-METHOD is built on top of BMAD-METHOD and provides:
- All BMAD-METHOD features and capabilities
- Intelligent workflow orchestration
- Context-aware development guidance
- Simplified user experience

## 📚 Documentation

- **[NEXT-METHOD Documentation](docs/next-method/)** - Complete guide and reference
- [BMAD-METHOD Core Documentation](docs/)
- [Expansion Packs](expansion-packs/)
- [Contributing Guidelines](CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**NEXT-METHOD™** - Making AI-driven development as simple as typing "next" repeatedly! 🚀
