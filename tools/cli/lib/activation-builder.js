const fs = require('fs-extra');
const path = require('node:path');
const { getSourcePath } = require('./project-root');

/**
 * Builds activation blocks from fragments based on agent profile
 */
class ActivationBuilder {
  constructor() {
    this.agentComponents = getSourcePath('utility', 'agent-components');
    this.fragmentCache = new Map();
  }

  /**
   * Load a fragment file
   * @param {string} fragmentName - Name of fragment file (e.g., 'activation-init.txt')
   * @returns {string} Fragment content
   */
  async loadFragment(fragmentName) {
    // Check cache first
    if (this.fragmentCache.has(fragmentName)) {
      return this.fragmentCache.get(fragmentName);
    }

    const fragmentPath = path.join(this.agentComponents, fragmentName);

    if (!(await fs.pathExists(fragmentPath))) {
      throw new Error(`Fragment not found: ${fragmentName}`);
    }

    const content = await fs.readFile(fragmentPath, 'utf8');
    this.fragmentCache.set(fragmentName, content);
    return content;
  }

  /**
   * Build complete activation block based on agent profile
   * @param {Object} profile - Agent profile from AgentAnalyzer
   * @param {Object} metadata - Agent metadata (module, name, etc.)
   * @param {Array} agentSpecificActions - Optional agent-specific critical actions
   * @param {boolean} forWebBundle - Whether this is for a web bundle
   * @returns {string} Complete activation block XML
   */
  async buildActivation(profile, metadata = {}, agentSpecificActions = [], forWebBundle = false) {
    let activation = '<activation critical="MANDATORY">\n';

    // 1. Build sequential steps (use web-specific steps for web bundles)
    const steps = await this.buildSteps(metadata, agentSpecificActions, forWebBundle);
    activation += this.indent(steps, 2) + '\n';

    // 2. Build menu handlers section with dynamic handlers
    const menuHandlers = await this.loadFragment('menu-handlers.txt');

    // Build handlers (load only needed handlers)
    const handlers = await this.buildHandlers(profile);

    // Remove the extract line from the final output - it's just build metadata
    // The extract list tells us which attributes to look for during processing
    // but shouldn't appear in the final agent file
    const processedHandlers = menuHandlers
      .replace('<extract>{DYNAMIC_EXTRACT_LIST}</extract>\n', '') // Remove the entire extract line
      .replace('{DYNAMIC_HANDLERS}', handlers);

    activation += '\n' + this.indent(processedHandlers, 2) + '\n';

    const rules = await this.loadFragment('activation-rules.txt');
    activation += this.indent(rules, 2) + '\n';

    activation += '</activation>';

    return activation;
  }

  /**
   * Build handlers section based on profile
   * @param {Object} profile - Agent profile
   * @returns {string} Handlers XML
   */
  async buildHandlers(profile) {
    const handlerFragments = [];

    for (const attrType of profile.usedAttributes) {
      const fragmentName = `handler-${attrType}.txt`;
      try {
        const handler = await this.loadFragment(fragmentName);
        handlerFragments.push(handler);
      } catch {
        console.warn(`Warning: Handler fragment not found: ${fragmentName}`);
      }
    }

    return handlerFragments.join('\n');
  }

  /**
   * Build sequential activation steps
   * @param {Object} metadata - Agent metadata
   * @param {Array} agentSpecificActions - Optional agent-specific actions
   * @param {boolean} forWebBundle - Whether this is for a web bundle
   * @returns {string} Steps XML
   */
  async buildSteps(metadata = {}, agentSpecificActions = [], forWebBundle = false) {
    const stepsTemplate = await this.loadFragment('activation-steps.txt');

    // Extract basename from agent ID (e.g., "bmad/bmm/agents/pm.md" → "pm")
    const agentBasename = metadata.id ? metadata.id.split('/').pop().replace('.md', '') : metadata.name || 'agent';

    // Build agent-specific steps
    let agentStepsXml = '';
    let currentStepNum = 4; // Steps 1-3 are standard

    if (agentSpecificActions && agentSpecificActions.length > 0) {
      agentStepsXml = agentSpecificActions
        .map((action) => {
          const step = `<step n="${currentStepNum}">${action}</step>`;
          currentStepNum++;
          return step;
        })
        .join('\n');
    }

    // Calculate final step numbers
    const menuStep = currentStepNum;
    const helpStep = currentStepNum + 1;
    const haltStep = currentStepNum + 2;
    const inputStep = currentStepNum + 3;
    const executeStep = currentStepNum + 4;

    // Replace placeholders
    const processed = stepsTemplate
      .replace('{agent-file-basename}', agentBasename)
      .replace('{{module}}', metadata.module || 'core') // Fixed to use {{module}}
      .replace('{AGENT_SPECIFIC_STEPS}', agentStepsXml)
      .replace('{MENU_STEP}', menuStep.toString())
      .replace('{HELP_STEP}', helpStep.toString())
      .replace('{HALT_STEP}', haltStep.toString())
      .replace('{INPUT_STEP}', inputStep.toString())
      .replace('{EXECUTE_STEP}', executeStep.toString());

    return processed;
  }

  /**
   * Indent XML content
   * @param {string} content - Content to indent
   * @param {number} spaces - Number of spaces to indent
   * @returns {string} Indented content
   */
  indent(content, spaces) {
    const indentation = ' '.repeat(spaces);
    return content
      .split('\n')
      .map((line) => (line ? indentation + line : line))
      .join('\n');
  }

  /**
   * Clear fragment cache (useful for testing or hot reload)
   */
  clearCache() {
    this.fragmentCache.clear();
  }
}

module.exports = { ActivationBuilder };
