const yaml = require('yaml');

/**
 * Validates scope configuration and enforces schema rules
 * @class ScopeValidator
 */
class ScopeValidator {
  // Scope ID validation pattern: lowercase alphanumeric + hyphens, 2-50 chars
  // IMPORTANT: Must be defined as class field BEFORE constructor to be available in validateScopeId
  scopeIdPattern = /^[a-z][a-z0-9-]*[a-z0-9]$/;

  constructor() {
    // Reserved scope IDs that cannot be used
    // NOTE: 'default' removed from reserved list - it's valid for migration scenarios
    this.reservedIds = ['_shared', '_events', '_config', '_backup', 'global'];

    // Valid isolation modes
    this.validIsolationModes = ['strict', 'warn', 'permissive'];

    // Valid scope statuses
    this.validStatuses = ['active', 'archived'];
  }

  /**
   * Validates a scope ID format
   * @param {string} scopeId - The scope ID to validate
   * @returns {{valid: boolean, error: string|null}}
   */
  validateScopeId(scopeId) {
    // Check if provided
    if (!scopeId || typeof scopeId !== 'string') {
      return { valid: false, error: 'Scope ID is required and must be a string' };
    }

    // Check length
    if (scopeId.length < 2 || scopeId.length > 50) {
      return { valid: false, error: 'Scope ID must be between 2 and 50 characters' };
    }

    // Check pattern
    if (!this.scopeIdPattern.test(scopeId)) {
      return {
        valid: false,
        error:
          'Scope ID must start with lowercase letter, contain only lowercase letters, numbers, and hyphens, and end with letter or number',
      };
    }

    // Check reserved IDs
    if (this.reservedIds.includes(scopeId)) {
      return {
        valid: false,
        error: `Scope ID '${scopeId}' is reserved and cannot be used`,
      };
    }

    return { valid: true, error: null };
  }

  /**
   * Validates a complete scope configuration object
   * @param {object} scope - The scope configuration to validate
   * @param {object} allScopes - All existing scopes for dependency validation
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateScope(scope, allScopes = {}) {
    const errors = [];

    // Validate ID
    const idValidation = this.validateScopeId(scope.id);
    if (!idValidation.valid) {
      errors.push(idValidation.error);
    }

    // Validate name
    if (!scope.name || typeof scope.name !== 'string' || scope.name.trim().length === 0) {
      errors.push('Scope name is required and must be a non-empty string');
    }

    // Validate description (optional but if provided must be string)
    if (scope.description !== undefined && typeof scope.description !== 'string') {
      errors.push('Scope description must be a string');
    }

    // Validate status
    if (scope.status && !this.validStatuses.includes(scope.status)) {
      errors.push(`Invalid status '${scope.status}'. Must be one of: ${this.validStatuses.join(', ')}`);
    }

    // Validate dependencies
    if (scope.dependencies) {
      if (Array.isArray(scope.dependencies)) {
        // Check each dependency exists
        for (const dep of scope.dependencies) {
          if (typeof dep !== 'string') {
            errors.push(`Dependency '${dep}' must be a string`);
            continue;
          }

          // Check dependency exists
          if (!allScopes[dep]) {
            errors.push(`Dependency '${dep}' does not exist`);
          }

          // Check for self-dependency
          if (dep === scope.id) {
            errors.push(`Scope cannot depend on itself`);
          }
        }

        // Check for circular dependencies
        const circularCheck = this.detectCircularDependencies(scope.id, scope.dependencies, allScopes);
        if (circularCheck.hasCircular) {
          errors.push(`Circular dependency detected: ${circularCheck.chain.join(' → ')}`);
        }
      } else {
        errors.push('Scope dependencies must be an array');
      }
    }

    // Validate created timestamp (if provided)
    if (scope.created) {
      const date = new Date(scope.created);
      if (isNaN(date.getTime())) {
        errors.push('Invalid created timestamp format. Use ISO 8601 format.');
      }
    }

    // Validate metadata
    if (scope._meta) {
      if (typeof scope._meta === 'object') {
        if (scope._meta.last_activity) {
          const date = new Date(scope._meta.last_activity);
          if (isNaN(date.getTime())) {
            errors.push('Invalid _meta.last_activity timestamp format');
          }
        }
        if (scope._meta.artifact_count !== undefined && (!Number.isInteger(scope._meta.artifact_count) || scope._meta.artifact_count < 0)) {
          errors.push('_meta.artifact_count must be a non-negative integer');
        }
      } else {
        errors.push('Scope _meta must be an object');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Detects circular dependencies in scope dependency chain
   * @param {string} scopeId - The scope ID to check
   * @param {string[]} dependencies - Direct dependencies of the scope
   * @param {object} allScopes - All existing scopes
   * @param {Set} visited - Set of already visited scopes (for recursion)
   * @param {string[]} chain - Current dependency chain (for error reporting)
   * @returns {{hasCircular: boolean, chain: string[]}}
   */
  detectCircularDependencies(scopeId, dependencies, allScopes, visited = new Set(), chain = []) {
    // Add current scope to visited set and chain
    visited.add(scopeId);
    chain.push(scopeId);

    if (!dependencies || dependencies.length === 0) {
      return { hasCircular: false, chain: [] };
    }

    for (const dep of dependencies) {
      // Check if we've already visited this dependency (circular!)
      if (visited.has(dep)) {
        return { hasCircular: true, chain: [...chain, dep] };
      }

      // Recursively check this dependency's dependencies
      const depScope = allScopes[dep];
      if (depScope && depScope.dependencies) {
        const result = this.detectCircularDependencies(dep, depScope.dependencies, allScopes, new Set(visited), [...chain]);
        if (result.hasCircular) {
          return result;
        }
      }
    }

    return { hasCircular: false, chain: [] };
  }

  /**
   * Validates complete scopes.yaml configuration
   * @param {object} config - The complete scopes configuration
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateConfig(config) {
    const errors = [];

    // Validate version
    if (!config.version || typeof config.version !== 'number') {
      errors.push('Configuration version is required and must be a number');
    }

    // Validate settings
    if (config.settings) {
      if (typeof config.settings === 'object') {
        // Validate isolation_mode
        if (config.settings.isolation_mode && !this.validIsolationModes.includes(config.settings.isolation_mode)) {
          errors.push(`Invalid isolation_mode '${config.settings.isolation_mode}'. Must be one of: ${this.validIsolationModes.join(', ')}`);
        }

        // Validate allow_adhoc_scopes
        if (config.settings.allow_adhoc_scopes !== undefined && typeof config.settings.allow_adhoc_scopes !== 'boolean') {
          errors.push('allow_adhoc_scopes must be a boolean');
        }

        // Validate paths
        if (config.settings.default_output_base && typeof config.settings.default_output_base !== 'string') {
          errors.push('default_output_base must be a string');
        }
        if (config.settings.default_shared_path && typeof config.settings.default_shared_path !== 'string') {
          errors.push('default_shared_path must be a string');
        }
      } else {
        errors.push('Settings must be an object');
      }
    }

    // Validate scopes object
    if (config.scopes) {
      if (typeof config.scopes !== 'object' || Array.isArray(config.scopes)) {
        errors.push('Scopes must be an object (not an array)');
      } else {
        // Validate each scope
        for (const [scopeId, scopeConfig] of Object.entries(config.scopes)) {
          // Check ID matches key
          if (scopeConfig.id !== scopeId) {
            errors.push(`Scope key '${scopeId}' does not match scope.id '${scopeConfig.id}'`);
          }

          // Validate the scope
          const scopeValidation = this.validateScope(scopeConfig, config.scopes);
          if (!scopeValidation.valid) {
            errors.push(`Scope '${scopeId}': ${scopeValidation.errors.join(', ')}`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates scopes.yaml file content
   * @param {string} yamlContent - The YAML file content as string
   * @returns {{valid: boolean, errors: string[], config: object|null}}
   */
  validateYamlContent(yamlContent) {
    try {
      const config = yaml.parse(yamlContent);
      const validation = this.validateConfig(config);

      return {
        valid: validation.valid,
        errors: validation.errors,
        config: validation.valid ? config : null,
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to parse YAML: ${error.message}`],
        config: null,
      };
    }
  }

  /**
   * Creates a default valid scopes.yaml configuration
   * @returns {object} Default configuration object
   */
  createDefaultConfig() {
    return {
      version: 1,
      settings: {
        allow_adhoc_scopes: true,
        isolation_mode: 'strict',
        default_output_base: '_bmad-output',
        default_shared_path: '_bmad-output/_shared',
      },
      scopes: {},
    };
  }
}

module.exports = { ScopeValidator };
