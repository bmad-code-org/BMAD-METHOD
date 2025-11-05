const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { getProjectRoot, getModulePath } = require('../../../lib/project-root');
const { CLIUtils } = require('../../../lib/cli-utils');

class ConfigCollector {
  constructor() {
    this.collectedConfig = {};
    this.existingConfig = null;
    this.currentProjectDir = null;
  }

  /**
   * Load existing config if it exists from module config files
   * @param {string} projectDir - Target project directory
   */
  async loadExistingConfig(projectDir) {
    const bmadDir = path.join(projectDir, 'bmad');
    this.existingConfig = {};

    // Check if bmad directory exists
    if (!(await fs.pathExists(bmadDir))) {
      return false;
    }

    // Dynamically discover all installed modules by scanning bmad directory
    // A directory is a module ONLY if it contains a config.yaml file
    let foundAny = false;
    const entries = await fs.readdir(bmadDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const moduleConfigPath = path.join(bmadDir, entry.name, 'config.yaml');
        if (await fs.pathExists(moduleConfigPath)) {
          try {
            const content = await fs.readFile(moduleConfigPath, 'utf8');
            const moduleConfig = yaml.load(content);
            if (moduleConfig) {
              this.existingConfig[entry.name] = moduleConfig;
              foundAny = true;
            }
          } catch {
            // Ignore parse errors for individual modules
          }
        }
      }
    }

    if (foundAny) {
      console.log(chalk.cyan('\n📋 Found existing BMAD module configurations'));
    }

    return foundAny;
  }

  /**
   * Collect configuration for all modules
   * @param {Array} modules - List of modules to configure (including 'core')
   * @param {string} projectDir - Target project directory
   */
  async collectAllConfigurations(modules, projectDir) {
    await this.loadExistingConfig(projectDir);

    // Check if core was already collected (e.g., in early collection phase)
    const coreAlreadyCollected = this.collectedConfig.core && Object.keys(this.collectedConfig.core).length > 0;

    // If core wasn't already collected, include it
    const allModules = coreAlreadyCollected ? modules.filter((m) => m !== 'core') : ['core', ...modules.filter((m) => m !== 'core')];

    // Store all answers across modules for cross-referencing
    if (!this.allAnswers) {
      this.allAnswers = {};
    }

    for (const moduleName of allModules) {
      await this.collectModuleConfig(moduleName, projectDir);
    }

    // Add metadata
    this.collectedConfig._meta = {
      version: require(path.join(getProjectRoot(), 'package.json')).version,
      installDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    return this.collectedConfig;
  }

  /**
   * Collect configuration for a single module (Quick Update mode - only new fields)
   * @param {string} moduleName - Module name
   * @param {string} projectDir - Target project directory
   * @param {boolean} silentMode - If true, only prompt for new/missing fields
   * @returns {boolean} True if new fields were prompted, false if all fields existed
   */
  async collectModuleConfigQuick(moduleName, projectDir, silentMode = true) {
    this.currentProjectDir = projectDir;

    // Load existing config if not already loaded
    if (!this.existingConfig) {
      await this.loadExistingConfig(projectDir);
    }

    // Initialize allAnswers if not already initialized
    if (!this.allAnswers) {
      this.allAnswers = {};
    }

    // Load module's install config schema
    const installerConfigPath = path.join(getModulePath(moduleName), '_module-installer', 'install-config.yaml');
    const legacyConfigPath = path.join(getModulePath(moduleName), 'config.yaml');

    let configPath = null;
    if (await fs.pathExists(installerConfigPath)) {
      configPath = installerConfigPath;
    } else if (await fs.pathExists(legacyConfigPath)) {
      configPath = legacyConfigPath;
    } else {
      // No config schema for this module - use existing values
      if (this.existingConfig && this.existingConfig[moduleName]) {
        if (!this.collectedConfig[moduleName]) {
          this.collectedConfig[moduleName] = {};
        }
        this.collectedConfig[moduleName] = { ...this.existingConfig[moduleName] };
      }
      return false;
    }

    const configContent = await fs.readFile(configPath, 'utf8');
    const moduleConfig = yaml.load(configContent);

    if (!moduleConfig) {
      return false;
    }

    // Compare schema with existing config to find new/missing fields
    const configKeys = Object.keys(moduleConfig).filter((key) => key !== 'prompt');
    const existingKeys = this.existingConfig && this.existingConfig[moduleName] ? Object.keys(this.existingConfig[moduleName]) : [];

    const newKeys = configKeys.filter((key) => {
      const item = moduleConfig[key];
      // Check if it's a config item and doesn't exist in existing config
      return item && typeof item === 'object' && item.prompt && !existingKeys.includes(key);
    });

    // If in silent mode and no new keys, use existing config and skip prompts
    if (silentMode && newKeys.length === 0) {
      if (this.existingConfig && this.existingConfig[moduleName]) {
        if (!this.collectedConfig[moduleName]) {
          this.collectedConfig[moduleName] = {};
        }
        this.collectedConfig[moduleName] = { ...this.existingConfig[moduleName] };

        // Also populate allAnswers for cross-referencing
        for (const [key, value] of Object.entries(this.existingConfig[moduleName])) {
          this.allAnswers[`${moduleName}_${key}`] = value;
        }
      }
      return false; // No new fields
    }

    // If we have new fields, show prompt section and collect only new fields
    if (newKeys.length > 0) {
      console.log(chalk.yellow(`\n📋 New configuration options available for ${moduleName}`));
      if (moduleConfig.prompt) {
        const prompts = Array.isArray(moduleConfig.prompt) ? moduleConfig.prompt : [moduleConfig.prompt];
        CLIUtils.displayPromptSection(prompts);
      }

      const questions = [];
      for (const key of newKeys) {
        const item = moduleConfig[key];
        const question = await this.buildQuestion(moduleName, key, item);
        if (question) {
          questions.push(question);
        }
      }

      if (questions.length > 0) {
        console.log(); // Line break before questions
        const answers = await inquirer.prompt(questions);

        // Store answers for cross-referencing
        Object.assign(this.allAnswers, answers);

        // Process answers and build result values
        for (const key of Object.keys(answers)) {
          const originalKey = key.replace(`${moduleName}_`, '');
          const item = moduleConfig[originalKey];
          const value = answers[key];

          let result;
          if (Array.isArray(value)) {
            result = value;
          } else if (item.result) {
            result = this.processResultTemplate(item.result, value);
          } else {
            result = value;
          }

          if (!this.collectedConfig[moduleName]) {
            this.collectedConfig[moduleName] = {};
          }
          this.collectedConfig[moduleName][originalKey] = result;
        }
      }
    }

    // Copy over existing values for fields that weren't prompted
    if (this.existingConfig && this.existingConfig[moduleName]) {
      if (!this.collectedConfig[moduleName]) {
        this.collectedConfig[moduleName] = {};
      }
      for (const [key, value] of Object.entries(this.existingConfig[moduleName])) {
        if (!this.collectedConfig[moduleName][key]) {
          this.collectedConfig[moduleName][key] = value;
          this.allAnswers[`${moduleName}_${key}`] = value;
        }
      }
    }

    return newKeys.length > 0; // Return true if we prompted for new fields
  }

  /**
   * Process a result template with value substitution
   * @param {*} resultTemplate - The result template
   * @param {*} value - The value to substitute
   * @returns {*} Processed result
   */
  processResultTemplate(resultTemplate, value) {
    let result = resultTemplate;

    if (typeof result === 'string' && value !== undefined) {
      if (typeof value === 'string') {
        result = result.replace('{value}', value);
      } else if (typeof value === 'boolean' || typeof value === 'number') {
        if (result === '{value}') {
          result = value;
        } else {
          result = result.replace('{value}', value);
        }
      } else {
        result = value;
      }

      if (typeof result === 'string') {
        result = result.replaceAll(/{([^}]+)}/g, (match, configKey) => {
          if (configKey === 'project-root') {
            return '{project-root}';
          }
          if (configKey === 'value') {
            return match;
          }

          let configValue = this.allAnswers[configKey] || this.allAnswers[`${configKey}`];
          if (!configValue) {
            for (const [answerKey, answerValue] of Object.entries(this.allAnswers)) {
              if (answerKey.endsWith(`_${configKey}`)) {
                configValue = answerValue;
                break;
              }
            }
          }

          if (!configValue) {
            for (const mod of Object.keys(this.collectedConfig)) {
              if (mod !== '_meta' && this.collectedConfig[mod] && this.collectedConfig[mod][configKey]) {
                configValue = this.collectedConfig[mod][configKey];
                if (typeof configValue === 'string' && configValue.includes('{project-root}/')) {
                  configValue = configValue.replace('{project-root}/', '');
                }
                break;
              }
            }
          }

          return configValue || match;
        });
      }
    }

    return result;
  }

  /**
   * Collect configuration for a single module
   * @param {string} moduleName - Module name
   * @param {string} projectDir - Target project directory
   * @param {boolean} skipLoadExisting - Skip loading existing config (for early core collection)
   * @param {boolean} skipCompletion - Skip showing completion message (for early core collection)
   */
  async collectModuleConfig(moduleName, projectDir, skipLoadExisting = false, skipCompletion = false) {
    this.currentProjectDir = projectDir;
    // Load existing config if needed and not already loaded
    if (!skipLoadExisting && !this.existingConfig) {
      await this.loadExistingConfig(projectDir);
    }

    // Initialize allAnswers if not already initialized
    if (!this.allAnswers) {
      this.allAnswers = {};
    }
    // Load module's config.yaml (check new location first, then fallback)
    const installerConfigPath = path.join(getModulePath(moduleName), '_module-installer', 'install-config.yaml');
    const legacyConfigPath = path.join(getModulePath(moduleName), 'config.yaml');

    let configPath = null;
    if (await fs.pathExists(installerConfigPath)) {
      configPath = installerConfigPath;
    } else if (await fs.pathExists(legacyConfigPath)) {
      configPath = legacyConfigPath;
    } else {
      // No config for this module
      return;
    }

    const configContent = await fs.readFile(configPath, 'utf8');
    const moduleConfig = yaml.load(configContent);

    if (!moduleConfig) {
      return;
    }

    // Display module prompts using better formatting
    if (moduleConfig.prompt) {
      const prompts = Array.isArray(moduleConfig.prompt) ? moduleConfig.prompt : [moduleConfig.prompt];
      CLIUtils.displayPromptSection(prompts);
    }

    // Process each config item
    const questions = [];
    const configKeys = Object.keys(moduleConfig).filter((key) => key !== 'prompt');

    for (const key of configKeys) {
      const item = moduleConfig[key];

      // Skip if not a config object
      if (!item || typeof item !== 'object' || !item.prompt) {
        continue;
      }

      const question = await this.buildQuestion(moduleName, key, item);
      if (question) {
        questions.push(question);
      }
    }

    if (questions.length > 0) {
      console.log(); // Line break before questions
      const answers = await inquirer.prompt(questions);

      // Store answers for cross-referencing
      Object.assign(this.allAnswers, answers);

      // Process answers and build result values
      for (const key of Object.keys(answers)) {
        const originalKey = key.replace(`${moduleName}_`, '');
        const item = moduleConfig[originalKey];
        const value = answers[key];

        // Build the result using the template
        let result;

        // For arrays (multi-select), handle differently
        if (Array.isArray(value)) {
          // If there's a result template and it's a string, don't use it for arrays
          // Just use the array value directly
          result = value;
        } else if (item.result) {
          result = item.result;

          // Replace placeholders only for strings
          if (typeof result === 'string' && value !== undefined) {
            // Replace {value} with the actual value
            if (typeof value === 'string') {
              result = result.replace('{value}', value);
            } else if (typeof value === 'boolean' || typeof value === 'number') {
              // For boolean and number values, if result is just "{value}", use the raw value
              if (result === '{value}') {
                result = value;
              } else {
                // Otherwise replace in the string
                result = result.replace('{value}', value);
              }
            } else {
              // For non-string values, use directly
              result = value;
            }

            // Only do further replacements if result is still a string
            if (typeof result === 'string') {
              // Replace references to other config values
              result = result.replaceAll(/{([^}]+)}/g, (match, configKey) => {
                // Check if it's a special placeholder
                if (configKey === 'project-root') {
                  return '{project-root}';
                }

                // Skip if it's the 'value' placeholder we already handled
                if (configKey === 'value') {
                  return match;
                }

                // Look for the config value across all modules
                // First check if it's in the current module's answers
                let configValue = answers[`${moduleName}_${configKey}`];

                // Then check all answers (for cross-module references like outputFolder)
                if (!configValue) {
                  // Try with various module prefixes
                  for (const [answerKey, answerValue] of Object.entries(this.allAnswers)) {
                    if (answerKey.endsWith(`_${configKey}`)) {
                      configValue = answerValue;
                      break;
                    }
                  }
                }

                // Check in already collected config
                if (!configValue) {
                  for (const mod of Object.keys(this.collectedConfig)) {
                    if (mod !== '_meta' && this.collectedConfig[mod] && this.collectedConfig[mod][configKey]) {
                      configValue = this.collectedConfig[mod][configKey];
                      // Extract just the value part if it's a result template
                      if (typeof configValue === 'string' && configValue.includes('{project-root}/')) {
                        configValue = configValue.replace('{project-root}/', '');
                      }
                      break;
                    }
                  }
                }

                return configValue || match;
              });
            }
          }
        } else {
          // No result template, use value directly
          result = value;
        }

        // Store only the result value (no prompts, defaults, examples, etc.)
        if (!this.collectedConfig[moduleName]) {
          this.collectedConfig[moduleName] = {};
        }
        this.collectedConfig[moduleName][originalKey] = result;
      }

      // Display module completion message after collecting all answers (unless skipped)
      if (!skipCompletion) {
        CLIUtils.displayModuleComplete(moduleName);
      }
    }
  }

  /**
   * Build an inquirer question from a config item
   * @param {string} moduleName - Module name
   * @param {string} key - Config key
   * @param {Object} item - Config item definition
   */
  async buildQuestion(moduleName, key, item) {
    const questionName = `${moduleName}_${key}`;

    // Check for existing value
    let existingValue = null;
    if (this.existingConfig && this.existingConfig[moduleName]) {
      existingValue = this.existingConfig[moduleName][key];

      // Clean up existing value - remove {project-root}/ prefix if present
      // This prevents duplication when the result template adds it back
      if (typeof existingValue === 'string' && existingValue.startsWith('{project-root}/')) {
        existingValue = existingValue.replace('{project-root}/', '');
      }
    }

    // Determine question type and default value
    let questionType = 'input';
    let defaultValue = item.default;
    let choices = null;

    if (typeof defaultValue === 'string' && defaultValue.includes('{directory_name}') && this.currentProjectDir) {
      const dirName = path.basename(this.currentProjectDir);
      defaultValue = defaultValue.replaceAll('{directory_name}', dirName);
    }

    // Handle different question types
    if (item['single-select']) {
      questionType = 'list';
      choices = item['single-select'];
      if (existingValue && choices.includes(existingValue)) {
        defaultValue = existingValue;
      }
    } else if (item['multi-select']) {
      questionType = 'checkbox';
      choices = item['multi-select'].map((choice) => ({
        name: choice,
        value: choice,
        checked: existingValue
          ? existingValue.includes(choice)
          : item.default && Array.isArray(item.default)
            ? item.default.includes(choice)
            : false,
      }));
    } else if (typeof defaultValue === 'boolean') {
      questionType = 'confirm';
    }

    // Build the prompt message
    let message = '';

    // Handle array prompts for multi-line messages
    if (Array.isArray(item.prompt)) {
      message = item.prompt.join('\n');
    } else {
      message = item.prompt;
    }

    // Add current value indicator for existing configs
    if (existingValue !== null && existingValue !== undefined) {
      if (typeof existingValue === 'boolean') {
        message += chalk.dim(` (current: ${existingValue ? 'true' : 'false'})`);
        defaultValue = existingValue;
      } else if (Array.isArray(existingValue)) {
        message += chalk.dim(` (current: ${existingValue.join(', ')})`);
      } else if (questionType !== 'list') {
        // Show the cleaned value (without {project-root}/) for display
        message += chalk.dim(` (current: ${existingValue})`);
        defaultValue = existingValue;
      }
    } else if (item.example && questionType === 'input') {
      // Show example for input fields
      const exampleText = typeof item.example === 'string' ? item.example.replace('{project-root}/', '') : JSON.stringify(item.example);
      message += chalk.dim(` (e.g., ${exampleText})`);
    }

    const question = {
      type: questionType,
      name: questionName,
      message: message,
      default: defaultValue,
    };

    // Add choices for select types
    if (choices) {
      question.choices = choices;
    }

    // Add validation for input fields
    if (questionType === 'input') {
      question.validate = (input) => {
        if (!input && item.required) {
          return 'This field is required';
        }
        return true;
      };
    }

    return question;
  }

  /**
   * Deep merge two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   */
  deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
          result[key] = this.deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }
}

module.exports = { ConfigCollector };
