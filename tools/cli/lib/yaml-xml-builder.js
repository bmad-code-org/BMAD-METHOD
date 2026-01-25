const yaml = require('yaml');
const fs = require('fs-extra');
const path = require('node:path');
const crypto = require('node:crypto');
const { AgentAnalyzer } = require('./agent-analyzer');
const { ActivationBuilder } = require('./activation-builder');
const { escapeXml } = require('../../lib/xml-utils');

/**
 * Converts agent YAML files to XML format with smart activation injection
 */
class YamlXmlBuilder {
  constructor() {
    this.analyzer = new AgentAnalyzer();
    this.activationBuilder = new ActivationBuilder();
  }

  /**
   * Deep merge two objects (for customize.yaml + agent.yaml)
   * @param {Object} target - Target object
   * @param {Object} source - Source object to merge in
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
        } else if (Array.isArray(source[key])) {
          // For arrays, append rather than replace (for commands)
          if (Array.isArray(target[key])) {
            output[key] = [...target[key], ...source[key]];
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
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Load and merge agent YAML with customization
   * @param {string} agentYamlPath - Path to base agent YAML
   * @param {string} customizeYamlPath - Path to customize YAML (optional)
   * @returns {Object} Merged agent configuration
   */
  async loadAndMergeAgent(agentYamlPath, customizeYamlPath = null) {
    // Load base agent
    const agentContent = await fs.readFile(agentYamlPath, 'utf8');
    const agentYaml = yaml.parse(agentContent);

    // Load customization if exists
    let merged = agentYaml;
    if (customizeYamlPath && (await fs.pathExists(customizeYamlPath))) {
      const customizeContent = await fs.readFile(customizeYamlPath, 'utf8');
      const customizeYaml = yaml.parse(customizeContent);

      if (customizeYaml) {
        // Special handling: persona fields are merged, but only non-empty values override
        if (customizeYaml.persona) {
          const basePersona = merged.agent.persona || {};
          const customPersona = {};

          // Only copy non-empty customize values
          for (const [key, value] of Object.entries(customizeYaml.persona)) {
            if (value !== '' && value !== null && !(Array.isArray(value) && value.length === 0)) {
              customPersona[key] = value;
            }
          }

          // Merge non-empty customize values over base
          if (Object.keys(customPersona).length > 0) {
            merged.agent.persona = { ...basePersona, ...customPersona };
          }
        }

        // Merge metadata (only non-empty values)
        if (customizeYaml.agent && customizeYaml.agent.metadata) {
          const nonEmptyMetadata = {};
          for (const [key, value] of Object.entries(customizeYaml.agent.metadata)) {
            if (value !== '' && value !== null) {
              nonEmptyMetadata[key] = value;
            }
          }
          merged.agent.metadata = { ...merged.agent.metadata, ...nonEmptyMetadata };
        }

        // Append menu items (support both 'menu' and legacy 'commands')
        const customMenuItems = customizeYaml.menu || customizeYaml.commands;
        if (customMenuItems) {
          // Determine if base uses 'menu' or 'commands'
          if (merged.agent.menu) {
            merged.agent.menu = [...merged.agent.menu, ...customMenuItems];
          } else if (merged.agent.commands) {
            merged.agent.commands = [...merged.agent.commands, ...customMenuItems];
          } else {
            // Default to 'menu' for new agents
            merged.agent.menu = customMenuItems;
          }
        }

        // Append critical actions
        if (customizeYaml.critical_actions) {
          merged.agent.critical_actions = [...(merged.agent.critical_actions || []), ...customizeYaml.critical_actions];
        }

        // Append prompts
        if (customizeYaml.prompts) {
          merged.agent.prompts = [...(merged.agent.prompts || []), ...customizeYaml.prompts];
        }

        // Append memories
        if (customizeYaml.memories) {
          merged.agent.memories = [...(merged.agent.memories || []), ...customizeYaml.memories];
        }
      }
    }

    return merged;
  }

  /**
   * Convert agent YAML to XML
   * @param {Object} agentYaml - Parsed agent YAML object
   * @param {Object} buildMetadata - Metadata about the build (file paths, hashes, etc.)
   * @returns {string} XML content
   */
  async convertToXml(agentYaml, buildMetadata = {}) {
    const agent = agentYaml.agent;
    const metadata = agent.metadata || {};

    // Add module from buildMetadata if available
    if (buildMetadata.module) {
      metadata.module = buildMetadata.module;
    }

    // Analyze agent to determine needed handlers
    const profile = this.analyzer.analyzeAgentObject(agentYaml);

    // Build activation block only if not skipped
    let activationBlock = '';
    if (!buildMetadata.skipActivation) {
      activationBlock = await this.activationBuilder.buildActivation(
        profile,
        metadata,
        agent.critical_actions || [],
        buildMetadata.forWebBundle || false, // Pass web bundle flag
      );
    }

    // Start building XML
    let xml = '';

    if (buildMetadata.forWebBundle) {
      // Web bundle: keep existing format
      xml += '<!-- Powered by BMAD-CORE™ -->\n\n';
      xml += `# ${metadata.title || 'Agent'}\n\n`;
    } else {
      // Installation: use YAML frontmatter + instruction
      // Extract name from filename: "cli-chief.yaml" or "pm.agent.yaml" -> "cli chief" or "pm"
      const filename = buildMetadata.sourceFile || 'agent.yaml';
      let nameFromFile = path.basename(filename, path.extname(filename)); // Remove .yaml/.md extension
      nameFromFile = nameFromFile.replace(/\.agent$/, ''); // Remove .agent suffix if present
      nameFromFile = nameFromFile.replaceAll('-', ' '); // Replace dashes with spaces

      xml += '---\n';
      xml += `name: "${nameFromFile}"\n`;
      xml += `description: "${metadata.title || 'BMAD Agent'}"\n`;
      xml += '---\n\n';
      xml +=
        "You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.\n\n";
    }

    xml += '```xml\n';

    // Agent opening tag
    const agentAttrs = [
      `id="${metadata.id || ''}"`,
      `name="${metadata.name || ''}"`,
      `title="${metadata.title || ''}"`,
      `icon="${metadata.icon || '🤖'}"`,
    ];

    // Add localskip attribute if present
    if (metadata.localskip === true) {
      agentAttrs.push('localskip="true"');
    }

    xml += `<agent ${agentAttrs.join(' ')}>\n`;

    // Activation block (only if not skipped)
    if (activationBlock) {
      xml += activationBlock + '\n';
    }

    // Persona section
    xml += this.buildPersonaXml(agent.persona);

    // Memories section (if exists)
    if (agent.memories) {
      xml += this.buildMemoriesXml(agent.memories);
    }

    // Prompts section (if exists)
    if (agent.prompts) {
      xml += this.buildPromptsXml(agent.prompts);
    }

    // Menu section (support both 'menu' and legacy 'commands')
    const menuItems = agent.menu || agent.commands || [];
    xml += this.buildCommandsXml(menuItems, buildMetadata.forWebBundle);

    xml += '</agent>\n';
    xml += '```\n';

    return xml;
  }

  /**
   * Build persona XML section
   */
  buildPersonaXml(persona) {
    if (!persona) return '';

    let xml = '  <persona>\n';

    if (persona.role) {
      xml += `    <role>${escapeXml(persona.role)}</role>\n`;
    }

    if (persona.identity) {
      xml += `    <identity>${escapeXml(persona.identity)}</identity>\n`;
    }

    if (persona.communication_style) {
      xml += `    <communication_style>${escapeXml(persona.communication_style)}</communication_style>\n`;
    }

    if (persona.principles) {
      // Principles can be array or string
      let principlesText;
      if (Array.isArray(persona.principles)) {
        principlesText = persona.principles.join(' ');
      } else {
        principlesText = persona.principles;
      }
      xml += `    <principles>${escapeXml(principlesText)}</principles>\n`;
    }

    xml += '  </persona>\n';

    return xml;
  }

  /**
   * Build memories XML section
   */
  buildMemoriesXml(memories) {
    if (!memories || memories.length === 0) return '';

    let xml = '  <memories>\n';

    for (const memory of memories) {
      xml += `    <memory>${escapeXml(memory)}</memory>\n`;
    }

    xml += '  </memories>\n';

    return xml;
  }

  /**
   * Build prompts XML section
   * Handles both array format and object/dictionary format
   */
  buildPromptsXml(prompts) {
    if (!prompts) return '';

    // Handle object/dictionary format: { promptId: 'content', ... }
    // Convert to array format for processing
    let promptsArray = prompts;
    if (!Array.isArray(prompts)) {
      // Check if it's an object with no length property (dictionary format)
      if (typeof prompts === 'object' && prompts.length === undefined) {
        promptsArray = Object.entries(prompts).map(([id, content]) => ({
          id: id,
          content: content,
        }));
      } else {
        return ''; // Not a valid prompts format
      }
    }

    if (promptsArray.length === 0) return '';

    let xml = '  <prompts>\n';

    for (const prompt of promptsArray) {
      xml += `    <prompt id="${prompt.id || ''}">\n`;
      xml += `      <content>\n`;
      xml += `${escapeXml(prompt.content || '')}\n`;
      xml += `      </content>\n`;
      xml += `    </prompt>\n`;
    }

    xml += '  </prompts>\n';

    return xml;
  }

  /**
   * Build menu XML section (renamed from commands for clarity)
   * Auto-injects *help and *exit, adds * prefix to all triggers
   * Supports both legacy format and new multi format with nested handlers
   * @param {Array} menuItems - Menu items from YAML
   * @param {boolean} forWebBundle - Whether building for web bundle
   */
  buildCommandsXml(menuItems, forWebBundle = false) {
    let xml = '  <menu>\n';

    // Always inject menu display option first
    xml += `    <item cmd="*menu">[M] Redisplay Menu Options</item>\n`;

    // Add user-defined menu items with * prefix
    if (menuItems && menuItems.length > 0) {
      for (const item of menuItems) {
        // Skip ide-only items when building for web bundles
        if (forWebBundle && item['ide-only'] === true) {
          continue;
        }
        // Skip web-only items when NOT building for web bundles (i.e., IDE/local installation)
        if (!forWebBundle && item['web-only'] === true) {
          continue;
        }

        // Handle multi format menu items with nested handlers
        if (item.multi && item.triggers && Array.isArray(item.triggers)) {
          xml += `    <item type="multi">${escapeXml(item.multi)}\n`;
          xml += this.buildNestedHandlers(item.triggers);
          xml += `    </item>\n`;
        }
        // Handle legacy format menu items
        else if (item.trigger) {
          // For legacy items, keep using cmd with *<trigger> format
          let trigger = item.trigger || '';
          if (!trigger.startsWith('*')) {
            trigger = '*' + trigger;
          }

          const attrs = [`cmd="${trigger}"`];

          // Add handler attributes
          // If workflow-install exists, use its value for workflow attribute (vendoring)
          // workflow-install is build-time metadata - tells installer where to copy workflows
          // The final XML should only have workflow pointing to the install location
          if (item['workflow-install']) {
            attrs.push(`workflow="${item['workflow-install']}"`);
          } else if (item.workflow) {
            attrs.push(`workflow="${item.workflow}"`);
          }

          if (item['validate-workflow']) attrs.push(`validate-workflow="${item['validate-workflow']}"`);
          if (item.exec) attrs.push(`exec="${item.exec}"`);
          if (item.tmpl) attrs.push(`tmpl="${item.tmpl}"`);
          if (item.data) attrs.push(`data="${item.data}"`);
          if (item.action) attrs.push(`action="${item.action}"`);

          xml += `    <item ${attrs.join(' ')}>${escapeXml(item.description || '')}</item>\n`;
        }
      }
    }

    // Always inject dismiss last
    xml += `    <item cmd="*dismiss">[D] Dismiss Agent</item>\n`;

    xml += '  </menu>\n';

    return xml;
  }

  /**
   * Build nested handlers for multi format menu items
   * @param {Array} triggers - Triggers array from multi format
   * @returns {string} Handler XML
   */
  buildNestedHandlers(triggers) {
    let xml = '';

    for (const triggerGroup of triggers) {
      for (const [triggerName, execArray] of Object.entries(triggerGroup)) {
        // Build trigger with * prefix
        let trigger = triggerName.startsWith('*') ? triggerName : '*' + triggerName;

        // Extract the relevant execution data
        const execData = this.processExecArray(execArray);

        // For nested handlers in multi items, we don't need cmd attribute
        // The match attribute will handle fuzzy matching
        const attrs = [`match="${escapeXml(execData.description || '')}"`];

        // Add handler attributes based on exec data
        if (execData.route) attrs.push(`exec="${execData.route}"`);
        if (execData.workflow) attrs.push(`workflow="${execData.workflow}"`);
        if (execData['validate-workflow']) attrs.push(`validate-workflow="${execData['validate-workflow']}"`);
        if (execData.action) attrs.push(`action="${execData.action}"`);
        if (execData.data) attrs.push(`data="${execData.data}"`);
        if (execData.tmpl) attrs.push(`tmpl="${execData.tmpl}"`);
        // Only add type if it's not 'exec' (exec is already implied by the exec attribute)
        if (execData.type && execData.type !== 'exec') attrs.push(`type="${execData.type}"`);

        xml += `      <handler ${attrs.join(' ')}></handler>\n`;
      }
    }

    return xml;
  }

  /**
   * Process the execution array from multi format triggers
   * Extracts relevant data for XML attributes
   * @param {Array} execArray - Array of execution objects
   * @returns {Object} Processed execution data
   */
  processExecArray(execArray) {
    const result = {
      description: '',
      route: null,
      workflow: null,
      data: null,
      action: null,
      type: null,
    };

    if (!Array.isArray(execArray)) {
      return result;
    }

    for (const exec of execArray) {
      if (exec.input) {
        // Use input as description if no explicit description is provided
        result.description = exec.input;
      }

      if (exec.route) {
        // Determine if it's a workflow or exec based on file extension or context
        if (exec.route.endsWith('.yaml') || exec.route.endsWith('.yml')) {
          result.workflow = exec.route;
        } else {
          result.route = exec.route;
        }
      }

      if (exec.data !== null && exec.data !== undefined) {
        result.data = exec.data;
      }

      if (exec.action) {
        result.action = exec.action;
      }

      if (exec.type) {
        result.type = exec.type;
      }
    }

    return result;
  }

  /**
   * Calculate file hash for build tracking
   */
  async calculateFileHash(filePath) {
    if (!(await fs.pathExists(filePath))) {
      return null;
    }

    const content = await fs.readFile(filePath, 'utf8');
    return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
  }

  /**
   * Build agent XML from YAML files and return as string (for in-memory use)
   * @param {string} agentYamlPath - Path to agent YAML
   * @param {string} customizeYamlPath - Path to customize YAML (optional)
   * @param {Object} options - Build options
   * @returns {Promise<string>} XML content as string
   */
  async buildFromYaml(agentYamlPath, customizeYamlPath = null, options = {}) {
    // Load and merge YAML files
    const mergedAgent = await this.loadAndMergeAgent(agentYamlPath, customizeYamlPath);

    // Calculate hashes for build tracking
    const sourceHash = await this.calculateFileHash(agentYamlPath);
    const customizeHash = customizeYamlPath ? await this.calculateFileHash(customizeYamlPath) : null;

    // Extract module from path (e.g., /path/to/modules/bmm/agents/pm.yaml -> bmm)
    // or /path/to/bmad/bmm/agents/pm.yaml -> bmm
    // or /path/to/src/bmm/agents/pm.yaml -> bmm
    let module = 'core'; // default to core
    const pathParts = agentYamlPath.split(path.sep);

    // Look for module indicators in the path
    const modulesIndex = pathParts.indexOf('modules');
    const bmadIndex = pathParts.indexOf('bmad');
    const srcIndex = pathParts.indexOf('src');

    if (modulesIndex !== -1 && pathParts[modulesIndex + 1]) {
      // Path contains /modules/{module}/
      module = pathParts[modulesIndex + 1];
    } else if (bmadIndex !== -1 && pathParts[bmadIndex + 1]) {
      // Path contains /bmad/{module}/
      const potentialModule = pathParts[bmadIndex + 1];
      // Check if it's a known module, not 'agents' or '_config'
      if (['bmm', 'bmb', 'cis', 'core'].includes(potentialModule)) {
        module = potentialModule;
      }
    } else if (srcIndex !== -1 && pathParts[srcIndex + 1]) {
      // Path contains /src/{module}/ (bmm and core are directly under src/)
      const potentialModule = pathParts[srcIndex + 1];
      if (potentialModule === 'bmm' || potentialModule === 'core') {
        module = potentialModule;
      }
    }

    // Build metadata
    const buildMetadata = {
      sourceFile: path.basename(agentYamlPath),
      sourceHash,
      customizeFile: customizeYamlPath ? path.basename(customizeYamlPath) : null,
      customizeHash,
      builderVersion: '1.0.0',
      includeMetadata: options.includeMetadata !== false,
      skipActivation: options.skipActivation === true,
      forWebBundle: options.forWebBundle === true,
      module: module, // Add module to buildMetadata
    };

    // Convert to XML and return
    return await this.convertToXml(mergedAgent, buildMetadata);
  }

  /**
   * Build agent XML from YAML files
   * @param {string} agentYamlPath - Path to agent YAML
   * @param {string} customizeYamlPath - Path to customize YAML (optional)
   * @param {string} outputPath - Path to write XML file
   * @param {Object} options - Build options
   */
  async buildAgent(agentYamlPath, customizeYamlPath, outputPath, options = {}) {
    // Use buildFromYaml to get XML content
    const xml = await this.buildFromYaml(agentYamlPath, customizeYamlPath, options);

    // Write output file
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, xml, 'utf8');

    // Calculate hashes for return value
    const sourceHash = await this.calculateFileHash(agentYamlPath);
    const customizeHash = customizeYamlPath ? await this.calculateFileHash(customizeYamlPath) : null;

    return {
      success: true,
      outputPath,
      sourceHash,
      customizeHash,
    };
  }
}

module.exports = { YamlXmlBuilder };
