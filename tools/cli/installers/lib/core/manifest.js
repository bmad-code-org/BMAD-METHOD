const path = require('node:path');
const fs = require('fs-extra');
const crypto = require('node:crypto');

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

    // Structure the manifest data
    const manifestData = {
      installation: {
        version: data.version || require(path.join(process.cwd(), 'package.json')).version,
        installDate: data.installDate || new Date().toISOString(),
        lastUpdated: data.lastUpdated || new Date().toISOString(),
      },
      modules: data.modules || [],
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

        // Flatten the structure for compatibility with existing code
        return {
          version: manifestData.installation?.version,
          installDate: manifestData.installation?.installDate,
          lastUpdated: manifestData.installation?.lastUpdated,
          modules: manifestData.modules || [], // All modules (standard and custom)
          customModules: manifestData.customModules || [], // Keep for backward compatibility
          ides: manifestData.ides || [],
        };
      } catch (error) {
        console.error('Failed to read YAML manifest:', error.message);
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
    const manifest = (await this.read(bmadDir)) || {};

    // Merge updates
    Object.assign(manifest, updates);
    manifest.lastUpdated = new Date().toISOString();

    // Convert back to structured format for YAML
    const manifestData = {
      installation: {
        version: manifest.version,
        installDate: manifest.installDate,
        lastUpdated: manifest.lastUpdated,
      },
      modules: manifest.modules || [], // All modules (standard and custom)
      ides: manifest.ides || [],
    };

    const manifestPath = path.join(bmadDir, '_config', 'manifest.yaml');
    await fs.ensureDir(path.dirname(manifestPath));

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

    return manifest;
  }

  /**
   * Add a module to the manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} moduleName - Module name to add
   */
  async addModule(bmadDir, moduleName) {
    const manifest = await this.read(bmadDir);
    if (!manifest) {
      throw new Error('No manifest found');
    }

    if (!manifest.modules) {
      manifest.modules = [];
    }

    if (!manifest.modules.includes(moduleName)) {
      manifest.modules.push(moduleName);
      await this.update(bmadDir, { modules: manifest.modules });
    }
  }

  /**
   * Remove a module from the manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} moduleName - Module name to remove
   */
  async removeModule(bmadDir, moduleName) {
    const manifest = await this.read(bmadDir);
    if (!manifest || !manifest.modules) {
      return;
    }

    const index = manifest.modules.indexOf(moduleName);
    if (index !== -1) {
      manifest.modules.splice(index, 1);
      await this.update(bmadDir, { modules: manifest.modules });
    }
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
          console.warn(`Warning: Could not parse ${filePath}:`, error.message);
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
      // Handle core module differently - it's in src/core not src/modules/core
      const configPath =
        moduleName === 'core'
          ? path.join(process.cwd(), 'src', 'core', 'config.yaml')
          : path.join(process.cwd(), 'src', 'modules', moduleName, 'config.yaml');

      try {
        if (await fs.pathExists(configPath)) {
          const yaml = require('yaml');
          const content = await fs.readFile(configPath, 'utf8');
          configs[moduleName] = yaml.parse(content);
        }
      } catch (error) {
        console.warn(`Could not load config for module ${moduleName}:`, error.message);
      }
    }

    return configs;
  }
  /**
   * Add a custom module to the manifest with its source path
   * @param {string} bmadDir - Path to bmad directory
   * @param {Object} customModule - Custom module info
   */
  async addCustomModule(bmadDir, customModule) {
    const manifest = await this.read(bmadDir);
    if (!manifest) {
      throw new Error('No manifest found');
    }

    if (!manifest.customModules) {
      manifest.customModules = [];
    }

    // Check if custom module already exists
    const existingIndex = manifest.customModules.findIndex((m) => m.id === customModule.id);
    if (existingIndex === -1) {
      // Add new entry
      manifest.customModules.push(customModule);
    } else {
      // Update existing entry
      manifest.customModules[existingIndex] = customModule;
    }

    await this.update(bmadDir, { customModules: manifest.customModules });
  }

  /**
   * Remove a custom module from the manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} moduleId - Module ID to remove
   */
  async removeCustomModule(bmadDir, moduleId) {
    const manifest = await this.read(bmadDir);
    if (!manifest || !manifest.customModules) {
      return;
    }

    const index = manifest.customModules.findIndex((m) => m.id === moduleId);
    if (index !== -1) {
      manifest.customModules.splice(index, 1);
      await this.update(bmadDir, { customModules: manifest.customModules });
    }
  }
}

module.exports = { Manifest };
