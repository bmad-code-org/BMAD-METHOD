/**
 * WDS Agent Compiler
 * Simplified agent YAML-to-MD compiler for standalone WDS installation.
 * Ports core XML builder functions from BMAD's compiler and inlines
 * the activation block (replacing BMAD's fragment-loading system).
 */

const yaml = require('js-yaml');
const fs = require('node:fs');
const path = require('node:path');

// --- XML Utility ---

function escapeXml(text) {
  if (!text) return '';
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

// --- XML Builder Functions (ported from BMAD compiler.js) ---

function buildFrontmatter(metadata, agentName) {
  const nameFromFile = agentName.replaceAll('-', ' ');
  const description = metadata.title || 'WDS Agent';

  return `---
name: "${nameFromFile}"
description: "${description}"
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

`;
}

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

  if (persona.working_style) {
    const workingText = persona.working_style.trim().replaceAll(/\n+/g, ' ').replaceAll(/\s+/g, ' ');
    xml += `    <working_style>${escapeXml(workingText)}</working_style>\n`;
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

function buildPromptsXml(prompts) {
  if (!prompts || prompts.length === 0) return '';

  let xml = '  <prompts>\n';
  for (const prompt of prompts) {
    xml += `    <prompt id="${prompt.id || ''}">\n`;
    xml += `      <content>\n`;
    xml += `${prompt.content || ''}\n`;
    xml += `      </content>\n`;
    xml += `    </prompt>\n`;
  }
  xml += '  </prompts>\n';
  return xml;
}

function buildMemoriesXml(memories) {
  if (!memories || memories.length === 0) return '';

  let xml = '  <memories>\n';
  for (const memory of memories) {
    xml += `    <memory>${escapeXml(String(memory))}</memory>\n`;
  }
  xml += '  </memories>\n';
  return xml;
}

function processExecArray(execArray) {
  const result = {
    description: '',
    route: null,
    workflow: null,
    data: null,
    action: null,
    type: null,
  };

  if (!Array.isArray(execArray)) return result;

  for (const exec of execArray) {
    if (exec.input) result.description = exec.input;
    if (exec.route) {
      if (exec.route.endsWith('.yaml') || exec.route.endsWith('.yml')) {
        result.workflow = exec.route;
      } else {
        result.route = exec.route;
      }
    }
    if (exec.data !== null && exec.data !== undefined) result.data = exec.data;
    if (exec.action) result.action = exec.action;
    if (exec.type) result.type = exec.type;
  }

  return result;
}

function buildNestedHandlers(triggers) {
  let xml = '';
  for (const triggerGroup of triggers) {
    for (const [, execArray] of Object.entries(triggerGroup)) {
      const execData = processExecArray(execArray);
      const attrs = [`match="${escapeXml(execData.description || '')}"`];

      if (execData.route) attrs.push(`exec="${execData.route}"`);
      if (execData.workflow) attrs.push(`workflow="${execData.workflow}"`);
      if (execData.action) attrs.push(`action="${execData.action}"`);
      if (execData.data) attrs.push(`data="${execData.data}"`);
      if (execData.type && execData.type !== 'exec') attrs.push(`type="${execData.type}"`);

      xml += `      <handler ${attrs.join(' ')}></handler>\n`;
    }
  }
  return xml;
}

function buildMenuXml(menuItems, wdsFolder) {
  let xml = '  <menu>\n';

  // Standard menu items
  xml += `    <item cmd="MH or fuzzy match on menu or help">[MH] Redisplay Menu Help</item>\n`;

  // User-defined menu items
  if (menuItems && menuItems.length > 0) {
    for (const item of menuItems) {
      // Skip party-mode items (requires BMAD core)
      if (item.trigger === 'party-mode') continue;
      // Skip items referencing core or bmm paths (standalone mode)
      if (item.exec && (item.exec.includes('/core/') || item.exec.includes('/bmm/'))) continue;
      if (item.workflow && item.workflow.includes('/bmm/')) continue;

      // Handle multi format
      if (item.multi && item.triggers && Array.isArray(item.triggers)) {
        // Filter out party-mode from multi triggers
        const filteredTriggers = item.triggers.filter((tg) => {
          const keys = Object.keys(tg);
          return !keys.includes('party-mode');
        });
        if (filteredTriggers.length === 0) continue;

        // Rebuild multi description without party-mode reference
        let multiDesc = item.multi;
        multiDesc = multiDesc.replaceAll(/\[SPM\] Start Party Mode \(optionally suggest attendees and topic\),?\s*/g, '').trim();
        if (!multiDesc) multiDesc = '[CH] Chat';

        xml += `    <item type="multi">${escapeXml(multiDesc)}\n`;
        xml += buildNestedHandlers(filteredTriggers);
        xml += `    </item>\n`;
      }
      // Handle legacy format
      else if (item.trigger) {
        const attrs = [`cmd="${item.trigger}"`];
        if (item.workflow) attrs.push(`workflow="${item.workflow}"`);
        if (item.exec) attrs.push(`exec="${item.exec}"`);
        if (item.data) attrs.push(`data="${item.data}"`);
        if (item.action) attrs.push(`action="${escapeXml(typeof item.action === 'string' ? item.action : JSON.stringify(item.action))}"`);

        xml += `    <item ${attrs.join(' ')}>${escapeXml(item.description || '')}</item>\n`;
      }
    }
  }

  xml += `    <item cmd="DA or fuzzy match on exit, leave, goodbye or dismiss agent">[DA] Dismiss Agent</item>\n`;
  xml += '  </menu>\n';
  return xml;
}

// --- Activation Block (inlined, replaces BMAD's fragment system) ---

function detectUsedHandlers(menuItems) {
  const used = new Set();
  if (!menuItems) return used;

  for (const item of menuItems) {
    if (item.workflow) used.add('workflow');
    if (item.exec) used.add('exec');
    if (item.data) used.add('data');
    if (item.action) used.add('action');
    if (item.multi) used.add('multi');
  }
  return used;
}

function buildActivationBlock(agent, wdsFolder) {
  const meta = agent.metadata;
  const criticalActions = agent.critical_actions || [];

  let stepNum = 4;
  let agentSteps = '';
  for (const action of criticalActions) {
    agentSteps += `    <step n="${stepNum}">${action}</step>\n`;
    stepNum++;
  }

  const menuStep = stepNum;
  const haltStep = stepNum + 1;
  const inputStep = stepNum + 2;
  const executeStep = stepNum + 3;

  let xml = `  <activation critical="MANDATORY">
    <step n="1">Load persona from this current agent file (already in context)</step>
    <step n="2">IMMEDIATE ACTION REQUIRED - BEFORE ANY OUTPUT:
        - Load and read {project-root}/${wdsFolder}/config.yaml NOW
        - Store ALL fields as session variables: {user_name}, {communication_language}, {output_folder}, {starting_point}, {project_name}
        - VERIFY: If config not loaded, STOP and report error to user
        - DO NOT PROCEED to step 3 until config is successfully loaded and variables stored
    </step>
    <step n="3">Remember: user's name is {user_name}</step>
${agentSteps}    <step n="${menuStep}">Show greeting using {user_name} from config, communicate in {communication_language}, then display numbered list of ALL menu items from menu section</step>
    <step n="${haltStep}">STOP and WAIT for user input - do NOT execute menu items automatically - accept number or cmd trigger or fuzzy command match</step>
    <step n="${inputStep}">On user input: Number -> execute menu item[n] | Text -> case-insensitive substring match | Multiple matches -> ask user to clarify | No match -> show "Not recognized"</step>
    <step n="${executeStep}">When executing a menu item: Check menu-handlers section below - extract any attributes from the selected menu item (workflow, exec, data, action) and follow the corresponding handler instructions</step>

    <menu-handlers>
      <handlers>
`;

  // Include only handlers used by this agent's menu items
  const used = detectUsedHandlers(agent.menu);

  if (used.has('workflow')) {
    xml += `    <handler type="workflow">
      When menu item has: workflow="path/to/workflow.yaml":
      1. Load and read the complete workflow YAML file at the specified path
      2. Follow all steps and instructions within the workflow file precisely
      3. Save outputs after completing EACH workflow step (never batch multiple steps together)
      4. If workflow path is "todo", inform user the workflow hasn't been implemented yet
    </handler>
`;
  }

  if (used.has('exec')) {
    xml += `    <handler type="exec">
      When menu item or handler has: exec="path/to/file.md":
      1. Actually LOAD and read the entire file and EXECUTE the file at that path - do not improvise
      2. Read the complete file and follow all instructions within it
      3. If there is data="some/path/data-foo.md" with the same item, pass that data path to the executed file as context.
    </handler>
`;
  }

  if (used.has('data')) {
    xml += `    <handler type="data">
      When menu item has: data="path/to/file.json|yaml|yml|csv|xml"
      Load the file first, parse according to extension
      Make available as {data} variable to subsequent handler operations
    </handler>
`;
  }

  if (used.has('action')) {
    xml += `    <handler type="action">
      When menu item has: action="#id" -> Find prompt with id="id" in current agent XML, execute its content
      When menu item has: action="text" -> Execute the text directly as an inline instruction
    </handler>
`;
  }

  if (used.has('multi')) {
    xml += `    <handler type="multi">
       When menu item has: type="multi" with nested handlers
       1. Display the multi item text as a single menu option
       2. Parse all nested handlers within the multi item
       3. For each nested handler:
          - Use the 'match' attribute for fuzzy matching user input (or Exact Match of character code in brackets [])
          - Execute based on handler attributes (exec, workflow, action)
       4. When user input matches a handler's 'match' pattern:
          - For exec="path/to/file.md": follow the handler type="exec" instructions
          - For workflow="path/to/workflow.yaml": follow the handler type="workflow" instructions
          - For action="...": Perform the specified action directly
       5. Support both exact matches and fuzzy matching based on the match attribute
       6. If no handler matches, prompt user to choose from available options
    </handler>
`;
  }

  xml += `      </handlers>
    </menu-handlers>

    <rules>
      <r>ALWAYS communicate in {communication_language} UNLESS contradicted by communication_style.</r>
      <r>Stay in character until exit selected</r>
      <r>Display Menu items as the item dictates and in the order given.</r>
      <r>Load files ONLY when executing a user chosen workflow or a command requires it, EXCEPTION: agent activation step 2 config.yaml</r>
    </rules>
  </activation>
`;

  return xml;
}

// --- Path Rewriting ---

function rewritePaths(content, wdsFolder) {
  // Replace BMAD module paths with standalone WDS folder path
  // In BMAD: {project-root}/_bmad/wds/workflows/...
  // Standalone: {project-root}/_wds/workflows/...
  let result = content;
  // Handle {bmad_folder} variable form
  result = result.replaceAll('{bmad_folder}/wds/', `${wdsFolder}/`);
  result = result.replaceAll('{project-root}/{bmad_folder}/wds/', `{project-root}/${wdsFolder}/`);
  // Handle hardcoded _bmad/wds/ form (used by expansion module agents)
  result = result.replaceAll('_bmad/wds/', `${wdsFolder}/`);
  return result;
}

// --- Main Compilation ---

function compileAgentFile(yamlPath, options = {}) {
  const wdsFolder = options.wdsFolder || '_wds';
  const rawContent = fs.readFileSync(yamlPath, 'utf8');

  // Rewrite paths before parsing
  const rewrittenContent = rewritePaths(rawContent, wdsFolder);
  const agentYaml = yaml.load(rewrittenContent);
  const agent = agentYaml.agent;
  const meta = agent.metadata;

  // Derive agent name from filename
  const basename = path.basename(yamlPath, '.agent.yaml');

  let output = '';

  // Frontmatter
  output += buildFrontmatter(meta, meta.name || basename);

  // Start XML code fence
  output += '```xml\n';

  // Agent opening tag
  const agentId = `${wdsFolder}/agents/${basename}.md`;
  const agentAttrs = [`id="${agentId}"`, `name="${meta.name || ''}"`, `title="${meta.title || ''}"`, `icon="${meta.icon || ''}"`];
  output += `<agent ${agentAttrs.join(' ')}>\n`;

  // Activation block (inlined)
  output += buildActivationBlock(agent, wdsFolder);

  // Persona
  output += buildPersonaXml(agent.persona);

  // Prompts
  if (agent.prompts && agent.prompts.length > 0) {
    output += buildPromptsXml(agent.prompts);
  }

  // Memories
  if (agent.memories && agent.memories.length > 0) {
    output += buildMemoriesXml(agent.memories);
  }

  // Menu
  output += buildMenuXml(agent.menu || [], wdsFolder);

  // Close
  output += '</agent>\n';
  output += '```\n';

  // Write output
  const outputPath = options.outputPath || yamlPath.replace('.agent.yaml', '.md');
  fs.writeFileSync(outputPath, output, 'utf8');

  return { outputPath, metadata: meta, agentName: basename };
}

module.exports = {
  compileAgentFile,
  escapeXml,
  buildFrontmatter,
  buildPersonaXml,
  buildPromptsXml,
  buildMemoriesXml,
  buildMenuXml,
  buildActivationBlock,
};
