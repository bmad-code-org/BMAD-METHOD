/* eslint-disable unicorn/prefer-module, unicorn/prefer-node-protocol */
/**
 * {{MODULE_NAME}} Module Installer
 * Custom installation logic for complex module setup
 *
 * This is a template - replace {{VARIABLES}} with actual values
 */

// const fs = require('fs'); // Uncomment when implementing file operations
const path = require('path');

/**
 * Main installation function
 * Called by BMAD installer when processing the module
 */
async function installModule(config) {
  console.log('🚀 Installing {{MODULE_NAME}} module...');
  console.log(`   Version: ${config.version}`);
  console.log(`   Module Code: ${config.module_code}`);

  try {
    // Step 1: Validate environment
    await validateEnvironment(config);

    // Step 2: Setup custom configurations
    await setupConfigurations(config);

    // Step 3: Initialize module-specific features
    await initializeFeatures(config);

    // Step 4: Run post-install tasks
    await runPostInstallTasks(config);

    console.log('✅ {{MODULE_NAME}} module installed successfully!');
    return {
      success: true,
      message: 'Module installed and configured',
    };
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Validate that the environment meets module requirements
 */
async function validateEnvironment(config) {
  console.log('   Validating environment...');

  // TODO: Add environment checks
  // Examples:
  // - Check for required tools/binaries
  // - Verify permissions
  // - Check network connectivity
  // - Validate API keys

  // Placeholder validation
  if (!config.project_root) {
    throw new Error('Project root not defined');
  }

  console.log('   ✓ Environment validated');
}

/**
 * Setup module-specific configurations
 */
async function setupConfigurations(config) {
  console.log('   Setting up configurations...');

  // TODO: Add configuration setup
  // Examples:
  // - Create config files
  // - Setup environment variables
  // - Configure external services
  // - Initialize settings

  // Placeholder configuration
  const configPath = path.join(config.project_root, 'bmad', config.module_code, 'config.json');

  // Example of module config that would be created
  // const moduleConfig = {
  //   installed: new Date().toISOString(),
  //   settings: {
  //     // Add default settings
  //   }
  // };

  // Note: This is a placeholder - actual implementation would write the file
  console.log(`   ✓ Would create config at: ${configPath}`);
  console.log('   ✓ Configurations complete');
}

/**
 * Initialize module-specific features
 */
async function initializeFeatures(config) {
  console.log('   Initializing features...');

  // TODO: Add feature initialization
  // Examples:
  // - Create database schemas
  // - Setup cron jobs
  // - Initialize caches
  // - Register webhooks
  // - Setup file watchers

  // Module-specific initialization based on type
  switch (config.module_category) {
    case 'data': {
      await initializeDataFeatures(config);
      break;
    }
    case 'automation': {
      await initializeAutomationFeatures(config);
      break;
    }
    case 'integration': {
      await initializeIntegrationFeatures(config);
      break;
    }
    default: {
      console.log('   - Using standard initialization');
    }
  }

  console.log('   ✓ Features initialized');
}

/**
 * Initialize data-related features
 */
async function initializeDataFeatures(/* config */) {
  console.log('   - Setting up data storage...');
  // TODO: Setup databases, data folders, etc.
}

/**
 * Initialize automation features
 */
async function initializeAutomationFeatures(/* config */) {
  console.log('   - Setting up automation hooks...');
  // TODO: Setup triggers, watchers, schedulers
}

/**
 * Initialize integration features
 */
async function initializeIntegrationFeatures(/* config */) {
  console.log('   - Setting up integrations...');
  // TODO: Configure APIs, webhooks, external services
}

/**
 * Run post-installation tasks
 */
async function runPostInstallTasks(/* config */) {
  console.log('   Running post-install tasks...');

  // TODO: Add post-install tasks
  // Examples:
  // - Generate sample data
  // - Run initial workflows
  // - Send notifications
  // - Update registries

  console.log('   ✓ Post-install tasks complete');
}

/**
 * Initialize database for the module (optional)
 */
async function initDatabase(/* config */) {
  console.log('   Initializing database...');

  // TODO: Add database initialization
  // This function can be called from install-config.yaml

  console.log('   ✓ Database initialized');
}

/**
 * Generate sample data for the module (optional)
 */
async function generateSamples(config) {
  console.log('   Generating sample data...');

  // TODO: Create sample files, data, configurations
  // This helps users understand how to use the module

  const samplesPath = path.join(config.project_root, 'examples', config.module_code);

  console.log(`   - Would create samples at: ${samplesPath}`);
  console.log('   ✓ Samples generated');
}

/**
 * Uninstall the module (cleanup)
 */
async function uninstallModule(/* config */) {
  console.log('🗑️  Uninstalling {{MODULE_NAME}} module...');

  try {
    // TODO: Add cleanup logic
    // - Remove configurations
    // - Clean up databases
    // - Unregister services
    // - Backup user data

    console.log('✅ Module uninstalled successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Uninstall failed:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export functions for BMAD installer
module.exports = {
  installModule,
  initDatabase,
  generateSamples,
  uninstallModule,
};
