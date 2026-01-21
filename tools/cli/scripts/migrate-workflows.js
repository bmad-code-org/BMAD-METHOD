/**
 * Workflow Migration Script
 *
 * Updates workflow.yaml files to support the multi-scope system.
 * Primarily updates test_dir and other path variables to use scope-aware paths.
 *
 * Usage:
 *   node migrate-workflows.js [--dry-run] [--verbose]
 *
 * Options:
 *   --dry-run   Show what would be changed without making changes
 *   --verbose   Show detailed output
 */

const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('yaml');
const chalk = require('chalk');

// Configuration
const SRC_PATH = path.resolve(__dirname, '../../../src');
const WORKFLOW_PATTERN = '**/workflow.yaml';

// Path mappings for migration
const PATH_MIGRATIONS = [
  // Test directory migrations
  {
    pattern: /\{output_folder\}\/tests/g,
    replacement: '{scope_tests}',
    description: 'test directory to scope_tests',
  },
  {
    pattern: /\{config_source:implementation_artifacts\}\/tests/g,
    replacement: '{config_source:scope_tests}',
    description: 'implementation_artifacts tests to scope_tests',
  },
  // Planning artifacts
  {
    pattern: /\{output_folder\}\/planning-artifacts/g,
    replacement: '{config_source:planning_artifacts}',
    description: 'output_folder planning to config_source',
  },
  // Implementation artifacts
  {
    pattern: /\{output_folder\}\/implementation-artifacts/g,
    replacement: '{config_source:implementation_artifacts}',
    description: 'output_folder implementation to config_source',
  },
];

// Variables that indicate scope requirement
const SCOPE_INDICATORS = ['{scope}', '{scope_path}', '{scope_tests}', '{scope_planning}', '{scope_implementation}'];

/**
 * Find all workflow.yaml files
 */
async function findWorkflowFiles(basePath) {
  const files = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and hidden directories
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await walk(fullPath);
        }
      } else if (entry.name === 'workflow.yaml') {
        files.push(fullPath);
      }
    }
  }

  await walk(basePath);
  return files;
}

/**
 * Check if a workflow already uses scope variables
 */
function usesScope(content) {
  return SCOPE_INDICATORS.some((indicator) => content.includes(indicator));
}

/**
 * Analyze a workflow file and suggest migrations
 */
function analyzeWorkflow(content, filePath) {
  const analysis = {
    filePath,
    needsMigration: false,
    alreadyScoped: false,
    suggestions: [],
    currentVariables: [],
  };

  // Check if already uses scope
  if (usesScope(content)) {
    analysis.alreadyScoped = true;
    return analysis;
  }

  // Find variables that might need migration
  const variablePattern = /\{[^}]+\}/g;
  const matches = content.match(variablePattern) || [];
  analysis.currentVariables = [...new Set(matches)];

  // Check each migration pattern
  for (const migration of PATH_MIGRATIONS) {
    if (migration.pattern.test(content)) {
      analysis.needsMigration = true;
      analysis.suggestions.push({
        description: migration.description,
        pattern: migration.pattern.toString(),
        replacement: migration.replacement,
      });
    }
  }

  // Check for test_dir variable
  if (content.includes('test_dir:') || content.includes('test_dir:')) {
    analysis.needsMigration = true;
    analysis.suggestions.push({
      description: 'Has test_dir variable - may need scope_tests',
      pattern: 'test_dir',
      replacement: 'scope_tests via config_source',
    });
  }

  return analysis;
}

/**
 * Apply migrations to workflow content
 */
function migrateWorkflow(content) {
  let migrated = content;
  let changes = [];

  for (const migration of PATH_MIGRATIONS) {
    if (migration.pattern.test(migrated)) {
      migrated = migrated.replace(migration.pattern, migration.replacement);
      changes.push(migration.description);
    }
  }

  return { content: migrated, changes };
}

/**
 * Add scope_required marker to workflow
 */
function addScopeMarker(content) {
  try {
    const parsed = yaml.parse(content);

    // Add scope_required if not present
    if (!parsed.scope_required) {
      parsed.scope_required = false; // Default to false for backward compatibility
    }

    return yaml.stringify(parsed, { lineWidth: 120 });
  } catch {
    // If YAML parsing fails, return original
    return content;
  }
}

/**
 * Main migration function
 */
async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  const verbose = args.has('--verbose');

  console.log(chalk.bold('\nWorkflow Migration Script'));
  console.log(chalk.dim('Updating workflow.yaml files for multi-scope support\n'));

  if (dryRun) {
    console.log(chalk.yellow('DRY RUN MODE - No changes will be made\n'));
  }

  // Find all workflow files
  console.log(chalk.blue('Scanning for workflow.yaml files...'));
  const files = await findWorkflowFiles(SRC_PATH);
  console.log(chalk.green(`Found ${files.length} workflow.yaml files\n`));

  // Analysis results
  const results = {
    analyzed: 0,
    alreadyScoped: 0,
    migrated: 0,
    noChanges: 0,
    errors: [],
  };

  // Process each file
  for (const filePath of files) {
    const relativePath = path.relative(SRC_PATH, filePath);
    results.analyzed++;

    try {
      const content = await fs.readFile(filePath, 'utf8');
      const analysis = analyzeWorkflow(content, filePath);

      if (analysis.alreadyScoped) {
        results.alreadyScoped++;
        if (verbose) {
          console.log(chalk.dim(`  ○ ${relativePath} - already scope-aware`));
        }
        continue;
      }

      if (!analysis.needsMigration) {
        results.noChanges++;
        if (verbose) {
          console.log(chalk.dim(`  ○ ${relativePath} - no changes needed`));
        }
        continue;
      }

      // Apply migration
      const { content: migrated, changes } = migrateWorkflow(content);

      if (changes.length > 0) {
        console.log(chalk.cyan(`  ● ${relativePath}`));
        for (const change of changes) {
          console.log(chalk.dim(`      → ${change}`));
        }

        if (!dryRun) {
          await fs.writeFile(filePath, migrated, 'utf8');
        }
        results.migrated++;
      } else {
        results.noChanges++;
      }
    } catch (error) {
      results.errors.push({ file: relativePath, error: error.message });
      console.log(chalk.red(`  ✗ ${relativePath} - Error: ${error.message}`));
    }
  }

  // Print summary
  console.log(chalk.bold('\n─────────────────────────────────────'));
  console.log(chalk.bold('Summary'));
  console.log(chalk.dim('─────────────────────────────────────'));
  console.log(`  Files analyzed:     ${results.analyzed}`);
  console.log(`  Already scope-aware: ${results.alreadyScoped}`);
  console.log(`  Migrated:           ${results.migrated}`);
  console.log(`  No changes needed:  ${results.noChanges}`);
  if (results.errors.length > 0) {
    console.log(chalk.red(`  Errors:             ${results.errors.length}`));
  }
  console.log();

  if (dryRun && results.migrated > 0) {
    console.log(chalk.yellow('Run without --dry-run to apply changes\n'));
  }

  // Exit with error code if there were errors
  process.exit(results.errors.length > 0 ? 1 : 0);
}

// Run
main().catch((error) => {
  console.error(chalk.red('Fatal error:'), error.message);
  process.exit(1);
});
