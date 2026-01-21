const path = require('node:path');

/**
 * Resolves and enforces scope-based artifact access
 * Implements read-any/write-own access model
 *
 * @class ArtifactResolver
 *
 * @example
 * const resolver = new ArtifactResolver({
 *   currentScope: 'auth',
 *   basePath: '/path/to/_bmad-output'
 * });
 *
 * if (resolver.canWrite('/path/to/_bmad-output/auth/file.md')) {
 *   // Write operation allowed
 * }
 */
class ArtifactResolver {
  constructor(options = {}) {
    this.currentScope = options.currentScope || null;
    this.basePath = options.basePath || '_bmad-output';
    this.isolationMode = options.isolationMode || 'strict'; // strict | warn | permissive
    this.sharedPath = '_shared';
    this.reservedPaths = ['_shared', '_events', '_config', '_backup'];
  }

  /**
   * Set the current scope
   * @param {string} scopeId - The current scope ID
   */
  setCurrentScope(scopeId) {
    this.currentScope = scopeId;
  }

  /**
   * Set isolation mode
   * @param {string} mode - Isolation mode (strict, warn, permissive)
   */
  setIsolationMode(mode) {
    if (!['strict', 'warn', 'permissive'].includes(mode)) {
      throw new Error(`Invalid isolation mode: ${mode}`);
    }
    this.isolationMode = mode;
  }

  /**
   * Extract scope from a file path
   * @param {string} filePath - The file path to analyze
   * @returns {string|null} Scope ID or null if not in a scope
   */
  extractScopeFromPath(filePath) {
    // Normalize path
    const normalizedPath = path.normalize(filePath);

    // Find the base path in the file path
    const baseIndex = normalizedPath.indexOf(this.basePath);
    if (baseIndex === -1) {
      return null; // Not in output directory
    }

    // Get the relative path from base
    const relativePath = normalizedPath.slice(Math.max(0, baseIndex + this.basePath.length + 1));

    // Split to get the first segment (scope name)
    const segments = relativePath.split(path.sep).filter(Boolean);

    if (segments.length === 0) {
      return null;
    }

    const firstSegment = segments[0];

    // Check if it's a reserved path
    if (this.reservedPaths.includes(firstSegment)) {
      return firstSegment; // Return the reserved path name
    }

    return firstSegment;
  }

  /**
   * Check if a path is in the shared directory
   * @param {string} filePath - The file path
   * @returns {boolean} True if path is in shared
   */
  isSharedPath(filePath) {
    const scope = this.extractScopeFromPath(filePath);
    return scope === this.sharedPath;
  }

  /**
   * Check if a path is in a reserved directory
   * @param {string} filePath - The file path
   * @returns {boolean} True if path is reserved
   */
  isReservedPath(filePath) {
    const scope = this.extractScopeFromPath(filePath);
    return this.reservedPaths.includes(scope);
  }

  /**
   * Check if read access is allowed to a path
   * Read is always allowed in read-any model
   * @param {string} filePath - The file path to check
   * @returns {{allowed: boolean, reason: string}}
   */
  canRead(filePath) {
    // Read is always allowed for all paths
    return {
      allowed: true,
      reason: 'Read access is always allowed in read-any model',
    };
  }

  /**
   * Check if write access is allowed to a path
   * @param {string} filePath - The file path to check
   * @returns {{allowed: boolean, reason: string, warning: string|null}}
   */
  canWrite(filePath) {
    // No current scope means legacy mode - allow all
    if (!this.currentScope) {
      return {
        allowed: true,
        reason: 'No scope active, operating in legacy mode',
        warning: null,
      };
    }

    const targetScope = this.extractScopeFromPath(filePath);

    // Check for shared path write attempt
    if (targetScope === this.sharedPath) {
      return {
        allowed: false,
        reason: `Cannot write directly to '${this.sharedPath}'. Use: bmad scope sync-up`,
        warning: null,
      };
    }

    // Check for reserved path write attempt
    if (this.reservedPaths.includes(targetScope) && targetScope !== this.currentScope) {
      return {
        allowed: false,
        reason: `Cannot write to reserved path '${targetScope}'`,
        warning: null,
      };
    }

    // Check if writing to current scope
    if (targetScope === this.currentScope) {
      return {
        allowed: true,
        reason: `Write allowed to current scope '${this.currentScope}'`,
        warning: null,
      };
    }

    // Cross-scope write attempt
    if (targetScope && targetScope !== this.currentScope) {
      switch (this.isolationMode) {
        case 'strict': {
          return {
            allowed: false,
            reason: `Cannot write to scope '${targetScope}' while in scope '${this.currentScope}'`,
            warning: null,
          };
        }

        case 'warn': {
          return {
            allowed: true,
            reason: 'Write allowed with warning in warn mode',
            warning: `Warning: Writing to scope '${targetScope}' from scope '${this.currentScope}'`,
          };
        }

        case 'permissive': {
          return {
            allowed: true,
            reason: 'Write allowed in permissive mode',
            warning: null,
          };
        }

        default: {
          return {
            allowed: false,
            reason: 'Unknown isolation mode',
            warning: null,
          };
        }
      }
    }

    // Path not in any scope - allow (it's outside the scope system)
    return {
      allowed: true,
      reason: 'Path is outside scope system',
      warning: null,
    };
  }

  /**
   * Validate a write operation and throw if not allowed
   * @param {string} filePath - The file path to write to
   * @throws {Error} If write is not allowed in strict mode
   */
  validateWrite(filePath) {
    const result = this.canWrite(filePath);

    if (!result.allowed) {
      throw new Error(result.reason);
    }

    if (result.warning) {
      console.warn(result.warning);
    }
  }

  /**
   * Resolve a scope-relative path to absolute path
   * @param {string} relativePath - Relative path within scope
   * @param {string} scopeId - Scope ID (defaults to current)
   * @returns {string} Absolute path
   */
  resolveScopePath(relativePath, scopeId = null) {
    const scope = scopeId || this.currentScope;

    if (!scope) {
      // No scope - return path relative to base
      return path.join(this.basePath, relativePath);
    }

    return path.join(this.basePath, scope, relativePath);
  }

  /**
   * Resolve path to shared directory
   * @param {string} relativePath - Relative path within shared
   * @returns {string} Absolute path to shared
   */
  resolveSharedPath(relativePath) {
    return path.join(this.basePath, this.sharedPath, relativePath);
  }

  /**
   * Get all paths accessible for reading from current scope
   * @returns {object} Object with path categories
   */
  getReadablePaths() {
    return {
      currentScope: this.currentScope ? path.join(this.basePath, this.currentScope) : null,
      shared: path.join(this.basePath, this.sharedPath),
      allScopes: `${this.basePath}/*`,
      description: 'Read access is allowed to all scopes and shared directories',
    };
  }

  /**
   * Get paths writable from current scope
   * @returns {object} Object with writable paths
   */
  getWritablePaths() {
    if (!this.currentScope) {
      return {
        all: this.basePath,
        description: 'No scope active - all paths writable (legacy mode)',
      };
    }

    return {
      currentScope: path.join(this.basePath, this.currentScope),
      description: `Write access limited to scope '${this.currentScope}'`,
    };
  }

  /**
   * Check if current operation context is valid
   * @returns {boolean} True if context is properly set up
   */
  isContextValid() {
    return this.basePath !== null;
  }

  /**
   * Create a scoped path resolver for a specific scope
   * @param {string} scopeId - The scope ID
   * @returns {function} Path resolver function
   */
  createScopedResolver(scopeId) {
    const base = this.basePath;
    return (relativePath) => path.join(base, scopeId, relativePath);
  }
}

module.exports = { ArtifactResolver };
