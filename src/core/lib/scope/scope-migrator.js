const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');

/**
 * Migrates existing artifacts to scoped structure
 * Handles migration of legacy non-scoped installations
 *
 * @class ScopeMigrator
 * @requires fs-extra
 * @requires yaml
 *
 * @example
 * const migrator = new ScopeMigrator({ projectRoot: '/path/to/project' });
 * await migrator.migrate();
 */
class ScopeMigrator {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.outputBase = options.outputBase || '_bmad-output';
    this.bmadPath = path.join(this.projectRoot, '_bmad');
    this.outputPath = path.join(this.projectRoot, this.outputBase);
    this.defaultScopeId = options.defaultScopeId || 'default';
  }

  /**
   * Set the project root directory
   * @param {string} projectRoot - The project root path
   */
  setProjectRoot(projectRoot) {
    this.projectRoot = projectRoot;
    this.bmadPath = path.join(projectRoot, '_bmad');
    this.outputPath = path.join(projectRoot, this.outputBase);
  }

  /**
   * Check if migration is needed
   * Returns true if there are artifacts in non-scoped locations
   * @returns {Promise<boolean>} True if migration needed
   */
  async needsMigration() {
    try {
      // Check if output directory exists
      if (!(await fs.pathExists(this.outputPath))) {
        return false;
      }

      // Check for legacy structure indicators
      const hasLegacyPlanning = await fs.pathExists(path.join(this.outputPath, 'planning-artifacts'));
      const hasLegacyImplementation = await fs.pathExists(path.join(this.outputPath, 'implementation-artifacts'));

      // Check if already migrated (scopes.yaml exists and has scopes)
      const scopesYamlPath = path.join(this.bmadPath, '_config', 'scopes.yaml');
      if (await fs.pathExists(scopesYamlPath)) {
        const content = await fs.readFile(scopesYamlPath, 'utf8');
        const config = yaml.parse(content);
        if (config.scopes && Object.keys(config.scopes).length > 0) {
          // Already has scopes, check if legacy directories still exist alongside
          return hasLegacyPlanning || hasLegacyImplementation;
        }
      }

      return hasLegacyPlanning || hasLegacyImplementation;
    } catch {
      return false;
    }
  }

  /**
   * Analyze existing artifacts for migration
   * @returns {Promise<object>} Analysis results
   */
  async analyzeExisting() {
    const analysis = {
      hasLegacyArtifacts: false,
      directories: [],
      files: [],
      totalSize: 0,
      suggestedScope: this.defaultScopeId,
    };

    try {
      // Check for legacy directories
      const legacyDirs = ['planning-artifacts', 'implementation-artifacts', 'tests'];

      for (const dir of legacyDirs) {
        const dirPath = path.join(this.outputPath, dir);
        if (await fs.pathExists(dirPath)) {
          analysis.hasLegacyArtifacts = true;
          analysis.directories.push(dir);

          // Count files and size
          const stats = await this.getDirStats(dirPath);
          analysis.files.push(...stats.files);
          analysis.totalSize += stats.size;
        }
      }

      // Check for root-level artifacts
      const rootFiles = ['project-context.md', 'sprint-status.yaml', 'bmm-workflow-status.yaml'];
      for (const file of rootFiles) {
        const filePath = path.join(this.outputPath, file);
        if (await fs.pathExists(filePath)) {
          analysis.hasLegacyArtifacts = true;
          const stat = await fs.stat(filePath);
          analysis.files.push(file);
          analysis.totalSize += stat.size;
        }
      }
    } catch (error) {
      throw new Error(`Failed to analyze existing artifacts: ${error.message}`);
    }

    return analysis;
  }

  /**
   * Get directory statistics recursively
   * @param {string} dirPath - Directory path
   * @returns {Promise<object>} Stats object with files and size
   */
  async getDirStats(dirPath) {
    const stats = { files: [], size: 0 };

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          const subStats = await this.getDirStats(fullPath);
          stats.files.push(...subStats.files.map((f) => path.join(entry.name, f)));
          stats.size += subStats.size;
        } else {
          stats.files.push(entry.name);
          const fileStat = await fs.stat(fullPath);
          stats.size += fileStat.size;
        }
      }
    } catch {
      // Ignore permission errors
    }

    return stats;
  }

  /**
   * Create backup of existing artifacts
   * @returns {Promise<string>} Backup directory path
   */
  async createBackup() {
    const backupName = `_backup_migration_${Date.now()}`;
    const backupPath = path.join(this.outputPath, backupName);

    try {
      await fs.ensureDir(backupPath);

      // Copy legacy directories
      const legacyDirs = ['planning-artifacts', 'implementation-artifacts', 'tests'];
      for (const dir of legacyDirs) {
        const sourcePath = path.join(this.outputPath, dir);
        if (await fs.pathExists(sourcePath)) {
          await fs.copy(sourcePath, path.join(backupPath, dir));
        }
      }

      // Copy root-level files
      const rootFiles = ['project-context.md', 'sprint-status.yaml', 'bmm-workflow-status.yaml'];
      for (const file of rootFiles) {
        const sourcePath = path.join(this.outputPath, file);
        if (await fs.pathExists(sourcePath)) {
          await fs.copy(sourcePath, path.join(backupPath, file));
        }
      }

      return backupPath;
    } catch (error) {
      throw new Error(`Failed to create backup: ${error.message}`);
    }
  }

  /**
   * Migrate existing artifacts to default scope
   * @param {object} options - Migration options
   * @returns {Promise<object>} Migration result
   */
  async migrate(options = {}) {
    const scopeId = options.scopeId || this.defaultScopeId;
    const createBackup = options.backup !== false;

    const result = {
      success: false,
      scopeId,
      backupPath: null,
      migratedFiles: [],
      errors: [],
    };

    try {
      // Check if migration is needed
      const needsMigration = await this.needsMigration();
      if (!needsMigration) {
        result.success = true;
        result.message = 'No migration needed';
        return result;
      }

      // Create backup
      if (createBackup) {
        result.backupPath = await this.createBackup();
      }

      // Create scope directory structure
      const scopePath = path.join(this.outputPath, scopeId);
      const scopeDirs = {
        planning: path.join(scopePath, 'planning-artifacts'),
        implementation: path.join(scopePath, 'implementation-artifacts'),
        tests: path.join(scopePath, 'tests'),
      };

      for (const dir of Object.values(scopeDirs)) {
        await fs.ensureDir(dir);
      }

      // Move legacy directories
      const migrations = [
        { from: 'planning-artifacts', to: scopeDirs.planning },
        { from: 'implementation-artifacts', to: scopeDirs.implementation },
        { from: 'tests', to: scopeDirs.tests },
      ];

      for (const migration of migrations) {
        const sourcePath = path.join(this.outputPath, migration.from);
        if (await fs.pathExists(sourcePath)) {
          // Copy contents to scope directory
          const entries = await fs.readdir(sourcePath, { withFileTypes: true });
          for (const entry of entries) {
            const sourceFile = path.join(sourcePath, entry.name);
            const targetFile = path.join(migration.to, entry.name);

            // Skip if target already exists
            if (await fs.pathExists(targetFile)) {
              result.errors.push(`Skipped ${entry.name}: already exists in target`);
              continue;
            }

            await fs.copy(sourceFile, targetFile);
            result.migratedFiles.push(path.join(migration.from, entry.name));
          }

          // Remove original directory
          await fs.remove(sourcePath);
        }
      }

      // Handle root-level files
      const rootFileMigrations = [
        { from: 'project-context.md', to: path.join(scopePath, 'project-context.md') },
        { from: 'sprint-status.yaml', to: path.join(scopeDirs.implementation, 'sprint-status.yaml') },
        { from: 'bmm-workflow-status.yaml', to: path.join(scopeDirs.planning, 'bmm-workflow-status.yaml') },
      ];

      for (const migration of rootFileMigrations) {
        const sourcePath = path.join(this.outputPath, migration.from);
        if (await fs.pathExists(sourcePath)) {
          if (await fs.pathExists(migration.to)) {
            result.errors.push(`Skipped ${migration.from}: already exists in target`);
            await fs.remove(sourcePath);
          } else {
            await fs.move(sourcePath, migration.to);
            result.migratedFiles.push(migration.from);
          }
        }
      }

      // Create scope metadata
      const metaPath = path.join(scopePath, '.scope-meta.yaml');
      const metadata = {
        scope_id: scopeId,
        migrated: true,
        migrated_at: new Date().toISOString(),
        original_backup: result.backupPath,
        version: 1,
      };
      await fs.writeFile(metaPath, yaml.stringify(metadata), 'utf8');

      // Create scope README
      const readmePath = path.join(scopePath, 'README.md');
      if (!(await fs.pathExists(readmePath))) {
        const readme = this.generateMigrationReadme(scopeId, result.migratedFiles.length);
        await fs.writeFile(readmePath, readme, 'utf8');
      }

      result.success = true;
      result.message = `Migrated ${result.migratedFiles.length} items to scope '${scopeId}'`;
    } catch (error) {
      result.success = false;
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Generate README for migrated scope
   * @param {string} scopeId - The scope ID
   * @param {number} fileCount - Number of migrated files
   * @returns {string} README content
   */
  generateMigrationReadme(scopeId, fileCount) {
    return `# Scope: ${scopeId}

This scope was automatically created during migration from the legacy (non-scoped) structure.

## Migration Details

- **Migrated At:** ${new Date().toISOString()}
- **Files Migrated:** ${fileCount}

## Directory Structure

- **planning-artifacts/** - Planning documents, PRDs, specifications
- **implementation-artifacts/** - Sprint status, development artifacts
- **tests/** - Test files and results

## Next Steps

1. Review the migrated artifacts
2. Update any hardcoded paths in your workflows
3. Consider creating additional scopes for different components

## Usage

\`\`\`bash
# Work in this scope
bmad workflow --scope ${scopeId}

# View scope details
bmad scope info ${scopeId}
\`\`\`
`;
  }

  /**
   * Rollback migration using backup
   * @param {string} backupPath - Path to backup directory
   * @returns {Promise<boolean>} Success status
   */
  async rollback(backupPath) {
    try {
      if (!(await fs.pathExists(backupPath))) {
        throw new Error(`Backup not found at: ${backupPath}`);
      }

      // Restore backed up directories
      const entries = await fs.readdir(backupPath, { withFileTypes: true });

      for (const entry of entries) {
        const sourcePath = path.join(backupPath, entry.name);
        const targetPath = path.join(this.outputPath, entry.name);

        // Remove current version if exists
        if (await fs.pathExists(targetPath)) {
          await fs.remove(targetPath);
        }

        // Restore from backup
        await fs.copy(sourcePath, targetPath);
      }

      // Remove backup after successful restore
      await fs.remove(backupPath);

      return true;
    } catch (error) {
      throw new Error(`Failed to rollback: ${error.message}`);
    }
  }

  /**
   * Update references in state files after migration
   * @param {string} scopeId - The scope ID
   * @returns {Promise<object>} Update result
   */
  async updateReferences(scopeId) {
    const result = { updated: [], errors: [] };

    const scopePath = path.join(this.outputPath, scopeId);

    // Files that might contain path references
    const filesToUpdate = [
      path.join(scopePath, 'implementation-artifacts', 'sprint-status.yaml'),
      path.join(scopePath, 'planning-artifacts', 'bmm-workflow-status.yaml'),
    ];

    for (const filePath of filesToUpdate) {
      if (await fs.pathExists(filePath)) {
        try {
          let content = await fs.readFile(filePath, 'utf8');

          // Update common path patterns
          const patterns = [
            { from: /planning-artifacts\//g, to: `${scopeId}/planning-artifacts/` },
            { from: /implementation-artifacts\//g, to: `${scopeId}/implementation-artifacts/` },
            { from: /tests\//g, to: `${scopeId}/tests/` },
          ];

          let modified = false;
          for (const pattern of patterns) {
            if (
              pattern.from.test(content) && // Only update if not already scoped
              !content.includes(`${scopeId}/`)
            ) {
              content = content.replace(pattern.from, pattern.to);
              modified = true;
            }
          }

          if (modified) {
            await fs.writeFile(filePath, content, 'utf8');
            result.updated.push(filePath);
          }
        } catch (error) {
          result.errors.push(`Failed to update ${filePath}: ${error.message}`);
        }
      }
    }

    return result;
  }
}

module.exports = { ScopeMigrator };
