/**
 * BMAD Agent Installer
 * Discovers, prompts, compiles, and installs agents
 */

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('yaml');
const readline = require('node:readline');
const { compileAgent, compileAgentFile } = require('./compiler');
const { extractInstallConfig, getDefaultValues } = require('./template-engine');

/**
 * Find BMAD config file in project
 * @param {string} startPath - Starting directory to search from
 * @returns {Object|null} Config data or null
 */
function findBmadConfig(startPath = process.cwd()) {
  // Look for common BMAD folder names
  const possibleNames = ['.bmad', 'bmad', '.bmad-method'];

  for (const name of possibleNames) {
    const configPath = path.join(startPath, name, 'bmb', 'config.yaml');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      const config = yaml.parse(content);
      return {
        ...config,
        bmadFolder: path.join(startPath, name),
        projectRoot: startPath,
      };
    }
  }

  return null;
}

/**
 * Resolve path variables like {project-root} and {bmad-folder}
 * @param {string} pathStr - Path with variables
 * @param {Object} context - Contains projectRoot, bmadFolder
 * @returns {string} Resolved path
 */
function resolvePath(pathStr, context) {
  return pathStr.replaceAll('{project-root}', context.projectRoot).replaceAll('{bmad-folder}', context.bmadFolder);
}

/**
 * Discover available agents in the custom agent location
 * @param {string} searchPath - Path to search for agents
 * @returns {Array} List of agent info objects
 */
function discoverAgents(searchPath) {
  if (!fs.existsSync(searchPath)) {
    return [];
  }

  const agents = [];
  const entries = fs.readdirSync(searchPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(searchPath, entry.name);

    if (entry.isFile() && entry.name.endsWith('.agent.yaml')) {
      // Simple agent (single file)
      agents.push({
        type: 'simple',
        name: entry.name.replace('.agent.yaml', ''),
        path: fullPath,
        yamlFile: fullPath,
      });
    } else if (entry.isDirectory()) {
      // Check for agent with sidecar (folder containing .agent.yaml)
      const yamlFiles = fs.readdirSync(fullPath).filter((f) => f.endsWith('.agent.yaml'));
      if (yamlFiles.length === 1) {
        const agentYamlPath = path.join(fullPath, yamlFiles[0]);
        agents.push({
          type: 'expert',
          name: entry.name,
          path: fullPath,
          yamlFile: agentYamlPath,
          hasSidecar: true,
        });
      }
    }
  }

  return agents;
}

/**
 * Load agent YAML and extract install_config
 * @param {string} yamlPath - Path to agent YAML file
 * @returns {Object} Agent YAML and install config
 */
function loadAgentConfig(yamlPath) {
  const content = fs.readFileSync(yamlPath, 'utf8');
  const agentYaml = yaml.parse(content);
  const installConfig = extractInstallConfig(agentYaml);
  const defaults = installConfig ? getDefaultValues(installConfig) : {};

  // Check for saved_answers (from previously installed custom agents)
  // These take precedence over defaults
  const savedAnswers = agentYaml?.saved_answers || {};

  return {
    yamlContent: content,
    agentYaml,
    installConfig,
    defaults: { ...defaults, ...savedAnswers }, // saved_answers override defaults
    metadata: agentYaml?.agent?.metadata || {},
  };
}

/**
 * Interactive prompt for install_config questions
 * @param {Object} installConfig - Install configuration with questions
 * @param {Object} defaults - Default values
 * @returns {Promise<Object>} User answers
 */
async function promptInstallQuestions(installConfig, defaults, presetAnswers = {}) {
  if (!installConfig || !installConfig.questions || installConfig.questions.length === 0) {
    return { ...defaults, ...presetAnswers };
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) =>
    new Promise((resolve) => {
      rl.question(prompt, resolve);
    });

  const answers = { ...defaults, ...presetAnswers };

  console.log('\n📝 Agent Configuration\n');
  if (installConfig.description) {
    console.log(`   ${installConfig.description}\n`);
  }

  for (const q of installConfig.questions) {
    // Skip questions for variables that are already set (e.g., custom_name set upfront)
    if (answers[q.var] !== undefined && answers[q.var] !== defaults[q.var]) {
      console.log(chalk.dim(`   ${q.var}: ${answers[q.var]} (already set)`));
      continue;
    }

    let response;

    switch (q.type) {
      case 'text': {
        const defaultHint = q.default ? ` (default: ${q.default})` : '';
        response = await question(`   ${q.prompt}${defaultHint}: `);
        answers[q.var] = response || q.default || '';

        break;
      }
      case 'boolean': {
        const defaultHint = q.default ? ' [Y/n]' : ' [y/N]';
        response = await question(`   ${q.prompt}${defaultHint}: `);
        if (response === '') {
          answers[q.var] = q.default;
        } else {
          answers[q.var] = response.toLowerCase().startsWith('y');
        }

        break;
      }
      case 'choice': {
        console.log(`   ${q.prompt}`);
        for (const [idx, opt] of q.options.entries()) {
          const marker = opt.value === q.default ? '* ' : '  ';
          console.log(`   ${marker}${idx + 1}. ${opt.label}`);
        }
        const defaultIdx = q.options.findIndex((o) => o.value === q.default) + 1;
        let validChoice = false;
        let choiceIdx;
        while (!validChoice) {
          response = await question(`   Choice (default: ${defaultIdx}): `);
          if (response) {
            choiceIdx = parseInt(response, 10) - 1;
            if (isNaN(choiceIdx) || choiceIdx < 0 || choiceIdx >= q.options.length) {
              console.log(`   Invalid choice. Please enter 1-${q.options.length}`);
            } else {
              validChoice = true;
            }
          } else {
            choiceIdx = defaultIdx - 1;
            validChoice = true;
          }
        }
        answers[q.var] = q.options[choiceIdx].value;

        break;
      }
      // No default
    }
  }

  rl.close();
  return answers;
}

/**
 * Install a compiled agent to target location
 * @param {Object} agentInfo - Agent discovery info
 * @param {Object} answers - User answers for install_config
 * @param {string} targetPath - Target installation directory
 * @returns {Object} Installation result
 */
function installAgent(agentInfo, answers, targetPath) {
  // Compile the agent
  const { xml, metadata, processedYaml } = compileAgent(fs.readFileSync(agentInfo.yamlFile, 'utf8'), answers);

  // Determine target agent folder name
  const agentFolderName = metadata.name ? metadata.name.toLowerCase().replaceAll(/\s+/g, '-') : agentInfo.name;

  const agentTargetDir = path.join(targetPath, agentFolderName);

  // Create target directory
  if (!fs.existsSync(agentTargetDir)) {
    fs.mkdirSync(agentTargetDir, { recursive: true });
  }

  // Write compiled XML (.md)
  const compiledFileName = `${agentFolderName}.md`;
  const compiledPath = path.join(agentTargetDir, compiledFileName);
  fs.writeFileSync(compiledPath, xml, 'utf8');

  const result = {
    success: true,
    agentName: metadata.name || agentInfo.name,
    targetDir: agentTargetDir,
    compiledFile: compiledPath,
    sidecarCopied: false,
  };

  // Copy sidecar files for expert agents
  if (agentInfo.hasSidecar && agentInfo.type === 'expert') {
    const sidecarFiles = copySidecarFiles(agentInfo.path, agentTargetDir, agentInfo.yamlFile);
    result.sidecarCopied = true;
    result.sidecarFiles = sidecarFiles;
  }

  return result;
}

/**
 * Recursively copy sidecar files (everything except the .agent.yaml)
 * @param {string} sourceDir - Source agent directory
 * @param {string} targetDir - Target agent directory
 * @param {string} excludeYaml - The .agent.yaml file to exclude
 * @returns {Array} List of copied files
 */
function copySidecarFiles(sourceDir, targetDir, excludeYaml) {
  const copied = [];

  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      // Skip the source YAML file
      if (srcPath === excludeYaml) {
        continue;
      }

      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        copied.push(destPath);
      }
    }
  }

  copyDir(sourceDir, targetDir);
  return copied;
}

/**
 * Update agent metadata ID to reflect installed location
 * @param {string} compiledContent - Compiled XML content
 * @param {string} targetPath - Target installation path relative to project
 * @returns {string} Updated content
 */
function updateAgentId(compiledContent, targetPath) {
  // Update the id attribute in the opening agent tag
  return compiledContent.replace(/(<agent\s+id=")[^"]*(")/, `$1${targetPath}$2`);
}

/**
 * Detect if a path is within a BMAD project
 * @param {string} targetPath - Path to check
 * @returns {Object|null} Project info with bmadFolder and cfgFolder
 */
function detectBmadProject(targetPath) {
  let checkPath = path.resolve(targetPath);
  const root = path.parse(checkPath).root;

  // Walk up directory tree looking for BMAD installation
  while (checkPath !== root) {
    const possibleNames = ['.bmad', 'bmad'];
    for (const name of possibleNames) {
      const bmadFolder = path.join(checkPath, name);
      const cfgFolder = path.join(bmadFolder, '_cfg');
      const manifestFile = path.join(cfgFolder, 'agent-manifest.csv');

      if (fs.existsSync(manifestFile)) {
        return {
          projectRoot: checkPath,
          bmadFolder,
          cfgFolder,
          manifestFile,
        };
      }
    }
    checkPath = path.dirname(checkPath);
  }

  return null;
}

/**
 * Escape CSV field value
 * @param {string} value - Value to escape
 * @returns {string} Escaped value
 */
function escapeCsvField(value) {
  if (typeof value !== 'string') value = String(value);
  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replaceAll('"', '""') + '"';
  }
  return value;
}

/**
 * Parse CSV line respecting quoted fields
 * @param {string} line - CSV line
 * @returns {Array} Parsed fields
 */
function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && !inQuotes) {
      inQuotes = true;
    } else if (char === '"' && inQuotes) {
      if (nextChar === '"') {
        current += '"';
        i++; // Skip escaped quote
      } else {
        inQuotes = false;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

/**
 * Check if agent name exists in manifest
 * @param {string} manifestFile - Path to agent-manifest.csv
 * @param {string} agentName - Agent name to check
 * @returns {Object|null} Existing entry or null
 */
function checkManifestForAgent(manifestFile, agentName) {
  const content = fs.readFileSync(manifestFile, 'utf8');
  const lines = content.trim().split('\n');

  if (lines.length < 2) return null;

  const header = parseCsvLine(lines[0]);
  const nameIndex = header.indexOf('name');

  if (nameIndex === -1) return null;

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    if (fields[nameIndex] === agentName) {
      const entry = {};
      for (const [idx, col] of header.entries()) {
        entry[col] = fields[idx] || '';
      }
      entry._lineNumber = i;
      return entry;
    }
  }

  return null;
}

/**
 * Check if agent path exists in manifest
 * @param {string} manifestFile - Path to agent-manifest.csv
 * @param {string} agentPath - Agent path to check
 * @returns {Object|null} Existing entry or null
 */
function checkManifestForPath(manifestFile, agentPath) {
  const content = fs.readFileSync(manifestFile, 'utf8');
  const lines = content.trim().split('\n');

  if (lines.length < 2) return null;

  const header = parseCsvLine(lines[0]);
  const pathIndex = header.indexOf('path');

  if (pathIndex === -1) return null;

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    if (fields[pathIndex] === agentPath) {
      const entry = {};
      for (const [idx, col] of header.entries()) {
        entry[col] = fields[idx] || '';
      }
      entry._lineNumber = i;
      return entry;
    }
  }

  return null;
}

/**
 * Update existing entry in manifest
 * @param {string} manifestFile - Path to agent-manifest.csv
 * @param {Object} agentData - New agent data
 * @param {number} lineNumber - Line number to replace (1-indexed, excluding header)
 * @returns {boolean} Success
 */
function updateManifestEntry(manifestFile, agentData, lineNumber) {
  const content = fs.readFileSync(manifestFile, 'utf8');
  const lines = content.trim().split('\n');

  const header = lines[0];
  const columns = header.split(',');

  // Build the new row
  const row = columns.map((col) => {
    const value = agentData[col] || '';
    return escapeCsvField(value);
  });

  // Replace the line
  lines[lineNumber] = row.join(',');

  fs.writeFileSync(manifestFile, lines.join('\n') + '\n', 'utf8');
  return true;
}

/**
 * Add agent to manifest CSV
 * @param {string} manifestFile - Path to agent-manifest.csv
 * @param {Object} agentData - Agent metadata and path info
 * @returns {boolean} Success
 */
function addToManifest(manifestFile, agentData) {
  const content = fs.readFileSync(manifestFile, 'utf8');
  const lines = content.trim().split('\n');

  // Parse header to understand column order
  const header = lines[0];
  const columns = header.split(',');

  // Build the new row based on header columns
  const row = columns.map((col) => {
    const value = agentData[col] || '';
    return escapeCsvField(value);
  });

  // Append new row
  const newLine = row.join(',');
  const updatedContent = content.trim() + '\n' + newLine + '\n';

  fs.writeFileSync(manifestFile, updatedContent, 'utf8');
  return true;
}

/**
 * Save agent source YAML to _cfg/custom/agents/ for reinstallation
 * Stores user answers in a top-level saved_answers section (cleaner than overwriting defaults)
 * @param {Object} agentInfo - Agent info (path, type, etc.)
 * @param {string} cfgFolder - Path to _cfg folder
 * @param {string} agentName - Final agent name (e.g., "fred-commit-poet")
 * @param {Object} answers - User answers to save for reinstallation
 * @returns {Object} Info about saved source
 */
function saveAgentSource(agentInfo, cfgFolder, agentName, answers = {}) {
  // Save to _cfg/custom/agents/ instead of _cfg/agents/
  const customAgentsCfgDir = path.join(cfgFolder, 'custom', 'agents');

  if (!fs.existsSync(customAgentsCfgDir)) {
    fs.mkdirSync(customAgentsCfgDir, { recursive: true });
  }

  const yamlLib = require('yaml');

  /**
   * Add saved_answers section to store user's actual answers
   */
  function addSavedAnswers(agentYaml, answers) {
    // Store answers in a clear, separate section
    agentYaml.saved_answers = answers;
    return agentYaml;
  }

  if (agentInfo.type === 'simple') {
    // Simple agent: copy YAML with saved_answers section
    const targetYaml = path.join(customAgentsCfgDir, `${agentName}.agent.yaml`);
    const originalContent = fs.readFileSync(agentInfo.yamlFile, 'utf8');
    const agentYaml = yamlLib.parse(originalContent);

    // Add saved_answers section with user's choices
    addSavedAnswers(agentYaml, answers);

    fs.writeFileSync(targetYaml, yamlLib.stringify(agentYaml), 'utf8');
    return { type: 'simple', path: targetYaml };
  } else {
    // Expert agent with sidecar: copy entire folder with saved_answers
    const targetFolder = path.join(customAgentsCfgDir, agentName);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    // Copy YAML and entire sidecar structure
    const sourceDir = agentInfo.path;
    const copied = [];

    function copyDir(src, dest) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else if (entry.name.endsWith('.agent.yaml')) {
          // For the agent YAML, add saved_answers section
          const originalContent = fs.readFileSync(srcPath, 'utf8');
          const agentYaml = yamlLib.parse(originalContent);
          addSavedAnswers(agentYaml, answers);
          // Rename YAML to match final agent name
          const newYamlPath = path.join(dest, `${agentName}.agent.yaml`);
          fs.writeFileSync(newYamlPath, yamlLib.stringify(agentYaml), 'utf8');
          copied.push(newYamlPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
          copied.push(destPath);
        }
      }
    }

    copyDir(sourceDir, targetFolder);
    return { type: 'expert', path: targetFolder, files: copied };
  }
}

/**
 * Create IDE slash command wrapper for agent
 * Leverages IdeManager to dispatch to IDE-specific handlers
 * @param {string} projectRoot - Project root path
 * @param {string} agentName - Agent name (e.g., "commit-poet")
 * @param {string} agentPath - Path to compiled agent (relative to project root)
 * @param {Object} metadata - Agent metadata
 * @returns {Promise<Object>} Info about created slash commands
 */
async function createIdeSlashCommands(projectRoot, agentName, agentPath, metadata) {
  // Read manifest.yaml to get installed IDEs
  const manifestPath = path.join(projectRoot, '.bmad', '_cfg', 'manifest.yaml');
  let installedIdes = ['claude-code']; // Default to Claude Code if no manifest

  if (fs.existsSync(manifestPath)) {
    const yamlLib = require('yaml');
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = yamlLib.parse(manifestContent);
    if (manifest.ides && Array.isArray(manifest.ides)) {
      installedIdes = manifest.ides;
    }
  }

  // Use IdeManager to install custom agent launchers for all configured IDEs
  const { IdeManager } = require('../../installers/lib/ide/manager');
  const ideManager = new IdeManager();

  const results = await ideManager.installCustomAgentLaunchers(installedIdes, projectRoot, agentName, agentPath, metadata);

  return results;
}

/**
 * Update manifest.yaml to track custom agent
 * @param {string} manifestPath - Path to manifest.yaml
 * @param {string} agentName - Agent name
 * @param {string} agentType - Agent type (source name)
 * @returns {boolean} Success
 */
function updateManifestYaml(manifestPath, agentName, agentType) {
  if (!fs.existsSync(manifestPath)) {
    return false;
  }

  const yamlLib = require('yaml');
  const content = fs.readFileSync(manifestPath, 'utf8');
  const manifest = yamlLib.parse(content);

  // Initialize custom_agents array if not exists
  if (!manifest.custom_agents) {
    manifest.custom_agents = [];
  }

  // Check if this agent is already registered
  const existingIndex = manifest.custom_agents.findIndex((a) => a.name === agentName || (typeof a === 'string' && a === agentName));

  const agentEntry = {
    name: agentName,
    type: agentType,
    installed: new Date().toISOString(),
  };

  if (existingIndex === -1) {
    // Add new entry
    manifest.custom_agents.push(agentEntry);
  } else {
    // Update existing entry
    manifest.custom_agents[existingIndex] = agentEntry;
  }

  // Update lastUpdated timestamp
  if (manifest.installation) {
    manifest.installation.lastUpdated = new Date().toISOString();
  }

  // Write back
  const newContent = yamlLib.stringify(manifest);
  fs.writeFileSync(manifestPath, newContent, 'utf8');

  return true;
}

/**
 * Extract manifest data from compiled agent XML
 * @param {string} xmlContent - Compiled agent XML
 * @param {Object} metadata - Agent metadata from YAML
 * @param {string} agentPath - Relative path to agent file
 * @param {string} moduleName - Module name (default: 'custom')
 * @returns {Object} Manifest row data
 */
function extractManifestData(xmlContent, metadata, agentPath, moduleName = 'custom') {
  // Extract data from XML using regex (simple parsing)
  const extractTag = (tag) => {
    const match = xmlContent.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
    if (!match) return '';
    // Collapse multiple lines into single line, normalize whitespace
    return match[1].trim().replaceAll(/\n+/g, ' ').replaceAll(/\s+/g, ' ').trim();
  };

  const extractPrinciples = () => {
    const match = xmlContent.match(/<principles>([\s\S]*?)<\/principles>/);
    if (!match) return '';
    // Extract individual principle lines
    const principles = match[1]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .join(' ');
    return principles;
  };

  return {
    name: metadata.id ? path.basename(metadata.id, '.md') : metadata.name.toLowerCase().replaceAll(/\s+/g, '-'),
    displayName: metadata.name || '',
    title: metadata.title || '',
    icon: metadata.icon || '',
    role: extractTag('role'),
    identity: extractTag('identity'),
    communicationStyle: extractTag('communication_style'),
    principles: extractPrinciples(),
    module: moduleName,
    path: agentPath,
  };
}

module.exports = {
  findBmadConfig,
  resolvePath,
  discoverAgents,
  loadAgentConfig,
  promptInstallQuestions,
  installAgent,
  copySidecarFiles,
  updateAgentId,
  detectBmadProject,
  addToManifest,
  extractManifestData,
  escapeCsvField,
  checkManifestForAgent,
  checkManifestForPath,
  updateManifestEntry,
  saveAgentSource,
  createIdeSlashCommands,
  updateManifestYaml,
};
