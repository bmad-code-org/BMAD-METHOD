const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');

/**
 * Manages session-sticky scope context
 * Tracks the current active scope for workflows and agents
 *
 * @class ScopeContext
 * @requires fs-extra
 * @requires yaml
 *
 * @example
 * const context = new ScopeContext({ projectRoot: '/path/to/project' });
 * await context.setScope('auth');
 * const current = await context.getCurrentScope();
 */
class ScopeContext {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.contextFileName = options.contextFileName || '.bmad-scope';
    this.contextFilePath = path.join(this.projectRoot, this.contextFileName);
    this.outputBase = options.outputBase || '_bmad-output';
    this.sharedPath = path.join(this.projectRoot, this.outputBase, '_shared');
  }

  /**
   * Set the project root directory
   * @param {string} projectRoot - The project root path
   */
  setProjectRoot(projectRoot) {
    this.projectRoot = projectRoot;
    this.contextFilePath = path.join(projectRoot, this.contextFileName);
    this.sharedPath = path.join(projectRoot, this.outputBase, '_shared');
  }

  /**
   * Get the current active scope
   * @returns {Promise<string|null>} Current scope ID or null
   */
  async getCurrentScope() {
    try {
      if (!(await fs.pathExists(this.contextFilePath))) {
        return null;
      }

      const content = await fs.readFile(this.contextFilePath, 'utf8');
      const context = yaml.parse(content);

      return context?.active_scope || null;
    } catch {
      return null;
    }
  }

  /**
   * Set the current active scope
   * @param {string} scopeId - The scope ID to set as active
   * @returns {Promise<boolean>} Success status
   */
  async setScope(scopeId) {
    try {
      const context = {
        active_scope: scopeId,
        set_at: new Date().toISOString(),
        set_by: process.env.USER || 'unknown',
      };

      await fs.writeFile(this.contextFilePath, yaml.stringify(context), 'utf8');
      return true;
    } catch (error) {
      throw new Error(`Failed to set scope context: ${error.message}`);
    }
  }

  /**
   * Clear the current scope context
   * @returns {Promise<boolean>} Success status
   */
  async clearScope() {
    try {
      if (await fs.pathExists(this.contextFilePath)) {
        await fs.remove(this.contextFilePath);
      }
      return true;
    } catch (error) {
      throw new Error(`Failed to clear scope context: ${error.message}`);
    }
  }

  /**
   * Get the full context object
   * @returns {Promise<object|null>} Context object or null
   */
  async getContext() {
    try {
      if (!(await fs.pathExists(this.contextFilePath))) {
        return null;
      }

      const content = await fs.readFile(this.contextFilePath, 'utf8');
      return yaml.parse(content);
    } catch {
      return null;
    }
  }

  /**
   * Check if a scope context is set
   * @returns {Promise<boolean>} True if scope is set
   */
  async hasScope() {
    const scope = await this.getCurrentScope();
    return scope !== null;
  }

  /**
   * Load and merge project context files
   * Loads global context and optionally scope-specific context
   * @param {string} scopeId - The scope ID (optional, uses current if not provided)
   * @returns {Promise<object>} Merged context object
   */
  async loadProjectContext(scopeId = null) {
    const scope = scopeId || (await this.getCurrentScope());
    const context = {
      global: null,
      scope: null,
      merged: '',
    };

    try {
      // Load global project context
      const globalContextPath = path.join(this.sharedPath, 'project-context.md');
      if (await fs.pathExists(globalContextPath)) {
        context.global = await fs.readFile(globalContextPath, 'utf8');
      }

      // Load scope-specific context if scope is set
      if (scope) {
        const scopeContextPath = path.join(this.projectRoot, this.outputBase, scope, 'project-context.md');
        if (await fs.pathExists(scopeContextPath)) {
          context.scope = await fs.readFile(scopeContextPath, 'utf8');
        }
      }

      // Merge contexts (scope extends global)
      if (context.global && context.scope) {
        context.merged = `${context.global}\n\n---\n\n## Scope-Specific Context\n\n${context.scope}`;
      } else if (context.global) {
        context.merged = context.global;
      } else if (context.scope) {
        context.merged = context.scope;
      }
    } catch (error) {
      throw new Error(`Failed to load project context: ${error.message}`);
    }

    return context;
  }

  /**
   * Resolve scope from various sources
   * Priority: explicit > session > environment > prompt
   * @param {string} explicitScope - Explicitly provided scope (highest priority)
   * @param {boolean} promptIfMissing - Whether to throw if no scope found
   * @param {object} options - Additional options
   * @param {boolean} options.silent - Suppress warning when no scope found
   * @returns {Promise<string|null>} Resolved scope ID
   */
  async resolveScope(explicitScope = null, promptIfMissing = false, options = {}) {
    // 1. Explicit scope (from --scope flag or parameter)
    if (explicitScope) {
      return explicitScope;
    }

    // 2. Session context (.bmad-scope file)
    const sessionScope = await this.getCurrentScope();
    if (sessionScope) {
      return sessionScope;
    }

    // 3. Environment variable
    const envScope = process.env.BMAD_SCOPE;
    if (envScope) {
      return envScope;
    }

    // 4. No scope found
    if (promptIfMissing) {
      throw new Error('No scope set. Use --scope flag or run: npx bmad-fh scope set <id>');
    }

    // Warn user about missing scope (unless silent mode)
    if (!options.silent) {
      console.warn(
        '\u001B[33mNo scope set. Artifacts will go to root _bmad-output/ directory.\u001B[0m\n' +
          '   To use scoped artifacts, run: npx bmad-fh scope set <scope-id>\n' +
          '   Or set BMAD_SCOPE environment variable.\n',
      );
    }

    return null;
  }

  /**
   * Get scope-specific variable substitutions
   * Returns variables that can be used in workflow templates
   * @param {string} scopeId - The scope ID
   * @returns {Promise<object>} Variables object
   */
  async getScopeVariables(scopeId) {
    const scope = scopeId || (await this.getCurrentScope());

    if (!scope) {
      return {
        scope: '',
        scope_path: '',
        scope_planning: '',
        scope_implementation: '',
        scope_tests: '',
      };
    }

    const basePath = path.join(this.outputBase, scope);

    return {
      scope: scope,
      scope_path: basePath,
      scope_planning: path.join(basePath, 'planning-artifacts'),
      scope_implementation: path.join(basePath, 'implementation-artifacts'),
      scope_tests: path.join(basePath, 'tests'),
    };
  }

  /**
   * Create context initialization snippet for agents/workflows
   * This returns text that can be injected into agent prompts
   * @param {string} scopeId - The scope ID
   * @returns {Promise<string>} Context snippet
   */
  async createContextSnippet(scopeId) {
    const scope = scopeId || (await this.getCurrentScope());

    if (!scope) {
      return '<!-- No scope context active -->';
    }

    const vars = await this.getScopeVariables(scope);
    const context = await this.loadProjectContext(scope);

    return `
<!-- SCOPE CONTEXT START -->
## Active Scope: ${scope}

### Scope Paths
- Planning: \`${vars.scope_planning}\`
- Implementation: \`${vars.scope_implementation}\`
- Tests: \`${vars.scope_tests}\`

### Project Context
${context.merged || 'No project context loaded.'}
<!-- SCOPE CONTEXT END -->
`;
  }

  /**
   * Export context for use in shell/scripts
   * @param {string} scopeId - The scope ID
   * @returns {Promise<string>} Shell export statements
   */
  async exportForShell(scopeId) {
    const scope = scopeId || (await this.getCurrentScope());

    if (!scope) {
      return '# No scope set';
    }

    const vars = await this.getScopeVariables(scope);

    return `
export BMAD_SCOPE="${vars.scope}"
export BMAD_SCOPE_PATH="${vars.scope_path}"
export BMAD_SCOPE_PLANNING="${vars.scope_planning}"
export BMAD_SCOPE_IMPLEMENTATION="${vars.scope_implementation}"
export BMAD_SCOPE_TESTS="${vars.scope_tests}"
`.trim();
  }

  /**
   * Update context metadata
   * @param {object} metadata - Metadata to update
   * @returns {Promise<boolean>} Success status
   */
  async updateMetadata(metadata) {
    try {
      const context = (await this.getContext()) || {};

      const updated = {
        ...context,
        ...metadata,
        updated_at: new Date().toISOString(),
      };

      await fs.writeFile(this.contextFilePath, yaml.stringify(updated), 'utf8');
      return true;
    } catch (error) {
      throw new Error(`Failed to update context metadata: ${error.message}`);
    }
  }
}

module.exports = { ScopeContext };
