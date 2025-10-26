# AI Subagents Manual

Ready-to-use AI subagents for Claude Code and OpenCode environments. This collection provides production-tested agent definitions optimized for immediate deployment.

## 🚀 Quick Start

### Claude Code Users:
```bash
#clone repo
clone git https://github.com/amrhas82/agentic-toolkit
cp -rv claude-subagents/* ~/.claude/
# Use: @agent_name command in Claude Code CLI
```

### OpenCode Users:
```bash
#clone repo
clone git https://github.com/amrhas82/agentic-toolkit
cp -rv opencode-subagents/* ~/.config/opencode/
# Use: @agent_name in Opencode CLI or "As ux-expert, ..." natural language activation
```

## 🎯 Available Agents


| Title | ID | When To Use |
|---|---|---|
| 1-Create PRD | 1-create-prd | 1. Define Scope: use to clearly outlining what needs to be built with a Product Requirement Document (PRD) |
| 2-Generate Tasks | 2-generate-tasks | 2. Detailed Planning: use to break down the PRD into a granular, actionable task list |
| 3-Process Task List | 3-process-task-list | 3. Iterative Implementation: use to guide the AI to tackle one task at a time, allowing you to review and approve each change |
| UX Expert | ux-expert | Use for UI/UX design, wireframes, prototypes, front-end specifications, and user experience optimization |
| Scrum Master | scrum-master | Use for story creation, epic management, retrospectives in party-mode, and agile process guidance |
| Test Architect & Quality Advisor | qa-test-architect | Use for comprehensive test architecture review, quality gate decisions, and code improvement. Provides thorough analysis including requirements traceability, risk assessment, and test strategy. Advisory only - teams choose their quality bar. |
| Product Owner | product-owner | Use for backlog management, story refinement, acceptance criteria, sprint planning, and prioritization decisions |
| Product Manager | product-manager | Use for creating PRDs, product strategy, feature prioritization, roadmap planning, and stakeholder communication |
| Full Stack Developer | full-stack-dev | Use for code implementation, debugging, refactoring, and development best practices |
| Master Orchestrator | orchestrator | Use for workflow coordination, multi-agent tasks, role switching guidance, and when unsure which specialist to consult |
| Master Task Executor | master | Use when you need comprehensive expertise across all domains, running 1 off tasks that do not require a persona, or just wanting to use the same agent for many things. |
| Architect | holistic-architect | Use for system design, architecture documents, technology selection, API design, and infrastructure planning |
| Business Analyst | business-analyst | Use for market research, brainstorming, competitive analysis, creating project briefs, initial project discovery, and documenting existing projects (brownfield) |



## 📁 What's Included

- **claude-subagents/**: BMAD+Simple hybrid optimized for Claude Code
- **opencode-subagents/**: Same agents optimized for OpenCode
- **Complete ecosystem**: Agents, teams, workflows, tasks, templates, and dependencies

## 🔗 More Tools at [Agentic Toolkit](https://github.com/amrhas82/agentic-toolkit)

### 🛠️ Development Tools
- **Automated Scripts**: Tmux, Neovim, Lite XL installation with interactive menu
- **Configuration Files**: Complete development environment setups
- **AI Utilities**: Automation scripts and development tools

### 🖥️ Environment Setup
- **System Setup**: Backup & recovery, partition management, system configuration
- **Development Environments**: Window managers (BSPWM, DWM, Openbox), productivity tools (ButterBash, ButterNotes), editor setups (Neovim)
- **Shell Environments**: Customized terminal configurations

### 🔌 Integrations
- **MCP Servers**: 200+ Model Context Protocol servers for enhanced AI capabilities
- **External Tools**: API connections, service integrations, extension packs
- **AI Development**: Specialized workflow integrations

### 🤖 Additional AI Workflows
- **Simple Workflow**: 3-step process (PRD → Tasks → Process)
- **BMAD Method**: Complete framework with ready agents for Claude and OpenCode
- **Task Master**: AI-powered task management with MCP integration for Cursor, VS Code, Windsurf

### 📚 Documentation & Guides
- **Comprehensive Guides**: Installation instructions, environment configuration
- **Workflow Examples**: Step-by-step usage patterns
- **Architecture Documentation**: System design and framework guides

## 📄 License

MIT License - see [LICENSE](../LICENSE) file.