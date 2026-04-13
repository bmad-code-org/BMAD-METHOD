const fs = require('fs-extra');
const path = require('node:path');
const crypto = require('node:crypto');

/**
 * File operations utility class
 */
class FileOps {
  /**
   * Copy a directory recursively
   * @param {string} source - Source directory
   * @param {string} dest - Destination directory
   * @param {Object} options - Copy options
   */
  async copyDirectory(source, dest, options = {}) {
    const defaultOptions = {
      overwrite: true,
      errorOnExist: false,
      filter: (src) => !this.shouldIgnore(src),
    };

    const copyOptions = { ...defaultOptions, ...options };
    await fs.copy(source, dest, copyOptions);
  }

  /**
   * Sync directory (selective copy preserving modifications)
   * @param {string} source - Source directory
   * @param {string} dest - Destination directory
   */
  async syncDirectory(source, dest) {
    const sourceFiles = await this.getFileList(source);

    for (const file of sourceFiles) {
      const sourceFile = path.join(source, file);
      const destFile = path.join(dest, file);

      // Check if destination file exists
      if (await fs.pathExists(destFile)) {
        // Compare checksums to see if file has been modified
        const sourceHash = await this.getFileHash(sourceFile);
        const destHash = await this.getFileHash(destFile);

        if (sourceHash === destHash) {
          // Files are identical, safe to update
          await fs.copy(sourceFile, destFile, { overwrite: true });
        } else {
          // File has been modified, check timestamps
          const sourceStats = await fs.stat(sourceFile);
          const destStats = await fs.stat(destFile);

          if (sourceStats.mtime > destStats.mtime) {
            // Source is newer, update
            await fs.copy(sourceFile, destFile, { overwrite: true });
          }
          // Otherwise, preserve user modifications
        }
      } else {
        // New file, copy it
        await fs.ensureDir(path.dirname(destFile));
        await fs.copy(sourceFile, destFile);
      }
    }

    // Remove files that no longer exist in source
    const destFiles = await this.getFileList(dest);
    for (const file of destFiles) {
      const sourceFile = path.join(source, file);
      const destFile = path.join(dest, file);

      if (!(await fs.pathExists(sourceFile))) {
        await fs.remove(destFile);
      }
    }
  }

  /**
   * Get list of all files in a directory
   * @param {string} dir - Directory path
   * @returns {Array} List of relative file paths
   */
  async getFileList(dir) {
    const files = [];

    if (!(await fs.pathExists(dir))) {
      return files;
    }

    const walk = async (currentDir, baseDir) => {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory() && !this.shouldIgnore(fullPath)) {
          await walk(fullPath, baseDir);
        } else if (entry.isFile() && !this.shouldIgnore(fullPath)) {
          files.push(path.relative(baseDir, fullPath));
        }
      }
    };

    await walk(dir, dir);
    return files;
  }

  /**
   * Get file hash for comparison
   * @param {string} filePath - File path
   * @returns {string} File hash
   */
  async getFileHash(filePath) {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  /**
   * Check if a path should be ignored
   * @param {string} filePath - Path to check
   * @returns {boolean} True if should be ignored
   */
  shouldIgnore(filePath) {
    const ignoredPatterns = ['.git', '.DS_Store', 'node_modules', '*.swp', '*.tmp', '.idea', '.vscode', '__pycache__', '*.pyc'];

    const basename = path.basename(filePath);

    for (const pattern of ignoredPatterns) {
      if (pattern.includes('*')) {
        // Simple glob pattern matching
        const regex = new RegExp(pattern.replace('*', '.*'));
        if (regex.test(basename)) {
          return true;
        }
      } else if (basename === pattern) {
        return true;
      }
    }

    return false;
  }

  /**
   * Ensure directory exists
   * @param {string} dir - Directory path
   */
  async ensureDir(dir) {
    await fs.ensureDir(dir);
  }

  /**
   * Remove directory or file
   * @param {string} targetPath - Path to remove
   */
  async remove(targetPath) {
    if (await fs.pathExists(targetPath)) {
      await fs.remove(targetPath);
    }
  }

  /**
   * Read file content
   * @param {string} filePath - File path
   * @returns {string} File content
   */
  async readFile(filePath) {
    return await fs.readFile(filePath, 'utf8');
  }

  /**
   * Write file content
   * @param {string} filePath - File path
   * @param {string} content - File content
   */
  async writeFile(filePath, content) {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
  }

  /**
   * Check if path exists
   * @param {string} targetPath - Path to check
   * @returns {boolean} True if exists
   */
  async exists(targetPath) {
    return await fs.pathExists(targetPath);
  }

  /**
   * Get file or directory stats
   * @param {string} targetPath - Path to check
   * @returns {Object} File stats
   */
  async stat(targetPath) {
    return await fs.stat(targetPath);
  }
}

module.exports = { FileOps };
