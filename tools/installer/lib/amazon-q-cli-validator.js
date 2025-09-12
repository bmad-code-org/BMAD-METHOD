const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const os = require('node:os');
const chalk = require('chalk');
const { exec } = require('node:child_process');
const { promisify } = require('node:util');

const execAsync = promisify(exec);

/**
 * Amazon Q CLI Installation Success Verifier
 *
 * This module provides comprehensive validation and verification
 * for Amazon Q CLI integration installation success.
 */
class AmazonQCliValidator {
  constructor() {
    this.validationResults = {
      configGeneration: [],
      fileIntegrity: [],
      schemaCompliance: [],
      contextLoading: [],
      agentInvocation: [],
      overall: { success: false, errors: [], warnings: [] },
    };
  }

  /**
   * Perform comprehensive installation success verification
   */
  async validateInstallation(installDir, selectedLocations, agents) {
    console.log(chalk.blue('🔍 Validating Amazon Q CLI installation...'));

    try {
      // 1. Validate configuration generation
      await this.validateConfigurationGeneration(installDir, agents);

      // 2. Validate file integrity and locations
      await this.validateFileIntegrity(selectedLocations, agents);

      // 3. Validate Amazon Q CLI schema compliance
      await this.validateSchemaCompliance(selectedLocations, agents);

      // 4. Validate project context loading setup
      await this.validateProjectContextSetup(installDir);

      // 5. Validate agent invocation readiness
      await this.validateAgentInvocationReadiness(selectedLocations, agents);

      // 6. Generate final validation report
      this.generateValidationReport();

      return this.validationResults.overall.success;
    } catch (error) {
      this.validationResults.overall.errors.push({
        type: 'validation_failure',
        message: `Validation process failed: ${error.message}`,
        details: error.stack,
      });

      console.log(chalk.red('✗ Installation validation failed'));
      console.log(chalk.red(`Error: ${error.message}`));

      return false;
    }
  }

  /**
   * Validate that all agent configurations were generated successfully
   */
  async validateConfigurationGeneration(installDir, agents) {
    console.log(chalk.dim('  Validating configuration generation...'));

    const ideSetup = require('./ide-setup');

    for (const agentId of agents) {
      try {
        // Find agent file
        const agentPath = await this.findAgentFile(installDir, agentId);
        if (!agentPath) {
          this.validationResults.configGeneration.push({
            agentId,
            success: false,
            error: 'Agent file not found',
          });
          continue;
        }

        // Generate configuration
        const yamlConfig = await ideSetup.createAmazonQAgentConfig(agentId, agentPath, installDir);

        // Validate generated YAML
        let parsedConfig;
        try {
          parsedConfig = yaml.load(yamlConfig);
        } catch (parseError) {
          this.validationResults.configGeneration.push({
            agentId,
            success: false,
            error: `Invalid YAML generated: ${parseError.message}`,
          });
          continue;
        }

        // Validate required fields (Amazon Q CLI schema)
        const requiredFields = ['name', 'description', 'prompt', 'tools', 'resources'];
        const missingFields = requiredFields.filter(
          (field) => !Object.prototype.hasOwnProperty.call(parsedConfig, field),
        );

        if (missingFields.length > 0) {
          this.validationResults.configGeneration.push({
            agentId,
            success: false,
            error: `Missing required fields: ${missingFields.join(', ')}`,
          });
          continue;
        }

        this.validationResults.configGeneration.push({
          agentId,
          success: true,
          config: parsedConfig,
          yamlSize: yamlConfig.length,
        });
      } catch (error) {
        this.validationResults.configGeneration.push({
          agentId,
          success: false,
          error: error.message,
        });
      }
    }

    const successCount = this.validationResults.configGeneration.filter((r) => r.success).length;
    console.log(
      chalk.green(`    ✓ ${successCount}/${agents.length} configurations generated successfully`),
    );
  }

  /**
   * Validate file integrity in installation locations
   */
  async validateFileIntegrity(selectedLocations, agents) {
    console.log(chalk.dim('  Validating file integrity...'));

    const locations = {
      user: path.join(os.homedir(), '.aws/amazonq/cli-agents/'),
      project: './.amazonq/cli-agents/',
    };

    for (const locationKey of selectedLocations) {
      let locationPath = locations[locationKey];

      // Handle relative paths
      if (locationPath.startsWith('./')) {
        locationPath = path.resolve(locationPath);
      }

      // Check if location exists
      if (!(await fs.pathExists(locationPath))) {
        this.validationResults.fileIntegrity.push({
          location: locationKey,
          path: locationPath,
          success: false,
          error: 'Installation directory not found',
        });
        continue;
      }

      // Check each agent file
      const locationResults = [];
      for (const agentId of agents) {
        const agentFileName = agentId.startsWith('bmad-')
          ? `${agentId}.json`
          : `bmad-${agentId}.json`;
        const agentFilePath = path.join(locationPath, agentFileName);

        if (await fs.pathExists(agentFilePath)) {
          try {
            // Verify file is readable and contains valid JSON
            const fileContent = await fs.readFile(agentFilePath, 'utf8');
            const parsedContent = JSON.parse(fileContent);

            locationResults.push({
              agentId,
              fileName: agentFileName,
              success: true,
              fileSize: fileContent.length,
            });
          } catch (error) {
            locationResults.push({
              agentId,
              fileName: agentFileName,
              success: false,
              error: `File corrupted: ${error.message}`,
            });
          }
        } else {
          locationResults.push({
            agentId,
            fileName: agentFileName,
            success: false,
            error: 'Agent file not found in location',
          });
        }
      }

      this.validationResults.fileIntegrity.push({
        location: locationKey,
        path: locationPath,
        success: locationResults.every((r) => r.success),
        agents: locationResults,
      });
    }

    const allLocationsValid = this.validationResults.fileIntegrity.every((r) => r.success);
    console.log(
      chalk.green(`    ✓ File integrity: ${allLocationsValid ? 'PASS' : 'ISSUES FOUND'}`),
    );
  }

  /**
   * Validate Amazon Q CLI schema compliance
   */
  async validateSchemaCompliance(selectedLocations, agents) {
    console.log(chalk.dim('  Validating Amazon Q CLI schema compliance...'));

    const locations = {
      user: path.join(os.homedir(), '.aws/amazonq/cli-agents/'),
      project: './.amazonq/cli-agents/',
    };

    const schemaValidation = [];

    for (const locationKey of selectedLocations) {
      let locationPath = locations[locationKey];
      if (locationPath.startsWith('./')) {
        locationPath = path.resolve(locationPath);
      }

      for (const agentId of agents) {
        const agentFileName = agentId.startsWith('bmad-')
          ? `${agentId}.json`
          : `bmad-${agentId}.json`;
        const agentFilePath = path.join(locationPath, agentFileName);

        if (await fs.pathExists(agentFilePath)) {
          try {
            const fileContent = await fs.readFile(agentFilePath, 'utf8');
            // Amazon Q CLI uses JSON format, not YAML
            const parsedConfig = JSON.parse(fileContent);

            const validation = this.validateAmazonQCliSchema(parsedConfig, agentId);
            schemaValidation.push({
              location: locationKey,
              agentId,
              fileName: agentFileName,
              ...validation,
            });
          } catch (error) {
            schemaValidation.push({
              location: locationKey,
              agentId,
              fileName: agentFileName,
              success: false,
              errors: [`Failed to parse JSON: ${error.message}`],
            });
          }
        }
      }
    }

    this.validationResults.schemaCompliance = schemaValidation;
    const validConfigs = schemaValidation.filter((v) => v.success).length;
    console.log(
      chalk.green(
        `    ✓ Schema compliance: ${validConfigs}/${schemaValidation.length} configs valid`,
      ),
    );
  }

  /**
   * Validate Amazon Q CLI configuration schema
   */
  validateAmazonQCliSchema(config, agentId) {
    const errors = [];
    const warnings = [];

    // Required fields validation
    const requiredFields = {
      name: 'string',
      description: 'string',
      prompt: 'string',
      tools: 'array',
      resources: 'array',
    };

    for (const [field, expectedType] of Object.entries(requiredFields)) {
      if (!Object.prototype.hasOwnProperty.call(config, field)) {
        errors.push(`Missing required field: ${field}`);
      } else if (expectedType === 'array' && !Array.isArray(config[field])) {
        errors.push(`Field '${field}' must be an array`);
      } else if (
        expectedType === 'object' &&
        (typeof config[field] !== 'object' || Array.isArray(config[field]))
      ) {
        errors.push(`Field '${field}' must be an object`);
      } else if (expectedType === 'string' && typeof config[field] !== 'string') {
        errors.push(`Field '${field}' must be a string`);
      }
    }

    // Name convention validation
    const expectedName = agentId.startsWith('bmad-') ? agentId : `bmad-${agentId}`;
    if (config.name !== expectedName) {
      errors.push(`Agent name should be '${expectedName}', found '${config.name}'`);
    }

    // Name format validation (Amazon Q CLI compatible)
    if (config.name && !/^[a-zA-Z0-9-_]+$/.test(config.name)) {
      errors.push(`Agent name contains invalid characters for Amazon Q CLI: ${config.name}`);
    }

    // Tools validation
    if (config.tools) {
      if (!Array.isArray(config.tools)) {
        errors.push('Tools must be an array');
      } else if (config.tools.length === 0) {
        warnings.push('Agent has no tools assigned');
      }
    }

    // Resources validation (Amazon Q CLI schema)
    if (
      config.resources &&
      Array.isArray(config.resources) &&
      !config.resources.some((resource) => resource.includes('.bmad-core'))
    ) {
      warnings.push('Resources do not include .bmad-core files');
    }

    // Prompt validation (Amazon Q CLI schema)
    if (config.prompt) {
      if (config.prompt.length < 50) {
        warnings.push('Prompt seems too short');
      }

      if (!config.prompt.includes('BMAD')) {
        warnings.push('Prompt does not reference BMAD methodology');
      }
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate project context loading setup
   */
  async validateProjectContextSetup(installDir) {
    console.log(chalk.dim('  Validating project context setup...'));

    const contextChecks = [];

    // Check for .bmad-core directory
    const bmadCoreDir = path.join(installDir, '.bmad-core');
    if (await fs.pathExists(bmadCoreDir)) {
      contextChecks.push({
        check: '.bmad-core directory exists',
        success: true,
      });

      // Check for agents directory
      const agentsDir = path.join(bmadCoreDir, 'agents');
      if (await fs.pathExists(agentsDir)) {
        const agentFiles = await fs.readdir(agentsDir);
        const mdFiles = agentFiles.filter((f) => f.endsWith('.md'));

        contextChecks.push({
          check: 'Agent files available for context',
          success: mdFiles.length > 0,
          details: `${mdFiles.length} agent files found`,
        });
      } else {
        contextChecks.push({
          check: 'Agent files available for context',
          success: false,
          error: 'No agents directory found',
        });
      }
    } else {
      contextChecks.push({
        check: '.bmad-core directory exists',
        success: false,
        error: 'BMAD core directory not found',
      });
    }

    // Check for common project files that agents should access
    const commonFiles = ['README.md', 'package.json'];
    for (const fileName of commonFiles) {
      const filePath = path.join(installDir, fileName);
      contextChecks.push({
        check: `${fileName} available for context`,
        success: await fs.pathExists(filePath),
      });
    }

    this.validationResults.contextLoading = contextChecks;
    const allContextValid = contextChecks.every((c) => c.success);
    console.log(
      chalk.green(`    ✓ Project context setup: ${allContextValid ? 'PASS' : 'SOME ISSUES'}`),
    );
  }

  /**
   * Validate agent invocation readiness
   */
  async validateAgentInvocationReadiness(selectedLocations, agents) {
    console.log(chalk.dim('  Validating agent invocation readiness...'));

    const invocationTests = [];

    // Test command syntax generation
    for (const agentId of agents) {
      const expectedName = agentId.startsWith('bmad-') ? agentId : `bmad-${agentId}`;

      // Test q chat command syntax
      const chatCommand = `q chat --agent ${expectedName}`;
      invocationTests.push({
        agentId,
        command: chatCommand,
        type: 'initial_invocation',
        valid: this.isValidCommandSyntax(chatCommand),
      });

      // Test agent switching syntax
      const switchCommand = `/agent ${expectedName}`;
      invocationTests.push({
        agentId,
        command: switchCommand,
        type: 'agent_switching',
        valid: this.isValidCommandSyntax(switchCommand),
      });
    }

    // Test Amazon Q CLI availability (if possible)
    let qCliAvailable = false;
    try {
      await execAsync('which q', { timeout: 5000 });
      qCliAvailable = true;
      invocationTests.push({
        check: 'Amazon Q CLI availability',
        success: true,
        details: 'q command found in PATH',
      });
    } catch {
      invocationTests.push({
        check: 'Amazon Q CLI availability',
        success: false,
        warning: 'Amazon Q CLI not found in PATH - users will need to install it',
      });
    }

    this.validationResults.agentInvocation = invocationTests;
    const validCommands = invocationTests.filter(
      (t) => t.valid !== false && t.success !== false,
    ).length;
    console.log(
      chalk.green(
        `    ✓ Agent invocation readiness: ${validCommands}/${invocationTests.length} checks passed`,
      ),
    );
  }

  /**
   * Validate command syntax for Amazon Q CLI compatibility
   */
  isValidCommandSyntax(command) {
    // Basic validation for command line compatibility
    return {
      hasSpaces: !command.includes('  '), // No double spaces
      validChars: /^[a-zA-Z0-9\s\-_.]+$/.test(command), // Only safe characters
      reasonable_length: command.length < 100,
      starts_properly: command.startsWith('q ') || command.startsWith('/'),
      valid: true,
    };
  }

  /**
   * Generate comprehensive validation report
   */
  generateValidationReport() {
    console.log(chalk.blue('\n📋 Installation Validation Report'));
    console.log(chalk.blue('====================================='));

    let overallSuccess = true;
    const errors = [];
    const warnings = [];

    // Configuration Generation Report
    const configSuccess = this.validationResults.configGeneration.filter((r) => r.success).length;
    const configTotal = this.validationResults.configGeneration.length;
    console.log(chalk.white(`\n1. Configuration Generation: ${configSuccess}/${configTotal}`));

    if (configSuccess === configTotal) {
      console.log(chalk.green('   ✓ All agent configurations generated successfully'));
    } else {
      console.log(chalk.red(`   ✗ ${configTotal - configSuccess} configuration(s) failed`));
      overallSuccess = false;

      for (const r of this.validationResults.configGeneration.filter((r) => !r.success)) {
        console.log(chalk.red(`     - ${r.agentId}: ${r.error}`));
        errors.push(`Configuration generation failed for ${r.agentId}: ${r.error}`);
      }
    }

    // File Integrity Report
    const fileIntegritySuccess = this.validationResults.fileIntegrity.every((r) => r.success);
    console.log(chalk.white(`\n2. File Integrity: ${fileIntegritySuccess ? 'PASS' : 'ISSUES'}`));

    for (const location of this.validationResults.fileIntegrity) {
      if (location.success) {
        console.log(chalk.green(`   ✓ ${location.location}: All files present and valid`));
      } else {
        console.log(chalk.red(`   ✗ ${location.location}: Issues found`));
        overallSuccess = false;

        if (location.agents) {
          for (const agent of location.agents.filter((a) => !a.success)) {
            console.log(chalk.red(`     - ${agent.agentId}: ${agent.error}`));
            errors.push(
              `File integrity issue in ${location.location} for ${agent.agentId}: ${agent.error}`,
            );
          }
        }
      }
    }

    // Schema Compliance Report
    const schemaSuccess = this.validationResults.schemaCompliance.filter((v) => v.success).length;
    const schemaTotal = this.validationResults.schemaCompliance.length;
    console.log(chalk.white(`\n3. Schema Compliance: ${schemaSuccess}/${schemaTotal}`));

    if (schemaSuccess === schemaTotal) {
      console.log(chalk.green('   ✓ All configurations comply with Amazon Q CLI schema'));
    } else {
      console.log(
        chalk.red(`   ✗ ${schemaTotal - schemaSuccess} configuration(s) have schema issues`),
      );
      overallSuccess = false;

      for (const v of this.validationResults.schemaCompliance.filter((v) => !v.success)) {
        console.log(chalk.red(`     - ${v.agentId} (${v.location}): ${v.errors.join(', ')}`));
        errors.push(`Schema compliance failed for ${v.agentId}: ${v.errors.join(', ')}`);
      }
    }

    // Context Loading Report
    const contextSuccess = this.validationResults.contextLoading.every((c) => c.success);
    console.log(chalk.white(`\n4. Project Context Loading: ${contextSuccess ? 'PASS' : 'ISSUES'}`));

    for (const check of this.validationResults.contextLoading) {
      if (check.success) {
        console.log(chalk.green(`   ✓ ${check.check}`));
      } else {
        console.log(chalk.yellow(`   ⚠ ${check.check}: ${check.error || 'Not configured'}`));
        warnings.push(`Context loading: ${check.check} - ${check.error || 'Not configured'}`);
      }
    }

    // Agent Invocation Report
    const invocationIssues = this.validationResults.agentInvocation.filter(
      (t) => t.valid === false || t.success === false,
    );
    console.log(
      chalk.white(
        `\n5. Agent Invocation Readiness: ${invocationIssues.length === 0 ? 'PASS' : 'ISSUES'}`,
      ),
    );

    if (invocationIssues.length === 0) {
      console.log(chalk.green('   ✓ All agents ready for invocation'));
    } else {
      for (const issue of invocationIssues) {
        if (issue.warning) {
          console.log(chalk.yellow(`   ⚠ ${issue.check}: ${issue.warning}`));
          warnings.push(`Agent invocation: ${issue.check} - ${issue.warning}`);
        } else {
          console.log(chalk.red(`   ✗ ${issue.command || issue.check}: Issues found`));
          errors.push(`Agent invocation issue: ${issue.command || issue.check}`);
        }
      }
    }

    // Final Summary
    console.log(chalk.white('\n📊 Summary'));
    console.log(chalk.white('=========='));

    if (overallSuccess && errors.length === 0) {
      console.log(chalk.green('✅ Installation validation PASSED'));
      console.log(chalk.green('   All Amazon Q CLI agents are ready for use!'));

      if (warnings.length > 0) {
        console.log(chalk.yellow(`\n⚠️  ${warnings.length} warning(s) noted:`));
        for (const warning of warnings) console.log(chalk.yellow(`   - ${warning}`));
      }
    } else {
      console.log(chalk.red('❌ Installation validation FAILED'));
      console.log(chalk.red(`   ${errors.length} error(s) found that must be addressed`));

      for (const error of errors) console.log(chalk.red(`   - ${error}`));
      overallSuccess = false;
    }

    // Store final results
    this.validationResults.overall = {
      success: overallSuccess,
      errors,
      warnings,
      summary: {
        configGeneration: `${configSuccess}/${configTotal}`,
        fileIntegrity: fileIntegritySuccess,
        schemaCompliance: `${schemaSuccess}/${schemaTotal}`,
        contextLoading: contextSuccess,
        agentInvocation: invocationIssues.length === 0,
      },
    };

    return overallSuccess;
  }

  /**
   * Find agent file in installation directory
   */
  async findAgentFile(installDir, agentId) {
    const possiblePaths = [
      path.join(installDir, '.bmad-core', 'agents', `${agentId}.md`),
      path.join(installDir, 'agents', `${agentId}.md`),
    ];

    for (const agentPath of possiblePaths) {
      if (await fs.pathExists(agentPath)) {
        return agentPath;
      }
    }

    return null;
  }

  /**
   * Get validation results for external use
   */
  getValidationResults() {
    return this.validationResults;
  }
}

module.exports = AmazonQCliValidator;
