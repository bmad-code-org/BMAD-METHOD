# BMD - BMAD Development Module

**Version:** 1.0.0-alpha.0
**Purpose:** Specialized agents and tools for maintaining and developing the BMAD framework itself

## Overview

The BMD module is fundamentally different from other BMAD modules:

- **BMM (BMad Method)** - Helps users build software projects using BMAD
- **BMB (BMad Builder)** - Helps users create agents/workflows/modules for their projects
- **CIS (Creative Intelligence Suite)** - Provides creative tools for any domain
- **BMD (BMAD Development)** - Helps maintainers build and maintain BMAD itself

## Who Is This For?

- BMAD core contributors
- Framework maintainers
- Advanced users who want to enhance BMAD
- Anyone working on the BMAD-METHOD repository

## Agents

### The Core Trinity

BMD launches with three essential maintainer agents, forming the foundation of the BMAD development team:

---

### Scott - Chief CLI Tooling Officer 🔧

**Type:** Expert Agent with sidecar resources

**Domain:** Complete mastery of `tools/cli/` infrastructure

**Capabilities:**

- Diagnose CLI installation and runtime issues
- Configure IDE integrations (Codex, Cursor, etc.)
- Build and update module installers
- Configure installation question flows
- Enhance CLI functionality
- Maintain CLI documentation
- Share installer and bundler patterns
- Track known issues and solutions

**Personality:** Star Trek Chief Engineer - systematic, urgent, and capable

**Usage:**

```bash
/bmad:bmd:agents:cli-chief
```

---

### Commander - Chief Release Officer 🚀

**Type:** Expert Agent with sidecar resources

**Domain:** Release management, versioning, changelogs, deployments

**Capabilities:**

- Prepare releases with complete checklists
- Generate changelogs from git history
- Manage semantic versioning
- Create and push git release tags
- Validate release readiness
- Publish to NPM registry
- Create GitHub releases
- Coordinate hotfix releases
- Manage rollbacks if needed
- Track release history and patterns

**Personality:** Space Mission Control - calm, precise, checklist-driven

**Usage:**

```bash
/bmad:bmd:agents:release-chief
```

---

### Atlas - Chief Documentation Keeper 📚

**Type:** Expert Agent with sidecar resources

**Domain:** All documentation files, guides, examples, README accuracy

**Capabilities:**

- Audit documentation for accuracy
- Validate links and cross-references
- Verify and update code examples
- Synchronize docs with code changes
- Update README files across project
- Generate API documentation
- Check documentation style and consistency
- Identify documentation gaps
- Track documentation health metrics
- Maintain CHANGELOG accuracy

**Personality:** Nature Documentarian - observational, precise, finding wonder in organization

**Usage:**

```bash
/bmad:bmd:agents:doc-keeper
```

---

### Future Agents

The BMD module will continue to expand with:

- **Bundler Expert** - Web bundle compilation and validation specialist
- **Architecture Guardian** - Code pattern enforcement and structural integrity
- **Testing Coordinator** - Test coverage, CI/CD management, quality gates
- **Workflow Auditor** - Audits BMAD's own internal workflows
- **Issue Triager** - GitHub issue classification and management
- **Migration Assistant** - Version upgrade assistance and breaking change handling
- **Code Quality Enforcer** - ESLint/Prettier enforcement and technical debt tracking
- **Dependency Manager** - NPM package management and security scanning

## Installation

Since BMD is part of the BMAD-METHOD source, install it like any other module:

```bash
npm run install:bmad -- --target . --modules bmd --ides codex --non-interactive
```

Or for contributors working directly in BMAD-METHOD:

```bash
npm run install:bmad -- --target /path/to/BMAD-METHOD --modules bmd --ides codex
```

## Module Structure

```
src/modules/bmd/
├── agents/
│   ├── cli-chief.agent.yaml           # Scott - CLI expert
│   ├── cli-chief-sidecar/             # Scott's workspace
│   │   ├── memories.md
│   │   ├── instructions.md
│   │   └── knowledge/
│   ├── release-chief.agent.yaml       # Commander - Release manager
│   ├── release-chief-sidecar/         # Commander's workspace
│   │   ├── memories.md
│   │   ├── instructions.md
│   │   └── knowledge/
│   ├── doc-keeper.agent.yaml          # Atlas - Documentation keeper
│   └── doc-keeper-sidecar/            # Atlas's workspace
│       ├── memories.md
│       ├── instructions.md
│       └── knowledge/
├── workflows/                         # Future: release prep, validation
├── config.yaml                        # Module configuration
└── README.md                          # This file
```

## Development Philosophy

BMD agents are **maintainers**, not just helpers. They:

- Build institutional knowledge over time
- Remember past issues and solutions
- Evolve with the framework
- Become true partners in development
- Focus on specific domains (CLI, bundler, releases, etc.)

## Contributing

When adding new BMD agents:

1. Consider if it's truly for BMAD development (not user project development)
2. Use Expert agent type for domain-specific maintainers
3. Include comprehensive sidecar resources
4. Document the domain boundaries clearly
5. Build knowledge accumulation into the agent

## Vision

BMD agents will become the "senior engineering team" for BMAD itself - each with deep expertise in their domain, able to guide contributors, maintain quality, and evolve the framework intelligently.

## License

Same as BMAD-METHOD repository
