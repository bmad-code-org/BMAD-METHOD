/**
 * BMAD Agent Compiler
 * Transforms agent YAML to compiled XML (.md) format
 * Uses the existing BMAD builder infrastructure for proper formatting
 */

const yaml = require('yaml');
const fs = require('node:fs');
const path = require('node:path');
const { processAgentYaml, extractInstallConfig, stripInstallConfig, getDefaultValues } = require('./template-engine');

// Use existing BMAD builder if available
let YamlXmlBuilder;
try {
  YamlXmlBuilder = require('../../lib/yaml-xml-builder').YamlXmlBuilder;
} catch {
  YamlXmlBuilder = null;
}

/**
 * Escape XML special characters
 */
function escapeXml(text) {
  if (!text) return '';
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

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

/**
 * Build simple activation block for custom agents
 * @param {Array} criticalActions - Agent-specific critical actions
 * @param {Array} menuItems - Menu items to determine which handlers to include
 * @param {string} deploymentType - 'ide' or 'web' - filters commands based on ide-only/web-only flags
 * @returns {string} Activation XML
 */
function buildSimpleActivation(criticalActions = [], menuItems = [], deploymentType = 'ide') {
  let activation = '<activation critical="MANDATORY">\n';

  let stepNum = 1;

  // Standard steps
  activation += `  <step n="${stepNum++}">Load persona from this current agent file (already in context)</step>\n`;
  activation += `  <step n="${stepNum++}">Load and read {project-root}/{bmad_folder}/core/config.yaml to get {user_name}, {communication_language}, {output_folder}</step>\n`;
  activation += `  <step n="${stepNum++}">Remember: user's name is {user_name}</step>\n`;

  // Agent-specific steps from critical_actions
  for (const action of criticalActions) {
    activation += `  <step n="${stepNum++}">${action}</step>\n`;
  }

  // Menu and interaction steps
  activation += `  <step n="${stepNum++}">ALWAYS communicate in {communication_language}</step>\n`;
  activation += `  <step n="${stepNum++}">Show greeting using {user_name} from config, communicate in {communication_language}, then display numbered list of
      ALL menu items from menu section</step>\n`;
  activation += `  <step n="${stepNum++}">STOP and WAIT for user input - do NOT execute menu items automatically - accept number or cmd trigger or fuzzy command
      match</step>\n`;
  activation += `  <step n="${stepNum++}">On user input: Number → execute menu item[n] | Text → case-insensitive substring match | Multiple matches → ask user
      to clarify | No match → show "Not recognized"</step>\n`;

  // Filter menu items based on deployment type
  const filteredMenuItems = menuItems.filter((item) => {
    // Skip web-only commands for IDE deployment
    if (deploymentType === 'ide' && item['web-only'] === true) {
      return false;
    }
    // Skip ide-only commands for web deployment
    if (deploymentType === 'web' && item['ide-only'] === true) {
      return false;
    }
    return true;
  });

  // Detect which handlers are actually used in the filtered menu
  const usedHandlers = new Set();
  for (const item of filteredMenuItems) {
    if (item.action) usedHandlers.add('action');
    if (item.workflow) usedHandlers.add('workflow');
    if (item.exec) usedHandlers.add('exec');
    if (item.tmpl) usedHandlers.add('tmpl');
    if (item.data) usedHandlers.add('data');
    if (item['validate-workflow']) usedHandlers.add('validate-workflow');
  }

  // Only include menu-handlers section if handlers are used
  if (usedHandlers.size > 0) {
    activation += `  <step n="${stepNum++}">When executing a menu item: Check menu-handlers section below - extract any attributes from the selected menu item and follow the corresponding handler instructions</step>\n`;

    // Menu handlers - only include what's used
    activation += `
  <menu-handlers>
    <handlers>\n`;

    if (usedHandlers.has('action')) {
      activation += `      <handler type="action">
        When menu item has: action="#id" → Find prompt with id="id" in current agent XML, execute its content
        When menu item has: action="text" → Execute the text directly as an inline instruction
      </handler>\n`;
    }

    if (usedHandlers.has('workflow')) {
      activation += `      <handler type="workflow">
        When menu item has: workflow="path/to/workflow.yaml"
        1. CRITICAL: Always LOAD {project-root}/{bmad_folder}/core/tasks/workflow.xml
        2. Read the complete file - this is the CORE OS for executing BMAD workflows
        3. Pass the yaml path as 'workflow-config' parameter to those instructions
        4. Execute workflow.xml instructions precisely following all steps
        5. Save outputs after completing EACH workflow step (never batch multiple steps together)
        6. If workflow.yaml path is "todo", inform user the workflow hasn't been implemented yet
      </handler>\n`;
    }

    if (usedHandlers.has('exec')) {
      activation += `      <handler type="exec">
        When menu item has: exec="command" → Execute the command directly
      </handler>\n`;
    }

    if (usedHandlers.has('tmpl')) {
      activation += `      <handler type="tmpl">
        When menu item has: tmpl="template-path" → Load and apply the template
      </handler>\n`;
    }

    if (usedHandlers.has('data')) {
      activation += `      <handler type="data">
        When menu item has: data="path/to/x.json|yaml|yml"
        Load the file, parse as JSON/YAML, make available as {data} to subsequent operations
      </handler>\n`;
    }

    if (usedHandlers.has('validate-workflow')) {
      activation += `      <handler type="validate-workflow">
        When menu item has: validate-workflow="path/to/workflow.yaml"
        1. CRITICAL: Always LOAD {project-root}/{bmad_folder}/core/tasks/validate-workflow.xml
        2. Read the complete file - this is the CORE OS for validating BMAD workflows
        3. Pass the workflow.yaml path as 'workflow' parameter to those instructions
        4. Pass any checklist.md from the workflow location as 'checklist' parameter if available
        5. Execute validate-workflow.xml instructions precisely following all steps
        6. Generate validation report with thorough analysis
      </handler>\n`;
    }

    activation += `    </handlers>
  </menu-handlers>\n`;
  }

  activation += `
  <rules>
    - ALWAYS communicate in {communication_language} UNLESS contradicted by communication_style
    - Stay in character until exit selected
    - Menu triggers use asterisk (*) - NOT markdown, display exactly as shown
    - Number all lists, use letters for sub-options
    - Load files ONLY when executing menu items or a workflow or command requires it. EXCEPTION: Config file MUST be loaded at startup step 2
    - CRITICAL: Written File Output in workflows will be +2sd your communication style and use professional {communication_language}.
  </rules>
</activation>\n`;

  return activation;
}

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
 * Build menu XML section
 * Supports both legacy and multi format menu items
 * Multi items display as a single menu item with nested handlers
 * @param {Array} menuItems - Menu items
 * @returns {string} Menu XML
 */
function buildMenuXml(menuItems) {
  let xml = '  <menu>\n';

  // Always inject menu display option first
  xml += `    <item cmd="*menu">[M] Redisplay Menu Options</item>\n`;

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
        // For legacy items, keep using cmd with *<trigger> format
        let trigger = item.trigger || '';
        if (!trigger.startsWith('*')) {
          trigger = '*' + trigger;
        }

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
 * @returns {string} Compiled XML string with frontmatter
 */
function compileToXml(agentYaml, agentName = '', targetPath = '') {
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

  xml += `<agent ${agentAttrs.join(' ')}>\n`;

  // Activation block - pass menu items and deployment type to determine which handlers to include
  xml += buildSimpleActivation(agent.critical_actions || [], agent.menu || [], 'ide');

  // Persona section
  xml += buildPersonaXml(agent.persona);

  // Prompts section (if present)
  if (agent.prompts && agent.prompts.length > 0) {
    xml += buildPromptsXml(agent.prompts);
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
 * @returns {Object} { xml: string, metadata: Object }
 */
function compileAgent(yamlContent, answers = {}, agentName = '', targetPath = '') {
  // Parse YAML
  const agentYaml = yaml.parse(yamlContent);

  // Inject custom agent name into metadata.name if provided
  // This is the user's chosen persona name (e.g., "Fred" instead of "Inkwell Von Comitizen")
  if (agentName && agentYaml.agent && agentYaml.agent.metadata) {
    // Convert kebab-case to title case for the name field
    // e.g., "fred-commit-poet" → "Fred Commit Poet"
    const titleCaseName = agentName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    agentYaml.agent.metadata.name = titleCaseName;
  }

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

  // Compile to XML
  const xml = compileToXml(cleanYaml, agentName, targetPath);

  return {
    xml,
    metadata: cleanYaml.agent.metadata,
    processedYaml: cleanYaml,
  };
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
  fs.writeFileSync(outputPath, result.xml, 'utf8');

  return {
    ...result,
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
  buildSimpleActivation,
  buildPersonaXml,
  buildPromptsXml,
  buildMenuXml,
};
