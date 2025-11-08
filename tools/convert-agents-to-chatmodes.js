/**
 * Convert BMAD agent YAML files to GitHub Copilot chat mode files
 * Usage: node tools/convert-agents-to-chatmodes.js
 */

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const PROJECT_ROOT = path.join(__dirname, '..');
const CHATMODES_DIR = path.join(PROJECT_ROOT, '.github', 'chatmodes');
const AGENTS_BASE = path.join(PROJECT_ROOT, 'src', 'modules');

// Ensure chatmodes directory exists
if (!fs.existsSync(CHATMODES_DIR)) {
  fs.mkdirSync(CHATMODES_DIR, { recursive: true });
}

/**
 * Generate chat mode content from agent YAML
 */
function generateChatMode(agentData, moduleName) {
  const { metadata, persona, menu, critical_actions } = agentData;

  // Build menu items
  const menuItems = menu
    .map((item) => {
      const attrs = [];
      if (item.workflow) attrs.push(`workflow="${item.workflow}"`);
      if (item.exec) attrs.push(`exec="${item.exec}"`);
      if (item.action) attrs.push(`action="${item.action}"`);
      if (item.data) attrs.push(`data="${item.data}"`);
      if (item['validate-workflow']) attrs.push(`validate-workflow="${item['validate-workflow']}"`);

      const attrString = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
      return `    <item cmd="*${item.trigger}"${attrString}>${item.description}</item>`;
    })
    .join('\n');

  // Handle critical actions
  const criticalActionsSection =
    critical_actions && critical_actions.length > 0
      ? `\n  <critical_actions>\n${critical_actions.map((action) => `    <action>${action}</action>`).join('\n')}\n  </critical_actions>\n`
      : '';

  // Handle principles - can be array or string
  let principlesText = '';
  if (Array.isArray(persona.principles)) {
    principlesText = persona.principles.join(' ');
  } else if (typeof persona.principles === 'string') {
    principlesText = persona.principles;
  }

  const template = `---
description: 'Activates the ${metadata.title} agent persona.'
tools:
  [
    'changes',
    'codebase',
    'fetch',
    'findTestFiles',
    'githubRepo',
    'problems',
    'usages',
    'editFiles',
    'runCommands',
    'runTasks',
    'runTests',
    'search',
    'searchResults',
    'terminalLastCommand',
    'terminalSelection',
    'testFailure',
  ]
---

# ${metadata.title} Agent

---

name: "${metadata.id.split('/').pop().replace('.md', '')}"
description: "${metadata.title}"

---

You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

\`\`\`xml
<agent id="${metadata.id}" name="${metadata.name}" title="${metadata.title}" icon="${metadata.icon}">
<activation critical="MANDATORY">
  <step n="1">Load persona from this current agent file (already in context)</step>
  <step n="2">🚨 IMMEDIATE ACTION REQUIRED - BEFORE ANY OUTPUT:
      - Load and read {project-root}/bmad/${moduleName}/config.yaml NOW
      - Store ALL fields as session variables: {user_name}, {communication_language}, {output_folder}
      - VERIFY: If config not loaded, STOP and report error to user
      - DO NOT PROCEED to step 3 until config is successfully loaded and variables stored</step>
  <step n="3">Remember: user's name is {user_name}</step>
  <step n="4">ALWAYS communicate in {communication_language}</step>
  <step n="5">Show greeting using {user_name} from config, communicate in {communication_language}, then display numbered list of
      ALL menu items from menu section</step>
  <step n="6">STOP and WAIT for user input - do NOT execute menu items automatically - accept number or trigger text</step>
  <step n="7">On user input: Number → execute menu item[n] | Text → case-insensitive substring match | Multiple matches → ask user
      to clarify | No match → show "Not recognized"</step>
  <step n="8">When executing a menu item: Check menu-handlers section below - extract any attributes from the selected menu item
      (workflow, exec, tmpl, data, action, validate-workflow) and follow the corresponding handler instructions</step>

  <menu-handlers>
      <handlers>
      <handler type="action">
        When menu item has: action="#id" → Find prompt with id="id" in current agent XML, execute its content
        When menu item has: action="text" → Execute the text directly as an inline instruction
      </handler>

  <handler type="workflow">
    When menu item has: workflow="path/to/workflow.yaml"
    1. CRITICAL: Always LOAD {project-root}/bmad/core/tasks/workflow.xml
    2. Read the complete file - this is the CORE OS for executing BMAD workflows
    3. Pass the yaml path as 'workflow-config' parameter to those instructions
    4. Execute workflow.xml instructions precisely following all steps
    5. Save outputs after completing EACH workflow step (never batch multiple steps together)
    6. If workflow.yaml path is "todo", inform user the workflow hasn't been implemented yet
  </handler>

  <handler type="exec">
    When menu item has: exec="path/to/task.xml"
    1. Load the XML task file from the specified path
    2. Execute the task instructions exactly as specified
    3. Return results to user
  </handler>

  <handler type="validate-workflow">
    When menu item has: validate-workflow="path/to/workflow.yaml"
    1. Load {project-root}/bmad/core/tasks/validate-workflow.xml
    2. Pass the workflow path as parameter
    3. Execute validation instructions
  </handler>

  <handler type="data">
    When menu item has: data="path/to/data.xml"
    1. Load the XML data file
    2. Use as context for the menu action
  </handler>
    </handlers>
  </menu-handlers>

  <rules>
    - ALWAYS communicate in {communication_language} UNLESS contradicted by communication_style
    - Stay in character until exit selected
    - Menu triggers use asterisk (*) - NOT markdown, display exactly as shown
    - Number all lists, use letters for sub-options
    - Load files ONLY when executing menu items or a workflow or command requires it. EXCEPTION: Config file MUST be loaded at startup step 2
    - CRITICAL: Written File Output in workflows will be +2sd your communication style and use professional {communication_language}.
  </rules>
</activation>${criticalActionsSection}
  <persona>
    <role>${persona.role}</role>
    <identity>${persona.identity}</identity>
    <communication_style>${persona.communication_style}</communication_style>
    <principles>${principlesText}</principles>
  </persona>
  <menu>
    <item cmd="*help">Show numbered menu</item>
${menuItems}
    <item cmd="*exit">Exit with confirmation</item>
  </menu>
</agent>
\`\`\`

## Module

Part of the BMAD ${moduleName.toUpperCase()} module.
`;

  return template;
}

/**
 * Process a single agent file
 */
function processAgent(agentPath, moduleName) {
  try {
    const content = fs.readFileSync(agentPath, 'utf8');
    const parsed = yaml.load(content);

    if (!parsed || !parsed.agent) {
      console.warn(`⚠️  Skipping ${agentPath}: No agent definition found`);
      return null;
    }

    const agent = parsed.agent;
    const agentFile = path.basename(agentPath, '.agent.yaml');
    const outputFile = `${moduleName}-${agentFile}.chatmode.md`;
    const outputPath = path.join(CHATMODES_DIR, outputFile);

    const chatModeContent = generateChatMode(agent, moduleName);
    fs.writeFileSync(outputPath, chatModeContent, 'utf8');

    console.log(`✅ Created: ${outputFile}`);
    return outputFile;
  } catch (error) {
    console.error(`❌ Error processing ${agentPath}:`, error.message);
    return null;
  }
}

/**
 * Process all agents in a module directory
 */
function processModule(moduleName) {
  const modulePath = path.join(AGENTS_BASE, moduleName, 'agents');

  if (!fs.existsSync(modulePath)) {
    console.warn(`⚠️  Module path not found: ${modulePath}`);
    return [];
  }

  console.log(`\n📂 Processing ${moduleName.toUpperCase()} module...`);

  const files = fs
    .readdirSync(modulePath)
    .filter((f) => f.endsWith('.agent.yaml'))
    .filter((f) => !f.includes('README'));

  const created = files.map((file) => processAgent(path.join(modulePath, file), moduleName)).filter(Boolean);

  return created;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 BMAD Agent to Chat Mode Converter\n');
  console.log('Converting agent YAML files to GitHub Copilot chat modes...\n');

  const modules = ['bmm', 'cis', 'bmb'];
  const allCreated = [];

  for (const module of modules) {
    const created = processModule(module);
    allCreated.push(...created);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✨ Conversion complete!`);
  console.log(`📊 Total chat modes created: ${allCreated.length}`);
  console.log(`📁 Output directory: ${CHATMODES_DIR}`);
  console.log('='.repeat(60) + '\n');

  // List all chat mode files
  console.log('📋 All chat mode files:');
  const allChatModes = fs
    .readdirSync(CHATMODES_DIR)
    .filter((f) => f.endsWith('.chatmode.md'))
    .sort();

  for (const file of allChatModes) {
    console.log(`   - ${file}`);
  }

  console.log(`\n✅ Total: ${allChatModes.length} chat mode files\n`);
}

// Run the script
main();
