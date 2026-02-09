/**
 * BMAD Agent Compiler
 * Transforms agent YAML to compiled XML (.md) format
 * Uses the existing BMAD builder infrastructure for proper formatting
 */

const yaml = require('yaml');
const fs = require('node:fs');
const path = require('node:path');
const { processAgentYaml, extractInstallConfig, stripInstallConfig, getDefaultValues } = require('./template-engine');
const { escapeXml } = require('../../../lib/xml-utils');
const { ActivationBuilder } = require('../activation-builder');
const { AgentAnalyzer } = require('../agent-analyzer');

/**
 * Build frontmatter for agent
 * @param {Object} metadata - Agent metadata
 * @param {string} agentName - Final agent name
 * @returns {string} YAML frontmatter
 */
function buildFrontmatter(metadata, agentName) {
  const nameFromFile = agentName.replaceAll('-', ' ');
  const description = metadata.title || 'BMAD Agent';

  return `---
name: "${nameFromFile}"
description: "${description}"
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

`;
}

// buildSimpleActivation function removed - replaced by ActivationBuilder for proper fragment loading from src/utility/agent-components/

/**
 * Build persona XML section
 * @param {Object} persona - Persona object
 * @returns {string} Persona XML
 */
function buildPersonaXml(persona) {
  if (!persona) return '';

  let xml = '  <persona>\n';

  if (persona.role) {
    const roleText = persona.role.trim().replaceAll(/\n+/g, ' ').replaceAll(/\s+/g, ' ');
    xml += `    <role>${escapeXml(roleText)}</role>\n`;
  }

  if (persona.identity) {
    const identityText = persona.identity.trim().replaceAll(/\n+/g, ' ').replaceAll(/\s+/g, ' ');
    xml += `    <identity>${escapeXml(identityText)}</identity>\n`;
  }

  if (persona.communication_style) {
    const styleText = persona.communication_style.trim().replaceAll(/\n+/g, ' ').replaceAll(/\s+/g, ' ');
    xml += `    <communication_style>${escapeXml(styleText)}</communication_style>\n`;
  }

  if (persona.principles) {
    let principlesText;
    if (Array.isArray(persona.principles)) {
      principlesText = persona.principles.join(' ');
    } else {
      principlesText = persona.principles.trim().replaceAll(/\n+/g, ' ');
    }
    xml += `    <principles>${escapeXml(principlesText)}</principles>\n`;
  }

  xml += '  </persona>\n';

  return xml;
}

/**
 * Build prompts XML section
 * @param {Array} prompts - Prompts array
 * @returns {string} Prompts XML
 */
function buildPromptsXml(prompts) {
  if (!prompts || prompts.length === 0) return '';

  let xml = '  <prompts>\n';

  for (const prompt of prompts) {
    xml += `    <prompt id="${prompt.id || ''}">\n`;
    xml += `      <content>\n`;
    // Don't escape prompt content - it's meant to be read as-is
    xml += `${prompt.content || ''}\n`;
    xml += `      </content>\n`;
    xml += `    </prompt>\n`;
  }

  xml += '  </prompts>\n';

  return xml;
}

/**
 * Build memories XML section
 * @param {Array} memories - Memories array
 * @returns {string} Memories XML
 */
function buildMemoriesXml(memories) {
  if (!memories || memories.length === 0) return '';

  let xml = '  <memories>\n';

  for (const memory of memories) {
    xml += `    <memory>${escapeXml(String(memory))}</memory>\n`;
  }

  xml += '  </memories>\n';

  return xml;
}

/**
 * Build menu XML section
 * Supports both legacy and multi format menu items
 * Multi items display as a single menu item with nested handlers
 * @param {Array} menuItems - Menu items
 * @returns {string} Menu XML
 */
function buildMenuXml(menuItems) {
  let xml = '  <menu>\n';

  // Always inject menu display option first
  xml += `    <item cmd="MH or fuzzy match on menu or help">[MH] Redisplay Menu Help</item>\n`;
  xml += `    <item cmd="CH or fuzzy match on chat">[CH] Chat with the Agent about anything</item>\n`;

  // Add user-defined menu items
  if (menuItems && menuItems.length > 0) {
    for (const item of menuItems) {
      // Handle multi format menu items with nested handlers
      if (item.multi && item.triggers && Array.isArray(item.triggers)) {
        xml += `    <item type="multi">${escapeXml(item.multi)}\n`;
        xml += buildNestedHandlers(item.triggers);
        xml += `    </item>\n`;
      }
      // Handle legacy format menu items
      else if (item.trigger) {
        let trigger = item.trigger || '';

        const attrs = [`cmd="${trigger}"`];

        // Add handler attributes
        if (item.workflow) attrs.push(`workflow="${item.workflow}"`);
        if (item.exec) attrs.push(`exec="${item.exec}"`);
        if (item.tmpl) attrs.push(`tmpl="${item.tmpl}"`);
        if (item.data) attrs.push(`data="${item.data}"`);
        if (item.action) attrs.push(`action="${item.action}"`);

        xml += `    <item ${attrs.join(' ')}>${escapeXml(item.description || '')}</item>\n`;
      }
    }
  }

  xml += `    <item cmd="PM or fuzzy match on party-mode" exec="{project-root}/_bmad/core/workflows/party-mode/workflow.md">[PM] Start Party Mode</item>\n`;
  xml += `    <item cmd="DA or fuzzy match on exit, leave, goodbye or dismiss agent">[DA] Dismiss Agent</item>\n`;

  xml += '  </menu>\n';

  return xml;
}

/**
 * Build nested handlers for multi format menu items
 * @param {Array} triggers - Triggers array from multi format
 * @returns {string} Handler XML
 */
function buildNestedHandlers(triggers) {
  let xml = '';

  for (const triggerGroup of triggers) {
    for (const [triggerName, execArray] of Object.entries(triggerGroup)) {
      // Build trigger with * prefix
      let trigger = triggerName.startsWith('*') ? triggerName : '*' + triggerName;

      // Extract the relevant execution data
      const execData = processExecArray(execArray);

      // For nested handlers in multi items, we use match attribute for fuzzy matching
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
function processExecArray(execArray) {
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
 * Compile agent YAML to proper XML format
 * @param {Object} agentYaml - Parsed and processed agent YAML
 * @param {string} agentName - Final agent name (for ID and frontmatter)
 * @param {string} targetPath - Target path for agent ID
 * @returns {Promise<string>} Compiled XML string with frontmatter
 */
async function compileToXml(agentYaml, agentName = '', targetPath = '') {
  const agent = agentYaml.agent;
  const meta = agent.metadata;

  let xml = '';

  // Build frontmatter
  xml += buildFrontmatter(meta, agentName || meta.name || 'agent');

  // Start code fence
  xml += '```xml\n';

  // Agent opening tag
  const agentAttrs = [
    `id="${targetPath || meta.id || ''}"`,
    `name="${meta.name || ''}"`,
    `title="${meta.title || ''}"`,
    `icon="${meta.icon || '🤖'}"`,
  ];
  if (meta.capabilities) {
    agentAttrs.push(`capabilities="${escapeXml(meta.capabilities)}"`);
  }

  xml += `<agent ${agentAttrs.join(' ')}>\n`;

  // Activation block - use ActivationBuilder for proper fragment loading
  const activationBuilder = new ActivationBuilder();
  const analyzer = new AgentAnalyzer();
  const profile = analyzer.analyzeAgentObject(agentYaml);
  xml += await activationBuilder.buildActivation(
    profile,
    meta,
    agent.critical_actions || [],
    false, // forWebBundle - set to false for IDE deployment
  );

  // Persona section
  xml += buildPersonaXml(agent.persona);

  // Prompts section (if present)
  if (agent.prompts && agent.prompts.length > 0) {
    xml += buildPromptsXml(agent.prompts);
  }

  // Memories section (if present)
  if (agent.memories && agent.memories.length > 0) {
    xml += buildMemoriesXml(agent.memories);
  }

  // Menu section
  xml += buildMenuXml(agent.menu || []);

  // Closing agent tag
  xml += '</agent>\n';

  // Close code fence
  xml += '```\n';

  return xml;
}

/**
 * Full compilation pipeline
 * @param {string} yamlContent - Raw YAML string
 * @param {Object} answers - Answers from install_config questions (or defaults)
 * @param {string} agentName - Optional final agent name (user's custom persona name)
 * @param {string} targetPath - Optional target path for agent ID
 * @param {Object} options - Additional options including config
 * @returns {Promise<Object>} { xml: string, metadata: Object }
 */
async function compileAgent(yamlContent, answers = {}, agentName = '', targetPath = '', options = {}) {
  // Parse YAML
  let agentYaml = yaml.parse(yamlContent);

  // Apply customization merges before template processing
  // Handle metadata overrides (like name)
  if (answers.metadata) {
    // Filter out empty values from metadata
    const filteredMetadata = filterCustomizationData(answers.metadata);
    if (Object.keys(filteredMetadata).length > 0) {
      agentYaml.agent.metadata = { ...agentYaml.agent.metadata, ...filteredMetadata };
    }
    // Remove from answers so it doesn't get processed as template variables
    const { metadata, ...templateAnswers } = answers;
    answers = templateAnswers;
  }

  // Handle other customization properties
  // These should be merged into the agent structure, not processed as template variables
  const customizationKeys = ['persona', 'critical_actions', 'memories', 'menu', 'prompts'];
  const customizations = {};
  const remainingAnswers = { ...answers };

  for (const key of customizationKeys) {
    if (answers[key]) {
      let filtered;

      // Handle different data types
      if (Array.isArray(answers[key])) {
        // For arrays, filter out empty/null/undefined values
        filtered = answers[key].filter((item) => item !== null && item !== undefined && item !== '');
      } else {
        // For objects, use filterCustomizationData
        filtered = filterCustomizationData(answers[key]);
      }

      // Check if we have valid content
      const hasContent = Array.isArray(filtered) ? filtered.length > 0 : Object.keys(filtered).length > 0;

      if (hasContent) {
        customizations[key] = filtered;
      }
      delete remainingAnswers[key];
    }
  }

  // Merge customizations into agentYaml
  if (Object.keys(customizations).length > 0) {
    // For persona: replace entire section
    if (customizations.persona) {
      agentYaml.agent.persona = customizations.persona;
    }

    // For critical_actions: append to existing or create new
    if (customizations.critical_actions) {
      const existing = agentYaml.agent.critical_actions || [];
      agentYaml.agent.critical_actions = [...existing, ...customizations.critical_actions];
    }

    // For memories: append to existing or create new
    if (customizations.memories) {
      const existing = agentYaml.agent.memories || [];
      agentYaml.agent.memories = [...existing, ...customizations.memories];
    }

    // For menu: append to existing or create new
    if (customizations.menu) {
      const existing = agentYaml.agent.menu || [];
      agentYaml.agent.menu = [...existing, ...customizations.menu];
    }

    // For prompts: append to existing or create new (by id)
    if (customizations.prompts) {
      const existing = agentYaml.agent.prompts || [];
      // Merge by id, with customizations taking precedence
      const mergedPrompts = [...existing];
      for (const customPrompt of customizations.prompts) {
        const existingIndex = mergedPrompts.findIndex((p) => p.id === customPrompt.id);
        if (existingIndex === -1) {
          mergedPrompts.push(customPrompt);
        } else {
          mergedPrompts[existingIndex] = customPrompt;
        }
      }
      agentYaml.agent.prompts = mergedPrompts;
    }
  }

  // Use remaining answers for template processing
  answers = remainingAnswers;

  // Extract install_config
  const installConfig = extractInstallConfig(agentYaml);

  // Merge defaults with provided answers
  let finalAnswers = answers;
  if (installConfig) {
    const defaults = getDefaultValues(installConfig);
    finalAnswers = { ...defaults, ...answers };
  }

  // Process templates with answers
  const processedYaml = processAgentYaml(agentYaml, finalAnswers);

  // Strip install_config from output
  const cleanYaml = stripInstallConfig(processedYaml);

  let xml = await compileToXml(cleanYaml, agentName, targetPath);

  // Ensure xml is a string before attempting replaceAll
  if (typeof xml !== 'string') {
    throw new TypeError('compileToXml did not return a string');
  }

  return {
    xml,
    metadata: cleanYaml.agent.metadata,
    processedYaml: cleanYaml,
  };
}

/**
 * Filter customization data to remove empty/null values
 * @param {Object} data - Raw customization data
 * @returns {Object} Filtered customization data
 */
function filterCustomizationData(data) {
  const filtered = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined || value === '') {
      continue; // Skip null/undefined/empty values
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        filtered[key] = value;
      }
    } else if (typeof value === 'object') {
      const nested = filterCustomizationData(value);
      if (Object.keys(nested).length > 0) {
        filtered[key] = nested;
      }
    } else {
      filtered[key] = value;
    }
  }

  return filtered;
}

/**
 * Compile agent file to .md
 * @param {string} yamlPath - Path to agent YAML file
 * @param {Object} options - { answers: {}, outputPath: string }
 * @returns {Object} Compilation result
 */
function compileAgentFile(yamlPath, options = {}) {
  const yamlContent = fs.readFileSync(yamlPath, 'utf8');
  const result = compileAgent(yamlContent, options.answers || {});

  // Determine output path
  let outputPath = options.outputPath;
  if (!outputPath) {
    // Default: same directory, same name, .md extension
    const dir = path.dirname(yamlPath);
    const basename = path.basename(yamlPath, '.agent.yaml');
    outputPath = path.join(dir, `${basename}.md`);
  }

  // Write compiled XML
  fs.writeFileSync(outputPath, xml, 'utf8');

  return {
    ...result,
    xml,
    outputPath,
    sourcePath: yamlPath,
  };
}

module.exports = {
  compileToXml,
  compileAgent,
  compileAgentFile,
  escapeXml,
  buildFrontmatter,
  buildPersonaXml,
  buildPromptsXml,
  buildMemoriesXml,
  buildMenuXml,
  filterCustomizationData,
};
