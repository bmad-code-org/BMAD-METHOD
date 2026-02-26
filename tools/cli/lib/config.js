const fs = require('fs-extra');
const yaml = require('yaml');
const path = require('node:path');
const packageJson = require('../../../package.json');

/**
 * Configuration utility class
 */
class Config {
  /** @type {Map<string, { data: Object, mtime: number }>} */
  #cache = new Map();

  /**
   * Load a YAML configuration file with in-memory caching.
   * Cached entries are automatically invalidated when the file's
   * modification time changes, so callers always receive fresh data
   * after a file is written.
   * @param {string} configPath - Path to config file
   * @returns {Object} Parsed configuration
   */
  async loadYaml(configPath) {
    if (!(await fs.pathExists(configPath))) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }

    const resolved = path.resolve(configPath);
    const stat = await fs.stat(resolved);
    const mtime = stat.mtimeMs;

    const cached = this.#cache.get(resolved);
    if (cached && cached.mtime === mtime) {
      return cached.data;
    }

    const content = await fs.readFile(resolved, 'utf8');
    const data = yaml.parse(content);
    this.#cache.set(resolved, { data, mtime });
    return data;
  }

  /**
   * Clear the in-memory YAML cache.
   */
  clearCache() {
    this.#cache.clear();
  }

  /**
   * Save configuration to YAML file
   * @param {string} configPath - Path to config file
   * @param {Object} config - Configuration object
   */
  async saveYaml(configPath, config) {
    const yamlContent = yaml.dump(config, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
    });

    await fs.ensureDir(path.dirname(configPath));
    // Ensure POSIX-compliant final newline
    const content = yamlContent.endsWith('\n') ? yamlContent : yamlContent + '\n';
    await fs.writeFile(configPath, content, 'utf8');
  }

  /**
   * Process configuration file (replace placeholders)
   * @param {string} configPath - Path to config file
   * @param {Object} replacements - Replacement values
   */
  async processConfig(configPath, replacements = {}) {
    let content = await fs.readFile(configPath, 'utf8');

    // Standard replacements
    const standardReplacements = {
      '{project-root}': replacements.root || '',
      '{module}': replacements.module || '',
      '{version}': replacements.version || packageJson.version,
      '{date}': new Date().toISOString().split('T')[0],
    };

    // Apply all replacements
    const allReplacements = { ...standardReplacements, ...replacements };

    for (const [placeholder, value] of Object.entries(allReplacements)) {
      if (typeof placeholder === 'string' && typeof value === 'string') {
        const regex = new RegExp(placeholder.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`), 'g');
        content = content.replace(regex, value);
      }
    }

    await fs.writeFile(configPath, content, 'utf8');
  }

  /**
   * Merge configurations
   * @param {Object} base - Base configuration
   * @param {Object} override - Override configuration
   * @returns {Object} Merged configuration
   */
  mergeConfigs(base, override) {
    return this.deepMerge(base, override);
  }

  /**
   * Deep merge two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  deepMerge(target, source) {
    const output = { ...target };

    if (this.isObject(target) && this.isObject(source)) {
      for (const key of Object.keys(source)) {
        if (this.isObject(source[key])) {
          if (key in target) {
            output[key] = this.deepMerge(target[key], source[key]);
          } else {
            output[key] = source[key];
          }
        } else {
          output[key] = source[key];
        }
      }
    }

    return output;
  }

  /**
   * Check if value is an object
   * @param {*} item - Item to check
   * @returns {boolean} True if object
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Validate configuration against schema
   * @param {Object} config - Configuration to validate
   * @param {Object} schema - Validation schema
   * @returns {Object} Validation result
   */
  validateConfig(config, schema) {
    const errors = [];
    const warnings = [];

    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in config)) {
          errors.push(`Missing required field: ${field}`);
        }
      }
    }

    // Check field types
    if (schema.properties) {
      for (const [field, spec] of Object.entries(schema.properties)) {
        if (field in config) {
          const value = config[field];
          const expectedType = spec.type;

          if (expectedType === 'array' && !Array.isArray(value)) {
            errors.push(`Field '${field}' should be an array`);
          } else if (expectedType === 'object' && !this.isObject(value)) {
            errors.push(`Field '${field}' should be an object`);
          } else if (expectedType === 'string' && typeof value !== 'string') {
            errors.push(`Field '${field}' should be a string`);
          } else if (expectedType === 'number' && typeof value !== 'number') {
            errors.push(`Field '${field}' should be a number`);
          } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
            errors.push(`Field '${field}' should be a boolean`);
          }

          // Check enum values
          if (spec.enum && !spec.enum.includes(value)) {
            errors.push(`Field '${field}' must be one of: ${spec.enum.join(', ')}`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get configuration value with fallback
   * @param {Object} config - Configuration object
   * @param {string} path - Dot-notation path to value
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Configuration value
   */
  getValue(config, path, defaultValue = null) {
    const keys = path.split('.');
    let current = config;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }

    return current;
  }

  /**
   * Set configuration value
   * @param {Object} config - Configuration object
   * @param {string} path - Dot-notation path to value
   * @param {*} value - Value to set
   */
  setValue(config, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = config;

    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[lastKey] = value;
  }
}

module.exports = { Config };
