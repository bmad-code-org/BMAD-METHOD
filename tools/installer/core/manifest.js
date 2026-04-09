const path = require('node:path');
const fs = require('fs-extra');
const crypto = require('node:crypto');
const { getProjectRoot } = require('../project-root');
const prompts = require('../prompts');

class Manifest {
  /**
   * Create a new manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {Object} data - Manifest data
   * @param {Array} installedFiles - List of installed files (no longer used, files tracked in files-manifest.csv)
   */
  async create(bmadDir, data, installedFiles = []) {
    const manifestPath = path.join(bmadDir, '_config', 'manifest.yaml');
    const yaml = require('yaml');

    // Ensure _config directory exists
    await fs.ensureDir(path.dirname(manifestPath));

    // Get the BMad version from package.json
    const bmadVersion = data.version || require(path.join(process.cwd(), 'package.json')).version;

    // Convert module list to new detailed format
    const moduleDetails = [];
    if (data.modules && Array.isArray(data.modules)) {
      for (const moduleName of data.modules) {
        // Core and BMM modules use the BMad version
        const moduleVersion = moduleName === 'core' || moduleName === 'bmm' ? bmadVersion : null;
        const now = data.installDate || new Date().toISOString();

        moduleDetails.push({
          name: moduleName,
          version: moduleVersion,
          installDate: now,
          lastUpdated: now,
          source: moduleName === 'core' || moduleName === 'bmm' ? 'built-in' : 'unknown',
        });
      }
    }

    // Structure the manifest data
    const manifestData = {
      installation: {
        version: bmadVersion,
        installDate: data.installDate || new Date().toISOString(),
        lastUpdated: data.lastUpdated || new Date().toISOString(),
      },
      modules: moduleDetails,
      ides: data.ides || [],
    };

    // Write YAML manifest
    // Clean the manifest data to remove any non-serializable values
    const cleanManifestData = structuredClone(manifestData);

    const yamlContent = yaml.stringify(cleanManifestData, {
      indent: 2,
      lineWidth: 0,
      sortKeys: false,
    });

    // Ensure POSIX-compliant final newline
    const content = yamlContent.endsWith('\n') ? yamlContent : yamlContent + '\n';
    await fs.writeFile(manifestPath, content, 'utf8');
    return { success: true, path: manifestPath, filesTracked: 0 };
  }

  /**
   * Read existing manifest
   * @param {string} bmadDir - Path to bmad directory
   * @returns {Object|null} Manifest data or null if not found
   */
  async read(bmadDir) {
    const yamlPath = path.join(bmadDir, '_config', 'manifest.yaml');
    const yaml = require('yaml');

    if (await fs.pathExists(yamlPath)) {
      try {
        const content = await fs.readFile(yamlPath, 'utf8');
        const manifestData = yaml.parse(content);

        // Handle new detailed module format
        const modules = manifestData.modules || [];

        // For backward compatibility: if modules is an array of strings (old format),
        // the calling code may need the array of names
        const moduleNames = modules.map((m) => (typeof m === 'string' ? m : m.name));

        // Check if we have the new detailed format
        const hasDetailedModules = modules.length > 0 && typeof modules[0] === 'object';

        // Flatten the structure for compatibility with existing code
        return {
          version: manifestData.installation?.version,
          installDate: manifestData.installation?.installDate,
          lastUpdated: manifestData.installation?.lastUpdated,
          modules: moduleNames, // Simple array of module names for backward compatibility
          modulesDetailed: hasDetailedModules ? modules : null, // New detailed format
          ides: manifestData.ides || [],
        };
      } catch (error) {
        await prompts.log.error(`Failed to read YAML manifest: ${error.message}`);
      }
    }

    return null;
  }

  /**
   * Update existing manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {Object} updates - Fields to update
   * @param {Array} installedFiles - Updated list of installed files
   */
  async update(bmadDir, updates, installedFiles = null) {
    const yaml = require('yaml');
    const manifest = (await this._readRaw(bmadDir)) || {
      installation: {},
      modules: [],
      ides: [],
    };

    // Handle module updates
    if (updates.modules) {
      // If modules is being updated, we need to preserve detailed module info
      const existingDetailed = manifest.modules || [];
      const incomingNames = updates.modules;

      // Build updated modules array
      const updatedModules = [];
      for (const name of incomingNames) {
        const existing = existingDetailed.find((m) => m.name === name);
        if (existing) {
          // Preserve existing details, update lastUpdated if this module is being updated
          updatedModules.push({
            ...existing,
            lastUpdated: new Date().toISOString(),
          });
        } else {
          // New module - add with minimal details
          updatedModules.push({
            name,
            version: null,
            installDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            source: 'unknown',
          });
        }
      }

      manifest.modules = updatedModules;
    }

    // Merge other updates
    if (updates.version) {
      manifest.installation.version = updates.version;
    }
    if (updates.installDate) {
      manifest.installation.installDate = updates.installDate;
    }
    manifest.installation.lastUpdated = new Date().toISOString();

    if (updates.ides) {
      manifest.ides = updates.ides;
    }

    // Handle per-module version updates
    if (updates.moduleVersions) {
      for (const [moduleName, versionInfo] of Object.entries(updates.moduleVersions)) {
        const moduleIndex = manifest.modules.findIndex((m) => m.name === moduleName);
        if (moduleIndex !== -1) {
          manifest.modules[moduleIndex] = {
            ...manifest.modules[moduleIndex],
            ...versionInfo,
            lastUpdated: new Date().toISOString(),
          };
        }
      }
    }

    // Handle adding a new module with version info
    if (updates.addModule) {
      const { name, version, source, npmPackage, repoUrl, localPath } = updates.addModule;
      const existing = manifest.modules.find((m) => m.name === name);
      if (!existing) {
        const entry = {
          name,
          version: version || null,
          installDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          source: source || 'external',
          npmPackage: npmPackage || null,
          repoUrl: repoUrl || null,
        };
        if (localPath) entry.localPath = localPath;
        manifest.modules.push(entry);
      }
    }

    const manifestPath = path.join(bmadDir, '_config', 'manifest.yaml');
    await fs.ensureDir(path.dirname(manifestPath));

    // Clean the manifest data to remove any non-serializable values
    const cleanManifestData = structuredClone(manifest);

    const yamlContent = yaml.stringify(cleanManifestData, {
      indent: 2,
      lineWidth: 0,
      sortKeys: false,
    });

    // Ensure POSIX-compliant final newline
    const content = yamlContent.endsWith('\n') ? yamlContent : yamlContent + '\n';
    await fs.writeFile(manifestPath, content, 'utf8');

    // Return the flattened format for compatibility
    return this._flattenManifest(manifest);
  }

  /**
   * Read raw manifest data without flattening
   * @param {string} bmadDir - Path to bmad directory
   * @returns {Object|null} Raw manifest data or null if not found
   */
  async _readRaw(bmadDir) {
    const yamlPath = path.join(bmadDir, '_config', 'manifest.yaml');
    const yaml = require('yaml');

    if (await fs.pathExists(yamlPath)) {
      try {
        const content = await fs.readFile(yamlPath, 'utf8');
        return yaml.parse(content);
      } catch (error) {
        await prompts.log.error(`Failed to read YAML manifest: ${error.message}`);
      }
    }

    return null;
  }

  /**
   * Flatten manifest for backward compatibility
   * @param {Object} manifest - Raw manifest data
   * @returns {Object} Flattened manifest
   */
  _flattenManifest(manifest) {
    const modules = manifest.modules || [];
    const moduleNames = modules.map((m) => (typeof m === 'string' ? m : m.name));
    const hasDetailedModules = modules.length > 0 && typeof modules[0] === 'object';

    return {
      version: manifest.installation?.version,
      installDate: manifest.installation?.installDate,
      lastUpdated: manifest.installation?.lastUpdated,
      modules: moduleNames,
      modulesDetailed: hasDetailedModules ? modules : null,
      ides: manifest.ides || [],
    };
  }

  /**
   * Add a module to the manifest with optional version info
   * If module already exists, update its version info
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} moduleName - Module name to add
   * @param {Object} options - Optional version info
   */
  async addModule(bmadDir, moduleName, options = {}) {
    let manifest = await this._readRaw(bmadDir);
    if (!manifest) {
      // Bootstrap a minimal manifest if it doesn't exist yet
      // (e.g., skill-only modules with no agents to compile)
      manifest = { modules: [] };
    }

    if (!manifest.modules) {
      manifest.modules = [];
    }

    const existingIndex = manifest.modules.findIndex((m) => m.name === moduleName);

    if (existingIndex === -1) {
      // Module doesn't exist, add it
      const entry = {
        name: moduleName,
        version: options.version || null,
        installDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        source: options.source || 'unknown',
        npmPackage: options.npmPackage || null,
        repoUrl: options.repoUrl || null,
      };
      if (options.localPath) entry.localPath = options.localPath;
      manifest.modules.push(entry);
    } else {
      // Module exists, update its version info
      const existing = manifest.modules[existingIndex];
      manifest.modules[existingIndex] = {
        ...existing,
        version: options.version === undefined ? existing.version : options.version,
        source: options.source || existing.source,
        npmPackage: options.npmPackage === undefined ? existing.npmPackage : options.npmPackage,
        repoUrl: options.repoUrl === undefined ? existing.repoUrl : options.repoUrl,
        localPath: options.localPath === undefined ? existing.localPath : options.localPath,
        lastUpdated: new Date().toISOString(),
      };
    }

    await this._writeRaw(bmadDir, manifest);
  }

  /**
   * Remove a module from the manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} moduleName - Module name to remove
   */
  async removeModule(bmadDir, moduleName) {
    const manifest = await this._readRaw(bmadDir);
    if (!manifest || !manifest.modules) {
      return;
    }

    const index = manifest.modules.findIndex((m) => m.name === moduleName);
    if (index !== -1) {
      manifest.modules.splice(index, 1);
      await this._writeRaw(bmadDir, manifest);
    }
  }

  /**
   * Update a single module's version info
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} moduleName - Module name
   * @param {Object} versionInfo - Version info to update
   */
  async updateModuleVersion(bmadDir, moduleName, versionInfo) {
    const manifest = await this._readRaw(bmadDir);
    if (!manifest || !manifest.modules) {
      return;
    }

    const index = manifest.modules.findIndex((m) => m.name === moduleName);
    if (index !== -1) {
      manifest.modules[index] = {
        ...manifest.modules[index],
        ...versionInfo,
        lastUpdated: new Date().toISOString(),
      };
      await this._writeRaw(bmadDir, manifest);
    }
  }

  /**
   * Get version info for a specific module
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} moduleName - Module name
   * @returns {Object|null} Module version info or null
   */
  async getModuleVersion(bmadDir, moduleName) {
    const manifest = await this._readRaw(bmadDir);
    if (!manifest || !manifest.modules) {
      return null;
    }

    return manifest.modules.find((m) => m.name === moduleName) || null;
  }

  /**
   * Get all modules with their version info
   * @param {string} bmadDir - Path to bmad directory
   * @returns {Array} Array of module info objects
   */
  async getAllModuleVersions(bmadDir) {
    const manifest = await this._readRaw(bmadDir);
    if (!manifest || !manifest.modules) {
      return [];
    }

    return manifest.modules;
  }

  /**
   * Write raw manifest data to file
   * @param {string} bmadDir - Path to bmad directory
   * @param {Object} manifestData - Raw manifest data to write
   */
  async _writeRaw(bmadDir, manifestData) {
    const yaml = require('yaml');
    const manifestPath = path.join(bmadDir, '_config', 'manifest.yaml');

    await fs.ensureDir(path.dirname(manifestPath));

    const cleanManifestData = structuredClone(manifestData);

    const yamlContent = yaml.stringify(cleanManifestData, {
      indent: 2,
      lineWidth: 0,
      sortKeys: false,
    });

    const content = yamlContent.endsWith('\n') ? yamlContent : yamlContent + '\n';
    await fs.writeFile(manifestPath, content, 'utf8');
  }

  /**
   * Add an IDE configuration to the manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} ideName - IDE name to add
   */
  async addIde(bmadDir, ideName) {
    const manifest = await this.read(bmadDir);
    if (!manifest) {
      throw new Error('No manifest found');
    }

    if (!manifest.ides) {
      manifest.ides = [];
    }

    if (!manifest.ides.includes(ideName)) {
      manifest.ides.push(ideName);
      await this.update(bmadDir, { ides: manifest.ides });
    }
  }

  /**
   * Calculate SHA256 hash of a file
   * @param {string} filePath - Path to file
   * @returns {string} SHA256 hash
   */
  async calculateFileHash(filePath) {
    try {
      const content = await fs.readFile(filePath);
      return crypto.createHash('sha256').update(content).digest('hex');
    } catch {
      return null;
    }
  }

  /**
   * Parse installed files to extract metadata
   * @param {Array} installedFiles - List of installed file paths
   * @param {string} bmadDir - Path to bmad directory for relative paths
   * @returns {Array} Array of file metadata objects
   */
  async parseInstalledFiles(installedFiles, bmadDir) {
    const fileMetadata = [];

    for (const filePath of installedFiles) {
      const fileExt = path.extname(filePath).toLowerCase();
      // Make path relative to parent of bmad directory, starting with 'bmad/'
      const relativePath = 'bmad' + filePath.replace(bmadDir, '').replaceAll('\\', '/');

      // Calculate file hash
      const hash = await this.calculateFileHash(filePath);

      // Handle markdown files - extract XML metadata if present
      if (fileExt === '.md') {
        try {
          if (await fs.pathExists(filePath)) {
            const content = await fs.readFile(filePath, 'utf8');
            const metadata = this.extractXmlNodeAttributes(content, filePath, relativePath);

            if (metadata) {
              // Has XML metadata
              metadata.hash = hash;
              fileMetadata.push(metadata);
            } else {
              // No XML metadata - still track the file
              fileMetadata.push({
                file: relativePath,
                type: 'md',
                name: path.basename(filePath, fileExt),
                title: null,
                hash: hash,
              });
            }
          }
        } catch (error) {
          await prompts.log.warn(`Could not parse ${filePath}: ${error.message}`);
        }
      }
      // Handle other file types (CSV, JSON, YAML, etc.)
      else {
        fileMetadata.push({
          file: relativePath,
          type: fileExt.slice(1), // Remove the dot
          name: path.basename(filePath, fileExt),
          title: null,
          hash: hash,
        });
      }
    }

    return fileMetadata;
  }

  /**
   * Extract XML node attributes from MD file content
   * @param {string} content - File content
   * @param {string} filePath - File path for context
   * @param {string} relativePath - Relative path starting with 'bmad/'
   * @returns {Object|null} Extracted metadata or null
   */
  extractXmlNodeAttributes(content, filePath, relativePath) {
    // Look for XML blocks in code fences
    const xmlBlockMatch = content.match(/```xml\s*([\s\S]*?)```/);
    if (!xmlBlockMatch) {
      return null;
    }

    const xmlContent = xmlBlockMatch[1];

    // Extract root XML node (agent, task, template, etc.)
    const rootNodeMatch = xmlContent.match(/<(\w+)([^>]*)>/);
    if (!rootNodeMatch) {
      return null;
    }

    const nodeType = rootNodeMatch[1];
    const attributes = rootNodeMatch[2];

    // Extract name and title attributes (id not needed since we have path)
    const nameMatch = attributes.match(/name="([^"]*)"/);
    const titleMatch = attributes.match(/title="([^"]*)"/);

    return {
      file: relativePath,
      type: nodeType,
      name: nameMatch ? nameMatch[1] : null,
      title: titleMatch ? titleMatch[1] : null,
    };
  }

  /**
   * Generate CSV manifest content
   * @param {Object} data - Manifest data
   * @param {Array} fileMetadata - File metadata array
   * @param {Object} moduleConfigs - Module configuration data
   * @returns {string} CSV content
   */
  generateManifestCsv(data, fileMetadata, moduleConfigs = {}) {
    const timestamp = new Date().toISOString();
    let csv = [];

    // Header section
    csv.push(
      '# BMAD Manifest',
      `# Generated: ${timestamp}`,
      '',
      '## Installation Info',
      'Property,Value',
      `Version,${data.version}`,
      `InstallDate,${data.installDate || timestamp}`,
      `LastUpdated,${data.lastUpdated || timestamp}`,
    );
    if (data.language) {
      csv.push(`Language,${data.language}`);
    }
    csv.push('');

    // Modules section
    if (data.modules && data.modules.length > 0) {
      csv.push('## Modules', 'Name,Version,ShortTitle');
      for (const moduleName of data.modules) {
        const config = moduleConfigs[moduleName] || {};
        csv.push([moduleName, config.version || '', config['short-title'] || ''].map((v) => this.escapeCsv(v)).join(','));
      }
      csv.push('');
    }

    // IDEs section
    if (data.ides && data.ides.length > 0) {
      csv.push('## IDEs', 'IDE');
      for (const ide of data.ides) {
        csv.push(this.escapeCsv(ide));
      }
      csv.push('');
    }

    // Files section - NO LONGER USED
    // Files are now tracked in files-manifest.csv by ManifestGenerator

    return csv.join('\n');
  }

  /**
   * Parse CSV manifest content back to object
   * @param {string} csvContent - CSV content to parse
   * @returns {Object} Parsed manifest data
   */
  parseManifestCsv(csvContent) {
    const result = {
      modules: [],
      ides: [],
      files: [],
    };

    const lines = csvContent.split('\n');
    let section = '';

    for (const line_ of lines) {
      const line = line_.trim();

      // Skip empty lines and comments
      if (!line || line.startsWith('#')) {
        // Check for section headers
        if (line.startsWith('## ')) {
          section = line.slice(3).toLowerCase();
        }
        continue;
      }

      // Parse based on current section
      switch (section) {
        case 'installation info': {
          // Skip header row
          if (line === 'Property,Value') continue;

          const [property, ...valueParts] = line.split(',');
          const value = this.unescapeCsv(valueParts.join(','));

          switch (property) {
            // Path no longer stored in manifest
            case 'Version': {
              result.version = value;
              break;
            }
            case 'InstallDate': {
              result.installDate = value;
              break;
            }
            case 'LastUpdated': {
              result.lastUpdated = value;
              break;
            }
            case 'Language': {
              result.language = value;
              break;
            }
          }

          break;
        }
        case 'modules': {
          // Skip header row
          if (line === 'Name,Version,ShortTitle') continue;

          const parts = this.parseCsvLine(line);
          if (parts[0]) {
            result.modules.push(parts[0]);
          }

          break;
        }
        case 'ides': {
          // Skip header row
          if (line === 'IDE') continue;

          result.ides.push(this.unescapeCsv(line));

          break;
        }
        case 'files': {
          // Skip header rows (support both old and new format)
          if (line === 'Type,Path,Name,Title' || line === 'Type,Path,Name,Title,Hash') continue;

          const parts = this.parseCsvLine(line);
          if (parts.length >= 2) {
            result.files.push({
              type: parts[0] || '',
              file: parts[1] || '',
              name: parts[2] || null,
              title: parts[3] || null,
              hash: parts[4] || null, // Hash column (may not exist in old manifests)
            });
          }

          break;
        }
        // No default
      }
    }

    return result;
  }

  /**
   * Parse a CSV line handling quotes and commas
   * @param {string} line - CSV line to parse
   * @returns {Array} Array of values
   */
  parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(this.unescapeCsv(current));
        current = '';
      } else {
        current += char;
      }
    }

    // Add the last field
    result.push(this.unescapeCsv(current));

    return result;
  }

  /**
   * Escape CSV special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeCsv(text) {
    if (!text) return '';
    const str = String(text);

    // If contains comma, newline, or quote, wrap in quotes and escape quotes
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return '"' + str.replaceAll('"', '""') + '"';
    }

    return str;
  }

  /**
   * Unescape CSV field
   * @param {string} text - Text to unescape
   * @returns {string} Unescaped text
   */
  unescapeCsv(text) {
    if (!text) return '';

    // Remove surrounding quotes if present
    if (text.startsWith('"') && text.endsWith('"')) {
      text = text.slice(1, -1);
      // Unescape doubled quotes
      text = text.replaceAll('""', '"');
    }

    return text;
  }

  /**
   * Load module configuration files
   * @param {Array} modules - List of module names
   * @returns {Object} Module configurations indexed by name
   */
  async loadModuleConfigs(modules) {
    const configs = {};

    for (const moduleName of modules) {
      // Handle core module differently - it's in src/core-skills not src/modules/core
      const configPath =
        moduleName === 'core'
          ? path.join(process.cwd(), 'src', 'core-skills', 'config.yaml')
          : path.join(process.cwd(), 'src', 'modules', moduleName, 'config.yaml');

      try {
        if (await fs.pathExists(configPath)) {
          const yaml = require('yaml');
          const content = await fs.readFile(configPath, 'utf8');
          configs[moduleName] = yaml.parse(content);
        }
      } catch (error) {
        await prompts.log.warn(`Could not load config for module ${moduleName}: ${error.message}`);
      }
    }

    return configs;
  }
  /**
   * Get module version info from source
   * @param {string} moduleName - Module name/code
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} moduleSourcePath - Optional source path for custom modules
   * @returns {Object} Version info object with version, source, npmPackage, repoUrl
   */
  async getModuleVersionInfo(moduleName, bmadDir, moduleSourcePath = null) {
    const yaml = require('yaml');

    // Resolve source type first, then read version with the correct path context
    if (['core', 'bmm'].includes(moduleName)) {
      const version = await this._readMarketplaceVersion(moduleName, moduleSourcePath);
      return {
        version,
        source: 'built-in',
        npmPackage: null,
        repoUrl: null,
      };
    }

    // Check if this is an external official module
    const { ExternalModuleManager } = require('../modules/external-manager');
    const extMgr = new ExternalModuleManager();
    const moduleInfo = await extMgr.getModuleByCode(moduleName);

    if (moduleInfo) {
      // External module: use moduleSourcePath if provided, otherwise fall back to cache
      const version = await this._readMarketplaceVersion(moduleName, moduleSourcePath);
      return {
        version,
        source: 'external',
        npmPackage: moduleInfo.npmPackage || null,
        repoUrl: moduleInfo.url || null,
      };
    }

    // Check if this is a community module
    const { CommunityModuleManager } = require('../modules/community-manager');
    const communityMgr = new CommunityModuleManager();
    const communityInfo = await communityMgr.getModuleByCode(moduleName);
    if (communityInfo) {
      const communityVersion = await this._readMarketplaceVersion(moduleName, moduleSourcePath);
      return {
        version: communityVersion || communityInfo.version,
        source: 'community',
        npmPackage: communityInfo.npmPackage || null,
        repoUrl: communityInfo.url || null,
      };
    }

    // Check if this is a custom module (from user-provided URL or local path)
    const { CustomModuleManager } = require('../modules/custom-module-manager');
    const customMgr = new CustomModuleManager();
    const resolved = customMgr.getResolution(moduleName);
    const customSource = await customMgr.findModuleSourceByCode(moduleName, { bmadDir });
    if (customSource || resolved) {
      const customVersion = resolved?.version || (await this._readMarketplaceVersion(moduleName, moduleSourcePath));
      return {
        version: customVersion,
        source: 'custom',
        npmPackage: null,
        repoUrl: resolved?.repoUrl || null,
        localPath: resolved?.localPath || null,
      };
    }

    // Unknown module
    const version = await this._readMarketplaceVersion(moduleName, moduleSourcePath);
    return {
      version,
      source: 'unknown',
      npmPackage: null,
      repoUrl: null,
    };
  }

  /**
   * Read version from .claude-plugin/marketplace.json for a module
   * @param {string} moduleName - Module code
   * @returns {string|null} Version or null
   */
  async _readMarketplaceVersion(moduleName, moduleSourcePath = null) {
    const os = require('node:os');
    let marketplacePath;

    if (['core', 'bmm'].includes(moduleName)) {
      marketplacePath = path.join(getProjectRoot(), '.claude-plugin', 'marketplace.json');
    } else if (moduleSourcePath) {
      // Walk up from source path to find marketplace.json
      let dir = moduleSourcePath;
      for (let i = 0; i < 5; i++) {
        const candidate = path.join(dir, '.claude-plugin', 'marketplace.json');
        if (await fs.pathExists(candidate)) {
          marketplacePath = candidate;
          break;
        }
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
      }
    }

    // Fallback to external module cache
    if (!marketplacePath) {
      const cacheDir = path.join(os.homedir(), '.bmad', 'cache', 'external-modules', moduleName);
      marketplacePath = path.join(cacheDir, '.claude-plugin', 'marketplace.json');
    }

    try {
      if (await fs.pathExists(marketplacePath)) {
        const data = JSON.parse(await fs.readFile(marketplacePath, 'utf8'));
        const plugins = data?.plugins;
        if (!Array.isArray(plugins) || plugins.length === 0) return null;
        let best = null;
        for (const p of plugins) {
          if (p.version && (!best || p.version > best)) best = p.version;
        }
        return best;
      }
    } catch {
      // ignore
    }
    return null;
  }

  /**
   * Fetch latest version from npm for a package
   * @param {string} packageName - npm package name
   * @returns {string|null} Latest version or null
   */
  async fetchNpmVersion(packageName) {
    try {
      const https = require('node:https');
      const { execSync } = require('node:child_process');

      // Try using npm view first (more reliable)
      try {
        const result = execSync(`npm view ${packageName} version`, {
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 10_000,
        });
        return result.trim();
      } catch {
        // Fallback to npm registry API
        return new Promise((resolve, reject) => {
          https
            .get(`https://registry.npmjs.org/${packageName}`, (res) => {
              let data = '';
              res.on('data', (chunk) => (data += chunk));
              res.on('end', () => {
                try {
                  const pkg = JSON.parse(data);
                  resolve(pkg['dist-tags']?.latest || pkg.version || null);
                } catch {
                  resolve(null);
                }
              });
            })
            .on('error', () => resolve(null));
        });
      }
    } catch {
      return null;
    }
  }

  /**
   * Check for available updates for installed modules
   * @param {string} bmadDir - Path to bmad directory
   * @returns {Array} Array of update info objects
   */
  async checkForUpdates(bmadDir) {
    const modules = await this.getAllModuleVersions(bmadDir);
    const updates = [];

    for (const module of modules) {
      if (!module.npmPackage) {
        continue; // Skip modules without npm package (built-in)
      }

      const latestVersion = await this.fetchNpmVersion(module.npmPackage);
      if (!latestVersion) {
        continue;
      }

      if (module.version !== latestVersion) {
        updates.push({
          name: module.name,
          installedVersion: module.version,
          latestVersion: latestVersion,
          npmPackage: module.npmPackage,
          updateAvailable: true,
        });
      }
    }

    return updates;
  }

  /**
   * Compare two semantic versions
   * @param {string} v1 - First version
   * @param {string} v2 - Second version
   * @returns {number} -1 if v1 < v2, 0 if v1 == v2, 1 if v1 > v2
   */
  compareVersions(v1, v2) {
    if (!v1 || !v2) return 0;

    const normalize = (v) => {
      // Remove leading 'v' if present
      v = v.replace(/^v/, '');
      // Handle prerelease tags
      const parts = v.split('-');
      const main = parts[0].split('.');
      const prerelease = parts[1];
      return { main, prerelease };
    };

    const n1 = normalize(v1);
    const n2 = normalize(v2);

    // Compare main version parts
    for (let i = 0; i < 3; i++) {
      const num1 = parseInt(n1.main[i] || '0', 10);
      const num2 = parseInt(n2.main[i] || '0', 10);
      if (num1 !== num2) {
        return num1 < num2 ? -1 : 1;
      }
    }

    // If main versions are equal, compare prerelease
    if (n1.prerelease && n2.prerelease) {
      return n1.prerelease < n2.prerelease ? -1 : n1.prerelease > n2.prerelease ? 1 : 0;
    }
    if (n1.prerelease) return -1; // Prerelease is older than stable
    if (n2.prerelease) return 1; // Stable is newer than prerelease

    return 0;
  }
}

module.exports = { Manifest };
