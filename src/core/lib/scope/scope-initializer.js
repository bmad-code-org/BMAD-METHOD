const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');

/**
 * Initializes directory structure for scopes
 * Creates scope directories, shared layer, and event system
 *
 * @class ScopeInitializer
 * @requires fs-extra
 * @requires yaml
 *
 * @example
 * const initializer = new ScopeInitializer({ projectRoot: '/path/to/project' });
 * await initializer.initializeScope('auth');
 */
class ScopeInitializer {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.outputBase = options.outputBase || '_bmad-output';
    this.bmadPath = options.bmadPath || path.join(this.projectRoot, '_bmad');
    this.outputPath = path.join(this.projectRoot, this.outputBase);
    this.sharedPath = path.join(this.outputPath, '_shared');
    this.eventsPath = path.join(this.bmadPath, '_events');
  }

  /**
   * Set the project root directory
   * @param {string} projectRoot - The project root path
   */
  setProjectRoot(projectRoot) {
    this.projectRoot = projectRoot;
    this.bmadPath = path.join(projectRoot, '_bmad');
    this.outputPath = path.join(projectRoot, this.outputBase);
    this.sharedPath = path.join(this.outputPath, '_shared');
    this.eventsPath = path.join(this.bmadPath, '_events');
  }

  /**
   * Initialize the scope system (one-time setup)
   * Creates _shared and _events directories
   * @returns {Promise<boolean>} Success status
   */
  async initializeScopeSystem() {
    try {
      // Create shared knowledge layer
      await this.initializeSharedLayer();

      // Create event system
      await this.initializeEventSystem();

      return true;
    } catch (error) {
      throw new Error(`Failed to initialize scope system: ${error.message}`);
    }
  }

  /**
   * Initialize the shared knowledge layer
   * Creates _shared directory and default files
   * @returns {Promise<boolean>} Success status
   */
  async initializeSharedLayer() {
    try {
      // Create shared directory structure
      await fs.ensureDir(this.sharedPath);
      await fs.ensureDir(path.join(this.sharedPath, 'contracts'));
      await fs.ensureDir(path.join(this.sharedPath, 'principles'));
      await fs.ensureDir(path.join(this.sharedPath, 'architecture'));

      // Create README in shared directory
      const sharedReadmePath = path.join(this.sharedPath, 'README.md');
      if (!(await fs.pathExists(sharedReadmePath))) {
        const readmeContent = this.generateSharedReadme();
        await fs.writeFile(sharedReadmePath, readmeContent, 'utf8');
      }

      // Create global project-context.md template
      const contextPath = path.join(this.sharedPath, 'project-context.md');
      if (!(await fs.pathExists(contextPath))) {
        const contextContent = this.generateGlobalContextTemplate();
        await fs.writeFile(contextPath, contextContent, 'utf8');
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to initialize shared layer: ${error.message}`);
    }
  }

  /**
   * Initialize the event system
   * Creates _events directory and event files
   * @returns {Promise<boolean>} Success status
   */
  async initializeEventSystem() {
    try {
      // Create events directory
      await fs.ensureDir(this.eventsPath);

      // Create event-log.yaml
      const eventLogPath = path.join(this.eventsPath, 'event-log.yaml');
      if (!(await fs.pathExists(eventLogPath))) {
        const eventLog = {
          version: 1,
          events: [],
        };
        await fs.writeFile(eventLogPath, yaml.stringify(eventLog), 'utf8');
      }

      // Create subscriptions.yaml
      const subscriptionsPath = path.join(this.eventsPath, 'subscriptions.yaml');
      if (!(await fs.pathExists(subscriptionsPath))) {
        const subscriptions = {
          version: 1,
          subscriptions: {},
        };
        await fs.writeFile(subscriptionsPath, yaml.stringify(subscriptions), 'utf8');
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to initialize event system: ${error.message}`);
    }
  }

  /**
   * Initialize a new scope directory structure
   * @param {string} scopeId - The scope ID
   * @param {object} options - Scope options
   * @returns {Promise<object>} Created directory paths
   */
  async initializeScope(scopeId, options = {}) {
    try {
      const scopePath = path.join(this.outputPath, scopeId);

      // Check if scope directory already exists
      if ((await fs.pathExists(scopePath)) && !options.force) {
        throw new Error(`Scope directory '${scopeId}' already exists. Use force option to recreate.`);
      }

      // Create scope directory structure
      const paths = {
        root: scopePath,
        planning: path.join(scopePath, 'planning-artifacts'),
        implementation: path.join(scopePath, 'implementation-artifacts'),
        tests: path.join(scopePath, 'tests'),
        meta: path.join(scopePath, '.scope-meta.yaml'),
      };

      // Create directories
      await fs.ensureDir(paths.planning);
      await fs.ensureDir(paths.implementation);
      await fs.ensureDir(paths.tests);

      // Create scope metadata file
      const metadata = {
        scope_id: scopeId,
        created: new Date().toISOString(),
        version: 1,
        structure: {
          planning_artifacts: 'planning-artifacts/',
          implementation_artifacts: 'implementation-artifacts/',
          tests: 'tests/',
        },
      };
      await fs.writeFile(paths.meta, yaml.stringify(metadata), 'utf8');

      // Create README in scope directory
      const readmePath = path.join(scopePath, 'README.md');
      if (!(await fs.pathExists(readmePath))) {
        const readmeContent = this.generateScopeReadme(scopeId, options);
        await fs.writeFile(readmePath, readmeContent, 'utf8');
      }

      // Create optional scope-specific project-context.md
      if (options.createContext) {
        const contextPath = path.join(scopePath, 'project-context.md');
        const contextContent = this.generateScopeContextTemplate(scopeId, options);
        await fs.writeFile(contextPath, contextContent, 'utf8');
      }

      return paths;
    } catch (error) {
      throw new Error(`Failed to initialize scope '${scopeId}': ${error.message}`);
    }
  }

  /**
   * Remove a scope directory
   * @param {string} scopeId - The scope ID
   * @param {object} options - Removal options
   * @returns {Promise<boolean>} Success status
   */
  async removeScope(scopeId, options = {}) {
    try {
      const scopePath = path.join(this.outputPath, scopeId);

      // Check if scope exists
      if (!(await fs.pathExists(scopePath))) {
        throw new Error(`Scope directory '${scopeId}' does not exist`);
      }

      // Create backup if requested
      if (options.backup) {
        const backupPath = path.join(this.outputPath, `_backup_${scopeId}_${Date.now()}`);
        await fs.copy(scopePath, backupPath);
      }

      // Remove directory
      await fs.remove(scopePath);

      return true;
    } catch (error) {
      throw new Error(`Failed to remove scope '${scopeId}': ${error.message}`);
    }
  }

  /**
   * Check if scope system is initialized
   * @returns {Promise<boolean>} True if initialized
   */
  async isSystemInitialized() {
    const sharedExists = await fs.pathExists(this.sharedPath);
    const eventsExists = await fs.pathExists(this.eventsPath);
    return sharedExists && eventsExists;
  }

  /**
   * Check if a scope directory exists
   * @param {string} scopeId - The scope ID
   * @returns {Promise<boolean>} True if exists
   */
  async scopeDirectoryExists(scopeId) {
    const scopePath = path.join(this.outputPath, scopeId);
    return fs.pathExists(scopePath);
  }

  /**
   * Get scope directory paths
   * @param {string} scopeId - The scope ID
   * @returns {object} Scope paths
   */
  getScopePaths(scopeId) {
    const scopePath = path.join(this.outputPath, scopeId);
    return {
      root: scopePath,
      planning: path.join(scopePath, 'planning-artifacts'),
      implementation: path.join(scopePath, 'implementation-artifacts'),
      tests: path.join(scopePath, 'tests'),
      meta: path.join(scopePath, '.scope-meta.yaml'),
      context: path.join(scopePath, 'project-context.md'),
    };
  }

  /**
   * Generate README content for shared directory
   * @returns {string} README content
   */
  generateSharedReadme() {
    return `# Shared Knowledge Layer

This directory contains knowledge and artifacts that are shared across all scopes.

## Directory Structure

- **contracts/** - Integration contracts and APIs between scopes
- **principles/** - Architecture principles and design patterns
- **architecture/** - High-level architecture documents
- **project-context.md** - Global project context (the "bible")

## Purpose

The shared layer enables:
- Cross-scope integration without tight coupling
- Consistent architecture patterns across scopes
- Centralized project context and principles
- Dependency management through contracts

## Usage

1. **Reading**: All scopes can read from \`_shared/\`
2. **Writing**: Use \`bmad scope sync-up <scope>\` to promote artifacts
3. **Syncing**: Use \`bmad scope sync-down <scope>\` to pull updates

## Best Practices

- Keep contracts focused and minimal
- Document all shared artifacts clearly
- Version shared artifacts when making breaking changes
- Use sync commands rather than manual edits
`;
  }

  /**
   * Generate global project-context.md template
   * @returns {string} Context template content
   */
  generateGlobalContextTemplate() {
    return `# Global Project Context

> This is the global "bible" for the project. All scopes extend this context.

## Project Overview

**Name:** [Your Project Name]
**Purpose:** [Core purpose of the project]
**Status:** Active Development

## Architecture Principles

1. **Principle 1:** Description
2. **Principle 2:** Description
3. **Principle 3:** Description

## Technology Stack

- **Language:** [e.g., Node.js, Python]
- **Framework:** [e.g., Express, FastAPI]
- **Database:** [e.g., PostgreSQL, MongoDB]
- **Infrastructure:** [e.g., AWS, Docker]

## Key Decisions

### Decision 1: [Title]
- **Context:** Why this decision was needed
- **Decision:** What was decided
- **Consequences:** Impact and trade-offs

## Integration Patterns

Describe how scopes integrate with each other.

## Shared Resources

List shared resources, databases, APIs, etc.

## Contact & Documentation

- **Team Lead:** [Name]
- **Documentation:** [Link]
- **Repository:** [Link]
`;
  }

  /**
   * Generate README content for scope directory
   * @param {string} scopeId - The scope ID
   * @param {object} options - Scope options
   * @returns {string} README content
   */
  generateScopeReadme(scopeId, options = {}) {
    const scopeName = options.name || scopeId;
    const description = options.description || 'No description provided';

    return `# Scope: ${scopeName}

${description}

## Directory Structure

- **planning-artifacts/** - Planning documents, PRDs, specifications
- **implementation-artifacts/** - Sprint status, development artifacts
- **tests/** - Test files and test results
- **project-context.md** - Scope-specific context (extends global)

## Scope Information

- **ID:** ${scopeId}
- **Name:** ${scopeName}
- **Status:** ${options.status || 'active'}
- **Created:** ${new Date().toISOString().split('T')[0]}

## Dependencies

${options.dependencies && options.dependencies.length > 0 ? options.dependencies.map((dep) => `- ${dep}`).join('\n') : 'No dependencies'}

## Usage

### Working in this scope

\`\`\`bash
# Activate scope context
bmad workflow --scope ${scopeId}

# Check scope info
bmad scope info ${scopeId}
\`\`\`

### Sharing artifacts

\`\`\`bash
# Promote artifacts to shared layer
bmad scope sync-up ${scopeId}

# Pull updates from shared layer
bmad scope sync-down ${scopeId}
\`\`\`

## Related Documentation

- Global context: ../_shared/project-context.md
- Contracts: ../_shared/contracts/
`;
  }

  /**
   * Generate scope-specific project-context.md template
   * @param {string} scopeId - The scope ID
   * @param {object} options - Scope options
   * @returns {string} Context template content
   */
  generateScopeContextTemplate(scopeId, options = {}) {
    const scopeName = options.name || scopeId;

    return `# Scope Context: ${scopeName}

> This context extends the global project context in ../_shared/project-context.md

## Scope Purpose

[Describe the specific purpose and boundaries of this scope]

## Scope-Specific Architecture

[Describe architecture specific to this scope]

## Technology Choices

[List any scope-specific technology choices]

## Integration Points

### Dependencies
${
  options.dependencies && options.dependencies.length > 0
    ? options.dependencies.map((dep) => `- **${dep}**: [Describe dependency relationship]`).join('\n')
    : 'No dependencies'
}

### Provides
[What this scope provides to other scopes]

## Key Files & Artifacts

- [File 1]: Description
- [File 2]: Description

## Development Notes

[Any important notes for developers working in this scope]
`;
  }
}

module.exports = { ScopeInitializer };
