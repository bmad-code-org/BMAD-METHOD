const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');

/**
 * File locking utilities for safe concurrent access to state files
 * Uses file-based locking for cross-process synchronization
 *
 * @class StateLock
 * @requires fs-extra
 * @requires yaml
 *
 * @example
 * const lock = new StateLock();
 * const result = await lock.withLock('/path/to/state.yaml', async () => {
 *   // Safe operations here
 *   return data;
 * });
 */
class StateLock {
  constructor(options = {}) {
    this.staleTimeout = options.staleTimeout || 30_000; // 30 seconds
    this.retries = options.retries || 10;
    this.minTimeout = options.minTimeout || 100;
    this.maxTimeout = options.maxTimeout || 1000;
    this.lockExtension = options.lockExtension || '.lock';
  }

  /**
   * Get lock file path for a given file
   * @param {string} filePath - The file to lock
   * @returns {string} Lock file path
   */
  getLockPath(filePath) {
    return `${filePath}${this.lockExtension}`;
  }

  /**
   * Check if a lock file is stale
   * @param {string} lockPath - Path to lock file
   * @returns {Promise<boolean>} True if lock is stale
   */
  async isLockStale(lockPath) {
    try {
      const stat = await fs.stat(lockPath);
      const age = Date.now() - stat.mtimeMs;
      return age > this.staleTimeout;
    } catch {
      return true; // If we can't stat, consider it stale
    }
  }

  /**
   * Acquire a lock on a file
   * @param {string} filePath - The file to lock
   * @returns {Promise<{success: boolean, lockPath: string}>}
   */
  async acquireLock(filePath) {
    const lockPath = this.getLockPath(filePath);

    for (let attempt = 0; attempt < this.retries; attempt++) {
      try {
        // Check if lock exists
        const lockExists = await fs.pathExists(lockPath);

        if (lockExists) {
          // Check if lock is stale
          const isStale = await this.isLockStale(lockPath);

          if (isStale) {
            // Remove stale lock
            await fs.remove(lockPath);
          } else {
            // Lock is active, wait and retry
            const waitTime = Math.min(this.minTimeout * Math.pow(2, attempt), this.maxTimeout);
            await this.sleep(waitTime);
            continue;
          }
        }

        // Try to create lock file atomically
        const lockContent = {
          pid: process.pid,
          hostname: require('node:os').hostname(),
          created: new Date().toISOString(),
        };

        // Use exclusive flag for atomic creation
        await fs.writeFile(lockPath, JSON.stringify(lockContent), {
          flag: 'wx', // Exclusive create
        });

        return { success: true, lockPath };
      } catch (error) {
        if (error.code === 'EEXIST') {
          // Lock was created by another process, retry
          const waitTime = Math.min(this.minTimeout * Math.pow(2, attempt), this.maxTimeout);
          await this.sleep(waitTime);
          continue;
        }
        throw error;
      }
    }

    return { success: false, lockPath, reason: 'Max retries exceeded' };
  }

  /**
   * Release a lock on a file
   * @param {string} filePath - The file that was locked
   * @returns {Promise<boolean>} True if lock was released
   */
  async releaseLock(filePath) {
    const lockPath = this.getLockPath(filePath);

    try {
      await fs.remove(lockPath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return true; // Lock already gone
      }
      throw error;
    }
  }

  /**
   * Execute operation with file lock
   * @param {string} filePath - File to lock
   * @param {function} operation - Async operation to perform
   * @returns {Promise<any>} Result of operation
   */
  async withLock(filePath, operation) {
    const lockResult = await this.acquireLock(filePath);

    if (!lockResult.success) {
      throw new Error(`Failed to acquire lock on ${filePath}: ${lockResult.reason}`);
    }

    try {
      return await operation();
    } finally {
      await this.releaseLock(filePath);
    }
  }

  /**
   * Read YAML file with version tracking
   * @param {string} filePath - Path to YAML file
   * @returns {Promise<object>} Parsed content with _version
   */
  async readYaml(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const data = yaml.parse(content);

      // Ensure version field exists
      if (!data._version) {
        data._version = 0;
      }

      return data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { _version: 0 };
      }
      throw error;
    }
  }

  /**
   * Write YAML file with version increment
   * @param {string} filePath - Path to YAML file
   * @param {object} data - Data to write
   * @returns {Promise<object>} Written data with new version
   */
  async writeYaml(filePath, data) {
    // Ensure directory exists
    await fs.ensureDir(path.dirname(filePath));

    // Update version and timestamp
    const versionedData = {
      ...data,
      _version: (data._version || 0) + 1,
      _lastModified: new Date().toISOString(),
    };

    const yamlContent = yaml.stringify(versionedData, { indent: 2 });
    await fs.writeFile(filePath, yamlContent, 'utf8');

    return versionedData;
  }

  /**
   * Update YAML file with automatic version management and locking
   * @param {string} filePath - Path to YAML file
   * @param {function} modifier - Function that receives data and returns modified data
   * @returns {Promise<object>} Updated data
   */
  async updateYamlWithVersion(filePath, modifier) {
    return this.withLock(filePath, async () => {
      // Read current data
      const data = await this.readYaml(filePath);
      const currentVersion = data._version || 0;

      // Apply modifications
      const modified = await modifier(data);

      // Update version
      modified._version = currentVersion + 1;
      modified._lastModified = new Date().toISOString();

      // Write back
      await this.writeYaml(filePath, modified);

      return modified;
    });
  }

  /**
   * Optimistic update with version check
   * @param {string} filePath - Path to YAML file
   * @param {number} expectedVersion - Expected version number
   * @param {object} newData - New data to write
   * @returns {Promise<{success: boolean, data: object, conflict: boolean}>}
   */
  async optimisticUpdate(filePath, expectedVersion, newData) {
    return this.withLock(filePath, async () => {
      const current = await this.readYaml(filePath);

      // Check version
      if (current._version !== expectedVersion) {
        return {
          success: false,
          data: current,
          conflict: true,
          message: `Version conflict: expected ${expectedVersion}, found ${current._version}`,
        };
      }

      // Update with new version
      const updated = {
        ...newData,
        _version: expectedVersion + 1,
        _lastModified: new Date().toISOString(),
      };

      await this.writeYaml(filePath, updated);

      return {
        success: true,
        data: updated,
        conflict: false,
      };
    });
  }

  /**
   * Sleep helper
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check if a file is currently locked
   * @param {string} filePath - The file to check
   * @returns {Promise<boolean>} True if locked
   */
  async isLocked(filePath) {
    const lockPath = this.getLockPath(filePath);

    try {
      const exists = await fs.pathExists(lockPath);

      if (!exists) {
        return false;
      }

      // Check if lock is stale
      const isStale = await this.isLockStale(lockPath);
      return !isStale;
    } catch {
      return false;
    }
  }

  /**
   * Get lock information
   * @param {string} filePath - The file to check
   * @returns {Promise<object|null>} Lock info or null
   */
  async getLockInfo(filePath) {
    const lockPath = this.getLockPath(filePath);

    try {
      const exists = await fs.pathExists(lockPath);

      if (!exists) {
        return null;
      }

      const content = await fs.readFile(lockPath, 'utf8');
      const info = JSON.parse(content);
      const stat = await fs.stat(lockPath);

      return {
        ...info,
        age: Date.now() - stat.mtimeMs,
        isStale: Date.now() - stat.mtimeMs > this.staleTimeout,
      };
    } catch {
      return null;
    }
  }

  /**
   * Force release a lock (use with caution)
   * @param {string} filePath - The file to unlock
   * @returns {Promise<boolean>} True if lock was removed
   */
  async forceRelease(filePath) {
    const lockPath = this.getLockPath(filePath);

    try {
      await fs.remove(lockPath);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = { StateLock };
