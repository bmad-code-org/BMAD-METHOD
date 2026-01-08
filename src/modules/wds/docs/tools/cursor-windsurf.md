# Cursor/Windsurf IDE

**Category:** Development Environment  
**Purpose:** AI-powered IDE for WDS agent workflows  
**Website:** <https://cursor.sh> / <https://codeium.com/windsurf>

---

## What It Is

Cursor and Windsurf are AI-powered IDEs built on VS Code that enable natural language interaction with WDS agents (Freya, Saga, Idunn). They provide the environment where agents can read, write, and modify code while maintaining full context of your project.

---

## Why WDS Recommends It

**AI Agent Integration:**
- Native support for AI agents like Freya, Saga, Idunn
- Agents can read/write files, run commands, analyze code
- Context-aware suggestions and automation

**WDS Workflow Support:**
- File structure navigation for WDS projects
- Terminal integration for workflow commands
- Multi-file editing for specifications and prototypes
- Git integration for version control

**Developer Experience:**
- VS Code compatibility (extensions, themes, settings)
- Fast performance
- Intelligent code completion
- Built-in terminal

---

## Setup Instructions

### 1. Installation

**Cursor:**
```bash
# Download from https://cursor.sh
# Install for your OS (Windows, macOS, Linux)
```

**Windsurf:**
```bash
# Download from https://codeium.com/windsurf
# Install for your OS (Windows, macOS, Linux)
```

### 2. Initial Configuration

Open Settings (Ctrl+, or Cmd+,):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.autoSave": "onFocusChange",
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.defaultProfile.osx": "zsh"
}
```

### 3. Recommended Extensions

Install these extensions for WDS workflows:

- **Prettier** - Code formatting
- **ESLint** - JavaScript linting
- **Markdown All in One** - Markdown editing
- **YAML** - YAML file support
- **Live Server** - Preview HTML prototypes
- **GitLens** - Enhanced Git integration

### 4. WDS-Specific Setup

Create workspace settings for WDS projects:

`.vscode/settings.json`:
```json
{
  "files.associations": {
    "*.agent.yaml": "yaml",
    "*.workflow.yaml": "yaml"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  },
  "files.watcherExclude": {
    "**/node_modules/**": true
  }
}
```

---

## WDS Best Practices

### DO ✅

**1. Use Agent Chat Effectively**
- Be specific with requests to Freya, Saga, or Idunn
- Reference files using @ mentions
- Provide context about what you're trying to achieve

**2. Organize Workspace**
- Open WDS project at root level
- Use workspace folders for multi-repo projects
- Keep terminal open for workflow commands

**3. Leverage AI Features**
- Use Ctrl+K for inline AI edits
- Use chat for complex refactoring
- Let agents handle repetitive tasks

**4. File Navigation**
- Use Ctrl+P for quick file open
- Use breadcrumbs for navigation
- Bookmark frequently used files

### DON'T ❌

**1. Don't Fight the AI**
- If agent suggests changes, review before rejecting
- Provide feedback to improve suggestions
- Trust agents for WDS-specific patterns

**2. Don't Skip Git Integration**
- Commit frequently
- Use descriptive commit messages
- Review changes before committing

**3. Don't Ignore Workspace Settings**
- Configure for your project structure
- Use consistent formatting
- Set up proper file associations

---

## Keyboard Shortcuts

**Essential for WDS:**

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Command Palette | Ctrl+Shift+P | Cmd+Shift+P |
| Quick Open | Ctrl+P | Cmd+P |
| AI Chat | Ctrl+L | Cmd+L |
| Inline AI Edit | Ctrl+K | Cmd+K |
| Terminal | Ctrl+` | Cmd+` |
| Find in Files | Ctrl+Shift+F | Cmd+Shift+F |
| Git Panel | Ctrl+Shift+G | Cmd+Shift+G |

---

## Troubleshooting

### Issue: Agent can't read files

**Solution:**
- Ensure files are in workspace
- Check file permissions
- Reload window (Ctrl+Shift+P → "Reload Window")

### Issue: Slow performance

**Solution:**
- Exclude large folders from search
- Disable unused extensions
- Increase memory limit in settings

---

## Resources

**Cursor:**
- Website: <https://cursor.sh>
- Documentation: Check website

**Windsurf:**
- Website: <https://codeium.com/windsurf>
- Documentation: Check website

---

[← Back to Tools](wds-tools-guide.md)
