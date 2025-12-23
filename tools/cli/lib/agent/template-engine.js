/**
 * Template Engine for BMAD Agent Install Configuration
 * Processes {{variable}}, {{#if}}, {{#unless}}, and {{/if}} blocks
 */

/**
 * Process all template syntax in a string
 * @param {string} content - Content with template syntax
 * @param {Object} variables - Key-value pairs from install_config answers
 * @returns {string} Processed content
 */
function processTemplate(content, variables = {}) {
  let result = content;

  // Process conditionals first (they may contain variables)
  result = processConditionals(result, variables);

  // Then process simple variable replacements
  result = processVariables(result, variables);

  // Clean up any empty lines left by removed conditionals
  result = cleanupEmptyLines(result);

  return result;
}

/**
 * Process {{#if}}, {{#unless}}, {{/if}}, {{/unless}} blocks
 */
function processConditionals(content, variables) {
  let result = content;

  // Process {{#if variable == "value"}} blocks
  // Handle both regular quotes and JSON-escaped quotes (\")
  const ifEqualsPattern = /\{\{#if\s+(\w+)\s*==\s*\\?"([^"\\]+)\\?"\s*\}\}([\s\S]*?)\{\{\/if\}\}/g;
  result = result.replaceAll(ifEqualsPattern, (match, varName, value, block) => {
    return variables[varName] === value ? block : '';
  });

  // Process {{#if variable}} blocks (boolean or truthy check)
  const ifBoolPattern = /\{\{#if\s+(\w+)\s*\}\}([\s\S]*?)\{\{\/if\}\}/g;
  result = result.replaceAll(ifBoolPattern, (match, varName, block) => {
    const val = variables[varName];
    // Treat as truthy: true, non-empty string, non-zero number
    const isTruthy = val === true || (typeof val === 'string' && val.length > 0) || (typeof val === 'number' && val !== 0);
    return isTruthy ? block : '';
  });

  // Process {{#unless variable}} blocks (inverse of if)
  const unlessPattern = /\{\{#unless\s+(\w+)\s*\}\}([\s\S]*?)\{\{\/unless\}\}/g;
  result = result.replaceAll(unlessPattern, (match, varName, block) => {
    const val = variables[varName];
    const isFalsy = val === false || val === '' || val === null || val === undefined || val === 0;
    return isFalsy ? block : '';
  });

  return result;
}

/**
 * Process {{variable}} replacements
 */
function processVariables(content, variables) {
  let result = content;

  // Replace {{variable}} with value
  const varPattern = /\{\{(\w+)\}\}/g;
  result = result.replaceAll(varPattern, (match, varName) => {
    if (Object.hasOwn(variables, varName)) {
      return String(variables[varName]);
    }
    // If variable not found, leave as-is (might be runtime variable like {user_name})
    return match;
  });

  return result;
}

/**
 * Clean up excessive empty lines left after removing conditional blocks
 */
function cleanupEmptyLines(content) {
  // Replace 3+ consecutive newlines with 2
  return content.replaceAll(/\n{3,}/g, '\n\n');
}

/**
 * Extract install_config from agent YAML object
 * @param {Object} agentYaml - Parsed agent YAML
 * @returns {Object|null} install_config section or null
 */
function extractInstallConfig(agentYaml) {
  return agentYaml?.agent?.install_config || null;
}

/**
 * Remove install_config from agent YAML (after processing)
 * @param {Object} agentYaml - Parsed agent YAML
 * @returns {Object} Agent YAML without install_config
 */
function stripInstallConfig(agentYaml) {
  const result = structuredClone(agentYaml);
  if (result.agent) {
    delete result.agent.install_config;
  }
  return result;
}

/**
 * Process entire agent YAML object with template variables
 * @param {Object} agentYaml - Parsed agent YAML
 * @param {Object} variables - Answers from install_config questions
 * @returns {Object} Processed agent YAML
 */
function processAgentYaml(agentYaml, variables) {
  // Convert to JSON string, process templates, parse back
  const jsonString = JSON.stringify(agentYaml, null, 2);
  const processed = processTemplate(jsonString, variables);
  return JSON.parse(processed);
}

/**
 * Get default values from install_config questions
 * @param {Object} installConfig - install_config section
 * @returns {Object} Default values keyed by variable name
 */
function getDefaultValues(installConfig) {
  const defaults = {};

  if (!installConfig?.questions) {
    return defaults;
  }

  for (const question of installConfig.questions) {
    if (question.var && question.default !== undefined) {
      defaults[question.var] = question.default;
    }
  }

  return defaults;
}

module.exports = {
  processTemplate,
  processConditionals,
  processVariables,
  extractInstallConfig,
  stripInstallConfig,
  processAgentYaml,
  getDefaultValues,
  cleanupEmptyLines,
};
