const yaml = require('js-yaml');
const fs = require('fs-extra');

/**
 * Analyzes agent YAML files to detect which handlers are needed
 */
class AgentAnalyzer {
  /**
   * Analyze an agent YAML structure to determine which handlers it needs
   * @param {Object} agentYaml - Parsed agent YAML object
   * @returns {Object} Profile of needed handlers
   */
  analyzeAgentObject(agentYaml) {
    const profile = {
      usedAttributes: new Set(),
      hasPrompts: false,
      menuItems: [],
    };

    // Check if agent has prompts section
    if (agentYaml.agent && agentYaml.agent.prompts) {
      profile.hasPrompts = true;
    }

    // Analyze menu items (support both 'menu' and legacy 'commands')
    const menuItems = agentYaml.agent?.menu || agentYaml.agent?.commands || [];

    for (const item of menuItems) {
      // Track the menu item
      profile.menuItems.push(item);

      // Check for each possible attribute
      if (item.workflow) {
        profile.usedAttributes.add('workflow');
      }
      if (item['validate-workflow']) {
        profile.usedAttributes.add('validate-workflow');
      }
      if (item.exec) {
        profile.usedAttributes.add('exec');
      }
      if (item.tmpl) {
        profile.usedAttributes.add('tmpl');
      }
      if (item.data) {
        profile.usedAttributes.add('data');
      }
      if (item.action) {
        profile.usedAttributes.add('action');
      }
    }

    // Convert Set to Array for easier use
    profile.usedAttributes = [...profile.usedAttributes];

    return profile;
  }

  /**
   * Analyze an agent YAML file
   * @param {string} filePath - Path to agent YAML file
   * @returns {Object} Profile of needed handlers
   */
  async analyzeAgentFile(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    const agentYaml = yaml.load(content);
    return this.analyzeAgentObject(agentYaml);
  }

  /**
   * Check if an agent needs a specific handler
   * @param {Object} profile - Agent profile from analyze
   * @param {string} handlerType - Handler type to check
   * @returns {boolean} True if handler is needed
   */
  needsHandler(profile, handlerType) {
    return profile.usedAttributes.includes(handlerType);
  }
}

module.exports = { AgentAnalyzer };
