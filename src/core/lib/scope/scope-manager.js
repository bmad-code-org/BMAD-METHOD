const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const { ScopeValidator } = require('./scope-validator');
const { ScopeInitializer } = require('./scope-initializer');

/**
 * Manages scope lifecycle and CRUD operations
 * Handles scope configuration in scopes.yaml file
 *
 * @class ScopeManager
 * @requires fs-extra
 * @requires yaml
 * @requires ScopeValidator
 *
 * @example
 * const manager = new ScopeManager({ projectRoot: '/path/to/project' });
 * await manager.initialize();
 * const scope = await manager.createScope('auth', { name: 'Authentication' });
 */
class ScopeManager {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.bmadPath = options.bmadPath || path.join(this.projectRoot, '_bmad');
    this.configPath = options.configPath || path.join(this.bmadPath, '_config');
    this.scopesFilePath = options.scopesFilePath || path.join(this.configPath, 'scopes.yaml');

    this.validator = new ScopeValidator();
    this.initializer = new ScopeInitializer({ projectRoot: this.projectRoot });
    this._config = null; // Cached configuration
  }

  /**
   * Set the project root directory
   * @param {string} projectRoot - The project root path
   */
  setProjectRoot(projectRoot) {
    this.projectRoot = projectRoot;
    this.bmadPath = path.join(projectRoot, '_bmad');
    this.configPath = path.join(this.bmadPath, '_config');
    this.scopesFilePath = path.join(this.configPath, 'scopes.yaml');
    this._config = null; // Clear cache
    this.initializer.setProjectRoot(projectRoot);
  }

  /**
   * Initialize the scope management system
   * Creates scopes.yaml if it doesn't exist
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      // Ensure directories exist
      await fs.ensureDir(this.configPath);

      // Check if scopes.yaml exists
      const exists = await fs.pathExists(this.scopesFilePath);

      if (!exists) {
        // Create default configuration
        const defaultConfig = this.validator.createDefaultConfig();
        await this.saveConfig(defaultConfig);
      }

      // Initialize scope system directories (_shared, _events)
      await this.initializer.initializeScopeSystem();

      // Load and validate configuration
      const config = await this.loadConfig();
      return config !== null;
    } catch (error) {
      throw new Error(`Failed to initialize scope manager: ${error.message}`);
    }
  }

  /**
   * Load scopes configuration from file
   * @param {boolean} forceReload - Force reload from disk (ignore cache)
   * @returns {Promise<object|null>} Configuration object or null if invalid
   */
  async loadConfig(forceReload = false) {
    try {
      // Return cached config if available
      if (this._config && !forceReload) {
        return this._config;
      }

      // Check if file exists
      const exists = await fs.pathExists(this.scopesFilePath);
      if (!exists) {
        throw new Error('scopes.yaml does not exist. Run initialize() first.');
      }

      // Read and parse file
      const content = await fs.readFile(this.scopesFilePath, 'utf8');
      const config = yaml.parse(content);

      // Validate configuration
      const validation = this.validator.validateConfig(config);
      if (!validation.valid) {
        throw new Error(`Invalid scopes.yaml: ${validation.errors.join(', ')}`);
      }

      // Cache and return
      this._config = config;
      return config;
    } catch (error) {
      throw new Error(`Failed to load scopes configuration: ${error.message}`);
    }
  }

  /**
   * Save scopes configuration to file
   * @param {object} config - Configuration object to save
   * @returns {Promise<boolean>} Success status
   */
  async saveConfig(config) {
    try {
      // Validate before saving
      const validation = this.validator.validateConfig(config);
      if (!validation.valid) {
        throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
      }

      // Ensure directory exists
      await fs.ensureDir(this.configPath);

      // Write to file
      const yamlContent = yaml.stringify(config, {
        indent: 2,
        lineWidth: 100,
      });
      await fs.writeFile(this.scopesFilePath, yamlContent, 'utf8');

      // Update cache
      this._config = config;
      return true;
    } catch (error) {
      throw new Error(`Failed to save scopes configuration: ${error.message}`);
    }
  }

  /**
   * List all scopes
   * @param {object} filters - Optional filters (status, etc.)
   * @returns {Promise<object[]>} Array of scope objects
   */
  async listScopes(filters = {}) {
    try {
      const config = await this.loadConfig();
      let scopes = Object.values(config.scopes || {});

      // Apply filters
      if (filters.status) {
        scopes = scopes.filter((scope) => scope.status === filters.status);
      }

      // Sort by created date (newest first)
      scopes.sort((a, b) => {
        const dateA = a.created ? new Date(a.created) : new Date(0);
        const dateB = b.created ? new Date(b.created) : new Date(0);
        return dateB - dateA;
      });

      return scopes;
    } catch (error) {
      throw new Error(`Failed to list scopes: ${error.message}`);
    }
  }

  /**
   * Get a specific scope by ID
   * @param {string} scopeId - The scope ID
   * @returns {Promise<object|null>} Scope object or null if not found
   */
  async getScope(scopeId) {
    try {
      const config = await this.loadConfig();
      return config.scopes?.[scopeId] || null;
    } catch (error) {
      throw new Error(`Failed to get scope '${scopeId}': ${error.message}`);
    }
  }

  /**
   * Check if a scope exists
   * @param {string} scopeId - The scope ID
   * @returns {Promise<boolean>} True if scope exists
   */
  async scopeExists(scopeId) {
    try {
      const scope = await this.getScope(scopeId);
      return scope !== null;
    } catch {
      return false;
    }
  }

  /**
   * Create a new scope
   * @param {string} scopeId - The scope ID
   * @param {object} options - Scope options (name, description, dependencies, etc.)
   * @returns {Promise<object>} Created scope object
   */
  async createScope(scopeId, options = {}) {
    try {
      // Validate scope ID
      const idValidation = this.validator.validateScopeId(scopeId);
      if (!idValidation.valid) {
        throw new Error(idValidation.error);
      }

      // Check if scope already exists
      const exists = await this.scopeExists(scopeId);
      if (exists) {
        throw new Error(`Scope '${scopeId}' already exists`);
      }

      // Load current configuration
      const config = await this.loadConfig();

      // Create scope object
      const scope = {
        id: scopeId,
        name: options.name || scopeId,
        description: options.description || '',
        status: options.status || 'active',
        dependencies: options.dependencies || [],
        created: new Date().toISOString(),
        _meta: {
          last_activity: new Date().toISOString(),
          artifact_count: 0,
        },
      };

      // Validate scope with existing scopes
      const scopeValidation = this.validator.validateScope(scope, config.scopes);
      if (!scopeValidation.valid) {
        throw new Error(`Invalid scope configuration: ${scopeValidation.errors.join(', ')}`);
      }

      // Add to configuration
      config.scopes[scopeId] = scope;

      // Save configuration
      await this.saveConfig(config);

      // Create scope directory structure
      await this.initializer.initializeScope(scopeId, options);

      return scope;
    } catch (error) {
      throw new Error(`Failed to create scope '${scopeId}': ${error.message}`);
    }
  }

  /**
   * Update an existing scope
   * @param {string} scopeId - The scope ID
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} Updated scope object
   */
  async updateScope(scopeId, updates = {}) {
    try {
      // Load current configuration
      const config = await this.loadConfig();

      // Check if scope exists
      if (!config.scopes[scopeId]) {
        throw new Error(`Scope '${scopeId}' does not exist`);
      }

      // Get current scope
      const currentScope = config.scopes[scopeId];

      // Apply updates (cannot change ID)
      const updatedScope = {
        ...currentScope,
        ...updates,
        id: scopeId, // Force ID to remain unchanged
        _meta: {
          ...currentScope._meta,
          ...updates._meta,
          last_activity: new Date().toISOString(),
        },
      };

      // Validate updated scope
      const scopeValidation = this.validator.validateScope(updatedScope, config.scopes);
      if (!scopeValidation.valid) {
        throw new Error(`Invalid scope update: ${scopeValidation.errors.join(', ')}`);
      }

      // Update in configuration
      config.scopes[scopeId] = updatedScope;

      // Save configuration
      await this.saveConfig(config);

      return updatedScope;
    } catch (error) {
      throw new Error(`Failed to update scope '${scopeId}': ${error.message}`);
    }
  }

  /**
   * Remove a scope
   * @param {string} scopeId - The scope ID
   * @param {object} options - Removal options (force, etc.)
   * @returns {Promise<boolean>} Success status
   */
  async removeScope(scopeId, options = {}) {
    try {
      // Load current configuration
      const config = await this.loadConfig();

      // Check if scope exists
      if (!config.scopes[scopeId]) {
        throw new Error(`Scope '${scopeId}' does not exist`);
      }

      // Check if other scopes depend on this one
      const dependentScopes = this.findDependentScopesSync(scopeId, config.scopes);
      if (dependentScopes.length > 0 && !options.force) {
        throw new Error(
          `Cannot remove scope '${scopeId}'. The following scopes depend on it: ${dependentScopes.join(', ')}. Use force option to remove anyway.`,
        );
      }

      // Remove scope
      delete config.scopes[scopeId];

      // If force remove, also remove dependencies from other scopes
      if (options.force && dependentScopes.length > 0) {
        for (const depScopeId of dependentScopes) {
          const depScope = config.scopes[depScopeId];
          depScope.dependencies = depScope.dependencies.filter((dep) => dep !== scopeId);
        }
      }

      // Save configuration
      await this.saveConfig(config);

      return true;
    } catch (error) {
      throw new Error(`Failed to remove scope '${scopeId}': ${error.message}`);
    }
  }

  /**
   * Get scope paths for artifact resolution
   * @param {string} scopeId - The scope ID
   * @returns {Promise<object>} Object containing scope paths
   */
  async getScopePaths(scopeId) {
    try {
      const config = await this.loadConfig();
      const scope = config.scopes[scopeId];

      if (!scope) {
        throw new Error(`Scope '${scopeId}' does not exist`);
      }

      const outputBase = config.settings.default_output_base;
      const scopePath = path.join(this.projectRoot, outputBase, scopeId);

      return {
        root: scopePath,
        planning: path.join(scopePath, 'planning-artifacts'),
        implementation: path.join(scopePath, 'implementation-artifacts'),
        tests: path.join(scopePath, 'tests'),
        meta: path.join(scopePath, '.scope-meta.yaml'),
      };
    } catch (error) {
      throw new Error(`Failed to get scope paths for '${scopeId}': ${error.message}`);
    }
  }

  /**
   * Resolve a path template with scope variable
   * @param {string} template - Path template (e.g., "{output_folder}/{scope}/artifacts")
   * @param {string} scopeId - The scope ID
   * @returns {string} Resolved path
   */
  resolvePath(template, scopeId) {
    return template
      .replaceAll('{scope}', scopeId)
      .replaceAll('{output_folder}', this._config?.settings?.default_output_base || '_bmad-output');
  }

  /**
   * Get dependency tree for a scope
   * @param {string} scopeId - The scope ID
   * @returns {Promise<object>} Dependency tree
   */
  async getDependencyTree(scopeId) {
    try {
      const config = await this.loadConfig();
      const scope = config.scopes[scopeId];

      if (!scope) {
        throw new Error(`Scope '${scopeId}' does not exist`);
      }

      const tree = {
        scope: scopeId,
        dependencies: [],
        dependents: this.findDependentScopesSync(scopeId, config.scopes),
      };

      // Build dependency tree recursively
      if (scope.dependencies && scope.dependencies.length > 0) {
        for (const depId of scope.dependencies) {
          const depScope = config.scopes[depId];
          if (depScope) {
            tree.dependencies.push({
              scope: depId,
              name: depScope.name,
              status: depScope.status,
            });
          }
        }
      }

      return tree;
    } catch (error) {
      throw new Error(`Failed to get dependency tree for '${scopeId}': ${error.message}`);
    }
  }

  /**
   * Find scopes that depend on a given scope
   * @param {string} scopeId - The scope ID
   * @param {object} allScopes - All scopes object (optional, will load if not provided)
   * @returns {Promise<string[]>|string[]} Array of dependent scope IDs
   */
  async findDependentScopes(scopeId, allScopes = null) {
    // If allScopes not provided, load from config
    if (!allScopes) {
      const config = await this.loadConfig();
      allScopes = config.scopes || {};
    }

    const dependents = [];

    for (const [sid, scope] of Object.entries(allScopes)) {
      if (scope.dependencies && scope.dependencies.includes(scopeId)) {
        dependents.push(sid);
      }
    }

    return dependents;
  }

  /**
   * Find scopes that depend on a given scope (synchronous version)
   * @param {string} scopeId - The scope ID
   * @param {object} allScopes - All scopes object (required)
   * @returns {string[]} Array of dependent scope IDs
   */
  findDependentScopesSync(scopeId, allScopes) {
    const dependents = [];

    for (const [sid, scope] of Object.entries(allScopes)) {
      if (scope.dependencies && scope.dependencies.includes(scopeId)) {
        dependents.push(sid);
      }
    }

    return dependents;
  }

  /**
   * Archive a scope (set status to archived)
   * @param {string} scopeId - The scope ID
   * @returns {Promise<object>} Updated scope object
   */
  async archiveScope(scopeId) {
    return this.updateScope(scopeId, { status: 'archived' });
  }

  /**
   * Activate a scope (set status to active)
   * @param {string} scopeId - The scope ID
   * @returns {Promise<object>} Updated scope object
   */
  async activateScope(scopeId) {
    return this.updateScope(scopeId, { status: 'active' });
  }

  /**
   * Update scope activity timestamp
   * @param {string} scopeId - The scope ID
   * @returns {Promise<object>} Updated scope object
   */
  async touchScope(scopeId) {
    return this.updateScope(scopeId, {
      _meta: { last_activity: new Date().toISOString() },
    });
  }

  /**
   * Increment artifact count for a scope
   * @param {string} scopeId - The scope ID
   * @param {number} increment - Amount to increment (default: 1)
   * @returns {Promise<object>} Updated scope object
   */
  async incrementArtifactCount(scopeId, increment = 1) {
    const scope = await this.getScope(scopeId);
    if (!scope) {
      throw new Error(`Scope '${scopeId}' does not exist`);
    }

    const currentCount = scope._meta?.artifact_count || 0;
    return this.updateScope(scopeId, {
      _meta: { artifact_count: currentCount + increment },
    });
  }

  /**
   * Get scope settings
   * @returns {Promise<object>} Settings object
   */
  async getSettings() {
    const config = await this.loadConfig();
    return config.settings || {};
  }

  /**
   * Update scope settings
   * @param {object} settings - New settings
   * @returns {Promise<object>} Updated settings
   */
  async updateSettings(settings) {
    const config = await this.loadConfig();
    config.settings = {
      ...config.settings,
      ...settings,
    };
    await this.saveConfig(config);
    return config.settings;
  }
}

module.exports = { ScopeManager };
